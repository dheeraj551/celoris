"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Tv, 
  ChevronLeft, 
  PlayCircle, 
  Radio, 
  ArrowUpRight, 
  Sparkles,
  Flame
} from 'lucide-react';
import Link from 'next/link';

interface CelorisTvViewProps {
  onBack: () => void;
  onClose: () => void;
}

export function CelorisTvView({ onBack, onClose }: CelorisTvViewProps) {
  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#07090e] text-white select-none">
      {/* Top Header */}
      <div className="px-3 py-2.5 bg-[#120e14] border-b border-white/[0.08] flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            className="p-1 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            title="Back to Home Screen"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-md bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400">
              <Tv className="w-3 h-3" />
            </div>
            <span className="text-xs font-bold tracking-tight text-white">Celoris TV</span>
          </div>
        </div>

        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/25 text-red-400 text-[8.5px] font-mono">
          <PlayCircle className="w-2.5 h-2.5" />
          <span>ON DEMAND</span>
        </div>
      </div>

      {/* Hero Stream Banner */}
      <div className="p-3 bg-gradient-to-b from-[#180e14] to-transparent border-b border-white/[0.04]">
        {/* Simulated Video Player Box */}
        <div className="relative rounded-xl overflow-hidden border border-white/[0.12] bg-black/80 aspect-[16/9] shadow-lg group cursor-pointer">
          <img
            src="/Celoristv.png"
            alt="Celoris TV"
            className="w-full h-full object-cover opacity-75 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.7)] group-hover:scale-110 transition-transform">
              <PlayCircle className="w-5 h-5 fill-white text-black" />
            </div>
          </div>

          <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-[9px]">
            <span className="px-1.5 py-0.2 rounded bg-red-600 text-[8px] font-black uppercase text-white">
              WATCH NOW
            </span>
            <span className="text-white/80 font-mono">1080p • Free</span>
          </div>
        </div>

        <div className="mt-2 text-left">
          <h4 className="text-[11.5px] font-bold text-white leading-tight">
            Video Editing Masterclass
          </h4>
          <p className="text-[9px] text-slate-400 mt-0.5">
            Color grading, sound design &amp; viral cutaway breakdown
          </p>
        </div>
      </div>

      {/* Featured Channel Guide */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-2 custom-scrollbar">
        <p className="text-[9px] font-mono uppercase tracking-wider text-slate-400 px-1">
          Popular Topics
        </p>

        {[
          { title: 'Short-Form Video Mastery', meta: 'Reels, CapCut & Premiere' },
          { title: 'AI Video & Prompt Pipelines', meta: 'Generative AI Workflows' },
          { title: 'Web Development Sprint', meta: 'Next.js & Supabase Coding' },
        ].map((channel, i) => (
          <Link
            key={i}
            href="/celoris-tv"
            onClick={onClose}
            className="block p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] hover:border-red-500/30 transition-all group"
          >
            <div className="flex items-center justify-between gap-1 mb-0.5">
              <h5 className="text-[11px] font-bold text-white group-hover:text-red-300 transition-colors">
                {channel.title}
              </h5>
              <ArrowUpRight className="w-3 h-3 text-red-400 shrink-0" />
            </div>
            <p className="text-[9px] text-slate-400">{channel.meta}</p>
          </Link>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="p-2.5 bg-[#120e14] border-t border-white/[0.08]">
        <Link
          href="/celoris-tv"
          onClick={onClose}
          className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-[11px] transition-transform hover:scale-[1.02] active:scale-98 shadow-lg shadow-red-600/20"
        >
          <PlayCircle className="w-3.5 h-3.5" />
          <span>Open Full Celoris TV</span>
          <ArrowUpRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
