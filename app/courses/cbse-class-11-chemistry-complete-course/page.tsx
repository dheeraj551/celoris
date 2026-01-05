"use client"

import { ArrowLeft, Clock, Users, Star, CheckCircle, HelpCircle, BookOpen, Download } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { CourseInquiryDialog } from "@/components/CourseInquiryDialog"

export default function Class11ChemistryCourse() {
    const courseData = {
        title: "Class 11 Chemistry: The Foundation of Chemical Sciences",
        description: "This course bridges the gap between basic concepts and advanced chemical theories, focusing on Physical, Inorganic, and Organic Chemistry. Building on the previous structure, Class 11 Chemistry shifts from general observations to the quantitative and theoretical foundations of the science.",
        students: 245,
        rating: 4.8,
        duration: "Full Year",
        price: 2499.00,
        currency: "INR",
        provider: "Celoris Designs llp",
        website: "https://celorisdesigns.com",
        url: "https://celorisdesigns.com/courses/cbse-class-11-chemistry-complete-course",
        learning_outcomes: [
            "Master the Mole concept, molar mass, and stoichiometric calculations.",
            "Understand the Quantum Mechanical model of the atom and electronic configurations.",
            "Analyze periodic trends and modern bonding theories (VBT, MOT).",
            "Explore Thermodynamics and the spontaneity of chemical reactions.",
            "Determine Equilibrium constants and apply Le Chatelier’s Principle.",
            "Grasp the fundamentals of Organic Chemistry, nomenclature, and reaction mechanisms."
        ],
        requirements: [
            "Strong foundation in Class 10 Science (Chemistry).",
            "Proficiency in basic Algebraic calculations.",
            "Interest in theoretical and quantitative aspects of science."
        ],
        syllabus: [
            {
                unit: "Module 1: Theoretical Foundations & Atomic Structure",
                focus: "The quantitative 'rules' of chemistry and the internal map of the atom.",
                chapters: [
                    { title: "Some Basic Concepts", content: "The Mole concept, molar mass, stoichiometry, and limiting reagents." },
                    { title: "Structure of Atom", content: "Discovery of subatomic particles, Bohr’s model, dual nature of matter (de Broglie), and the Heisenberg Uncertainty Principle." },
                    { title: "Quantum Mechanics", content: "Quantum numbers, shapes of s, p, d, f orbitals, and electronic configuration (Aufbau, Pauli, and Hund’s Rule)." }
                ]
            },
            {
                unit: "Module 2: Periodicity & Chemical Bonding",
                focus: "How atoms organize and stick together to form the universe.",
                chapters: [
                    { title: "Classification of Elements", content: "Modern Periodic Law, periodic trends in atomic radii, ionization enthalpy, and electronegativity." },
                    { title: "Chemical Bonding", content: "Ionic vs. Covalent bonds, Lewis structures, and VSEPR theory (predicting molecular shapes)." },
                    { title: "Advanced Bonding Theories", content: "Valence Bond Theory, Hybridization (sp, sp^2, sp^3, sp^3d), and Molecular Orbital Theory (MOT)." }
                ]
            },
            {
                unit: "Module 3: Energetics & Equilibrium",
                focus: "The 'Why' and 'How Far' of chemical reactions.",
                chapters: [
                    { title: "Thermodynamics", content: "System and surroundings, First Law (ΔU and ΔH), Hess’s Law, and Spontaneity (Gibbs Free Energy ΔG)." },
                    { title: "Chemical Equilibrium", content: "Law of Mass Action, Equilibrium Constant (Kc, Kp), and Le Chatelier’s Principle." },
                    { title: "Ionic Equilibrium", content: "Acids and Bases (Brønsted-Lowry & Lewis), pH scale, Buffer solutions, and Solubility Product (Ksp)." }
                ]
            },
            {
                unit: "Module 4: Organic Chemistry Basics & Hydrocarbons",
                focus: "The gateway to the chemistry of life.",
                chapters: [
                    { title: "Basic Principles", content: "IUPAC nomenclature, isomerism, and electronic displacements (Inductive, Electromeric, Resonance, and Hyperconjugation)." },
                    { title: "Reaction Mechanisms", content: "Homolytic and heterolytic fission; Electrophiles and Nucleophiles." },
                    { title: "Hydrocarbons", content: "Preparation and properties of Alkanes (conformations), Alkenes (Geometrical isomerism), Alkynes, and Aromatic Hydrocarbons (Benzene & Aromaticity)." }
                ]
            }
        ],
        faqs: [
            {
                question: "Is this course suitable for JEE and NEET preparation?",
                answer: "Absolutely. This course covers the fundamental concepts required for competitive exams like JEE, NEET, IB, and AP programs."
            },
            {
                question: "Do I need to have a strong background in Math?",
                answer: "Basic algebra and comfort with numbers are needed for the Physical Chemistry sections like the Mole Concept and Thermodynamics."
            },
            {
                question: "Will this course cover Organic reaction mechanisms?",
                answer: "Yes, we go into detail about inductive effects, resonance, and how different types of reactions occur at a molecular level."
            }
        ]
    }

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Course",
        "name": "Class 11 Chemistry: Mastery Course",
        "description": "An advanced foundation in Physical, Inorganic, and Organic chemistry, covering Quantum Mechanics, Thermodynamics, and Chemical Bonding.",
        "provider": {
            "@type": "Organization",
            "name": "Celoris designs llp"
        },
        "syllabusSections": [
            {
                "title": "Physical Chemistry",
                "topics": ["Mole Concept", "Atomic Structure", "Thermodynamics", "Equilibrium"]
            },
            {
                "title": "Inorganic Chemistry",
                "topics": ["Periodic Trends", "Chemical Bonding", "Redox Reactions"]
            },
            {
                "title": "Organic Chemistry",
                "topics": ["IUPAC Nomenclature", "Reaction Mechanisms", "Hydrocarbons"]
            }
        ],
        "educationalLevel": "Higher Secondary (Class 11)",
        "keywords": ["Class 11 Chemistry", "Mole Concept", "Thermodynamics", "Organic Chemistry Basics", "Quantum Numbers"]
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
                                <span className="bg-surface px-3 py-1 rounded-full text-sm font-medium">Class 11</span>
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
                                    src="/class-11-chemistry-cover.jpg"
                                    alt="Class 11 Chemistry: The Foundation of Chemical Sciences"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </Card>

                        {/* Core Focus Areas */}
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
                                    <CourseInquiryDialog
                                        courseTitle={courseData.title}
                                        buttonClassName="w-full mb-4"
                                    />
                                    <div className="mt-6 text-center text-sm text-text-secondary">
                                        <div className="flex items-center justify-center space-x-4">
                                            <span>• Difficulty: Advanced</span>
                                        </div>
                                        <div className="flex items-center justify-center space-x-4 mt-2">
                                            <span>• Target Audience: Class 11 Students</span>
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
                                            <img src="/celoris-logo.png" alt="Celoris Designs llp" className="w-12 h-12 object-contain" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-text-primary">Celoris Designs llp</h3>
                                            <p className="text-sm text-text-secondary">Course Provider</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-text-secondary mb-4">
                                        Providing state-of-the-art educational content for higher secondary school students worldwide.
                                    </p>
                                    <div className="space-y-3 text-sm text-text-secondary">
                                        <div className="flex items-center space-x-2">
                                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                            <span className="font-medium text-text-primary">{courseData.rating}</span>
                                            <span>({courseData.students} reviews)</span>
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
