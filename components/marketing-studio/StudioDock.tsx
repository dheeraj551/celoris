"use client"

import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Video,
  Box,
  Smartphone,
  Plus,
  Minus,
  ChevronRight,
  X,
  LayoutTemplate,
  Gauge,
  Loader2,
} from 'lucide-react';
import { DemoProduct, DemoAvatar, SHOT_ANGLES, ASPECT_RATIOS, RESOLUTIONS } from './marketingStudioData';
import { ProductSelectorModal } from './ProductSelectorModal';
import { AvatarSelectorModal } from './AvatarSelectorModal';
import type { MarketingPreset } from '@/lib/ai-jobs-client';

export const MAX_VARIATIONS = 3;

interface StudioDockProps {
  mode: 'image' | 'video';
  setMode: (m: 'image' | 'video') => void;
  prompt: string;
  setPrompt: (p: string) => void;
  selectedPreset: MarketingPreset | null;
  onOpenPresets: () => void;
  onClearPreset: () => void;
  selectedAngle: string;
  setSelectedAngle: (a: string) => void;
  selectedRatio: string;
  setSelectedRatio: (r: string) => void;
  resolution: '1k' | '2k' | '4k';
  setResolution: (r: '1k' | '2k' | '4k') => void;
  variationCount: number;
  setVariationCount: React.Dispatch<React.SetStateAction<number>>;
  selectedProduct: DemoProduct | null;
  setSelectedProduct: (p: DemoProduct | null) => void;
  selectedAvatar: DemoAvatar | null;
  setSelectedAvatar: (a: DemoAvatar | null) => void;
  onGenerate: () => void;
  isSubmitting: boolean;
  submitLabel?: string;
}

type Menu = 'angle' | 'ratio' | 'res' | null;

