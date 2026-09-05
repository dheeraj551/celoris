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
    Coffee,
    Users,
    Briefcase,
    Flame,
    Tv,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import TestimonialsDisplay from "@/components/TestimonialsDisplay";
import { createClient } from "@/lib/supabase-client";

import { VideoStudioFeature } from './VideoStudioFeature';
import { ImageStudioFeature } from './ImageStudioFeature';
import { Celoris3DFeature } from './Celoris3DFeature';

// Pixel fireworks that burst around the hero heading, plus the user's own
// pixel-art city image used as a skyline banner beneath it.
const FIREWORKS: { left: string; top: string; colors: string[]; delay: number; size?: number }[] = [
    { left: '4%', top: '-18%', colors: ['#fde047', '#fb923c'], delay: 0, size: 1.1 },
    { left: '24%', top: '78%', colors: ['#f472b6', '#e879f9'], delay: 1.7, size: 0.85 },
    { left: '50%', top: '-24%', colors: ['#34d399', '#22d3ee'], delay: 3.2, size: 1.2 },
    { left: '76%', top: '72%', colors: ['#60a5fa', '#818cf8'], delay: 0.9, size: 0.9 },
    { left: '96%', top: '-12%', colors: ['#fbbf24', '#fb7185'], delay: 2.4, size: 1 },
];

// A small glowing burst — a bright flash at the center, particles that
// streak outward in alternating colors with a neon glow, then drift down
// slightly and fade, like a proper firework rather than a plain dot ring.
function PixelFirework({ left, top, colors, delay, size = 1 }: { left: string; top: string; colors: string[]; delay: number; size?: number }) {
    const particles = 14;
    const duration = 1.5;
    const repeatDelay = 3.0;

    return (
        <div className="absolute" style={{ left, top }}>
            {/* center flash */}
            <motion.div
                className="absolute rounded-full"
                style={{
                    width: 7 * size,
                    height: 7 * size,
                    left: -3.5 * size,
                    top: -3.5 * size,
                    backgroundColor: '#fff',
                    boxShadow: `0 0 14px 5px ${colors[0]}`,
                }}
                animate={{ scale: [0, 2.4, 0], opacity: [0, 1, 0] }}
                transition={{ duration: duration * 0.5, repeat: Infinity, repeatDelay: repeatDelay + duration * 0.5, delay, ease: 'easeOut' }}
            />

            {Array.from({ length: particles }).map((_, i) => {
                const angle = (i / particles) * Math.PI * 2 + (i % 2 === 0 ? 0.12 : -0.12);
                const dist = (15 + (i % 3) * 7) * size;
                const color = colors[i % colors.length];
                const particleSize = (i % 3 === 0 ? 3 : 2) * size;
                return (
                    <motion.span
                        key={i}
                        className="absolute rounded-full"
                        style={{
                            width: particleSize,
                            height: particleSize,
                            backgroundColor: color,
                            boxShadow: `0 0 6px 1.5px ${color}`,
                        }}
                        animate={{
                            x: [0, Math.cos(angle) * dist * 0.55, Math.cos(angle) * dist],
                            y: [0, Math.sin(angle) * dist * 0.55, Math.sin(angle) * dist + 8 * size],
                            opacity: [0, 1, 0],
                            scale: [0.3, 1, 0.4],
                        }}
                        transition={{ duration, repeat: Infinity, repeatDelay, delay, ease: 'easeOut' }}
                    />
                );
            })}
        </div>
    );
}

// Overlay of firework bursts positioned over the hero heading text.
function HeadingFireworks() {
    return (
        <div className="absolute inset-0 pointer-events-none select-none z-20">
            {FIREWORKS.map((fw, i) => (
                <PixelFirework key={i} {...fw} />
            ))}
        </div>
    );
}

