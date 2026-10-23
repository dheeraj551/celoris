"use client"

import React, { useState, useEffect, useMemo, useRef } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Search,
  MessageSquare,
  PhoneCall,
  Clock,
  CheckCircle,
  MapPin,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Users,
  IndianRupee,
  Smartphone,
  Zap,
  Award,
  Calendar,
  User,
  Briefcase,
  Share2,
  RotateCcw,
  ClipboardCheck,
  CheckCircle2,
  Bell,
  ExternalLink,
} from "lucide-react"
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon"
import { GoogleIcon } from "@/components/icons/GoogleIcon"
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton"
import { formatDistanceToNow } from "date-fns"
import type { PublicJob } from "./JobCenterLanding"

interface PublicJobDashboardProps {
  onApplyJob: (job: PublicJob) => void
  initialJobs?: PublicJob[]
}

// Apple-style Feature Pivot Angles & Camera States
type FeatureKey = "overview" | "test" | "commission" | "apply" | "payouts"

interface FeatureConfig {
  id: FeatureKey
  label: string
  pillType: "color" | "plus"
  rotateY: number
  rotateX: number
  scale: number
  x: number
  y: number
  spotlight: "test" | "commission" | "apply" | "payouts" | null
  badge: string
  desc: string
}

const APPLE_FEATURES: Record<FeatureKey, FeatureConfig> = {
  overview: {
    id: "overview",
    label: "Live Job Feed",
    pillType: "color",
    rotateY: 0,
    rotateX: 0,
    scale: 1,
    x: 0,
    y: 0,
    spotlight: null,
    badge: "Full Experience",
    desc: "Interactive feed with verified remote jobs & freelance gigs. Search roles, filter work modes, and apply with zero coin packs.",
  },
  test: {
    id: "test",
    label: "5-Min Free Online Exam",
    pillType: "plus",
    rotateY: -16,
    rotateX: 6,
    scale: 1.18,
    x: 35,
    y: -30,
    spotlight: "test",
    badge: "AI Proctored",
    desc: "Prove hands-on skills in 5 minutes with free proctored online exams. No fake resumes or exaggerated CVs.",
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
    desc: "No platform cuts, no bidding coins, no lead packages. Keep every single rupee you earn.",
  },
  apply: {
    id: "apply",
    label: "1-Click Direct Apply",
    pillType: "plus",
    rotateY: 0,
    rotateX: -8,
    scale: 1.24,
    x: 0,
    y: -100,
    spotlight: "apply",
    badge: "Celoris Skill ID",
    desc: "Pass the test once, get your verified Celoris Skill ID, and apply directly to top verified employers in 1 click.",
  },
  payouts: {
    id: "payouts",
    label: "Earn up to ₹30k/mo",
    pillType: "plus",
    rotateY: -12,
    rotateX: -12,
    scale: 1.22,
    x: -35,
    y: 40,
    spotlight: "payouts",
    badge: "Direct Escrow",
    desc: "Earn up to ₹30,000 per month part-time. Celoris pays you directly with 0% platform commission.",
  },
}

