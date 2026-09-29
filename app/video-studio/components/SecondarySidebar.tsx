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
  Volume2,
  RotateCcw,
  Sliders,
  X,
  ChevronDown,
  ChevronUp,
  Zap,
  Film
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

export interface EffectPresetItem {
  id: string;
  name: string;
  category: 'all' | 'cinematic' | 'cyber' | 'retro' | 'mood' | 'vibrant' | 'overlay';
  badge?: string;
  color: string;
  description: string;
  effects: {
    brightness?: number;
    contrast?: number;
    saturation?: number;
    blur?: number;
    hueRotate?: number;
    sepia?: number;
    grayscale?: number;
    invert?: number;
  };
  overlayFx?: 'none' | 'vignette' | 'grain' | 'scanlines' | 'rgb-split' | 'light-leak';
}

export const EFFECT_PRESETS: EffectPresetItem[] = [
  {
    id: 'cinematic-teal',
    name: 'Cinematic Teal',
    category: 'cinematic',
    badge: 'POPULAR',
    color: 'from-cyan-900 to-emerald-950',
    description: 'Teal & Orange Hollywood grade with deep rich shadows',
    effects: { brightness: 106, contrast: 125, saturation: 130, hueRotate: 185, sepia: 15 }
  },
  {
    id: 'warm-sunset',
    name: 'Warm Sunset',
    category: 'cinematic',
    badge: 'WARM',
    color: 'from-amber-900 to-rose-950',
    description: 'Golden hour warmth with rich amber and sunset glow',
    effects: { brightness: 110, contrast: 115, saturation: 140, hueRotate: 350, sepia: 30 }
  },
  {
    id: 'cyberpunk-glow',
    name: 'Cyberpunk Glow',
    category: 'cyber',
    badge: 'NEON',
    color: 'from-purple-900 to-blue-950',
    description: 'Electric violet & neon blue dystopian sci-fi aesthetic',
    effects: { brightness: 115, contrast: 135, saturation: 175, hueRotate: 285 }
  },
  {
    id: 'bw-contrast',
    name: 'B&W Contrast',
    category: 'mood',
    badge: 'MONO',
    color: 'from-slate-800 to-black',
    description: 'Dramatic black and white with high dynamic punch',
    effects: { brightness: 105, contrast: 155, saturation: 0, grayscale: 100 }
  },
  {
    id: 'vintage-90s',
    name: 'Vintage 90s',
    category: 'retro',
    badge: 'RETRO',
    color: 'from-yellow-950 to-amber-900',
    description: 'Nostalgic analog VHS warmth with faded contrast',
    effects: { brightness: 108, contrast: 90, saturation: 85, hueRotate: 345, sepia: 40 }
  },
  {
    id: 'bleach-bypass',
    name: 'Bleach Bypass',
    category: 'cinematic',
    badge: 'FILM',
    color: 'from-blue-950 to-slate-900',
    description: 'Desaturated silver-halide film look with crushing contrast',
    effects: { brightness: 104, contrast: 160, saturation: 40 }
  },
  {
    id: 'neon-tokyo',
    name: 'Neon Tokyo',
    category: 'cyber',
    badge: 'TOKYO',
    color: 'from-fuchsia-900 to-indigo-950',
    description: 'Hyper-saturated Tokyo night market neon palette',
    effects: { brightness: 110, contrast: 130, saturation: 165, hueRotate: 160 }
  },
  {
    id: 'matrix-emerald',
    name: 'Matrix Emerald',
    category: 'cyber',
    badge: 'CYBER',
    color: 'from-emerald-950 to-green-900',
    description: 'Phosphor green cybercode tint and terminal aesthetic',
    effects: { brightness: 96, contrast: 135, saturation: 145, hueRotate: 90, sepia: 20 }
  },
  {
    id: 'moody-noir',
    name: 'Moody Noir',
    category: 'mood',
    badge: 'NOIR',
    color: 'from-zinc-900 to-neutral-950',
    description: 'Deep crushed blacks and dramatic mystery movie lighting',
    effects: { brightness: 85, contrast: 165, saturation: 20, grayscale: 80 }
  },
  {
    id: 'silver-screen',
    name: 'Silver Screen',
    category: 'mood',
    badge: '1940s',
    color: 'from-stone-800 to-zinc-950',
    description: 'Golden age of cinema silky smooth monochrome grade',
    effects: { brightness: 105, contrast: 120, saturation: 0, grayscale: 100 }
  },
  {
    id: '70s-warmth',
    name: '70s Warmth',
    category: 'retro',
    badge: 'KODAK',
    color: 'from-amber-950 to-orange-900',
    description: 'Kodachrome summer glow with mellow pastel tones',
    effects: { brightness: 112, contrast: 105, saturation: 125, sepia: 35, hueRotate: 15 }
  },
  {
    id: 'polaroid-faded',
    name: 'Polaroid Faded',
    category: 'retro',
    badge: 'INSTANT',
    color: 'from-rose-950 to-amber-950',
    description: 'Creamy lifted shadows with classic instant camera nostalgia',
    effects: { brightness: 115, contrast: 85, saturation: 90, sepia: 25 }
  },
  {
    id: 'vibrant-pop',
    name: 'Vibrant Pop',
    category: 'vibrant',
    badge: 'REELS',
    color: 'from-pink-900 to-rose-950',
    description: 'High-energy vivid saturation calibrated for viral reels',
    effects: { brightness: 108, contrast: 125, saturation: 165 }
  },
  {
    id: 'cold-nordic',
    name: 'Cold Nordic',
    category: 'mood',
    badge: 'ICE',
    color: 'from-sky-950 to-slate-900',
    description: 'Chilled arctic blue grading for suspense and drama',
    effects: { brightness: 102, contrast: 125, saturation: 80, hueRotate: 195 }
  },
  {
    id: 'dreamy-glow',
    name: 'Dreamy Glow',
    category: 'vibrant',
    badge: 'SOFT',
    color: 'from-violet-950 to-pink-950',
    description: 'Ethereal bloom with soft highlight diffusion and pastel blush',
    effects: { brightness: 120, contrast: 90, saturation: 120, blur: 1 }
  },
  {
    id: 'solar-flare',
    name: 'Solar Flare',
    category: 'vibrant',
    badge: 'GLOW',
    color: 'from-yellow-900 to-amber-950',
    description: 'Luminous high-exposure golden sun flare with warm highlights',
    effects: { brightness: 130, contrast: 110, saturation: 135, sepia: 20 }
  },
  {
    id: 'cinematic-vignette',
    name: 'Cinematic Vignette',
    category: 'overlay',
    badge: 'FOCUS',
    color: 'from-neutral-900 to-black',
    description: 'Center spotlight focus with darkened feathered corners',
    effects: { brightness: 100, contrast: 115, saturation: 105 },
    overlayFx: 'vignette'
  },
  {
    id: '35mm-grain',
    name: '35mm Film Grain',
    category: 'overlay',
    badge: 'GRAIN',
    color: 'from-stone-900 to-zinc-900',
    description: 'Authentic 35mm motion picture analog grain texture',
    effects: { brightness: 102, contrast: 110, saturation: 95 },
    overlayFx: 'grain'
  },
  {
    id: 'retro-crt-scanlines',
    name: 'CRT Scanlines',
    category: 'overlay',
    badge: 'VHS',
    color: 'from-cyan-950 to-blue-950',
    description: 'Vintage arcade and 90s CRT monitor horizontal scanlines',
    effects: { brightness: 105, contrast: 120, saturation: 110 },
    overlayFx: 'scanlines'
  },
  {
    id: 'golden-light-leak',
    name: 'Golden Light Leak',
    category: 'overlay',
    badge: 'LEAK',
    color: 'from-amber-900 to-orange-950',
    description: 'Warm corner lens flare and organic sunlight bleed',
    effects: { brightness: 112, contrast: 105, saturation: 120 },
    overlayFx: 'light-leak'
  },
  {
    id: 'rgb-split',
    name: 'RGB Chromatic',
    category: 'overlay',
    badge: 'GLITCH',
    color: 'from-red-950 to-cyan-950',
    description: 'Stylized chromatic aberration edge splitting distortion',
    effects: { brightness: 105, contrast: 130, saturation: 135 },
    overlayFx: 'rgb-split'
  },
  {
    id: 'inverted-matrix',
    name: 'Inverted Matrix',
    category: 'cyber',
    badge: 'FX',
    color: 'from-indigo-950 to-stone-900',
    description: 'Surreal negative color matrix inversion for music videos',
    effects: { brightness: 100, contrast: 120, saturation: 100, invert: 100 }
  }
];

