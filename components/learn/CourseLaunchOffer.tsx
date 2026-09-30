"use client"

// The enrollment card on a course page's notice board, driven by live data:
//  • while a launch offer is open → "FREE PASS" for the first N students, a
//    ticket strip showing passes left, and a real countdown to the deadline
//  • once passes run out or the deadline passes → the regular fee plus a
//    "book 1 free demo class" button
// Numbers refresh on their own (see useCourseBatch) and the card switches
// state the second the countdown reaches zero. Nothing here is invented:
// the deadline, passes and fee all come from the course in the database.

import React, { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { CourseInquiryDialog } from "@/components/CourseInquiryDialog"
import { inr, istFullDate, istTime, offerIsOpen, type CourseBatchInfo } from "@/lib/course-batch-types"

const POLL_MS = 45_000

/** Live batch figures for a course, refreshed every ~45 s and when the tab comes back. */
export function useCourseBatch(courseKey: string, initial: CourseBatchInfo | null) {
  const [batch, setBatch] = useState<CourseBatchInfo | null>(initial)
  const busy = useRef(false)

  const refresh = useCallback(async () => {
    if (busy.current || !courseKey) return
    busy.current = true
    try {
      const res = await fetch(`/api/courses/batch?course=${encodeURIComponent(courseKey)}`, { cache: "no-store" })
      if (res.ok) setBatch(await res.json())
    } catch {
      // keep the last figures
    } finally {
      busy.current = false
    }
  }, [courseKey])

  useEffect(() => {
    if (!initial) refresh()
    const t = setInterval(() => {
      if (document.visibilityState === "visible") refresh()
    }, POLL_MS)
    const onVis = () => document.visibilityState === "visible" && refresh()
    document.addEventListener("visibilitychange", onVis)
    return () => {
      clearInterval(t)
      document.removeEventListener("visibilitychange", onVis)
    }
  }, [refresh, initial])

  return { batch, refresh }
}

/** Ticks once a second after mount (null during server render, so no hydration mismatch). */
function useNow() {
  const [now, setNow] = useState<number | null>(null)
  useEffect(() => {
    setNow(Date.now())
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])
  return now
}

const css = `
  .lo-card { text-align: center; }
  .lo-eyebrow { display:flex; align-items:center; justify-content:center; gap:6px; font-family:'Space Mono',monospace; font-size:9px; letter-spacing:2px; text-transform:uppercase; color:#d64541; font-weight:700; margin-bottom:10px; }
  .lo-live { width:7px; height:7px; border-radius:50%; background:#ef6a5f; box-shadow:0 0 0 0 rgba(239,106,95,.6); animation: lo-ping 1.6s infinite; }
  @keyframes lo-ping { 0%{box-shadow:0 0 0 0 rgba(239,106,95,.55)} 80%,100%{box-shadow:0 0 0 7px rgba(239,106,95,0)} }
  .lo-price { display:flex; align-items:baseline; justify-content:center; gap:10px; }
  .lo-free { font-family:'Space Mono',monospace; font-size:30px; font-weight:700; color:var(--navy,#1c2340); line-height:1; letter-spacing:-1px; }
  .lo-was { font-family:'Space Mono',monospace; font-size:14px; color:#ef6a5f; text-decoration:line-through; text-decoration-thickness:2px; opacity:.85; }
  .lo-sub { font-size:12px; color:#241c14; opacity:.7; margin-top:4px; }
  .lo-tickets { display:flex; justify-content:center; gap:4px; margin:12px 0 6px; flex-wrap:wrap; }
  .lo-ticket { width:17px; height:24px; border-radius:3px; position:relative; background:#f5a623; box-shadow: inset 0 -2px 0 rgba(0,0,0,.12); animation: lo-bob 2.4s ease-in-out infinite; }
  .lo-ticket::before, .lo-ticket::after { content:""; position:absolute; left:-3px; top:50%; width:6px; height:6px; margin-top:-3px; border-radius:50%; background:#faf6ee; }
  .lo-ticket::after { left:auto; right:-3px; }
  .lo-ticket.gone { background:#d8d0bd; animation:none; opacity:.7; }
  .lo-ticket.gone span { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; font-size:10px; color:#6b6252; font-weight:700; }
  @keyframes lo-bob { 0%,100%{ transform:translateY(0) } 50%{ transform:translateY(-2px) } }
  .lo-left { font-size:12.5px; font-weight:700; color:#1c2340; }
  .lo-left b { color:#d64541; font-family:'Space Mono',monospace; font-size:15px; }
  .lo-clock { display:flex; justify-content:center; gap:6px; margin:12px 0 4px; }
  .lo-unit { background:#1c2340; border-radius:6px; min-width:44px; padding:6px 4px 4px; box-shadow: 0 3px 0 rgba(0,0,0,.25); }
  .lo-unit b { display:block; font-family:'Space Mono',monospace; font-size:19px; line-height:1; color:#f5a623; font-variant-numeric: tabular-nums; }
  .lo-unit i { display:block; font-style:normal; font-size:8px; letter-spacing:1.5px; color:rgba(250,246,238,.6); margin-top:3px; }
  .lo-unit.urgent b { color:#ef6a5f; }
  .lo-deadline { font-size:11px; color:#241c14; opacity:.7; margin-bottom:12px; }
  .lo-note { font-size:10.5px; color:#241c14; opacity:.6; margin-top:9px; line-height:1.45; }
  .lo-chip { display:inline-block; font-family:'Space Mono',monospace; font-size:9px; font-weight:700; letter-spacing:.5px; padding:3px 8px; border-radius:3px; background:#1c2340; color:#faf6ee; margin-bottom:10px; }
  .lo-livebar { display:flex; align-items:center; justify-content:center; gap:6px; margin:-4px 0 10px; font-size:11.5px; font-weight:700; color:#fff; background:#d64541; border-radius:6px; padding:5px 8px; }
  @media (prefers-reduced-motion: reduce) { .lo-ticket, .lo-live { animation:none; } }
`

function Countdown({ endsAt, now }: { endsAt: string; now: number | null }) {
  const left = now === null ? null : Math.max(0, Date.parse(endsAt) - now)
  const parts =
    left === null
      ? [null, null, null, null]
      : [Math.floor(left / 86_400_000), Math.floor((left / 3_600_000) % 24), Math.floor((left / 60_000) % 60), Math.floor((left / 1000) % 60)]
  const labels = ["DAYS", "HRS", "MIN", "SEC"]
  const urgent = left !== null && left < 3 * 3_600_000
  return (
    <div className="lo-clock" role="timer" aria-label="Time left to claim a free pass">
      {parts.map((v, i) => (
        <div key={labels[i]} className={`lo-unit${urgent ? " urgent" : ""}`}>
          <b>{v === null ? "--" : String(v).padStart(2, "0")}</b>
          <i>{labels[i]}</i>
        </div>
      ))}
    </div>
  )
}

export function LaunchOfferCard({
  course,
  batch,
  onChanged,
}: {
  course: { id: string; title: string; price?: number | null }
  batch: CourseBatchInfo | null
  onChanged?: () => void
}) {
  const now = useNow()
  const price = batch?.price ?? (Number(course.price) > 0 ? Number(course.price) : 0)
  const offer = batch?.offer || null
  const open = offerIsOpen(offer, now ?? Date.now()) && (offer?.active ?? false)
  const batchLabel = batch?.batchNumber ? `Batch #${batch.batchNumber}` : "this batch"

  // When the clock hits zero, pull fresh figures so the card flips state.
  const flipped = useRef(false)
  useEffect(() => {
    if (!offer || flipped.current || now === null) return
    if (Date.parse(offer.endsAt) <= now) {
      flipped.current = true
      onChanged?.()
    }
  }, [now, offer, onChanged])

  const liveBar = batch?.isLive ? (
    <Link href="/classrooms?tab=cafe" className="lo-livebar">
      <span className="lo-live" style={{ background: "#fff" }} /> Class is live now — join the classroom
    </Link>
  ) : null

  const btn =
    "w-full h-12 text-sm font-bold bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white rounded-xl shadow-md"

  // No launch offer and a free course → the simple free card.
  if (!offer && price === 0) {
    return (
      <div className="lo-card">
        <style dangerouslySetInnerHTML={{ __html: css }} />
        {liveBar}
        <div className="lo-free">FREE</div>
        <div className="lo-sub">Live group classes · ₹0</div>
        <div style={{ marginTop: 14 }}>
          <CourseInquiryDialog courseTitle={course.title} courseId={course.id} intent="enroll" buttonText="Join the free group batch" buttonClassName={btn} onSubmitted={onChanged} />
        </div>
      </div>
    )
  }

  if (open && offer) {
    return (
      <div className="lo-card">
        <style dangerouslySetInnerHTML={{ __html: css }} />
        {liveBar}
        <div className="lo-eyebrow">
          <span className="lo-live" /> Launch offer · {batchLabel}
        </div>
        <div className="lo-price">
          <span className="lo-free">FREE PASS</span>
          {price > 0 && <span className="lo-was">{inr(price)}</span>}
        </div>
        <div className="lo-sub">Full course free for the first {offer.passes} students</div>

        <div className="lo-tickets" aria-hidden>
          {Array.from({ length: offer.passes }).map((_, i) =>
            i < offer.claimed ? (
              <div key={i} className="lo-ticket gone">
                <span>✓</span>
              </div>
            ) : (
              <div key={i} className="lo-ticket" style={{ animationDelay: `${(i % 5) * 0.18}s` }} />
            )
          )}
        </div>
        <div className="lo-left" aria-live="polite">
          <b>{offer.left}</b> of {offer.passes} free passes left
        </div>

        <Countdown endsAt={offer.endsAt} now={now} />
        <div className="lo-deadline">
          Offer closes when {batchLabel} starts · <strong>{istFullDate(offer.endsAt)}, {istTime(offer.endsAt)} IST</strong>
        </div>

        <CourseInquiryDialog
          courseTitle={course.title}
          courseId={course.id}
          intent="pass"
          buttonText="Claim my free pass →"
          buttonClassName={btn}
          onSubmitted={onChanged}
        />
        <div className="lo-note">
          Sign in and upload your student ID to claim.
          {price > 0 ? <> After the offer: {inr(price)} — or try 1 free demo class first.</> : null}
        </div>
      </div>
    )
  }

  // Offer over (or never had one) on a paid course.
  const soldOut = !!offer && offer.left === 0
  return (
    <div className="lo-card">
      <style dangerouslySetInnerHTML={{ __html: css }} />
      {liveBar}
      {offer && <div className="lo-chip">{soldOut ? `ALL ${offer.passes} FREE PASSES CLAIMED` : "LAUNCH OFFER ENDED"}</div>}
      <div className="lo-price">
        <span className="lo-free">{inr(price)}</span>
      </div>
      <div className="lo-sub">Full course · live online classes</div>
      <div style={{ marginTop: 14 }}>
        <CourseInquiryDialog
          courseTitle={course.title}
          courseId={course.id}
          intent="demo"
          buttonText="Book 1 free demo class"
          buttonClassName={btn}
          onSubmitted={onChanged}
        />
      </div>
      <div className="lo-note">Try one live class free before you decide.</div>
    </div>
  )
}
