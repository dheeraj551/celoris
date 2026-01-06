import { Hero } from "@/components/home-new/Hero"
import { Features } from "@/components/home-new/Features"
import { Process } from "@/components/home-new/Process"
import { Blog } from "@/components/home-new/Blog"
import { Courses } from "@/components/home-new/Courses"
import { AdUnit } from "@/components/AdUnit"
import { PageWrapper } from "@/components/PageWrapper"
import { AnalyticsSection } from "@/components/home-new/AnalyticsSection"

export default function HomePage() {
  return (
    <div className="bg-[#050810] min-h-screen text-slate-200 selection:bg-emerald-500/30">
      <PageWrapper className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-20">
        <Hero />
        <Features />
        <AnalyticsSection />
        <Process />

        <div className="mt-24 md:mt-32">
          <AdUnit slot="9266909448" />
        </div>

        <Blog />
        <Courses limit={6} />
      </PageWrapper>
    </div>
  )
}