import { NextRequest, NextResponse } from 'next/server'
import { adminClient, getCaller, jsonError, pairOf } from '@/lib/celoris-chat-server'

export const dynamic = 'force-dynamic'
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// POST { userId }: remove a friend (messages stay in both histories, but
// neither side can send new ones until they're friends again).
export async function POST(req: NextRequest) {
  const user = await getCaller()
  if (!user) return jsonError('Please sign in first.', 401)
  const body = await req.json().catch(() => ({}))
  const other = typeof body?.userId === 'string' ? body.userId : ''
  if (!UUID_RE.test(other)) return jsonError('Missing person.')

  const admin = adminClient()
  const [a, b] = pairOf(user.id, other)
  const { error } = await admin.from('celoris_chat_friendships').delete().eq('user_a', a).eq('user_b', b)
  if (error) return jsonError('Could not remove friend.', 500)
  return NextResponse.json({ ok: true })
}