interface SecondarySidebarProps {
  activeTab: string;
  setVideoSrc?: React.Dispatch<React.SetStateAction<string>>;
  setVideoName?: React.Dispatch<React.SetStateAction<string>>;
  setDuration?: React.Dispatch<React.SetStateAction<number>>;
  clips?: Clip[];
  setClips?: React.Dispatch<React.SetStateAction<Clip[]>>;
  currentTime?: number;
  selectedClipId?: string | null;
  setSelectedClipId?: React.Dispatch<React.SetStateAction<string | null>>;
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
  clips,
  setClips, 
  currentTime = 0, 
  selectedClipId,
  setSelectedClipId,
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

  // Effects & Filters State
  const [effectSearch, setEffectSearch] = useState('');
  const [effectCategory, setEffectCategory] = useState<'all' | 'cinematic' | 'cyber' | 'retro' | 'mood' | 'vibrant' | 'overlay'>('all');
  const [showFineTune, setShowFineTune] = useState(false);
  const [appliedEffectToast, setAppliedEffectToast] = useState<string | null>(null);

  // Find the target video clip
  const targetVideoClip = 
    (clips && selectedClipId ? clips.find(c => c.id === selectedClipId && c.type === 'video') : null) ||
    (clips ? clips.find(c => c.type === 'video' && currentTime >= c.start && currentTime <= c.end) : null) ||
    (clips ? clips.find(c => c.type === 'video') : null);

