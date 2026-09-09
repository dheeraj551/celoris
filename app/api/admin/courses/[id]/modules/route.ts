import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClientForServer } from '@/lib/supabase-client'

// Admin course modules — list/create modules for one course.
// See app/api/admin/courses/[id]/route.ts for why there's no server-side
// admin auth check here (client-side-only admin session convention).
export const dynamic = 'force-dynamic'

// GET - List modules for a course
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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
    const { id } = await params
    const body = await request.json()
    const supabase = createSupabaseClientForServer() as any

    const { data, error } = await supabase
      .from('course_modules')
      .insert({
        module_number: body.module_number,
        title: body.title,
        description: body.description || null,
        estimated_duration: body.estimated_duration || null,
        is_published: body.is_published ?? true,
        course_id: id,
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
