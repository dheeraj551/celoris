import { NextRequest, NextResponse } from 'next/server';
import { createHiggsfieldClient } from '@higgsfield/client/v2';
import { HiggsfieldClient as HiggsfieldV1Client } from '@higgsfield/client';
import { createRouteClient } from '@/lib/supabase-server';
import { createSupabaseClientForServer } from '@/lib/supabase-client';
import { zaiChatCompletion, isZaiConfigured } from '@/lib/zai';

// ViO Studio — Higgsfield "Marketing Studio Image" generation.
//
// Sept 2026 fixes (it "worked" but never produced an image):
//  - No maxDuration was set, so on Vercel the function could be cut off
//    long before a 2K Marketing Studio render finished.
//  - Every failure was swallowed: the route answered success:true with the
//    DEMO product photo, and the page then showed that stock photo as if it
//    were the result. Now a real failure comes back as a real error.
//  - Uploaded product / avatar photos arrive as data: URLs and were silently
//    dropped (only http links were passed on), so Higgsfield never saw your
//    product. They're now uploaded to Higgsfield first, same as PhotoLite.
//  - The route was open to anyone (even logged-out) — i.e. anyone could
//    spend the Higgsfield credits. It now requires a signed-in user with at
//    least 2,000 credits in their wallet (same Pro rule as PhotoLite's AI
//    image generation). The balance is read on the server only.
//  - Ad copy used Gemini 1.5 Flash (retired); it now uses the site's
//    existing Z.ai integration, with a plain fallback if that's unavailable.

export const runtime = 'nodejs';
export const maxDuration = 120;

const PRO_REQUIRED_CREDITS = 2000;

/**
 * Reads the wallet balance with the service-role client. `users` is the
 * canonical table (see AuthProvider); `profiles` is only a fallback for
 * accounts without a `users` row. Never trusts anything the browser sends.
 */
async function getWalletBalance(userId: string): Promise<number | null> {
  const admin = createSupabaseClientForServer();
  const { data: userRow, error: userErr } = await admin
    .from('users')
    .select('wallet_balance')
    .eq('id', userId)
    .maybeSingle();
  if (!userErr && userRow && userRow.wallet_balance !== null && userRow.wallet_balance !== undefined) {
    return Number(userRow.wallet_balance) || 0;
  }
  const { data: profileRow, error: profileErr } = await admin
    .from('profiles')
    .select('wallet_balance')
    .eq('id', userId)
    .maybeSingle();
  if (!profileErr && profileRow) return Number(profileRow.wallet_balance) || 0;
  if (userErr || profileErr) return null; // couldn't read — caller refuses
  return 0;
}

interface HiggsfieldCreds {
  keyId: string;
  keySecret: string;
}

function getHiggsfieldCredentials(): HiggsfieldCreds | null {
  const combined = process.env.HF_CREDENTIALS || process.env.HIGGSFIELD_CREDENTIALS || process.env.HF_KEY;

  if (combined) {
    let clean = combined.trim();
    if ((clean.startsWith('"') && clean.endsWith('"')) || (clean.startsWith("'") && clean.endsWith("'"))) {
      clean = clean.slice(1, -1).trim();
    }
    if (clean.toLowerCase().startsWith('hf_credentials=')) clean = clean.slice('hf_credentials='.length).trim();
    if (clean.startsWith('Key ') || clean.startsWith('key ')) clean = clean.slice(4).trim();

    const colonIdx = clean.indexOf(':');
    if (colonIdx > 0 && colonIdx < clean.length - 1) {
      const keyId = clean.slice(0, colonIdx).trim();
      const keySecret = clean.slice(colonIdx + 1).trim();
      if (keyId && keySecret) return { keyId, keySecret };
    }
  }

  const keyId = process.env.HIGGSFIELD_KEY_ID || process.env.HF_API_KEY;
  const keySecret = process.env.HIGGSFIELD_KEY_SECRET || process.env.HF_API_SECRET;
  if (keyId && keySecret) return { keyId: keyId.trim(), keySecret: keySecret.trim() };
  return null;
}

