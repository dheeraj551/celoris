"use client"
import React, { useState } from 'react';
import {
  X,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Lock,
  EyeOff,
  UserX,
  Flag,
} from 'lucide-react';
import { Post, User, ReportCategory, ReportItem } from '../types';
import { createReportRecord } from '../utils/socialLogic';
import { soundManager } from '../utils/sound';

interface ReportModalProps {
  post?: Post | null;
  targetUser?: User | null;
  currentUser: User;
  onClose: () => void;
  onSubmitReport: (report: ReportItem) => void;
}

const REPORT_REASONS: { category: ReportCategory; title: string; description: string }[] = [
  {
    category: 'spam',
    title: 'Spam or Scam',
    description: 'Deceptive links, fraudulent offers, financial scams, or mass automated comments.',
  },
  {
    category: 'harassment',
    title: 'Harassment or Bullying',
    description: 'Targeted attacks, threats, sharing private personal info, or intimidation.',
  },
  {
    category: 'hate_speech',
    title: 'Hate Speech or Symbols',
    description: 'Attacking protected identities, discrimination, or slurs.',
  },
  {
    category: 'misinformation',
    title: 'False Information',
    description: 'Harmful medical misinformation, manipulated media, or civic disinformation.',
  },
  {
    category: 'violence',
    title: 'Violence or Dangerous Content',
    description: 'Depicting or inciting illegal violence, self-harm, or dangerous organizations.',
  },
  {
    category: 'copyright',
    title: 'Intellectual Property Violation',
    description: 'Infringement of copyright, unregistered trademark, or stolen creator work.',
  },
  {
    category: 'inappropriate_content',
    title: 'Inappropriate or Sensitive Media',
    description: 'Graphic content or adult material not tagged appropriately.',
  },
];

export const ReportModal: React.FC<ReportModalProps> = ({
  post,
  targetUser,
  currentUser,
  onClose,
  onSubmitReport,
}) => {
  const userToReport = targetUser || post?.user;
  const [selectedCategory, setSelectedCategory] = useState<ReportCategory>('spam');
  const [details, setDetails] = useState('');
  const [blockUser, setBlockUser] = useState(false);
  const [muteUser, setMuteUser] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);

  if (!userToReport) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setErrorMsg('');
      const report = createReportRecord(
        currentUser,
        post?.id || userToReport.id,
        userToReport,
        post ? 'post' : 'user',
        selectedCategory,
        details || 'Flagged for moderation review due to community standards violation.'
      );

      soundManager.playSendSound();
      onSubmitReport(report);
      setSubmittedTicket(report.id);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg('Failed to submit report');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-rose-500">
            <ShieldAlert size={20} />
            <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-100">
              Report Content
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close report modal"
            className="p-1.5 rounded-full text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {submittedTicket ? (
            /* Confirmation View */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 flex items-center justify-center mx-auto">
                <CheckCircle2 size={36} />
              </div>
              <div>
                <h4 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                  Report Received
                </h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-sm mx-auto">
                  Thank you for helping keep Lumigram safe. Our Trust & Safety team has prioritized
                  case <span className="font-mono text-pink-600 dark:text-pink-400 font-bold">#{submittedTicket}</span>.
                </p>
              </div>

              {(blockUser || muteUser) && (
                <div className="p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-xs text-neutral-700 dark:text-neutral-300">
                  {blockUser && <p>• Blocked @{userToReport.username} from contacting you</p>}
                  {muteUser && <p>• Muted posts and stories from @{userToReport.username}</p>}
                </div>
              )}

              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl font-semibold text-xs bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 cursor-pointer"
              >
                Done
              </button>
            </div>
          ) : (
            /* Report Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-2">
                  Why are you reporting this {post ? 'photo' : 'account'} from{' '}
                  <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                    @{userToReport.username}
                  </span>
                  ?
                </p>

                {/* Reason Selection */}
                <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                  {REPORT_REASONS.map((r) => (
                    <label
                      key={r.category}
                      className={`block p-3 rounded-xl border transition-all cursor-pointer ${
                        selectedCategory === r.category
                          ? 'border-rose-500 bg-rose-50/40 dark:bg-rose-950/20'
                          : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <input
                          type="radio"
                          name="reportCategory"
                          checked={selectedCategory === r.category}
                          onChange={() => setSelectedCategory(r.category)}
                          className="mt-0.5 text-rose-500 focus:ring-rose-500"
                        />
                        <div>
                          <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 block">
                            {r.title}
                          </span>
                          <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                            {r.description}
                          </span>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Additional Context Input */}
              <div>
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                  Additional Details (Optional)
                </label>
                <textarea
                  rows={2}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Provide context or timestamps to help our moderation team review..."
                  className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-transparent text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              {/* Safety Quick Actions */}
              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 space-y-2">
                <span className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block">
                  Quick Safety Actions
                </span>

                <label className="flex items-center gap-2 text-xs text-neutral-800 dark:text-neutral-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={blockUser}
                    onChange={(e) => setBlockUser(e.target.checked)}
                    className="rounded text-rose-500"
                  />
                  <UserX size={14} className="text-neutral-500" />
                  <span>Block @{userToReport.username}</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-neutral-800 dark:text-neutral-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={muteUser}
                    onChange={(e) => setMuteUser(e.target.checked)}
                    className="rounded text-rose-500"
                  />
                  <EyeOff size={14} className="text-neutral-500" />
                  <span>Mute posts and stories from this user</span>
                </label>
              </div>

              {errorMsg && (
                <p className="text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1">
                  <AlertTriangle size={13} />
                  {errorMsg}
                </p>
              )}

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Flag size={14} />
                  Submit Report
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

