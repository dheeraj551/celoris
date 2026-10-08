"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"

export function BlogHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' as const }}
      className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16"
    >
      <div className="space-y-4">
        <Link
          href="/"
          className="group flex items-center gap-2 text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors tracking-wide"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight">
          Celoris <span className="text-amber-400 font-serif italic">Journal</span>
        </h1>
      </div>
      <div className="max-w-md text-left md:text-right">
        <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
          Production blueprints, post-production workflows, and creative strategies direct from our studio floor.
        </p>
      </div>
    </motion.div>
  )
}
