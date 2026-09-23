import { NextResponse } from 'next/server'
import { createHiggsfieldClient } from '@higgsfield/client/v2'
import { HiggsfieldClient as HiggsfieldV1Client } from '@higgsfield/client'
import { createRouteClient } from '@/lib/supabase-server'
import { createSupabaseClientForServer } from '@/lib/supabase-client'

export const runtime = 'nodejs'
export const maxDuration = 120

// PhotoLite AI Image Generation Route powered by Higgsfield AI API
// Frontend call site: components/photolite/components/Modals/AIImageModal.tsx

const PRO_REQUIRED_CREDITS = 2000
const GENERATION_CREDIT_COST = 100

interface HiggsfieldCreds {
    keyId: string
    keySecret: string
    raw: string
}

/**
 * Sanitizes credential string from common paste formats (quotes, HF_CREDENTIALS= prefix, Key prefix, whitespace)
 */
function cleanCredentialString(str: string): string {
    let clean = str.trim()
    // Strip wrapping quotes if present
    if (
        (clean.startsWith('"') && clean.endsWith('"')) ||
        (clean.startsWith("'") && clean.endsWith("'"))
    ) {
        clean = clean.slice(1, -1).trim()
    }
    // Strip accidental "HF_CREDENTIALS=" prefix if pasted with variable name
    if (clean.toLowerCase().startsWith('hf_credentials=')) {
        clean = clean.slice('hf_credentials='.length).trim()
    }
    // Strip "Key " prefix if pasted with Authorization header
    if (clean.startsWith('Key ') || clean.startsWith('key ')) {
        clean = clean.slice(4).trim()
    }
    // Strip wrapping quotes again in case it was HF_CREDENTIALS="..."
    if (
        (clean.startsWith('"') && clean.endsWith('"')) ||
        (clean.startsWith("'") && clean.endsWith("'"))
    ) {
        clean = clean.slice(1, -1).trim()
    }
    return clean
}

/**
 * Resolves Higgsfield credentials prioritizing the official documentation format:
 * 1. HF_CREDENTIALS="your-api-key-id:your-api-key-secret" (Official Higgsfield SDK format)
 * 2. Separate variables: HIGGSFIELD_KEY_ID + HIGGSFIELD_KEY_SECRET or HF_API_KEY + HF_API_SECRET
 */
function getHiggsfieldCredentials(): HiggsfieldCreds | null {
    // 1. Primary official format as documented: HF_CREDENTIALS="your-api-key-id:your-api-key-secret"
    const combined =
        process.env.HF_CREDENTIALS ||
        process.env.HIGGSFIELD_CREDENTIALS ||
        process.env.HF_KEY

    if (combined) {
        const cleaned = cleanCredentialString(combined)
        const colonIdx = cleaned.indexOf(':')
        if (colonIdx > 0 && colonIdx < cleaned.length - 1) {
            const keyId = cleaned.slice(0, colonIdx).trim()
            const keySecret = cleaned.slice(colonIdx + 1).trim()
            if (keyId && keySecret) {
                const raw = `${keyId}:${keySecret}`
                if (!process.env.HF_CREDENTIALS) {
                    process.env.HF_CREDENTIALS = raw
                }
                return { keyId, keySecret, raw }
            }
        }
    }

    // 2. Separate variables format (backwards compatibility)
    const keyId =
        process.env.HIGGSFIELD_KEY_ID ||
        process.env.HF_KEY_ID ||
        process.env.HF_API_KEY

    const keySecret =
        process.env.HIGGSFIELD_KEY_SECRET ||
        process.env.HF_KEY_SECRET ||
        process.env.HF_API_SECRET

    if (keyId && keySecret) {
        const cleanId = cleanCredentialString(keyId)
        const cleanSecret = cleanCredentialString(keySecret)
        if (cleanId && cleanSecret && !cleanId.includes(':')) {
            const raw = `${cleanId}:${cleanSecret}`
            if (!process.env.HF_CREDENTIALS) {
                process.env.HF_CREDENTIALS = raw
            }
            return { keyId: cleanId, keySecret: cleanSecret, raw }
        }
    }

    // 3. Fallback: single HIGGSFIELD_API_KEY with colon
    const singleKey = process.env.HIGGSFIELD_API_KEY
    if (singleKey && singleKey.includes(':')) {
        const cleaned = cleanCredentialString(singleKey)
        const colonIdx = cleaned.indexOf(':')
        if (colonIdx > 0 && colonIdx < cleaned.length - 1) {
            const kId = cleaned.slice(0, colonIdx).trim()
            const kSec = cleaned.slice(colonIdx + 1).trim()
            const raw = `${kId}:${kSec}`
            if (!process.env.HF_CREDENTIALS) {
                process.env.HF_CREDENTIALS = raw
            }
            return { keyId: kId, keySecret: kSec, raw }
        }
    }

    return null
}

