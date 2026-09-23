import { NextResponse } from 'next/server'
import { createRouteClient } from '@/lib/supabase-server'
import { createSupabaseClientForServer } from '@/lib/supabase-client'
import { resolveRoomAccess } from '@/lib/cafe-room-access'

// Whiteboard room event log — every board change (a stroke, an erase, a card
// being added/moved/edited) and every chat message goes through here.
//
// Why a server route instead of clients broadcasting to each other: the
// prototype this room is based on let ANY connected browser push board
// changes and chat to everyone else, with whatever name it liked, and the
// Word card renders HTML — so one student could have drawn over the board,
// impersonated the trainer, or injected script into every classmate's page.
// Here the server decides who you are and what you may do:
//   - board ops: the room's trainer only
//   - chat: anyone admitted to the room, with their real profile name
// Rows land in `cafe_room_events`; clients receive them through Supabase
// Realtime (RLS lets admitted members read, nobody but this route writes).

export const dynamic = 'force-dynamic'

const MAX_OP_BYTES = 900_000 // pasted images are downscaled client-side to fit
const MAX_CHAT_CHARS = 1000
const CHAT_MIN_INTERVAL_MS = 700
const MAX_BOARD_EVENTS_ON_LOAD = 6000
const CHAT_HISTORY = 100

