import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { ModelAsset, ModelFormat, Coupon } from '../types';
import { generateAssetDownloadBlob, triggerFileDownload, downloadRealAssetFile } from '../utils/downloadHelper';
import {
  Download,
  Zap,
  X,
  FileBox,
  Layers,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  HardDrive,
  Sparkles,
} from 'lucide-react';

interface DownloadModalProps {
  asset: ModelAsset | null;
  activeCoupon: Coupon | null;
  onApplyCoupon: (coupon: Coupon) => void;
  isOpen: boolean;
  onClose: () => void;
  onDownloadCompleted: (asset: ModelAsset, format: ModelFormat, textureRes: '1K' | '2K' | '4K') => void;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({
  asset,
  activeCoupon,
  onApplyCoupon,
  isOpen,
  onClose,
  onDownloadCompleted,
}) => {
  if (!isOpen || !asset) return null;

  const [selectedFormat, setSelectedFormat] = useState<ModelFormat>(asset.formats[0] || 'GLTF');
  const [selectedTextureRes, setSelectedTextureRes] = useState<'1K' | '2K' | '4K'>('4K');
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadSpeed, setDownloadSpeed] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [queueCountdown, setQueueCountdown] = useState(0);

  const hasTurbo = !!activeCoupon;

  // Reset state when asset changes
  useEffect(() => {
    setIsDownloading(false);
    setDownloadProgress(0);
    setIsDone(false);
    setQueueCountdown(0);
    setSelectedFormat(asset.formats[0] || 'GLTF');
  }, [asset.id]);

