"use client";

import React, { useState, useId, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, Zap, Shield, Cpu, Globe, ChevronRight, Server, Activity } from 'lucide-react';
import { CelorisSpeedGauge } from './CelorisGraphics';
import { useAuth } from '@/components/providers/AuthProvider';

interface HeroProps {
  onClaim: (subdomain: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onClaim }) => {
  const { user, profile } = useAuth();
  const [subdomain, setSubdomain] = useState('');
  const [activeTemplate, setActiveTemplate] = useState<'portfolio' | 'developer' | 'agency'>('portfolio');
  const inputId = useId();

  const userDefault = (profile?.username || user?.email?.split('@')[0] || '')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '');

  useEffect(() => {
    if (userDefault && !subdomain) {
      setSubdomain(userDefault);
    }
  }, [userDefault, subdomain]);

  // Clean subdomain for display
  const currentSubdomain = subdomain.trim() || userDefault || 'yourname';
  const sanitizedSubdomain = currentSubdomain.toLowerCase().replace(/[^a-z0-9-]/g, '');

  const PHISHING_KEYWORDS = [
    'login', 'signin', 'verify', 'verification', 'kyc', 'paytm', 'sbi', 'upi',
    'bank', 'hdfc', 'icici', 'axis', 'pnb', 'kotak', 'phonepe', 'gpay',
    'googlepay', 'bhim', 'aadhaar', 'uidai', 'incometax', 'pan', 'otp',
    'secure', 'account', 'auth', 'update', 'wallet', 'amazon',
    'flipkart', 'netflix', 'paypal', 'apple', 'microsoft', 'freecharge', 'cred',
    'password', 'security', 'invoice', 'telegram', 'whatsapp'
  ];

  const matchedPhishingKeyword = PHISHING_KEYWORDS.find((kw) => sanitizedSubdomain.includes(kw));
  const isAvailable = sanitizedSubdomain.length >= 3 && !sanitizedSubdomain.includes(' ') && !matchedPhishingKeyword;

  const handleQuickPick = (name: string) => {
    setSubdomain(name);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAvailable) {
      onClaim(sanitizedSubdomain);
    }
  };

  return (
    <section className="relative pt-32 pb-20 md:pt-36 md:pb-28 overflow-hidden bg-[#050505]">
      {/* Background ambient lighting and developer grid with emerald aura */}
      <div className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none" />
      
      {/* Animated subtle floating emerald glow orbs */}
      <motion.div
        animate={{
          y: [0, -25, 0],
          x: [0, 15, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-amber-500/10 blur-[130px] rounded-full pointer-events-none"
      />

      <motion.div
        animate={{
          y: [0, 20, 0],
          x: [0, -20, 0],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute top-1/3 right-10 w-[450px] h-[350px] bg-amber-600/10 blur-[140px] rounded-full pointer-events-none"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Announcement Bar - Clean, subtle hairline element */}
        <div className="flex justify-center mb-6">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-amber-500/30 bg-amber-950/40 text-xs text-amber-300"
          >
            <span className="flex h-2 w-2 rounded-full bg-amber-400" />
            <span className="font-semibold text-amber-400">New Launch</span>
            <span className="text-neutral-500" aria-hidden="true">·</span>
            <span>Free WordPress Cloud for Indian Students & Creators</span>
            <ChevronRight className="w-3.5 h-3.5 text-amber-400 ml-0.5" />
          </motion.div>
        </div>

        {/* Hero Copy Block */}
        <div className="text-center max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12] [text-wrap:balance]"
          >
            Free WordPress Hosting in India:{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-white">
              Your Website Live in 60 Seconds.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-5 text-base sm:text-lg text-neutral-300 max-w-2xl mx-auto leading-relaxed [text-wrap:balance]"
          >
            Fast, ad-free managed WordPress cloud hosting on your own{' '}
            <span className="text-white font-mono font-medium underline decoration-amber-400/50 decoration-2">
              yourname.celoris.in
            </span>{' '}
            domain. 3 GB NVMe storage, free SSL, and zero credit card required. Free forever while active, protected by automated 30-day archival alerts.
          </motion.p>

          {/* Interactive Hero Widget (The Subdomain Claimer) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-9 max-w-xl mx-auto"
          >
            <form onSubmit={handleSubmit} className="relative">
              <div className="p-1.5 rounded-2xl bg-[#0F0F0F] border border-white/15 shadow-2xl shadow-black focus-within:border-amber-500/60 transition-all duration-200">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  {/* Domain Prefix & Input */}
                  <div className="flex items-center flex-1 px-3 py-2 bg-[#080808] rounded-xl border border-white/5">
                    <span className="text-neutral-500 font-mono text-xs sm:text-sm select-none pr-0.5">
                      https://
                    </span>
                    <label htmlFor={inputId} className="sr-only">Choose your subdomain</label>
                    <input
                      id={inputId}
                      type="text"
                      value={subdomain}
                      onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                      placeholder="yourname or brand"
                      className="flex-1 bg-transparent text-white font-mono text-sm sm:text-base font-semibold focus:outline-none placeholder:text-neutral-600 min-w-0"
                    />
                    <span className="text-amber-400 font-mono text-xs sm:text-sm font-semibold select-none pl-0.5">
                      .celoris.in
                    </span>
                  </div>

                  {/* Primary CTA Button */}
                  <button
                    type="submit"
                    disabled={!isAvailable}
                    className="px-5 py-3 sm:py-2.5 text-sm font-bold text-black bg-amber-400 hover:bg-amber-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-md shadow-amber-500/20 transition-all duration-150 flex items-center justify-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <span>Claim Free Site</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Real-time Subdomain Availability Status & Suggestions */}
              <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 px-2 text-xs">
                <div className="flex items-center gap-1.5 font-mono">
                  {matchedPhishingKeyword ? (
                    <span className="text-rose-400 font-medium">
                      Restricted keyword ("{matchedPhishingKeyword}") blocked to prevent phishing abuse
                    </span>
                  ) : isAvailable ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-amber-400 font-medium">
                        {sanitizedSubdomain}.celoris.in is available · Ready in 60s
                      </span>
                    </>
                  ) : (
                    <span className="text-amber-400">
                      Enter at least 3 letters/numbers
                    </span>
                  )}
                </div>

                {/* Quick Ideas for Students */}
                <div className="flex items-center gap-1.5 text-neutral-400">
                  <span className="text-[11px]">Suggestions:</span>
                  {(userDefault
                    ? [userDefault, `${userDefault}-portfolio`, 'creative-studio']
                    : ['my-portfolio', 'creative-studio', 'dev-lab']
                  ).slice(0, 3).map((demoName) => (
                    <button
                      key={demoName}
                      type="button"
                      onClick={() => handleQuickPick(demoName)}
                      className="text-[11px] font-mono text-neutral-300 hover:text-amber-400 hover:underline cursor-pointer transition-colors"
                    >
                      {demoName}
                    </button>
                  ))}
                </div>
              </div>
            </form>

            {/* Micro-Trust Badges */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-xs font-medium text-neutral-300">
              <span className="flex items-center gap-1.5 text-amber-400">
                <Check className="w-3.5 h-3.5" />
                <span>Free Forever While Active</span>
              </span>
              <span className="text-neutral-700 select-none">·</span>
              <span className="flex items-center gap-1.5 text-neutral-300">
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>Free SSL Certificate</span>
              </span>
              <span className="text-neutral-700 select-none">·</span>
              <span className="flex items-center gap-1.5 text-neutral-300">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>1-Click WordPress</span>
              </span>
              <span className="text-neutral-700 select-none">·</span>
              <span className="flex items-center gap-1.5 text-neutral-300">
                <span>No Credit Card Needed</span>
              </span>
            </div>
          </motion.div>
        </div>

        {/* Hero Visual Graphic: 3D-Style Glassmorphism Graphics with Framer-Motion Floating Animation */}
        <div className="mt-14 max-w-5xl mx-auto relative [perspective:1400px]">
          
          {/* Floating Satellite 3D Badge 1: Top-Right Speed Metric Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: [0, -10, 0],
            }}
            transition={{
              opacity: { duration: 0.6, delay: 0.4 },
              scale: { duration: 0.6, delay: 0.4 },
              y: {
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
            className="absolute -top-7 -right-2 sm:-right-6 z-20 hidden sm:flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-[#0E0E0E]/95 backdrop-blur-xl border border-amber-500/30 shadow-xl shadow-black"
          >
            <CelorisSpeedGauge score={100} className="w-9 h-9" />
            <div>
              <div className="text-[11px] font-mono text-neutral-400 flex items-center gap-1">
                <span>PageSpeed Score</span>
                <span className="text-amber-400">· 100/100</span>
              </div>
              <div className="text-xs font-bold text-white flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span>0.38s Instant First Paint</span>
              </div>
            </div>
          </motion.div>

          {/* Floating Satellite 3D Badge 2: Bottom-Left Edge Server Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: [0, -10, 0],
            }}
            transition={{
              opacity: { duration: 0.6, delay: 0.6 },
              scale: { duration: 0.6, delay: 0.6 },
              y: {
                duration: 5.8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.6,
              },
            }}
            className="absolute -bottom-6 -left-2 sm:-left-6 z-20 hidden sm:flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-[#0E0E0E]/95 backdrop-blur-xl border border-amber-500/30 shadow-xl shadow-black"
          >
            <div className="w-8 h-8 rounded-full bg-amber-950/80 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Server className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] font-mono text-amber-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span>Asia-South1 (Mumbai)</span>
              </div>
              <div className="text-xs font-bold text-white flex items-center gap-1">
                <Activity className="w-3 h-3 text-amber-400" />
                <span>38ms Median TTFB across India</span>
              </div>
            </div>
          </motion.div>

          {/* Floating Satellite 3D Badge 3: Top-Left Free SSL & Ad-Free Protection */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: [0, -10, 0],
            }}
            transition={{
              opacity: { duration: 0.6, delay: 0.8 },
              scale: { duration: 0.6, delay: 0.8 },
              y: {
                duration: 6.2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.2,
              },
            }}
            className="absolute -top-6 left-6 z-20 hidden lg:flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-[#0E0E0E]/95 backdrop-blur-lg border border-white/10 shadow-lg text-[11px] font-mono text-neutral-300"
          >
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span>Wildcard Let’s Encrypt TLS Active</span>
          </motion.div>

          {/* Main 3D Floating Dashboard Container */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: [0, -10, 0],
            }}
            transition={{
              opacity: { duration: 0.7, delay: 0.2 },
              y: {
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
            whileHover={{
              y: -5,
              transition: { duration: 0.3, ease: "easeOut" },
            }}
            className="relative rounded-2xl p-1 bg-gradient-to-b from-amber-500/20 via-white/5 to-transparent shadow-2xl shadow-black transform-gpu"
          >
            {/* Outer Mockup Chrome */}
            <div className="rounded-[15px] bg-[#0A0A0A] border border-white/10 overflow-hidden">
              {/* Browser / Console Bar */}
              <div className="px-4 py-3 bg-[#080808] border-b border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
                {/* Traffic dots */}
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <span className="ml-2 text-xs font-mono text-neutral-400 hidden sm:inline">
                    Celoris Edge Dashboard v2.4
                  </span>
                </div>

                {/* Simulated URL bar with Live Subdomain Sync */}
                <div className="flex-1 max-w-md mx-auto hidden sm:flex items-center justify-center">
                  <div className="w-full px-3 py-1 bg-[#121212] border border-white/10 rounded-lg text-xs font-mono text-neutral-300 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-amber-400">
                      <Shield className="w-3 h-3" />
                      <span className="text-neutral-200">https://{sanitizedSubdomain}.celoris.in</span>
                    </span>
                    <span className="text-[10px] text-neutral-500 uppercase tracking-wider">TLS 1.3 Active</span>
                  </div>
                </div>

                {/* Speed Score & Status Indicator */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-950/40 border border-amber-500/30 rounded-md">
                    <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    <span className="text-[11px] font-mono text-amber-400 font-semibold">
                      Online · 99.9% Uptime
                    </span>
                  </div>

                  <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-amber-950/40 border border-amber-500/30 rounded-md text-[11px] font-mono text-amber-300 font-semibold">
                    <Zap className="w-3 h-3 text-amber-400" />
                    <span>PageSpeed 100/100</span>
                  </div>
                </div>
              </div>

              {/* Template Switcher Sub-bar */}
              <div className="px-6 py-2.5 bg-[#0D0D0D] border-b border-white/[0.06] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-neutral-400">Active Template Preview:</span>
                  <div className="flex items-center gap-1 bg-[#161616] p-1 rounded-lg border border-white/5">
                    <button
                      onClick={() => setActiveTemplate('portfolio')}
                      className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                        activeTemplate === 'portfolio' ? 'bg-amber-500 text-black font-semibold shadow-sm' : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      Designer Portfolio
                    </button>
                    <button
                      onClick={() => setActiveTemplate('developer')}
                      className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                        activeTemplate === 'developer' ? 'bg-amber-500 text-black font-semibold shadow-sm' : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      Developer Showcase
                    </button>
                    <button
                      onClick={() => setActiveTemplate('agency')}
                      className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                        activeTemplate === 'agency' ? 'bg-amber-500 text-black font-semibold shadow-sm' : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      Freelance Landing Page
                    </button>
                  </div>
                </div>

                <div className="hidden md:flex items-center gap-4 text-neutral-400 font-mono text-[11px]">
                  <span>Server: <strong className="text-neutral-200">NVMe Cloud + CDN</strong></span>
                  <span>TTFB: <strong className="text-amber-400">38ms</strong></span>
                  <span>Storage: <strong className="text-neutral-200">3.0 GB Free NVMe</strong></span>
                </div>
              </div>

              {/* Live Preview Canvas with Smooth Animated Transitions */}
              <div className="relative bg-[#050505] p-6 sm:p-8 min-h-[350px] flex flex-col justify-between overflow-hidden">
                <div className="space-y-6">
                  {/* Mock Site Navbar */}
                  <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center font-bold text-black text-xs">
                        {sanitizedSubdomain.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-bold text-white font-mono">
                        {sanitizedSubdomain}.celoris.in
                      </span>
                    </div>

                    <div className="flex items-center gap-5 text-xs text-neutral-400">
                      <span className="hover:text-white cursor-pointer">Projects</span>
                      <span className="hover:text-white cursor-pointer">About</span>
                      <span className="hover:text-white cursor-pointer">Case Studies</span>
                      <button className="px-3 py-1 bg-white/10 text-white rounded text-xs hover:bg-white/15 cursor-pointer">
                        Get in Touch
                      </button>
                    </div>
                  </div>

                  {/* Mock Hero Content with AnimatePresence */}
                  <AnimatePresence mode="wait">
                    {activeTemplate === 'portfolio' && (
                      <motion.div
                        key="portfolio"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.25 }}
                        className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center pt-2"
                      >
                        <div className="md:col-span-7 space-y-3">
                          <div className="inline-block text-xs font-mono text-amber-400">
                            UI/UX Designer · Celoris Live Student
                          </div>
                          <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                            Crafting intuitive digital products & high-converting brand identities.
                          </h2>
                          <p className="text-xs text-neutral-400 leading-relaxed max-w-md">
                            Final-year design student building design systems, interactive web apps, and design engineering prototypes.
                          </p>
                          <div className="pt-2 flex items-center gap-3">
                            <button 
                              onClick={() => onClaim(sanitizedSubdomain)}
                              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors"
                            >
                              <span>Deploy This Template</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-xs text-neutral-500 font-mono">Latest WordPress + Elementor</span>
                          </div>
                        </div>

                        <div className="md:col-span-5 grid grid-cols-2 gap-3">
                          <motion.div
                            whileHover={{ y: -3 }}
                            className="p-3 bg-[#111111] border border-white/5 rounded-xl space-y-2 transition-colors hover:border-amber-500/30"
                          >
                            <div className="h-16 bg-neutral-900 border border-white/5 rounded-lg flex items-center justify-center text-[11px] text-amber-300 font-mono">
                              Fintech App Redesign
                            </div>
                            <div className="text-xs font-semibold text-white">NeoBank Mobile</div>
                            <div className="text-[10px] text-neutral-400">Figma · Case Study</div>
                          </motion.div>

                          <motion.div
                            whileHover={{ y: -3 }}
                            className="p-3 bg-[#111111] border border-white/5 rounded-xl space-y-2 transition-colors hover:border-amber-500/30"
                          >
                            <div className="h-16 bg-amber-950/40 border border-amber-500/20 rounded-lg flex items-center justify-center text-[11px] text-amber-300 font-mono">
                              E-Commerce System
                            </div>
                            <div className="text-xs font-semibold text-white">Artisan Crafts</div>
                            <div className="text-[10px] text-neutral-400">WordPress · WooCommerce</div>
                          </motion.div>
                        </div>
                      </motion.div>
                    )}

                    {activeTemplate === 'developer' && (
                      <motion.div
                        key="developer"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.25 }}
                        className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center pt-2"
                      >
                        <div className="md:col-span-7 space-y-3">
                          <div className="inline-block text-xs font-mono text-amber-400">
                            Full-Stack Web Developer & Engineer
                          </div>
                          <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                            Building reliable web software, React apps & custom WordPress themes.
                          </h2>
                          <p className="text-xs text-neutral-400 leading-relaxed max-w-md">
                            Available for freelance engineering, API integrations, and modern high-speed site rebuilds.
                          </p>
                          <div className="pt-2 flex items-center gap-3">
                            <button 
                              onClick={() => onClaim(sanitizedSubdomain)}
                              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors"
                            >
                              <span>Deploy This Template</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-xs text-neutral-500 font-mono">Gutenberg + Tailwind blocks</span>
                          </div>
                        </div>

                        <div className="md:col-span-5 bg-[#0F0F0F] p-4 rounded-xl border border-white/5 font-mono text-[11px] text-neutral-300 space-y-1.5">
                          <div className="text-neutral-500">$ curl -I https://{sanitizedSubdomain}.celoris.in</div>
                          <div className="text-amber-400">HTTP/2 200 OK</div>
                          <div>server: cloudflare</div>
                          <div>x-cache: HIT, edge-mumbai</div>
                          <div>content-type: text/html; charset=UTF-8</div>
                          <div className="text-amber-400">via: 1.1 Caddy (WordPress NVMe)</div>
                        </div>
                      </motion.div>
                    )}

                    {activeTemplate === 'agency' && (
                      <motion.div
                        key="agency"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.25 }}
                        className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center pt-2"
                      >
                        <div className="md:col-span-7 space-y-3">
                          <div className="inline-block text-xs font-mono text-amber-400">
                            Digital Studio & Client Demo Hub
                          </div>
                          <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                            Premium web solutions for local Indian businesses & startups.
                          </h2>
                          <p className="text-xs text-neutral-400 leading-relaxed max-w-md">
                            Showcase live staging demos directly to your clients on a fast, professional Celoris domain.
                          </p>
                          <div className="pt-2 flex items-center gap-3">
                            <button 
                              onClick={() => onClaim(sanitizedSubdomain)}
                              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors"
                            >
                              <span>Deploy This Template</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-xs text-neutral-500 font-mono">Astra Pro + Elementor</span>
                          </div>
                        </div>

                        <div className="md:col-span-5 grid grid-cols-2 gap-3">
                          <div className="p-3 bg-[#111111] border border-white/5 rounded-xl text-center space-y-1">
                            <div className="text-2xl font-bold font-mono text-amber-400">0.4s</div>
                            <div className="text-[11px] text-neutral-300">Average Load Time</div>
                          </div>
                          <div className="p-3 bg-[#111111] border border-white/5 rounded-xl text-center space-y-1">
                            <div className="text-2xl font-bold font-mono text-amber-400">100%</div>
                            <div className="text-[11px] text-neutral-300">Ad-Free Guarantee</div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Floating Tech Badges on bottom */}
                <div className="pt-6 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-4 text-[11px] font-mono text-neutral-400">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1 text-neutral-300">
                      <Cpu className="w-3.5 h-3.5 text-amber-400" />
                      <span>NVMe PCIe Gen4 SSD</span>
                    </span>
                    <span className="flex items-center gap-1 text-neutral-300">
                      <Globe className="w-3.5 h-3.5 text-amber-400" />
                      <span>Anycast Edge CDN</span>
                    </span>
                  </div>
                  <div className="text-neutral-400">
                    Paid hosting costs ₹3,499+/yr · Celoris is ₹0 Forever
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
