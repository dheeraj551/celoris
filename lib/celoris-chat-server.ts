/**
 * Server-side helpers for Celoris Chat (/api/celoris-chat/*).
 *
 * Celoris Chat is private 1:1 chat between friends. Friends are made with a
 * share code: you enter someone's code, they accept, and only then can you
 * message each other. Rules enforced here (never trust the browser):
 *   - only friends can message each other
 *   - trainers and students can never be friends (either direction)
 *   - a block in either direction stops requests and messages
 *   - phone numbers, emails and outside messaging links are hidden
 *   - rate limits on code guesses, requests, messages and reports
 *
 * All tables are read-only for signed-in users (their own rows) via RLS;
 * every write goes through these routes with the service-role client.
 */
import { NextResponse } from 'next/server'
import { createRouteClient } from '@/lib/supabase-server'
import { createSupabaseClientForServer } from '@/lib/supabase-client'

export type AdminClient = ReturnType<typeof createSupabaseClientForServer>

export interface ChatProfileRow {
  user_id: string
  share_code: string
  display_name: string
  avatar_url: string | null
  discoverable: boolean
  is_banned: boolean
  ban_reason: string | null
  code_reset_at: string | null
  bio: string | null
  interests: string[]
  discoverable_since: string | null
}

const PROFILE_COLUMNS =
  'user_id, share_code, display_name, avatar_url, discoverable, is_banned, ban_reason, code_reset_at, bio, interests, discoverable_since'

export function jsonError(error: string, status = 400) {
  return NextResponse.json({ error }, { status })
}

/** Identify the caller from their session cookie. Returns null if signed out. */
export async function getCaller() {
  const routeClient: any = await createRouteClient()
  const {
    data: { user },
    error,
  } = await routeClient.auth.getUser()
  if (error || !user) return null
  return user as { id: string; email?: string; user_metadata?: Record<string, any> }
}

export function adminClient(): AdminClient {
  return createSupabaseClientForServer()
}

// ---------------------------------------------------------------------------
// Share codes
// ---------------------------------------------------------------------------

// No 0/O, 1/I/L so codes are easy to read out loud or type from a screenshot.
const CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
const CODE_LENGTH = 8

export function generateShareCode(): string {
  const bytes = new Uint8Array(CODE_LENGTH)
  crypto.getRandomValues(bytes)
  let out = ''
  for (let i = 0; i < bytes.length; i++) out += CODE_ALPHABET[bytes[i] % CODE_ALPHABET.length]
  return `CEL-${out}`
}

/** Accepts "cel-7k2m 9qab", "CEL7K2M9QAB", "7K2M9QAB" … and returns "CEL-7K2M9QAB" (or null). */
export function normalizeShareCode(input: unknown): string | null {
  if (typeof input !== 'string') return null
  let s = input.toUpperCase().replace(/[^A-Z0-9]/g, '')
  if (s.startsWith('CEL')) s = s.slice(3)
  if (s.length !== CODE_LENGTH) return null
  for (const ch of s) if (!CODE_ALPHABET.includes(ch)) return null
  return `CEL-${s}`
}

// ---------------------------------------------------------------------------
// Profiles
// ---------------------------------------------------------------------------

async function lookupDisplayName(admin: AdminClient, user: { id: string; user_metadata?: Record<string, any> }) {
  const [{ data: u }, { data: p }] = await Promise.all([
    admin.from('users').select('full_name').eq('id', user.id).maybeSingle(),
    admin.from('profiles').select('full_name, name, avatar_url').eq('id', user.id).maybeSingle(),
  ])
  const meta = user.user_metadata || {}
  const name =
    (u?.full_name || p?.full_name || p?.name || meta.full_name || meta.name || '').toString().trim() ||
    'Celoris member'
  const avatar = (p?.avatar_url || meta.avatar_url || meta.picture || null) as string | null
  return { name: name.slice(0, 60), avatar }
}

/** The caller's chat profile, created on first visit (with a fresh share code). */
export async function getOrCreateChatProfile(
  admin: AdminClient,
  user: { id: string; user_metadata?: Record<string, any> }
): Promise<ChatProfileRow> {
  const { data: existing, error } = await admin
    .from('celoris_chat_profiles')
    .select(PROFILE_COLUMNS)
    .eq('user_id', user.id)
    .maybeSingle()
  if (error) throw new Error(`Chat profile lookup failed: ${error.message}`)

  const { name, avatar } = await lookupDisplayName(admin, user)

  if (existing) {
    // Keep the name/photo in sync with the main account.
    if (existing.display_name !== name || existing.avatar_url !== avatar) {
      await admin
        .from('celoris_chat_profiles')
        .update({ display_name: name, avatar_url: avatar, updated_at: new Date().toISOString() })
        .eq('user_id', user.id)
      existing.display_name = name
      existing.avatar_url = avatar
    }
    return existing as ChatProfileRow
  }

  for (let attempt = 0; attempt < 5; attempt++) {
    const { data: created, error: insertError } = await admin
      .from('celoris_chat_profiles')
      .insert({ user_id: user.id, share_code: generateShareCode(), display_name: name, avatar_url: avatar })
      .select(PROFILE_COLUMNS)
      .single()
    if (!insertError && created) return created as ChatProfileRow
    // 23505 = unique violation: either the code collided (retry) or a
    // parallel request already created the profile (read it back).
    if (insertError?.code !== '23505') throw new Error(`Chat profile create failed: ${insertError?.message}`)
    const { data: raced } = await admin
      .from('celoris_chat_profiles')
      .select(PROFILE_COLUMNS)
      .eq('user_id', user.id)
      .maybeSingle()
    if (raced) return raced as ChatProfileRow
  }
  throw new Error('Could not create a share code, please try again')
}