  const handleStartDownload = () => {
    if (isDownloading) return;

    if (!hasTurbo) {
      // Standard tier: 3 second queue wait simulation, then slower speed
      setQueueCountdown(3);
      const timer = setInterval(() => {
        setQueueCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            startTransfer(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      // Turbo tier: instant start with high gigabit speed
      startTransfer(true);
    }
  };

  const startTransfer = (turbo: boolean) => {
    setIsDownloading(true);
    setDownloadProgress(0);

    const targetSpeed = turbo ? 118 : 1.4; // MB/s
    setDownloadSpeed(targetSpeed);

    let progress = 0;
    const interval = setInterval(() => {
      // Turbo completes rapidly (in ~1.5s), standard takes longer
      const step = turbo ? 18 : 3.5;
      progress = Math.min(100, progress + step);
      setDownloadProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
        setIsDownloading(false);
        setIsDone(true);

        // Real browser download trigger. Assets published with an actual
        // uploaded file (r2ModelKey) fetch it from Cloudflare R2; the seeded
        // demo catalog (no real file behind it) falls back to a generated
        // placeholder package so the flow still completes end-to-end.
        if (asset.r2ModelKey) {
          downloadRealAssetFile(
            asset.r2ModelKey,
            asset.modelFileName || `${asset.title}.${selectedFormat.toLowerCase()}`
          ).catch((err) => console.error('PolyVault download failed:', err));
        } else {
          const { blob, filename } = generateAssetDownloadBlob(
            asset,
            selectedFormat,
            selectedTextureRes,
            activeCoupon?.code
          );
          triggerFileDownload(blob, filename);
        }
        onDownloadCompleted(asset, selectedFormat, selectedTextureRes);

        // Celebration
        try {
          confetti({
            particleCount: 70,
            spread: 60,
            origin: { y: 0.7 },
          });
        } catch (e) {}
      }
    }, 120);
  };

  return (
    <div
      id="download-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        id="download-modal-content"
        className="relative w-full max-w-lg bg-white border border-zinc-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 bg-white border-b border-zinc-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-950 tracking-tight">Download 3D Package</h2>
              <p className="text-xs text-zinc-500 font-mono">{asset.title}</p>
            </div>
          </div>
          <button
            id="btn-close-download-modal"
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 text-zinc-800">
          {/* Active Speed Status Badge */}
          {hasTurbo ? (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Zap className="w-4 h-4 text-emerald-600 animate-pulse" />
                <div>
                  <div className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
                    <span>Turbo Gigabit CDN Active</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-mono font-bold">
                      {activeCoupon.code}
                    </span>
                  </div>
                  <div className="text-[11px] text-emerald-700">Queue bypassed • 120 MB/s direct thread</div>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded">UNTHROTTLED</span>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-amber-600" />
                <div>
                  <div className="text-xs font-semibold text-amber-900">Standard Throttled Speed</div>
                  <div className="text-[11px] text-amber-700">350 KB/s transfer with queue timer</div>
                </div>
              </div>
              <button
                id="btn-quick-apply-turbo"
                onClick={() =>
                  onApplyCoupon({
                    code: 'TURBO100',
                    title: 'Gigabit Hyper-Speed',
                    description: 'Direct high speed download pipeline.',
                    discountPercent: 100,
                    speedBoost: '120 MB/s Gigabit CDN',
                    speedMultiplier: 80,
                    badge: '⚡ TURBO',
                    expires: '2026-12-31',
                    active: true,
                  })
                }
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 underline cursor-pointer"
              >
                Unlock Turbo
              </button>
            </div>
          )}

          {/* Format Selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-700 flex items-center gap-1.5">
              <FileBox className="w-3.5 h-3.5 text-emerald-600" /> Select 3D File Format
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['GLTF', 'FBX', 'OBJ', 'BLEND', 'USDZ'] as ModelFormat[]).map((fmt) => {
                const isAvailable = asset.formats.includes(fmt);
                const isSelected = selectedFormat === fmt;
                return (
                  <button
                    key={fmt}
                    id={`btn-select-format-${fmt}`}
                    disabled={!isAvailable || isDownloading}
                    onClick={() => setSelectedFormat(fmt)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : isAvailable
                        ? 'bg-zinc-50 border-zinc-200 text-zinc-700 hover:border-zinc-300 hover:bg-zinc-100'
                        : 'bg-zinc-50 border-zinc-100 text-zinc-300 cursor-not-allowed'
                    }`}
                  >
                    <span>.{fmt}</span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Texture Resolution */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-700 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-600" /> Texture Maps Resolution
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['1K', '2K', '4K'] as const).map((res) => {
                const isSelected = selectedTextureRes === res;
                return (
                  <button
                    key={res}
                    id={`btn-select-res-${res}`}
                    disabled={isDownloading}
                    onClick={() => setSelectedTextureRes(res)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-zinc-50 border-zinc-200 text-zinc-700 hover:border-zinc-300 hover:bg-zinc-100'
                    }`}
                  >
                    <span>{res} PBR</span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Package Details Overview */}
          <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 text-xs space-y-1.5">
            <div className="flex justify-between text-zinc-500">
              <span>Estimated Package Size:</span>
              <span className="text-zinc-900 font-mono font-bold">{asset.fileSizeMb} MB</span>
            </div>
            <div className="flex justify-between text-zinc-500">
              <span>License:</span>
              <span className="text-zinc-800">{asset.license}</span>
            </div>
            <div className="flex justify-between text-zinc-500">
              <span>PBR Maps Included:</span>
              <span className="text-emerald-700 font-medium">Albedo, Normal, Roughness, Metalness, AO</span>
            </div>
          </div>

          {/* Download Progress or Status */}
          {queueCountdown > 0 && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-center space-y-1">
              <div className="text-xs text-amber-900 font-semibold">Standard Queue: Allocating Server Slot...</div>
              <div className="text-xl font-bold font-mono text-amber-600">{queueCountdown}s</div>
              <div className="text-[11px] text-amber-700">Tip: Apply coupon to bypass queue instantly!</div>
            </div>
          )}

          {isDownloading && (
            <div className="space-y-2 p-3 rounded-xl bg-zinc-50 border border-zinc-200">
              <div className="flex justify-between text-xs">
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <HardDrive className="w-3.5 h-3.5 animate-bounce" /> Streaming package chunks...
                </span>
                <span className="text-zinc-950 font-mono font-bold">{downloadProgress}%</span>
              </div>
              <div className="h-2 w-full bg-zinc-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-600 rounded-full transition-all duration-150"
                  style={{ width: `${downloadProgress}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-zinc-500 font-mono">
                <span>Speed: {downloadSpeed} MB/s</span>
                <span>Direct CDN Thread #4</span>
              </div>
            </div>
          )}

          {isDone && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2.5 text-xs text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Download package dispatched to your browser download folder!</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-5 bg-zinc-50 border-t border-zinc-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Clean 3D mesh verified</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-cancel-download"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200 transition-colors cursor-pointer"
            >
              Close
            </button>

            <button
              id="btn-start-download"
              disabled={isDownloading || queueCountdown > 0}
              onClick={handleStartDownload}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer ${
                hasTurbo
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  : 'bg-zinc-800 hover:bg-zinc-700 text-white'
              }`}
            >
              {hasTurbo ? <Zap className="w-4 h-4" /> : <Download className="w-4 h-4" />}
              <span>{hasTurbo ? 'Instant Turbo Download' : 'Start Download'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
