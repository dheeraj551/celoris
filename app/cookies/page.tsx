"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Cookie, Eye, Settings, ShieldCheck, ChevronRight, Sparkles, ExternalLink, RefreshCcw, Mail, CheckCircle2 } from "lucide-react"
import { PageWrapper } from "@/components/PageWrapper"
import { motion } from "framer-motion"

export default function CookiesPage() {
  const sections = [
    {
      id: "what-are-cookies",
      title: "1. What Are Cookies?",
      icon: Cookie,
      content: "Cookies are small text files stored on your computer or mobile device when you visit a website. They are widely used to ensure websites function properly, operate efficiently, and provide insights to website owners about how their sites are used.\n\nCookies help recognize your device and remember certain information about your visit."
    },
    {
      id: "how-we-use",
      title: "2. How We Use Cookies",
      icon: Sparkles,
      content: "Celoris uses cookies to:",
      items: [
        "Enable core platform functionality",
        "Maintain secure user sessions",
        "Remember user preferences and settings",
        "Analyze traffic and usage patterns",
        "Improve performance, usability, and content relevance"
      ],
      footer: "Cookies do not give us access to your device or personal files."
    },
    {
      id: "types",
      title: "3. Types of Cookies We Use",
      icon: ShieldCheck,
      subsections: [
        {
          title: "a. Essential Cookies",
          content: "These cookies are strictly necessary for the website to function correctly. They support features such as:",
          items: [
            "User authentication",
            "Security and fraud prevention",
            "Network and server management",
            "Accessibility features"
          ],
          footer: "Disabling these cookies may cause parts of the platform to stop working properly."
        },
        {
          title: "b. Analytics Cookies",
          content: "Analytics cookies help us understand how visitors interact with Celoris by collecting information in an aggregated and anonymous form, such as:",
          items: [
            "Pages visited",
            "Time spent on the site",
            "Navigation patterns",
            "Error reports"
          ],
          footer: "This data helps us improve site performance and user experience."
        },
        {
          title: "c. Preference Cookies",
          content: "Preference cookies allow Celoris to remember information that changes the way the website behaves or looks, such as:",
          items: [
            "Language preferences",
            "Region or location",
            "Login and display settings"
          ],
          footer: "These cookies enhance personalization but are not essential for basic functionality."
        }
      ]
    },
    {
      id: "third-party",
      title: "4. Third-Party Cookies",
      icon: ExternalLink,
      content: "We may allow trusted third-party services (such as analytics or performance tools) to place cookies on your device to help us analyze usage and improve our Services. These cookies are governed by the respective third parties’ privacy policies.",
      footer: "Celoris does not control or access third-party cookies directly."
    },
    {
      id: "managing",
      title: "5. Managing & Controlling Cookies",
      icon: Settings,
      content: "You can manage or disable cookies at any time through your browser settings. Most browsers allow you to:",
      items: [
        "View stored cookies",
        "Delete existing cookies",
        "Block cookies entirely",
        "Set preferences for specific websites"
      ],
      footer: "Please note that disabling certain cookies may affect the functionality, performance, and user experience of Celoris."
    },
    {
      id: "consent",
      title: "6. Consent",
      icon: CheckCircle2,
      content: "By continuing to use Celoris, you consent to the use of cookies as described in this Cookie Policy, unless you choose to disable them through your browser or cookie settings.\n\nWhere required by law, we will request your explicit consent before placing non-essential cookies."
    },
    {
      id: "changes",
      title: "7. Changes to This Cookie Policy",
      icon: RefreshCcw,
      content: "We may update this Cookie Policy from time to time to reflect changes in technology, law, or our Services. Any updates will be posted on this page with a revised date."
    },
    {
      id: "contact",
      title: "8. Contact Us",
      icon: Mail,
      content: "If you have questions about our use of cookies or this Cookie Policy, please contact us at:",
      footerLink: {
        text: "privacy@celorisdesigns.com",
        href: "mailto:privacy@celorisdesigns.com",
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
            <h1 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter mb-4">Cookie <span className="text-emerald-500">Policy</span></h1>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs italic">Last updated: January 2026</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#0d1321]/60 backdrop-blur-3xl border border-white/5 rounded-[3rem] p-10 md:p-14 mb-16 shadow-3xl"
          >
            <p className="text-lg text-slate-300 leading-relaxed italic">
              This <strong className="text-emerald-400">Cookie Policy</strong> explains what cookies are, how <strong className="text-emerald-400">Celoris</strong> (“we”, “our”, or “us”) uses them, and the choices you have regarding their use when you visit our websites and applications (collectively, the “Services”).
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
                      <p className="text-slate-400 text-lg leading-relaxed mb-6 italic whitespace-pre-line">
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
                      <div key={i} className="mb-8 last:mb-0 p-8 bg-white/5 rounded-[2rem] border border-white/5">
                        <h3 className="text-lg font-black text-white mb-4 uppercase italic tracking-wide flex items-center gap-2">
                          <ChevronRight className="h-4 w-4 text-emerald-500" />
                          {sub.title}
                        </h3>
                        <p className="text-slate-400 text-sm font-medium italic leading-relaxed mb-4">
                          {sub.content}
                        </p>
                        {sub.items && (
                          <ul className="space-y-3 mb-4">
                            {sub.items.map((item, j) => (
                              <li key={j} className="flex items-start gap-3 text-slate-400 text-xs font-bold uppercase tracking-wide italic">
                                <Sparkles className="h-3 w-3 text-emerald-500/50 mt-1 shrink-0" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        )}
                        {sub.footer && (
                          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest italic pt-2">
                            {sub.footer}
                          </p>
                        )}
                      </div>
                    ))}

                    {section.footer && (
                      <p className="text-slate-500 text-sm font-medium italic mt-2">
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
            <p className="text-slate-500 font-black uppercase tracking-widest text-[10px] italic mb-12">Committed to transparency, security, and user trust.</p>
            <Button className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl px-10 h-14 font-black uppercase tracking-widest text-xs" asChild>
              <Link href="/contact">Get in Touch</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </PageWrapper>
  )
}