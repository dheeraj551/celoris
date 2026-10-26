import { createSupabaseClientForServer } from '@/lib/supabase-client'
import { nextSession } from '@/lib/class-schedule'
import { BATCH_CYCLE_DAYS, BOOTCAMPS, FIRST_BATCH_START, sessionInstants, currentBatchStart, nextBatchStart } from '@/lib/bootcamps'

// Shared rules for scheduled café classes and their queue.
// See supabase/migrations/20260924_class_queue_vip.sql for the original story.
//
// Oct 2026 rules:
//   - A room is only open to students from `queue_open_minutes` (30) before a
//     class until the class ends. Outside that window students can't enter.
//     The trainer (trainer code) can always enter, and the trainer or an admin
//     can open the room early with "Start class".
//   - Class times come from, in this order: a one-off time set with "Schedule"
//     (class_starts_at), the room's weekly slot (next_class_at), and the free
//     bootcamp sessions taught in this room (lib/bootcamps.ts).
//   - Pro and Max members walk straight into a seat, with no queue.
//   - Everyone else joins the line in the order they press Enter, and is let in
//     automatically when the class starts, as seats are free.

type AdminClient = ReturnType<typeof createSupabaseClientForServer>

export type PlanTier = 'free' | 'basic' | 'pro' | 'max'

// Queue order inside the line (Basic keeps the small boost promised on /pricing).
export const PLAN_PRIORITY: Record<PlanTier, number> = { free: 0, basic: 10, pro: 50, max: 100 }
export const PLAN_LABEL: Record<PlanTier, string> = { free: 'Free', basic: 'Basic', pro: 'Pro', max: 'Max VIP' }

/** Plans that skip the line and get a seat straight away. */
export const DIRECT_ENTRY_TIERS: PlanTier[] = ['pro', 'max']
export const isDirectEntry = (tier: PlanTier) => DIRECT_ENTRY_TIERS.includes(tier)

// A manual "Start class" keeps the room open at most this long.
const MANUAL_WINDOW_MS = 6 * 60 * 60 * 1000
// Students can still join for a little while after the scheduled end.
const END_GRACE_MS = 15 * 60 * 1000

export interface RoomSchedule {
  id?: string
  class_starts_at: string | null
  class_started_at: string | null
  class_ended_at?: string | null
  queue_open_minutes: number
  vip_reserved_seats: number
  vip_grace_minutes: number
  max_students: number | null
  next_class_at?: string | null
  class_duration_minutes?: number | null
  repeats_weekly?: boolean | null
}

export type ClassPhase =
  | { mode: 'open' } // scheduling columns missing (migration not applied): old walk-in behaviour
  | { mode: 'closed' } // no class scheduled: students can't enter
  | { mode: 'not_open'; opensAt: string; startsAt: string }
  | { mode: 'queueing'; opensAt: string; startsAt: string }
  | { mode: 'started'; opensAt: string; startsAt: string; startedAt: string; graceEndsAt: string; autoStarted?: boolean }

interface Session {
  start: number
  end: number
}

function roomSessions(room: RoomSchedule, now: number): Session[] {
  const durationMs = Math.max(15, room.class_duration_minutes || 60) * 60_000
  const out: Session[] = []
  if (room.class_starts_at) {
    const s = Date.parse(room.class_starts_at)
    if (Number.isFinite(s)) out.push({ start: s, end: s + durationMs })
  }
  const weekly = nextSession(
    { next_class_at: room.next_class_at, class_duration_minutes: room.class_duration_minutes, repeats_weekly: room.repeats_weekly },
    new Date(now - END_GRACE_MS)
  )
  if (weekly) out.push({ start: weekly.start.getTime(), end: weekly.end.getTime() })
  if (room.id) {
    for (const b of BOOTCAMPS) {
      if (b.classroomId !== room.id) continue
      // currentBatchStart moves on after a batch's 2nd class, so also look one batch back.
      const batch = currentBatchStart(new Date(now), b)
      const prev = new Date(Date.parse(`${batch}T00:00:00Z`) - BATCH_CYCLE_DAYS * 86_400_000).toISOString().slice(0, 10)
      const batches = prev >= FIRST_BATCH_START ? [prev, batch, nextBatchStart(batch)] : [batch, nextBatchStart(batch)]
      for (const start of batches) {
        for (const d of sessionInstants(b, start)) out.push({ start: d.getTime(), end: d.getTime() + 60 * 60_000 })
      }
    }
  }
  return out.sort((a, b) => a.start - b.start)
}

