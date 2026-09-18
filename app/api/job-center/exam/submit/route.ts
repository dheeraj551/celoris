import { NextResponse } from 'next/server'
import { GoogleGenAI, Type } from '@google/genai'
import { createRouteClient } from '@/lib/supabase-server'
import { createSupabaseClientForServer } from '@/lib/supabase-client'
import { PREBUILT_EXAMS } from '@/components/skillverify/data/mockData'

// Authoritative, server-side grading + XP/badge issuance for the Job
// Center's in-app anti-cheat exams (components/skillverify/*).
//
// Previously, components/skillverify/components/AntiCheatExamModal.tsx
// graded the whole exam in the browser (MCQs against the answer key that
// ships in the client bundle, plus a scenario score fetched mid-flow) and
// App.tsx wrote the resulting XP/badge straight to Supabase from the
// client using its own local state as the source of truth. Since
// current_xp / level directly gate access to Certified Roles (real,
// higher-paying freelance work), that meant a candidate could open
// devtools and either edit local state before the "sync" fired, or call
// supabase.from('job_center_progress').update(...) /
// .from('job_center_badges').insert(...) directly — no exam attempt
// required at all. See the job_center_ranking_integrity_fix migration for
// the RLS side of this fix (those direct client writes are no longer
// permitted); this route is the only remaining way XP/badges get written
// for an in-app exam, and it recomputes everything itself rather than
// trusting the request body's score/passed/xpEarned/badge fields.
//
// This mirrors the pattern already used correctly elsewhere in this same
// codebase for the public candidate-invite flow (app/api/exam/submit,
// app/api/exam/evaluate) — same idea, adapted to also be authenticated and
// to write into job_center_progress / job_center_badges instead of
// exam_candidate_submissions.
//
// Known remaining limitation (flagged, not fixed here): PREBUILT_EXAMS —
// including correctAnswerIndex — is still imported directly into the
// client bundle for the in-app exam UI (ExamsHub / AntiCheatExamModal), so
// a candidate who digs through devtools can still find the answer key
// before answering. This route closes the bigger, trivially-exploitable
// hole (forging a result, or writing XP/a badge without the server ever
// re-grading anything); it does not hide the answer key itself. Doing that
// fully means changing the in-app exam flow to fetch questions without
// answers the way the public candidate page already does — a larger,
// separate change that's a reasonable next step, not done silently here.

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
    console.error('Job Center scenario grading error:', error)
    // Fail closed on score (0) rather than silently passing a candidate
    // because the AI grader errored, but don't block the whole submission.
    return { score: 0, feedback: 'Automated grading unavailable for this answer.' }
  }
}

