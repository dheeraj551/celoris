import { NextResponse } from 'next/server'
import { createRouteClient } from '@/lib/supabase-server'
import { createSupabaseClientForServer } from '@/lib/supabase-client'
import { resolveRoomAccess } from '@/lib/cafe-room-access'
import { classPhase, fillSeats, getUserPlan, loadRoomSchedule, PLAN_PRIORITY } from '@/lib/cafe-class-queue'

// Manages the classroom waiting queue — a student joins this only once
// classroom-presence's 'join' returns a "room full" error (see
// ClassroomRoom.tsx's roomFullError handling and ClassroomQueueGate.tsx),
// and the trainer admits people one at a time with
// /api/social/cafe/admit-next as seats free up. Boost codes (see
// redeem-boost-code) raise a waiting student's priority_score so they jump
// ahead of plain FIFO.
//
// Same auth pattern as classroom-presence: identify the caller from their
// session cookie, then do the actual read/write with the service-role
// client so cafe_classroom_queue doesn't need to be opened up to direct
// client writes via RLS. Its only client-facing RLS policy is a narrow
// SELECT-your-own-row grant (see CLASSROOM_QUEUE_SCHEMA.sql) — that alone
// can't power the trainer's "see everyone waiting" view, which is exactly
// why GET below reads with the service-role client instead of relying on
// Realtime/RLS for that side.
// Sept 2026 — scheduled classes (see lib/cafe-class-queue.ts): when a room
// has a scheduled class, EVERY student goes through this queue (it opens 30
// min before the start), ordered by membership plan then arrival time, and
// seats are filled automatically by cafe_fill_classroom_seats once the
// trainer presses Start. Rooms without a schedule behave exactly as before.
const STALE_AFTER_SECONDS = 60

function boostTotal(row: any) {
    return (row?.redeemed_boost_10 ? 10 : 0) + (row?.redeemed_boost_50 ? 50 : 0) + (row?.redeemed_boost_100 ? 100 : 0)
}

const ENTRY_COLUMNS = 'id, status, priority_score, joined_queue_at, plan_tier, admitted_at'

export async function POST(request: Request) {
    try {
        const { action, roomId } = await request.json()

        if (!roomId || !action) {
            return NextResponse.json({ error: 'roomId and action are required' }, { status: 400 })
        }

        const routeClient = await createRouteClient()
        const { data: { user }, error: authError } = await routeClient.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
        }

        const admin = createSupabaseClientForServer()

        if (action === 'leave') {
            await admin
                .from('cafe_classroom_queue')
                .delete()
                .eq('room_id', roomId)
                .eq('user_id', user.id)

            return NextResponse.json({ success: true })
        }

        if (action === 'heartbeat') {
            await admin
                .from('cafe_classroom_queue')
                .update({ last_heartbeat: new Date().toISOString() })
                .eq('room_id', roomId)
                .eq('user_id', user.id)
                .eq('status', 'waiting')

            return NextResponse.json({ success: true })
        }

        if (action === 'join') {
            const schedule = await loadRoomSchedule(admin, roomId)
            const phase = classPhase(schedule)
            if (phase.mode === 'not_open') {
                // Too early — the waiting screen shows a countdown and retries.
                return NextResponse.json({ state: 'not_open', phase })
            }

            const plan = await getUserPlan(admin, user.id)
            const now = new Date().toISOString()

            // Already have a row — keep their place in line (a refresh must
            // never cost you your spot), but pick up a plan upgrade. An
            // 'expired' row (admitted but never took the seat) rejoins at the back.
            const { data: existing } = await admin
                .from('cafe_classroom_queue')
                .select('id, status, redeemed_boost_10, redeemed_boost_50, redeemed_boost_100')
                .eq('room_id', roomId)
                .eq('user_id', user.id)
                .maybeSingle()

            if (existing) {
                const priority = PLAN_PRIORITY[plan] + boostTotal(existing)
                if (existing.status === 'expired') {
                    await admin
                        .from('cafe_classroom_queue')
                        .update({ status: 'waiting', joined_queue_at: now, admitted_at: null, last_heartbeat: now, plan_tier: plan, priority_score: priority })
                        .eq('id', existing.id)
                } else if (existing.status === 'waiting') {
                    await admin
                        .from('cafe_classroom_queue')
                        .update({ last_heartbeat: now, plan_tier: plan, priority_score: priority })
                        .eq('id', existing.id)
                }
            } else {
                const { data: profile } = await admin
                    .from('profiles')
                    .select('full_name, avatar_url')
                    .eq('id', user.id)
                    .maybeSingle()

                const { error: insertError } = await admin
                    .from('cafe_classroom_queue')
                    .insert({
                        room_id: roomId,
                        user_id: user.id,
                        full_name: profile?.full_name || null,
                        avatar_url: profile?.avatar_url || null,
                        status: 'waiting',
                        plan_tier: plan,
                        priority_score: PLAN_PRIORITY[plan],
                        last_heartbeat: now,
                    })

                if (insertError) {
                    console.error('classroom-queue join error:', insertError)
                    return NextResponse.json({ error: insertError.message }, { status: 500 })
                }
            }

            // Class already running: a seat may be free right now (e.g. a
            // paid member arriving within the grace period) — admit instantly.
            if (phase.mode === 'started') await fillSeats(admin, roomId)

            const { data: entry } = await admin
                .from('cafe_classroom_queue')
                .select(ENTRY_COLUMNS)
                .eq('room_id', roomId)
                .eq('user_id', user.id)
                .maybeSingle()

            return NextResponse.json({ entry, phase, plan })
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    } catch (error: any) {
        console.error('classroom-queue error:', error)
        return NextResponse.json({ error: error.message || 'Unknown error' }, { status: 500 })
    }
}

