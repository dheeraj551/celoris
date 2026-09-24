"use client"

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Sparkles,
  Check,
  Download,
  Share2,
  Play,
  RotateCcw,
  Zap,
  Film,
  Layers,
  ArrowRight,
  Search,
  ExternalLink,
  Users,
  Eye,
  Heart,
  Sliders,
  Maximize2
} from 'lucide-react';
import {
  GENJUTSU_MODELS,
  ModelOption,
  PRESET_MOTIONS,
  PresetMotion,
  GenerationHistoryItem
} from './genjutsuData';

// ----------------------------------------------------------------------
// 1. Model Picker Modal
// ----------------------------------------------------------------------
export function ModelPickerModal({
  isOpen,
  onClose,
  selectedModel,
  onSelectModel,
}: {
  isOpen: boolean;
  onClose: () => void;
  selectedModel: string;
  onSelectModel: (model: ModelOption) => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-xl bg-[#12141a] border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#d4f634]/15 border border-[#d4f634]/30 flex items-center justify-center text-[#d4f634]">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Select AI Engine Model</h2>
            <p className="text-xs text-zinc-400">Choose the optimal neural synthesizer for your motion transfer</p>
          </div>
        </div>

        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          {GENJUTSU_MODELS.map((model) => {
            const isSelected = selectedModel === model.name;
            return (
              <div
                key={model.id}
                onClick={() => {
                  onSelectModel(model);
                  onClose();
                }}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                  isSelected
                    ? 'border-[#d4f634] bg-[#d4f634]/10 shadow-[0_0_20px_rgba(212,246,52,0.15)]'
                    : 'border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]'
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm text-white">{model.name}</span>
                    {model.badge && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#d4f634] text-black uppercase tracking-wider">
                        {model.badge}
                      </span>
                    )}
                    <span className="text-[11px] text-zinc-400 ml-auto font-mono">{model.fps} fps</span>
                  </div>
                  <p className="text-xs text-zinc-300 font-medium mb-1">{model.subtitle}</p>
                  <p className="text-xs text-zinc-500 leading-relaxed">{model.description}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0 pt-1">
                  <span className="text-xs font-mono text-zinc-400">
                    {model.creditCost > 0 ? `${model.creditCost} credits` : 'Included with Pro'}
                  </span>
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'border-[#d4f634] bg-[#d4f634] text-black'
                        : 'border-zinc-600'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}

// ----------------------------------------------------------------------
// 2. Motion Library Modal
// ----------------------------------------------------------------------
export function MotionLibraryModal({
  isOpen,
  onClose,
  onSelectPreset,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelectPreset: (preset: PresetMotion) => void;
}) {
  const [activeTab, setActiveTab] = useState<'all' | 'community' | 'higgsfield'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filtered = PRESET_MOTIONS.filter((m) => {
    const matchesTab = activeTab === 'all' || m.category === activeTab;
    const matchesSearch =
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 15 }}
        className="w-full max-w-4xl bg-[#0f1117] border border-white/10 rounded-2xl flex flex-col max-h-[88vh] shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Curated Motion Library</h2>
              <p className="text-xs text-zinc-400">
                Extract movement, camera trajectory, and choreography from top creators
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="px-6 py-3 border-b border-white/10 flex flex-wrap items-center justify-between gap-4 bg-black/20">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeTab === 'all'
                  ? 'bg-white text-black font-semibold'
                  : 'bg-white/5 text-zinc-400 hover:text-white'
              }`}
            >
              All Motions
            </button>
            <button
              onClick={() => setActiveTab('community')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'community'
                  ? 'bg-white text-black font-semibold'
                  : 'bg-white/5 text-zinc-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              Community
            </button>
            <button
              onClick={() => setActiveTab('higgsfield')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'higgsfield'
                  ? 'bg-white text-black font-semibold'
                  : 'bg-white/5 text-zinc-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#d4f634]" />
              Higgsfield Official
            </button>
          </div>

          <div className="relative w-64">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search choreography, walks, stunts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white/5 border border-white/10 rounded-full text-white placeholder-zinc-500 focus:outline-none focus:border-[#d4f634]"
            />
          </div>
        </div>

        {/* Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filtered.map((preset) => (
            <div
              key={preset.id}
              className="group rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden hover:border-[#d4f634]/60 transition-all flex flex-col"
            >
              <div className="relative aspect-video bg-black overflow-hidden">
                <img
                  src={preset.thumbnailUrl}
                  alt={preset.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-mono text-zinc-300">
                  {preset.duration}
                </span>
                {preset.badge && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[#d4f634] text-black text-[9px] font-bold uppercase tracking-wider">
                    {preset.badge}
                  </span>
                )}
              </div>
              <div className="p-3.5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-semibold text-xs text-white group-hover:text-[#d4f634] transition-colors line-clamp-1">
                    {preset.title}
                  </h4>
                  <p className="text-[11px] text-zinc-400 line-clamp-2 mt-1">
                    {preset.description}
                  </p>
                </div>
                <div className="pt-3 mt-3 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-[10px] text-zinc-500">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" /> {preset.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3" /> {preset.likes}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      onSelectPreset(preset);
                      onClose();
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-[#d4f634] hover:text-black text-white text-[11px] font-medium transition-colors"
                  >
                    Use Motion
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// ----------------------------------------------------------------------
// 3. How It Works Modal
// ----------------------------------------------------------------------
export function HowItWorksModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl bg-[#111319] border border-white/10 rounded-2xl p-6 shadow-2xl relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center max-w-md mx-auto mb-8">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#d4f634] px-3 py-1 rounded-full bg-[#d4f634]/10 border border-[#d4f634]/30">
            Higgsfield Genjutsu Architecture
          </span>
          <h2 className="text-2xl font-extrabold text-white mt-3">How Reality Manipulation Works</h2>
          <p className="text-xs text-zinc-400 mt-2">
            Turn single footage into infinite variations by decoupling motion physics from character identity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {/* Card 1 */}
          <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02]">
            <div className="w-8 h-8 rounded-lg bg-[#d4f634]/15 text-[#d4f634] flex items-center justify-center mb-3">
              <Film className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1">1. Motion Transfer</h3>
            <p className="text-xs text-zinc-400 leading-relaxed mb-3">
              Extract dance choreography, camera parallax, and physics from an existing video (4–30s). Provide one or more reference images of your character or mascot, and Genjutsu re-renders them performing the exact performance frame-for-frame.
            </p>
            <div className="text-[11px] text-[#d4f634] font-medium">
              Ideal for: Dance trends, game avatars, dynamic commercials.
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02]">
            <div className="w-8 h-8 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center mb-3">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1">2. Objects Swap</h3>
            <p className="text-xs text-zinc-400 leading-relaxed mb-3">
              Surgically replace garments, handheld products, background environments, or accessories while locking down original lighting, shadow dynamics, and camera movement without green screens.
            </p>
            <div className="text-[11px] text-blue-400 font-medium">
              Ideal for: E-commerce packshots, apparel changes, product placement.
            </div>
          </div>
        </div>

        {/* 3 Step Flow */}
        <div className="p-4 rounded-xl bg-black/40 border border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex-1">
            <span className="text-[10px] font-mono text-zinc-500">STEP 01</span>
            <p className="text-xs font-semibold text-white">Upload Reference Clip</p>
          </div>
          <ArrowRight className="w-4 h-4 text-zinc-600 hidden md:block" />
          <div className="flex-1">
            <span className="text-[10px] font-mono text-zinc-500">STEP 02</span>
            <p className="text-xs font-semibold text-white">Attach Identity Images</p>
          </div>
          <ArrowRight className="w-4 h-4 text-zinc-600 hidden md:block" />
          <div className="flex-1">
            <span className="text-[10px] font-mono text-zinc-500">STEP 03</span>
            <p className="text-xs font-semibold text-white">Generate a 720p Video</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ----------------------------------------------------------------------
// 4. Generation History Drawer
// ----------------------------------------------------------------------
export function HistoryDrawer({
  isOpen,
  onClose,
  history,
  onSelectVideo,
}: {
  isOpen: boolean;
  onClose: () => void;
  history: GenerationHistoryItem[];
  onSelectVideo: (item: GenerationHistoryItem) => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm">
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="w-full max-w-md bg-[#111319] border-l border-white/10 h-full p-6 flex flex-col shadow-2xl"
      >
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <h3 className="text-lg font-bold text-white">Generation History</h3>
            <p className="text-xs text-zinc-400">Past motions, recasts & object swaps</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {history.length === 0 ? (
            <div className="text-center py-12 text-zinc-500 text-xs">
              No generations recorded yet. Click Generate to recast your first video!
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectVideo(item)}
                className="group p-3 rounded-xl border border-white/10 bg-white/[0.02] hover:border-[#d4f634]/50 hover:bg-white/[0.05] transition-all cursor-pointer flex gap-3"
              >
                <div className="w-24 h-16 rounded-lg overflow-hidden bg-black relative shrink-0 flex items-center justify-center">
                  {item.status === 'completed' && item.videoUrl ? (
                    <video
                      src={`${item.videoUrl}#t=0.5`}
                      preload="metadata"
                      muted
                      playsInline
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : item.status === 'queued' || item.status === 'in_progress' ? (
                    <span className="text-[10px] text-[#d4f634] animate-pulse">Rendering…</span>
                  ) : (
                    <span className="text-[10px] text-red-400">Failed</span>
                  )}
                  {item.duration && (
                    <span className="absolute bottom-1 right-1 px-1 rounded bg-black/80 text-[9px] font-mono text-white">
                      {item.duration}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-[#d4f634] uppercase tracking-wider">
                      {item.mode === 'motion-transfer' ? 'Motion Transfer' : 'Object Swap'}
                    </span>
                    <span className="text-[10px] text-zinc-500">{item.createdAt}</span>
                  </div>
                  <h4 className="text-xs font-semibold text-white truncate mt-0.5">{item.title}</h4>
                  <p className={`text-[11px] truncate mt-0.5 ${item.status === 'failed' || item.status === 'nsfw' ? 'text-red-300' : 'text-zinc-400'}`}>
                    {item.status === 'failed' || item.status === 'nsfw' || item.status === 'canceled'
                      ? item.error || 'Render failed'
                      : item.prompt || item.model}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}

// ----------------------------------------------------------------------
// 5. Result Modal (Celebration / Output)
// ----------------------------------------------------------------------
export function GenerationResultModal({
  isOpen,
  onClose,
  result,
}: {
  isOpen: boolean;
  onClose: () => void;
  result: {
    videoUrl: string;
    thumbnailUrl: string;
    title: string;
    prompt?: string;
    model: string;
    quality: string;
    duration: string;
  } | null;
}) {
  const [isPlaying, setIsPlaying] = useState(true);

  if (!isOpen || !result) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl bg-[#111319] border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-[#d4f634] text-black flex items-center justify-center font-bold">
            ✓
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Motion Synthesis Complete</h3>
            <p className="text-xs text-zinc-400">{result.model} • {result.quality}</p>
          </div>
        </div>

        {/* Video Player */}
        <div className="rounded-xl overflow-hidden bg-black border border-white/10 aspect-video relative group mb-4">
          {result.videoUrl ? (
            <video
              src={result.videoUrl}
              autoPlay
              loop
              muted
              playsInline
              controls
              className="w-full h-full object-contain"
            />
          ) : (
            <img
              src={result.thumbnailUrl}
              alt={result.title}
              className="w-full h-full object-cover"
            />
          )}

          <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
            <span className="px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-xs font-mono text-white border border-white/10">
              {result.duration ? `${result.duration} • ` : ''}{result.quality}
            </span>
            <span className="px-2 py-0.5 rounded bg-[#d4f634] text-black text-[10px] font-bold uppercase tracking-wider">
              Ready to Export
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="bg-black/30 border border-white/5 rounded-xl p-3.5 mb-5">
          <h4 className="text-xs font-bold text-white mb-1">{result.title}</h4>
          <p className="text-[11px] text-zinc-400 leading-relaxed">
            {result.prompt || 'Synthesized using Higgsfield Genjutsu reality manipulation neural network.'}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-white transition-colors"
          >
            Create Another
          </button>

          <div className="flex items-center gap-2">
            <a
              href={`${result.videoUrl}?download=1`}
              download="celoris-motion-swap.mp4"
              className="px-5 py-2.5 rounded-xl bg-[#d4f634] hover:bg-[#cbf11e] text-black text-xs font-bold transition-all shadow-[0_0_15px_rgba(212,246,52,0.3)] flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download MP4
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
