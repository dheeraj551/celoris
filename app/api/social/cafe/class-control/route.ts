import { NextResponse } from 'next/server'
import { createRouteClient } from '@/lib/supabase-server'
import { createSupabaseClientForServer } from '@/lib/supabase-client'
import { resolveRoomAccess } from '@/lib/cafe-room-access'
import { classPhase, fillSeats, loadRoomSchedule } from '@/lib/cafe-class-queue'

// The trainer's controls for a scheduled class (see lib/cafe-class-queue.ts):
//   schedule — set the next class time (+ queue/VIP settings); clears the old queue
//   start    — "Start class": seat the top of the queue now
//   end      — clear the schedule; the room goes back to normal walk-in mode
// Only the room's trainer (host, or someone who entered the trainer code) or
// a site admin can use this.

export const dynamic = 'force-dynamic'

const clampInt = (v: unknown, min: number, max: number, fallback: number) => {
  const n = Math.round(Number(v))
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const { roomId, action } = body as { roomId?: string; action?: string }
    if (!roomId || !action) return NextResponse.json({ error: 'roomId and action are required' }, { status: 400 })

    const routeClient = await createRouteClient()
    const { data: { user } } = await routeClient.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    const admin: any = createSupabaseClientForServer()
    const access = await resolveRoomAccess(admin, roomId, user.id)
    if (!access.roomExists) return NextResponse.json({ error: 'Room not found' }, { status: 404 })
    let allowed = access.role === 'trainer'
    if (!allowed) {
      const { data: me } = await admin.from('users').select('role').eq('id', user.id).maybeSingle()
      allowed = me?.role === 'admin' || me?.role === 'super_admin'
    }
    if (!allowed) return NextResponse.json({ error: "Only this room's trainer can manage the class." }, { status: 403 })

    const current = await loadRoomSchedule(admin, roomId)
    if (!current) return NextResponse.json({ error: 'Class scheduling is not set up in the database yet.' }, { status: 500 })

    if (action === 'schedule') {
      const startsMs = Date.parse(String(body.startsAt || ''))
      if (!Number.isFinite(startsMs)) return NextResponse.json({ error: 'Pick a valid start time.' }, { status: 400 })
      if (startsMs < Date.now() - 5 * 60_000) return NextResponse.json({ error: 'The start time is in the past.' }, { status: 400 })
      if (startsMs > Date.now() + 30 * 24 * 60 * 60_000) return NextResponse.json({ error: 'Schedule at most 30 days ahead.' }, { status: 400 })

      const update = {
        class_starts_at: new Date(startsMs).toISOString(),
        class_started_at: null,
        queue_open_minutes: clampInt(body.queueOpenMinutes, 0, 240, current.queue_open_minutes ?? 30),
        vip_reserved_seats: clampInt(body.reservedSeats, 0, 50, current.vip_reserved_seats ?? 3),
        vip_grace_minutes: clampInt(body.graceMinutes, 0, 120, current.vip_grace_minutes ?? 10),
      }
      const { error } = await admin.from('cafe_classrooms').update(update).eq('id', roomId)
      if (error) throw error
      // Fresh numbering for the new class.
      await admin.from('cafe_classroom_queue').delete().eq('room_id', roomId)
      return NextResponse.json({ ok: true, phase: classPhase({ ...current, ...update }) })
    }

    if (action === 'start') {
      const now = new Date().toISOString()
      const update: Record<string, string> = { class_started_at: now }
      // Starting a room that had no schedule turns queue mode on right away.
      if (!current.class_starts_at || classPhase(current).mode === 'open') update.class_starts_at = now
      const { error } = await admin.from('cafe_classrooms').update(update).eq('id', roomId)
      if (error) throw error
      const admitted = await fillSeats(admin, roomId)
      return NextResponse.json({ ok: true, admitted, phase: classPhase({ ...current, ...update }) })
    }

    if (action === 'end') {
      const { error } = await admin.from('cafe_classrooms').update({ class_starts_at: null, class_started_at: null }).eq('id', roomId)
      if (error) throw error
      await admin.from('cafe_classroom_queue').delete().eq('room_id', roomId)
      return NextResponse.json({ ok: true, phase: { mode: 'open' } })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error: any) {
    console.error('class-control error:', error)
    return NextResponse.json({ error: error?.message || 'Unknown error' }, { status: 500 })
  }
}
