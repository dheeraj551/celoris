import { type Metadata } from "next"
import { DashboardShell } from "@/components/home-new/DashboardShell"
import { DashboardContent } from "@/components/home-new/DashboardContent"
import { TickerStrip, type TickerItem } from "@/components/home-new/TickerStrip"
import { createServerClient } from "@/lib/supabase-server"
export const revalidate = 60

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

    // Run all top-level queries in parallel instead of sequential waterfalls
    const [
      { data: dbCourses },
      { data: dbTestimonials },
      { data: rawJobs },
      { data: rawCertified },
      { data: rawBlogs }
    ] = await Promise.all([
      supabase
        .from('courses')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(12),
      supabase
        .from('testimonials')
        .select('*')
        .contains('target_pages', ['homepage'])
        .eq('is_visible', true)
        .order('created_at', { ascending: false })
        .limit(20),
      supabase
        .from('public_jobs')
        .select('id, title, company, work_mode, featured, created_at')
        .eq('status', 'active')
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(3),
      supabase
        .from('certified_jobs')
        .select('id, title, company, work_mode, salary_range, featured, created_at')
        .eq('status', 'active')
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(2),
      supabase
        .from('blog_posts')
        .select('slug, title, category, is_featured, published_at')
        .eq('is_published', true)
        .eq('status', 'published')
        .order('is_featured', { ascending: false })
        .order('published_at', { ascending: false })
        .limit(2),
    ]);

    // Batch enrich testimonials in 1 query instead of N+1 individual queries
    if (dbTestimonials && dbTestimonials.length > 0) {
      const namesToLookup = Array.from(new Set(
        dbTestimonials
          .filter((t: any) => !t.client_title || ['USER', 'ADMIN', 'Member'].includes(t.client_title))
          .map((t: any) => t.client_name)
          .filter(Boolean)
      ));

      let profileMap: Record<string, string> = {};
      if (namesToLookup.length > 0) {
        try {
          const { data: profiles } = await supabase
            .from('profiles')
            .select('full_name, specialty')
            .in('full_name', namesToLookup);

          (profiles || []).forEach((p: any) => {
            if (p.full_name && p.specialty) {
              profileMap[p.full_name] = p.specialty;
            }
          });
        } catch (err) {
          console.error('Error fetching profile specialties:', err);
        }
      }

      enrichedTestimonials = dbTestimonials.map((t: any) => {
        if ((!t.client_title || ['USER', 'ADMIN', 'Member'].includes(t.client_title)) && profileMap[t.client_name]) {
          return { ...t, client_title: profileMap[t.client_name] };
        }
        return t;
      });
    }

    const testCourseTitles = ['my new ai course will be here', 'agentic ai for beginners: from prompts to action', 'mastering nano banana pro'];
    filteredCourses = (dbCourses || []).filter((course: any) =>
      course.title && !testCourseTitles.includes(course.title.toLowerCase())
    );

    // Reuse already-fetched courses for ticker instead of a duplicate query
    topCourses = filteredCourses.slice(0, 3);
    topJobsRaw = rawJobs || [];
    topCertifiedJobsRaw = rawCertified || [];
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
    { category: 'apps' as const, label: 'PolyVault', meta: '3D model & asset vault', href: '/polyvault' },
    { category: 'apps' as const, label: 'PhotoLite', meta: 'photoshop-grade photo editor', href: '/photolite' },
    { category: 'apps' as const, label: 'Video Studio', meta: 'free 4K video editor', href: '/video-studio' },
    { category: 'apps' as const, label: 'ViO Studio', meta: 'AI commercial ad studio', href: '/vio-studio' },
    { category: 'apps' as const, label: 'Motion Swap Studio', meta: 'AI motion transfer & object swap', href: '/motion-swap' },
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
