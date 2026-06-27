"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  LayoutTemplate, 
  Image as ImageIcon, 
  Type, 
  Wand2, 
  Music, 
  Video, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export function VideoStudioFeature() {
  return (
    <div className="w-full max-w-5xl mx-auto my-32 px-4">
      <div className="relative w-full rounded-[2.5rem] bg-[#0A0D14] border border-blue-900/30 overflow-hidden shadow-[0_0_100px_rgba(37,99,235,0.1)] p-8 md:p-16">
        
        {/* Background Dot Grid */}
        <div className="absolute top-1/3 right-10 w-64 h-64 bg-[radial-gradient(circle,rgba(37,99,235,0.15)_2px,transparent_2px)] [background-size:24px_24px] opacity-60" />
        <div className="absolute bottom-20 left-10 w-48 h-48 bg-[radial-gradient(circle,rgba(37,99,235,0.15)_2px,transparent_2px)] [background-size:24px_24px] opacity-60" />
        
        {/* Glowing Orbs */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10">
          {/* Header Section */}
          <div className="mb-12 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 mb-6">
              <span className="text-[11px] font-bold text-blue-400 uppercase tracking-widest">
                AI Video Creation
              </span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-4 tracking-tight">
              Video Studio
              <br />
              <span className="text-blue-500">Create. Edit. Inspire.</span>
            </h2>
            
            <p className="text-lg text-slate-300 font-light leading-relaxed max-w-xl">
              AI-powered video creation, smart editing tools, and stunning templates to bring your ideas to life.
            </p>
          </div>

          {/* Interactive UI Mockup */}
          <div className="relative w-full aspect-[16/9] md:aspect-auto md:h-[500px] mb-12 flex items-center justify-center">
            
            {/* Center Video Preview Container */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              className="absolute md:top-10 md:left-1/2 md:-translate-x-1/2 w-[85%] md:w-[600px] h-[250px] md:h-[300px] bg-[#0F131F] rounded-2xl border border-blue-500/20 shadow-[0_0_30px_rgba(37,99,235,0.15)] overflow-hidden flex items-center justify-center z-20"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
              {/* Mountain Image Mock */}
              <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-80" alt="Mountain Landscape" />
              
              <div className="relative z-20 w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center cursor-pointer hover:bg-white/20 hover:scale-105 transition-all">
                <Play className="w-6 h-6 text-white ml-1" fill="currentColor" />
              </div>

              {/* Mock Video Controls UI */}
              <div className="absolute top-4 left-4 flex flex-col gap-3 z-20">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-6 h-6 rounded border border-white/20 bg-black/40 flex items-center justify-center">
                    <div className="w-3 h-3 border border-white/50 rounded-sm" />
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Left Sidebar Tools */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 flex-col items-center gap-6 py-6 w-24 bg-[#0F131F]/80 backdrop-blur-xl rounded-2xl border border-blue-500/20 shadow-[0_0_30px_rgba(37,99,235,0.1)] z-30"
            >
              {[
                { icon: LayoutTemplate, label: 'Templates' },
                { icon: ImageIcon, label: 'Media' },
                { icon: Type, label: 'Text' },
                { icon: Wand2, label: 'Effects' },
                { icon: Music, label: 'Music' }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2 cursor-pointer group">
                  <item.icon className="w-5 h-5 text-slate-400 group-hover:text-blue-400 transition-colors" />
                  <span className="text-[9px] text-slate-400 group-hover:text-blue-400 font-medium uppercase tracking-widest transition-colors">{item.label}</span>
                </div>
              ))}
            </motion.div>

            {/* Right floating buttons */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 flex-col gap-4 z-30"
            >
              <div className="w-20 h-20 bg-[#0F131F] rounded-2xl border border-blue-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:border-blue-400 transition-colors cursor-pointer group">
                <Video className="w-8 h-8 text-blue-500 group-hover:text-blue-400 group-hover:scale-110 transition-all" fill="currentColor" />
              </div>
              <div className="w-20 h-20 bg-[#0F131F] rounded-2xl border border-indigo-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.2)] hover:border-indigo-400 transition-colors cursor-pointer group">
                <span className="text-3xl font-black bg-gradient-to-br from-indigo-400 to-purple-500 bg-clip-text text-transparent group-hover:scale-110 transition-all">AI</span>
              </div>
            </motion.div>

            {/* Bottom Timeline Mock */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="absolute bottom-0 w-[95%] md:w-[85%] h-32 bg-[#0F131F]/90 backdrop-blur-xl rounded-2xl border border-blue-500/20 shadow-[0_0_40px_rgba(37,99,235,0.15)] overflow-hidden z-30"
            >
              {/* Timeline Header */}
              <div className="flex items-center px-4 py-2 border-b border-white/5 bg-black/20">
                <div className="w-2 h-2 rounded-full bg-blue-500 mr-4" />
                <div className="flex gap-4 text-[10px] text-slate-500 font-mono tracking-widest opacity-50">
                  <span>0:00</span><span>0:05</span><span>0:10</span><span>0:15</span><span>0:20</span>
                </div>
              </div>
              
              {/* Video Track */}
              <div className="px-4 py-3 flex gap-2 overflow-hidden items-center border-b border-white/5 relative">
                <div className="absolute left-1/3 top-0 bottom-0 w-px bg-blue-500 z-10 shadow-[0_0_10px_rgba(59,130,246,1)]">
                   <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rounded-sm border-2 border-blue-500" />
                </div>
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex-shrink-0 w-24 h-12 bg-slate-800 rounded border border-white/10 overflow-hidden relative opacity-70 hover:opacity-100 transition-opacity cursor-pointer">
                     <img src={`https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=400&auto=format&fit=crop&sig=${i}`} className="w-full h-full object-cover" alt="" />
                  </div>
                ))}
              </div>

              {/* Audio Track */}
              <div className="px-4 py-2 flex items-center opacity-70">
                 <div className="w-full h-6 flex items-center justify-between gap-[2px]">
                   {[30,55,80,45,70,95,40,60,85,35,65,90,50,75,25,80,45,70,55,85,30,60,90,40,75,50,65,35,80,55,70,25,90,45,60,85,30,75,50,95,40,65,80,35,55,70,45,85,60,30,75,90,50,40,65,35,80,55,70,25,85,45,60,90,30,75,50,95,40,65,80,35,55,70,45,85,60,30,75,50,40,65,35,80,55,70,25,85,45,60,90,30,75,50,95,40,65,80,35,55].map((h, i) => (
                     <div key={i} className="w-1 bg-blue-500/50 rounded-full" style={{ height: `${h}%` }} />
                   ))}
                 </div>
              </div>
            </motion.div>

          </div>

          {/* Action Button */}
          <div className="w-full flex justify-center mt-16 relative z-40">
            <Link href="/video-studio" className="inline-flex items-center gap-3 px-8 py-4 rounded-xl border border-blue-500/40 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 hover:text-blue-300 font-medium text-lg transition-all group">
              Learn More
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
        </div>
      </div>
    </div>
  );
}
