import React, { useState, useEffect } from 'react';
import { Maximize2, X, Lock, Unlock, ArrowUpDown, ArrowLeftRight } from 'lucide-react';
import { AnchorPosition } from '../../utils/canvasUtils';

interface ResizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentWidth: number;
  currentHeight: number;
  initialMode?: 'canvas' | 'image';
  onApplyCanvasResize: (newW: number, newH: number, anchor: AnchorPosition) => void;
  onApplyImageResample: (newW: number, newH: number) => void;
}

export const ResizeModal: React.FC<ResizeModalProps> = ({
  isOpen,
  onClose,
  currentWidth,
  currentHeight,
  initialMode = 'canvas',
  onApplyCanvasResize,
  onApplyImageResample,
}) => {
  const [mode, setMode] = useState<'canvas' | 'image'>(initialMode);
  const [width, setWidth] = useState(currentWidth);
  const [height, setHeight] = useState(currentHeight);
  const [lockRatio, setLockRatio] = useState(true);
  const [anchor, setAnchor] = useState<AnchorPosition>('center');

  // Reset dimensions when opening modal
  useEffect(() => {
    if (isOpen) {
      setWidth(currentWidth);
      setHeight(currentHeight);
      setMode(initialMode);
    }
  }, [isOpen, currentWidth, currentHeight, initialMode]);

  if (!isOpen) return null;

  const aspectRatio = currentWidth / currentHeight;

  const handleWidthChange = (val: number) => {
    setWidth(val);
    if (lockRatio && val > 0) {
      setHeight(Math.round(val / aspectRatio));
    }
  };

  const handleHeightChange = (val: number) => {
    setHeight(val);
    if (lockRatio && val > 0) {
      setWidth(Math.round(val * aspectRatio));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetW = Math.max(10, Math.round(width));
    const targetH = Math.max(10, Math.round(height));

    if (mode === 'canvas') {
      onApplyCanvasResize(targetW, targetH, anchor);
    } else {
      onApplyImageResample(targetW, targetH);
    }
    onClose();
  };

  const anchorGrid: { pos: AnchorPosition; label: string }[] = [
    { pos: 'top-left', label: '↖' },
    { pos: 'top-center', label: '↑' },
    { pos: 'top-right', label: '↗' },
    { pos: 'center-left', label: '←' },
    { pos: 'center', label: '•' },
    { pos: 'center-right', label: '→' },
    { pos: 'bottom-left', label: '↙' },
    { pos: 'bottom-center', label: '↓' },
    { pos: 'bottom-right', label: '↘' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="w-full max-w-md rounded border border-black bg-[#2b2b2b] p-5 shadow-2xl text-gray-300">
        <div className="flex items-center justify-between pb-3 border-b border-black">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <Maximize2 className="h-4 w-4 text-cyan-400" />
            Resize {mode === 'canvas' ? 'Canvas' : 'Image'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Mode switcher tabs: Canvas Size vs Image Size */}
        <div className="mt-3 flex rounded bg-[#1a1a1a] p-0.5 border border-black">
          <button
            type="button"
            onClick={() => setMode('canvas')}
            className={`flex-1 rounded py-1 text-xs font-medium transition-colors cursor-pointer ${
              mode === 'canvas'
                ? 'bg-[#007acc] text-white shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Canvas Size (Extend / Trim)
          </button>
          <button
            type="button"
            onClick={() => setMode('image')}
            className={`flex-1 rounded py-1 text-xs font-medium transition-colors cursor-pointer ${
              mode === 'image'
                ? 'bg-[#007acc] text-white shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Image Size (Rescale Pixels)
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-3.5 space-y-3 text-xs">
          {/* Current vs New Info */}
          <div className="rounded bg-[#1f1f1f] p-2 border border-black text-[11px] flex justify-between text-gray-400">
            <span>Current Size:</span>
            <span className="font-mono text-gray-200 font-medium">
              {currentWidth} × {currentHeight} px
            </span>
          </div>

          {/* Width / Height Inputs with Lock Ratio */}
          <div className="flex items-center gap-2.5">
            <div className="flex-1 space-y-1">
              <label className="text-gray-300 font-medium text-[11px]">Width (px)</label>
              <input
                type="number"
                min="10"
                max="10000"
                value={width}
                onChange={(e) => handleWidthChange(Number(e.target.value))}
                className="w-full rounded bg-[#1a1a1a] border border-black px-2.5 py-1 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>

            {/* Lock Aspect Ratio Button */}
            <div className="pt-4">
              <button
                type="button"
                onClick={() => setLockRatio(!lockRatio)}
                title={lockRatio ? 'Unlock Aspect Ratio' : 'Lock Aspect Ratio'}
                className={`p-1.5 rounded border transition-colors cursor-pointer ${
                  lockRatio
                    ? 'border-cyan-400 bg-[#1a1a1a] text-cyan-300'
                    : 'border-black bg-[#1f1f1f] text-gray-500'
                }`}
              >
                {lockRatio ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}
              </button>
            </div>

            <div className="flex-1 space-y-1">
              <label className="text-gray-300 font-medium text-[11px]">Height (px)</label>
              <input
                type="number"
                min="10"
                max="10000"
                value={height}
                onChange={(e) => handleHeightChange(Number(e.target.value))}
                className="w-full rounded bg-[#1a1a1a] border border-black px-2.5 py-1 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>
          </div>

          {/* If Canvas Mode: 9-point Anchor Grid */}
          {mode === 'canvas' ? (
            <div className="pt-0.5">
              <label className="block text-gray-300 font-medium mb-1 text-[11px]">
                Anchor Placement:
              </label>
              <div className="flex items-center gap-3">
                <div className="grid grid-cols-3 gap-1 w-28 p-1 bg-[#1a1a1a] rounded border border-black">
                  {anchorGrid.map((item) => (
                    <button
                      key={item.pos}
                      type="button"
                      onClick={() => setAnchor(item.pos)}
                      title={`Anchor: ${item.pos}`}
                      className={`h-6 rounded flex items-center justify-center font-bold text-xs transition-colors cursor-pointer ${
                        anchor === item.pos
                          ? 'bg-[#007acc] text-white'
                          : 'bg-[#252525] text-gray-400 hover:text-white hover:bg-[#333333]'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
                <div className="text-[10px] text-gray-400 leading-relaxed">
                  Anchor controls where existing content stays when canvas is enlarged or clipped.
                </div>
              </div>
            </div>
          ) : (
            <div className="text-[10px] text-gray-400 bg-[#1f1f1f] p-2 rounded border border-black leading-relaxed">
              Image size resamples all layer content smoothly to the new dimensions using high-quality bicubic interpolation.
            </div>
          )}

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-black">
            <button
              type="button"
              onClick={onClose}
              className="rounded bg-[#1a1a1a] hover:bg-[#3c3c3c] border border-black px-3.5 py-1.5 text-xs text-gray-300 font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded bg-[#007acc] hover:bg-[#0098ff] border border-black px-4 py-1.5 text-xs font-medium text-white cursor-pointer shadow-sm"
            >
              Apply Resize
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
