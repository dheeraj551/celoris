"use client"

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  History,
  Sparkles,
  HelpCircle,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Users,
  Check,
  ChevronLeft,
  ChevronRight,
  Eye,
  Heart,
  Sliders,
  Flame,
  ArrowRight
} from 'lucide-react';
import { PRESET_MOTIONS, PresetMotion } from './genjutsuData';

export function MainStage({
  activeHeroVideo,
  setActiveHeroVideo,
  selectedPresetId,
  onSelectPreset,
  onOpenHistory,
  onOpenLibrary,
  onOpenHowItWorks,
  balance = null,
}: {
  activeHeroVideo: PresetMotion;
  setActiveHeroVideo: (preset: PresetMotion) => void;
  selectedPresetId: string | null;
  onSelectPreset: (preset: PresetMotion) => void;
  onOpenHistory: () => void;
  onOpenLibrary: () => void;
  onOpenHowItWorks: () => void;
  /** Real wallet balance (hidden until known). */
  balance?: number | null;
}) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [categoryTab, setCategoryTab] = useState<'higgsfield' | 'community'>('community');
  const [motionFilter, setMotionFilter] = useState<string>('all');
  const [showSkeletonTrack, setShowSkeletonTrack] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(50);
  const videoRef = useRef<HTMLVideoElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const filteredPresets = PRESET_MOTIONS.filter((p) => {
    if (categoryTab === 'higgsfield' && p.category !== 'higgsfield') return false;
    if (categoryTab === 'community' && p.category !== 'community') return false;
    if (motionFilter !== 'all' && p.motionType !== motionFilter) return false;
    return true;
  });

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const offset = direction === 'left' ? -300 : 300;
      carouselRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0a0b0e] overflow-y-auto select-none relative">
      
      {/* 1. Top Sub-Navigation Header */}
      <div className="w-full px-6 py-3 flex items-center justify-between border-b border-white/[0.04] bg-[#0a0b0e]/80 backdrop-blur-md sticky top-0 z-20">
        
        {/* Left Subnav Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-all cursor-pointer"
          >
            <History className="w-3.5 h-3.5" />
            <span>History</span>
          </button>

          <button
            onClick={onOpenLibrary}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-white bg-white/[0.08] border border-white/15 hover:bg-white/[0.12] transition-all cursor-pointer shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#d4f634]" />
            <span>Motion Library</span>
          </button>

          <button
            onClick={onOpenHowItWorks}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-all cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>How it works</span>
          </button>
        </div>

        {/* Right: the user's real wallet balance */}
        <div className="flex items-center gap-3">
          {balance !== null && (
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono text-zinc-300">
              <span className="w-2 h-2 rounded-full bg-[#d4f634] shadow-[0_0_8px_#d4f634]" />
              <span>{balance.toLocaleString('en-IN')} Credits</span>
            </div>
          )}
        </div>
      </div>

      {/* 2. Main Showcase Hero Area */}
      <div className="flex-1 flex flex-col items-center justify-start p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full">
        
        {/* Large Rounded Cinematic Video Viewport */}
        <div className="w-full max-w-2xl lg:max-w-3xl aspect-[16/9] rounded-2xl overflow-hidden bg-black border border-white/10 relative shadow-2xl group">
          
          {/* Main Video Element */}
          {activeHeroVideo.videoUrl ? (
            <video
              ref={videoRef}
              src={activeHeroVideo.videoUrl}
              poster={activeHeroVideo.thumbnailUrl}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={activeHeroVideo.thumbnailUrl}
              alt={activeHeroVideo.title}
              className="w-full h-full object-cover"
            />
          )}

          {/* Skeleton Tracking Neural Overlay Simulation (Interactive Feature) */}
          {showSkeletonTrack && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <svg className="w-full h-full stroke-[#d4f634] fill-none opacity-80" viewBox="0 0 100 100">
                <circle cx="50" cy="28" r="4" strokeWidth="0.8" />
                <line x1="50" y1="32" x2="50" y2="55" strokeWidth="1" />
                <line x1="50" y1="38" x2="38" y2="48" strokeWidth="0.8" />
                <line x1="50" y1="38" x2="62" y2="48" strokeWidth="0.8" />
                <line x1="50" y1="55" x2="42" y2="78" strokeWidth="0.8" />
                <line x1="50" y1="55" x2="58" y2="78" strokeWidth="0.8" />
                <circle cx="38" cy="48" r="1.5" fill="#d4f634" />
                <circle cx="62" cy="48" r="1.5" fill="#d4f634" />
                <circle cx="42" cy="78" r="1.5" fill="#d4f634" />
                <circle cx="58" cy="78" r="1.5" fill="#d4f634" />
              </svg>
              <div className="absolute top-4 left-4 px-2 py-0.5 rounded bg-black/75 text-[10px] font-mono text-[#d4f634] border border-[#d4f634]/30 backdrop-blur-md">
                ● 3D POSE LANDMARKS LOCKED
              </div>
            </div>
          )}

          {/* Video Hover Controls Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4">
            
            {/* Top Bar inside Video */}
            <div className="flex items-center justify-between">
              <span className="px-2 py-1 rounded-md bg-black/60 backdrop-blur-md text-white text-[11px] font-medium flex items-center gap-1.5 border border-white/10">
                <span className="w-1.5 h-1.5 rounded-full bg-[#d4f634] animate-pulse" />
                {activeHeroVideo.title}
              </span>

              <button
                onClick={() => setShowSkeletonTrack(!showSkeletonTrack)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all backdrop-blur-md border ${
                  showSkeletonTrack
                    ? 'bg-[#d4f634] text-black border-[#d4f634]'
                    : 'bg-black/60 text-zinc-300 border-white/15 hover:text-white'
                }`}
              >
                {showSkeletonTrack ? 'Hide Motion Mesh' : 'Show Motion Mesh'}
              </button>
            </div>

            {/* Bottom Bar inside Video */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={togglePlay}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center backdrop-blur-md transition-all"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </button>
                <button
                  onClick={toggleMute}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center backdrop-blur-md transition-all"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onSelectPreset(activeHeroVideo)}
                  className="px-3 py-1.5 rounded-lg bg-[#d4f634] hover:bg-[#cbf11e] text-black text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
                >
                  {activeHeroVideo.referenceVideoUrl ? 'Use This Motion' : 'Use This Idea'}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* 3. Hero Text Below Video */}
        <div className="text-center mt-6 max-w-xl">
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
            TURN ONE VIDEO INTO MANY
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-2 leading-relaxed font-normal">
            Take the motion and recast it with your characters, locations, and products, or swap specific elements while keeping the rest untouched.
          </p>
        </div>

        {/* 4. Tab Switcher Pills: Higgsfield | Community */}
        <div className="mt-6 flex items-center justify-center gap-2">
          <div className="p-1 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center">
            
            <button
              onClick={() => setCategoryTab('higgsfield')}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                categoryTab === 'higgsfield'
                  ? 'bg-white text-black font-bold shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#d4f634]" />
              Higgsfield
            </button>

            <button
              onClick={() => setCategoryTab('community')}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                categoryTab === 'community'
                  ? 'bg-white text-black font-bold shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-black" />
              Community
            </button>

          </div>
        </div>

        {/* 5. Presets Carousel / Shelf */}
        <div className="w-full mt-6 relative">
          
          {/* Scroll arrows */}
          <button
            onClick={() => scrollCarousel('left')}
            className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-black/80 border border-white/20 text-white flex items-center justify-center hover:bg-black transition-all shadow-lg"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scrollCarousel('right')}
            className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-black/80 border border-white/20 text-white flex items-center justify-center hover:bg-black transition-all shadow-lg"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Cards Carousel Container */}
          <div
            ref={carouselRef}
            className="flex items-center gap-3 overflow-x-auto pb-4 pt-1 px-1 scrollbar-none snap-x"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {PRESET_MOTIONS.map((preset) => {
              const isSelected = selectedPresetId === preset.id;
              const isCurrentHero = activeHeroVideo.id === preset.id;

              return (
                <div
                  key={preset.id}
                  onClick={() => {
                    setActiveHeroVideo(preset);
                    onSelectPreset(preset);
                  }}
                  className={`relative w-[210px] sm:w-[230px] shrink-0 rounded-2xl overflow-hidden border transition-all cursor-pointer group bg-[#111319] snap-start ${
                    isSelected
                      ? 'border-[#d4f634] ring-2 ring-[#d4f634]/30 shadow-[0_0_20px_rgba(212,246,52,0.2)]'
                      : isCurrentHero
                      ? 'border-white/40'
                      : 'border-white/10 hover:border-white/30'
                  }`}
                >
                  {/* Thumbnail / Video */}
                  <div className="relative aspect-[16/10] bg-black overflow-hidden">
                    <img
                      src={preset.thumbnailUrl}
                      alt={preset.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                    {/* Duration badge */}
                    <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-mono text-zinc-300 backdrop-blur-sm">
                      {preset.duration}
                    </span>

                    {/* Tag badge */}
                    {preset.badge && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[#d4f634] text-black text-[9px] font-bold uppercase tracking-wider shadow-sm">
                        {preset.badge}
                      </span>
                    )}

                    {/* Hover Play Icon */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                      <div className="w-9 h-9 rounded-full bg-white/90 text-black flex items-center justify-center shadow-lg">
                        <Play className="w-4 h-4 ml-0.5" />
                      </div>
                    </div>
                  </div>

                  {/* Card Meta */}
                  <div className="p-3">
                    <h4 className="text-xs font-semibold text-white group-hover:text-[#d4f634] transition-colors truncate">
                      {preset.title}
                    </h4>
                    <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                      {preset.description}
                    </p>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5 text-[10px] text-zinc-500">
                      <span>{preset.views} views</span>
                      <span className="text-zinc-400 group-hover:text-white font-medium">Use Motion →</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>

    </div>
  );
}
