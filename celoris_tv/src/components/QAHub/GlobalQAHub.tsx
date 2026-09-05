import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { QAQuestion, Video } from '../../types';
import { formatTime } from '../../utils/formatters';
import { CATEGORIES } from '../../data/mockData';
import {
  MessageSquare,
  HelpCircle,
  Clock,
  ThumbsUp,
  Award,
  CheckCircle2,
  Play,
  Search,
  Filter,
  Sparkles,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Send,
  ShieldCheck,
  Check,
} from 'lucide-react';

export const GlobalQAHub: React.FC = () => {
  const {
    questions,
    videos,
    playVideo,
    currentUser,
    currentRole,
    addAnswer,
    upvoteQuestion,
    upvoteAnswer,
    endorseAnswer,
  } = useApp();

  const [selectedSubject, setSelectedSubject] = useState('All Subjects');
  const [filterType, setFilterType] = useState<'all' | 'unanswered' | 'verified' | 'mine'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedQIds, setExpandedQIds] = useState<string[]>([]);
  const [replyMap, setReplyMap] = useState<Record<string, string>>({});

  const filteredQuestions = questions.filter(q => {
    // Find associated video
    const video = videos.find(v => v.id === q.videoId);

    // Subject filter
    if (selectedSubject !== 'All Subjects' && video && video.subject !== selectedSubject && video.category !== selectedSubject) {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const matchText = `${q.title} ${q.content} ${q.author.name} ${q.tags.join(' ')} ${video?.title || ''}`.toLowerCase();
      if (!matchText.includes(searchQuery.toLowerCase())) return false;
    }

    // Status filter
    if (filterType === 'unanswered') {
      return q.answers.length === 0 && !q.isResolved;
    }
    if (filterType === 'verified') {
      return q.answers.some(a => a.isEndorsedByTeacher || a.author.role === 'teacher' || a.author.role === 'professor');
    }
    if (filterType === 'mine') {
      return q.author.id === currentUser.id;
    }

    return true;
  });

  const handleJumpToVideo = (q: QAQuestion) => {
    const video = videos.find(v => v.id === q.videoId);
    if (video) {
      playVideo(video);
      if (q.timestampSec !== null) {
        // Will seek automatically via state
      }
    }
  };

  const toggleExpand = (qId: string) => {
    setExpandedQIds(prev =>
      prev.includes(qId) ? prev.filter(id => id !== qId) : [...prev, qId]
    );
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
    <div className="max-w-7xl mx-auto space-y-6 text-[#E0E5E0]">
      {/* Header Banner */}
      <div className="p-6 bg-[#161B16] border border-[#242A24] rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <div className="p-2.5 bg-[#7F9172]/20 text-[#A8B89C] rounded-xl border border-[#7F9172]/30">
              <HelpCircle className="w-6 h-6 text-[#7F9172]" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Academic Q&A Forum Hub
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#95A395] max-w-2xl leading-relaxed">
            Collaborative doubt-clearing network across all course lectures. Search academic doubts, answer peers, or get instructor verification.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-[#1E241E] border border-[#242A24] rounded-xl text-xs text-[#95A395]">
            <strong className="text-white font-bold">{questions.length}</strong> Total Questions
          </div>
          <div className="px-4 py-2 bg-[#7F9172]/15 border border-[#7F9172]/30 rounded-xl text-xs text-[#A8B89C]">
            <strong className="text-[#E0E5E0] font-bold">
              {questions.filter(q => q.answers.some(a => a.isEndorsedByTeacher)).length}
            </strong> Teacher Verified
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="space-y-3 bg-[#161B16] p-4 border border-[#242A24] rounded-2xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search */}
          <div className="md:col-span-8 relative">
            <Search className="w-4 h-4 text-[#95A395] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search across all lecture questions, code, theorems, or authors..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#0D0F0D] border border-[#242A24] rounded-xl text-xs text-[#E0E5E0] placeholder-[#5E6C5E] focus:outline-hidden focus:ring-2 focus:ring-[#7F9172]"
            />
          </div>

          {/* Subject Dropdown */}
          <div className="md:col-span-4">
            <select
              value={selectedSubject}
              onChange={e => setSelectedSubject(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#0D0F0D] border border-[#242A24] rounded-xl text-xs text-[#E0E5E0] focus:outline-hidden focus:ring-2 focus:ring-[#7F9172]"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>
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
            className={`px-3.5 py-1.5 rounded-xl font-medium transition-all ${
              filterType === 'all'
                ? 'bg-[#7F9172] text-[#0D0F0D] font-bold'
                : 'bg-[#1E241E] text-[#95A395] hover:text-white'
            }`}
          >
            All Questions ({questions.length})
          </button>

          <button
            onClick={() => setFilterType('unanswered')}
            className={`px-3.5 py-1.5 rounded-xl font-medium transition-all flex items-center gap-1.5 ${
              filterType === 'unanswered'
                ? 'bg-[#7F9172] text-[#0D0F0D] font-bold'
                : 'bg-[#1E241E] text-[#95A395] hover:text-white'
            }`}
          >
            <HelpCircle className={`w-3.5 h-3.5 ${filterType === 'unanswered' ? 'text-[#0D0F0D]' : 'text-[#C87D55]'}`} />
            Unanswered / Needs Help
          </button>

          <button
            onClick={() => setFilterType('verified')}
            className={`px-3.5 py-1.5 rounded-xl font-medium transition-all flex items-center gap-1.5 ${
              filterType === 'verified'
                ? 'bg-[#7F9172] text-[#0D0F0D] font-bold'
                : 'bg-[#1E241E] text-[#95A395] hover:text-white'
            }`}
          >
            <Award className={`w-3.5 h-3.5 ${filterType === 'verified' ? 'text-[#0D0F0D]' : 'text-[#D2B48C]'}`} />
            Teacher Verified
          </button>

          <button
            onClick={() => setFilterType('mine')}
            className={`px-3.5 py-1.5 rounded-xl font-medium transition-all ${
              filterType === 'mine'
                ? 'bg-[#7F9172] text-[#0D0F0D] font-bold'
                : 'bg-[#1E241E] text-[#95A395] hover:text-white'
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
          <div className="p-12 text-center bg-[#161B16]/60 border border-[#242A24] rounded-3xl text-[#95A395] text-xs">
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
                    ? 'bg-[#161B16] border-[#7F9172]/40 shadow-lg'
                    : 'bg-[#161B16] border-[#242A24] hover:border-[#384238]'
                }`}
              >
                {/* Associated Video Link Banner */}
                {video && (
                  <div className="flex items-center justify-between gap-3 pb-3 mb-3 border-b border-[#242A24]">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="px-2 py-0.5 rounded-md bg-[#7F9172]/20 text-[#A8B89C] border border-[#7F9172]/30 text-[10px] font-bold">
                        {video.subject}
                      </span>
                      <span className="text-xs text-[#95A395] font-medium truncate">
                        Lecture: <strong className="text-white">{video.title}</strong>
                      </span>
                    </div>

                    <button
                      onClick={() => handleJumpToVideo(q)}
                      className="flex items-center gap-1.5 px-3 py-1 bg-[#7F9172]/20 hover:bg-[#7F9172] text-[#A8B89C] hover:text-[#0D0F0D] rounded-lg text-xs font-bold transition-all flex-shrink-0"
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
                          <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-[#1E241E] text-[#95A395]">
                            Student
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-[#95A395]">
                        {q.author.institution} • {q.createdAt}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {hasTeacherAnswer && (
                      <span className="flex items-center gap-1 px-2.5 py-1 bg-[#D2B48C]/15 text-[#D2B48C] border border-[#D2B48C]/30 rounded-lg text-[10px] font-bold">
                        <Award className="w-3 h-3 text-[#D2B48C]" /> Instructor Verified
                      </span>
                    )}
                    {q.isResolved && (
                      <span className="p-1 text-[#5C8A67] bg-[#5C8A67]/15 rounded-lg">
                        <CheckCircle2 className="w-4 h-4" />
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-base font-bold text-white mb-2 leading-snug">
                  {q.title}
                </h3>
                <p className="text-xs text-[#E0E5E0] leading-relaxed whitespace-pre-line mb-3">
                  {q.content}
                </p>

                {q.codeSnippet && (
                  <pre className="p-3 mb-3 bg-[#0D0F0D] border border-[#242A24] rounded-xl font-mono text-xs text-[#A8B89C] overflow-x-auto custom-scrollbar">
                    <code>{q.codeSnippet}</code>
                  </pre>
                )}

                {/* Footer Controls */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#242A24]">
                  <div className="flex items-center gap-1.5">
                    {q.tags.map(t => (
                      <span
                        key={t}
                        className="text-[10px] px-2 py-0.5 bg-[#1E241E] text-[#95A395] rounded-md border border-[#2E382E]"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => upvoteQuestion(q.id)}
                      className="flex items-center gap-1.5 px-3 py-1 bg-[#1E241E] hover:bg-[#7F9172]/20 border border-[#2E382E] text-[#E0E5E0] hover:text-[#A8B89C] rounded-lg text-xs font-semibold transition-colors"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{q.upvotes}</span>
                    </button>

                    <button
                      onClick={() => toggleExpand(q.id)}
                      className="flex items-center gap-1.5 px-3 py-1 bg-[#1E241E] hover:bg-[#2A332A] text-[#E0E5E0] rounded-lg text-xs font-semibold transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-[#7F9172]" />
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
                  <div className="mt-4 pt-3 border-t border-[#242A24] space-y-3 animate-fadeIn">
                    {q.answers.map(ans => {
                      const isTeacher =
                        ans.author.role === 'teacher' || ans.author.role === 'professor';

                      return (
                        <div
                          key={ans.id}
                          className={`p-3.5 rounded-xl border text-xs ${
                            ans.isEndorsedByTeacher || isTeacher
                              ? 'bg-[#1E261E] border-[#7F9172]/40 shadow-xs'
                              : 'bg-[#0D0F0D] border-[#242A24]'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2">
                              <img
                                src={ans.author.avatar}
                                alt={ans.author.name}
                                className="w-6 h-6 rounded-full object-cover"
                              />
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-white">{ans.author.name}</span>
                                {isTeacher && (
                                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-[#7F9172]/20 text-[#A8B89C] border border-[#7F9172]/30 flex items-center gap-0.5">
                                    <ShieldCheck className="w-2.5 h-2.5" /> Verified Instructor
                                  </span>
                                )}
                              </div>
                            </div>
                            <span className="text-[10px] text-[#95A395]">{ans.createdAt}</span>
                          </div>

                          <p className="text-[#E0E5E0] leading-relaxed whitespace-pre-line mb-2">
                            {ans.content}
                          </p>

                          <div className="flex items-center justify-between pt-1 text-[11px]">
                            <button
                              onClick={() => upvoteAnswer(q.id, ans.id)}
                              className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#1E241E] text-[#E0E5E0]"
                            >
                              <ThumbsUp className="w-3 h-3" />
                              <span>{ans.upvotes}</span>
                            </button>

                            {currentRole === 'teacher' && (
                              <button
                                onClick={() => endorseAnswer(q.id, ans.id)}
                                className="text-[#D2B48C] hover:text-white font-semibold flex items-center gap-1"
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
                        className="flex-1 px-3.5 py-2 bg-[#0D0F0D] border border-[#242A24] rounded-xl text-xs text-[#E0E5E0] placeholder-[#5E6C5E] focus:outline-hidden focus:ring-2 focus:ring-[#7F9172]"
                      />
                      <button
                        onClick={() => handleSendReply(q.id)}
                        className="px-4 py-2 bg-[#7F9172] hover:bg-[#91A582] text-[#0D0F0D] rounded-xl text-xs font-bold transition-all flex items-center gap-1"
                      >
                        <Send className="w-3.5 h-3.5 text-[#0D0F0D]" />
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
