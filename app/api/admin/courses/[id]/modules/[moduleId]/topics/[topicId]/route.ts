import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-client'

// GET - Get single topic
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string, moduleId: string, topicId: string } }
) {
  try {
    const supabase = createClient()
    
    // Check if user is admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || user.email !== 'support@celorisdesigns.com') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { topicId } = params

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
  { params }: { params: { id: string, moduleId: string, topicId: string } }
) {
  try {
    const supabase = createClient()
    
    // Check if user is admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || user.email !== 'support@celorisdesigns.com') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { topicId } = params
    const body = await request.json()

    const { data, error } = await (supabase as any)
      .from('course_topics')
      .update({
        ...body,
        updated_at: new Date().toISOString()
      })
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
  { params }: { params: { id: string, moduleId: string, topicId: string } }
) {
  try {
    const supabase = createClient()
    
    // Check if user is admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || user.email !== 'support@celorisdesigns.com') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { topicId } = params

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