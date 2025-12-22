import { Hero } from "@/components/home-new/Hero"
import { Features } from "@/components/home-new/Features"
import { Process } from "@/components/home-new/Process"
import { Blog } from "@/components/home-new/Blog"
import { Courses } from "@/components/home-new/Courses"
// We are not using the new Footer here as it is handled in layout.tsx, but we can if the user insists.
// The user asked to implement with the current app homepage. The current app has Footer in layout.tsx.
// However, the new design is quite distinct.
// I will just place the main content components.

export default function HomePage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20">
        <Hero />
        <Features />
        <Process />
        <Blog />
        <Courses limit={8} />
      </div>
    </div>
  )
}