/**
 * Soul v2's documented request body is { prompt, aspect_ratio, resolution,
 * style_id, batch_size, enhance_prompt, seed } — there is no "width_and_height"
 * or "quality" field (see docs.higgsfield.ai/docs/models/soul-2/generate.md).
 * This normalizes PhotoLite's aspect ratio string into Soul v2's allowed
 * aspect_ratio enum: 9:16, 16:9, 4:3, 3:4, 1:1, 2:3, 3:2.
 */
function normalizeSoulAspectRatio(ratio: string): string {
    const allowed = new Set(['9:16', '16:9', '4:3', '3:4', '1:1', '2:3', '3:2'])
    return allowed.has(ratio) ? ratio : '4:3'
}

/**
 * The user's Higgsfield account may only be entitled to a specific subset of
 * models chosen at signup ("they ask me to choose three models") — for this
 * account that appears to be "Marketing Studio Image", a model separate from
 * Soul v2 with its own endpoint and request schema (verified against
 * docs.higgsfield.ai/docs/models/marketing-studio-image):
 *   POST https://api.higgsfield.ai/marketing-studio/image
 *   { prompt, image_urls?: string[], resolution: '1k'|'2k'|'4k',
 *     aspect_ratio: 'auto'|'1:1'|'3:2'|'2:3'|'4:3'|'3:4'|'16:9'|'9:16'|'21:9',
 *     quality: 'low'|'medium'|'high', enhanced?: boolean, preset_id?: string }
 * Note this endpoint takes a plural `image_urls` ARRAY, unlike Soul v2's
 * (unverified) flat `image_url` field.
 */
function normalizeMarketingStudioAspectRatio(ratio: string): string {
    const allowed = new Set(['auto', '1:1', '3:2', '2:3', '4:3', '3:4', '16:9', '9:16', '21:9'])
    return allowed.has(ratio) ? ratio : 'auto'
}

/**
 * Classifies a Higgsfield error so callers can distinguish "this API key isn't
 * entitled to this particular model" (try the next model in the priority list)
 * from "the credentials themselves are wrong" (fatal — no point trying other
 * models) from any other error (record and keep trying, since it might just be
 * this specific model/request that's the problem).
 */
function classifyHiggsfieldError(err: any): 'auth' | 'not_entitled' | 'other' {
    if (
        err?.name === 'AuthenticationError' ||
        err?.statusCode === 401 ||
        err?.message?.includes('Invalid API credentials') ||
        err?.message?.includes('Invalid credentials')
    ) {
        return 'auth'
    }
    if (
        err?.name === 'AccountError' ||
        err?.statusCode === 403 ||
        err?.statusCode === 402 ||
        err?.message?.includes('credits') ||
        err?.message?.includes('not entitled') ||
        err?.message?.includes('not enabled') ||
        err?.message?.includes('not allowed')
    ) {
        return 'not_entitled'
    }
    return 'other'
}

/**
 * Extracts the image URL from various Higgsfield response schemas (V2Response or JobSet)
 */
function extractImageUrl(result: any): string | null {
    if (!result) return null

    // V2 images array: [{ url: "https://..." }]
    if (Array.isArray(result.images) && result.images.length > 0 && result.images[0]?.url) {
        return result.images[0].url
    }

    // JobSet jobs array: [{ results: { raw: { url: "https://..." } } }]
    if (Array.isArray(result.jobs) && result.jobs.length > 0) {
        const rawUrl = result.jobs[0]?.results?.raw?.url || result.jobs[0]?.results?.min?.url
        if (rawUrl) return rawUrl
    }

    if (result.image?.url && typeof result.image.url === 'string') {
        return result.image.url
    }

    if (result.url && typeof result.url === 'string') {
        return result.url
    }

    return null
}

