"use client"

import React, { useState, useMemo } from "react"
import Link from "next/link"
import {
    ArrowRight, BadgeCheck, Briefcase, ClipboardCheck,
    MapPin, QrCode, ShieldCheck, Users, IndianRupee,
    Sparkles, CheckCircle2, ChevronDown, ChevronRight,
    Search, Filter, Share2, Bell, Zap, Laptop, Lock,
    Check, X, Award
} from "lucide-react"
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton"
import { JobAlertsForm } from "@/components/job-center/JobAlertsForm"
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon"

export interface PublicJob {
    id: string
    title: string
    company: string
    location: string
    pay: string
    industry: string
    workMode: string
    badges: string[]
    createdAt: string
}

const LOGIN_NEXT = "/login?next=%2Fjob-center"

const CATEGORIES = [
    "All",
    "3D & Unreal Engine",
    "Video & Reels",
    "UI/UX Design",
    "Web & Full-Stack",
    "AI & Prompting",
    "Marketing & Sales",
]

const WORK_MODES = ["All", "100% Remote", "Hybrid", "In-Office"]

// High-tier fallback roles if database is empty so visitors always see a bustling board
const CURATED_JOBS: PublicJob[] = [
    {
        id: "c1",
        title: "3D Blender & Vehicle Modeler",
        company: "Apex Interactive Studios",
        location: "Remote (India)",
        pay: "₹50,000 – ₹85,000 / mo",
        industry: "Gaming & 3D",
        workMode: "100% Remote",
        badges: ["Blender 3D", "PBR Texturing"],
        createdAt: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
    },
    {
        id: "c2",
        title: "Unreal Engine 5 Environment Artist",
        company: "Celoris Virtual Lab",
        location: "Delhi / Remote",
        pay: "₹60,000 – ₹1,10,000 / mo",
        industry: "Virtual Production",
        workMode: "100% Remote",
        badges: ["Unreal Engine 5", "Lumen & Nanite"],
        createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    },
    {
        id: "c3",
        title: "Senior YouTube Video Editor (Reels & Long-form)",
        company: "CreatorForge Media",
        location: "Remote (Pan-India)",
        pay: "₹35,000 – ₹55,000 / mo",
        industry: "Media & Creators",
        workMode: "100% Remote",
        badges: ["Premiere Pro", "After Effects"],
        createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    },
    {
        id: "c4",
        title: "Product Designer (Figma & Design Systems)",
        company: "FinFlow Technologies",
        location: "Bangalore / Hybrid",
        pay: "₹65,000 – ₹95,000 / mo",
        industry: "FinTech & SaaS",
        workMode: "Hybrid",
        badges: ["Figma UI/UX", "Design Systems"],
        createdAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    },
    {
        id: "c5",
        title: "Next.js & Supabase Full-Stack Engineer",
        company: "ScaleGrid Cloud",
        location: "Remote (India)",
        pay: "₹70,000 – ₹1,20,000 / mo",
        industry: "Cloud & Dev",
        workMode: "100% Remote",
        badges: ["TypeScript", "Next.js / React"],
        createdAt: new Date(Date.now() - 1000 * 60 * 310).toISOString(),
    },
    {
        id: "c6",
        title: "AI Prompt & Media Automation Specialist",
        company: "AdVantage Global",
        location: "Remote",
        pay: "₹40,000 – ₹65,000 / mo",
        industry: "AI & Marketing",
        workMode: "100% Remote",
        badges: ["Midjourney / Flux", "ComfyUI"],
        createdAt: new Date(Date.now() - 1000 * 60 * 400).toISOString(),
    },
]

const HOW_IT_WORKS = [
    {
        step: "01",
        title: "Take a 5-Minute Proctored Test",
        desc: "Answer 5 real-world scenario questions with live anti-cheat verification. No fake resumes, no generic certificates.",
        badge: "100% Free · Anti-Cheat",
        icon: ClipboardCheck,
    },
    {
        step: "02",
        title: "Mint Your QR-Verified Badge",
        desc: "Passing candidates get a permanent public badge on their Celoris profile with a verifiable QR code for LinkedIn & CVs.",
        badge: "Permanent Verification",
        icon: BadgeCheck,
    },
    {
        step: "03",
        title: "Direct Employer Hiring",
        desc: "Apply to high-paying remote roles in 1 click. Verified employers connect directly with you via in-app chat or WhatsApp.",
        badge: "0% Placement Fees",
        icon: Briefcase,
    },
]

