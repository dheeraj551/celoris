"use client"

import { motion, useScroll } from 'framer-motion'
import { useIsMobile } from '@/hooks/use-mobile'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { X, Zap, BookOpen, Users } from 'lucide-react'

export function StickyCTA() {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)
  const { scrollY } = useScroll()
  const isMobile = useIsMobile()

  useEffect(() => {
    const handleScroll = () => {
      if (scrollY.current > 800 && !isDismissed) {
        setIsVisible(true)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [scrollY, isDismissed])

  const handleDismiss = () => {
    setIsDismissed(true)
    setIsVisible(false)
  }

  if (!isVisible || isDismissed) return null


  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`fixed z-50 ${isMobile ? 'bottom-20' : 'bottom-6'} left-1/2 -translate-x-1/2 w-[95%] max-w-md`}
    >
      <div className="glass-card rounded-2xl p-4 shadow-premium-lg">
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4 text-slate-400" />
        </button>

        <div className="flex items-center gap-4 pr-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg flex-shrink-0">
            <Zap className="w-6 h-6 text-white" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white leading-tight">
              Ready to start learning?
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              Join 5000+ students on Celoris
            </p>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <Link
            href="/learn"
            className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-widest py-3 rounded-xl transition-colors shadow-lg"
          >
            <BookOpen className="w-4 h-4" />
            Browse Courses
          </Link>
          <Link
            href="/social"
            className="flex-1 flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-widest py-3 rounded-xl transition-colors border border-white/10"
          >
            <Users className="w-4 h-4" />
            Join Community
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
