import { NextRequest, NextResponse } from 'next/server'
import {
  adminClient,
  filterContactInfo,
  getCaller,
  getOrCreateChatProfile,
  jsonError,
} from '@/lib/celoris-chat-server'
import { CHAT_INTERESTS, MAX_BIO_LENGTH, cleanInterests } from '@/lib/celoris-chat-interests'

export const dynamic = 'force-dynamic'

const PAGE_SIZE = 24

// GET ?q=&interest=&page= — people in Discover. Only people who have turned
// Discover on themselves can browse it. Students only see students and
// trainers only see trainers. Friends, blocked people, pending requests and
// anyone who declined you in the last 30 days are left out.
export async function GET(req: NextRequest) {
  const user = await getCaller()
  if (!user) return jsonError('Please sign in first.', 401)

  try {
    const admin = adminClient()
    const me = await getOrCreateChatProfile(admin, user)
    if (me.is_banned) return jsonError('Your Celoris Chat access has been paused.', 403)
    if (!me.discoverable) return NextResponse.json({ needsOptIn: true, people: [], hasMore: false })

    const url = new URL(req.url)
    const rawQ = (url.searchParams.get('q') || '').trim().slice(0, 40)
    // Escape LIKE wildcards so a search for "%" doesn't match everyone.
    const search = rawQ ? rawQ.replace(/[\\%_]/g, (c) => `\\${c}`) : null
    const interestParam = url.searchParams.get('interest')
    const interest = interestParam && (CHAT_INTERESTS as readonly string[]).indexOf(interestParam) !== -1 ? interestParam : null
    const page = Math.min(Math.max(parseInt(url.searchParams.get('page') || '0', 10) || 0, 0), 20)

    const { data, error } = await admin.rpc('celoris_chat_discover', {
      viewer: user.id,
      search,
      interest,
      lim: PAGE_SIZE + 1,
      off: page * PAGE_SIZE,
    })
    if (error) throw error

    const rows = (data || []) as any[]
    return NextResponse.json({
      needsOptIn: false,
      people: rows.slice(0, PAGE_SIZE).map((r) => ({
        id: r.user_id,
        name: r.display_name,
        avatarUrl: r.avatar_url,
        bio: r.bio || null,
        interests: r.interests || [],
        shared: r.shared || 0,
      })),
      hasMore: rows.length > PAGE_SIZE,
    })
  } catch (err) {
    console.error('[celoris-chat/discover GET]', err)
    return jsonError('Could not load Discover right now.', 500)
  }
}

// POST { discoverable, bio?, interests? } — turn Discover on/off and save the
// short intro people see there. Contact details in the intro are hidden.
export async function POST(req: NextRequest) {
  const user = await getCaller()
  if (!user) return jsonError('Please sign in first.', 401)

  const body = await req.json().catch(() => ({}))
  if (typeof body?.discoverable !== 'boolean') return jsonError('Missing setting.')

  try {
    const admin = adminClient()
    const me = await getOrCreateChatProfile(admin, user)
    if (me.is_banned) return jsonError('Your Celoris Chat access has been paused.', 403)

    const update: Record<string, any> = {
      discoverable: body.discoverable,
      updated_at: new Date().toISOString(),
    }
    let filtered = false
    if (body.discoverable) {
      const interests = cleanInterests(body.interests)
      if (interests.length === 0) return jsonError('Pick at least one interest so the right people find you.')
      const rawBio = typeof body.bio === 'string' ? body.bio.replace(/\s+/g, ' ').trim().slice(0, MAX_BIO_LENGTH) : ''
      const clean = filterContactInfo(rawBio)
      filtered = clean.filtered
      update.bio = clean.body.slice(0, MAX_BIO_LENGTH) || null
      update.interests = interests
      if (!me.discoverable) update.discoverable_since = new Date().toISOString()
    }

    const { error } = await admin.from('celoris_chat_profiles').update(update).eq('user_id', user.id)
    if (error) throw error

    return NextResponse.json({
      discoverable: body.discoverable,
      bio: body.discoverable ? update.bio || '' : me.bio || '',
      interests: body.discoverable ? update.interests : me.interests || [],
      filtered,
    })
  } catch (err) {
    console.error('[celoris-chat/discover POST]', err)
    return jsonError('Could not save your Discover settings.', 500)
  }
}
