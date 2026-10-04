"use client"

import React from 'react';
import {
    Video,
    Search,
    PlayCircle,
    Star,
    Zap,
    BrainCircuit,
    Globe,
    ShieldCheck,
    Briefcase,
    Flame,
    Tv,
    GraduationCap,
    ArrowUpRight,
    IndianRupee,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import TestimonialsDisplay from "@/components/TestimonialsDisplay";

import { VideoStudioFeature } from './VideoStudioFeature';
import { PhotoLiteFeature } from './PhotoLiteFeature';
import { PolyVaultFeature } from './PolyVaultFeature';
import { SpotlightCard } from '@/components/ui/spotlight-card';
import { CommandDock } from './CommandDock';
import { SocialProofCounters } from './SocialProofCounters';
import { LazyLoopVideo, SHOWCASE_MEDIA, TrainerReelButton } from './ShowcaseMedia';

// Cosmic fireworks with violet, purple, and celestial neon tones that burst around the hero heading.
const FIREWORKS: { left: string; top: string; colors: string[]; delay: number; size?: number }[] = [
    { left: '4%', top: '-18%', colors: ['#c084fc', '#a855f7'], delay: 0, size: 1.1 },
    { left: '24%', top: '78%', colors: ['#e879f9', '#818cf8'], delay: 1.7, size: 0.85 },
    { left: '50%', top: '-24%', colors: ['#38bdf8', '#c084fc'], delay: 3.2, size: 1.2 },
    { left: '76%', top: '72%', colors: ['#a78bfa', '#ec4899'], delay: 0.9, size: 0.9 },
    { left: '96%', top: '-12%', colors: ['#fbbf24', '#a855f7'], delay: 2.4, size: 1 },
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
                <PixelFirework
                    key={i}
                    left={fw.left}
                    top={fw.top}
                    colors={fw.colors}
                    delay={fw.delay}
                    size={fw.size}
                />
            ))}
        </div>
    );
}

// Interactive Spotlight Bento Card powered by dual-layer Mouse Border Beam
function BentoCard({
    children,
    className = "",
    glowColor = "rgba(168, 85, 247, 0.10)",
    borderGlow = "rgba(168, 85, 247, 0.75)",
}: {
    children: React.ReactNode;
    className?: string;
    glowColor?: string;
    borderGlow?: string;
}) {
    return (
        <SpotlightCard
            radius="1.5rem"
            beamColor={borderGlow}
            glowColor={glowColor}
            className={cn("h-full shadow-[0_20px_50px_rgba(0,0,0,0.6)]", className)}
            innerClassName="p-6 sm:p-8 flex flex-col justify-between"
        >
            {children}
        </SpotlightCard>
    );
}

interface DashboardContentProps {
    courses?: any[];
    initialTestimonials?: any[];
}

