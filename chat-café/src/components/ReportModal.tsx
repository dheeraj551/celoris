import React, { useState } from 'react';
import { X, Flag, AlertTriangle, Check } from 'lucide-react';
import { ChatMessage } from '../types';

interface ReportModalProps {
  message: ChatMessage | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitReport: (messageId: string, reason: string, note?: string) => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  message,
  isOpen,
  onClose,
  onSubmitReport,
}) => {
  const [reason, setReason] = useState<string>('harassment');
  const [note, setNote] = useState('');

  if (!isOpen || !message) return null;

  const handleSubmit = () => {
    onSubmitReport(message.id, reason, note);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div
        id="report-message-modal"
        className="bg-stone-900 border border-stone-700 rounded-3xl w-full max-w-md shadow-2xl text-stone-100 p-5 space-y-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-950/60 text-rose-400 border border-rose-700/40 flex items-center justify-center">
              <Flag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-base font-bold text-rose-200">
                Report Message to Café Staff
              </h2>
              <p className="text-[11px] text-stone-400">Sent directly to moderator review queue</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-stone-800 text-stone-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message preview snippet */}
        <div className="p-3 rounded-xl bg-black/40 border border-stone-800 text-xs text-stone-300 space-y-1">
          <div className="text-[10px] text-stone-400 font-semibold">{message.sender.name} wrote:</div>
          <div className="italic text-amber-100 font-mono line-clamp-3">"{message.content}"</div>
        </div>

        {/* Reason Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-stone-300">Reason for report:</label>
          <div className="space-y-1">
            {[
              { id: 'harassment', label: 'Harassment or Personal Attack', desc: 'Hostile, insulting, or bullying language' },
              { id: 'inappropriate', label: 'Inappropriate or Hate Speech', desc: 'Discriminatory remarks or explicit content' },
              { id: 'spam', label: 'Spam or Commercial Promotion', desc: 'Repetitive advertising or bot behavior' },
              { id: 'disrespectful', label: 'Disrespectful / Disruptive', desc: 'Intentional derailment of guided discussions' },
              { id: 'off_topic', label: 'Off-Topic or Misplaced', desc: 'Belongs in a different room or table' },
            ].map((r) => (
              <label
                key={r.id}
                className={`flex items-start gap-2.5 p-2 rounded-xl border text-xs cursor-pointer transition-all ${
                  reason === r.id
                    ? 'bg-rose-950/40 border-rose-600/50 text-rose-200'
                    : 'bg-stone-950/50 border-stone-800 text-stone-300 hover:bg-stone-800/40'
                }`}
              >
                <input
                  type="radio"
                  name="reportReason"
                  value={r.id}
                  checked={reason === r.id}
                  onChange={() => setReason(r.id)}
                  className="mt-0.5 accent-rose-500"
                />
                <div>
                  <div className="font-semibold">{r.label}</div>
                  <div className="text-[10px] text-stone-400">{r.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Optional Note */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-stone-300">Additional Context (Optional)</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            placeholder="Help moderators understand what happened..."
            className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-xs text-stone-100 placeholder:text-stone-500 focus:outline-none focus:border-rose-500 resize-none"
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-800">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-xs text-stone-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-950/50 flex items-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Submit Report</span>
          </button>
        </div>
      </div>
    </div>
  );
};
