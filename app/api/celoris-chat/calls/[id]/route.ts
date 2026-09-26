import { NextRequest, NextResponse } from 'next/server'
import {
  adminClient,
  areFriends,
  getCaller,
  isBlockedEitherWay,
  isChatBanned,
  jsonError,
  trainerStudentConflict,
} from '@/lib/celoris-chat-server'
import {
  RING_TIMEOUT_SECONDS,
  backupProvider,
  billCall,
  getCall,
  joinCredentials,
  providerReady,
  shapeCall,
  walletBalance,
} from '@/lib/celoris-chat-calls'

export const dynamic = 'force-dynamic'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const ACTIONS = ['answer', 'decline', 'end', 'heartbeat', 'token', 'switch'] as const
type Action = (typeof ACTIONS)[number]

// POST { action }
//   answer    — the person being called picks up (billing starts)
//   decline   — the person being called says no
//   end       — either person hangs up (or the caller cancels while ringing)
//   heartbeat — sent every ~20 s during a call; charges the next minute
//   token     — join credentials for the call's current provider
//   switch    — { from } move the call to the backup provider (if `from` is
//               still the current one), e.g. when joining failed
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCaller()
  if (!user) return jsonError('Please sign in first.', 401)

  const { id } = await params
  if (!UUID_RE.test(id)) return jsonError('Call not found.', 404)
  const body = await req.json().catch(() => ({}))
  const action = body?.action as Action
  if ((ACTIONS as readonly string[]).indexOf(action) === -1) return jsonError('Unknown action.')

  try {
    const admin = adminClient()
    let call = await getCall(admin, id)
    if (!call || (call.caller_id !== user.id && call.callee_id !== user.id)) return jsonError('Call not found.', 404)
    const isCaller = call.caller_id === user.id
    const now = new Date().toISOString()
    const respond = async () => {
      const fresh = (await getCall(admin, id)) || call!
      const balance = isCaller ? await walletBalance(admin, user.id) : undefined
      return NextResponse.json({ call: shapeCall(fresh, user.id, { callerBalance: balance }) })
    }

    switch (action) {
      case 'answer': {
        if (isCaller) return jsonError('You started this call.', 400)
        if (call.status !== 'ringing') return jsonError('This call has ended.', 409)
        if (Date.now() - Date.parse(call.created_at) > RING_TIMEOUT_SECONDS * 1000) {
          await admin
            .from('celoris_chat_calls')
            .update({ status: 'missed', end_reason: 'no_answer', ended_at: now })
            .eq('id', id)
            .eq('status', 'ringing')
          return jsonError('This call has ended.', 409)
        }
        // Friendship, blocks and bans can change while it rings.
        const ok =
          !(await isChatBanned(admin, user.id)) &&
          (await areFriends(admin, call.caller_id, call.callee_id)) &&
          !(await isBlockedEitherWay(admin, call.caller_id, call.callee_id)) &&
          !(await trainerStudentConflict(admin, call.caller_id, call.callee_id))
        if (!ok) {
          await admin
            .from('celoris_chat_calls')
            .update({ status: 'ended', end_reason: 'not_allowed', ended_at: now })
            .eq('id', id)
            .eq('status', 'ringing')
          return jsonError('This call can’t be connected.', 403)
        }
        const { data: updated } = await admin
          .from('celoris_chat_calls')
          .update({ status: 'connected', connected_at: now, last_heartbeat_at: now })
          .eq('id', id)
          .eq('status', 'ringing')
          .select('id')
        if (!updated || updated.length === 0) return jsonError('This call has ended.', 409)
        // First minute is charged right away; ends the call if the caller
        // can't pay for it.
        await billCall(admin, id)
        return respond()
      }

      case 'decline': {
        if (isCaller) return jsonError('You started this call.', 400)
        await admin
          .from('celoris_chat_calls')
          .update({ status: 'declined', end_reason: 'declined', ended_at: now })
          .eq('id', id)
          .eq('status', 'ringing')
        return respond()
      }

      case 'end': {
        if (call.status === 'ringing') {
          // The caller's screen gives up after the ring timeout: record it as
          // a missed call rather than a cancelled one.
          const unanswered =
            isCaller && body?.reason === 'no_answer' && Date.now() - Date.parse(call.created_at) >= (RING_TIMEOUT_SECONDS - 10) * 1000
          await admin
            .from('celoris_chat_calls')
            .update(
              unanswered
                ? { status: 'missed', end_reason: 'no_answer', ended_at: now }
                : isCaller
                  ? { status: 'cancelled', end_reason: 'cancelled', ended_at: now }
                  : { status: 'declined', end_reason: 'declined', ended_at: now }
            )
            .eq('id', id)
            .eq('status', 'ringing')
        } else if (call.status === 'connected') {
          await admin
            .from('celoris_chat_calls')
            .update({ status: 'ended', end_reason: 'hangup', ended_at: now })
            .eq('id', id)
            .eq('status', 'connected')
          await billCall(admin, id)
        }
        return respond()
      }

      case 'heartbeat': {
        if (call.status === 'connected') {
          await admin.from('celoris_chat_calls').update({ last_heartbeat_at: now }).eq('id', id).eq('status', 'connected')
          await billCall(admin, id)
        }
        return respond()
      }

      case 'token': {
        if (call.status !== 'connected') return jsonError('The call isn’t connected.', 409)
        if (!providerReady(call.provider)) {
          const backup = backupProvider(call.provider)
          if (!backup) return jsonError('Calls aren’t available right now.', 503)
          await admin.from('celoris_chat_calls').update({ provider: backup }).eq('id', id).eq('provider', call.provider)
          call = (await getCall(admin, id)) || call
        }
        return NextResponse.json({ credentials: joinCredentials(call, user.id), provider: call.provider })
      }

      case 'switch': {
        if (call.status !== 'connected') return jsonError('The call isn’t connected.', 409)
        const from = body?.from
        if (from === call.provider) {
          const backup = backupProvider(call.provider)
          if (!backup) return jsonError('No backup connection is available.', 503)
          await admin.from('celoris_chat_calls').update({ provider: backup }).eq('id', id).eq('provider', from)
        }
        return respond()
      }
    }
    return jsonError('Unknown action.')
  } catch (err) {
    console.error('[celoris-chat/calls/id]', err)
    return jsonError('Something went wrong with the call.', 500)
  }
}
