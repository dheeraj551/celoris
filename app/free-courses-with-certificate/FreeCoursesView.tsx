"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
    ArrowRight,
    Award,
    Box,
    Briefcase,
    CalendarDays,
    ChevronDown,
    Clock,
    Compass,
    Flame,
    GraduationCap,
    Languages,
    PlayCircle,
    QrCode,
    Share2,
    ShieldCheck,
    Users,
    Video,
    X,
} from "lucide-react"
import { SpotlightCard } from "@/components/ui/spotlight-card"
import { DAYS, MIN_ATTENDANCE, SESSION_TIME_LABEL, SESSIONS, getBootcamp, type BootcampSlug } from "@/lib/bootcamps"
import type { SeatStats } from "@/lib/bootcamp-seats"
import type { BootcampClassroom } from "@/lib/bootcamp-classrooms"
import { BootcampClassroomCard } from "@/components/bootcamp/BootcampClassroomCard"

// Class list for a bootcamp, built from lib/bootcamps so the hub and the course pages always agree.
function buildSyllabus(slug: string) {
    const b = getBootcamp(slug)
    if (!b) return []
    return [
        ...b.days.map((d, i) => ({ day: `Class ${d.day}`, time: b.sessions[i]?.label || "", topic: d.title, desc: d.detail })),
        { day: "Exam", time: b.exam.label, topic: "Final certification exam", desc: `For students who attended at least ${MIN_ATTENDANCE} of the ${SESSIONS} classes.` },
    ]
}

interface FreeCoursesViewProps {
    batchLabel: string
    batchIso?: string
    faqs: { q: string; a: string }[]
    /** Live seat numbers per bootcamp, read on the server. */
    seats?: Partial<Record<BootcampSlug, SeatStats>>
    /** The live classroom each bootcamp is taught in. */
    classrooms?: Partial<Record<BootcampSlug, BootcampClassroom>>
    /** First class date and time per bootcamp, e.g. "Wed, 28 Oct 2026, 12:00 PM IST". */
    firstClassLabels?: Record<string, string>
}

const reelsBootcamp = getBootcamp("social-media-reels")
const dmBootcamp = getBootcamp("digital-marketing")

const FEATURED_COURSES = [
    {
        id: "short-form-video",
        slug: "social-media-reels",
        masterclassUrl: "/learn/course/master-youtube-shorts-instagram-reels",
        bootcampUrl: "/free-courses-with-certificate/social-media-reels",
        classroomId: reelsBootcamp?.classroomId || "4f44c85d-edd6-4e74-b0e5-d1f0498b59f6",
        classroomUrl: "/classrooms?room=4f44c85d-edd6-4e74-b0e5-d1f0498b59f6",
        image: "/free-courses/social-media-reels.jpg",
        badgePill: "Free Seats for Selected Students",
        categoryPill: "Content Creation",
        originalPrice: reelsBootcamp?.originalPrice || 1500,
        price: "FREE",
        offlineEnrolled: reelsBootcamp?.offlineEnrolled || 5,
        totalSeats: reelsBootcamp?.totalSeats || 10,
        remainingSeats: (reelsBootcamp?.totalSeats || 10) - (reelsBootcamp?.offlineEnrolled || 5),
        title: "Free Social Media Reels Bootcamp with Certificate",
        description:
            "7 live one-hour classes over two weeks with Ananya Jairath: find your niche, write hooks, shoot on a smartphone, edit in CapCut and build a 3-Reel portfolio. Final exam on the last day of the batch, then apply to Reels jobs on the Celoris Job Center.",
        instructor: "Ananya Jairath",
        duration: "7 live hours · 2 weeks",
        bootcampShortTitle: "Social Media Reels",
        trainer: "Ananya Jairath",
        trainerRole: "Commercial Video Creator & Content Mentor",
        toolsRequired: "Any smartphone + free CapCut app (No laptop or camera needed)",
        schedule: reelsBootcamp?.scheduleLabel || "",
        startTime: reelsBootcamp?.startTimeLabel || "12:00 PM IST (Noon)",
        syllabus: buildSyllabus("social-media-reels"),
    },
    {
        id: "digital-marketing",
        slug: "digital-marketing",
        masterclassUrl: "/learn/course/digital-marketing-mastery",
        bootcampUrl: "/free-courses-with-certificate/digital-marketing",
        classroomId: dmBootcamp?.classroomId || "d27f7a5f-2e0c-42c3-806f-1bca2aa9890e",
        classroomUrl: "/classrooms?room=d27f7a5f-2e0c-42c3-806f-1bca2aa9890e",
        image: "/free-courses/digital-marketing.jpg",
        badgePill: "Free Seats for Selected Students",
        categoryPill: "Marketing",
        originalPrice: dmBootcamp?.originalPrice || 1500,
        price: "FREE",
        offlineEnrolled: dmBootcamp?.offlineEnrolled || 6,
        totalSeats: dmBootcamp?.totalSeats || 10,
        remainingSeats: (dmBootcamp?.totalSeats || 10) - (dmBootcamp?.offlineEnrolled || 6),
        title: "Free Digital Marketing Bootcamp with Certificate",
        description:
            "7 live one-hour classes over two weeks with Dheeraj Kushwaha: the funnel, SEO and Google Business Profile, social media, Meta and Google Search ads, and GA4 tracking. Final exam on the last day of the batch, then apply to marketing jobs on the Celoris Job Center.",
        instructor: "Dheeraj Kushwaha",
        duration: "7 live hours · 2 weeks",
        bootcampShortTitle: "Digital Marketing",
        trainer: "Dheeraj Kushwaha",
        trainerRole: "Performance Marketing & Growth Strategist",
        toolsRequired: "Smartphone or basic laptop with browser (Zero paid tools needed)",
        schedule: dmBootcamp?.scheduleLabel || "",
        startTime: dmBootcamp?.startTimeLabel || "3:00 PM IST (Afternoon)",
        syllabus: buildSyllabus("digital-marketing"),
    },
]

