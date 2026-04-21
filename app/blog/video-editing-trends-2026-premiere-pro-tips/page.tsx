'use client';

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import {
    ArrowLeft, Calendar, Clock, Tag, Check, X,
    Smartphone, Laptop, Play, Info, HelpCircle,
    ArrowRight, Star, Shield, Zap, IndianRupee, Video,
    Layers, MousePointer, Palette, PenTool, Tv
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
                        backgroundImage: 'url("/videoediting.png")'
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
                                Technology • Video Editing
                            </span>
                            <span className="text-slate-200 text-xs font-bold flex items-center gap-2 bg-black/40 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
                                <Clock className="h-4 w-4 text-emerald-500" /> 10 MIN READ
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-7xl font-black mb-8 leading-[1.1] tracking-tighter text-white drop-shadow-2xl">
                            Top 5 Video Editing Trends in 2026 <span className="text-emerald-400 italic block mt-2">(+ Premiere Pro Tips to Stay Ahead)</span>
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
                                <span className="text-sm uppercase tracking-widest text-slate-200">April 21, 2026</span>
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
                                    "Video editing in 2026 is no longer about just assembling clips; it's about mastering AI workflows and vertical-first storytelling to capture attention in seconds."
                                </p>
                            </div>

                            <p>
                                Video editing in 2026 is not what it was two years ago. AI has exploded into every part of the post-production workflow, audiences are consuming content faster and on more screens than ever, and tools like Adobe Premiere Pro are shipping major updates almost every quarter. Whether you're a freelancer, a content creator, or someone just starting out — staying updated with these shifts is the difference between landing clients and getting left behind.
                            </p>
                            <p>
                                At Celoris, we train students across India on professional video editing — from complete beginners to working professionals looking to level up. In this post, we break down the **top 5 video editing trends dominating 2026** and give you actionable **Premiere Pro tips** you can start using today.
                            </p>

                            <h2 className="text-3xl md:text-5xl font-black mt-24 mb-10 text-white flex items-center gap-4 text-balance">
                                <Zap className="h-10 w-10 text-emerald-500 shrink-0" />
                                1. AI-Powered Editing Is Now Standard
                            </h2>
                            <p>
                                If you're still manually cutting every scene, adjusting audio levels by ear, and color grading by trial and error — you're working harder than you need to. In 2026, AI assistance has become a baseline expectation in professional video editing, not a premium feature.
                            </p>
                            <p>
                                Adobe Premiere Pro's integration with **Adobe Sensei and Firefly** has matured significantly. Tools like **Auto Reframe**, **Scene Edit Detection**, **Speech to Text captions**, and the newer **AI-powered B-roll suggestions** are now baked into standard workflows.
                            </p>
                            
                            <div className="bg-gradient-to-br from-[#121a2e] to-[#0a0f1d] p-8 rounded-[2rem] border border-white/10 my-12 shadow-inner">
                                <p className="text-emerald-400 font-black uppercase tracking-widest text-sm mb-6 flex items-center gap-2">
                                    <PenTool className="h-4 w-4" /> Premiere Pro Tips:
                                </p>
                                <ul className="space-y-6 list-none p-0">
                                    <li className="flex gap-4">
                                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 font-black text-sm border border-emerald-500/30">1</div>
                                        <div>
                                            <strong className="block text-white mb-1">Use Speech to Text for rough cuts</strong>
                                            <span className="text-sm text-slate-400">Go to Window &gt; Text &gt; Transcript, transcribe your footage, then select and delete unwanted spoken sections directly from the transcript panel.</span>
                                        </div>
                                    </li>
                                    <li className="flex gap-4">
                                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 font-black text-sm border border-emerald-500/30">2</div>
                                        <div>
                                            <strong className="block text-white mb-1">Auto Reframe for Reels and Shorts</strong>
                                            <span className="text-sm text-slate-400">Use Sequence &gt; Auto Reframe Sequence. Set it to 9:16, and Premiere will track your subject automatically.</span>
                                        </div>
                                    </li>
                                    <li className="flex gap-4">
                                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 font-black text-sm border border-emerald-500/30">3</div>
                                        <div>
                                            <strong className="block text-white mb-1">Scene Edit Detection</strong>
                                            <span className="text-sm text-slate-400">Right-click a clip and select Scene Edit Detection to automatically insert cut points in raw footage.</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>

                            <h2 className="text-3xl md:text-5xl font-black mt-24 mb-10 text-white flex items-center gap-4 text-balance">
                                <Smartphone className="h-10 w-10 text-emerald-500 shrink-0" />
                                2. Vertical Video Is the Primary Format
                            </h2>
                            <p>
                                For years, 16:9 widescreen was the "real" format. In 2026, that's completely flipped. Instagram Reels, YouTube Shorts, and especially **LinkedIn video** are driving demand for 9:16 content that is edited *natively vertical*.
                            </p>
                            <p>
                                Smart creators are now following a **"Vertical-First"** philosophy: framing subjects centrally during the shoot so footage works in both orientations, and building vertical sequences from scratch.
                            </p>

                            <div className="bg-emerald-500/5 border border-emerald-500/20 p-8 rounded-3xl my-10">
                                <p className="text-white font-bold mb-4 flex items-center gap-2">
                                    <Layers className="h-5 w-5 text-emerald-500" /> Pro Workflow Tip:
                                </p>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    Use **Nested Sequences** for multi-format delivery. Edit your base content in a 1080p horizontal sequence, then nest it inside vertical sequences where you can reposition and scale clips independently. Changes to the base sequence ripple through all formats automatically.
                                </p>
                            </div>

                            <h2 className="text-3xl md:text-5xl font-black mt-24 mb-10 text-white flex items-center gap-4 text-balance">
                                <Palette className="h-10 w-10 text-emerald-500 shrink-0" />
                                3. Cinematic Color Grading for Everyone
                            </h2>
                            <p>
                                Color grading is no longer a niche specialization. With LUT packs and Premiere Pro's Lumetri Color panel becoming more intuitive (including AI-assisted Auto Color), every serious editor is expected to have a solid foundation in color work.
                            </p>
                            <p>
                                The key in 2026 is understanding the difference between **color correction** (balancing footage) and **color grading** (applying style). Most beginners skip the correction phase, which is why their LUTs often look "off".
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-12">
                                <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                                    <h4 className="text-white font-black mb-3 text-sm uppercase tracking-widest">Correction First</h4>
                                    <p className="text-xs text-slate-400">Always use Lumetri Scopes to check exposure (Waveform) and saturation (Vectorscope) before applying any creative look.</p>
                                </div>
                                <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                                    <h4 className="text-white font-black mb-3 text-sm uppercase tracking-widest">Adjustment Layers</h4>
                                    <p className="text-xs text-slate-400">Never apply Lumetri Color directly to a clip. Apply it to an Adjustment Layer above your edit for easier control.</p>
                                </div>
                            </div>

                            <h2 className="text-3xl md:text-5xl font-black mt-24 mb-10 text-white flex items-center gap-4 text-balance">
                                <MousePointer className="h-10 w-10 text-emerald-500 shrink-0" />
                                4. Motion Graphics Are Non-Negotiable
                            </h2>
                            <p>
                                Audiences in 2026 expect visual energy. Kinetic typography, animated lower thirds, and dynamic transitions are now standard. The bridge between complex animation and fast editing is the **.mogrt (Motion Graphics Template)**.
                            </p>
                            <p>
                                You don't need to be an After Effects expert anymore. By using the **Essential Graphics Panel** in Premiere Pro, you can customize professional templates directly on your timeline.
                            </p>

                            <h2 className="text-3xl md:text-5xl font-black mt-24 mb-10 text-white flex items-center gap-4 text-balance">
                                <Tv className="h-10 w-10 text-emerald-500 shrink-0" />
                                5. Multi-Platform Export Optimization
                            </h2>
                            <p>
                                Professional delivery now means exporting for multiple platforms with different specs, aspect ratios, and color spaces (like HDR for YouTube vs SDR for Instagram).
                            </p>
                            <p>
                                Editors are increasingly using **Adobe Media Encoder** for batch exports to keep Premiere responsive, and utilizing custom export presets for every platform to maintain quality while managing file sizes.
                            </p>

                            <div className="bg-emerald-500/10 border border-emerald-500/20 p-10 md:p-16 rounded-[3rem] my-24 text-center">
                                <h3 className="text-2xl md:text-4xl font-black text-white mb-6">Master Premiere Pro in 2026</h3>
                                <p className="text-slate-400 mb-10 text-lg">Join Celoris' Industry-Standard Video Editing Course. Learn from experts and build a high-paying career.</p>
                                <Button size="lg" className="bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-[0.2em] rounded-full px-16 py-8 text-xl shadow-[0_20px_40px_rgba(16,185,129,0.3)] hover:scale-105 transition-all" asChild>
                                    <Link href="https://celoris.in">Explore Courses</Link>
                                </Button>
                            </div>

                            <h2 className="text-3xl md:text-5xl font-black mt-32 mb-12 text-white flex items-center gap-4">
                                <HelpCircle className="h-10 w-10 text-emerald-500 shrink-0" />
                                FAQs
                            </h2>
                            <div className="mb-32">
                                <Accordion type="single" collapsible className="space-y-4">
                                    {[
                                        {
                                            q: "Do I need a supercomputer for Premiere Pro in 2026?",
                                            a: "While AI features demand more power, Premiere's proxy workflow and cloud rendering options allow you to edit even on mid-range laptops. We recommend at least 16GB RAM and a dedicated GPU."
                                        },
                                        {
                                            q: "Is AI going to replace video editors?",
                                            a: "No. AI replaces the repetitive tasks (masking, transcribing, basic cuts). It doesn't replace storytelling, pacing, and emotional resonance. The best editors are those who use AI to speed up their work."
                                        },
                                        {
                                            q: "Should I learn After Effects too?",
                                            a: "Yes. Basic After Effects knowledge is a huge competitive advantage in 2026. Even being able to tweak a MOGRT or do a simple clean-up makes you 2x more valuable to clients."
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
                                <h2 className="text-3xl md:text-5xl font-black mb-10 text-white tracking-tight">The Final Cut</h2>
                                <p className="text-lg leading-relaxed mb-6 font-medium text-slate-200">
                                    The editors who will thrive in 2026 are not those who just know every keyboard shortcut. They're the ones who understand narrative structure, pacing, and how to make audiences *feel* something using the latest tools at their disposal.
                                </p>
                                <p className="text-lg leading-relaxed mb-12 italic text-emerald-400 font-black">
                                    Stay creative, stay curious, and keep rendering.
                                </p>
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="mt-12 pt-12 border-t border-white/10 flex flex-wrap gap-3">
                            <Tag className="h-4 w-4 text-emerald-500 mt-1" />
                            {['Adobe Premiere Pro', 'Video Editing Trends 2026', 'AI Editing', 'Color Grading', 'Motion Graphics', 'Vertical Video'].map((tag) => (
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
