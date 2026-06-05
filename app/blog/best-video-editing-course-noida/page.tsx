import Link from 'next/link';
import { Button } from "@/components/ui/button";
import {
    ArrowLeft, Calendar, Clock, Tag, Check, X,
    Smartphone, Laptop, Play, Info, HelpCircle,
    ArrowRight, Star, Shield, Zap, IndianRupee,
    Search, Layout, Share2, Users, Wand2, Phone, TrendingUp,
    Video, Film, Scissors, MonitorPlay, Clapperboard
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Best Video Editing Course in Noida (2026) — Complete Guide | Celoris',
    description: 'Looking for the best video editing course in Noida? This guide covers software, fees, career paths, and how to choose the right trainer. Free demo available.',
    keywords: 'video editing course noida, video editing classes noida, premiere pro course noida, after effects course noida, video editor course noida fees',
};

export default function VideoEditingBlogNoida() {
    return (
        <div className="min-h-screen bg-[#050810] text-slate-300 selection:bg-purple-500/30">
            {/* Hero Section */}
            <div className="relative h-[600px] w-full overflow-hidden">
                {/* Background Image */}
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-110"
                    style={{
                        backgroundImage: 'url("/vid_edit_noida.png")',
                    }}
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/60 bg-gradient-to-t from-[#050810] via-[#050810]/60 to-transparent" />

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
                            <span className="bg-purple-500/20 text-purple-400 px-5 py-2 rounded-full text-xs font-black tracking-[0.2em] uppercase border border-purple-500/30 backdrop-blur-md">
                                Video Editing • Noida • Creative Career
                            </span>
                            <span className="text-slate-200 text-xs font-bold flex items-center gap-2 bg-black/40 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
                                <Clock className="h-4 w-4 text-purple-500" /> 8 MIN READ
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-7xl font-black mb-8 leading-[1.1] tracking-tighter text-white drop-shadow-2xl text-balance">
                            Best Video Editing Course in Noida (2026) — <span className="text-purple-400 italic block mt-2 text-balance">Complete Guide</span>
                        </h1>
                        <div className="flex flex-wrap items-center gap-8 text-slate-400">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-400 to-pink-600 flex items-center justify-center text-white font-black text-xl border-2 border-white/20 shadow-2xl">
                                    C
                                </div>
                                <div>
                                    <p className="font-black text-white tracking-tight text-lg leading-none mb-1">Celoris Team</p>
                                    <p className="text-[10px] uppercase font-black tracking-[0.2em] text-purple-500">Official Creator</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 font-bold bg-white/5 px-4 py-2 rounded-full border border-white/5">
                                <Calendar className="h-4 w-4 text-purple-500" />
                                <span className="text-sm uppercase tracking-widest text-slate-200">May 2026</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="container py-20 px-4 relative mx-auto">
                {/* Decorative background elements */}
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[150px] -z-10" />
                <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-pink-500/5 rounded-full blur-[150px] -z-10" />

                <div className="max-w-4xl mx-auto">
                    <div className="bg-[#0a0f1d] rounded-[3rem] p-8 md:p-16 shadow-2xl border border-white/5 relative overflow-hidden">
                        <div className="prose prose-invert max-w-none 
                            prose-headings:text-white prose-headings:font-black prose-headings:tracking-tight
                            prose-p:text-slate-300 prose-p:leading-relaxed prose-p:text-lg prose-p:mb-8
                            prose-strong:text-purple-400 prose-strong:font-bold
                            prose-a:text-purple-400 prose-a:no-underline hover:prose-a:underline
                        ">
                            <p className="text-xl leading-relaxed mb-10">
                                Video is eating the internet. YouTube has over 500 hours of video uploaded every minute. Instagram Reels drive more engagement than any other content format. LinkedIn video gets 3x more reach than text posts. Every brand, creator, and business in Noida now needs video — and the gap between the demand for skilled video editors and the supply of trained professionals is wide open.
                            </p>
                            <p>
                                But video editing training in Noida has a quality problem. Most courses teach you to follow tutorials step by step without building the underlying skills that let you solve new problems independently. This guide tells you what genuinely good video editing training looks like — and how to find it in Noida.
                            </p>

                            <div className="my-16 bg-purple-500/10 border-l-8 border-purple-500 p-8 md:p-12 rounded-r-3xl shadow-lg relative overflow-hidden group">
                                <div className="relative z-10">
                                    <h3 className="text-purple-400 text-xl font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <Info className="h-6 w-6" /> Quick Answer
                                    </h3>
                                    <p className="text-xl md:text-2xl text-slate-100 font-bold leading-relaxed mb-6 text-balance">
                                        For project-based video editing training in Noida covering Premiere Pro, After Effects, and CapCut — visit <Link href="/video-editing-course-noida">celorisdesigns.com/video-editing-course-noida</Link>.
                                    </p>
                                    <Button className="bg-purple-500 hover:bg-purple-400 text-black font-black uppercase tracking-widest rounded-full px-8 py-6" asChild>
                                        <Link href="/video-editing-course-noida">View Course Details</Link>
                                    </Button>
                                    <p className="mt-4 text-sm text-slate-400">Courses start at ₹2,500.</p>
                                </div>
                                <Zap className="absolute top-1/2 right-10 -translate-y-1/2 h-40 w-40 text-purple-500/10 -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
                            </div>

                            <section className="mt-20">
                                <h2 className="text-3xl md:text-5xl font-black mb-8 text-white">Why Video Editing is One of the Best Creative Skills to Learn in Noida in 2026</h2>
                                <p>
                                    Noida sits at the intersection of three trends that are making video editing skills more valuable than ever:
                                </p>
                                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 my-10">
                                    <h4 className="text-white font-black uppercase tracking-widest text-sm mb-6 flex items-center gap-2">
                                        <TrendingUp className="h-4 w-4 text-purple-500" /> Market Scope in Noida
                                    </h4>
                                    <ul className="space-y-4 list-none p-0 m-0">
                                        {[
                                            "The YouTube creator economy in Delhi NCR is booming — hundreds of creators based in Noida and Greater Noida are monetizing channels and need consistent high-quality editing",
                                            "D2C brands and e-commerce companies in Noida's Expressway corridor need product videos, brand ads, and social content at scale",
                                            "Corporate marketing teams at HCL, Adobe, Wipro, and hundreds of mid-size companies in Sector 62–63 need video editors for internal communications, webinars, and brand content",
                                            "Instagram Reels and YouTube Shorts have created a massive demand for fast-turnaround short-form video editing",
                                            "AI tools have made some aspects of video production faster — but skilled editors who understand narrative, pacing, and colour are more valuable than ever"
                                        ].map((item, i) => (
                                            <li key={i} className="flex gap-4 items-start">
                                                <Check className="h-5 w-5 text-purple-500 shrink-0 mt-1" />
                                                <span className="text-slate-300 font-medium">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <p>
                                    The freelance market is particularly strong. A video editor in Noida who can handle Premiere Pro, colour grading, and basic After Effects can charge ₹5,000–20,000 per project and build a solid client base from local businesses alone.
                                </p>
                            </section>

                            <section className="mt-24">
                                <h2 className="text-3xl md:text-5xl font-black mb-10 text-white flex items-center gap-4 text-balance">
                                    <Video className="h-10 w-10 text-purple-500 shrink-0" />
                                    Video Editing Software Guide — Which Tool Should You Learn?
                                </h2>
                                <div className="overflow-x-auto rounded-[2rem] border border-white/10 bg-white/5 mb-8">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-white/10">
                                                <th className="p-6 text-purple-400 font-black uppercase tracking-widest text-xs">Software</th>
                                                <th className="p-6 text-purple-400 font-black uppercase tracking-widest text-xs">Best For</th>
                                                <th className="p-6 text-purple-400 font-black uppercase tracking-widest text-xs">Cost</th>
                                                <th className="p-6 text-purple-400 font-black uppercase tracking-widest text-xs">Learning Curve</th>
                                                <th className="p-6 text-purple-400 font-black uppercase tracking-widest text-xs">Job Demand</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm">
                                            {[
                                                { sw: "Adobe Premiere Pro", desc: "Professional editing — YouTube, brand videos, films", cost: "₹1,675+/month (CC)", curve: "Medium", demand: "Very High" },
                                                { sw: "After Effects", desc: "Motion graphics, VFX, animated titles, compositing", cost: "Included in CC", curve: "Steep", demand: "Very High" },
                                                { sw: "DaVinci Resolve", desc: "Colour grading, professional film editing", cost: "Free version available", curve: "Medium-Steep", demand: "High" },
                                                { sw: "CapCut", desc: "Instagram Reels, YouTube Shorts, quick social content", cost: "Free", curve: "Easy", demand: "Medium" },
                                                { sw: "Final Cut Pro", desc: "Mac-only professional editing", cost: "₹25,000 one-time", curve: "Medium", demand: "Low (India)" },
                                                { sw: "InVideo", desc: "Online video creation, templates, AI video", cost: "Free/Paid", curve: "Easy", demand: "Low" }
                                            ].map((row, i) => (
                                                <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                    <td className="p-6 font-bold text-white whitespace-nowrap">{row.sw}</td>
                                                    <td className="p-6 text-slate-400">{row.desc}</td>
                                                    <td className="p-6 text-slate-400">{row.cost}</td>
                                                    <td className="p-6 text-slate-400">{row.curve}</td>
                                                    <td className="p-6 text-purple-400 font-bold">{row.demand}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <p className="text-lg leading-relaxed text-slate-300">
                                    For most students in Noida targeting jobs or freelance work: learn Premiere Pro first (industry standard), add After Effects for motion graphics (huge salary boost), and use CapCut for fast social content. DaVinci Resolve is worth learning for colour work and as a free alternative.
                                </p>
                            </section>

                            <section className="mt-24">
                                <h2 className="text-3xl md:text-5xl font-black mb-10 text-white">What a Good Video Editing Course in Noida Must Cover</h2>
                                <div className="space-y-8">
                                    <div>
                                        <h4 className="text-xl font-bold text-white mb-2">1. Timeline editing fundamentals — not just button clicking</h4>
                                        <p className="text-slate-400">The most important skill in video editing is not knowing where the buttons are — it is understanding narrative structure, pacing, and rhythm. A J-cut that makes a conversation flow naturally, a montage that builds energy at the right moment, a pause that lands a comedic beat — these are craft skills that come from understanding storytelling, not just software. Good video editing training in Noida teaches both.</p>
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-white mb-2">2. Audio editing and mixing</h4>
                                        <p className="text-slate-400">Bad audio kills a good video. Most beginners focus entirely on visuals and neglect audio — which is why their videos feel amateurish even when the footage is good. A serious video editing course covers audio levels, noise reduction, music bed placement, and voiceover sync. Premiere Pro's Essential Sound panel and DaVinci Resolve's Fairlight audio should both be in the curriculum.</p>
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-white mb-2">3. Colour correction vs colour grading</h4>
                                        <p className="text-slate-400">These are two different things that most basic courses conflate. Colour correction fixes technical problems — exposure, white balance, consistency across shots. Colour grading creates a deliberate aesthetic look — the cinematic teal-orange, the warm golden hour feel, the cold corporate blue. Professional video editors do both, in that order. A course that only teaches you to drag Lumetri sliders is not teaching colour work.</p>
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-white mb-2">4. Motion graphics in After Effects</h4>
                                        <p className="text-slate-400">After Effects skills are what separate a ₹15,000/month video editor from a ₹50,000/month one. Animated titles, logo reveals, lower thirds, kinetic typography — all of this comes from After Effects. Any video editing course in Noida that does not include at least a module on After Effects basics is leaving you unprepared for the premium end of the market.</p>
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-white mb-2">5. Platform-specific delivery</h4>
                                        <p className="text-slate-400">A YouTube video, an Instagram Reel, a LinkedIn video ad, and a broadcast commercial all have different aspect ratios, duration requirements, caption standards, and export specifications. A course that teaches you to export in one generic format is not preparing you for real client work where every platform has different requirements.</p>
                                    </div>
                                </div>
                            </section>

                            <section className="mt-24">
                                <h2 className="text-3xl md:text-5xl font-black mb-10 text-white flex items-center gap-4 text-balance">
                                    <Users className="h-10 w-10 text-purple-500 shrink-0" />
                                    Video Editing Career Paths in Noida — Roles and Salary
                                </h2>
                                <div className="overflow-x-auto rounded-[2rem] border border-white/10 bg-white/5">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-white/10">
                                                <th className="p-6 text-purple-400 font-black uppercase tracking-widest text-xs">Career Path</th>
                                                <th className="p-6 text-purple-400 font-black uppercase tracking-widest text-xs">Starting Salary</th>
                                                <th className="p-6 text-purple-400 font-black uppercase tracking-widest text-xs">3–5 Year Salary</th>
                                                <th className="p-6 text-purple-400 font-black uppercase tracking-widest text-xs">Growth Path</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm">
                                            {[
                                                { role: "Junior Video Editor", start: "₹2.5L–4L / year", mid: "₹5L–8L / year", path: "Senior Editor → Creative Lead" },
                                                { role: "Motion Graphics Designer", start: "₹3.5L–6L / year", mid: "₹7L–14L / year", path: "Senior MG → Art Director" },
                                                { role: "YouTube Video Editor", start: "₹2.5L–5L / year", mid: "₹5L–10L / year", path: "Lead Editor → Content Director" },
                                                { role: "Social Media Video Editor", start: "₹2.5L–4.5L / year", mid: "₹5L–8L / year", path: "Content Manager → Creative Director" },
                                                { role: "Corporate Video Editor", start: "₹3L–5.5L / year", mid: "₹6L–10L / year", path: "Senior Editor → Post-Production Head" },
                                                { role: "Freelance Video Editor", start: "₹3L–15L / year", mid: "₹8L–25L / year", path: "Scale clients → Production company" }
                                            ].map((row, i) => (
                                                <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                    <td className="p-6 font-bold text-white">{row.role}</td>
                                                    <td className="p-6 text-purple-400 font-black whitespace-nowrap">{row.start}</td>
                                                    <td className="p-6 text-purple-400 font-black whitespace-nowrap">{row.mid}</td>
                                                    <td className="p-6 text-slate-400">{row.path}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </section>

                            <section className="mt-24">
                                <h2 className="text-3xl md:text-5xl font-black mb-10 text-white flex items-center gap-4 text-balance">
                                    <HelpCircle className="h-10 w-10 text-purple-500 shrink-0" />
                                    Top 10 Interview Questions for Video Editing Jobs in Noida
                                </h2>
                                <p className="text-lg leading-relaxed mb-8">
                                    These are the most commonly asked questions in video editing interviews at Noida's production houses, agencies, and brand teams:
                                </p>
                                <div className="overflow-x-auto rounded-[2rem] border border-white/10 bg-white/5">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-white/10">
                                                <th className="p-6 text-purple-400 font-black uppercase tracking-widest text-xs">Interview Question</th>
                                                <th className="p-6 text-purple-400 font-black uppercase tracking-widest text-xs">What They're Testing</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm">
                                            {[
                                                { q: "Walk me through your editing workflow from raw footage to export", t: "Process + professionalism" },
                                                { q: "How do you maintain colour consistency across multiple clips?", t: "Colour correction knowledge" },
                                                { q: "What is the difference between colour correction and colour grading?", t: "Technical depth" },
                                                { q: "How do you handle a project with poor audio quality?", t: "Problem-solving + audio skills" },
                                                { q: "Which export settings do you use for YouTube vs Instagram?", t: "Platform knowledge" },
                                                { q: "Have you used After Effects? Show an example of your motion work.", t: "After Effects proficiency" },
                                                { q: "How long does it take you to edit a 5-minute YouTube video?", t: "Realistic capacity + workflow" },
                                                { q: "How do you handle client revision requests?", t: "Client management + professionalism" },
                                                { q: "What AI tools are you using in your editing workflow?", t: "2026 awareness" },
                                                { q: "Show me your portfolio — walk me through one project", t: "Portfolio depth + communication" }
                                            ].map((row, i) => (
                                                <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                    <td className="p-6 font-bold text-white normal-case leading-relaxed">{row.q}</td>
                                                    <td className="p-6 text-slate-400 leading-relaxed">{row.t}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <p className="mt-6 text-sm text-purple-500 font-black uppercase italic tracking-widest pl-4 border-l-2 border-purple-500">At Celoris, we prepare students specifically for these questions using real projects completed during the course as portfolio examples.</p>
                            </section>

                            <section className="mt-32">
                                <h2 className="text-3xl md:text-5xl font-black mb-12 text-white flex items-center gap-4">
                                    <HelpCircle className="h-10 w-10 text-purple-500" /> Frequently Asked Questions
                                </h2>
                                <Accordion type="single" collapsible className="w-full space-y-4">
                                    <AccordionItem value="item-1" className="bg-white/5 border border-white/10 rounded-2xl px-6">
                                        <AccordionTrigger className="text-white font-bold hover:no-underline py-6">Which video editing software is best for beginners in Noida?</AccordionTrigger>
                                        <AccordionContent className="text-slate-400 pb-6">
                                            Start with CapCut if you primarily create Instagram Reels and Shorts — it is mobile-friendly and has a gentle learning curve. Move to Adobe Premiere Pro once you want professional-level control for YouTube videos and client work. Our Basic plan covers both.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-2" className="bg-white/5 border border-white/10 rounded-2xl px-6">
                                        <AccordionTrigger className="text-white font-bold hover:no-underline py-6">How long does it take to learn video editing professionally?</AccordionTrigger>
                                        <AccordionContent className="text-slate-400 pb-6">
                                            Basic cuts and social media editing can be learned in 3–4 weeks. Professional-level Premiere Pro including colour grading takes 6–8 weeks. Adding After Effects for motion graphics requires an additional 4–6 weeks. Most students are ready for entry-level editing roles or first freelance clients within 8–10 weeks of starting.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-3" className="bg-white/5 border border-white/10 rounded-2xl px-6">
                                        <AccordionTrigger className="text-white font-bold hover:no-underline py-6">Do I need a powerful laptop for video editing?</AccordionTrigger>
                                        <AccordionContent className="text-slate-400 pb-6">
                                            For Premiere Pro: minimum 16GB RAM, 256GB SSD, dedicated GPU (NVIDIA GTX 1650 or better). DaVinci Resolve free version runs on more modest hardware. CapCut works on any modern laptop. Your trainer will assess your setup during the demo session. If your laptop is underpowered, we can suggest affordable upgrade options.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-4" className="bg-white/5 border border-white/10 rounded-2xl px-6">
                                        <AccordionTrigger className="text-white font-bold hover:no-underline py-6">Is freelance video editing viable in Noida?</AccordionTrigger>
                                        <AccordionContent className="text-slate-400 pb-6">
                                            Yes — Noida's YouTube creator community, D2C brands, and local businesses create strong demand for freelance editors. Rates range from ₹1,500–3,000 for a basic Reel edit to ₹10,000–25,000 for a full brand video. Students who complete our Mastery plan typically get their first paid client within 2–4 weeks.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-5" className="bg-white/5 border border-white/10 rounded-2xl px-6">
                                        <AccordionTrigger className="text-white font-bold hover:no-underline py-6">Can the trainer come to my home in Noida?</AccordionTrigger>
                                        <AccordionContent className="text-slate-400 pb-6">
                                            Yes. Celoris trainers offer home-visit sessions across all Noida sectors, Greater Noida, and nearby Ghaziabad. Online sessions are also available via Zoom or Google Meet.
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </section>

                            <section className="mt-32 pt-16 border-t border-white/10">
                                <h2 className="text-3xl md:text-5xl font-black mb-10 text-white tracking-tight">Final Thoughts — Which Video Editing Course Should You Join in Noida?</h2>
                                <p className="text-lg leading-relaxed mb-10">
                                    The video editing training market in Noida is full of courses that teach you to reproduce what the trainer does — and leave you unable to edit anything new on your own. That is not skill building; it is tutorial following.
                                </p>
                                <p className="text-lg leading-relaxed mb-10">
                                    Real video editing skill means understanding why a cut works, how to fix bad audio without reshooting, how to grade footage that was shot in different conditions to look consistent, and how to deliver to a client on time with the right export settings for every platform. These are not things you learn from watching tutorials. They come from editing real projects with feedback from someone who has done this professionally.
                                </p>
                                <p className="text-lg leading-relaxed mb-10">
                                    Celoris video editing training in Noida is built around real projects, professional tools, and a trainer who has edited real content for real clients — starting at ₹2,500 with a free demo, home visit options, and lifetime WhatsApp support.
                                </p>
                                <div className="bg-purple-500/10 border border-purple-500/20 p-10 md:p-16 rounded-[3rem] my-16 text-center">
                                    <h3 className="text-2xl md:text-4xl font-black text-white mb-6">Book Your FREE Demo Today</h3>
                                    <p className="text-slate-400 mb-10 text-lg">Talk to an expert trainer who has handled real client accounts. No commitment required.</p>
                                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                                        <Button size="lg" className="bg-purple-500 hover:bg-purple-400 text-black font-black uppercase tracking-[0.2em] rounded-full px-16 py-8 text-xl shadow-[0_20px_40px_rgba(168,85,247,0.3)] hover:scale-105 transition-all w-full sm:w-auto" asChild>
                                            <Link href="https://wa.me/919084718101" target="_blank">
                                                <Phone className="h-6 w-6 mr-3" /> WhatsApp Demo
                                            </Link>
                                        </Button>
                                        <Button size="lg" variant="outline" className="border-white/10 hover:bg-white/5 text-white font-black uppercase tracking-[0.2em] rounded-full px-16 py-8 text-xl w-full sm:w-auto" asChild>
                                            <Link href="/video-editing-course-noida">Course Details</Link>
                                        </Button>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Internal Links & Tags */}
                        <div className="mt-20 pt-12 border-t border-white/10">
                            <h4 className="text-white font-black uppercase tracking-widest text-xs mb-8 flex items-center gap-2">
                                <Share2 className="h-4 w-4 text-purple-500" /> Related Articles
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                                {[
                                    { t: "Best Social Media Marketing Course in Noida", l: "/blog/best-social-media-marketing-course-noida" },
                                    { t: "Best Graphic Designing Course in Noida", l: "/blog/best-graphic-designing-course-noida" },
                                    { t: "Adobe Premiere Pro Course Noida", l: "/blog/adobe-premiere-course-noida" },
                                    { t: "Video Editing Course Noida Landing Page", l: "/video-editing-course-noida" },
                                    { t: "All Trainers in Noida", l: "/learn?location=noida" }
                                ].map((link, i) => (
                                    <Link key={i} href={link.l} className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:border-purple-500/30 hover:bg-purple-500/5 transition-all group flex items-center justify-between">
                                        <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">{link.t}</span>
                                        <ArrowRight className="h-4 w-4 text-purple-500 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                ))}
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <Tag className="h-4 w-4 text-purple-500 mt-1" />
                                {['video editing course noida', 'video editing classes noida', 'premiere pro course noida', 'after effects course noida', 'video editor course noida fees'].map((tag) => (
                                    <span key={tag} className="bg-white/5 text-slate-400 px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest hover:bg-purple-500/20 hover:text-purple-400 transition-all cursor-default border border-white/5 hover:border-purple-500/30">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sticky CTA */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-bounce sm:hidden">
                <Button className="bg-purple-500 hover:bg-purple-400 text-black font-black uppercase tracking-widest px-8 py-6 rounded-full shadow-2xl shadow-purple-500/40 border-4 border-black/20" asChild>
                    <Link href="https://wa.me/919084718101" target="_blank">Book Demo</Link>
                </Button>
            </div>

            <footer className="container py-12 px-4 mx-auto border-t border-white/5 text-center mt-20">
                <p className="text-[10px] font-black tracking-[0.4em] text-slate-600 uppercase mb-4">
                    Celoris Designs LLP | Noida's Leading Creative Skills Platform
                </p>
                <p className="text-[10px] font-black tracking-[0.4em] text-slate-600 uppercase">
                    © {new Date().getFullYear()} Celoris.in • All Rights Reserved
                </p>
            </footer>
        </div>
    );
}
