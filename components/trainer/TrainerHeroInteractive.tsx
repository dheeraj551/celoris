"use client"

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
    ArrowRight, ShieldCheck, Wallet
} from 'lucide-react'
import { TrainerVideoModal } from './TrainerVideoModal'

export function TrainerHeroInteractive() {
    return (
        <section className="relative pt-6 sm:pt-10 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#050608]">
            {/* Subtle Ambient Backlight - exactly matching homepage Hero */}
            <div className="absolute -top-10 left-0 w-[550px] max-w-[90vw] h-[360px] bg-gradient-to-br from-purple-600/15 via-emerald-500/10 to-transparent rounded-full blur-[130px] pointer-events-none" />
            <div className="absolute top-1/3 right-10 w-[500px] h-[400px] bg-purple-500/10 blur-[150px] rounded-full pointer-events-none" />

            {/* Oversized Brand Watermark in Background - exactly matching homepage */}
            <div className="absolute -top-4 sm:-top-8 left-4 sm:left-8 text-[16vw] sm:text-[12vw] md:text-[110px] font-black uppercase tracking-tighter text-white/[0.02] select-none pointer-events-none whitespace-nowrap z-0 font-mono">
                CELORIS
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid lg:grid-cols-12 gap-10 lg:gap-8 items-center">

                    {/* Left Column: Headlines & Call to Actions (7 Cols) */}
                    <div className="lg:col-span-7 flex flex-col items-start text-left">
                        
                        {/* Status Badge - matching homepage pill badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.12] backdrop-blur-xl mb-5 shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
                        >
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
                            <span className="text-xs font-mono font-medium tracking-wider text-neutral-300 uppercase">
                                Free to join • 0% commission
                            </span>
                        </motion.div>

                        {/* Staggered Heading */}
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-3xl sm:text-5xl xl:text-6xl font-semibold tracking-tight text-white leading-[1.12] mb-5"
                        >
                            Keep{" "}
                            <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-purple-400 drop-shadow-[0_0_25px_rgba(168,85,247,0.35)]">
                                100%
                            </span>{" "}
                            of what you earn teaching.
                        </motion.h1>

                        {/* Refined Subtitle */}
                        <motion.p
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-neutral-300 text-base sm:text-lg leading-relaxed max-w-xl mb-7 font-normal"
                        >
                            For designers, editors, developers and tutors. Stop paying ₹2,000 for &ldquo;coin packages&rdquo; just to see a student&apos;s number. On Celoris there&apos;s <strong className="text-white font-semibold">0% commission</strong>, <strong className="text-white font-semibold">no coins</strong> and <strong className="text-white font-semibold">no membership needed</strong>. Students pay into your Celoris wallet and you withdraw it to your own UPI.
                        </motion.p>

                        <motion.p
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.25 }}
                            className="text-sm text-neutral-400 max-w-xl -mt-4 mb-7"
                        >
                            <span className="text-emerald-400 font-semibold">So how does Celoris make money?</span> Only when you choose to use our classrooms and AI tools. Never from your fees.
                        </motion.p>

                        {/* Primary CTAs - matching homepage pill buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="flex flex-wrap items-center gap-3.5 mb-7"
                        >
                            <Link
                                href="/register"
                                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.15] hover:border-white/[0.25] text-white font-medium text-sm sm:text-base backdrop-blur-xl transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.5)] group"
                            >
                                <span>Claim Free Trainer Profile</span>
                                <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
                            </Link>

                            <TrainerVideoModal />
                        </motion.div>

                        {/* Trust Badges Bar - matching homepage proof line */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="flex flex-wrap items-center gap-4 sm:gap-6 pt-4 border-t border-white/[0.08] text-xs font-medium text-neutral-400"
                        >
                            <div className="flex items-center gap-1.5">
                                <span className="text-emerald-400 font-bold">0%</span>
                                <span>Platform Commission</span>
                            </div>
                            <div className="w-1 h-1 rounded-full bg-white/20" />
                            <div className="flex items-center gap-2">
                                <span className="text-white font-bold">Wallet → UPI</span>
                                <span>Zero Paywalls</span>
                            </div>
                            <div className="w-1 h-1 rounded-full bg-white/20" />
                            <div className="flex items-center gap-2">
                                <span className="text-purple-400 font-bold">Verified</span>
                                <span>Every trainer checked by our team</span>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column: High-Tech Video Showcase & Floating Badges (5 Cols) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="lg:col-span-5 relative"
                    >
                        {/* Nano-Glass Outer Frame Container */}
                        <div className="relative mx-auto max-w-md lg:max-w-none rounded-3xl p-2 bg-[#08090d]/80 border border-white/[0.12] backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.85)] group">
                            
                            {/* Device Inner Shell */}
                            <div className="relative rounded-[1.3rem] overflow-hidden bg-black aspect-[4/3] sm:aspect-[16/10] border border-white/10">
                                {/* Autoplay Looping Video */}
                                <video
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                >
                                    <source src="/gallery/teacher_classroom.mp4" type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>

                                {/* Ambient Dark Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

                                {/* On-Video Glass Header */}
                                <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-[11px] font-mono bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-slate-300">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                        <span>LIVE SESSION • DELHI NCR</span>
                                    </div>
                                    <span className="text-emerald-400 font-bold">100% TAKE-HOME</span>
                                </div>

                                {/* On-Video Bottom Title */}
                                <div className="absolute bottom-3 left-3 right-3 text-left">
                                    <p className="text-white font-bold text-sm leading-tight drop-shadow-md">
                                        Empowering India's Next-Gen Educators
                                    </p>
                                    <p className="text-xs text-slate-300 font-medium">
                                        Teach Video, AI, Coding, Design &amp; Academics
                                    </p>
                                </div>
                            </div>

                            {/* Floating Holographic Badge 1 (Top-Right) */}
                            <motion.div
                                animate={{ y: [0, -6, 0] }}
                                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                                className="absolute -top-4 -right-2 sm:-right-4 bg-[#08090d]/90 border border-white/[0.12] backdrop-blur-2xl p-2.5 px-3.5 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.8)] flex items-center gap-2.5 text-left"
                            >
                                <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 font-black text-xs">
                                    0%
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-white leading-tight">Zero Commission</p>
                                    <p className="text-[10px] text-emerald-400 font-mono">Keep 100% fees</p>
                                </div>
                            </motion.div>

                            {/* Floating Holographic Badge 2 (Bottom-Left) */}
                            <motion.div
                                animate={{ y: [0, 6, 0] }}
                                transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 0.5 }}
                                className="absolute -bottom-4 -left-2 sm:-left-4 bg-[#08090d]/90 border border-white/[0.12] backdrop-blur-2xl p-2.5 px-3.5 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.8)] flex items-center gap-2.5 text-left"
                            >
                                <div className="w-7 h-7 rounded-full bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-400 font-black">
                                    <Wallet size={14} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-white leading-tight">Paid to your wallet</p>
                                    <p className="text-[10px] text-purple-300 font-mono">Withdraw to your UPI</p>
                                </div>
                            </motion.div>

                            {/* Floating Badge 3 (Middle-Right) */}
                            <motion.div
                                animate={{ x: [0, 4, 0] }}
                                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                                className="hidden sm:flex absolute top-1/2 -right-6 -translate-y-1/2 bg-[#08090d]/90 border border-white/[0.12] backdrop-blur-2xl p-2 px-3 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.8)] items-center gap-2"
                            >
                                <ShieldCheck size={13} className="text-emerald-400" />
                                <span className="text-xs font-medium text-white">Manually verified trainers</span>
                            </motion.div>

                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    )
}
