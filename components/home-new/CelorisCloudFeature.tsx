"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Cloud, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Server, 
  Check, 
  Terminal, 
  Globe, 
  Palette,
  HardDrive,
  Lock
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SpotlightCard } from '@/components/ui/spotlight-card';

export function CelorisCloudFeature() {
  const router = useRouter();
  const [subdomain, setSubdomain] = useState('');
  const cleanSub = (subdomain || 'yourname').toLowerCase().replace(/[^a-z0-9-]/g, '');

  const handleClaim = (e: React.FormEvent) => {
    e.preventDefault();
    const finalSub = cleanSub || 'yourname';
    router.push(`/cloud?subdomain=${encodeURIComponent(finalSub)}`);
  };

  return (
    <div className="w-full max-w-7xl mx-auto my-12 px-4 sm:px-6 lg:px-8">
      <SpotlightCard
        radius="2.5rem"
        beamColor="rgba(16, 185, 129, 0.9)"
        glowColor="rgba(16, 185, 129, 0.15)"
        className="shadow-[0_0_90px_rgba(16,185,129,0.14)]"
        innerClassName="bg-[#07090d]/90 backdrop-blur-3xl p-6 sm:p-10 md:p-14 border border-white/[0.1] shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]"
      >
        {/* Background Decorative Mesh & Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(circle,rgba(16,185,129,0.12)_1.5px,transparent_1.5px)] [background-size:20px_20px] opacity-70 pointer-events-none" />
        <div className="absolute -top-10 -right-10 w-80 h-80 bg-emerald-500/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-teal-500/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Headline, Value Props & Interactive Subdomain Claim Form */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Live Launch Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 text-xs font-semibold backdrop-blur-md shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
              <span>NEW · Celoris Cloud Hosting Engine</span>
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-400/20 text-[9px] font-mono text-emerald-200 uppercase tracking-widest font-bold">
                Live
              </span>
            </div>

            {/* Heading */}
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.15]">
                Deploy Your Free{' '}
                <span className="bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                  WordPress Cloud Pod
                </span>{' '}
                in 60 Seconds.
              </h2>
              <p className="mt-3 text-sm sm:text-base text-neutral-300 leading-relaxed max-w-xl">
                Get an isolated <strong className="text-white">3 GB NVMe container</strong> on your custom{' '}
                <span className="text-emerald-300 font-mono">yourname.celoris.in</span> subdomain. Hardware-accelerated Let's Encrypt SSL, 10+ pre-installed themes (Astra, Elementor, Mow Magazine), and zero server fees.
              </p>
            </div>

            {/* Interactive Subdomain Claim Input */}
            <form onSubmit={handleClaim} className="space-y-3 pt-1">
              <div className="p-2 sm:p-2.5 rounded-2xl bg-[#0e1217] border border-white/15 focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-400/20 transition-all flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shadow-2xl">
                
                <div className="flex-1 flex items-center px-3 py-2 font-mono text-sm sm:text-base min-w-0">
                  <span className="text-neutral-500 select-none text-xs sm:text-sm">https://</span>
                  <input
                    type="text"
                    value={subdomain}
                    onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    placeholder="yourname"
                    className="flex-1 bg-transparent text-white font-bold focus:outline-none px-1 min-w-0 placeholder:text-neutral-600"
                  />
                  <span className="text-emerald-400 font-bold select-none text-xs sm:text-sm">.celoris.in</span>
                </div>

                <button
                  type="submit"
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-bold text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98] cursor-pointer whitespace-nowrap"
                >
                  <span>Claim &amp; Launch</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Instant Status Helper */}
              <div className="flex items-center justify-between text-[11px] text-neutral-400 px-2 font-mono">
                <span className="flex items-center gap-1.5 text-emerald-300">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>3 GB NVMe PCIe Pod · 100% Free Forever</span>
                </span>
                <span className="hidden sm:inline text-neutral-400">
                  No credit card required
                </span>
              </div>
            </form>

            {/* Value Highlights Pill Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <Zap className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white truncate">60s Auto Deploy</div>
                  <div className="text-[10px] text-neutral-400 truncate">WordPress Core + DB</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                  <Lock className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white truncate">Free Wildcard SSL</div>
                  <div className="text-[10px] text-neutral-400 truncate">Let's Encrypt TLS 1.3</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center gap-2.5 col-span-2 sm:col-span-1">
                <div className="w-7 h-7 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                  <Palette className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white truncate">10+ Pro Themes</div>
                  <div className="text-[10px] text-neutral-400 truncate">Astra, Mow, Elementor</div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Live Mascot Deployment Animation Video */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-full max-w-[340px] sm:max-w-[360px] rounded-2xl sm:rounded-3xl p-1 bg-gradient-to-b from-emerald-500/35 via-white/10 to-transparent shadow-[0_0_60px_rgba(16,185,129,0.22)] border border-emerald-500/30 group">
              
              {/* Outer Shell */}
              <div className="relative rounded-[20px] sm:rounded-[24px] bg-[#07090d] overflow-hidden">
                
                {/* Floating Top Status Badge */}
                <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-emerald-500/40 text-[10px] font-mono text-emerald-300 shadow-lg">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Live 60s Deployment</span>
                  </div>
                  <div className="px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[9px] font-mono text-neutral-400">
                    asia-south1
                  </div>
                </div>

                {/* Looping Mascot Video */}
                <div className="relative aspect-[9/16] w-full bg-black overflow-hidden flex items-center justify-center">
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="metadata"
                    poster="/videos/celoris_cloud_poster.jpg"
                    className="w-full h-full object-cover block"
                  >
                    <source src="/videos/celoris_cloud_web_1080x1920.mp4" type="video/mp4" media="(min-width: 640px)" />
                    <source src="/videos/celoris_cloud_web_720x1280.mp4" type="video/mp4" />
                  </video>
                </div>

                {/* Bottom Quick Action Bar */}
                <div className="px-4 py-3 bg-[#0a0d14] border-t border-white/[0.08] flex items-center justify-between text-xs">
                  <Link
                    href="/cloud"
                    className="text-neutral-400 hover:text-emerald-300 transition-colors inline-flex items-center gap-1 cursor-pointer font-medium text-[11px]"
                  >
                    <span>Explore All Plans</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                  <Link
                    href={`/cloud?subdomain=${encodeURIComponent(cleanSub)}`}
                    className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <span>Launch Now</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

        </div>
      </SpotlightCard>
    </div>
  );
}
