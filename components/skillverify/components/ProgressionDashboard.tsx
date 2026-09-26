import React, { useState } from 'react';
import { 
  Zap, 
  Award, 
  ShieldCheck, 
  Clock, 
  Send, 
  CheckCircle2, 
  Lock, 
  Sparkles, 
  Copy, 
  ExternalLink, 
  BookOpenCheck,
  TrendingUp,
  Flame,
  Info
} from 'lucide-react';
import { UserProfile, UserTierLevel, VerifiedBadge } from '../types';
import { LEVEL_TIERS } from '../data/mockData';
import { AnimatedTooltip } from './AnimatedTooltip';
import { soundFx } from '../utils/audio';

interface ProgressionDashboardProps {
  user: UserProfile;
  onOpenExamsTab: () => void;
  onOpenAIExamModal: () => void;
}

export const ProgressionDashboard: React.FC<ProgressionDashboardProps> = ({
  user,
  onOpenExamsTab,
  onOpenAIExamModal,
}) => {
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const currentTierInfo = LEVEL_TIERS[user.level];
  const nextLevel = (user.level < 5 ? (user.level + 1) : 5) as UserTierLevel;
  const nextTierInfo = LEVEL_TIERS[nextLevel];

  const progressPercent = Math.min(
    100,
    Math.max(0, Math.round(((user.currentXP - currentTierInfo.minXP) / (user.nextLevelXP - currentTierInfo.minXP)) * 100))
  );

  const handleCopyHash = (hash: string) => {
    soundFx.playClick();
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const formatSeconds = (totalSecs: number) => {
    const hours = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="space-y-6 select-none">
      
      {/* ------------------------------------------------------------- */}
      {/* TOP PROGRESSION SUMMARY HERO */}
      {/* ------------------------------------------------------------- */}
      <div 
        id="tour-badge-passport"
        className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#0c1017] via-emerald-950/40 to-[#07090e] border border-emerald-500/25 shadow-2xl text-white space-y-6"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Verified Candidate Progression
              </span>
              <AnimatedTooltip
                id="tooltip-progression-info"
                title="Progression Mechanics"
                content="As you spend time on platform, apply for jobs, and clear anti-cheat exams, your XP level grows. Higher levels unlock higher salary tiers!"
                badge="Progression Engine"
              />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Level {user.level}: {currentTierInfo.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              {currentTierInfo.desc}
            </p>
          </div>

          {/* Quick Metrics Capsule Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-center">
              <span className="text-[11px] text-slate-400 font-medium block">Total XP</span>
              <span className="text-lg font-extrabold text-emerald-400 font-mono">{user.currentXP}</span>
            </div>
            <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-center">
              <span className="text-[11px] text-slate-400 font-medium block">Platform Time</span>
              <span className="text-lg font-extrabold text-emerald-400 font-mono">{formatSeconds(user.totalTimeSpentSeconds)}</span>
            </div>
            <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-center col-span-2 sm:col-span-1">
              <span className="text-[11px] text-slate-400 font-medium block">Honor Integrity</span>
              <span className="text-lg font-extrabold text-emerald-300 font-mono">{user.honorScore}%</span>
            </div>
          </div>
        </div>

        {/* XP Progress Bar to Next Level */}
        <div className="space-y-2 bg-black/30 p-4 rounded-xl border border-white/10">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300">
              Level {user.level} ({currentTierInfo.name})
            </span>
            <span className="text-emerald-400 font-mono font-bold">
              {user.currentXP} / {user.nextLevelXP} XP ({progressPercent}%)
            </span>
            <span className="font-semibold text-slate-400">
              Level {nextLevel} ({nextTierInfo.name})
            </span>
          </div>

          <div className="w-full h-3 bg-black/60 rounded-full overflow-hidden p-0.5 border border-white/10">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 rounded-full transition-all duration-700 shadow-xs"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
            <span>Need {user.nextLevelXP - user.currentXP} XP to unlock Level {nextLevel}</span>
            <span className="text-emerald-400 font-medium">Unlocks {nextTierInfo.perks[0]}</span>
          </div>
        </div>

        {/* How to Earn XP Action Prompts */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <button
            type="button"
            onClick={onOpenExamsTab}
            className="p-3.5 rounded-xl bg-[#131620] hover:bg-[#181d2a] border border-white/10 text-left transition-all group shadow-xs"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-white group-hover:text-emerald-400">Take Anti-Cheat Exam</span>
              <span className="text-xs font-mono font-bold text-emerald-400">+250 XP</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Earn official verified badge & unlock high-end roles.</p>
          </button>

          <button
            type="button"
            onClick={onOpenAIExamModal}
            className="p-3.5 rounded-xl bg-[#131620] hover:bg-[#181d2a] border border-white/10 text-left transition-all group shadow-xs"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-white group-hover:text-emerald-400">Skill Dataset Exam</span>
              <span className="text-xs font-mono font-bold text-emerald-400">+300 XP</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Domain question dataset test on specialized stacks.</p>
          </button>

          <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-left shadow-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-white">Active Platform Time</span>
              <span className="text-xs font-mono font-bold text-emerald-400">+5 XP / min</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Earned automatically while browsing and alert tracking.</p>
          </div>
        </div>

      </div>

      {/* ------------------------------------------------------------- */}
      {/* VERIFIED SKILL BADGES PASSPORT */}
      {/* ------------------------------------------------------------- */}
      <div className="p-6 rounded-2xl bg-[#0d1017]/95 backdrop-blur-xl border border-white/[0.08] shadow-2xl space-y-4">
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-400" />
              <span>Verified Skill Badges ({user.verifiedBadges.length})</span>
            </h2>
            <p className="text-xs text-slate-400">
              Cryptographically timestamped credentials validated via anti-cheat proctored exams.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenExamsTab}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black text-xs font-extrabold shadow-sm transition-all active:scale-98"
          >
            + Earn New Badge
          </button>
        </div>

        {user.verifiedBadges.length === 0 ? (
          <div className="p-8 text-center rounded-xl bg-black/40 border border-white/10 space-y-3">
            <Award className="w-10 h-10 text-slate-500 mx-auto" />
            <h3 className="text-sm font-bold text-white">No verified badges yet</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Take an anti-cheat proctored exam to earn your first certified credential and unlock ₹150k+ roles.
            </p>
            <button
              type="button"
              onClick={onOpenExamsTab}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all"
            >
              Explore Available Exams
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {user.verifiedBadges.map((badge) => (
              <div
                key={badge.id}
                className="p-5 rounded-2xl bg-[#131620] hover:bg-[#181d2a] border border-white/10 hover:border-emerald-500/40 shadow-xl space-y-3 relative overflow-hidden transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shadow-xs"
                      style={{ backgroundColor: badge.badgeColor }}
                    >
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-white">
                        {badge.badgeTitle}
                      </h3>
                      <p className="text-xs text-slate-400">
                        {badge.industry} • Earned {badge.earnedDate}
                      </p>
                    </div>
                  </div>

                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 text-[10px] font-bold">
                    Score: {badge.score}%
                  </span>
                </div>

                {/* Cryptographic verification ID & Copy */}
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <span className="text-[10px] text-slate-500">VERIFY ID:</span>
                    <span className="font-bold text-emerald-400">{badge.verificationHash}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyHash(badge.verificationHash)}
                    className="p-1 rounded text-slate-400 hover:text-emerald-400 transition-colors"
                    title="Copy verification hash"
                  >
                    {copiedHash === badge.verificationHash ? (
                      <span className="text-[10px] text-emerald-400 font-bold font-sans">Copied!</span>
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>Proctor Integrity: <strong className="text-emerald-400">{badge.proctorScore}%</strong></span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Unlocks ₹150k+ Tier
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* ------------------------------------------------------------- */}
      {/* ALL LEVEL TIERS ROADMAP */}
      {/* ------------------------------------------------------------- */}
      <div className="p-6 rounded-2xl bg-[#0d1017]/95 backdrop-blur-xl border border-white/[0.08] shadow-2xl space-y-4">
        
        <div className="space-y-0.5">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <span>Career Tier Roadmap & Job Unlocks</span>
          </h2>
          <p className="text-xs text-slate-400">
            Higher verified levels unlock executive leadership, staff architect roles, and higher compensation tiers.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          {([1, 2, 3, 4, 5] as UserTierLevel[]).map((lvl) => {
            const info = LEVEL_TIERS[lvl];
            const isCurrent = user.level === lvl;
            const isUnlocked = user.level >= lvl;

            return (
              <div
                key={lvl}
                className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isCurrent
                    ? 'bg-emerald-500/10 border-emerald-500/40 shadow-xs'
                    : isUnlocked
                    ? 'bg-[#131620] border-white/10'
                    : 'bg-[#0f121a]/50 border-white/5 opacity-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-sm shadow-xs"
                    style={{ backgroundColor: info.color }}
                  >
                    L{lvl}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-white">
                        {info.name}
                      </h3>
                      {isCurrent && (
                        <span className="px-2 py-0.2 rounded-full bg-emerald-500 text-black text-[10px] font-black">
                          Current Level
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400">{info.desc}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs">
                  {info.perks.map((perk, idx) => (
                    <span
                      key={idx}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium ${
                        isUnlocked
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                          : 'bg-white/5 text-slate-500'
                      }`}
                    >
                      {isUnlocked ? '✓ ' : '🔒 '}
                      {perk}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};
