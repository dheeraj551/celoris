'use client';

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User, Clock, Tag } from "lucide-react";

export default function BlogPost() {
    return (
        <div className="min-h-screen bg-[#050810] text-slate-300">
            {/* Hero Section */}
            <div className="relative h-[500px] w-full overflow-hidden">
                {/* Background Image */}
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
                    style={{
                        backgroundImage: 'url("/blog-video-editor-india.png")'
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
                                Technology
                            </span>
                            <span className="text-slate-400 text-xs font-medium flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-full border border-white/5 backdrop-blur-sm">
                                <Clock className="h-3.5 w-3.5" /> 4 min read
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-8 leading-[1.1] tracking-tight text-white drop-shadow-2xl">
                            Best Free Video Editing and AI Tools for Indian Creators in 2025
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
                                <span className="text-sm">February 23, 2026</span>
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
                                If you're an Indian creator, student or small business owner looking for a free video editor in India — this list is for you.
                            </p>

                            {/* Infographic Image */}
                            <div className="my-16 rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl group cursor-zoom-in">
                                <img
                                    src="/blog-video-editor-infographic.png"
                                    alt="Best Free Video Editing and AI Tools for Indian Creators 2025 Infographic"
                                    className="w-full h-auto transition-transform duration-700 group-hover:scale-[1.02]"
                                />
                            </div>

                            <h2 className="text-3xl font-bold mt-16 mb-8 text-white tracking-tight">
                                The Problem Every Indian Creator Knows
                            </h2>
                            <p className="text-lg leading-relaxed mb-8">
                                You have the ideas. You have the content. But the tools? Adobe Premiere costs ₹3,500 per month. Final Cut Pro requires a Mac. DaVinci Resolve has a steep learning curve. And Canva's best features are locked behind a ₹4,000 yearly plan.
                            </p>
                            <p className="text-lg leading-relaxed mb-8">
                                For most Indian students and creators, these prices simply don't make sense. That's exactly why free alternatives have become the most searched topic in the Indian creator community in 2025.
                            </p>

                            <div className="space-y-16 mt-16">
                                <section>
                                    <h3 className="text-2xl font-bold mb-6 text-white flex items-center gap-4">
                                        <span className="w-10 h-10 rounded-xl bg-emerald-500 text-black flex items-center justify-center font-black text-xl">1</span>
                                        Celoris — Best All-in-One Free Video Editor India
                                    </h3>
                                    <p className="text-lg leading-relaxed mb-6">
                                        Celoris is quickly becoming the go-to free video editor for Indian creators — and for good reason. Built specifically for the Indian market, it combines a full video editor, image studio, and access to 20+ AI models including GPT, Claude, Gemini and Llama — all free to start.
                                    </p>
                                    <p className="text-lg leading-relaxed mb-8">
                                        What makes Celoris stand out is the sheer range of tools in one place. You can edit videos, create social media graphics, generate AI voiceovers, and even access daily freelance opportunities — without paying a single rupee upfront.
                                    </p>
                                    <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-2xl flex items-center justify-between mb-8 group hover:bg-emerald-500/20 transition-colors">
                                        <p className="font-bold text-emerald-400">👉 Professional creative tools at zero cost for students.</p>
                                        <a href="https://celoris.in" className="bg-emerald-500 text-black px-6 py-2 rounded-xl font-bold text-sm hover:scale-105 transition-transform">Try Free</a>
                                    </div>
                                </section>

                                <section>
                                    <h3 className="text-2xl font-bold mb-6 text-white flex items-center gap-4">
                                        <span className="w-10 h-10 rounded-xl bg-slate-800 text-emerald-400 flex items-center justify-center font-black text-xl">2</span>
                                        DaVinci Resolve — Best for Serious Video Editors
                                    </h3>
                                    <p className="text-lg leading-relaxed mb-8">
                                        DaVinci Resolve's free version is genuinely powerful — colour grading, multi-track editing, and audio tools that professionals use. The catch? It's heavy software, requires a decent computer, and has a steep learning curve for beginners. Not ideal for quick social media content.
                                    </p>
                                </section>

                                <section>
                                    <h3 className="text-2xl font-bold mb-6 text-white flex items-center gap-4">
                                        <span className="w-10 h-10 rounded-xl bg-slate-800 text-emerald-400 flex items-center justify-center font-black text-xl">3</span>
                                        CapCut Web — Best for Quick Reels
                                    </h3>
                                    <p className="text-lg leading-relaxed mb-8">
                                        CapCut became popular for fast Reel and Short editing. However, its availability in India has been inconsistent. If you're looking for a stable, India-based alternative with similar ease of use, Celoris's video studio is the closest replacement currently available.
                                    </p>
                                </section>

                                <section>
                                    <h3 className="text-2xl font-bold mb-6 text-white flex items-center gap-4">
                                        <span className="w-10 h-10 rounded-xl bg-slate-800 text-emerald-400 flex items-center justify-center font-black text-xl">4</span>
                                        Kdenlive — Best Free Open Source Editor
                                    </h3>
                                    <p className="text-lg leading-relaxed mb-8">
                                        Kdenlive is a solid open-source video editor for Windows and Linux users. It's completely free, has no watermark, and supports multi-track editing. However it lacks AI features and requires manual installation — not the smoothest experience for casual creators.
                                    </p>
                                </section>

                                <section>
                                    <h3 className="text-2xl font-bold mb-6 text-white flex items-center gap-4">
                                        <span className="w-10 h-10 rounded-xl bg-slate-800 text-emerald-400 flex items-center justify-center font-black text-xl">5</span>
                                        Clipchamp — Best for Windows Users
                                    </h3>
                                    <p className="text-lg leading-relaxed mb-8">
                                        Microsoft's Clipchamp is built into Windows 11 and offers basic editing, templates and stock footage. Good for beginners but limited in advanced features and AI capabilities.
                                    </p>
                                </section>
                            </div>

                            <div className="bg-gradient-to-br from-[#12182b] to-[#0a0f1d] p-8 md:p-12 rounded-[2rem] my-20 border border-white/10 shadow-inner">
                                <h3 className="text-2xl font-bold text-white mb-8 tracking-tight">
                                    Which Free Video Editor Should Indian Creators Use in 2025?
                                </h3>
                                <div className="overflow-x-auto -mx-8 px-8">
                                    <table className="w-full text-left border-collapse min-w-[600px]">
                                        <thead>
                                            <tr className="border-b border-white/10 text-slate-400 text-sm uppercase tracking-widest font-bold">
                                                <th className="py-4 pr-4">Tool</th>
                                                <th className="py-4 px-4">Free</th>
                                                <th className="py-4 px-4">AI Features</th>
                                                <th className="py-4 px-4">India Made</th>
                                                <th className="py-4 pl-4">Mobile</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-white font-medium">
                                            <tr className="border-b border-white/5 bg-emerald-500/5">
                                                <td className="py-6 pr-4 font-bold text-emerald-400">Celoris</td>
                                                <td className="py-6 px-4">✅</td>
                                                <td className="py-6 px-4">✅ 20+ Models</td>
                                                <td className="py-6 px-4">✅</td>
                                                <td className="py-6 pl-4">✅</td>
                                            </tr>
                                            <tr className="border-b border-white/5">
                                                <td className="py-6 pr-4">DaVinci</td>
                                                <td className="py-6 px-4">✅</td>
                                                <td className="py-6 px-4">❌</td>
                                                <td className="py-6 px-4">❌</td>
                                                <td className="py-6 pl-4">❌</td>
                                            </tr>
                                            <tr className="border-b border-white/5">
                                                <td className="py-6 pr-4">Kdenlive</td>
                                                <td className="py-6 px-4">✅</td>
                                                <td className="py-6 px-4">❌</td>
                                                <td className="py-6 px-4">❌</td>
                                                <td className="py-6 pl-4">❌</td>
                                            </tr>
                                            <tr>
                                                <td className="py-6 pr-4">Clipchamp</td>
                                                <td className="py-6 px-4">✅</td>
                                                <td className="py-6 px-4 text-slate-400">Limited</td>
                                                <td className="py-6 px-4">❌</td>
                                                <td className="py-6 pl-4">❌</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="mt-16 pt-16 border-t border-white/10">
                                <h2 className="text-3xl font-bold mb-8 text-white tracking-tight">Final Verdict</h2>
                                <p className="text-lg leading-relaxed mb-6 font-medium text-slate-200">
                                    For Indian creators who want a free video editor with AI capabilities, templates, and tools built for social media content — <span className="text-emerald-400">Celoris is the strongest option in 2025.</span>
                                </p>
                                <p className="text-lg leading-relaxed mb-12">
                                    It's the only platform that combines video editing, image design, AI models and freelance opportunities in one free platform made specifically for India. Whether you're a college student, a freelancer, or a small business owner — start at <a href="https://celoris.in" className="text-emerald-400 hover:underline font-bold">celoris.in</a>. It costs nothing to try.
                                </p>
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="mt-12 pt-12 border-t border-white/10 flex flex-wrap gap-3">
                            <Tag className="h-4 w-4 text-emerald-500 mt-1" />
                            {['Free Video Editor', 'Celoris', 'Indian Creators', 'AI Tools 2025', 'Content Creation'].map((tag) => (
                                <span key={tag} className="bg-white/5 text-slate-400 px-4 py-1.5 rounded-full text-xs font-bold hover:bg-emerald-500/20 hover:text-emerald-400 transition-all cursor-default border border-white/5 hover:border-emerald-500/30">
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
