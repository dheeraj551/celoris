import { NextRequest, NextResponse } from 'next/server'
import {
  adminClient,
  getCaller,
  isBlockedEitherWay,
  isChatBanned,
  jsonError,
  pairOf,
  trainerStudentConflict,
} from '@/lib/celoris-chat-server'

export const dynamic = 'force-dynamic'

// POST { action: 'accept' | 'decline' | 'cancel' }
// accept/decline: only the person the request was sent to.
// cancel: only the person who sent it.
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCaller()
  if (!user) return jsonError('Please sign in first.', 401)

  const { id } = await params
  const body = await req.json().catch(() => ({}))
  const action = body?.action
  if (!['accept', 'decline', 'cancel'].includes(action)) return jsonError('Unknown action.')

  try {
    const admin = adminClient()
    const { data: request } = await admin
      .from('celoris_chat_requests')
      .select('id, from_user, to_user, status')
      .eq('id', id)
      .maybeSingle()
    if (!request || request.status !== 'pending') return jsonError('This request is no longer open.', 404)

    const isRecipient = request.to_user === user.id
    const isSender = request.from_user === user.id
    if (action === 'cancel' ? !isSender : !isRecipient) return jsonError('Request not found.', 404)

    const now = new Date().toISOString()

    if (action === 'accept') {
      if (await isChatBanned(admin, user.id)) return jsonError('Your Celoris Chat access has been paused.', 403)
      if (await isBlockedEitherWay(admin, request.from_user, request.to_user)) {
        await admin.from('celoris_chat_requests').update({ status: 'declined', responded_at: now }).eq('id', id)
        return jsonError('This request can’t be accepted.', 403)
      }
      const conflict = await trainerStudentConflict(admin, request.from_user, request.to_user)
      if (conflict) {
        await admin.from('celoris_chat_requests').update({ status: 'declined', responded_at: now }).eq('id', id)
        return jsonError(conflict, 403)
      }
      const [a, b] = pairOf(request.from_user, request.to_user)
      const { error } = await admin
        .from('celoris_chat_friendships')
        .upsert({ user_a: a, user_b: b }, { onConflict: 'user_a,user_b' })
      if (error) throw error
    }

    const status = action === 'accept' ? 'accepted' : action === 'decline' ? 'declined' : 'cancelled'
    await admin
      .from('celoris_chat_requests')
      .update({ status, responded_at: now })
      .eq('id', id)
      .eq('status', 'pending')

    return NextResponse.json({ status })
  } catch (err) {
    console.error('[celoris-chat/requests/id]', err)
    return jsonError('Could not update the request right now.', 500)
  }
}
