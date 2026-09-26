"use client"

// Admin → Course reviews. Students' reviews wait here until approved; only
// approved reviews show on course pages. "Verified students" lets offline /
// WhatsApp-paid students review too (they need a Celoris account first).

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, BadgeCheck, Check, ExternalLink, Loader2, Star, Trash2, UserPlus, X } from "lucide-react"
import { REVIEW_REASON_LABEL, type ReviewVerifiedReason } from "@/lib/course-reviews"

type Status = "pending" | "approved" | "rejected"

interface AdminReview {
  id: string
  course_key: string
  course_title: string | null
  reviewer_name: string
  email: string | null
  rating: number
  review_text: string
  status: Status
  verified_reason: ReviewVerifiedReason
  admin_note: string | null
  updated_at: string
}

interface VerifiedStudent {
  user_id: string
  email: string | null
  note: string | null
  created_at: string
}

function coursePath(key: string): string | null {
  if (key.startsWith("learn-course:")) return null
  return `/${key}`
}

export default function AdminReviewsPage() {
  const [status, setStatus] = useState<Status>("pending")
  const [reviews, setReviews] = useState<AdminReview[]>([])
  const [students, setStudents] = useState<VerifiedStudent[]>([])
  const [counts, setCounts] = useState<Record<Status, number>>({ pending: 0, approved: 0, rejected: 0 })
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState("")
  const [note, setNote] = useState("")
  const [notice, setNotice] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/reviews?status=${status}`, { cache: "no-store" })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || "Could not load reviews")
      setReviews(data.reviews || [])
      setStudents(data.students || [])
      setCounts({ pending: 0, approved: 0, rejected: 0, ...(data.counts || {}) })
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

  const act = async (body: Record<string, unknown>, key: string) => {
    setBusy(key)
    setError(null)
    setNotice(null)
    try {
      const res = await fetch("/api/admin/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.error || "Action failed")
      await load()
      return true
    } catch (e: any) {
      setError(e.message)
      return false
    } finally {
      setBusy(null)
    }
  }

  const reject = (r: AdminReview) => {
    const reason = window.prompt("Reason shown to the student (optional):", "") ?? null
    if (reason === null) return
    act({ action: "reject", id: r.id, note: reason }, r.id)
  }

  const addStudent = async () => {
    if (!email.trim()) return
    const ok = await act({ action: "verify_student", email: email.trim(), note: note.trim() || null }, "add")
    if (ok) {
      setNotice(`${email.trim()} can now write reviews.`)
      setEmail("")
      setNote("")
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/admin/dashboard" className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800" title="Back to dashboard">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
              <Star className="w-6 h-6 text-amber-400 fill-current" /> Course reviews
            </h1>
            <p className="text-sm text-slate-400">
              Reviews from verified students. Nothing appears on a course page until you approve it.
            </p>
          </div>
        </div>

        {error && <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div>}
        {notice && (
          <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200 flex items-center gap-2">
            <Check className="w-4 h-4" /> {notice}
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {(["pending", "approved", "rejected"] as Status[]).map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`h-9 px-4 rounded-full text-sm font-semibold capitalize border ${
                status === s ? "bg-amber-500 text-black border-amber-500" : "border-slate-700 text-slate-300 hover:bg-slate-800"
              }`}
            >
              {s === "pending" ? "Waiting" : s} <span className="opacity-70">({counts[s] ?? 0})</span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-slate-500" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="rounded-xl border border-slate-700 bg-slate-800 p-8 text-center text-slate-400 text-sm">
            {status === "pending" ? "No reviews waiting. New ones appear here." : `No ${status} reviews.`}
          </div>
        ) : (
          <div className="space-y-3">
            {reviews.map((r) => {
              const path = coursePath(r.course_key)
              return (
                <div key={r.id} className="rounded-xl border border-slate-700 bg-slate-800 p-4 space-y-2">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-white flex flex-wrap items-center gap-2">
                        {r.reviewer_name}
                        <span className="text-xs font-normal text-slate-400">{r.email}</span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[11px] text-emerald-300">
                          <BadgeCheck className="w-3 h-3" /> {REVIEW_REASON_LABEL[r.verified_reason] || r.verified_reason}
                        </span>
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                        {r.course_title || r.course_key}
                        {path && (
                          <a href={path} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-white">
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                        <span className="text-slate-600">·</span>
                        {new Date(r.updated_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                      </p>
                    </div>
                    <span className="inline-flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} className={`w-4 h-4 ${i <= r.rating ? "text-yellow-400 fill-current" : "text-slate-600"}`} />
                      ))}
                    </span>
                  </div>
                  <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-line">{r.review_text}</p>
                  {r.status === "rejected" && r.admin_note && <p className="text-xs text-rose-300">Reason given: {r.admin_note}</p>}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {r.status !== "approved" && (
                      <button
                        onClick={() => act({ action: "approve", id: r.id }, r.id)}
                        disabled={busy === r.id}
                        className="h-8 px-3 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold inline-flex items-center gap-1.5 disabled:opacity-50"
                      >
                        <Check className="w-3.5 h-3.5" /> Approve
                      </button>
                    )}
                    {r.status !== "rejected" && (
                      <button
                        onClick={() => reject(r)}
                        disabled={busy === r.id}
                        className="h-8 px-3 rounded-md border border-slate-600 hover:bg-slate-700 text-slate-200 text-xs font-semibold inline-flex items-center gap-1.5 disabled:opacity-50"
                      >
                        <X className="w-3.5 h-3.5" /> {r.status === "approved" ? "Unpublish" : "Reject"}
                      </button>
                    )}
                    <button
                      onClick={() => {
                        if (window.confirm("Delete this review permanently?")) act({ action: "delete", id: r.id }, r.id)
                      }}
                      disabled={busy === r.id}
                      className="h-8 px-3 rounded-md text-rose-300 hover:bg-rose-500/10 text-xs font-semibold inline-flex items-center gap-1.5 disabled:opacity-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Verified students */}
        <div className="rounded-xl border border-slate-700 bg-slate-800 p-4 space-y-3">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-sky-300" /> Verified students
            </h2>
            <p className="text-xs text-slate-400">
              People who attend a live class, have a paid plan or pass an exam can review automatically. Add anyone else you have
              taught (for example offline, or paid on WhatsApp) by their Celoris account email.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@email.com"
              className="h-9 flex-1 min-w-[200px] px-3 rounded-md bg-slate-900 border border-slate-700 text-sm text-white"
            />
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Note (e.g. Video editing batch, Aug 2026)"
              className="h-9 flex-1 min-w-[200px] px-3 rounded-md bg-slate-900 border border-slate-700 text-sm text-white"
            />
            <button
              onClick={addStudent}
              disabled={busy === "add" || !email.trim()}
              className="h-9 px-4 rounded-md bg-sky-600 hover:bg-sky-500 text-white text-sm font-bold disabled:opacity-50 inline-flex items-center gap-1.5"
            >
              {busy === "add" ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />} Add
            </button>
          </div>
          {students.length > 0 && (
            <div className="divide-y divide-slate-700/70">
              {students.map((s) => (
                <div key={s.user_id} className="flex items-center justify-between gap-3 py-2 text-sm">
                  <div className="min-w-0">
                    <span className="text-white">{s.email || s.user_id}</span>
                    {s.note && <span className="ml-2 text-xs text-slate-400">{s.note}</span>}
                  </div>
                  <button
                    onClick={() => act({ action: "unverify_student", userId: s.user_id }, s.user_id)}
                    disabled={busy === s.user_id}
                    className="text-xs text-slate-400 hover:text-rose-300"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
