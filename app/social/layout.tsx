"use client"

import { MobileNavBar } from "@/components/mobile/MobileNavBar"
import { CapacitorProvider } from "@/components/providers/CapacitorProvider"
import {
    Home,
    MessageCircle,
    User,
    Sparkles
} from "lucide-react"

import { DashboardShell } from "@/components/home-new/DashboardShell"

export default function SocialLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const navItems = [
        { label: "Home", href: "/social", icon: Home },
        { label: "Chat", href: "/social/chat", icon: MessageCircle },
        { label: "Lobby", href: "/social/lobby", icon: Sparkles },
        { label: "Profile", href: "/social/profile", icon: User },
    ]

    return (
        <CapacitorProvider>
            <DashboardShell>
                <div className="relative min-h-screen pb-20">
                    <main>
                        {children}
                    </main>
                    <MobileNavBar items={navItems} />
                </div>
            </DashboardShell>
        </CapacitorProvider>
    )
}
