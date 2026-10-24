/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Mail, MapPin, Camera, Save, Pencil, Plus,
  ExternalLink, CheckCircle2,
  Share2, Copy, Link as LinkIcon,
  Eye, EyeOff, ShieldCheck, Award,
  Film, Youtube, Instagram, Twitter, MessageSquare, Trash2,
  Clock, DollarSign, Globe, Video, Zap, Check
} from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import { createClient } from '@/lib/supabase-client';

const fadeUpItem = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

function buildCandidateSlug(fullName: string, id: string): string {
  const base = (fullName || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'creator';
  const shortId = id.replace(/-/g, '').slice(0, 8);
  return `${base}-${shortId}`;
}

export interface CreatorService {
  id: string;
  title: string;
  starting_price: string;
  turnaround: string;
  description: string;
}

export interface CreatorData {
  featured_video_url?: string;
  video_title?: string;
  video_description?: string;
  creator_type?: string;
  niches?: string[];
  social_stats?: {
    youtube_subs?: string;
    instagram_handle?: string;
    instagram_followers?: string;
    twitch_handle?: string;
    twitch_followers?: string;
    x_handle?: string;
    x_followers?: string;
    discord_url?: string;
  };
  services?: CreatorService[];
  collab_status?: string;
}

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

interface CandidateBadge {
  id: string;
  badgeTitle: string;
  skillName: string;
  verificationHash: string;
}

export function CandidateProfileEditor() {
  const { user, profile, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [badges, setBadges] = useState<CandidateBadge[]>([]);
  const [activeTab, setActiveTab] = useState<'basic' | 'creator' | 'services'>('creator');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    headline: '',
    bio: profile?.description || profile?.bio || '',
    specialty: profile?.specialty || '',
    experience: profile?.experience || '',
    location: profile?.location || '',
    website: profile?.website || '',
    linkedin: profile?.linkedin || '',
    twitter: profile?.twitter || '',
    youtube: profile?.youtube || '',
    skills: [] as string[],
    languages: [] as string[],
    experienceEntries: [] as ExperienceEntry[],
    educationEntries: [] as EducationEntry[],
    isPublic: false,
    creator_data: {
      featured_video_url: '',
      video_title: '',
      video_description: '',
      creator_type: 'Digital Content Creator',
      niches: [] as string[],
      social_stats: {
        youtube_subs: '',
        instagram_handle: '',
        instagram_followers: '',
        twitch_handle: '',
        twitch_followers: '',
        x_handle: '',
        x_followers: '',
        discord_url: '',
      },
      services: [] as CreatorService[],
      collab_status: 'Open for Brand Deals & Collabs',
    } as CreatorData,
  });

  const [newNiche, setNewNiche] = useState('');

  useEffect(() => {
    if (!user?.id) return;
    let cancelled = false;
    (async () => {
      const [{ data: profileRow }, { data: badgeRows }] = await Promise.all([
        supabase.from('job_center_candidate_profiles').select('*').eq('id', user.id).maybeSingle(),
        supabase.from('job_center_badges').select('id, badge_title, skill_name, verification_hash').eq('user_id', user.id).order('earned_date', { ascending: false }),
      ]);

      if (cancelled) return;

      if (profileRow) {
        const cd: CreatorData = profileRow.creator_data || {};
        setFormData((prev) => ({
          ...prev,
          headline: profileRow.headline || '',
          bio: profileRow.bio || prev.bio,
          specialty: profileRow.specialty || prev.specialty,
          experience: profileRow.experience_years || prev.experience,
          location: profileRow.location || prev.location,
          website: profileRow.website || prev.website,
          linkedin: profileRow.linkedin || prev.linkedin,
          twitter: profileRow.twitter || prev.twitter,
          youtube: profileRow.youtube || prev.youtube,
          skills: profileRow.skills || [],
          languages: profileRow.languages || [],
          experienceEntries: Array.isArray(profileRow.experience) ? profileRow.experience : [],
          educationEntries: Array.isArray(profileRow.education) ? profileRow.education : [],
          isPublic: profileRow.is_public ?? false,
          creator_data: {
            featured_video_url: cd.featured_video_url || profileRow.youtube || '',
            video_title: cd.video_title || '',
            video_description: cd.video_description || '',
            creator_type: cd.creator_type || 'Digital Content Creator',
            niches: cd.niches || [],
            social_stats: {
              youtube_subs: cd.social_stats?.youtube_subs || '',
              instagram_handle: cd.social_stats?.instagram_handle || '',
              instagram_followers: cd.social_stats?.instagram_followers || '',
              twitch_handle: cd.social_stats?.twitch_handle || '',
              twitch_followers: cd.social_stats?.twitch_followers || '',
              x_handle: cd.social_stats?.x_handle || '',
              x_followers: cd.social_stats?.x_followers || '',
              discord_url: cd.social_stats?.discord_url || '',
            },
            services: cd.services && cd.services.length > 0 ? cd.services : [
              {
                id: '1',
                title: 'Dedicated Video Sponsorship',
                starting_price: '₹10,000',
                turnaround: '3-5 Days',
                description: 'Full dedicated video feature, integrating product showcase with honest storytelling and pinned link.',
              },
              {
                id: '2',
                title: 'Shorts / Reel Feature (UGC)',
                starting_price: '₹4,500',
                turnaround: '48 Hours',
                description: 'High-energy 30-60 second vertical Reel or Short tailored for maximum viral engagement.',
              },
              {
                id: '3',
                title: 'Dubbing, Voiceover & Audio Post',
                starting_price: '₹3,000 / episode',
                turnaround: '2-3 Days',
                description: 'Professional voiceover, localized dubbing, noise reduction, and background music mastering.',
              }
            ],
            collab_status: cd.collab_status || 'Open for Brand Deals & Collabs',
          },
        }));
      }
      setBadges((badgeRows || []).map((b: any) => ({
        id: b.id,
        badgeTitle: b.badge_title,
        skillName: b.skill_name || '',
        verificationHash: b.verification_hash || '',
      })));
      setProfileLoaded(true);
    })();
    return () => { cancelled = true; };
  }, [user?.id]);

  const calculateStrength = () => {
    let score = 0;
    const totalFields = 7;
    if (profile?.avatar_url || profile?.profile_pic_url) score += 1;
    if (formData.full_name) score += 1;
    if (formData.headline) score += 1;
    if (formData.bio) score += 1;
    if (formData.location) score += 1;
    if (formData.creator_data.featured_video_url) score += 1;
    if ((formData.creator_data.services || []).length > 0) score += 1;
    return Math.round((score / totalFields) * 100);
  };

  const strength = calculateStrength();
  const profileUrl = user?.id
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/job-center/candidates/${buildCandidateSlug(formData.full_name, user.id)}`
    : '';

  const handleSave = async () => {
    setLoading(true);
    setSuccess(false);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: formData.full_name })
        .eq('id', user?.id);

      if (error) {
        await supabase
          .from('users')
          .update({ full_name: formData.full_name })
          .eq('id', user?.id);
      }

      const { error: profileError } = await supabase
        .from('job_center_candidate_profiles')
        .upsert({
          id: user?.id,
          slug: user?.id ? buildCandidateSlug(formData.full_name, user.id) : undefined,
          headline: formData.headline,
          bio: formData.bio,
          specialty: formData.specialty,
          experience_years: formData.experience,
          location: formData.location,
          website: formData.website,
          linkedin: formData.linkedin,
          twitter: formData.twitter,
          youtube: formData.youtube || formData.creator_data.featured_video_url,
          skills: formData.skills,
          languages: formData.languages,
          experience: formData.experienceEntries,
          education: formData.educationEntries,
          is_public: formData.isPublic,
          creator_data: formData.creator_data,
          updated_at: new Date().toISOString(),
        });

      if (profileError) throw profileError;

      await refreshProfile();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Error updating candidate profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = () => {
    fileInputRef.current?.click();
  };

  const handleCopyLink = () => {
    if (!profileUrl) return;
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const addNiche = () => {
    if (!newNiche.trim()) return;
    const current = formData.creator_data.niches || [];
    if (!current.includes(newNiche.trim())) {
      setFormData({
        ...formData,
        creator_data: {
          ...formData.creator_data,
          niches: [...current, newNiche.trim()],
        },
      });
    }
    setNewNiche('');
  };

  const removeNiche = (nicheToRemove: string) => {
    setFormData({
      ...formData,
      creator_data: {
        ...formData.creator_data,
        niches: (formData.creator_data.niches || []).filter(n => n !== nicheToRemove),
      },
    });
  };

  const addService = () => {
    const newService: CreatorService = {
      id: Date.now().toString(),
      title: 'New Creator Service',
      starting_price: '₹5,000',
      turnaround: '3 Days',
      description: 'Describe the deliverables, resolution, and what is included in this package.',
    };
    setFormData({
      ...formData,
      creator_data: {
        ...formData.creator_data,
        services: [...(formData.creator_data.services || []), newService],
      },
    });
  };

  const updateService = (id: string, field: keyof CreatorService, value: string) => {
    setFormData({
      ...formData,
      creator_data: {
        ...formData.creator_data,
        services: (formData.creator_data.services || []).map(s => s.id === id ? { ...s, [field]: value } : s),
      },
    });
  };

  const removeService = (id: string) => {
    setFormData({
      ...formData,
      creator_data: {
        ...formData.creator_data,
        services: (formData.creator_data.services || []).filter(s => s.id !== id),
      },
    });
  };

  if (!profileLoaded) {
    return (
      <div className="p-8 max-w-5xl mx-auto flex flex-col items-center justify-center py-32 gap-3 text-slate-400">
        <div className="w-8 h-8 border-2 border-slate-200 border-t-emerald-500 rounded-full animate-spin" />
        <p className="text-sm font-medium">Loading your creator profile...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto select-none">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' as const }}
        className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 mb-8"
      >
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-2">
            <Film size={12} /> Online Creator Suite
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Creator Profile & Rate Card</h1>
          <p className="text-slate-400 mt-1 text-xs sm:text-sm font-medium">Build your creator portfolio, showcase your showreels, and receive brand deal inquiries.</p>
        </div>
        <motion.button
          onClick={handleSave}
          disabled={loading}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.97 }}
          className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black px-7 py-3 rounded-2xl font-extrabold text-xs transition-all shadow-[0_0_20px_rgba(52,211,153,0.35)] flex items-center gap-2 group disabled:opacity-50 active:scale-98"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
          ) : (
            <Save className="h-4 w-4 transition-transform group-hover:scale-110" />
          )}
          <AnimatePresence mode="wait">
            <motion.span
              key={success ? 'saved' : 'save'}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
            >
              {success ? 'Saved!' : 'Save Profile'}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Photo & Share */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          className="lg:col-span-1 space-y-6"
        >
          <motion.div variants={fadeUpItem} className="bg-[#0d1017]/95 backdrop-blur-xl p-7 rounded-3xl border border-white/[0.08] shadow-2xl flex flex-col items-center text-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-emerald-500/10 to-cyan-500/5 -z-0" />

            <div className="relative mt-4">
              <div className="w-32 h-32 rounded-3xl bg-[#131620] border-4 border-white/10 shadow-lg overflow-hidden flex items-center justify-center">
                {profile?.avatar_url || profile?.profile_pic_url ? (
                  <img src={profile.avatar_url || profile.profile_pic_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User size={48} className="text-emerald-400" />
                )}
              </div>
              <button
                onClick={handleAvatarUpload}
                className="absolute -bottom-2 -right-2 bg-gradient-to-r from-emerald-500 to-cyan-500 p-2.5 rounded-2xl text-black shadow-lg hover:scale-110 transition-transform cursor-pointer"
              >
                <Camera size={16} />
              </button>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" />
            </div>

            <div className="mt-6 relative w-full">
              <h3 className="text-lg font-black text-white leading-tight">{formData.full_name || 'Your Name'}</h3>
              <p className={`text-emerald-400 font-bold text-[11px] uppercase tracking-wider mt-1 ${!formData.headline && 'opacity-30'}`}>
                {formData.headline || 'Add a creator headline'}
              </p>

              <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] font-bold text-slate-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{formData.creator_data.collab_status || 'Open for Brand Deals'}</span>
              </div>

              <div className="mt-5 pt-5 border-t border-white/[0.08] flex flex-col gap-3 text-left">
                <div className="flex items-center gap-3 text-slate-400">
                  <Mail size={15} className="text-emerald-400 shrink-0" />
                  <span className="text-xs font-semibold line-clamp-1 text-slate-300">{user?.email}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-400">
                  <MapPin size={15} className="text-emerald-400 shrink-0" />
                  <span className={`text-xs font-semibold text-slate-300 ${!formData.location && 'opacity-40'}`}>{formData.location || 'Location Not Set'}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Share as Public Creator Profile */}
          <motion.div variants={fadeUpItem} className="bg-[#0d1017]/95 backdrop-blur-xl p-6 rounded-3xl border border-white/[0.08] shadow-2xl space-y-4">
            <h4 className="font-bold text-xs text-white uppercase tracking-wider flex items-center gap-2">
              <Share2 className="text-emerald-400" size={16} /> Public Creator Link
            </h4>

            <button
              type="button"
              onClick={() => setFormData({ ...formData, isPublic: !formData.isPublic })}
              className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                formData.isPublic ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-[#131620] border-white/10'
              }`}
            >
              <span className="flex items-center gap-2 text-xs font-bold text-slate-200">
                {formData.isPublic ? <Eye size={15} className="text-emerald-400" /> : <EyeOff size={15} className="text-slate-400" />}
                {formData.isPublic ? 'Publicly Live' : 'Hidden / Private'}
              </span>
              <div className={`relative w-10 h-5 rounded-full transition-colors ${formData.isPublic ? 'bg-emerald-500' : 'bg-slate-700'}`}>
                <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${formData.isPublic ? 'translate-x-5' : 'translate-x-0'}`} />
              </div>
            </button>

            <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5">
              <LinkIcon size={14} className="text-slate-400 flex-shrink-0" />
              <span className="text-xs font-mono text-slate-400 truncate flex-1">{profileUrl || 'Sign in to get your link'}</span>
            </div>

            <button
              type="button"
              onClick={handleCopyLink}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <Copy size={14} /> {copied ? 'Copied!' : 'Copy Creator Link'}
            </button>

            <a
              href={profileUrl || undefined}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold transition-all"
            >
              <ExternalLink size={14} /> Preview Creator Dossier
            </a>
          </motion.div>

          <motion.div variants={fadeUpItem} className="bg-gradient-to-br from-emerald-950/40 via-[#0e1620] to-[#0d1017] p-6 rounded-3xl border border-emerald-500/25 text-white shadow-2xl relative overflow-hidden">
            <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-400 mb-4">Creator Portfolio Score</h4>
            <div className="flex justify-between items-end mb-2">
              <span className="text-3xl font-extrabold tracking-tight font-mono">{strength}%</span>
              <span className="text-xs font-bold text-emerald-400">
                {strength < 50 ? 'Basic' : strength < 80 ? 'Solid Creator' : 'Brand Ready!'}
              </span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-6">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.5)] transition-all duration-500"
                style={{ width: `${strength}%` }}
              />
            </div>
            <ul className="space-y-2.5 text-xs">
              <li className={`flex items-center gap-2 text-[10.5px] font-bold ${formData.creator_data.featured_video_url ? 'text-emerald-400' : 'text-slate-500'}`}>
                {formData.creator_data.featured_video_url ? <CheckCircle2 size={12} /> : <Plus size={12} />} Featured Showreel / Video
              </li>
              <li className={`flex items-center gap-2 text-[10.5px] font-bold ${(formData.creator_data.services || []).length > 0 ? 'text-emerald-400' : 'text-slate-500'}`}>
                {(formData.creator_data.services || []).length > 0 ? <CheckCircle2 size={12} /> : <Plus size={12} />} Collab Services & Pricing
              </li>
              <li className={`flex items-center gap-2 text-[10.5px] font-bold ${formData.headline ? 'text-emerald-400' : 'text-slate-500'}`}>
                {formData.headline ? <CheckCircle2 size={12} /> : <Plus size={12} />} Creator Headline
              </li>
              <li className={`flex items-center gap-2 text-[10.5px] font-bold ${formData.bio ? 'text-emerald-400' : 'text-slate-500'}`}>
                {formData.bio ? <CheckCircle2 size={12} /> : <Plus size={12} />} Creator Bio / Story
              </li>
            </ul>
          </motion.div>
        </motion.div>

        {/* Right Column - Tabs & Forms */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } } }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Tab Selector */}
          <div className="flex bg-[#0d1017] p-1.5 rounded-2xl border border-white/[0.08] gap-1.5 shadow-xl">
            <button
              type="button"
              onClick={() => setActiveTab('creator')}
              className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'creator'
                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-black shadow-lg shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Film size={15} />
              <span>Showreel & Channels</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('services')}
              className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'services'
                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-black shadow-lg shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <DollarSign size={15} />
              <span>Collab Services & Rates</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('basic')}
              className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'basic'
                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-black shadow-lg shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Pencil size={15} />
              <span>Bio & Details</span>
            </button>
          </div>

          {/* TAB 1: SHOWREEL & CREATOR SOCIALS */}
          {activeTab === 'creator' && (
            <motion.div variants={fadeUpItem} className="space-y-6">
              {/* Showreel Video Box */}
              <div className="bg-[#0d1017]/95 backdrop-blur-xl p-7 rounded-3xl border border-white/[0.08] shadow-2xl space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-white flex items-center gap-2.5">
                    <Video className="text-emerald-400" size={20} /> Featured Showreel / Video
                  </h3>
                  <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                    High Impact
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-medium">
                  Add a YouTube video, gameplay episode, or cinematic reel that plays directly at the top of your creator profile.
                </p>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">Video / Showreel URL (YouTube / Vimeo / MP4)</label>
                    <input
                      type="text"
                      value={formData.creator_data.featured_video_url || ''}
                      onChange={e => setFormData({
                        ...formData,
                        creator_data: { ...formData.creator_data, featured_video_url: e.target.value },
                      })}
                      className="w-full bg-[#131620] border border-white/10 focus:border-emerald-500 focus:bg-[#181d2a] px-4 py-3 rounded-xl outline-none transition-all font-semibold text-white shadow-inner text-xs"
                      placeholder="e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">Video Title / Headline</label>
                      <input
                        type="text"
                        value={formData.creator_data.video_title || ''}
                        onChange={e => setFormData({
                          ...formData,
                          creator_data: { ...formData.creator_data, video_title: e.target.value },
                        })}
                        className="w-full bg-[#131620] border border-white/10 focus:border-emerald-500 focus:bg-[#181d2a] px-4 py-3 rounded-xl outline-none transition-all font-semibold text-white shadow-inner text-xs"
                        placeholder="e.g. Cyberpunk 2077 - Hindi Dubbed Cinematic Storymode Ep. 1"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">Collaboration Status</label>
                      <input
                        type="text"
                        value={formData.creator_data.collab_status || ''}
                        onChange={e => setFormData({
                          ...formData,
                          creator_data: { ...formData.creator_data, collab_status: e.target.value },
                        })}
                        className="w-full bg-[#131620] border border-white/10 focus:border-emerald-500 focus:bg-[#181d2a] px-4 py-3 rounded-xl outline-none transition-all font-semibold text-white shadow-inner text-xs"
                        placeholder="e.g. Open for Brand Deals & Sponsorships"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">Video Description / Context</label>
                    <textarea
                      rows={2}
                      value={formData.creator_data.video_description || ''}
                      onChange={e => setFormData({
                        ...formData,
                        creator_data: { ...formData.creator_data, video_description: e.target.value },
                      })}
                      className="w-full bg-[#131620] border border-white/10 focus:border-emerald-500 focus:bg-[#181d2a] px-4 py-2.5 rounded-xl outline-none transition-all font-medium text-white shadow-inner text-xs leading-relaxed"
                      placeholder="e.g. Third-person customized camera walkthrough with real-time localized Hindi dubbing and high fidelity sound design."
                    />
                  </div>
                </div>
              </div>

              {/* Creator Niche Tags */}
              <div className="bg-[#0d1017]/95 backdrop-blur-xl p-7 rounded-3xl border border-white/[0.08] shadow-2xl space-y-4">
                <h3 className="text-lg font-black text-white flex items-center gap-2.5">
                  <Zap className="text-emerald-400" size={18} /> Creator Niches & Content Categories
                </h3>
                <p className="text-xs text-slate-400 font-medium">Tag your content focus so brands instantly know what type of creator you are.</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {(formData.creator_data.niches || []).map((niche) => (
                    <span key={niche} className="inline-flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 px-3 py-1 rounded-full text-xs font-bold">
                      {niche}
                      <button type="button" onClick={() => removeNiche(niche)} className="hover:text-red-400">
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newNiche}
                    onChange={e => setNewNiche(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addNiche(); } }}
                    placeholder="e.g. Gaming & Dubbing, 3D Art, Tech Reviews, AI Video"
                    className="flex-1 bg-[#131620] border border-white/10 focus:border-emerald-500 px-4 py-2.5 rounded-xl text-xs text-white outline-none"
                  />
                  <button
                    type="button"
                    onClick={addNiche}
                    className="px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white font-bold rounded-xl text-xs transition-colors"
                  >
                    Add Niche
                  </button>
                </div>
              </div>

              {/* Creator Socials & Audience Stats */}
              <div className="bg-[#0d1017]/95 backdrop-blur-xl p-7 rounded-3xl border border-white/[0.08] shadow-2xl space-y-5">
                <h3 className="text-lg font-black text-white flex items-center gap-2.5">
                  <Globe className="text-emerald-400" size={18} /> Channels & Audience Stats
                </h3>
                <p className="text-xs text-slate-400 font-medium">Display verified audience counts across YouTube, Instagram, Twitch, and X.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1 flex items-center gap-1.5">
                      <Youtube size={13} className="text-red-400" /> YouTube Channel Link / Handle
                    </label>
                    <input
                      type="text"
                      value={formData.youtube}
                      onChange={e => setFormData({ ...formData, youtube: e.target.value })}
                      className="w-full bg-[#131620] border border-white/10 px-4 py-2.5 rounded-xl text-xs text-white outline-none focus:border-emerald-500"
                      placeholder="e.g. https://youtube.com/@ankushgaming"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">YouTube Subscribers</label>
                    <input
                      type="text"
                      value={formData.creator_data.social_stats?.youtube_subs || ''}
                      onChange={e => setFormData({
                        ...formData,
                        creator_data: {
                          ...formData.creator_data,
                          social_stats: { ...formData.creator_data.social_stats, youtube_subs: e.target.value },
                        },
                      })}
                      className="w-full bg-[#131620] border border-white/10 px-4 py-2.5 rounded-xl text-xs text-white outline-none focus:border-emerald-500"
                      placeholder="e.g. 85K Subscribers"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1 flex items-center gap-1.5">
                      <Instagram size={13} className="text-pink-400" /> Instagram Handle
                    </label>
                    <input
                      type="text"
                      value={formData.creator_data.social_stats?.instagram_handle || ''}
                      onChange={e => setFormData({
                        ...formData,
                        creator_data: {
                          ...formData.creator_data,
                          social_stats: { ...formData.creator_data.social_stats, instagram_handle: e.target.value },
                        },
                      })}
                      className="w-full bg-[#131620] border border-white/10 px-4 py-2.5 rounded-xl text-xs text-white outline-none focus:border-emerald-500"
                      placeholder="e.g. @ankush_creates"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">Instagram Followers</label>
                    <input
                      type="text"
                      value={formData.creator_data.social_stats?.instagram_followers || ''}
                      onChange={e => setFormData({
                        ...formData,
                        creator_data: {
                          ...formData.creator_data,
                          social_stats: { ...formData.creator_data.social_stats, instagram_followers: e.target.value },
                        },
                      })}
                      className="w-full bg-[#131620] border border-white/10 px-4 py-2.5 rounded-xl text-xs text-white outline-none focus:border-emerald-500"
                      placeholder="e.g. 42K Followers"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1 flex items-center gap-1.5">
                      <Twitter size={13} className="text-cyan-400" /> X (Twitter) Handle / Link
                    </label>
                    <input
                      type="text"
                      value={formData.twitter}
                      onChange={e => setFormData({ ...formData, twitter: e.target.value })}
                      className="w-full bg-[#131620] border border-white/10 px-4 py-2.5 rounded-xl text-xs text-white outline-none focus:border-emerald-500"
                      placeholder="e.g. @ankush_x"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1 flex items-center gap-1.5">
                      <MessageSquare size={13} className="text-indigo-400" /> Discord / Community Link
                    </label>
                    <input
                      type="text"
                      value={formData.creator_data.social_stats?.discord_url || ''}
                      onChange={e => setFormData({
                        ...formData,
                        creator_data: {
                          ...formData.creator_data,
                          social_stats: { ...formData.creator_data.social_stats, discord_url: e.target.value },
                        },
                      })}
                      className="w-full bg-[#131620] border border-white/10 px-4 py-2.5 rounded-xl text-xs text-white outline-none focus:border-emerald-500"
                      placeholder="e.g. https://discord.gg/..."
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: COLLAB SERVICES & RATES */}
          {activeTab === 'services' && (
            <motion.div variants={fadeUpItem} className="space-y-6">
              <div className="bg-[#0d1017]/95 backdrop-blur-xl p-7 rounded-3xl border border-white/[0.08] shadow-2xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-black text-white flex items-center gap-2.5">
                      <DollarSign className="text-emerald-400" size={20} /> Collaboration Services & Rate Card
                    </h3>
                    <p className="text-xs text-slate-400 font-medium mt-1">
                      Set up bookable brand packages. Clients and brands can request these directly from your profile.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={addService}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 font-bold text-xs transition-colors cursor-pointer shrink-0"
                  >
                    <Plus size={14} /> Add Service
                  </button>
                </div>

                <div className="space-y-4">
                  {(formData.creator_data.services || []).map((service, index) => (
                    <div key={service.id || index} className="p-5 rounded-2xl bg-[#131620] border border-white/10 space-y-4 relative group">
                      <div className="flex items-center justify-between border-b border-white/5 pb-3">
                        <span className="text-[11px] font-black uppercase tracking-widest text-emerald-400">
                          Package #{index + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeService(service.id)}
                          className="text-slate-500 hover:text-red-400 p-1.5 rounded-lg transition-colors cursor-pointer"
                          title="Remove service"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="md:col-span-1 space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Service Name</label>
                          <input
                            type="text"
                            value={service.title}
                            onChange={e => updateService(service.id, 'title', e.target.value)}
                            className="w-full bg-[#0d1017] border border-white/10 px-3 py-2 rounded-xl text-xs text-white font-bold outline-none focus:border-emerald-500"
                            placeholder="e.g. Dedicated Video Sponsorship"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Starting Rate</label>
                          <input
                            type="text"
                            value={service.starting_price}
                            onChange={e => updateService(service.id, 'starting_price', e.target.value)}
                            className="w-full bg-[#0d1017] border border-white/10 px-3 py-2 rounded-xl text-xs text-emerald-400 font-bold outline-none focus:border-emerald-500"
                            placeholder="e.g. ₹10,000"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Turnaround Time</label>
                          <input
                            type="text"
                            value={service.turnaround}
                            onChange={e => updateService(service.id, 'turnaround', e.target.value)}
                            className="w-full bg-[#0d1017] border border-white/10 px-3 py-2 rounded-xl text-xs text-white outline-none focus:border-emerald-500"
                            placeholder="e.g. 3-5 Days"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Deliverables & Scope</label>
                        <textarea
                          rows={2}
                          value={service.description}
                          onChange={e => updateService(service.id, 'description', e.target.value)}
                          className="w-full bg-[#0d1017] border border-white/10 px-3 py-2 rounded-xl text-xs text-slate-300 outline-none focus:border-emerald-500 leading-relaxed"
                          placeholder="Describe what is provided (e.g. 60-second integration, pinned comment, 30 days usage rights)..."
                        />
                      </div>
                    </div>
                  ))}

                  {(formData.creator_data.services || []).length === 0 && (
                    <div className="text-center py-10 border border-dashed border-white/10 rounded-2xl">
                      <p className="text-xs text-slate-400 mb-3">No services configured yet.</p>
                      <button
                        type="button"
                        onClick={addService}
                        className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold text-xs hover:bg-emerald-500/30 transition-colors"
                      >
                        + Add Your First Rate Card Service
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 3: BASIC INFO & BIO */}
          {activeTab === 'basic' && (
            <motion.div variants={fadeUpItem} className="space-y-6">
              <div className="bg-[#0d1017]/95 backdrop-blur-xl p-7 rounded-3xl border border-white/[0.08] shadow-2xl">
                <h3 className="text-xl font-black text-white mb-6 flex items-center gap-2.5">
                  <Pencil className="text-emerald-400" size={20} /> Basic Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">Display Name</label>
                    <input
                      type="text"
                      value={formData.full_name}
                      onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                      className="w-full bg-[#131620] border border-white/10 focus:border-emerald-500 focus:bg-[#181d2a] px-4 py-3 rounded-xl outline-none transition-all font-semibold text-white shadow-inner text-xs"
                      placeholder="e.g. Ankush Jain"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">Years Active / Experience</label>
                    <input
                      type="text"
                      value={formData.experience}
                      onChange={e => setFormData({ ...formData, experience: e.target.value })}
                      className="w-full bg-[#131620] border border-white/10 focus:border-emerald-500 focus:bg-[#181d2a] px-4 py-3 rounded-xl outline-none transition-all font-semibold text-white shadow-inner text-xs"
                      placeholder="e.g. 3+ Years Creating"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">Creator Headline</label>
                    <input
                      type="text"
                      value={formData.headline}
                      onChange={e => setFormData({ ...formData, headline: e.target.value })}
                      className="w-full bg-[#131620] border border-white/10 focus:border-emerald-500 focus:bg-[#181d2a] px-4 py-3 rounded-xl outline-none transition-all font-semibold text-white shadow-inner text-xs"
                      placeholder="e.g. Gaming Streamer & Hindi Dubbing Artist | Video Producer"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">Location / Base</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={e => setFormData({ ...formData, location: e.target.value })}
                      className="w-full bg-[#131620] border border-white/10 focus:border-emerald-500 focus:bg-[#181d2a] px-4 py-3 rounded-xl outline-none transition-all font-semibold text-white shadow-inner text-xs"
                      placeholder="e.g. Gurugram, India"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">Website or Portfolio</label>
                    <input
                      type="text"
                      value={formData.website}
                      onChange={e => setFormData({ ...formData, website: e.target.value })}
                      className="w-full bg-[#131620] border border-white/10 focus:border-emerald-500 focus:bg-[#181d2a] px-4 py-3 rounded-xl outline-none transition-all font-semibold text-white shadow-inner text-xs"
                      placeholder="e.g. https://celorisdesigns.com"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">About / Creator Story</label>
                    <textarea
                      rows={5}
                      value={formData.bio}
                      onChange={e => setFormData({ ...formData, bio: e.target.value })}
                      className="w-full bg-[#131620] border border-white/10 focus:border-emerald-500 focus:bg-[#181d2a] px-4 py-3 rounded-2xl outline-none transition-all font-medium text-white shadow-inner leading-relaxed text-xs"
                      placeholder="Tell brands and fans about your creative background, content style, equipment, and storytelling vision..."
                    />
                  </div>
                </div>
              </div>

              {/* Verified Badges */}
              <div className="bg-[#0d1017]/95 backdrop-blur-xl p-7 rounded-3xl border border-white/[0.08] shadow-2xl">
                <h3 className="text-xl font-black text-white mb-2 flex items-center gap-2.5">
                  <Award className="text-emerald-400" size={20} /> Verified Skill Badges
                </h3>
                <p className="text-xs text-slate-400 font-medium mb-6">
                  Verified through Celoris skill assessments and proctored progression.
                </p>

                {badges.length === 0 ? (
                  <p className="text-xs text-slate-500 font-medium text-center py-6">
                    No verified badges yet. Earn one from the Exams tab.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {badges.map((badge) => (
                      <div key={badge.id} className="p-4 rounded-2xl bg-[#131620] border border-white/10 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white flex-shrink-0 bg-emerald-600 shadow-xs">
                          <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-xs text-white truncate">{badge.badgeTitle}</p>
                          <p className="text-[10px] text-slate-400 truncate">{badge.skillName} • {badge.verificationHash}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
