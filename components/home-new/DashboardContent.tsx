"use client"

import React, { useState, useEffect } from 'react';
import {
    Video,
    Image as ImageIcon,
    ArrowRight,
    Search,
    PlayCircle,
    Sparkles,
    Star,
    Zap,
    X,
    Clock,
    BrainCircuit,
    Globe,
    Lock,
    ShieldCheck,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { YouTubeFeed } from './YouTubeFeed';
import { CommunityFeed } from './CommunityFeed';
import TestimonialsDisplay from "@/components/TestimonialsDisplay";
import { createClient } from "@/lib/supabase-client";

import { VideoStudioFeature } from './VideoStudioFeature';
import { ImageStudioFeature } from './ImageStudioFeature';
import { Celoris3DFeature } from './Celoris3DFeature';

function OnlineTrainersMarquee() {
    const [trainers, setTrainers] = useState<any[]>([]);

    useEffect(() => {
        let channel: any = null;
        try {
            const supabase = createClient();
            channel = supabase.channel('booth:online_trainers');

            const updatePresence = () => {
                const state = channel.presenceState();
                const presences = Object.values(state).flat() as any[];
                const uniqueTrainers = presences
                    .filter(Boolean)
                    .filter((v, i, a) => a.findIndex(t => t.user_id === v.user_id) === i);

                setTrainers(uniqueTrainers);
            };

            channel
                .on('presence', { event: 'sync' }, updatePresence)
                .on('presence', { event: 'join' }, updatePresence)
                .on('presence', { event: 'leave' }, updatePresence)
                .subscribe();
        } catch (err) {
            console.error('Failed to initialize OnlineTrainers Marquee:', err);
        }

        return () => {
            if (channel) channel.unsubscribe();
        };
    }, []);

    if (trainers.length === 0) return null;

    // Only duplicate and animate if we have enough trainers to justify a marquee (more than 5)
    // This fixed the issue where users saw duplicate experts when only a few were online
    const shouldAnimate = trainers.length > 5;
    const displayList = shouldAnimate ? [...trainers, ...trainers] : trainers;

    return (
        <div className={cn(
            "flex w-max gap-4 pointer-events-auto items-center",
            shouldAnimate && "animate-scrollList hover:[animation-play-state:paused]"
        )}>
            {displayList.map((trainer, idx) => (
                <Link key={idx} href="/learn" className="inline-flex items-center gap-3 bg-white/5 border border-white/5 rounded-full pr-5 pl-2 py-2 hover:bg-white/10 hover:border-emerald-500/30 transition-all cursor-pointer">
                    <div className="relative">
                        <div className="w-10 h-10 rounded-full border-[3px] border-[#0d0d0d] overflow-hidden bg-neutral-800 relative z-10 shadow-lg shadow-emerald-500/10">
                            <img src={trainer.avatar} alt={trainer.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#0d0d0d] z-20 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                    </div>
                    <div className="flex flex-col justify-center">
                        <span className="text-sm font-bold text-white leading-none mb-1 tracking-tight">{trainer.name.split(' ')[0]} {trainer.name.split(' ')[1]?.[0]}.</span>
                        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest leading-none">{trainer.role}</span>
                    </div>
                </Link>
            ))}
        </div>
    );
}

interface DashboardContentProps {
    courses?: any[];
    initialTestimonials?: any[];
}

export function DashboardContent({ courses, initialTestimonials = [] }: DashboardContentProps) {
    const [activeTab, setActiveTab] = useState<'video' | 'image'>('video');

    return (
        <div className="py-16 px-8 max-w-6xl mx-auto">
            {/* Hero Title */}
            <div className="text-center mb-16 pt-10 relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-12 w-[600px] h-[300px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none opacity-50" />

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-4xl md:text-6xl font-medium tracking-tight text-white mb-6"
                >
                    India's Free Creative <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]">Studio</span>
                </motion.h1>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="max-w-3xl mx-auto mt-8 relative"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-cyan-500/20 to-emerald-500/20 blur-2xl rounded-full opacity-50" />
                    <div className="relative bg-[#111111]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-[0_0_40px_rgba(16,185,129,0.1)] hover:border-emerald-500/30 transition-colors duration-500">
                        <div className="flex flex-col items-center justify-center">
                            <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-3">
                                Simple, Transparent &amp; Honest
                            </h3>
                            
                            <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-8 max-w-xl mx-auto">
                                No hidden charges. No surprise calls from "counsellors."
                            </p>
                            
                            <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-x-6 gap-y-3 w-full border-t border-white/5 pt-6">
                                {[
                                    'India-based team',
                                    'Free softwares',
                                    'Free Education',
                                    'Free Job Portal'
                                ].map((text, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                                            <svg className="w-3 h-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                        </div>
                                        <span className="text-sm font-medium text-slate-300">{text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Learn Promotion Banner Section */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="max-w-5xl mx-auto mb-10"
            >
                <div className="relative overflow-hidden rounded-[2rem] border border-white/8 bg-[#0a0a0a] shadow-[0_0_80px_rgba(16,185,129,0.08)]">
                    {/* Background glow effects */}
                    <div className="absolute top-0 right-1/3 w-[500px] h-[300px] bg-emerald-500/8 rounded-full blur-[120px] pointer-events-none" />
                    <div className="absolute bottom-0 left-1/4 w-[400px] h-[250px] bg-cyan-500/6 rounded-full blur-[100px] pointer-events-none" />
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_70%_50%,rgba(16,185,129,0.04)_0%,transparent_60%)] pointer-events-none" />

                    {/* Dot grid */}
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

                    <div className="relative z-10 p-8 md:p-12">
                        {/* Main Content Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                            {/* Left Content */}
                            <div className="flex flex-col gap-6">
                                <div>
                                    <h2 className="text-4xl md:text-5xl font-black text-white leading-[1.1] tracking-tight mb-2">
                                        Learn. Create.
                                    </h2>
                                    <h2 className="text-4xl md:text-5xl font-black leading-[1.1] tracking-tight bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                                        Succeed.
                                    </h2>
                                </div>

                                <p className="text-slate-400 text-sm leading-relaxed max-w-md">
                                    Unlock your potential with expert-led courses in AI, Design, Video Editing, and Digital Marketing. Join the <span className="text-emerald-400 font-semibold">creative revolution</span> today.
                                </p>

                                {/* CTA Buttons */}
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <Link
                                        href="/learn"
                                        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-black text-sm transition-all shadow-[0_0_20px_rgba(16,185,129,0.35)] hover:shadow-[0_0_30px_rgba(16,185,129,0.55)] group"
                                    >
                                        <PlayCircle className="w-4 h-4 text-black" />
                                        Start Learning Now
                                    </Link>
                                    <Link
                                        href="/teach"
                                        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-white/10 bg-white/4 text-white font-semibold text-sm hover:border-emerald-500/40 hover:bg-emerald-500/8 transition-all"
                                    >
                                        <Star className="w-4 h-4 text-emerald-400" />
                                        Become an Instructor
                                    </Link>
                                </div>
                            </div>

                            {/* Right: Hero Image */}
                            <div className="relative h-[280px] md:h-[340px] hidden lg:block">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.8 }}
                                    className="absolute inset-0 rounded-2xl overflow-hidden border border-white/8 shadow-2xl"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-cyan-500/20 mix-blend-overlay z-10" />
                                    <img
                                        src="/teach.jpg"
                                        alt="Learning platform"
                                        className="w-full h-full object-cover object-center"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/80 via-[#0a0a0a]/20 to-transparent z-20" />
                                    <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-[#0a0a0a]/60 z-20" />
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Hero Banner Section */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="max-w-5xl mx-auto mb-20"
            >
                <div className="relative overflow-hidden rounded-[2rem] border border-white/8 bg-[#0a0a0a] shadow-[0_0_80px_rgba(16,185,129,0.08)]">
                    {/* Background glow effects */}
                    <div className="absolute top-0 right-1/3 w-[500px] h-[300px] bg-emerald-500/8 rounded-full blur-[120px] pointer-events-none" />
                    <div className="absolute bottom-0 left-1/4 w-[400px] h-[250px] bg-cyan-500/6 rounded-full blur-[100px] pointer-events-none" />
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_70%_50%,rgba(16,185,129,0.04)_0%,transparent_60%)] pointer-events-none" />

                    {/* Dot grid */}
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

                    <div className="relative z-10 p-8 md:p-12">
                        {/* Top Label */}
                        <div className="flex justify-center mb-8">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/8 text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em]">
                                <Sparkles className="w-3 h-3" />
                                Digital Solutions That Drive Real Growth
                                <Sparkles className="w-3 h-3" />
                            </div>
                        </div>

                        {/* Main Content Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                            {/* Left Content */}
                            <div className="flex flex-col gap-6">
                                <div>
                                    <h2 className="text-4xl md:text-5xl font-black text-white leading-[1.1] tracking-tight mb-2">
                                        We Build. We Market.
                                    </h2>
                                    <h2 className="text-4xl md:text-5xl font-black leading-[1.1] tracking-tight bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                                        You Grow.
                                    </h2>
                                </div>

                                <p className="text-slate-400 text-sm leading-relaxed max-w-md">
                                    Your one-stop partner for Website Development, Mobile Apps, Digital Marketing,{' '}
                                    <span className="text-emerald-400 font-semibold">AI Solutions</span> &amp; Corporate Training.
                                </p>

                                {/* Service Icons */}
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { icon: Globe, label: 'Web Dev' },
                                        { icon: PlayCircle, label: 'Mobile Apps' },
                                        { icon: Zap, label: 'Digital Mktg' },
                                        { icon: BrainCircuit, label: 'AI Solutions' },
                                        { icon: Star, label: 'Training' },
                                        { icon: Sparkles, label: 'Creative' },
                                    ].map(({ icon: Icon, label }, i) => (
                                        <div key={i} className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white/3 border border-white/6 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all cursor-pointer group">
                                            <Icon className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 transition-colors" />
                                            <span className="text-[9px] text-slate-500 group-hover:text-emerald-400 font-bold uppercase tracking-wider transition-colors text-center">{label}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* CTA Buttons */}
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <a
                                        href="https://wa.me/919084718101"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#25D366] hover:bg-[#20bc5a] text-black font-black text-sm transition-all shadow-[0_0_20px_rgba(37,211,102,0.35)] hover:shadow-[0_0_30px_rgba(37,211,102,0.55)] group"
                                    >
                                        <svg className="w-4 h-4 fill-black" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                                        WhatsApp Us
                                    </a>
                                    <Link
                                        href="/contact"
                                        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-white/10 bg-white/4 text-white font-semibold text-sm hover:border-emerald-500/40 hover:bg-emerald-500/8 transition-all"
                                    >
                                        <Video className="w-4 h-4 text-emerald-400" />
                                        Book Free Consultation
                                    </Link>
                                </div>
                            </div>

                            {/* Right: Hero Image + Floating Stats */}
                            <div className="relative h-[340px] md:h-[400px] hidden lg:block">
                                {/* Main photo */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.8 }}
                                    className="absolute inset-0 rounded-2xl overflow-hidden border border-white/8 shadow-2xl"
                                >
                                    <img
                                        src="/any.jpg"
                                        alt="Creative professional at work"
                                        className="w-full h-full object-cover object-center"
                                    />
                                    {/* Dark gradient overlay so cards pop */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/80 via-[#0a0a0a]/20 to-transparent" />
                                    <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-[#0a0a0a]/60" />
                                </motion.div>

                                {/* Top-right stat: SEO */}
                                <motion.div
                                    initial={{ opacity: 0, y: -12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.4 }}
                                    className="absolute top-4 right-4 px-4 py-3 rounded-xl bg-[#111111]/90 backdrop-blur-xl border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.15)]"
                                >
                                    <div className="text-[8px] text-slate-500 uppercase tracking-widest mb-1">SEO Performance</div>
                                    <div className="text-2xl font-black text-emerald-400">+187%</div>
                                    <div className="text-[8px] text-slate-500">Organic Traffic</div>
                                </motion.div>

                                {/* Top-left: Website Dev card */}
                                <motion.div
                                    initial={{ opacity: 0, x: -12 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.6, delay: 0.5 }}
                                    className="absolute top-4 left-4 w-[160px] rounded-xl bg-[#111111]/90 backdrop-blur-xl border border-cyan-500/20 overflow-hidden shadow-[0_0_20px_rgba(6,182,212,0.1)]"
                                >
                                    <div className="bg-[#0d0d0d] border-b border-white/5 px-3 py-1.5 flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                        <span className="text-[7px] text-slate-400 font-mono tracking-widest">WEBSITE DEV</span>
                                    </div>
                                    <div className="p-2.5 flex flex-col gap-1.5">
                                        {[85, 62, 91].map((val, i) => (
                                            <div key={i} className="flex items-center gap-1.5">
                                                <div className="text-[7px] text-slate-500 w-10 shrink-0">{['Traffic', 'Leads', 'Conv.'][i]}</div>
                                                <div className="flex-1 h-1 rounded-full bg-white/5">
                                                    <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500" style={{ width: `${val}%` }} />
                                                </div>
                                                <span className="text-[7px] text-emerald-400 font-bold">{val}%</span>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>

                                {/* Bottom-left: AI Assistant */}
                                <motion.div
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.6 }}
                                    className="absolute bottom-4 left-4 px-4 py-3 rounded-xl bg-[#111111]/90 backdrop-blur-xl border border-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.1)]"
                                >
                                    <div className="flex items-center gap-2 mb-1">
                                        <BrainCircuit className="w-3 h-3 text-indigo-400" />
                                        <span className="text-[8px] text-indigo-400 font-bold uppercase tracking-widest">AI Assistant</span>
                                    </div>
                                    <div className="text-[9px] text-slate-400">"How can I help you<br />grow your business?"</div>
                                </motion.div>

                                {/* Bottom-right: App rating */}
                                <motion.div
                                    initial={{ opacity: 0, x: 12 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.6, delay: 0.7 }}
                                    className="absolute bottom-4 right-4 px-4 py-3 rounded-xl bg-[#111111]/90 backdrop-blur-xl border border-violet-500/20 shadow-[0_0_20px_rgba(139,92,246,0.1)]"
                                >
                                    <div className="text-[8px] text-slate-500 uppercase tracking-widest mb-1">Mobile App</div>
                                    <div className="text-xl font-black text-violet-400">4.9★</div>
                                    <div className="text-[8px] text-slate-500">App Store Rating</div>
                                </motion.div>
                            </div>
                        </div>

                        {/* Bottom Stats Row */}
                        <div className="mt-10 pt-8 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-6">
                            {[
                                { icon: Star, value: '500+', label: 'Projects Delivered', color: 'text-amber-400' },
                                { icon: BrainCircuit, value: 'AI-Powered', label: 'Solutions for Smarter Growth', color: 'text-emerald-400' },
                                { icon: Zap, value: 'SEO & Marketing', label: 'Experts Delivering Real Results', color: 'text-cyan-400' },
                                { icon: Globe, value: 'India Based', label: 'Serving Clients Globally', color: 'text-indigo-400' },
                            ].map(({ icon: Icon, value, label, color }, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <div className={`mt-0.5 p-2 rounded-lg bg-white/4 border border-white/6`}>
                                        <Icon className={`w-4 h-4 ${color}`} />
                                    </div>
                                    <div>
                                        <div className={`text-sm font-black ${color}`}>{value}</div>
                                        <div className="text-[10px] text-slate-500 leading-tight">{label}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Feature Sections */}
            <div className="w-full flex flex-col gap-12 items-center mb-24">
                <div className="w-full">
                    <VideoStudioFeature />
                </div>
                <div className="flex flex-col lg:flex-row gap-8 w-full max-w-[1200px] items-stretch justify-center px-4">
                    <div className="flex-1 w-full flex justify-center">
                        <ImageStudioFeature />
                    </div>
                    <div className="flex-1 w-full flex justify-center">
                        <Celoris3DFeature />
                    </div>
                </div>
            </div>

            {/* YouTube Feed Layout */}
            <YouTubeFeed />

            {/* Community Feed Section */}
            <CommunityFeed />
            
            {/* Testimonials Section */}
            <section className="relative w-full rounded-[2.5rem] bg-[#0a0a0a] border border-emerald-900/30 overflow-hidden shadow-[0_0_100px_rgba(16,185,129,0.05)] p-8 md:p-12 mt-16 mb-16">
              {/* Background Dot Grid */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(circle,rgba(16,185,129,0.15)_2px,transparent_2px)] [background-size:24px_24px] opacity-60 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-[radial-gradient(circle,rgba(16,185,129,0.15)_2px,transparent_2px)] [background-size:24px_24px] opacity-60 pointer-events-none" />
              
              {/* Glowing Orbs */}
              <div className="absolute top-10 right-10 w-64 h-64 bg-emerald-600/10 rounded-full blur-[80px] pointer-events-none" />
              <div className="absolute bottom-10 left-10 w-64 h-64 bg-cyan-600/10 rounded-full blur-[80px] pointer-events-none" />
              
              <div className="relative z-10">
                <div className="text-center mb-16">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[8px] font-black uppercase tracking-widest mb-6">
                    <ShieldCheck size={10} /> Verified Pulse
                  </div>
                  <h2 className="text-2xl md:text-5xl font-black text-white italic uppercase tracking-tighter mb-4">Customer Feedback</h2>
                  <p className="text-slate-500 font-black uppercase tracking-widest text-[8px] italic">
                    Direct transmissions from our synchronized node network.
                  </p>
                </div>

                <TestimonialsDisplay
                  type="all"
                  page="all"
                  limit={3}
                  layout="grid"
                  showFeatured={false}
                  showImages={true}
                  className="mb-4"
                  initialTestimonials={initialTestimonials}
                />
              </div>
            </section>

            <style jsx global>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                    height: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
                @keyframes scrollList {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-scrollList {
                    animation: scrollList 30s linear infinite;
                }
            `}</style>


        </div >
    );
}
