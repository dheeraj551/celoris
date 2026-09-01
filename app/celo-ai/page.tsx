"use client"
import '@/components/celo-ai/index.css'
import dynamic from 'next/dynamic'
import React from 'react'

import { DashboardShell } from "@/components/home-new/DashboardShell"

import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

const CeloAiApp = dynamic(() => import('@/components/celo-ai/App'), {
    ssr: false,
    loading: () => <LoadingSpinner />
})

function LoadingSpinner() {
    return (
        <div className="flex items-center justify-center py-20">
            <div className="h-12 w-12 border-4 border-purple-500/10 border-t-purple-600 rounded-full animate-spin mx-auto mb-6" />
        </div>
    )
}

export default function CeloAiPage() {
    const pathname = usePathname()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return <LoadingSpinner />

    return (
        <DashboardShell>
            <div key={pathname} className="h-[calc(100vh-4rem)] w-full">
                <CeloAiApp />
            </div>
        </DashboardShell>
    )
}
