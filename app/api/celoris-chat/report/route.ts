import { NextRequest, NextResponse } from 'next/server'
import { adminClient, countSince, getCaller, getPublicProfiles, jsonError } from '@/lib/celoris-chat-server'

export const dynamic = 'force-dynamic'
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const REASONS = ['spam', 'harassment', 'sharing_contacts', 'selling_outside', 'inappropriate', 'other']

// POST { userId, reason, details?, block? }
// Saves the last 30 messages between the two people with the report, so the
// Celoris team reviews only reported conversations — admins never browse
// anyone's chats otherwise.
export async function POST(req: NextRequest) {
  const user = await getCaller()
  if (!user) return jsonError('Please sign in first.', 401)
  const body = await req.json().catch(() => ({}))
  const other = typeof body?.userId === 'string' ? body.userId : ''
  const reason = REASONS.includes(body?.reason) ? body.reason : null
  const details = typeof body?.details === 'string' ? body.details.trim().slice(0, 1000) : null
  if (!UUID_RE.test(other) || other === user.id) return jsonError('Missing person.')
  if (!reason) return jsonError('Please choose a reason.')

  try {
    const admin = adminClient()
    const today = await countSince(admin, 'celoris_chat_reports', 'reporter_id', user.id, 24 * 60 * 60 * 1000)
    if (today >= 10) return jsonError('You’ve sent a lot of reports today. Our team is reviewing them.', 429)

    const { data: recent } = await admin
      .from('celoris_chat_messages')
      .select('sender_id, body, created_at')
      .or(`and(sender_id.eq.${user.id},recipient_id.eq.${other}),and(sender_id.eq.${other},recipient_id.eq.${user.id})`)
      .order('created_at', { ascending: false })
      .limit(30)
    const names = await getPublicProfiles(admin, [user.id, other])
    const snapshot = (recent || []).reverse().map((m: any) => ({
      from: m.sender_id === user.id ? 'reporter' : 'reported',
      name: names.get(m.sender_id)?.name || 'Celoris member',
      body: m.body,
      at: m.created_at,
    }))

    const { error } = await admin
      .from('celoris_chat_reports')
      .insert({ reporter_id: user.id, reported_id: other, reason, details, snapshot })
    if (error) throw error
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[celoris-chat/report]', err)
    return jsonError('Could not send the report.', 500)
  }
}
