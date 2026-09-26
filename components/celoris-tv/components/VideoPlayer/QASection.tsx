import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Video, QAQuestion, QAAnswer } from '../../types';
import { formatTime } from '../../utils/formatters';
import {
  MessageSquare,
  HelpCircle,
  Clock,
  CheckCircle2,
  Send,
  Award,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Plus,
  ShieldCheck,
  Search,
  Check,
} from 'lucide-react';
import { AskQuestionModal } from '../Modals/AskQuestionModal';

interface Props {
  video: Video;
}

type QAFilter = 'all' | 'teacher_verified' | 'unresolved' | 'my_questions';

export const QASection: React.FC<Props> = ({ video }) => {
  const {
    questions,
    videoCurrentTime,
    seekToTime,
    currentUser,
    currentRole,
    addAnswer,
    endorseAnswer,
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<QAFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAskModal, setShowAskModal] = useState(false);
  const [expandedQuestionIds, setExpandedQuestionIds] = useState<string[]>([]);
  const [replyTextMap, setReplyTextMap] = useState<Record<string, string>>({});

  // Filter questions for the current video
  const videoQuestions = questions.filter(q => q.videoId === video.id);

  // Apply sub-filters
  const filteredQuestions = videoQuestions.filter(q => {
    // Search match
    if (searchQuery.trim()) {
      const matchText = `${q.title} ${q.content} ${q.author.name} ${q.tags.join(' ')}`.toLowerCase();
      if (!matchText.includes(searchQuery.toLowerCase())) return false;
    }

    if (activeFilter === 'teacher_verified') {
      return q.answers.some(a => a.isEndorsedByTeacher || a.author.role === 'teacher' || a.author.role === 'professor');
    }

    if (activeFilter === 'unresolved') {
      return !q.isResolved && q.answers.length === 0;
    }

    if (activeFilter === 'my_questions') {
      return q.author.id === currentUser.id;
    }

    return true;
  });

  const toggleExpand = (qId: string) => {
    setExpandedQuestionIds(prev =>
      prev.includes(qId) ? prev.filter(id => id !== qId) : [...prev, qId]
    );
  };

  const handleReplySubmit = (questionId: string) => {
    const text = replyTextMap[questionId];
    if (!text || !text.trim()) return;

    addAnswer(questionId, text.trim());
    setReplyTextMap(prev => ({ ...prev, [questionId]: '' }));
    if (!expandedQuestionIds.includes(questionId)) {
      setExpandedQuestionIds(prev => [...prev, questionId]);
    }
  };

  return (
    <div className="space-y-4 select-none">
      {/* Q&A Header & Ask Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-[#0e121e]/85 backdrop-blur-xl border border-white/[0.08] rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-extrabold text-white tracking-tight flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-emerald-400" />
              Integrated Academic Q&A
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 font-mono text-xs font-bold">
              {videoQuestions.length}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Ask doubts anchored to video timestamps & receive verified instructor answers
          </p>
        </div>

        <button
          onClick={() => setShowAskModal(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black text-xs font-extrabold rounded-xl shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" /> Ask a Question
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-2.5">
        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search questions by concept, formula, or author..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/[0.03] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/50 transition-all shadow-inner"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar text-xs">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all ${
              activeFilter === 'all'
                ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-extrabold shadow-xs'
                : 'bg-white/[0.04] border border-white/10 text-slate-400 hover:text-white hover:bg-white/[0.08]'
            }`}
          >
            All Questions ({videoQuestions.length})
          </button>

          <button
            onClick={() => setActiveFilter('teacher_verified')}
            className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all ${
              activeFilter === 'teacher_verified'
                ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-extrabold shadow-xs'
                : 'bg-white/[0.04] border border-white/10 text-slate-400 hover:text-white hover:bg-white/[0.08]'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-amber-400" />
            Teacher Verified
          </button>

          <button
            onClick={() => setActiveFilter('unresolved')}
            className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all ${
              activeFilter === 'unresolved'
                ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-extrabold shadow-xs'
                : 'bg-white/[0.04] border border-white/10 text-slate-400 hover:text-white hover:bg-white/[0.08]'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-rose-400" />
            Unresolved Doubts
          </button>

          <button
            onClick={() => setActiveFilter('my_questions')}
            className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all ${
              activeFilter === 'my_questions'
                ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-extrabold shadow-xs'
                : 'bg-white/[0.04] border border-white/10 text-slate-400 hover:text-white hover:bg-white/[0.08]'
            }`}
          >
            My Questions
          </button>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-3">
        {filteredQuestions.length === 0 ? (
          <div className="p-8 bg-[#0e121e]/80 border border-white/[0.08] rounded-2xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-3">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-white mb-1">No Questions Found</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
              Have a question about this lecture? Post a question to get answers from the instructor and peers.
            </p>
            <button
              onClick={() => setShowAskModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-black text-xs font-extrabold rounded-xl shadow-md transition-all"
            >
              Ask Question at {formatTime(videoCurrentTime)}
            </button>
          </div>
        ) : (
          filteredQuestions.map(q => {
            const isExpanded = expandedQuestionIds.includes(q.id) || q.answers.length <= 2;
            const hasTeacherAnswer = q.answers.some(
              a => a.isEndorsedByTeacher || a.author.role === 'teacher' || a.author.role === 'professor'
            );

            return (
              <div
                key={q.id}
                className={`p-4 rounded-2xl border transition-all ${
                  hasTeacherAnswer
                    ? 'bg-[#0e121e]/90 border-emerald-500/40 shadow-md'
                    : 'bg-[#0e121e]/70 border-white/[0.08] hover:border-white/20'
                }`}
              >
                {/* Question Author & Badges */}
                <div className="flex items-start justify-between gap-3 mb-2.5">
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
                          <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-white/[0.05] text-slate-400 font-medium">
                            Student
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {/* Clickable timestamp anchor badge */}
                    {q.timestampSec !== null && (
                      <button
                        onClick={() => seekToTime(q.timestampSec!)}
                        className="flex items-center gap-1 px-2.5 py-1 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 hover:text-white rounded-lg font-mono text-[11px] font-bold transition-all shadow-xs"
                        title="Jump video to this timestamp"
                      >
                        <Clock className="w-3 h-3 text-emerald-400" />
                        <span>▶ {formatTime(q.timestampSec)}</span>
                      </button>
                    )}

                    {/* Teacher verified badge */}
                    {hasTeacherAnswer && (
                      <span
                        className="flex items-center gap-1 px-2 py-1 bg-amber-500/10 text-amber-300 border border-amber-500/20 rounded-lg text-[10px] font-bold"
                        title="Has verified instructor answer"
                      >
                        <Award className="w-3 h-3 text-amber-400" />
                        <span className="hidden sm:inline">Verified</span>
                      </span>
                    )}

                    {q.isResolved && (
                      <span
                        className="p-1 text-emerald-400 bg-emerald-500/10 rounded-lg border border-emerald-500/20"
                        title="Marked as resolved"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </span>
                    )}
                  </div>
                </div>

                {/* Question Title & Content */}
                <h4 className="text-sm font-bold text-white mb-1.5 leading-snug">
                  {q.title}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line mb-3">
                  {q.content}
                </p>

                {/* Optional code snippet */}
                {q.codeSnippet && (
                  <pre className="p-3 mb-3 bg-black/60 border border-white/10 rounded-xl font-mono text-xs text-emerald-300 overflow-x-auto custom-scrollbar">
                    <code>{q.codeSnippet}</code>
                  </pre>
                )}

                {/* Tags and Actions Row */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/[0.08]">
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
                    {/* Replies count button */}
                    <button
                      onClick={() => toggleExpand(q.id)}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{q.answers.length} Answers</span>
                      {isExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Answers Thread */}
                {isExpanded && (
                  <div className="mt-4 pt-3 border-t border-white/[0.08] space-y-3 animate-fadeIn">
                    {q.answers.length === 0 ? (
                      <p className="text-xs text-slate-500 italic py-1">
                        No answers yet. If you know the solution, post your answer below!
                      </p>
                    ) : (
                      q.answers.map(ans => {
                        const isTeacher =
                          ans.author.role === 'teacher' || ans.author.role === 'professor';

                        return (
                          <div
                            key={ans.id}
                            className={`p-3.5 rounded-xl border text-xs ${
                              ans.isEndorsedByTeacher || isTeacher
                                ? 'bg-emerald-950/20 border-emerald-500/40 shadow-xs'
                                : 'bg-white/[0.03] border-white/10'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div className="flex items-center gap-2">
                                <img
                                  src={ans.author.avatar}
                                  alt={ans.author.name}
                                  className="w-6 h-6 rounded-full object-cover border border-white/10"
                                />
                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-bold text-white">{ans.author.name}</span>
                                    {isTeacher && (
                                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-0.5">
                                        <ShieldCheck className="w-2.5 h-2.5" /> Instructor
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-[10px] text-slate-500">
                                    {ans.createdAt}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5">
                                {ans.isEndorsedByTeacher && (
                                  <span className="px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[10px] font-bold flex items-center gap-1">
                                    <Award className="w-3 h-3 text-amber-400" /> Endorsed
                                  </span>
                                )}

                                {ans.isAccepted && (
                                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold flex items-center gap-1">
                                    <Check className="w-3 h-3 text-emerald-400" /> Accepted
                                  </span>
                                )}
                              </div>
                            </div>

                            <p className="text-slate-300 leading-relaxed whitespace-pre-line mb-2.5">
                              {ans.content}
                            </p>

                            {/* Teacher Endorse button (Teacher mode) */}
                            {currentRole === 'teacher' && (
                              <div className="flex items-center justify-end pt-1 text-[11px]">
                                <button
                                  onClick={() => endorseAnswer(q.id, ans.id)}
                                  className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
                                >
                                  <Award className="w-3 h-3" />
                                  {ans.isEndorsedByTeacher ? 'Remove Endorsement' : 'Endorse Answer'}
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}

                    {/* Inline Reply Box */}
                    <div className="flex gap-2 pt-2">
                      <input
                        type="text"
                        placeholder="Write a clear, helpful answer or solution..."
                        value={replyTextMap[q.id] || ''}
                        onChange={e =>
                          setReplyTextMap(prev => ({ ...prev, [q.id]: e.target.value }))
                        }
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleReplySubmit(q.id);
                          }
                        }}
                        className="flex-1 px-3.5 py-2 bg-white/[0.04] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/50"
                      />
                      <button
                        onClick={() => handleReplySubmit(q.id)}
                        className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 shadow-sm"
                      >
                        <Send className="w-3.5 h-3.5 text-black" />
                        <span className="hidden sm:inline">Reply</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <AskQuestionModal
        isOpen={showAskModal}
        onClose={() => setShowAskModal(false)}
        video={video}
        defaultTimestamp={Math.floor(videoCurrentTime)}
      />
    </div>
  );
};
