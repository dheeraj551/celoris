import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// BULLETPROOF COURSE API - Service role bypass with complete error handling
export async function POST(request: NextRequest) {
  try {
    console.log('BULLETPROOF: Processing course creation request')
    
    // Verify environment variables exist
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SERVICE_ROLE_KEY
    
    if (!supabaseUrl) {
      throw new Error('SUPABASE_URL environment variable is missing')
    }
    
    if (!serviceRoleKey) {
      throw new Error('SUPABASE_SERVICE_ROLE_KEY environment variable is missing')
    }

    console.log('BULLETPROOF: Environment variables verified', {
      urlExists: !!supabaseUrl,
      keyExists: !!serviceRoleKey,
      url: supabaseUrl.substring(0, 20) + '...'
    })
    
    // Create service client
    const serviceClient = createClient(supabaseUrl, serviceRoleKey)
    console.log('BULLETPROOF: Service client created successfully')
    
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
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    console.log('BULLETPROOF: Inserting course data:', courseData)
    
    // Direct database insert using service role
    const { data, error } = await serviceClient
      .from('courses')
      .insert(courseData)
      .select()
      .single()
    
    if (error) {
      console.error('BULLETPROOF: Database error:', error)
      return NextResponse.json({ 
        error: 'Failed to create course',
        details: error.message,
        code: error.code || 'DATABASE_ERROR',
        hint: error.hint || 'No hint available'
      }, { status: 500 })
    }
    
    console.log('BULLETPROOF: Course created successfully:', data)
    
    return NextResponse.json({ 
      course: data,
      message: 'Course created successfully (BULLETPROOF FIX)',
      status: 'bulletproof_fix_active',
      timestamp: new Date().toISOString()
    }, { status: 201 })

  } catch (error) {
    console.error('BULLETPROOF: Course creation error:', error)
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
    console.log('BULLETPROOF: Processing course list request')
    
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

    console.log('BULLETPROOF: Fetching courses with params:', { page, limit, subject, published, featured, search })

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
      console.error('BULLETPROOF: Database error:', error)
      return NextResponse.json({ 
        error: 'Failed to fetch courses',
        details: error.message,
        status: 'bulletproof_error'
      }, { status: 500 })
    }

    console.log('BULLETPROOF: Courses fetched successfully:', { count: data?.length, total: count })

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
    console.error('BULLETPROOF: Course fetch error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch courses',
      details: error instanceof Error ? error.message : 'Unknown error',
      status: 'bulletproof_error'
    }, { status: 500 })
  }
}