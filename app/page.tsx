import { Hero } from "@/components/home-new/Hero"
import { Features } from "@/components/home-new/Features"
import { Process } from "@/components/home-new/Process"
import { Blog } from "@/components/home-new/Blog"
import { Courses } from "@/components/home-new/Courses"
import { AdUnit } from "@/components/AdUnit"
import { PageWrapper } from "@/components/PageWrapper"
import { AnalyticsSection } from "@/components/home-new/AnalyticsSection"
import { createServerClient } from "@/lib/supabase-server"

export default async function HomePage() {
  const supabase = createServerClient()

  // Fetch courses on server
  const { data: dbCourses } = await supabase
    .from('courses')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(6);

  // Fetch featured videos on server
  const { data: dbVideos } = await supabase
    .from('featured_videos')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(6);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.celorisdesigns.com"
      }
    ]
  };

  return (
    <div className="bg-[#050810] min-h-screen text-slate-200 selection:bg-emerald-500/30">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageWrapper className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-20">
        <Hero />
        <Features />
        <AnalyticsSection />
        <Process />

        <div className="mt-24 md:mt-32">
          <AdUnit slot="9266909448" />
        </div>

        <Blog initialVideos={dbVideos} />
        <Courses limit={6} initialCourses={dbCourses} />
      </PageWrapper>
    </div>
  )
}