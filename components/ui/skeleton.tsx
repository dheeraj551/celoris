"use client"

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-gradient-to-r from-white/5 via-white/10 to-white/5 bg-[length:200%_100%]",
        className
      )}
    />
  )
}

export function CourseCardSkeleton() {
  return (
    <div className="glass-card rounded-2xl p-4 overflow-hidden">
      <Skeleton className="w-full h-32 rounded-xl mb-4" />
      <Skeleton className="w-3/4 h-5 rounded-lg mb-3" />
      <Skeleton className="w-1/2 h-4 rounded-lg mb-4" />
      <div className="flex items-center gap-2">
        <Skeleton className="w-8 h-8 rounded-full" />
        <Skeleton className="w-24 h-4 rounded-lg" />
      </div>
    </div>
  )
}

export function TestimonialSkeleton() {
  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center gap-4 mb-4">
        <Skeleton className="w-12 h-12 rounded-full" />
        <div className="flex-1">
          <Skeleton className="w-32 h-4 rounded-lg mb-2" />
          <Skeleton className="w-24 h-3 rounded-lg" />
        </div>
      </div>
      <Skeleton className="w-full h-16 rounded-lg mb-4" />
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="w-4 h-4 rounded" />
        ))}
      </div>
    </div>
  )
}

export function CommunityPostSkeleton() {
  return (
    <div className="glass-card rounded-2xl p-4">
      <div className="flex items-center gap-3 mb-4">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div>
          <Skeleton className="w-24 h-4 rounded-lg mb-1" />
          <Skeleton className="w-16 h-3 rounded-lg" />
        </div>
      </div>
      <Skeleton className="w-full h-40 rounded-xl mb-4" />
      <div className="flex justify-between">
        <Skeleton className="w-16 h-4 rounded-lg" />
        <Skeleton className="w-16 h-4 rounded-lg" />
      </div>
    </div>
  )
}

export function PageLoader() {
  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="relative w-16 h-16 mb-4">
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-emerald-500/20"
            animate={{ scale: [1, 1.2, 1], opacity: [1, 0, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-emerald-500"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <motion.div
            className="absolute inset-2 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700"
            animate={{ scale: [0.8, 1, 0.8] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>
        <p className="text-slate-400 text-sm font-medium uppercase tracking-widest">
          Loading Celoris
        </p>
      </motion.div>
    </div>
  )
}

export function ContentLoader() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-8 p-8 max-w-6xl mx-auto"
    >
      {/* Hero Skeleton */}
      <div className="text-center mb-16 pt-10">
        <Skeleton className="w-64 h-6 rounded-full mx-auto mb-6" />
        <Skeleton className="w-96 h-10 rounded-xl mx-auto mb-6" />
        <Skeleton className="w-48 h-4 rounded-full mx-auto" />
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <CourseCardSkeleton key={i} />
        ))}
      </div>

      {/* Featured Section */}
      <div className="mt-12">
        <Skeleton className="w-48 h-6 rounded-xl mb-6" />
        <div className="flex gap-4 overflow-hidden">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="w-72 h-40 rounded-2xl flex-shrink-0" />
          ))}
        </div>
      </div>
    </motion.div>
  )
}
