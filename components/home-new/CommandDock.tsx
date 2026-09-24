"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Video,
    Image as ImageIcon,
    IndianRupee,
    Briefcase,
    GraduationCap,
    Coffee,
    Search,
    Command,
    X,
    ArrowRight,
    CornerDownLeft,
    Tv,
    Box,
    Layers,
    ExternalLink,
    HelpCircle,
    Info,
    Sparkles,
    ArrowLeftRight,
    Megaphone,
    type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DockItem {
    id: string;
    label: string;
    shortLabel: string;
    icon: LucideIcon;
    href: string;
    badge: string;
    hotkey: string;
    color: string;
    glowRgba: string;
    bgHover: string;
    borderHover: string;
    iconColor: string;
}

const DOCK_ITEMS: DockItem[] = [
    {
        id: "video-studio",
        label: "Video Studio",
        shortLabel: "Video",
        icon: Video,
        href: "/video-studio",
        badge: "4K AI",
        hotkey: "1",
        color: "from-blue-500 to-indigo-500",
        glowRgba: "rgba(59, 130, 246, 0.45)",
        bgHover: "hover:bg-blue-500/10",
        borderHover: "hover:border-blue-500/40",
        iconColor: "text-blue-400",
    },
    {
        id: "photo-lite",
        label: "Photo Lite AI",
        shortLabel: "Photo Lite",
        icon: ImageIcon,
        href: "/photolite",
        badge: "AI Edit",
        hotkey: "2",
        color: "from-cyan-400 to-teal-500",
        glowRgba: "rgba(6, 182, 212, 0.45)",
        bgHover: "hover:bg-cyan-500/10",
        borderHover: "hover:border-cyan-500/40",
        iconColor: "text-cyan-400",
    },
    {
        id: "job-center",
        label: "Job Center",
        shortLabel: "Jobs",
        icon: Briefcase,
        href: "/job-center",
        badge: "Live Gigs",
        hotkey: "3",
        color: "from-amber-400 to-orange-500",
        glowRgba: "rgba(245, 158, 11, 0.45)",
        bgHover: "hover:bg-amber-500/10",
        borderHover: "hover:border-amber-500/40",
        iconColor: "text-amber-400",
    },
    {
        id: "free-courses",
        label: "Free Courses",
        shortLabel: "Courses",
        icon: GraduationCap,
        href: "/learn",
        badge: "Free",
        hotkey: "4",
        color: "from-emerald-400 to-teal-500",
        glowRgba: "rgba(16, 185, 129, 0.45)",
        bgHover: "hover:bg-emerald-500/10",
        borderHover: "hover:border-emerald-500/40",
        iconColor: "text-emerald-400",
    },
    {
        id: "live-cafe",
        label: "Live Cafe",
        shortLabel: "Cafe",
        icon: Coffee,
        href: "/social",
        badge: "Online",
        hotkey: "5",
        color: "from-rose-400 to-pink-500",
        glowRgba: "rgba(244, 63, 94, 0.45)",
        bgHover: "hover:bg-rose-500/10",
        borderHover: "hover:border-rose-500/40",
        iconColor: "text-rose-400",
    },
];

interface PaletteCommand {
    category: "Creative Studios" | "Career & Learning" | "Community & Media" | "Platform & More";
    title: string;
    description: string;
    href: string;
    icon: LucideIcon;
    badge?: string;
    shortcut?: string;
    color?: string;
    glowRgba?: string;
    iconColor?: string;
    badgeStyle?: string;
}

