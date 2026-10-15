"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Linkedin, Facebook, Youtube, ExternalLink, ArrowRight, ShieldCheck, Sparkles, Heart } from "lucide-react"
import { Capacitor } from '@capacitor/core'

const footerSections = [
  {
    title: "Platform & Tools",
    links: [
      { name: "Free WordPress Cloud", href: "/cloud", badge: "New" },
      { name: "AI Video Studio", href: "/video-studio" },
      { name: "PhotoLite Editor", href: "/photolite" },
      { name: "PolyVault 3D", href: "/polyvault" },
      { name: "ViO Commercial Studio", href: "/vio-studio" },
      { name: "Pricing & Plans", href: "/pricing" },
    ],
  },
  {
    title: "Academy & Careers",
    links: [
      { name: "Certified Courses", href: "/learn" },
      { name: "Free Courses with Certificate", href: "/free-courses-with-certificate" },
      { name: "Live Classrooms", href: "/classrooms" },
      { name: "Job Center & Hiring", href: "/job-center" },
      { name: "Become a Trainer", href: "/become-trainer" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About Celoris", href: "/about" },
      { name: "Official Blog", href: "/blog" },
      { name: "WordPress Guide (2026)", href: "/blog/free-wordpress-hosting-india-2026" },
      { name: "Careers", href: "/careers" },
      { name: "Contact Us", href: "/contact" },
      { name: "Help Center", href: "/help" },
    ],
  },
  {
    title: "Trust & Legal",
    links: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Acceptable Use Policy", href: "/cloud/acceptable-use" },
      { name: "Refund & Cancellation", href: "/refund-policy" },
      { name: "Cookie Policy", href: "/cookies" },
    ],
  },
]

const socialLinks = [
  { icon: Linkedin, href: "https://www.linkedin.com/company/celorisdesigns/", label: "LinkedIn" },
  { icon: Facebook, href: "https://www.facebook.com/celorisdesigns/", label: "Facebook" },
  { icon: Youtube, href: "https://www.youtube.com/@celorisplay", label: "YouTube" },
]

export default function Footer() {
  const pathname = usePathname()
  const [isNative, setIsNative] = useState(false)

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      setIsNative(true)
    }
  }, [])

  // Studio full-screen tools, auth screens, or sub-pages with custom footers (like /cloud)
  const isExcludedPage =
    isNative ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/chat" ||
    pathname?.startsWith("/video-studio") ||
    pathname?.startsWith("/photolite") ||
    pathname?.startsWith("/vio-studio") ||
    pathname?.startsWith("/marketing-studio") ||
    pathname?.startsWith("/motion-swap") ||
    pathname?.startsWith("/celo-ai") ||
    pathname?.startsWith("/cloud") ||
    pathname?.startsWith("/interviews")

  if (isExcludedPage) {
    return null
  }

  return (
    <footer className="relative z-20 bg-[#04060a] border-t border-white/[0.08] text-neutral-300 transition-colors">
      {/* Top Subtle Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        {/* Main Grid: Brand + 4 Link Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-12 pb-14 border-b border-white/[0.08]">
          
          {/* Brand Column (2 columns span) */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <img
                src="/celoris-logo.png"
                alt="Celoris Logo"
                className="h-9 w-auto object-contain transition-transform group-hover:scale-105"
              />
            </Link>

            <p className="text-sm text-neutral-400 leading-relaxed max-w-sm">
              India&apos;s creative studio and academy since 2019. AI video editor, Photoshop-style photo studio, certified professional courses, and free managed WordPress cloud.
            </p>

            {/* Live System Status Indicator */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-xs font-mono text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>All Systems Operational · Asia-South1</span>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-2.5 pt-2">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/10 hover:border-emerald-500/40 hover:bg-emerald-500/10 hover:text-emerald-400 text-neutral-400 transition-all duration-200 flex items-center justify-center"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* 4 Link Columns */}
          {footerSections.map((section) => (
            <div key={section.title} className="space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                {section.title}
              </h3>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-xs sm:text-sm text-neutral-400 hover:text-emerald-400 hover:translate-x-0.5 transition-all duration-150 inline-flex items-center gap-1.5 group"
                    >
                      <span>{link.name}</span>
                      {link.badge && (
                        <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono border border-emerald-500/30">
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* Bottom Compliance & Legal Bar */}
        <div className="pt-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-start text-xs text-neutral-400">
          
          {/* Left: Indian Corporate & LLP Verification */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-sm">Celoris Designs LLP</span>
              <span className="px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/10 text-[10px] font-mono text-neutral-300">
                Verified Indian Entity
              </span>
            </div>
            <div className="font-mono text-[11px] text-neutral-400 space-y-0.5">
              <p>LLPIN: <span className="text-neutral-300">AAP-3965</span> · GSTIN: <span className="text-neutral-300">09AAOFC5435B1ZJ</span></p>
              <p>Incorporated: <span className="text-neutral-300">23rd May 2019</span> under Limited Liability Partnership Act, 2008</p>
              <p>Registered with Ministry of Corporate Affairs (MCA), Government of India</p>
            </div>
            <p className="pt-2 text-[11px] text-neutral-400">
              © 2019–2026 Celoris Designs LLP. All rights reserved. Made with ❤️ in India 🇮🇳
            </p>
          </div>

          {/* Right: Quick Legal Links & Navigation */}
          <div className="space-y-3 md:text-right">
            <div className="flex flex-wrap md:justify-end gap-x-6 gap-y-2 text-xs font-medium">
              {[
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Terms of Service", href: "/terms" },
                { label: "Acceptable Use", href: "/cloud/acceptable-use" },
                { label: "Refund Policy", href: "/refund-policy" },
                { label: "Cookie Policy", href: "/cookies" },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-neutral-400 hover:text-emerald-400 transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <p className="text-[11px] text-neutral-400">
              Free WordPress Cloud instances are hosted in Asia-South1 (Mumbai) with 99.9% uptime SLA.
            </p>
          </div>

        </div>

      </div>
    </footer>
  )
}
