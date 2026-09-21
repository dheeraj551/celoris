import { NextResponse } from 'next/server'
import { createSupabaseClientForServer } from '@/lib/supabase-client'

// Admin-only view across EVERY room's waiting queue at once — this is what
// /admin/cafe/queue reads. The student- and trainer-facing views
// (/api/social/cafe/classroom-queue, /api/social/cafe/admit-next) are
// scoped to one room and require the caller to actually be signed in as
// that room's trainer (by code); this route has no such scoping, matching
// this codebase's existing /api/admin/* convention (see
// /api/admin/cafe/rooms) — access is gated client-side only, via the
// admin_session flag.
export const dynamic = 'force-dynamic'

const STALE_AFTER_SECONDS = 60

export async function GET() {
  try {
    const admin = createSupabaseClientForServer()
    const staleCutoff = new Date(Date.now() - STALE_AFTER_SECONDS * 1000).toISOString()

    const { data, error } = await admin
      .from('cafe_classroom_queue')
      .select('id, room_id, user_id, full_name, avatar_url, priority_score, status, joined_queue_at, admitted_at, last_heartbeat, room:cafe_classrooms(id, name, max_students, current_students)')
      .eq('status', 'waiting')
      .gte('last_heartbeat', staleCutoff)
      .order('priority_score', { ascending: false })
      .order('joined_queue_at', { ascending: true })

    if (error) {
      console.error('Admin cafe queue GET error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ entries: data || [] })
  } catch (error: any) {
    console.error('Admin cafe queue GET unexpected error:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}

// { action: 'admit' | 'remove', roomId, userId? }
// 'admit' without userId admits whoever's at the front of that room's line
// (same priority-then-FIFO ordering as /api/social/cafe/admit-next, which
// this deliberately mirrors rather than importing — kept self-contained so
// the admin surface never depends on the trainer-facing route's auth path).
// 'remove' just drops the row — for clearing a no-show without admitting
// them, which the trainer-facing routes have no equivalent for.
export async function POST(request: Request) {
  try {
    const { action, roomId, userId } = await request.json()

    if (!roomId || !action) {
      return NextResponse.json({ error: 'roomId and action are required' }, { status: 400 })
    }

    const admin = createSupabaseClientForServer()

    if (action === 'remove') {
      if (!userId) {
        return NextResponse.json({ error: 'userId is required to remove a specific entry' }, { status: 400 })
      }
      const { error } = await admin
        .from('cafe_classroom_queue')
        .delete()
        .eq('room_id', roomId)
        .eq('user_id', userId)

      if (error) {
        console.error('Admin cafe queue remove error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      return NextResponse.json({ success: true })
    }

    if (action === 'admit') {
      let targetId = userId as string | undefined

      if (!targetId) {
        const staleCutoff = new Date(Date.now() - STALE_AFTER_SECONDS * 1000).toISOString()
        const { data: next, error: nextError } = await admin
          .from('cafe_classroom_queue')
          .select('user_id')
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
          return NextResponse.json({ error: 'Nobody is waiting in that room.' }, { status: 404 })
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
        console.error('Admin cafe queue admit error:', admitError)
        return NextResponse.json({ error: admitError.message }, { status: 500 })
      }
      if (!admitted) {
        return NextResponse.json({ error: 'That student is no longer waiting.' }, { status: 404 })
      }

      return NextResponse.json({ success: true, admitted })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error: any) {
    console.error('Admin cafe queue POST unexpected error:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
