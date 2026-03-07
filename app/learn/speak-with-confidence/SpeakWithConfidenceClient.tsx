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
    Globe,
    Zap,
    Brain,
    Star,
    ShieldCheck,
    Cpu,
    BookOpen,
    Mic2,
    Briefcase,
    Languages
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function SpeakWithConfidenceClient() {
    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    }

    const courseData = {
        title: "SPEAK WITH CONFIDENCE",
        tagline: "A Complete Spoken English Course for Beginners",
        overview: "Speak with Confidence is a comprehensive 8-week Spoken English program designed specifically for complete beginners. Whether you are a student, working professional, or someone who wants to communicate better in everyday life, this course will take you from basic sounds to fluent, confident conversation.",
        stats: [
            { label: "DURATION", value: "8 WEEKS", icon: Clock },
            { label: "LESSONS", value: "40+ SESSIONS", icon: BookOpen },
            { label: "EXERCISES", value: "100+ TASKS", icon: Zap },
            { label: "FOCUS", value: "FLUENCY", icon: Mic2 },
        ],
        learningPoints: [
            "Pronounce English sounds correctly, including tricky vowels and consonants",
            "Build sentences naturally using everyday grammar",
            "Hold real conversations on daily topics with confidence",
            "Communicate professionally in business settings",
            "Understand and use common idioms, phrasal verbs, and expressions"
        ],
        howToUse: [
            "Read each lesson carefully before doing the exercises.",
            "Practice the dialogue examples out loud — speaking is key.",
            "Complete all exercises before moving to the next lesson.",
            "Record yourself speaking and compare with the model phrases.",
            "Review previous lesson's vocabulary before starting a new one."
        ]
    }

    const modules = [
        {
            week: "Week 1",
            title: "Foundation: Sounds & Pronunciation",
            focus: "The English Alphabet, Sounds & Basic Pronunciation",
            lessons: [
                { title: "Lesson 1.1 — The English Sound System", content: "English has 44 sounds (phonemes) but only 26 letters. Understanding the 5 vowel letters and their short/long sounds." },
                { title: "Lesson 1.2 — Vowel Sounds in Depth", content: "Learning 12 pure vowel sounds and minimal pairs like ship/sheep, bit/beat." },
                { title: "Lesson 1.3 — Word Stress", content: "Rules for word stress in nouns, verbs, and words ending in -tion, -sion, -ic." },
                { title: "Lesson 1.4 — Sentence Stress & Rhythm", content: "Content words vs. Function words and spoken rhythm." },
                { title: "Lesson 1.5 — Intonation: The Music of English", content: "Key intonation patterns: Rising, Falling, Rise-Fall, and Fall-Rise." },
                { title: "Lesson 1.6 — Connected Speech", content: "Linking, Elision, Assimilation, and Weak Forms." }
            ]
        },
        {
            week: "Week 2",
            title: "Building Blocks: Vocabulary & Sentences",
            focus: "Essential Vocabulary & Simple Sentences",
            lessons: [
                { title: "Lesson 2.1 — Core Vocabulary: 200 Essential Words", content: "Focus on People & Relationships, and High-Frequency Verbs." },
                { title: "Lesson 2.2 — Building Simple Sentences", content: "Basic structure: S + V + O and adding more info (Where, When, How, Why)." },
                { title: "Lesson 2.3 — Questions & Negatives", content: "Yes/No questions with Do/Does/Is/Are and WH-Questions." }
            ]
        },
        {
            week: "Week 3",
            title: "Everyday Grammar in Conversation",
            focus: "Tenses, Questions & Negatives in Conversation",
            lessons: [
                { title: "Lesson 3.1 — Tenses in Real Conversation", content: "Simple Present, Simple Past, and Present Continuous." },
                { title: "Lesson 3.2 — Modal Verbs", content: "Can, Could, May, Might, Should, Must, Would for natural conversation." }
            ]
        },
        {
            week: "Week 4",
            title: "Daily Conversations",
            focus: "Greetings, Shopping, Travel & Social Situations",
            lessons: [
                { title: "Lesson 4.1 — Greetings & Small Talk", content: "Formal vs. Informal greetings and small talk topics (weather, work, food)." },
                { title: "Lesson 4.2 — Asking for Help & Directions", content: "Polite phrases for help and giving/following directions." },
                { title: "Lesson 4.3 — Shopping & Services", content: "Phrases for shops, handling payments, and trying on clothes." },
                { title: "Lesson 4.4 — Telephone & Video Call English", content: "Answering, introduced yourself, and ending calls professionally." }
            ]
        },
        {
            week: "Week 5",
            title: "Pronunciation Mastery",
            focus: "Stress, Rhythm, Intonation & Connected Speech",
            lessons: [
                { title: "Lesson 5.1 — Common Pronunciation Mistakes", content: "Addressing challenges for Indian speakers: v/w, tapping 'r', 'th' sounds." },
                { title: "Lesson 5.2 — Fluency Through Chunking", content: "Grouping words into thought groups for natural rhythm." }
            ]
        },
        {
            week: "Week 6",
            title: "Fluency Building",
            focus: "Phrasal Verbs, Idioms & Natural Expression",
            lessons: [
                { title: "Lesson 6.1 — Common Phrasal Verbs", content: "Bring up, Call off, Figure out, Follow up, Look into, etc." },
                { title: "Lesson 6.2 — Common English Idioms", content: "Hit the nail on the head, Under the weather, On the fence, etc." }
            ]
        },
        {
            week: "Week 7",
            title: "Business English",
            focus: "Emails, Meetings, Presentations & Professional Talk",
            lessons: [
                { title: "Lesson 7.1 — Professional Introductions", content: "The WHAT-WHERE-WHY formula for confident self-introductions." },
                { title: "Lesson 7.2 — Meetings: Speaking Up", content: "Phrases for starting, contributing, disagreeing, and summarizing." },
                { title: "Lesson 7.3 — Presentation English", content: "Structure phrases for opening, moving between points, and closing." },
                { title: "Lesson 7.4 — Professional Email Language", content: "Translating casual requests into professional formal language." }
            ]
        },
        {
            week: "Week 8",
            title: "Confidence & Polish",
            focus: "Mock Conversations, Self-Correction & Final Assessment",
            lessons: [
                { title: "Lesson 8.1 — Self-Correction Techniques", content: "How to fix mistakes mid-sentence without losing flow." },
                { title: "Lesson 8.2 — Building Confidence", content: "10 habits for overcoming language anxiety." },
                { title: "Lesson 8.3 — Full Conversation Practice", content: "Job Interview and Professional Networking scenarios." },
                { title: "Lesson 8.4 — Final Assessment", content: "Measurement of progress across Pronunciation, Grammar, and Fluency." }
            ]
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
                            <Sparkles size={12} className="animate-pulse" /> Spoken English | 8-Week Program | Certificate
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl md:text-8xl font-black mb-8 tracking-tighter text-white italic uppercase leading-none"
                        >
                            Speak With <span className="text-emerald-500">Confidence</span>
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
                                <Link href="#curriculum" className="flex items-center gap-3">
                                    EXPLORE CURRICULUM <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </Button>
                            <div className="flex items-center gap-4 px-6 py-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                                <div className="text-left">
                                    <div className="text-white font-black text-xs uppercase">Beginner Friendly</div>
                                    <div className="flex items-center gap-1">
                                        {[1, 2, 3, 4, 5].map(i => <Star key={i} size={8} className="text-yellow-500 fill-yellow-500" />)}
                                        <span className="text-[8px] text-slate-500 font-bold ml-1">TOP RATED</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Hero Image */}
                <section className="px-8 mb-24">
                    <div className="max-w-6xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="aspect-video rounded-[3rem] overflow-hidden border border-white/10 shadow-3xl shadow-emerald-500/5 relative"
                        >
                            <img
                                src="https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=1200"
                                alt="Spoken English Mastery"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-x-0 bottom-0 p-12 bg-gradient-to-t from-[#050810] to-transparent">
                                <div className="text-3xl font-black text-white italic uppercase tracking-tighter">Master the Art of Communication</div>
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

                {/* Overview Section */}
                <section className="py-32 relative overflow-hidden">
                    <div className="max-w-6xl mx-auto px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                            <motion.div {...fadeIn}>
                                <div className="inline-flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase tracking-[0.3em] mb-6">
                                    <Brain size={14} /> Course Philosophy
                                </div>
                                <h2 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter mb-8 leading-none">
                                    About This <br /><span className="text-emerald-500">Program</span>
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
                                initial={{ opacity: 0, x: 50 }}
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
                                        <div className="text-5xl font-black text-emerald-500 mb-4 italic tracking-tighter">0 to 100</div>
                                        <div className="text-sm font-black text-white uppercase tracking-widest italic">From Silence to Fluent Conversation</div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* What You'll Learn Highlights */}
                <section className="py-24 bg-[#0d1321]/40 border-y border-white/5">
                    <div className="max-w-6xl mx-auto px-8">
                        <div className="text-center mb-20">
                            <div className="inline-flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
                                <Zap size={14} /> Core Pillars
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter leading-none mb-6">
                                The <span className="text-emerald-500">Skill Map</span>
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                { title: "Pronunciation", desc: "Master the 44 English sounds and correct Indian speaker common errors.", icon: Mic2 },
                                { title: "Everyday Grammar", desc: "Learn essential tenses and structures used in real conversations.", icon: Languages },
                                { title: "Fluency Habits", desc: "Build habits like chunking and breathing for natural-sounding speech.", icon: Sparkles },
                                { title: "Business English", desc: "Professional introductions, meeting etiquette, and email mastery.", icon: Briefcase },
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
                                8 Weeks to <span className="text-emerald-500">Mastery</span>
                            </h2>
                            <p className="text-slate-500 text-xs font-black uppercase tracking-[0.4em] italic mt-4">Systematic. Progressive. Practical.</p>
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
                                                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 italic">LESSONS:</div>
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
                                                    <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-3 italic">HOW TO PRACTICE:</div>
                                                    <p className="text-sm font-bold text-white italic leading-relaxed">
                                                        Practice dialogues out loud and record your sessions for feedback. Focus on {mod.focus.split('&')[0]}.
                                                    </p>
                                                </div>
                                                <img
                                                    src={`https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=400&random=${i}`}
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

                {/* How to Use the Course */}
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

                {/* Final Call to Action */}
                <section id="enroll" className="py-24 px-8">
                    <div className="max-w-6xl mx-auto bg-gradient-to-br from-[#0d1321] to-[#050810] border-2 border-emerald-500/20 rounded-[4rem] p-12 md:p-24 text-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
                        <Cpu size={120} className="absolute -bottom-10 -right-10 text-emerald-500/5 rotate-12 group-hover:scale-110 transition-transform duration-1000" />
                        <div className="relative z-10">
                            <h2 className="text-5xl md:text-8xl font-black text-white italic uppercase tracking-tighter mb-8 leading-none">
                                Speak Fearlessly <br /><span className="text-emerald-500 underline underline-offset-[1rem] decoration-2">Today</span>
                            </h2>
                            <p className="text-slate-400 text-lg md:text-xl font-medium max-w-2xl mx-auto mb-12 italic leading-relaxed">
                                Join the program that turns beginners into confident communicators. Modern techniques for a global world.
                            </p>
                            <div className="flex justify-center">
                                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl px-12 h-16 font-black text-xs shadow-2xl shadow-emerald-500/30 flex items-center gap-3 group" asChild>
                                    <Link href="https://wa.me/919643579101" target="_blank">
                                        BOOK A FREE DEMO <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </Button>
                            </div>
                            <div className="mt-8">
                                <Button size="sm" variant="ghost" className="text-slate-500 hover:text-white font-black text-[10px] uppercase tracking-widest italic" asChild>
                                    <Link href="https://wa.me/919643579101" target="_blank">
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