export function DashboardContent({ courses, initialTestimonials = [] }: DashboardContentProps) {
    return (
        <div className="py-12 sm:py-16 px-4 sm:px-8 max-w-6xl mx-auto overflow-x-clip sm:overflow-visible">
            {/* Asymmetric Editorial Hero Section */}
            <div className="pt-4 sm:pt-10 pb-8 sm:pb-14 relative">
                {/* Subtle Ambient Backlight - concentrated on typography side for max contrast */}
                <div className="absolute -top-10 left-0 w-[550px] max-w-[90vw] h-[360px] bg-gradient-to-br from-purple-600/15 via-emerald-500/10 to-transparent rounded-full blur-[130px] pointer-events-none" />

                {/* Oversized Brand Watermark in Background */}
                <div className="absolute -top-4 sm:-top-8 left-4 sm:left-8 text-[16vw] sm:text-[12vw] md:text-[110px] font-black uppercase tracking-tighter text-white/[0.02] select-none pointer-events-none whitespace-nowrap z-0 font-mono">
                    CELORIS
                </div>

                {/* Two-Column Asymmetric Grid: Text & CTAs on Left, Open Canvas Stage on Right */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center min-h-[480px] sm:min-h-[540px] relative z-10">
                    {/* LEFT COLUMN: Editorial Typography, CTAs, and Trust Proof */}
                    <div className="lg:col-span-7 xl:col-span-7 flex flex-col items-start text-left">
                        {/* Status Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.12] backdrop-blur-xl mb-5 shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
                        >
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
                            <span className="text-xs font-mono font-medium tracking-wider text-neutral-300 uppercase">
                                Free Creative Studio for Students
                            </span>
                        </motion.div>

                        {/* Staggered Heading */}
                        <div className="relative inline-block mb-5">
                            <HeadingFireworks />
                            <motion.h1
                                initial="hidden"
                                animate="visible"
                                variants={{
                                    hidden: {},
                                    visible: { transition: { staggerChildren: 0.04, delayChildren: 0.1 } }
                                }}
                                className="text-3xl sm:text-5xl xl:text-6xl font-semibold tracking-tight text-white leading-[1.12]"
                            >
                                <motion.span
                                    variants={{
                                        hidden: { opacity: 0, y: 20, filter: "blur(6px)" },
                                        visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5, ease: "easeOut" } }
                                    }}
                                    className="inline-block home-shimmer-text drop-shadow-[0_0_25px_rgba(168,85,247,0.35)] text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-purple-400 mr-[0.24em]"
                                >
                                    Celoris
                                </motion.span>
                                {["AI", "Powered", "Image", "and", "Video", "Editor's"].map((word, i) => (
                                    <motion.span
                                        key={i}
                                        variants={{
                                            hidden: { opacity: 0, y: 20, filter: "blur(6px)" },
                                            visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5, ease: "easeOut" } }
                                        }}
                                        className="inline-block mr-[0.24em]"
                                    >
                                        {word}
                                    </motion.span>
                                ))}
                                <motion.span
                                    variants={{
                                        hidden: { opacity: 0, y: 20, filter: "blur(6px)" },
                                        visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5, ease: "easeOut" } }
                                    }}
                                    className="inline-block home-shimmer-text drop-shadow-[0_0_25px_rgba(168,85,247,0.35)] text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-purple-400 mr-[0.24em]"
                                >
                                    Cloud Studio
                                </motion.span>
                                {["for", "India"].map((word, i) => (
                                    <motion.span
                                        key={i}
                                        variants={{
                                            hidden: { opacity: 0, y: 20, filter: "blur(6px)" },
                                            visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5, ease: "easeOut" } }
                                        }}
                                        className="inline-block mr-[0.24em]"
                                    >
                                        {word}
                                    </motion.span>
                                ))}
                            </motion.h1>
                        </div>

                        {/* Refined Subtitle */}
                        <motion.p
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-neutral-300 text-base sm:text-lg leading-relaxed max-w-xl mb-7 font-normal"
                        >
                            India's free creative studio since 2019. Free video editor, PhotoLite, 3D asset vault, online classes and daily freelance gigs. No credit card needed.
                        </motion.p>

                        {/* Primary CTAs */}
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="flex flex-wrap items-center gap-3.5 mb-8"
                        >

                            <Link
                                href="/learn"
                                className="inline-flex items-center gap-2.5 px-5 py-3.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.15] hover:border-white/[0.25] text-white font-medium text-sm sm:text-base backdrop-blur-xl transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                            >
                                <GraduationCap className="w-4 h-4 text-emerald-400" />
                                <span>Explore Academy</span>
                            </Link>

                            <Link
                                href="/pricing"
                                className="inline-flex items-center gap-2.5 px-5 py-3.5 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 border border-purple-400/30 hover:border-purple-300/50 text-purple-200 hover:text-white font-medium text-sm sm:text-base backdrop-blur-xl transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                            >
                                <IndianRupee className="w-4 h-4 text-purple-400" />
                                <span>View Plans &amp; Pricing</span>
                            </Link>
                        </motion.div>

                        {/* Trust Badges */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="flex flex-wrap items-center gap-4 sm:gap-6 pt-4 border-t border-white/[0.08] text-xs font-medium text-neutral-400"
                        >
                            <Link href="/pricing" className="flex items-center gap-1.5 hover:opacity-80 transition-opacity">
                                <span className="text-emerald-400 font-bold">Free Tier</span>
                                <span className="text-[10px] text-neutral-400">(Plans →)</span>
                            </Link>
                            <div className="w-1 h-1 rounded-full bg-white/20" />
                            <div className="flex items-center gap-2">
                                <span className="text-white font-bold">20+</span>
                                <span>AI Video &amp; Image Models</span>
                            </div>
                            <div className="w-1 h-1 rounded-full bg-white/20" />
                            <div className="flex items-center gap-2">
                                <span className="text-purple-400 font-bold">50K+</span>
                                <span>Satisfied Customers</span>
                            </div>
                        </motion.div>
                    </div>

                    {/* RIGHT COLUMN: Clear, Unobstructed Canvas Stage */}
                    {/* Intentionally left open and pristine so the background model's face, gaze, and eye animation take center stage! */}
                    <div className="lg:col-span-5 xl:col-span-5 relative min-h-[300px] lg:min-h-[500px] flex flex-col justify-end items-end pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                            className="pointer-events-auto hidden sm:inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-black/40 hover:bg-black/65 backdrop-blur-2xl border border-white/[0.12] text-white/90 text-xs font-mono shadow-2xl transition-all"
                        >
                            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.9)]" />
                            <span className="text-neutral-300">Scroll to Explore Video Stream</span>
                            <span className="text-cyan-400 font-bold">↓</span>
                        </motion.div>
                    </div>
                </div>

                {/* Floating Quick-Launch "Command Dock" (Raycast / macOS Style) */}
                <div className="mt-8 sm:mt-12">
                    <CommandDock />
                </div>
            </div>

            {/* Simple, Transparent & Honest Guarantee Card (Ultra-Sleek Semi-Transparent Nano Glass) */}
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="max-w-5xl mx-auto my-12 sm:my-16 relative z-10"
            >
                <SpotlightCard
                    radius="1.75rem"
                    beamColor="rgba(168, 85, 247, 0.85)"
                    glowColor="rgba(168, 85, 247, 0.12)"
                    className="shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
                    innerClassName="bg-[#08090d]/30 sm:bg-[#08090d]/20 backdrop-blur-2xl p-6 sm:p-8 md:p-10 border border-white/[0.12] shadow-[inset_0_1px_1px_rgba(255,255,255,0.18)]"
                >
                    <div className="flex flex-col items-center justify-center">

                        <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-2 text-center">
                            Simple, Transparent &amp; Honest
                        </h3>

                        <p className="text-neutral-400 text-sm md:text-base leading-relaxed mb-2 max-w-xl mx-auto text-center font-normal">
                            No hidden charges. No surprise calls from "counsellors." 100% free creative tools and career training.
                        </p>

                        {/* 📊 Animated Metric Counters (Odometer Social Proof) */}
                        <SocialProofCounters />
                    </div>
                </SpotlightCard>
            </motion.div>

            {/* Interactive Bento Grid Ecosystem Section */}
            <motion.section
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="max-w-6xl mx-auto mb-24 px-1 sm:px-0"
            >
                {/* Section Header */}
                <div className="text-center mb-10 sm:mb-14">
                    <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-medium tracking-wide mb-3 backdrop-blur-xl">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                        The Celoris Ecosystem
                    </div>
                    <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-3">
                        One Studio. <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">Infinite Possibilities.</span>
                    </h2>
                    <p className="text-neutral-400 text-xs sm:text-base max-w-xl mx-auto leading-relaxed">
                        Industry-standard courses, 24/7 creator television, live study lounges, and verified freelance opportunities — all unified in one place.
                    </p>
                </div>

                {/* 12-Column Responsive Bento Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
                    {/* BENTO CARD 1: Learn & Courses (7 cols) */}
                    <BentoCard
                        className="lg:col-span-7 min-h-[420px]"
                        glowColor="rgba(16, 185, 129, 0.12)"
                        borderGlow="rgba(16, 185, 129, 0.35)"
                    >
                        <div>
                            {/* Card Top Meta */}
                            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-medium">
                                    <GraduationCap className="w-3.5 h-3.5" />
                                    Free Education Since 2019
                                </div>
                                <Link href="/learn/course/master-copilot-excel" className="group/batch inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[10px] font-medium">
                                    <span className="relative flex h-1.5 w-1.5">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500" />
                                    </span>
                                    New Batch Alert
                                </Link>
                            </div>

                            {/* Headline */}
                            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
                                Learn. Create. <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Succeed.</span>
                            </h3>
                            <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed max-w-lg mb-6">
                                Unlock high-income creative skills with expert-led courses in AI, Web Development, Short-Form Video &amp; Digital Marketing.
                            </p>

                            {/* Course Quick Preview Pills */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-6">
                                {[
                                    { title: 'Digital Marketing', slug: '/learn/course/digital-marketing-mastery', tag: 'Top Rated' },
                                    { title: 'Web Development', slug: '/learn/course/web-development-bootcamp', tag: 'Practical' },
                                    { title: 'YouTube & Reels', slug: '/learn/course/master-youtube-shorts-instagram-reels', tag: 'High Growth' },
                                ].map((course, i) => (
                                    <Link
                                        key={i}
                                        href={course.slug}
                                        className="p-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] hover:border-emerald-500/40 transition-all group/item flex flex-col justify-between backdrop-blur-xl"
                                    >
                                        <span className="text-[9px] text-emerald-400 font-mono font-bold uppercase tracking-wider">{course.tag}</span>
                                        <span className="text-xs font-bold text-white group-hover/item:text-emerald-300 transition-colors mt-1">{course.title}</span>
                                        <div className="flex items-center text-[10px] text-slate-500 group-hover/item:text-slate-300 mt-2">
                                            <span>Syllabus</span>
                                            <ArrowUpRight className="w-3 h-3 ml-0.5 transition-transform group-hover/item:translate-x-0.5 group-hover/item:-translate-y-0.5" />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Card Footer CTAs (Sleek Apple VisionOS Capacitive Pills) */}
                        <div className="flex flex-wrap items-center gap-3 pt-5 border-t border-white/5">
                            <Link
                                href="/learn"
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 hover:text-white border border-emerald-400/40 hover:border-emerald-300/60 font-medium text-xs sm:text-sm transition-all shadow-[0_0_25px_rgba(16,185,129,0.25)] hover:scale-[1.03] active:scale-97 cursor-pointer"
                            >
                                <PlayCircle className="w-4 h-4 text-emerald-300" />
                                Start Learning Now
                            </Link>
                            <Link
                                href="/teach"
                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-white/[0.12] bg-white/[0.04] hover:bg-white/[0.08] text-neutral-200 hover:text-white font-medium text-xs sm:text-sm transition-all hover:scale-[1.03] active:scale-97 cursor-pointer"
                            >
                                <Star className="w-4 h-4 text-emerald-400" />
                                Become an Instructor
                            </Link>
                            {/* Trainer pitch reel (with sound), from Cloudflare R2 */}
                            <TrainerReelButton />
                        </div>
                    </BentoCard>

                    {/* BENTO CARD 2: Live Classrooms (5 cols) */}
                    <BentoCard
                        className="lg:col-span-5 min-h-[420px]"
                        glowColor="rgba(168, 85, 247, 0.14)"
                        borderGlow="rgba(168, 85, 247, 0.35)"
                    >
                        <div>
                            {/* Card Top Meta */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[11px] font-medium font-mono">
                                    <GraduationCap className="w-3.5 h-3.5 text-purple-400" />
                                    Live Classrooms
                                </div>
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-medium font-mono">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    Interactive Batches
                                </div>
                            </div>

                            {/* Headline */}
                            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
                                Learn Live. <span className="bg-gradient-to-r from-purple-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">Collaborate.</span>
                            </h3>
                            <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed mb-5">
                                Interactive 3D virtual lecture halls, collaborative whiteboard studios, and small cohorts led by verified mentors.
                            </p>

                            {/* Classroom preview loop (muted, from Cloudflare R2) */}
                            <div className="relative rounded-2xl overflow-hidden border border-white/[0.1] bg-black/60 aspect-[16/7] mb-4">
                                <LazyLoopVideo
                                    src={`${SHOWCASE_MEDIA}classroom-live-loop.mp4`}
                                    poster={`${SHOWCASE_MEDIA}classroom-live-loop.jpg`}
                                    className="absolute inset-0 w-full h-full object-cover"
                                    style={{ objectPosition: '60% 35%' }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                                <span className="absolute bottom-2 left-3 inline-flex items-center gap-1.5 text-[10px] font-semibold text-white drop-shadow">
                                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                                    Classroom preview
                                </span>
                            </div>

                            {/* Interactive Audio Waveform Card */}
                            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] mb-5 flex items-center justify-between backdrop-blur-xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border border-purple-500/30 flex items-center justify-center">
                                        <GraduationCap className="w-5 h-5 text-purple-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-white">3D Aula &amp; Whiteboard Studios</p>
                                        <p className="text-[10px] text-neutral-400">Live Voice, Screen Share &amp; Digital Lectern</p>
                                    </div>
                                </div>
                                {/* Animated Equalizer Bars */}
                                <div className="flex items-center gap-1 h-6">
                                    {[16, 24, 12, 28, 20, 10, 24, 14].map((h, i) => (
                                        <motion.div
                                            key={i}
                                            animate={{ height: [4, h, 6, h * 0.8, 4] }}
                                            transition={{
                                                duration: 1.2 + (i % 3) * 0.2,
                                                repeat: Infinity,
                                                ease: "easeInOut",
                                                delay: i * 0.1,
                                            }}
                                            className="w-1 rounded-full bg-gradient-to-t from-purple-500 to-emerald-400"
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Card Footer CTAs */}
                        <div className="pt-5 border-t border-white/5">
                            <Link
                                href="/classrooms"
                                className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-600/30 via-indigo-600/30 to-emerald-600/30 hover:from-purple-600/50 hover:to-emerald-600/50 text-purple-100 hover:text-white border border-purple-400/40 hover:border-emerald-300/60 font-medium text-xs sm:text-sm transition-all shadow-[0_0_25px_rgba(168,85,247,0.25)] hover:scale-[1.02] active:scale-97 cursor-pointer"
                            >
                                <GraduationCap className="w-4 h-4 text-purple-300" />
                                Enter Classrooms
                            </Link>
                        </div>
                    </BentoCard>

                    {/* BENTO CARD 3: Job Center & Verified Gigs (5 cols) */}
                    <BentoCard
                        className="lg:col-span-5 min-h-[420px]"
                        glowColor="rgba(245, 158, 11, 0.12)"
                        borderGlow="rgba(245, 158, 11, 0.35)"
                    >
                        <div>
                            {/* Card Top Meta */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] font-medium">
                                    <Briefcase className="w-3.5 h-3.5 text-amber-400" />
                                    100% Free Job Portal
                                </div>
                                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-neutral-300 text-[10px] font-mono">
                                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                                    Zero Fees
                                </div>
                            </div>

                            {/* Headline */}
                            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
                                Find Work. <span className="bg-gradient-to-r from-amber-400 to-emerald-400 bg-clip-text text-transparent">Get Hired.</span>
                            </h3>
                            <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed mb-4">
                                Verified job listings, anti-cheat assessments, and real client job offers with zero middleman deductions.
                            </p>

                            {/* Live Gigs Radar */}
                            <div className="space-y-2 mb-5">
                                {[
                                    { role: 'Short-Form Video Editor', rate: '₹32,000/mo', type: 'Remote', color: 'text-amber-400' },
                                    { role: 'Next.js & React Developer', rate: '₹48,000/mo', type: 'Full-time', color: 'text-emerald-400' },
                                    { role: 'Thumbnail & UI Designer', rate: '₹25,000/mo', type: 'Freelance', color: 'text-cyan-400' },
                                ].map((job, i) => (
                                    <div key={i} className="px-3.5 py-2.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-amber-500/40 transition-all flex items-center justify-between backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                                        <div>
                                            <p className="text-xs font-bold text-white">{job.role}</p>
                                            <p className="text-[10px] text-neutral-400">{job.type} • Direct Hire</p>
                                        </div>
                                        <span className={`text-xs font-mono font-bold ${job.color}`}>{job.rate}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Card Footer CTAs */}
                        <div className="pt-5 border-t border-white/5">
                            <Link
                                href="/job-center"
                                className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 hover:text-white border border-amber-400/40 hover:border-amber-300/60 font-medium text-xs sm:text-sm transition-all shadow-[0_0_25px_rgba(245,158,11,0.25)] hover:scale-[1.02] active:scale-97 cursor-pointer"
                            >
                                <Search className="w-4 h-4 text-amber-300" />
                                Explore Openings
                            </Link>
                        </div>
                    </BentoCard>

                    {/* BENTO CARD 4: Celoris TV (7 cols) */}
                    <BentoCard
                        className="lg:col-span-7 min-h-[420px]"
                        glowColor="rgba(239, 68, 68, 0.12)"
                        borderGlow="rgba(239, 68, 68, 0.35)"
                    >
                        <div>
                            {/* Card Top Meta */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] font-medium">
                                    <Tv className="w-3.5 h-3.5 text-red-400" />
                                    Celoris TV • Always Free
                                </div>
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-300 text-[10px] font-medium">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                    24/7 Channel
                                </div>
                            </div>

                            {/* Headline */}
                            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
                                Watch. Learn. <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">Stay Ahead.</span>
                            </h3>
                            <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed max-w-lg mb-5">
                                Your free streaming channel for video editing tutorials, live classes, and creator masterclasses — no subscriptions, no downloads.
                            </p>

                            {/* Simulated Video Player Preview */}
                            <div className="relative rounded-2xl overflow-hidden border border-white/[0.12] bg-black/60 aspect-[21/9] sm:aspect-[24/9] mb-5 group/tv shadow-lg">
                                <img
                                    src="/Celoristv.png"
                                    alt="Celoris TV"
                                    className="w-full h-full object-cover object-center opacity-70 group-hover/tv:opacity-90 group-hover/tv:scale-105 transition-all duration-700"
                                    // Keep the photo's headline on the left; the live clip takes the right side.
                                    style={{
                                        WebkitMaskImage: 'linear-gradient(to right, black 42%, transparent 60%)',
                                        maskImage: 'linear-gradient(to right, black 42%, transparent 60%)',
                                    }}
                                />
                                {/* Live host loop (muted, from Cloudflare R2) over the photo's right side */}
                                <LazyLoopVideo
                                    src={`${SHOWCASE_MEDIA}celoris-tv-host-loop.mp4`}
                                    poster={`${SHOWCASE_MEDIA}celoris-tv-host-loop.jpg`}
                                    className="absolute inset-y-0 right-0 h-full w-[52%] sm:w-[46%] object-cover opacity-90 group-hover/tv:opacity-100 transition-opacity duration-700"
                                    style={{
                                        objectPosition: '50% 32%',
                                        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 28%)',
                                        maskImage: 'linear-gradient(to right, transparent 0%, black 28%)',
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-10 h-10 rounded-full bg-red-500/80 hover:bg-red-500 text-white flex items-center justify-center shadow-[0_0_25px_rgba(239,68,68,0.6)] group-hover/tv:scale-110 transition-transform">
                                        <PlayCircle className="w-5 h-5 fill-white text-black" />
                                    </div>
                                </div>
                                <div className="absolute bottom-2.5 left-3.5 right-3.5 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="px-1.5 py-0.5 rounded bg-red-600 text-[8px] font-black uppercase tracking-wider text-white">LIVE</span>
                                        <span className="text-xs font-bold text-white drop-shadow">4K Editing Masterclass Stream</span>
                                    </div>
                                    <span className="text-[10px] text-white/70 font-mono hidden sm:inline">1080p60 • No Sign-up</span>
                                </div>
                            </div>
                        </div>

                        {/* Card Footer CTAs */}
                        <div className="flex flex-wrap items-center gap-3 pt-5 border-t border-white/5">
                            <Link
                                href="/celoris-tv"
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-500/20 hover:bg-red-500/30 text-red-200 hover:text-white border border-red-400/40 hover:border-red-300/60 font-medium text-xs sm:text-sm transition-all shadow-[0_0_25px_rgba(239,68,68,0.25)] hover:scale-[1.03] active:scale-97 cursor-pointer"
                            >
                                <PlayCircle className="w-4 h-4 text-red-300" />
                                Watch Celoris TV
                            </Link>
                            <Link
                                href="/celoris-tv"
                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-white/[0.12] bg-white/[0.04] hover:bg-white/[0.08] text-neutral-200 hover:text-white font-medium text-xs sm:text-sm transition-all hover:scale-[1.03] active:scale-97 cursor-pointer"
                            >
                                <Tv className="w-4 h-4 text-red-400" />
                                Browse Channels
                            </Link>
                        </div>
                    </BentoCard>

                    {/* BENTO CARD 5: Panoramic Digital Agency Solutions (12 cols) */}
                    <BentoCard
                        className="lg:col-span-12"
                        glowColor="rgba(16, 185, 129, 0.12)"
                        borderGlow="rgba(16, 185, 129, 0.35)"
                    >
                        <div>
                            {/* Card Top Meta */}
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                                <div>
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-medium mb-3">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                        Digital Solutions &amp; Enterprise Services
                                    </div>
                                    <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                                        We Build. We Market. <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">You Grow.</span>
                                    </h3>
                                    <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed max-w-2xl mt-2">
                                        Your one-stop partner for Website Development, Mobile Apps, Digital Marketing, AI Solutions &amp; Corporate Training.
                                    </p>
                                </div>
                                <div className="flex flex-wrap items-center gap-3">
                                    <a
                                        href="https://wa.me/919084718101"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#25D366]/20 hover:bg-[#25D366]/30 text-emerald-200 hover:text-white border border-[#25D366]/40 hover:border-[#25D366]/60 font-medium text-xs sm:text-sm transition-all shadow-[0_0_25px_rgba(37,211,102,0.2)] hover:scale-[1.03] active:scale-97 cursor-pointer"
                                    >
                                        <svg className="w-4 h-4 fill-emerald-300" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                                        WhatsApp Us
                                    </a>
                                    <Link
                                        href="/contact"
                                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-white/[0.12] bg-white/[0.04] hover:bg-white/[0.08] text-neutral-200 hover:text-white font-medium text-xs sm:text-sm transition-all hover:scale-[1.03] active:scale-97 cursor-pointer"
                                    >
                                        <Video className="w-4 h-4 text-emerald-400" />
                                        Book Consultation
                                    </Link>
                                </div>
                            </div>

                            {/* 6 Interactive Service Capsules */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
                                {[
                                    { icon: Globe, label: 'Web Dev', desc: 'Next.js & Fullstack' },
                                    { icon: PlayCircle, label: 'Mobile Apps', desc: 'iOS & Android' },
                                    { icon: Zap, label: 'Digital Mktg', desc: 'SEO & Funnels' },
                                    { icon: BrainCircuit, label: 'AI Solutions', desc: 'LLMs & Automations' },
                                    { icon: Star, label: 'Training', desc: 'Corporate Teams' },
                                    { icon: Flame, label: 'Creative', desc: 'Video, 3D & Design' },
                                ].map(({ icon: Icon, label, desc }, i) => (
                                    <div
                                        key={i}
                                        className="p-3.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-emerald-500/30 transition-all flex flex-col justify-between group/service cursor-default backdrop-blur-xl"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-slate-400 group-hover/service:text-emerald-400 group-hover/service:border-emerald-500/30 transition-colors mb-2">
                                            <Icon className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-white group-hover/service:text-emerald-300 transition-colors">{label}</p>
                                            <p className="text-[10px] text-neutral-400 leading-tight mt-0.5">{desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* 4 Live Metric Badges */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-white/5">
                                {[
                                    { value: '+187%', label: 'SEO Organic Traffic Boost', color: 'text-emerald-400' },
                                    { value: '500+', label: 'Delivered Projects & Gigs', color: 'text-cyan-400' },
                                    { value: '4.9 ★', label: 'Satisfied Customer Reviews Rating', color: 'text-amber-400' },
                                    { value: 'India-Based', label: 'Serving Global Clients Since 2019', color: 'text-indigo-400' },
                                ].map((stat, i) => (
                                    <div key={i} className="flex flex-col">
                                        <span className={`text-xl sm:text-2xl font-black font-mono ${stat.color}`}>{stat.value}</span>
                                        <span className="text-[11px] text-neutral-400 mt-0.5">{stat.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </BentoCard>
                </div>
            </motion.section>

            {/* Feature Sections */}
            <div className="w-full flex flex-col gap-12 items-center mb-24">
                <div className="w-full">
                    <VideoStudioFeature />
                </div>
                <div className="flex flex-col lg:flex-row gap-8 w-full max-w-[1200px] items-stretch justify-center px-4">
                    <div className="flex-1 w-full flex justify-center">
                        <PolyVaultFeature />
                    </div>
                    <div className="flex-1 w-full flex justify-center">
                        <PhotoLiteFeature />
                    </div>
                </div>
            </div>

            {/* Testimonials Section */}
            <div className="w-full mt-16 mb-16">
              <SpotlightCard
                radius="2.5rem"
                beamColor="rgba(16, 185, 129, 0.85)"
                glowColor="rgba(16, 185, 129, 0.10)"
                className="shadow-[0_0_80px_rgba(16,185,129,0.08)]"
                innerClassName="bg-[#08090d]/80 backdrop-blur-3xl p-8 md:p-12 border border-white/[0.1] shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]"
              >
                <section className="relative w-full overflow-hidden">
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
                      limit={20}
                      layout="marquee"
                      showFeatured={false}
                      showImages={true}
                      className="mb-4"
                      initialTestimonials={initialTestimonials}
                    />
                  </div>
                </section>
              </SpotlightCard>
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
