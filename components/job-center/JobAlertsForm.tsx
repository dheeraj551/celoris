"use client"

import React, { useState } from "react"
import { Bell, CheckCircle2, Loader2, Sparkles } from "lucide-react"

const POPULAR_SKILLS = [
  "Video Editing & Reels",
  "Graphic & Social Design",
  "Digital Marketing",
  "Web Development",
  "Prompt Engineering & AI",
  "Sales & Cold Calling",
]

export function JobAlertsForm() {
  const [phone, setPhone] = useState("")
  const [selectedSkill, setSelectedSkill] = useState(POPULAR_SKILLS[0])
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
          name: "Job Candidate",
          phone: cleaned.slice(-10),
          course: selectedSkill,
          mode: "Online / Remote",
          source: "job_center_whatsapp_alerts",
          requirement: `WhatsApp Job Alerts subscription for ${selectedSkill}`,
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
      <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-6 sm:p-8 text-center text-white">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 mb-3">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <h3 className="text-xl font-bold">You&apos;re Subscribed for WhatsApp Alerts! 🎉</h3>
        <p className="mt-2 text-sm text-neutral-300 max-w-md mx-auto">
          We&apos;ll notify you on WhatsApp whenever a new verified gig or remote role opens for <span className="text-emerald-300 font-semibold">{selectedSkill}</span>.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-emerald-500/[0.07] via-white/[0.02] to-transparent p-6 sm:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-lg">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-400">
            <Bell className="h-3 w-3" />
            Instant WhatsApp Alerts
          </span>
          <h3 className="mt-3 text-xl sm:text-2xl font-bold text-white tracking-tight">
            Get new matching gigs delivered to your WhatsApp
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-neutral-300">
            Never miss high-paying creator gigs or remote openings. Free alerts, zero spam.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full md:w-auto flex-1 max-w-md space-y-3">
          <div className="flex flex-wrap gap-1.5">
            {POPULAR_SKILLS.map((skill) => (
              <button
                type="button"
                key={skill}
                onClick={() => setSelectedSkill(skill)}
                className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition-all ${
                  selectedSkill === skill
                    ? "bg-emerald-500 text-black font-semibold shadow-sm"
                    : "bg-white/[0.05] border border-white/10 text-neutral-300 hover:bg-white/[0.1]"
                }`}
              >
                {skill}
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-neutral-400">
                +91
              </span>
              <input
                type="tel"
                placeholder="WhatsApp number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                maxLength={10}
                required
                className="w-full rounded-full border border-white/15 bg-white/[0.06] py-2.5 pl-12 pr-4 text-sm text-white placeholder:text-neutral-500 focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500 px-5 py-2.5 text-xs font-bold text-black uppercase tracking-wider transition hover:bg-emerald-400 disabled:opacity-50 shrink-0"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5" />
                  Get Alerts
                </>
              )}
            </button>
          </div>
          {error && <p className="text-xs text-rose-400 pl-1">{error}</p>}
        </form>
      </div>
    </div>
  )
}
