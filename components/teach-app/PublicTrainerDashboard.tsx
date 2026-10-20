"use client"

import React, { useState, useEffect, useMemo, useRef } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  MessageSquare,
  PhoneCall,
  Video,
  Clock,
  CheckCircle,
  MapPin,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Loader2,
  Users,
  IndianRupee,
  Smartphone,
  Zap,
  Award,
  Calendar,
  User,
  Briefcase,
  Percent,
  Plus,
  RotateCcw,
} from "lucide-react"
import { createClient } from "@/lib/supabase-client"
import { maskContactInfo } from "@/lib/contact-shield"
import { openPhoneOS } from "@/components/phone-os/trigger"
import { formatDistanceToNow } from "date-fns"
import type { TeachingSlot } from "./TeachLanding"

interface PublicTrainerDashboardProps {
  onClaimSlot: (slot: TeachingSlot) => void
  isTrainer: boolean
}

// Apple-style Feature Pivot Angles & Camera States (Dynamic Island removed as requested)
type FeatureKey = "overview" | "chat" | "commission" | "claim" | "payouts"

interface FeatureConfig {
  id: FeatureKey
  label: string
  pillType: "color" | "plus"
  rotateY: number
  rotateX: number
  scale: number
  x: number
  y: number
  spotlight: "chat" | "commission" | "claim" | "payouts" | null
  badge: string
  desc: string
}

const APPLE_FEATURES: Record<FeatureKey, FeatureConfig> = {
  overview: {
    id: "overview",
    label: "Live Inquiries",
    pillType: "color",
    rotateY: 0,
    rotateX: 0,
    scale: 1,
    x: 0,
    y: 0,
    spotlight: null,
    badge: "Full Experience",
    desc: "Interactive feed loaded with live student demands. Search subjects, filter modes, and scroll inquiries smoothly.",
  },
  chat: {
    id: "chat",
    label: "Direct Chat & Audio",
    pillType: "plus",
    rotateY: -16,
    rotateX: 6,
    scale: 1.18,
    x: 35,
    y: -30,
    spotlight: "chat",
    badge: "In-App Connect",
    desc: "Connect directly with students via in-app chat, 1-on-1 audio calling, and HD video demo rooms.",
  },
  commission: {
    id: "commission",
    label: "0% Commission",
    pillType: "plus",
    rotateY: 15,
    rotateX: 5,
    scale: 1.16,
    x: -30,
    y: 10,
    spotlight: "commission",
    badge: "Keep 100%",
    desc: "No platform cuts, no coin packs, no bidding credits. Keep every single rupee students pay directly.",
  },
  claim: {
    id: "claim",
    label: "1-Click Claim Slot",
    pillType: "plus",
    rotateY: 0,
    rotateX: -8,
    scale: 1.24,
    x: 0,
    y: -100,
    spotlight: "claim",
    badge: "Fast Onboarding",
    desc: "Claim incoming student demands instantly with 1-click Google Sign-in. No coin deductions.",
  },
  payouts: {
    id: "payouts",
    label: "Instant UPI Payouts",
    pillType: "plus",
    rotateY: -12,
    rotateX: -12,
    scale: 1.22,
    x: 20,
    y: -130,
    spotlight: "payouts",
    badge: "₹48.5k Avg Monthly",
    desc: "Active 1-on-1 educators on Celoris earn an average benchmark of ₹48,500/month. Student payments go directly to your personal UPI ID with 0% platform cuts.",
  },
}

const PINNED_REFERENCE_LEADS = [
  {
    id: "ref-lead-1",
    name: "Nisha Kumari",
    course: "SPOKEN ENGLISH & IELTS",
    requirement: "I want to learn spoken english and build corporate fluency for MNC job interviews. Prefer daily morning sessions.",
    location: "Rohini, Delhi",
    mode: "Online",
    budget: "₹800/hr",
    display_time: "2m ago",
    created_at: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
  },
  {
    id: "ref-lead-2",
    name: "Renu Sharma",
    course: "VIDEO EDITING & REELS",
    requirement: "I am looking for video editing classes for instagram reels & YouTube shorts creation. Hands-on workflow needed.",
    location: "DLF Phase 4, Gurgaon",
    mode: "Hybrid",
    budget: "₹12,000 Total",
    display_time: "14m ago",
    created_at: new Date(Date.now() - 14 * 60 * 1000).toISOString(),
  },
]

