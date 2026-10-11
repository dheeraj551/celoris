"use client"

import React, { useState } from "react"
import Link from "next/link"
import {
    ArrowRight, CheckCircle2, Clock, MapPin,
    ShieldCheck, Users, IndianRupee, Sparkles,
    Briefcase, MessageSquare, AlertTriangle, XCircle,
    ChevronRight, BookOpen, Laptop, Video, Award
} from "lucide-react"
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon"
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton"
import { WhatsAppTrainerAlerts } from "@/components/teach-app/WhatsAppTrainerAlerts"
import { useAuth } from "@/components/providers/AuthProvider"

export interface TeachingSlot {
    id: string
    subject: string
    category: string
    location: string
    mode: "Online" | "Home Tuition" | "Hybrid"
    budget: string
    studentsCount: string
    timing: string
    requirement: string
    timeAgo: string
    status: string
}

const LOGIN_NEXT = "/login?next=%2Fteach"

const SUBJECT_TAGS = [
    "Video Editing & Reels",
    "Python & AI Tutoring",
    "Full-Stack Web Dev",
    "Graphic & UI Design",
    "Digital Marketing & Ads",
    "Microsoft Excel & Power BI",
    "Spoken English & Fluency",
    "CBSE Physics & Maths",
    "Kathak & Fitness Zumba",
]

const HOW_IT_WORKS_STEPS = [
    {
        step: "01",
        title: "Create your free profile",
        desc: "List your subjects, teaching mode (online or home tuition), hourly rate, and portfolio in under 2 minutes. Free forever.",
    },
    {
        step: "02",
        title: "Claim verified student slots",
        desc: "Browse incoming student requests across Delhi/NCR and online. Unlock student requirements with zero coin charges.",
    },
    {
        step: "03",
        title: "Keep 100% of your earnings",
        desc: "Conduct 1-on-1 classes or group batches. Students pay directly into your account with 0% platform commission.",
    },
]

const COMPARISON_POINTS = [
    {
        feature: "Per-Lead Cost",
        celoris: "₹0 Free forever",
        traditional: "₹150 – ₹500 per coin pack",
        celorisWins: true,
    },
    {
        feature: "Platform Commission",
        celoris: "0% (You keep 100%)",
        traditional: "20% – 40% deducted every month",
        celorisWins: true,
    },
    {
        feature: "Student Contact Access",
        celoris: "Direct & Uncensored",
        traditional: "Locked behind paid bidding coins",
        celorisWins: true,
    },
    {
        feature: "Payout Frequency",
        celoris: "Direct UPI & Instant Escrow",
        traditional: "Delayed 15–30 days payout cycles",
        celorisWins: true,
    },
    {
        feature: "Delhi/NCR Home Tuition",
        celoris: "Verified verified parents & students",
        traditional: "Recycled outdated inquiries",
        celorisWins: true,
    },
]

const FAQS = [
    {
        q: "Is Celoris really 0% commission for trainers?",
        a: "Yes, 100%. We do not take any cut from your student fees, nor do we sell coins to view student inquiries. You keep all the money you earn from teaching.",
    },
    {
        q: "Do I need to pay or sign up to view teaching slots?",
        a: "No! All student requests and open teaching slots are publicly visible on this page. When you want to claim a slot or accept a student, you can connect directly in 1 click with Google.",
    },
    {
        q: "Can I teach both online and home tuitions?",
        a: "Absolutely. You choose your preferred mode: 100% online (via Google Meet / LiveKit / Zoom) or offline home tuition across Noida, South Delhi, Gurugram, or Ghaziabad.",
    },
    {
        q: "How do students pay my tuition fee?",
        a: "Students pay directly to your UPI ID or through Celoris Escrow. Unlike other platforms that withhold funds for 30 days, payments are processed immediately upon completion.",
    },
]

