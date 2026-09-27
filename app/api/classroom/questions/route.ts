import { NextResponse } from 'next/server'
import { createRouteClient } from '@/lib/supabase-server'
import { createSupabaseClientForServer } from '@/lib/supabase-client'
import { resolveRoomAccess } from '@/lib/cafe-room-access'
import { getEntitlements, loadPlanSettings, upgradeLabelFor } from '@/lib/plans'
import { PLAN_TIERS, type PlanTier } from '@/lib/plan-features'
import {
  QUESTION_MAX_CHARS,
  SUPER_MAX,
  SUPER_MIN,
  UNLIMITED_QUESTIONS,
  rowToQuestion,
  type QaMe,
  type QaMode,
} from '@/lib/classroom-questions'

// Live class Q&A (3D and 2D classrooms).
//
//   GET    ?roomId=            questions + mode + what I'm allowed to do
//                               (+ for the trainer: which students may speak)
//   POST   { roomId, text, credits? }      ask (credits > 0 = Super Question)
//   PATCH  { roomId, mode }                trainer: 'qa' | 'lecture'
//   PATCH  { roomId, questionId, status }  trainer: 'answered' | 'removed' | 'open'
//
// Everything that matters is decided here, never by the browser: who you are,
// your plan, the per-class limit, the price and who gets paid. The money moves
// inside classroom_ask_question in one transaction.

export const dynamic = 'force-dynamic'

const ROOM_RE = /^[0-9a-f-]{36}$/i
const PRESENCE_FRESH_SECONDS = 60
const SESSION_MAX_HOURS = 6

type Admin = ReturnType<typeof createSupabaseClientForServer>

async function currentUser() {
  const client = await createRouteClient()
  const {
    data: { user },
  } = await client.auth.getUser()
  return user
}

/** A class "session" starts when the trainer pressed Start class, but never looks back more than 6 hours. */
async function sessionStart(admin: Admin, roomId: string): Promise<string> {
  const floor = Date.now() - SESSION_MAX_HOURS * 3600 * 1000
  const { data } = await (admin as any).from('cafe_classrooms').select('class_started_at').eq('id', roomId).maybeSingle()
  const started = data?.class_started_at ? Date.parse(data.class_started_at) : 0
  return new Date(Math.max(floor, Number.isFinite(started) ? started : 0)).toISOString()
}

async function presentPeople(admin: Admin, roomId: string) {
  const cutoff = new Date(Date.now() - PRESENCE_FRESH_SECONDS * 1000).toISOString()
  const { data } = await (admin as any)
    .from('cafe_classroom_presence')
    .select('user_id, role, joined_at')
    .eq('room_id', roomId)
    .gte('last_heartbeat', cutoff)
    .order('joined_at', { ascending: true })
  return (data || []) as { user_id: string; role: string; joined_at: string }[]
}

/** Who gets a Super Question's credits: the room's owner if they're here, else the first trainer who joined. */
async function payableTrainer(admin: Admin, roomId: string): Promise<string | null> {
  const [{ data: room }, people] = await Promise.all([
    (admin as any).from('cafe_classrooms').select('host_id').eq('id', roomId).maybeSingle(),
    presentPeople(admin, roomId),
  ])
  const trainers = people.filter((p) => p.role === 'trainer')
  if (!trainers.length) return null
  const host = room?.host_id ? trainers.find((t) => t.user_id === room.host_id) : null
  return (host || trainers[0]).user_id
}

/** Present students whose plan lets them speak (for the trainer's "Let speak" buttons). */
async function speakerIds(admin: Admin, roomId: string): Promise<string[]> {
  const people = (await presentPeople(admin, roomId)).filter((p) => p.role === 'student')
  if (!people.length) return []
  const ids = people.map((p) => p.user_id)
  const [settings, { data: plans }] = await Promise.all([
    loadPlanSettings(admin),
    (admin as any).from('user_plans').select('user_id, plan_tier, expires_at').in('user_id', ids),
  ])
  const tierOf: Record<string, PlanTier> = {}
  for (const row of (plans || []) as any[]) {
    const t = String(row.plan_tier) as PlanTier
    const expired = row.expires_at && Date.parse(row.expires_at) <= Date.now()
    tierOf[row.user_id] = PLAN_TIERS.indexOf(t) !== -1 && !expired ? t : 'free'
  }
  return ids.filter((id) => settings[tierOf[id] || 'free'].features.classroom_speak === true)
}

