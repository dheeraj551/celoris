import { NextResponse } from 'next/server'
import { GoogleGenAI, Type } from '@google/genai'

// Ported from the SkillVerify Pro app's server.ts (POST /api/exam/generate).
// Frontend call site: components/skillverify/components/AIExamGeneratorModal.tsx

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
        const { skillName, industry, difficulty = 'Intermediate' } = await request.json()

        if (!skillName || !industry) {
            return NextResponse.json(
                { success: false, error: 'skillName and industry are required' },
                { status: 400 }
            )
        }

        const ai = getAI()

        const prompt = `Generate a rigorous, anti-cheat certification exam for the skill: "${skillName}" in the "${industry}" industry at "${difficulty}" difficulty level.
Include 4 challenging multiple choice questions (with 4 distinct options, exactly 1 correct answer index 0-3, and in-depth explanation) and 1 practical coding/architectural scenario question with evaluation criteria.`

        const response = await ai.models.generateContent({
            model: 'gemini-3.7-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        description: { type: Type.STRING },
                        timeLimitMinutes: { type: Type.INTEGER },
                        passingScorePercent: { type: Type.INTEGER },
                        xpReward: { type: Type.INTEGER },
                        badgeTitle: { type: Type.STRING },
                        badgeColor: { type: Type.STRING },
                        questions: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    id: { type: Type.STRING },
                                    type: { type: Type.STRING, description: 'mcq or scenario' },
                                    question: { type: Type.STRING },
                                    codeSnippet: { type: Type.STRING },
                                    options: {
                                        type: Type.ARRAY,
                                        items: { type: Type.STRING },
                                    },
                                    correctAnswerIndex: { type: Type.INTEGER },
                                    explanation: { type: Type.STRING },
                                    difficulty: { type: Type.STRING },
                                },
                                required: ['id', 'type', 'question', 'options', 'correctAnswerIndex', 'explanation'],
                            },
                        },
                    },
                    required: ['title', 'description', 'timeLimitMinutes', 'passingScorePercent', 'xpReward', 'badgeTitle', 'questions'],
                },
            },
        })

        const examData = JSON.parse(response.text || '{}')
        return NextResponse.json({ success: true, exam: examData })
    } catch (error: any) {
        console.error('Exam generation error:', error)
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to generate exam with AI' },
            { status: 500 }
        )
    }
}
