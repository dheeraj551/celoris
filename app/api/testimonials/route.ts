import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Sample testimonials data
const sampleTestimonials = [
  {
    id: '1',
    client_name: 'Sarah Johnson',
    client_title: 'Marketing Director',
    client_company: 'TechCorp Inc.',
    client_avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b3c4?w=100&h=100&fit=crop&crop=face',
    testimonial_text: 'Celoris Designs transformed our brand presence with their exceptional design work. The team is professional, creative, and delivers outstanding results.',
    rating: 5,
    testimonial_type: 'general',
    client_location: 'New York, USA',
    date_received: '2024-11-15',
    is_featured: true
  },
  {
    id: '2',
    client_name: 'Michael Chen',
    client_title: 'CEO',
    client_company: 'StartupHub',
    client_avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    testimonial_text: 'Outstanding service and attention to detail. The web application they built for us exceeded our expectations and has significantly improved our business operations.',
    rating: 5,
    testimonial_type: 'general',
    client_location: 'San Francisco, USA',
    date_received: '2024-11-10',
    is_featured: true
  },
  {
    id: '3',
    client_name: 'Emily Rodriguez',
    client_title: 'Product Manager',
    client_company: 'InnovateLabs',
    client_avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    testimonial_text: 'Working with Celoris Designs was a game-changer for our product launch. Their expertise in UI/UX design helped us create an intuitive and beautiful application.',
    rating: 5,
    testimonial_type: 'general',
    client_location: 'Austin, USA',
    date_received: '2024-11-05',
    is_featured: true
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const type = searchParams.get('type') || 'general'
    const page = searchParams.get('page') || 'homepage'
    const limit = parseInt(searchParams.get('limit') || '10')
    const featured = searchParams.get('featured')

    try {
      // Try to fetch from database first
      const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Supabase environment variables are missing')
      }

      const { createClient } = await import('@supabase/supabase-js')
      const supabase = (createClient(supabaseUrl, supabaseKey)) as any

      let query = supabase
        .from('testimonials')
        .select('*')

      // Apply filters
      // Filter by visibility (this is enforced by RLS but we include it explicitly)
      // Note: is_visible=true is enforced by RLS policy, so we don't need to filter

      // Filter by type if specified
      if (type && type !== 'all') {
        query = query.eq('testimonial_type', type)
      }

      // Filter by page if specified
      if (page && page !== 'all') {
        query = query.contains('target_pages', [page])
      }

      // Filter by featured if specified
      if (featured === 'true') {
        query = query.eq('is_featured', true)
      }

      // Order by created_at (latest first), then featured, then display_order
      query = query
        .order('created_at', { ascending: false })
        .order('is_featured', { ascending: false, nullsFirst: false })
        .order('display_order', { ascending: true })
        .limit(limit)

      const { data: dbTestimonials, error } = await query

      if (!error && dbTestimonials && dbTestimonials.length > 0) {
        // Remove duplicates based on client_name and testimonial_text
        const uniqueTestimonials = dbTestimonials.filter((testimonial: any, index: any, self: any) =>
          index === self.findIndex((t: any) =>
            t.client_name === testimonial.client_name &&
            t.testimonial_text === testimonial.testimonial_text
          )
        )

        // Return unique testimonials
        return NextResponse.json({
          success: true,
          data: uniqueTestimonials.slice(0, limit),
          count: uniqueTestimonials.length,
          source: 'database'
        })
      }
    } catch (dbError) {
      console.log('Database not available, using sample data:', dbError)
    }

    // Fallback to sample data (for demo or when database is empty)
    let filteredTestimonials = sampleTestimonials

    // Filter by type
    if (type && type !== 'all') {
      filteredTestimonials = filteredTestimonials.filter(t => t.testimonial_type === type)
    }

    // Filter by featured
    if (featured === 'true') {
      filteredTestimonials = filteredTestimonials.filter(t => t.is_featured)
    }

    // Order by featured first, then by date
    filteredTestimonials = filteredTestimonials
      .sort((a, b) => {
        if (a.is_featured && !b.is_featured) return -1
        if (!a.is_featured && b.is_featured) return 1
        return 0
      })

    // Apply limit
    const limitedTestimonials = filteredTestimonials.slice(0, limit)

    return NextResponse.json({
      success: true,
      data: limitedTestimonials,
      count: limitedTestimonials.length,
      source: 'sample' // Indicate this is sample data
    })

  } catch (error) {
    console.error('Error fetching testimonials:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch testimonials' },
      { status: 500 }
    )
  }
}
