"use client"

import React from 'react'
import { motion } from 'framer-motion'
import {
    XCircle, CheckCircle2, AlertTriangle, ShieldCheck,
    Coins, IndianRupee, Zap, Lock, Unlock, PhoneCall
} from 'lucide-react'

export function TrainerBattleCard() {
    return (
        <section id="comparison" className="py-20 px-4 sm:px-6 max-w-6xl mx-auto scroll-mt-20">
            {/* Section Header */}
            <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-rose-500/15 text-rose-400 border border-rose-500/30 mb-3">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    The Industry Breakdown
                </span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
                    Why Tutors Across India Are Breaking Free
                </h2>
                <p className="text-slate-400 text-sm sm:text-base mt-3">
                    Traditional directories make money by selling you coins. Celoris makes money only when the creator economy grows.
                </p>
            </div>

            {/* Battle Container */}
            <div className="grid lg:grid-cols-12 gap-8 items-center relative">
                
                {/* Left Card: The Old Model (5 Cols) */}
                <motion.div
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.3 }}
                    className="lg:col-span-5 rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-rose-950/20 via-slate-900/60 to-slate-950/90 border border-rose-900/40 relative shadow-2xl overflow-hidden backdrop-blur-xl"
                >
                    <div className="absolute top-0 right-0 w-40 h-40 bg-rose-500/10 blur-[80px] pointer-events-none rounded-full" />
                    
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-rose-900/30">
                        <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                                <Lock size={18} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white leading-tight">The Old Directory Trap</h3>
                                <p className="text-[11px] text-slate-400">UrbanPro, TeacherOn, Superprof</p>
                            </div>
                        </div>
                        <span className="text-[10px] uppercase font-mono px-2.5 py-1 rounded-full bg-rose-950 text-rose-400 border border-rose-800/40 font-bold">
                            Expensive
                        </span>
                    </div>

                    <div className="space-y-4 text-xs sm:text-sm text-slate-300">
                        <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-900/40 flex items-start gap-3">
                            <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                            <div>
                                <strong className="text-white block mb-0.5">Pay-Per-Lead "Coin" Paywalls</strong>
                                <span className="text-slate-400 text-xs">Forced to spend ₹2,000–₹5,000 for credits just to view a student's phone number.</span>
                            </div>
                        </div>

                        <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-900/40 flex items-start gap-3">
                            <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                            <div>
                                <strong className="text-white block mb-0.5">20% to 30% Commission Cut</strong>
                                <span className="text-slate-400 text-xs">Every time a student pays you, the platform takes hundreds or thousands of rupees.</span>
                            </div>
                        </div>

                        <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-900/40 flex items-start gap-3">
                            <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                            <div>
                                <strong className="text-white block mb-0.5">10 Tutors Competing on 1 Lead</strong>
                                <span className="text-slate-400 text-xs">They sell the same student phone number to multiple trainers, triggering a bidding race to the bottom.</span>
                            </div>
                        </div>

                        <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-900/40 flex items-start gap-3">
                            <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                            <div>
                                <strong className="text-white block mb-0.5">Delayed Payouts & Message Filters</strong>
                                <span className="text-slate-400 text-xs">Strict filters blocking you from sharing phone numbers or getting paid directly.</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Center "VS" Badge (2 Cols) */}
                <div className="lg:col-span-2 flex flex-col items-center justify-center py-4 lg:py-0">
                    <div className="w-16 h-16 rounded-full bg-slate-900 border-2 border-white/20 flex items-center justify-center shadow-2xl relative">
                        <span className="font-black text-xl text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-emerald-400 font-mono">
                            VS
                        </span>
                    </div>
                </div>

                {/* Right Card: The Celoris Freedom Model (5 Cols) */}
                <motion.div
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.3 }}
                    className="lg:col-span-5 rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-emerald-950/30 via-slate-900/70 to-slate-950/90 border-2 border-emerald-500/50 relative shadow-2xl shadow-emerald-950/50 overflow-hidden backdrop-blur-xl"
                >
                    <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/15 blur-[90px] pointer-events-none rounded-full" />
                    
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-emerald-500/30">
                        <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                                <Unlock size={18} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white leading-tight">Celoris Freedom Network</h3>
                                <p className="text-[11px] text-emerald-400 font-mono">100% Free For Trainers</p>
                            </div>
                        </div>
                        <span className="text-[10px] uppercase font-mono px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/40 font-bold">
                            0% Commission
                        </span>
                    </div>

                    <div className="space-y-4 text-xs sm:text-sm text-slate-200">
                        <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                            <div>
                                <strong className="text-white block mb-0.5">₹0 Registration & Zero Coins</strong>
                                <span className="text-slate-300 text-xs">Never spend a single rupee to view, message, or teach students who request your help.</span>
                            </div>
                        </div>

                        <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                            <div>
                                <strong className="text-white block mb-0.5">0% Platform Cut (Keep 100%)</strong>
                                <span className="text-slate-300 text-xs">If you charge ₹1,500/hour or ₹10,000/month, every single rupee goes into your bank account.</span>
                            </div>
                        </div>

                        <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                            <div>
                                <strong className="text-white block mb-0.5">Direct Student WhatsApp & Calls</strong>
                                <span className="text-slate-300 text-xs">Students connect directly with you. You control your schedule, trial classes, and curriculum.</span>
                            </div>
                        </div>

                        <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                            <div>
                                <strong className="text-white block mb-0.5">Free AI Creative Studio Suite</strong>
                                <span className="text-slate-300 text-xs">Access PhotoLite, Video Studio, Motion Swap, and PolyVault 3D completely free of charge.</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

            </div>
        </section>
    )
}