function BatchCountdown({ batchIso }: { batchIso?: string }) {
    const [mounted, setMounted] = useState(false)
    const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
        days: 14,
        hours: 0,
        minutes: 0,
        seconds: 0,
    })

    useEffect(() => {
        setMounted(true)
        const targetDate = batchIso ? new Date(`${batchIso}T12:00:00+05:30`) : new Date("2026-10-28T12:00:00+05:30")

        const updateTimer = () => {
            const now = new Date()
            const diff = targetDate.getTime() - now.getTime()
            if (diff <= 0) {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
                return
            }
            const days = Math.floor(diff / (1000 * 60 * 60 * 24))
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
            const minutes = Math.floor((diff / (1000 * 60)) % 60)
            const seconds = Math.floor((diff / 1000) % 60)
            setTimeLeft({ days, hours, minutes, seconds })
        }

        updateTimer()
        const timer = setInterval(updateTimer, 1000)
        return () => clearInterval(timer)
    }, [batchIso])

    if (!mounted) return null

    return (
        <div className="mx-auto mt-6 flex max-w-sm flex-col items-center rounded-2xl border border-emerald-500/25 bg-emerald-500/[0.04] p-3 sm:p-3.5 backdrop-blur-md">
            <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-emerald-400 mb-2">
                <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                <span>Next Batch Starts In:</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-2.5 font-mono">
                <div className="flex flex-col items-center rounded-xl border border-white/10 bg-white/[0.05] px-2.5 py-1 min-w-[50px]">
                    <span className="text-lg sm:text-xl font-black text-white">{timeLeft.days}</span>
                    <span className="text-[9px] uppercase tracking-wider text-neutral-400 font-medium">Days</span>
                </div>
                <span className="text-emerald-400 font-bold text-base">:</span>
                <div className="flex flex-col items-center rounded-xl border border-white/10 bg-white/[0.05] px-2.5 py-1 min-w-[50px]">
                    <span className="text-lg sm:text-xl font-black text-white">{String(timeLeft.hours).padStart(2, "0")}</span>
                    <span className="text-[9px] uppercase tracking-wider text-neutral-400 font-medium">Hours</span>
                </div>
                <span className="text-emerald-400 font-bold text-base">:</span>
                <div className="flex flex-col items-center rounded-xl border border-white/10 bg-white/[0.05] px-2.5 py-1 min-w-[50px]">
                    <span className="text-lg sm:text-xl font-black text-white">{String(timeLeft.minutes).padStart(2, "0")}</span>
                    <span className="text-[9px] uppercase tracking-wider text-neutral-400 font-medium">Mins</span>
                </div>
                <span className="text-emerald-400 font-bold text-base">:</span>
                <div className="flex flex-col items-center rounded-xl border border-white/10 bg-white/[0.05] px-2.5 py-1 min-w-[50px]">
                    <span className="text-lg sm:text-xl font-black text-emerald-400">{String(timeLeft.seconds).padStart(2, "0")}</span>
                    <span className="text-[9px] uppercase tracking-wider text-neutral-400 font-medium">Secs</span>
                </div>
            </div>
        </div>
    )
}

