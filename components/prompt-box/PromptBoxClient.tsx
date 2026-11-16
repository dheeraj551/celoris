"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Copy,
  Check,
  Maximize2,
  X,
  ArrowUpRight,
  Film,
  Box,
  Palette,
  Bot,
  Layers,
  Terminal,
  Share2,
  Lightbulb,
  Play,
  Zap,
  Command,
} from 'lucide-react';
import { PROMPT_ITEMS, PromptCategory, PromptItem } from './promptData';

const CATEGORIES: PromptCategory[] = [
  'All',
  'Video & Reels',
  '3D & WebGL',
  'UI/UX & Design',
  'AI Automation',
];

const TICKER_ITEMS = [
  'VEO 3.1 CINEMATIC 9:16',
  'KLING 3.0 MOTION CONTROL',
  'GEMINI 4 CARBON 3D WEBGL',
  'FIGMA AUTO-LAYOUT TOKENS',
  'AWS BEDROCK GUARDRAILS',
  'RUNWAY GEN-4 DIRECTOR MODE',
  'PREMIERE PRO 26.0 AI',
];

function getCategoryIcon(category: Exclude<PromptCategory, 'All'>) {
  switch (category) {
    case 'Video & Reels':
      return <Film className="w-3.5 h-3.5" />;
    case '3D & WebGL':
      return <Box className="w-3.5 h-3.5" />;
    case 'UI/UX & Design':
      return <Palette className="w-3.5 h-3.5" />;
    case 'AI Automation':
      return <Bot className="w-3.5 h-3.5" />;
  }
}

