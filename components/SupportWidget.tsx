"use client"

import React, { useState } from 'react';
import { X, Heart, Coffee } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export function SupportWidget() {
    const [isVisible, setIsVisible] = useState(true);
    const [isHovered, setIsHovered] = useState(false);

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-6 left-6 md:left-[280px] z-50">
            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="relative group"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <button 
                        onClick={() => setIsVisible(false)}
                        className="absolute -top-3 -right-3 bg-[#0f0f0f] text-slate-400 hover:text-white hover:bg-rose-500/20 hover:text-rose-500 border border-white/10 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all z-10 shadow-xl"
                        aria-label="Close support widget"
                    >
                        <X className="w-4 h-4" />
                    </button>
                    
                    <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl shadow-2xl overflow-hidden hover:border-emerald-500/30 transition-all shadow-[0_10px_40px_rgba(0,0,0,0.5)] flex flex-col items-center">
                        <div className="relative w-48 h-[400px] overflow-hidden bg-[#fff5f0]">
                            <Image 
                                src="/support.png" 
                                alt="Support us via QR Code" 
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 33vw"
                            />
                        </div>
                        <div className="w-full bg-[#1e1f20] p-3 border-t border-white/10 text-center flex items-center justify-center gap-2 group-hover:bg-emerald-500/10 transition-colors cursor-default">
                            <Coffee className="w-4 h-4 text-emerald-500 animate-pulse" />
                            <span className="text-xs font-bold text-slate-200 uppercase tracking-widest">Support Us</span>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
