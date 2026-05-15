"use client"

import { useEffect } from "react"
import { ArrowLeft, Clock, Users, Star, Award, Play, CheckCircle, BookOpen, Zap, Lightbulb, Cpu, Radio, BarChart, Server, Bot, Database, Code, Terminal, Layers, Brain, FlaskConical, Filter, Video, Music, Type, Wand2, Languages, Image as ImageIcon, Sparkles } from "lucide-react"
import { CourseInquiryDialog } from "@/components/CourseInquiryDialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function AdobePhotoshopAI() {
    useEffect(() => {
        document.title = "Adobe Photoshop with AI — Complete Course for Designers | Celoris"

        const metaDescription = document.querySelector('meta[name="description"]')
        const descriptionText = "Supercharge your design workflow with Adobe Photoshop 2024 AI features. Master Generative Fill, Neural Filters, and AI-powered retouching in this 24-hour intensive course. celoris.in 🇮🇳"
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
        title: "Adobe Photoshop with AI",
        subtitle: "Complete Course Curriculum for Designers",
        description:
            "This course is designed for designers who already know Photoshop basics and want to supercharge their workflow using Adobe's latest AI features — including Generative Fill, Neural Filters, Firefly integration, and AI-assisted retouching. By the end, students will be creating professional-grade outputs faster and smarter.",
        students: 320,
        rating: 4.9,
        duration: "24 Hours (8 Modules)",
        price: 14999,
        currency: "INR",
        provider: "Celoris Expert Trainer",
        badges: ["Intermediate Level", "AI-Powered", "Practical Projects"],
        stats: [
            { label: "Duration", value: "24 Hours" },
            { label: "Modules", value: "8" },
            { label: "Projects", value: "8" },
            { label: "Level", value: "Intermediate" },
        ],
        learning_outcomes: [
            "Master Adobe Firefly integration within Photoshop CC 2024",
            "Use Generative Fill for complex scene edits and extensions",
            "Apply Neural Filters for client-ready, professional retouching",
            "Perform AI-powered selections and masking for hair and fur",
            "Automate repetitive retouching tasks with AI-driven pipelines",
            "Create cinematic AI text effects and generative typography",
            "Produce a 5-piece professional portfolio campaign using AI tools",
        ],
        requirements: [
            "Adobe Photoshop CC 2024 or later",
            "Adobe Firefly access (Creative Cloud subscription)",
            "Basic knowledge of layers and masks",
            "Familiarity with selection tools and adjustments",
        ],
        modules: [
            {
                number: 1,
                title: "AI in Photoshop — The Big Picture",
                subtitle: "Understanding the AI Ecosystem",
                icon: "Sparkles",
                duration: "3 Hours",
                topics: [
                    "What's new in Photoshop CC 2024",
                    "Adobe Firefly overview and integration",
                    "Understanding Generative AI credits",
                    "AI vs. manual: when to use which",
                    "Workspace setup for AI workflows",
                ],
            },
            {
                number: 2,
                title: "Generative Fill & Generative Expand",
                subtitle: "Beyond the Canvas Boundaries",
                icon: "Wand2",
                duration: "3 Hours",
                topics: [
                    "Generative Fill basics — selections and prompts",
                    "Extending canvas with Generative Expand",
                    "Prompt engineering for design contexts",
                    "Combining gen fill with manual masking",
                    "Project: Background replacement & scene extension",
                ],
            },
            {
                number: 3,
                title: "Neural Filters for Retouching",
                subtitle: "Advanced Portrait & Scene Enhancement",
                icon: "Filter",
                duration: "3 Hours",
                topics: [
                    "Smart Portrait: smoothing, expressions, gaze",
                    "Colorize: B&W to colour conversion",
                    "Style Transfer with Neural Filters",
                    "Depth Blur and Landscape Mixer",
                    "Project: Professional photo retouching series",
                ],
            },
            {
                number: 4,
                title: "AI-Powered Selection & Masking",
                subtitle: "Precision Cutting at Speed",
                icon: "Layers",
                duration: "3 Hours",
                topics: [
                    "Select Subject (AI) and Refine Edge",
                    "Remove Background in one click",
                    "Object Selection tool deep-dive",
                    "Combining AI selections with manual refinement",
                    "Project: Complex product photo isolation",
                ],
            },
            {
                number: 5,
                title: "AI Content-Aware & Sky Replacement",
                subtitle: "Perfecting Environmental Edits",
                icon: "ImageIcon",
                duration: "3 Hours",
                topics: [
                    "Content-Aware Fill with AI sampling zones",
                    "Content-Aware Scale for layout changes",
                    "Sky Replacement with AI blending",
                    "Relighting with Sky Replacement",
                    "Project: Real estate photo enhancement",
                ],
            },
            {
                number: 6,
                title: "Text Effects & Generative Type",
                subtitle: "Typography for the AI Age",
                icon: "Type",
                duration: "3 Hours",
                topics: [
                    "AI text prompt effects in Photoshop",
                    "Firefly Text-to-Image for design mockups",
                    "Wrapping text around 3D-style shapes",
                    "Using AI for logo concept generation",
                    "Project: Brand poster series with AI type",
                ],
            },
            {
                number: 7,
                title: "AI Workflow Automation",
                subtitle: "Scaling Your Design Output",
                icon: "Cpu",
                duration: "3 Hours",
                topics: [
                    "Actions and batch processing with AI tasks",
                    "Droplets for automated retouching pipelines",
                    "Scripts + AI for multi-file processing",
                    "Photoshop API & Firefly API introduction",
                    "Project: Build a 50-image batch retouch pipeline",
                ],
            },
            {
                number: 8,
                title: "Capstone: Designer Portfolio Project",
                subtitle: "Mastery in Practice",
                icon: "Award",
                duration: "3 Hours",
                topics: [
                    "Brief: full campaign asset creation (5 pieces)",
                    "Using all AI tools in a single workflow",
                    "Exporting for web, print, and social media",
                    "Peer review and trainer feedback",
                    "Building your AI Photoshop portfolio",
                ],
            },
        ],
        projects: [
            {
                title: "Scene Extension",
                description: "Extend a portrait background seamlessly using Generative Expand.",
                tools: "Generative Expand + Fill",
                icon: "Wand2",
            },
            {
                title: "Neural Retouch Series",
                description: "A series of professional retouches using Smart Portrait and Colorize.",
                tools: "Neural Filters",
                icon: "Filter",
            },
            {
                title: "Product Isolation",
                description: "Cleanly isolating a complex product subject with hair/fur details.",
                tools: "AI Selection Tools",
                icon: "Layers",
            },
            {
                title: "Real Estate Glow-up",
                description: "Enhancing property photos with AI sky replacement and relighting.",
                tools: "Sky Replacement",
                icon: "ImageIcon",
            },
            {
                title: "Capstone Campaign",
                description: "A complete 5-piece design campaign for a modern brand.",
                tools: "Photoshop AI Suite",
                icon: "Award",
            },
        ],
        faq: [
            {
                question: "Do I need prior AI experience?",
                answer:
                    "No prior AI or Firefly experience is required. However, this course assumes familiarity with Photoshop basics like layers, masks, and standard tools.",
            },
            {
                question: "Which version of Photoshop is required?",
                answer:
                    "You will need Adobe Photoshop CC 2024 or later with access to Firefly features. A Creative Cloud subscription is required to access the AI credits.",
            },
            {
                question: "Is this course live or recorded?",
                answer:
                    "Our delivery is flexible — we offer live online sessions, recorded modules, and hybrid options to suit your schedule.",
            },
            {
                question: "Will I get a certificate?",
                answer:
                    "Yes, you will receive a Celoris Certificate of Completion and a digital LinkedIn badge after successfully submitting your module projects and Capstone.",
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
        educationalLevel: "Intermediate",
        teaches: [
            "Generative Fill",
            "Neural Filters",
            "Adobe Firefly Integration",
            "AI Retouching",
            "AI Masking",
            "Workflow Automation",
        ],
    }

    const getIcon = (iconName: string) => {
        switch (iconName) {
            case "Sparkles": return Sparkles
            case "Wand2": return Wand2
            case "Filter": return Filter
            case "Layers": return Layers
            case "ImageIcon": return ImageIcon
            case "Type": return Type
            case "Cpu": return Cpu
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
                                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase italic">
                                    {courseData.badges[0]}
                                </span>
                                <span className="bg-red-500/10 text-red-400 border border-red-500/20 px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase italic">
                                    {courseData.badges[1]}
                                </span>
                                <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase italic">
                                    {courseData.badges[2]}
                                </span>
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black text-white italic uppercase tracking-tight leading-[0.9]">
                                Adobe Photoshop <br/> with <span className="ml-4">AI</span>
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
                            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
                            <Card className="relative overflow-hidden border-0 bg-[#0d1321]/40 backdrop-blur-3xl rounded-[2.5rem] shadow-3xl">
                                <div className="aspect-video relative overflow-hidden flex items-center justify-center bg-[#00120d]">
                                    <img
                                        src="/photoshop-ai-hero.png"
                                        alt="Adobe Photoshop with AI Course"
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
                                <div className="p-3 bg-purple-500/10 rounded-2xl border border-purple-500/20">
                                    <BookOpen className="h-8 w-8 text-purple-500" />
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
                                                                <div className="h-2 w-2 rounded-full bg-emerald-500/40 mt-2.5 group-hover:bg-emerald-500 transition-colors shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
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
                        <div className="p-10 rounded-[3rem] bg-gradient-to-br from-emerald-500/10 to-blue-600/10 border border-white/5 relative overflow-hidden group shadow-3xl">
                            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-125 transition-transform duration-1000 group-hover:rotate-12">
                                <ImageIcon className="h-40 w-40 text-white" />
                            </div>
                            <h3 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-6 relative z-10">Future-Proof Your Design</h3>
                            <p className="text-lg text-slate-400 leading-relaxed italic font-bold uppercase tracking-wider relative z-10">
                                "Photoshop has changed more in the last year than in the previous twenty. This course is your bridge to the AI-augmented future of design."
                            </p>
                        </div>

                        {/* Related Reading */}
                        <div className="pt-8 border-t border-white/5 space-y-6">
                            <h4 className="text-white font-black italic uppercase tracking-tighter text-xl flex items-center gap-3">
                                <FileText className="h-6 w-6 text-emerald-500" />
                                Deep Dive: Expert Insights
                            </h4>
                            <div className="grid grid-cols-1 gap-4">
                                <Link 
                                    href="/blog/adobe-photoshop-ai-guide-2025" 
                                    className="p-6 rounded-[2rem] bg-[#0d1321]/40 border border-white/5 hover:border-emerald-500/30 transition-all group flex items-center justify-between"
                                >
                                    <div className="space-y-1">
                                        <div className="text-sm font-black text-white italic uppercase tracking-tight group-hover:text-emerald-400 transition-colors">Adobe Photoshop with AI: The 2025 Guide</div>
                                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest italic">Learn how Generative Fill and Neural Filters are changing design</div>
                                    </div>
                                    <ArrowRight className="h-5 w-5 text-emerald-500 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
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
                                        <div className="text-emerald-500 font-black tracking-[0.3em] uppercase text-[10px] italic">Complete 24-Hour Intensive</div>
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
                                            { icon: Code, text: "8 Portfolio Projects", color: "text-blue-500" },
                                            { icon: Users, text: "Live / Recorded Sessions", color: "text-purple-500" },
                                            { icon: Clock, text: "24 Hours of Content", color: "text-orange-500" },
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
                                        Celoris Expert Trainers bring over 13 years of industry experience, specializing in bridging traditional design excellence with cutting-edge AI technologies.
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
