"use client"

import dynamic from "next/dynamic"
import React from "react"

import '@/components/polyvault/index.css'

import { DashboardShell } from "@/components/home-new/DashboardShell"
import { useAuth } from "@/components/providers/AuthProvider"

import { usePathname, useRouter } from "next/navigation"
import { useState, useEffect } from "react"

// PolyVault — 3D models & assets marketplace, replacing the old "Celoris 3D"
// feature. Ported in the same pattern as /celo-ai and /celoris-tv: a
// standalone Vite/React app kept as-is under components/polyvault, mounted
// here with next/dynamic (ssr: false) since it manages its own client-only
// state (localStorage-backed catalog/profile/likes) and a WebGL viewport.
const PolyVaultApp = dynamic(() => import('@/components/polyvault/App'), {
    ssr: false,
    loading: () => <LoadingSpinner />
})

function LoadingSpinner() {
    return (
        <div className="flex items-center justify-center py-20 bg-zinc-50 min-h-[60vh]">
            <div className="h-12 w-12 border-4 border-emerald-500/10 border-t-emerald-600 rounded-full animate-spin mx-auto mb-6" />
        </div>
    )
}

export default function PolyVaultPage() {
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
                <PolyVaultApp />
            </div>
        </DashboardShell>
    )
}
