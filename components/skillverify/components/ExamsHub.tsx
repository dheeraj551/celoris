import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Sparkles,
  Clock,
  Award,
  Zap,
  Lock,
  CheckCircle2,
  ChevronRight,
  Brain,
  ShieldAlert,
  Eye,
  BookOpen,
  Send,
  X,
  Loader2,
  Link2,
  Check,
  ListChecks
} from 'lucide-react';
import { ExamDefinition, UserProfile } from '../types';
import { AnimatedTooltip } from './AnimatedTooltip';
import { soundFx } from '../utils/audio';
import { useAuth } from '@/components/providers/AuthProvider';
import { ExamCourseSuggestion } from './ExamCourseSuggestion';
import { timeUntil } from '@/lib/exam-courses';

// Per-exam attempt status from /api/job-center/exam/attempts.
interface AttemptStatus {
  nextAvailableAt: string | null;
  inProgress?: { attemptId: string; startedAt: string };
  last?: { score: number | null; passed: boolean | null; status: string };
}

interface ExamsHubProps {
  exams: ExamDefinition[];
  user: UserProfile;
  onSelectExam: (exam: ExamDefinition) => void;
  onOpenAIExamModal: () => void;
}

// Same allowlist used by app/api/admin/users and app/job-center/exam-results
// — only these accounts see the "invite a candidate" / results tooling on
// this otherwise fully gamified, self-serve exams screen.
const ADMIN_EMAILS = ['support@celorisdesigns.com', 'celoris.designs@gmail.com', 'dheerajkushwaha551@gmail.com'];

