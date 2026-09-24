import { NextRequest, NextResponse } from 'next/server'
import { adminClient, getCaller, jsonError } from '@/lib/celoris-chat-server'

export const dynamic = 'force-dynamic'
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// POST { with }: mark everything they sent me as read.
export async function POST(req: NextRequest) {
  const user = await getCaller()
  if (!user) return jsonError('Please sign in first.', 401)
  const body = await req.json().catch(() => ({}))
  const other = typeof body?.with === 'string' ? body.with : ''
  if (!UUID_RE.test(other)) return jsonError('Missing conversation.')

  const admin = adminClient()
  const { error } = await admin
    .from('celoris_chat_messages')
    .update({ read_at: new Date().toISOString() })
    .eq('recipient_id', user.id)
    .eq('sender_id', other)
    .is('read_at', null)
  if (error) return jsonError('Could not update.', 500)
  return NextResponse.json({ ok: true })
}
