// Server-only: loads a course (with its modules) and its live batch figures.
// Wrapped in React cache() so the page and its layout share one query each.
//
// Live batch figures come from the course's linked classroom — the Café Room
// whose "course URL" points at this course page (Admin → Social → Café
// Rooms). Change the class date, capacity or trainer there and the course
// page follows automatically.

import { cache } from 'react'
import { createServerClient } from '@/lib/supabase-server'
import { createSupabaseClientForServer } from '@/lib/supabase-client'
import { nextSession } from '@/lib/class-schedule'
import { COURSE_ID_TO_SLUG, resolveCourseId, COURSE_BATCH_DEFAULTS } from '@/lib/course-slugs'
import type { CourseBatchInfo, CourseTrainer } from '@/lib/course-batch-types'

export const loadCoursePageData = cache(async (idOrSlug: string) => {
  const id = resolveCourseId(idOrSlug)
  if (!id) return null
  try {
    const supabase: any = await createServerClient()
    const { data } = await supabase
      .from('courses')
      .select(
        `*,
        course_modules (
          id, module_number, title, description, estimated_duration,
          course_topics ( id, order_in_module, title, short_description )
        )`
      )
      .eq('id', id)
      .maybeSingle()
    if (!data || data.is_published === false) return null
    return data as any
  } catch {
    return null
  }
})

async function findLinkedRoom(db: any, course: { id: string; title: string }) {
  const slug = COURSE_ID_TO_SLUG[course.id]
  const { data } = await db
    .from('cafe_classrooms')
    .select(
      'id, course_url, course_title, trainer_name, max_students, next_class_at, class_duration_minutes, repeats_weekly, created_at'
    )
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(200)
  const rooms = (data || []) as any[]
  const byUrl = rooms.find((r) => {
    const url = String(r.course_url || '').toLowerCase().replace(/\/+$/, '')
    return !!url && ((slug && url.endsWith(`/learn/course/${slug}`)) || url.endsWith(`/learn/course/${course.id}`))
  })
  return byUrl || rooms.find((r) => r.course_title && r.course_title === course.title) || null
}

// Trainers with an active booth on this course (the "Trainer Booth" section).
async function loadCourseTrainers(publicDb: any, courseId: string, lead: string | null): Promise<CourseTrainer[]> {
  const { data: booths } = await publicDb
    .from('course_trainer_booths')
    .select('trainer_id, created_at')
    .eq('course_id', courseId)
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: true })
  const ids = Array.from(new Set(((booths || []) as any[]).map((b) => b.trainer_id).filter(Boolean)))
  let list: CourseTrainer[] = []
  if (ids.length) {
    // Same public read the Trainer Booth section uses.
    const { data: users } = await publicDb.from('users').select('id, full_name, profile_pic_url').in('id', ids)
    const byId = new Map(((users || []) as any[]).map((u) => [u.id, u]))
    list = ids
      .map((id) => byId.get(id))
      .filter((u: any) => u && String(u.full_name || '').trim())
      .map((u: any) => ({ name: String(u.full_name).trim(), avatarUrl: u.profile_pic_url || null }))
  }
  // Lead trainer (from the classroom) first; add them if they have no booth.
  if (lead) {
    const l = lead.trim().toLowerCase()
    const i = list.findIndex((t) => t.name.toLowerCase() === l || t.name.toLowerCase().startsWith(l + ' '))
    if (i > 0) list.unshift(list.splice(i, 1)[0])
    else if (i === -1) list.unshift({ name: lead.trim(), avatarUrl: null })
  }
  return list
}

function weeklyLabel(iso: string): string {
  const d = new Date(iso)
  const day = d.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', weekday: 'long' })
  const time = d.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: 'numeric', minute: '2-digit', hour12: true })
  return `${day}s · ${time.toUpperCase()} IST`
}

const WEEK_MS = 7 * 24 * 60 * 60 * 1000

/** Start time of every class in the batch (weekly: one per module). */
function classStarts(batchStart: string, weekly: boolean, modules: number): number[] {
  const first = Date.parse(batchStart)
  const count = weekly ? Math.max(1, modules || 1) : 1
  return Array.from({ length: count }, (_, i) => first + i * WEEK_MS)
}

