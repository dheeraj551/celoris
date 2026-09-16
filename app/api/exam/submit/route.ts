import { NextResponse } from 'next/server'
import { GoogleGenAI, Type } from '@google/genai'
import { createSupabaseClientForServer } from '@/lib/supabase-client'
import { PREBUILT_EXAMS } from '@/components/skillverify/data/mockData'
import nodemailer from 'nodemailer'

// Public, unauthenticated endpoint — the standalone candidate exam page
// (app/exam/[examId]/page.tsx) posts a candidate's answers here. Grading
// happens entirely server-side against the real PREBUILT_EXAMS definition
// (never sent to the browser for this flow — see /api/exam/[examId]),
// so a candidate can't read the answer key out of devtools before submitting.

// Where the "a candidate just finished an exam" notification goes.
// support@celorisdesigns.com is kept as the admin login for the dashboard
// (see ADMIN_EMAILS in ExamsHub.tsx / exam-results/page.tsx) — this is a
// separate, personal inbox just for these alerts.
const RESULT_NOTIFY_EMAIL = 'dheerajkushwaha551@gmail.com'

let aiClient: GoogleGenAI | null = null
function getAI(): GoogleGenAI {
    if (!aiClient) {
        const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || ''
        aiClient = new GoogleGenAI({ apiKey })
    }
    return aiClient
}

