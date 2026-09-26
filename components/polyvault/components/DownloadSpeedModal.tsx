import React from 'react';
import Link from 'next/link';
import { Check, Gauge, X, Zap } from 'lucide-react';
import { DownloadLane } from '../types';

// "Download speeds" — what each Celoris plan gets in PolyVault. Replaces the
// old speed-coupon screen: download speed now comes from the member's plan
// (set in Admin → Plans → PolyVault → "Download queue").

interface DownloadSpeedModalProps {
  isOpen: boolean;
  onClose: () => void;
  lane: DownloadLane | null;
  lanes: DownloadLane[];
}

function waitText(s: number) {
  return s <= 0 ? 'Starts instantly' : `${s}-second queue`;
}

export const DownloadSpeedModal: React.FC<DownloadSpeedModalProps> = ({ isOpen, onClose, lane, lanes }) => {
  if (!isOpen) return null;
  const current = lane?.tier || 'free';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="relative w-full max-w-md bg-white border border-zinc-200 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-5 border-b border-zinc-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
              <Gauge className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-950 tracking-tight">Download speeds</h2>
              <p className="text-xs text-zinc-500">Your Celoris plan decides how fast downloads start.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-3">
          {lanes.map((l) => {
            const isCurrent = l.tier === current;
            return (
              <div
                key={l.tier}
                className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 ${
                  isCurrent ? 'bg-emerald-50 border-emerald-300' : 'bg-zinc-50 border-zinc-200'
                }`}
              >
                <div>
                  <div className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                    {l.planLabel}
                    {isCurrent && (
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-1.5 py-0.5 rounded">
                        YOUR PLAN
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-zinc-500 mt-0.5">{waitText(l.waitSeconds)}</div>
                </div>
                <span
                  className={`text-xs font-bold flex items-center gap-1 ${
                    l.waitSeconds <= 0 ? 'text-emerald-700' : l.waitSeconds <= 10 ? 'text-sky-700' : 'text-zinc-500'
                  }`}
                >
                  {l.waitSeconds <= 0 ? <Zap className="w-3.5 h-3.5" /> : <Gauge className="w-3.5 h-3.5" />}
                  {l.laneName}
                </span>
              </div>
            );
          })}

          <p className="text-[11px] text-zinc-500 flex items-start gap-1.5 pt-1">
            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
            Once a download starts, every plan gets the full file straight from our cloud storage.
          </p>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button onClick={onClose} className="px-4 py-2 rounded-xl text-xs text-zinc-600 hover:bg-zinc-100 cursor-pointer">
              Close
            </button>
            {current !== 'max' && (
              <Link
                href="/pricing"
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm"
              >
                See plans
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
