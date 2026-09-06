"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Linkedin, Facebook, Youtube } from "lucide-react"
import { cn } from "@/lib/utils"

const footerSections = [
  {
    title: "Platform",
    links: [
      { name: "Learn", href: "/learn" },
      { name: "Job Center", href: "/job-center" },
      { name: "Social", href: "/social" },
      { name: "Apps", href: "/apps" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About", href: "/about" },
      { name: "Contact", href: "/contact" },
      { name: "Careers", href: "/careers" },
      { name: "Blog", href: "/blog" },
    ],
  },
  {
    title: "Support",
    links: [
      { name: "Help Center", href: "/help" },
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Cookie Policy", href: "/cookies" },
    ],
  },
  {
    title: "Connect",
    links: [
      { name: "Newsletter", href: "/newsletter" },
      { name: "Community", href: "/community" },
      { name: "Events", href: "/events" },
      { name: "Partners", href: "/partners" },
    ],
  },
]

const socialLinks = [
  { icon: Linkedin, href: "https://www.linkedin.com/company/celorisdesigns/", label: "LinkedIn" },
  { icon: Facebook, href: "https://www.facebook.com/celorisdesigns/", label: "Facebook" },
  { icon: Youtube, href: "https://www.youtube.com/@celorisplay", label: "YouTube" },
]

import { Capacitor } from '@capacitor/core'
import { useEffect } from "react"

export default function Footer() {
  const pathname = usePathname()
  const [email, setEmail] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isNative, setIsNative] = useState(false)

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
    pathname === "/login" ||
    pathname === "/register";

  if (isNative || isDashboardPage) return null

  const isDarkPage = pathname === "/" ||
    pathname === "/about" ||
    pathname === "/contact" ||
    pathname === "/learn" ||
    pathname === "/earn" ||
    pathname === "/social" ||
    pathname === "/apps" ||
    pathname?.startsWith("/blog") ||
    pathname?.startsWith("/courses/")

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setIsSubscribed(true)
      setEmail("")
      setTimeout(() => setIsSubscribed(false), 3000)
    }
  }

  return (
    <footer className={cn(
      "border-t transition-all duration-300 px-4",
      isDarkPage
        ? "bg-slate-50 border-slate-200"
        : "bg-surface border-border"
    )}>
      <div className="container py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-16">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center mb-8">
              <img
                src="/celoris-logo.png"
                alt="Celoris Logo"
                className="h-10 w-auto object-contain"
              />
            </Link>
            <p className={cn(
              "text-sm mb-8 max-w-sm font-bold uppercase tracking-tight italic",
              isDarkPage ? "text-slate-500" : "text-text-secondary"
            )}>
              Empowering individuals and businesses through comprehensive learning,
              earning opportunities, and engaging experiences in one unified platform.
            </p>

            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
                    isDarkPage
                      ? "bg-slate-200 border border-slate-300 text-slate-600 hover:bg-emerald-500 hover:text-white hover:border-emerald-500"
                      : "bg-gray-100 hover:bg-primary-100 text-text-secondary hover:text-primary-500"
                  )}
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className={cn(
                "font-black uppercase tracking-widest text-[10px] mb-6 italic",
                isDarkPage ? "text-emerald-500" : "text-text-primary"
              )}>
                {section.title}
              </h3>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className={cn(
                        "text-[11px] font-black uppercase tracking-widest transition-colors italic",
                        isDarkPage
                          ? "text-slate-500 hover:text-emerald-600"
                          : "text-text-secondary hover:text-primary-500"
                      )}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Section */}
        <div className={cn(
          "border-t pt-12 mb-12",
          isDarkPage ? "border-white/5" : "border-border"
        )}>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">
            <div>
              <h3 className={cn(
                "text-2xl font-black uppercase tracking-tighter italic mb-2",
                isDarkPage ? "text-slate-900" : "text-text-primary"
              )}>
                Stay Synchronized
              </h3>
              <p className={cn(
                "text-xs font-bold uppercase tracking-widest italic",
                isDarkPage ? "text-slate-500" : "text-text-secondary"
              )}>
                Get the latest updates on new knowledge nodes and grid opportunities.
              </p>
            </div>
            <form onSubmit={handleNewsletterSubmit} className="flex max-w-md w-full gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Initialize Email..."
                className={cn(
                  "flex-1 px-6 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest italic focus:outline-none transition-all",
                  isDarkPage
                    ? "bg-slate-100 border border-slate-200 text-slate-900 focus:border-emerald-500/50"
                    : "border-border focus:ring-2 focus:ring-primary-500"
                )}
                required
              />
              <button
                type="submit"
                disabled={isSubscribed}
                className={cn(
                  "px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest italic transition-all",
                  isSubscribed
                    ? "bg-emerald-500 text-white cursor-not-allowed"
                    : isDarkPage
                      ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-3xl shadow-emerald-500/20"
                      : "bg-primary-500 hover:bg-primary-700 text-white"
                )}
              >
                {isSubscribed ? "ACKNOWLEDGED" : "SUBSCRIBE"}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={cn(
          "border-t pt-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-start",
          isDarkPage ? "border-slate-200" : "border-border"
        )}>
          <div className="space-y-2">
            <p className={cn(
              "text-[10px] font-black uppercase tracking-widest italic",
              isDarkPage ? "text-slate-900" : "text-text-primary"
            )}>
              Celoris Designs LLP
            </p>
            <div className={cn(
              "text-[9px] font-bold uppercase tracking-wider space-y-1 italic",
              isDarkPage ? "text-slate-500" : "text-text-secondary"
            )}>
              <p>LLP Identification No: AAP-3965</p>
              <p>GST No: 09AAOFC5435B1ZJ</p>
              <p>Established: 23rd May 2019</p>
            </div>
            <p className={cn(
              "text-[10px] font-black uppercase tracking-widest italic pt-4",
              isDarkPage ? "text-slate-400" : "text-text-secondary"
            )}>
              © 2019–2026 Celoris Designs LLP. All rights reserved.
            </p>
          </div>

          <div className="space-y-4 md:text-right">
            <div className={cn(
              "text-[9px] font-bold uppercase tracking-wider space-y-1 italic",
              isDarkPage ? "text-slate-500" : "text-text-secondary"
            )}>
              <p>Incorporated under the Limited Liability Partnership Act, 2008</p>
              <p>Registered with Ministry of Corporate Affairs, Government of India</p>
            </div>
            <div className="flex sm:justify-end space-x-8 text-[10px] font-black uppercase tracking-widest italic pt-2">
              {['Privacy', 'Terms', 'Cookies'].map((item) => (
                <Link
                  key={item}
                  href={`/${item.toLowerCase()}`}
                  className={cn(
                    "transition-colors",
                    isDarkPage ? "text-slate-600 hover:text-emerald-500" : "text-text-secondary hover:text-primary-500"
                  )}
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