export function TeachLanding({ slots = [] }: { slots: TeachingSlot[] }) {
    const { user, profile } = useAuth()
    const [selectedMode, setSelectedMode] = useState<string>("All")
    const [selectedCategory, setSelectedCategory] = useState<string>("All")

    const isTrainer = Boolean(
        profile &&
        (profile.role === "tutor" ||
         profile.role === "trainer" ||
         profile.role === "instructor" ||
         profile.role === "admin" ||
         profile.role === "superadmin" ||
         profile.is_trainer === true) &&
        profile.role !== "student"
    )

    // Filter logic
    const filteredSlots = slots.filter((slot) => {
        const matchesMode = selectedMode === "All" || slot.mode === selectedMode
        const matchesCategory = selectedCategory === "All" || slot.category === selectedCategory
        return matchesMode && matchesCategory
    })

    const categories = ["All", ...Array.from(new Set(slots.map((s) => s.category))).filter(Boolean)]

    return (
        <div className="min-h-screen bg-[#050608] text-slate-200 selection:bg-emerald-500/30 pb-20">
            {/* Signed-in Trainer Quick Banner */}
            {user && (
                <div className="bg-emerald-950/60 border-b border-emerald-500/20 px-4 py-2.5 text-center text-xs text-emerald-200">
                    <span className="font-semibold">Welcome back{profile?.full_name ? `, ${profile.full_name}` : ""}! </span>
                    {isTrainer ? (
                        <span>You are registered as a Verified Trainer. </span>
                    ) : (
                        <span>You can start teaching immediately on Celoris. </span>
                    )}
                    <Link
                        href="/teach/dashboard/trainer/overview"
                        className="inline-flex items-center gap-1 font-bold text-white underline underline-offset-4 hover:text-emerald-300 ml-2"
                    >
                        Open Trainer Dashboard <ArrowRight className="h-3 w-3" />
                    </Link>
                </div>
            )}

            {/* 1. Hero Section */}
            <section className="relative overflow-hidden">
                <div className="pointer-events-none absolute -top-24 left-1/2 h-80 w-[38rem] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[110px]" />
                <div className="relative mx-auto max-w-5xl px-4 pt-14 pb-12 text-center sm:px-6 sm:pt-20">
                    {/* Eyebrow badge with live animated radar dot */}
                    <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                        </span>
                        0% Commission · Celoris Educator Network
                    </span>

                    <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-white sm:text-6xl leading-[1.1]">
                        Teach your passion.{" "}
                        <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 bg-clip-text text-transparent">
                            Keep 100% of your fees.
                        </span>
                    </h1>

                    <p className="mx-auto mt-4 max-w-2xl text-base text-neutral-300 sm:text-lg leading-relaxed">
                        No per-lead coins. No bidding paywalls. Connect directly with verified learners and small batches across Delhi/NCR and Pan-India.
                    </p>

                    {/* Action buttons */}
                    <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                        <div className="w-full sm:w-[280px]">
                            <GoogleSignInButton
                                text="continue_with"
                                oneTap
                                oneTapDelayMs={4000}
                                hideWhenSignedIn
                                redirectTo="/teach"
                            >
                                <Link
                                    href={LOGIN_NEXT}
                                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-500 px-6 py-3.5 text-sm font-bold text-black transition hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95"
                                >
                                    Start teaching for free
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </GoogleSignInButton>
                        </div>

                        <a
                            href="#open-slots"
                            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/[0.1] hover:border-emerald-500/40"
                        >
                            See open student slots ({slots.length})
                            <ArrowRight className="h-4 w-4 text-emerald-400" />
                        </a>

                        <a
                            href="#whatsapp-alerts"
                            className="inline-flex items-center gap-2 rounded-full border border-[#25D366]/30 bg-[#25D366]/10 px-5 py-3.5 text-sm font-semibold text-[#25D366] transition hover:bg-[#25D366]/20 shadow-[0_0_15px_rgba(37,211,102,0.15)] hover:scale-105 active:scale-95"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#25D366]" />
                            </span>
                            <WhatsAppIcon className="h-4 w-4" />
                            WhatsApp Alerts
                        </a>
                    </div>

                    <p className="mt-3.5 text-xs text-neutral-400">
                        100% Free for trainers &amp; tutors. Prefer email?{" "}
                        <Link href={LOGIN_NEXT} className="text-emerald-400 underline-offset-2 hover:underline">
                            Sign in here
                        </Link>
                        .
                    </p>

                    {/* Subject tags */}
                    <div className="mx-auto mt-8 flex max-w-3xl flex-wrap justify-center gap-2">
                        {SUBJECT_TAGS.map((t) => (
                            <span
                                key={t}
                                className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-neutral-300"
                            >
                                {t}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* 2. How Teaching on Celoris Works */}
            <section className="mx-auto max-w-5xl px-4 sm:px-6 mt-8">
                <h2 className="text-center text-2xl font-bold text-white sm:text-3xl tracking-tight">
                    How teaching on Celoris works
                </h2>
                <p className="text-center text-xs sm:text-sm text-neutral-400 mt-2 max-w-xl mx-auto">
                    Three transparent steps to monetize your expertise without paying for lead packages.
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                    {HOW_IT_WORKS_STEPS.map((s) => (
                        <div
                            key={s.step}
                            className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 relative overflow-hidden group hover:border-emerald-500/30 transition-colors"
                        >
                            <div className="flex items-center justify-between">
                                <span className="font-mono text-xs font-bold text-emerald-400">Step {s.step}</span>
                                <span className="h-2 w-2 rounded-full bg-emerald-500/30 group-hover:bg-emerald-400 transition-colors" />
                            </div>
                            <h3 className="mt-4 text-lg font-bold text-white">{s.title}</h3>
                            <p className="mt-2 text-xs sm:text-sm text-neutral-400 leading-relaxed">{s.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* 3. Open Student Slots Right Now */}
            <section id="open-slots" className="mx-auto mt-16 max-w-5xl scroll-mt-20 px-4 sm:px-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between border-b border-white/[0.08] pb-4">
                    <div>
                        <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 mb-1">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                            </span>
                            Live Student Demand
                        </div>
                        <h2 className="text-2xl font-bold text-white sm:text-3xl tracking-tight">
                            Open student slots right now
                        </h2>
                        <p className="text-xs sm:text-sm text-neutral-400 mt-1">
                            {filteredSlots.length} verified student {filteredSlots.length === 1 ? "inquiry" : "inquiries"} · Delhi/NCR &amp; Pan-India Online
                        </p>
                    </div>

                    {/* Mode filter pills */}
                    <div className="flex flex-wrap gap-1.5 pt-2 sm:pt-0">
                        {["All", "Online", "Home Tuition", "Hybrid"].map((mode) => (
                            <button
                                key={mode}
                                onClick={() => setSelectedMode(mode)}
                                className={`rounded-full px-3 py-1 text-xs font-semibold transition-all cursor-pointer ${
                                    selectedMode === mode
                                        ? "bg-emerald-500 text-black font-bold shadow-sm"
                                        : "bg-white/[0.04] border border-white/10 text-neutral-300 hover:bg-white/[0.08]"
                                }`}
                            >
                                {mode}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Slots Grid */}
                {filteredSlots.length === 0 ? (
                    <div className="mt-6 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-8 text-center text-sm text-neutral-300">
                        <p className="font-semibold text-white">No slots matching this filter right now.</p>
                        <p className="text-xs text-neutral-400 mt-1">Switch to &quot;All&quot; or subscribe below to receive WhatsApp alerts as soon as new students post.</p>
                    </div>
                ) : (
                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                        {filteredSlots.map((slot) => {
                            const waUrl = `https://wa.me/919084718101?text=${encodeURIComponent(
                                `Hi Celoris! I'm an educator interested in taking the student teaching slot: ${slot.subject} (${slot.budget}, ${slot.location}). How can I be assigned?`
                            )}`

                            return (
                                <div
                                    key={slot.id}
                                    className="flex flex-col rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 hover:border-emerald-500/30 transition-all duration-200"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <span className="inline-block text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 mb-1">
                                                {slot.category}
                                            </span>
                                            <h3 className="text-base font-bold text-white leading-snug">
                                                {slot.subject}
                                            </h3>
                                        </div>
                                        <div className="flex flex-col items-end shrink-0">
                                            <span className="font-mono text-[11px] text-neutral-500 flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {slot.timeAgo}
                                            </span>
                                            <span className="mt-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                                                {slot.status}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Requirement detail */}
                                    <p className="mt-2 text-xs text-neutral-300 leading-relaxed line-clamp-2">
                                        &ldquo;{slot.requirement}&rdquo;
                                    </p>

                                    {/* Badges: Pay & Location & Mode */}
                                    <div className="mt-3.5 flex flex-wrap gap-2 text-xs">
                                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 font-bold text-emerald-300">
                                            <IndianRupee className="h-3 w-3" />
                                            {slot.budget}
                                        </span>
                                        <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-neutral-300">
                                            <MapPin className="h-3 w-3 text-emerald-400" />
                                            {slot.location}
                                        </span>
                                        <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-neutral-300">
                                            <Users className="h-3 w-3 text-neutral-400" />
                                            {slot.studentsCount}
                                        </span>
                                    </div>

                                    {/* Action Bar */}
                                    <div className="mt-5 flex items-center justify-between gap-3 pt-3.5 border-t border-white/[0.06]">
                                        <Link
                                            href={LOGIN_NEXT}
                                            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                                        >
                                            Claim Slot &amp; Contact
                                            <ArrowRight className="h-3.5 w-3.5" />
                                        </Link>

                                        {/* Official WhatsApp Inquire Button */}
                                        <a
                                            href={waUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#25D366] hover:text-black transition-all duration-200 py-1.5 px-3 rounded-full bg-[#25D366]/10 hover:bg-[#25D366] border border-[#25D366]/30 hover:border-[#25D366] shadow-[0_0_12px_rgba(37,211,102,0.12)] hover:shadow-[0_0_20px_rgba(37,211,102,0.4)] group hover:scale-105 active:scale-95"
                                            title="Claim student on WhatsApp"
                                        >
                                            <WhatsAppIcon className="h-3.5 w-3.5 text-[#25D366] group-hover:text-black transition-colors" />
                                            <span>WhatsApp</span>
                                        </a>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </section>

            {/* 4. Instant WhatsApp Trainer Alerts */}
            <section id="whatsapp-alerts" className="mx-auto mt-14 max-w-5xl scroll-mt-20 px-4 sm:px-6">
                <WhatsAppTrainerAlerts />
            </section>

            {/* 5. The Celoris Advantage (Battle Card Comparison) */}
            <section className="mx-auto mt-16 max-w-5xl px-4 sm:px-6">
                <div className="rounded-3xl border border-white/[0.1] bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-6 sm:p-8">
                    <div className="text-center max-w-2xl mx-auto mb-8">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-rose-500/15 text-rose-400 border border-rose-500/30 mb-2">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            Industry Comparison
                        </span>
                        <h2 className="text-2xl font-bold text-white sm:text-3xl tracking-tight">
                            Why Educators Are Leaving Paid Coin Platforms
                        </h2>
                        <p className="text-xs sm:text-sm text-neutral-400 mt-2">
                            Traditional directories charge you ₹2,000–₹5,000 for credits just to contact a student. Celoris is 100% free with zero commission.
                        </p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs sm:text-sm">
                            <thead>
                                <tr className="border-b border-white/[0.08] text-neutral-400">
                                    <th className="pb-3 font-semibold">Feature</th>
                                    <th className="pb-3 font-bold text-emerald-400">Celoris Platform</th>
                                    <th className="pb-3 font-semibold text-neutral-400">Traditional Lead Directories</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.06]">
                                {COMPARISON_POINTS.map((pt) => (
                                    <tr key={pt.feature} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="py-3.5 font-medium text-white">{pt.feature}</td>
                                        <td className="py-3.5 font-bold text-emerald-300 flex items-center gap-2">
                                            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                                            {pt.celoris}
                                        </td>
                                        <td className="py-3.5 text-neutral-400">
                                            <span className="flex items-center gap-2 text-rose-300">
                                                <XCircle className="h-4 w-4 text-rose-400 shrink-0" />
                                                {pt.traditional}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* 6. Trainer FAQs */}
            <section className="mx-auto mt-16 max-w-4xl px-4 sm:px-6">
                <h2 className="text-center text-2xl font-bold text-white sm:text-3xl tracking-tight">
                    Frequently Asked Questions
                </h2>
                <div className="mt-8 space-y-3">
                    {FAQS.map((faq) => (
                        <div
                            key={faq.q}
                            className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 sm:p-6"
                        >
                            <h3 className="text-base font-bold text-white">{faq.q}</h3>
                            <p className="mt-2 text-xs sm:text-sm text-neutral-300 leading-relaxed">{faq.a}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* 7. Closing Call To Action */}
            <section className="mx-auto mt-16 max-w-3xl px-4 text-center sm:px-6">
                <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-emerald-500/10 via-white/[0.02] to-transparent p-8 sm:p-10 shadow-[0_0_50px_rgba(16,185,129,0.12)]">
                    <h2 className="text-2xl font-bold text-white sm:text-3xl tracking-tight">
                        Ready to start teaching without lead fees?
                    </h2>
                    <p className="mt-3 text-xs sm:text-sm text-neutral-300 max-w-lg mx-auto">
                        Sign in with Google in 1 click. Claim verified student slots, launch your classes, and keep 100% of your earnings.
                    </p>
                    <div className="mt-6 flex justify-center">
                        <div className="w-full sm:w-[280px]">
                            <GoogleSignInButton
                                text="continue_with"
                                oneTap={false}
                                hideWhenSignedIn
                                redirectTo="/teach"
                            >
                                <Link
                                    href={LOGIN_NEXT}
                                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-500 px-6 py-3.5 text-sm font-bold text-black transition hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95"
                                >
                                    Join as a verified trainer
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </GoogleSignInButton>
                        </div>
                    </div>
                </div>

                <p className="mx-auto mt-6 max-w-xl text-xs text-neutral-500">
                    Celoris does not charge membership fees or coin packages to educators. All verified trainers retain 100% of student tuition payments.
                </p>
            </section>
        </div>
    )
}
