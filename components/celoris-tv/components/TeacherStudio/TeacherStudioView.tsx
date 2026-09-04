import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '@/components/providers/AuthProvider';
import { Video, VideoChapter, VideoResource } from '../../types';
import { formatTime, formatViews } from '../../utils/formatters';
import { CATEGORIES } from '../../data/mockData';
import confetti from 'canvas-confetti';
import {
  GraduationCap,
  Upload,
  Sparkles,
  Layers,
  Plus,
  Trash2,
  FileText,
  Code,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
  Eye,
  Award,
  Video as VideoIcon,
  Lock,
  Wallet,
} from 'lucide-react';

// Teacher Studio is gated behind a wallet balance — publishing lectures
// (and everything else in this view) is only available to accounts holding
// at least this many credits. Enforced here for the UI and again server-side
// in POST /api/celoris-tv/videos, since a client-side check alone can be
// bypassed by hitting the API directly.
const TEACHER_ACCESS_CREDIT_THRESHOLD = 5000;

export const TeacherStudioView: React.FC = () => {
  const {
    videos,
    questions,
    currentUser,
    uploadTeacherVideo,
    uploadError,
    playVideo,
    setCurrentView,
  } = useApp();

  const { profile } = useAuth();
  const walletBalance = profile?.wallet_balance ?? 0;
  const hasTeacherAccess = walletBalance >= TEACHER_ACCESS_CREDIT_THRESHOLD;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState(CATEGORIES[1] || 'Computer Science');
  const [gradeLevel, setGradeLevel] = useState('Undergraduate');
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [youtubeLink, setYoutubeLink] = useState('');
  const [durationMin, setDurationMin] = useState('18');
  const [isPublishing, setIsPublishing] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Chapters builder
  const [chapters, setChapters] = useState<VideoChapter[]>([
    { title: 'Lecture Introduction & Core Concepts', timestamp: 0 },
    { title: 'Formal Mathematical Derivations', timestamp: 360 },
    { title: 'Worked Real-World Examples & Lab Walkthrough', timestamp: 720 },
  ]);
  const [newChapterTitle, setNewChapterTitle] = useState('');
  const [newChapterTime, setNewChapterTime] = useState('');

  // Resources builder
  const [resources, setResources] = useState<VideoResource[]>([
    { id: 'res-slide', title: 'Official Lecture Slide Deck (PDF)', type: 'slides', size: '3.4 MB', url: '#' },
    { id: 'res-code', title: 'Reference Lab Repository (GitHub)', type: 'code', size: '15 KB', url: '#' },
  ]);

  const teacherVideos = videos.filter(
    v => v.author.id === currentUser.id || v.author.role === 'professor' || v.author.role === 'teacher'
  );

  const totalViews = teacherVideos.reduce((acc, v) => acc + v.views, 0);
  const unansweredDoubts = questions.filter(
    q => q.answers.length === 0 && teacherVideos.some(v => v.id === q.videoId)
  );

  const handleAddChapter = () => {
    if (!newChapterTitle.trim()) return;
    const parts = newChapterTime.split(':').map(Number);
    let sec = 0;
    if (parts.length === 2) sec = parts[0] * 60 + parts[1];
    else if (parts.length === 1 && !isNaN(parts[0])) sec = parts[0];

    setChapters([...chapters, { title: newChapterTitle.trim(), timestamp: sec }]);
    setNewChapterTitle('');
    setNewChapterTime('');
  };

  const handleRemoveChapter = (index: number) => {
    setChapters(chapters.filter((_, i) => i !== index));
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!title.trim()) return;
    if (!youtubeLink.trim()) {
      setFormError('Paste a YouTube link (listed or unlisted) for this lecture.');
      return;
    }

    setIsPublishing(true);
    const newVid = await uploadTeacherVideo({
      title: title.trim(),
      description: description.trim() || 'Comprehensive academic lecture and derivations.',
      subject,
      category: subject,
      gradeLevel,
      difficulty,
      youtubeLink: youtubeLink.trim(),
      duration: (parseInt(durationMin) || 15) * 60,
      chapters: chapters.sort((a, b) => a.timestamp - b.timestamp),
      resources,
      tags: [subject, 'Lecture', difficulty],
    });
    setIsPublishing(false);

    if (!newVid) {
      setFormError(uploadError || 'Failed to publish lecture. Double-check the YouTube link and try again.');
      return;
    }

    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 },
    });

    // Reset form
    setTitle('');
    setDescription('');
    setYoutubeLink('');
    playVideo(newVid);
  };

  if (!hasTeacherAccess) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center text-[#E0E5E0]">
        <div className="w-16 h-16 rounded-2xl bg-[#7F9172]/15 border border-[#7F9172]/30 text-[#A8B89C] flex items-center justify-center mx-auto mb-5">
          <Lock className="w-7 h-7" />
        </div>
        <h1 className="text-xl font-bold text-white mb-2">Teacher Studio is Locked</h1>
        <p className="text-sm text-[#95A395] max-w-md mx-auto mb-6">
          Publishing lectures and managing courses on Celoris TV requires{' '}
          <strong className="text-[#A8B89C]">{TEACHER_ACCESS_CREDIT_THRESHOLD.toLocaleString()} credits</strong>{' '}
          in your wallet.
        </p>
        <div className="inline-flex items-center gap-2.5 px-5 py-3 bg-[#161B16] border border-[#242A24] rounded-2xl text-sm">
          <Wallet className="w-4 h-4 text-[#7F9172]" />
          <span className="text-[#95A395]">Your balance:</span>
          <span className="font-bold text-white">{walletBalance.toLocaleString()} credits</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 text-[#E0E5E0] pb-12">
      {/* Studio Header */}
      <div className="p-6 bg-[#161B16] border border-[#242A24] rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#7F9172]/20 text-[#A8B89C] rounded-2xl border border-[#7F9172]/30">
            <GraduationCap className="w-8 h-8 text-[#7F9172]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Instructor Studio & Course Management
            </h1>
            <p className="text-xs text-[#95A395]">
              Publish video lectures, attach syllabus slide decks, and address student Q&A queues
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-[#5C8A67]/15 text-[#5C8A67] border border-[#5C8A67]/30 rounded-xl text-xs font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> Verified Educator
          </span>
        </div>
      </div>

      {/* Analytics KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-[#161B16] border border-[#242A24] rounded-2xl shadow-md">
          <div className="flex items-center justify-between mb-2 text-[#95A395] text-xs font-medium">
            <span>Published Lectures</span>
            <VideoIcon className="w-4 h-4 text-[#7F9172]" />
          </div>
          <p className="text-2xl font-bold text-white">{teacherVideos.length}</p>
          <span className="text-[10px] text-[#5E6C5E] mt-1 block">Active course videos</span>
        </div>

        <div className="p-5 bg-[#161B16] border border-[#242A24] rounded-2xl shadow-md">
          <div className="flex items-center justify-between mb-2 text-[#95A395] text-xs font-medium">
            <span>Total Student Views</span>
            <Eye className="w-4 h-4 text-[#7F9172]" />
          </div>
          <p className="text-2xl font-bold text-white">{formatViews(totalViews)}</p>
          <span className="text-[10px] text-[#5C8A67] mt-1 block">↑ 18% this semester</span>
        </div>

        <div className="p-5 bg-[#161B16] border border-[#242A24] rounded-2xl shadow-md">
          <div className="flex items-center justify-between mb-2 text-[#95A395] text-xs font-medium">
            <span>Student Doubts Pending</span>
            <HelpCircle className="w-4 h-4 text-[#C87D55]" />
          </div>
          <p className="text-2xl font-bold text-[#D2B48C]">{unansweredDoubts.length}</p>
          <span className="text-[10px] text-[#95A395] mt-1 block">Requires instructor review</span>
        </div>

        <div className="p-5 bg-[#161B16] border border-[#242A24] rounded-2xl shadow-md">
          <div className="flex items-center justify-between mb-2 text-[#95A395] text-xs font-medium">
            <span>Verified Endorsements</span>
            <Award className="w-4 h-4 text-[#5C8A67]" />
          </div>
          <p className="text-2xl font-bold text-[#A8B89C]">
            {questions.filter(q => q.answers.some(a => a.isEndorsedByTeacher)).length}
          </p>
          <span className="text-[10px] text-[#5E6C5E] mt-1 block">Answers endorsed</span>
        </div>
      </div>

      {/* Publish New Lecture Form */}
      <div className="bg-[#161B16] border border-[#242A24] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-[#242A24]">
          <Upload className="w-5 h-5 text-[#7F9172]" />
          <h2 className="text-lg font-bold text-white">Publish New Course Lecture</h2>
        </div>

        <form onSubmit={handlePublish} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#E0E5E0] mb-1.5">
                Lecture Title <span className="text-[#7F9172]">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Graph Algorithms: Dijkstra & A* Heuristic Search with Proofs"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#0D0F0D] border border-[#242A24] rounded-xl text-sm text-white placeholder-[#5E6C5E] focus:outline-hidden focus:ring-2 focus:ring-[#7F9172]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#E0E5E0] mb-1.5">
                Subject
              </label>
              <select
                value={subject}
                onChange={e => setSubject(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#0D0F0D] border border-[#242A24] rounded-xl text-xs text-white focus:outline-hidden focus:ring-2 focus:ring-[#7F9172]"
              >
                {CATEGORIES.filter(c => c !== 'All Subjects').map(c => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#E0E5E0] mb-1.5">
                Difficulty Level
              </label>
              <select
                value={difficulty}
                onChange={e => setDifficulty(e.target.value as any)}
                className="w-full px-4 py-2.5 bg-[#0D0F0D] border border-[#242A24] rounded-xl text-xs text-white focus:outline-hidden focus:ring-2 focus:ring-[#7F9172]"
              >
                <option value="Beginner">Beginner / Freshman</option>
                <option value="Intermediate">Intermediate / Core</option>
                <option value="Advanced">Advanced / Graduate</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#E0E5E0] mb-1.5">
                Syllabus & Lecture Overview
              </label>
              <textarea
                rows={3}
                placeholder="Describe key learning outcomes, prerequisites, theorems covered..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#0D0F0D] border border-[#242A24] rounded-xl text-xs text-white placeholder-[#5E6C5E] focus:outline-hidden focus:ring-2 focus:ring-[#7F9172] resize-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#E0E5E0] mb-1.5">
                YouTube Link (listed or unlisted) <span className="text-[#7F9172]">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="https://youtu.be/... or https://www.youtube.com/watch?v=..."
                value={youtubeLink}
                onChange={e => setYoutubeLink(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#0D0F0D] border border-[#242A24] rounded-xl text-sm text-white placeholder-[#5E6C5E] focus:outline-hidden focus:ring-2 focus:ring-[#7F9172] font-mono"
              />
              <p className="text-[10px] text-[#5E6C5E] mt-1.5">
                Students must be signed in to watch — the link itself is never exposed in the page source.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#E0E5E0] mb-1.5">
                Estimated Duration (Minutes)
              </label>
              <input
                type="number"
                min={1}
                max={180}
                value={durationMin}
                onChange={e => setDurationMin(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#0D0F0D] border border-[#242A24] rounded-xl text-xs text-white focus:outline-hidden focus:ring-2 focus:ring-[#7F9172]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#E0E5E0] mb-1.5">
                Target Audience / Grade Level
              </label>
              <input
                type="text"
                value={gradeLevel}
                onChange={e => setGradeLevel(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#0D0F0D] border border-[#242A24] rounded-xl text-xs text-white focus:outline-hidden focus:ring-2 focus:ring-[#7F9172]"
              />
            </div>
          </div>

          {/* Chapter Markers Manager */}
          <div className="p-4 bg-[#0D0F0D] border border-[#242A24] rounded-2xl space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#E0E5E0] flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#7F9172]" /> Chapter Timestamps
            </h3>

            <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
              {chapters.map((ch, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 bg-[#161B16] border border-[#242A24] rounded-xl text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-[#7F9172]/20 text-[#A8B89C] font-mono font-bold rounded">
                      {formatTime(ch.timestamp)}
                    </span>
                    <span className="text-[#E0E5E0] font-medium">{ch.title}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveChapter(idx)}
                    className="text-[#5E6C5E] hover:text-[#C87D55] p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <input
                type="text"
                placeholder="Chapter title (e.g. Proof of Lemma 2)"
                value={newChapterTitle}
                onChange={e => setNewChapterTitle(e.target.value)}
                className="flex-1 px-3 py-1.5 bg-[#161B16] border border-[#242A24] rounded-lg text-xs text-white placeholder-[#5E6C5E]"
              />
              <input
                type="text"
                placeholder="Time (e.g. 12:45)"
                value={newChapterTime}
                onChange={e => setNewChapterTime(e.target.value)}
                className="w-28 px-3 py-1.5 bg-[#161B16] border border-[#242A24] rounded-lg text-xs text-white placeholder-[#5E6C5E] font-mono"
              />
              <button
                type="button"
                onClick={handleAddChapter}
                className="px-3 py-1.5 bg-[#1E241E] hover:bg-[#2A332A] text-[#E0E5E0] rounded-lg text-xs font-bold"
              >
                + Add Chapter
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#242A24]">
            {formError && (
              <p className="text-xs text-[#F3C4C4] mr-auto">{formError}</p>
            )}
            <button
              type="submit"
              disabled={isPublishing}
              className="flex items-center gap-2 px-6 py-3 bg-[#7F9172] hover:bg-[#91A582] disabled:opacity-60 disabled:cursor-not-allowed text-[#0D0F0D] rounded-xl text-xs font-bold shadow-lg shadow-[#7F9172]/20 transition-all hover:scale-102"
            >
              <Upload className="w-4 h-4 text-[#0D0F0D]" /> {isPublishing ? 'Publishing…' : 'Publish Lecture to Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
