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
    Search,
    MessageCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const MENU_GROUPS = [
    {
        title: "Creation",
        items: [
            { name: "Video generator", icon: Video, href: "/ai-explorer" },
            { name: "Image studio", icon: ImageIcon, href: "/image-studio" },
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

            <div className="px-6 mb-8 mt-auto">
                <a
                    href="https://wa.me/919643579101"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#1e1f20] border border-white/5 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/30 hover:bg-[#282a2d] transition-all group/wa shadow-xl"
                >
                    <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center group-hover/wa:scale-110 group-hover/wa:bg-emerald-500/20 transition-all">
                        <MessageCircle className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest leading-none mb-1">Get support</p>
                        <p className="text-xs font-medium text-slate-500 group-hover/wa:text-slate-400 transition-colors">WhatsApp Contact</p>
                    </div>
                </a>
            </div>
        </aside>
    );
}
