import { NextResponse } from 'next/server'
import { createSupabaseClientForServer } from '@/lib/supabase-client'

// Admin-only café room management — update + delete a single room by id.
// Same auth note as app/api/admin/cafe/rooms/route.ts: gated client-side
// only, following this codebase's existing /admin/* convention.
export const dynamic = 'force-dynamic'

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: roomId } = await params
    if (!roomId) {
      return NextResponse.json({ error: 'Room id is required' }, { status: 400 })
    }

    const body = await request.json()
    const admin = createSupabaseClientForServer()

    // Only touch fields the caller actually sent — this route is used both
    // by the full "edit room" form and by the quick present-count +/-
    // stepper, which sends just { currentStudents }.
    const updates: Record<string, any> = {}

    if (body.name !== undefined) updates.name = String(body.name).trim()
    if (body.description !== undefined) updates.description = String(body.description).trim() || null
    if (body.category !== undefined) updates.category = body.category
    if (body.tags !== undefined) {
      updates.tags = Array.isArray(body.tags)
        ? body.tags
        : String(body.tags).split(',').map((t: string) => t.trim()).filter(Boolean)
    }
    if (body.trainerName !== undefined) updates.trainer_name = String(body.trainerName).trim() || null
    if (body.maxStudents !== undefined) {
      updates.max_students = Math.min(200, Math.max(1, parseInt(body.maxStudents, 10) || 15))
    }
    if (body.classStatus !== undefined) updates.class_status = body.classStatus
    if (body.currentStudents !== undefined) {
      const cap = updates.max_students /* if also being updated this call */ ?? undefined
      updates.current_students = Math.max(0, parseInt(body.currentStudents, 10) || 0)
      if (cap) updates.current_students = Math.min(cap, updates.current_students)
    }
    if (body.nextBatchInfo !== undefined) updates.next_batch_info = String(body.nextBatchInfo).trim() || null
    if (body.trainerCode !== undefined) updates.trainer_code = String(body.trainerCode).trim() || null
    if (body.studentCode !== undefined) updates.student_code = String(body.studentCode).trim() || null
    if (body.courseUrl !== undefined) updates.course_url = String(body.courseUrl).trim() || null
    if (body.courseTitle !== undefined) updates.course_title = String(body.courseTitle).trim() || null
    if (body.courseImageUrl !== undefined) updates.course_image_url = String(body.courseImageUrl).trim() || null
    if (body.courseDescription !== undefined) updates.course_description = String(body.courseDescription).trim() || null
    if (body.isActive !== undefined) updates.is_active = !!body.isActive

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
    }

    const { data, error } = await admin
      .from('cafe_classrooms')
      .update(updates)
      .eq('id', roomId)
      .select()
      .single()

    if (error) {
      console.error('Admin cafe rooms PATCH error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ room: data })
  } catch (error: any) {
    console.error('Admin cafe rooms PATCH unexpected error:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: roomId } = await params
    if (!roomId) {
      return NextResponse.json({ error: 'Room id is required' }, { status: 400 })
    }

    const admin = createSupabaseClientForServer()

    // Soft delete, same as the student-facing /api/social/cafe/delete-room
    // route — keeps history instead of losing the row outright.
    const { error } = await admin
      .from('cafe_classrooms')
      .update({ is_active: false })
      .eq('id', roomId)

    if (error) {
      console.error('Admin cafe rooms DELETE error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Admin cafe rooms DELETE unexpected error:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
