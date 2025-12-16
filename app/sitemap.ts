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

    const supabase = createClient(supabaseUrl, supabaseKey)

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

    const blogRoutes = posts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.updated_at),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }))

    const jobRoutes = jobs.map((job) => ({
        url: `${baseUrl}/earn/jobs/${job.id}`,
        lastModified: new Date(job.updated_at),
        changeFrequency: 'daily' as const,
        priority: 0.9,
    }))

    const courseRoutes = courses.map((course) => ({
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
        '/social',
        '/apps',
        '/register',
        '/login',
        '/partners',
        '/careers',
        '/community',
        '/help',
        '/newsletter',
        '/courses/cbse-class-9-physics-motion-force-energy-sound',
        '/courses/cbse-class-10-physics-light-electricity-magnetism-energy'
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1.0,
    }))

    return [...staticRoutes, ...blogRoutes, ...jobRoutes, ...courseRoutes]
}
