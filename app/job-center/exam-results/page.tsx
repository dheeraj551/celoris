"use client"

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardShell } from '@/components/home-new/DashboardShell'
import { useAuth } from '@/components/providers/AuthProvider'
import { CheckCircle2, XCircle, Loader2, ShieldAlert } from 'lucide-react'

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
            <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            </div>
        )
    }

    if (!isAdmin) {
        return (
            <DashboardShell hideTopBar>
                <div className="max-w-lg mx-auto py-20 text-center">
                    <ShieldAlert className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                    <h1 className="text-lg font-bold text-slate-900">Not available</h1>
                    <p className="text-sm text-slate-500 mt-2">This page is restricted.</p>
                </div>
            </DashboardShell>
        )
    }

    return (
        <DashboardShell hideTopBar>
            <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-8 space-y-6">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900">Candidate Assessment Results</h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Everyone who's completed an exam via an invite or shared link.
                    </p>
                </div>

                {error && <p className="text-sm text-rose-600">{error}</p>}

                {!submissions && !error && (
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Loader2 className="w-4 h-4 animate-spin" /> Loading…
                    </div>
                )}

                {submissions && submissions.length === 0 && (
                    <p className="text-sm text-slate-500">No submissions yet.</p>
                )}

                {submissions && submissions.length > 0 && (
                    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                <tr>
                                    <th className="px-4 py-3">Candidate</th>
                                    <th className="px-4 py-3">Exam</th>
                                    <th className="px-4 py-3">Score</th>
                                    <th className="px-4 py-3">Result</th>
                                    <th className="px-4 py-3">Flags</th>
                                    <th className="px-4 py-3">When</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {submissions.map((s) => (
                                    <tr key={s.id}>
                                        <td className="px-4 py-3">
                                            <div className="font-semibold text-slate-900">{s.candidate_name}</div>
                                            <div className="text-xs text-slate-500">{s.candidate_email}</div>
                                        </td>
                                        <td className="px-4 py-3 text-slate-700">{s.exam_title}</td>
                                        <td className="px-4 py-3 font-bold text-slate-900">{s.score_percent}%</td>
                                        <td className="px-4 py-3">
                                            {s.passed ? (
                                                <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                                                    <CheckCircle2 className="w-3.5 h-3.5" /> Passed
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 text-slate-500 font-semibold">
                                                    <XCircle className="w-3.5 h-3.5" /> Not passed
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-slate-500">
                                            {s.tab_switch_violations > 0 ? `${s.tab_switch_violations} tab switch(es)` : '—'}
                                        </td>
                                        <td className="px-4 py-3 text-slate-500 text-xs">
                                            {new Date(s.created_at).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </DashboardShell>
    )
}
