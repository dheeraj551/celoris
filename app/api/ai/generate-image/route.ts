import { NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'

// Ported from the PhotoLite Web Image Editor app's server.ts
// (POST /api/ai/generate-image), following the same getAI() singleton
// pattern established in app/api/exam/generate/route.ts.
// Frontend call site: components/photolite/components/Modals/AIImageModal.tsx

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

export async function POST(request: Request) {
    try {
        const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY
        if (!apiKey) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Gemini API key is not configured. Please contact support.',
                },
                { status: 400 }
            )
        }

        const { prompt, mode = 'create', imageBase64, mimeType = 'image/png', aspectRatio = '1:1' } = await request.json()

        if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Please provide a valid text prompt for image generation or editing.',
                },
                { status: 400 }
            )
        }

        let response: any = null
        let usedModel = PRIMARY_MODEL

        try {
            response = await executeCall(PRIMARY_MODEL, mode, prompt, imageBase64, mimeType, aspectRatio)
        } catch (primaryErr: any) {
            console.warn(`Primary model ${PRIMARY_MODEL} error, trying fallbacks:`, primaryErr?.message)
            let fallbackSuccess = false
            for (const fallback of FALLBACK_MODELS) {
                try {
                    response = await executeCall(fallback, mode, prompt, imageBase64, mimeType, aspectRatio)
                    usedModel = fallback
                    fallbackSuccess = true
                    break
                } catch (fbErr: any) {
                    console.warn(`Fallback model ${fallback} error:`, fbErr?.message)
                }
            }
            if (!fallbackSuccess) {
                throw primaryErr
            }
        }

        // Extract generated image
        let imageUrl: string | null = null
        let textDescription = ''

        const candidates = response?.candidates || []
        if (candidates.length > 0 && candidates[0].content?.parts) {
            for (const part of candidates[0].content.parts) {
                if (part.inlineData && part.inlineData.data) {
                    const partMime = part.inlineData.mimeType || 'image/png'
                    imageUrl = `data:${partMime};base64,${part.inlineData.data}`
                    break
                } else if (part.text) {
                    textDescription += part.text
                }
            }
        }

        if (!imageUrl) {
            return NextResponse.json(
                {
                    success: false,
                    error: textDescription || 'No image data was generated by the model. Please adjust your prompt.',
                    usedModel,
                },
                { status: 422 }
            )
        }

        return NextResponse.json({
            success: true,
            imageUrl,
            usedModel,
            prompt,
            mode,
        })
    } catch (error: any) {
        console.error('Error generating image via Gemini API:', error)
        return NextResponse.json(
            {
                success: false,
                error: error?.message || 'Failed to process AI image generation request.',
            },
            { status: 500 }
        )
    }
}
