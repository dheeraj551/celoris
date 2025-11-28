import { Metadata } from "next"
import { ArrowLeft, Clock, Users, Star, Award, Play, Download, CheckCircle, BookOpen } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Course Details - Celoris Learn",
  description: "Detailed course information and enrollment.",
}

const getCourse = (id: string) => {
  const courses = [
    {
      id: 1,
      title: "Complete Web Development Bootcamp",
      instructor: "Sarah Johnson",
      description: "Learn full-stack web development from scratch. Build real projects and land your first developer job.",
      longDescription: "This comprehensive bootcamp will take you from zero to a full-stack developer. You'll learn HTML, CSS, JavaScript, React, Node.js, databases, and more. By the end of this course, you'll have built several real-world projects and have the skills needed to start your developer career.",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      rating: 4.9,
      students: 15420,
      duration: "40 hours",
      level: "Beginner",
      price: 0,
      category: "Programming",
      instructorImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      instructorBio: "Senior Full-Stack Developer with 8+ years of experience at top tech companies. Passionate about teaching and helping others break into tech.",
      curriculum: [
        { title: "Introduction to Web Development", duration: "2 hours", lessons: 8 },
        { title: "HTML & CSS Fundamentals", duration: "6 hours", lessons: 12 },
        { title: "JavaScript Basics", duration: "8 hours", lessons: 16 },
        { title: "React Fundamentals", duration: "10 hours", lessons: 20 },
        { title: "Node.js & Express", duration: "8 hours", lessons: 15 },
        { title: "Database Integration", duration: "6 hours", lessons: 12 }
      ],
      whatYouWillLearn: [
        "Build responsive websites using HTML, CSS, and JavaScript",
        "Create dynamic web applications with React",
        "Develop REST APIs using Node.js and Express",
        "Work with databases like MongoDB and PostgreSQL",
        "Deploy applications to the cloud",
        "Implement authentication and security best practices",
        "Version control with Git and GitHub",
        "Code review and debugging techniques"
      ],
      requirements: [
        "No prior programming experience required",
        "Computer with internet connection",
        "Willingness to learn and practice"
      ]
    }
  ]
  return courses.find(c => c.id.toString() === id)
}

export default function CourseDetailPage({ params }: { params: { id: string } }) {
  const course = getCourse(params.id)

  if (!course) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-text-primary mb-4">Course Not Found</h1>
          <Link href="/learn/courses">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Courses
            </Button>
          </Link>
        </div>
      </div>
    )
  }

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
          <span className="text-text-primary">{course.title}</span>
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
                  {course.category}
                </span>
                <span className="bg-surface px-3 py-1 rounded-full text-sm font-medium">
                  {course.level}
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
                  <span className="font-medium">{course.rating}</span>
                  <span>({course.students.toLocaleString()} students)</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>{course.students.toLocaleString()} enrolled</span>
                </div>
              </div>
            </div>

            {/* Course Video Thumbnail */}
            <Card>
              <div className="aspect-video relative overflow-hidden rounded-lg">
                <img
                  src={course.image}
                  alt={course.title}
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                  <Button size="lg" className="bg-white text-black hover:bg-gray-100">
                    <Play className="mr-2 h-5 w-5" />
                    Preview Course
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
                  {course.whatYouWillLearn.map((item, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-text-secondary">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Course Curriculum */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5" />
                  <span>Course Curriculum</span>
                </CardTitle>
                <CardDescription>
                  {course.curriculum.reduce((total, section) => total + section.lessons, 0)} lessons • {course.duration}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {course.curriculum.map((section, index) => (
                    <div key={index} className="border border-border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-text-primary">{section.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-text-secondary">
                          <span>{section.lessons} lessons</span>
                          <span>{section.duration}</span>
                        </div>
                      </div>
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
                  {course.requirements.map((req, index) => (
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
                      {course.price === 0 ? "Free" : `$${course.price}`}
                    </div>
                    <div className="text-text-secondary">One-time payment</div>
                  </div>
                  <Button className="w-full mb-4" size="lg">
                    Enroll Now
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Download Syllabus
                  </Button>
                  <div className="mt-6 text-center text-sm text-text-secondary">
                    <div className="flex items-center justify-center space-x-4">
                      <span>• 30-day money-back guarantee</span>
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
                    <img
                      src={course.instructorImage}
                      alt={course.instructor}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-text-primary">{course.instructor}</h3>
                      <p className="text-sm text-text-secondary">Full-Stack Developer</p>
                    </div>
                  </div>
                  <p className="text-sm text-text-secondary mb-4">
                    {course.instructorBio}
                  </p>
                  <div className="space-y-2 text-sm text-text-secondary">
                    <div className="flex items-center space-x-2">
                      <Award className="h-4 w-4" />
                      <span>8+ years experience</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4" />
                      <span>50,000+ students taught</span>
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