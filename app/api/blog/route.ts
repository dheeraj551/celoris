import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-client'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Initialize Supabase client (automatically reads from environment variables)
    const supabase = createClient()

    // Check if this is a request for featured posts
    if (request.nextUrl.pathname.endsWith('/featured')) {
      const { data: dbFeaturedPosts, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(3)

      if (error) {
        console.error('Error fetching featured posts:', error)
        throw error
      }

      return NextResponse.json({
        posts: (dbFeaturedPosts || []).map((post: any) => ({
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt || (post.content ? post.content.substring(0, 200) + '...' : 'No excerpt available'),
          featured_image_url: post.featured_image_url,
          author_name: post.author_name,
          category: post.category,
          tags: post.tags || [],
          reading_time: post.reading_time || 5,
          published_at: post.published_at || post.created_at,
          views_count: post.views_count || 0,
          likes_count: post.likes_count || 0
        })),
        source: 'database'
      })
    }

    // Regular blog posts query
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    let query = supabase
      .from('blog_posts')
      .select('*', { count: 'exact' })

    // Apply filters
    if (category && category !== 'all' && category !== 'All') {
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

    const { data: dbPosts, error, count } = await query

    if (error) {
      console.error('Error fetching blog posts:', error)
      throw error
    }

    const processedPosts = (dbPosts || []).map((post: any) => ({
      ...post,
      tags: post.tags || [],
      featured_image_url: post.featured_image_url,
      excerpt: post.excerpt || (post.content ? post.content.substring(0, 200) + '...' : 'No excerpt available'),
      published_at: post.published_at || post.created_at,
      reading_time: post.reading_time || 5,
      views_count: post.views_count || 0,
      likes_count: post.likes_count || 0
    }));

    // Get categories for filtering options (optional, could be a separate query or hardcoded)
    // For now, we'll return the hardcoded list from the frontend or just empty
    const categories = ['General', 'Technology', 'Business', 'Design', 'Development', 'Marketing', 'Productivity', 'Tutorial', 'News', 'Platform'];

    return NextResponse.json({
      posts: processedPosts,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      },
      categories,
      source: 'database'
    })

  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch blog posts',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}