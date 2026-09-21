"use client"

import React from "react"
import { Check, X as XIcon, IndianRupee } from "lucide-react"
import { cn } from "@/lib/utils"

interface FeatureRow {
  name: string
  free: string | boolean
  basic: string | boolean
  pro: string | boolean
  max: string | boolean
  highlight?: boolean
}

interface FeatureCategory {
  title: string
  rows: FeatureRow[]
}

const COMPARISON_DATA: FeatureCategory[] = [
  {
    title: "AI Credits & Quota",
    rows: [
      { name: "Monthly Credits", free: "30 / mo", basic: "120 / mo", pro: "600 – 900 / mo", max: "1,800 – 5,400 / mo" },
      { name: "Nano Banana Pro Generations", free: "15 gens", basic: "60 gens", pro: "300 – 450 gens", max: "900 – 2,700 gens" },
      { name: "Seedance 2.0 Fast Videos", free: "~ 2 test clips", basic: "~ 7 videos", pro: "~ 27 – 40 videos", max: "~ 80 – 240 videos" },
      { name: "Parallel Generations", free: "1 task", basic: "2 tasks", pro: "4 tasks", max: "3 videos & 8 images" },
      { name: "Credit Roll-over", free: false, basic: true, pro: true, max: true },
    ]
  },
  {
    title: "AI Video & Image Generation Models",
    rows: [
      { name: "Higgsfield Genjutsu", free: "480p preview", basic: "Standard", pro: "720p (3 free gens)", max: "720p (3 free gens)" },
      { name: "Nano Banana Pro", free: "Standard queue", basic: "Standard queue", pro: "Credit based", max: "2K (7-day unlimited)", highlight: true },
      { name: "Nano Banana 2", free: "Standard queue", basic: "Standard queue", pro: "2K (7-day unlimited)", max: "2K (7-day unlimited)", highlight: true },
      { name: "Kling 3.0", free: "Standard queue", basic: "Standard queue", pro: "7-day unlimited", max: "7-day unlimited", highlight: true },
      { name: "+ 7 Extra Unlimited AI Models", free: false, basic: false, pro: true, max: true },
      { name: "Watermark-Free Exports", free: true, basic: true, pro: true, max: true },
      { name: "GPU Render Priority", free: "Standard", basic: "Fast", pro: "Turbo Priority", max: "Ultra Dedicated" },
    ]
  },
  {
    title: "Seedance Video Models",
    rows: [
      { name: "Seedance 2.0 (4K)", free: false, basic: "Credit based", pro: "4K Full Access", max: "4K Full Access", highlight: true },
      { name: "Seedance 2.5 (1080p)", free: false, basic: false, pro: "1080p Full Access", max: "1080p Full Access", highlight: true },
    ]
  },
  {
    title: "100% Free Online Classes (Included in All Plans)",
    rows: [
      { name: "Free Classes Queue Priority", free: "Standard (0 Boost)", basic: "10 Boost", pro: "50 Boost", max: "100 Boost (VIP)", highlight: true },
      { name: "Web Development Bootcamp", free: true, basic: true, pro: true, max: true, highlight: true },
      { name: "Digital Marketing Mastery", free: true, basic: true, pro: true, max: true, highlight: true },
      { name: "AI Web Dev & Prompt Engineering", free: true, basic: true, pro: true, max: true, highlight: true },
      { name: "Master YouTube Shorts & Reels", free: true, basic: true, pro: true, max: true, highlight: true },
      { name: "Copilot Excel & Office AI", free: true, basic: true, pro: true, max: true, highlight: true },
      { name: "Course Completion Certificate", free: true, basic: true, pro: true, max: true },
      { name: "Live Instructor AMA / Workshops", free: "Chat view", basic: "Chat view", pro: "Priority Q&A", max: "1-on-1 Guidance" },
    ]
  },
  {
    title: "100% Free Job Portal & Career (Included in All Plans)",
    rows: [
      { name: "Browse Verified Tech & Creative Jobs", free: true, basic: true, pro: true, max: true, highlight: true },
      { name: "Apply with 0% Middleman Commission", free: true, basic: true, pro: true, max: true, highlight: true },
      { name: "Direct Client Contact", free: true, basic: true, pro: true, max: true },
      { name: "Applicant Badge Status", free: "Standard", basic: "Verified Applicant", pro: "Featured Talent", max: "Certified Spotlight" },
    ]
  },
  {
    title: "Celoris Ecosystem & Studios",
    rows: [
      { name: "PhotoLite AI Online Image Editor", free: true, basic: true, pro: true, max: true },
      { name: "Video Studio Timeline Editor", free: "Basic", basic: "Pro", pro: "Pro 4K", max: "Pro 4K" },
      { name: "PolyVault 3D Meshes & Textures", free: "Standard", basic: "Standard", pro: "Full Library", max: "Full 4K Vault" },
      { name: "Celoris Café Community Lounges", free: true, basic: true, pro: true, max: true },
      { name: "Celoris TV 24/7 Creator Channel", free: true, basic: true, pro: true, max: true },
      { name: "Commercial Usage License", free: "Personal / Non-commercial", basic: "Full Commercial", pro: "Full Commercial", max: "Full Commercial" },
      { name: "Customer Assistance", free: "Community Support", basic: "Standard Email", pro: "Priority Email & Chat", max: "24/7 VIP Concierge" },
    ]
  }
]

