import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://celorisdesigns.com'

    // Initialize Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
        // If env vars are missing, just return static routes
        return [
            {
                url: baseUrl,
                lastModified: new Date(),
                changeFrequency: 'daily',
                priority: 1.0,
            },
        ]
    }

    const supabase = (createClient(supabaseUrl, supabaseKey)) as any

    // Fetch all necessary data in parallel
    // We use Promise.allSettled to handle potential failures in one query without breaking others
    const results = await Promise.allSettled([
        supabase
            .from('blog_posts')
            .select('slug, updated_at')
            .eq('status', 'published')
            .eq('is_published', true),
        supabase
            .from('jobs')
            .select('id, updated_at')
            .eq('is_active', true)
            .eq('is_published', true),
        supabase
            .from('courses')
            .select('id, updated_at')
            .eq('is_published', true)
    ])

    const posts = results[0].status === 'fulfilled' && results[0].value.data ? results[0].value.data : []
    const jobs = results[1].status === 'fulfilled' && results[1].value.data ? results[1].value.data : []
    const courses = results[2].status === 'fulfilled' && results[2].value.data ? results[2].value.data : []

    const blogRoutes = posts.map((post: any) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.updated_at),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }))

    const jobRoutes = jobs.map((job: any) => ({
        url: `${baseUrl}/earn/jobs/${job.id}`,
        lastModified: new Date(job.updated_at),
        changeFrequency: 'daily' as const,
        priority: 0.9,
    }))

    const courseRoutes = courses.map((course: any) => ({
        url: `${baseUrl}/learn/course/${course.id}`,
        lastModified: new Date(course.updated_at),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }))

    const staticRoutes = [
        '',
        '/about',
        '/contact',
        '/privacy',
        '/terms',
        '/cookies',
        '/earn',
        '/earn/jobs',
        '/learn',
        '/learn/courses',
        '/blog',
        '/blog/online-teaching-jobs-delhi-2026',
        '/blog/online-dance-classes-india-2026-find-the-best-dance-classes-near-you',
        '/blog/learn-guitar-online-india-2026-beginners-guide',
        '/blog/free-excel-course-online-india-2026',
        '/blog/best-free-online-video-editor-india-2026',
        '/blog/best-free-video-editor-india',
        '/blog/create-professional-videos-free',
        '/blog/multimodal-agentic-ai',
        '/social',
        '/social/chat',
        '/social/chat/room/socialize',
        '/social/chat/room/networking',
        '/social/chat/room/tech-trends',
        '/apps',
        '/register',
        '/login',
        '/partners',
        '/careers',
        '/community',
        '/help',
        '/newsletter',
        '/courses/cbse-class-9-physics-motion-force-energy-sound',
        '/courses/cbse-class-10-physics-light-electricity-magnetism-energy',
        '/courses/cbse-class-11-physics-comprehensive-course',
        '/courses/cbse-class-12-physics-complete-course',
        '/courses/cbse-class-9-chemistry-complete-course',
        '/courses/cbse-class-10-chemistry-complete-course',
        '/courses/cbse-class-11-chemistry-complete-course',
        '/courses/cbse-class-12-chemistry-complete-course',
        '/courses/cbse-class-9-mathematics-complete-syllabus-mastery-guide',
        '/courses/complete-2025-yoga-mastery-course',
        '/courses/the-28-day-reset-foundation-strength-mobility',
        '/courses/build-real-time-ai-agents-with-livekit',
        '/courses/agentic-ai-systems-design-build-deploy',
        '/courses/rag-unlocked-production-grade-search-answer-systems',
        '/courses/llm-prompt-engineering-for-real-results',
        '/courses/deploy-scale-ai-apps-serverless-edge',
        '/courses/langchain-in-action-real-workflows',
        '/courses/build-ai-products-that-make-money-practical-guide',
        '/courses/vibe-coding-mastery',
        '/courses/mastering-multimodal-ai',
        '/courses/building-model-native-agent-systems',
        '/courses/architecting-trust-ai-safety-ethics-compliance',
        '/courses/agentic-ai-for-cybersecurity',
        '/courses/accelerating-science-generative-ai-for-research-innovation',
        '/courses/personalized-ai-experiences-with-rag-and-agents',
        '/courses/sovereign-intelligence',
        '/courses/essential-python-for-ai-development',
        '/courses/python-mega-course',
        '/courses/zumba-fitness-masterclass',
        '/courses/bollywood-guitar-for-beginners'
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1.0,
    }))

    return [...staticRoutes, ...blogRoutes, ...jobRoutes, ...courseRoutes]
}
