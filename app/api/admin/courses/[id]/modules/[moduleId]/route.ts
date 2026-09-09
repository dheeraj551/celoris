import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClientForServer } from '@/lib/supabase-client'

// Admin single module — get/update/delete.
// Switched from the plain browser client (no cookies, so RLS + the old
// auth.getUser() check both always failed here) to the service-role
// server client, matching every other /api/admin/* route. See
// app/api/admin/courses/[id]/route.ts for the full explanation.
export const dynamic = 'force-dynamic'

// GET - Get single module
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string, moduleId: string }> }
) {
  try {
    const { moduleId } = await params
    const supabase = createSupabaseClientForServer() as any

    const { data, error } = await supabase
      .from('course_modules')
      .select(`
        *,
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
      `)
      .eq('id', moduleId)
      .single()

    if (error) throw error

    return NextResponse.json({ module: data })
  } catch (error) {
    console.error('Error fetching module:', error)
    return NextResponse.json({ error: 'Failed to fetch module' }, { status: 500 })
  }
}

// PUT - Update module
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string, moduleId: string }> }
) {
  try {
    const { moduleId } = await params
    const body = await request.json()
    const supabase = createSupabaseClientForServer() as any

    const updates: Record<string, any> = { updated_at: new Date().toISOString() }
    if (body.module_number !== undefined) updates.module_number = body.module_number
    if (body.title !== undefined) updates.title = body.title
    if (body.description !== undefined) updates.description = body.description || null
    if (body.estimated_duration !== undefined) updates.estimated_duration = body.estimated_duration || null
    if (body.is_published !== undefined) updates.is_published = body.is_published

    const { data, error } = await supabase
      .from('course_modules')
      .update(updates)
      .eq('id', moduleId)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ module: data })
  } catch (error) {
    console.error('Error updating module:', error)
    return NextResponse.json({ error: 'Failed to update module' }, { status: 500 })
  }
}

// DELETE - Delete module (cascades to its course_topics)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string, moduleId: string }> }
) {
  try {
    const { moduleId } = await params
    const supabase = createSupabaseClientForServer() as any

    const { error } = await supabase
      .from('course_modules')
      .delete()
      .eq('id', moduleId)

    if (error) throw error

    return NextResponse.json({ message: 'Module deleted successfully' })
  } catch (error) {
    console.error('Error deleting module:', error)
    return NextResponse.json({ error: 'Failed to delete module' }, { status: 500 })
  }
}
