"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, User, LogOut, Heart, Users, User as UserIcon, Wallet, ThumbsUp } from "lucide-react"
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
  { name: "Earn", href: "/earn" },
  { name: "Play", href: "/social" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
]

const authenticatedNavigation = [
  { name: "Learn", href: "/learn" },
  { name: "Earn", href: "/earn" },
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
    pathname?.startsWith("/celoris-3d") ||
    pathname?.startsWith("/courses") ||
    pathname?.startsWith("/teach") ||
    pathname?.startsWith("/marketing") ||
    pathname?.startsWith("/celo-ai") ||
    pathname?.startsWith("/job-center") ||
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
    pathname?.startsWith("/blog") ||
    pathname?.startsWith("/courses/")

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full transition-all duration-300",
      isDarkPage
        ? "border-b border-slate-200 bg-white/90 backdrop-blur-xl"
        : "border-b border-border bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/60"
    )}>
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <img
            src="/celoris-logo.png"
            alt="Celoris Logo"
            className="h-8 w-auto object-contain transition-all hover:opacity-80"
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
                  : isDarkPage ? "text-slate-600 hover:text-black" : "text-text-secondary hover:text-primary-500"
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
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {profile?.full_name || user.email}
                    </p>
                    {profile?.full_name && (
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/social/swipe" className="cursor-pointer">
                    <Heart className="mr-2 h-4 w-4" />
                    <span>Discover</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/social/matches" className="cursor-pointer">
                    <Users className="mr-2 h-4 w-4" />
                    <span>Matches</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/social/likes" className="cursor-pointer">
                    <ThumbsUp className="mr-2 h-4 w-4" />
                    <span>Likes</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/social/profile" className="cursor-pointer">
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-default focus:bg-transparent">
                  <Wallet className="mr-2 h-4 w-4 text-emerald-500" />
                  <span className="text-xs font-bold uppercase tracking-tight italic">Credits: {profile?.wallet_balance || '0'}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600 focus:text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
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
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <nav className="flex flex-col space-y-6 mt-6">
              <Link href="/" className="flex items-center">
                <img
                  src="/celoris-logo.png"
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
                      href="/social/swipe"
                      className="flex items-center space-x-2 px-3 py-2 text-sm text-text-secondary hover:bg-gray-100 rounded-md"
                      onClick={() => setIsOpen(false)}
                    >
                      <Heart className="h-4 w-4" />
                      <span>Discover</span>
                    </Link>
                    <Link
                      href="/social/matches"
                      className="flex items-center space-x-2 px-3 py-2 text-sm text-text-secondary hover:bg-gray-100 rounded-md"
                      onClick={() => setIsOpen(false)}
                    >
                      <Users className="h-4 w-4" />
                      <span>Matches</span>
                    </Link>
                    <Link
                      href="/social/likes"
                      className="flex items-center space-x-2 px-3 py-2 text-sm text-text-secondary hover:bg-gray-100 rounded-md"
                      onClick={() => setIsOpen(false)}
                    >
                      <ThumbsUp className="h-4 w-4" />
                      <span>Likes</span>
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
