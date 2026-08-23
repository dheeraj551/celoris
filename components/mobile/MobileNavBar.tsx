"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import {
    Home,
    Search,
    MessageCircle,
    User,
    Heart,
    Sparkles,
    Zap
} from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
    label: string
    href: string
    icon: any
}

interface MobileNavBarProps {
    items: NavItem[]
}

export function MobileNavBar({ items }: MobileNavBarProps) {
    const pathname = usePathname()

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 px-6 pb-8 pt-4 bg-gradient-to-t from-[#080808] via-[#080808]/95 to-transparent pointer-events-none">
            <div className="max-w-md mx-auto pointer-events-auto">
                <nav className="relative bg-[#0d1321]/40 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-2 flex items-center justify-between shadow-3xl">
                    {items.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="relative flex-1 group"
                            >
                                <div className="flex flex-col items-center justify-center py-2 px-1">
                                    <motion.div
                                        animate={isActive ? { y: -2, scale: 1.1 } : { y: 0, scale: 1 }}
                                        className={cn(
                                            "p-2 rounded-2xl transition-colors duration-300",
                                            isActive
                                                ? "bg-emerald-500/10 text-emerald-400"
                                                : "text-slate-500 group-hover:text-slate-300"
                                        )}
                                    >
                                        <item.icon size={22} className={cn(isActive && "fill-emerald-400/20")} />
                                    </motion.div>
                                    <span className={cn(
                                        "text-[8px] font-black uppercase tracking-widest mt-1 transition-colors duration-300",
                                        isActive ? "text-emerald-400" : "text-slate-600 group-hover:text-slate-400"
                                    )}>
                                        {item.label}
                                    </span>

                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute -top-1 w-1 h-1 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.8)]"
                                        />
                                    )}
                                </div>
                            </Link>
                        )
                    })}
                </nav>
            </div>
        </div>
    )
}
