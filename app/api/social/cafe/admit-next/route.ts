import { NextResponse } from 'next/server'
import { createRouteClient } from '@/lib/supabase-server'
import { createSupabaseClientForServer } from '@/lib/supabase-client'
import { resolveRoomAccess } from '@/lib/cafe-room-access'

// Lets the trainer pull the next student out of the waiting queue and into
// the room — the "Waiting Queue" panel's "Admit Next" button (see
// RightSidebar.tsx). Pass a specific `userId` to admit that particular
// waiting student out of order instead of the front of the line (used by
// the panel's per-row "Admit" button). This only flips the queue row to
// status='admitted' — the student's own client (ClassroomQueueGate) picks
// that up and is what actually takes the classroom-presence seat, so this
// route never needs to know about capacity itself.
//
// Auth: the caller must be the room's trainer (host_id owner, or someone who
// entered the trainer code — recorded in cafe_room_roles). The admin
// queue-management panel (/api/admin/cafe/queue) reuses this same logic
// with a broader, admin-only entry point.
const STALE_AFTER_SECONDS = 60

export async function POST(request: Request) {
    try {
        const { roomId, userId } = await request.json()

        if (!roomId) {
            return NextResponse.json({ error: 'roomId is required' }, { status: 400 })
        }

        const routeClient = await createRouteClient()
        const { data: { user }, error: authError } = await routeClient.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
        }

        const admin = createSupabaseClientForServer()

        // Sept 2026: the trainer role is now recorded server-side (see
        // lib/cafe-room-access.ts), so only the room's trainer can admit
        // people. Before the migration runs (`legacy`), keep the old
        // behaviour so the queue panel doesn't break mid-rollout.
        const access = await resolveRoomAccess(admin, roomId, user.id)
        if (!access.legacy && access.role !== 'trainer') {
            return NextResponse.json({ error: 'Only this room\'s trainer can admit students.' }, { status: 403 })
        }

        let targetId = userId as string | undefined

        if (!targetId) {
            const staleCutoff = new Date(Date.now() - STALE_AFTER_SECONDS * 1000).toISOString()
            const { data: next, error: nextError } = await admin
                .from('cafe_classroom_queue')
                .select('id, user_id')
                .eq('room_id', roomId)
                .eq('status', 'waiting')
                .gte('last_heartbeat', staleCutoff)
                .order('priority_score', { ascending: false })
                .order('joined_queue_at', { ascending: true })
                .limit(1)
                .maybeSingle()

            if (nextError) {
                return NextResponse.json({ error: nextError.message }, { status: 500 })
            }
            if (!next) {
                return NextResponse.json({ error: 'Nobody is waiting.' }, { status: 404 })
            }
            targetId = next.user_id
        }

        const { data: admitted, error: admitError } = await admin
            .from('cafe_classroom_queue')
            .update({ status: 'admitted', admitted_at: new Date().toISOString() })
            .eq('room_id', roomId)
            .eq('user_id', targetId)
            .eq('status', 'waiting')
            .select('id, user_id, full_name')
            .maybeSingle()

        if (admitError) {
            console.error('admit-next error:', admitError)
            return NextResponse.json({ error: admitError.message }, { status: 500 })
        }
        if (!admitted) {
            return NextResponse.json({ error: 'That student is no longer waiting.' }, { status: 404 })
        }

        return NextResponse.json({ success: true, admitted })
    } catch (error: any) {
        console.error('admit-next error:', error)
        return NextResponse.json({ error: error.message || 'Unknown error' }, { status: 500 })
    }
}
