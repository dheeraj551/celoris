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
import { Clip } from '../page';

interface SecondarySidebarProps {
  activeTab: string;
  setVideoSrc?: React.Dispatch<React.SetStateAction<string>>;
  setVideoName?: React.Dispatch<React.SetStateAction<string>>;
  setDuration?: React.Dispatch<React.SetStateAction<number>>;
  setClips?: React.Dispatch<React.SetStateAction<Clip[]>>;
  currentTime?: number;
  selectedClipId?: string | null;
}

export default function SecondarySidebar({ 
  activeTab, 
  setVideoSrc, 
  setVideoName, 
  setDuration, 
  setClips, 
  currentTime = 0, 
  selectedClipId 
}: SecondarySidebarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [playingAudioIdx, setPlayingAudioIdx] = useState<number | null>(null);
  const [captionLanguage, setCaptionLanguage] = useState('auto');
  const [isGeneratingCaptions, setIsGeneratingCaptions] = useState(false);
  const [captionsGenerated, setCaptionsGenerated] = useState(false);

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
      case 'templates':
        return (
          <div className="p-4 flex flex-col gap-4">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search viral presets..."
                className="w-full bg-[#131620] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400 transition-colors"
              />
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { title: 'Reel Hook', tag: '9:16', dur: '00:07', color: 'from-purple-600 to-indigo-600' },
                { title: 'Viral Vlog', tag: '9:16', dur: '00:15', color: 'from-amber-500 to-rose-600' },
                { title: 'YouTube 16:9', tag: '16:9', dur: '00:30', color: 'from-blue-600 to-cyan-500' },
                { title: 'Brand Promo', tag: '9:16', dur: '00:10', color: 'from-emerald-500 to-teal-600' },
              ].map((template, i) => (
                <div 
                  key={i} 
                  onClick={() => handleAddText(template.title, '#ffffff')}
                  className="aspect-[9/16] bg-[#141722] rounded-xl border border-white/5 hover:border-emerald-400/40 relative group cursor-pointer overflow-hidden p-2 flex flex-col justify-between transition-all"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${template.color} opacity-30 group-hover:opacity-60 transition-opacity`} />
                  <div className="relative z-10 flex justify-between items-center text-[9px] font-mono font-bold text-white">
                    <span className="bg-black/60 px-1.5 py-0.5 rounded border border-white/10">{template.tag}</span>
                    <span className="bg-black/60 px-1.5 py-0.5 rounded">{template.dur}</span>
                  </div>
                  <div className="relative z-10">
                    <h5 className="text-[11px] font-bold text-white group-hover:text-emerald-300 transition-colors">{template.title}</h5>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

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
