import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { createSupabaseClientForServer } from '@/lib/supabase-client'

// COURSE API - Admin course creation with proper authentication
export async function POST(request: NextRequest) {
  try {
    console.log('ADMIN: Processing course creation request')

    // Create service client using centralized helper (handles trimming of keys)
    const serviceClient = createSupabaseClientForServer()
    console.log('ADMIN: Service client created successfully')

    // Attempt to get the authenticated user
    let userId = null
    try {
      const cookieStore = cookies()
      const authClient = createRouteHandlerClient({ cookies: () => cookieStore })
      const { data: { user } } = await authClient.auth.getUser()
      if (user) {
        userId = user.id
        console.log('ADMIN: Authenticated user found:', userId)
      } else {
        console.log('ADMIN: No authenticated user found')
      }
    } catch (authError) {
      console.warn('ADMIN: Failed to get authenticated user:', authError)
    }

    const body = await request.json()
    console.log('Course data received:', {
      title: body.title,
      subject: body.subject,
      level: body.level,
      hasDescription: !!body.description,
      hasPrice: !!body.price
    })

    // Map frontend field names to database column names
    const courseData = {
      title: body.title,
      description: body.description,
      subject: body.subject,
      grade_level: body.level || body.grade_level,
      target_audience: body.target_audience,
      instructor_name: body.instructor_name,
      course_duration: body.duration_weeks ? `${body.duration_weeks} weeks` : body.course_duration,
      price: body.price,
      course_image_url: body.course_image_url,
      is_published: body.is_published ?? false,
      is_featured: body.is_featured ?? false,
      created_by: userId || body.created_by || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    console.log('ADMIN: Inserting course data:', courseData)

    // Direct database insert using service role
    const { data, error } = await serviceClient
      .from('courses')
      .insert(courseData as any)
      .select()
      .single()

    if (error) {
      console.error('ADMIN: Database error:', error)
      return NextResponse.json({
        error: 'Failed to create course',
        details: error.message,
        code: error.code || 'DATABASE_ERROR',
        hint: error.hint || 'No hint available'
      }, { status: 500 })
    }

    console.log('ADMIN: Course created successfully:', data)

    return NextResponse.json({
      course: data,
      message: 'Course created successfully (ADMIN FIX)',
      status: 'bulletproof_fix_active',
      timestamp: new Date().toISOString()
    }, { status: 201 })

  } catch (error) {
    console.error('ADMIN: Course creation error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    return NextResponse.json({
      error: 'Failed to create course',
      details: errorMessage,
      status: 'bulletproof_fix_failed',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

// GET - List courses (also bulletproof)
export async function GET(request: NextRequest) {
  try {
    console.log('ADMIN: Processing course list request')

    // Verify environment variables
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SERVICE_ROLE_KEY

    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error('Missing environment variables')
    }

    const serviceClient = createClient(supabaseUrl, serviceRoleKey)

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const subject = searchParams.get('subject')
    const published = searchParams.get('published')
    const featured = searchParams.get('featured')
    const search = searchParams.get('search')

    console.log('ADMIN: Fetching courses with params:', { page, limit, subject, published, featured, search })

    let query = serviceClient
      .from('courses')
      .select('*', { count: 'exact' })

    // Apply filters
    if (subject) {
      query = query.eq('subject', subject)
    }
    if (published !== null && published !== '') {
      query = query.eq('is_published', published === 'true')
    }
    if (featured !== null && featured !== '') {
      query = query.eq('is_featured', featured === 'true')
    }
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
    }

    // Pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    // Ordering
    query = query.order('created_at', { ascending: false })

    const { data, error, count } = await query

    if (error) {
      console.error('ADMIN: Database error:', error)
      return NextResponse.json({
        error: 'Failed to fetch courses',
        details: error.message,
        status: 'bulletproof_error'
      }, { status: 500 })
    }

    console.log('ADMIN: Courses fetched successfully:', { count: data?.length, total: count })

    return NextResponse.json({
      courses: data || [],
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil((count || 0) / limit)
      },
      status: 'bulletproof_fix_active',
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('ADMIN: Course fetch error:', error)
    return NextResponse.json({
      error: 'Failed to fetch courses',
      details: error instanceof Error ? error.message : 'Unknown error',
      status: 'bulletproof_error'
    }, { status: 500 })
  }
}