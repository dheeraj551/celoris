import { type Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Award, Briefcase, CalendarDays, Clock, Users } from "lucide-react"
import { DashboardShell } from "@/components/home-new/DashboardShell"
import {
    BOOTCAMPS,
    DAYS,
    MIN_ATTENDANCE,
    SESSION_TIME_LABEL,
    currentBatchStart,
    formatBatchDate,
    istDateTime,
    batchEndDate,
} from "@/lib/bootcamps"

// Hub for the free 7-day live bootcamps. Targets "free online courses with
// certificate" searches. The next batch date is computed, so the page stays
// current on its own (refreshed hourly).

export const revalidate = 3600

const URL = "https://celorisdesigns.com/free-courses-with-certificate"
const TITLE = "Free Online Courses with Certificate: Live Classes"
const DESCRIPTION =
    "Free 7-day live online courses with certificate in Social Media Reels and Digital Marketing. Daily classes at 8 PM IST with real trainers. Earn a verified Celoris certificate and apply to jobs on the Celoris Job Center."

export const metadata: Metadata = {
    // The root layout adds " | Celoris".
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: URL },
    openGraph: {
        title: "Free Live Online Courses with Certificate | Celoris",
        description: DESCRIPTION,
        url: URL,
        siteName: "Celoris",
        locale: "en_IN",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Free Live Online Courses with Certificate | Celoris",
        description: DESCRIPTION,
    },
}

const FAQS = [
    {
        q: "Are these courses really free?",
        a: "Yes. The 7-day live bootcamp, the final skill test and the certificate are free. You only need to sign in with Google and attend.",
    },
    {
        q: "How do I get the certificate?",
        a: `Attend at least ${MIN_ATTENDANCE} of the ${DAYS} live sessions and pass the final skill test. Your certificate is then added to your Celoris profile.`,
    },
    {
        q: "What can I do with the certificate?",
        a: "Certified students can apply free to certified roles on the Celoris Job Center, and bootcamp graduates are given preference there.",
    },
    {
        q: "Are the classes live or recorded?",
        a: `Live. Every session runs at ${SESSION_TIME_LABEL} with a real trainer, so you can ask questions as you learn.`,
    },
    {
        q: "When does the next batch start?",
        a: "A new batch starts every Monday and runs for 7 days.",
    },
]

