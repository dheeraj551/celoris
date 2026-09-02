"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight,
  Box,
  Layers,
  MousePointer2,
  Maximize,
  Rotate3D,
  Move3D
} from 'lucide-react';
import Link from 'next/link';

export function Celoris3DFeature() {
  return (
    <div className="w-full max-w-md md:max-w-xl mx-auto my-16 px-4">
      <div className="home-rgb-border" style={{ '--rgb-radius': '2.5rem' } as React.CSSProperties}>
      <div className="home-rgb-border-ring">
      <div className="relative w-full bg-[#0a0a0a] overflow-hidden shadow-[0_0_100px_rgba(37,99,235,0.1)] p-8 md:p-12" style={{ borderRadius: 'calc(2.5rem - 2px)' }}>

        {/* Background Dot Grid */}
        <div className="absolute top-1/4 right-0 w-64 h-64 bg-[radial-gradient(circle,rgba(37,99,235,0.15)_2px,transparent_2px)] [background-size:24px_24px] opacity-60" />
        <div className="absolute bottom-1/4 left-0 w-48 h-48 bg-[radial-gradient(circle,rgba(37,99,235,0.15)_2px,transparent_2px)] [background-size:24px_24px] opacity-60" />
        
        {/* Glowing Orbs */}
        <div className="absolute top-10 right-10 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-20 left-10 w-64 h-64 bg-cyan-600/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10 flex flex-col items-start h-full">
          {/* Header Section */}
          <div className="mb-10 w-full">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 mb-6">
              <span className="text-[11px] font-bold text-blue-400 uppercase tracking-widest">
                3D CREATION
              </span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4 tracking-tight">
              Celoris 3D
              <br />
              <span className="text-blue-400">
                Imagine in 3D
              </span>
            </h2>
            
            <p className="text-lg text-slate-300 font-light leading-relaxed max-w-sm">
              Design, model, and animate in stunning 3D. Bring your ideas to life with Celoris 3D.
            </p>
          </div>

          {/* Interactive UI Mockup */}
          <div className="relative w-full aspect-[4/5] md:aspect-square mb-12 flex items-center justify-center mt-10">
            
            {/* 3D Glowing Pedestal */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, rotateX: 60 }}
              whileInView={{ opacity: 1, scale: 1, rotateX: 60 }}
              transition={{ duration: 0.8 }}
              className="absolute bottom-[10%] left-[10%] w-[200px] h-[200px] rounded-full border-[4px] border-blue-500 shadow-[0_0_50px_rgba(59,130,246,0.6)] z-10"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-md" />
              <div className="absolute inset-2 rounded-full border-2 border-cyan-400/50" />
            </motion.div>

            {/* Foreground 3D Character (Mouse) */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="absolute bottom-[15%] left-[5%] w-[220px] h-[280px] z-20 flex items-end justify-center"
            >
              <img src="/images/homepage/celoris-3d-character.png" className="w-full h-auto object-contain drop-shadow-2xl" alt="3D Mouse Character" />
            </motion.div>

            {/* Background floating UI Panel (Wireframe view) */}
            <motion.div 
              initial={{ opacity: 0, x: 30, y: -20 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="absolute top-0 right-0 w-[70%] h-[75%] bg-[#0d0d0d]/80 backdrop-blur-xl rounded-2xl border border-blue-500/40 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden z-0 flex flex-col"
            >
              {/* Tool Header */}
              <div className="flex items-center gap-4 px-3 py-2 border-b border-white/10 bg-black/40">
                 <Box className="w-4 h-4 text-blue-400" />
                 <div className="flex gap-3">
                   <MousePointer2 className="w-3 h-3 text-slate-400" />
                   <Move3D className="w-3 h-3 text-slate-400" />
                   <Rotate3D className="w-3 h-3 text-slate-400" />
                   <Maximize className="w-3 h-3 text-slate-400" />
                 </div>
                 <div className="flex gap-2 ml-auto">
                   <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center">
                     <Layers className="w-3 h-3 text-white" />
                   </div>
                 </div>
              </div>
              
              {/* 3D Grid Viewport */}
              <div className="flex-1 relative bg-gradient-to-b from-[#0d0d0d] to-[#0a0a0a] flex items-center justify-center overflow-hidden">
                {/* 3D Grid Lines */}
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(59,130,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.3) 1px, transparent 1px)', backgroundSize: '20px 20px', transform: 'perspective(500px) rotateX(60deg) scale(2) translateY(-50px)' }} />
                
                {/* Wireframe Mouse Mock */}
                <div className="relative z-10 w-[60%] h-[80%] opacity-60 mix-blend-screen filter grayscale brightness-150 contrast-125 saturate-0">
                  <img src="/images/homepage/celoris-3d-character.png" className="w-full h-full object-contain" alt="Wireframe Mouse" style={{ filter: 'invert(1) hue-rotate(180deg) opacity(0.8)' }} />
                  {/* Overlay wireframe lines */}
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-30 mix-blend-overlay" />
                  
                  {/* Axis lines */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[1px] bg-red-500/50" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1px] h-full bg-green-500/50" />
                </div>
              </div>
              
              {/* Left Tool Sidebar inside Panel */}
              <div className="absolute left-0 top-[40px] bottom-0 w-8 bg-black/40 border-r border-white/5 flex flex-col items-center py-2 gap-3 z-20">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="w-5 h-5 rounded border border-white/10 flex items-center justify-center opacity-50 hover:opacity-100 cursor-pointer">
                    <div className="w-2 h-2 border border-white/80 rounded-[1px]" />
                  </div>
                ))}
              </div>
            </motion.div>

          </div>

          {/* Action Button */}
          <div className="w-full mt-auto">
            <Link href="/celoris-3d" className="inline-flex items-center gap-3 px-8 py-3 rounded-xl border border-blue-500/40 bg-[#0a0a0a] hover:bg-blue-900/20 text-blue-400 hover:text-blue-300 font-medium text-lg transition-all group w-48">
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