const PALETTE_COMMANDS: PaletteCommand[] = [
    {
        category: "Creative Studios",
        title: "Motion Swap Studio",
        description: "AI Motion transfer & surgical object swap using Higgsfield Genjutsu models",
        href: "/motion-swap",
        icon: ArrowLeftRight,
        badge: "New",
        shortcut: "M",
        color: "from-[#d4f634] to-emerald-400",
        glowRgba: "rgba(212, 246, 52, 0.45)",
        iconColor: "text-[#d4f634]",
        badgeStyle: "bg-[#d4f634]/15 text-[#d4f634] border-[#d4f634]/30",
    },
    {
        category: "Creative Studios",
        title: "ViO Studio",
        description: "Commercial product ad studio & ready-to-post AI marketing creatives",
        href: "/vio-studio",
        icon: Megaphone,
        badge: "Marketing",
        shortcut: "V",
        color: "from-[#D4FF00] to-emerald-400",
        glowRgba: "rgba(212, 255, 0, 0.45)",
        iconColor: "text-[#D4FF00]",
        badgeStyle: "bg-[#D4FF00]/15 text-[#D4FF00] border-[#D4FF00]/30",
    },
    {
        category: "Creative Studios",
        title: "Video Studio",
        description: "AI-assisted video editing, automated captions & motion FX",
        href: "/video-studio",
        icon: Video,
        badge: "Studio",
        shortcut: "1",
        color: "from-blue-500 to-indigo-500",
        glowRgba: "rgba(59, 130, 246, 0.45)",
        iconColor: "text-blue-400",
        badgeStyle: "bg-blue-500/15 text-blue-300 border-blue-400/30",
    },
    {
        category: "Creative Studios",
        title: "Photo Lite AI",
        description: "Browser-based graphic editing, retouching & filters",
        href: "/photolite",
        icon: ImageIcon,
        badge: "Editor",
        shortcut: "2",
        color: "from-cyan-400 to-teal-500",
        glowRgba: "rgba(6, 182, 212, 0.45)",
        iconColor: "text-cyan-400",
        badgeStyle: "bg-cyan-500/15 text-cyan-300 border-cyan-400/30",
    },
    {
        category: "Creative Studios",
        title: "PolyVault 3D",
        description: "Free high-fidelity 3D models and low-poly assets",
        href: "/polyvault",
        icon: Box,
        badge: "3D Vault",
        color: "from-violet-500 to-purple-600",
        glowRgba: "rgba(139, 92, 246, 0.45)",
        iconColor: "text-violet-400",
        badgeStyle: "bg-violet-500/15 text-violet-300 border-violet-400/30",
    },
    {
        category: "Creative Studios",
        title: "Celoris 3D",
        description: "Interactive 3D creation and spatial rendering engine",
        href: "/celoris-3d",
        icon: Layers,
        badge: "Spatial",
        color: "from-amber-400 to-orange-500",
        glowRgba: "rgba(245, 158, 11, 0.45)",
        iconColor: "text-amber-400",
        badgeStyle: "bg-amber-500/15 text-amber-300 border-amber-400/30",
    },
    {
        category: "Career & Learning",
        title: "Free Courses Catalog",
        description: "Master AI, Web Dev, Marketing, and Physics at zero cost",
        href: "/learn",
        icon: GraduationCap,
        badge: "Free",
        shortcut: "4",
        color: "from-emerald-400 to-teal-500",
        glowRgba: "rgba(16, 185, 129, 0.45)",
        iconColor: "text-emerald-400",
        badgeStyle: "bg-emerald-500/15 text-emerald-300 border-emerald-400/30",
    },
    {
        category: "Career & Learning",
        title: "Job Center & Live Radar",
        description: "Verified creative freelance contracts, 0% commission fees",
        href: "/job-center",
        icon: Briefcase,
        badge: "Verified",
        shortcut: "3",
        color: "from-orange-400 to-amber-500",
        glowRgba: "rgba(249, 115, 22, 0.45)",
        iconColor: "text-orange-400",
        badgeStyle: "bg-orange-500/15 text-orange-300 border-orange-400/30",
    },
    {
        category: "Career & Learning",
        title: "Teach on Celoris",
        description: "Publish your own practical courses and earn monthly revenue",
        href: "/teach",
        icon: ExternalLink,
        badge: "Creator",
        color: "from-sky-400 to-blue-500",
        glowRgba: "rgba(14, 165, 233, 0.45)",
        iconColor: "text-sky-400",
        badgeStyle: "bg-sky-500/15 text-sky-300 border-sky-400/30",
    },
    {
        category: "Community & Media",
        title: "Celoris Cafe Lounge",
        description: "Live voice lounges, study rooms, and synchronized creators",
        href: "/social",
        icon: Coffee,
        badge: "Live",
        shortcut: "5",
        color: "from-rose-400 to-pink-500",
        glowRgba: "rgba(244, 63, 94, 0.45)",
        iconColor: "text-rose-400",
        badgeStyle: "bg-rose-500/15 text-rose-300 border-rose-400/30",
    },
    {
        category: "Community & Media",
        title: "Celoris TV (24/7 Live)",
        description: "Non-stop curated masterclasses, tutorials & tech demos",
        href: "/celoris-tv",
        icon: Tv,
        badge: "Stream",
        color: "from-red-500 to-rose-600",
        glowRgba: "rgba(239, 68, 68, 0.45)",
        iconColor: "text-red-400",
        badgeStyle: "bg-red-500/15 text-red-300 border-red-400/30",
    },
    {
        category: "Platform & More",
        title: "Pricing & Plans",
        description: "AI generation credits, Free Tier, unlimited models & perks",
        href: "/pricing",
        icon: IndianRupee,
        badge: "Plans",
        color: "from-purple-400 to-pink-500",
        glowRgba: "rgba(168, 85, 247, 0.45)",
        iconColor: "text-purple-400",
        badgeStyle: "bg-purple-500/15 text-purple-300 border-purple-400/30",
    },
    {
        category: "Platform & More",
        title: "Digital Agency & Custom Solutions",
        description: "High-impact web, brand design & custom software consulting",
        href: "https://wa.me/919999999999?text=Hello%20Celoris%20Team",
        icon: ArrowRight,
        badge: "WhatsApp",
        color: "from-emerald-500 to-teal-600",
        glowRgba: "rgba(16, 185, 129, 0.45)",
        iconColor: "text-emerald-400",
        badgeStyle: "bg-emerald-500/15 text-emerald-300 border-emerald-400/30",
    },
    {
        category: "Platform & More",
        title: "About Celoris Ecosystem",
        description: "Our mission to provide 100% free creative tools and training",
        href: "/about",
        icon: Info,
        badge: "Story",
        color: "from-slate-400 to-slate-600",
        glowRgba: "rgba(148, 163, 184, 0.45)",
        iconColor: "text-slate-300",
        badgeStyle: "bg-slate-500/15 text-slate-300 border-slate-400/30",
    },
    {
        category: "Platform & More",
        title: "Design & Tech Blog",
        description: "Guides on digital marketing, video editing, and AI workflows",
        href: "/blog",
        icon: HelpCircle,
        badge: "Articles",
        color: "from-indigo-400 to-purple-600",
        glowRgba: "rgba(99, 102, 241, 0.45)",
        iconColor: "text-indigo-400",
        badgeStyle: "bg-indigo-500/15 text-indigo-300 border-indigo-400/30",
    },
];

