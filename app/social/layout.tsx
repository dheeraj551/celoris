"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { CapacitorProvider } from "@/components/providers/CapacitorProvider"
import { useAuth } from "@/components/providers/AuthProvider"

import { DashboardShell } from "@/components/home-new/DashboardShell"

function LoadingSpinner() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-[#050810]">
            <div className="h-12 w-12 border-4 border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin" />
        </div>
    )
}

export default function SocialLayout({
    children,
}: {
    children: React.ReactNode
}) {
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

    // Café is members-only: don't render any content (or leak room/user data)
    // until we've confirmed there's a logged-in user.
    if (!mounted || authLoading || !user) {
        return <LoadingSpinner />
    }

    return (
        <CapacitorProvider>
            <DashboardShell>
                <div className="relative min-h-screen">
                    <main>
                        {children}
                    </main>
                </div>
            </DashboardShell>
        </CapacitorProvider>
    )
}
