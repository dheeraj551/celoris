"use client"

import dynamic from 'next/dynamic'
import React, { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { DashboardShell } from "@/components/home-new/DashboardShell"

const TeachApp = dynamic(() => import('@/components/teach-app/TeachApp'), {
    ssr: false,
    loading: () => <LoadingSpinner />
})

function LoadingSpinner() {
    return (
        <div className="flex items-center justify-center py-20">
            <div className="h-12 w-12 border-4 border-emerald-500/10 border-t-emerald-600 rounded-full animate-spin mx-auto mb-6" />
        </div>
    )
}

interface TeachGateProps {
    landing: React.ReactNode
    initialSlug?: string[]
}

/**
 * Non-registered users and visitors to /teach get `landing` (TeachLanding),
 * which is open, fast, and renders all student slots without a signup wall.
 * Subroutes (e.g. /teach/trainers, /teach/dashboard/*) mount the client-side TeachApp.
 */
export function TeachGate({ landing, initialSlug }: TeachGateProps) {
    const pathname = usePathname()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const isSubRoute =
        (pathname && pathname !== '/teach' && pathname !== '/teach/') ||
        (Array.isArray(initialSlug) && initialSlug.length > 0)

    if (isSubRoute) {
        if (!mounted) return <LoadingSpinner />
        return (
            <DashboardShell>
                <div key={pathname} className="w-full">
                    <TeachApp />
                </div>
            </DashboardShell>
        )
    }

    return (
        <DashboardShell>
            {landing}
        </DashboardShell>
    )
}
