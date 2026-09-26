"use client"

// Verified student reviews for a course page.
//
// Anyone can read approved reviews. Only real Celoris students can write one
// (attended a live class, paid plan, passed an exam, or marked as a student
// by an admin) and every review is checked by the Celoris team before it
// appears. See app/api/reviews/route.ts.

import React, { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { BadgeCheck, Loader2, PenLine, Star } from "lucide-react"
import { REVIEW_MAX_CHARS, REVIEW_MIN_CHARS, reviewDate, type PublicReview, type ReviewSummary } from "@/lib/course-reviews"

interface MeState {
  signedIn: boolean
  eligible?: boolean
  myReview?: { rating: number; text: string; status: "pending" | "approved" | "rejected"; note: string | null } | null
}

type Theme = "dark" | "light"

const T: Record<Theme, Record<string, string>> = {
  dark: {
    wrap: "space-y-6",
    h2: "text-3xl font-black text-white italic uppercase tracking-tighter",
    sub: "text-sm text-slate-400",
    card: "bg-[#0d1321]/40 border border-white/5 rounded-[2rem] p-6 shadow-2xl",
    name: "text-white font-bold",
    meta: "text-[11px] text-slate-500",
    text: "text-slate-300 leading-relaxed",
    muted: "text-slate-400",
    box: "rounded-[2rem] border border-white/10 bg-[#0d1321]/60 p-6",
    input: "w-full rounded-2xl bg-black/40 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-400",
    btn: "inline-flex items-center gap-2 rounded-full bg-purple-600 hover:bg-purple-500 px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50",
    ghost: "inline-flex items-center gap-2 rounded-full border border-white/15 hover:bg-white/5 px-5 py-2.5 text-sm font-semibold text-slate-200",
    badge: "text-emerald-300",
    link: "text-purple-300 hover:text-purple-200 font-semibold underline",
    starOff: "text-slate-700",
  },
  light: {
    wrap: "space-y-5",
    h2: "text-2xl font-bold text-foreground",
    sub: "text-sm text-slate-500",
    card: "bg-white border border-slate-100 rounded-2xl p-5 shadow-sm",
    name: "text-sm font-bold text-slate-800",
    meta: "text-xs text-slate-400",
    text: "text-sm text-slate-600 leading-relaxed",
    muted: "text-slate-500",
    box: "rounded-2xl border border-slate-200 bg-slate-50 p-5",
    input: "w-full rounded-xl bg-white border border-slate-200 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500",
    btn: "inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50",
    ghost: "inline-flex items-center gap-2 rounded-xl border border-slate-200 hover:bg-slate-100 px-5 py-2.5 text-sm font-semibold text-slate-700",
    badge: "text-emerald-600",
    link: "text-emerald-700 hover:text-emerald-600 font-semibold underline",
    starOff: "text-slate-200",
  },
}

function Stars({ value, size = "w-4 h-4", off }: { value: number; size?: string; off: string }) {
  return (
    <span className="inline-flex gap-0.5" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={`${size} ${i <= Math.floor(value + 0.25) ? "text-yellow-400 fill-current" : off}`} />
      ))}
    </span>
  )
}

