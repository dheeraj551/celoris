import { NextResponse } from 'next/server'
import { GoogleGenAI, Type } from '@google/genai'

// Ported from the SkillVerify Pro app's server.ts (POST /api/exam/evaluate).
// Frontend call site: components/skillverify/components/AntiCheatExamModal.tsx

let aiClient: GoogleGenAI | null = null
function getAI(): GoogleGenAI {
    if (!aiClient) {
        const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || ''
        aiClient = new GoogleGenAI({ apiKey })
    }
    return aiClient
}

export async function POST(request: Request) {
    try {
        const { question, userAnswer, expectedTopic, skillName } = await request.json()

        if (!question || !skillName) {
            return NextResponse.json(
                { success: false, error: 'question and skillName are required' },
                { status: 400 }
            )
        }

        const ai = getAI()

        const prompt = `You are a strict anti-cheat certification exam proctor and senior technical examiner.
Evaluate this candidate's response for the skill "${skillName}".
Exam Question: "${question}"
Candidate's Response: "${userAnswer}"
Expected Subject Mastery: "${expectedTopic || skillName}"

Evaluate technical depth, correctness, anti-cheat realism (whether it looks authentic or hallucinated), and assign a score out of 100 with actionable feedback.`

        const response = await ai.models.generateContent({
            model: 'gemini-3.7-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        score: { type: Type.INTEGER },
                        passed: { type: Type.BOOLEAN },
                        strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                        improvements: { type: Type.ARRAY, items: { type: Type.STRING } },
                        proctorNote: { type: Type.STRING },
                        verifiedFeedback: { type: Type.STRING },
                    },
                    required: ['score', 'passed', 'strengths', 'improvements', 'proctorNote', 'verifiedFeedback'],
                },
            },
        })

        const evaluation = JSON.parse(response.text || '{}')
        return NextResponse.json({ success: true, evaluation })
    } catch (error: any) {
        console.error('Exam evaluation error:', error)
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to evaluate exam submission' },
            { status: 500 }
        )
    }
}
