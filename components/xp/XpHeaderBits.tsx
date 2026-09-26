"use client"

// XP in the header: a pill next to Credits, and a row in the account menu.
// Both open the XP panel (balance, total earned, level, chest, check-in,
// convert). The numbers come from the XP layer, so nothing extra is fetched.

import React from "react"
import { Zap } from "lucide-react"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { fmtXp } from "@/lib/xp-shared"
import { openXpPanel, useXpSummary } from "@/lib/xp-client"

export function XpHeaderPill({ className = "" }: { className?: string }) {
  const xp = useXpSummary()
  if (!xp) return null
  return (
    <button
      type="button"
      onClick={openXpPanel}
      title="Your XP — tap for details"
      aria-label={`Your XP: ${fmtXp(xp.balanceXp)}, level ${xp.level}. Open XP details`}
      className={`group relative items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-b from-lime-400/[0.12] to-lime-400/[0.04] hover:from-lime-400/[0.2] hover:to-lime-400/[0.08] backdrop-blur-2xl border border-lime-300/30 hover:border-lime-300/60 text-xs font-medium shadow-[0_4px_16px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.18)] transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] cursor-pointer select-none ${className}`}
    >
      <span className="w-4 h-4 rounded-full bg-lime-400/20 border border-lime-300/50 flex items-center justify-center text-lime-300 group-hover:scale-110 transition-transform">
        <Zap className="w-2.5 h-2.5 stroke-[2.5]" />
      </span>
      <span className="font-mono font-bold text-white tracking-tight tabular-nums">{fmtXp(xp.balanceXp)}</span>
      <span className="text-[10px] font-semibold text-lime-300 uppercase tracking-wider">XP</span>
      <span className="ml-0.5 rounded-md bg-white/[0.08] px-1 py-px text-[9px] font-bold text-slate-300">Lv {xp.level}</span>
      {xp.chestFull && <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-amber-300 animate-ping" />}
    </button>
  )
}

/** Account-menu row. Place it inside the dropdown content. */
export function XpMenuRow() {
  const xp = useXpSummary()
  if (!xp) return null
  return (
    <DropdownMenuItem
      onSelect={() => openXpPanel()}
      className="mx-0.5 mb-2 p-2 rounded-xl bg-gradient-to-r from-lime-400/[0.10] via-lime-400/[0.05] to-transparent hover:from-lime-400/[0.16] focus:from-lime-400/[0.16] border border-lime-300/25 hover:border-lime-300/40 transition-all flex items-center justify-between cursor-pointer"
    >
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-lg bg-lime-400/20 border border-lime-300/40 flex items-center justify-center text-lime-300">
          <Zap className="w-3 h-3 stroke-[2.5]" />
        </div>
        <div>
          <p className="text-[10px] text-neutral-400 leading-none font-medium">Your XP · Level {xp.level}</p>
          <p className="text-xs font-mono font-bold text-white leading-tight mt-0.5">
            {fmtXp(xp.balanceXp)} <span className="text-[9px] font-sans font-semibold text-lime-300">XP</span>
            <span className="ml-1.5 text-[9px] font-sans font-medium text-neutral-400">{fmtXp(xp.lifetimeXp)} earned in total</span>
          </p>
        </div>
      </div>
      <span className="text-[10px] font-semibold text-lime-300 px-2 py-0.5 rounded-md bg-lime-400/20 border border-lime-300/30">View →</span>
    </DropdownMenuItem>
  )
}
