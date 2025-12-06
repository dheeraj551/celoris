import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-client'

// GET - Get single course with modules and topics
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()

    // Check if user is admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || user.email !== 'support@celorisdesigns.com') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params

    // Get course with modules and topics
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

// PUT - Update course
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()

    // Check if user is admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || user.email !== 'support@celorisdesigns.com') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    const body = await request.json()

    const { data, error } = await (supabase as any)
      .from('courses')
      .update({
        ...body,
        learning_outcomes: typeof body.learning_outcomes === 'string' ? body.learning_outcomes.split('\n').filter((s: string) => s.trim()) : body.learning_outcomes,
        requirements: typeof body.requirements === 'string' ? body.requirements.split('\n').filter((s: string) => s.trim()) : body.requirements,
        updated_at: new Date().toISOString()
      })
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

// DELETE - Delete course
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()

    // Check if user is admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || user.email !== 'support@celorisdesigns.com') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params

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