"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Clock, Users, Star, Award, Play, Download, CheckCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { createClient } from "@/lib/supabase-client"
import { useParams } from "next/navigation"

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
  students_count?: number
  rating?: number
  instructor_bio?: string | null
  learning_outcomes?: string[] | null
  requirements?: string[] | null
  preview_video_url?: string | null
  syllabus_url?: string | null
}

interface CourseModule {
  id: string
  module_number: number
  title: string
  description: string | null
  estimated_duration: number | null
  course_topics?: { count: number }[]
}

export default function CourseDetailPage() {
  const params = useParams()
  const id = params.id as string

  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id) {
      loadCourse()
    }
  }, [id])

  const loadCourse = async () => {
    try {
      setLoading(true)
      const supabase = createClient()

      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          course_modules (
            id,
            module_number,
            title,
            description,
            estimated_duration,
            course_topics (count)
          )
        `)
        .eq('id', id)
        .single()

      if (error) throw error

      setCourse(data)
    } catch (error) {
      console.error('Error loading course:', error)
      setError('Failed to load course details')
    } finally {
      setLoading(false)
    }
  }

  const whatYouWillLearn = course?.learning_outcomes && course.learning_outcomes.length > 0
    ? course.learning_outcomes
    : [
      "No learning outcomes specified yet.",
    ]

  const requirements = course?.requirements && course.requirements.length > 0
    ? course.requirements
    : [
      "No specific requirements listed.",
    ]

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-background py-8 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
        <p className="text-text-secondary mb-6">{error || "Course not found"}</p>
        <Link href="/learn/courses">
          <Button>Back to Courses</Button>
        </Link>
      </div>
    )
  }

  // Calculate derived stats
  const totalModules = course.course_modules?.length || 0
  const totalDuration = course.course_modules?.reduce((acc, curr) => acc + (curr.estimated_duration || 0), 0) || 0
  const durationDisplay = course.course_duration || `${Math.ceil(totalDuration / 60)} hours`

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-text-secondary mb-6">
          <Link href="/" className="hover:text-primary-500">Home</Link>
          <span>/</span>
          <Link href="/learn" className="hover:text-primary-500">Learn</Link>
          <span>/</span>
          <Link href="/learn/courses" className="hover:text-primary-500">Courses</Link>
          <span>/</span>
          <span className="text-text-primary line-clamp-1">{course.title}</span>
        </div>

        {/* Back Button */}
        <Link href="/learn/courses" className="inline-flex items-center text-text-secondary hover:text-primary-500 mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Courses
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Course Header */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
                  {course.subject}
                </span>
                <span className="bg-surface px-3 py-1 rounded-full text-sm font-medium">
                  {course.grade_level}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                {course.title}
              </h1>
              <p className="text-lg text-text-secondary mb-6">
                {course.description}
              </p>

              {/* Course Stats */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-text-secondary">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{course.rating || 4.8}</span>
                  <span>({(course.students_count || 120).toLocaleString()} students)</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{durationDisplay}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>{(course.students_count || 120).toLocaleString()} enrolled</span>
                </div>
              </div>
            </div>

            {/* Course Image */}
            <Card>
              <div className="aspect-video relative overflow-hidden rounded-lg bg-gray-100">
                {course.course_image_url ? (
                  <img
                    src={course.course_image_url}
                    alt={course.title}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <Play className="h-16 w-16 opacity-50" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                  <Button size="lg" className="bg-white text-black hover:bg-gray-100" onClick={() => course.preview_video_url && window.open(course.preview_video_url, '_blank')}>
                    <Play className="mr-2 h-5 w-5" />
                    {course.preview_video_url ? "Watch Preview" : "Preview Unavailable"}
                  </Button>
                </div>
              </div>
            </Card>

            {/* What You'll Learn */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>What You'll Learn</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {whatYouWillLearn.map((item, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-text-secondary">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card>
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {requirements.map((req, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-text-secondary">•</span>
                      <span className="text-text-secondary">{req}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Enrollment Card */}
              <Card>
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div className="text-4xl font-bold text-text-primary mb-2">
                      {course.price === 0 ? "Free" : `₹${course.price}`}
                    </div>
                    <div className="text-text-secondary">One-time payment</div>
                  </div>
                  <Button className="w-full mb-4" size="lg">
                    Enroll Now
                  </Button>
                  <Button variant="outline" className="w-full" disabled={!course.syllabus_url} onClick={() => course.syllabus_url && window.open(course.syllabus_url, '_blank')}>
                    <Download className="mr-2 h-4 w-4" />
                    Download Syllabus
                  </Button>
                  <div className="mt-6 text-center text-sm text-text-secondary">
                    <div className="flex items-center justify-center space-x-4">
                      <span>• Opportunity to work with us</span>
                    </div>
                    <div className="flex items-center justify-center space-x-4 mt-2">
                      <span>• Lifetime access</span>
                    </div>
                    <div className="flex items-center justify-center space-x-4 mt-2">
                      <span>• Certificate of completion</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Instructor */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Instructor</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center overflow-hidden border-2 border-gray-200">
                      <img src="/celoris-logo.png" alt="Celoris" className="w-12 h-12 object-contain" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-text-primary">{course.instructor_name || "Expert Instructor"}</h3>
                      <p className="text-sm text-text-secondary">Course Instructor</p>
                    </div>
                  </div>
                  <p className="text-sm text-text-secondary mb-4">
                    {course.instructor_bio || "Passionate about teaching and helping others break into tech."}
                  </p>
                  <div className="space-y-2 text-sm text-text-secondary">
                    <div className="flex items-center space-x-2">
                      <Award className="h-4 w-4" />
                      <span>Expert instructor</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4" />
                      <span>{(course.students_count || 120).toLocaleString()}+ students</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}