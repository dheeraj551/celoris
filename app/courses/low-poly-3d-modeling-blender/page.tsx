"use client"

import { useEffect } from "react"
import { ArrowLeft, Clock, Users, Star, Award, Play, CheckCircle, BookOpen, Zap, Lightbulb, Cpu, Radio, BarChart, Server, Bot, Database, Code, Terminal, Layers, Brain, FlaskConical, Filter, Video, Music, Type, Wand2, Languages, Smartphone, Box, Palette, Sun, Camera, Monitor, MousePointer2 } from "lucide-react"
import { CourseInquiryDialog } from "@/components/CourseInquiryDialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function LowPoly3DModelingBlender() {
    useEffect(() => {
        document.title = "Learn Low Poly 3D Modeling Using Blender | Celoris"

        const metaDescription = document.querySelector('meta[name="description"]')
        const descriptionText = "Master Low Poly 3D Modeling in Blender. From zero to portfolio-ready 3D artist in 8 weeks. Build games assets, environments, and characters. celoris.in 🇮🇳"
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
        title: "Learn Low Poly 3D Modeling: Using Blender",
        subtitle: "From Zero to Portfolio-Ready 3D Artist",
        description:
            "Low poly 3D modeling is one of the most in-demand art styles in game design, animation, product visualization, and social media content. With Blender — a free, professional-grade 3D software — you can create stunning low poly artwork without spending a single rupee on tools. This course takes you from absolute beginner to a confident 3D artist who can design, texture, light, and render beautiful low poly scenes ready for your portfolio or client work.",
        students: 850,
        rating: 4.9,
        duration: "8 Weeks",
        price: 5999,
        currency: "INR",
        provider: "Celoris Team",
        badges: ["Beginner Level", "8 Weeks", "40+ Lessons"],
        stats: [
            { label: "Duration", value: "8 Weeks" },
            { label: "Lessons", value: "40+ Lessons" },
            { label: "Content", value: "6 hrs+" },
            { label: "Level", value: "Beginner" },
        ],
        learning_outcomes: [
            "Install and configure Blender for first use",
            "Navigate the 3D viewport confidently with keyboard shortcuts",
            "Understand the difference between Object Mode and Edit Mode",
            "Master key modeling tools: Extrude, Loop Cut, Bevel, Knife",
            "Build nature assets like mountains, water, and trees",
            "Design stylized characters with minimal polygons",
            "Apply materials, textures, and gradients",
            "Setup cinematic lighting and rendering in Cycles & EEVEE",
            "Export for Unity, Unreal, and Web (GLTF/FBX)",
            "Build a professional portfolio on ArtStation & Behance"
        ],
        requirements: [
            "Laptop or desktop (Windows / Mac / Linux)",
            "Blender (free download — blender.org)",
            "No prior 3D or coding knowledge required",
            "Mouse with scroll wheel recommended",
            "Willingness to practice and experiment",
        ],
        modules: [
            {
                number: 1,
                title: "Blender Basics & Interface",
                subtitle: "Get comfortable with Blender's powerful (and free!) interface",
                icon: "Monitor",
                duration: "45 min",
                topics: [
                    "Welcome to Blender — Download, Install & First Launch",
                    "Understanding the Interface: Viewport, Outliner, Properties",
                    "Navigation — Rotate, Pan, Zoom, Numpad Shortcuts",
                    "Object Mode vs Edit Mode — The Core Concept",
                    "Your First Object: Creating, Moving, Scaling, Rotating",
                ],
            },
            {
                number: 2,
                title: "Low Poly Fundamentals",
                subtitle: "Understand the philosophy of low poly art — less is more",
                icon: "Box",
                duration: "50 min",
                topics: [
                    "What is Low Poly? Style, History & Where It's Used Today",
                    "Key Modeling Tools: Extrude, Loop Cut, Bevel, Knife",
                    "Flat Shading vs Smooth Shading — The Low Poly Secret",
                    "Building a Low Poly Rock — Your First Asset",
                    "Building a Low Poly Tree — Cones, Cylinders & Stylization",
                ],
            },
            {
                number: 3,
                title: "Nature & Environment Assets",
                subtitle: "Build a full collection of nature assets for game art",
                icon: "Layers",
                duration: "55 min",
                topics: [
                    "Low Poly Mountains & Terrain Using Displacement",
                    "Water Surface — Flat Polygon Ocean Technique",
                    "Stylized Clouds — Blob Modeling Technique",
                    "Building a Low Poly House / Cabin",
                    "Building a Low Poly Boat & Simple Props",
                    "Mini Scene: Island with All Assets Combined",
                ],
            },
            {
                number: 4,
                title: "Characters & Organic Shapes",
                subtitle: "Learn to build expressive characters with minimal polygons",
                icon: "Bot",
                duration: "50 min",
                topics: [
                    "Low Poly Human Figure — Proportions & Body Blocking",
                    "Hands, Feet & Face — Stylizing for Low Poly",
                    "Low Poly Animal: Fox or Wolf (Beginner-Friendly)",
                    "Rigging Basics — Simple Armature for Pose",
                    "Final Character Pose & Expression Tips",
                ],
            },
            {
                number: 5,
                title: "Texturing & Materials",
                subtitle: "Create beautiful flat-color and gradient materials",
                icon: "Palette",
                duration: "45 min",
                topics: [
                    "Introduction to Blender Materials & Shader Editor",
                    "Flat Color Materials — The Low Poly Palette System",
                    "Creating a Color Palette Texture (1 Image, Many Colors)",
                    "UV Unwrapping Basics for Low Poly Assets",
                    "Gradient & Emission Materials for Stylized Glow Effects",
                ],
            },
            {
                number: 6,
                title: "Lighting & Scene Composition",
                subtitle: "Learn the lighting setups used by professional artists",
                icon: "Sun",
                duration: "45 min",
                topics: [
                    "Blender Lighting Basics: Sun, Point, Spot, Area Lights",
                    "Three-Point Lighting for Low Poly Characters",
                    "HDRI Lighting — Instant Professional Atmosphere",
                    "Camera Setup: Focal Length, Depth of Field, Composition Rules",
                    "Scene Mood: Sunset, Midnight, Sunrise Color Setups",
                ],
            },
            {
                number: 7,
                title: "Rendering & Export",
                subtitle: "Optimize for speed and export for game engines",
                icon: "Camera",
                duration: "40 min",
                topics: [
                    "Cycles vs EEVEE — Which to Use & When",
                    "Render Settings: Resolution, Samples, Output Format",
                    "Post-Processing in Blender's Compositor",
                    "Exporting for Unity / Unreal / Godot (.FBX, .OBJ, .GLTF)",
                    "Turntable Animation Render for Portfolio (360 spin)",
                ],
            },
            {
                number: 8,
                title: "Portfolio Project & Showcase",
                subtitle: "Plan, build, and present a complete low poly scene",
                icon: "Award",
                duration: "60 min",
                topics: [
                    "Planning Your Portfolio Scene — Mood Board & Reference",
                    "Building the Scene — Guided Open Project",
                    "Lighting & Final Render — Making It Portfolio-Ready",
                    "Writing a Project Description for Behance / ArtStation",
                    "Sharing Your Work — Platforms, Hashtags & Community",
                ],
            },
        ],
        projects: [
            {
                title: "Low Poly Island",
                description: "A complete floating island scene with mountains and trees.",
                tools: "Environment Modeling",
                icon: "Layers",
            },
            {
                title: "Stylized Character",
                description: "A low poly human or animal character ready for animation.",
                tools: "Organic Modeling",
                icon: "Bot",
            },
            {
                title: "Product Mockup",
                description: "Clean product visualization using low poly aesthetics.",
                tools: "Stylized Materials",
                icon: "Palette",
            },
            {
                title: "Portfolio Piece",
                description: "A final high-quality scene based on your own concept.",
                tools: "Full Workflow",
                icon: "Award",
            },
        ],
        faq: [
            {
                question: "Do I need a powerful PC to run Blender?",
                answer:
                    "Blender runs on most modern laptops and desktops. For this course, even a mid-range PC (8GB RAM, integrated graphics) can handle the low poly scenes we create. A dedicated GPU helps with rendering speed but is not required.",
            },
            {
                question: "Is Blender really free? Will there be hidden costs?",
                answer:
                    "Yes, Blender is 100% free and open source — no subscription, no watermarks, no hidden fees. It is used professionally by studios worldwide.",
            },
            {
                question: "How much time do I need per week?",
                answer:
                    "We recommend 4-5 hours per week to complete exercises and watch lessons at a comfortable pace. The course can be finished in 8 weeks following this schedule.",
            },
            {
                question: "Can I use this for game development?",
                answer:
                    "Absolutely. Low poly is the dominant art style in indie game development. Assets created in this course can be exported directly to Unity, Unreal Engine, or Godot.",
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
        educationalLevel: "Beginner",
        teaches: [
            "3D Modeling",
            "Blender",
            "Low Poly Art",
            "Game Asset Creation",
            "Texturing and Materials",
            "Lighting and Rendering",
            "Portfolio Design",
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
            case "Monitor": return Monitor
            case "Box": return Box
            case "Palette": return Palette
            case "Sun": return Sun
            case "Camera": return Camera
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
                                    Digital Art Certification
                                </span>
                                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase italic">
                                    8 Weeks Intensive
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
                                        src="/blender.png"
                                        alt="Learn Low Poly 3D Modeling Blender Course"
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
                                <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                                    <FlaskConical className="h-8 w-8 text-blue-500" />
                                </div>
                                What You Will Build
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

                        {/* Career Opportunities */}
                        <section className="space-y-8">
                            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter flex items-center gap-4">
                                <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                                    <Zap className="h-8 w-8 text-emerald-500" />
                                </div>
                                Career Opportunities
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="p-8 rounded-[2.5rem] bg-[#0d1321]/40 border border-white/5">
                                    <h4 className="text-white font-black italic uppercase mb-4 tracking-tighter">Freelance</h4>
                                    <ul className="text-xs text-slate-500 space-y-3 font-bold uppercase tracking-wider italic">
                                        <li>• Game Assets on Fiverr/Upwork</li>
                                        <li>• Brand Illustrations</li>
                                        <li>• 3D Logos & Mockups</li>
                                        <li>• Etsy 3D Print Files</li>
                                    </ul>
                                </div>
                                <div className="p-8 rounded-[2.5rem] bg-[#0d1321]/40 border border-white/5">
                                    <h4 className="text-white font-black italic uppercase mb-4 tracking-tighter">Job Roles</h4>
                                    <ul className="text-xs text-slate-500 space-y-3 font-bold uppercase tracking-wider italic">
                                        <li>• Junior 3D Game Artist</li>
                                        <li>• 3D Motion Designer</li>
                                        <li>• Product Visualization Artist</li>
                                        <li>• AR/VR Content Creator</li>
                                    </ul>
                                </div>
                                <div className="p-8 rounded-[2.5rem] bg-[#0d1321]/40 border border-white/5">
                                    <h4 className="text-white font-black italic uppercase mb-4 tracking-tighter">Side Income</h4>
                                    <ul className="text-xs text-slate-500 space-y-3 font-bold uppercase tracking-wider italic">
                                        <li>• Sell on Unity Asset Store</li>
                                        <li>• TurboSquid Asset Sales</li>
                                        <li>• YouTube Tutorials</li>
                                        <li>• NFT Art Platforms</li>
                                    </ul>
                                </div>
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
                        <div className="p-10 rounded-[3rem] bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border border-white/5 relative overflow-hidden group shadow-3xl text-center">
                            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-125 transition-transform duration-1000 group-hover:rotate-12">
                                <Box className="h-40 w-40 text-white" />
                            </div>
                            <h3 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-6 relative z-10">Ready to Start Creating?</h3>
                            <p className="text-lg text-slate-400 leading-relaxed italic font-bold uppercase tracking-wider relative z-10 mb-8">
                                "This course gives you everything you need to go from zero experience to a confident 3D artist with a portfolio that stands out."
                            </p>
                            <CourseInquiryDialog
                                courseTitle={courseData.title}
                                buttonClassName="px-12 h-16 text-xs font-black bg-emerald-600 hover:bg-emerald-500 text-white uppercase tracking-[0.3em] rounded-2xl shadow-3xl shadow-emerald-600/30 transition-all active:scale-95 italic relative z-10"
                            />
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
                                        <div className="text-emerald-500 font-black tracking-[0.3em] uppercase text-[10px] italic">Complete 8-Week Access</div>
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
                                            { icon: Box, text: "Portfolio Project", color: "text-blue-500" },
                                            { icon: Monitor, text: "Blender 4.x Workflow", color: "text-blue-500" },
                                            { icon: Clock, text: "6+ Hours of Content", color: "text-orange-500" },
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
                                        The Celoris creative team and expert 3D artists bring you industry-standard workflows for game art and digital visualization.
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
