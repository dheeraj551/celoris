import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-client';

// GET /api/blog/[slug] - Get single published blog post by slug
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const supabase = createClient()
    const { slug } = params;

    // First try to get the post by slug
    const { data: post, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .eq('status', 'published')
      .single();

    if (error) {
      // If not found by slug, try by ID
      const { data: postById, error: idError } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', slug)
        .eq('is_published', true)
        .eq('status', 'published')
        .single();

      if (idError || !postById) {
        return NextResponse.json(
          { error: 'Blog post not found' },
          { status: 404 }
        );
      }

      // Increment views count
      await (supabase as any)
        .from('blog_posts')
        .update({ views_count: (postById as any).views_count + 1 })
        .eq('id', slug);

      // Ensure all fields are properly handled
      const postData = postById as any;
      const processedPost = {
        id: postData.id,
        title: postData.title,
        slug: postData.slug,
        content: postData.content,
        excerpt: postData.excerpt || (postData.content ? postData.content.substring(0, 200) + '...' : 'No excerpt available'),
        featured_image_url: postData.featured_image_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop',
        author_name: postData.author_name,
        category: postData.category,
        tags: postData.tags || [],
        reading_time: postData.reading_time || 5,
        published_at: postData.published_at || postData.created_at,
        views_count: postData.views_count || 0,
        likes_count: postData.likes_count || 0,
        is_featured: postData.is_featured || false
      };
      
      return NextResponse.json({ post: processedPost });
    }

    // Increment views count
    await (supabase as any)
      .from('blog_posts')
      .update({ views_count: (post as any).views_count + 1 })
      .eq('id', (post as any).id);

    return NextResponse.json({ post });

  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog post' },
      { status: 500 }
    );
  }
}