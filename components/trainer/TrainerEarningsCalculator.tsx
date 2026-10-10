"use client"

import React, { useState } from 'react'
import { TrendingUp, ArrowRight, Check } from 'lucide-react'
import Link from 'next/link'

export function TrainerEarningsCalculator() {
    const [hourlyRate, setHourlyRate] = useState<number>(800)
    const [hoursPerWeek, setHoursPerWeek] = useState<number>(12)

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
        <div className="w-full bg-[#08090d]/85 border border-white/[0.12] rounded-3xl p-6 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.85)] relative overflow-hidden backdrop-blur-3xl">
            {/* Ambient Lighting */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 blur-[100px] pointer-events-none rounded-full" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/10 blur-[100px] pointer-events-none rounded-full" />

            <div className="relative z-10">
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto mb-10">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 mb-3">
                        <TrendingUp className="w-3.5 h-3.5" />
                        Interactive Income &amp; Savings Calculator
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
                        See What You Keep with 0% Commission
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-300 mt-2">
                        Slide your rates and schedule below to calculate your real monthly take-home earnings on Celoris vs traditional lead-selling platforms.
                    </p>
                </div>

                <div className="grid lg:grid-cols-12 gap-8 items-center">
                    {/* Controls (7 Cols) */}
                    <div className="lg:col-span-7 space-y-6 bg-white/[0.03] p-6 sm:p-8 rounded-2xl border border-white/[0.08] backdrop-blur-xl">
                        {/* Control 1: Hourly Rate */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-xs sm:text-sm font-medium text-neutral-200">
                                    Your Hourly Tuition / Class Rate (₹)
                                </label>
                                <span className="font-mono text-sm font-bold text-emerald-400 bg-white/[0.05] px-3 py-1 rounded-full border border-white/[0.1]">
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
                                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                                aria-label="Hourly Rate Slider"
                            />
                            <div className="flex justify-between text-[11px] text-neutral-500 font-mono mt-1">
                                <span>₹300/hr (Beginner)</span>
                                <span>₹1,500/hr (Pro)</span>
                                <span>₹3,000/hr (Master)</span>
                            </div>
                        </div>

                        {/* Control 2: Hours Per Week */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-xs sm:text-sm font-medium text-neutral-200">
                                    Teaching Hours Per Week
                                </label>
                                <span className="font-mono text-sm font-bold text-cyan-400 bg-white/[0.05] px-3 py-1 rounded-full border border-white/[0.1]">
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
                                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                                aria-label="Teaching Hours Per Week Slider"
                            />
                            <div className="flex justify-between text-[11px] text-neutral-500 font-mono mt-1">
                                <span>2 hrs (Weekend)</span>
                                <span>20 hrs (Regular)</span>
                                <span>40 hrs (Full-time)</span>
                            </div>
                        </div>

                        <p className="text-[11px] text-neutral-400 font-mono">
                            How we calculate: ₹{hourlyRate.toLocaleString('en-IN')}/hr × {hoursPerWeek} hrs/week × 4 weeks = ₹{monthlyGross.toLocaleString('en-IN')}/month.
                            The comparison assumes a 20% cut plus about ₹2,500/month in coins on a typical lead-selling platform (many take 20–30%).
                        </p>
                    </div>

                    {/* Results Card (5 Cols) */}
                    <div className="lg:col-span-5 bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/[0.12] p-6 sm:p-8 rounded-2xl relative shadow-2xl flex flex-col justify-between backdrop-blur-2xl">
                        <div>
                            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold bg-white/[0.05] px-3 py-1 rounded-full border border-white/[0.1]">
                                Celoris 100% Take-Home
                            </span>
                            <div className="mt-4 mb-2">
                                <span className="text-xs text-neutral-400 block">Your Real Monthly Earnings</span>
                                <div className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 font-mono tracking-tight">
                                    ₹{celorisNetEarnings.toLocaleString('en-IN')}
                                </div>
                                <span className="text-xs text-neutral-400">/ month into your Celoris wallet, withdraw to your UPI</span>
                            </div>
                        </div>

                        {/* Platform Savings Breakdown */}
                        <div className="my-5 p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] space-y-2">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-neutral-300">Celoris Platform Fee:</span>
                                <span className="font-mono font-bold text-emerald-400">₹0 (0% Cut)</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-neutral-300">Typical platform fee (20% + coins):</span>
                                <span className="font-mono font-bold text-rose-400 line-through">₹{traditionalPlatformLoss.toLocaleString('en-IN')}/mo</span>
                            </div>
                            <div className="pt-2 border-t border-white/[0.08] flex justify-between items-center text-xs font-bold">
                                <span className="text-emerald-300">Your Annual Commission Savings:</span>
                                <span className="font-mono text-emerald-400">₹{annualSavings.toLocaleString('en-IN')}/yr</span>
                            </div>
                        </div>

                        <ul className="text-xs text-neutral-300 space-y-2 mb-6">
                            <li className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                                <span>Students pay your wallet; you withdraw to your UPI</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                                <span>Zero coin packages to view phone numbers</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                                <span>Creative studios built in (AI tools are pay-per-use)</span>
                            </li>
                        </ul>

                        <Link
                            href="/register"
                            className="inline-flex items-center justify-center gap-2.5 w-full px-6 py-3.5 rounded-full bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-emerald-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 border border-emerald-400/40 hover:border-emerald-300/60 text-white font-medium text-sm backdrop-blur-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_25px_rgba(16,185,129,0.2)] cursor-pointer"
                        >
                            <span>Claim 0% Commission Profile</span>
                            <ArrowRight size={16} className="text-emerald-400" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
