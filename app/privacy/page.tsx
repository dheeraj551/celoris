"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Shield, Eye, Lock, Mail, Scale, Globe, FileText, CheckCircle2, ChevronRight, Sparkles } from "lucide-react"
import { PageWrapper } from "@/components/PageWrapper"
import { motion } from "framer-motion"

export default function PrivacyPage() {
  const sections = [
    {
      id: "privacy-matters",
      title: "1. Your Privacy Matters",
      content: "We are committed to protecting your personal information and being transparent about how we collect, use, and share your data. We only collect information that is necessary to deliver, improve, and secure our Services.",
      icon: Shield,
    },
    {
      id: "info-we-collect",
      title: "2. Information We Collect",
      icon: Eye,
      subsections: [
        {
          title: "a. Information You Provide Directly",
          items: [
            "Full name",
            "Email address",
            "Phone number",
            "Account login credentials",
            "Profile details (such as role: student, teacher, employer, freelancer)",
            "Payment and billing information (processed via secure third-party providers)",
            "Messages, support requests, and feedback",
          ],
        },
        {
          title: "b. Information Collected Automatically",
          items: [
            "IP address",
            "Device type, browser type, and operating system",
            "Pages visited and actions taken on the platform",
            "Date and time of access",
            "Cookies and similar tracking technologies",
          ],
        },
        {
          title: "c. Information from Third Parties",
          items: [
            "Authentication providers (e.g., Google login)",
            "Payment processors",
            "Analytics and marketing tools",
          ],
        },
      ],
    },
    {
      id: "how-we-use",
      title: "3. How We Use Your Information",
      icon: Sparkles,
      items: [
        "Create and manage your account",
        "Provide, operate, and maintain our Services",
        "Connect learners, educators, professionals, and employers",
        "Process payments and transactions",
        "Communicate with you about updates, offers, and support",
        "Improve platform performance, features, and user experience",
        "Detect and prevent fraud, abuse, or security issues",
        "Comply with legal and regulatory requirements",
      ],
    },
    {
      id: "legal-basis",
      title: "4. Legal Basis for Processing (GDPR)",
      icon: Scale,
      content: "If you are located in the European Economic Area (EEA), we process your personal data based on:",
      items: [
        "Your consent",
        "Performance of a contract",
        "Legal obligations",
        "Legitimate business interests that do not override your rights",
      ],
    },
    {
      id: "sharing",
      title: "5. Information Sharing & Disclosure",
      icon: Globe,
      content: "We do not sell or rent your personal information. We may share information only in the following cases:",
      items: [
        "With trusted service providers who help us operate the platform (hosting, payments, analytics)",
        "When required by law, regulation, or legal process",
        "To protect the rights, safety, or property of Celoris, our users, or the public",
        "With your explicit consent",
      ],
      footer: "All third parties are required to protect your data and use it only for authorized purposes.",
    },
    {
      id: "cookies",
      title: "6. Cookies & Tracking Technologies",
      icon: Eye,
      content: "We use cookies and similar technologies to:",
      items: ["Remember user preferences", "Analyze traffic and usage patterns", "Improve functionality and performance"],
      footer: "You can control or disable cookies through your browser settings, though some features may not function properly.",
    },
    {
      id: "data-security",
      title: "7. Data Security",
      icon: Lock,
      content: "We implement appropriate technical and organizational security measures, including:",
      items: ["Secure servers and encrypted connections", "Restricted access to personal data", "Regular monitoring for vulnerabilities"],
      footer: "While no system is 100% secure, we take reasonable steps to protect your data against unauthorized access, alteration, disclosure, or destruction.",
    },
    {
      id: "retention",
      title: "8. Data Retention",
      icon: FileText,
      content: "We retain personal information only as long as necessary to:",
      items: ["Provide our Services", "Fulfill legal, accounting, or reporting obligations", "Resolve disputes and enforce agreements"],
      footer: "When data is no longer required, it is securely deleted or anonymized.",
    },
    {
      id: "rights",
      title: "9. Your Rights & Choices",
      icon: CheckCircle2,
      content: "Depending on your location, you may have the right to:",
      items: [
        "Access your personal data",
        "Correct or update inaccurate information",
        "Delete your personal data",
        "Restrict or object to processing",
        "Withdraw consent at any time",
        "Request data portability",
      ],
      footerLink: {
        text: "You can exercise these rights by contacting us at support@celorisdesigns.com",
        href: "mailto:support@celorisdesigns.com",
      },
    },
    {
      id: "children",
      title: "10. Children’s Privacy",
      icon: Shield,
      content: "Celoris does not knowingly collect personal information from children under the age of 13. If we become aware that such data has been collected, we will take steps to delete it promptly.",
    },
    {
      id: "third-party",
      title: "11. Third-Party Links",
      icon: Globe,
      content: "Our Services may contain links to third-party websites or services. We are not responsible for their privacy practices. We encourage you to review their privacy policies before providing any information.",
    },
    {
      id: "changes",
      title: "12. Changes to This Privacy Policy",
      icon: FileText,
      content: "We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date. Continued use of the Services after changes means you accept the revised policy.",
    },
    {
      id: "contact",
      title: "13. Contact Us",
      icon: Mail,
      content: "If you have questions, concerns, or requests regarding this Privacy Policy or your personal data, contact us at:",
      footerLink: {
        text: "support@celorisdesigns.com",
        href: "mailto:support@celorisdesigns.com",
      },
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
            <h1 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter mb-4">Privacy <span className="text-emerald-500">Policy</span></h1>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs italic">Last updated: January 2026</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#0d1321]/60 backdrop-blur-3xl border border-white/5 rounded-[3rem] p-10 md:p-14 mb-16 shadow-3xl"
          >
            <p className="text-lg text-slate-300 leading-relaxed italic mb-8">
              At <strong className="text-emerald-400">Celoris</strong> (“Celoris”, “we”, “our”, or “us”), your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and protect your personal information when you use our websites, applications, products, and services (collectively, the “Services”).
            </p>
            <p className="text-slate-400 font-medium italic">
              By accessing or using Celoris, you agree to the practices described in this Privacy Policy.
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

                    {section.subsections && section.subsections.map((sub, i) => (
                      <div key={i} className="mb-8 last:mb-0">
                        <h3 className="text-lg font-black text-white mb-4 uppercase italic tracking-wide">
                          {sub.title}
                        </h3>
                        <ul className="space-y-3">
                          {sub.items.map((item, j) => (
                            <li key={j} className="flex items-start gap-3 text-slate-400 text-sm font-bold uppercase tracking-wide italic">
                              <ChevronRight className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}

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
            <p className="text-slate-500 font-black uppercase tracking-widest text-[10px] italic mb-12">Building learning, earning, and opportunity — responsibly.</p>
            <Button className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl px-10 h-14 font-black uppercase tracking-widest text-xs" asChild>
              <Link href="/contact">Get in Touch</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </PageWrapper>
  )
}