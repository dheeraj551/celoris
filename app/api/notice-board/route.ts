import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClientForServer, createClientForBrowser } from '@/lib/supabase-client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')
    const all = searchParams.get('all') === 'true'

    // Use the browser client (Anon key) for public read access
    // This avoids potential issues with the Service Role client on the server
    // and aligns with the RLS policy "Public can view active notices"
    const supabase = createClientForBrowser()

    let query = supabase
      .from('notice_board')
      .select('*', { count: 'exact' })

    if (!all) {
      query = query.eq('is_active', true)
    }

    const { data, error, count } = await query
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

import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    // Switch to using Anon Key since Service Role is failing
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase environment variables')
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Debug logging
    console.log('Debug - Using Anon Key')

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

    if (!title || !student_name || !subject || !location) {
      return NextResponse.json(
        { error: 'Required fields missing: title, student_name, subject, location' },
        { status: 400 }
      )
    }

    // Clean up data
    const cleanBody = {
      title,
      student_name,
      subject,
      location,
      contact_number: contact_number || null, // Convert empty string to null
      description: description || null,
      priority,
      category,
      requirements: requirements || null,
      duration: duration || null,
      is_active
    }

    const { data, error } = await supabase
      .from('notice_board')
      .insert(cleanBody as any)
      .select()
      .single()

    if (error) {
      console.error('Supabase error creating notice:', error)

      // Fallback: Try raw fetch if "Invalid API key" error occurs
      if (error.message.includes('Invalid API key')) {
        console.log('Attempting raw fetch fallback...')
        try {
          const rawResponse = await fetch(`${supabaseUrl}/rest/v1/notice_board`, {
            method: 'POST',
            headers: {
              'apikey': supabaseKey?.trim() || '',
              'Authorization': `Bearer ${supabaseKey?.trim()}`,
              'Content-Type': 'application/json',
              'Prefer': 'return=representation'
            },
            body: JSON.stringify(cleanBody)
          })

          if (rawResponse.ok) {
            const rawData = await rawResponse.json()
            return NextResponse.json({ data: rawData[0] }, { status: 201 })
          } else {
            const rawError = await rawResponse.text()
            console.error('Raw fetch failed:', rawError)
            return NextResponse.json(
              { error: `Raw fetch failed: ${rawResponse.status} ${rawResponse.statusText}`, details: rawError },
              { status: 500 }
            )
          }
        } catch (rawErr) {
          console.error('Raw fetch exception:', rawErr)
        }
      }

      return NextResponse.json(
        { error: error.message, details: error },
        { status: 500 }
      )
    }

    return NextResponse.json({ data }, { status: 201 })
  } catch (error: any) {
    console.error('Server error in POST /api/notice-board:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}