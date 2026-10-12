import { type Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowRight, Award, Briefcase, CalendarDays, CheckCircle2, Clock, User } from "lucide-react"
import { DashboardShell } from "@/components/home-new/DashboardShell"
import { JoinBootcamp } from "@/components/bootcamp/JoinBootcamp"
import {
    BOOTCAMPS,
    DAYS,
    MIN_ATTENDANCE,
    SESSION_TIME_LABEL,
    batchEndDate,
    currentBatchStart,
    formatBatchDate,
    getBootcamp,
    istDateTime,
} from "@/lib/bootcamps"

export const revalidate = 3600

const BASE = "https://celorisdesigns.com/free-courses-with-certificate"

export function generateStaticParams() {
    return BOOTCAMPS.map((b) => ({ slug: b.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params
    const b = getBootcamp(slug)
    if (!b) return {}
    const description = `${b.tagline} Free ${DAYS}-day live course with certificate, daily at ${SESSION_TIME_LABEL} with trainer ${b.trainer}. Certified students can apply for jobs on the Celoris Job Center.`
    return {
        title: b.title,
        description,
        keywords: b.keywords,
        alternates: { canonical: `${BASE}/${b.slug}` },
        openGraph: { title: `${b.title} | Celoris`, description, url: `${BASE}/${b.slug}`, siteName: "Celoris", locale: "en_IN", type: "website" },
        twitter: { card: "summary_large_image", title: `${b.title} | Celoris`, description },
    }
}

export default async function BootcampPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const b = getBootcamp(slug)
    if (!b) notFound()

    const batch = currentBatchStart()
    const batchLabel = formatBatchDate(batch)
    const endLabel = formatBatchDate(batchEndDate(batch))

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Course",
        name: b.title,
        description: b.tagline,
        url: `${BASE}/${b.slug}`,
        provider: { "@type": "Organization", name: "Celoris", sameAs: "https://celorisdesigns.com" },
        teaches: b.outcomes,
        educationalCredentialAwarded: "Celoris verified skill certificate",
        offers: { "@type": "Offer", category: "Free", price: 0, priceCurrency: "INR" },
        hasCourseInstance: {
            "@type": "CourseInstance",
            courseMode: "Online",
            startDate: istDateTime(batch),
            endDate: istDateTime(batchEndDate(batch)),
            instructor: { "@type": "Person", name: b.trainer },
            courseSchedule: { "@type": "Schedule", repeatFrequency: "Daily", repeatCount: DAYS, duration: "PT1H" },
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

                        <div className="mt-6 flex flex-wrap gap-2 text-sm">
                            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2">
                                <CalendarDays className="h-4 w-4 text-emerald-400" /> {batchLabel} to {endLabel}
                            </span>
                            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2">
                                <Clock className="h-4 w-4 text-emerald-400" /> Daily, {SESSION_TIME_LABEL}, 1 hour
                            </span>
                            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2">
                                <User className="h-4 w-4 text-emerald-400" /> Trainer: {b.trainer}
                            </span>
                        </div>

                        <div className="mt-8 rounded-3xl border border-white/[0.1] bg-white/[0.03] p-5 sm:p-6">
                            <p className="mb-4 text-sm font-medium text-white">Free seat in the batch starting {batchLabel}</p>
                            <JoinBootcamp slug={b.slug} shortTitle={b.shortTitle} batchLabel={batchLabel} />
                        </div>
                    </div>
                </section>

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

                {/* 7-day plan */}
                <section className="mx-auto mt-14 max-w-4xl px-4 sm:px-6">
                    <h2 className="text-2xl font-semibold text-white">The {DAYS}-day plan</h2>
                    <ol className="mt-5 space-y-3">
                        {b.days.map((d) => (
                            <li key={d.day} className="flex gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
                                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 font-mono text-sm font-bold text-emerald-400">
                                    {d.day}
                                </span>
                                <div>
                                    <h3 className="font-semibold text-white">{d.title}</h3>
                                    <p className="mt-1 text-sm text-neutral-400">{d.detail}</p>
                                </div>
                            </li>
                        ))}
                    </ol>
                </section>

                {/* Certificate and jobs */}
                <section className="mx-auto mt-14 max-w-4xl px-4 sm:px-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6">
                            <Award className="h-6 w-6 text-emerald-400" />
                            <h3 className="mt-3 text-lg font-semibold text-white">Your certificate</h3>
                            <p className="mt-2 text-sm text-neutral-400">
                                Attend at least {MIN_ATTENDANCE} of the {DAYS} live sessions and pass the final skill test. You earn the Celoris
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
            </div>
        </DashboardShell>
    )
}
