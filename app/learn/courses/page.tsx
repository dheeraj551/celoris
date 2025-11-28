import { Metadata } from "next"
import { BookOpen, Clock, Users, Star, Filter, Search, ArrowLeft } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export const metadata: Metadata = {
  title: "All Courses - Celoris Learn",
  description: "Browse all available courses across programming, design, marketing, business and more.",
}

const allCourses = [
  {
    id: 1,
    title: "Complete Web Development Bootcamp",
    instructor: "Sarah Johnson",
    description: "Learn full-stack web development from scratch. Build real projects and land your first developer job.",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    students: 15420,
    duration: "40 hours",
    level: "Beginner",
    price: 0,
    category: "Programming"
  },
  {
    id: 2,
    title: "UI/UX Design Fundamentals",
    instructor: "Mike Chen",
    description: "Master the principles of user interface and user experience design. Create beautiful and functional designs.",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
    students: 8930,
    duration: "25 hours",
    level: "Intermediate",
    price: 49,
    category: "Design"
  },
  {
    id: 3,
    title: "Digital Marketing Mastery",
    instructor: "Emma Davis",
    description: "Learn modern digital marketing strategies including SEO, social media, email marketing, and analytics.",
    image: "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    rating: 4.7,
    students: 12450,
    duration: "30 hours",
    level: "Beginner",
    price: 29,
    category: "Marketing"
  },
  {
    id: 4,
    title: "Data Science with Python",
    instructor: "Dr. Alex Rodriguez",
    description: "Complete guide to data science using Python. Learn pandas, numpy, matplotlib, and machine learning.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    students: 6780,
    duration: "35 hours",
    level: "Advanced",
    price: 79,
    category: "Data Science"
  },
  {
    id: 5,
    title: "Mobile App Development with React Native",
    instructor: "Jessica Park",
    description: "Build cross-platform mobile apps using React Native. Deploy to iOS and Android app stores.",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
    students: 5430,
    duration: "32 hours",
    level: "Intermediate",
    price: 59,
    category: "Mobile Development"
  },
  {
    id: 6,
    title: "Business Strategy and Leadership",
    instructor: "Robert Kim",
    description: "Develop strategic thinking and leadership skills to drive business success in the digital age.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    rating: 4.6,
    students: 9870,
    duration: "20 hours",
    level: "Beginner",
    price: 39,
    category: "Business"
  }
]

const categories = [
  { name: "All", count: allCourses.length, icon: "📚" },
  { name: "Programming", count: 45, icon: "💻" },
  { name: "Design", count: 32, icon: "🎨" },
  { name: "Marketing", count: 28, icon: "📈" },
  { name: "Data Science", count: 24, icon: "📊" },
  { name: "Business", count: 35, icon: "💼" },
  { name: "Mobile Development", count: 18, icon: "📱" },
  { name: "AI/ML", count: 22, icon: "🤖" },
  { name: "Cybersecurity", count: 15, icon: "🔒" }
]

const levels = [
  { name: "All Levels", count: allCourses.length },
  { name: "Beginner", count: allCourses.filter(c => c.level === "Beginner").length },
  { name: "Intermediate", count: allCourses.filter(c => c.level === "Intermediate").length },
  { name: "Advanced", count: allCourses.filter(c => c.level === "Advanced").length }
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
                      <span className="text-xs text-text-secondary">{category.count}</span>
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
                      <span className="text-xs text-text-secondary">{level.count}</span>
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
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {allCourses?.map((course) => (
                <Card key={course.id} className="card-hover">
                  <div className="aspect-video relative overflow-hidden rounded-t-lg">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 text-primary-500 px-2 py-1 rounded-full text-xs font-medium">
                        {course.level}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className="bg-black/70 text-white px-2 py-1 rounded-full text-xs font-medium">
                        {course.category}
                      </span>
                    </div>
                  </div>
                  <CardHeader>
                    <div className="flex items-center space-x-1 mb-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-text-secondary">{course.rating}</span>
                      <span className="text-sm text-text-secondary">({course.students.toLocaleString()} students)</span>
                    </div>
                    <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                    <CardDescription>by {course.instructor}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-text-secondary text-sm mb-4 line-clamp-2">
                      {course.description}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-text-secondary mb-4">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{course.students.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-text-primary">
                        {course.price === 0 ? "Free" : `$${course.price}`}
                      </div>
                      <Button asChild>
                        <Link href={`/learn/course/${course.id}`}>
                          View Course
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

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