export interface PublicProfile {
  id: string
  name: string
  avatarUrl: string | null
  bio: string | null
  interests: string[]
}

export async function getPublicProfiles(admin: AdminClient, ids: string[]) {
  const map = new Map<string, PublicProfile>()
  if (ids.length === 0) return map
  const { data } = await admin
    .from('celoris_chat_profiles')
    .select('user_id, display_name, avatar_url, bio, interests')
    .in('user_id', Array.from(new Set(ids)))
  for (const row of data || []) {
    map.set(row.user_id, {
      id: row.user_id,
      name: row.display_name,
      avatarUrl: row.avatar_url,
      bio: row.bio || null,
      interests: row.interests || [],
    })
  }
  return map
}

// ---------------------------------------------------------------------------
// Relationship checks
// ---------------------------------------------------------------------------

export function pairOf(a: string, b: string): [string, string] {
  return a < b ? [a, b] : [b, a]
}

export async function areFriends(admin: AdminClient, a: string, b: string) {
  const [x, y] = pairOf(a, b)
  const { data } = await admin
    .from('celoris_chat_friendships')
    .select('user_a')
    .eq('user_a', x)
    .eq('user_b', y)
    .maybeSingle()
  return !!data
}

export async function isBlockedEitherWay(admin: AdminClient, a: string, b: string) {
  const { data } = await admin
    .from('celoris_chat_blocks')
    .select('blocker_id')
    .or(`and(blocker_id.eq.${a},blocked_id.eq.${b}),and(blocker_id.eq.${b},blocked_id.eq.${a})`)
    .limit(1)
  return (data || []).length > 0
}

export async function isTrainer(admin: AdminClient, userId: string): Promise<boolean> {
  const { data, error } = await admin.rpc('celoris_chat_is_trainer', { uid: userId })
  if (error) throw new Error(`Trainer check failed: ${error.message}`)
  return !!data
}

/** Trainers and students can never be friends. Returns an error message or null. */
export async function trainerStudentConflict(admin: AdminClient, a: string, b: string): Promise<string | null> {
  const [ta, tb] = await Promise.all([isTrainer(admin, a), isTrainer(admin, b)])
  if (ta !== tb) return 'Trainers and students can’t be friends on Celoris Chat.'
  return null
}

export async function isChatBanned(admin: AdminClient, userId: string) {
  const { data } = await admin.from('celoris_chat_profiles').select('is_banned').eq('user_id', userId).maybeSingle()
  return !!data?.is_banned
}

// ---------------------------------------------------------------------------
// Rate limits (counted from the tables themselves, so they work across
// server instances)
// ---------------------------------------------------------------------------

export async function countSince(
  admin: AdminClient,
  table: string,
  column: string,
  userId: string,
  sinceMs: number,
  extra?: (q: any) => any
) {
  let q = admin
    .from(table)
    .select('*', { count: 'exact', head: true })
    .eq(column, userId)
    .gte('created_at', new Date(Date.now() - sinceMs).toISOString())
  if (extra) q = extra(q)
  const { count } = await q
  return count || 0
}

// ---------------------------------------------------------------------------
// Contact filter
// ---------------------------------------------------------------------------

const HIDDEN = '[contact hidden]'

const EMAIL_RE =
  /[A-Z0-9._%+-]+\s*(?:@|\(at\)|\[at\]|\sat\s)\s*[A-Z0-9-]+(?:\s*(?:\.|\(dot\)|\[dot\]|\sdot\s)\s*[A-Z0-9-]+)*\s*(?:\.|\(dot\)|\[dot\]|\sdot\s)\s*[A-Z]{2,}/gi

// 10 or more digits, allowing spaces, dashes, dots, brackets and a leading +
// between them (covers 98765 43210, +91-98765-43210, (987) 654 3210 …).
const PHONE_RE = /\+?\d(?:[\s\-.()]*\d){9,}/g

// Links to outside messaging / social apps.
const MESSENGER_LINK_RE =
  /(?:https?:\/\/)?(?:www\.)?(?:wa\.me|api\.whatsapp\.com|chat\.whatsapp\.com|whatsapp\.com|t\.me|telegram\.(?:me|org|dog)|instagram\.com|instagr\.am|snapchat\.com|discord\.gg|discord(?:app)?\.com\/invite|facebook\.com|fb\.me|m\.me|signal\.me|signal\.group)(?:\/[^\s]*)?/gi

/** Hides phone numbers, emails and outside messaging links. */
export function filterContactInfo(text: string): { body: string; filtered: boolean } {
  let body = text
  body = body.replace(MESSENGER_LINK_RE, HIDDEN)
  body = body.replace(EMAIL_RE, HIDDEN)
  body = body.replace(PHONE_RE, HIDDEN)
  return { body, filtered: body !== text }
}
