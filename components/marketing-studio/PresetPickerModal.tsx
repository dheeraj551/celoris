"use client"

import React, { useMemo, useState } from 'react';
import { X, LayoutTemplate, Loader2, RefreshCw, PenLine, Check } from 'lucide-react';
import type { MarketingPreset } from '@/lib/ai-jobs-client';

interface PresetPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  presets: MarketingPreset[] | null;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  selectedId: string | null;
  onSelect: (preset: MarketingPreset | null) => void;
}

// Higgsfield's official Marketing Studio templates. Picking one turns on
// "enhance prompt" mode: Higgsfield writes the ad prompt from your product
// photo + the template, so the user only needs to upload the product.
export function PresetPickerModal({ isOpen, onClose, presets, loading, error, onRetry, selectedId, onSelect }: PresetPickerModalProps) {
  const [category, setCategory] = useState<string>('All');

  const categories = useMemo(() => {
    const set = new Set<string>();
    (presets || []).forEach((p) => p.category && set.add(p.category));
    return ['All', ...Array.from(set).sort()];
  }, [presets]);

  const visible = useMemo(
    () => (presets || []).filter((p) => category === 'All' || p.category === category),
    [presets, category]
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md" onClick={onClose}>
      <div
        className="w-full max-w-5xl max-h-[88vh] flex flex-col bg-[#101116] border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Choose a template"
      >
        <div className="flex items-start justify-between gap-4 px-5 pt-5 pb-3 border-b border-white/5">
          <div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <LayoutTemplate className="w-5 h-5 text-[#D4FF00]" /> Marketing Studio templates
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Pick a style and upload your product photo — the template writes the ad for you. Or write your own prompt.
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white cursor-pointer" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        {categories.length > 2 && (
          <div className="flex gap-1.5 px-5 py-3 overflow-x-auto border-b border-white/5">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`shrink-0 px-3 py-1 rounded-full text-[11px] font-bold border cursor-pointer transition-colors ${
                  category === c ? 'bg-[#D4FF00] text-black border-[#D4FF00]' : 'bg-white/5 text-neutral-300 border-white/10 hover:bg-white/10'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-5">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {/* Custom prompt option */}
            <button
              onClick={() => {
                onSelect(null);
                onClose();
              }}
              className={`relative aspect-[3/4] rounded-2xl border flex flex-col items-center justify-center gap-2 p-3 text-center cursor-pointer transition-all ${
                selectedId === null ? 'border-[#D4FF00] bg-[#D4FF00]/10' : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.07]'
              }`}
            >
              <PenLine className="w-7 h-7 text-[#D4FF00]" />
              <span className="text-sm font-black text-white">My own prompt</span>
              <span className="text-[11px] text-neutral-400">Describe the scene yourself</span>
            </button>

            {loading &&
              Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] rounded-2xl bg-white/[0.04] border border-white/5 animate-pulse" />
              ))}

            {!loading &&
              visible.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    onSelect(p);
                    onClose();
                  }}
                  className={`group relative aspect-[3/4] rounded-2xl overflow-hidden border text-left cursor-pointer transition-all ${
                    selectedId === p.id ? 'border-[#D4FF00] ring-2 ring-[#D4FF00]/40' : 'border-white/10 hover:border-white/30'
                  }`}
                  title={p.description || p.name}
                >
                  {p.previewUrl ? (
                    <img
                      src={p.previewUrl}
                      alt=""
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#2a2f12] via-[#15171d] to-[#0b0c10]" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  {selectedId === p.id && (
                    <span className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#D4FF00] text-black flex items-center justify-center">
                      <Check className="w-4 h-4" />
                    </span>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-2.5">
                    {p.category && <div className="text-[9px] font-bold uppercase tracking-wider text-[#D4FF00]/90">{p.category}</div>}
                    <div className="text-sm font-black text-white leading-tight line-clamp-2">{p.name}</div>
                  </div>
                </button>
              ))}
          </div>

          {!loading && error && (
            <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              <span>Couldn&apos;t load templates: {error}</span>
              <button onClick={onRetry} className="inline-flex items-center gap-1 font-bold text-red-100 hover:text-white cursor-pointer">
                <RefreshCw className="w-4 h-4" /> Retry
              </button>
            </div>
          )}
          {!loading && !error && presets && presets.length === 0 && (
            <p className="mt-4 text-sm text-neutral-400">No templates are available right now — you can still write your own prompt.</p>
          )}
          {loading && (
            <p className="mt-4 text-xs text-neutral-500 flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Loading templates…
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
