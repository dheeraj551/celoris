"use client"

import React from 'react';
import {
    Coffee,
    Video,
    Image as ImageIcon,
    Lightbulb,
    UserCircle,
    BarChart3,
    UploadCloud,
    BookOpen,
    FolderOpen,
    GraduationCap,
    Search,
    MessageCircle,
    Info,
    Mail,
    HardDrive,
    Megaphone,
    TrendingUp,
    Target,
    Share2,
    X,
    Brain,
    Briefcase,
    Tv
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogTitle
} from "@/components/ui/dialog";

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
        title: "Marketing",
        items: [
            { name: "Vibe Marketing", icon: Share2, href: "/marketing/social" },
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

export function Sidebar({ className }: { className?: string }) {
    const pathname = usePathname();

    const [isNewbeeMode, setIsNewbeeMode] = React.useState(true);
    const [isSupportModalOpen, setIsSupportModalOpen] = React.useState(false);

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
        <aside className={cn("w-64 flex-shrink-0 bg-[#080808] border-r border-white/5 flex-col overflow-y-auto custom-scrollbar", className)}>
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
                    href="/learn"
                    className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-xl transition-all group",
                        pathname.startsWith('/learn')
                            ? "bg-emerald-500/10 text-emerald-500"
                            : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                    )}
                >
                    <BookOpen className={cn("w-4 h-4", pathname.startsWith('/learn') ? "text-emerald-500" : "text-slate-500 group-hover:text-emerald-500")} />
                    <span className="text-sm font-bold uppercase tracking-tight">LEARN</span>
                </Link>

                <Link
                    href="/celoris-tv"
                    className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-xl transition-all group",
                        pathname.startsWith('/celoris-tv')
                            ? "bg-red-500/10 text-red-400 font-bold"
                            : "text-slate-400 hover:bg-white/5 hover:text-white"
                    )}
                >
                    <Tv className={cn("w-4 h-4", pathname.startsWith('/celoris-tv') ? "text-red-500" : "text-slate-500 group-hover:text-red-500")} />
                    <span className="text-sm font-bold uppercase tracking-tight">Celoris TV</span>
                </Link>

                <Link
                    href="/teach"
                    className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-xl transition-all group",
                        pathname.startsWith('/teach')
                            ? "bg-emerald-500/10 text-emerald-500"
                            : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                    )}
                >
                    <GraduationCap className={cn("w-4 h-4", pathname.startsWith('/teach') ? "text-emerald-500" : "text-slate-500 group-hover:text-emerald-500")} />
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
                    <Coffee className={cn("w-4 h-4", pathname.startsWith('/social') ? "text-rose-500" : "text-slate-500 group-hover:text-rose-500")} />
                    <span className="text-sm font-bold uppercase tracking-tight">CAFE</span>
                </Link>

                <Link
                    href="/celo-ai"
                    className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-xl transition-all group",
                        pathname.startsWith('/celo-ai')
                            ? "bg-purple-500/10 text-purple-400 font-bold"
                            : "text-slate-400 hover:bg-white/5 hover:text-white"
                    )}
                >
                    <Brain className={cn("w-4 h-4", pathname.startsWith('/celo-ai') ? "text-purple-500" : "text-slate-500 group-hover:text-purple-500")} />
                    <span className="text-sm font-bold uppercase tracking-tight">CELO AI</span>
                </Link>

                <Link
                    href="/job-center"
                    className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-xl transition-all group",
                        pathname.startsWith('/job-center')
                            ? "bg-amber-500/10 text-amber-400 font-bold"
                            : "text-slate-400 hover:bg-white/5 hover:text-white"
                    )}
                >
                    <Briefcase className={cn("w-4 h-4", pathname.startsWith('/job-center') ? "text-amber-500" : "text-slate-500 group-hover:text-amber-500")} />
                    <span className="text-sm font-bold uppercase tracking-tight">Job Center</span>
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

            {/* Support Widget */}
            <div className="px-6 mb-8 mt-auto w-full">
                <Dialog open={isSupportModalOpen} onOpenChange={setIsSupportModalOpen}>
                    <DialogTrigger asChild>
                        <div className="w-full rounded-2xl overflow-hidden border border-white/10 hover:border-emerald-500/50 transition-all bg-[#fff5f0] cursor-pointer group">
                            <img 
                                src="/support.png" 
                                alt="Support us via QR Code" 
                                className="w-full h-auto object-cover group-hover:opacity-90 transition-opacity"
                            />
                        </div>
                    </DialogTrigger>
                    <DialogContent className="max-w-md bg-transparent border-none shadow-none flex justify-center items-center p-0">
                        <DialogTitle className="sr-only">Support Us</DialogTitle>
                        <div className="relative w-full max-h-[90vh] rounded-2xl overflow-hidden bg-[#fff5f0]">
                            <img 
                                src="/support.png" 
                                alt="Support us via QR Code - Full Size" 
                                className="w-full h-auto max-h-[90vh] object-contain"
                            />
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </aside>
    );
}
