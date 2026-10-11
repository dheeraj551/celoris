import Link from "next/link"
import {
    ArrowRight, BadgeCheck, Briefcase, ClipboardCheck,
    MapPin, QrCode, ShieldCheck, Users,
} from "lucide-react"
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton"
import { JobAlertsForm } from "@/components/job-center/JobAlertsForm"
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon"

// Public face of /job-center (server component). Every number on this page is
// read from the database at render time; nothing is hard-coded.

export interface PublicJob {
    id: string
    title: string
    company: string
    location: string
    pay: string
    industry: string
    workMode: string
    badges: string[]
    createdAt: string
}

const LOGIN_NEXT = "/login?next=%2Fjob-center"
// Signs the employer in, then opens the Post a Project form on /job-center.
const POST_PROJECT_NEXT = "/login?next=%2Fjob-center%3Fpost%3D1"

const TEST_AREAS = [
    "Video editing & Reels",
    "Social media design",
    "Digital marketing",
    "Instagram marketing",
    "Sales & cold calling",
    "TypeScript & full-stack",
    "AI & prompt systems",
    "Cybersecurity",
]

const STEPS = [
    {
        icon: ClipboardCheck,
        title: "Take a free skill test",
        body: "A short, proctored test of about 5 questions for the role you want. It's free, and it keeps the job board for serious candidates.",
    },
    {
        icon: BadgeCheck,
        title: "Earn your certificate and badge",
        body: "Pass and the badge goes on your public Celoris profile, with a QR code you can share with any employer.",
    },
    {
        icon: Briefcase,
        title: "Apply to roles that ask for it",
        body: "Open the jobs and paid gigs that require your badge and apply in one click with a verified profile.",
    },
]

function postedOn(iso: string): string {
    const d = new Date(iso)
    if (isNaN(d.getTime())) return ""
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", timeZone: "Asia/Kolkata" })
}

function companyLabel(company: string): string {
    if (!company || /confidential/i.test(company)) return "Confidential client"
    return company
}

function SignInCta({ oneTap }: { oneTap: boolean }) {
    return (
        <div className="w-full sm:w-[300px]">
            <GoogleSignInButton
                text="continue_with"
                oneTap={oneTap}
                oneTapDelayMs={4000}
                hideWhenSignedIn
                redirectTo="/job-center"
            >
                <Link
                    href={LOGIN_NEXT}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-black transition hover:bg-emerald-400"
                >
                    Take the free skill test
                    <ArrowRight className="h-4 w-4" />
                </Link>
            </GoogleSignInButton>
        </div>
    )
}

