"use client"

import React, { useState } from 'react'
import { Play, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function TrainerVideoModal() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 border border-purple-400/30 hover:border-purple-300/50 text-purple-200 hover:text-white font-medium text-sm sm:text-base backdrop-blur-xl transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.5)] group"
            >
                <div className="w-5 h-5 rounded-full bg-purple-500/30 flex items-center justify-center group-hover:scale-110 transition-transform border border-purple-400/40">
                    <Play size={10} className="text-purple-300 fill-purple-300 ml-0.5" />
                </div>
                <span>Watch Explainer</span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-2xl">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="relative w-full max-w-4xl bg-[#08090d] border border-white/[0.12] rounded-3xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.9)]"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-4 px-6 border-b border-white/10 bg-black/60">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                                        Celoris Freedom For Educators
                                    </span>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                                    aria-label="Close Video Modal"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Video Container */}
                            <div className="relative aspect-video bg-black flex items-center justify-center">
                                <video
                                    src="/gallery/celoris_promo_no_commission.mp4"
                                    controls
                                    autoPlay
                                    className="w-full h-full object-contain"
                                />
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    )
}
