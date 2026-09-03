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
          className="group flex items-center gap-2 text-sm font-bold text-emerald-500 hover:text-emerald-400 transition-colors uppercase tracking-widest"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>
        <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tighter">
          Celoris <span className="text-emerald-500 italic">Blog</span>
        </h1>
      </div>
      <div className="max-w-md text-left md:text-right">
        <p className="text-lg text-slate-400 font-medium leading-relaxed">
          Stay updated with the latest trends in <span className="text-white">AI</span>, <span className="text-white">creative tools</span>, and the future of <span className="text-white">digital transformation</span> in India.
        </p>
      </div>
    </motion.div>
  )
}
