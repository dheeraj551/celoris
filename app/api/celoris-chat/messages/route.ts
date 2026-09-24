import { NextRequest, NextResponse } from 'next/server'
import {
  adminClient,
  areFriends,
  countSince,
  filterContactInfo,
  getCaller,
  isBlockedEitherWay,
  isChatBanned,
  jsonError,
  trainerStudentConflict,
} from '@/lib/celoris-chat-server'

export const dynamic = 'force-dynamic'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const MAX_BODY = 2000
const MAX_PER_MINUTE = 20
const MAX_PER_DAY = 1000

function shape(m: any, me: string) {
  return {
    id: m.id,
    body: m.body,
    fromMe: m.sender_id === me,
    filtered: m.filtered,
    createdAt: m.created_at,
    readAt: m.read_at,
  }
}

// GET ?with=<userId>&before=<iso>: the last 50 messages between me and them
// (older pages with `before`). Only ever returns messages I sent or received.
export async function GET(req: NextRequest) {
  const user = await getCaller()
  if (!user) return jsonError('Please sign in first.', 401)

  const other = req.nextUrl.searchParams.get('with') || ''
  const before = req.nextUrl.searchParams.get('before')
  if (!UUID_RE.test(other)) return jsonError('Missing conversation.')

  try {
    const admin = adminClient()
    let q = admin
      .from('celoris_chat_messages')
      .select('id, sender_id, recipient_id, body, filtered, created_at, read_at')
      .or(`and(sender_id.eq.${user.id},recipient_id.eq.${other}),and(sender_id.eq.${other},recipient_id.eq.${user.id})`)
      .order('created_at', { ascending: false })
      .limit(50)
    if (before && !Number.isNaN(Date.parse(before))) q = q.lt('created_at', new Date(before).toISOString())
    const { data, error } = await q
    if (error) throw error
    const messages = (data || []).reverse().map((m: any) => shape(m, user.id))
    return NextResponse.json({ messages, hasMore: (data || []).length === 50 })
  } catch (err) {
    console.error('[celoris-chat/messages GET]', err)
    return jsonError('Could not load messages.', 500)
  }
}

// POST { to, body }: send a message to a friend.
export async function POST(req: NextRequest) {
  const user = await getCaller()
  if (!user) return jsonError('Please sign in first.', 401)

  const payload = await req.json().catch(() => ({}))
  const to = typeof payload?.to === 'string' ? payload.to : ''
  const raw = typeof payload?.body === 'string' ? payload.body.trim() : ''
  if (!UUID_RE.test(to) || to === user.id) return jsonError('Missing conversation.')
  if (!raw) return jsonError('Message is empty.')
  if (raw.length > MAX_BODY) return jsonError(`Messages can be up to ${MAX_BODY} characters.`)

  try {
    const admin = adminClient()
    if (await isChatBanned(admin, user.id)) return jsonError('Your Celoris Chat access has been paused.', 403)
    if (!(await areFriends(admin, user.id, to))) return jsonError('You can only message your friends.', 403)
    if (await isBlockedEitherWay(admin, user.id, to)) return jsonError('You can’t message this person.', 403)
    // Re-checked on every message: if a friend later becomes a trainer (or
    // the other way round), chat between them stops.
    const conflict = await trainerStudentConflict(admin, user.id, to)
    if (conflict) return jsonError(conflict, 403)

    const [lastMinute, lastDay] = await Promise.all([
      countSince(admin, 'celoris_chat_messages', 'sender_id', user.id, 60 * 1000),
      countSince(admin, 'celoris_chat_messages', 'sender_id', user.id, 24 * 60 * 60 * 1000),
    ])
    if (lastMinute >= MAX_PER_MINUTE) return jsonError('You’re sending messages too fast. Slow down a little.', 429)
    if (lastDay >= MAX_PER_DAY) return jsonError('Daily message limit reached. Try again tomorrow.', 429)

    const { body, filtered } = filterContactInfo(raw)
    const { data, error } = await admin
      .from('celoris_chat_messages')
      .insert({ sender_id: user.id, recipient_id: to, body, filtered })
      .select('id, sender_id, recipient_id, body, filtered, created_at, read_at')
      .single()
    if (error) throw error
    return NextResponse.json({ message: shape(data, user.id) })
  } catch (err) {
    console.error('[celoris-chat/messages POST]', err)
    return jsonError('Could not send the message.', 500)
  }
}
