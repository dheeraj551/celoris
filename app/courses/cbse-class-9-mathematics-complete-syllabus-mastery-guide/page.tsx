"use client"

import { ArrowLeft, Clock, Users, Star, CheckCircle, HelpCircle, BookOpen, Download, Trophy, MessageSquare } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { CourseInquiryDialog } from "@/components/CourseInquiryDialog"
import { InteractiveQuiz } from "@/components/InteractiveQuiz"

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
        ],
        quiz_data: [
            {
                title: "Unit 1: Number Systems",
                questions: [
                    {
                        question: "Which of the following is an example of an irrational number?",
                        options: ["22/7", "0.141414...", "√2", "3.5"],
                        correctIndex: 2
                    },
                    {
                        question: "In the expression x^(1/n), what is the numerator of the rational exponent?",
                        options: ["n", "1", "x", "0"],
                        correctIndex: 1
                    },
                    {
                        question: "To simplify an expression with a square root in the denominator, which process is used?",
                        options: ["Factoring", "Rationalizing the denominator", "Long division", "Completing the square"],
                        correctIndex: 1
                    },
                    {
                        question: "According to the laws of exponents, what is (a^m)^n?",
                        options: ["a^(m+n)", "a^(m-n)", "a^(mn)", "a^(m/n)"],
                        correctIndex: 2
                    },
                    {
                        question: "Which numbers can be represented exactly on a number line using geometric methods?",
                        options: ["Only rational numbers", "Only integers", "Both rational and irrational numbers", "Only natural numbers"],
                        correctIndex: 2
                    },
                    {
                        question: "The 'additive inverse' of a rational number 'a' is:",
                        options: ["1/a", "1", "-a", "0"],
                        correctIndex: 2
                    },
                    {
                        question: "A rational number is defined as a number that can be written in the form p/q where:",
                        options: ["q = 0", "p = 0", "q ≠ 0", "p and q are irrational"],
                        correctIndex: 2
                    },
                    {
                        question: "The decimal expansion of a rational number is either terminating or:",
                        options: ["Non-terminating non-recurring", "Non-terminating recurring", "Always zero", "Infinite and random"],
                        correctIndex: 1
                    }
                ]
            },
            {
                title: "Unit 2: Algebra & Polynomials",
                questions: [
                    {
                        question: "What is the degree of a non-zero constant polynomial?",
                        options: ["1", "0", "Undefined", "2"],
                        correctIndex: 1
                    },
                    {
                        question: "The Remainder Theorem states that if p(x) is divided by (x-a), the remainder is:",
                        options: ["p(0)", "p(1)", "p(a)", "p(-a)"],
                        correctIndex: 2
                    },
                    {
                        question: "Which identity is correct for (x+y+z)^2?",
                        options: [
                            "x^2 + y^2 + z^2 + xy + yz + zx",
                            "x^2 + y^2 + z^2 + 2xy + 2yz + 2zx",
                            "(x+y)^2 + z^2",
                            "x^3 + y^3 + z^3"
                        ],
                        correctIndex: 1
                    },
                    {
                        question: "The value of k if (x-1) is a factor of 4x^3 + 3x^2 - 4x + k is found using:",
                        options: ["Remainder Theorem", "Factor Theorem", "Midpoint Theorem", "Heron’s Formula"],
                        correctIndex: 1
                    },
                    {
                        question: "A polynomial with exactly three terms is called a:",
                        options: ["Monomial", "Binomial", "Trinomial", "Linear equation"],
                        correctIndex: 2
                    },
                    {
                        question: "The general form of a linear equation in two variables is:",
                        options: ["ax + b = 0", "ax^2 + bx + c = 0", "ax + by + c = 0", "y = mx"],
                        correctIndex: 2
                    },
                    {
                        question: "The zeroes of the polynomial p(x) = x^2 - 5x + 6 are:",
                        options: ["1, 6", "2, 3", "-2, -3", "5, 6"],
                        correctIndex: 1
                    },
                    {
                        question: "In the equation y = ab^x, which represents an exponential relationship?",
                        options: ["x is a constant", "b is the variable", "x is the variable exponent", "y is always zero"],
                        correctIndex: 2
                    },
                    {
                        question: "What is the result of (x+y)^3?",
                        options: [
                            "x^3 + y^3",
                            "x^3 + y^3 + 3xy(x+y)",
                            "x^3 + 3x^2y + 3xy^2 + y^3",
                            "Both b and c"
                        ],
                        correctIndex: 3
                    },
                    {
                        question: "A linear equation in two variables has how many solutions?",
                        options: ["Exactly one", "Exactly two", "Infinitely many", "No solution"],
                        correctIndex: 2
                    }
                ]
            },
            {
                title: "Unit 3: Coordinate Geometry",
                questions: [
                    {
                        question: "The horizontal axis in a Cartesian plane is called the:",
                        options: ["Ordinate", "Abscissa", "X-axis", "Origin"],
                        correctIndex: 2
                    },
                    {
                        question: "The coordinates of the origin are:",
                        options: ["(1, 1)", "(0, 1)", "(1, 0)", "(0, 0)"],
                        correctIndex: 3
                    },
                    {
                        question: "The y-coordinate of a point is also known as its:",
                        options: ["Abscissa", "Ordinate", "Gradient", "Slope"],
                        correctIndex: 1
                    },
                    {
                        question: "A point whose abscissa is negative and ordinate is positive lies in which quadrant?",
                        options: ["Quadrant I", "Quadrant II", "Quadrant III", "Quadrant IV"],
                        correctIndex: 1
                    },
                    {
                        question: "The point (0, -4) lies on the:",
                        options: ["X-axis", "Y-axis", "Origin", "Quadrant III"],
                        correctIndex: 1
                    }
                ]
            },
            {
                title: "Unit 4: Geometry (The 'Weightage King')",
                questions: [
                    {
                        question: "A statement that is accepted as true without proof is a/an:",
                        options: ["Theorem", "Axiom", "Corollary", "Hypothesis"],
                        correctIndex: 1
                    },
                    {
                        question: "If two lines intersect, the vertically opposite angles are:",
                        options: ["Complementary", "Supplementary", "Equal", "Adjacent"],
                        correctIndex: 2
                    },
                    {
                        question: "The sum of the interior angles of a triangle is:",
                        options: ["90°", "180°", "360°", "270°"],
                        correctIndex: 1
                    },
                    {
                        question: "Which is NOT a criteria for congruence of triangles?",
                        options: ["SAS", "ASA", "AAA", "SSS"],
                        correctIndex: 2
                    },
                    {
                        question: "The Midpoint Theorem relates to which geometric figure?",
                        options: ["Circle", "Quadrilateral", "Triangle", "Cylinder"],
                        correctIndex: 2
                    },
                    {
                        question: "A parallelogram with all sides equal and all angles 90° is a:",
                        options: ["Rhombus", "Rectangle", "Square", "Trapezium"],
                        correctIndex: 2
                    },
                    {
                        question: "The angle subtended by an arc at the centre is ____ the angle subtended by it at any point on the remaining part of the circle.",
                        options: ["Equal to", "Half of", "Double", "Triple"],
                        correctIndex: 2
                    },
                    {
                        question: "In an isosceles triangle, the angles opposite to equal sides are:",
                        options: ["90°", "Equal", "Scalene", "Obtuse"],
                        correctIndex: 1
                    },
                    {
                        question: "A quadrilateral whose opposite sides are parallel is a:",
                        options: ["Trapezium", "Kite", "Parallelogram", "Square"],
                        correctIndex: 2
                    },
                    {
                        question: "Angles in the same segment of a circle are:",
                        options: ["Equal", "Supplementary", "Complementary", "90°"],
                        correctIndex: 0
                    }
                ]
            },
            {
                title: "Unit 5: Mensuration",
                questions: [
                    {
                        question: "Heron’s Formula for the area of a triangle is:",
                        options: [
                            "1/2 × base × height",
                            "√[s(s-a)(s-b)(s-c)]",
                            "πr^2",
                            "2(lb+bh+hl)"
                        ],
                        correctIndex: 1
                    },
                    {
                        question: "In Heron’s Formula, 's' represents:",
                        options: ["Surface area", "Side length", "Semi-perimeter", "Slope"],
                        correctIndex: 2
                    },
                    {
                        question: "The volume of a right circular cone is given by:",
                        options: ["πr^2h", "2πrh", "1/3πr^2h", "4/3πr^3"],
                        correctIndex: 2
                    },
                    {
                        question: "The surface area of a sphere of radius r is:",
                        options: ["2πr^2", "3πr^2", "4πr^2", "πr^2"],
                        correctIndex: 2
                    },
                    {
                        question: "The total surface area of a hemisphere is:",
                        options: ["2πr^2", "3πr^2", "4πr^2", "2/3πr^3"],
                        correctIndex: 1
                    }
                ]
            },
            {
                title: "Unit 6: Statistics",
                questions: [
                    {
                        question: "The middle value of a data set arranged in ascending order is the:",
                        options: ["Mean", "Median", "Mode", "Range"],
                        correctIndex: 1
                    },
                    {
                        question: "A graphical representation of cumulative frequency is called a/an:",
                        options: ["Histogram", "Bar Graph", "Cumulative frequency plot (Ogive)", "Pie Chart"],
                        correctIndex: 2
                    },
                    {
                        question: "The 'Mode' of a data set is the value that:",
                        options: ["Appears most frequently", "Is the average", "Is the difference between max and min", "Is the middle term"],
                        correctIndex: 0
                    },
                    {
                        question: "In a histogram, the area of the rectangles is proportional to the:",
                        options: ["Class size", "Frequency", "Mid-point", "Range"],
                        correctIndex: 1
                    },
                    {
                        question: "The mean of the first five natural numbers is:",
                        options: ["2", "3", "4", "5"],
                        correctIndex: 1
                    }
                ]
            },
            {
                title: "Curriculum & Institutional Framework",
                questions: [
                    {
                        question: "Which government scheme replaced the Mid-day Meal Scheme in 2021?",
                        options: ["Poshan Abhiyan", "PM-POSHAN", "National Nutrition Mission", "ICDS"],
                        correctIndex: 1
                    },
                    {
                        question: "Who is the lead instructor for the Celoris Designs Class 9 Maths course?",
                        options: ["Dr. Danielle Tormala", "Jessica Evans", "Dheeraj Kushwaha", "Parul Rishi"],
                        correctIndex: 2
                    },
                    {
                        question: "The Celoris Designs digital platform is hosted on which interface?",
                        options: ["IndiaMART", "UrbanPro", "Graphy", "YouTube"],
                        correctIndex: 2
                    },
                    {
                        question: "What is the primary pedagogical shift emphasized by NEP 2020 and the sources?",
                        options: ["Focus on rote learning", "Shift toward competency-based learning", "Increase in textbook length", "Elimination of all exams"],
                        correctIndex: 1
                    },
                    {
                        question: "According to the sources, Dheeraj Kushwaha has how many years of teaching experience?",
                        options: ["5 years", "9 years", "11 years", "16 years"],
                        correctIndex: 2
                    },
                    {
                        question: "In the 'TERM' philosophy, 'Concept Chunking' is used to:",
                        options: ["Make exams harder", "Align lessons with NCERT Learning Outcomes", "Reduce the number of teachers", "Focus only on geometry"],
                        correctIndex: 1
                    },
                    {
                        question: "What is a 'Distractor' in the context of Multiple-Choice Questions (MCQs)?",
                        options: ["A correct answer", "An incorrect option designed to capture common misconceptions", "A loud noise during the exam", "A blank question"],
                        correctIndex: 1
                    }
                ]
            }
        ],
        reviews: [
            {
                name: "Aarav Sharma",
                grade: "Class 9, CBSE",
                rating: 5,
                comment: "This course made Class 9 Maths feel easy and logical. The explanations for Number Systems and Algebra are very clear, and the practice questions really helped me prepare for school exams."
            },
            {
                name: "Ananya Verma",
                grade: "Class 9",
                rating: 5,
                comment: "I struggled a lot with Geometry earlier, but this course completely changed that. Lines, Angles, and Triangles are explained step-by-step with proper reasoning. Highly recommended!"
            },
            {
                name: "Rohan Gupta",
                grade: "Class 9, CBSE",
                rating: 4,
                comment: "The syllabus coverage is perfect as per NCERT. I especially liked the Coordinate Geometry and Statistics sections—they are explained in a very simple and exam-oriented way."
            },
            {
                name: "Priya Singh",
                grade: "Class 9",
                rating: 5,
                comment: "This is not just a school course, it actually builds a foundation for Class 10 and NTSE. Algebraic identities and polynomials are taught with tricks that save a lot of time in exams."
            },
            {
                name: "Kunal Mehta",
                grade: "Class 9",
                rating: 5,
                comment: "The Geometry section truly deserves the name ‘Weightage King’. Proofs are explained logically, which helped me gain confidence in writing answers in the board pattern."
            },
            {
                name: "Sneha Patel",
                grade: "Class 9",
                rating: 4,
                comment: "Mensuration and Heron’s Formula were always confusing for me, but the concepts are explained clearly with proper examples. Practice questions helped me improve my accuracy."
            },
            {
                name: "Aditya Rao",
                grade: "Class 9, CBSE",
                rating: 5,
                comment: "I liked how the course is structured unit-wise. After completing each unit, I felt confident enough to solve NCERT and extra questions without fear."
            },
            {
                name: "Neha Kapoor",
                grade: "Class 9",
                rating: 5,
                comment: "This course helped me move from rote learning to conceptual understanding. Linear equations in two variables and graphs are now one of my strongest topics."
            },
            {
                name: "Arjun Malhotra",
                grade: "Class 9",
                rating: 4,
                comment: "Statistics was explained very well, especially bar graphs and histograms. The course helped me understand how to present answers neatly in exams."
            },
            {
                name: "Pooja Choudhary",
                grade: "Class 9, CBSE",
                rating: 5,
                comment: "Best Class 9 Maths course I’ve taken so far. It covers the full syllabus, strengthens basics, and prepares you for competitive exams as well. Totally worth it!"
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
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(jsonLd)
                }
                }
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

                        {/* Student Reviews Section */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <MessageSquare className="h-5 w-5 text-yellow-500" />
                                    <span>Student Reviews</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {courseData.reviews.map((review, index) => (
                                        <div key={index} className="p-4 rounded-xl bg-surface border border-border/50 space-y-3">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h4 className="font-bold text-text-primary">{review.name}</h4>
                                                    <p className="text-xs text-text-secondary">{review.grade}</p>
                                                </div>
                                                <div className="flex items-center">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`h-3 w-3 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-sm text-text-secondary italic">"{review.comment}"</p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Interactive Quiz Section */}
                        <section id="quiz" className="scroll-mt-20">
                            <InteractiveQuiz
                                quizTitle="Class 9 Mathematics Mastery Assessment"
                                quizDescription="Test your knowledge across all 6 units of Class 9 Mathematics and the curriculum framework."
                                quizUnits={courseData.quiz_data}
                                onCompleteMessage={(score, total) => {
                                    const percentage = (score / total) * 100;
                                    if (percentage >= 90) return "Exceptional! You have a profound command of Class 9 Mathematics. You're ready for advanced challenges!";
                                    if (percentage >= 70) return "Great job! You have a strong foundation. A bit more practice on your weaker areas and you'll be perfect.";
                                    return "Good effort! We recommend reviewing the Unit-wise syllabus to strengthen your conceptual clarity.";
                                }}
                            />
                        </section>
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
                                    <Button
                                        variant="outline"
                                        className="w-full mb-6 border-primary-200 text-primary-700 hover:bg-primary-50"
                                        onClick={() => document.getElementById('quiz')?.scrollIntoView({ behavior: 'smooth' })}
                                    >
                                        <Trophy className="mr-2 h-4 w-4" />
                                        Take Mastery Quiz
                                    </Button>
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
