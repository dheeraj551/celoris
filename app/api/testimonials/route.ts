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

    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!
    )

    let query = supabase
      .from('testimonials')
      .select('*')

    if (type && type !== 'all') {
      query = query.eq('testimonial_type', type)
    }

    if (featured === 'true') {
      query = query.eq('is_featured', true)
    }

    query = query
      .order('is_featured', { ascending: false, nullsFirst: false })
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false })
      .limit(limit)

    const { data: dbTestimonials, error } = await query

    if (error) {
      console.error('Database error:', error)
      throw new Error('Failed to fetch testimonials from the database.')
    }

    const uniqueTestimonials = dbTestimonials
      ? dbTestimonials.filter((testimonial, index, self) =>
          index === self.findIndex(t => 
            t.client_name === testimonial.client_name && 
            t.testimonial_text === testimonial.testimonial_text
          )
        )
      : []

    return NextResponse.json({
      success: true,
      data: uniqueTestimonials,
      count: uniqueTestimonials.length,
      source: 'database'
    })
  } catch (error) {
    console.error('Error fetching testimonials:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch testimonials' },
      { status: 500 }
    )
  }
}