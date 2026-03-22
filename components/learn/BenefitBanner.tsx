"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { ShieldCheck, Zap, IndianRupee, Users, ArrowRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function BenefitBanner() {
    return (
        <section className="py-24 relative overflow-hidden z-10 px-8">
            <div className="max-w-6xl mx-auto">
                <div className="bg-[#0d1321] rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl relative group">
                    {/* Background Glow */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px] pointer-events-none group-hover:bg-emerald-500/10 transition-colors duration-1000" />
                    
                    <div className="flex flex-col lg:flex-row min-h-[500px]">
                        {/* Image Side */}
                        <div className="lg:w-[40%] relative min-h-[400px]">
                            <img 
                                src="/images/teacher-banner.jpg" 
                                alt="Professional Teacher" 
                                className="absolute inset-0 w-full h-full object-cover filter brightness-90 saturate-[0.8]"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#0d1321] hidden lg:block" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0d1321] via-transparent to-transparent lg:hidden" />
                        </div>

                        {/* Content Side */}
                        <div className="lg:w-[60%] p-12 lg:p-20 flex flex-col justify-center relative z-10">
                            <div className="mb-12">
                                <h2 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter leading-tight mb-4">
                                    Stop paying <br />
                                    <span className="text-emerald-500">for fake leads.</span>
                                </h2>
                                <p className="text-lg text-slate-400 font-medium italic">
                                    Traditional platforms eat your profits with coin charges.
                                </p>
                            </div>

                            <div className="space-y-8">
                                <div className="flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase tracking-[0.4em] mb-8">
                                    THE CELORIS DIFFERENCE
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Card 1 */}
                                    <div className="bg-white/[0.03] border border-white/5 p-8 rounded-[2rem] hover:bg-white/[0.05] transition-all group/card shadow-2xl shadow-black/20">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center border border-amber-400/20 shadow-lg shadow-amber-500/10">
                                                <IndianRupee size={20} className="text-white" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-black text-white italic uppercase tracking-tight">Per-lead cost: ₹0</h3>
                                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Others charge ₹50-200</p>
                                            </div>
                                        </div>
                                        <p className="text-sm text-slate-400 font-medium italic leading-relaxed">
                                            Connect free. Pay only when students actually enrol.
                                        </p>
                                    </div>

                                    {/* Card 2 */}
                                    <div className="bg-white/[0.03] border border-white/5 p-8 rounded-[2rem] hover:bg-white/[0.05] transition-all group/card shadow-2xl shadow-black/20">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center border border-emerald-400/20 shadow-lg shadow-emerald-500/10">
                                                <span className="text-xl font-black text-white uppercase italic">V</span>
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-black text-white italic uppercase tracking-tight">Verified Students</h3>
                                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Delhi/NCR + all of India</p>
                                            </div>
                                        </div>
                                        <p className="text-sm text-slate-400 font-medium italic leading-relaxed">
                                            Real local learners for offline or online classes.
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-12 flex justify-center md:justify-start">
                                    <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl px-12 h-16 font-black uppercase tracking-widest text-xs shadow-2xl shadow-emerald-500/20 transition-all border-none group/btn" asChild>
                                        <Link href="/teach" className="flex items-center gap-3">
                                            Start Teaching <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
