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
  {
    title: 'Titan Vanguard Mech',
    format: 'GLTF',
    image: '/3d/mech-model.jpeg',
    tag: 'Rigged',
    rotate: '-rotate-1',
  },
  {
    title: 'GT3 Aero Hypercar',
    format: 'FBX',
    image: '/3d/sports-car.jpeg',
    tag: '4K PBR',
    rotate: 'rotate-1',
  },
  {
    title: 'Toon Character Rig',
    format: 'BLEND',
    image: '/3d/character-cat.jpeg',
    tag: 'Animated',
    rotate: 'rotate-1',
  },
  {
    title: 'Modular Brick Building',
    format: 'OBJ',
    image: '/3d/modular-building.jpeg',
    tag: 'Game Ready',
    rotate: '-rotate-1',
  },
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
              <div className="relative flex-1 p-2.5 grid grid-cols-2 gap-2 bg-[#0c0c0e]">
                {TILES.map((tile, i) => (
                  <div
                    key={i}
                    className={`relative aspect-square rounded-xl bg-[#141416] border border-white/10 ${tile.rotate} shadow-lg overflow-hidden group/tile flex flex-col justify-between`}
                  >
                    <img
                      src={tile.image}
                      alt={tile.title}
                      className="absolute inset-0 w-full h-full object-cover object-center group-hover/tile:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10" />

                    {/* Top badge */}
                    <div className="relative z-10 p-1.5 flex items-center justify-between">
                      <span className="text-[7px] font-mono font-bold px-1.5 py-0.5 rounded bg-black/60 text-emerald-300 border border-emerald-500/30 backdrop-blur-md uppercase tracking-wider">
                        {tile.format}
                      </span>
                      <span className="text-[6px] font-bold px-1 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-400/20">
                        {tile.tag}
                      </span>
                    </div>

                    {/* Bottom title */}
                    <div className="relative z-10 p-1.5">
                      <div className="text-[8px] font-bold text-white truncate drop-shadow-sm">
                        {tile.title}
                      </div>
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
                {[
                  { name: 'Titan Mech', rating: '4.95', img: '/3d/mech-model.jpeg' },
                  { name: 'GT3 Hypercar', rating: '4.98', img: '/3d/sports-car.jpeg' },
                ].map((item) => (
                  <div key={item.name} className="flex items-center gap-2 px-2 py-1 rounded-lg bg-white/5 border border-white/5">
                    <img src={item.img} alt={item.name} className="w-4 h-4 rounded object-cover border border-emerald-500/30 shrink-0" />
                    <span className="text-[10px] text-slate-300 flex-1 truncate">{item.name}</span>
                    <span className="text-[9px] text-emerald-400 font-mono">{item.rating}</span>
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
              <div className="w-8 h-8 rounded-lg overflow-hidden border border-emerald-500/30 shrink-0 relative bg-black">
                <img src="/3d/mech-model.jpeg" alt="Titan Vanguard Mech" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-bold text-white truncate">Titan Vanguard Mech (GLTF)</div>
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
