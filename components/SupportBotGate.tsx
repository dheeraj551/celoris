"use client"

import { usePathname } from "next/navigation"
import { SupportBotWidget } from "@/components/SupportBotWidget"

// The support bot is for visitors browsing the public site — course
// discovery, pricing, "which course fits me". Hide it on logged-in /
// in-app surfaces where it isn't the right tool.
const HIDDEN_PREFIXES = ["/dashboard", "/celoris-tv", "/celo-ai", "/admin"]

export function SupportBotGate() {
    const pathname = usePathname()
    if (!pathname) return null

    const hidden = HIDDEN_PREFIXES.some(
        prefix => pathname === prefix || pathname.startsWith(`${prefix}/`)
    )
    if (hidden) return null

    return <SupportBotWidget />
}