function limitOf(n: number): number | null {
  return n >= UNLIMITED_QUESTIONS ? null : Math.max(0, n)
}

export async function GET(request: Request) {
  try {
    const roomId = new URL(request.url).searchParams.get('roomId') || ''
    if (!ROOM_RE.test(roomId)) return NextResponse.json({ error: 'Invalid classroom' }, { status: 400 })
    const user = await currentUser()
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    const admin = createSupabaseClientForServer()
    const access = await resolveRoomAccess(admin, roomId, user.id)
    if (!access.roomExists || access.role === 'none') {
      return NextResponse.json({ error: 'Not admitted to this classroom' }, { status: 403 })
    }
    const isTrainer = access.role === 'trainer'
    const db: any = admin

    const since = await sessionStart(admin, roomId)
    const [ent, settings, stateRes, questionsRes, walletRes, trainerId] = await Promise.all([
      getEntitlements(admin, user.id),
      loadPlanSettings(admin),
      db.from('classroom_qa_state').select('mode').eq('room_id', roomId).maybeSingle(),
      db
        .from('classroom_questions')
        .select('id, room_id, asker_id, asker_name, asker_tier, body, credits, status, created_at, handled_at')
        .eq('room_id', roomId)
        .gte('created_at', since)
        .order('created_at', { ascending: false })
        .limit(200),
      db.from('users').select('wallet_balance').eq('id', user.id).maybeSingle(),
      payableTrainer(admin, roomId),
    ])

    const questions = ((questionsRes.data || []) as any[]).map(rowToQuestion)
    const freeUsed = questions.filter((q) => q.askerId === user.id && q.credits === 0).length
    const f = ent.features

    const me: QaMe = {
      tier: ent.tier,
      planLabel: ent.label,
      isTrainer,
      canSpeak: isTrainer || f.classroom_speak === true,
      freeLimit: limitOf(f.classroom_questions_per_class),
      freeUsed,
      superAllowed: !isTrainer && f.classroom_super_questions === true,
      balance: Number(walletRes.data?.wallet_balance) || 0,
      speakPlan: upgradeLabelFor(settings, 'classroom_speak'),
      superPlan: upgradeLabelFor(settings, 'classroom_super_questions'),
    }

    return NextResponse.json({
      mode: (stateRes.data?.mode as QaMode) || 'qa',
      questions,
      me,
      trainerPresent: !!trainerId,
      speakers: isTrainer ? await speakerIds(admin, roomId) : undefined,
      since,
    })
  } catch (err) {
    console.error('[classroom questions] GET error:', err)
    return NextResponse.json({ error: 'Could not load questions' }, { status: 500 })
  }
}

