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
  LogOut,
  ArrowLeft,
  Eye,
  MessageSquare,
  TrendingUp,
  X,
  Layers,
  GripVertical
} from "lucide-react"

// A single curriculum topic inside a module, as edited in the admin form.
// `id` is present once it's a real row saved in course_topics — its
// absence is how we tell "still needs creating" from "needs updating".
interface TopicForm {
  id?: string
  title: string
  short_description: string
}

// A curriculum module, as edited in the admin form. Same id convention as
// TopicForm. `estimated_duration` is kept as a string here purely so the
// number input can be empty instead of forcing a 0 — it's parsed on save.
interface ModuleForm {
  id?: string
  title: string
  description: string
  estimated_duration: string
  topics: TopicForm[]
}

// Mirrors the `courses` table (see app/learn/course/[id]/page.tsx, which is
// what actually renders these fields to students) plus the two textarea
// fields (learning_outcomes/requirements) kept as one-line-per-item text
// instead of arrays while being edited.
interface CourseFormState {
  title: string
  subject: string
  grade_level: string
  description: string
  target_audience: string
  instructor_name: string
  instructor_bio: string
  course_duration: string
  price: string
  course_image_url: string
  preview_video_url: string
  syllabus_url: string
  is_published: boolean
  is_featured: boolean
  learning_outcomes: string
  requirements: string
  batch_number: string
  seats_left: string
  seats_total: string
  batch_status: string
  home_tutor_available: boolean
  modules: ModuleForm[]
}

const emptyCourseForm: CourseFormState = {
  title: "",
  subject: "",
  grade_level: "",
  description: "",
  target_audience: "",
  instructor_name: "",
  instructor_bio: "",
  course_duration: "",
  price: "",
  course_image_url: "",
  preview_video_url: "",
  syllabus_url: "",
  is_published: true,
  is_featured: false,
  learning_outcomes: "",
  requirements: "",
  batch_number: "",
  seats_left: "",
  seats_total: "",
  batch_status: "",
  home_tutor_available: false,
  modules: []
}

const inputClass =
  "w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
const labelClass = "text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1"

