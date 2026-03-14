"use client"

import { useState } from "react"
import { DashboardShell } from "@/components/home-new/DashboardShell"
import {
    Sparkles,
    ArrowRight,
    Camera,
    Youtube,
    Instagram,
    TrendingUp,
    Clock,
    Users,
    CheckCircle2,
    Globe,
    FileText,
    Video,
    Brain,
    Zap,
    GraduationCap,
    MessageSquare,
    PlayCircle,
    Star,
    ShieldCheck,
    Cpu,
    Smartphone,
    Share2,
    BarChart3,
    DollarSign,
    Rocket
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function ContentCreationClient() {
    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    }

    const courseData = {
        title: "Content Creation on Social Media — From Creator to Income",
        tagline: "Stop posting for likes. Start creating for money.",
        overview: "This course is for intermediate creators who already post on Instagram or YouTube but are not making consistent money from their content. After this course you will have a complete content business — not just a social media account.",
        trainer: "Dheeraj Kushwaha — 8+ years digital marketing experience, Celoris platform founder",
        details: {
            duration: "19 Hours across 32 sessions",
            liveSessions: "Saturday evenings 7-9 PM IST — fits working professionals",
            recordedAccess: "Lifetime — rewatch any session anytime",
            batchSize: "Maximum 20 students — personal attention guaranteed",
            language: "English with Hindi explanations where needed",
            certificate: "Module-wise completion + full course certificate"
        }
    }

    const modules = [
        {
            id: "module-1",
            tag: "MODULE 01",
            title: "Content Strategy That Actually Works",
            duration: "3 hours | 6 sessions",
            problem: "Most intermediate creators post randomly — whatever feels right that day. This module fixes that permanently.",
            topics: [
                "Find Your Profitable Niche (Niche vs Micro-niche)",
                "Know Your Audience Deeply (Audience Avatars)",
                "Content Pillars System (3-1-1 Rule)",
                "Platform Algorithm in 2026 (Instagram & YouTube)",
                "Content Calendar Building (30-day template)",
                "Assignment: Audit your existing content"
            ],
            exercise: "Define your 4 content pillars and build your first 30-day calendar."
        },
        {
            id: "module-2",
            tag: "MODULE 02",
            title: "Creating Content That Stops the Scroll",
            duration: "4 hours | 7 sessions",
            problem: "The hook problem: Intermediate creators make good content but lose viewers in the first 3 seconds.",
            topics: [
                "The 3-Second Hook Formula (Problem + Promise + Proof)",
                "Storytelling for Creators (AIDA framework)",
                "Reels and Shorts Production (Phone setup & lighting)",
                "YouTube Long Form Strategy (SEO & Structure)",
                "Carousel Posts That Drive Saves (10-slide formula)",
                "Caption Writing That Converts (Hinglish strategy)",
                "Assignment: Create one Reel, one carousel and one YouTube video"
            ],
            exercise: "Script and produce high-quality content using the frameworks."
        },
        {
            id: "module-3",
            tag: "MODULE 03",
            title: "Growing Your Audience Fast",
            duration: "4 hours | 6 sessions",
            problem: "The growth problem: Breaking through plateaus at the same follower count for months.",
            topics: [
                "Instagram Growth Strategies 2026 (Collaboration & SEO)",
                "YouTube Growth Strategies 2026 (SEO & A/B testing)",
                "Cross Platform Strategy (The Funnel: YT -> IG -> Email)",
                "Collaborations and Features (Outreach templates)",
                "Community Building (WhatsApp/Telegram communities)",
                "Analytics Deep Dive (Reading insights like a pro)"
            ],
            exercise: "Send 5 collaboration outreach messages and complete a monthly audit."
        },
        {
            id: "module-4",
            tag: "MODULE 04",
            title: "Monetisation Strategies for Indian Creators",
            duration: "5 hours | 8 sessions",
            problem: "The money problem: Most creators know options exist but have no system to earn consistently.",
            topics: [
                "Brand Deals and Sponsorships (The Outreach Email)",
                "How to Negotiate (Pricing for the Indian market)",
                "Instagram Monetisation (Subscriptions & Shop)",
                "YouTube Monetisation (Partner Program & Shopping)",
                "Digital Products (Presets, eBooks, Courses)",
                "Freelance Income (Content Portfolio = Resume)",
                "Affiliate Marketing (Amazon, Myntra, Flipkart)",
                "Building Multiple Income Streams (The Income Stack)"
            ],
            exercise: "Create your media kit and map your 6-month monetisation plan."
        },
        {
            id: "module-5",
            tag: "MODULE 05",
            title: "Scaling to a Content Business",
            duration: "3 hours | 5 sessions",
            problem: "The scaling problem: Once earning starts, you hit a ceiling. You cannot do everything alone.",
            topics: [
                "Systems for Consistent Posting (IDEA to PUBLISHED)",
                "Tools and AI for Creators (Leveraging Celoris AI)",
                "Outsourced Content Business (Hiring editors/designers)",
                "Building Your Personal Brand (The Identity Test)",
                "12-Month Content Business Roadmap"
            ],
            exercise: "Submit your complete 12-month content business plan."
        }
    ]

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
                            <Sparkles size={12} className="animate-pulse" /> From Creator to Income | Certificate Included
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl md:text-8xl font-black mb-8 tracking-tighter text-white italic uppercase leading-[0.9]"
                        >
                            Content <span className="text-emerald-500">Creation</span> Mastery
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
                                <Link href="#enroll" className="flex items-center gap-3 text-white no-underline">
                                    ENROLL NOW <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </Button>
                            <Button size="lg" variant="ghost" className="bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl px-10 h-16 font-black text-[10px] uppercase tracking-widest backdrop-blur-md italic" asChild>
                                <Link href="#enroll" className="flex items-center gap-3 text-white no-underline">
                                    BOOK FREE DEMO
                                </Link>
                            </Button>
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
                            className="aspect-video rounded-[3rem] overflow-hidden border border-white/10 shadow-3xl shadow-emerald-500/5 relative"
                        >
                            <img
                                src="/content-creation-cover.png"
                                alt="Content Creation Course"
                                className="w-full h-full object-cover opacity-80"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#050810] to-transparent flex items-end p-12">
                                <div className="p-8 bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[2rem] w-full">
                                    <div className="flex items-center justify-between gap-8 flex-wrap">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                                                <Video size={24} className="text-emerald-500" />
                                            </div>
                                            <div>
                                                <div className="text-white font-black text-sm uppercase italic">19 Hours of Content</div>
                                                <div className="text-[10px] text-slate-500 font-bold">LIFETIME ACCESS</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                                                <Users size={24} className="text-blue-500" />
                                            </div>
                                            <div>
                                                <div className="text-white font-black text-sm uppercase italic">Max 20 Students</div>
                                                <div className="text-[10px] text-slate-500 font-bold">PERSONAL ATTENTION</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                                                <Globe size={24} className="text-indigo-500" />
                                            </div>
                                            <div>
                                                <div className="text-white font-black text-sm uppercase italic">Hinglish Explanations</div>
                                                <div className="text-[10px] text-slate-500 font-bold">EASY TO UNDERSTAND</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Who This Course Is For */}
                <section className="py-24 border-y border-white/5 bg-[#0d1321]/30">
                    <div className="max-w-6xl mx-auto px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                            <motion.div {...fadeIn}>
                                <div className="inline-flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase tracking-[0.3em] mb-6">
                                    <Brain size={14} /> Student Profile
                                </div>
                                <h2 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter mb-8 leading-none">
                                    Who This Course <br /><span className="text-emerald-500">Is For</span>
                                </h2>
                                <p className="text-lg text-slate-400 mb-8 leading-relaxed italic font-medium">
                                    This course is for intermediate creators who already post on Instagram or YouTube but are not making consistent money from their content.
                                </p>
                                <div className="space-y-6">
                                    {[
                                        "Follower count is stagnant",
                                        "Brand deals are not coming",
                                        "No clear monetisation strategy",
                                        "Know how to use platforms but stuck at 'Likes'"
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                                            <span className="text-sm font-bold text-slate-300 uppercase italic tracking-wide">{item}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-12 p-8 bg-emerald-500/5 border border-emerald-500/10 rounded-[2rem]">
                                    <p className="text-white font-black italic uppercase tracking-tight text-lg">
                                        "After this course you will have a complete content business — not just a social media account."
                                    </p>
                                </div>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="relative rounded-[3rem] overflow-hidden border border-white/10 p-12 bg-white/5 backdrop-blur-3xl"
                            >
                                <div className="grid grid-cols-2 gap-8">
                                    {[
                                        { title: "CREATORS", icon: Smartphone, desc: "Reel and Shorts makers" },
                                        { title: "BUSINESSES", icon: Rocket, desc: "Scaling through content" },
                                        { title: "FREELANCERS", icon: DollarSign, desc: "Building portfolio" },
                                        { title: "EXPERTS", icon: GraduationCap, desc: "Teaching online" }
                                    ].map((item, i) => (
                                        <div key={i} className="text-center p-6 bg-white/5 rounded-2xl border border-white/5 group hover:border-emerald-500/30 transition-all">
                                            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                                <item.icon size={24} className="text-emerald-500" />
                                            </div>
                                            <div className="text-[10px] font-black text-white uppercase italic mb-1">{item.title}</div>
                                            <div className="text-[8px] text-slate-500 font-bold uppercase">{item.desc}</div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Curriculum Section */}
                <section className="py-32">
                    <div className="max-w-4xl mx-auto px-8">
                        <div className="text-center mb-20">
                            <div className="inline-flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
                                <Zap size={14} /> The Curriculum
                            </div>
                            <h2 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter leading-none mb-4">
                                5 Modules to <span className="text-emerald-500">Income</span>
                            </h2>
                            <p className="text-slate-500 text-xs font-black uppercase tracking-[0.4em] italic mt-4">Systematic. Practical. Monetisable.</p>
                        </div>

                        <Accordion type="single" collapsible className="space-y-6">
                            {modules.map((mod, i) => (
                                <AccordionItem
                                    value={mod.id}
                                    key={i}
                                    className="border border-white/5 bg-white/5 rounded-[2rem] px-8 overflow-hidden data-[state=open]:border-emerald-500/30 transition-all"
                                >
                                    <AccordionTrigger className="hover:no-underline py-8 group text-left">
                                        <div className="flex flex-col items-start">
                                            <div className="text-emerald-500 text-[10px] font-black tracking-widest mb-2 italic">{mod.tag}</div>
                                            <div className="text-xl md:text-2xl font-black text-white uppercase italic tracking-tight group-hover:text-emerald-400 transition-colors">{mod.title}</div>
                                            <div className="text-[9px] text-slate-500 font-bold uppercase mt-2 tracking-widest">{mod.duration}</div>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pb-12 border-t border-white/5 pt-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                            <div>
                                                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 italic">TOPICS COVERED:</div>
                                                <ul className="space-y-4">
                                                    {mod.topics.map((t, ti) => (
                                                        <li key={ti} className="flex items-center gap-3 text-sm font-bold text-slate-300 italic uppercase">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50" /> {t}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div>
                                                <div className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl mb-8">
                                                    <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-3 italic">THE CHALLENGE:</div>
                                                    <p className="text-sm font-bold text-white italic leading-relaxed">{mod.problem}</p>
                                                </div>
                                                <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                                                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 italic">MODULE ASSIGNMENT:</div>
                                                    <p className="text-xs font-bold text-slate-400 italic leading-relaxed">{mod.exercise}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </section>

                {/* Trainer Profile */}
                <section className="py-24 bg-[#0d1321]/40">
                    <div className="max-w-6xl mx-auto px-8">
                        <div className="bg-white/5 border border-white/10 rounded-[4rem] p-12 md:p-20 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/5 rounded-full blur-[100px] pointer-events-none" />
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
                                <div className="order-2 lg:order-1">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[9px] font-black uppercase tracking-widest mb-8">
                                        <ShieldCheck size={10} /> Professional Trainer
                                    </div>
                                    <h2 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter mb-6 leading-none">
                                        Meet Your <span className="text-blue-500">Trainer</span>
                                    </h2>
                                    <h3 className="text-xl font-bold text-white mb-2 italic">Dheeraj Kushwaha</h3>
                                    <p className="text-slate-400 text-sm font-medium mb-10 italic leading-relaxed">
                                        Digital Marketing expert since 2014. Founder of Celoris.
                                        Trainer who doesn't just give information, but builds systems for accountability and results.
                                    </p>
                                    <div className="grid grid-cols-2 gap-8 mb-12">
                                        <div>
                                            <div className="text-2xl font-black text-white italic">8+ YEARS</div>
                                            <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">EXPERIENCE</div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic mb-2">EXPERTISE:</div>
                                        <div className="flex flex-wrap gap-3">
                                            {["Content Strategy", "Monetisation", "SEO", "System Scaling"].map((c, i) => (
                                                <span key={i} className="px-4 py-2 bg-white/5 border border-white/5 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-wider italic">
                                                    {c}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="order-1 lg:order-2">
                                    <div className="relative aspect-square max-w-[400px] mx-auto group">
                                        <div className="absolute -inset-4 bg-emerald-500/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-700" />
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

                {/* Features Table */}
                <section className="py-24 border-b border-white/5">
                    <div className="max-w-4xl mx-auto px-8">
                        <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter text-center mb-12">Course Features</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { f: "Live Sessions", d: "Saturday evenings 7-9 PM IST", icon: Clock },
                                { f: "Recorded Access", d: "Lifetime access to all sessions", icon: PlayCircle },
                                { f: "Batch Size", d: "Maximum 20 students", icon: Users },
                                { f: "Language", d: "English with Hindi explanations", icon: Globe },
                                { f: "Trainer", d: "Dheeraj Kushwaha", icon: GraduationCap },
                                { f: "Certificate", d: "Module-wise + Course Completion", icon: ShieldCheck },
                                { f: "Community", d: "Private WhatsApp Group", icon: MessageSquare },
                                { f: "Tools", d: "Free access to Celoris AI tools", icon: Cpu }
                            ].map((row, i) => (
                                <div key={i} className="flex items-center gap-4 p-6 bg-white/5 border border-white/5 rounded-2xl hover:border-emerald-500/30 transition-all">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                                        <row.icon size={20} className="text-emerald-500" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">{row.f}</div>
                                        <div className="text-sm font-bold text-white uppercase italic">{row.d}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Pricing Table */}
                <section className="py-32 bg-[#050810]">
                    <div className="max-w-6xl mx-auto px-8">
                        <div className="text-center mb-20">
                            <h2 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter leading-none mb-4">
                                Full Course <span className="text-emerald-400 underline underline-offset-[1rem] decoration-2">Access</span>
                            </h2>
                        </div>
                        <div className="max-w-2xl mx-auto">
                            {/* Paid Tier Only */}
                            <motion.div
                                whileHover={{ y: -10 }}
                                className="p-12 rounded-[3.5rem] bg-emerald-500/10 border-2 border-emerald-500/30 flex flex-col items-center text-center relative overflow-hidden shadow-2xl shadow-emerald-500/10"
                            >
                                <div className="absolute top-6 right-6 bg-emerald-500 text-white text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest italic animate-pulse">LIMITED SEATS</div>
                                <div className="text-emerald-500 text-[10px] font-black uppercase tracking-widest mb-4 italic">Complete Business System</div>
                                <h3 className="text-4xl font-black text-white italic mb-4 uppercase">FULL COURSE</h3>
                                <div className="text-5xl font-black text-white italic mb-10 tracking-tighter">₹4,999</div>
                                <div className="space-y-4 mb-12 w-full text-left max-w-sm mx-auto">
                                    {[
                                        "All 5 Modules Access",
                                        "32 recorded + Live sessions",
                                        "19 hours of core content",
                                        "Professional media kit audit",
                                        "Full Course Certificate",
                                        "Private WhatsApp Community",
                                        "Lifetime Recorded Access"
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-2 text-xs font-bold text-slate-200 uppercase italic">
                                            <CheckCircle2 size={12} className="text-emerald-500 shadow-lg shadow-emerald-500/50" /> {item}
                                        </div>
                                    ))}
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                                    <Button size="lg" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl h-16 font-black text-xs shadow-2xl shadow-emerald-500/40" asChild>
                                        <Link href="#enroll">ENROLL NOW</Link>
                                    </Button>
                                    <Button size="lg" variant="ghost" className="w-full bg-white/5 hover:bg-white/10 text-white rounded-2xl h-16 font-black text-xs border border-white/10" asChild>
                                        <Link href="#enroll">BOOK FREE DEMO</Link>
                                    </Button>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="py-32 border-t border-white/5">
                    <div className="max-w-4xl mx-auto px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-4">Common Questions</h2>
                            <p className="text-slate-500 text-xs font-black uppercase tracking-[0.2em] italic">Everything you need to know about the program</p>
                        </div>
                        <Accordion type="single" collapsible className="space-y-4">
                            {[
                                { q: "I already post on Instagram but barely get views — is this course for me?", a: "Yes — this course is specifically designed for creators who already post but are not growing or earning. Module 1 starts by auditing exactly why your current content is not performing and fixing it systematically." },
                                { q: "Do I need a large following to monetise?", a: "No — Module 4 covers how creators with 2,000 to 5,000 followers are earning ₹15,000 to ₹30,000 per month through brand deals, digital products and freelance services. Follower count matters less than niche authority and engagement rate." },
                                { q: "Is this course for Instagram only or YouTube too?", a: "Both — the course covers Instagram and YouTube together with a cross-platform strategy that grows both simultaneously. Sessions are clearly marked by platform so you can focus on what matters most for your situation." },
                                { q: "I have a full-time job — can I manage this course?", a: "Yes — live sessions are on Saturday evenings specifically for working professionals. All sessions are recorded with lifetime access so you can learn at your own pace during weekdays." },
                                { q: "What equipment do I need?", a: "Just your smartphone. Session 3 of Module 2 covers exactly how to produce high-quality content with a mid-range Indian Android phone. No camera, ring light or microphone required to start." },
                                { q: "How is this different from free YouTube tutorials?", a: "Free YouTube tutorials give you information. This course gives you a system, personal feedback on your actual content, a community of creators at the same stage and a trainer who reviews your assignments and tells you specifically what to fix. Information without accountability rarely produces results." },
                                { q: "What makes Celoris different from learning on Udemy or Coursera?", a: "Three things. First — live sessions with a real Indian trainer who understands the Indian creator economy specifically. Second — all tools used in the course are available free on the same platform. Third — the Celoris EARN section connects you with clients immediately after completing the freelance module — no waiting to find work." },
                                { q: "Is there a free demo for this course?", a: "Yes — you can book one free demo class to understand the teaching style and how we audit your actual content before paying the full fees." },
                                { q: "How do I book the free demo?", a: "Just click on any of the 'Book Free Demo' buttons and message us on WhatsApp. We will share the link for the next upcoming demo session." }
                            ].map((faq, i) => (
                                <AccordionItem key={i} value={`faq-${i}`} className="border border-white/5 bg-white/5 rounded-2xl px-6 data-[state=open]:border-emerald-500/20 transition-all">
                                    <AccordionTrigger className="text-left font-black text-sm uppercase italic text-white tracking-wide hover:no-underline py-6">
                                        {faq.q}
                                    </AccordionTrigger>
                                    <AccordionContent className="text-slate-400 font-medium italic pb-6 pr-8 leading-relaxed">
                                        {faq.a}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </section>

                {/* Final Call to Action */}
                <section id="enroll" className="py-24 px-8">
                    <div className="max-w-6xl mx-auto bg-gradient-to-br from-[#0d1321] to-[#050810] border-2 border-emerald-500/20 rounded-[4rem] p-12 md:p-24 text-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
                        <Rocket size={120} className="absolute -bottom-10 -right-10 text-emerald-500/5 rotate-12 group-hover:scale-110 transition-transform duration-1000" />
                        <div className="relative z-10">
                            <h2 className="text-5xl md:text-8xl font-black text-white italic uppercase tracking-tighter mb-8 leading-none">
                                Scale from <br /><span className="text-emerald-500 underline underline-offset-[1rem] decoration-2">Creator to Income</span>
                            </h2>
                            <p className="text-slate-400 text-lg md:text-xl font-medium max-w-2xl mx-auto mb-12 italic leading-relaxed">
                                Join the next batch. Stop posting for likes and start building a real content business.
                            </p>
                            <div className="flex flex-col sm:flex-row justify-center gap-6">
                                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl px-12 h-16 font-black text-xs shadow-2xl shadow-emerald-500/40" asChild>
                                    <Link href="https://wa.me/919084718101" target="_blank" className="flex items-center gap-3 no-underline">
                                        BOOK FREE DEMO <ArrowRight size={16} />
                                    </Link>
                                </Button>
                                <Button size="lg" variant="ghost" className="bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl px-12 h-16 font-black text-xs backdrop-blur-3xl" asChild>
                                    <Link href="https://wa.me/919084718101" target="_blank" className="flex items-center gap-2 no-underline">
                                        <MessageSquare size={16} className="text-emerald-500" /> WHATSAPP SUPPORT
                                    </Link>
                                </Button>
                            </div>
                            <div className="mt-12 text-[10px] font-black text-slate-500 uppercase tracking-widest italic">
                                * Next batch starts soon. Limited to 20 seats only.
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </DashboardShell>
    )
}