function PromptTicker() {
  return (
    <div className="w-full overflow-hidden border-y border-white/10 bg-white/[0.02] py-2.5 relative">
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#080808] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#080808] to-transparent z-10 pointer-events-none" />
      <motion.div
        animate={{ x: [0, -1200] }}
        transition={{ duration: 32, repeat: Infinity, ease: 'linear' }}
        className="flex whitespace-nowrap gap-10 items-center"
      >
        {[...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS].map((text, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.22em] text-emerald-400/70 italic">
              {text}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default function PromptBoxClient() {
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<PromptCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activePrompt, setActivePrompt] = useState<PromptItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);

  useEffect(() => {
    const id = searchParams?.get('id');
    if (id) {
      const found = PROMPT_ITEMS.find((p) => p.id === id);
      if (found) setActivePrompt(found);
    }
  }, [searchParams]);

  const filteredPrompts = useMemo(() => {
    return PROMPT_ITEMS.filter((item) => {
      const matchesCat =
        selectedCategory === 'All' || item.category === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.shortSummary.toLowerCase().includes(q) ||
        item.modelTag.toLowerCase().includes(q) ||
        item.promptText.toLowerCase().includes(q);
      return matchesCat && matchesQuery;
    });
  }, [selectedCategory, searchQuery]);

  const featuredSpotlight =
    selectedCategory === 'All' && !searchQuery.trim()
      ? filteredPrompts.find((p) => p.featured) || null
      : null;

  const gridPrompts = featuredSpotlight
    ? filteredPrompts.filter((p) => p.id !== featuredSpotlight.id)
    : filteredPrompts;

  const handleCopyPrompt = async (item: PromptItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      await navigator.clipboard.writeText(item.promptText);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId((curr) => (curr === item.id ? null : curr)), 2200);
    } catch {
      // Non-blocking
    }
  };

  const handleCopyShareLink = async (item: PromptItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      const url = `${window.location.origin}/prompt-box?id=${item.id}`;
      await navigator.clipboard.writeText(url);
      setCopiedLinkId(item.id);
      setTimeout(() => setCopiedLinkId((curr) => (curr === item.id ? null : curr)), 2200);
    } catch {
      // Non-blocking
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] text-slate-200 selection:bg-emerald-500/30 pb-28 relative overflow-hidden">
      {/* Ambient Animated Background Orbs (Matching Homepage Hero) */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.08, 0.16, 0.08] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none fixed top-10 right-0 w-[520px] h-[520px] bg-emerald-500 rounded-full mix-blend-screen filter blur-[140px] -translate-y-1/3 translate-x-1/4"
      />
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.05, 0.12, 0.05] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        className="pointer-events-none fixed bottom-0 left-0 w-[440px] h-[440px] bg-teal-600 rounded-full mix-blend-screen filter blur-[130px] translate-y-1/3 -translate-x-1/4"
      />

      {/* Hero Section */}
      <section className="relative pt-24 pb-10 sm:pt-28 sm:pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-emerald-400 text-[10px] font-black uppercase tracking-[0.22em] mb-6 backdrop-blur-xl"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <Terminal className="w-3.5 h-3.5" />
            Celoris Prompt Box · Live Vault
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.65 }}
            className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-[1.03] tracking-tight italic uppercase max-w-4xl mx-auto mb-5"
          >
            Prompts Built to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-green-400 drop-shadow-[0_0_30px_rgba(16,185,129,0.3)]">
              Ship &amp; Go Viral.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.6 }}
            className="text-xs sm:text-sm md:text-base text-slate-400 max-w-2xl mx-auto mb-9 font-medium leading-relaxed"
          >
            Every cinematic Reel, 3D WebGL micro-world, and AI pipeline from our LinkedIn &amp; Instagram videos—engineered with scene rules, camera specs, and 1-click copy.
          </motion.p>

          {/* Glassmorphic Command Search Dock (Matching CommandDock) */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="max-w-3xl mx-auto space-y-5"
          >
            <div className="relative group">
              <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-emerald-500/30 via-teal-500/20 to-emerald-500/30 opacity-40 group-focus-within:opacity-90 blur transition-opacity duration-300" />
              <div className="relative flex items-center bg-[#0e1014]/90 backdrop-blur-2xl border border-white/10 rounded-2xl px-4 py-1 shadow-2xl">
                <Search className="w-4 h-4 text-emerald-400 shrink-0 mr-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search prompts by scene, model (Veo 3.1, Gemini 4 Carbon, Figma)..."
                  className="w-full py-3 bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
                />
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-mono text-slate-400 shrink-0">
                  <Command className="w-3 h-3" />
                  {PROMPT_ITEMS.length}
                </span>
              </div>
            </div>

            {/* Animated Segmented Category Pills */}
            <div className="inline-flex flex-wrap items-center justify-center gap-1.5 p-1.5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl">
              {CATEGORIES.map((category) => {
                const active = selectedCategory === category;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={`relative px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      active ? 'text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="promptCategoryPill"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 shadow-lg shadow-emerald-900/40"
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-1.5">
                      {category === 'All' ? (
                        <Layers className="w-3.5 h-3.5" />
                      ) : (
                        getCategoryIcon(category)
                      )}
                      <span>{category}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Live Model & Stack Ticker */}
      <PromptTicker />

      {/* Main Content Container */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 relative z-10">
        {/* Featured Spotlight Card (Bento Hero Card) */}
        {featuredSpotlight && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            onClick={() => setActivePrompt(featuredSpotlight)}
            className="mb-10 group relative rounded-[2rem] bg-[#0e1114]/90 backdrop-blur-2xl border border-emerald-500/30 overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.65)] cursor-pointer hover:border-emerald-400/60 transition-all"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12">
              {/* Left Preview Media */}
              <div className="lg:col-span-6 relative aspect-video lg:aspect-auto min-h-[260px] bg-black overflow-hidden">
                {featuredSpotlight.videoUrl ? (
                  <video
                    src={featuredSpotlight.videoUrl}
                    poster={featuredSpotlight.previewImage}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <Image
                    src={featuredSpotlight.previewImage}
                    alt={featuredSpotlight.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#0e1114] via-transparent to-black/30" />

                {/* Floating Animated Pill (Like Homepage Hero) */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute bottom-4 left-4 right-4 sm:right-auto px-4 py-2.5 rounded-2xl bg-[#080808]/85 backdrop-blur-xl border border-white/15 flex items-center gap-3 shadow-2xl"
                >
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                    <Play className="w-4 h-4 fill-emerald-400" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-400">
                      Featured Reel Prompt
                    </div>
                    <div className="text-xs font-bold text-white truncate">
                      {featuredSpotlight.modelTag} · {featuredSpotlight.aspectRatio}
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Right Details */}
              <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      <Zap className="w-3 h-3" />
                      Spotlight Drop
                    </span>
                    <span className="px-3 py-1 rounded-full text-[10px] font-mono bg-white/5 text-slate-300 border border-white/10">
                      5 Timestamped Scenes
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight tracking-tight mb-3 group-hover:text-emerald-300 transition-colors">
                    {featuredSpotlight.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-5">
                    {featuredSpotlight.shortSummary}
                  </p>

                  <div className="bg-black/60 border border-white/10 rounded-2xl p-4 mb-6 font-mono text-[11px] text-slate-300 line-clamp-4 leading-relaxed">
                    {featuredSpotlight.promptText}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={(e) => handleCopyPrompt(featuredSpotlight, e)}
                    className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all hover:scale-[1.02] shadow-lg shadow-emerald-900/40 cursor-pointer"
                  >
                    {copiedId === featuredSpotlight.id ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied Prompt!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy Master Prompt
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActivePrompt(featuredSpotlight);
                    }}
                    className="px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-bold border border-white/10 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    Inspect Full Scenes
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Section Header */}
        <div className="flex items-center justify-between mb-6 text-xs text-slate-400">
          <span className="font-mono uppercase tracking-wider text-[11px]">
            Vault Index · <strong className="text-white">{filteredPrompts.length}</strong> Ready
          </span>
          <span className="hidden sm:inline text-[11px]">
            Tap any card for scene breakdown &amp; pro tips
          </span>
        </div>

        {/* Animated Bento Cards Grid */}
        {gridPrompts.length === 0 && !featuredSpotlight ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-[#0e1114] border border-white/10 rounded-3xl"
          >
            <p className="text-slate-400 text-sm mb-4">
              No prompts matched &quot;{searchQuery}&quot;.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer"
            >
              Reset Filters
            </button>
          </motion.div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {gridPrompts.map((item, idx) => {
                const isCopied = copiedId === item.id;
                const isHovered = hoveredCardId === item.id;
                return (
                  <motion.article
                    layout
                    key={item.id}
                    initial={{ opacity: 0, y: 20, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.35, delay: idx * 0.04 }}
                    whileHover={{ y: -6 }}
                    onMouseEnter={() => setHoveredCardId(item.id)}
                    onMouseLeave={() => setHoveredCardId(null)}
                    onClick={() => setActivePrompt(item)}
                    className="group relative rounded-3xl bg-[#0e1114]/90 backdrop-blur-xl border border-white/10 hover:border-emerald-500/40 transition-colors duration-300 overflow-hidden flex flex-col cursor-pointer shadow-xl"
                  >
                    {/* Subtle Hover Aura */}
                    {isHovered && (
                      <motion.div
                        layoutId="cardHoverAura"
                        className="pointer-events-none absolute -inset-px rounded-3xl bg-gradient-to-b from-emerald-500/15 to-transparent opacity-60"
                      />
                    )}

                    {/* Preview Media */}
                    <div className="relative aspect-video bg-black overflow-hidden">
                      {item.videoUrl ? (
                        <video
                          src={item.videoUrl}
                          poster={item.previewImage}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <Image
                          src={item.previewImage}
                          alt={item.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0e1114] via-transparent to-black/30" />

                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-black/75 backdrop-blur-md text-emerald-400 border border-emerald-500/30">
                          {getCategoryIcon(item.category)}
                          {item.category}
                        </span>
                        {item.aspectRatio && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-black/75 text-slate-300 border border-white/10">
                            {item.aspectRatio}
                          </span>
                        )}
                      </div>

                      <div className="absolute bottom-2.5 left-3">
                        <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-md bg-black/80 text-slate-200 border border-white/10">
                          {item.modelTag}
                        </span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 flex-1 flex flex-col relative z-10">
                      <h2 className="text-base font-bold text-white leading-snug mb-2 group-hover:text-emerald-400 transition-colors">
                        {item.title}
                      </h2>
                      <p className="text-xs text-slate-400 leading-relaxed mb-4 line-clamp-2">
                        {item.shortSummary}
                      </p>

                      <div className="bg-black/60 border border-white/10 rounded-2xl p-3 mb-4 font-mono text-[11px] text-slate-300 line-clamp-3 leading-relaxed">
                        {item.promptText}
                      </div>

                      <div className="mt-auto pt-1 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => handleCopyPrompt(item, e)}
                          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                            isCopied
                              ? 'bg-emerald-500 text-white'
                              : 'bg-emerald-600/90 hover:bg-emerald-500 text-white shadow-md shadow-emerald-950/50'
                          }`}
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              Copy Prompt
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActivePrompt(item);
                          }}
                          title="Inspect full prompt"
                          className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 transition-colors cursor-pointer"
                        >
                          <Maximize2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </section>

      {/* Bottom Ecosystem CTA (Matching Homepage Cards) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 mt-16 relative z-10">
        <div className="rounded-[2rem] bg-gradient-to-br from-emerald-950/60 via-[#0e1114] to-[#080808] border border-emerald-500/25 p-7 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 mb-2">
              Celoris Creator Pipeline
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight italic uppercase mb-2">
              Turn These Prompts Into Paid Client Work
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Pass a 10-minute certification exam in the Celoris Job Center to unlock verified Video, UI/UX, Brand Identity, and AI Engineering roles.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/job-center"
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all hover:scale-105 shadow-lg shadow-emerald-900/40"
            >
              Explore Job Center
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <Link
              href="/learn"
              className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-bold border border-white/10 transition-colors"
            >
              Browse Courses
            </Link>
          </div>
        </div>
      </section>

      {/* Animated Full Prompt Detail Modal */}
      <AnimatePresence>
        {activePrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setActivePrompt(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              className="w-full max-w-2xl max-h-[90vh] bg-[#0e1114] border border-white/15 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-emerald-400">
                      {getCategoryIcon(activePrompt.category)}
                      {activePrompt.category}
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="text-[11px] font-mono text-slate-400">
                      {activePrompt.modelTag}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white truncate">
                    {activePrompt.title}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setActivePrompt(null)}
                  aria-label="Close modal"
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 cursor-pointer shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-5">
                <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 bg-black">
                  {activePrompt.videoUrl ? (
                    <video
                      src={activePrompt.videoUrl}
                      poster={activePrompt.previewImage}
                      controls
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <Image
                      src={activePrompt.previewImage}
                      alt={activePrompt.title}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>

                <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-slate-200">
                  <Lightbulb className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-emerald-400">Pro Tip:</strong>{' '}
                    {activePrompt.proTip}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                      Full Copy-Paste Prompt
                    </span>
                    <button
                      type="button"
                      onClick={(e) => handleCopyShareLink(activePrompt, e)}
                      className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1 cursor-pointer"
                    >
                      {copiedLinkId === activePrompt.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          Link Copied
                        </>
                      ) : (
                        <>
                          <Share2 className="w-3.5 h-3.5" />
                          Copy Direct Link
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="bg-black/75 border border-white/10 rounded-2xl p-4 text-xs text-slate-200 font-mono whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto">
                    {activePrompt.promptText}
                  </pre>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-white/10 bg-[#080808] flex flex-wrap items-center justify-between gap-3">
                {activePrompt.relatedLinkHref && activePrompt.relatedLinkLabel ? (
                  <Link
                    href={activePrompt.relatedLinkHref}
                    className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                  >
                    {activePrompt.relatedLinkLabel}
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                ) : (
                  <span />
                )}

                <button
                  type="button"
                  onClick={(e) => handleCopyPrompt(activePrompt, e)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedId === activePrompt.id ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied to Clipboard!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy Full Prompt
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
