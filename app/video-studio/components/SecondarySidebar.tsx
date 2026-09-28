"use client";

import React, { useRef, useState } from 'react';
import { 
  Subtitles, 
  Type, 
  Music, 
  Upload, 
  LayoutTemplate, 
  Shapes, 
  FileText, 
  Wand2, 
  ArrowRightLeft, 
  SlidersHorizontal, 
  Plus, 
  Search, 
  Folder, 
  Sparkles,
  Play,
  Pause,
  Check,
  Video,
  Languages,
  Layers,
  Flame,
  Volume2
} from 'lucide-react';
import { Clip, TextElement } from '../page';

export interface VideoTemplate {
  id: string;
  title: string;
  badge: string;
  category: 'all' | 'vio' | 'ugc' | 'product' | 'ads' | 'motion' | 'marketplace';
  tag: '9:16' | '16:9' | '1:1' | '3:4';
  dur: string;
  durationSec: number;
  videoUrl: string;
  thumbnailUrl: string;
  color: string;
  accentColor: string;
  description: string;
  textOverlay?: string;
  isViO?: boolean;
}

export const VIDEO_TEMPLATES: VideoTemplate[] = [
  {
    id: 'vio-ame-kaze',
    title: 'Ame Kaze Green Tea',
    badge: 'PRODUCT',
    category: 'product',
    tag: '9:16',
    dur: '00:06',
    durationSec: 6,
    videoUrl: '/templates/vio/ame-kaze-green-tea.mp4',
    thumbnailUrl: '/templates/vio/ame-kaze-green-tea.jpg',
    color: 'from-emerald-900 to-teal-950',
    accentColor: '#A3C585',
    description: 'Cold-brewed green tea beverage commercial with floating bottle and water ripples',
    textOverlay: 'Ame Kaze Green Tea',
    isViO: true,
  },
  {
    id: 'vio-lightweight-wallet',
    title: 'Leather Wallet Spec Ad',
    badge: 'ADS',
    category: 'ads',
    tag: '9:16',
    dur: '00:05',
    durationSec: 5,
    videoUrl: '/templates/vio/wallet-lightweight-poster.mp4',
    thumbnailUrl: '/templates/vio/wallet-lightweight-poster.jpg',
    color: 'from-blue-900 to-indigo-950',
    accentColor: '#2563EB',
    description: 'Technical spec kinetic typography ad with blue leather wallet',
    textOverlay: 'Total Weight 62g',
    isViO: true,
  },
  {
    id: 'vio-aurum-watch',
    title: 'Aurum Watch Exploded',
    badge: 'MOTION',
    category: 'motion',
    tag: '9:16',
    dur: '00:07',
    durationSec: 7,
    videoUrl: '/templates/vio/watch-exploded-view.mp4',
    thumbnailUrl: '/templates/vio/watch-exploded-view.jpg',
    color: 'from-zinc-800 to-stone-950',
    accentColor: '#E5E7EB',
    description: 'Luxury stainless steel watch 3D exploded engineering view',
    textOverlay: 'Aurum Precision',
    isViO: true,
  },
  {
    id: 'vio-campus-walk',
    title: 'Campus Walk UGC',
    badge: 'UGC',
    category: 'ugc',
    tag: '9:16',
    dur: '00:08',
    durationSec: 8,
    videoUrl: '/templates/vio/campus-walk-ugc.mp4',
    thumbnailUrl: '/templates/vio/campus-walk-ugc.jpg',
    color: 'from-amber-900 to-yellow-950',
    accentColor: '#F59E0B',
    description: 'Golden hour student creator lifestyle walking UGC reel',
    textOverlay: 'Campus Golden Hour',
    isViO: true,
  },
  {
    id: 'vio-podcast-creator',
    title: 'Podcast Creator UGC',
    badge: 'UGC',
    category: 'ugc',
    tag: '9:16',
    dur: '00:07',
    durationSec: 7,
    videoUrl: '/templates/vio/podcast-creator-ugc.mp4',
    thumbnailUrl: '/templates/vio/podcast-creator-ugc.jpg',
    color: 'from-orange-900 to-amber-950',
    accentColor: '#D97706',
    description: 'Talking-head creator testimonial in warm home podcast studio',
    textOverlay: 'Creator Spotlight',
    isViO: true,
  },
  {
    id: 'vio-splash-soda',
    title: 'Splash Sparkling Soda',
    badge: 'ADS',
    category: 'ads',
    tag: '9:16',
    dur: '00:10',
    durationSec: 10,
    videoUrl: '/vid/marketing-studio-slider-poster-Ads.mp4',
    thumbnailUrl: '/templates/template-splash.jpg',
    color: 'from-cyan-900 to-blue-950',
    accentColor: '#38BDF8',
    description: 'Refreshing chilled soda can with bubbles and summer pop vibes',
    textOverlay: 'Splash Sparkling Soda',
    isViO: true,
  },
  {
    id: 'vio-biojus',
    title: 'BioJus Hydration',
    badge: 'PRODUCT',
    category: 'product',
    tag: '9:16',
    dur: '00:10',
    durationSec: 10,
    videoUrl: '/vid/marketing-studio-slider-poster-Product.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1608248597359-57e335272a8c?w=600&auto=format&fit=crop&q=80',
    color: 'from-lime-950 to-emerald-950',
    accentColor: '#B6E324',
    description: 'Amber glass elixir bottle floating in effervescent lime liquid',
    textOverlay: 'BioJus Cellular Formula',
    isViO: true,
  },
  {
    id: 'vio-vessel',
    title: 'Vessel Chili Crunch',
    badge: 'MOTION',
    category: 'motion',
    tag: '9:16',
    dur: '00:10',
    durationSec: 10,
    videoUrl: '/vid/marketing-studio-slider-poster-UGC.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=600&auto=format&fit=crop&q=80',
    color: 'from-sky-950 to-blue-950',
    accentColor: '#38BDF8',
    description: 'Artisanal chili bowl suspended in mid-air with golden tortilla crisps',
    textOverlay: 'Vessel Artisanal Crunch',
    isViO: true,
  },
  {
    id: 'vio-plush',
    title: 'Plush Botanical Wash',
    badge: 'MARKETPLACE',
    category: 'marketplace',
    tag: '9:16',
    dur: '00:10',
    durationSec: 10,
    videoUrl: '/vid/marketing-studio-slider-poster-Marketplace.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80',
    color: 'from-purple-950 to-fuchsia-950',
    accentColor: '#C084FC',
    description: 'Pastel lilac cosmetic pump bottle resting on ethereal foamy clouds',
    textOverlay: 'Plush Botanical Care',
    isViO: true,
  },
  {
    id: 'vio-chase',
    title: 'Chase The Dream',
    badge: 'POSTERS',
    category: 'ads',
    tag: '9:16',
    dur: '00:10',
    durationSec: 10,
    videoUrl: '/vid/marketing-studio-slider-poster-poster.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&auto=format&fit=crop&q=80',
    color: 'from-rose-950 to-pink-950',
    accentColor: '#FF2E93',
    description: 'Avant-garde fashion editorial model illuminated by red neon light trails',
    textOverlay: 'Chase The Dream',
    isViO: true,
  },
  {
    id: 'preset-reel-hook',
    title: 'Viral Reel Hook',
    badge: 'HOOK',
    category: 'ads',
    tag: '9:16',
    dur: '00:07',
    durationSec: 7,
    videoUrl: '/vid/marketing-studio-slider-poster-Ads.mp4',
    thumbnailUrl: '/templates/template-splash.jpg',
    color: 'from-purple-900 to-indigo-950',
    accentColor: '#8B5CF6',
    description: 'High-retention kinetic opener designed to stop scrolling in first 3 seconds',
    textOverlay: 'Wait For The End ⚡',
  },
  {
    id: 'preset-youtube-16-9',
    title: 'YouTube 16:9 Cinema',
    badge: 'CINEMA',
    category: 'motion',
    tag: '16:9',
    dur: '00:15',
    durationSec: 15,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&auto=format&fit=crop&q=80',
    color: 'from-blue-900 to-cyan-950',
    accentColor: '#06B6D4',
    description: 'Widescreen horizontal cinematic template for longform YouTube videos',
    textOverlay: 'Celoris Cinema',
  },
];

