import React, { useState, useEffect } from 'react';
import { Download, FileImage, Layers, ShieldCheck } from 'lucide-react';
import { ExportFormat, Layer } from '../../types';
import { renderCompositeCanvas, downloadCanvas } from '../../utils/canvasUtils';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  layers: Layer[];
  canvasWidth: number;
  canvasHeight: number;
  projectName: string;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  layers,
  canvasWidth,
  canvasHeight,
  projectName,
}) => {
  const [format, setFormat] = useState<ExportFormat>('png');
  const [quality, setQuality] = useState<number>(0.92);
  const [scale, setScale] = useState<number>(1);
  const [previewDataUrl, setPreviewDataUrl] = useState<string>('');
  const [estimatedSize, setEstimatedSize] = useState<string>('');

  // Generate preview and estimate size
  useEffect(() => {
    if (!isOpen) return;

    try {
      const comp = renderCompositeCanvas(layers, canvasWidth, canvasHeight);
      const outW = Math.round(canvasWidth * scale);
      const outH = Math.round(canvasHeight * scale);

      let targetCanvas = comp;
      if (scale !== 1) {
        targetCanvas = document.createElement('canvas');
        targetCanvas.width = outW;
        targetCanvas.height = outH;
        const ctx = targetCanvas.getContext('2d');
        if (ctx) {
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(comp, 0, 0, outW, outH);
        }
      }

      const mime = format === 'jpeg' ? 'image/jpeg' : format === 'webp' ? 'image/webp' : 'image/png';
      
      // Matting for JPEG
      let finalCanvas = targetCanvas;
      if (format === 'jpeg') {
        finalCanvas = document.createElement('canvas');
        finalCanvas.width = outW;
        finalCanvas.height = outH;
        const fCtx = finalCanvas.getContext('2d');
        if (fCtx) {
          fCtx.fillStyle = '#ffffff';
          fCtx.fillRect(0, 0, outW, outH);
          fCtx.drawImage(targetCanvas, 0, 0);
        }
      }

      const dataUrl = finalCanvas.toDataURL(mime, quality);
      setPreviewDataUrl(dataUrl);

      // Estimate byte size from dataURL base64 length
      const approxBytes = Math.round((dataUrl.length * 3) / 4);
      if (approxBytes < 1024) {
        setEstimatedSize(`${approxBytes} B`);
      } else if (approxBytes < 1024 * 1024) {
        setEstimatedSize(`${(approxBytes / 1024).toFixed(1)} KB`);
      } else {
        setEstimatedSize(`${(approxBytes / (1024 * 1024)).toFixed(2)} MB`);
      }
    } catch (e) {
      console.error('Error generating export preview', e);
    }
  }, [isOpen, format, quality, scale, layers, canvasWidth, canvasHeight]);

  if (!isOpen) return null;

  const handleExport = () => {
    const comp = renderCompositeCanvas(layers, canvasWidth, canvasHeight);
    let finalCanvas = comp;

    if (scale !== 1) {
      const outW = Math.round(canvasWidth * scale);
      const outH = Math.round(canvasHeight * scale);
      finalCanvas = document.createElement('canvas');
      finalCanvas.width = outW;
      finalCanvas.height = outH;
      const ctx = finalCanvas.getContext('2d');
      if (ctx) {
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(comp, 0, 0, outW, outH);
      }
    }

    downloadCanvas(finalCanvas, format, quality, projectName);
    onClose();
  };

  const outputWidth = Math.round(canvasWidth * scale);
  const outputHeight = Math.round(canvasHeight * scale);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pl-window-overlay p-4">
      <div className="pl-window pl-window-anim w-full max-w-2xl p-5 text-gray-300">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="pl-traffic-lights" role="group" aria-label="Window controls">
              <button type="button" onClick={onClose} className="pl-traffic-dot pl-dot-red" title="Close" />
              <span className="pl-traffic-dot pl-dot-yellow" />
              <span className="pl-traffic-dot pl-dot-green" />
            </div>
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <Download className="h-4 w-4 text-cyan-400" />
              Export Image
            </h2>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
          {/* Left: Preview thumbnail */}
          <div className="flex flex-col items-center justify-center bg-[#1a1a1a] rounded border border-black p-2.5 overflow-hidden">
            <div className="relative max-h-52 max-w-full flex items-center justify-center overflow-hidden rounded shadow-inner">
              {/* Checkered backdrop */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    'linear-gradient(45deg, #444 25%, transparent 25%), linear-gradient(-45deg, #444 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #444 75%), linear-gradient(-45deg, transparent 75%, #444 75%)',
                  backgroundSize: '16px 16px',
                  backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px',
                }}
              />
              {previewDataUrl ? (
                <img
                  src={previewDataUrl}
                  alt="Export preview"
                  className="relative z-10 max-h-48 object-contain rounded"
                />
              ) : (
                <div className="py-12 text-gray-500 text-xs">Generating preview...</div>
              )}
            </div>

            <div className="mt-2.5 w-full flex justify-between text-[11px] text-gray-400 pt-2 border-t border-black">
              <span>Dimensions: <strong className="text-white font-mono">{outputWidth} × {outputHeight}px</strong></span>
              <span>Estimated Size: <strong className="text-cyan-400 font-mono">{estimatedSize}</strong></span>
            </div>
          </div>

          {/* Right: Format options */}
          <div className="space-y-3.5">
            {/* Format choice */}
            <div>
              <label className="block text-gray-300 font-medium mb-1 text-[11px]">File Format</label>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => setFormat('png')}
                  className={`rounded py-1.5 border text-center font-medium transition-colors cursor-pointer ${
                    format === 'png'
                      ? 'border-cyan-400 bg-[#1a1a1a] text-cyan-300 shadow-sm'
                      : 'border-black bg-[#1f1f1f] text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <div className="font-bold text-xs">PNG</div>
                  <div className="text-[9px] text-gray-400">Lossless + Alpha</div>
                </button>

                <button
                  type="button"
                  onClick={() => setFormat('jpeg')}
                  className={`rounded py-1.5 border text-center font-medium transition-colors cursor-pointer ${
                    format === 'jpeg'
                      ? 'border-cyan-400 bg-[#1a1a1a] text-cyan-300 shadow-sm'
                      : 'border-black bg-[#1f1f1f] text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <div className="font-bold text-xs">JPEG</div>
                  <div className="text-[9px] text-gray-400">High Compression</div>
                </button>

                <button
                  type="button"
                  onClick={() => setFormat('webp')}
                  className={`rounded py-1.5 border text-center font-medium transition-colors cursor-pointer ${
                    format === 'webp'
                      ? 'border-cyan-400 bg-[#1a1a1a] text-cyan-300 shadow-sm'
                      : 'border-black bg-[#1f1f1f] text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <div className="font-bold text-xs">WEBP</div>
                  <div className="text-[9px] text-gray-400">Modern Web</div>
                </button>
              </div>
            </div>

            {/* Quality Slider (for JPEG / WEBP) */}
            {format !== 'png' && (
              <div>
                <div className="flex justify-between text-gray-300 font-medium mb-1 text-[11px]">
                  <span>Compression Quality</span>
                  <span className="font-mono text-cyan-400">{Math.round(quality * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={Math.round(quality * 100)}
                  onChange={(e) => setQuality(Number(e.target.value) / 100)}
                  className="w-full h-1 cursor-pointer accent-blue-500"
                />
              </div>
            )}

            {/* Export Scale Multiplier */}
            <div>
              <div className="flex justify-between text-gray-300 font-medium mb-1 text-[11px]">
                <span>Output Resolution Scaling</span>
                <span className="font-mono text-gray-400">{scale}x</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {[0.5, 1, 2, 3].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setScale(s)}
                    className={`rounded py-1 border font-mono cursor-pointer text-xs ${
                      scale === s
                        ? 'border-cyan-400 bg-[#1a1a1a] text-cyan-300'
                        : 'border-black bg-[#1f1f1f] text-gray-400 hover:text-white'
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded bg-[#1f1f1f] p-2 border border-black text-[11px] text-gray-400">
              <span className="text-gray-300 font-medium">Output: </span>
              {projectName || 'untitled'}.{format === 'jpeg' ? 'jpg' : format} ({outputWidth} × {outputHeight}px)
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3.5 mt-3.5 border-t border-black">
          <button
            type="button"
            onClick={onClose}
            className="rounded bg-[#1a1a1a] hover:bg-[#3c3c3c] border border-black px-3.5 py-1.5 text-xs text-gray-300 font-medium cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleExport}
            className="flex items-center gap-1.5 rounded bg-[#007acc] hover:bg-[#0098ff] border border-black px-4 py-1.5 text-xs font-medium text-white shadow transition-colors cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            Download {format.toUpperCase()}
          </button>
        </div>
      </div>
    </div>
  );
};
