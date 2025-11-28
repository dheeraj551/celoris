"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, User, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase-client"

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

// Simplified navigation for social section (removes Social, About, Apps, Contact)
const socialSectionNavigation = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Learn", href: "/learn" },
  { name: "Earn", href: "/earn" },
]

// Social-specific navigation that shows when on social pages
const socialNavigation = [
  { name: "Discover", href: "/social/swipe", icon: "Heart" },
  { name: "Matches", href: "/social/matches", icon: "Users" },
  { name: "Profile", href: "/social/profile", icon: "User" },
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
          {pathname.startsWith('/social') && user ? (
            // Simplified navigation for social section
            socialSectionNavigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary-500",
                  pathname === item.href
                    ? "text-primary-500"
                    : "text-text-secondary"
                )}
              >
                {item.name}
              </Link>
            ))
          ) : (
            // Full navigation for other sections
            (user ? authenticatedNavigation : publicNavigation).map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary-500",
                  pathname === item.href
                    ? "text-primary-500"
                    : "text-text-secondary"
                )}
              >
                {item.name}
              </Link>
            ))
          )}
        </nav>

        {/* Social-specific navigation - shown when in social section */}
        {pathname.startsWith('/social') && user && (
          <nav className="hidden md:flex items-center space-x-4 ml-6 pl-6 border-l border-border">
            {socialNavigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary-500 flex items-center space-x-1",
                  pathname === item.href
                    ? "text-primary-500 bg-primary-50 px-3 py-1 rounded-md"
                    : "text-text-secondary hover:text-primary-500 px-3 py-1 rounded-md hover:bg-gray-50"
                )}
              >
                <span className="text-xs">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        )}

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
              <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
            </div>
          ) : user ? (
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 text-sm text-text-secondary">
                <User className="h-4 w-4" />
                <span>Welcome, {profile?.full_name || user.email}</span>
              </div>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
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
                {pathname.startsWith('/social') && user ? (
                  // Simplified navigation for social section on mobile
                  socialSectionNavigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "text-lg font-medium transition-colors hover:text-primary-500",
                        pathname === item.href
                          ? "text-primary-500"
                          : "text-text-secondary"
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))
                ) : (
                  // Full navigation for other sections on mobile
                  (user ? authenticatedNavigation : publicNavigation).map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "text-lg font-medium transition-colors hover:text-primary-500",
                        pathname === item.href
                          ? "text-primary-500"
                          : "text-text-secondary"
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))
                )}
              </div>
              <div className="flex flex-col space-y-2 pt-4 border-t">
                {loading ? (
                  <div className="flex flex-col space-y-2">
                    <div className="animate-pulse bg-gray-200 h-10 w-full rounded"></div>
                    <div className="animate-pulse bg-gray-200 h-10 w-full rounded"></div>
                  </div>
                ) : user ? (
                  <>
                    <div className="flex items-center space-x-2 px-3 py-2 text-sm text-text-secondary">
                      <User className="h-4 w-4" />
                      <span>Welcome, {profile?.full_name || user.email}</span>
                    </div>
                    <Button variant="outline" onClick={() => { handleSignOut(); setIsOpen(false); }}>
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