"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
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
} from 'lucide-react';
import { PROMPT_ITEMS, PromptCategory, PromptItem } from './promptData';

const CATEGORIES: PromptCategory[] = [
  'All',
  'Video & Reels',
  '3D & WebGL',
  'UI/UX & Design',
  'AI Automation',
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

export default function PromptBoxClient() {
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<PromptCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activePrompt, setActivePrompt] = useState<PromptItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null);

  // Support deep linking: /prompt-box?id=seoul-tower-sci-fi-launch
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
      // Fallback ignored
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
      // Fallback ignored
    }
  };

  return (
    <div className="min-h-screen bg-[#090a0d] text-slate-200 selection:bg-emerald-500/30 pb-24">
      {/* Hero Section */}
      <section className="relative pt-24 pb-12 sm:pt-28 sm:pb-14 border-b border-slate-800/80 bg-gradient-to-b from-[#0d1714] via-[#090a0d] to-[#090a0d]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-bold mb-6">
            <Terminal className="w-3.5 h-3.5" />
            Celoris Prompt Box · Free Copy-Paste Vault
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight max-w-3xl mx-auto mb-4">
            Copy-Paste AI Prompts That <span className="text-emerald-400">Actually Ship</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto mb-8 leading-relaxed">
            Every prompt featured in our LinkedIn &amp; Instagram Reels—ready with real output previews, 1-click copy, and production tips. Zero fluff.
          </p>

          {/* Search & Filter Bar */}
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search prompts by keyword, model (Veo 3.1, Gemini, Figma), or topic..."
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#111319] border border-slate-800 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/60 transition-colors"
              />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2">
              {CATEGORIES.map((category) => {
                const active = selectedCategory === category;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      active
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/30'
                        : 'bg-[#111319] text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-white'
                    }`}
                  >
                    {category === 'All' ? (
                      <Layers className="w-3.5 h-3.5" />
                    ) : (
                      getCategoryIcon(category)
                    )}
                    <span>{category}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Prompt Cards Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-10">
        <div className="flex items-center justify-between mb-6 text-xs text-slate-400">
          <span>
            Showing <strong className="text-white">{filteredPrompts.length}</strong>{' '}
            {filteredPrompts.length === 1 ? 'prompt' : 'prompts'}
          </span>
          <span className="hidden sm:inline">
            Click any card to read full scene rules &amp; copy
          </span>
        </div>

        {filteredPrompts.length === 0 ? (
          <div className="text-center py-20 bg-[#111319] border border-slate-800 rounded-2xl">
            <p className="text-slate-400 text-sm mb-3">No prompts matched &quot;{searchQuery}&quot;.</p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrompts.map((item) => {
              const isCopied = copiedId === item.id;
              return (
                <article
                  key={item.id}
                  onClick={() => setActivePrompt(item)}
                  className={`group rounded-2xl bg-[#111319] border transition-all duration-200 overflow-hidden flex flex-col cursor-pointer hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-black/60 ${
                    item.featured
                      ? 'border-emerald-500/40 ring-1 ring-emerald-500/20'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Output Preview Media */}
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
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111319] via-transparent to-black/30" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-black/75 backdrop-blur-md text-emerald-400 border border-emerald-500/30">
                        {getCategoryIcon(item.category)}
                        {item.category}
                      </span>
                      {item.featured && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-600 text-white shadow">
                          Featured
                        </span>
                      )}
                    </div>

                    {/* Model Tag Bottom */}
                    <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between">
                      <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-black/80 text-slate-200 border border-white/10">
                        {item.modelTag}
                      </span>
                      {item.aspectRatio && (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-black/70 text-slate-300">
                          {item.aspectRatio}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-1 flex flex-col">
                    <h2 className="text-base font-bold text-white leading-snug mb-2 group-hover:text-emerald-400 transition-colors">
                      {item.title}
                    </h2>
                    <p className="text-xs text-slate-400 leading-relaxed mb-4 line-clamp-2">
                      {item.shortSummary}
                    </p>

                    {/* Prompt Snippet Preview */}
                    <div className="bg-black/50 border border-slate-800/90 rounded-xl p-3 mb-4 font-mono text-[11px] text-slate-300 line-clamp-3 leading-relaxed">
                      {item.promptText}
                    </div>

                    {/* Action Footer */}
                    <div className="mt-auto pt-2 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => handleCopyPrompt(item, e)}
                        className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          isCopied
                            ? 'bg-emerald-500 text-white'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white'
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
                        title="Expand full prompt"
                        className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700/60 transition-colors cursor-pointer"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Bottom Ecosystem CTA */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 mt-16">
        <div className="rounded-2xl bg-gradient-to-br from-emerald-950/60 via-[#111319] to-slate-900 border border-emerald-500/25 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-lg sm:text-xl font-black text-white mb-1.5">
              Turn These Prompts Into Paid Client Work
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Pass a 10-minute certification exam in the Celoris Job Center to unlock remote Video, UI/UX, Brand Identity, and AI Engineering roles.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/job-center"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              Explore Job Center
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <Link
              href="/learn"
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors"
            >
              Browse Courses
            </Link>
          </div>
        </div>
      </section>

      {/* Full Prompt Detail Modal */}
      {activePrompt && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setActivePrompt(null)}
        >
          <div
            className="w-full max-w-2xl max-h-[90vh] bg-[#111319] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400">
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
                className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-5">
              {/* Preview */}
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-800 bg-black">
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

              {/* Pro Tip */}
              <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-slate-200">
                <Lightbulb className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-emerald-400">Pro Tip:</strong>{' '}
                  {activePrompt.proTip}
                </div>
              </div>

              {/* Full Prompt Text */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
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
                <pre className="bg-black/70 border border-slate-800 rounded-2xl p-4 text-xs text-slate-200 font-mono whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto">
                  {activePrompt.promptText}
                </pre>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-800 bg-[#0d0f14] flex flex-wrap items-center justify-between gap-3">
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
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
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
          </div>
        </div>
      )}
    </div>
  );
}
