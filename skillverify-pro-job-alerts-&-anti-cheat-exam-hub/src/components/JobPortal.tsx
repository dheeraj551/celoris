import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  DollarSign, 
  MapPin, 
  Briefcase, 
  Sparkles, 
  Layers, 
  Award,
  ChevronRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { JobListing, JobTier, UserProfile } from '../types';
import { AnimatedTooltip } from './AnimatedTooltip';
import { soundFx } from '../utils/audio';

interface JobPortalProps {
  jobs: JobListing[];
  user: UserProfile;
  selectedTier: JobTier;
  onSelectTier: (tier: JobTier) => void;
  onSelectJob: (job: JobListing) => void;
  onLaunchExamForBadge: (badgeTitle: string) => void;
}

export const JobPortal: React.FC<JobPortalProps> = ({
  jobs,
  user,
  selectedTier,
  onSelectTier,
  onSelectJob,
  onLaunchExamForBadge,
}) => {
  const [selectedIndustry, setSelectedIndustry] = useState<string>('All');
  const [selectedWorkMode, setSelectedWorkMode] = useState<string>('All');
  const [minSalary, setMinSalary] = useState<number>(0);
  const [unlockedOnly, setUnlockedOnly] = useState<boolean>(false);

  const industries = ['All', 'AI / Machine Learning', 'Cloud & Infrastructure', 'FinTech', 'Cybersecurity', 'HealthTech', 'SaaS / Web Platforms'];

  // Match calculation for a job based on user skills
  const calculateMatchScore = (job: JobListing) => {
    if (!job.requiredSkills || job.requiredSkills.length === 0) return 85;
    const matching = job.requiredSkills.filter((req) =>
      user.skills.some((us) => us.toLowerCase() === req.toLowerCase())
    );
    const score = Math.round((matching.length / job.requiredSkills.length) * 100);
    return Math.max(35, score);
  };

  // Filtered jobs list
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // Tier match
      if (job.tier !== selectedTier) return false;

      // Industry match
      if (selectedIndustry !== 'All' && job.industry !== selectedIndustry) {
        return false;
      }

      // Work mode match
      if (selectedWorkMode !== 'All' && job.workMode !== selectedWorkMode) {
        return false;
      }

      // Min Salary match
      if (job.minSalaryNum < minSalary) {
        return false;
      }

      // Unlocked Only filter for Certified tier
      if (unlockedOnly && job.tier === 'certified') {
        const hasLevel = user.level >= job.minLevelRequired;
        const hasBadges = job.requiredBadges.every((rb) =>
          user.verifiedBadges.some((ub) => ub.badgeTitle.toLowerCase() === rb.toLowerCase())
        );
        if (!hasLevel || !hasBadges) return false;
      }

      return true;
    });
  }, [jobs, selectedTier, selectedIndustry, selectedWorkMode, minSalary, unlockedOnly, user]);

  const publicCount = jobs.filter((j) => j.tier === 'public').length;
  const certifiedCount = jobs.filter((j) => j.tier === 'certified').length;

  return (
    <div className="space-y-6">
      
      {/* PORTAL SELECTOR TABS & BANNER */}
      <div className="p-4 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Job Center Marketplace
              </h1>
              <AnimatedTooltip
                id="tooltip-portal-desc"
                title="Dual-Tier Architecture"
                content="Switch between open public jobs or anti-cheat verified certified roles ($150k - $340k+). Verified roles offer higher salaries and skip initial technical screens!"
                badge="Platform Innovation"
                showPulse
              />
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Personalized alerts & opportunities matched with your validated skill achievements.
            </p>
          </div>

          {/* DUAL PORTAL SWITCHER BUTTONS */}
          <div 
            id="tour-portal-toggle"
            className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 shrink-0"
          >
            <button
              id="tab-public-jobs"
              type="button"
              onClick={() => {
                soundFx.playClick();
                onSelectTier('public');
              }}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                selectedTier === 'public'
                  ? 'bg-white text-emerald-800 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
              <span>Public Jobs</span>
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                {publicCount}
              </span>
            </button>

            <button
              id="tab-certified-jobs"
              type="button"
              onClick={() => {
                soundFx.playClick();
                onSelectTier('certified');
              }}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                selectedTier === 'certified'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-100" />
              <span>Certified Roles</span>
              <span className="px-1.5 py-0.2 rounded-full bg-white/25 text-white text-[10px] font-bold">
                {certifiedCount} • $150k+
              </span>
            </button>
          </div>
        </div>

        {/* Certified Tier Explanation Callout */}
        {selectedTier === 'certified' && (
          <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-700">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white border border-emerald-200 flex items-center justify-center shrink-0">
                <Award className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <span className="font-bold text-emerald-950 block">Certified High-End Portal ($150k - $340k+)</span>
                <span className="text-[11px] text-slate-600">
                  Direct recruiter access & fast-track hiring for candidates holding anti-cheat verified badges.
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 text-[11px]">
              <span className="text-slate-500 font-medium">Your Badges:</span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white font-bold font-mono shadow-xs">
                {user.verifiedBadges.length} Active
              </span>
            </div>
          </div>
        )}

        {/* FILTER BAR */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-200">
          <span className="text-slate-500 text-xs font-medium">
            {filteredJobs.length} {filteredJobs.length === 1 ? 'role' : 'roles'} available
          </span>

          {selectedTier === 'certified' && (
            <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-slate-700 text-xs">
              <input
                type="checkbox"
                checked={unlockedOnly}
                onChange={(e) => setUnlockedOnly(e.target.checked)}
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4 accent-emerald-600"
              />
              <span>Unlocked for Me</span>
            </label>
          )}
        </div>

      </div>

      {/* JOB LISTINGS GRID */}
      {filteredJobs.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white border border-slate-200 space-y-3">
          <AlertCircle className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-semibold text-slate-900">
            No matching job listings found
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search keywords, clearing industry filters, or taking certification exams to unlock roles.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedIndustry('All');
              setSelectedWorkMode('All');
              setUnlockedOnly(false);
            }}
            className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredJobs.map((job) => {
            const matchScore = calculateMatchScore(job);
            const isApplied = user.appliedJobIds.includes(job.id);
            const userHasLevel = user.level >= job.minLevelRequired;
            const missingBadges = job.requiredBadges.filter(
              (b) => !user.verifiedBadges.some((ub) => ub.badgeTitle.toLowerCase() === b.toLowerCase())
            );
            const isUnlocked = job.tier === 'public' || (userHasLevel && missingBadges.length === 0);

            return (
              <div
                key={job.id}
                onClick={() => {
                  soundFx.playClick();
                  onSelectJob(job);
                }}
                className={`group relative p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                  job.tier === 'certified'
                    ? isUnlocked
                      ? 'bg-white border-emerald-200 hover:border-emerald-500 shadow-xs hover:shadow-md'
                      : 'bg-slate-50/70 border-slate-200 opacity-90 hover:opacity-100'
                    : 'bg-white border-slate-200 hover:border-emerald-500 shadow-xs hover:shadow-md'
                }`}
              >
                {/* Card Top: Logo, Title, Badges */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-2xl shadow-inner shrink-0 group-hover:scale-105 transition-transform">
                        {job.logo}
                      </div>
                      <div>
                        <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                          {job.title}
                        </h3>
                        <p className="text-xs text-slate-500">
                          {job.company} • <span className="font-medium text-slate-700">{job.industry}</span>
                        </p>
                      </div>
                    </div>

                    {/* Match Score Badge */}
                    <div className="flex flex-col items-end shrink-0">
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold">
                        <Sparkles className="w-3 h-3 text-emerald-600" />
                        <span>{matchScore}% Match</span>
                      </div>
                      <span className="text-[10px] text-slate-400 mt-0.5">{job.postedAgo}</span>
                    </div>
                  </div>

                  {/* Compensation & Meta */}
                  <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-600">
                    <span className="font-bold text-emerald-700 flex items-center">
                      <DollarSign className="w-3.5 h-3.5" />
                      {job.salaryRange}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {job.location}
                    </span>
                    <span>•</span>
                    <span className="px-1.5 py-0.2 rounded bg-slate-100 text-[10px] font-medium text-slate-700">
                      {job.workMode}
                    </span>
                  </div>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {job.requiredSkills.slice(0, 4).map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                    {job.requiredSkills.length > 4 && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] text-slate-400">
                        +{job.requiredSkills.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Bottom: Verification Status & Call to Action */}
                <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-2">
                  
                  {job.tier === 'certified' ? (
                    isUnlocked ? (
                      <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>Verified Unlocked (Level {job.minLevelRequired}+)</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-xs text-amber-700 font-semibold">
                        <Lock className="w-3.5 h-3.5" />
                        <span className="truncate max-w-[180px]">
                          Req: {job.requiredBadges[0] || `Level ${job.minLevelRequired}`}
                        </span>
                      </div>
                    )
                  ) : (
                    <span className="text-[11px] text-slate-500">
                      Open Public Role • {job.applicantsCount} applicants
                    </span>
                  )}

                  <div className="flex items-center gap-2">
                    {isApplied ? (
                      <span className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center gap-1 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Applied
                      </span>
                    ) : job.tier === 'certified' && !isUnlocked ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (missingBadges.length > 0) {
                            onLaunchExamForBadge(missingBadges[0]);
                          }
                        }}
                        className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1"
                      >
                        <Award className="w-3 h-3" />
                        <span>Unlock Exam</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-all flex items-center gap-1 shadow-xs"
                      >
                        <span>Apply</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
