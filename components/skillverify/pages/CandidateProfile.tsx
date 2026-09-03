/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin, CheckCircle2, Award, Briefcase,
  GraduationCap, Globe, Linkedin, Twitter, Youtube, Loader2, UserRound,
  Copy, ShieldCheck, Zap,
} from 'lucide-react';
import { createClient } from '@/lib/supabase-client';
import { formatDistanceToNow } from 'date-fns';
import { UserTierLevel } from '../types';
import { LEVEL_TIERS } from '../data/mockData';

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
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
}

interface ProgressData {
  level: UserTierLevel;
  currentXP: number;
  nextLevelXP: number;
  honorScore: number;
}

export function CandidateProfile({ id }: { id: string }) {
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);
  const [candidate, setCandidate] = useState<CandidateData | null>(null);
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [badges, setBadges] = useState<ProfileBadge[]>([]);

  useEffect(() => {
    if (!id) return;
    const supabase = createClient();

    (async () => {
      setLoading(true);

      const [{ data: userRow }, { data: profileRow }, { data: candidateRow }, { data: progressRow }, { data: badgeRows }] = await Promise.all([
        supabase.from('users').select('*').eq('id', id).maybeSingle(),
        supabase.from('profiles').select('*').eq('id', id).maybeSingle(),
        supabase.from('job_center_candidate_profiles').select('*').eq('id', id).maybeSingle(),
        supabase.from('job_center_progress').select('*').eq('id', id).maybeSingle(),
        supabase.from('job_center_badges').select('*').eq('user_id', id).order('earned_date', { ascending: false }),
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
  }, [id]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href.split('?')[0]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const pageUrl = typeof window !== 'undefined' && id ? `${window.location.origin}/job-center/candidates/${id}` : '';
  const qrCodeUrl = pageUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=8&data=${encodeURIComponent(pageUrl)}`
    : '';
  const candidateIdCode = id ? id.replace(/-/g, '').slice(0, 8).toUpperCase() : '';

  if (loading) {
    return (
      <div className="bg-slate-50 min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (notFound || !candidate) {
    return (
      <div className="bg-slate-50 min-h-screen flex flex-col items-center justify-center text-center px-6">
        <UserRound className="h-14 w-14 text-slate-300 mb-4" />
        <h1 className="text-xl font-bold text-slate-900 mb-2">This profile isn't public</h1>
        <p className="text-slate-500 text-sm max-w-sm">
          Either this candidate hasn't published a profile yet, or they've kept it private.
        </p>
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
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Share Toolbar */}
      <div className="bg-white border-b border-slate-100 py-3">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-end gap-2">
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-600 transition-all"
          >
            <Copy size={14} /> {copied ? 'Link Copied!' : 'Copy Link'}
          </button>
        </div>
      </div>

      {/* Profile Header */}
      <div className="bg-white border-b border-slate-200 pt-10 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="flex flex-col md:flex-row gap-8 items-start"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
              className="w-32 h-32 md:w-40 md:h-40 flex-shrink-0 relative"
            >
              {candidate.avatar_url ? (
                <img
                  src={candidate.avatar_url}
                  alt={candidate.full_name}
                  className="w-full h-full object-cover rounded-2xl shadow-md"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full rounded-2xl bg-emerald-100 flex items-center justify-center shadow-md">
                  <UserRound className="h-14 w-14 text-emerald-500" />
                </div>
              )}
              <div className="absolute -bottom-3 -right-3 bg-emerald-100 text-emerald-700 p-2 rounded-full border-4 border-white" title="Verified Profile">
                <CheckCircle2 className="h-6 w-6" />
              </div>
            </motion.div>

            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">{candidate.full_name}</h1>
                  {candidate.headline && <p className="text-xl text-emerald-600 font-medium">{candidate.headline}</p>}
                </div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.15, ease: 'easeOut' }}
                  className="flex items-center gap-4 bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 rounded-2xl px-5 py-4 shadow-sm"
                >
                  <img src="/celoris-logo.png" alt="Celoris" className="h-7 w-auto flex-shrink-0" />
                  <div className="h-10 w-px bg-emerald-100 flex-shrink-0" />
                  {qrCodeUrl && (
                    <img
                      src={qrCodeUrl}
                      alt="Scan to view this candidate's profile"
                      className="h-20 w-20 rounded-lg border border-white shadow-sm bg-white p-1 flex-shrink-0"
                    />
                  )}
                  <div className="text-left">
                    <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Verified Candidate ID</p>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">Scan to view this profile</p>
                    {candidateIdCode && (
                      <p className="text-[10px] text-slate-400 font-mono mt-1 tracking-wider">#{candidateIdCode}</p>
                    )}
                  </div>
                </motion.div>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-slate-600 mb-6">
                {candidate.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-slate-400" /> {candidate.location}
                  </div>
                )}
                {candidate.experience_years && (
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-slate-400" /> {candidate.experience_years} Experience
                  </div>
                )}
              </div>

              {candidate.specialty && (
                <div className="flex flex-wrap gap-2">
                  {candidate.specialty.split(',').map((tag) => tag.trim()).filter(Boolean).map((tag) => (
                    <span key={tag} className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm font-medium">
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
          <motion.div variants={fadeInUp} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                  <ShieldCheck className="h-6 w-6 text-emerald-600" /> Verified Progression
                </h2>
                <p className="text-sm text-slate-500 mt-1 max-w-lg">{currentTierInfo.desc}</p>
              </div>
              <span className="px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-sm whitespace-nowrap">
                Level {progress?.level ?? 1}: {currentTierInfo.name}
              </span>
            </div>

            {/* XP Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                <span>{progress?.currentXP ?? 0} / {progress?.nextLevelXP ?? currentTierInfo.maxXP} XP</span>
                <span>{progressPercent}% to Level {nextLevel} ({nextTierInfo.name})</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${progressPercent}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                  className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 rounded-full"
                />
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-[11px] text-slate-500 font-medium block">Total XP</span>
                <span className="text-lg font-extrabold text-emerald-700">{progress?.currentXP ?? 0}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-[11px] text-slate-500 font-medium block">Honor Integrity</span>
                <span className="text-lg font-extrabold text-emerald-700">{progress?.honorScore ?? 100}%</span>
              </div>
            </div>

            {/* Verified Badges */}
            {badges.length > 0 ? (
              <div className="pt-4 border-t border-slate-100 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Award className="h-4 w-4 text-emerald-600" />
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
                      variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } } }}
                      className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5"
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
                            <h4 className="font-bold text-sm text-slate-900">{badge.badgeTitle}</h4>
                            <p className="text-xs text-slate-500">{badge.industry} • Earned {badge.earnedDate}</p>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold shrink-0">
                          Score: {badge.score}%
                        </span>
                      </div>
                      <div className="p-2 rounded-lg bg-white border border-slate-200 text-xs font-mono flex items-center gap-1.5 text-slate-700">
                        <span className="text-[10px] text-slate-400">VERIFY ID:</span>
                        <span className="font-bold text-emerald-700">{badge.verificationHash}</span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Proctor Integrity: <strong className="text-emerald-700">{badge.proctorScore}%</strong>
                      </p>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            ) : (
              <div className="pt-4 border-t border-slate-100">
                <p className="text-xs text-slate-400 flex items-center gap-2">
                  <Zap className="h-3.5 w-3.5" /> No verified badges yet — this candidate hasn't completed a proctored exam.
                </p>
              </div>
            )}
          </motion.div>

          {/* About Section */}
          {candidate.bio && (
            <motion.div variants={fadeInUp} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">About {candidate.full_name.split(' ')[0]}</h2>
              <div className="prose max-w-none text-slate-600 whitespace-pre-line">{candidate.bio}</div>
            </motion.div>
          )}

          {/* Skills */}
          {candidate.skills.length > 0 && (
            <motion.div variants={fadeInUp} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {candidate.skills.map((skill) => (
                  <span key={skill} className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-full text-sm font-bold">
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          {/* Work Experience */}
          {candidate.experience.length > 0 && (
            <motion.div variants={fadeInUp} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <Briefcase className="h-6 w-6 text-emerald-600" /> Work Experience
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
                    variants={{ hidden: { opacity: 0, x: -16 }, visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: 'easeOut' } } }}
                    className="border-l-2 border-emerald-100 pl-6 relative"
                  >
                    <div className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-emerald-500" />
                    <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
                      <h3 className="font-bold text-slate-900">{entry.title}</h3>
                      <span className="text-xs text-slate-400 font-medium">{entry.duration}</span>
                    </div>
                    {entry.organization && <p className="text-sm text-emerald-600 font-medium mb-2">{entry.organization}</p>}
                    {entry.description && <p className="text-sm text-slate-600 leading-relaxed">{entry.description}</p>}
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* Education */}
          {candidate.education.length > 0 && (
            <motion.div variants={fadeInUp} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <GraduationCap className="h-6 w-6 text-emerald-600" /> Education
              </h2>
              <div className="space-y-4">
                {candidate.education.map((entry, idx) => (
                  <div key={entry.id || idx} className="flex items-baseline justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-slate-900">{entry.degree}</h3>
                      {entry.institution && <p className="text-sm text-slate-500">{entry.institution}</p>}
                    </div>
                    <span className="text-xs text-slate-400 font-medium flex-shrink-0">{entry.year}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {!candidate.bio && candidate.skills.length === 0 && candidate.experience.length === 0 && candidate.education.length === 0 && (
            <motion.div variants={fadeInUp} className="bg-white p-12 rounded-2xl border border-slate-200 shadow-sm text-center text-slate-400">
              <ShieldCheck className="h-10 w-10 mx-auto mb-3 text-slate-200" />
              <p className="font-medium">This candidate hasn't filled out their profile yet.</p>
            </motion.div>
          )}
        </motion.div>

        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
          className="w-full lg:w-80 flex-shrink-0"
        >
          <div className="lg:sticky lg:top-6 bg-white rounded-2xl border border-slate-200 shadow-lg divide-y divide-slate-100 overflow-hidden">
            <div className="p-6 space-y-3">
              <button className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors">
                Contact Candidate
              </button>
            </div>

            {candidate.languages.length > 0 && (
              <div className="p-6">
                <h3 className="font-bold text-slate-900 text-sm mb-3">Languages</h3>
                <div className="flex flex-wrap gap-2">
                  {candidate.languages.map((lang) => (
                    <span key={lang} className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-bold">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {hasSocials && (
              <div className="p-6 space-y-3">
                <h3 className="font-bold text-slate-900 text-sm mb-1">Connect</h3>
                {candidate.website && (
                  <a href={candidate.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-slate-600 hover:text-emerald-600">
                    <Globe className="h-4 w-4 text-emerald-500 flex-shrink-0" /> <span className="truncate">Website</span>
                  </a>
                )}
                {candidate.linkedin && (
                  <a href={candidate.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-slate-600 hover:text-emerald-600">
                    <Linkedin className="h-4 w-4 text-emerald-500 flex-shrink-0" /> <span className="truncate">LinkedIn</span>
                  </a>
                )}
                {candidate.twitter && (
                  <a href={candidate.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-slate-600 hover:text-emerald-600">
                    <Twitter className="h-4 w-4 text-emerald-500 flex-shrink-0" /> <span className="truncate">Twitter</span>
                  </a>
                )}
                {candidate.youtube && (
                  <a href={candidate.youtube} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-slate-600 hover:text-emerald-600">
                    <Youtube className="h-4 w-4 text-emerald-500 flex-shrink-0" /> <span className="truncate">Portfolio Reel</span>
                  </a>
                )}
              </div>
            )}

            {!hasSocials && candidate.languages.length === 0 && (
              <div className="p-6">
                <p className="text-xs text-slate-400 leading-relaxed">
                  This candidate hasn't added languages or social links yet.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