export function classPhase(room: RoomSchedule | null, now = Date.now()): ClassPhase {
  if (!room) return { mode: 'open' }
  const openMs = (room.queue_open_minutes ?? 30) * 60_000
  const graceMs = (room.vip_grace_minutes ?? 10) * 60_000
  const endedMs = room.class_ended_at ? Date.parse(room.class_ended_at) : null
  const startedMs = room.class_started_at ? Date.parse(room.class_started_at) : null

  // The session whose window we're in (or the next one), skipping one the trainer ended.
  const sessions = roomSessions(room, now).filter((s) => !(endedMs && endedMs >= s.start - openMs && endedMs <= s.end + END_GRACE_MS))
  const current = sessions.find((s) => now >= s.start - openMs && now <= s.end + END_GRACE_MS)
  const iso = (ms: number) => new Date(ms).toISOString()

  // Trainer/admin pressed "Start class" (any time, even without a schedule).
  if (startedMs && now - startedMs < MANUAL_WINDOW_MS && !(endedMs && endedMs > startedMs)) {
    const belongs = !current || startedMs >= current.start - openMs
    if (belongs) {
      const startsAt = current ? Math.min(current.start, startedMs) : startedMs
      return {
        mode: 'started',
        opensAt: iso(Math.min(startsAt - openMs, startedMs)),
        startsAt: iso(startsAt),
        startedAt: iso(startedMs),
        graceEndsAt: iso(startedMs + graceMs),
      }
    }
  }

  if (current) {
    if (now >= current.start) {
      return {
        mode: 'started',
        opensAt: iso(current.start - openMs),
        startsAt: iso(current.start),
        startedAt: iso(current.start),
        graceEndsAt: iso(current.start + graceMs),
        autoStarted: true,
      }
    }
    return { mode: 'queueing', opensAt: iso(current.start - openMs), startsAt: iso(current.start) }
  }

  const upcoming = sessions.find((s) => s.start - openMs > now)
  if (upcoming) return { mode: 'not_open', opensAt: iso(upcoming.start - openMs), startsAt: iso(upcoming.start) }
  return { mode: 'closed' }
}

export async function loadRoomSchedule(admin: AdminClient, roomId: string): Promise<RoomSchedule | null> {
  const { data, error } = await (admin as any)
    .from('cafe_classrooms')
    .select('id, class_starts_at, class_started_at, class_ended_at, queue_open_minutes, vip_reserved_seats, vip_grace_minutes, max_students, next_class_at, class_duration_minutes, repeats_weekly')
    .eq('id', roomId)
    .maybeSingle()
  if (error) {
    // Columns missing (migration not applied yet) → behave like before.
    return null
  }
  return data as RoomSchedule | null
}

/**
 * When a scheduled class reaches its start time, mark it started in the DB so
 * cafe_fill_classroom_seats (which needs class_started_at) starts letting the
 * line in — no trainer action needed.
 */
export async function ensureSessionStarted(admin: AdminClient, roomId: string, phase: ClassPhase): Promise<void> {
  if (phase.mode !== 'started' || !phase.autoStarted) return
  const { error } = await (admin as any)
    .from('cafe_classrooms')
    .update({ class_started_at: phase.startedAt })
    .eq('id', roomId)
    .or(`class_started_at.is.null,class_started_at.lt.${phase.opensAt}`)
  if (error) console.warn('ensureSessionStarted error:', error.message)
}

export async function getUserPlan(admin: AdminClient, userId: string): Promise<PlanTier> {
  const { data } = await (admin as any)
    .from('user_plans')
    .select('plan_tier, expires_at')
    .eq('user_id', userId)
    .maybeSingle()
  if (!data) return 'free'
  if (data.expires_at && Date.parse(data.expires_at) < Date.now()) return 'free'
  const tier = String(data.plan_tier) as PlanTier
  return tier in PLAN_PRIORITY ? tier : 'free'
}

/** Admits the next people in line into any free seats (atomic, in the DB). */
export async function fillSeats(admin: AdminClient, roomId: string): Promise<number> {
  const { data, error } = await (admin as any).rpc('cafe_fill_classroom_seats', { p_room_id: roomId })
  if (error) {
    console.warn('cafe_fill_classroom_seats error:', error.message)
    return 0
  }
  return Number(data) || 0
}

/** Pro/Max: give this user a seat right away if the room has one (atomic, in the DB). */
export async function admitDirect(admin: AdminClient, roomId: string, userId: string): Promise<boolean> {
  const { data, error } = await (admin as any).rpc('cafe_admit_direct', { p_room_id: roomId, p_user_id: userId })
  if (error) {
    console.warn('cafe_admit_direct error:', error.message)
    return false
  }
  return data === true
}