  const activePresetId = targetVideoClip?.effectPreset;
  const currentIntensity = targetVideoClip?.effectIntensity ?? 100;
  const activeOverlay = targetVideoClip?.overlayFx || 'none';

  const handleApplyPreset = (preset: EffectPresetItem) => {
    if (!setClips) return;
    if (!targetVideoClip) return;

    if (setSelectedClipId && selectedClipId !== targetVideoClip.id) {
      setSelectedClipId(targetVideoClip.id);
    }

    setClips(prev => prev.map(c => {
      if (c.id === targetVideoClip.id) {
        return {
          ...c,
          brightness: preset.effects.brightness ?? 100,
          contrast: preset.effects.contrast ?? 100,
          saturation: preset.effects.saturation ?? 100,
          blur: preset.effects.blur ?? 0,
          hueRotate: preset.effects.hueRotate ?? 0,
          sepia: preset.effects.sepia ?? 0,
          grayscale: preset.effects.grayscale ?? 0,
          invert: preset.effects.invert ?? 0,
          overlayFx: preset.overlayFx || 'none',
          effectPreset: preset.id,
          effectIntensity: 100,
        };
      }
      return c;
    }));

    setAppliedEffectToast(`Applied ${preset.name}`);
    setTimeout(() => setAppliedEffectToast(null), 2000);
  };

