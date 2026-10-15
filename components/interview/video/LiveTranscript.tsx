import React, { useState } from 'react';
import { 
  FileText, 
  Bookmark, 
  BookmarkCheck, 
  Search, 
  Mic, 
  Volume2, 
  Radio, 
  Plus
} from 'lucide-react';
import { TranscriptSnippet } from '../types';

interface LiveTranscriptProps {
  snippets: TranscriptSnippet[];
  onToggleBookmark: (snippetId: string) => void;
  onAddSnippet: (speaker: string, text: string) => void;
  interviewerName?: string;
  candidateName?: string;
}

export const LiveTranscript: React.FC<LiveTranscriptProps> = ({
  snippets,
  onToggleBookmark,
  onAddSnippet,
  interviewerName = 'Interviewer',
  candidateName = 'Candidate',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [newText, setNewText] = useState('');
  const [newSpeaker, setNewSpeaker] = useState(`${interviewerName} (Lead)`);

  const filtered = snippets.filter(s => 
    s.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.speaker.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;
    onAddSnippet(newSpeaker, newText.trim());
    setNewText('');
  };

  return (
    <div className="h-full flex flex-col bg-[#050a07] border-l border-emerald-950/70 text-slate-200">
      {/* Top Header */}
      <div className="p-3.5 border-b border-emerald-950/80 bg-[#07100c]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <h3 className="font-bold text-sm text-white">Live AI Transcript &amp; Diarization</h3>
          </div>
          <span className="text-[11px] text-emerald-400 font-mono">
            {snippets.length} segments
          </span>
        </div>
        <p className="text-xs text-emerald-400/70 mt-0.5">
          Real-time technical dialogue transcription &amp; speaker isolation
        </p>

        {/* Search */}
        <div className="mt-2.5 relative">
          <Search className="w-3.5 h-3.5 text-emerald-600 absolute left-2.5 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search transcript, keywords, or topics..."
            className="w-full text-xs bg-[#030705] border border-emerald-900/60 rounded-lg pl-8 pr-3 py-1.5 text-emerald-100 placeholder-emerald-800 focus:outline-none focus:border-emerald-500 font-mono"
          />
        </div>
      </div>

      {/* Snippet Feed */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {filtered.map((s) => {
          const isInterviewer = s.speaker.toLowerCase().includes('lead') || s.speaker.toLowerCase().includes('interviewer') || s.speaker.toLowerCase().includes('dheeraj');
          return (
            <div
              key={s.id}
              className={`p-3 rounded-xl border text-xs transition-all ${
                s.isBookmarked
                  ? 'bg-emerald-950/40 border-emerald-500/60 text-white shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                  : 'bg-[#08120d] border-white/5 text-emerald-200/90'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] mb-1">
                <div className="flex items-center gap-1.5">
                  <span className={`font-bold ${isInterviewer ? 'text-emerald-400' : 'text-emerald-300'}`}>
                    {s.speaker}
                  </span>
                  <span className="text-emerald-800">·</span>
                  <span className="text-emerald-500 font-mono">{s.timestamp}</span>
                </div>
                <button
                  onClick={() => onToggleBookmark(s.id)}
                  title={s.isBookmarked ? 'Remove bookmark' : 'Bookmark this point for debrief'}
                  className={`p-1 rounded transition-colors ${
                    s.isBookmarked ? 'text-emerald-400' : 'text-emerald-700 hover:text-emerald-300'
                  }`}
                >
                  {s.isBookmarked ? (
                    <BookmarkCheck className="w-3.5 h-3.5" />
                  ) : (
                    <Bookmark className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
              <p className="leading-relaxed font-sans text-slate-100">
                {s.text}
              </p>
            </div>
          );
        })}
      </div>

      {/* Add note/spoken turn input */}
      <form onSubmit={handleManualAdd} className="p-3 border-t border-emerald-950/80 bg-[#07100c] flex flex-col gap-2">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-emerald-400 font-mono">Append dialogue turn:</span>
          <select
            value={newSpeaker}
            onChange={(e) => setNewSpeaker(e.target.value)}
            className="bg-[#030705] text-emerald-300 border border-white/10 rounded-md px-2 py-0.5 text-[11px] focus:outline-none font-mono"
          >
            <option value={`${interviewerName} (Lead)`}>{interviewerName} (Lead Interviewer)</option>
            <option value={`${candidateName} (Candidate)`}>{candidateName} (Candidate)</option>
            <option value="Panelist">Technical Panelist</option>
          </select>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="Type spoken response or notes to append to transcript..."
            className="flex-1 text-xs bg-[#030705] border border-white/10 rounded-lg px-3 py-1.5 text-emerald-100 placeholder-emerald-800 focus:outline-none focus:border-emerald-500 font-sans"
          />
          <button
            type="submit"
            className="btn-metallic-emerald px-3 py-1.5 rounded-lg text-xs font-bold shadow-[0_0_8px_rgba(16,185,129,0.4)]"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
};
