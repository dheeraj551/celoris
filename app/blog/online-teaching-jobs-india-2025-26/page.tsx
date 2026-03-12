'use client';

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import {
    ArrowLeft, Calendar, Clock, Tag, Check, X,
    Music, Globe, Zap, ListChecks, HelpCircle,
    ArrowRight, Star, Shield, Info, Laptop, Headphones,
    BookOpen, GraduationCap, Timer, AlertCircle,
    Layout, Database, PenTool, Box, Smartphone,
    Share2, IndianRupee, MapPin, Camera, Video,
    Mic, Wifi, BarChart, Target, Rocket
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function OnlineTeachingIndiaBlog() {
    return (
        <div className="min-h-screen bg-[#050810] text-slate-300 selection:bg-emerald-500/30">
            {/* Hero Section */}
            <div className="relative h-[650px] w-full overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-110"
                    style={{
                        backgroundImage: 'url("/blog-online-teaching-india-2025.png")'
                    }}
                />
                <div className="absolute inset-0 bg-black/60 bg-gradient-to-t from-[#050810] via-[#050810]/70 to-transparent" />

                <div className="container relative h-full flex flex-col justify-end pb-16 text-white px-4 mx-auto">
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
                                Career Guide 2025–26
                            </span>
                            <span className="text-slate-200 text-xs font-bold flex items-center gap-2 bg-black/40 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
                                <Clock className="h-4 w-4 text-emerald-500" /> 15 MIN READ
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-7xl font-black mb-8 leading-[1] tracking-tighter text-white drop-shadow-2xl">
                            Online Teaching Jobs in India: <span className="text-emerald-400 text-shadow-glow">How to Earn from Home by Teaching What You Know</span>
                        </h1>
                        <div className="flex flex-wrap items-center gap-8 text-slate-400">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-600 flex items-center justify-center text-white font-black text-xl border-2 border-white/20 shadow-2xl">
                                    C
                                </div>
                                <div>
                                    <p className="font-black text-white tracking-tight text-lg leading-none mb-1">Celoris Editorial</p>
                                    <p className="text-[10px] uppercase font-black tracking-[0.2em] text-emerald-500">Official Career Guide</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 font-bold bg-white/5 px-4 py-2 rounded-full border border-white/5">
                                <Calendar className="h-4 w-4 text-emerald-500" />
                                <span className="text-sm uppercase tracking-widest text-slate-200">March 12, 2026</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="container py-20 px-4 relative mx-auto">
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
                                    "Are you a skilled professional, a subject matter expert, or a passionate teacher looking for online teaching jobs in India? Whether you want to teach dance, spoken English, digital marketing, guitar, Excel, or coding—the demand for quality online tutors has never been higher."
                                </p>
                            </div>

                            <p>
                                In 2025 and 2026, the definition of a 'job' in India has irrevocably changed. No longer are we tied to the 9-to-5 cubicle or the physical four walls of a traditional classroom. The rise of high-speed internet (driven by Jio and Airtel 5G), the widespread adoption of digital payments, and a fundamental shift in how Indians consume education have created a trillion-rupee opportunity for anyone with a skill to share.
                            </p>
                            <p>
                                India is currently home to the world’s largest student population, and increasingly, these students (and their parents) are looking for quality instruction beyond their local neighborhood coaching centers. They want the best of Delhi, Mumbai, or Bengaluru, right in their living rooms in Jaipur, Lucknow, or even smaller Tier-3 towns.
                            </p>
                            <p>
                                Whether you are an experienced educator or someone with a hobby that you’ve mastered over the years, this guide is your blueprint to navigating the world of <strong>online teaching jobs in India 2025–26</strong>.
                            </p>

                            <h2 className="text-3xl md:text-5xl font-black mt-24 mb-10 text-white flex items-center gap-4">
                                <Globe className="h-10 w-10 text-emerald-500" />
                                Why Online Teaching is Booming in India
                            </h2>
                            <p>
                                India's e-learning market is projected to reach ₹2.28 lakh crore by 2030. But what exactly is driving this growth? It’s not just "Zoom classes"; it's a complete ecosystem change.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-12">
                                {[
                                    {
                                        title: "Work from Home Freedom",
                                        desc: "Zero commute, no traffic jams, and a flexible schedule that fits your life, not your boss's.",
                                        icon: <Laptop className="h-6 w-6 text-emerald-400" />
                                    },
                                    {
                                        title: "Massive Earning Potential",
                                        desc: "Earn ₹500 to ₹2,000+ per hour. Top-tier trainers on Celoris are making over ₹1.5 Lakh per month.",
                                        icon: <IndianRupee className="h-6 w-6 text-cyan-400" />
                                    },
                                    {
                                        title: "Pan-India Reach",
                                        desc: "Teach students from Kashmir to Kanyakumari without relocating or paying heavy office rentals.",
                                        icon: <Globe className="h-6 w-6 text-yellow-400" />
                                    },
                                    {
                                        title: "Personal Brand Building",
                                        desc: "You aren't just an 'employee'; you are a creator-educator building a loyal student base.",
                                        icon: <Rocket className="h-6 w-6 text-purple-400" />
                                    }
                                ].map((item, i) => (
                                    <div key={i} className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:border-emerald-500/20 transition-all">
                                        <div className="mb-4">{item.icon}</div>
                                        <h4 className="text-white font-black mb-2">{item.title}</h4>
                                        <p className="text-sm text-slate-400">{item.desc}</p>
                                    </div>
                                ))}
                            </div>

                            <p>
                                Post-pandemic, millions of students across Delhi, Mumbai, Bengaluru, Hyderabad, and even Tier-2 cities now prefer learning online. The stigma of "online isn't as good as offline" has vanished. In fact, many parents now prefer online classes because they can monitor their child’s progress and save time on commuting.
                            </p>

                            <h2 className="text-3xl md:text-5xl font-black mt-24 mb-12 text-white">
                                What Subjects Are in <span className="text-emerald-500">High Demand?</span>
                            </h2>
                            <p>
                                Not sure if your skill qualifies? The beauty of the modern internet is that almost <em>anything</em> can be taught online if there is a problem it solves or a joy it provides. Here are the hottest categories on <strong>celoris.in</strong> right now:
                            </p>

                            <div className="space-y-8 my-12">
                                <div className="bg-[#121a2e] p-8 rounded-3xl border border-white/10 relative group hover:border-emerald-500/30 transition-all">
                                    <h3 className="text-2xl font-black text-white mb-4 flex items-center gap-3">
                                        <Music className="h-7 w-7 text-emerald-500" /> 1. Dance — Bollywood, Zumba & Classical
                                    </h3>
                                    <p className="text-slate-300 mb-6">
                                        Online dance classes are hugely popular, especially Bollywood and Zumba. Parents want their kids trained at home; adults want fitness routines that are actually fun. With the rise of Instagram Reels, everyone wants to learn how to move. If you are a trained dance instructor or even an energetic self-taught performer, this is a golden opportunity.
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <ul className="text-slate-400 text-sm space-y-2 list-none p-0">
                                            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500" /> High Demand: Bollywood & Kathak</li>
                                            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500" /> Earning: ₹400 - ₹1,200 / session</li>
                                        </ul>
                                        <ul className="text-slate-400 text-sm space-y-2 list-none p-0">
                                            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500" /> Growing: Fitness-based Zumba</li>
                                            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500" /> Format: Both Live & Recorded</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="bg-[#121a2e] p-8 rounded-3xl border border-white/10 relative group hover:border-cyan-500/30 transition-all">
                                    <h3 className="text-2xl font-black text-white mb-4 flex items-center gap-3">
                                        <Globe className="h-7 w-7 text-cyan-500" /> 2. Spoken English & Communication
                                    </h3>
                                    <p className="text-slate-300 mb-6">
                                        English is the language of opportunity in India. Millions of professionals and students want to improve their fluency for jobs, interviews, and social confidence. This isn't just about grammar; it's about confidence, accent softening, and professional etiquette. Trainers who can deliver "results" (e.g., getting a student through a job interview) can charge a premium.
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <ul className="text-slate-400 text-sm space-y-2 list-none p-0">
                                            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-cyan-500" /> Focus: Corporate Communication</li>
                                            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-cyan-500" /> Price: ₹300 - ₹800 / session</li>
                                        </ul>
                                        <ul className="text-slate-400 text-sm space-y-2 list-none p-0">
                                            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-cyan-500" /> Niche: Public Speaking</li>
                                            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-cyan-500" /> Target: Students & Job Seekers</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="bg-[#121a2e] p-8 rounded-3xl border border-white/10 relative group hover:border-purple-500/30 transition-all">
                                    <h3 className="text-2xl font-black text-white mb-4 flex items-center gap-3">
                                        <Zap className="h-7 w-7 text-purple-500" /> 3. Digital Marketing & Content Creation
                                    </h3>
                                    <p className="text-slate-300 mb-6">
                                        With every business from small kirana stores to large MNCs going online, digital marketing skills—SEO, social media, Google Ads, content creation—are among the most-searched courses in India. If you have hands-on experience, you can build a massive full-time income by teaching others how to grow their businesses or careers.
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <ul className="text-slate-400 text-sm space-y-2 list-none p-0">
                                            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-purple-500" /> Top Skill: Meta & Google Ads</li>
                                            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-purple-500" /> Earning: ₹500 - ₹1,500 / hr</li>
                                        </ul>
                                        <ul className="text-slate-400 text-sm space-y-2 list-none p-0">
                                            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-purple-500" /> Hot: AI Tools for Marketing</li>
                                            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-purple-500" /> Format: 4-week Cohorts</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="bg-[#121a2e] p-8 rounded-3xl border border-white/10 relative group hover:border-yellow-500/30 transition-all">
                                    <h3 className="text-2xl font-black text-white mb-4 flex items-center gap-3">
                                        <Database className="h-7 w-7 text-yellow-500" /> 4. Tech Skills — Python, AI, Excel & Data
                                    </h3>
                                    <p className="text-slate-300 mb-6">
                                        Excel trainers, Python instructors, and AI course creators are among the highest-paid online educators today. Corporate learners and students are both hungry for these practical, job-ready skills. As AI transforms the workplace, the demand for teachers who can demystify Generative AI (like ChatGPT, Midjourney) has skyrocketed in 2025.
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <ul className="text-slate-400 text-sm space-y-2 list-none p-0">
                                            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-yellow-500" /> High Ticket: AI & Machine Learning</li>
                                            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-yellow-500" /> Earning: ₹800 - ₹2,500 / session</li>
                                        </ul>
                                        <ul className="text-slate-400 text-sm space-y-2 list-none p-0">
                                            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-yellow-500" /> Essential: Advanced Excel</li>
                                            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-yellow-500" /> Audience: Corporate Executives</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-emerald-500/5 border border-emerald-500/20 p-8 rounded-3xl mb-12">
                                <p className="text-white font-bold mb-4 flex items-center gap-2">
                                    <Info className="h-5 w-5 text-emerald-500" /> Pro Tip:
                                </p>
                                <p className="text-slate-400 text-lg italic mb-0">
                                    You do not need a formal teaching degree to teach online. You need expertise, clarity, and the right platform. Celoris connects subject experts directly with students—no B.Ed or PhD required.
                                </p>
                            </div>

                            <h2 className="text-3xl md:text-5xl font-black mt-32 mb-12 text-white flex items-center gap-4">
                                <ListChecks className="h-10 w-10 text-emerald-500" />
                                Case Studies: Success Stories from Celoris
                            </h2>
                            <p>
                                Sometimes, numbers don't tell the whole story. Real human success does. Here are two trainers who transformed their lives by joining the Celoris ecosystem in 2025:
                            </p>

                            <div className="space-y-10 my-16">
                                <div className="bg-[#12182b] p-10 rounded-[3rem] border border-white/5 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                                        <Music className="w-32 h-32 text-emerald-500" />
                                    </div>
                                    <h4 className="text-2xl font-black text-white mb-4">Priya S. — From Freelance Dancer to Digital Studio Owner</h4>
                                    <p className="text-slate-400 mb-6">
                                        Priya was a local dance teacher in Janakpuri, Delhi, struggling with erratic class attendance and high studio rent. In early 2025, she moved her 'Bollywood Beats' studio online via Celoris. 
                                    </p>
                                    <ul className="text-sm text-slate-300 space-y-3 mb-6 p-0">
                                        <li className="flex gap-3"><Star className="h-5 w-5 text-yellow-500 shrink-0" /> Started with 5 local students; now has 140+ students across 12 countries.</li>
                                        <li className="flex gap-3"><Star className="h-5 w-5 text-yellow-500 shrink-0" /> Income grew from ₹15,000/month to ₹1.85 Lakh/month.</li>
                                        <li className="flex gap-3"><Star className="h-5 w-5 text-yellow-500 shrink-0" /> Launched a pre-recorded 'Kathak Basics' course that earns ₹40,000 passive income.</li>
                                    </ul>
                                    <p className="text-emerald-400 font-bold italic">"Celoris didn't just give me students; they gave me a brand."</p>
                                </div>

                                <div className="bg-[#12182b] p-10 rounded-[3rem] border border-white/5 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                                        <Box className="w-32 h-32 text-cyan-500" />
                                    </div>
                                    <h4 className="text-2xl font-black text-white mb-4">Arjun K. — The 3D Design Expert from Kochi</h4>
                                    <p className="text-slate-400 mb-6">
                                        Arjun was a professional animator who wanted to share his love for Blender 3D. Living in Kochi, he thought his market was limited. Within 3 months of listing on Celoris, he became the top-rated 3D trainer in India.
                                    </p>
                                    <ul className="text-sm text-slate-300 space-y-3 mb-6 p-0">
                                        <li className="flex gap-3"><Star className="h-5 w-5 text-yellow-500 shrink-0" /> Teaches corporate batches for architecture firms in Mumbai and Bengaluru.</li>
                                        <li className="flex gap-3"><Star className="h-5 w-5 text-yellow-500 shrink-0" /> Hourly rate increased from ₹800 to ₹3,500 due to his 4.9-star rating.</li>
                                        <li className="flex gap-3"><Star className="h-5 w-5 text-yellow-500 shrink-0" /> Uses the platform's automated scheduling to manage his full-time job and teaching.</li>
                                    </ul>
                                    <p className="text-cyan-400 font-bold italic">"I never thought my specialization would have this much demand."</p>
                                </div>
                            </div>

                            <h2 className="text-3xl md:text-5xl font-black mt-32 mb-12 text-white flex items-center gap-4">
                                <Shield className="h-10 w-10 text-emerald-500" />
                                Legal, Taxation & Payments for Indian Trainers
                            </h2>
                            <p>
                                When you start earning significant money, you need to think like a business owner. Here’s a quick primer on the 'boring but important' stuff for 2026:
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-10">
                                <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
                                    <h4 className="text-white font-black mb-4">1. GST Requirements</h4>
                                    <p className="text-sm text-slate-400">
                                        In India, you generally don't need a GST registration unless your annual turnover exceeds ₹20 Lakh (₹10 Lakh in some states). However, if you sell services across state lines, check with a CA about 'Inter-state taxable supply' rules.
                                    </p>
                                </div>
                                <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
                                    <h4 className="text-white font-black mb-4">2. Section 44ADA (Tax Benefit)</h4>
                                    <p className="text-sm text-slate-400">
                                        As a freelance teacher, you can opt for the Presumptive Taxation Scheme. This allows you to declare only 50% of your total income as profit, significantly reducing your tax liability.
                                    </p>
                                </div>
                                <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
                                    <h4 className="text-white font-black mb-4">3. Bank Accounts</h4>
                                    <p className="text-sm text-slate-400">
                                        We recommend keeping a separate bank account for your teaching income. This makes it easier to track your growth and handle tax filings at the end of the year.
                                    </p>
                                </div>
                                <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
                                    <h4 className="text-white font-black mb-4">4. Contracts & Privacy</h4>
                                    <p className="text-sm text-slate-400">
                                        Celoris handles the Terms of Service for you, ensuring that your intellectual property (your course content) is protected and that student payments are secure.
                                    </p>
                                </div>
                            </div>

                            <h2 className="text-3xl md:text-5xl font-black mt-32 mb-12 text-white flex items-center gap-4">
                                <Camera className="h-10 w-10 text-emerald-500" />
                                Your Tech Stack: From Budget to Pro
                            </h2>
                            <p>
                                You don't need a movie studio, but you do need to be professional. Here is our recommended equipment guide for every stage:
                            </p>
                            
                            <div className="space-y-6 my-12">
                                <div className="p-8 bg-black/40 rounded-3xl border-l-4 border-emerald-500">
                                    <h4 className="text-white font-black text-xl mb-4 italic">Level 1: The 'Just Starting' Kit (₹0 - ₹2,000)</h4>
                                    <ul className="text-slate-400 space-y-2 p-0">
                                        <li><strong>Camera:</strong> Your current Smartphone (using the back camera).</li>
                                        <li><strong>Audio:</strong> Wired earphones with a built-in mic or a ₹600 generic lapel mic.</li>
                                        <li><strong>Lighting:</strong> Natural sunlight from a window facing you.</li>
                                        <li><strong>Platform:</strong> Celoris (Free to list).</li>
                                    </ul>
                                </div>
                                <div className="p-8 bg-black/40 rounded-3xl border-l-4 border-cyan-500">
                                    <h4 className="text-white font-black text-xl mb-4 italic">Level 2: The 'Growing Fast' Kit (₹5,000 - ₹15,000)</h4>
                                    <ul className="text-slate-400 space-y-2 p-0">
                                        <li><strong>Camera:</strong> External Webcam (Logitech C920 or higher).</li>
                                        <li><strong>Audio:</strong> Boya BY-M1 Lapel Mic or a budget Condenser Mic.</li>
                                        <li><strong>Lighting:</strong> 10-inch Ring Light with a tripod.</li>
                                        <li><strong>Tools:</strong> Canva Pro for course slides and thumbnails.</li>
                                    </ul>
                                </div>
                                <div className="p-8 bg-black/40 rounded-3xl border-l-4 border-purple-500">
                                    <h4 className="text-white font-black text-xl mb-4 italic">Level 3: The 'Pro Educator' Kit (₹50,000+)</h4>
                                    <ul className="text-slate-400 space-y-2 p-0">
                                        <li><strong>Camera:</strong> Mirrorless Camera (Sony ZV-E10) as a webcam.</li>
                                        <li><strong>Audio:</strong> Shure MV7 or Rode NT1-A for radio-quality voice.</li>
                                        <li><strong>Lighting:</strong> 2-point Softbox lighting setup.</li>
                                        <li><strong>Setup:</strong> Acoustically treated room or dedicated home office.</li>
                                    </ul>
                                </div>
                            </div>

                            <h2 className="text-3xl md:text-5xl font-black mt-24 mb-12 text-white">
                                How Much Can You <span className="text-emerald-500">Really Earn?</span>
                            </h2>
                            <p>
                                Earnings vary based on the subject, your experience, and how many hours you teach per week. Here is a general estimate based on current market trends in India for 2026:
                            </p>

                            <div className="overflow-x-auto my-12 hidden md:block">
                                <table className="w-full border-collapse bg-[#121a2e] rounded-3xl overflow-hidden border border-white/5">
                                    <thead>
                                        <tr className="bg-emerald-500/20 text-white text-left font-black">
                                            <th className="p-6">Category</th>
                                            <th className="p-6">Session Rate (₹)</th>
                                            <th className="p-6">Estimated Monthly (Part-Time)</th>
                                            <th className="p-6">Estimated Monthly (Full-Time)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-slate-300">
                                        <tr className="border-t border-white/5">
                                            <td className="p-6 font-bold">Spoken English</td>
                                            <td className="p-6">₹300 – ₹800</td>
                                            <td className="p-6">₹20,000+</td>
                                            <td className="p-6 text-emerald-400 font-bold">₹60,000+</td>
                                        </tr>
                                        <tr className="border-t border-white/5 bg-white/5">
                                            <td className="p-6 font-bold">Dance / Fitness</td>
                                            <td className="p-6">₹400 – ₹1,200</td>
                                            <td className="p-6">₹25,000+</td>
                                            <td className="p-6 text-emerald-400 font-bold">₹80,000+</td>
                                        </tr>
                                        <tr className="border-t border-white/5">
                                            <td className="p-6 font-bold">Music (Guitar/Piano)</td>
                                            <td className="p-6">₹400 – ₹1,000</td>
                                            <td className="p-6">₹22,000+</td>
                                            <td className="p-6 text-emerald-400 font-bold">₹75,000+</td>
                                        </tr>
                                        <tr className="border-t border-white/5 bg-white/5">
                                            <td className="p-6 font-bold">IT / AI / Python</td>
                                            <td className="p-6">₹800 – ₹2,500</td>
                                            <td className="p-6">₹45,000+</td>
                                            <td className="p-6 text-emerald-400 font-bold">₹1,50,000+</td>
                                        </tr>
                                        <tr className="border-t border-white/5 text-xs text-slate-500 italic">
                                            <td colSpan={4} className="p-4 text-center">
                                                *Calculated based on average 3 sessions/day for part-time and 6 sessions/day for full-time.
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <p>
                                A trainer teaching just 3–4 sessions per day, 5 days a week, can comfortably earn <strong>₹60,000 to ₹1,50,000 per month</strong> — from home, on their own schedule. Some high-ticket consultants and group batch trainers are hitting much higher figures.
                            </p>

                            <h2 className="text-3xl md:text-5xl font-black mt-24 mb-10 text-white flex items-center gap-4">
                                <MapPin className="h-10 w-10 text-emerald-500" />
                                Online Teaching Near Me — Does Location Matter?
                            </h2>
                            <p>
                                One of the biggest advantages of online teaching is that your location no longer limits your earning potential. However, if you live in cities like <strong>Delhi, Noida, Gurgaon, Mumbai, Bengaluru, Hyderabad, Pune, or Chennai</strong> — you already have a huge local student base actively searching for trainers online.
                            </p>
                            <p>
                                But here’s the secret: Even if you are in a small town like Bareilly or Kochi, you can teach a CEO in Gurugram. The digital wall has collapsed.
                            </p>
                            <div className="bg-[#121a2e] p-8 rounded-3xl border border-white/10 my-10">
                                <h4 className="text-white font-black mb-4">What students are searching for:</h4>
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        "online dance teacher near me", "spoken English tutor online Delhi",
                                        "digital marketing trainer Noida", "guitar classes online Hyderabad",
                                        "Python coaching Mumbai", "Excel classes near me"
                                    ].map((term) => (
                                        <span key={term} className="bg-white/5 px-4 py-2 rounded-lg text-xs font-mono text-emerald-400 border border-white/5">"{term}"</span>
                                    ))}
                                </div>
                            </div>
                            <p>
                                By listing on <strong>Celoris</strong>, your profile becomes discoverable to all these students simultaneously—regardless of whether they are in your city or across the country.
                            </p>

                            <h2 className="text-3xl md:text-5xl font-black mt-24 mb-12 text-white">
                                How to Get Started on <span className="text-emerald-500">Celoris</span>
                            </h2>
                            <p>
                                Celoris (celoris.in) is India’s growing platform for skill-based online learning—built specifically to connect passionate trainers with eager students. Unlike generic freelance sites, we focus on the teacher's brand.
                            </p>

                            <div className="relative border-l-2 border-emerald-500/30 ml-4 pl-12 space-y-12 my-16">
                                {[
                                    { 
                                        label: "1. Create Your Trainer Profile", 
                                        content: "Set up your profile with your skills, experience, and a short intro video. First impressions matter. A high-quality intro video can increase your leads by 3x." 
                                    },
                                    { 
                                        label: "2. Choose Your Teaching Format", 
                                        content: "Do you like live 1-on-1 sessions for personal attention? Or group batches for more income per hour? Maybe pre-recorded courses for passive income? You decide." 
                                    },
                                    { 
                                        label: "3. Set Your Own Pricing", 
                                        content: "You are the boss. We provide the market benchmarks, but you set the price that reflects your value and experience." 
                                    },
                                    { 
                                        label: "4. Get Matched with Students", 
                                        content: "Our algorithm surfaces your profile to students searching for your skill category. No more desperate cold calling or spamming WhatsApp groups." 
                                    },
                                    { 
                                        label: "5. Teach & Collect Secure Payments", 
                                        content: "Conduct sessions via our integrated tools. We handle the payment security, so you don't have to chase students for fees." 
                                    }
                                ].map((t, i) => (
                                    <div key={i} className="relative">
                                        <div className="absolute -left-[61px] top-1 w-6 h-6 rounded-full bg-emerald-500 border-4 border-[#0a0f1d] z-10 shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                                        <h4 className="text-white font-black text-xl mb-2">{t.label}</h4>
                                        <p className="text-slate-400 text-sm mb-0">{t.content}</p>
                                    </div>
                                ))}
                            </div>

                            <h2 className="text-3xl md:text-5xl font-black mt-24 mb-10 text-white flex items-center gap-4">
                                <BarChart className="h-10 w-10 text-emerald-500" />
                                Online Teaching vs Traditional Coaching
                            </h2>
                            <p>
                                Many talented trainers are still running offline coaching classes out of habit. While offline has its charm, the math of 2026 simply favors online.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
                                <div className="bg-red-500/5 p-8 rounded-3xl border border-red-500/10">
                                    <h4 className="text-white font-black mb-6 flex items-center gap-2">
                                        <X className="h-6 w-6 text-red-500" /> Offline Reality
                                    </h4>
                                    <ul className="space-y-4 text-sm text-slate-400 p-0">
                                        <li className="flex gap-3"><AlertCircle className="h-4 w-4 shrink-0 text-red-500" /> Limited to a 5 km radius</li>
                                        <li className="flex gap-3"><AlertCircle className="h-4 w-4 shrink-0 text-red-500" /> High rent & utility bills</li>
                                        <li className="flex gap-3"><AlertCircle className="h-4 w-4 shrink-0 text-red-500" /> Fixed time slots (hard to scale)</li>
                                        <li className="flex gap-3"><AlertCircle className="h-4 w-4 shrink-0 text-red-500" /> No passive income potential</li>
                                    </ul>
                                </div>
                                <div className="bg-emerald-500/5 p-8 rounded-3xl border border-emerald-500/10">
                                    <h4 className="text-white font-black mb-6 flex items-center gap-2">
                                        <Check className="h-6 w-6 text-emerald-500" /> Online Advantage
                                    </h4>
                                    <ul className="space-y-4 text-sm text-slate-400 p-0">
                                        <li className="flex gap-3"><Check className="h-4 w-4 shrink-0 text-emerald-500" /> Reach every student in India</li>
                                        <li className="flex gap-3"><Check className="h-4 w-4 shrink-0 text-emerald-500" /> Zero office overheads</li>
                                        <li className="flex gap-3"><Check className="h-4 w-4 shrink-0 text-emerald-500" /> Flexible hours from home</li>
                                        <li className="flex gap-3"><Check className="h-4 w-4 shrink-0 text-emerald-500" /> Pre-recorded courses earn while you sleep</li>
                                    </ul>
                                </div>
                            </div>

                            <h2 className="text-3xl md:text-5xl font-black mt-24 mb-12 text-white">
                                Tips to <span className="text-emerald-500">Succeed</span> as an Online Teacher
                            </h2>
                            <p>
                                Once you start, here is what separates the top earners (the top 1%) from the average:
                            </p>

                            <div className="space-y-8 my-12">
                                {[
                                    {
                                        title: "Invest in a Professional Setup",
                                        desc: "A decent webcam (like Logitech C922) or a high-end smartphone, a simple ring light, a quiet background, and a stable fiber connection go a long way. Students judge quality by audio and video clarity within the first 60 seconds."
                                    },
                                    {
                                        title: "The 'Rule of 10' Reviews",
                                        desc: "Your first 10 student reviews are your most valuable marketing asset. Deliver genuine results, ask for honest feedback, and display it prominently. On Celoris, reviews are the engine that drives our recommendation algorithm."
                                    },
                                    {
                                        title: "Professional Consistency",
                                        desc: "Treat online teaching like a professional business. Regular availability builds trust. Students (especially parents) want a tutor they can count on, not someone who cancels last minute due to 'personal reasons'."
                                    },
                                    {
                                        title: "The Trial Hook",
                                        desc: "Offering a free or low-cost 20-minute trial session lowers the barrier for new students. Once they experience your energy and teaching style, the 'conversion' to a long-term student is much easier."
                                    }
                                ].map((tip, i) => (
                                    <div key={i} className="flex gap-6 p-8 bg-white/5 rounded-3xl border border-white/5 hover:border-emerald-500/20 transition-all">
                                        <div className="w-12 h-12 shrink-0 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-black text-xl">
                                            {i + 1}
                                        </div>
                                        <div>
                                            <h4 className="text-white font-black text-xl mb-2">{tip.title}</h4>
                                            <p className="text-slate-400 text-sm leading-relaxed mb-0">{tip.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <h2 className="text-3xl md:text-5xl font-black mt-32 mb-12 text-white flex items-center gap-4">
                                <HelpCircle className="h-10 w-10 text-emerald-500" />
                                FAQs — Online Teaching Jobs in India
                            </h2>
                            <div className="mb-32">
                                <Accordion type="single" collapsible className="space-y-4">
                                    {[
                                        {
                                            q: "Do I need a teaching degree (B.Ed) for online jobs?",
                                            a: "For K-12 schooling, it helps. But for skill-based platforms like Celoris—where you teach Dance, Digital Marketing, or Guitar—your expertise and portfolio matter significantly more than a piece of paper."
                                        },
                                        {
                                            q: "How do I get my first student?",
                                            a: "Start with your existing network. Share your Celoris profile on WhatsApp, Instagram, and LinkedIn. Offer a massive discount for the first 5 students in exchange for a detailed review. Reviews attract more students."
                                        },
                                        {
                                            q: "Is online teaching a stable career?",
                                            a: "Yes. Top trainers on our platform have students who have been with them for over 18 months. By building a community and offering diverse products (live + recorded), you create multiple streams of income."
                                        },
                                        {
                                            q: "Which subjects pay the most?",
                                            a: "Highly technical or job-linked skills like AI, Data Science, and Python pay the most per hour. However, niche lifestyle skills like Wedding Choreography or Personal Fitness Coaching also command high rates."
                                        },
                                        {
                                            q: "Can I teach part-time with a job?",
                                            a: "Absolutely. Over 40% of trainers on Celoris start part-time—teaching between 7 PM and 10 PM. As their income grows, many eventually switch to teaching full-time."
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

                            <div className="bg-gradient-to-br from-emerald-500 to-cyan-600 p-1 rounded-[3rem] my-32">
                                <div className="bg-[#050810] p-10 md:p-16 rounded-[2.8rem] text-center">
                                    <h2 className="text-3xl md:text-5xl font-black text-white mb-8">Start Your Journey Today</h2>
                                    <p className="text-slate-400 mb-12 text-xl max-w-2xl mx-auto">India's learning economy is growing. Don't just watch from the sidelines—become an educator and share your gift with the world.</p>
                                    <div className="flex flex-col md:flex-row gap-6 justify-center">
                                        <Button size="lg" className="bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-[0.2em] rounded-full px-16 py-8 text-xl shadow-[0_20px_40px_rgba(16,185,129,0.3)] hover:scale-105 transition-all" asChild>
                                            <Link href="/become-trainer">Join as Trainer</Link>
                                        </Button>
                                        <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/10 text-white font-black uppercase tracking-[0.2em] rounded-full px-16 py-8 text-xl" asChild>
                                            <Link href="/courses">Explore Courses</Link>
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <h2 className="text-3xl md:text-5xl font-black mt-32 mb-12 text-white flex items-center gap-4">
                                <Target className="h-10 w-10 text-emerald-500" />
                                Future-Proofing Your Teaching Career
                            </h2>
                            <p>
                                The world of education is evolving at breakneck speed. To stay relevant as a trainer in 2026 and beyond, you must embrace the concept of being a 'Creator-Educator'. Here’s how:
                            </p>
                            <div className="space-y-8 my-10">
                                <div className="p-8 bg-emerald-500/5 rounded-3xl border border-emerald-500/10">
                                    <h4 className="text-white font-black mb-2">Build a Multi-Channel Presence</h4>
                                    <p className="text-sm text-slate-400">
                                        Don't just rely on one platform. Use Instagram for short-form tips (Edutainment), LinkedIn for professional authority, and Celoris for your deep-dive courses and student management.
                                    </p>
                                </div>
                                <div className="p-8 bg-cyan-500/5 rounded-3xl border border-cyan-500/10">
                                    <h4 className="text-white font-black mb-2">Engage with AI, Don't Fear It</h4>
                                    <p className="text-sm text-slate-400">
                                        Use AI tools to help you create better lesson plans, generate quiz questions, or even edit your course videos faster. A trainer who uses AI will always outperform a trainer who avoids it.
                                    </p>
                                </div>
                                <div className="p-8 bg-purple-500/5 rounded-3xl border border-purple-500/10">
                                    <h4 className="text-white font-black mb-2">Focus on Communities, Not Just Classes</h4>
                                    <p className="text-sm text-slate-400">
                                        The best teachers in 2026 are community leaders. Create a space (like a WhatsApp group or a Discord server) where your students can interact with each other. Community-led learning has a 4x higher retention rate.
                                    </p>
                                </div>
                            </div>

                            <h2 className="text-3xl md:text-5xl font-black mt-32 mb-12 text-white flex items-center gap-4">
                                <Rocket className="h-10 w-10 text-emerald-500" />
                                Join the Indian Creator Economy
                            </h2>
                            <p>
                                India’s creator economy is no longer just about comedy sketches or travel vlogs. Education is the new 'High Margin' niche. While entertainers struggle with low ad-rates, educators enjoy high-intent audience willingness to pay for transformation.
                            </p>
                            <p>
                                By teaching online, you are not just getting a 'job'—you are building a scalable digital asset. Every course you record, every review you earn, and every student you transform adds to your digital net worth.
                            </p>

                            <div className="mt-32 pt-16 border-t border-white/10">
                                <h2 className="text-3xl md:text-5xl font-black mb-10 text-white tracking-tight">Final Thoughts</h2>
                                <p className="text-lg leading-relaxed mb-8">
                                    The "Online Teaching" buzz isn't just a trend—it's the <strong>New Normal</strong>. Whether you are an experienced trainer looking to expand digitally, or a skilled professional ready to monetise your expertise, Celoris gives you the tools, the audience, and the platform to make it happen.
                                </p>
                                <p className="text-xl leading-relaxed text-emerald-400 font-black italic">
                                    Ready to start earning from your skills? Join Celoris today at celoris.in and connect with thousands of students actively looking for someone just like you.
                                </p>
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="mt-12 pt-12 border-t border-white/10 flex flex-wrap gap-3">
                            <Tag className="h-4 w-4 text-emerald-500 mt-1" />
                            {['Online Teaching Jobs', 'Earn From Home India', 'Celoris Jobs', 'Teacher Recruitment 2026', 'Work From Home India', 'Skill Based Learning', 'Dance Teacher Jobs', 'Digital Marketing Trainer'].map((tag) => (
                                <span key={tag} className="bg-white/5 text-slate-400 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-emerald-500/20 hover:text-emerald-400 transition-all cursor-default border border-white/5 hover:border-emerald-500/30">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <footer className="container py-12 px-4 mx-auto border-t border-white/5 text-center mt-20">
                <p className="text-[10px] font-black tracking-[0.4em] text-slate-600 uppercase mb-4">
                    Published by Celoris | celoris.in | India's Online Skill Learning Platform
                </p>
                <p className="text-[10px] font-black tracking-[0.4em] text-slate-600 uppercase">
                    © {new Date().getFullYear()} Celoris.in • All Rights Reserved
                </p>
            </footer>
        </div>
    );
}
