"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2 } from "lucide-react"
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon"

const POPULAR_TEACHING_SUBJECTS = [
  "Video Editing & Reels",
  "Python & AI Tutor",
  "Microsoft Excel & Power BI",
  "Graphic Design & Canva",
  "Full-Stack Web Dev",
  "Spoken English & Accent",
  "CBSE Physics & Maths",
  "Digital Marketing",
]

const SAMPLE_STUDENT_ENQUIRIES = [
  {
    subject: "Video Editing (Premiere Pro & Reels Pacing)",
    budget: "₹8,000 - ₹12,000 / mo",
    location: "Noida / Online",
    mode: "Online 1-on-1",
    time: "3m ago",
  },
  {
    subject: "Python & Machine Learning / LangChain",
    budget: "₹1,200 - ₹1,500 / hr",
    location: "Gurugram / Hybrid",
    mode: "Weekend Hybrid",
    time: "9m ago",
  },
  {
    subject: "Advanced Excel, Pivot & Power Query",
    budget: "₹950 / hr",
    location: "Noida Sector 18 / Online",
    mode: "Morning Batches",
    time: "17m ago",
  },
  {
    subject: "Social Media Graphic Design (Photoshop)",
    budget: "₹7,000 / mo",
    location: "South Delhi (Saket)",
    mode: "Home Tuition",
    time: "24m ago",
  },
]

