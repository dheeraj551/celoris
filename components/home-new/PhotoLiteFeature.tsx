"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Move,
  Crop,
  Paintbrush,
  Type,
  Layers,
  Eye,
  Sliders
} from 'lucide-react';
import Link from 'next/link';

export function PhotoLiteFeature() {
  return (
    <div className="w-full max-w-md md:max-w-xl mx-auto my-16 px-4">
      <div className="home-rgb-border" style={{ '--rgb-radius': '2.5rem' } as React.CSSProperties}>
      <div className="home-rgb-border-ring">
      <div className="relative w-full bg-[#0a0a0a] overflow-hidden shadow-[0_0_100px_rgba(6,182,212,0.1)] p-8 md:p-12" style={{ borderRadius: 'calc(2.5rem - 2px)' }}>

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
              <div className="relative flex-1">
                <img
                  src="/photoshop-ai-hero.png"
                  className="absolute inset-0 w-full h-full object-cover"
                  alt="Photo being edited in PhotoLite"
                />
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
                {['Text', 'Adjustments', 'Background'].map((name, i) => (
                  <div key={name} className="flex items-center gap-2 px-2 py-1 rounded-lg bg-white/5">
                    <div className={`w-4 h-4 rounded ${i === 0 ? 'bg-cyan-500/50' : i === 1 ? 'bg-teal-500/50' : 'bg-slate-500/50'}`} />
                    <span className="text-[10px] text-slate-300 flex-1">{name}</span>
                    <Eye className="w-2.5 h-2.5 text-slate-500" />
                  </div>
                ))}
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
              {[
                { label: 'Original', className: '' },
                { label: 'Vivid', className: 'saturate-[1.8] contrast-110' },
                { label: 'Mono', className: 'grayscale contrast-125' },
              ].map((preset, i) => (
                <div key={preset.label} className={`relative flex-1 aspect-square rounded-xl overflow-hidden cursor-pointer ${i === 1 ? 'border-2 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.5)] scale-105 z-10' : 'opacity-60 hover:opacity-100'}`}>
                  <img
                    src="/photoshop-ai-hero.png"
                    className={`w-full h-full object-cover ${preset.className}`}
                    alt={`${preset.label} filter preview`}
                  />
                </div>
              ))}
            </motion.div>

          </div>

          {/* Action Button */}
          <div className="w-full mt-auto">
            <Link href="/photolite" className="inline-flex items-center gap-3 px-8 py-3 rounded-xl border border-cyan-500/40 bg-[#0a0a0a] hover:bg-cyan-900/20 text-cyan-400 hover:text-cyan-300 font-medium text-lg transition-all group w-48">
              Learn More
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

        </div>
      </div>
      </div>
      </div>
    </div>
  );
}
