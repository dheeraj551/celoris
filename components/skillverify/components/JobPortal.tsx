import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Lock,
  CheckCircle2,
  MapPin,
  Briefcase,
  Award,
  ArrowUpRight,
  AlertCircle,
  PlusCircle,
  Search,
  X,
  Clock,
  SlidersHorizontal,
  Zap,
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
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('All');
  const [selectedWorkMode, setSelectedWorkMode] = useState<string>('All');
  const [unlockedOnly, setUnlockedOnly] = useState<boolean>(false);
  const [postProjectOpen, setPostProjectOpen] = useState<boolean>(false);

  // /job-center?post=1 opens the Post a Project modal directly
  useEffect(() => {
    try {
      if (new URLSearchParams(window.location.search).get('post') === '1') {
        setPostProjectOpen(true);
      }
    } catch {}
  }, []);

  // Dynamically derive industries from real jobs in the active tier
  const industries = useMemo(() => {
    const tierJobs = jobs.filter((j) => j.tier === selectedTier);
    const unique = Array.from(
      new Set(tierJobs.map((j) => j.industry).filter(Boolean))
    );
    return ['All', ...unique];
  }, [jobs, selectedTier]);

  // Reset industry filter if it doesn't exist when switching tiers
  useEffect(() => {
    if (selectedIndustry !== 'All' && !industries.includes(selectedIndustry)) {
      setSelectedIndustry('All');
    }
  }, [industries, selectedIndustry]);

  const workModes = ['All', 'Remote', 'Hybrid', 'On-site'];

  const calculateMatchScore = (job: JobListing) => {
    if (!job.requiredSkills || job.requiredSkills.length === 0) return 85;
    const matching = job.requiredSkills.filter((req) =>
      user.skills.some((us) => us.toLowerCase() === req.toLowerCase())
    );
    const score = Math.round((matching.length / job.requiredSkills.length) * 100);
    return Math.max(35, score);
  };

  const filteredJobs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return jobs.filter((job) => {
      if (job.tier !== selectedTier) return false;
      if (selectedIndustry !== 'All' && job.industry !== selectedIndustry) return false;
      if (selectedWorkMode !== 'All' && job.workMode !== selectedWorkMode) return false;

      if (q) {
        const hay = `${job.title} ${job.company} ${job.industry} ${job.description} ${(job.requiredSkills || []).join(' ')}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }

      if (unlockedOnly && job.tier === 'certified') {
        const hasLevel = user.level >= job.minLevelRequired;
        const hasBadges = job.requiredBadges.every((rb) =>
          user.verifiedBadges.some((ub) => ub.badgeTitle.toLowerCase() === rb.toLowerCase())
        );
        if (!hasLevel || !hasBadges) return false;
      }

      return true;
    });
  }, [jobs, selectedTier, selectedIndustry, selectedWorkMode, searchQuery, unlockedOnly, user]);

  const publicCount = jobs.filter((j) => j.tier === 'public').length;
  const certifiedCount = jobs.filter((j) => j.tier === 'certified').length;

  return (
    <div className="space-y-8 select-none pb-12">
      {/* ===================================================================== */}
      {/* EDITORIAL STUDIO HERO & DUAL-TIER SWITCHER                            */}
      {/* ===================================================================== */}
      <section className="relative rounded-[2rem] overflow-hidden border border-white/[0.08] bg-[#0a0c12]/90 backdrop-blur-2xl p-6 sm:p-9 shadow-[0_24px_70px_rgba(0,0,0,0.65)]">
        {/* Subtle Ambient Glow */}
        <div className="pointer-events-none absolute -top-24 right-10 w-80 h-80 rounded-full bg-emerald-500/12 blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-24 left-10 w-72 h-72 rounded-full bg-[#d9ff00]/8 blur-[100px]" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Celoris Talent Network
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-[1.08]">
                Get Certified.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d9ff00] via-emerald-300 to-teal-400">
                  Get Hired Faster.
                </span>
              </h1>
              <AnimatedTooltip
                id="tooltip-portal-desc"
                title="Dual-Tier Architecture"
                content="Switch between open public roles or anti-cheat verified certified roles. Verified badge holders skip initial screening and get direct hiring manager access."
                badge="How It Works"
                showPulse
              />
            </div>

            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed max-w-xl">
              Verified freelance, retainer, and full-time creative &amp; engineering roles—matched directly to your passed skill assessments.
            </p>
          </div>

          {/* Right Controls: Post a Project + Animated Dual-Tier Switcher */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => {
                soundFx.playClick();
                setPostProjectOpen(true);
              }}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full border border-white/15 bg-white/[0.05] hover:bg-white/[0.1] text-white text-xs font-bold transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-[#d9ff00]" />
              <span>Post a Project</span>
            </button>

            <div
              id="tour-portal-toggle"
              className="flex items-center p-1 bg-black/70 rounded-full border border-white/10 shadow-inner"
            >
              <button
                id="tab-public-jobs"
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  onSelectTier('public');
                }}
                className={`relative px-4 py-2 rounded-full text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer ${
                  selectedTier === 'public' ? 'text-black' : 'text-neutral-400 hover:text-white'
                }`}
              >
                {selectedTier === 'public' && (
                  <motion.span
                    layoutId="jobPortalTierPill"
                    transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                    className="absolute inset-0 rounded-full bg-white shadow-sm"
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Public Jobs</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                      selectedTier === 'public'
                        ? 'bg-black/10 text-black'
                        : 'bg-white/10 text-neutral-300'
                    }`}
                  >
                    {publicCount}
                  </span>
                </span>
              </button>

              <button
                id="tab-certified-jobs"
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  onSelectTier('certified');
                }}
                className={`relative px-4 py-2 rounded-full text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer ${
                  selectedTier === 'certified' ? 'text-black' : 'text-neutral-400 hover:text-white'
                }`}
              >
                {selectedTier === 'certified' && (
                  <motion.span
                    layoutId="jobPortalTierPill"
                    transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                    className="absolute inset-0 rounded-full bg-[#d9ff00] shadow-[0_0_20px_rgba(217,255,0,0.3)]"
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Certified Roles</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                      selectedTier === 'certified'
                        ? 'bg-black/15 text-black'
                        : 'bg-emerald-500/20 text-emerald-400'
                    }`}
                  >
                    {certifiedCount}
                  </span>
                </span>
              </button>
            </div>
          </div>
        </div>

        <PostProjectModal open={postProjectOpen} onClose={() => setPostProjectOpen(false)} />

        {/* Certified Portal Strip */}
        <AnimatePresence>
          {selectedTier === 'certified' && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="relative z-10 mt-6 p-4 rounded-2xl bg-gradient-to-r from-emerald-950/50 via-black/40 to-black/60 border border-emerald-500/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#d9ff00]/15 border border-[#d9ff00]/30 flex items-center justify-center shrink-0 text-[#d9ff00]">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-white block text-xs sm:text-sm">
                    Certified High-Priority Portal
                  </span>
                  <span className="text-[11px] text-neutral-400">
                    Clear a quick 10-minute skill exam to earn your verified badge and apply directly to clients.
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2.5 shrink-0">
                <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold font-mono">
                  {user.verifiedBadges.length} Active {user.verifiedBadges.length === 1 ? 'Badge' : 'Badges'}
                </span>
                <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-neutral-300 text-xs bg-white/[0.05] hover:bg-white/[0.08] px-3 py-1.5 rounded-full border border-white/10 transition-colors">
                  <input
                    type="checkbox"
                    checked={unlockedOnly}
                    onChange={(e) => setUnlockedOnly(e.target.checked)}
                    className="rounded border-white/20 accent-[#d9ff00] w-3.5 h-3.5"
                  />
                  <span>Unlocked Only</span>
                </label>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ===================================================================== */}
      {/* MODERN GLASS SEARCH + HORIZONTAL PILL FILTERS                         */}
      {/* ===================================================================== */}
      <div className="space-y-3.5">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          {/* Command Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search roles, skills (Premiere Pro, Figma, AI, PHP), or companies..."
              className="w-full pl-11 pr-9 py-2.5 rounded-full bg-white/[0.04] border border-white/10 focus:border-emerald-400/60 text-xs sm:text-sm text-white placeholder:text-neutral-500 focus:outline-none backdrop-blur-xl transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Work Mode Pills */}
          <div className="flex items-center gap-1 p-1 rounded-full bg-white/[0.04] border border-white/10 self-start md:self-auto">
            {workModes.map((mode) => {
              const active = selectedWorkMode === mode;
              return (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setSelectedWorkMode(mode)}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                    active
                      ? 'bg-white text-black font-bold shadow-xs'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {mode}
                </button>
              );
            })}
          </div>
        </div>

        {/* Industry Pills + Count */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 max-w-full">
            <span className="inline-flex items-center gap-1 text-[11px] text-neutral-500 font-semibold mr-1 shrink-0">
              <SlidersHorizontal className="w-3 h-3" />
              Category:
            </span>
            {industries.map((ind) => {
              const active = selectedIndustry === ind;
              return (
                <button
                  key={ind}
                  type="button"
                  onClick={() => setSelectedIndustry(ind)}
                  className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap border transition-all cursor-pointer ${
                    active
                      ? 'bg-emerald-500/15 border-emerald-400/50 text-emerald-300'
                      : 'bg-white/[0.03] border-white/10 text-neutral-400 hover:text-white hover:border-white/20'
                  }`}
                >
                  {ind === 'All' ? 'All Categories' : ind}
                </button>
              );
            })}
          </div>

          <span className="text-[11px] font-mono text-neutral-500 shrink-0">
            Showing <strong className="text-white">{filteredJobs.length}</strong>{' '}
            {filteredJobs.length === 1 ? 'role' : 'roles'}
          </span>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* MODERN EDITORIAL JOB CARDS GRID                                       */}
      {/* ===================================================================== */}
      {filteredJobs.length === 0 ? (
        <div className="p-14 text-center rounded-3xl bg-white/[0.02] border border-white/[0.08] space-y-3">
          <AlertCircle className="w-10 h-10 text-neutral-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No matching roles found</h3>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            Try clearing your search or category filter, or switch between Public Jobs and Certified Roles.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedIndustry('All');
              setSelectedWorkMode('All');
              setUnlockedOnly(false);
            }}
            className="px-4 py-2 rounded-full bg-white text-black text-xs font-bold cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <AnimatePresence mode="popLayout">
            {filteredJobs.map((job, idx) => {
              const matchScore = calculateMatchScore(job);
              const isApplied = user.appliedJobIds.includes(job.id);
              const userHasLevel = user.level >= job.minLevelRequired;
              const missingBadges = job.requiredBadges.filter(
                (b) => !user.verifiedBadges.some((ub) => ub.badgeTitle.toLowerCase() === b.toLowerCase())
              );
              const isUnlocked = job.tier === 'public' || (userHasLevel && missingBadges.length === 0);
              const showSeparateWorkMode =
                job.workMode &&
                job.location &&
                job.workMode.toLowerCase() !== job.location.toLowerCase();

              return (
                <motion.article
                  layout
                  key={job.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.25, delay: Math.min(idx * 0.03, 0.25) }}
                  whileHover={{ y: -4 }}
                  onClick={() => {
                    soundFx.playClick();
                    onSelectJob(job);
                  }}
                  className={`group relative rounded-3xl p-6 border transition-all duration-300 cursor-pointer flex flex-col justify-between gap-5 overflow-hidden ${
                    job.tier === 'certified'
                      ? isUnlocked
                        ? 'bg-[#0b0e14]/95 border-emerald-500/30 hover:border-emerald-400/70 shadow-[0_14px_40px_rgba(0,0,0,0.45)]'
                        : 'bg-[#0a0c11]/90 border-white/[0.09] hover:border-white/25 shadow-[0_14px_40px_rgba(0,0,0,0.45)]'
                      : 'bg-[#0b0e14]/95 border-white/[0.09] hover:border-emerald-400/50 shadow-[0_14px_40px_rgba(0,0,0,0.45)]'
                  }`}
                >
                  {/* Subtle Top Hover Highlight Line */}
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="space-y-4">
                    {/* Top Meta Row: Icon + Company + Match/Time */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-12 h-12 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-2xl shrink-0 group-hover:scale-105 group-hover:border-white/20 transition-all">
                          {job.logo}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-semibold text-neutral-300 truncate">
                              {job.company}
                            </span>
                            {job.featured && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#d9ff00]/15 text-[#d9ff00] border border-[#d9ff00]/30 text-[9.5px] font-black uppercase tracking-wider shrink-0">
                                <Zap className="w-2.5 h-2.5 fill-current" />
                                Featured
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-neutral-500 mt-0.5">
                            <span>{job.industry}</span>
                            <span>•</span>
                            <span className="inline-flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {job.postedAgo}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[10.5px] font-bold shrink-0">
                        {matchScore}% Match
                      </div>
                    </div>

                    {/* Role Title & Concise Excerpt */}
                    <div className="space-y-1.5">
                      <h3 className="text-base sm:text-lg font-extrabold text-white leading-snug group-hover:text-emerald-300 transition-colors">
                        {job.title}
                      </h3>
                      {job.description && (
                        <p className="text-xs text-neutral-400 leading-relaxed line-clamp-2">
                          {job.description}
                        </p>
                      )}
                    </div>

                    {/* Compensation & Location Strip */}
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-bold font-mono text-[11.5px]">
                        {job.salaryRange}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/[0.04] border border-white/10 text-neutral-300 text-[11px] font-medium">
                        <MapPin className="w-3 h-3 text-neutral-400" />
                        {job.location}
                      </span>
                      {showSeparateWorkMode && (
                        <span className="px-2.5 py-1 rounded-xl bg-white/[0.04] border border-white/10 text-neutral-300 text-[11px] font-medium">
                          {job.workMode}
                        </span>
                      )}
                    </div>

                    {/* Clean Skill Pills (Max 3 + counter) */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      {job.requiredSkills.slice(0, 3).map((skill) => (
                        <span
                          key={skill}
                          className="px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.07] text-neutral-300 text-[11px] font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                      {job.requiredSkills.length > 3 && (
                        <span className="px-2 py-1 text-[11px] text-neutral-500 font-medium">
                          +{job.requiredSkills.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Footer: Verification Badge + Action CTA */}
                  <div className="pt-4 border-t border-white/[0.07] flex items-center justify-between gap-3">
                    {job.tier === 'certified' ? (
                      isUnlocked ? (
                        <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold min-w-0">
                          <ShieldCheck className="w-4 h-4 shrink-0" />
                          <span className="truncate">Verified Unlocked</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-xs text-amber-300/90 font-medium min-w-0">
                          <Lock className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">
                            Exam: {job.requiredBadges[0] || `Level ${job.minLevelRequired}`}
                          </span>
                        </div>
                      )
                    ) : (
                      <span className="text-[11px] text-neutral-400 font-medium">
                        Open Public Role
                      </span>
                    )}

                    <div className="shrink-0">
                      {isApplied ? (
                        <span className="px-3.5 py-2 rounded-full bg-emerald-500/15 text-emerald-300 text-xs font-bold inline-flex items-center gap-1.5 border border-emerald-500/30">
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
                          className="px-4 py-2 rounded-full bg-[#d9ff00] hover:bg-[#c8eb00] text-black text-xs font-black transition-all inline-flex items-center gap-1.5 shadow-[0_0_20px_rgba(217,255,0,0.2)] cursor-pointer"
                        >
                          <Award className="w-3.5 h-3.5" />
                          <span>Unlock Exam</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="px-4 py-2 rounded-full bg-white hover:bg-[#d9ff00] text-black font-black text-xs transition-all inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>Apply Now</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};
