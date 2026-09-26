import React, { useState } from 'react';
import { 
  X, 
  Type, 
  Wand2, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Bold, 
  Italic, 
  Underline, 
  ChevronDown, 
  RotateCcw, 
  SlidersHorizontal, 
  Scissors, 
  Sparkles, 
  Minimize2, 
  Maximize2,
  Palette
} from 'lucide-react';
import { TextElement, Clip } from '../page';

interface PropertiesPanelProps {
  textElement: TextElement;
  setTextElement: React.Dispatch<React.SetStateAction<TextElement>>;
  clips: Clip[];
  setClips: React.Dispatch<React.SetStateAction<Clip[]>>;
  selectedClipId: string | null;
  duration: number;
}

const PRESET_COLORS = ['#ffffff', '#ccff00', '#00e5ff', '#f59e0b', '#ec4899', '#8b5cf6', '#10b981', '#000000'];

export default function PropertiesPanel({ 
  textElement, 
  setTextElement, 
  clips, 
  setClips, 
  selectedClipId, 
  duration 
}: PropertiesPanelProps) {
  const [activeTab, setActiveTab] = useState<'basic' | 'text' | 'anim' | 'video-effects' | 'video-trim'>('basic');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const selectedClip = clips.find(c => c.id === selectedClipId);
  const isVideoSelected = selectedClip?.type === 'video';

  // Auto switch tab if selection type changes
  if (isVideoSelected && ['basic', 'text', 'anim'].includes(activeTab)) {
    setActiveTab('video-effects');
  } else if (!isVideoSelected && ['video-effects', 'video-trim'].includes(activeTab)) {
    setActiveTab('basic');
  }

  const handleVideoEffectChange = (effect: string, value: number) => {
    if (selectedClipId) {
      setClips(prev => prev.map(c =>
        c.id === selectedClipId ? { ...c, [effect]: value } : c
      ));
    }
  };

  const handleResetVideoEffects = () => {
    if (selectedClipId) {
      setClips(prev => prev.map(c =>
        c.id === selectedClipId ? {
          ...c,
          blur: 0,
          brightness: 100,
          contrast: 100,
          saturation: 100,
          hueRotate: 0,
          sepia: 0,
          grayscale: 0,
          scaleX: 100,
          scaleY: 100,
          rotation: 0
        } : c
      ));
    }
  };

  const handleTrimChange = (type: 'start' | 'end', value: number) => {
    if (selectedClipId && selectedClip) {
      setClips(prev => prev.map(c => {
        if (c.id === selectedClipId) {
          const currentInPoint = c.mediaOffset || 0;
          const currentOutPoint = currentInPoint + (c.end - c.start);

          if (type === 'start') {
            const newInPoint = Math.min(value, currentOutPoint - 1);
            const newDuration = currentOutPoint - newInPoint;
            return { ...c, mediaOffset: newInPoint, end: c.start + newDuration };
          } else {
            const newOutPoint = Math.max(value, currentInPoint + 1);
            const newDuration = newOutPoint - currentInPoint;
            return { ...c, end: c.start + newDuration };
          }
        }
        return c;
      }));
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextElement(prev => ({ ...prev, text: e.target.value }));
  };

  const toggleBold = () => setTextElement(prev => ({ ...prev, isBold: !prev.isBold }));
  const toggleItalic = () => setTextElement(prev => ({ ...prev, isItalic: !prev.isItalic }));
  const toggleUnderline = () => setTextElement(prev => ({ ...prev, isUnderline: !prev.isUnderline }));

  if (isCollapsed) {
    return (
      <div className="absolute right-4 top-4 z-20">
        <button
          type="button"
          onClick={() => setIsCollapsed(false)}
          className="p-2.5 rounded-2xl bg-[#0e111a]/90 backdrop-blur-xl border border-white/10 hover:border-emerald-400/40 text-slate-300 hover:text-white transition-all shadow-2xl flex items-center gap-1.5"
          title="Open Inspector"
        >
          <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold pr-1">Inspector</span>
        </button>
      </div>
    );
  }

  return (
    <div className="absolute right-4 top-4 w-[330px] bg-[#0c0e16]/95 backdrop-blur-2xl rounded-2xl border border-white/[0.08] shadow-[0_20px_60px_rgba(0,0,0,0.8)] flex flex-col max-h-[calc(100%-310px)] z-20 overflow-hidden select-none">
      
      {/* ------------------------------------------------------------- */}
      {/* HEADER */}
      {/* ------------------------------------------------------------- */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.08] bg-[#090b10]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]" />
          <h2 className="text-xs font-black uppercase tracking-wider text-white">
            {isVideoSelected ? (
              activeTab === 'video-effects' ? 'Video Adjustments' : 'Trim Video'
            ) : (
              activeTab === 'basic' ? 'Title Typography' : activeTab === 'text' ? 'Text Styling' : 'Motion Animation'
            )}
          </h2>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setIsCollapsed(true)}
            className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            title="Collapse Inspector"
          >
            <Minimize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* ------------------------------------------------------------- */}
        {/* MAIN CONTROLS BODY */}
        {/* ------------------------------------------------------------- */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar text-xs">
          
          {/* VIDEO EFFECTS TAB */}
          {activeTab === 'video-effects' && isVideoSelected && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Color & Grading</span>
                <button
                  type="button"
                  onClick={handleResetVideoEffects}
                  className="flex items-center gap-1 text-[10.5px] text-slate-400 hover:text-emerald-400 transition-colors"
                  title="Reset to defaults"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              </div>

              {/* Sliders Grid */}
              <div className="space-y-3.5 bg-black/30 border border-white/5 p-3 rounded-xl">
                {[
                  { label: 'Brightness', key: 'brightness', min: 0, max: 200, unit: '%', def: 100 },
                  { label: 'Contrast', key: 'contrast', min: 0, max: 200, unit: '%', def: 100 },
                  { label: 'Saturation', key: 'saturation', min: 0, max: 200, unit: '%', def: 100 },
                  { label: 'Blur', key: 'blur', min: 0, max: 20, unit: 'px', def: 0 },
                  { label: 'Hue Rotate', key: 'hueRotate', min: 0, max: 360, unit: '°', def: 0 },
                  { label: 'Sepia', key: 'sepia', min: 0, max: 100, unit: '%', def: 0 },
                  { label: 'Grayscale', key: 'grayscale', min: 0, max: 100, unit: '%', def: 0 },
                ].map(item => {
                  const val = (selectedClip as any)?.[item.key] ?? item.def;
                  return (
                    <div key={item.key} className="space-y-1">
                      <div className="flex justify-between text-[11px] text-slate-400">
                        <span>{item.label}</span>
                        <span className="font-mono text-slate-200">{val}{item.unit}</span>
                      </div>
                      <input
                        type="range"
                        min={item.min}
                        max={item.max}
                        value={val}
                        onChange={(e) => handleVideoEffectChange(item.key, parseInt(e.target.value))}
                        className="w-full h-1 bg-white/10 rounded-full appearance-none accent-emerald-400 cursor-pointer"
                      />
                    </div>
                  );
                })}
              </div>

              {/* Scale & Transform */}
              <div className="space-y-3 bg-black/30 border border-white/5 p-3 rounded-xl">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Transform & Rotation</span>
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Scale</span>
                    <span className="font-mono text-slate-200">{selectedClip?.scaleX ?? 100}%</span>
                  </div>
                  <input
                    type="range"
                    min={20}
                    max={250}
                    value={selectedClip?.scaleX ?? 100}
                    onChange={(e) => {
                      const v = parseInt(e.target.value);
                      handleVideoEffectChange('scaleX', v);
                      handleVideoEffectChange('scaleY', v);
                    }}
                    className="w-full h-1 bg-white/10 rounded-full appearance-none accent-cyan-400 cursor-pointer"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Rotation</span>
                    <span className="font-mono text-slate-200">{selectedClip?.rotation ?? 0}°</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={360}
                    value={selectedClip?.rotation ?? 0}
                    onChange={(e) => handleVideoEffectChange('rotation', parseInt(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-full appearance-none accent-cyan-400 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* VIDEO TRIM TAB */}
          {activeTab === 'video-trim' && isVideoSelected && (
            <div className="space-y-4">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">In/Out In-Point Trimming</span>
              
              <div className="space-y-4 bg-black/30 border border-white/5 p-3 rounded-xl">
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>In-Point (Start)</span>
                    <span className="font-mono text-emerald-400">{(selectedClip?.mediaOffset || 0).toFixed(1)}s</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={Math.max(1, duration - 1)}
                    step={0.1}
                    value={selectedClip?.mediaOffset || 0}
                    onChange={(e) => handleTrimChange('start', parseFloat(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-full appearance-none accent-emerald-400 cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Out-Point (End)</span>
                    <span className="font-mono text-cyan-400">
                      {((selectedClip?.mediaOffset || 0) + ((selectedClip?.end || 0) - (selectedClip?.start || 0))).toFixed(1)}s
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={duration}
                    step={0.1}
                    value={(selectedClip?.mediaOffset || 0) + ((selectedClip?.end || 0) - (selectedClip?.start || 0))}
                    onChange={(e) => handleTrimChange('end', parseFloat(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-full appearance-none accent-cyan-400 cursor-pointer"
                  />
                </div>

                <div className="pt-2 border-t border-white/5 flex justify-between items-center text-xs">
                  <span className="text-slate-400">Clip Duration</span>
                  <span className="font-mono font-bold text-white bg-white/10 px-2 py-0.5 rounded">
                    {((selectedClip?.end || 0) - (selectedClip?.start || 0)).toFixed(1)}s
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TEXT BASIC TAB */}
          {!isVideoSelected && activeTab === 'basic' && (
            <div className="space-y-4">
              {/* Text Input Box */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Heading Text</label>
                <textarea
                  rows={2}
                  value={textElement.text}
                  onChange={handleTextChange}
                  className="w-full bg-[#131620] border border-white/10 rounded-xl p-3 text-xs text-white resize-none focus:outline-none focus:border-emerald-400 transition-colors"
                />
              </div>

              {/* Font Family & Size */}
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2 relative">
                  <select
                    value={textElement.fontFamily}
                    onChange={(e) => setTextElement(prev => ({ ...prev, fontFamily: e.target.value }))}
                    className="w-full bg-[#131620] border border-white/10 rounded-xl px-3 py-2 text-xs text-white appearance-none focus:outline-none focus:border-emerald-400 cursor-pointer"
                  >
                    <option value="sans-serif">Albert Sans</option>
                    <option value="Inter, sans-serif">Inter</option>
                    <option value="'Space Grotesk', sans-serif">Space Grotesk</option>
                    <option value="'Oswald', sans-serif">Oswald Impact</option>
                    <option value="'Playfair Display', serif">Playfair Serif</option>
                    <option value="monospace">Monospace</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                <div className="relative">
                  <select
                    value={textElement.fontSize}
                    onChange={(e) => setTextElement(prev => ({ ...prev, fontSize: Number(e.target.value) }))}
                    className="w-full bg-[#131620] border border-white/10 rounded-xl px-2 py-2 text-xs text-white appearance-none focus:outline-none focus:border-emerald-400 cursor-pointer text-center font-mono"
                  >
                    {[24, 36, 48, 64, 72, 96, 120, 144, 200].map(s => (
                      <option key={s} value={s}>{s}px</option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Format Buttons: B, I, U */}
              <div className="flex items-center gap-1 bg-[#131620] border border-white/10 rounded-xl p-1">
                <button
                  type="button"
                  onClick={toggleBold}
                  className={`flex-1 py-1.5 rounded-lg font-bold flex items-center justify-center transition-colors ${
                    textElement.isBold ? 'bg-white/20 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Bold className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={toggleItalic}
                  className={`flex-1 py-1.5 rounded-lg italic flex items-center justify-center transition-colors ${
                    textElement.isItalic ? 'bg-white/20 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Italic className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={toggleUnderline}
                  className={`flex-1 py-1.5 rounded-lg underline flex items-center justify-center transition-colors ${
                    textElement.isUnderline ? 'bg-white/20 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Underline className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Color Presets */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Fill Color</span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {PRESET_COLORS.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setTextElement(prev => ({ ...prev, fill: color }))}
                      className={`w-6 h-6 rounded-full border transition-transform ${
                        textElement.fill.toLowerCase() === color.toLowerCase() 
                          ? 'scale-115 border-white ring-2 ring-emerald-400' 
                          : 'border-white/20 hover:scale-105'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                  <input
                    type="color"
                    value={textElement.fill}
                    onChange={(e) => setTextElement(prev => ({ ...prev, fill: e.target.value }))}
                    className="w-6 h-6 rounded-full bg-transparent border-0 cursor-pointer p-0"
                    title="Custom Color"
                  />
                </div>
              </div>

              {/* Opacity Slider */}
              <div className="space-y-1.5 bg-black/30 border border-white/5 p-3 rounded-xl">
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Opacity</span>
                  <span className="font-mono text-slate-200">{textElement.opacity}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={textElement.opacity}
                  onChange={(e) => setTextElement(prev => ({ ...prev, opacity: parseInt(e.target.value) }))}
                  className="w-full h-1 bg-white/10 rounded-full appearance-none accent-emerald-400 cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* TEXT STYLING / EFFECTS TAB */}
          {!isVideoSelected && activeTab === 'text' && (
            <div className="space-y-4">
              {/* Stroke */}
              <div className="bg-black/30 border border-white/5 p-3 rounded-xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-white">
                    <input
                      type="checkbox"
                      checked={textElement.hasStroke || false}
                      onChange={(e) => setTextElement(prev => ({ ...prev, hasStroke: e.target.checked }))}
                      className="rounded bg-white/10 border-white/20 text-emerald-400 accent-emerald-400"
                    />
                    <span>Outline Stroke</span>
                  </label>
                  {textElement.hasStroke && (
                    <input
                      type="color"
                      value={textElement.strokeColor || '#000000'}
                      onChange={(e) => setTextElement(prev => ({ ...prev, strokeColor: e.target.value }))}
                      className="w-5 h-5 rounded cursor-pointer border-0 p-0"
                    />
                  )}
                </div>
                {textElement.hasStroke && (
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[10px] text-slate-400 w-10">Width</span>
                    <input
                      type="range"
                      min={1}
                      max={12}
                      value={textElement.strokeWidth || 2}
                      onChange={(e) => setTextElement(prev => ({ ...prev, strokeWidth: parseInt(e.target.value) }))}
                      className="flex-1 h-1 bg-white/10 rounded-full appearance-none accent-emerald-400 cursor-pointer"
                    />
                    <span className="font-mono text-[10px] text-slate-300 w-4 text-right">
                      {textElement.strokeWidth || 2}px
                    </span>
                  </div>
                )}
              </div>

              {/* Background Box */}
              <div className="bg-black/30 border border-white/5 p-3 rounded-xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-white">
                    <input
                      type="checkbox"
                      checked={textElement.hasBackground || false}
                      onChange={(e) => setTextElement(prev => ({ ...prev, hasBackground: e.target.checked }))}
                      className="rounded bg-white/10 border-white/20 text-emerald-400 accent-emerald-400"
                    />
                    <span>Background Badge</span>
                  </label>
                  {textElement.hasBackground && (
                    <input
                      type="color"
                      value={textElement.backgroundColor || '#000000'}
                      onChange={(e) => setTextElement(prev => ({ ...prev, backgroundColor: e.target.value }))}
                      className="w-5 h-5 rounded cursor-pointer border-0 p-0"
                    />
                  )}
                </div>
                {textElement.hasBackground && (
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400 w-12">Padding</span>
                      <input
                        type="range"
                        min={2}
                        max={40}
                        value={textElement.backgroundPadding || 10}
                        onChange={(e) => setTextElement(prev => ({ ...prev, backgroundPadding: parseInt(e.target.value) }))}
                        className="flex-1 h-1 bg-white/10 rounded-full appearance-none accent-emerald-400 cursor-pointer"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400 w-12">Radius</span>
                      <input
                        type="range"
                        min={0}
                        max={30}
                        value={textElement.backgroundRadius || 8}
                        onChange={(e) => setTextElement(prev => ({ ...prev, backgroundRadius: parseInt(e.target.value) }))}
                        className="flex-1 h-1 bg-white/10 rounded-full appearance-none accent-emerald-400 cursor-pointer"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Drop Shadow */}
              <div className="bg-black/30 border border-white/5 p-3 rounded-xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-white">
                    <input
                      type="checkbox"
                      checked={textElement.hasShadow || false}
                      onChange={(e) => setTextElement(prev => ({ ...prev, hasShadow: e.target.checked }))}
                      className="rounded bg-white/10 border-white/20 text-emerald-400 accent-emerald-400"
                    />
                    <span>Glow & Shadow</span>
                  </label>
                  {textElement.hasShadow && (
                    <input
                      type="color"
                      value={textElement.shadowColor || '#000000'}
                      onChange={(e) => setTextElement(prev => ({ ...prev, shadowColor: e.target.value }))}
                      className="w-5 h-5 rounded cursor-pointer border-0 p-0"
                    />
                  )}
                </div>
                {textElement.hasShadow && (
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400 w-12">Blur</span>
                      <input
                        type="range"
                        min={0}
                        max={40}
                        value={textElement.shadowBlur || 10}
                        onChange={(e) => setTextElement(prev => ({ ...prev, shadowBlur: parseInt(e.target.value) }))}
                        className="flex-1 h-1 bg-white/10 rounded-full appearance-none accent-emerald-400 cursor-pointer"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ANIMATION TAB */}
          {!isVideoSelected && activeTab === 'anim' && (
            <div className="space-y-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Entrance Animations</span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'none', label: 'None' },
                  { id: 'fade-in', label: 'Fade In' },
                  { id: 'slide-up', label: 'Slide Up' },
                  { id: 'slide-down', label: 'Slide Down' },
                  { id: 'slide-left', label: 'Slide Left' },
                  { id: 'slide-right', label: 'Slide Right' },
                  { id: 'zoom-in', label: 'Zoom In' },
                  { id: 'zoom-out', label: 'Zoom Out' },
                  { id: 'bounce', label: 'Bounce' },
                  { id: 'spin', label: 'Spin' },
                ].map(anim => (
                  <button
                    key={anim.id}
                    type="button"
                    onClick={() => setTextElement(prev => ({ ...prev, animation: anim.id }))}
                    className={`py-2 px-2.5 rounded-xl border text-center transition-all ${
                      textElement.animation === anim.id
                        ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-extrabold shadow-sm border-transparent'
                        : 'bg-[#131620] hover:bg-[#191d2c] border-white/5 text-slate-300'
                    }`}
                  >
                    {anim.label}
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* ------------------------------------------------------------- */}
        {/* RIGHT MINI TABS COLUMN */}
        {/* ------------------------------------------------------------- */}
        <div className="w-14 bg-[#090b10] border-l border-white/[0.08] flex flex-col items-center py-2.5 shrink-0 gap-2">
          {!isVideoSelected ? (
            <>
              <button
                type="button"
                onClick={() => setActiveTab('basic')}
                className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center gap-1 transition-all ${
                  activeTab === 'basic' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
                title="Typography"
              >
                <Type className="w-4 h-4" />
                <span className="text-[8.5px] font-bold">Text</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('text')}
                className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center gap-1 transition-all ${
                  activeTab === 'text' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
                title="Effects & Shadow"
              >
                <Palette className="w-4 h-4" />
                <span className="text-[8.5px] font-bold">Style</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('anim')}
                className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center gap-1 transition-all ${
                  activeTab === 'anim' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
                title="Animations"
              >
                <Wand2 className="w-4 h-4" />
                <span className="text-[8.5px] font-bold">Motion</span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setActiveTab('video-effects')}
                className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center gap-1 transition-all ${
                  activeTab === 'video-effects' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
                title="Adjustments"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span className="text-[8.5px] font-bold">Color</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('video-trim')}
                className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center gap-1 transition-all ${
                  activeTab === 'video-trim' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
                title="Trim Clip"
              >
                <Scissors className="w-4 h-4" />
                <span className="text-[8.5px] font-bold">Trim</span>
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
