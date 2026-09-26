/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  MapPin, CheckCircle2, Award, Briefcase,
  GraduationCap, Globe, Linkedin, Twitter, Youtube, Loader2, UserRound,
  Copy, ShieldCheck, Zap, ChevronLeft,
} from 'lucide-react';
import { createClient } from '@/lib/supabase-client';
import { formatDistanceToNow } from 'date-fns';
import { UserTierLevel } from '../types';
import { LEVEL_TIERS } from '../data/mockData';

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

interface ExperienceEntry {
  id: string;
  title: string;
  organization: string;
  duration: string;
  description: string;
}

interface EducationEntry {
  id: string;
  degree: string;
  institution: string;
  year: string;
}

interface ProfileBadge {
  id: string;
  badgeTitle: string;
  skillName: string;
  industry: string;
  verificationHash: string;
  earnedDate: string;
  score: number;
  proctorScore: number;
  badgeColor: string;
}

interface CandidateData {
  full_name: string;
  avatar_url: string | null;
  headline: string;
  bio: string;
  specialty: string;
  experience_years: string;
  location: string;
  website: string;
  linkedin: string;
  twitter: string;
  youtube: string;
  skills: string[];
  languages: string[];
  experience: ExperienceEntry[];
  education: EducationEntry[];
  /** Human-readable URL slug (e.g. "prabha-singh-f93e9a8f"), used to build
      the public profile link and QR code instead of the raw candidate id. */
  slug: string;
}

interface ProgressData {
  level: UserTierLevel;
  currentXP: number;
  nextLevelXP: number;
  honorScore: number;
}