function normalizeMarketingStudioAspectRatio(ratio: string): string {
  const allowed = new Set(['auto', '1:1', '3:2', '2:3', '4:3', '3:4', '16:9', '9:16', '21:9']);
  if (allowed.has(ratio)) return ratio;
  if (ratio === '4:5') return '3:4';
  return '3:4';
}

/** Covers every response shape Higgsfield returns (v2 images[], JobSet jobs[], output{}, url). */
function extractImageUrl(result: any): string | null {
  if (!result) return null;
  const firstUrl = (arr: any) => {
    if (!Array.isArray(arr) || arr.length === 0) return null;
    const first = arr[0];
    if (typeof first === 'string') return first;
    return first?.url || null;
  };
  return (
    firstUrl(result.images) ||
    result.jobs?.[0]?.results?.raw?.url ||
    result.jobs?.[0]?.results?.min?.url ||
    firstUrl(result.output?.images) ||
    result.output?.url ||
    result.output?.image?.url ||
    result.image?.url ||
    (typeof result.url === 'string' ? result.url : null)
  );
}

class GenerationError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

function classify(err: any): 'auth' | 'account' | 'moderation' | 'other' {
  const msg = String(err?.message || '');
  if (err?.name === 'AuthenticationError' || err?.statusCode === 401 || /invalid (api )?credentials/i.test(msg)) return 'auth';
  if (err?.name === 'AccountError' || err?.statusCode === 402 || err?.statusCode === 403 || /credit|not entitled|not enabled|not allowed/i.test(msg)) return 'account';
  if (/nsfw|moderation|safety/i.test(msg)) return 'moderation';
  return 'other';
}

function toUserError(err: any): GenerationError {
  switch (classify(err)) {
    case 'auth':
      return new GenerationError('Higgsfield rejected the API key. Check HF_CREDENTIALS in your Vercel environment settings.', 502);
    case 'account':
      return new GenerationError(
        'Higgsfield refused the request — the account is out of credits or isn\'t enabled for Marketing Studio Image. Check your Higgsfield dashboard.',
        402
      );
    case 'moderation':
      return new GenerationError('Higgsfield\'s safety filter blocked this prompt or image. Try rewording the prompt or using a different photo.', 422);
    default:
      return new GenerationError(`Higgsfield couldn't generate the image: ${String(err?.message || 'unknown error').slice(0, 300)}`, 502);
  }
}

