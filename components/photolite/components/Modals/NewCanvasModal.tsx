import React, { useState } from 'react';
import { Plus, Monitor, Smartphone, Square, Image } from 'lucide-react';

interface NewCanvasModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (width: number, height: number, bgColor: string, name: string) => void;
}

const PRESETS = [
  { name: 'Full HD (1920×1080)', w: 1920, h: 1080, icon: Monitor },
  { name: 'Standard (1200×800)', w: 1200, h: 800, icon: Image },
  { name: 'Square Post (1080×1080)', w: 1080, h: 1080, icon: Square },
  { name: 'Social Banner (1200×630)', w: 1200, h: 630, icon: Image },
  { name: 'Mobile Story (1080×1920)', w: 1080, h: 1920, icon: Smartphone },
  { name: 'Web Compact (800×600)', w: 800, h: 600, icon: Monitor },
];

export const NewCanvasModal: React.FC<NewCanvasModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [width, setWidth] = useState(1200);
  const [height, setHeight] = useState(800);
  const [name, setName] = useState('New Project');
  const [bgType, setBgType] = useState<'white' | 'transparent' | 'dark' | 'custom'>('white');
  const [customBg, setCustomBg] = useState('#202020');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let bg = '#ffffff';
    if (bgType === 'transparent') bg = 'transparent';
    else if (bgType === 'dark') bg = '#121316';
    else if (bgType === 'custom') bg = customBg;

    onCreate(Math.max(50, width), Math.max(50, height), bg, name.trim() || 'Untitled');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pl-window-overlay p-4">
      <div className="pl-window pl-window-anim w-full max-w-lg p-5 text-gray-300">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="pl-traffic-lights" role="group" aria-label="Window controls">
              <button type="button" onClick={onClose} className="pl-traffic-dot pl-dot-red" title="Close" />
              <span className="pl-traffic-dot pl-dot-yellow" />
              <span className="pl-traffic-dot pl-dot-green" />
            </div>
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <Plus className="h-4 w-4 text-cyan-400" />
              Create New Document
            </h2>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-3.5 space-y-3 text-xs">
          {/* Document name */}
          <div>
            <label className="block text-gray-300 font-medium mb-1">Document Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded bg-[#1a1a1a] border border-black px-2.5 py-1 text-xs text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Quick Presets */}
          <div>
            <label className="block text-gray-400 font-medium mb-1.5 text-[11px]">Preset Dimensions</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {PRESETS.map((p) => {
                const Icon = p.icon;
                const isSelected = width === p.w && height === p.h;
                return (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => {
                      setWidth(p.w);
                      setHeight(p.h);
                    }}
                    className={`flex items-center gap-2 rounded p-1.5 text-left border transition-colors cursor-pointer ${
                      isSelected
                        ? 'border-cyan-400 bg-[#1a1a1a] text-cyan-300'
                        : 'border-black bg-[#1f1f1f] text-gray-300 hover:bg-[#333333]'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                    <div>
                      <div className="font-medium text-[11px] truncate">{p.name}</div>
                      <div className="text-[10px] text-gray-500">{p.w}×{p.h}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dimensions Custom */}
          <div className="grid grid-cols-2 gap-2.5 pt-0.5">
            <div>
              <label className="block text-gray-300 font-medium mb-1">Width (px)</label>
              <input
                type="number"
                min="50"
                max="8000"
                value={width}
                onChange={(e) => setWidth(Number(e.target.value))}
                className="w-full rounded bg-[#1a1a1a] border border-black px-2.5 py-1 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>
            <div>
              <label className="block text-gray-300 font-medium mb-1">Height (px)</label>
              <input
                type="number"
                min="50"
                max="8000"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="w-full rounded bg-[#1a1a1a] border border-black px-2.5 py-1 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>
          </div>

          {/* Background selection */}
          <div>
            <label className="block text-gray-300 font-medium mb-1 text-[11px]">Background Content</label>
            <div className="grid grid-cols-4 gap-1.5">
              <button
                type="button"
                onClick={() => setBgType('white')}
                className={`rounded py-1 border text-center font-medium cursor-pointer ${
                  bgType === 'white'
                    ? 'border-cyan-400 bg-[#1a1a1a] text-white'
                    : 'border-black bg-[#1f1f1f] text-gray-400 hover:bg-[#333333]'
                }`}
              >
                White
              </button>
              <button
                type="button"
                onClick={() => setBgType('transparent')}
                className={`rounded py-1 border text-center font-medium cursor-pointer ${
                  bgType === 'transparent'
                    ? 'border-cyan-400 bg-[#1a1a1a] text-white'
                    : 'border-black bg-[#1f1f1f] text-gray-400 hover:bg-[#333333]'
                }`}
              >
                Transparent
              </button>
              <button
                type="button"
                onClick={() => setBgType('dark')}
                className={`rounded py-1 border text-center font-medium cursor-pointer ${
                  bgType === 'dark'
                    ? 'border-cyan-400 bg-[#1a1a1a] text-white'
                    : 'border-black bg-[#1f1f1f] text-gray-400 hover:bg-[#333333]'
                }`}
              >
                Dark
              </button>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setBgType('custom')}
                  className={`flex-1 rounded py-1 border text-center font-medium cursor-pointer ${
                    bgType === 'custom'
                      ? 'border-cyan-400 bg-[#1a1a1a] text-white'
                      : 'border-black bg-[#1f1f1f] text-gray-400 hover:bg-[#333333]'
                  }`}
                >
                  Custom
                </button>
                <input
                  type="color"
                  value={customBg}
                  onChange={(e) => {
                    setCustomBg(e.target.value);
                    setBgType('custom');
                  }}
                  className="h-6 w-6 rounded cursor-pointer border border-black bg-transparent"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-black">
            <button
              type="button"
              onClick={onClose}
              className="rounded bg-[#1a1a1a] hover:bg-[#3c3c3c] border border-black px-3.5 py-1.5 text-xs font-medium text-gray-300 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded bg-[#007acc] hover:bg-[#0098ff] border border-black px-4 py-1.5 text-xs font-medium text-white cursor-pointer shadow-sm"
            >
              Create Document
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
