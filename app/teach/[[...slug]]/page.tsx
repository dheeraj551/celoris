"use client"

import dynamic from 'next/dynamic'
import React from 'react'

import { DashboardShell } from "@/components/home-new/DashboardShell"

// Dynamic import to avoid SSR issues with react-router-dom
const TeachApp = dynamic(() => import('@/components/teach-app/TeachApp'), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center py-20">
            <div className="h-12 w-12 border-4 border-emerald-500/10 border-t-emerald-600 rounded-full animate-spin mx-auto mb-6" />
        </div>
    )
})

export default function TeachPage() {
    return (
        <DashboardShell>
            <TeachApp />
        </DashboardShell>
    )
}
