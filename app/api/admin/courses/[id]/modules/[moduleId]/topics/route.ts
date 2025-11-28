import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-client'

// GET - List topics for a module
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

    const { data, error } = await supabase
      .from('course_topics')
      .insert({
        ...body,
        module_id: moduleId
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