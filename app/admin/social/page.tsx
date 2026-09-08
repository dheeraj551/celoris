"use client"

import React, { useState, useEffect } from "react"
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
  Star,
  Coffee,
  Plus,
  X,
  Lock,
  GraduationCap,
  Minus,
} from "lucide-react"

// A café classroom room, as returned by /api/admin/cafe/rooms — this is
// the service-role view, so unlike every other read path in the app it
// DOES include the raw trainer_code/student_code (admins are the only
// people who are ever allowed to see them).
interface CafeRoom {
  id: string
  name: string
  description: string | null
  category: string
  tags: string[] | null
  host_id: string | null
  trainer_name: string | null
  max_students: number
  current_students: number
  class_status: 'Ready' | 'Live' | 'Full'
  next_batch_info: string | null
  trainer_code: string | null
  student_code: string | null
  course_url: string | null
  course_title: string | null
  course_image_url: string | null
  course_description: string | null
  is_active: boolean
  created_at: string
}

const emptyRoomForm = {
  name: '',
  description: '',
  category: 'classroom',
  tags: '',
  trainerName: '',
  maxStudents: '15',
  classStatus: 'Ready' as 'Ready' | 'Live' | 'Full',
  currentStudents: '1',
  nextBatchInfo: '',
  trainerCode: '',
  studentCode: '',
  courseUrl: '',
  courseTitle: '',
  courseImageUrl: '',
  courseDescription: '',
}