export const ExamsHub: React.FC<ExamsHubProps> = ({
  exams,
  user,
  onSelectExam,
  onOpenAIExamModal,
}) => {
  const { user: authUser } = useAuth();
  const isAdmin = !!authUser?.email && ADMIN_EMAILS.includes(authUser.email);
  const [inviteExam, setInviteExam] = useState<ExamDefinition | null>(null);
  const [attempts, setAttempts] = useState<Record<string, AttemptStatus>>({});
  const [retakeDays, setRetakeDays] = useState<number | null>(null);

  // Refresh whenever the list is shown again (e.g. after finishing an exam).
  const historyLength = user.examHistory.length;
  useEffect(() => {
    if (!authUser) return;
    let cancelled = false;
    fetch('/api/job-center/exam/attempts', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled || !data) return;
        setAttempts(data.exams || {});
        if (typeof data.retakeDays === 'number') setRetakeDays(data.retakeDays);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [authUser, historyLength]);

  return (
    <div className="space-y-6">

      {/* EXAMS HERO BANNER */}
      <div 
        id="tour-exam-hub-btn"
        className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 border border-emerald-800/30 shadow-lg text-white space-y-6"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Anti-Cheat Proctored Engine
              </span>
              <AnimatedTooltip
                id="tooltip-anticheat-hero"
                title="Strict Anti-Cheat Protocols"
                content="Our proctoring kernel monitors tab blur, screen changes, and copy-paste tampering. Earning a badge proves authentic technical mastery to hiring teams!"
                badge="Proctor Guard"
                showPulse
              />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Job Center Assessment Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Pass rigorous proctored assessments to earn verified cryptographic badges, boost your XP level, and unlock exclusive high-end certified positions.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isAdmin && (
              <Link
                href="/job-center/exam-results"
                className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white font-bold text-xs flex items-center gap-2 transition-all"
              >
                <ListChecks className="w-4 h-4" />
                <span>Candidate Results</span>
              </Link>
            )}
            <button
              type="button"
              onClick={() => {
                soundFx.playNotification();
                onOpenAIExamModal();
              }}
              className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-900/40 flex items-center gap-2 transition-all hover:scale-[1.02]"
            >
              <BookOpen className="w-4 h-4 text-emerald-100" />
              <span>Launch Custom Skill Exam</span>
            </button>
          </div>
        </div>

        {/* Security Safeguards Feature Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-emerald-900/40 space-y-1">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-xs">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>Tab-Switch Detection</span>
            </div>
            <p className="text-[11px] text-slate-400">Navigating away records an instant proctor violation strike.</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-emerald-900/40 space-y-1">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
              <Eye className="w-4 h-4 shrink-0" />
              <span>Gaze & Focus Monitor</span>
            </div>
            <p className="text-[11px] text-slate-400">Maintains proctor visual continuity throughout the assessment.</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-emerald-900/40 space-y-1">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
              <Award className="w-4 h-4 shrink-0" />
              <span>Verified Hash Issued</span>
            </div>
            <p className="text-[11px] text-slate-400">Instant cryptographic certificate attached to your job applications.</p>
          </div>
        </div>

      </div>

      {/* EXAMS LIST GRID */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white">
              Available Certification Assessments ({exams.length})
            </h2>
            <p className="text-xs text-slate-400">
              Instant grading and verified badge issuance · one attempt per exam every {retakeDays ?? 7} day{(retakeDays ?? 7) === 1 ? '' : 's'}.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {exams.map((exam) => {
            const hasEarned = user.verifiedBadges.some(
              (b) => b.badgeTitle.toLowerCase() === exam.badgeTitle.toLowerCase()
            );
            const st = attempts[exam.id];
            const waiting = !!st?.nextAvailableAt;
            const lastFailed = !!st?.last && st.last.passed !== true && !hasEarned;

            return (
              <div
                key={exam.id}
                onClick={() => {
                  soundFx.playClick();
                  onSelectExam(exam);
                }}
                className="p-5 rounded-2xl bg-[#0d1017]/95 hover:bg-[#121622] border border-white/[0.08] hover:border-emerald-500/40 shadow-xl hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white shadow group-hover:scale-105 transition-transform"
                        style={{ backgroundColor: exam.badgeColor }}
                      >
                        <Award className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm sm:text-base text-white group-hover:text-emerald-400 transition-colors">
                          {exam.badgeTitle}
                        </h3>
                        <p className="text-xs text-slate-400">
                          {exam.industry} • <span className="text-emerald-400 font-semibold">{exam.difficulty}</span>
                        </p>
                      </div>
                    </div>

                    {hasEarned && (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 text-[10px] font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Certified
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {exam.description}
                  </p>

                  {waiting && (
                    <p className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-300">
                      <Clock className="w-3.5 h-3.5" />
                      {typeof st?.last?.score === 'number' ? `Last score ${st.last.score}% · ` : ''}next attempt {timeUntil(st!.nextAvailableAt!)}
                    </p>
                  )}
                  {lastFailed && <ExamCourseSuggestion examId={exam.id} compact />}

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      {exam.timeLimitMinutes} mins
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                      {exam.questions.length} Questions
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5" />
                      +{exam.xpReward} XP Reward
                    </span>
                  </div>
                </div>

                {/* Bottom Target Roles & Action Button */}
                <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-400 truncate max-w-[160px] font-mono">
                    Unlocks: {exam.targetRoleExamples[0]}
                  </span>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          soundFx.playClick();
                          setInviteExam(exam);
                        }}
                        title="Invite a candidate to take this exam by email"
                        className="px-2.5 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-slate-300 text-xs font-bold transition-all flex items-center gap-1"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Invite</span>
                      </button>
                    )}
                    {waiting ? (
                      <button
                        type="button"
                        className="px-3.5 py-1.5 rounded-xl bg-white/[0.06] border border-white/10 text-slate-300 text-xs font-bold flex items-center gap-1"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>Opens {timeUntil(st!.nextAvailableAt!)}</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black text-xs font-extrabold shadow-sm transition-all flex items-center gap-1 active:scale-98"
                      >
                        <span>{st?.inProgress ? 'Continue Exam' : hasEarned ? 'Retake Exam' : 'Start Assessment'}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {inviteExam && (
        <InviteCandidateModal exam={inviteExam} onClose={() => setInviteExam(null)} />
      )}

    </div>
  );
};

// Sends a candidate the link to the no-login public exam page
// (app/exam/[examId], via app/api/exam/invite). Only rendered for the two
// admin accounts — see ADMIN_EMAILS above.
const InviteCandidateModal: React.FC<{ exam: ExamDefinition; onClose: () => void }> = ({ exam, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [copied, setCopied] = useState(false);

  const examUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/exam/${exam.id}${name || email ? `?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}` : ''}`
      : '';

  const handleSend = async () => {
    if (!name.trim() || !email.trim()) return;
    setStatus('sending');
    try {
      const res = await fetch('/api/exam/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ examId: exam.id, candidateName: name, candidateEmail: email }),
      });
      if (!res.ok) throw new Error('failed');
      setStatus('sent');
      soundFx.playNotification();
    } catch {
      setStatus('error');
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(examUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API can fail silently in some browser contexts — no-op.
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="w-full max-w-md bg-[#0e1118] border border-white/10 rounded-2xl shadow-2xl p-6 space-y-4 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-bold text-white text-sm">Invite a candidate</h3>
            <p className="text-xs text-slate-400 mt-0.5">{exam.title}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-400">
          No Celoris account needed — they'll get a direct link to take this exam and you'll be emailed the result.
        </p>

        <div className="space-y-2.5">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Candidate name"
            className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-emerald-400 transition-colors"
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Candidate email"
            type="email"
            className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-emerald-400 transition-colors"
          />
        </div>

        {status === 'sent' ? (
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold py-2">
            <Check className="w-4 h-4" /> Invite sent to {email}
          </div>
        ) : (
          <button
            onClick={handleSend}
            disabled={!name.trim() || !email.trim() || status === 'sending'}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 disabled:opacity-50 text-black text-xs font-extrabold flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            {status === 'sending' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {status === 'sending' ? 'Sending…' : 'Send via Email'}
          </button>
        )}
        {status === 'error' && (
          <p className="text-xs text-rose-400">Couldn't send that email — try again in a moment.</p>
        )}

        <div className="pt-2 border-t border-white/10">
          <button
            onClick={handleCopy}
            disabled={!name.trim() || !email.trim()}
            className="w-full py-2 rounded-xl border border-white/10 hover:bg-white/5 disabled:opacity-40 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
          >
            <Link2 className="w-3.5 h-3.5" />
            {copied ? 'Link copied!' : 'Or copy the link instead'}
          </button>
        </div>
      </div>
    </div>
  );
};
