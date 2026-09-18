import { NextResponse } from 'next/server'
import { createRouteClient } from '@/lib/supabase-server'
import { createSupabaseClientForServer } from '@/lib/supabase-client'

// Server-authoritative version of the Job Center's "loyalty" time-XP tick.
//
// This used to be a client-side setInterval in components/skillverify/App.tsx
// that mutated local React state directly (+5 XP every 60s the tab was
// open, regardless of whether it was visible or even in the foreground),
// synced to Supabase only as a side effect of the next exam completion —
// meaning the real source of truth for a stat that gates paid work access
// was whatever number sat in the browser's own, editable memory/
// localStorage. This route makes the server the sole judge of how much
// time-XP has actually been earned: it only awards XP when at least
// MIN_INTERVAL_SECONDS of real wall-clock time has passed since the last
// award *it* recorded (never since whatever the client claims), and caps
// how much time-XP can be earned in one calendar day so a pinned or
// backgrounded tab can't farm XP indefinitely. The client calls this
// roughly once a minute, and only while the tab is visible (see App.tsx) —
// that's a courtesy to make "time spent" mean real engagement, not the
// actual security boundary, which is the cooldown + daily cap enforced
// here regardless of what the client does.

const MIN_INTERVAL_SECONDS = 55
const XP_PER_TICK = 5
const DAILY_CAP_XP = 300 // roughly 60 real minutes/day of loyalty XP

export async function POST() {
  try {
    const routeClient = await createRouteClient()
    const {
      data: { user },
    } = await routeClient.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Sign in required' }, { status: 401 })
    }

    const supabase = createSupabaseClientForServer()
    const { data: row } = await supabase
      .from('job_center_progress')
      .select('current_xp, honor_score, last_activity_synced_at, time_xp_today, time_xp_date')
      .eq('id', user.id)
      .maybeSingle()

    const now = new Date()
    const today = now.toISOString().slice(0, 10)

    const currentXP = row?.current_xp ?? 0
    const honorScore = row?.honor_score ?? 100
    let timeXPToday = row?.time_xp_date === today ? row?.time_xp_today ?? 0 : 0

    const lastSync = row?.last_activity_synced_at ? new Date(row.last_activity_synced_at) : null
    const elapsedSeconds = lastSync ? (now.getTime() - lastSync.getTime()) / 1000 : Infinity

    const cappedBefore = timeXPToday >= DAILY_CAP_XP
    let awarded = 0
    let nextXP = currentXP

    if (elapsedSeconds >= MIN_INTERVAL_SECONDS && !cappedBefore) {
      awarded = XP_PER_TICK
      nextXP = currentXP + awarded
      timeXPToday += awarded

      await supabase.from('job_center_progress').upsert({
        id: user.id,
        current_xp: nextXP,
        honor_score: honorScore,
        last_activity_synced_at: now.toISOString(),
        time_xp_today: timeXPToday,
        time_xp_date: today,
        updated_at: now.toISOString(),
      })
    } else if (!row) {
      // First-ever ping for this user — create the row so future pings
      // have a last_activity_synced_at to measure real elapsed time from,
      // without awarding anything yet.
      await supabase.from('job_center_progress').upsert({
        id: user.id,
        current_xp: currentXP,
        honor_score: honorScore,
        last_activity_synced_at: now.toISOString(),
        time_xp_today: timeXPToday,
        time_xp_date: today,
        updated_at: now.toISOString(),
      })
    }

    return NextResponse.json({
      success: true,
      awarded,
      currentXP: nextXP,
      honorScore,
      cappedToday: timeXPToday >= DAILY_CAP_XP,
    })
  } catch (error: any) {
    console.error('Job Center activity ping error:', error)
    return NextResponse.json({ error: error.message || 'Failed to sync activity' }, { status: 500 })
  }
}
