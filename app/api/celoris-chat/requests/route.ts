import { NextRequest, NextResponse } from 'next/server'
import {
  type AdminClient,
  adminClient,
  areFriends,
  countSince,
  getCaller,
  getOrCreateChatProfile,
  isBlockedEitherWay,
  jsonError,
  normalizeShareCode,
  pairOf,
  trainerStudentConflict,
} from '@/lib/celoris-chat-server'

export const dynamic = 'force-dynamic'

const MAX_WRONG_CODES_PER_10_MIN = 10
const MAX_REQUESTS_PER_DAY = 20
// Discover is stricter than share codes: fewer requests a day, a cap on how
// many unanswered ones you can have out, and a cap on how many one person can
// be sent, so nobody gets flooded.
const MAX_DISCOVER_REQUESTS_PER_DAY = 10
const MAX_PENDING_DISCOVER_SENT = 15
const MAX_PENDING_RECEIVED = 30
const DECLINE_COOLDOWN_MS = 30 * 24 * 60 * 60 * 1000
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// POST { code }: send a friend request to whoever owns this share code.
// POST { userId }: send a request to someone you found in Discover (both of
//   you must have Discover turned on).
// If they already sent me a request, this accepts it instead.
export async function POST(req: NextRequest) {
  const user = await getCaller()
  if (!user) return jsonError('Please sign in first.', 401)

  const body = await req.json().catch(() => ({}))
  const viaDiscover = typeof body?.userId === 'string'
  if (viaDiscover && !UUID_RE.test(body.userId)) return jsonError('Person not found.', 404)
  const code = viaDiscover ? null : normalizeShareCode(body?.code)

  try {
    const admin = adminClient()
    const me = await getOrCreateChatProfile(admin, user)
    if (me.is_banned) return jsonError('Your Celoris Chat access has been paused.', 403)

    if (viaDiscover) return await sendDiscoverRequest(admin, user.id, me.discoverable, body.userId)

    const wrong = await countSince(admin, 'celoris_chat_code_attempts', 'user_id', user.id, 10 * 60 * 1000, (q) =>
      q.eq('success', false)
    )
    if (wrong >= MAX_WRONG_CODES_PER_10_MIN) {
      return jsonError('Too many wrong codes. Please wait 10 minutes and try again.', 429)
    }

    const logAttempt = (success: boolean) =>
      admin.from('celoris_chat_code_attempts').insert({ user_id: user.id, success })

    if (!code) {
      await logAttempt(false)
      return jsonError('That doesn’t look like a Celoris Chat code (it looks like CEL-7K2M9QAB).')
    }

    const { data: target } = await admin
      .from('celoris_chat_profiles')
      .select('user_id, is_banned')
      .eq('share_code', code)
      .maybeSingle()
    if (!target) {
      await logAttempt(false)
      return jsonError('No one has that code. Check it and try again.', 404)
    }
    await logAttempt(true)

    const other = target.user_id as string
    if (other === user.id) return jsonError('That’s your own code.')
    if (target.is_banned) return jsonError('This person can’t receive requests right now.', 403)
    if (await areFriends(admin, user.id, other)) return jsonError('You’re already friends.', 409)
    // Same message whichever side blocked, so a block can't be detected.
    if (await isBlockedEitherWay(admin, user.id, other)) return jsonError('You can’t send a request to this person.', 403)
    const conflict = await trainerStudentConflict(admin, user.id, other)
    if (conflict) return jsonError(conflict, 403)

    // They already asked me: accept theirs instead of creating a second one.
    if (await acceptTheirs(admin, user.id, other)) return NextResponse.json({ status: 'friends' })

    const sentToday = await countSince(admin, 'celoris_chat_requests', 'from_user', user.id, 24 * 60 * 60 * 1000)
    if (sentToday >= MAX_REQUESTS_PER_DAY) {
      return jsonError('You’ve sent a lot of requests today. Try again tomorrow.', 429)
    }

    const { error } = await admin
      .from('celoris_chat_requests')
      .insert({ from_user: user.id, to_user: other, source: 'code' })
    if (error) {
      if (error.code === '23505') return jsonError('You’ve already sent this person a request.', 409)
      throw error
    }
    return NextResponse.json({ status: 'requested' })
  } catch (err) {
    console.error('[celoris-chat/requests]', err)
    return jsonError('Could not send the request right now.', 500)
  }
}

