"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Server, Shield, Cpu, Zap, Gamepad2, Radio } from 'lucide-react';
import { FiveMLogo } from '@/components/fivem/FiveMLogo';

export const FiveMBanner: React.FC = () => {
  return (
    <section className="relative py-16 bg-[#07090e] border-y border-amber-500/15 overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] bg-amber-500/10 blur-[140px] pointer-events-none rounded-full" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-amber-500/20 bg-gradient-to-br from-[#0c101b] via-[#090d16] to-[#07090e] shadow-2xl shadow-amber-950/20 relative overflow-hidden">
          {/* Subtle grid pattern inside card */}
          <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-semibold uppercase tracking-wider">
                <FiveMLogo size={18} glow={true} />
                <span>Celoris Play™ Gaming Infrastructure</span>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Hosting a FiveM or <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-200">
                  GTA Roleplay Community?
                </span>
              </h2>

              <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-xl">
                Power your FiveM server with dedicated <strong>AMD EPYC™</strong> processors and high-speed NVMe storage. Get guaranteed 60 FPS tickrate, pre-installed <strong>txAdmin</strong>, zero-lag asset streaming, and enterprise gaming DDoS filtering.
              </p>

              {/* Feature Pills */}
              <div className="flex flex-wrap gap-2.5 pt-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-neutral-200">
                  <Cpu className="w-3.5 h-3.5 text-amber-400" /> Up to 24 Dedicated EPYC™ Cores
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-neutral-200">
                  <Zap className="w-3.5 h-3.5 text-yellow-400" /> txAdmin & 1-Click QBCore / ESX
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-neutral-200">
                  <Shield className="w-3.5 h-3.5 text-amber-400" /> Gaming DDoS Protection
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-neutral-200">
                  <Radio className="w-3.5 h-3.5 text-amber-400" /> Free CAD / Community Web Hosting
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-3">
                <Link
                  href="/fivem-servers"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-black shadow-lg shadow-amber-500/20 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Server className="w-4 h-4" />
                  <span>View FiveM Server Plans</span>
                  <ArrowRight className="w-4 h-4 ml-0.5" />
                </Link>

                <div className="text-xs text-neutral-400 flex items-center justify-center sm:justify-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Backed by Contabo High-Performance Tier</span>
                </div>
              </div>
            </div>

            {/* Right Card / Interactive Preview */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-white/10 bg-[#06080d]/90 p-5 shadow-2xl relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                    <span className="text-[11px] font-mono text-neutral-400 ml-2">txAdmin · Live Node Monitor</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    60.0 FPS TICKRATE
                  </span>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <div className="flex justify-between items-center p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-neutral-400">Server Status:</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> ONLINE
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-neutral-400">CPU Architecture:</span>
                    <span className="text-amber-400 font-semibold">AMD EPYC™ Gen4</span>
                  </div>

                  <div className="flex justify-between items-center p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-neutral-400">Storage IOPS:</span>
                    <span className="text-neutral-200">NVMe PCIe (No Texture Hitching)</span>
                  </div>

                  <div className="flex justify-between items-center p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-neutral-400">FiveM Port 30120:</span>
                    <span className="text-emerald-400">Open & Anti-DDoS Filtered</span>
                  </div>

                  <div className="flex justify-between items-center p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-neutral-400">Bonus Perk:</span>
                    <span className="text-yellow-400 font-semibold">Free Celoris Cloud CAD Web</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-neutral-400">
                  <span>Starting at ₹1,199 / mo</span>
                  <Link href="/fivem-servers" className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1">
                    See All Specs <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
