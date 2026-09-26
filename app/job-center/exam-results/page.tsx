"use client"

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { DashboardShell } from '@/components/home-new/DashboardShell'
import { useAuth } from '@/components/providers/AuthProvider'
import { CheckCircle2, XCircle, Loader2, ShieldAlert, ChevronLeft, ShieldCheck, Award } from 'lucide-react'

// Same hardcoded admin-email allowlist already used by app/api/admin/users
// for the "role: admin" check — this page reuses it client-side so anyone
// signed into their own Celoris account can't browse other candidates'
// assessment results just by knowing the URL.
const ADMIN_EMAILS = ['support@celorisdesigns.com', 'celoris.designs@gmail.com', 'dheerajkushwaha551@gmail.com']

interface Submission {
    id: string
    exam_id: string
    exam_title: string
    candidate_name: string
    candidate_email: string
    score_percent: number
    passed: boolean
    mcq_correct: number
    mcq_total: number
    time_spent_seconds: number
    tab_switch_violations: number
    created_at: string
}

export default function ExamResultsPage() {
    const router = useRouter()
    const { user, loading: authLoading } = useAuth()
    const [mounted, setMounted] = useState(false)
    const [submissions, setSubmissions] = useState<Submission[] | null>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => setMounted(true), [])

    useEffect(() => {
        if (mounted && !authLoading && !user) {
            router.push('/login')
        }
    }, [mounted, authLoading, user, router])

    const isAdmin = !!user?.email && ADMIN_EMAILS.includes(user.email)

    useEffect(() => {
        if (!isAdmin) return
        fetch('/api/exam/results')
            .then((res) => (res.ok ? res.json() : Promise.reject(res)))
            .then((data) => setSubmissions(data.submissions || []))
            .catch(() => setError('Could not load results.'))
    }, [isAdmin])

    if (!mounted || authLoading || !user) {
        return (
            <div className="min-h-screen bg-[#07080c] flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
            </div>
        )
    }

    if (!isAdmin) {
        return (
            <DashboardShell hideTopBar>
                <div className="min-h-screen bg-[#07080c] flex items-center justify-center p-4">
                    <div className="max-w-md w-full p-8 rounded-2xl bg-[#0d1017] border border-white/10 text-center space-y-4">
                        <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto">
                            <ShieldAlert className="w-6 h-6" />
                        </div>
                        <h1 className="text-xl font-bold text-white">Access Restricted</h1>
                        <p className="text-sm text-slate-400">
                            This assessment dashboard requires verified administrator privileges.
                        </p>
                        <Link
                            href="/job-center"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white text-xs font-semibold border border-white/10 transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4 text-emerald-400" />
                            <span>Return to Job Center</span>
                        </Link>
                    </div>
                </div>
            </DashboardShell>
        )
    }

    return (
        <DashboardShell hideTopBar>
            <div className="min-h-screen bg-[#07080c] text-slate-200">
                {/* Top Nav Header with Celoris Logo and Back Button */}
                <header className="sticky top-0 z-40 bg-[#07080c]/85 backdrop-blur-xl border-b border-white/[0.08] px-4 sm:px-6 lg:px-8 py-3.5">
                    <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 sm:gap-5">
                            {/* Exit / Back Button */}
                            <Link
                                href="/job-center"
                                className="group flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-all shadow-xs"
                                title="Back to Job Center"
                            >
                                <ChevronLeft className="w-4 h-4 text-emerald-400 transition-transform group-hover:-translate-x-0.5" />
                                <span>Back to Job Center</span>
                            </Link>

                            <div className="h-5 w-px bg-white/10 hidden sm:block" />

                            {/* Official Celoris Logo */}
                            <Link href="/" className="flex items-center gap-2.5 group">
                                <img
                                    src="/celoris-logo.png"
                                    alt="Celoris"
                                    className="h-7 w-auto object-contain filter drop-shadow-[0_0_12px_rgba(16,185,129,0.25)] transition-transform group-hover:scale-105"
                                />
                            </Link>

                            <div className="hidden md:flex items-center gap-2 pl-2">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-semibold text-emerald-400">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    Exam Administration
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-400 hidden sm:inline">Signed in as</span>
                            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md truncate max-w-[180px]">
                                {user.email}
                            </span>
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h1 className="text-2xl font-extrabold text-white tracking-tight">Candidate Assessment Results</h1>
                                <span className="px-2.5 py-0.5 rounded-full bg-white/[0.05] border border-white/10 text-xs font-mono text-slate-400">
                                    {submissions ? `${submissions.length} Total` : '...'}
                                </span>
                            </div>
                            <p className="text-sm text-slate-400">
                                Real-time anti-cheat verified candidate exam submissions and proctor integrity metrics.
                            </p>
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-sm text-rose-300">
                            {error}
                        </div>
                    )}

                    {!submissions && !error && (
                        <div className="flex items-center justify-center gap-3 py-16 text-sm text-slate-400 bg-[#0d1017] rounded-2xl border border-white/[0.08]">
                            <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
                            <span>Loading assessment records...</span>
                        </div>
                    )}

                    {submissions && submissions.length === 0 && (
                        <div className="py-16 text-center bg-[#0d1017] rounded-2xl border border-white/[0.08] space-y-3">
                            <Award className="w-10 h-10 text-slate-600 mx-auto" />
                            <h3 className="text-base font-bold text-white">No submissions recorded yet</h3>
                            <p className="text-xs text-slate-400 max-w-sm mx-auto">
                                When candidates complete proctored skill certifications, their cryptographic scores and proctor logs will appear here.
                            </p>
                        </div>
                    )}

                    {submissions && submissions.length > 0 && (
                        <div className="bg-[#0d1017] border border-white/[0.1] rounded-2xl overflow-hidden shadow-2xl">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-white/[0.03] text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-white/[0.08]">
                                        <tr>
                                            <th className="px-5 py-3.5">Candidate</th>
                                            <th className="px-5 py-3.5">Exam</th>
                                            <th className="px-5 py-3.5">Score</th>
                                            <th className="px-5 py-3.5">Result</th>
                                            <th className="px-5 py-3.5">Integrity Flags</th>
                                            <th className="px-5 py-3.5">Timestamp</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/[0.06] text-slate-300">
                                        {submissions.map((s) => (
                                            <tr key={s.id} className="hover:bg-white/[0.02] transition-colors">
                                                <td className="px-5 py-3.5">
                                                    <div className="font-semibold text-white">{s.candidate_name}</div>
                                                    <div className="text-xs text-slate-400 font-mono">{s.candidate_email}</div>
                                                </td>
                                                <td className="px-5 py-3.5 text-slate-200 font-medium">
                                                    {s.exam_title}
                                                </td>
                                                <td className="px-5 py-3.5 font-bold font-mono text-emerald-400">
                                                    {s.score_percent}%
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    {s.passed ? (
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
                                                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Passed
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-bold">
                                                            <XCircle className="w-3.5 h-3.5 text-rose-400" /> Not passed
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    {s.tab_switch_violations > 0 ? (
                                                        <span className="inline-flex items-center gap-1 text-xs text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">
                                                            {s.tab_switch_violations} tab switch(es)
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 text-xs text-emerald-400/80">
                                                            <ShieldCheck className="w-3.5 h-3.5" /> Clean Proctor
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-5 py-3.5 text-slate-400 text-xs font-mono">
                                                    {new Date(s.created_at).toLocaleString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </DashboardShell>
    )
}

