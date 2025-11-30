import { Metadata } from "next"
import { BookOpen, Users, Clock, Star, TrendingUp, MapPin } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import CoursesDisplay from "@/components/CoursesDisplay"
import NoticeBoard from "@/components/NoticeBoard"

export const metadata: Metadata = {
  title: "Learn - Celoris Platform", 
  description: "Master new skills with our comprehensive courses, interactive lessons, and progress tracking. Learn programming, design, business, and more.",
  openGraph: {
    title: "Learn - Celoris Platform",
    description: "Master new skills with our comprehensive courses and interactive lessons.",
    url: "https://celoris.com/learn",
  },
}

const categories = [
  { name: "Programming", count: 45, icon: "💻" },
  { name: "Design", count: 32, icon: "🎨" },
  { name: "Marketing", count: 28, icon: "📈" },
  { name: "Data Science", count: 24, icon: "📊" },
  { name: "Business", count: 35, icon: "💼" },
  { name: "Mobile Development", count: 18, icon: "📱" },
  { name: "AI/ML", count: 22, icon: "🤖" },
  { name: "Cybersecurity", count: 15, icon: "🔒" }
]

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
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary-500" asChild>
              <Link href="/learn/pathways">
                Learning Paths
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-surface">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary-500 mb-2">500+</div>
              <div className="text-text-secondary">Expert Courses</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-500 mb-2">50,000+</div>
              <div className="text-text-secondary">Active Students</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-500 mb-2">200+</div>
              <div className="text-text-secondary">Expert Instructors</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-500 mb-2">95%</div>
              <div className="text-text-secondary">Completion Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Explore Categories
            </h2>
            <p className="text-lg text-text-secondary">
              Find courses in your area of interest
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Card key={category.name} className="card-hover cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl mb-3">{category.icon}</div>
                  <h3 className="font-semibold text-text-primary mb-2">{category.name}</h3>
                  <p className="text-sm text-text-secondary">{category.count} courses</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-16 bg-surface">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Featured Courses
            </h2>
            <p className="text-lg text-text-secondary">
              Start your learning journey with our most popular courses
            </p>
          </div>

          <CoursesDisplay 
            layout="grid"
            limit={6}
            featured={true}
            showStats={true}
            className=""
          />

          <div className="text-center mt-12">
            <Button size="lg" asChild>
              <Link href="/learn/courses">
                View All Courses
                <TrendingUp className="ml-2 h-5 w-5" />
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

          <div className="text-center mt-8">
            <Button size="lg" asChild className="bg-green-600 hover:bg-green-700">
              <Link href="/tutors">
                Find More Tutor Opportunities
                <BookOpen className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Learning Paths Section */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Structured Learning Paths
            </h2>
            <p className="text-lg text-text-secondary">
              Follow curated paths to master specific skills or careers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="card-hover">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-primary-500" />
                </div>
                <CardTitle>Full-Stack Developer</CardTitle>
                <CardDescription>
                  Master front-end and back-end development. Become a complete web developer.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <div className="text-sm text-text-secondary">• HTML, CSS, JavaScript</div>
                  <div className="text-sm text-text-secondary">• React, Node.js</div>
                  <div className="text-sm text-text-secondary">• Database Management</div>
                  <div className="text-sm text-text-secondary">• 12 courses • 200+ hours</div>
                </div>
                <Button className="w-full" asChild>
                  <Link href="/learn/pathways/full-stack">
                    Start Path
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-primary-500" />
                </div>
                <CardTitle>Digital Marketer</CardTitle>
                <CardDescription>
                  Learn modern digital marketing strategies and grow businesses online.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <div className="text-sm text-text-secondary">• SEO & SEM</div>
                  <div className="text-sm text-text-secondary">• Social Media Marketing</div>
                  <div className="text-sm text-text-secondary">• Analytics & Conversion</div>
                  <div className="text-sm text-text-secondary">• 8 courses • 120+ hours</div>
                </div>
                <Button className="w-full" asChild>
                  <Link href="/learn/pathways/digital-marketer">
                    Start Path
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary-500" />
                </div>
                <CardTitle>UI/UX Designer</CardTitle>
                <CardDescription>
                  Create beautiful and functional user interfaces for digital products.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <div className="text-sm text-text-secondary">• Design Fundamentals</div>
                  <div className="text-sm text-text-secondary">• Figma & Adobe XD</div>
                  <div className="text-sm text-text-secondary">• Prototyping & Testing</div>
                  <div className="text-sm text-text-secondary">• 10 courses • 150+ hours</div>
                </div>
                <Button className="w-full" asChild>
                  <Link href="/learn/pathways/ui-ux-designer">
                    Start Path
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Students Inquiries Section */}
      <section className="py-16 bg-gray-50">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-text-primary mb-4">
              Students Inquiries
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Have questions about our courses? Our student support team is here to help you succeed in your learning journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {/* General Inquiry */}
            <Card className="card-hover">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Course Information</CardTitle>
                <CardDescription>
                  Get detailed information about course content, prerequisites, and learning outcomes.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Contact Now
                </Button>
              </CardContent>
            </Card>

            {/* Technical Support */}
            <Card className="card-hover">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Technical Support</CardTitle>
                <CardDescription>
                  Need help with platform navigation, video playback, or assignment submissions?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Contact Now
                </Button>
              </CardContent>
            </Card>

            {/* Learning Support */}
            <Card className="card-hover">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Learning Support</CardTitle>
                <CardDescription>
                  Struggling with course material? Get personalized help from our instructors.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  Contact Now
                </Button>
              </CardContent>
            </Card>
          </div>


        </div>
      </section>
    </div>
  )
}