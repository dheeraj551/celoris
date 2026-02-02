// ===========================================
// JOBS MANAGEMENT - API ROUTES
// ===========================================

import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseClientForServer } from '@/lib/supabase-client';

export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseClientForServer()
    const { searchParams } = new URL(request.url)

    const type = searchParams.get('type')
    const level = searchParams.get('level')
    const remote = searchParams.get('remote')
    const featured = searchParams.get('featured')
    const category = searchParams.get('category')
    const page = searchParams.get('page')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = supabase
      .from('jobs')
      .select('*')
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (type && type !== 'all') {
      query = query.eq('employment_type', type)
    }

    if (level && level !== 'all') {
      query = query.eq('experience_level', level)
    }

    if (remote !== null && remote !== undefined) {
      query = query.eq('is_remote', remote === 'true')
    }

    if (featured !== null && featured !== undefined) {
      query = query.eq('is_featured', featured === 'true')
    }

    if (category && category !== 'all') {
      query = query.eq('category', category)
    }

    if (page) {
      query = query.contains('target_pages', [page])
    }

    const { data, error, count } = await query

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Database error occurred' }, { status: 500 })
    }

    // Get total count for pagination
    const { count: totalCount } = await supabase
      .from('jobs')
      .select('*', { count: 'exact', head: true })

    return NextResponse.json({
      success: true,
      data: data || [],
      pagination: {
        total: totalCount || 0,
        page: Math.floor(offset / limit) + 1,
        limit,
        pages: Math.ceil((totalCount || 0) / limit)
      }
    })

  } catch (error: any) {
    console.error('Server error:', error)
    return NextResponse.json({
      error: 'Internal server error',
      message: error.message
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseClientForServer()
    const body = await request.json()

    // Validate required fields
    const requiredFields = ['title', 'company_name', 'location', 'description']
    const missingFields = requiredFields.filter(field => !body[field])

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      )
    }

    // Prepare job data
    const jobData = {
      title: body.title.trim(),
      company_name: body.company_name.trim(),
      company_logo_url: body.company_logo_url || null,
      company_icon: body.company_icon || null,
      company_description: body.company_description || null,
      company_website: body.company_website || null,
      location: body.location.trim(),
      is_remote: body.is_remote || false,
      employment_type: body.employment_type || 'full-time',
      experience_level: body.experience_level || 'mid-level',
      salary_min: body.salary_min ? parseInt(body.salary_min) : null,
      salary_max: body.salary_max ? parseInt(body.salary_max) : null,
      salary_currency: body.salary_currency || 'USD',
      salary_period: body.salary_period || 'year',
      description: body.description.trim(),
      requirements: Array.isArray(body.requirements) ? body.requirements : [],
      skills: Array.isArray(body.skills) ? body.skills : [],
      responsibilities: Array.isArray(body.responsibilities) ? body.responsibilities : [],
      benefits: Array.isArray(body.benefits) ? body.benefits : [],
      application_deadline: body.application_deadline || null,
      contact_email: body.contact_email || null,
      application_url: body.application_url || null,
      application_instructions: body.application_instructions || null,
      is_featured: body.is_featured || false,
      is_active: body.is_active !== false,
      is_published: body.is_published !== false,
      category: body.category || null,
      industry: body.industry || null,
      company_size: body.company_size || null
    }

    // Insert job into database
    const { data, error } = await (supabase as any)
      .from('jobs')
      .insert([jobData])
      .select()
      .single()

    if (error) {
      console.error('Database error creating job:', error)
      return NextResponse.json({
        error: 'Failed to create job posting',
        details: error.message,
        code: error.code
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Job posting created successfully',
      data
    }, { status: 201 })

  } catch (error: any) {
    console.error('Server error:', error)
    return NextResponse.json({
      error: 'Internal server error',
      message: error.message
    }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = createSupabaseClientForServer()
    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json({ error: 'Job ID is required' }, { status: 400 })
    }

    // Prepare update data (similar to POST but with all optional fields)
    const allowedFields = [
      'title', 'company_name', 'company_logo_url', 'company_icon', 'location', 'is_remote',
      'employment_type', 'experience_level', 'salary_min', 'salary_max',
      'salary_currency', 'salary_period', 'description', 'requirements',
      'skills', 'responsibilities', 'benefits', 'application_deadline',
      'contact_email', 'application_url', 'application_instructions',
      'is_featured', 'is_active', 'is_published', 'category', 'industry',
      'company_size', 'company_description', 'company_website'
    ]

    // Filter update data to only allowed fields
    const filteredData: any = {}
    allowedFields.forEach(field => {
      if (updateData.hasOwnProperty(field)) {
        filteredData[field] = updateData[field]
      }
    })

    // Convert string numbers to integers where needed
    if (filteredData.salary_min) filteredData.salary_min = parseInt(filteredData.salary_min)
    if (filteredData.salary_max) filteredData.salary_max = parseInt(filteredData.salary_max)

    // Update job in database
    const { data, error } = await (supabase as any)
      .from('jobs')
      .update(filteredData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Database error updating job:', error)
      return NextResponse.json({
        error: 'Failed to update job posting',
        details: error.message,
        code: error.code
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Job posting updated successfully',
      data
    })

  } catch (error: any) {
    console.error('Server error:', error)
    return NextResponse.json({
      error: 'Internal server error',
      message: error.message
    }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = createSupabaseClientForServer()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Job ID is required' }, { status: 400 })
    }

    // Delete job from database
    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Database error deleting job:', error)
      return NextResponse.json({
        error: 'Failed to delete job posting',
        details: error.message,
        code: error.code
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Job posting deleted successfully'
    })

  } catch (error: any) {
    console.error('Server error:', error)
    return NextResponse.json({
      error: 'Internal server error',
      message: error.message
    }, { status: 500 })
  }
}