"use client"

import { ArrowLeft, Clock, Users, Star, CheckCircle, HelpCircle, BookOpen, Download } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { CourseInquiryDialog } from "@/components/CourseInquiryDialog"

export default function CBSEClass10ChemistryCourse() {
    const courseData = {
        title: "Class 10 Chemistry: Complete Course Syllabus",
        description: "This course is designed to cover the fundamental principles of chemical reactions, the nature of matter, and the periodic behavior of elements, aligning with standard international and national curricula (like CBSE, ICSE, or IGCSE).",
        students: 124,
        rating: 4.9,
        duration: "Full Year",
        price: 1999.00,
        currency: "INR",
        provider: "Celoris Designs llp",
        website: "https://celorisdesigns.com",
        url: "https://celorisdesigns.com/courses/cbse-class-10-chemistry-complete-course",
        learning_outcomes: [
            "Master the art of writing and balancing chemical equations.",
            "Understand the chemical properties of acids, bases, and salts including pH scale.",
            "Explore the physical and chemical behavior of metals and non-metals.",
            "Gain deep insights into the versatile nature of carbon and its compounds.",
            "Understand the logic behind the periodic classification of elements.",
            "Learn about redox reactions and their applications in daily life."
        ],
        requirements: [
            "Basic understanding of Class 9 Chemistry concepts.",
            "A desire to explore the building blocks of the universe.",
            "Basic mathematical skills for balancing equations."
        ],
        syllabus: [
            {
                unit: "Module 1: Chemical Reactions and Equations",
                focus: "Transformation of substances and their representation.",
                chapters: [
                    { title: "Chemical Equations", content: "Writing and balancing chemical equations; significance of a balanced equation." },
                    { title: "Types of Chemical Reactions", content: "Combination, Decomposition, Displacement, Double Displacement, Precipitation, and Neutralization." },
                    { title: "Oxidation and Reduction", content: "Understanding Redox reactions in terms of gain/loss of oxygen and electrons." },
                    { title: "Everyday Chemistry", content: "Corrosion and Rancidity—causes and prevention." }
                ]
            },
            {
                unit: "Module 2: Acids, Bases, and Salts",
                focus: "Chemical properties based on pH levels.",
                chapters: [
                    { title: "Nature of Substances", content: "Indicators (Natural and Synthetic), Olfactory indicators." },
                    { title: "Chemical Properties", content: "Reactions with metals, metal carbonates, and hydrogen carbonates." },
                    { title: "The pH Scale", content: "Concept of pH, its importance in daily life (digestive system, tooth decay, soil pH)." },
                    { title: "Common Salts", content: "Preparation and uses of Sodium Hydroxide, Bleaching Powder, Baking Soda, Washing Soda, and Plaster of Paris." }
                ]
            },
            {
                unit: "Module 3: Metals and Non-Metals",
                focus: "Physical and chemical behavior of elements.",
                chapters: [
                    { title: "Properties", content: "Physical and chemical properties of metals and non-metals." },
                    { title: "Reactivity Series", content: "Understanding the displacement of metals and the logic behind the series." },
                    { title: "Ionic Compounds", content: "Formation, properties, and high melting points." },
                    { title: "Metallurgy", content: "Extraction of metals, enrichment of ores, and refining." },
                    { title: "Prevention of Corrosion", content: "Galvanization, alloying, and painting." }
                ]
            },
            {
                unit: "Module 4: Carbon and its Compounds",
                focus: "Organic chemistry and the unique bonding nature of carbon.",
                chapters: [
                    { title: "Covalent Bonding", content: "Electron dot structures of ammonia, methane, and water." },
                    { title: "Versatile Nature of Carbon", content: "Catenation and tetravalency." },
                    { title: "Homologous Series", content: "Functional groups (Halogens, Alcohols, Ketones, Aldehydes, Alkanes, Alkenes, Alkynes)." },
                    { title: "Chemical Properties of Carbon", content: "Combustion, oxidation, addition, and substitution reactions." },
                    { title: "Ethanol and Ethanoic Acid", content: "Properties and industrial uses." },
                    { title: "Soaps and Detergents", content: "Micelle formation and cleansing action." }
                ]
            },
            {
                unit: "Module 5: Periodic Classification of Elements",
                focus: "History and logic behind the organization of elements.",
                chapters: [
                    { title: "Early Attempts", content: "Dobereiner’s Triads, Newlands’ Law of Octaves, Mendeleev’s Periodic Table." },
                    { title: "Modern Periodic Table", content: "Position of elements, groups, and periods." },
                    { title: "Periodic Trends", content: "Valency, Atomic size, Metallic and Non-metallic properties, and Electronegativity." }
                ]
            }
        ],
        faqs: [
            {
                question: "Is this course aligned with CBSE/ICSE curricula?",
                answer: "Yes, the course is specifically designed to align with Class 10 Board standards including CBSE, ICSE, and IGCSE."
            },
            {
                question: "Does it cover practical chemistry experiments?",
                answer: "The course covers the theoretical background and chemical equations for all standard Class 10 experiments."
            },
            {
                question: "How does it help with Board Exams?",
                answer: "It provides clear explanations, balanced equations, and focus on high-yield topics like Carbon Compounds and Periodic Trends."
            }
        ]
    }

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Course",
        "name": "Class 10 Chemistry Full Course",
        "description": "A comprehensive guide to Class 10 Chemistry covering chemical reactions, acids/bases, metals, carbon compounds, and periodic trends.",
        "provider": {
            "@type": "Organization",
            "name": "Celoris Designs llp"
        },
        "syllabusSections": [
            {
                "title": "Chemical Reactions and Equations",
                "topics": ["Balanced Equations", "Redox Reactions", "Corrosion"]
            },
            {
                "title": "Acids, Bases, and Salts",
                "topics": ["pH Scale", "Common Salts", "Indicators"]
            },
            {
                "title": "Metals and Non-Metals",
                "topics": ["Reactivity Series", "Ionic Bonding", "Metallurgy"]
            },
            {
                "title": "Carbon and its Compounds",
                "topics": ["Covalent Bonding", "Homologous Series", "Saponification"]
            },
            {
                "title": "Periodic Classification",
                "topics": ["Modern Periodic Law", "Atomic Size Trends", "Valency"]
            }
        ],
        "educationalLevel": "Secondary School (Class 10)",
        "keywords": ["Chemistry", "Class 10", "Syllabus", "Chemical Reactions", "Organic Chemistry"]
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
                                <span className="bg-surface px-3 py-1 rounded-full text-sm font-medium">Class 10</span>
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
                                    src="/class-10-chemistry-cover.jpg"
                                    alt="Class 10 Chemistry Full Course"
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
                                            <span>• Difficulty: Intermediate</span>
                                        </div>
                                        <div className="flex items-center justify-center space-x-4 mt-2">
                                            <span>• Target Audience: Class 10 Students</span>
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
                                        Providing state-of-the-art educational content for secondary school students worldwide.
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
