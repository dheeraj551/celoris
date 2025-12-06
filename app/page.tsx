import HeroSection from "@/components/hero-section"
import TestimonialsDisplay from "@/components/TestimonialsDisplay"
import { BlogDisplay } from "@/components/BlogDisplay"
import CoursesDisplay from "@/components/CoursesDisplay"
import JobsDisplay from "@/components/JobsDisplay"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import {
  BookOpen,
  Briefcase,
  Gamepad2,
  Wrench,
  Users,
  TrendingUp,
  Star,
  ArrowRight,
  Play,
  Target,
  Trophy
} from "lucide-react"

const features = [
  {
    icon: BookOpen,
    title: "Learn",
    description: "Master new skills with our comprehensive courses, interactive lessons, and progress tracking.",
    href: "/learn",
    stats: "500+ Courses"
  },
  {
    icon: Briefcase,
    title: "Earn",
    description: "Find your dream job or freelance opportunities in our curated marketplace.",
    href: "/earn",
    stats: "1000+ Jobs"
  },
  {
    icon: Gamepad2,
    title: "Social",
    description: "Connect with friends, share experiences, and engage in social activities.",
    href: "/social",
    stats: "50+ Games"
  },
  {
    icon: Wrench,
    title: "Apps",
    description: "Boost productivity with our collection of useful tools and utilities.",
    href: "/apps",
    stats: "25+ Tools"
  },
]





export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <section className="section-padding bg-surface">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Everything You Need in One Platform
            </h2>
            <p className="text-lg text-text-secondary max-w-3xl mx-auto">
              Discover a comprehensive ecosystem designed to help you learn, earn,
              and have fun while building your digital future.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <Card key={feature.title} className="card-hover group">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center mb-4 group-hover:bg-primary-500 transition-colors">
                    <feature.icon className="h-6 w-6 text-primary-500 group-hover:text-white transition-colors" />
                  </div>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <span className="text-xs bg-primary-50 text-primary-700 px-2 py-1 rounded-full">
                      {feature.stats}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">
                    {feature.description}
                  </CardDescription>
                  <Button variant="ghost" className="group-hover:text-primary-500" asChild>
                    <Link href={feature.href}>
                      Explore {feature.title}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>



      {/* How It Works Section */}
      <section className="section-padding bg-background">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              How Celoris Works
            </h2>
            <p className="text-lg text-text-secondary max-w-3xl mx-auto">
              Our platform is designed to provide a seamless experience from learning to earning.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-6">
                <BookOpen className="h-8 w-8 text-primary-500" />
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-4">1. Learn</h3>
              <p className="text-text-secondary">
                Start with our comprehensive courses designed by industry experts.
                Track your progress and earn certificates.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-6">
                <Target className="h-8 w-8 text-primary-500" />
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-4">2. Apply</h3>
              <p className="text-text-secondary">
                Use your new skills to apply for jobs or freelance projects
                in our curated marketplace.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-6">
                <Trophy className="h-8 w-8 text-primary-500" />
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-4">3. Succeed</h3>
              <p className="text-text-secondary">
                Advance your career while having fun with games,
                community features, and productivity tools.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Blogs Section */}
      <section className="section-padding bg-background">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Latest from Our Blog
            </h2>
            <p className="text-lg text-text-secondary max-w-3xl mx-auto">
              Stay updated with the latest insights, tutorials, and industry news.
            </p>
          </div>

          <BlogDisplay
            layout="grid"
            limit={3}
            showFeatured={false}
            showFilters={false}
          />

          <div className="text-center mt-12">
            <Button asChild>
              <Link href="/blog">
                View All Articles
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Latest Courses Section */}
      <section className="section-padding bg-surface">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Popular Courses
            </h2>
            <p className="text-lg text-text-secondary max-w-3xl mx-auto">
              Explore our most popular courses and start your learning journey today.
            </p>
          </div>

          <CoursesDisplay
            layout="grid"
            limit={3}
            featured={true}
            showStats={false}
            className=""
          />

          <div className="text-center mt-12">
            <Button asChild>
              <Link href="/learn">
                Browse All Courses
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Latest Jobs Section */}
      <section className="section-padding bg-background">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Featured Opportunities
            </h2>
            <p className="text-lg text-text-secondary max-w-3xl mx-auto">
              Discover exciting job opportunities and advance your career.
            </p>
          </div>

          <JobsDisplay
            layout="grid"
            limit={3}
            featured={true}
            className=""
          />

          <div className="text-center mt-12">
            <Button asChild>
              <Link href="/earn/jobs">
                View All Jobs
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section-padding bg-surface">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              What Our Users Say
            </h2>
            <p className="text-lg text-text-secondary max-w-3xl mx-auto">
              Join thousands of satisfied users who have transformed their careers with Celoris.
            </p>
          </div>

          <TestimonialsDisplay
            type="all"
            page="homepage"
            limit={6}
            layout="grid"
            showFeatured={true}
            className=""
          />
        </div>
      </section>


    </div>
  )
}