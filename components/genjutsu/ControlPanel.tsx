"use client"

import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Video,
  User,
  Shirt,
  Box,
  Pencil,
  ChevronRight,
  UploadCloud,
  X,
  Plus,
  Sparkles,
  Loader2,
  Layers,
  CircleDot,
  Check
} from 'lucide-react';
import Link from 'next/link';
import { ModelOption, MOTION_SWAP_CREDITS_PER_SECOND, isFreeRender, motionSwapPrice } from './genjutsuData';
import type { ReferenceVideoState } from './GenjutsuStudio';
import type { MotionSwapPlan } from '@/lib/ai-jobs-client';

export interface UploadedFile {
  id: string;
  name: string;
  url: string;
  duration?: string;
  size?: string;
  /** The picked file, uploaded when Generate is pressed. */
  file?: File;
}

export function ControlPanel({
  activeTab,
  setActiveTab,
  mode,
  setMode,
  selectedModel,
  onOpenModelPicker,
  referenceVideo,
  onPickVideo,
  onClearVideo,
  characterImages,
  setCharacterImages,
  promptEnabled,
  setPromptEnabled,
  prompt,
  setPrompt,
  quality,
  setQuality,
  isGenerating,
  generationProgress,
  generationStage,
  generateError,
  needsPro,
  plan,
  onGenerate,
}: {
  activeTab: 'create' | 'edit' | 'motion-control';
  setActiveTab: (tab: 'create' | 'edit' | 'motion-control') => void;
  mode: 'motion-transfer' | 'objects-swap';
  setMode: (mode: 'motion-transfer' | 'objects-swap') => void;
  selectedModel: ModelOption;
  onOpenModelPicker: () => void;
  referenceVideo: ReferenceVideoState | null;
  onPickVideo: (file: File) => void;
  onClearVideo: () => void;
  characterImages: UploadedFile[];
  setCharacterImages: React.Dispatch<React.SetStateAction<UploadedFile[]>>;
  promptEnabled: boolean;
  setPromptEnabled: (enabled: boolean) => void;
  prompt: string;
  setPrompt: (prompt: string) => void;
  quality: string;
  setQuality: (quality: string) => void;
  isGenerating: boolean;
  generationProgress: number;
  generationStage: string;
  generateError: string | null;
  needsPro: boolean;
  plan: MotionSwapPlan | null;
  onGenerate: () => void;
}) {
  const freeRender = !!referenceVideo && isFreeRender(plan, referenceVideo.seconds);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Video: checked (type, size, 4–30 s) and uploaded by the studio.
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (file) onPickVideo(file);
  };

  // Image upload handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newImages: UploadedFile[] = Array.from(files)
        .filter((file) => /^image\/(png|jpeg|webp)$/.test(file.type))
        .slice(0, 30 - characterImages.length)
        .map((file, idx) => ({
          id: `img-${Date.now()}-${idx}`,
          name: file.name,
          url: URL.createObjectURL(file),
          file,
        }));
      setCharacterImages(prev => [...prev, ...newImages]);
    }
    e.target.value = '';
  };

  const removeImage = (id: string) => {
    setCharacterImages(prev => prev.filter(img => img.id !== id));
  };

  return (
    <div className="w-full lg:w-[350px] xl:w-[380px] flex-shrink-0 bg-[#0d0f14] border-r border-white/[0.08] flex flex-col h-full overflow-y-auto select-none">
      
      {/* 1. Top Tabs (Create Video | Edit Video | Motion Control) */}
      <div className="px-5 pt-4 pb-3 flex items-center gap-6 border-b border-white/[0.06] text-xs">
        <button
          onClick={() => setActiveTab('create')}
          className={`relative pb-2 font-medium transition-colors ${
            activeTab === 'create' ? 'text-white font-semibold' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Create Video
          {activeTab === 'create' && (
            <motion.div
              layoutId="topTabIndicator"
              className="absolute bottom-0 left-0 right-0 h-[2px] bg-white rounded-full"
            />
          )}
        </button>

        <button
          onClick={() => setActiveTab('edit')}
          className={`relative pb-2 font-medium transition-colors ${
            activeTab === 'edit' ? 'text-white font-semibold' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Edit Video
          {activeTab === 'edit' && (
            <motion.div
              layoutId="topTabIndicator"
              className="absolute bottom-0 left-0 right-0 h-[2px] bg-white rounded-full"
            />
          )}
        </button>

        <button
          onClick={() => setActiveTab('motion-control')}
          className={`relative pb-2 font-medium transition-colors ${
            activeTab === 'motion-control' ? 'text-white font-semibold' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Motion Control
          {activeTab === 'motion-control' && (
            <motion.div
              layoutId="topTabIndicator"
              className="absolute bottom-0 left-0 right-0 h-[2px] bg-white rounded-full"
            />
          )}
        </button>
      </div>

      <div className="p-4 sm:p-5 flex-1 flex flex-col gap-4">
        
        {/* 2. Model Engine Banner Card */}
        <div className="relative rounded-2xl overflow-hidden border border-white/10 group shadow-lg bg-[#141720]">
          {/* Background image & gradient overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src="/images/genjutsu/preset-black-suits.png"
              alt="Higgsfield Genjutsu Background"
              className="w-full h-full object-cover object-center opacity-45 brightness-90 group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0e1017] via-[#0e1017]/60 to-black/30" />
          </div>

          <div className="relative z-10 p-3.5 flex items-start justify-between min-h-[76px]">
            <div>
              <h2 className="text-[#d4f634] font-extrabold text-[15px] tracking-wide uppercase drop-shadow-sm">
                HIGGSFIELD GENJUTSU
              </h2>
              <p className="text-zinc-300 text-xs mt-0.5 font-medium tracking-tight">
                Reality manipulation
              </p>
            </div>

            <button
              onClick={onOpenModelPicker}
              className="px-2.5 py-1 rounded-full bg-black/60 hover:bg-black/90 border border-white/15 text-white text-[11px] font-medium flex items-center gap-1.5 backdrop-blur-md transition-all hover:border-white/30"
            >
              <Pencil className="w-3 h-3 text-zinc-300" />
              Change
            </button>
          </div>
        </div>

        {/* 3. Mode Toggle Pills (Motion transfer | Objects swap) */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-white/[0.03] border border-white/[0.08] rounded-xl text-xs font-medium">
          <button
            onClick={() => setMode('motion-transfer')}
            className={`py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all ${
              mode === 'motion-transfer'
                ? 'bg-white/10 border border-white/20 text-white shadow-sm font-semibold'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <CircleDot className={`w-3.5 h-3.5 ${mode === 'motion-transfer' ? 'text-[#d4f634]' : 'text-zinc-500'}`} />
            Motion transfer
          </button>

          <button
            onClick={() => setMode('objects-swap')}
            className={`py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all ${
              mode === 'objects-swap'
                ? 'bg-white/10 border border-white/20 text-white shadow-sm font-semibold'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Layers className={`w-3.5 h-3.5 ${mode === 'objects-swap' ? 'text-[#d4f634]' : 'text-zinc-500'}`} />
            Objects swap
          </button>
        </div>

        {/* 4. Dropzone 1: Reference Video */}
        <div className="flex flex-col gap-1.5">
          <input
            type="file"
            ref={videoInputRef}
            accept="video/mp4,video/quicktime"
            onChange={handleVideoUpload}
            className="hidden"
          />

          {referenceVideo ? (
            <div className="relative rounded-2xl border border-white/20 bg-white/[0.04] p-3 flex items-center gap-3 group">
              <div className="w-16 h-12 rounded-lg bg-black overflow-hidden relative shrink-0 border border-white/10">
                {/\.(mp4|mov)$/i.test(referenceVideo.url) || referenceVideo.url.startsWith('blob:') ? (
                  <video
                    src={referenceVideo.url}
                    className="w-full h-full object-cover"
                    muted
                    loop
                    autoPlay
                  />
                ) : (
                  <img
                    src={referenceVideo.url}
                    alt="Reference preview"
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-black/20" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-white truncate max-w-[170px]">
                    {referenceVideo.name}
                  </p>
                  <button
                    onClick={onClearVideo}
                    disabled={isGenerating}
                    className="text-zinc-400 hover:text-white p-1 disabled:opacity-40"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-zinc-400 mt-0.5">
                  <span className="font-mono text-[#d4f634]">{referenceVideo.duration}</span>
                  <span>•</span>
                  {referenceVideo.status === 'uploading' && (
                    <span>Uploading… {Math.round(referenceVideo.progress * 100)}%</span>
                  )}
                  {referenceVideo.status === 'ready' && <span className="text-emerald-400">Ready</span>}
                  {referenceVideo.status === 'error' && <span className="text-red-400">Upload failed</span>}
                </div>
                {referenceVideo.status === 'uploading' && (
                  <div className="mt-1.5 h-1 w-full bg-black/40 rounded-full overflow-hidden">
                    <div className="h-full bg-[#d4f634] transition-all" style={{ width: `${Math.round(referenceVideo.progress * 100)}%` }} />
                  </div>
                )}
                {referenceVideo.status === 'error' && referenceVideo.error && (
                  <p className="mt-1 text-[10px] text-red-300 leading-snug">{referenceVideo.error}</p>
                )}
              </div>
            </div>
          ) : (
            <div
              onClick={() => !isGenerating && videoInputRef.current?.click()}
              className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] hover:border-white/30 hover:bg-white/[0.04] transition-all cursor-pointer p-6 flex flex-col items-center justify-center text-center group"
            >
              <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-300 group-hover:text-white group-hover:scale-110 transition-transform mb-2">
                <Video className="w-4 h-4" />
              </div>
              <p className="text-xs font-medium text-white group-hover:text-zinc-100 transition-colors">
                {mode === 'motion-transfer' ? 'Add a reference video to extract motion' : 'Add target video to edit'}
              </p>
              <p className="text-[11px] text-zinc-500 mt-1">
                MP4 or MOV · 4–30 seconds · up to 200 MB
              </p>
            </div>
          )}
        </div>

        {/* 5. Dropzone 2: Characters, Products, or Clothes */}
        <div className="flex flex-col gap-1.5">
          <input
            type="file"
            ref={imageInputRef}
            multiple
            accept="image/png,image/jpeg,image/webp"
            onChange={handleImageUpload}
            className="hidden"
          />

          {characterImages.length > 0 ? (
            <div className="rounded-2xl border border-white/15 bg-white/[0.02] p-3 flex flex-col gap-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-300 font-medium">Selected Subjects</span>
                <span className="text-[10px] font-mono text-zinc-400 bg-white/5 px-2 py-0.5 rounded-full">
                  {characterImages.length} / 30 images
                </span>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1 pr-1">
                {characterImages.map((img) => (
                  <div key={img.id} className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-white/15 group">
                    <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                    <button
                      onClick={() => !isGenerating && removeImage(img.id)}
                      className="absolute top-1 right-1 p-0.5 rounded-full bg-black/80 text-white hover:bg-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}

                {characterImages.length < 30 && (
                  <button
                    onClick={() => imageInputRef.current?.click()}
                    className="w-14 h-14 rounded-lg border border-dashed border-white/20 bg-white/[0.02] hover:bg-white/[0.06] flex items-center justify-center text-zinc-400 hover:text-white shrink-0 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div
              onClick={() => imageInputRef.current?.click()}
              className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] hover:border-white/30 hover:bg-white/[0.04] transition-all cursor-pointer p-6 flex flex-col items-center justify-center text-center group"
            >
              {/* 3 Icons in a row */}
              <div className="flex items-center gap-2 mb-2.5">
                <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors">
                  <User className="w-3.5 h-3.5" />
                </div>
                <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors">
                  <Shirt className="w-3.5 h-3.5" />
                </div>
                <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors">
                  <Box className="w-3.5 h-3.5" />
                </div>
              </div>

              <p className="text-xs font-medium text-white group-hover:text-zinc-100 transition-colors">
                {mode === 'motion-transfer' ? 'Add your characters, products, or clothes' : 'Add replacement objects or materials'}
              </p>
              <p className="text-[11px] text-zinc-500 mt-1">
                Up to 30 images
              </p>
            </div>
          )}
        </div>

        {/* 6. Prompt Toggle & Input */}
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.015] p-3 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-300">Prompt</span>
            <button
              onClick={() => setPromptEnabled(!promptEnabled)}
              className={`w-9 h-5 rounded-full transition-colors relative flex items-center px-0.5 ${
                promptEnabled ? 'bg-[#d4f634]' : 'bg-white/20'
              }`}
            >
              <motion.div
                animate={{ x: promptEnabled ? 16 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className={`w-4 h-4 rounded-full ${promptEnabled ? 'bg-black' : 'bg-white'}`}
              />
            </button>
          </div>

          <AnimatePresence>
            {promptEnabled && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden pt-1"
              >
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe character features, lighting, fabric physics or environment (optional)..."
                  rows={2}
                  className="w-full text-xs bg-black/40 border border-white/10 rounded-lg p-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-[#d4f634] resize-none"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 7. Settings Rows: Model & Quality */}
        <div className="flex flex-col gap-2 pt-1 text-xs">
          {/* Model Row */}
          <div
            onClick={onOpenModelPicker}
            className="flex items-center justify-between py-2 px-3 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] transition-colors cursor-pointer"
          >
            <span className="text-zinc-400 font-medium">Model</span>
            <div className="flex items-center gap-1.5">
              <span className="text-white font-medium text-xs">{selectedModel.name}</span>
              {selectedModel.badge && (
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-[#d4f634] text-black uppercase">
                  {selectedModel.badge}
                </span>
              )}
              <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
            </div>
          </div>

          {/* Quality Row */}
          <div
            onClick={() => setQuality(quality === '720p' ? '480p' : '720p')}
            title="Genjutsu renders at 480p or 720p"
            className="flex items-center justify-between py-2 px-3 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] transition-colors cursor-pointer"
          >
            <span className="text-zinc-400 font-medium">Quality</span>
            <div className="flex items-center gap-1.5">
              <span className="text-white font-medium text-xs">{quality}</span>
              <span className="text-[10px] text-zinc-500 font-mono">
                {MOTION_SWAP_CREDITS_PER_SECOND[quality] ?? 100} cr/s
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
            </div>
          </div>
        </div>

        {/* 8. Generate Button (Neon Lime) */}
        <div className="mt-auto pt-2 flex flex-col gap-2">
          {generateError && !isGenerating && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-[11px] text-red-200 leading-snug">
              {generateError}
              {needsPro && (
                <Link href="/pricing" className="block mt-1 font-semibold text-[#d4f634] hover:underline">
                  {plan && !plan.allowed ? 'See plans →' : 'Get more credits →'}
                </Link>
              )}
            </div>
          )}
          {isGenerating ? (
            <div className="p-3.5 rounded-xl bg-white/[0.05] border border-white/10 flex flex-col gap-2 text-center">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#d4f634] font-medium flex items-center gap-1.5">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  {generationStage}
                </span>
                <span className="font-mono text-white text-[11px]">{generationProgress}%</span>
              </div>
              <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-[#d4f634]"
                  animate={{ width: `${generationProgress}%` }}
                  transition={{ duration: 0.2 }}
                />
              </div>
            </div>
          ) : (
            <button
              onClick={onGenerate}
              disabled={referenceVideo?.status === 'uploading'}
              className="w-full py-3 px-4 rounded-xl bg-[#d4f634] hover:bg-[#cbf11e] active:scale-[0.99] text-black font-bold text-sm tracking-wide transition-all shadow-[0_0_20px_rgba(212,246,52,0.22)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-wait"
            >
              {referenceVideo?.status === 'uploading'
                ? 'Uploading video…'
                : plan && !plan.allowed
                ? `Available with ${plan.upgradeTo} plan`
                : referenceVideo
                ? freeRender
                  ? `Generate · Free (${plan!.freeGensLeft} left this month)`
                  : `Generate · ${motionSwapPrice(referenceVideo.seconds, quality).toLocaleString('en-IN')} credits`
                : 'Generate'}
            </button>
          )}
          <p className="text-[10px] text-zinc-500 text-center leading-snug">
            {MOTION_SWAP_CREDITS_PER_SECOND['720p']} credits/sec at 720p · {MOTION_SWAP_CREDITS_PER_SECOND['480p']} at 480p
            (min 4 s).{' '}
            {plan && plan.allowed && plan.freeGensPerMonth > 0
              ? `Your ${plan.label} plan includes ${plan.freeGensPerMonth} free renders a month for videos up to ${plan.freeMaxSeconds} s (${plan.freeGensLeft} left). `
              : plan && !plan.allowed
              ? `Included with the ${plan.upgradeTo} plan and above. `
              : ''}
            Failed renders are refunded. Renders take a few minutes — finished videos appear in History.
          </p>
        </div>

      </div>
    </div>
  );
}
