import { NextResponse } from 'next/server'
import { adminClient, getCaller, getOrCreateChatProfile, getPublicProfiles, jsonError } from '@/lib/celoris-chat-server'

export const dynamic = 'force-dynamic'

// Everything the Celoris Chat screen needs on load: my profile + share code,
// my friends (with last message and unread count), pending requests and the
// people I've blocked.
export async function GET() {
  const user = await getCaller()
  if (!user) return jsonError('Please sign in to use Celoris Chat.', 401)

  try {
    const admin = adminClient()
    const me = await getOrCreateChatProfile(admin, user)

    const [friendsRes, incomingRes, outgoingRes, blocksRes, recentRes, unreadRes] = await Promise.all([
      admin.from('celoris_chat_friendships').select('user_a, user_b, created_at').or(`user_a.eq.${user.id},user_b.eq.${user.id}`),
      admin.from('celoris_chat_requests').select('id, from_user, created_at, source').eq('to_user', user.id).eq('status', 'pending').order('created_at', { ascending: false }),
      admin.from('celoris_chat_requests').select('id, to_user, created_at, source').eq('from_user', user.id).eq('status', 'pending').order('created_at', { ascending: false }),
      admin.from('celoris_chat_blocks').select('blocked_id, created_at').eq('blocker_id', user.id),
      admin
        .from('celoris_chat_messages')
        .select('sender_id, recipient_id, body, created_at')
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order('created_at', { ascending: false })
        .limit(500),
      admin.from('celoris_chat_messages').select('sender_id').eq('recipient_id', user.id).is('read_at', null).limit(1000),
    ])

    const friendIds = (friendsRes.data || []).map((f: any) => (f.user_a === user.id ? f.user_b : f.user_a))
    const incoming = incomingRes.data || []
    const outgoing = outgoingRes.data || []
    const blocks = blocksRes.data || []

    const profiles = await getPublicProfiles(admin, [
      ...friendIds,
      ...incoming.map((r: any) => r.from_user),
      ...outgoing.map((r: any) => r.to_user),
      ...blocks.map((b: any) => b.blocked_id),
    ])
    const person = (id: string) => profiles.get(id) || { id, name: 'Celoris member', avatarUrl: null }

    const last = new Map<string, { body: string; at: string; fromMe: boolean }>()
    for (const m of recentRes.data || []) {
      const other = m.sender_id === user.id ? m.recipient_id : m.sender_id
      if (!last.has(other)) last.set(other, { body: m.body, at: m.created_at, fromMe: m.sender_id === user.id })
    }
    const unread = new Map<string, number>()
    for (const m of unreadRes.data || []) unread.set(m.sender_id, (unread.get(m.sender_id) || 0) + 1)

    const friends = friendIds
      .map((id: string) => ({ ...person(id), lastMessage: last.get(id) || null, unread: unread.get(id) || 0 }))
      .sort((a: any, b: any) => (b.lastMessage?.at || '').localeCompare(a.lastMessage?.at || '') || a.name.localeCompare(b.name))

    return NextResponse.json({
      me: {
        id: user.id,
        name: me.display_name,
        avatarUrl: me.avatar_url,
        shareCode: me.share_code,
        isBanned: me.is_banned,
      },
      friends,
      incoming: incoming.map((r: any) => ({ id: r.id, from: person(r.from_user), createdAt: r.created_at })),
      outgoing: outgoing.map((r: any) => ({ id: r.id, to: person(r.to_user), createdAt: r.created_at })),
      blocked: blocks.map((b: any) => person(b.blocked_id)),
    })
  } catch (err: any) {
    console.error('[celoris-chat/me]', err)
    return jsonError('Could not load Celoris Chat right now.', 500)
  }
}
