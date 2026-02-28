"use client"

import { DashboardShell } from "@/components/home-new/DashboardShell"
import {
    Sparkles,
    ArrowRight,
    Calculator,
    FileSpreadsheet,
    BarChart,
    Clock,
    Users,
    CheckCircle2,
    Globe,
    FileText,
    Code2,
    Brain,
    Zap,
    GraduationCap,
    MessageSquare,
    PlayCircle,
    Star,
    ShieldCheck,
    Cpu
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function ExcelExpertClient() {
    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    }

    const courseData = {
        title: "Be an Excel Expert — From Beginner to Macro Master",
        tagline: "The same course that has trained 682+ students and earned 229 verified reviews — now available on Celoris.",
        overview: "This is not a generic Excel course. This is the exact curriculum developed and refined over 8 years of training working professionals across India — the same course that helped students land jobs in KPO, banking, finance and corporate sectors.",
        trainer: "Dheeraj Kushwaha — IT Corporate Trainer with 8+ years of Excel training experience",
        details: {
            duration: "10 Hours structured across 4 modules",
            liveSessions: "Small batches — maximum 15 students",
            selfPaced: "All sessions recorded — watch anytime",
            certificate: "Celoris + Trainer Certificate on completion",
            language: "English with Hindi explanations",
            compatibility: "Excel 2010, 2013, 2016, 2019, 2021, Microsoft 365"
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
                            <Sparkles size={12} className="animate-pulse" /> Live + Self-Paced | Certificate Included
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl md:text-8xl font-black mb-8 tracking-tighter text-white italic uppercase leading-none"
                        >
                            Be an <span className="text-emerald-500">Excel</span> Expert
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
                                <Link href="#enroll" className="flex items-center gap-3">
                                    BOOK FREE DEMO <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </Button>
                            <div className="flex items-center gap-4 px-6 py-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="w-8 h-8 rounded-full border-2 border-[#050810] bg-slate-800 flex items-center justify-center overflow-hidden">
                                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} alt="student" />
                                        </div>
                                    ))}
                                </div>
                                <div className="text-left">
                                    <div className="text-white font-black text-xs uppercase">682+ Students</div>
                                    <div className="flex items-center gap-1">
                                        {[1, 2, 3, 4, 5].map(i => <Star key={i} size={8} className="text-yellow-500 fill-yellow-500" />)}
                                        <span className="text-[8px] text-slate-500 font-bold ml-1">229 REVIEWS</span>
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
                                src="/artifacts/excel_expert_course_cover_1772287193177.png"
                                alt="Excel Expert Course"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#050810] via-transparent to-transparent opacity-60" />
                            <div className="absolute bottom-12 left-12">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-2xl bg-emerald-600 flex items-center justify-center shadow-xl">
                                        <PlayCircle size={32} className="text-white" />
                                    </div>
                                    <div>
                                        <div className="text-white font-black text-lg uppercase italic">Watch Trailer</div>
                                        <div className="text-emerald-400 text-xs font-bold uppercase tracking-widest">Available on Celoris</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Stats / Features Grid */}
                <section className="py-24 border-y border-white/5 bg-[#0d1321]/30">
                    <div className="max-w-6xl mx-auto px-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {[
                                { label: "TOTAL DURATION", value: "10 HOURS", icon: Clock },
                                { label: "BATCH SIZE", value: "15 STUDENTS", icon: Users },
                                { label: "ACCESS", value: "LIFETIME", icon: Zap },
                                { label: "LANGUAGE", value: "HINDI + ENGLISH", icon: Globe },
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

                {/* Course Overview */}
                <section className="py-32 relative overflow-hidden">
                    <div className="max-w-6xl mx-auto px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                            <motion.div {...fadeIn}>
                                <div className="inline-flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase tracking-[0.3em] mb-6">
                                    <Brain size={14} /> Course Philosophy
                                </div>
                                <h2 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter mb-8 leading-none">
                                    Not Just Another <br /><span className="text-emerald-500">Generic Course</span>
                                </h2>
                                <p className="text-lg text-slate-400 mb-8 leading-relaxed italic font-medium">
                                    {courseData.overview}
                                </p>
                                <p className="text-lg text-slate-400 mb-12 leading-relaxed italic font-medium">
                                    Ttaught by <strong className="text-white italic">{courseData.trainer}</strong>. Start from zero. Finish as an Excel expert your office depends on.
                                </p>
                                <div className="space-y-4">
                                    {[
                                        "Trained 682+ students since 2016",
                                        "229 Verified reviews on platforms like UrbanPro",
                                        "Focus on Indian workplace requirements",
                                        "Real datasets from HR, Sales & Operations"
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
                                    src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=1200"
                                    alt="Office Training"
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-60"
                                />
                                <div className="absolute inset-0 bg-[#050810]/40 flex items-center justify-center p-12">
                                    <div className="p-8 bg-white/5 backdrop-blur-3xl border border-emerald-500/20 rounded-[2rem] text-center">
                                        <div className="text-5xl font-black text-emerald-500 mb-4 italic tracking-tighter">8+ YEARS</div>
                                        <div className="text-sm font-black text-white uppercase tracking-widest italic">Experience in IT Corporate Training</div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* What You Will Learn */}
                <section className="py-24 bg-[#0d1321]/40 border-y border-white/5">
                    <div className="max-w-6xl mx-auto px-8">
                        <div className="text-center mb-20">
                            <div className="inline-flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
                                <Zap size={14} /> The Curriculum
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter leading-none mb-6">
                                What You <span className="text-emerald-500">Will Learn</span>
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[
                                { title: "Excel 101 Bases", desc: "Build a solid foundation used in every Indian office", icon: FileSpreadsheet },
                                { title: "Modern Functions", desc: "Unlock IF, VLOOKUP, INDEX, MATCH and more", icon: Calculator },
                                { title: "Automate with VBA", desc: "Save hours by automating tasks through Macros & VBA", icon: Code2 },
                                { title: "Pivot Mastery", desc: "Create dynamic reports using the most powerful Excel tool", icon: BarChart },
                                { title: "Data Management", desc: "Maintain large datasets in professional lists and tables", icon: FileText },
                                { title: "Interview Prep", desc: "Crack questions asked in KPO, banking and corporate jobs", icon: GraduationCap },
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

                {/* Module Details */}
                <section className="py-32">
                    <div className="max-w-4xl mx-auto px-8">
                        <div className="text-center mb-20">
                            <h2 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter leading-none mb-4">
                                4 Levels to <span className="text-emerald-500">Mastery</span>
                            </h2>
                            <p className="text-slate-500 text-xs font-black uppercase tracking-[0.4em] italic mt-4">Systematic. Progressive. Practical.</p>
                        </div>

                        <Accordion type="single" collapsible className="space-y-6">
                            {[
                                {
                                    id: "module-1",
                                    tag: "LEVEL 01",
                                    title: "Excel 101: Introduction to Excel",
                                    for: "Freshers, homemakers, absolute beginners",
                                    topics: [
                                        "Interface, Ribbons, Rows & Columns",
                                        "Essential formulas: SUM, AVG, MIN, MAX",
                                        "Top 20 Keyboard Shortcuts",
                                        "Saving, Printing & Formatting"
                                    ],
                                    exercise: "Build a personal monthly budget tracker and attendance register."
                                },
                                {
                                    id: "module-2",
                                    tag: "LEVEL 02",
                                    title: "Excel 102: Intermediate Level Excel",
                                    for: "Working professionals, HR, Accountants",
                                    topics: [
                                        "VLOOKUP & HLOOKUP Mastery",
                                        "IF, Nested IF, IFS Logic Functions",
                                        "Conditional Formatting & Data Validation",
                                        "Introduction to Pivot Tables"
                                    ],
                                    exercise: "Build a complete HR attendance and salary calculation sheet."
                                },
                                {
                                    id: "module-3",
                                    tag: "LEVEL 03",
                                    title: "Excel 103: Advanced Level Excel",
                                    for: "Analysts, MIS, Finance Professionals",
                                    topics: [
                                        "Mastering PivotTables & PivotCharts",
                                        "Dynamic Dashboards with Slicers",
                                        "INDEX & MATCH (The Pro Way)",
                                        "Advanced Text & Date Functions"
                                    ],
                                    exercise: "Analyze 5000+ rows of sales data into a professional 1-page dashboard."
                                },
                                {
                                    id: "module-4",
                                    tag: "LEVEL 04",
                                    title: "Master Excel Macros and VBA",
                                    for: "Senior Professionals, Entrepreneurs",
                                    topics: [
                                        "Introduction to VBA Scripting",
                                        "Recording & Running Macros",
                                        "XLOOKUP & Dynamic Arrays",
                                        "6 Real-World Automation Projects"
                                    ],
                                    exercise: "Build a fully automated monthly sales report that emails itself with one click."
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
                                                    <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-3 italic">REAL-WORLD EXERCISE:</div>
                                                    <p className="text-sm font-bold text-white italic leading-relaxed">{mod.exercise}</p>
                                                </div>
                                                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 italic">WHO IS THIS FOR:</div>
                                                <p className="text-xs font-bold text-slate-400 italic uppercase tracking-wide">{mod.for}</p>
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
                                        <ShieldCheck size={10} /> Certified IT Corporate Trainer
                                    </div>
                                    <h2 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter mb-6 leading-none">
                                        Meet Your <span className="text-blue-500">Trainer</span>
                                    </h2>
                                    <h3 className="text-xl font-bold text-white mb-2 italic">Dheeraj Kushwaha</h3>
                                    <p className="text-slate-400 text-sm font-medium mb-10 italic leading-relaxed">
                                        Multi-skilled trainer with over 8 years of experience. Expert in Microsoft Excel, VBA Automation, and Adobe Suite.
                                        Known for a practical, student-centric approach that removes the fear of asking "stupid" questions.
                                    </p>
                                    <div className="grid grid-cols-2 gap-8 mb-12">
                                        <div>
                                            <div className="text-2xl font-black text-white italic">682+</div>
                                            <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">STUDENTS TRAINED</div>
                                        </div>
                                        <div>
                                            <div className="text-2xl font-black text-white italic">229+</div>
                                            <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">VERIFIED REVIEWS</div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic mb-2">PREVIOUS WORK:</div>
                                        <div className="flex flex-wrap gap-3">
                                            {["Mobilous Inc.", "Koenig Solutions", "Bharat Software Tech"].map((c, i) => (
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

                {/* Testimonials */}
                <section className="py-24 overflow-hidden">
                    <div className="max-w-6xl mx-auto px-8">
                        <div className="flex items-center gap-3 mb-16 px-4">
                            <Star size={20} className="text-yellow-500 fill-yellow-500" />
                            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Student Feedback</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { text: "Dheeraj Sir! You are a very good trainer. Your approach is very friendly — students never fear to ask stupid questions which helps a lot.", name: "Kritika", role: "Verified Student" },
                                { text: "I finally got my dream job and credit goes to the Excel training I got from Dheeraj sir.", name: "Kavita", role: "Verified Student" },
                                { text: "A crash course for cracking interviews and the practical approach really boosted my confidence.", name: "Rakesh", role: "Verified Student" }
                            ].map((t, i) => (
                                <motion.div key={i} className="p-8 bg-white/5 border border-white/5 rounded-[2.5rem] italic relative">
                                    <MessageSquare size={40} className="absolute -top-4 -right-4 text-emerald-500/10" />
                                    <p className="text-slate-300 font-medium mb-8 leading-relaxed italic">"{t.text}"</p>
                                    <div className="flex items-center gap-3 pt-6 border-t border-white/5">
                                        <Avatar className="w-10 h-10 border border-white/10">
                                            <AvatarFallback className="bg-emerald-500/10 text-emerald-500 font-black">{t.name[0]}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="text-white text-xs font-black uppercase italic">{t.name}</div>
                                            <div className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">{t.role}</div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Feature Table */}
                <section className="py-24 bg-[#0d1321]/30">
                    <div className="max-w-4xl mx-auto px-8">
                        <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter text-center mb-12">Course Features</h2>
                        <div className="rounded-[2.5rem] border border-white/5 bg-white/5 overflow-hidden">
                            <div className="grid grid-cols-2 bg-white/5 border-b border-white/5">
                                <div className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest italic border-r border-white/5">Feature</div>
                                <div className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Detail</div>
                            </div>
                            {[
                                { f: "Live Sessions", d: "Weekday evenings + Weekend mornings" },
                                { f: "Recorded Access", d: "Lifetime access to all recordings" },
                                { f: "Practice Files", d: "Real Indian workplace datasets included" },
                                { f: "Batch Size", d: "Small batches for personal attention" },
                                { f: "Doubt Clearing", d: "WhatsApp support group per batch" },
                                { f: "Certificate", d: "Celoris Certificate on completion" },
                                { f: "Language", d: "English + Hindi explanations" }
                            ].map((row, i) => (
                                <div key={i} className="grid grid-cols-2 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                                    <div className="p-6 text-sm font-black text-white italic uppercase border-r border-white/5">{row.f}</div>
                                    <div className="p-6 text-sm font-medium text-slate-400 italic">{row.d}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="py-32">
                    <div className="max-w-4xl mx-auto px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-4">Common Questions</h2>
                            <p className="text-slate-500 text-xs font-black uppercase tracking-[0.2em] italic">Everything you need to know about the program</p>
                        </div>
                        <Accordion type="single" collapsible className="space-y-4">
                            {[
                                { q: "Is this Excel course free on Celoris?", a: "Your first live demo session is completely free. After that each module is available at an affordable price — significantly lower than similar courses elsewhere. Self-paced recorded content is available free." },
                                { q: "Is this the same course available on UrbanPro?", a: "Yes — this is the exact same curriculum by Dheeraj Kushwaha that has 229 verified reviews and 682 students on UrbanPro. Now available on Celoris with additional features and Celoris tools integration." },
                                { q: "Will I get a certificate?", a: "Yes — a Celoris Certificate of Completion after each module and a full course certificate signed by the trainer on completing all 4 modules." },
                                { q: "Is this course useful for government job exams?", a: "Yes — Modules 1 and 2 cover all Excel topics commonly tested in SSC CGL, CHSL, banking and state government recruitment exams." },
                                { q: "Does this course cover Excel interview questions?", a: "Absolutely — this course was specifically designed to help students crack Excel interview questions asked in KPO, banking and corporate jobs. VLOOKUP, PivotTables and IF formulas are covered in depth." },
                                { q: "Can I join if I have never used Excel before?", a: "Yes — Module 1 starts from absolute zero. No prior experience needed." },
                                { q: "What if I already know Excel basics?", a: "You can skip Module 1 and join directly from Module 2 or 3 based on your current level. Book a free demo and the trainer will assess your level personally." },
                                { q: "How is this better than free YouTube tutorials?", a: "YouTube gives you videos with no feedback. This course gives you a real trainer who knows the Indian workplace, answers your specific questions, reviews your practice files and prepares you for actual job interviews." }
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

                {/* Final Call to Action */}
                <section id="enroll" className="py-24 px-8">
                    <div className="max-w-6xl mx-auto bg-gradient-to-br from-[#0d1321] to-[#050810] border-2 border-emerald-500/20 rounded-[4rem] p-12 md:p-24 text-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
                        <Cpu size={120} className="absolute -bottom-10 -right-10 text-emerald-500/5 rotate-12 group-hover:scale-110 transition-transform duration-1000" />
                        <div className="relative z-10">
                            <h2 className="text-5xl md:text-8xl font-black text-white italic uppercase tracking-tighter mb-8 leading-none">
                                Accelerate Your <br /><span className="text-emerald-500 underline underline-offset-[1rem] decoration-2">Career Growth</span>
                            </h2>
                            <p className="text-slate-400 text-lg md:text-xl font-medium max-w-2xl mx-auto mb-12 italic leading-relaxed">
                                Join the 682+ success stories. From basics to Macros, become the expert your office depends on.
                            </p>
                            <div className="flex justify-center">
                                <Button size="lg" variant="ghost" className="bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl px-12 h-16 font-black text-xs backdrop-blur-3xl w-full sm:max-w-md" asChild>
                                    <Link href="https://wa.me/91XXXXXXXXXX" target="_blank" className="flex items-center gap-2">
                                        <MessageSquare size={16} className="text-emerald-500" /> WHATSAPP SUPPORT
                                    </Link>
                                </Button>
                            </div>
                            <div className="mt-12 text-[10px] font-black text-slate-500 uppercase tracking-widest italic">
                                * Next batch starts soon. Limited to 15 seats only.
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </DashboardShell>
    )
}