async function gradeScenarioAnswer(question: string, answer: string, skillName: string) {
    if (!answer || !answer.trim()) {
        return { score: 0, feedback: 'No answer submitted.' }
    }
    try {
        const ai = getAI()
        const prompt = `You are a strict, senior hiring examiner for the skill "${skillName}".
Question: "${question}"
Candidate's answer: "${answer}"

Score the answer 0-100 for technical/professional soundness and judgment. Be strict — this is a hiring screen, not a class assignment. Give one short sentence of feedback.`

        const response = await ai.models.generateContent({
            model: 'gemini-3.7-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        score: { type: Type.INTEGER },
                        feedback: { type: Type.STRING },
                    },
                    required: ['score', 'feedback'],
                },
            },
        })

        const parsed = JSON.parse(response.text || '{}')
        const score = Math.max(0, Math.min(100, Number(parsed.score) || 0))
        return { score, feedback: parsed.feedback || '' }
    } catch (error) {
        console.error('Scenario grading error:', error)
        // Fail closed on score (0) rather than silently passing a candidate
        // because the AI grader errored, but don't block the whole submission.
        return { score: 0, feedback: 'Automated grading unavailable for this answer.' }
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const {
            examId,
            candidateName,
            candidateEmail,
            answers,
            timeSpentSeconds,
            tabSwitchViolations,
        } = body as {
            examId?: string
            candidateName?: string
            candidateEmail?: string
            answers?: Record<string, number | string>
            timeSpentSeconds?: number
            tabSwitchViolations?: number
        }

        if (!examId || !candidateName || !candidateEmail || !answers) {
            return NextResponse.json(
                { error: 'examId, candidateName, candidateEmail and answers are required' },
                { status: 400 }
            )
        }

        const exam = PREBUILT_EXAMS.find((e) => e.id === examId)
        if (!exam) {
            return NextResponse.json({ error: 'Exam not found' }, { status: 404 })
        }

        let mcqCorrect = 0
        let mcqTotal = 0
        const scenarioFeedback: { questionId: string; score: number; feedback: string }[] = []
        let scenarioScoreSum = 0
        let scenarioCount = 0

        for (const q of exam.questions) {
            const candidateAnswer = answers[q.id]
            if (q.type === 'mcq') {
                mcqTotal += 1
                if (typeof candidateAnswer === 'number' && candidateAnswer === q.correctAnswerIndex) {
                    mcqCorrect += 1
                }
            } else {
                scenarioCount += 1
                const { score, feedback } = await gradeScenarioAnswer(
                    q.question,
                    typeof candidateAnswer === 'string' ? candidateAnswer : '',
                    exam.skillName
                )
                scenarioScoreSum += score
                scenarioFeedback.push({ questionId: q.id, score, feedback })
            }
        }

        // Weight MCQs and scenario questions by their share of the exam so a
        // 23-MCQ + 2-scenario exam isn't dominated by the two open answers.
        const mcqPercent = mcqTotal > 0 ? (mcqCorrect / mcqTotal) * 100 : null
        const scenarioPercent = scenarioCount > 0 ? scenarioScoreSum / scenarioCount : null

        let scorePercent: number
        if (mcqPercent !== null && scenarioPercent !== null) {
            const mcqWeight = mcqTotal / exam.questions.length
            const scenarioWeight = scenarioCount / exam.questions.length
            scorePercent = Math.round(mcqPercent * mcqWeight + scenarioPercent * scenarioWeight)
        } else if (mcqPercent !== null) {
            scorePercent = Math.round(mcqPercent)
        } else {
            scorePercent = Math.round(scenarioPercent ?? 0)
        }

        const passed = scorePercent >= exam.passingScorePercent

        const supabase = createSupabaseClientForServer()
        const { error: insertError } = await (supabase as any)
            .from('exam_candidate_submissions')
            .insert({
                exam_id: exam.id,
                exam_title: exam.title,
                candidate_name: candidateName,
                candidate_email: candidateEmail,
                score_percent: scorePercent,
                passed,
                mcq_correct: mcqCorrect,
                mcq_total: mcqTotal,
                scenario_feedback: scenarioFeedback,
                answers,
                time_spent_seconds: timeSpentSeconds ?? 0,
                tab_switch_violations: tabSwitchViolations ?? 0,
            })

        if (insertError) {
            console.error('Error storing exam submission:', insertError)
            // Still return the score to the candidate — losing the DB row
            // shouldn't block them from seeing their result.
        }

        // Best-effort notification to Celoris so a submission doesn't require
        // checking a dashboard to be noticed.
        try {
            if (process.env.MAIL_USERNAME && process.env.MAIL_PASSWORD) {
                const transporter = nodemailer.createTransport({
                    host: process.env.MAIL_HOST || 'smtp.gmail.com',
                    port: parseInt(process.env.MAIL_PORT || '587'),
                    secure: false,
                    auth: {
                        user: process.env.MAIL_USERNAME,
                        pass: process.env.MAIL_PASSWORD,
                    },
                    tls: { rejectUnauthorized: false },
                })

                await transporter.sendMail({
                    from: `"${process.env.MAIL_FROM_NAME || 'Celoris'}" <${process.env.MAIL_FROM_ADDRESS}>`,
                    // support@celorisdesigns.com is the admin login used to
                    // access the dashboard, not an inbox to alert — result
                    // notifications go to Dheeraj's personal address instead.
                    to: RESULT_NOTIFY_EMAIL,
                    subject: `Exam result: ${candidateName} — ${exam.title} (${scorePercent}%, ${passed ? 'PASSED' : 'did not pass'})`,
                    html: `
            <p><strong>${candidateName}</strong> (${candidateEmail}) just completed <strong>${exam.title}</strong>.</p>
            <p>Score: <strong>${scorePercent}%</strong> (passing: ${exam.passingScorePercent}%) — <strong>${passed ? 'PASSED' : 'DID NOT PASS'}</strong></p>
            <p>MCQ: ${mcqCorrect}/${mcqTotal} correct${scenarioCount > 0 ? ` · Scenario avg: ${Math.round(scenarioPercent ?? 0)}/100` : ''}</p>
            <p>Time spent: ${Math.round((timeSpentSeconds ?? 0) / 60)} min · Tab-switch flags: ${tabSwitchViolations ?? 0}</p>
          `,
                })
            }
        } catch (mailError) {
            console.error('Error sending exam result notification email:', mailError)
        }

        return NextResponse.json({
            success: true,
            examTitle: exam.title,
            scorePercent,
            passingScorePercent: exam.passingScorePercent,
            passed,
        })
    } catch (error: any) {
        console.error('Exam submit error:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to submit exam' },
            { status: 500 }
        )
    }
}
