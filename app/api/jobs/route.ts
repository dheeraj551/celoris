// ===========================================
// JOBS - PUBLIC API ROUTES
// ===========================================

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-client'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const type = searchParams.get('type')
    const level = searchParams.get('level')
    const remote = searchParams.get('remote')
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const featured = searchParams.get('featured')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = (page - 1) * limit

    // Initialize Supabase client (automatically reads from environment variables)
    const supabase = (createClient() as any)

    let query = supabase
      .from('jobs')
      .select('*', { count: 'exact' })

    // Apply filters
    if (type && type !== 'all') {
      query = query.eq('employment_type', type)
    }

    if (level && level !== 'all') {
      query = query.eq('experience_level', level)
    }

    if (remote !== null && remote !== undefined) {
      query = query.eq('is_remote', remote === 'true')
    }

    if (category && category !== 'all') {
      query = query.eq('category', category)
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,company_name.ilike.%${search}%,description.ilike.%${search}%`)
    }

    if (featured === 'true') {
      query = query.eq('is_featured', true)
    }

    // Sort and paginate
    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    const { data: dbJobs, error, count } = await query

    if (error) {
      console.error('Supabase error fetching jobs:', error)
      throw error
    }

    // Transform data for frontend - maintain original field names
    const transformedJobs = ((dbJobs || []) as any[]).map(job => ({
      id: job.id,
      title: job.title,
      company: job.company_name, // Mapping for frontend compatibility
      company_name: job.company_name, // Keeping original for clarity
      company_logo_url: job.company_logo_url,
      company_icon: job.company_icon,
      location: job.location,
      isRemote: job.is_remote, // Frontend uses camelCase
      is_remote: job.is_remote,
      salary: job.salary_min && job.salary_max
        ? `₹${job.salary_min.toLocaleString()} - ₹${job.salary_max.toLocaleString()}`
        : 'Competitive Salary',
      salary_min: job.salary_min,
      salary_max: job.salary_max,
      salary_currency: job.salary_currency,
      employmentType: job.employment_type, // Frontend uses camelCase
      employment_type: job.employment_type,
      experienceLevel: job.experience_level, // Frontend uses camelCase
      experience_level: job.experience_level,
      description: job.description,
      requirements: job.requirements || [],
      skills: job.skills || [],
      category: job.category,
      industry: job.industry || job.category,
      posted: getTimeAgo(job.created_at),
      applicants: job.applicants_count || 0,
      application_deadline: job.application_deadline || null,
      isFeatured: job.is_featured,
      is_featured: job.is_featured,
      created_at: job.created_at,
      application_count: job.application_count || 0,
      company_description: job.company_description,
      company_website: job.company_website,
      company_size: job.company_size,
      benefits: job.benefits,
      responsibilities: job.responsibilities
    }))

    return NextResponse.json({
      success: true,
      data: transformedJobs,
      pagination: {
        total: count || 0,
        page,
        limit,
        pages: Math.ceil((count || 0) / limit)
      },
      source: 'database'
    })

  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// Helper function to get time ago string
function getTimeAgo(dateString: string): string {
  const now = new Date()
  const date = new Date(dateString)
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 1) return '1 day ago'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
  return `${Math.floor(diffDays / 365)} years ago`
}