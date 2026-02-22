"use client"

import React from 'react';
import { Sidebar } from './Sidebar';
import { Plus, ShoppingBag, Heart, Users, User as UserIcon, Wallet, LogOut, ThumbsUp } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/components/providers/AuthProvider';
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
    const [timeLeft, setTimeLeft] = React.useState({ h: 12, m: 45, s: 20 });

    React.useEffect(() => {
        // Simple logic to make it look persistent for the session or at least not reset to EXACT same value
        const now = new Date();
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const diff = endOfDay.getTime() - now.getTime();
        const h = Math.floor(diff / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);

        setTimeLeft({ h, m, s });

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                let { h, m, s } = prev;
                if (s > 0) s--;
                else if (m > 0) {
                    m--;
                    s = 59;
                } else if (h > 0) {
                    h--;
                    m = 59;
                    s = 59;
                } else {
                    clearInterval(timer);
                }
                return { h, m, s };
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="flex bg-[#050810] min-h-screen">
            <Sidebar />
            <div className="flex-1 min-h-screen text-slate-200 overflow-x-hidden">
                {/* Top Promo Banner */}
                <div className="bg-emerald-500/5 border-b border-white/5 py-2 hidden md:block">
                    <div className="container mx-auto px-6 flex items-center justify-center gap-4 text-[11px] font-medium text-emerald-400">
                        <span className="bg-emerald-600 text-white px-2 py-0.5 rounded-full text-[10px]">Limited-time offer</span>
                        <span>Celoris 3.0 is live. Save 60% on our Starter Yearly plan.</span>
                        <Link href="/register">
                            <button className="underline font-bold">Claim offer</button>
                        </Link>
                        <div className="h-4 w-px bg-white/10" />
                        <span>Offer ends in {timeLeft.h.toString().padStart(2, '0')}h : {timeLeft.m.toString().padStart(2, '0')}m : {timeLeft.s.toString().padStart(2, '0')}s</span>
                    </div>
                </div>

                {/* Top Navigation / Dashboard Header */}
                <header className="h-16 px-8 flex items-center justify-end gap-6 border-b border-white/5 sticky top-0 bg-[#050810]/80 backdrop-blur-md z-30">
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
                </header>

                <main>
                    {children}
                </main>
            </div>
        </div>
    )
}
