import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-client'

// GET - List modules for a course
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createClient()

    // Check if user is admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || user.email !== 'support@celorisdesigns.com') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params;

    const { data, error } = await supabase
      .from('course_modules')
      .select(`
        *,
        course_topics (
          id,
          order_in_module,
          title,
          short_description,
          status,
          estimated_duration
        )
      `)
      .eq('course_id', id)
      .order('module_number', { ascending: true })

    if (error) throw error

    return NextResponse.json({ modules: data })

  } catch (error) {
    console.error('Error fetching modules:', error)
    return NextResponse.json({ error: 'Failed to fetch modules' }, { status: 500 })
  }
}

// POST - Create new module
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createClient()

    // Check if user is admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || user.email !== 'support@celorisdesigns.com') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params;
    const body = await request.json()

    const { data, error } = await supabase
      .from('course_modules')
      .insert({
        ...body,
        course_id: id
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ module: data }, { status: 201 })

  } catch (error) {
    console.error('Error creating module:', error)
    return NextResponse.json({ error: 'Failed to create module' }, { status: 500 })
  }
}