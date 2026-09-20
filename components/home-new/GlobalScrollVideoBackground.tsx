"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { motion, useScroll, useReducedMotion } from "framer-motion";

const TOTAL_FRAMES = 240;
const KEYFRAME_INTERVAL = 6; // Preload every 6th frame first (~2.3 MB) for instant scrubbing readiness

// 720p optimized frame path generator
const getFramePath = (index: number) => {
    const padded = String(index + 1).padStart(4, "0");
    return `/animation-frames/optimized/frame-${padded}.jpg`;
};

export function GlobalScrollVideoBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const reduceMotion = useReducedMotion();

    // Cache arrays
    const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));
    const loadedRef = useRef<boolean[]>(new Array(TOTAL_FRAMES).fill(false));
    const currentFrameIndexRef = useRef<number>(0);
    const animationFrameIdRef = useRef<number | null>(null);

    const [initialReady, setInitialReady] = useState(false);

    // Track the scroll of the entire document window
    const { scrollYProgress } = useScroll();

    // Helper: Find closest loaded frame if the exact frame is still streaming in
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

    // Draw the frame onto the full-bleed canvas with object-cover scaling
    const renderFrame = useCallback((frameIndex: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d", { alpha: false });
        if (!ctx) return;

        const bestIndex = getNearestLoadedIndex(frameIndex);
        const img = imagesRef.current[bestIndex];
        if (!img || !img.complete || img.naturalWidth === 0) return;

        const dpr = Math.min(typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1, 2);
        const displayW = window.innerWidth;
        const displayH = window.innerHeight;

        if (canvas.width !== displayW * dpr || canvas.height !== displayH * dpr) {
            canvas.width = displayW * dpr;
            canvas.height = displayH * dpr;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        const imgW = img.naturalWidth;
        const imgH = img.naturalHeight;

        // object-cover math with dynamic focal alignment:
        // Frame 0 model is at ~68% X; as zoom deepens, iris centers to 50% X.
        const progress = frameIndex / (TOTAL_FRAMES - 1);
        const focalX = 0.68 - progress * 0.18;
        const scale = Math.max(canvas.width / imgW, canvas.height / imgH);
        const renderW = imgW * scale;
        const renderH = imgH * scale;
        const offsetX = (canvas.width - renderW) * focalX;
        const offsetY = (canvas.height - renderH) / 2;

        ctx.drawImage(img, offsetX, offsetY, renderW, renderH);
    }, [getNearestLoadedIndex]);

    // Progressive Tiered Preloading Pipeline
    useEffect(() => {
        let isCancelled = false;

        // Step 1: Immediately fetch Frame 0 to eliminate initial layout flash
        const firstImg = new Image();
        firstImg.src = getFramePath(0);
        firstImg.onload = () => {
            if (isCancelled) return;
            imagesRef.current[0] = firstImg;
            loadedRef.current[0] = true;
            setInitialReady(true);
            renderFrame(0);
        };

        // Step 2: Fetch Keyframes in parallel (Tier 1 = ~2.3 MB)
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
            };
        });

        // Step 3: Stream the remaining intermediate frames via idle slices
        const loadRemainingFrames = () => {
            let nextIndex = 1;
            const loadBatch = () => {
                if (isCancelled) return;
                let count = 0;
                while (nextIndex < TOTAL_FRAMES && count < 12) {
                    if (!loadedRef.current[nextIndex]) {
                        const target = nextIndex;
                        const img = new Image();
                        img.src = getFramePath(target);
                        img.onload = () => {
                            if (isCancelled) return;
                            imagesRef.current[target] = img;
                            loadedRef.current[target] = true;
                        };
                        count++;
                    }
                    nextIndex++;
                }

                if (nextIndex < TOTAL_FRAMES) {
                    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
                        (window as any).requestIdleCallback(loadBatch, { timeout: 150 });
                    } else {
                        setTimeout(loadBatch, 35);
                    }
                }
            };

            setTimeout(loadBatch, 350);
        };

        loadRemainingFrames();

        return () => {
            isCancelled = true;
        };
    }, [renderFrame]);

    // Hook whole-page scroll to frame index
    useEffect(() => {
        if (reduceMotion) return;

        const unsubscribe = scrollYProgress.on("change", (latest) => {
            // Map 0 -> 1 across the full website scroll height to 0 -> 239 frames
            const targetIndex = Math.min(
                TOTAL_FRAMES - 1,
                Math.max(0, Math.floor(latest * (TOTAL_FRAMES - 1)))
            );

            currentFrameIndexRef.current = targetIndex;

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
    }, [scrollYProgress, renderFrame, reduceMotion]);

    // Handle viewport resize
    useEffect(() => {
        const handleResize = () => {
            renderFrame(currentFrameIndexRef.current);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [renderFrame]);

    return (
        <div
            className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden select-none bg-[#050608]"
            aria-hidden="true"
        >
            {/* Hardware-Accelerated HTML5 Canvas */}
            <canvas
                ref={canvasRef}
                className="w-full h-full block object-cover transition-opacity duration-700"
                style={{ opacity: initialReady ? 1 : 0 }}
            />

            {/* Asymmetric Gradient: Deep contrast on text side (left), luminous & crystal clear on model portrait side (right) */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#050608]/90 via-[#050608]/55 sm:via-[#050608]/25 to-black/10" />

            {/* Precision Radial Vignette: Soft aura centered over the Model's Face & Eye (70% X, 38% Y) */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_38%,rgba(0,0,0,0.02)_0%,rgba(5,6,8,0.35)_55%,rgba(5,6,8,0.92)_100%)]" />

            {/* Vertical Smooth Blends: Seamless Top Header & Bottom Footer Integration */}
            <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-[#050608] via-[#050608]/80 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#050608] via-[#050608]/80 to-transparent" />
        </div>
    );
}
