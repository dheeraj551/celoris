import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, BookOpen, Sparkles, Plus } from 'lucide-react';
import { CATEGORIES } from '../../data/mockData';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialVideoId?: string;
}

export const CreatePlaylistModal: React.FC<Props> = ({ isOpen, onClose, initialVideoId }) => {
  const { createPlaylist, currentRole } = useApp();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState(CATEGORIES[1] || 'Computer Science');
  const [isPublic, setIsPublic] = useState(true);
  const [isTeacherCurated, setIsTeacherCurated] = useState(currentRole === 'teacher');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    createPlaylist({
      title: title.trim(),
      description: description.trim() || 'Custom curated study collection.',
      subject,
      isPublic,
      isTeacherCurated: currentRole === 'teacher' ? isTeacherCurated : false,
      initialVideoIds: initialVideoId ? [initialVideoId] : [],
    });

    onClose();
    setTitle('');
    setDescription('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#0e121e]/95 backdrop-blur-2xl border border-white/10 rounded-3xl w-full max-w-md p-6 shadow-2xl relative text-slate-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/20">
            <BookOpen className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold tracking-tight text-white">Create Personalized Playlist</h3>
            <p className="text-xs text-slate-400">Organize lectures into custom study tracks or course syllabi</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Playlist Title <span className="text-emerald-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Midterm 2 Calculus Review or CS 101 Syllabus"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-black/60 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Academic Subject
            </label>
            <select
              value={subject}
              onChange={e => setSubject(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-black/60 border border-white/10 rounded-xl text-sm text-white focus:outline-hidden focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
            >
              {CATEGORIES.filter(c => c !== 'All Subjects').map(cat => (
                <option key={cat} value={cat} className="bg-[#0e121e] text-white">
                  {cat}
                </option>
              ))}
              <option value="Interdisciplinary" className="bg-[#0e121e] text-white">Interdisciplinary / Multi-subject</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Description / Study Goals
            </label>
            <textarea
              rows={3}
              placeholder="Outline the core topics, exam targets, or recommended viewing sequence..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-black/60 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all resize-none"
            />
          </div>

          {currentRole === 'teacher' && (
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Official Teacher Curated Syllabus
                </span>
                <p className="text-xs text-slate-400">Mark as verified course playlist for your department</p>
              </div>
              <input
                type="checkbox"
                checked={isTeacherCurated}
                onChange={e => setIsTeacherCurated(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500/30 border-white/20 bg-black/60 accent-emerald-500"
              />
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={e => setIsPublic(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500/30 border-white/20 bg-black/60 accent-emerald-500"
              />
              Make playlist visible to study peers & classmates
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.08]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-extrabold text-black bg-gradient-to-r from-emerald-500 to-cyan-500 hover:opacity-90 rounded-xl shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-95"
            >
              <Plus className="w-4 h-4 text-black stroke-[3]" /> Create Playlist
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
