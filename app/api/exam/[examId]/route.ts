import { NextResponse } from 'next/server'
import { PREBUILT_EXAMS } from '@/components/skillverify/data/mockData'

// Public, unauthenticated endpoint used by the standalone candidate exam page
// (app/exam/[examId]/page.tsx). Deliberately strips correctAnswerIndex and
// explanation from every question before responding — the answer key must
// never reach the browser here, unlike the logged-in Job Center flow (which
// imports PREBUILT_EXAMS directly into client code and grades MCQs locally).
// Grading for this public flow happens server-side in /api/exam/submit.
export async function GET(
    _request: Request,
    context: { params: Promise<{ examId: string }> }
) {
    const { examId } = await context.params
    const exam = PREBUILT_EXAMS.find((e) => e.id === examId)

    if (!exam) {
        return NextResponse.json({ error: 'Exam not found' }, { status: 404 })
    }

    return NextResponse.json({
        id: exam.id,
        title: exam.title,
        description: exam.description,
        skillName: exam.skillName,
        industry: exam.industry,
        timeLimitMinutes: exam.timeLimitMinutes,
        passingScorePercent: exam.passingScorePercent,
        xpReward: exam.xpReward,
        badgeTitle: exam.badgeTitle,
        badgeColor: exam.badgeColor,
        difficulty: exam.difficulty,
        targetRoleExamples: exam.targetRoleExamples,
        questions: exam.questions.map((q) => ({
            id: q.id,
            type: q.type,
            question: q.question,
            codeSnippet: q.codeSnippet,
            options: q.options,
            difficulty: q.difficulty,
            // correctAnswerIndex and explanation intentionally omitted.
        })),
    })
}
