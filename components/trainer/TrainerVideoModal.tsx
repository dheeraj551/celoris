"use client"

import React, { useState } from 'react'
import { Play, X, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'

export function TrainerVideoModal() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <Button
                onClick={() => setIsOpen(true)}
                variant="outline"
                size="lg"
                className="w-full sm:w-auto border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl px-7 h-14 text-sm sm:text-base backdrop-blur-xl group transition-all"
            >
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform border border-emerald-500/40">
                    <Play size={14} className="text-emerald-400 fill-emerald-400 ml-0.5" />
                </div>
                <span>Watch 30s Explainer</span>
            </Button>

            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-2xl">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="relative w-full max-w-4xl bg-slate-950 border border-emerald-500/40 rounded-3xl overflow-hidden shadow-2xl shadow-emerald-950/50"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-4 px-6 border-b border-white/10 bg-slate-900/80">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
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

                            {/* Footer */}
                            <div className="p-4 px-6 bg-slate-900/60 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
                                <span>0% Platform Commission • Direct Student Contact</span>
                                <Button
                                    size="sm"
                                    className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold"
                                    onClick={() => setIsOpen(false)}
                                    asChild
                                >
                                    <a href="/register">Join as a Trainer</a>
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    )
}
