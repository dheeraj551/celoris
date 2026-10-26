import { type Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowRight, Award, Briefcase, CalendarDays, CheckCircle2, Clock, Languages, User, Video } from "lucide-react"
import { DashboardShell } from "@/components/home-new/DashboardShell"
import { JoinBootcamp } from "@/components/bootcamp/JoinBootcamp"
import {
    BOOTCAMPS,
    MIN_ATTENDANCE,
    SESSIONS,
    bootcampDates,
    currentBatchStart,
    formatBatchDate,
    getBootcamp,
    istDateTime,
} from "@/lib/bootcamps"
import { getSeatStats } from "@/lib/bootcamp-seats"
import { getBootcampClassrooms } from "@/lib/bootcamp-classrooms"
import { BootcampClassroomCard } from "@/components/bootcamp/BootcampClassroomCard"

// Seat numbers are read live from the applications, so refresh every 5 minutes.
export const revalidate = 300

const BASE = "https://celorisdesigns.com/free-courses-with-certificate"

export function generateStaticParams() {
    return BOOTCAMPS.map((b) => ({ slug: b.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params
    const b = getBootcamp(slug)
    if (!b) return {}
    const description = `${b.tagline} Free live course with certificate: ${SESSIONS} live sessions (${b.scheduleLabel}) with trainer ${b.trainer}, in Hinglish. Certified students can apply for jobs on the Celoris Job Center.`
    return {
        title: b.title,
        description,
        keywords: b.keywords,
        alternates: { canonical: `${BASE}/${b.slug}` },
        openGraph: {
            title: `${b.title} | Celoris`,
            description,
            url: `${BASE}/${b.slug}`,
            siteName: "Celoris",
            locale: "en_IN",
            type: "website",
            images: [{ url: `https://celorisdesigns.com/free-courses/${b.slug}.jpg`, width: 1732, height: 908, alt: `${b.title}: free live classes with ${b.trainer}` }],
        },
        twitter: { card: "summary_large_image", title: `${b.title} | Celoris`, description, images: [`https://celorisdesigns.com/free-courses/${b.slug}.jpg`] },
    }
}

export default async function BootcampPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const b = getBootcamp(slug)
    if (!b) notFound()

    const batch = currentBatchStart(new Date(), b)
    const { first, last } = bootcampDates(b, batch)
    const firstLabel = formatBatchDate(first)
    const endLabel = formatBatchDate(last)
    const firstSession = b.sessions[0]
    const [seatStats, classrooms] = await Promise.all([getSeatStats(), getBootcampClassrooms()])
    const live = seatStats[b.slug]
    const classroom = classrooms[b.slug]
    const firstClassLabel = `${firstLabel}, ${(b.startTimeLabel || "").replace(/\s*\(.*\)\s*$/, "")}`
    const freeSeats = live?.freeSeats ?? (b.totalSeats || 10) - (b.offlineEnrolled || 0)
    const remainingSeats = live?.seatsLeft ?? freeSeats
    const applications = live?.applications ?? 0
    const filledSeats = (b.totalSeats || 10) - remainingSeats

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Course",
        name: b.title,
        description: b.tagline,
        url: `${BASE}/${b.slug}`,
        image: `https://celorisdesigns.com/free-courses/${b.slug}.jpg`,
        provider: { "@type": "Organization", name: "Celoris", sameAs: "https://celorisdesigns.com" },
        teaches: b.outcomes,
        educationalCredentialAwarded: "Celoris verified skill certificate",
        offers: { "@type": "Offer", category: "Free", price: 0, priceCurrency: "INR" },
        hasCourseInstance: {
            "@type": "CourseInstance",
            courseMode: "Online",
            startDate: istDateTime(first, firstSession.hour, firstSession.minute),
            endDate: istDateTime(last, b.exam.hour + 1, b.exam.minute),
            instructor: { "@type": "Person", name: b.trainer },
            inLanguage: ["hi", "en"],
            courseWorkload: `PT${SESSIONS}H`,
            courseSchedule: { "@type": "Schedule", repeatFrequency: "P2D", repeatCount: SESSIONS, duration: "PT1H" },
        },
    }

    return (
        <DashboardShell>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <div className="min-h-screen bg-[#050608] pb-20 text-slate-200 selection:bg-emerald-500/30">
                {/* Hero */}
                <section className="relative overflow-hidden">
                    <div className="pointer-events-none absolute -top-24 left-1/2 h-80 w-[36rem] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[110px]" />
                    <div className="relative mx-auto max-w-4xl px-4 pb-10 pt-12 sm:px-6 sm:pt-16">
                        <Link href="/free-courses-with-certificate" className="text-xs text-neutral-400 hover:text-emerald-400">
                            ← All free courses with certificate
                        </Link>
                        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-5xl">{b.title}</h1>
                        <p className="mt-3 max-w-2xl text-base text-neutral-300 sm:text-lg">{b.tagline}</p>

                        {/* Price Strikethrough & Free Giveaway Framing */}
                        <div className="mt-5 flex flex-wrap items-center gap-3">
                            <div className="flex items-baseline gap-2">
                                <span className="text-base font-semibold text-neutral-500 line-through">₹{b.originalPrice.toLocaleString("en-IN")}</span>
                                <span className="text-3xl font-black text-emerald-400">FREE</span>
                            </div>
                            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/15 px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider text-emerald-300">
                                Free seats for selected students (save ₹{b.originalPrice.toLocaleString("en-IN")})
                            </span>
                        </div>

                        <div className="mt-6 flex flex-wrap gap-2 text-sm">
                            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2">
                                <CalendarDays className="h-4 w-4 text-emerald-400" /> {firstLabel} to {endLabel}
                            </span>
                            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2">
                                <Clock className="h-4 w-4 text-emerald-400" /> {b.scheduleLabel} · 1 hour each
                            </span>
                            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2">
                                <User className="h-4 w-4 text-emerald-400" /> Trainer: {b.trainer} {b.trainerRole ? `(${b.trainerRole})` : ""}
                            </span>
                            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2">
                                <Languages className="h-4 w-4 text-emerald-400" /> Medium: Hindi + English (Hinglish)
                            </span>
                            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2">
                                <Video className="h-4 w-4 text-emerald-400" /> Live in Celoris Classrooms
                            </span>
                        </div>

                        <div id="enroll" className="mt-8 rounded-3xl border border-white/[0.1] bg-white/[0.03] p-5 sm:p-6 scroll-mt-20">
                            {/* Live Cohort Availability Progress */}
                            <div className="mb-5 rounded-2xl border border-amber-500/30 bg-amber-500/[0.08] p-4">
                                <div className="flex items-center justify-between text-xs sm:text-sm font-mono mb-2">
                                    <span className="text-neutral-200 font-semibold">{b.totalSeats} seats in this batch:</span>
                                    <span className="text-amber-300 font-bold">
                                        {remainingSeats > 0 ? `${remainingSeats} of ${freeSeats} free seats still open` : "All free seats given"}
                                    </span>
                                </div>
                                <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/10">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-amber-400"
                                        style={{ width: `${Math.min(100, (filledSeats / b.totalSeats) * 100)}%` }}
                                    />
                                </div>
                                <div className="mt-2 flex flex-wrap items-center justify-between text-xs text-neutral-400 font-mono gap-1">
                                    <span>{b.offlineEnrolled} of {b.totalSeats} seats taken by paid students</span>
                                    <span className="text-emerald-400 font-semibold">
                                        {applications > 0 ? `${applications} applied for the free seats so far` : "Applications are open"}
                                    </span>
                                </div>
                            </div>

                            <p className="mb-1 text-sm font-medium text-white">Apply for a free seat in the batch starting {firstLabel} ({b.startTimeLabel || "12:00 PM IST"})</p>
                            <p className="mb-4 text-xs text-neutral-400">
                                Free seats go to the applicants we select. Selected students get a WhatsApp message with the class link before Class 1.
                            </p>
                            <JoinBootcamp slug={b.slug} shortTitle={b.shortTitle} batchLabel={firstLabel} scheduleLabel={b.scheduleLabel} />
                        </div>
                    </div>
                </section>

                {/* Where the classes happen */}
                {classroom && (
                    <section className="mx-auto mb-12 max-w-4xl px-4 sm:px-6">
                        <h2 className="mb-4 text-2xl font-semibold text-white">Where your classes happen</h2>
                        <BootcampClassroomCard classroom={classroom} firstClassLabel={firstClassLabel} />
                    </section>
                )}

                {/* Outcomes */}
                <section className="mx-auto max-w-4xl px-4 sm:px-6">
                    <h2 className="text-2xl font-semibold text-white">What you&apos;ll be able to do</h2>
                    <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                        {b.outcomes.map((o) => (
                            <li key={o} className="flex items-start gap-2.5 text-sm text-neutral-300">
                                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                                {o}
                            </li>
                        ))}
                    </ul>
                    <p className="mt-4 text-sm text-neutral-400">
                        <span className="text-neutral-200">Who it&apos;s for:</span> {b.whoFor}
                    </p>
                </section>

                {/* Session plan */}
                <section className="mx-auto mt-14 max-w-4xl px-4 sm:px-6">
                    <h2 className="text-2xl font-semibold text-white">{SESSIONS} live classes + final exam</h2>
                    <ol className="mt-5 space-y-3">
                        {b.days.map((d) => (
                            <li key={d.day} className="flex gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
                                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 font-mono text-sm font-bold text-emerald-400">
                                    {d.day}
                                </span>
                                <div>
                                    <p className="font-mono text-xs text-emerald-400">{b.sessions[d.day - 1]?.label} IST</p>
                                    <h3 className="font-semibold text-white">{d.title}</h3>
                                    <p className="mt-1 text-sm text-neutral-400">{d.detail}</p>
                                </div>
                            </li>
                        ))}
                        <li className="flex gap-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.06] p-5">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300">
                                <Award className="h-4 w-4" />
                            </span>
                            <div>
                                <p className="font-mono text-xs text-emerald-400">{b.exam.label} IST</p>
                                <h3 className="font-semibold text-white">Final certification exam</h3>
                                <p className="mt-1 text-sm text-neutral-400">
                                    Open to students who attended at least {MIN_ATTENDANCE} of the {SESSIONS} classes. Pass it to earn your certificate.
                                </p>
                            </div>
                        </li>
                    </ol>
                </section>

                {/* Certificate and jobs */}
                <section className="mx-auto mt-14 max-w-4xl px-4 sm:px-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6">
                            <Award className="h-6 w-6 text-emerald-400" />
                            <h3 className="mt-3 text-lg font-semibold text-white">Your certificate</h3>
                            <p className="mt-2 text-sm text-neutral-400">
                                Attend at least {MIN_ATTENDANCE} of the {SESSIONS} live classes and pass the final exam on the last day of the batch. You earn the Celoris
                                certificate and the &ldquo;{b.badge}&rdquo; badge on your Job Center profile.
                            </p>
                        </div>
                        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6">
                            <Briefcase className="h-6 w-6 text-emerald-400" />
                            <h3 className="mt-3 text-lg font-semibold text-white">Apply for jobs, free</h3>
                            <p className="mt-2 text-sm text-neutral-400">
                                Certified students can apply free to certified roles on the{" "}
                                <Link href="/job-center" className="text-emerald-400 underline-offset-2 hover:underline">
                                    Celoris Job Center
                                </Link>
                                , and bootcamp graduates get preference there.
                            </p>
                        </div>
                    </div>
                    <p className="mt-6 text-sm text-neutral-400">
                        Want the complete course after the bootcamp?{" "}
                        <Link href={b.fullCourseUrl} className="inline-flex items-center gap-1 text-emerald-400 underline-offset-2 hover:underline">
                            See the full {b.shortTitle} course <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                    </p>
                    <p className="mt-6 text-xs text-neutral-500">
                        A Celoris certificate verifies your skills. It is not a promise of employment: hiring decisions are always made by the employer.
                    </p>
                </section>

                {/* Mobile Sticky Enrollment Bottom Bar */}
                {/* Sits above the floating "Celoris Phone" button (bottom-right) so the Reserve button is never covered. */}
                <div className="fixed bottom-[calc(4.25rem+env(safe-area-inset-bottom))] left-3 right-3 z-40 rounded-2xl border border-white/10 bg-[#050608]/95 p-3 backdrop-blur-xl sm:hidden shadow-2xl">
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex flex-col">
                            <div className="flex items-center gap-1.5">
                                <span className="text-xs font-semibold text-white">Starts {firstLabel}</span>
                                <span className="text-[10px] font-mono text-amber-300 font-bold">({remainingSeats} free seats left)</span>
                            </div>
                            <span className="text-[11px] font-mono text-emerald-400">
                                <span className="line-through text-neutral-500 mr-1">₹{b.originalPrice.toLocaleString("en-IN")}</span>
                                FREE if selected
                            </span>
                        </div>
                        <a
                            href="#enroll"
                            className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-black transition hover:bg-emerald-400 active:scale-95 shadow-md whitespace-nowrap"
                        >
                            <span>Apply</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                        </a>
                    </div>
                </div>
            </div>
        </DashboardShell>
    )
}
