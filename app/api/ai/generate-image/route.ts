import { NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'
import { createRouteClient } from '@/lib/supabase-server'
import { createSupabaseClientForServer, createClientForBrowser } from '@/lib/supabase-client'

// Ported from the PhotoLite Web Image Editor app's server.ts
// (POST /api/ai/generate-image), following the same getAI() singleton
// pattern established in app/api/exam/generate/route.ts.
// Frontend call site: components/photolite/components/Modals/AIImageModal.tsx

const PRO_REQUIRED_CREDITS = 2000
const GENERATION_CREDIT_COST = 100

let aiClient: GoogleGenAI | null = null
function getAI(): GoogleGenAI {
    if (!aiClient) {
        const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || ''
        aiClient = new GoogleGenAI({
            apiKey,
            httpOptions: {
                headers: {
                    'User-Agent': 'aistudio-build',
                },
            },
        })
    }
    return aiClient
}

const PRIMARY_MODEL = 'gemini-3.1-flash-image-preview'
const FALLBACK_MODELS = ['gemini-3.1-flash-image', 'gemini-2.5-flash-image']

async function executeCall(
    modelName: string,
    mode: string,
    prompt: string,
    imageBase64?: string,
    mimeType?: string,
    aspectRatio?: string
) {
    const ai = getAI()

    if (mode === 'edit' && imageBase64) {
        // Strip data: prefix if present
        let cleanData = imageBase64
        let finalMime = mimeType
        if (cleanData.startsWith('data:')) {
            const commaIdx = cleanData.indexOf(',')
            const header = cleanData.substring(0, commaIdx)
            const matchedMime = header.split(';')[0]?.replace('data:', '')
            if (matchedMime) finalMime = matchedMime
            cleanData = cleanData.substring(commaIdx + 1)
        }

        return await ai.models.generateContent({
            model: modelName,
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: cleanData,
                            mimeType: finalMime || 'image/png',
                        },
                    },
                    {
                        text: prompt,
                    },
                ],
            },
        })
    }

    // Create mode (text-to-image)
    return await ai.models.generateContent({
        model: modelName,
        contents: {
            parts: [{ text: prompt }],
        },
        config: {
            imageConfig: {
                aspectRatio: aspectRatio || '1:1',
            },
        },
    })
}

async function generateViaVercelGateway(prompt: string, aspectRatio: string = '1:1') {
    const gatewayKey = process.env.VERCEL_AI_GATEWAY_KEY
    if (!gatewayKey) return null

    let size = '1024x1024'
    if (aspectRatio === '16:9') size = '1344x768'
    else if (aspectRatio === '9:16') size = '768x1344'
    else if (aspectRatio === '4:3') size = '1152x864'

    const models = [
        'bfl/flux-pro-1.1',
        'bfl/flux-pro-1.1-ultra',
        'prodia/flux-fast-schnell',
        'openai/gpt-image-1',
    ]

    for (const model of models) {
        try {
            const res = await fetch('https://ai-gateway.vercel.sh/v1/images/generations', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${gatewayKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model,
                    prompt,
                    size,
                }),
            })

            if (res.ok) {
                const data = await res.json()
                const item = data?.data?.[0]
                if (item?.b64_json) {
                    return {
                        imageUrl: `data:image/jpeg;base64,${item.b64_json}`,
                        usedModel: model,
                    }
                } else if (item?.url) {
                    return {
                        imageUrl: item.url,
                        usedModel: model,
                    }
                }
            }
        } catch (err) {
            console.warn(`Vercel AI Gateway ${model} attempt failed:`, err)
        }
    }
    return null
}

