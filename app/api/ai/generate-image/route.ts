import { NextResponse } from 'next/server'
import { createHiggsfieldClient } from '@higgsfield/client/v2'
import { HiggsfieldClient as HiggsfieldV1Client } from '@higgsfield/client'
import { createRouteClient } from '@/lib/supabase-server'
import { createSupabaseClientForServer, createClientForBrowser } from '@/lib/supabase-client'

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
 * Maps standard PhotoLite aspect ratio to Higgsfield Soul supported resolutions
 */
function mapAspectRatioToSoulResolution(ratio: string): string {
    switch (ratio) {
        case '16:9':
            return '2048x1152'
        case '9:16':
            return '1152x2048'
        case '4:3':
            return '2048x1536'
        case '3:4':
            return '1536x2048'
        case '1:1':
        default:
            return '1536x1536'
    }
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
 * Direct REST fallback to api.higgsfield.ai
 */
async function generateViaHiggsfieldRest(
    creds: HiggsfieldCreds,
    prompt: string,
    aspectRatio: string,
    publicImageUrl?: string | null
): Promise<{ imageUrl: string; model: string } | null> {
    const authHeader = `Key ${creds.keyId}:${creds.keySecret}`
    const soulSize = mapAspectRatioToSoulResolution(aspectRatio)

    // 1. Try Soul endpoint via REST
    const soulBody: any = {
        prompt,
        width_and_height: soulSize,
        quality: '1080p',
        batch_size: 1,
    }
    if (publicImageUrl) {
        soulBody.image_reference = {
            type: 'image_url',
            image_url: publicImageUrl,
        }
    }

    try {
        const soulRes = await fetch('https://api.higgsfield.ai/v1/text2image/soul', {
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
        } else {
            const errText = await soulRes.text()
            console.warn('[Higgsfield REST] Soul endpoint status:', soulRes.status, errText)
        }
    } catch (e: any) {
        console.warn('[Higgsfield REST] Soul request error:', e?.message)
    }

    // 2. Try Flux Pro endpoint via REST
    try {
        const fluxRes = await fetch('https://api.higgsfield.ai/flux-pro/kontext/max/text-to-image', {
            method: 'POST',
            headers: {
                Authorization: authHeader,
                'Content-Type': 'application/json',
                'User-Agent': 'higgsfield-server-js/2.0',
            },
            body: JSON.stringify({
                prompt,
                aspect_ratio: aspectRatio || '1:1',
            }),
        })

        if (fluxRes.ok) {
            const data = await fluxRes.json()
            const imgUrl = await pollRestRequest(authHeader, data)
            if (imgUrl) return { imageUrl: imgUrl, model: 'higgsfield/flux-pro' }
        } else {
            const errText = await fluxRes.text()
            console.warn('[Higgsfield REST] Flux Pro endpoint status:', fluxRes.status, errText)
        }
    } catch (e: any) {
        console.warn('[Higgsfield REST] Flux Pro request error:', e?.message)
    }

    return null
}

/**
 * Primary Higgsfield generation executor
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

    const soulSize = mapAspectRatioToSoulResolution(aspectRatio)

    // Attempt 1: Soul Text2Image via Official SDK
    try {
        console.log('[Higgsfield AI] Subscribing to /v1/text2image/soul...')
        const input: any = {
            prompt,
            width_and_height: soulSize,
            quality: '1080p',
            batch_size: 1,
        }
        if (publicImageUrl) {
            input.image_reference = {
                type: 'image_url',
                image_url: publicImageUrl,
            }
        }

        const response = await v2Client.subscribe('/v1/text2image/soul', {
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
        console.warn('[Higgsfield AI] Soul SDK attempt failed:', soulErr?.message)
        if (
            soulErr?.message?.includes('moderation') ||
            soulErr?.name === 'AuthenticationError' ||
            soulErr?.name === 'NotEnoughCreditsError' ||
            soulErr?.status === 401 ||
            soulErr?.status === 403
        ) {
            throw soulErr
        }
    }

    // Attempt 2: Flux Pro via Official SDK
    try {
        console.log('[Higgsfield AI] Subscribing to flux-pro/kontext/max/text-to-image...')
        const response = await v2Client.subscribe('flux-pro/kontext/max/text-to-image', {
            input: {
                prompt,
                aspect_ratio: aspectRatio || '1:1',
                safety_tolerance: 2,
            },
            withPolling: true,
        })

        if (response.status === 'nsfw') {
            throw new Error('Higgsfield AI content moderation: The prompt was flagged by safety filters.')
        }
        if (response.status === 'failed') {
            throw new Error('Higgsfield AI generation failed on the server.')
        }

        const url = extractImageUrl(response)
        if (url) {
            return { imageUrl: url, usedModel: 'higgsfield/flux-pro' }
        }
    } catch (fluxErr: any) {
        console.warn('[Higgsfield AI] Flux Pro SDK attempt failed:', fluxErr?.message)
        if (
            fluxErr?.message?.includes('moderation') ||
            fluxErr?.name === 'AuthenticationError' ||
            fluxErr?.name === 'NotEnoughCreditsError' ||
            fluxErr?.status === 401 ||
            fluxErr?.status === 403
        ) {
            throw fluxErr
        }
    }

    // Attempt 3: Direct REST fallback to api.higgsfield.ai
    console.log('[Higgsfield AI] Attempting direct REST fallback...')
    const restResult = await generateViaHiggsfieldRest(creds, prompt, aspectRatio, publicImageUrl)
    if (restResult) {
        return { imageUrl: restResult.imageUrl, usedModel: restResult.model }
    }

    throw new Error('Higgsfield AI could not generate the image. Please verify your credentials and account status at cloud.higgsfield.ai.')
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

        if (!userId && bodyUserId && typeof bodyUserId === 'string') {
            userId = bodyUserId
        }

        if (!userId) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Sign in required. AI Image Studio is a Pro feature available for accounts with at least 2,000 credits.',
                },
                { status: 401 }
            )
        }

        // 3. Fetch User wallet_balance & check 2,000 credits threshold
        let dbClient: any = null
        try {
            dbClient = await createRouteClient()
        } catch (e) {
            console.warn('Could not create route client:', e)
        }

        if (!dbClient) {
            try {
                dbClient = createClientForBrowser()
            } catch (e) {
                console.warn('Could not create browser client:', e)
            }
        }

        let currentBalance = typeof body.userCredits === 'number' ? body.userCredits : 0

        if (dbClient) {
            try {
                const { data, error } = await dbClient
                    .from('users')
                    .select('wallet_balance')
                    .eq('id', userId)
                    .maybeSingle()

                if (!error && data) {
                    currentBalance = Number(data.wallet_balance || 0)
                } else {
                    const profileRes = await dbClient
                        .from('profiles')
                        .select('wallet_balance')
                        .eq('id', userId)
                        .maybeSingle()
                    if (!profileRes.error && profileRes.data) {
                        currentBalance = Number(profileRes.data.wallet_balance || 0)
                    }
                }
            } catch (err) {
                console.warn('Database query error, using session credit balance:', err)
            }
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
        if (dbClient) {
            try {
                await dbClient
                    .from('users')
                    .update({ wallet_balance: newBalance })
                    .eq('id', userId)
            } catch (deductErr) {
                console.warn('Failed to deduct credits in database:', deductErr)
            }
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
        console.error('Error generating image via Higgsfield AI:', error)
        let friendlyMsg = error?.message || 'Failed to process AI image generation request with Higgsfield AI.'

        if (
            error?.name === 'AuthenticationError' ||
            error?.message?.includes('Invalid API credentials') ||
            error?.response?.status === 401
        ) {
            friendlyMsg =
                'Higgsfield AI authentication failed. Please verify that HF_CREDENTIALS=your-api-key-id:your-api-key-secret in your .env.local file is correct. No Celoris credits were deducted.'
        } else if (
            error?.name === 'NotEnoughCreditsError' ||
            error?.response?.status === 403 ||
            error?.message?.includes('credits')
        ) {
            friendlyMsg =
                'Your Higgsfield AI account has insufficient credits. Please check your credit balance at cloud.higgsfield.ai. No Celoris credits were deducted.'
        } else if (error?.name === 'TimeoutError' || error?.message?.includes('Polling exceeded')) {
            friendlyMsg =
                'Higgsfield AI generation timed out while waiting in queue. Please try again in a few moments. No Celoris credits were deducted.'
        }

        return NextResponse.json(
            {
                success: false,
                error: friendlyMsg,
            },
            { status: error?.response?.status || 500 }
        )
    }
}
