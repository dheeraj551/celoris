import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { Video } from '../../types';
import { formatTime } from '../../utils/formatters';
import {
  Bookmark,
  History,
  Play,
  Trash2,
  FileDown,
  Search,
} from 'lucide-react';

export const NotesHistoryView: React.FC = () => {
  const {
    userNotes,
    videos,
    deleteNote,
    playVideo,
    currentUser,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'notes' | 'history'>('notes');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNotes = userNotes.filter(n => {
    const vid = videos.find(v => v.id === n.videoId);
    const text = `${n.title} ${n.text} ${vid?.title || ''}`.toLowerCase();
    return text.includes(searchQuery.toLowerCase());
  });

  const historyVideos = currentUser.historyVideoIds
    .map(id => videos.find(v => v.id === id))
    .filter((v): v is Video => !!v);

  const handleExportAllNotes = () => {
    const content = [
      `# Celoris TV Complete Academic Notes Archive`,
      `**Student:** ${currentUser.name} (${currentUser.institution})`,
      `**Export Date:** ${new Date().toLocaleDateString()}`,
      `\n---\n`,
      ...userNotes.map(n => {
        const vid = videos.find(v => v.id === n.videoId);
        return `## ${vid?.title || 'Lecture'}\n**Timestamp: ${formatTime(n.timestampSec)}** | *${n.title}*\n${n.text}\n`;
      }),
    ].join('\n\n');

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Celoris_TV_All_Study_Notes.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 text-slate-200 pb-12">
      {/* Header */}
      <div className="p-6 bg-[#0e121e]/85 backdrop-blur-xl border border-white/[0.08] rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Bookmark className="w-6 h-6 text-emerald-400" />
            Study Notes & Watch History
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Access all your timestamped study notes and resume recently watched lectures
          </p>
        </div>

        {userNotes.length > 0 && activeTab === 'notes' && (
          <button
            onClick={handleExportAllNotes}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:opacity-90 text-black rounded-xl text-xs font-extrabold shadow-lg shadow-emerald-500/20 transition-all flex-shrink-0 hover:scale-[1.02] active:scale-95"
          >
            <FileDown className="w-4 h-4 text-black stroke-[2.5]" /> Export All Notes (.md)
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/[0.08] pb-3">
        <button
          onClick={() => setActiveTab('notes')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'notes'
              ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-extrabold shadow-lg shadow-emerald-500/20'
              : 'bg-[#0e121e]/85 border border-white/[0.08] text-slate-400 hover:text-white hover:border-white/20'
          }`}
        >
          <Bookmark className="w-4 h-4" /> My Lecture Notes ({userNotes.length})
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'history'
              ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-extrabold shadow-lg shadow-emerald-500/20'
              : 'bg-[#0e121e]/85 border border-white/[0.08] text-slate-400 hover:text-white hover:border-white/20'
          }`}
        >
          <History className="w-4 h-4" /> Watch History ({historyVideos.length})
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'notes' ? (
          <motion.div
            key="notes-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-4"
          >
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search across all your study notes..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-black/60 border border-white/10 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-hidden focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
              />
            </div>

            {filteredNotes.length === 0 ? (
              <div className="p-12 text-center bg-[#0e121e]/40 border border-dashed border-white/10 rounded-3xl text-slate-400 text-xs">
                No saved study notes found. Click "Bookmark Note" while watching any video lecture to add notes.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredNotes.map(note => {
                  const vid = videos.find(v => v.id === note.videoId);

                  return (
                    <div
                      key={note.id}
                      className="p-4 bg-[#0e121e]/85 backdrop-blur-md border border-white/[0.08] hover:border-emerald-500/30 rounded-2xl space-y-3 transition-all flex flex-col justify-between shadow-lg"
                    >
                      <div>
                        {vid && (
                          <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-white/[0.08] text-[11px] text-slate-400">
                            <span className="truncate font-medium text-slate-200">{vid.title}</span>
                            <button
                              onClick={() => playVideo(vid)}
                              className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 flex-shrink-0"
                            >
                              <Play className="w-3 h-3 fill-current" /> Play
                            </button>
                          </div>
                        )}

                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[11px] font-bold rounded-md">
                            ▶ {formatTime(note.timestampSec)}
                          </span>
                          <h4 className="text-xs font-bold text-white line-clamp-1">{note.title}</h4>
                        </div>

                        <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed">
                          {note.text}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-white/[0.08] text-[10px] text-slate-500">
                        <span>{note.createdAt}</span>
                        <button
                          onClick={() => deleteNote(note.id)}
                          className="text-slate-500 hover:text-rose-400 p-1 transition-colors rounded-lg hover:bg-rose-500/10"
                          title="Delete note"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        ) : (
          /* History tab */
          <motion.div
            key="history-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-4"
          >
            {historyVideos.length === 0 ? (
              <div className="p-12 text-center bg-[#0e121e]/40 border border-dashed border-white/10 rounded-3xl text-slate-400 text-xs">
                No watch history yet.
              </div>
            ) : (
              <div className="divide-y divide-white/[0.06] bg-[#0e121e]/85 backdrop-blur-md border border-white/[0.08] rounded-2xl overflow-hidden shadow-xl">
                {historyVideos.map(vid => (
                  <div
                    key={vid.id}
                    onClick={() => playVideo(vid)}
                    className="p-4 flex items-center justify-between gap-4 hover:bg-white/[0.03] cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative w-28 sm:w-36 aspect-video rounded-xl overflow-hidden bg-black/60 border border-white/10 flex-shrink-0">
                        <img
                          src={vid.thumbnailUrl}
                          alt={vid.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/80 text-[10px] font-mono text-white rounded">
                          {formatTime(vid.duration)}
                        </span>
                      </div>

                      <div className="min-w-0">
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-0.5">
                          {vid.subject}
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-1">
                          {vid.title}
                        </h4>
                        <p className="text-xs text-slate-400 truncate mt-0.5">
                          {vid.author.name} • {vid.author.institution}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={e => {
                        e.stopPropagation();
                        playVideo(vid);
                      }}
                      className="p-2.5 bg-white/5 group-hover:bg-gradient-to-r group-hover:from-emerald-500 group-hover:to-cyan-500 text-slate-300 group-hover:text-black rounded-xl transition-all flex-shrink-0"
                    >
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
