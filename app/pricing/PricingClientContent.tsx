"use client"

import React, { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  ShieldCheck,
  GraduationCap,
  Briefcase,
  Zap,
  ArrowRight,
  CheckCircle2,
  Lock,
  IndianRupee
} from "lucide-react"
import { PricingCard, BillingCycle } from "@/components/pricing/PricingCard"
import { PRICING_PLANS } from "@/components/pricing/pricingPlansData"
import { PricingComparisonTable } from "@/components/pricing/PricingComparisonTable"
import { PricingFaq } from "@/components/pricing/PricingFaq"
import { SubscriptionModal, SubscribeModalState } from "@/components/pricing/SubscriptionModal"
import { SpotlightCard } from "@/components/ui/spotlight-card"
import { cn } from "@/lib/utils"

export function PricingClientContent() {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("annual")
  const [modalState, setModalState] = useState<SubscribeModalState>({
    isOpen: false,
    planName: "",
    billingCycle: "annual",
    price: "",
    credits: "",
  })

  const handleSelectPlan = (planName: string, price: string, credits: string) => {
    setModalState({
      isOpen: true,
      planName,
      billingCycle,
      price,
      credits,
    })
  }

  return (
    <div className="py-10 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-slate-200">
      {/* Hero Heading */}
      <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-5 backdrop-blur-xl"
        >
          <IndianRupee className="w-3.5 h-3.5 text-purple-400" />
          <span>Pricing in INR (₹) • Free Education &amp; Jobs Since 2019</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight mb-4"
        >
          Simple, Transparent Plans.{" "}
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-purple-400 bg-clip-text text-transparent">
            Built for India.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-neutral-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto"
        >
          Choose the AI generation credits you need.{" "}
          <strong className="text-emerald-400 font-bold">100% Free Online Classes</strong>,{" "}
          <strong className="text-amber-400 font-bold">Free Job Portal</strong>, and{" "}
          <strong className="text-rose-400 font-bold">Café Lounge Access</strong> are included in every package, forever.
        </motion.p>

        {/* Billing Cycle Switcher */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 inline-flex items-center p-1.5 rounded-full bg-white/[0.05] border border-white/[0.12] backdrop-blur-2xl shadow-xl"
        >
          <button
            type="button"
            onClick={() => setBillingCycle("monthly")}
            className={cn(
              "px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer",
              billingCycle === "monthly"
                ? "bg-white text-black shadow-md"
                : "text-neutral-400 hover:text-white"
            )}
          >
            Monthly Billing
          </button>
          <button
            type="button"
            onClick={() => setBillingCycle("annual")}
            className={cn(
              "flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer",
              billingCycle === "annual"
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25"
                : "text-neutral-400 hover:text-white"
            )}
          >
            <span>Annual Billing</span>
            <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-400 text-black shadow">
              Save up to 25%
            </span>
          </button>
        </motion.div>
      </div>

      {/* 4 Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-stretch mb-20">
        {PRICING_PLANS.map((plan) => (
          <PricingCard
            key={plan.id}
            plan={plan}
            billingCycle={billingCycle}
            onSelectPlan={handleSelectPlan}
          />
        ))}
      </div>

      {/* Universal Ecosystem Banner */}
      <div className="mb-20">
        <SpotlightCard
          radius="2rem"
          beamColor="rgba(16, 185, 129, 0.85)"
          glowColor="rgba(16, 185, 129, 0.12)"
          className="shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
          innerClassName="bg-gradient-to-br from-[#061510]/80 via-[#070b09]/90 to-[#0e0915]/80 p-8 sm:p-12 border border-white/[0.1] backdrop-blur-3xl"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold mb-3">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>The Celoris Promise</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-3">
                Why Are Classes &amp; The Job Portal Free in Every Tier?
              </h2>
              <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed mb-6">
                We believe that learning digital skills and finding meaningful freelance work should never be locked behind a paywall. Our entire course catalog (Web Dev, Digital Marketing, AI Tools, Excel Copilot, Shorts/Reels) and direct-client Job Center remain completely open and free. When you choose a paid plan, you are funding GPU compute hours for generative AI tools like Seedance 2.0/2.5 and Nano Banana.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                  <GraduationCap className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-xs font-bold text-white">Free Classes</h3>
                    <p className="text-[11px] text-neutral-400">All lectures, syllabi &amp; certs included</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                  <Briefcase className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-xs font-bold text-white">0% Commission</h3>
                    <p className="text-[11px] text-neutral-400">Keep 100% of what clients pay you</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                  <Zap className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-xs font-bold text-white">20+ AI Models</h3>
                    <p className="text-[11px] text-neutral-400">Nano Banana, Seedance, Kling &amp; more</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col items-center justify-center text-center p-6 rounded-3xl bg-white/[0.03] border border-white/[0.08]">
              <span className="text-4xl font-black text-white font-mono mb-1">₹0</span>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3">
                To Start Today
              </span>
              <p className="text-[11px] text-neutral-400 mb-5 leading-relaxed">
                Create your account in seconds without entering any credit card or payment information.
              </p>
              <Link
                href="/register"
                className="w-full py-3 px-5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-bold text-xs sm:text-sm transition-all shadow-[0_0_25px_rgba(16,185,129,0.3)] hover:scale-[1.02] active:scale-[0.98] text-center"
              >
                Create Free Account
              </Link>
            </div>
          </div>
        </SpotlightCard>
      </div>

      {/* Feature Comparison Matrix */}
      <div className="mb-24">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-neutral-300 text-xs font-medium mb-3">
            <IndianRupee className="w-3.5 h-3.5 text-purple-400 stroke-[2.5]" />
            <span>Full Plan Breakdown</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Compare All Plans &amp; Capabilities
          </h2>
          <p className="text-neutral-400 text-xs sm:text-sm mt-1">
            See every AI model quota, resolution limits, and included ecosystem benefits side by side.
          </p>
        </div>

        <PricingComparisonTable />
      </div>

      {/* FAQ Section */}
      <div className="mb-20">
        <PricingFaq />
      </div>

      {/* Bottom CTA Card */}
      <div className="rounded-3xl p-8 sm:p-12 text-center bg-gradient-to-r from-purple-900/30 via-indigo-900/20 to-emerald-900/30 border border-white/[0.12] backdrop-blur-2xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-3">
            Ready to supercharge your creativity?
          </h2>
          <p className="text-neutral-300 text-xs sm:text-base mb-6 leading-relaxed">
            Get instant access to free classes, daily freelance gigs, and cutting-edge generative AI models tailored for India.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3.5">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-neutral-200 text-black font-bold text-xs sm:text-sm transition-all shadow-xl hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/learn"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.15] text-white font-medium text-xs sm:text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <GraduationCap className="w-4 h-4 text-emerald-400" />
              <span>Browse Free Courses</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Subscription Request Modal */}
      <SubscriptionModal
        modalState={modalState}
        onClose={() => setModalState((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  )
}
