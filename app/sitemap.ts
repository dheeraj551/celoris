import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase-client'
import { COURSE_ID_TO_SLUG } from '@/lib/course-slugs'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://celorisdesigns.com'

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/cloud`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/cloud/acceptable-use`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/learn`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    // Flagship course pages (clean URLs served by app/learn/course/[id])
    ...[
      'digital-marketing-mastery',
      'web-development-bootcamp',
      'ai-web-development',
      'master-copilot-excel',
      'master-youtube-shorts-instagram-reels',
    ].map((slug) => ({
      url: `${baseUrl}/learn/course/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    })),
    {
      url: `${baseUrl}/teach`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/classrooms`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/video-studio`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/image-studio`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/refund-policy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/ai-tools`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/ai-explorer`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/apps`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/microsoft-excel-training-noida`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/digital-marketing-course-noida`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/digital-marketing-course-delhi`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/social-media-marketing-course-noida`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/how-to-earn-50k-month-ai-video-creator-india-2026`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog/meta-advantage-plus-vs-manual-2026-guide`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog/monetize-instagram-reels-youtube-shorts-india-2026`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/blog/best-social-media-marketing-course-noida`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/web-development-course-noida`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/photoshop-training-noida`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/graphic-designing-course-noida`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/python-training-noida`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/courses/adobe-photoshop-with-ai`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/courses/cbse-class-10-physics-light-electricity-magnetism-energy`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/courses/cbse-class-11-physics-comprehensive-course`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/courses/cbse-class-12-physics-complete-course`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/courses/cbse-class-9-physics-motion-force-energy-sound`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/courses/cbse-class-9-mathematics-complete-syllabus-mastery-guide`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/courses/cbse-class-10-chemistry-complete-course`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/courses/cbse-class-11-chemistry-complete-course`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/courses/cbse-class-12-chemistry-complete-course`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/courses/cbse-class-9-chemistry-complete-course`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/courses/complete-2025-yoga-mastery-course`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/courses/zumba-fitness-masterclass`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/courses/bollywood-zumba-dance-for-beginners`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/courses/bollywood-guitar-for-beginners`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/courses/the-28-day-reset-foundation-strength-mobility`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/courses/low-poly-3d-modeling-blender`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/courses/vibe-coding-mastery`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/courses/mastering-multimodal-ai`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/courses/accelerating-science-generative-ai-for-research-innovation`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/courses/agentic-ai-for-beginners`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/courses/agentic-ai-masterclass`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/courses/agentic-ai-systems-design-build-deploy`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/courses/agentic-ai-for-cybersecurity`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/courses/architecting-trust-ai-safety-ethics-compliance`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/courses/building-model-native-agent-systems`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/courses/personalized-ai-experiences-with-rag-and-agents`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/courses/rag-unlocked-production-grade-search-answer-systems`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/courses/deploy-scale-ai-apps-serverless-edge`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/courses/build-ai-products-that-make-money-practical-guide`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/courses/ai-tools-for-content-creation`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/courses/social-media-marketing-with-ai`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/courses/essential-python-for-ai-development`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/courses/python-for-ai-developers`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/courses/python-mega-course`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/courses/python-for-trading-automation`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/courses/social-media-marketing-professional-training`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/courses/digital-marketing-using-ai-tools`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/courses/professional-retouching-in-photoshop`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/courses/capcut-pro-viral-reels`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/courses/arjuna-ssc-jee-bridge`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/courses/sovereign-intelligence`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/courses/langchain-in-action-real-workflows`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/courses/llm-prompt-engineering-for-real-results`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/courses/master-premiere-pro-ai`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/courses/build-real-time-ai-agents-with-livekit`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ]

  // Blog posts that live as their own folders under app/blog (not in the blog_posts table),
  // plus public pages that were missing. Keep this list in sync when adding a folder-based post.
  const STATIC_BLOG_SLUGS = [
    'adobe-photoshop-ai-guide-2025',
    'ai-engineer-vs-generative-ai-engineer',
    'alok-kumar-digital-marketing-journey',
    'best-digital-marketing-course-noida',
    'best-free-online-video-editor-india-2026',
    'best-free-video-editor-india',
    'best-graphic-designing-course-noida',
    'best-microsoft-excel-training-noida',
    'best-photoshop-training-noida',
    'best-python-training-noida',
    'best-social-media-marketing-course-noida',
    'best-video-editing-course-noida',
    'best-web-development-course-noida',
    'best-wordpress-course-noida',
    'bollywood-zumba-dance-course-for-beginners-dheeraj-kushwaha',
    'build-local-ai-with-ollama-supabase-python',
    'building-real-time-voice-ai-livekit',
    'create-professional-videos-free',
    'excel-formulas-every-working-professional-must-know-2026',
    'free-excel-course-online-india-2026',
    'gemini-4-argon-pro-fairwind-guide-2026',
    'how-to-earn-50k-month-ai-video-creator-india-2026',
    'how-to-go-viral-youtube-shorts-2026',
    'how-to-start-a-dropshipping-business-in-2026',
    'how-to-start-teaching-online-in-india',
    'how-to-use-canva-for-the-first-time-beginner-guide',
    'kya-ai-replace-kar-dega-digital-marketers-ko',
    'learn-guitar-online-india-2026-beginners-guide',
    'meta-advantage-plus-vs-manual-2026-guide',
    'metatrader-5-python-ai-trading-automation',
    'monetize-instagram-reels-youtube-shorts-india-2026',
    'multimodal-agentic-ai',
    'online-dance-classes-india-2026-find-the-best-dance-classes-near-you',
    'online-teaching-jobs-delhi-2026',
    'online-teaching-jobs-india-2025-26',
    'premiere-pro-ai-efficiency-guide-2026',
    'the-english-sound-system',
    'the-real-economics-of-online-education-2026',
    'top-10-free-ai-video-editing-tools-india-2026',
    'video-editing-trends-2026-premiere-pro-tips',
    'virtual-production-game-engines-ai-2026',
    'yoga-for-beginners-complete-guide',
    'zero-keyframes-motion-swap-puppet-rigging-2026',
    'free-wordpress-hosting-india-2026',
    'free-portfolio-hosting-students-india-2026',
    'best-free-image-editing-software-pc-web-2026',
    'how-to-open-and-edit-psd-files-online-without-photoshop-2026',
  ]
  const EXTRA_PAGES: { path: string; priority: number; changeFrequency: 'daily' | 'weekly' | 'monthly' }[] = [
    { path: '/blog', priority: 0.8, changeFrequency: 'daily' },
    { path: '/become-trainer', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/video-editing-course-noida', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/wordpress-course-noida', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/job-center', priority: 0.9, changeFrequency: 'daily' },
    { path: '/cloud', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/free-courses-with-certificate', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/free-courses-with-certificate/social-media-reels', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/free-courses-with-certificate/digital-marketing', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/free-video-editor', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/free-image-editor', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/open-psd-online', priority: 0.95, changeFrequency: 'weekly' },
    { path: '/photolite', priority: 0.85, changeFrequency: 'weekly' },
    { path: '/contact', priority: 0.5, changeFrequency: 'monthly' },
  ]
  for (const page of EXTRA_PAGES) {
    staticPages.push({ url: `${baseUrl}${page.path}`, lastModified: new Date(), changeFrequency: page.changeFrequency, priority: page.priority })
  }
  for (const slug of STATIC_BLOG_SLUGS) {
    staticPages.push({ url: `${baseUrl}/blog/${slug}`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 })
  }

  // Drop duplicates (some posts appear both above and in the database), keeping the first entry.
  const dedupe = (entries: MetadataRoute.Sitemap) => {
    const seen = new Set<string>()
    return entries.filter((e) => {
      if (seen.has(e.url)) return false
      seen.add(e.url)
      return true
    })
  }

  try {
    const supabase = createClient()

    // 1. Fetch dynamic blog posts from Supabase database
    const { data: dbBlogs } = await supabase
      .from('blog_posts')
      .select('slug, updated_at')
      .eq('is_published', true)
      .eq('status', 'published')

    const dynamicBlogs: MetadataRoute.Sitemap = (dbBlogs || []).map((blog: any) => ({
      url: `${baseUrl}/blog/${blog.slug}`,
      lastModified: blog.updated_at ? new Date(blog.updated_at) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }))

    // 2. Fetch courses if they exist dynamically in courses table
    const { data: dbCourses } = await supabase
      .from('courses')
      .select('id, title, updated_at')
      .eq('is_published', true)

    const dynamicCourses: MetadataRoute.Sitemap = (dbCourses || [])
      .map((course: any) => {
        const cleanSlug = COURSE_ID_TO_SLUG[course.id]
        const targetUrl = cleanSlug
          ? `${baseUrl}/learn/course/${cleanSlug}`
          : `${baseUrl}/learn/course/${course.id}`

        return {
          url: targetUrl,
          lastModified: course.updated_at ? new Date(course.updated_at) : new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.8,
        }
      })
      .filter((dyn: any) => dyn && !staticPages.some((stat: any) => stat.url === dyn.url))

    return dedupe([...staticPages, ...dynamicBlogs, ...dynamicCourses])
  } catch (error) {
    console.error('Error generating dynamic sitemap:', error)
    return dedupe(staticPages)
  }
}
