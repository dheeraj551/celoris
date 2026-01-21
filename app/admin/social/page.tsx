"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Users,
  Search,
  Filter,
  Shield,
  LogOut,
  ArrowLeft,
  Eye,
  Edit,
  Trash2,
  MessageSquare,
  Heart,
  Share,
  Flag,
  UserCheck,
  UserX,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Clock,
  Star
} from "lucide-react"

export default function AdminSocialPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [profiles, setProfiles] = useState<any[]>([])
  const [interactions, setInteractions] = useState<any[]>([])
  const [reports, setReports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
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
      const response = await fetch('/api/admin/users')
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch users')
      }

      const { users: usersData } = await response.json()

      const processedProfiles = (usersData || []).map((u: any) => ({
        id: u.id,
        username: u.username || 'user',
        fullName: u.full_name || 'Anonymous',
        email: u.email || '',
        bio: u.bio || '',
        avatar: u.profile_pic_url || '',
        status: u.is_social_blocked ? 'suspended' : 'active',
        verified: u.verification_status === 'verified',
        joinedAt: u.created_at,
        subscription: u.subscription_status
      }))

      setProfiles(processedProfiles)

      // Keep mock interactions for now as they are complex to fetch
      setInteractions([
        {
          id: 1,
          type: "like",
          fromUser: "john_doe_2024",
          toUser: "sarah_designer",
          content: "Liked post about UI design trends",
          timestamp: "2025-01-18T10:30:00Z"
        },
        {
          id: 2,
          type: "follow",
          fromUser: "mike_tech",
          toUser: "john_doe_2024",
          content: "Started following john_doe_2024",
          timestamp: "2025-01-18T09:15:00Z"
        },
        {
          id: 3,
          type: "share",
          fromUser: "sarah_designer",
          toUser: "mike_tech",
          content: "Shared post about React best practices",
          timestamp: "2025-01-18T08:45:00Z"
        }
      ])

      setReports([
        {
          id: 1,
          reportedUser: "anna_creative",
          reporter: "john_doe_2024",
          reason: "Inappropriate content",
          description: "User posted content that violates community guidelines",
          status: "pending",
          priority: "high",
          reportedAt: "2025-01-17T14:20:00Z"
        },
        {
          id: 2,
          reportedUser: "mike_tech",
          reporter: "sarah_designer",
          reason: "Spam",
          description: "User is posting repetitive promotional content",
          status: "under_review",
          priority: "medium",
          reportedAt: "2025-01-16T11:30:00Z"
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
      case 'active': return 'text-green-400 bg-green-400/20'
      case 'warning': return 'text-yellow-400 bg-yellow-400/20'
      case 'suspended': return 'text-red-400 bg-red-400/20'
      case 'pending': return 'text-blue-400 bg-blue-400/20'
      case 'under_review': return 'text-orange-400 bg-orange-400/20'
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

  const getInteractionIcon = (type: string) => {
    switch (type) {
      case 'like': return <Heart className="h-4 w-4 text-red-400" />
      case 'follow': return <UserCheck className="h-4 w-4 text-blue-400" />
      case 'share': return <Share className="h-4 w-4 text-green-400" />
      default: return <MessageSquare className="h-4 w-4 text-slate-400" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-slate-300">Loading Social Management...</p>
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
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Social Management</h1>
                <p className="text-sm text-slate-400">Manage user profiles and social interactions</p>
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
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Total Users</p>
                  <p className="text-2xl font-bold text-white">{profiles.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <UserCheck className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Active Users</p>
                  <p className="text-2xl font-bold text-white">
                    {profiles.filter(p => p.status === 'active').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                  <Flag className="h-6 w-6 text-orange-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Pending Reports</p>
                  <p className="text-2xl font-bold text-white">
                    {reports.filter(r => r.status === 'pending').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Total Interactions</p>
                  <p className="text-2xl font-bold text-white">
                    {profiles.reduce((sum, p) => sum + p.followers + p.following, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Profiles Management */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
              <Users className="h-6 w-6" />
              <span>User Profiles</span>
            </h2>
            <div className="flex space-x-2">
              <Button variant="outline" className="border-slate-600 text-slate-300">
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </Button>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Eye className="h-4 w-4 mr-2" />
                View All Users
              </Button>
            </div>
          </div>

          {/* Search and Filter */}
          <Card className="bg-slate-800 border-slate-700 mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="warning">Warning</option>
                    <option value="suspended">Suspended</option>
                  </select>
                  <Button variant="outline" size="sm" className="border-slate-600 text-slate-300">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profiles List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {profiles?.map((profile) => (
              <Card key={profile.id} className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-slate-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium">
                          {profile.fullName.split(' ')?.map((n: string) => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <CardTitle className="text-white flex items-center space-x-2">
                          <span>{profile.fullName}</span>
                          {profile.verified && (
                            <CheckCircle className="h-4 w-4 text-blue-400" />
                          )}
                        </CardTitle>
                        <CardDescription className="text-slate-400">
                          @{profile.username}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="border-slate-600 text-slate-300">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="border-slate-600 text-slate-300">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-300 mb-4">{profile.bio}</p>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <p className="text-lg font-bold text-white">{profile.followers}</p>
                      <p className="text-xs text-slate-400">Followers</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-white">{profile.following}</p>
                      <p className="text-xs text-slate-400">Following</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-white">{profile.posts}</p>
                      <p className="text-xs text-slate-400">Posts</p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Total Likes</span>
                      <span className="text-white">{profile.totalLikes.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Total Shares</span>
                      <span className="text-white">{profile.totalShares}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(profile.status)}`}>
                      {profile.status}
                    </span>
                    <div className="text-xs text-slate-400">
                      <span>Joined: {new Date(profile.joinedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Content Reports and Recent Interactions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Content Reports */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
              <Flag className="h-5 w-5" />
              <span>Content Reports</span>
            </h3>
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {reports?.map((report) => (
                    <div key={report.id} className="border border-slate-700 rounded-lg p-4 hover:bg-slate-750 transition-colors">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium text-white">Reported: @{report.reportedUser}</h4>
                          <p className="text-sm text-slate-400">By: @{report.reporter}</p>
                        </div>
                        <div className="flex space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(report.priority)}`}>
                            {report.priority}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                            {report.status.replace('_', ' ')}
                          </span>
                        </div>
                      </div>

                      <p className="text-sm text-slate-300 mb-3">
                        <span className="font-medium">Reason:</span> {report.reason}
                      </p>
                      <p className="text-xs text-slate-400 mb-3">{report.description}</p>

                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-500">
                          {new Date(report.reportedAt).toLocaleDateString()}
                        </span>
                        <div className="space-x-2">
                          <Button size="sm" variant="outline" className="border-slate-600 text-slate-300">
                            Review
                          </Button>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            Resolve
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Interactions */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
              <MessageSquare className="h-5 w-5" />
              <span>Recent Interactions</span>
            </h3>
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {interactions?.map((interaction) => (
                    <div key={interaction.id} className="flex items-center space-x-3 p-3 border border-slate-700 rounded-lg">
                      <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center">
                        {getInteractionIcon(interaction.type)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-white">
                          <span className="font-medium">@{interaction.fromUser}</span>
                          {interaction.type === 'follow' && ' started following '}
                          {interaction.type === 'like' && ' liked '}
                          {interaction.type === 'share' && ' shared '}
                          <span className="font-medium">@{interaction.toUser}</span>
                        </p>
                        <p className="text-xs text-slate-400">
                          {new Date(interaction.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <Button size="sm" variant="outline" className="border-slate-600 text-slate-300">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}