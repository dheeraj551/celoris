'use client'

import { useState } from 'react'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Mail, Phone, Loader2, Sparkles, Send, MessageSquare } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useReCaptcha } from "@/components/ReCaptchaProvider"
import { motion, AnimatePresence } from 'framer-motion'
import { PageWrapper } from '@/components/PageWrapper'
import { cn } from '@/lib/utils'

export default function ContactPage() {
  const { toast } = useToast()
  const { executeRecaptcha, isReady } = useReCaptcha()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required'
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) {
      toast({ title: "Form Incomplete", description: "Please check the required fields.", variant: "destructive" })
      return
    }
    if (!isReady) {
      toast({ title: "Working...", description: "Security verification is initializing.", variant: "destructive" })
      return
    }
    setIsSubmitting(true)
    try {
      const recaptchaToken = await executeRecaptcha('contact_form')
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, recaptchaToken }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to send')
      toast({ title: "Message Sent!", description: "We'll get back to you shortly.", variant: "default" })
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch (error) {
      toast({ title: "Error", description: "Something went wrong. Please try again.", variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.celorisdesigns.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Contact",
        "item": "https://www.celorisdesigns.com/contact"
      }
    ]
  };

  const contactPageLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "mainEntity": {
      "@type": "Organization",
      "name": "Celoris AI-Powered Ecosystem",
      "email": "support@celorisdesigns.com",
      "telephone": "+91 9643579101",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+91 9643579101",
        "contactType": "customer service",
        "email": "support@celorisdesigns.com",
        "availableLanguage": ["English", "Hindi"]
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#050810] text-[#E2E8F0] relative overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageLd) }}
      />
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-500/[0.03] blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-100px] left-[-100px] w-[600px] h-[600px] bg-teal-500/[0.03] blur-[120px] rounded-full pointer-events-none" />

      <PageWrapper className="max-w-7xl mx-auto px-4 py-12 lg:py-24 relative z-10">

        {/* Simple Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 px-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl"
          >
            <Link href="/" className="inline-flex items-center gap-2 mb-8 text-emerald-500 font-black uppercase tracking-widest text-[10px] italic hover:text-emerald-400 transition-colors">
              <ArrowLeft size={14} /> Back to Dashboard
            </Link>
            <h1 className="text-5xl md:text-7xl font-black text-white italic uppercase tracking-tighter leading-none mb-6">
              Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Touch.</span>
            </h1>
            <p className="text-lg text-slate-400 font-bold uppercase tracking-wide leading-relaxed italic">
              Have a question or feedback? We'd love to hear from you. <br className="hidden md:block" />
              Our team usually responds within 24 hours.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="hidden lg:block w-48 h-48 rounded-full border border-emerald-500/20 p-2 relative"
          >
            <div className="w-full h-full rounded-full border border-emerald-500/10 flex items-center justify-center bg-emerald-500/5 animate-pulse">
              <Sparkles className="text-emerald-500/40 w-12 h-12" />
            </div>
          </motion.div>
        </div>

        {/* Top Info Cards - Balanced Horizontal Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            { icon: Mail, label: 'Email Us', value: 'support@celorisdesigns.com', color: 'text-emerald-500' },
            { icon: Phone, label: 'Call Us', value: '+91 9643579101', color: 'text-teal-500' },
            { icon: MessageSquare, label: 'WhatsApp', value: 'Instant Chat Support', color: 'text-green-500' }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="p-8 bg-white/[0.02] border border-white/5 rounded-[2rem] flex flex-col items-center text-center group hover:bg-emerald-500/[0.03] hover:border-emerald-500/20 transition-all duration-500"
            >
              <div className={cn("mb-4 p-4 rounded-2xl bg-white/5 group-hover:scale-110 transition-transform", item.color)}>
                <item.icon size={26} />
              </div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 italic">
                {item.label}
              </p>
              <p className="text-base font-black text-white uppercase italic tracking-tighter">
                {item.value}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          {/* Visual Side - Interactive Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-5 h-full"
          >
            <div className="relative h-full rounded-[3rem] overflow-hidden border border-white/5 bg-[#0d1321]/40 shadow-3xl group">
              <img
                src="/images/contact/interface.png"
                alt="Contact Hub"
                className="w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050810] via-[#050810]/20 to-transparent" />

              <div className="absolute inset-0 flex flex-col justify-end p-10">
                <div className="inline-flex items-center gap-3 px-4 py-2 bg-emerald-500 rounded-2xl w-fit shadow-2xl shadow-emerald-500/40 mb-4">
                  <div className="w-2 h-2 rounded-full bg-white animate-ping" />
                  <span className="text-[10px] font-black text-white uppercase tracking-widest italic">Live Support Active</span>
                </div>
                <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-tight">
                  Connect to the <br /> global network.
                </h3>
              </div>
            </div>
          </motion.div>

          {/* Simplified Form Side */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-7"
          >
            <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[3.5rem] p-8 md:p-12 shadow-3xl h-full flex flex-col">
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-10 px-2">
                Send a Message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-8 flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-emerald-500 uppercase tracking-widest px-1 italic">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={cn(
                        "w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm font-bold placeholder:text-slate-600 focus:outline-none transition-all",
                        errors.name ? "border-red-500/50" : "focus:border-emerald-500/50"
                      )}
                      placeholder="Your Name"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-emerald-500 uppercase tracking-widest px-1 italic">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={cn(
                        "w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm font-bold placeholder:text-slate-600 focus:outline-none transition-all",
                        errors.email ? "border-red-500/50" : "focus:border-emerald-500/50"
                      )}
                      placeholder="your@email.com"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-emerald-500 uppercase tracking-widest px-1 italic">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={cn(
                      "w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white text-sm font-bold placeholder:text-slate-600 focus:outline-none transition-all",
                      errors.subject ? "border-red-500/50" : "focus:border-emerald-500/50"
                    )}
                    placeholder="How can we help?"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-emerald-500 uppercase tracking-widest px-1 italic">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className={cn(
                      "w-full bg-white/5 border border-white/10 rounded-[2rem] px-6 py-6 text-white text-sm font-bold placeholder:text-slate-600 focus:outline-none transition-all resize-none",
                      errors.message ? "border-red-500/50" : "focus:border-emerald-500/50"
                    )}
                    placeholder="Your message here..."
                    disabled={isSubmitting}
                  />
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-20 bg-emerald-600 hover:bg-emerald-500 text-white rounded-[2rem] transition-all shadow-xl shadow-emerald-500/20 group overflow-hidden relative"
                  >
                    <AnimatePresence mode="wait">
                      {isSubmitting ? (
                        <motion.div
                          key="loading"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex items-center gap-3 font-black uppercase tracking-widest italic"
                        >
                          <Loader2 className="h-6 w-6 animate-spin" />
                          Sending...
                        </motion.div>
                      ) : (
                        <motion.div
                          key="ready"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex items-center gap-4 font-black text-2xl uppercase tracking-widest italic"
                        >
                          Send Message <Send className="h-6 w-6 group-hover:translate-x-2 group-hover:-translate-y-1 transition-transform" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Button>
                </div>

                <p className="text-[10px] text-slate-500 text-center font-black uppercase tracking-[0.2em] italic mt-auto">
                  Secure communication via <span className="text-emerald-500">Google reCAPTCHA</span>
                </p>
              </form>
            </div>
          </motion.div>
        </div>
      </PageWrapper>
    </div>
  )
}