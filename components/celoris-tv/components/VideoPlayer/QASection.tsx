import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Video, QAQuestion, QAAnswer } from '../../types';
import { formatTime } from '../../utils/formatters';
import {
  MessageSquare,
  HelpCircle,
  Clock,
  CheckCircle2,
  Sparkles,
  Send,
  Filter,
  Search,
  Check,
  Award,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Plus,
  Tag,
  ShieldCheck,
  Flame,
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
    acceptAnswer,
    toggleResolveQuestion,
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
    <div className="space-y-4">
      {/* Q&A Header & Ask Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-[#161B16] border border-[#242A24] rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#7F9172]" />
              Integrated Academic Q&A
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-[#7F9172]/20 text-[#A8B89C] font-mono text-xs font-bold">
              {videoQuestions.length}
            </span>
          </div>
          <p className="text-xs text-[#95A395] mt-0.5">
            Ask doubts anchored to video timestamps & receive verified instructor answers
          </p>
        </div>

        <button
          onClick={() => setShowAskModal(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#7F9172] hover:bg-[#91A582] text-[#0D0F0D] text-xs font-bold rounded-xl shadow-lg shadow-[#7F9172]/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-4 h-4 text-[#0D0F0D]" /> Ask a Question
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-2.5">
        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#95A395] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search questions by concept, formula, or author..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#161B16] border border-[#242A24] rounded-xl text-xs text-white placeholder-[#5E6C5E] focus:outline-hidden focus:ring-2 focus:ring-[#7F9172] transition-all"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar text-xs">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all ${
              activeFilter === 'all'
                ? 'bg-[#7F9172] text-[#0D0F0D] font-bold shadow-xs'
                : 'bg-[#161B16] border border-[#242A24] text-[#95A395] hover:bg-[#1E241E] hover:text-white'
            }`}
          >
            All Questions ({videoQuestions.length})
          </button>

          <button
            onClick={() => setActiveFilter('teacher_verified')}
            className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap flex items-center gap-1.5 transition-all ${
              activeFilter === 'teacher_verified'
                ? 'bg-[#7F9172] text-[#0D0F0D] font-bold shadow-xs'
                : 'bg-[#161B16] border border-[#242A24] text-[#95A395] hover:bg-[#1E241E] hover:text-white'
            }`}
          >
            <Award className={`w-3.5 h-3.5 ${activeFilter === 'teacher_verified' ? 'text-[#0D0F0D]' : 'text-[#D2B48C]'}`} />
            Teacher Verified
          </button>

          <button
            onClick={() => setActiveFilter('unresolved')}
            className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap flex items-center gap-1.5 transition-all ${
              activeFilter === 'unresolved'
                ? 'bg-[#7F9172] text-[#0D0F0D] font-bold shadow-xs'
                : 'bg-[#161B16] border border-[#242A24] text-[#95A395] hover:bg-[#1E241E] hover:text-white'
            }`}
          >
            <HelpCircle className={`w-3.5 h-3.5 ${activeFilter === 'unresolved' ? 'text-[#0D0F0D]' : 'text-[#C87D55]'}`} />
            Unresolved Doubts
          </button>

          <button
            onClick={() => setActiveFilter('my_questions')}
            className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all ${
              activeFilter === 'my_questions'
                ? 'bg-[#7F9172] text-[#0D0F0D] font-bold shadow-xs'
                : 'bg-[#161B16] border border-[#242A24] text-[#95A395] hover:bg-[#1E241E] hover:text-white'
            }`}
          >
            My Questions
          </button>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-3">
        {filteredQuestions.length === 0 ? (
          <div className="p-8 bg-[#161B16] border border-[#242A24] rounded-2xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#7F9172]/15 text-[#7F9172] flex items-center justify-center mx-auto mb-3">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-white mb-1">No Questions Found</h4>
            <p className="text-xs text-[#95A395] max-w-sm mx-auto mb-4">
              Have a question about this lecture? Post a question to get answers from the instructor and peers.
            </p>
            <button
              onClick={() => setShowAskModal(true)}
              className="px-4 py-2 bg-[#7F9172] hover:bg-[#91A582] text-[#0D0F0D] text-xs font-bold rounded-xl transition-all"
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
                    ? 'bg-[#161B16] border-[#7F9172]/40 shadow-md'
                    : 'bg-[#161B16] border-[#242A24] hover:border-[#2E382E]'
                }`}
              >
                {/* Question Author & Badges */}
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={q.author.avatar}
                      alt={q.author.name}
                      className="w-8 h-8 rounded-full object-cover border border-[#2E382E]"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white">{q.author.name}</span>
                        {q.author.role === 'teacher' || q.author.role === 'professor' ? (
                          <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-[#7F9172]/20 text-[#A8B89C] font-semibold border border-[#7F9172]/30">
                            Instructor
                          </span>
                        ) : (
                          <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-[#1E241E] text-[#95A395] font-medium">
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
                        className="flex items-center gap-1 px-2.5 py-1 bg-[#7F9172]/20 hover:bg-[#7F9172]/35 border border-[#7F9172]/40 text-[#A8B89C] hover:text-white rounded-lg font-mono text-[11px] font-bold transition-all shadow-xs"
                        title="Jump video to this timestamp"
                      >
                        <Clock className="w-3 h-3" />
                        <span>▶ {formatTime(q.timestampSec)}</span>
                      </button>
                    )}

                    {/* Teacher verified badge */}
                    {hasTeacherAnswer && (
                      <span
                        className="flex items-center gap-1 px-2 py-1 bg-[#D2B48C]/15 text-[#D2B48C] border border-[#D2B48C]/30 rounded-lg text-[10px] font-bold"
                        title="Has verified instructor answer"
                      >
                        <Award className="w-3 h-3 text-[#D2B48C]" />
                        <span className="hidden sm:inline">Verified Answer</span>
                      </span>
                    )}

                    {q.isResolved && (
                      <span
                        className="p-1 text-[#5C8A67] bg-[#263D28]/50 rounded-lg"
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
                <p className="text-xs text-[#E0E5E0] leading-relaxed whitespace-pre-line mb-3">
                  {q.content}
                </p>

                {/* Optional code snippet */}
                {q.codeSnippet && (
                  <pre className="p-3 mb-3 bg-[#0D0F0D] border border-[#242A24] rounded-xl font-mono text-xs text-[#A8B89C] overflow-x-auto custom-scrollbar">
                    <code>{q.codeSnippet}</code>
                  </pre>
                )}

                {/* Tags and Actions Row */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#242A24]">
                  <div className="flex items-center gap-1.5">
                    {q.tags.map(t => (
                      <span
                        key={t}
                        className="text-[10px] px-2 py-0.5 bg-[#181D18] text-[#95A395] rounded-md border border-[#2A322A]"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Replies count button */}
                    <button
                      onClick={() => toggleExpand(q.id)}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#181D18] hover:bg-[#222922] border border-[#2A322A] text-[#95A395] hover:text-white text-xs font-semibold transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-[#7F9172]" />
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
                  <div className="mt-4 pt-3 border-t border-[#242A24] space-y-3 animate-fadeIn">
                    {q.answers.length === 0 ? (
                      <p className="text-xs text-[#5E6C5E] italic py-1">
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
                                ? 'bg-[#181F18] border-[#7F9172]/40 shadow-xs'
                                : 'bg-[#121512] border-[#242A24]'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div className="flex items-center gap-2">
                                <img
                                  src={ans.author.avatar}
                                  alt={ans.author.name}
                                  className="w-6 h-6 rounded-full object-cover border border-[#2E382E]"
                                />
                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-bold text-white">{ans.author.name}</span>
                                    {isTeacher && (
                                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-[#7F9172]/20 text-[#A8B89C] border border-[#7F9172]/30 flex items-center gap-0.5">
                                        <ShieldCheck className="w-2.5 h-2.5" /> Instructor
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-[10px] text-[#95A395]">
                                    {ans.createdAt}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5">
                                {ans.isEndorsedByTeacher && (
                                  <span className="px-2 py-0.5 rounded-md bg-[#D2B48C]/15 text-[#D2B48C] border border-[#D2B48C]/30 text-[10px] font-bold flex items-center gap-1">
                                    <Award className="w-3 h-3 text-[#D2B48C]" /> Endorsed
                                  </span>
                                )}

                                {ans.isAccepted && (
                                  <span className="px-2 py-0.5 rounded-md bg-[#263D28] text-[#C4E3C9] border border-[#5C8A67] text-[10px] font-bold flex items-center gap-1">
                                    <Check className="w-3 h-3 text-[#5C8A67]" /> Accepted
                                  </span>
                                )}
                              </div>
                            </div>

                            <p className="text-[#E0E5E0] leading-relaxed whitespace-pre-line mb-2.5">
                              {ans.content}
                            </p>

                            {/* Teacher Endorse button (Teacher mode) */}
                            {currentRole === 'teacher' && (
                              <div className="flex items-center justify-end pt-1 text-[11px]">
                                <button
                                  onClick={() => endorseAnswer(q.id, ans.id)}
                                  className="text-[#D2B48C] hover:text-white font-semibold flex items-center gap-1"
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
                        className="flex-1 px-3.5 py-2 bg-[#121512] border border-[#242A24] rounded-xl text-xs text-white placeholder-[#5E6C5E] focus:outline-hidden focus:ring-2 focus:ring-[#7F9172]"
                      />
                      <button
                        onClick={() => handleReplySubmit(q.id)}
                        className="px-4 py-2 bg-[#7F9172] hover:bg-[#91A582] text-[#0D0F0D] rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5 text-[#0D0F0D]" />
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
