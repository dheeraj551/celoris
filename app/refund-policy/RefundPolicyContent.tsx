"use client"

import React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  RefreshCcw,
  ShieldCheck,
  CreditCard,
  AlertCircle,
  HelpCircle,
  Mail,
  Clock,
  Sparkles,
  GraduationCap,
  Scale,
  CheckCircle2,
  Building2,
  FileText,
  BadgeAlert
} from "lucide-react"
import { PageWrapper } from "@/components/PageWrapper"
import { motion } from "framer-motion"

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

export function RefundPolicyContent() {
  const sections = [
    {
      id: "overview",
      title: "1. Overview & Scope",
      icon: FileText,
      content:
        "This Refund and Cancellation Policy applies to all purchases, subscription packages, AI credit allocations, and educational programs offered by Celoris Designs LLP through its website (celorisdesigns.com) and associated mobile applications. We believe in complete transparency, fair business practices, and full compliance with Indian consumer protection standards, including the Consumer Protection Act, 2019 and the Consumer Protection (E-Commerce) Rules, 2020.",
      footer:
        "By subscribing to any paid plan or enrolling in a certified program on Celoris, you acknowledge and agree to the terms outlined in this policy.",
    },
    {
      id: "cancellation",
      title: "2. Subscription Cancellation Policy",
      icon: RefreshCcw,
      content:
        "You have complete autonomy over your subscriptions. Celoris never locks users into long-term mandatory contracts without their consent:",
      items: [
        "Cancel Anytime: You can cancel your monthly or annual subscription renewal at any time directly through your Account Settings or by sending an email to support@celorisdesigns.com.",
        "Retention of Benefits: Upon cancellation, your subscription will not renew for the subsequent billing cycle. However, you will retain full access to your plan features, studio tools, and remaining AI generation credits until the conclusion of your current paid billing period.",
        "Zero Cancellation Fee: There are no cancellation penalties, administrative fees, or exit charges.",
        "Auto-Debit Halts: For recurring mandates (UPI Autopay, e-mandates, or card auto-debits), cancelling on Celoris immediately cancels future recurring debit instructions.",
      ],
    },
    {
      id: "ai-credits-refund",
      title: "3. Refund Policy for AI Subscriptions & Credits",
      icon: Sparkles,
      content:
        "Our creative studio offers access to advanced machine-learning models and high-performance cloud GPUs (including Nano Banana, Seedance, Kling, and PolyVault). Generating AI assets incurs direct real-time compute costs. Therefore, the following refund rules apply:",
      subsections: [
        {
          title: "a. 7-Day Zero-Usage Cooling-Off Period",
          content:
            "If you subscribed to a paid tier (Basic, Pro, or Max) by mistake, you are eligible for a 100% full refund within 7 calendar days of purchase, provided that you have NOT consumed or generated any AI credits from your allotment during that billing cycle.",
        },
        {
          title: "b. Partially Used Subscriptions",
          content:
            "Once AI credits have been utilized (e.g. videos rendered, images synthesized, or prompt tokens dispatched to cloud compute clusters), the subscription fee cannot be refunded on a pro-rata basis for that month, as computing resources have already been permanently consumed.",
        },
        {
          title: "c. Annual Subscription Adjustments",
          content:
            "If you purchased an annual subscription and wish to cancel after the 7-day window, refund requests will be reviewed on a case-by-case basis. If approved, refunds will be calculated by converting past months of usage to the standard monthly rate and refunding the remaining unutilized balance.",
        },
      ],
    },
    {
      id: "failed-generations",
      title: "4. Failed Generations & System Outages",
      icon: AlertCircle,
      content:
        "We stand behind the reliability of our creative infrastructure:",
      items: [
        "Automatic Credit Re-credit: If an AI model generation fails due to a server error, GPU crash, network timeout, or platform glitch, your consumed credits are automatically restored to your wallet immediately.",
        "Manual Investigation: If credits were deducted for an incomplete or corrupted render that failed to download, notify support@celorisdesigns.com with your generation job ID or timestamp. Our team will manually replenish your credits or issue a replacement allotment within 24 hours.",
      ],
    },
    {
      id: "courses-refund",
      title: "5. Celoris Academy Courses & Live Batches",
      icon: GraduationCap,
      content:
        "Celoris provides both free learning tiers for students and specialized offline/hybrid masterclasses in Delhi NCR (Noida/Delhi):",
      items: [
        "Free Student Tier: Courses and learning pathways accessed under our verified student tier are 100% free of tuition charges and carry no financial commitments or cancellation obligations.",
        "Cancellations 48+ Hours Before First Batch Session: If you have enrolled in a paid certified masterclass or private workshop and wish to cancel at least 48 hours before the inaugural session, you are entitled to a 100% full refund.",
        "Cancellations After Batch Commencement: Once the live batch has started, refund requests are not eligible if you have attended more than 25% of the curriculum. However, you may request a free transfer of your seat to an upcoming future batch within 90 days.",
      ],
    },
    {
      id: "duplicate-charges",
      title: "6. Duplicate or Erroneous Transactions",
      icon: CreditCard,
      content:
        "If you were charged twice for a single plan due to a network lag, multiple UPI clicks, or payment gateway timeout:",
      items: [
        "100% Instant Reversal: The duplicate amount will be refunded in full without any administrative deduction.",
        "Verification: Simply share your 12-digit UPI UTR number or bank transaction reference with our support team, and our accounts department will process the reversal immediately.",
      ],
    },
    {
      id: "refund-timeline",
      title: "7. Refund Method & Processing Timelines",
      icon: Clock,
      content:
        "Approved refunds are executed in strict accordance with Reserve Bank of India (RBI) and National Payments Corporation of India (NPCI) directives:",
      items: [
        "Original Payment Source: Refunds are always routed back to the original source instrument (e.g. direct bank reversal to your UPI VPA, debit card, or net banking account). For security reasons, refunds cannot be paid out in cash or to third-party accounts.",
        "Processing Window: Once approved by our team, refunds are dispatched from our ICICI Bank merchant account within 24 to 48 business hours. Depending on your bank's clearing cycle, the funds typically reflect in your account within 5 to 7 working days.",
        "Zero Deduction on Legitimate Claims: No cancellation surcharge is levied on approved zero-usage or duplicate payment refunds.",
      ],
    },
    {
      id: "chargebacks",
      title: "8. Chargebacks & Friendly Dispute Resolution",
      icon: Scale,
      content:
        "We are committed to resolving every customer issue amicably and swiftly. If you have any billing question or concern, we strongly encourage you to contact us first via WhatsApp (+91 9084718101) or email (support@celorisdesigns.com). Filing an unrecognized bank chargeback without contacting our support team may temporarily freeze account access while the financial institution reviews the case.",
    },
    {
      id: "how-to-request",
      title: "9. How to Request a Cancellation or Refund",
      icon: HelpCircle,
      content:
        "Submitting a refund or cancellation request is quick and simple. Please reach out with the following details:",
      items: [
        "Your registered Celoris account email address",
        "Name of the plan or course purchased (e.g. Pro Plan, Basic Plan, Masterclass)",
        "Date of transaction and amount paid (in INR ₹)",
        "12-digit UPI Reference / UTR Number or payment receipt screenshot",
        "Reason for the refund request",
      ],
      footer:
        "Send these details to support@celorisdesigns.com with the subject line 'Refund Request — [Your Name]'. You will receive an official ticket acknowledgement within 24 hours.",
    },
    {
      id: "grievance",
      title: "10. Nodal Grievance Officer & Statutory Compliance",
      icon: Building2,
      content:
        "In accordance with the Information Technology Act, 2000 and the Consumer Protection (E-Commerce) Rules, 2020, the details of the designated Grievance Officer for Celoris Designs LLP are provided below:",
      items: [
        "Entity Name: M/S. CELORIS DESIGNS LLP",
        "LLP Identification Number (LLPIN): AAP-3965",
        "GSTIN: 09AAOFC5435B1ZJ",
        "Grievance Officer: Dheeraj Kushwaha (Designated Partner)",
        "Email: support@celorisdesigns.com / legal@celorisdesigns.com",
        "WhatsApp & Phone Support: +91 9084718101",
        "Official Address: Celoris Designs LLP, Sector 62 / Greater Noida West, Uttar Pradesh 201301, India",
      ],
      footer:
        "The Grievance Officer shall acknowledge any complaint within 48 hours and resolve consumer grievances within 15 business days from the date of receipt.",
    },
  ]

  return (
    <PageWrapper className="min-h-screen bg-[#050810] text-slate-200 selection:bg-emerald-500/30 font-sans">
      {/* Background Ambient Glows */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.08, 0.14, 0.08] }}
          transition={{ duration: 12, repeat: Infinity }}
          className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-emerald-600/20 rounded-full blur-[160px]"
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.05, 0.1, 0.05] }}
          transition={{ duration: 15, repeat: Infinity, delay: 2 }}
          className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[160px]"
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 py-16 sm:py-20 max-w-4xl">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-10"
        >
          <Button
            variant="ghost"
            className="text-emerald-400 hover:text-white hover:bg-white/5 mb-6 rounded-xl px-0 cursor-pointer"
            asChild
          >
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Home
            </Link>
          </Button>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Official Policy • Celoris Designs LLP</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white italic uppercase tracking-tight mb-3">
            Refund &amp; <span className="text-emerald-400">Cancellation</span> Policy
          </h1>
          <p className="text-slate-400 font-medium text-xs sm:text-sm italic">
            Last updated: March 2026 • Governed by Indian Consumer Protection Regulations
          </p>
        </motion.div>

        {/* Executive Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#0d1321]/70 backdrop-blur-3xl border border-white/10 rounded-3xl p-6 sm:p-8 mb-12 shadow-2xl space-y-4"
        >
          <div className="flex items-center gap-3 text-white font-bold text-base sm:text-lg">
            <Building2 className="w-5 h-5 text-emerald-400" />
            <span>M/S. CELORIS DESIGNS LLP (LLPIN: AAP-3965)</span>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            At <strong>Celoris</strong>, we strive to provide a world-class creative AI studio, reliable cloud generation tools, and impactful educational training across India. We believe in clear, equitable refund and cancellation policies that protect both our users and the computational integrity of our platform.
          </p>

          {/* Quick Summary Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-xs">
              <span className="text-emerald-400 font-bold block mb-1">⚡ 7-Day Cooling Off</span>
              <span className="text-neutral-400 text-[11px]">100% refund on paid plans if 0 credits have been consumed.</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-xs">
              <span className="text-purple-300 font-bold block mb-1">🔄 Cancel Anytime</span>
              <span className="text-neutral-400 text-[11px]">Zero cancellation penalty; keep plan benefits until period ends.</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-xs">
              <span className="text-teal-300 font-bold block mb-1">⏳ 5–7 Days Payout</span>
              <span className="text-neutral-400 text-[11px]">Direct refund to your originating UPI ID or bank account.</span>
            </div>
          </div>
        </motion.div>

        {/* Policy Sections */}
        <div className="space-y-10 mb-16">
          {sections.map((section, idx) => (
            <motion.section
              key={section.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.04 }}
              className="group scroll-mt-24 rounded-3xl bg-[#090b11] border border-white/[0.08] hover:border-emerald-500/30 p-6 sm:p-8 transition-all shadow-lg"
            >
              <div className="flex items-start gap-4 sm:gap-5">
                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-black transition-colors shrink-0">
                  <section.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl sm:text-2xl font-black text-white mb-3 uppercase tracking-tight group-hover:text-emerald-400 transition-colors">
                    {section.title}
                  </h2>

                  {section.content && (
                    <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-4">
                      {section.content}
                    </p>
                  )}

                  {section.subsections && (
                    <div className="space-y-4 mb-4">
                      {section.subsections.map((sub, sIdx) => (
                        <div key={sIdx} className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                          <h3 className="text-xs sm:text-sm font-bold text-white mb-1.5 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            {sub.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                            {sub.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {section.items && (
                    <ul className="space-y-2.5 mb-4">
                      {section.items.map((item, iIdx) => (
                        <li key={iIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {section.footer && (
                    <p className="text-xs text-neutral-400 italic pt-2 border-t border-white/[0.06]">
                      {section.footer}
                    </p>
                  )}
                </div>
              </div>
            </motion.section>
          ))}
        </div>

        {/* Contact Support Banner */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl bg-gradient-to-r from-emerald-500/15 via-purple-500/15 to-teal-500/15 border border-white/[0.12] p-6 sm:p-8 text-center"
        >
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-2">
            Need Help with a Payment or Cancellation?
          </h3>
          <p className="text-xs sm:text-sm text-neutral-300 max-w-lg mx-auto mb-6">
            Our accounts and support team are available to help you immediately. Message us on WhatsApp or send an email with your UPI UTR number.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            <a
              href="https://wa.me/919084718101?text=Hi%20Celoris%20Support!%20I%20have%20a%20question%20regarding%20my%20subscription%20or%20refund."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#25D366] hover:bg-[#20bc5a] text-black font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-colors cursor-pointer"
            >
              <WhatsAppIcon className="w-4 h-4" />
              <span>Chat on WhatsApp</span>
            </a>
            <a
              href="mailto:support@celorisdesigns.com?subject=Refund%20or%20Cancellation%20Inquiry"
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-white/[0.08] hover:bg-white/[0.14] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border border-white/[0.12] transition-colors cursor-pointer"
            >
              <Mail className="w-4 h-4 text-purple-400" />
              <span>Email Support</span>
            </a>
          </div>
        </motion.div>
      </div>
    </PageWrapper>
  )
}
