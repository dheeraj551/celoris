"use client"

// Admin → Users: award, change or remove a member's plan.
// A new paid plan (or an upgrade) adds that tier's monthly credits right away
// and then every month until the plan ends. Changing only the end date, or
// moving down a tier, keeps the current monthly cycle. All of that happens on
// the server (admin_set_user_plan_by_id); this dialog only explains it.

import { useEffect, useMemo, useState } from "react"
import { Crown, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { PLAN_RANK, type PlanTier } from "@/lib/plan-features"

export interface MemberPlan {
  user_id: string
  plan_tier: PlanTier
  expires_at: string | null
  next_credit_grant_at: string | null
  note?: string | null
}

export interface TierInfo {
  tier: PlanTier
  label: string
  monthlyCredits: number
}

export const TIER_STYLE: Record<PlanTier, string> = {
  free: "bg-slate-700 text-slate-300",
  basic: "bg-sky-500/15 text-sky-300 border border-sky-500/30",
  pro: "bg-lime-400/15 text-lime-300 border border-lime-400/30",
  max: "bg-fuchsia-500/15 text-fuchsia-300 border border-fuchsia-500/30",
}

/** The plan someone has right now (expired → free). */
export function activeTier(p: MemberPlan | undefined | null): PlanTier {
  if (!p || p.plan_tier === "free") return "free"
  if (p.expires_at && Date.parse(p.expires_at) <= Date.now()) return "free"
  return p.plan_tier
}

const DURATIONS = [
  { id: "1", label: "1 month", months: 1 },
  { id: "3", label: "3 months", months: 3 },
  { id: "6", label: "6 months", months: 6 },
  { id: "12", label: "12 months", months: 12 },
  { id: "none", label: "No end date", months: 0 },
  { id: "custom", label: "Pick a date…", months: 0 },
]

function addMonths(months: number) {
  const d = new Date()
  d.setMonth(d.getMonth() + months)
  d.setHours(23, 59, 59, 0)
  return d
}

function fmtDate(iso: string | Date) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
}

