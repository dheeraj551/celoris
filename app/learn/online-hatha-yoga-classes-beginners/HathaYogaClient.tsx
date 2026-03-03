"use client"

import { motion } from "framer-motion"
import {
    Clock,
    Users,
    CheckCircle2,
    Calendar,
    MessageSquare,
    Award,
    HelpCircle,
    ArrowRight,
    Zap,
    Heart,
    ShieldCheck,
    Languages,
    Video,
    Layout
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from "@/components/ui/accordion"
import Link from "next/link"

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
}

const stagger = {
    animate: { transition: { staggerChildren: 0.1 } }
}

export default function HathaYogaClient() {
    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-emerald-500/30 font-sans">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-gradient-to-b from-emerald-500/10 via-transparent to-transparent pointer-events-none" />

                <div className="container max-w-7xl mx-auto px-4 relative z-10">
                    <motion.div
                        initial="initial"
                        animate="animate"
                        variants={stagger}
                        className="text-center max-w-4xl mx-auto"
                    >
                        <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8 italic">
                            <Zap className="h-3 w-3" />
                            Live Online Sessions
                        </motion.div>

                        <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-black text-white italic uppercase tracking-tighter leading-[0.9] mb-8">
                            Online Hatha Yoga <br />
                            <span className="text-emerald-500">For Beginners</span>
                        </motion.h1>

                        <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-slate-400 font-bold italic uppercase tracking-tight mb-12 leading-relaxed">
                            Learn authentic Hatha Yoga from a certified trainer — live online sessions, small batches, beginner friendly.
                        </motion.p>

                        <motion.div variants={fadeInUp} className="flex flex-wrap items-center justify-center gap-6">
                            <a href="https://wa.me/919643579101?text=I%20want%20to%20book%20a%20free%20demo%20for%20Hatha%20Yoga">
                                <Button className="h-16 px-10 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-emerald-500/20 active:scale-95 transition-all italic">
                                    Book Free Demo Session
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </a>
                            <div className="flex flex-col items-start text-left">
                                <div className="text-2xl font-black text-white italic uppercase tracking-tighter">₹4,999</div>
                                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Complete 8-Week Programme</div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Course Stats */}
            <section className="py-20 bg-slate-900/40 border-y border-white/5 backdrop-blur-3xl">
                <div className="container max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
                        {[
                            { icon: Users, label: "Batch Size", value: "8 Max" },
                            { icon: Clock, label: "Duration", value: "8 Weeks" },
                            { icon: Calendar, label: "Frequency", value: "3x / Week" },
                            { icon: Languages, label: "Voice", value: "Hindi + Eng" }
                        ].map((stat, i) => (
                            <div key={i} className="text-center group">
                                <div className="inline-flex p-4 rounded-2xl bg-white/5 border border-white/10 mb-5 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/20 transition-all">
                                    <stat.icon className="h-6 w-6 text-emerald-500" />
                                </div>
                                <div className="text-2xl font-black text-white italic uppercase tracking-tighter mb-1">{stat.value}</div>
                                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* The Problem Section */}
            <section className="py-32 relative overflow-hidden">
                <div className="container max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div>
                            <div className="text-xs font-black text-emerald-500 uppercase tracking-[0.3em] mb-6 italic">The Reality Check</div>
                            <h2 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter leading-[0.9] mb-10">
                                The Problem With Most <br />
                                <span className="text-red-500/80">Online Yoga Classes</span>
                            </h2>
                            <div className="space-y-6 text-lg text-slate-400 font-medium italic uppercase tracking-tight">
                                <p>
                                    Most online yoga content in India falls into one of two categories — expensive studio memberships you never use or YouTube videos with no personal guidance.
                                </p>
                                <p className="text-white">
                                    Bad yoga practice is not just ineffective — <span className="text-red-400">it causes injury.</span> Incorrect alignment can damage your back, knees and neck over months of incorrect practice.
                                </p>
                                <p>
                                    What beginners actually need is a real certified trainer who watches them, corrects their alignment, and guides them through a structured progression.
                                </p>
                            </div>
                        </div>
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-emerald-800 rounded-[3rem] blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                            <div className="relative aspect-square rounded-[3rem] overflow-hidden border border-white/10 bg-slate-900">
                                <img
                                    src="/hatha-yoga-foundation.png"
                                    alt="Yoga Alignment"
                                    className="w-full h-full object-cover grayscale brightness-50 contrast-125"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="p-8 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl text-center">
                                        <div className="text-4xl font-black text-white italic uppercase">Focus on</div>
                                        <div className="text-emerald-500 text-2xl font-black italic uppercase">Alignment</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Curriculum Section */}
            <section className="py-32 bg-slate-900/40 backdrop-blur-3xl border-y border-white/5">
                <div className="container max-w-7xl mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <div className="text-xs font-black text-emerald-500 uppercase tracking-[0.3em] mb-6 italic">Course Roadmap</div>
                        <h2 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter mb-8 leading-[0.9]">
                            8-Week Foundation <br /> Programme
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[
                            {
                                weeks: "Weeks 1 & 2",
                                title: "The Foundations",
                                content: "Understanding principles of Hatha Yoga. Correct breathing (Diaphragmatic & Pranayama). Basic standing poses: Tadasana, Vrikshasana, Trikonasana. Alignment mastery to avoid injuries."
                            },
                            {
                                weeks: "Weeks 3 & 4",
                                title: "Building Strength",
                                content: "Surya Namaskar A & B. Core strengthening: Navasana, Plank, Chaturanga. Balance poses: Warrior I & II. Introduction to backbends: Bhujangasana. Understanding body limits."
                            },
                            {
                                weeks: "Weeks 5 & 6",
                                title: "Flexibility & Flow",
                                content: "Hip opening: Pigeon Pose, Baddha Konasana. Shoulder/Chest openers. Spinal twists: Ardha Matsyendrasana. Inversions: Supported Shoulderstand. Deepening Pranayama practice."
                            },
                            {
                                weeks: "Weeks 7 & 8",
                                title: "Integration & Habit",
                                content: "Creating your personal home practice. Restorative poses for stress & sleep. Yoga Nidra for anxiety. Building a sustainable daily habit. Final assessment & certification."
                            }
                        ].map((module, i) => (
                            <div key={i} className="group p-10 rounded-[2.5rem] bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-all">
                                <div className="text-xs font-black text-emerald-500 uppercase tracking-widest mb-4 italic">{module.weeks}</div>
                                <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-6 group-hover:text-emerald-400 transition-colors">{module.title}</h3>
                                <p className="text-slate-400 font-bold uppercase text-[11px] tracking-widest leading-relaxed italic opacity-70">{module.content}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Who It Is For */}
            <section className="py-32">
                <div className="container max-w-7xl mx-auto px-4">
                    <div className="mb-20">
                        <div className="text-xs font-black text-emerald-500 uppercase tracking-[0.3em] mb-6 italic">Target Audience</div>
                        <h2 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter leading-[0.9]">
                            Who This Course <br /> Is For
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Working Professionals",
                                description: "Address back pain, neck stiffness and poor posture from 8-10 hour desk jobs. Specifically designed for modern corporate life."
                            },
                            {
                                title: "Homemakers",
                                description: "Most accessible form of yoga to start your fitness journey. No equipment, just a mat and a trainer guiding you home."
                            },
                            {
                                title: "Students",
                                description: "Evidence-backed intervention for exam stress, anxiety and sleep problems. Addresses mental health challenges in 2026."
                            },
                            {
                                title: "NRIs Worldwide",
                                description: "Learn authentic Indian yoga—not the westernised gym versions. Taught in Hindi/English by Indian certified trainers."
                            },
                            {
                                title: "YouTube Failures",
                                description: "If pre-recorded videos haven't worked because no one was watching your form—this live course is the solution."
                            }
                        ].map((item, i) => (
                            <div key={i} className="p-8 rounded-[2rem] bg-slate-900 border border-white/5 hover:bg-[#0d1321] transition-colors">
                                <h3 className="text-xl font-black text-white italic uppercase tracking-tight mb-4">{item.title}</h3>
                                <p className="text-sm text-slate-500 font-black uppercase tracking-widest italic leading-relaxed">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Celoris Different */}
            <section className="py-32 bg-emerald-600/5 backdrop-blur-3xl border-y border-white/5">
                <div className="container max-w-7xl mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <div className="text-xs font-black text-emerald-500 uppercase tracking-[0.3em] mb-6 italic">The Advantage</div>
                        <h2 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter mb-8 leading-[0.9]">
                            What Makes <br /> Celoris Different
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { icon: Video, title: "Real Certified Trainer", desc: "Every session is live. Not a pre-recorded video. Your trainer corrects you in real time." },
                            { icon: Users, title: "Small Batches (8 Max)", desc: "Personal attention guaranteed. Most platforms pack 50+ students. We limit to 8." },
                            { icon: Layout, title: "Beginner Specific", desc: "Every pose and instruction is designed for people who have never practiced yoga." },
                            { icon: Languages, title: "Bilingual Guidance", desc: "Hindi and English instruction. Technical Sanskrit terms explained in plain language." },
                            { icon: Heart, title: "Lifetime Recordings", desc: "Miss a session? Every live session is recorded and available for you forever." },
                            { icon: MessageSquare, title: "Private Community", desc: "WhatsApp support group to ask questions between sessions and get motivation." }
                        ].map((feature, i) => (
                            <div key={i} className="p-8 rounded-3xl bg-slate-900 border border-white/5 group hover:border-emerald-500/30 transition-all">
                                <feature.icon className="h-8 w-8 text-emerald-500 mb-6" />
                                <h3 className="text-xl font-black text-white italic uppercase tracking-tight mb-3 italic">{feature.title}</h3>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-relaxed italic opacity-70">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Batch Timings */}
            <section className="py-32">
                <div className="container max-w-7xl mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <div className="text-xs font-black text-emerald-500 uppercase tracking-[0.3em] mb-6 italic">Schedule</div>
                        <h2 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter mb-8 leading-[0.9]">
                            Batch Timings
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { name: "Morning Batch", days: "Mon, Wed, Fri", time: "6:00 AM - 7:00 AM IST", focus: "Professionals & Students" },
                            { name: "Evening Batch", days: "Mon, Wed, Fri", time: "7:00 PM - 8:00 PM IST", focus: "Homemakers & Professionals" },
                            { name: "Weekend Batch", days: "Sat & Sun", time: "8:00 AM - 9:00 AM IST", focus: "Busy Professionals" }
                        ].map((batch, i) => (
                            <div key={i} className="p-10 rounded-[2.5rem] bg-slate-900 border border-white/10 text-center relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500 group-hover:h-full group-hover:opacity-[0.03] transition-all" />
                                <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-4">{batch.name}</h3>
                                <div className="text-emerald-400 font-black italic uppercase tracking-widest mb-2">{batch.days}</div>
                                <div className="text-xl font-black text-white italic uppercase tracking-tighter mb-6">{batch.time}</div>
                                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">{batch.focus}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="py-32 bg-slate-900 border-y border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[100px] -mr-64 -mt-64" />

                <div className="container max-w-7xl mx-auto px-4 relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <div className="text-xs font-black text-emerald-500 uppercase tracking-[0.3em] mb-6 italic">Pricing</div>
                        <h2 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter mb-8 leading-[0.9]">
                            Choose Your Path
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                        {/* Group Plan */}
                        <Card className="rounded-[3rem] bg-slate-900 border border-emerald-500/20 overflow-hidden shadow-2xl relative">
                            <div className="bg-emerald-500 py-3 text-center text-[10px] font-black text-black uppercase tracking-widest italic">Best Value</div>
                            <CardContent className="p-10">
                                <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-2">8-Week Programme</h3>
                                <div className="flex items-baseline gap-2 mb-8">
                                    <span className="text-4xl font-black text-white italic uppercase tracking-tighter">₹4,999</span>
                                </div>
                                <ul className="space-y-4 mb-10">
                                    {[
                                        "24 live sessions",
                                        "Lifetime recorded access",
                                        "Private WhatsApp community",
                                        "Personal alignment feedback",
                                        "Final assessment & certificate"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-xs font-black text-slate-400 uppercase tracking-widest italic italic">
                                            <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                                <a href="https://wa.me/919643579101?text=I%20want%20to%20enroll%20in%20Hatha%20Yoga%208-week%20programme">
                                    <Button className="w-full h-16 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs italic">Enroll For Batch</Button>
                                </a>
                            </CardContent>
                        </Card>

                        {/* Private Plan */}
                        <Card className="rounded-[3rem] bg-slate-900/50 backdrop-blur-xl border border-white/5 overflow-hidden shadow-2xl">
                            <CardContent className="p-10">
                                <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-2">1-on-1 Sessions</h3>
                                <div className="flex flex-col gap-1 mb-8">
                                    <span className="text-4xl font-black text-white italic uppercase tracking-tighter">₹800 <span className="text-sm">/ session</span></span>
                                    <span className="text-emerald-400 font-black italic uppercase text-[10px]">₹5,999 for 10 sessions</span>
                                </div>
                                <ul className="space-y-4 mb-10">
                                    {[
                                        "Individual personal attention",
                                        "Customised for health goals",
                                        "Flexible timing options",
                                        "Deep personal guidance",
                                        "Health condition specific"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-xs font-black text-slate-400 uppercase tracking-widest italic italic">
                                            <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                                <a href="https://wa.me/919643579101?text=I%20want%20to%20book%20private%201-on-1%20yoga%20sessions">
                                    <Button variant="outline" className="w-full h-16 bg-white/5 border-white/10 hover:bg-white/10 text-white rounded-2xl font-black uppercase tracking-widest text-xs italic">Book Private Session</Button>
                                </a>
                            </CardContent>
                        </Card>

                        {/* Demo Plan */}
                        <Card className="rounded-[3rem] bg-white/5 border border-white/5 overflow-hidden shadow-2xl">
                            <CardContent className="p-10">
                                <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-2">Free Demo</h3>
                                <div className="text-4xl font-black text-emerald-500 italic uppercase tracking-tighter mb-8 tracking-[0.2em] italic">FREE</div>
                                <ul className="space-y-4 mb-10">
                                    {[
                                        "One complete 60-min session",
                                        "Live interactive experience",
                                        "No credit card required",
                                        "Consult with trainer",
                                        "Check batch compatibility"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-xs font-black text-slate-400 uppercase tracking-widest italic italic">
                                            <CheckCircle2 className="h-4 w-4 text-slate-600 flex-shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                                <a href="https://wa.me/919643579101?text=I%20want%20to%20book%20my%20free%20demo%20yoga%20session">
                                    <Button variant="outline" className="w-full h-16 bg-white/5 border-white/10 hover:bg-white/10 text-white rounded-2xl font-black uppercase tracking-widest text-xs italic">Book Free Demo</Button>
                                </a>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* For Yoga Trainers Section */}
            <section className="py-32 bg-slate-900 border-t border-white/5">
                <div className="container max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div>
                            <div className="text-xs font-black text-emerald-500 uppercase tracking-[0.3em] mb-6 italic">Trainer Opportunities</div>
                            <h2 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter leading-[0.9] mb-8">
                                Are you a certified <br /> <span className="text-emerald-500">Yoga Trainer?</span>
                            </h2>
                            <p className="text-lg text-slate-400 font-bold italic uppercase tracking-tight mb-10 leading-relaxed">
                                Join Celoris and connect with genuine students across India and internationally. No fake leads. No commission on first contact. No monthly subscription fees.
                            </p>
                            <a href="https://wa.me/919643579101?text=I%20am%20a%20certified%20yoga%20trainer%20and%20want%20to%20join%20Celoris">
                                <Button className="h-16 px-10 bg-white text-black hover:bg-emerald-500 rounded-2xl font-black uppercase tracking-widest text-xs italic">
                                    Register as Yoga Trainer
                                </Button>
                            </a>
                        </div>
                        <div className="bg-[#0d1321]/60 p-10 rounded-[3rem] border border-white/10">
                            <h3 className="text-xl font-black text-white italic uppercase tracking-tight mb-8">Current Requirements</h3>
                            <div className="space-y-6">
                                {[
                                    { name: "Ankita", loc: "Vasant Kunj, Delhi", goal: "Weight Management" },
                                    { name: "Utkarsh Maheshwari", loc: "Sector 49, Gurgaon", goal: "Flexibility & Stress" },
                                    { name: "Tavishee", loc: "East Delhi", goal: "General Wellbeing" }
                                ].map((req, i) => (
                                    <div key={i} className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
                                        <div>
                                            <div className="text-emerald-400 font-black italic uppercase text-sm tracking-tight">{req.name}</div>
                                            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">{req.loc}</div>
                                        </div>
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic bg-white/5 px-3 py-1 rounded-full">{req.goal}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQs */}
            <section className="py-32">
                <div className="container max-w-4xl mx-auto px-4">
                    <div className="text-center mb-20">
                        <div className="text-xs font-black text-emerald-500 uppercase tracking-[0.3em] mb-6 italic">Inquiry Hub</div>
                        <h2 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter leading-[0.9]">
                            Common Questions
                        </h2>
                    </div>

                    <Accordion type="single" collapsible className="space-y-4">
                        {[
                            {
                                q: "I am completely inflexible — can I still do yoga?",
                                a: "Yes — inflexibility is the most common reason people start yoga, not a reason to avoid it. Your trainer will provide modifications for every pose based on your level. Most students touch their toes within 4-6 weeks."
                            },
                            {
                                q: "What equipment do I need?",
                                a: "A yoga mat is the only essential. A block and strap are helpful but not required—your trainer will show you how to use household items like books and belts as substitutes."
                            },
                            {
                                q: "Can I join if I have back pain or a specific health condition?",
                                a: "Inform your trainer before joining. Hatha Yoga is highly therapeutic for back pain when practiced with correct alignment. Always consult your doctor for serious medical conditions."
                            },
                            {
                                q: "What time zone are the sessions in?",
                                a: "All sessions are in IST — Indian Standard Time. For NRI students in US/UK/Singapore, international batches can be scheduled on request. Contact us to enquire."
                            },
                            {
                                q: "Is this course suitable for men?",
                                a: "Absolutely. Hatha Yoga specifically benefits men who experience back pain, poor posture and stress from desk jobs. Male and female students join together in the same batches."
                            },
                            {
                                q: "How is online yoga effective — won't I need physical corrections?",
                                a: "Your trainer uses the camera to watch your alignment live and provides verbal corrections in real time. Students report this is significantly more effective than YouTube."
                            },
                            {
                                q: "Do I get a certificate?",
                                a: "Yes — a Celoris course completion certificate is issued after completing the 8-week programme and final assessment."
                            }
                        ].map((faq, i) => (
                            <AccordionItem key={i} value={`faq-${i}`} className="border border-white/5 bg-slate-900/40 rounded-2xl px-6">
                                <AccordionTrigger className="hover:no-underline py-6">
                                    <span className="text-md font-black text-white italic uppercase tracking-tight text-left">{faq.q}</span>
                                </AccordionTrigger>
                                <AccordionContent className="pb-6 text-slate-400 font-bold uppercase text-[10px] tracking-widest leading-relaxed italic opacity-70">
                                    {faq.a}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </section>

            {/* CTA Final */}
            <section className="py-32 relative overflow-hidden">
                <div className="container max-w-7xl mx-auto px-4 relative z-10">
                    <div className="p-16 rounded-[4rem] bg-gradient-to-br from-emerald-600 to-blue-800 text-center relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1510894347713-fc3ad6cb03a8?auto=format&fit=crop&q=80&w=2000')] bg-cover opacity-10 grayscale mix-blend-overlay group-hover:scale-110 transition-transform duration-[5s]" />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="relative z-10"
                        >
                            <h2 className="text-4xl md:text-7xl font-black text-white italic uppercase tracking-tighter mb-8 leading-[0.9]">
                                Start Your Journey <br /> Towards Balance
                            </h2>
                            <p className="text-xl text-emerald-100 font-bold italic uppercase tracking-tight mb-12 max-w-2xl mx-auto">
                                No commitments. No risk. Experience one complete session live for free.
                            </p>
                            <a href="https://wa.me/919643579101?text=I%20want%20to%20start%20my%20Hatha%20Yoga%20journey%20with%20a%20free%20demo">
                                <Button className="h-20 px-12 bg-white text-black hover:bg-emerald-50 rounded-2xl font-black uppercase tracking-widest text-sm shadow-2xl active:scale-95 transition-all italic">
                                    Book Free Demo Session
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </a>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Footer Text */}
            <footer className="py-20 border-t border-white/5 bg-slate-950">
                <div className="container max-w-7xl mx-auto px-4 text-center">
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] mb-4 italic">Celoris Designs LLP | Incorporated 23rd May 2019 | Ministry of Corporate Affairs, India</p>
                    <p className="text-[8px] font-black text-slate-800 uppercase tracking-[0.2em] italic">LLP Identification No: AAP-3965 | GST No: 09AAOFC5435B1ZJ</p>
                </div>
            </footer>
        </div>
    )
}