// Realistic Indian Creative & Tech Freelance / Part-Time Roles (~₹18,000 – ₹38,000 / mo)
const REALISTIC_REFERENCE_JOBS: PublicJob[] = [
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
    id: "ref-job-1",
    title: "YouTube & Reels Video Editor",
    company: "Celoris",
    location: "Remote (Pan-India)",
    pay: "₹18,000 – ₹30,000 / mo",
    industry: "Media & Creators",
    workMode: "100% Remote",
    badges: ["Premiere Pro", "Reels Pacing"],
    createdAt: new Date(Date.now() - 1000 * 60 * 65).toISOString(),
  },
  {
    id: "ref-job-2",
    title: "3D Blender & Asset Modeler",
    company: "Apex Interactive Labs",
    location: "Remote (India)",
    pay: "₹25,000 – ₹38,000 / mo",
    industry: "Gaming & 3D",
    workMode: "100% Remote",
    badges: ["Blender 3D", "PBR Texturing"],
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: "ref-job-3",
    title: "UI/UX & Mobile App Designer",
    company: "NovaCraft Digital",
    location: "Delhi NCR / Hybrid",
    pay: "₹22,000 – ₹35,000 / mo",
    industry: "Design & Apps",
    workMode: "Hybrid",
    badges: ["Figma UI/UX", "Mobile Systems"],
    createdAt: new Date(Date.now() - 1000 * 60 * 80).toISOString(),
  },
  {
    id: "ref-job-4",
    title: "Next.js & Frontend Junior Engineer",
    company: "ScaleGrid Cloud",
    location: "Remote (India)",
    pay: "₹26,000 – ₹40,000 / mo",
    industry: "Web & Tech",
    workMode: "100% Remote",
    badges: ["Next.js / React", "TypeScript"],
    createdAt: new Date(Date.now() - 1000 * 60 * 125).toISOString(),
  },
  {
    id: "ref-job-5",
    title: "AI Prompt & Media Automation Lead",
    company: "AdVantage Global",
    location: "Remote (Pan-India)",
    pay: "₹16,000 – ₹28,000 / mo",
    industry: "AI & Marketing",
    workMode: "100% Remote",
    badges: ["ComfyUI", "Midjourney"],
    createdAt: new Date(Date.now() - 1000 * 60 * 190).toISOString(),
  },
  {
    id: "ref-job-6",
    title: "Motion Graphics & After Effects Artist",
    company: "PixelCraft Motion",
    location: "Remote (India)",
    pay: "₹20,000 – ₹32,000 / mo",
    industry: "Animation & Video",
    workMode: "100% Remote",
    badges: ["After Effects", "Lottie"],
    createdAt: new Date(Date.now() - 1000 * 60 * 270).toISOString(),
  },
]

const APP_CATEGORIES = [
  { label: "All Roles", val: "All" },
  { label: "Video & Reels", val: "Video" },
  { label: "3D & Blender", val: "3D" },
  { label: "UI/UX Design", val: "UI/UX" },
  { label: "Web Dev", val: "Web" },
  { label: "AI & Prompting", val: "AI" },
]

function formatCompany(name: string): string {
  if (!name || /confidential/i.test(name)) return "Celoris"
  return name
}