export function PricingComparisonTable() {
  const renderCell = (val: string | boolean) => {
    if (typeof val === "boolean") {
      return val ? (
        <Check className="w-4 h-4 text-emerald-400 mx-auto" />
      ) : (
        <XIcon className="w-4 h-4 text-neutral-600 mx-auto" />
      )
    }
    return <span className="text-xs text-neutral-200 font-mono font-medium">{val}</span>
  }

  return (
    <div className="w-full overflow-x-auto rounded-3xl border border-white/[0.1] bg-[#090a0f]/90 backdrop-blur-2xl shadow-2xl">
      <table className="w-full text-left border-collapse min-w-[700px]">
        <thead>
          <tr className="border-b border-white/[0.1] bg-white/[0.02]">
            <th className="py-4 px-6 text-sm font-bold text-white w-2/5">
              Features &amp; Perks
            </th>
            <th className="py-4 px-4 text-center text-xs font-mono font-bold text-emerald-400 w-[15%]">
              FREE
            </th>
            <th className="py-4 px-4 text-center text-xs font-mono font-bold text-neutral-200 w-[15%]">
              BASIC
            </th>
            <th className="py-4 px-4 text-center text-xs font-mono font-bold text-[#d4ff00] w-[15%]">
              PRO
            </th>
            <th className="py-4 px-4 text-center text-xs font-mono font-bold text-pink-400 w-[15%]">
              MAX
            </th>
          </tr>
        </thead>
        <tbody>
          {COMPARISON_DATA.map((category, catIdx) => (
            <React.Fragment key={catIdx}>
              <tr className="bg-white/[0.04] border-t border-b border-white/[0.08]">
                <td
                  colSpan={5}
                  className="py-2.5 px-6 text-xs font-mono font-bold uppercase tracking-wider text-purple-300"
                >
                  <div className="flex items-center gap-2">
                    <IndianRupee className="w-3 h-3 text-purple-400 stroke-[2.5]" />
                    <span>{category.title}</span>
                  </div>
                </td>
              </tr>
              {category.rows.map((row, rowIdx) => (
                <tr
                  key={rowIdx}
                  className={cn(
                    "border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors",
                    row.highlight && "bg-white/[0.015]"
                  )}
                >
                  <td className="py-3 px-6 text-xs text-neutral-300 font-medium">
                    {row.name}
                  </td>
                  <td className="py-3 px-4 text-center">{renderCell(row.free)}</td>
                  <td className="py-3 px-4 text-center">{renderCell(row.basic)}</td>
                  <td className="py-3 px-4 text-center">{renderCell(row.pro)}</td>
                  <td className="py-3 px-4 text-center">{renderCell(row.max)}</td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  )
}