export function CourseReviews({
  courseKey,
  courseTitle,
  theme = "dark",
  heading = "Verified Student Reviews",
}: {
  courseKey: string
  courseTitle: string
  theme?: Theme
  heading?: string
}) {
  const c = T[theme]
  const [reviews, setReviews] = useState<PublicReview[]>([])
  const [summary, setSummary] = useState<ReviewSummary>({ count: 0, average: null })
  const [me, setMe] = useState<MeState>({ signedIn: false })
  const [loading, setLoading] = useState(true)
  const [showAll, setShowAll] = useState(false)

  const [formOpen, setFormOpen] = useState(false)
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [text, setText] = useState("")
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null)

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/reviews?course=${encodeURIComponent(courseKey)}`, { cache: "no-store" })
      const data = await res.json()
      if (!res.ok) throw new Error()
      setReviews(data.reviews || [])
      setSummary(data.summary || { count: 0, average: null })
      setMe(data.me || { signedIn: false })
      if (data.me?.myReview) {
        setRating(data.me.myReview.rating)
        setText(data.me.myReview.text)
      }
    } catch {
      // Leave the section quiet if reviews can't load.
    } finally {
      setLoading(false)
    }
  }, [courseKey])

  useEffect(() => {
    load()
  }, [load])

  const submit = async () => {
    if (saving) return
    if (rating < 1) return setMessage({ ok: false, text: "Please choose a star rating." })
    if (text.trim().length < REVIEW_MIN_CHARS) {
      return setMessage({ ok: false, text: `Please write at least ${REVIEW_MIN_CHARS} characters.` })
    }
    setSaving(true)
    setMessage(null)
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseKey, courseTitle, rating, text }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.error || "Could not save your review.")
      setMessage({ ok: true, text: "Thank you! Your review will appear here once the Celoris team has checked it." })
      setFormOpen(false)
      await load()
    } catch (e: any) {
      setMessage({ ok: false, text: e.message })
    } finally {
      setSaving(false)
    }
  }

  const visible = showAll ? reviews : reviews.slice(0, 6)
  const mine = me.myReview

  return (
    <section className={c.wrap} id="reviews">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className={c.h2}>{heading}</h2>
          <p className={`${c.sub} mt-1 flex items-center gap-1.5`}>
            <BadgeCheck className={`w-4 h-4 ${c.badge}`} />
            Written by real Celoris students and checked by our team.
          </p>
        </div>
        {summary.count > 0 && summary.average !== null && (
          <div className="flex items-center gap-2">
            <Stars value={summary.average} size="w-5 h-5" off={c.starOff} />
            <span className={`text-sm font-bold ${theme === "dark" ? "text-white" : "text-slate-800"}`}>{summary.average.toFixed(1)}</span>
            <span className={`text-xs ${c.muted}`}>
              ({summary.count} review{summary.count === 1 ? "" : "s"})
            </span>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-6">
          <Loader2 className={`w-6 h-6 animate-spin ${c.muted}`} />
        </div>
      ) : reviews.length === 0 ? (
        <p className={`text-sm ${c.muted}`}>No verified reviews yet. Students who join a class can be the first to share their experience.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {visible.map((r) => (
            <div key={r.id} className={c.card}>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <p className={c.name}>{r.name}</p>
                  <p className={`${c.meta} flex items-center gap-1 mt-0.5`}>
                    <BadgeCheck className={`w-3.5 h-3.5 ${c.badge}`} />
                    Verified · {r.verifiedLabel} · {reviewDate(r.createdAt)}
                  </p>
                </div>
                <Stars value={r.rating} off={c.starOff} />
              </div>
              <p className={c.text}>&ldquo;{r.text}&rdquo;</p>
            </div>
          ))}
        </div>
      )}
      {reviews.length > 6 && (
        <button type="button" onClick={() => setShowAll((s) => !s)} className={c.ghost}>
          {showAll ? "Show fewer" : `Show all ${reviews.length} reviews`}
        </button>
      )}

      {/* Write a review */}
      {!loading && (
        <div className={c.box}>
          {!me.signedIn ? (
            <p className={`text-sm ${c.muted}`}>
              Studied with Celoris?{" "}
              <Link href="/login" className={c.link}>
                Sign in
              </Link>{" "}
              to review this course.
            </p>
          ) : !me.eligible && !mine ? (
            <p className={`text-sm ${c.muted}`}>
              Reviews are open to Celoris students. Join a free live class in{" "}
              <Link href="/classrooms" className={c.link}>
                Classrooms
              </Link>{" "}
              and you can review right after.
            </p>
          ) : !formOpen ? (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className={`text-sm ${c.muted}`}>
                {mine?.status === "pending" && "Your review is waiting for approval by the Celoris team."}
                {mine?.status === "approved" && "Thanks for your review! You can update it any time."}
                {mine?.status === "rejected" && (
                  <>Your review wasn't published{mine.note ? `: ${mine.note}` : "."} You can edit and send it again.</>
                )}
                {!mine && "You're a verified Celoris student — share your experience with this course."}
              </div>
              <button type="button" onClick={() => setFormOpen(true)} className={c.btn}>
                <PenLine className="w-4 h-4" />
                {mine ? "Edit your review" : "Write a review"}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-1" onMouseLeave={() => setHover(0)}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setRating(i)}
                    onMouseEnter={() => setHover(i)}
                    aria-label={`${i} star${i === 1 ? "" : "s"}`}
                    className="p-0.5"
                  >
                    <Star className={`w-7 h-7 ${i <= (hover || rating) ? "text-yellow-400 fill-current" : c.starOff}`} />
                  </button>
                ))}
              </div>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value.slice(0, REVIEW_MAX_CHARS))}
                rows={4}
                placeholder="What did you learn? How were the trainer and the classes? Would you recommend it?"
                className={c.input}
              />
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className={`text-xs ${c.muted}`}>
                  {text.trim().length}/{REVIEW_MAX_CHARS} · Phone numbers, emails and links are removed.
                </span>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setFormOpen(false)} className={c.ghost}>
                    Cancel
                  </button>
                  <button type="button" onClick={submit} disabled={saving} className={c.btn}>
                    {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                    {mine ? "Send updated review" : "Send review"}
                  </button>
                </div>
              </div>
            </div>
          )}
          {message && (
            <p className={`mt-3 text-sm ${message.ok ? c.badge : "text-rose-400"}`}>{message.text}</p>
          )}
        </div>
      )}
    </section>
  )
}
