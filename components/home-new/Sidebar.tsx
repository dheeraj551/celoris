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
    Search,
    MessageCircle,
    Info,
    Mail,
    GraduationCap,
    HardDrive
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const MENU_GROUPS = [
    {
        title: "Creation",
        items: [
            { name: "Video studio", icon: Video, href: "/video-studio" },
            { name: "Image studio", icon: ImageIcon, href: "/image-studio" },
            { name: "Celoris 3D", icon: UserCircle, href: "/celoris-3d" },
        ]
    },
    {
        title: "Management",
        items: [
            { name: "About Us", icon: Info, href: "/about" },
            { name: "Contact us", icon: Mail, href: "/contact" },
            { name: "Blog", icon: Lightbulb, href: "/blog" },
        ]
    }
];

export function Sidebar() {
    const pathname = usePathname();

    const [isNewbeeMode, setIsNewbeeMode] = React.useState(true);

    React.useEffect(() => {
        const checkNewbeeStatus = async () => {
            // Check if specifically disabled by user
            const manualSetting = localStorage.getItem('celoris_newbee_mode');
            if (manualSetting !== null) {
                setIsNewbeeMode(manualSetting === 'true');
                return;
            }

            // Default logic: joined less than 24h ago
            const joinedAt = localStorage.getItem('celoris_joined_at');
            if (!joinedAt) {
                const now = new Date().toISOString();
                localStorage.setItem('celoris_joined_at', now);
                setIsNewbeeMode(true);
            } else {
                const joinedDate = new Date(joinedAt);
                const diffHours = (new Date().getTime() - joinedDate.getTime()) / (1000 * 60 * 60);
                if (diffHours > 24) {
                    setIsNewbeeMode(false);
                }
            }
        };
        checkNewbeeStatus();
    }, []);

    const toggleNewbeeMode = () => {
        const newValue = !isNewbeeMode;
        setIsNewbeeMode(newValue);
        localStorage.setItem('celoris_newbee_mode', String(newValue));
    };

    const isActive = (href: string) => {
        if (href === '/' && pathname !== '/') return false;
        return pathname.startsWith(href);
    };

    const displayGroups = isNewbeeMode 
        ? MENU_GROUPS.filter(g => g.title === "Creation") 
        : MENU_GROUPS;

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
                    href="/teach"
                    className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-xl transition-all group",
                        pathname.startsWith('/teach')
                            ? "bg-emerald-500/10 text-emerald-400 font-bold"
                            : "text-slate-400 hover:bg-white/5 hover:text-white"
                    )}
                >
                    <Sparkles className={cn("w-4 h-4", pathname.startsWith('/teach') ? "text-emerald-500" : "text-slate-500 group-hover:text-emerald-500")} />
                    <span className="text-sm font-bold uppercase tracking-tight">TEACH</span>
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
                {displayGroups.map((group, idx) => (
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

            {/* Banner */}
            <div className="px-6 mt-8 w-full mb-8">
                <a href="#" className="block w-full rounded-2xl overflow-hidden border border-white/10 hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all relative group">
                    <img 
                        src="/images/sidebar-banner.jpg" 
                        alt="Seekho Smart Badho Fast" 
                        className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                </a>
            </div>

            <div className="px-6 mb-8 mt-auto space-y-3">
                <button
                    onClick={toggleNewbeeMode}
                    className={cn(
                        "w-full flex items-center justify-between px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border",
                        isNewbeeMode 
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                            : "bg-white/5 border-white/10 text-slate-500 hover:text-slate-300"
                    )}
                >
                    <div className="flex items-center gap-2">
                        <Zap className={cn("w-3 h-3", isNewbeeMode ? "fill-emerald-400" : "")} />
                        Newbee Mode
                    </div>
                    <div className={cn(
                        "w-6 h-3 rounded-full relative transition-all",
                        isNewbeeMode ? "bg-emerald-500" : "bg-slate-700"
                    )}>
                        <div className={cn(
                            "absolute top-0.5 w-2 h-2 rounded-full bg-white transition-all",
                            isNewbeeMode ? "right-0.5" : "left-0.5"
                        )} />
                    </div>
                </button>

                <a
                    href="https://wa.me/919084718101"
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
