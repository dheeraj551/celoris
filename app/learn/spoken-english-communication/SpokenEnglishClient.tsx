"use client"

import { useState } from "react"
import { DashboardShell } from "@/components/home-new/DashboardShell"
import {
    Sparkles,
    ArrowRight,
    MessageSquare,
    Clock,
    Users,
    CheckCircle2,
    Zap,
    Brain,
    Star,
    ShieldCheck,
    Cpu,
    BookOpen,
    Mic2,
    Briefcase,
    Languages,
    Heart
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function SpokenEnglishClient() {
    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    }

    const courseData = {
        title: "SPOKEN ENGLISH & COMMUNICATION",
        tagline: "A Practical, Real-Life Masterclass with Sonia Sharma",
        overview: "English fluency is a skill, not a talent. This course is specifically designed for Hindi-speaking learners to bridge the gap between understanding English and speaking it naturally. We focus on actual conversations, not just grammar rules, in a fear-free environment.",
        stats: [
            { label: "EXPERIENCE", value: "5+ YEARS", icon: ShieldCheck },
            { label: "STUDENTS", value: "500+ TRAINED", icon: Users },
            { label: "DURATION", value: "6 WEEKS", icon: Clock },
            { label: "FOCUS", value: "SPEAKING", icon: Mic2 },
        ],
        learningPoints: [
            "Bridge the gap between thinking in Hindi and speaking in English",
            "Master real-life conversation flows for social and professional settings",
            "Build confidence through a structured, fear-free practice environment",
            "Focus on practical vocabulary used in daily Indian life",
            "Overcome hesitation and speak naturally without overthinking grammar"
        ],
        howToUse: [
            "Attend live sessions or watch recordings immediately after.",
            "Complete the daily 'Active Speaking' tasks — practice is non-negotiable.",
            "Record your speech exercises to track your weekly progress.",
            "Participate in the peer-to-peer conversation groups provided.",
            "Implement one new idiom or phrase in your real-life talk every day."
        ]
    }

    const modules = [
        {
            week: "Week 1",
            title: "Breaking the Silence",
            focus: "Overcoming Hesitation & Basic Sentence Structures",
            lessons: [
                { title: "Lesson 1.1 — The Confidence Mindset", content: "Understanding English as a skill. Techniques to stop the 'grammar fear' before you speak." },
                { title: "Lesson 1.2 — Thinking in English", content: "Simple exercises to transition from Hindi-to-English translation to direct English thinking." },
                { title: "Lesson 1.3 — Core Sentence Patterns", content: "The 10 most common sentence structures for 80% of daily talk." }
            ]
        },
        {
            week: "Week 2",
            title: "Social Fluency",
            focus: "Greetings, Small Talk & Daily Life Scenarios",
            lessons: [
                { title: "Lesson 2.1 — Mastering Small Talk", content: "How to start and sustain a conversation with strangers and acquaintances." },
                { title: "Lesson 2.2 — Describing Your Day", content: "Vocabulary and tenses for narrating events, activities, and routines." },
                { title: "Lesson 2.3 — Ordering, Asking & Inquiring", content: "Practical English for restaurants, shops, and customer service." }
            ]
        },
        {
            week: "Week 3",
            title: "Professional Communication",
            focus: "Office Talk, Introductions & Meetings",
            lessons: [
                { title: "Lesson 3.1 — The Perfect Self-Introduction", content: "Developing a confident 30-second 'Elevator Pitch' for professional settings." },
                { title: "Lesson 3.2 — Workplace Etiquette", content: "Formal vs. Semi-formal English. Asking for leave, giving updates, and reporting tasks." },
                { title: "Lesson 3.3 — Contributing to Meetings", content: "Polite ways to interrupt, agree, disagree, and summarize points." }
            ]
        },
        {
            week: "Week 4",
            title: "Phonetics & Clarity",
            focus: "Pronunciation for the Indian Learner",
            lessons: [
                { title: "Lesson 4.1 — Correcting Common Errors", content: "Addressing specific phonetic challenges like V/W, S/SH, and TH sounds." },
                { title: "Lesson 4.2 — Word & Sentence Stress", content: "Understanding how the rhythm of English differs from Hindi to sound more natural." }
            ]
        },
        {
            week: "Week 5",
            title: "Advanced Expressions",
            focus: "Idioms, Phrases & Natural Fillers",
            lessons: [
                { title: "Lesson 5.1 — Every-Day Idioms", content: "Phrases that make you sound like a native speaker without being too literal." },
                { title: "Lesson 5.2 — Fillers and Transitions", content: "How to use 'well', 'actually', 'you see' to keep the conversation flowing during pauses." }
            ]
        },
        {
            week: "Week 6",
            title: "Mastery & Real-World Application",
            focus: "Interviews, Debates & Public Speaking",
            lessons: [
                { title: "Lesson 6.1 — Interview Mastery", content: "Handling tough questions with grace and confidence." },
                { title: "Lesson 6.2 — Public Speaking Basics", content: "Speaking to a group without panicking. Eye contact and body language." },
                { title: "Lesson 6.3 — Final Assessment", content: "One-on-one conversation evaluation and personalized growth roadmap." }
            ]
        }
    ]

    return (
        <DashboardShell>
            <div className="min-h-screen bg-[#050810] text-slate-200 selection:bg-emerald-500/30 font-sans">
                {/* Hero Section */}
                <section className="relative pt-32 pb-24 px-8 overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.15),transparent_50%)]" />
                    <div className="max-w-6xl mx-auto relative z-10 text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] mb-8 shadow-2xl shadow-emerald-500/10"
                        >
                            <Sparkles size={12} className="animate-pulse" /> SPOCKEN ENGLISH | MASTERCLASS | SONIA SHARMA
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl md:text-8xl font-black mb-8 tracking-tighter text-white italic uppercase leading-[0.9]"
                        >
                            Spoken English <br /><span className="text-emerald-500">& Communication</span>
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
                                    ENROLL NOW <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </Button>
                            <div className="flex items-center gap-4 px-6 py-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                                <div className="text-left">
                                    <div className="text-white font-black text-xs uppercase italic">HINDI-SPEAKING FRIENDLY</div>
                                    <div className="flex items-center gap-1">
                                        {[1, 2, 3, 4, 5].map(i => <Star key={i} size={8} className="text-yellow-500 fill-yellow-500" />)}
                                        <span className="text-[8px] text-slate-500 font-bold ml-1">TOP RATED</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Hero Image / Video Placeholder */}
                <section className="px-8 mb-24">
                    <div className="max-w-6xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="aspect-video rounded-[3rem] overflow-hidden border border-white/10 shadow-3xl shadow-emerald-500/5 relative"
                        >
                            <img
                                src="/spoken-english-sonia-sharma-hero.png"
                                alt="Spoken English Mastery with Sonia Sharma"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-x-0 bottom-0 p-12 bg-gradient-to-t from-[#050810] to-transparent">
                                <div className="text-3xl font-black text-white italic uppercase tracking-tighter">Bridge the Gap. Speak Naturally.</div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Course Stats */}
                <section className="py-24 border-y border-white/5 bg-[#0d1321]/30">
                    <div className="max-w-6xl mx-auto px-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {courseData.stats.map((stat, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="p-8 rounded-[2rem] bg-white/5 border border-white/5 text-center group hover:border-emerald-500/30 transition-all font-sans"
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

                {/* Coach Section */}
                <section className="py-32 relative overflow-hidden bg-[#0d1321]/20">
                    <div className="max-w-6xl mx-auto px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                            >
                                <div className="inline-flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase tracking-[0.3em] mb-6">
                                    <Heart size={14} className="fill-emerald-500/20" /> Meet Your Coach
                                </div>
                                <h2 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter mb-8 leading-none">
                                    Meet <br /><span className="text-emerald-500">Sonia Sharma</span>
                                </h2>
                                <p className="text-lg text-slate-300 mb-8 leading-relaxed italic font-medium">
                                    Sonia Sharma is a passionate Spoken English and Communication Coach with 5 years of hands-on teaching experience. Having trained 500+ students — from school students and college freshers to working professionals and homemakers — she brings a deeply empathetic, result-oriented approach to every session.
                                </p>
                                <p className="text-sm text-slate-400 mb-8 leading-relaxed italic border-l-2 border-emerald-500 pl-6">
                                    "English fluency is a skill, not a talent. With the right guidance, structured practice, and a fear-free environment, anyone can speak confidently."
                                </p>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="relative aspect-square rounded-[3rem] overflow-hidden border border-white/10 group shadow-2xl"
                            >
                                <img
                                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1200"
                                    alt="Sonia Sharma"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#050810] via-transparent to-transparent opacity-60" />
                                <div className="absolute bottom-8 left-8 right-8 p-6 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl">
                                    <div className="text-xl font-black text-white italic uppercase tracking-tight mb-1">Practical Curriculum</div>
                                    <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Focus on Actual Conversations</div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Course Philosophy Section */}
                <section className="py-32 relative overflow-hidden">
                    <div className="max-w-6xl mx-auto px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center lg:flex-row-reverse">
                            <motion.div {...fadeIn}>
                                <div className="inline-flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase tracking-[0.3em] mb-6">
                                    <Brain size={14} /> Course Philosophy
                                </div>
                                <h2 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter mb-8 leading-none">
                                    Bridge The <br /><span className="text-emerald-500">Language Gap</span>
                                </h2>
                                <p className="text-lg text-slate-400 mb-8 leading-relaxed italic font-medium">
                                    {courseData.overview}
                                </p>
                                <div className="space-y-4">
                                    {courseData.learningPoints.map((item, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                                            <span className="text-sm font-bold text-slate-300 uppercase italic tracking-wide">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="relative lg:h-[600px] rounded-[3rem] overflow-hidden border border-white/10 group"
                            >
                                <img
                                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200"
                                    alt="Learning Environment"
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-60"
                                />
                                <div className="absolute inset-0 bg-[#050810]/40 flex items-center justify-center p-12">
                                    <div className="p-8 bg-white/5 backdrop-blur-3xl border border-emerald-500/20 rounded-[2rem] text-center">
                                        <div className="text-5xl font-black text-emerald-500 mb-4 italic tracking-tighter">HINDI TO ENGLISH</div>
                                        <div className="text-sm font-black text-white uppercase tracking-widest italic tracking-[0.3em]">Fluency is a Skill, Not a Talent</div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Core Pillars */}
                <section className="py-24 bg-[#0d1321]/40 border-y border-white/5">
                    <div className="max-w-6xl mx-auto px-8">
                        <div className="text-center mb-20">
                            <div className="inline-flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
                                <Zap size={14} /> The Masterclass Blueprint
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter leading-none mb-6">
                                Real World <span className="text-emerald-500">Skills</span>
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                { title: "Daily Dialogue", desc: "Focus on phrases we actually use in shops, offices, and parties.", icon: MessageSquare },
                                { title: "Thought Mapping", desc: "Techniques to stop mental translation from Hindi to English.", icon: Brain },
                                { title: "Sound Clarity", desc: "Simple phonetic rules to fix common pronunciation hiccups.", icon: Mic2 },
                                { title: "Social Impact", desc: "How to use your voice and body language to command respect.", icon: Users },
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

                {/* Detailed Curriculum */}
                <section id="curriculum" className="py-32">
                    <div className="max-w-4xl mx-auto px-8">
                        <div className="text-center mb-20">
                            <h2 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter leading-none mb-4">
                                6 Weeks to <span className="text-emerald-500">Confidence</span>
                            </h2>
                            <p className="text-slate-500 text-xs font-black uppercase tracking-[0.4em] italic mt-4">Practical. Conversation-First. Result-Oriented.</p>
                        </div>

                        <Accordion type="single" collapsible className="space-y-6">
                            {modules.map((mod, i) => (
                                <AccordionItem
                                    value={`week-${i + 1}`}
                                    key={i}
                                    className="border border-white/5 bg-white/5 rounded-[2rem] px-8 overflow-hidden data-[state=open]:border-emerald-500/30 transition-all font-sans"
                                >
                                    <AccordionTrigger className="hover:no-underline py-8 group">
                                        <div className="flex flex-col items-start text-left">
                                            <div className="text-emerald-500 text-[10px] font-black tracking-widest mb-2 italic uppercase">{mod.week}</div>
                                            <div className="text-xl md:text-2xl font-black text-white uppercase italic tracking-tight group-hover:text-emerald-400 transition-colors">{mod.title}</div>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pb-12 border-t border-white/5 pt-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                            <div>
                                                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 italic">MODULE FOCUS:</div>
                                                <p className="text-sm font-bold text-white italic mb-6">{mod.focus}</p>
                                                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 italic">KEY LESSONS:</div>
                                                <ul className="space-y-4">
                                                    {mod.lessons.map((lesson, li) => (
                                                        <li key={li} className="flex flex-col gap-1">
                                                            <div className="text-sm font-black text-emerald-500 italic uppercase">{lesson.title}</div>
                                                            <div className="text-xs font-medium text-slate-400 italic">{lesson.content}</div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div className="flex flex-col justify-between">
                                                <div className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
                                                    <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-3 italic">PRACTICAL EXERCISE:</div>
                                                    <p className="text-sm font-bold text-white italic leading-relaxed">
                                                        Participate in our 'Fear-Free Speak' sessions where you practice {mod.focus.toLowerCase()} in real-time scenarios.
                                                    </p>
                                                </div>
                                                <img
                                                    src={`https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=400&random=${i}`}
                                                    alt="Module context"
                                                    className="w-full mt-8 rounded-2xl opacity-40 h-48 object-cover border border-white/5"
                                                />
                                            </div>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </section>

                {/* How to Succeed */}
                <section className="py-24 bg-[#0d1321]/40 border-y border-white/5">
                    <div className="max-w-6xl mx-auto px-8">
                        <div className="bg-white/5 border border-white/10 rounded-[4rem] p-12 md:p-20">
                            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-12 text-center underline decoration-emerald-500 underline-offset-8">How to Succeed in This Course</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                {courseData.howToUse.map((step, i) => (
                                    <div key={i} className="flex items-start gap-4 p-6 bg-white/5 rounded-3xl border border-white/5 hover:border-emerald-500/20 transition-all">
                                        <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black shrink-0">{i + 1}</div>
                                        <p className="text-sm font-bold text-slate-300 italic uppercase leading-relaxed">{step}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section id="enroll" className="py-24 px-8">
                    <div className="max-w-6xl mx-auto bg-gradient-to-br from-[#0d1321] to-[#050810] border-2 border-emerald-500/20 rounded-[4rem] p-12 md:p-24 text-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
                        <Cpu size={120} className="absolute -bottom-10 -right-10 text-emerald-500/5 rotate-12 group-hover:scale-110 transition-transform duration-1000" />
                        <div className="relative z-10">
                            <h2 className="text-5xl md:text-8xl font-black text-white italic uppercase tracking-tighter mb-8 leading-none">
                                Start Speaking <br /><span className="text-emerald-500 underline underline-offset-[1rem] decoration-2">Confidentally</span>
                            </h2>
                            <p className="text-slate-400 text-lg md:text-xl font-medium max-w-2xl mx-auto mb-12 italic leading-relaxed">
                                Join Sonia Sharma and 500+ learners who have already broken the language barrier. Your voice matters.
                            </p>
                            <div className="flex justify-center">
                                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl px-12 h-16 font-black text-xs shadow-2xl shadow-emerald-500/30 flex items-center gap-3 group" asChild>
                                    <Link href="https://wa.me/919084718101" target="_blank">
                                        ENROLL IN MASTERCLASS <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </Button>
                            </div>
                            <div className="mt-8">
                                <Button size="sm" variant="ghost" className="text-slate-500 hover:text-white font-black text-[10px] uppercase tracking-widest italic" asChild>
                                    <Link href="https://wa.me/919084718101" target="_blank">
                                        <MessageSquare size={14} className="mr-2" /> CHAT WITH A COUNSELOR
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </DashboardShell>
    )
}
