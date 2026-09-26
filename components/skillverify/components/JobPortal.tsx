import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck,
  Lock,
  CheckCircle2,
  IndianRupee,
  MapPin,
  Briefcase, 
  Sparkles, 
  Layers, 
  Award,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  PlusCircle,
  Filter,
  ChevronDown
} from 'lucide-react';
import { JobListing, JobTier, UserProfile } from '../types';
import { AnimatedTooltip } from './AnimatedTooltip';
import { soundFx } from '../utils/audio';
import { PostProjectModal } from './PostProjectModal';

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
  const [postProjectOpen, setPostProjectOpen] = useState<boolean>(false);

  const industries = ['All', 'AI / Machine Learning', 'Cloud & Infrastructure', 'FinTech', 'Cybersecurity', 'HealthTech', 'SaaS / Web Platforms', 'Creative & Marketing'];
  const workModes = ['All', 'Remote', 'Hybrid', 'On-site'];

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
    <div className="space-y-6 select-none">
      
      {/* ------------------------------------------------------------- */}
      {/* PORTAL SELECTOR TABS & BANNER */}
      {/* ------------------------------------------------------------- */}
      <div className="p-5 sm:p-7 rounded-2xl bg-[#0d1017]/95 backdrop-blur-2xl border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.6)] space-y-5">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Job Center Marketplace
              </h1>
              <AnimatedTooltip
                id="tooltip-portal-desc"
                title="Dual-Tier Architecture"
                content="Switch between open public jobs or anti-cheat verified certified roles (₹150k - ₹340k+). Verified roles offer higher salaries and skip initial technical screens!"
                badge="Platform Innovation"
                showPulse
              />
            </div>
            <p className="text-xs sm:text-sm text-slate-400">
              Personalized alerts & opportunities matched with your validated skill achievements.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-3 shrink-0">
            {/* Post a Project: opens form modal */}
            <button
              type="button"
              onClick={() => {
                soundFx.playClick();
                setPostProjectOpen(true);
              }}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold transition-all shadow-xs"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post a Project</span>
            </button>

            {/* DUAL PORTAL SWITCHER BUTTONS */}
            <div 
              id="tour-portal-toggle"
              className="flex items-center p-1 bg-[#131620] rounded-xl border border-white/10 shrink-0 shadow-inner"
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
                    ? 'bg-white/15 text-white shadow-xs font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
                <span>Public Jobs</span>
                <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
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
                    ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-extrabold shadow-[0_0_15px_rgba(52,211,153,0.35)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Certified Roles</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  selectedTier === 'certified' ? 'bg-black text-[#10b981]' : 'bg-emerald-500/20 text-emerald-400'
                }`}>
                  {certifiedCount} • ₹150k+
                </span>
              </button>
            </div>
          </div>
        </div>

        <PostProjectModal open={postProjectOpen} onClose={() => setPostProjectOpen(false)} />

        {/* Certified Tier Explanation Callout */}
        {selectedTier === 'certified' && (
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 via-[#0e1620] to-[#0d1017] border border-emerald-500/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-300">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-400">
                <Award className="w-4.5 h-4.5" />
              </div>
              <div>
                <span className="font-bold text-white block text-xs sm:text-sm">Certified High-End Portal (₹150k - ₹340k+)</span>
                <span className="text-[11px] text-slate-400">
                  Direct recruiter access & fast-track hiring for candidates holding anti-cheat verified badges.
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 text-[11px]">
              <span className="text-slate-400 font-medium">Your Badges:</span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold font-mono shadow-xs">
                {user.verifiedBadges.length} Active
              </span>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* FILTER BAR WITH DROPDOWNS & UNLOCKED TOGGLE */}
        {/* ------------------------------------------------------------- */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/[0.08]">
          
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold mr-1">
              <Filter className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Filter:</span>
            </div>

            {/* Industry Filter Dropdown */}
            <div className="relative">
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="appearance-none bg-[#131620] hover:bg-[#181c28] border border-white/10 rounded-xl px-3 py-1.5 pr-7 text-xs text-slate-200 font-medium focus:outline-none focus:border-emerald-400 transition-colors cursor-pointer"
              >
                {industries.map(ind => (
                  <option key={ind} value={ind} className="bg-[#12141c] text-white">
                    {ind === 'All' ? 'All Industries' : ind}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Work Mode Filter Dropdown */}
            <div className="relative">
              <select
                value={selectedWorkMode}
                onChange={(e) => setSelectedWorkMode(e.target.value)}
                className="appearance-none bg-[#131620] hover:bg-[#181c28] border border-white/10 rounded-xl px-3 py-1.5 pr-7 text-xs text-slate-200 font-medium focus:outline-none focus:border-emerald-400 transition-colors cursor-pointer"
              >
                {workModes.map(mode => (
                  <option key={mode} value={mode} className="bg-[#12141c] text-white">
                    {mode === 'All' ? 'All Work Modes' : mode}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-400 text-xs font-mono">
              {filteredJobs.length} {filteredJobs.length === 1 ? 'role' : 'roles'} available
            </span>

            {selectedTier === 'certified' && (
              <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-slate-300 text-xs bg-[#131620] px-3 py-1.5 rounded-xl border border-white/10">
                <input
                  type="checkbox"
                  checked={unlockedOnly}
                  onChange={(e) => setUnlockedOnly(e.target.checked)}
                  className="rounded border-white/20 text-emerald-400 accent-emerald-400 w-3.5 h-3.5"
                />
                <span>Unlocked for Me</span>
              </label>
            )}
          </div>

        </div>

      </div>

      {/* ------------------------------------------------------------- */}
      {/* JOB LISTINGS GRID */}
      {/* ------------------------------------------------------------- */}
      {filteredJobs.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#0d1017]/90 backdrop-blur-xl border border-white/[0.08] space-y-3 shadow-xl">
          <AlertCircle className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">
            No matching job listings found
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search filters, clearing industry selection, or taking certification exams to unlock roles.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedIndustry('All');
              setSelectedWorkMode('All');
              setUnlockedOnly(false);
            }}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-colors"
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
                className={`group relative p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 shadow-xl ${
                  job.tier === 'certified'
                    ? isUnlocked
                      ? 'bg-[#0d1017]/95 hover:bg-[#121622] border-emerald-500/30 hover:border-emerald-500 shadow-[0_10px_30px_rgba(0,0,0,0.5)]'
                      : 'bg-[#0b0d14]/80 border-white/[0.08] hover:border-white/20 opacity-85 hover:opacity-100'
                    : 'bg-[#0d1017]/95 hover:bg-[#121622] border-white/[0.08] hover:border-emerald-500/40 shadow-[0_10px_30px_rgba(0,0,0,0.5)]'
                }`}
              >
                {/* Card Top: Logo, Title, Badges */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-2xl shadow-inner shrink-0 group-hover:scale-105 transition-transform">
                        {job.logo}
                      </div>
                      <div>
                        <h3 className="font-bold text-sm sm:text-base text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
                          {job.title}
                        </h3>
                        <p className="text-xs text-slate-400">
                          {job.company} • <span className="font-semibold text-slate-300">{job.industry}</span>
                        </p>
                      </div>
                    </div>

                    {/* Match Score Badge */}
                    <div className="flex flex-col items-end shrink-0">
                      <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 text-[11px] font-bold">
                        <Sparkles className="w-3 h-3 text-emerald-400" />
                        <span>{matchScore}% Match</span>
                      </div>
                      <span className="text-[10px] text-slate-500 mt-0.5 font-mono">{job.postedAgo}</span>
                    </div>
                  </div>

                  {/* Compensation & Meta */}
                  <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-400">
                    <span className="font-extrabold text-emerald-400 flex items-center font-mono">
                      <IndianRupee className="w-3.5 h-3.5" />
                      {job.salaryRange}
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="flex items-center gap-1 text-slate-300">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      {job.location}
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/10 text-[10.5px] font-medium text-slate-300">
                      {job.workMode}
                    </span>
                  </div>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {job.requiredSkills.slice(0, 4).map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 rounded-lg bg-white/[0.04] border border-white/5 text-slate-300 text-[10px] font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                    {job.requiredSkills.length > 4 && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] text-slate-500">
                        +{job.requiredSkills.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Bottom: Verification Status & Call to Action */}
                <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between gap-2">
                  
                  {job.tier === 'certified' ? (
                    isUnlocked ? (
                      <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span>Verified Unlocked (Level {job.minLevelRequired}+)</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold">
                        <Lock className="w-3.5 h-3.5" />
                        <span className="truncate max-w-[180px]">
                          Req: {job.requiredBadges[0] || `Level ${job.minLevelRequired}`}
                        </span>
                      </div>
                    )
                  ) : (
                    <span className="text-[11px] text-slate-400 font-mono">
                      Open Public Role
                    </span>
                  )}

                  <div className="flex items-center gap-2">
                    {isApplied ? (
                      <span className="px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-400 text-xs font-semibold flex items-center gap-1 border border-emerald-500/25">
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
                        className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1"
                      >
                        <Award className="w-3 h-3" />
                        <span>Unlock Exam</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-extrabold text-xs transition-all flex items-center gap-1 shadow-sm active:scale-98"
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
