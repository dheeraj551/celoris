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
    <div className="p-8 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' as const }}
        className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 mb-10"
      >
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Candidate Profile</h1>
          <p className="text-slate-500 mt-1 font-medium">Build your candidate profile and share it as a public resume</p>
        </div>
        <motion.button
          onClick={handleSave}
          disabled={loading}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.97 }}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-2xl font-bold text-sm transition-all shadow-xl shadow-emerald-500/20 flex items-center gap-2 group disabled:opacity-50"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
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
          className="lg:col-span-1 space-y-8"
        >
          <motion.div variants={fadeUpItem} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col items-center text-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-emerald-50 to-teal-50 -z-0" />

            <div className="relative mt-4">
              <div className="w-32 h-32 rounded-[2rem] bg-emerald-100 border-4 border-white shadow-lg overflow-hidden flex items-center justify-center">
                {profile?.avatar_url || profile?.profile_pic_url ? (
                  <img src={profile.avatar_url || profile.profile_pic_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User size={48} className="text-emerald-500" />
                )}
              </div>
              <button
                onClick={handleAvatarUpload}
                className="absolute -bottom-2 -right-2 bg-emerald-600 p-3 rounded-2xl text-white shadow-lg hover:scale-110 transition-transform cursor-pointer"
              >
                <Camera size={18} />
              </button>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" />
            </div>

            <div className="mt-8 relative w-full">
              <h3 className="text-xl font-black text-slate-900 leading-tight">{formData.full_name || 'Your Name'}</h3>
              <p className={`text-emerald-600 font-black text-[11px] uppercase tracking-[0.15em] mt-1 italic ${!formData.headline && 'opacity-30'}`}>
                {formData.headline || 'Add a professional headline'}
              </p>

              <div className="mt-6 pt-6 border-t border-slate-50 flex flex-col gap-4 text-left">
                <div className="flex items-center gap-3 text-slate-500">
                  <Mail size={16} className="text-emerald-500" />
                  <span className="text-sm font-bold line-clamp-1">{user?.email}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-500">
                  <MapPin size={16} className="text-emerald-500" />
                  <span className={`text-sm font-bold ${!formData.location && 'opacity-30'}`}>{formData.location || 'Location Not Set'}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Share as Public Candidate Resume */}
          <motion.div variants={fadeUpItem} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 space-y-5">
            <h4 className="font-black text-sm text-slate-900 uppercase tracking-widest italic flex items-center gap-2">
              <Share2 className="text-emerald-600" size={18} /> Share Your Profile
            </h4>

            <button
              type="button"
              onClick={() => setFormData({ ...formData, isPublic: !formData.isPublic })}
              className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${formData.isPublic ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}
            >
              <span className="flex items-center gap-2 text-xs font-bold text-slate-700">
                {formData.isPublic ? <Eye size={16} className="text-emerald-600" /> : <EyeOff size={16} className="text-slate-400" />}
                {formData.isPublic ? 'Public — anyone with the link can view' : 'Private — only visible to you'}
              </span>
              <div className={`relative w-10 h-5 rounded-full transition-colors ${formData.isPublic ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${formData.isPublic ? 'translate-x-5' : 'translate-x-0'}`} />
              </div>
            </button>

            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
              <LinkIcon size={14} className="text-slate-400 flex-shrink-0" />
              <span className="text-xs font-mono text-slate-600 truncate flex-1">{profileUrl || 'Sign in to get your link'}</span>
            </div>

            <button
              type="button"
              onClick={handleCopyLink}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all"
            >
              <Copy size={14} /> {copied ? 'Copied!' : 'Copy Link'}
            </button>

            <a
              href={profileUrl || undefined}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 text-slate-700 text-xs font-bold transition-all"
            >
              <ExternalLink size={14} /> View Public Profile
            </a>
          </motion.div>

          <motion.div variants={fadeUpItem} className="bg-emerald-900 p-8 rounded-[2.5rem] text-white shadow-xl shadow-emerald-900/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16" />
            <h4 className="font-black text-xs uppercase tracking-widest text-emerald-400 mb-6 italic">Profile Strength</h4>
            <div className="flex justify-between items-end mb-2">
              <span className="text-3xl font-black tracking-tighter italic">{strength}%</span>
              <span className="text-xs font-bold text-emerald-300">
                {strength < 50 ? 'Getting started' : strength < 80 ? 'Good!' : 'Great!'}
              </span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-8">
              <div
                className="h-full bg-emerald-400 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.5)] transition-all duration-500"
                style={{ width: `${strength}%` }}
              />
            </div>
            <ul className="space-y-3">
              <li className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest ${formData.bio ? 'text-emerald-400' : 'opacity-60'}`}>
                {formData.bio ? <CheckCircle size={12} /> : <Plus size={12} />} Add Bio
              </li>
              <li className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest ${formData.headline ? 'text-emerald-400' : 'opacity-60'}`}>
                {formData.headline ? <CheckCircle size={12} /> : <Plus size={12} />} Add Headline
              </li>
              <li className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest ${formData.location ? 'text-emerald-400' : 'opacity-60'}`}>
                {formData.location ? <CheckCircle size={12} /> : <Plus size={12} />} Add Location
              </li>
              <li className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest ${formData.specialty ? 'text-emerald-400' : 'opacity-60'}`}>
                {formData.specialty ? <CheckCircle size={12} /> : <Plus size={12} className="animate-pulse" />} Add Specialties
              </li>
            </ul>
          </motion.div>
        </motion.div>

        {/* Right Column - Forms */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } } }}
          className="lg:col-span-2 space-y-8"
        >
          <motion.div variants={fadeUpItem} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50">
            <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3 italic">
              <Pencil className="text-emerald-600" size={24} /> Basic Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Display Name</label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full bg-slate-50 border border-transparent focus:border-emerald-500/50 focus:bg-white px-6 py-4 rounded-2xl outline-none transition-all font-bold text-slate-900 shadow-inner"
                  placeholder="e.g. Priya Sharma"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Years of Experience</label>
                <input
                  type="text"
                  value={formData.experience}
                  onChange={e => setFormData({ ...formData, experience: e.target.value })}
                  className="w-full bg-slate-50 border border-transparent focus:border-emerald-500/50 focus:bg-white px-6 py-4 rounded-2xl outline-none transition-all font-bold text-slate-900 shadow-inner"
                  placeholder="e.g. 3+ Years"
                />
              </div>
              <div className="md:col-span-2 space-y-3">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Professional Headline</label>
                <input
                  type="text"
                  value={formData.headline}
                  onChange={e => setFormData({ ...formData, headline: e.target.value })}
                  className="w-full bg-slate-50 border border-transparent focus:border-emerald-500/50 focus:bg-white px-6 py-4 rounded-2xl outline-none transition-all font-bold text-slate-900 shadow-inner"
                  placeholder="e.g. AI Video Editor & Motion Designer"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                  className="w-full bg-slate-50 border border-transparent focus:border-emerald-500/50 focus:bg-white px-6 py-4 rounded-2xl outline-none transition-all font-bold text-slate-900 shadow-inner"
                  placeholder="e.g. Noida, India"
                />
              </div>
              <div className="md:col-span-2 space-y-3">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Desired Roles / Specialties</label>
                <input
                  type="text"
                  value={formData.specialty}
                  onChange={e => setFormData({ ...formData, specialty: e.target.value })}
                  className="w-full bg-slate-50 border border-transparent focus:border-emerald-500/50 focus:bg-white px-6 py-4 rounded-2xl outline-none transition-all font-bold text-slate-900 shadow-inner"
                  placeholder="e.g. Video Editing, Content Design, Social Media"
                />
              </div>
              <div className="md:col-span-2 space-y-3">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Professional Bio</label>
                <textarea
                  rows={6}
                  value={formData.bio}
                  onChange={e => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full bg-slate-50 border border-transparent focus:border-emerald-500/50 focus:bg-white px-8 py-6 rounded-[2rem] outline-none transition-all font-bold text-slate-900 shadow-inner leading-relaxed"
                  placeholder="Tell employers about your background, what you're looking for, and what makes you a great hire..."
                />
              </div>
            </div>
          </motion.div>

          {/* Verified Badges (real, from Progression / Exams) */}
          <motion.div variants={fadeUpItem} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50">
            <h3 className="text-2xl font-black text-slate-900 mb-2 flex items-center gap-3 italic">
              <Award className="text-emerald-600" size={24} /> Verified Badges
            </h3>
            <p className="text-xs text-slate-500 font-medium mb-8">
              Automatically pulled from your Progression tab — these show up on your public profile too.
            </p>

            {badges.length === 0 ? (
              <p className="text-sm text-slate-400 font-medium text-center py-4">
                No verified badges yet. Earn one from the Exams tab.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {badges.map((badge) => (
                  <div key={badge.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white flex-shrink-0 bg-emerald-600">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-slate-900 truncate">{badge.badgeTitle}</p>
                      <p className="text-xs text-slate-500 truncate">{badge.skillName} • {badge.verificationHash}</p>
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
