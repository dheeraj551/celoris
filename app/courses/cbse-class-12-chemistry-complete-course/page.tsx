"use client"

import { ArrowLeft, Clock, Users, Star, CheckCircle, HelpCircle, BookOpen, Download } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { CourseInquiryDialog } from "@/components/CourseInquiryDialog"
import { AdUnit } from "@/components/AdUnit"

export default function Class12ChemistryCourse() {
    const courseData = {
        title: "Class 12 Chemistry: Advanced Applications & Organic Synthesis",
        description: "This course provides an in-depth exploration of Physical, Inorganic, and Organic Chemistry, with a heavy emphasis on reaction kinetics and functional group transformations.",
        students: 185,
        rating: 4.9,
        duration: "Full Year",
        price: 2999.00,
        currency: "INR",
        provider: "Celoris Designs llp",
        website: "https://celorisdesigns.com",
        url: "https://celorisdesigns.com/courses/cbse-class-12-chemistry-complete-course",
        learning_outcomes: [
            "Master the Nernst Equation and Electrochemistry cell reactions.",
            "Understand Raoult's Law and Colligative Properties in solutions.",
            "Analyze Chemical Kinetics, rate equations, and Activation Energy.",
            "Explore d & f Block elements and Coordination Compounds.",
            "Master SN1 and SN2 reaction mechanisms in Organic Chemistry.",
            "Grasp Aldol Condensation, Cannizzaro reactions, and synthetic pathways.",
            "Understand Biomolecules, Polymers, and Chemistry in everyday life."
        ],
        requirements: [
            "Strong foundation in Class 11 Chemistry.",
            "Basic understanding of Thermodynamics and Equilibrium.",
            "Interest in advanced Organic and Physical chemistry."
        ],
        syllabus: [
            {
                unit: "Module 1: Physical Chemistry – Solutions & Kinetics",
                focus: "Understanding how substances interact in phases and the speed of molecular changes.",
                chapters: [
                    { title: "Solutions", content: "Types of solutions, Raoult's Law, ideal and non-ideal solutions, and Colligative Properties (osmotic pressure, boiling point elevation)." },
                    { title: "Electrochemistry", content: "Redox reactions in cells, Nernst Equation, Gibbs energy of cell reaction, and fuel cells." },
                    { title: "Chemical Kinetics", content: "Rate of reaction, factors affecting rates, integrated rate equations (zero and first-order reactions), and Activation Energy (Arrhenius Equation)." }
                ]
            },
            {
                unit: "Module 2: Inorganic Chemistry – Elements & Coordination",
                focus: "Exploring the behavior of complex metals and transition elements.",
                chapters: [
                    { title: "d and f Block Elements", content: "General properties, lanthanoids, and actinoids." },
                    { title: "Coordination Compounds", content: "Werner's theory, Ligands, IUPAC nomenclature, and Crystal Field Theory (CFT)." }
                ]
            },
            {
                unit: "Module 3: Organic Chemistry – Functional Groups",
                focus: "The study of complex organic molecules and their synthetic pathways.",
                chapters: [
                    { title: "Haloalkanes and Haloarenes", content: "Nature of C-X bond, SN1 and SN2 mechanisms." },
                    { title: "Alcohols, Phenols, and Ethers", content: "Dehydration of alcohols, acidity of phenols, and Williamson synthesis." },
                    { title: "Aldehydes, Ketones, and Carboxylic Acids", content: "Nucleophilic addition, Aldol condensation, and Cannizzaro reaction." },
                    { title: "Amines", content: "Basicity of amines, Gabriel phthalimide synthesis, and Diazonium salts." }
                ]
            },
            {
                unit: "Module 4: Biomolecules & Chemistry in Everyday Life",
                focus: "The intersection of chemistry with biology and modern industry.",
                chapters: [
                    { title: "Biomolecules", content: "Structure of Carbohydrates (Glucose/Fructose), Proteins (Amino acids), and Nucleic Acids (DNA/RNA)." },
                    { title: "Polymers", content: "Classification, Addition and Condensation polymerization (Nylon, Polyester, Bakelite)." }
                ]
            }
        ],
        faqs: [
            {
                question: "Is this course sufficient for CBSE Board Exams?",
                answer: "Yes, this course is fully aligned with the latest CBSE Class 12 Chemistry syllabus and covers every topic in detail with a focus on board exams."
            },
            {
                question: "Does it cover JEE and NEET level concepts?",
                answer: "While the focus is on the board curriculum, we include advanced mechanisms and numerical problems essential for competitive exams like JEE and NEET."
            },
            {
                question: "Are practicals covered in this course?",
                answer: "We explain the theory behind major practicals (Titration, Salt Analysis) to help you excel in your practical examinations."
            }
        ]
    }

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Course",
        "name": "Class 12 Chemistry: Advanced Mastery",
        "description": "Comprehensive Class 12 Chemistry curriculum focusing on Electrochemistry, Coordination Compounds, and Advanced Organic Reaction Mechanisms.",
        "provider": {
            "@type": "Organization",
            "name": "Celoris Designs llp"
        },
        "syllabusSections": [
            {
                "title": "Physical Chemistry",
                "topics": ["Nernst Equation", "Colligative Properties", "Chemical Kinetics"]
            },
            {
                "title": "Inorganic Chemistry",
                "topics": ["d-Block Elements", "Coordination Chemistry", "Crystal Field Theory"]
            },
            {
                "title": "Organic Chemistry",
                "topics": ["SN1 and SN2 Mechanisms", "Aldol Condensation", "Biomolecules"]
            }
        ],
        "educationalLevel": "Senior Secondary (Class 12)",
        "keywords": ["Class 12 Chemistry", "Electrochemistry", "Coordination Compounds", "Organic Mechanisms", "Biomolecules"]
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
                                <span className="bg-surface px-3 py-1 rounded-full text-sm font-medium">Class 12</span>
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
                                    src="/class-12-chemistry-cover.jpg"
                                    alt="Class 12 Chemistry: Advanced Applications & Organic Synthesis"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </Card>

                        <AdUnit slot="9266909448" />

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
                                            <span>• Target Audience: Class 12 Students</span>
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
