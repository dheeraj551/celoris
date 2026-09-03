import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  DollarSign, 
  Briefcase, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  Sparkles, 
  Send, 
  Clock, 
  Users, 
  Award,
  Loader2,
  ExternalLink
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden text-slate-800 flex flex-col max-h-[90vh]">
        
        {/* Header banner */}
        <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-3xl shadow-xs shrink-0">
              {job.logo}
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">
                  {job.title}
                </h2>
                {job.tier === 'certified' ? (
                  <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-300 text-[10px] font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-amber-600" />
                    Certified Pro Tier
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold">
                    Public Portal
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                {job.company} • <span className="text-slate-400">{job.industry}</span>
              </p>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                  {job.salaryRange}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {job.location}
                </span>
                <span className="flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                  {job.workMode}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          
          {/* Gating Status Alert if Locked */}
          {!isUnlocked && (
            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-bold text-xs text-amber-900">
                  <Lock className="w-4 h-4 text-amber-600" />
                  Locked High-End Role — Verification Required
                </span>
                <span className="text-[10px] text-amber-700 font-semibold">Level {job.minLevelRequired}+</span>
              </div>
              <p className="text-xs text-amber-800 leading-relaxed">
                This employer fast-tracks candidates with validated anti-cheat credentials. Complete the required certification exam to unlock direct application rights!
              </p>
              
              {missingBadges.length > 0 && (
                <div className="pt-1 space-y-1.5">
                  <span className="text-[11px] text-slate-600 font-semibold">Required Exam Badges:</span>
                  <div className="flex flex-wrap gap-2">
                    {missingBadges.map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => onLaunchExamForJob(b)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all"
                      >
                        <Award className="w-3.5 h-3.5 text-emerald-200" />
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
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
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
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {userHasSkill && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                    {skill}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Responsibilities */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Key Responsibilities</h3>
            <ul className="space-y-1.5 text-xs sm:text-sm text-slate-600">
              {job.responsibilities.map((resp, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2 shrink-0" />
                  <span>{resp}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Benefits & Perks */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Perks & Compensation</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
              {job.benefits.map((benefit, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Match & Pitch Analyzer Widget */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                AI Profile Match & Verified Pitch
              </span>
              {!aiMatchAnalysis && (
                <button
                  type="button"
                  onClick={handleAnalyzeMatch}
                  disabled={aiMatchLoading}
                  className="px-3 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border border-emerald-300 text-xs font-medium transition-all"
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
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
                  <span className="text-slate-700">Overall Candidate Match:</span>
                  <span className="font-bold text-emerald-800 text-sm">{aiMatchAnalysis.matchPercentage}% ({aiMatchAnalysis.matchRating})</span>
                </div>
                {aiMatchAnalysis.tailoredPitch && (
                  <div className="p-3 rounded-lg bg-white border border-slate-200 text-slate-600 italic">
                    "{aiMatchAnalysis.tailoredPitch}"
                  </div>
                )}
                {aiMatchAnalysis.missingSkills?.length > 0 && (
                  <div className="text-slate-500 text-[11px]">
                    Recommended focus areas: {aiMatchAnalysis.missingSkills.join(', ')}
                  </div>
                )}
              </div>
            )}
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-4">
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <Users className="w-4 h-4 text-slate-400" />
            <span>{job.applicantsCount} active applicants</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-500 hover:text-slate-800 text-xs font-medium"
            >
              Close
            </button>

            {job.sourceUrl && (
              <a
                href={job.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Apply on LinkedIn</span>
              </a>
            )}

            {isApplied ? (
              <div className="px-5 py-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Application Submitted (+25 XP)</span>
              </div>
            ) : isUnlocked ? (
              <button
                type="button"
                onClick={handleApplyClick}
                disabled={isApplying}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md flex items-center gap-2 transition-all hover:scale-[1.02]"
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
                className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition-all"
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
