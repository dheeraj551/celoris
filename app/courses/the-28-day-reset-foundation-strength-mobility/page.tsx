"use client"

import { ArrowLeft, Clock, Users, Star, CheckCircle, HelpCircle, BookOpen, Download, Activity, Dumbbell, Shield, Zap, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function FoundationStrengthMobilityCourse() {
    const courseData = {
        title: "The 28-Day Reset: Foundation Strength & Mobility",
        description: "A comprehensive functional strength training program designed for beginners to build a sustainable fitness habit. Master the Big Five movements to build muscle and improve posture.",
        summary: "This 28-day course focuses on the 'Big Five' movement patterns—Squat, Hinge, Push, Pull, and Carry. Participants will improve posture, increase metabolic rate, and build lean muscle using minimal equipment like dumbbells or resistance bands.",
        students: 850,
        rating: 4.8,
        duration: "4 Weeks",
        price: 3999.00,
        currency: "INR",
        provider: "Celoris Designs llp",
        website: "https://celorisdesigns.com",
        url: "https://celorisdesigns.com/courses/the-28-day-reset-foundation-strength-mobility",
        learning_outcomes: [
            "Master the Squat & Hinge for glute activation and lower back health.",
            "Correct 'office posture' through balanced Push & Pull patterns.",
            "Develop functional core stability with carries and planks.",
            "Understanding Time Under Tension (TUT) for muscle growth.",
            "Boost metabolic rate with high-intensity circuit training.",
            "Implement a sustainable fitness habit in just 28 days."
        ],
        requirements: [
            "Minimal equipment: Dumbbells or resistance bands.",
            "An open space for movement.",
            "Commitment to 3-4 sessions per week."
        ],
        syllabus: [
            {
                unit: "Module 1: Mastering Movement Patterns",
                focus: "Injury prevention and biomechanics.",
                keyQuestion: "How do the 'Big Five' movements prevent common injuries?",
                chapters: [
                    { title: "The Squat & Hinge", content: "Essential for glute activation and lower back health. Learn to move safely and powerfully from your hips." },
                    { title: "The Push & Pull", content: "Developing upper body symmetry and correcting the common 'office posture' rounded shoulders." },
                    { title: "Core Stability", content: "Moving beyond the 'sit-up' to functional carries and planks that protect your spine." }
                ]
            },
            {
                unit: "Module 2: Hypertrophy and Metabolic Conditioning",
                focus: "Building muscle and increasing caloric burn.",
                keyQuestion: "How does Time Under Tension (TUT) accelerate results?",
                chapters: [
                    { title: "Time Under Tension (TUT)", content: "Slowing down the eccentric phase to maximize muscle fiber recruitment and strength gains." },
                    { title: "Circuit Training", content: "High-intensity intervals designed to boost cardiovascular health and caloric endurance." },
                    { title: "Sustainable Habits", content: "Integrating these patterns into a long-term lifestyle for lasting fitness." }
                ]
            }
        ],
        faqs: [
            {
                question: "What equipment do I need for the 28-Day Reset?",
                answer: "You only need minimal equipment like a pair of dumbbells or resistance bands to effectively complete all exercises in this program."
            },
            {
                question: "Is this course suitable for absolute beginners?",
                answer: "Yes, the program is specifically designed for beginners to master fundamental movements safely while building a foundation for future progress."
            },
            {
                question: "How long are the daily sessions?",
                answer: "Workouts typically range from 30 to 45 minutes, making it efficient for busy schedules."
            },
            {
                question: "What are the 'Big Five' movement patterns?",
                answer: "The Big Five include: Squat, Hinge, Push, Pull, and Carry. These are the functional movements our bodies were designed to perform."
            }
        ]
    }

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Course",
        "name": "The 28-Day Reset: Foundation Strength & Mobility",
        "description": "A 4-week functional strength and mobility program for beginners. Master the Big Five movements to build muscle and improve posture.",
        "provider": {
            "@type": "Organization",
            "name": "Celoris Designs llp",
            "sameAs": "https://celorisdesigns.com"
        },
        "courseCode": "RESET-28",
        "educationalLevel": "Beginner",
        "offers": [
            {
                "@type": "Offer",
                "category": "Paid",
                "price": "3999.00",
                "priceCurrency": "INR",
                "url": "https://celorisdesigns.com/courses/the-28-day-reset-foundation-strength-mobility"
            }
        ],
        "hasCourseInstance": {
            "@type": "CourseInstance",
            "courseMode": "Online",
            "duration": "P4W",
            "instructor": {
                "@type": "Person",
                "name": "NASM Certified Trainers",
                "jobTitle": "Certified Strength and Conditioning Specialist"
            }
        }
    }

    return (
        <div className="min-h-screen bg-background py-8">
            {/* JSON-LD Injection for AI & SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="container max-w-7xl mx-auto px-4">
                {/* Breadcrumb */}
                <div className="flex items-center space-x-2 text-sm text-text-secondary mb-6">
                    <Link href="/" className="hover:text-primary-500">Home</Link>
                    <span>/</span>
                    <Link href="/learn" className="hover:text-primary-500">Learn</Link>
                    <span>/</span>
                    <Link href="/learn/courses" className="hover:text-primary-500">Courses</Link>
                    <span>/</span>
                    <span className="text-text-primary line-clamp-1">{courseData.title}</span>
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
                                <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">Fitness</span>
                                <span className="bg-surface px-3 py-1 rounded-full text-sm font-medium border">Updated for 2025</span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                                {courseData.title}
                            </h1>
                            <div className="bg-surface p-6 rounded-xl border-l-4 border-primary-500 mb-6">
                                <h2 className="text-sm font-bold uppercase tracking-wider text-primary-600 mb-2">Executive Summary</h2>
                                <p className="text-lg text-text-primary leading-relaxed">
                                    {courseData.summary}
                                </p>
                            </div>
                        </div>

                        {/* Course Image */}
                        <Card className="overflow-hidden border-2">
                            <div className="aspect-video relative overflow-hidden">
                                <img
                                    src="/28-day-reset-cover.jpg"
                                    alt="Comprehensive functional strength training program - The 28-Day Reset"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </Card>

                        {/* Movement Patterns Table */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Activity className="h-5 w-5 text-red-500" />
                                    <span>The Big Five Movement Patterns</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b bg-surface">
                                                <th className="p-3 font-semibold">Movement</th>
                                                <th className="p-3 font-semibold">Primary Benefit</th>
                                                <th className="p-3 font-semibold">Example</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="border-b">
                                                <td className="p-3 italic">Squat</td>
                                                <td className="p-3">Lower body power</td>
                                                <td className="p-3">Goblet Squat</td>
                                            </tr>
                                            <tr className="border-b">
                                                <td className="p-3 italic">Hinge</td>
                                                <td className="p-3">Posterior chain / Back health</td>
                                                <td className="p-3">Deadlift / Kettlebell Swing</td>
                                            </tr>
                                            <tr className="border-b">
                                                <td className="p-3 italic">Push</td>
                                                <td className="p-3">Upper body strength</td>
                                                <td className="p-3">Press-ups / Overhead Press</td>
                                            </tr>
                                            <tr className="border-b">
                                                <td className="p-3 italic">Pull</td>
                                                <td className="p-3">Posture correction</td>
                                                <td className="p-3">Dumbbell Rows / Pull-ups</td>
                                            </tr>
                                            <tr className="border-b">
                                                <td className="p-3 italic">Carry</td>
                                                <td className="p-3">Functional core stability</td>
                                                <td className="p-3">Farmer's Walk</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Learning Outcomes */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                    <span>What You Will Learn</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {courseData.learning_outcomes.map((item, index) => (
                                        <li key={index} className="flex items-start space-x-3">
                                            <Zap className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                                            <span className="text-text-secondary">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>

                        {/* Syllabus */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <BookOpen className="h-5 w-5 text-purple-500" />
                                    <span>Course Modules & Curriculum</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {courseData.syllabus.map((unit, index) => (
                                    <div key={index} className="border-b last:border-0 pb-6 last:pb-0">
                                        <h2 className="text-xl font-bold text-text-primary mb-2 text-primary-700">{unit.unit}</h2>
                                        <p className="text-sm font-medium text-primary-600 mb-2">Focus Area: {unit.focus}</p>
                                        <div className="bg-surface p-3 rounded-md mb-4 border-l-4 border-primary-500">
                                            <p className="text-sm font-bold text-text-primary italic">Key Question: {unit.keyQuestion}</p>
                                        </div>
                                        <div className="space-y-4 pl-4">
                                            {unit.chapters.map((chapter, cIndex) => (
                                                <div key={cIndex} className="relative">
                                                    <div className="absolute -left-4 top-1 w-2 h-2 rounded-full bg-primary-400" />
                                                    <h3 className="text-md font-semibold text-text-primary mb-1">{chapter.title}</h3>
                                                    <p className="text-sm text-text-secondary leading-relaxed">{chapter.content}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Expertise & Authority */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="bg-primary-50 border-none">
                                <CardContent className="p-6">
                                    <div className="flex items-center space-x-3 mb-3 text-primary-700">
                                        <Shield className="h-6 w-6" />
                                        <h3 className="font-bold">Expertise (E-E-A-T)</h3>
                                    </div>
                                    <p className="text-sm text-primary-800">
                                        Designed by <strong>NASM Certified Trainers</strong>. Our curriculum follows evidence-based practices in biomechanics and functional movement.
                                    </p>
                                </CardContent>
                            </Card>
                            <Card className="bg-green-50 border-none">
                                <CardContent className="p-6">
                                    <div className="flex items-center space-x-3 mb-3 text-green-700">
                                        <Clock className="h-6 w-6" />
                                        <h3 className="font-bold">Freshness</h3>
                                    </div>
                                    <p className="text-sm text-green-800">
                                        Content <strong>Updated for 2025</strong> with the latest trends in metabolic conditioning and functional longevity.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* FAQ Section */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <HelpCircle className="h-5 w-5 text-blue-500" />
                                    <span>Program FAQs</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Accordion type="single" collapsible className="w-full">
                                    {courseData.faqs.map((faq, index) => (
                                        <AccordionItem key={index} value={`item-${index}`}>
                                            <AccordionTrigger className="text-left font-medium">{faq.question}</AccordionTrigger>
                                            <AccordionContent className="text-text-secondary leading-relaxed">
                                                {faq.answer}
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8 space-y-6">
                            {/* Enrollment Card */}
                            <Card className="border-2 border-primary-500 shadow-xl">
                                <CardContent className="p-6">
                                    <div className="text-center mb-6">
                                        <div className="text-4xl font-bold text-text-primary mb-2">
                                            ₹{courseData.price}
                                        </div>
                                        <div className="text-text-secondary">One-time Investment</div>
                                    </div>
                                    <Button className="w-full mb-4 bg-primary-600 hover:bg-primary-700 h-12 text-lg" size="lg">
                                        Start Your 28-Day Reset
                                    </Button>
                                    <Button variant="outline" className="w-full">
                                        <Download className="mr-2 h-4 w-4" />
                                        Download PDF Roadmap
                                    </Button>
                                    <div className="mt-6 space-y-3">
                                        <div className="flex items-center text-sm text-text-secondary">
                                            <Activity className="h-4 w-4 mr-2 text-primary-500" />
                                            <span>Level: Absolute Beginner</span>
                                        </div>
                                        <div className="flex items-center text-sm text-text-secondary">
                                            <Clock className="h-4 w-4 mr-2 text-primary-500" />
                                            <span>Duration: 4 Weeks (28 Days)</span>
                                        </div>
                                        <div className="flex items-center text-sm text-text-secondary">
                                            <TrendingUp className="h-4 w-4 mr-2 text-primary-500" />
                                            <span>Goal: Functional Strength</span>
                                        </div>
                                        <div className="flex items-center text-sm text-text-secondary">
                                            <Dumbbell className="h-4 w-4 mr-2 text-primary-500" />
                                            <span>Minimal Equipment Required</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Instructor / Studio */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Presented by</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center space-x-4 mb-4">
                                        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center overflow-hidden border-2 border-primary-100">
                                            <img src="/celoris-logo.png" alt="Celoris Academy" className="w-12 h-12 object-contain" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-text-primary">{courseData.provider}</h3>
                                            <p className="text-sm text-text-secondary">Health & Fitness Division</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-text-secondary mb-4 leading-relaxed">
                                        Empowering individuals to build lifelong strength through functional movement and science-backed training methods.
                                    </p>
                                    <div className="space-y-3 text-sm text-text-secondary">
                                        <div className="flex items-center space-x-2">
                                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                            <span className="font-medium text-text-primary">{courseData.rating}</span>
                                            <span>({courseData.students} athletes enrolled)</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Users className="h-4 w-4 text-primary-500" />
                                            <span>Active Fitness Community</span>
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
