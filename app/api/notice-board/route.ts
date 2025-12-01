import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClientForServer, createClientForBrowser } from '@/lib/supabase-client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Use the browser client (Anon key) for public read access
    // This avoids potential issues with the Service Role client on the server
    // and aligns with the RLS policy "Public can view active notices"
    const supabase = createClientForBrowser()

    const { data, error, count } = await supabase
      .from('notice_board')
      .select('*', { count: 'exact' })
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Supabase Error fetching notice board data:', JSON.stringify(error, null, 2))
      return NextResponse.json(
        { error: error.message || 'Failed to fetch notice board data' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      data,
      pagination: {
        total: count || 0,
        limit,
        offset,
        hasMore: (count || 0) > offset + limit
      }
    })
  } catch (error: any) {
    console.error('Server error in GET /api/notice-board:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const supabase = createSupabaseClientForServer()

    const {
      title,
      student_name,
      subject,
      location,
      contact_number,
      description,
      priority,
      category,
      requirements,
      duration,
      is_active = true
    } = body

    if (!title || !student_name || !subject || !location || !contact_number) {
      return NextResponse.json(
        { error: 'Required fields missing: title, student_name, subject, location, contact_number' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('notice_board')
      .insert({
        title,
        student_name,
        subject,
        location,
        contact_number,
        description,
        priority,
        category,
        requirements,
        duration,
        is_active
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating notice board entry:', error)
      return NextResponse.json(
        { error: 'Failed to create notice board entry' },
        { status: 500 }
      )
    }

    return NextResponse.json({ data }, { status: 201 })
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}