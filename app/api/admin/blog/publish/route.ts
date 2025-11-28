import { NextRequest, NextResponse } from 'next/server';
import { createRouteClient } from '@/lib/supabase-server';

// POST /api/admin/blog/publish
export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.includes('Bearer')) {
      return NextResponse.json(
        { error: 'Unauthorized: Missing or invalid authorization header' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      title,
      content,
      metaDescription,
      featuredImage,
      internalLinks = [],
      hashtags = [],
      ctaSuggestions = [],
      keyword,
      automationSource = 'manual',
      publishDate,
      seo = {}
    } = body;

    // Validate required fields
    if (!title || !content || !keyword) {
      return NextResponse.json(
        { error: 'Missing required fields: title, content, keyword' },
        { status: 400 }
      );
    }

    // Initialize Supabase client
    const supabase = createRouteClient();

    // Create slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    // Check if slug already exists
    const { data: existingPost } = await supabase
      .from('blog_posts')
      .select('id')
      .eq('slug', slug)
      .single();

    if (existingPost) {
      return NextResponse.json(
        { error: 'Blog post with similar title already exists' },
        { status: 409 }
      );
    }

    // Get current timestamp
    const now = new Date().toISOString();

    // Prepare blog post data
    const blogPostData = {
      title,
      slug,
      content,
      excerpt: metaDescription || content.substring(0, 160) + '...',
      featured_image: featuredImage,
      author_id: null, // System-generated content
      status: 'published',
      published_at: publishDate || now,
      seo_title: title,
      seo_description: metaDescription,
      focus_keyword: keyword,
      meta_data: {
        automationSource,
        automationDate: now,
        internalLinks,
        hashtags,
        ctaSuggestions,
        seo,
        trendSources: seo.trendSources || [],
        topicScore: seo.topicScore || 0
      }
    };

    // Insert blog post into database
    const { data: blogPost, error: blogError } = await supabase
      .from('blog_posts')
      .insert([blogPostData])
      .select()
      .single();

    if (blogError) {
      console.error('Error creating blog post:', blogError);
      return NextResponse.json(
        { error: 'Failed to create blog post in database' },
        { status: 500 }
      );
    }

    // Add tags/hashtags if provided
    if (hashtags.length > 0) {
      const tags = hashtags.map((tag: string) => ({
        post_id: blogPost.id,
        name: tag.startsWith('#') ? tag.substring(1) : tag,
        slug: tag.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      }));

      const { error: tagsError } = await supabase
        .from('blog_post_tags')
        .insert(tags);

      if (tagsError) {
        console.error('Error creating tags:', tagsError);
        // Continue without failing the entire operation
      }
    }

    // Log automation activity
    const { error: logError } = await supabase
      .from('automation_logs')
      .insert([{
        automation_type: 'blog_generation',
        automation_source: automationSource,
        status: 'success',
        input_data: { keyword, seo },
        output_data: { blog_post_id: blogPost.id, title },
        executed_at: now,
        metadata: {
          trendSources: seo.trendSources || [],
          topicScore: seo.topicScore || 0,
          n8nExecution: true
        }
      }]);

    if (logError) {
      console.error('Error logging automation:', logError);
    }

    return NextResponse.json({
      success: true,
      data: {
        blogPost,
        automation: {
          source: automationSource,
          keyword,
          publishedAt: blogPost.published_at,
          seo,
          n8n: true
        }
      },
      message: 'Blog post published successfully via automation'
    });

  } catch (error) {
    console.error('Error in blog publish endpoint:', error);
    
    // Log error
    const supabase = createRouteClient();
    await supabase
      .from('automation_logs')
      .insert([{
        automation_type: 'blog_generation',
        automation_source: 'api_error',
        status: 'error',
        error_message: error instanceof Error ? error.message : 'Unknown error',
        executed_at: new Date().toISOString()
      }]);

    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET /api/admin/blog/publish - List published posts
export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteClient();
    
    const { data: blogPosts, error } = await supabase
      .from('blog_posts')
      .select(`
        id,
        title,
        slug,
        excerpt,
        featured_image,
        status,
        published_at,
        meta_data,
        blog_post_tags(name, slug)
      `)
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error fetching blog posts:', error);
      return NextResponse.json(
        { error: 'Failed to fetch blog posts' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: blogPosts
    });

  } catch (error) {
    console.error('Error in GET blog posts:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}