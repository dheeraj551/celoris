"use client"

import { ArrowLeft, Clock, Users, Star, CheckCircle, HelpCircle, BookOpen, Download, Music, Zap, Play, Layout, Heart, Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { CourseInquiryDialog } from "@/components/CourseInquiryDialog"

export default function BollywoodZumbaCourse() {
    const courseData = {
        title: "🎵 Dance Your Way — Bollywood & Zumba for Complete Beginners",
        description: "Master the art of Bollywood dance and stay fit with Zumba in this 6-week recorded video course designed specifically for absolute beginners.",
        summary: "This comprehensive course blends the high-energy joy of Bollywood dance with the fitness power of Zumba. Starting from zero, you'll build rhythm, learn 20+ core moves, and perform full routines by the graduation week.",
        students: 1250,
        rating: 4.9,
        duration: "6 Weeks | 24 Video Lessons",
        price: 999.00,
        currency: "INR",
        provider: "Celoris Designs LLP",
        instructor: "Celoris Dance Experts",
        learning_outcomes: [
            "Perform a full Bollywood choreography routine (2–3 min)",
            "Complete a 30-minute Zumba fitness session confidently",
            "Know 20+ core dance moves used in Bollywood songs",
            "Understand rhythm, body posture, and expressions",
            "Feel confident dancing at weddings, parties & events",
            "Build a weekly dance-fitness habit from home"
        ],
        requirements: [
            "A phone or laptop",
            "6×6 feet of clear floor space",
            "Comfortable clothes & shoes",
            "Energy & willingness to have fun 🎉"
        ],
        syllabus: [
            {
                unit: "🟡 MODULE 1 — Foundations (Week 1)",
                focus: "Build your base before you build your moves",
                chapters: [
                    { title: "Lesson 1 — Welcome & How This Course Works", content: "Setting up your practice space and what to expect each week." },
                    { title: "Lesson 2 — Body Basics: Posture, Balance & Rhythm", desc: "Finding the beat and basic weight shifts." },
                    { title: "Lesson 3 — Your First 5 Bollywood Moves", desc: "Step-Touch, Thumka, Shoulder rolls, Mudras, and The Classic Spin." },
                    { title: "Lesson 4 — Zumba Foundations: Salsa Step + Merengue", desc: "Basic steps for warm-up." }
                ]
            },
            {
                unit: "🟠 MODULE 2 — Bollywood Essentials (Week 2)",
                focus: "Moves that appear in every Bollywood song",
                chapters: [
                    { title: "Lesson 5 — The Nagin Move & Snake Arms", desc: "Iconic arm waves and coordination." },
                    { title: "Lesson 6 — Bhangra-Inspired Moves", desc: "Dhol step and Punjabi hop sequences." },
                    { title: "Lesson 7 — Filmy Expressions & Acting", desc: "Joy, flirtation, and energy drill." },
                    { title: "Lesson 8 — Mini Bollywood Routine #1", desc: "Full beginner routine breakdown." }
                ]
            },
            {
                unit: "🟠 MODULE 3 — Zumba Fitness Blast (Week 3)",
                focus: "Burn calories while having fun",
                chapters: [
                    { title: "Lesson 9 — Cumbia & Reggaeton Basics", desc: "Hip isolations and bounce steps." },
                    { title: "Lesson 10 — Full Body Zumba Combos", desc: "High energy coordination drills." },
                    { title: "Lesson 11 — Cool-Down & Stretching", desc: "Recovery and breathing techniques." },
                    { title: "Lesson 12 — Your First 20-Min Zumba Workout", desc: "Follow-along beginner session." }
                ]
            },
            {
                unit: "🔴 MODULE 4 — Bollywood Intermediate (Week 4)",
                focus: "Level up your vocabulary",
                chapters: [
                    { title: "Lesson 13 — Garba & Dandiya Steps", desc: "Festive season steps and timing." },
                    { title: "Lesson 14 — Floor Moves & Transitions", desc: "Level changes and smooth transitions." },
                    { title: "Lesson 15 — Group Dance Formations", desc: "Wedding group dance structures." },
                    { title: "Lesson 16 — Mini Bollywood Routine #2", desc: "Faster tempo routine breakdown." }
                ]
            },
            {
                unit: "🔴 MODULE 5 — Zumba Advanced (Week 5)",
                focus: "Build your 30-minute stamina",
                chapters: [
                    { title: "Lesson 17 — Samba & Cha-Cha Style", desc: "Footwork with Bollywood flavour." },
                    { title: "Lesson 18 — High Intensity Intervals", desc: "HIIT-style Zumba bursts." },
                    { title: "Lesson 19 — Zumba Bollywood Fusion", desc: "Celoris signature fusion style." },
                    { title: "Lesson 20 — Build Your Own Routine", desc: "Move sequencing template." }
                ]
            },
            {
                unit: "🌟 MODULE 6 — Final Performance (Week 6)",
                focus: "Your graduation routine",
                chapters: [
                    { title: "Lesson 21 — Choreography Masterclass", desc: "Full 2.5-minute Bollywood routine." },
                    { title: "Lesson 22 — Rehearsal & Corrections", desc: "Performance tips and energy drill." },
                    { title: "Lesson 23 — Zumba Final Class", desc: "30-minute full workout session." },
                    { title: "Lesson 24 — Graduation", desc: "Earning your Celoris Certificate." }
                ]
            }
        ],
        faqs: [
            {
                question: "Do I need any prior dance experience?",
                answer: "No, this course is designed specifically for complete beginners with zero experience."
            },
            {
                question: "How long is my access to the course?",
                answer: "With the Basic plan you get 6 months access. Premium gives you lifetime access."
            },
            {
                question: "Is there a certificate provided?",
                answer: "Yes, upon completion of the course and final performance, you will receive a Celoris Course Completion Certificate."
            },
            {
                question: "What language is the course in?",
                answer: "The course is taught in 'Hinglish' (a mix of Hindi and English) to make it easy to understand for everyone in India."
            }
        ]
    }

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Course",
        "name": "Bollywood & Zumba for Beginners",
        "description": "6-week Bollywood and Zumba dance course for beginners.",
        "provider": {
            "@type": "Organization",
            "name": "Celoris Designs LLP",
            "sameAs": "https://celoris.in"
        },
        "educationalLevel": "Beginner",
        "offers": [
            {
                "@type": "Offer",
                "category": "Paid",
                "price": "999.00",
                "priceCurrency": "INR",
                "url": "https://celoris.in/courses/bollywood-zumba-dance-for-beginners"
            }
        ]
    }

    return (
        <div className="min-h-screen bg-[#050810] text-slate-300 py-8 selection:bg-emerald-500/30">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="container max-w-7xl mx-auto px-4">
                {/* Breadcrumb */}
                <div className="flex items-center space-x-2 text-sm text-slate-500 mb-6">
                    <Link href="/" className="hover:text-emerald-500">Home</Link>
                    <span>/</span>
                    <Link href="/learn" className="hover:text-emerald-500">Learn</Link>
                    <span>/</span>
                    <Link href="/learn/courses" className="hover:text-emerald-500">Courses</Link>
                    <span>/</span>
                    <span className="text-white line-clamp-1">{courseData.title}</span>
                </div>

                <Link href="/learn/courses" className="inline-flex items-center text-slate-500 hover:text-emerald-500 mb-6 group">
                    <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Courses
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        <div>
                            <div className="flex flex-wrap items-center gap-3 mb-6">
                                <span className="bg-emerald-500/20 text-emerald-400 px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase border border-emerald-500/30">Dance & Fitness</span>
                                <span className="bg-white/5 px-4 py-1.5 rounded-full text-xs font-bold border border-white/5">Certified Course</span>
                                <span className="bg-yellow-500/20 text-yellow-500 px-4 py-1.5 rounded-full text-xs font-bold border border-yellow-500/30">Hinglish</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight tracking-tighter italic">
                                {courseData.title}
                            </h1>
                            <div className="bg-[#0a0f1d] p-8 rounded-[2.5rem] border-l-8 border-emerald-500 shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-5">
                                    <Music size={120} />
                                </div>
                                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-emerald-500 mb-4">Course Intent</h2>
                                <p className="text-lg md:text-xl text-slate-200 leading-relaxed font-bold italic relative z-10">
                                    "{courseData.summary}"
                                </p>
                            </div>
                        </div>

                        {/* Course Image */}
                        <Card className="overflow-hidden border-none bg-transparent">
                            <div className="aspect-video relative rounded-[3rem] overflow-hidden border border-white/10 shadow-3xl">
                                <img
                                    src="/course-dance-bollywood-zumba.png"
                                    alt="Bollywood & Zumba Dance Beginners Course - Celoris"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#050810] via-transparent to-transparent opacity-60" />
                            </div>
                        </Card>

                        {/* What You'll Learn */}
                        <Card className="bg-[#0a0f1d] border-white/5 rounded-[3rem] p-4 md:p-8">
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-3 text-white text-3xl font-black italic uppercase tracking-tighter">
                                    <Zap className="h-8 w-8 text-emerald-500" />
                                    <span>Outcome & Mastery</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {courseData.learning_outcomes.map((item, index) => (
                                        <li key={index} className="flex items-start space-x-4 group">
                                            <div className="mt-1 bg-emerald-500/20 p-2 rounded-xl border border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-black transition-all">
                                                <CheckCircle className="h-4 w-4" />
                                            </div>
                                            <span className="text-slate-300 font-bold leading-relaxed">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>

                        {/* Curriculum */}
                        <Card className="bg-[#0a0f1d] border-white/5 rounded-[3rem] p-4 md:p-8">
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-3 text-white text-3xl font-black italic uppercase tracking-tighter">
                                    <BookOpen className="h-8 w-8 text-emerald-500" />
                                    <span>Curriculum Roadmap</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Accordion type="single" collapsible className="space-y-4">
                                    {courseData.syllabus.map((unit, index) => (
                                        <AccordionItem key={index} value={`item-${index}`} className="border-white/5 bg-white/5 px-6 md:px-10 rounded-[2rem] overflow-hidden">
                                            <AccordionTrigger className="text-left font-black text-white hover:no-underline py-8 text-xl">
                                                {unit.unit}
                                            </AccordionTrigger>
                                            <AccordionContent className="pb-8 space-y-6">
                                                <p className="text-emerald-500 font-bold uppercase tracking-widest text-xs mb-4">Module Focus: {unit.focus}</p>
                                                <div className="space-y-4 pl-4 border-l-2 border-emerald-500/30">
                                                    {unit.chapters.map((chapter, cIndex) => (
                                                        <div key={cIndex} className="relative group">
                                                            <div className="absolute -left-[1.35rem] top-2 w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                                            <h3 className="text-lg font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors">{chapter.title}</h3>
                                                            {/* @ts-ignore */}
                                                            <p className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">{chapter.desc || chapter.content}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </CardContent>
                        </Card>

                        {/* Requirements */}
                        <Card className="bg-[#0a0f1d] border-white/5 rounded-[3rem] p-8">
                            <CardTitle className="flex items-center space-x-3 text-white text-2xl font-black uppercase tracking-tighter mb-8 italic">
                                <Layout className="h-6 w-6 text-emerald-500" />
                                <span>Requirements</span>
                            </CardTitle>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {courseData.requirements.map((req, i) => (
                                    <div key={i} className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                                        <div className="h-2 w-2 rounded-full bg-emerald-500" />
                                        <span className="font-bold text-sm">{req}</span>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* FAQs */}
                        <Card className="bg-[#0a0f1d] border-white/5 rounded-[3rem] p-8">
                            <CardTitle className="flex items-center space-x-3 text-white text-2xl font-black uppercase tracking-tighter mb-8 italic">
                                <HelpCircle className="h-6 w-6 text-emerald-500" />
                                <span>Common Queries</span>
                            </CardTitle>
                            <Accordion type="single" collapsible className="space-y-3">
                                {courseData.faqs.map((faq, index) => (
                                    <AccordionItem key={index} value={`faq-${index}`} className="border-white/5">
                                        <AccordionTrigger className="text-left font-bold text-white hover:no-underline">{faq.question}</AccordionTrigger>
                                        <AccordionContent className="text-slate-400 leading-relaxed text-base pt-2">
                                            {faq.answer}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8 space-y-6">
                            {/* Stats Card */}
                            <Card className="bg-[#0d1426] border-2 border-emerald-500/30 rounded-[3rem] p-8 shadow-3xl overflow-hidden relative group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-emerald-500/20 transition-all" />
                                <div className="relative z-10">
                                    <div className="text-center mb-8">
                                        <div className="text-5xl font-black text-white mb-2 leading-none italic tracking-tighter">₹999</div>
                                        <div className="text-emerald-500 font-black uppercase tracking-[0.2em] text-[10px] italic">One-Time Enrolment</div>
                                    </div>

                                    <div className="space-y-4 mb-8">
                                        {[
                                            { icon: <Clock className="h-4 w-4" />, text: "6 Weeks Access" },
                                            { icon: <Play className="h-4 w-4" />, text: "24 HD Video Lessons" },
                                            { icon: <Users className="h-4 w-4" />, text: "Hinglish Language" },
                                            { icon: <Star className="h-4 w-4" />, text: "Completion Certificate" }
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-center gap-4 text-slate-300 font-bold text-sm bg-white/5 p-4 rounded-2xl border border-white/5 transition-colors hover:bg-white/10">
                                                <div className="text-emerald-500">{item.icon}</div>
                                                {item.text}
                                            </div>
                                        ))}
                                    </div>

                                    <CourseInquiryDialog
                                        courseTitle={courseData.title}
                                        buttonClassName="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-widest h-16 rounded-[1.5rem] shadow-xl shadow-emerald-500/25 text-lg"
                                    />
                                    <p className="text-center text-[9px] font-black text-slate-600 uppercase tracking-widest mt-4">Safe & Secure Payment Enrolment</p>
                                </div>
                            </Card>

                            {/* Instructor Card */}
                            <Card className="bg-[#0a0f1d] border-white/5 rounded-[3rem] p-8">
                                <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-emerald-500 mb-8 italic">Academy Profile</CardTitle>
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-emerald-400 to-cyan-600 flex items-center justify-center text-white font-black text-xl border-2 border-white/10 shadow-lg">C</div>
                                    <div>
                                        <h3 className="font-black text-white text-lg leading-none mb-1">Celoris Dance</h3>
                                        <p className="text-[10px] text-emerald-500 uppercase font-black tracking-widest">Official Studio</p>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-400 font-medium leading-relaxed mb-6">
                                    Bringing India's best dance trainers to you. Our curriculum is designed by professionals to make learning fun, accessible, and structured.
                                </p>
                                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                                    <div className="flex items-center gap-2">
                                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                        <span className="text-white font-black text-sm">4.9</span>
                                    </div>
                                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">1,200+ Learners</div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
