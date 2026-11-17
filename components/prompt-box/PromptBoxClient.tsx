"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Copy,
  Check,
  X,
  ArrowUpRight,
  Film,
  Box,
  Layers,
  Share2,
  Lightbulb,
  Clapperboard,
  BadgeCheck,
  HelpCircle,
  ImageIcon,
  Video,
  Play,
} from 'lucide-react';
import { PROMPT_ITEMS, PromptCategory, PromptItem } from './promptData';

const CATEGORIES: PromptCategory[] = [
  'All',
  'Video & Reels',
  'Commercials & Ads',
  '3D & Animation',
  'Long-Form Video',
  'Image Prompts',
];

function getCategoryIcon(category: Exclude<PromptCategory, 'All'>) {
  switch (category) {
    case 'Video & Reels':
      return <Film className="w-3.5 h-3.5" />;
    case 'Long-Form Video':
      return <Video className="w-3.5 h-3.5" />;
    case 'Image Prompts':
      return <ImageIcon className="w-3.5 h-3.5" />;
    case 'Commercials & Ads':
      return <Clapperboard className="w-3.5 h-3.5" />;
    case '3D & Animation':
      return <Box className="w-3.5 h-3.5" />;
  }
}

export default function PromptBoxClient() {
  const searchParams = useSearchParams();
  const gridRef = useRef<HTMLDivElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<PromptCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [activePrompt, setActivePrompt] = useState<PromptItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null);

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
    <div className="min-h-screen bg-[#060608] text-white selection:bg-[#d9ff00]/30 pb-24 relative overflow-hidden">
      {/* Subtle Ambient Top Glow behind Logo */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[640px] h-[260px] bg-emerald-500/10 blur-[130px] rounded-full" />

      {/* Centered Studio Header (Matching Reference Layout) */}
      <section className="relative pt-24 pb-8 sm:pt-28 sm:pb-10 px-4 sm:px-6 text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="max-w-lg mx-auto mb-3"
        >
          <img
            src="/prompt-box-logo.png"
            alt="Prompt Box — AI Prompt Studio"
            className="w-[320px] sm:w-[440px] h-auto mx-auto object-contain drop-shadow-[0_10px_35px_rgba(168,85,247,0.22)]"
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto mb-6 font-medium"
        >
          Watch the output, copy the exact Seedance-tested prompt, and ship.
        </motion.p>

        {/* Primary CTA + How Does It Work */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22, duration: 0.45 }}
          className="flex items-center justify-center gap-4 flex-wrap"
        >
          <button
            type="button"
            onClick={() => gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            className="px-6 py-2.5 rounded-xl bg-[#d9ff00] hover:bg-[#c8eb00] text-black font-bold text-xs sm:text-sm transition-all hover:scale-[1.03] active:scale-95 shadow-[0_0_25px_rgba(217,255,0,0.25)] cursor-pointer"
          >
            Explore Prompts
          </button>

          <button
            type="button"
            onClick={() => setShowHowItWorks(true)}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-neutral-300 hover:text-white font-semibold transition-colors cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-neutral-400" />
            How does it work?
          </button>
        </motion.div>
      </section>

      {/* Filter Pills Row + Right Action Controls */}
      <section ref={gridRef} className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 pt-2 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
          {/* Left Segmented Pill Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-full bg-white/[0.06] border border-white/10 overflow-x-auto no-scrollbar max-w-full">
            {CATEGORIES.map((category) => {
              const active = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`relative px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer ${
                    active ? 'text-black' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="promptBoxTabPill"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                      className="absolute inset-0 rounded-full bg-white shadow-sm"
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

          {/* Right Controls: Search Toggle + Seedance Verified Pill */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            {showSearch ? (
              <div className="flex items-center bg-white/[0.07] border border-white/15 rounded-full px-3 py-1.5 w-60 sm:w-64">
                <Search className="w-3.5 h-3.5 text-neutral-400 mr-2 shrink-0" />
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search prompts..."
                  className="bg-transparent text-xs text-white placeholder:text-neutral-500 focus:outline-none w-full"
                />
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setShowSearch(false);
                  }}
                  className="text-neutral-400 hover:text-white ml-1 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowSearch(true)}
                className="px-3.5 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs font-semibold text-neutral-300 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Search className="w-3.5 h-3.5" />
                Search
              </button>
            )}

            <div className="px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/10 text-xs font-semibold text-emerald-400 flex items-center gap-1.5 whitespace-nowrap">
              <BadgeCheck className="w-3.5 h-3.5" />
              Tested on Seedance
            </div>
          </div>
        </div>

        {/* 5-Column Vertical 9:16 Reel Showcase Grid (Higgsfield Shorts Studio Style) */}
        {filteredPrompts.length === 0 ? (
          <div className="text-center py-20 rounded-2xl bg-white/[0.03] border border-white/10">
            <p className="text-neutral-400 text-sm mb-3">
              {selectedCategory === 'Long-Form Video' || selectedCategory === 'Image Prompts'
                ? `${selectedCategory} prompts are coming next — stay tuned!`
                : `No prompts matched "${searchQuery}".`}
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="px-4 py-2 rounded-full bg-white text-black text-xs font-bold cursor-pointer"
            >
              Show All Prompts
            </button>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5 sm:gap-4"
          >
            <AnimatePresence mode="popLayout">
              {filteredPrompts.map((item, idx) => {
                const isCopied = copiedId === item.id;
                return (
                  <motion.article
                    layout
                    key={item.id}
                    initial={{ opacity: 0, y: 16, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, delay: idx * 0.03 }}
                    whileHover={{ y: -4 }}
                    onClick={() => setActivePrompt(item)}
                    className="group relative aspect-[9/16] rounded-2xl overflow-hidden bg-neutral-950 border border-white/10 hover:border-white/30 transition-all duration-300 cursor-pointer shadow-xl"
                  >
                    {/* Full-Bleed Video / Image */}
                    {item.videoUrl ? (
                      <video
                        src={item.videoUrl}
                        poster={item.previewImage}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <Image
                        src={item.previewImage}
                        alt={item.title}
                        fill
                        unoptimized
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    )}

                    {/* Top-Left Category Tag (Subtle) */}
                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                      <span className="px-2 py-0.5 rounded-full bg-black/65 backdrop-blur-md border border-white/15 text-[10px] font-semibold text-white/90 truncate">
                        {item.category}
                      </span>
                      {item.featured && (
                        <span className="px-2 py-0.5 rounded-full bg-[#d9ff00] text-black text-[9px] font-black uppercase tracking-wider shrink-0">
                          Top
                        </span>
                      )}
                    </div>

                    {/* Bottom Gradient + Title + Mini Corner Thumbnail Badge */}
                    <div className="absolute inset-x-0 bottom-0 pt-16 pb-3 px-3 bg-gradient-to-t from-black/95 via-black/55 to-transparent flex items-end justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <h2 className="text-xs sm:text-sm font-bold text-white leading-snug line-clamp-2 mb-2 drop-shadow">
                          {item.title}
                        </h2>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={(e) => handleCopyPrompt(item, e)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                              isCopied
                                ? 'bg-emerald-500 text-white'
                                : 'bg-white/15 hover:bg-[#d9ff00] hover:text-black text-white backdrop-blur-md border border-white/15'
                            }`}
                          >
                            {isCopied ? (
                              <>
                                <Check className="w-3 h-3" />
                                Copied
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                Copy Prompt
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Mini Preview Thumbnail Badge (Bottom-Right Corner like Reference) */}
                      <div className="relative w-9 h-12 rounded-lg overflow-hidden border border-white/30 shadow-lg shrink-0 bg-neutral-900">
                        <Image
                          src={item.previewImage}
                          alt={item.title}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                          {item.videoUrl ? (
                            <Play className="w-3 h-3 text-white fill-white opacity-90" />
                          ) : (
                            <ImageIcon className="w-3 h-3 text-white opacity-90" />
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </section>

      {/* Full Prompt Detail Modal */}
      <AnimatePresence>
        {activePrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setActivePrompt(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              className="w-full max-w-4xl max-h-[90vh] bg-[#0e1013] border border-white/15 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Left Vertical Video Preview */}
              <div className="md:w-[320px] lg:w-[360px] shrink-0 bg-black relative flex items-center justify-center border-b md:border-b-0 md:border-r border-white/10">
                <div className="relative w-full aspect-[9/16] max-h-[45vh] md:max-h-[85vh]">
                  {activePrompt.videoUrl ? (
                    <video
                      src={activePrompt.videoUrl}
                      poster={activePrompt.previewImage}
                      controls
                      autoPlay
                      loop
                      playsInline
                      className="w-full h-full object-contain bg-black"
                    />
                  ) : (
                    <Image
                      src={activePrompt.previewImage}
                      alt={activePrompt.title}
                      fill
                      unoptimized
                      className="object-contain"
                    />
                  )}
                </div>
              </div>

              {/* Right Prompt Details & Copy */}
              <div className="flex-1 flex flex-col min-w-0 max-h-[55vh] md:max-h-[90vh]">
                <div className="px-6 py-4 border-b border-white/10 flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                        <BadgeCheck className="w-3.5 h-3.5" />
                        {activePrompt.modelTag}
                      </span>
                      <span className="text-neutral-600">•</span>
                      <span className="text-[11px] text-neutral-400">
                        {activePrompt.category}
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                      {activePrompt.title}
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActivePrompt(null)}
                    aria-label="Close modal"
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 cursor-pointer shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-6 overflow-y-auto space-y-4 flex-1">
                  <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-neutral-200">
                    <Lightbulb className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-emerald-400">Pro Tip:</strong>{' '}
                      {activePrompt.proTip}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                        Copy-Paste Prompt
                      </span>
                      <button
                        type="button"
                        onClick={(e) => handleCopyShareLink(activePrompt, e)}
                        className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 cursor-pointer"
                      >
                        {copiedLinkId === activePrompt.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            Link Copied
                          </>
                        ) : (
                          <>
                            <Share2 className="w-3.5 h-3.5" />
                            Share Link
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="bg-black/75 border border-white/10 rounded-2xl p-4 text-xs text-neutral-200 font-mono whitespace-pre-wrap leading-relaxed">
                      {activePrompt.promptText}
                    </pre>
                  </div>
                </div>

                <div className="px-6 py-4 border-t border-white/10 bg-[#08090b] flex flex-wrap items-center justify-between gap-3">
                  {activePrompt.relatedLinkHref && activePrompt.relatedLinkLabel ? (
                    <Link
                      href={activePrompt.relatedLinkHref}
                      className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
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
                    className="px-5 py-2.5 rounded-xl bg-[#d9ff00] hover:bg-[#c8eb00] text-black text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedId === activePrompt.id ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy Prompt
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* How Does It Work Modal */}
      <AnimatePresence>
        {showHowItWorks && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowHowItWorks(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#0e1013] border border-white/15 rounded-3xl p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-white">How Prompt Box Works</h3>
                <button
                  type="button"
                  onClick={() => setShowHowItWorks(false)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <ol className="space-y-3 text-xs sm:text-sm text-neutral-300">
                <li className="p-3 rounded-xl bg-white/[0.04] border border-white/10">
                  <strong className="text-white">1. Watch the Output:</strong> Preview real 9:16 vertical clips and visuals tested directly on Seedance.
                </li>
                <li className="p-3 rounded-xl bg-white/[0.04] border border-white/10">
                  <strong className="text-white">2. Copy in One Click:</strong> Grab the exact multi-scene prompt, camera directions, and negative constraints.
                </li>
                <li className="p-3 rounded-xl bg-white/[0.04] border border-white/10">
                  <strong className="text-white">3. Customize &amp; Ship:</strong> Swap subjects, brands, or cities and generate your own viral Reels or client ads.
                </li>
              </ol>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
