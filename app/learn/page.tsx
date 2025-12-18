import { Metadata } from "next"
import { BookOpen, Users, TrendingUp } from "lucide-react"
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