"use client"

import React from 'react';
import {
    Home,
    Video,
    Image as ImageIcon,
    Lightbulb,
    UserCircle,
    BarChart3,
    UploadCloud,
    Sparkles,
    FolderOpen,
    Zap,
    ChevronRight,
    Search
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const MENU_GROUPS = [
    {
        title: "Creation",
        items: [
            { name: "Video generator", icon: Video, href: "/ai-explorer" },
            { name: "Image studio", icon: ImageIcon, href: "/ai-explorer" },
            { name: "Inspiration", icon: Lightbulb, href: "/blog" },
            { name: "Avatars and voices", icon: UserCircle, href: "/social" },
        ]
    },
    {
        title: "Management",
        items: [
            { name: "Analytics", icon: BarChart3, href: "/" },
            { name: "Publisher", icon: UploadCloud, href: "/social" },
        ]
    },
    {
        title: "Space",
        items: [
            { name: "Smart creation", icon: Sparkles, href: "/ai-explorer" },
            { name: "Assets", icon: FolderOpen, href: "/earn" },
        ]
    }
];

export function Sidebar() {
    const pathname = usePathname();

    const isActive = (href: string) => {
        if (href === '/' && pathname !== '/') return false;
        return pathname.startsWith(href);
    };

    return (
        <aside className="hidden md:flex w-64 flex-shrink-0 bg-[#050810] border-r border-white/5 flex-col h-screen sticky top-0 overflow-y-auto custom-scrollbar">
            {/* Logo */}
            <div className="px-8 py-6">
                <Link href="/" className="flex items-center gap-2">
                    <img
                        src="/celoris-logo.png"
                        alt="Celoris Logo"
                        className="h-7 w-auto object-contain brightness-0 invert"
                    />
                </Link>
            </div>

            <div className="px-6 py-2 space-y-1">
                <Link
                    href="/"
                    className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-xl font-bold text-sm transition-all",
                        pathname === '/'
                            ? "bg-white/5 text-white shadow-sm"
                            : "text-slate-400 hover:bg-white/5 hover:text-white"
                    )}
                >
                    <Home className="w-4 h-4" />
                    Home
                </Link>
                <div className="h-2" />

                <Link
                    href="/learn"
                    className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-xl transition-all group",
                        pathname.startsWith('/learn')
                            ? "bg-emerald-500/10 text-emerald-400 font-bold"
                            : "text-slate-400 hover:bg-white/5 hover:text-white"
                    )}
                >
                    <Zap className={cn("w-4 h-4", pathname.startsWith('/learn') ? "text-emerald-500" : "text-slate-500 group-hover:text-emerald-500")} />
                    <span className="text-sm font-bold uppercase tracking-tight">LEARN</span>
                </Link>

                <Link
                    href="/earn"
                    className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-xl transition-all group",
                        pathname.startsWith('/earn')
                            ? "bg-emerald-500/10 text-emerald-400 font-bold"
                            : "text-slate-400 hover:bg-white/5 hover:text-white"
                    )}
                >
                    <Sparkles className={cn("w-4 h-4", pathname.startsWith('/earn') ? "text-emerald-500" : "text-slate-500 group-hover:text-emerald-500")} />
                    <span className="text-sm font-bold uppercase tracking-tight">EARN</span>
                </Link>

                <Link
                    href="/social"
                    className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-xl transition-all group",
                        pathname.startsWith('/social')
                            ? "bg-rose-500/10 text-rose-400 font-bold"
                            : "text-slate-400 hover:bg-white/5 hover:text-white"
                    )}
                >
                    <Video className={cn("w-4 h-4", pathname.startsWith('/social') ? "text-rose-500" : "text-slate-500 group-hover:text-rose-500")} />
                    <span className="text-sm font-bold uppercase tracking-tight">PLAY</span>
                </Link>
            </div>

            <div className="flex-1 px-3 py-4 mt-4 space-y-8">
                {MENU_GROUPS.map((group, idx) => (
                    <div key={idx} className="space-y-1">
                        <h3 className="px-3 text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">
                            {group.title}
                        </h3>
                        {group.items.map((item, i) => (
                            <Link
                                key={i}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all group",
                                    isActive(item.href) && "bg-white/5 text-white font-bold"
                                )}
                            >
                                <item.icon className={cn("w-4 h-4 group-hover:scale-110 transition-transform", isActive(item.href) ? "text-emerald-500" : "text-slate-500")} />
                                <span className="text-sm font-medium">{item.name}</span>
                            </Link>
                        ))}
                    </div>
                ))}
            </div>

            <div className="p-4">
                <div className="bg-emerald-500/5 rounded-2xl p-4 border border-emerald-500/10 relative overflow-hidden group">
                    <div className="relative z-10">
                        <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-tight mb-2">Unlock all AI features</p>
                        <p className="text-xs font-medium text-slate-400 mb-4">Trending templates free for 7 days</p>
                        <button className="w-full py-2 bg-white/10 text-white text-xs font-bold rounded-xl shadow-sm border border-emerald-500/20 hover:bg-white/20 transition-colors">
                            Try for ₹0
                        </button>
                    </div>
                </div>
            </div>
        </aside>
    );
}