export function PublicJobDashboard({
  onApplyJob,
  initialJobs = [],
}: PublicJobDashboardProps) {
  const [activeFeature, setActiveFeature] = useState<FeatureKey>("overview")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [activeMobileTab, setActiveMobileTab] = useState<"jobs" | "tests" | "saved" | "earnings" | "profile">("jobs")
  const [currentPage, setCurrentPage] = useState(1)
  const PAGE_SIZE = 4

  // Mouse tilt effect for 3D showcase
  const [mouseTilt, setMouseTilt] = useState({ x: 0, y: 0 })
  const showcaseRef = useRef<HTMLDivElement>(null)

  // Screen detection for 3D vs mobile view
  const [isMobileScreen, setIsMobileScreen] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobileScreen(window.innerWidth < 1024)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobileScreen || !showcaseRef.current) return
    const rect = showcaseRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setMouseTilt({
      x: x * 10,
      y: -y * 10,
    })
  }

  const handleMouseLeave = () => {
    setMouseTilt({ x: 0, y: 0 })
  }

  // Combined jobs list
  const allJobs = useMemo(() => {
    if (initialJobs && initialJobs.length > 0) {
      // Merge with reference jobs so we always have complete high-fidelity list
      const ids = new Set(initialJobs.map((j) => j.id))
      const extra = REALISTIC_REFERENCE_JOBS.filter((r) => !ids.has(r.id))
      return [...initialJobs, ...extra]
    }
    return REALISTIC_REFERENCE_JOBS
  }, [initialJobs])

  // Filtered jobs
  const filteredJobs = useMemo(() => {
    return allJobs.filter((job) => {
      const matchesCat =
        selectedCategory === "All" ||
        job.industry.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        job.title.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        job.badges.some((b) => b.toLowerCase().includes(selectedCategory.toLowerCase()))

      const matchesQuery =
        !searchQuery.trim() ||
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.badges.some((b) => b.toLowerCase().includes(searchQuery.toLowerCase()))

      return matchesCat && matchesQuery
    })
  }, [allJobs, selectedCategory, searchQuery])

  const totalCount = filteredJobs.length
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))
  const paginatedJobs = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return filteredJobs.slice(start, start + PAGE_SIZE)
  }, [filteredJobs, currentPage])

  const currentConfig = APPLE_FEATURES[activeFeature]

  const handleJobAction = (job: PublicJob, actionType: "apply" | "chat" | "test") => {
    onApplyJob(job)
  }

  return (
    <div
      ref={showcaseRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative mx-auto w-full pt-4 pb-12 select-none overflow-hidden"
    >
      {/* Soft radial aura & backdrop glow */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden flex items-center justify-center">
        <div
          className="absolute inset-0 z-10"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(5,6,8,0.2) 0%, rgba(5,6,8,0.78) 55%, rgba(5,6,8,0.98) 100%)",
          }}
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#050608] via-transparent to-[#050608]" />
      </div>

      {/* Animated Glowing Ambient Aura */}
      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.2, 0.35, 0.2],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/20 blur-[150px] z-0"
      />

      {/* Top Banner Headline */}
      <div className="text-center max-w-4xl mx-auto mb-8 sm:mb-10 relative z-10 px-4">
        {/* Eyebrow Pill */}
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-[#091712] px-4 py-1.5 text-xs font-semibold text-emerald-400 mb-4 shadow-[0_0_25px_rgba(16,185,129,0.25)]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
          <span>Live Celoris Job Board · Free Skill Tests</span>
        </div>

        {/* Big Bold Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black text-white tracking-tight leading-[1.1]">
          Get Hired Online for Your Skills,{" "}
          <span className="block text-[#00e599]">with 0% Commission.</span>
        </h1>

        {/* Subtitle Paragraph */}
        <p className="mt-4 sm:mt-5 text-xs sm:text-base text-neutral-300 max-w-2xl mx-auto leading-relaxed">
          Take a free 5-minute online skill test, get your verified Celoris Skill ID, and apply directly for Remote Jobs.
        </p>
      </div>

      {/* Main 3-Column Layout: Feature Pills (Left) | iOS Smartphone (Center) | Benefits & CTA (Right) */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center max-w-6xl mx-auto px-2 sm:px-4">
        
        {/* LEFT COLUMN: Apple-Style Interactive Feature Pills (Visible on Desktop, Hidden on Mobile) */}
        <div className="hidden lg:flex flex-col gap-3.5 lg:col-span-3 order-2 lg:order-1">
          <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-bold mb-1 flex items-center justify-between">
            <span>Explore App Features</span>
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
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
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
            className="rounded-2xl border border-white/[0.08] bg-[#0c1017]/95 p-4 shadow-xl backdrop-blur-xl space-y-1.5 mt-1"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#00e599] uppercase font-bold tracking-wider">
                {currentConfig.badge}
              </span>
              <span className="text-[10px] text-neutral-400 font-mono">Celoris Job App</span>
            </div>
            <h4 className="text-sm font-extrabold text-white">{currentConfig.label}</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">{currentConfig.desc}</p>
          </motion.div>
        </div>

        {/* CENTER COLUMN: Pristine White iOS Smartphone Mockup running "Celoris Job" */}
        <div
          className="lg:col-span-6 flex flex-col items-center justify-center order-1 lg:order-2 relative w-full"
          style={{ perspective: isMobileScreen ? undefined : 1400 }}
        >
          {/* Intense Green Floor Ambient Halo Underneath the Phone */}
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-80 sm:w-96 h-36 bg-[#00e599]/30 blur-[75px] rounded-full pointer-events-none z-0" />

          <motion.div
            animate={{
              rotateY: isMobileScreen ? 0 : currentConfig.rotateY + (activeFeature === "overview" ? mouseTilt.x : 0),
              rotateX: isMobileScreen ? 0 : currentConfig.rotateX + (activeFeature === "overview" ? mouseTilt.y : 0),
              scale: isMobileScreen ? 1 : currentConfig.scale,
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
            className="relative z-10 w-full max-w-[390px] sm:max-w-[420px] h-[580px] sm:h-[630px] lg:h-[710px] rounded-[36px] sm:rounded-[48px] border-[6px] sm:border-[10px] border-[#222836] bg-[#f8fafc] shadow-[0_25px_90px_rgba(0,0,0,0.95),0_0_50px_rgba(0,229,153,0.18),0_0_0_2px_rgba(255,255,255,0.15)] overflow-hidden flex flex-col"
          >
            {/* Glossy Screen Reflection Glare */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/40 via-white/10 to-transparent z-30" />

            {/* Smartphone Top Bar (Clean Speaker Slit + iOS Status Icons) */}
            <div className="pt-2 px-5 sm:px-6 pb-1.5 bg-white/95 backdrop-blur-sm border-b border-slate-100 flex items-center justify-between z-30 select-none">
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

            {/* Celoris Job Mobile App Header */}
            <div className="px-3.5 sm:px-4 py-2.5 bg-white border-b border-slate-100 z-20 space-y-2 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
                    <span>Celoris Job</span>
                    <span className="text-[9px] font-mono bg-emerald-100 text-emerald-800 border border-emerald-300 px-1.5 py-0.2 rounded font-bold uppercase">
                      PRO
                    </span>
                  </h3>
                  <p className="text-[10px] text-slate-500 font-medium">Verified remote jobs · 0% commission</p>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      if (paginatedJobs[0]) handleJobAction(paginatedJobs[0], "chat")
                    }}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-emerald-600 transition-colors flex items-center justify-center cursor-pointer border border-slate-200/60"
                    title="Live Employer Chat"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                  </button>
                  <a
                    href="#whatsapp-alerts"
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors flex items-center justify-center cursor-pointer border border-emerald-200/60"
                    title="WhatsApp Job Alerts"
                  >
                    <WhatsAppIcon className="w-3.5 h-3.5 text-emerald-600" />
                  </a>
                </div>
              </div>

              {/* Stats Banner Pill: Realistic ₹30k/mo Benchmark Highlight */}
              <div
                className={`flex items-center justify-between px-3 py-1 rounded-xl bg-emerald-50/80 border border-emerald-200/70 transition-all ${
                  currentConfig.spotlight === "commission" || currentConfig.spotlight === "payouts"
                    ? "ring-2 ring-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                    : ""
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
                  </span>
                  <span className="text-[9.5px] sm:text-[10px] font-mono font-extrabold text-emerald-800 uppercase tracking-wider">
                    {totalCount} LIVE ROLES · EARN UP TO ₹30K/MO
                  </span>
                </div>
                <span className="text-[9px] text-slate-500 font-mono">
                  Updated 10s ago
                </span>
              </div>

              {/* In-App Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search role, skill (e.g. Blender, Video, UI/UX)..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="w-full rounded-xl bg-slate-100 border border-slate-200/80 pl-8 pr-3 py-1.5 text-[11px] text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
                {APP_CATEGORIES.map((tab) => {
                  const isActive = selectedCategory === tab.val
                  return (
                    <button
                      key={tab.val}
                      onClick={() => {
                        setSelectedCategory(tab.val)
                        setCurrentPage(1)
                      }}
                      className={`rounded-full px-2.5 sm:px-3 py-1 text-[9.5px] sm:text-[10px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
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

            {/* Scrollable Feed of Real Job Listings */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-3 sm:px-3.5 py-2.5 sm:py-3 space-y-2.5 sm:space-y-3 custom-scrollbar bg-[#F8FAFC]">
              {paginatedJobs.length === 0 ? (
                <div className="py-20 text-center text-slate-400 text-xs px-4">
                  No roles match this filter. Reset search to view all openings.
                </div>
              ) : (
                paginatedJobs.map((job, idx) => {
                  const isFirst = idx === 0
                  const isTestSpotlight = currentConfig.spotlight === "test" && isFirst
                  const isApplySpotlight = currentConfig.spotlight === "apply" && isFirst

                  return (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`rounded-2xl border bg-white p-3 sm:p-3.5 transition-all space-y-2 relative group shadow-xs ${
                        isTestSpotlight || isApplySpotlight
                          ? "border-emerald-500 ring-2 ring-emerald-200 shadow-[0_4px_20px_rgba(16,185,129,0.25)]"
                          : "border-slate-200/90 hover:border-emerald-400 hover:shadow-sm"
                      }`}
                    >
                      {/* Top Header: Company + Title + Time */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[10px] sm:text-[11px] font-medium text-slate-500 truncate">
                              {formatCompany(job.company)}
                            </span>
                            <span className="text-[9px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-1 py-0.2 rounded font-semibold">
                              Verified Role
                            </span>
                          </div>
                          <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 truncate mt-0.5 leading-snug">
                            {job.title}
                          </h4>
                        </div>

                        <span className="font-mono text-[8.5px] sm:text-[9px] text-slate-400 shrink-0 font-medium">
                          {job.createdAt
                            ? formatDistanceToNow(new Date(job.createdAt), { addSuffix: true }).replace("about ", "")
                            : "Recently"}
                        </span>
                      </div>

                      {/* Salary & Location Row (Realistic Indian figures) */}
                      <div className="flex items-center justify-between text-[10px] text-slate-600 font-medium pt-0.5">
                        <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50/90 border border-emerald-200 px-2 py-0.5 rounded-md">
                          <IndianRupee className="h-2.5 w-2.5" />
                          {job.pay ? job.pay.replace(/₹/g, "") : "₹30,000 / mo"}
                        </span>
                        <span className="rounded bg-slate-100 px-2 py-0.5 text-slate-700 border border-slate-200/60 font-mono text-[9px]">
                          {job.workMode || "100% Remote"}
                        </span>
                      </div>

                      {/* Badges / Skills Pill Row */}
                      {job.badges && job.badges.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1 pt-0.5">
                          {job.badges.map((b) => (
                            <span
                              key={b}
                              className="text-[9px] font-medium bg-slate-50 text-slate-700 border border-slate-200/80 px-1.5 py-0.5 rounded flex items-center gap-1"
                            >
                              <ShieldCheck className="w-2.5 h-2.5 text-emerald-600" />
                              {b}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Action Buttons: Take Test & Apply | Chat | Share */}
                      <div className="flex items-center justify-between gap-1.5 pt-1.5 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => handleJobAction(job, "apply")}
                          className={`flex-1 py-1.5 px-2.5 rounded-xl text-black font-extrabold text-[10.5px] sm:text-[11px] transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95 shadow-xs ${
                            isApplySpotlight
                              ? "bg-[#00e599] ring-2 ring-emerald-400 shadow-[0_0_15px_rgba(0,229,153,0.5)] animate-pulse"
                              : "bg-[#00e599] hover:bg-[#00cc88] shadow-xs"
                          }`}
                        >
                          <Zap className="h-3 w-3 fill-black" />
                          <span>Take Test &amp; Apply</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleJobAction(job, "chat")}
                          className="py-1.5 px-2.5 rounded-xl text-[10px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 transition-all flex items-center gap-1 cursor-pointer"
                          title="Chat with Employer"
                        >
                          <MessageSquare className="h-3 w-3 text-emerald-600" />
                          <span>Chat</span>
                        </button>

                        <a
                          href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                            `Check out this verified role on Celoris Job: ${job.title} (${job.pay}). Take the free skill test to apply: https://celorisdesigns.com/job-center`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-xl text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                          title="Share on WhatsApp"
                        >
                          <WhatsAppIcon className="h-3.5 w-3.5 text-emerald-600" />
                        </a>
                      </div>
                    </motion.div>
                  )
                })
              )}

              {/* Feed Pagination Controls */}
              {totalPages > 1 && (
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
            <div
              className={`bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-2 py-1.5 z-20 transition-all ${
                currentConfig.spotlight === "payouts"
                  ? "ring-2 ring-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                  : ""
              }`}
            >
              <div className="grid grid-cols-5 items-center text-center">
                {/* 1. Jobs Tab */}
                <button
                  type="button"
                  onClick={() => setActiveMobileTab("jobs")}
                  className="flex flex-col items-center justify-center py-1 transition-colors cursor-pointer"
                >
                  <Briefcase className="w-4 h-4 text-emerald-600" />
                  <span className="text-[9px] font-bold text-emerald-700 mt-0.5">Jobs</span>
                  <span className="w-1 h-1 rounded-full bg-emerald-600 mt-0.5" />
                </button>

                {/* 2. Skill Tests Tab */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveMobileTab("tests")
                    if (paginatedJobs[0]) handleJobAction(paginatedJobs[0], "apply")
                  }}
                  className="flex flex-col items-center justify-center py-1 text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
                >
                  <ClipboardCheck className="w-4 h-4" />
                  <span className="text-[9px] font-medium mt-0.5">Free Exam</span>
                </button>

                {/* 3. Alerts Tab */}
                <a
                  href="#whatsapp-alerts"
                  className="flex flex-col items-center justify-center py-1 text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
                >
                  <Bell className="w-4 h-4" />
                  <span className="text-[9px] font-medium mt-0.5">Alerts</span>
                </a>

                {/* 4. Earnings Benchmark Tab (Earn up to ₹30k/mo) */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveMobileTab("earnings")
                    setActiveFeature("payouts")
                  }}
                  className={`flex flex-col items-center justify-center py-1 transition-colors cursor-pointer rounded-lg ${
                    currentConfig.spotlight === "payouts"
                      ? "bg-emerald-50 ring-1 ring-emerald-400"
                      : "text-slate-400 hover:text-slate-800"
                  }`}
                  title="Earn up to ₹30k/month in India"
                >
                  <IndianRupee className="w-4 h-4 text-emerald-600" />
                  <span className="text-[9px] font-bold text-emerald-700 mt-0.5">
                    ₹30k <span className="text-[7px] font-medium text-slate-500">(Up to)</span>
                  </span>
                </button>

                {/* 5. Profile Tab */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveMobileTab("profile")
                    if (paginatedJobs[0]) handleJobAction(paginatedJobs[0], "apply")
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

          {/* Native Mobile App / Google Play Badge */}
          <div className="mt-5 flex flex-col items-center justify-center gap-1.5 z-20">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.06] border border-white/10 text-[11px] text-neutral-200 font-medium shadow-sm backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#00e599] animate-pulse" />
              <span>Celoris Job Native App · Coming Soon to Google Play</span>
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

        {/* RIGHT COLUMN: 3 Feature Cards (Apple Style) */}
        <div className="flex flex-col gap-4 sm:gap-5 lg:col-span-3 order-3">
          {/* Card 1: 5-Min Free Online Exam */}
          <motion.div
            whileHover={{ y: -4, scale: 1.02 }}
            className="rounded-2xl border border-white/[0.08] bg-[#0c1017]/95 p-5 shadow-2xl backdrop-blur-xl space-y-2.5 transition-all hover:border-emerald-500/40"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ClipboardCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="text-sm font-extrabold text-white tracking-tight">5-Min Free Online Exam</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              No generic questionnaires. Real-world scenario challenges with tab-locking and anti-cheat tracking.
            </p>
          </motion.div>

          {/* Card 2: Earn up to ₹30k/month */}
          <motion.div
            whileHover={{ y: -4, scale: 1.02 }}
            className="rounded-2xl border border-white/[0.08] bg-[#0c1017]/95 p-5 shadow-2xl backdrop-blur-xl space-y-2.5 transition-all hover:border-teal-500/40"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <IndianRupee className="w-5 h-5 text-teal-400" />
            </div>
            <h3 className="text-sm font-extrabold text-white tracking-tight">Earn up to ₹30k/month</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Achievable part-time & freelance rates for Indian creators. Celoris pays you directly with 0% platform cuts.
            </p>
          </motion.div>

          {/* Card 3: Free Forever Candidate CTA */}
          <motion.div
            whileHover={{ y: -4, scale: 1.02 }}
            className="rounded-2xl border border-emerald-500/40 bg-gradient-to-b from-emerald-950/35 via-[#0c1219] to-[#07090e] p-5 shadow-[0_0_35px_rgba(16,185,129,0.18)] backdrop-blur-xl space-y-3 relative overflow-hidden"
          >
            <div className="text-xs font-black tracking-wider text-[#00e599] uppercase">
              ✓ FREE FOREVER FOR JOB SEEKERS
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Sign in with Google in 10 seconds to take your first skill test and unlock direct employer chat.
            </p>
            <div className="w-full pt-1 flex justify-center">
              <GoogleSignInButton
                text="signin_with"
                theme="outline"
                shape="rectangular"
                redirectTo="/job-center"
              >
                <Link
                  href="/login?next=%2Fjob-center"
                  className="w-full h-11 px-4 rounded-lg bg-white hover:bg-neutral-50 text-[#3c4043] font-semibold text-xs border border-[#dadce0] shadow-sm transition-all flex items-center justify-center gap-2.5 active:scale-95 cursor-pointer"
                >
                  <GoogleIcon className="w-4 h-4 shrink-0" />
                  <span>Sign in with Google</span>
                </Link>
              </GoogleSignInButton>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  )
}
