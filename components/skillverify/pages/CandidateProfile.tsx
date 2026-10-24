/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, CheckCircle2, Award, Briefcase,
  GraduationCap, Globe, Linkedin, Twitter, Youtube, Loader2, UserRound,
  Copy, ShieldCheck, Zap, ChevronLeft, Film, Instagram,
  DollarSign, Clock, MessageSquare, ExternalLink, X, Send, Play
} from 'lucide-react';
import { createClient } from '@/lib/supabase-client';
import { formatDistanceToNow } from 'date-fns';
import { UserTierLevel } from '../types';
import { LEVEL_TIERS } from '../data/mockData';
import { CreatorData, CreatorService } from '../components/CandidateProfileEditor';

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
  slug: string;
  creator_data?: CreatorData;
}

interface ProgressData {
  level: UserTierLevel;
  currentXP: number;
  nextLevelXP: number;
  honorScore: number;
}

function getEmbedUrl(url: string | undefined): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  const ytMatch = trimmed.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (ytMatch) {
    return `https://www.youtube.com/embed/${ytMatch[1]}?rel=0&modestbranding=1`;
  }
  const vimeoMatch = trimmed.match(/vimeo\.com\/(?:video\/)?([0-9]+)/);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }
  if (trimmed.startsWith('http')) {
    return trimmed;
  }
  return null;
}

