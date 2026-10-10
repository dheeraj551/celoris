"use client"

import React from 'react'
import { motion } from 'framer-motion'
import {
    XCircle, CheckCircle2, AlertTriangle, ShieldCheck,
    Coins, IndianRupee, Zap, Lock, Unlock, PhoneCall
} from 'lucide-react'

export function TrainerBattleCard() {
    return (
        <section id="comparison" className="py-16 sm:py-20 px-4 sm:px-6 max-w-6xl mx-auto scroll-mt-20">
            {/* Section Header */}
            <div className="text-center max-w-3xl mx-auto mb-14">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-rose-500/15 text-rose-400 border border-rose-500/30 mb-3">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    The Industry Breakdown
                </span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-white tracking-tight">
                    Why Tutors Across India Are Breaking Free
                </h2>
                <p className="text-neutral-400 text-sm sm:text-base mt-3">
                    Traditional directories make money by selling you coins. Celoris makes money only when the creator economy grows.
                </p>
            </div>

            {/* Battle Container */}
            <div className="grid lg:grid-cols-12 gap-8 items-center relative">
                
                {/* Left Card: The Old Model (5 Cols) */}
                <motion.div
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.3 }}
                    className="lg:col-span-5 rounded-3xl p-6 sm:p-8 bg-[#08090d]/85 border border-rose-900/30 relative shadow-[0_20px_50px_rgba(0,0,0,0.85)] overflow-hidden backdrop-blur-3xl"
                >
                    <div className="absolute top-0 right-0 w-40 h-40 bg-rose-500/10 blur-[80px] pointer-events-none rounded-full" />
                    
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-rose-900/30">
                        <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-full bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
                                <Lock size={16} />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-white leading-tight">The Old Directory Trap</h3>
                                <p className="text-[11px] text-neutral-400">Typical lead-selling tutor platforms</p>
                            </div>
                        </div>
                        <span className="text-[10px] uppercase font-mono px-3 py-1 rounded-full bg-rose-950/60 text-rose-400 border border-rose-800/40 font-bold">
                            Expensive
                        </span>
                    </div>

                    <div className="space-y-3.5 text-xs sm:text-sm text-neutral-300">
                        <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-start gap-3">
                            <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                            <div>
                                <strong className="text-white block mb-0.5 text-xs font-semibold">Pay-Per-Lead "Coin" Paywalls</strong>
                                <span className="text-neutral-400 text-xs">Forced to spend ₹2,000–₹5,000 for credits just to view a student's phone number.</span>
                            </div>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-start gap-3">
                            <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                            <div>
                                <strong className="text-white block mb-0.5 text-xs font-semibold">20% to 30% Commission Cut</strong>
                                <span className="text-neutral-400 text-xs">Every time a student pays you, the platform takes hundreds or thousands of rupees.</span>
                            </div>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-start gap-3">
                            <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                            <div>
                                <strong className="text-white block mb-0.5 text-xs font-semibold">Many Tutors Chasing 1 Lead</strong>
                                <span className="text-neutral-400 text-xs">They sell the same student phone number to multiple trainers, triggering a bidding race to the bottom.</span>
                            </div>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-start gap-3">
                            <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                            <div>
                                <strong className="text-white block mb-0.5 text-xs font-semibold">Payouts That Take Weeks</strong>
                                <span className="text-neutral-400 text-xs">Your fees sit with the platform for a week or even a month before they reach you.</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Center "VS" Badge (2 Cols) */}
                <div className="lg:col-span-2 flex flex-col items-center justify-center py-4 lg:py-0">
                    <div className="w-14 h-14 rounded-full bg-[#08090d] border border-white/[0.15] flex items-center justify-center shadow-2xl relative">
                        <span className="font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-emerald-400 font-mono">
                            VS
                        </span>
                    </div>
                </div>

                {/* Right Card: The Celoris Freedom Model (5 Cols) */}
                <motion.div
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.3 }}
                    className="lg:col-span-5 rounded-3xl p-6 sm:p-8 bg-[#08090d]/90 border border-emerald-500/35 relative shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_40px_rgba(16,185,129,0.1)] overflow-hidden backdrop-blur-3xl"
                >
                    <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/15 blur-[90px] pointer-events-none rounded-full" />
                    
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-emerald-500/30">
                        <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
                                <Unlock size={16} />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-white leading-tight">Celoris Freedom Network</h3>
                                <p className="text-[11px] text-emerald-400 font-mono">100% Free For Trainers</p>
                            </div>
                        </div>
                        <span className="text-[10px] uppercase font-mono px-3 py-1 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 font-bold">
                            0% Commission
                        </span>
                    </div>

                    <div className="space-y-3.5 text-xs sm:text-sm text-neutral-200">
                        <div className="p-3.5 rounded-2xl bg-emerald-500/[0.06] border border-emerald-400/20 flex items-start gap-3">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                            <div>
                                <strong className="text-white block mb-0.5 text-xs font-semibold">₹0 Registration &amp; Zero Coins</strong>
                                <span className="text-neutral-300 text-xs">Never spend a single rupee to view, message, or teach students who request your help.</span>
                            </div>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-emerald-500/[0.06] border border-emerald-400/20 flex items-start gap-3">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                            <div>
                                <strong className="text-white block mb-0.5 text-xs font-semibold">0% Platform Cut (Keep 100%)</strong>
                                <span className="text-neutral-300 text-xs">If you charge ₹1,500/hour or ₹10,000/month, every rupee lands in your Celoris wallet and you withdraw it to your own UPI.</span>
                            </div>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-emerald-500/[0.06] border border-emerald-400/20 flex items-start gap-3">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                            <div>
                                <strong className="text-white block mb-0.5 text-xs font-semibold">Direct In-App Messenger &amp; Live Rooms</strong>
                                <span className="text-neutral-300 text-xs">Students connect directly inside Celoris. Conduct 1-on-1 audio/video sessions with zero platform leaks.</span>
                            </div>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-emerald-500/[0.06] border border-emerald-400/20 flex items-start gap-3">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                            <div>
                                <strong className="text-white block mb-0.5 text-xs font-semibold">Creative Studios Built In</strong>
                                <span className="text-neutral-300 text-xs">PhotoLite, Video Studio, Motion Swap and PolyVault 3D in one place. Editing tools are free; AI generations are pay-per-use with credits.</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

            </div>
        </section>
    )
}
