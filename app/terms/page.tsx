"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Gavel, RefreshCcw, Layout, UserCircle, FileCode, MessageSquare, Ban, CreditCard, ExternalLink, AlertTriangle, ShieldX, PowerOff, Scale, Mail, ChevronRight, Sparkles } from "lucide-react"
import { PageWrapper } from "@/components/PageWrapper"
import { motion } from "framer-motion"

export default function TermsPage() {
  const sections = [
    {
      id: "acceptance",
      title: "1. Acceptance of Terms",
      icon: Gavel,
      content: "By creating an account, browsing, or using any part of Celoris, you confirm that you:",
      items: [
        "Have read and understood these Terms",
        "Agree to comply with them",
        "Are legally capable of entering into a binding agreement"
      ],
      footer: "These Terms apply to all users, including students, educators, employers, freelancers, and visitors."
    },
    {
      id: "changes",
      title: "2. Changes to Terms",
      icon: RefreshCcw,
      content: "We may update or modify these Terms at any time. Updated versions will be posted on this page with a revised date. Continued use of the Services after changes constitutes acceptance of the updated Terms."
    },
    {
      id: "use-of-services",
      title: "3. Use of Services",
      icon: Layout,
      content: "You agree to use Celoris only for lawful purposes and in accordance with these Terms. You must not use the platform in any way that could damage, disable, or impair our Services or interfere with other users."
    },
    {
      id: "user-accounts",
      title: "4. User Accounts",
      icon: UserCircle,
      content: "To access certain features, you must create an account. You agree that:",
      items: [
        "You are responsible for maintaining the confidentiality of your login credentials",
        "All activities under your account are your responsibility",
        "You will provide accurate and up-to-date information",
        "You will notify us immediately of any unauthorized use of your account"
      ],
      footer: "We reserve the right to suspend or terminate accounts that violate these Terms."
    },
    {
      id: "license",
      title: "5. Use License & Platform Content",
      icon: FileCode,
      content: "Unless otherwise stated, all content on Celoris (including text, graphics, logos, videos, and software) is owned by or licensed to Celoris. Permission is granted to temporarily access and use platform materials for personal, non-commercial use only. This license does not allow you to:",
      items: [
        "Modify or copy materials for commercial purposes",
        "Use content for public display or redistribution",
        "Attempt to reverse engineer any platform software",
        "Remove copyright or proprietary notices"
      ],
      footer: "This license terminates automatically if you violate these Terms."
    },
    {
      id: "user-content",
      title: "6. User-Generated Content",
      icon: MessageSquare,
      content: "You may be allowed to post content such as profiles, messages, listings, reviews, or educational material. By submitting content, you:",
      items: [
        "Retain ownership of your content",
        "Grant Celoris a non-exclusive, worldwide, royalty-free license to use, display, and distribute it as part of the Services",
        "Confirm that your content does not violate any laws or third-party rights"
      ],
      footer: "We reserve the right to remove content that violates these Terms or is deemed inappropriate."
    },
    {
      id: "prohibited",
      title: "7. Prohibited Uses",
      icon: Ban,
      content: "You agree not to use Celoris to:",
      items: [
        "Violate any applicable laws or regulations",
        "Post false, misleading, or fraudulent information",
        "Transmit spam, advertising, or promotional material without authorization",
        "Impersonate Celoris, its employees, or other users",
        "Harass, abuse, or harm others",
        "Attempt to gain unauthorized access to systems or data",
        "Upload malicious code, viruses, or harmful scripts"
      ],
      footer: "Violation may result in immediate account suspension or termination."
    },
    {
      id: "payments",
      title: "8. Payments & Transactions",
      icon: CreditCard,
      content: "If you purchase services, subscriptions, or courses through Celoris:",
      items: [
        "Prices and payment terms will be clearly disclosed",
        "Payments are processed via secure third-party providers",
        "Refunds, if any, are subject to our refund policy"
      ],
      footer: "Celoris is not responsible for disputes between users unless explicitly stated."
    },
    {
      id: "third-party",
      title: "9. Third-Party Services & Links",
      icon: ExternalLink,
      content: "Celoris may contain links to third-party websites or services. We are not responsible for their content, policies, or practices. Your interaction with third parties is at your own risk."
    },
    {
      id: "disclaimer",
      title: "10. Disclaimer of Warranties",
      icon: AlertTriangle,
      content: "The Services are provided on an “as is” and “as available” basis. Celoris makes no warranties, express or implied, including but not limited to:",
      items: [
        "Fitness for a particular purpose",
        "Accuracy or reliability of content",
        "Uninterrupted or error-free operation"
      ],
      footer: "Your use of the platform is at your sole risk."
    },
    {
      id: "liability",
      title: "11. Limitation of Liability",
      icon: ShieldX,
      content: "To the maximum extent permitted by law, Celoris shall not be liable for any indirect, incidental, special, or consequential damages arising from:",
      items: [
        "Use or inability to use the Services",
        "Unauthorized access to your data",
        "Actions or content of other users"
      ]
    },
    {
      id: "termination",
      title: "12. Termination",
      icon: PowerOff,
      content: "We may suspend or terminate your access to Celoris at any time, with or without notice, if you violate these Terms or misuse the platform. Upon termination, your right to use the Services will immediately cease."
    },
    {
      id: "governing-law",
      title: "13. Governing Law",
      icon: Scale,
      content: "These Terms shall be governed and interpreted in accordance with applicable laws, without regard to conflict of law principles."
    },
    {
      id: "contact",
      title: "14. Contact Information",
      icon: Mail,
      content: "If you have questions or concerns regarding these Terms of Service, contact us at:",
      footerLink: {
        text: "legal@celorisdesigns.com",
        href: "mailto:legal@celorisdesigns.com",
      }
    }
  ]

  return (
    <PageWrapper className="min-h-screen bg-[#050810] text-slate-200 selection:bg-emerald-500/30 font-sans">
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-emerald-600/20 rounded-full blur-[150px]"
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.05, 0.1, 0.05] }}
          transition={{ duration: 15, repeat: Infinity, delay: 2 }}
          className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[150px]"
        />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-12"
          >
            <Button variant="ghost" className="text-emerald-400 hover:text-white hover:bg-white/5 mb-8 rounded-xl px-0" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Home
              </Link>
            </Button>
            <h1 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter mb-4">Terms of <span className="text-emerald-500">Service</span></h1>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs italic">Last updated: January 2026</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#0d1321]/60 backdrop-blur-3xl border border-white/5 rounded-[3rem] p-10 md:p-14 mb-16 shadow-3xl"
          >
            <p className="text-lg text-slate-300 leading-relaxed italic mb-8">
              Welcome to <strong className="text-emerald-400">Celoris</strong> (“Celoris”, “we”, “our”, or “us”). These Terms of Service (“Terms”) govern your access to and use of our websites, applications, and services (collectively, the “Services”).
            </p>
            <p className="text-slate-400 font-medium italic">
              By accessing or using Celoris, you agree to be bound by these Terms. If you do not agree, please do not use our Services.
            </p>
          </motion.div>

          <div className="space-y-12 mb-20">
            {sections.map((section, idx) => (
              <motion.section
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="group scroll-mt-24"
              >
                <div className="flex items-start gap-6">
                  <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500 text-emerald-400 shadow-2xl">
                    <section.icon size={24} />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-black text-white mb-6 uppercase italic tracking-tight group-hover:text-emerald-400 transition-colors">
                      {section.title}
                    </h2>

                    {section.content && (
                      <p className="text-slate-400 text-lg leading-relaxed mb-6 italic">
                        {section.content}
                      </p>
                    )}

                    {section.items && (
                      <ul className="space-y-4 mb-6">
                        {section.items.map((item, i) => (
                          <li key={i} className="flex items-start gap-3 text-slate-400 text-sm font-bold uppercase tracking-wide italic">
                            <ChevronRight className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}

                    {section.footer && (
                      <p className="text-slate-500 text-sm font-medium italic mt-4">
                        {section.footer}
                      </p>
                    )}

                    {section.footerLink && (
                      <Link
                        href={section.footerLink.href}
                        className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-black uppercase tracking-widest text-[10px] italic mt-4 border-b border-emerald-500/30 hover:border-emerald-500 transition-all pb-1"
                      >
                        {section.footerLink.text}
                      </Link>
                    )}
                  </div>
                </div>
              </motion.section>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center pt-20 border-t border-white/5"
          >
            <div className="w-20 h-20 bg-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-3xl shadow-emerald-500/20 italic font-black text-white">
              CD
            </div>
            <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-2">Celoris Designs LLP</h2>
            <p className="text-slate-500 font-black uppercase tracking-widest text-[10px] italic mb-12">Empowering learning, work, and opportunity — responsibly.</p>
            <Button className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl px-10 h-14 font-black uppercase tracking-widest text-xs" asChild>
              <Link href="/contact">Get in Touch</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </PageWrapper>
  )
}
