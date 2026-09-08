import { NextResponse } from 'next/server'
import { createSupabaseClientForServer } from '@/lib/supabase-client'

// Admin-only café room management — list + create.
//
// Auth note: like every other route under app/api/admin/* in this codebase
// (see app/api/admin/users/route.ts, toggle-social-block/route.ts), there is
// no server-side admin check here — the whole /admin/* area gates access
// client-side via a localStorage "admin_session" flag set at /admin/login
// (see app/admin/social/page.tsx's checkAdminAuth). This route follows that
// same existing convention rather than inventing a second, inconsistent
// auth model. It is a known, disclosed limitation: anyone who can reach
// this URL directly (not through the admin UI) can call it. If that needs
// to be tightened later, this is the place to add a real server-side check
// (e.g. a signed admin cookie or verifying the caller's Supabase user has
// role = 'admin').
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const admin = createSupabaseClientForServer()

    const { data, error } = await admin
      .from('cafe_classrooms')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Admin cafe rooms GET error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ rooms: data || [] })
  } catch (error: any) {
    console.error('Admin cafe rooms GET unexpected error:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const name = (body.name || '').trim()
    const description = (body.description || '').trim()
    if (!name) {
      return NextResponse.json({ error: 'Room name is required' }, { status: 400 })
    }

    const admin = createSupabaseClientForServer()

    const capacity = Math.min(200, Math.max(1, parseInt(body.maxStudents, 10) || 15))
    const present = Math.min(capacity, Math.max(0, parseInt(body.currentStudents, 10) || 1))

    const tags = Array.isArray(body.tags)
      ? body.tags
      : typeof body.tags === 'string'
        ? body.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
        : []

    // Room creation is admin-only now — there is no logged-in "host" behind
    // it, so host_id is left null rather than pointing at whichever admin
    // happened to click Create. In-room trainer privileges (mic, podium,
    // calling on students) come from entering the trainer_code, not from
    // owning this row — see /api/social/cafe/verify-admit-code.
    const { data, error } = await admin
      .from('cafe_classrooms')
      .insert({
        name,
        description: description || null,
        category: body.category || 'classroom',
        tags,
        host_id: null,
        trainer_name: (body.trainerName || '').trim() || null,
        max_students: capacity,
        class_status: body.classStatus || 'Ready',
        current_students: present,
        next_batch_info: (body.nextBatchInfo || '').trim() || null,
        trainer_code: (body.trainerCode || '').trim() || null,
        student_code: (body.studentCode || '').trim() || null,
        course_url: (body.courseUrl || '').trim() || null,
        course_title: (body.courseTitle || '').trim() || null,
        course_image_url: (body.courseImageUrl || '').trim() || null,
        course_description: (body.courseDescription || '').trim() || null,
        is_active: body.isActive !== false,
      })
      .select()
      .single()

    if (error) {
      console.error('Admin cafe rooms POST error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ room: data })
  } catch (error: any) {
    console.error('Admin cafe rooms POST unexpected error:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