export function StudioDock({
  mode,
  setMode,
  prompt,
  setPrompt,
  selectedPreset,
  onOpenPresets,
  onClearPreset,
  selectedAngle,
  setSelectedAngle,
  selectedRatio,
  setSelectedRatio,
  resolution,
  setResolution,
  variationCount,
  setVariationCount,
  selectedProduct,
  setSelectedProduct,
  selectedAvatar,
  setSelectedAvatar,
  onGenerate,
  isSubmitting,
  submitLabel,
}: StudioDockProps) {
  const [openMenu, setOpenMenu] = useState<Menu>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const toggle = (m: Menu) => setOpenMenu((cur) => (cur === m ? null : m));
  const isVideo = mode === 'video';

  const chip =
    'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-[11px] font-medium text-neutral-200 transition-colors cursor-pointer select-none';
  const menuBox =
    'absolute bottom-full left-0 mb-2 bg-[#14161F] border border-white/15 rounded-2xl p-1.5 shadow-2xl z-50 animate-in fade-in slide-in-from-bottom-2';
  const menuItem = (active: boolean) =>
    `w-full text-left px-2.5 py-1.5 rounded-xl text-xs flex items-center justify-between cursor-pointer transition-colors ${
      active ? 'bg-[#D4FF00]/15 text-[#D4FF00] font-bold' : 'text-neutral-300 hover:bg-white/5'
    }`;

  return (
    <>
      <div className="w-full max-w-6xl mx-auto px-3 sm:px-6 relative z-30">
        <div className="relative bg-[#111217]/95 backdrop-blur-3xl border border-white/[0.12] rounded-3xl p-2.5 sm:p-3.5 shadow-[0_30px_70px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(255,255,255,0.12)] flex flex-col md:flex-row items-stretch md:items-center gap-2.5">
          {/* Image / Video switch */}
          <div className="flex md:flex-col bg-white/[0.04] p-1 rounded-2xl border border-white/5 shrink-0 justify-center">
            {(['image', 'video'] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`flex-1 md:flex-none flex flex-col items-center justify-center gap-0.5 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl text-[10px] font-bold tracking-tight transition-all cursor-pointer ${
                  mode === m ? 'bg-white/15 text-white shadow-md' : 'text-neutral-400 hover:text-white'
                }`}
              >
                {m === 'image' ? <ImageIcon className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                <span>{m === 'image' ? 'Image' : 'Video'}</span>
              </button>
            ))}
          </div>

          {/* Prompt + settings */}
          <div className="flex-1 flex flex-col justify-between min-w-0 bg-white/[0.02] border border-white/[0.06] rounded-2xl p-2.5 sm:p-3 focus-within:border-white/20 transition-all">
            {isVideo ? (
              <div className="pb-2 text-sm text-neutral-400">
                <span className="font-bold text-white">Video ads (UGC &amp; Motion) are coming soon.</span> Switch to Image to create
                product ads now.
              </div>
            ) : (
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value.slice(0, 2000))}
                rows={2}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) onGenerate();
                }}
                placeholder={
                  selectedPreset
                    ? `Optional: add details for the "${selectedPreset.name}" template…`
                    : 'Describe the ad you want: scene, mood, lighting, text on the image…'
                }
                className="w-full resize-none bg-transparent text-white text-sm sm:text-base placeholder-neutral-500 outline-none pb-2 tracking-wide font-normal leading-snug"
              />
            )}

            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-1.5 border-t border-white/5 relative">
              {/* Template (Higgsfield preset) */}
              {selectedPreset ? (
                <span className="inline-flex items-center gap-1.5 pl-2 pr-1 py-1 rounded-full bg-[#D4FF00]/15 border border-[#D4FF00]/40 text-[11px] font-bold text-[#D4FF00] max-w-[14rem]">
                  <LayoutTemplate className="w-3.5 h-3.5 shrink-0" />
                  <button type="button" onClick={onOpenPresets} className="truncate cursor-pointer" title="Change template">
                    {selectedPreset.name}
                  </button>
                  <button
                    type="button"
                    onClick={onClearPreset}
                    className="p-0.5 rounded-full hover:bg-black/30 cursor-pointer"
                    aria-label="Remove template"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={onOpenPresets}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-[11px] font-bold text-white transition-all cursor-pointer select-none"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#D4FF00] fill-none stroke-current stroke-[2.8]" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 14c2.5-5 4.5-5 7 0s4.5 5 7 0" />
                  </svg>
                  <span className="font-extrabold tracking-tight">Templates</span>
                  <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
                </button>
              )}

              {/* Angle (prompt mode only) */}
              {!selectedPreset && (
                <div className="relative">
                  <button type="button" onClick={() => toggle('angle')} className={chip}>
                    <Box className="w-3 h-3 text-neutral-400" />
                    <span>{selectedAngle}</span>
                  </button>
                  {openMenu === 'angle' && (
                    <div className={`${menuBox} w-60`}>
                      <div className="px-2.5 py-1 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Camera angle</div>
                      {SHOT_ANGLES.map((a) => (
                        <button
                          key={a.id}
                          type="button"
                          onClick={() => {
                            setSelectedAngle(a.name);
                            setOpenMenu(null);
                          }}
                          className={menuItem(selectedAngle === a.name)}
                        >
                          <div>
                            <div>{a.name}</div>
                            <div className="text-[10px] text-neutral-400 font-normal">{a.desc}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Aspect ratio */}
              <div className="relative">
                <button type="button" onClick={() => toggle('ratio')} className={chip}>
                  <Smartphone className="w-3 h-3 text-neutral-400" />
                  <span>{selectedRatio}</span>
                </button>
                {openMenu === 'ratio' && (
                  <div className={`${menuBox} w-56`}>
                    <div className="px-2.5 py-1 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Aspect ratio</div>
                    {ASPECT_RATIOS.map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => {
                          setSelectedRatio(r.id);
                          setOpenMenu(null);
                        }}
                        className={menuItem(selectedRatio === r.id)}
                      >
                        <span>{r.name}</span>
                        <span className="font-mono text-[10px] text-neutral-400">{r.id}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Resolution */}
              <div className="relative">
                <button type="button" onClick={() => toggle('res')} className={chip}>
                  <Gauge className="w-3 h-3 text-neutral-400" />
                  <span>{resolution.toUpperCase()}</span>
                </button>
                {openMenu === 'res' && (
                  <div className={`${menuBox} w-52`}>
                    <div className="px-2.5 py-1 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Resolution</div>
                    {RESOLUTIONS.map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => {
                          setResolution(r.id);
                          setOpenMenu(null);
                        }}
                        className={menuItem(resolution === r.id)}
                      >
                        <span className="font-bold">{r.name}</span>
                        <span className="text-[10px] text-neutral-400">{r.desc}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Variations */}
              <div
                className="inline-flex items-center bg-white/[0.05] border border-white/10 rounded-full px-1.5 py-0.5 text-xs text-neutral-300"
                title="How many versions to create"
              >
                <button
                  type="button"
                  onClick={() => setVariationCount((v) => Math.max(1, v - 1))}
                  className="p-1 hover:text-white transition-colors cursor-pointer"
                  aria-label="Fewer versions"
                >
                  <Minus className="w-2.5 h-2.5" />
                </button>
                <span className="px-1.5 font-mono font-bold text-[11px] text-white">{variationCount}</span>
                <button
                  type="button"
                  onClick={() => setVariationCount((v) => Math.min(MAX_VARIATIONS, v + 1))}
                  className="p-1 hover:text-white transition-colors cursor-pointer"
                  aria-label="More versions"
                >
                  <Plus className="w-2.5 h-2.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Reference slots + Generate */}
          <div className="flex items-center gap-2 shrink-0">
            <RefSlot
              label="MODEL"
              image={selectedAvatar?.avatarUrl}
              name={selectedAvatar?.name}
              onAdd={() => setIsAvatarModalOpen(true)}
              onClear={() => setSelectedAvatar(null)}
            />
            <RefSlot
              label="PRODUCT"
              image={selectedProduct?.image}
              name={selectedProduct?.name}
              required={!!selectedPreset}
              onAdd={() => setIsProductModalOpen(true)}
              onClear={() => setSelectedProduct(null)}
            />

            <button
              type="button"
              onClick={onGenerate}
              disabled={isSubmitting || isVideo}
              className="h-16 sm:h-20 px-5 sm:px-7 rounded-2xl bg-[#E2FE52] hover:bg-[#D4FF00] text-black font-black flex flex-col items-center justify-center transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] shadow-[0_0_30px_rgba(226,254,82,0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 select-none cursor-pointer shrink-0"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-[10px] font-mono font-bold mt-0.5">{submitLabel || 'Starting…'}</span>
                </>
              ) : (
                <>
                  <span className="text-xs sm:text-sm tracking-wider uppercase font-black">{isVideo ? 'SOON' : 'GENERATE'}</span>
                  <span className="text-[10px] sm:text-[11px] font-mono font-bold text-neutral-800">
                    {variationCount}× {resolution.toUpperCase()}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <ProductSelectorModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onSelectProduct={(prod) => setSelectedProduct(prod)}
        selectedProduct={selectedProduct}
      />
      <AvatarSelectorModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        onSelectAvatar={(av) => setSelectedAvatar(av)}
        selectedAvatar={selectedAvatar}
      />
    </>
  );
}

function RefSlot({
  label,
  image,
  name,
  required,
  onAdd,
  onClear,
}: {
  label: string;
  image?: string;
  name?: string;
  required?: boolean;
  onAdd: () => void;
  onClear: () => void;
}) {
  if (image) {
    return (
      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border border-[#D4FF00]/60 bg-black/60">
        <img src={image} alt={name || label} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-end p-1">
          <span className="text-[8px] font-bold text-white truncate max-w-full">{name}</span>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="absolute top-1 right-1 p-0.5 rounded-full bg-black/80 text-white hover:text-rose-400 cursor-pointer"
          aria-label={`Remove ${label.toLowerCase()}`}
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    );
  }
  return (
    <button
      type="button"
      onClick={onAdd}
      className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border flex flex-col items-center justify-center gap-1 text-neutral-400 hover:text-white transition-all cursor-pointer group ${
        required ? 'border-[#D4FF00]/50 animate-pulse' : 'border-white/10 hover:border-white/20'
      }`}
    >
      <div className="w-5 h-5 rounded-full border border-neutral-500 group-hover:border-white flex items-center justify-center">
        <Plus className="w-3 h-3" />
      </div>
      <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider">{label}</span>
    </button>
  );
}
