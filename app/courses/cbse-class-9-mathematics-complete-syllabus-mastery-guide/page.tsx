"use client"

import { ArrowLeft, Clock, Users, Star, CheckCircle, HelpCircle, BookOpen, Download } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { CourseInquiryDialog } from "@/components/CourseInquiryDialog"

export default function CBSEClass9MathematicsCourse() {
    const courseData = {
        title: "Class 9th Mathematics: Complete Syllabus & Mastery Guide",
        description: "This Class 9 Maths Course follows the latest NCERT/CBSE guidelines, providing a solid foundation for Class 10th Boards and competitive exams like NTSE and Olympiads.",
        students: 150,
        rating: 4.8,
        duration: "Full Year",
        price: 1999.00,
        currency: "INR",
        provider: "Celoris Designs llp",
        website: "https://celorisdesigns.com",
        url: "https://celorisdesigns.com/courses/cbse-class-9-mathematics-complete-syllabus-mastery-guide",
        learning_outcomes: [
            "Master Number Systems: Rational/Irrational numbers, Laws of exponents.",
            "Strong foundation in Algebra: Polynomials and Linear Equations in two variables.",
            "Excel in Geometry: Lines, Angles, Triangles, Quadrilaterals, and Circles.",
            "Understand Coordinate Geometry: Cartesian plane and coordinates.",
            "Master Mensuration: Heron’s Formula and Surface Areas and Volumes.",
            "Learn Statistics: Collection and presentation of data (Bar graphs, Histograms)."
        ],
        requirements: [
            "Basic understanding of Class 8th Mathematics.",
            "A notebook and geometry set.",
            "Developing interest in logical reasoning and proofs."
        ],
        syllabus: [
            {
                unit: "Unit I: Number Systems",
                chapters: [
                    { title: "Chapter 1: Number Systems", content: "Rational and Irrational numbers, Real numbers and their decimal expansions, Representing numbers on the number line. Advanced: Laws of exponents for real numbers, Rationalizing the denominator." }
                ]
            },
            {
                unit: "Unit II: Algebra",
                chapters: [
                    { title: "Chapter 2: Polynomials", content: "Zeroes of a polynomial, Remainder Theorem, Factor Theorem. Core: Algebraic Identities (e.g., (a+b+c)^2, (a ± b)^3, a^3+b^3+c^3-3abc)." },
                    { title: "Chapter 3: Linear Equations in Two Variables", content: "General form ax + by + c = 0, Graphing linear equations, Equations of lines parallel to x-axis and y-axis." }
                ]
            },
            {
                unit: "Unit III: Coordinate Geometry",
                chapters: [
                    { title: "Chapter 4: Coordinate Geometry", content: "Cartesian plane, Coordinates of a point, Names and terms associated with the coordinate plane (Abscissa, Ordinate)." }
                ]
            },
            {
                unit: "Unit IV: Geometry (The Weightage King)",
                chapters: [
                    { title: "Chapter 5: Introduction to Euclid’s Geometry", content: "Brief overview of Euclid's axioms and postulates." },
                    { title: "Chapter 6: Lines and Angles", content: "Intersecting and non-intersecting lines, Pairs of angles, Transversal and parallel lines." },
                    { title: "Chapter 7: Triangles", content: "Congruence of Triangles (SAS, ASA, SSS, RHS), Properties of triangles (Inequalities in a triangle)." },
                    { title: "Chapter 8: Quadrilaterals", content: "Properties of a Parallelogram, The Mid-point Theorem." },
                    { title: "Chapter 9: Circles", content: "Angle subtended by a chord, Perpendicular from the center to a chord, Equal chords and their distances from the center." }
                ]
            },
            {
                unit: "Unit V: Mensuration",
                chapters: [
                    { title: "Chapter 10: Heron’s Formula", content: "Area = √[s(s-a)(s-b)(s-c)] where s is semi-perimeter." },
                    { title: "Chapter 11: Surface Areas and Volumes", content: "Surface area and volume of Spheres, Hemispheres, and Right Circular Cones." }
                ]
            },
            {
                unit: "Unit VI: Statistics",
                chapters: [
                    { title: "Chapter 12: Statistics", content: "Collection of data, Presentation of data (Bar graphs, Histograms, Frequency Polygons)." }
                ]
            }
        ],
        faqs: [
            {
                question: "Is this course based on the latest NCERT syllabus?",
                answer: "Yes, this course follows the latest NCERT and CBSE guidelines for Class 9 Mathematics."
            },
            {
                question: "Will this course help in NTSE and Olympiad preparation?",
                answer: "Absolutely. The course covers advanced topics and foundational concepts that are crucial for competitive exams like NTSE and Mathematics Olympiads."
            },
            {
                question: "How is geometry covered in this course?",
                answer: "Geometry is given significant weightage, covering everything from Euclid's geometry to Lines, Angles, Triangles, Quadrilaterals, and Circles with focus on proofs and theorems."
            },
            {
                question: "Is there support for solving complex algebraic identities?",
                answer: "Yes, the course includes core training on algebraic identities like (a+b+c)^2, (a±b)^3, and more advanced ones."
            }
        ]
    }

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Course",
        "name": "Class 9 Mathematics Complete Mastery Course",
        "description": "A comprehensive guide to Class 9 Maths covering Number Systems, Polynomials, Geometry, and Mensuration as per NCERT guidelines.",
        "provider": {
            "@type": "Organization",
            "name": "Celoris Designs llp"
        },
        "educationalLevel": "Grade 9",
        "syllabusSections": [
            {
                "@type": "Syllabus",
                "name": "Algebra",
                "description": "Polynomials and Linear Equations in two variables."
            },
            {
                "@type": "Syllabus",
                "name": "Geometry",
                "description": "Lines, Angles, Triangles, Quadrilaterals and Circles."
            },
            {
                "@type": "Syllabus",
                "name": "Mensuration",
                "description": "Heron's Formula and Surface Area/Volumes."
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
                                <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">Mathematics</span>
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
                                <img
                                    src="/class-9-maths-cover.jpg"
                                    alt="Class 9th Mathematics Mastery Course"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </Card>

                        {/* What You'll Learn */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                    <span>Learning Outcomes</span>
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
                                    <span>Detailed Unit-Wise Syllabus</span>
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
                                            <span>• Course difficulty: Foundation</span>
                                        </div>
                                        <div className="flex items-center justify-center space-x-4 mt-2">
                                            <span>• Target Audience: Class 9, NTSE Aspirants</span>
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
                                        Expert educators dedicated to providing a deep conceptual understanding of Mathematics for Class 9 and beyond.
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
