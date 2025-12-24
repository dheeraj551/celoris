import { Hero } from "@/components/home-new/Hero"
import { Features } from "@/components/home-new/Features"
import { Process } from "@/components/home-new/Process"
import { Blog } from "@/components/home-new/Blog"
import { Courses } from "@/components/home-new/Courses"
import { AdUnit } from "@/components/AdUnit"

export default function HomePage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20">
        <Hero />
        <Features />
        <AdUnit slot="9266909448" />
        <Process />

        <Blog />
        <Courses limit={6} />
      </div>
    </div>
  )
}