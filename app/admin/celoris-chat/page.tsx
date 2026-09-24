"use client"

// Admin → Celoris Chat reports.
// Admins only ever see conversations that someone reported (the last 30
// messages saved with the report) — there is no way to browse other chats.

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Ban, CheckCircle2, Flag, RefreshCw, RotateCcw, XCircle } from "lucide-react"

interface PersonInfo {
  id: string
  name: string
  email: string | null
  isBanned: boolean
  banReason?: string | null
}
interface Report {
  id: string
  reason: string
  details: string | null
  snapshot: { from: "reporter" | "reported"; name: string; body: string; at: string }[]
  status: "open" | "action_taken" | "dismissed"
  admin_note: string | null
  reviewed_at: string | null
  created_at: string
  reporter: PersonInfo
  reported: PersonInfo
}

const REASON_LABEL: Record<string, string> = {
  sharing_contacts: "Asking for contact details",
  selling_outside: "Deals / classes outside Celoris",
  harassment: "Harassment",
  inappropriate: "Inappropriate messages",
  spam: "Spam",
  other: "Other",
}

export default function AdminCelorisChatPage() {
  const [status, setStatus] = useState<"open" | "action_taken" | "dismissed" | "all">("open")
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [notes, setNotes] = useState<Record<string, string>>({})

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/celoris-chat/reports?status=${status}`, { cache: "no-store" })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || "Failed to load reports")
      setReports(data.reports || [])
      setError(null)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [status])

  useEffect(() => {
    load()
  }, [load])

  const act = async (id: string, body: Record<string, any>) => {
    const res = await fetch(`/api/admin/celoris-chat/reports/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, note: notes[id] ?? undefined }),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      alert(data?.error || "Action failed")
      return
    }
    load()
  }

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-200 px-4 md:px-8 py-8">
      <div className="max-w-5xl mx-auto">
        <Link href="/admin/dashboard" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white">
          <ArrowLeft className="w-4 h-4" /> Admin dashboard
        </Link>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-extrabold text-white">Celoris Chat reports</h1>
            <p className="text-sm text-slate-400 mt-1">
              Only reported conversations are visible here (the last 30 messages saved when the report was made).
            </p>
          </div>
          <div className="flex items-center gap-2">
            {(["open", "action_taken", "dismissed", "all"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold ${status === s ? "bg-sky-600 text-white" : "bg-white/5 text-slate-300 hover:bg-white/10"}`}
              >
                {s === "action_taken" ? "Action taken" : s[0].toUpperCase() + s.slice(1)}
              </button>
            ))}
            <button onClick={load} className="p-2 rounded-lg bg-white/5 hover:bg-white/10" title="Refresh">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {error && <p className="mt-6 text-rose-300 text-sm">{error}</p>}
        {loading && <p className="mt-6 text-slate-400 text-sm">Loading…</p>}
        {!loading && !error && reports.length === 0 && (
          <div className="mt-10 text-center text-slate-400">
            <Flag className="w-8 h-8 mx-auto mb-2 text-slate-600" />
            No {status === "all" ? "" : status.replace("_", " ")} reports.
          </div>
        )}

        <div className="mt-6 space-y-5">
          {reports.map((r) => (
            <div key={r.id} className="rounded-2xl border border-white/10 bg-[#0d121c] p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <span className="inline-block text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/15 text-amber-300">
                    {REASON_LABEL[r.reason] || r.reason}
                  </span>
                  <p className="mt-2 text-sm">
                    <span className="text-slate-400">Reported:</span>{" "}
                    <span className="font-bold text-white">{r.reported.name}</span>{" "}
                    <span className="text-slate-500">{r.reported.email}</span>
                    {r.reported.isBanned && <span className="ml-2 text-xs font-bold text-rose-400">CHAT PAUSED</span>}
                  </p>
                  <p className="text-sm">
                    <span className="text-slate-400">By:</span> <span className="text-slate-200">{r.reporter.name}</span>{" "}
                    <span className="text-slate-500">{r.reporter.email}</span>
                  </p>
                  {r.details && <p className="mt-2 text-sm text-slate-300 italic">“{r.details}”</p>}
                </div>
                <div className="text-right text-xs text-slate-500">
                  <p>{new Date(r.created_at).toLocaleString()}</p>
                  <p className="mt-1 font-bold uppercase">{r.status.replace("_", " ")}</p>
                </div>
              </div>

              <div className="mt-4 max-h-72 overflow-y-auto rounded-xl bg-black/30 border border-white/5 p-3 space-y-1.5">
                {r.snapshot.length === 0 ? (
                  <p className="text-xs text-slate-500">No messages between them at the time of the report.</p>
                ) : (
                  r.snapshot.map((m, i) => (
                    <div key={i} className={`flex ${m.from === "reporter" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[75%] rounded-xl px-3 py-1.5 text-sm ${
                          m.from === "reporter" ? "bg-sky-900/60 text-sky-50" : "bg-rose-950/60 text-rose-50"
                        }`}
                      >
                        <p className="text-[10px] opacity-60">
                          {m.name} · {new Date(m.at).toLocaleString()}
                        </p>
                        <p className="whitespace-pre-wrap break-words">{m.body}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <textarea
                value={notes[r.id] ?? r.admin_note ?? ""}
                onChange={(e) => setNotes((n) => ({ ...n, [r.id]: e.target.value }))}
                placeholder="Admin note (optional)"
                rows={2}
                className="mt-3 w-full resize-none rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none focus:border-sky-500/50"
              />

              <div className="mt-3 flex flex-wrap gap-2">
                {r.reported.isBanned ? (
                  <button
                    onClick={() => act(r.id, { ban: false })}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-sm font-semibold"
                  >
                    <RotateCcw className="w-4 h-4" /> Restore chat access
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      if (confirm(`Pause Celoris Chat for ${r.reported.name}? They won't be able to send messages or requests.`)) {
                        act(r.id, { ban: true, status: "action_taken", banReason: REASON_LABEL[r.reason] || r.reason })
                      }
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-sm font-bold"
                  >
                    <Ban className="w-4 h-4" /> Pause their chat
                  </button>
                )}
                <button
                  onClick={() => act(r.id, { status: "action_taken" })}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold"
                >
                  <CheckCircle2 className="w-4 h-4" /> Mark handled
                </button>
                <button
                  onClick={() => act(r.id, { status: "dismissed" })}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-sm font-semibold"
                >
                  <XCircle className="w-4 h-4" /> Dismiss
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
