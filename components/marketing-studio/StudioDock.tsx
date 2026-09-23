"use client"

import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Video,
  Sparkles,
  Box,
  Smartphone,
  Plus,
  Minus,
  ChevronRight,
  X,
  Wand2,
} from 'lucide-react';
import {
  DemoProduct,
  DemoAvatar,
  STYLE_PRESETS,
  SHOT_ANGLES,
  ASPECT_RATIOS,
} from './marketingStudioData';
import { ProductSelectorModal } from './ProductSelectorModal';
import { AvatarSelectorModal } from './AvatarSelectorModal';

interface StudioDockProps {
  mode: 'image' | 'video';
  setMode: (m: 'image' | 'video') => void;
  prompt: string;
  setPrompt: (p: string) => void;
  selectedStyle: string;
  setSelectedStyle: (s: string) => void;
  selectedAngle: string;
  setSelectedAngle: (a: string) => void;
  selectedRatio: string;
  setSelectedRatio: (r: string) => void;
  variationCount: number;
  setVariationCount: React.Dispatch<React.SetStateAction<number>>;
  selectedProduct: DemoProduct | null;
  setSelectedProduct: (p: DemoProduct | null) => void;
  selectedAvatar: DemoAvatar | null;
  setSelectedAvatar: (a: DemoAvatar | null) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export function StudioDock({
  mode,
  setMode,
  prompt,
  setPrompt,
  selectedStyle,
  setSelectedStyle,
  selectedAngle,
  setSelectedAngle,
  selectedRatio,
  setSelectedRatio,
  variationCount,
  setVariationCount,
  selectedProduct,
  setSelectedProduct,
  selectedAvatar,
  setSelectedAvatar,
  onGenerate,
  isGenerating,
}: StudioDockProps) {
  const [isStyleMenuOpen, setIsStyleMenuOpen] = useState(false);
  const [isAngleMenuOpen, setIsAngleMenuOpen] = useState(false);
  const [isRatioMenuOpen, setIsRatioMenuOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  const currentStyleObj = STYLE_PRESETS.find((s) => s.name === selectedStyle) || STYLE_PRESETS[0];
  const currentAngleObj = SHOT_ANGLES.find((a) => a.name === selectedAngle) || SHOT_ANGLES[0];

  return (
    <>
      <div className="w-full max-w-6xl mx-auto px-3 sm:px-6 relative z-30">
        {/* Main Dock Container */}
        <div className="relative bg-[#111217]/95 backdrop-blur-3xl border border-white/[0.12] rounded-3xl p-2.5 sm:p-3.5 shadow-[0_30px_70px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(255,255,255,0.12)] flex flex-col md:flex-row items-stretch md:items-center gap-2.5">
          
          {/* Far Left: Image / Video Mode Switcher */}
          <div className="flex md:flex-col bg-white/[0.04] p-1 rounded-2xl border border-white/5 shrink-0 justify-center">
            <button
              type="button"
              onClick={() => setMode('image')}
              className={`flex-1 md:flex-none flex flex-col items-center justify-center gap-0.5 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl text-[10px] font-bold tracking-tight transition-all cursor-pointer ${
                mode === 'image'
                  ? 'bg-white/15 text-white shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <ImageIcon className={`w-4 h-4 ${mode === 'image' ? 'text-white' : 'text-neutral-400'}`} />
              <span>Image</span>
            </button>

            <button
              type="button"
              onClick={() => setMode('video')}
              className={`flex-1 md:flex-none flex flex-col items-center justify-center gap-0.5 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl text-[10px] font-bold tracking-tight transition-all cursor-pointer ${
                mode === 'video'
                  ? 'bg-white/15 text-white shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Video className={`w-4 h-4 ${mode === 'video' ? 'text-white' : 'text-neutral-400'}`} />
              <span>Video</span>
            </button>
          </div>

          {/* Middle: Input Field & Configuration Chips */}
          <div className="flex-1 flex flex-col justify-between min-w-0 bg-white/[0.02] border border-white/[0.06] rounded-2xl p-2.5 sm:p-3 focus-within:border-white/20 transition-all">
            {/* Prompt Text Input */}
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={
                mode === 'image'
                  ? "Describe what you want to create..."
                  : "Describe motion, camera movement and ad transition..."
              }
              className="w-full bg-transparent text-white text-sm sm:text-base placeholder-neutral-500 outline-none pb-2 tracking-wide font-normal"
            />

            {/* Bottom Row of Controls / Chips */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-1 border-t border-white/5 relative">
              
              {/* Plus Button */}
              <button
                type="button"
                onClick={() => setIsStyleMenuOpen(!isStyleMenuOpen)}
                className="w-7 h-7 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white transition-colors cursor-pointer shrink-0"
                title="Choose Model Preset"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>

              {/* Higgsfield Marketing Studio Model Selector Pill */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setIsStyleMenuOpen(!isStyleMenuOpen);
                    setIsAngleMenuOpen(false);
                    setIsRatioMenuOpen(false);
                  }}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-[11px] font-bold text-white transition-all cursor-pointer select-none"
                >
                  {/* Glowing Lime Squiggly Ribbon */}
                  <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#D4FF00] fill-none stroke-current stroke-[2.8]" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 14c2.5-5 4.5-5 7 0s4.5 5 7 0" />
                  </svg>
                  <span className="font-extrabold tracking-tight">Marketing Studio Image</span>
                  <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
                </button>

                {isStyleMenuOpen && (
                  <div className="absolute bottom-full left-0 mb-2 w-72 bg-[#14161F] border border-white/15 rounded-2xl p-1.5 shadow-2xl z-50 animate-in fade-in slide-in-from-bottom-2">
                    <div className="px-2.5 py-1 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                      Higgsfield AI Models
                    </div>
                    {STYLE_PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => {
                          setSelectedStyle(preset.name);
                          setIsStyleMenuOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-2 rounded-xl text-xs flex items-center justify-between cursor-pointer transition-colors ${
                          selectedStyle === preset.name
                            ? 'bg-[#D4FF00]/15 text-[#D4FF00] font-bold'
                            : 'text-neutral-300 hover:bg-white/5'
                        }`}
                      >
                        <div>
                          <div className="font-bold flex items-center gap-1.5">
                            <span className="text-[#D4FF00]">〰</span>
                            {preset.name}
                          </div>
                          <div className="text-[10px] text-neutral-400 font-normal mt-0.5">{preset.desc}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Angle / Framing Selector */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setIsAngleMenuOpen(!isAngleMenuOpen);
                    setIsStyleMenuOpen(false);
                    setIsRatioMenuOpen(false);
                  }}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-[11px] font-medium text-neutral-200 transition-colors cursor-pointer select-none"
                >
                  <Box className="w-3 h-3 text-neutral-400" />
                  <span>{selectedAngle}</span>
                </button>

                {isAngleMenuOpen && (
                  <div className="absolute bottom-full left-0 mb-2 w-56 bg-[#14161F] border border-white/15 rounded-2xl p-1.5 shadow-2xl z-50 animate-in fade-in slide-in-from-bottom-2">
                    <div className="px-2.5 py-1 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                      Camera Angle & Framing
                    </div>
                    {SHOT_ANGLES.map((angle) => (
                      <button
                        key={angle.id}
                        type="button"
                        onClick={() => {
                          setSelectedAngle(angle.name);
                          setIsAngleMenuOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs flex items-center justify-between cursor-pointer transition-colors ${
                          selectedAngle === angle.name
                            ? 'bg-[#D4FF00]/15 text-[#D4FF00] font-bold'
                            : 'text-neutral-300 hover:bg-white/5'
                        }`}
                      >
                        <div>
                          <div>{angle.name}</div>
                          <div className="text-[10px] text-neutral-400 font-normal">{angle.desc}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Aspect Ratio Selector */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setIsRatioMenuOpen(!isRatioMenuOpen);
                    setIsStyleMenuOpen(false);
                    setIsAngleMenuOpen(false);
                  }}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-[11px] font-medium text-neutral-200 transition-colors cursor-pointer select-none"
                >
                  <Smartphone className="w-3 h-3 text-neutral-400" />
                  <span>{selectedRatio}</span>
                </button>

                {isRatioMenuOpen && (
                  <div className="absolute bottom-full left-0 mb-2 w-52 bg-[#14161F] border border-white/15 rounded-2xl p-1.5 shadow-2xl z-50 animate-in fade-in slide-in-from-bottom-2">
                    <div className="px-2.5 py-1 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                      Aspect Ratio
                    </div>
                    {ASPECT_RATIOS.map((ratio) => (
                      <button
                        key={ratio.id}
                        type="button"
                        onClick={() => {
                          setSelectedRatio(ratio.id);
                          setIsRatioMenuOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs flex items-center justify-between cursor-pointer transition-colors ${
                          selectedRatio === ratio.id
                            ? 'bg-[#D4FF00]/15 text-[#D4FF00] font-bold'
                            : 'text-neutral-300 hover:bg-white/5'
                        }`}
                      >
                        <span>{ratio.name}</span>
                        <span className="font-mono text-[10px] text-neutral-400">{ratio.id}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Variations Counter (- 1 +) */}
              <div className="inline-flex items-center bg-white/[0.05] border border-white/10 rounded-full px-1.5 py-0.5 text-xs text-neutral-300">
                <button
                  type="button"
                  onClick={() => setVariationCount((prev) => Math.max(1, prev - 1))}
                  className="p-1 hover:text-white transition-colors cursor-pointer"
                >
                  <Minus className="w-2.5 h-2.5" />
                </button>
                <span className="px-1.5 font-mono font-bold text-[11px] text-white">
                  {variationCount}
                </span>
                <button
                  type="button"
                  onClick={() => setVariationCount((prev) => Math.min(4, prev + 1))}
                  className="p-1 hover:text-white transition-colors cursor-pointer"
                >
                  <Plus className="w-2.5 h-2.5" />
                </button>
              </div>

            </div>
          </div>

          {/* Right: Reference Slots (+ AVATAR, + PRODUCT) & GENERATE Button */}
          <div className="flex items-center gap-2 shrink-0">
            {/* AVATAR Reference Slot */}
            <div className="relative">
              {selectedAvatar ? (
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border border-[#D4FF00]/60 bg-black/60 group">
                  <img
                    src={selectedAvatar.avatarUrl}
                    alt={selectedAvatar.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-end p-1">
                    <span className="text-[8px] font-bold text-white truncate max-w-full">
                      {selectedAvatar.name}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedAvatar(null)}
                    className="absolute top-1 right-1 p-0.5 rounded-full bg-black/80 text-white hover:text-rose-400"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsAvatarModalOpen(true)}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 flex flex-col items-center justify-center gap-1 text-neutral-400 hover:text-white transition-all cursor-pointer group"
                >
                  <div className="w-5 h-5 rounded-full border border-neutral-500 group-hover:border-white flex items-center justify-center">
                    <Plus className="w-3 h-3" />
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider">
                    AVATAR
                  </span>
                </button>
              )}
            </div>

            {/* PRODUCT Reference Slot */}
            <div className="relative">
              {selectedProduct ? (
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border border-[#D4FF00]/60 bg-black/60 group">
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-end p-1">
                    <span className="text-[8px] font-bold text-white truncate max-w-full">
                      {selectedProduct.name}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="absolute top-1 right-1 p-0.5 rounded-full bg-black/80 text-white hover:text-rose-400"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(true)}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 flex flex-col items-center justify-center gap-1 text-neutral-400 hover:text-white transition-all cursor-pointer group"
                >
                  <div className="w-5 h-5 rounded-full border border-neutral-500 group-hover:border-white flex items-center justify-center">
                    <Plus className="w-3 h-3" />
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider">
                    PRODUCT
                  </span>
                </button>
              )}
            </div>

            {/* Neon Action Button: GENERATE ✦ 4 */}
            <button
              type="button"
              onClick={onGenerate}
              disabled={isGenerating}
              className="h-16 sm:h-20 px-5 sm:px-7 rounded-2xl bg-[#E2FE52] hover:bg-[#D4FF00] text-black font-black flex flex-col items-center justify-center transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] shadow-[0_0_30px_rgba(226,254,82,0.4)] disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer shrink-0"
            >
              <span className="text-xs sm:text-sm tracking-wider uppercase font-black">
                {isGenerating ? "CREATING..." : "GENERATE"}
              </span>
              <span className="text-[10px] sm:text-[11px] font-mono font-bold flex items-center gap-1 text-neutral-800">
                ✦ {variationCount * 4}
              </span>
            </button>

          </div>

        </div>
      </div>

      {/* Selector Modals */}
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
