"use client"

import { ArrowLeft, Clock, Users, Star, CheckCircle, HelpCircle, BookOpen, Download } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function CBSEClass9ChemistryCourse() {
    const courseData = {
        title: "Class 9 Chemistry: Complete Course Overview",
        description: "This curriculum is designed to build a foundational understanding of matter, atoms, and chemical reactions, preparing students for advanced sciences.",
        students: 85,
        rating: 4.8,
        duration: "Full Year",
        price: 1999.00,
        currency: "INR",
        provider: "Celoris Designs",
        website: "https://celorisdesigns.com",
        url: "https://celorisdesigns.com/courses/cbse-class-9-chemistry-complete-course",
        learning_outcomes: [
            "Understand the physical nature of matter and phase changes.",
            "Differentiate between pure substances and mixtures.",
            "Master separation techniques like chromatography and distillation.",
            "Learn the laws of chemical combination and Dalton's Atomic Theory.",
            "Grasp the Mole Concept and Atomic Mass.",
            "Explore the structure of the atom and subatomic particles."
        ],
        requirements: [
            "Basic understanding of science from Class 8.",
            "Interest in experiments and chemical phenomena.",
            "Regular revision of concepts."
        ],
        syllabus: [
            {
                unit: "Unit 1: Matter in Our Surroundings",
                focus: "Physical nature of matter and state changes.",
                chapters: [
                    { title: "Definition of Matter", content: "Anything that occupies space and has mass." },
                    { title: "States of Matter", content: "Solid, liquid, and gas." },
                    { title: "Phase Changes", content: "Melting point, boiling point, sublimation, and latent heat." },
                    { title: "Evaporation", content: "Factors affecting evaporation and its cooling effect." }
                ]
            },
            {
                unit: "Unit 2: Is Matter Around Us Pure?",
                focus: "Classification of matter and separation techniques.",
                chapters: [
                    { title: "Pure Substances vs. Mixtures", content: "Elements, compounds, homogeneous, and heterogeneous mixtures." },
                    { title: "Solutions", content: "Concentration of a solution, saturated vs. unsaturated, and solubility." },
                    { title: "Separation Techniques", content: "Evaporation, centrifugation, chromatography, and distillation." },
                    { title: "Physical vs. Chemical Changes", content: "Identifying reversible vs. irreversible transformations." }
                ]
            },
            {
                unit: "Unit 3: Atoms and Molecules",
                focus: "The building blocks of chemistry.",
                chapters: [
                    { title: "Laws of Chemical Combination", content: "Law of Conservation of Mass and Law of Constant Proportions." },
                    { title: "Dalton’s Atomic Theory", content: "Postulates and limitations." },
                    { title: "Atomic Mass", content: "Relative atomic mass and unified mass unit (u)." },
                    { title: "Mole Concept", content: "Relationship between moles, Avogadro’s number (6.022 × 10²³), and molar mass." }
                ]
            },
            {
                unit: "Unit 4: Structure of the Atom",
                focus: "Subatomic particles and atomic models.",
                chapters: [
                    { title: "Discovery of Particles", content: "Electrons (J.J. Thomson), Protons (E. Goldstein), and Neutrons (James Chadwick)." },
                    { title: "Atomic Models", content: "Thomson’s Plum Pudding, Rutherford’s Gold Foil Experiment, and Bohr’s Model." },
                    { title: "Valency", content: "Electronic configuration (2n² rule) and combining capacity." },
                    { title: "Isotopes and Isobars", content: "Applications of isotopes in medicine and nuclear energy." }
                ]
            }
        ],
        faqs: [
            {
                question: "What is the main focus of Class 9 Chemistry?",
                answer: "The focus is on building a strong foundation in matter, atoms, molecules, and chemical structure."
            },
            {
                question: "Is the Mole Concept covered in detail?",
                answer: "Yes, the course covers the Mole Concept extensively, including calculations and its relationship with Avogadro's number."
            },
            {
                question: "Does this course help in competitive exams?",
                answer: "Absolutely. Ideally suited for building the base required for JEE, NEET, and Olympiads."
            }
        ]
    }

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Course",
        "name": "Class 9 Chemistry Comprehensive Course",
        "description": "A complete guide to Class 9 Chemistry covering Matter, Atoms, Molecules, and Atomic Structure based on NCERT and CBSE standards.",
        "provider": {
            "@type": "Organization",
            "name": "Celoris Designs",
            "sameAs": "https://celorisdesigns.com"
        },
        "courseCode": "CHEM9",
        "educationalLevel": "Grade 9",
        "hasPart": [
            {
                "@type": "CourseInstance",
                "name": "Unit 1: Matter in Our Surroundings",
                "description": "Exploration of physical states of matter and phase changes."
            },
            {
                "@type": "CourseInstance",
                "name": "Unit 3: Atoms and Molecules",
                "description": "Understanding chemical laws, atomic mass, and the mole concept."
            }
        ],
        "keywords": "Class 9 Chemistry, NCERT Chemistry, Mole Concept, Atomic Structure, CBSE Syllabus 2025"
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
                                <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">Chemistry</span>
                                <span className="bg-surface px-3 py-1 rounded-full text-sm font-medium">Class 9</span>
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
                                    src="/class-9-chemistry-cover.jpg"
                                    alt="Class 9 Chemistry Complete Course"
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
                                        <h2 className="text-xl font-bold text-text-primary mb-2 text-primary-700">{unit.unit}</h2>
                                        <p className="text-sm font-medium text-text-secondary mb-3 italic">{unit.focus}</p>
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
                                            <span>• Difficulty: Beginner to Intermediate</span>
                                        </div>
                                        <div className="flex items-center justify-center space-x-4 mt-2">
                                            <span>• Target Audience: Class 9 Students</span>
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
                                        Expert faculty dedicated to providing a deep conceptual understanding of Chemistry for Board exams.
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