export default function AdminLearnPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [courses, setCourses] = useState<any[]>([])
  const [inquiries, setInquiries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const router = useRouter()

  // Add/Edit Course modal
  const [courseModalOpen, setCourseModalOpen] = useState(false)
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null)
  const [courseForm, setCourseForm] = useState<CourseFormState>(emptyCourseForm)
  const [loadingCourseDetail, setLoadingCourseDetail] = useState(false)
  const [savingCourse, setSavingCourse] = useState(false)
  const [courseFormError, setCourseFormError] = useState("")
  // What module/topic ids already existed in the DB when we opened this
  // course for editing — anything present here but missing from the form
  // at save time has been removed by the admin and needs deleting.
  const [originalModuleIds, setOriginalModuleIds] = useState<string[]>([])
  const [originalTopicIdsByModule, setOriginalTopicIdsByModule] = useState<Record<string, string[]>>({})

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

  const loadCourses = async () => {
    try {
      const res = await fetch("/api/admin/courses?limit=100")
      const data = await res.json()
      setCourses(data.courses || [])
    } catch (error) {
      console.error("Error loading courses:", error)
    }
  }

  const loadData = async () => {
    try {
      await loadCourses()

      // Student inquiries admin isn't wired to a real table yet — the
      // dedicated /admin/inquiries page is still mock-only too, so this
      // preview list stays as-is until that's built out.
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

  // ---- Add/Edit Course modal -------------------------------------------

  const openCreateModal = () => {
    setEditingCourseId(null)
    setCourseForm(emptyCourseForm)
    setOriginalModuleIds([])
    setOriginalTopicIdsByModule({})
    setCourseFormError("")
    setCourseModalOpen(true)
  }

  const openEditModal = async (course: any) => {
    setEditingCourseId(course.id)
    setCourseFormError("")
    setCourseForm(emptyCourseForm)
    setCourseModalOpen(true)
    setLoadingCourseDetail(true)
    try {
      const res = await fetch(`/api/admin/courses/${course.id}`)
      if (!res.ok) throw new Error("Failed to load course")
      const data = await res.json()
      const full = data.course

      const modules: ModuleForm[] = (full.course_modules || [])
        .slice()
        .sort((a: any, b: any) => a.module_number - b.module_number)
        .map((m: any) => ({
          id: m.id,
          title: m.title || "",
          description: m.description || "",
          estimated_duration: m.estimated_duration != null ? String(m.estimated_duration) : "",
          topics: (m.course_topics || [])
            .slice()
            .sort((a: any, b: any) => a.order_in_module - b.order_in_module)
            .map((t: any) => ({
              id: t.id,
              title: t.title || "",
              short_description: t.short_description || ""
            }))
        }))

      setOriginalModuleIds(modules.filter((m) => m.id).map((m) => m.id as string))
      const topicMap: Record<string, string[]> = {}
      modules.forEach((m) => {
        if (m.id) topicMap[m.id] = m.topics.filter((t) => t.id).map((t) => t.id as string)
      })
      setOriginalTopicIdsByModule(topicMap)

      setCourseForm({
        title: full.title || "",
        subject: full.subject || "",
        grade_level: full.grade_level || "",
        description: full.description || "",
        target_audience: full.target_audience || "",
        instructor_name: full.instructor_name || "",
        instructor_bio: full.instructor_bio || "",
        course_duration: full.course_duration || "",
        price: full.price != null ? String(full.price) : "",
        course_image_url: full.course_image_url || "",
        preview_video_url: full.preview_video_url || "",
        syllabus_url: full.syllabus_url || "",
        is_published: full.is_published ?? true,
        is_featured: full.is_featured ?? false,
        learning_outcomes: (full.learning_outcomes || []).join("\n"),
        requirements: (full.requirements || []).join("\n"),
        batch_number: full.batch_number || "",
        seats_left: full.seats_left != null ? String(full.seats_left) : "",
        seats_total: full.seats_total != null ? String(full.seats_total) : "",
        batch_status: full.batch_status || "",
        home_tutor_available: full.home_tutor_available ?? false,
        modules
      })
    } catch (error) {
      console.error("Error loading course detail:", error)
      setCourseFormError("Failed to load this course's details. Close and try again.")
    } finally {
      setLoadingCourseDetail(false)
    }
  }

  const closeCourseModal = () => {
    if (savingCourse) return
    setCourseModalOpen(false)
  }

  const addModule = () => {
    setCourseForm((f) => ({
      ...f,
      modules: [...f.modules, { title: "", description: "", estimated_duration: "", topics: [] }]
    }))
  }

  const removeModule = (moduleIdx: number) => {
    setCourseForm((f) => ({ ...f, modules: f.modules.filter((_, i) => i !== moduleIdx) }))
  }

  const updateModule = (moduleIdx: number, patch: Partial<ModuleForm>) => {
    setCourseForm((f) => ({
      ...f,
      modules: f.modules.map((m, i) => (i === moduleIdx ? { ...m, ...patch } : m))
    }))
  }

  const addTopic = (moduleIdx: number) => {
    setCourseForm((f) => ({
      ...f,
      modules: f.modules.map((m, i) =>
        i === moduleIdx ? { ...m, topics: [...m.topics, { title: "", short_description: "" }] } : m
      )
    }))
  }

  const removeTopic = (moduleIdx: number, topicIdx: number) => {
    setCourseForm((f) => ({
      ...f,
      modules: f.modules.map((m, i) =>
        i === moduleIdx ? { ...m, topics: m.topics.filter((_, ti) => ti !== topicIdx) } : m
      )
    }))
  }

  const updateTopic = (moduleIdx: number, topicIdx: number, patch: Partial<TopicForm>) => {
    setCourseForm((f) => ({
      ...f,
      modules: f.modules.map((m, i) =>
        i === moduleIdx
          ? { ...m, topics: m.topics.map((t, ti) => (ti === topicIdx ? { ...t, ...patch } : t)) }
          : m
      )
    }))
  }

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault()

    if (
      !courseForm.title.trim() ||
      !courseForm.subject.trim() ||
      !courseForm.grade_level.trim() ||
      !courseForm.description.trim() ||
      !courseForm.target_audience.trim()
    ) {
      setCourseFormError("Title, subject, level, description and target audience are required.")
      return
    }

    setSavingCourse(true)
    setCourseFormError("")

    try {
      const payload = {
        title: courseForm.title.trim(),
        subject: courseForm.subject.trim(),
        grade_level: courseForm.grade_level.trim(),
        description: courseForm.description.trim(),
        target_audience: courseForm.target_audience.trim(),
        instructor_name: courseForm.instructor_name.trim() || null,
        instructor_bio: courseForm.instructor_bio.trim() || null,
        course_duration: courseForm.course_duration.trim() || null,
        price: courseForm.price ? Number(courseForm.price) : 0,
        course_image_url: courseForm.course_image_url.trim() || null,
        preview_video_url: courseForm.preview_video_url.trim() || null,
        syllabus_url: courseForm.syllabus_url.trim() || null,
        is_published: courseForm.is_published,
        is_featured: courseForm.is_featured,
        learning_outcomes: courseForm.learning_outcomes
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
        requirements: courseForm.requirements
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
        batch_number: courseForm.batch_number.trim() || null,
        seats_left: courseForm.seats_left.trim() === "" ? null : Number(courseForm.seats_left),
        seats_total: courseForm.seats_total.trim() === "" ? null : Number(courseForm.seats_total),
        batch_status: courseForm.batch_status.trim() || null,
        home_tutor_available: courseForm.home_tutor_available
      }

      let courseId = editingCourseId

      if (courseId) {
        const res = await fetch(`/api/admin/courses/${courseId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        })
        if (!res.ok) throw new Error("Failed to update the course details.")
      } else {
        const res = await fetch("/api/admin/courses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        })
        if (!res.ok) throw new Error("Failed to create the course.")
        const data = await res.json()
        courseId = data.course?.id
        if (!courseId) throw new Error("Course was created but no id came back — refresh and check before retrying.")
      }

      // Sync curriculum: create/update every module + topic still in the
      // form, in order, then delete whatever was removed.
      const currentModuleIds: string[] = []

      for (let i = 0; i < courseForm.modules.length; i++) {
        const mod = courseForm.modules[i]
        if (!mod.title.trim()) continue // skip empty module rows silently

        const modulePayload = {
          module_number: i + 1,
          title: mod.title.trim(),
          description: mod.description.trim() || null,
          estimated_duration: mod.estimated_duration ? Number(mod.estimated_duration) : null
        }

        let moduleId = mod.id
        if (moduleId) {
          const res = await fetch(`/api/admin/courses/${courseId}/modules/${moduleId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(modulePayload)
          })
          if (!res.ok) throw new Error(`Failed to update module "${mod.title}".`)
        } else {
          const res = await fetch(`/api/admin/courses/${courseId}/modules`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(modulePayload)
          })
          if (!res.ok) throw new Error(`Failed to create module "${mod.title}".`)
          const data = await res.json()
          moduleId = data.module?.id
        }
        if (!moduleId) throw new Error(`Module "${mod.title}" was saved but no id came back.`)
        currentModuleIds.push(moduleId)

        const currentTopicIds: string[] = []
        for (let ti = 0; ti < mod.topics.length; ti++) {
          const topic = mod.topics[ti]
          if (!topic.title.trim()) continue // skip empty topic rows silently

          const topicPayload = {
            order_in_module: ti + 1,
            title: topic.title.trim(),
            short_description: topic.short_description.trim()
          }

          if (topic.id) {
            const res = await fetch(
              `/api/admin/courses/${courseId}/modules/${moduleId}/topics/${topic.id}`,
              {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(topicPayload)
              }
            )
            if (!res.ok) throw new Error(`Failed to update topic "${topic.title}".`)
            currentTopicIds.push(topic.id)
          } else {
            const res = await fetch(`/api/admin/courses/${courseId}/modules/${moduleId}/topics`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(topicPayload)
            })
            if (!res.ok) throw new Error(`Failed to create topic "${topic.title}".`)
            const data = await res.json()
            if (data.topic?.id) currentTopicIds.push(data.topic.id)
          }
        }

        // Topics removed from this (pre-existing) module since it was loaded
        const originalTopicIds = (mod.id && originalTopicIdsByModule[mod.id]) || []
        const removedTopicIds = originalTopicIds.filter((id) => !currentTopicIds.includes(id))
        for (const topicId of removedTopicIds) {
          await fetch(`/api/admin/courses/${courseId}/modules/${moduleId}/topics/${topicId}`, {
            method: "DELETE"
          })
        }
      }

      // Modules removed entirely since the course was loaded (this also
      // removes their topics — course_topics cascades on module delete)
      const removedModuleIds = originalModuleIds.filter((id) => !currentModuleIds.includes(id))
      for (const moduleId of removedModuleIds) {
        await fetch(`/api/admin/courses/${courseId}/modules/${moduleId}`, { method: "DELETE" })
      }

      setCourseModalOpen(false)
      await loadCourses()
    } catch (error: any) {
      console.error("Error saving course:", error)
      setCourseFormError(error?.message || "Failed to save the course. Please try again.")
    } finally {
      setSavingCourse(false)
    }
  }

  const handleDeleteCourse = async (course: any) => {
    const confirmed = window.confirm(
      `Delete "${course.title}"? This also removes all of its modules and topics. This cannot be undone.`
    )
    if (!confirmed) return

    try {
      const res = await fetch(`/api/admin/courses/${course.id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete course")
      await loadCourses()
    } catch (error) {
      console.error("Error deleting course:", error)
      alert("Failed to delete the course. Try again.")
    }
  }

  const filteredCourses = courses.filter((course) => {
    const term = searchTerm.trim().toLowerCase()
    const matchesSearch =
      !term ||
      course.title?.toLowerCase().includes(term) ||
      course.subject?.toLowerCase().includes(term) ||
      course.instructor_name?.toLowerCase().includes(term)
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "published" ? !!course.is_published : !course.is_published)
    return matchesSearch && matchesStatus
  })

  const totalStudents = courses.reduce((sum, c) => sum + (c.total_students || 0), 0)
  const avgRating =
    courses.length > 0
      ? (courses.reduce((sum, c) => sum + (parseFloat(c.rating) || 0), 0) / courses.length).toFixed(1)
      : "—"

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
                  <p className="text-2xl font-bold text-white">{totalStudents}</p>
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
                    {inquiries.filter((i) => i.status !== "resolved").length}
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
                  <p className="text-2xl font-bold text-white">{avgRating}</p>
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
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={openCreateModal}>
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
                      placeholder="Search courses by title, subject or instructor..."
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
                    <option value="all">All Courses</option>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Courses List */}
          {filteredCourses.length === 0 ? (
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-10 text-center text-slate-400 text-sm">
                {courses.length === 0
                  ? 'No courses yet. Click "Add New Course" to publish your first one.'
                  : "No courses match your search/filter."}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredCourses.map((course) => (
                <Card key={course.id} className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <div className="flex justify-between items-start gap-3">
                      <div className="min-w-0">
                        <CardTitle className="text-white line-clamp-2">{course.title}</CardTitle>
                        <CardDescription className="text-slate-400 mt-1 line-clamp-2">
                          {course.description}
                        </CardDescription>
                      </div>
                      <div className="flex space-x-2 shrink-0">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-slate-600 text-slate-300"
                          onClick={() => openEditModal(course)}
                          title="Edit course"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-slate-600 text-slate-300"
                          onClick={() => window.open(`/learn/course/${course.id}`, "_blank")}
                          title="View public course page"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                          onClick={() => handleDeleteCourse(course)}
                          title="Delete course"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-slate-400">Subject</p>
                        <p className="text-sm text-white truncate">{course.subject || "—"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Instructor</p>
                        <p className="text-sm text-white truncate">{course.instructor_name || "—"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Students</p>
                        <p className="text-sm text-white">{course.total_students ?? 0}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Rating</p>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <p className="text-sm text-white">{course.rating ?? "—"}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Price</p>
                        <p className="text-sm text-white">₹{course.price ?? 0}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Level</p>
                        <p className="text-sm text-white truncate">{course.grade_level || "—"}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          course.is_published ? "published" : "draft"
                        )}`}
                      >
                        {course.is_published ? "published" : "draft"}
                      </span>
                      <span className="text-xs text-slate-400">
                        Created:{" "}
                        {course.created_at ? new Date(course.created_at).toLocaleDateString() : "—"}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
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
                {inquiries?.slice(0, 5)?.map((inquiry) => (
                  <div
                    key={inquiry.id}
                    className="border border-slate-700 rounded-lg p-4 hover:bg-slate-750 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium text-white">{inquiry.subject}</h4>
                        <p className="text-sm text-slate-400">
                          From: {inquiry.studentName} ({inquiry.email})
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                            inquiry.priority
                          )}`}
                        >
                          {inquiry.priority}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            inquiry.status
                          )}`}
                        >
                          {inquiry.status.replace("_", " ")}
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

      {/* MODAL: ADD / EDIT COURSE */}
      {courseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div
            onClick={closeCourseModal}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />

          <div className="relative bg-slate-800 border border-slate-700 rounded-2xl max-w-3xl w-full p-6 space-y-5 shadow-2xl my-8">
            <button
              onClick={closeCourseModal}
              disabled={savingCourse}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div>
              <h3 className="text-lg font-bold text-white">
                {editingCourseId ? "Edit Course" : "Add New Course"}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                This is the same layout the public course page renders — everything here shows up at{" "}
                <span className="text-slate-300 font-mono">/learn/course/{"{id}"}</span>.
              </p>
            </div>

            {loadingCourseDetail ? (
              <div className="py-16 text-center text-slate-400 text-sm">Loading course details...</div>
            ) : (
              <form
                onSubmit={handleSaveCourse}
                className="space-y-5 text-left max-h-[70vh] overflow-y-auto pr-1"
              >
                {/* Basic Info */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-blue-400">Basic Info</h4>
                  <div>
                    <label className={labelClass}>Title</label>
                    <input
                      type="text"
                      value={courseForm.title}
                      onChange={(e) => setCourseForm((f) => ({ ...f, title: e.target.value }))}
                      className={inputClass}
                      placeholder="e.g. Master Copilot in Microsoft Excel"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>Subject</label>
                      <input
                        type="text"
                        value={courseForm.subject}
                        onChange={(e) => setCourseForm((f) => ({ ...f, subject: e.target.value }))}
                        className={inputClass}
                        placeholder="e.g. Microsoft Excel & AI Productivity"
                        required
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Level</label>
                      <input
                        type="text"
                        value={courseForm.grade_level}
                        onChange={(e) => setCourseForm((f) => ({ ...f, grade_level: e.target.value }))}
                        className={inputClass}
                        placeholder="e.g. Beginner to Advanced"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Description</label>
                    <textarea
                      value={courseForm.description}
                      onChange={(e) => setCourseForm((f) => ({ ...f, description: e.target.value }))}
                      className={`${inputClass} min-h-[70px]`}
                      placeholder="What this course covers, shown right under the title."
                      required
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Target Audience</label>
                    <textarea
                      value={courseForm.target_audience}
                      onChange={(e) => setCourseForm((f) => ({ ...f, target_audience: e.target.value }))}
                      className={`${inputClass} min-h-[50px]`}
                      placeholder="Who this course is for, comma separated."
                      required
                    />
                  </div>
                </div>

                {/* Instructor */}
                <div className="space-y-3 pt-3 border-t border-slate-700">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-blue-400">Instructor</h4>
                  <div>
                    <label className={labelClass}>Instructor Name</label>
                    <input
                      type="text"
                      value={courseForm.instructor_name}
                      onChange={(e) => setCourseForm((f) => ({ ...f, instructor_name: e.target.value }))}
                      className={inputClass}
                      placeholder="e.g. Celoris Team"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Instructor Bio</label>
                    <textarea
                      value={courseForm.instructor_bio}
                      onChange={(e) => setCourseForm((f) => ({ ...f, instructor_bio: e.target.value }))}
                      className={`${inputClass} min-h-[50px]`}
                      placeholder="Short bio shown on the course page."
                    />
                  </div>
                </div>

                {/* Media, duration & pricing */}
                <div className="space-y-3 pt-3 border-t border-slate-700">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-blue-400">
                    Media, Duration &amp; Pricing
                  </h4>
                  <div>
                    <label className={labelClass}>Course Image URL</label>
                    <input
                      type="text"
                      value={courseForm.course_image_url}
                      onChange={(e) => setCourseForm((f) => ({ ...f, course_image_url: e.target.value }))}
                      className={inputClass}
                      placeholder="/your-image.png or a full https:// URL"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>Preview Video URL</label>
                      <input
                        type="text"
                        value={courseForm.preview_video_url}
                        onChange={(e) =>
                          setCourseForm((f) => ({ ...f, preview_video_url: e.target.value }))
                        }
                        className={inputClass}
                        placeholder="Optional"
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Syllabus URL</label>
                      <input
                        type="text"
                        value={courseForm.syllabus_url}
                        onChange={(e) => setCourseForm((f) => ({ ...f, syllabus_url: e.target.value }))}
                        className={inputClass}
                        placeholder="Optional"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>Duration</label>
                      <input
                        type="text"
                        value={courseForm.course_duration}
                        onChange={(e) =>
                          setCourseForm((f) => ({ ...f, course_duration: e.target.value }))
                        }
                        className={inputClass}
                        placeholder="e.g. 6 weeks (self-paced)"
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Price (₹)</label>
                      <input
                        type="number"
                        min={0}
                        value={courseForm.price}
                        onChange={(e) => setCourseForm((f) => ({ ...f, price: e.target.value }))}
                        className={inputClass}
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>Batch Number</label>
                      <input
                        type="text"
                        value={courseForm.batch_number}
                        onChange={(e) => setCourseForm((f) => ({ ...f, batch_number: e.target.value }))}
                        className={inputClass}
                        placeholder="e.g. 03"
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Batch Status</label>
                      <input
                        type="text"
                        value={courseForm.batch_status}
                        onChange={(e) => setCourseForm((f) => ({ ...f, batch_status: e.target.value }))}
                        className={inputClass}
                        placeholder="e.g. Starting Soon"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>Seats Left</label>
                      <input
                        type="number"
                        min={0}
                        value={courseForm.seats_left}
                        onChange={(e) => setCourseForm((f) => ({ ...f, seats_left: e.target.value }))}
                        className={inputClass}
                        placeholder="e.g. 4"
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Seats Total</label>
                      <input
                        type="number"
                        min={0}
                        value={courseForm.seats_total}
                        onChange={(e) => setCourseForm((f) => ({ ...f, seats_total: e.target.value }))}
                        className={inputClass}
                        placeholder="e.g. 5"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-6 pt-1">
                    <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={courseForm.home_tutor_available}
                        onChange={(e) =>
                          setCourseForm((f) => ({ ...f, home_tutor_available: e.target.checked }))
                        }
                        className="h-4 w-4 rounded border-slate-600 bg-slate-900 accent-blue-600"
                      />
                      Home Tutor Available
                    </label>
                  </div>
                  <div className="flex items-center gap-6 pt-1">
                    <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={courseForm.is_published}
                        onChange={(e) =>
                          setCourseForm((f) => ({ ...f, is_published: e.target.checked }))
                        }
                        className="h-4 w-4 rounded border-slate-600 bg-slate-900 accent-blue-600"
                      />
                      Published
                    </label>
                    <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={courseForm.is_featured}
                        onChange={(e) =>
                          setCourseForm((f) => ({ ...f, is_featured: e.target.checked }))
                        }
                        className="h-4 w-4 rounded border-slate-600 bg-slate-900 accent-blue-600"
                      />
                      Featured
                    </label>
                  </div>
                </div>

                {/* Learning outcomes / requirements */}
                <div className="space-y-3 pt-3 border-t border-slate-700">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-blue-400">
                    What You&apos;ll Learn &amp; Requirements
                  </h4>
                  <div>
                    <label className={labelClass}>What You&apos;ll Learn (one per line)</label>
                    <textarea
                      value={courseForm.learning_outcomes}
                      onChange={(e) =>
                        setCourseForm((f) => ({ ...f, learning_outcomes: e.target.value }))
                      }
                      className={`${inputClass} min-h-[90px] font-mono text-xs`}
                      placeholder={"Use natural-language prompts to generate formulas\nBuild PivotTables and charts with Copilot prompts"}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Requirements (one per line)</label>
                    <textarea
                      value={courseForm.requirements}
                      onChange={(e) => setCourseForm((f) => ({ ...f, requirements: e.target.value }))}
                      className={`${inputClass} min-h-[70px] font-mono text-xs`}
                      placeholder={"Basic familiarity with Excel\nMicrosoft 365 account with Copilot access"}
                    />
                  </div>
                </div>

                {/* Curriculum */}
                <div className="space-y-3 pt-3 border-t border-slate-700">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-blue-400 flex items-center gap-1.5">
                      <Layers className="h-3.5 w-3.5" />
                      Course Curriculum
                    </h4>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="border-slate-600 text-slate-300 h-7 px-2 text-xs"
                      onClick={addModule}
                    >
                      <Plus className="h-3.5 w-3.5 mr-1" />
                      Add Module
                    </Button>
                  </div>

                  {courseForm.modules.length === 0 && (
                    <p className="text-xs text-slate-500">
                      No modules yet. Curriculum is optional, but the course page shows it prominently
                      when present.
                    </p>
                  )}

                  <div className="space-y-3">
                    {courseForm.modules.map((mod, moduleIdx) => (
                      <div
                        key={moduleIdx}
                        className="rounded-xl border border-slate-700 bg-slate-900/60 p-3 space-y-3"
                      >
                        <div className="flex items-start gap-2">
                          <GripVertical className="h-4 w-4 text-slate-600 mt-2 shrink-0" />
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold text-slate-500 shrink-0">
                                Module {moduleIdx + 1}
                              </span>
                              <input
                                type="text"
                                value={mod.title}
                                onChange={(e) => updateModule(moduleIdx, { title: e.target.value })}
                                className={`${inputClass} py-1.5`}
                                placeholder="Module title"
                              />
                            </div>
                            <textarea
                              value={mod.description}
                              onChange={(e) => updateModule(moduleIdx, { description: e.target.value })}
                              className={`${inputClass} min-h-[45px] text-xs`}
                              placeholder="Module description (optional)"
                            />
                            <input
                              type="number"
                              min={0}
                              value={mod.estimated_duration}
                              onChange={(e) =>
                                updateModule(moduleIdx, { estimated_duration: e.target.value })
                              }
                              className={`${inputClass} py-1.5 max-w-[180px]`}
                              placeholder="Duration (minutes)"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeModule(moduleIdx)}
                            className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors shrink-0"
                            title="Remove module"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Topics within this module */}
                        <div className="pl-6 space-y-2">
                          {mod.topics.map((topic, topicIdx) => (
                            <div key={topicIdx} className="flex items-start gap-2">
                              <span className="text-[10px] font-bold text-slate-600 mt-2 shrink-0">
                                {topicIdx + 1}.
                              </span>
                              <div className="flex-1 space-y-1.5">
                                <input
                                  type="text"
                                  value={topic.title}
                                  onChange={(e) =>
                                    updateTopic(moduleIdx, topicIdx, { title: e.target.value })
                                  }
                                  className={`${inputClass} py-1.5 text-xs`}
                                  placeholder="Topic title"
                                />
                                <input
                                  type="text"
                                  value={topic.short_description}
                                  onChange={(e) =>
                                    updateTopic(moduleIdx, topicIdx, {
                                      short_description: e.target.value
                                    })
                                  }
                                  className={`${inputClass} py-1.5 text-xs`}
                                  placeholder="One-line description"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => removeTopic(moduleIdx, topicIdx)}
                                className="p-1 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors shrink-0 mt-1"
                                title="Remove topic"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          ))}
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="border-slate-700 text-slate-400 h-6 px-2 text-[10px]"
                            onClick={() => addTopic(moduleIdx)}
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Add Topic
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {courseFormError && <p className="text-xs text-red-400">{courseFormError}</p>}

                <div className="flex items-center gap-2 pt-1 sticky bottom-0 bg-slate-800 pb-1">
                  <Button
                    type="submit"
                    disabled={savingCourse}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    {savingCourse ? "Saving..." : editingCourseId ? "Save Changes" : "Create Course"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={savingCourse}
                    onClick={closeCourseModal}
                    className="flex-1 border-slate-600 text-slate-300"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