export default function AdminSocialPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [profiles, setProfiles] = useState<any[]>([])
  const [interactions, setInteractions] = useState<any[]>([])
  const [reports, setReports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const router = useRouter()

  // --- Café Rooms management (moved here from the café's own "Host
  // Custom Table" modal — room creation/editing is admin-only now) ---
  const [cafeRooms, setCafeRooms] = useState<CafeRoom[]>([])
  const [loadingRooms, setLoadingRooms] = useState(true)
  const [roomModalOpen, setRoomModalOpen] = useState(false)
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null)
  const [roomForm, setRoomForm] = useState(emptyRoomForm)
  const [savingRoom, setSavingRoom] = useState(false)
  const [roomError, setRoomError] = useState<string | null>(null)

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
      loadCafeRooms()
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

  const loadCafeRooms = async () => {
    setLoadingRooms(true)
    try {
      const response = await fetch('/api/admin/cafe/rooms')
      if (!response.ok) throw new Error('Failed to fetch café rooms')
      const { rooms } = await response.json()
      setCafeRooms((rooms || []).filter((r: CafeRoom) => r.is_active))
    } catch (error) {
      console.error('Error loading café rooms:', error)
    } finally {
      setLoadingRooms(false)
    }
  }

  const openCreateRoom = () => {
    setEditingRoomId(null)
    setRoomForm(emptyRoomForm)
    setRoomError(null)
    setRoomModalOpen(true)
  }

  const openEditRoom = (room: CafeRoom) => {
    setEditingRoomId(room.id)
    setRoomForm({
      name: room.name || '',
      description: room.description || '',
      category: room.category || 'classroom',
      tags: (room.tags || []).join(', '),
      trainerName: room.trainer_name || '',
      maxStudents: String(room.max_students ?? 15),
      classStatus: (room.class_status as any) || 'Ready',
      currentStudents: String(room.current_students ?? 1),
      nextBatchInfo: room.next_batch_info || '',
      trainerCode: room.trainer_code || '',
      studentCode: room.student_code || '',
      courseUrl: room.course_url || '',
      courseTitle: room.course_title || '',
      courseImageUrl: room.course_image_url || '',
      courseDescription: room.course_description || '',
    })
    setRoomError(null)
    setRoomModalOpen(true)
  }

  const handleSaveRoom = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!roomForm.name.trim()) return

    setSavingRoom(true)
    setRoomError(null)

    const payload = {
      name: roomForm.name.trim(),
      description: roomForm.description.trim(),
      category: roomForm.category,
      tags: roomForm.tags,
      trainerName: roomForm.trainerName,
      maxStudents: roomForm.maxStudents,
      classStatus: roomForm.classStatus,
      currentStudents: roomForm.currentStudents,
      nextBatchInfo: roomForm.nextBatchInfo,
      trainerCode: roomForm.trainerCode,
      studentCode: roomForm.studentCode,
      courseUrl: roomForm.courseUrl,
      courseTitle: roomForm.courseTitle,
      courseImageUrl: roomForm.courseImageUrl,
      courseDescription: roomForm.courseDescription,
    }

    try {
      const response = editingRoomId
        ? await fetch(`/api/admin/cafe/rooms/${editingRoomId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          })
        : await fetch('/api/admin/cafe/rooms', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          })

      const result = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(result.error || 'Failed to save room')
      }

      setRoomModalOpen(false)
      loadCafeRooms()
    } catch (error: any) {
      setRoomError(error.message || 'Failed to save room. Try again.')
    } finally {
      setSavingRoom(false)
    }
  }

  const handleDeleteRoom = async (roomId: string) => {
    const confirmed = window.confirm('Delete this room? This cannot be undone.')
    if (!confirmed) return

    try {
      const response = await fetch(`/api/admin/cafe/rooms/${roomId}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Failed to delete room')
      setCafeRooms((prev) => prev.filter((r) => r.id !== roomId))
    } catch (error) {
      console.error('Error deleting room:', error)
      alert('Failed to delete room. Try again.')
    }
  }

  // Quick +/- for present students, without opening the full edit form —
  // the field that changes most often while a class is actually running.
  const adjustPresentCount = async (room: CafeRoom, delta: number) => {
    const next = Math.max(0, Math.min(room.max_students, room.current_students + delta))
    if (next === room.current_students) return

    setCafeRooms((prev) => prev.map((r) => (r.id === room.id ? { ...r, current_students: next } : r)))
    try {
      const response = await fetch(`/api/admin/cafe/rooms/${room.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentStudents: next }),
      })
      if (!response.ok) throw new Error('Failed to update present count')
    } catch (error) {
      console.error('Error adjusting present count:', error)
      setCafeRooms((prev) => prev.map((r) => (r.id === room.id ? { ...r, current_students: room.current_students } : r)))
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

  const getRoomStatusColor = (status: string) => {
    switch (status) {
      case 'Live': return 'text-green-400 bg-green-400/20'
      case 'Full': return 'text-red-400 bg-red-400/20'
      default: return 'text-blue-400 bg-blue-400/20'
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

        {/* Café Rooms — room creation moved here from the café itself (was
            the "Host Custom Table" modal on /social) per the team's request
            that only admins can stand up a room. Trainer/student codes and
            all the "Class Info" fields (name, capacity, status, present
            count, next batch, connected course) are edited here too — the
            in-room panel a trainer sees is read-only now. */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
              <Coffee className="h-6 w-6" />
              <span>Café Rooms</span>
            </h2>
            <Button onClick={openCreateRoom} className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="h-4 w-4 mr-2" />
              Create Room
            </Button>
          </div>

          {loadingRooms ? (
            <p className="text-sm text-slate-400">Loading rooms...</p>
          ) : cafeRooms.length === 0 ? (
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6 text-center text-sm text-slate-400">
                No active café rooms yet. Click "Create Room" to stand one up.
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {cafeRooms.map((room) => (
                <Card key={room.id} className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <div className="flex justify-between items-start gap-3">
                      <div className="min-w-0">
                        <CardTitle className="text-white truncate">{room.name}</CardTitle>
                        <CardDescription className="text-slate-400">
                          Trainer: {room.trainer_name || '—'}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoomStatusColor(room.class_status)}`}>
                          {room.class_status}
                        </span>
                        <Button size="sm" variant="outline" onClick={() => openEditRoom(room)} className="border-slate-600 text-slate-300">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteRoom(room.id)}
                          className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Present</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => adjustPresentCount(room, -1)}
                          disabled={room.current_students <= 0}
                          className="w-5 h-5 rounded flex items-center justify-center bg-slate-700 hover:bg-slate-600 disabled:opacity-30 text-slate-300"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-white font-medium w-12 text-center">
                          {room.current_students}/{room.max_students}
                        </span>
                        <button
                          type="button"
                          onClick={() => adjustPresentCount(room, 1)}
                          disabled={room.current_students >= room.max_students}
                          className="w-5 h-5 rounded flex items-center justify-center bg-slate-700 hover:bg-slate-600 disabled:opacity-30 text-slate-300"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Next batch</span>
                      <span className="text-white truncate max-w-[180px]">{room.next_batch_info || '—'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 flex items-center gap-1"><Lock className="w-3 h-3" /> Trainer code</span>
                      <span className="text-white font-mono">{room.trainer_code || 'Not set'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 flex items-center gap-1"><Lock className="w-3 h-3" /> Student code</span>
                      <span className="text-white font-mono">{room.student_code || 'Not set'}</span>
                    </div>
                    {room.course_url && (
                      <div className="flex items-center gap-2 pt-2 border-t border-slate-700">
                        <GraduationCap className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <a
                          href={room.course_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 underline truncate"
                        >
                          {room.course_title || room.course_url}
                        </a>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
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

      {/* MODAL: CREATE / EDIT CAFÉ ROOM */}
      {roomModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div
            onClick={() => !savingRoom && setRoomModalOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />

          <div className="relative bg-slate-800 border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl my-8">
            <button
              onClick={() => setRoomModalOpen(false)}
              disabled={savingRoom}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div>
              <h3 className="text-lg font-bold text-white">{editingRoomId ? 'Edit Café Room' : 'Create Café Room'}</h3>
              <p className="text-xs text-slate-400 mt-1">
                Room creation and editing (including both codes) is admin-only.
              </p>
            </div>

            <form onSubmit={handleSaveRoom} className="space-y-3 text-left max-h-[70vh] overflow-y-auto pr-1">
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Room Name</label>
                <input
                  type="text"
                  value={roomForm.name}
                  onChange={(e) => setRoomForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full h-9 px-3 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  placeholder="e.g. Physics Master Class"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Trainer Name</label>
                <input
                  type="text"
                  value={roomForm.trainerName}
                  onChange={(e) => setRoomForm((f) => ({ ...f, trainerName: e.target.value }))}
                  className="w-full h-9 px-3 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  placeholder="e.g. Ananya J"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Capacity</label>
                  <input
                    type="number"
                    min={1}
                    max={200}
                    value={roomForm.maxStudents}
                    onChange={(e) => setRoomForm((f) => ({ ...f, maxStudents: e.target.value }))}
                    className="w-full h-9 px-3 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Status</label>
                  <select
                    value={roomForm.classStatus}
                    onChange={(e) => setRoomForm((f) => ({ ...f, classStatus: e.target.value as any }))}
                    className="w-full h-9 px-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="Ready">Ready</option>
                    <option value="Live">Live</option>
                    <option value="Full">Full</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Present Students</label>
                <input
                  type="number"
                  min={0}
                  max={200}
                  value={roomForm.currentStudents}
                  onChange={(e) => setRoomForm((f) => ({ ...f, currentStudents: e.target.value }))}
                  className="w-full h-9 px-3 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Next Batch Timing (optional)</label>
                <input
                  type="text"
                  value={roomForm.nextBatchInfo}
                  onChange={(e) => setRoomForm((f) => ({ ...f, nextBatchInfo: e.target.value }))}
                  className="w-full h-9 px-3 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  placeholder="e.g. Tomorrow 6 PM"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-700">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block">Trainer Code</label>
                  <input
                    type="text"
                    value={roomForm.trainerCode}
                    onChange={(e) => setRoomForm((f) => ({ ...f, trainerCode: e.target.value }))}
                    className="w-full h-9 px-3 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    placeholder="Blank = no code"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block">Student Code</label>
                  <input
                    type="text"
                    value={roomForm.studentCode}
                    onChange={(e) => setRoomForm((f) => ({ ...f, studentCode: e.target.value }))}
                    className="w-full h-9 px-3 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    placeholder="Blank = open entry"
                  />
                </div>
                <p className="col-span-2 text-[10px] text-slate-500">
                  Whoever enters the trainer code gets the trainer experience in the room (mic, podium, calling on students) without needing to be logged in as the room's creator. The student code just lets ordinary students in.
                </p>
              </div>

              <div className="space-y-1.5 pt-1 border-t border-slate-700">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Connect a Course (optional)</label>
                <input
                  type="url"
                  value={roomForm.courseUrl}
                  onChange={(e) => setRoomForm((f) => ({ ...f, courseUrl: e.target.value }))}
                  className="w-full h-9 px-3 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  placeholder="Course URL"
                />
                <input
                  type="text"
                  value={roomForm.courseTitle}
                  onChange={(e) => setRoomForm((f) => ({ ...f, courseTitle: e.target.value }))}
                  className="w-full h-9 px-3 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  placeholder="Course title (optional)"
                />
                <input
                  type="url"
                  value={roomForm.courseImageUrl}
                  onChange={(e) => setRoomForm((f) => ({ ...f, courseImageUrl: e.target.value }))}
                  className="w-full h-9 px-3 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  placeholder="Cover image URL (optional)"
                />
                <input
                  type="text"
                  value={roomForm.courseDescription}
                  onChange={(e) => setRoomForm((f) => ({ ...f, courseDescription: e.target.value }))}
                  className="w-full h-9 px-3 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  placeholder="Short description (optional)"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Description / Vibe</label>
                <input
                  type="text"
                  value={roomForm.description}
                  onChange={(e) => setRoomForm((f) => ({ ...f, description: e.target.value }))}
                  className="w-full h-9 px-3 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  placeholder="e.g. Solving past papers, everyone welcome"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Category</label>
                  <select
                    value={roomForm.category}
                    onChange={(e) => setRoomForm((f) => ({ ...f, category: e.target.value }))}
                    className="w-full h-9 px-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="classroom">Live Classroom</option>
                    <option value="study">Silent Study</option>
                    <option value="course">Skill Lounge</option>
                    <option value="mixer">Mixer Chat</option>
                    <option value="night">Night Owl</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={roomForm.tags}
                    onChange={(e) => setRoomForm((f) => ({ ...f, tags: e.target.value }))}
                    className="w-full h-9 px-3 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                    placeholder="Physics, NEET"
                  />
                </div>
              </div>

              {roomError && <p className="text-xs text-red-400">{roomError}</p>}

              <div className="flex items-center gap-2 pt-1">
                <Button type="submit" disabled={savingRoom} className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                  {savingRoom ? 'Saving...' : editingRoomId ? 'Save Changes' : 'Create Room'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={savingRoom}
                  onClick={() => setRoomModalOpen(false)}
                  className="flex-1 border-slate-600 text-slate-300"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
