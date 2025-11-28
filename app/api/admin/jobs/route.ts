// ===========================================
// JOBS MANAGEMENT - API ROUTES
// ===========================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-client';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
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

  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
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
      company_size: body.company_size || null,
      remote_policy: body.remote_policy || 'hybrid',
      visa_sponsorship: body.visa_sponsorship || false,
      years_required: body.years_required ? parseInt(body.years_required) : null,
      education_required: body.education_required || null,
      language_requirements: Array.isArray(body.language_requirements) ? body.language_requirements : [],
      travel_required: body.travel_required || false,
      department: body.department || null,
      seniority: body.seniority || null,
      reporting_to: body.reporting_to || null,
      team_size: body.team_size ? parseInt(body.team_size) : null,
      job_posting_source: body.job_posting_source || 'internal',
      meta_title: body.meta_title || null,
      meta_description: body.meta_description || null,
      tags: Array.isArray(body.tags) ? body.tags : [],
      application_instructions_detailed: body.application_instructions_detailed || null,
      hiring_manager_name: body.hiring_manager_name || null,
      hiring_manager_email: body.hiring_manager_email || null,
      hiring_manager_phone: body.hiring_manager_phone || null,
      external_job_id: body.external_job_id || null,
      status: body.status || 'active',
      urgency_level: body.urgency_level || 'normal',
      budget_range_min: body.budget_range_min ? parseInt(body.budget_range_min) : null,
      budget_range_max: body.budget_range_max ? parseInt(body.budget_range_max) : null,
      interview_process: body.interview_process || null,
      onboarding_timeline: body.onboarding_timeline || null
    }

    // Insert job into database
    const { data, error } = await (supabase as any)
      .from('jobs')
      .insert([jobData])
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to create job posting' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Job posting created successfully',
      data
    }, { status: 201 })

  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = createClient()
    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json({ error: 'Job ID is required' }, { status: 400 })
    }

    // Prepare update data (similar to POST but with all optional fields)
    const allowedFields = [
      'title', 'company_name', 'company_logo_url', 'location', 'is_remote',
      'employment_type', 'experience_level', 'salary_min', 'salary_max',
      'salary_currency', 'salary_period', 'description', 'requirements',
      'skills', 'responsibilities', 'benefits', 'application_deadline',
      'contact_email', 'application_url', 'application_instructions',
      'is_featured', 'is_active', 'is_published', 'category', 'industry',
      'company_size', 'remote_policy', 'visa_sponsorship', 'years_required',
      'education_required', 'language_requirements', 'travel_required',
      'department', 'seniority', 'reporting_to', 'team_size',
      'job_posting_source', 'meta_title', 'meta_description', 'tags',
      'application_instructions_detailed', 'hiring_manager_name',
      'hiring_manager_email', 'hiring_manager_phone', 'external_job_id',
      'status', 'urgency_level', 'budget_range_min', 'budget_range_max',
      'interview_process', 'onboarding_timeline'
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
    if (filteredData.years_required) filteredData.years_required = parseInt(filteredData.years_required)
    if (filteredData.team_size) filteredData.team_size = parseInt(filteredData.team_size)
    if (filteredData.budget_range_min) filteredData.budget_range_min = parseInt(filteredData.budget_range_min)
    if (filteredData.budget_range_max) filteredData.budget_range_max = parseInt(filteredData.budget_range_max)

    // Update job in database
    const { data, error } = await (supabase as any)
      .from('jobs')
      .update(filteredData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to update job posting' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Job posting updated successfully',
      data
    })

  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = createClient()
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
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to delete job posting' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Job posting deleted successfully'
    })

  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}