import { type Metadata } from "next"
import { DashboardShell } from "@/components/home-new/DashboardShell"
import { DashboardContent } from "@/components/home-new/DashboardContent"
import { TickerStrip, type TickerItem } from "@/components/home-new/TickerStrip"
import { createServerClient } from "@/lib/supabase-server"
export const dynamic = 'force-dynamic'

// Same id → route map as components/home-new/Courses.tsx, kept in sync manually.
// Any course id not listed here falls back to /learn/course/<id>, which the
// dynamic route at app/learn/course/[id] resolves — so a link here is never dead,
// just less pretty, even for a brand-new course that hasn't been given a slug yet.
const COURSE_ROUTES: Record<string, string> = {
  'e7698318-7f57-421f-866e-0101ee239c01': '/learn/course/digital-marketing-mastery',
  '48713643-694c-491f-86d6-5b6e713c1cf3': '/learn/course/web-development-bootcamp',
  '879e499f-5517-413a-bd6a-76e2911b8331': '/learn/course/ai-web-development',
  'f00459e9-20a0-4866-ba05-79aa574f7dff': '/learn/course/master-copilot-excel',
  'f5badaa4-3ca2-4c70-96c3-a1ed97ee9ead': '/learn/course/master-youtube-shorts-instagram-reels',
}
const getCourseRoute = (id: string) => COURSE_ROUTES[id] || `/learn/course/${id}`

export const metadata: Metadata = {
  title: "Celoris — Free Video Editor, AI Tools & Creative Studio for India",
  description: "India's free creative studio since 2019. Free video editor, image studio, 20+ AI models, online classes and daily freelance gigs. No credit card needed. Free to start. No credit card. 🇮🇳",
  keywords: "free video editor India, free AI tools India, online classes India, earn online India, teach online India, Celoris",
  openGraph: {
    title: "Celoris — Free Video Editor, AI Tools & Creative Studio for India",
    description: "India's free creative studio since 2019. Free video editor, image studio, 20+ AI models, online classes and daily freelance gigs. No credit card needed. Free to start. No credit card. 🇮🇳",
  }
}

export default async function HomePage() {
  const supabase = (await createServerClient()) as any

  // Fetch courses on server
  const { data: dbCourses } = await supabase
    .from('courses')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(12);

  // Fetch testimonials on server
  const { data: dbTestimonials } = await supabase
    .from('testimonials')
    .select('*')
    .contains('target_pages', ['homepage'])
    .eq('is_visible', true)
    .order('created_at', { ascending: false })
    .limit(20);

  // Enrich testimonials with specialties from profiles table
  const enrichedTestimonials = dbTestimonials ? await Promise.all(dbTestimonials.map(async (t: any) => {
    if (t.client_title === 'USER' || t.client_title === 'ADMIN' || !t.client_title || t.client_title === 'Member') {
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('specialty')
          .eq('full_name', t.client_name)
          .maybeSingle();
        
        if (profile?.specialty) {
          return { ...t, client_title: profile.specialty };
        }
      } catch (err) {
        console.error(`Error enriching testimonial for ${t.client_name}:`, err);
      }
    }
    return t;
  })) : [];

  const testCourseTitles = ['my new ai course will be here', 'agentic ai for beginners: from prompts to action', 'mastering nano banana pro'];
  const filteredCourses = (dbCourses || []).filter((course: any) =>
    course.title && !testCourseTitles.includes(course.title.toLowerCase())
  );

  // ---- Ticker strip data (top courses, top jobs, live café, apps) ----

  const { data: topCoursesRaw } = await supabase
    .from('courses')
    .select('id, title, category, duration, is_featured, created_at')
    .eq('is_published', true)
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(8);

  const topCourses = (topCoursesRaw || [])
    .filter((c: any) => c.title && !testCourseTitles.includes(c.title.toLowerCase().trim()))
    .slice(0, 3);

  const { data: topJobsRaw } = await supabase
    .from('public_jobs')
    .select('id, title, company, work_mode, featured, created_at')
    .eq('status', 'active')
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(3);

  // Certified Roles (Job Center) — separate table/tier from the open public_jobs
  // board above, so it needs its own query to show up in the ticker at all.
  const { data: topCertifiedJobsRaw } = await supabase
    .from('certified_jobs')
    .select('id, title, company, work_mode, salary_range, featured, created_at')
    .eq('status', 'active')
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(2);

  // Latest published blog posts
  const { data: topBlogsRaw } = await supabase
    .from('blog_posts')
    .select('slug, title, category, is_featured, published_at')
    .eq('is_published', true)
    .eq('status', 'published')
    .order('is_featured', { ascending: false })
    .order('published_at', { ascending: false })
    .limit(2);

  // Live café presence in the last 5 minutes — falls back to a plain "open" state
  // rather than showing a 0 count, since a visible zero reads as a dead platform.
  const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
  const { count: liveCafeCount } = await supabase
    .from('user_presence')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'online')
    .gte('last_seen', fiveMinAgo);

  const tickerItems: TickerItem[] = [
    ...topCourses.map((c: any) => ({
      category: 'courses' as const,
      label: c.title,
      meta: c.category?.trim() || c.duration || (c.is_featured ? 'Featured' : undefined),
      href: getCourseRoute(c.id),
    })),
    ...(topJobsRaw || []).map((j: any) => ({
      category: 'jobs' as const,
      label: j.title,
      meta: [j.company, j.work_mode].filter(Boolean).join(' · '),
      href: '/job-center',
    })),
    ...(topCertifiedJobsRaw || []).map((j: any) => ({
      category: 'jobs' as const,
      label: j.title,
      meta: ['Certified Role', j.salary_range].filter(Boolean).join(' · '),
      href: '/job-center',
    })),
    ...(topBlogsRaw || []).map((b: any) => ({
      category: 'blog' as const,
      label: b.title,
      meta: b.is_featured ? 'Featured' : (b.category?.trim() || 'New on the blog'),
      href: `/blog/${b.slug}`,
    })),
    {
      category: 'cafe' as const,
      label: liveCafeCount && liveCafeCount > 0 ? 'Chat Café is live' : 'Chat Café is open',
      meta: liveCafeCount && liveCafeCount > 0 ? `${liveCafeCount} online now` : 'come hang out',
      href: '/social',
    },
    { category: 'apps' as const, label: 'Video Studio', meta: 'free, no card needed', href: '/video-studio' },
    { category: 'apps' as const, label: 'Image Studio', meta: 'free photo editor', href: '/image-studio' },
    { category: 'apps' as const, label: 'AI Explorer', meta: '20+ AI models', href: '/ai-explorer' },
  ]

  return (
    <DashboardShell>
      <TickerStrip items={tickerItems} />
      <DashboardContent
        courses={filteredCourses}
        initialTestimonials={enrichedTestimonials}
      />
    </DashboardShell>
  )
}
