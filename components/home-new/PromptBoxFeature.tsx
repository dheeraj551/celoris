"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Copy, Check, Play, ImageIcon, Film } from 'lucide-react';
import { SpotlightCard } from '@/components/ui/spotlight-card';
import { PROMPT_ITEMS } from '@/components/prompt-box/promptData';

const SHOWCASE_IDS = [
  'seoul-tower-sci-fi-launch',
  'gothic-coquette-studio-flash-editorial',
  'kitkat-luxury-storyboard',
  'xiaomi-17-pro-forced-perspective-ad',
];

function ShowcaseVideo({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [src]);

  return (
    <video
      ref={ref}
      key={src}
      src={src}
      preload="metadata"
      loop
      muted
      playsInline
      className="w-full h-full object-cover"
    />
  );
}

export function PromptBoxFeature() {
  const showcaseItems = SHOWCASE_IDS.map((id) =>
    PROMPT_ITEMS.find((p) => p.id === id)
  ).filter(Boolean) as typeof PROMPT_ITEMS;

  const [activeIndex, setActiveIndex] = useState(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const activeItem = showcaseItems[activeIndex] || showcaseItems[0];
  if (!activeItem) return null;

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(activeItem.promptText);
      setCopiedId(activeItem.id);
      setTimeout(() => setCopiedId((c) => (c === activeItem.id ? null : c)), 2000);
    } catch {
      // Non-blocking
    }
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4">
      <SpotlightCard
        radius="2.5rem"
        beamColor="rgba(217, 255, 0, 0.75)"
        glowColor="rgba(16, 185, 129, 0.12)"
        className="shadow-[0_0_80px_rgba(16,185,129,0.08)]"
        innerClassName="bg-[#08090d]/90 backdrop-blur-3xl p-6 sm:p-10 md:p-12 border border-white/[0.1] shadow-[inset_0_1px_1px_rgba(255,255,255,0.12)] overflow-hidden"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Branding, Live Switcher & CTAs */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <img
                src="/prompt-box-logo.png"
                alt="Prompt Box"
                className="h-9 sm:h-11 w-auto object-contain"
              />
              <div className="px-3 py-1 rounded-full bg-black border border-white/15 flex items-center gap-1.5">
                <span className="text-[10px] text-neutral-400">Tested on</span>
                <img
                  src="/seedance-25-logo.png"
                  alt="Seedance 2.5"
                  className="h-3 w-auto object-contain"
                />
              </div>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight tracking-tight mb-3">
                Watch the Output.{' '}
                <span className="text-[#d9ff00]">Copy the Exact Prompt.</span>
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed max-w-lg">
                Skip trial-and-error. Browse {PROMPT_ITEMS.length} tested AI video &amp; 8K image prompts with real camera specs, lighting cues, and 1-click copy.
              </p>
            </div>

            {/* Interactive Prompt Switcher Pills */}
            <div className="space-y-2">
              <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-500">
                Preview Live Vault Drops
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {showcaseItems.map((item, idx) => {
                  const isActive = idx === activeIndex;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveIndex(idx)}
                      className={`text-left px-3.5 py-2.5 rounded-xl border text-xs font-semibold transition-all flex items-center gap-2.5 cursor-pointer ${
                        isActive
                          ? 'bg-white/10 border-[#d9ff00]/60 text-white shadow-md'
                          : 'bg-white/[0.03] border-white/10 text-neutral-400 hover:bg-white/[0.06] hover:text-white'
                      }`}
                    >
                      <span
                        className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                          isActive
                            ? 'bg-[#d9ff00] text-black'
                            : 'bg-white/5 text-neutral-400'
                        }`}
                      >
                        {item.videoUrl ? (
                          <Film className="w-3.5 h-3.5" />
                        ) : (
                          <ImageIcon className="w-3.5 h-3.5" />
                        )}
                      </span>
                      <span className="truncate">{item.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Prompt Snippet + Copy */}
            <div className="rounded-2xl bg-black/70 border border-white/10 p-3.5">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400">
                  {activeItem.category} · {activeItem.aspectRatio}
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-[#d9ff00] hover:text-black text-[10px] font-bold text-white flex items-center gap-1 transition-colors cursor-pointer"
                >
                  {copiedId === activeItem.id ? (
                    <>
                      <Check className="w-3 h-3" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      Copy Prompt
                    </>
                  )}
                </button>
              </div>
              <p className="text-[11px] font-mono text-neutral-300 line-clamp-2 leading-relaxed">
                {activeItem.promptText}
              </p>
            </div>

            {/* Primary CTA */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                href="/prompt-box"
                className="px-6 py-3 rounded-xl bg-[#d9ff00] hover:bg-[#c8eb00] text-black text-xs sm:text-sm font-black uppercase tracking-wider inline-flex items-center gap-2 transition-all hover:scale-[1.03] shadow-[0_0_25px_rgba(217,255,0,0.25)]"
              >
                Open Prompt Box ({PROMPT_ITEMS.length})
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href={`/prompt-box?id=${activeItem.id}`}
                className="px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-200 text-xs font-bold border border-white/10 transition-colors"
              >
                Inspect Active Prompt
              </Link>
            </div>
          </div>

          {/* Right Column: Fanned Interactive 9:16 Deck Showcase */}
          <div className="lg:col-span-6 flex items-center justify-center relative min-h-[380px] sm:min-h-[430px]">
            {/* Ambient Glow */}
            <div className="pointer-events-none absolute w-72 h-72 rounded-full bg-emerald-500/15 blur-[90px]" />

            <div className="relative w-[240px] sm:w-[270px] aspect-[9/16]">
              {/* Back-Left Tilted Card */}
              {showcaseItems.length > 1 && (
                <motion.div
                  whileHover={{ rotate: -10, x: -58 }}
                  onClick={() =>
                    setActiveIndex((activeIndex + 1) % showcaseItems.length)
                  }
                  className="hidden sm:block absolute inset-0 rounded-3xl overflow-hidden border border-white/15 bg-neutral-900 -rotate-6 -translate-x-12 translate-y-3 opacity-55 hover:opacity-85 transition-opacity cursor-pointer shadow-2xl"
                >
                  <img
                    src={
                      showcaseItems[(activeIndex + 1) % showcaseItems.length]
                        .previewImage
                    }
                    alt="Next prompt"
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              )}

              {/* Back-Right Tilted Card */}
              {showcaseItems.length > 2 && (
                <motion.div
                  whileHover={{ rotate: 10, x: 58 }}
                  onClick={() =>
                    setActiveIndex((activeIndex + 2) % showcaseItems.length)
                  }
                  className="hidden sm:block absolute inset-0 rounded-3xl overflow-hidden border border-white/15 bg-neutral-900 rotate-6 translate-x-12 translate-y-3 opacity-55 hover:opacity-85 transition-opacity cursor-pointer shadow-2xl"
                >
                  <img
                    src={
                      showcaseItems[(activeIndex + 2) % showcaseItems.length]
                        .previewImage
                    }
                    alt="More prompts"
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              )}

              {/* Active Front Hero Card */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeItem.id}
                  initial={{ opacity: 0, scale: 0.94, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: -10 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 26 }}
                  className="relative z-10 w-full h-full rounded-3xl overflow-hidden border-2 border-white/25 bg-black shadow-[0_25px_70px_rgba(0,0,0,0.85)]"
                >
                  {activeItem.videoUrl ? (
                    <ShowcaseVideo src={activeItem.videoUrl} />
                  ) : (
                    <img
                      src={activeItem.previewImage}
                      alt={activeItem.title}
                      className="w-full h-full object-cover"
                    />
                  )}

                  <div className="absolute inset-x-0 bottom-0 p-4 pt-16 bg-gradient-to-t from-black/95 via-black/50 to-transparent flex items-end justify-between gap-2">
                    <div className="min-w-0">
                      <span className="inline-block px-2 py-0.5 rounded-full bg-[#d9ff00] text-black text-[9px] font-black uppercase tracking-wider mb-1.5">
                        {activeItem.category}
                      </span>
                      <p className="text-xs font-bold text-white line-clamp-2 leading-snug">
                        {activeItem.title}
                      </p>
                    </div>
                    <Link
                      href={`/prompt-box?id=${activeItem.id}`}
                      aria-label="Open prompt"
                      className="w-8 h-8 rounded-full bg-white/20 hover:bg-[#d9ff00] hover:text-black backdrop-blur-md flex items-center justify-center text-white shrink-0 transition-colors"
                    >
                      {activeItem.videoUrl ? (
                        <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                      ) : (
                        <ImageIcon className="w-3.5 h-3.5" />
                      )}
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </SpotlightCard>
    </div>
  );
}
