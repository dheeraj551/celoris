import { type Metadata } from "next"
import { DashboardShell } from "@/components/home-new/DashboardShell"
import { DashboardContent } from "@/components/home-new/DashboardContent"
import { createServerClient } from "@/lib/supabase-server"
export const dynamic = 'force-dynamic'

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
    .limit(3);

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

  return (
    <DashboardShell>
      <DashboardContent 
        courses={filteredCourses} 
        initialTestimonials={enrichedTestimonials}
      />
    </DashboardShell>
  )
}