export function CommandDock() {
    const router = useRouter();
    const [isPaletteOpen, setIsPaletteOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isMac, setIsMac] = useState(false);
    const [activeHoverId, setActiveHoverId] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

    // Detect platform for hotkey chip (⌘K vs Ctrl+K)
    useEffect(() => {
        if (typeof window !== "undefined") {
            const platform = window.navigator?.platform || "";
            const userAgent = window.navigator?.userAgent || "";
            setIsMac(/Mac|iPhone|iPad|iPod/i.test(platform) || /Mac/i.test(userAgent));
        }
    }, []);

    // Global keyboard shortcut listener (⌘K / Ctrl+K and 1-5 shortcuts)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const isInputFocused =
                document.activeElement?.tagName === "INPUT" ||
                document.activeElement?.tagName === "TEXTAREA" ||
                document.activeElement?.getAttribute("contenteditable") === "true";

            // ⌘K or Ctrl+K to toggle Command Palette
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
                e.preventDefault();
                setIsPaletteOpen((prev) => !prev);
                return;
            }

            // If inside Command Palette
            if (isPaletteOpen) {
                if (e.key === "Escape") {
                    e.preventDefault();
                    setIsPaletteOpen(false);
                }
                return;
            }

            // If not typing in an input, number keys 1-5 can jump to dock actions
            if (!isInputFocused && !e.metaKey && !e.ctrlKey && !e.altKey) {
                const targetItem = DOCK_ITEMS.find((item) => item.hotkey === e.key);
                if (targetItem) {
                    e.preventDefault();
                    router.push(targetItem.href);
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isPaletteOpen, router]);

    // Focus input when palette opens
    useEffect(() => {
        if (isPaletteOpen) {
            setSearchQuery("");
            setSelectedIndex(0);
            setTimeout(() => {
                inputRef.current?.focus();
            }, 50);
        }
    }, [isPaletteOpen]);

    // Filter commands
    const filteredCommands = PALETTE_COMMANDS.filter((cmd) => {
        const query = searchQuery.toLowerCase().trim();
        if (!query) return true;
        return (
            cmd.title.toLowerCase().includes(query) ||
            cmd.description.toLowerCase().includes(query) ||
            cmd.category.toLowerCase().includes(query)
        );
    });

    // Auto-scroll selected item into view inside palette
    useEffect(() => {
        if (isPaletteOpen && itemRefs.current[selectedIndex]) {
            itemRefs.current[selectedIndex]?.scrollIntoView({
                block: "nearest",
                behavior: "smooth",
            });
        }
    }, [selectedIndex, isPaletteOpen]);

    // Handle command selection
    const handleSelect = (cmd: PaletteCommand) => {
        setIsPaletteOpen(false);
        if (cmd.href.startsWith("http")) {
            window.open(cmd.href, "_blank");
        } else {
            router.push(cmd.href);
        }
    };

    // Arrow navigation inside palette
    const handlePaletteKeyDown = (e: React.KeyboardEvent) => {
        if (filteredCommands.length === 0) return;

        if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
        } else if (e.key === "Enter") {
            e.preventDefault();
            const selected = filteredCommands[selectedIndex];
            if (selected) {
                handleSelect(selected);
            }
        }
    };

    return (
        <>
            {/* Floating Quick-Launch "Command Dock" */}
            <motion.div
                initial={{ opacity: 0, y: 24, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
                className="relative z-20 my-6 sm:my-8 flex justify-center items-center px-2"
            >
                {/* Ambient dynamic glow behind the dynamic island dock */}
                <div className="absolute -inset-1 -z-10 bg-gradient-to-r from-purple-500/15 via-cyan-500/15 to-blue-500/15 rounded-full blur-2xl opacity-60 pointer-events-none" />

                {/* IPHONE 18 DYNAMIC ISLAND NANO-GLASS CAPSULE */}
                <div
                    className={cn(
                        "relative flex flex-wrap sm:flex-nowrap items-center justify-center gap-1 sm:gap-1.5",
                        "p-1 sm:p-1.5 rounded-full",
                        "bg-[#08090d]/80 backdrop-blur-3xl",
                        "border border-white/[0.12]",
                        "shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.06),inset_0_1px_1px_rgba(255,255,255,0.2)]",
                        "transition-all duration-300 select-none"
                    )}
                >
                    {/* DOCK ITEMS (SLEEK IPHONE 18 CAPACITIVE GLASS BUTTONS) */}
                    {DOCK_ITEMS.map((item) => {
                        const Icon = item.icon;
                        const isHovered = activeHoverId === item.id;

                        return (
                            <Link
                                key={item.id}
                                href={item.href}
                                onMouseEnter={() => setActiveHoverId(item.id)}
                                onMouseLeave={() => setActiveHoverId(null)}
                                className="relative block focus:outline-none"
                            >
                                <motion.div
                                    whileHover={{ y: -1, scale: 1.03 }}
                                    whileTap={{ scale: 0.96 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 500,
                                        damping: 24,
                                        mass: 0.5,
                                    }}
                                    className={cn(
                                        "group relative flex items-center gap-2 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-full",
                                        "text-neutral-300 hover:text-white transition-all duration-200 cursor-pointer select-none",
                                        "hover:bg-white/[0.08] active:bg-white/[0.14]",
                                        "border border-transparent hover:border-white/[0.12]"
                                    )}
                                    style={{
                                        boxShadow: isHovered
                                            ? `0 0 20px -3px ${item.glowRgba}, inset 0 1px 1px rgba(255,255,255,0.25)`
                                            : undefined,
                                    }}
                                >
                                    {/* Clean Minimalist Icon with Dynamic Glow Aura */}
                                    <div className="relative flex items-center justify-center">
                                        <Icon
                                            className={cn("w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 group-hover:scale-110", item.iconColor)}
                                        />
                                        {/* Apple Dynamic Micro-Aura */}
                                        <div
                                            className="absolute inset-0 rounded-full blur-sm opacity-0 group-hover:opacity-75 transition-opacity duration-200 pointer-events-none"
                                            style={{ background: item.glowRgba }}
                                        />
                                    </div>

                                    {/* Modern Clean Typography */}
                                    <span className="text-xs sm:text-[13px] font-medium tracking-tight text-neutral-200 group-hover:text-white transition-colors whitespace-nowrap">
                                        <span className="hidden md:inline">{item.label}</span>
                                        <span className="inline md:hidden">{item.shortLabel}</span>
                                    </span>

                                    {/* Apple OLED Status Micro-Dot & Tag */}
                                    <span className="hidden lg:inline-flex items-center gap-1 text-[9px] font-mono font-medium text-neutral-400 group-hover:text-neutral-200 transition-colors">
                                        <span
                                            className="w-1 h-1 rounded-full animate-pulse"
                                            style={{ background: item.glowRgba }}
                                        />
                                        <span>{item.badge}</span>
                                    </span>

                                    {/* Slim iOS-style Keyboard Indicator */}
                                    <kbd className="hidden sm:inline-flex items-center justify-center min-w-[15px] h-3.5 px-1 rounded text-[9px] font-mono text-neutral-400 bg-white/[0.04] border border-white/[0.08] group-hover:text-neutral-200 group-hover:border-white/20 transition-colors">
                                        {item.hotkey}
                                    </kbd>
                                </motion.div>
                            </Link>
                        );
                    })}

                    {/* Hairline Divider */}
                    <div className="hidden sm:block w-[1px] h-4 bg-white/10 mx-0.5" />

                    {/* SEARCH / ⌘K DYNAMIC ISLAND MODULE */}
                    <motion.button
                        type="button"
                        onClick={() => setIsPaletteOpen(true)}
                        whileHover={{ y: -1, scale: 1.03 }}
                        whileTap={{ scale: 0.96 }}
                        transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 24,
                            mass: 0.5,
                        }}
                        className={cn(
                            "group relative flex items-center gap-2 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-full",
                            "bg-white/[0.06] hover:bg-white/[0.1] text-neutral-300 hover:text-white",
                            "border border-white/[0.1] hover:border-white/[0.2]",
                            "shadow-[0_0_16px_rgba(255,255,255,0.05)] transition-all duration-200 cursor-pointer"
                        )}
                        aria-label="Open Command Palette"
                    >
                        <Search className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white transition-colors" />

                        <span className="text-xs sm:text-[13px] font-medium tracking-tight text-neutral-200 group-hover:text-white transition-colors whitespace-nowrap">
                            Search
                        </span>

                        {/* Apple Micro-Chip */}
                        <div className="flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-mono font-medium bg-white/[0.06] border border-white/[0.12] text-neutral-300">
                            <span>{isMac ? "⌘K" : "Ctrl+K"}</span>
                        </div>
                    </motion.button>
                </div>
            </motion.div>

            {/* RAYCAST / MACOS STYLE COMMAND PALETTE MODAL */}
            <AnimatePresence>
                {isPaletteOpen && (
                    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
                        {/* Backdrop Blur */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={() => setIsPaletteOpen(false)}
                            className="fixed inset-0 bg-black/80 backdrop-blur-md"
                        />

                        {/* Command Palette Dialog */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -20 }}
                            transition={{ type: "spring", stiffness: 450, damping: 30 }}
                            className={cn(
                                "relative w-full max-w-2xl overflow-hidden rounded-2xl sm:rounded-3xl",
                                "bg-[#08090d]/92 backdrop-blur-3xl",
                                "border border-white/[0.12]",
                                "shadow-[0_25px_80px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.06),inset_0_1px_1px_rgba(255,255,255,0.18)]",
                                "z-10 flex flex-col max-h-[82vh]"
                            )}
                        >
                            {/* Ambient dynamic glow behind dialog */}
                            <div className="absolute -inset-2 -z-10 bg-gradient-to-r from-blue-600/15 via-purple-600/15 to-emerald-600/15 rounded-3xl blur-3xl opacity-70 pointer-events-none" />

                            {/* Top Search Input Bar */}
                            <div className="relative flex items-center gap-3 px-5 py-4 border-b border-white/[0.08] bg-white/[0.02]">
                                <div className="relative flex items-center justify-center">
                                    <Search className="w-5 h-5 text-neutral-400 shrink-0" />
                                    <div className="absolute inset-0 bg-cyan-500/20 blur-md rounded-full pointer-events-none" />
                                </div>
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        setSelectedIndex(0);
                                    }}
                                    onKeyDown={handlePaletteKeyDown}
                                    placeholder="Type a command or search tools, courses, studios..."
                                    className="w-full bg-transparent text-white placeholder-neutral-500 text-sm sm:text-base font-normal tracking-tight focus:outline-none focus:ring-0 ring-0 border-0 outline-none"
                                />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={() => setSearchQuery("")}
                                        className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                                <kbd className="px-1.5 py-0.5 rounded-md text-[10px] font-mono font-medium text-neutral-400 bg-white/[0.05] border border-white/[0.1] shadow-sm shrink-0 select-none">
                                    ESC
                                </kbd>
                            </div>

                            {/* Commands Results List */}
                            <div className="overflow-y-auto max-h-[55vh] p-2 sm:p-3 space-y-1 scrollbar-thin [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.12)_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/20">
                                {filteredCommands.length === 0 ? (
                                    <div className="py-12 text-center">
                                        <Search className="w-8 h-8 text-neutral-600 mx-auto mb-3" />
                                        <p className="text-sm font-semibold text-neutral-300">No matching commands found</p>
                                        <p className="text-xs text-neutral-500 mt-1">Try searching for &quot;video&quot;, &quot;jobs&quot;, &quot;courses&quot;, or &quot;cafe&quot;</p>
                                    </div>
                                ) : (
                                    filteredCommands.map((cmd, idx) => {
                                        const Icon = cmd.icon;
                                        const isSelected = idx === selectedIndex;
                                        const isFirstInCategory = idx === 0 || filteredCommands[idx - 1].category !== cmd.category;

                                        return (
                                            <React.Fragment key={cmd.title}>
                                                {isFirstInCategory && (
                                                    <div className="px-3 pt-3 pb-1.5 flex items-center gap-2">
                                                        <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-neutral-400">
                                                            {cmd.category}
                                                        </span>
                                                        <div className="h-px flex-1 bg-white/[0.06]" />
                                                    </div>
                                                )}

                                                <div
                                                    ref={(el) => {
                                                        itemRefs.current[idx] = el;
                                                    }}
                                                    onClick={() => handleSelect(cmd)}
                                                    onMouseEnter={() => setSelectedIndex(idx)}
                                                    className={cn(
                                                        "group relative flex items-center justify-between p-2.5 sm:p-3 rounded-2xl cursor-pointer transition-all duration-150 select-none",
                                                        isSelected
                                                            ? "bg-white/[0.08] backdrop-blur-xl border border-white/[0.14] shadow-[0_8px_30px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.18)]"
                                                            : "bg-transparent border border-transparent hover:bg-white/[0.04] text-neutral-300"
                                                    )}
                                                >
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        {/* Icon Box with signature glow & gradient */}
                                                        <div
                                                            className={cn(
                                                                "w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200",
                                                                isSelected
                                                                    ? cn("bg-gradient-to-br text-white shadow-lg", cmd.color)
                                                                    : cn("bg-white/[0.05] border border-white/[0.08]", cmd.iconColor)
                                                            )}
                                                            style={{
                                                                boxShadow: isSelected && cmd.glowRgba
                                                                    ? `0 0 20px -2px ${cmd.glowRgba}`
                                                                    : undefined,
                                                            }}
                                                        >
                                                            <Icon className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
                                                        </div>

                                                        <div className="flex flex-col min-w-0">
                                                            <div className="flex items-center gap-2">
                                                                <span className={cn(
                                                                    "text-sm font-semibold tracking-tight transition-colors",
                                                                    isSelected ? "text-white" : "text-neutral-200"
                                                                )}>
                                                                    {cmd.title}
                                                                </span>
                                                                {cmd.badge && (
                                                                    <span
                                                                        className={cn(
                                                                            "px-2 py-0.5 text-[9px] font-mono font-medium rounded-full border transition-all",
                                                                            isSelected && cmd.badgeStyle
                                                                                ? cmd.badgeStyle
                                                                                : "bg-white/[0.04] text-neutral-400 border-white/[0.08]"
                                                                        )}
                                                                    >
                                                                        {cmd.badge}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <span className="text-xs text-neutral-400 truncate mt-0.5 font-normal">
                                                                {cmd.description}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2 shrink-0 ml-3">
                                                        {cmd.shortcut && (
                                                            <kbd className="min-w-[20px] h-5 px-1.5 flex items-center justify-center rounded-md text-[10px] font-mono font-medium text-neutral-400 bg-white/[0.04] border border-white/[0.08] shadow-sm">
                                                                {cmd.shortcut}
                                                            </kbd>
                                                        )}
                                                        {isSelected && (
                                                            <motion.div
                                                                initial={{ opacity: 0, x: -4 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/[0.1] border border-white/[0.15] text-white shadow-sm"
                                                            >
                                                                <span>Launch</span>
                                                                <CornerDownLeft className="w-3 h-3 text-neutral-300" />
                                                            </motion.div>
                                                        )}
                                                    </div>
                                                </div>
                                            </React.Fragment>
                                        );
                                    })
                                )}
                            </div>

                            {/* Bottom Footer Bar */}
                            <div className="flex items-center justify-between px-5 py-3 border-t border-white/[0.08] bg-[#08090d]/60 text-[11px] font-mono text-neutral-400 select-none">
                                <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                                    <span className="flex items-center gap-1.5">
                                        <kbd className="px-1.5 py-0.5 rounded-md bg-white/[0.06] border border-white/[0.1] text-neutral-300 text-[10px]">↑↓</kbd>
                                        <span>to navigate</span>
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <kbd className="px-1.5 py-0.5 rounded-md bg-white/[0.06] border border-white/[0.1] text-neutral-300 text-[10px]">↵</kbd>
                                        <span>to select</span>
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <kbd className="px-1.5 py-0.5 rounded-md bg-white/[0.06] border border-white/[0.1] text-neutral-300 text-[10px]">esc</kbd>
                                        <span>to close</span>
                                    </span>
                                </div>

                                <div className="hidden sm:flex items-center gap-2 text-neutral-400">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                                    <span>{filteredCommands.length} {filteredCommands.length === 1 ? "command" : "commands"}</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
