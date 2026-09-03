import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin, CheckCircle2, Award, Briefcase,
  GraduationCap, Globe, Linkedin, Twitter, Youtube, Loader2, UserRound,
  Copy, Printer, ShieldCheck, Star,
} from 'lucide-react';
import { createClient } from '@/lib/supabase-client';
import { TrainerTierLevel } from '../types';
import { TRAINER_LEVEL_TIERS, INITIAL_TRAINER_PROGRESS } from '../data/trainerProgressionData';

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

interface ResumeData {
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

export function TrainerProfile() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);
  const [trainer, setTrainer] = useState<ResumeData | null>(null);

  useEffect(() => {
    if (!id) return;
    const supabase = createClient();

    (async () => {
      setLoading(true);

      const [{ data: userRow }, { data: profileRow }, { data: resumeRow }] = await Promise.all([
        supabase.from('users').select('*').eq('id', id).maybeSingle(),
        supabase.from('profiles').select('*').eq('id', id).maybeSingle(),
        supabase.from('trainer_resumes').select('*').eq('id', id).maybeSingle(),
      ]);

      if (!resumeRow || resumeRow.is_public === false) {
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

      setTrainer({
        full_name: merged.full_name || 'Celoris Trainer',
        avatar_url: avatarUrl,
        headline: resumeRow.headline || '',
        bio: resumeRow.bio || '',
        specialty: resumeRow.specialty || '',
        experience_years: resumeRow.experience_years || '',
        location: resumeRow.location || '',
        website: resumeRow.website || '',
        linkedin: resumeRow.linkedin || '',
        twitter: resumeRow.twitter || '',
        youtube: resumeRow.youtube || '',
        skills: resumeRow.skills || [],
        languages: resumeRow.languages || [],
        experience: Array.isArray(resumeRow.experience) ? resumeRow.experience : [],
        education: Array.isArray(resumeRow.education) ? resumeRow.education : [],
      });
      setLoading(false);
    })();
  }, [id]);

  // Support ?print=1 to trigger the browser's print (Save as PDF) dialog automatically
  useEffect(() => {
    if (loading || notFound || !trainer) return;
    const params = new URLSearchParams(window.location.search);
    if (params.get('print') === '1') {
      const t = setTimeout(() => window.print(), 400);
      return () => clearTimeout(t);
    }
  }, [loading, notFound, trainer]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href.split('?')[0]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const pageUrl = typeof window !== 'undefined' && id ? `${window.location.origin}/teach/trainers/${id}` : '';
  const qrCodeUrl = pageUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=8&data=${encodeURIComponent(pageUrl)}`
    : '';
  const trainerIdCode = id ? id.replace(/-/g, '').slice(0, 8).toUpperCase() : '';

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (notFound || !trainer) {
    return (
      <div className="bg-gray-50 min-h-screen flex flex-col items-center justify-center text-center px-6">
        <UserRound className="h-14 w-14 text-gray-300 mb-4" />
        <h1 className="text-xl font-bold text-gray-900 mb-2">This resume isn't public</h1>
        <p className="text-gray-500 text-sm max-w-sm">
          Either this trainer hasn't published a resume yet, or they've kept it private.
        </p>
      </div>
    );
  }

  const hasSocials = trainer.website || trainer.linkedin || trainer.twitter || trainer.youtube;

  // Verified Trainer Progression — mirrors the trainer's own dashboard
  // Progression tab (components/teach-app/pages/dashboard/TrainerProgression.tsx).
  const progress = INITIAL_TRAINER_PROGRESS;
  const currentTierInfo = TRAINER_LEVEL_TIERS[progress.level];
  const nextLevel = (progress.level < 5 ? progress.level + 1 : 5) as TrainerTierLevel;
  const nextTierInfo = TRAINER_LEVEL_TIERS[nextLevel];
  const progressPercent = Math.min(
    100,
    Math.max(
      0,
      Math.round(
        ((progress.currentXP - currentTierInfo.minXP) / (progress.nextLevelXP - currentTierInfo.minXP)) * 100
      )
    )
  );

  return (
    <div className="bg-gray-50 min-h-screen pb-20 print:bg-white">
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
        }
      `}</style>

      {/* Share Toolbar */}
      <div className="no-print bg-white border-b border-gray-100 py-3">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-end gap-2">
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-xs font-bold text-gray-600 transition-all"
          >
            <Copy size={14} /> {copied ? 'Link Copied!' : 'Copy Link'}
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all"
          >
            <Printer size={14} /> Print / Save as PDF
          </button>
        </div>
      </div>

      {/* Profile Header */}
      <div className="bg-white border-b border-gray-200 pt-10 pb-16">
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
              {trainer.avatar_url ? (
                <img
                  src={trainer.avatar_url}
                  alt={trainer.full_name}
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
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{trainer.full_name}</h1>
                  {trainer.headline && <p className="text-xl text-emerald-600 font-medium">{trainer.headline}</p>}
                </div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.15, ease: 'easeOut' }}
                  className="flex items-center gap-4 bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 rounded-2xl px-5 py-4 shadow-sm print:border-gray-200 print:shadow-none"
                >
                  <img src="/celoris-logo.png" alt="Celoris" className="h-7 w-auto flex-shrink-0" />
                  <div className="h-10 w-px bg-emerald-100 flex-shrink-0" />
                  {qrCodeUrl && (
                    <img
                      src={qrCodeUrl}
                      alt="Scan to view this trainer's profile"
                      className="h-20 w-20 rounded-lg border border-white shadow-sm bg-white p-1 flex-shrink-0"
                    />
                  )}
                  <div className="text-left">
                    <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Verified Trainer ID</p>
                    <p className="text-xs text-gray-500 font-medium mt-0.5">Scan to view this profile</p>
                    {trainerIdCode && (
                      <p className="text-[10px] text-gray-400 font-mono mt-1 tracking-wider">#{trainerIdCode}</p>
                    )}
                  </div>
                </motion.div>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6">
                {trainer.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-gray-400" /> {trainer.location}
                  </div>
                )}
                {trainer.experience_years && (
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-gray-400" /> {trainer.experience_years} Experience
                  </div>
                )}
              </div>

              {trainer.specialty && (
                <div className="flex flex-wrap gap-2">
                  {trainer.specialty.split(',').map((tag) => tag.trim()).filter(Boolean).map((tag) => (
                    <span key={tag} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
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
          {/* Verified Trainer Progression & Badges */}
          <motion.div variants={fadeInUp} className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <ShieldCheck className="h-6 w-6 text-emerald-600" /> Verified Trainer Progression
                </h2>
                <p className="text-sm text-gray-500 mt-1 max-w-lg">{currentTierInfo.desc}</p>
              </div>
              <span className="px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-sm whitespace-nowrap">
                Level {progress.level}: {currentTierInfo.name}
              </span>
            </div>

            {/* XP Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-gray-500">
                <span>{progress.currentXP} / {progress.nextLevelXP} XP</span>
                <span>{progressPercent}% to Level {nextLevel} ({nextTierInfo.name})</span>
              </div>
              <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
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
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-center">
                <span className="text-[11px] text-gray-500 font-medium block">Total XP</span>
                <span className="text-lg font-extrabold text-emerald-700">{progress.currentXP}</span>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-center">
                <span className="text-[11px] text-gray-500 font-medium block">Sessions Hosted</span>
                <span className="text-lg font-extrabold text-emerald-700">{progress.sessionsHosted}</span>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-center col-span-2 sm:col-span-1">
                <span className="text-[11px] text-gray-500 font-medium block">Trainer Rating</span>
                <span className="text-lg font-extrabold text-emerald-700">{progress.trainerRating.toFixed(1)} / 5</span>
              </div>
            </div>

            {/* Verified Badges */}
            {progress.badges.length > 0 && (
              <div className="pt-4 border-t border-gray-100 space-y-4">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <Award className="h-4 w-4 text-emerald-600" />
                  Verified Badges ({progress.badges.length})
                </h3>
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                  {progress.badges.map((badge) => (
                    <motion.div
                      key={badge.id}
                      variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } } }}
                      className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-2.5"
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
                            <h4 className="font-bold text-sm text-gray-900">{badge.badgeTitle}</h4>
                            <p className="text-xs text-gray-500">{badge.subject} • Earned {badge.earnedDate}</p>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold flex items-center gap-1 shrink-0">
                          <Star className="w-3 h-3 fill-current" /> {badge.rating.toFixed(1)}
                        </span>
                      </div>
                      <div className="p-2 rounded-lg bg-white border border-gray-200 text-xs font-mono flex items-center gap-1.5 text-gray-700">
                        <span className="text-[10px] text-gray-400">VERIFY ID:</span>
                        <span className="font-bold text-emerald-700">{badge.verificationHash}</span>
                      </div>
                      <p className="text-[11px] text-gray-500">
                        Sessions Delivered: <strong className="text-emerald-700">{badge.sessionsCount}</strong>
                      </p>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            )}
          </motion.div>

          {/* About Section */}
          {trainer.bio && (
            <motion.div variants={fadeInUp} className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About {trainer.full_name.split(' ')[0]}</h2>
              <div className="prose max-w-none text-gray-600 whitespace-pre-line">{trainer.bio}</div>
            </motion.div>
          )}

          {/* Skills */}
          {trainer.skills.length > 0 && (
            <motion.div variants={fadeInUp} className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {trainer.skills.map((skill) => (
                  <span key={skill} className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-full text-sm font-bold">
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          {/* Work Experience */}
          {trainer.experience.length > 0 && (
            <motion.div variants={fadeInUp} className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Briefcase className="h-6 w-6 text-emerald-600" /> Work Experience
              </h2>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
                className="space-y-6"
              >
                {trainer.experience.map((entry, idx) => (
                  <motion.div
                    key={entry.id || idx}
                    variants={{ hidden: { opacity: 0, x: -16 }, visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: 'easeOut' } } }}
                    className="border-l-2 border-emerald-100 pl-6 relative"
                  >
                    <div className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-emerald-500" />
                    <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
                      <h3 className="font-bold text-gray-900">{entry.title}</h3>
                      <span className="text-xs text-gray-400 font-medium">{entry.duration}</span>
                    </div>
                    {entry.organization && <p className="text-sm text-emerald-600 font-medium mb-2">{entry.organization}</p>}
                    {entry.description && <p className="text-sm text-gray-600 leading-relaxed">{entry.description}</p>}
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* Education */}
          {trainer.education.length > 0 && (
            <motion.div variants={fadeInUp} className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <GraduationCap className="h-6 w-6 text-emerald-600" /> Education
              </h2>
              <div className="space-y-4">
                {trainer.education.map((entry, idx) => (
                  <div key={entry.id || idx} className="flex items-baseline justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-gray-900">{entry.degree}</h3>
                      {entry.institution && <p className="text-sm text-gray-500">{entry.institution}</p>}
                    </div>
                    <span className="text-xs text-gray-400 font-medium flex-shrink-0">{entry.year}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {!trainer.bio && trainer.skills.length === 0 && trainer.experience.length === 0 && trainer.education.length === 0 && (
            <motion.div variants={fadeInUp} className="bg-white p-12 rounded-2xl border border-gray-200 shadow-sm text-center text-gray-400">
              <ShieldCheck className="h-10 w-10 mx-auto mb-3 text-gray-200" />
              <p className="font-medium">This trainer hasn't filled out their resume yet.</p>
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
          <div className="lg:sticky lg:top-6 bg-white rounded-2xl border border-gray-200 shadow-lg divide-y divide-gray-100 overflow-hidden">
            <div className="no-print p-6 space-y-3">
              <button className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors">
                Book a Session
              </button>
              <button className="w-full bg-white border border-emerald-600 text-emerald-600 py-3 rounded-xl font-bold hover:bg-emerald-50 transition-colors">
                Send Enquiry
              </button>
            </div>

            {trainer.languages.length > 0 && (
              <div className="p-6">
                <h3 className="font-bold text-gray-900 text-sm mb-3">Languages</h3>
                <div className="flex flex-wrap gap-2">
                  {trainer.languages.map((lang) => (
                    <span key={lang} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {hasSocials && (
              <div className="no-print p-6 space-y-3">
                <h3 className="font-bold text-gray-900 text-sm mb-1">Connect</h3>
                {trainer.website && (
                  <a href={trainer.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-gray-600 hover:text-emerald-600">
                    <Globe className="h-4 w-4 text-emerald-500 flex-shrink-0" /> <span className="truncate">Website</span>
                  </a>
                )}
                {trainer.linkedin && (
                  <a href={trainer.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-gray-600 hover:text-emerald-600">
                    <Linkedin className="h-4 w-4 text-emerald-500 flex-shrink-0" /> <span className="truncate">LinkedIn</span>
                  </a>
                )}
                {trainer.twitter && (
                  <a href={trainer.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-gray-600 hover:text-emerald-600">
                    <Twitter className="h-4 w-4 text-emerald-500 flex-shrink-0" /> <span className="truncate">Twitter</span>
                  </a>
                )}
                {trainer.youtube && (
                  <a href={trainer.youtube} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-gray-600 hover:text-emerald-600">
                    <Youtube className="h-4 w-4 text-emerald-500 flex-shrink-0" /> <span className="truncate">YouTube</span>
                  </a>
                )}
              </div>
            )}

            {!hasSocials && trainer.languages.length === 0 && (
              <div className="p-6">
                <p className="text-xs text-gray-400 leading-relaxed">
                  This trainer hasn't added languages or social links yet.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
