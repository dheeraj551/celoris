import { type Metadata } from "next"
import { DashboardShell } from "@/components/home-new/DashboardShell"
import { DashboardContent } from "@/components/home-new/DashboardContent"
import { createServerClient } from "@/lib/supabase-server"
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: "Celoris — Free Video Editor, AI Tools & Creative Studio for India",
  description: "India's free creative studio since 2019. Free video editor, image studio, 20+ AI models, online classes and daily freelance gigs. No credit card needed. Free to start. No credit card. celoris.in 🇮🇳",
  keywords: "free video editor India, free AI tools India, online classes India, earn online India, teach online India, Celoris",
  openGraph: {
    title: "Celoris — Free Video Editor, AI Tools & Creative Studio for India",
    description: "India's free creative studio since 2019. Free video editor, image studio, 20+ AI models, online classes and daily freelance gigs. No credit card needed. Free to start. No credit card. celoris.in 🇮🇳",
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

  const testCourseTitles = ['my new ai course will be here', 'agentic ai for beginners: from prompts to action', 'mastering nano banana pro'];
  const filteredCourses = (dbCourses || []).filter((course: any) =>
    !testCourseTitles.includes(course.title.toLowerCase())
  );

  return (
    <DashboardShell>
      <DashboardContent 
        courses={filteredCourses} 
        initialTestimonials={dbTestimonials || []}
      />
    </DashboardShell>
  )
}