export async function POST(request: Request) {
    try {
        const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY
        const gatewayKey = process.env.VERCEL_AI_GATEWAY_KEY

        if (!apiKey && !gatewayKey) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Neither Gemini API key nor Vercel AI Gateway key is configured.',
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

        // 1. Identify User Session
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

        // 2. Fetch User wallet_balance & check 2,000 credits threshold
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
        let userRow: any = null

        if (dbClient) {
            try {
                const { data, error } = await dbClient
                    .from('users')
                    .select('wallet_balance')
                    .eq('id', userId)
                    .maybeSingle()

                if (!error && data) {
                    userRow = data
                    currentBalance = Number(data.wallet_balance || 0)
                } else {
                    const profileRes = await dbClient
                        .from('profiles')
                        .select('wallet_balance')
                        .eq('id', userId)
                        .maybeSingle()
                    if (!profileRes.error && profileRes.data) {
                        userRow = profileRes.data
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

        // 3. Generate Image (Gemini SDK with Vercel AI Gateway fallback)
        let imageUrl: string | null = null
        let usedModel = PRIMARY_MODEL
        let textDescription = ''

        // Try Gemini first if API key configured
        if (apiKey) {
            try {
                const response = await executeCall(PRIMARY_MODEL, mode, prompt, imageBase64, mimeType, aspectRatio)
                const candidates = response?.candidates || []
                if (candidates.length > 0 && candidates[0].content?.parts) {
                    for (const part of candidates[0].content.parts) {
                        if (part.inlineData && part.inlineData.data) {
                            const partMime = part.inlineData.mimeType || 'image/png'
                            imageUrl = `data:${partMime};base64,${part.inlineData.data}`
                            usedModel = PRIMARY_MODEL
                            break
                        } else if (part.text) {
                            textDescription += part.text
                        }
                    }
                }
            } catch (primaryErr: any) {
                console.warn(`Primary model ${PRIMARY_MODEL} error:`, primaryErr?.message)
                for (const fallback of FALLBACK_MODELS) {
                    try {
                        const response = await executeCall(fallback, mode, prompt, imageBase64, mimeType, aspectRatio)
                        const candidates = response?.candidates || []
                        if (candidates.length > 0 && candidates[0].content?.parts) {
                            for (const part of candidates[0].content.parts) {
                                if (part.inlineData && part.inlineData.data) {
                                    const partMime = part.inlineData.mimeType || 'image/png'
                                    imageUrl = `data:${partMime};base64,${part.inlineData.data}`
                                    usedModel = fallback
                                    break
                                }
                            }
                        }
                        if (imageUrl) break
                    } catch (fbErr: any) {
                        console.warn(`Fallback model ${fallback} error:`, fbErr?.message)
                    }
                }
            }
        }

        // Try Vercel AI Gateway if Gemini didn't produce an image
        if (!imageUrl && gatewayKey && mode === 'create') {
            console.log('Attempting Vercel AI Gateway image generation...')
            const gatewayResult = await generateViaVercelGateway(prompt, aspectRatio)
            if (gatewayResult?.imageUrl) {
                imageUrl = gatewayResult.imageUrl
                usedModel = gatewayResult.usedModel
            }
        }

        if (!imageUrl) {
            return NextResponse.json(
                {
                    success: false,
                    error:
                        'Both Google Gemini and Vercel AI Gateway have reached their free-tier request limits. To enable image generation, please link a billing account to your Google AI Studio project (aistudio.google.com) or add credits to Vercel AI Gateway. No Celoris credits were deducted.',
                    usedModel,
                },
                { status: 422 }
            )
        }

        // 5. Deduct 100 Credits upon successful image generation
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
            imageUrl,
            usedModel,
            prompt,
            mode,
            creditsDeducted: GENERATION_CREDIT_COST,
            remainingCredits: newBalance,
        })
    } catch (error: any) {
        console.error('Error generating image via Gemini API:', error)
        let friendlyMsg = error?.message || 'Failed to process AI image generation request.'
        try {
            if (typeof friendlyMsg === 'string' && friendlyMsg.includes('{')) {
                const parsed = JSON.parse(friendlyMsg)
                if (parsed?.error?.message) {
                    if (
                        parsed.error.code === 429 ||
                        parsed.error.message.includes('limit: 0') ||
                        parsed.error.message.includes('Quota exceeded')
                    ) {
                        friendlyMsg =
                            'Google Gemini Quota Notice: The configured Gemini API key is on an unbilled Google AI Studio tier (Google sets image generation quota to 0 for unbilled projects). To generate images, billing must be linked to your project in Google AI Studio (aistudio.google.com). No credits were deducted.'
                    } else {
                        friendlyMsg = parsed.error.message
                    }
                }
            }
        } catch {
            // Keep default message if parsing fails
        }

        return NextResponse.json(
            {
                success: false,
                error: friendlyMsg,
            },
            { status: 500 }
        )
    }
}