interface SecondarySidebarProps {
  activeTab: string;
  setVideoSrc?: React.Dispatch<React.SetStateAction<string>>;
  setVideoName?: React.Dispatch<React.SetStateAction<string>>;
  setDuration?: React.Dispatch<React.SetStateAction<number>>;
  setClips?: React.Dispatch<React.SetStateAction<Clip[]>>;
  currentTime?: number;
  selectedClipId?: string | null;
  videoSrc?: string;
  setTextElement?: React.Dispatch<React.SetStateAction<TextElement>>;
  setAspectRatio?: (ratio: '9:16' | '16:9' | '1:1') => void;
  setCurrentTime?: React.Dispatch<React.SetStateAction<number>>;
}

export default function SecondarySidebar({ 
  activeTab, 
  setVideoSrc, 
  setVideoName, 
  setDuration, 
  setClips, 
  currentTime = 0, 
  selectedClipId,
  videoSrc,
  setTextElement,
  setAspectRatio,
  setCurrentTime,
}: SecondarySidebarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [playingAudioIdx, setPlayingAudioIdx] = useState<number | null>(null);
  const [captionLanguage, setCaptionLanguage] = useState('auto');
  const [isGeneratingCaptions, setIsGeneratingCaptions] = useState(false);
  const [captionsGenerated, setCaptionsGenerated] = useState(false);
  const [templateSearch, setTemplateSearch] = useState('');
  const [templateCategory, setTemplateCategory] = useState<'all' | 'vio' | 'ugc' | 'product' | 'ads' | 'motion'>('all');
  const [appliedTemplateId, setAppliedTemplateId] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      const url = URL.createObjectURL(file);
      if (setVideoSrc) setVideoSrc(url);
      if (setVideoName) setVideoName(file.name);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleAddText = (textValue = 'New Title', color = '#ffffff') => {
    if (setClips) {
      setClips(prev => [
        ...prev,
        {
          id: `text-${Date.now()}`,
          type: 'text',
          start: currentTime,
          end: currentTime + 5,
          content: textValue,
          color: color || '#e67e22',
          trackIndex: 0
        }
      ]);
    }
  };

  const handleAddAudioTrack = (trackName: string, durationSec = 30) => {
    if (setClips) {
      setClips(prev => [
        ...prev,
        {
          id: `audio-${Date.now()}`,
          type: 'audio',
          start: currentTime,
          end: currentTime + durationSec,
          content: trackName,
          color: '#10b981',
          trackIndex: 2
        }
      ]);
    }
  };

  const handleAutoCaptions = () => {
    setIsGeneratingCaptions(true);
    setTimeout(() => {
      setIsGeneratingCaptions(false);
      setCaptionsGenerated(true);
      if (setClips) {
        setClips(prev => [
          ...prev,
          {
            id: `cap-1-${Date.now()}`,
            type: 'text',
            start: 0,
            end: 4,
            content: "Welcome to Celoris Studio",
            color: '#ccff00',
            trackIndex: 0
          },
          {
            id: `cap-2-${Date.now()}`,
            type: 'text',
            start: 4,
            end: 8,
            content: "Turn raw footage into viral videos",
            color: '#ccff00',
            trackIndex: 0
          }
        ]);
      }
    }, 1200);
  };

  const handleApplyTransition = (transitionName: string) => {
    if (setClips && selectedClipId) {
      setClips(prev => prev.map(c =>
        c.id === selectedClipId ? { ...c, transition: transitionName } : c
      ));
    }
  };

  const handleApplyTemplate = (template: VideoTemplate) => {
    if (setVideoSrc) setVideoSrc(template.videoUrl);
    if (setVideoName) setVideoName(template.title);
    if (setDuration) setDuration(template.durationSec);
    if (setCurrentTime) setCurrentTime(0);

    if (setTextElement) {
      setTextElement(prev => ({
        ...prev,
        text: template.textOverlay || template.title
      }));
    }

    if (setAspectRatio) {
      if (template.tag === '16:9') setAspectRatio('16:9');
      else if (template.tag === '1:1') setAspectRatio('1:1');
      else setAspectRatio('9:16');
    }

    if (setClips) {
      setClips(prev => {
        const audioClips = prev.filter(c => c.type === 'audio');
        const newVideoClip: Clip = {
          id: `clip-video-${template.id}-${Date.now()}`,
          type: 'video',
          start: 0,
          end: template.durationSec,
          content: template.title,
          color: template.accentColor || '#ccff00',
          trackIndex: 1
        };
        const newTextClip: Clip = {
          id: `clip-text-${template.id}-${Date.now()}`,
          type: 'text',
          start: 0,
          end: Math.min(template.durationSec, 5),
          content: template.textOverlay || template.title,
          color: '#ffffff',
          trackIndex: 0
        };
        return [newTextClip, newVideoClip, ...audioClips];
      });
    }

    setAppliedTemplateId(template.id);
    setTimeout(() => {
      setAppliedTemplateId(null);
    }, 2500);
  };

  const renderContent = () => {
    switch (activeTab) {
      // -------------------------------------------------------------
      // UPLOAD MEDIA
      // -------------------------------------------------------------
      case 'upload':
        return (
          <div className="p-4 flex flex-col gap-4 h-full">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="video/*,audio/*,image/*"
              className="hidden"
            />
            <button
              onClick={handleUploadClick}
              className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(52,211,153,0.25)]"
            >
              <Upload className="w-4 h-4" />
              Upload Media File
            </button>

            <div 
              onClick={handleUploadClick}
              className="border-2 border-dashed border-white/10 hover:border-emerald-400/40 bg-white/[0.02] rounded-2xl flex flex-col items-center justify-center text-center p-6 text-slate-400 cursor-pointer group transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-white/[0.04] group-hover:bg-emerald-500/10 border border-white/10 flex items-center justify-center mb-3 text-slate-400 group-hover:text-emerald-400 transition-colors">
                <Folder className="w-6 h-6" />
              </div>
              <p className="text-xs font-semibold text-white group-hover:text-emerald-300 transition-colors">
                Drag and drop your footage
              </p>
              <p className="text-[10px] mt-1 text-slate-500">Supports 4K MP4, MOV, WebM, MP3</p>
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Stock Assets</span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { name: 'UGC Reel Ad', url: '/vid/marketing-studio-slider-poster-UGC.mp4' },
                  { name: 'Product Demo', url: '/vid/marketing-studio-slider-poster-Product.mp4' },
                  { name: 'Commercial Cut', url: '/vid/marketing-studio-slider-poster-Ads.mp4' },
                  { name: 'Cinematic Flow', url: '/vid/marketing-studio-slider-poster-Marketplace.mp4' },
                ].map((vid, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      if (setVideoSrc) setVideoSrc(vid.url);
                      if (setVideoName) setVideoName(vid.name);
                    }}
                    className="p-2.5 rounded-xl bg-[#141722] hover:bg-[#1a1f2e] border border-white/5 hover:border-emerald-400/30 text-left transition-all group"
                  >
                    <div className="aspect-video bg-black rounded-lg mb-1.5 overflow-hidden relative">
                      <video src={vid.url} className="w-full h-full object-cover" muted />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="w-4 h-4 text-white fill-white" />
                      </div>
                    </div>
                    <p className="text-[10.5px] font-semibold text-slate-300 group-hover:text-emerald-300 truncate">
                      {vid.name}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      // -------------------------------------------------------------
      // AUTO CAPTIONS & SUBTITLES
      // -------------------------------------------------------------
      case 'captions':
        return (
          <div className="p-4 flex flex-col gap-3.5">
            {/* Auto AI Captions */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#121722] to-[#0d1017] border border-white/10 hover:border-emerald-400/40 transition-all space-y-3 shadow-lg">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white">Auto AI Captions</h3>
                  <p className="text-[10px] text-slate-400">Voice-to-text with auto word timing</p>
                </div>
              </div>

              {/* Language Selector */}
              <div className="flex items-center justify-between text-xs bg-black/40 border border-white/10 rounded-xl px-3 py-1.5">
                <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                  <Languages className="w-3.5 h-3.5" />
                  <span>Language</span>
                </div>
                <select
                  value={captionLanguage}
                  onChange={(e) => setCaptionLanguage(e.target.value)}
                  className="bg-transparent text-white font-semibold text-xs focus:outline-none cursor-pointer"
                >
                  <option value="auto" className="bg-[#12141c]">Auto Detect</option>
                  <option value="en" className="bg-[#12141c]">English (US/UK)</option>
                  <option value="hi" className="bg-[#12141c]">Hindi / Hinglish</option>
                  <option value="es" className="bg-[#12141c]">Spanish</option>
                </select>
              </div>

              <button
                type="button"
                onClick={handleAutoCaptions}
                disabled={isGeneratingCaptions}
                className="w-full py-2 px-3 rounded-xl bg-[#ccff00] hover:bg-[#b8e600] text-black font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm"
              >
                {isGeneratingCaptions ? (
                  <>
                    <Sparkles className="w-3.5 h-3.5 animate-spin" />
                    <span>Transcribing audio...</span>
                  </>
                ) : captionsGenerated ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-black" />
                    <span>Captions Generated!</span>
                  </>
                ) : (
                  <>
                    <Subtitles className="w-3.5 h-3.5" />
                    <span>Generate Captions</span>
                  </>
                )}
              </button>
            </div>

            {/* Manual Captions */}
            <button 
              type="button"
              onClick={() => handleAddText('Subtitle Text', '#ffffff')}
              className="p-3.5 bg-[#131620] hover:bg-[#181c28] border border-white/5 hover:border-white/15 rounded-2xl flex items-center gap-3 text-left transition-all group"
            >
              <div className="w-8 h-8 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                <Type className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors">
                  Manual Subtitles
                </h4>
                <p className="text-[10px] text-slate-400">Add lines manually onto timeline</p>
              </div>
            </button>

            {/* Auto Lyrics */}
            <button 
              type="button"
              onClick={() => handleAddText('Viral Hook Lyric', '#ccff00')}
              className="p-3.5 bg-[#131620] hover:bg-[#181c28] border border-white/5 hover:border-white/15 rounded-2xl flex items-center gap-3 text-left transition-all group"
            >
              <div className="w-8 h-8 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                <Music className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">
                  Kinetic Lyric Sync
                </h4>
                <p className="text-[10px] text-slate-400">Animated words pulsing with beat</p>
              </div>
            </button>
          </div>
        );

      // -------------------------------------------------------------
      // TEMPLATES & PRESETS
      // -------------------------------------------------------------
      case 'templates': {
        const filtered = VIDEO_TEMPLATES.filter((tpl) => {
          const matchesCategory =
            templateCategory === 'all'
              ? true
              : templateCategory === 'vio'
              ? tpl.isViO
              : tpl.category === templateCategory;

          const query = templateSearch.toLowerCase().trim();
          const matchesSearch =
            !query ||
            tpl.title.toLowerCase().includes(query) ||
            tpl.badge.toLowerCase().includes(query) ||
            tpl.description.toLowerCase().includes(query);

          return matchesCategory && matchesSearch;
        });

        const categories: { id: 'all' | 'vio' | 'ugc' | 'product' | 'ads' | 'motion'; label: string }[] = [
          { id: 'all', label: 'All' },
          { id: 'vio', label: 'ViO Studio' },
          { id: 'ugc', label: 'UGC' },
          { id: 'product', label: 'Product' },
          { id: 'ads', label: 'Ads' },
          { id: 'motion', label: 'Motion' },
        ];

        return (
          <div className="p-4 flex flex-col gap-3.5">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={templateSearch}
                onChange={(e) => setTemplateSearch(e.target.value)}
                placeholder="Search viral presets..."
                className="w-full bg-[#131620] border border-white/10 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition-colors"
              />
              {templateSearch && (
                <button
                  type="button"
                  onClick={() => setTemplateSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-[10.5px]">
              {categories.map((cat) => {
                const isActive = templateCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setTemplateCategory(cat.id)}
                    className={`px-2.5 py-1 rounded-lg font-semibold shrink-0 transition-all ${
                      isActive
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_10px_rgba(52,211,153,0.2)]'
                        : 'bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08] border border-white/5'
                    }`}
                  >
                    {cat.id === 'vio' && (
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1 animate-pulse" />
                    )}
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* Applied Feedback Banner */}
            {appliedTemplateId && (
              <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold animate-in fade-in slide-in-from-top-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Template applied to timeline!</span>
              </div>
            )}

            {/* Template Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              {filtered.map((template) => {
                const isCurrent = videoSrc === template.videoUrl;
                return (
                  <div
                    key={template.id}
                    onClick={() => handleApplyTemplate(template)}
                    onMouseEnter={(e) => {
                      const vid = e.currentTarget.querySelector('video');
                      if (vid) {
                        vid.currentTime = 0;
                        vid.play().catch(() => {});
                      }
                    }}
                    onMouseLeave={(e) => {
                      const vid = e.currentTarget.querySelector('video');
                      if (vid) {
                        vid.pause();
                      }
                    }}
                    className={`aspect-[9/16] bg-[#141722] rounded-xl border relative group cursor-pointer overflow-hidden p-2 flex flex-col justify-between transition-all ${
                      isCurrent
                        ? 'border-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.3)] ring-1 ring-emerald-400/50'
                        : 'border-white/10 hover:border-emerald-400/60 hover:shadow-[0_0_12px_rgba(52,211,153,0.2)]'
                    }`}
                  >
                    {/* Background image preview */}
                    <img
                      src={template.thumbnailUrl}
                      alt={template.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Silent hover video preview */}
                    <video
                      src={template.videoUrl}
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    />

                    {/* Gradient shading */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/70 pointer-events-none" />

                    {/* Top tags */}
                    <div className="relative z-10 flex justify-between items-center text-[9px] font-mono font-bold text-white">
                      <div className="flex items-center gap-1">
                        <span className="bg-black/70 backdrop-blur-xs px-1.5 py-0.5 rounded border border-white/15">
                          {template.tag}
                        </span>
                        {template.isViO && (
                          <span className="bg-emerald-500/80 text-black px-1.5 py-0.5 rounded font-black tracking-tight">
                            ViO
                          </span>
                        )}
                      </div>
                      <span className="bg-black/70 backdrop-blur-xs px-1.5 py-0.5 rounded border border-white/15">
                        {template.dur}
                      </span>
                    </div>

                    {/* Hover Play Button Overlay */}
                    <div className="relative z-10 my-auto self-center opacity-0 group-hover:opacity-100 transition-all duration-200 transform scale-90 group-hover:scale-100">
                      <div className="w-8 h-8 rounded-full bg-emerald-400 text-black flex items-center justify-center shadow-[0_0_15px_rgba(52,211,153,0.7)]">
                        <Play className="w-3.5 h-3.5 fill-black translate-x-0.5" />
                      </div>
                    </div>

                    {/* Bottom Title & Category */}
                    <div className="relative z-10">
                      {isCurrent && (
                        <span className="text-[8.5px] font-mono font-bold text-emerald-300 flex items-center gap-1 mb-0.5">
                          <Check className="w-2.5 h-2.5" /> LOADED
                        </span>
                      )}
                      <h5 className="text-[11px] font-bold text-white group-hover:text-emerald-300 transition-colors truncate">
                        {template.title}
                      </h5>
                      <p className="text-[9px] text-slate-400 truncate">
                        {template.badge} • {template.tag}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-8 text-slate-400 text-xs">
                No templates found for &quot;{templateSearch}&quot;
              </div>
            )}
          </div>
        );
      }

      // -------------------------------------------------------------
      // AUDIO LIBRARY
      // -------------------------------------------------------------
      case 'audio':
        return (
          <div className="p-4 flex flex-col gap-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Royalty-Free Audio</span>
              <span className="text-[10px] text-emerald-400 font-mono">0% Copyright Claims</span>
            </div>

            <div className="flex flex-col gap-2">
              {[
                { title: 'Lazy Sunday Lo-Fi', genre: 'Chillhop', duration: 45 },
                { title: 'Viral Phonk Bass', genre: 'Trending', duration: 30 },
                { title: 'Cinematic Ambient Rise', genre: 'Trailer', duration: 60 },
                { title: 'Upbeat Tech Vlog', genre: 'Acoustic', duration: 35 },
                { title: 'Deep Cyber Bassline', genre: 'Synthwave', duration: 40 },
              ].map((track, i) => {
                const isPlaying = playingAudioIdx === i;
                return (
                  <div 
                    key={i} 
                    className="flex items-center justify-between p-2.5 bg-[#131620] hover:bg-[#181c28] border border-white/5 hover:border-white/15 rounded-xl cursor-pointer transition-all group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPlayingAudioIdx(isPlaying ? null : i);
                        }}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors shrink-0 ${
                          isPlaying ? 'bg-[#ccff00] text-black' : 'bg-white/5 text-slate-300 group-hover:bg-white/10'
                        }`}
                      >
                        {isPlaying ? <Pause className="w-3.5 h-3.5 fill-black" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
                      </button>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-white group-hover:text-emerald-300 truncate">
                          {track.title}
                        </h4>
                        <p className="text-[10px] text-slate-500 font-mono">
                          {track.genre} • 00:{track.duration}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddAudioTrack(track.title, track.duration)}
                      className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-emerald-500 hover:text-black text-slate-300 text-[10px] font-bold transition-all shrink-0 flex items-center gap-1"
                      title="Add to Timeline"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        );

      // -------------------------------------------------------------
      // TEXT & TITLES
      // -------------------------------------------------------------
      case 'text':
        return (
          <div className="p-4 flex flex-col gap-4">
            <button
              onClick={() => handleAddText('New Heading', '#ffffff')}
              className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Add Heading
            </button>

            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Typography Styles</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { style: 'Bold Impact', color: '#ccff00', bg: 'bg-[#141722]' },
                  { style: 'Kinetic Neon', color: '#00e5ff', bg: 'bg-[#141722]' },
                  { style: 'Minimalist Clean', color: '#ffffff', bg: 'bg-[#141722]' },
                  { style: 'Lower Third', color: '#ffb703', bg: 'bg-[#141722]' },
                ].map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleAddText(s.style, s.color)}
                    className="aspect-video bg-[#141722] hover:bg-[#1a1f2e] rounded-xl border border-white/5 hover:border-emerald-400/30 flex items-center justify-center cursor-pointer transition-all p-2 text-center"
                  >
                    <span className="text-xs font-black tracking-tight" style={{ color: s.color }}>
                      {s.style}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      // -------------------------------------------------------------
      // TRANSITIONS
      // -------------------------------------------------------------
      case 'transitions':
        return (
          <div className="p-4 flex flex-col gap-3">
            {!selectedClipId && (
              <div className="bg-amber-500/10 border border-amber-500/25 rounded-xl p-3 text-xs text-amber-300 text-center">
                Select a clip on the timeline to apply transitions
              </div>
            )}
            <div className="grid grid-cols-2 gap-2">
              {['Whip Pan', 'Zoom In', 'Motion Blur', 'Glitch FX', 'Film Dissolve', 'Flash White'].map((t, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyTransition(t)}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    selectedClipId 
                      ? 'bg-[#141722] hover:bg-[#1b2030] border-white/5 hover:border-emerald-400/40 text-white cursor-pointer' 
                      : 'bg-[#141722]/50 border-white/5 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <span className="text-xs font-semibold">{t}</span>
                </button>
              ))}
            </div>
          </div>
        );

      // -------------------------------------------------------------
      // EFFECTS & FILTERS
      // -------------------------------------------------------------
      case 'effects':
      case 'filters':
        return (
          <div className="p-4 flex flex-col gap-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Color & Grading Presets</span>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { name: 'Cinematic Teal', color: 'from-cyan-900 to-emerald-950' },
                { name: 'Warm Sunset', color: 'from-amber-900 to-rose-950' },
                { name: 'Cyberpunk Glow', color: 'from-purple-900 to-blue-950' },
                { name: 'B&W Contrast', color: 'from-slate-800 to-black' },
                { name: 'Vintage 90s', color: 'from-yellow-950 to-amber-900' },
                { name: 'Bleach Bypass', color: 'from-blue-950 to-slate-900' },
              ].map((f, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-xl border border-white/5 hover:border-emerald-400/40 p-2.5 flex flex-col justify-end relative overflow-hidden group cursor-pointer transition-all"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${f.color} opacity-60 group-hover:opacity-80 transition-opacity`} />
                  <span className="relative z-10 text-[11px] font-bold text-white">{f.name}</span>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div className="p-6 text-center text-slate-400 text-xs">
            Select a tool from the left navigation panel.
          </div>
        );
    }
  };

  return (
    <div className="w-[290px] bg-[#0c0e15] border-r border-white/[0.08] shrink-0 flex flex-col h-full overflow-hidden select-none z-10">
      {/* Top Header */}
      <div className="h-14 px-4 border-b border-white/[0.08] flex items-center justify-between shrink-0 bg-[#090b10]">
        <h2 className="text-sm font-bold text-white capitalize tracking-wide flex items-center gap-2">
          {activeTab}
        </h2>
        <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 rounded-full font-bold">
          TOOL
        </span>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {renderContent()}
      </div>
    </div>
  );
}
