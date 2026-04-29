"use client"

import React from 'react';
import { Sidebar } from './Sidebar';
import { Plus, ShoppingBag, Heart, Users, User as UserIcon, Wallet, LogOut, ThumbsUp, Mail, Phone, Menu } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/components/providers/AuthProvider';
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

export function DashboardShell({ children }: { children: React.ReactNode }) {
    const { user, profile, loading, signOut } = useAuth();

    const handleSignOut = async () => {
        try {
            await signOut();
            window.location.href = "/";
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };


    return (
        <div className="flex bg-[#050810] min-h-screen">
            <Sidebar className="hidden md:flex h-screen sticky top-0" />
            <div className="flex-1 min-h-screen text-slate-200 overflow-x-hidden">


                {/* Top Navigation / Dashboard Header */}
                <header className="h-16 px-4 md:px-8 flex items-center justify-between gap-6 border-b border-white/5 sticky top-0 bg-[#050810]/80 backdrop-blur-md z-30">
                    {/* Mobile Sidebar Trigger */}
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="md:hidden text-slate-400 hover:text-white hover:bg-white/5">
                                <Menu className="w-5 h-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0 bg-[#050810] border-white/5 w-64">
                            <SheetHeader className="sr-only">
                                <SheetTitle>Navigation Menu</SheetTitle>
                                <SheetDescription>Access different sections of the Celoris dashboard</SheetDescription>
                            </SheetHeader>
                            <Sidebar className="flex h-full w-full border-none" />
                        </SheetContent>
                    </Sheet>

                    {/* Centered Support Info */}
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-1 bg-white/5 border border-white/10 px-4 py-1.5 rounded-card-full backdrop-blur-sm"
                    >
                        <motion.a 
                            whileHover={{ scale: 1.05, color: "#10b981" }}
                            href="mailto:support@celorisdesigns.com" 
                            className="flex items-center gap-2 text-[10px] font-bold text-slate-400 transition-colors uppercase tracking-widest italic px-2"
                        >
                            <Mail className="w-3.5 h-3.5" />
                            support@celorisdesigns.com
                        </motion.a>
                        <div className="h-3 w-px bg-white/10 mx-1" />
                        <motion.a 
                            whileHover={{ scale: 1.05, color: "#10b981" }}
                            href="tel:+919084718101" 
                            className="flex items-center gap-2 text-[10px] font-bold text-slate-400 transition-colors uppercase tracking-widest italic px-2"
                        >
                            <Phone className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                            +91 90847 18101
                        </motion.a>
                    </motion.div>

                    <div className="flex-1" /> {/* Spacer to keep the user menu to the right */}

                    <div className="flex items-center gap-6">
                        {user && (
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-xs font-bold text-emerald-400">
                                    <Plus className="w-3 h-3" />
                                    {profile?.wallet_balance?.toString() || '0'} Credits
                                </div>
                            </div>
                        )}
                        <div className="flex items-center gap-4">

                            {loading ? (
                                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 animate-pulse" />
                            ) : user ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0 border border-white/10 overflow-hidden">
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
                                    <DropdownMenuContent className="w-56 bg-[#0d1321] border-white/5 text-slate-200" align="end" forceMount>
                                        <DropdownMenuLabel className="font-normal">
                                            <div className="flex flex-col space-y-1">
                                                <p className="text-sm font-bold text-white leading-none italic uppercase">
                                                    {profile?.full_name || user.email?.split('@')[0]}
                                                </p>
                                                <p className="text-[10px] leading-none text-slate-500 font-medium">
                                                    {user.email}
                                                </p>
                                            </div>
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator className="bg-white/5" />
                                        <DropdownMenuItem asChild className="focus:bg-white/5 cursor-pointer">
                                            <Link href="/social/swipe" className="flex items-center">
                                                <Heart className="mr-2 h-4 w-4 text-emerald-500" />
                                                <span className="text-xs font-bold uppercase tracking-tight italic">Discover</span>
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild className="focus:bg-white/5 cursor-pointer">
                                            <Link href="/social/matches" className="flex items-center">
                                                <Users className="mr-2 h-4 w-4 text-emerald-500" />
                                                <span className="text-xs font-bold uppercase tracking-tight italic">Matches</span>
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild className="focus:bg-white/5 cursor-pointer">
                                            <Link href="/social/likes" className="flex items-center">
                                                <ThumbsUp className="mr-2 h-4 w-4 text-emerald-500" />
                                                <span className="text-xs font-bold uppercase tracking-tight italic">Likes</span>
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild className="focus:bg-white/5 cursor-pointer">
                                            <Link href="/social/profile" className="flex items-center">
                                                <UserIcon className="mr-2 h-4 w-4 text-emerald-500" />
                                                <span className="text-xs font-bold uppercase tracking-tight italic">Profile</span>
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator className="bg-white/5" />
                                        <DropdownMenuItem className="cursor-default focus:bg-transparent">
                                            <Wallet className="mr-2 h-4 w-4 text-emerald-500" />
                                            <span className="text-xs font-bold uppercase tracking-tight italic">Credits: {profile?.wallet_balance || '0'}</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator className="bg-white/5" />
                                        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-rose-500 focus:text-rose-400 focus:bg-rose-500/10">
                                            <LogOut className="mr-2 h-4 w-4" />
                                            <span className="text-xs font-bold uppercase tracking-tight italic">Sign out</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <Link href="/login">
                                    <Button size="sm" className="h-8 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-lg">
                                        Sign In
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>
                </header>


                <main>
                    {children}
                </main>
            </div>
        </div>
    )
}
