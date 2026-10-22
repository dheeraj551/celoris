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
import { PublicJobDashboard } from "@/components/job-center/PublicJobDashboard"
import { ApplyJobModal } from "@/components/job-center/ApplyJobModal"

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

// Realistic Indian Creative & Tech Freelance / Part-Time roles (Calibrated to realistic ~₹30k / mo benchmark)
const CURATED_JOBS: PublicJob[] = [
    {
        id: "c780a112-78d1-412f-90b1-e78119001001",
        title: "Instagram Reels Video Editing Needed",
        company: "Celoris",
        location: "Remote (Pan-India)",
        pay: "₹750 – ₹1,250 / hr (₹22k – ₹30k/mo)",
        industry: "Media & Creators",
        workMode: "100% Remote",
        badges: ["Instagram Reels Video Editor & Pacing"],
        createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    },
    {
        id: "c780a112-78d1-412f-90b1-e78119001002",
        title: "60-sec Animated Explainer for MoreGigs",
        company: "Celoris",
        location: "Ahmedabad / Remote",
        pay: "₹12,500 – ₹37,500 INR (Milestone)",
        industry: "Animation & Motion Design",
        workMode: "100% Remote",
        badges: ["2D Animated Explainer & Motion Graphics"],
        createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    },
    {
        id: "c780a112-78d1-412f-90b1-e78119001003",
        title: "Social Media Content Creator & Video Lead",
        company: "Celoris",
        location: "Bengaluru / Remote",
        pay: "₹15,000 – ₹28,000 / mo",
        industry: "Social Media & Growth",
        workMode: "100% Remote",
        badges: ["Social Media Content Creation & Channel Growth"],
        createdAt: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
    },
    {
        id: "c1",
        title: "3D Blender & Vehicle Modeler",
        company: "Apex Interactive Studios",
        location: "Remote (India)",
        pay: "₹25,000 – ₹38,000 / mo",
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
        pay: "₹28,000 – ₹42,000 / mo",
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
        pay: "₹18,000 – ₹32,000 / mo",
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
        pay: "₹24,000 – ₹36,000 / mo",
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
        pay: "₹28,000 – ₹40,000 / mo",
        industry: "Cloud & Dev",
        workMode: "100% Remote",
        badges: ["TypeScript", "Next.js / React"],
        createdAt: new Date(Date.now() - 1000 * 60 * 310).toISOString(),
    },
    {
        id: "c6",
        title: "AI Prompt & Media Automation Specialist",
        company: "AdVantage Global",
        location: "Remote (Pan-India)",
        pay: "₹16,000 – ₹28,000 / mo",
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
        title: "Get Your Verified Celoris Skill ID",
        desc: "Passing candidates earn an official Celoris Skill ID and permanent public badge with a scannable verification link for LinkedIn, WhatsApp & CVs.",
        badge: "Verified Skill ID",
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
        traditional: "Paid connects & bidding coin packages",
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
        traditional: "Blocked behind paid recruiter paywalls",
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
        q: "What is the realistic earning expectation for part-time/freelance work?",
        a: "In India, realistic creative & tech freelance roles pay around ₹18,000 to ₹35,000 per month (averaging ₹30,000/month). Unlike platforms advertising impossible ₹50k+ part-time rates, we connect you with verified, genuine budgets that pay promptly via UPI.",
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

export function JobCenterLanding({ jobs = [] }: { jobs: PublicJob[] }) {
    const displayJobs = useMemo(() => {
        return jobs.length > 0 ? jobs : CURATED_JOBS
    }, [jobs])

    const [openFaq, setOpenFaq] = useState<number | null>(null)

    // Apply modal state
    const [modalJob, setModalJob] = useState<PublicJob | null>(null)
    const [modalOpen, setModalOpen] = useState(false)

    const handleApplyClick = (job: PublicJob) => {
        setModalJob(job)
        setModalOpen(true)
    }

    return (
        <div className="min-h-screen bg-[#050608] text-slate-100 selection:bg-emerald-500/30 pb-24 overflow-x-hidden">
            
            {/* 1. PRIMARY DUAL-EXPERIENCE HERO SHOWCASE (CELORIS JOB APP ON MOBILE & APPLE 3D SHOWCASE ON PC) */}
            <section id="app-showcase" className="relative pt-4 sm:pt-8 pb-4 max-w-7xl mx-auto scroll-mt-20">
                <PublicJobDashboard
                    onApplyJob={handleApplyClick}
                    initialJobs={displayJobs}
                />
            </section>

            {/* Quick Metric Highlights (Mobile 2x2 Grid / Desktop 4 Columns with Realistic ₹30k Benchmark) */}
            <section className="mx-auto max-w-4xl px-4 sm:px-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 max-w-3xl mx-auto pt-2 border-t border-white/[0.06]">
                    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-center">
                        <div className="text-lg sm:text-2xl font-extrabold text-emerald-400">₹30k</div>
                        <div className="text-[11px] sm:text-xs text-neutral-400 mt-0.5">Earn up to ₹30k/mo</div>
                    </div>
                    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-center">
                        <div className="text-lg sm:text-2xl font-extrabold text-white">{displayJobs.length}+ Active</div>
                        <div className="text-[11px] sm:text-xs text-neutral-400 mt-0.5">Verified Roles</div>
                    </div>
                    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-center">
                        <div className="text-lg sm:text-2xl font-extrabold text-white">100% Free</div>
                        <div className="text-[11px] sm:text-xs text-neutral-400 mt-0.5">Skill Tests &amp; Certs</div>
                    </div>
                    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-center">
                        <div className="text-lg sm:text-2xl font-extrabold text-teal-400">0% Cut</div>
                        <div className="text-[11px] sm:text-xs text-neutral-400 mt-0.5">Platform Commission</div>
                    </div>
                </div>
            </section>

            {/* 2. HOW THE CERTIFICATE WORKS (3 APPLE-GRADE STEPS) */}
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
                        <div className="col-span-3 sm:col-span-4 text-neutral-400">Traditional Job Portals</div>
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
                                    className="flex w-full items-center justify-between p-4 text-left text-xs sm:text-sm font-semibold text-white transition-colors cursor-pointer"
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
                        Join certified candidates earning an average of ₹30,000/mo. Take the free 5-minute skill test now.
                    </p>
                    <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                        <button
                            type="button"
                            onClick={() => {
                                if (displayJobs[0]) handleApplyClick(displayJobs[0])
                            }}
                            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-emerald-500 px-7 py-3.5 text-sm font-bold text-black shadow-lg hover:bg-emerald-400 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                        >
                            <Zap className="h-4 w-4 fill-black" />
                            Start Free Skill Test
                            <ArrowRight className="h-4 w-4" />
                        </button>
                        <a
                            href="#app-showcase"
                            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/[0.05] px-6 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
                        >
                            Explore Open Jobs
                        </a>
                    </div>
                </div>
            </section>

            {/* 8. STICKY MOBILE CONVERSION DOCK (Visible on mobile screens < 640px) */}
            <div className="fixed bottom-0 left-0 right-0 z-50 sm:hidden border-t border-white/10 bg-[#050608]/90 backdrop-blur-xl px-4 py-2.5 flex items-center gap-2 shadow-2xl">
                <button
                    type="button"
                    onClick={() => {
                        if (displayJobs[0]) handleApplyClick(displayJobs[0])
                    }}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-500 py-3 text-xs font-bold text-black shadow-[0_0_15px_rgba(16,185,129,0.3)] active:scale-95 cursor-pointer"
                >
                    <Zap className="h-3.5 w-3.5 fill-black" />
                    Take Free Skill Test (5 Min)
                </button>
                <a
                    href="https://wa.me/919084718101?text=Hi%20Celoris%20Team%2C%20I%20want%20to%20learn%20more%20about%20free%20skill%20tests%20and%20remote%20jobs%20on%20Celoris%20Job%20Center."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 inline-flex items-center justify-center rounded-xl border border-[#25D366]/40 bg-[#25D366]/15 p-3 text-[#25D366] active:scale-95"
                    aria-label="WhatsApp Job Alerts"
                >
                    <WhatsAppIcon className="h-4 w-4" />
                </a>
            </div>

            {/* 9. FLOATING WHATSAPP HELPLINE (Visible on Desktop) */}
            <a
                href="https://wa.me/919084718101?text=Hi%20Celoris%20Team%2C%20I%20want%20to%20learn%20more%20about%20free%20skill%20tests%20and%20remote%20jobs%20on%20Celoris%20Job%20Center."
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat with Celoris Verified Jobs Helpline on WhatsApp"
                className="hidden sm:inline-flex items-center gap-2 fixed bottom-6 right-6 z-40 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-black font-extrabold text-xs px-4 py-3 shadow-[0_4px_25px_rgba(37,211,102,0.4)] transition-all hover:scale-105 active:scale-95 group"
            >
                <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-black" />
                </span>
                <WhatsAppIcon className="h-4 w-4 fill-black" />
                <span>Verified Jobs Helpline</span>
            </a>

            {/* Direct Apply & Skill Test Modal */}
            <ApplyJobModal
                job={modalJob}
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
            />

        </div>
    )
}
