"use client"

import React, { useState } from 'react'
import { IndianRupee, TrendingUp, Sparkles, ArrowRight, ShieldCheck, Check } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function TrainerEarningsCalculator() {
    const [hourlyRate, setHourlyRate] = useState<number>(800)
    const [hoursPerWeek, setHoursPerWeek] = useState<number>(12)
    const [studentsCount, setStudentsCount] = useState<number>(4)

    // Monthly hours = hoursPerWeek * 4
    const totalMonthlyHours = hoursPerWeek * 4
    // Monthly gross earnings
    const monthlyGross = hourlyRate * totalMonthlyHours
    // What traditional platforms take: ~20% commission + approx ₹2,500 monthly coin/listing package
    const traditionalPlatformLoss = Math.round(monthlyGross * 0.20 + 2500)
    // Celoris Platform Take = 0
    const celorisNetEarnings = monthlyGross
    // Annual Savings on Celoris
    const annualSavings = traditionalPlatformLoss * 12

    return (
        <div className="w-full bg-[#0a101d] border border-emerald-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden backdrop-blur-xl">
            {/* Ambient Lighting */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 blur-[100px] pointer-events-none rounded-full" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 blur-[100px] pointer-events-none rounded-full" />

            <div className="relative z-10">
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto mb-10">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 mb-3">
                        <TrendingUp className="w-3.5 h-3.5" />
                        Interactive Income & Savings Calculator
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                        See What You Keep with 0% Commission
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 mt-2">
                        Slide your rates and schedule below to calculate your real monthly take-home earnings on Celoris vs traditional lead-selling platforms.
                    </p>
                </div>

                <div className="grid lg:grid-cols-12 gap-8 items-center">
                    {/* Controls (7 Cols) */}
                    <div className="lg:col-span-7 space-y-6 bg-slate-900/50 p-6 sm:p-8 rounded-2xl border border-slate-800/80">
                        {/* Control 1: Hourly Rate */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-xs sm:text-sm font-bold text-slate-200">
                                    Your Hourly Tuition / Class Rate (₹)
                                </label>
                                <span className="font-mono text-base font-black text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-lg border border-emerald-800/40">
                                    ₹{hourlyRate.toLocaleString('en-IN')}/hr
                                </span>
                            </div>
                            <input
                                type="range"
                                min={300}
                                max={3000}
                                step={50}
                                value={hourlyRate}
                                onChange={(e) => setHourlyRate(Number(e.target.value))}
                                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                                aria-label="Hourly Rate Slider"
                            />
                            <div className="flex justify-between text-[11px] text-slate-500 font-mono mt-1">
                                <span>₹300/hr (Beginner)</span>
                                <span>₹1,500/hr (Pro)</span>
                                <span>₹3,000/hr (Master)</span>
                            </div>
                        </div>

                        {/* Control 2: Hours Per Week */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-xs sm:text-sm font-bold text-slate-200">
                                    Teaching Hours Per Week
                                </label>
                                <span className="font-mono text-base font-black text-cyan-400 bg-cyan-950/60 px-3 py-1 rounded-lg border border-cyan-800/40">
                                    {hoursPerWeek} hrs/week
                                </span>
                            </div>
                            <input
                                type="range"
                                min={2}
                                max={40}
                                step={1}
                                value={hoursPerWeek}
                                onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                                aria-label="Teaching Hours Per Week Slider"
                            />
                            <div className="flex justify-between text-[11px] text-slate-500 font-mono mt-1">
                                <span>2 hrs (Part-time weekend)</span>
                                <span>20 hrs (Regular)</span>
                                <span>40 hrs (Full-time)</span>
                            </div>
                        </div>

                        {/* Control 3: Active Students / Batches */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-xs sm:text-sm font-bold text-slate-200">
                                    Active Students / Batches
                                </label>
                                <span className="font-mono text-base font-black text-purple-400 bg-purple-950/60 px-3 py-1 rounded-lg border border-purple-800/40">
                                    {studentsCount} Students
                                </span>
                            </div>
                            <input
                                type="range"
                                min={1}
                                max={20}
                                step={1}
                                value={studentsCount}
                                onChange={(e) => setStudentsCount(Number(e.target.value))}
                                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
                                aria-label="Active Students Slider"
                            />
                            <div className="flex justify-between text-[11px] text-slate-500 font-mono mt-1">
                                <span>1 Student</span>
                                <span>10 Students</span>
                                <span>20+ Students</span>
                            </div>
                        </div>
                    </div>

                    {/* Results Card (5 Cols) */}
                    <div className="lg:col-span-5 bg-gradient-to-b from-[#0e1a2f] to-[#09111e] rounded-2xl p-6 sm:p-8 border border-emerald-500/40 shadow-xl relative">
                        <div className="text-xs uppercase tracking-widest font-mono text-slate-400 font-bold mb-1">
                            Your Monthly Take-Home on Celoris
                        </div>
                        <div className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tight my-3 flex items-baseline gap-1">
                            <span className="text-emerald-400">₹</span>
                            <span>{celorisNetEarnings.toLocaleString('en-IN')}</span>
                            <span className="text-xs font-sans text-slate-400 font-normal">/month</span>
                        </div>

                        {/* Platform Savings Breakdown */}
                        <div className="my-5 p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/20 space-y-2">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-300">Celoris Platform Fee:</span>
                                <span className="font-mono font-bold text-emerald-400">₹0 (0% Cut)</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-300">Other Platforms Fee (~20% + Coins):</span>
                                <span className="font-mono font-bold text-rose-400 line-through">₹{traditionalPlatformLoss.toLocaleString('en-IN')}/mo</span>
                            </div>
                            <div className="pt-2 border-t border-emerald-500/20 flex justify-between items-center text-xs font-bold">
                                <span className="text-emerald-300">Your Annual Commission Savings:</span>
                                <span className="font-mono text-emerald-400">₹{annualSavings.toLocaleString('en-IN')}/yr</span>
                            </div>
                        </div>

                        <ul className="text-xs text-slate-300 space-y-2 mb-6">
                            <li className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                                <span>Direct UPI/Bank transfer from students</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                                <span>Zero coin packages to view phone numbers</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                                <span>Free access to Celoris AI Creative Studios</span>
                            </li>
                        </ul>

                        <Button
                            size="lg"
                            className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black h-12 rounded-xl text-sm shadow-xl shadow-emerald-500/20 transition-all hover:scale-[1.02]"
                            asChild
                        >
                            <Link href="/register" className="flex items-center justify-center gap-2">
                                Claim 0% Commission Profile
                                <ArrowRight size={16} />
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
