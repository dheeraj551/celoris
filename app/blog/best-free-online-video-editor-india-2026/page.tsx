'use client';

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import {
    ArrowLeft, Calendar, Clock, Tag, Check, X,
    Smartphone, Laptop, Play, Info, HelpCircle,
    ArrowRight, Star, Shield, Zap, IndianRupee, Video
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function BlogPost() {
    return (
        <div className="min-h-screen bg-[#050810] text-slate-300 selection:bg-emerald-500/30">
            {/* Hero Section */}
            <div className="relative h-[600px] w-full overflow-hidden">
                {/* Background Image */}
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-110"
                    style={{
                        backgroundImage: 'url("/blog-video-editor-india-2026.png")'
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
                                Technology
                            </span>
                            <span className="text-slate-200 text-xs font-bold flex items-center gap-2 bg-black/40 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
                                <Clock className="h-4 w-4 text-emerald-500" /> 8 MIN READ
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-7xl font-black mb-8 leading-[1] tracking-tighter text-white drop-shadow-2xl">
                            Best Free Online Video Editor India 2026 — <span className="text-emerald-400">No Watermark, No Download</span>
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
                                <span className="text-sm uppercase tracking-widest text-slate-200">March 2, 2026</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="container py-20 px-4 relative">
                {/* Decorative background elements */}
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
                                    "If you are a student, content creator, small business owner or freelancer in India looking for a genuinely free online video editor in 2026 — this guide will save you hours of frustration."
                                </p>
                            </div>

                            <p>
                                The honest truth is that most "free" video editors online are not actually free. They add watermarks to your finished video. They let you edit for 2 minutes then ask you to upgrade. They give you 480p export on the free plan while keeping 1080p behind a paywall. They start free then charge you after 7 days.
                            </p>
                            <p>
                                This guide covers the best genuinely free online video editors available in India in 2026 — what they actually offer for free, where they secretly charge you, and which one Indian creators are using the most right now.
                            </p>

                            <h2 className="text-3xl md:text-5xl font-black mt-24 mb-10 text-white flex items-center gap-4">
                                <IndianRupee className="h-10 w-10 text-emerald-500" />
                                Why Indian Creators Need a Different Kind of Free Video Editor
                            </h2>
                            <p>
                                The global "free" video editor market is designed around Western pricing. A tool that costs $15 per month feels affordable in the US. For a college student in Delhi, a freelancer in Lucknow or a small business owner in Coimbatore — $15 per month is ₹1,200 to ₹1,500 per month. That is genuinely expensive for a video editing tool when your entire monthly budget for digital tools might be ₹500.
                            </p>
                            <p>
                                This is exactly why Indian creators have been underserved by international video editing platforms. Adobe Premiere Pro costs ₹1,675 per month. CapCut recently started restricting features. DaVinci Resolve requires a powerful computer to run. iMovie works only on Apple devices. Canva Video pushes you toward Pro at every step.
                            </p>
                            <div className="bg-gradient-to-br from-[#121a2e] to-[#0a0f1d] p-8 rounded-[2rem] border border-white/10 my-12 shadow-inner">
                                <p className="text-white font-black uppercase tracking-widest text-sm mb-6 flex items-center gap-2">
                                    <Star className="h-4 w-4 text-yellow-500" /> What Indian creators in 2026 need:
                                </p>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none p-0">
                                    {[
                                        "Free without hidden conditions",
                                        "Works entirely in the browser",
                                        "Runs smoothly on basic internet",
                                        "Exports without watermarks",
                                        "No credit card required",
                                        "Supports Indian languages",
                                        "Vertical formats (Reels/Shorts)",
                                        "Indian music and audio support"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-slate-300 font-bold text-sm bg-white/5 p-4 rounded-xl border border-white/5">
                                            <Check className="h-5 w-5 text-emerald-500 shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <h2 className="text-3xl md:text-5xl font-black mt-24 mb-12 text-white">
                                Best Free Online Video Editors in India <span className="text-emerald-500">2026</span>
                            </h2>

                            <div className="space-y-20">
                                <section className="relative p-1 rounded-[2.5rem] bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-white/10">
                                    <div className="bg-[#0d1426] rounded-[2.4rem] p-8 md:p-12">
                                        <h3 className="text-2xl md:text-4xl font-black mb-8 text-white flex flex-wrap items-center gap-4">
                                            <span className="w-12 h-12 rounded-2xl bg-emerald-500 text-black flex items-center justify-center font-black text-2xl shadow-lg shadow-emerald-500/20">1</span>
                                            Celoris Free Video Editor — Best for Indian Creators
                                        </h3>
                                        <p className="text-lg leading-relaxed mb-8">
                                            Celoris (celoris.in) is India's own free creative studio built specifically for Indian students, creators and small businesses. The Celoris video editor runs entirely in the browser — no download, no installation, no subscription required.
                                        </p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                                            <div className="space-y-4">
                                                <h4 className="font-black text-emerald-400 uppercase tracking-widest text-xs flex items-center gap-2">
                                                    <Zap className="h-3 w-3" /> Genuinely Free
                                                </h4>
                                                <ul className="space-y-3 list-none p-0">
                                                    {[
                                                        "No watermark on exported videos",
                                                        "Full HD 1080p export free",
                                                        "No time limit on sessions",
                                                        "No credit card required"
                                                    ].map((item, i) => (
                                                        <li key={i} className="flex items-center gap-3 text-slate-300 text-sm font-bold">
                                                            <Check className="h-4 w-4 text-emerald-500" /> {item}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div className="space-y-4">
                                                <h4 className="font-black text-cyan-400 uppercase tracking-widest text-xs flex items-center gap-2">
                                                    <Smartphone className="h-3 w-3" /> Feature Packed
                                                </h4>
                                                <ul className="space-y-3 list-none p-0">
                                                    {[
                                                        "AI Background Removal",
                                                        "AI Auto-Captions",
                                                        "9:16 Vertical Support",
                                                        "20+ AI Models Integrated"
                                                    ].map((item, i) => (
                                                        <li key={i} className="flex items-center gap-3 text-slate-300 text-sm font-bold">
                                                            <Check className="h-4 w-4 text-cyan-500" /> {item}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="bg-emerald-500/5 border border-emerald-500/20 p-8 rounded-3xl mb-8">
                                            <p className="text-white font-bold mb-4">Why Indian creators prefer Celoris in 2026:</p>
                                            <p className="text-slate-400 text-sm italic">
                                                Celoris is the only major free video editor built in India under Indian law. Your video data is stored under Indian data protection standards — not US or Chinese regulations. The platform understands Indian content needs including support for Hindi text overlays, Indian music formats and social media sizes popular in India.
                                            </p>
                                        </div>
                                        <div className="flex flex-wrap items-center justify-between gap-6">
                                            <p className="text-emerald-400 font-black text-sm uppercase tracking-widest">Price: Free to start</p>
                                            <Button size="lg" className="bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-widest px-10 rounded-2xl shadow-xl shadow-emerald-500/20 group" asChild>
                                                <Link href="https://celoris.in">
                                                    Start Editing
                                                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>
                                </section>

                                <section className="border-l-4 border-slate-700 pl-8 md:pl-12">
                                    <h3 className="text-2xl md:text-3xl font-black mb-6 text-white flex items-center gap-4">
                                        <span className="w-10 h-10 rounded-xl bg-slate-800 text-slate-400 flex items-center justify-center font-black text-xl border border-white/5">2</span>
                                        CapCut Online — Popular but Changing Fast
                                    </h3>
                                    <p>
                                        CapCut is one of the most downloaded video editing apps in India and its online version works in the browser. It has excellent templates and AI features and remains popular among Reels creators in 2026.
                                    </p>
                                    <div className="bg-amber-500/5 border border-amber-500/20 p-6 rounded-2xl my-6">
                                        <p className="text-amber-400 font-black text-xs uppercase tracking-widest flex items-center gap-2 mb-2">
                                            <Info className="h-4 w-4" /> The Catch in 2026
                                        </p>
                                        <p className="text-sm text-slate-400">
                                            Several features that were free in 2024 and 2025 have now moved behind a Pro paywall. Export quality restrictions continue increasing on the free tier. Data privacy concerns for Indian users remain significant due to ByteDance ownership.
                                        </p>
                                    </div>
                                </section>

                                <section className="border-l-4 border-slate-700 pl-8 md:pl-12">
                                    <h3 className="text-2xl md:text-3xl font-black mb-6 text-white flex items-center gap-4">
                                        <span className="w-10 h-10 rounded-xl bg-slate-800 text-slate-400 flex items-center justify-center font-black text-xl border border-white/5">3</span>
                                        Clipchamp — Microsoft's Browser Editor
                                    </h3>
                                    <p>
                                        Clipchamp is built into Windows 11 and has a browser version. It is Microsoft's answer to simple video editing and works well for basic cuts, text and transitions.
                                    </p>
                                    <div className="bg-amber-500/5 border border-amber-500/20 p-6 rounded-2xl my-6">
                                        <p className="text-amber-400 font-black text-xs uppercase tracking-widest flex items-center gap-2 mb-2">
                                            <Info className="h-4 w-4" /> The Catch in 2026
                                        </p>
                                        <p className="text-sm text-slate-400">
                                            The stock footage, music and premium templates require a paid Microsoft 365 subscription. The interface feels corporate and is not optimised for social media content.
                                        </p>
                                    </div>
                                </section>

                                <section className="border-l-4 border-slate-700 pl-8 md:pl-12">
                                    <h3 className="text-2xl md:text-3xl font-black mb-6 text-white flex items-center gap-4">
                                        <span className="w-10 h-10 rounded-xl bg-slate-800 text-slate-400 flex items-center justify-center font-black text-xl border border-white/5">4</span>
                                        Canva Video Editor — Good but Pushes Pro
                                    </h3>
                                    <p>
                                        Canva is widely used in India for graphic design and their video editor is integrated directly into the platform. If you already use Canva for social media graphics this is a natural extension.
                                    </p>
                                    <div className="bg-amber-500/5 border border-amber-500/20 p-6 rounded-2xl my-6">
                                        <p className="text-amber-400 font-black text-xs uppercase tracking-widest flex items-center gap-2 mb-2">
                                            <Info className="h-4 w-4" /> The Catch in 2026
                                        </p>
                                        <p className="text-sm text-slate-400">
                                            Canva aggressively pushes Pro at every step. Most templates, background remover, and premium fonts require Canva Pro at ₹3,999 per year.
                                        </p>
                                    </div>
                                </section>

                                <section className="border-l-4 border-slate-700 pl-8 md:pl-12">
                                    <h3 className="text-2xl md:text-3xl font-black mb-6 text-white flex items-center gap-4">
                                        <span className="w-10 h-10 rounded-xl bg-slate-800 text-slate-400 flex items-center justify-center font-black text-xl border border-white/5">5</span>
                                        Kdenlive — Professional but Requires Download
                                    </h3>
                                    <p>
                                        Kdenlive is a free open-source professional video editor. It is genuinely powerful with features that rival Adobe Premiere Pro at zero cost.
                                    </p>
                                    <div className="bg-amber-500/5 border border-amber-500/20 p-6 rounded-2xl my-6">
                                        <p className="text-amber-400 font-black text-xs uppercase tracking-widest flex items-center gap-2 mb-2">
                                            <Info className="h-4 w-4" /> The Catch in 2026
                                        </p>
                                        <p className="text-sm text-slate-400">
                                            It is NOT browser based — you must download and install it. It requires a reasonably powerful computer to run smoothly (min 8GB RAM). The learning curve is steep.
                                        </p>
                                    </div>
                                </section>
                            </div>

                            {/* Comparison Table */}
                            <div className="mt-32 mb-32 bg-gradient-to-br from-[#12182b] to-[#0a0f1d] rounded-[3rem] border border-white/10 p-8 md:p-12 overflow-hidden shadow-inner">
                                <h3 className="text-3xl font-black text-white mb-12 tracking-tight flex items-center gap-4">
                                    <Zap className="h-8 w-8 text-yellow-500" />
                                    Honest Comparison Table — 2026
                                </h3>
                                <div className="overflow-x-auto -mx-8 px-8">
                                    <table className="w-full text-left border-collapse min-w-[800px]">
                                        <thead>
                                            <tr className="border-b border-white/10 text-slate-500 text-[10px] uppercase font-black tracking-[0.2em]">
                                                <th className="py-6 pr-4">Feature</th>
                                                <th className="py-6 px-4 text-emerald-400">Celoris</th>
                                                <th className="py-6 px-4">CapCut</th>
                                                <th className="py-6 px-4">Clipchamp</th>
                                                <th className="py-6 px-4">Canva</th>
                                                <th className="py-6 pl-4">Kdenlive</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-slate-300 font-bold text-sm">
                                            {[
                                                { label: "Truly free", values: ["Yes", "Partial", "Partial", "Partial", "Yes"] },
                                                { label: "No watermark", values: ["Yes", "Yes", "Yes", "Yes", "Yes"] },
                                                { label: "Browser based", values: ["Yes", "Yes", "Yes", "Yes", "No"] },
                                                { label: "No download", values: ["Yes", "Yes", "Yes", "Yes", "No"] },
                                                { label: "1080p free", values: ["Yes", "Limited", "Yes", "Limited", "Yes"] },
                                                { label: "AI tools", values: ["20+ models", "Some", "No", "Some", "No"] },
                                                { label: "Indian data", values: ["Yes", "No", "No", "No", "Open Source"] },
                                                { label: "Basic laptop", values: ["Yes", "Yes", "Yes", "Yes", "No"] }
                                            ].map((row, i) => (
                                                <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                                                    <td className="py-6 pr-4 text-slate-400 group-hover:text-white transition-colors">{row.label}</td>
                                                    {row.values.map((v, idx) => (
                                                        <td key={idx} className={`py-6 px-4 ${idx === 0 ? "text-emerald-400 font-black" : v === "No" ? "text-red-500/50" : "text-slate-300"}`}>
                                                            {v === "Yes" ? <Check className="h-4 w-4" /> : v === "No" ? <X className="h-4 w-4" /> : v}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <h2 className="text-3xl md:text-5xl font-black mt-32 mb-12 text-white">
                                Who Should Use <span className="text-emerald-500">Celoris</span> in 2026?
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-32">
                                {[
                                    {
                                        title: "Students",
                                        desc: "Creating projects and presentations on any budget laptop without admin permissions or watermarks.",
                                        icon: <Laptop className="h-6 w-6" />
                                    },
                                    {
                                        title: "Social Creators",
                                        desc: "Vertical 9:16 editor with AI auto-captions and script generation for Reels and Shorts.",
                                        icon: <Smartphone className="h-6 w-6" />
                                    },
                                    {
                                        title: "Small Businesses",
                                        desc: "Product videos and promotional content with zero software cost and professional results.",
                                        icon: <Zap className="h-6 w-6" />
                                    },
                                    {
                                        title: "Freelancers",
                                        desc: "Building portfolios and delivering client work without expensive subscriptions eating margins.",
                                        icon: <Star className="h-6 w-6" />
                                    }
                                ].map((item, i) => (
                                    <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-[2rem] hover:border-emerald-500/30 transition-all hover:scale-[1.02]">
                                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6 border border-emerald-500/30">
                                            {item.icon}
                                        </div>
                                        <h4 className="text-xl font-black text-white mb-4">{item.title}</h4>
                                        <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                                    </div>
                                ))}
                            </div>

                            <h2 className="text-3xl md:text-5xl font-black mt-32 mb-12 text-white">
                                How to Get Started
                            </h2>
                            <div className="space-y-6 mb-32">
                                {[
                                    "Go to celoris.in",
                                    "Click CREATE — editor loads instantly in browser",
                                    "Upload your video, image and audio files",
                                    "Edit with timeline — cut, trim, add text, transitions and AI effects",
                                    "Export in Full HD 1080p — no watermark added"
                                ].map((step, i) => (
                                    <div key={i} className="flex items-center gap-6 bg-[#12182b] p-6 rounded-3xl border border-white/5 shadow-inner">
                                        <span className="text-4xl font-black text-emerald-500/30">0{i + 1}</span>
                                        <p className="text-white font-bold">{step}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-emerald-500/10 border border-emerald-500/20 p-10 md:p-16 rounded-[3rem] my-32 text-center">
                                <h2 className="text-3xl md:text-4xl font-black text-white mb-8">Ready to start editing?</h2>
                                <p className="text-slate-400 mb-12 text-lg">Join India's largest creative community today. No credit card, no download, no watermark.</p>
                                <Button size="lg" className="bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-[0.2em] rounded-full px-16 py-8 text-xl shadow-[0_20px_40px_rgba(16,185,129,0.3)] hover:scale-105 transition-all" asChild>
                                    <Link href="https://celoris.in">Create Now</Link>
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
                                            q: "Is Celoris video editor really free with no watermark in 2026?",
                                            a: "Yes — Celoris is genuinely free with no watermark on exported videos. No credit card required. No hidden subscription after a trial period. This has been the case since Celoris launched in 2019 and remains true in 2026."
                                        },
                                        {
                                            q: "Does the Celoris video editor work on mobile?",
                                            a: "Celoris is optimised for desktop browsers for the best editing experience. Mobile access is available for basic editing but desktop or laptop is recommended for full feature access including AI tools and timeline editing."
                                        },
                                        {
                                            q: "Is my video data safe on an Indian platform?",
                                            a: "Yes — Celoris is an Indian platform registered as Celoris Designs LLP under the Ministry of Corporate Affairs, Government of India. Your data is stored under Indian data protection standards."
                                        },
                                        {
                                            q: "Can I use Celoris-edited videos for commercial projects?",
                                            a: "Yes — videos created on Celoris can be used for commercial purposes including client projects, business marketing, monetised YouTube content and paid advertising campaigns."
                                        },
                                        {
                                            q: "Does Celoris work on a budget Indian laptop?",
                                            a: "Yes — because video processing happens in Celoris cloud servers rather than your local device, the editor works smoothly on budget laptops under ₹35,000."
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
                                <h2 className="text-3xl md:text-5xl font-black mb-10 text-white tracking-tight">Conclusion</h2>
                                <p className="text-lg leading-relaxed mb-6 font-medium text-slate-200">
                                    The best free online video editor in India in 2026 is one that is genuinely free without conditions, works entirely in the browser, exports without watermarks, runs on basic Indian laptops and understands the needs of Indian creators.
                                </p>
                                <p className="text-lg leading-relaxed mb-12">
                                    Celoris was built in India in 2019 specifically for this reason — to give Indian students, creators, freelancers and businesses access to professional creative tools without the pricing designed for Western markets. <span className="text-emerald-400 font-black">Start editing your first video for free today at celoris.in.</span>
                                </p>
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="mt-12 pt-12 border-t border-white/10 flex flex-wrap gap-3">
                            <Tag className="h-4 w-4 text-emerald-500 mt-1" />
                            {['Free Video Editor', 'Online Video Editor', 'Celoris', 'Indian Creators', 'No Watermark', 'Video Editing 2026'].map((tag) => (
                                <span key={tag} className="bg-white/5 text-slate-400 px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest hover:bg-emerald-500/20 hover:text-emerald-400 transition-all cursor-default border border-white/5 hover:border-emerald-500/30">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Sticky CTA for Mobile/Desktop */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-bounce">
                <Button className="bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-widest px-8 py-6 rounded-full shadow-2xl shadow-emerald-500/40 border-4 border-black/20" asChild>
                    <Link href="https://celoris.in">Try Celoris Free</Link>
                </Button>
            </div>

            <footer className="container py-12 px-4 mx-auto border-t border-white/5 text-center mt-20">
                <p className="text-[10px] font-black tracking-[0.4em] text-slate-600 uppercase mb-4">
                    Celoris Designs LLP | Incorporated 23rd May 2019 | Ministry of Corporate Affairs, India
                </p>
                <p className="text-[10px] font-black tracking-[0.4em] text-slate-600 uppercase">
                    © {new Date().getFullYear()} Celoris.in • All Rights Reserved
                </p>
            </footer>
        </div>
    );
}
