import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Mail, MapPin, Camera, Save, Pencil, Trash2, Plus, X,
  ExternalLink, CheckCircle,
  Share2, Copy, Link as LinkIcon, Download,
  Eye, EyeOff, ShieldCheck, Award,
} from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import { createClient } from '@/lib/supabase-client';
import { INITIAL_TRAINER_PROGRESS } from '../../data/trainerProgressionData';

const fadeUpItem = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

// Builds the human-readable slug used in the public profile URL/QR code
// (e.g. "prabha-singh-f93e9a8f") from the trainer's current display name
// plus a short id suffix, so it stays unique even between trainers who
// share a name. Recomputed on every save from the current name, so the
// link updates if the trainer renames themselves later.
function buildTrainerSlug(fullName: string, id: string): string {
  // Strip combining diacritical marks (U+0300-U+036F) left behind by
  // NFKD normalization, e.g. turning an accented letter into a plain one.
  const base = (fullName || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'trainer';
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

export function TrainerProfile() {
  const { user, profile, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [resumeLoaded, setResumeLoaded] = useState(false);
  const [deletionLoading, setDeletionLoading] = useState(false);
  const [deletionRequested, setDeletionRequested] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  // Form State
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    headline: '',
    bio: profile?.description || profile?.bio || '',
    expertise: profile?.specialty || '',
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
    isPublic: true,
  });

  // Load the trainer resume record (if one already exists) on mount.
  // NOTE: the form stays hidden (see `resumeLoaded` below) until this finishes,
  // so nothing the trainer types can ever get silently overwritten by this fetch.
  useEffect(() => {
    if (!user?.id) return;
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from('trainer_resumes')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (cancelled) return;

      if (data) {
        setFormData((prev) => ({
          ...prev,
          headline: data.headline || '',
          bio: data.bio || prev.bio,
          expertise: data.specialty || prev.expertise,
          experience: data.experience_years || prev.experience,
          location: data.location || prev.location,
          website: data.website || prev.website,
          linkedin: data.linkedin || prev.linkedin,
          twitter: data.twitter || prev.twitter,
          youtube: data.youtube || prev.youtube,
          skills: data.skills || [],
          languages: data.languages || [],
          experienceEntries: Array.isArray(data.experience) ? data.experience : [],
          educationEntries: Array.isArray(data.education) ? data.education : [],
          isPublic: data.is_public ?? true,
        }));
      }
      setResumeLoaded(true);
    })();
    return () => { cancelled = true; };
  }, [user?.id]);

  // `profile` loads asynchronously from AuthProvider, after this component's
  // initial render — so the `profile?.full_name || ''` used to seed formData
  // above usually sees a still-empty profile and locks in ''. Sync it in once
  // the real profile arrives, but never stomp a name the trainer already typed.
  useEffect(() => {
    const syncedName = profile?.full_name || (user?.user_metadata as any)?.full_name || (user?.user_metadata as any)?.name;
    if (!syncedName) return;
    setFormData((prev) => (prev.full_name ? prev : { ...prev, full_name: syncedName }));
  }, [profile?.full_name, user?.user_metadata]);

  const calculateStrength = () => {
    let score = 0;
    const totalFields = 7;
    if (profile?.avatar_url || profile?.profile_pic_url) score += 1;
    if (formData.full_name) score += 1;
    if (formData.headline) score += 1;
    if (formData.bio) score += 1;
    if (formData.expertise) score += 1;
    if (formData.experience) score += 1;
    if (formData.location) score += 1;
    return Math.round((score / totalFields) * 100);
  };

  const strength = calculateStrength();
  // Live preview of the slug that will be saved — matches what handleSave
  // below actually writes, so this always reflects the name currently in
  // the form even before the trainer hits Save.
  const resumeUrl = user?.id
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/teach/trainers/${buildTrainerSlug(formData.full_name, user.id)}`
    : '';

  const handleSave = async () => {
    setLoading(true);
    setSuccess(false);
    try {
      // Name lives primarily on the shared `users` table (what AuthProvider
      // and the public trainer page fall back to). A `profiles` row, when one
      // exists for this trainer, takes precedence for shared fields, so keep
      // it in sync too — but only if that row already exists. Supabase's
      // .update() matches zero rows silently (no error) when there's no
      // profiles row, which previously meant the name update to `users`
      // never ran at all, leaving the trainer's name permanently blank.
      const { error: usersError } = await supabase
        .from('users')
        .update({ full_name: formData.full_name })
        .eq('id', user?.id);

      if (usersError) console.error('Error updating users.full_name:', usersError);

      const { data: existingProfileRow } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user?.id)
        .maybeSingle();

      if (existingProfileRow) {
        await supabase
          .from('profiles')
          .update({ full_name: formData.full_name })
          .eq('id', user?.id);
      }

      // Everything resume-specific lives in its own dedicated table
      const { error: resumeError } = await supabase
        .from('trainer_resumes')
        .upsert({
          id: user?.id,
          slug: user?.id ? buildTrainerSlug(formData.full_name, user.id) : undefined,
          headline: formData.headline,
          bio: formData.bio,
          specialty: formData.expertise,
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

      if (resumeError) throw resumeError;

      await refreshProfile();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Error updating profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = () => {
    fileInputRef.current?.click();
  };

  const handleCopyLink = () => {
    if (!resumeUrl) return;
    navigator.clipboard.writeText(resumeUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRequestDeletion = async () => {
    if (!user?.email) return;
    const confirmed = window.confirm(
      'Are you sure you want to request deletion of your trainer profile? Our team will reach out to confirm before anything is removed.'
    );
    if (!confirmed) return;

    setDeletionLoading(true);
    try {
      const response = await fetch('/api/trainer/request-deletion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.full_name,
          email: user.email,
          userId: user.id,
        }),
      });

      if (!response.ok) throw new Error('Failed to send deletion request');

      setDeletionRequested(true);
      setTimeout(() => setDeletionRequested(false), 5000);
    } catch (err) {
      console.error('Error requesting profile deletion:', err);
      alert('Something went wrong sending your deletion request. Please try again later.');
    } finally {
      setDeletionLoading(false);
    }
  };

  if (!resumeLoaded) {
    return (
      <div className="p-8 max-w-5xl mx-auto flex flex-col items-center justify-center py-32 gap-3 text-gray-400">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-emerald-500 rounded-full animate-spin" />
        <p className="text-sm font-medium">Loading your resume...</p>
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
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Resume Builder</h1>
          <p className="text-gray-500 mt-1 font-medium">Build your trainer resume and share it as a public profile</p>
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
          <motion.div variants={fadeUpItem} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/50 flex flex-col items-center text-center relative overflow-hidden group">
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
              <input
                type="text"
                value={formData.full_name}
                onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                placeholder="Add Your Name"
                className="text-xl font-black text-gray-900 leading-tight bg-transparent border-none outline-none w-full text-center rounded-lg px-1 -mx-1 placeholder:text-gray-300 placeholder:font-black focus:ring-2 focus:ring-emerald-100"
              />
              <p className={`text-emerald-600 font-black text-[11px] uppercase tracking-[0.15em] mt-1 italic ${!formData.headline && 'opacity-30'}`}>
                {formData.headline || 'Add a professional headline'}
              </p>

              <div className="mt-6 pt-6 border-t border-gray-50 flex flex-col gap-4 text-left">
                <div className="flex items-center gap-3 text-gray-500">
                  <Mail size={16} className="text-emerald-500" />
                  <span className="text-sm font-bold line-clamp-1">{user?.email}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-500">
                  <MapPin size={16} className="text-emerald-500" />
                  <span className={`text-sm font-bold ${!formData.location && 'opacity-30'}`}>{formData.location || 'Location Not Set'}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Share as Online Resume */}
          <motion.div variants={fadeUpItem} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/50 space-y-5">
            <h4 className="font-black text-sm text-gray-900 uppercase tracking-widest italic flex items-center gap-2">
              <Share2 className="text-emerald-600" size={18} /> Share Your Resume
            </h4>

            <button
              type="button"
              onClick={() => setFormData({ ...formData, isPublic: !formData.isPublic })}
              className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${formData.isPublic ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-50 border-gray-200'}`}
            >
              <span className="flex items-center gap-2 text-xs font-bold text-gray-700">
                {formData.isPublic ? <Eye size={16} className="text-emerald-600" /> : <EyeOff size={16} className="text-gray-400" />}
                {formData.isPublic ? 'Public — anyone with the link can view' : 'Private — only visible to you'}
              </span>
              <div className={`relative w-10 h-5 rounded-full transition-colors ${formData.isPublic ? 'bg-emerald-500' : 'bg-gray-300'}`}>
                <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${formData.isPublic ? 'translate-x-5' : 'translate-x-0'}`} />
              </div>
            </button>

            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
              <LinkIcon size={14} className="text-gray-400 flex-shrink-0" />
              <span className="text-xs font-mono text-gray-600 truncate flex-1">{resumeUrl || 'Sign in to get your link'}</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleCopyLink}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold transition-all"
              >
                <Copy size={14} /> {copied ? 'Copied!' : 'Copy Link'}
              </button>
              <a
                href={resumeUrl ? `${resumeUrl}?print=1` : undefined}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all"
              >
                <Download size={14} /> Download PDF
              </a>
            </div>

            <a
              href={resumeUrl || undefined}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 text-gray-700 text-xs font-bold transition-all"
            >
              <ExternalLink size={14} /> View Public Resume
            </a>
          </motion.div>

          <motion.div variants={fadeUpItem} className="bg-emerald-900 p-8 rounded-[2.5rem] text-white shadow-xl shadow-emerald-900/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16" />
            <h4 className="font-black text-xs uppercase tracking-widest text-emerald-400 mb-6 italic">Resume Strength</h4>
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
              <li className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest ${formData.expertise ? 'text-emerald-400' : 'opacity-60'}`}>
                {formData.expertise ? <CheckCircle size={12} /> : <Plus size={12} className="animate-pulse" />} Add Specialties
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
          <motion.div variants={fadeUpItem} className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/50">
            <h3 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3 italic">
              <Pencil className="text-emerald-600" size={24} /> Basic Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Years of Experience</label>
                <input
                  type="text"
                  value={formData.experience}
                  onChange={e => setFormData({ ...formData, experience: e.target.value })}
                  className="w-full bg-gray-50 border border-transparent focus:border-emerald-500/50 focus:bg-white px-6 py-4 rounded-2xl outline-none transition-all font-bold text-gray-900 shadow-inner"
                  placeholder="e.g. 5+ Years"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                  className="w-full bg-gray-50 border border-transparent focus:border-emerald-500/50 focus:bg-white px-6 py-4 rounded-2xl outline-none transition-all font-bold text-gray-900 shadow-inner"
                  placeholder="e.g. Mumbai, India"
                />
              </div>
              <div className="md:col-span-2 space-y-3">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Professional Headline</label>
                <input
                  type="text"
                  value={formData.headline}
                  onChange={e => setFormData({ ...formData, headline: e.target.value })}
                  className="w-full bg-gray-50 border border-transparent focus:border-emerald-500/50 focus:bg-white px-6 py-4 rounded-2xl outline-none transition-all font-bold text-gray-900 shadow-inner"
                  placeholder="e.g. Advanced Excel & Data Analytics Trainer"
                />
              </div>
              <div className="md:col-span-2 space-y-3">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Specialties (Expertise)</label>
                <input
                  type="text"
                  value={formData.expertise}
                  onChange={e => setFormData({ ...formData, expertise: e.target.value })}
                  className="w-full bg-gray-50 border border-transparent focus:border-emerald-500/50 focus:bg-white px-6 py-4 rounded-2xl outline-none transition-all font-bold text-gray-900 shadow-inner"
                  placeholder="e.g. Creative Direction, UI/UX Design"
                />
              </div>
              <div className="md:col-span-2 space-y-3">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Professional Bio</label>
                <textarea
                  rows={6}
                  value={formData.bio}
                  onChange={e => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full bg-gray-50 border border-transparent focus:border-emerald-500/50 focus:bg-white px-8 py-6 rounded-[2rem] outline-none transition-all font-bold text-gray-900 shadow-inner leading-relaxed"
                  placeholder="Tell students about your background, teaching style, and passion..."
                />
              </div>
            </div>
          </motion.div>

          {/* Verified Certifications (from Progression) */}
          <motion.div variants={fadeUpItem} className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/50">
            <h3 className="text-2xl font-black text-gray-900 mb-2 flex items-center gap-3 italic">
              <Award className="text-emerald-600" size={24} /> Verified Certifications
            </h3>
            <p className="text-xs text-gray-500 font-medium mb-8">
              Automatically pulled from your Progression badges — these show up on your public resume too.
            </p>

            {INITIAL_TRAINER_PROGRESS.badges.length === 0 ? (
              <p className="text-sm text-gray-400 font-medium text-center py-4">
                No verified badges yet. Earn one from the Progression tab.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {INITIAL_TRAINER_PROGRESS.badges.map((badge) => (
                  <div key={badge.id} className="p-5 rounded-2xl bg-gray-50 border border-gray-200 flex items-center gap-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white flex-shrink-0"
                      style={{ backgroundColor: badge.badgeColor }}
                    >
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-gray-900 truncate">{badge.badgeTitle}</p>
                      <p className="text-xs text-gray-500 truncate">{badge.subject} • {badge.verificationHash}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div variants={fadeUpItem} className="bg-red-50 p-8 rounded-[2.5rem] border border-red-100 flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 text-red-600 rounded-[1.25rem] group-hover:bg-red-600 group-hover:text-white transition-all">
                <Trash2 size={24} />
              </div>
              <div>
                <h4 className="font-black text-red-900 uppercase tracking-tight italic">Deactivate Profile</h4>
                <p className="text-red-600 text-[10px] font-bold uppercase tracking-widest opacity-80">This will hide your profile from learners</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRequestDeletion}
              disabled={deletionLoading}
              className="bg-white border border-red-200 text-red-600 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white hover:border-red-600 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {deletionLoading ? 'Sending...' : deletionRequested ? 'Request Sent' : 'Request Deletion'}
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
