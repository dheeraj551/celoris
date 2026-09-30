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
import { COURSE_ID_TO_SLUG, resolveCourseId } from '@/lib/course-slugs'
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
      .select('user_id')
      .eq('course_title', course.title)
      .neq('status', 'rejected')
      .limit(2000),
    db
      .from('course_applications')
      .select('user_id')
      .eq('course_title', course.title)
      .eq('offer_pass', true)
      .neq('status', 'rejected')
      .limit(2000),
  ])

  const trainers = await loadCourseTrainers(publicDb, course.id, room?.trainer_name || null).catch(() =>
    room?.trainer_name ? [{ name: String(room.trainer_name), avatarUrl: null }] : []
  )

  const registered = new Set(((apps?.data || []) as any[]).map((a) => a.user_id)).size
  const claimed = new Set(((passes?.data || []) as any[]).map((a) => a.user_id)).size

  const session = room ? nextSession(room, now) : null
  const batchStart = room?.next_class_at || null
  const seatsTotal = typeof room?.max_students === 'number' ? room.max_students : null

  let offer: CourseBatchInfo['offer'] = null
  if (Number(course.launch_offer_passes) > 0 && course.launch_offer_ends_at) {
    const total = Number(course.launch_offer_passes)
    const left = Math.max(0, total - claimed)
    offer = {
      passes: total,
      claimed: Math.min(claimed, total),
      left,
      endsAt: new Date(course.launch_offer_ends_at).toISOString(),
      active: left > 0 && Date.parse(course.launch_offer_ends_at) > now.getTime(),
    }
  }

  return {
    roomId: room?.id || null,
    trainerName: room?.trainer_name || null,
    trainers,
    batchNumber: course.batch_number ? String(course.batch_number) : null,
    nextStart: session ? session.start.toISOString() : null,
    nextEnd: session ? session.end.toISOString() : null,
    isLive: !!session?.isLive,
    batchStarted: !!batchStart && Date.parse(batchStart) <= now.getTime(),
    batchStart,
    repeatsWeekly: !!room?.repeats_weekly,
    classMinutes: room?.class_duration_minutes || null,
    scheduleLabel: session ? (room?.repeats_weekly ? weeklyLabel(session.start.toISOString()) : null) : null,
    seatsTotal,
    registered,
    seatsLeft: seatsTotal === null ? null : Math.max(0, seatsTotal - registered),
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
