import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-client'

// GET - Get single module
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string, moduleId: string } }
) {
  try {
    const supabase = createClient()
    
    // Check if user is admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || user.email !== 'support@celorisdesigns.com') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { moduleId } = params

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
  { params }: { params: { id: string, moduleId: string } }
) {
  try {
    const supabase = createClient()
    
    // Check if user is admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || user.email !== 'support@celorisdesigns.com') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { moduleId } = params
    const body = await request.json()

    const { data, error } = await (supabase as any)
      .from('course_modules')
      .update({
        ...body,
        updated_at: new Date().toISOString()
      })
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

// DELETE - Delete module
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string, moduleId: string } }
) {
  try {
    const supabase = createClient()
    
    // Check if user is admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || user.email !== 'support@celorisdesigns.com') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { moduleId } = params

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