export function CandidateProfile({ id: routeParam }: { id: string }) {
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);
  const [candidate, setCandidate] = useState<CandidateData | null>(null);
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [badges, setBadges] = useState<ProfileBadge[]>([]);
  const [hireStatus, setHireStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [resolvedId, setResolvedId] = useState<string | null>(null);

  // Collab & Brand Deal Inquiry Modal
  const [collabModalOpen, setCollabModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string>('');
  const [inquiryStatus, setInquiryStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [inquiryForm, setInquiryForm] = useState({
    senderName: '',
    senderEmail: '',
    budget: '',
    message: '',
  });

  useEffect(() => {
    if (!routeParam) return;
    const supabase = createClient();

    (async () => {
      setLoading(true);

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
        full_name: merged.full_name || 'Celoris Creator',
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
        creator_data: candidateRow.creator_data || {},
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
    navigator.clipboard.writeText(pageUrl || window.location.href.split('?')[0]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openCollabModal = (serviceTitle?: string) => {
    if (serviceTitle) setSelectedService(serviceTitle);
    setInquiryStatus('idle');
    setCollabModalOpen(true);
  };

  const handleSendInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolvedId || inquiryStatus === 'sending') return;
    setInquiryStatus('sending');
    try {
      const res = await fetch('/api/job-center/hire-candidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateId: resolvedId,
          senderName: inquiryForm.senderName,
          senderEmail: inquiryForm.senderEmail,
          serviceType: selectedService || 'Brand Sponsorship / Collaboration',
          budget: inquiryForm.budget,
          message: inquiryForm.message,
          isCollab: true,
        }),
      });
      if (!res.ok) throw new Error('Request failed');
      setInquiryStatus('sent');
      setTimeout(() => {
        setCollabModalOpen(false);
        setInquiryStatus('idle');
        setInquiryForm({ senderName: '', senderEmail: '', budget: '', message: '' });
      }, 2500);
    } catch (err) {
      console.error('Error submitting inquiry:', err);
      setInquiryStatus('error');
    }
  };

  const handleHireClick = async () => {
    if (!resolvedId || hireStatus === 'sending' || hireStatus === 'sent') return;
    setHireStatus('sending');
    try {
      const res = await fetch('/api/job-center/hire-candidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidateId: resolvedId, isCollab: false }),
      });
      if (!res.ok) throw new Error('Request failed');
      setHireStatus('sent');
    } catch (err) {
      console.error('Error sending hire request:', err);
      setHireStatus('error');
      setTimeout(() => setHireStatus('idle'), 3000);
    }
  };

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
        <h1 className="text-xl font-bold text-white mb-2">This creator profile isn't public</h1>
        <p className="text-slate-400 text-sm max-w-sm mb-6">
          Either this creator hasn't published their profile yet, or they've kept it private.
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

  const creatorData = candidate.creator_data || {};
  const currentTierInfo = LEVEL_TIERS[progress?.level ?? 1];
  const nextLevel = Math.min(5, (progress?.level ?? 1) + 1) as UserTierLevel;
  const nextTierInfo = LEVEL_TIERS[nextLevel];
  const progressPercent = Math.min(
    100,
    Math.round(((progress?.currentXP ?? 0) / (progress?.nextLevelXP ?? currentTierInfo.maxXP)) * 100)
  );

  const videoUrlToEmbed = getEmbedUrl(creatorData.featured_video_url || candidate.youtube);
  const socialStats = creatorData.social_stats || {};
  const services = creatorData.services || [];
  const niches = creatorData.niches || [];

  const hasAnySocial = Boolean(
    socialStats.youtube_subs || candidate.youtube ||
    socialStats.instagram_handle ||
    socialStats.twitch_handle ||
    candidate.twitter || socialStats.x_handle ||
    socialStats.discord_url ||
    candidate.website || candidate.linkedin
  );

  return (
    <div className="bg-[#07080c] text-slate-200 min-h-screen pb-24 selection:bg-emerald-500/30">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 bg-[#07080c]/90 backdrop-blur-xl border-b border-white/[0.08]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/job-center"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/[0.05] transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-emerald-400" />
              <span>Back to Job Center</span>
            </Link>

            <div className="h-5 w-px bg-white/10 hidden sm:block" />

            <Link href="/" className="flex items-center gap-2.5 group">
              <img
                src="/celoris-logo.png"
                alt="Celoris"
                className="h-7 w-auto object-contain filter drop-shadow-[0_0_12px_rgba(16,185,129,0.25)] transition-transform group-hover:scale-105"
              />
            </Link>

            <div className="hidden md:flex items-center gap-2 pl-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-[11px] font-black text-emerald-400 uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Verified Creator Profile
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer"
            >
              <Copy size={13} className="text-emerald-400" />
              <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Creator Profile Hero Header */}
      <div className="bg-[#0d1017] border-b border-white/[0.08] pt-10 pb-14 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[300px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute -top-12 left-10 w-[350px] h-[350px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' as const }}
            className="flex flex-col md:flex-row gap-8 items-start"
          >
            {/* Avatar */}
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
                  className="w-full h-full object-cover rounded-3xl shadow-2xl border border-white/10 ring-4 ring-emerald-500/25"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full rounded-3xl bg-[#131622] border border-white/10 flex items-center justify-center shadow-xl ring-4 ring-emerald-500/25">
                  <UserRound className="h-14 w-14 text-emerald-400" />
                </div>
              )}
              <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-black p-2 rounded-2xl border-4 border-[#0d1017] shadow-lg shadow-emerald-500/30" title="Verified Creator">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </motion.div>

            {/* Creator Bio Header */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                      {creatorData.creator_type || 'Digital Content Creator'}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      {creatorData.collab_status || 'Open for Brand Deals'}
                    </span>
                  </div>

                  <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight uppercase italic">{candidate.full_name}</h1>
                  {candidate.headline && <p className="text-base md:text-lg text-emerald-400 font-semibold mt-1">{candidate.headline}</p>}
                </div>

                {/* Creator QR Code */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.15, ease: 'easeOut' as const }}
                  className="flex items-center gap-4 bg-[#131622] border border-white/[0.08] rounded-2xl px-5 py-4 shadow-xl shrink-0"
                >
                  <img src="/celoris-logo.png" alt="Celoris" className="h-7 w-auto flex-shrink-0" />
                  <div className="h-10 w-px bg-white/10 flex-shrink-0" />
                  {qrCodeUrl && (
                    <img
                      src={qrCodeUrl}
                      alt="Scan to view creator dossier"
                      className="h-20 w-20 rounded-lg border border-white/20 shadow-sm bg-white p-1 flex-shrink-0"
                    />
                  )}
                  <div className="text-left">
                    <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">VERIFIED CREATOR ID</p>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">Scan to view portfolio</p>
                    {candidateIdCode && (
                      <p className="text-[10px] text-slate-500 font-mono mt-1 tracking-wider">#{candidateIdCode}</p>
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Location & Experience tags */}
              <div className="flex flex-wrap items-center gap-5 text-slate-400 mb-5 text-sm">
                {candidate.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-emerald-400" /> {candidate.location}
                  </div>
                )}
                {candidate.experience_years && (
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-emerald-400" /> {candidate.experience_years}
                  </div>
                )}
              </div>

              {/* Niche & Specialty Badges */}
              {(niches.length > 0 || candidate.specialty) && (
                <div className="flex flex-wrap gap-2">
                  {niches.map((niche) => (
                    <span key={niche} className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 px-3.5 py-1 rounded-full text-xs font-bold shadow-xs">
                      {niche}
                    </span>
                  ))}
                  {candidate.specialty && candidate.specialty.split(',').map((tag) => tag.trim()).filter(Boolean).map((tag) => (
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

      {/* Creator Channels & Audience Stats Bar */}
      {hasAnySocial && (
        <div className="border-b border-white/[0.06] bg-[#090c13] py-4">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* YouTube Card */}
              {(socialStats.youtube_subs || candidate.youtube) && (
                <a
                  href={candidate.youtube || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-2xl bg-[#111520] border border-white/5 hover:border-red-500/30 transition-all flex items-center gap-3 group shadow-lg"
                >
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 group-hover:scale-105 transition-transform">
                    <Youtube size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">YouTube</p>
                    <p className="text-xs font-black text-white truncate">{socialStats.youtube_subs || 'Watch Channel'}</p>
                  </div>
                </a>
              )}

              {/* Instagram Card */}
              {socialStats.instagram_handle && (
                <a
                  href={`https://instagram.com/${socialStats.instagram_handle.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-2xl bg-[#111520] border border-white/5 hover:border-pink-500/30 transition-all flex items-center gap-3 group shadow-lg"
                >
                  <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 group-hover:scale-105 transition-transform">
                    <Instagram size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Instagram</p>
                    <p className="text-xs font-black text-white truncate">{socialStats.instagram_followers || socialStats.instagram_handle}</p>
                  </div>
                </a>
              )}

              {/* X / Twitter Card */}
              {(candidate.twitter || socialStats.x_handle) && (
                <a
                  href={candidate.twitter?.startsWith('http') ? candidate.twitter : `https://x.com/${(socialStats.x_handle || candidate.twitter || '').replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-2xl bg-[#111520] border border-white/5 hover:border-cyan-500/30 transition-all flex items-center gap-3 group shadow-lg"
                >
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
                    <Twitter size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">X / Twitter</p>
                    <p className="text-xs font-black text-white truncate">{socialStats.x_followers || socialStats.x_handle || 'Follow'}</p>
                  </div>
                </a>
              )}

              {/* Discord / Collab Community */}
              {(socialStats.discord_url || candidate.website) && (
                <a
                  href={socialStats.discord_url || candidate.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-2xl bg-[#111520] border border-white/5 hover:border-emerald-500/30 transition-all flex items-center gap-3 group shadow-lg"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                    <Globe size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Portfolio / Site</p>
                    <p className="text-xs font-black text-white truncate">Visit Link</p>
                  </div>
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 flex flex-col lg:flex-row lg:items-start gap-8">
        {/* Main Left Column */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={staggerContainer}
          className="flex-1 min-w-0 space-y-8"
        >
          {/* FEATURED SHOWREEL / VIDEO SHOWCASE */}
          {videoUrlToEmbed ? (
            <motion.div variants={fadeInUp} className="bg-[#0d1017] p-6 sm:p-8 rounded-3xl border border-white/[0.08] shadow-2xl space-y-5 relative group overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-4">
                <div>
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
                    <Film size={15} /> Official Video Showcase
                  </div>
                  <h2 className="text-2xl font-black text-white italic uppercase tracking-tight">
                    {creatorData.video_title || 'Featured Showreel & Production'}
                  </h2>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold w-fit">
                  Full 1080p
                </span>
              </div>

              {/* 16:9 Cinema Container */}
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border border-white/10 shadow-[0_0_35px_rgba(16,185,129,0.12)]">
                <iframe
                  src={videoUrlToEmbed}
                  title={creatorData.video_title || "Featured Showreel"}
                  className="w-full h-full object-cover"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {creatorData.video_description && (
                <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed italic bg-white/[0.02] p-4 rounded-xl border border-white/5">
                  "{creatorData.video_description}"
                </p>
              )}
            </motion.div>
          ) : (
            <motion.div variants={fadeInUp} className="bg-[#0d1017] p-8 rounded-3xl border border-white/[0.08] shadow-xl text-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mx-auto flex items-center justify-center text-emerald-400 mb-4">
                <Film size={26} />
              </div>
              <h3 className="text-xl font-black text-white uppercase italic">Creator Showreel</h3>
              <p className="text-slate-400 text-xs sm:text-sm max-w-md mx-auto mt-2">
                This creator is in the process of linking their featured showreel. Contact them below for their portfolio samples and past client work.
              </p>
              <button
                onClick={() => openCollabModal()}
                className="mt-6 px-6 py-2.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-bold transition-all cursor-pointer"
              >
                Request Video Samples
              </button>
            </motion.div>
          )}

          {/* COLLABORATION SERVICES & RATE CARD */}
          {services.length > 0 && (
            <motion.div variants={fadeInUp} className="bg-[#0d1017] p-6 sm:p-8 rounded-3xl border border-white/[0.08] shadow-2xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
                <div>
                  <h2 className="text-2xl font-black text-white flex items-center gap-2.5 italic uppercase tracking-tight">
                    <DollarSign className="text-emerald-400" size={24} /> Collaboration Packages & Rate Card
                  </h2>
                  <p className="text-xs text-slate-400 font-medium mt-1">Book direct brand integrations, sponsored episodes, or voiceover production.</p>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 w-fit">
                  Standard Commercial Rates
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((svc: CreatorService, idx: number) => (
                  <div
                    key={svc.id || idx}
                    className="p-5 rounded-2xl bg-[#131622] border border-white/[0.08] hover:border-emerald-500/40 transition-all flex flex-col justify-between group shadow-xl"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <h3 className="font-bold text-white text-base leading-snug group-hover:text-emerald-400 transition-colors">
                          {svc.title}
                        </h3>
                        <span className="text-sm font-black text-emerald-400 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/25 shrink-0">
                          {svc.starting_price}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-3 font-semibold">
                        <Clock size={13} className="text-emerald-400" /> Turnaround: <span className="text-slate-200">{svc.turnaround || '3-5 Days'}</span>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed mb-5">
                        {svc.description}
                      </p>
                    </div>

                    <button
                      onClick={() => openCollabModal(svc.title)}
                      className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-emerald-500/20 border border-white/10 hover:border-emerald-500/30 text-white hover:text-emerald-300 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Request This Service</span>
                      <ExternalLink size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* VERIFIED PROGRESSION & BADGES */}
          <motion.div variants={fadeInUp} className="bg-[#0d1017] p-8 rounded-3xl border border-white/[0.08] shadow-xl space-y-6">
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

          {/* ABOUT CREATOR SECTION */}
          {candidate.bio && (
            <motion.div variants={fadeInUp} className="bg-[#0d1017] p-8 rounded-3xl border border-white/[0.08] shadow-xl">
              <h2 className="text-2xl font-bold text-white mb-4">About {candidate.full_name.split(' ')[0]}</h2>
              <div className="prose prose-invert max-w-none text-slate-300 whitespace-pre-line leading-relaxed text-sm">{candidate.bio}</div>
            </motion.div>
          )}

          {/* SKILLS */}
          {candidate.skills.length > 0 && (
            <motion.div variants={fadeInUp} className="bg-[#0d1017] p-8 rounded-3xl border border-white/[0.08] shadow-xl">
              <h2 className="text-2xl font-bold text-white mb-6">Production Skills & Tools</h2>
              <div className="flex flex-wrap gap-2">
                {candidate.skills.map((skill) => (
                  <span key={skill} className="bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 px-3.5 py-1.5 rounded-full text-xs font-bold">
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          {/* WORK EXPERIENCE */}
          {candidate.experience.length > 0 && (
            <motion.div variants={fadeInUp} className="bg-[#0d1017] p-8 rounded-3xl border border-white/[0.08] shadow-xl">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Briefcase className="h-6 w-6 text-emerald-400" /> Production & Work History
              </h2>
              <div className="space-y-6">
                {candidate.experience.map((entry, idx) => (
                  <div key={entry.id || idx} className="border-l-2 border-emerald-500/30 pl-6 relative">
                    <div className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                    <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
                      <h3 className="font-bold text-white">{entry.title}</h3>
                      <span className="text-xs text-slate-400 font-medium">{entry.duration}</span>
                    </div>
                    {entry.organization && <p className="text-sm text-emerald-400 font-medium mb-2">{entry.organization}</p>}
                    {entry.description && <p className="text-sm text-slate-300 leading-relaxed">{entry.description}</p>}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* EDUCATION */}
          {candidate.education.length > 0 && (
            <motion.div variants={fadeInUp} className="bg-[#0d1017] p-8 rounded-3xl border border-white/[0.08] shadow-xl">
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
        </motion.div>

        {/* Right Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: 'easeOut' as const, delay: 0.1 }}
          className="w-full lg:w-80 flex-shrink-0"
        >
          <div className="lg:sticky lg:top-20 bg-[#0d1017] rounded-3xl border border-white/[0.08] shadow-2xl divide-y divide-white/[0.08] overflow-hidden">
            {/* Main Action Buttons */}
            <div className="p-6 space-y-3">
              <button
                onClick={() => openCollabModal()}
                className="w-full py-4 rounded-2xl font-black text-sm tracking-wide bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 hover:from-emerald-400 hover:to-cyan-300 text-black shadow-lg shadow-emerald-500/25 hover:scale-[1.02] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <MessageSquare size={16} />
                <span>Collab / Work With Me</span>
              </button>

              <button
                onClick={handleHireClick}
                disabled={hireStatus === 'sending' || hireStatus === 'sent'}
                className={`w-full py-3 rounded-2xl font-bold text-xs tracking-wide transition-all border ${
                  hireStatus === 'sent'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 cursor-default'
                    : 'bg-white/5 hover:bg-white/10 text-white border-white/10'
                }`}
              >
                {hireStatus === 'sending' ? 'Sending...' : hireStatus === 'sent' ? 'Request Sent ✓' : hireStatus === 'error' ? 'Failed — Try Again' : 'Direct Hire (Standard)'}
              </button>
            </div>

            {/* Creator Collab Guarantee */}
            <div className="p-6 space-y-2">
              <h3 className="font-bold text-white text-xs uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <ShieldCheck size={14} /> Creator Guarantee
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Direct client connect. Fast 48hr response time. Verified portfolio identity.
              </p>
            </div>

            {/* Languages */}
            {candidate.languages.length > 0 && (
              <div className="p-6">
                <h3 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Languages / Dubbing</h3>
                <div className="flex flex-wrap gap-2">
                  {candidate.languages.map((lang) => (
                    <span key={lang} className="bg-white/[0.05] border border-white/10 text-slate-300 px-3 py-1 rounded-full text-xs font-semibold">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Social Connect Links */}
            <div className="p-6 space-y-3">
              <h3 className="font-bold text-white text-xs uppercase tracking-wider mb-2">Connect</h3>
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
                  <Twitter className="h-4 w-4 text-emerald-400 flex-shrink-0" /> <span className="truncate">X / Twitter</span>
                </a>
              )}
              {candidate.youtube && (
                <a href={candidate.youtube} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-slate-400 hover:text-emerald-400 transition-colors">
                  <Youtube className="h-4 w-4 text-emerald-400 flex-shrink-0" /> <span className="truncate">YouTube</span>
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* BRAND COLLAB & WORK WITH ME MODAL */}
      <AnimatePresence>
        {collabModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-[#0d1017] border border-white/10 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-3xl text-left relative overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
                <div>
                  <div className="flex items-center gap-1.5 text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-1">
                    <MessageSquare size={13} /> Direct Creator Collab
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white italic uppercase tracking-tight">
                    Work With {candidate.full_name}
                  </h3>
                </div>
                <button
                  onClick={() => setCollabModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {inquiryStatus === 'sent' ? (
                <div className="py-10 text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/30">
                    <CheckCircle2 size={32} />
                  </div>
                  <h4 className="text-xl font-black text-white uppercase italic">Inquiry Dispatched!</h4>
                  <p className="text-xs text-slate-300 max-w-sm mx-auto">
                    Your collaboration proposal and details have been sent directly to {candidate.full_name}. They will reach out via email shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSendInquiry} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Your Name / Brand</label>
                      <input
                        type="text"
                        required
                        value={inquiryForm.senderName}
                        onChange={e => setInquiryForm({ ...inquiryForm, senderName: e.target.value })}
                        placeholder="e.g. Acme Media / Alex"
                        className="w-full bg-[#131622] border border-white/10 px-3.5 py-2.5 rounded-xl text-xs text-white outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Work Email</label>
                      <input
                        type="email"
                        required
                        value={inquiryForm.senderEmail}
                        onChange={e => setInquiryForm({ ...inquiryForm, senderEmail: e.target.value })}
                        placeholder="e.g. alex@brand.com"
                        className="w-full bg-[#131622] border border-white/10 px-3.5 py-2.5 rounded-xl text-xs text-white outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Collab / Service Type</label>
                      <select
                        value={selectedService}
                        onChange={e => setSelectedService(e.target.value)}
                        className="w-full bg-[#131622] border border-white/10 px-3 py-2.5 rounded-xl text-xs text-white outline-none focus:border-emerald-500"
                      >
                        <option value="">General Collab Proposal</option>
                        {services.map(s => (
                          <option key={s.id} value={s.title}>{s.title} ({s.starting_price})</option>
                        ))}
                        <option value="Dedicated Video Sponsorship">Dedicated Video Sponsorship</option>
                        <option value="Shorts / Reel Feature">Shorts / Reel Feature</option>
                        <option value="Hindi Dubbing / Voiceover">Hindi Dubbing / Voiceover</option>
                        <option value="Video Editing / Motion">Video Editing / Motion</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Proposed Budget</label>
                      <input
                        type="text"
                        value={inquiryForm.budget}
                        onChange={e => setInquiryForm({ ...inquiryForm, budget: e.target.value })}
                        placeholder="e.g. ₹10,000 or Flexible"
                        className="w-full bg-[#131622] border border-white/10 px-3.5 py-2.5 rounded-xl text-xs text-white outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Project / Campaign Brief</label>
                    <textarea
                      rows={4}
                      required
                      value={inquiryForm.message}
                      onChange={e => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                      placeholder="Share a brief overview of your campaign, requirements, expected timeline, and any links..."
                      className="w-full bg-[#131622] border border-white/10 px-3.5 py-2.5 rounded-xl text-xs text-white outline-none focus:border-emerald-500 leading-relaxed"
                    />
                  </div>

                  {inquiryStatus === 'error' && (
                    <p className="text-xs text-red-400 font-bold">Failed to send inquiry. Please try again or check your network.</p>
                  )}

                  <button
                    type="submit"
                    disabled={inquiryStatus === 'sending'}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-extrabold text-xs tracking-wider uppercase transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {inquiryStatus === 'sending' ? (
                      <Loader2 size={16} className="animate-spin text-black" />
                    ) : (
                      <Send size={15} />
                    )}
                    <span>{inquiryStatus === 'sending' ? 'Sending Proposal...' : 'Send Collab Proposal'}</span>
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