export function WhatsAppTrainerAlerts() {
  const [phone, setPhone] = useState("")
  const [selectedSubject, setSelectedSubject] = useState(POPULAR_TEACHING_SUBJECTS[0])
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeAlertIndex, setActiveAlertIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveAlertIndex((prev) => (prev + 1) % SAMPLE_STUDENT_ENQUIRIES.length)
    }, 3800)
    return () => clearInterval(timer)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const cleaned = phone.replace(/\D/g, "")
    if (cleaned.length < 10) {
      setError("Please enter a valid 10-digit WhatsApp number")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/leads/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Trainer / Instructor",
          phone: cleaned.slice(-10),
          course: selectedSubject,
          mode: "Online / Home Tuition",
          source: "teach_whatsapp_alerts",
          requirement: `Trainer alert subscription for ${selectedSubject}`,
        }),
      })

      if (res.ok) {
        setSubmitted(true)
      } else {
        const data = await res.json().catch(() => ({}))
        setError(data.error || "Failed to subscribe. Please try again.")
      }
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="relative overflow-hidden rounded-3xl border border-[#25D366]/40 bg-gradient-to-br from-[#0c2215] via-[#09160e] to-[#050608] p-8 sm:p-10 text-center text-white shadow-[0_0_60px_rgba(37,211,102,0.2)]">
        <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[#25D366]/15 blur-[80px]" />
        
        <div className="relative inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366]/20 text-[#25D366] mb-4 shadow-[0_0_25px_rgba(37,211,102,0.4)]">
          <WhatsAppIcon className="h-8 w-8 text-[#25D366]" />
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#25D366] text-black text-[10px] font-black">
            ✓
          </span>
        </div>

        <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          You&apos;re Subscribed on WhatsApp! 🎉
        </h3>
        <p className="mt-2.5 text-sm sm:text-base text-neutral-300 max-w-lg mx-auto">
          We&apos;ll notify you on WhatsApp whenever a new verified student request or batch opens for{" "}
          <span className="text-[#25D366] font-bold">{selectedSubject}</span>. 0% commission, keep 100% of your earnings.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={`https://wa.me/919084718101?text=${encodeURIComponent(
              `Hi Celoris! I'm an educator and just subscribed for ${selectedSubject} teaching alerts on WhatsApp. Please activate my alerts!`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-black font-extrabold px-6 py-3 text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(37,211,102,0.4)] hover:scale-105 active:scale-95"
          >
            <WhatsAppIcon className="h-4 w-4" />
            Open WhatsApp to Confirm
          </a>
          <button
            onClick={() => setSubmitted(false)}
            className="text-xs text-neutral-400 hover:text-white transition-colors underline underline-offset-4"
          >
            Subscribe another subject or number
          </button>
        </div>
      </div>
    )
  }

  const currentEnquiry = SAMPLE_STUDENT_ENQUIRIES[activeAlertIndex]

  return (
    <div className="relative overflow-hidden rounded-3xl border border-[#25D366]/30 bg-gradient-to-br from-[#0c2215]/90 via-[#08150f]/80 to-[#050608] p-6 sm:p-8 shadow-[0_0_50px_rgba(37,211,102,0.12)]">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[#25D366]/15 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-60 w-60 rounded-full bg-[#25D366]/10 blur-[90px]" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        {/* Left Side: Headline & Live Simulated Alert Bubble */}
        <div className="max-w-xl">
          {/* Eyebrow badge with authentic WhatsApp icon and pulsating radar dot */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#25D366]/40 bg-[#25D366]/10 px-3.5 py-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-[#25D366] shadow-[0_0_20px_rgba(37,211,102,0.2)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-80" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#25D366]" />
            </span>
            <WhatsAppIcon className="h-3.5 w-3.5 text-[#25D366]" />
            <span>Instant Student Request Alerts</span>
          </div>

          <h3 className="mt-3.5 text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
            Get student teaching requests delivered to your{" "}
            <span className="text-[#25D366] underline decoration-[#25D366]/40 decoration-wavy underline-offset-4">
              WhatsApp
            </span>
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-neutral-300 leading-relaxed">
            Never miss high-budget student inquiries across Delhi/NCR and Pan-India. Direct WhatsApp alerts with 1-click slot claiming.
          </p>

          {/* Animated WhatsApp Live Notification Simulator */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1.5 px-1">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#25D366]" />
                Live Student Inquiries Feed
              </span>
              <span className="text-neutral-500">Auto-updating</span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeAlertIndex}
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="flex items-start gap-3 rounded-2xl border border-[#25D366]/25 bg-[#0b1b11]/90 p-3 sm:p-3.5 shadow-[0_8px_30px_rgba(0,0,0,0.6)] backdrop-blur-md"
              >
                <div className="relative shrink-0 mt-0.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#25D366] text-black shadow-[0_0_15px_rgba(37,211,102,0.4)]">
                    <WhatsAppIcon className="h-5 w-5 text-black" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#25D366] border border-[#0b1b11]" />
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-[#25D366] tracking-tight">
                      Celoris Student Dispatch
                    </span>
                    <span className="text-[10px] text-neutral-400 font-mono">{currentEnquiry.time}</span>
                  </div>
                  <p className="mt-0.5 text-xs font-semibold text-white truncate">
                    {currentEnquiry.subject}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[10px]">
                    <span className="rounded-full bg-[#25D366]/15 border border-[#25D366]/30 px-2 py-0.5 font-bold text-[#25D366]">
                      {currentEnquiry.budget}
                    </span>
                    <span className="text-neutral-400">• {currentEnquiry.location}</span>
                    <span className="text-neutral-400">• {currentEnquiry.mode}</span>
                    <span className="text-[#25D366] font-semibold">• 0% Commission</span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Right Side: Interactive Subscription Form */}
        <form onSubmit={handleSubmit} className="w-full lg:w-[420px] shrink-0 space-y-3.5">
          <div>
            <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-300 mb-1.5">
              Select your subject to receive matching students:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_TEACHING_SUBJECTS.map((subject) => (
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  type="button"
                  key={subject}
                  onClick={() => setSelectedSubject(subject)}
                  className={`rounded-full px-3 py-1.5 text-[11px] font-medium transition-all cursor-pointer ${
                    selectedSubject === subject
                      ? "bg-[#25D366] text-black font-extrabold shadow-[0_0_15px_rgba(37,211,102,0.4)]"
                      : "bg-white/[0.05] border border-white/10 text-neutral-300 hover:border-[#25D366]/40 hover:bg-white/[0.1]"
                  }`}
                >
                  {subject}
                </motion.button>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-1">
            <div className="relative flex-1">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-xs font-mono font-bold text-[#25D366]">
                <WhatsAppIcon className="h-3.5 w-3.5" />
                <span>+91</span>
              </span>
              <input
                type="tel"
                placeholder="WhatsApp number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                maxLength={10}
                required
                className="w-full rounded-full border border-white/15 bg-white/[0.06] py-3 pl-16 pr-4 text-sm text-white placeholder:text-neutral-500 focus:border-[#25D366] focus:bg-[#0c1b11] focus:outline-none focus:ring-2 focus:ring-[#25D366]/30 transition-all"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] hover:bg-[#20bd5a] px-6 py-3 text-xs font-black text-black uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(37,211,102,0.35)] disabled:opacity-50 shrink-0 cursor-pointer"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin text-black" />
              ) : (
                <>
                  <WhatsAppIcon className="h-4 w-4 text-black" />
                  <span>Get Student Alerts</span>
                </>
              )}
            </motion.button>
          </div>

          {error && <p className="text-xs text-rose-400 pl-1">{error}</p>}

          <p className="text-[11px] text-neutral-400 flex items-center gap-1.5 pl-1">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#25D366]" />
            100% Free · 0% Commission · Direct student contact · Cancel anytime
          </p>
        </form>
      </div>
    </div>
  )
}
