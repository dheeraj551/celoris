import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Sample featured blog posts data (fallback)
const sampleFeaturedPosts = [
  {
    id: '1',
    title: 'The Future of Web Development: Trends to Watch in 2024',
    slug: 'future-web-development-trends-2024',
    excerpt: 'Discover the latest trends shaping the future of web development, from AI integration to new frameworks that are revolutionizing how we build applications.',
    featured_image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop',
    author_name: 'John Smith',
    category: 'Technology',
    reading_time: 8,
    published_at: '2024-11-15T10:00:00Z',
    views_count: 1250,
    likes_count: 89,
    is_featured: true,
    created_at: '2024-11-15T10:00:00Z'
  },
  {
    id: '2',
    title: 'Building Scalable React Applications: Best Practices',
    slug: 'scalable-react-applications-best-practices',
    excerpt: 'Learn the essential practices for building scalable React applications that can grow with your business needs and maintain code quality.',
    featured_image_url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop',
    author_name: 'Sarah Johnson',
    category: 'Programming',
    reading_time: 12,
    published_at: '2024-11-14T14:30:00Z',
    views_count: 980,
    likes_count: 67,
    is_featured: true,
    created_at: '2024-11-14T14:30:00Z'
  },
  {
    id: '3',
    title: 'UX Design Principles for Mobile-First Applications',
    slug: 'ux-design-principles-mobile-first',
    excerpt: 'Explore the key UX design principles that make mobile-first applications successful and user-friendly across all devices.',
    featured_image_url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=400&fit=crop',
    author_name: 'Mike Chen',
    category: 'Design',
    reading_time: 10,
    published_at: '2024-11-13T09:15:00Z',
    views_count: 750,
    likes_count: 45,
    is_featured: true,
    created_at: '2024-11-13T09:15:00Z'
  }
]

export async function GET(request: NextRequest) {
  try {
    // Try to fetch featured posts from database first
    try {
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_ANON_KEY!
      )

      const { data: dbFeaturedPosts, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(3)

      if (!error && dbFeaturedPosts && dbFeaturedPosts.length > 0) {
        // Database has featured content - return it
        return NextResponse.json({
          posts: dbFeaturedPosts.map(post => ({
            id: post.id,
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt,
            featured_image_url: post.featured_image_url,
            author_name: post.author_name,
            category: post.category,
            reading_time: post.reading_time,
            published_at: post.published_at,
            views_count: post.views_count,
            likes_count: post.likes_count,
            is_featured: post.is_featured
          })),
          source: 'database' // Indicate this is database content
        })
      }
    } catch (dbError) {
      console.log('Database not available, using sample featured posts:', dbError)
    }

    // Fallback to sample featured data
    const featuredPosts = sampleFeaturedPosts
      .filter(post => post.is_featured)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 3)
      .map(post => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        featured_image_url: post.featured_image_url,
        author_name: post.author_name,
        category: post.category,
        reading_time: post.reading_time,
        published_at: post.published_at,
        views_count: post.views_count,
        likes_count: post.likes_count,
        is_featured: post.is_featured
      }))

    return NextResponse.json({
      posts: featuredPosts,
      source: 'sample' // Indicate this is sample data
    })

  } catch (error) {
    console.error('Error fetching featured blog posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch featured blog posts' },
      { status: 500 }
    )
  }
}