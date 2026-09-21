"use client"

import React, { useState } from "react"
import { ChevronDown, HelpCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

const FAQS = [
  {
    question: "Are the courses and classes really 100% free across all plans?",
    answer:
      "Yes! Since 2019, our foundational mission has been to provide free, high-impact digital skills training for India. Full access to all our courses — including Web Development, Digital Marketing, AI Tools, and Video Editing — is 100% free for every user, whether you are on the Free tier or the Max plan. Paid plans add higher GPU quotas, faster AI generation credits, and commercial licensing for AI tools."
  },
  {
    question: "What is the Free Classes Queue Priority (Boost 10, 50, 100)?",
    answer:
      "While all courses and live classes are 100% free for everyone, popular batches and live interactive sessions have limited seating. The Queue Priority gives your account a priority boost (+10 in Basic, +50 in Pro, and +100 VIP Boost in Max) when enrolling in high-demand live classes and workshops, fast-tracking your seat reservation ahead of the standard queue."
  },
  {
    question: "How does the Free Job Portal work? Are there any hidden commissions?",
    answer:
      "Zero hidden fees and 0% commission on your earnings. Anyone can browse, apply for verified jobs, and connect directly with hiring companies and clients. Paid plans give you elevated visibility such as Verified Applicant, Featured Talent, or Certified Spotlight badges that make your profile pop when recruiters search for creators."
  },
  {
    question: "What are AI credits and how are they consumed?",
    answer:
      "Credits are used for generating high-resolution images and videos across top-tier models. For example, in Nano Banana Pro, 1 generation costs approximately 2 credits, while a Seedance 2.0 Fast video generation costs around 17 credits. In addition, Pro and Max plans include unlimited generation access to several popular models like Nano Banana 2 and Kling 3.0."
  },
  {
    question: "Is pricing listed in INR (₹) and what payment methods are accepted?",
    answer:
      "All pricing is in Indian Rupees (INR - ₹) with all taxes clearly accounted for. We support UPI (Google Pay, PhonePe, Paytm), Net Banking, RuPay, Visa, Mastercard, and corporate invoicing."
  },
  {
    question: "Can I cancel or change my plan whenever I want?",
    answer:
      "Yes. You can upgrade, downgrade, or cancel your subscription at any time directly from your account settings with a single click. If you cancel, your plan benefits remain active until the end of your current billing period."
  },
  {
    question: "What is the difference between Seedance 2.0 and Seedance 2.5?",
    answer:
      "Seedance 2.0 is our ultra-crisp 4K video engine designed for cinematic motion, while Seedance 2.5 is our cutting-edge 1080p generative model built for fluid character animation, photorealistic facial dynamics, and camera trajectory control. Both are included with full access in the Pro and Max plans."
  }
]

export function PricingFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-medium mb-3">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Frequently Asked Questions</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Everything you need to know
        </h3>
        <p className="text-neutral-400 text-xs sm:text-sm mt-1">
          Have questions about our AI models, free classes, or the job portal? We've got answers.
        </p>
      </div>

      <div className="space-y-3">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx
          return (
            <div
              key={idx}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04] transition-all overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full py-4 px-5 text-left flex items-center justify-between gap-4 cursor-pointer"
              >
                <span className="text-sm sm:text-base font-bold text-white">
                  {faq.question}
                </span>
                <ChevronDown
                  className={cn(
                    "w-4 h-4 text-purple-400 shrink-0 transition-transform duration-200",
                    isOpen && "rotate-180"
                  )}
                />
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 text-xs sm:text-sm text-neutral-300 leading-relaxed border-t border-white/[0.04] pt-3">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </div>
  )
}
