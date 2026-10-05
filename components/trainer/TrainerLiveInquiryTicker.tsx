"use client"

import React, { useState, useEffect } from 'react'
import { MapPin, Clock, IndianRupee, Sparkles, BookOpen } from 'lucide-react'

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
        budget: '₹8,000 / month',
        timeAgo: '4 mins ago',
        category: 'Creative Tech'
    },
    {
        id: '2',
        subject: 'Python & AI Machine Learning Tutor',
        location: 'Gurugram (Cyber City)',
        mode: 'Hybrid',
        budget: '₹1,200 / hour',
        timeAgo: '11 mins ago',
        category: 'Coding & AI'
    },
    {
        id: '3',
        subject: 'Graphic Design (Canva & Photoshop) for Business',
        location: 'South Delhi (Saket)',
        mode: 'Home Tuition',
        budget: '₹6,500 / month',
        timeAgo: '19 mins ago',
        category: 'Design'
    },
    {
        id: '4',
        subject: 'Advanced Microsoft Excel & Power Query',
        location: 'Noida Sector 18 / Online',
        mode: 'Online',
        budget: '₹950 / hour',
        timeAgo: '28 mins ago',
        category: 'Data & Finance'
    },
    {
        id: '5',
        subject: 'Class 11 & 12 CBSE Mathematics & Physics',
        location: 'Indirapuram, Ghaziabad',
        mode: 'Home Tuition',
        budget: '₹1,000 / hour',
        timeAgo: '35 mins ago',
        category: 'Academics'
    },
    {
        id: '6',
        subject: 'Spoken English & Professional Communication',
        location: 'Delhi NCR & Pan-India',
        mode: 'Online',
        budget: '₹5,000 / month',
        timeAgo: '42 mins ago',
        category: 'Languages'
    }
]

export function TrainerLiveInquiryTicker() {
    const [currentIndex, setCurrentIndex] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % SAMPLE_INQUIRIES.length)
        }, 4500)
        return () => clearInterval(interval)
    }, [])

    const item = SAMPLE_INQUIRIES[currentIndex]

    return (
        <div className="w-full bg-[#070d18] border border-white/10 rounded-2xl p-4 sm:p-5 shadow-lg relative overflow-hidden">
            {/* Live Indicator */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-3 border-b border-white/5">
                <div className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                        Live Student Demand Ticker (Delhi NCR & Online)
                    </span>
                </div>
                <span className="text-[11px] text-slate-500 font-mono">
                    Updated real-time • 0% Commission
                </span>
            </div>

            {/* Current Active Item */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in transition-all">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white tracking-wide">
                            {item.subject}
                        </span>
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-800/40">
                            {item.mode}
                        </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-500" />
                            {item.location}
                        </span>
                        <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-500" />
                            {item.timeAgo}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="text-right sm:text-right">
                        <span className="text-[10px] text-slate-500 block uppercase font-mono">Student Budget</span>
                        <span className="text-sm font-bold text-emerald-400 font-mono">
                            {item.budget}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}
