"use client"

import dynamic from "next/dynamic"
import React from "react"

import '@/components/celoris-tv/index.css'

import { DashboardShell } from "@/components/home-new/DashboardShell"
import { useAuth } from "@/components/providers/AuthProvider"

import { usePathname, useRouter } from "next/navigation"
import { useState, useEffect } from "react"

// Celoris TV — recorded-lecture platform, ported in the same pattern as
// /celo-ai and /job-center: standalone Vite/React app kept as-is under
// components/celoris-tv, mounted here with next/dynamic (ssr: false) since
// it manages its own client-only state (localStorage-backed watch progress,
// theme, etc).
const CelorisTvApp = dynamic(() => import('@/components/celoris-tv/App'), {
    ssr: false,
    loading: () => <LoadingSpinner />
})

function LoadingSpinner() {
    return (
        <div className="flex items-center justify-center py-20">
            <div className="h-12 w-12 border-4 border-red-500/10 border-t-red-600 rounded-full animate-spin mx-auto mb-6" />
        </div>
    )
}

export default function CelorisTvPage() {
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
                <CelorisTvApp />
            </div>
        </DashboardShell>
    )
}
