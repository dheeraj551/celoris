"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Sparkles, Wand2, Video, Box, Palette, Music,
    ArrowRight, Check, ExternalLink, Play
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface StudioItem {
    id: string
    name: string
    category: string
    icon: any
    color: string
    borderColor: string
    bgColor: string
    tagline: string
    description: string
    image: string
    link: string
    features: string[]
}

const STUDIOS: StudioItem[] = [
    {
        id: 'motion-swap',
        name: 'Motion Swap Studio',
        category: 'AI Motion & Animation',
        icon: Wand2,
        color: 'text-purple-400',
        borderColor: 'border-purple-500/40',
        bgColor: 'bg-purple-950/20',
        tagline: 'Record on phone, animate 2D/3D characters instantly',
        description: 'Empower your students to create viral animated shorts and dynamic lecture explainers without drawing keyframes. Extract 33 spatial body landmarks from standard video feeds.',
        image: '/zero-keyframes-motion-swap-puppet-rigging-2026.jpg',
        link: '/motion-swap',
        features: ['Real-time 3D spatial pose extraction', 'Zero manual keyframing required', 'Automated acoustic viseme lip-sync']
    },
    {
        id: 'photolite',
        name: 'PhotoLite Studio',
        category: 'Creative Design & Graphics',
        icon: Palette,
        color: 'text-emerald-400',
        borderColor: 'border-emerald-500/40',
        bgColor: 'bg-emerald-950/20',
        tagline: 'High-impact slide decks, course posters & illustrations',
        description: 'Design course banners, lecture slides, and marketing flyers in seconds. Built-in neural filters, background replacement, and vector typography.',
        image: '/trainer-ad-campaign-creative.jpg',
        link: '/photolite',
        features: ['Smart background removal in 1-click', 'Generative layout and design templates', 'Export in 4K ready for print or Instagram']
    },
    {
        id: 'video-studio',
        name: 'Video Studio',
        category: 'Short-Form & Course Video',
        icon: Video,
        color: 'text-cyan-400',
        borderColor: 'border-cyan-500/40',
        bgColor: 'bg-cyan-950/20',
        tagline: 'Cut lessons, auto-caption & render vertical Reels',
        description: 'Create snappy course promo clips and bite-sized social lessons directly in your browser. Automatic silence-cutting, kinetic subtitles, and multi-track audio.',
        image: '/topvideoedit.jpg',
        link: '/video-studio',
        features: ['Automatic phonetic subtitles', 'Timeline trimming and speed ramping', 'No watermarks, no software downloads']
    },
    {
        id: 'polyvault',
        name: 'PolyVault 3D',
        category: '3D Assets & Environments',
        icon: Box,
        color: 'text-amber-400',
        borderColor: 'border-amber-500/40',
        bgColor: 'bg-amber-950/20',
        tagline: 'Massive library of 3D models, props & textures',
        description: 'Bring architecture, game design, and 3D modeling classes to life with curated, production-ready Blender and Unreal assets ready for drag-and-drop.',
        image: '/virtual-production-game-engines-ai-2026.jpg',
        link: '/polyvault',
        features: ['Quad topology models ready for rigging', 'PBR materials with 4K textures', 'Direct Blender & Unity export']
    }
]

export function TrainerCreativeShowcase() {
    const [activeTab, setActiveTab] = useState(0)
    const studio = STUDIOS[activeTab]
    const IconComponent = studio.icon

    return (
        <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-white/5 relative">
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto mb-14">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-purple-500/15 text-purple-400 border border-purple-500/30 mb-3">
                    <Sparkles className="w-3.5 h-3.5" />
                    Built For Modern Creative Educators
                </span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
                    Supercharge Your Teaching with{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400">
                        Celoris AI Studios
                    </span>
                </h2>
                <p className="text-slate-400 text-sm sm:text-base mt-3">
                    While traditional platforms only give you a text profile, Celoris equips you with a full suite of cutting-edge creative tools—100% free of cost.
                </p>
            </div>

            {/* Interactive Tab Selector */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10">
                {STUDIOS.map((item, idx) => {
                    const ItemIcon = item.icon
                    const isActive = activeTab === idx
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(idx)}
                            className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                                isActive
                                    ? 'bg-white/10 text-white border border-white/20 shadow-xl backdrop-blur-xl scale-105'
                                    : 'bg-slate-900/60 text-slate-400 hover:text-white border border-transparent hover:border-white/10'
                            }`}
                        >
                            <ItemIcon className={`w-4 h-4 ${isActive ? item.color : 'text-slate-500'}`} />
                            <span>{item.name}</span>
                        </button>
                    )
                })}
            </div>

            {/* Active Studio Feature Card */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={studio.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3 }}
                    className={`rounded-3xl p-6 sm:p-10 border ${studio.borderColor} ${studio.bgColor} backdrop-blur-2xl shadow-2xl relative overflow-hidden`}
                >
                    <div className="grid lg:grid-cols-12 gap-8 items-center">
                        {/* Info Column (6 Cols) */}
                        <div className="lg:col-span-6 space-y-5 text-left">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono uppercase tracking-wider text-slate-300">
                                <IconComponent className={`w-3.5 h-3.5 ${studio.color}`} />
                                {studio.category}
                            </div>

                            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight">
                                {studio.tagline}
                            </h3>

                            <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
                                {studio.description}
                            </p>

                            {/* Features List */}
                            <ul className="space-y-2.5 pt-2">
                                {studio.features.map((feat, fIdx) => (
                                    <li key={fIdx} className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-200">
                                        <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                                            <Check className={`w-3 h-3 ${studio.color}`} />
                                        </div>
                                        <span>{feat}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="pt-4 flex flex-wrap items-center gap-4">
                                <Button
                                    size="lg"
                                    className="bg-white text-slate-950 hover:bg-slate-200 font-bold rounded-xl"
                                    asChild
                                >
                                    <Link href={studio.link} target="_blank" className="flex items-center gap-2">
                                        Test {studio.name} Live
                                        <ExternalLink size={16} />
                                    </Link>
                                </Button>
                                <span className="text-xs text-slate-400 font-mono">
                                    Included free for all registered trainers
                                </span>
                            </div>
                        </div>

                        {/* Visual Asset Preview (6 Cols) */}
                        <div className="lg:col-span-6">
                            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-white/15 shadow-2xl group">
                                <Image
                                    src={studio.image}
                                    alt={studio.name}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                                    <span className="font-bold font-mono tracking-wide">{studio.name} Showcase</span>
                                    <span className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] text-emerald-400 border border-emerald-500/30">
                                        FULL ACCESS UNLOCKED
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </section>
    )
}
