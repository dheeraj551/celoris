import { Metadata } from "next"
import { BookOpen, Users, TrendingUp, Calculator, Atom, Sparkles, ArrowRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Courses } from "@/components/home-new/Courses"
import NoticeBoard from "@/components/NoticeBoard"
import StudentInquiries from "@/components/StudentInquiries"

export const metadata: Metadata = {
  title: "Learn - Celoris Platform",
  description: "Master new skills with our comprehensive courses, interactive lessons, and progress tracking. Learn programming, design, business, and more.",
  openGraph: {
    title: "Learn - Celoris Platform",
    description: "Master new skills with our comprehensive courses and interactive lessons.",
    url: "https://celoris.com/learn",
  },
}

export default function LearnPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-500 to-primary-700 text-white py-20">
        <div className="container text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Master New Skills with Celoris Learn
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-primary-50">
            Access hundreds of courses designed by industry experts. Learn at your own pace
            and track your progress with our interactive platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-primary-500 hover:bg-gray-100" asChild>
              <Link href="/learn/courses">
                Explore Courses
              </Link>
            </Button>
            {/* Removed Learning Paths button as the section is removed */}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-16 bg-surface">
        <div className="container">
          <Courses
            title="Featured Courses"
            description="Start your learning journey with our most popular courses"
            limit={4}
            featured={true}
          />
        </div>
      </section>

      {/* Join Study Rooms Section */}
      <section className="py-16 bg-white border-y border-slate-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Join Study Rooms
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              Join live study rooms for real-time doubt-solving discussions and group study sessions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* General Study Room */}
            <Card className="border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-8 pb-6 px-6 text-center lg:text-left">
                <div className="flex justify-center lg:justify-start mb-6">
                  <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center">
                    <BookOpen className="h-8 w-8 text-green-600" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">General Study Room</h3>
                <p className="text-slate-500 mb-6 text-sm">
                  Open study room for all subjects to discuss and solve problems together.
                </p>
                <Button className="w-full bg-[#2D6A4F] hover:bg-[#1B4332] text-white" asChild>
                  <Link href="/learn/study-room/general-study">
                    Join Study Room <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Math Study Room */}
            <Card className="border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-8 pb-6 px-6 text-center lg:text-left">
                <div className="flex justify-center lg:justify-start mb-6">
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center">
                    <Calculator className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Math Study Room</h3>
                <p className="text-slate-500 mb-6 text-sm">
                  Focused study room for math problems, solutions, and tips.
                </p>
                <Button className="w-full bg-[#2D6A4F] hover:bg-[#1B4332] text-white" asChild>
                  <Link href="/learn/study-room/math-study">
                    Join Math Room <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Physics Study Room */}
            <Card className="border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-8 pb-6 px-6 text-center lg:text-left">
                <div className="flex justify-center lg:justify-start mb-6">
                  <div className="w-16 h-16 bg-yellow-100/30 rounded-2xl flex items-center justify-center">
                    <Atom className="h-8 w-8 text-yellow-600" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Physics Study Room</h3>
                <p className="text-slate-500 mb-6 text-sm">
                  Topic-based study room to explore and discuss physics concepts.
                </p>
                <Button className="w-full bg-[#2D6A4F] hover:bg-[#1B4332] text-white" asChild>
                  <Link href="/learn/study-room/physics-study">
                    Join Physics Room <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Footer Banner */}
          <div className="bg-[#f0f9f4] border border-green-100 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3 text-slate-700 font-medium text-center md:text-left">
              <Sparkles className="h-6 w-6 text-yellow-500 shrink-0" />
              <p className="text-sm md:text-base">
                Create your own study room • Invite students via link • Always On
              </p>
            </div>
            <Button className="bg-[#2D6A4F] hover:bg-[#1B4332] text-white whitespace-nowrap" asChild>
              <Link href="/learn/study-room/my-study-room">
                Create a Room
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Notice Board Section */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Notice Board
            </h2>
            <p className="text-lg text-text-secondary">
              Current tutoring opportunities and requirements
            </p>
          </div>

          <NoticeBoard limit={6} />
        </div>
      </section>

      <StudentInquiries />
    </div>
  )
}