  const handleResetEffects = () => {
    if (!setClips || !targetVideoClip) return;

    setClips(prev => prev.map(c => {
      if (c.id === targetVideoClip.id) {
        return {
          ...c,
          brightness: 100,
          contrast: 100,
          saturation: 100,
          blur: 0,
          hueRotate: 0,
          sepia: 0,
          grayscale: 0,
          invert: 0,
          overlayFx: 'none',
          effectPreset: undefined,
          effectIntensity: 100,
        };
      }
      return c;
    }));

    setAppliedEffectToast("Effects reset to original");
    setTimeout(() => setAppliedEffectToast(null), 2000);
  };

  const handleIntensityChange = (val: number) => {
    if (!setClips || !targetVideoClip || !targetVideoClip.effectPreset) return;
    const preset = EFFECT_PRESETS.find(p => p.id === targetVideoClip.effectPreset);
    if (!preset) return;

    const t = Math.max(0, Math.min(100, val)) / 100;
    const b = preset.effects.brightness ?? 100;
    const c = preset.effects.contrast ?? 100;
    const s = preset.effects.saturation ?? 100;
    const bl = preset.effects.blur ?? 0;
    const h = preset.effects.hueRotate ?? 0;
    const sp = preset.effects.sepia ?? 0;
    const g = preset.effects.grayscale ?? 0;
    const inv = preset.effects.invert ?? 0;

    setClips(prev => prev.map(clip => {
      if (clip.id === targetVideoClip.id) {
        return {
          ...clip,
          effectIntensity: val,
          brightness: Math.round(100 + (b - 100) * t),
          contrast: Math.round(100 + (c - 100) * t),
          saturation: Math.round(100 + (s - 100) * t),
          blur: Number((bl * t).toFixed(1)),
          hueRotate: Math.round(h * t),
          sepia: Math.round(sp * t),
          grayscale: Math.round(g * t),
          invert: Math.round(inv * t),
        };
      }
      return clip;
    }));
  };

  const handleApplyToAllClips = () => {
    if (!setClips || !targetVideoClip) return;

    setClips(prev => prev.map(c => {
      if (c.type === 'video') {
        return {
          ...c,
          brightness: targetVideoClip.brightness,
          contrast: targetVideoClip.contrast,
          saturation: targetVideoClip.saturation,
          blur: targetVideoClip.blur,
          hueRotate: targetVideoClip.hueRotate,
          sepia: targetVideoClip.sepia,
          grayscale: targetVideoClip.grayscale,
          invert: targetVideoClip.invert,
          overlayFx: targetVideoClip.overlayFx,
          effectPreset: targetVideoClip.effectPreset,
          effectIntensity: targetVideoClip.effectIntensity,
        };
      }
      return c;
    }));

    setAppliedEffectToast("Applied effect to all video clips");
    setTimeout(() => setAppliedEffectToast(null), 2000);
  };

  const handleToggleOverlay = (fx: 'none' | 'vignette' | 'grain' | 'scanlines' | 'rgb-split' | 'light-leak') => {
    if (!setClips || !targetVideoClip) return;

    if (setSelectedClipId && selectedClipId !== targetVideoClip.id) {
      setSelectedClipId(targetVideoClip.id);
    }

    setClips(prev => prev.map(c => {
      if (c.id === targetVideoClip.id) {
        return {
          ...c,
          overlayFx: c.overlayFx === fx ? 'none' : fx
        };
      }
      return c;
    }));
  };

