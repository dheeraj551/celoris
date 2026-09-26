/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Mail, MapPin, Camera, Save, Pencil, Plus,
  ExternalLink, CheckCircle,
  Share2, Copy, Link as LinkIcon,
  Eye, EyeOff, ShieldCheck, Award,
} from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import { createClient } from '@/lib/supabase-client';

const fadeUpItem = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

// Builds the human-readable slug used in the public profile URL/QR code
// (e.g. "prabha-singh-f93e9a8f") from the candidate's current display name
// plus a short id suffix, so it stays unique even between candidates who
// share a name. Recomputed on every save from the current name, so the
// link updates if the candidate renames themselves later.
function buildCandidateSlug(fullName: string, id: string): string {
  // Strip combining diacritical marks (U+0300-U+036F) left behind by
  // NFKD normalization, e.g. turning "\u00e9" into a plain "e".
  const base = (fullName || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'candidate';
  const shortId = id.replace(/-/g, '').slice(0, 8);
  return `${base}-${shortId}`;
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
  });

  // Load the candidate profile record (if one already exists) on mount.
  // The form stays hidden (see `profileLoaded` below) until this finishes,
  // so nothing typed can ever get silently overwritten by this fetch.
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
    const totalFields = 6;
    if (profile?.avatar_url || profile?.profile_pic_url) score += 1;
    if (formData.full_name) score += 1;
    if (formData.headline) score += 1;
    if (formData.bio) score += 1;
    if (formData.specialty) score += 1;
    if (formData.location) score += 1;
    return Math.round((score / totalFields) * 100);
  };

  const strength = calculateStrength();
  // Live preview of the slug that will be saved — matches what handleSave
  // below actually writes, so this always reflects the name currently in
  // the form even before the candidate hits Save.
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
          youtube: formData.youtube,
          skills: formData.skills,
          languages: formData.languages,
          experience: formData.experienceEntries,
          education: formData.educationEntries,
          is_public: formData.isPublic,
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

  if (!profileLoaded) {
    return (
      <div className="p-8 max-w-5xl mx-auto flex flex-col items-center justify-center py-32 gap-3 text-slate-400">
        <div className="w-8 h-8 border-2 border-slate-200 border-t-emerald-500 rounded-full animate-spin" />
        <p className="text-sm font-medium">Loading your candidate profile...</p>
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
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Candidate Profile</h1>
          <p className="text-slate-400 mt-1 text-xs sm:text-sm font-medium">Build your candidate profile and share it as a public verified resume</p>
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
              {success ? 'Saved!' : 'Save Changes'}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Photo & Basics */}
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
                {formData.headline || 'Add a professional headline'}
              </p>

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

          {/* Share as Public Candidate Resume */}
          <motion.div variants={fadeUpItem} className="bg-[#0d1017]/95 backdrop-blur-xl p-6 rounded-3xl border border-white/[0.08] shadow-2xl space-y-4">
            <h4 className="font-bold text-xs text-white uppercase tracking-wider flex items-center gap-2">
              <Share2 className="text-emerald-400" size={16} /> Share Your Profile
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
                {formData.isPublic ? 'Public Resume' : 'Private'}
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
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white text-xs font-bold transition-all shadow-xs"
            >
              <Copy size={14} /> {copied ? 'Copied!' : 'Copy Link'}
            </button>

            <a
              href={profileUrl || undefined}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold transition-all"
            >
              <ExternalLink size={14} /> View Public Profile
            </a>
          </motion.div>

          <motion.div variants={fadeUpItem} className="bg-gradient-to-br from-emerald-950/40 via-[#0e1620] to-[#0d1017] p-6 rounded-3xl border border-emerald-500/25 text-white shadow-2xl relative overflow-hidden">
            <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-400 mb-4">Profile Strength</h4>
            <div className="flex justify-between items-end mb-2">
              <span className="text-3xl font-extrabold tracking-tight font-mono">{strength}%</span>
              <span className="text-xs font-bold text-emerald-400">
                {strength < 50 ? 'Getting started' : strength < 80 ? 'Good!' : 'Great!'}
              </span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-6">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.5)] transition-all duration-500"
                style={{ width: `${strength}%` }}
              />
            </div>
            <ul className="space-y-2.5 text-xs">
              <li className={`flex items-center gap-2 text-[10.5px] font-bold ${formData.bio ? 'text-emerald-400' : 'text-slate-500'}`}>
                {formData.bio ? <CheckCircle size={12} /> : <Plus size={12} />} Add Bio
              </li>
              <li className={`flex items-center gap-2 text-[10.5px] font-bold ${formData.headline ? 'text-emerald-400' : 'text-slate-500'}`}>
                {formData.headline ? <CheckCircle size={12} /> : <Plus size={12} />} Add Headline
              </li>
              <li className={`flex items-center gap-2 text-[10.5px] font-bold ${formData.location ? 'text-emerald-400' : 'text-slate-500'}`}>
                {formData.location ? <CheckCircle size={12} /> : <Plus size={12} />} Add Location
              </li>
              <li className={`flex items-center gap-2 text-[10.5px] font-bold ${formData.specialty ? 'text-emerald-400' : 'text-slate-500'}`}>
                {formData.specialty ? <CheckCircle size={12} /> : <Plus size={12} />} Add Specialties
              </li>
            </ul>
          </motion.div>
        </motion.div>

        {/* Right Column - Forms */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } } }}
          className="lg:col-span-2 space-y-6"
        >
          <motion.div variants={fadeUpItem} className="bg-[#0d1017]/95 backdrop-blur-xl p-7 rounded-3xl border border-white/[0.08] shadow-2xl">
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
                  placeholder="e.g. Priya Sharma"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">Years of Experience</label>
                <input
                  type="text"
                  value={formData.experience}
                  onChange={e => setFormData({ ...formData, experience: e.target.value })}
                  className="w-full bg-[#131620] border border-white/10 focus:border-emerald-500 focus:bg-[#181d2a] px-4 py-3 rounded-xl outline-none transition-all font-semibold text-white shadow-inner text-xs"
                  placeholder="e.g. 3+ Years"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">Professional Headline</label>
                <input
                  type="text"
                  value={formData.headline}
                  onChange={e => setFormData({ ...formData, headline: e.target.value })}
                  className="w-full bg-[#131620] border border-white/10 focus:border-emerald-500 focus:bg-[#181d2a] px-4 py-3 rounded-xl outline-none transition-all font-semibold text-white shadow-inner text-xs"
                  placeholder="e.g. AI Video Editor & Motion Designer"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                  className="w-full bg-[#131620] border border-white/10 focus:border-emerald-500 focus:bg-[#181d2a] px-4 py-3 rounded-xl outline-none transition-all font-semibold text-white shadow-inner text-xs"
                  placeholder="e.g. Noida, India"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">Desired Roles / Specialties</label>
                <input
                  type="text"
                  value={formData.specialty}
                  onChange={e => setFormData({ ...formData, specialty: e.target.value })}
                  className="w-full bg-[#131620] border border-white/10 focus:border-emerald-500 focus:bg-[#181d2a] px-4 py-3 rounded-xl outline-none transition-all font-semibold text-white shadow-inner text-xs"
                  placeholder="e.g. Video Editing, Content Design, Social Media"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">Professional Bio</label>
                <textarea
                  rows={5}
                  value={formData.bio}
                  onChange={e => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full bg-[#131620] border border-white/10 focus:border-emerald-500 focus:bg-[#181d2a] px-4 py-3 rounded-2xl outline-none transition-all font-medium text-white shadow-inner leading-relaxed text-xs"
                  placeholder="Tell employers about your background, what you're looking for, and what makes you a great hire..."
                />
              </div>
            </div>
          </motion.div>

          {/* Verified Badges (real, from Progression / Exams) */}
          <motion.div variants={fadeUpItem} className="bg-[#0d1017]/95 backdrop-blur-xl p-7 rounded-3xl border border-white/[0.08] shadow-2xl">
            <h3 className="text-xl font-black text-white mb-2 flex items-center gap-2.5">
              <Award className="text-emerald-400" size={20} /> Verified Badges
            </h3>
            <p className="text-xs text-slate-400 font-medium mb-6">
              Automatically pulled from your Progression tab — these show up on your public profile too.
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
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
