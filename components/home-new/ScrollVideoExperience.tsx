"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Sparkles, ChevronDown, Eye, FastForward, CheckCircle2 } from "lucide-react";

const TOTAL_FRAMES = 240;
const KEYFRAME_INTERVAL = 6; // Load every 6th frame first (40 keyframes = ~2.3 MB for instant scrubbing)

// Path generator for the 240 optimized 720p JPEGs
const getFramePath = (index: number) => {
    const padded = String(index + 1).padStart(4, "0");
    return `/animation-frames/optimized/frame-${padded}.jpg`;
};

// Narrative chapters synced with scroll progress
interface NarrativeChapter {
    id: number;
    start: number;
    end: number;
    tag: string;
    title: string;
    description: string;
    accentColor: string;
    glowRgba: string;
}

const CHAPTERS: NarrativeChapter[] = [
    {
        id: 1,
        start: 0.04,
        end: 0.24,
        tag: "VISION • 01",
        title: "Where Every Vision Begins",
        description: "Every creative revolution starts with a spark of human imagination.",
        accentColor: "text-emerald-400",
        glowRgba: "rgba(52, 211, 153, 0.4)",
    },
    {
        id: 2,
        start: 0.28,
        end: 0.50,
        tag: "PRECISION • 02",
        title: "Looking Closer at Every Pixel",
        description: "High-fidelity AI models tailored for cinematic 4K video, photo retouching, and 3D assets.",
        accentColor: "text-cyan-400",
        glowRgba: "rgba(56, 189, 248, 0.4)",
    },
    {
        id: 3,
        start: 0.54,
        end: 0.76,
        tag: "COMMUNITY • 03",
        title: "The Creative Core of India",
        description: "50,000+ creators building, learning, and earning together without subscription paywalls.",
        accentColor: "text-purple-400",
        glowRgba: "rgba(192, 132, 252, 0.4)",
    },
    {
        id: 4,
        start: 0.80,
        end: 0.96,
        tag: "STUDIOS • 04",
        title: "Infinite Creation Awaits",
        description: "Step inside the studio suite. 100% free daily credits. No credit card ever required.",
        accentColor: "text-amber-400",
        glowRgba: "rgba(251, 191, 36, 0.4)",
    },
];