export function JobCenterLanding({ jobs }: { jobs: PublicJob[] }) {
    return (
        <div className="min-h-screen bg-[#050608] text-slate-200 selection:bg-emerald-500/30 pb-20">
            {/* 1. Hero */}
            <section className="relative overflow-hidden">
                <div className="pointer-events-none absolute -top-24 left-1/2 h-80 w-[36rem] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[110px]" />
                <div className="relative mx-auto max-w-5xl px-4 pt-14 pb-12 text-center sm:px-6 sm:pt-20">
                    <span className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                        Celoris Job Center
                    </span>
                    <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white sm:text-6xl">
                        Skilled. Certified.{" "}
                        <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">Job-ready.</span>
                    </h1>
                    <p className="mx-auto mt-4 max-w-2xl text-base text-neutral-300 sm:text-lg">
                        A free Celoris certificate for skilled, job-ready candidates. Pass a short skill test,
                        earn your badge, and apply to jobs and paid gigs that ask for it.
                    </p>

                    <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                        <SignInCta oneTap />
                        <a
                            href="#open-roles"
                            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-6 py-3 text-sm font-medium text-white transition hover:bg-white/[0.1]"
                        >
                            See open roles{jobs.length > 0 ? ` (${jobs.length})` : ""}
                            <ArrowRight className="h-4 w-4 text-emerald-400" />
                        </a>
                        <a
                            href="#whatsapp-alerts"
                            className="inline-flex items-center gap-2 rounded-full border border-[#25D366]/30 bg-[#25D366]/10 px-5 py-3 text-sm font-semibold text-[#25D366] transition hover:bg-[#25D366]/20 shadow-[0_0_15px_rgba(37,211,102,0.15)] hover:scale-105 active:scale-95"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#25D366]" />
                            </span>
                            <WhatsAppIcon className="h-4 w-4" />
                            WhatsApp Alerts
                        </a>
                    </div>
                    <p className="mt-3 text-xs text-neutral-500">
                        Free to join and free to take a test. Prefer email?{" "}
                        <Link href={LOGIN_NEXT} className="text-emerald-400 underline-offset-2 hover:underline">
                            Sign in here
                        </Link>
                        .
                    </p>

                    <div className="mx-auto mt-8 flex max-w-3xl flex-wrap justify-center gap-2">
                        {TEST_AREAS.map((t) => (
                            <span key={t} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-neutral-300">
                                {t}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* 2. How it works */}
            <section className="mx-auto max-w-5xl px-4 sm:px-6">
                <h2 className="text-center text-2xl font-semibold text-white sm:text-3xl">How the Celoris certificate works</h2>
                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                    {STEPS.map((s, i) => (
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
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div className="flex items-start gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
                        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                        <p className="text-sm text-neutral-300">
                            Tests are proctored: leaving the tab or pasting answers is recorded, so employers know your badge was earned fairly.
                        </p>
                    </div>
                    <div className="flex items-start gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
                        <QrCode className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                        <p className="text-sm text-neutral-300">
                            Your verified profile is public, so you can share it on your resume, LinkedIn or WhatsApp.
                        </p>
                    </div>
                </div>
            </section>

            {/* 3. Instant WhatsApp Job Alerts */}
            <section id="whatsapp-alerts" className="mx-auto mt-14 max-w-5xl scroll-mt-20 px-4 sm:px-6">
                <JobAlertsForm />
            </section>

            {/* 4. Open roles (live from the database) */}
            <section id="open-roles" className="mx-auto mt-16 max-w-5xl scroll-mt-20 px-4 sm:px-6">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                    <h2 className="text-2xl font-semibold text-white sm:text-3xl">Open roles right now</h2>
                    {jobs.length > 0 && (
                        <p className="text-sm text-neutral-400">
                            {jobs.length} open {jobs.length === 1 ? "role" : "roles"} · mostly remote
                        </p>
                    )}
                </div>

                {jobs.length === 0 ? (
                    <p className="mt-6 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 text-sm text-neutral-300">
                        New roles are being added. Get certified now so you can apply the moment they open.
                    </p>
                ) : (
                    <ul className="mt-6 grid gap-4 md:grid-cols-2">
                        {jobs.map((j) => {
                            const shareText = `Check out this opening on Celoris Job Center: ${j.title}${j.pay ? ` (${j.pay})` : ''}. Take the free skill test to earn your badge and apply: https://celorisdesigns.com/job-center`
                            const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`

                            return (
                                <li key={j.id} className="flex flex-col rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
                                    <div className="flex items-start justify-between gap-3">
                                        <h3 className="text-base font-semibold text-white">{j.title}</h3>
                                        {j.createdAt && (
                                             <span className="shrink-0 font-mono text-[11px] text-neutral-500">{postedOn(j.createdAt)}</span>
                                        )}
                                    </div>
                                    <p className="mt-1 text-xs text-neutral-400">
                                        {companyLabel(j.company)}
                                        {j.industry ? ` · ${j.industry}` : ""}
                                    </p>
                                    <div className="mt-3 flex flex-wrap gap-2 text-xs">
                                        {j.pay && (
                                            <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2.5 py-1 text-emerald-300">
                                                {j.pay}
                                            </span>
                                        )}
                                        {(j.location || j.workMode) && (
                                            <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-neutral-300">
                                                <MapPin className="h-3 w-3" />
                                                {j.location || j.workMode}
                                            </span>
                                        )}
                                    </div>
                                    {j.badges.length > 0 && (
                                        <p className="mt-3 text-xs text-neutral-400">
                                            Needs badge: <span className="text-neutral-200">{j.badges.join(", ")}</span>
                                        </p>
                                    )}
                                    <div className="mt-5 flex items-center justify-between gap-3 pt-3 border-t border-white/[0.06]">
                                        <Link
                                            href={LOGIN_NEXT}
                                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
                                        >
                                            Get certified &amp; apply
                                            <ArrowRight className="h-4 w-4" />
                                        </Link>
                                        <a
                                            href={waUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#25D366] hover:text-black transition-all duration-200 py-1.5 px-3 rounded-full bg-[#25D366]/10 hover:bg-[#25D366] border border-[#25D366]/30 hover:border-[#25D366] shadow-[0_0_12px_rgba(37,211,102,0.12)] hover:shadow-[0_0_20px_rgba(37,211,102,0.4)] group hover:scale-105 active:scale-95"
                                            title="Share job with friends on WhatsApp"
                                        >
                                            <WhatsAppIcon className="h-3.5 w-3.5 text-[#25D366] group-hover:text-black transition-colors" />
                                            <span>Share</span>
                                        </a>
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                )}
            </section>

            {/* 4. For employers */}
            <section className="mx-auto mt-16 max-w-5xl px-4 sm:px-6">
                <div className="flex flex-col items-start gap-5 rounded-3xl border border-emerald-500/25 bg-emerald-500/[0.06] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
                    <div className="flex items-start gap-4">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">
                            <Users className="h-5 w-5" />
                        </span>
                        <div>
                            <h2 className="text-xl font-semibold text-white sm:text-2xl">Hiring? Post a project free.</h2>
                            <p className="mt-1 max-w-xl text-sm text-neutral-300">
                                Tell us what you need and our team lists it for certified candidates. No fee to post, and candidates&apos; contact details stay private on Celoris.
                            </p>
                        </div>
                    </div>
                    <Link
                        href={POST_PROJECT_NEXT}
                        className="inline-flex shrink-0 items-center gap-2 rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-black transition hover:bg-emerald-400"
                    >
                        Post a project
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </section>

            {/* 5. Closing CTA */}
            <section className="mx-auto mt-16 max-w-3xl px-4 text-center sm:px-6">
                <div className="rounded-3xl border border-white/[0.1] bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-8 sm:p-10">
                    <h2 className="text-2xl font-semibold text-white sm:text-3xl">Prove you&apos;re job-ready. Get certified free.</h2>
                    <p className="mt-3 text-sm text-neutral-300">
                        Sign in with Google and your first skill test is one click away.
                    </p>
                    <div className="mt-6 flex justify-center">
                        <SignInCta oneTap={false} />
                    </div>
                </div>
                <p className="mx-auto mt-6 max-w-2xl text-xs text-neutral-500">
                    A Celoris certificate verifies your skills. It is not a promise of employment: hiring decisions are always made by the employer.
                </p>
            </section>
        </div>
    )
}