/**
 * Converts a remote URL to a base64 Data URL on the server.
 * This completely avoids HTML5 Canvas CORS / tainted canvas issues in the browser.
 */
async function toDataUrlSafe(remoteUrl: string): Promise<string> {
    if (!remoteUrl || remoteUrl.startsWith('data:')) return remoteUrl
    try {
        const res = await fetch(remoteUrl)
        if (res.ok) {
            const contentType = res.headers.get('content-type') || 'image/png'
            const arrayBuffer = await res.arrayBuffer()
            const base64 = Buffer.from(arrayBuffer).toString('base64')
            return `data:${contentType};base64,${base64}`
        }
    } catch (fetchErr) {
        console.warn('Could not pre-convert remote image to base64 data URL, returning original URL:', fetchErr)
    }
    return remoteUrl
}

/**
 * REST status polling for Higgsfield background jobs
 */
async function pollRestRequest(authHeader: string, initialData: any): Promise<string | null> {
    const directUrl = extractImageUrl(initialData)
    if (directUrl && initialData.status === 'completed') {
        return directUrl
    }

    const requestId = initialData.request_id
    if (!requestId) return null

    const pollUrl = `https://api.higgsfield.ai/requests/${requestId}/status`
    const maxPollTimeMs = 90000 // 90 seconds
    const pollIntervalMs = 2000
    const start = Date.now()

    while (Date.now() - start < maxPollTimeMs) {
        await new Promise((r) => setTimeout(r, pollIntervalMs))
        try {
            const res = await fetch(pollUrl, {
                headers: {
                    Authorization: authHeader,
                    'User-Agent': 'higgsfield-server-js/2.0',
                },
            })
            if (res.ok) {
                const data = await res.json()
                if (data.status === 'completed') {
                    return extractImageUrl(data)
                }
                if (data.status === 'failed') {
                    throw new Error('Higgsfield AI generation failed on the server.')
                }
                if (data.status === 'nsfw') {
                    throw new Error('Higgsfield AI flagged content with safety filter (NSFW).')
                }
            }
        } catch (e: any) {
            if (e?.message?.includes('Higgsfield AI')) throw e
        }
    }
    return null
}

/**
 * Direct REST call to the Marketing Studio Image endpoint
 * (https://docs.higgsfield.ai/docs/models/marketing-studio-image). Uses
 * "direct mode" (enhanced: false / omitted) — no preset_id required, since
 * PhotoLite doesn't currently expose Marketing Studio's preset picker. Direct
 * mode just needs a prompt plus, optionally, up to 16 reference image URLs.
 */
async function generateViaMarketingStudioRest(
    creds: HiggsfieldCreds,
    prompt: string,
    aspectRatio: string,
    publicImageUrl?: string | null
): Promise<{ imageUrl: string; model: string }> {
    const authHeader = `Key ${creds.keyId}:${creds.keySecret}`

    const body: any = {
        prompt,
        aspect_ratio: normalizeMarketingStudioAspectRatio(aspectRatio),
        resolution: '2k',
        quality: 'high',
    }
    if (publicImageUrl) {
        // Marketing Studio's image field is a plural array, unlike Soul v2.
        body.image_urls = [publicImageUrl]
    }

    const res = await fetch('https://api.higgsfield.ai/marketing-studio/image', {
        method: 'POST',
        headers: {
            Authorization: authHeader,
            'Content-Type': 'application/json',
            'User-Agent': 'higgsfield-server-js/2.0',
        },
        body: JSON.stringify(body),
    })

    if (res.ok) {
        const data = await res.json()
        const imgUrl = await pollRestRequest(authHeader, data)
        if (imgUrl) return { imageUrl: imgUrl, model: 'higgsfield/marketing-studio-image' }
        throw new Error('Higgsfield AI Marketing Studio request succeeded but returned no image URL.')
    }

    const errText = await res.text()
    console.warn('[Higgsfield REST] Marketing Studio endpoint error:', res.status, errText)
    if (res.status === 401) {
        throw new Error('Higgsfield AI authentication failed (401: Invalid API credentials). Please verify your HF_CREDENTIALS in your environment settings.')
    }
    if (res.status === 403 || res.status === 402) {
        const err: any = new Error(`Higgsfield AI account error (403: Not entitled to Marketing Studio Image, or not enough credits): ${errText}`)
        err.statusCode = 403
        err.name = 'AccountError'
        throw err
    }
    throw new Error(`Higgsfield AI Marketing Studio API error [${res.status}]: ${errText}`)
}

