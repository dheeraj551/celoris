"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles,
  ArrowRight,
  MousePointer2,
  Type
} from 'lucide-react';
import Link from 'next/link';

export function ImageStudioFeature() {
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
        <div className="absolute bottom-20 left-10 w-64 h-64 bg-indigo-600/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10 flex flex-col items-start">
          {/* Header Section */}
          <div className="mb-10 w-full">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-md border border-blue-600 bg-blue-600/20 mb-6">
              <span className="text-[11px] font-bold text-white uppercase tracking-widest">
                NEW
              </span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4 tracking-tight">
              Image Studio
              <br />
              <span className="text-cyan-400 flex items-center gap-3">
                Creative Engine
                <Sparkles className="w-8 h-8 text-purple-400" />
              </span>
            </h2>
            
            <p className="text-lg text-slate-300 font-light leading-relaxed max-w-sm">
              Generate stunning visuals, remove backgrounds, and design with the power of AI.
            </p>
          </div>

          {/* Interactive UI Mockup */}
          <div className="relative w-full aspect-[4/5] md:aspect-square mb-12 flex items-center justify-center">
            
            {/* Center Portrait Container (Transparent BG Mock) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="absolute top-0 right-4 md:right-10 w-[65%] md:w-[60%] h-[80%] rounded-2xl border border-blue-500/40 shadow-[0_0_30px_rgba(37,99,235,0.2)] overflow-hidden z-10 bg-white"
            >
              {/* Checkerboard Pattern for transparent bg */}
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc), repeating-linear-gradient(45deg, #ccc 25%, #fff 25%, #fff 75%, #ccc 75%, #ccc)', backgroundPosition: '0 0, 10px 10px', backgroundSize: '20px 20px' }}></div>
              
              {/* Foreground Subject */}
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover" alt="Portrait" style={{ maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)' }} />
            </motion.div>

            {/* Floating Top Left Icon Block */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="absolute top-10 left-4 md:left-8 w-24 h-24 bg-sky-300 rounded-2xl shadow-xl flex flex-col items-center justify-center z-20"
            >
              <Type className="w-10 h-10 text-sky-800 mb-1" />
              <div className="flex flex-col gap-1 w-12">
                <div className="h-1 bg-sky-800/40 rounded-full w-full" />
                <div className="h-1 bg-sky-800/40 rounded-full w-full" />
                <div className="h-1 bg-sky-800/40 rounded-full w-3/4" />
              </div>
            </motion.div>

            {/* Floating Prompt Box */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="absolute bottom-[35%] left-0 md:-left-4 w-48 bg-[#0d0d0d]/90 backdrop-blur-xl rounded-2xl border border-blue-500/30 p-4 shadow-[0_10px_30px_rgba(0,0,0,0.5)] z-20"
            >
              <p className="text-xs text-white mb-3 leading-relaxed">
                A futuristic city at sunset
              </p>
              <button className="w-full py-2 bg-indigo-500 hover:bg-indigo-400 rounded-lg text-white text-[10px] font-bold uppercase tracking-wider transition-colors">
                Generate
              </button>
            </motion.div>

            {/* Bottom Carousel Mockup */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[90%] md:w-[110%] bg-[#0a0a0a]/80 backdrop-blur-md rounded-2xl border border-white/5 shadow-2xl p-3 flex gap-2 overflow-hidden z-30"
            >
              {[
                "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=200&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=200&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1506744626753-1fa7604d4565?q=80&w=200&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=200&auto=format&fit=crop"
              ].map((img, i) => (
                <div key={i} className={`relative flex-1 aspect-square rounded-xl overflow-hidden cursor-pointer ${i === 1 ? 'border-2 border-blue-400 shadow-[0_0_15px_rgba(96,165,250,0.5)] scale-105 z-10' : 'opacity-60 hover:opacity-100'}`}>
                  <img src={img} className="w-full h-full object-cover" alt={`Generated option ${i+1}`} />
                </div>
              ))}

              {/* Cursor Icon on second item */}
              <motion.div 
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1 }}
                className="absolute left-[38%] bottom-[-10px] z-40 text-white drop-shadow-md pointer-events-none"
              >
                <MousePointer2 className="w-8 h-8 fill-black stroke-white stroke-[1.5]" />
              </motion.div>
            </motion.div>

          </div>

          {/* Action Button */}
          <div className="w-full">
            <Link href="/image-studio" className="inline-flex items-center gap-3 px-8 py-3 rounded-xl border border-blue-500/40 bg-[#0a0a0a] hover:bg-blue-900/20 text-blue-400 hover:text-blue-300 font-medium text-lg transition-all group w-48">
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