export async function POST(request: Request) {
  try {
    const routeClient = await createRouteClient()
    const {
      data: { user },
    } = await routeClient.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Sign in required' }, { status: 401 })
    }

    const body = await request.json().catch(() => ({}))
    const { examId, answers, timeSpentSeconds, violationsCount } = body as {
      examId?: string
      answers?: Record<string, number | string>
      timeSpentSeconds?: number
      violationsCount?: number
    }

    if (!examId || !answers || typeof answers !== 'object') {
      return NextResponse.json({ error: 'examId and answers are required' }, { status: 400 })
    }

    const exam = PREBUILT_EXAMS.find((e) => e.id === examId)
    if (!exam) {
      return NextResponse.json({ error: 'Exam not found' }, { status: 404 })
    }

    // strikeCount is client-reported anti-cheat telemetry (tab switches,
    // window blur, clipboard use) — that stays an accepted, existing
    // limitation of browser-only proctoring. What we don't do anymore is
    // also trust the client's claimed honorScore/score/xpEarned/badge; all
    // of those are recomputed here from strikes + the raw per-question
    // answers.
    const strikes = Math.max(0, Math.min(3, Math.round(Number(violationsCount) || 0)))
    const honorScore = strikes > 0 ? Math.max(20, 100 - strikes * 25) : 100

    let mcqCorrect = 0
    let mcqTotal = 0
    let scenarioScoreSum = 0
    let scenarioCount = 0
    let lastScenarioFeedback = ''

    for (const q of exam.questions) {
      const candidateAnswer = (answers as Record<string, number | string>)[q.id]
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
        lastScenarioFeedback = feedback
      }
    }

    const mcqPercent = mcqTotal > 0 ? (mcqCorrect / mcqTotal) * 100 : null
    const scenarioPercent = scenarioCount > 0 ? scenarioScoreSum / scenarioCount : null

    let finalScore: number
    if (mcqPercent !== null && scenarioPercent !== null) {
      const mcqWeight = mcqTotal / exam.questions.length
      const scenarioWeight = scenarioCount / exam.questions.length
      finalScore = Math.round(mcqPercent * mcqWeight + scenarioPercent * scenarioWeight)
    } else if (mcqPercent !== null) {
      finalScore = Math.round(mcqPercent)
    } else {
      finalScore = Math.round(scenarioPercent ?? 0)
    }

    const passed = finalScore >= exam.passingScorePercent && strikes < 3
    const xpEarned = passed ? exam.xpReward : 35

    const supabase = createSupabaseClientForServer()

    const { data: existingProgress } = await supabase
      .from('job_center_progress')
      .select('current_xp, honor_score')
      .eq('id', user.id)
      .maybeSingle()

    const nextXP = (existingProgress?.current_xp ?? 0) + xpEarned
    const nextHonor = existingProgress ? Math.round((existingProgress.honor_score + honorScore) / 2) : honorScore

    await supabase.from('job_center_progress').upsert({
      id: user.id,
      current_xp: nextXP,
      honor_score: nextHonor,
      updated_at: new Date().toISOString(),
    })

    let badgeEarned: any = undefined
    if (passed) {
      const randomHash = Math.random().toString(36).substring(2, 6).toUpperCase()
      const verificationHash = `SV-2026-${exam.skillName.substring(0, 4).toUpperCase()}-${randomHash}`

      const { data: badgeRow, error: badgeError } = await supabase
        .from('job_center_badges')
        .upsert(
          {
            user_id: user.id,
            badge_title: exam.badgeTitle,
            skill_name: exam.skillName,
            industry: exam.industry,
            verification_hash: verificationHash,
            score: finalScore,
            proctor_score: honorScore,
            badge_color: exam.badgeColor,
            earned_date: new Date().toISOString(),
          },
          { onConflict: 'user_id,badge_title' }
        )
        .select('*')
        .single()

      if (badgeError) {
        console.error('Job Center badge upsert error:', badgeError)
      }

      if (badgeRow) {
        badgeEarned = {
          id: badgeRow.id,
          badgeTitle: badgeRow.badge_title,
          skillName: badgeRow.skill_name,
          industry: badgeRow.industry,
          verificationHash: badgeRow.verification_hash,
          earnedDate: 'Just now',
          score: badgeRow.score,
          proctorScore: badgeRow.proctor_score,
          badgeColor: badgeRow.badge_color,
        }
      }
    }

    return NextResponse.json({
      success: true,
      result: {
        id: `result-${Date.now()}`,
        examId: exam.id,
        examTitle: exam.title,
        skillName: exam.skillName,
        date: new Date().toLocaleDateString(),
        score: finalScore,
        passed,
        timeSpentSeconds: Number(timeSpentSeconds) || 0,
        honorScore,
        violationsCount: strikes,
        badgeEarned,
        xpEarned,
        detailedFeedback: lastScenarioFeedback || undefined,
      },
      progress: {
        currentXP: nextXP,
        honorScore: nextHonor,
      },
    })
  } catch (error: any) {
    console.error('Job Center exam submit error:', error)
    return NextResponse.json({ error: error.message || 'Failed to submit exam' }, { status: 500 })
  }
}
