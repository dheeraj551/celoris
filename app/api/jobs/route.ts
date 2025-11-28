// ===========================================
// JOBS - PUBLIC API ROUTES
// ===========================================

import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Sample jobs data
const sampleJobs = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    company_name: 'TechCorp Solutions',
    company_logo_url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop',
    location: 'San Francisco, CA',
    is_remote: true,
    salary_min: 120000,
    salary_max: 150000,
    salary_currency: 'USD',
    employment_type: 'full-time',
    experience_level: 'senior',
    description: 'We are looking for an experienced frontend developer to join our growing team. You will be responsible for building user-facing features using React, TypeScript, and modern web technologies.',
    requirements: [
      '5+ years of experience with React',
      'Strong knowledge of TypeScript',
      'Experience with modern CSS frameworks',
      'Knowledge of testing frameworks'
    ],
    skills: ['React', 'TypeScript', 'CSS', 'JavaScript', 'Testing'],
    category: 'Development',
    application_deadline: '2024-12-31',
    is_featured: true,
    application_count: 25,
    created_at: '2024-11-15T00:00:00Z'
  },
  {
    id: '2',
    title: 'UX/UI Designer',
    company_name: 'Creative Studio',
    company_logo_url: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=100&h=100&fit=crop',
    location: 'New York, NY',
    is_remote: false,
    salary_min: 80000,
    salary_max: 100000,
    salary_currency: 'USD',
    employment_type: 'full-time',
    experience_level: 'mid-level',
    description: 'Join our design team to create beautiful and functional user experiences. You will work closely with product managers and developers to bring our vision to life.',
    requirements: [
      '3+ years of UX/UI design experience',
      'Proficiency in Figma and Adobe Creative Suite',
      'Portfolio of mobile and web designs',
      'Strong understanding of user-centered design principles'
    ],
    skills: ['Figma', 'Adobe Creative Suite', 'User Research', 'Prototyping'],
    category: 'Design',
    application_deadline: '2024-12-25',
    is_featured: true,
    application_count: 18,
    created_at: '2024-11-14T00:00:00Z'
  },
  {
    id: '3',
    title: 'Digital Marketing Specialist',
    company_name: 'Growth Labs',
    company_logo_url: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=100&h=100&fit=crop',
    location: 'Austin, TX',
    is_remote: true,
    salary_min: 65000,
    salary_max: 85000,
    salary_currency: 'USD',
    employment_type: 'full-time',
    experience_level: 'mid-level',
    description: 'We are seeking a digital marketing specialist to drive growth through various online channels. You will manage SEO, social media, and content marketing campaigns.',
    requirements: [
      '3+ years of digital marketing experience',
      'Experience with SEO and SEM',
      'Knowledge of Google Analytics and Ads',
      'Content creation and social media management skills'
    ],
    skills: ['SEO', 'Google Analytics', 'Social Media', 'Content Marketing'],
    category: 'Marketing',
    application_deadline: '2024-12-20',
    is_featured: true,
    application_count: 32,
    created_at: '2024-11-13T00:00:00Z'
  }
]

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

    try {
      // Try to fetch from database first
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_ANON_KEY!
      )

      let query = supabase
        .from('jobs')
        .select('*')

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

      const { data: dbJobs, error } = await query

      if (!error && dbJobs && dbJobs.length > 0) {
        // Database has content - return it
        return NextResponse.json({
          success: true,
          data: dbJobs,
          pagination: {
            total: dbJobs.length,
            page,
            limit,
            pages: Math.ceil(dbJobs.length / limit)
          },
          source: 'database' // Indicate this is database content
        })
      }
    } catch (dbError) {
      console.log('Database not available, using sample data:', dbError)
    }

    // Fallback to sample data (for demo or when database is empty)
    let filteredJobs = sampleJobs

    // Apply filters
    if (type && type !== 'all') {
      filteredJobs = filteredJobs.filter(job => job.employment_type === type)
    }

    if (level && level !== 'all') {
      filteredJobs = filteredJobs.filter(job => job.experience_level === level)
    }

    if (remote !== null && remote !== undefined) {
      filteredJobs = filteredJobs.filter(job => job.is_remote === (remote === 'true'))
    }

    if (category && category !== 'all') {
      filteredJobs = filteredJobs.filter(job => job.category === category)
    }

    if (search) {
      filteredJobs = filteredJobs.filter(job => 
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        job.company_name.toLowerCase().includes(search.toLowerCase()) ||
        job.description.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (featured === 'true') {
      filteredJobs = filteredJobs.filter(job => job.is_featured)
    }

    // Sort by featured first, then by creation date
    filteredJobs.sort((a, b) => {
      if (a.is_featured && !b.is_featured) return -1
      if (!a.is_featured && b.is_featured) return 1
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })

    // Apply pagination
    const paginatedJobs = filteredJobs.slice(offset, offset + limit)

    // Transform data for frontend - maintain original field names
    const transformedJobs = paginatedJobs.map(job => ({
      id: job.id,
      title: job.title,
      company_name: job.company_name,
      company_logo_url: job.company_logo_url,
      location: job.location,
      is_remote: job.is_remote,
      salary_min: job.salary_min,
      salary_max: job.salary_max,
      salary_currency: job.salary_currency,
      employment_type: job.employment_type,
      experience_level: job.experience_level,
      description: job.description,
      requirements: job.requirements || [],
      skills: job.skills || [],
      category: job.category,
      industry: job.category,
      application_deadline: job.application_deadline || null,
      is_featured: job.is_featured,
      created_at: job.created_at,
      application_count: job.application_count || Math.floor(Math.random() * 100) + 10
    }))

    return NextResponse.json({
      success: true,
      data: transformedJobs,
      pagination: {
        total: filteredJobs.length,
        page,
        limit,
        pages: Math.ceil(filteredJobs.length / limit)
      },
      source: 'sample' // Indicate this is sample data
    })

  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
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