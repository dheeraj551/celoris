"use client"

import { useState } from "react"
import { Crown, Search, Loader2 } from "lucide-react"

// Admin: set a member's plan after their payment is confirmed. The plan gives
// them priority in free-class queues (Max > Pro > Basic > Free) and held
// seats for the first minutes of each class.

const PLANS = [
  { id: "free", label: "Free" },
  { id: "basic", label: "Basic (+10 priority)" },
  { id: "pro", label: "Pro (+50 priority)" },
  { id: "max", label: "Max VIP (+100 priority)" },
]

export function MembershipPlanCard() {
  const [email, setEmail] = useState("")
  const [plan, setPlan] = useState("basic")
  const [expires, setExpires] = useState(() => {
    const d = new Date()
    d.setMonth(d.getMonth() + 1)
    return d.toISOString().slice(0, 10)
  })
  const [note, setNote] = useState("")
  const [current, setCurrent] = useState<string | null>(null)
  const [busy, setBusy] = useState<"lookup" | "save" | null>(null)
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null)

  const lookup = async () => {
    if (!email.trim()) return
    setBusy("lookup")
    setMessage(null)
    try {
      const res = await fetch(`/api/admin/plans?email=${encodeURIComponent(email.trim())}`, { cache: "no-store" })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) {
        setCurrent(null)
        setMessage({ ok: false, text: body.error || "Not found" })
      } else {
        const exp = body.expires_at ? ` until ${new Date(body.expires_at).toLocaleDateString()}` : ""
        const expired = body.expires_at && Date.parse(body.expires_at) < Date.now()
        setCurrent(`${body.plan_tier}${exp}${expired ? " (expired)" : ""}`)
        if (body.plan_tier && body.plan_tier !== "free") setPlan(body.plan_tier)
      }
    } catch {
      setMessage({ ok: false, text: "Could not reach the server." })
    } finally {
      setBusy(null)
    }
  }

  const save = async () => {
    if (!email.trim()) return
    setBusy("save")
    setMessage(null)
    try {
      const res = await fetch("/api/admin/plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          planTier: plan,
          expiresAt: plan === "free" || !expires ? null : new Date(`${expires}T23:59:59`).toISOString(),
          note,
        }),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) setMessage({ ok: false, text: body.error || "Could not save." })
      else {
        setMessage({ ok: true, text: `Saved: ${email.trim()} is now on ${plan.toUpperCase()}.` })
        setCurrent(plan)
      }
    } catch {
      setMessage({ ok: false, text: "Could not reach the server." })
    } finally {
      setBusy(null)
    }
  }

  const field = "h-10 px-3 rounded-md bg-slate-900 border border-slate-700 text-white text-sm"

  return (
    <div className="rounded-xl bg-slate-800 border border-slate-700 p-6 mb-8">
      <div className="flex items-center gap-2 mb-1">
        <Crown className="w-5 h-5 text-amber-400" />
        <h2 className="text-white font-semibold">Membership plans</h2>
      </div>
      <p className="text-sm text-slate-400 mb-4">
        After confirming a payment, set the member's plan here. Members get priority in the free-class waiting lines and held seats for late arrivals.
      </p>
      <div className="grid gap-3 md:grid-cols-[2fr_1.3fr_1fr_1.5fr_auto]">
        <div className="flex gap-2">
          <input className={`${field} flex-1`} type="email" placeholder="member@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          <button onClick={lookup} disabled={!!busy || !email.trim()} className="h-10 px-3 rounded-md bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-50" title="Check current plan">
            {busy === "lookup" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          </button>
        </div>
        <select className={field} value={plan} onChange={(e) => setPlan(e.target.value)}>
          {PLANS.map((p) => (
            <option key={p.id} value={p.id}>{p.label}</option>
          ))}
        </select>
        <input className={field} type="date" value={expires} onChange={(e) => setExpires(e.target.value)} disabled={plan === "free"} title="Valid until" />
        <input className={field} placeholder="Note (e.g. UPI ref)" value={note} onChange={(e) => setNote(e.target.value)} />
        <button onClick={save} disabled={!!busy || !email.trim()} className="h-10 px-4 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold disabled:opacity-50">
          {busy === "save" ? "Saving..." : "Save plan"}
        </button>
      </div>
      <div className="mt-3 text-sm">
        {current && <span className="text-slate-300 mr-3">Current plan: <b className="capitalize">{current}</b></span>}
        {message && <span className={message.ok ? "text-emerald-400" : "text-red-400"}>{message.text}</span>}
      </div>
    </div>
  )
}

export default MembershipPlanCard
