"use client"

import { useEffect } from "react"
import { ArrowLeft, Clock, Users, Star, Award, Play, CheckCircle, BookOpen, Zap, Lightbulb, Cpu, Radio, BarChart, Server, Bot, Database, Code, Terminal, Layers, Brain, FlaskConical, Filter, Video, Music, Type, Wand2, Languages, Smartphone, PenTool, Mic, Calendar, Settings } from "lucide-react"
import { CourseInquiryDialog } from "@/components/CourseInquiryDialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function AIToolsContentCreation() {
    useEffect(() => {
        document.title = "AI Tools for Content Creation | Celoris"

        const metaDescription = document.querySelector('meta[name="description"]')
        const descriptionText = "Learn how to use the most powerful free and affordable AI tools to create text, images, videos, audio, and social media content — faster and smarter than ever."
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
        title: "AI Tools for Content Creation",
        subtitle: "From Zero to AI-Powered Creator — For Indian Students, Freelancers & Professionals",
        description:
            "The AI Tools for Content Creation course is a hands-on, project-based program designed specifically for Indian creators, marketers, freelancers, and students. You will learn how to use the most powerful free and affordable AI tools to create text, images, videos, audio, and social media content — faster and smarter than ever.",
        students: 2150,
        rating: 4.9,
        duration: "8 Weeks",
        price: 2999,
        currency: "INR",
        provider: "Celoris Team",
        badges: ["Beginner → Intermediate", "8 Weeks", "Hindi + English"],
        stats: [
            { label: "Duration", value: "8 Weeks" },
            { label: "Lessons", value: "45+" },
            { label: "Modules", value: "8 Modules" },
            { label: "Language", value: "Hindi + English" },
        ],
        learning_outcomes: [
            "Write viral captions, blog posts, and scripts using AI in minutes",
            "Generate professional images and thumbnails without Photoshop skills",
            "Edit and produce Reels, Shorts, and YouTube videos using AI editors",
            "Create AI-powered voiceovers, podcasts, and audio content",
            "Build a complete content calendar and social media strategy with AI",
            "Automate repetitive content tasks using AI workflows",
            "Build a portfolio of AI-generated content to attract clients"
        ],
        requirements: [
            "No prior experience in AI or content creation required",
            "Basic smartphone or laptop with internet connection",
            "Willingness to practise — this is a hands-on course",
        ],
        modules: [
            {
                number: 1,
                title: "Introduction to AI & the Creator Mindset",
                subtitle: "Week 1: Foundations and Toolkit Setup",
                icon: "Brain",
                duration: "4 hrs",
                topics: [
                    "What is Generative AI? — Plain Language Explanation",
                    "How AI is Changing Content Creation in India",
                    "Overview of the AI Tools Ecosystem (Free vs Paid)",
                    "Setting Up Your AI Toolkit — Accounts, Apps & Extensions",
                    "Prompt Engineering 101 — How to Talk to AI",
                    "Common Mistakes Beginners Make with AI Tools",
                    "Project: Write your first AI prompt & generate content",
                ],
            },
            {
                number: 2,
                title: "AI for Writing — Blogs, Captions & Scripts",
                subtitle: "Week 1–2: Master AI Writing Assistants",
                icon: "Type",
                duration: "6 hrs",
                topics: [
                    "Writing Viral Instagram & LinkedIn Captions with ChatGPT",
                    "YouTube Script Writing Using AI",
                    "Blogging with AI — Draft in 20 Minutes",
                    "Hinglish Content: Making AI Write for Indian Audience",
                    "Repurposing One Idea into 10 Pieces of Content",
                    "Editing & Fact-Checking AI-Generated Content",
                    "SEO Writing with AI — Keywords & Meta Descriptions",
                    "Project: Write a full blog post + 5 social captions",
                ],
            },
            {
                number: 3,
                title: "AI Image Generation — Thumbnails & Creatives",
                subtitle: "Week 2–3: Visual Creation Without Designers",
                icon: "PenTool",
                duration: "6 hrs",
                topics: [
                    "Canva Magic Studio — AI Design for Social Media",
                    "Adobe Firefly — Generating & Editing Images",
                    "Ideogram & Leonardo AI for High-Quality Visuals",
                    "Prompt Techniques for Indian Aesthetics",
                    "Creating YouTube Thumbnails That Get Clicks",
                    "Brand Kit Creation Using AI",
                    "Project: Build a complete social media visual kit",
                ],
            },
            {
                number: 4,
                title: "AI Video Editing — Reels, Shorts & YouTube",
                subtitle: "Week 3–4: AI-Powered Video Production",
                icon: "Video",
                duration: "8 hrs",
                topics: [
                    "CapCut AI Masterclass — Auto-Captions & Effects",
                    "InVideo AI — Convert Script to Video in Minutes",
                    "VEED.io — Auto Subtitles for Indian Languages",
                    "Descript — Edit Video by Editing Text",
                    "OpusClip — 1 Long Video into 10 Short Clips",
                    "Canva AI Video Creation",
                    "AI B-Roll & Stock Footage Selection",
                    "Project: Create a 60-second Reel + YouTube video",
                ],
            },
            {
                number: 5,
                title: "AI Audio — Voiceovers, Podcasts & Music",
                subtitle: "Week 4–5: High-Quality Audio Production",
                icon: "Mic",
                duration: "5 hrs",
                topics: [
                    "ElevenLabs — Realistic Hindi & English Voiceovers",
                    "Murf AI — Voiceovers for Explainer Videos",
                    "Adobe Podcast AI — Enhance Audio Instantly",
                    "Suno AI — Generate Background Music",
                    "Faceless YouTube Channels — Audio + Video Workflow",
                    "Project: Create a 3-minute voiceover explainer video",
                ],
            },
            {
                number: 6,
                title: "AI for Social Media Strategy & Growth",
                subtitle: "Week 5–6: Data-Driven Content Strategy",
                icon: "BarChart",
                duration: "6 hrs",
                topics: [
                    "Building a 30-Day Content Calendar with AI",
                    "Hashtag Research & Trend Analysis Using AI",
                    "Instagram & YouTube SEO with AI",
                    "Predis.ai & Buffer AI — Schedule & Analyse",
                    "Creating a Personal Brand Strategy",
                    "AI-Powered A/B Testing",
                    "Project: Build a complete 30-day content strategy",
                ],
            },
            {
                number: 7,
                title: "AI Automation & Content Workflows",
                subtitle: "Week 6–7: Scaling Your Content Machine",
                icon: "Settings",
                duration: "5 hrs",
                topics: [
                    "Introduction to AI Automation",
                    "Notion AI — Your Content Hub",
                    "Zapier Basics — Connect AI Tools",
                    "Gamma.app — Presentations & Reports",
                    "Building a Content Repurposing Workflow",
                    "Project: Build an automated content pipeline",
                ],
            },
            {
                number: 8,
                title: "Capstone Project & Portfolio Building",
                subtitle: "Week 7–8: Monetizing Your AI Skills",
                icon: "Award",
                duration: "6 hrs",
                topics: [
                    "Positioning Yourself as an AI Content Creator",
                    "Building Your Portfolio",
                    "Finding Clients — Upwork, Fiverr & Local",
                    "Pricing Your Services — INR Rate Card",
                    "Creating a Media Kit Using AI",
                    "CAPSTONE: Full AI Content Campaign for a Brand",
                ],
            },
        ],
        projects: [
            {
                title: "AI Writing Assistant",
                description: "Write SEO-optimized blogs and engaging social media captions using ChatGPT and Claude.",
                tools: "ChatGPT, Claude, Notion AI",
                icon: "Type",
            },
            {
                title: "Visual Brand Kit",
                description: "Design a complete brand identity and social media creatives without Photoshop.",
                tools: "Midjourney, Canva, Firefly",
                icon: "PenTool",
            },
            {
                title: "Automated Video Production",
                description: "Create faceless videos and viral reels using AI voiceovers and auto-captions.",
                tools: "CapCut, ElevenLabs, OpusClip",
                icon: "Video",
            },
            {
                title: "30-Day Content Engine",
                description: "Build an automated workflow that generates, schedules, and analyzes content.",
                tools: "Zapier, Buffer, Predis.ai",
                icon: "Settings",
            },
            {
                title: "Capstone Campaign",
                description: "A complete AI-powered content campaign including text, images, video, and strategy.",
                tools: "Full Stack AI Toolkit",
                icon: "FlaskConical",
            },
        ],
        faq: [
            {
                question: "Do I need paid subscriptions for these AI tools?",
                answer:
                    "Most tools we cover have robust free tiers perfectly suited for learning and initial projects. We'll show you how to maximize free plans and when it's actually worth upgrading.",
            },
            {
                question: "Is this course suitable for total beginners?",
                answer:
                    "Yes! We start from the absolute basics of what AI is and how to talk to it (prompt engineering) before moving on to advanced workflows.",
            },
            {
                question: "Will I learn tools specifically for Hindi/Indian content?",
                answer:
                    "Absolutely. We have specific modules on generating Hinglish content, using AI for Indian aesthetics, and generating realistic Hindi voiceovers.",
            },
            {
                question: "How do the practical projects work?",
                answer:
                    "Each module ends with a hands-on project (e.g., generating 30 days of captions, producing a reel). Your final Capstone project will combine all skills into a complete portfolio piece.",
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
            "AI Content Creation",
            "ChatGPT & Claude",
            "AI Image Generation (Canva, Firefly)",
            "AI Video Editing (CapCut, InVideo)",
            "AI Audio & Voiceovers (ElevenLabs)",
            "Social Media Strategy",
            "Workflow Automation",
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
            case "PenTool": return PenTool
            case "Mic": return Mic
            case "Calendar": return Calendar
            case "Settings": return Settings
            case "Award": return Award
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
                                <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase italic">
                                    8 Weeks Intensive
                                </span>
                            </div>
                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white italic uppercase tracking-tighter leading-[0.9]">
                                <span className="block">AI Tools for</span>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-500 block mt-2">Content Creation</span>
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
                            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
                            <Card className="relative overflow-hidden border-0 bg-[#0d1321]/40 backdrop-blur-3xl rounded-[2.5rem] shadow-3xl">
                                <div className="aspect-video relative overflow-hidden flex items-center justify-center bg-[#00120d]">
                                    <img
                                        src="/Aicontentcreation.png"
                                        alt="AI Tools for Content Creation Course"
                                        className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/50 to-transparent opacity-80" />
                                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 mix-blend-overlay" />
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
                                                        <div className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-1 italic">Module {module.number}</div>
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
                                <div className="p-3 bg-purple-500/10 rounded-2xl border border-purple-500/20">
                                    <FlaskConical className="h-8 w-8 text-purple-500" />
                                </div>
                                Featured Projects
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {courseData.projects.map((item, index) => {
                                    const Icon = getIcon(item.icon)
                                    return (
                                        <Card key={index} className="bg-gradient-to-br from-[#0d1321] to-[#00120d] border-white/5 hover:border-purple-500/30 transition-all duration-500 group rounded-[2.5rem] shadow-2xl">
                                            <CardContent className="pt-10 text-center h-full flex flex-col px-8 pb-8">
                                                <div className="mx-auto bg-white/5 p-5 w-fit rounded-2xl border border-white/10 mb-6 group-hover:scale-110 group-hover:border-purple-500/30 transition-all duration-500">
                                                    <Icon className="h-10 w-10 text-purple-500" />
                                                </div>
                                                <h3 className="text-lg font-black text-white italic uppercase mb-3 tracking-tighter">{item.title}</h3>
                                                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-6 flex-grow leading-relaxed italic">{item.description}</p>
                                                <div className="text-[9px] font-black bg-purple-500/10 p-3 rounded-xl border border-purple-500/20 text-purple-400 tracking-[0.2em] uppercase italic">
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
                        <div className="p-10 rounded-[3rem] bg-gradient-to-br from-emerald-500/10 via-blue-500/10 to-purple-500/10 border border-white/5 relative overflow-hidden group shadow-3xl">
                            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-125 transition-transform duration-1000 group-hover:rotate-12">
                                <Bot className="h-40 w-40 text-white" />
                            </div>
                            <h3 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-6 relative z-10">Start Creating Today</h3>
                            <p className="text-lg text-slate-400 leading-relaxed italic font-bold uppercase tracking-wider relative z-10">
                                "The fastest way to grow your brand and career is by mastering AI tools. Join the next generation of AI-powered creators."
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
                                        <div className="text-emerald-500 font-black tracking-[0.3em] uppercase text-[10px] italic">Starting From</div>
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
                                            { icon: Code, text: "Hands-on Projects", color: "text-blue-500" },
                                            { icon: Languages, text: "Hindi + English", color: "text-purple-500" },
                                            { icon: Clock, text: "8 Weeks Access", color: "text-orange-500" },
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
                                        The Celoris team specializes in cutting-edge AI technologies, helping professionals and businesses leverage AI to 10x their productivity and output.
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