export default function FreeCoursesHubPage() {
    const batch = currentBatchStart()
    const batchLabel = formatBatchDate(batch)

    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "ItemList",
                "@id": `${URL}#courses`,
                itemListElement: BOOTCAMPS.map((b, i) => ({
                    "@type": "ListItem",
                    position: i + 1,
                    url: `${URL}/${b.slug}`,
                    item: {
                        "@type": "Course",
                        name: b.title,
                        description: b.tagline,
                        url: `${URL}/${b.slug}`,
                        provider: { "@type": "Organization", name: "Celoris", sameAs: "https://celorisdesigns.com" },
                        offers: { "@type": "Offer", category: "Free", price: 0, priceCurrency: "INR" },
                        hasCourseInstance: {
                            "@type": "CourseInstance",
                            courseMode: "Online",
                            startDate: istDateTime(batch),
                            endDate: istDateTime(batchEndDate(batch)),
                            instructor: { "@type": "Person", name: b.trainer },
                            courseSchedule: { "@type": "Schedule", repeatFrequency: "Daily", repeatCount: DAYS, duration: "PT1H" },
                        },
                    },
                })),
            },
            {
                "@type": "FAQPage",
                mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
            },
        ],
    }

    return (
        <DashboardShell>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <div className="min-h-screen bg-[#050608] pb-20 text-slate-200 selection:bg-emerald-500/30">
                {/* Hero */}
                <section className="relative overflow-hidden">
                    <div className="pointer-events-none absolute -top-24 left-1/2 h-80 w-[36rem] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[110px]" />
                    <div className="relative mx-auto max-w-5xl px-4 pb-12 pt-14 text-center sm:px-6 sm:pt-20">
                        <span className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider text-emerald-400">
                            Live, free, with certificate
                        </span>
                        <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white sm:text-6xl">
                            Free online courses with certificate,{" "}
                            <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">taught live.</span>
                        </h1>
                        <p className="mx-auto mt-4 max-w-2xl text-base text-neutral-300 sm:text-lg">
                            7 evenings, one hour a day, with a real Celoris trainer. Finish the course, pass the test, and use your certificate to apply for jobs on the Celoris Job Center.
                        </p>
                        <div className="mx-auto mt-8 flex max-w-3xl flex-wrap justify-center gap-3 text-sm">
                            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2">
                                <CalendarDays className="h-4 w-4 text-emerald-400" /> Next batch: {batchLabel}
                            </span>
                            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2">
                                <Clock className="h-4 w-4 text-emerald-400" /> Daily at {SESSION_TIME_LABEL}
                            </span>
                            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2">
                                <Users className="h-4 w-4 text-emerald-400" /> Live trainer, real questions
                            </span>
                        </div>
                    </div>
                </section>

                {/* Courses */}
                <section className="mx-auto max-w-5xl px-4 sm:px-6">
                    <h2 className="text-2xl font-semibold text-white sm:text-3xl">Choose your free course</h2>
                    <div className="mt-6 grid gap-5 md:grid-cols-2">
                        {BOOTCAMPS.map((b) => (
                            <Link
                                key={b.slug}
                                href={`/free-courses-with-certificate/${b.slug}`}
                                className="group flex flex-col rounded-3xl border border-white/[0.1] bg-white/[0.03] p-6 transition hover:border-emerald-500/40 hover:bg-white/[0.05] sm:p-8"
                            >
                                <span className="font-mono text-xs text-neutral-500">{DAYS}-day live bootcamp · free</span>
                                <h3 className="mt-2 text-xl font-semibold text-white sm:text-2xl">{b.shortTitle}</h3>
                                <p className="mt-2 text-sm text-neutral-300">{b.tagline}</p>
                                <p className="mt-4 text-xs text-neutral-400">
                                    Trainer: <span className="text-neutral-200">{b.trainer}</span>
                                </p>
                                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-emerald-400 group-hover:text-emerald-300">
                                    See the 7-day plan and join
                                    <ArrowRight className="h-4 w-4" />
                                </span>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* How it works */}
                <section className="mx-auto mt-16 max-w-5xl px-4 sm:px-6">
                    <h2 className="text-2xl font-semibold text-white sm:text-3xl">How the free certificate works</h2>
                    <div className="mt-6 grid gap-4 sm:grid-cols-3">
                        {[
                            { icon: CalendarDays, title: "Join a batch", body: "Sign in with Google and reserve your seat. A new batch starts every Monday." },
                            { icon: Award, title: `Attend ${MIN_ATTENDANCE} of ${DAYS} and pass the test`, body: `Live classes at ${SESSION_TIME_LABEL}. Finish with a short final skill test to earn your certificate.` },
                            { icon: Briefcase, title: "Apply for jobs", body: "Your certificate lets you apply free to certified roles on the Celoris Job Center, with preference for bootcamp graduates." },
                        ].map((s, i) => (
                            <div key={s.title} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6">
                                <div className="flex items-center gap-3">
                                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
                                        <s.icon className="h-5 w-5" />
                                    </span>
                                    <span className="font-mono text-xs text-neutral-500">Step {i + 1}</span>
                                </div>
                                <h3 className="mt-4 text-lg font-semibold text-white">{s.title}</h3>
                                <p className="mt-2 text-sm text-neutral-400">{s.body}</p>
                            </div>
                        ))}
                    </div>
                    <p className="mt-4 text-sm text-neutral-400">
                        See the roles you can apply for on the{" "}
                        <Link href="/job-center" className="text-emerald-400 underline-offset-2 hover:underline">
                            Celoris Job Center
                        </Link>
                        .
                    </p>
                </section>

                {/* FAQ */}
                <section className="mx-auto mt-16 max-w-3xl px-4 sm:px-6">
                    <h2 className="text-2xl font-semibold text-white sm:text-3xl">Questions</h2>
                    <div className="mt-6 divide-y divide-white/[0.08] rounded-2xl border border-white/[0.08] bg-white/[0.02]">
                        {FAQS.map((f) => (
                            <details key={f.q} className="group p-5">
                                <summary className="cursor-pointer list-none font-medium text-white">{f.q}</summary>
                                <p className="mt-2 text-sm text-neutral-300">{f.a}</p>
                            </details>
                        ))}
                    </div>
                    <p className="mt-6 text-xs text-neutral-500">
                        A Celoris certificate verifies your skills. It is not a promise of employment: hiring decisions are always made by the employer.
                    </p>
                </section>
            </div>
        </DashboardShell>
    )
}
