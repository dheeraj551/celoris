"use client"

import { ArrowLeft, Clock, Users, Star, CheckCircle, HelpCircle, BookOpen, Download, Trophy, MessageSquare } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { CourseInquiryDialog } from "@/components/CourseInquiryDialog"
import { InteractiveQuiz } from "@/components/InteractiveQuiz"

export default function ArjunaIntegratedCourse() {
    const courseData = {
        title: "Arjuna Integrated: The SSC-JEE Bridge",
        description: "This comprehensive course focuses on Algebra, Trigonometry, Geometry, and Statistics—core components of both SSC and JEE exams. Master overlapping topics with dual-value learning strategies.",
        students: 245,
        rating: 4.9,
        duration: "8 Weeks",
        price: 4999.00,
        currency: "INR",
        provider: "Celoris Designs",
        website: "https://celorisdesigns.com",
        url: "https://celorisdesigns.com/courses/arjuna-ssc-jee-bridge",
        learning_outcomes: [
            "Master Algebra: Progressions, Series, and Quadratic Equations for quick calculation and deep analysis.",
            "Visualise Geometry: Cartesian Coordinate Geometry, Circles, and Conics mapping to both SSC and JEE requirements.",
            "Tackle Trigonometry: Master functions, identities, and Heights & Distances applicable across both exam patterns.",
            "Handle Data: Excellence in Statistics and Probability, including Bayes' Theorem and Measures of Dispersion.",
            "Advanced Algebra: Master Matrices and Determinants for solving linear systems.",
            "Calculus Edge: Gain an analytical advantage with Limits, Continuity, and Applications of Derivatives."
        ],
        requirements: [
            "Strong foundation in Class 10th Mathematics.",
            "Aspirants of SSC (CGL/CHSL) or JEE (Main/Advanced).",
            "Dedication to regular practice and solving Previous Year Questions (PYQs)."
        ],
        syllabus: [
            {
                unit: "Phase 1: Foundations (Week 1–2)",
                description: "Arithmetic foundations and basic algebraic structures.",
                chapters: [
                    {
                        title: "Lesson Plan 1: Progressions and Series",
                        content: "Topics: Arithmetic Progression (AP), Geometric Progression (GP), and their respective means. Dual Value: SSC requires quick calculations of series; JEE tests the insertion of arithmetic and geometric means between numbers."
                    },
                    {
                        title: "Lesson Plan 2: Quadratic Equations",
                        content: "Topics: Real and complex roots, the relation between roots and coefficients, and the nature of roots. Activity: Formation of quadratic equations with given roots."
                    },
                    {
                        title: "Lesson Plan 3: Set Theory",
                        content: "Topics: Venn diagrams, union, intersection, and complement of sets. Activity: Solving practical problems using Venn diagrams (highly relevant for SSC reasoning sections)."
                    }
                ]
            },
            {
                unit: "Phase 2: Geometry and Measurement (Week 3–4)",
                description: "Visualising shapes and understanding coordinate systems.",
                chapters: [
                    {
                        title: "Lesson Plan 4: Cartesian Coordinate Geometry",
                        content: "Topics: Distance formula, section formula, and the slope of a line. Activity: Finding coordinates of the Centroid, Orthocentre, Incentre, and Circumcentre of a triangle."
                    },
                    {
                        title: "Lesson Plan 5: Trigonometric Foundations",
                        content: "Topics: Trigonometric functions, identities, and their periodicity. Activity: Solving problems on Heights and Distances, a key overlap topic for both SSC and JEE Main."
                    },
                    {
                        title: "Lesson Plan 6: Circles and Conics",
                        content: "Topics: Standard forms of circle equations, tangents, and basic properties of Parabolas and Ellipses."
                    }
                ]
            },
            {
                unit: "Phase 3: Data and Advanced Algebra (Week 5–6)",
                description: "Handling uncertainty and structured data.",
                chapters: [
                    {
                        title: "Lesson Plan 7: Statistics and Measures of Dispersion",
                        content: "Topics: Calculation of Mean, Median, and Mode for grouped and ungrouped data. Activity: Computing variance and standard deviation."
                    },
                    {
                        title: "Lesson Plan 8: Probability Basics",
                        content: "Topics: Random experiments, sample spaces, and the addition/multiplication rules of probability. Activity: Introduction to Bayes’ Theorem for conditional uncertainty."
                    },
                    {
                        title: "Lesson Plan 9: Matrices and Determinants",
                        content: "Topics: Matrix operations and solving simultaneous linear equations using determinants."
                    }
                ]
            },
            {
                unit: "Phase 4: Advanced Calculus Overview (Week 7–8)",
                description: "Essential for JEE; provides an analytical edge for SSC Tier 2 candidates.",
                chapters: [
                    {
                        title: "Lesson Plan 10: Limits and Continuity",
                        content: "Topics: Understanding limits at a real number and L’Hospital’s Rule."
                    },
                    {
                        title: "Lesson Plan 11: Application of Derivatives",
                        content: "Topics: Finding Maxima and Minima and understanding the rate of change of quantities. Activity: Solving optimization problems based on real-world variables."
                    }
                ]
            }
        ],
        strategic_tips: [
            { title: "Foundation First", tip: "Use NCERT textbooks for Classes 11 and 12 as your primary conceptual base before moving to advanced reference books." },
            { title: "Targeted Practice", tip: "Solve Previous Year Questions (PYQs) separately for each exam to understand the differing question patterns—SSC often focuses on speed, while JEE Advanced tests multi-conceptual depth." },
            { title: "Mock Testing", tip: "Regularly take tests in Computer-Based Test (CBT) mode to build familiarity with the interface used by both NTA (for JEE) and SSC." },
            { title: "Revision", tip: "Create formula sheets for high-weightage areas like Calculus (which is 25–30% of the JEE Maths section) and Coordinate Geometry." }
        ],
        faqs: [
            {
                question: "How does this course benefit both SSC and JEE aspirants?",
                answer: "The course focuses on the significant overlap in Mathematics (Algebra, Geometry, Trigonometry). We teach techniques that prioritize speed for SSC and conceptual depth for JEE."
            },
            {
                question: "Is Calculus really necessary for SSC?",
                answer: "For SSC Tier 2, basic calculus concepts can provide an analytical edge and help solve advanced quantitative problems more efficiently."
            },
            {
                question: "Do I need to buy separate books?",
                answer: "We recommend starting with NCERT for a solid base. The course provides targeted practice sets that cover both SSC and JEE patterns."
            }
        ],
        quiz_data: [
            {
                title: "Trigonometry & Geometry (Overlapping Topics)",
                questions: [
                    {
                        question: "In ΔABC, if sin A = 3/5, what is the value of cos A?",
                        options: ["4/5", "3/4", "5/4", "1/2"],
                        correctIndex: 0
                    },
                    {
                        question: "The distance between points (2, 3) and (5, 7) is:",
                        options: ["5", "7", "√13", "√25"],
                        correctIndex: 0
                    },
                    {
                        question: "Which point is the concurrency of medians in a triangle?",
                        options: ["Centroid", "Incentre", "Orthocentre", "Circumcentre"],
                        correctIndex: 0
                    },
                    {
                        question: "What is the slope of a line parallel to the x-axis?",
                        options: ["0", "1", "Undefined", "-1"],
                        correctIndex: 0
                    }
                ]
            },
            {
                title: "Algebra & Progressions",
                questions: [
                    {
                        question: "The sum of the first 'n' terms of an AP is given by:",
                        options: ["n/2 [2a + (n-1)d]", "n/2 [a + l]", "Both a and b", "n[a + (n-1)d]"],
                        correctIndex: 2
                    },
                    {
                        question: "If 'a' and 'b' are roots of x² - 5x + 6 = 0, then a + b is:",
                        options: ["5", "6", "-5", "-6"],
                        correctIndex: 0
                    },
                    {
                        question: "The nth term of a GP is given by:",
                        options: ["ar^(n-1)", "ar^n", "a + (n-1)d", "a/r^(n-1)"],
                        correctIndex: 0
                    }
                ]
            },
            {
                title: "Statistics & Advanced Math",
                questions: [
                    {
                        question: "Which measure of dispersion is calculated as the square of standard deviation?",
                        options: ["Variance", "Range", "Mean Deviation", "Quartile Deviation"],
                        correctIndex: 0
                    },
                    {
                        question: "In Bayes' Theorem, P(A|B) represents:",
                        options: ["Conditional Probability", "Joint Probability", "Marginal Probability", "Prior Probability"],
                        correctIndex: 0
                    },
                    {
                        question: "What is the result of L’Hospital’s Rule applied to a 0/0 limit?",
                        options: ["Differentiate numerator and denominator separately", "Product Rule", "Quotient Rule", "Substitute x immediately"],
                        correctIndex: 0
                    }
                ]
            }
        ],
        reviews: [
            {
                name: "Rahul Mehra",
                grade: "JEE Aspirant",
                rating: 5,
                comment: "The way the bridge connects basic exam speed with advanced concepts is amazing. Set theory and Venn diagrams were especially helpful for my reasoning prep too."
            },
            {
                name: "Sanya Gupta",
                grade: "SSC CGL Aspirant",
                rating: 5,
                comment: "I never thought learning Coordinate Geometry could be so structured. The dual value approach saved me so much time since I'm preparing for both exams."
            }
        ]
    }

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Course",
        "name": "Arjuna Integrated: The SSC-JEE Bridge",
        "description": "Integrated Mathematics Course Structure for SSC and JEE aspirants focusing on Algebra, Trigonometry, Geometry, and Statistics.",
        "provider": {
            "@type": "Organization",
            "name": "Celoris Designs"
        },
        "educationalLevel": "Competitive Exams",
        "syllabusSections": [
            {
                "@type": "Syllabus",
                "name": "Algebra Foundations",
                "description": "AP, GP, Quadratic Equations, and Set Theory."
            },
            {
                "@type": "Syllabus",
                "name": "Geometry & Trigonometry",
                "description": "Coordinate Geometry, Circles, and Trigonometric Functions."
            },
            {
                "@type": "Syllabus",
                "name": "Advanced Calculus",
                "description": "Limits, Continuity, and Applications of Derivatives."
            }
        ]
    }

    return (
        <div className="min-h-screen bg-background py-8">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(jsonLd)
                }}
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
                                <span className="bg-surface px-3 py-1 rounded-full text-sm font-medium">SSC-JEE Bridge</span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4 italic uppercase tracking-tighter">
                                {courseData.title}
                            </h1>
                            <p className="text-lg text-text-secondary mb-6 italic">
                                {courseData.description}
                            </p>
                        </div>

                        {/* Course Image Placeholder */}
                        <Card className="overflow-hidden border-none shadow-2xl bg-emerald-950/20 backdrop-blur-xl">
                            <div className="aspect-video relative overflow-hidden flex items-center justify-center">
                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 z-0" />
                                <div className="relative z-10 text-center p-8">
                                    <h2 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter mb-4">ARJUNA</h2>
                                    <div className="h-1 w-32 bg-emerald-500 mx-auto mb-4" />
                                    <p className="text-emerald-400 font-bold tracking-[0.3em] uppercase text-xs">The SSC-JEE Bridge</p>
                                </div>
                            </div>
                        </Card>

                        {/* What You'll Learn */}
                        <Card className="border-white/5 bg-surface/50 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2 text-emerald-500 uppercase tracking-widest text-sm font-black italic">
                                    <CheckCircle className="h-5 w-5" />
                                    <span>Learning Outcomes</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {courseData.learning_outcomes.map((item, index) => (
                                        <div key={index} className="flex items-start space-x-3 group">
                                            <div className="h-5 w-5 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-500/20 transition-colors">
                                                <CheckCircle className="h-3 w-3 text-emerald-500" />
                                            </div>
                                            <span className="text-text-secondary text-sm leading-relaxed">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Detailed Syllabus */}
                        <Card className="border-white/5 bg-surface/50 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2 text-emerald-500 uppercase tracking-widest text-sm font-black italic">
                                    <BookOpen className="h-5 w-5" />
                                    <span>Detailed Curriculum Structure</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {courseData.syllabus.map((unit, index) => (
                                    <div key={index} className="border-b border-white/5 last:border-0 pb-6 last:pb-0">
                                        <div className="flex items-center justify-between mb-4">
                                            <h2 className="text-lg font-black text-emerald-400 italic uppercase">{unit.unit}</h2>
                                        </div>
                                        <p className="text-xs text-text-secondary mb-4 italic uppercase tracking-widest">{unit.description}</p>
                                        <div className="space-y-4 pl-4 border-l-2 border-emerald-500/20">
                                            {unit.chapters.map((chapter, cIndex) => (
                                                <div key={cIndex} className="group">
                                                    <h3 className="text-sm font-bold text-text-primary mb-1 group-hover:text-emerald-400 transition-colors italic">{chapter.title}</h3>
                                                    <p className="text-xs text-text-secondary leading-relaxed">{chapter.content}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Strategic Tips */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {courseData.strategic_tips.map((tip, index) => (
                                <Card key={index} className="border-white/5 bg-zinc-900/50 hover:bg-zinc-900 transition-colors">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-xs font-black uppercase tracking-widest text-emerald-500 italic">{tip.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-xs text-text-secondary leading-relaxed">{tip.tip}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* FAQ Section */}
                        <Card className="border-white/5 bg-surface/50 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2 text-emerald-500 uppercase tracking-widest text-sm font-black italic">
                                    <HelpCircle className="h-5 w-5" />
                                    <span>Preparation FAQs</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Accordion type="single" collapsible className="w-full">
                                    {courseData.faqs.map((faq, index) => (
                                        <AccordionItem key={index} value={`item-${index}`} className="border-white/5">
                                            <AccordionTrigger className="text-sm font-bold italic hover:text-emerald-400 no-underline">{faq.question}</AccordionTrigger>
                                            <AccordionContent className="text-xs text-text-secondary leading-relaxed">
                                                {faq.answer}
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </CardContent>
                        </Card>

                        {/* Interactive Quiz Section */}
                        <section id="quiz" className="scroll-mt-20">
                            <InteractiveQuiz
                                quizTitle="Arjuna Mastery Assessment"
                                quizDescription="Test your understanding of the overlapping concepts between SSC and JEE Mathematics."
                                quizUnits={courseData.quiz_data}
                                onCompleteMessage={(score, total) => {
                                    const percentage = (score / total) * 100;
                                    if (percentage >= 90) return "Exceptional! You've bridged the gap. Your conceptual depth and speed are optimal for both SSC and JEE.";
                                    if (percentage >= 70) return "Well done! You have a solid grasp of the core topics. Focus on PYQs to fine-tune your exam-specific speed.";
                                    return "Keep practicing! We recommend revisiting the Foundation modules to strengthen your basics across Algebra and Geometry.";
                                }}
                            />
                        </section>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8 space-y-6">
                            {/* Enrollment Card */}
                            <Card className="border-white/5 bg-zinc-900/50 backdrop-blur-xl shadow-2xl">
                                <CardContent className="p-8">
                                    <div className="text-center mb-8">
                                        <div className="text-10px font-black text-emerald-500 uppercase tracking-[0.3em] mb-4">Limited Enrollment</div>
                                        <div className="text-5xl font-black text-white italic tracking-tighter mb-2">
                                            ₹{courseData.price}
                                        </div>
                                        <div className="text-xs text-text-secondary italic uppercase tracking-widest">Full Bridge Access</div>
                                    </div>
                                    <CourseInquiryDialog
                                        courseTitle={courseData.title}
                                        buttonClassName="w-full mb-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black italic uppercase tracking-widest rounded-xl h-14"
                                    />
                                    <Button
                                        variant="outline"
                                        className="w-full mb-8 border-white/10 bg-white/5 text-white hover:bg-white/10 font-black italic uppercase tracking-widest rounded-xl h-14"
                                        onClick={() => document.getElementById('quiz')?.scrollIntoView({ behavior: 'smooth' })}
                                    >
                                        <Trophy className="mr-2 h-4 w-4 text-emerald-500" />
                                        Overlap Quiz
                                    </Button>
                                    <div className="space-y-4 text-xs font-bold uppercase tracking-[0.15em] text-text-secondary">
                                        <div className="flex items-center justify-between pb-4 border-b border-white/5">
                                            <span>Difficulty</span>
                                            <span className="text-emerald-500">Integrated</span>
                                        </div>
                                        <div className="flex items-center justify-between pb-4 border-b border-white/5">
                                            <span>Duration</span>
                                            <span className="text-emerald-500">{courseData.duration}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span>Certificate</span>
                                            <span className="text-emerald-500">Yes</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Instructor */}
                            <Card className="border-white/5 bg-surface/50 backdrop-blur-sm">
                                <CardHeader>
                                    <CardTitle className="text-xs font-black uppercase tracking-widest text-emerald-500 italic">Faculty Hub</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center space-x-4 mb-6">
                                        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center overflow-hidden border border-emerald-500/20">
                                            <img src="/celoris-logo.png" alt="Celoris" className="w-10 h-10 object-contain grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all" />
                                        </div>
                                        <div>
                                            <h3 className="font-black text-white italic uppercase tracking-tighter">Celoris Designs</h3>
                                            <p className="text-[10px] text-emerald-500 uppercase tracking-widest font-bold">Academic Specialists</p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-text-secondary leading-relaxed mb-6 italic">
                                        Bridging the gap between school foundations and national-level competitive excellence.
                                    </p>
                                    <div className="space-y-4">
                                        <div className="flex items-center space-x-3">
                                            <Star className="h-4 w-4 fill-emerald-500 text-emerald-500" />
                                            <span className="text-sm font-black text-white italic">{courseData.rating}</span>
                                            <span className="text-[10px] text-text-secondary font-bold uppercase tracking-widest">({courseData.students} ratings)</span>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <Users className="h-4 w-4 text-emerald-500" />
                                            <span className="text-[10px] text-text-secondary font-bold uppercase tracking-widest">{courseData.students} active aspirants</span>
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
