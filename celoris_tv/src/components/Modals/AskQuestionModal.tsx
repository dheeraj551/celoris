import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Video } from '../../types';
import { formatTime } from '../../utils/formatters';
import { X, HelpCircle, Clock, Code, Tag, MessageSquarePlus, Sparkles } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  video: Video;
  defaultTimestamp?: number;
}

export const AskQuestionModal: React.FC<Props> = ({
  isOpen,
  onClose,
  video,
  defaultTimestamp,
}) => {
  const { addQuestion, videoCurrentTime, currentRole } = useApp();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [useTimestamp, setUseTimestamp] = useState(true);
  const [customTimestamp, setCustomTimestamp] = useState<number>(
    defaultTimestamp ?? Math.floor(videoCurrentTime)
  );
  const [codeSnippet, setCodeSnippet] = useState('');
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['Doubt', 'Concept']);

  if (!isOpen) return null;

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    addQuestion({
      videoId: video.id,
      videoTitle: video.title,
      title: title.trim(),
      content: content.trim(),
      timestampSec: useTimestamp ? customTimestamp : null,
      tags: tags.length > 0 ? tags : ['General'],
      codeSnippet: showCodeInput && codeSnippet.trim() ? codeSnippet.trim() : undefined,
    });

    onClose();
    setTitle('');
    setContent('');
    setCodeSnippet('');
    setShowCodeInput(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fadeIn">
      <div className="bg-[#161B16] border border-[#242A24] rounded-2xl w-full max-w-lg p-6 shadow-2xl relative text-[#E0E5E0] max-h-[90vh] overflow-y-auto custom-scrollbar">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#95A395] hover:text-white rounded-lg hover:bg-[#1E241E] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 bg-[#7F9172]/20 text-[#A8B89C] rounded-xl border border-[#7F9172]/30">
            <MessageSquarePlus className="w-6 h-6 text-[#7F9172]" />
          </div>
          <div>
            <h3 className="text-xl font-bold tracking-tight text-white">Ask a Question / Raise a Doubt</h3>
            <p className="text-xs text-[#95A395]">
              Get answers from {video.author.name} (Instructor) & fellow students
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Timestamp anchor option */}
          <div className="p-3.5 bg-[#0D0F0D] border border-[#242A24] rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-[#7F9172]" />
              <div>
                <span className="text-xs font-semibold text-white">
                  Link question to video timestamp
                </span>
                <p className="text-[11px] text-[#95A395]">
                  Allows instructors and peers to jump directly to this scene
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {useTimestamp && (
                <span className="px-2 py-1 bg-[#7F9172]/20 border border-[#7F9172]/40 text-[#A8B89C] font-mono text-xs font-semibold rounded-md">
                  {formatTime(customTimestamp)}
                </span>
              )}
              <input
                type="checkbox"
                checked={useTimestamp}
                onChange={e => {
                  setUseTimestamp(e.target.checked);
                  if (e.target.checked) {
                    setCustomTimestamp(Math.floor(videoCurrentTime));
                  }
                }}
                className="w-4 h-4 rounded text-[#7F9172] focus:ring-[#7F9172] border-[#384238] bg-[#161B16] cursor-pointer"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#E0E5E0] mb-1.5">
              Question Summary <span className="text-[#7F9172]">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Why does this step require a double rotation instead of a single?"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#0D0F0D] border border-[#242A24] rounded-xl text-sm text-white placeholder-[#5E6C5E] focus:outline-hidden focus:ring-2 focus:ring-[#7F9172] focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#E0E5E0] mb-1.5">
              Detailed Context / What have you tried? <span className="text-[#7F9172]">*</span>
            </label>
            <textarea
              rows={4}
              required
              placeholder="Explain the specific concept or formula you're stuck on. Be as precise as possible..."
              value={content}
              onChange={e => setContent(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#0D0F0D] border border-[#242A24] rounded-xl text-sm text-white placeholder-[#5E6C5E] focus:outline-hidden focus:ring-2 focus:ring-[#7F9172] focus:border-transparent transition-all resize-none"
            />
          </div>

          {/* Optional Code / Formula toggle */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#E0E5E0]">
                Code Snippet / Formula (Optional)
              </label>
              <button
                type="button"
                onClick={() => setShowCodeInput(!showCodeInput)}
                className="text-xs text-[#7F9172] hover:text-[#A8B89C] flex items-center gap-1 font-medium"
              >
                <Code className="w-3.5 h-3.5" />
                {showCodeInput ? 'Hide Snippet' : '+ Add Code / LaTeX snippet'}
              </button>
            </div>
            {showCodeInput && (
              <textarea
                rows={3}
                placeholder="Paste code or pseudocode here..."
                value={codeSnippet}
                onChange={e => setCodeSnippet(e.target.value)}
                className="w-full p-3 font-mono text-xs bg-[#0D0F0D] border border-[#242A24] rounded-xl text-[#A8B89C] placeholder-[#5E6C5E] focus:outline-hidden focus:ring-2 focus:ring-[#7F9172]"
              />
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#E0E5E0] mb-1.5">
              Tags
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {tags.map(t => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#0D0F0D] border border-[#242A24] text-xs text-[#E0E5E0]"
                >
                  #{t}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(t)}
                    className="hover:text-[#C87D55] transition-colors"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add tag (e.g. Formula, Proof, Lab4)..."
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                className="flex-1 px-3 py-1.5 bg-[#0D0F0D] border border-[#242A24] rounded-lg text-xs text-white placeholder-[#5E6C5E] focus:outline-hidden focus:ring-2 focus:ring-[#7F9172]"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-3 py-1.5 bg-[#1E241E] hover:bg-[#2A332A] text-xs font-semibold text-[#E0E5E0] rounded-lg border border-[#242A24] transition-colors"
              >
                Add Tag
              </button>
            </div>
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
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-[#0D0F0D] bg-[#7F9172] hover:bg-[#91A582] rounded-xl shadow-lg shadow-[#7F9172]/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <MessageSquarePlus className="w-4 h-4 text-[#0D0F0D]" /> Post Question
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
