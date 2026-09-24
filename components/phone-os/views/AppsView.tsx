"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Layers, 
  ChevronLeft, 
  Video, 
  Image as ImageIcon, 
  Sparkles, 
  Box, 
  ArrowUpRight,
  Flame,
  Zap
} from 'lucide-react';
import { CREATIVE_APPS } from '../data';
import Link from 'next/link';

interface AppsViewProps {
  onBack: () => void;
  onClose: () => void;
}

export function AppsView({ onBack, onClose }: AppsViewProps) {
  const getAppIcon = (id: string) => {
    switch (id) {
      case 'app-video': return <Video className="w-4 h-4 text-rose-400" />;
      case 'app-image': return <ImageIcon className="w-4 h-4 text-blue-400" />;
      case 'app-ai': return <Sparkles className="w-4 h-4 text-purple-400" />;
      case 'app-vault': return <Box className="w-4 h-4 text-emerald-400" />;
      default: return <Layers className="w-4 h-4 text-white" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#07090e] text-white select-none">
      {/* Top App Header */}
      <div className="px-3 py-2.5 bg-[#0e111a] border-b border-white/[0.08] flex items-center justify-between shadow-sm">
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
            <div className="w-5 h-5 rounded-md bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Zap className="w-3 h-3" />
            </div>
            <span className="text-xs font-bold tracking-tight text-white">Creative Studio</span>
          </div>
        </div>

        <span className="text-[9px] px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-mono">
          4 Cloud Tools
        </span>
      </div>

      {/* Sub Header */}
      <div className="px-3 py-2 bg-gradient-to-r from-cyan-900/20 via-blue-900/15 to-transparent border-b border-white/[0.06] flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold text-white leading-tight">Zero Installation Cloud Suite</p>
          <p className="text-[8.5px] text-cyan-300/80">Runs in your browser • Free tier enabled</p>
        </div>
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
      </div>

      {/* 4 Tool Cards Grid */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-2.5 custom-scrollbar">
        {CREATIVE_APPS.map(app => (
          <Link
            key={app.id}
            href={app.href}
            onClick={onClose}
            className={`block p-3 rounded-xl bg-gradient-to-r ${app.bgColor} hover:brightness-110 border transition-all group cursor-pointer shadow-sm relative overflow-hidden`}
          >
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center shrink-0">
                  {getAppIcon(app.id)}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-cyan-200 transition-colors">
                    {app.name}
                  </h4>
                  <span className="text-[8.5px] font-mono text-slate-300">
                    {app.badge}
                  </span>
                </div>
              </div>

              <div className="w-6 h-6 rounded-full bg-white/10 group-hover:bg-white/20 flex items-center justify-center transition-colors">
                <ArrowUpRight className="w-3.5 h-3.5 text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>

            <p className="text-[9.5px] text-slate-300 leading-snug">
              {app.shortDesc}
            </p>
          </Link>
        ))}
      </div>

      {/* Quick Launch Bottom Bar */}
      <div className="p-2.5 bg-[#0e111a] border-t border-white/[0.08] text-center">
        <p className="text-[9px] text-slate-400 mb-1.5">
          Need custom enterprise pipelines or team seats?
        </p>
        <Link
          href="/pricing"
          onClick={onClose}
          className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-white text-[10px] font-bold transition-colors"
        >
          <span>View Free &amp; Pro Plans</span>
          <ArrowUpRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
