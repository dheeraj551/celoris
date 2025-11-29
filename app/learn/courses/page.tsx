import { Metadata } from "next"
import { BookOpen, Clock, Users, Star, Filter, Search, ArrowLeft } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import CoursesDisplay from "@/components/CoursesDisplay"

export const metadata: Metadata = {
  title: "All Courses - Celoris Learn",
  description: "Browse all available courses across programming, design, marketing, business and more.",
}

const categories = [
  { name: "Programming", icon: "💻" },
  { name: "Design", icon: "🎨" },
  { name: "Marketing", icon: "📈" },
  { name: "Data Science", icon: "📊" },
  { name: "Business", icon: "💼" },
  { name: "Mobile Development", icon: "📱" },
  { name: "AI/ML", icon: "🤖" },
  { name: "Cybersecurity", icon: "🔒" }
]

const levels = [
  { name: "All Levels" },
  { name: "Beginner" },
  { name: "Intermediate" },
  { name: "Advanced" }
]

export default function AllCoursesPage() {
  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-text-secondary mb-4">
            <Link href="/" className="hover:text-primary-500">Home</Link>
            <span>/</span>
            <Link href="/learn" className="hover:text-primary-500">Learn</Link>
            <span>/</span>
            <span className="text-text-primary">All Courses</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
            All Courses
          </h1>
          <p className="text-lg text-text-secondary">
            Discover our complete collection of courses designed to help you master new skills
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-surface rounded-lg p-6 shadow-sm border mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-secondary" />
                <Input
                  placeholder="Search courses..."
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <select className="w-full h-10 px-3 border border-input rounded-md bg-background">
                <option>All Categories</option>
                <option>Programming</option>
                <option>Design</option>
                <option>Marketing</option>
                <option>Data Science</option>
              </select>
            </div>
            <div>
              <Button className="w-full">
                <Filter className="mr-2 h-4 w-4" />
                More Filters
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Categories */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Categories</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {categories?.map((category) => (
                    <div
                      key={category.name}
                      className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-surface cursor-pointer transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <span>{category.icon}</span>
                        <span className="text-sm">{category.name}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Levels */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Level</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {levels?.map((level) => (
                    <div
                      key={level.name}
                      className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-surface cursor-pointer transition-colors"
                    >
                      <span className="text-sm">{level.name}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Price Range */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Price</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input type="checkbox" className="rounded border-input" />
                      <span className="text-sm">Free</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input type="checkbox" className="rounded border-input" />
                      <span className="text-sm">Under $50</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input type="checkbox" className="rounded border-input" />
                      <span className="text-sm">$50 - $100</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input type="checkbox" className="rounded border-input" />
                      <span className="text-sm">Over $100</span>
                    </label>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Course Grid */}
          <div className="lg:col-span-3">
            <CoursesDisplay
              layout="grid"
              limit={12}
              showStats={true}
              className=""
            />

            {/* Load More */}
            <div className="text-center mt-12">
              <Button size="lg" variant="outline">
                Load More Courses
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}