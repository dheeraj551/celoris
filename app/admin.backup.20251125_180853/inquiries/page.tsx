"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  MessageSquare, 
  Search, 
  Filter,
  Shield,
  LogOut,
  ArrowLeft,
  Eye,
  Reply,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Mail,
  Calendar,
  Tag,
  BarChart3,
  Plus,
  Download
} from "lucide-react"

export default function AdminInquiriesPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [inquiries, setInquiries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterPriority, setFilterPriority] = useState("all")
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
      setInquiries([
        {
          id: 1,
          studentName: "Alice Johnson",
          email: "alice.johnson@email.com",
          category: "Course Information",
          subject: "Question about React course content",
          message: "Hi! I'm interested in the React course but I'd like to know more about the advanced topics covered. Can you provide a detailed syllabus?",
          status: "pending",
          priority: "medium",
          assignedTo: "Support Team",
          createdAt: "2025-01-18T10:30:00Z",
          lastUpdated: "2025-01-18T10:30:00Z",
          source: "Learn Platform"
        },
        {
          id: 2,
          studentName: "Bob Wilson",
          email: "bob.wilson@email.com",
          category: "Technical Support",
          subject: "Having trouble accessing course materials",
          message: "I'm unable to download the course materials for week 3. I keep getting an error message when I click the download button.",
          status: "in_progress",
          priority: "high",
          assignedTo: "Technical Support",
          createdAt: "2025-01-17T14:20:00Z",
          lastUpdated: "2025-01-18T09:15:00Z",
          source: "Learn Platform"
        },
        {
          id: 3,
          studentName: "Carol Davis",
          email: "carol.davis@email.com",
          category: "Learning Support",
          subject: "Need help with project submission",
          message: "I'm struggling with the final project assignment. I don't understand how to implement the authentication system. Could someone help me?",
          status: "resolved",
          priority: "low",
          assignedTo: "Learning Support",
          createdAt: "2025-01-16T11:45:00Z",
          lastUpdated: "2025-01-17T16:30:00Z",
          source: "Learn Platform"
        },
        {
          id: 4,
          studentName: "David Miller",
          email: "david.miller@email.com",
          category: "Course Information",
          subject: "Billing question for premium course",
          message: "I was charged twice for the premium course subscription. Can you help me get a refund for one of the charges?",
          status: "pending",
          priority: "high",
          assignedTo: "Billing Team",
          createdAt: "2025-01-18T08:15:00Z",
          lastUpdated: "2025-01-18T08:15:00Z",
          source: "Learn Platform"
        },
        {
          id: 5,
          studentName: "Emma Thompson",
          email: "emma.thompson@email.com",
          category: "Technical Support",
          subject: "Mobile app not syncing",
          message: "The mobile app is not syncing my progress from the web version. I've tried restarting the app but it doesn't help.",
          status: "pending",
          priority: "medium",
          assignedTo: "Technical Support",
          createdAt: "2025-01-18T07:45:00Z",
          lastUpdated: "2025-01-18T07:45:00Z",
          source: "Learn Platform"
        },
        {
          id: 6,
          studentName: "Frank Rodriguez",
          email: "frank.rodriguez@email.com",
          category: "Learning Support",
          subject: "Certificate not received",
          message: "I completed the course but haven't received my certificate yet. It's been 3 days since I finished the final exam.",
          status: "in_progress",
          priority: "medium",
          assignedTo: "Learning Support",
          createdAt: "2025-01-17T19:30:00Z",
          lastUpdated: "2025-01-18T10:00:00Z",
          source: "Learn Platform"
        },
        {
          id: 7,
          studentName: "Grace Lee",
          email: "grace.lee@email.com",
          category: "Course Information",
          subject: "Course prerequisites inquiry",
          message: "What are the prerequisites for the advanced JavaScript course? I have basic knowledge but want to make sure I'm prepared.",
          status: "resolved",
          priority: "low",
          assignedTo: "Course Team",
          createdAt: "2025-01-15T16:20:00Z",
          lastUpdated: "2025-01-16T10:45:00Z",
          source: "Learn Platform"
        },
        {
          id: 8,
          studentName: "Henry Clark",
          email: "henry.clark@email.com",
          category: "Technical Support",
          subject: "Video playback issues",
          message: "The course videos are buffering constantly and sometimes freeze. My internet connection is stable. Please help.",
          status: "pending",
          priority: "high",
          assignedTo: "Technical Support",
          createdAt: "2025-01-18T09:30:00Z",
          lastUpdated: "2025-01-18T09:30:00Z",
          source: "Learn Platform"
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Course Information': return <Tag className="h-4 w-4 text-blue-400" />
      case 'Technical Support': return <AlertCircle className="h-4 w-4 text-orange-400" />
      case 'Learning Support': return <User className="h-4 w-4 text-purple-400" />
      default: return <MessageSquare className="h-4 w-4 text-slate-400" />
    }
  }

  const filteredInquiries = inquiries.filter(inquiry => {
    const matchesSearch = inquiry.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inquiry.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inquiry.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'all' || inquiry.category === filterCategory
    const matchesStatus = filterStatus === 'all' || inquiry.status === filterStatus
    const matchesPriority = filterPriority === 'all' || inquiry.priority === filterPriority
    
    return matchesSearch && matchesCategory && matchesStatus && matchesPriority
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-slate-300">Loading Inquiries...</p>
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
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Inquiries Management</h1>
                <p className="text-sm text-slate-400">Manage all student inquiries and support requests</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="border-slate-600 text-slate-300">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
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
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Total Inquiries</p>
                  <p className="text-2xl font-bold text-white">{inquiries.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-orange-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Pending</p>
                  <p className="text-2xl font-bold text-white">
                    {inquiries.filter(i => i.status === 'pending').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <User className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">In Progress</p>
                  <p className="text-2xl font-bold text-white">
                    {inquiries.filter(i => i.status === 'in_progress').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Resolved Today</p>
                  <p className="text-2xl font-bold text-white">
                    {inquiries.filter(i => i.status === 'resolved' && 
                      new Date(i.lastUpdated).toDateString() === new Date().toDateString()).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="bg-slate-800 border-slate-700 mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search inquiries..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>
              
              <select 
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white text-sm"
              >
                <option value="all">All Categories</option>
                <option value="Course Information">Course Information</option>
                <option value="Technical Support">Technical Support</option>
                <option value="Learning Support">Learning Support</option>
              </select>

              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white text-sm"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>

              <select 
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white text-sm"
              >
                <option value="all">All Priority</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Inquiries List */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-white">Student Inquiries</CardTitle>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                New Inquiry
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-0">
              {filteredInquiries.map((inquiry, index) => (
                <div key={inquiry.id} className={`p-6 hover:bg-slate-750 transition-colors ${index !== filteredInquiries.length - 1 ? 'border-b border-slate-700' : ''}`}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center">
                        {getCategoryIcon(inquiry.category)}
                      </div>
                      <div>
                        <h3 className="font-medium text-white">{inquiry.subject}</h3>
                        <div className="flex items-center space-x-2 text-sm text-slate-400">
                          <User className="h-3 w-3" />
                          <span>{inquiry.studentName}</span>
                          <Mail className="h-3 w-3" />
                          <span>{inquiry.email}</span>
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(inquiry.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(inquiry.priority)}`}>
                        {inquiry.priority}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(inquiry.status)}`}>
                        {inquiry.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-slate-300 mb-4">{inquiry.message}</p>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4 text-xs text-slate-400">
                      <div className="flex items-center space-x-1">
                        <Tag className="h-3 w-3" />
                        <span>{inquiry.category}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <User className="h-3 w-3" />
                        <span>Assigned to: {inquiry.assignedTo}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <BarChart3 className="h-3 w-3" />
                        <span>Source: {inquiry.source}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="border-slate-600 text-slate-300">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        <Reply className="h-4 w-4 mr-1" />
                        Reply
                      </Button>
                      {inquiry.status !== 'resolved' && (
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Resolve
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}