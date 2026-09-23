import { NextRequest, NextResponse } from 'next/server';
import { createHiggsfieldClient } from '@higgsfield/client/v2';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface HiggsfieldCreds {
  keyId: string;
  keySecret: string;
  raw: string;
}

function getHiggsfieldCredentials(): HiggsfieldCreds | null {
  const combined =
    process.env.HF_CREDENTIALS ||
    process.env.HIGGSFIELD_CREDENTIALS ||
    process.env.HF_KEY;

  if (combined) {
    let clean = combined.trim();
    if (
      (clean.startsWith('"') && clean.endsWith('"')) ||
      (clean.startsWith("'") && clean.endsWith("'"))
    ) {
      clean = clean.slice(1, -1).trim();
    }
    if (clean.toLowerCase().startsWith('hf_credentials=')) {
      clean = clean.slice('hf_credentials='.length).trim();
    }
    if (clean.startsWith('Key ') || clean.startsWith('key ')) {
      clean = clean.slice(4).trim();
    }

    const colonIdx = clean.indexOf(':');
    if (colonIdx > 0 && colonIdx < clean.length - 1) {
      const keyId = clean.slice(0, colonIdx).trim();
      const keySecret = clean.slice(colonIdx + 1).trim();
      if (keyId && keySecret) {
        return { keyId, keySecret, raw: `${keyId}:${keySecret}` };
      }
    }
  }

  const keyId = process.env.HIGGSFIELD_KEY_ID || process.env.HF_API_KEY;
  const keySecret = process.env.HIGGSFIELD_KEY_SECRET || process.env.HF_API_SECRET;
  if (keyId && keySecret) {
    return {
      keyId: keyId.trim(),
      keySecret: keySecret.trim(),
      raw: `${keyId.trim()}:${keySecret.trim()}`,
    };
  }

  return null;
}

function normalizeMarketingStudioAspectRatio(ratio: string): string {
  const allowed = new Set(['auto', '1:1', '3:2', '2:3', '4:3', '3:4', '16:9', '9:16', '21:9']);
  if (allowed.has(ratio)) return ratio;
  if (ratio === '4:5') return '3:4';
  return '3:4';
}

function extractImageUrl(result: any): string | null {
  if (!result) return null;
  if (result.images && Array.isArray(result.images) && result.images.length > 0) {
    const first = result.images[0];
    if (typeof first === 'string') return first;
    if (first?.url) return first.url;
  }
  if (result.output && typeof result.output === 'object') {
    if (result.output.images && Array.isArray(result.output.images) && result.output.images.length > 0) {
      const first = result.output.images[0];
      if (typeof first === 'string') return first;
      if (first?.url) return first.url;
    }
    if (result.output.url) return result.output.url;
    if (result.output.image?.url) return result.output.image.url;
  }
  if (result.image && typeof result.image === 'object') {
    if (result.image.url) return result.image.url;
  }
  if (result.url && typeof result.url === 'string') {
    return result.url;
  }
  return null;
}

