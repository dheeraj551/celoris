"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import {
    ArrowRight, CheckCircle2, Clock, MapPin,
    ShieldCheck, Users, IndianRupee, Sparkles,
    Briefcase, MessageSquare, AlertTriangle, XCircle,
    ChevronRight, BookOpen, Laptop, Video, Award, PhoneCall
} from "lucide-react"
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon"
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton"
import { WhatsAppTrainerAlerts } from "@/components/teach-app/WhatsAppTrainerAlerts"
import { ClaimSlotModal } from "@/components/teach-app/ClaimSlotModal"
import { PublicTrainerDashboard } from "@/components/teach-app/PublicTrainerDashboard"
import { openPhoneOS } from "@/components/phone-os/trigger"
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
    studentName?: string
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
        desc: "List your subjects, hourly rate, and expertise in under 2 minutes. Start teaching online on Celoris with zero upfront cost.",
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
        feature: "Student Communication",
        celoris: "Direct In-App Chat & Calls (0 Coins)",
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
        feature: "Student Inquiries",
        celoris: "Verified active students & parents",
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
        q: "Can I teach offline or use apps like Zoom / Google Meet?",
        a: "Currently, Celoris is 100% online. All classes and demo sessions are conducted exclusively on Celoris using our built-in HD classrooms, live chat, and audio calling. Offline home tuitions and external tools like Zoom or Google Meet are not used.",
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
    const [claimModalSlot, setClaimModalSlot] = useState<TeachingSlot | null>(null)
    const [claimModalOpen, setClaimModalOpen] = useState(false)

    // Service support phone auto-open disabled on teach page as requested

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

    const handleClaimClick = (slot: TeachingSlot) => {
        if (user && isTrainer) {
            window.location.href = `/teach/dashboard/trainer/enquiries?slot=${encodeURIComponent(slot.id)}`
        } else {
            setClaimModalSlot(slot)
            setClaimModalOpen(true)
        }
    }

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

            {/* 1. Primary Interactive Hero Showcase (Direct Student Bookings CRM) */}
            <section id="open-slots" className="relative pt-6 sm:pt-10 pb-8 px-4 sm:px-6 max-w-7xl mx-auto scroll-mt-20">
                <PublicTrainerDashboard
                    onClaimSlot={handleClaimClick}
                    isTrainer={isTrainer}
                />
            </section>

            {/* 2. How Teaching on Celoris Works */}
            <section className="mx-auto max-w-5xl px-4 sm:px-6 mt-12">
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

            {/* 8. Claim Slot & Trainer Registration Modal */}
            <ClaimSlotModal
                slot={claimModalSlot}
                isOpen={claimModalOpen}
                onClose={() => setClaimModalOpen(false)}
            />

            {/* 9. Floating WhatsApp Quick Support (Replaces the companion phone) */}
            <aside aria-label="WhatsApp Support" className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 group">
                <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/95 text-white text-xs font-semibold shadow-2xl border border-white/10 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
                    Chat on WhatsApp
                </span>
                <a
                    href="https://wa.me/919084718101?text=Hi%20Celoris!%20I%20have%20a%20query%20about%20teaching%20on%20Celoris."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-[0_8px_30px_rgba(37,211,102,0.45)] hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer"
                    title="Chat with Celoris Support on WhatsApp"
                    aria-label="Chat with Celoris Support on WhatsApp"
                >
                    <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-300 border-2 border-[#050608]" />
                    </span>
                    <WhatsAppIcon className="w-7 h-7 text-white" />
                </a>
            </aside>
        </div>
    )
}