/**
 * Direct REST fallback to api.higgsfield.ai, in case the SDK instance itself
 * has an issue. Hits the same Soul v2 endpoint as the primary attempt
 * (https://docs.higgsfield.ai/docs/models/soul-2/generate.md):
 * POST https://api.higgsfield.ai/higgsfield-ai/soul/v2/standard
 *
 * NOTE: a "Flux Pro / Kontext" fallback used to live here too, POSTing to
 * https://api.higgsfield.ai/flux-pro/kontext/max/text-to-image. That path does
 * not appear anywhere in Higgsfield's docs (main docs page, openapi.json, or
 * quickstart) — "flux-pro/kontext/max/text-to-image" is a real model id on
 * fal.ai, not on Higgsfield, so it was always a guaranteed 404 that silently
 * wasted a full request/retry cycle on every generation. Removed rather than
 * fixed, since Higgsfield doesn't document an equivalent endpoint to fix it to.
 */
async function generateViaHiggsfieldRest(
    creds: HiggsfieldCreds,
    prompt: string,
    aspectRatio: string,
    publicImageUrl?: string | null
): Promise<{ imageUrl: string; model: string }> {
    const authHeader = `Key ${creds.keyId}:${creds.keySecret}`

    const soulBody: any = {
        prompt,
        aspect_ratio: normalizeSoulAspectRatio(aspectRatio),
        resolution: '1080p',
        batch_size: 1,
    }
    if (publicImageUrl) {
        // Per docs.higgsfield.ai/docs/concepts/file-uploads: "Pass public_url in
        // the model parameter that accepts an input URL, such as image_url" — a
        // flat field, not the previous nested { type, image_url } shape. Soul
        // v2's documented generate schema doesn't list this field, so this is a
        // best-effort pass-through; if edit mode still fails after this fix,
        // that field may need to come from Higgsfield support/docs directly.
        soulBody.image_url = publicImageUrl
    }

    const soulRes = await fetch('https://api.higgsfield.ai/higgsfield-ai/soul/v2/standard', {
        method: 'POST',
        headers: {
            Authorization: authHeader,
            'Content-Type': 'application/json',
            'User-Agent': 'higgsfield-server-js/2.0',
        },
        body: JSON.stringify(soulBody),
    })

    if (soulRes.ok) {
        const data = await soulRes.json()
        const imgUrl = await pollRestRequest(authHeader, data)
        if (imgUrl) return { imageUrl: imgUrl, model: 'higgsfield/soul-v2' }
        throw new Error('Higgsfield AI Soul v2 request succeeded but returned no image URL.')
    }

    const errText = await soulRes.text()
    console.warn('[Higgsfield REST] Soul v2 endpoint error:', soulRes.status, errText)
    if (soulRes.status === 401) {
        throw new Error('Higgsfield AI authentication failed (401: Invalid API credentials). Please verify your HF_CREDENTIALS in your environment settings.')
    }
    if (soulRes.status === 403 || soulRes.status === 402) {
        throw new Error('Higgsfield AI account error (403: Not enough credits or inactive plan). Please check your account status at cloud.higgsfield.ai.')
    }
    throw new Error(`Higgsfield AI Soul v2 API error [${soulRes.status}]: ${errText}`)
}

/**
 * Primary Higgsfield generation executor.
 *
 * Tries models in priority order rather than assuming Soul v2: the user's
 * Higgsfield account was set up by choosing 3 models at signup, and this
 * account's set is believed to include "Marketing Studio Image" (see the
 * comment on normalizeMarketingStudioAspectRatio above) rather than Soul.
 * A model this API key ISN'T entitled to returns a 403/AccountError, which is
 * treated as "skip to the next model", not a fatal error — only a genuine
 * 401 (bad credentials) aborts immediately, since that means no model will work.
 */
