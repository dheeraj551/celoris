"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
    ArrowRight,
    Award,
    Briefcase,
    CalendarDays,
    ChevronDown,
    Clock,
    Compass,
    Flame,
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
import { DAYS, MIN_ATTENDANCE, SESSION_TIME_LABEL, SESSIONS, getBootcamp } from "@/lib/bootcamps"

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
}

const reelsBootcamp = getBootcamp("social-media-reels")
const dmBootcamp = getBootcamp("digital-marketing")

const FEATURED_COURSES = [
    {
        id: "short-form-video",
        slug: "social-media-reels",
        masterclassUrl: "/learn/course/master-youtube-shorts-instagram-reels",
        bootcampUrl: "/free-courses-with-certificate/social-media-reels",
        image: "/free-courses/social-media-reels.jpg",
        badgePill: "100% Free Giveaway",
        categoryPill: "Content Creation",
        originalPrice: reelsBootcamp?.originalPrice || 1500,
        price: "FREE",
        offlineEnrolled: reelsBootcamp?.offlineEnrolled || 5,
        totalSeats: reelsBootcamp?.totalSeats || 10,
        remainingSeats: (reelsBootcamp?.totalSeats || 10) - (reelsBootcamp?.offlineEnrolled || 5),
        title: "Free Social Media Reels Bootcamp with Certificate",
        description:
            "7 live one-hour classes over two weeks with Ananya Jairath: find your niche, write hooks, shoot on a smartphone, edit in CapCut and build a 3-Reel portfolio. Final exam on the second Sunday, then apply to Reels jobs on the Celoris Job Center.",
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
        image: "/free-courses/digital-marketing.jpg",
        badgePill: "100% Free Giveaway",
        categoryPill: "Marketing",
        originalPrice: dmBootcamp?.originalPrice || 1500,
        price: "FREE",
        offlineEnrolled: dmBootcamp?.offlineEnrolled || 6,
        totalSeats: dmBootcamp?.totalSeats || 10,
        remainingSeats: (dmBootcamp?.totalSeats || 10) - (dmBootcamp?.offlineEnrolled || 6),
        title: "Free Digital Marketing Bootcamp with Certificate",
        description:
            "7 live one-hour classes over two weeks with Dheeraj Kushwaha: the funnel, SEO and Google Business Profile, social media, Meta and Google Search ads, and GA4 tracking. Final exam on the second Sunday, then apply to marketing jobs on the Celoris Job Center.",
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

export function FreeCoursesView({ batchLabel, batchIso, faqs }: FreeCoursesViewProps) {
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
                                Festive Special · 100% Free Giveaway
                            </span>
                        </motion.div>

                        {/* Animated Headline */}
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.15 }}
                            className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl"
                        >
                            Festive Offer: Free Giveaways,{" "}
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
                            Live interactive classes with real Celoris trainers: {SESSIONS} one-hour classes over two weeks on alternate evenings, then a final exam on the second Sunday. Pass it and earn your verified certificate.
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
                                <span className="font-medium">{SESSIONS} live hours over 2 weeks · alternate evenings</span>
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
                            <span>Strictly 10 seats per batch · Offline registrations already claimed 50%+ · Remaining seats given as Free Giveaway!</span>
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
                            Two <span className="text-emerald-400 font-semibold">free live bootcamps with certificate</span>, with a new batch every 14 days. Each one leads into a full paid course if you want to go deeper.
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
                        {FEATURED_COURSES.map((course, idx) => (
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
                                                Save ₹{course.originalPrice.toLocaleString("en-IN")} Giveaway
                                            </span>
                                        </div>

                                        {/* Live Cohort Availability & Giveaway Seats */}
                                        <div className="mb-4 rounded-xl border border-amber-500/25 bg-amber-500/[0.05] p-3">
                                            <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                                                <span className="text-neutral-300 font-medium">Batch Seats:</span>
                                                <span className="text-amber-300 font-bold">Only {course.remainingSeats} Seats Left!</span>
                                            </div>
                                            <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                                                <div
                                                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-amber-400"
                                                    style={{ width: `${(course.offlineEnrolled / course.totalSeats) * 100}%` }}
                                                />
                                            </div>
                                            <div className="mt-1.5 flex items-center justify-between text-[11px] text-neutral-400 font-mono">
                                                <span>{course.offlineEnrolled}/{course.totalSeats} claimed offline</span>
                                                <span className="text-emerald-400 font-semibold">{course.remainingSeats} giveaway seats open</span>
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

                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={course.bootcampUrl}
                                                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-neutral-950 text-xs font-bold uppercase tracking-wider rounded-full shadow-[0_0_20px_rgba(52,211,153,0.35)] hover:shadow-[0_0_30px_rgba(52,211,153,0.55)] hover:scale-105 active:scale-95 transition-all whitespace-nowrap"
                                                >
                                                    <span>Claim Free Seat (Save ₹1,500)</span>
                                                    <ArrowRight size={13} className="stroke-[2.5]" />
                                                </Link>
                                            </div>
                                        </div>

                                        {/* Direct 7-day join link & WhatsApp Study Partner Share */}
                                        <div className="mt-3 flex items-center justify-between text-[11px] text-neutral-400 font-mono gap-2 flex-wrap">
                                            <a
                                                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                                                    `Hey! Join me in this free ${course.bootcampShortTitle} live bootcamp with certificate (worth ₹1,500, now 100% free giveaway) starting ${batchLabel}: https://celorisdesigns.com${course.bootcampUrl}`
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
                                                href={course.bootcampUrl}
                                                className="text-emerald-400 hover:text-emerald-300 underline-offset-2 hover:underline flex items-center gap-1"
                                            >
                                                <span>Claim Free Seat</span>
                                                <span>→</span>
                                            </Link>
                                        </div>
                                    </div>
                                </SpotlightCard>
                            </motion.div>
                        ))}
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
                                title: "Join a batch",
                                body: "Sign in with Google and reserve your seat in seconds. A brand-new batch starts every 14 days on Monday evening.",
                            },
                            {
                                icon: Award,
                                step: "Step 2",
                                title: "Attend live & pass test",
                                body: "Join the live classes punctually on scheduled evenings. There are no recordings, so attendance is required to qualify for the final skill test and certificate.",
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

                    <div className="mt-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
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

                    <p className="mt-8 text-center text-xs text-neutral-500">
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
                                    has successfully attended the 7-day live online bootcamp and passed the practical skill examination in
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

            {/* Floating WhatsApp Quick Connect Button - fully mobile-optimized (bottom-left, safe-area insets, 48px touch target) */}
            <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-40 pb-[env(safe-area-inset-bottom,0px)]">
                <motion.a
                    href="https://wa.me/919084718101?text=Hi%2C%20I%20have%20a%20question%20about%20the%20Celoris%20Free%20Live%20Courses%20with%20Certificate."
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.8, type: "spring", damping: 15 }}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    className="relative group flex items-center justify-center gap-2 rounded-full bg-[#25D366] text-white shadow-[0_8px_25px_rgba(37,211,102,0.45)] transition-all hover:bg-[#20ba5a] hover:shadow-[0_12px_30px_rgba(37,211,102,0.65)] active:scale-95 touch-manipulation h-12 w-12 sm:h-auto sm:w-auto sm:px-4 sm:py-3 cursor-pointer"
                    aria-label="Chat with advisor on WhatsApp"
                >
                    {/* Live Online Badge on Mobile */}
                    <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3 sm:hidden">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                        <span className="relative inline-flex h-3 w-3 rounded-full bg-white border-2 border-[#25D366]" />
                    </span>

                    <svg className="h-6 w-6 sm:h-5 sm:w-5 fill-current shrink-0" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                    </svg>
                    <span className="hidden sm:inline font-semibold text-xs tracking-wide whitespace-nowrap">
                        Questions? Chat on WhatsApp
                    </span>
                </motion.a>
            </div>
        </div>
    )
}
