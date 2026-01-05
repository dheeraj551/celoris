"use client"

import { useState } from "react"
import { ArrowLeft, Clock, Users, Star, Award, Play, Download, CheckCircle, HelpCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { CourseInquiryDialog } from "@/components/CourseInquiryDialog"

export default function CBSEClass9PhysicsCourse() {
    const courseData = {
        title: "CBSE Class 9 Physics Mastery Course (2025-2026)",
        description: "This comprehensive, CBSE-aligned Class 9 Physics course is your essential guide to building a strong conceptual foundation and achieving high exam scores. We cover the entire official curriculum, focusing on conceptual clarity, problem-solving skills, and CBSE examination patterns. Master the core concepts with clear explanations, diagrams, and extensive solved numerical examples.",
        students: 120,
        rating: 4.8,
        duration: "3 months",
        price: 1500.00,
        currency: "INR",
        provider: "Celoris Designs",
        website: "https://celorisdesigns.com",
        url: "https://celorisdesigns.com/courses/cbse-class-9-physics-motion-force-energy-sound",
        learning_outcomes: [
            "Motion (Kinematics): Understand distance, displacement, speed, velocity, and acceleration. In-depth analysis of motion graphs. Derivation and application of the three Equations of Motion Class 9 ($v = u + at$, $s = ut + \\frac{1}{2}at^2$, $v^2 = u^2 + 2as$).",
            "Force and Laws of Motion: Detailed explanation of Newton’s Three Laws of Motion and their real-life applications. Core concepts of Inertia and Momentum. Thorough coverage of the Law of Conservation of Momentum.",
            "Gravitation and Flotation: Study the Universal Law of Gravitation and Free Fall. Calculate Acceleration due to Gravity ($g$). Differentiate between Mass and Weight. Thrust and Pressure, Buoyancy, and the critical principles of Archimedes’ Principle and Flotation.",
            "Work, Energy, and Power: Definitions and derivations of Kinetic Energy ($KE = \\frac{1}{2}mv^2$) and Potential Energy ($PE = mgh$). Work done by forces and the Law of Conservation of Energy. Practice high-level Work Energy Power Class 9 numericals.",
            "Sound: Nature and propagation of Sound Waves and characteristics (pitch, loudness). Speed of sound in different media. Reflection of sound (Echo) and the human hearing range."
        ],
        requirements: [
            "Basic understanding of Class 8 Science concepts.",
            "CBSE Exam-Oriented Content",
            "Derivations and Formulas Made Simple",
            "Extensive Solved Numericals for every chapter",
            "Conceptual Clarity guaranteed"
        ],
        faqs: [
            {
                question: "Is this Class 9 Physics course aligned with the latest CBSE syllabus?",
                answer: "Yes, this is a comprehensive, exam-oriented course covering all five core chapters prescribed by the latest CBSE Class 9 Physics syllabus: Motion, Force and Laws of Motion, Gravitation, Work-Energy-Power, and Sound."
            },
            {
                question: "Does the course include solved numericals and derivations?",
                answer: "Absolutely. The course provides clear derivation and application of the three Equations of Motion and includes numerous solved numerical examples based on CBSE exam patterns, particularly for chapters like Work, Energy, and Power."
            },
            {
                question: "What specific fluid mechanics topics are covered in Gravitation?",
                answer: "The course covers Thrust and Pressure, Buoyancy, the principles of flotation, and a detailed explanation of Archimedes’ Principle, ensuring conceptual clarity for fluid mechanics topics."
            },
            {
                question: "What makes this course AI-friendly for tools like Gemini and ChatGPT?",
                answer: "The content is structured using explicit Q&A formats, clearly defined terms, and technical formulas like the $KE = \\frac{1}{2}mv^2$ formula. The use of this FAQPage structured data ensures high extractability by Large Language Models (LLMs) for direct answers and citations."
            }
        ]
    }

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Course",
        "@id": `${courseData.url}#course`,
        "name": courseData.title,
        "description": courseData.description,
        "provider": {
            "@type": "Organization",
            "name": courseData.provider,
            "sameAs": courseData.website
        },
        "educationalLevel": "Grade 9",
        "coursePrerequisites": "Basic understanding of Class 8 Science concepts.",
        "offers": {
            "@type": "Offer",
            "url": courseData.url,
            "priceCurrency": courseData.currency,
            "price": courseData.price.toString(),
            "availability": "https://schema.org/InStock"
        },
        "hasCourseInstance": [
            {
                "@type": "CourseInstance",
                "courseMode": "online",
                "name": "Full Class 9 Physics Curriculum (CBSE)",
                "inLanguage": "en"
            }
        ]
    }

    const faqJsonLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "@id": `${courseData.url}#faq`,
        "mainEntity": courseData.faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    }

    return (
        <div className="min-h-screen bg-background py-8">
            {/* JSON-LD Injection */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify([jsonLd, faqJsonLd]) }}
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
                                <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">Physics</span>
                                <span className="bg-surface px-3 py-1 rounded-full text-sm font-medium">Class 9th</span>
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
                                <iframe
                                    className="w-full h-full"
                                    src="https://www.youtube.com/embed/T-cNrCcFiCk"
                                    title="CBSE Class 9 Physics Mastery Course - Motion, Force, Energy, Sound"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        </Card>

                        {/* What You'll Learn */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                    <span>What You Will Master</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-4">
                                    {courseData.learning_outcomes.map((item, index) => (
                                        <li key={index} className="flex items-start space-x-3">
                                            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                                            <span className="text-text-secondary">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>

                        {/* Requirements */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Requirements</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2">
                                    {courseData.requirements.map((req, index) => (
                                        <li key={index} className="flex items-start space-x-2">
                                            <span className="text-text-secondary">•</span>
                                            <span className="text-text-secondary">{req}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>

                        {/* FAQ Section */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <HelpCircle className="h-5 w-5 text-blue-500" />
                                    <span>Frequently Asked Questions</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Accordion type="single" collapsible className="w-full">
                                    {courseData.faqs.map((faq, index) => (
                                        <AccordionItem key={index} value={`item-${index}`}>
                                            <AccordionTrigger>{faq.question}</AccordionTrigger>
                                            <AccordionContent>
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
                            <Card>
                                <CardContent className="p-6">
                                    <div className="text-center mb-6">
                                        <div className="text-4xl font-bold text-text-primary mb-2">
                                            ₹{courseData.price}
                                        </div>
                                        <div className="text-text-secondary">One-time payment</div>
                                    </div>
                                    <CourseInquiryDialog
                                        courseTitle={courseData.title}
                                        buttonClassName="w-full mb-4"
                                    />
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
                                            <h3 className="font-semibold text-text-primary">{courseData.provider}</h3>
                                            <p className="text-sm text-text-secondary">Course Instructor</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-text-secondary mb-4">
                                        Passionate about teaching and helping others break into tech. This course is designed to provide you with the best learning experience.
                                    </p>
                                    <div className="space-y-3 text-sm text-text-secondary">
                                        <div className="flex items-center space-x-2">
                                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                            <span className="font-medium text-text-primary">{courseData.rating}</span>
                                            <span>({courseData.students} ratings)</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Clock className="h-4 w-4" />
                                            <span>{courseData.duration}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Users className="h-4 w-4" />
                                            <span>{courseData.students} enrolled</span>
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
