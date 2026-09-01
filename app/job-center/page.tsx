"use client"
import '@/components/skillverify/index.css'
import dynamic from 'next/dynamic'
import React from 'react'

import { DashboardShell } from "@/components/home-new/DashboardShell"
import { useAuth } from '@/components/providers/AuthProvider'

import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

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

export default function JobCenterPage() {
    const pathname = usePathname()
    const router = useRouter()
    const { user, loading: authLoading } = useAuth()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (mounted && !authLoading && !user) {
            router.push('/login')
        }
    }, [mounted, authLoading, user, router])

    if (!mounted || authLoading || !user) {
        return <LoadingSpinner />
    }

    return (
        <DashboardShell hideTopBar>
            <div key={pathname} className="w-full">
                <SkillVerifyApp />
            </div>
        </DashboardShell>
    )
}
