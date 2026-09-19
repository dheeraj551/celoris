import React, { useState } from 'react';
import { Layers, Sparkles, Check, Download, Image as ImageIcon, ArrowRight, Palette, Eye } from 'lucide-react';
import { NO_SIGNAL_TEMPLATE } from '../../data/noSignalTemplate';
import { DESIGN_TEMPLATES } from '../../data/templates';

interface TemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadNoSignalTemplate: () => void;
  onLoadPresetTemplate?: (templateId: string) => void;
}

export const TemplatesModal: React.FC<TemplatesModalProps> = ({
  isOpen,
  onClose,
  onLoadNoSignalTemplate,
  onLoadPresetTemplate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'art' | 'social' | 'youtube' | 'poster'>('all');
  const [loadingTemplate, setLoadingTemplate] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelectNoSignal = async () => {
    setLoadingTemplate('no-signal');
    try {
      await onLoadNoSignalTemplate();
      onClose();
    } finally {
      setLoadingTemplate(null);
    }
  };

  const handleSelectPreset = (id: string) => {
    if (onLoadPresetTemplate) {
      setLoadingTemplate(id);
      try {
        onLoadPresetTemplate(id);
        onClose();
      } finally {
        setLoadingTemplate(null);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pl-window-overlay p-4">
      <div className="pl-window pl-window-anim w-full max-w-3xl max-h-[88vh] flex flex-col p-5 text-gray-300 overflow-hidden shadow-2xl border border-white/10">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="pl-traffic-lights" role="group" aria-label="Window controls">
              <button type="button" onClick={onClose} className="pl-traffic-dot pl-dot-red" title="Close" />
              <span className="pl-traffic-dot pl-dot-yellow" />
              <span className="pl-traffic-dot pl-dot-green" />
            </div>
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <Layers className="h-4 w-4 text-cyan-400" />
              Templates & Multi-Layer Projects
            </h2>
          </div>
          <span className="text-[11px] text-gray-400">Click any template to get all layers ready to edit</span>
        </div>

        {/* Filter Categories */}
        <div className="flex items-center gap-1.5 py-2.5 border-b border-white/5 shrink-0 overflow-x-auto text-[11px]">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-medium'
                : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
            }`}
          >
            All Templates
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('art')}
            className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
              selectedCategory === 'art'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-medium'
                : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
            }`}
          >
            🎨 Multi-Layer Art
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('poster')}
            className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
              selectedCategory === 'poster'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-medium'
                : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
            }`}
          >
            Posters
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('social')}
            className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
              selectedCategory === 'social'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-medium'
                : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
            }`}
          >
            Social Posts
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('youtube')}
            className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
              selectedCategory === 'youtube'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-medium'
                : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
            }`}
          >
            YouTube Banners
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto py-3 space-y-4 pr-1">
          {/* FEATURED: No Signal Phone Booth Art Poster */}
          {(selectedCategory === 'all' || selectedCategory === 'art' || selectedCategory === 'poster') && (
            <div className="relative rounded-xl border border-cyan-500/40 bg-gradient-to-br from-[#1d2736] via-[#1a202c] to-[#141824] p-4 shadow-lg overflow-hidden">
              <div className="absolute top-3 right-3 flex items-center gap-1.5">
                <span className="rounded-full bg-cyan-500/20 border border-cyan-500/50 px-2 py-0.5 text-[9px] font-bold text-cyan-300 uppercase tracking-wider">
                  Featured Multi-Layer Art
                </span>
                <span className="rounded-full bg-red-500/20 border border-red-500/40 px-2 py-0.5 text-[9px] font-bold text-red-300 uppercase tracking-wider">
                  6 Layers
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-start">
                {/* Thumbnail Preview */}
                <div className="relative w-28 h-48 sm:w-36 sm:h-56 rounded-lg overflow-hidden border border-black shadow-md shrink-0 bg-neutral-900 group">
                  <img
                    src={NO_SIGNAL_TEMPLATE.thumbnail}
                    alt={NO_SIGNAL_TEMPLATE.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-2 left-2 right-2 text-center text-[10px] text-white/90 font-mono">
                    576 × 1024
                  </div>
                </div>

                {/* Info & Layers details */}
                <div className="flex-1 flex flex-col justify-between self-stretch">
                  <div>
                    <h3 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
                      <span>{NO_SIGNAL_TEMPLATE.title}</span>
                    </h3>
                    <p className="text-[11px] text-gray-300 mt-1 leading-relaxed">
                      {NO_SIGNAL_TEMPLATE.description}
                    </p>

                    {/* Breakdown of layers */}
                    <div className="mt-3">
                      <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">
                        Separated Layers Included:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px]">
                        {NO_SIGNAL_TEMPLATE.layers.map((layer, idx) => (
                          <div
                            key={layer.id}
                            className="flex items-center gap-1.5 rounded bg-black/30 border border-white/5 px-2 py-1 text-gray-300"
                          >
                            <span className="w-4 h-4 flex items-center justify-center rounded-full bg-cyan-950 text-cyan-300 text-[9px] font-mono shrink-0">
                              {idx + 1}
                            </span>
                            <span className="truncate">{layer.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[11px] text-cyan-400">
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Ready to move, edit, hide & style each layer</span>
                    </div>

                    <button
                      type="button"
                      onClick={handleSelectNoSignal}
                      disabled={loadingTemplate === 'no-signal'}
                      className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 active:scale-95 px-4 py-2 text-xs font-semibold text-white shadow-md transition-all cursor-pointer disabled:opacity-50"
                    >
                      {loadingTemplate === 'no-signal' ? (
                        <span>Loading Layers...</span>
                      ) : (
                        <>
                          <span>Load All 6 Layers & Edit</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* OTHER PRESET TEMPLATES */}
          <div>
            <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Other Design Presets & Compositions
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {DESIGN_TEMPLATES.filter(
                (t) =>
                  selectedCategory === 'all' ||
                  (selectedCategory === 'social' && t.category === 'social') ||
                  (selectedCategory === 'youtube' && t.category === 'youtube') ||
                  (selectedCategory === 'poster' && t.category === 'poster')
              ).map((template) => (
                <div
                  key={template.id}
                  onClick={() => handleSelectPreset(template.id)}
                  className="rounded-lg border border-white/10 bg-[#1f1f1f] hover:bg-[#282828] hover:border-cyan-500/40 p-3 flex flex-col justify-between transition-all cursor-pointer group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono text-cyan-400">{template.categoryLabel}</span>
                      <span className="text-[10px] text-gray-500 font-mono">
                        {template.width}×{template.height}
                      </span>
                    </div>
                    <h4 className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors">
                      {template.title}
                    </h4>
                    <p className="text-[10px] text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                      {template.description}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px]">
                    <span className="text-gray-500">{template.badgeText}</span>
                    <span className="text-cyan-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      Open <ArrowRight className="h-2.5 w-2.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between shrink-0 text-[11px]">
          <span className="text-gray-500">
            Tip: Use the <span className="text-cyan-400">Move Tool (V)</span> to move any layer independently.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded px-3 py-1 bg-white/10 hover:bg-white/15 text-gray-300 hover:text-white cursor-pointer transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
