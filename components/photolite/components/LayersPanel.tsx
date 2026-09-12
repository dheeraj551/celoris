import React, { useState } from 'react';
import {
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Plus,
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  Layers,
  Type,
  Shapes,
  Image as ImageIcon,
  Minimize2
} from 'lucide-react';
import { Layer, BlendMode } from '../types';
import { BLEND_MODES } from '../utils/canvasUtils';

interface LayersPanelProps {
  layers: Layer[];
  activeLayerId: string;
  setActiveLayerId: (id: string) => void;
  onUpdateLayer: (
    id: string,
    updates: Partial<Layer>,
    commitToHistory?: boolean,
    historyLabel?: string
  ) => void;
  onNewLayer: () => void;
  onDuplicateLayer: () => void;
  onDeleteLayer: () => void;
  onMoveLayerUp: () => void;
  onMoveLayerDown: () => void;
  onMergeDown: () => void;
}

// Mini preview canvas thumbnail for each layer
const LayerThumbnail: React.FC<{ layer: Layer }> = ({ layer }) => {
  const thumbRef = React.useRef<HTMLCanvasElement | null>(null);

  React.useEffect(() => {
    const canvas = thumbRef.current;
    if (!canvas || !layer.canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Transparency checkerboard
    const w = canvas.width;
    const h = canvas.height;
    const size = 4;
    for (let y = 0; y < h; y += size) {
      for (let x = 0; x < w; x += size) {
        ctx.fillStyle = (x / size + y / size) % 2 === 0 ? '#262626' : '#171717';
        ctx.fillRect(x, y, size, size);
      }
    }

    try {
      ctx.drawImage(layer.canvas, 0, 0, w, h);
    } catch {
      // ignore
    }
  }, [layer.canvas, layer.filters, layer.opacity, layer.blendMode, layer.width, layer.height]);

  return (
    <div className="relative mx-1 flex h-7 w-8 items-center justify-center rounded border border-black bg-[#161616] overflow-hidden shrink-0 shadow-xs">
      <canvas ref={thumbRef} width={32} height={28} className="w-full h-full object-contain" />
      {layer.type === 'text' ? (
        <span className="absolute bottom-0 right-0 rounded-tl bg-blue-950/90 px-0.5 text-[7px] font-bold text-blue-300 leading-tight">
          T
        </span>
      ) : layer.type === 'shape' ? (
        <span className="absolute bottom-0 right-0 rounded-tl bg-amber-950/90 px-0.5 text-[7px] font-bold text-amber-300 leading-tight">
          S
        </span>
      ) : null}
    </div>
  );
};

export const LayersPanel: React.FC<LayersPanelProps> = ({
  layers,
  activeLayerId,
  setActiveLayerId,
  onUpdateLayer,
  onNewLayer,
  onDuplicateLayer,
  onDeleteLayer,
  onMoveLayerUp,
  onMoveLayerDown,
  onMergeDown,
}) => {
  const activeLayer = layers.find((l) => l.id === activeLayerId) || layers[0];
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const startRename = (layer: Layer) => {
    setEditingId(layer.id);
    setEditingName(layer.name);
  };

  const saveRename = () => {
    if (editingId && editingName.trim()) {
      onUpdateLayer(editingId, { name: editingName.trim() });
    }
    setEditingId(null);
  };

  // Reverse list so top layer in Photoshop layer stack is displayed on top
  const reversedLayers = [...layers].reverse();

  return (
    <div id="layers-panel" className="flex flex-col h-full bg-[#2b2b2b] text-xs text-gray-300 select-none">
      {/* Layer Blend Mode & Opacity Header */}
      <div className="p-2 border-b border-black space-y-1.5 bg-[#242424]">
        <div className="flex items-center justify-between gap-2">
          <label className="text-[10px] text-gray-400 font-medium">Blend:</label>
          <select
            id="layer-blend-mode-select"
            value={activeLayer?.blendMode || 'source-over'}
            disabled={!activeLayer || activeLayer.locked}
            onChange={(e) => {
              if (!activeLayer) return;
              const newMode = e.target.value as BlendMode;
              const match = BLEND_MODES.find((m) => m.value === newMode);
              onUpdateLayer(
                activeLayer.id,
                { blendMode: newMode },
                true,
                `Blend: ${match?.label || newMode} (${activeLayer.name})`
              );
            }}
            className="flex-1 rounded bg-[#1a1a1a] border border-black px-1.5 py-0.5 text-[11px] text-gray-200 focus:outline-none disabled:opacity-50 cursor-pointer"
          >
            {BLEND_MODES.map((bm) => (
              <option key={bm.value} value={bm.value}>
                {bm.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-between gap-2">
          <label className="text-[10px] text-gray-400 font-medium">Opacity:</label>
          <input
            id="active-layer-opacity-slider"
            type="range"
            min="0"
            max="100"
            disabled={!activeLayer || activeLayer.locked}
            value={activeLayer ? Math.round(activeLayer.opacity * 100) : 100}
            onChange={(e) =>
              activeLayer &&
              onUpdateLayer(activeLayer.id, { opacity: Number(e.target.value) / 100 }, false)
            }
            onPointerUp={(e) =>
              activeLayer &&
              onUpdateLayer(
                activeLayer.id,
                { opacity: Number((e.target as HTMLInputElement).value) / 100 },
                true,
                `Opacity: ${(e.target as HTMLInputElement).value}% (${activeLayer.name})`
              )
            }
            onTouchEnd={(e) =>
              activeLayer &&
              onUpdateLayer(
                activeLayer.id,
                { opacity: Number((e.target as HTMLInputElement).value) / 100 },
                true,
                `Opacity: ${(e.target as HTMLInputElement).value}% (${activeLayer.name})`
              )
            }
            onKeyUp={(e) =>
              activeLayer &&
              onUpdateLayer(
                activeLayer.id,
                { opacity: Number((e.target as HTMLInputElement).value) / 100 },
                true,
                `Opacity: ${(e.target as HTMLInputElement).value}% (${activeLayer.name})`
              )
            }
            className="flex-1 h-1.5 cursor-pointer accent-cyan-400 disabled:opacity-50"
          />
          <span className="w-8 text-right font-mono text-[10px] text-gray-300">
            {activeLayer ? Math.round(activeLayer.opacity * 100) : 100}%
          </span>
        </div>
      </div>

      {/* Layer Items List */}
      <div className="flex-1 overflow-y-auto divide-y divide-black/40 p-1 space-y-1">
        {reversedLayers.map((layer) => {
          const isActive = layer.id === activeLayerId;
          const isEditing = editingId === layer.id;

          return (
            <div
              key={layer.id}
              id={`layer-item-${layer.id}`}
              data-testid={`layer-item-${layer.id}`}
              onClick={() => setActiveLayerId(layer.id)}
              className={`group flex flex-col rounded p-1.5 cursor-pointer transition-colors border ${
                isActive
                  ? 'bg-[#1f262d] border-cyan-500/80 shadow-xs'
                  : 'bg-[#232323] hover:bg-[#2a2a2a] text-gray-300 border-black/70'
              }`}
            >
              {/* Row 1: Visibility, Thumbnail, Layer Name & Lock */}
              <div className="flex items-center justify-between gap-1">
                {/* Left: Visibility Eye */}
                <button
                  id={`btn-layer-visibility-${layer.id}`}
                  data-testid={`btn-layer-visibility-${layer.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdateLayer(
                      layer.id,
                      { visible: !layer.visible },
                      true,
                      `${layer.visible ? 'Hide' : 'Show'} ${layer.name}`
                    );
                  }}
                  title={layer.visible ? 'Hide Layer' : 'Show Layer'}
                  className="p-1 rounded text-gray-400 hover:text-white hover:bg-black/30 cursor-pointer shrink-0 transition-colors"
                >
                  {layer.visible ? (
                    <Eye className="h-3.5 w-3.5 text-gray-200" />
                  ) : (
                    <EyeOff className="h-3.5 w-3.5 text-gray-600" />
                  )}
                </button>

                {/* Thumbnail Preview */}
                <LayerThumbnail layer={layer} />

                {/* Layer Name / Inline Rename */}
                <div className="flex-1 min-w-0 px-1">
                  {isEditing ? (
                    <input
                      id={`input-rename-layer-${layer.id}`}
                      type="text"
                      autoFocus
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onBlur={saveRename}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveRename();
                        if (e.key === 'Escape') setEditingId(null);
                      }}
                      className="w-full rounded bg-black px-1.5 py-0.5 text-[11px] text-white border border-cyan-500 focus:outline-none"
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <div
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        startRename(layer);
                      }}
                      className={`truncate font-medium text-[11px] select-none ${
                        isActive ? 'text-cyan-300 font-semibold' : 'text-gray-200'
                      }`}
                      title="Double-click to rename layer"
                    >
                      {layer.name}
                    </div>
                  )}
                </div>

                {/* Right: Lock Toggle */}
                <button
                  id={`btn-layer-lock-${layer.id}`}
                  data-testid={`btn-layer-lock-${layer.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdateLayer(
                      layer.id,
                      { locked: !layer.locked },
                      true,
                      `${layer.locked ? 'Unlock' : 'Lock'} ${layer.name}`
                    );
                  }}
                  title={layer.locked ? 'Unlock Layer (Editing is disabled)' : 'Lock Layer'}
                  className="p-1 rounded text-gray-400 hover:text-white hover:bg-black/30 cursor-pointer shrink-0 transition-colors"
                >
                  {layer.locked ? (
                    <Lock className="h-3.5 w-3.5 text-amber-400" />
                  ) : (
                    <Unlock className="h-3.5 w-3.5 opacity-0 group-hover:opacity-60" />
                  )}
                </button>
              </div>

              {/* Row 2: Real-Time Blend Mode & Opacity Controls */}
              <div
                className="mt-1.5 pt-1.5 border-t border-black/40 space-y-1"
                onClick={(e) => {
                  setActiveLayerId(layer.id);
                }}
              >
                {/* Blend Mode Selector & Opacity Readout/Input */}
                <div className="flex items-center justify-between gap-1.5">
                  {/* Blend Mode Selector */}
                  <div className="flex-1 min-w-0 flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <span className="text-[9px] text-gray-400 font-medium shrink-0">Blend:</span>
                    <select
                      id={`layer-blend-select-${layer.id}`}
                      data-testid={`layer-blend-select-${layer.id}`}
                      value={layer.blendMode}
                      disabled={layer.locked}
                      onChange={(e) => {
                        const newMode = e.target.value as BlendMode;
                        const match = BLEND_MODES.find((m) => m.value === newMode);
                        onUpdateLayer(
                          layer.id,
                          { blendMode: newMode },
                          true,
                          `Blend: ${match?.label || newMode} (${layer.name})`
                        );
                      }}
                      className={`flex-1 min-w-0 rounded bg-[#161616] border border-black px-1.5 py-0.5 text-[10px] focus:border-cyan-500 focus:outline-none disabled:opacity-40 cursor-pointer truncate ${
                        layer.blendMode !== 'source-over'
                          ? 'text-cyan-300 font-medium bg-cyan-950/40 border-cyan-800/80'
                          : 'text-gray-300'
                      }`}
                      title={`Blend mode for ${layer.name}`}
                    >
                      {BLEND_MODES.map((bm) => (
                        <option key={bm.value} value={bm.value}>
                          {bm.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Opacity Direct Numeric Input */}
                  <div className="flex items-center gap-0.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <span className="text-[9px] text-gray-400 font-medium">Op:</span>
                    <input
                      id={`layer-opacity-input-${layer.id}`}
                      data-testid={`layer-opacity-input-${layer.id}`}
                      type="number"
                      min="0"
                      max="100"
                      step="1"
                      disabled={layer.locked}
                      value={Math.round(layer.opacity * 100)}
                      onChange={(e) => {
                        const val = Math.max(0, Math.min(100, Number(e.target.value) || 0));
                        onUpdateLayer(layer.id, { opacity: val / 100 }, false);
                      }}
                      onBlur={(e) => {
                        const val = Math.max(0, Math.min(100, Number(e.target.value) || 0));
                        onUpdateLayer(layer.id, { opacity: val / 100 }, true, `Opacity: ${val}% (${layer.name})`);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          (e.target as HTMLInputElement).blur();
                        }
                      }}
                      className="w-10 rounded bg-[#141414] border border-black px-1 py-0.5 text-right font-mono text-[10px] text-gray-200 focus:border-cyan-500 focus:outline-none disabled:opacity-40"
                      title={`Opacity percentage for ${layer.name}`}
                    />
                    <span className="text-[9px] text-gray-500 font-mono">%</span>
                  </div>
                </div>

                {/* Opacity Range Slider */}
                <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                  <input
                    id={`layer-opacity-slider-${layer.id}`}
                    data-testid={`layer-opacity-slider-${layer.id}`}
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    disabled={layer.locked}
                    value={Math.round(layer.opacity * 100)}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      onUpdateLayer(layer.id, { opacity: val / 100 }, false);
                    }}
                    onPointerUp={(e) => {
                      const val = Number((e.target as HTMLInputElement).value);
                      onUpdateLayer(layer.id, { opacity: val / 100 }, true, `Opacity: ${val}% (${layer.name})`);
                    }}
                    onTouchEnd={(e) => {
                      const val = Number((e.target as HTMLInputElement).value);
                      onUpdateLayer(layer.id, { opacity: val / 100 }, true, `Opacity: ${val}% (${layer.name})`);
                    }}
                    onKeyUp={(e) => {
                      const val = Number((e.target as HTMLInputElement).value);
                      onUpdateLayer(layer.id, { opacity: val / 100 }, true, `Opacity: ${val}% (${layer.name})`);
                    }}
                    className="flex-1 h-1.5 cursor-pointer accent-cyan-400 bg-[#161616] rounded disabled:opacity-40"
                    title={`Real-time Opacity: ${Math.round(layer.opacity * 100)}%`}
                  />

                  {/* Quick 100% Reset Button when dimmed */}
                  {Math.round(layer.opacity * 100) < 100 && !layer.locked && (
                    <button
                      id={`btn-reset-opacity-${layer.id}`}
                      data-testid={`btn-reset-opacity-${layer.id}`}
                      onClick={() => {
                        onUpdateLayer(layer.id, { opacity: 1 }, true, `Reset Opacity: 100% (${layer.name})`);
                      }}
                      title="Quick reset to 100% opacity"
                      className="rounded bg-[#1a1a1a] hover:bg-[#333] border border-black px-1 py-0 text-[8.5px] font-mono text-cyan-400 hover:text-cyan-300 cursor-pointer shrink-0"
                    >
                      100%
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Layer action footer buttons */}
      <div className="flex items-center justify-around border-t border-black bg-[#1f1f1f] p-1 text-gray-400">
        <button
          onClick={onMoveLayerUp}
          title="Move Layer Up"
          disabled={layers.length <= 1 || activeLayerId === layers[layers.length - 1].id}
          className="rounded p-1 hover:bg-[#333333] hover:text-white disabled:opacity-30 cursor-pointer"
        >
          <ArrowUp className="h-3 w-3" />
        </button>
        <button
          onClick={onMoveLayerDown}
          title="Move Layer Down"
          disabled={layers.length <= 1 || activeLayerId === layers[0].id}
          className="rounded p-1 hover:bg-[#333333] hover:text-white disabled:opacity-30 cursor-pointer"
        >
          <ArrowDown className="h-3 w-3" />
        </button>
        <button
          onClick={onMergeDown}
          title="Merge Layer Down"
          disabled={layers.length <= 1 || activeLayerId === layers[0].id}
          className="rounded p-1 hover:bg-[#333333] hover:text-white disabled:opacity-30 cursor-pointer"
        >
          <Minimize2 className="h-3 w-3" />
        </button>
        <div className="h-3 w-[1px] bg-black" />
        <button
          onClick={onNewLayer}
          title="Create New Layer"
          className="rounded p-1 hover:bg-[#333333] hover:text-white text-cyan-400 cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={onDuplicateLayer}
          title="Duplicate Layer (Ctrl+J)"
          className="rounded p-1 hover:bg-[#333333] hover:text-white cursor-pointer"
        >
          <Copy className="h-3 w-3" />
        </button>
        <button
          onClick={onDeleteLayer}
          title="Delete Layer"
          disabled={layers.length <= 1}
          className="rounded p-1 hover:bg-red-900/50 hover:text-red-300 disabled:opacity-30 cursor-pointer"
        >
          <Trash2 className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
};
