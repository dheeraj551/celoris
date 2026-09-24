import { NextRequest, NextResponse } from 'next/server'
import { adminClient, getCaller, jsonError, pairOf } from '@/lib/celoris-chat-server'

export const dynamic = 'force-dynamic'
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// POST { userId, block: true|false }
// Blocking also removes the friendship and closes any pending requests.
export async function POST(req: NextRequest) {
  const user = await getCaller()
  if (!user) return jsonError('Please sign in first.', 401)
  const body = await req.json().catch(() => ({}))
  const other = typeof body?.userId === 'string' ? body.userId : ''
  const block = body?.block !== false
  if (!UUID_RE.test(other) || other === user.id) return jsonError('Missing person.')

  try {
    const admin = adminClient()
    if (!block) {
      await admin.from('celoris_chat_blocks').delete().eq('blocker_id', user.id).eq('blocked_id', other)
      return NextResponse.json({ blocked: false })
    }
    await admin
      .from('celoris_chat_blocks')
      .upsert({ blocker_id: user.id, blocked_id: other }, { onConflict: 'blocker_id,blocked_id' })
    const [a, b] = pairOf(user.id, other)
    await admin.from('celoris_chat_friendships').delete().eq('user_a', a).eq('user_b', b)
    await admin
      .from('celoris_chat_requests')
      .update({ status: 'cancelled', responded_at: new Date().toISOString() })
      .eq('status', 'pending')
      .or(`and(from_user.eq.${user.id},to_user.eq.${other}),and(from_user.eq.${other},to_user.eq.${user.id})`)
    return NextResponse.json({ blocked: true })
  } catch (err) {
    console.error('[celoris-chat/block]', err)
    return jsonError('Could not update block.', 500)
  }
}
