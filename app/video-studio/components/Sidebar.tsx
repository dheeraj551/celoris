"use client";

import React from 'react';
import { 
  Upload, LayoutTemplate, Music, Type, Shapes, FileText, Subtitles, 
  Wand2, ArrowRightLeft, SlidersHorizontal, MessageSquare, Sparkles, HelpCircle
} from 'lucide-react';

const navItems = [
  { id: 'cdance', icon: Sparkles, label: 'C-Dance', isPro: true },
  { id: 'upload', icon: Upload, label: 'Media' },
  { id: 'captions', icon: Subtitles, label: 'Captions' },
  { id: 'templates', icon: LayoutTemplate, label: 'Presets' },
  { id: 'audio', icon: Music, label: 'Audio' },
  { id: 'text', icon: Type, label: 'Text' },
  { id: 'elements', icon: Shapes, label: 'Elements' },
  { id: 'effects', icon: Wand2, label: 'Effects' },
  { id: 'transitions', icon: ArrowRightLeft, label: 'Transition' },
  { id: 'filters', icon: SlidersHorizontal, label: 'Filters' },
  { id: 'transcript', icon: FileText, label: 'Transcript' },
];

export default function Sidebar({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (id: string) => void }) {
  return (
    <aside className="w-[74px] bg-[#090b10] border-r border-white/[0.08] flex flex-col items-center py-3.5 shrink-0 overflow-y-auto overflow-x-hidden select-none z-20 custom-scrollbar">
      
      {/* Navigation Tool Items */}
      <div className="w-full flex flex-col items-center gap-1.5 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const isPro = (item as any).isPro;

          if (isPro) {
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                title="C-Dance 2.5 Generative AI Video Studio"
                className={`w-full py-2.5 px-1 rounded-xl flex flex-col items-center justify-center gap-1 transition-all relative group mb-1 ${
                  isActive 
                    ? 'bg-[#ccff00]/15 text-[#ccff00] border border-[#ccff00]/40 shadow-[0_0_15px_rgba(204,255,0,0.2)]' 
                    : 'bg-white/[0.03] text-slate-300 hover:text-[#ccff00] hover:bg-[#ccff00]/10 border border-white/5 hover:border-[#ccff00]/30'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-[#ccff00] fill-[#ccff00]/20' : 'text-[#ccff00]'
                  }`} />
                  <span className="absolute -top-1 -right-3 text-[7.5px] font-mono font-black px-1 rounded bg-[#ccff00] text-black leading-tight shadow-sm">
                    PRO
                  </span>
                </div>
                <span className="text-[10px] font-bold tracking-tight">{item.label}</span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={`w-full py-2 px-1 rounded-xl flex flex-col items-center justify-center gap-1 transition-all relative group ${
                isActive 
                  ? 'bg-white/10 text-white font-semibold shadow-xs' 
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-gradient-to-b from-emerald-400 to-cyan-400 rounded-r-full shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              )}
              <Icon className="w-4 h-4 transition-transform group-hover:scale-105" />
              <span className="text-[9.5px] font-medium leading-none">{item.label}</span>
            </button>
          );
        })}
      </div>
      
      {/* Bottom Help Icon */}
      <div className="mt-auto pt-3 border-t border-white/5 w-full flex flex-col items-center gap-2">
        <a 
          href="https://wa.me/919084718101" 
          target="_blank" 
          rel="noopener noreferrer"
          title="Contact Celoris Support on WhatsApp"
          className="p-2 rounded-xl text-slate-400 hover:text-emerald-400 hover:bg-white/[0.05] transition-colors"
        >
          <MessageSquare className="w-4 h-4" />
        </a>
      </div>

    </aside>
  );
}
