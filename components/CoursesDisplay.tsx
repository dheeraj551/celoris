"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase-client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  BookOpen,
  GraduationCap,
  Clock,
  User,
  Star,
  Play,
  ChevronRight,
  Users,
  Award,
  CheckCircle
} from "lucide-react"

interface Course {
  id: string
  title: string
  subject: string
  grade_level: string
  description: string
  target_audience: string
  instructor_name: string | null
  course_duration: string | null
  price: number
  course_image_url: string | null
  is_featured: boolean
  created_at: string
  course_modules?: CourseModule[]
}

interface CourseModule {
  id: string
  module_number: number
  title: string
  description: string | null
  estimated_duration: number | null
  is_published: boolean
  course_topics?: CourseTopic[]
}

interface CourseTopic {
  id: string
  order_in_module: number
  title: string
  short_description: string
  content_type: string
  estimated_duration: number | null
  status: string
  is_free_preview: boolean
}

interface CoursesDisplayProps {
  subject?: string
  grade_level?: string
  featured?: boolean
  limit?: number
  layout?: 'grid' | 'list'
  showStats?: boolean
  className?: string
}

export default function CoursesDisplay({
  subject,
  grade_level,
  featured = false,
  limit = 6,
  layout = 'grid',
  showStats = true,
  className = ""
}: CoursesDisplayProps) {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadCourses()
  }, [subject, grade_level, featured, limit])

  const loadCourses = async () => {
    try {
      setLoading(true)
      const supabase = createClient()

      const params = new URLSearchParams()
      params.append('limit', limit.toString())
      if (subject) params.append('subject', subject)
      if (grade_level) params.append('grade_level', grade_level)
      if (featured) params.append('featured', 'true')

      const response = await fetch(`/api/courses?${params.toString()}`)
      if (!response.ok) throw new Error('Failed to fetch courses')

      const data = await response.json()
      setCourses(data.courses || [])
    } catch (error) {
      console.error('Error loading courses:', error)
      setError('Failed to load courses')
    } finally {
      setLoading(false)
    }
  }

  const getTotalTopics = (course: Course) => {
    return course.course_modules?.reduce((total, module) => {
      return total + (module.course_topics?.length || 0)
    }, 0) || 0
  }

  const getTotalDuration = (course: Course) => {
    return course.course_modules?.reduce((total, module) => {
      return total + (module.estimated_duration || 0)
    }, 0) || 0
  }

  const renderGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <Card key={course.id} className={`hover:shadow-lg transition-shadow ${className}`}>
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-2">
                  <GraduationCap className="w-5 h-5 text-green-600" />
                  {course.title}
                </CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  {course.subject} • {course.grade_level}
                </CardDescription>
              </div>
              {course.is_featured && (
                <div className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                  <Star className="w-3 h-3" />
                  Featured
                </div>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              {course.instructor_name && (
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {course.instructor_name}
                </div>
              )}
              {course.course_duration && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {course.course_duration}
                </div>
              )}
            </div>
          </CardHeader>
          {
            course.course_image_url && (
              <div className="w-full h-48 overflow-hidden bg-gray-100">
                <img
                  src={course.course_image_url}
                  alt={course.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  onError={(e: any) => {
                    e.currentTarget.src = "https://placehold.co/600x400?text=Course+Image";
                    e.currentTarget.onerror = null;
                  }}
                />
              </div>
            )
          }
          < CardContent className="pt-0" >
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
              {course.description}
            </p>

            {showStats && (
              <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                <div>
                  <div className="text-lg font-bold text-green-600">
                    {course.course_modules?.length || 0}
                  </div>
                  <div className="text-xs text-gray-500">Modules</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-green-600">
                    {getTotalTopics(course)}
                  </div>
                  <div className="text-xs text-gray-500">Topics</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-green-600">
                    {getTotalDuration(course)}min
                  </div>
                  <div className="text-xs text-gray-500">Duration</div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-green-600">
                {course.price > 0 ? `₹${course.price}` : 'Free'}
              </div>
              <Link href={`/learn/course/${course.id}`}>
                <Button className="bg-green-600 hover:bg-green-700" size="sm">
                  <Play className="w-4 h-4 mr-2" />
                  View Course
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card >
      ))
      }
    </div >
  )

  const renderList = () => (
    <div className="space-y-4">
      {courses.map((course) => (
        <Card key={course.id} className={`hover:shadow-md transition-shadow ${className}`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-green-600" />
                    {course.title}
                    {course.is_featured && (
                      <div className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                        <Star className="w-3 h-3" />
                        Featured
                      </div>
                    )}
                  </CardTitle>
                </div>
                <div className="text-gray-600 mb-3">
                  {course.subject} • {course.grade_level}
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {course.description}
                </p>
                <div className="flex items-center gap-6 text-sm text-gray-500">
                  {course.instructor_name && (
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {course.instructor_name}
                    </div>
                  )}
                  {course.course_duration && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {course.course_duration}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    {course.course_modules?.length || 0} modules
                  </div>
                  <div className="flex items-center gap-1">
                    <Play className="w-4 h-4" />
                    {getTotalTopics(course)} topics
                  </div>
                </div>
              </div>
              <div className="ml-6 text-right">
                <div className="text-2xl font-bold text-green-600 mb-2">
                  {course.price > 0 ? `₹${course.price}` : 'Free'}
                </div>
                <Link href={`/learn/course/${course.id}`}>
                  <Button className="bg-green-600 hover:bg-green-700" size="sm">
                    View Course
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  if (courses.length === 0) {
    return (
      <div className="text-center py-12">
        <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses found</h3>
        <p className="text-gray-600">Check back later for new courses.</p>
      </div>
    )
  }

  return layout === 'grid' ? renderGrid() : renderList()
}