/**
 * Shared server-side helpers for the Chat Café API routes.
 *
 * Every Chat Café table is RLS-locked to SELECT-only for signed-in patrons
 * (see the chat_cafe_* migration) — all writes go through these routes using
 * the service-role client, mirroring the existing
 * app/api/social/cafe/delete-room convention: identify the caller from their
 * session cookie, do the permission check ourselves, then write with a
 * client that bypasses RLS.
 */
import { createRouteClient } from '@/lib/supabase-server';
import { createSupabaseClientForServer } from '@/lib/supabase-client';

export type ChatCafeRole = 'patron' | 'regular' | 'barista' | 'moderator' | 'admin';

export interface ChatCafeProfileRow {
  id: string;
  name: string;
  avatar_id: string;
  avatar_color: string;
  accessory: string | null;
  role: ChatCafeRole;
  status_text: string | null;
  current_drink: string | null;
  bubble_style: string;
  is_banned: boolean;
  ban_reason: string | null;
  muted_until: string | null;
  joined_at: string;
  updated_at: string;
}

const DEFAULT_AVATARS: Array<{ avatar_id: string; avatar_color: string; accessory: string }> = [
  { avatar_id: 'cat_barista', avatar_color: 'from-amber-400 to-orange-500', accessory: 'Apron & Whisk' },
  { avatar_id: 'fox_books', avatar_color: 'from-orange-400 to-amber-600', accessory: 'Horn-rim Glasses' },
  { avatar_id: 'rabbit_matcha', avatar_color: 'from-emerald-400 to-teal-600', accessory: 'Tea Flower' },
  { avatar_id: 'bear_cozy', avatar_color: 'from-amber-700 to-yellow-800', accessory: 'Knit Beanie' },
  { avatar_id: 'otter_latte', avatar_color: 'from-cyan-500 to-blue-600', accessory: 'Espresso Cup' },
  { avatar_id: 'shiba_patron', avatar_color: 'from-yellow-400 to-amber-500', accessory: 'Bandana' },
];

/** Identify the caller from their session cookie. Returns null if signed out. */
export async function getCallerUser() {
  const routeClient = await createRouteClient();
  const { data: { user }, error } = await routeClient.auth.getUser();
  if (error || !user) return null;
  return user;
}

/**
 * Fetch the caller's Chat Café persona, creating one with sensible defaults
 * on first visit (mirrors the prototype's DEFAULT_USER, but seeded from
 * their real account name instead of a hardcoded "New User").
 */
export async function getOrCreateProfile(admin: ReturnType<typeof createSupabaseClientForServer>, userId: string, fallbackName: string): Promise<ChatCafeProfileRow> {
  const { data: existing, error: fetchError } = await admin
    .from('chat_cafe_profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (fetchError) throw new Error(`Profile lookup failed: ${fetchError.message}`);
  if (existing) return existing as ChatCafeProfileRow;

  const pick = DEFAULT_AVATARS[Math.floor(Math.random() * DEFAULT_AVATARS.length)];
  const { data: created, error: insertError } = await admin
    .from('chat_cafe_profiles')
    .insert({
      id: userId,
      name: fallbackName || 'New User',
      avatar_id: pick.avatar_id,
      avatar_color: pick.avatar_color,
      accessory: pick.accessory,
      role: 'patron',
      status_text: 'Just arrived at the café ☕',
      current_drink: 'Velvet Vanilla Latte',
      bubble_style: 'ceramic',
    })
    .select('*')
    .single();

  if (insertError) throw new Error(`Profile creation failed: ${insertError.message}`);
  return created as ChatCafeProfileRow;
}

export function isModerator(profile: Pick<ChatCafeProfileRow, 'role'>): boolean {
  return profile.role === 'moderator' || profile.role === 'admin';
}

export function isMuted(profile: Pick<ChatCafeProfileRow, 'muted_until'>): boolean {
  return !!profile.muted_until && new Date(profile.muted_until).getTime() > Date.now();
}

export async function logModerationAction(
  admin: ReturnType<typeof createSupabaseClientForServer>,
  entry: {
    action: 'delete' | 'pin' | 'unpin' | 'mute' | 'unmute' | 'ban' | 'unban' | 'slowmode' | 'warning' | 'broadcast_rules';
    targetUserId?: string | null;
    targetUserName?: string | null;
    targetMessageId?: string | null;
    moderatorId: string;
    moderatorName: string;
    reason?: string | null;
  }
) {
  await admin.from('chat_cafe_moderation_logs').insert({
    action: entry.action,
    target_user_id: entry.targetUserId ?? null,
    target_user_name: entry.targetUserName ?? null,
    target_message_id: entry.targetMessageId ?? null,
    moderator_id: entry.moderatorId,
    moderator_name: entry.moderatorName,
    reason: entry.reason ?? null,
  });
}

/** Maps a chat_cafe_profiles row to the ported UserProfile shape the frontend expects. */
export function profileRowToUserProfile(row: ChatCafeProfileRow) {
  return {
    id: row.id,
    name: row.name,
    avatarId: row.avatar_id,
    avatarColor: row.avatar_color,
    accessory: row.accessory || '',
    role: row.role,
    statusText: row.status_text || '',
    currentDrink: row.current_drink || '',
    bubbleStyle: row.bubble_style,
    joinedAt: new Date(row.joined_at).getTime(),
  };
}
