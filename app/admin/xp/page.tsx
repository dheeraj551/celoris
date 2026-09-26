"use client"

// Admin → XP: how members earn XP and turn it into credits, plus the numbers
// to keep an eye on. Changes apply immediately (the rules are read by the
// database functions on every action).

import { useCallback, useEffect, useState, type ReactNode } from "react"
import Link from "next/link"
import { ArrowLeft, Check, Coins, Flame, Gift, Loader2, Save, Sparkles, Trophy, Users } from "lucide-react"
import { DEFAULT_XP_RULES, fmtXp, levelInfo, type XpRules } from "@/lib/xp-shared"

interface Stats {
  membersWithXp: number
  xpEarnedThisMonth: number
  creditsConvertedThisMonth: number
}
interface TopMember {
  userId: string
  name: string
  lifetimeXp: number
  balanceXp: number
  streakDays: number
}

export default function AdminXpPage() {
  const [rules, setRules] = useState<XpRules | null>(null)
  const [savedJson, setSavedJson] = useState("")
  const [stats, setStats] = useState<Stats | null>(null)
  const [top, setTop] = useState<TopMember[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/xp-settings", { cache: "no-store" })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || "Could not load XP settings")
      setRules(data.rules)
      setSavedJson(JSON.stringify(data.rules))
      setStats(data.stats)
      setTop(data.top || [])
      setError(null)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const dirty = !!rules && JSON.stringify(rules) !== savedJson

  const save = async () => {
    if (!rules) return
    setSaving(true)
    setNotice(null)
    try {
      const res = await fetch("/api/admin/xp-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rules }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || "Save failed")
      setRules(data.rules)
      setSavedJson(JSON.stringify(data.rules))
      setNotice("Saved. The new rules apply right away.")
    } catch (e: any) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  const set = <K extends keyof XpRules>(key: K, value: XpRules[K]) => setRules((r) => (r ? { ...r, [key]: value } : r))
  const field = "h-9 w-24 px-2 rounded-md bg-slate-900 border border-slate-700 text-white text-center"

  // What 1,000 XP is worth in rupees, for context (₹500 → 450 credits).
  const rupeesPerCredit = 500 / 450

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <Link href="/admin/users" className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800" title="Back to users">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-lime-300" /> XP settings
              </h1>
              <p className="text-sm text-slate-400">How members earn XP and turn it into credits.</p>
            </div>
          </div>
          <button
            onClick={save}
            disabled={!dirty || saving}
            className="h-10 px-4 rounded-md bg-lime-400 hover:bg-lime-300 text-black text-sm font-bold disabled:opacity-40 inline-flex items-center gap-2"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {dirty ? "Save changes" : "Saved"}
          </button>
        </div>

        {error && <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div>}
        {notice && (
          <div className="mb-4 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200 flex items-center gap-2">
            <Check className="w-4 h-4" /> {notice}
          </div>
        )}

        {loading || !rules ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-slate-500" />
          </div>
        ) : (
          <div className="grid gap-6">
            {stats && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Stat icon={<Users className="w-4 h-4" />} label="Members with XP" value={fmtXp(stats.membersWithXp)} />
                <Stat icon={<Sparkles className="w-4 h-4" />} label="XP earned this month" value={fmtXp(stats.xpEarnedThisMonth)} />
                <Stat
                  icon={<Coins className="w-4 h-4" />}
                  label="Credits converted this month"
                  value={`${fmtXp(stats.creditsConvertedThisMonth)} (≈ ₹${fmtXp(stats.creditsConvertedThisMonth * rupeesPerCredit)})`}
                />
              </div>
            )}

            <Section title="Active time" icon={<Gift className="w-4 h-4 text-amber-300" />}>
              <Row label="XP per active minute" help="Only while the tab is visible and the member clicked/typed/scrolled in the last 2 minutes.">
                <input type="number" min={0} max={10} className={field} value={rules.active_minute_xp} onChange={(e) => set("active_minute_xp", Number(e.target.value))} />
              </Row>
              <Row label="Daily limit from active time" help="Most XP one member can earn from active minutes in a day (India time).">
                <input type="number" min={0} className={field} value={rules.active_daily_cap} onChange={(e) => set("active_daily_cap", Number(e.target.value))} />
              </Row>
              <Row label="Chest size" help="Active-minute XP collects in a chest; when full, the member taps Claim. Also proves a real person is there.">
                <input type="number" min={1} className={field} value={rules.chest_size} onChange={(e) => set("chest_size", Number(e.target.value))} />
              </Row>
            </Section>

            <Section title="Daily check-in" icon={<Flame className="w-4 h-4 text-orange-400" />}>
              <p className="text-xs text-slate-400 mb-3">XP for each day of the streak. After the last day the cycle starts again (the streak count keeps growing).</p>
              <div className="flex flex-wrap gap-2">
                {rules.checkin_rewards.map((r, i) => (
                  <label key={i} className="text-center">
                    <span className="block text-[11px] text-slate-400">Day {i + 1}</span>
                    <input
                      type="number"
                      min={0}
                      value={r}
                      onChange={(e) => {
                        const next = rules.checkin_rewards.slice()
                        next[i] = Number(e.target.value)
                        set("checkin_rewards", next)
                      }}
                      className="h-9 w-16 px-1 rounded-md bg-slate-900 border border-slate-700 text-white text-center"
                    />
                  </label>
                ))}
              </div>
            </Section>

            <Section title="Plan bonus" icon={<Trophy className="w-4 h-4 text-fuchsia-300" />}>
              <p className="text-xs text-slate-400 mb-3">Multiplies chests, check-ins and activity rewards (not the daily limit).</p>
              <div className="flex flex-wrap gap-4">
                {(["free", "basic", "pro", "max"] as const).map((t) => (
                  <label key={t} className="text-center">
                    <span className="block text-[11px] text-slate-400 capitalize">{t}</span>
                    <input
                      type="number"
                      step={0.1}
                      min={0}
                      max={10}
                      value={rules.multipliers[t]}
                      onChange={(e) => set("multipliers", { ...rules.multipliers, [t]: Number(e.target.value) })}
                      className="h-9 w-20 px-1 rounded-md bg-slate-900 border border-slate-700 text-white text-center"
                    />
                  </label>
                ))}
              </div>
            </Section>

            <Section title="Turning XP into credits" icon={<Coins className="w-4 h-4 text-yellow-300" />}>
              <Row
                label="XP for 1 credit"
                help={`At ${fmtXp(rules.credit_rate_xp)} XP, 1,000 XP ≈ ₹${((1000 / Math.max(1, rules.credit_rate_xp)) * rupeesPerCredit).toFixed(2)}.`}
              >
                <input type="number" min={1} className={field} value={rules.credit_rate_xp} onChange={(e) => set("credit_rate_xp", Number(e.target.value))} />
              </Row>
              <Row
                label="Monthly limit per member (credits)"
                help={`Worst case ≈ ₹${fmtXp(rules.monthly_convert_cap_credits * rupeesPerCredit)} per member per month.`}
              >
                <input type="number" min={0} className={field} value={rules.monthly_convert_cap_credits} onChange={(e) => set("monthly_convert_cap_credits", Number(e.target.value))} />
              </Row>
              <Row label="Account must be at least (days)" help="Stops brand-new accounts from farming and converting.">
                <input type="number" min={0} className={field} value={rules.convert_min_account_days} onChange={(e) => set("convert_min_account_days", Number(e.target.value))} />
              </Row>
            </Section>

            <Section title="“Did you know?” tips" icon={<Sparkles className="w-4 h-4 text-amber-300" />}>
              <Row label="Show tips to members" help="Up to 3 short tips a day, never on studio / chat pages. Visitors always see a few sign-up tips.">
                <button
                  onClick={() => set("tips_enabled", !rules.tips_enabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${rules.tips_enabled ? "bg-emerald-500" : "bg-slate-600"}`}
                >
                  <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${rules.tips_enabled ? "translate-x-5" : "translate-x-0.5"}`} />
                </button>
              </Row>
            </Section>

            <button
              onClick={() => setRules({ ...DEFAULT_XP_RULES })}
              className="justify-self-start text-xs text-slate-500 hover:text-slate-300"
            >
              Reset everything to the original settings (not saved until you press Save)
            </button>

            {top.length > 0 && (
              <Section title="Top members" icon={<Trophy className="w-4 h-4 text-amber-300" />}>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-slate-400 text-xs">
                      <th className="py-1">Member</th>
                      <th className="py-1">Level</th>
                      <th className="py-1">Earned</th>
                      <th className="py-1">Balance</th>
                      <th className="py-1">Streak</th>
                    </tr>
                  </thead>
                  <tbody>
                    {top.map((t) => (
                      <tr key={t.userId} className="border-t border-slate-700/60">
                        <td className="py-1.5">{t.name}</td>
                        <td className="py-1.5">{levelInfo(t.lifetimeXp).level}</td>
                        <td className="py-1.5">{fmtXp(t.lifetimeXp)}</td>
                        <td className="py-1.5">{fmtXp(t.balanceXp)}</td>
                        <td className="py-1.5">{t.streakDays}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Section>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function Stat({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
      <p className="text-xs text-slate-400 flex items-center gap-1.5">
        {icon} {label}
      </p>
      <p className="mt-1 text-xl font-bold text-white">{value}</p>
    </div>
  )
}

function Section({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800 p-5">
      <h2 className="text-white font-semibold flex items-center gap-2 mb-3">
        {icon} {title}
      </h2>
      <div className="grid gap-3">{children}</div>
    </div>
  )
}

function Row({ label, help, children }: { label: string; help: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm text-white">{label}</p>
        <p className="text-xs text-slate-400">{help}</p>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}
