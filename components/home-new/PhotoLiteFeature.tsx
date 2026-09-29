"use client";

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Move,
  Crop,
  Paintbrush,
  Type,
  Layers,
  Eye,
  EyeOff,
  Sliders,
  ChevronsLeftRight,
} from 'lucide-react';
import Link from 'next/link';
import { SpotlightCard } from '@/components/ui/spotlight-card';
import { SHOWCASE_MEDIA } from './ShowcaseMedia';

// Before / after pairs (3:4, served from Cloudflare R2). Each "before" is the
// original photo placed where it sits inside the finished edit; the empty
// checkerboard around it is the canvas the edit expanded into.
const PAIRS = [
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
];

const SWEEP_MS = 5200; // one full left→right→left sweep
const SWEEPS_PER_PAIR = 2;

/**
 * Drag the handle to compare; left of it is the original, right is the edit.
 * When nobody is touching it, the handle sweeps by itself (only while the card
 * is on screen) and every couple of sweeps it moves on to the next pair.
 */
function BeforeAfter({
  pairIndex,
  onPairChange,
  onPosition,
}: {
  pairIndex: number;
  onPairChange: (i: number) => void;
  onPosition: (p: number) => void;
}) {
  const boxRef = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState(50); // % of width showing "before"
  const posRef = useRef(50);
  const dragging = useRef(false);
  const idleUntil = useRef(0);
  const visible = useRef(false);
  const pairRef = useRef(pairIndex);
  pairRef.current = pairIndex;

  const set = useCallback(
    (p: number) => {
      const v = Math.max(0, Math.min(100, p));
      posRef.current = v;
      setPos(v);
      onPosition(v);
    },
    [onPosition]
  );

  // Auto-sweep while on screen and idle.
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const reduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
    const io = new IntersectionObserver((e) => (visible.current = e.some((x) => x.isIntersecting)), { threshold: 0.2 });
    io.observe(el);
    let raf = 0;
    let t0 = performance.now();
    let sweeps = 0;
    const tick = (now: number) => {
      if (visible.current && !dragging.current && now > idleUntil.current) {
        const phase = ((now - t0) % SWEEP_MS) / SWEEP_MS;
        const done = Math.floor((now - t0) / SWEEP_MS);
        if (done > sweeps) {
          sweeps = done;
          if (sweeps % SWEEPS_PER_PAIR === 0) onPairChange((pairRef.current + 1) % PAIRS.length);
        }
        // ease between 12% and 88%
        set(50 - 38 * Math.cos(phase * Math.PI * 2));
      } else {
        // Resume the sweep from wherever the handle was left.
        t0 = now - (Math.acos(Math.max(-1, Math.min(1, (50 - posRef.current) / 38))) / (Math.PI * 2)) * SWEEP_MS;
        sweeps = 0;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fromEvent = (e: React.PointerEvent) => {
    const r = boxRef.current?.getBoundingClientRect();
    if (!r) return;
    set(((e.clientX - r.left) / r.width) * 100);
  };

  const pair = PAIRS[pairIndex];
  return (
    <div
      ref={boxRef}
      className="absolute inset-0 select-none cursor-ew-resize"
      style={{ touchAction: 'pan-y' }}
      onPointerDown={(e) => {
        dragging.current = true;
        (e.currentTarget as HTMLDivElement).setPointerCapture?.(e.pointerId);
        fromEvent(e);
      }}
      onPointerMove={(e) => dragging.current && fromEvent(e)}
      onPointerUp={() => {
        dragging.current = false;
        idleUntil.current = performance.now() + 3500;
      }}
      onPointerCancel={() => {
        dragging.current = false;
        idleUntil.current = performance.now() + 3500;
      }}
      role="slider"
      aria-label="Before and after comparison"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pos)}
      tabIndex={0}
      onKeyDown={(e) => {
        const keys: Record<string, number> = { ArrowLeft: pos - 5, ArrowRight: pos + 5, Home: 0, End: 100 };
        if (!(e.key in keys)) return;
        e.preventDefault(); // don't scroll the page
        set(keys[e.key]);
        idleUntil.current = performance.now() + 3500;
      }}
    >
      {PAIRS.map((p, i) => (
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
      <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[9px] font-bold uppercase tracking-wider text-slate-200 pointer-events-none">
        Before
      </span>
      <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-cyan-500/25 backdrop-blur-md border border-cyan-300/40 text-[9px] font-bold uppercase tracking-wider text-cyan-100 pointer-events-none">
        After
      </span>
      <span className="absolute bottom-2.5 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[10px] font-semibold text-white whitespace-nowrap pointer-events-none">
        {pair.label}
      </span>

      {/* Handle */}
      <div className="absolute top-0 bottom-0 pointer-events-none" style={{ left: `${pos}%` }}>
        <div className="absolute top-0 bottom-0 -translate-x-1/2 w-0.5 bg-white shadow-[0_0_12px_rgba(34,211,238,0.9)]" />
        <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-[0_0_18px_rgba(34,211,238,0.7)] border-2 border-cyan-400">
          <ChevronsLeftRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}

export function PhotoLiteFeature() {
  const [pairIndex, setPairIndex] = useState(0);
  // "After" layers are shown when the edit side is the bigger part of the view.
  const [afterDominant, setAfterDominant] = useState(true);
  const onPosition = useCallback((p: number) => setAfterDominant(p < 50), []);

  return (
    <div className="w-full max-w-md md:max-w-xl mx-auto my-16 px-4">
      <SpotlightCard
        radius="2.5rem"
        beamColor="rgba(6, 182, 212, 0.85)"
        glowColor="rgba(6, 182, 212, 0.12)"
        className="shadow-[0_0_80px_rgba(6,182,212,0.12)]"
        innerClassName="bg-[#08090d]/85 backdrop-blur-3xl p-8 md:p-12 border border-white/[0.1] shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]"
      >

        {/* Background Dot Grid */}
        <div className="absolute top-1/4 right-0 w-64 h-64 bg-[radial-gradient(circle,rgba(6,182,212,0.15)_2px,transparent_2px)] [background-size:24px_24px] opacity-60" />
        <div className="absolute bottom-1/4 left-0 w-48 h-48 bg-[radial-gradient(circle,rgba(6,182,212,0.15)_2px,transparent_2px)] [background-size:24px_24px] opacity-60" />

        {/* Glowing Orbs */}
        <div className="absolute top-10 right-10 w-64 h-64 bg-cyan-600/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-20 left-10 w-64 h-64 bg-teal-600/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10 flex flex-col items-start h-full">
          {/* Header Section */}
          <div className="mb-10 w-full">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 mb-6">
              <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-widest">
                PHOTO EDITING
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4 tracking-tight">
              PhotoLite
              <br />
              <span className="text-cyan-400">
                Edit Like a Pro
              </span>
            </h2>

            <p className="text-lg text-slate-300 font-light leading-relaxed max-w-sm">
              A full layer-based photo editor in your browser — brushes, crop, text, and filters with a premium studio interface. No downloads, no subscriptions.
            </p>
          </div>

          {/* Interactive UI Mockup */}
          <div className="relative w-full aspect-[4/5] md:aspect-square mb-12 flex items-center justify-center mt-10">

            {/* Main Editor Window */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="absolute top-0 right-4 md:right-10 w-[65%] md:w-[60%] h-[80%] rounded-2xl border border-cyan-500/40 shadow-[0_0_30px_rgba(6,182,212,0.2)] overflow-hidden z-10 bg-[#161616] flex flex-col"
            >
              {/* Window chrome with traffic lights */}
              <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/5 bg-black/40 shrink-0">
                <span className="w-2 h-2 rounded-full bg-red-500/80" />
                <span className="w-2 h-2 rounded-full bg-yellow-500/80" />
                <span className="w-2 h-2 rounded-full bg-green-500/80" />
              </div>
              <div className="relative flex-1 bg-[#0c0c0e]">
                <BeforeAfter pairIndex={pairIndex} onPairChange={setPairIndex} onPosition={onPosition} />
              </div>
            </motion.div>

            {/* Floating Toolbar Strip */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="absolute top-10 left-4 md:left-8 w-14 py-3 bg-[#161616] rounded-2xl border border-cyan-500/30 shadow-xl flex flex-col items-center gap-3 z-20"
            >
              <Move className="w-4 h-4 text-cyan-300" />
              <Crop className="w-4 h-4 text-slate-400" />
              <Paintbrush className="w-4 h-4 text-slate-400" />
              <Type className="w-4 h-4 text-slate-400" />
            </motion.div>

            {/* Floating Layers Panel */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="absolute bottom-[30%] left-0 md:-left-4 w-44 bg-[#0d0d0d]/90 backdrop-blur-xl rounded-2xl border border-cyan-500/30 p-3 shadow-[0_10px_30px_rgba(0,0,0,0.5)] z-20"
            >
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-cyan-300 uppercase tracking-widest mb-2">
                <Layers className="w-3 h-3" />
                Layers
              </div>
              <div className="flex flex-col gap-1.5">
                {[
                  { name: pairIndex === 0 ? 'Relight' : 'Retouch', color: 'bg-cyan-500/50', edit: true },
                  { name: 'Expand canvas', color: 'bg-teal-500/50', edit: true },
                  { name: 'Original photo', color: 'bg-slate-500/50', edit: false },
                ].map((layer) => {
                  const on = !layer.edit || afterDominant;
                  return (
                    <div
                      key={layer.name}
                      className={`flex items-center gap-2 px-2 py-1 rounded-lg transition-colors duration-300 ${
                        layer.edit && on ? 'bg-cyan-500/15 border border-cyan-400/30' : 'bg-white/5 border border-transparent'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded ${layer.color} ${on ? '' : 'opacity-30'}`} />
                      <span className={`text-[10px] flex-1 ${on ? 'text-slate-200' : 'text-slate-500 line-through'}`}>{layer.name}</span>
                      {on ? <Eye className="w-2.5 h-2.5 text-cyan-300" /> : <EyeOff className="w-2.5 h-2.5 text-slate-600" />}
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Bottom Adjustments / Filter Strip */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[90%] md:w-[110%] bg-[#0a0a0a]/80 backdrop-blur-md rounded-2xl border border-white/5 shadow-2xl p-3 flex items-center gap-3 overflow-hidden z-30"
            >
              <Sliders className="w-4 h-4 text-cyan-400 shrink-0" />
              {PAIRS.map((pair, i) => (
                <button
                  key={pair.label}
                  type="button"
                  onClick={() => setPairIndex(i)}
                  className={`relative flex-1 h-16 rounded-xl overflow-hidden cursor-pointer transition-all ${
                    i === pairIndex ? 'border-2 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.5)] scale-105 z-10' : 'border border-white/10 opacity-60 hover:opacity-100'
                  }`}
                  aria-label={`Show ${pair.label}`}
                >
                  <img src={pair.after} loading="lazy" className="absolute inset-0 w-full h-full object-cover object-top" alt="" />
                  <span className="absolute bottom-1 left-1.5 right-1.5 text-[9px] font-semibold text-white drop-shadow truncate text-left">{pair.label}</span>
                </button>
              ))}
            </motion.div>

          </div>

          {/* Action Button */}
          <div className="w-full mt-auto">
            <Link 
              href="/photolite" 
              className="group relative inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full border border-cyan-400/40 bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-200 hover:text-white font-medium text-sm transition-all duration-300 shadow-[0_0_25px_rgba(6,182,212,0.25)] hover:shadow-[0_0_35px_rgba(6,182,212,0.4)] hover:scale-[1.02] active:scale-[0.98] backdrop-blur-xl"
            >
              <span>Explore PhotoLite</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

        </div>
      </SpotlightCard>
    </div>
  );
}