async function generateViaHiggsfield(
    creds: HiggsfieldCreds,
    prompt: string,
    mode: string,
    aspectRatio: string,
    publicImageUrl?: string | null
): Promise<{ imageUrl: string; usedModel: string }> {
    const v2Client = createHiggsfieldClient({
        credentials: `${creds.keyId}:${creds.keySecret}`,
    })

    let lastError: any = null

    // Attempt 1: Marketing Studio Image via Official SDK.
    // Endpoint + body verified against docs.higgsfield.ai/docs/models/marketing-studio-image
    try {
        console.log('[Higgsfield AI] Subscribing to marketing-studio/image...')
        const input: any = {
            prompt,
            aspect_ratio: normalizeMarketingStudioAspectRatio(aspectRatio),
            resolution: '2k',
            quality: 'high',
        }
        if (publicImageUrl) {
            input.image_urls = [publicImageUrl]
        }

        const response = await v2Client.subscribe('marketing-studio/image', {
            input,
            withPolling: true,
        })

        if (response.status === 'nsfw') {
            throw new Error('Higgsfield AI content moderation: The prompt or input was flagged by safety filters.')
        }
        if (response.status === 'failed') {
            throw new Error('Higgsfield AI generation failed on the server.')
        }

        const url = extractImageUrl(response)
        if (url) {
            return { imageUrl: url, usedModel: 'higgsfield/marketing-studio-image' }
        }
    } catch (msErr: any) {
        lastError = msErr
        console.warn(
            '[Higgsfield AI] Marketing Studio SDK attempt failed:',
            msErr?.name,
            msErr?.statusCode,
            msErr?.message
        )
        const kind = classifyHiggsfieldError(msErr)
        if (kind === 'auth') {
            throw new Error('Higgsfield AI authentication failed (401: Invalid credentials). Please check that HF_CREDENTIALS in your environment settings is correct.')
        }
        if (msErr?.message?.includes('moderation')) {
            throw msErr
        }
        // kind === 'not_entitled' or 'other': fall through and try the next model.
    }

    // Attempt 2: Marketing Studio Image via direct REST (in case the SDK
    // instance itself has an issue rather than the account/model).
    try {
        const restResult = await generateViaMarketingStudioRest(creds, prompt, aspectRatio, publicImageUrl)
        if (restResult) {
            return { imageUrl: restResult.imageUrl, usedModel: restResult.model }
        }
    } catch (msRestErr: any) {
        lastError = msRestErr
        const kind = classifyHiggsfieldError(msRestErr)
        if (kind === 'auth') {
            throw msRestErr
        }
    }

    // Attempt 3: Soul v2 Text-to-Image via Official SDK, in case this account
    // is entitled to Soul instead of (or in addition to) Marketing Studio.
    // Endpoint + body verified against docs.higgsfield.ai/docs/models/soul-2/generate.md
    // (previously this posted to the non-existent "/v1/text2image/soul" with
    // "width_and_height"/"quality" fields that don't exist in Soul v2's schema —
    // the real fields are aspect_ratio + resolution).
    try {
        console.log('[Higgsfield AI] Subscribing to higgsfield-ai/soul/v2/standard...')
        const input: any = {
            prompt,
            aspect_ratio: normalizeSoulAspectRatio(aspectRatio),
            resolution: '1080p',
            batch_size: 1,
        }
        if (publicImageUrl) {
            // See the matching note in generateViaHiggsfieldRest — flat
            // image_url per docs.higgsfield.ai/docs/concepts/file-uploads,
            // not the previous nested { type, image_url } shape. Unverified
            // for Soul v2 specifically since its generate schema doesn't list it.
            input.image_url = publicImageUrl
        }

        const response = await v2Client.subscribe('higgsfield-ai/soul/v2/standard', {
            input,
            withPolling: true,
        })

        if (response.status === 'nsfw') {
            throw new Error('Higgsfield AI content moderation: The prompt or input was flagged by safety filters.')
        }
        if (response.status === 'failed') {
            throw new Error('Higgsfield AI generation failed on the server.')
        }

        const url = extractImageUrl(response)
        if (url) {
            return { imageUrl: url, usedModel: 'higgsfield/soul-v2' }
        }
    } catch (soulErr: any) {
        lastError = soulErr
        console.warn(
            '[Higgsfield AI] Soul SDK attempt failed:',
            soulErr?.name,
            soulErr?.statusCode,
            soulErr?.message
        )
        const kind = classifyHiggsfieldError(soulErr)
        if (kind === 'auth') {
            throw new Error('Higgsfield AI authentication failed (401: Invalid credentials). Please check that HF_CREDENTIALS in your environment settings is correct.')
        }
        if (soulErr?.message?.includes('moderation')) {
            throw soulErr
        }
    }

    // Attempt 4: Soul v2 via direct REST fallback (same endpoint, in case the
    // SDK instance itself is the problem rather than the request).
    console.log('[Higgsfield AI] Attempting direct REST fallback...')
    try {
        const restResult = await generateViaHiggsfieldRest(creds, prompt, aspectRatio, publicImageUrl)
        if (restResult) {
            return { imageUrl: restResult.imageUrl, usedModel: restResult.model }
        }
    } catch (restErr: any) {
        lastError = restErr
    }

    throw lastError || new Error('Higgsfield AI could not generate the image with any entitled model (tried Marketing Studio Image and Soul v2). Please verify your credentials and account status at cloud.higgsfield.ai.')
}

