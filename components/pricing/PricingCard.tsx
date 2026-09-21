"use client"

import React, { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  IndianRupee,
  Lock,
  Info,
  Check,
  X as XIcon,
  Sliders,
  ChevronRight,
  GraduationCap,
  Briefcase,
  Coffee,
  Tv,
  Zap,
  Activity,
  Diamond,
  ShieldCheck,
  ArrowRight
} from "lucide-react"
import { cn } from "@/lib/utils"

export type BillingCycle = "annual" | "monthly"

export interface PlanConfig {
  id: "free" | "basic" | "pro" | "max"
  name: string
  subtitle: string
  badge?: {
    text: string
    variant: "pink" | "cyan" | "emerald"
    icon?: React.ReactNode
  }
  bestValueBadge?: boolean
  creditOptions?: {
    credits: number
    nanoBananaGenerations: number
    seedanceVideos: number
    annualPrice: number // in INR / month
    monthlyPrice: number // in INR / month
    originalAnnualPrice?: number
    originalMonthlyPrice?: number
  }[]
  fixedCredits?: {
    credits: number
    nanoBananaGenerations: number
    seedanceVideos: number
    label: string
  }
  annualPrice: number // in INR / month
  monthlyPrice: number // in INR / month
  originalAnnualPrice?: number
  originalMonthlyPrice?: number
  savingsAnnualText?: string
  buttonText: string
  buttonStyle: "emerald" | "white" | "lime" | "magenta"
  buttonHref: string
  noteBelowButton: string
  unlimitedGens: {
    title: string
    resolution?: string
    badge?: string
    isAvailable: boolean
    statusText?: string
  }[]
  extraModelsCount?: number
  seedanceSection: {
    hasAccess: boolean
    badgeTitle: string
    badgeSubtitle: string
    models: {
      name: string
      resolution?: string
      status: string
      isAvailable: boolean
    }[]
  }
  parallelGens?: string
  classQueuePriority?: {
    boost: number
    label: string
  }
  ecosystemPerks: {
    title: string
    desc: string
    icon: React.ComponentType<{ className?: string }>
    highlight?: boolean
  }[]
}

