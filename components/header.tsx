"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, User, LogOut, Heart, Users, User as UserIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase-client"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const publicNavigation = [
  { name: "Home", href: "/" },
  { name: "Learn", href: "/learn" },
  { name: "Earn", href: "/earn" },
  { name: "Social", href: "/social" },
  { name: "Classroom", href: "/classroom" },
  { name: "Apps", href: "/apps" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
]

const authenticatedNavigation = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Learn", href: "/learn" },
  { name: "Earn", href: "/earn" },
  { name: "Social", href: "/social" },
  { name: "Classroom", href: "/classroom" },
  { name: "Apps", href: "/apps" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
]

export default function Header() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        setUser(user)

        // Get user profile from our custom users table
        const { data: profile } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .single()

        setProfile(profile)
      }
    } catch (error) {
      console.error("Error checking auth:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      // Clear local state
      setUser(null)
      setProfile(null)
      // Redirect to home page
      window.location.href = "/"
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <img
            src="/celoris-logo.png"
            alt="Celoris Logo"
            className="h-8 w-auto object-contain"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {(user ? authenticatedNavigation : publicNavigation).map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary-500",
                pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
                  ? "text-primary-500"
                  : "text-text-secondary"
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
              <div className="animate-pulse bg-gray-200 h-8 w-8 rounded-full"></div>
            </div>
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full bg-blue-500 hover:bg-blue-600 p-0 overflow-hidden">
                  <span className="text-white font-bold text-sm">Me</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">ConnectHub</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {profile?.full_name || user.email}
                    </p>
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
                  <Link href="/social/profile" className="cursor-pointer">
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
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
              <Button variant="ghost" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild>
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
                    <div className="px-2 py-2 text-sm font-semibold text-gray-500">ConnectHub</div>
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