export function SetPlanDialog({
  open,
  onOpenChange,
  member,
  current,
  tiers,
  onSaved,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  member: { id: string; name: string } | null
  current: MemberPlan | null
  tiers: TierInfo[]
  onSaved: (result: { plan: MemberPlan; creditsAdded: number; walletBalance: number | null }) => void
}) {
  const [tier, setTier] = useState<PlanTier>("basic")
  const [duration, setDuration] = useState("1")
  const [customDate, setCustomDate] = useState("")
  const [note, setNote] = useState("")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const nowTier = activeTier(current)

  useEffect(() => {
    if (!open) return
    setTier(nowTier === "free" ? "basic" : nowTier)
    setDuration("1")
    setCustomDate(addMonths(1).toISOString().slice(0, 10))
    setNote("")
    setError(null)
  }, [open, nowTier])

  const expiresAt: Date | null = useMemo(() => {
    if (tier === "free") return null
    if (duration === "none") return null
    if (duration === "custom") return customDate ? new Date(`${customDate}T23:59:59`) : null
    const d = DURATIONS.find((x) => x.id === duration)
    return addMonths(d?.months || 1)
  }, [tier, duration, customDate])

  const info = tiers.find((t) => t.tier === tier)
  const isUpgrade = tier !== "free" && PLAN_RANK[tier] > PLAN_RANK[nowTier]

  const preview = (() => {
    if (tier === "free") {
      return nowTier === "free" ? "They're already on Free." : "Removes their paid plan now. Credits already in their wallet stay."
    }
    const until = expiresAt ? `until ${fmtDate(expiresAt)}` : "with no end date"
    if (isUpgrade) {
      return info && info.monthlyCredits > 0
        ? `Adds ${info.monthlyCredits.toLocaleString("en-IN")} credits now, then ${info.monthlyCredits.toLocaleString("en-IN")} every month ${until}.`
        : `Unlocks ${info?.label || tier} ${until}. This tier has no monthly credits.`
    }
    const next = current?.next_credit_grant_at ? ` Next monthly credits: ${fmtDate(current.next_credit_grant_at)}.` : ""
    return `Keeps their current monthly cycle ${until}.${next}`
  })()

  const save = async () => {
    if (!member) return
    if (tier !== "free" && duration === "custom" && (!expiresAt || expiresAt.getTime() <= Date.now())) {
      setError("Pick an end date in the future.")
      return
    }
    setSaving(true)
    setError(null)
    try {
      const res = await fetch("/api/admin/plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: member.id,
          planTier: tier,
          expiresAt: expiresAt ? expiresAt.toISOString() : null,
          note,
        }),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(body.error || "Could not save the plan.")
      onSaved({
        plan: {
          user_id: member.id,
          plan_tier: body.plan_tier,
          expires_at: body.expires_at,
          next_credit_grant_at: body.next_credit_grant_at,
        },
        creditsAdded: Number(body.credits_added) || 0,
        walletBalance: body.wallet_balance === null || body.wallet_balance === undefined ? null : Number(body.wallet_balance),
      })
      onOpenChange(false)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  const field = "h-10 w-full px-3 rounded-md bg-slate-900 border border-slate-700 text-white text-sm"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-amber-400" /> Plan for {member?.name || "member"}
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Now on{" "}
            <span className={`inline-flex px-2 py-0.5 rounded text-xs font-semibold capitalize ${TIER_STYLE[nowTier]}`}>{nowTier}</span>
            {nowTier !== "free" && current?.expires_at ? ` until ${fmtDate(current.expires_at)}` : ""}
            {nowTier === "free" && current && current.plan_tier !== "free" ? " (previous plan expired)" : ""}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div>
            <label className="text-xs text-slate-400">Plan</label>
            <div className="mt-1 grid grid-cols-4 gap-2">
              {(["free", "basic", "pro", "max"] as PlanTier[]).map((t) => {
                const ti = tiers.find((x) => x.tier === t)
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTier(t)}
                    className={`rounded-lg border px-2 py-2 text-sm font-semibold transition-colors ${
                      tier === t ? "border-amber-400 bg-amber-400/10 text-white" : "border-slate-700 text-slate-300 hover:bg-slate-700/50"
                    }`}
                  >
                    {ti?.label || t}
                    {t !== "free" && ti && (
                      <span className="block text-[10px] font-normal text-slate-400">{ti.monthlyCredits.toLocaleString("en-IN")} cr/mo</span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {tier !== "free" && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400">Duration</label>
                <select className={`${field} mt-1`} value={duration} onChange={(e) => setDuration(e.target.value)}>
                  {DURATIONS.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400">Ends on</label>
                {duration === "custom" ? (
                  <input type="date" className={`${field} mt-1`} value={customDate} onChange={(e) => setCustomDate(e.target.value)} />
                ) : (
                  <div className={`${field} mt-1 flex items-center text-slate-300`}>{expiresAt ? fmtDate(expiresAt) : "Never"}</div>
                )}
              </div>
            </div>
          )}

          <div>
            <label className="text-xs text-slate-400">Note (optional)</label>
            <input
              className={`${field} mt-1`}
              placeholder="e.g. UPI ref 4521… / scholarship winner"
              value={note}
              onChange={(e) => setNote(e.target.value.slice(0, 300))}
            />
          </div>

          <p className="rounded-lg bg-slate-900/60 border border-slate-700 px-3 py-2 text-xs text-slate-300">{preview}</p>
          {error && <p className="text-sm text-red-400">{error}</p>}
        </div>

        <DialogFooter>
          <button
            onClick={() => onOpenChange(false)}
            className="h-10 px-4 rounded-md text-slate-300 hover:bg-slate-700 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={save}
            disabled={saving || !member || (tier === "free" && nowTier === "free")}
            className="h-10 px-4 rounded-md bg-amber-500 hover:bg-amber-400 text-black text-sm font-bold disabled:opacity-50 inline-flex items-center gap-2"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {tier === "free" ? "Remove plan" : "Save plan"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default SetPlanDialog
