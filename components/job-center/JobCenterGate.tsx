"use client"
import '@/components/skillverify/index.css'
import dynamic from 'next/dynamic'
import React, { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

import { DashboardShell } from "@/components/home-new/DashboardShell"
import { useAuth } from '@/components/providers/AuthProvider'

// SkillVerify Pro — Job Alerts & Anti-Cheat Exam Hub, ported in the same
// pattern as /celo-ai: standalone Vite/React app kept as-is under
// components/skillverify, mounted here with next/dynamic (ssr: false)
// since it depends on browser-only APIs (localStorage, Web Audio, webcam).
const SkillVerifyApp = dynamic(() => import('@/components/skillverify/App'), {
    ssr: false,
    loading: () => <LoadingSpinner />
})

function LoadingSpinner() {
    return (
        <div className="flex items-center justify-center py-20">
            <div className="h-12 w-12 border-4 border-amber-500/10 border-t-amber-600 rounded-full animate-spin mx-auto mb-6" />
        </div>
    )
}

// True when this browser holds a stored Supabase session, so a signed-in user
// sees a short spinner instead of a flash of the public landing page.
function hasStoredSession(): boolean {
    try {
        for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i) || ''
            if (k.startsWith('sb-') && k.endsWith('-auth-token')) return true
        }
    } catch {}
    return false
}

type Mode = 'landing' | 'checking' | 'app'

/**
 * Signed-out visitors (and search engines) see `landing`, which is rendered on
 * the server. Signed-in users get the SkillVerify app, as before.
 */
export function JobCenterGate({ landing }: { landing: React.ReactNode }) {
    const pathname = usePathname()
    const { user, loading: authLoading } = useAuth()
    const [mode, setMode] = useState<Mode>('landing')

    useEffect(() => {
        if (authLoading) {
            if (hasStoredSession()) setMode('checking')
            return
        }
        setMode(user ? 'app' : 'landing')
    }, [authLoading, user])

    if (mode === 'app') {
        return (
            <DashboardShell hideTopBar>
                <div key={pathname} className="w-full">
                    <SkillVerifyApp />
                </div>
            </DashboardShell>
        )
    }

    if (mode === 'checking') {
        return <LoadingSpinner />
    }

    return <DashboardShell>{landing}</DashboardShell>
}
