import { NextResponse } from 'next/server'
import { createRouteClient } from '@/lib/supabase-server'
import { createSupabaseClientForServer } from '@/lib/supabase-client'
import { PREBUILT_EXAMS } from '@/components/skillverify/data/mockData'
import { getEntitlements, loadPlanSettings } from '@/lib/plans'
import { PLAN_TIERS } from '@/lib/plan-features'

// Job Center exam attempts (one attempt per exam every N days, N from the
// member's plan — Admin → Plans → "Exam retake wait").
//
//   GET  → your attempt status for every exam (for the exam cards)
//   POST { examId, action: 'start' }            → start or resume an attempt
//   POST { attemptId, action: 'disqualify' }    → end an attempt early (3 strikes)
//
// The attempt is what /api/job-center/exam/submit grades; without a started
// attempt nothing can be submitted.

export const dynamic = 'force-dynamic'

const DAY_MS = 86_400_000

async function signedInUser() {
  const client = await createRouteClient()
  const {
    data: { user },
  } = await client.auth.getUser()
  return user
}

/** The shortest wait on a paid plan, for "Pro members can retake sooner" hints. */
async function fasterPlanHint(currentDays: number): Promise<{ label: string; days: number } | null> {
  const settings = await loadPlanSettings()
  let best: { label: string; days: number } | null = null
  for (let i = 0; i < PLAN_TIERS.length; i++) {
    const s = settings[PLAN_TIERS[i]]
    if (PLAN_TIERS[i] === 'free') continue
    const d = s.features.exam_retake_days
    if (d < currentDays && (!best || d > best.days)) best = { label: s.label, days: d }
  }
  return best
}

export async function GET() {
  try {
    const user = await signedInUser()
    if (!user) return NextResponse.json({ error: 'Sign in required' }, { status: 401 })

    const admin: any = createSupabaseClientForServer()
    const [ent, { data: rows }] = await Promise.all([
      getEntitlements(admin, user.id),
      admin
        .from('job_center_exam_attempts')
        .select('id, exam_id, status, started_at, score, passed')
        .eq('user_id', user.id)
        .order('started_at', { ascending: false })
        .limit(500),
    ])
    const retakeDays = ent.features.exam_retake_days
    const now = Date.now()

    const exams: Record<string, any> = {}
    for (const r of (rows || []) as any[]) {
      const e = exams[r.exam_id] || (exams[r.exam_id] = { examId: r.exam_id, attempts: 0, bestScore: null, passedEver: false })
      e.attempts += 1
      if (typeof r.score === 'number') e.bestScore = e.bestScore === null ? r.score : Math.max(e.bestScore, r.score)
      if (r.passed) e.passedEver = true
      if (!e.last) {
        // Rows are newest first — the first one we see is the latest attempt.
        e.last = { status: r.status, startedAt: r.started_at, score: r.score, passed: r.passed }
        const exam = PREBUILT_EXAMS.find((x) => x.id === r.exam_id)
        const limitMs = ((exam?.timeLimitMinutes || 10) + 5) * 60_000
        const started = Date.parse(r.started_at)
        if (r.status === 'started' && started + limitMs > now) {
          e.inProgress = { attemptId: r.id, startedAt: r.started_at }
        }
        const next = started + retakeDays * DAY_MS
        e.nextAvailableAt = !e.inProgress && next > now ? new Date(next).toISOString() : null
      }
    }

    return NextResponse.json({
      retakeDays,
      planLabel: ent.label,
      fasterPlan: ent.tier === 'free' || ent.tier === 'basic' ? await fasterPlanHint(retakeDays) : null,
      exams,
    })
  } catch (err: any) {
    console.error('[exam attempts] GET error:', err)
    return NextResponse.json({ error: 'Could not load your exam attempts.' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await signedInUser()
    if (!user) return NextResponse.json({ error: 'Please sign in to take an exam.' }, { status: 401 })

    const body = await request.json().catch(() => ({}))
    const action = String(body?.action || '')
    const admin: any = createSupabaseClientForServer()

    if (action === 'disqualify') {
      const attemptId = typeof body?.attemptId === 'string' ? body.attemptId : ''
      if (!attemptId) return NextResponse.json({ error: 'attemptId is required' }, { status: 400 })
      await admin
        .from('job_center_exam_attempts')
        .update({ status: 'disqualified', finished_at: new Date().toISOString(), score: 0, passed: false })
        .eq('id', attemptId)
        .eq('user_id', user.id)
        .eq('status', 'started')
      return NextResponse.json({ ok: true })
    }

    if (action !== 'start') return NextResponse.json({ error: 'Unknown action' }, { status: 400 })

    const examId = typeof body?.examId === 'string' ? body.examId : ''
    const exam = PREBUILT_EXAMS.find((e) => e.id === examId)
    if (!exam) {
      // Custom practice exams (made with "Launch Custom Skill Exam") aren't
      // certification exams, so they have no attempt limit.
      return NextResponse.json({ ok: true, practice: true })
    }

    const ent = await getEntitlements(admin, user.id)
    const retakeDays = ent.features.exam_retake_days

    const { data, error } = await admin.rpc('job_center_start_exam_attempt', {
      p_user: user.id,
      p_exam: exam.id,
      p_cooldown_days: retakeDays,
      p_time_limit_minutes: exam.timeLimitMinutes,
    })
    if (error) throw error

    if (!data?.ok) {
      return NextResponse.json(
        {
          error: 'cooldown',
          nextAvailableAt: data?.next_available_at || null,
          retakeDays,
          fasterPlan: ent.tier === 'free' || ent.tier === 'basic' ? await fasterPlanHint(retakeDays) : null,
        },
        { status: 429 }
      )
    }

    const startedAt: string = data.started_at
    const endsAt = new Date(Date.parse(startedAt) + exam.timeLimitMinutes * 60_000).toISOString()
    return NextResponse.json({ ok: true, attemptId: data.attempt_id, startedAt, endsAt, resumed: !!data.resumed, retakeDays })
  } catch (err: any) {
    console.error('[exam attempts] POST error:', err)
    return NextResponse.json({ error: 'Could not start the exam. Please try again.' }, { status: 500 })
  }
}