  const handleFineTune = (key: string, val: number) => {
    if (!setClips || !targetVideoClip) return;

    setClips(prev => prev.map(c => {
      if (c.id === targetVideoClip.id) {
        return { ...c, [key]: val };
      }
      return c;
    }));
  };

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
      case 'filters': {
        const filteredPresets = EFFECT_PRESETS.filter(p => {
          const matchesCat = effectCategory === 'all' || p.category === effectCategory;
          const matchesSearch = !effectSearch || 
            p.name.toLowerCase().includes(effectSearch.toLowerCase()) || 
            p.description.toLowerCase().includes(effectSearch.toLowerCase());
          return matchesCat && matchesSearch;
        });

        return (
          <div className="p-4 flex flex-col gap-4">
            {/* Feedback notification toast */}
            {appliedEffectToast && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs font-semibold shadow-md">
                <Check className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{appliedEffectToast}</span>
              </div>
            )}

            {/* Target Video Track Status */}
            <div className="bg-[#121520] border border-white/[0.07] rounded-xl p-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  <Video className="w-3.5 h-3.5" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-[10px] text-slate-400 font-medium">Target Clip</p>
                  <p className="text-[11px] font-bold text-white truncate max-w-[130px]">
                    {targetVideoClip ? targetVideoClip.content : 'No Video Clip'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {activePresetId && (
                  <button
                    type="button"
                    onClick={handleResetEffects}
                    className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-rose-400 bg-white/5 hover:bg-rose-500/10 border border-white/5 hover:border-rose-500/30 px-2 py-1 rounded-lg transition-colors"
                    title="Reset to Original"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                )}
              </div>
            </div>

            {/* Active Effect Strength & Controls */}
            {activePresetId && targetVideoClip && (
              <div className="bg-gradient-to-br from-emerald-950/40 to-[#0e121d] border border-emerald-500/30 rounded-xl p-3 space-y-2.5 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                    <span className="text-xs font-bold text-white">
                      {EFFECT_PRESETS.find(p => p.id === activePresetId)?.name || 'Custom Grade'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyToAllClips}
                    className="text-[10px] text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 rounded-lg flex items-center gap-1 transition-all"
                    title="Apply this effect to all video tracks"
                  >
                    <Layers className="w-3 h-3" />
                    <span>All Clips</span>
                  </button>
                </div>

                {/* Strength / Intensity Slider */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400 font-medium">Effect Strength</span>
                    <span className="font-mono text-emerald-400 font-bold">{currentIntensity}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={currentIntensity}
                    onChange={(e) => handleIntensityChange(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-white/10 rounded-full appearance-none accent-emerald-400 cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* Cinematic Overlays */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Film className="w-3.5 h-3.5 text-cyan-400" />
                  Cinematic Overlays
                </span>
                {activeOverlay !== 'none' && (
                  <button 
                    type="button" 
                    onClick={() => handleToggleOverlay('none')}
                    className="text-[10px] text-slate-400 hover:text-white"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'vignette', label: 'Vignette' },
                  { id: 'grain', label: '35mm Grain' },
                  { id: 'scanlines', label: 'CRT Scan' },
                  { id: 'light-leak', label: 'Light Leak' },
                  { id: 'rgb-split', label: 'RGB Glitch' },
                  { id: 'none', label: 'None' },
                ].map((item) => {
                  const isSelected = activeOverlay === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleToggleOverlay(item.id as any)}
                      className={`py-1.5 px-1.5 rounded-lg text-[10.5px] font-semibold border transition-all text-center truncate ${
                        isSelected
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-sm'
                          : 'bg-white/[0.03] text-slate-400 border-white/5 hover:text-white hover:bg-white/[0.08]'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Search and Category Filter */}
            <div className="space-y-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search 22+ presets..."
                  value={effectSearch}
                  onChange={(e) => setEffectSearch(e.target.value)}
                  className="w-full bg-[#121520] border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition-colors"
                />
                {effectSearch && (
                  <button 
                    type="button" 
                    onClick={() => setEffectSearch('')} 
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 custom-scrollbar text-[11px]">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'cinematic', label: 'Cinematic' },
                  { id: 'cyber', label: 'Cyber' },
                  { id: 'retro', label: 'Retro' },
                  { id: 'mood', label: 'B&W' },
                  { id: 'vibrant', label: 'Vibrant' },
                  { id: 'overlay', label: 'Overlays' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setEffectCategory(cat.id as any)}
                    className={`px-2.5 py-1 rounded-lg font-semibold shrink-0 transition-all ${
                      effectCategory === cat.id
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'text-slate-400 hover:text-white bg-white/[0.02] hover:bg-white/[0.06] border border-transparent'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Presets Grid */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Color & Grading Presets</span>
              <div className="grid grid-cols-2 gap-2.5">
                {filteredPresets.map((preset) => {
                  const isApplied = activePresetId === preset.id;
                  return (
                    <div
                      key={preset.id}
                      onClick={() => handleApplyPreset(preset)}
                      className={`aspect-square rounded-xl p-2.5 flex flex-col justify-between relative overflow-hidden group cursor-pointer transition-all border ${
                        isApplied
                          ? 'border-emerald-400 ring-2 ring-emerald-400/40 shadow-[0_0_20px_rgba(52,211,153,0.35)] scale-[1.02]'
                          : 'border-white/10 hover:border-emerald-400/50 hover:shadow-lg'
                      }`}
                    >
                      {/* Background Gradient */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${preset.color} ${isApplied ? 'opacity-90' : 'opacity-65 group-hover:opacity-85'} transition-opacity`} />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />

                      {/* Header Badge */}
                      <div className="relative z-10 flex items-center justify-between w-full">
                        {preset.badge && (
                          <span className="text-[7.5px] font-mono font-bold tracking-tight px-1.5 py-0.5 rounded bg-black/60 text-slate-300 backdrop-blur-xs border border-white/10 uppercase">
                            {preset.badge}
                          </span>
                        )}
                        {isApplied && (
                          <span className="text-[8px] font-mono font-black px-1.5 py-0.5 rounded bg-emerald-400 text-black shadow-sm flex items-center gap-0.5 ml-auto">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                            ACTIVE
                          </span>
                        )}
                      </div>

                      {/* Title & Description */}
                      <div className="relative z-10 space-y-0.5">
                        <span className="block text-[11px] font-bold text-white group-hover:text-emerald-300 transition-colors leading-tight">
                          {preset.name}
                        </span>
                        <span className="block text-[9px] text-slate-300 line-clamp-1 opacity-75 group-hover:opacity-100 transition-opacity">
                          {preset.description}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Fine-Tune Adjustments Drawer */}
            <div className="border-t border-white/[0.08] pt-3 space-y-2.5">
              <button
                type="button"
                onClick={() => setShowFineTune(!showFineTune)}
                className="w-full flex items-center justify-between text-xs font-bold text-slate-300 hover:text-white py-1"
              >
                <span className="flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                  Quick Adjustments
                </span>
                {showFineTune ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {showFineTune && targetVideoClip && (
                <div className="space-y-3 bg-[#121520] border border-white/5 p-3 rounded-xl animate-fade-in">
                  {[
                    { label: 'Brightness', key: 'brightness', min: 0, max: 200, unit: '%', def: 100 },
                    { label: 'Contrast', key: 'contrast', min: 0, max: 200, unit: '%', def: 100 },
                    { label: 'Saturation', key: 'saturation', min: 0, max: 200, unit: '%', def: 100 },
                    { label: 'Blur', key: 'blur', min: 0, max: 15, unit: 'px', def: 0 },
                    { label: 'Hue Rotate', key: 'hueRotate', min: 0, max: 360, unit: '°', def: 0 },
                  ].map((item) => {
                    const val = (targetVideoClip as any)?.[item.key] ?? item.def;
                    return (
                      <div key={item.key} className="space-y-1">
                        <div className="flex justify-between text-[10.5px] text-slate-400">
                          <span>{item.label}</span>
                          <span className="font-mono text-slate-200">{val}{item.unit}</span>
                        </div>
                        <input
                          type="range"
                          min={item.min}
                          max={item.max}
                          value={val}
                          onChange={(e) => handleFineTune(item.key, parseInt(e.target.value))}
                          className="w-full h-1 bg-white/10 rounded-full appearance-none accent-emerald-400 cursor-pointer"
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        );
      }

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
          {activeTab === 'effects' ? '22+ FX' : activeTab === 'filters' ? 'LUTs' : 'TOOL'}
        </span>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {renderContent()}
      </div>
    </div>
  );
}
