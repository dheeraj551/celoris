import { NextResponse } from 'next/server'
import { createRouteClient } from '@/lib/supabase-server'
import { createSupabaseClientForServer } from '@/lib/supabase-client'

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
const STALE_AFTER_SECONDS = 60

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
            // Already have a row (waiting OR admitted) — don't reset
            // joined_queue_at/priority_score/redeemed flags, just refresh
            // the heartbeat and report back where they stand. This is what
            // makes a page refresh while waiting not cost you your place in
            // line, and also what lets a client that reconnects after being
            // admitted find out immediately without re-queueing.
            const { data: existing } = await admin
                .from('cafe_classroom_queue')
                .select('id, status, priority_score, joined_queue_at')
                .eq('room_id', roomId)
                .eq('user_id', user.id)
                .maybeSingle()

            if (existing) {
                if (existing.status === 'waiting') {
                    await admin
                        .from('cafe_classroom_queue')
                        .update({ last_heartbeat: new Date().toISOString() })
                        .eq('id', existing.id)
                }
                return NextResponse.json({ entry: existing })
            }

            const { data: profile } = await admin
                .from('profiles')
                .select('full_name, avatar_url')
                .eq('id', user.id)
                .maybeSingle()

            const { data: inserted, error: insertError } = await admin
                .from('cafe_classroom_queue')
                .insert({
                    room_id: roomId,
                    user_id: user.id,
                    full_name: profile?.full_name || null,
                    avatar_url: profile?.avatar_url || null,
                    status: 'waiting',
                    last_heartbeat: new Date().toISOString(),
                })
                .select('id, status, priority_score, joined_queue_at')
                .single()

            if (insertError) {
                console.error('classroom-queue join error:', insertError)
                return NextResponse.json({ error: insertError.message }, { status: 500 })
            }

            return NextResponse.json({ entry: inserted })
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
        const staleCutoff = new Date(Date.now() - STALE_AFTER_SECONDS * 1000).toISOString()

        const { data, error } = await admin
            .from('cafe_classroom_queue')
            .select('id, user_id, full_name, avatar_url, priority_score, status, joined_queue_at, admitted_at')
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

        return NextResponse.json({
            queue,
            totalWaiting: queue.length,
            myPosition: myIndex >= 0 ? myIndex + 1 : null,
            myEntry: myIndex >= 0 ? queue[myIndex] : null,
        })
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Unknown error' }, { status: 500 })
    }
}
