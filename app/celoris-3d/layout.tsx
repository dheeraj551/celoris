"use client"

import { CapacitorProvider } from "@/components/providers/CapacitorProvider"
import { DashboardShell } from "@/components/home-new/DashboardShell"

export default function Celoris3DLayout({
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
