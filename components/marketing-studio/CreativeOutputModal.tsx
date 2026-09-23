"use client"

import React, { useState } from 'react';
import {
  X,
  Download,
  Share2,
  Copy,
  Check,
  Sparkles,
  Maximize2,
  ExternalLink,
  Layers,
  Smartphone,
  Square,
  Monitor,
  RectangleVertical,
} from 'lucide-react';
import { DemoProduct, DemoAvatar } from './marketingStudioData';

export interface GeneratedCreative {
  id: string;
  headline: string;
  tagline: string;
  badgeText: string;
  ctaText: string;
  adCopy: string;
  hashtags: string[];
  productName: string;
  productImage: string;
  avatarUrl?: string;
  avatarName?: string;
  themeGradient: string;
  accentColor: string;
  aspectRatio: string;
  stylePreset: string;
  createdAt: string;
}

interface CreativeOutputModalProps {
  isOpen: boolean;
  onClose: () => void;
  creative: GeneratedCreative | null;
  onOpenInPhotoLite?: () => void;
}

export function CreativeOutputModal({
  isOpen,
  onClose,
  creative,
  onOpenInPhotoLite,
}: CreativeOutputModalProps) {
  const [selectedRatio, setSelectedRatio] = useState<string>(creative?.aspectRatio || '3:4');
  const [headline, setHeadline] = useState(creative?.headline || 'CRISP. FRESH. UNSTOPPABLE.');
  const [badgeText, setBadgeText] = useState(creative?.badgeText || 'TRY NOW');
  const [ctaText, setCtaText] = useState(creative?.ctaText || 'ORDER TODAY');
  const [isCopied, setIsCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Sync state when creative changes
  React.useEffect(() => {
    if (creative) {
      setHeadline(creative.headline);
      setBadgeText(creative.badgeText);
      setCtaText(creative.ctaText);
      setSelectedRatio(creative.aspectRatio);
    }
  }, [creative]);

  if (!isOpen || !creative) return null;

  const handleCopyCopy = () => {
    const textToCopy = `${headline}\n\n${creative.adCopy}\n\n${creative.hashtags.join(' ')}`;
    navigator.clipboard.writeText(textToCopy);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownload = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      // Trigger mockup download
      const link = document.createElement('a');
      link.download = `vio-studio-${creative.productName.toLowerCase().replace(/\s+/g, '-')}-ad.png`;
      link.href = creative.productImage;
      link.target = '_blank';
      link.click();
    }, 1000);
  };

  // Determine aspect ratio class
  const getRatioContainerStyle = () => {
    switch (selectedRatio) {
      case '1:1':
        return 'aspect-square max-w-[420px]';
      case '9:16':
        return 'aspect-[9/16] max-w-[340px]';
      case '16:9':
        return 'aspect-[16/9] max-w-[560px]';
      case '3:4':
      default:
        return 'aspect-[3/4] max-w-[380px]';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-[#0C0D12] border border-white/15 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D4FF00] animate-pulse" />
            <span className="text-sm font-bold text-white tracking-wide uppercase">
              ViO Studio • Generated Ad Creative
            </span>
            <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-white/10 text-neutral-300">
              {creative.stylePreset}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content Grid */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
          
          {/* Left Column: Visual Ad Canvas Preview */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center bg-black/50 rounded-2xl p-4 sm:p-6 border border-white/5 relative min-h-[420px]">
            {/* Aspect Ratio Switcher */}
            <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-xl border border-white/10 mb-4 z-20">
              {[
                { id: '3:4', label: '3:4 Poster' },
                { id: '1:1', label: '1:1 Feed' },
                { id: '9:16', label: '9:16 Reel' },
                { id: '16:9', label: '16:9 Banner' },
              ].map((r) => (
                <button
                  key={r.id}
                  onClick={() => setSelectedRatio(r.id)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-tight transition-all cursor-pointer ${
                    selectedRatio === r.id
                      ? 'bg-white/20 text-white shadow'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>

            {/* The Ad Poster Container */}
            <div
              className={`w-full ${getRatioContainerStyle()} rounded-2xl overflow-hidden relative shadow-2xl flex flex-col justify-between p-5 sm:p-6 border border-white/20 transition-all duration-300`}
              style={{
                background: creative.themeGradient || 'linear-gradient(180deg, #1C2404 0%, #34C759 100%)',
              }}
            >
              {/* Halftone / Burst Texture Overlay */}
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1.5px,transparent_1.5px)] [background-size:16px_16px] pointer-events-none" />

              {/* Dynamic Glow */}
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-3xl opacity-40 pointer-events-none"
                style={{ backgroundColor: creative.accentColor || '#D4FF00' }}
              />

              {/* Top Banner / Brand Tag */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-widest text-white drop-shadow-md">
                  {creative.productName}
                </span>

                {/* Badge Sticker */}
                <div className="px-3 py-1 rounded-full bg-white text-black text-[10px] font-black uppercase tracking-wider shadow-lg transform rotate-3">
                  {badgeText}
                </div>
              </div>

              {/* Center Product & Avatar Staging */}
              <div className="relative z-10 my-auto flex flex-col items-center justify-center">
                {/* Product Image with Rim Lighting */}
                <div className="relative max-w-[200px] max-h-[220px] flex items-center justify-center">
                  <img
                    src={creative.productImage}
                    alt={creative.productName}
                    className="max-h-[190px] w-auto object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.6)] hover:scale-105 transition-transform duration-300"
                  />
                  {creative.avatarUrl && (
                    <div className="absolute -bottom-3 -right-3 w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-xl">
                      <img
                        src={creative.avatarUrl}
                        alt="Creator"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>

                {/* Animated Headline */}
                <h3 className="mt-4 text-center font-black tracking-tight text-white uppercase text-xl sm:text-2xl drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] font-sans max-w-xs leading-none">
                  {headline}
                </h3>
              </div>

              {/* Bottom Call-to-Action Bar */}
              <div className="relative z-10 flex items-center justify-between pt-3 border-t border-white/20">
                <span className="text-[10px] font-bold text-white/90 uppercase tracking-widest">
                  Ready to Post
                </span>
                <span className="px-4 py-1.5 rounded-full bg-[#D4FF00] text-black text-[10px] font-black uppercase tracking-wider shadow-lg">
                  {ctaText}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-neutral-400 mt-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#D4FF00]" />
              Generated with commercial studio lighting, raytraced shadows, and high-CTR layout.
            </p>
          </div>

          {/* Right Column: Copywriting, Text Overlays & Export Options */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-5">
            
            {/* Live Text Customizer */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#D4FF00]" />
                Live Ad Overlay Customizer
              </h4>

              <div>
                <label className="text-[11px] font-medium text-neutral-400 block mb-1">
                  Ad Headline Text
                </label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs outline-none focus:border-[#D4FF00]/60"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-medium text-neutral-400 block mb-1">
                    Sticker Badge
                  </label>
                  <input
                    type="text"
                    value={badgeText}
                    onChange={(e) => setBadgeText(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs outline-none focus:border-[#D4FF00]/60"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-neutral-400 block mb-1">
                    CTA Button
                  </label>
                  <input
                    type="text"
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs outline-none focus:border-[#D4FF00]/60"
                  />
                </div>
              </div>
            </div>

            {/* AI Generated Social Copy & Caption */}
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Ready-to-Post Copy & Tags
                  </h4>
                  <button
                    onClick={handleCopyCopy}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#D4FF00] hover:underline cursor-pointer"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isCopied ? "Copied!" : "Copy Caption"}</span>
                  </button>
                </div>

                <p className="text-xs text-neutral-300 leading-relaxed bg-black/30 p-3 rounded-xl border border-white/5 mb-3 font-sans">
                  {creative.adCopy}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {creative.hashtags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-neutral-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 pt-4 border-t border-white/10 mt-4">
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={isExporting}
                  className="w-full py-3 rounded-xl bg-[#D4FF00] hover:bg-[#c2eb00] text-black font-extrabold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,255,0,0.3)] transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>{isExporting ? "Exporting High-Res PNG..." : "Download High-Res Ad"}</span>
                </button>

                <a
                  href="/photolite"
                  className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs tracking-wide flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open & Retouch in PhotoLite</span>
                </a>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
