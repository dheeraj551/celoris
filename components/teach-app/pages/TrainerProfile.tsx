import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  MapPin, CheckCircle2, MessageSquare, Calendar, Award, Briefcase,
  GraduationCap, Globe, Linkedin, Twitter, Youtube, Loader2, UserRound,
  Copy, Printer, ShieldCheck,
} from 'lucide-react';
import { createClient } from '@/lib/supabase-client';

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
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-32 h-32 md:w-40 md:h-40 flex-shrink-0 relative">
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
            </div>

            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{trainer.full_name}</h1>
                  {trainer.headline && <p className="text-xl text-emerald-600 font-medium">{trainer.headline}</p>}
                </div>
                <div className="no-print flex gap-3">
                  <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" /> Message
                  </button>
                  <button className="bg-emerald-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> Book Demo
                  </button>
                </div>
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
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 flex flex-col lg:flex-row lg:items-start gap-8">
        {/* Main Content */}
        <div className="flex-1 min-w-0 space-y-6">
          {/* About Section */}
          {trainer.bio && (
            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About {trainer.full_name.split(' ')[0]}</h2>
              <div className="prose max-w-none text-gray-600 whitespace-pre-line">{trainer.bio}</div>
            </div>
          )}

          {/* Skills */}
          {trainer.skills.length > 0 && (
            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {trainer.skills.map((skill) => (
                  <span key={skill} className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-full text-sm font-bold">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Work Experience */}
          {trainer.experience.length > 0 && (
            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Briefcase className="h-6 w-6 text-emerald-600" /> Work Experience
              </h2>
              <div className="space-y-6">
                {trainer.experience.map((entry, idx) => (
                  <div key={entry.id || idx} className="border-l-2 border-emerald-100 pl-6 relative">
                    <div className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-emerald-500" />
                    <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
                      <h3 className="font-bold text-gray-900">{entry.title}</h3>
                      <span className="text-xs text-gray-400 font-medium">{entry.duration}</span>
                    </div>
                    {entry.organization && <p className="text-sm text-emerald-600 font-medium mb-2">{entry.organization}</p>}
                    {entry.description && <p className="text-sm text-gray-600 leading-relaxed">{entry.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {trainer.education.length > 0 && (
            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
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
            </div>
          )}

          {!trainer.bio && trainer.skills.length === 0 && trainer.experience.length === 0 && trainer.education.length === 0 && (
            <div className="bg-white p-12 rounded-2xl border border-gray-200 shadow-sm text-center text-gray-400">
              <ShieldCheck className="h-10 w-10 mx-auto mb-3 text-gray-200" />
              <p className="font-medium">This trainer hasn't filled out their resume yet.</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-80 flex-shrink-0">
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
        </div>
      </div>
    </div>
  );
}
