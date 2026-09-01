import { NextResponse } from 'next/server'
import { GoogleGenAI, Type } from '@google/genai'

// Ported from the SkillVerify Pro app's server.ts (POST /api/jobs/match).
// Frontend call site: components/skillverify/components/JobDetailsModal.tsx
//
// Lives alongside the existing app/api/jobs/route.ts and app/api/jobs/apply/
// routes without conflicting — Next.js routes each exact path separately.

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
        const { jobTitle, jobCompany, requiredSkills, userSkills, userLevel, userBadges } = await request.json()

        if (!jobTitle) {
            return NextResponse.json(
                { success: false, error: 'jobTitle is required' },
                { status: 400 }
            )
        }

        const ai = getAI()

        const prompt = `Analyze the match between a candidate and a job opening.
Job: ${jobTitle} at ${jobCompany}
Job Required Skills: ${JSON.stringify(requiredSkills)}
Candidate Profile:
- Skills: ${JSON.stringify(userSkills)}
- Verified Progression Level: ${userLevel}
- Verified Badges: ${JSON.stringify(userBadges)}

Provide a match score percentage (0-100), key matching strengths, missing/recommended skills to learn or test for, and a 2-sentence tailored application pitch highlighting their verified credentials.`

        const response = await ai.models.generateContent({
            model: 'gemini-3.7-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        matchPercentage: { type: Type.INTEGER },
                        matchRating: { type: Type.STRING },
                        matchingStrengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                        missingSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
                        tailoredPitch: { type: Type.STRING },
                        recommendedCertifications: { type: Type.ARRAY, items: { type: Type.STRING } },
                    },
                    required: ['matchPercentage', 'matchRating', 'matchingStrengths', 'missingSkills', 'tailoredPitch', 'recommendedCertifications'],
                },
            },
        })

        const matchData = JSON.parse(response.text || '{}')
        return NextResponse.json({ success: true, match: matchData })
    } catch (error: any) {
        console.error('Job match error:', error)
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to calculate job match' },
            { status: 500 }
        )
    }
}
