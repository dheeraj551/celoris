import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-client'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const subject = searchParams.get('subject')
    const featured = searchParams.get('featured')
    const search = searchParams.get('search')
    const grade_level = searchParams.get('grade_level')

    console.log('Courses API request:', { page, limit, subject, featured, search, grade_level })

    // Initialize Supabase client (automatically reads from environment variables)
    const supabase = createClient()

    // Build query
    let query = supabase
      .from('courses')
      .select(`
        *,
        course_modules (
          id,
          estimated_duration,
          course_topics (count)
        )
      `, { count: 'exact' })

    // Apply filters
    if (subject) {
      query = query.ilike('subject', `%${subject}%`)
    }

    if (grade_level) {
      query = query.eq('grade_level', grade_level)
    }

    if (featured === 'true') {
      query = query.eq('is_featured', true)
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
    }

    // Apply pagination
    const from = (page - 1) * limit
    const to = from + limit - 1

    query = query
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false })
      .range(from, to)

    const { data: courses, error, count } = await query

    if (error) {
      console.error('Supabase error fetching courses:', error)
      throw error
    }

    // Process courses to calculate totals
    const processedCourses = courses?.map(course => {
      const modules = course.course_modules || []
      const totalDuration = modules.reduce((acc: number, curr: any) => acc + (curr.estimated_duration || 0), 0)
      const totalTopics = modules.reduce((acc: number, curr: any) => acc + (curr.course_topics?.[0]?.count || 0), 0)

      return {
        ...course,
        course_duration: course.course_duration || `${Math.ceil(totalDuration / 60)} hours`,
        total_modules: modules.length,
        total_topics: totalTopics
      }
    }) || []

    return NextResponse.json({
      courses: processedCourses,
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit)
      },
      source: 'database'
    })

  } catch (error) {
    console.error('Error in courses API:', error)
    return NextResponse.json({
      error: 'Failed to fetch courses',
      message: error instanceof Error ? error.message : 'Unknown error',
      courses: [],
      pagination: {
        page: 1,
        limit: 12,
        total: 0,
        pages: 0
      }
    }, { status: 500 })
  }
}