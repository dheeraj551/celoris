"use client"

import React from "react"
import { CapacitorProvider } from "@/components/providers/CapacitorProvider"
import { DashboardShell } from "@/components/home-new/DashboardShell"

export default function MarketingDashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <CapacitorProvider>
            <DashboardShell>
                {children}
            </DashboardShell>
        </CapacitorProvider>
    )
}
