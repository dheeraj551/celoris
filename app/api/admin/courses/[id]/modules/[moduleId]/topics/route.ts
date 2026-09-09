import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClientForServer } from '@/lib/supabase-client'

// Admin course topics — list/create topics for one module.
// Same service-role, no-server-auth-check convention as the module routes
// next door — see app/api/admin/courses/[id]/route.ts for the explanation.
export const dynamic = 'force-dynamic'

// GET - List topics for a module
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string, moduleId: string }> }
) {
  try {
    const { moduleId } = await params
    const supabase = createSupabaseClientForServer() as any

    const { data, error } = await supabase
      .from('course_topics')
      .select('*')
      .eq('module_id', moduleId)
      .order('order_in_module', { ascending: true })

    if (error) throw error

    return NextResponse.json({ topics: data })
  } catch (error) {
    console.error('Error fetching topics:', error)
    return NextResponse.json({ error: 'Failed to fetch topics' }, { status: 500 })
  }
}

// POST - Create new topic
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string, moduleId: string }> }
) {
  try {
    const { moduleId } = await params
    const body = await request.json()
    const supabase = createSupabaseClientForServer() as any

    const { data, error } = await supabase
      .from('course_topics')
      .insert({
        order_in_module: body.order_in_module,
        title: body.title,
        short_description: body.short_description || '',
        full_content: body.full_content || null,
        content_type: body.content_type || 'text',
        estimated_duration: body.estimated_duration || null,
        status: body.status || 'published',
        is_free_preview: body.is_free_preview ?? false,
        module_id: moduleId,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ topic: data }, { status: 201 })
  } catch (error) {
    console.error('Error creating topic:', error)
    return NextResponse.json({ error: 'Failed to create topic' }, { status: 500 })
  }
}
