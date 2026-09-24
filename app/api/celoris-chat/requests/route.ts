import { NextRequest, NextResponse } from 'next/server'
import {
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

// POST { code }: send a friend request to whoever owns this share code.
// If they already sent me a request, this accepts it instead.
export async function POST(req: NextRequest) {
  const user = await getCaller()
  if (!user) return jsonError('Please sign in first.', 401)

  const body = await req.json().catch(() => ({}))
  const code = normalizeShareCode(body?.code)

  try {
    const admin = adminClient()
    const me = await getOrCreateChatProfile(admin, user)
    if (me.is_banned) return jsonError('Your Celoris Chat access has been paused.', 403)

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
    const { data: theirs } = await admin
      .from('celoris_chat_requests')
      .select('id')
      .eq('from_user', other)
      .eq('to_user', user.id)
      .eq('status', 'pending')
      .maybeSingle()
    if (theirs) {
      const [a, b] = pairOf(user.id, other)
      await admin.from('celoris_chat_friendships').upsert({ user_a: a, user_b: b }, { onConflict: 'user_a,user_b' })
      await admin
        .from('celoris_chat_requests')
        .update({ status: 'accepted', responded_at: new Date().toISOString() })
        .eq('id', theirs.id)
      return NextResponse.json({ status: 'friends' })
    }

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
