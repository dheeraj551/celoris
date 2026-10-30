"use client"

import React from "react"
import { CapacitorProvider } from "@/components/providers/CapacitorProvider"

export default function SocialLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <CapacitorProvider>
            <div className="min-h-screen bg-[#07090e] text-slate-100 antialiased selection:bg-emerald-500/30">
                <main className="w-full">
                    {children}
                </main>
            </div>
        </CapacitorProvider>
    )
}
