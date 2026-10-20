"use client"

import React from "react"
import Link from "next/link"
import {
  X,
  Sparkles,
  CheckCircle2,
  MapPin,
  Users,
  IndianRupee,
  ShieldCheck,
  ArrowRight,
  MessageSquare,
  PhoneCall,
  Clock,
} from "lucide-react"
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton"
import { openPhoneOS } from "@/components/phone-os/trigger"
import type { TeachingSlot } from "./TeachLanding"

interface ClaimSlotModalProps {
  slot: TeachingSlot | null
  isOpen: boolean
  onClose: () => void
}

export function ClaimSlotModal({ slot, isOpen, onClose }: ClaimSlotModalProps) {
  if (!isOpen || !slot) return null

  const targetRedirect = `/teach/dashboard/trainer/enquiries?slot=${encodeURIComponent(slot.id)}`

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
        {/* Glow Accent */}
        <div className="pointer-events-none absolute -top-20 left-1/2 h-40 w-80 -translate-x-1/2 rounded-full bg-emerald-500/20 blur-[80px]" />

        {/* Header */}
        <div className="relative flex items-center justify-between border-b border-white/[0.08] px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-400">
              Claim Student Slot
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
          {/* Slot Summary Card */}
          <div className="rounded-2xl border border-white/[0.1] bg-white/[0.03] p-4.5 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="inline-block text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400">
                  {slot.category}
                </span>
                <h3 className="text-lg font-bold text-white leading-snug">
                  {slot.subject}
                </h3>
                {slot.studentName && (
                  <p className="text-xs text-neutral-400 flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Student: <span className="text-white font-medium">{slot.studentName}</span>
                  </p>
                )}
              </div>
              <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300 shrink-0">
                {slot.status}
              </span>
            </div>

            {/* Requirement text */}
            <p className="text-xs text-neutral-300 italic bg-black/40 rounded-xl p-3 border border-white/[0.04] leading-relaxed">
              &ldquo;{slot.requirement}&rdquo;
            </p>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 text-xs pt-1">
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 font-bold text-emerald-300">
                <IndianRupee className="h-3 w-3" />
                {slot.budget}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-neutral-300">
                <MapPin className="h-3 w-3 text-emerald-400" />
                {slot.location}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-neutral-300">
                <Users className="h-3 w-3 text-neutral-400" />
                {slot.mode}
              </span>
            </div>
          </div>

          {/* Registration Notice & Value Props */}
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/20 p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Free Celoris Teach Registration Required</span>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed">
              To contact this student and unlock their requirement, create your verified tutor profile. It takes 15 seconds and is 100% free.
            </p>

            <ul className="text-[11px] text-neutral-300 space-y-1.5 pt-1.5 border-t border-emerald-500/20">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span><strong>0% Commission:</strong> You keep 100% of every rupee students pay</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span><strong>No Coin Deductions:</strong> No paywalls to view student inquiries</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span><strong>Direct In-App Contact:</strong> Built-in chat &amp; 1-on-1 audio/video sessions</span>
              </li>
            </ul>
          </div>

          {/* Action: Fast 1-Click Google Sign In */}
          <div className="space-y-3 pt-1">
            <GoogleSignInButton
              text="continue_with"
              oneTap={false}
              redirectTo={targetRedirect}
            >
              <Link
                href={`/login?next=${encodeURIComponent(targetRedirect)}`}
                className="w-full py-3.5 px-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-sm transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="h-4 w-4" />
                Continue with Google to Claim Slot
                <ArrowRight className="h-4 w-4" />
              </Link>
            </GoogleSignInButton>

            <div className="flex items-center justify-between text-xs text-neutral-400 px-1 pt-1">
              <Link
                href={`/register?role=trainer&next=${encodeURIComponent(targetRedirect)}`}
                onClick={onClose}
                className="hover:text-emerald-300 underline underline-offset-2 transition-colors"
              >
                Register with Email &amp; Password
              </Link>

              <Link
                href={`/login?next=${encodeURIComponent(targetRedirect)}`}
                onClick={onClose}
                className="hover:text-emerald-300 underline underline-offset-2 transition-colors font-semibold"
              >
                Already have an account? Sign In
              </Link>
            </div>
          </div>

          {/* Assistance Footer: Chat & Phone Support */}
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-center space-y-2">
            <p className="text-[11px] text-neutral-400">
              Need assistance or want to talk to teacher support first?
            </p>
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => {
                  onClose()
                  openPhoneOS("support", "chat")
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-semibold text-white transition-all cursor-pointer"
              >
                <MessageSquare className="h-3.5 w-3.5 text-emerald-400" />
                <span>Chat Support</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose()
                  openPhoneOS("support", "lead")
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-semibold text-white transition-all cursor-pointer"
              >
                <PhoneCall className="h-3.5 w-3.5 text-sky-400" />
                <span>Phone Support</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
