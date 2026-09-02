import { useState, useRef, useEffect } from 'react';
import {
  User, Mail, Globe, MapPin, Camera, Save, Pencil, Trash2, Plus, X,
  ExternalLink, Linkedin, Twitter, Youtube, CheckCircle, Briefcase,
  GraduationCap, Sparkles, Share2, Copy, Link as LinkIcon, Download,
  Eye, EyeOff, ShieldCheck, Award,
} from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import { createClient } from '@/lib/supabase-client';
import { INITIAL_TRAINER_PROGRESS } from '../../data/trainerProgressionData';

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

export function TrainerProfile() {
  const { user, profile, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [resumeLoaded, setResumeLoaded] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [languageInput, setLanguageInput] = useState('');
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

  const calculateStrength = () => {
    let score = 0;
    const totalFields = 11;
    if (profile?.avatar_url || profile?.profile_pic_url) score += 1;
    if (formData.full_name) score += 1;
    if (formData.headline) score += 1;
    if (formData.bio) score += 1;
    if (formData.expertise) score += 1;
    if (formData.experience) score += 1;
    if (formData.location) score += 1;
    if (formData.skills.length > 0) score += 1;
    if (formData.experienceEntries.length > 0) score += 1;
    if (formData.educationEntries.length > 0) score += 1;
    if (formData.linkedin || formData.twitter || formData.youtube || formData.website) score += 1;
    return Math.round((score / totalFields) * 100);
  };

  const strength = calculateStrength();
  const resumeUrl = user?.id ? `${typeof window !== 'undefined' ? window.location.origin : ''}/teach/trainers/${user.id}` : '';

  const handleSave = async () => {
    setLoading(true);
    setSuccess(false);
    try {
      // Name still lives on the shared profiles/users tables
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

      // Everything resume-specific lives in its own dedicated table
      const { error: resumeError } = await supabase
        .from('trainer_resumes')
        .upsert({
          id: user?.id,
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
      <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Resume Builder</h1>
          <p className="text-gray-500 mt-1 font-medium">Build your trainer resume and share it as a public profile</p>
        </div>
        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-2xl font-bold text-sm transition-all shadow-xl shadow-emerald-500/20 flex items-center gap-2 group disabled:opacity-50"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          ) : (
            <Save className="h-4 w-4 transition-transform group-hover:scale-110" />
          )}
          {success ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Photo & Basics */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/50 flex flex-col items-center text-center relative overflow-hidden group">
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
              <h3 className="text-xl font-black text-gray-900 leading-tight">{formData.full_name || 'Sonia M'}</h3>
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
                <div className="flex items-center gap-3 text-gray-500">
                  <Globe size={16} className="text-emerald-500" />
                  <span className={`text-sm font-bold truncate ${!formData.website && 'opacity-30'}`}>{formData.website || 'No Portfolio/Website'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Share as Online Resume */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/50 space-y-5">
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
          </div>

          <div className="bg-emerald-900 p-8 rounded-[2.5rem] text-white shadow-xl shadow-emerald-900/20 relative overflow-hidden">
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
          </div>
        </div>

        {/* Right Column - Forms */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/50">
            <h3 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3 italic">
              <Pencil className="text-emerald-600" size={24} /> Basic Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Display Name</label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full bg-gray-50 border border-transparent focus:border-emerald-500/50 focus:bg-white px-6 py-4 rounded-2xl outline-none transition-all font-bold text-gray-900 shadow-inner"
                  placeholder="e.g. Sonia M"
                />
              </div>
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
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Website / Portfolio</label>
                <input
                  type="text"
                  value={formData.website}
                  onChange={e => setFormData({ ...formData, website: e.target.value })}
                  className="w-full bg-gray-50 border border-transparent focus:border-emerald-500/50 focus:bg-white px-6 py-4 rounded-2xl outline-none transition-all font-bold text-gray-900 shadow-inner"
                  placeholder="e.g. https://celoris.in"
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
          </div>

          {/* Skills & Languages */}
          <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/50">
            <h3 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3 italic">
              <Sparkles className="text-emerald-600" size={24} /> Skills & Languages
            </h3>

            <div className="space-y-3 mb-8">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Skills</label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={skillInput}
                  onChange={e => setSkillInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
                  className="flex-1 bg-gray-50 border border-transparent focus:border-emerald-500/50 focus:bg-white px-6 py-4 rounded-2xl outline-none transition-all font-bold text-gray-900 shadow-inner"
                  placeholder="e.g. Excel, Public Speaking, Curriculum Design"
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
                  {formData.skills.map((skill) => (
                    <span key={skill} className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-full text-xs font-bold">
                      {skill}
                      <button type="button" onClick={() => removeSkill(skill)} className="hover:text-emerald-950">
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Languages Spoken</label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={languageInput}
                  onChange={e => setLanguageInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addLanguage(); } }}
                  className="flex-1 bg-gray-50 border border-transparent focus:border-emerald-500/50 focus:bg-white px-6 py-4 rounded-2xl outline-none transition-all font-bold text-gray-900 shadow-inner"
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
                  {formData.languages.map((lang) => (
                    <span key={lang} className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 border border-gray-200 px-3 py-1.5 rounded-full text-xs font-bold">
                      {lang}
                      <button type="button" onClick={() => removeLanguage(lang)} className="hover:text-gray-950">
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Work Experience */}
          <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/50">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3 italic">
                <Briefcase className="text-emerald-600" size={24} /> Work Experience
              </h3>
              <button
                type="button"
                onClick={addExperience}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-bold transition-all"
              >
                <Plus size={14} /> Add Entry
              </button>
            </div>

            {formData.experienceEntries.length === 0 ? (
              <p className="text-sm text-gray-400 font-medium text-center py-8">No experience added yet. Add your teaching or work history.</p>
            ) : (
              <div className="space-y-6">
                {formData.experienceEntries.map((entry) => (
                  <div key={entry.id} className="p-6 rounded-[1.75rem] bg-gray-50 border border-gray-100 space-y-4 relative">
                    <button
                      type="button"
                      onClick={() => removeExperience(entry.id)}
                      className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-8">
                      <input
                        type="text"
                        value={entry.title}
                        onChange={e => updateExperience(entry.id, 'title', e.target.value)}
                        placeholder="Role / Title (e.g. Lead Trainer)"
                        className="bg-white px-5 py-3.5 rounded-xl border border-gray-200 focus:border-emerald-500/50 outline-none font-bold text-sm text-gray-900"
                      />
                      <input
                        type="text"
                        value={entry.organization}
                        onChange={e => updateExperience(entry.id, 'organization', e.target.value)}
                        placeholder="Organization"
                        className="bg-white px-5 py-3.5 rounded-xl border border-gray-200 focus:border-emerald-500/50 outline-none font-bold text-sm text-gray-900"
                      />
                    </div>
                    <input
                      type="text"
                      value={entry.duration}
                      onChange={e => updateExperience(entry.id, 'duration', e.target.value)}
                      placeholder="Duration (e.g. 2021 - Present)"
                      className="w-full bg-white px-5 py-3.5 rounded-xl border border-gray-200 focus:border-emerald-500/50 outline-none font-bold text-sm text-gray-900"
                    />
                    <textarea
                      rows={3}
                      value={entry.description}
                      onChange={e => updateExperience(entry.id, 'description', e.target.value)}
                      placeholder="What did you teach or work on?"
                      className="w-full bg-white px-5 py-3.5 rounded-xl border border-gray-200 focus:border-emerald-500/50 outline-none font-medium text-sm text-gray-700 leading-relaxed"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Education */}
          <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/50">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3 italic">
                <GraduationCap className="text-emerald-600" size={24} /> Education
              </h3>
              <button
                type="button"
                onClick={addEducation}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-bold transition-all"
              >
                <Plus size={14} /> Add Entry
              </button>
            </div>

            {formData.educationEntries.length === 0 ? (
              <p className="text-sm text-gray-400 font-medium text-center py-8">No education added yet.</p>
            ) : (
              <div className="space-y-4">
                {formData.educationEntries.map((entry) => (
                  <div key={entry.id} className="p-6 rounded-[1.75rem] bg-gray-50 border border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-4 relative">
                    <button
                      type="button"
                      onClick={() => removeEducation(entry.id)}
                      className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors md:hidden"
                    >
                      <Trash2 size={16} />
                    </button>
                    <input
                      type="text"
                      value={entry.degree}
                      onChange={e => updateEducation(entry.id, 'degree', e.target.value)}
                      placeholder="Degree / Certification"
                      className="bg-white px-5 py-3.5 rounded-xl border border-gray-200 focus:border-emerald-500/50 outline-none font-bold text-sm text-gray-900"
                    />
                    <input
                      type="text"
                      value={entry.institution}
                      onChange={e => updateEducation(entry.id, 'institution', e.target.value)}
                      placeholder="Institution"
                      className="bg-white px-5 py-3.5 rounded-xl border border-gray-200 focus:border-emerald-500/50 outline-none font-bold text-sm text-gray-900"
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={entry.year}
                        onChange={e => updateEducation(entry.id, 'year', e.target.value)}
                        placeholder="Year"
                        className="flex-1 bg-white px-5 py-3.5 rounded-xl border border-gray-200 focus:border-emerald-500/50 outline-none font-bold text-sm text-gray-900"
                      />
                      <button
                        type="button"
                        onClick={() => removeEducation(entry.id)}
                        className="hidden md:flex items-center justify-center w-12 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Verified Certifications (from Progression) */}
          <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/50">
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
          </div>

          <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/50">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3 italic">
                <ExternalLink className="text-emerald-600" size={24} /> Social Connectivity
              </h3>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Connect with Students</span>
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
                  className="w-full bg-gray-50 pl-20 pr-6 py-5 rounded-[1.5rem] border border-transparent focus:border-blue-500/50 focus:bg-white transition-all font-bold shadow-inner"
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
                  className="w-full bg-gray-50 pl-20 pr-6 py-5 rounded-[1.5rem] border border-transparent focus:border-slate-900/50 focus:bg-white transition-all font-bold shadow-inner"
                />
              </div>

              <div className="group relative">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 p-2 bg-red-50 text-red-600 rounded-xl">
                  <Youtube size={20} />
                </div>
                <input
                  type="text"
                  placeholder="YouTube Channel"
                  value={formData.youtube}
                  onChange={e => setFormData({ ...formData, youtube: e.target.value })}
                  className="w-full bg-gray-50 pl-20 pr-6 py-5 rounded-[1.5rem] border border-transparent focus:border-red-500/50 focus:bg-white transition-all font-bold shadow-inner"
                />
              </div>
            </div>
          </div>

          <div className="bg-red-50 p-8 rounded-[2.5rem] border border-red-100 flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 text-red-600 rounded-[1.25rem] group-hover:bg-red-600 group-hover:text-white transition-all">
                <Trash2 size={24} />
              </div>
              <div>
                <h4 className="font-black text-red-900 uppercase tracking-tight italic">Deactivate Profile</h4>
                <p className="text-red-600 text-[10px] font-bold uppercase tracking-widest opacity-80">This will hide your profile from learners</p>
              </div>
            </div>
            <button className="bg-white border border-red-200 text-red-600 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white hover:border-red-600 transition-all">
              Request Deletion
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
