import { createSupabaseClientForServer } from '@/lib/supabase-client'

// Server-side answer to "what is this user allowed to do in this café room?"
//
// Before Sept 2026 the trainer/student role only lived in the browser (the
// lobby page kept it in React state after /verify-admit-code said which code
// matched), so every API that cared — the Agora token route, presence,
// admit-next — had to trust whatever role the client sent. Now
// verify-admit-code also records the role in `cafe_room_roles`, and every
// route resolves it here instead.
//
// Rules:
//   - the room's DB owner (host_id)              -> 'trainer'
//   - a recent cafe_room_roles grant (12 hours)   -> that role
//   - room has no trainer/student code at all     -> 'student'
//   - anything else                               -> 'none' (not admitted)
//
// Rollout safety: if the cafe_room_roles table doesn't exist yet (the SQL
// migration in supabase/migrations/20260923_cafe_whiteboard_room.sql hasn't
// been run), this returns `legacy: true` so callers can fall back to the old
// client-claimed role instead of locking every trainer out of the 3D room.

export type RoomRole = 'trainer' | 'student' | 'none'

export interface RoomAccess {
  role: RoomRole
  roomExists: boolean
  category: string | null
  roomName: string | null
  /** True when cafe_room_roles is missing (migration not applied yet). */
  legacy: boolean
}

const GRANT_TTL_MS = 12 * 60 * 60 * 1000

type AdminClient = ReturnType<typeof createSupabaseClientForServer>

function isMissingTable(error: any) {
  return !!error && (error.code === '42P01' || /cafe_room_roles/.test(error.message || '') && /does not exist|schema cache/i.test(error.message || ''))
}

export async function resolveRoomAccess(admin: AdminClient, roomId: string, userId: string): Promise<RoomAccess> {
  const { data: room } = await admin
    .from('cafe_classrooms')
    .select('id, name, category, host_id, is_active, trainer_code, student_code')
    .eq('id', roomId)
    .maybeSingle()

  if (!room || room.is_active === false) {
    return { role: 'none', roomExists: false, category: null, roomName: null, legacy: false }
  }

  const base = { roomExists: true, category: room.category as string, roomName: room.name as string }

  if (room.host_id && room.host_id === userId) {
    return { ...base, role: 'trainer', legacy: false }
  }

  const { data: grant, error } = await admin
    .from('cafe_room_roles')
    .select('role, granted_at')
    .eq('room_id', roomId)
    .eq('user_id', userId)
    .maybeSingle()

  if (error && isMissingTable(error)) {
    return { ...base, role: 'student', legacy: true }
  }

  if (grant && Date.now() - new Date(grant.granted_at).getTime() < GRANT_TTL_MS) {
    return { ...base, role: grant.role === 'trainer' ? 'trainer' : 'student', legacy: false }
  }

  const hasCodes = !!(room.trainer_code || '').trim() || !!(room.student_code || '').trim()
  return { ...base, role: hasCodes ? 'none' : 'student', legacy: false }
}

/** Records the role a code unlocked. Silently no-ops before the migration. */
export async function grantRoomRole(admin: AdminClient, roomId: string, userId: string, role: 'trainer' | 'student') {
  const { error } = await admin
    .from('cafe_room_roles')
    .upsert({ room_id: roomId, user_id: userId, role, granted_at: new Date().toISOString() }, { onConflict: 'room_id,user_id' })
  if (error && !isMissingTable(error)) {
    console.error('grantRoomRole error:', error)
  }
}

/** Agora/Supabase channel names for café rooms look like `classroom_<roomId>`. */
export function roomIdFromClassroomChannel(channelName: string): string | null {
  if (!channelName.startsWith('classroom_')) return null
  const id = channelName.slice('classroom_'.length)
  return /^[0-9a-f-]{36}$/i.test(id) ? id : null
}
