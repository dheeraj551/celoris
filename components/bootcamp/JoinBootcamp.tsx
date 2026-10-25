"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { ArrowRight, Calendar, CheckCircle2, Loader2, Share2 } from "lucide-react"
import { useAuth } from "@/components/providers/AuthProvider"
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton"
import {
    APPLICATION_MAX_CHARS,
    APPLICATION_MIN_CHARS,
    APPLICATION_QUESTION,
    MIN_ATTENDANCE,
    SESSIONS,
    currentBatchStart,
    examInstant,
    getBootcamp,
    sessionInstants,
} from "@/lib/bootcamps"

// Apply for a free bootcamp seat: Google sign-in, one short question and a WhatsApp
// number. Free seats go to selected applicants; the team marks them "selected".
// The batch date is decided on the server.

interface Props {
    slug: string
    shortTitle: string
    batchLabel: string
    scheduleLabel?: string
}

type Status = { enrolled: boolean; selected?: boolean; batchLabel?: string; batchStart?: string; moved?: boolean }

export function JoinBootcamp({ slug, shortTitle, batchLabel, scheduleLabel }: Props) {
    const { user, loading } = useAuth()
    const [status, setStatus] = useState<Status | null>(null)
    const [phone, setPhone] = useState("")
    const [answer, setAnswer] = useState("")
    const [consent, setConsent] = useState(true)
    const [busy, setBusy] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const here = `/free-courses-with-certificate/${slug}`

    useEffect(() => {
        if (!user) return
        let cancelled = false
        fetch(`/api/bootcamps/enroll?slug=${encodeURIComponent(slug)}`)
            .then((r) => (r.ok ? r.json() : { enrolled: false }))
            .then((d) => !cancelled && setStatus({ enrolled: !!d.enrolled, selected: !!d.selected, batchLabel: d.batchLabel, batchStart: d.batchStart }))
            .catch(() => !cancelled && setStatus({ enrolled: false }))
        return () => {
            cancelled = true
        }
    }, [user, slug])

    const submit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (busy) return
        const reply = answer.replace(/\s+/g, " ").trim()
        if (reply.length < APPLICATION_MIN_CHARS) {
            setError("Tell us in one line what you will do with this skill (at least 20 characters).")
            return
        }
        const digits = phone.replace(/\D/g, "").slice(-10)
        if (!/^[6-9]\d{9}$/.test(digits)) {
            setError("Enter a valid 10-digit WhatsApp number.")
            return
        }
        if (!consent) {
            setError("Please allow class reminders on WhatsApp, so you get the live class link on time.")
            return
        }
        setBusy(true)
        setError(null)
        try {
            const res = await fetch("/api/bootcamps/enroll", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ slug, whatsapp: digits, consent, answer: reply }),
            })
            const data = await res.json().catch(() => ({}))
            if (!res.ok) throw new Error(data?.error || "Could not send your application right now. Please try again.")
            setStatus({ enrolled: true, selected: false, batchLabel: data.batchLabel, batchStart: data.batchStart, moved: !!data.movedToNextBatch })
            try {
                (window as any).gtag?.("event", "bootcamp_join", { bootcamp: slug })
            } catch {}
            try {
                // Meta Pixel standard event, only fires if the pixel is on the site.
                (window as any).fbq?.("track", "SubmitApplication", { content_name: slug })
            } catch {}
        } catch (err: any) {
            setError(err.message)
        } finally {
            setBusy(false)
        }
    }

    if (loading || (user && !status)) {
        return (
            <div className="flex h-12 items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin text-emerald-400" />
            </div>
        )
    }

    if (!user) {
        return (
            <div className="space-y-3">
                <div className="w-full sm:w-[320px]">
                    <GoogleSignInButton text="signup_with" oneTap oneTapDelayMs={5000} hideWhenSignedIn redirectTo={here}>
                        <Link
                            href={`/login?next=${encodeURIComponent(here)}`}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-black transition hover:bg-emerald-400"
                        >
                            Apply for a Free Seat (₹1,500 value)
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </GoogleSignInButton>
                </div>
                <p className="text-xs text-neutral-400">
                    Sign in with Google and answer one short question. We pick the students for the free seats. Next batch: {batchLabel}.
                </p>
            </div>
        )
    }

    if (status?.enrolled && !status.selected) {
        const shareText = encodeURIComponent(
            `I just applied for a free seat in the ${shortTitle} live course with certificate on Celoris (worth ₹1,500). Only a few free seats, and they pick who gets them. Apply here: https://celorisdesigns.com/free-courses-with-certificate/${slug}`
        )
        return (
            <div className="space-y-4">
                <div className="flex items-start gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                    <div className="text-sm text-neutral-200">
                        <p className="font-semibold text-white">Application received for the {shortTitle} batch starting {status.batchLabel || batchLabel}.</p>
                        {status.moved && (
                            <p className="mt-1 text-amber-300/90">All free seats in the current batch are already given, so your application is for the next batch.</p>
                        )}
                        <p className="mt-1 text-neutral-300">
                            Our team reads every application and picks the students for the free seats. If you&apos;re selected, we&apos;ll send you a
                            WhatsApp message with the class link before Class 1. If you&apos;re not picked this time, we&apos;ll tell you about the next batch.
                        </p>
                    </div>
                </div>
                <a
                    href={`https://api.whatsapp.com/send?text=${shareText}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/15 hover:bg-emerald-500/25 px-4 py-2 text-xs font-semibold text-emerald-300 transition-all shadow-sm"
                >
                    <Share2 className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Tell a friend to apply</span>
                </a>
            </div>
        )
    }

    if (status?.enrolled) {
        const bootcamp = getBootcamp(slug)
        const batchStart = bootcamp ? status.batchStart || currentBatchStart(new Date(), bootcamp) : ""
        const sessions = bootcamp ? sessionInstants(bootcamp, batchStart) : []
        const exam = bootcamp ? examInstant(bootcamp, batchStart) : null
        const stamp = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")
        const calTitle = encodeURIComponent(`Celoris Live Bootcamp: ${shortTitle} (Class 1)`)
        const calDetails = encodeURIComponent(
            `Live class for ${shortTitle}.\nSchedule: ${scheduleLabel || "8:00 PM IST"}.\nAttend live, there are no recordings. Attend at least ${MIN_ATTENDANCE} of the ${SESSIONS} classes and pass the final exam to earn your certificate.\nJoin from Celoris Classrooms: https://celorisdesigns.com/classrooms`
        )
        const first = sessions[0]
        const calendarUrl = first
            ? `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${calTitle}&details=${calDetails}&location=${encodeURIComponent("https://celorisdesigns.com/classrooms")}&dates=${stamp(first)}/${stamp(new Date(first.getTime() + 60 * 60 * 1000))}`
            : `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${calTitle}&details=${calDetails}`
        // All 4 sessions in one file (works with Google, Apple and Outlook calendars).
        const downloadIcs = () => {
            const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Celoris//Bootcamp//EN", "CALSCALE:GREGORIAN"]
            sessions.forEach((d, i) => {
                lines.push(
                    "BEGIN:VEVENT",
                    `UID:${slug}-${stamp(d)}@celorisdesigns.com`,
                    `DTSTAMP:${stamp(new Date())}`,
                    `DTSTART:${stamp(d)}`,
                    `DTEND:${stamp(new Date(d.getTime() + 60 * 60 * 1000))}`,
                    `SUMMARY:Celoris ${shortTitle} bootcamp, class ${i + 1} of ${sessions.length}`,
                    "LOCATION:https://celorisdesigns.com/classrooms",
                    "DESCRIPTION:Live class in Celoris Classrooms. No recordings, please join on time.",
                    "BEGIN:VALARM",
                    "TRIGGER:-PT30M",
                    "ACTION:DISPLAY",
                    "DESCRIPTION:Your Celoris class starts in 30 minutes",
                    "END:VALARM",
                    "END:VEVENT"
                )
            })
            if (exam) {
                lines.push(
                    "BEGIN:VEVENT",
                    `UID:${slug}-exam-${stamp(exam)}@celorisdesigns.com`,
                    `DTSTAMP:${stamp(new Date())}`,
                    `DTSTART:${stamp(exam)}`,
                    `DTEND:${stamp(new Date(exam.getTime() + 60 * 60 * 1000))}`,
                    `SUMMARY:Celoris ${shortTitle} final certification exam`,
                    "LOCATION:https://celorisdesigns.com/classrooms",
                    "END:VEVENT"
                )
            }
            lines.push("END:VCALENDAR")
            const blob = new Blob([lines.join("\r\n")], { type: "text/calendar" })
            const url = URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = `celoris-${slug}-sessions.ics`
            a.click()
            setTimeout(() => URL.revokeObjectURL(url), 1000)
        }
        const shareText = encodeURIComponent(
            `Hey! I got selected for a free seat in the ${shortTitle} live course with certificate on Celoris (worth ₹1,500) starting ${status.batchLabel || batchLabel}. Apply for the next free seats here: https://celorisdesigns.com/free-courses-with-certificate/${slug}`
        )
        const shareUrl = `https://api.whatsapp.com/send?text=${shareText}`

        return (
            <div className="space-y-4">
                <div className="flex items-start gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                    <div className="text-sm text-neutral-200">
                        <p className="font-semibold text-white">You&apos;re selected! Your free seat in the {shortTitle} batch starting {status.batchLabel || batchLabel} is confirmed.</p>
                        {status.moved && (
                            <p className="mt-1 text-amber-300/90">The current batch was full, so we reserved your seat in the next one.</p>
                        )}
                        <p className="mt-1 text-neutral-300">
                            {scheduleLabel ? `Schedule: ${scheduleLabel}. ` : "Classes run live online. "}
                            We&apos;ll send the class link on WhatsApp before each session, and you&apos;ll also find it in{" "}
                            <Link href="/classrooms" className="text-emerald-400 underline-offset-2 hover:underline">
                                Classrooms
                            </Link>
                            . <span className="font-medium text-amber-300/90">Please attend live on time — recordings are not provided for free batches.</span>
                        </p>
                    </div>
                </div>

                {/* Post-enrollment high-impact action buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-1">
                    <a
                        href={calendarUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] hover:bg-white/[0.12] hover:border-emerald-500/40 px-4 py-2 text-xs font-semibold text-white transition-all shadow-sm"
                    >
                        <Calendar className="h-3.5 w-3.5 text-emerald-400" />
                        <span>Add to Google Calendar</span>
                    </a>
                    {sessions.length > 1 && (
                        <button
                            type="button"
                            onClick={downloadIcs}
                            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] hover:bg-white/[0.12] hover:border-emerald-500/40 px-4 py-2 text-xs font-semibold text-white transition-all shadow-sm"
                        >
                            <Calendar className="h-3.5 w-3.5 text-emerald-400" />
                            <span>All {sessions.length} classes + exam (.ics)</span>
                        </button>
                    )}
                    <a
                        href={shareUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/15 hover:bg-emerald-500/25 px-4 py-2 text-xs font-semibold text-emerald-300 transition-all shadow-sm"
                    >
                        <Share2 className="h-3.5 w-3.5 text-emerald-400" />
                        <span>Invite Study Partner on WhatsApp</span>
                    </a>
                </div>
            </div>
        )
    }

    return (
        <form onSubmit={submit} className="space-y-3">
            <div>
                <label htmlFor={`apply-${slug}`} className="mb-1.5 block text-sm font-medium text-white">
                    {APPLICATION_QUESTION}
                </label>
                <textarea
                    id={`apply-${slug}`}
                    rows={3}
                    maxLength={APPLICATION_MAX_CHARS}
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="For example: start a Reels page for my family's shop, or get a marketing internship."
                    className="w-full rounded-2xl border border-white/15 bg-white/[0.06] px-4 py-3 text-sm text-white placeholder:text-neutral-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
                <p className="mt-1 text-right text-[11px] text-neutral-500">
                    {answer.trim().length}/{APPLICATION_MAX_CHARS}
                </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative flex-1">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-neutral-400">+91</span>
                    <input
                        type="tel"
                        inputMode="numeric"
                        maxLength={10}
                        placeholder="WhatsApp number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                        className="w-full rounded-full border border-white/15 bg-white/[0.06] py-3 pl-14 pr-4 text-sm text-white placeholder:text-neutral-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                        aria-label="WhatsApp number"
                    />
                </div>
                <button
                    type="submit"
                    disabled={busy}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-black transition hover:bg-emerald-400 disabled:opacity-60 whitespace-nowrap"
                >
                    {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    Apply for Free Seat
                </button>
            </div>
            <label className="flex items-start gap-2 text-xs text-neutral-400">
                <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 accent-emerald-500" />
                <span>Send me the class link and reminders for this batch on WhatsApp.</span>
            </label>
            <p className="text-[11px] text-neutral-400/80 flex items-center gap-1.5 pt-0.5">
                <span>🔒</span>
                <span>If you&apos;re selected, you&apos;ll get the live class link, assignments and reminders on WhatsApp.</span>
            </p>
            {error && <p className="text-xs text-rose-400">{error}</p>}
        </form>
    )
}