export function PricingCard({
  plan,
  billingCycle,
  onSelectPlan,
}: {
  plan: PlanConfig
  billingCycle: BillingCycle
  onSelectPlan?: (planName: string, price: string, credits: string) => void
}) {
  const [selectedCreditIndex, setSelectedCreditIndex] = useState(0)
  const [isExtraModelsOpen, setIsExtraModelsOpen] = useState(false)

  // Current credit option
  const activeCreditOption = plan.creditOptions
    ? plan.creditOptions[selectedCreditIndex]
    : null

  // Active pricing in INR
  const currentPrice = activeCreditOption
    ? billingCycle === "annual"
      ? activeCreditOption.annualPrice
      : activeCreditOption.monthlyPrice
    : billingCycle === "annual"
    ? plan.annualPrice
    : plan.monthlyPrice

  const originalPrice = activeCreditOption
    ? billingCycle === "annual"
      ? activeCreditOption.originalAnnualPrice
      : activeCreditOption.originalMonthlyPrice
    : billingCycle === "annual"
    ? plan.originalAnnualPrice
    : plan.originalMonthlyPrice

  // Total savings calculation for annual
  const monthlyCost = activeCreditOption
    ? activeCreditOption.monthlyPrice
    : plan.monthlyPrice
  const annualCost = activeCreditOption
    ? activeCreditOption.annualPrice
    : plan.annualPrice
  const totalAnnualSavings = (monthlyCost - annualCost) * 12

  // Card outline and glow styles
  const cardBorderClasses = {
    free: "border-emerald-500/30 hover:border-emerald-500/60 bg-[#070b09]/90",
    basic: "border-white/10 hover:border-white/20 bg-[#0d0e12]/90",
    pro: "border-[#d4ff00]/40 hover:border-[#d4ff00]/70 bg-[#0e110c]/90 shadow-[0_0_40px_rgba(212,255,0,0.06)]",
    max: "border-pink-500/40 hover:border-pink-500/70 bg-[#120912]/90 shadow-[0_0_50px_rgba(244,63,94,0.08)]",
  }[plan.id]

  return (
    <div
      className={cn(
        "relative rounded-3xl p-5 sm:p-6 border backdrop-blur-2xl transition-all duration-300 flex flex-col justify-between group",
        cardBorderClasses
      )}
    >
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-1.5 min-h-[32px]">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase font-mono">
              {plan.name}
            </h3>

            {plan.badge && (
              <span
                className={cn(
                  "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                  plan.badge.variant === "pink" &&
                    "bg-rose-500/20 text-rose-300 border border-rose-500/40",
                  plan.badge.variant === "emerald" &&
                    "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40",
                  plan.badge.variant === "cyan" &&
                    "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                )}
              >
                {plan.badge.icon}
                {plan.badge.text}
              </span>
            )}

            {plan.bestValueBadge && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-cyan-500/30 to-blue-500/30 text-cyan-200 border border-cyan-400/50 shadow-[0_0_12px_rgba(34,211,238,0.3)]">
                <Diamond className="w-2.5 h-2.5 fill-cyan-300 text-cyan-300" />
                Best Value
              </span>
            )}
          </div>
        </div>

        <p className="text-xs text-neutral-400 mb-4 min-h-[20px]">
          {plan.subtitle}
        </p>

        {/* Credits Summary Box */}
        <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-4 mb-5">
          <div className="flex items-center gap-2 mb-2 text-white font-bold text-sm">
            <div className="w-4 h-4 rounded-full bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300 shadow-[0_0_8px_rgba(168,85,247,0.3)]">
              <IndianRupee className="w-2.5 h-2.5 stroke-[2.5]" />
            </div>
            <span>
              {activeCreditOption
                ? `${activeCreditOption.credits.toLocaleString("en-IN")} credits/mo.`
                : plan.fixedCredits
                ? `${plan.fixedCredits.credits.toLocaleString("en-IN")} credits/mo.`
                : "No credits"}
            </span>
          </div>

          <div className="text-[11px] text-neutral-400 space-y-1 mb-3">
            <p>
              = {activeCreditOption
                ? activeCreditOption.nanoBananaGenerations.toLocaleString("en-IN")
                : plan.fixedCredits?.nanoBananaGenerations.toLocaleString("en-IN")}{" "}
              Nano Banana Pro Generations
            </p>
            <p>
              ~ {activeCreditOption
                ? activeCreditOption.seedanceVideos
                : plan.fixedCredits?.seedanceVideos}{" "}
              Seedance 2.0 Fast videos
            </p>
          </div>

          {/* Interactive Credit Slider / Selector if multiple options exist */}
          {plan.creditOptions && plan.creditOptions.length > 1 ? (
            <div className="pt-2 border-t border-white/[0.08]">
              <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 mb-1.5">
                <span className="flex items-center gap-1 text-neutral-300">
                  <Sliders className="w-3 h-3 text-purple-400" />
                  Select Credits:
                </span>
                <span className="font-bold text-white">
                  {activeCreditOption?.credits.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                {plan.creditOptions.map((opt, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedCreditIndex(i)}
                    className={cn(
                      "py-1 px-2 rounded-lg text-[10px] font-mono font-bold transition-all text-center border cursor-pointer",
                      selectedCreditIndex === i
                        ? plan.id === "pro"
                          ? "bg-[#d4ff00] text-black border-[#d4ff00] shadow-[0_0_12px_rgba(212,255,0,0.4)]"
                          : "bg-pink-500 text-white border-pink-400 shadow-[0_0_12px_rgba(236,72,153,0.4)]"
                        : "bg-white/[0.04] text-neutral-400 border-white/[0.08] hover:bg-white/[0.08] hover:text-white"
                    )}
                  >
                    {opt.credits.toLocaleString("en-IN")}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="pt-2 border-t border-white/[0.06] text-[11px] text-neutral-400 flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>{plan.fixedCredits?.label || "Fixed credits allotment"}</span>
            </div>
          )}
        </div>

        {/* Price Box */}
        <div className="mb-4">
          <div className="flex items-baseline gap-2">
            {originalPrice && originalPrice > currentPrice && (
              <span className="text-xl sm:text-2xl font-bold line-through text-rose-400/80 font-mono">
                ₹{originalPrice.toLocaleString("en-IN")}
              </span>
            )}
            <span className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight">
              ₹{currentPrice.toLocaleString("en-IN")}
            </span>
            <span className="text-xs text-neutral-400">
              per month, {billingCycle === "annual" ? "billed annually" : "billed monthly"}
            </span>
          </div>
        </div>

        {/* Class Queue Priority Badge */}
        {plan.classQueuePriority && (
          <div className="mb-4 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="text-left">
                <span className="text-[10px] uppercase font-mono font-bold text-neutral-400 block leading-tight">
                  Free Classes Priority
                </span>
                <span className="text-xs font-bold text-white">
                  {plan.classQueuePriority.label}
                </span>
              </div>
            </div>
            <span
              className={cn(
                "text-[10px] font-mono font-black px-2 py-0.5 rounded-full border",
                plan.classQueuePriority.boost >= 100
                  ? "bg-pink-500/20 text-pink-300 border-pink-500/40 shadow-[0_0_10px_rgba(244,63,94,0.3)]"
                  : plan.classQueuePriority.boost >= 50
                  ? "bg-[#d4ff00]/20 text-[#d4ff00] border-[#d4ff00]/40 shadow-[0_0_10px_rgba(212,255,0,0.3)]"
                  : plan.classQueuePriority.boost >= 10
                  ? "bg-purple-500/20 text-purple-300 border-purple-500/40"
                  : "bg-white/[0.04] text-neutral-400 border-white/[0.08]"
              )}
            >
              {plan.classQueuePriority.boost > 0
                ? `+${plan.classQueuePriority.boost} Boost`
                : "Standard"}
            </span>
          </div>
        )}

        {/* CTA Button */}
        <div className="mb-3">
          {onSelectPlan ? (
            <button
              type="button"
              onClick={() => {
                const creditsStr = activeCreditOption
                  ? `${activeCreditOption.credits.toLocaleString("en-IN")} credits/mo.`
                  : plan.fixedCredits
                  ? `${plan.fixedCredits.credits.toLocaleString("en-IN")} credits/mo.`
                  : "30 credits/mo."
                const priceStr = `₹${currentPrice.toLocaleString("en-IN")}/mo`
                onSelectPlan(plan.name, priceStr, creditsStr)
              }}
              className={cn(
                "w-full py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer text-center",
                plan.buttonStyle === "white" &&
                  "bg-white hover:bg-neutral-200 text-black shadow-lg shadow-white/10 hover:scale-[1.02] active:scale-[0.98]",
                plan.buttonStyle === "lime" &&
                  "bg-[#d4ff00] hover:bg-[#bce400] text-black shadow-[0_0_25px_rgba(212,255,0,0.35)] hover:shadow-[0_0_35px_rgba(212,255,0,0.5)] hover:scale-[1.02] active:scale-[0.98]",
                plan.buttonStyle === "magenta" &&
                  "bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white shadow-[0_0_30px_rgba(244,63,94,0.4)] hover:shadow-[0_0_40px_rgba(244,63,94,0.6)] hover:scale-[1.02] active:scale-[0.98]",
                plan.buttonStyle === "emerald" &&
                  "bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_0_25px_rgba(16,185,129,0.35)] hover:scale-[1.02] active:scale-[0.98]"
              )}
            >
              <span>{plan.buttonText}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <Link
              href={plan.buttonHref}
              className={cn(
                "w-full py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer text-center",
                plan.buttonStyle === "white" &&
                  "bg-white hover:bg-neutral-200 text-black shadow-lg shadow-white/10 hover:scale-[1.02] active:scale-[0.98]",
                plan.buttonStyle === "lime" &&
                  "bg-[#d4ff00] hover:bg-[#bce400] text-black shadow-[0_0_25px_rgba(212,255,0,0.35)] hover:shadow-[0_0_35px_rgba(212,255,0,0.5)] hover:scale-[1.02] active:scale-[0.98]",
                plan.buttonStyle === "magenta" &&
                  "bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white shadow-[0_0_30px_rgba(244,63,94,0.4)] hover:shadow-[0_0_40px_rgba(244,63,94,0.6)] hover:scale-[1.02] active:scale-[0.98]",
                plan.buttonStyle === "emerald" &&
                  "bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_0_25px_rgba(16,185,129,0.35)] hover:scale-[1.02] active:scale-[0.98]"
              )}
            >
              <span>{plan.buttonText}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
          <p className="text-[11px] text-center text-neutral-400 mt-2 min-h-[16px]">
            {billingCycle === "annual" && totalAnnualSavings > 0 ? (
              <span className="text-emerald-400 font-semibold">
                Save ₹{totalAnnualSavings.toLocaleString("en-IN")} compared to monthly
              </span>
            ) : (
              plan.noteBelowButton
            )}
          </p>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-white/[0.08] my-5" />

        {/* SECTION 1: Unlimited & Free Gens */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-3 text-[11px] font-bold text-neutral-300 uppercase tracking-wider">
            <div className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-neutral-400" />
              <span>UNLIMITED &amp; FREE GENS</span>
            </div>
            <span
              className="text-neutral-500 hover:text-neutral-300 cursor-pointer"
              title="Included generation models and speed limits"
            >
              <Info className="w-3.5 h-3.5" />
            </span>
          </div>

          <div className="space-y-2">
            {plan.unlimitedGens.map((gen, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between text-xs py-1 px-1.5 rounded-lg hover:bg-white/[0.02]"
              >
                <div className="flex items-center gap-2">
                  {gen.isAvailable ? (
                    <Check className="w-3.5 h-3.5 text-[#d4ff00]" />
                  ) : (
                    <XIcon className="w-3.5 h-3.5 text-neutral-600" />
                  )}
                  <span
                    className={cn(
                      gen.isAvailable ? "text-neutral-200" : "text-neutral-500"
                    )}
                  >
                    {gen.title}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {gen.resolution && (
                    <span className="px-1.5 py-0.5 rounded bg-white/[0.06] text-neutral-300 text-[10px] font-mono">
                      {gen.resolution}
                    </span>
                  )}
                  {gen.badge && (
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded text-[10px] font-bold font-mono",
                        gen.badge.includes("unlimited")
                          ? "bg-[#d4ff00]/20 text-[#d4ff00] border border-[#d4ff00]/30"
                          : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      )}
                    >
                      {gen.badge}
                    </span>
                  )}
                  {gen.statusText && (
                    <span className="text-[10px] text-neutral-500">
                      {gen.statusText}
                    </span>
                  )}
                </div>
              </div>
            ))}

            {plan.extraModelsCount && plan.extraModelsCount > 0 && (
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setIsExtraModelsOpen(!isExtraModelsOpen)}
                  className="w-full flex items-center justify-between text-[11px] font-medium text-emerald-400 hover:text-emerald-300 py-1 px-2 rounded-lg hover:bg-emerald-500/10 transition-colors cursor-pointer"
                >
                  <span>
                    + {plan.extraModelsCount} unlimited &amp; free generation models
                  </span>
                  <ChevronRight
                    className={cn(
                      "w-3 h-3 transition-transform",
                      isExtraModelsOpen && "rotate-90"
                    )}
                  />
                </button>

                <AnimatePresence>
                  {isExtraModelsOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-[10px] text-neutral-400 pl-4 py-2 space-y-1 bg-white/[0.02] rounded-lg mt-1 border border-white/[0.04]"
                    >
                      <p>• SDXL Turbo &amp; Lightning (Instant)</p>
                      <p>• Flux Schnell Fast Iteration</p>
                      <p>• Stable Video Diffusion 1.1</p>
                      <p>• Realistic Vision V6.0 High Res</p>
                      <p>• OpenAudio Sound FX &amp; Ambience</p>
                      <p>• Whisper V3 Large Audio Transcriptions</p>
                      <p>• PhotoLite Inpainting &amp; Background Eraser</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

        {/* SECTION 2: Seedance Models */}
        <div className="mb-5">
          <div
            className={cn(
              "rounded-2xl p-4 border transition-all",
              plan.seedanceSection.hasAccess
                ? "bg-gradient-to-br from-blue-950/40 via-blue-900/20 to-cyan-950/30 border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.15)]"
                : "bg-white/[0.02] border-white/[0.06]"
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "text-xs font-bold uppercase tracking-wider",
                    plan.seedanceSection.hasAccess
                      ? "text-cyan-300"
                      : "text-neutral-400"
                  )}
                >
                  {plan.seedanceSection.badgeTitle}
                </span>
              </div>
              <Activity
                className={cn(
                  "w-4 h-4",
                  plan.seedanceSection.hasAccess
                    ? "text-cyan-400"
                    : "text-neutral-600"
                )}
              />
            </div>
            <p className="text-[10px] text-neutral-400 mb-3">
              {plan.seedanceSection.badgeSubtitle}
            </p>

            <div className="space-y-2">
              {plan.seedanceSection.models.map((m, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-xs py-1"
                >
                  <div className="flex items-center gap-2">
                    <Activity className="w-3 h-3 text-cyan-400" />
                    <span
                      className={cn(
                        m.isAvailable ? "text-white font-medium" : "text-neutral-500"
                      )}
                    >
                      {m.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {m.resolution && (
                      <span className="px-1.5 py-0.5 rounded bg-white/10 text-neutral-300 text-[10px] font-mono font-bold">
                        {m.resolution}
                      </span>
                    )}
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded text-[10px] font-bold",
                        m.isAvailable
                          ? "bg-[#d4ff00]/20 text-[#d4ff00] border border-[#d4ff00]/30"
                          : "bg-neutral-800 text-neutral-500"
                      )}
                    >
                      {m.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {plan.parallelGens && (
          <div className="mb-5 text-[11px] text-neutral-400 bg-white/[0.02] border border-white/[0.06] p-2.5 rounded-xl flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>{plan.parallelGens}</span>
          </div>
        )}

        {/* SECTION 3: Celoris Ecosystem Perks (Universal in all tiers) */}
        <div className="pt-4 border-t border-white/[0.08]">
          <div className="flex items-center gap-1.5 mb-3 text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>INCLUDED CELORIS ECOSYSTEM PERKS</span>
          </div>

          <div className="space-y-2.5">
            {plan.ecosystemPerks.map((perk, i) => {
              const PerkIcon = perk.icon
              return (
                <div
                  key={i}
                  className={cn(
                    "p-2 rounded-xl transition-colors flex items-start gap-2.5",
                    perk.highlight
                      ? "bg-emerald-500/10 border border-emerald-500/20"
                      : "bg-white/[0.02] border border-white/[0.04]"
                  )}
                >
                  <div className="w-6 h-6 rounded-lg bg-white/[0.05] flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                    <PerkIcon className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white leading-tight">
                      {perk.title}
                    </p>
                    <p className="text-[10px] text-neutral-400 leading-snug mt-0.5">
                      {perk.desc}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
