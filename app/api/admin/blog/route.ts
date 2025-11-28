import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-client';
import { authenticateAdmin, createUnauthorizedResponse } from '@/lib/admin-auth';

// GET /api/admin/blog - List all blog posts with filtering
export async function GET(request: NextRequest) {
  try {
    // Check if this is an admin request (with session header)
    const auth = await authenticateAdmin(request);
    
    // For non-admin requests, only return published posts
    let isAdminRequest = auth.success;
    
    const supabase = createClient()
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    let query = supabase
      .from('blog_posts')
      .select('*', { count: 'exact' });

    // Only admins can see unpublished posts
    if (!isAdminRequest) {
      query = query.eq('is_published', true);
    }

    // Apply filters
    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    if (featured === 'true') {
      query = query.eq('is_featured', true);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%,content.ilike.%${search}%`);
    }

    // Get categories for filtering options
    const { data: categories } = await supabase
      .from('blog_posts')
      .select('category')
      .neq('category', null);

    const uniqueCategories = Array.from(new Set((categories as any)?.map((c: any) => c.category) || []));

    // Execute query with pagination
    const { data: posts, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return NextResponse.json({
      posts: posts || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      },
      categories: uniqueCategories
    });

  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}

// POST /api/admin/blog - Create new blog post
export async function POST(request: NextRequest) {
  try {
    // Authenticate admin user
    const auth = await authenticateAdmin(request);
    if (!auth.success) {
      return createUnauthorizedResponse('Admin authentication required');
    }

    const supabase = createClient()
    const body = await request.json();
    const {
      title,
      slug,
      excerpt,
      content,
      featured_image_url,
      author_name,
      category,
      tags,
      meta_title,
      meta_description,
      is_published,
      is_featured,
      status
    } = body;

    // Validate required fields
    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    // Insert new blog post - auto-publish by default
    const { data, error } = await (supabase as any)
      .from('blog_posts')
      .insert({
        title,
        slug,
        excerpt,
        content,
        featured_image_url,
        author_name: author_name || 'Admin',
        category: category || 'General',
        tags: tags || [],
        meta_title,
        meta_description,
        is_published: true, // Auto-publish all blogs
        is_featured: is_featured || false,
        status: 'published' // Auto-set status to published
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      post: data
    });

  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json(
      { error: 'Failed to create blog post' },
      { status: 500 }
    );
  }
}