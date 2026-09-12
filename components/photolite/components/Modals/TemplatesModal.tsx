import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  X,
  Search,
  LayoutTemplate,
  Check,
  Layers as LayersIcon,
  Sparkles,
  ArrowRight,
  Monitor,
  Smartphone,
  Square,
  Image as ImageIcon,
  Tag,
  Info,
} from 'lucide-react';
import { DESIGN_TEMPLATES, DesignTemplate } from '../../data/templates';
import { Layer } from '../../types';

interface TemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: DesignTemplate) => void;
  currentLayersCount: number;
}

type CategoryFilter = 'all' | 'social' | 'youtube' | 'story' | 'banner' | 'poster';

const CATEGORIES: { id: CategoryFilter; label: string; icon: React.ElementType }[] = [
  { id: 'all', label: 'All Templates', icon: LayoutTemplate },
  { id: 'social', label: 'Social Media', icon: Square },
  { id: 'youtube', label: 'YouTube Thumbnail', icon: Monitor },
  { id: 'story', label: 'Story & Reels', icon: Smartphone },
  { id: 'banner', label: 'Banners & Web', icon: ImageIcon },
  { id: 'poster', label: 'Posters & Flyers', icon: Tag },
];

export const TemplatesModal: React.FC<TemplatesModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
  currentLayersCount,
}) => {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<DesignTemplate | null>(null);
  const [thumbnails, setThumbnails] = useState<Record<string, string>>({});
  const [isGeneratingThumbs, setIsGeneratingThumbs] = useState(false);
  const [confirmReplace, setConfirmReplace] = useState(false);

  // Generate thumbnail previews on mount
  useEffect(() => {
    if (!isOpen) return;

    // Check if all thumbnails are already cached
    const missing = DESIGN_TEMPLATES.some((t) => !thumbnails[t.id]);
    if (!missing) return;

    setIsGeneratingThumbs(true);
    const newThumbs: Record<string, string> = { ...thumbnails };

    // Offscreen generation in timeout to avoid UI blocking
    const timer = setTimeout(() => {
      DESIGN_TEMPLATES.forEach((tmpl) => {
        if (newThumbs[tmpl.id]) return;
        try {
          const { layers } = tmpl.generateLayers();
          // Scale down to max 320x320 thumbnail keeping aspect ratio
          const maxThumbDim = 320;
          const scale = Math.min(maxThumbDim / tmpl.width, maxThumbDim / tmpl.height);
          const thumbW = Math.round(tmpl.width * scale);
          const thumbH = Math.round(tmpl.height * scale);

          const thumbCanvas = document.createElement('canvas');
          thumbCanvas.width = thumbW;
          thumbCanvas.height = thumbH;
          const ctx = thumbCanvas.getContext('2d');

          if (ctx) {
            layers.forEach((l) => {
              if (!l.visible) return;
              ctx.save();
              ctx.globalAlpha = Math.max(0, Math.min(1, l.opacity));
              ctx.globalCompositeOperation = l.blendMode;
              ctx.drawImage(l.canvas, 0, 0, thumbW, thumbH);
              ctx.restore();
            });
            newThumbs[tmpl.id] = thumbCanvas.toDataURL('image/jpeg', 0.85);
          }
        } catch (err) {
          console.error(`Failed to generate thumbnail for ${tmpl.id}`, err);
        }
      });
      setThumbnails(newThumbs);
      setIsGeneratingThumbs(false);
    }, 10);

    return () => clearTimeout(timer);
  }, [isOpen]);

  // Filter templates
  const filteredTemplates = useMemo(() => {
    return DESIGN_TEMPLATES.filter((tmpl) => {
      const matchesCategory = activeCategory === 'all' || tmpl.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        tmpl.title.toLowerCase().includes(q) ||
        tmpl.description.toLowerCase().includes(q) ||
        tmpl.tags.some((t) => t.toLowerCase().includes(q)) ||
        tmpl.categoryLabel.toLowerCase().includes(q);

      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, searchQuery]);

  if (!isOpen) return null;

  const handleApply = (tmpl: DesignTemplate) => {
    if (currentLayersCount > 1 && !confirmReplace) {
      setSelectedTemplate(tmpl);
      setConfirmReplace(true);
      return;
    }
    onSelectTemplate(tmpl);
    setConfirmReplace(false);
    setSelectedTemplate(null);
    onClose();
  };

  return (
    <div
      id="templates-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center pl-window-overlay p-3 sm:p-5"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="templates-modal-container"
        className="pl-window pl-window-anim flex h-[90vh] max-h-[850px] w-full max-w-5xl flex-col text-gray-200 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-5 py-3.5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="pl-traffic-lights" role="group" aria-label="Window controls">
              <button type="button" id="close-templates-modal-btn" onClick={onClose} className="pl-traffic-dot pl-dot-red" title="Close" />
              <span className="pl-traffic-dot pl-dot-yellow" />
              <span className="pl-traffic-dot pl-dot-green" />
            </div>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-cyan-600 to-blue-500 text-white shadow-md">
              <LayoutTemplate className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                Canva-Style Design Templates
                <span className="rounded-full bg-cyan-950/80 px-2 py-0.5 text-[10px] font-mono text-cyan-400 border border-cyan-500/40">
                  {DESIGN_TEMPLATES.length} Free Templates
                </span>
              </h2>
              <p className="text-[11px] text-gray-400">
                Choose a pre-designed template with fully editable layers, typography, graphics, and blend modes.
              </p>
            </div>
          </div>
        </div>

        {/* Toolbar: Categories & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 border-b border-black bg-[#1e1e1e] px-5 py-2.5 shrink-0">
          {/* Category tabs */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  id={`cat-tab-${cat.id}`}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-1.5 whitespace-nowrap rounded px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer border ${
                    isActive
                      ? 'bg-cyan-600 border-cyan-500 text-white shadow-sm'
                      : 'border-transparent bg-[#2a2a2a] text-gray-300 hover:bg-[#333333] hover:text-white'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search box */}
          <div className="relative w-full sm:w-64 shrink-0">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <input
              type="text"
              id="search-templates-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search templates, tags..."
              className="w-full rounded bg-[#2a2a2a] border border-black pl-8 pr-7 py-1 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>

        {/* Main Content Area: Grid + Preview Drawer */}
        <div className="flex flex-1 overflow-hidden min-h-0">
          {/* Templates Grid */}
          <div className="flex-1 overflow-y-auto p-5 scrollbar-thin scrollbar-thumb-[#444]">
            {filteredTemplates.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <LayoutTemplate className="h-10 w-10 text-gray-500 mb-2 stroke-1" />
                <p className="text-sm font-medium text-gray-300">No templates found</p>
                <p className="text-xs text-gray-500 mt-1">Try searching for a different keyword or category.</p>
                <button
                  onClick={() => {
                    setActiveCategory('all');
                    setSearchQuery('');
                  }}
                  className="mt-3 rounded bg-[#333] px-3 py-1 text-xs text-cyan-400 hover:bg-[#444] cursor-pointer"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredTemplates.map((tmpl) => {
                  const isSelected = selectedTemplate?.id === tmpl.id;
                  const thumb = thumbnails[tmpl.id];

                  return (
                    <div
                      key={tmpl.id}
                      id={`template-card-${tmpl.id}`}
                      onClick={() => setSelectedTemplate(tmpl)}
                      className={`group flex flex-col rounded-lg border bg-[#282828] overflow-hidden transition-all duration-150 cursor-pointer ${
                        isSelected
                          ? 'border-cyan-400 ring-2 ring-cyan-400/40 bg-[#2d2d2d]'
                          : 'border-black hover:border-neutral-500 hover:bg-[#303030]'
                      }`}
                    >
                      {/* Thumbnail Container */}
                      <div className="relative aspect-video w-full bg-[#161616] flex items-center justify-center overflow-hidden border-b border-black/40">
                        {thumb ? (
                          <img
                            src={thumb}
                            alt={tmpl.title}
                            className="max-h-full max-w-full object-contain transition-transform duration-200 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <Sparkles className="h-4 w-4 animate-spin text-cyan-400" />
                            <span>Rendering...</span>
                          </div>
                        )}

                        {/* Top badge */}
                        <div className="absolute top-2 right-2 flex items-center gap-1">
                          <span className="rounded bg-black/70 backdrop-blur-sm px-1.5 py-0.5 text-[9px] font-mono text-gray-300 border border-white/10">
                            {tmpl.width}×{tmpl.height}
                          </span>
                        </div>
                      </div>

                      {/* Card Info */}
                      <div className="flex flex-col flex-1 p-3">
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="text-[10px] font-semibold text-cyan-400 uppercase tracking-wider truncate">
                            {tmpl.categoryLabel}
                          </span>
                          <span className="text-[10px] text-gray-400 flex items-center gap-1">
                            <LayersIcon className="h-3 w-3" />
                            Layers
                          </span>
                        </div>

                        <h3 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                          {tmpl.title}
                        </h3>

                        <p className="text-[11px] text-gray-400 line-clamp-2 mt-1 flex-1 leading-relaxed">
                          {tmpl.description}
                        </p>

                        {/* Action Bar */}
                        <div className="mt-3 pt-2 border-t border-black/50 flex items-center justify-between">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleApply(tmpl);
                            }}
                            className="flex items-center gap-1 rounded bg-cyan-600 hover:bg-cyan-500 px-2.5 py-1 text-[11px] font-medium text-white transition-colors cursor-pointer shadow-sm"
                          >
                            <span>Use Template</span>
                            <ArrowRight className="h-3 w-3" />
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTemplate(tmpl);
                            }}
                            className="text-[11px] text-gray-400 hover:text-white px-1.5 py-0.5 rounded hover:bg-[#3c3c3c] cursor-pointer"
                          >
                            Details
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Inspector Drawer (when a template is selected) */}
          {selectedTemplate && (
            <div className="w-80 border-l border-black bg-[#262626] p-4 flex flex-col justify-between overflow-y-auto shrink-0 animate-in slide-in-from-right-4 duration-200">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-black pb-2.5">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Info className="h-3.5 w-3.5 text-cyan-400" />
                    Template Inspector
                  </h3>
                  <button
                    onClick={() => setSelectedTemplate(null)}
                    className="text-gray-400 hover:text-white text-xs"
                  >
                    Close
                  </button>
                </div>

                {/* Big Preview */}
                <div className="rounded border border-black bg-[#161616] p-2 flex items-center justify-center min-h-[160px] max-h-[220px]">
                  {thumbnails[selectedTemplate.id] ? (
                    <img
                      src={thumbnails[selectedTemplate.id]}
                      alt={selectedTemplate.title}
                      className="max-h-full max-w-full object-contain rounded"
                    />
                  ) : (
                    <span className="text-xs text-gray-500">Loading Preview...</span>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white">{selectedTemplate.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="rounded bg-cyan-950 text-cyan-300 border border-cyan-600/40 px-1.5 py-0.5 text-[10px] font-medium">
                      {selectedTemplate.categoryLabel}
                    </span>
                    <span className="text-[11px] font-mono text-gray-400">
                      {selectedTemplate.width} × {selectedTemplate.height} px
                    </span>
                  </div>
                  <p className="text-xs text-gray-300 mt-2 leading-relaxed">
                    {selectedTemplate.description}
                  </p>
                </div>

                {/* Layer Breakdown list */}
                <div>
                  <h5 className="text-[11px] font-semibold text-gray-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <LayersIcon className="h-3 w-3 text-cyan-400" />
                    Included Editable Layers
                  </h5>
                  <div className="space-y-1 max-h-48 overflow-y-auto rounded border border-black bg-[#1c1c1c] p-2 text-xs">
                    {(() => {
                      try {
                        const { layers } = selectedTemplate.generateLayers();
                        return layers.map((l, idx) => (
                          <div
                            key={l.id || idx}
                            className="flex items-center justify-between py-0.5 border-b border-neutral-800 last:border-0 text-[11px]"
                          >
                            <span className="text-gray-300 truncate mr-2">
                              {idx + 1}. {l.name}
                            </span>
                            <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-[#2b2b2b] text-gray-400 uppercase">
                              {l.type}
                            </span>
                          </div>
                        ));
                      } catch {
                        return <span className="text-gray-500">Could not read layers</span>;
                      }
                    })()}
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <span className="text-[10px] uppercase text-gray-400 font-semibold block mb-1">Tags</span>
                  <div className="flex flex-wrap gap-1">
                    {selectedTemplate.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded bg-[#1a1a1a] border border-neutral-700 px-1.5 py-0.5 text-[10px] text-gray-300"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Action */}
              <div className="pt-4 border-t border-black space-y-2 mt-4">
                <button
                  id="btn-apply-selected-template"
                  onClick={() => handleApply(selectedTemplate)}
                  className="w-full flex items-center justify-center gap-2 rounded bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 px-4 py-2 text-xs font-bold text-white shadow-md transition-all cursor-pointer"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Customize Template Now</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Replace Confirmation Dialog if user already has work on canvas */}
        {confirmReplace && selectedTemplate && (
          <div className="fixed inset-0 z-60 flex items-center justify-center pl-window-overlay p-4">
            <div className="pl-window pl-window-anim w-full max-w-sm p-4 text-gray-200">
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5 mb-2">
                <Info className="h-4 w-4 text-amber-400" />
                Replace Current Canvas?
              </h4>
              <p className="text-xs text-gray-300 leading-relaxed mb-4">
                Loading "{selectedTemplate.title}" will create a new {selectedTemplate.width}×{selectedTemplate.height} document with its editable layers. Your current session will be saved in the Undo/Redo history stack.
              </p>
              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => setConfirmReplace(false)}
                  className="rounded bg-[#383838] px-3 py-1 text-xs text-gray-300 hover:bg-[#444] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onSelectTemplate(selectedTemplate);
                    setConfirmReplace(false);
                    onClose();
                  }}
                  className="rounded bg-cyan-600 hover:bg-cyan-500 px-3 py-1 text-xs font-semibold text-white cursor-pointer"
                >
                  Confirm & Load
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-black bg-[#242424] px-5 py-2.5 text-[11px] text-gray-400 shrink-0">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>All templates feature vector shapes, custom typography & modular layers</span>
          </div>
          <button
            onClick={onClose}
            className="rounded bg-[#333333] hover:bg-[#3f3f3f] px-3 py-1 text-xs text-gray-200 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
