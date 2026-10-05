"use client"

import React, { useState, useEffect } from 'react'
import { ArrowRight, MapPin, Clock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

interface InquiryItem {
    id: string
    subject: string
    location: string
    mode: 'Online' | 'Home Tuition' | 'Hybrid'
    budget: string
    timeAgo: string
    category: string
}

const SAMPLE_INQUIRIES: InquiryItem[] = [
    {
        id: '1',
        subject: 'Video Editing & Premiere Pro Masterclass',
        location: 'Noida Sector 62 / Online',
        mode: 'Online',
        budget: '₹8,000 / mo',
        timeAgo: '4m ago',
        category: 'Creative Tech'
    },
    {
        id: '2',
        subject: 'Python & AI Machine Learning Tutor',
        location: 'Gurugram (Cyber City)',
        mode: 'Hybrid',
        budget: '₹1,200 / hr',
        timeAgo: '11m ago',
        category: 'Coding & AI'
    },
    {
        id: '3',
        subject: 'Graphic Design (Photoshop & Canva)',
        location: 'South Delhi (Saket)',
        mode: 'Home Tuition',
        budget: '₹6,500 / mo',
        timeAgo: '19m ago',
        category: 'Design'
    },
    {
        id: '4',
        subject: 'Advanced Microsoft Excel & Power Query',
        location: 'Noida Sector 18 / Online',
        mode: 'Online',
        budget: '₹950 / hr',
        timeAgo: '28m ago',
        category: 'Data & Finance'
    },
    {
        id: '5',
        subject: 'Class 11 & 12 CBSE Mathematics',
        location: 'Indirapuram, Ghaziabad',
        mode: 'Home Tuition',
        budget: '₹1,000 / hr',
        timeAgo: '35m ago',
        category: 'Academics'
    },
    {
        id: '6',
        subject: 'Spoken English & Communication',
        location: 'Delhi NCR & Pan-India',
        mode: 'Online',
        budget: '₹5,000 / mo',
        timeAgo: '42m ago',
        category: 'Languages'
    }
]

export function TrainerLiveInquiryTicker() {
    const [currentIndex, setCurrentIndex] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % SAMPLE_INQUIRIES.length)
        }, 4200)
        return () => clearInterval(interval)
    }, [])

    const item = SAMPLE_INQUIRIES[currentIndex]

    return (
        <div className="relative z-20 my-4 sm:my-6 flex justify-center items-center px-2 sm:px-4">
            {/* Ambient dynamic glow behind capsule dock */}
            <div className="absolute -inset-1 -z-10 bg-gradient-to-r from-emerald-500/15 via-cyan-500/15 to-purple-500/15 rounded-full blur-2xl opacity-50 pointer-events-none" />

            {/* DYNAMIC ISLAND NANO-GLASS CAPSULE DOCK */}
            <div className="relative flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 sm:gap-4 p-1.5 sm:p-2 sm:px-4 rounded-full bg-[#08090d]/85 backdrop-blur-3xl border border-white/[0.12] shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.06),inset_0_1px_1px_rgba(255,255,255,0.2)] max-w-4xl w-full select-none">
                
                {/* Live Pulse Indicator Tag */}
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.1] shrink-0">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                        Live Enquiries
                    </span>
                </div>

                {/* Rotating Inquiry Details */}
                <div className="flex-1 min-w-0 px-2 text-left">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.25 }}
                            className="flex items-center gap-2.5 truncate"
                        >
                            <span className="text-xs sm:text-sm font-medium text-neutral-100 truncate">
                                {item.subject}
                            </span>
                            <span className="text-[10px] text-neutral-400 font-mono hidden md:inline shrink-0">
                                • {item.location} ({item.timeAgo})
                            </span>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Budget Pill & Direct CTA */}
                <div className="flex items-center gap-2 shrink-0">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 font-mono text-xs font-semibold">
                        {item.budget}
                    </span>
                    <Link
                        href="/register"
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.08] hover:bg-white/[0.14] border border-white/[0.15] text-white text-xs font-medium transition-all hover:scale-105 active:scale-95"
                    >
                        <span>Connect</span>
                        <ArrowRight size={12} className="text-emerald-400" />
                    </Link>
                </div>
            </div>
        </div>
    )
}