// Lets both the waiting student (their own position) and the trainer (the
// full ordered list, so they can pick who to admit) see the queue. Same
// no-server-side-role-check posture as the rest of this app's café admin
// surface (e.g. /api/admin/cafe/rooms) — "trainer" here is resolved
// client-side from matching the room's trainer_code, not from a persisted
// DB relationship, so there's no server-side identity to check against.
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const roomId = searchParams.get('roomId')
        if (!roomId) {
            return NextResponse.json({ error: 'roomId is required' }, { status: 400 })
        }

        const routeClient = await createRouteClient()
        const { data: { user } } = await routeClient.auth.getUser()

        const admin = createSupabaseClientForServer()
        const schedule = await loadRoomSchedule(admin, roomId)
        const phase = classPhase(schedule)

        // Waiting students poll this every few seconds, so this doubles as
        // the "a seat just freed up → admit the next person" trigger.
        if (phase.mode === 'started') await fillSeats(admin, roomId)

        const staleCutoff = new Date(Date.now() - STALE_AFTER_SECONDS * 1000).toISOString()
        const { data, error } = await admin
            .from('cafe_classroom_queue')
            .select('id, user_id, full_name, avatar_url, priority_score, plan_tier, status, joined_queue_at, admitted_at')
            .eq('room_id', roomId)
            .eq('status', 'waiting')
            .gte('last_heartbeat', staleCutoff)
            .order('priority_score', { ascending: false })
            .order('joined_queue_at', { ascending: true })

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        const queue = data || []
        const myIndex = user ? queue.findIndex((q: any) => q.user_id === user.id) : -1

        // The caller's own row in ANY status, so the waiting screen can see
        // the moment it flips to 'admitted'.
        let myEntry: any = myIndex >= 0 ? queue[myIndex] : null
        if (user && !myEntry) {
            const { data: mine } = await admin
                .from('cafe_classroom_queue')
                .select(ENTRY_COLUMNS)
                .eq('room_id', roomId)
                .eq('user_id', user.id)
                .maybeSingle()
            myEntry = mine || null
        }

        // Names/photos of everyone waiting are only for the room's trainer.
        const isTrainer = user ? (await resolveRoomAccess(admin, roomId, user.id)).role === 'trainer' : false

        return NextResponse.json({
            queue: isTrainer ? queue : [],
            totalWaiting: queue.length,
            vipWaiting: queue.filter((q: any) => q.plan_tier && q.plan_tier !== 'free').length,
            myPosition: myIndex >= 0 ? myIndex + 1 : null,
            myEntry,
            phase,
            settings: schedule
                ? {
                      classStartsAt: schedule.class_starts_at,
                      queueOpenMinutes: schedule.queue_open_minutes,
                      vipReservedSeats: schedule.vip_reserved_seats,
                      vipGraceMinutes: schedule.vip_grace_minutes,
                      maxStudents: schedule.max_students || 15,
                  }
                : null,
        })
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Unknown error' }, { status: 500 })
    }
}
