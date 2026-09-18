import { NextResponse } from 'next/server'
import { createRouteClient } from '@/lib/supabase-server'
import { createSupabaseClientForServer } from '@/lib/supabase-client'

// Records a Job Center application server-side and awards the one-time
// +25 XP for it.
//
// Previously, "applying" only ever touched components/skillverify's local
// React state (appliedJobIds), persisted solely to the browser's own
// localStorage — Dheeraj had no real, server-side record of who applied to
// which job at all, and the +25 XP that came with it was just added to
// local state with nothing stopping it from being replayed. The unique
// (user_id, job_id) constraint on job_center_applications means a second
// call for the same job is a harmless no-op for XP (the row insert simply
// conflicts), and now gives a genuine applications record to work from.

const APPLY_XP = 25

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
    const { jobId, jobTier } = body as { jobId?: string; jobTier?: 'public' | 'certified' }

    if (!jobId || (jobTier !== 'public' && jobTier !== 'certified')) {
      return NextResponse.json({ error: 'jobId and a valid jobTier are required' }, { status: 400 })
    }

    const supabase = createSupabaseClientForServer()

    const { data: inserted, error: insertError } = await supabase
      .from('job_center_applications')
      .insert({ user_id: user.id, job_id: jobId, job_tier: jobTier, xp_awarded: APPLY_XP })
      .select('id')
      .maybeSingle()

    // A unique-violation (23505) just means this user already applied to
    // this job before — expected, not an error, and no XP this time. Any
    // other error is logged but still shouldn't block the "Applied" state
    // the user already sees in the UI.
    const alreadyApplied = !!insertError && (insertError as any).code === '23505'
    if (insertError && !alreadyApplied) {
      console.error('Job Center apply insert error:', insertError)
    }

    let currentXP: number | undefined
    let honorScore: number | undefined

    if (inserted) {
      const { data: existingProgress } = await supabase
        .from('job_center_progress')
        .select('current_xp, honor_score')
        .eq('id', user.id)
        .maybeSingle()

      currentXP = (existingProgress?.current_xp ?? 0) + APPLY_XP
      honorScore = existingProgress?.honor_score ?? 100

      await supabase.from('job_center_progress').upsert({
        id: user.id,
        current_xp: currentXP,
        honor_score: honorScore,
        updated_at: new Date().toISOString(),
      })
    }

    return NextResponse.json({
      success: true,
      xpAwarded: inserted ? APPLY_XP : 0,
      currentXP,
      honorScore,
    })
  } catch (error: any) {
    console.error('Job Center apply error:', error)
    return NextResponse.json({ error: error.message || 'Failed to record application' }, { status: 500 })
  }
}
