"use client"

import React, { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Wand2, Video, Box, Palette, Music,
    Check, ExternalLink, Play, Move, Crop,
    Paintbrush, Type, Layers, Eye, EyeOff, ChevronsLeftRight,
    Star, Download, UploadCloud, Activity, Scan, Target
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LazyLoopVideo, SHOWCASE_MEDIA } from '@/components/home-new/ShowcaseMedia'

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
        description: 'Record a move on your phone and transfer it onto a character for animated shorts and lecture explainers, without drawing a single keyframe.',
        link: '/motion-swap',
        features: ['Motion transfer from a normal phone video', 'No manual keyframing', 'Pay-per-use with Celoris credits']
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
        link: '/polyvault',
        features: ['Quad topology models ready for rigging', 'PBR materials with 4K textures', 'Direct Blender & Unity export']
    }
]

/* =========================================================================
   1. Motion Swap Studio Interactive Preview
   ========================================================================= */
function MotionSwapInteractivePreview() {
    const [showSkeleton, setShowSkeleton] = useState(true)

    return (
        <div className="relative w-full h-[430px] sm:h-[470px] flex items-center justify-center select-none">
            {/* Background glow orbs */}
            <div className="absolute top-1/4 right-6 w-56 h-56 bg-purple-600/15 rounded-full blur-[70px] pointer-events-none" />
            <div className="absolute bottom-10 left-6 w-48 h-48 bg-pink-600/10 rounded-full blur-[60px] pointer-events-none" />

            {/* Main Viewport Window */}
            <div className="absolute top-2 right-2 sm:right-4 w-[78%] sm:w-[74%] h-[78%] sm:h-[80%] rounded-2xl border border-purple-500/30 shadow-[0_0_35px_rgba(168,85,247,0.2)] overflow-hidden z-10 bg-[#0e0f14] flex flex-col">
                {/* Window Chrome */}
                <div className="flex items-center justify-between px-3 py-2 border-b border-white/10 bg-black/50 shrink-0">
                    <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-red-500/80" />
                        <span className="w-2 h-2 rounded-full bg-yellow-500/80" />
                        <span className="w-2 h-2 rounded-full bg-green-500/80" />
                        <span className="ml-2 text-[9px] text-slate-400 font-mono hidden sm:inline">motionswap.celoris.app</span>
                    </div>
                    <button
                        type="button"
                        onClick={() => setShowSkeleton((prev) => !prev)}
                        className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold tracking-wider transition-all border ${
                            showSkeleton
                                ? 'bg-purple-500/30 border-purple-400 text-purple-200 shadow-[0_0_10px_rgba(168,85,247,0.4)]'
                                : 'bg-white/5 border-white/15 text-slate-400 hover:text-white'
                        }`}
                    >
                        {showSkeleton ? '● SKELETON ON' : '○ SKELETON OFF'}
                    </button>
                </div>

                {/* Video Canvas with Skeleton Landmark HUD */}
                <div className="relative flex-1 bg-[#050608] overflow-hidden group">
                    <LazyLoopVideo
                        src={`${SHOWCASE_MEDIA}motion-swap-suv.mp4`}
                        poster={`${SHOWCASE_MEDIA}motion-swap-suv.jpg`}
                        className="absolute inset-0 w-full h-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

                    {/* SVG 33-point Landmark Skeleton Overlay */}
                    {showSkeleton && (
                        <svg
                            className="absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-300"
                            viewBox="0 0 400 300"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            {/* Skeleton Connecting Lines */}
                            <g stroke="rgba(192, 132, 252, 0.75)" strokeWidth="2" strokeDasharray="3 3">
                                {/* Spine & Neck */}
                                <line x1="200" y1="90" x2="200" y2="155" />
                                {/* Shoulders */}
                                <line x1="165" y1="110" x2="235" y2="110" />
                                {/* Left Arm */}
                                <line x1="165" y1="110" x2="145" y2="145" />
                                <line x1="145" y1="145" x2="135" y2="185" />
                                {/* Right Arm */}
                                <line x1="235" y1="110" x2="255" y2="145" />
                                <line x1="255" y1="145" x2="265" y2="185" />
                                {/* Hips */}
                                <line x1="175" y1="165" x2="225" y2="165" />
                                {/* Left Leg */}
                                <line x1="175" y1="165" x2="160" y2="215" />
                                <line x1="160" y1="215" x2="150" y2="265" />
                                {/* Right Leg */}
                                <line x1="225" y1="165" x2="240" y2="215" />
                                <line x1="240" y1="215" x2="250" y2="265" />
                            </g>

                            {/* Head Circle */}
                            <circle cx="200" cy="75" r="14" stroke="#c084fc" strokeWidth="2" fill="rgba(192, 132, 252, 0.15)" />
                            <circle cx="200" cy="75" r="3" fill="#e879f9" />

                            {/* Landmark Joint Dots with Glow */}
                            {[
                                [165, 110], [235, 110], [200, 110],
                                [145, 145], [255, 145],
                                [135, 185], [265, 185],
                                [200, 155], [175, 165], [225, 165],
                                [160, 215], [240, 215],
                                [150, 265], [250, 265],
                                [195, 73], [205, 73], [200, 80],
                                [130, 192], [140, 192], [260, 192], [270, 192],
                                [142, 275], [158, 275], [242, 275], [258, 275]
                            ].map(([cx, cy], idx) => (
                                <g key={idx}>
                                    <circle cx={cx} cy={cy} r="4" fill="#a855f7" className="animate-pulse" />
                                    <circle cx={cx} cy={cy} r="2" fill="#ffffff" />
                                </g>
                            ))}

                            {/* Bounding Box HUD */}
                            <rect x="110" y="50" width="180" height="235" rx="8" stroke="rgba(192, 132, 252, 0.4)" strokeWidth="1" strokeDasharray="4 4" />
                            <text x="115" y="44" fill="#c084fc" fontSize="9" fontFamily="monospace">POSE_TRACK</text>
                        </svg>
                    )}

                    {/* Bottom Video Badge */}
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[10px]">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md border border-purple-500/30 text-purple-200 font-mono">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                            Auto-Rigging Active
                        </span>
                        <span className="text-slate-300 font-mono bg-black/60 px-2 py-0.5 rounded border border-white/10 hidden sm:inline">
                            30 FPS · 720p
                        </span>
                    </div>
                </div>
            </div>

            {/* Floating Toolbar Strip (Left) */}
            <div className="absolute top-6 left-2 sm:left-4 w-12 sm:w-14 py-3 bg-[#111218]/95 backdrop-blur-xl rounded-2xl border border-purple-500/30 shadow-xl flex flex-col items-center gap-3.5 z-20">
                <Target className="w-4 h-4 text-purple-400" />
                <Wand2 className="w-4 h-4 text-slate-400 hover:text-purple-300 transition-colors" />
                <Scan className="w-4 h-4 text-slate-400 hover:text-purple-300 transition-colors" />
                <Activity className="w-4 h-4 text-slate-400 hover:text-purple-300 transition-colors" />
            </div>

            {/* Floating Telemetry Panel (Bottom-Left) */}
            <div className="absolute bottom-3 left-2 sm:left-4 w-44 sm:w-48 bg-[#0b0c10]/95 backdrop-blur-xl rounded-2xl border border-purple-500/30 p-3 shadow-[0_10px_30px_rgba(0,0,0,0.6)] z-20">
                <div className="flex items-center justify-between text-[10px] font-bold text-purple-300 uppercase tracking-widest mb-2 font-mono">
                    <span className="flex items-center gap-1.5">
                        <Activity className="w-3 h-3 text-purple-400" />
                        AI Telemetry
                    </span>
                    <span className="text-emerald-400 font-mono text-[9px]">ONLINE</span>
                </div>
                <div className="space-y-1.5 font-mono text-[10px]">
                    <div className="flex justify-between text-slate-300">
                        <span className="text-slate-500">Engine:</span>
                        <span className="text-slate-200 truncate">Higgsfield Genjutsu</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                        <span className="text-slate-500">Keyframing:</span>
                        <span className="text-purple-400 font-bold">0 Keyframes</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

/* =========================================================================
   2. PhotoLite Studio Interactive Preview
   ========================================================================= */
const PHOTOLITE_PAIRS = [
    {
        label: 'Relight & expand',
        before: `${SHOWCASE_MEDIA}photolite-pair1-before.jpg`,
        after: `${SHOWCASE_MEDIA}photolite-pair1-after.jpg`,
    },
    {
        label: 'Retouch & expand',
        before: `${SHOWCASE_MEDIA}photolite-pair2-before.jpg`,
        after: `${SHOWCASE_MEDIA}photolite-pair2-after.jpg`,
    },
]

const SWEEP_MS = 5200
const SWEEPS_PER_PAIR = 2

function BeforeAfterSlider({
    pairIndex,
    onPairChange,
    onPosition,
}: {
    pairIndex: number
    onPairChange: (i: number) => void
    onPosition: (p: number) => void
}) {
    const boxRef = useRef<HTMLDivElement | null>(null)
    const [pos, setPos] = useState(50)
    const posRef = useRef(50)
    const dragging = useRef(false)
    const idleUntil = useRef(0)
    const visible = useRef(false)
    const pairRef = useRef(pairIndex)
    pairRef.current = pairIndex

    const set = useCallback(
        (p: number) => {
            const v = Math.max(0, Math.min(100, p))
            posRef.current = v
            setPos(v)
            onPosition(v)
        },
        [onPosition]
    )

    useEffect(() => {
        const el = boxRef.current
        if (!el) return
        const reduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
        if (reduced) return
        const io = new IntersectionObserver((e) => (visible.current = e.some((x) => x.isIntersecting)), { threshold: 0.2 })
        io.observe(el)
        let raf = 0
        let t0 = performance.now()
        let sweeps = 0
        const tick = (now: number) => {
            if (visible.current && !dragging.current && now > idleUntil.current) {
                const phase = ((now - t0) % SWEEP_MS) / SWEEP_MS
                const done = Math.floor((now - t0) / SWEEP_MS)
                if (done > sweeps) {
                    sweeps = done
                    if (sweeps % SWEEPS_PER_PAIR === 0) onPairChange((pairRef.current + 1) % PHOTOLITE_PAIRS.length)
                }
                set(50 - 38 * Math.cos(phase * Math.PI * 2))
            } else {
                t0 = now - (Math.acos(Math.max(-1, Math.min(1, (50 - posRef.current) / 38))) / (Math.PI * 2)) * SWEEP_MS
                sweeps = 0
            }
            raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
        return () => {
            cancelAnimationFrame(raf)
            io.disconnect()
        }
    }, [onPairChange, set])

    const fromEvent = (e: React.PointerEvent) => {
        const r = boxRef.current?.getBoundingClientRect()
        if (!r) return
        set(((e.clientX - r.left) / r.width) * 100)
    }

    const pair = PHOTOLITE_PAIRS[pairIndex]
    return (
        <div
            ref={boxRef}
            className="absolute inset-0 select-none cursor-ew-resize"
            style={{ touchAction: 'pan-y' }}
            onPointerDown={(e) => {
                dragging.current = true
                ;(e.currentTarget as HTMLDivElement).setPointerCapture?.(e.pointerId)
                fromEvent(e)
            }}
            onPointerMove={(e) => dragging.current && fromEvent(e)}
            onPointerUp={() => {
                dragging.current = false
                idleUntil.current = performance.now() + 3500
            }}
            onPointerCancel={() => {
                dragging.current = false
                idleUntil.current = performance.now() + 3500
            }}
            role="slider"
            aria-label="Before and after comparison"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(pos)}
            tabIndex={0}
        >
            {PHOTOLITE_PAIRS.map((p, i) => (
                <div key={p.label} className={`absolute inset-0 transition-opacity duration-700 ${i === pairIndex ? 'opacity-100' : 'opacity-0'}`}>
                    <img src={p.after} alt={`${p.label} — after`} loading="lazy" draggable={false} className="absolute inset-0 w-full h-full object-cover" />
                    <img
                        src={p.before}
                        alt={`${p.label} — before`}
                        loading="lazy"
                        draggable={false}
                        className="absolute inset-0 w-full h-full object-cover"
                        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
                    />
                </div>
            ))}

            {/* Labels */}
            <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-[9px] font-bold uppercase tracking-wider text-slate-200 pointer-events-none">
                Before
            </span>
            <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-emerald-500/30 backdrop-blur-md border border-emerald-300/40 text-[9px] font-bold uppercase tracking-wider text-emerald-200 pointer-events-none">
                After
            </span>
            <span className="absolute bottom-2.5 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-[10px] font-semibold text-white whitespace-nowrap pointer-events-none">
                {pair.label}
            </span>

            {/* Handle */}
            <div className="absolute top-0 bottom-0 pointer-events-none" style={{ left: `${pos}%` }}>
                <div className="absolute top-0 bottom-0 -translate-x-1/2 w-0.5 bg-white shadow-[0_0_12px_rgba(16,185,129,0.9)]" />
                <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-[0_0_18px_rgba(16,185,129,0.7)] border-2 border-emerald-400">
                    <ChevronsLeftRight className="w-3.5 h-3.5" />
                </div>
            </div>
        </div>
    )
}

function PhotoLiteInteractivePreview() {
    const [pairIndex, setPairIndex] = useState(0)
    const [afterDominant, setAfterDominant] = useState(true)
    const onPosition = useCallback((p: number) => setAfterDominant(p < 50), [])

    return (
        <div className="relative w-full h-[430px] sm:h-[470px] flex items-center justify-center select-none">
            {/* Background glow orbs */}
            <div className="absolute top-1/4 right-6 w-56 h-56 bg-emerald-600/15 rounded-full blur-[70px] pointer-events-none" />
            <div className="absolute bottom-10 left-6 w-48 h-48 bg-teal-600/10 rounded-full blur-[60px] pointer-events-none" />

            {/* Main Window */}
            <div className="absolute top-2 right-2 sm:right-4 w-[78%] sm:w-[74%] h-[78%] sm:h-[80%] rounded-2xl border border-emerald-500/30 shadow-[0_0_35px_rgba(16,185,129,0.2)] overflow-hidden z-10 bg-[#0e0f14] flex flex-col">
                {/* Window Chrome */}
                <div className="flex items-center justify-between px-3 py-2 border-b border-white/10 bg-black/50 shrink-0">
                    <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-red-500/80" />
                        <span className="w-2 h-2 rounded-full bg-yellow-500/80" />
                        <span className="w-2 h-2 rounded-full bg-green-500/80" />
                        <span className="ml-2 text-[9px] text-slate-400 font-mono hidden sm:inline">photolite.celoris.app</span>
                    </div>
                    {/* Pair Toggle Button */}
                    <div className="flex items-center gap-1 bg-black/40 p-0.5 rounded-lg border border-white/10">
                        {PHOTOLITE_PAIRS.map((p, idx) => (
                            <button
                                key={p.label}
                                type="button"
                                onClick={() => setPairIndex(idx)}
                                className={`px-2 py-0.5 rounded-md text-[9px] font-medium transition-all ${
                                    pairIndex === idx
                                        ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                                        : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                {idx === 0 ? 'Relight' : 'Retouch'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Viewport with Before/After Slider */}
                <div className="relative flex-1 bg-[#0c0c0e]">
                    <BeforeAfterSlider
                        pairIndex={pairIndex}
                        onPairChange={setPairIndex}
                        onPosition={onPosition}
                    />
                </div>
            </div>

            {/* Floating Toolbar Strip (Left) */}
            <div className="absolute top-6 left-2 sm:left-4 w-12 sm:w-14 py-3 bg-[#111218]/95 backdrop-blur-xl rounded-2xl border border-emerald-500/30 shadow-xl flex flex-col items-center gap-3.5 z-20">
                <Move className="w-4 h-4 text-emerald-400" />
                <Crop className="w-4 h-4 text-slate-400 hover:text-emerald-300 transition-colors" />
                <Paintbrush className="w-4 h-4 text-slate-400 hover:text-emerald-300 transition-colors" />
                <Type className="w-4 h-4 text-slate-400 hover:text-emerald-300 transition-colors" />
            </div>

            {/* Floating Layers Panel (Bottom-Left) */}
            <div className="absolute bottom-3 left-2 sm:left-4 w-44 sm:w-48 bg-[#0b0c10]/95 backdrop-blur-xl rounded-2xl border border-emerald-500/30 p-3 shadow-[0_10px_30px_rgba(0,0,0,0.6)] z-20">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-300 uppercase tracking-widest mb-2 font-mono">
                    <Layers className="w-3 h-3 text-emerald-400" />
                    Layers
                </div>
                <div className="flex flex-col gap-1.5">
                    {[
                        { name: pairIndex === 0 ? 'Neural Relight' : 'Face Retouch', color: 'bg-emerald-500/60', edit: true },
                        { name: 'Generative Canvas', color: 'bg-teal-500/60', edit: true },
                        { name: 'Original Photo', color: 'bg-slate-500/60', edit: false },
                    ].map((layer) => {
                        const on = !layer.edit || afterDominant
                        return (
                            <div
                                key={layer.name}
                                className={`flex items-center gap-2 px-2 py-1 rounded-lg transition-colors duration-300 ${
                                    layer.edit && on ? 'bg-emerald-500/15 border border-emerald-400/30' : 'bg-white/5 border border-transparent'
                                }`}
                            >
                                <div className={`w-3.5 h-3.5 rounded ${layer.color} ${on ? '' : 'opacity-30'}`} />
                                <span className={`text-[10px] flex-1 ${on ? 'text-slate-200' : 'text-slate-500 line-through'}`}>{layer.name}</span>
                                {on ? <Eye className="w-2.5 h-2.5 text-emerald-400" /> : <EyeOff className="w-2.5 h-2.5 text-slate-600" />}
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

/* =========================================================================
   3. Video Studio Interactive Preview
   ========================================================================= */
const VIDEO_REEL_SECONDS = 12
const VIDEO_SEGMENTS = [
    { label: 'Racetrack selfie', start: 0, dur: 3.5, thumb: 'video-studio-clip1.jpg' },
    { label: 'Neon street drift', start: 3.5, dur: 2.5, thumb: 'video-studio-clip2.jpg' },
    { label: 'Stadium concert', start: 6, dur: 3.5, thumb: 'video-studio-clip3.jpg' },
    { label: 'Tiny me', start: 9.5, dur: 2.5, thumb: 'video-studio-clip4.jpg' },
]

function VideoStudioInteractivePreview() {
    const videoRef = useRef<HTMLVideoElement | null>(null)
    const playheadRef = useRef<HTMLDivElement | null>(null)
    const timeRef = useRef<HTMLSpanElement | null>(null)
    const [active, setActive] = useState(0)
    const activeRef = useRef(0)

    useEffect(() => {
        const v = videoRef.current
        if (!v) return
        let raf = 0
        const tick = () => {
            const t = (v.currentTime || 0) % VIDEO_REEL_SECONDS
            if (playheadRef.current) playheadRef.current.style.left = `${(t / VIDEO_REEL_SECONDS) * 100}%`
            if (timeRef.current) timeRef.current.textContent = `0:${Math.floor(t) < 10 ? '0' : ''}${Math.floor(t)}`
            let seg = 0
            for (let i = VIDEO_SEGMENTS.length - 1; i >= 0; i--) {
                if (t >= VIDEO_SEGMENTS[i].start) {
                    seg = i
                    break
                }
            }
            if (seg !== activeRef.current) {
                activeRef.current = seg
                setActive(seg)
            }
            raf = requestAnimationFrame(tick)
        }
        const start = () => {
            cancelAnimationFrame(raf)
            raf = requestAnimationFrame(tick)
        }
        const stop = () => cancelAnimationFrame(raf)
        v.addEventListener('play', start)
        v.addEventListener('pause', stop)
        if (!v.paused) start()
        return () => {
            stop()
            v.removeEventListener('play', start)
            v.removeEventListener('pause', stop)
        }
    }, [])

    const jumpTo = (i: number) => {
        const v = videoRef.current
        if (!v) return
        try {
            v.currentTime = VIDEO_SEGMENTS[i].start + 0.05
            v.play?.().catch(() => undefined)
        } catch {}
    }

    return (
        <div className="relative w-full h-[430px] sm:h-[470px] flex flex-col justify-between p-2 select-none">
            {/* Background glow orbs */}
            <div className="absolute top-1/4 right-6 w-56 h-56 bg-cyan-600/15 rounded-full blur-[70px] pointer-events-none" />
            <div className="absolute bottom-10 left-6 w-48 h-48 bg-blue-600/10 rounded-full blur-[60px] pointer-events-none" />

            {/* Main Video Viewport Window */}
            <div className="relative w-full h-[250px] sm:h-[270px] bg-[#0c0d12] rounded-2xl border border-cyan-500/30 shadow-[0_0_35px_rgba(6,182,212,0.15)] overflow-hidden flex flex-col z-20">
                {/* Chrome Bar */}
                <div className="flex items-center justify-between px-3 py-1.5 border-b border-white/10 bg-black/60 shrink-0">
                    <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-red-500/80" />
                        <span className="w-2 h-2 rounded-full bg-yellow-500/80" />
                        <span className="w-2 h-2 rounded-full bg-green-500/80" />
                        <span className="ml-2 text-[9px] text-slate-400 font-mono">videostudio.celoris.app</span>
                    </div>
                    <span className="text-[9px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                        4K 60FPS TIMELINE
                    </span>
                </div>

                {/* Video Canvas */}
                <div className="relative flex-1 bg-black overflow-hidden">
                    <LazyLoopVideo
                        videoRef={videoRef}
                        src={`${SHOWCASE_MEDIA}video-studio-reel.mp4`}
                        poster={`${SHOWCASE_MEDIA}video-studio-reel.jpg`}
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />

                    {/* Active clip badge */}
                    <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between z-10">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-[11px] font-semibold text-white">
                            <Play className="w-2.5 h-2.5 text-cyan-400" fill="currentColor" />
                            {VIDEO_SEGMENTS[active].label}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-[10px] font-mono text-cyan-300">
                            Clip {active + 1}/{VIDEO_SEGMENTS.length}
                        </span>
                    </div>
                </div>
            </div>

            {/* Interactive Bottom Timeline Strip */}
            <div className="relative w-full h-[155px] sm:h-[165px] bg-[#0b0c10]/95 backdrop-blur-xl rounded-2xl border border-cyan-500/20 p-2.5 flex flex-col justify-between shadow-2xl z-20">
                {/* Timeline Header */}
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 border-b border-white/5 pb-1">
                    <div className="flex items-center gap-3">
                        <span className="text-cyan-400 font-bold uppercase tracking-wider text-[9px]">Timeline Track</span>
                        <div className="hidden sm:flex gap-4 opacity-50 text-[9px]">
                            <span>0:00</span><span>0:03</span><span>0:06</span><span>0:09</span><span>0:12</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[9px] text-slate-500">TIME:</span>
                        <span ref={timeRef} className="text-cyan-300 font-bold">0:00</span>
                    </div>
                </div>

                {/* Video Track Clip Buttons */}
                <div className="relative my-1">
                    {/* Moving Playhead */}
                    <div
                        ref={playheadRef}
                        className="absolute -top-1 -bottom-1 w-px bg-cyan-400 z-30 shadow-[0_0_8px_rgba(6,182,212,1)] pointer-events-none"
                        style={{ left: '0%' }}
                    >
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-white rounded-sm border-2 border-cyan-500" />
                    </div>

                    <div className="flex gap-1.5 items-center">
                        {VIDEO_SEGMENTS.map((seg, i) => (
                            <button
                                key={seg.label}
                                type="button"
                                onClick={() => jumpTo(i)}
                                title={`Jump to ${seg.label}`}
                                className={`h-11 rounded-lg border overflow-hidden transition-all cursor-pointer relative ${
                                    i === active
                                        ? 'border-cyan-400 opacity-100 ring-2 ring-cyan-400/50 scale-[1.02]'
                                        : 'border-white/10 opacity-60 hover:opacity-100'
                                }`}
                                style={{
                                    flex: `${seg.dur} 1 0%`,
                                    backgroundImage: `url(${SHOWCASE_MEDIA}${seg.thumb})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundColor: '#1e293b',
                                }}
                            >
                                <span className="absolute bottom-0.5 left-1 text-[8px] font-bold text-white bg-black/60 px-1 rounded truncate max-w-full">
                                    {seg.label}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Audio Waveform Track */}
                <div className="h-6 flex items-center justify-between gap-[2px] px-1 bg-black/30 rounded border border-white/5 opacity-80">
                    {[30,55,80,45,70,95,40,60,85,35,65,90,50,75,25,80,45,70,55,85,30,60,90,40,75,50,65,35,80,55,70,25,90,45,60,85,30,75,50,95,40,65,80,35,55,70,45,85,60,30,75,90,50,40,65,35,80,55,70,25,85,45,60,90,30,75,50].map((h, i) => (
                        <div key={i} className="w-1 bg-cyan-500/60 rounded-full" style={{ height: `${h}%` }} />
                    ))}
                </div>
            </div>
        </div>
    )
}

/* =========================================================================
   4. PolyVault 3D Interactive Preview
   ========================================================================= */
function PolyVaultInteractivePreview() {
    return (
        <div className="relative w-full h-[430px] sm:h-[470px] flex items-center justify-center select-none">
            {/* Background glow orbs */}
            <div className="absolute top-1/4 right-6 w-56 h-56 bg-amber-600/15 rounded-full blur-[70px] pointer-events-none" />
            <div className="absolute bottom-10 left-6 w-48 h-48 bg-emerald-600/10 rounded-full blur-[60px] pointer-events-none" />

            {/* Main Catalog Viewport Window */}
            <div className="absolute top-2 right-2 sm:right-4 w-[78%] sm:w-[74%] h-[78%] sm:h-[80%] rounded-2xl border border-amber-500/30 shadow-[0_0_35px_rgba(245,158,11,0.2)] overflow-hidden z-10 bg-[#0e0f14] flex flex-col">
                {/* Window Chrome */}
                <div className="flex items-center justify-between px-3 py-2 border-b border-white/10 bg-black/50 shrink-0">
                    <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-red-500/80" />
                        <span className="w-2 h-2 rounded-full bg-yellow-500/80" />
                        <span className="w-2 h-2 rounded-full bg-green-500/80" />
                        <span className="ml-2 text-[9px] text-slate-400 font-mono">polyvault.celoris.app</span>
                    </div>
                    <span className="text-[9px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        360° ORBIT VIEWPORT
                    </span>
                </div>

                {/* 360 Turntable Video */}
                <div className="relative flex-1 bg-[#050608] overflow-hidden group">
                    <LazyLoopVideo
                        src={`${SHOWCASE_MEDIA}character-turntable.mp4`}
                        poster={`${SHOWCASE_MEDIA}character-turntable.jpg`}
                        className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

                    {/* Top Badges */}
                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                        <span className="text-[8px] font-mono font-bold px-1.5 py-0.5 rounded bg-black/70 text-amber-300 border border-amber-500/30 backdrop-blur-md uppercase tracking-wider">
                            Quad Topology
                        </span>
                        <span className="text-[8px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 backdrop-blur-md">
                            PBR Materials
                        </span>
                    </div>

                    {/* Bottom Title */}
                    <div className="absolute bottom-2.5 left-3 right-3 text-right">
                        <div className="text-xs font-bold text-white drop-shadow">Cyber Mech Rig</div>
                        <div className="text-[9px] text-slate-300/80">360° Real-time Orbit Inspection</div>
                    </div>
                </div>
            </div>

            {/* Floating Toolbar Strip (Left) */}
            <div className="absolute top-6 left-2 sm:left-4 w-12 sm:w-14 py-3 bg-[#111218]/95 backdrop-blur-xl rounded-2xl border border-amber-500/30 shadow-xl flex flex-col items-center gap-3.5 z-20">
                <Box className="w-4 h-4 text-amber-400" />
                <Layers className="w-4 h-4 text-slate-400 hover:text-amber-300 transition-colors" />
                <UploadCloud className="w-4 h-4 text-slate-400 hover:text-amber-300 transition-colors" />
            </div>

            {/* Floating Top Rated Panel (Bottom-Left) */}
            <div className="absolute bottom-16 left-2 sm:left-4 w-44 sm:w-48 bg-[#0b0c10]/95 backdrop-blur-xl rounded-2xl border border-amber-500/30 p-2.5 shadow-[0_10px_30px_rgba(0,0,0,0.6)] z-20">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-300 uppercase tracking-widest mb-2 font-mono">
                    <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                    Featured Assets
                </div>
                <div className="flex flex-col gap-1.5">
                    {[
                        { name: 'GT3 Hypercar', rating: 'FBX', img: '/3d/sports-car.jpeg' },
                        { name: 'Cyber Modular', rating: 'GLB', img: '/3d/modular-building.jpeg' },
                    ].map((item) => (
                        <div key={item.name} className="flex items-center gap-2 px-2 py-1 rounded-lg bg-white/5 border border-white/5">
                            <img src={item.img} alt={item.name} className="w-4 h-4 rounded object-cover border border-amber-500/30 shrink-0" />
                            <span className="text-[10px] text-slate-300 flex-1 truncate">{item.name}</span>
                            <span className="text-[9px] text-amber-400 font-mono font-bold">{item.rating}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Download Strip */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[92%] sm:w-[90%] bg-[#0a0a0a]/90 backdrop-blur-md rounded-2xl border border-amber-500/20 shadow-2xl p-2.5 flex items-center gap-2.5 z-30">
                <div className="w-8 h-8 rounded-lg overflow-hidden border border-amber-500/30 shrink-0 relative bg-black">
                    <img src="/3d/sports-car.jpeg" alt="GT3 Aero Hypercar" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <Download className="w-3.5 h-3.5 text-amber-400" />
                    </div>
                </div>
                <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-bold text-white truncate flex items-center justify-between">
                        <span>GT3 Aero Hypercar (FBX)</span>
                        <span className="text-amber-400 text-[9px] font-mono">100% READY</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden mt-1">
                        <div className="h-full w-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full" />
                    </div>
                </div>
            </div>
        </div>
    )
}

/* =========================================================================
   Main TrainerCreativeShowcase Component
   ========================================================================= */
export function TrainerCreativeShowcase() {
    const [activeTab, setActiveTab] = useState(0)
    const studio = STUDIOS[activeTab]
    const IconComponent = studio.icon

    return (
        <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-white/5 relative">
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto mb-14">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-purple-500/15 text-purple-400 border border-purple-500/30 mb-3">
                    Built For Modern Creative Educators
                </span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
                    Supercharge Your Teaching with{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400">
                        Celoris AI Studios
                    </span>
                </h2>
                <p className="text-slate-400 text-sm sm:text-base mt-3">
                    Other platforms give you a text profile. Celoris gives you creative studios to make your class material. Editing tools are free; AI generations are pay-per-use with credits.
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
                            className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
                                isActive
                                    ? 'bg-white/[0.12] text-white border border-white/[0.25] shadow-xl backdrop-blur-xl scale-105'
                                    : 'bg-white/[0.04] text-neutral-400 hover:text-white border border-white/[0.08] hover:border-white/[0.15]'
                            }`}
                        >
                            <ItemIcon className={`w-4 h-4 ${isActive ? item.color : 'text-neutral-400'}`} />
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
                    className={`rounded-3xl p-6 sm:p-10 border border-white/[0.12] bg-[#08090d]/85 backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.85)] relative overflow-hidden`}
                >
                    <div className="grid lg:grid-cols-12 gap-8 items-center">
                        {/* Info Column (6 Cols) */}
                        <div className="lg:col-span-6 space-y-5 text-left">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono uppercase tracking-wider text-slate-300">
                                <IconComponent className={`w-3.5 h-3.5 ${studio.color}`} />
                                {studio.category}
                            </div>

                            <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white leading-tight">
                                {studio.tagline}
                            </h3>

                            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed font-normal">
                                {studio.description}
                            </p>

                            {/* Features List */}
                            <ul className="space-y-2.5 pt-2">
                                {studio.features.map((feat, fIdx) => (
                                    <li key={fIdx} className="flex items-center gap-2.5 text-xs sm:text-sm text-neutral-200">
                                        <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                                            <Check className={`w-3 h-3 ${studio.color}`} />
                                        </div>
                                        <span>{feat}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="pt-4 flex flex-wrap items-center gap-4">
                                <Link
                                    href={studio.link}
                                    target="_blank"
                                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/[0.08] hover:bg-white/[0.14] border border-white/[0.18] hover:border-white/[0.3] text-white font-medium text-xs sm:text-sm backdrop-blur-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_4px_20px_rgba(0,0,0,0.5)] cursor-pointer"
                                >
                                    <span>Test {studio.name} Live</span>
                                    <ExternalLink size={14} className="text-neutral-400" />
                                </Link>
                                <span className="text-xs text-neutral-400 font-mono">
                                    {studio.id === 'motion-swap' ? 'Pay-per-use with credits' : 'Free editing tools · AI features use credits'}
                                </span>
                            </div>
                        </div>

                        {/* Interactive Studio Preview Column (6 Cols) */}
                        <div className="lg:col-span-6 w-full">
                            {studio.id === 'motion-swap' && <MotionSwapInteractivePreview />}
                            {studio.id === 'photolite' && <PhotoLiteInteractivePreview />}
                            {studio.id === 'video-studio' && <VideoStudioInteractivePreview />}
                            {studio.id === 'polyvault' && <PolyVaultInteractivePreview />}
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </section>
    )
}
