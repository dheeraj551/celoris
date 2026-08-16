"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Clock, Users, Star, Award, Play, Download, CheckCircle, BookOpen, HelpCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { createClient } from "@/lib/supabase-client"
import { useParams, useRouter } from "next/navigation"
import { CourseInquiryDialog } from "@/components/CourseInquiryDialog"
import { CourseTrainerBooth } from "@/components/learn/CourseTrainerBooth"
interface CourseTopic {
  id: string
  order_in_module: number
  title: string
  short_description: string | null
}

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
  course_id: string
  module_number: number
  title: string
  description: string | null
  estimated_duration: number | null
  course_topics?: CourseTopic[]
}

export default function CourseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Redirect specific courses to their premium static pages or SEO friendly slugs
    const staticRedirects: Record<string, string> = {
      '1ca8cbea-1c9d-470d-ac69-f37882c31963': '/courses/build-real-time-ai-agents-with-livekit',
      '67bdf362-5e1c-49dd-9794-9c430ca351cb': '/courses/agentic-ai-for-beginners',
      'e7698318-7f57-421f-866e-0101ee239c01': '/learn/course/digital-marketing-mastery',
      '48713643-694c-491f-86d6-5b6e713c1cf3': '/learn/course/web-development-bootcamp',
      '879e499f-5517-413a-bd6a-76e2911b8331': '/learn/course/ai-web-development'
    };

    if (id && staticRedirects[id]) {
      router.replace(staticRedirects[id]);
      return;
    }

    if (id) {
      loadCourse()
    }
  }, [id, router])

  const loadCourse = async () => {
    try {
      setLoading(true)
      const supabase = createClient()

      let targetId = id
      if (id === 'digital-marketing-mastery') {
        targetId = 'e7698318-7f57-421f-866e-0101ee239c01'
      }
      if (id === 'web-development-bootcamp') {
        targetId = '48713643-694c-491f-86d6-5b6e713c1cf3'
      }
      if (id === 'ai-web-development') {
        targetId = '879e499f-5517-413a-bd6a-76e2911b8331'
      }

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
            course_topics (
              id,
              order_in_module,
              title,
              short_description
            )
          )
        `)
        .eq('id', targetId)
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

  const getFaqsForCourse = (courseTitle: string) => {
    const title = courseTitle.toLowerCase();
    if (title.includes("digital marketing")) {
      return [
        {
          question: "Do I need any technical background?",
          answer: "No. This course is beginner-friendly and builds up progressively."
        },
        {
          question: "Will I get to run real ad campaigns during the course?",
          answer: "Yes — you'll get hands-on practice with real ad platforms (Meta, Google) using either simulated or live budgets depending on batch structure."
        },
        {
          question: "Is this course useful if I already run my own business?",
          answer: "Absolutely — many students join specifically to market their own business rather than pursue a marketing job."
        },
        {
          question: "What if I miss a live session?",
          answer: "Recordings are provided so you can catch up before the next class."
        },
        {
          question: "Is there a certificate?",
          answer: "Yes, a Celoris certificate of completion is provided at the end."
        }
      ];
    }
    if (title.includes("web development")) {
      return [
        {
          question: "I have zero coding background. Can I still join?",
          answer: "Yes — this course is designed for complete beginners and builds up step by step."
        },
        {
          question: "Will I actually build a real website, or just learn theory?",
          answer: "You'll build multiple real projects throughout the course, ending with a live, deployed capstone project."
        },
        {
          question: "Do I need to buy any software?",
          answer: "No — all tools used (VS Code, GitHub, hosting platforms) have free tiers sufficient for this course."
        },
        {
          question: "What if I miss a live session?",
          answer: "Recordings are provided so you can catch up before the next class."
        },
        {
          question: "Is this course enough to get a developer job?",
          answer: "This course gives you a strong practical foundation and portfolio. Landing a job also depends on practice and interview prep, which we guide you on, but outcomes vary per individual effort."
        },
        {
          question: "Is there a certificate?",
          answer: "Yes, a Celoris certificate of completion is provided at the end."
        }
      ];
    }
    if (title.includes("ai-powered web development")) {
      return [
        {
          question: "If AI builds the website, what am I actually learning?",
          answer: "You're learning to direct AI effectively, understand and customize what it generates, and combine tools professionally — this is exactly how working developers operate today. Pure prompting without understanding gets you stuck the moment something breaks; this course prevents that."
        },
        {
          question: "Do I still need to learn to code?",
          answer: "You'll learn enough HTML/CSS/JS to read, understand, and fix code — but you won't be writing everything from scratch the old way. That's the point: work smarter, ship faster."
        },
        {
          question: "I have zero coding background. Can I still join?",
          answer: "Yes — this course is designed for complete beginners and builds up step by step."
        },
        {
          question: "Will I build a real, live website?",
          answer: "Yes — multiple projects throughout the course, ending with a live, deployed capstone project."
        },
        {
          question: "What if I miss a live session?",
          answer: "Recordings are provided so you can catch up before the next class."
        },
        {
          question: "Is there a certificate?",
          answer: "Yes, a Celoris certificate of completion is provided at the end."
        }
      ];
    }
    return [];
  };

  const faqs = course ? getFaqsForCourse(course.title) : [];

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
        <Link href="/learn/courses" className="inline-flex items-center text-muted-foreground hover:text-primary-500 mb-6 font-medium">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Courses
        </Link>

        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Course",
              "name": course.title,
              "description": course.description,
              "provider": {
                "@type": "Organization",
                "name": "Celoris Designs",
                "sameAs": "https://celorisdesigns.com"
              },
              "hasCourseInstance": {
                "@type": "CourseInstance",
                "courseMode": "online",
                "location": {
                  "@type": "VirtualLocation",
                  "url": typeof window !== 'undefined' ? window.location.href : `https://celorisdesigns.com/learn/course/${course.id}`
                },
                "offers": {
                  "@type": "Offer",
                  "price": course.price.toString(),
                  "priceCurrency": "INR",
                  "availability": "https://schema.org/InStock",
                }
              },
              "educationalLevel": course.grade_level
            })
          }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Course Header */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                  {course.subject}
                </span>
                <span className="bg-slate-200 text-slate-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                  {course.grade_level}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                {course.title}
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                {course.description}
              </p>

              {/* Course Stats Removed (Moved to Instructor Profile) */}
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
            <Card className="bg-white border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-slate-900">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>What You'll Learn</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {whatYouWillLearn.map((item, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700 font-medium leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card className="bg-white border-slate-200">
              <CardHeader>
                <CardTitle className="text-slate-900">Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {requirements.map((req, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-slate-400 font-bold">•</span>
                      <span className="text-slate-700 font-medium">{req}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Course Curriculum / Modules */}
            {course.course_modules && course.course_modules.length > 0 && (
              <Card className="bg-white border-slate-200">
                <CardHeader>
                  <CardTitle className="text-slate-900 flex items-center space-x-2">
                    <BookOpen className="h-5 w-5 text-green-600" />
                    <span>Course Curriculum</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {course.course_modules
                      .sort((a, b) => a.module_number - b.module_number)
                      .map((mod) => (
                        <div key={mod.id} className="border border-slate-100 rounded-xl p-4 bg-slate-50/50">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-bold text-slate-800 text-base">
                                Module {mod.module_number}: {mod.title}
                              </h4>
                              {mod.description && (
                                <p className="text-sm text-slate-500 mt-1">{mod.description}</p>
                              )}
                            </div>
                            {mod.estimated_duration && (
                              <span className="text-xs bg-slate-200/80 text-slate-600 px-2 py-1 rounded font-semibold whitespace-nowrap">
                                {mod.estimated_duration} mins
                              </span>
                            )}
                          </div>
                          
                          {/* Topics List */}
                          {mod.course_topics && mod.course_topics.length > 0 && (
                            <ul className="mt-3 pl-4 border-l-2 border-slate-200 space-y-2">
                              {mod.course_topics
                                .sort((a, b) => a.order_in_module - b.order_in_module)
                                .map((topic) => (
                                  <li key={topic.id} className="text-sm text-slate-700 font-medium flex items-start space-x-2">
                                    <span className="text-green-600 font-bold">•</span>
                                    <span>{topic.title}</span>
                                  </li>
                                ))}
                            </ul>
                          )}
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* FAQs Section */}
            {faqs.length > 0 && (
              <Card className="bg-white border-slate-200">
                <CardHeader>
                  <CardTitle className="text-slate-900 flex items-center space-x-2">
                    <HelpCircle className="h-5 w-5 text-green-600" />
                    <span>Frequently Asked Questions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {faqs.map((faq, index) => (
                      <div key={index} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                        <h4 className="font-bold text-slate-800 text-sm mb-1 flex items-start space-x-2">
                          <span className="text-green-600">Q:</span>
                          <span>{faq.question}</span>
                        </h4>
                        <p className="text-sm text-slate-600 pl-5 font-medium leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Trainer Booth */}
            <div className="mt-8">
              <CourseTrainerBooth courseId={course.id} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Enrollment Card */}
              <Card className="bg-white border-slate-200 shadow-xl shadow-primary-900/10">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div className="text-4xl font-bold text-slate-900 mb-2 flex items-center justify-center gap-3">
                      {course.price === 0 ? (
                        "Free"
                      ) : (
                        <>
                          <span className="text-2xl text-slate-400 line-through">₹{course.price * 2}</span>
                          <span className="text-green-600">₹{course.price}</span>
                        </>
                      )}
                    </div>
                    {course.price > 0 && (
                      <div className="inline-block bg-red-100 text-red-600 text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wider animate-pulse shadow-sm">
                        🔥 50% OFF Limited Time
                      </div>
                    )}
                    <div className="text-slate-500 font-medium">One-time payment</div>
                  </div>
                  <CourseInquiryDialog
                    courseTitle={course.title}
                    buttonClassName="w-full mb-4 h-14 text-lg font-bold bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white rounded-2xl shadow-lg"
                  />

                  <div className="mt-6 text-center text-sm text-slate-500 font-medium">
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

              <Card className="bg-white border-slate-200">
                <CardHeader>
                  <CardTitle className="text-slate-900">Your Instructor</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center overflow-hidden border-2 border-slate-100">
                      <img src="/celoris-logo.svg" alt="Celoris" className="w-12 h-12 object-contain" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{course.instructor_name || "Expert Instructor"}</h3>
                      <p className="text-xs text-slate-500 font-medium">Course Instructor</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 mb-4 leading-relaxed font-medium">
                    {course.instructor_bio || "Passionate about teaching and helping others break into tech."}
                  </p>
                  <div className="space-y-3 text-sm text-slate-600 font-semibold">
                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-500" />
                      <span className="text-slate-900">{course.rating || 4.8}</span>
                      <span className="text-slate-400 font-normal">({(course.students_count || 120).toLocaleString()} ratings)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-primary-600" />
                      <span>{durationDisplay}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-primary-600" />
                      <span>{(course.students_count || 120).toLocaleString()} enrolled</span>
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