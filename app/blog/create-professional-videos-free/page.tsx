import Link from 'next/link';
import { Metadata } from 'next';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User, Clock, Tag, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
    title: 'How to Create Videos Without Expensive Software in India 2025',
    description: 'Free workflow for Indian creators — no Adobe, no budget needed. Create professional videos using free tools including Celoris.',
};

export default function BlogPost() {
    return (
        <div className="min-h-screen bg-[#050810] text-slate-300">
            {/* Hero Section */}
            <div className="relative h-[500px] w-full overflow-hidden">
                {/* Background Image */}
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
                    style={{
                        backgroundImage: 'url("/blog-create-videos-free.png")'
                    }}
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40 bg-gradient-to-t from-[#050810] via-[#050810]/40 to-transparent" />

                <div className="container relative h-full flex flex-col justify-end pb-12 text-white">
                    <Button variant="ghost" className="text-white w-fit mb-8 hover:bg-white/10 group bg-black/20 backdrop-blur-md border border-white/10" asChild>
                        <Link href="/blog">
                            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                            Back to Blog
                        </Link>
                    </Button>

                    <div className="max-w-4xl">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="bg-emerald-500/20 text-emerald-400 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase border border-emerald-500/30 backdrop-blur-md">
                                Content Creation
                            </span>
                            <span className="text-slate-400 text-xs font-medium flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-full border border-white/5 backdrop-blur-sm">
                                <Clock className="h-3.5 w-3.5" /> 5 min read
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-8 leading-[1.1] tracking-tight text-white drop-shadow-2xl">
                            How to Create Professional Videos Without Expensive Software in 2025
                        </h1>
                        <div className="flex items-center gap-8 text-slate-400">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-600 flex items-center justify-center text-white font-black text-lg border-2 border-white/10 shadow-xl">
                                    C
                                </div>
                                <div>
                                    <p className="font-bold text-white tracking-tight">Celoris</p>
                                    <p className="text-[10px] uppercase font-bold tracking-widest text-emerald-500">Author</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 font-medium">
                                <Calendar className="h-4 w-4 text-emerald-500" />
                                <span className="text-sm">February 24, 2026</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="container py-20">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-[#0a0f1d] rounded-[2.5rem] p-8 md:p-16 shadow-2xl border border-white/5 relative overflow-hidden">
                        {/* Decorative blur */}
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/5 rounded-full blur-[100px]" />
                        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-cyan-500/5 rounded-full blur-[100px]" />

                        <div className="prose prose-invert prose-emerald max-w-none">
                            <p className="text-xl md:text-2xl text-slate-300 leading-relaxed font-medium mb-12 border-l-4 border-emerald-500 pl-8 py-2 bg-emerald-500/5 rounded-r-2xl">
                                The complete guide for Indian students, creators and small businesses who refuse to pay ₹3,500/month for Adobe.
                            </p>

                            <h2 className="text-3xl font-bold mt-16 mb-8 text-white tracking-tight">
                                The Problem Nobody Talks About
                            </h2>
                            <p className="text-lg leading-relaxed mb-8">
                                Every YouTube tutorial, every Instagram Reel, every corporate explainer video you admire was made with tools that cost a fortune. Adobe Premiere Pro. Final Cut Pro. After Effects.
                            </p>
                            <p className="text-lg leading-relaxed mb-8">
                                The message seems clear — if you want professional video output, you need to pay professional prices.
                                But that's simply not true anymore. And Indian creators are proving it every single day.
                            </p>
                            <p className="text-lg leading-relaxed mb-8">
                                Here's exactly how to create stunning videos in 2025 without spending a single rupee on software.
                            </p>

                            <div className="space-y-16 mt-20">
                                <section className="relative">
                                    <h3 className="text-2xl font-bold mb-6 text-white flex items-center gap-4">
                                        <span className="w-10 h-10 rounded-xl bg-emerald-500 text-black flex items-center justify-center font-black text-xl shadow-[0_0_20px_rgba(16,185,129,0.3)]">1</span>
                                        Choose the Right Free Tool
                                    </h3>
                                    <p className="text-lg leading-relaxed mb-8">
                                        The first decision is the most important. Not all free video editors are equal.
                                        Here's the honest breakdown:
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:border-emerald-500/30 transition-colors">
                                            <h4 className="font-bold text-white mb-2">DaVinci Resolve</h4>
                                            <p className="text-sm text-slate-400">Powerful but built for Hollywood. Steep learning curve and requires a high-end laptop.</p>
                                        </div>
                                        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:border-emerald-500/30 transition-colors">
                                            <h4 className="font-bold text-white mb-2">Kdenlive & OpenShot</h4>
                                            <p className="text-sm text-slate-400">Open source and completely free but feel outdated. Lack AI features and modern templates.</p>
                                        </div>
                                    </div>
                                    <div className="bg-emerald-500/10 border border-emerald-500/20 p-8 rounded-3xl mb-8 group hover:bg-emerald-500/20 transition-all">
                                        <h4 className="text-emerald-400 font-bold text-xl mb-4">The Winner: Celoris</h4>
                                        <p className="text-slate-300 mb-6">
                                            Celoris is built specifically for Indian creators who need professional output fast. Free video editor, AI-powered tools, Canva-style templates and 20+ AI models — all in one platform.
                                        </p>
                                        <div className="flex items-center gap-4 flex-wrap text-sm font-bold text-emerald-500/80">
                                            <span className="flex items-center gap-1"><CheckCircle2 className="h-4 w-4" /> No Watermark</span>
                                            <span className="flex items-center gap-1"><CheckCircle2 className="h-4 w-4" /> No Download</span>
                                            <span className="flex items-center gap-1"><CheckCircle2 className="h-4 w-4" /> No Credit Card</span>
                                        </div>
                                    </div>
                                </section>

                                <section>
                                    <h3 className="text-2xl font-bold mb-6 text-white flex items-center gap-4">
                                        <span className="w-10 h-10 rounded-xl bg-slate-800 text-emerald-400 flex items-center justify-center font-black text-xl border border-white/5">2</span>
                                        Use AI to Do the Heavy Lifting
                                    </h3>
                                    <p className="text-lg leading-relaxed mb-8">
                                        The biggest shift in video creation in 2025 is AI. Tasks that used to take hours now take minutes.
                                        With AI tools inside Celoris you can:
                                    </p>
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none p-0">
                                        {[
                                            { icon: '🎙️', title: 'AI Voiceovers', desc: 'Type script, choose voice, done.' },
                                            { icon: '🖼️', title: 'AI Thumbnails', desc: 'Generate graphics in seconds.' },
                                            { icon: '✍️', title: 'Script Writing', desc: 'AI writes scripts in your style.' },
                                            { icon: '🎬', title: 'AI Visuals', desc: 'Generate B-roll instantly.' }
                                        ].map((item, i) => (
                                            <li key={i} className="bg-[#050810] p-6 rounded-2xl border border-white/5 flex gap-4">
                                                <span className="text-2xl">{item.icon}</span>
                                                <div>
                                                    <h5 className="font-bold text-white mb-1">{item.title}</h5>
                                                    <p className="text-xs text-slate-500">{item.desc}</p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </section>

                                <section>
                                    <h3 className="text-2xl font-bold mb-6 text-white flex items-center gap-4">
                                        <span className="w-10 h-10 rounded-xl bg-slate-800 text-emerald-400 flex items-center justify-center font-black text-xl border border-white/5">3</span>
                                        Follow This Simple Workflow
                                    </h3>
                                    <div className="space-y-4">
                                        {[
                                            { step: 'Plan', desc: 'Write your script using AI (2 minutes)' },
                                            { step: 'Record', desc: 'Even a phone camera works. Use good lighting.' },
                                            { step: 'Edit', desc: 'Import into Celoris. Cut, trim, add text.' },
                                            { step: 'Enhance', desc: 'Add AI voiceover or background music.' },
                                            { step: 'Export', desc: 'Download in HD. No watermark.' },
                                            { step: 'Publish', desc: 'Upload to Instagram, YouTube or LinkedIn.' }
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors group">
                                                <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-xs font-black shrink-0 border border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-black transition-all">
                                                    {i + 1}
                                                </div>
                                                <div>
                                                    <span className="font-bold text-white mr-2">{item.step}</span>
                                                    <span className="text-slate-400">— {item.desc}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="mt-8 text-emerald-400 font-bold bg-emerald-400/5 p-4 rounded-xl border border-emerald-400/10 text-center">
                                        Total time for a 60-second Reel — under 30 minutes!
                                    </p>
                                </section>

                                <section>
                                    <h3 className="text-2xl font-bold mb-6 text-white flex items-center gap-4">
                                        <span className="w-10 h-10 rounded-xl bg-slate-800 text-emerald-400 flex items-center justify-center font-black text-xl border border-white/5">4</span>
                                        Templates Are Your Best Friend
                                    </h3>
                                    <p className="text-lg leading-relaxed mb-6">
                                        Starting from a blank canvas is the biggest mistake new creators make. Templates give you professional structure instantly.
                                    </p>
                                    <p className="text-lg leading-relaxed mb-8">Celoris has Canva-style templates built specifically for:</p>
                                    <div className="flex flex-wrap gap-3">
                                        {['Instagram Reels', 'YouTube Thumbnails', 'LinkedIn Videos', 'WhatsApp Status', 'Educational Content'].map(tag => (
                                            <span key={tag} className="bg-white/5 px-4 py-2 rounded-lg text-sm font-medium border border-white/10">{tag}</span>
                                        ))}
                                    </div>
                                </section>
                            </div>

                            <div className="mt-24 pt-16 border-t border-white/10">
                                <h2 className="text-3xl font-bold mb-8 text-white tracking-tight">The Bottom Line</h2>
                                <p className="text-lg leading-relaxed mb-6 font-medium text-slate-200">
                                    You don't need Adobe. You don't need a MacBook. You don't need a ₹50,000 camera.
                                </p>
                                <p className="text-lg leading-relaxed mb-12">
                                    You need the right free tools and a consistent workflow. Indian creators are building massive audiences today with nothing more than a smartphone and Celoris. The expensive software was never the barrier — knowing the right workflow was.
                                </p>
                                <div className="text-center">
                                    <Button size="lg" className="bg-emerald-500 text-black hover:bg-emerald-400 font-bold px-12 py-8 rounded-[2rem] text-xl shadow-[0_0_40px_rgba(16,185,129,0.2)] hover:scale-105 transition-all" asChild>
                                        <a href="https://celoris.in">Start Free at Celoris.in 🇮🇳</a>
                                    </Button>
                                    <p className="mt-4 text-xs text-slate-500 uppercase tracking-widest font-bold">No credit card • No watermark • No excuses</p>
                                </div>
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="mt-12 pt-12 border-t border-white/10 flex flex-wrap gap-3">
                            <Tag className="h-4 w-4 text-emerald-500 mt-1" />
                            {['Video Editing', 'Free Tools', 'Indian Creators', 'AI Video', 'Content Strategy'].map((tag) => (
                                <span key={tag} className="bg-white/5 text-slate-400 px-4 py-1.5 rounded-full text-xs font-bold hover:bg-emerald-500/20 hover:text-emerald-400 transition-all cursor-default border border-white/5">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
