"use client"

import { useState } from "react"
import { ArrowLeft, Clock, Users, Star, Award, Play, Download, CheckCircle, HelpCircle, BookOpen } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function CBSEClass11PhysicsCourse() {
    const courseData = {
        title: "Class 11 Physics: Comprehensive Course Syllabus (2025-26)",
        description: "This course is designed to provide a conceptual foundation for board exams and competitive tests like JEE and NEET. It covers the entire official curriculum with a core focus on Classical Mechanics, Thermodynamics, and Oscillatory Motion.",
        students: 85,
        rating: 4.9,
        duration: "Full Year",
        price: 2499.00,
        currency: "INR",
        provider: "Celoris Designs",
        website: "https://celorisdesigns.com",
        url: "https://celorisdesigns.com/courses/cbse-class-11-physics-comprehensive-course",
        learning_outcomes: [
            "Master Classical Mechanics: Laws of Motion, Work, Energy, Power, and Rotational Motion.",
            "Understand Thermodynamics: Laws of Thermodynamics, Heat Engines, and Kinetic Theory of Gases.",
            "Explore Oscillations and Waves: SHM, Wave Motion, and Doppler Effect.",
            "Grasp Gravitation and Properties of Matter: Planetary Motion, Solids and Fluids mechanics.",
            "Build strong foundation for JEE/NEET competitive exams."
        ],
        requirements: [
            "Class 10th Pass with Science stream.",
            "Strong grasp of basic mathematics (Algebra, Trigonometry).",
            "Dedication to conceptual learning."
        ],
        syllabus: [
            {
                unit: "Unit 1: Physical World and Measurement",
                chapters: [
                    { title: "Units and Measurements", content: "The international system of units (SI), fundamental vs. derived units, and significant figures." },
                    { title: "Dimensional Analysis", content: "Dimensions of physical quantities, dimensional formulae, and their applications in checking the accuracy of equations." }
                ]
            },
            {
                unit: "Unit 2: Kinematics",
                chapters: [
                    { title: "Motion in a Straight Line", content: "Frame of reference, position-time graphs, instantaneous velocity, and kinematic equations for uniformly accelerated motion." },
                    { title: "Motion in a Plane", content: "Scalar and vector quantities, resolution of vectors, projectile motion, and uniform circular motion." }
                ]
            },
            {
                unit: "Unit 3: Laws of Motion",
                chapters: [
                    { title: "Newton’s Laws", content: "Inertia, Newton’s first, second, and third laws of motion, and the concept of impulse." },
                    { title: "Dynamics of Friction", content: "Static and kinetic friction, laws of friction, and lubrication." },
                    { title: "Circular Motion Dynamics", content: "Centripetal force and motion on banked roads." }
                ]
            },
            {
                unit: "Unit 4: Work, Energy, and Power",
                chapters: [
                    { title: "Work-Energy Theorem", content: "Work done by constant and variable forces, kinetic energy, and potential energy of a spring." },
                    { title: "Collisions", content: "Elastic and inelastic collisions in one and two dimensions." }
                ]
            },
            {
                unit: "Unit 5: System of Particles and Rotational Motion",
                chapters: [
                    { title: "Rigid Body Dynamics", content: "Centre of mass, torque, angular momentum, and conservation of angular momentum." },
                    { title: "Moment of Inertia", content: "Radius of gyration and values for simple geometrical objects." }
                ]
            },
            {
                unit: "Unit 6: Gravitation",
                chapters: [
                    { title: "Planetary Motion", content: "Kepler’s laws and Newton’s universal law of gravitation." },
                    { title: "Satellites", content: "Escape speed, orbital velocity, and geostationary satellites." }
                ]
            },
            {
                unit: "Unit 7: Properties of Bulk Matter",
                chapters: [
                    { title: "Solids", content: "Stress-strain relationship, Hooke’s law, and Young’s modulus." },
                    { title: "Fluids", content: "Pascal’s law, Bernoulli’s theorem, viscosity, and surface tension." },
                    { title: "Thermal Properties", content: "Specific heat capacity, calorimetry, and Newton's law of cooling." }
                ]
            },
            {
                unit: "Unit 8: Thermodynamics",
                chapters: [
                    { title: "Laws of Thermodynamics", content: "Zeroth law (temperature), First law (internal energy), and Second law (entropy)." },
                    { title: "Heat Engines", content: "Reversible/irreversible processes and the Carnot engine." }
                ]
            },
            {
                unit: "Unit 9: Kinetic Theory of Gases",
                chapters: [
                    { title: "Gas Laws", content: "Equation of state of a perfect gas and assumptions of kinetic theory." },
                    { title: "Degrees of Freedom", content: "Law of equipartition of energy and mean free path." }
                ]
            },
            {
                unit: "Unit 10: Oscillations and Waves",
                chapters: [
                    { title: "Simple Harmonic Motion (SHM)", content: "Energy in SHM, simple pendulum, and force constants." },
                    { title: "Wave Motion", content: "Longitudinal and transverse waves, superposition principle, beats, and the Doppler effect." }
                ]
            }
        ],
        faqs: [
            {
                question: "What are the most important chapters in Class 11 Physics?",
                answer: "The most critical units for both board exams and competitive exams (JEE/NEET) are Mechanics (Units 2-5), Thermodynamics (Unit 8), and Oscillations and Waves (Unit 10). A strong foundation in these areas is essential."
            },
            {
                question: "Is this course suitable for JEE and NEET preparation?",
                answer: "Yes, this course is designed with a 'Intermediate to Advanced' difficulty level, focusing on building the conceptual foundation required for competitive tests like JEE and NEET, in addition to board exams."
            },
            {
                question: "What is the core focus of this syllabus?",
                answer: "The core focus areas are Classical Mechanics, Thermodynamics, and Oscillatory Motion, which are fundamental to understanding advanced physics concepts."
            },
            {
                question: "Does this course cover the latest 2025-26 syllabus?",
                answer: "Absolutely. The course content is fully aligned with the Class 11 Physics Comprehensive Course Syllabus for the academic year 2025-26."
            }
        ]
    }

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Course",
        "name": "Class 11 Physics Comprehensive Course",
        "description": "A complete guide to Class 11 Physics covering Mechanics, Thermodynamics, and Waves based on the 2025-26 NCERT/CBSE syllabus.",
        "provider": {
            "@type": "Organization",
            "name": "Celoris Designs",
            "sameAs": "https://celorisdesigns.com"
        },
        "courseCode": "PHY11",
        "educationalLevel": "Higher Secondary",
        "syllabusSections": [
            {
                "@type": "Syllabus",
                "name": "Kinematics",
                "description": "Covers motion in one and two dimensions including vectors and projectile motion."
            },
            {
                "@type": "Syllabus",
                "name": "Thermodynamics",
                "description": "Deep dive into heat, work, internal energy, and the laws governing thermal systems."
            },
            {
                "@type": "Syllabus",
                "name": "Mechanics",
                "description": "Newton's Laws, Work-Energy, and Gravitation."
            }
        ]
    }

    const faqJsonLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
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
                                <span className="bg-surface px-3 py-1 rounded-full text-sm font-medium">Class 11th</span>
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
                                    src="/class-11-physics-cover.jpg"
                                    alt="Class 11 Physics Comprehensive Course Syllabus"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </Card>

                        {/* What You'll Learn */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                    <span>Core Focus Areas</span>
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

                        {/* Detailed Syllabus - Optimized for SEO */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <BookOpen className="h-5 w-5 text-purple-500" />
                                    <span>Comprehensive Syllabus</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {courseData.syllabus.map((unit, index) => (
                                    <div key={index} className="border-b last:border-0 pb-4 last:pb-0">
                                        <h2 className="text-xl font-bold text-text-primary mb-3 text-primary-700">{unit.unit}</h2>
                                        <div className="space-y-3 pl-4">
                                            {unit.chapters.map((chapter, cIndex) => (
                                                <div key={cIndex}>
                                                    <h3 className="text-md font-semibold text-text-primary mb-1">{chapter.title}</h3>
                                                    <p className="text-sm text-text-secondary">{chapter.content}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
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
                                    <Button className="w-full mb-4" size="lg">
                                        Enroll Now
                                    </Button>
                                    <Button variant="outline" className="w-full">
                                        <Download className="mr-2 h-4 w-4" />
                                        Download Syllabus
                                    </Button>
                                    <div className="mt-6 text-center text-sm text-text-secondary">
                                        <div className="flex items-center justify-center space-x-4">
                                            <span>• Course difficulty: Intermediate to Advanced</span>
                                        </div>
                                        <div className="flex items-center justify-center space-x-4 mt-2">
                                            <span>• Target Audience: Science Stream</span>
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
                                        Expert faculty dedicated to providing a deep conceptual understanding of Physics for Board and Competitive exams.
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
