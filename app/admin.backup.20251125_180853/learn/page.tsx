"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  BookOpen, 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  Star,
  Search,
  Filter,
  BarChart3,
  Shield,
  LogOut,
  ArrowLeft,
  Eye,
  MessageSquare,
  TrendingUp
} from "lucide-react"

export default function AdminLearnPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [courses, setCourses] = useState<any[]>([])
  const [inquiries, setInquiries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const router = useRouter()

  useEffect(() => {
    checkAdminAuth()
  }, [])

  const checkAdminAuth = async () => {
    try {
      const adminSession = localStorage.getItem("admin_session")
      
      if (!adminSession) {
        router.push("/admin/login")
        return
      }

      const session = JSON.parse(adminSession)
      const sessionAge = Date.now() - session.timestamp
      const maxAge = 24 * 60 * 60 * 1000 // 24 hours
      
      if (sessionAge > maxAge) {
        localStorage.removeItem("admin_session")
        router.push("/admin/login")
        return
      }

      setIsAuthenticated(true)
      loadData()
    } catch (error) {
      console.error("Admin auth error:", error)
      router.push("/admin/login")
    }
  }

  const loadData = async () => {
    try {
      // Mock data - in real implementation, fetch from Supabase
      setCourses([
        {
          id: 1,
          title: "React Fundamentals",
          description: "Learn the basics of React development",
          category: "Programming",
          instructor: "John Doe",
          students: 245,
          rating: 4.8,
          status: "published",
          createdAt: "2025-01-15"
        },
        {
          id: 2,
          title: "Digital Marketing Mastery",
          description: "Complete guide to digital marketing strategies",
          category: "Marketing", 
          instructor: "Jane Smith",
          students: 189,
          rating: 4.9,
          status: "published",
          createdAt: "2025-01-10"
        },
        {
          id: 3,
          title: "UI/UX Design Principles",
          description: "Design beautiful and functional user interfaces",
          category: "Design",
          instructor: "Mike Johnson",
          students: 156,
          rating: 4.7,
          status: "draft",
          createdAt: "2025-01-12"
        }
      ])

      setInquiries([
        {
          id: 1,
          studentName: "Alice Brown",
          email: "alice@email.com",
          category: "Course Information",
          subject: "Question about React course content",
          message: "Can you provide more details about the React course curriculum?",
          status: "pending",
          priority: "medium",
          createdAt: "2025-01-18"
        },
        {
          id: 2,
          studentName: "Bob Wilson",
          email: "bob@email.com", 
          category: "Technical Support",
          subject: "Having trouble accessing course materials",
          message: "I'm unable to download the course materials for week 3",
          status: "in_progress",
          priority: "high",
          createdAt: "2025-01-17"
        },
        {
          id: 3,
          studentName: "Carol Davis",
          email: "carol@email.com",
          category: "Learning Support", 
          subject: "Need help with project submission",
          message: "I'm struggling with the final project assignment",
          status: "resolved",
          priority: "low",
          createdAt: "2025-01-16"
        }
      ])
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = () => {
    localStorage.removeItem("admin_session")
    router.push("/admin/login")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'text-green-400 bg-green-400/20'
      case 'draft': return 'text-yellow-400 bg-yellow-400/20'
      case 'pending': return 'text-blue-400 bg-blue-400/20'
      case 'in_progress': return 'text-orange-400 bg-orange-400/20'
      case 'resolved': return 'text-green-400 bg-green-400/20'
      default: return 'text-slate-400 bg-slate-400/20'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-400/20'
      case 'medium': return 'text-yellow-400 bg-yellow-400/20'
      case 'low': return 'text-green-400 bg-green-400/20'
      default: return 'text-slate-400 bg-slate-400/20'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-slate-300">Loading Learn Management...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => router.push("/admin/dashboard")}
                className="text-slate-400 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Learn Management</h1>
                <p className="text-sm text-slate-400">Control courses, content, and student inquiries</p>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSignOut}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Total Courses</p>
                  <p className="text-2xl font-bold text-white">{courses.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Total Students</p>
                  <p className="text-2xl font-bold text-white">
                    {courses.reduce((sum, course) => sum + course.students, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Active Inquiries</p>
                  <p className="text-2xl font-bold text-white">
                    {inquiries.filter(i => i.status !== 'resolved').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-orange-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Avg Rating</p>
                  <p className="text-2xl font-bold text-white">
                    {(courses.reduce((sum, course) => sum + course.rating, 0) / courses.length).toFixed(1)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Courses Management */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
              <BookOpen className="h-6 w-6" />
              <span>Courses Management</span>
            </h2>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add New Course
            </Button>
          </div>

          {/* Search and Filter */}
          <Card className="bg-slate-800 border-slate-700 mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search courses..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <select 
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white text-sm"
                  >
                    <option value="all">All Categories</option>
                    <option value="Programming">Programming</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Design">Design</option>
                  </select>
                  <Button variant="outline" size="sm" className="border-slate-600 text-slate-300">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Courses List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {courses.map((course) => (
              <Card key={course.id} className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-white">{course.title}</CardTitle>
                      <CardDescription className="text-slate-400 mt-1">
                        {course.description}
                      </CardDescription>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="border-slate-600 text-slate-300">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="border-slate-600 text-slate-300">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-slate-400">Category</p>
                      <p className="text-sm text-white">{course.category}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Instructor</p>
                      <p className="text-sm text-white">{course.instructor}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Students</p>
                      <p className="text-sm text-white">{course.students}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Rating</p>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <p className="text-sm text-white">{course.rating}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(course.status)}`}>
                      {course.status}
                    </span>
                    <span className="text-xs text-slate-400">
                      Created: {new Date(course.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Student Inquiries */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
              <MessageSquare className="h-6 w-6" />
              <span>Student Inquiries</span>
            </h2>
            <Button 
              onClick={() => router.push("/admin/inquiries")}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Eye className="h-4 w-4 mr-2" />
              View All Inquiries
            </Button>
          </div>

          {/* Inquiries List */}
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="space-y-4">
                {inquiries.slice(0, 5).map((inquiry) => (
                  <div key={inquiry.id} className="border border-slate-700 rounded-lg p-4 hover:bg-slate-750 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium text-white">{inquiry.subject}</h4>
                        <p className="text-sm text-slate-400">From: {inquiry.studentName} ({inquiry.email})</p>
                      </div>
                      <div className="flex space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(inquiry.priority)}`}>
                          {inquiry.priority}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(inquiry.status)}`}>
                          {inquiry.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-slate-300 mb-3">{inquiry.message}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-400">
                        Category: {inquiry.category} • {new Date(inquiry.createdAt).toLocaleDateString()}
                      </span>
                      <div className="space-x-2">
                        <Button size="sm" variant="outline" className="border-slate-600 text-slate-300">
                          Reply
                        </Button>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
