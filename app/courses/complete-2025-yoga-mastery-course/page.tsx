"use client"

import { ArrowLeft, Clock, Users, Star, CheckCircle, HelpCircle, BookOpen, Download, Activity, Heart, Wind, Moon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { CourseInquiryDialog } from "@/components/CourseInquiryDialog"

export default function YogaMasteryCourse2025() {
    const courseData = {
        title: "The Complete 2025 Yoga Mastery Course: From Beginner Poses to Advanced Mindfulness",
        description: "This comprehensive yoga program bridges traditional Vedic wisdom with modern functional movement. Designed for all levels, it covers physical asanas, breathwork (Pranayama), and restorative techniques for stress relief.",
        students: 1540,
        rating: 4.9,
        duration: "12 Weeks",
        price: 6000.00,
        currency: "INR",
        provider: "Celoris Designs llp",
        website: "https://celorisdesigns.com",
        url: "https://celorisdesigns.com/courses/complete-2025-yoga-mastery-course",
        learning_outcomes: [
            "Master Sun Salutations (Surya Namaskar) Alignment with precision.",
            "Deepen your understanding of Yoga Anatomy and preventing injury.",
            "Reduce stress and anxiety via advanced Pranayama techniques.",
            "Learn to sequence Vinyasa Flow for different energy levels.",
            "Improve sleep quality with Yoga Nidra and restorative practices.",
            "Incorporate the 8 Limbs of Yoga into your modern daily life."
        ],
        requirements: [
            "No prior yoga experience required; suitable for beginners.",
            "A yoga mat and comfortable clothing.",
            "An open mind and commitment to daily practice."
        ],
        syllabus: [
            {
                unit: "Module 1: Foundations of Hatha & Vinyasa",
                focus: "Introduction to the 8 Limbs of Yoga.",
                keyQuestion: "What is the difference between Hatha and Vinyasa yoga?",
                chapters: [
                    { title: "Sun Salutations (Surya Namaskar)", content: "Detailed breakdown of alignment principles and variations for all bodies." },
                    { title: "History of the Yoga Sutras", content: "Exploring the philosophical roots and the 8 Limbs of Yoga." },
                    { title: "Hatha vs. Vinyasa", content: "Understanding static vs. fluid movement and when to practice each." }
                ]
            },
            {
                unit: "Module 2: Yoga Anatomy & Functional Movement",
                focus: "How yoga affects the nervous system.",
                keyQuestion: "Which yoga poses are best for back pain?",
                chapters: [
                    { title: "The Musculoskeletal System", content: "Focus on core stability and protecting the spine during movement." },
                    { title: "Downward Dog (Adho Mukha Svanasana)", content: "Mastering the foundation of many flows to prevent wrist and shoulder injury." },
                    { title: "Nervous System Regulation", content: "The science of how yoga shifts us from 'Fight or Flight' to 'Rest and Digest'." }
                ]
            },
            {
                unit: "Module 3: Breathwork (Pranayama) & Mental Health",
                focus: "Mastering the breath for anxiety relief.",
                keyQuestion: "How do I practice Ujjayi breathing?",
                chapters: [
                    { title: "Nadi Shodhana", content: "Step-by-step guide on alternate nostril breathing for balance." },
                    { title: "Ujjayi (Victorious Breath)", content: "Learning the warming throat breath used in Vinyasa flows." },
                    { title: "Sheetali (Cooling Breath)", content: "Techniques for cooling the body and calming the mind." }
                ]
            },
            {
                unit: "Module 4: Restorative Yoga & Sleep Hygiene",
                focus: "Yoga Nidra and deep relaxation.",
                keyQuestion: "Can yoga improve sleep quality?",
                chapters: [
                    { title: "Passive Stretching & Props", content: "Using blocks and bolsters to support the body in deep relaxation." },
                    { title: "Science of the Parasympathetic Nervous System", content: "Why rest is just as important as movement for long-term health." },
                    { title: "Yoga Nidra Guided Practice", content: "A specific sequence designed to induce deep yogic sleep." }
                ]
            }
        ],
        faqs: [
            {
                question: "What is the difference between Hatha and Vinyasa yoga?",
                answer: "Hatha yoga focuses on holding individual poses to build strength and alignment, making it great for beginners. Vinyasa yoga is more dynamic, linking breath with continuous movement in a fluid sequence."
            },
            {
                question: "Which yoga poses are best for back pain?",
                answer: "Cat-Cow, Child's Pose, and Sphinx pose are excellent for relieving lower back tension. Our course provides a specific sequence for spinal health in Module 2."
            },
            {
                question: "How do I practice Ujjayi breathing?",
                answer: "Ujjayi involves a slight constriction at the back of the throat while breathing through the nose, creating a sound like the ocean waves. It helps maintain focus and heat during practice."
            },
            {
                question: "Can yoga improve sleep quality?",
                answer: "Yes! Restorative yoga and Yoga Nidra specifically activate the parasympathetic nervous system, lowering cortisol levels and preparing the brain for deep, restful sleep."
            }
        ]
    }

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Course",
        "name": "The Complete 2025 Yoga Mastery Course",
        "description": "An evidence-based yoga program combining Vinyasa flow, Hatha alignment, and Pranayama breathwork for physical and mental wellbeing.",
        "provider": {
            "@type": "Organization",
            "name": "Celoris Designs llp",
            "sameAs": "https://celorisdesigns.com"
        },
        "courseCode": "YOGA-2025-MASTER",
        "educationalLevel": "Beginner to Advanced",
        "teaches": [
            "Sun Salutations (Surya Namaskar) Alignment",
            "Anatomy of Yoga Poses",
            "Stress Reduction via Pranayama",
            "Vinyasa Flow Sequences",
            "Yoga Nidra for Sleep"
        ],
        "syllabusSections": [
            {
                "@type": "Syllabus",
                "name": "Module 1: Foundations",
                "description": "Introduction to the 8 Limbs of Yoga and Hatha fundamentals."
            },
            {
                "@type": "Syllabus",
                "name": "Module 2: Breath & Mind",
                "description": "Techniques for Ujjayi and Nadi Shodhana breathwork."
            }
        ],
        "offers": {
            "@type": "Offer",
            "price": "6000.00",
            "priceCurrency": "INR",
            "availability": "https://schema.org/InStock"
        }
    }

    return (
        <div className="min-h-screen bg-background py-8">
            {/* JSON-LD Injection */}
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
                                <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">Yoga</span>
                                <span className="bg-surface px-3 py-1 rounded-full text-sm font-medium">2025 Edition</span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                                {courseData.title}
                            </h1>
                            <p className="text-lg text-text-secondary mb-6">
                                {courseData.description}
                            </p>
                        </div>

                        {/* Course Image */}
                        <Card>
                            <div className="aspect-video relative overflow-hidden rounded-lg">
                                <img
                                    src="/yoga-mastery-2025-cover.jpg"
                                    alt="Woman doing Warrior 2 pose for alignment - Yoga for Beginners to Advanced"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </Card>

                        {/* Comparison Table for AI & Humans */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Activity className="h-5 w-5 text-orange-500" />
                                    <span>Comparison of Yoga Styles</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b bg-surface">
                                                <th className="p-3 font-semibold">Yoga Style</th>
                                                <th className="p-3 font-semibold">Intensity</th>
                                                <th className="p-3 font-semibold">Focus</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="border-b">
                                                <td className="p-3 italic">Hatha</td>
                                                <td className="p-3">Gentle</td>
                                                <td className="p-3">Foundations & Alignment</td>
                                            </tr>
                                            <tr className="border-b">
                                                <td className="p-3 italic">Vinyasa</td>
                                                <td className="p-3">High</td>
                                                <td className="p-3">Fluidity & Breath Sync</td>
                                            </tr>
                                            <tr className="border-b">
                                                <td className="p-3 italic">Yin</td>
                                                <td className="p-3">Low</td>
                                                <td className="p-3">Deep Tissue & Stillness</td>
                                            </tr>
                                            <tr className="border-b">
                                                <td className="p-3 italic">Restorative</td>
                                                <td className="p-3">Very Low</td>
                                                <td className="p-3">Stress Recovery</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Core Focus Areas */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                    <span>What You Will Master</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {courseData.learning_outcomes.map((item, index) => (
                                        <li key={index} className="flex items-start space-x-3">
                                            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                                            <span className="text-text-secondary">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>

                        {/* Detailed Syllabus - Optimized for SEO & AI */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <BookOpen className="h-5 w-5 text-purple-500" />
                                    <span>Comprehensive Course Syllabus</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {courseData.syllabus.map((unit, index) => (
                                    <div key={index} className="border-b last:border-0 pb-6 last:pb-0">
                                        <h2 className="text-xl font-bold text-text-primary mb-2 text-primary-700">{unit.unit}</h2>
                                        <p className="text-sm font-medium text-primary-600 mb-2">Topic: {unit.focus}</p>
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

                        {/* Authority Citations */}
                        <div className="text-xs text-text-secondary italic bg-surface p-4 rounded-lg">
                            Note: This course curriculum follows the Yoga Alliance Standards and references classical texts such as the Hatha Yoga Pradipika and Patanjali&apos;s Yoga Sutras for maximum authenticity and E-E-A-T.
                        </div>

                        {/* FAQ Section - "People Also Ask" */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <HelpCircle className="h-5 w-5 text-blue-500" />
                                    <span>People Also Ask (Yoga FAQ)</span>
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
                                        <div className="text-text-secondary">Full Lifetime Access</div>
                                    </div>
                                    <CourseInquiryDialog
                                        courseTitle={courseData.title}
                                        buttonClassName="w-full mb-4 bg-primary-600 hover:bg-primary-700 h-12 text-lg"
                                    />
                                    <div className="mt-6 space-y-3">
                                        <div className="flex items-center text-sm text-text-secondary">
                                            <Activity className="h-4 w-4 mr-2 text-primary-500" />
                                            <span>Level: Beginner to Advanced</span>
                                        </div>
                                        <div className="flex items-center text-sm text-text-secondary">
                                            <Clock className="h-4 w-4 mr-2 text-primary-500" />
                                            <span>Duration: 12 Weeks (Self-paced)</span>
                                        </div>
                                        <div className="flex items-center text-sm text-text-secondary">
                                            <Heart className="h-4 w-4 mr-2 text-primary-500" />
                                            <span>Focus: Physical & Mental Health</span>
                                        </div>
                                        <div className="flex items-center text-sm text-text-secondary">
                                            <CheckCircle className="h-4 w-4 mr-2 text-primary-500" />
                                            <span>Yoga Alliance Certified Curriculum</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Instructor / Studio */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Brought to you by</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center space-x-4 mb-4">
                                        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center overflow-hidden border-2 border-primary-100">
                                            <img src="/celoris-logo.png" alt="Celoris Academy" className="w-12 h-12 object-contain" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-text-primary">{courseData.provider}</h3>
                                            <p className="text-sm text-text-secondary">Yoga Alliance Certified</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-text-secondary mb-4 leading-relaxed">
                                        Bridging ancient wisdom with modern science to help you achieve holistic health and mental clarity in 2025.
                                    </p>
                                    <div className="space-y-3 text-sm text-text-secondary">
                                        <div className="flex items-center space-x-2">
                                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                            <span className="font-medium text-text-primary">{courseData.rating}</span>
                                            <span>({courseData.students} active students)</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Users className="h-4 w-4 text-primary-500" />
                                            <span>Join a global community</span>
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
