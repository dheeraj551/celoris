"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  X,
  CheckCircle2,
  Send,
  Loader2,
  IndianRupee,
  ShieldCheck,
  UserCheck,
  MessageSquare,
  Phone,
  Mail,
  User,
  Sparkles
} from "lucide-react"
import { useAuth } from "@/components/providers/AuthProvider"
import { BillingCycle } from "./PricingCard"

export interface SubscribeModalState {
  isOpen: boolean
  planName: string
  billingCycle: BillingCycle
  price: string
  credits: string
}

export function SubscriptionModal({
  modalState,
  onClose,
}: {
  modalState: SubscribeModalState
  onClose: () => void
}) {
  const { user, profile } = useAuth()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Pre-fill user data if authenticated
  useEffect(() => {
    if (user) {
      const displayName =
        profile?.full_name ||
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        user.email?.split("@")[0] ||
        ""
      setName(displayName)
      setEmail(user.email || "")
      if (profile?.phone) {
        setPhone(profile.phone)
      }
    }
  }, [user, profile, modalState.isOpen])

  // Reset states on modal open/close
  useEffect(() => {
    if (modalState.isOpen) {
      setSuccess(false)
      setError(null)
    }
  }, [modalState.isOpen])

  if (!modalState.isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim()) {
      setError("Please provide your name and email address.")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/pricing/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          planName: modalState.planName,
          billingCycle: modalState.billingCycle,
          price: modalState.price,
          credits: modalState.credits,
          message: message.trim(),
          isRegisteredUser: !!user,
          userId: user?.id || null,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit subscription request.")
      }

      setSuccess(true)
    } catch (err: any) {
      console.error("Subscription submission error:", err)
      setError(err.message || "Something went wrong. Please try again or email support@celorisdesigns.com directly.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="relative w-full max-w-lg rounded-3xl bg-[#0b0d13] border border-white/[0.14] p-6 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.9)] text-slate-200 z-10"
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] flex items-center justify-center text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {success ? (
            /* Success State */
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-white tracking-tight mb-2">
                Request Sent to Support!
              </h3>
              <p className="text-sm text-neutral-300 leading-relaxed mb-4 max-w-sm mx-auto">
                Thank you, <strong className="text-white">{name}</strong>! Your subscription request for{" "}
                <strong className="text-emerald-400">{modalState.planName}</strong> has been transmitted directly to{" "}
                <span className="text-purple-300 font-mono text-xs font-bold">support@celorisdesigns.com</span>.
              </p>
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-xs text-neutral-400 mb-6 text-left space-y-1">
                <p className="flex items-center gap-2 text-white font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  What happens next?
                </p>
                <p>• Our accounts team will review your account and activate your credit allotment.</p>
                <p>• You will receive an invoice &amp; UPI payment link on WhatsApp / email.</p>
                <p>• Need instant help? Email us directly at <a href="mailto:support@celorisdesigns.com" className="text-purple-400 underline">support@celorisdesigns.com</a>.</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 px-6 rounded-full bg-white hover:bg-neutral-200 text-black font-bold text-sm transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          ) : (
            /* Form View */
            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-bold uppercase tracking-wider mb-2">
                  <IndianRupee className="w-3 h-3 stroke-[2.5]" />
                  <span>Subscription Request</span>
                </div>
                <h3 className="text-2xl font-black text-white tracking-tight">
                  Subscribe to {modalState.planName}
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Send your subscription details directly to <span className="text-purple-300 font-medium">support@celorisdesigns.com</span> for instant activation.
                </p>
              </div>

              {/* Selected Plan Summary Banner */}
              <div className="rounded-2xl p-3.5 bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-emerald-500/10 border border-white/[0.1] mb-5 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white font-mono block">
                    {modalState.planName}
                  </span>
                  <span className="text-[11px] text-neutral-400">
                    Quota: {modalState.credits}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-emerald-400 font-mono block">
                    {modalState.price}
                  </span>
                  <span className="text-[10px] text-neutral-400 uppercase font-mono">
                    {modalState.billingCycle === "annual" ? "Billed Annually" : "Billed Monthly"}
                  </span>
                </div>
              </div>

              {/* Signed-in badge if logged in */}
              {user && (
                <div className="mb-4 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center gap-2 text-xs text-emerald-300 font-medium">
                  <UserCheck className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>
                    Logged in as <strong>{user.email}</strong>. No new signup needed!
                  </span>
                </div>
              )}

              {error && (
                <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300">
                  {error}
                </div>
              )}

              {/* Input Fields */}
              <div className="space-y-3.5 mb-5">
                <div>
                  <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                    Your Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-purple-400 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. rahul@example.com"
                      className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-purple-400 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                    Phone / WhatsApp Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210 (For UPI link & instant activation)"
                      className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-purple-400 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                    Notes / Custom Requirements (Optional)
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3.5 top-3 w-4 h-4 text-neutral-500" />
                    <textarea
                      rows={2}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Add GST number, invoice details, or specific AI model questions..."
                      className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-purple-400 transition-colors resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-purple-500 via-indigo-500 to-emerald-500 hover:from-purple-400 hover:to-emerald-400 text-white font-bold text-sm transition-all shadow-[0_0_25px_rgba(168,85,247,0.3)] hover:shadow-[0_0_35px_rgba(168,85,247,0.5)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending Request to Support...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Message to support@celorisdesigns.com</span>
                  </>
                )}
              </button>

              <p className="text-[11px] text-center text-neutral-500 mt-2.5">
                Our support team typically responds within 15–30 minutes during business hours.
              </p>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
