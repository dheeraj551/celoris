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
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogTitle
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';

export function TopHeader({ headerContent }: { headerContent?: React.ReactNode }) {
    const pathname = usePathname();
    const { user, profile, loading, signOut } = useAuth();
    const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleSignOut = async () => {
        try {
            await signOut();
            window.location.href = "/";
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    const isStudioActive = pathname.startsWith('/video-studio') || pathname.startsWith('/photolite') || pathname.startsWith('/polyvault');

    return (
        <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#08080c]/85 backdrop-blur-3xl shadow-[0_10px_30px_rgba(0,0,0,0.8),inset_0_-1px_0_rgba(255,255,255,0.06)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 sm:gap-4">

                {/* Left: Brand Logo & Tag */}
                <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <img
                            src="/celoris-logo.png"
                            alt="Celoris Logo"
                            className="h-7 sm:h-8 w-auto object-contain brightness-0 invert group-hover:scale-105 transition-transform duration-200"
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

                {/* Right: Actions, Support, Auth & Mobile Menu */}
                <div className="flex items-center gap-2 sm:gap-3">

                    {/* Support Pill Button (Apple Dynamic Nano-Glass Capsule) */}
                    <Dialog open={isSupportModalOpen} onOpenChange={setIsSupportModalOpen}>
                        <DialogTrigger asChild>
                            <button
                                type="button"
                                className="group relative hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-b from-rose-500/[0.16] to-rose-500/[0.08] hover:from-rose-500/[0.26] hover:to-rose-500/[0.16] border border-rose-400/40 hover:border-rose-300/70 text-rose-200 hover:text-white text-xs font-medium backdrop-blur-2xl shadow-[0_4px_16px_rgba(244,63,94,0.18),inset_0_1px_1px_rgba(255,255,255,0.22)] hover:shadow-[0_0_25px_rgba(244,63,94,0.45)] transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] cursor-pointer"
                            >
                                <div className="w-4 h-4 rounded-full bg-rose-500/20 border border-rose-400/50 flex items-center justify-center text-rose-300 group-hover:scale-110 transition-transform shadow-[0_0_8px_rgba(244,63,94,0.4)]">
                                    <Heart className="w-2.5 h-2.5 fill-rose-400 text-rose-400 animate-pulse" />
                                </div>
                                <span className="tracking-tight">Support</span>
                            </button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md bg-transparent border-none shadow-none flex justify-center items-center p-0">
                            <DialogTitle className="sr-only">Support Us</DialogTitle>
                            <div className="relative w-full max-h-[90vh] rounded-3xl overflow-hidden bg-[#fff5f0] p-2 border border-white/20 shadow-2xl">
                                <img
                                    src="/support.png"
                                    alt="Support us via QR Code"
                                    className="w-full h-auto max-h-[85vh] object-contain rounded-2xl"
                                />
                            </div>
                        </DialogContent>
                    </Dialog>

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
                                <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0 border border-white/10 overflow-hidden cursor-pointer">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage
                                            src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.full_name || user.email || 'User')}&background=10b981&color=fff`}
                                            alt={profile?.full_name || 'User'}
                                        />
                                        <AvatarFallback className="bg-emerald-500 text-white text-[10px]">
                                            {profile?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="end"
                                className="w-56 bg-[#08090d]/95 backdrop-blur-3xl border border-white/[0.12] text-slate-200 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9),inset_0_1px_1px_rgba(255,255,255,0.15)] z-50 mt-2"
                            >
                                <DropdownMenuLabel className="font-normal p-3">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-bold text-white leading-none italic uppercase">
                                            {profile?.full_name || user.email?.split('@')[0]}
                                        </p>
                                        <p className="text-[10px] leading-none text-slate-500 font-medium truncate">
                                            {user.email}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-white/5" />
                                <DropdownMenuItem asChild className="focus:bg-white/5 cursor-pointer rounded-xl mx-1">
                                    <Link href="/learn" className="flex items-center">
                                        <BookOpen className="mr-2 h-4 w-4 text-emerald-500" />
                                        <span className="text-xs font-bold uppercase tracking-tight italic">My Courses</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild className="focus:bg-white/5 cursor-pointer rounded-xl mx-1">
                                    <Link href="/teach" className="flex items-center">
                                        <GraduationCap className="mr-2 h-4 w-4 text-emerald-500" />
                                        <span className="text-xs font-bold uppercase tracking-tight italic">Teach</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild className="focus:bg-white/5 cursor-pointer rounded-xl mx-1">
                                    <Link href="/celoris-tv" className="flex items-center">
                                        <Tv className="mr-2 h-4 w-4 text-emerald-500" />
                                        <span className="text-xs font-bold uppercase tracking-tight italic">Celoris TV</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild className="focus:bg-white/5 cursor-pointer rounded-xl mx-1">
                                    <Link href="/job-center" className="flex items-center">
                                        <Briefcase className="mr-2 h-4 w-4 text-emerald-500" />
                                        <span className="text-xs font-bold uppercase tracking-tight italic">Job Center</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild className="focus:bg-white/5 cursor-pointer rounded-xl mx-1">
                                    <Link href="/social/profile" className="flex items-center">
                                        <UserIcon className="mr-2 h-4 w-4 text-emerald-500" />
                                        <span className="text-xs font-bold uppercase tracking-tight italic">Profile</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild className="focus:bg-white/5 cursor-pointer rounded-xl mx-1">
                                    <Link href="/account/payment-settings" className="flex items-center">
                                        <Wallet className="mr-2 h-4 w-4 text-emerald-500" />
                                        <span className="text-xs font-bold uppercase tracking-tight italic">Payment Settings</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-white/5" />
                                <DropdownMenuItem className="cursor-default focus:bg-transparent rounded-xl mx-1">
                                    <IndianRupee className="mr-2 h-4 w-4 text-emerald-500" />
                                    <span className="text-xs font-bold uppercase tracking-tight italic">Credits: ₹{profile?.wallet_balance || '0'}</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-white/5" />
                                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-rose-500 focus:text-rose-400 focus:bg-rose-500/10 rounded-xl mx-1">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span className="text-xs font-bold uppercase tracking-tight italic">Sign out</span>
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
                                        className="h-7 w-auto object-contain brightness-0 invert"
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
                                    </div>
                                </div>

                                {/* Support Card */}
                                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08]">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
                                        <span className="text-xs font-bold text-white">Support Celoris</span>
                                    </div>
                                    <p className="text-[11px] text-neutral-400 mb-3">
                                        Scan QR code to support our free creative tools for India.
                                    </p>
                                    <img
                                        src="/support.png"
                                        alt="Support QR"
                                        className="w-full h-auto rounded-xl bg-white p-1"
                                    />
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>

                </div>

            </div>
        </header>
    );
}
