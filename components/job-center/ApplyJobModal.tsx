"use client"

import React from "react"
import Link from "next/link"
import {
  X,
  Sparkles,
  CheckCircle2,
  MapPin,
  IndianRupee,
  ShieldCheck,
  ArrowRight,
  MessageSquare,
  Clock,
  Briefcase,
  Zap,
} from "lucide-react"
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton"
import type { PublicJob } from "./JobCenterLanding"

interface ApplyJobModalProps {
  job: PublicJob | null
  isOpen: boolean
  onClose: () => void
}

export function ApplyJobModal({ job, isOpen, onClose }: ApplyJobModalProps) {
  if (!isOpen || !job) return null

  const targetRedirect = `/job-center?apply=${encodeURIComponent(job.id)}`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg rounded-3xl border border-emerald-500/30 bg-[#0a0d14] text-white shadow-[0_20px_70px_rgba(0,0,0,0.95)] overflow-hidden z-10 my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Ambient Glow Accent */}
        <div className="pointer-events-none absolute -top-20 left-1/2 h-40 w-80 -translate-x-1/2 rounded-full bg-emerald-500/20 blur-[80px]" />

        {/* Header */}
        <div className="relative flex items-center justify-between border-b border-white/[0.08] px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-400">
              Apply via Celoris Job
            </span>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-neutral-400 hover:bg-white/[0.08] hover:text-white transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-5">
          {/* Job Summary Card */}
          <div className="rounded-2xl border border-white/[0.1] bg-white/[0.03] p-4.5 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="inline-block text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400">
                  {job.industry || "Creative & Tech"}
                </span>
                <h3 className="text-lg font-bold text-white leading-snug">
                  {job.title}
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  {(!job.company || /confidential/i.test(job.company)) ? "Celoris" : job.company} · {job.workMode || "100% Remote"}
                </p>
              </div>

              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-300 shrink-0">
                <IndianRupee className="h-3 w-3" />
                {job.pay ? job.pay.replace(/₹/g, "") : "₹30,000 / mo"}
              </span>
            </div>

            {/* Badges / Skills Required */}
            {job.badges && job.badges.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-white/[0.06] text-xs">
                <span className="text-neutral-400 text-[11px]">Required Badge:</span>
                {job.badges.map((b) => (
                  <span
                    key={b}
                    className="inline-flex items-center gap-1 rounded bg-white/[0.06] border border-white/10 px-2 py-0.5 text-[11px] font-medium text-emerald-300"
                  >
                    <ShieldCheck className="h-3 w-3 text-emerald-400" />
                    {b}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Guarantee Highlights */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white">0% Commission</span>
                <p className="text-[11px] text-neutral-400">Keep 100% of your earnings. Zero deductions.</p>
              </div>
            </div>

            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 flex items-start gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white">5-Min Free Test</span>
                <p className="text-[11px] text-neutral-400">Proctored skill test. No coin packs or bidding fees.</p>
              </div>
            </div>
          </div>

          {/* Google Sign-in CTA */}
          <div className="space-y-3 pt-1">
            <p className="text-xs text-neutral-300 text-center">
              Continue with Google to verify your skills, mint your certificate, and connect directly with the employer.
            </p>

            <div className="flex justify-center">
              <GoogleSignInButton
                text="continue_with"
                oneTap
                oneTapDelayMs={1500}
                redirectTo={targetRedirect}
              >
                <Link
                  href={`/login?next=${encodeURIComponent(targetRedirect)}`}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#00e599] hover:bg-[#00cc88] px-5 py-3.5 text-sm font-extrabold text-black shadow-[0_0_25px_rgba(0,229,153,0.35)] transition-all cursor-pointer active:scale-95"
                >
                  <Zap className="h-4 w-4 fill-black" />
                  <span>Start Free 5-Min Test &amp; Apply</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </GoogleSignInButton>
            </div>

            <p className="text-[11px] text-neutral-500 text-center">
              🔒 Free forever. No credit card required. No coin system.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
