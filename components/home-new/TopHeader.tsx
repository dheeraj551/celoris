"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Video,
    Image as ImageIcon,
    Box,
    BookOpen,
    GraduationCap,
    Tv,
    Coffee,
    Briefcase,
    Info,
    Mail,
    Lightbulb,
    ChevronDown,
    Menu,
    Heart,
    Plus,
    LogIn,
    LogOut,
    Wallet,
    User as UserIcon,
    Sparkles,
    Search,
    X,
    IndianRupee,
    ArrowLeftRight,
    Megaphone,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/components/providers/AuthProvider';
import { cn } from '@/lib/utils';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetTrigger,
} from "@/components/ui/sheet";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';

export function TopHeader({ headerContent }: { headerContent?: React.ReactNode }) {
    const pathname = usePathname();
    const { user, profile, loading, signOut } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleSignOut = async () => {
        try {
            await signOut();
            window.location.href = "/";
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    const isStudioActive = pathname.startsWith('/video-studio') || pathname.startsWith('/photolite') || pathname.startsWith('/polyvault') || pathname.startsWith('/vio-studio') || pathname.startsWith('/marketing-studio') || pathname.startsWith('/vibe-marketer') || pathname.startsWith('/genjutsu') || pathname.startsWith('/motion-swap');

    return (
        <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#08080c]/85 backdrop-blur-3xl shadow-[0_10px_30px_rgba(0,0,0,0.8),inset_0_-1px_0_rgba(255,255,255,0.06)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 sm:gap-4">

                {/* Left: Brand Logo & Tag */}
                <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <img
                            src="/celoris-logo.png"
                            alt="Celoris Logo"
                            className="h-8 sm:h-9 w-auto object-contain group-hover:scale-105 transition-transform duration-200"
                        />
                    </Link>

                    <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-[9px] font-mono font-medium text-neutral-400 uppercase tracking-widest pointer-events-none">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                        <span>Studio Suite</span>
                    </div>
                </div>

                {/* Center: Desktop Navigation Links & Dropdowns */}
                <nav className="hidden lg:flex items-center gap-1">
                    {/* Creative Studios Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                type="button"
                                className={cn(
                                    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer select-none",
                                    isStudioActive
                                        ? "bg-blue-500/15 border border-blue-400/30 text-blue-200 shadow-[0_0_15px_rgba(59,130,246,0.2)]"
                                        : "text-neutral-300 hover:text-white hover:bg-white/[0.06] border border-transparent"
                                )}
                            >
                                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                                <span>Studios</span>
                                <ChevronDown className="w-3 h-3 text-neutral-400" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="start"
                            className="w-72 bg-[#08090d]/95 backdrop-blur-3xl border border-white/[0.12] p-1.5 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9),inset_0_1px_1px_rgba(255,255,255,0.15)] text-slate-200 z-50 mt-2"
                        >
                            <DropdownMenuItem asChild className="rounded-xl p-2.5 hover:bg-white/[0.06] cursor-pointer focus:bg-white/[0.06] transition-colors">
                                <Link href="/motion-swap" className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-[#d4f634]/15 border border-[#d4f634]/30 flex items-center justify-center text-[#d4f634] shrink-0">
                                        <ArrowLeftRight className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-white">Motion Swap Studio</span>
                                            <span className="text-[9px] font-mono font-bold text-[#d4f634] bg-[#d4f634]/10 px-1.5 py-0.5 rounded-full">New</span>
                                        </div>
                                        <p className="text-[10px] text-neutral-400 truncate">Motion transfer & object swap</p>
                                    </div>
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuItem asChild className="rounded-xl p-2.5 hover:bg-white/[0.06] cursor-pointer focus:bg-white/[0.06] transition-colors">
                                <Link href="/vio-studio" className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-[#D4FF00]/15 border border-[#D4FF00]/30 flex items-center justify-center text-[#D4FF00] shrink-0">
                                        <Megaphone className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-white">ViO Studio</span>
                                            <span className="text-[9px] font-mono font-bold text-[#D4FF00] bg-[#D4FF00]/10 px-1.5 py-0.5 rounded-full">Marketing</span>
                                        </div>
                                        <p className="text-[10px] text-neutral-400 truncate">Product ads & viral content</p>
                                    </div>
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuItem asChild className="rounded-xl p-2.5 hover:bg-white/[0.06] cursor-pointer focus:bg-white/[0.06] transition-colors">
                                <Link href="/video-studio" className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                                        <Video className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-white">Video Studio</span>
                                            <span className="text-[9px] font-mono font-bold text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded-full">4K AI</span>
                                        </div>
                                        <p className="text-[10px] text-neutral-400 truncate">Timeline & generative video</p>
                                    </div>
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuItem asChild className="rounded-xl p-2.5 hover:bg-white/[0.06] cursor-pointer focus:bg-white/[0.06] transition-colors">
                                <Link href="/photolite" className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                                        <ImageIcon className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-white">PhotoLite AI</span>
                                            <span className="text-[9px] font-mono font-bold text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded-full">Retouch</span>
                                        </div>
                                        <p className="text-[10px] text-neutral-400 truncate">Filters, cutouts & enhancements</p>
                                    </div>
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuItem asChild className="rounded-xl p-2.5 hover:bg-white/[0.06] cursor-pointer focus:bg-white/[0.06] transition-colors">
                                <Link href="/polyvault" className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                                        <Box className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-white">PolyVault</span>
                                            <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">3D Vault</span>
                                        </div>
                                        <p className="text-[10px] text-neutral-400 truncate">Meshes, textures & materials</p>
                                    </div>
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Learn */}
                    <Link
                        href="/learn"
                        className={cn(
                            "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200",
                            pathname.startsWith('/learn')
                                ? "bg-emerald-500/15 border border-emerald-400/30 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                                : "text-neutral-300 hover:text-white hover:bg-white/[0.06] border border-transparent"
                        )}
                    >
                        <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Learn</span>
                    </Link>

                    {/* Celoris TV */}
                    <Link
                        href="/celoris-tv"
                        className={cn(
                            "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200",
                            pathname.startsWith('/celoris-tv')
                                ? "bg-red-500/15 border border-red-400/30 text-red-200 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                                : "text-neutral-300 hover:text-white hover:bg-white/[0.06] border border-transparent"
                        )}
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_6px_rgba(239,68,68,0.8)]" />
                        <span>Celoris TV</span>
                    </Link>

                    {/* Teach */}
                    <Link
                        href="/teach"
                        className={cn(
                            "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200",
                            pathname.startsWith('/teach')
                                ? "bg-emerald-500/15 border border-emerald-400/30 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                                : "text-neutral-300 hover:text-white hover:bg-white/[0.06] border border-transparent"
                        )}
                    >
                        <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Teach</span>
                    </Link>

                    {/* Cafe */}
                    <Link
                        href="/social"
                        className={cn(
                            "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200",
                            pathname.startsWith('/social')
                                ? "bg-rose-500/15 border border-rose-400/30 text-rose-200 shadow-[0_0_15px_rgba(244,63,94,0.2)]"
                                : "text-neutral-300 hover:text-white hover:bg-white/[0.06] border border-transparent"
                        )}
                    >
                        <Coffee className="w-3.5 h-3.5 text-rose-400" />
                        <span>Café</span>
                    </Link>

                    {/* Job Center */}
                    <Link
                        href="/job-center"
                        className={cn(
                            "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200",
                            pathname.startsWith('/job-center')
                                ? "bg-amber-500/15 border border-amber-400/30 text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                                : "text-neutral-300 hover:text-white hover:bg-white/[0.06] border border-transparent"
                        )}
                    >
                        <Briefcase className="w-3.5 h-3.5 text-amber-400" />
                        <span>Jobs</span>
                    </Link>

                    {/* Company / More Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                type="button"
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium text-neutral-400 hover:text-white hover:bg-white/[0.06] transition-all duration-200 cursor-pointer select-none"
                            >
                                <span>More</span>
                                <ChevronDown className="w-3 h-3" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="end"
                            className="w-48 bg-[#08090d]/95 backdrop-blur-3xl border border-white/[0.12] p-1.5 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9),inset_0_1px_1px_rgba(255,255,255,0.15)] text-slate-200 z-50 mt-2"
                        >
                            <DropdownMenuItem asChild className="rounded-xl p-2 hover:bg-white/[0.06] cursor-pointer focus:bg-white/[0.06] transition-colors">
                                <Link href="/about" className="flex items-center gap-2.5 text-xs text-neutral-300 hover:text-white">
                                    <Info className="w-3.5 h-3.5 text-blue-400" />
                                    <span>About Us</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild className="rounded-xl p-2 hover:bg-white/[0.06] cursor-pointer focus:bg-white/[0.06] transition-colors">
                                <Link href="/contact" className="flex items-center gap-2.5 text-xs text-neutral-300 hover:text-white">
                                    <Mail className="w-3.5 h-3.5 text-emerald-400" />
                                    <span>Contact Us</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild className="rounded-xl p-2 hover:bg-white/[0.06] cursor-pointer focus:bg-white/[0.06] transition-colors">
                                <Link href="/blog" className="flex items-center gap-2.5 text-xs text-neutral-300 hover:text-white">
                                    <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                                    <span>Blog & Stories</span>
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </nav>

                {/* Right: Actions, Pricing, Auth & Mobile Menu */}
                <div className="flex items-center gap-2 sm:gap-3">

                    {/* Pricing Pill Button (Apple Dynamic Nano-Glass Capsule) */}
                    <Link
                        href="/pricing"
                        className="group relative hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-b from-purple-500/[0.16] to-purple-500/[0.08] hover:from-purple-500/[0.26] hover:to-purple-500/[0.16] border border-purple-400/40 hover:border-purple-300/70 text-purple-200 hover:text-white text-xs font-medium backdrop-blur-2xl shadow-[0_4px_16px_rgba(168,85,247,0.18),inset_0_1px_1px_rgba(255,255,255,0.22)] hover:shadow-[0_0_25px_rgba(168,85,247,0.45)] transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] cursor-pointer"
                    >
                        <div className="w-4 h-4 rounded-full bg-purple-500/20 border border-purple-400/50 flex items-center justify-center text-purple-300 group-hover:scale-110 transition-transform shadow-[0_0_8px_rgba(168,85,247,0.4)]">
                            <IndianRupee className="w-2.5 h-2.5 stroke-[2.5]" />
                        </div>
                        <span className="tracking-tight">Pricing</span>
                    </Link>

                    {/* Credits Counter (Apple Dynamic Island Nano-Glass Wallet Pill) */}
                    {user && (
                        <Link
                            href="/account/payment-settings"
                            className="group relative hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-b from-white/[0.08] to-white/[0.03] hover:from-white/[0.12] hover:to-white/[0.06] backdrop-blur-2xl border border-white/[0.14] hover:border-emerald-400/50 text-neutral-200 hover:text-white text-xs font-medium shadow-[0_4px_16px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.22)] hover:shadow-[0_0_20px_rgba(16,185,129,0.25)] transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] cursor-pointer select-none"
                            title="View Credits & Payment Settings"
                        >
                            <div className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform shadow-[0_0_8px_rgba(52,211,153,0.5)]">
                                <IndianRupee className="w-2.5 h-2.5 stroke-[2.5]" />
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="font-mono font-bold text-white text-xs tracking-tight">
                                    {profile?.wallet_balance?.toString() || '0'}
                                </span>
                                <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">
                                    Credits
                                </span>
                            </div>
                        </Link>
                    )}

                    {/* Auth Status: Avatar or Sign In */}
                    {loading ? (
                        <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 animate-pulse" />
                    ) : user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="relative h-8 w-8 rounded-full p-0 border border-white/20 hover:border-emerald-400/60 transition-all duration-300 hover:scale-105 shadow-[0_0_12px_rgba(0,0,0,0.5)] hover:shadow-[0_0_16px_rgba(16,185,129,0.35)] cursor-pointer overflow-hidden group"
                                >
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage
                                            src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.full_name || user.email || 'User')}&background=10b981&color=fff`}
                                            alt={profile?.full_name || 'User'}
                                        />
                                        <AvatarFallback className="bg-gradient-to-tr from-emerald-500 to-teal-400 text-black font-bold text-[10px]">
                                            {profile?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="end"
                                className="w-64 bg-[#08090d]/95 backdrop-blur-3xl border border-white/[0.12] text-slate-200 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.95),inset_0_1px_1px_rgba(255,255,255,0.18)] z-50 p-2 mt-2"
                            >
                                {/* User Profile Card */}
                                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] mb-2 flex items-center gap-2.5">
                                    <Avatar className="h-9 w-9 border border-white/15 shrink-0 shadow-sm">
                                        <AvatarImage
                                            src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.full_name || user.email || 'User')}&background=10b981&color=fff`}
                                            alt={profile?.full_name || 'User'}
                                        />
                                        <AvatarFallback className="bg-gradient-to-tr from-emerald-500 to-teal-400 text-black font-bold text-xs">
                                            {profile?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-1">
                                            <p className="text-xs font-bold text-white tracking-tight truncate">
                                                {profile?.full_name || user.email?.split('@')[0]}
                                            </p>
                                            <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-400/25 px-1.5 py-0.5 rounded-full shrink-0">
                                                Active
                                            </span>
                                        </div>
                                        <p className="text-[10px] text-neutral-400 truncate mt-0.5 font-normal">
                                            {user.email}
                                        </p>
                                    </div>
                                </div>

                                {/* Quick Wallet Balance */}
                                <Link
                                    href="/account/payment-settings"
                                    className="mx-0.5 mb-2 p-2 rounded-xl bg-gradient-to-r from-emerald-500/[0.10] via-teal-500/[0.06] to-transparent hover:from-emerald-500/[0.16] hover:via-teal-500/[0.10] border border-emerald-500/25 hover:border-emerald-400/40 transition-all flex items-center justify-between group/wallet cursor-pointer"
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 group-hover/wallet:scale-105 transition-transform shadow-[0_0_8px_rgba(52,211,153,0.3)]">
                                            <IndianRupee className="w-3 h-3 stroke-[2.5]" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-neutral-400 leading-none font-medium">Wallet Credits</p>
                                            <p className="text-xs font-mono font-bold text-white leading-tight mt-0.5">
                                                ₹{profile?.wallet_balance || '0'} <span className="text-[9px] font-sans font-semibold text-emerald-400">Available</span>
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-semibold text-emerald-300 group-hover/wallet:text-white px-2 py-0.5 rounded-md bg-emerald-500/20 group-hover/wallet:bg-emerald-500/30 border border-emerald-400/30 transition-all">
                                        Manage →
                                    </span>
                                </Link>

                                <div className="h-[1px] bg-white/[0.08] mb-1.5" />

                                {/* Menu Items */}
                                <div className="space-y-0.5">
                                    <DropdownMenuItem asChild className="rounded-xl p-2 hover:bg-white/[0.06] focus:bg-white/[0.06] cursor-pointer transition-colors">
                                        <Link href="/learn" className="flex items-center gap-2.5">
                                            <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                                                <BookOpen className="w-3.5 h-3.5" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <span className="text-xs font-semibold text-neutral-200 group-hover:text-white block">My Courses</span>
                                                <span className="text-[10px] text-neutral-400 block -mt-0.5 font-normal">Classes &amp; curriculum</span>
                                            </div>
                                        </Link>
                                    </DropdownMenuItem>

                                    <DropdownMenuItem asChild className="rounded-xl p-2 hover:bg-white/[0.06] focus:bg-white/[0.06] cursor-pointer transition-colors">
                                        <Link href="/teach" className="flex items-center gap-2.5">
                                            <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                                                <GraduationCap className="w-3.5 h-3.5" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <span className="text-xs font-semibold text-neutral-200 group-hover:text-white block">Teach</span>
                                                <span className="text-[10px] text-neutral-400 block -mt-0.5 font-normal">Instructor dashboard</span>
                                            </div>
                                        </Link>
                                    </DropdownMenuItem>

                                    <DropdownMenuItem asChild className="rounded-xl p-2 hover:bg-white/[0.06] focus:bg-white/[0.06] cursor-pointer transition-colors">
                                        <Link href="/celoris-tv" className="flex items-center gap-2.5">
                                            <div className="w-7 h-7 rounded-lg bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
                                                <Tv className="w-3.5 h-3.5" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <span className="text-xs font-semibold text-neutral-200 group-hover:text-white block">Celoris TV</span>
                                                <span className="text-[10px] text-neutral-400 block -mt-0.5 font-normal">24/7 creative stream</span>
                                            </div>
                                        </Link>
                                    </DropdownMenuItem>

                                    <DropdownMenuItem asChild className="rounded-xl p-2 hover:bg-white/[0.06] focus:bg-white/[0.06] cursor-pointer transition-colors">
                                        <Link href="/job-center" className="flex items-center gap-2.5">
                                            <div className="w-7 h-7 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                                                <Briefcase className="w-3.5 h-3.5" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <span className="text-xs font-semibold text-neutral-200 group-hover:text-white block">Job Center</span>
                                                <span className="text-[10px] text-neutral-400 block -mt-0.5 font-normal">Freelance gigs &amp; contracts</span>
                                            </div>
                                        </Link>
                                    </DropdownMenuItem>

                                    <DropdownMenuItem asChild className="rounded-xl p-2 hover:bg-white/[0.06] focus:bg-white/[0.06] cursor-pointer transition-colors">
                                        <Link href="/social/profile" className="flex items-center gap-2.5">
                                            <div className="w-7 h-7 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                                                <UserIcon className="w-3.5 h-3.5" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <span className="text-xs font-semibold text-neutral-200 group-hover:text-white block">Profile</span>
                                                <span className="text-[10px] text-neutral-400 block -mt-0.5 font-normal">Creator portfolio</span>
                                            </div>
                                        </Link>
                                    </DropdownMenuItem>

                                    <DropdownMenuItem asChild className="rounded-xl p-2 hover:bg-white/[0.06] focus:bg-white/[0.06] cursor-pointer transition-colors">
                                        <Link href="/account/payment-settings" className="flex items-center gap-2.5">
                                            <div className="w-7 h-7 rounded-lg bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0">
                                                <Wallet className="w-3.5 h-3.5" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <span className="text-xs font-semibold text-neutral-200 group-hover:text-white block">Payment Settings</span>
                                                <span className="text-[10px] text-neutral-400 block -mt-0.5 font-normal">Bank, UPI &amp; GST info</span>
                                            </div>
                                        </Link>
                                    </DropdownMenuItem>
                                </div>

                                <div className="h-[1px] bg-white/[0.08] my-1.5" />

                                {/* Sign Out */}
                                <DropdownMenuItem
                                    onClick={handleSignOut}
                                    className="rounded-xl p-2 text-neutral-400 hover:text-rose-300 hover:bg-rose-500/10 focus:text-rose-300 focus:bg-rose-500/10 cursor-pointer transition-colors flex items-center gap-2.5"
                                >
                                    <div className="w-7 h-7 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
                                        <LogOut className="w-3.5 h-3.5" />
                                    </div>
                                    <span className="text-xs font-semibold">Sign Out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Link href="/login">
                            <Button
                                size="sm"
                                className="h-8 sm:h-9 px-4 sm:px-5 gap-1.5 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black text-[10px] font-black uppercase tracking-widest rounded-full shadow-[0_0_18px_rgba(16,185,129,0.35)] hover:shadow-[0_0_26px_rgba(16,185,129,0.55)] transition-all duration-300 hover:scale-105 cursor-pointer"
                            >
                                <LogIn className="w-3.5 h-3.5" />
                                <span>Sign In</span>
                            </Button>
                        </Link>
                    )}

                    {/* Mobile Navigation Drawer Trigger */}
                    <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="lg:hidden text-slate-300 hover:text-white hover:bg-white/10 rounded-full w-9 h-9 cursor-pointer"
                                aria-label="Open Navigation Menu"
                            >
                                <Menu className="w-5 h-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent
                            side="right"
                            className="p-0 bg-[#08090d]/98 backdrop-blur-3xl border-l border-white/10 w-80 text-slate-200 overflow-y-auto"
                        >
                            <SheetHeader className="p-6 border-b border-white/10 text-left">
                                <div className="flex items-center justify-between">
                                    <img
                                        src="/celoris-logo.png"
                                        alt="Celoris Logo"
                                        className="h-8 w-auto object-contain"
                                    />
                                </div>
                                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                                <SheetDescription className="text-xs text-neutral-400 mt-1">
                                    Free creative tools, AI models &amp; courses
                                </SheetDescription>
                            </SheetHeader>

                            <div className="p-6 space-y-6">
                                {/* Creative Studio Section */}
                                <div>
                                    <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-400 mb-3">
                                        Creative Studios
                                    </h4>
                                    <div className="space-y-1">
                                        <Link
                                            href="/motion-swap"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-colors"
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-[#d4f634]/15 border border-[#d4f634]/30 flex items-center justify-center text-[#d4f634]">
                                                <ArrowLeftRight className="w-4 h-4" />
                                            </div>
                                            <div className="flex-1">
                                                <span className="text-sm font-bold text-white block">Motion Swap Studio</span>
                                                <span className="text-[10px] text-neutral-400">Motion Transfer & Object Swap</span>
                                            </div>
                                        </Link>
                                        <Link
                                            href="/vio-studio"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-colors"
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-[#D4FF00]/15 border border-[#D4FF00]/30 flex items-center justify-center text-[#D4FF00]">
                                                <Megaphone className="w-4 h-4" />
                                            </div>
                                            <div className="flex-1">
                                                <span className="text-sm font-bold text-white block">ViO Studio</span>
                                                <span className="text-[10px] text-neutral-400">AI Marketing Studio</span>
                                            </div>
                                        </Link>
                                        <Link
                                            href="/video-studio"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-colors"
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
                                                <Video className="w-4 h-4" />
                                            </div>
                                            <div className="flex-1">
                                                <span className="text-sm font-bold text-white block">Video Studio</span>
                                                <span className="text-[10px] text-neutral-400">4K AI Editor</span>
                                            </div>
                                        </Link>
                                        <Link
                                            href="/photolite"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-colors"
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                                                <ImageIcon className="w-4 h-4" />
                                            </div>
                                            <div className="flex-1">
                                                <span className="text-sm font-bold text-white block">PhotoLite AI</span>
                                                <span className="text-[10px] text-neutral-400">Photo Retouch</span>
                                            </div>
                                        </Link>
                                        <Link
                                            href="/polyvault"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-colors"
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                                                <Box className="w-4 h-4" />
                                            </div>
                                            <div className="flex-1">
                                                <span className="text-sm font-bold text-white block">PolyVault</span>
                                                <span className="text-[10px] text-neutral-400">3D Asset Repository</span>
                                            </div>
                                        </Link>
                                    </div>
                                </div>

                                {/* Explore & Community Section */}
                                <div>
                                    <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-400 mb-3">
                                        Ecosystem
                                    </h4>
                                    <div className="space-y-1">
                                        <Link
                                            href="/learn"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 text-slate-300 hover:text-white transition-colors"
                                        >
                                            <BookOpen className="w-4 h-4 text-emerald-400" />
                                            <span className="text-sm font-medium">Learn</span>
                                        </Link>
                                        <Link
                                            href="/celoris-tv"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 text-slate-300 hover:text-white transition-colors"
                                        >
                                            <Tv className="w-4 h-4 text-red-400" />
                                            <span className="text-sm font-medium">Celoris TV</span>
                                        </Link>
                                        <Link
                                            href="/teach"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 text-slate-300 hover:text-white transition-colors"
                                        >
                                            <GraduationCap className="w-4 h-4 text-emerald-400" />
                                            <span className="text-sm font-medium">Teach</span>
                                        </Link>
                                        <Link
                                            href="/social"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 text-slate-300 hover:text-white transition-colors"
                                        >
                                            <Coffee className="w-4 h-4 text-rose-400" />
                                            <span className="text-sm font-medium">Café</span>
                                        </Link>
                                        <Link
                                            href="/job-center"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 text-slate-300 hover:text-white transition-colors"
                                        >
                                            <Briefcase className="w-4 h-4 text-amber-400" />
                                            <span className="text-sm font-medium">Job Center</span>
                                        </Link>
                                        <Link
                                            href="/pricing"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 text-slate-300 hover:text-white transition-colors"
                                        >
                                            <IndianRupee className="w-4 h-4 text-purple-400 stroke-[2.5]" />
                                            <span className="text-sm font-medium">Pricing &amp; Plans</span>
                                        </Link>
                                    </div>
                                </div>

                                {/* Pricing & Plans Card */}
                                <Link
                                    href="/pricing"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block p-3.5 rounded-2xl bg-gradient-to-br from-purple-500/15 via-indigo-500/10 to-emerald-500/10 border border-purple-500/25 hover:border-purple-400/50 transition-all group shadow-[0_10px_25px_rgba(0,0,0,0.5)]"
                                >
                                    <div className="flex items-center justify-between mb-1.5">
                                        <div className="flex items-center gap-2">
                                            <IndianRupee className="w-4 h-4 text-purple-400 stroke-[2.5]" />
                                            <span className="text-xs font-bold text-white">AI Tools &amp; Plans</span>
                                        </div>
                                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                            From ₹0
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-neutral-400 mb-2.5 leading-relaxed">
                                        Free tier, unlimited models, 100% free classes &amp; zero-fee job portal.
                                    </p>
                                    <div className="text-[11px] font-bold text-purple-300 group-hover:text-purple-200 flex items-center gap-1.5">
                                        <span>Explore Plans &amp; Pricing</span>
                                        <span>→</span>
                                    </div>
                                </Link>
                            </div>
                        </SheetContent>
                    </Sheet>

                </div>

            </div>
        </header>
    );
}
