'use client';

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import {
    ArrowLeft, Calendar, Clock, Tag, Check, X,
    Music, Globe, Zap, ListChecks, HelpCircle,
    ArrowRight, Star, Shield, Info, Laptop, Headphones,
    BookOpen, GraduationCap, Timer, AlertCircle,
    Layout, Database, PenTool, Box, Smartphone,
    Share2, IndianRupee, MapPin
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function OnlineTeachingDelhiBlog() {
    return (
        <div className="min-h-screen bg-[#050810] text-slate-300 selection:bg-emerald-500/30">
            {/* Hero Section */}
            <div className="relative h-[600px] w-full overflow-hidden">
                {/* Background Image - Using the 2025 image as placeholder or a generated one */}
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-110"
                    style={{
                        backgroundImage: 'url("/blog-online-teaching-delhi-2026.png")'
                    }}
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/50 bg-gradient-to-t from-[#050810] via-[#050810]/60 to-transparent" />

                <div className="container relative h-full flex flex-col justify-end pb-16 text-white px-4">
                    <Button
                        variant="ghost"
                        className="text-white w-fit mb-10 hover:bg-white/10 group bg-black/20 backdrop-blur-md border border-white/10 rounded-full pr-6"
                        asChild
                    >
                        <Link href="/blog">
                            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                            Back to Insights
                        </Link>
                    </Button>

                    <div className="max-w-5xl">
                        <div className="flex flex-wrap items-center gap-4 mb-8">
                            <span className="bg-emerald-500/20 text-emerald-400 px-5 py-2 rounded-full text-xs font-black tracking-[0.2em] uppercase border border-emerald-500/30 backdrop-blur-md">
                                Trainer Resources
                            </span>
                            <span className="text-slate-200 text-xs font-bold flex items-center gap-2 bg-black/40 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
                                <Clock className="h-4 w-4 text-emerald-500" /> 10 MIN READ
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-7xl font-black mb-8 leading-[1] tracking-tighter text-white drop-shadow-2xl">
                            Online Teaching Jobs in Delhi: <span className="text-emerald-400">How to Start Teaching Dance, Excel & Content Creation in 2026</span>
                        </h1>
                        <div className="flex flex-wrap items-center gap-8 text-slate-400">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-600 flex items-center justify-center text-white font-black text-xl border-2 border-white/20 shadow-2xl">
                                    C
                                </div>
                                <div>
                                    <p className="font-black text-white tracking-tight text-lg leading-none mb-1">Celoris</p>
                                    <p className="text-[10px] uppercase font-black tracking-[0.2em] text-emerald-500">Official Creator</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 font-bold bg-white/5 px-4 py-2 rounded-full border border-white/5">
                                <Calendar className="h-4 w-4 text-emerald-500" />
                                <span className="text-sm uppercase tracking-widest text-slate-200">March 7, 2026</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="container py-20 px-4 relative">
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[150px] -z-10" />
                <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[150px] -z-10" />

                <div className="max-w-4xl mx-auto">
                    <div className="bg-[#0a0f1d] rounded-[3rem] p-8 md:p-16 shadow-2xl border border-white/5 relative overflow-hidden">
                        <div className="prose prose-invert prose-emerald max-w-none 
                            prose-headings:text-white prose-headings:font-black prose-headings:tracking-tight
                            prose-p:text-slate-300 prose-p:leading-relaxed prose-p:text-lg prose-p:mb-8
                            prose-strong:text-emerald-400 prose-strong:font-bold
                            prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:underline
                        ">
                            <div className="mb-16">
                                <p className="text-xl md:text-2xl text-slate-100 leading-relaxed font-bold italic bg-emerald-500/10 border-l-8 border-emerald-500 p-8 rounded-r-3xl shadow-lg">
                                    "Looking for online teaching jobs in Delhi? You're not alone. Thousands of skilled professionals across Delhi NCR are discoverering that teaching online is not just possible—it's actually more rewarding than offline tutoring."
                                </p>
                            </div>

                            <p>
                                But here's the problem: most platforms that list "online teaching jobs in Delhi" are glorified job boards. They treat you like a freelancer looking for odd jobs—not like a professional building a career.
                            </p>
                            <p>
                                This guide is different. We're going to show you exactly how to start teaching online in Delhi in 2026, which platforms actually work for Indian trainers, what skills are in highest demand, and how to build a sustainable income—not just find a one-time gig.
                            </p>
                            <p>
                                Whether you're a Bollywood dance instructor in Lajpat Nagar, an Excel wizard in Noida, or a content creation coach in Gurugram—this is the guide you've been looking for.
                            </p>

                            <h2 className="text-3xl md:text-5xl font-black mt-24 mb-10 text-white flex items-center gap-4">
                                <Globe className="h-10 w-10 text-emerald-500" />
                                Why Online Teaching is Booming in Delhi
                            </h2>
                            <p>
                                Delhi NCR is India's second-largest educational market—but the real shift happening right now is from offline tuition centres to online learning platforms. Here's what's driving it:
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-12">
                                {[
                                    {
                                        title: "Post-Pandemic Habit Change",
                                        desc: "Students in Delhi are now comfortable learning via Zoom, Google Meet, and recorded video courses.",
                                        icon: <Smartphone className="h-6 w-6 text-emerald-400" />
                                    },
                                    {
                                        title: "No More Commute Pain",
                                        desc: "Spending 2 hours on Delhi Metro to attend a dance class? Students are increasingly choosing online alternatives.",
                                        icon: <Clock className="h-6 w-6 text-cyan-400" />
                                    },
                                    {
                                        title: "Skill-Based Demand Surge",
                                        desc: "Courses in Excel, content creation, and digital skills have seen 3x demand growth in Delhi NCR over the past 2 years.",
                                        icon: <Zap className="h-6 w-6 text-yellow-400" />
                                    },
                                    {
                                        title: "Higher Income Potential",
                                        desc: "Online trainers in Delhi are earning ₹30,000–₹1,50,000/month—often more than offline coaching centres.",
                                        icon: <IndianRupee className="h-6 w-6 text-purple-400" />
                                    }
                                ].map((item, i) => (
                                    <div key={i} className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:border-emerald-500/20 transition-all">
                                        <div className="mb-4">{item.icon}</div>
                                        <h4 className="text-white font-black mb-2">{item.title}</h4>
                                        <p className="text-sm text-slate-400">{item.desc}</p>
                                    </div>
                                ))}
                            </div>

                            <h2 className="text-3xl md:text-5xl font-black mt-24 mb-12 text-white">
                                Top Skills in <span className="text-emerald-500">Demand</span> (2026)
                            </h2>
                            <p>Not all teaching subjects are equal. Here's a breakdown of the most in-demand online teaching categories in Delhi right now:</p>

                            <div className="space-y-6 my-12">
                                <div className="bg-[#121a2e] p-8 rounded-3xl border border-white/10 relative group hover:border-emerald-500/30 transition-all">
                                    <h3 className="text-xl font-black text-white mb-4 flex items-center gap-3">
                                        <Music className="h-6 w-6 text-emerald-500" /> 1. Dance — Bollywood, Zumba & Fusion
                                    </h3>
                                    <p className="text-slate-300 text-sm mb-4">
                                        Delhi has a massive dance culture. From Bollywood to Kathak to contemporary fusion, online dance classes have exploded.
                                    </p>
                                    <ul className="text-slate-400 text-xs space-y-2 list-none p-0">
                                        <li className="flex items-center gap-2"><Check className="h-3 w-3 text-emerald-500" /> Average fee: ₹999 – ₹3,499</li>
                                        <li className="flex items-center gap-2"><Check className="h-3 w-3 text-emerald-500" /> Target: Women aged 18–40, beginners</li>
                                        <li className="flex items-center gap-2"><Check className="h-3 w-3 text-emerald-500" /> Hotspots: South Delhi, Noida, Dwarka</li>
                                    </ul>
                                </div>

                                <div className="bg-[#121a2e] p-8 rounded-3xl border border-white/10 relative group hover:border-cyan-500/30 transition-all">
                                    <h3 className="text-xl font-black text-white mb-4 flex items-center gap-3">
                                        <Database className="h-6 w-6 text-cyan-500" /> 2. Excel & Data Skills
                                    </h3>
                                    <p className="text-slate-300 text-sm mb-4">
                                        Delhi's massive corporate ecosystem—from CP MNCs to Gurugram startups—creates non-stop demand for productivity skills.
                                    </p>
                                    <ul className="text-slate-400 text-xs space-y-2 list-none p-0">
                                        <li className="flex items-center gap-2"><Check className="h-3 w-3 text-cyan-500" /> Average fee: ₹1,499 – ₹4,999</li>
                                        <li className="flex items-center gap-2"><Check className="h-3 w-3 text-cyan-500" /> Target: Office professionals, MBA students</li>
                                        <li className="flex items-center gap-2"><Check className="h-3 w-3 text-cyan-500" /> Format: Short cohorts or self-paced</li>
                                    </ul>
                                </div>

                                <div className="bg-[#121a2e] p-8 rounded-3xl border border-white/10 relative group hover:border-purple-500/30 transition-all">
                                    <h3 className="text-xl font-black text-white mb-4 flex items-center gap-3">
                                        <PenTool className="h-6 w-6 text-purple-500" /> 3. Content Creation & Social Media
                                    </h3>
                                    <p className="text-slate-300 text-sm mb-4">
                                        Delhi has one of the highest concentrations of aspiring creators. Huge demand for video editing and branding coaches.
                                    </p>
                                    <ul className="text-slate-400 text-xs space-y-2 list-none p-0">
                                        <li className="flex items-center gap-2"><Check className="h-3 w-3 text-purple-500" /> Average fee: ₹1,999 – ₹6,999</li>
                                        <li className="flex items-center gap-2"><Check className="h-3 w-3 text-purple-500" /> Target: College students, freelancers</li>
                                        <li className="flex items-center gap-2"><Check className="h-3 w-3 text-purple-500" /> Niche: Instagram growth, YouTube</li>
                                    </ul>
                                </div>

                                <div className="bg-[#121a2e] p-8 rounded-3xl border border-white/10 relative group hover:border-yellow-500/30 transition-all">
                                    <h3 className="text-xl font-black text-white mb-4 flex items-center gap-3">
                                        <Box className="h-6 w-6 text-yellow-500" /> 4. Blender & 3D Design
                                    </h3>
                                    <p className="text-slate-300 text-sm mb-4">
                                        With the rise of gaming and VFX in NCR, Blender has become an increasingly sought-after skill.
                                    </p>
                                    <ul className="text-slate-400 text-xs space-y-2 list-none p-0">
                                        <li className="flex items-center gap-2"><Check className="h-3 w-3 text-yellow-500" /> Average fee: ₹2,499 – ₹7,999</li>
                                        <li className="flex items-center gap-2"><Check className="h-3 w-3 text-yellow-500" /> Target: Design students, architects</li>
                                        <li className="flex items-center gap-2"><Check className="h-3 w-3 text-yellow-500" /> Market: Underserved in India</li>
                                    </ul>
                                </div>
                            </div>

                            <h2 className="text-3xl md:text-5xl font-black mt-24 mb-12 text-white">
                                Step-by-Step <span className="text-emerald-500">Guide</span>
                            </h2>

                            <div className="relative border-l-2 border-emerald-500/30 ml-4 pl-12 space-y-12 my-16">
                                {[
                                    { label: "Step 1: Define Your Teaching Niche", content: "Don't just teach 'dance'—teach Bollywood for beginners or Zumba for weight loss. Specializing earns you more." },
                                    { label: "Step 2: Choose the Right Platform", content: "Avoid generic job boards that pay per hour. Use India-focused platforms like Celoris to build your own brand and course library." },
                                    { label: "Step 3: Build Your Course Curriculum", content: "Map out your learning outcomes. Modules should be 4-8 weeks. Mix theory with practice for real transformation." },
                                    { label: "Step 4: Price Your Course Correctly", content: "Underpricing is a mistake. Beginner courses should be ₹799–₹1,499. Advanced courses with mentoring can go up to ₹6,999." },
                                    { label: "Step 5: Market Yourself", content: "Use Instagram Reels, LinkedIn, and WhatsApp communities in Delhi to find your first students. Listing on Celoris connects you with serious learners." }
                                ].map((t, i) => (
                                    <div key={i} className="relative">
                                        <div className="absolute -left-[61px] top-1 w-6 h-6 rounded-full bg-emerald-500 border-4 border-[#0a0f1d] z-10" />
                                        <h4 className="text-white font-black text-xl mb-2">{t.label}</h4>
                                        <p className="text-slate-400 text-sm mb-0">{t.content}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-emerald-500/5 border border-emerald-500/20 p-8 rounded-3xl mb-8">
                                <p className="text-white font-bold mb-4 flex items-center gap-2">
                                    <Info className="h-5 w-5 text-emerald-500" /> Pro-Tip for 2026:
                                </p>
                                <p className="text-slate-400 text-sm italic mb-0">
                                    You don't need expensive equipment to start. Your smartphone camera is enough. Start today and upgrade as you grow.
                                </p>
                            </div>

                            <h2 className="text-3xl md:text-5xl font-black mt-24 mb-12 text-white">
                                How Much Can <span className="text-emerald-500">You Earn?</span>
                            </h2>
                            <p>Here's a realistic income breakdown for online trainers in Delhi NCR:</p>

                            <div className="space-y-6 my-16">
                                {[
                                    {
                                        role: "Dance Teacher (Bollywood/Zumba)",
                                        income: "₹15,000 – ₹45,000/month",
                                        detail: "Scale easily with recorded courses and live memberships."
                                    },
                                    {
                                        role: "Excel / Data Trainer",
                                        income: "₹37,000 – ₹1,50,000/month",
                                        detail: "Combine individual coaching with high-ticket corporate training batches."
                                    },
                                    {
                                        role: "Content Creation Coach",
                                        income: "₹35,000 – ₹80,000/month",
                                        detail: "Add 1:1 consulting and brand collaborations as you build authority."
                                    }
                                ].map((p, i) => (
                                    <div key={i} className="flex flex-col md:flex-row gap-6 p-8 bg-[#12182b] rounded-3xl border border-white/5">
                                        <div className="md:w-1/2">
                                            <h4 className="text-white font-black text-xl mb-2">{p.role}</h4>
                                            <span className="text-emerald-500 font-black text-2xl">{p.income}</span>
                                        </div>
                                        <div className="md:w-1/2 flex items-center">
                                            <p className="text-slate-400 text-sm leading-relaxed mb-0">{p.detail}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <h2 className="text-3xl md:text-5xl font-black mt-32 mb-12 text-white flex items-center gap-4">
                                <AlertCircle className="h-10 w-10 text-red-500" />
                                Mistakes to Avoid
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-32">
                                {[
                                    {
                                        title: "Teaching on too many platforms",
                                        desc: "Focus on one platform, build your reputation, then expand."
                                    },
                                    {
                                        title: "Underpricing out of fear",
                                        desc: "Low prices attract low-commitment students. Price based on value."
                                    },
                                    {
                                        title: "Waiting for perfect gear",
                                        desc: "Your phone is enough. Starting is more important than equipment."
                                    },
                                    {
                                        title: "Ignoring Testimonials",
                                        desc: "Your first 5 students are gold. Use their feedback to build trust."
                                    }
                                ].map((m, i) => (
                                    <div key={i} className="bg-red-500/5 border border-red-500/10 p-8 rounded-3xl">
                                        <h4 className="text-white font-black text-lg mb-4 flex items-center gap-2">
                                            <X className="h-5 w-5 text-red-500" /> {m.title}
                                        </h4>
                                        <p className="text-slate-400 text-sm leading-relaxed mb-0">{m.desc}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-emerald-500/10 border border-emerald-500/20 p-10 md:p-16 rounded-[3rem] my-32 text-center">
                                <h2 className="text-3xl md:text-4xl font-black text-white mb-8">Ready to start your teaching career?</h2>
                                <p className="text-slate-400 mb-12 text-lg">Celoris is built specifically for Indian trainers to grow, scale, and earn.</p>
                                <Button size="lg" className="bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-[0.2em] rounded-full px-16 py-8 text-xl shadow-[0_20px_40px_rgba(16,185,129,0.3)] hover:scale-105 transition-all" asChild>
                                    <Link href="/become-trainer">Apply as Trainer</Link>
                                </Button>
                            </div>

                            <h2 className="text-3xl md:text-5xl font-black mt-32 mb-12 text-white flex items-center gap-4">
                                <HelpCircle className="h-10 w-10 text-emerald-500" />
                                FAQs
                            </h2>
                            <div className="mb-32">
                                <Accordion type="single" collapsible className="space-y-4">
                                    {[
                                        {
                                            q: "Do I need a degree to teach online in Delhi?",
                                            a: "No. For most skill-based courses, what matters is your expertise and ability to teach clearly. A portfolio and student testimonials matter more than formal credentials."
                                        },
                                        {
                                            q: "How long does it take to get my first students?",
                                            a: "With the right platform and marketing, most Delhi trainers get their first paying students within 2–4 weeks of launching."
                                        },
                                        {
                                            q: "Can I teach online from home in Delhi NCR?",
                                            a: "Absolutely. All you need is a smartphone/laptop, decent internet (Jio Fiber/Airtel Xstream), and a quiet space."
                                        },
                                        {
                                            q: "What's the difference between live and recorded classes?",
                                            a: "Live classes offer real-time interaction. Recorded courses can be sold repeatedly without your live time—this is how you scale income."
                                        }
                                    ].map((faq, i) => (
                                        <AccordionItem key={i} value={`item-${i}`} className="border-white/10 bg-white/5 px-8 rounded-[2rem] overflow-hidden">
                                            <AccordionTrigger className="text-left text-white font-black py-8 hover:no-underline text-xl">{faq.q}</AccordionTrigger>
                                            <AccordionContent className="text-slate-400 pb-8 text-lg leading-relaxed">
                                                {faq.a}
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </div>

                            <div className="mt-32 pt-16 border-t border-white/10">
                                <h2 className="text-3xl md:text-5xl font-black mb-10 text-white tracking-tight">Final Thoughts</h2>
                                <p className="text-lg leading-relaxed mb-6 font-medium text-slate-200">
                                    The demand for quality online teachers in Delhi NCR has never been higher. Students across South Delhi, Noida, Gurugram, and Dwarka are actively searching for experts like you.
                                </p>
                                <p className="text-lg leading-relaxed mb-12">
                                    The trainers who win are the ones who act now—who build structured courses, list on the right platforms, and position themselves as experts rather than hourly tutors. <span className="text-emerald-400 font-black">2026 is your year to go online.</span>
                                </p>
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="mt-12 pt-12 border-t border-white/10 flex flex-wrap gap-3">
                            <Tag className="h-4 w-4 text-emerald-500 mt-1" />
                            {['Online Teaching Delhi', 'Trainer Jobs India', 'Teaching Dance Online', 'Excel Trainer Jobs', 'Celoris Blog', 'Digital Education'].map((tag) => (
                                <span key={tag} className="bg-white/5 text-slate-400 px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest hover:bg-emerald-500/20 hover:text-emerald-400 transition-all cursor-default border border-white/5 hover:border-emerald-500/30">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <footer className="container py-12 px-4 mx-auto border-t border-white/5 text-center mt-20">
                <p className="text-[10px] font-black tracking-[0.4em] text-slate-600 uppercase mb-4">
                    Published by Celoris | celoris.in | Your Creative Learning Platform
                </p>
                <p className="text-[10px] font-black tracking-[0.4em] text-slate-600 uppercase">
                    © {new Date().getFullYear()} Celoris.in • All Rights Reserved
                </p>
            </footer>
        </div>
    );
}
