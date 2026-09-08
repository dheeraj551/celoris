import { NextResponse } from 'next/server'
import { createRouteClient } from '@/lib/supabase-server'
import { createSupabaseClientForServer } from '@/lib/supabase-client'

// Checks a code entered by whoever's trying to join a room against the
// room's saved codes — there are now TWO: a trainer_code (grants the
// trainer/host-equivalent experience in the room — mic, podium, calling on
// students — without them needing to be the DB row's actual host_id owner)
// and a student_code (lets an ordinary student in). Whichever one matches
// decides the role the joiner gets; if the caller already IS the room's
// host_id, they always get straight in as 'host' without needing any code.
//
// Same pattern as /api/social/cafe/delete-room: identify the caller from
// their session cookie, then read/compare with the service-role client.
// This is deliberately the ONLY place that ever reads trainer_code/
// student_code — the lobby list and the in-room class-info fetch both
// select an explicit column list that omits them (see app/social/page.tsx
// and ClassroomRoom.tsx), so neither code is ever shipped to a browser
// outside of this one comparison. The room's own codes are also no longer
// editable from inside the classroom at all — only from the admin
// dashboard's Café Rooms panel (app/admin/social) — so a trainer can share
// their code without ever being able to see or change it themselves.
//
// Note: this stops casual gatecrashing (the intended use — the admin/
// trainer shares a code with their own students), not a determined
// attacker with direct API access, since the underlying `cafe_classrooms`
// row is still readable via Supabase's standard RLS-gated REST/JS client
// for any active room. If that stronger guarantee is ever needed, these
// code columns should move behind a tighter RLS policy or a dedicated view
// — flagged here rather than done silently, since getting that wrong risks
// locking the whole café out.
export async function POST(request: Request) {
  try {
    const { roomId, code } = await request.json()

    if (!roomId) {
      return NextResponse.json({ error: 'roomId is required' }, { status: 400 })
    }

    const routeClient = await createRouteClient()
    const { data: { user }, error: authError } = await routeClient.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const admin = createSupabaseClientForServer()

    const { data: room, error } = await admin
      .from('cafe_classrooms')
      .select('trainer_code, student_code, host_id')
      .eq('id', roomId)
      .maybeSingle()

    if (error) {
      console.error('verify-admit-code lookup error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 })
    }

    // The room's actual DB owner (legacy rooms created directly by a user,
    // before room creation moved to admin-only) never needs a code.
    if (room.host_id === user.id) {
      return NextResponse.json({ ok: true, role: 'host' })
    }

    const requiredTrainer = (room.trainer_code || '').trim()
    const requiredStudent = (room.student_code || '').trim()
    const provided = typeof code === 'string' ? code.trim() : ''

    if (requiredTrainer && provided && provided.toLowerCase() === requiredTrainer.toLowerCase()) {
      return NextResponse.json({ ok: true, role: 'trainer' })
    }

    if (requiredStudent && provided && provided.toLowerCase() === requiredStudent.toLowerCase()) {
      return NextResponse.json({ ok: true, role: 'student' })
    }

    // Neither code is set on this room — nothing to gate.
    if (!requiredTrainer && !requiredStudent) {
      return NextResponse.json({ ok: true, role: 'student' })
    }

    return NextResponse.json(
      { ok: false, error: 'Incorrect code. Check with your trainer or the Celoris team.' },
      { status: 403 }
    )
  } catch (error: any) {
    console.error('verify-admit-code error:', error)
    return NextResponse.json({ error: error.message || 'Unknown error' }, { status: 500 })
  }
}