export function FreeCoursesView({ batchLabel, batchIso, faqs, seats, classrooms, firstClassLabels }: FreeCoursesViewProps) {
    const [openFaq, setOpenFaq] = useState<number | null>(null)
    const [showCertPreview, setShowCertPreview] = useState(false)
    const [openSyllabus, setOpenSyllabus] = useState<string | null>(null)

    const toggleFaq = (index: number) => {
        setOpenFaq(openFaq === index ? null : index)
    }

    const toggleSyllabus = (id: string) => {
        setOpenSyllabus(openSyllabus === id ? null : id)
    }

    return (
        <div className="relative min-h-screen bg-[#050608] pb-24 text-slate-200 selection:bg-emerald-500/30 overflow-hidden">
            {/* Ambient dynamic background lighting effects */}
            <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
                <motion.div
                    animate={{
                        scale: [1, 1.15, 1],
                        opacity: [0.12, 0.22, 0.12],
                        x: ["-50%", "-48%", "-50%"],
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-32 left-1/2 h-[500px] w-[750px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-500 blur-[140px]"
                />
                <motion.div
                    animate={{
                        opacity: [0.05, 0.12, 0.05],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute top-1/3 -right-48 h-[450px] w-[450px] rounded-full bg-emerald-600/20 blur-[130px]"
                />
                <motion.div
                    animate={{
                        opacity: [0.05, 0.1, 0.05],
                        scale: [1, 1.15, 1],
                    }}
                    transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 4 }}
                    className="absolute bottom-1/4 -left-48 h-[400px] w-[400px] rounded-full bg-teal-500/15 blur-[120px]"
                />
            </div>

            <div className="relative z-10">
                {/* Hero Section */}
                <section className="relative overflow-hidden pt-12 sm:pt-20 pb-16">
                    <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
                        {/* Live Status Pill */}
                        <motion.div
                            initial={{ opacity: 0, y: -15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 backdrop-blur-md shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                            </span>
                            <span className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-400">
                                Festive Special · Free Seats Giveaway
                            </span>
                        </motion.div>

                        {/* Animated Headline */}
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.15 }}
                            className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl"
                        >
                            Festive Offer: Free Seats,{" "}
                            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(52,211,153,0.35)]">
                                taught live with certificate.
                            </span>
                        </motion.h1>

                        {/* Subtitle */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.3 }}
                            className="mx-auto mt-5 max-w-2xl text-base text-neutral-300 sm:text-lg leading-relaxed"
                        >
                            Live interactive classes with real Celoris trainers: {SESSIONS} one-hour classes over two weeks on alternate days, then a final exam on the last day. Pass it and earn your verified certificate. Free seats go to the applicants we select.
                        </motion.p>

                        {/* Interactive Info Badges */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.45 }}
                            className="mx-auto mt-8 flex max-w-3xl flex-wrap justify-center gap-3 text-xs sm:text-sm"
                        >
                            <motion.span
                                whileHover={{ scale: 1.05, y: -2 }}
                                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 backdrop-blur-md shadow-lg transition-colors hover:border-emerald-500/40 hover:bg-white/[0.08]"
                            >
                                <CalendarDays className="h-4 w-4 text-emerald-400" />
                                <span className="font-medium">Next batch starts: <strong className="text-white">{batchLabel}</strong></span>
                            </motion.span>
                            <motion.span
                                whileHover={{ scale: 1.05, y: -2 }}
                                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 backdrop-blur-md shadow-lg transition-colors hover:border-emerald-500/40 hover:bg-white/[0.08]"
                            >
                                <Clock className="h-4 w-4 text-emerald-400" />
                                <span className="font-medium">{SESSIONS} live hours over 2 weeks · alternate days</span>
                            </motion.span>
                            <motion.span
                                whileHover={{ scale: 1.05, y: -2 }}
                                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 backdrop-blur-md shadow-lg transition-colors hover:border-emerald-500/40 hover:bg-white/[0.08]"
                            >
                                <Users className="h-4 w-4 text-emerald-400" />
                                <span className="font-medium">100% Live · Punctual Attendance Required</span>
                            </motion.span>
                            <motion.span
                                whileHover={{ scale: 1.05, y: -2 }}
                                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 backdrop-blur-md shadow-lg transition-colors hover:border-emerald-500/40 hover:bg-white/[0.08]"
                            >
                                <Languages className="h-4 w-4 text-emerald-400" />
                                <span className="font-medium">Medium: Simple Hindi + English (Hinglish)</span>
                            </motion.span>
                            <motion.span
                                whileHover={{ scale: 1.05, y: -2 }}
                                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 backdrop-blur-md shadow-lg transition-colors hover:border-emerald-500/40 hover:bg-white/[0.08]"
                            >
                                <Video className="h-4 w-4 text-emerald-400" />
                                <span className="font-medium">Live in Celoris Classrooms with mentor Q&amp;A</span>
                            </motion.span>
                        </motion.div>

                        {/* Limited Batch Seats Scarcity Pill */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.55 }}
                            className="mx-auto mt-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-medium text-amber-300 backdrop-blur-md"
                        >
                            <Flame className="h-4 w-4 text-amber-400 animate-pulse" />
                            <span>10 seats per course · Paid students already took more than half · The rest go free to selected applicants</span>
                        </motion.div>

                        {/* Live Countdown Timer */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                        >
                            <BatchCountdown batchIso={batchIso} />
                        </motion.div>

                        {/* Social Proof Trust Strip */}
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.65 }}
                            className="mx-auto mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-neutral-400 border-t border-white/[0.06] pt-6 max-w-2xl"
                        >
                            <div className="flex items-center gap-1.5 text-neutral-300">
                                <Languages className="h-4 w-4 text-emerald-400" />
                                <span className="text-neutral-300">Taught live in Hinglish</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                                <span className="text-neutral-300">100% Free · No Card Needed</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Award className="h-4 w-4 text-emerald-400" />
                                <span className="text-neutral-300">Verified Certificate for Job Center</span>
                            </div>
                        </motion.div>

                        {/* Direct Classroom Quick-Access Jump Pill & Social Sandbox */}
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.75 }}
                            className="mt-6 flex flex-wrap items-center justify-center gap-3"
                        >
                            <a
                                href="#live-classrooms"
                                className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/15 hover:bg-emerald-500/25 px-5 py-2 text-xs font-bold text-emerald-300 shadow-[0_0_25px_rgba(16,185,129,0.25)] transition-all hover:scale-105 active:scale-95"
                            >
                                <span className="relative flex h-2 w-2">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                                </span>
                                <GraduationCap className="h-4 w-4 text-emerald-400" />
                                <span>Already registered? Enter Live Classroom Direct ↓</span>
                            </a>
                            <Link
                                href="/social"
                                className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 px-5 py-2 text-xs font-bold text-amber-300 shadow-[0_0_25px_rgba(245,158,11,0.2)] transition-all hover:scale-105 active:scale-95"
                            >
                                <Flame className="h-3.5 w-3.5 text-amber-400" />
                                <span>Celoris Social · Practice with ₹10k Ad Credits →</span>
                            </Link>
                        </motion.div>
                    </div>
                </section>

                {/* Direct Live Classroom Entry Section (3D Virtual Aula) */}
                <section id="live-classrooms" className="mx-auto max-w-6xl px-4 sm:px-6 mb-16 scroll-mt-24">
                    <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-emerald-500/[0.08] via-[#0b0e14]/95 to-[#0b0e14] p-5 sm:p-7 backdrop-blur-2xl shadow-[0_0_50px_rgba(16,185,129,0.12)]">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/[0.08] gap-3">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-400">
                                        Showing 2 Active Classroom Batches
                                    </span>
                                </div>
                                <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                                    Enter Your Live Classroom Direct
                                </h2>
                                <p className="mt-1 text-xs sm:text-sm text-neutral-300">
                                    Enrolled students join directly here. Opens 30 minutes before class — zero searching required.
                                </p>
                            </div>
                            <Link
                                href="/classrooms"
                                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold text-neutral-300 hover:border-emerald-500/40 hover:text-emerald-300 transition-all shrink-0 self-start sm:self-center"
                            >
                                <span>All Classrooms</span>
                                <ArrowRight size={13} />
                            </Link>
                        </div>

                        <div className="mt-6 grid gap-5 md:grid-cols-2">
                            {/* Card 1: Digital Marketing */}
                            <div className="flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-[#0c0d14]/90 p-5 hover:border-emerald-500/40 transition-colors">
                                <div>
                                    <div className="flex items-center justify-between gap-2 mb-3">
                                        <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 rounded-full">
                                            <Box className="w-3.5 h-3.5 text-emerald-400" />
                                            <span>3D Virtual Aula</span>
                                        </span>
                                        <span className="inline-flex items-center gap-1 text-[11px] font-mono text-neutral-400">
                                            <Clock className="w-3.5 h-3.5 text-emerald-400" />
                                            <span>28 Oct</span>
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-white leading-snug">
                                        Digital Marketing Mastery — From Basics to Campaign-Ready
                                    </h3>
                                    <p className="mt-2 text-xs text-neutral-400 leading-relaxed">
                                        This course takes you from zero to job-ready, covering everything from SEO fundamentals to running live Meta and Google ad campaigns.
                                    </p>
                                    <div className="mt-3 flex flex-wrap gap-1.5">
                                        <span className="text-[10px] font-mono text-neutral-400 bg-white/[0.04] border border-white/[0.08] px-2 py-0.5 rounded-md">#Digital</span>
                                        <span className="text-[10px] font-mono text-neutral-400 bg-white/[0.04] border border-white/[0.08] px-2 py-0.5 rounded-md">#Marketing</span>
                                        <span className="text-[10px] font-mono text-neutral-400 bg-white/[0.04] border border-white/[0.08] px-2 py-0.5 rounded-md">#Training</span>
                                    </div>
                                    <div className="mt-3 rounded-xl border border-amber-500/25 bg-amber-500/10 px-3 py-1.5 text-[11px] font-mono text-amber-300">
                                        Opens 30 min before class · Pro skips the line
                                    </div>
                                    <div className="mt-3 rounded-xl border border-white/[0.06] bg-black/40 p-3">
                                        <p className="text-xs font-mono font-semibold text-emerald-400">
                                            Next Class: Wed, 28 Oct · 12:00 PM IST
                                        </p>
                                        <p className="text-[11px] font-mono text-neutral-400 mt-0.5">
                                            Batch: Batch starting 28 Oct 2026 12:00 PM
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-5 pt-3 border-t border-white/[0.08]">
                                    <div className="flex items-center justify-between mb-3 text-xs">
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold flex items-center justify-center font-mono">
                                                D
                                            </div>
                                            <div>
                                                <span className="text-[9px] uppercase font-mono text-neutral-400 block leading-tight">Trainer</span>
                                                <span className="text-white font-semibold">Dheeraj Kushwaha</span>
                                            </div>
                                        </div>
                                        <span className="font-mono text-[11px] text-emerald-400">10 Seats Cohort</span>
                                    </div>
                                    <Link
                                        href="/classrooms?room=d27f7a5f-2e0c-42c3-806f-1bca2aa9890e"
                                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-black shadow-md shadow-emerald-500/20 transition-all hover:from-emerald-400 hover:to-teal-400 hover:scale-[1.01] active:scale-98"
                                    >
                                        <GraduationCap className="h-4 w-4" />
                                        <span>Enter Classroom</span>
                                        <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" />
                                    </Link>
                                </div>
                            </div>

                            {/* Card 2: Social Media Reels */}
                            <div className="flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-[#0c0d14]/90 p-5 hover:border-emerald-500/40 transition-colors">
                                <div>
                                    <div className="flex items-center justify-between gap-2 mb-3">
                                        <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 rounded-full">
                                            <Box className="w-3.5 h-3.5 text-emerald-400" />
                                            <span>3D Virtual Aula</span>
                                        </span>
                                        <span className="inline-flex items-center gap-1 text-[11px] font-mono text-neutral-400">
                                            <Clock className="w-3.5 h-3.5 text-emerald-400" />
                                            <span>28 Oct</span>
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-white leading-snug">
                                        The Short-Form Video Masterclass — YouTube Shorts &amp; Instagram Reels
                                    </h3>
                                    <p className="mt-2 text-xs text-neutral-400 leading-relaxed">
                                        Foundations &amp; Mindset · Find your niche, write hooks, shoot on smartphone, edit in CapCut, and assemble a 3-Reel portfolio.
                                    </p>
                                    <div className="mt-3 flex flex-wrap gap-1.5">
                                        <span className="text-[10px] font-mono text-neutral-400 bg-white/[0.04] border border-white/[0.08] px-2 py-0.5 rounded-md">#Classroom</span>
                                        <span className="text-[10px] font-mono text-neutral-400 bg-white/[0.04] border border-white/[0.08] px-2 py-0.5 rounded-md">#Live</span>
                                        <span className="text-[10px] font-mono text-neutral-400 bg-white/[0.04] border border-white/[0.08] px-2 py-0.5 rounded-md">#DigitalMarketing</span>
                                    </div>
                                    <div className="mt-3 rounded-xl border border-amber-500/25 bg-amber-500/10 px-3 py-1.5 text-[11px] font-mono text-amber-300">
                                        Opens 30 min before class · Pro skips the line
                                    </div>
                                    <div className="mt-3 rounded-xl border border-white/[0.06] bg-black/40 p-3">
                                        <p className="text-xs font-mono font-semibold text-emerald-400">
                                            Next Class: Wed, 28 Oct · 3:00 PM IST
                                        </p>
                                        <p className="text-[11px] font-mono text-neutral-400 mt-0.5">
                                            Batch: Batch #03 · Class 01: Foundations &amp; Creator Mindset
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-5 pt-3 border-t border-white/[0.08]">
                                    <div className="flex items-center justify-between mb-3 text-xs">
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold flex items-center justify-center font-mono">
                                                A
                                            </div>
                                            <div>
                                                <span className="text-[9px] uppercase font-mono text-neutral-400 block leading-tight">Trainer</span>
                                                <span className="text-white font-semibold">Ananya Jairath</span>
                                            </div>
                                        </div>
                                        <span className="font-mono text-[11px] text-emerald-400">10 Seats Cohort</span>
                                    </div>
                                    <Link
                                        href="/classrooms?room=4f44c85d-edd6-4e74-b0e5-d1f0498b59f6"
                                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-black shadow-md shadow-emerald-500/20 transition-all hover:from-emerald-400 hover:to-teal-400 hover:scale-[1.01] active:scale-98"
                                    >
                                        <GraduationCap className="h-4 w-4" />
                                        <span>Enter Classroom</span>
                                        <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Popular Courses Showcase Section */}
                <section className="mx-auto max-w-6xl px-4 sm:px-6">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-3">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                                Choose your free course
                            </h2>
                        </div>
                        <p className="text-xs sm:text-sm text-neutral-400 max-w-md">
                            Two <span className="text-emerald-400 font-semibold">live courses with certificate</span>, with free seats for selected students and a new batch every 14 days. Each one leads into a full paid course if you want to go deeper.
                        </p>
                    </div>

                    {/* Which track should you choose? Decision helper */}
                    <div className="mb-8 rounded-3xl border border-white/[0.08] bg-white/[0.02] p-4 sm:p-5 backdrop-blur-xl shadow-lg">
                        <div className="flex items-center gap-2 mb-3">
                            <Compass className="h-4 w-4 text-emerald-400" />
                            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                                Not sure which track to pick? Quick Decision Guide
                            </span>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-3 text-xs">
                            <div className="rounded-2xl border border-white/[0.06] bg-black/40 p-3.5 flex flex-col justify-between">
                                <div>
                                    <span className="font-semibold text-white block mb-1">
                                        📱 Choose Social Media Reels if:
                                    </span>
                                    <span className="text-neutral-400 leading-relaxed">
                                        You want to build an audience on Instagram/YouTube, become a creator, or freelance as a mobile video editor for brands.
                                    </span>
                                </div>
                                <span className="mt-2.5 text-[11px] font-mono text-emerald-400/90 font-medium">
                                    ✦ Needs only your smartphone + free CapCut
                                </span>
                            </div>
                            <div className="rounded-2xl border border-white/[0.06] bg-black/40 p-3.5 flex flex-col justify-between">
                                <div>
                                    <span className="font-semibold text-white block mb-1">
                                        📈 Choose Digital Marketing if:
                                    </span>
                                    <span className="text-neutral-400 leading-relaxed">
                                        You want a marketing agency job, run profitable Meta/Google ads, or offer SEO &amp; business growth services.
                                    </span>
                                </div>
                                <span className="mt-2.5 text-[11px] font-mono text-emerald-400/90 font-medium">
                                    ✦ Works on any phone or basic computer browser
                                </span>
                            </div>
                        </div>
                        <p className="mt-3 text-center sm:text-left text-[11px] text-neutral-400 font-mono">
                            <span className="text-emerald-400 font-semibold">Pro-Tip:</span> Their class schedules never clash — ambitious students can enroll in both courses to earn dual certificates!
                        </p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2">
                        {FEATURED_COURSES.map((course, idx) => {
                            const live = seats?.[course.slug as BootcampSlug]
                            const freeSeats = live?.freeSeats ?? course.remainingSeats
                            const seatsLeft = live?.seatsLeft ?? course.remainingSeats
                            const applications = live?.applications ?? 0
                            const filled = course.totalSeats - seatsLeft
                            const classroom = classrooms?.[course.slug as BootcampSlug]
                            return (
                            <motion.div
                                key={course.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: idx * 0.15 }}
                                whileHover={{ y: -6 }}
                                className="h-full"
                            >
                                <SpotlightCard
                                    radius="2rem"
                                    beamColor="rgba(16, 185, 129, 0.85)"
                                    glowColor="rgba(16, 185, 129, 0.14)"
                                    className="h-full shadow-[0_0_50px_rgba(0,0,0,0.8)] hover:shadow-[0_0_60px_rgba(16,185,129,0.18)] transition-shadow duration-500"
                                    innerClassName="group flex flex-col justify-between bg-[#0b0e14]/95 backdrop-blur-3xl overflow-hidden p-5 sm:p-7 border border-white/[0.08] hover:border-emerald-500/40 transition-colors"
                                >
                                    <div className="flex flex-col">
                                        {/* Image Frame */}
                                        <div className="relative aspect-[1200/630] w-full overflow-hidden rounded-2xl bg-black/60 border border-white/[0.08] shadow-2xl mb-5">
                                            <img
                                                src={course.image}
                                                alt={course.title}
                                                width={1200}
                                                height={630}
                                                loading="lazy"
                                                decoding="async"
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                            {/* Subtle gradient vignette overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e14]/70 via-transparent to-transparent pointer-events-none" />

                                            {/* Free Certificate Overlay Badge with preview modal trigger */}
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    e.stopPropagation()
                                                    setShowCertPreview(true)
                                                }}
                                                className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-lg bg-[#050608]/85 backdrop-blur-md px-2.5 py-1 text-[11px] font-mono font-bold text-emerald-400 border border-emerald-500/30 hover:border-emerald-400 hover:bg-emerald-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-lg z-10"
                                                title="Click to view sample certificate"
                                            >
                                                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                                                <span>Free Certificate Included · Preview ↗</span>
                                            </button>
                                        </div>

                                        {/* Status Badges Row */}
                                        <div className="flex items-center gap-2 mb-3.5 flex-wrap">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono uppercase font-bold tracking-wider">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                                {course.badgePill}
                                            </span>
                                            <span className="text-[10px] font-mono font-bold text-neutral-300 bg-white/[0.05] border border-white/[0.1] px-3 py-1 rounded-full uppercase tracking-wider truncate max-w-[210px]">
                                                {course.categoryPill}
                                            </span>
                                        </div>

                                        {/* Course Title */}
                                        <h3 className="text-xl sm:text-2xl font-bold text-white leading-snug mb-2 group-hover:text-emerald-300 transition-colors tracking-tight">
                                            <Link href={course.bootcampUrl}>
                                                {course.title}
                                            </Link>
                                        </h3>

                                        {/* Price Strike-Through & Value Reveal */}
                                        <div className="flex items-center gap-2.5 mb-3 flex-wrap">
                                            <span className="line-through text-slate-500 text-sm font-semibold">₹{course.originalPrice.toLocaleString("en-IN")}</span>
                                            <span className="text-emerald-400 font-black text-2xl tracking-tight">FREE</span>
                                            <span className="text-[10px] uppercase font-mono font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                                                For selected students
                                            </span>
                                        </div>

                                        {/* Live Cohort Availability & Giveaway Seats */}
                                        <div className="mb-4 rounded-xl border border-amber-500/25 bg-amber-500/[0.05] p-3">
                                            <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                                                <span className="text-neutral-300 font-medium">Free seats:</span>
                                                <span className="text-amber-300 font-bold">
                                                    {seatsLeft > 0 ? `${seatsLeft} of ${freeSeats} still open` : "All given — apply for the next batch"}
                                                </span>
                                            </div>
                                            <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                                                <div
                                                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-amber-400"
                                                    style={{ width: `${Math.min(100, (filled / course.totalSeats) * 100)}%` }}
                                                />
                                            </div>
                                            <div className="mt-1.5 flex items-center justify-between text-[11px] text-neutral-400 font-mono gap-2 flex-wrap">
                                                <span>{course.offlineEnrolled}/{course.totalSeats} taken by paid students</span>
                                                <span className="text-emerald-400 font-semibold">
                                                    {applications > 0 ? `${applications} applied so far` : "Applications open"}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed mb-4 line-clamp-3">
                                            {course.description}
                                        </p>

                                        {/* Specific Live Schedule Pill */}
                                        <div className="mb-2.5 flex items-center gap-2 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-3.5 py-2 text-[11px] sm:text-xs font-mono text-emerald-300">
                                            <CalendarDays className="h-4 w-4 shrink-0 text-emerald-400" />
                                            <span>Live Schedule: <strong className="text-white">{course.schedule}</strong></span>
                                        </div>

                                        {/* The real classroom this bootcamp is taught in */}
                                        {classroom && (
                                            <div className="mb-3.5">
                                                <BootcampClassroomCard
                                                    classroom={classroom}
                                                    firstClassLabel={firstClassLabels?.[course.slug] || batchLabel}
                                                    compact
                                                />
                                            </div>
                                        )}

                                        {/* Requirements / Tools Pill */}
                                        <div className="mb-3.5 flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-1.5 text-[11px] font-mono text-neutral-300">
                                            <span className="text-emerald-400 font-semibold shrink-0">Required:</span>
                                            <span className="text-neutral-300 truncate">{course.toolsRequired}</span>
                                        </div>

                                        {/* Syllabus Accordion Drawer */}
                                        <div className="mb-4">
                                            <button
                                                type="button"
                                                onClick={() => toggleSyllabus(course.id)}
                                                className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs font-mono text-neutral-300 hover:border-emerald-500/40 hover:bg-white/[0.06] transition-all"
                                            >
                                                <span className="font-semibold text-emerald-400">View {SESSIONS} live classes + exam</span>
                                                <ChevronDown
                                                    className={`h-4 w-4 text-neutral-400 transition-transform duration-300 ${
                                                        openSyllabus === course.id ? "rotate-180 text-emerald-400" : ""
                                                    }`}
                                                />
                                            </button>
                                            <AnimatePresence>
                                                {openSyllabus === course.id && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: "auto" }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        transition={{ duration: 0.25 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="mt-2 space-y-2 rounded-xl border border-white/[0.06] bg-black/40 p-3 text-xs">
                                                            {course.syllabus.map((s) => (
                                                                <div
                                                                    key={s.day}
                                                                    className="border-b border-white/[0.04] pb-2 last:border-none last:pb-0"
                                                                >
                                                                    <div className="flex items-center justify-between font-mono font-semibold text-emerald-400 text-[11px]">
                                                                        <span>
                                                                            {s.day}: {s.topic}
                                                                        </span>
                                                                        <span className="text-neutral-400 font-normal">
                                                                            {s.time}
                                                                        </span>
                                                                    </div>
                                                                    <p className="mt-0.5 text-neutral-400 text-[11px] leading-relaxed">
                                                                        {s.desc}
                                                                    </p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>

                                    {/* Bottom Meta & CTAs */}
                                    <div className="pt-4 border-t border-white/[0.08] mt-auto">
                                        <div className="flex items-center justify-between gap-3 flex-wrap">
                                            <div className="flex flex-col">
                                                <span className="text-neutral-200 font-semibold text-xs leading-tight">
                                                    {course.trainer}
                                                </span>
                                                <span className="text-[10px] text-emerald-400/90 font-mono mt-0.5">
                                                    {course.trainerRole}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2 flex-wrap">
                                                <Link
                                                    href={course.classroomUrl}
                                                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black text-xs font-bold uppercase tracking-wider rounded-full shadow-[0_0_20px_rgba(52,211,153,0.35)] hover:shadow-[0_0_30px_rgba(52,211,153,0.55)] hover:scale-105 active:scale-95 transition-all whitespace-nowrap"
                                                >
                                                    <GraduationCap className="w-3.5 h-3.5" />
                                                    <span>Enter Classroom</span>
                                                </Link>
                                                <Link
                                                    href={course.bootcampUrl}
                                                    className="inline-flex items-center gap-1.5 px-4 py-2 border border-white/10 hover:border-emerald-500/40 bg-white/[0.04] hover:bg-white/[0.08] text-white text-xs font-bold uppercase tracking-wider rounded-full transition-all whitespace-nowrap"
                                                >
                                                    <span>Apply Free</span>
                                                    <ArrowRight size={12} className="stroke-[2.5]" />
                                                </Link>
                                            </div>
                                        </div>

                                        {/* Direct 7-day join link & WhatsApp Study Partner Share */}
                                        <div className="mt-3 flex items-center justify-between text-[11px] text-neutral-400 font-mono gap-2 flex-wrap">
                                            <a
                                                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                                                    `Hey! Celoris is giving free seats in its ${course.bootcampShortTitle} live course with certificate (worth ₹1,500) to selected students, starting ${batchLabel}. Apply here: https://celorisdesigns.com${course.bootcampUrl}`
                                                )}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1.5 text-neutral-400 hover:text-emerald-400 transition-colors"
                                                title="Share with a study partner"
                                            >
                                                <Share2 size={12} className="text-emerald-400" />
                                                <span>Invite friend</span>
                                            </a>
                                            <Link
                                                href={course.classroomUrl}
                                                className="text-emerald-400 hover:text-emerald-300 underline-offset-2 hover:underline flex items-center gap-1 font-semibold"
                                            >
                                                <span>Enter 3D Classroom</span>
                                                <span>→</span>
                                            </Link>
                                        </div>

                                        {/* Masterclass cross-link for students wanting the deep-dive */}
                                        {course.masterclassUrl && (
                                            <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono">
                                                <span className="text-neutral-400">
                                                    {course.slug === "digital-marketing" ? "Want full career training & live ad budgets?" : "Want full 6-week studio creator mentorship?"}
                                                </span>
                                                <Link
                                                    href={course.masterclassUrl}
                                                    className="text-amber-300 hover:text-amber-200 font-semibold inline-flex items-center gap-1 hover:underline"
                                                >
                                                    <span>{course.slug === "digital-marketing" ? "Digital Marketing Course" : "Reels Masterclass"}</span>
                                                    <span>→</span>
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                </SpotlightCard>
                            </motion.div>
                            )
                        })}
                    </div>

                    {/* Deep-Dive Paid Masterclasses & Career Tracks Showcase */}
                    <div className="mt-14">
                        <div className="text-center mb-6">
                            <span className="font-mono text-xs font-bold uppercase tracking-wider text-amber-400">
                                Beyond the Bootcamp · Full Career Tracks
                            </span>
                            <h3 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-white">
                                Want the Complete Live Masterclass?
                            </h3>
                            <p className="mt-1 text-xs sm:text-sm text-neutral-400 max-w-xl mx-auto">
                                Intensive multi-week programs with portfolio reviews, 1-on-1 mentorship, live ad spends, and job placement assistance.
                            </p>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            {/* Card 1: Shorts & Reels */}
                            <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-b from-amber-500/[0.08] via-[#0b0e14]/95 to-[#0b0e14] p-6 sm:p-7 backdrop-blur-2xl shadow-[0_0_50px_rgba(245,158,11,0.1)] flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                                        <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-amber-300 bg-amber-500/15 border border-amber-500/30 px-3 py-1 rounded-full">
                                            <Video className="w-3.5 h-3.5 text-amber-400" />
                                            <span>Creator Masterclass</span>
                                        </span>
                                        <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider text-rose-300 bg-rose-500/20 border border-rose-500/40 px-3 py-1 rounded-full">
                                            <span>Batch 05 Sold Out (10/10 Seats)</span>
                                        </span>
                                    </div>
                                    <h4 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-snug">
                                        Master YouTube Shorts &amp; Instagram Reels
                                    </h4>
                                    <p className="mt-2 text-xs sm:text-sm text-neutral-300 leading-relaxed">
                                        6-week studio program: retention psychology, viral scripting frameworks, CapCut &amp; desktop editing, brand sponsor deal kits, and live 1-on-1 feedback with Ananya Jairath.
                                    </p>
                                    <div className="mt-4 space-y-1.5 text-xs font-mono">
                                        <div className="flex items-center gap-1.5 text-amber-300">
                                            <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                                            <span>Batch 05: Starts Wed, 28 Oct · 3:00 PM IST</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-neutral-400">
                                            <Users className="w-4 h-4 text-neutral-400 shrink-0" />
                                            <span>10 Seats strictly capped · Waitlist open for Batch 06</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between gap-3 flex-wrap">
                                    <Link
                                        href="/learn/course/master-youtube-shorts-instagram-reels"
                                        className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-5 py-2.5 text-xs uppercase tracking-wider font-mono transition-all hover:scale-105 active:scale-95"
                                    >
                                        <span>View Masterclass</span>
                                        <ArrowRight size={13} className="stroke-[2.5]" />
                                    </Link>
                                    <Link
                                        href="/learn/course/master-youtube-shorts-instagram-reels"
                                        className="text-xs font-mono text-amber-300 hover:text-white underline-offset-2 hover:underline"
                                    >
                                        Join Waitlist →
                                    </Link>
                                </div>
                            </div>

                            {/* Card 2: Digital Marketing Mastery */}
                            <div className="rounded-3xl border border-teal-500/30 bg-gradient-to-b from-teal-500/[0.08] via-[#0b0e14]/95 to-[#0b0e14] p-6 sm:p-7 backdrop-blur-2xl shadow-[0_0_50px_rgba(20,184,166,0.1)] flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                                        <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-teal-300 bg-teal-500/15 border border-teal-500/30 px-3 py-1 rounded-full">
                                            <Award className="w-3.5 h-3.5 text-teal-400" />
                                            <span>Live Agency Masterclass</span>
                                        </span>
                                        <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider text-rose-300 bg-rose-500/20 border border-rose-500/40 px-3 py-1 rounded-full">
                                            <span>Batch #43 Sold Out (All 10 Claimed)</span>
                                        </span>
                                    </div>
                                    <h4 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-snug">
                                        Digital Marketing Mastery — Live Ads &amp; AI Tools
                                    </h4>
                                    <p className="mt-2 text-xs sm:text-sm text-neutral-300 leading-relaxed">
                                        Comprehensive hands-on training: real Meta &amp; Google ad spend budgets, SEO audit setups, GA4 tracking, and AI-powered client funnels with UrbanPro Top Tutor Dheeraj Kushwaha.
                                    </p>
                                    <div className="mt-4 space-y-1.5 text-xs font-mono">
                                        <div className="flex items-center gap-1.5 text-teal-300">
                                            <Clock className="w-4 h-4 text-teal-400 shrink-0" />
                                            <span>Batch #43: Starts Wed, 28 Oct · 12:00 PM IST</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-neutral-400">
                                            <Users className="w-4 h-4 text-neutral-400 shrink-0" />
                                            <span>Trainer: Dheeraj Kushwaha (UrbanPro 4.5★ Top Tutor)</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between gap-3 flex-wrap">
                                    <Link
                                        href="/learn/course/digital-marketing-mastery"
                                        className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-bold px-5 py-2.5 text-xs uppercase tracking-wider font-mono transition-all hover:scale-105 active:scale-95"
                                    >
                                        <span>View Course Page</span>
                                        <ArrowRight size={13} className="stroke-[2.5]" />
                                    </Link>
                                    <Link
                                        href="/learn/course/digital-marketing-mastery"
                                        className="text-xs font-mono text-teal-300 hover:text-white underline-offset-2 hover:underline"
                                    >
                                        Join Waitlist →
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How the free certificate works */}
                <section className="mx-auto mt-24 max-w-5xl px-4 sm:px-6">
                    <div className="text-center mb-12">
                        <span className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-400">
                            Clear, Verified, Transparent
                        </span>
                        <h2 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                            How the free certificate works
                        </h2>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-3">
                        {[
                            {
                                icon: CalendarDays,
                                step: "Step 1",
                                title: "Apply for a free seat",
                                body: "Sign in with Google and tell us in one line what you will do with the skill. We pick the students for the free seats. A new batch starts every 14 days.",
                            },
                            {
                                icon: Award,
                                step: "Step 2",
                                title: "Attend live & pass test",
                                body: "Join the live classes punctually at the scheduled times. There are no recordings, so attendance is required to qualify for the final skill test and certificate.",
                                isCertStep: true,
                            },
                            {
                                icon: Briefcase,
                                step: "Step 3",
                                title: "Apply for jobs & gigs",
                                body: "Your verified certificate unlocks free applications to certified roles on the Celoris Job Center with hiring preference.",
                            },
                        ].map((s, i) => (
                            <motion.div
                                key={s.title}
                                initial={{ opacity: 0, y: 25 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.15 }}
                                whileHover={{ y: -5 }}
                                className="group relative rounded-3xl border border-white/[0.08] bg-white/[0.03] p-6 sm:p-7 backdrop-blur-xl transition-all hover:border-emerald-500/40 hover:bg-white/[0.05] hover:shadow-[0_0_30px_rgba(16,185,129,0.12)] flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex items-center justify-between">
                                        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-500/25 transition-all">
                                            <s.icon className="h-5 w-5" />
                                        </span>
                                        <span className="font-mono text-xs font-semibold text-emerald-400/80 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                                            {s.step}
                                        </span>
                                    </div>
                                    <h3 className="mt-5 text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                                        {s.title}
                                    </h3>
                                    <p className="mt-2 text-sm text-neutral-400 leading-relaxed">
                                        {s.body}
                                    </p>
                                </div>

                                {s.isCertStep && (
                                    <button
                                        type="button"
                                        onClick={() => setShowCertPreview(true)}
                                        className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 underline-offset-4 hover:underline cursor-pointer"
                                    >
                                        <span>Preview Verified Certificate</span>
                                        <ArrowRight className="h-3 w-3" />
                                    </button>
                                )}
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-8 rounded-2xl border border-amber-500/20 bg-amber-500/[0.05] p-4 text-sm text-neutral-300">
                        <span className="font-semibold text-amber-300">Same classroom as paid students: </span>
                        free-seat students join the same live Celoris classroom as our paid Pro members, with the same trainer. Pro members get extra
                        perks, like speaking on the mic; free students ask their questions in the class chat.
                    </div>

                    <div className="mt-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <Briefcase className="h-5 w-5 text-emerald-400 shrink-0" />
                            <p className="text-sm text-neutral-300">
                                Ready to work? Explore open freelance contracts and certified positions right now.
                            </p>
                        </div>
                        <Link
                            href="/job-center"
                            className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 hover:text-emerald-300 underline-offset-4 hover:underline shrink-0"
                        >
                            <span>Explore Job Center</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                    </div>
                </section>

                {/* Interactive FAQ Section */}
                <section className="mx-auto mt-24 max-w-3xl px-4 sm:px-6">
                    <div className="text-center mb-10">
                        <span className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-400">
                            Got Questions?
                        </span>
                        <h2 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                            Frequently Asked Questions
                        </h2>
                    </div>

                    <div className="space-y-3">
                        {faqs.map((f, i) => {
                            const isOpen = openFaq === i
                            return (
                                <motion.div
                                    key={f.q}
                                    initial={{ opacity: 0, y: 15 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: i * 0.08 }}
                                    className="rounded-2xl border border-white/[0.08] bg-white/[0.02] overflow-hidden transition-colors hover:border-emerald-500/30"
                                >
                                    <button
                                        type="button"
                                        onClick={() => toggleFaq(i)}
                                        className="flex w-full items-center justify-between p-5 text-left transition-colors"
                                    >
                                        <span className="font-medium text-white sm:text-base pr-4">
                                            {f.q}
                                        </span>
                                        <motion.span
                                            animate={{ rotate: isOpen ? 180 : 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/[0.05] text-emerald-400"
                                        >
                                            <ChevronDown className="h-4 w-4" />
                                        </motion.span>
                                    </button>
                                    <AnimatePresence>
                                        {isOpen && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="overflow-hidden"
                                            >
                                                <p className="px-5 pb-5 text-sm text-neutral-300 leading-relaxed border-t border-white/[0.04] pt-3">
                                                    {f.a}
                                                </p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            )
                        })}
                    </div>

                    <p className="mt-8 text-center text-sm text-neutral-400">
                        Still have a question after reading the FAQ?{" "}
                        <a
                            href="https://wa.me/919084718101?text=Hi%2C%20I%20have%20a%20question%20about%20the%20Celoris%20Free%20Live%20Courses%20with%20Certificate."
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-400 underline-offset-2 hover:underline"
                        >
                            Message us on WhatsApp
                        </a>
                        .
                    </p>

                    <p className="mt-4 text-center text-xs text-neutral-500">
                        A Celoris certificate verifies practical skills and completion. Hiring decisions are made by employers on the Celoris Job Center.
                    </p>
                </section>
            </div>

            {/* Certificate Preview Modal */}
            <AnimatePresence>
                {showCertPreview && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowCertPreview(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: "spring", duration: 0.5 }}
                            className="relative z-10 w-full max-w-2xl overflow-hidden rounded-3xl border border-emerald-500/30 bg-[#080b10] p-6 sm:p-8 shadow-[0_0_80px_rgba(16,185,129,0.25)]"
                        >
                            {/* Close button */}
                            <button
                                type="button"
                                onClick={() => setShowCertPreview(false)}
                                className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-neutral-400 hover:bg-white/20 hover:text-white transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>

                            {/* Certificate Chassis */}
                            <div className="relative rounded-2xl border-2 border-emerald-500/40 bg-gradient-to-br from-[#0a0f16] via-[#0d141f] to-[#0a0e14] p-6 sm:p-8 text-center shadow-inner">
                                {/* Watermark & Seals */}
                                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                                    <div className="flex items-center gap-2">
                                        <img src="/celoris-logo.png" alt="Celoris" className="h-7 w-auto object-contain" />
                                        <span className="text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase">Academy</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                                        <ShieldCheck className="h-3.5 w-3.5" />
                                        <span>Verified Credential</span>
                                    </div>
                                </div>

                                <p className="font-mono text-[10px] tracking-widest text-emerald-400 uppercase font-bold">
                                    Celoris Designs LLP · Skill Verification Authority
                                </p>
                                <h3 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                                    Certificate of Completion
                                </h3>
                                <p className="mt-1 text-xs text-neutral-400">
                                    This certifies that
                                </p>

                                <div className="my-5 border-b-2 border-emerald-500/40 pb-2">
                                    <p className="text-2xl sm:text-3xl font-serif italic text-emerald-300">
                                        Student Name
                                    </p>
                                </div>

                                <p className="text-xs text-neutral-300 max-w-md mx-auto leading-relaxed">
                                    has successfully attended the 7-class live online bootcamp and passed the practical skill examination in
                                </p>
                                <p className="mt-2 text-base font-bold text-white">
                                    Social Media Video Editing &amp; Content Strategy
                                </p>

                                <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-4 text-[11px] font-mono text-neutral-400">
                                    <div className="text-left">
                                        <p className="text-neutral-500">ID: CEL-2026-LIVE-8942</p>
                                        <p className="text-emerald-400">Job Center Verified Badge</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <QrCode className="h-8 w-8 text-emerald-400" />
                                        <span className="text-[9px] text-neutral-400 text-left">Scan to verify authenticity</span>
                                    </div>
                                </div>
                            </div>

                            <p className="mt-4 text-center text-xs text-neutral-400">
                                Automatically added to your profile upon passing the test. Verified by Celoris Job Center employers.
                            </p>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </div>
    )
}
