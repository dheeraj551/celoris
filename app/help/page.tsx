"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, HelpCircle, Book, MessageCircle, Rocket, UserPlus, Search, Mail, MessageSquare, Shield, FileText, ChevronRight, Sparkles, CheckCircle2 } from "lucide-react"
import { PageWrapper } from "@/components/PageWrapper"
import { motion } from "framer-motion"

export default function HelpCenterPage() {
  const gettingStartedItems = [
    { title: "Create and manage your account", icon: UserPlus },
    { title: "Explore learning, earning, and professional opportunities", icon: Rocket },
    { title: "Set up your profile and preferences", icon: Search },
    { title: "Navigate core features with ease", icon: HelpCircle }
  ]

  const faqs = [
    {
      question: "How do I get started with Celoris?",
      answer: "Getting started is simple. Create an account, complete your profile, and begin exploring Celoris features such as Learn, Earn, Social, and Apps based on your goals."
    },
    {
      question: "Is Celoris free to use?",
      answer: "Yes. Celoris offers both free and premium plans. The free plan provides access to essential features, while premium plans unlock advanced tools, expanded access, and additional benefits."
    },
    {
      question: "Can I learn at my own pace?",
      answer: "Absolutely. Most learning resources on Celoris are self-paced, allowing you to learn anytime, from anywhere, at a speed that works best for you."
    }
  ]

  const contactSupportItems = [
    "Account or login issues",
    "Payments and subscriptions",
    "Platform features and usage",
    "Technical problems or bug reports"
  ]

  const additionalResources = [
    { title: "Platform updates and announcements", link: "#", icon: Sparkles },
    { title: "Policy and legal documentation", link: "/terms", icon: FileText },
    { title: "Security and privacy information", link: "/privacy", icon: Shield }
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
            <h1 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter mb-4">Help <span className="text-emerald-500">Center</span></h1>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs italic">How can we help you?</p>
          </motion.div>

          {/* Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#0d1321]/60 backdrop-blur-3xl border border-white/5 rounded-[3rem] p-10 md:p-14 mb-16 shadow-3xl text-center"
          >
            <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 inline-flex mb-8 text-emerald-400">
              <HelpCircle size={32} />
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white italic uppercase tracking-tighter mb-6">Welcome to the Celoris Help Center.</h2>
            <p className="text-lg text-slate-400 leading-relaxed italic max-w-2xl mx-auto">
              Here you’ll find answers to common questions, guidance on using the platform, and ways to get in touch with our support team whenever you need help.
            </p>
          </motion.div>

          {/* Getting Started */}
          <section className="mb-20">
            <h2 className="text-3xl font-black text-white mb-10 uppercase italic tracking-tight flex items-center gap-4">
              <span className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400"><Book size={20} /></span>
              Getting Started
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {gettingStartedItems.map((item, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -5 }}
                  className="p-8 bg-[#0d1321]/40 border border-white/5 rounded-[2rem] flex items-center gap-6 group hover:border-emerald-500/30 transition-all"
                >
                  <div className="p-3 bg-white/5 rounded-xl group-hover:bg-emerald-600 transition-colors text-slate-400 group-hover:text-white">
                    <item.icon size={20} />
                  </div>
                  <p className="text-sm font-bold uppercase tracking-wide text-slate-300 italic group-hover:text-white transition-colors">{item.title}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-20">
            <h2 className="text-3xl font-black text-white mb-10 uppercase italic tracking-tight flex items-center gap-4">
              <span className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400"><MessageSquare size={20} /></span>
              FAQ
            </h2>
            <div className="space-y-6">
              {faqs.map((faq, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="p-8 bg-[#0d1321]/60 border border-white/5 rounded-[2.5rem] hover:border-emerald-500/20 transition-all"
                >
                  <h3 className="text-lg font-black text-white mb-4 uppercase italic tracking-tight">{faq.question}</h3>
                  <p className="text-slate-400 leading-relaxed italic">{faq.answer}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Contact Support */}
          <section className="mb-20">
            <div className="bg-gradient-to-br from-emerald-600/20 to-teal-900/40 backdrop-blur-3xl border border-emerald-500/20 rounded-[3rem] p-10 md:p-14 shadow-3xl overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none group-hover:bg-emerald-500/20 transition-all duration-700" />

              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-3xl font-black text-white mb-6 uppercase italic tracking-tight">Contact Support</h2>
                  <p className="text-slate-300 italic mb-8">Need personalized help or can’t find what you’re looking for? Our team assist you with:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                    {contactSupportItems.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-emerald-400 italic">
                        <CheckCircle2 size={12} />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col items-center gap-6 shrink-0">
                  <div className="p-6 bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 text-center">
                    <Mail className="h-8 w-8 text-emerald-400 mx-auto mb-4" />
                    <Link
                      href="mailto:support@celorisdesigns.com"
                      className="text-white font-black uppercase tracking-widest text-xs hover:text-emerald-400 transition-colors block mb-2"
                    >
                      support@celorisdesigns.com
                    </Link>
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest italic">Aimed response within 24h</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Additional Resources */}
          <section className="mb-20">
            <h2 className="text-xl font-black text-white mb-8 uppercase italic tracking-tight text-center">Additional Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {additionalResources.map((res, idx) => (
                <Link key={idx} href={res.link} className="p-6 bg-[#0d1321]/40 border border-white/5 rounded-2xl flex items-center justify-between group hover:border-emerald-500/30 transition-all">
                  <div className="flex items-center gap-4">
                    <res.icon size={18} className="text-slate-500 group-hover:text-emerald-400 transition-colors" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white transition-colors italic">{res.title}</span>
                  </div>
                  <ChevronRight size={14} className="text-slate-600 group-hover:text-emerald-400 transition-all group-hover:translate-x-1" />
                </Link>
              ))}
            </div>
          </section>

          {/* Brand Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center pt-20 border-t border-white/5"
          >
            <p className="text-lg text-slate-400 italic mb-12 max-w-xl mx-auto font-medium">
              <strong className="text-emerald-400">Celoris</strong> is built to support your learning, growth, and professional journey. If you ever feel stuck, we’re just a message away.
            </p>
            <div className="w-20 h-20 bg-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-3xl shadow-emerald-500/20 italic font-black text-white">
              CD
            </div>
            <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-2">Celoris Designs LLP</h2>
            <p className="text-slate-500 font-black uppercase tracking-widest text-[10px] italic mb-12">Your partner in digital transformation.</p>
          </motion.div>
        </div>
      </div>
    </PageWrapper>
  )
}