/** The free-pass round we're in right now (see CourseLaunchOffer). */
function computeOffer({
  course,
  room,
  batchStart,
  seatsLeft,
  passRows,
  now,
}: {
  course: any
  room: any
  batchStart: string | null
  seatsLeft: number | null
  passRows: { user_id: string; created_at: string }[]
  now: Date
}): CourseBatchInfo['offer'] {
  const cap = Number(course.launch_offer_passes) || 0
  if (cap <= 0 || !room || !batchStart || seatsLeft === null) return null

  const t = now.getTime()
  const modules = Array.isArray(course.course_modules) ? course.course_modules.length : 0
  const starts = classStarts(batchStart, !!room.repeats_weekly, modules)
  const started = starts.filter((s) => s <= t).length // classes already begun
  const round = started + 1
  const roundStart = started > 0 ? new Date(starts[started - 1]).toISOString() : null
  const roundEnd = started < starts.length ? new Date(starts[started]).toISOString() : null
  const hardStop = course.launch_offer_ends_at ? Date.parse(course.launch_offer_ends_at) : null

  const base = { round, perRound: cap, roundStart, passes: 0, claimed: 0, left: 0, endsAt: null as string | null, active: false }
  if (!roundEnd || (hardStop !== null && hardStop <= t)) return { ...base, state: 'ended' }
  if (seatsLeft <= 0) return { ...base, state: 'full' }

  const since = roundStart ? Date.parse(roundStart) : -Infinity
  const claimed = new Set(passRows.filter((r) => Date.parse(r.created_at) >= since).map((r) => r.user_id)).size
  const passes = Math.min(cap, claimed + seatsLeft)
  const left = Math.max(0, passes - claimed)
  return {
    round,
    perRound: cap,
    roundStart,
    passes,
    claimed: Math.min(claimed, passes),
    left,
    endsAt: roundEnd,
    active: left > 0,
    state: left > 0 ? 'open' : 'round_full',
  }
}

export async function computeCourseBatch(course: any): Promise<CourseBatchInfo> {
  const db: any = createSupabaseClientForServer()
  // Active classrooms are publicly readable, so the room lookup uses the
  // normal client — schedule and trainer still show even if the service key
  // is missing (e.g. a local .env). Only the counts need the service role.
  const publicDb: any = await createServerClient()
  const now = new Date()
  const price = Number(course.price) > 0 ? Number(course.price) : 0

  const [room, apps, passes] = await Promise.all([
    findLinkedRoom(publicDb, course).catch(() => null),
    db
      .from('course_applications')
      .select('user_id, intent')
      .eq('course_title', course.title)
      .neq('status', 'rejected')
      .limit(2000),
    db
      .from('course_applications')
      .select('user_id, created_at')
      .eq('course_title', course.title)
      .eq('offer_pass', true)
      .neq('status', 'rejected')
      .limit(2000),
  ])

  const trainers = await loadCourseTrainers(publicDb, course.id, room?.trainer_name || null).catch(() =>
    room?.trainer_name ? [{ name: String(room.trainer_name), avatarUrl: null }] : []
  )

  // Seats are held by everyone who applied, except waitlist sign-ups.
  const registered = new Set(
    ((apps?.data || []) as any[]).filter((a) => a.intent !== 'waitlist').map((a) => a.user_id)
  ).size

  const defaults = COURSE_BATCH_DEFAULTS[course.id]
  const session = room ? nextSession(room, now) : null
  const batchStart = room?.next_class_at || defaults?.batchStart || null
  const seatsTotal = typeof room?.max_students === 'number' ? room.max_students : (defaults?.seatsTotal || null)
  const finalRegistered = registered > 0 ? registered : (defaults?.registered || 0)
  const seatsLeft = seatsTotal === null ? null : Math.max(0, seatsTotal - finalRegistered)

  const offer = computeOffer({
    course,
    room,
    batchStart,
    seatsLeft,
    passRows: (passes?.data || []) as any[],
    now,
  })

  return {
    roomId: room?.id || null,
    trainerName: room?.trainer_name || null,
    trainers,
    batchNumber: course.batch_number ? String(course.batch_number) : (defaults?.batchNumber || null),
    soldOutNotice: defaults?.soldOutBatch || null,
    nextStart: session ? session.start.toISOString() : (defaults?.batchStart || null),
    nextEnd: session ? session.end.toISOString() : null,
    isLive: !!session?.isLive,
    batchStarted: !!batchStart && Date.parse(batchStart) <= now.getTime(),
    batchStart,
    repeatsWeekly: !!room?.repeats_weekly || true,
    classMinutes: room?.class_duration_minutes || 90,
    scheduleLabel: session ? (room?.repeats_weekly ? weeklyLabel(session.start.toISOString()) : null) : (defaults?.scheduleLabel || null),
    seatsTotal,
    registered: finalRegistered,
    seatsLeft,
    price,
    offer,
    updatedAt: now.toISOString(),
  }
}

export const loadCourseBatch = cache(async (idOrSlug: string): Promise<CourseBatchInfo | null> => {
  const course = await loadCoursePageData(idOrSlug)
  if (!course) return null
  try {
    return await computeCourseBatch(course)
  } catch (err) {
    console.error('[course-batch] failed:', err)
    return null
  }
})
