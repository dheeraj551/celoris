"use client"

import { useState } from "react"
import Link from "next/link"
import { Linkedin, Facebook, Youtube } from "lucide-react"

const footerSections = [
  {
    title: "Platform",
    links: [
      { name: "Learn", href: "/learn" },
      { name: "Earn", href: "/earn" },
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
  { icon: Linkedin, href: "https://www.linkedin.com/company/52187956/admin/dashboard/", label: "LinkedIn" },
  { icon: Facebook, href: "https://www.facebook.com/celorisdesigns", label: "Facebook" },
  { icon: Youtube, href: "https://www.youtube.com/@celorisacademy", label: "YouTube" },
]

export default function Footer() {
  const [email, setEmail] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      // Simulate newsletter subscription
      console.log('Newsletter subscription:', email)
      setIsSubscribed(true)
      setEmail("")
      // Reset after 3 seconds
      setTimeout(() => setIsSubscribed(false), 3000)
    }
  }
  return (
    <footer className="bg-surface border-t border-border">
      <div className="container py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center mb-6">
              <img
                src="/celoris-logo.png"
                alt="Celoris Logo"
                className="h-10 w-auto object-contain"
              />
            </Link>
            <p className="text-text-secondary mb-6 max-w-sm">
              Empowering individuals and businesses through comprehensive learning,
              earning opportunities, and engaging experiences in one unified platform.
            </p>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 rounded-full bg-gray-100 hover:bg-primary-100 flex items-center justify-center transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5 text-text-secondary hover:text-primary-500" />
                </Link>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-text-primary mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-text-secondary hover:text-primary-500 transition-colors text-sm"
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
        <div className="border-t border-border pt-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">
                Stay Updated
              </h3>
              <p className="text-text-secondary">
                Get the latest updates on new courses, job opportunities, and platform features.
              </p>
            </div>
            <form onSubmit={handleNewsletterSubmit} className="flex max-w-md w-full">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 border border-border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
              <button
                type="submit"
                disabled={isSubscribed}
                className={`px-6 py-2 text-white rounded-r-lg transition-colors ${isSubscribed
                    ? "bg-green-500 cursor-not-allowed"
                    : "bg-primary-500 hover:bg-primary-700"
                  }`}
              >
                {isSubscribed ? "Subscribed!" : "Subscribe"}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-text-secondary text-sm">
            © 2026 Celoris Designs LLP. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm">
            <Link href="/privacy" className="text-text-secondary hover:text-primary-500">
              Privacy
            </Link>
            <Link href="/terms" className="text-text-secondary hover:text-primary-500">
              Terms
            </Link>
            <Link href="/cookies" className="text-text-secondary hover:text-primary-500">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}