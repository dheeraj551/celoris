"use client"

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
    Sparkles, ArrowRight, ShieldCheck, CheckCircle2,
    IndianRupee, Star, Users, Zap, Award, Flame
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TrainerVideoModal } from './TrainerVideoModal'

export function TrainerHeroInteractive() {
    return (
        <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-white/5 bg-gradient-to-b from-emerald-950/25 via-[#080e1c] to-[#050810]">
            {/* Ambient Background Aura Lights */}
            <div className="absolute top-1/4 left-1/4 w-[650px] h-[350px] bg-emerald-500/10 blur-[140px] rounded-full pointer-events-none" />
            <div className="absolute top-1/3 right-10 w-[500px] h-[400px] bg-purple-500/15 blur-[150px] rounded-full pointer-events-none" />
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[800px] h-[250px] bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">

                    {/* Left Column: Headlines & Call to Actions (7 Cols) */}
                    <div className="lg:col-span-7 text-left space-y-6">
                        
                        {/* Animated Live Pill */}
                        <motion.div
                            initial={{ opacity: 0, y: -15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/15 border border-emerald-500/40 text-emerald-400 text-xs font-bold uppercase tracking-wider shadow-lg shadow-emerald-950/50 backdrop-blur-md"
                        >
                            <span className="flex h-2 w-2 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span>Special Announcement • 100% Free For All Educators</span>
                        </motion.div>

                        {/* Creative Main Headline */}
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.05]"
                        >
                            The Free Platform for Students is Now{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 drop-shadow-[0_0_35px_rgba(52,211,153,0.3)]">
                                100% Free for Trainers.
                            </span>
                        </motion.h1>

                        {/* Persuasive Subtitle */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl"
                        >
                            Stop paying ₹2,000 for "coin packages" just to view a student's contact number. On Celoris, enjoy <strong className="text-white">0% commission</strong>, <strong className="text-white">zero coin paywalls</strong>, and <strong className="text-white">direct student enquiries</strong> across Delhi NCR & Pan-India. You keep 100% of your earnings.
                        </motion.p>

                        {/* Action Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="flex flex-col sm:flex-row gap-4 pt-2"
                        >
                            <Button
                                size="lg"
                                className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black rounded-2xl px-8 h-14 text-base shadow-2xl shadow-emerald-500/30 transition-all hover:scale-105 active:scale-95 group"
                                asChild
                            >
                                <Link href="/register" className="flex items-center gap-2 justify-center">
                                    Claim Free Trainer Profile
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </Button>

                            <TrainerVideoModal />
                        </motion.div>

                        {/* Trust Badges Bar */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="flex flex-wrap items-center gap-5 pt-3 text-xs sm:text-sm text-slate-400"
                        >
                            <span className="flex items-center gap-1.5 text-slate-300">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                0% Platform Commission
                            </span>
                            <span className="flex items-center gap-1.5 text-slate-300">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                Direct In-App Messenger & Live Rooms
                            </span>
                            <span className="flex items-center gap-1.5 text-slate-300">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                Free AI Creative Studios Included
                            </span>
                        </motion.div>
                    </div>

                    {/* Right Column: High-Tech Video Showcase & Floating Badges (5 Cols) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="lg:col-span-5 relative"
                    >
                        {/* Glowing Frame Container */}
                        <div className="relative mx-auto max-w-md lg:max-w-none rounded-3xl p-2.5 bg-gradient-to-b from-emerald-500/30 via-slate-800/40 to-purple-500/30 shadow-2xl shadow-emerald-950/60 backdrop-blur-2xl border border-white/10 group">
                            
                            {/* Device Inner Shell */}
                            <div className="relative rounded-[1.3rem] overflow-hidden bg-slate-950 aspect-[4/3] sm:aspect-[16/10] border border-white/10">
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
                                <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-[11px] font-mono bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-slate-300">
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
                                        Teach Video, AI, Coding, Design & Academics
                                    </p>
                                </div>
                            </div>

                            {/* Floating Holographic Badge 1 (Top-Right) */}
                            <motion.div
                                animate={{ y: [0, -8, 0] }}
                                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                                className="absolute -top-6 -right-4 sm:-right-6 bg-slate-900/90 border border-emerald-500/50 backdrop-blur-xl p-3 px-4 rounded-2xl shadow-xl flex items-center gap-3 text-left"
                            >
                                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-black">
                                    0%
                                </div>
                                <div>
                                    <p className="text-xs font-black text-white leading-tight">Zero Commission</p>
                                    <p className="text-[10px] text-emerald-400 font-mono">You keep 100% fees</p>
                                </div>
                            </motion.div>

                            {/* Floating Holographic Badge 2 (Bottom-Left) */}
                            <motion.div
                                animate={{ y: [0, 8, 0] }}
                                transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 0.5 }}
                                className="absolute -bottom-6 -left-4 sm:-left-6 bg-slate-900/90 border border-purple-500/50 backdrop-blur-xl p-3 px-4 rounded-2xl shadow-xl flex items-center gap-3 text-left"
                            >
                                <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 font-black">
                                    <Zap size={18} />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-white leading-tight">Direct Student UPI</p>
                                    <p className="text-[10px] text-purple-300 font-mono">No 30-day payout hold</p>
                                </div>
                            </motion.div>

                            {/* Floating Badge 3 (Middle-Right) */}
                            <motion.div
                                animate={{ x: [0, 6, 0] }}
                                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                                className="hidden sm:flex absolute top-1/2 -right-8 -translate-y-1/2 bg-slate-900/90 border border-cyan-500/50 backdrop-blur-xl p-2.5 px-3.5 rounded-xl shadow-lg items-center gap-2"
                            >
                                <Star size={14} className="text-amber-400 fill-amber-400" />
                                <span className="text-xs font-bold text-white">500+ Verified Tutors</span>
                            </motion.div>

                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    )
}
