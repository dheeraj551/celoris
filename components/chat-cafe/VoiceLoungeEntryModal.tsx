import React from 'react';
import { X, Mic, Video, Wallet, AlertTriangle } from 'lucide-react';
import { CafeTable } from './types';

interface VoiceLoungeEntryModalProps {
  /** null = closed. Set by ChatCafeApp.handleSelectTable when the caller
      picks a room_kind 'voice_video' table they haven't paid for yet. */
  table: CafeTable | null;
  walletBalance: number;
  isLoading: boolean;
  error: string | null;
  onConfirm: () => void;
  onClose: () => void;
}

export const VoiceLoungeEntryModal: React.FC<VoiceLoungeEntryModalProps> = ({
  table,
  walletBalance,
  isLoading,
  error,
  onConfirm,
  onClose,
}) => {
  if (!table) return null;

  const entryFee = table.entryFee || 0;
  const canAfford = walletBalance >= entryFee;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div
        id="voice-lounge-entry-modal"
        className="bg-stone-900 border border-fuchsia-700/40 rounded-3xl w-full max-w-md shadow-2xl text-stone-100 p-5 space-y-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-fuchsia-950/60 text-fuchsia-300 border border-fuchsia-700/40 flex items-center justify-center text-base">
              {table.icon || '🎙️'}
            </div>
            <div>
              <h2 className="font-serif text-base font-bold text-fuchsia-200">{table.name}</h2>
              <p className="text-[11px] text-stone-400">Live mic + camera — a paid seat</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-stone-800 text-stone-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-stone-300 leading-relaxed">{table.tagline}</p>

        <div className="flex items-center gap-4 text-[11px] text-stone-400">
          <span className="flex items-center gap-1.5">
            <Mic className="w-3.5 h-3.5 text-fuchsia-400" /> Voice
          </span>
          <span className="flex items-center gap-1.5">
            <Video className="w-3.5 h-3.5 text-fuchsia-400" /> Video
          </span>
        </div>

        {/* Fee / balance breakdown */}
        <div className="p-3 rounded-xl bg-black/40 border border-stone-800 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-stone-400">Entry fee (one-time, this visit)</span>
            <span className="font-bold text-fuchsia-300">₹{entryFee.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-stone-400 flex items-center gap-1">
              <Wallet className="w-3.5 h-3.5" /> Your wallet balance
            </span>
            <span className={`font-bold ${canAfford ? 'text-emerald-400' : 'text-rose-400'}`}>
              ₹{walletBalance.toLocaleString()}
            </span>
          </div>
        </div>

        {!canAfford && (
          <div className="flex items-start gap-2 p-2.5 rounded-xl bg-rose-950/40 border border-rose-700/40 text-[11px] text-rose-200">
            <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
            <span>Not enough balance to enter this room. Top up your wallet and try again.</span>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-2 p-2.5 rounded-xl bg-rose-950/40 border border-rose-700/40 text-[11px] text-rose-200">
            <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-800">
          <button onClick={onClose} className="px-3.5 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-xs text-stone-300">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={!canAfford || isLoading}
            className="px-4 py-1.5 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-500 disabled:bg-stone-700 disabled:cursor-not-allowed text-white text-xs font-bold shadow-md shadow-fuchsia-950/50 flex items-center gap-1.5"
          >
            <span>{isLoading ? 'Entering…' : `Pay ₹${entryFee.toLocaleString()} & Enter`}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