// The user's own pixel-art city image, shown as a skyline banner between the
// hero heading and the "Simple, Transparent & Honest" panel.
function CityBanner() {
    return (
        <div className="relative w-full max-w-3xl mx-auto mt-6 h-[238px] overflow-hidden rounded-xl pointer-events-none select-none">
            <img
                src="/india2.png"
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
                draggable={false}
            />
            {/* fade the skyline's bottom edge down into the panel below so there's no hard gap */}
            <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-b from-transparent to-[#0a0a0a]" />
        </div>
    );
}

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

                <div className="relative inline-block">
                    <HeadingFireworks />
                    <motion.h1
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: {},
                            visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
                        }}
                        className="text-4xl md:text-6xl font-medium tracking-tight text-white mb-6"
                    >
                        {["India's", "Free", "Creative"].map((word, i) => (
                            <motion.span
                                key={i}
                                variants={{
                                    hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
                                    visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: "easeOut" } }
                                }}
                                className="inline-block mr-[0.22em]"
                            >
                                {word}
                            </motion.span>
                        ))}
                        <motion.span
                            variants={{
                                hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
                                visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: "easeOut" } }
                            }}
                            className="inline-block home-shimmer-text drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]"
                        >
                            Studio
                        </motion.span>
                    </motion.h1>
                </div>

                <CityBanner />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="max-w-3xl mx-auto -mt-8 relative z-10"
                >
                    <div className="home-rgb-border" style={{ '--rgb-radius': '1.5rem' } as React.CSSProperties}>
                        <div className="home-rgb-border-ring">
                            <div className="relative bg-[#111111]/90 backdrop-blur-xl p-6 md:p-8" style={{ borderRadius: 'calc(1.5rem - 2px)' }}>
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
                <div className="home-rgb-border" style={{ '--rgb-radius': '2rem' } as React.CSSProperties}>
                <div className="home-rgb-border-ring">
                <div className="relative overflow-hidden bg-[#0a0a0a] shadow-[0_0_80px_rgba(16,185,129,0.08)]" style={{ borderRadius: 'calc(2rem - 2px)' }}>
                    {/* Background glow effects */}
                    <div className="absolute top-0 right-1/3 w-[500px] h-[300px] bg-emerald-500/8 rounded-full blur-[120px] pointer-events-none" />
                    <div className="absolute bottom-0 left-1/4 w-[400px] h-[250px] bg-cyan-500/6 rounded-full blur-[100px] pointer-events-none" />
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_70%_50%,rgba(16,185,129,0.04)_0%,transparent_60%)] pointer-events-none" />

                    {/* Dot grid */}
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

                    <div className="relative z-10 p-8 md:p-12">
                        {/* Main Content Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-10 items-center">
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
                                    animate={{
                                        opacity: 1,
                                        scale: 1,
                                        x: [0, -2, 2, -1.5, 1.5, -1, 1, 0],
                                        y: [0, 1.5, -1.5, 2, -1, 1, -0.5, 0],
                                        rotate: [0, -0.4, 0.4, -0.3, 0.3, -0.2, 0.2, 0],
                                    }}
                                    transition={{
                                        opacity: { duration: 0.8 },
                                        scale: { duration: 0.8 },
                                        x: { duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 },
                                        y: { duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: 0.8 },
                                        rotate: { duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 0.8 },
                                    }}
                                    className="absolute inset-0 rounded-2xl overflow-hidden border border-white/8 shadow-2xl"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-cyan-500/20 mix-blend-overlay z-10" />
                                    <img
                                        src="/master.png"
                                        alt="Learning platform"
                                        className="w-full h-full object-cover object-center"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/80 via-[#0a0a0a]/20 to-transparent z-20" />
                                    <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-[#0a0a0a]/60 z-20" />
                                </motion.div>
                            </div>
                        </div>

                        {/* Upcoming Batch Notification — floating badge, kept inside this
                            div's own bounds/rounded corners so it never crosses the card border */}
                        <Link
                            href="/learn/course/master-copilot-excel"
                            className="absolute bottom-6 left-6 md:left-10 z-30 group/batch-badge"
                        >
                            <motion.div
                                animate={{ y: [0, -6, 0] }}
                                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                                className="relative flex items-center gap-2.5 pl-2 pr-4 py-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 shadow-[0_4px_24px_rgba(245,158,11,0.5)] group-hover/batch-badge:shadow-[0_4px_32px_rgba(245,158,11,0.75)] transition-shadow"
                            >
                                <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                                    <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500 items-center justify-center text-[8px] font-black text-white">!</span>
                                </span>
                                <div className="w-7 h-7 rounded-full bg-black/15 flex items-center justify-center flex-shrink-0">
                                    <Flame className="w-4 h-4 text-white" />
                                </div>
                                <div className="leading-tight">
                                    <p className="text-[9px] font-black text-black/60 uppercase tracking-widest">New Batch Alert</p>
                                    <p className="text-xs font-black text-black">Master Copilot in Excel — Starting Soon</p>
                                </div>
                            </motion.div>
                        </Link>
                    </div>
                </div>
                </div>
                </div>
            </motion.div>

            {/* Celoris TV Promotion Banner Section */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="max-w-5xl mx-auto mb-10"
            >
                <div className="home-rgb-border" style={{ '--rgb-radius': '2rem' } as React.CSSProperties}>
                <div className="home-rgb-border-ring">
                <div className="relative overflow-hidden bg-[#0a0a0a] shadow-[0_0_80px_rgba(239,68,68,0.08)]" style={{ borderRadius: 'calc(2rem - 2px)' }}>
                    {/* Background glow effects */}
                    <div className="absolute top-0 right-1/3 w-[500px] h-[300px] bg-red-500/8 rounded-full blur-[120px] pointer-events-none" />
                    <div className="absolute bottom-0 left-1/4 w-[400px] h-[250px] bg-orange-500/6 rounded-full blur-[100px] pointer-events-none" />
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_70%_50%,rgba(239,68,68,0.04)_0%,transparent_60%)] pointer-events-none" />

                    {/* Dot grid */}
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

                    <div className="relative z-10 p-8 md:p-12">
                        {/* Main Content Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
                            {/* Left Content */}
                            <div className="flex flex-col gap-6">
                                <div>
                                    <h2 className="text-4xl md:text-5xl font-black text-white leading-[1.1] tracking-tight mb-2">
                                        Watch. Learn.
                                    </h2>
                                    <h2 className="text-4xl md:text-5xl font-black leading-[1.1] tracking-tight bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                                        Stay Ahead.
                                    </h2>
                                </div>

                                <p className="text-slate-400 text-sm leading-relaxed max-w-md">
                                    Celoris TV is your free streaming channel for tutorials, live classes, and creator stories — no subscriptions, no downloads. Just <span className="text-red-400 font-semibold">press play</span> and start watching.
                                </p>

                                {/* CTA Buttons */}
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <Link
                                        href="/celoris-tv"
                                        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-black text-sm transition-all shadow-[0_0_20px_rgba(16,185,129,0.35)] hover:shadow-[0_0_30px_rgba(16,185,129,0.55)] group"
                                    >
                                        <PlayCircle className="w-4 h-4 text-black" />
                                        Watch Celoris TV
                                    </Link>
                                    <Link
                                        href="/celoris-tv"
                                        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-white/10 bg-white/4 text-white font-semibold text-sm hover:border-red-500/40 hover:bg-red-500/8 transition-all"
                                    >
                                        <Tv className="w-4 h-4 text-red-400" />
                                        Browse Channels
                                    </Link>
                                </div>
                            </div>

                            {/* Right: Celoris TV feature image */}
                            <div className="relative h-[280px] md:h-[340px] hidden lg:block">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{
                                        opacity: 1,
                                        scale: 1,
                                        x: [0, -2, 2, -1.5, 1.5, -1, 1, 0],
                                        y: [0, 1.5, -1.5, 2, -1, 1, -0.5, 0],
                                        rotate: [0, -0.4, 0.4, -0.3, 0.3, -0.2, 0.2, 0],
                                    }}
                                    transition={{
                                        opacity: { duration: 0.8 },
                                        scale: { duration: 0.8 },
                                        x: { duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 },
                                        y: { duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: 0.8 },
                                        rotate: { duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 0.8 },
                                    }}
                                    className="absolute inset-0 rounded-2xl overflow-hidden border border-white/8 shadow-2xl"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-tr from-red-500/20 to-orange-500/20 mix-blend-overlay z-10" />
                                    <img
                                        src="/Celoristv.png"
                                        alt="Celoris TV"
                                        className="w-full h-full object-cover object-center"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/80 via-[#0a0a0a]/20 to-transparent z-20" />
                                    <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-[#0a0a0a]/60 z-20" />
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>
                </div>
                </div>
            </motion.div>

            {/* Cafe Promotion Banner Section */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="max-w-5xl mx-auto mb-10"
            >
                <div className="home-rgb-border" style={{ '--rgb-radius': '2rem' } as React.CSSProperties}>
                <div className="home-rgb-border-ring">
                <div className="relative overflow-hidden bg-[#0a0a0a] shadow-[0_0_80px_rgba(244,63,94,0.08)]" style={{ borderRadius: 'calc(2rem - 2px)' }}>
                    {/* Background glow effects */}
                    <div className="absolute top-0 left-1/3 w-[500px] h-[300px] bg-rose-500/8 rounded-full blur-[120px] pointer-events-none" />
                    <div className="absolute bottom-0 right-1/4 w-[400px] h-[250px] bg-amber-500/6 rounded-full blur-[100px] pointer-events-none" />
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_50%,rgba(244,63,94,0.04)_0%,transparent_60%)] pointer-events-none" />

                    {/* Dot grid */}
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

                    <div className="relative z-10 p-8 md:p-12">
                        {/* Main Content Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                            {/* Left: Cafe Image */}
                            <div className="relative h-[280px] md:h-[340px] hidden lg:block order-2 lg:order-1">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.8 }}
                                    className="absolute inset-0 rounded-2xl overflow-hidden border border-white/8 shadow-2xl"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-tr from-rose-500/20 to-amber-500/20 mix-blend-overlay z-10" />
                                    <img
                                        src="/celoriscafe.jpg"
                                        alt="Celoris Cafe community"
                                        className="w-full h-full object-cover object-center"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/80 via-[#0a0a0a]/20 to-transparent z-20" />
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#0a0a0a]/60 z-20" />
                                </motion.div>
                            </div>

                            {/* Right Content */}
                            <div className="flex flex-col gap-6 order-1 lg:order-2">
                                <div>
                                    <h2 className="text-4xl md:text-5xl font-black text-white leading-[1.1] tracking-tight mb-2">
                                        Chill. Connect.
                                    </h2>
                                    <h2 className="text-4xl md:text-5xl font-black leading-[1.1] tracking-tight bg-gradient-to-r from-rose-400 to-amber-400 bg-clip-text text-transparent">
                                        Vibe Together.
                                    </h2>
                                </div>

                                <p className="text-slate-400 text-sm leading-relaxed max-w-md">
                                    Hang out in Celoris Cafe — live study rooms, casual voice hangouts, and a community that's always online. Take a break and <span className="text-rose-400 font-semibold">vibe with your peers</span> today.
                                </p>

                                {/* CTA Buttons */}
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <Link
                                        href="/social"
                                        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-black text-sm transition-all shadow-[0_0_20px_rgba(16,185,129,0.35)] hover:shadow-[0_0_30px_rgba(16,185,129,0.55)] group"
                                    >
                                        <Coffee className="w-4 h-4 text-black" />
                                        Enter the Cafe
                                    </Link>
                                    <Link
                                        href="/social"
                                        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-white/10 bg-white/4 text-white font-semibold text-sm hover:border-rose-500/40 hover:bg-rose-500/8 transition-all"
                                    >
                                        <Users className="w-4 h-4 text-rose-400" />
                                        Meet the Community
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                </div>
                </div>
            </motion.div>

            {/* Job Center Promotion Banner Section */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="max-w-5xl mx-auto mb-10"
            >
                <div className="home-rgb-border" style={{ '--rgb-radius': '2rem' } as React.CSSProperties}>
                <div className="home-rgb-border-ring">
                <div className="relative overflow-hidden bg-[#0a0a0a] shadow-[0_0_80px_rgba(245,158,11,0.08)]" style={{ borderRadius: 'calc(2rem - 2px)' }}>
                    {/* Background glow effects */}
                    <div className="absolute top-0 right-1/3 w-[500px] h-[300px] bg-amber-500/8 rounded-full blur-[120px] pointer-events-none" />
                    <div className="absolute bottom-0 left-1/4 w-[400px] h-[250px] bg-emerald-500/6 rounded-full blur-[100px] pointer-events-none" />
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_70%_50%,rgba(245,158,11,0.04)_0%,transparent_60%)] pointer-events-none" />

                    {/* Dot grid */}
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

                    <div className="relative z-10 p-8 md:p-12">
                        {/* Main Content Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                            {/* Left Content */}
                            <div className="flex flex-col gap-6">
                                <div>
                                    <h2 className="text-4xl md:text-5xl font-black text-white leading-[1.1] tracking-tight mb-2">
                                        Find Work.
                                    </h2>
                                    <h2 className="text-4xl md:text-5xl font-black leading-[1.1] tracking-tight bg-gradient-to-r from-amber-400 to-emerald-400 bg-clip-text text-transparent">
                                        Get Hired Fast.
                                    </h2>
                                </div>

                                <p className="text-slate-400 text-sm leading-relaxed max-w-md">
                                    Verified job listings, AI-powered skill assessments, and anti-cheat proctored exams — all in one place. Build your profile and land your next <span className="text-amber-400 font-semibold">opportunity risk-free</span>.
                                </p>

                                {/* CTA Buttons */}
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <Link
                                        href="/job-center"
                                        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-black text-sm transition-all shadow-[0_0_20px_rgba(245,158,11,0.35)] hover:shadow-[0_0_30px_rgba(245,158,11,0.55)] group"
                                    >
                                        <Briefcase className="w-4 h-4 text-black" />
                                        Explore Job Center
                                    </Link>
                                    <Link
                                        href="/job-center"
                                        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-white/10 bg-white/4 text-white font-semibold text-sm hover:border-amber-500/40 hover:bg-amber-500/8 transition-all"
                                    >
                                        <Search className="w-4 h-4 text-amber-400" />
                                        Browse Openings
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
                                    <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 to-emerald-500/20 mix-blend-overlay z-10" />
                                    <img
                                        src="/any_phone.jpg"
                                        alt="Job Center on mobile"
                                        className="w-full h-full object-cover object-center"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/80 via-[#0a0a0a]/20 to-transparent z-20" />
                                    <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-[#0a0a0a]/60 z-20" />
                                </motion.div>
                            </div>
                        </div>
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
                <div className="home-rgb-border" style={{ '--rgb-radius': '2rem' } as React.CSSProperties}>
                <div className="home-rgb-border-ring">
                <div className="relative overflow-hidden bg-[#0a0a0a] shadow-[0_0_80px_rgba(16,185,129,0.08)]" style={{ borderRadius: 'calc(2rem - 2px)' }}>
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

            {/* Testimonials Section */}
            <div className="w-full mt-16 mb-16">
            <div className="home-rgb-border" style={{ '--rgb-radius': '2.5rem' } as React.CSSProperties}>
            <div className="home-rgb-border-ring">
            <section className="relative w-full bg-[#0a0a0a] overflow-hidden shadow-[0_0_100px_rgba(16,185,129,0.05)] p-8 md:p-12" style={{ borderRadius: 'calc(2.5rem - 2px)' }}>
              {/* Background Dot Grid */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(circle,rgba(16,185,129,0.15)_2px,transparent_2px)] [background-size:24px_24px] opacity-60 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-[radial-gradient(circle,rgba(16,185,129,0.15)_2px,transparent_2px)] [background-size:24px_24px] opacity-60 pointer-events-none" />

              {/* Glowing Orbs */}
              <div className="absolute top-10 right-10 w-64 h-64 bg-emerald-600/10 rounded-full blur-[80px] pointer-events-none" />
              <div className="absolute bottom-10 left-10 w-64 h-64 bg-cyan-600/10 rounded-full blur-[80px] pointer-events-none" />

              <div className="relative z-10">
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
                  className="text-center mb-16"
                >
                  <motion.div
                    variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[8px] font-black uppercase tracking-widest mb-6"
                  >
                    <ShieldCheck size={10} /> Verified Pulse
                  </motion.div>
                  <motion.h2
                    variants={{ hidden: { opacity: 0, y: 24, filter: "blur(6px)" }, visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: "easeOut" } } }}
                    className="text-2xl md:text-5xl font-black uppercase tracking-tighter mb-4 home-shimmer-text drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]"
                  >
                    Customer Feedback
                  </motion.h2>
                  <motion.p
                    variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } }}
                    className="text-slate-500 font-black uppercase tracking-widest text-[8px]"
                  >
                    Direct transmissions from our synchronized node network.
                  </motion.p>
                </motion.div>

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
            </div>
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
