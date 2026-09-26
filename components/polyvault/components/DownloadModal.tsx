import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { ModelAsset, ModelFormat, DownloadLane } from '../types';
import {
  generateAssetDownloadBlob,
  triggerFileDownload,
  staticModelUrl,
  queueRealDownload,
  claimRealDownload,
  openDownloadUrl,
} from '../utils/downloadHelper';
import {
  Download,
  Zap,
  X,
  FileBox,
  Layers,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Gauge,
  AlertTriangle,
} from 'lucide-react';

// Download speed comes from the member's plan (Free / Basic / Pro / Max):
// each plan has a queue before the download starts, set in Admin → Plans →
// PolyVault. The server only releases the real file link once the queue is
// over (see app/api/polyvault/sign-download), then the file downloads at full
// speed from Cloudflare R2.

interface DownloadModalProps {
  asset: ModelAsset | null;
  lane: DownloadLane | null;
  onOpenSpeedInfo: () => void;
  isOpen: boolean;
  onClose: () => void;
  onDownloadCompleted: (asset: ModelAsset, format: ModelFormat, textureRes: '1K' | '2K' | '4K') => void;
}

export const DownloadModal: React.FC<DownloadModalProps> = (props) => {
  if (!props.isOpen || !props.asset) return null;
  return <DownloadModalBody {...props} asset={props.asset} />;
};