export function PublicTrainerDashboard({ onClaimSlot, isTrainer }: PublicTrainerDashboardProps) {
  const [activeFeature, setActiveFeature] = useState<FeatureKey>("overview")
  const [enquiries, setEnquiries] = useState<any[]>(PINNED_REFERENCE_LEADS)
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(288)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMode, setSelectedMode] = useState<string>("All")
  const [activeMobileTab, setActiveMobileTab] = useState<"leads" | "demo" | "schedule" | "earnings" | "profile">("leads")
  const [isMobileScreen, setIsMobileScreen] = useState(false)
  const PAGE_SIZE = 5

  useEffect(() => {
    const handleResize = () => {
      setIsMobileScreen(window.innerWidth < 1024)
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Mouse hover 3D tilt tracking (Apple-style interactive gyro effect)
  const [mouseTilt, setMouseTilt] = useState({ x: 0, y: 0 })
  const showcaseRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (activeFeature !== "overview") return
    if (!showcaseRef.current) return
    const rect = showcaseRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setMouseTilt({
      x: x * 10,
      y: -y * 8,
    })
  }

  const handleMouseLeave = () => {
    setMouseTilt({ x: 0, y: 0 })
  }

  const supabase = useMemo(() => createClient(), [])

  const fetchEnquiries = async (page: number) => {
    setLoading(true)
    try {
      const from = (page - 1) * PAGE_SIZE
      const to = from + PAGE_SIZE - 1

      let query = supabase
        .from("leads")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })

      if (selectedMode !== "All") {
        if (selectedMode === "Online 1-on-1" || selectedMode === "Online") {
          query = query.ilike("mode", "%online%")
        } else if (selectedMode === "Home Tuition") {
          query = query.or("mode.ilike.%home%,mode.ilike.%offline%")
        } else if (selectedMode === "Hybrid") {
          query = query.or("mode.ilike.%hybrid%,mode.ilike.%both%")
        }
      }

      if (searchQuery.trim()) {
        const term = `%${searchQuery.trim()}%`
        query = query.or(`course.ilike.${term},requirement.ilike.${term},name.ilike.${term},location.ilike.${term}`)
      }

      const { data, count, error } = await query.range(from, to)

      if (error) throw error

      if (count) setTotalCount(count)

      if (page === 1 && selectedMode === "All" && !searchQuery.trim()) {
        const others = (data || []).filter(
          (d: any) => !d.name?.toLowerCase().includes("nisha") && !d.name?.toLowerCase().includes("renu")
        )
        setEnquiries([...PINNED_REFERENCE_LEADS, ...others.slice(0, 3)])
      } else {
        setEnquiries(data && data.length > 0 ? data : PINNED_REFERENCE_LEADS)
      }
    } catch (err) {
      console.error("[PublicTrainerDashboard] error fetching leads:", err)
      setEnquiries(PINNED_REFERENCE_LEADS)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEnquiries(currentPage)

    const channel = supabase
      .channel("public:leads:public_mobile_dashboard")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "leads" },
        () => {
          fetchEnquiries(currentPage)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [currentPage, selectedMode, searchQuery])

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))

  const handleActionClick = (enquiry: any, actionType: "chat" | "audio" | "video" | "claim") => {
    if (isTrainer) {
      window.location.href = `/teach/dashboard/trainer/enquiries?slot=${encodeURIComponent(enquiry.id)}`
      return
    }

    const cleanMode = (enquiry.mode || "").toLowerCase().includes("home")
      ? "Home Tuition"
      : (enquiry.mode || "").toLowerCase().includes("hybrid")
      ? "Hybrid"
      : "Online"

    const slot: TeachingSlot = {
      id: String(enquiry.id || "slot-demo"),
      subject: enquiry.course || "General Student Inquiry",
      category: "Verified Student Request",
      location: enquiry.location || (cleanMode === "Online" ? "Online / Pan-India" : "Delhi NCR"),
      mode: cleanMode as any,
      budget: enquiry.budget || (enquiry.mode?.includes("₹") ? enquiry.mode : "₹800 – ₹1,200 / hr"),
      studentsCount: "1-on-1 Student",
      timing: "Flexible Timings",
      requirement: enquiry.requirement || enquiry.message || `Student inquiry for ${enquiry.course || "teaching classes"}.`,
      timeAgo: enquiry.display_time || (enquiry.created_at ? formatDistanceToNow(new Date(enquiry.created_at), { addSuffix: true }).replace("about ", "") : "Recently"),
      status: enquiry.status || "Open Slot",
      studentName: enquiry.name ? `${enquiry.name.trim().split(" ")[0]} (Verified Student)` : "Verified Student",
    }

    onClaimSlot(slot)
  }

  const currentConfig = APPLE_FEATURES[activeFeature]

  return (
    <div
      ref={showcaseRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative mx-auto w-full pt-4 pb-12 select-none overflow-hidden"
    >
      {/* Blended Advertisement Creative in Background */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden flex items-center justify-center">
        {/* Soft radial vignette so image fades smoothly into black #050608 at all borders */}
        <div
          className="absolute inset-0 z-10"
          style={{
            background: "radial-gradient(ellipse at center, rgba(5,6,8,0.3) 0%, rgba(5,6,8,0.78) 55%, rgba(5,6,8,0.98) 100%)",
          }}
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#050608] via-transparent to-[#050608]" />
        <img
          src="/images/teach/teach-ad-bg.jpg"
          alt="Celoris Teach Ad Creative"
          className="w-full h-full object-cover object-top opacity-30 filter blur-[1px] scale-105"
        />
      </div>

      {/* Animated Glowing Ambient Aura */}
      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.25, 0.4, 0.25],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/20 blur-[150px] z-0"
      />

      {/* Top Banner Headline */}
      <div className="text-center max-w-4xl mx-auto mb-10 relative z-10 px-4">
        {/* Eyebrow Pill */}
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-[#091712] px-4 py-1.5 text-xs font-semibold text-emerald-400 mb-5 shadow-[0_0_25px_rgba(16,185,129,0.25)]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
          <span>Live Student Inquiries Feed</span>
        </div>

        {/* Big Bold Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.08]">
          Direct Student Bookings.
          <span className="block text-[#00e599]">Keep 100% of Every Rupee.</span>
        </h1>

        {/* Subtitle Paragraph */}
        <p className="mt-5 text-sm sm:text-base text-neutral-300 max-w-2xl mx-auto leading-relaxed">
          Scroll through live incoming inquiries below. Tap any slot to claim or connect via instant in-app chat &amp; HD phone call. Zero commission, no coins, and no locked profiles.
        </p>
      </div>

      {/* Main 3-Column Layout: Apple Pills (Left) | White iOS Smartphone (Center) | Benefits & CTA (Right) */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center max-w-6xl mx-auto">
        {/* LEFT COLUMN: Apple-Style Interactive Feature Pills */}
        <div className="flex flex-col gap-3.5 lg:col-span-3 order-2 lg:order-1">
          <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-bold mb-1 flex items-center justify-between">
            <span>Explore Phone Features</span>
            {activeFeature !== "overview" && (
              <button
                type="button"
                onClick={() => setActiveFeature("overview")}
                className="text-[#00e599] hover:underline flex items-center gap-1 cursor-pointer lowercase font-medium"
              >
                <RotateCcw className="w-3 h-3" /> reset
              </button>
            )}
          </div>

          {/* Apple Pill Stack */}
          <div className="flex flex-col gap-2">
            {(Object.keys(APPLE_FEATURES) as FeatureKey[]).map((key) => {
              const feat = APPLE_FEATURES[key]
              const isActive = activeFeature === key

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveFeature(key)}
                  className={`group relative text-left py-2.5 px-3.5 rounded-full text-xs font-semibold transition-all duration-300 flex items-center justify-between cursor-pointer ${
                    isActive
                      ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.4)] scale-[1.02]"
                      : "bg-[#0d121c]/90 hover:bg-[#151c2a] text-neutral-300 hover:text-white border border-white/10"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 truncate">
                    {/* Apple Icon Indicator */}
                    {feat.pillType === "color" ? (
                      <span className="w-4 h-4 rounded-full bg-[#00e599] border-2 border-current shadow-sm shrink-0" />
                    ) : (
                      <span
                        className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] border shrink-0 transition-colors ${
                          isActive
                            ? "border-black text-black font-bold"
                            : "border-neutral-500 text-neutral-400 group-hover:border-white group-hover:text-white"
                        }`}
                      >
                        {isActive ? "✓" : "+"}
                      </span>
                    )}
                    <span className="truncate">{feat.label}</span>
                  </div>

                  {isActive && (
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider bg-black/10 px-2 py-0.5 rounded-full shrink-0">
                      Active
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Interactive Feature Info Card */}
          <motion.div
            key={activeFeature}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="rounded-2xl border border-white/[0.08] bg-[#0c1017]/95 p-4 shadow-xl backdrop-blur-xl space-y-1.5 mt-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#00e599] uppercase font-bold tracking-wider">
                {currentConfig.badge}
              </span>
              <span className="text-[10px] text-neutral-400 font-mono">Camera Angle 3D</span>
            </div>
            <h4 className="text-sm font-extrabold text-white">{currentConfig.label}</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">{currentConfig.desc}</p>
          </motion.div>
        </div>

        {/* CENTER COLUMN: Pristine White iOS Smartphone Mockup with 3D Camera Pivot Animation */}
        <div
          className="lg:col-span-6 flex flex-col items-center justify-center order-1 lg:order-2 relative"
          style={{ perspective: isMobileScreen ? undefined : 1400 }}
        >
          {/* Intense Green Floor Ambient Halo Underneath the Phone */}
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-80 sm:w-96 h-36 bg-[#00e599]/30 blur-[75px] rounded-full pointer-events-none z-0" />

          <motion.div
            animate={{
              rotateY: isMobileScreen ? 0 : currentConfig.rotateY + (activeFeature === "overview" ? mouseTilt.x : 0),
              rotateX: isMobileScreen ? 0 : currentConfig.rotateX + (activeFeature === "overview" ? mouseTilt.y : 0),
              scale: isMobileScreen ? (activeFeature === "overview" ? 1 : 1.02) : currentConfig.scale,
              x: isMobileScreen ? 0 : currentConfig.x,
              y: isMobileScreen ? 0 : currentConfig.y,
            }}
            transition={{
              type: "spring",
              stiffness: 115,
              damping: 18,
              mass: 0.75,
            }}
            style={{
              transformStyle: isMobileScreen ? undefined : "preserve-3d",
            }}
            className="relative z-10 w-full max-w-[390px] sm:max-w-[415px] h-[540px] sm:h-[620px] lg:h-[700px] rounded-[44px] sm:rounded-[48px] border-[8px] sm:border-[10px] border-[#222836] bg-[#f8fafc] shadow-[0_25px_90px_rgba(0,0,0,0.95),0_0_50px_rgba(0,229,153,0.18),0_0_0_2px_rgba(255,255,255,0.15)] overflow-hidden flex flex-col"
          >
            {/* Glossy Screen Reflection Glare */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/40 via-white/10 to-transparent z-30" />

            {/* Smartphone Top Bar (Clean Speaker Slit, NO Dynamic Island) */}
            <div className="pt-2.5 px-6 pb-2 bg-white/95 backdrop-blur-sm border-b border-slate-100 flex items-center justify-between z-30 select-none">
              <span className="text-[11px] font-mono font-bold text-slate-900 tracking-tight">09:41</span>

              {/* Minimalist Apple Speaker Slit */}
              <div className="w-12 h-1 rounded-full bg-slate-300" />

              {/* iOS Status Bar Icons (Dark on White) */}
              <div className="flex items-center gap-1.5 text-slate-800 text-[10px] font-mono">
                <span className="font-bold text-slate-900 text-[9px]">5G</span>
                <div className="flex items-end gap-0.5 h-2.5">
                  <span className="w-0.5 h-1 bg-slate-800 rounded-2xs" />
                  <span className="w-0.5 h-1.5 bg-slate-800 rounded-2xs" />
                  <span className="w-0.5 h-2 bg-slate-800 rounded-2xs" />
                  <span className="w-0.5 h-2.5 bg-slate-800 rounded-2xs" />
                </div>
                <div className="w-4 h-2 rounded-2xs border border-slate-800/80 p-0.5 flex items-center">
                  <div className="h-full w-4/5 bg-emerald-500 rounded-3xs" />
                </div>
              </div>
            </div>

            {/* Mobile App Bar Header (Pristine iOS White Theme) */}
            <div className="px-4 py-3 bg-white border-b border-slate-100 z-20 space-y-2.5 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
                    <span>Celoris Teach</span>
                    <span className="text-[9px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.2 rounded font-bold uppercase">
                      PRO
                    </span>
                  </h3>
                  <p className="text-[10px] text-slate-500 font-medium">Direct student bookings · 0% commission</p>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      if (enquiries[0]) handleActionClick(enquiries[0], "chat")
                    }}
                    className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-emerald-600 transition-colors flex items-center justify-center cursor-pointer border border-slate-200/60"
                    title="Live Student Chat"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (enquiries[0]) handleActionClick(enquiries[0], "audio")
                    }}
                    className="w-8 h-8 rounded-full bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-600 transition-colors flex items-center justify-center cursor-pointer border border-slate-200/60"
                    title="Audio Helpline"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Stats Banner Pill (Sleek iOS White & Mint Style) */}
              <div className={`flex items-center justify-between px-3 py-1.5 rounded-xl bg-emerald-50/80 border border-emerald-200/70 transition-all ${
                currentConfig.spotlight === "commission" ? "ring-2 ring-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]" : ""
              }`}>
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
                  </span>
                  <span className="text-[10px] font-mono font-extrabold text-emerald-800 uppercase tracking-wider">
                    {totalCount} LIVE LEADS PAN-INDIA
                  </span>
                </div>
                <span className="text-[9px] text-slate-500 font-mono">
                  Updated 10s ago
                </span>
              </div>

              {/* In-App Search Input (Clean iOS Style) */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search subject, student or city..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="w-full rounded-xl bg-slate-100 border border-slate-200/80 pl-8 pr-3 py-1.5 text-[11px] text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              {/* Mode Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
                {[
                  { label: `All (${totalCount})`, val: "All" },
                  { label: "Online 1-on-1", val: "Online 1-on-1" },
                  { label: "Home Tuition", val: "Home Tuition" },
                  { label: "Hybrid", val: "Hybrid" },
                ].map((tab) => {
                  const isActive = selectedMode === tab.val
                  return (
                    <button
                      key={tab.val}
                      onClick={() => {
                        setSelectedMode(tab.val)
                        setCurrentPage(1)
                      }}
                      className={`rounded-full px-3 py-1 text-[10px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
                        isActive
                          ? "bg-slate-900 text-white font-extrabold shadow-sm"
                          : "bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {tab.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Scrollable Mobile Feed of Real Leads (White Background, Clean Cards, NO Circle Placeholder Bugs) */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-3.5 py-3 space-y-3 custom-scrollbar bg-[#F8FAFC]">
              {loading ? (
                <div className="py-24 text-center text-slate-400 space-y-2">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-emerald-600" />
                  <p className="text-xs">Fetching real student demands...</p>
                </div>
              ) : enquiries.length === 0 ? (
                <div className="py-20 text-center text-slate-400 text-xs px-4">
                  No inquiries match this filter. Switch to &quot;All&quot; to see open student slots.
                </div>
              ) : (
                enquiries.map((enquiry, idx) => {
                  const reqText = enquiry.requirement || enquiry.message || `Looking for teacher for ${enquiry.course || "class"}.`
                  const studentName = enquiry.name ? enquiry.name.trim() : "Verified Student"
                  const courseTitle = (enquiry.course || "GENERAL TUTORING").toUpperCase()
                  const locationText = enquiry.location || (enquiry.mode?.toLowerCase().includes("home") ? "Delhi NCR" : "Online")
                  const modeBudgetText = enquiry.mode?.includes("₹")
                    ? enquiry.mode
                    : enquiry.budget
                    ? `${enquiry.mode || "Online"} · ${enquiry.budget}`
                    : (enquiry.mode || "Online · ₹800/hr")
                  const timeAgoText = enquiry.display_time || (enquiry.created_at
                    ? formatDistanceToNow(new Date(enquiry.created_at), { addSuffix: true }).replace("about ", "")
                    : "Recently")

                  const isFirstLead = idx === 0
                  const isChatSpotlight = currentConfig.spotlight === "chat" && isFirstLead
                  const isClaimSpotlight = currentConfig.spotlight === "claim" && isFirstLead

                  return (
                    <motion.div
                      key={enquiry.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`rounded-2xl border bg-white p-3.5 transition-all space-y-2.5 relative group shadow-sm ${
                        isChatSpotlight || isClaimSpotlight
                          ? "border-emerald-500 ring-2 ring-emerald-200 shadow-[0_4px_20px_rgba(16,185,129,0.25)]"
                          : "border-slate-200/90 hover:border-emerald-400 hover:shadow-md"
                      }`}
                    >
                      {/* Top Row: Clean Typography Header (NO circle avatar placeholder bugs!) */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-xs font-bold text-slate-900 truncate">
                              {studentName}
                            </span>
                            <span className="text-[9.5px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-1.5 py-0.2 rounded font-semibold">
                              Verified Student
                            </span>
                          </div>
                          <span className="text-[10.5px] font-mono uppercase tracking-wider text-emerald-600 font-extrabold block mt-0.5 truncate">
                            {courseTitle}
                          </span>
                        </div>

                        <span className="font-mono text-[9px] text-slate-400 shrink-0 font-medium">
                          {timeAgoText}
                        </span>
                      </div>

                      {/* Requirement Quote Bubble (Soft iOS Chat Bubble) */}
                      <p className="text-[11.5px] text-slate-700 leading-snug line-clamp-2 italic bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        &ldquo;{maskContactInfo(reqText)}&rdquo;
                      </p>

                      {/* Mode & Location Details Row */}
                      <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5 font-medium">
                        <span className="inline-flex items-center gap-1 text-slate-700">
                          <MapPin className="h-3 w-3 text-emerald-600 shrink-0" />
                          <span className="truncate max-w-[140px]">{locationText}</span>
                        </span>
                        <span className="rounded bg-slate-100 px-2 py-0.5 text-slate-700 border border-slate-200/60 font-mono text-[9.5px]">
                          {modeBudgetText}
                        </span>
                      </div>

                      {/* Action Buttons: Claim Slot -> | Chat | Phone */}
                      <div className="flex items-center justify-between gap-1.5 pt-1 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => handleActionClick(enquiry, "claim")}
                          className={`flex-1 py-1.5 px-3 rounded-xl text-black font-black text-[11px] transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95 shadow-xs ${
                            isClaimSpotlight
                              ? "bg-[#00e599] ring-2 ring-emerald-400 shadow-[0_0_15px_rgba(0,229,153,0.5)] animate-pulse"
                              : "bg-[#00e599] hover:bg-[#00cc88] shadow-sm"
                          }`}
                        >
                          <span>Claim Slot</span>
                          <ArrowRight className="h-3 w-3" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleActionClick(enquiry, "chat")}
                          className={`py-1.5 px-2.5 rounded-xl text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                            isChatSpotlight
                              ? "bg-slate-900 text-white ring-2 ring-emerald-400 shadow-sm"
                              : "bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200"
                          }`}
                          title="Chat in Celoris"
                        >
                          <MessageSquare className="h-3 w-3 text-emerald-600" />
                          <span>Chat</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleActionClick(enquiry, "audio")}
                          className={`py-1.5 px-2.5 rounded-xl text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                            isChatSpotlight
                              ? "bg-sky-500 text-white ring-2 ring-sky-300 shadow-sm"
                              : "bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-200"
                          }`}
                          title="Audio Call"
                        >
                          <PhoneCall className="h-3 w-3 text-sky-600" />
                        </button>
                      </div>
                    </motion.div>
                  )
                })
              )}

              {/* Feed Pagination Pill Controls inside Feed */}
              {!loading && totalPages > 1 && (
                <div className="pt-2 pb-1 flex items-center justify-between text-[10px] text-slate-500 px-1">
                  <button
                    type="button"
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 transition-colors cursor-pointer shadow-xs"
                  >
                    <ChevronLeft className="h-3 w-3" />
                    <span>Prev</span>
                  </button>

                  <span className="font-mono text-slate-500 text-[9px] font-medium">
                    Page {currentPage} of {totalPages}
                  </span>

                  <button
                    type="button"
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 transition-colors cursor-pointer shadow-xs"
                  >
                    <span>Next</span>
                    <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>

            {/* Mobile App Bottom Navigation Bar (Apple iOS White Tab Bar) */}
            <div className={`bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-2 py-1.5 z-20 transition-all ${
              currentConfig.spotlight === "payouts" ? "ring-2 ring-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]" : ""
            }`}>
              <div className="grid grid-cols-5 items-center text-center">
                {/* 1. Leads Tab (Active) */}
                <button
                  type="button"
                  onClick={() => setActiveMobileTab("leads")}
                  className="flex flex-col items-center justify-center py-1 transition-colors cursor-pointer"
                >
                  <Briefcase className="w-4 h-4 text-emerald-600" />
                  <span className="text-[9px] font-bold text-emerald-700 mt-0.5">Leads</span>
                  <span className="w-1 h-1 rounded-full bg-emerald-600 mt-0.5" />
                </button>

                {/* 2. Demo Tab */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveMobileTab("demo")
                    if (enquiries[0]) handleActionClick(enquiries[0], "claim")
                  }}
                  className="flex flex-col items-center justify-center py-1 text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
                >
                  <Video className="w-4 h-4" />
                  <span className="text-[9px] font-medium mt-0.5">Demo</span>
                </button>

                {/* 3. Schedule Tab */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveMobileTab("schedule")
                    if (enquiries[0]) handleActionClick(enquiries[0], "claim")
                  }}
                  className="flex flex-col items-center justify-center py-1 text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span className="text-[9px] font-medium mt-0.5">Schedule</span>
                </button>

                {/* 4. Earnings Tab */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveMobileTab("earnings")
                    if (enquiries[0]) handleActionClick(enquiries[0], "claim")
                  }}
                  className={`flex flex-col items-center justify-center py-1 transition-colors cursor-pointer rounded-lg ${
                    currentConfig.spotlight === "payouts" ? "bg-emerald-50 ring-1 ring-emerald-400" : "text-slate-400 hover:text-slate-800"
                  }`}
                  title="Average monthly trainer earnings benchmark"
                >
                  <IndianRupee className="w-4 h-4 text-emerald-600" />
                  <span className="text-[9px] font-bold text-emerald-700 mt-0.5">
                    ₹48.5k <span className="text-[7px] font-medium text-slate-500">(Avg)</span>
                  </span>
                </button>

                {/* 5. Profile Tab */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveMobileTab("profile")
                    if (enquiries[0]) handleActionClick(enquiries[0], "claim")
                  }}
                  className="flex flex-col items-center justify-center py-1 text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
                >
                  <User className="w-4 h-4" />
                  <span className="text-[9px] font-medium mt-0.5">Profile</span>
                </button>
              </div>

              {/* iOS Home Indicator Bar */}
              <div className="pt-1.5 pb-0.5 flex justify-center">
                <div className="w-24 h-1 rounded-full bg-slate-300" />
              </div>
            </div>
          </motion.div>

          {/* Coming Soon on Google Play badge */}
          <div className="mt-5 flex flex-col items-center justify-center gap-1.5 z-20">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.06] border border-white/10 text-[11px] text-neutral-200 font-medium shadow-sm backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#00e599] animate-pulse" />
              <span>Native Mobile App · Coming Soon to Google Play</span>
            </div>
            <div className="transition-transform hover:scale-105 active:scale-95 duration-200 mt-1">
              <img
                src="/images/teach/google-play-coming-soon.png"
                alt="Coming Soon on Google Play"
                className="h-10 sm:h-11 w-auto object-contain drop-shadow-[0_4px_25px_rgba(0,0,0,0.8)]"
              />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: 2 Feature Cards + 1 Free Forever CTA Card */}
        <div className="flex flex-col gap-5 lg:col-span-3 order-3">
          {/* Card 1: Live HD Classrooms */}
          <motion.div
            whileHover={{ y: -4, scale: 1.02 }}
            className="rounded-2xl border border-white/[0.08] bg-[#0c1017]/95 p-5 shadow-2xl backdrop-blur-xl space-y-2.5 transition-all hover:border-purple-500/40"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Video className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-sm font-extrabold text-white tracking-tight">Live HD Classrooms</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Conduct online tuitions using built-in whiteboards, screen share, and instant recordings.
            </p>
          </motion.div>

          {/* Card 2: Instant UPI Payouts */}
          <motion.div
            whileHover={{ y: -4, scale: 1.02 }}
            className="rounded-2xl border border-white/[0.08] bg-[#0c1017]/95 p-5 shadow-2xl backdrop-blur-xl space-y-2.5 transition-all hover:border-emerald-500/40"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <IndianRupee className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="text-sm font-extrabold text-white tracking-tight">Instant UPI Payouts</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              No 30-day payout holding periods. Students transfer directly to your UPI ID or escrow.
            </p>
          </motion.div>

          {/* Card 3: Free Forever CTA Card with Google Sign In Button */}
          <motion.div
            whileHover={{ y: -4, scale: 1.02 }}
            className="rounded-2xl border border-emerald-500/40 bg-gradient-to-b from-emerald-950/35 via-[#0c1219] to-[#07090e] p-5 shadow-[0_0_35px_rgba(16,185,129,0.18)] backdrop-blur-xl space-y-3 relative overflow-hidden"
          >
            <div className="text-xs font-black tracking-wider text-[#00e599] uppercase">
              ✓ FREE FOREVER FOR TRAINERS
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Register with Google in 10 seconds to unlock complete student details and start teaching.
            </p>
            <button
              type="button"
              onClick={() => {
                if (enquiries[0]) {
                  handleActionClick(enquiries[0], "claim")
                } else {
                  onClaimSlot({
                    id: "general-registration",
                    subject: "Verified Student Network",
                    category: "General",
                    location: "Pan-India / Delhi NCR",
                    mode: "Online",
                    budget: "₹800 - ₹1,500/hr",
                    studentsCount: "1-on-1",
                    timing: "Flexible",
                    requirement: "Direct student access with 0% platform commission.",
                    timeAgo: "Just now",
                    status: "Open",
                  })
                }
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-[#00e599] hover:bg-[#00cc88] text-black font-extrabold text-xs transition-all shadow-[0_0_20px_rgba(0,229,153,0.35)] cursor-pointer active:scale-95 text-center flex items-center justify-center"
            >
              Sign In with Google
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
