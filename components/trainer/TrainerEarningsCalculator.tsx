"use client"

import React, { useEffect, useRef, useState } from 'react'
import { TrendingUp, ArrowRight, Check, Scissors, Users } from 'lucide-react'
import Link from 'next/link'
import { loadTrainerDemand, type DemandSubject } from '@/lib/trainer-demand'

// Interactive income calculator with lightweight motion:
//  - a two-lane "rupee flow" (CSS transforms only, paused off-screen)
//  - rolling numbers, a keep-vs-lose bar, and a one-time self-playing demo
//  - real student-demand chips from /api/public/trainer-demand
// No new libraries, no video/Lottie. Everything stops for prefers-reduced-motion.

const PLATFORM_CUT = 0.2
const COIN_PACKS_PER_MONTH = 2500
const RENT_PER_MONTH = 12000

function useInView<T extends Element>(ref: React.RefObject<T | null>, rootMargin = '0px') {
    const [inView, setInView] = useState(false)
    useEffect(() => {
        const el = ref.current
        if (!el || typeof IntersectionObserver === 'undefined') {
            setInView(true)
            return
        }
        const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin })
        io.observe(el)
        return () => io.disconnect()
    }, [ref, rootMargin])
    return inView
}

function prefersReducedMotion() {
    try {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches
    } catch {
        return false
    }
}

