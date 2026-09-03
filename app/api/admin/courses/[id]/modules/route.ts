import { NextRequest, NextResponse } from 'next/server'
import { createRouteClient } from '@/lib/supabase-server'
import { createSupabaseClientForServer } from '@/lib/supabase-client'

// See app/api/admin/courses/[id]/route.ts for why this uses the cookie-aware
// route client instead of the plain browser client for the auth check.
async function requireAdmin(): Promise<NextResponse | null> {
  try {
    const authClient = (await createRouteClient()) as any
    const { data: { user } } = await authClient.auth.getUser()
    if (!user || user.email !== 'support@celorisdesigns.com') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return null
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}

// GET - List modules for a course
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authError = await requireAdmin()
    if (authError) return authError

    const supabase = createSupabaseClientForServer() as any
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
    const authError = await requireAdmin()
    if (authError) return authError

    const supabase = createSupabaseClientForServer() as any
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
