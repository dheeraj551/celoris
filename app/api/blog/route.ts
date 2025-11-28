import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Sample blog posts data
const sampleBlogPosts = [
  {
    id: '1',
    title: 'The Future of Web Development: Trends to Watch in 2024',
    slug: 'future-web-development-trends-2024',
    excerpt: 'Discover the latest trends shaping the future of web development, from AI integration to new frameworks that are revolutionizing how we build applications.',
    content: 'Web development continues to evolve rapidly...',
    featured_image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop',
    author_name: 'John Smith',
    category: 'Technology',
    tags: ['Web Development', 'JavaScript', 'AI', 'Trends'],
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
    content: 'Scalability in React applications...',
    featured_image_url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop',
    author_name: 'Sarah Johnson',
    category: 'Programming',
    tags: ['React', 'JavaScript', 'Scalability', 'Best Practices'],
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
    content: 'Mobile-first design has become...',
    featured_image_url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=400&fit=crop',
    author_name: 'Mike Chen',
    category: 'Design',
    tags: ['UX Design', 'Mobile', 'User Experience', 'Design Patterns'],
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
    const { searchParams } = new URL(request.url);
    
    // Check if this is a request for featured posts
    if (request.nextUrl.pathname.endsWith('/featured')) {
      try {
        // Try to fetch featured posts from database first
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
            posts: dbFeaturedPosts.map((post: any) => ({
              id: post.id,
              title: post.title,
              slug: post.slug,
              excerpt: post.excerpt || (post.content ? post.content.substring(0, 200) + '...' : 'No excerpt available'),
              featured_image_url: post.featured_image_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop',
              author_name: post.author_name,
              category: post.category,
              tags: post.tags || [],
              reading_time: post.reading_time || 5,
              published_at: post.published_at || post.created_at,
              views_count: post.views_count || 0,
              likes_count: post.likes_count || 0
            })),
            source: 'database' // Indicate this is database content
          })
        }
      } catch (dbError) {
        console.log('Database not available, using sample featured posts:', dbError)
      }

      // Fallback to sample featured data
      const featuredPosts = sampleBlogPosts.filter(post => post.is_featured)
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
          likes_count: post.likes_count
        }))

      return NextResponse.json({
        posts: featuredPosts,
        source: 'sample' // Indicate this is sample data
      });
    }

    // Regular blog posts query
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    try {
      // Try to fetch from database first
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_ANON_KEY!
      )

      let query = supabase
        .from('blog_posts')
        .select('*')

      // Apply filters
      if (category && category !== 'all') {
        query = query.eq('category', category)
      }

      if (featured === 'true') {
        query = query.eq('is_featured', true)
      }

      if (search) {
        query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%`)
      }

      query = query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      const { data: dbPosts, error } = await query

      if (!error && dbPosts && dbPosts.length > 0) {
        // Database has content - return it with null handling
        const processedPosts = dbPosts.map((post: any) => ({
          ...post,
          tags: post.tags || [],
          featured_image_url: post.featured_image_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop',
          excerpt: post.excerpt || (post.content ? post.content.substring(0, 200) + '...' : 'No excerpt available'),
          published_at: post.published_at || post.created_at,
          reading_time: post.reading_time || 5,
          views_count: post.views_count || 0,
          likes_count: post.likes_count || 0
        }));
        
        return NextResponse.json({
          posts: processedPosts,
          pagination: {
            page,
            limit,
            total: processedPosts.length,
            totalPages: Math.ceil(processedPosts.length / limit)
          },
          source: 'database' // Indicate this is database content
        })
      }
    } catch (dbError) {
      console.log('Database not available, using sample data:', dbError)
    }

    // Fallback to sample data (for demo or when database is empty)
    let filteredPosts = sampleBlogPosts;

    // Apply filters
    if (category && category !== 'all') {
      filteredPosts = filteredPosts.filter(post => post.category === category);
    }

    if (featured === 'true') {
      filteredPosts = filteredPosts.filter(post => post.is_featured);
    }

    if (search) {
      filteredPosts = filteredPosts.filter(post => 
        post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Get categories for filtering options
    const uniqueCategories = Array.from(new Set(sampleBlogPosts.map(post => post.category)));

    // Apply pagination and sorting
    const sortedPosts = filteredPosts
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(offset, offset + limit);

    // Get total featured posts count for featured section
    const featuredCount = sampleBlogPosts.filter(post => post.is_featured).length;

    return NextResponse.json({
      posts: sortedPosts.map(post => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        featured_image_url: post.featured_image_url,
        author_name: post.author_name,
        category: post.category,
        tags: post.tags,
        reading_time: post.reading_time,
        published_at: post.published_at,
        views_count: post.views_count,
        likes_count: post.likes_count
      })),
      pagination: {
        page,
        limit,
        total: filteredPosts.length,
        totalPages: Math.ceil(filteredPosts.length / limit)
      },
      categories: uniqueCategories,
      featuredCount: featuredCount,
      source: 'sample' // Indicate this is sample data
    });

  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}