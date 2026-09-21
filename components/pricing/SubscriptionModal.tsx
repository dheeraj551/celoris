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
  Copy,
  Check,
  ArrowLeft,
  ArrowRight,
  Smartphone,
  QrCode,
  Lock,
  BadgeCheck
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

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

export function SubscriptionModal({
  modalState,
  onClose,
}: {
  modalState: SubscribeModalState
  onClose: () => void
}) {
  const { user, profile } = useAuth()

  // Steps: 'details' | 'payment'
  const [step, setStep] = useState<"details" | "payment">("details")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [utrNumber, setUtrNumber] = useState("")
  const [message, setMessage] = useState("")
  const [copied, setCopied] = useState(false)
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
      setStep("details")
      setUtrNumber("")
      setSuccess(false)
      setError(null)
      setCopied(false)
    }
  }, [modalState.isOpen])

  if (!modalState.isOpen) return null

  // Clean numeric amount for UPI URI (e.g. ₹999/mo -> 999)
  const numericAmount = modalState.price.replace(/[^0-9]/g, "") || "499"
  const upiId = "celoris@icici"
  const payeeName = "M/S.CELORIS DESIGNS LLP"
  const upiUri = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${numericAmount}&cu=INR&tn=${encodeURIComponent(modalState.planName + " Plan")}`

  const handleCopyUpi = async () => {
    try {
      await navigator.clipboard.writeText(upiId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // fallback
    }
  }

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim()) {
      setError("Please provide your name and email address.")
      return
    }
    setError(null)
    setStep("payment")
  }

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!utrNumber.trim()) {
      setError("Please enter your 12-digit UPI UTR / Reference number after scanning the QR.")
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
          utrNumber: utrNumber.trim(),
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
        throw new Error(data.error || "Failed to submit subscription confirmation.")
      }

      setSuccess(true)
    } catch (err: any) {
      console.error("Subscription submission error:", err)
      setError(err.message || "Something went wrong. Please try again or reach out on WhatsApp.")
    } finally {
      setLoading(false)
    }
  }

  const whatsappFastTrackLink = `https://wa.me/919084718101?text=${encodeURIComponent(
    `Hi Celoris Team! I just paid ${modalState.price} for ${modalState.planName} via UPI.\n\n` +
    `• UPI UTR / Ref ID: ${utrNumber || "Verified"}\n` +
    `• Name: ${name}\n` +
    `• Account Email: ${email}\n\n` +
    `Please activate my credits and send invoice.`
  )}`

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="relative w-full max-w-lg rounded-3xl bg-[#0a0c12] border border-white/[0.14] p-5 sm:p-7 shadow-[0_25px_80px_rgba(0,0,0,0.95)] text-slate-200 z-10 max-h-[92vh] overflow-y-auto custom-scrollbar"
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 sm:top-5 sm:right-5 w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] flex items-center justify-center text-neutral-400 hover:text-white transition-colors cursor-pointer z-20"
          >
            <X className="w-4 h-4" />
          </button>

          {success ? (
            /* SUCCESS CONFIRMATION STATE */
            <div className="text-center py-4 sm:py-6">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-white tracking-tight mb-1.5">
                Payment Submitted!
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mb-5 max-w-sm mx-auto">
                Thank you, <strong className="text-white">{name}</strong>! Your payment confirmation for{" "}
                <strong className="text-emerald-400">{modalState.planName}</strong> has been transmitted to our accounts team.
              </p>

              {/* Receipt Summary Card */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-xs text-neutral-300 mb-5 text-left space-y-2">
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                  <span className="text-neutral-400">Plan:</span>
                  <strong className="text-white font-mono">{modalState.planName}</strong>
                </div>
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                  <span className="text-neutral-400">Amount Paid:</span>
                  <strong className="text-emerald-400 font-mono text-sm">{modalState.price}</strong>
                </div>
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                  <span className="text-neutral-400">UPI Ref / UTR:</span>
                  <strong className="text-purple-300 font-mono tracking-wider">{utrNumber}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400">Merchant:</span>
                  <span className="text-neutral-300 text-[11px] font-mono">celoris@icici</span>
                </div>
              </div>

              {/* Fast-Track WhatsApp CTA */}
              <a
                href={whatsappFastTrackLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-5 rounded-full bg-[#25D366] hover:bg-[#20bc5a] text-black font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-[0_0_25px_rgba(37,211,102,0.35)] cursor-pointer mb-3"
              >
                <WhatsAppIcon className="w-4 h-4" />
                <span>Fast-Track Activation on WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 px-6 rounded-full bg-white/[0.08] hover:bg-white/[0.14] text-neutral-300 text-xs font-semibold transition-all cursor-pointer"
              >
                Close Window
              </button>
            </div>
          ) : step === "details" ? (
            /* STEP 1: USER DETAILS */
            <form onSubmit={handleProceedToPayment}>
              <div className="mb-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-[11px] font-bold uppercase tracking-wider mb-2">
                  <IndianRupee className="w-3 h-3 stroke-[2.5]" />
                  <span>Step 1 of 2 • Checkout Details</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Subscribe to {modalState.planName}
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Confirm your account information to generate your instant UPI QR.
                </p>
              </div>

              {/* Plan Summary Banner */}
              <div className="rounded-2xl p-3.5 bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-emerald-500/10 border border-white/[0.1] mb-4 flex items-center justify-between">
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

              {/* Signed-in badge */}
              {user && (
                <div className="mb-4 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center gap-2 text-xs text-emerald-300 font-medium">
                  <UserCheck className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>
                    Logged in as <strong>{user.email}</strong>. Instant credit link!
                  </span>
                </div>
              )}

              {error && (
                <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300">
                  {error}
                </div>
              )}

              {/* Fields */}
              <div className="space-y-3 mb-5">
                <div>
                  <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">
                    Your Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-purple-400 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">
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
                      className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-purple-400 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">
                    Phone / WhatsApp Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210 (For invoice & WhatsApp support)"
                      className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-purple-400 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">
                    Notes / GST Number (Optional)
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3.5 top-2.5 w-4 h-4 text-neutral-500" />
                    <textarea
                      rows={2}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="GSTIN for business invoice, or specific team requirements..."
                      className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-purple-400 transition-colors resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Step 1 CTA */}
              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-purple-500 via-indigo-500 to-emerald-500 hover:from-purple-400 hover:to-emerald-400 text-white font-bold text-sm transition-all shadow-[0_0_25px_rgba(168,85,247,0.3)] hover:shadow-[0_0_35px_rgba(168,85,247,0.5)] flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Continue to UPI Payment ({modalState.price})</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="mt-3 flex items-center justify-center gap-4 text-[11px] text-neutral-500">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  ICICI Current Account
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <QrCode className="w-3.5 h-3.5 text-purple-400" />
                  Instant UPI QR
                </span>
              </div>
            </form>
          ) : (
            /* STEP 2: PROMINENT UPI / QR CODE PAYMENT */
            <form onSubmit={handleFinalSubmit}>
              <div className="flex items-center justify-between mb-3">
                <button
                  type="button"
                  onClick={() => { setStep("details"); setError(null); }}
                  className="inline-flex items-center gap-1 text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer py-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to details</span>
                </button>
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold uppercase">
                  <BadgeCheck className="w-3 h-3" />
                  <span>Step 2 of 2 • Scan &amp; Pay</span>
                </div>
              </div>

              <div className="text-center mb-3">
                <h3 className="text-xl font-black text-white tracking-tight">
                  Scan &amp; Pay via UPI
                </h3>
                <p className="text-xs text-neutral-400">
                  Payable amount for <strong className="text-white">{modalState.planName}</strong>:{" "}
                  <span className="text-emerald-400 font-mono font-bold text-sm">{modalState.price}</span>
                </p>
              </div>

              {/* Prominent ICICI QR Card Display */}
              <div className="relative mx-auto max-w-[220px] sm:max-w-[240px] rounded-2xl overflow-hidden shadow-[0_15px_45px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.12)] bg-white p-2 mb-3">
                <img
                  src="/payments/celoris-icici-card.png"
                  alt="ICICI Bank UPI QR — M/S. CELORIS DESIGNS LLP"
                  className="w-full h-auto rounded-xl object-contain block select-none"
                />
              </div>

              {/* Copy UPI ID Bar */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-neutral-300 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-neutral-400 text-[11px]">UPI ID:</span>
                  <strong className="text-white tracking-wide">{upiId}</strong>
                </div>
                <button
                  type="button"
                  onClick={handleCopyUpi}
                  className="px-2.5 py-1 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 text-[11px] font-bold border border-purple-500/30 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? "Copied!" : "Copy"}</span>
                </button>
              </div>

              {/* Mobile Quick-Pay 1-Tap Button */}
              <div className="mb-3 block sm:hidden">
                <a
                  href={upiUri}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_18px_rgba(16,185,129,0.3)] transition-all cursor-pointer"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Tap to Pay with UPI App (GPay / PhonePe / Paytm)</span>
                </a>
              </div>

              {error && (
                <div className="mb-3 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300">
                  {error}
                </div>
              )}

              {/* 12-Digit UTR Input */}
              <div className="mb-4">
                <label className="block text-xs font-bold text-neutral-200 uppercase tracking-wider mb-1 flex items-center justify-between">
                  <span>Enter 12-Digit UPI UTR / Ref No. *</span>
                  <span className="text-[10px] text-neutral-400 font-normal">From payment receipt</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    maxLength={16}
                    value={utrNumber}
                    onChange={(e) => setUtrNumber(e.target.value.replace(/[^0-9a-zA-Z]/g, ''))}
                    placeholder="e.g. 426189012345"
                    className="w-full bg-white/[0.04] border border-white/[0.12] rounded-xl px-4 py-2.5 text-sm text-white font-mono tracking-widest placeholder:tracking-normal placeholder:text-neutral-600 focus:outline-none focus:border-emerald-400 transition-colors"
                  />
                </div>
                <p className="text-[10px] text-neutral-500 mt-1">
                  Found in your GPay / PhonePe / Paytm receipt under &quot;UPI Ref No.&quot; or &quot;UTR&quot;.
                </p>
              </div>

              {/* Final Submit Button */}
              <button
                type="submit"
                disabled={loading || !utrNumber.trim()}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-sm transition-all shadow-[0_0_25px_rgba(16,185,129,0.3)] hover:shadow-[0_0_35px_rgba(16,185,129,0.5)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying &amp; Transmitting...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Submit UTR &amp; Activate Plan</span>
                  </>
                )}
              </button>

              <p className="text-[10px] text-center text-neutral-500 mt-2">
                Merchant: <strong>M/S.CELORIS DESIGNS LLP</strong> • Current Account ICICI Bank
              </p>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
