import React, { useState } from 'react';
import { 
  X,
  MapPin,
  IndianRupee,
  Briefcase,
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  Sparkles, 
  Send,
  Clock,
  Award,
  Loader2
} from 'lucide-react';
import { JobListing, UserProfile, UserTierLevel } from '../types';
import { LEVEL_TIERS } from '../data/mockData';
import { AnimatedTooltip } from './AnimatedTooltip';
import { soundFx } from '../utils/audio';
import confetti from 'canvas-confetti';

interface JobDetailsModalProps {
  job: JobListing | null;
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onApply: (jobId: string) => void;
  onLaunchExamForJob: (badgeName: string) => void;
}

export const JobDetailsModal: React.FC<JobDetailsModalProps> = ({
  job,
  user,
  isOpen,
  onClose,
  onApply,
  onLaunchExamForJob,
}) => {
  const [isApplying, setIsApplying] = useState(false);
  const [hasAppliedLocally, setHasAppliedLocally] = useState(false);
  const [aiMatchLoading, setAiMatchLoading] = useState(false);
  const [aiMatchAnalysis, setAiMatchAnalysis] = useState<any>(null);

  if (!isOpen || !job) return null;

  const isApplied = user.appliedJobIds.includes(job.id) || hasAppliedLocally;
  
  // Check certification unlock criteria
  const userHasRequiredLevel = user.level >= job.minLevelRequired;
  const missingBadges = job.requiredBadges.filter(
    (b) => !user.verifiedBadges.some((ub) => ub.badgeTitle.toLowerCase() === b.toLowerCase())
  );
  const isUnlocked = job.tier === 'public' || (userHasRequiredLevel && missingBadges.length === 0);

  // AI Match Evaluator
  const handleAnalyzeMatch = async () => {
    setAiMatchLoading(true);
    soundFx.playClick();
    try {
      const response = await fetch('/api/jobs/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobTitle: job.title,
          jobCompany: job.company,
          requiredSkills: job.requiredSkills,
          userSkills: user.skills,
          userLevel: user.level,
          userBadges: user.verifiedBadges.map((b) => b.badgeTitle),
        }),
      });
      const data = await response.json();
      if (data.success && data.match) {
        setAiMatchAnalysis(data.match);
      }
    } catch (err) {
      console.error('Job match error:', err);
    } finally {
      setAiMatchLoading(false);
    }
  };

  const handleApplyClick = () => {
    if (!isUnlocked || isApplied) return;
    setIsApplying(true);
    soundFx.playCelebration();
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.7 },
    });
    setTimeout(() => {
      onApply(job.id);
      setHasAppliedLocally(true);
      setIsApplying(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0c0e17] border border-white/[0.12] rounded-2xl shadow-2xl overflow-hidden text-slate-200 flex flex-col max-h-[90vh]">
        
        {/* Header banner */}
        <div className="p-6 bg-[#121522] border-b border-white/[0.08] flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-3xl shadow-inner shrink-0">
              {job.logo}
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-white leading-tight">
                  {job.title}
                </h2>
                {job.tier === 'certified' ? (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[10px] font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-amber-400" />
                    Certified Pro Tier
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold">
                    Public Portal
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-slate-300 font-medium">
                {job.company} • <span className="text-slate-400">{job.industry}</span>
              </p>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-1">
                <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                  <IndianRupee className="w-3.5 h-3.5 text-emerald-400" />
                  {job.salaryRange}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  {job.location}
                </span>
                <span className="flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                  {job.workMode}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-slate-300">
          
          {/* Gating Status Alert if Locked */}
          {!isUnlocked && (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-bold text-xs text-amber-300">
                  <Lock className="w-4 h-4 text-amber-400" />
                  Locked High-End Role — Verification Required
                </span>
                <span className="text-[10px] text-amber-400 font-semibold">Level {job.minLevelRequired}+</span>
              </div>
              <p className="text-xs text-amber-200/90 leading-relaxed">
                This employer fast-tracks candidates with validated anti-cheat credentials. Complete the required certification exam to unlock direct application rights!
              </p>
              
              {missingBadges.length > 0 && (
                <div className="pt-1 space-y-1.5">
                  <span className="text-[11px] text-slate-300 font-semibold">Required Exam Badges:</span>
                  <div className="flex flex-wrap gap-2">
                    {missingBadges.map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => onLaunchExamForJob(b)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all"
                      >
                        <Award className="w-3.5 h-3.5 text-black" />
                        <span>Take "{b}" Exam</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Role Overview</h3>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              {job.description}
            </p>
          </div>

          {/* Required Skills Matrix */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Required Skills & Stack</h3>
            <div className="flex flex-wrap gap-2">
              {job.requiredSkills.map((skill) => {
                const userHasSkill = user.skills.some((s) => s.toLowerCase() === skill.toLowerCase());
                return (
                  <span
                    key={skill}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border flex items-center gap-1 ${
                      userHasSkill
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 font-semibold'
                        : 'bg-white/[0.04] text-slate-300 border-white/[0.08]'
                    }`}
                  >
                    {userHasSkill && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                    {skill}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Responsibilities */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Key Responsibilities</h3>
            <ul className="space-y-1.5 text-xs sm:text-sm text-slate-300">
              {job.responsibilities.map((resp, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                  <span>{resp}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Benefits & Perks */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Perks & Compensation</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
              {job.benefits.map((benefit, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-[#131622] border border-white/[0.08] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Match & Pitch Analyzer Widget */}
          <div className="p-4 rounded-xl bg-[#131622] border border-white/[0.08] space-y-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-xs font-bold text-slate-200">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                AI Profile Match & Verified Pitch
              </span>
              {!aiMatchAnalysis && (
                <button
                  type="button"
                  onClick={handleAnalyzeMatch}
                  disabled={aiMatchLoading}
                  className="px-3 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-medium transition-all"
                >
                  {aiMatchLoading ? (
                    <span className="flex items-center gap-1">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Analyzing...
                    </span>
                  ) : (
                    'Generate AI Analysis'
                  )}
                </button>
              )}
            </div>

            {aiMatchAnalysis && (
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                  <span className="text-slate-300">Overall Candidate Match:</span>
                  <span className="font-bold text-emerald-400 text-sm">{aiMatchAnalysis.matchPercentage}% ({aiMatchAnalysis.matchRating})</span>
                </div>
                {aiMatchAnalysis.tailoredPitch && (
                  <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.08] text-slate-300 italic">
                    "{aiMatchAnalysis.tailoredPitch}"
                  </div>
                )}
                {aiMatchAnalysis.missingSkills?.length > 0 && (
                  <div className="text-slate-400 text-[11px]">
                    Recommended focus areas: {aiMatchAnalysis.missingSkills.join(', ')}
                  </div>
                )}
              </div>
            )}
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#121522] border-t border-white/[0.08] flex items-center justify-end gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-medium transition-colors"
            >
              Close
            </button>

            {isApplied ? (
              <div className="px-5 py-2 rounded-xl bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Application Submitted (+25 XP)</span>
              </div>
            ) : isUnlocked ? (
              <button
                type="button"
                onClick={handleApplyClick}
                disabled={isApplying}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-extrabold text-xs shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all hover:scale-[1.02]"
              >
                {isApplying ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Submitting Verified Dossier...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>1-Click Verified Apply (+25 XP)</span>
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (missingBadges.length > 0) {
                    onLaunchExamForJob(missingBadges[0]);
                  }
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 flex items-center gap-1.5 transition-all"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Unlock via Skill Exam</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
