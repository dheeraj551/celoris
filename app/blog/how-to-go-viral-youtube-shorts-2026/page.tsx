'use client';

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import {
    ArrowLeft, Calendar, Clock, Tag, HelpCircle,
    Smartphone, Zap, Layers, MousePointer, Tv,
    Video, Play, TrendingUp, Search, Eye
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
                        backgroundImage: 'url("/goviral.png")'
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
                                Content Creation
                            </span>
                            <span className="text-slate-200 text-xs font-bold flex items-center gap-2 bg-black/40 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
                                <Clock className="h-4 w-4 text-emerald-500" /> 10 MIN READ
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-7xl font-black mb-8 leading-[1.1] tracking-tighter text-white drop-shadow-2xl">
                            How to Go Viral on YouTube Shorts in 2026 <span className="text-emerald-400 italic block mt-2">– Complete Guide</span>
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
                                <span className="text-sm uppercase tracking-widest text-slate-200">April 25, 2026</span>
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
                                    "YouTube Shorts crossed 70 billion daily views in 2025, and in 2026 it's bigger than ever. But most creators are still using 2022 strategies and wondering why nothing works."
                                </p>
                            </div>

                            <p>
                                The algorithm has evolved. Viewer habits have shifted. If you want to go viral, you need to play by the <strong>current</strong> rules.
                            </p>
                            <p>
                                This guide breaks down exactly what works in 2026 — from structure and hooks to thumbnails, posting times, and the psychology behind what makes people watch till the end.
                            </p>

                            <h2 className="text-3xl md:text-5xl font-black mt-24 mb-10 text-white flex items-center gap-4 text-balance">
                                <TrendingUp className="h-10 w-10 text-emerald-500 shrink-0" />
                                1. Understand How the YouTube Shorts Algorithm Works in 2026
                            </h2>
                            <p>
                                Before you create, you need to understand <em>who</em> you're creating for. The Shorts algorithm in 2026 primarily cares about three signals:
                            </p>
                            <ul>
                                <li><strong>Watch percentage</strong> — Did people watch your full Short or swipe away at second 3?</li>
                                <li><strong>Re-watches</strong> — Did they loop it? This is a massive positive signal.</li>
                                <li><strong>Engagement velocity</strong> — Likes, comments, and shares in the first 30–60 minutes after posting.</li>
                            </ul>
                            <p>
                                YouTube's algorithm doesn't care about your subscriber count when distributing Shorts. A 0-subscriber channel can go viral the same day it posts. What matters is: <em>does the content hold attention?</em>
                            </p>
                            <p>
                                The algorithm also now heavily factors in <strong>"swipe-away rate"</strong> — if people are consistently swiping past your video in the feed before it even finishes loading, you're getting penalized. This is why thumbnails and the first frame matter more than ever.
                            </p>
                            
                            <h2 className="text-3xl md:text-5xl font-black mt-24 mb-10 text-white flex items-center gap-4 text-balance">
                                <Play className="h-10 w-10 text-emerald-500 shrink-0" />
                                2. The Anatomy of a Viral YouTube Short
                            </h2>
                            <p>
                                Every viral Short in 2026 follows a simple but powerful structure:
                            </p>
                            
                            <div className="bg-gradient-to-br from-[#121a2e] to-[#0a0f1d] p-8 rounded-[2rem] border border-white/10 my-12 shadow-inner">
                                <h3 className="text-emerald-400 font-black uppercase tracking-widest text-xl mb-6">The Structure</h3>
                                <ul className="space-y-6 list-none p-0">
                                    <li className="flex gap-4">
                                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 font-black text-sm border border-emerald-500/30">1</div>
                                        <div>
                                            <strong className="block text-white mb-1">Hook (0–2 seconds)</strong>
                                            <span className="text-sm text-slate-400">This is the most important part of your entire video. You have roughly <strong>1.5 seconds</strong> before a viewer decides to keep watching or swipe. Create a curiosity gap, show a shocking result, or ask a relatable question.</span>
                                            <div className="mt-2 text-xs bg-red-500/10 text-red-400 p-2 rounded">❌ Bad hook: "Hey guys, today I'm going to show you how to edit videos."</div>
                                            <div className="mt-1 text-xs bg-emerald-500/10 text-emerald-400 p-2 rounded">✅ Good hook: "This one edit made my video go from 200 views to 2 million."</div>
                                        </div>
                                    </li>
                                    <li className="flex gap-4">
                                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 font-black text-sm border border-emerald-500/30">2</div>
                                        <div>
                                            <strong className="block text-white mb-1">Middle (2–45 seconds)</strong>
                                            <span className="text-sm text-slate-400">Deliver on the hook's promise — but do it fast. No filler, no long intros. Use <strong>pattern interrupts</strong> — a sudden cut, zoom, sound effect, or text overlay — every 5–7 seconds to reset attention.</span>
                                        </div>
                                    </li>
                                    <li className="flex gap-4">
                                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 font-black text-sm border border-emerald-500/30">3</div>
                                        <div>
                                            <strong className="block text-white mb-1">Ending (Last 3–5 seconds)</strong>
                                            <span className="text-sm text-slate-400">End with a <strong>loop trigger</strong> or a <strong>comment bait</strong>. Loop triggers make viewers re-watch. Comment bait invites responses. Re-watches and comments are algorithmic rocket fuel.</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>

                            <h2 className="text-3xl md:text-5xl font-black mt-24 mb-10 text-white flex items-center gap-4 text-balance">
                                <Search className="h-10 w-10 text-emerald-500 shrink-0" />
                                3. Niche Down to Blow Up
                            </h2>
                            <p>
                                In 2026, the biggest mistake creators make is trying to appeal to everyone. The algorithm rewards <strong>niche specificity</strong> because it can better categorize your content and push it to the right audience cluster.
                            </p>
                            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl my-8 text-center">
                                <p className="mb-2"><span className="text-slate-500 line-through">Instead of: "Productivity tips"</span><br/><strong className="text-emerald-400">Try: "Notion tips for freelance designers"</strong></p>
                                <p><span className="text-slate-500 line-through">Instead of: "Cooking hacks"</span><br/><strong className="text-emerald-400">Try: "5-minute high-protein meals for gym beginners"</strong></p>
                            </div>
                            <p>
                                The narrower your niche, the more loyal your early audience — and loyalty creates the engagement signals that trigger viral distribution.
                            </p>

                            <h2 className="text-3xl md:text-5xl font-black mt-24 mb-10 text-white flex items-center gap-4 text-balance">
                                <Calendar className="h-10 w-10 text-emerald-500 shrink-0" />
                                4. Consistency {'>'} Virality
                            </h2>
                            <p>
                                This sounds counterintuitive in a "go viral" guide, but here's the truth: <strong>virality is a byproduct of consistency.</strong> The creators who go viral aren't the ones who post one perfect video. They're the ones who post 30 decent videos and suddenly one explodes.
                            </p>
                            <p>
                                In 2026, the recommended posting cadence for growth is:
                            </p>
                            <ul>
                                <li><strong>Minimum:</strong> 3 Shorts per week</li>
                                <li><strong>Optimal:</strong> 1 Short per day (or 5–6/week)</li>
                            </ul>
                            <p>
                                Use a <strong>content bank</strong> — batch-film 10–15 videos in one session, then drip them out daily. This keeps you consistent without burning out.
                            </p>

                            <h2 className="text-3xl md:text-5xl font-black mt-24 mb-10 text-white flex items-center gap-4 text-balance">
                                <Eye className="h-10 w-10 text-emerald-500 shrink-0" />
                                5. First-Frame Optimization (The New Thumbnail)
                            </h2>
                            <p>
                                YouTube Shorts now shows a static thumbnail in the Shorts feed <em>before</em> autoplay kicks in. This is relatively new behavior and most creators are ignoring it.
                            </p>
                            <p>Your first frame needs to:</p>
                            <ul>
                                <li>Have <strong>bold, readable text</strong> (minimum 50px equivalent on screen)</li>
                                <li>Show a <strong>face with strong expression</strong> — curiosity, surprise, or shock performs best</li>
                                <li>Have <strong>high contrast</strong> — avoid dark backgrounds with dark text</li>
                                <li>Avoid clutter — one focal point wins</li>
                            </ul>
                            <p>Think of it like a billboard someone sees for 0.5 seconds at highway speed. What's the <em>one</em> thing they remember?</p>

                            <div className="bg-emerald-500/10 border border-emerald-500/20 p-10 md:p-16 rounded-[3rem] my-24 text-center">
                                <h3 className="text-2xl md:text-4xl font-black text-white mb-6">Ready to Master Video Creation?</h3>
                                <p className="text-slate-400 mb-10 text-lg">Join Celoris' Content Creation Courses. Learn from viral experts and build your audience.</p>
                                <Button size="lg" className="bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-[0.2em] rounded-full px-16 py-8 text-xl shadow-[0_20px_40px_rgba(16,185,129,0.3)] hover:scale-105 transition-all" asChild>
                                    <Link href="https://celoris.in">Explore Courses</Link>
                                </Button>
                            </div>

                            <div className="mt-32 pt-16 border-t border-white/10">
                                <h2 className="text-3xl md:text-5xl font-black mb-10 text-white tracking-tight">Final Thought</h2>
                                <p className="text-lg leading-relaxed mb-6 font-medium text-slate-200">
                                    Going viral isn't luck — it's a system. The creators blowing up on YouTube Shorts in 2026 are the ones who treat each video as an experiment, study the data, iterate fast, and stay consistent even when early numbers are underwhelming.
                                </p>
                                <p className="text-lg leading-relaxed mb-12 italic text-emerald-400 font-black">
                                    Start today. Film your first Short. Don't wait for the perfect idea — the algorithm will teach you what works if you show up consistently.
                                </p>
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="mt-12 pt-12 border-t border-white/10 flex flex-wrap gap-3">
                            <Tag className="h-4 w-4 text-emerald-500 mt-1" />
                            {['YouTube Shorts', 'Viral Content', 'Algorithm 2026', 'Content Creation', 'Social Media Growth'].map((tag) => (
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
