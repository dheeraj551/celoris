"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Box,
  Layers,
  Sparkles,
  Download,
  Star,
  Zap,
  UploadCloud,
} from 'lucide-react';
import Link from 'next/link';
import { SpotlightCard } from '@/components/ui/spotlight-card';

const TILES = [
  { icon: Box, from: 'from-emerald-500', to: 'to-teal-500', rotate: '-rotate-3' },
  { icon: Sparkles, from: 'from-teal-500', to: 'to-cyan-500', rotate: 'rotate-2' },
  { icon: Layers, from: 'from-cyan-500', to: 'to-emerald-500', rotate: 'rotate-1' },
  { icon: Box, from: 'from-emerald-600', to: 'to-emerald-400', rotate: '-rotate-2' },
];

export function PolyVaultFeature() {
  return (
    <div className="w-full max-w-md md:max-w-xl mx-auto my-16 px-4">
      <SpotlightCard
        radius="2.5rem"
        beamColor="rgba(16, 185, 129, 0.85)"
        glowColor="rgba(16, 185, 129, 0.12)"
        className="shadow-[0_0_80px_rgba(16,185,129,0.12)]"
        innerClassName="bg-[#08090d]/85 backdrop-blur-3xl p-8 md:p-12 border border-white/[0.1] shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]"
      >

        {/* Background Dot Grid */}
        <div className="absolute top-1/4 right-0 w-64 h-64 bg-[radial-gradient(circle,rgba(16,185,129,0.15)_2px,transparent_2px)] [background-size:24px_24px] opacity-60" />
        <div className="absolute bottom-1/4 left-0 w-48 h-48 bg-[radial-gradient(circle,rgba(16,185,129,0.15)_2px,transparent_2px)] [background-size:24px_24px] opacity-60" />

        {/* Glowing Orbs */}
        <div className="absolute top-10 right-10 w-64 h-64 bg-emerald-600/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-20 left-10 w-64 h-64 bg-teal-600/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10 flex flex-col items-start h-full">
          {/* Header Section */}
          <div className="mb-10 w-full">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 mb-6">
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest">
                3D MARKETPLACE
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4 tracking-tight">
              PolyVault
              <br />
              <span className="text-emerald-400">
                Buy &amp; Sell 3D Assets
              </span>
            </h2>

            <p className="text-lg text-slate-300 font-light leading-relaxed max-w-sm">
              Browse game-ready 3D models in a live WebGL viewport, or publish your own creations to the community — game & VFX-ready formats, PBR textures, fast downloads.
            </p>
          </div>

          {/* Interactive UI Mockup */}
          <div className="relative w-full aspect-[4/5] md:aspect-square mb-12 flex items-center justify-center mt-10">

            {/* Main Catalog Window */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="absolute top-0 right-2 md:right-6 w-[70%] md:w-[65%] h-[82%] rounded-2xl border border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.2)] overflow-hidden z-10 bg-[#161616] flex flex-col"
            >
              {/* Window chrome with traffic lights */}
              <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/5 bg-black/40 shrink-0">
                <span className="w-2 h-2 rounded-full bg-red-500/80" />
                <span className="w-2 h-2 rounded-full bg-yellow-500/80" />
                <span className="w-2 h-2 rounded-full bg-green-500/80" />
                <span className="ml-2 text-[9px] text-slate-500 font-mono">polyvault.celoris.app</span>
              </div>
              {/* Model card grid */}
              <div className="relative flex-1 p-3 grid grid-cols-2 gap-2.5 bg-[#101010]">
                {TILES.map(({ icon: Icon, from, to, rotate }, i) => (
                  <div
                    key={i}
                    className={`relative aspect-square rounded-xl bg-gradient-to-br ${from} ${to} ${rotate} flex items-center justify-center shadow-lg overflow-hidden`}
                  >
                    <Icon className="w-7 h-7 text-white/90" strokeWidth={1.5} />
                    <div className="absolute bottom-1 left-1.5 text-[7px] font-mono font-bold text-white/70 uppercase tracking-wider">
                      GLTF
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Floating Toolbar Strip */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="absolute top-10 left-4 md:left-6 w-14 py-3 bg-[#161616] rounded-2xl border border-emerald-500/30 shadow-xl flex flex-col items-center gap-3 z-20"
            >
              <Box className="w-4 h-4 text-emerald-300" />
              <Layers className="w-4 h-4 text-slate-400" />
              <Sparkles className="w-4 h-4 text-slate-400" />
              <UploadCloud className="w-4 h-4 text-slate-400" />
            </motion.div>

            {/* Floating Rating / Sales Panel */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="absolute bottom-[26%] left-0 md:-left-4 w-40 bg-[#0d0d0d]/90 backdrop-blur-xl rounded-2xl border border-emerald-500/30 p-3 shadow-[0_10px_30px_rgba(0,0,0,0.5)] z-20"
            >
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-300 uppercase tracking-widest mb-2">
                <Star className="w-3 h-3 fill-emerald-300" />
                Top Rated
              </div>
              <div className="flex flex-col gap-1.5">
                {['Sci-Fi Drone', 'Samurai Helmet'].map((name) => (
                  <div key={name} className="flex items-center gap-2 px-2 py-1 rounded-lg bg-white/5">
                    <div className="w-4 h-4 rounded bg-emerald-500/50 shrink-0" />
                    <span className="text-[10px] text-slate-300 flex-1 truncate">{name}</span>
                    <span className="text-[9px] text-emerald-400 font-mono">4.9</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Bottom Download Strip */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[88%] md:w-[105%] bg-[#0a0a0a]/80 backdrop-blur-md rounded-2xl border border-white/5 shadow-2xl p-3 flex items-center gap-3 z-30"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <Download className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-bold text-white truncate">Combat Drone Mk.IV</div>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden mt-1">
                  <div className="h-full w-3/4 bg-emerald-500 rounded-full" />
                </div>
              </div>
              <div className="flex items-center gap-1 text-[9px] font-mono text-emerald-400 font-bold shrink-0">
                <Zap className="w-3 h-3" />
                120 MB/s
              </div>
            </motion.div>

          </div>

          {/* Action Button */}
          <div className="w-full mt-auto">
            <Link 
              href="/polyvault" 
              className="group relative inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full border border-emerald-400/40 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-200 hover:text-white font-medium text-sm transition-all duration-300 shadow-[0_0_25px_rgba(16,185,129,0.25)] hover:shadow-[0_0_35px_rgba(16,185,129,0.4)] hover:scale-[1.02] active:scale-[0.98] backdrop-blur-xl"
            >
              <span>Explore PolyVault</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

        </div>
      </SpotlightCard>
    </div>
  );
}
