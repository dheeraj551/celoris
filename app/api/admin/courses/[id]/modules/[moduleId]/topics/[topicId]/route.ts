import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClientForServer } from '@/lib/supabase-client'

// Admin single topic — get/update/delete.
export const dynamic = 'force-dynamic'

// GET - Get single topic
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string, moduleId: string, topicId: string }> }
) {
  try {
    const { topicId } = await params
    const supabase = createSupabaseClientForServer() as any

    const { data, error } = await supabase
      .from('course_topics')
      .select('*')
      .eq('id', topicId)
      .single()

    if (error) throw error

    return NextResponse.json({ topic: data })
  } catch (error) {
    console.error('Error fetching topic:', error)
    return NextResponse.json({ error: 'Failed to fetch topic' }, { status: 500 })
  }
}

// PUT - Update topic
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string, moduleId: string, topicId: string }> }
) {
  try {
    const { topicId } = await params
    const body = await request.json()
    const supabase = createSupabaseClientForServer() as any

    const updates: Record<string, any> = { updated_at: new Date().toISOString() }
    if (body.order_in_module !== undefined) updates.order_in_module = body.order_in_module
    if (body.title !== undefined) updates.title = body.title
    if (body.short_description !== undefined) updates.short_description = body.short_description || ''
    if (body.full_content !== undefined) updates.full_content = body.full_content || null
    if (body.content_type !== undefined) updates.content_type = body.content_type
    if (body.estimated_duration !== undefined) updates.estimated_duration = body.estimated_duration || null
    if (body.status !== undefined) updates.status = body.status
    if (body.is_free_preview !== undefined) updates.is_free_preview = body.is_free_preview

    const { data, error } = await supabase
      .from('course_topics')
      .update(updates)
      .eq('id', topicId)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ topic: data })
  } catch (error) {
    console.error('Error updating topic:', error)
    return NextResponse.json({ error: 'Failed to update topic' }, { status: 500 })
  }
}

// DELETE - Delete topic
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string, moduleId: string, topicId: string }> }
) {
  try {
    const { topicId } = await params
    const supabase = createSupabaseClientForServer() as any

    const { error } = await supabase
      .from('course_topics')
      .delete()
      .eq('id', topicId)

    if (error) throw error

    return NextResponse.json({ message: 'Topic deleted successfully' })
  } catch (error) {
    console.error('Error deleting topic:', error)
    return NextResponse.json({ error: 'Failed to delete topic' }, { status: 500 })
  }
}
