"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BookOpen,
  DollarSign,
  Users,
  Smartphone,
  Settings,
  BarChart3,
  Shield,
  LogOut,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Database,
  Globe,
  MessageSquare,
  FileText,
  Zap,
  Eye,
  MessageCircle,
  GraduationCap,
  Video
} from "lucide-react"

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [adminStats, setAdminStats] = useState<any>({
    totalUsers: 0,
    totalCourses: 0,
    totalJobs: 0,
    totalProfiles: 0,
    recentActivity: [] as any[],
    systemHealth: 'good'
  })
  const [loading, setLoading] = useState(true)
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

      // Check if session is valid (not older than 24 hours)
      const sessionAge = Date.now() - session.timestamp
      const maxAge = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

      if (sessionAge > maxAge) {
        localStorage.removeItem("admin_session")
        router.push("/admin/login")
        return
      }

      setIsAuthenticated(true)
      loadAdminStats()
    } catch (error) {
      console.error("Admin auth error:", error)
      router.push("/admin/login")
    } finally {
      setLoading(false)
    }
  }

  const loadAdminStats = async () => {
    try {
      // Simulate loading stats - in real implementation, these would come from your database
      setAdminStats({
        totalUsers: 1247,
        totalCourses: 89,
        totalJobs: 156,
        totalProfiles: 892,
        recentActivity: [
          { type: 'user_registered', user: 'john.doe@example.com', time: '2 minutes ago' },
          { type: 'course_completed', user: 'jane.smith@example.com', time: '15 minutes ago' },
          { type: 'job_applied', user: 'mike.johnson@example.com', time: '32 minutes ago' },
          { type: 'profile_updated', user: 'sarah.wilson@example.com', time: '1 hour ago' }
        ],
        systemHealth: 'good'
      })
    } catch (error) {
      console.error("Error loading admin stats:", error)
    }
  }

  const handleSignOut = () => {
    localStorage.removeItem("admin_session")
    router.push("/admin/login")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500 mx-auto"></div>
          <p className="mt-4 text-slate-300">Loading Command Center...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect to login
  }

  const platformControls = [
    {
      title: "Learn Management",
      description: "Control courses, tutorials, and educational content",
      icon: BookOpen,
      href: "/admin/learn",
      color: "from-blue-500 to-blue-600",
      stats: `${adminStats.totalCourses} courses`,
      features: ["Add/Edit Courses", "Student Progress", "Content Management", "Analytics"]
    },
    {
      title: "Earn Management",
      description: "Manage job postings and freelance opportunities",
      icon: DollarSign,
      href: "/admin/earn",
      color: "from-green-500 to-green-600",
      stats: `${adminStats.totalJobs} jobs`,
      features: ["Job Postings", "Application Management", "Freelance Hub", "Payment Tracking"]
    },
    {
      title: "Social Management",
      description: "Oversee user profiles and social interactions",
      icon: Users,
      href: "/admin/social",
      color: "from-purple-500 to-purple-600",
      stats: `${adminStats.totalProfiles} profiles`,
      features: ["Profile Management", "Community Guidelines", "Social Analytics", "User Moderation"]
    },
    {
      title: "Apps Management",
      description: "Control productivity tools and utilities",
      icon: Smartphone,
      href: "/admin/apps",
      color: "from-orange-500 to-orange-600",
      stats: "8 active apps",
      features: ["App Configurations", "User Access", "Performance Metrics", "Integration Status"]
    },
    {
      title: "Notice Board",
      description: "Manage notices and view user interests",
      icon: FileText,
      href: "/admin/notice-board",
      color: "from-pink-500 to-pink-600",
      stats: "View Interests",
      features: ["Create Notices", "Track Interests", "Manage Listings", "Student Requests"]
    },
    {
      title: "Trainer Applications",
      description: "Review and approve trainer/tutor registrations",
      icon: GraduationCap,
      href: "/admin/trainer-applications",
      color: "from-emerald-500 to-teal-600",
      stats: "View Applications",
      features: ["Review Profiles", "Verify Documents", "Approve Trainers", "Notice-Linked Apps"]
    }
  ]

  const quickActions = [
    {
      title: "User Management",
      description: "View and manage all user accounts",
      icon: Users,
      href: "/admin/users",
      color: "bg-blue-600 hover:bg-blue-700"
    },
    {
      title: "Courses",
      description: "Manage courses, modules, and topics",
      icon: GraduationCap,
      href: "/admin/courses",
      color: "bg-orange-600 hover:bg-orange-700"
    },
    {
      title: "Testimonials",
      description: "Manage customer testimonials and reviews",
      icon: MessageCircle,
      href: "/admin/testimonials",
      color: "bg-purple-600 hover:bg-purple-700"
    },
    {
      title: "Blog Management",
      description: "Create, edit, and publish blog posts",
      icon: FileText,
      href: "/admin/blog",
      color: "bg-indigo-600 hover:bg-indigo-700"
    },
    {
      title: "System Analytics",
      description: "View platform performance and usage",
      icon: BarChart3,
      href: "/admin/analytics",
      color: "bg-green-600 hover:bg-green-700"
    },
    {
      title: "Content Moderation",
      description: "Review and moderate user content",
      icon: Shield,
      href: "/admin/moderation",
      color: "bg-yellow-600 hover:bg-yellow-700"
    },
    {
      title: "System Settings",
      description: "Configure platform settings",
      icon: Settings,
      href: "/admin/settings",
      color: "bg-gray-600 hover:bg-gray-700"
    },
    {
      title: "Featured Videos",
      description: "Manage home page videos",
      icon: Video,
      href: "/admin/featured-videos",
      color: "bg-red-600 hover:bg-red-700"
    },
    {
      title: "Wallet Transactions",
      description: "View user wallet history",
      icon: DollarSign,
      href: "/admin/transactions",
      color: "bg-emerald-600 hover:bg-emerald-700"
    }
  ]

  const systemIntegrations = [
    {
      name: "N8N Automation",
      status: "Connected",
      icon: Zap,
      color: "text-green-500"
    },
    {
      name: "Database",
      status: "Healthy",
      icon: Database,
      color: "text-green-500"
    },
    {
      name: "File Storage",
      status: "Active",
      icon: FileText,
      color: "text-green-500"
    },
    {
      name: "Email Service",
      status: "Running",
      icon: Globe,
      color: "text-green-500"
    }
  ]

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Admin Command Center</h1>
                <p className="text-sm text-slate-400">Celoris Designs - Platform Management</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">System Online</span>
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
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Total Users</p>
                  <p className="text-2xl font-bold text-white">{adminStats.totalUsers.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Active Courses</p>
                  <p className="text-2xl font-bold text-white">{adminStats.totalCourses}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Job Opportunities</p>
                  <p className="text-2xl font-bold text-white">{adminStats.totalJobs}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                  <Activity className="h-6 w-6 text-orange-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">System Health</p>
                  <p className="text-2xl font-bold text-white capitalize">{adminStats.systemHealth}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Platform Controls */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
            <Shield className="h-6 w-6" />
            <span>Platform Controls</span>
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {platformControls?.map((control) => {
              const Icon = control.icon
              return (
                <Card key={control.title} className="bg-slate-800 border-slate-700 hover:bg-slate-750 transition-colors">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 bg-gradient-to-r ${control.color} rounded-lg flex items-center justify-center`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-white">{control.title}</CardTitle>
                          <CardDescription className="text-slate-400">{control.description}</CardDescription>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-slate-300">{control.stats}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {control.features?.map((feature) => (
                        <div key={feature} className="flex items-center space-x-2 text-sm text-slate-400">
                          <div className="w-1.5 h-1.5 bg-slate-500 rounded-full"></div>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                    <Button asChild className={`w-full bg-gradient-to-r ${control.color} hover:opacity-90`}>
                      <Link href={control.href}>
                        <Eye className="h-4 w-4 mr-2" />
                        Manage {control.title.split(' ')[0]}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Quick Actions and System Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>Quick Actions</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickActions?.map((action) => {
                const Icon = action.icon
                return (
                  <Card key={action.title} className="bg-slate-800 border-slate-700 hover:bg-slate-750 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <Icon className="h-5 w-5 text-slate-400" />
                        <div>
                          <h4 className="font-medium text-white">{action.title}</h4>
                          <p className="text-sm text-slate-400">{action.description}</p>
                        </div>
                      </div>
                      <Button asChild size="sm" className={`w-full ${action.color}`}>
                        <Link href={action.href}>Manage</Link>
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* System Status */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>System Status</span>
            </h3>
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4">
                <div className="space-y-4">
                  {systemIntegrations?.map((integration) => {
                    const Icon = integration.icon
                    return (
                      <div key={integration.name} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Icon className={`h-4 w-4 ${integration.color}`} />
                          <span className="text-sm text-white">{integration.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-400" />
                          <span className="text-sm text-green-400">{integration.status}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="mt-6 pt-4 border-t border-slate-700">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">N8N Workflows</span>
                    <span className="text-green-400">3 Active</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="text-slate-400">Automation Tasks</span>
                    <span className="text-green-400">Running</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Recent Activity</span>
          </h3>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="space-y-4">
                {adminStats.recentActivity?.map((activity: any, index: number) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b border-slate-700 last:border-b-0">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <div>
                        <p className="text-sm text-white">
                          <span className="font-medium">{activity.user}</span> {activity.type.replace('_', ' ')}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm text-slate-400">{activity.time}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-slate-700">
                <Button variant="outline" size="sm" className="w-full border-slate-600 text-slate-300 hover:bg-slate-700">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  View All Activity
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}