export async function POST(request: Request) {
    try {
        // 1. Verify Higgsfield API credentials
        const creds = getHiggsfieldCredentials()
        if (!creds) {
            return NextResponse.json(
                {
                    success: false,
                    error:
                        'Higgsfield AI API credentials not found. Please add HF_CREDENTIALS=your-api-key-id:your-api-key-secret to your .env.local file. No Celoris credits were deducted.',
                },
                { status: 400 }
            )
        }

        const body = await request.json()
        const {
            prompt,
            mode = 'create',
            imageBase64,
            mimeType = 'image/png',
            aspectRatio = '1:1',
            userId: bodyUserId,
        } = body

        if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Please provide a valid text prompt for image generation or editing.',
                },
                { status: 400 }
            )
        }

        // 2. Identify User Session
        let userId: string | null = null
        try {
            const routeClient = await createRouteClient()
            const {
                data: { user },
            } = await routeClient.auth.getUser()
            if (user) {
                userId = user.id
            }
        } catch (authErr) {
            console.warn('Could not determine session via cookies:', authErr)
        }

        // Sept 2026: removed the fallback that accepted a `userId` from the
        // request body when there was no session — anyone could claim to be
        // any user (e.g. one with a big wallet) and use Pro generation.
        void bodyUserId

        if (!userId) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Sign in required. AI Image Studio is a Pro feature available for accounts with at least 2,000 credits.',
                },
                { status: 401 }
            )
        }

        // 3. Fetch User wallet_balance & check 2,000 credits threshold.
        // Read on the server with the service-role client only. Previously a
        // failed lookup fell back to `body.userCredits` — a number the browser
        // sends — so anyone could pass the check by sending userCredits: 99999.
        let currentBalance = 0
        try {
            const admin = createSupabaseClientForServer()
            const { data: userRow, error: userErr } = await admin
                .from('users')
                .select('wallet_balance')
                .eq('id', userId)
                .maybeSingle()
            if (!userErr && userRow && userRow.wallet_balance !== null && userRow.wallet_balance !== undefined) {
                currentBalance = Number(userRow.wallet_balance) || 0
            } else {
                const { data: profileRow } = await admin
                    .from('profiles')
                    .select('wallet_balance')
                    .eq('id', userId)
                    .maybeSingle()
                currentBalance = Number(profileRow?.wallet_balance) || 0
            }
        } catch (err) {
            console.warn('Could not read wallet balance:', err)
            return NextResponse.json(
                { success: false, error: "Couldn't check your credit balance right now. Please try again." },
                { status: 503 }
            )
        }

        if (currentBalance < PRO_REQUIRED_CREDITS) {
            return NextResponse.json(
                {
                    success: false,
                    error: `AI Image Generation requires at least ${PRO_REQUIRED_CREDITS.toLocaleString()} credits in your wallet. Current balance: ${currentBalance.toLocaleString()} credits. Please recharge your wallet to unlock Pro access.`,
                    currentBalance,
                    requiredCredits: PRO_REQUIRED_CREDITS,
                },
                { status: 403 }
            )
        }

        // 4. In edit mode, upload base layer to Higgsfield CDN for reference
        let publicImageUrl: string | null = null
        if (mode === 'edit' && imageBase64) {
            try {
                let cleanBase64 = imageBase64
                let format: 'png' | 'jpeg' | 'webp' = 'png'
                if (cleanBase64.startsWith('data:')) {
                    const commaIdx = cleanBase64.indexOf(',')
                    const header = cleanBase64.substring(0, commaIdx)
                    if (header.includes('jpeg') || header.includes('jpg')) format = 'jpeg'
                    else if (header.includes('webp')) format = 'webp'
                    cleanBase64 = cleanBase64.substring(commaIdx + 1)
                }
                const imgBuffer = Buffer.from(cleanBase64, 'base64')
                const v1Client = new HiggsfieldV1Client({
                    apiKey: creds.keyId,
                    apiSecret: creds.keySecret,
                })
                publicImageUrl = await v1Client.uploadImage(imgBuffer, format)
                console.log('[Higgsfield AI] Active layer reference uploaded:', publicImageUrl)
            } catch (uploadErr) {
                console.warn('[Higgsfield AI] Active layer upload failed:', uploadErr)
            }
        }

        // 5. Generate Image via Higgsfield AI
        const { imageUrl: rawImageUrl, usedModel } = await generateViaHiggsfield(
            creds,
            prompt,
            mode,
            aspectRatio,
            publicImageUrl
        )

        // Convert remote URL to base64 Data URL to prevent HTML5 canvas CORS taint
        const finalImageUrl = await toDataUrlSafe(rawImageUrl)

        // 6. Deduct 100 Credits upon successful generation
        const newBalance = Math.max(0, currentBalance - GENERATION_CREDIT_COST)
        try {
            const admin = createSupabaseClientForServer()
            const { error: deductErr } = await admin
                .from('users')
                .update({ wallet_balance: newBalance })
                .eq('id', userId)
            if (deductErr) console.warn('Failed to deduct credits in database:', deductErr)
        } catch (deductErr) {
            console.warn('Failed to deduct credits in database:', deductErr)
        }

        return NextResponse.json({
            success: true,
            imageUrl: finalImageUrl,
            usedModel,
            prompt,
            mode,
            creditsDeducted: GENERATION_CREDIT_COST,
            remainingCredits: newBalance,
        })
    } catch (error: any) {
        // Log the raw name/statusCode too — the friendly-message classification below
        // depends on matching these exactly, and the SDK's actual property names
        // (.statusCode, and .name === 'AccountError' for credit errors) are easy to
        // get wrong, which previously caused every real error to fall through to the
        // generic "could not generate" message. This log makes the true cause visible
        // in server logs even if a future SDK update breaks the matching again.
        console.error(
            'Error generating image via Higgsfield AI:',
            { name: error?.name, statusCode: error?.statusCode, message: error?.message },
            error
        )
        let friendlyMsg = error?.message || 'Failed to process AI image generation request with Higgsfield AI.'

        if (
            error?.name === 'AuthenticationError' ||
            error?.message?.includes('Invalid API credentials') ||
            error?.statusCode === 401
        ) {
            friendlyMsg =
                'Higgsfield AI authentication failed. Please verify that HF_CREDENTIALS=your-api-key-id:your-api-key-secret in your .env.local file is correct. No Celoris credits were deducted.'
        } else if (
            // NotEnoughCreditsError's actual .name is 'AccountError', not
            // 'NotEnoughCreditsError' — see the SDK's errors.js.
            error?.name === 'AccountError' ||
            error?.statusCode === 403 ||
            error?.message?.includes('credits')
        ) {
            friendlyMsg =
                'Your Higgsfield AI account has insufficient credits (or the account/plan is inactive). Please check your credit balance and account status at cloud.higgsfield.ai. No Celoris credits were deducted.'
        } else if (error?.name === 'TimeoutError' || error?.message?.includes('Polling exceeded')) {
            friendlyMsg =
                'Higgsfield AI generation timed out while waiting in queue. Please try again in a few moments. No Celoris credits were deducted.'
        }

        return NextResponse.json(
            {
                success: false,
                error: friendlyMsg,
            },
            { status: error?.statusCode || error?.response?.status || 500 }
        )
    }
}
