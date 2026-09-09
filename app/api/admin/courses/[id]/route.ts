import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClientForServer } from '@/lib/supabase-client'

// Admin course detail — get/update/delete a single course.
//
// NOTE on auth: this used to gate every request behind a real Supabase
// Auth session check (`supabase.auth.getUser()`), but admin login in this
// app is entirely client-side (`localStorage.admin_session` set at
// /admin/login) — there's never a real Supabase Auth cookie for the admin
// user, so that check silently 401'd every single request. Removed to
// match the same (weak, disclosed) client-side-only convention every other
// /api/admin/* route in this codebase already uses.
export const dynamic = 'force-dynamic'

// GET - single course with its modules + topics, same shape the public
// /learn/course/[id] page reads.
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = createSupabaseClientForServer() as any

    const { data, error } = await supabase
      .from('courses')
      .select(`
        *,
        course_modules (
          id,
          module_number,
          title,
          description,
          estimated_duration,
          is_published,
          course_topics (
            id,
            order_in_module,
            title,
            short_description,
            full_content,
            content_type,
            estimated_duration,
            status,
            is_free_preview
          )
        )
      `)
      .eq('id', id)
      .single()

    if (error) throw error

    return NextResponse.json({ course: data })
  } catch (error) {
    console.error('Error fetching course:', error)
    return NextResponse.json({ error: 'Failed to fetch course' }, { status: 500 })
  }
}

// PUT - update a course's own fields. Deliberately only writes the known
// scalar columns — never spreads the raw body — so an edit request that
// still carries the nested course_modules/course_topics relations (from a
// GET-then-edit round trip) can't accidentally clobber anything.
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const supabase = createSupabaseClientForServer() as any

    const updates: Record<string, any> = {}
    const setIfPresent = (key: string, value: any) => {
      if (value !== undefined) updates[key] = value
    }

    setIfPresent('title', body.title)
    setIfPresent('subject', body.subject)
    setIfPresent('grade_level', body.grade_level)
    setIfPresent('description', body.description)
    setIfPresent('target_audience', body.target_audience)
    setIfPresent('instructor_name', body.instructor_name)
    setIfPresent('instructor_bio', body.instructor_bio)
    setIfPresent('course_duration', body.course_duration)
    setIfPresent('price', body.price)
    setIfPresent('course_image_url', body.course_image_url)
    setIfPresent('preview_video_url', body.preview_video_url)
    setIfPresent('syllabus_url', body.syllabus_url)
    setIfPresent('is_published', body.is_published)
    setIfPresent('is_featured', body.is_featured)
    setIfPresent('batch_number', body.batch_number)
    setIfPresent('batch_status', body.batch_status)
    setIfPresent('home_tutor_available', body.home_tutor_available)

    if (body.seats_left !== undefined) {
      updates.seats_left = body.seats_left === '' || body.seats_left === null ? null : Number(body.seats_left)
    }
    if (body.seats_total !== undefined) {
      updates.seats_total = body.seats_total === '' || body.seats_total === null ? null : Number(body.seats_total)
    }

    if (body.learning_outcomes !== undefined) {
      updates.learning_outcomes = Array.isArray(body.learning_outcomes)
        ? body.learning_outcomes
        : String(body.learning_outcomes).split('\n').map((s: string) => s.trim()).filter(Boolean)
    }
    if (body.requirements !== undefined) {
      updates.requirements = Array.isArray(body.requirements)
        ? body.requirements
        : String(body.requirements).split('\n').map((s: string) => s.trim()).filter(Boolean)
    }

    updates.updated_at = new Date().toISOString()

    const { data, error } = await supabase
      .from('courses')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ course: data })
  } catch (error) {
    console.error('Error updating course:', error)
    return NextResponse.json({ error: 'Failed to update course' }, { status: 500 })
  }
}

// DELETE - remove a course. course_modules/course_topics are expected to
// cascade via their FK (they already do for every other parent/child pair
// in this schema); if that's ever not the case the DB error surfaces here.
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = createSupabaseClientForServer() as any

    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ message: 'Course deleted successfully' })
  } catch (error) {
    console.error('Error deleting course:', error)
    return NextResponse.json({ error: 'Failed to delete course' }, { status: 500 })
  }
}
