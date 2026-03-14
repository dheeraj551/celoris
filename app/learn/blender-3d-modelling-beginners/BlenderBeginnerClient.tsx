"use client"

import { useState } from "react"
import { DashboardShell } from "@/components/home-new/DashboardShell"
import {
    Sparkles,
    ArrowRight,
    Box,
    Maximize,
    Layers,
    Clock,
    Users,
    CheckCircle2,
    Globe,
    Zap,
    GraduationCap,
    MessageSquare,
    PlayCircle,
    Star,
    ShieldCheck,
    Cpu,
    Palette,
    Lightbulb,
    Camera,
    Layout
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function BlenderBeginnerClient() {
    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    }

    const courseData = {
        title: "Blender 3D Modelling — Complete Beginner Course",
        tagline: "From zero to your first 3D model — no experience needed.",
        overview: "This course is for complete beginners who have never opened Blender before. You do not need any prior design experience, coding knowledge or expensive hardware. If you have a basic laptop and curiosity — this course takes you from zero to creating real 3D models confidently.",
        trainer: "Dheeraj Kushwaha — Blender 3D modelling and product visualisation expert",
        details: {
            duration: "15 Hours across 5 modules",
            liveSessions: "Sunday mornings 10 AM to 12 PM IST",
            selfPaced: "Lifetime access to all recordings",
            certificate: "Module-wise + full course completion certificate",
            language: "English with Hindi explanations",
            hardware: "Windows and Mac — basic laptops supported"
        }
    }

    return (
        <DashboardShell>
            <div className="min-h-screen bg-[#050810] text-slate-200 selection:bg-emerald-500/30 font-sans">
                {/* Hero Section */}
                <section className="relative pt-32 pb-24 px-8 overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.1),transparent_50%)]" />
                    <div className="max-w-6xl mx-auto relative z-10 text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] mb-8 shadow-2xl shadow-emerald-500/10"
                        >
                            <Sparkles size={12} className="animate-pulse" /> Live Training | Portfolio Ready | Certificate Included
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl md:text-8xl font-black mb-8 tracking-tighter text-white italic uppercase leading-none"
                        >
                            Blender <span className="text-emerald-500">3D</span> Modelling
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto text-slate-400 font-medium leading-relaxed italic"
                        >
                            {courseData.tagline}
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="flex flex-col sm:flex-row gap-6 justify-center"
                        >
                            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl px-12 h-16 font-black text-sm shadow-2xl shadow-emerald-500/30 group" asChild>
                                <Link href="https://wa.me/919084718101" className="flex items-center gap-3">
                                    BOOK FREE DEMO <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </Button>
                            <div className="flex items-center gap-4 px-6 py-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                                <div className="text-left">
                                    <div className="text-white font-black text-xs uppercase">Limited Slots</div>
                                    <div className="flex items-center gap-1">
                                        {[1, 2, 3, 4, 5].map(i => <Star key={i} size={8} className="text-yellow-500 fill-yellow-500" />)}
                                        <span className="text-[8px] text-slate-500 font-bold ml-1">MAX 12 STUDENTS</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Cover Image Section */}
                <section className="px-8 mb-24">
                    <div className="max-w-6xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="aspect-video rounded-[3rem] overflow-hidden border border-white/10 shadow-3xl shadow-emerald-500/5 relative group"
                        >
                            <img
                                src="/blender-course-cover.png"
                                alt="Blender Workspace"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 opacity-60"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Link href="https://wa.me/919084718101" className="p-8 bg-emerald-600/20 backdrop-blur-xl rounded-full border border-emerald-500/40 group-hover:scale-110 transition-transform">
                                    <PlayCircle size={48} className="text-white fill-emerald-500/20" />
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Course Stats */}
                <section className="py-24 border-y border-white/5 bg-[#0d1321]/30">
                    <div className="max-w-6xl mx-auto px-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {[
                                { label: "TOTAL DURATION", value: "15 HOURS", icon: Clock },
                                { label: "BATCH SIZE", value: "12 STUDENTS", icon: Users },
                                { label: "LEARN RATE", value: "ZERO TO PRO", icon: Zap },
                                { label: "SOFTWARE", value: "100% FREE", icon: Globe },
                            ].map((stat, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="p-8 rounded-[2rem] bg-white/5 border border-white/5 text-center group hover:border-emerald-500/30 transition-all"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                                        <stat.icon size={24} className="text-emerald-500" />
                                    </div>
                                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">{stat.label}</div>
                                    <div className="text-xl font-black text-white italic uppercase tracking-tight">{stat.value}</div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Who This Course Is For */}
                <section className="py-32 relative overflow-hidden">
                    <div className="max-w-6xl mx-auto px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                            <motion.div {...fadeIn}>
                                <div className="inline-flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase tracking-[0.3em] mb-6">
                                    <Box size={14} /> Course Mission
                                </div>
                                <h2 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter mb-8 leading-none">
                                    No Experience <br /><span className="text-emerald-500">Needed</span>
                                </h2>
                                <p className="text-lg text-slate-400 mb-8 leading-relaxed italic font-medium">
                                    {courseData.overview}
                                </p>
                                <p className="text-lg text-slate-400 mb-12 leading-relaxed italic font-medium">
                                    Stay ahead of the competition. Professionals are switching to Blender in 2026 for its power and speed. Master it now.
                                </p>
                                <div className="space-y-4">
                                    {[
                                        "No paid software needed — ever",
                                        "Works on basic Indian student laptops",
                                        "Hindi + English mixed explanations",
                                        "Build your first 3D model in Session 3"
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                                            <span className="text-sm font-bold text-slate-300 uppercase italic tracking-wide">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="relative lg:h-[600px] rounded-[3rem] overflow-hidden border border-white/10 group"
                            >
                                <img
                                    src="/blender-learning-laptop.png"
                                    alt="3D Modelling Work"
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-60"
                                />
                                <div className="absolute inset-0 bg-[#050810]/40 flex items-center justify-center p-12">
                                    <div className="p-8 bg-white/5 backdrop-blur-3xl border border-emerald-500/20 rounded-[2rem] text-center">
                                        <div className="text-5xl font-black text-emerald-500 mb-4 italic tracking-tighter">FUTURE READY</div>
                                        <div className="text-sm font-black text-white uppercase tracking-widest italic">The Industry Standard of 2026</div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Core Learning Areas */}
                <section className="py-24 bg-[#0d1321]/40 border-y border-white/5">
                    <div className="max-w-6xl mx-auto px-8">
                        <div className="text-center mb-20">
                            <div className="inline-flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
                                <Zap size={14} /> The Skills
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter leading-none mb-6">
                                What You <span className="text-emerald-500">Will Master</span>
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[
                                { title: "3D Navigation", desc: "Confidence in the viewport — never get lost in 3D space again", icon: Maximize },
                                { title: "Box Modelling", desc: "Transform simple cubes into complex objects like gadgets & furniture", icon: Box },
                                { title: "Modifiers Stack", desc: "Use Mirror, Array, and Boolean for lightning-fast workflows", icon: Layers },
                                { title: "Material Nodes", desc: "Create realistic metal, glass, wood, and plastic from scratch", icon: Palette },
                                { title: "Lighting Setup", desc: "Master 3-point and HDRI lighting for realistic results", icon: Lightbulb },
                                { title: "Final Rendering", icon: Camera, desc: "High-quality output for social media and client portfolios" },
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ y: -5 }}
                                    className="p-8 rounded-[2.5rem] bg-white/5 border border-white/5 hover:border-emerald-500/30 transition-all group"
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                        <item.icon size={28} className="text-emerald-500" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-4 italic uppercase tracking-tight">{item.title}</h3>
                                    <p className="text-slate-400 text-sm font-medium italic leading-relaxed">{item.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Modules */}
                <section className="py-32">
                    <div className="max-w-4xl mx-auto px-8">
                        <div className="text-center mb-20">
                            <h2 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter leading-none mb-4">
                                5 Phases to <span className="text-emerald-500">Freelancing</span>
                            </h2>
                            <p className="text-slate-500 text-xs font-black uppercase tracking-[0.4em] italic mt-4">Structured. Practical. Job-Focused.</p>
                        </div>

                        <Accordion type="single" collapsible className="space-y-6">
                            {[
                                {
                                    id: "module-1",
                                    tag: "MODULE 01",
                                    title: "Getting Started with Blender",
                                    duration: "2 hours | 4 sessions",
                                    sessions: [
                                        "Installing and Understanding Blender",
                                        "The Viewport and Basic Controls",
                                        "Your First 3D Object",
                                        "Module 1 Assignment: 3D Room Build"
                                    ],
                                    exercise: "Build a complete 3D room with basic furniture using only primitive shapes."
                                },
                                {
                                    id: "module-2",
                                    tag: "MODULE 02",
                                    title: "Core Modelling Tools",
                                    duration: "4 hours | 6 sessions",
                                    sessions: [
                                        "Extrude and Inset Tools",
                                        "The Modifier Stack (Mirror, Array, etc)",
                                        "Proportional Editing & Sculpting",
                                        "Reference Images & Scaling",
                                        "Boolean Operations",
                                        "Module 2 Assignment: Smartphone Model"
                                    ],
                                    exercise: "Model a complete 3D smartphone using box modelling and modifiers."
                                },
                                {
                                    id: "module-3",
                                    tag: "MODULE 03",
                                    title: "Materials and Texturing",
                                    duration: "3 hours | 5 sessions",
                                    sessions: [
                                        "Blender Materials Basics",
                                        "The Node Editor Unleashed",
                                        "UV Unwrapping Concepts",
                                        "PBR Materials & Image Textures",
                                        "Module 3 Assignment: Product Texturing"
                                    ],
                                    exercise: "Create a fully textured 3D product with at least 3 different shaders."
                                },
                                {
                                    id: "module-4",
                                    tag: "MODULE 04",
                                    title: "Lighting and Rendering",
                                    duration: "3 hours | 5 sessions",
                                    sessions: [
                                        "3-Point and HDRI Lighting",
                                        "Eevee vs Cycles (Real-time vs Path-trace)",
                                        "Camera Setup & Composition",
                                        "Output Settings & Denoising",
                                        "Module 4 Assignment: Product Reveal"
                                    ],
                                    exercise: "Create a photorealistic product render with professional photography settings."
                                },
                                {
                                    id: "module-5",
                                    tag: "MODULE 05",
                                    title: "Real Projects & Freelancing",
                                    duration: "3 hours | 4 sessions",
                                    sessions: [
                                        "5 Real Freelance Project Walkthroughs",
                                        "Building Your Portfolio (Artstation/Behance)",
                                        "Freelancing in India (Rates & Clients)",
                                        "Final Assignment: Client Brief Challenge"
                                    ],
                                    exercise: "Complete a full client brief exactly as you would for a real freelance gig."
                                }
                            ].map((mod, i) => (
                                <AccordionItem
                                    value={mod.id}
                                    key={i}
                                    className="border border-white/5 bg-white/5 rounded-[2rem] px-8 overflow-hidden data-[state=open]:border-emerald-500/30 transition-all"
                                >
                                    <AccordionTrigger className="hover:no-underline py-8 group">
                                        <div className="flex flex-col items-start text-left">
                                            <div className="text-emerald-500 text-[10px] font-black tracking-widest mb-2 italic">{mod.tag}</div>
                                            <div className="text-xl md:text-2xl font-black text-white uppercase italic tracking-tight group-hover:text-emerald-400 transition-colors">{mod.title}</div>
                                            <div className="text-[9px] font-bold text-slate-500 mt-1 uppercase tracking-wider">{mod.duration}</div>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pb-12 border-t border-white/5 pt-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                            <div>
                                                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 italic">CURRICULUM HIGHLIGHTS:</div>
                                                <ul className="space-y-4">
                                                    {mod.sessions.map((t, ti) => (
                                                        <li key={ti} className="flex items-center gap-3 text-sm font-bold text-slate-300 italic uppercase">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50" /> {t}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div>
                                                <div className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl mb-8">
                                                    <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-3 italic">HANDS-ON PROJECT:</div>
                                                    <p className="text-sm font-bold text-white italic leading-relaxed">{mod.exercise}</p>
                                                </div>
                                                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 italic">CERTIFICATE:</div>
                                                <p className="text-xs font-bold text-slate-400 italic uppercase tracking-wide">Module Completion Badge Issued Upon Submission</p>
                                            </div>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </section>

                {/* Pricing / Features Table */}
                <section className="py-24 bg-[#0d1321]/30">
                    <div className="max-w-4xl mx-auto px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-4">Pricing & <span className="text-emerald-500">Details</span></h2>
                            <p className="text-slate-500 text-xs font-black uppercase tracking-[0.2em] italic">Everything included in the program</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                            <div className="rounded-[2.5rem] border border-white/5 bg-white/5 overflow-hidden">
                                <div className="p-8 bg-emerald-500/10 border-b border-emerald-500/10">
                                    <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2">FULL COURSE</div>
                                    <div className="text-4xl font-black text-white italic tracking-tighter">₹5,999</div>
                                    <div className="text-xs text-slate-400 mt-2 font-bold italic">One-time payment • Lifetime access</div>
                                </div>
                                <div className="p-8 space-y-4">
                                    {[
                                        "15 Hours of Live Training",
                                        "19 Action-packed Sessions",
                                        "5 Assignments with Feedback",
                                        "Final Freelance Brief review",
                                        "Private WhatsApp Community",
                                        "Digital Credentials & Certificate"
                                    ].map((feat, i) => (
                                        <div key={i} className="flex items-center gap-3 text-xs font-bold text-white uppercase italic tracking-wide">
                                            <CheckCircle2 size={14} className="text-emerald-500" /> {feat}
                                        </div>
                                    ))}
                                    <Button className="w-full mt-8 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-14 font-black text-xs italic tracking-widest uppercase" asChild>
                                        <Link href="https://wa.me/919084718101">ENROLL FOR BATCH</Link>
                                    </Button>
                                </div>
                            </div>

                            <div className="rounded-[2.5rem] border border-emerald-500/20 bg-emerald-500/5 overflow-hidden p-8">
                                <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2">FREE SESSION</div>
                                <div className="text-3xl font-black text-white italic tracking-tighter mb-4 uppercase">Test Before <br />You Buy</div>
                                <p className="text-sm font-medium text-slate-400 italic mb-10 leading-relaxed">
                                    Complete Session 1 of Module 1 absolutely free. No credit card required. Experience the teaching style first-hand.
                                </p>
                                <Button variant="outline" className="w-full border-white/10 hover:bg-emerald-600 hover:text-white rounded-xl h-14 font-black text-xs italic tracking-widest uppercase" asChild>
                                    <Link href="https://wa.me/919084718101">BOOK FREE DEMO</Link>
                                </Button>
                                <div className="mt-6 flex items-center justify-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest italic">Live Demo Slot Available</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Trainer Profile (Reuse similar to Excel) */}
                <section className="py-24">
                    <div className="max-w-6xl mx-auto px-8">
                        <div className="bg-white/5 border border-white/10 rounded-[4rem] p-12 md:p-20 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/5 rounded-full blur-[100px] pointer-events-none" />
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
                                <div className="order-2 lg:order-1">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[9px] font-black uppercase tracking-widest mb-8">
                                        <ShieldCheck size={10} /> Certified 3D & Design Trainer
                                    </div>
                                    <h2 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter mb-6 leading-none">
                                        Meet Your <span className="text-blue-500">Instructor</span>
                                    </h2>
                                    <h3 className="text-xl font-bold text-white mb-2 italic">Dheeraj Kushwaha</h3>
                                    <p className="text-slate-400 text-sm font-medium mb-10 italic leading-relaxed">
                                        Creative professional with a specialization in 3D product visualization. Years of experience in teaching complex software to absolute beginners using a practical, non-intimidating approach.
                                    </p>
                                    <div className="flex flex-wrap gap-3">
                                        {["Blender", "Adobe Creative Suite", "UX Design"].map((c, i) => (
                                            <span key={i} className="px-4 py-2 bg-white/5 border border-white/5 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-wider italic">
                                                {c}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="order-1 lg:order-2">
                                    <div className="relative aspect-square max-w-[400px] mx-auto group">
                                        <img
                                            src="/images/trainer/dheeraj-kushwaha.jpg"
                                            alt="Dheeraj Kushwaha"
                                            className="w-full h-full rounded-[4rem] border-4 border-white/10 relative z-10 shadow-3xl grayscale group-hover:grayscale-0 transition-all duration-1000"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="py-32">
                    <div className="max-w-4xl mx-auto px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-4">Quick <span className="text-emerald-500">Answers</span></h2>
                            <p className="text-slate-500 text-xs font-black uppercase tracking-[0.2em] italic">Frequently Asked Questions</p>
                        </div>
                        <Accordion type="single" collapsible className="space-y-4">
                            {[
                                { q: "I have never done any 3D work before — is this course really for me?", a: "Yes — this course assumes zero prior knowledge of Blender or any 3D software. Module 1 starts from installing Blender for the first time and every tool is explained from scratch. Many students who thought 3D was too complicated have completed this course and are now taking freelance projects." },
                                { q: "What kind of laptop do I need?", a: "Blender runs on most modern Windows and Mac laptops. For smooth performance a minimum of 8GB RAM and a dedicated graphics card is recommended. The course includes a session on optimising Blender settings for basic hardware so even mid-range laptops under ₹50,000 can produce professional quality renders." },
                                { q: "Is Blender really free — are there any hidden costs?", a: "Blender is 100% free and open source forever. There are no subscription fees, no watermarks and no feature restrictions on the free version. The same Blender used by Hollywood studios is the same Blender you download for free." },
                                { q: "Can I make money after completing this course?", a: "Yes — 3D modelling is one of the fastest-growing freelance skills in India in 2026. Ecommerce companies need product renders, architects need visualisations, brands need 3D social media content and YouTube creators need 3D thumbnails and animations. After completing this course you are qualified to take all these projects." },
                                { q: "What is the difference between this course and free YouTube tutorials?", a: "Free YouTube tutorials give you disconnected information. This course gives you a structured 15-hour programme with assignments, personal feedback, a community of learners at the same level and a certificate. You also get a trainer who reviews your actual work and tells you specifically what to improve." }
                            ].map((faq, i) => (
                                <AccordionItem key={i} value={`faq-${i}`} className="border-b border-white/5 hover:bg-white/5 transition-all px-4 rounded-xl">
                                    <AccordionTrigger className="text-left font-black text-sm uppercase italic text-white tracking-wide hover:no-underline py-6">
                                        {faq.q}
                                    </AccordionTrigger>
                                    <AccordionContent className="text-slate-400 font-medium italic pb-6 pr-8">
                                        {faq.a}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="py-24 px-8">
                    <div className="max-w-6xl mx-auto bg-gradient-to-br from-[#0d1321] to-[#050810] border-2 border-emerald-500/20 rounded-[4rem] p-12 md:p-24 text-center relative overflow-hidden group">
                        <div className="relative z-10">
                            <h2 className="text-5xl md:text-8xl font-black text-white italic uppercase tracking-tighter mb-8 leading-none">
                                Your First <span className="text-emerald-500 underline underline-offset-[1rem] decoration-2">3D Render</span> Starts Here
                            </h2>
                            <p className="text-slate-400 text-lg md:text-xl font-medium max-w-2xl mx-auto mb-12 italic leading-relaxed">
                                Join the next batch. Transform from a curious beginner into a confident 3D modeller ready for the market.
                            </p>
                            <div className="flex justify-center flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl h-16 font-black text-xs px-10 italic uppercase tracking-widest" asChild>
                                    <Link href="https://wa.me/919084718101">ENROLL NOW</Link>
                                </Button>
                                <Button size="lg" variant="ghost" className="bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl h-16 font-black text-xs px-10 italic uppercase tracking-widest backdrop-blur-3xl" asChild>
                                    <Link href="https://wa.me/919084718101">WHATSAPP SUPPORT</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </DashboardShell>
    )
}
