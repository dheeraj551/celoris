"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, User, LogOut, User as UserIcon, Wallet, BookOpen, GraduationCap, Tv, Briefcase, IndianRupee } from "lucide-react"
import { cn } from "@/lib/utils"
// removed createClient import as it is handled in useAuth
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/components/providers/AuthProvider"
import { Capacitor } from '@capacitor/core'
import { useEffect } from "react"

const publicNavigation = [
  { name: "Learn", href: "/learn" },
  { name: "Job Center", href: "/job-center" },
  { name: "Pricing", href: "/pricing" },
  { name: "Play", href: "/social" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
]

const authenticatedNavigation = [
  { name: "Learn", href: "/learn" },
  { name: "Job Center", href: "/job-center" },
  { name: "Pricing", href: "/pricing" },
  { name: "Play", href: "/social" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
]


export default function Header() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isNative, setIsNative] = useState(false)
  const { user, profile, loading, signOut } = useAuth()

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      setIsNative(true)
    }
  }, [])

  const isDashboardPage = pathname === "/" ||
    pathname?.startsWith("/learn") ||
    pathname?.startsWith("/earn") ||
    pathname?.startsWith("/social") ||
    pathname?.startsWith("/ai-explorer") ||
    pathname?.startsWith("/video-studio") ||
    pathname?.startsWith("/image-studio") ||
    pathname?.startsWith("/courses") ||
    pathname?.startsWith("/teach") ||
    pathname?.startsWith("/marketing") ||
    pathname?.startsWith("/vio-studio") ||
    pathname?.startsWith("/vibe-marketer") ||
    pathname?.startsWith("/marketing-studio") ||
    pathname?.startsWith("/celo-ai") ||
    pathname?.startsWith("/job-center") ||
    pathname?.startsWith("/celoris-tv") ||
    pathname?.startsWith("/photolite") ||
    pathname?.startsWith("/polyvault") ||
    pathname?.startsWith("/pricing") ||
    pathname === "/login" ||
    pathname === "/register";

  if (isNative || isDashboardPage) return null

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const isDarkPage = pathname === "/" ||
    pathname === "/about" ||
    pathname === "/contact" ||
    pathname === "/learn" ||
    pathname === "/earn" ||
    pathname === "/social" ||
    pathname === "/apps" ||
    pathname === "/ai-explorer" ||
    pathname === "/video-studio" ||
    pathname === "/image-studio" ||
    pathname === "/refund-policy" ||
    pathname === "/terms" ||
    pathname === "/privacy" ||
    pathname === "/cookies" ||
    pathname?.startsWith("/blog") ||
    pathname?.startsWith("/courses/")

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full transition-all duration-300",
      isDarkPage
        ? "border-b border-white/10 bg-[#050810]/90 backdrop-blur-xl text-white"
        : "border-b border-border bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/60"
    )}>
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <img
            src={isDarkPage ? "/celoris-logo.png" : "/celoris-logo-dark.png"}
            alt="Celoris Logo"
            className="h-8 sm:h-9 w-auto object-contain transition-all hover:opacity-80"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {(user ? authenticatedNavigation : publicNavigation).map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "text-sm font-black uppercase tracking-widest transition-colors italic",
                pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
                  ? "text-emerald-500"
                  : isDarkPage ? "text-slate-300 hover:text-white" : "text-text-secondary hover:text-primary-500"
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* CTA Buttons / User Menu */}
        <div className="hidden md:flex items-center space-x-4">
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="animate-pulse bg-emerald-500/20 h-8 w-8 rounded-full"></div>
            </div>
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                  <Avatar className="h-10 w-10" key={profile?.avatar_url || 'default'}>
                    <AvatarImage
                      src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.full_name || user.email || 'User')}&background=6366f1&color=fff`}
                      alt={profile?.full_name || 'User'}
                    />
                    <AvatarFallback className="bg-blue-500 text-white">
                      {profile?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-64 bg-[#08090d]/95 backdrop-blur-3xl border border-white/[0.12] text-slate-200 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.95),inset_0_1px_1px_rgba(255,255,255,0.18)] z-50 p-2 mt-2"
                forceMount
              >
                {/* User Profile Card */}
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] mb-2 flex items-center gap-2.5">
                  <Avatar className="h-9 w-9 border border-white/15 shrink-0 shadow-sm" key={profile?.avatar_url || 'default'}>
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
            <>
              <Button
                variant="ghost"
                asChild
                className={cn(
                  "font-black uppercase tracking-widest text-[10px] italic",
                  isDarkPage ? "text-slate-600 hover:text-black hover:bg-slate-100" : ""
                )}
              >
                <Link href="/login">Sign In</Link>
              </Button>
              <Button
                asChild
                className={cn(
                  "font-black uppercase tracking-widest text-[10px] italic rounded-xl px-6 h-10 transition-all",
                  isDarkPage
                    ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-3xl shadow-emerald-500/20 border-none"
                    : ""
                )}
              >
                <Link href="/register">Get Started</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className={isDarkPage ? "text-white hover:bg-white/10" : ""}>
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <nav className="flex flex-col space-y-6 mt-6">
              <Link href="/" className="flex items-center">
                <img
                  src={isDarkPage ? "/celoris-logo.png" : "/celoris-logo-dark.png"}
                  alt="Celoris Logo"
                  className="h-8 w-auto object-contain"
                />
              </Link>
              <div className="flex flex-col space-y-4">
                {(user ? authenticatedNavigation : publicNavigation).map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "text-lg font-medium transition-colors hover:text-primary-500",
                      pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
                        ? "text-primary-500"
                        : "text-text-secondary"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* Mobile User Menu */}
              <div className="flex flex-col space-y-2 pt-4 border-t">
                {loading ? (
                  <div className="flex flex-col space-y-2">
                    <div className="animate-pulse bg-gray-200 h-10 w-full rounded"></div>
                  </div>
                ) : user ? (
                  <>
                    <Link
                      href="/learn"
                      className="flex items-center space-x-2 px-3 py-2 text-sm text-text-secondary hover:bg-gray-100 rounded-md"
                      onClick={() => setIsOpen(false)}
                    >
                      <BookOpen className="h-4 w-4" />
                      <span>Learn</span>
                    </Link>
                    <Link
                      href="/teach"
                      className="flex items-center space-x-2 px-3 py-2 text-sm text-text-secondary hover:bg-gray-100 rounded-md"
                      onClick={() => setIsOpen(false)}
                    >
                      <GraduationCap className="h-4 w-4" />
                      <span>Teach</span>
                    </Link>
                    <Link
                      href="/celoris-tv"
                      className="flex items-center space-x-2 px-3 py-2 text-sm text-text-secondary hover:bg-gray-100 rounded-md"
                      onClick={() => setIsOpen(false)}
                    >
                      <Tv className="h-4 w-4" />
                      <span>Celoris TV</span>
                    </Link>
                    <Link
                      href="/job-center"
                      className="flex items-center space-x-2 px-3 py-2 text-sm text-text-secondary hover:bg-gray-100 rounded-md"
                      onClick={() => setIsOpen(false)}
                    >
                      <Briefcase className="h-4 w-4" />
                      <span>Job Center</span>
                    </Link>
                    <Link
                      href="/social/profile"
                      className="flex items-center space-x-2 px-3 py-2 text-sm text-text-secondary hover:bg-gray-100 rounded-md"
                      onClick={() => setIsOpen(false)}
                    >
                      <UserIcon className="h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                    <Button variant="outline" className="mt-4" onClick={() => { handleSignOut(); setIsOpen(false); }}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" asChild>
                      <Link href="/login" onClick={() => setIsOpen(false)}>Sign In</Link>
                    </Button>
                    <Button asChild>
                      <Link href="/register" onClick={() => setIsOpen(false)}>Get Started</Link>
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
