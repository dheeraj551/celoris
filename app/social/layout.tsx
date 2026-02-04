"use client"

import { MobileNavBar } from "@/components/mobile/MobileNavBar"
import { CapacitorProvider } from "@/components/providers/CapacitorProvider"
import {
    Home,
    MessageCircle,
    User,
    Heart,
    Sparkles
} from "lucide-react"

export default function SocialLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const navItems = [
        { label: "Home", href: "/social", icon: Home },
        { label: "Swipe", href: "/social/swipe", icon: Heart },
        { label: "Chat", href: "/social/chat", icon: MessageCircle },
        { label: "Lobby", href: "/social/lobby", icon: Sparkles },
        { label: "Profile", href: "/social/profile", icon: User },
    ]

    return (
        <CapacitorProvider>
            <div className="relative min-h-screen">
                <main className="pb-32">
                    {children}
                </main>
                <MobileNavBar items={navItems} />
            </div>
        </CapacitorProvider>
    )
}
