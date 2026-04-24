'use client';

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import {
    ArrowLeft, Calendar, Clock, Tag, Check, X,
    Smartphone, Laptop, Play, Info, HelpCircle,
    ArrowRight, Star, Shield, Zap, IndianRupee, Video,
    Layers, MousePointer, Palette, PenTool, Tv,
    Search, Layout, Share2, Users, Wand2
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
                        backgroundImage: 'url("/topvideoedit.jpg")'
                    }}
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/60 bg-gradient-to-t from-[#050810] via-[#050810]/60 to-transparent" />

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
                                Technology • AI Tools
                            </span>
                            <span className="text-slate-200 text-xs font-bold flex items-center gap-2 bg-black/40 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
                                <Clock className="h-4 w-4 text-emerald-500" /> 8 MIN READ
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-7xl font-black mb-8 leading-[1.1] tracking-tighter text-white drop-shadow-2xl">
                            Top 10 Free AI Video Editing Tools <span className="text-emerald-400 italic block mt-2">India 2026 — Edit Like a Pro Without Spending a Rupee</span>
                        </h1>
                        <div className="flex flex-wrap items-center gap-8 text-slate-400">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-600 flex items-center justify-center text-white font-black text-xl border-2 border-white/20 shadow-2xl">
                                    C
                                </div>
                                <div>
                                    <p className="font-black text-white tracking-tight text-lg leading-none mb-1">Celoris Editorial</p>
                                    <p className="text-[10px] uppercase font-black tracking-[0.2em] text-emerald-500">Official Creator</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 font-bold bg-white/5 px-4 py-2 rounded-full border border-white/5">
                                <Calendar className="h-4 w-4 text-emerald-500" />
                                <span className="text-sm uppercase tracking-widest text-slate-200">April 24, 2026</span>
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
                                    "AI video editing tools in 2026 have made professional-quality content accessible to everyone. No expensive software. No six-month learning curve."
                                </p>
                            </div>

                            <p>
                                Whether you're making Instagram Reels, YouTube Shorts, or full-length tutorials — **AI video editing tools in 2026 have made professional-quality content accessible to everyone**. No expensive software. No six-month learning curve. Just you, your idea, and the right tool.
                            </p>
                            <p>
                                India now has over **500 million internet users creating video content daily**, and the demand for free, mobile-friendly AI editors with Hindi/regional language support has skyrocketed 250% year-over-year. If you're a student, freelancer, trainer, or content creator, this list is for you.
                            </p>
                            <p>
                                Here are the **top 10 free AI video editing tools** that Indian creators are actually using in 2026 — evaluated on ease of use, free plan value, mobile support, and India-specific features.
                            </p>

                            <div className="space-y-24 mt-20">
                                {/* 1. CapCut */}
                                <section>
                                    <h2 className="text-3xl md:text-5xl font-black mb-6 text-white flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-black shrink-0 shadow-lg shadow-emerald-500/20">1</div>
                                        CapCut — Best for Reels & Shorts
                                    </h2>
                                    <div className="flex flex-wrap gap-4 mb-8">
                                        <span className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10 text-xs font-bold uppercase tracking-widest text-slate-300">
                                            <Smartphone className="h-4 w-4 text-emerald-500" /> Mobile + Web
                                        </span>
                                        <span className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10 text-xs font-bold uppercase tracking-widest text-slate-300">
                                            <Zap className="h-4 w-4 text-emerald-500" /> Free Exports
                                        </span>
                                    </div>
                                    <p>
                                        CapCut is the undisputed king for Gen Z creators in India. It's fast, it's free, and it's packed with AI features — auto-captions, background removal, AI effects, trending transitions, and even a text-to-video generator. The Hindi caption support is surprisingly accurate, making it a go-to for Hinglish content creators.
                                    </p>
                                    <div className="bg-emerald-500/5 border border-emerald-500/20 p-6 rounded-3xl mt-6">
                                        <p className="text-sm text-slate-400 font-medium mb-0">
                                            <strong className="text-white">India edge:</strong> Trending Hindi BGM library, regional font support.
                                        </p>
                                    </div>
                                </section>

                                {/* 2. InVideo AI */}
                                <section>
                                    <h2 className="text-3xl md:text-5xl font-black mb-6 text-white flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-black shrink-0 shadow-lg shadow-emerald-500/20">2</div>
                                        InVideo AI — Best for Text-to-Video
                                    </h2>
                                    <div className="flex flex-wrap gap-4 mb-8">
                                        <span className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10 text-xs font-bold uppercase tracking-widest text-slate-300">
                                            <Laptop className="h-4 w-4 text-emerald-500" /> Web
                                        </span>
                                    </div>
                                    <p>
                                        InVideo AI lets you convert a script or blog post into a fully edited video with voiceover, visuals, and subtitles — in minutes. Paste your article, pick a style, and get a publish-ready video. Perfect for trainers and educators who create course previews or explainer content.
                                    </p>
                                    <div className="bg-emerald-500/5 border border-emerald-500/20 p-6 rounded-3xl mt-6">
                                        <p className="text-sm text-slate-400 font-medium mb-0">
                                            <strong className="text-white">India edge:</strong> UPI/Indian card payments, ₹-based pricing, Indian stock footage.
                                        </p>
                                    </div>
                                </section>

                                {/* 3. Canva */}
                                <section>
                                    <h2 className="text-3xl md:text-5xl font-black mb-6 text-white flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-black shrink-0 shadow-lg shadow-emerald-500/20">3</div>
                                        Canva AI — Best for Non-Editors
                                    </h2>
                                    <div className="flex flex-wrap gap-4 mb-8">
                                        <span className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10 text-xs font-bold uppercase tracking-widest text-slate-300">
                                            <Layout className="h-4 w-4 text-emerald-500" /> Web + Mobile
                                        </span>
                                    </div>
                                    <p>
                                        Canva's video editor is beginner-friendly without being limited. The AI Voice Generator lets you add studio-quality narration from text — no mic needed. The Image-to-Video feature turns static product photos into short cinematic clips. Direct publishing to Instagram, YouTube, WhatsApp, and more makes it a full content workflow tool.
                                    </p>
                                    <div className="bg-emerald-500/5 border border-emerald-500/20 p-6 rounded-3xl mt-6">
                                        <p className="text-sm text-slate-400 font-medium mb-0">
                                            <strong className="text-white">India edge:</strong> WhatsApp-ready export, Indian language templates.
                                        </p>
                                    </div>
                                </section>

                                {/* 4. CapCut Web */}
                                <section>
                                    <h2 className="text-3xl md:text-5xl font-black mb-6 text-white flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-black shrink-0 shadow-lg shadow-emerald-500/20">4</div>
                                        CapCut Web — Best Timeline Editor
                                    </h2>
                                    <div className="flex flex-wrap gap-4 mb-8">
                                        <span className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10 text-xs font-bold uppercase tracking-widest text-slate-300">
                                            <Laptop className="h-4 w-4 text-emerald-500" /> Desktop Web
                                        </span>
                                    </div>
                                    <p>
                                        While the app version is mobile-first, CapCut's web version gives you a proper desktop editing experience with AI background remover, auto-captions, keyframe animations, and multi-track editing — all free. If you want something between a basic mobile editor and heavy software like Premiere Pro, this hits the sweet spot.
                                    </p>
                                    <div className="bg-emerald-500/5 border border-emerald-500/20 p-6 rounded-3xl mt-6">
                                        <p className="text-sm text-slate-400 font-medium mb-0">
                                            <strong className="text-white">India edge:</strong> Works smoothly on mid-range laptops without GPU.
                                        </p>
                                    </div>
                                </section>

                                {/* 5. VEED.io */}
                                <section>
                                    <h2 className="text-3xl md:text-5xl font-black mb-6 text-white flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-black shrink-0 shadow-lg shadow-emerald-500/20">5</div>
                                        VEED.io — Best for Auto-Subtitles
                                    </h2>
                                    <div className="flex flex-wrap gap-4 mb-8">
                                        <span className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10 text-xs font-bold uppercase tracking-widest text-slate-300">
                                            <Tv className="h-4 w-4 text-emerald-500" /> Web
                                        </span>
                                    </div>
                                    <p>
                                        VEED.io is popular among educators and trainers for its incredibly accurate auto-subtitle feature — reportedly 99% accuracy for regional Indian languages like Tamil and Telugu. It's browser-based, so no downloads, and it supports real-time collaboration. Great for small teams or coaches who produce consistent tutorial content.
                                    </p>
                                    <div className="bg-emerald-500/5 border border-emerald-500/20 p-6 rounded-3xl mt-6">
                                        <p className="text-sm text-slate-400 font-medium mb-0">
                                            <strong className="text-white">India edge:</strong> Strong Dravidian language subtitle accuracy.
                                        </p>
                                    </div>
                                </section>

                                {/* 6. Descript */}
                                <section>
                                    <h2 className="text-3xl md:text-5xl font-black mb-6 text-white flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-black shrink-0 shadow-lg shadow-emerald-500/20">6</div>
                                        Descript — Best for Podcasts
                                    </h2>
                                    <div className="flex flex-wrap gap-4 mb-8">
                                        <span className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10 text-xs font-bold uppercase tracking-widest text-slate-300">
                                            <MousePointer className="h-4 w-4 text-emerald-500" /> Desktop
                                        </span>
                                    </div>
                                    <p>
                                        Descript treats your video like a Google Doc — edit the transcript, and the video edits itself. Remove filler words, awkward pauses, and "umms" with one click. Its Underlord AI toolkit adds auto-multicam switching, highlight clipping, and audio enhancement. If you record course content or webinars, this tool will save you hours.
                                    </p>
                                    <div className="bg-emerald-500/5 border border-emerald-500/20 p-6 rounded-3xl mt-6">
                                        <p className="text-sm text-slate-400 font-medium mb-0">
                                            <strong className="text-white">India edge:</strong> Excellent for repurposing recorded Zoom/Google Meet sessions.
                                        </p>
                                    </div>
                                </section>

                                {/* 7. Clipchamp */}
                                <section>
                                    <h2 className="text-3xl md:text-5xl font-black mb-6 text-white flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-black shrink-0 shadow-lg shadow-emerald-500/20">7</div>
                                        Clipchamp — Best for Windows
                                    </h2>
                                    <div className="flex flex-wrap gap-4 mb-8">
                                        <span className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10 text-xs font-bold uppercase tracking-widest text-slate-300">
                                            <Laptop className="h-4 w-4 text-emerald-500" /> Windows App
                                        </span>
                                    </div>
                                    <p>
                                        Clipchamp comes pre-installed on Windows 11 and is completely free with your Microsoft account. It has AI-powered auto-compose, text-to-speech, green screen removal, and social media templates. For students and beginners on laptops, this is the easiest starting point — no sign-ups, no confusion.
                                    </p>
                                    <div className="bg-emerald-500/5 border border-emerald-500/20 p-6 rounded-3xl mt-6">
                                        <p className="text-sm text-slate-400 font-medium mb-0">
                                            <strong className="text-white">India edge:</strong> Works offline, no internet dependency for basic edits.
                                        </p>
                                    </div>
                                </section>

                                {/* 8. OpusClip */}
                                <section>
                                    <h2 className="text-3xl md:text-5xl font-black mb-6 text-white flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-black shrink-0 shadow-lg shadow-emerald-500/20">8</div>
                                        OpusClip — Best for Repurposing
                                    </h2>
                                    <div className="flex flex-wrap gap-4 mb-8">
                                        <span className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10 text-xs font-bold uppercase tracking-widest text-slate-300">
                                            <Share2 className="h-4 w-4 text-emerald-500" /> Web
                                        </span>
                                    </div>
                                    <p>
                                        OpusClip automatically finds the most engaging "viral moments" in your long-form videos (webinars, lectures, YouTube videos) and turns them into short clips — complete with captions and B-roll suggestions. If you run workshops or upload long tutorials, OpusClip can generate a week's worth of Reels from a single session.
                                    </p>
                                    <div className="bg-emerald-500/5 border border-emerald-500/20 p-6 rounded-3xl mt-6">
                                        <p className="text-sm text-slate-400 font-medium mb-0">
                                            <strong className="text-white">Pro tip:</strong> Perfect for converting Celoris course previews into Reels.
                                        </p>
                                    </div>
                                </section>

                                {/* 9. FlexClip */}
                                <section>
                                    <h2 className="text-3xl md:text-5xl font-black mb-6 text-white flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-black shrink-0 shadow-lg shadow-emerald-500/20">9</div>
                                        FlexClip — Best Script-to-Video
                                    </h2>
                                    <div className="flex flex-wrap gap-4 mb-8">
                                        <span className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10 text-xs font-bold uppercase tracking-widest text-slate-300">
                                            <Video className="h-4 w-4 text-emerald-500" /> Web
                                        </span>
                                    </div>
                                    <p>
                                        FlexClip's AI script-to-video is one of the cleanest implementations available free. Type or paste your script, and the AI assembles stock footage, background music, and transitions automatically. It also has a solid AI subtitle generator. Cloud-based, so you can edit from any device.
                                    </p>
                                    <div className="bg-emerald-500/5 border border-emerald-500/20 p-6 rounded-3xl mt-6">
                                        <p className="text-sm text-slate-400 font-medium mb-0">
                                            <strong className="text-white">India edge:</strong> Works well on slower connections, no heavy downloads.
                                        </p>
                                    </div>
                                </section>

                                {/* 10. Kapwing */}
                                <section>
                                    <h2 className="text-3xl md:text-5xl font-black mb-6 text-white flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-black shrink-0 shadow-lg shadow-emerald-500/20">10</div>
                                        Kapwing — Best for Collaboration
                                    </h2>
                                    <div className="flex flex-wrap gap-4 mb-8">
                                        <span className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10 text-xs font-bold uppercase tracking-widest text-slate-300">
                                            <Users className="h-4 w-4 text-emerald-500" /> Web
                                        </span>
                                    </div>
                                    <p>
                                        Kapwing is built for teams and educators. It has AI-powered text-based video editing, automatic transcription, generative slideshows, and smart subtitle generation. The collaborative workspace is especially useful for batch-producing content — multiple people can work on different videos simultaneously.
                                    </p>
                                    <div className="bg-emerald-500/5 border border-emerald-500/20 p-6 rounded-3xl mt-6">
                                        <p className="text-sm text-slate-400 font-medium mb-0">
                                            <strong className="text-white">India edge:</strong> Works in-browser on low-end devices, no GPU required.
                                        </p>
                                    </div>
                                </section>
                            </div>

                            <h2 className="text-3xl md:text-5xl font-black mt-24 mb-10 text-white flex items-center gap-4 text-balance">
                                <Search className="h-10 w-10 text-emerald-500 shrink-0" />
                                Quick Comparison Table
                            </h2>
                            <div className="overflow-x-auto my-12 rounded-3xl border border-white/10 bg-white/5">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-white/10">
                                            <th className="p-6 text-emerald-400 font-black uppercase tracking-widest text-xs">Tool</th>
                                            <th className="p-6 text-emerald-400 font-black uppercase tracking-widest text-xs">Best For</th>
                                            <th className="p-6 text-emerald-400 font-black uppercase tracking-widest text-xs">Free Export</th>
                                            <th className="p-6 text-emerald-400 font-black uppercase tracking-widest text-xs">Mobile</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {[
                                            { tool: "CapCut", best: "Reels & Shorts", export: "✅ No watermark", mobile: "✅" },
                                            { tool: "InVideo AI", best: "Text-to-Video", export: "⚠️ Watermark", mobile: "✅" },
                                            { tool: "Canva AI", best: "Non-editors", export: "✅ Generous", mobile: "✅" },
                                            { tool: "CapCut Web", best: "Desktop editing", export: "✅ No watermark", mobile: "✅" },
                                            { tool: "VEED.io", best: "Subtitles", export: "⚠️ Watermark", mobile: "✅" },
                                            { tool: "Descript", best: "Course creators", export: "⚠️ 1hr limit", mobile: "❌" },
                                            { tool: "Clipchamp", best: "Windows users", export: "✅ 1080p", mobile: "❌" },
                                            { tool: "OpusClip", best: "Repurposing", export: "⚠️ Limited", mobile: "❌" },
                                            { tool: "FlexClip", best: "Script-to-video", export: "⚠️ Watermark", mobile: "✅" },
                                            { tool: "Kapwing", best: "Collaboration", export: "⚠️ Watermark", mobile: "✅" },
                                        ].map((row, i) => (
                                            <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                <td className="p-6 font-bold text-white">{row.tool}</td>
                                                <td className="p-6 text-slate-400">{row.best}</td>
                                                <td className="p-6 text-slate-400">{row.export}</td>
                                                <td className="p-6 text-slate-400">{row.mobile}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <h2 className="text-3xl md:text-5xl font-black mt-24 mb-10 text-white flex items-center gap-4 text-balance">
                                <Wand2 className="h-10 w-10 text-emerald-500 shrink-0" />
                                Which Tool Should You Start With?
                            </h2>
                            <ul className="space-y-6 list-none p-0 my-12">
                                <li className="flex gap-4 items-start bg-white/5 p-6 rounded-2xl border border-white/10">
                                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 font-black text-sm border border-emerald-500/30">1</div>
                                    <div>
                                        <strong className="block text-white mb-1">Zero experience? Start with CapCut</strong>
                                        <span className="text-sm text-slate-400">It's the most beginner-friendly and produces professional-looking Reels in under 10 minutes.</span>
                                    </div>
                                </li>
                                <li className="flex gap-4 items-start bg-white/5 p-6 rounded-2xl border border-white/10">
                                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 font-black text-sm border border-emerald-500/30">2</div>
                                    <div>
                                        <strong className="block text-white mb-1">Creating course content?</strong>
                                        <span className="text-sm text-slate-400">Use Descript or InVideo AI — they handle long-form editing like a document.</span>
                                    </div>
                                </li>
                                <li className="flex gap-4 items-start bg-white/5 p-6 rounded-2xl border border-white/10">
                                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 font-black text-sm border border-emerald-500/30">3</div>
                                    <div>
                                        <strong className="block text-white mb-1">Running a training institute?</strong>
                                        <span className="text-sm text-slate-400">OpusClip + CapCut combo — repurpose your webinars into a month of social content automatically.</span>
                                    </div>
                                </li>
                            </ul>

                            <div className="bg-emerald-500/10 border border-emerald-500/20 p-10 md:p-16 rounded-[3rem] my-24 text-center">
                                <h3 className="text-2xl md:text-4xl font-black text-white mb-6">Master Video Editing with AI</h3>
                                <p className="text-slate-400 mb-10 text-lg">Join Celoris' Industry-Standard Video Editing Course. Learn from experts and build a high-paying career.</p>
                                <Button size="lg" className="bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-[0.2em] rounded-full px-16 py-8 text-xl shadow-[0_20px_40px_rgba(16,185,129,0.3)] hover:scale-105 transition-all" asChild>
                                    <Link href="https://celoris.in">Explore Courses</Link>
                                </Button>
                            </div>

                            <div className="mt-32 pt-16 border-t border-white/10">
                                <h2 className="text-3xl md:text-5xl font-black mb-10 text-white tracking-tight">Final Thoughts</h2>
                                <p className="text-lg leading-relaxed mb-6 font-medium text-slate-200">
                                    In 2026, the gap between amateur and professional video content has almost disappeared — thanks to AI. You don't need a ₹50,000 editing PC or years of Adobe Premiere training to produce content that looks and sounds great. These 10 tools prove that.
                                </p>
                                <p className="text-lg leading-relaxed mb-12 italic text-emerald-400 font-black">
                                    Pick one, start creating, and iterate from there. The best video editor is the one you actually use consistently.
                                </p>
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="mt-12 pt-12 border-t border-white/10 flex flex-wrap gap-3">
                            <Tag className="h-4 w-4 text-emerald-500 mt-1" />
                            {['AI video editing', 'free video editor India', 'CapCut India', 'InVideo AI', 'best video editing tools 2026', 'content creation India', 'video editing for beginners'].map((tag) => (
                                <span key={tag} className="bg-white/5 text-slate-400 px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest hover:bg-emerald-500/20 hover:text-emerald-400 transition-all cursor-default border border-white/5 hover:border-emerald-500/30">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Sticky CTA */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-bounce">
                <Button className="bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-widest px-8 py-6 rounded-full shadow-2xl shadow-emerald-500/40 border-4 border-black/20" asChild>
                    <Link href="https://celoris.in">Start Learning Now</Link>
                </Button>
            </div>

            <footer className="container py-12 px-4 mx-auto border-t border-white/5 text-center mt-20">
                <p className="text-[10px] font-black tracking-[0.4em] text-slate-600 uppercase mb-4">
                    Celoris Designs LLP | India's Leading Creative Skills Platform
                </p>
                <p className="text-[10px] font-black tracking-[0.4em] text-slate-600 uppercase">
                    © {new Date().getFullYear()} Celoris.in • All Rights Reserved
                </p>
            </footer>
        </div>
    );
}
