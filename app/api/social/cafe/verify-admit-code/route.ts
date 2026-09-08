import { NextResponse } from 'next/server'
import { createRouteClient } from '@/lib/supabase-server'
import { createSupabaseClientForServer } from '@/lib/supabase-client'

// Checks a student-entered "admit code" against the room's saved code.
//
// Same pattern as /api/social/cafe/delete-room: identify the caller from
// their session cookie, then read/compare with the service-role client.
// This is deliberately the ONLY place that ever reads admit_code — the
// lobby list and the in-room "Class Info" fetch both select an explicit
// column list that omits it (see app/social/page.tsx and ClassroomRoom.tsx),
// so the real code is never shipped to a student's browser at any point.
//
// Note: this stops casual gatecrashing (the intended use — a trainer shares
// a code with their own students), not a determined attacker with direct
// API access, since the underlying `cafe_classrooms` row is still readable
// via Supabase's standard RLS-gated REST/JS client for any active room. If
// that stronger guarantee is ever needed, admit_code should move behind a
// tighter RLS policy or a dedicated view — flagged here rather than done
// silently, since getting that wrong risks locking the whole café out.
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
      .select('admit_code, host_id')
      .eq('id', roomId)
      .maybeSingle()

    if (error) {
      console.error('verify-admit-code lookup error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 })
    }

    // The host never needs their own code.
    if (room.host_id === user.id) {
      return NextResponse.json({ ok: true })
    }

    const required = (room.admit_code || '').trim()
    if (!required) {
      // No code set on this room — nothing to gate.
      return NextResponse.json({ ok: true })
    }

    const provided = typeof code === 'string' ? code.trim() : ''
    if (provided && provided.toLowerCase() === required.toLowerCase()) {
      return NextResponse.json({ ok: true })
    }

    return NextResponse.json(
      { ok: false, error: 'Incorrect admit code. Check with your trainer.' },
      { status: 403 }
    )
  } catch (error: any) {
    console.error('verify-admit-code error:', error)
    return NextResponse.json({ error: error.message || 'Unknown error' }, { status: 500 })
  }
}