const BOARD_OP_TYPES = new Set([
  'stroke_add',
  'strokes_delete',
  'strokes_restore',
  'board_clear',
  'card_create',
  'card_update',
  'card_delete',
  'background',
])
const TOOLS = new Set(['fountain-pen', 'sketch-pencil', 'ballpoint', 'marker-highlighter'])
const CARD_TYPES = new Set(['youtube', 'ppt', 'word', 'excel', 'image'])
const TEXTURES = new Set(['paper-plain', 'paper-grid', 'paper-dots', 'paper-lined', 'dark-grid', 'parchment'])
const COLOR_RE = /^(#[0-9a-fA-F]{3,8}|rgba?\([\d\s.,%]+\))$/
const ID_RE = /^[A-Za-z0-9_.:-]{1,80}$/

function isFiniteNum(n: unknown): n is number {
  return typeof n === 'number' && Number.isFinite(n)
}

/** Rejects script-bearing URLs anywhere in a payload (defence in depth — the
 *  client also sanitises everything it renders). */
function containsDangerousUrl(value: unknown, depth = 0): boolean {
  if (depth > 12) return true
  if (typeof value === 'string') {
    const v = value.trim().toLowerCase()
    return v.startsWith('javascript:') || v.startsWith('vbscript:') || v.startsWith('data:text/html')
  }
  if (Array.isArray(value)) return value.some((v) => containsDangerousUrl(v, depth + 1))
  if (value && typeof value === 'object') return Object.values(value).some((v) => containsDangerousUrl(v, depth + 1))
  return false
}

function validStroke(s: any): boolean {
  return (
    s && typeof s === 'object' &&
    typeof s.id === 'string' && ID_RE.test(s.id) &&
    TOOLS.has(s.tool) &&
    typeof s.color === 'string' && COLOR_RE.test(s.color) &&
    isFiniteNum(s.size) && s.size > 0 && s.size <= 200 &&
    Array.isArray(s.points) && s.points.length > 0 && s.points.length <= 20000 &&
    s.points.every((p: any) => p && isFiniteNum(p.x) && isFiniteNum(p.y) && isFiniteNum(p.pressure))
  )
}

function validCard(c: any): boolean {
  if (!c || typeof c !== 'object') return false
  if (typeof c.id !== 'string' || !ID_RE.test(c.id)) return false
  if (!CARD_TYPES.has(c.type)) return false
  if (![c.x, c.y, c.width, c.height, c.zIndex].every(isFiniteNum)) return false
  if (c.width <= 0 || c.height <= 0 || c.width > 5000 || c.height > 5000) return false
  if (!c.data || typeof c.data !== 'object') return false
  if (c.type === 'youtube' && c.data.videoId && !/^[A-Za-z0-9_-]{6,20}$/.test(c.data.videoId)) return false
  if (c.type === 'image') {
    const src = String(c.data.src || '')
    if (!/^https:\/\//i.test(src) && !/^data:image\/(png|jpe?g|gif|webp);base64,/i.test(src)) return false
  }
  return true
}

function validBoardOp(op: any): string | null {
  if (!op || typeof op !== 'object' || !BOARD_OP_TYPES.has(op.type)) return 'Unknown board operation'
  switch (op.type) {
    case 'stroke_add':
      return validStroke(op.stroke) ? null : 'Invalid stroke'
    case 'strokes_delete':
      return Array.isArray(op.ids) && op.ids.length <= 5000 && op.ids.every((id: any) => typeof id === 'string' && ID_RE.test(id)) ? null : 'Invalid stroke ids'
    case 'strokes_restore':
      return Array.isArray(op.strokes) && op.strokes.length <= 2000 && op.strokes.every(validStroke) ? null : 'Invalid strokes'
    case 'board_clear':
      return null
    case 'card_create':
      return validCard(op.card) ? null : 'Invalid card'
    case 'card_update': {
      if (typeof op.cardId !== 'string' || !ID_RE.test(op.cardId)) return 'Invalid card id'
      const u = op.updates
      if (!u || typeof u !== 'object') return 'Invalid card update'
      const allowed = new Set(['x', 'y', 'width', 'height', 'zIndex', 'minimized', 'pinned', 'title', 'data'])
      if (!Object.keys(u).every((k) => allowed.has(k))) return 'Invalid card update fields'
      for (const k of ['x', 'y', 'width', 'height', 'zIndex']) {
        if (k in u && !isFiniteNum(u[k])) return 'Invalid card geometry'
      }
      if ('data' in u && (typeof u.data !== 'object' || u.data === null)) return 'Invalid card data'
      if (u.data?.src !== undefined) {
        const src = String(u.data.src)
        if (!/^https:\/\//i.test(src) && !/^data:image\/(png|jpe?g|gif|webp);base64,/i.test(src)) return 'Invalid image source'
      }
      return null
    }
    case 'card_delete':
      return typeof op.cardId === 'string' && ID_RE.test(op.cardId) ? null : 'Invalid card id'
    case 'background':
      return TEXTURES.has(op.texture) ? null : 'Invalid background'
  }
  return 'Unknown board operation'
}

async function authed() {
  const routeClient = await createRouteClient()
  const { data: { user }, error } = await routeClient.auth.getUser()
  return error ? null : user
}

function tableMissing(error: any) {
  return !!error && (error.code === '42P01' || /cafe_room_events/.test(error.message || ''))
}

const MIGRATION_HINT = 'The whiteboard room database tables are not set up yet (run supabase/migrations/20260923_cafe_whiteboard_room.sql).'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const roomId = searchParams.get('roomId') || ''
    const afterId = Number(searchParams.get('afterId') || 0)

    const user = await authed()
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    const admin = createSupabaseClientForServer()
    const access = await resolveRoomAccess(admin, roomId, user.id)
    if (!access.roomExists || access.role === 'none') {
      return NextResponse.json({ error: 'Not admitted to this room' }, { status: 403 })
    }

    if (afterId > 0) {
      // Catch-up after a realtime gap (or an oversized row that realtime
      // delivered without its payload).
      const { data, error } = await admin
        .from('cafe_room_events')
        .select('id, kind, payload, author_id, author_name, created_at')
        .eq('room_id', roomId)
        .gt('id', afterId)
        .order('id', { ascending: true })
        .limit(2000)
      if (error) return NextResponse.json({ error: tableMissing(error) ? MIGRATION_HINT : error.message }, { status: 500 })
      return NextResponse.json({ events: data || [], role: access.role })
    }

    const [board, chat] = await Promise.all([
      admin
        .from('cafe_room_events')
        .select('id, kind, payload, author_id, author_name, created_at')
        .eq('room_id', roomId)
        .eq('kind', 'board')
        .order('id', { ascending: true })
        .limit(MAX_BOARD_EVENTS_ON_LOAD),
      admin
        .from('cafe_room_events')
        .select('id, kind, payload, author_id, author_name, created_at')
        .eq('room_id', roomId)
        .eq('kind', 'chat')
        .order('id', { ascending: false })
        .limit(CHAT_HISTORY),
    ])

    const err = board.error || chat.error
    if (err) return NextResponse.json({ error: tableMissing(err) ? MIGRATION_HINT : err.message }, { status: 500 })

    return NextResponse.json({
      events: [...(board.data || []), ...(chat.data || []).reverse()].sort((a: any, b: any) => a.id - b.id),
      role: access.role,
    })
  } catch (error: any) {
    console.error('room-events GET error:', error)
    return NextResponse.json({ error: error.message || 'Unknown error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const raw = await request.text()
    if (raw.length > MAX_OP_BYTES) {
      return NextResponse.json({ error: 'That item is too large to share on the board.' }, { status: 413 })
    }
    let body: any
    try {
      body = JSON.parse(raw)
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
    }

    const { roomId, kind } = body || {}
    if (!roomId || (kind !== 'board' && kind !== 'chat')) {
      return NextResponse.json({ error: 'roomId and kind are required' }, { status: 400 })
    }

    const user = await authed()
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    const admin = createSupabaseClientForServer()
    const access = await resolveRoomAccess(admin, roomId, user.id)
    if (!access.roomExists || access.role === 'none') {
      return NextResponse.json({ error: 'Not admitted to this room' }, { status: 403 })
    }
    if (access.category !== 'whiteboard') {
      return NextResponse.json({ error: 'This room does not have a whiteboard' }, { status: 400 })
    }

    const { data: profile } = await admin
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .maybeSingle()
    const authorName = (profile?.full_name || '').trim() || (access.role === 'trainer' ? 'Trainer' : 'Student')

    if (kind === 'board') {
      if (access.legacy || access.role !== 'trainer') {
        return NextResponse.json({ error: 'Only the trainer can change the board.' }, { status: 403 })
      }
      const op = body.op
      const problem = validBoardOp(op)
      if (problem) return NextResponse.json({ error: problem }, { status: 400 })
      if (containsDangerousUrl(op)) return NextResponse.json({ error: 'Blocked unsafe link' }, { status: 400 })

      const payload = {
        ...op,
        sid: typeof op.sid === 'string' ? op.sid.slice(0, 40) : undefined,
      }

      const { data, error } = await admin
        .from('cafe_room_events')
        .insert({ room_id: roomId, kind: 'board', payload, author_id: user.id, author_name: authorName })
        .select('id')
        .single()
      if (error) return NextResponse.json({ error: tableMissing(error) ? MIGRATION_HINT : error.message }, { status: 500 })

      // Keep the log small: once the board is wiped, earlier stroke history
      // can never matter again (cards/background events are kept).
      if (op.type === 'board_clear') {
        await admin
          .from('cafe_room_events')
          .delete()
          .eq('room_id', roomId)
          .eq('kind', 'board')
          .in('payload->>type', ['stroke_add', 'strokes_delete', 'strokes_restore', 'board_clear'])
          .lt('id', data.id)
      }

      return NextResponse.json({ id: data.id })
    }

    // Chat
    const text = typeof body.text === 'string' ? body.text.trim() : ''
    if (!text) return NextResponse.json({ error: 'Message is empty' }, { status: 400 })
    if (text.length > MAX_CHAT_CHARS) {
      return NextResponse.json({ error: `Messages are limited to ${MAX_CHAT_CHARS} characters.` }, { status: 400 })
    }

    const { data: last } = await admin
      .from('cafe_room_events')
      .select('created_at')
      .eq('room_id', roomId)
      .eq('kind', 'chat')
      .eq('author_id', user.id)
      .order('id', { ascending: false })
      .limit(1)
      .maybeSingle()
    if (last && Date.now() - new Date(last.created_at).getTime() < CHAT_MIN_INTERVAL_MS) {
      return NextResponse.json({ error: 'Slow down a little.' }, { status: 429 })
    }

    const { data, error } = await admin
      .from('cafe_room_events')
      .insert({
        room_id: roomId,
        kind: 'chat',
        payload: { text, isTrainer: access.role === 'trainer' },
        author_id: user.id,
        author_name: authorName,
      })
      .select('id')
      .single()
    if (error) return NextResponse.json({ error: tableMissing(error) ? MIGRATION_HINT : error.message }, { status: 500 })

    return NextResponse.json({ id: data.id })
  } catch (error: any) {
    console.error('room-events POST error:', error)
    return NextResponse.json({ error: error.message || 'Unknown error' }, { status: 500 })
  }
}