export function ScrollVideoExperience() {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Image cache in memory
    const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));
    const loadedRef = useRef<boolean[]>(new Array(TOTAL_FRAMES).fill(false));
    const currentFrameIndexRef = useRef<number>(0);
    const animationFrameIdRef = useRef<number | null>(null);

    const [loadedCount, setLoadedCount] = useState(0);
    const [initialLoaded, setInitialLoaded] = useState(false);
    const [currentFrameDisplay, setCurrentFrameDisplay] = useState(1);
    const [scrollPercentage, setScrollPercentage] = useState(0);
    const [activeChapter, setActiveChapter] = useState<NarrativeChapter | null>(null);

    // Scroll progress tracker across the sticky container
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    // Helper: Find the nearest loaded frame index to guarantee zero black flashes
    const getNearestLoadedIndex = useCallback((targetIndex: number): number => {
        if (loadedRef.current[targetIndex]) return targetIndex;

        for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
            const forward = targetIndex + offset;
            if (forward < TOTAL_FRAMES && loadedRef.current[forward]) return forward;
            const backward = targetIndex - offset;
            if (backward >= 0 && loadedRef.current[backward]) return backward;
        }
        return 0;
    }, []);

    // Render a specific frame to the canvas with DPR and cover scaling
    const renderFrame = useCallback((frameIndex: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d", { alpha: false });
        if (!ctx) return;

        const bestIndex = getNearestLoadedIndex(frameIndex);
        const img = imagesRef.current[bestIndex];
        if (!img || !img.complete || img.naturalWidth === 0) return;

        const dpr = Math.min(typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1, 2);
        const displayWidth = canvas.clientWidth;
        const displayHeight = canvas.clientHeight;

        if (canvas.width !== displayWidth * dpr || canvas.height !== displayHeight * dpr) {
            canvas.width = displayWidth * dpr;
            canvas.height = displayHeight * dpr;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        const imgW = img.naturalWidth;
        const imgH = img.naturalHeight;

        // Calculate object-cover aspect ratio fitting
        const scale = Math.max(canvas.width / imgW, canvas.height / imgH);
        const renderW = imgW * scale;
        const renderH = imgH * scale;
        const offsetX = (canvas.width - renderW) / 2;
        const offsetY = (canvas.height - renderH) / 2;

        ctx.drawImage(img, offsetX, offsetY, renderW, renderH);
    }, [getNearestLoadedIndex]);

    // Progressive Tiered Preloader:
    // Tier 1: Frame 0 immediate -> Keyframes (every 6th frame) -> Tier 2: Remaining frames
    useEffect(() => {
        let isCancelled = false;

        // Step 1: Preload Frame 0 immediately
        const firstImg = new Image();
        firstImg.src = getFramePath(0);
        firstImg.onload = () => {
            if (isCancelled) return;
            imagesRef.current[0] = firstImg;
            loadedRef.current[0] = true;
            setLoadedCount(prev => prev + 1);
            setInitialLoaded(true);
            renderFrame(0);
        };

        // Step 2: Load Keyframes in parallel (Tier 1 = ~2.3 MB)
        const keyframeIndices: number[] = [];
        for (let i = KEYFRAME_INTERVAL; i < TOTAL_FRAMES; i += KEYFRAME_INTERVAL) {
            keyframeIndices.push(i);
        }

        keyframeIndices.forEach((idx) => {
            const img = new Image();
            img.src = getFramePath(idx);
            img.onload = () => {
                if (isCancelled) return;
                imagesRef.current[idx] = img;
                loadedRef.current[idx] = true;
                setLoadedCount(prev => prev + 1);
            };
        });

        // Step 3: Stream the remaining intermediate frames progressively
        const loadRemainingFrames = () => {
            let nextIndex = 1;
            const loadBatch = () => {
                if (isCancelled) return;
                let scheduled = 0;
                while (nextIndex < TOTAL_FRAMES && scheduled < 12) {
                    if (!loadedRef.current[nextIndex]) {
                        const target = nextIndex;
                        const img = new Image();
                        img.src = getFramePath(target);
                        img.onload = () => {
                            if (isCancelled) return;
                            imagesRef.current[target] = img;
                            loadedRef.current[target] = true;
                            setLoadedCount(prev => prev + 1);
                        };
                        scheduled++;
                    }
                    nextIndex++;
                }

                if (nextIndex < TOTAL_FRAMES) {
                    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
                        (window as any).requestIdleCallback(loadBatch, { timeout: 150 });
                    } else {
                        setTimeout(loadBatch, 30);
                    }
                }
            };

            setTimeout(loadBatch, 400);
        };

        loadRemainingFrames();

        return () => {
            isCancelled = true;
        };
    }, [renderFrame]);

    // Handle scroll position and trigger frame renders
    useEffect(() => {
        const unsubscribe = scrollYProgress.on("change", (latest) => {
            const targetIndex = Math.min(
                TOTAL_FRAMES - 1,
                Math.max(0, Math.floor(latest * (TOTAL_FRAMES - 1)))
            );

            currentFrameIndexRef.current = targetIndex;
            setCurrentFrameDisplay(targetIndex + 1);
            setScrollPercentage(Math.round(latest * 100));

            // Sync active narrative chapter
            const active = CHAPTERS.find(c => latest >= c.start && latest <= c.end) || null;
            setActiveChapter(active);

            if (animationFrameIdRef.current) {
                cancelAnimationFrame(animationFrameIdRef.current);
            }
            animationFrameIdRef.current = requestAnimationFrame(() => {
                renderFrame(targetIndex);
            });
        });

        return () => {
            unsubscribe();
            if (animationFrameIdRef.current) {
                cancelAnimationFrame(animationFrameIdRef.current);
            }
        };
    }, [scrollYProgress, renderFrame]);

    // Handle resize
    useEffect(() => {
        const handleResize = () => {
            renderFrame(currentFrameIndexRef.current);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [renderFrame]);

    // Smooth skip button to scroll past the animation container
    const handleSkip = () => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const targetScrollY = window.scrollY + rect.bottom - window.innerHeight + 100;
        window.scrollTo({ top: targetScrollY, behavior: "smooth" });
    };

    return (
        <section
            ref={containerRef}
            className="relative w-full h-[320vh] bg-[#050608] select-none"
            aria-label="Celoris Creative Vision Infinite Zoom Experience"
        >
            {/* Sticky Viewport Container */}
            <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden bg-[#050608]">

                {/* HTML5 High-Performance Canvas */}
                <canvas
                    ref={canvasRef}
                    className="w-full h-full object-cover transition-opacity duration-500"
                    style={{ opacity: initialLoaded ? 1 : 0.4 }}
                />

                {/* Ambient Cinematic Vignette & Edge Blending into Website Dark Canvas */}
                <div
                    className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(5,6,8,0.7)_80%,rgba(5,6,8,1)_100%)]"
                    aria-hidden="true"
                />
                <div
                    className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#050608] via-[#050608]/70 to-transparent"
                    aria-hidden="true"
                />
                <div
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#050608] via-[#050608]/70 to-transparent"
                    aria-hidden="true"
                />

                {/* Top Control Bar: Brand Capsule & Skip Action */}
                <div className="absolute top-6 left-0 right-0 px-4 sm:px-8 z-30 flex items-center justify-between pointer-events-none">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-2xl border border-white/10 text-white text-xs font-medium shadow-lg pointer-events-auto">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                        <span className="font-mono text-[11px] text-neutral-300">Celoris Motion Engine</span>
                        <div className="w-px h-3 bg-white/15 mx-1" />
                        <span className="text-[10px] font-mono text-emerald-400 font-bold">
                            {loadedCount >= TOTAL_FRAMES ? "60 FPS READY" : `${Math.round((loadedCount / TOTAL_FRAMES) * 100)}% BUFFERED`}
                        </span>
                    </div>

                    <button
                        type="button"
                        onClick={handleSkip}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/60 hover:bg-white/10 backdrop-blur-2xl border border-white/10 hover:border-white/25 text-neutral-300 hover:text-white text-xs font-medium transition-all shadow-lg pointer-events-auto cursor-pointer"
                        title="Skip to Studios"
                    >
                        <span>Skip Sequence</span>
                        <FastForward className="w-3.5 h-3.5" />
                    </button>
                </div>

                {/* Narrative Stage Overlays (Centered Apple-grade Typography Cards) */}
                <div className="absolute inset-0 z-20 flex items-center justify-center p-6 pointer-events-none">
                    <AnimatePresence mode="wait">
                        {activeChapter && (
                            <motion.div
                                key={activeChapter.id}
                                initial={{ opacity: 0, y: 30, scale: 0.95, filter: "blur(8px)" }}
                                animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                                exit={{ opacity: 0, y: -25, scale: 1.03, filter: "blur(8px)" }}
                                transition={{ duration: 0.45, ease: "easeOut" }}
                                className="max-w-xl text-center p-6 sm:p-8 rounded-3xl bg-[#08090d]/80 backdrop-blur-3xl border border-white/[0.12] shadow-[0_25px_70px_rgba(0,0,0,0.9),inset_0_1px_1px_rgba(255,255,255,0.2)]"
                                style={{ boxShadow: `0 0 50px -10px ${activeChapter.glowRgba}, 0 25px 70px rgba(0,0,0,0.9)` }}
                            >
                                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.1] text-xs font-mono font-bold uppercase tracking-widest ${activeChapter.accentColor} mb-3.5`}>
                                    <Sparkles className="w-3 h-3" />
                                    <span>{activeChapter.tag}</span>
                                </div>

                                <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-3 leading-tight drop-shadow-md">
                                    {activeChapter.title}
                                </h2>

                                <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-md mx-auto">
                                    {activeChapter.description}
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Bottom HUD: Live Frame Gauge & Progress Pill */}
                <div className="absolute bottom-6 left-0 right-0 px-4 sm:px-8 z-30 flex flex-col items-center gap-2.5 pointer-events-none">

                    {/* Scroll Prompt (Visible at start) */}
                    <AnimatePresence>
                        {scrollPercentage < 6 && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: [0, -6, 0] }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ y: { duration: 1.8, repeat: Infinity, ease: "easeInOut" } }}
                                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-medium backdrop-blur-2xl shadow-lg pointer-events-auto"
                            >
                                <Eye className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Scroll down to zoom into the creative vision</span>
                                <ChevronDown className="w-3.5 h-3.5 animate-bounce" />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Scrubbing Stats Capsule */}
                    <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-2xl border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.8)] pointer-events-auto">
                        <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-neutral-300">
                            <span className="text-white">Frame</span>
                            <span className="text-emerald-400">{String(currentFrameDisplay).padStart(3, "0")}</span>
                            <span className="text-neutral-500">/ {TOTAL_FRAMES}</span>
                        </div>

                        <div className="w-px h-3 bg-white/15" />

                        {/* Progress Bar Micro-Dish */}
                        <div className="w-20 sm:w-28 h-1.5 bg-white/10 rounded-full overflow-hidden relative">
                            <div
                                className="h-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400 rounded-full transition-all duration-75"
                                style={{ width: `${scrollPercentage}%` }}
                            />
                        </div>

                        <span className="text-[11px] font-mono font-bold text-white min-w-[32px] text-right">
                            {scrollPercentage}%
                        </span>
                    </div>

                </div>

            </div>
        </section>
    );
}