const ERRORS: Record<string, { status: number; message: string }> = {
  INVALID_QUESTION: { status: 400, message: 'Type a question first (up to 300 characters).' },
  TOO_FAST: { status: 429, message: 'One moment — you just asked. Try again in a few seconds.' },
  QUESTION_LIMIT: { status: 403, message: "You've used your questions for this class." },
  NO_TRAINER: { status: 409, message: 'The trainer isn’t in the room right now, so Super Questions are paused.' },
  SELF_SUPER: { status: 400, message: 'Trainers can’t send Super Questions to themselves.' },
  INSUFFICIENT_BALANCE: { status: 402, message: 'Not enough credits in your wallet.' },
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const roomId = typeof body.roomId === 'string' ? body.roomId : ''
    const text = typeof body.text === 'string' ? body.text.trim() : ''
    const credits = Number(body.credits) || 0
    if (!ROOM_RE.test(roomId)) return NextResponse.json({ error: 'Invalid classroom' }, { status: 400 })
    if (!text || text.length > QUESTION_MAX_CHARS) return NextResponse.json({ error: ERRORS.INVALID_QUESTION.message }, { status: 400 })
    if (credits !== 0 && (!Number.isInteger(credits) || credits < SUPER_MIN || credits > SUPER_MAX)) {
      return NextResponse.json({ error: `Super Questions are ${SUPER_MIN}–${SUPER_MAX} credits.` }, { status: 400 })
    }

    const user = await currentUser()
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    const admin = createSupabaseClientForServer()
    const access = await resolveRoomAccess(admin, roomId, user.id)
    if (!access.roomExists || access.role === 'none') {
      return NextResponse.json({ error: 'Not admitted to this classroom' }, { status: 403 })
    }
    if (access.role === 'trainer') {
      return NextResponse.json({ error: 'Trainers answer questions — use the class chat to talk to the room.' }, { status: 400 })
    }

    const [ent, settings, profile] = await Promise.all([
      getEntitlements(admin, user.id),
      loadPlanSettings(admin),
      (admin as any).from('users').select('full_name').eq('id', user.id).maybeSingle(),
    ])

    let trainerId: string | null = null
    if (credits > 0) {
      if (ent.features.classroom_super_questions !== true) {
        return NextResponse.json(
          { error: `Super Questions come with ${upgradeLabelFor(settings, 'classroom_super_questions')}.`, upgrade: true },
          { status: 403 }
        )
      }
      trainerId = await payableTrainer(admin, roomId)
      if (!trainerId) return NextResponse.json({ error: ERRORS.NO_TRAINER.message }, { status: 409 })
    }

    const limit = limitOf(ent.features.classroom_questions_per_class)
    const { data, error } = await (admin as any).rpc('classroom_ask_question', {
      p_user: user.id,
      p_room: roomId,
      p_name: String(profile.data?.full_name || user.user_metadata?.full_name || 'Student').slice(0, 60),
      p_tier: ent.tier,
      p_body: text,
      p_credits: credits,
      p_trainer: trainerId,
      p_free_limit: limit === null ? -1 : limit,
      p_since: await sessionStart(admin, roomId),
    })

    if (error) {
      const code = Object.keys(ERRORS).find((k) => (error.message || '').includes(k))
      if (code) {
        const e = ERRORS[code]
        const extra =
          code === 'QUESTION_LIMIT'
            ? ` ${upgradeLabelFor(settings, 'classroom_super_questions')} members can keep asking — or wait for the next class.`
            : ''
        return NextResponse.json({ error: e.message + extra, code, upgrade: code === 'QUESTION_LIMIT' }, { status: e.status })
      }
      throw error
    }

    return NextResponse.json({ ok: true, id: data?.id ?? null, balance: data?.balance ?? null })
  } catch (err) {
    console.error('[classroom questions] POST error:', err)
    return NextResponse.json({ error: 'Could not send your question' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const roomId = typeof body.roomId === 'string' ? body.roomId : ''
    if (!ROOM_RE.test(roomId)) return NextResponse.json({ error: 'Invalid classroom' }, { status: 400 })

    const user = await currentUser()
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    const admin = createSupabaseClientForServer()
    const access = await resolveRoomAccess(admin, roomId, user.id)
    if (!access.roomExists || access.role !== 'trainer') {
      return NextResponse.json({ error: 'Only the trainer can do that' }, { status: 403 })
    }
    const db: any = admin

    if (body.mode !== undefined) {
      if (body.mode !== 'qa' && body.mode !== 'lecture') return NextResponse.json({ error: 'Invalid mode' }, { status: 400 })
      const { error } = await db
        .from('classroom_qa_state')
        .upsert({ room_id: roomId, mode: body.mode, updated_by: user.id, updated_at: new Date().toISOString() }, { onConflict: 'room_id' })
      if (error) throw error
      return NextResponse.json({ ok: true, mode: body.mode })
    }

    const questionId = Number(body.questionId)
    const status = String(body.status || '')
    if (!Number.isInteger(questionId) || questionId <= 0 || ['open', 'answered', 'removed'].indexOf(status) === -1) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }
    const { data, error } = await db
      .from('classroom_questions')
      .update({ status, handled_at: status === 'open' ? null : new Date().toISOString() })
      .eq('id', questionId)
      .eq('room_id', roomId)
      .select('id')
      .maybeSingle()
    if (error) throw error
    if (!data) return NextResponse.json({ error: 'Question not found' }, { status: 404 })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[classroom questions] PATCH error:', err)
    return NextResponse.json({ error: 'Could not update' }, { status: 500 })
  }
}
