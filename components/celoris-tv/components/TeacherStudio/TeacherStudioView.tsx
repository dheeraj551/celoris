import React, { useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '@/components/providers/AuthProvider';
import { Video, VideoChapter, VideoResource } from '../../types';
import { formatTime } from '../../utils/formatters';
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
  ThumbsUp,
  ThumbsDown,
  Award,
  Video as VideoIcon,
  Lock,
  Wallet,
  Pencil,
  X,
} from 'lucide-react';

// Default chapter/resource scaffolding shown when starting a fresh lecture
// (also what the form resets to when cancelling out of an edit).
const DEFAULT_CHAPTERS: VideoChapter[] = [
  { title: 'Lecture Introduction & Core Concepts', timestamp: 0 },
  { title: 'Formal Mathematical Derivations', timestamp: 360 },
  { title: 'Worked Real-World Examples & Lab Walkthrough', timestamp: 720 },
];

const DEFAULT_RESOURCES: VideoResource[] = [
  { id: 'res-slide', title: 'Official Lecture Slide Deck (PDF)', type: 'slides', size: '3.4 MB', url: '#' },
  { id: 'res-code', title: 'Reference Lab Repository (GitHub)', type: 'code', size: '15 KB', url: '#' },
];

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
    updateTeacherVideo,
    deleteTeacherVideo,
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

  // Which of the teacher's own lectures (if any) is currently being edited —
  // switches the publish form below into "edit" mode. null means the form is
  // building a brand-new lecture.
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);
  const [deletingVideoId, setDeletingVideoId] = useState<string | null>(null);
  const formSectionRef = useRef<HTMLDivElement>(null);

  // Chapters builder
  const [chapters, setChapters] = useState<VideoChapter[]>(DEFAULT_CHAPTERS);
  const [newChapterTitle, setNewChapterTitle] = useState('');
  const [newChapterTime, setNewChapterTime] = useState('');

  // Resources builder
  const [resources, setResources] = useState<VideoResource[]>(DEFAULT_RESOURCES);

  const teacherVideos = videos.filter(
    v => v.author.id === currentUser.id || v.author.role === 'professor' || v.author.role === 'teacher'
  );

  const totalLikes = teacherVideos.reduce((acc, v) => acc + (v.likes || 0), 0);
  const totalDislikes = teacherVideos.reduce((acc, v) => acc + (v.dislikes || 0), 0);
  const unansweredDoubts = questions.filter(
    q => q.answers.length === 0 && teacherVideos.some(v => v.id === q.videoId)
  );

  const resetFormToDefaults = () => {
    setTitle('');
    setDescription('');
    setSubject(CATEGORIES[1] || 'Computer Science');
    setGradeLevel('Undergraduate');
    setDifficulty('Intermediate');
    setYoutubeLink('');
    setDurationMin('18');
    setChapters(DEFAULT_CHAPTERS);
    setResources(DEFAULT_RESOURCES);
    setFormError(null);
  };

  const handleEditClick = (video: Video) => {
    setEditingVideoId(video.id);
    setTitle(video.title);
    setDescription(video.description || '');
    setSubject(video.subject || CATEGORIES[1] || 'Computer Science');
    setGradeLevel(video.gradeLevel || 'Undergraduate');
    setDifficulty((video.difficulty as 'Beginner' | 'Intermediate' | 'Advanced') || 'Intermediate');
    setYoutubeLink(video.youtubeId ? `https://www.youtube.com/watch?v=${video.youtubeId}` : '');
    setDurationMin(String(Math.max(1, Math.round((video.duration || 900) / 60))));
    setChapters(video.chapters && video.chapters.length ? video.chapters : DEFAULT_CHAPTERS);
    setResources(video.resources && video.resources.length ? video.resources : DEFAULT_RESOURCES);
    setFormError(null);
    formSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleCancelEdit = () => {
    setEditingVideoId(null);
    resetFormToDefaults();
  };

  const handleDeleteVideo = async (video: Video) => {
    const confirmed = window.confirm(
      `Delete "${video.title}"? This also removes its Q&A thread and can't be undone.`
    );
    if (!confirmed) return;

    setDeletingVideoId(video.id);
    const ok = await deleteTeacherVideo(video.id);
    setDeletingVideoId(null);

    if (ok && editingVideoId === video.id) {
      setEditingVideoId(null);
      resetFormToDefaults();
    }
  };

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
    const payload = {
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
    };

    const result = editingVideoId
      ? await updateTeacherVideo(editingVideoId, payload)
      : await uploadTeacherVideo(payload);
    setIsPublishing(false);

    if (!result) {
      setFormError(
        uploadError ||
          `Failed to ${editingVideoId ? 'update' : 'publish'} lecture. Double-check the YouTube link and try again.`
      );
      return;
    }

    if (editingVideoId) {
      // Plain edit — no confetti, just drop back into "new lecture" mode.
      setEditingVideoId(null);
      setTitle('');
      setDescription('');
      setYoutubeLink('');
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
    playVideo(result);
  };

  if (!hasTeacherAccess) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center text-slate-200 select-none">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-5 shadow-inner">
          <Lock className="w-7 h-7" />
        </div>
        <h1 className="text-xl font-extrabold text-white mb-2">Teacher Studio is Gated</h1>
        <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
          Publishing lectures and managing courses on Celoris TV requires{' '}
          <strong className="text-emerald-400 font-mono">{TEACHER_ACCESS_CREDIT_THRESHOLD.toLocaleString()} credits</strong>{' '}
          in your wallet.
        </p>
        <div className="inline-flex items-center gap-2.5 px-5 py-3 bg-[#0e121e]/85 border border-white/10 rounded-2xl text-sm shadow-xl">
          <Wallet className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-400">Your balance:</span>
          <span className="font-bold text-white font-mono">{walletBalance.toLocaleString()} credits</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 text-slate-100 select-none pb-12">
      {/* Studio Header */}
      <div className="p-6 bg-[#0e121e]/85 backdrop-blur-xl border border-white/[0.08] rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/20">
            <GraduationCap className="w-8 h-8 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white">
              Instructor Studio & Course Management
            </h1>
            <p className="text-xs text-slate-400">
              Publish video lectures, attach syllabus slide decks, and address student Q&A queues
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl text-xs font-bold flex items-center gap-1.5 font-mono">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Verified Educator
          </span>
        </div>
      </div>

      {/* Analytics KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-[#0e121e]/85 backdrop-blur-xl border border-white/[0.08] rounded-2xl shadow-xl">
          <div className="flex items-center justify-between mb-2 text-slate-400 text-xs font-medium font-mono">
            <span>Published Lectures</span>
            <VideoIcon className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-extrabold text-white font-mono">{teacherVideos.length}</p>
          <span className="text-[10px] text-slate-500 mt-1 block font-mono">Active course videos</span>
        </div>

        <div className="p-5 bg-[#0e121e]/85 backdrop-blur-xl border border-white/[0.08] rounded-2xl shadow-xl">
          <div className="flex items-center justify-between mb-2 text-slate-400 text-xs font-medium font-mono">
            <span>Likes / Dislikes</span>
            <ThumbsUp className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-extrabold text-white font-mono">
            {totalLikes} <span className="text-slate-500 text-base font-medium">/</span>{' '}
            <span className="text-rose-400">{totalDislikes}</span>
          </p>
          <span className="text-[10px] text-slate-500 mt-1 block font-mono">Across published lectures</span>
        </div>

        <div className="p-5 bg-[#0e121e]/85 backdrop-blur-xl border border-white/[0.08] rounded-2xl shadow-xl">
          <div className="flex items-center justify-between mb-2 text-slate-400 text-xs font-medium font-mono">
            <span>Pending Doubts</span>
            <HelpCircle className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-extrabold text-amber-400 font-mono">{unansweredDoubts.length}</p>
          <span className="text-[10px] text-slate-500 mt-1 block font-mono">Requires instructor review</span>
        </div>

        <div className="p-5 bg-[#0e121e]/85 backdrop-blur-xl border border-white/[0.08] rounded-2xl shadow-xl">
          <div className="flex items-center justify-between mb-2 text-slate-400 text-xs font-medium font-mono">
            <span>Verified Endorsements</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-extrabold text-emerald-400 font-mono">
            {questions.filter(q => q.answers.some(a => a.isEndorsedByTeacher)).length}
          </p>
          <span className="text-[10px] text-slate-500 mt-1 block font-mono">Answers endorsed</span>
        </div>
      </div>

      {/* Your Published Lectures — edit or remove anything you've published */}
      <div className="bg-[#0e121e]/85 backdrop-blur-xl border border-white/[0.08] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
        <div className="flex items-center gap-2 pb-4 border-b border-white/[0.08]">
          <VideoIcon className="w-5 h-5 text-emerald-400" />
          <h2 className="text-lg font-bold text-white">Your Published Lectures</h2>
        </div>

        {teacherVideos.length === 0 ? (
          <p className="text-xs text-slate-400 py-2">
            You haven't published any lectures yet — use the form below to publish your first one.
          </p>
        ) : (
          <div className="space-y-2">
            {teacherVideos.map(video => (
              <div
                key={video.id}
                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl border transition-colors ${
                  editingVideoId === video.id
                    ? 'bg-emerald-500/10 border-emerald-500/40 shadow-xs'
                    : 'bg-black/40 border-white/10'
                }`}
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-white truncate">{video.title}</p>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-[10px] text-slate-400 font-mono">
                    <span>{video.subject}</span>
                    <span>•</span>
                    <span>{video.difficulty}</span>
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="w-3 h-3 text-emerald-400" /> {video.likes || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <ThumbsDown className="w-3 h-3 text-rose-400" /> {video.dislikes || 0}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleEditClick(video)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold bg-white/[0.05] hover:bg-white/10 text-white transition-colors border border-white/10"
                  >
                    <Pencil className="w-3.5 h-3.5 text-emerald-400" /> Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteVideo(video)}
                    disabled={deletingVideoId === video.id}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 disabled:opacity-50 transition-colors border border-rose-500/20"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> {deletingVideoId === video.id ? 'Deleting…' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Publish New / Edit Lecture Form */}
      <div ref={formSectionRef} className="bg-[#0e121e]/85 backdrop-blur-xl border border-white/[0.08] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-white/[0.08]">
          {editingVideoId ? (
            <Pencil className="w-5 h-5 text-emerald-400" />
          ) : (
            <Upload className="w-5 h-5 text-emerald-400" />
          )}
          <h2 className="text-lg font-bold text-white">
            {editingVideoId ? 'Edit Course Lecture' : 'Publish New Course Lecture'}
          </h2>
          {editingVideoId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="ml-auto flex items-center gap-1 text-[11px] font-bold text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" /> Cancel Edit
            </button>
          )}
        </div>

        <form onSubmit={handlePublish} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 font-mono">
                Lecture Title <span className="text-emerald-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Graph Algorithms: Dijkstra & A* Heuristic Search with Proofs"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 bg-black/60 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/40"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 font-mono">
                Subject
              </label>
              <select
                value={subject}
                onChange={e => setSubject(e.target.value)}
                className="w-full px-4 py-2.5 bg-black/60 border border-white/10 rounded-xl text-xs text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/40"
              >
                {CATEGORIES.filter(c => c !== 'All Subjects').map(c => (
                  <option key={c} value={c} className="bg-[#0e121e]">
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 font-mono">
                Difficulty Level
              </label>
              <select
                value={difficulty}
                onChange={e => setDifficulty(e.target.value as any)}
                className="w-full px-4 py-2.5 bg-black/60 border border-white/10 rounded-xl text-xs text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/40"
              >
                <option value="Beginner" className="bg-[#0e121e]">Beginner / Freshman</option>
                <option value="Intermediate" className="bg-[#0e121e]">Intermediate / Core</option>
                <option value="Advanced" className="bg-[#0e121e]">Advanced / Graduate</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 font-mono">
                Syllabus & Lecture Overview
              </label>
              <textarea
                rows={3}
                placeholder="Describe key learning outcomes, prerequisites, theorems covered..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 bg-black/60 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/40 resize-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 font-mono">
                YouTube Link (listed or unlisted) <span className="text-emerald-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="https://youtu.be/... or https://www.youtube.com/watch?v=..."
                value={youtubeLink}
                onChange={e => setYoutubeLink(e.target.value)}
                className="w-full px-4 py-2.5 bg-black/60 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/40 font-mono"
              />
              <p className="text-[10px] text-slate-500 mt-1.5">
                Students must be signed in to watch — the link itself is never exposed in the page source.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 font-mono">
                Estimated Duration (Minutes)
              </label>
              <input
                type="number"
                min={1}
                max={180}
                value={durationMin}
                onChange={e => setDurationMin(e.target.value)}
                className="w-full px-4 py-2.5 bg-black/60 border border-white/10 rounded-xl text-xs text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/40"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 font-mono">
                Target Audience / Grade Level
              </label>
              <input
                type="text"
                value={gradeLevel}
                onChange={e => setGradeLevel(e.target.value)}
                className="w-full px-4 py-2.5 bg-black/60 border border-white/10 rounded-xl text-xs text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/40"
              />
            </div>
          </div>

          {/* Chapter Markers Manager */}
          <div className="p-4 bg-black/40 border border-white/10 rounded-2xl space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2 font-mono">
              <Layers className="w-4 h-4 text-emerald-400" /> Chapter Timestamps
            </h3>

            <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
              {chapters.map((ch, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 bg-white/[0.03] border border-white/10 rounded-xl text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-emerald-500/15 text-emerald-400 font-mono font-bold rounded">
                      {formatTime(ch.timestamp)}
                    </span>
                    <span className="text-slate-200 font-medium">{ch.title}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveChapter(idx)}
                    className="text-slate-500 hover:text-rose-400 p-1"
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
                className="flex-1 px-3 py-1.5 bg-white/[0.04] border border-white/10 rounded-lg text-xs text-white placeholder-slate-500"
              />
              <input
                type="text"
                placeholder="Time (e.g. 12:45)"
                value={newChapterTime}
                onChange={e => setNewChapterTime(e.target.value)}
                className="w-28 px-3 py-1.5 bg-white/[0.04] border border-white/10 rounded-lg text-xs text-white placeholder-slate-500 font-mono"
              />
              <button
                type="button"
                onClick={handleAddChapter}
                className="px-3 py-1.5 bg-white/[0.06] hover:bg-white/10 text-white rounded-lg text-xs font-bold border border-white/10"
              >
                + Add Chapter
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.08]">
            {formError && (
              <p className="text-xs text-rose-400 mr-auto">{formError}</p>
            )}
            {editingVideoId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-5 py-3 bg-white/[0.05] hover:bg-white/10 text-slate-300 rounded-xl text-xs font-bold transition-colors border border-white/10"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={isPublishing}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 disabled:opacity-60 disabled:cursor-not-allowed text-black rounded-xl text-xs font-extrabold shadow-lg shadow-emerald-500/20 transition-all hover:scale-102 active:scale-98"
            >
              {editingVideoId ? <Pencil className="w-4 h-4 text-black" /> : <Upload className="w-4 h-4 text-black" />}{' '}
              {isPublishing
                ? editingVideoId
                  ? 'Updating…'
                  : 'Publishing…'
                : editingVideoId
                ? 'Update Lecture'
                : 'Publish Lecture to Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