const COMPARISON_ROWS = [
    {
        feature: "Cost to Apply / Take Tests",
        celoris: "₹0 Free Forever (0 Coins)",
        traditional: "Paid connects & bidding coins (Upwork/Freelancer)",
        winner: true,
    },
    {
        feature: "Candidate Skill Proof",
        celoris: "Proctored AI Skill Test + Live QR Badge",
        traditional: "Unverified self-reported resumes (90% exaggerated)",
        winner: true,
    },
    {
        feature: "Employer Direct Chat",
        celoris: "Direct In-App & WhatsApp Access",
        traditional: "Blocked behind recruiter paywalls (Naukri/Indeed)",
        winner: true,
    },
    {
        feature: "Commission on Your Earnings",
        celoris: "0% (You keep 100% of your salary/fees)",
        traditional: "10% – 20% platform cut on every project",
        winner: true,
    },
    {
        feature: "Competition per Role",
        celoris: "Low (Only verified badge holders can apply)",
        traditional: "1,000+ spam resumes per job listing",
        winner: true,
    },
]

const FAQS = [
    {
        q: "Are the skill tests really 100% free?",
        a: "Yes, completely free. We never charge for taking skill tests, earning certificates, or applying to jobs. There are zero coin packages, hidden bidding fees, or placement charges.",
    },
    {
        q: "How does the proctored test work?",
        a: "Tests take about 5 to 7 minutes and consist of practical, scenario-based questions. The exam interface monitors tab switching and copy-pasting to ensure that only candidates with genuine hands-on ability pass.",
    },
    {
        q: "Can I share my Celoris Certificate on LinkedIn and my resume?",
        a: "Absolutely! Once you pass, your profile generates a public verification URL with an instant QR code that any recruiter or HR manager can scan to verify your authenticity.",
    },
    {
        q: "What if I don't pass the skill test on the first try?",
        a: "No problem. You can review your mistakes, practice, and retake the test for free after 24 hours. There is no penalty.",
    },
    {
        q: "How do employers contact me when I apply?",
        a: "Verified employers can review your badge score and reach out directly through Celoris In-App Chat or your verified WhatsApp, ensuring fast turnaround without middlemen.",
    },
]

function postedOn(iso: string): string {
    const d = new Date(iso)
    if (isNaN(d.getTime())) return "Recently"
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", timeZone: "Asia/Kolkata" })
}