async function pollRestRequest(authHeader: string, initialData: any): Promise<string | null> {
  const directUrl = extractImageUrl(initialData);
  if (directUrl && initialData.status === 'completed') {
    return directUrl;
  }

  const requestId = initialData.request_id;
  if (!requestId) return null;

  const pollUrl = `https://api.higgsfield.ai/requests/${requestId}/status`;
  const maxPollTimeMs = 90000;
  const pollIntervalMs = 2500;
  const start = Date.now();

  while (Date.now() - start < maxPollTimeMs) {
    await new Promise((r) => setTimeout(r, pollIntervalMs));
    try {
      const res = await fetch(pollUrl, {
        headers: {
          Authorization: authHeader,
          'User-Agent': 'higgsfield-server-js/2.0',
        },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.status === 'completed') {
          return extractImageUrl(data);
        }
        if (data.status === 'failed') {
          throw new Error('Higgsfield AI generation failed on the server.');
        }
      }
    } catch (e: any) {
      if (e?.message?.includes('failed')) throw e;
    }
  }
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const {
      prompt,
      productName,
      productImageUrl,
      avatarUrl,
      stylePreset,
      aspectRatio = '3:4',
      angle = 'Closeup',
    } = await req.json();

    console.log('[ViO Studio] Generating marketing creative with Higgsfield Marketing Studio Image...');
    console.log('[ViO Studio] Prompt:', prompt, 'Product:', productName, 'Style:', stylePreset);

    let generatedImageUrl: string | null = null;
    let usedModel = 'higgsfield/marketing-studio-image';

    // 1. Higgsfield (Hexfield) API Call
    const creds = getHiggsfieldCredentials();

    if (creds) {
      const enhancedPrompt = `${prompt || 'Commercial product ad photography'}, style of ${stylePreset || 'Marketing Studio Image'}, camera angle ${angle || 'Closeup'}, professional commercial lighting, 8k resolution, raytraced reflections, high-converting advertisement aesthetic.`;

      const input: any = {
        prompt: enhancedPrompt,
        aspect_ratio: normalizeMarketingStudioAspectRatio(aspectRatio),
        resolution: '2k',
        quality: 'high',
      };

      // If remote image URLs exist (must start with http/https)
      const validImages: string[] = [];
      if (productImageUrl && productImageUrl.startsWith('http')) {
        validImages.push(productImageUrl);
      }
      if (avatarUrl && avatarUrl.startsWith('http')) {
        validImages.push(avatarUrl);
      }
      if (validImages.length > 0) {
        input.image_urls = validImages;
      }

      // Try Higgsfield SDK V2
      try {
        const v2Client = createHiggsfieldClient({
          credentials: `${creds.keyId}:${creds.keySecret}`,
        });

        console.log('[ViO Studio] Calling v2Client.subscribe("marketing-studio/image")...');
        const response = await v2Client.subscribe('marketing-studio/image', {
          input,
          withPolling: true,
        });

        const url = extractImageUrl(response);
        if (url) {
          generatedImageUrl = url;
          usedModel = 'higgsfield/marketing-studio-image';
          console.log('[ViO Studio] Higgsfield Marketing Studio generated successfully:', url);
        }
      } catch (sdkError: any) {
        console.warn('[ViO Studio] Higgsfield SDK call failed, attempting direct REST fallback:', sdkError?.message);

        // Fallback: Direct REST call to https://api.higgsfield.ai/marketing-studio/image
        try {
          const authHeader = `Key ${creds.keyId}:${creds.keySecret}`;
          const res = await fetch('https://api.higgsfield.ai/marketing-studio/image', {
            method: 'POST',
            headers: {
              Authorization: authHeader,
              'Content-Type': 'application/json',
              'User-Agent': 'higgsfield-server-js/2.0',
            },
            body: JSON.stringify(input),
          });

          if (res.ok) {
            const data = await res.json();
            const restUrl = await pollRestRequest(authHeader, data);
            if (restUrl) {
              generatedImageUrl = restUrl;
              usedModel = 'higgsfield/marketing-studio-image (REST)';
              console.log('[ViO Studio] Higgsfield REST generated successfully:', restUrl);
            }
          } else {
            console.warn('[ViO Studio] Higgsfield REST status:', res.status, await res.text().catch(() => ''));
          }
        } catch (restErr: any) {
          console.warn('[ViO Studio] Higgsfield REST fallback error:', restErr?.message);
        }
      }
    } else {
      console.warn('[ViO Studio] HF_CREDENTIALS not configured in environment.');
    }

    // 2. AI Copywriting Generation (Gemini or heuristic)
    let copyData = {
      headline: `UNLEASH THE VIBE OF ${productName || 'YOUR PRODUCT'}`.toUpperCase(),
      tagline: 'High-converting commercial creative crafted for modern taste-makers.',
      badgeText: 'TRY NOW',
      ctaText: 'ORDER TODAY',
      adCopy: `Discover why creators and customers can't stop talking about ${productName || 'our latest drop'}. Crisp, vibrant, and engineered with premium quality for taste-makers who demand the best. Tap below to claim yours today!`,
      hashtags: [
        `#${(productName || 'Product').replace(/\s+/g, '')}`,
        '#ViOStudio',
        '#CommercialCreative',
        '#ReadyToPost',
        '#MarketingDrop',
      ],
    };

    const googleKey = process.env.GOOGLE_API_KEY;
    if (googleKey) {
      try {
        const genAI = new GoogleGenerativeAI(googleKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const systemPrompt = `You are a world-class creative marketing director at ViO Studio.
Given a product name: "${productName || 'Product'}", style preset: "${stylePreset || 'Marketing Studio Image'}", and user prompt: "${prompt}".
Generate an impactful JSON response with:
- "headline": Short punchy all-caps headline (max 5-6 words)
- "tagline": Supporting high-impact slogan (max 10 words)
- "badgeText": 2-3 word sticker badge (e.g. "TRY NOW", "ZERO SUGAR", "50% OFF", "LIMITED DROP")
- "ctaText": Button CTA (e.g. "ORDER TODAY", "GET YOURS", "CLAIM OFFER")
- "adCopy": 2-3 sentence high-converting social media caption for Instagram & TikTok ads
- "hashtags": array of 5 targeted hashtags starting with #

Output strictly JSON only. No markdown formatting.`;

        const result = await model.generateContent(systemPrompt);
        const text = result.response.text();
        const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleanJson);
        copyData = { ...copyData, ...parsed };
      } catch (geminiError) {
        console.warn('[ViO Studio] Gemini copy generation fallback:', geminiError);
      }
    }

    return NextResponse.json({
      success: true,
      imageUrl: generatedImageUrl || productImageUrl,
      isHiggsfieldGenerated: !!generatedImageUrl,
      usedModel,
      ...copyData,
    });
  } catch (error: any) {
    console.error('[ViO Studio] Error in generate route:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to generate creative' },
      { status: 500 }
    );
  }
}