/** Uploaded product/avatar photos come in as data: URLs — put them on Higgsfield's CDN first. */
async function toPublicImageUrl(value: unknown, creds: HiggsfieldCreds): Promise<string | null> {
  if (typeof value !== 'string' || !value) return null;
  if (/^https:\/\//i.test(value)) return value;
  const match = value.match(/^data:image\/(png|jpe?g|webp);base64,(.+)$/i);
  if (!match) return null;
  const format = (match[1].toLowerCase().startsWith('jp') ? 'jpeg' : match[1].toLowerCase()) as 'png' | 'jpeg' | 'webp';
  const buffer = Buffer.from(match[2], 'base64');
  if (buffer.length > 12 * 1024 * 1024) throw new GenerationError('That photo is too large (max 12 MB).', 413);
  const v1 = new HiggsfieldV1Client({ apiKey: creds.keyId, apiSecret: creds.keySecret });
  return await v1.uploadImage(buffer, format);
}

async function pollRestRequest(authHeader: string, initialData: any): Promise<string | null> {
  const directUrl = extractImageUrl(initialData);
  if (directUrl && (initialData.status === 'completed' || !initialData.request_id)) return directUrl;

  const requestId = initialData.request_id;
  if (!requestId) return null;

  const pollUrl = `https://api.higgsfield.ai/requests/${requestId}/status`;
  const start = Date.now();
  while (Date.now() - start < 95_000) {
    await new Promise((r) => setTimeout(r, 2500));
    const res = await fetch(pollUrl, {
      headers: { Authorization: authHeader, 'User-Agent': 'higgsfield-server-js/2.0' },
    }).catch(() => null);
    if (!res?.ok) continue;
    const data = await res.json().catch(() => null);
    if (!data) continue;
    if (data.status === 'completed') return extractImageUrl(data);
    if (data.status === 'failed') throw new Error('Higgsfield reported the generation as failed.');
    if (data.status === 'nsfw') throw new Error('Higgsfield safety filter (nsfw) blocked this request.');
  }
  throw new Error('Timed out waiting for Higgsfield to finish the image.');
}

async function generateImage(creds: HiggsfieldCreds, input: any): Promise<string> {
  let sdkError: any = null;

  // 1. Official SDK
  try {
    const client = createHiggsfieldClient({ credentials: `${creds.keyId}:${creds.keySecret}` });
    const response: any = await client.subscribe('marketing-studio/image', { input, withPolling: true });
    if (response?.status === 'nsfw') throw new Error('Higgsfield safety filter (nsfw) blocked this request.');
    if (response?.status === 'failed') throw new Error('Higgsfield reported the generation as failed.');
    const url = extractImageUrl(response);
    if (url) return url;
    console.warn('[ViO Studio] SDK finished without an image URL. Response keys:', Object.keys(response || {}));
    sdkError = new Error('Higgsfield finished but returned no image.');
  } catch (err: any) {
    console.warn('[ViO Studio] SDK attempt failed:', err?.name, err?.statusCode, err?.message);
    const kind = classify(err);
    if (kind === 'auth' || kind === 'moderation') throw err;
    sdkError = err;
  }

  // 2. Direct REST (in case the SDK itself is the problem)
  const authHeader = `Key ${creds.keyId}:${creds.keySecret}`;
  const res = await fetch('https://api.higgsfield.ai/marketing-studio/image', {
    method: 'POST',
    headers: { Authorization: authHeader, 'Content-Type': 'application/json', 'User-Agent': 'higgsfield-server-js/2.0' },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    console.warn('[ViO Studio] REST attempt failed:', res.status, text.slice(0, 500));
    const err: any = new Error(`Higgsfield API error ${res.status}: ${text.slice(0, 200)}`);
    err.statusCode = res.status;
    throw classify(err) === 'other' && sdkError ? sdkError : err;
  }
  const data = await res.json();
  const url = await pollRestRequest(authHeader, data);
  if (url) return url;
  throw sdkError || new Error('Higgsfield finished but returned no image.');
}

async function writeAdCopy(productName: string, stylePreset: string, prompt: string) {
  const fallback = {
    headline: `MEET ${productName || 'YOUR PRODUCT'}`.toUpperCase().slice(0, 60),
    tagline: 'Made to stand out.',
    badgeText: 'NEW',
    ctaText: 'SHOP NOW',
    adCopy: `Say hello to ${productName || 'our latest drop'}. Tap below to get yours.`,
    hashtags: [`#${(productName || 'Product').replace(/[^\w]/g, '')}`, '#ViOStudio', '#NewDrop'],
  };
  if (!isZaiConfigured()) return fallback;
  try {
    const message = await zaiChatCompletion({
      messages: [
        {
          role: 'system',
          content:
            'You are a senior ad copywriter. Reply with ONLY a JSON object with keys: headline (max 6 words, all caps), tagline (max 10 words), badgeText (2-3 words, all caps), ctaText (2-3 words, all caps), adCopy (2-3 sentences for Instagram/Reels), hashtags (array of 5 strings starting with #). No markdown.',
        },
        {
          role: 'user',
          content: `Product: ${productName || 'Product'}\nStyle: ${stylePreset || 'Marketing Studio Image'}\nBrief: ${prompt}`,
        },
      ],
      max_tokens: 400,
      temperature: 0.8,
    });
    const text = String(message?.content || '').replace(/```json|```/g, '').trim();
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    const parsed = JSON.parse(text.slice(start, end + 1));
    return {
      headline: typeof parsed.headline === 'string' ? parsed.headline : fallback.headline,
      tagline: typeof parsed.tagline === 'string' ? parsed.tagline : fallback.tagline,
      badgeText: typeof parsed.badgeText === 'string' ? parsed.badgeText : fallback.badgeText,
      ctaText: typeof parsed.ctaText === 'string' ? parsed.ctaText : fallback.ctaText,
      adCopy: typeof parsed.adCopy === 'string' ? parsed.adCopy : fallback.adCopy,
      hashtags: Array.isArray(parsed.hashtags) ? parsed.hashtags.filter((h: any) => typeof h === 'string').slice(0, 8) : fallback.hashtags,
    };
  } catch (err) {
    console.warn('[ViO Studio] Ad copy generation failed, using fallback:', err);
    return fallback;
  }
}

export async function POST(req: NextRequest) {
  try {
    const routeClient = await createRouteClient();
    const {
      data: { user },
    } = await routeClient.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Please sign in to use ViO Studio.' }, { status: 401 });
    }

    // Pro gate: at least 2,000 credits in the wallet (checked, not deducted).
    const balance = await getWalletBalance(user.id);
    if (balance === null) {
      return NextResponse.json({ error: 'Couldn\'t check your credit balance right now. Please try again.' }, { status: 503 });
    }
    if (balance < PRO_REQUIRED_CREDITS) {
      return NextResponse.json(
        {
          error: `ViO Studio is a Pro feature that needs at least ${PRO_REQUIRED_CREDITS.toLocaleString('en-IN')} credits in your wallet. Your balance is ${balance.toLocaleString('en-IN')} credits — please recharge to unlock it.`,
          currentBalance: balance,
          requiredCredits: PRO_REQUIRED_CREDITS,
        },
        { status: 403 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const prompt = typeof body.prompt === 'string' ? body.prompt.trim().slice(0, 2000) : '';
    const productName = typeof body.productName === 'string' ? body.productName.slice(0, 120) : '';
    const stylePreset = typeof body.stylePreset === 'string' ? body.stylePreset.slice(0, 80) : 'Marketing Studio Image';
    const angle = typeof body.angle === 'string' ? body.angle.slice(0, 40) : 'Closeup';
    const aspectRatio = typeof body.aspectRatio === 'string' ? body.aspectRatio : '3:4';

    if (!prompt) {
      return NextResponse.json({ error: 'Write a prompt describing the ad you want.' }, { status: 400 });
    }

    const creds = getHiggsfieldCredentials();
    if (!creds) {
      console.error('[ViO Studio] HF_CREDENTIALS is not set in this environment.');
      return NextResponse.json(
        { error: 'Image generation isn\'t configured on the server (HF_CREDENTIALS is missing).' },
        { status: 500 }
      );
    }

    const imageUrls: string[] = [];
    for (const candidate of [body.productImageUrl, body.avatarUrl]) {
      try {
        const url = await toPublicImageUrl(candidate, creds);
        if (url) imageUrls.push(url);
      } catch (err: any) {
        if (err instanceof GenerationError) return NextResponse.json({ error: err.message }, { status: err.status });
        console.warn('[ViO Studio] Reference image upload failed:', err?.message);
        return NextResponse.json({ error: 'Couldn\'t upload your product/avatar photo to Higgsfield. Try a smaller JPG or PNG.' }, { status: 502 });
      }
    }

    const input: any = {
      prompt: `${prompt}. Style: ${stylePreset}. Camera angle: ${angle}. Professional commercial lighting, high-converting advertisement.`,
      aspect_ratio: normalizeMarketingStudioAspectRatio(aspectRatio),
      resolution: '2k',
      quality: 'high',
    };
    if (imageUrls.length) input.image_urls = imageUrls;

    console.log('[ViO Studio] Generating for user', user.id, '| refs:', imageUrls.length, '| ratio:', input.aspect_ratio);

    const [imageResult, copy] = await Promise.all([
      generateImage(creds, input).then(
        (url) => ({ url, error: null as GenerationError | null }),
        (err) => ({ url: null as string | null, error: err instanceof GenerationError ? err : toUserError(err) })
      ),
      writeAdCopy(productName, stylePreset, prompt),
    ]);

    if (!imageResult.url) {
      const e = imageResult.error!;
      console.error('[ViO Studio] Generation failed:', e.message);
      return NextResponse.json({ error: e.message }, { status: e.status });
    }

    console.log('[ViO Studio] Generated:', imageResult.url);
    return NextResponse.json({
      success: true,
      imageUrl: imageResult.url,
      isHiggsfieldGenerated: true,
      usedModel: 'higgsfield/marketing-studio-image',
      ...copy,
    });
  } catch (error: any) {
    console.error('[ViO Studio] Unexpected error:', error);
    return NextResponse.json({ error: error?.message || 'Failed to generate creative' }, { status: 500 });
  }
}
