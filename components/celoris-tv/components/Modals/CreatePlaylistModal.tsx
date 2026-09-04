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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fadeIn">
      <div className="bg-[#161B16] border border-[#242A24] rounded-2xl w-full max-w-md p-6 shadow-2xl relative text-[#E0E5E0]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#95A395] hover:text-white rounded-lg hover:bg-[#1E241E] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-[#7F9172]/20 text-[#A8B89C] rounded-xl border border-[#7F9172]/30">
            <BookOpen className="w-6 h-6 text-[#7F9172]" />
          </div>
          <div>
            <h3 className="text-xl font-bold tracking-tight text-white">Create Personalized Playlist</h3>
            <p className="text-xs text-[#95A395]">Organize lectures into custom study tracks or course syllabi</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#E0E5E0] mb-1.5">
              Playlist Title <span className="text-[#7F9172]">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Midterm 2 Calculus Review or CS 101 Syllabus"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#0D0F0D] border border-[#242A24] rounded-xl text-sm text-white placeholder-[#5E6C5E] focus:outline-hidden focus:ring-2 focus:ring-[#7F9172] focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#E0E5E0] mb-1.5">
              Academic Subject
            </label>
            <select
              value={subject}
              onChange={e => setSubject(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#0D0F0D] border border-[#242A24] rounded-xl text-sm text-white focus:outline-hidden focus:ring-2 focus:ring-[#7F9172] transition-all"
            >
              {CATEGORIES.filter(c => c !== 'All Subjects').map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
              <option value="Interdisciplinary">Interdisciplinary / Multi-subject</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#E0E5E0] mb-1.5">
              Description / Study Goals
            </label>
            <textarea
              rows={3}
              placeholder="Outline the core topics, exam targets, or recommended viewing sequence..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#0D0F0D] border border-[#242A24] rounded-xl text-sm text-white placeholder-[#5E6C5E] focus:outline-hidden focus:ring-2 focus:ring-[#7F9172] focus:border-transparent transition-all resize-none"
            />
          </div>

          {currentRole === 'teacher' && (
            <div className="p-3 bg-[#D2B48C]/10 border border-[#D2B48C]/20 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#D2B48C] flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Official Teacher Curated Syllabus
                </span>
                <p className="text-xs text-[#95A395]">Mark as verified course playlist for your department</p>
              </div>
              <input
                type="checkbox"
                checked={isTeacherCurated}
                onChange={e => setIsTeacherCurated(e.target.checked)}
                className="w-4 h-4 rounded text-[#7F9172] focus:ring-[#7F9172] border-[#384238] bg-[#161B16]"
              />
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-[#E0E5E0]">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={e => setIsPublic(e.target.checked)}
                className="w-4 h-4 rounded text-[#7F9172] focus:ring-[#7F9172] border-[#384238] bg-[#161B16]"
              />
              Make playlist visible to study peers & classmates
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#242A24]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#95A395] hover:text-white rounded-xl hover:bg-[#1E241E] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-[#0D0F0D] bg-[#7F9172] hover:bg-[#91A582] rounded-xl shadow-lg shadow-[#7F9172]/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="w-4 h-4 text-[#0D0F0D]" /> Create Playlist
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
