"use client"

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Clock, ShieldAlert, CheckCircle2, XCircle, Loader2, ChevronLeft, ChevronRight } from 'lucide-react'

// Standalone, no-login exam runner for candidates who reach an exam via an
// emailed invite link (see app/api/exam/invite) or a shared /exam/[examId]
// link. Deliberately independent of components/skillverify/App.tsx — that
// app is gated behind a Celoris account, ties progress to XP/badges, and
// imports the full PREBUILT_EXAMS array (answer key included) into the
// client bundle. This component fetches a sanitized, answer-key-free version
// of the exam from the server and submits answers for server-side grading,
// so a candidate can't read the correct answers out of devtools.

interface PublicQuestion {
    id: string
    type: 'mcq' | 'scenario'
    question: string
    codeSnippet?: string
    options?: string[]
    difficulty?: string
}

interface PublicExam {
    id: string
    title: string
    description: string
    skillName: string
    industry: string
    timeLimitMinutes: number
    passingScorePercent: number
    xpReward: number
    badgeTitle: string
    badgeColor: string
    difficulty: string
    targetRoleExamples: string[]
    questions: PublicQuestion[]
}

type Stage = 'loading' | 'not-found' | 'landing' | 'exam' | 'submitting' | 'result' | 'submit-error'

export function PublicExamRunner({ examId }: { examId: string }) {
    const searchParams = useSearchParams()
    const [stage, setStage] = useState<Stage>('loading')
    const [exam, setExam] = useState<PublicExam | null>(null)

    const [candidateName, setCandidateName] = useState(searchParams.get('name') || '')
    const [candidateEmail, setCandidateEmail] = useState(searchParams.get('email') || '')

    const [currentIndex, setCurrentIndex] = useState(0)
    const [answers, setAnswers] = useState<Record<string, number | string>>({})

    const [secondsLeft, setSecondsLeft] = useState(0)
    const startedAtRef = useRef<number>(0)
    const tabSwitchCountRef = useRef(0)

    const [result, setResult] = useState<{ scorePercent: number; passed: boolean; passingScorePercent: number } | null>(null)

    // Fetch the sanitized exam definition.
    useEffect(() => {
        let cancelled = false
        fetch(`/api/exam/${examId}`)
            .then((res) => (res.ok ? res.json() : Promise.reject(res)))
            .then((data: PublicExam) => {
                if (cancelled) return
                setExam(data)
                setSecondsLeft(data.timeLimitMinutes * 60)
                setStage('landing')
            })
            .catch(() => {
                if (!cancelled) setStage('not-found')
            })
        return () => {
            cancelled = true
        }
    }, [examId])

    // Countdown timer, only while actually taking the exam.
    useEffect(() => {
        if (stage !== 'exam') return
        const timer = setInterval(() => {
            setSecondsLeft((s) => {
                if (s <= 1) {
                    clearInterval(timer)
                    // Auto-submit when time runs out.
                    handleSubmit()
                    return 0
                }
                return s - 1
            })
        }, 1000)
        return () => clearInterval(timer)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stage])

    // Lightweight tab-switch / focus-loss tracking — flagged to the hiring
    // team in the result email, not shown to the candidate.
    useEffect(() => {
        if (stage !== 'exam') return
        const onVisibility = () => {
            if (document.hidden) tabSwitchCountRef.current += 1
        }
        document.addEventListener('visibilitychange', onVisibility)
        return () => document.removeEventListener('visibilitychange', onVisibility)
    }, [stage])

    const question = exam?.questions[currentIndex]
    const answeredCount = useMemo(() => Object.keys(answers).length, [answers])

    const startExam = () => {
        if (!candidateName.trim() || !candidateEmail.trim()) return
        startedAtRef.current = Date.now()
        setStage('exam')
    }

    async function handleSubmit() {
        if (!exam) return
        setStage('submitting')
        const timeSpentSeconds = Math.round((Date.now() - startedAtRef.current) / 1000)
        try {
            const res = await fetch('/api/exam/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    examId: exam.id,
                    candidateName,
                    candidateEmail,
                    answers,
                    timeSpentSeconds,
                    tabSwitchViolations: tabSwitchCountRef.current,
                }),
            })
            if (!res.ok) throw new Error('submit failed')
            const data = await res.json()
            setResult({
                scorePercent: data.scorePercent,
                passed: data.passed,
                passingScorePercent: data.passingScorePercent,
            })
            setStage('result')
        } catch (err) {
            console.error('Exam submit error:', err)
            setStage('submit-error')
        }
    }

    const timeString = `${Math.floor(secondsLeft / 60)}:${String(secondsLeft % 60).padStart(2, '0')}`

    if (stage === 'loading') {
        return (
            <Centered>
                <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            </Centered>
        )
    }

    if (stage === 'not-found') {
        return (
            <Centered>
                <div className="text-center max-w-sm">
                    <XCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
                    <h1 className="text-lg font-bold text-slate-900">Assessment not found</h1>
                    <p className="text-sm text-slate-500 mt-2">
                        This link may be out of date. Please ask Celoris for a new invite.
                    </p>
                </div>
            </Centered>
        )
    }

    if (!exam) return null

    if (stage === 'landing') {
        return (
            <Centered wide>
                <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8 space-y-6">
                    <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white shadow"
                        style={{ backgroundColor: exam.badgeColor }}
                    >
                        <ShieldAlert className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-extrabold text-slate-900">{exam.title}</h1>
                        <p className="text-xs text-slate-500 mt-1">
                            {exam.industry} &middot; {exam.difficulty}
                        </p>
                        <p className="text-sm text-slate-600 mt-3 leading-relaxed">{exam.description}</p>
                    </div>

                    <div className="flex flex-wrap gap-3 text-xs text-slate-600">
                        <Pill icon={<Clock className="w-3.5 h-3.5" />} label={`${exam.timeLimitMinutes} minutes`} />
                        <Pill label={`${exam.questions.length} questions`} />
                        <Pill label={`${exam.passingScorePercent}% to pass`} />
                    </div>

                    <div className="space-y-3 pt-2 border-t border-slate-100">
                        <div>
                            <label className="text-xs font-semibold text-slate-700">Full name</label>
                            <input
                                value={candidateName}
                                onChange={(e) => setCandidateName(e.target.value)}
                                placeholder="Your name"
                                className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-slate-700">Email</label>
                            <input
                                value={candidateEmail}
                                onChange={(e) => setCandidateEmail(e.target.value)}
                                placeholder="you@example.com"
                                type="email"
                                className="mt-1 w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>
                        <p className="text-[11px] text-slate-400">
                            Once you start, the timer won't pause — make sure you have {exam.timeLimitMinutes} uninterrupted minutes.
                        </p>
                        <button
                            onClick={startExam}
                            disabled={!candidateName.trim() || !candidateEmail.trim()}
                            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold text-sm transition-colors"
                        >
                            Start Assessment
                        </button>
                    </div>
                </div>
            </Centered>
        )
    }

    if (stage === 'exam' && question) {
        const isLast = currentIndex === exam.questions.length - 1
        const isAnswered = answers[question.id] !== undefined && answers[question.id] !== ''

        return (
            <div className="min-h-screen bg-[#FDFBF7] flex flex-col">
                <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">
                        Question {currentIndex + 1} of {exam.questions.length} &middot; {answeredCount} answered
                    </span>
                    <span className="flex items-center gap-1.5 text-sm font-bold text-emerald-700">
                        <Clock className="w-4 h-4" />
                        {timeString}
                    </span>
                </div>

                <div className="flex-1 max-w-2xl w-full mx-auto px-4 sm:px-6 py-8">
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5">
                        <p className="text-base font-semibold text-slate-900 leading-relaxed">{question.question}</p>

                        {question.codeSnippet && (
                            <pre className="bg-slate-900 text-slate-100 text-xs rounded-lg p-4 overflow-x-auto">
                                <code>{question.codeSnippet}</code>
                            </pre>
                        )}

                        {question.type === 'mcq' && question.options && (
                            <div className="space-y-2">
                                {question.options.map((opt, idx) => {
                                    const selected = answers[question.id] === idx
                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => setAnswers((prev) => ({ ...prev, [question.id]: idx }))}
                                            className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-colors ${
                                                selected
                                                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-semibold'
                                                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                                            }`}
                                        >
                                            {opt}
                                        </button>
                                    )
                                })}
                            </div>
                        )}

                        {question.type === 'scenario' && (
                            <textarea
                                value={(answers[question.id] as string) || ''}
                                onChange={(e) => setAnswers((prev) => ({ ...prev, [question.id]: e.target.value }))}
                                rows={7}
                                placeholder="Write your answer..."
                                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                            />
                        )}
                    </div>

                    <div className="flex items-center justify-between mt-6">
                        <button
                            onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                            disabled={currentIndex === 0}
                            className="flex items-center gap-1 px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-600 disabled:opacity-40"
                        >
                            <ChevronLeft className="w-4 h-4" /> Previous
                        </button>

                        {isLast ? (
                            <button
                                onClick={handleSubmit}
                                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold"
                            >
                                Submit Assessment
                            </button>
                        ) : (
                            <button
                                onClick={() => setCurrentIndex((i) => Math.min(exam.questions.length - 1, i + 1))}
                                className="flex items-center gap-1 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold"
                            >
                                Next <ChevronRight className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                    {!isAnswered && (
                        <p className="text-center text-[11px] text-slate-400 mt-3">
                            You can leave this blank and come back to it before submitting.
                        </p>
                    )}
                </div>
            </div>
        )
    }

    if (stage === 'submitting') {
        return (
            <Centered>
                <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                <p className="text-sm text-slate-500 mt-3">Grading your answers…</p>
            </Centered>
        )
    }

    if (stage === 'submit-error') {
        return (
            <Centered>
                <div className="text-center max-w-sm">
                    <XCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
                    <h1 className="text-lg font-bold text-slate-900">Couldn't submit your assessment</h1>
                    <p className="text-sm text-slate-500 mt-2">Please check your connection and try again.</p>
                    <button
                        onClick={handleSubmit}
                        className="mt-4 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold"
                    >
                        Retry
                    </button>
                </div>
            </Centered>
        )
    }

    if (stage === 'result' && result) {
        return (
            <Centered wide>
                <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-sm p-8 text-center space-y-4">
                    {result.passed ? (
                        <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                    ) : (
                        <XCircle className="w-12 h-12 text-slate-400 mx-auto" />
                    )}
                    <h1 className="text-xl font-extrabold text-slate-900">
                        {result.passed ? 'Assessment Complete — Passed' : 'Assessment Complete'}
                    </h1>
                    <p className="text-3xl font-black text-slate-900">{result.scorePercent}%</p>
                    <p className="text-sm text-slate-500">
                        {exam.passingScorePercent}% was required to pass.
                    </p>
                    <p className="text-sm text-slate-600 pt-3 border-t border-slate-100">
                        Thanks, {candidateName}. The Celoris hiring team has been notified of your result and will
                        follow up if there's a match.
                    </p>
                </div>
            </Centered>
        )
    }

    return null
}

function Centered({ children, wide }: { children: React.ReactNode; wide?: boolean }) {
    return (
        <div className={`min-h-screen bg-[#FDFBF7] flex items-center justify-center ${wide ? 'px-4 py-10' : ''}`}>
            {children}
        </div>
    )
}

function Pill({ icon, label }: { icon?: React.ReactNode; label: string }) {
    return (
        <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-medium">
            {icon}
            {label}
        </span>
    )
}