/** Number that rolls to its new value (~450ms) instead of jumping. */
function RollingNumber({ value, prefix = '₹', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
    const [shown, setShown] = useState(value)
    const fromRef = useRef(value)
    useEffect(() => {
        if (prefersReducedMotion()) {
            setShown(value)
            fromRef.current = value
            return
        }
        const from = fromRef.current
        const start = performance.now()
        const dur = 450
        let raf = 0
        const tick = (t: number) => {
            const p = Math.min(1, (t - start) / dur)
            const eased = 1 - Math.pow(1 - p, 3)
            const v = Math.round(from + (value - from) * eased)
            setShown(v)
            if (p < 1) raf = requestAnimationFrame(tick)
            else fromRef.current = value
        }
        raf = requestAnimationFrame(tick)
        return () => {
            cancelAnimationFrame(raf)
            fromRef.current = value
        }
    }, [value])
    return (
        <>
            {prefix}
            {shown.toLocaleString('en-IN')}
            {suffix}
        </>
    )
}

/** Two lanes of coins: every coin reaches you on Celoris; one in five is snipped on a 20% platform. */
function RupeeFlow({ coins, running }: { coins: number; running: boolean }) {
    const list = Array.from({ length: coins }, (_, i) => i)
    const duration = 3.2
    return (
        <div className={`rf-root ${running ? '' : 'rf-paused'}`} aria-hidden="true">
            {/* Lane 1: Celoris */}
            <div className="rf-lane">
                <span className="rf-label rf-label-left">Student</span>
                <div className="rf-track">
                    {list.map((i) => (
                        <div key={`a${i}`} className="rf-runner rf-go" style={{ animationDelay: `${(i * duration) / coins}s`, animationDuration: `${duration}s` }}>
                            <span className="rf-coin rf-coin-green">₹</span>
                        </div>
                    ))}
                </div>
                <span className="rf-label rf-label-right text-emerald-300">Your UPI</span>
            </div>
            <div className="rf-caption text-emerald-300/80">Celoris · 0% cut · every rupee arrives</div>

            {/* Lane 2: typical lead-selling platform */}
            <div className="rf-lane mt-3">
                <span className="rf-label rf-label-left">Student</span>
                <div className="rf-track">
                    <span className="rf-scissors" title="20% platform cut">
                        <Scissors className="w-3.5 h-3.5" />
                    </span>
                    {list.map((i) => {
                        const cut = i % 5 === 0
                        return (
                            <div
                                key={`b${i}`}
                                className={`rf-runner ${cut ? 'rf-cut' : 'rf-go'}`}
                                style={{ animationDelay: `${(i * duration) / coins + 0.4}s`, animationDuration: `${duration}s` }}
                            >
                                <span className={`rf-coin ${cut ? 'rf-coin-red' : 'rf-coin-grey'}`}>₹</span>
                            </div>
                        )
                    })}
                </div>
                <span className="rf-label rf-label-right text-neutral-400">You</span>
            </div>
            <div className="rf-caption text-rose-300/80">Typical platform · 20% cut + coin packs</div>

            <style>{`
                .rf-root { position: relative; }
                .rf-lane { display: grid; grid-template-columns: 52px 1fr 60px; align-items: center; gap: 8px; }
                .rf-label { font-size: 10px; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; color: rgb(163 163 163); white-space: nowrap; }
                .rf-label-right { text-align: right; }
                .rf-track { position: relative; height: 26px; border-radius: 999px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); overflow: hidden; }
                .rf-runner { position: absolute; inset: 0; transform: translateX(-12%); animation-timing-function: linear; animation-iteration-count: infinite; will-change: transform, opacity; }
                .rf-coin { position: absolute; left: 0; top: 3px; width: 18px; height: 18px; border-radius: 999px; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 800; }
                .rf-coin-green { background: linear-gradient(135deg,#34d399,#14b8a6); color: #052e1f; box-shadow: 0 0 10px rgba(52,211,153,.55); }
                .rf-coin-grey { background: linear-gradient(135deg,#a3a3a3,#737373); color: #111; }
                .rf-coin-red { background: linear-gradient(135deg,#fb7185,#e11d48); color: #2a0510; }
                .rf-scissors { position: absolute; left: 55%; top: 50%; transform: translate(-50%,-50%); color: #fb7185; z-index: 2; opacity: .9; }
                .rf-go { animation-name: rf-go; }
                .rf-cut { animation-name: rf-cut; }
                @keyframes rf-go { from { transform: translateX(-12%); opacity: 0; } 8% { opacity: 1; } 92% { opacity: 1; } to { transform: translateX(96%); opacity: 0; } }
                @keyframes rf-cut { from { transform: translateX(-12%); opacity: 0; } 8% { opacity: 1; } 52% { transform: translateX(52%) translateY(0); opacity: 1; } 70% { transform: translateX(54%) translateY(26px); opacity: 0; } to { transform: translateX(54%) translateY(26px); opacity: 0; } }
                .rf-caption { font-size: 10px; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; margin: 4px 0 0 60px; }
                .rf-paused .rf-runner { animation-play-state: paused; }
                @media (prefers-reduced-motion: reduce) {
                    .rf-runner { animation: none !important; opacity: 1 !important; }
                    .rf-go { transform: translateX(80%) !important; }
                    .rf-cut { transform: translateX(52%) translateY(14px) !important; opacity: .5 !important; }
                }
                .tc-hint { animation: tc-pulse 1.4s ease-in-out infinite; }
                @keyframes tc-pulse { 0%,100% { opacity: .55; } 50% { opacity: 1; } }
                @media (prefers-reduced-motion: reduce) { .tc-hint { animation: none; } }
            `}</style>
        </div>
    )
}

export function TrainerEarningsCalculator() {
    const [hourlyRate, setHourlyRate] = useState<number>(800)
    const [hoursPerWeek, setHoursPerWeek] = useState<number>(12)
    const [showHint, setShowHint] = useState(false)
    const [demand, setDemand] = useState<DemandSubject[]>([])
    const [demandTotal, setDemandTotal] = useState(0)

    const rootRef = useRef<HTMLDivElement>(null)
    const inView = useInView(rootRef, '0px 0px -15% 0px')
    const nearView = useInView(rootRef, '400px 0px 400px 0px')
    const touchedRef = useRef(false)
    const demoDoneRef = useRef(false)

    // Maths (unchanged from before, so the numbers stay honest and explained below the sliders)
    const totalMonthlyHours = hoursPerWeek * 4
    const monthlyGross = hourlyRate * totalMonthlyHours
    const traditionalPlatformLoss = Math.round(monthlyGross * PLATFORM_CUT + COIN_PACKS_PER_MONTH)
    const celorisNetEarnings = monthlyGross
    const annualSavings = traditionalPlatformLoss * 12
    const platformKeepPct = monthlyGross > 0 ? Math.max(0, (monthlyGross - traditionalPlatformLoss) / monthlyGross) : 0
    const perClassLost = Math.round(hourlyRate * PLATFORM_CUT)
    const rentMonths = Math.floor(annualSavings / RENT_PER_MONTH)
    const coins = Math.min(9, Math.max(4, Math.round(monthlyGross / 8000) + 3))

    // One-time self-playing demo when the calculator first scrolls into view.
    // It finishes even if the visitor scrolls on, and stops the moment they touch a slider.
    const demoRafRef = useRef(0)
    useEffect(() => () => cancelAnimationFrame(demoRafRef.current), [])
    useEffect(() => {
        if (!inView || demoDoneRef.current || touchedRef.current) return
        demoDoneRef.current = true
        if (prefersReducedMotion()) {
            setShowHint(true)
            return
        }
        const from = { r: 300, h: 2 }
        const to = { r: 800, h: 12 }
        const start = performance.now()
        const dur = 1700
        const tick = (t: number) => {
            if (touchedRef.current) return
            const p = Math.min(1, (t - start) / dur)
            const e = 1 - Math.pow(1 - p, 3)
            setHourlyRate(Math.round((from.r + (to.r - from.r) * e) / 50) * 50)
            setHoursPerWeek(Math.round(from.h + (to.h - from.h) * e))
            if (p < 1) demoRafRef.current = requestAnimationFrame(tick)
            else setShowHint(true)
        }
        demoRafRef.current = requestAnimationFrame(tick)
    }, [inView])

    // Real demand, fetched only when the visitor gets near this section.
    useEffect(() => {
        if (!nearView || demand.length) return
        let cancelled = false
        loadTrainerDemand().then((d) => {
            if (cancelled) return
            if (d.total30 >= 5 && d.subjects.length) {
                setDemand(d.subjects.slice(0, 5))
                setDemandTotal(d.total30)
            }
        })
        return () => {
            cancelled = true
        }
    }, [nearView, demand.length])

    const onUserInput = () => {
        touchedRef.current = true
        setShowHint(false)
    }

    return (
        <div
            ref={rootRef}
            className="w-full bg-[#08090d]/85 border border-white/[0.12] rounded-3xl p-6 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.85)] relative overflow-hidden backdrop-blur-3xl"
        >
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

                <div className="grid lg:grid-cols-12 gap-8 items-stretch">
                    {/* Controls + motion (7 Cols) */}
                    <div className="lg:col-span-7 space-y-6 bg-white/[0.03] p-6 sm:p-8 rounded-2xl border border-white/[0.08] backdrop-blur-xl">
                        {/* Control 1: Hourly Rate */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label htmlFor="tc-rate" className="text-xs sm:text-sm font-medium text-neutral-200">
                                    Your Hourly Tuition / Class Rate (₹)
                                </label>
                                <span className="font-mono text-sm font-bold text-emerald-400 bg-white/[0.05] px-3 py-1 rounded-full border border-white/[0.1] tabular-nums">
                                    ₹{hourlyRate.toLocaleString('en-IN')}/hr
                                </span>
                            </div>
                            <input
                                id="tc-rate"
                                type="range"
                                min={300}
                                max={3000}
                                step={50}
                                value={hourlyRate}
                                onPointerDown={onUserInput}
                                onKeyDown={onUserInput}
                                onChange={(e) => {
                                    onUserInput()
                                    setHourlyRate(Number(e.target.value))
                                }}
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
                                <label htmlFor="tc-hours" className="text-xs sm:text-sm font-medium text-neutral-200">
                                    Teaching Hours Per Week
                                </label>
                                <span className="font-mono text-sm font-bold text-cyan-400 bg-white/[0.05] px-3 py-1 rounded-full border border-white/[0.1] tabular-nums">
                                    {hoursPerWeek} hrs/week
                                </span>
                            </div>
                            <input
                                id="tc-hours"
                                type="range"
                                min={2}
                                max={40}
                                step={1}
                                value={hoursPerWeek}
                                onPointerDown={onUserInput}
                                onKeyDown={onUserInput}
                                onChange={(e) => {
                                    onUserInput()
                                    setHoursPerWeek(Number(e.target.value))
                                }}
                                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                                aria-label="Teaching Hours Per Week Slider"
                            />
                            <div className="flex justify-between text-[11px] text-neutral-500 font-mono mt-1">
                                <span>2 hrs (Weekend)</span>
                                <span>20 hrs (Regular)</span>
                                <span>40 hrs (Full-time)</span>
                            </div>
                            {showHint && (
                                <p className="tc-hint mt-2 text-[11px] font-mono text-emerald-300">↑ Now try your own rate and hours</p>
                            )}
                        </div>

                        {/* Rupee flow animation */}
                        <div className="pt-1">
                            <RupeeFlow coins={coins} running={inView} />
                        </div>

                        {/* Keep vs lose bars */}
                        <div className="space-y-2">
                            <div>
                                <div className="flex justify-between text-[11px] font-mono text-neutral-300 mb-1">
                                    <span>You keep on Celoris</span>
                                    <span className="text-emerald-300 tabular-nums">100%</span>
                                </div>
                                <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                                    <div className="h-full w-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-300" />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-[11px] font-mono text-neutral-300 mb-1">
                                    <span>You keep on a 20% platform (after coin packs)</span>
                                    <span className="text-rose-300 tabular-nums">{Math.round(platformKeepPct * 100)}%</span>
                                </div>
                                <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                                    <div
                                        className="h-full w-full rounded-full bg-gradient-to-r from-neutral-400 to-neutral-500 origin-left transition-transform duration-500 ease-out motion-reduce:transition-none"
                                        style={{ transform: `scaleX(${platformKeepPct})` }}
                                    />
                                </div>
                            </div>
                        </div>

                        <p className="text-[11px] text-neutral-400 font-mono">
                            How we calculate: ₹{hourlyRate.toLocaleString('en-IN')}/hr × {hoursPerWeek} hrs/week × 4 weeks = ₹{monthlyGross.toLocaleString('en-IN')}/month.
                            The comparison assumes a 20% cut plus about ₹2,500/month in coins on a typical lead-selling platform (many take 20–30%).
                        </p>

                        {/* Real demand */}
                        {demand.length > 0 && (
                            <div className="pt-4 border-t border-white/[0.08]">
                                <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-emerald-400 mb-2">
                                    <Users className="w-3.5 h-3.5" />
                                    <span>{demandTotal} student enquiries reached Celoris in the last 30 days</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {demand.map((d) => (
                                        <span
                                            key={d.name}
                                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/[0.1] text-xs text-neutral-200"
                                        >
                                            {d.name}
                                            <span className="font-mono text-emerald-300 tabular-nums">{d.count}</span>
                                        </span>
                                    ))}
                                </div>
                                <p className="mt-2 text-[11px] text-neutral-400">Teach one of these? Students are already asking.</p>
                            </div>
                        )}
                    </div>

                    {/* Results Card (5 Cols) */}
                    <div className="lg:col-span-5 bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/[0.12] p-6 sm:p-8 rounded-2xl relative shadow-2xl flex flex-col justify-between backdrop-blur-2xl">
                        <div>
                            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold bg-white/[0.05] px-3 py-1 rounded-full border border-white/[0.1]">
                                Celoris 100% Take-Home
                            </span>
                            <div className="mt-4 mb-2">
                                <span className="text-xs text-neutral-400 block">Your Real Monthly Earnings</span>
                                <div className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 font-mono tracking-tight tabular-nums">
                                    <RollingNumber value={celorisNetEarnings} />
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
                                <span className="font-mono font-bold text-rose-400 line-through tabular-nums">
                                    <RollingNumber value={traditionalPlatformLoss} suffix="/mo" />
                                </span>
                            </div>
                            <div className="pt-2 border-t border-white/[0.08] flex justify-between items-center text-xs font-bold">
                                <span className="text-emerald-300">Your Annual Commission Savings:</span>
                                <span className="font-mono text-emerald-400 tabular-nums">
                                    <RollingNumber value={annualSavings} suffix="/yr" />
                                </span>
                            </div>
                            <p className="pt-2 text-[11px] text-neutral-400 leading-relaxed">
                                Every 1-hour class: you keep <span className="text-emerald-300 font-semibold">₹{hourlyRate.toLocaleString('en-IN')}</span> here,
                                a 20% platform keeps <span className="text-rose-300 font-semibold">₹{perClassLost.toLocaleString('en-IN')}</span> of it.
                                {rentMonths >= 1 && (
                                    <>
                                        {' '}Over a year that is about <span className="text-white font-semibold">{rentMonths} months of rent</span> at ₹12,000/month.
                                    </>
                                )}
                            </p>
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
