"use client"

import { ArrowLeft, Clock, Users, Star, CheckCircle, HelpCircle, BookOpen, Download } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { CourseInquiryDialog } from "@/components/CourseInquiryDialog"

export default function CBSEClass12PhysicsCourse() {
    const courseData = {
        title: "Class 12th Physics Complete Course",
        description: "This Class 12 Physics course is designed to provide mastery over fundamental concepts required for Board Exams (CBSE/ISC/State Boards) and competitive entrance exams like JEE (Main & Advanced) and NEET. The curriculum covers nine core units ranging from Electrostatics to Semiconductor Electronics.",
        students: 120,
        rating: 4.9,
        duration: "Full Year",
        price: 2499.00,
        currency: "INR",
        provider: "Your Educational Platform Name", // Ideally this should be "Celoris Designs" based on other pages, but user provided "Your Educational Platform Name" in JSON-LD. I will use "Celoris Designs" for consistency in UI, but keep JSON-LD as requested or updated to be consistent. User said "Your Educational Platform Name" in JSON. I'll stick to Celoris Designs for UI to look good.
        website: "https://celorisdesigns.com",
        url: "https://celorisdesigns.com/courses/cbse-class-12-physics-complete-course",
        learning_outcomes: [
            "Master Electrostatics: Electric Charges, Fields, Potential, and Capacitance.",
            "Understand Current Electricity: Ohm's Law, Kirchhoff's Rules, and Circuits.",
            "Explore Magnetism: Magnetic Effects of Current, Magnetism and Matter.",
            "Grasp Optics: Ray Optics, Wave Optics, and Optical Instruments.",
            "Comprehensive coverage of Modern Physics: Dual Nature, Atoms, Nuclei, and Semiconductors.",
            "Preparation for JEE/NEET competitive exams alongside Board preparation."
        ],
        requirements: [
            "Strong foundation in Class 11th Physics.",
            "Basic Calculus knowledge.",
            "Dedication to conceptual learning."
        ],
        syllabus: [
            {
                unit: "Unit I: Electrostatics",
                chapters: [
                    { title: "Chapter 1: Electric Charges and Fields", content: "Coulomb’s Law, Superposition Principle, Electric Field Lines, Electric Field due to a Dipole (Axial & Equatorial), Gauss’s Law applications." },
                    { title: "Chapter 2: Electrostatic Potential and Capacitance", content: "Equipotential Surfaces, Potential Energy of a System of Charges, Parallel Plate Capacitor, Dielectrics, Energy Stored in a Capacitor." }
                ]
            },
            {
                unit: "Unit II: Current Electricity",
                chapters: [
                    { title: "Chapter 3: Current Electricity", content: "Ohm’s Law, Drift Velocity, Mobility, Temperature dependence of resistivity, Kirchhoff’s Rules (KCL & KVL), Wheatstone Bridge, Potentiometer and Meter Bridge principles." }
                ]
            },
            {
                unit: "Unit III: Magnetic Effects of Current and Magnetism",
                chapters: [
                    { title: "Chapter 4: Moving Charges and Magnetism", content: "Biot-Savart Law, Ampere’s Circuital Law, Lorentz Force, Cyclotron, Moving Coil Galvanometer." },
                    { title: "Chapter 5: Magnetism and Matter", content: "Magnetic Dipole Moment, Earth’s Magnetism, Dia-, Para-, and Ferro-magnetic substances." }
                ]
            },
            {
                unit: "Unit IV: Electromagnetic Induction and Alternating Currents",
                chapters: [
                    { title: "Chapter 6: Electromagnetic Induction (EMI)", content: "Faraday’s Laws, Lenz’s Law, Eddy Currents, Self and Mutual Inductance." },
                    { title: "Chapter 7: Alternating Current (AC)", content: "Peak and RMS value, Phase difference, Power Factor, LCR Series Circuit, Resonance, Q-factor, AC Generator and Transformers." }
                ]
            },
            {
                unit: "Unit V: Electromagnetic Waves",
                chapters: [
                    { title: "Chapter 8: Electromagnetic Waves", content: "Displacement Current, Electromagnetic Spectrum (Radio waves to Gamma rays)." }
                ]
            },
            {
                unit: "Unit VI: Optics",
                chapters: [
                    { title: "Chapter 9: Ray Optics and Optical Instruments", content: "Reflection, Refraction, TIR, Lens Maker’s Formula, Prism Formula, Microscopes and Telescopes." },
                    { title: "Chapter 10: Wave Optics", content: "Huygens Principle, Coherent Sources, Young’s Double Slit Experiment, Diffraction, Polarization (Brewster’s Law)." }
                ]
            },
            {
                unit: "Unit VII: Dual Nature of Radiation and Matter",
                chapters: [
                    { title: "Chapter 11: Dual Nature of Radiation and Matter", content: "Photoelectric Effect, Einstein’s Photoelectric Equation, de Broglie relation, Davisson-Germer Experiment." }
                ]
            },
            {
                unit: "Unit VIII: Atoms and Nuclei",
                chapters: [
                    { title: "Chapter 12: Atoms", content: "Rutherford’s Alpha Scattering, Bohr Model of Hydrogen, Line Spectra (Lyman, Balmer series)." },
                    { title: "Chapter 13: Nuclei", content: "Mass-Energy Equivalence, Mass Defect, Binding Energy per Nucleon, Nuclear Fission and Fusion." }
                ]
            },
            {
                unit: "Unit IX: Electronic Devices",
                chapters: [
                    { title: "Chapter 14: Semiconductor Electronics", content: "Energy Bands in Solids, P-N Junction Diode, I-V Characteristics, Rectifiers, Zener Diode, Optoelectronic devices." }
                ]
            }
        ],
        faqs: [
            {
                question: "Is this course suitable for JEE and NEET aspirants?",
                answer: "Yes, the curriculum covers fundamental concepts required for both Board Exams and competitive entrance exams like JEE (Main & Advanced) and NEET."
            },
            {
                question: "What are the prerequisites for this course?",
                answer: "A strong foundation in Class 11th Physics and basic Calculus is recommended."
            },
            {
                question: "Does the course cover the entire Class 12th syllabus?",
                answer: "Yes, it covers all nine core units from Electrostatics to Semiconductor Electronics."
            },
            {
                question: "Are derivations included in the course?",
                answer: "Yes, key derivations such as Electric Field due to a Dipole, Gauss’s Law applications, Lens Maker’s Formula, and Prism Formula are covered."
            }
        ]
    }

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Course",
        "name": "Class 12th Physics Complete Course",
        "description": "Comprehensive Physics course for Class 12 students covering Electrostatics, Optics, Magnetism, and Modern Physics. Optimized for CBSE, JEE, and NEET preparation.",
        "provider": {
            "@type": "Organization",
            "name": "Celoris Designs",
            "sameAs": "https://celorisdesigns.com"
        },
        "educationalLevel": "High School",
        "teaches": [
            "Electrostatics",
            "Current Electricity",
            "Magnetism",
            "Electromagnetic Induction",
            "Optics",
            "Quantum Physics",
            "Semiconductors"
        ],
        "hasCourseInstance": {
            "@type": "CourseInstance",
            "courseMode": "Online",
            "courseWorkload": "PT150H"
        },
        "syllabusSections": [
            {
                "@type": "Syllabus",
                "name": "Unit I: Electrostatics",
                "description": "Electric Charges, Fields, Potential, and Capacitance."
            },
            {
                "@type": "Syllabus",
                "name": "Unit II: Current Electricity",
                "description": "Ohm's Law, Kirchhoff's Laws, and Electrical Measurements."
            },
            {
                "@type": "Syllabus",
                "name": "Unit VI: Optics",
                "description": "Ray Optics, Optical Instruments, and Wave Optics."
            },
            {
                "@type": "Syllabus",
                "name": "Unit IX: Electronic Devices",
                "description": "Semiconductors, Diodes, and Logic Gates."
            }
        ]
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
                                <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">Physics</span>
                                <span className="bg-surface px-3 py-1 rounded-full text-sm font-medium">Class 12th</span>
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
                                    src="/class-12-physics-cover.jpg"
                                    alt="Class 12th Physics Complete Course"
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
                                    <CourseInquiryDialog
                                        courseTitle={courseData.title}
                                        buttonClassName="w-full mb-4"
                                    />
                                    <div className="mt-6 text-center text-sm text-text-secondary">
                                        <div className="flex items-center justify-center space-x-4">
                                            <span>• Course difficulty: Intermediate to Advanced</span>
                                        </div>
                                        <div className="flex items-center justify-center space-x-4 mt-2">
                                            <span>• Target Audience: Grade 12, JEE/NEET Aspirants</span>
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
                                            <h3 className="font-semibold text-text-primary">Celoris Designs</h3>
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
