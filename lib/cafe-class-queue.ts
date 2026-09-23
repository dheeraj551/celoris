import { createSupabaseClientForServer } from '@/lib/supabase-client'

// Shared rules for scheduled café classes and their VIP-aware queue.
// See supabase/migrations/20260924_class_queue_vip.sql for the full story.

type AdminClient = ReturnType<typeof createSupabaseClientForServer>

export type PlanTier = 'free' | 'basic' | 'pro' | 'max'

// Matches the queue boosts promised on /pricing.
export const PLAN_PRIORITY: Record<PlanTier, number> = { free: 0, basic: 10, pro: 50, max: 100 }
export const PLAN_LABEL: Record<PlanTier, string> = { free: 'Free', basic: 'Basic', pro: 'Pro', max: 'Max VIP' }

// A scheduled class stops governing the room this long after it starts, so a
// forgotten schedule never locks a room forever.
const CLASS_WINDOW_MS = 6 * 60 * 60 * 1000

export interface RoomSchedule {
  class_starts_at: string | null
  class_started_at: string | null
  queue_open_minutes: number
  vip_reserved_seats: number
  vip_grace_minutes: number
  max_students: number | null
}

export type ClassPhase =
  | { mode: 'open' } // no scheduled class: old behaviour (walk in until full)
  | { mode: 'not_open'; opensAt: string; startsAt: string }
  | { mode: 'queueing'; opensAt: string; startsAt: string }
  | { mode: 'started'; startsAt: string; startedAt: string; graceEndsAt: string }

export function classPhase(room: RoomSchedule | null, now = Date.now()): ClassPhase {
  if (!room?.class_starts_at) return { mode: 'open' }
  const startsMs = Date.parse(room.class_starts_at)
  const opensMs = startsMs - (room.queue_open_minutes ?? 30) * 60_000
  const startedMs = room.class_started_at ? Date.parse(room.class_started_at) : null
  const endsMs = Math.max(startsMs, startedMs ?? 0) + CLASS_WINDOW_MS
  if (now > endsMs) return { mode: 'open' }
  const opensAt = new Date(opensMs).toISOString()
  const startsAt = new Date(startsMs).toISOString()
  if (startedMs) {
    return {
      mode: 'started',
      startsAt,
      startedAt: new Date(startedMs).toISOString(),
      graceEndsAt: new Date(startedMs + (room.vip_grace_minutes ?? 10) * 60_000).toISOString(),
    }
  }
  if (now < opensMs) return { mode: 'not_open', opensAt, startsAt }
  return { mode: 'queueing', opensAt, startsAt }
}

export async function loadRoomSchedule(admin: AdminClient, roomId: string): Promise<RoomSchedule | null> {
  const { data, error } = await (admin as any)
    .from('cafe_classrooms')
    .select('class_starts_at, class_started_at, queue_open_minutes, vip_reserved_seats, vip_grace_minutes, max_students')
    .eq('id', roomId)
    .maybeSingle()
  if (error) {
    // Columns missing (migration not applied yet) → behave like before.
    return null
  }
  return data as RoomSchedule | null
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