export function JobCenterLanding({ jobs = [] }: { jobs: PublicJob[] }) {
    const displayJobs = useMemo(() => {
        return jobs.length > 0 ? jobs : CURATED_JOBS
    }, [jobs])

    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("All")
    const [selectedWorkMode, setSelectedWorkMode] = useState("All")
    const [openFaq, setOpenFaq] = useState<number | null>(null)

    // Filter jobs
    const filteredJobs = useMemo(() => {
        return displayJobs.filter((j) => {
            const matchesCategory =
                selectedCategory === "All" ||
                j.industry.toLowerCase().includes(selectedCategory.toLowerCase()) ||
                j.badges.some((b) => b.toLowerCase().includes(selectedCategory.toLowerCase()))

            const matchesMode =
                selectedWorkMode === "All" ||
                j.workMode.toLowerCase().includes(selectedWorkMode.toLowerCase()) ||
                j.location.toLowerCase().includes(selectedWorkMode.toLowerCase())

            const matchesSearch =
                !searchQuery.trim() ||
                j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                j.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                j.badges.some((b) => b.toLowerCase().includes(searchQuery.toLowerCase()))

            return matchesCategory && matchesMode && matchesSearch
        })
    }, [displayJobs, selectedCategory, selectedWorkMode, searchQuery])

    return (
        <div className="min-h-screen bg-[#050608] text-slate-100 selection:bg-emerald-500/30 pb-24 overflow-x-hidden">
            
            {/* 1. HERO SECTION (HYPER-OPTIMIZED FOR MOBILE) */}
            <section className="relative overflow-hidden pt-8 pb-12 sm:pt-16 sm:pb-20 border-b border-white/[0.06]">
                {/* Subtle Ambient Glow */}
                <div className="pointer-events-none absolute -top-20 left-1/2 h-72 w-80 -translate-x-1/2 rounded-full bg-emerald-500/15 blur-[120px] sm:w-[38rem]" />

                <div className="relative mx-auto max-w-5xl px-4 sm:px-6 text-center">
                    {/* Live Status Pill */}
                    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-300 backdrop-blur-md shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                        </span>
                        <span>Celoris Certified Job Center · Free Skill Tests</span>
                    </div>

                    {/* Headline */}
                    <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-6xl sm:leading-[1.1]">
                        Skilled. Certified.{" "}
                        <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                            Job-Ready.
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className="mx-auto mt-3.5 max-w-2xl text-sm sm:text-lg text-slate-300 leading-relaxed">
                        No fake resumes. No paying for bids or connects. Take a 5-minute proctored skill test,
                        earn your QR-verified badge, and get hired directly by verified remote employers.
                    </p>

                    {/* Action CTAs */}
                    <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
                        <div className="w-full sm:w-auto">
                            <GoogleSignInButton
                                text="continue_with"
                                oneTap
                                oneTapDelayMs={4000}
                                hideWhenSignedIn
                                redirectTo="/job-center"
                            >
                                <Link
                                    href={LOGIN_NEXT}
                                    className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3.5 text-sm font-bold text-black shadow-[0_0_25px_rgba(16,185,129,0.35)] transition-all hover:bg-emerald-400 hover:scale-[1.02] active:scale-95"
                                >
                                    <Zap className="h-4 w-4 fill-black" />
                                    Take Free Skill Test (5 Min)
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </GoogleSignInButton>
                        </div>

                        <a
                            href="#open-roles"
                            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.05] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/[0.1] active:scale-95"
                        >
                            <Briefcase className="h-4 w-4 text-emerald-400" />
                            Browse Open Roles ({displayJobs.length})
                        </a>

                        <a
                            href="#whatsapp-alerts"
                            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-[#25D366]/30 bg-[#25D366]/10 px-5 py-3.5 text-sm font-semibold text-[#25D366] transition hover:bg-[#25D366]/20 active:scale-95"
                        >
                            <WhatsAppIcon className="h-4 w-4" />
                            WhatsApp Job Alerts
                        </a>
                    </div>

                    {/* Metric Highlights (Mobile 2x2 Grid / Desktop 4 Columns) */}
                    <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 max-w-3xl mx-auto pt-4 border-t border-white/[0.06]">
                        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-center">
                            <div className="text-lg sm:text-2xl font-extrabold text-white">₹54.2k</div>
                            <div className="text-[11px] sm:text-xs text-neutral-400 mt-0.5">Avg Monthly Pay</div>
                        </div>
                        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-center">
                            <div className="text-lg sm:text-2xl font-extrabold text-emerald-400">{displayJobs.length}+ Active</div>
                            <div className="text-[11px] sm:text-xs text-neutral-400 mt-0.5">Verified Roles</div>
                        </div>
                        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-center">
                            <div className="text-lg sm:text-2xl font-extrabold text-white">100% Free</div>
                            <div className="text-[11px] sm:text-xs text-neutral-400 mt-0.5">Skill Tests & Certs</div>
                        </div>
                        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-center">
                            <div className="text-lg sm:text-2xl font-extrabold text-teal-400">0% Cut</div>
                            <div className="text-[11px] sm:text-xs text-neutral-400 mt-0.5">Platform Commission</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. LIVE INTERACTIVE JOB BOARD (MOBILE-FIRST) */}
            <section id="open-roles" className="mx-auto max-w-6xl px-4 sm:px-6 pt-10 sm:pt-14 scroll-mt-14">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <div className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-emerald-400 uppercase tracking-wider">
                            <Briefcase className="h-3.5 w-3.5" />
                            Live Opportunities
                        </div>
                        <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-white">
                            Verified Remote Jobs & Paid Gigs
                        </h2>
                    </div>
                    <p className="text-xs sm:text-sm text-neutral-400">
                        Showing {filteredJobs.length} matching {filteredJobs.length === 1 ? "opening" : "openings"}
                    </p>
                </div>

                {/* Mobile-Friendly Search & Horizontal Filter Bar */}
                <div className="mt-6 flex flex-col gap-3">
                    {/* Search Input */}
                    <div className="relative w-full">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search roles (e.g. 3D, Blender, Video, UI/UX, Next.js)..."
                            className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-3 pl-10 pr-4 text-sm text-white placeholder-neutral-500 focus:border-emerald-500/60 focus:bg-white/[0.07] focus:outline-none transition-all"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-white"
                            >
                                Clear
                            </button>
                        )}
                    </div>

                    {/* Category Tabs (Smooth Horizontal Swipe on Mobile) */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 pt-1 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                                    selectedCategory === cat
                                        ? "bg-emerald-500 text-black shadow-[0_0_12px_rgba(16,185,129,0.4)]"
                                        : "border border-white/10 bg-white/[0.03] text-neutral-300 hover:bg-white/[0.08]"
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Work Mode Filter Pills */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
                        <span className="text-neutral-500 shrink-0 font-medium mr-1">Mode:</span>
                        {WORK_MODES.map((mode) => (
                            <button
                                key={mode}
                                onClick={() => setSelectedWorkMode(mode)}
                                className={`shrink-0 rounded-lg px-2.5 py-1 transition-all ${
                                    selectedWorkMode === mode
                                        ? "bg-white/15 text-white font-semibold"
                                        : "text-neutral-400 hover:text-white"
                                }`}
                            >
                                {mode}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Job Cards Grid */}
                {filteredJobs.length === 0 ? (
                    <div className="mt-8 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8 text-center">
                        <Briefcase className="mx-auto h-8 w-8 text-neutral-500 mb-2" />
                        <h3 className="text-base font-semibold text-white">No matching roles found</h3>
                        <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto">
                            Try adjusting your search or category filters to see more verified openings.
                        </p>
                        <button
                            onClick={() => {
                                setSelectedCategory("All")
                                setSelectedWorkMode("All")
                                setSearchQuery("")
                            }}
                            className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 px-3.5 py-2 text-xs font-semibold hover:bg-emerald-500/30 transition-colors"
                        >
                            Reset all filters
                        </button>
                    </div>
                ) : (
                    <div className="mt-6 grid gap-3.5 sm:grid-cols-2">
                        {filteredJobs.map((j) => {
                            const shareText = `Check out this verified opening on Celoris: ${j.title} (${j.pay}). Take the free skill test to earn your badge and apply: https://celorisdesigns.com/job-center`
                            const waShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`

                            return (
                                <div
                                    key={j.id}
                                    className="group relative flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 sm:p-5 transition-all hover:border-emerald-500/40 hover:bg-white/[0.04] shadow-sm"
                                >
                                    <div>
                                        {/* Header: Title + Post Date */}
                                        <div className="flex items-start justify-between gap-2">
                                            <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-emerald-300 transition-colors leading-snug">
                                                {j.title}
                                            </h3>
                                            <span className="shrink-0 text-[10px] font-mono text-neutral-500 pt-0.5">
                                                {postedOn(j.createdAt)}
                                            </span>
                                        </div>

                                        {/* Company + Industry */}
                                        <div className="mt-1 flex items-center gap-1.5 text-xs text-neutral-400">
                                            <span className="font-medium text-neutral-300">{j.company}</span>
                                            <span>•</span>
                                            <span>{j.industry}</span>
                                        </div>

                                        {/* Salary + Location Badges */}
                                        <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs">
                                            {j.pay && (
                                                <span className="inline-flex items-center gap-1 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-bold text-emerald-300 text-[11px] sm:text-xs">
                                                    <IndianRupee className="h-3 w-3" />
                                                    {j.pay.replace(/₹/g, "")}
                                                </span>
                                            )}
                                            <span className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/[0.04] px-2 py-0.5 text-neutral-300 text-[11px] sm:text-xs">
                                                <MapPin className="h-3 w-3 text-neutral-400" />
                                                {j.location}
                                            </span>
                                        </div>

                                        {/* Required Badge Chip */}
                                        {j.badges && j.badges.length > 0 && (
                                            <div className="mt-3 pt-3 border-t border-white/[0.06] flex items-center gap-1.5 text-[11px] text-neutral-400">
                                                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                                                <span>Badge Needed:</span>
                                                <div className="flex flex-wrap gap-1">
                                                    {j.badges.map((b) => (
                                                        <span key={b} className="font-semibold text-slate-200">
                                                            {b}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Footers: Apply + Share */}
                                    <div className="mt-4 flex items-center justify-between gap-2 pt-3 border-t border-white/[0.06]">
                                        <Link
                                            href={LOGIN_NEXT}
                                            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500 text-emerald-300 hover:text-black px-3.5 py-2 text-xs font-bold transition-all"
                                        >
                                            <BadgeCheck className="h-3.5 w-3.5" />
                                            Take Test & Apply
                                            <ArrowRight className="h-3 w-3" />
                                        </Link>

                                        <a
                                            href={waShareUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label="Share on WhatsApp"
                                            className="inline-flex items-center gap-1 text-[11px] text-neutral-400 hover:text-[#25D366] transition-colors p-2"
                                        >
                                            <Share2 className="h-3.5 w-3.5" />
                                            <span className="hidden sm:inline">Share</span>
                                        </a>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </section>

            {/* 3. HOW THE CERTIFICATE WORKS (3 APPLE-GRADE STEPS) */}
            <section className="mx-auto max-w-5xl px-4 sm:px-6 mt-16 sm:mt-24">
                <div className="text-center">
                    <span className="text-xs font-mono font-semibold text-emerald-400 uppercase tracking-wider">
                        The Verification Blueprint
                    </span>
                    <h2 className="mt-1 text-2xl sm:text-4xl font-extrabold text-white">
                        How the Celoris Skill Certificate Works
                    </h2>
                    <p className="mt-2 text-xs sm:text-sm text-neutral-400 max-w-md mx-auto">
                        A transparent 3-step proof-of-work pipeline designed to get skilled candidates hired fast.
                    </p>
                </div>

                <div className="mt-8 grid gap-3.5 sm:grid-cols-3">
                    {HOW_IT_WORKS.map((s) => (
                        <div
                            key={s.step}
                            className="relative flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 sm:p-6 hover:border-emerald-500/30 transition-colors"
                        >
                            <div>
                                <div className="flex items-center justify-between">
                                    <span className="font-mono text-xs font-bold text-emerald-400">Step {s.step}</span>
                                    <span className="inline-flex items-center gap-1 text-[10px] rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-emerald-300">
                                        {s.badge}
                                    </span>
                                </div>
                                <div className="mt-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">
                                    <s.icon className="h-5 w-5" />
                                </div>
                                <h3 className="mt-3.5 text-base sm:text-lg font-bold text-white">{s.title}</h3>
                                <p className="mt-1.5 text-xs sm:text-sm text-neutral-400 leading-relaxed">{s.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Anti-cheat & QR Badges Pill Highlights */}
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="flex items-start gap-3 rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
                        <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                            <h4 className="text-xs sm:text-sm font-semibold text-white">Proctored Anti-Cheat Verification</h4>
                            <p className="text-[11px] sm:text-xs text-neutral-400 mt-0.5">
                                Tab switching, copy-pasting, and AI autofill are monitored so employers trust your score 100%.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3 rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
                        <QrCode className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                            <h4 className="text-xs sm:text-sm font-semibold text-white">Permanent QR Verification URL</h4>
                            <p className="text-[11px] sm:text-xs text-neutral-400 mt-0.5">
                                Share your scannable badge on LinkedIn, your portfolio, and WhatsApp with instant 1-click proof.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. COMPARISON MATRIX (CELORIS VS TRADITIONAL PLATFORMS) */}
            <section className="mx-auto max-w-5xl px-4 sm:px-6 mt-16 sm:mt-24">
                <div className="text-center">
                    <span className="text-xs font-mono font-semibold text-emerald-400 uppercase tracking-wider">
                        Why Creators Choose Celoris
                    </span>
                    <h2 className="mt-1 text-2xl sm:text-4xl font-extrabold text-white">
                        Celoris vs Traditional Job Portals
                    </h2>
                    <p className="mt-2 text-xs sm:text-sm text-neutral-400 max-w-lg mx-auto">
                        See how we eliminate the bidding coins, recruiter gatekeepers, and commission cuts of legacy platforms.
                    </p>
                </div>

                <div className="mt-8 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02]">
                    <div className="grid grid-cols-12 border-b border-white/[0.08] bg-white/[0.04] p-3.5 sm:p-4 text-xs font-bold text-neutral-300">
                        <div className="col-span-5 sm:col-span-4">Feature</div>
                        <div className="col-span-4 sm:col-span-4 text-emerald-400 font-extrabold">Celoris Job Center</div>
                        <div className="col-span-3 sm:col-span-4 text-neutral-500">Upwork / Naukri</div>
                    </div>

                    <div className="divide-y divide-white/[0.06]">
                        {COMPARISON_ROWS.map((row, idx) => (
                            <div key={idx} className="grid grid-cols-12 p-3.5 sm:p-4 text-xs items-center gap-2">
                                <div className="col-span-5 sm:col-span-4 font-semibold text-white text-[11px] sm:text-xs">
                                    {row.feature}
                                </div>
                                <div className="col-span-4 sm:col-span-4 text-emerald-300 font-medium flex items-center gap-1 text-[11px] sm:text-xs">
                                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                                    <span>{row.celoris}</span>
                                </div>
                                <div className="col-span-3 sm:col-span-4 text-neutral-500 flex items-center gap-1 text-[10px] sm:text-xs">
                                    <X className="h-3.5 w-3.5 text-red-400/60 shrink-0 hidden sm:inline" />
                                    <span>{row.traditional}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. WHATSAPP JOB ALERTS SECTION */}
            <section id="whatsapp-alerts" className="mx-auto mt-16 sm:mt-24 max-w-5xl scroll-mt-14 px-4 sm:px-6">
                <JobAlertsForm />
            </section>

            {/* 6. INTERACTIVE FAQS ACCORDION */}
            <section className="mx-auto max-w-3xl px-4 sm:px-6 mt-16 sm:mt-24">
                <div className="text-center">
                    <span className="text-xs font-mono font-semibold text-emerald-400 uppercase tracking-wider">
                        Got Questions?
                    </span>
                    <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-white">
                        Frequently Asked Questions
                    </h2>
                </div>

                <div className="mt-8 space-y-2.5">
                    {FAQS.map((faq, i) => {
                        const isOpen = openFaq === i
                        return (
                            <div
                                key={i}
                                className="rounded-xl border border-white/[0.08] bg-white/[0.02] overflow-hidden transition-colors hover:border-white/[0.15]"
                            >
                                <button
                                    onClick={() => setOpenFaq(isOpen ? null : i)}
                                    className="flex w-full items-center justify-between p-4 text-left text-xs sm:text-sm font-semibold text-white transition-colors"
                                >
                                    <span>{faq.q}</span>
                                    <ChevronDown
                                        className={`h-4 w-4 shrink-0 text-emerald-400 transition-transform duration-200 ${
                                            isOpen ? "rotate-180" : ""
                                        }`}
                                    />
                                </button>
                                {isOpen && (
                                    <div className="px-4 pb-4 text-xs sm:text-sm text-neutral-400 leading-relaxed border-t border-white/[0.04] pt-2.5">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </section>

            {/* 7. FINAL FULL-WIDTH BOTTOM CTA BANNER */}
            <section className="mx-auto max-w-5xl px-4 sm:px-6 mt-16 sm:mt-24">
                <div className="relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-emerald-950/40 via-emerald-950/10 to-[#050608] p-8 sm:p-12 text-center shadow-[0_0_50px_rgba(16,185,129,0.15)]">
                    <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
                        Ready to Prove Your Skills and Get Hired?
                    </h2>
                    <p className="mx-auto mt-2.5 max-w-md text-xs sm:text-base text-neutral-300">
                        Join 1,400+ certified candidates. Take the free 5-minute skill test now with Google 1-Tap.
                    </p>
                    <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                        <Link
                            href={LOGIN_NEXT}
                            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-emerald-500 px-7 py-3.5 text-sm font-bold text-black shadow-lg hover:bg-emerald-400 transition-all hover:scale-105 active:scale-95"
                        >
                            <Zap className="h-4 w-4 fill-black" />
                            Start Free Skill Test
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                        <a
                            href="#open-roles"
                            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/[0.05] px-6 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
                        >
                            Explore Open Jobs
                        </a>
                    </div>
                </div>
            </section>

            {/* 8. STICKY MOBILE CONVERSION DOCK (Visible only on mobile screens < 640px) */}
            <div className="fixed bottom-0 left-0 right-0 z-50 sm:hidden border-t border-white/10 bg-[#050608]/90 backdrop-blur-xl px-4 py-2.5 flex items-center gap-2 shadow-2xl">
                <Link
                    href={LOGIN_NEXT}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-500 py-3 text-xs font-bold text-black shadow-[0_0_15px_rgba(16,185,129,0.3)] active:scale-95"
                >
                    <Zap className="h-3.5 w-3.5 fill-black" />
                    Take Free Skill Test (5 Min)
                </Link>
                <a
                    href="#whatsapp-alerts"
                    className="shrink-0 inline-flex items-center justify-center rounded-xl border border-[#25D366]/40 bg-[#25D366]/15 p-3 text-[#25D366] active:scale-95"
                    aria-label="WhatsApp Job Alerts"
                >
                    <WhatsAppIcon className="h-4 w-4" />
                </a>
            </div>

        </div>
    )
}
