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
            <div className="min-h-screen antialiased selection:bg-emerald-500/30">
                {children}
            </div>
        </CapacitorProvider>
    )
}
