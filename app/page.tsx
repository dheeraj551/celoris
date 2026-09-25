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
  title: "Celoris — India's Creative Studio & Academy | AI Video, Photo & Courses",
  description: "India's creative studio and academy since 2019. 4K AI video editor, Photoshop-style photo studio, certified professional courses, and a free tier for students. 🇮🇳",
  keywords: "creative studio India, AI video editor India, photo editor online, online courses India, Celoris Academy, freelance gigs India, free tier for students",
  alternates: { canonical: '/' },
  openGraph: {
    title: "Celoris — India's Creative Studio & Academy | AI Video, Photo & Courses",
    description: "India's creative studio and academy since 2019. 4K AI video editor, Photoshop-style photo studio, certified professional courses, and a free tier for students. 🇮🇳",
  }
}

export default async function HomePage() {
  let filteredCourses: any[] = [];
  let enrichedTestimonials: any[] = [];
  let topCourses: any[] = [];
  let topJobsRaw: any[] = [];
  let topCertifiedJobsRaw: any[] = [];
  let topBlogsRaw: any[] = [];

  try {
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
    enrichedTestimonials = dbTestimonials ? await Promise.all(dbTestimonials.map(async (t: any) => {
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
    filteredCourses = (dbCourses || []).filter((course: any) =>
      course.title && !testCourseTitles.includes(course.title.toLowerCase())
    );

    // ---- Ticker strip data (top courses, top jobs, live café, apps) ----

    const { data: rawCourses } = await supabase
      .from('courses')
      .select('id, title, category, duration, is_featured, created_at')
      .eq('is_published', true)
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(8);

    topCourses = (rawCourses || [])
      .filter((c: any) => c.title && !testCourseTitles.includes(c.title.toLowerCase().trim()))
      .slice(0, 3);

    const { data: rawJobs } = await supabase
      .from('public_jobs')
      .select('id, title, company, work_mode, featured, created_at')
      .eq('status', 'active')
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(3);
    topJobsRaw = rawJobs || [];

    const { data: rawCertified } = await supabase
      .from('certified_jobs')
      .select('id, title, company, work_mode, salary_range, featured, created_at')
      .eq('status', 'active')
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(2);
    topCertifiedJobsRaw = rawCertified || [];

    const { data: rawBlogs } = await supabase
      .from('blog_posts')
      .select('slug, title, category, is_featured, published_at')
      .eq('is_published', true)
      .eq('status', 'published')
      .order('is_featured', { ascending: false })
      .order('published_at', { ascending: false })
      .limit(2);
    topBlogsRaw = rawBlogs || [];
  } catch (err) {
    console.warn('HomePage server data fetch fallback:', err);
  }

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
    { category: 'cafe' as const, label: 'Live Classrooms', meta: 'join a class with your trainer', href: '/classrooms?tab=cafe' },
    { category: 'chat' as const, label: 'Celoris Chat', meta: 'private chats with your batchmates', href: '/chat' },
    { category: 'apps' as const, label: 'Video Studio', meta: 'free, no card needed', href: '/video-studio' },
    { category: 'apps' as const, label: 'Image Studio', meta: 'free photo editor', href: '/image-studio' },
    { category: 'apps' as const, label: 'AI Explorer', meta: '20+ AI models', href: '/ai-explorer' },
  ]

  return (
    <DashboardShell showVideoBackground>
      <TickerStrip items={tickerItems} />
      <DashboardContent
        courses={filteredCourses}
        initialTestimonials={enrichedTestimonials}
      />
    </DashboardShell>
  )
}
