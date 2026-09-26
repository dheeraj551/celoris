import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { QAQuestion } from '../../types';
import { formatTime } from '../../utils/formatters';
import { CATEGORIES } from '../../data/mockData';
import {
  HelpCircle,
  Search,
  Award,
  ThumbsUp,
  MessageCircle,
  Play,
  CheckCircle2,
  ShieldCheck,
  Send,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';

export const GlobalQAHub: React.FC = () => {
  const {
    questions,
    videos,
    currentRole,
    playVideo,
    addAnswer,
    upvoteQuestion,
    upvoteAnswer,
    endorseAnswer,
    seekToTime,
    setCurrentView,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All Subjects');
  const [filterType, setFilterType] = useState<'all' | 'unanswered' | 'verified' | 'mine'>('all');
  const [expandedQIds, setExpandedQIds] = useState<string[]>([]);
  const [replyMap, setReplyMap] = useState<Record<string, string>>({});

  const filteredQuestions = questions.filter(q => {
    // Subject filter
    const video = videos.find(v => v.id === q.videoId);
    if (selectedSubject !== 'All Subjects') {
      if (!video || (video.subject !== selectedSubject && video.category !== selectedSubject)) {
        return false;
      }
    }

    // Search query
    if (searchQuery.trim()) {
      const matchText = `${q.title} ${q.content} ${q.author.name} ${q.tags.join(' ')} ${video?.title || ''}`.toLowerCase();
      if (!matchText.includes(searchQuery.toLowerCase())) return false;
    }

    // Status filter
    if (filterType === 'unanswered') {
      return !q.isResolved && q.answers.length === 0;
    }
    if (filterType === 'verified') {
      return q.answers.some(a => a.isEndorsedByTeacher || a.author.role === 'teacher' || a.author.role === 'professor');
    }

    return true;
  });

  const toggleExpand = (qId: string) => {
    setExpandedQIds(prev =>
      prev.includes(qId) ? prev.filter(id => id !== qId) : [...prev, qId]
    );
  };

  const handleJumpToVideo = (q: QAQuestion) => {
    const video = videos.find(v => v.id === q.videoId);
    if (video) {
      playVideo(video);
      setCurrentView('watch');
      if (q.timestampSec !== null) {
        setTimeout(() => seekToTime(q.timestampSec!), 300);
      }
    }
  };

  const handleSendReply = (qId: string) => {
    const text = replyMap[qId];
    if (!text || !text.trim()) return;

    addAnswer(qId, text.trim());
    setReplyMap(prev => ({ ...prev, [qId]: '' }));
    if (!expandedQIds.includes(qId)) {
      setExpandedQIds(prev => [...prev, qId]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 text-slate-100 select-none pb-12">
      {/* Header Banner */}
      <div className="p-6 bg-[#0e121e]/85 backdrop-blur-xl border border-white/[0.08] rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
              <HelpCircle className="w-6 h-6 text-emerald-400" />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white">
              Academic Q&A Forum Hub
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
            Collaborative doubt-clearing network across all course lectures. Search academic doubts, answer peers, or get instructor verification.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-white/[0.04] border border-white/10 rounded-xl text-xs text-slate-400 font-mono">
            <strong className="text-white font-bold">{questions.length}</strong> Total Questions
          </div>
          <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-400 font-mono">
            <strong className="text-white font-bold">
              {questions.filter(q => q.answers.some(a => a.isEndorsedByTeacher)).length}
            </strong> Teacher Verified
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="space-y-3 bg-[#0e121e]/85 backdrop-blur-xl p-4 border border-white/[0.08] rounded-2xl shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search */}
          <div className="md:col-span-8 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search across all lecture questions, code, theorems, or authors..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-black/60 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/50 shadow-inner"
            />
          </div>

          {/* Subject Dropdown */}
          <div className="md:col-span-4">
            <select
              value={selectedSubject}
              onChange={e => setSelectedSubject(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-black/60 border border-white/10 rounded-xl text-xs text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/40 shadow-inner"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat} className="bg-[#0e121e] text-white">
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Status filter chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all ${
              filterType === 'all'
                ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-extrabold shadow-xs'
                : 'bg-white/[0.04] border border-white/10 text-slate-400 hover:text-white hover:bg-white/[0.08]'
            }`}
          >
            All Questions ({questions.length})
          </button>

          <button
            onClick={() => setFilterType('unanswered')}
            className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all flex items-center gap-1.5 ${
              filterType === 'unanswered'
                ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-extrabold shadow-xs'
                : 'bg-white/[0.04] border border-white/10 text-slate-400 hover:text-white hover:bg-white/[0.08]'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-rose-400" />
            Unanswered / Needs Help
          </button>

          <button
            onClick={() => setFilterType('verified')}
            className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all flex items-center gap-1.5 ${
              filterType === 'verified'
                ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-extrabold shadow-xs'
                : 'bg-white/[0.04] border border-white/10 text-slate-400 hover:text-white hover:bg-white/[0.08]'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-amber-400" />
            Teacher Verified
          </button>

          <button
            onClick={() => setFilterType('mine')}
            className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all ${
              filterType === 'mine'
                ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-extrabold shadow-xs'
                : 'bg-white/[0.04] border border-white/10 text-slate-400 hover:text-white hover:bg-white/[0.08]'
            }`}
          >
            My Activity
          </button>
        </div>
      </div>

      {/* Questions list */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${selectedSubject}-${filterType}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-4"
        >
          {filteredQuestions.length === 0 ? (
          <div className="p-12 text-center bg-[#0e121e]/80 border border-white/[0.08] rounded-3xl text-slate-400 text-xs">
            No questions matching your search filters.
          </div>
        ) : (
          filteredQuestions.map(q => {
            const video = videos.find(v => v.id === q.videoId);
            const isExpanded = expandedQIds.includes(q.id) || q.answers.length <= 1;
            const hasTeacherAnswer = q.answers.some(
              a => a.isEndorsedByTeacher || a.author.role === 'teacher' || a.author.role === 'professor'
            );

            return (
              <div
                key={q.id}
                className={`p-5 rounded-2xl border transition-all ${
                  hasTeacherAnswer
                    ? 'bg-[#0e121e]/90 border-emerald-500/40 shadow-lg'
                    : 'bg-[#0e121e]/75 border-white/[0.08] hover:border-white/20'
                }`}
              >
                {/* Associated Video Link Banner */}
                {video && (
                  <div className="flex items-center justify-between gap-3 pb-3 mb-3 border-b border-white/[0.08]">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                        {video.subject}
                      </span>
                      <span className="text-xs text-slate-400 font-medium truncate">
                        Lecture: <strong className="text-white">{video.title}</strong>
                      </span>
                    </div>

                    <button
                      onClick={() => handleJumpToVideo(q)}
                      className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black rounded-lg text-xs font-bold transition-all flex-shrink-0 shadow-xs"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>
                        Watch @ {q.timestampSec !== null ? formatTime(q.timestampSec) : 'Start'}
                      </span>
                    </button>
                  </div>
                )}

                {/* Author Info */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={q.author.avatar}
                      alt={q.author.name}
                      className="w-8 h-8 rounded-full object-cover border border-white/10"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white">{q.author.name}</span>
                        {q.author.role === 'teacher' || q.author.role === 'professor' ? (
                          <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30">
                            Instructor
                          </span>
                        ) : (
                          <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-white/[0.05] text-slate-400">
                            Student
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {q.author.institution} • {q.createdAt}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {hasTeacherAnswer && (
                      <span className="flex items-center gap-1 px-2.5 py-1 bg-amber-500/10 text-amber-300 border border-amber-500/20 rounded-lg text-[10px] font-bold">
                        <Award className="w-3 h-3 text-amber-400" /> Instructor Verified
                      </span>
                    )}
                    {q.isResolved && (
                      <span className="p-1 text-emerald-400 bg-emerald-500/15 rounded-lg border border-emerald-500/30">
                        <CheckCircle2 className="w-4 h-4" />
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-base font-bold text-white mb-2 leading-snug">
                  {q.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line mb-3">
                  {q.content}
                </p>

                {q.codeSnippet && (
                  <pre className="p-3 mb-3 bg-black/60 border border-white/10 rounded-xl font-mono text-xs text-emerald-300 overflow-x-auto custom-scrollbar">
                    <code>{q.codeSnippet}</code>
                  </pre>
                )}

                {/* Footer Controls */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/[0.08]">
                  <div className="flex items-center gap-1.5">
                    {q.tags.map(t => (
                      <span
                        key={t}
                        className="text-[10px] px-2 py-0.5 bg-white/[0.04] text-slate-400 rounded-md border border-white/10"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => upvoteQuestion(q.id)}
                      className="flex items-center gap-1.5 px-3 py-1 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-300 hover:text-white rounded-lg text-xs font-semibold transition-colors"
                    >
                      <ThumbsUp className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{q.upvotes}</span>
                    </button>

                    <button
                      onClick={() => toggleExpand(q.id)}
                      className="flex items-center gap-1.5 px-3 py-1 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-300 hover:text-white rounded-lg text-xs font-semibold transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{q.answers.length} Replies</span>
                      {isExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded Replies */}
                {isExpanded && (
                  <div className="mt-4 pt-3 border-t border-white/[0.08] space-y-3 animate-fadeIn">
                    {q.answers.map(ans => {
                      const isTeacher =
                        ans.author.role === 'teacher' || ans.author.role === 'professor';

                      return (
                        <div
                          key={ans.id}
                          className={`p-3.5 rounded-xl border text-xs ${
                            ans.isEndorsedByTeacher || isTeacher
                              ? 'bg-emerald-950/20 border-emerald-500/40 shadow-xs'
                              : 'bg-black/40 border-white/10'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2">
                              <img
                                src={ans.author.avatar}
                                alt={ans.author.name}
                                className="w-6 h-6 rounded-full object-cover border border-white/10"
                              />
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-white">{ans.author.name}</span>
                                {isTeacher && (
                                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-0.5">
                                    <ShieldCheck className="w-2.5 h-2.5" /> Verified Instructor
                                  </span>
                                )}
                              </div>
                            </div>
                            <span className="text-[10px] text-slate-500 font-mono">{ans.createdAt}</span>
                          </div>

                          <p className="text-slate-200 leading-relaxed whitespace-pre-line mb-2">
                            {ans.content}
                          </p>

                          <div className="flex items-center justify-between pt-1 text-[11px]">
                            <button
                              onClick={() => upvoteAnswer(q.id, ans.id)}
                              className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/[0.04] text-slate-300 hover:text-white"
                            >
                              <ThumbsUp className="w-3 h-3 text-emerald-400" />
                              <span>{ans.upvotes}</span>
                            </button>

                            {currentRole === 'teacher' && (
                              <button
                                onClick={() => endorseAnswer(q.id, ans.id)}
                                className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
                              >
                                <Award className="w-3 h-3" />
                                {ans.isEndorsedByTeacher ? 'Remove Endorsement' : 'Endorse Answer'}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {/* Inline Reply Form */}
                    <div className="flex gap-2 pt-2">
                      <input
                        type="text"
                        placeholder="Write your answer or explanation..."
                        value={replyMap[q.id] || ''}
                        onChange={e =>
                          setReplyMap(prev => ({ ...prev, [q.id]: e.target.value }))
                        }
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleSendReply(q.id);
                          }
                        }}
                        className="flex-1 px-3.5 py-2 bg-black/60 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/40"
                      />
                      <button
                        onClick={() => handleSendReply(q.id)}
                        className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black rounded-xl text-xs font-extrabold transition-all flex items-center gap-1"
                      >
                        <Send className="w-3.5 h-3.5 text-black" />
                        <span>Reply</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
