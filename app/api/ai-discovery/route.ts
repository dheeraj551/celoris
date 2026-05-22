import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-client'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')?.toLowerCase()

    // 1. Fetch courses
    const { data: dbCourses } = await supabase
      .from('courses')
      .select('title, subject, grade_level, description, price, course_duration, is_featured')
      .eq('is_published', true)

    // Formulate clean course models
    let courses = (dbCourses || []).map((c: any) => {
      const slug = c.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
      return {
        title: c.title,
        type: 'Course',
        subject: c.subject,
        gradeLevel: c.grade_level,
        description: c.description,
        price: c.price ? `₹${c.price}` : 'Free',
        duration: c.course_duration || 'Self-paced',
        url: `https://www.celorisdesigns.com/courses/${slug}`,
        isFeatured: c.is_featured
      }
    })

    // 2. Fetch blogs
    const { data: dbBlogs } = await supabase
      .from('blog_posts')
      .select('title, excerpt, category, tags, published_at, slug')
      .eq('is_published', true)
      .eq('status', 'published')

    let blogs = (dbBlogs || []).map((b: any) => ({
      title: b.title,
      type: 'BlogArticle',
      category: b.category || 'Insights',
      tags: b.tags || [],
      description: b.excerpt,
      publishedAt: b.published_at,
      url: `https://www.celorisdesigns.com/blog/${b.slug}`
    }))

    // 3. Celoris Studio Suites & AI Tools
    const tools = [
      {
        title: 'Video Studio',
        type: 'CreativeTool',
        description: 'Free high-performance browser-based video editor with multi-track timeline.',
        url: 'https://www.celorisdesigns.com/video-studio'
      },
      {
        title: 'Image Studio',
        type: 'CreativeTool',
        description: 'Online graphic design suite, background remover, and layout editor.',
        url: 'https://www.celorisdesigns.com/image-studio'
      },
      {
        title: 'AI Explorer',
        type: 'CreativeTool',
        description: 'Playground to access 20+ AI models for text, image, and video generation.',
        url: 'https://www.celorisdesigns.com/ai-explorer'
      }
    ]

    let allEntities = [...courses, ...blogs, ...tools]

    // Apply search query filter if supplied
    if (query) {
      allEntities = allEntities.filter(entity => 
        entity.title.toLowerCase().includes(query) || 
        entity.description?.toLowerCase().includes(query)
      )
    }

    return NextResponse.json({
      success: true,
      platform: 'Celoris Creative Studio',
      timestamp: new Date().toISOString(),
      entitiesCount: allEntities.length,
      entities: allEntities
    })

  } catch (error) {
    console.error('Error serving AI discovery feed:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to generate discovery index',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
