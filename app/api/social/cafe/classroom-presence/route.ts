import { NextResponse } from 'next/server'
import { createRouteClient } from '@/lib/supabase-server'
import { createSupabaseClientForServer } from '@/lib/supabase-client'

// Tracks who is currently seated in a Cafe Classroom room (Agora-backed).
//
// Same pattern as /api/social/cafe/delete-room: identify the caller from
// their session cookie, then do the actual write with the service-role
// client so we don't have to open cafe_classroom_presence up to direct
// client writes via RLS. This table only exists to (a) enforce the
// 15-student cap and (b) let the host see who's raised a hand / can speak
// without relying on Agora's own connection list.
//
// A row is only "counted" while its last_heartbeat is recent (see the
// STALE_AFTER_MS window below and GET's usage of it) so a crashed tab or a
// closed laptop lid doesn't hold a seat forever — the client is expected to
// call 'heartbeat' every ~20s while seated, and 'leave' on the way out.
const STALE_AFTER_SECONDS = 45
const MAX_STUDENTS = 15

export async function POST(request: Request) {
    try {
        const { action, roomId, role, handRaised, canSpeak } = await request.json()

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
                .from('cafe_classroom_presence')
                .delete()
                .eq('room_id', roomId)
                .eq('user_id', user.id)

            return NextResponse.json({ success: true })
        }

        if (action === 'join' || action === 'heartbeat') {
            // Only enforce the cap on the way IN, and only against students
            // (role: 'student') — the host never counts against their own
            // 15-student limit, and an existing occupant re-sending a
            // heartbeat shouldn't get locked out by their own seat.
            if (action === 'join' && role === 'student') {
                const staleCutoff = new Date(Date.now() - STALE_AFTER_SECONDS * 1000).toISOString()
                const { count, error: countError } = await admin
                    .from('cafe_classroom_presence')
                    .select('user_id', { count: 'exact', head: true })
                    .eq('room_id', roomId)
                    .eq('role', 'student')
                    .neq('user_id', user.id)
                    .gte('last_heartbeat', staleCutoff)

                if (countError) {
                    console.error('classroom-presence count error:', countError)
                    return NextResponse.json({ error: countError.message }, { status: 500 })
                }

                if ((count || 0) >= MAX_STUDENTS) {
                    return NextResponse.json(
                        { error: `This room is full (${MAX_STUDENTS}/${MAX_STUDENTS} students). Please try again once a seat opens up.` },
                        { status: 403 }
                    )
                }
            }

            const { data: profile } = await admin
                .from('profiles')
                .select('full_name, avatar_url')
                .eq('id', user.id)
                .maybeSingle()

            const { error: upsertError } = await admin
                .from('cafe_classroom_presence')
                .upsert({
                    room_id: roomId,
                    user_id: user.id,
                    role: role === 'trainer' ? 'trainer' : 'student',
                    full_name: profile?.full_name || null,
                    avatar_url: profile?.avatar_url || null,
                    ...(typeof handRaised === 'boolean' ? { hand_raised: handRaised } : {}),
                    ...(typeof canSpeak === 'boolean' ? { can_speak: canSpeak } : {}),
                    last_heartbeat: new Date().toISOString(),
                }, { onConflict: 'room_id,user_id' })

            if (upsertError) {
                console.error('classroom-presence upsert error:', upsertError)
                return NextResponse.json({ error: upsertError.message }, { status: 500 })
            }

            return NextResponse.json({ success: true })
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    } catch (error: any) {
        console.error('classroom-presence error:', error)
        return NextResponse.json({ error: error.message || 'Unknown error' }, { status: 500 })
    }
}

// Lets the room UI show an accurate "X / 15 seated" count and roster
// without every client needing service-role access.
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const roomId = searchParams.get('roomId')
        if (!roomId) {
            return NextResponse.json({ error: 'roomId is required' }, { status: 400 })
        }

        const admin = createSupabaseClientForServer()
        const staleCutoff = new Date(Date.now() - STALE_AFTER_SECONDS * 1000).toISOString()

        const { data, error } = await admin
            .from('cafe_classroom_presence')
            .select('user_id, role, full_name, avatar_url, hand_raised, can_speak, joined_at')
            .eq('room_id', roomId)
            .gte('last_heartbeat', staleCutoff)

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        const students = (data || []).filter(r => r.role === 'student')
        return NextResponse.json({
            occupants: data || [],
            studentCount: students.length,
            maxStudents: MAX_STUDENTS,
            isFull: students.length >= MAX_STUDENTS,
        })
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Unknown error' }, { status: 500 })
    }
}