async function acceptTheirs(admin: AdminClient, me: string, other: string) {
  const { data: theirs } = await admin
    .from('celoris_chat_requests')
    .select('id')
    .eq('from_user', other)
    .eq('to_user', me)
    .eq('status', 'pending')
    .maybeSingle()
  if (!theirs) return false
  const [a, b] = pairOf(me, other)
  await admin.from('celoris_chat_friendships').upsert({ user_a: a, user_b: b }, { onConflict: 'user_a,user_b' })
  await admin
    .from('celoris_chat_requests')
    .update({ status: 'accepted', responded_at: new Date().toISOString() })
    .eq('id', theirs.id)
  return true
}

async function sendDiscoverRequest(admin: AdminClient, me: string, meDiscoverable: boolean, other: string) {
  if (!meDiscoverable) return jsonError('Turn on Discover first to send requests from it.', 403)
  if (other === me) return jsonError('That’s you.')

  const { data: target } = await admin
    .from('celoris_chat_profiles')
    .select('user_id, discoverable, is_banned')
    .eq('user_id', other)
    .maybeSingle()
  // Same answer for "doesn't exist", "not in Discover" and "banned", so the
  // endpoint can't be used to probe accounts.
  if (!target || !target.discoverable || target.is_banned) return jsonError('This person isn’t in Discover any more.', 404)

  if (await areFriends(admin, me, other)) return jsonError('You’re already friends.', 409)
  if (await isBlockedEitherWay(admin, me, other)) return jsonError('This person isn’t in Discover any more.', 404)
  const conflict = await trainerStudentConflict(admin, me, other)
  if (conflict) return jsonError('This person isn’t in Discover any more.', 404)

  if (await acceptTheirs(admin, me, other)) return NextResponse.json({ status: 'friends' })

  const { data: declined } = await admin
    .from('celoris_chat_requests')
    .select('id')
    .eq('from_user', me)
    .eq('to_user', other)
    .eq('status', 'declined')
    .gte('responded_at', new Date(Date.now() - DECLINE_COOLDOWN_MS).toISOString())
    .limit(1)
  if ((declined || []).length > 0) return jsonError('This person isn’t in Discover any more.', 404)

  const dayMs = 24 * 60 * 60 * 1000
  const [sentToday, discoverToday, pendingSent, pendingReceived] = await Promise.all([
    countSince(admin, 'celoris_chat_requests', 'from_user', me, dayMs),
    countSince(admin, 'celoris_chat_requests', 'from_user', me, dayMs, (q) => q.eq('source', 'discover')),
    admin
      .from('celoris_chat_requests')
      .select('*', { count: 'exact', head: true })
      .eq('from_user', me)
      .eq('source', 'discover')
      .eq('status', 'pending'),
    admin
      .from('celoris_chat_requests')
      .select('*', { count: 'exact', head: true })
      .eq('to_user', other)
      .eq('status', 'pending'),
  ])
  if (sentToday >= MAX_REQUESTS_PER_DAY || discoverToday >= MAX_DISCOVER_REQUESTS_PER_DAY) {
    return jsonError(`You can send ${MAX_DISCOVER_REQUESTS_PER_DAY} requests a day from Discover. Try again tomorrow.`, 429)
  }
  if ((pendingSent.count || 0) >= MAX_PENDING_DISCOVER_SENT) {
    return jsonError('You have a lot of requests waiting. Cancel some in Requests → Sent, or wait for replies.', 429)
  }
  if ((pendingReceived.count || 0) >= MAX_PENDING_RECEIVED) {
    return jsonError('This person has too many requests waiting right now. Try again later.', 429)
  }

  const { error } = await admin
    .from('celoris_chat_requests')
    .insert({ from_user: me, to_user: other, source: 'discover' })
  if (error) {
    if (error.code === '23505') return jsonError('You’ve already sent this person a request.', 409)
    throw error
  }
  return NextResponse.json({ status: 'requested' })
}
