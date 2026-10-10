import React, { useState, useEffect, useRef } from 'react';
import { X, Sparkles, Check, RotateCcw, Palette, Layers, Sliders, Shield } from 'lucide-react';
import { Layer, LayerStyles } from '../../types';

interface LayerStylesModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeLayer: Layer | null;
  onUpdateLayerStyles: (styles: LayerStyles, commit: boolean, label?: string) => void;
}

type StyleTab = 'dropShadow' | 'stroke' | 'outerGlow' | 'colorOverlay';

const DEFAULT_STYLES: LayerStyles = {
  dropShadow: {
    enabled: false,
    color: '#000000',
    blur: 16,
    offsetX: 10,
    offsetY: 10,
    opacity: 0.65,
  },
  outerGlow: {
    enabled: false,
    color: '#38bdf8',
    blur: 24,
    opacity: 0.85,
  },
  stroke: {
    enabled: false,
    color: '#ffffff',
    size: 4,
    opacity: 1,
  },
  colorOverlay: {
    enabled: false,
    color: '#3b82f6',
    opacity: 0.6,
  },
};

const SWATCH_COLORS = [
  '#000000', '#ffffff', '#ef4444', '#f97316', '#f59e0b',
  '#10b981', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899',
];

export const LayerStylesModal: React.FC<LayerStylesModalProps> = ({
  isOpen,
  onClose,
  activeLayer,
  onUpdateLayerStyles,
}) => {
  const [activeTab, setActiveTab] = useState<StyleTab>('dropShadow');
  const [styles, setStyles] = useState<LayerStyles>(DEFAULT_STYLES);
  const initialStylesRef = useRef<LayerStyles>(DEFAULT_STYLES);

  // Initialize from active layer when modal opens
  useEffect(() => {
    if (isOpen && activeLayer) {
      const merged: LayerStyles = {
        dropShadow: {
          ...DEFAULT_STYLES.dropShadow!,
          ...(activeLayer.layerStyles?.dropShadow || {}),
        },
        stroke: {
          ...DEFAULT_STYLES.stroke!,
          ...(activeLayer.layerStyles?.stroke || {}),
        },
        outerGlow: {
          ...DEFAULT_STYLES.outerGlow!,
          ...(activeLayer.layerStyles?.outerGlow || {}),
        },
        colorOverlay: {
          ...DEFAULT_STYLES.colorOverlay!,
          ...(activeLayer.layerStyles?.colorOverlay || {}),
        },
      };
      setStyles(merged);
      initialStylesRef.current = JSON.parse(JSON.stringify(merged));
    }
  }, [isOpen, activeLayer?.id]);

  if (!isOpen || !activeLayer) return null;

  // Real-time update to viewport
  const updateStylesState = (newStyles: LayerStyles) => {
    setStyles(newStyles);
    onUpdateLayerStyles(newStyles, false);
  };

  const handleApply = () => {
    onUpdateLayerStyles(styles, true, `Layer Styles: ${activeLayer.name}`);
    onClose();
  };

  const handleCancel = () => {
    // Revert to initial styles on cancel
    onUpdateLayerStyles(initialStylesRef.current, false);
    onClose();
  };

  const handleResetCurrentTab = () => {
    const updated = {
      ...styles,
      [activeTab]: {
        ...DEFAULT_STYLES[activeTab],
        enabled: false,
      },
    };
    updateStylesState(updated);
  };

  // Presets
  const applyPreset = (presetName: string) => {
    let updated: LayerStyles = JSON.parse(JSON.stringify(styles));
    if (presetName === 'subtle-shadow') {
      updated.dropShadow = {
        enabled: true,
        color: '#000000',
        blur: 14,
        offsetX: 6,
        offsetY: 8,
        opacity: 0.45,
      };
    } else if (presetName === 'deep-elevation') {
      updated.dropShadow = {
        enabled: true,
        color: '#000000',
        blur: 32,
        offsetX: 16,
        offsetY: 20,
        opacity: 0.8,
      };
    } else if (presetName === 'cyber-glow') {
      updated.outerGlow = {
        enabled: true,
        color: '#00f0ff',
        blur: 28,
        opacity: 0.9,
      };
    } else if (presetName === 'gold-halo') {
      updated.outerGlow = {
        enabled: true,
        color: '#fbbf24',
        blur: 24,
        opacity: 0.85,
      };
    } else if (presetName === 'sticker-outline') {
      updated.stroke = {
        enabled: true,
        color: '#ffffff',
        size: 6,
        opacity: 1,
      };
      updated.dropShadow = {
        enabled: true,
        color: '#000000',
        blur: 10,
        offsetX: 4,
        offsetY: 6,
        opacity: 0.35,
      };
    } else if (presetName === 'ruby-overlay') {
      updated.colorOverlay = {
        enabled: true,
        color: '#e11d48',
        opacity: 0.65,
      };
    }
    updateStylesState(updated);
  };

  const ds = styles.dropShadow || DEFAULT_STYLES.dropShadow!;
  const st = styles.stroke || DEFAULT_STYLES.stroke!;
  const og = styles.outerGlow || DEFAULT_STYLES.outerGlow!;
  const co = styles.colorOverlay || DEFAULT_STYLES.colorOverlay!;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="flex flex-col w-full max-w-2xl rounded-xl border border-white/15 bg-[#1e1e1e] shadow-2xl text-gray-200 overflow-hidden max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 bg-[#282828] px-5 py-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/40 text-cyan-400 font-serif font-bold italic text-sm">
              fx
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white tracking-wide">Layer Styles</h2>
              <p className="text-[11px] text-gray-400 truncate max-w-xs">
                Applying live non-destructive effects to: <span className="text-cyan-400 font-medium">{activeLayer.name}</span>
              </p>
            </div>
          </div>
          <button
            onClick={handleCancel}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Presets Quick Bar */}
        <div className="flex items-center gap-1.5 px-5 py-2 bg-[#232323] border-b border-white/5 overflow-x-auto text-[11px]">
          <span className="text-gray-400 font-medium shrink-0 flex items-center gap-1 mr-1">
            <Sparkles className="w-3 h-3 text-amber-400" /> Presets:
          </span>
          <button
            onClick={() => applyPreset('subtle-shadow')}
            className="px-2 py-0.5 rounded bg-[#303030] hover:bg-[#3d3d3d] text-gray-300 hover:text-white border border-white/5 shrink-0 cursor-pointer transition-colors"
          >
            Subtle Shadow
          </button>
          <button
            onClick={() => applyPreset('deep-elevation')}
            className="px-2 py-0.5 rounded bg-[#303030] hover:bg-[#3d3d3d] text-gray-300 hover:text-white border border-white/5 shrink-0 cursor-pointer transition-colors"
          >
            Elevation
          </button>
          <button
            onClick={() => applyPreset('sticker-outline')}
            className="px-2 py-0.5 rounded bg-[#303030] hover:bg-[#3d3d3d] text-gray-300 hover:text-white border border-white/5 shrink-0 cursor-pointer transition-colors"
          >
            Sticker Outline
          </button>
          <button
            onClick={() => applyPreset('cyber-glow')}
            className="px-2 py-0.5 rounded bg-[#303030] hover:bg-[#3d3d3d] text-cyan-300 hover:text-cyan-200 border border-cyan-500/20 shrink-0 cursor-pointer transition-colors"
          >
            Cyber Glow
          </button>
          <button
            onClick={() => applyPreset('gold-halo')}
            className="px-2 py-0.5 rounded bg-[#303030] hover:bg-[#3d3d3d] text-amber-300 hover:text-amber-200 border border-amber-500/20 shrink-0 cursor-pointer transition-colors"
          >
            Gold Glow
          </button>
          <button
            onClick={() => applyPreset('ruby-overlay')}
            className="px-2 py-0.5 rounded bg-[#303030] hover:bg-[#3d3d3d] text-rose-300 hover:text-rose-200 border border-rose-500/20 shrink-0 cursor-pointer transition-colors"
          >
            Ruby Overlay
          </button>
        </div>

        {/* Modal Main Body */}
        <div className="flex flex-1 overflow-hidden min-h-[380px]">
          
          {/* Left Effects Sidebar */}
          <div className="w-52 border-r border-white/10 bg-[#252525] p-2 space-y-1 shrink-0 overflow-y-auto">
            <div className="px-2.5 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Effects
            </div>

            {/* Drop Shadow Tab */}
            <div
              onClick={() => setActiveTab('dropShadow')}
              className={`flex items-center justify-between px-2.5 py-2 rounded-lg cursor-pointer transition-all ${
                activeTab === 'dropShadow'
                  ? 'bg-cyan-500/15 text-white font-medium border border-cyan-500/30'
                  : 'text-gray-300 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={ds.enabled}
                  onChange={(e) => {
                    e.stopPropagation();
                    updateStylesState({
                      ...styles,
                      dropShadow: { ...ds, enabled: e.target.checked },
                    });
                  }}
                  className="rounded border-gray-600 text-cyan-500 focus:ring-0 cursor-pointer"
                />
                <span className="text-xs">Drop Shadow</span>
              </div>
              {ds.enabled && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
            </div>

            {/* Stroke Tab */}
            <div
              onClick={() => setActiveTab('stroke')}
              className={`flex items-center justify-between px-2.5 py-2 rounded-lg cursor-pointer transition-all ${
                activeTab === 'stroke'
                  ? 'bg-cyan-500/15 text-white font-medium border border-cyan-500/30'
                  : 'text-gray-300 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={st.enabled}
                  onChange={(e) => {
                    e.stopPropagation();
                    updateStylesState({
                      ...styles,
                      stroke: { ...st, enabled: e.target.checked },
                    });
                  }}
                  className="rounded border-gray-600 text-cyan-500 focus:ring-0 cursor-pointer"
                />
                <span className="text-xs">Stroke</span>
              </div>
              {st.enabled && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
            </div>

            {/* Outer Glow Tab */}
            <div
              onClick={() => setActiveTab('outerGlow')}
              className={`flex items-center justify-between px-2.5 py-2 rounded-lg cursor-pointer transition-all ${
                activeTab === 'outerGlow'
                  ? 'bg-cyan-500/15 text-white font-medium border border-cyan-500/30'
                  : 'text-gray-300 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={og.enabled}
                  onChange={(e) => {
                    e.stopPropagation();
                    updateStylesState({
                      ...styles,
                      outerGlow: { ...og, enabled: e.target.checked },
                    });
                  }}
                  className="rounded border-gray-600 text-cyan-500 focus:ring-0 cursor-pointer"
                />
                <span className="text-xs">Outer Glow</span>
              </div>
              {og.enabled && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
            </div>

            {/* Color Overlay Tab */}
            <div
              onClick={() => setActiveTab('colorOverlay')}
              className={`flex items-center justify-between px-2.5 py-2 rounded-lg cursor-pointer transition-all ${
                activeTab === 'colorOverlay'
                  ? 'bg-cyan-500/15 text-white font-medium border border-cyan-500/30'
                  : 'text-gray-300 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={co.enabled}
                  onChange={(e) => {
                    e.stopPropagation();
                    updateStylesState({
                      ...styles,
                      colorOverlay: { ...co, enabled: e.target.checked },
                    });
                  }}
                  className="rounded border-gray-600 text-cyan-500 focus:ring-0 cursor-pointer"
                />
                <span className="text-xs">Color Overlay</span>
              </div>
              {co.enabled && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
            </div>

            <div className="pt-4 border-t border-white/5">
              <button
                onClick={() => {
                  const cleared: LayerStyles = {
                    dropShadow: { ...ds, enabled: false },
                    stroke: { ...st, enabled: false },
                    outerGlow: { ...og, enabled: false },
                    colorOverlay: { ...co, enabled: false },
                  };
                  updateStylesState(cleared);
                }}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded bg-black/30 hover:bg-red-950/40 text-gray-400 hover:text-red-300 text-[11px] transition-colors cursor-pointer"
              >
                Clear All Styles
              </button>
            </div>
          </div>

          {/* Right Controls Pane */}
          <div className="flex-1 p-5 overflow-y-auto bg-[#1e1e1e]">
            
            {/* 1. DROP SHADOW CONTROLS */}
            {activeTab === 'dropShadow' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="enable-ds"
                      checked={ds.enabled}
                      onChange={(e) =>
                        updateStylesState({
                          ...styles,
                          dropShadow: { ...ds, enabled: e.target.checked },
                        })
                      }
                      className="rounded border-gray-600 text-cyan-500 focus:ring-0 cursor-pointer h-4 w-4"
                    />
                    <label htmlFor="enable-ds" className="text-sm font-semibold text-white cursor-pointer">
                      Enable Drop Shadow
                    </label>
                  </div>
                  <button
                    onClick={handleResetCurrentTab}
                    className="text-gray-400 hover:text-white text-xs flex items-center gap-1 cursor-pointer"
                    title="Reset Drop Shadow"
                  >
                    <RotateCcw className="w-3 h-3" /> Reset
                  </button>
                </div>

                {/* Color & Quick Palette */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-300">Shadow Color</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={ds.color.startsWith('#') && ds.color.length === 7 ? ds.color : '#000000'}
                      onChange={(e) =>
                        updateStylesState({
                          ...styles,
                          dropShadow: { ...ds, color: e.target.value },
                        })
                      }
                      className="h-8 w-12 rounded border border-white/20 bg-transparent cursor-pointer"
                    />
                    <input
                      type="text"
                      value={ds.color}
                      onChange={(e) =>
                        updateStylesState({
                          ...styles,
                          dropShadow: { ...ds, color: e.target.value },
                        })
                      }
                      className="w-24 rounded border border-white/10 bg-black/40 px-2 py-1 text-xs font-mono text-white focus:border-cyan-500 focus:outline-none"
                    />
                    <div className="flex items-center gap-1">
                      {SWATCH_COLORS.slice(0, 5).map((c) => (
                        <button
                          key={c}
                          onClick={() =>
                            updateStylesState({
                              ...styles,
                              dropShadow: { ...ds, color: c },
                            })
                          }
                          className="h-5 w-5 rounded-full border border-black/50 cursor-pointer shadow-xs hover:scale-110 transition-transform"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Opacity */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-300">Opacity</span>
                    <span className="font-mono text-cyan-400">{Math.round(ds.opacity * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={ds.opacity}
                    onChange={(e) =>
                      updateStylesState({
                        ...styles,
                        dropShadow: { ...ds, opacity: parseFloat(e.target.value) },
                      })
                    }
                    className="w-full h-1.5 rounded bg-black/60 accent-cyan-400 cursor-pointer"
                  />
                </div>

                {/* Blur / Size */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-300">Blur Radius</span>
                    <span className="font-mono text-cyan-400">{ds.blur}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="60"
                    value={ds.blur}
                    onChange={(e) =>
                      updateStylesState({
                        ...styles,
                        dropShadow: { ...ds, blur: parseInt(e.target.value, 10) },
                      })
                    }
                    className="w-full h-1.5 rounded bg-black/60 accent-cyan-400 cursor-pointer"
                  />
                </div>

                {/* Offset X & Y */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-300">Offset X</span>
                      <span className="font-mono text-cyan-400">{ds.offsetX}px</span>
                    </div>
                    <input
                      type="range"
                      min="-60"
                      max="60"
                      value={ds.offsetX}
                      onChange={(e) =>
                        updateStylesState({
                          ...styles,
                          dropShadow: { ...ds, offsetX: parseInt(e.target.value, 10) },
                        })
                      }
                      className="w-full h-1.5 rounded bg-black/60 accent-cyan-400 cursor-pointer"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-300">Offset Y</span>
                      <span className="font-mono text-cyan-400">{ds.offsetY}px</span>
                    </div>
                    <input
                      type="range"
                      min="-60"
                      max="60"
                      value={ds.offsetY}
                      onChange={(e) =>
                        updateStylesState({
                          ...styles,
                          dropShadow: { ...ds, offsetY: parseInt(e.target.value, 10) },
                        })
                      }
                      className="w-full h-1.5 rounded bg-black/60 accent-cyan-400 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 2. STROKE CONTROLS */}
            {activeTab === 'stroke' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="enable-stroke"
                      checked={st.enabled}
                      onChange={(e) =>
                        updateStylesState({
                          ...styles,
                          stroke: { ...st, enabled: e.target.checked },
                        })
                      }
                      className="rounded border-gray-600 text-cyan-500 focus:ring-0 cursor-pointer h-4 w-4"
                    />
                    <label htmlFor="enable-stroke" className="text-sm font-semibold text-white cursor-pointer">
                      Enable Stroke Outline
                    </label>
                  </div>
                  <button
                    onClick={handleResetCurrentTab}
                    className="text-gray-400 hover:text-white text-xs flex items-center gap-1 cursor-pointer"
                    title="Reset Stroke"
                  >
                    <RotateCcw className="w-3 h-3" /> Reset
                  </button>
                </div>

                {/* Stroke Color */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-300">Stroke Color</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={st.color.startsWith('#') && st.color.length === 7 ? st.color : '#ffffff'}
                      onChange={(e) =>
                        updateStylesState({
                          ...styles,
                          stroke: { ...st, color: e.target.value },
                        })
                      }
                      className="h-8 w-12 rounded border border-white/20 bg-transparent cursor-pointer"
                    />
                    <input
                      type="text"
                      value={st.color}
                      onChange={(e) =>
                        updateStylesState({
                          ...styles,
                          stroke: { ...st, color: e.target.value },
                        })
                      }
                      className="w-24 rounded border border-white/10 bg-black/40 px-2 py-1 text-xs font-mono text-white focus:border-cyan-500 focus:outline-none"
                    />
                    <div className="flex items-center gap-1">
                      {SWATCH_COLORS.slice(0, 5).map((c) => (
                        <button
                          key={c}
                          onClick={() =>
                            updateStylesState({
                              ...styles,
                              stroke: { ...st, color: c },
                            })
                          }
                          className="h-5 w-5 rounded-full border border-black/50 cursor-pointer shadow-xs hover:scale-110 transition-transform"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Size */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-300">Outline Width</span>
                    <span className="font-mono text-cyan-400">{st.size}px</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="32"
                    value={st.size}
                    onChange={(e) =>
                      updateStylesState({
                        ...styles,
                        stroke: { ...st, size: parseInt(e.target.value, 10) },
                      })
                    }
                    className="w-full h-1.5 rounded bg-black/60 accent-cyan-400 cursor-pointer"
                  />
                </div>

                {/* Opacity */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-300">Opacity</span>
                    <span className="font-mono text-cyan-400">{Math.round(st.opacity * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={st.opacity}
                    onChange={(e) =>
                      updateStylesState({
                        ...styles,
                        stroke: { ...st, opacity: parseFloat(e.target.value) },
                      })
                    }
                    className="w-full h-1.5 rounded bg-black/60 accent-cyan-400 cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* 3. OUTER GLOW CONTROLS */}
            {activeTab === 'outerGlow' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="enable-glow"
                      checked={og.enabled}
                      onChange={(e) =>
                        updateStylesState({
                          ...styles,
                          outerGlow: { ...og, enabled: e.target.checked },
                        })
                      }
                      className="rounded border-gray-600 text-cyan-500 focus:ring-0 cursor-pointer h-4 w-4"
                    />
                    <label htmlFor="enable-glow" className="text-sm font-semibold text-white cursor-pointer">
                      Enable Outer Glow
                    </label>
                  </div>
                  <button
                    onClick={handleResetCurrentTab}
                    className="text-gray-400 hover:text-white text-xs flex items-center gap-1 cursor-pointer"
                    title="Reset Glow"
                  >
                    <RotateCcw className="w-3 h-3" /> Reset
                  </button>
                </div>

                {/* Glow Color */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-300">Glow Color</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={og.color.startsWith('#') && og.color.length === 7 ? og.color : '#38bdf8'}
                      onChange={(e) =>
                        updateStylesState({
                          ...styles,
                          outerGlow: { ...og, color: e.target.value },
                        })
                      }
                      className="h-8 w-12 rounded border border-white/20 bg-transparent cursor-pointer"
                    />
                    <input
                      type="text"
                      value={og.color}
                      onChange={(e) =>
                        updateStylesState({
                          ...styles,
                          outerGlow: { ...og, color: e.target.value },
                        })
                      }
                      className="w-24 rounded border border-white/10 bg-black/40 px-2 py-1 text-xs font-mono text-white focus:border-cyan-500 focus:outline-none"
                    />
                    <div className="flex items-center gap-1">
                      {SWATCH_COLORS.slice(4).map((c) => (
                        <button
                          key={c}
                          onClick={() =>
                            updateStylesState({
                              ...styles,
                              outerGlow: { ...og, color: c },
                            })
                          }
                          className="h-5 w-5 rounded-full border border-black/50 cursor-pointer shadow-xs hover:scale-110 transition-transform"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Glow Blur / Spread */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-300">Glow Spread / Blur</span>
                    <span className="font-mono text-cyan-400">{og.blur}px</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="60"
                    value={og.blur}
                    onChange={(e) =>
                      updateStylesState({
                        ...styles,
                        outerGlow: { ...og, blur: parseInt(e.target.value, 10) },
                      })
                    }
                    className="w-full h-1.5 rounded bg-black/60 accent-cyan-400 cursor-pointer"
                  />
                </div>

                {/* Opacity */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-300">Opacity</span>
                    <span className="font-mono text-cyan-400">{Math.round(og.opacity * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={og.opacity}
                    onChange={(e) =>
                      updateStylesState({
                        ...styles,
                        outerGlow: { ...og, opacity: parseFloat(e.target.value) },
                      })
                    }
                    className="w-full h-1.5 rounded bg-black/60 accent-cyan-400 cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* 4. COLOR OVERLAY CONTROLS */}
            {activeTab === 'colorOverlay' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="enable-co"
                      checked={co.enabled}
                      onChange={(e) =>
                        updateStylesState({
                          ...styles,
                          colorOverlay: { ...co, enabled: e.target.checked },
                        })
                      }
                      className="rounded border-gray-600 text-cyan-500 focus:ring-0 cursor-pointer h-4 w-4"
                    />
                    <label htmlFor="enable-co" className="text-sm font-semibold text-white cursor-pointer">
                      Enable Color Overlay
                    </label>
                  </div>
                  <button
                    onClick={handleResetCurrentTab}
                    className="text-gray-400 hover:text-white text-xs flex items-center gap-1 cursor-pointer"
                    title="Reset Color Overlay"
                  >
                    <RotateCcw className="w-3 h-3" /> Reset
                  </button>
                </div>

                {/* Overlay Color */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-300">Overlay Color</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={co.color.startsWith('#') && co.color.length === 7 ? co.color : '#3b82f6'}
                      onChange={(e) =>
                        updateStylesState({
                          ...styles,
                          colorOverlay: { ...co, color: e.target.value },
                        })
                      }
                      className="h-8 w-12 rounded border border-white/20 bg-transparent cursor-pointer"
                    />
                    <input
                      type="text"
                      value={co.color}
                      onChange={(e) =>
                        updateStylesState({
                          ...styles,
                          colorOverlay: { ...co, color: e.target.value },
                        })
                      }
                      className="w-24 rounded border border-white/10 bg-black/40 px-2 py-1 text-xs font-mono text-white focus:border-cyan-500 focus:outline-none"
                    />
                    <div className="flex items-center gap-1">
                      {SWATCH_COLORS.map((c) => (
                        <button
                          key={c}
                          onClick={() =>
                            updateStylesState({
                              ...styles,
                              colorOverlay: { ...co, color: c },
                            })
                          }
                          className="h-5 w-5 rounded-full border border-black/50 cursor-pointer shadow-xs hover:scale-110 transition-transform"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Opacity */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-300">Overlay Intensity</span>
                    <span className="font-mono text-cyan-400">{Math.round(co.opacity * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={co.opacity}
                    onChange={(e) =>
                      updateStylesState({
                        ...styles,
                        colorOverlay: { ...co, opacity: parseFloat(e.target.value) },
                      })
                    }
                    className="w-full h-1.5 rounded bg-black/60 accent-cyan-400 cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-white/10 bg-[#252525] px-5 py-3">
          <span className="text-[11px] text-gray-400">
            Changes preview directly on canvas in real-time
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCancel}
              className="px-4 py-1.5 rounded-lg border border-white/15 bg-transparent hover:bg-white/5 text-gray-300 hover:text-white text-xs font-medium cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium cursor-pointer transition-colors shadow-md"
            >
              <Check className="w-3.5 h-3.5" /> Apply Styles
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