const DownloadModalBody: React.FC<DownloadModalProps & { asset: ModelAsset }> = ({
  asset,
  lane,
  onOpenSpeedInfo,
  onClose,
  onDownloadCompleted,
}) => {
  const [selectedFormat, setSelectedFormat] = useState<ModelFormat>(asset.formats[0] || 'GLTF');
  const [selectedTextureRes, setSelectedTextureRes] = useState<'1K' | '2K' | '4K'>('4K');
  const [phase, setPhase] = useState<'idle' | 'queued' | 'starting' | 'done' | 'error'>('idle');
  const [waitTotal, setWaitTotal] = useState(0);
  const [waitLeft, setWaitLeft] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const waitSeconds = lane?.waitSeconds ?? 30;
  const instant = waitSeconds <= 0;
  const isPaid = !!lane && lane.tier !== 'free';

  useEffect(() => {
    setPhase('idle');
    setError(null);
    setSelectedFormat(asset.formats[0] || 'GLTF');
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [asset.id]);

  const finish = () => {
    setPhase('done');
    onDownloadCompleted(asset, selectedFormat, selectedTextureRes);
    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
    } catch {
      // ignore
    }
  };

  /** Counts down to readyAt, then runs `then`. */
  const runQueue = (readyAtMs: number, then: () => void) => {
    const total = Math.max(1, Math.ceil((readyAtMs - Date.now()) / 1000));
    setWaitTotal(total);
    setWaitLeft(total);
    setPhase('queued');
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      const left = Math.max(0, Math.ceil((readyAtMs - Date.now()) / 1000));
      setWaitLeft(left);
      if (left <= 0) {
        if (timerRef.current) clearInterval(timerRef.current);
        then();
      }
    }, 250);
  };

  const claim = async (ticketId: string, attempt = 0): Promise<void> => {
    setPhase('starting');
    try {
      const res = await claimRealDownload(ticketId);
      if (res.readyAt && attempt < 3) {
        // Clock drift — wait the extra moment and try again.
        runQueue(Date.parse(res.readyAt), () => claim(ticketId, attempt + 1));
        return;
      }
      if (!res.downloadUrl) throw new Error('Could not start the download.');
      openDownloadUrl(res.downloadUrl);
      finish();
    } catch (e: any) {
      setError(e?.message || 'Could not start the download.');
      setPhase('error');
    }
  };

  const handleStartDownload = async () => {
    if (phase === 'queued' || phase === 'starting') return;
    setError(null);

    // Seeded demo items have no real file: generate the sample package,
    // using the same queue length as the member's plan.
    if (!asset.r2ModelKey) {
      const run = () => {
        const { blob, filename } = generateAssetDownloadBlob(asset, selectedFormat, selectedTextureRes);
        triggerFileDownload(blob, filename);
        finish();
      };
      if (instant) run();
      else runQueue(Date.now() + waitSeconds * 1000, run);
      return;
    }

    const filename = asset.modelFileName || `${asset.title}.${selectedFormat.toLowerCase()}`;

    // A few showcase models ship with the site itself.
    const local = await staticModelUrl(asset.r2ModelKey, filename);
    if (local) {
      const run = () => {
        openDownloadUrl(local, filename);
        finish();
      };
      if (instant) run();
      else runQueue(Date.now() + waitSeconds * 1000, run);
      return;
    }

    setPhase('starting');
    try {
      const q = await queueRealDownload(asset.r2ModelKey, filename);
      if (q.downloadUrl) {
        openDownloadUrl(q.downloadUrl);
        finish();
        return;
      }
      if (!q.ticketId || !q.readyAt) throw new Error('Could not queue the download.');
      runQueue(Date.parse(q.readyAt), () => claim(q.ticketId!));
    } catch (e: any) {
      setError(e?.message || 'Could not start the download.');
      setPhase('error');
    }
  };

  const busy = phase === 'queued' || phase === 'starting';
  const progress = waitTotal > 0 ? Math.round(((waitTotal - waitLeft) / waitTotal) * 100) : 0;

  return (
    <div
      id="download-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        id="download-modal-content"
        className="relative w-full max-w-lg bg-white border border-zinc-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
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
        <div className="p-6 space-y-5 text-zinc-800 overflow-y-auto">
          {/* Download speed from the plan */}
          {instant ? (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <Zap className="w-4 h-4 text-emerald-600" />
                <div>
                  <div className="text-xs font-bold text-zinc-900">{lane?.laneName || 'High speed'} downloads</div>
                  <div className="text-[11px] text-emerald-700">
                    {lane?.planLabel || 'Your'} plan · starts instantly, no queue
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded">NO QUEUE</span>
            </div>
          ) : (
            <div
              className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                isPaid ? 'bg-sky-50 border-sky-200' : 'bg-amber-50 border-amber-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Gauge className={`w-4 h-4 ${isPaid ? 'text-sky-600' : 'text-amber-600'}`} />
                <div>
                  <div className={`text-xs font-semibold ${isPaid ? 'text-sky-900' : 'text-amber-900'}`}>
                    {lane?.laneName || 'Standard'} downloads · {waitSeconds}s queue
                  </div>
                  <div className={`text-[11px] ${isPaid ? 'text-sky-700' : 'text-amber-700'}`}>
                    {lane?.planLabel || 'Free'} plan. Higher plans start sooner.
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={onOpenSpeedInfo}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 underline cursor-pointer shrink-0"
              >
                Go faster
              </button>
            </div>
          )}

          {/* Format Selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-700 flex items-center gap-1.5">
              <FileBox className="w-3.5 h-3.5 text-emerald-600" /> Select 3D File Format
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['GLTF', 'GLB', 'FBX', 'OBJ', 'BLEND', 'USDZ'] as ModelFormat[]).map((fmt) => {
                const isAvailable = asset.formats.includes(fmt);
                const isSelected = selectedFormat === fmt;
                return (
                  <button
                    key={fmt}
                    id={`btn-select-format-${fmt}`}
                    disabled={!isAvailable || busy}
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
                    disabled={busy}
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

          {/* Queue */}
          {phase === 'queued' && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-amber-900 font-semibold flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> In the {lane?.laneName?.toLowerCase() || 'standard'} download queue…
                </span>
                <span className="font-mono font-bold text-amber-700">{waitLeft}s</span>
              </div>
              <div className="h-2 w-full bg-amber-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
              <button
                type="button"
                onClick={onOpenSpeedInfo}
                className="text-[11px] text-amber-800 underline hover:text-amber-900 cursor-pointer"
              >
                Skip the queue with a faster plan
              </button>
            </div>
          )}

          {phase === 'starting' && (
            <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-700 flex items-center gap-2">
              <span className="h-3.5 w-3.5 border-2 border-emerald-500/20 border-t-emerald-600 rounded-full animate-spin" />
              Preparing your download…
            </div>
          )}

          {phase === 'done' && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2.5 text-xs text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Your download has started — check your browser&apos;s downloads.</span>
            </div>
          )}

          {phase === 'error' && error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2.5 text-xs text-rose-800">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
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
              disabled={busy}
              onClick={handleStartDownload}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-60 ${
                instant ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-zinc-800 hover:bg-zinc-700 text-white'
              }`}
            >
              {instant ? <Zap className="w-4 h-4" /> : <Download className="w-4 h-4" />}
              <span>{phase === 'done' ? 'Download again' : instant ? 'Instant Download' : 'Start Download'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
