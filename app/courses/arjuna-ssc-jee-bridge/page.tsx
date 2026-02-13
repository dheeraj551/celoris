"use client"

import React, { useEffect } from "react"
import { ArrowLeft, Clock, Users, Star, CheckCircle, HelpCircle, BookOpen, Download, Trophy, MessageSquare } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { CourseInquiryDialog } from "@/components/CourseInquiryDialog"
import { InteractiveQuiz } from "@/components/InteractiveQuiz"

export default function ArjunaIntegratedCourse() {
    // Set page title and meta tags dynamically
    useEffect(() => {
        document.title = "Arjuna Integrated: The SSC-JEE Bridge | Mathematics Mastery for SSC & JEE";

        const metaDescription = document.querySelector('meta[name="description"]');
        const descriptionText = "Master Algebra, Trigonometry, Geometry, and Statistics for both SSC and JEE. Integrated dual-value learning strategy at Celoris Designs.";
        if (metaDescription) {
            metaDescription.setAttribute('content', descriptionText);
        } else {
            const meta = document.createElement('meta');
            meta.name = 'description';
            meta.content = descriptionText;
            document.head.appendChild(meta);
        }
    }, []);

    const courseData = {
        title: "Arjuna Integrated",
        subtitle: "The SSC-JEE Bridge",
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
            "Master Algebra: Progressions, Series, and Quadratic Equations.",
            "Visualise Geometry: Cartesian Coordinate Geometry, Circles, and Conics.",
            "Tackle Trigonometry: Functions, identities, and Heights & Distances.",
            "Handle Data: Excellence in Statistics and Probability.",
            "Advanced Algebra: Master Matrices and Determinants.",
            "Calculus Edge: Limits, Continuity, and Applications of Derivatives."
        ],
        requirements: [
            "Strong foundation in Class 10th Mathematics.",
            "Aspirants of SSC (CGL/CHSL) or JEE (Main/Advanced).",
            "Dedication to regular practice and solving PYQs."
        ],
        syllabus: [
            {
                unit: "Phase 1: Foundations",
                duration: "Week 1–2",
                description: "Arithmetic foundations and basic algebraic structures.",
                chapters: [
                    {
                        title: "Progressions and Series",
                        content: "Arithmetic Progression (AP), Geometric Progression (GP), and their respective means."
                    },
                    {
                        title: "Quadratic Equations",
                        content: "Real and complex roots, the relation between roots and coefficients."
                    },
                    {
                        title: "Set Theory",
                        content: "Venn diagrams, union, intersection, and complement of sets."
                    }
                ]
            },
            {
                unit: "Phase 2: Geometry & Measurement",
                duration: "Week 3–4",
                description: "Visualising shapes and understanding coordinate systems.",
                chapters: [
                    {
                        title: "Cartesian Coordinate Geometry",
                        content: "Distance formula, section formula, and the slope of a line."
                    },
                    {
                        title: "Trigonometric Foundations",
                        content: "Trigonometric functions, identities, and their periodicity."
                    },
                    {
                        title: "Circles and Conics",
                        content: "Standard forms of circle equations, tangents, and properties of Conics."
                    }
                ]
            },
            {
                unit: "Phase 3: Data & Advanced Algebra",
                duration: "Week 5–6",
                description: "Handling uncertainty and structured data.",
                chapters: [
                    {
                        title: "Statistics & Measures of Dispersion",
                        content: "Calculation of Mean, Median, and Mode; Variance and Standard Deviation."
                    },
                    {
                        title: "Probability Basics",
                        content: "Random experiments, sample spaces, and Bayes' Theorem."
                    },
                    {
                        title: "Matrices and Determinants",
                        content: "Matrix operations and solving linear equations."
                    }
                ]
            },
            {
                unit: "Phase 4: Advanced Calculus",
                duration: "Week 7–8",
                description: "Essential for JEE; analytical edge for SSC Tier 2.",
                chapters: [
                    {
                        title: "Limits and Continuity",
                        content: "Understanding limits at a real number and L’Hospital’s Rule."
                    },
                    {
                        title: "Application of Derivatives",
                        content: "Finding Maxima and Minima; solving optimization problems."
                    }
                ]
            }
        ],
        strategic_tips: [
            { title: "Foundation First", tip: "Use NCERT textbooks for Classes 11 and 12 as your primary conceptual base." },
            { title: "Targeted Practice", tip: "Solve PYQs separately to understand differing exam question patterns." },
            { title: "Mock Testing", tip: "Regularly take CBT mode tests to build familiarity with NTA and SSC interfaces." },
            { title: "Revision", tip: "Create formula sheets for high-weightage areas like Calculus and Geometry." }
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
                title: "Trigonometry & Geometry",
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
            }
        ],
        reviews: [
            {
                name: "Aarav Sharma",
                grade: "JEE Aspirant",
                rating: 5,
                comment: "Arjuna Integrated genuinely saved me months of duplicate preparation. Earlier I was studying Algebra separately for SSC and JEE. This course showed me how Progressions, Quadratics, and Matrices overlap with different difficulty levels. The PYQ separation strategy was gold."
            },
            {
                name: "Sneha Verma",
                grade: "SSC CGL Aspirant",
                rating: 5,
                comment: "I used to think Calculus was unnecessary for SSC, but the course clarified exactly what level is required. They didn’t overload us. The structured 8-week plan made me disciplined. My Trigonometry accuracy improved massively."
            },
            {
                name: "Rohan Gupta",
                grade: "Dropper Student",
                rating: 5,
                comment: "Week 3–4 Geometry phase changed everything for me. Cartesian Geometry and Circles became visual instead of formula-based mugging. The mock CBT tests felt exactly like NTA format. Confidence booster!"
            },
            {
                name: "Priya Nair",
                grade: "Standard Learner",
                rating: 5,
                comment: "The best part is the ‘Foundation First’ approach using NCERT. Instead of 10 random books, they told us exactly what to focus on. I didn’t buy any extra books and still covered everything."
            },
            {
                name: "Aditya Singh",
                grade: "Aspirant",
                rating: 5,
                comment: "Advanced Algebra (Matrices & Determinants) explanation was crystal clear. Earlier I was scared of determinants. Now it’s one of my strongest areas in mock tests."
            },
            {
                name: "Mehak Kapoor",
                grade: "Integrated Learner",
                rating: 5,
                comment: "The dual-value learning strategy is real. For example, Probability was taught with SSC speed tricks and JEE conceptual depth. That balance is rare."
            },
            {
                name: "Kunal Rathore",
                grade: "Aspirant",
                rating: 5,
                comment: "Revision formula sheets for Calculus were a game changer. Before exams, I revised everything in 3 hours. Applications of Derivatives finally made sense."
            },
            {
                name: "Ananya Das",
                grade: "Competitive Student",
                rating: 5,
                comment: "I liked how they separated PYQs. SSC questions are pattern-based while JEE demands deeper understanding. Practicing them separately improved my approach."
            },
            {
                name: "Vivek Tiwari",
                grade: "Mathematics Focused",
                rating: 5,
                comment: "Trigonometry was my weakest area. Identities and Heights & Distances used to confuse me. After Phase 2, I stopped making silly mistakes. Accuracy increased from 60% to 85%."
            },
            {
                name: "Ishita Roy",
                grade: "Foundation Learner",
                rating: 5,
                comment: "If you're confused between SSC and JEE preparation, this course removes that anxiety. It’s structured, practical, and realistic. The 8-week architecture keeps you accountable."
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
        }
    }

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 py-8 selection:bg-emerald-500/30">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="container max-w-7xl mx-auto px-4">
                {/* Breadcrumb */}
                <div className="flex items-center space-x-2 text-sm text-slate-400 mb-6">
                    <Link href="/" className="hover:text-emerald-400">Home</Link>
                    <span>/</span>
                    <Link href="/learn" className="hover:text-emerald-400">Learn</Link>
                    <span>/</span>
                    <Link href="/learn/courses" className="hover:text-emerald-400">Courses</Link>
                    <span>/</span>
                    <span className="text-slate-100 line-clamp-1">{courseData.title}</span>
                </div>

                {/* Back Button */}
                <Link href="/learn/courses" className="inline-flex items-center text-slate-400 hover:text-emerald-400 mb-6 group">
                    <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Courses
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* Course Header */}
                        <div className="space-y-6">
                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase">Mathematics</span>
                                <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase">SSC-JEE Bridge</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400 italic uppercase">
                                {courseData.title}
                            </h1>
                            <p className="text-xl md:text-2xl text-emerald-400/90 font-medium italic">
                                {courseData.subtitle}
                            </p>
                            <p className="text-lg text-slate-400 leading-relaxed max-w-3xl italic">
                                {courseData.description}
                            </p>
                        </div>

                        {/* Course Video Preview */}
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                            <Card className="relative overflow-hidden border-0 bg-slate-900/50 backdrop-blur-xl rounded-2xl">
                                <div className="aspect-video relative overflow-hidden">
                                    <iframe
                                        className="w-full h-full"
                                        src="https://www.youtube.com/embed/rbWqhyl9QNE?autoplay=0&rel=0"
                                        title="Arjuna Integrated Course Preview"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            </Card>
                        </div>

                        {/* Learning Outcomes */}
                        <section className="space-y-6">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3 italic uppercase tracking-tighter">
                                <div className="p-2 bg-emerald-500/20 rounded-lg">
                                    <CheckCircle className="h-6 w-6 text-emerald-400" />
                                </div>
                                Mastery Framework
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {courseData.learning_outcomes.map((item, index) => (
                                    <div key={index} className="flex items-start gap-3 p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 hover:border-emerald-500/30 transition-colors group">
                                        <div className="h-5 w-5 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-emerald-500/20 transition-colors">
                                            <CheckCircle className="h-3 w-3 text-emerald-400" />
                                        </div>
                                        <span className="text-slate-300 text-sm leading-relaxed">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Detailed Syllabus */}
                        <section className="space-y-6">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3 italic uppercase tracking-tighter">
                                <div className="p-2 bg-purple-500/20 rounded-lg">
                                    <BookOpen className="h-6 w-6 text-purple-400" />
                                </div>
                                Curriculum Architecture
                            </h2>
                            <Accordion type="single" collapsible className="space-y-4">
                                {courseData.syllabus.map((unit, index) => (
                                    <AccordionItem key={index} value={`item-${index}`} className="border border-slate-700/50 bg-slate-900/40 rounded-xl px-2 overflow-hidden">
                                        <AccordionTrigger className="hover:no-underline py-6">
                                            <div className="flex items-center gap-4 text-left w-full">
                                                <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 shadow-inner">
                                                    <BookOpen className="h-6 w-6 text-emerald-400" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-1">{unit.duration}</div>
                                                    <div className="text-lg font-semibold text-white italic uppercase tracking-tighter">{unit.unit}</div>
                                                </div>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="pb-6 px-4">
                                            <div className="pl-14 space-y-4">
                                                <p className="text-xs text-slate-400 italic uppercase tracking-widest">{unit.description}</p>
                                                <div className="h-px bg-gradient-to-r from-emerald-500/30 to-transparent mb-4"></div>
                                                <div className="grid grid-cols-1 gap-4">
                                                    {unit.chapters.map((chapter, cIndex) => (
                                                        <div key={cIndex} className="group p-4 rounded-xl bg-slate-800/20 border border-transparent hover:border-emerald-500/20 transition-all">
                                                            <h3 className="text-sm font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors italic uppercase">{chapter.title}</h3>
                                                            <p className="text-xs text-slate-400 leading-relaxed">{chapter.content}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </section>

                        {/* Strategic Tips */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {courseData.strategic_tips.map((tip, index) => (
                                <Card key={index} className="border-slate-700/50 bg-slate-900/40 hover:bg-slate-800/60 transition-colors p-6 rounded-2xl">
                                    <h3 className="text-xs font-black uppercase tracking-widest text-emerald-500 mb-3 italic">{tip.title}</h3>
                                    <p className="text-xs text-slate-400 leading-relaxed italic uppercase">{tip.tip}</p>
                                </Card>
                            ))}
                        </div>

                        {/* FAQ Section */}
                        <section className="space-y-6">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3 italic uppercase tracking-tighter">
                                <div className="p-2 bg-cyan-500/20 rounded-lg">
                                    <HelpCircle className="h-6 w-6 text-cyan-400" />
                                </div>
                                Preparation Intelligence
                            </h2>
                            <Accordion type="single" collapsible className="space-y-3">
                                {courseData.faqs.map((faq, index) => (
                                    <AccordionItem key={index} value={`faq-${index}`} className="border border-slate-700/50 bg-slate-900/40 rounded-xl px-4">
                                        <AccordionTrigger className="text-sm font-bold italic uppercase tracking-tight hover:text-emerald-400 text-left">
                                            {faq.question}
                                        </AccordionTrigger>
                                        <AccordionContent className="text-xs text-slate-400 leading-relaxed pb-6">
                                            {faq.answer}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </section>

                        {/* Interactive Quiz Section */}
                        <section id="quiz" className="scroll-mt-20">
                            <InteractiveQuiz
                                quizTitle="Arjuna Free Mock Test"
                                quizDescription="Challenge yourself with this comprehensive mock test covering SSC and JEE Mathematics overlap."
                                quizUnits={courseData.quiz_data}
                                onCompleteMessage={(score: number, total: number) => {
                                    const percentage = (score / total) * 100;
                                    if (percentage >= 90) return "Exceptional! You've bridged the gap. Your conceptual depth and speed are optimal for both SSC and JEE.";
                                    if (percentage >= 70) return "Well done! You have a solid grasp of the core topics. Focus on PYQs to fine-tune your exam-specific speed.";
                                    return "Keep practicing! We recommend revisiting the Foundation modules to strengthen your basics across Algebra and Geometry.";
                                }}
                            />
                        </section>

                        {/* Testimonials Section */}
                        <section className="space-y-8">
                            <h2 className="text-3xl font-bold text-white flex items-center gap-3 italic uppercase tracking-tighter">
                                <div className="p-2 bg-emerald-500/20 rounded-lg">
                                    <MessageSquare className="h-6 w-6 text-emerald-400" />
                                </div>
                                Student Voices
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {courseData.reviews.map((review, index) => (
                                    <Card key={index} className="bg-slate-900/40 border border-slate-800/50 p-6 rounded-2xl hover:border-emerald-500/30 transition-all group">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-emerald-400 font-bold italic">
                                                {review.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-white italic transition-colors group-hover:text-emerald-400">{review.name}</h3>
                                                <p className="text-[10px] text-emerald-500/80 uppercase tracking-widest font-black">{review.grade}</p>
                                            </div>
                                            <div className="ml-auto flex gap-0.5">
                                                {[...Array(review.rating)].map((_, i) => (
                                                    <Star key={i} className="h-3 w-3 fill-emerald-500 text-emerald-500" />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-sm text-slate-400 leading-relaxed italic border-l-2 border-emerald-500/20 pl-4">
                                            "{review.comment}"
                                        </p>
                                    </Card>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8 space-y-6">
                            {/* Enrollment Card */}
                            <Card className="border-0 bg-slate-900/80 backdrop-blur-2xl shadow-3xl rounded-[2.5rem] overflow-hidden">
                                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />
                                <CardContent className="p-8">
                                    <div className="text-center mb-8">
                                        <div className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em] mb-4">Limited Enrollment</div>
                                        <div className="text-6xl font-black text-white italic tracking-tighter mb-2">
                                            ₹{courseData.price}
                                        </div>
                                        <div className="text-xs text-slate-500 italic uppercase tracking-widest font-bold">Full Bridge Access</div>
                                    </div>

                                    <div className="space-y-4 mb-8">
                                        <CourseInquiryDialog
                                            courseTitle={courseData.title}
                                            buttonClassName="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black italic uppercase tracking-widest rounded-2xl h-14 shadow-lg shadow-emerald-600/20 transition-all border-none"
                                        />
                                        <Button
                                            variant="outline"
                                            className="w-full border-slate-700 bg-white/5 text-white hover:bg-white/10 font-black italic uppercase tracking-widest rounded-2xl h-14 transition-all"
                                            onClick={() => document.getElementById('quiz')?.scrollIntoView({ behavior: 'smooth' })}
                                        >
                                            <Trophy className="mr-2 h-4 w-4 text-emerald-400" />
                                            Free Mock Test
                                        </Button>
                                    </div>

                                    <div className="space-y-4 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                                        <div className="flex items-center justify-between pb-4 border-b border-white/5">
                                            <span>Difficulty</span>
                                            <span className="text-emerald-400">Integrated</span>
                                        </div>
                                        <div className="flex items-center justify-between pb-4 border-b border-white/5">
                                            <span>Duration</span>
                                            <span className="text-emerald-400">{courseData.duration}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span>Certificate</span>
                                            <span className="text-emerald-400">Yes</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Instructor Card */}
                            <Card className="border-slate-700/50 bg-slate-900/40 backdrop-blur-sm rounded-[2rem] overflow-hidden">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-[10px] font-black uppercase tracking-widest text-emerald-500 italic">Faculty Hub</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 group overflow-hidden">
                                            <img src="/celoris-logo.png" alt="Celoris" className="w-8 h-8 object-contain transition-transform duration-500 group-hover:scale-110" />
                                        </div>
                                        <div>
                                            <h3 className="font-black text-white italic uppercase tracking-tighter">Celoris Designs</h3>
                                            <p className="text-[8px] text-emerald-500 uppercase tracking-widest font-black">Academic Specialists</p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-400 leading-relaxed mb-6 italic uppercase font-bold tracking-tight">
                                        Bridging the gap between school foundations and national-level competitive excellence.
                                    </p>
                                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-1">
                                                <Star className="h-3 w-3 fill-emerald-500 text-emerald-500" />
                                                <span className="text-xs font-black text-white italic">{courseData.rating}</span>
                                            </div>
                                            <span className="text-[8px] text-slate-500 font-black uppercase tracking-widest">Rating</span>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-1">
                                                <Users className="h-3 w-3 text-emerald-400" />
                                                <span className="text-xs font-black text-white italic">{courseData.students}</span>
                                            </div>
                                            <span className="text-[8px] text-slate-500 font-black uppercase tracking-widest">Active</span>
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
