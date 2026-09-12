"use client"
import '@/components/photolite/index.css'
import dynamic from 'next/dynamic'
import React from 'react'

import { DashboardShell } from "@/components/home-new/DashboardShell"
import { useAuth } from '@/components/providers/AuthProvider'

import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

// PhotoLite — Web Image Editor, ported in the same pattern as
// components/skillverify and components/teach-app: a standalone Vite/React
// app (originally AI-Studio-generated) kept as-is under components/photolite,
// mounted here with next/dynamic (ssr: false) since it depends on
// browser-only APIs (canvas, localStorage, File APIs).
const PhotoLiteApp = dynamic(() => import('@/components/photolite/App'), {
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

export default function PhotoLitePage() {
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
                <PhotoLiteApp />
            </div>
        </DashboardShell>
    )
}
