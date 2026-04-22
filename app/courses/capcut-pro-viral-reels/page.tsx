"use client"

import { useEffect } from "react"
import { ArrowLeft, Clock, Users, Star, Award, Play, CheckCircle, BookOpen, Zap, Lightbulb, Cpu, Radio, BarChart, Server, Bot, Database, Code, Terminal, Layers, Brain, FlaskConical, Filter, Video, Music, Type, Wand2, Languages, Smartphone } from "lucide-react"
import { CourseInquiryDialog } from "@/components/CourseInquiryDialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function CapCutProViralReels() {
    useEffect(() => {
        document.title = "CapCut Pro: Create Viral Reels in 30 Days | Celoris"

        const metaDescription = document.querySelector('meta[name="description"]')
        const descriptionText = "From zero to viral — master mobile video editing, trending effects, and content strategy with CapCut. A 30-day course for creators and freelancers. celoris.in 🇮🇳"
        if (metaDescription) {
            metaDescription.setAttribute("content", descriptionText)
        } else {
            const meta = document.createElement("meta")
            meta.name = "description"
            meta.content = descriptionText
            document.head.appendChild(meta)
        }
    }, [])

    const courseData = {
        title: "CapCut Pro: Create Viral Reels in 30 Days",
        subtitle: "From zero to viral — master mobile video editing, trending effects, and content strategy",
        description:
            "The 30-day structure is split into 4 weeks + a bonus module. Week 1 covers the foundation — interface, cuts, text, and audio. Week 2 goes into visual styling — transitions, color grading, green screen. Week 3 dives into CapCut's AI tools and advanced storytelling. Week 4 wraps with brand building, niche content styles, and freelancing. The bonus module covers the desktop workflow and a CapCut + Canva + ChatGPT content pipeline.",
        students: 1200,
        rating: 4.8,
        duration: "30 Days",
        price: 4999,
        currency: "INR",
        provider: "Celoris Team",
        badges: ["Beginner → Intermediate", "30 Days", "Mobile Editing"],
        stats: [
            { label: "Duration", value: "30 Days" },
            { label: "Projects", value: "8 Reels" },
            { label: "Modules", value: "4 Weeks + Bonus" },
            { label: "Platform", value: "Android / iOS" },
        ],
        learning_outcomes: [
            "Edit Reels under 30 minutes",
            "Use trending transitions & effects",
            "Sync video to beats automatically",
            "Create AI-powered visuals",
            "Build brand-consistent content",
            "Design thumbnail covers",
            "Post-optimized for Instagram & YouTube",
            "Freelance with editing skills"
        ],
        requirements: [
            "Smartphone (Android or iOS)",
            "CapCut app installed (Free version is fine, Pro features covered)",
            "Active Internet Connection",
            "No prior video editing experience required",
        ],
        modules: [
            {
                number: 1,
                title: "Week 1 — Foundation & Interface Mastery",
                subtitle: "Days 1–8: The core basics of video editing in CapCut",
                icon: "Smartphone",
                duration: "8 Days",
                topics: [
                    "Day 1–2: Getting Started with CapCut",
                    "Day 3–4: Cuts, Trims & Basic Edits",
                    "Day 5–6: Text, Captions & Fonts",
                    "Day 7–8: Music, Sound & Audio Mixing",
                ],
            },
            {
                number: 2,
                title: "Week 2 — Effects, Transitions & Visual Style",
                subtitle: "Days 9–16: Making your videos visually appealing",
                icon: "Wand2",
                duration: "8 Days",
                topics: [
                    "Day 9–10: Transitions That Go Viral",
                    "Day 11–12: Filters, LUTs & Colour Grading",
                    "Day 13–14: Stickers, Overlays & Motion Graphics",
                    "Day 15–16: Green Screen & Background Removal",
                ],
            },
            {
                number: 3,
                title: "Week 3 — AI Features & Advanced Techniques",
                subtitle: "Days 17–23: Leverage CapCut's advanced capabilities",
                icon: "Bot",
                duration: "7 Days",
                topics: [
                    "Day 17–18: CapCut AI Tools Deep Dive",
                    "Day 19–20: Templates & Trend Hacking",
                    "Day 21–22: Multi-layer Storytelling",
                    "Day 23: Export Settings & Platform Optimization",
                ],
            },
            {
                number: 4,
                title: "Week 4 — Content Strategy, Brand & Freelancing",
                subtitle: "Days 24–30: Monetize your skills and build a brand",
                icon: "BarChart",
                duration: "7 Days",
                topics: [
                    "Day 24–25: Building a Content Brand with CapCut",
                    "Day 26–27: Niche-Specific Reel Styles",
                    "Day 28–29: Freelancing with CapCut Skills",
                    "Day 30: Capstone: Your Viral Reel",
                ],
            },
            {
                number: "Bonus",
                title: "Bonus Module — Extra Resources for Fast Growth",
                subtitle: "Level up your workflow with complementary tools",
                icon: "Layers",
                duration: "Ongoing",
                topics: [
                    "Bonus 1: CapCut Desktop vs Mobile: Full Comparison",
                    "Bonus 2: CapCut + Canva + ChatGPT Workflow",
                ],
            },
        ],
        projects: [
            {
                title: "The Clean Cut Reel",
                description: "A seamless speaking reel with dynamic cuts and clean audio.",
                tools: "Cuts, Trims & Audio",
                icon: "Video",
            },
            {
                title: "Trending Transition Reel",
                description: "A fast-paced video utilizing viral transitions and beat syncing.",
                tools: "Transitions & Beat Sync",
                icon: "Music",
            },
            {
                title: "Green Screen Magic",
                description: "A creative reel using background removal and custom backgrounds.",
                tools: "Green Screen & Layers",
                icon: "Layers",
            },
            {
                title: "AI-Enhanced Promo",
                description: "A promotional reel generated using CapCut's AI features.",
                tools: "CapCut AI Tools",
                icon: "Bot",
            },
            {
                title: "Capstone: The Viral Reel",
                description: "A complete professional reel ready for Instagram and YouTube.",
                tools: "Full Workflow",
                icon: "FlaskConical",
            },
        ],
        faq: [
            {
                question: "Do I need the paid CapCut Pro subscription?",
                answer:
                    "No! You can follow 90% of this course using the free version of CapCut. We do cover some Pro features so you understand them, but they are not strictly required.",
            },
            {
                question: "Can I do this entirely on my phone?",
                answer:
                    "Absolutely. This course is mobile-first, focusing on the Android and iOS apps. We also include a bonus module comparing the mobile workflow to the desktop app.",
            },
            {
                question: "Will I learn how to come up with content ideas?",
                answer:
                    "Yes, Week 4 covers content strategy, finding niche styles, and our bonus module covers the CapCut + Canva + ChatGPT workflow for unlimited ideas.",
            },
            {
                question: "How much time per day does this take?",
                answer:
                    "We recommend setting aside 30-45 minutes per day to watch the lesson and practice the editing techniques.",
            },
        ],
    }

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Course",
        name: courseData.title,
        description: courseData.description,
        provider: {
            "@type": "Organization",
            name: "Celoris",
            sameAs: "https://www.celoris.in",
        },
        educationalLevel: "Beginner to Intermediate",
        teaches: [
            "Mobile Video Editing",
            "CapCut",
            "Viral Reels Creation",
            "Content Strategy",
            "Video Transitions and Effects",
            "Freelance Video Editing",
            "AI Video Tools",
        ],
    }

    const getIcon = (iconName: string) => {
        switch (iconName) {
            case "Video": return Video
            case "Wand2": return Wand2
            case "Music": return Music
            case "Filter": return Filter
            case "Type": return Type
            case "Languages": return Languages
            case "Zap": return Zap
            case "Cpu": return Cpu
            case "Layers": return Layers
            case "Terminal": return Terminal
            case "Code": return Code
            case "BarChart": return BarChart
            case "Brain": return Brain
            case "FlaskConical": return FlaskConical
            case "Bot": return Bot
            case "Database": return Database
            case "Server": return Server
            case "Smartphone": return Smartphone
            default: return Play
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
                <div className="flex items-center space-x-2 text-sm text-slate-400 mb-6 font-medium uppercase tracking-wider italic">
                    <Link href="/" className="hover:text-emerald-400 transition-colors">Home</Link>
                    <span>/</span>
                    <Link href="/learn" className="hover:text-emerald-400 transition-colors">Learn</Link>
                    <span>/</span>
                    <Link href="/learn/courses" className="hover:text-emerald-400 transition-colors">Courses</Link>
                    <span>/</span>
                    <span className="text-slate-100 line-clamp-1 italic">{courseData.title}</span>
                </div>

                <Link href="/learn/courses" className="inline-flex items-center text-slate-400 hover:text-emerald-400 mb-8 transition-all group font-black uppercase tracking-widest italic text-xs">
                    <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Courses
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-16">

                        {/* Hero Header */}
                        <div className="space-y-8">
                            <div className="flex flex-wrap gap-3 mb-4">
                                <span className="bg-emerald-500 text-black px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase italic transform -skew-x-12">
                                    Celoris · 2026 Edition
                                </span>
                                <span className="bg-blue-600/20 text-blue-400 border border-blue-500/30 px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase italic">
                                    Professional Certification
                                </span>
                                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase italic">
                                    30 Days Intensive
                                </span>
                            </div>
                            <h1 className="text-5xl md:text-8xl font-black text-white italic uppercase tracking-tighter leading-[0.9]">
                                {courseData.title.split(':').map((part, i) => (
                                    <span key={i} className={i === 1 ? "text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500 block" : "block"}>
                                        {part.trim()}{i === 0 ? ':' : ''}
                                    </span>
                                ))}
                            </h1>
                            <p className="text-xl md:text-2xl text-emerald-400/90 font-black italic uppercase tracking-tight">
                                {courseData.subtitle}
                            </p>
                            <p className="text-lg text-slate-400 leading-relaxed max-w-3xl font-medium">
                                {courseData.description}
                            </p>
                        </div>

                        {/* Hero Image */}
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
                            <Card className="relative overflow-hidden border-0 bg-[#0d1321]/40 backdrop-blur-3xl rounded-[2.5rem] shadow-3xl">
                                <div className="aspect-video relative overflow-hidden flex items-center justify-center bg-[#00120d]">
                                    <img
                                        src="/capcut.jpg"
                                        alt="CapCut Pro Video Editing Course"
                                        className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-60" />
                                    <div className="absolute flex items-center justify-center">
                                        <div className="w-20 h-20 bg-emerald-600 rounded-full flex items-center justify-center shadow-3xl shadow-emerald-600/50 hover:scale-110 transition-transform cursor-pointer">
                                            <Play className="h-8 w-8 text-white fill-current ml-1" />
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {courseData.stats.map((stat, i) => (
                                <div key={i} className="p-6 rounded-[2rem] bg-[#0d1321]/40 border border-white/5 text-center">
                                    <div className="text-3xl font-black text-white italic">{stat.value}</div>
                                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic mt-1">{stat.label}</div>
                                </div>
                            ))}
                        </div>

                        {/* Learning Outcomes */}
                        <section className="space-y-8">
                            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter flex items-center gap-4">
                                <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                                    <CheckCircle className="h-8 w-8 text-emerald-500" />
                                </div>
                                What You'll Learn
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {courseData.learning_outcomes.map((item, index) => (
                                    <div key={index} className="flex items-start gap-4 p-6 rounded-[2rem] bg-[#0d1321]/40 border border-white/5 hover:border-emerald-500/30 transition-all group">
                                        <div className="h-6 w-6 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0 mt-1 group-hover:bg-emerald-500/20 transition-colors">
                                            <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                                        </div>
                                        <span className="text-slate-300 text-sm font-bold uppercase tracking-wide leading-relaxed italic">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Curriculum */}
                        <section className="space-y-8">
                            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter flex items-center gap-4">
                                <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                                    <BookOpen className="h-8 w-8 text-blue-500" />
                                </div>
                                Course Curriculum
                            </h2>
                            <Accordion type="single" collapsible className="space-y-4">
                                {courseData.modules.map((module, index) => {
                                    const Icon = getIcon(module.icon)
                                    return (
                                        <AccordionItem key={index} value={`module-${index}`} className="border border-white/5 bg-[#0d1321]/40 rounded-[2rem] px-4 overflow-hidden shadow-xl">
                                            <AccordionTrigger className="hover:no-underline py-8">
                                                <div className="flex items-center gap-6 text-left w-full">
                                                    <div className="bg-[#00120d] p-4 rounded-2xl border border-emerald-500/20 shadow-inner">
                                                        <Icon className="h-7 w-7 text-emerald-500" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-1 italic">{module.number === "Bonus" ? "Bonus" : `Week ${module.number}`}</div>
                                                        <div className="text-xl font-black text-white uppercase italic tracking-tighter">{module.title}</div>
                                                        <div className="text-[11px] text-slate-400 font-medium mt-1 italic">{module.subtitle}</div>
                                                    </div>
                                                    <div className="hidden sm:flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase tracking-widest italic mr-6 bg-white/5 px-4 py-1.5 rounded-full">
                                                        <Clock className="h-4 w-4 text-emerald-500/50" />
                                                        {module.duration}
                                                    </div>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent className="pb-8 px-6 text-slate-400">
                                                <div className="pl-20 space-y-4 relative">
                                                    <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-emerald-500/30 via-emerald-500/10 to-transparent" />
                                                    <ul className="grid grid-cols-1 gap-4">
                                                        {module.topics.map((topic, topicIndex) => (
                                                            <li key={topicIndex} className="flex items-start gap-4 group">
                                                                <div className="h-2 w-2 rounded-full bg-emerald-500/40 mt-2.5 group-hover:bg-emerald-500 transition-colors shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                                                                <span className="text-sm font-bold uppercase tracking-widest italic group-hover:text-emerald-400 transition-colors leading-relaxed">{topic}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    )
                                })}
                            </Accordion>
                        </section>

                        {/* Projects */}
                        <section className="space-y-8">
                            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter flex items-center gap-4">
                                <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                                    <FlaskConical className="h-8 w-8 text-blue-500" />
                                </div>
                                Featured Projects
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {courseData.projects.map((item, index) => {
                                    const Icon = getIcon(item.icon)
                                    return (
                                        <Card key={index} className="bg-gradient-to-br from-[#0d1321] to-[#00120d] border-white/5 hover:border-emerald-500/30 transition-all duration-500 group rounded-[2.5rem] shadow-2xl">
                                            <CardContent className="pt-10 text-center h-full flex flex-col px-8 pb-8">
                                                <div className="mx-auto bg-white/5 p-5 w-fit rounded-2xl border border-white/10 mb-6 group-hover:scale-110 group-hover:border-emerald-500/30 transition-all duration-500">
                                                    <Icon className="h-10 w-10 text-emerald-500" />
                                                </div>
                                                <h3 className="text-lg font-black text-white italic uppercase mb-3 tracking-tighter">{item.title}</h3>
                                                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-6 flex-grow leading-relaxed italic">{item.description}</p>
                                                <div className="text-[9px] font-black bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20 text-emerald-500 tracking-[0.2em] uppercase italic">
                                                    {item.tools}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )
                                })}
                            </div>
                        </section>

                        {/* FAQ */}
                        <section className="space-y-12 bg-[#0d1321]/20 p-12 rounded-[3rem] border border-white/5 shadow-inner">
                            <div className="text-center space-y-4">
                                <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Frequently Asked Questions</h2>
                                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs italic">Everything you need to know before starting</p>
                            </div>
                            <div className="space-y-6">
                                {courseData.faq.map((item, index) => (
                                    <div key={index} className="group bg-[#0d1321]/40 p-8 rounded-[2.5rem] border border-white/5 hover:border-emerald-500/20 transition-all shadow-lg hover:shadow-emerald-500/5">
                                        <div className="flex gap-6">
                                            <div className="text-2xl font-black text-white/10 group-hover:text-emerald-500/20 transition-colors italic">Q{index + 1}</div>
                                            <div className="space-y-3">
                                                <h4 className="text-lg font-black text-white italic uppercase tracking-tight leading-tight group-hover:text-emerald-400 transition-colors">{item.question}</h4>
                                                <p className="text-slate-400 text-sm leading-relaxed font-medium">{item.answer}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Closing CTA banner */}
                        <div className="p-10 rounded-[3rem] bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border border-white/5 relative overflow-hidden group shadow-3xl">
                            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-125 transition-transform duration-1000 group-hover:rotate-12">
                                <Smartphone className="h-40 w-40 text-white" />
                            </div>
                            <h3 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-6 relative z-10">Start Creating Today</h3>
                            <p className="text-lg text-slate-400 leading-relaxed italic font-bold uppercase tracking-wider relative z-10">
                                "The fastest way to grow on social media is by mastering short-form content. Take the 30-day challenge and see your views multiply."
                            </p>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-10 space-y-10">
                            {/* Pricing Card */}
                            <Card className="relative bg-[#0d1321]/60 backdrop-blur-3xl border-white/5 rounded-[3rem] overflow-hidden shadow-3xl">
                                <CardContent className="p-10">
                                    <div className="text-center mb-10">
                                        <div className="text-3xl font-black text-white italic tracking-tighter uppercase mb-2">₹{courseData.price.toLocaleString()}</div>
                                        <div className="text-emerald-500 font-black tracking-[0.3em] uppercase text-[10px] italic">Complete 30-Day Access</div>
                                    </div>

                                    <div className="space-y-4 mb-10 text-slate-400">
                                        <CourseInquiryDialog
                                            courseTitle={courseData.title}
                                            buttonClassName="w-full h-16 text-xs font-black bg-emerald-600 hover:bg-emerald-500 text-white uppercase tracking-[0.3em] rounded-2xl shadow-3xl shadow-emerald-600/30 transition-all active:scale-95 italic"
                                        />
                                        <Link
                                            href="https://wa.me/919084718101"
                                            target="_blank"
                                            className="w-full h-14 border border-white/10 hover:bg-white/5 text-slate-300 font-black uppercase tracking-widest text-[9px] rounded-2xl flex items-center justify-center gap-3 group transition-all italic"
                                        >
                                            <Radio className="h-4 w-4 text-emerald-500 group-hover:animate-pulse" />
                                            Inquire on WhatsApp
                                        </Link>
                                    </div>

                                    <div className="space-y-6 pt-10 border-t border-white/5">
                                        {[
                                            { icon: Award, text: "Celoris Certificate", color: "text-emerald-500" },
                                            { icon: Code, text: "8 Reel Projects", color: "text-blue-500" },
                                            { icon: Smartphone, text: "Mobile-First Learning", color: "text-blue-500" },
                                            { icon: Clock, text: "30 Days of Content", color: "text-orange-500" },
                                        ].map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest italic group">
                                                <item.icon className={`h-5 w-5 ${item.color} group-hover:scale-110 transition-transform`} />
                                                <span>{item.text}</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Instructor Card */}
                            <Card className="bg-[#0d1321]/40 backdrop-blur-3xl border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                                <CardHeader className="pb-4 px-10 pt-10">
                                    <div className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2">Instructor</div>
                                    <CardTitle className="text-2xl font-black text-white italic uppercase tracking-tighter">{courseData.provider}</CardTitle>
                                </CardHeader>
                                <CardContent className="px-10 pb-10">
                                    <p className="text-xs text-slate-500 font-bold uppercase leading-relaxed italic mb-8">
                                        The Celoris creative team specializes in fast-paced content creation, helping creators and business owners turn their smartphones into a production studio.
                                    </p>
                                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest italic pt-6 border-t border-white/5">
                                        <div className="flex items-center gap-2 text-emerald-500">
                                            <Star className="h-4 w-4 fill-current" />
                                            <span>{courseData.rating} Rating</span>
                                        </div>
                                        <div className="text-slate-500">
                                            {courseData.students}+ Students
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Prerequisites Card */}
                            <div className="p-10 rounded-[2.5rem] bg-[#0d1321]/40 border border-white/5 shadow-xl">
                                <h3 className="text-white font-black italic uppercase tracking-tighter text-xl mb-6 flex items-center gap-3">
                                    <Lightbulb className="h-6 w-6 text-yellow-500" />
                                    Requirements
                                </h3>
                                <ul className="space-y-4">
                                    {courseData.requirements.map((req, index) => (
                                        <li key={index} className="flex items-start gap-3 text-[10px] font-black text-slate-500 uppercase tracking-widest italic leading-relaxed group">
                                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500/40 mt-1.5 flex-shrink-0 group-hover:bg-emerald-500 transition-colors" />
                                            <span>{req}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
