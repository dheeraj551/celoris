import { NextRequest, NextResponse } from 'next/server'
import {
  adminClient,
  areFriends,
  countSince,
  getCaller,
  getOrCreateChatProfile,
  isBlockedEitherWay,
  isChatBanned,
  jsonError,
  trainerStudentConflict,
} from '@/lib/celoris-chat-server'
import {
  CALL_COLUMNS,
  CALL_MAX_MINUTES,
  CALL_RATE_PER_MINUTE,
  MAX_CALL_ATTEMPTS_PER_HOUR,
  type CallRow,
  isInLiveCall,
  newChannelName,
  shapeCall,
  startingProvider,
  sweepCalls,
  walletBalance,
} from '@/lib/celoris-chat-calls'
import { getEntitlements, loadPlanSettings, upgradeLabelFor } from '@/lib/plans'

export const dynamic = 'force-dynamic'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// GET: my live call (so a reload can pick it back up) and whether I can call.
export async function GET() {
  const user = await getCaller()
  if (!user) return jsonError('Please sign in first.', 401)

  try {
    const admin = adminClient()
    await sweepCalls(admin)
    const [{ data: live }, ent, balance] = await Promise.all([
      admin
        .from('celoris_chat_calls')
        .select(CALL_COLUMNS)
        .in('status', ['ringing', 'connected'])
        .or(`caller_id.eq.${user.id},callee_id.eq.${user.id}`)
        .order('created_at', { ascending: false })
        .limit(1),
      getEntitlements(admin, user.id),
      walletBalance(admin, user.id),
    ])
    const call = ((live || [])[0] as CallRow | undefined) || null
    return NextResponse.json({
      call: call ? shapeCall(call, user.id, { callerBalance: balance }) : null,
      plan: ent.tier,
      planLabel: ent.label,
      canCall: ent.features.chat_calls,
      upgradeTo: upgradeLabelFor(await loadPlanSettings(admin), 'chat_calls'),
      balance,
      ratePerMinute: CALL_RATE_PER_MINUTE,
      maxMinutes: CALL_MAX_MINUTES,
      available: !!startingProvider(),
    })
  } catch (err) {
    console.error('[celoris-chat/calls GET]', err)
    return jsonError('Could not load call status.', 500)
  }
}

// POST { to, kind: 'voice' | 'video' }: ring a friend.
export async function POST(req: NextRequest) {
  const user = await getCaller()
  if (!user) return jsonError('Please sign in first.', 401)

  const body = await req.json().catch(() => ({}))
  const to = typeof body?.to === 'string' ? body.to : ''
  const kind = body?.kind === 'video' ? 'video' : body?.kind === 'voice' ? 'voice' : null
  if (!UUID_RE.test(to) || to === user.id) return jsonError('Missing person.')
  if (!kind) return jsonError('Choose a voice or video call.')

  try {
    const admin = adminClient()
    await sweepCalls(admin)

    const me = await getOrCreateChatProfile(admin, user)
    if (me.is_banned) return jsonError('Your Celoris Chat access has been paused.', 403)
    if (!(await areFriends(admin, user.id, to))) return jsonError('You can only call your friends.', 403)
    if (await isBlockedEitherWay(admin, user.id, to)) return jsonError('You can’t call this person.', 403)
    const conflict = await trainerStudentConflict(admin, user.id, to)
    if (conflict) return jsonError(conflict, 403)
    if (await isChatBanned(admin, to)) return jsonError('This person can’t take calls right now.', 403)

    const ent = await getEntitlements(admin, user.id)
    if (!ent.features.chat_calls) {
      const upgradeTo = upgradeLabelFor(await loadPlanSettings(admin), 'chat_calls')
      return NextResponse.json(
        { error: `Voice and video calls come with the ${upgradeTo} plan and above.`, code: 'needs_plan' },
        { status: 402 }
      )
    }
    const balance = await walletBalance(admin, user.id)
    if (balance < CALL_RATE_PER_MINUTE) {
      return NextResponse.json(
        {
          error: `Calls cost ${CALL_RATE_PER_MINUTE} credit a minute. Add credits to start a call.`,
          code: 'needs_credits',
          balance,
        },
        { status: 402 }
      )
    }

    const provider = startingProvider()
    if (!provider) return jsonError('Calls aren’t available right now. Please try again later.', 503)

    const attempts = await countSince(admin, 'celoris_chat_calls', 'caller_id', user.id, 60 * 60 * 1000)
    if (attempts >= MAX_CALL_ATTEMPTS_PER_HOUR) return jsonError('Too many calls in the last hour. Please wait a bit.', 429)

    if (await isInLiveCall(admin, user.id)) return jsonError('You’re already in a call.', 409)
    if (await isInLiveCall(admin, to)) return jsonError('They’re on another call. Try again in a bit.', 409)

    const { data: created, error } = await admin
      .from('celoris_chat_calls')
      .insert({
        caller_id: user.id,
        callee_id: to,
        kind,
        provider,
        channel: newChannelName(),
        rate_per_minute: CALL_RATE_PER_MINUTE,
        max_minutes: CALL_MAX_MINUTES,
      })
      .select(CALL_COLUMNS)
      .single()
    if (error) {
      if (error.code === '23505') return jsonError('One of you is already in a call.', 409)
      throw error
    }
    return NextResponse.json({ call: shapeCall(created as CallRow, user.id, { callerBalance: balance }) })
  } catch (err) {
    console.error('[celoris-chat/calls POST]', err)
    return jsonError('Could not start the call right now.', 500)
  }
}
