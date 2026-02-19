"use client"

import React, { useState } from 'react';
import {
    Video,
    Image as ImageIcon,
    Plus,
    AtSign,
    MapPin,
    Layout,
    Languages,
    Calendar,
    ArrowRight,
    Search,
    ChevronRight,
    TrendingUp,
    Camera,
    PlayCircle,
    ShoppingBag,
    Star,
    Sparkles,
    Zap
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface DashboardContentProps {
    courses?: any[];
}

export function DashboardContent({ courses }: DashboardContentProps) {
    const [activeTab, setActiveTab] = useState<'video' | 'image'>('video');

    return (
        <div className="py-16 px-8 max-w-6xl mx-auto">
            {/* Hero Title */}
            {/* Hero Title */}
            <div className="text-center mb-12">
                <Badge variant="outline" className="mb-4 border-emerald-500/20 text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full text-[10px] uppercase font-black tracking-widest">
                    <Sparkles className="w-3 h-3 mr-2" />
                    The latest Celoris model is live now
                </Badge>
                <h1 className="text-5xl font-bold tracking-tight text-white mb-4 italic uppercase">
                    Hi, what will we create today?
                </h1>
            </div>

            {/* Central AI Input Box */}
            <div className="max-w-3xl mx-auto mb-20">
                <div className="relative">
                    {/* Tabs */}
                    <div className="flex justify-center mb-0 relative z-10 -translate-y-1/2">
                        <div className="bg-[#0d1321]/80 backdrop-blur-md p-1.5 rounded-2xl flex gap-1 border border-white/5">
                            <button
                                onClick={() => setActiveTab('video')}
                                className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'video' ? 'bg-white/10 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                            >
                                <Video className={`w-4 h-4 ${activeTab === 'video' ? 'text-emerald-400' : ''}`} />
                                Video
                            </button>
                            <button
                                onClick={() => setActiveTab('image')}
                                className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'image' ? 'bg-white/10 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                            >
                                <ImageIcon className={`w-4 h-4 ${activeTab === 'image' ? 'text-emerald-400' : ''}`} />
                                Image
                            </button>
                        </div>
                    </div>

                    {/* Input Box */}
                    <div className="bg-[#0d1321]/60 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] shadow-none p-6 pt-10">
                        <textarea
                            className="w-full h-32 bg-transparent text-lg text-white placeholder:text-slate-600 resize-none focus:outline-none px-4"
                            placeholder="Tell me what you want. Add links, media, or docs to generate more precise results."
                        />

                        <div className="flex items-center justify-between mt-6 px-2">
                            <div className="flex items-center gap-2">
                                <button className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-white/10 transition-colors border border-white/5">
                                    <Plus className="w-4 h-4" />
                                </button>
                                <div className="h-6 w-px bg-white/5 mx-1" />
                                <button className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-white/10 border border-white/5"><AtSign className="w-4 h-4" /></button>
                                <button className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-white/10 border border-white/5"><MapPin className="w-4 h-4" /></button>

                                <div className="flex items-center bg-white/5 border border-white/5 rounded-full px-4 py-2 gap-2 ml-2">
                                    <div className="w-4 h-4 bg-emerald-600 rounded flex items-center justify-center shadow-[0_0_10px_rgba(16,185,129,0.4)]">
                                        <Zap className="w-2.5 h-2.5 text-white" />
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tight">Celoris Standard</span>
                                </div>

                                <div className="flex items-center bg-white/5 border border-white/5 rounded-full px-4 py-2 gap-2">
                                    <Layout className="w-3 h-3 text-slate-500" />
                                    <span className="text-[10px] font-bold uppercase tracking-tight text-slate-300">9:16 EN</span>
                                </div>

                                <button className="flex items-center bg-white/5 border border-white/5 rounded-full px-4 py-2 gap-2 text-slate-500 hover:text-slate-300 transition-colors">
                                    <Calendar className="w-3 h-3" />
                                    <span className="text-[10px] font-bold uppercase tracking-tight">Schedule</span>
                                </button>
                            </div>

                            <button className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-slate-700 cursor-not-allowed border border-white/5">
                                <ArrowRight className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    {/* Prompt Suggestions */}
                    <div className="flex justify-center gap-8 mt-8 text-xs font-bold text-slate-500 italic uppercase tracking-wider">
                        <button className="hover:text-emerald-400 transition-colors">Wool-felt winter village ↗</button>
                        <button className="hover:text-emerald-400 transition-colors">Snowfall around you ↗</button>
                        <button className="hover:text-emerald-400 transition-colors">Black Friday promotional videos ↗</button>
                    </div>
                </div>
            </div>

            {/* Popular Features Section */}
            <div className="mb-20">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-bold text-white italic uppercase tracking-tight">Popular features</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 overflow-x-auto pb-4 no-scrollbar">
                    {[
                        { title: "AI talking photo", icon: Camera, color: "bg-amber-500/10", iconColor: "text-amber-500" },
                        { title: "Avatar video", icon: PlayCircle, color: "bg-blue-500/10", iconColor: "text-blue-500" },
                        { title: "Product photo", icon: ShoppingBag, color: "bg-green-500/10", iconColor: "text-green-500" },
                        { title: "Vibe marketing", icon: TrendingUp, color: "bg-purple-500/10", iconColor: "text-purple-500", beta: true },
                        { title: "Product showcase", icon: Star, color: "bg-orange-500/10", iconColor: "text-orange-500" },
                    ].map((feature, i) => (
                        <button key={i} className="flex-shrink-0 bg-white/5 border border-white/5 p-4 rounded-2xl hover:shadow-2xl hover:shadow-emerald-500/10 hover:border-emerald-500/30 transition-all text-left flex items-center gap-4 group">
                            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform", feature.color)}>
                                <feature.icon className={cn("w-6 h-6", feature.iconColor)} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-xs font-bold text-white truncate italic uppercase">{feature.title}</h3>
                                    {feature.beta && <span className="bg-emerald-600 text-white text-[8px] px-1 rounded">Beta</span>}
                                </div>
                                <p className="text-[10px] text-slate-500 font-bold group-hover:text-emerald-400 italic">Try it now ↗</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Feed Section */}
            <div>
                <div className="flex items-center gap-8 border-b border-white/5 mb-8">
                    <button className="pb-4 border-b-2 border-emerald-500 text-white text-sm font-bold uppercase italic">Trending on Academy</button>
                    <button className="pb-4 text-sm font-bold text-slate-500 hover:text-white uppercase italic">Image inspiration</button>
                    <div className="ml-auto">
                        <button className="text-[11px] font-bold text-emerald-500 border border-emerald-500/20 px-4 py-1.5 rounded-full hover:bg-emerald-500/10 transition-colors uppercase italic">More inspirations</button>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {(courses || [1, 2, 3, 4, 5, 6]).map((item: any, i) => (
                        <div key={i} className="aspect-[3/4] bg-white/5 rounded-2xl overflow-hidden relative group cursor-pointer border border-white/5 shadow-none hover:shadow-2xl hover:shadow-emerald-500/10 transition-all">
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex flex-col justify-end p-3">
                                <p className="text-[10px] text-white font-bold mb-1 truncate">{item.title || "AI Generated Marvel"}</p>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-full bg-white/20" />
                                    <span className="text-[8px] text-white font-medium">User #854</span>
                                </div>
                            </div>
                            <img
                                src={`https://images.unsplash.com/photo-${1600000000000 + (i * 100000)}?w=400&h=600&fit=crop`}
                                className="w-full h-full object-cover"
                                alt="sample"
                            />
                            <div className="absolute top-2 left-2 z-20">
                                <span className="bg-black/50 backdrop-blur-md text-white text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-full flex items-center gap-1">
                                    <Video className="w-2 h-2" /> AI Video
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>


            <style jsx global>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div >
    );
}