export function CandidateProfile({ id: routeParam }: { id: string }) {
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);
  const [candidate, setCandidate] = useState<CandidateData | null>(null);
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [badges, setBadges] = useState<ProfileBadge[]>([]);
  const [hireStatus, setHireStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  // The actual candidate id, resolved from the URL slug below. Kept separate
  // from `routeParam` because the URL segment is a human-readable slug (e.g.
  // "prabha-singh-f93e9a8f"), not the underlying uuid — everything that
  // needs the real id (data fetches, the hire-request API call) uses this.
  const [resolvedId, setResolvedId] = useState<string | null>(null);

  useEffect(() => {
    if (!routeParam) return;
    const supabase = createClient();

    (async () => {
      setLoading(true);

      // Resolve the slug to a candidate id. Older shared links/QR codes may
      // still carry the raw uuid instead of a slug — fall back to treating
      // the param as an id so those keep working.
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(routeParam);
      const { data: slugRow } = await supabase
        .from('job_center_candidate_profiles')
        .select('id')
        .eq('slug', routeParam)
        .maybeSingle();
      const candidateId: string | null = slugRow?.id || (isUuid ? routeParam : null);

      if (!candidateId) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      setResolvedId(candidateId);

      const [{ data: userRow }, { data: profileRow }, { data: candidateRow }, { data: progressRow }, { data: badgeRows }] = await Promise.all([
        supabase.from('users').select('*').eq('id', candidateId).maybeSingle(),
        supabase.from('profiles').select('*').eq('id', candidateId).maybeSingle(),
        supabase.from('job_center_candidate_profiles').select('*').eq('id', candidateId).maybeSingle(),
        supabase.from('job_center_progress').select('*').eq('id', candidateId).maybeSingle(),
        supabase.from('job_center_badges').select('*').eq('user_id', candidateId).order('earned_date', { ascending: false }),
      ]);

      if (!candidateRow || candidateRow.is_public === false) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      const merged = { ...userRow, ...profileRow };
      let avatarUrl: string | null = merged.profile_pic_url || merged.avatar_url || null;
      if (avatarUrl && !avatarUrl.startsWith('http')) {
        const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(avatarUrl);
        avatarUrl = publicUrlData.publicUrl;
      }

      setCandidate({
        full_name: merged.full_name || 'Celoris Candidate',
        avatar_url: avatarUrl,
        headline: candidateRow.headline || '',
        bio: candidateRow.bio || '',
        specialty: candidateRow.specialty || '',
        experience_years: candidateRow.experience_years || '',
        location: candidateRow.location || '',
        website: candidateRow.website || '',
        linkedin: candidateRow.linkedin || '',
        twitter: candidateRow.twitter || '',
        youtube: candidateRow.youtube || '',
        skills: candidateRow.skills || [],
        languages: candidateRow.languages || [],
        experience: Array.isArray(candidateRow.experience) ? candidateRow.experience : [],
        education: Array.isArray(candidateRow.education) ? candidateRow.education : [],
        slug: candidateRow.slug || '',
      });

      const currentXP = progressRow?.current_xp ?? 0;
      let level: UserTierLevel = 1;
      (Object.keys(LEVEL_TIERS) as unknown as UserTierLevel[]).forEach((lvl) => {
        const l = Number(lvl) as UserTierLevel;
        if (currentXP >= LEVEL_TIERS[l].minXP) level = l;
      });
      setProgress({
        level,
        currentXP,
        nextLevelXP: LEVEL_TIERS[level].maxXP,
        honorScore: progressRow?.honor_score ?? 100,
      });

      setBadges((badgeRows || []).map((row: any) => ({
        id: row.id,
        badgeTitle: row.badge_title,
        skillName: row.skill_name || '',
        industry: row.industry || '',
        verificationHash: row.verification_hash || '',
        earnedDate: row.earned_date ? formatDistanceToNow(new Date(row.earned_date), { addSuffix: true }) : 'recently',
        score: row.score ?? 0,
        proctorScore: row.proctor_score ?? 0,
        badgeColor: row.badge_color || '#10B981',
      })));

      setLoading(false);
    })();
  }, [routeParam]);

  const handleCopyLink = () => {
    // Always share the canonical slug link, even if this visitor arrived via
    // an older raw-id URL.
    navigator.clipboard.writeText(pageUrl || window.location.href.split('?')[0]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleHireClick = async () => {
    if (!resolvedId || hireStatus === 'sending' || hireStatus === 'sent') return;
    setHireStatus('sending');
    try {
      const res = await fetch('/api/job-center/hire-candidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidateId: resolvedId }),
      });
      if (!res.ok) throw new Error('Request failed');
      setHireStatus('sent');
    } catch (err) {
      console.error('Error sending hire request:', err);
      setHireStatus('error');
      setTimeout(() => setHireStatus('idle'), 3000);
    }
  };

  // Prefer the human-readable slug for the shareable link/QR code; fall
  // back to the raw id for a candidate whose slug hasn't been backfilled.
  const shareSlug = candidate?.slug || resolvedId || '';
  const pageUrl = typeof window !== 'undefined' && shareSlug ? `${window.location.origin}/job-center/candidates/${shareSlug}` : '';
  const qrCodeUrl = pageUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=8&data=${encodeURIComponent(pageUrl)}`
    : '';
  const candidateIdCode = resolvedId ? resolvedId.replace(/-/g, '').slice(0, 8).toUpperCase() : '';

  if (loading) {
    return (
      <div className="bg-[#07080c] min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
      </div>
    );
  }

  if (notFound || !candidate) {
    return (
      <div className="bg-[#07080c] min-h-screen flex flex-col items-center justify-center text-center px-6">
        <div className="w-14 h-14 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-slate-500 mb-4">
          <UserRound className="h-8 w-8 text-slate-400" />
        </div>
        <h1 className="text-xl font-bold text-white mb-2">This profile isn't public</h1>
        <p className="text-slate-400 text-sm max-w-sm mb-6">
          Either this candidate hasn't published a profile yet, or they've kept it private.
        </p>
        <Link
          href="/job-center"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white text-xs font-semibold border border-white/10 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-emerald-400" />
          <span>Return to Job Center</span>
        </Link>
      </div>
    );
  }

  const hasSocials = candidate.website || candidate.linkedin || candidate.twitter || candidate.youtube;
  const currentTierInfo = progress ? LEVEL_TIERS[progress.level] : LEVEL_TIERS[1];
  const nextLevel = progress ? ((progress.level < 5 ? progress.level + 1 : 5) as UserTierLevel) : 2;
  const nextTierInfo = LEVEL_TIERS[nextLevel];
  const progressPercent = progress
    ? Math.min(100, Math.max(0, Math.round(((progress.currentXP - currentTierInfo.minXP) / (progress.nextLevelXP - currentTierInfo.minXP)) * 100)))
    : 0;

  return (
    <div className="bg-[#07080c] min-h-screen text-slate-200 pb-20">
      {/* Top Navbar with Celoris Logo and Back Button */}
      <header className="sticky top-0 z-40 bg-[#07080c]/85 backdrop-blur-xl border-b border-white/[0.08] px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-5">
            {/* Exit / Back Button */}
            <Link
              href="/job-center"
              className="group flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-all shadow-xs"
              title="Back to Job Center"
            >
              <ChevronLeft className="w-4 h-4 text-emerald-400 transition-transform group-hover:-translate-x-0.5" />
              <span>Back to Job Center</span>
            </Link>

            <div className="h-5 w-px bg-white/10 hidden sm:block" />

            {/* Official Celoris Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <img
                src="/celoris-logo.png"
                alt="Celoris"
                className="h-7 w-auto object-contain filter drop-shadow-[0_0_12px_rgba(16,185,129,0.25)] transition-transform group-hover:scale-105"
              />
            </Link>

            <div className="hidden md:flex items-center gap-2 pl-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-semibold text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Verified Talent Dossier
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-all"
            >
              <Copy size={13} className="text-emerald-400" />
              <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Profile Header */}
      <div className="bg-[#0d1017] border-b border-white/[0.08] pt-10 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.5, ease: 'easeOut' as const }}
            className="flex flex-col md:flex-row gap-8 items-start"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' as const }}
              className="w-32 h-32 md:w-40 md:h-40 flex-shrink-0 relative"
            >
              {candidate.avatar_url ? (
                <img
                  src={candidate.avatar_url}
                  alt={candidate.full_name}
                  className="w-full h-full object-cover rounded-2xl shadow-xl border border-white/10 ring-4 ring-emerald-500/20"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full rounded-2xl bg-[#131622] border border-white/10 flex items-center justify-center shadow-xl ring-4 ring-emerald-500/20">
                  <UserRound className="h-14 w-14 text-emerald-400" />
                </div>
              )}
              <div className="absolute -bottom-3 -right-3 bg-emerald-500 text-black p-2 rounded-full border-4 border-[#0d1017] shadow-lg shadow-emerald-500/30" title="Verified Profile">
                <CheckCircle2 className="h-6 w-6" />
              </div>
            </motion.div>

            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2 tracking-tight">{candidate.full_name}</h1>
                  {candidate.headline && <p className="text-lg md:text-xl text-emerald-400 font-semibold">{candidate.headline}</p>}
                </div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.15, ease: 'easeOut' as const }}
                  className="flex items-center gap-4 bg-[#131622] border border-white/[0.08] rounded-2xl px-5 py-4 shadow-xl"
                >
                  <img src="/celoris-logo.png" alt="Celoris" className="h-7 w-auto flex-shrink-0" />
                  <div className="h-10 w-px bg-white/10 flex-shrink-0" />
                  {qrCodeUrl && (
                    <img
                      src={qrCodeUrl}
                      alt="Scan to view this candidate's profile"
                      className="h-20 w-20 rounded-lg border border-white/20 shadow-sm bg-white p-1 flex-shrink-0"
                    />
                  )}
                  <div className="text-left">
                    <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Verified Candidate ID</p>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">Scan to view dossier</p>
                    {candidateIdCode && (
                      <p className="text-[10px] text-slate-500 font-mono mt-1 tracking-wider">#{candidateIdCode}</p>
                    )}
                  </div>
                </motion.div>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-slate-400 mb-6 text-sm">
                {candidate.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-emerald-400" /> {candidate.location}
                  </div>
                )}
                {candidate.experience_years && (
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-emerald-400" /> {candidate.experience_years} Experience
                  </div>
                )}
              </div>

              {candidate.specialty && (
                <div className="flex flex-wrap gap-2">
                  {candidate.specialty.split(',').map((tag) => tag.trim()).filter(Boolean).map((tag) => (
                    <span key={tag} className="bg-white/[0.05] border border-white/[0.08] text-slate-300 px-3 py-1 rounded-full text-xs font-semibold">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 flex flex-col lg:flex-row lg:items-start gap-8">
        {/* Main Content */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={staggerContainer}
          className="flex-1 min-w-0 space-y-6"
        >
          {/* Verified Progression & Badges */}
          <motion.div variants={fadeInUp} className="bg-[#0d1017] p-8 rounded-2xl border border-white/[0.08] shadow-xl space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <ShieldCheck className="h-6 w-6 text-emerald-400" /> Verified Progression
                </h2>
                <p className="text-sm text-slate-400 mt-1 max-w-lg">{currentTierInfo.desc}</p>
              </div>
              <span className="px-4 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold text-sm whitespace-nowrap">
                Level {progress?.level ?? 1}: {currentTierInfo.name}
              </span>
            </div>

            {/* XP Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                <span>{progress?.currentXP ?? 0} / {progress?.nextLevelXP ?? currentTierInfo.maxXP} XP</span>
                <span>{progressPercent}% to Level {nextLevel} ({nextTierInfo.name})</span>
              </div>
              <div className="w-full h-2.5 bg-white/[0.06] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${progressPercent}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: 'easeOut' as const, delay: 0.2 }}
                  className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.4)]"
                />
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-[#131622] border border-white/[0.08] text-center">
                <span className="text-[11px] text-slate-400 font-medium block">Total XP</span>
                <span className="text-xl font-extrabold text-emerald-400">{progress?.currentXP ?? 0}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#131622] border border-white/[0.08] text-center">
                <span className="text-[11px] text-slate-400 font-medium block">Honor Integrity</span>
                <span className="text-xl font-extrabold text-emerald-400">{progress?.honorScore ?? 100}%</span>
              </div>
            </div>

            {/* Verified Badges */}
            {badges.length > 0 ? (
              <div className="pt-4 border-t border-white/[0.08] space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Award className="h-4 w-4 text-emerald-400" />
                  Verified Badges ({badges.length})
                </h3>
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                  {badges.map((badge) => (
                    <motion.div
                      key={badge.id}
                      variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } } }}
                      className="p-4 rounded-xl bg-[#131622] border border-white/[0.08] space-y-2.5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-9 h-9 rounded-lg flex items-center justify-center text-white shadow-xs shrink-0"
                            style={{ backgroundColor: badge.badgeColor }}
                          >
                            <ShieldCheck className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-white">{badge.badgeTitle}</h4>
                            <p className="text-xs text-slate-400">{badge.industry} • Earned {badge.earnedDate}</p>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold shrink-0">
                          Score: {badge.score}%
                        </span>
                      </div>
                      <div className="p-2 rounded-lg bg-[#0d1017] border border-white/[0.08] text-xs font-mono flex items-center gap-1.5 text-slate-300">
                        <span className="text-[10px] text-slate-500">VERIFY ID:</span>
                        <span className="font-bold text-emerald-400">{badge.verificationHash}</span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Proctor Integrity: <strong className="text-emerald-400">{badge.proctorScore}%</strong>
                      </p>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            ) : (
              <div className="pt-4 border-t border-white/[0.08]">
                <p className="text-xs text-slate-500 flex items-center gap-2">
                  <Zap className="h-3.5 w-3.5" /> No verified badges yet — this candidate hasn't completed a proctored exam.
                </p>
              </div>
            )}
          </motion.div>

          {/* About Section */}
          {candidate.bio && (
            <motion.div variants={fadeInUp} className="bg-[#0d1017] p-8 rounded-2xl border border-white/[0.08] shadow-xl">
              <h2 className="text-2xl font-bold text-white mb-4">About {candidate.full_name.split(' ')[0]}</h2>
              <div className="prose prose-invert max-w-none text-slate-300 whitespace-pre-line leading-relaxed">{candidate.bio}</div>
            </motion.div>
          )}

          {/* Skills */}
          {candidate.skills.length > 0 && (
            <motion.div variants={fadeInUp} className="bg-[#0d1017] p-8 rounded-2xl border border-white/[0.08] shadow-xl">
              <h2 className="text-2xl font-bold text-white mb-6">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {candidate.skills.map((skill) => (
                  <span key={skill} className="bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 px-3.5 py-1.5 rounded-full text-xs font-bold">
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          {/* Work Experience */}
          {candidate.experience.length > 0 && (
            <motion.div variants={fadeInUp} className="bg-[#0d1017] p-8 rounded-2xl border border-white/[0.08] shadow-xl">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Briefcase className="h-6 w-6 text-emerald-400" /> Work Experience
              </h2>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
                className="space-y-6"
              >
                {candidate.experience.map((entry, idx) => (
                  <motion.div
                    key={entry.id || idx}
                    variants={{ hidden: { opacity: 0, x: -16 }, visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: 'easeOut' as const } } }}
                    className="border-l-2 border-emerald-500/30 pl-6 relative"
                  >
                    <div className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                    <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
                      <h3 className="font-bold text-white">{entry.title}</h3>
                      <span className="text-xs text-slate-400 font-medium">{entry.duration}</span>
                    </div>
                    {entry.organization && <p className="text-sm text-emerald-400 font-medium mb-2">{entry.organization}</p>}
                    {entry.description && <p className="text-sm text-slate-300 leading-relaxed">{entry.description}</p>}
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* Education */}
          {candidate.education.length > 0 && (
            <motion.div variants={fadeInUp} className="bg-[#0d1017] p-8 rounded-2xl border border-white/[0.08] shadow-xl">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <GraduationCap className="h-6 w-6 text-emerald-400" /> Education
              </h2>
              <div className="space-y-4">
                {candidate.education.map((entry, idx) => (
                  <div key={entry.id || idx} className="flex items-baseline justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-white">{entry.degree}</h3>
                      {entry.institution && <p className="text-sm text-slate-400">{entry.institution}</p>}
                    </div>
                    <span className="text-xs text-slate-400 font-medium flex-shrink-0">{entry.year}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {!candidate.bio && candidate.skills.length === 0 && candidate.experience.length === 0 && candidate.education.length === 0 && (
            <motion.div variants={fadeInUp} className="bg-[#0d1017] p-12 rounded-2xl border border-white/[0.08] shadow-xl text-center text-slate-500">
              <ShieldCheck className="h-10 w-10 mx-auto mb-3 text-slate-600" />
              <p className="font-medium">This candidate hasn't filled out their profile yet.</p>
            </motion.div>
          )}
        </motion.div>

        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: 'easeOut' as const, delay: 0.1 }}
          className="w-full lg:w-80 flex-shrink-0"
        >
          <div className="lg:sticky lg:top-20 bg-[#0d1017] rounded-2xl border border-white/[0.08] shadow-2xl divide-y divide-white/[0.08] overflow-hidden">
            <div className="p-6 space-y-3">
              <button
                onClick={handleHireClick}
                disabled={hireStatus === 'sending' || hireStatus === 'sent'}
                className={`w-full py-3.5 rounded-xl font-extrabold text-sm tracking-wide transition-all shadow-lg ${
                  hireStatus === 'sent'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 cursor-default'
                    : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black shadow-emerald-500/25 hover:scale-[1.02] disabled:opacity-60'
                }`}
              >
                {hireStatus === 'sending' ? 'Sending...' : hireStatus === 'sent' ? 'Request Sent ✓' : hireStatus === 'error' ? 'Failed — Try Again' : 'HIRE ME'}
              </button>
            </div>

            {candidate.languages.length > 0 && (
              <div className="p-6">
                <h3 className="font-bold text-white text-sm mb-3">Languages</h3>
                <div className="flex flex-wrap gap-2">
                  {candidate.languages.map((lang) => (
                    <span key={lang} className="bg-white/[0.05] border border-white/10 text-slate-300 px-3 py-1 rounded-full text-xs font-semibold">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {hasSocials && (
              <div className="p-6 space-y-3">
                <h3 className="font-bold text-white text-sm mb-2">Connect</h3>
                {candidate.website && (
                  <a href={candidate.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-slate-400 hover:text-emerald-400 transition-colors">
                    <Globe className="h-4 w-4 text-emerald-400 flex-shrink-0" /> <span className="truncate">Website</span>
                  </a>
                )}
                {candidate.linkedin && (
                  <a href={candidate.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-slate-400 hover:text-emerald-400 transition-colors">
                    <Linkedin className="h-4 w-4 text-emerald-400 flex-shrink-0" /> <span className="truncate">LinkedIn</span>
                  </a>
                )}
                {candidate.twitter && (
                  <a href={candidate.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-slate-400 hover:text-emerald-400 transition-colors">
                    <Twitter className="h-4 w-4 text-emerald-400 flex-shrink-0" /> <span className="truncate">Twitter</span>
                  </a>
                )}
                {candidate.youtube && (
                  <a href={candidate.youtube} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-slate-400 hover:text-emerald-400 transition-colors">
                    <Youtube className="h-4 w-4 text-emerald-400 flex-shrink-0" /> <span className="truncate">Portfolio Reel</span>
                  </a>
                )}
              </div>
            )}

          </div>
        </motion.div>
      </div>
    </div>
  );
}
