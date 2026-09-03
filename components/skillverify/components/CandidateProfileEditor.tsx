/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Mail, Globe, MapPin, Camera, Save, Pencil, Trash2, Plus, X,
  ExternalLink, Linkedin, Twitter, Youtube, CheckCircle, Briefcase,
  GraduationCap, Sparkles, Share2, Copy, Link as LinkIcon,
  Eye, EyeOff, ShieldCheck, Award,
} from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import { createClient } from '@/lib/supabase-client';

const fadeUpItem = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

const chipVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, scale: 0.8, transition: { duration: 0.15 } },
};

const entryCardVariants = {
  hidden: { opacity: 0, height: 0, y: -8 },
  visible: { opacity: 1, height: 'auto', y: 0, transition: { duration: 0.3, ease: 'easeOut' as const } },
  exit: { opacity: 0, height: 0, y: -8, transition: { duration: 0.2, ease: 'easeIn' as const } },
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

interface CandidateBadge {
  id: string;
  badgeTitle: string;
  skillName: string;
  verificationHash: string;
}

const emptyExperience = (): ExperienceEntry => ({
  id: `exp_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
  title: '',
  organization: '',
  duration: '',
  description: '',
});

const emptyEducation = (): EducationEntry => ({
  id: `edu_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
  degree: '',
  institution: '',
  year: '',
});

export function CandidateProfileEditor() {
  const { user, profile, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [languageInput, setLanguageInput] = useState('');
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
    const totalFields = 10;
    if (profile?.avatar_url || profile?.profile_pic_url) score += 1;
    if (formData.full_name) score += 1;
    if (formData.headline) score += 1;
    if (formData.bio) score += 1;
    if (formData.specialty) score += 1;
    if (formData.location) score += 1;
    if (formData.skills.length > 0) score += 1;
    if (formData.experienceEntries.length > 0) score += 1;
    if (formData.educationEntries.length > 0) score += 1;
    if (formData.linkedin || formData.twitter || formData.youtube || formData.website) score += 1;
    return Math.round((score / totalFields) * 100);
  };

  const strength = calculateStrength();
  const profileUrl = user?.id ? `${typeof window !== 'undefined' ? window.location.origin : ''}/job-center/candidates/${user.id}` : '';

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

  const addSkill = () => {
    const val = skillInput.trim();
    if (!val || formData.skills.includes(val)) return;
    setFormData({ ...formData, skills: [...formData.skills, val] });
    setSkillInput('');
  };

  const removeSkill = (skill: string) => {
    setFormData({ ...formData, skills: formData.skills.filter((s) => s !== skill) });
  };

  const addLanguage = () => {
    const val = languageInput.trim();
    if (!val || formData.languages.includes(val)) return;
    setFormData({ ...formData, languages: [...formData.languages, val] });
    setLanguageInput('');
  };

  const removeLanguage = (lang: string) => {
    setFormData({ ...formData, languages: formData.languages.filter((l) => l !== lang) });
  };

  const addExperience = () => {
    setFormData({ ...formData, experienceEntries: [...formData.experienceEntries, emptyExperience()] });
  };

  const updateExperience = (id: string, field: keyof ExperienceEntry, value: string) => {
    setFormData({
      ...formData,
      experienceEntries: formData.experienceEntries.map((e) => (e.id === id ? { ...e, [field]: value } : e)),
    });
  };

  const removeExperience = (id: string) => {
    setFormData({ ...formData, experienceEntries: formData.experienceEntries.filter((e) => e.id !== id) });
  };

  const addEducation = () => {
    setFormData({ ...formData, educationEntries: [...formData.educationEntries, emptyEducation()] });
  };

  const updateEducation = (id: string, field: keyof EducationEntry, value: string) => {
    setFormData({
      ...formData,
      educationEntries: formData.educationEntries.map((e) => (e.id === id ? { ...e, [field]: value } : e)),
    });
  };

  const removeEducation = (id: string) => {
    setFormData({ ...formData, educationEntries: formData.educationEntries.filter((e) => e.id !== id) });
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
                <div className="flex items-center gap-3 text-slate-500">
                  <Globe size={16} className="text-emerald-500" />
                  <span className={`text-sm font-bold truncate ${!formData.website && 'opacity-30'}`}>{formData.website || 'No Portfolio/Website'}</span>
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
              <li className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest ${formData.skills.length > 0 ? 'text-emerald-400' : 'opacity-60'}`}>
                {formData.skills.length > 0 ? <CheckCircle size={12} /> : <Plus size={12} />} Add Skills
              </li>
              <li className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest ${formData.experienceEntries.length > 0 ? 'text-emerald-400' : 'opacity-60'}`}>
                {formData.experienceEntries.length > 0 ? <CheckCircle size={12} /> : <Plus size={12} />} Add Work Experience
              </li>
              <li className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest ${formData.linkedin || formData.twitter || formData.youtube ? 'text-emerald-400' : 'opacity-60'}`}>
                {formData.linkedin || formData.twitter || formData.youtube ? <CheckCircle size={12} /> : <Plus size={12} className="animate-pulse" />} Add Socials
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
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Website / Portfolio</label>
                <input
                  type="text"
                  value={formData.website}
                  onChange={e => setFormData({ ...formData, website: e.target.value })}
                  className="w-full bg-slate-50 border border-transparent focus:border-emerald-500/50 focus:bg-white px-6 py-4 rounded-2xl outline-none transition-all font-bold text-slate-900 shadow-inner"
                  placeholder="e.g. https://your-portfolio.com"
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

          {/* Skills & Languages */}
          <motion.div variants={fadeUpItem} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50">
            <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3 italic">
              <Sparkles className="text-emerald-600" size={24} /> Skills & Languages
            </h3>

            <div className="space-y-3 mb-8">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Skills</label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={skillInput}
                  onChange={e => setSkillInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
                  className="flex-1 bg-slate-50 border border-transparent focus:border-emerald-500/50 focus:bg-white px-6 py-4 rounded-2xl outline-none transition-all font-bold text-slate-900 shadow-inner"
                  placeholder="e.g. Premiere Pro, After Effects, Storytelling"
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="px-6 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-all"
                >
                  Add
                </button>
              </div>
              {formData.skills.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  <AnimatePresence>
                    {formData.skills.map((skill) => (
                      <motion.span
                        key={skill}
                        layout
                        variants={chipVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-full text-xs font-bold"
                      >
                        {skill}
                        <button type="button" onClick={() => removeSkill(skill)} className="hover:text-emerald-950">
                          <X size={12} />
                        </button>
                      </motion.span>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Languages Spoken</label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={languageInput}
                  onChange={e => setLanguageInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addLanguage(); } }}
                  className="flex-1 bg-slate-50 border border-transparent focus:border-emerald-500/50 focus:bg-white px-6 py-4 rounded-2xl outline-none transition-all font-bold text-slate-900 shadow-inner"
                  placeholder="e.g. English, Hindi"
                />
                <button
                  type="button"
                  onClick={addLanguage}
                  className="px-6 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-all"
                >
                  Add
                </button>
              </div>
              {formData.languages.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  <AnimatePresence>
                    {formData.languages.map((lang) => (
                      <motion.span
                        key={lang}
                        layout
                        variants={chipVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 border border-slate-200 px-3 py-1.5 rounded-full text-xs font-bold"
                      >
                        {lang}
                        <button type="button" onClick={() => removeLanguage(lang)} className="hover:text-slate-950">
                          <X size={12} />
                        </button>
                      </motion.span>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.div>

          {/* Work Experience */}
          <motion.div variants={fadeUpItem} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3 italic">
                <Briefcase className="text-emerald-600" size={24} /> Work Experience
              </h3>
              <motion.button
                type="button"
                onClick={addExperience}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-bold transition-all"
              >
                <Plus size={14} /> Add Entry
              </motion.button>
            </div>

            {formData.experienceEntries.length === 0 ? (
              <p className="text-sm text-slate-400 font-medium text-center py-8">No experience added yet. Add your work history.</p>
            ) : (
              <div className="space-y-6">
                <AnimatePresence initial={false}>
                  {formData.experienceEntries.map((entry) => (
                    <motion.div
                      key={entry.id}
                      layout
                      variants={entryCardVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="p-6 rounded-[1.75rem] bg-slate-50 border border-slate-100 space-y-4 relative overflow-hidden"
                    >
                      <button
                        type="button"
                        onClick={() => removeExperience(entry.id)}
                        className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-8">
                        <input
                          type="text"
                          value={entry.title}
                          onChange={e => updateExperience(entry.id, 'title', e.target.value)}
                          placeholder="Role / Title (e.g. Video Editor)"
                          className="bg-white px-5 py-3.5 rounded-xl border border-slate-200 focus:border-emerald-500/50 outline-none font-bold text-sm text-slate-900"
                        />
                        <input
                          type="text"
                          value={entry.organization}
                          onChange={e => updateExperience(entry.id, 'organization', e.target.value)}
                          placeholder="Organization"
                          className="bg-white px-5 py-3.5 rounded-xl border border-slate-200 focus:border-emerald-500/50 outline-none font-bold text-sm text-slate-900"
                        />
                      </div>
                      <input
                        type="text"
                        value={entry.duration}
                        onChange={e => updateExperience(entry.id, 'duration', e.target.value)}
                        placeholder="Duration (e.g. 2023 - Present)"
                        className="w-full bg-white px-5 py-3.5 rounded-xl border border-slate-200 focus:border-emerald-500/50 outline-none font-bold text-sm text-slate-900"
                      />
                      <textarea
                        rows={3}
                        value={entry.description}
                        onChange={e => updateExperience(entry.id, 'description', e.target.value)}
                        placeholder="What did you work on?"
                        className="w-full bg-white px-5 py-3.5 rounded-xl border border-slate-200 focus:border-emerald-500/50 outline-none font-medium text-sm text-slate-700 leading-relaxed"
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>

          {/* Education */}
          <motion.div variants={fadeUpItem} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3 italic">
                <GraduationCap className="text-emerald-600" size={24} /> Education
              </h3>
              <motion.button
                type="button"
                onClick={addEducation}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-bold transition-all"
              >
                <Plus size={14} /> Add Entry
              </motion.button>
            </div>

            {formData.educationEntries.length === 0 ? (
              <p className="text-sm text-slate-400 font-medium text-center py-8">No education added yet.</p>
            ) : (
              <div className="space-y-4">
                <AnimatePresence initial={false}>
                  {formData.educationEntries.map((entry) => (
                    <motion.div
                      key={entry.id}
                      layout
                      variants={entryCardVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="p-6 rounded-[1.75rem] bg-slate-50 border border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-4 relative overflow-hidden"
                    >
                      <button
                        type="button"
                        onClick={() => removeEducation(entry.id)}
                        className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors md:hidden"
                      >
                        <Trash2 size={16} />
                      </button>
                      <input
                        type="text"
                        value={entry.degree}
                        onChange={e => updateEducation(entry.id, 'degree', e.target.value)}
                        placeholder="Degree / Certification"
                        className="bg-white px-5 py-3.5 rounded-xl border border-slate-200 focus:border-emerald-500/50 outline-none font-bold text-sm text-slate-900"
                      />
                      <input
                        type="text"
                        value={entry.institution}
                        onChange={e => updateEducation(entry.id, 'institution', e.target.value)}
                        placeholder="Institution"
                        className="bg-white px-5 py-3.5 rounded-xl border border-slate-200 focus:border-emerald-500/50 outline-none font-bold text-sm text-slate-900"
                      />
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={entry.year}
                          onChange={e => updateEducation(entry.id, 'year', e.target.value)}
                          placeholder="Year"
                          className="flex-1 bg-white px-5 py-3.5 rounded-xl border border-slate-200 focus:border-emerald-500/50 outline-none font-bold text-sm text-slate-900"
                        />
                        <button
                          type="button"
                          onClick={() => removeEducation(entry.id)}
                          className="hidden md:flex items-center justify-center w-12 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
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

          <motion.div variants={fadeUpItem} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3 italic">
                <ExternalLink className="text-emerald-600" size={24} /> Social Connectivity
              </h3>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Connect with Employers</span>
            </div>

            <div className="space-y-6">
              <div className="group relative">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <Linkedin size={20} />
                </div>
                <input
                  type="text"
                  placeholder="LinkedIn URL"
                  value={formData.linkedin}
                  onChange={e => setFormData({ ...formData, linkedin: e.target.value })}
                  className="w-full bg-slate-50 pl-20 pr-6 py-5 rounded-[1.5rem] border border-transparent focus:border-blue-500/50 focus:bg-white transition-all font-bold shadow-inner"
                />
              </div>

              <div className="group relative">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 p-2 bg-slate-900 text-white rounded-xl">
                  <Twitter size={20} />
                </div>
                <input
                  type="text"
                  placeholder="Twitter URL"
                  value={formData.twitter}
                  onChange={e => setFormData({ ...formData, twitter: e.target.value })}
                  className="w-full bg-slate-50 pl-20 pr-6 py-5 rounded-[1.5rem] border border-transparent focus:border-slate-900/50 focus:bg-white transition-all font-bold shadow-inner"
                />
              </div>

              <div className="group relative">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 p-2 bg-red-50 text-red-600 rounded-xl">
                  <Youtube size={20} />
                </div>
                <input
                  type="text"
                  placeholder="YouTube / Portfolio Reel"
                  value={formData.youtube}
                  onChange={e => setFormData({ ...formData, youtube: e.target.value })}
                  className="w-full bg-slate-50 pl-20 pr-6 py-5 rounded-[1.5rem] border border-transparent focus:border-red-500/50 focus:bg-white transition-all font-bold shadow-inner"
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
