import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { Video, UserNote } from '../../types';
import { formatTime } from '../../utils/formatters';
import {
  Bookmark,
  History,
  Play,
  Trash2,
  FileDown,
  Clock,
  Search,
  Sparkles,
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
    <div className="max-w-7xl mx-auto space-y-6 text-[#E0E5E0] pb-12">
      {/* Header */}
      <div className="p-6 bg-[#161B16] border border-[#242A24] rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Bookmark className="w-6 h-6 text-[#7F9172]" />
            Study Notes & Watch History
          </h1>
          <p className="text-xs text-[#95A395] mt-1">
            Access all your timestamped study notes and resume recently watched lectures
          </p>
        </div>

        {userNotes.length > 0 && activeTab === 'notes' && (
          <button
            onClick={handleExportAllNotes}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#7F9172] hover:bg-[#91A582] text-[#0D0F0D] rounded-xl text-xs font-bold shadow-md transition-all flex-shrink-0"
          >
            <FileDown className="w-4 h-4 text-[#0D0F0D]" /> Export All Notes (.md)
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#242A24] pb-3">
        <button
          onClick={() => setActiveTab('notes')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'notes'
              ? 'bg-[#7F9172] text-[#0D0F0D] shadow-xs'
              : 'bg-[#161B16] border border-[#242A24] text-[#95A395] hover:text-white'
          }`}
        >
          <Bookmark className="w-4 h-4" /> My Lecture Notes ({userNotes.length})
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'history'
              ? 'bg-[#7F9172] text-[#0D0F0D] shadow-xs'
              : 'bg-[#161B16] border border-[#242A24] text-[#95A395] hover:text-white'
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
              <Search className="w-4 h-4 text-[#95A395] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search across all your study notes..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#0D0F0D] border border-[#242A24] rounded-xl text-xs text-[#E0E5E0] placeholder-[#5E6C5E] focus:outline-hidden focus:ring-2 focus:ring-[#7F9172]"
              />
            </div>

            {filteredNotes.length === 0 ? (
              <div className="p-12 text-center bg-[#161B16]/40 border border-[#242A24] rounded-3xl text-[#95A395] text-xs">
                No saved study notes found. Click "Bookmark Note" while watching any video lecture to add notes.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredNotes.map(note => {
                  const vid = videos.find(v => v.id === note.videoId);

                  return (
                    <div
                      key={note.id}
                      className="p-4 bg-[#161B16] border border-[#242A24] hover:border-[#384238] rounded-2xl space-y-3 transition-all flex flex-col justify-between"
                    >
                      <div>
                        {vid && (
                          <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-[#242A24] text-[11px] text-[#95A395]">
                            <span className="truncate font-medium text-[#E0E5E0]">{vid.title}</span>
                            <button
                              onClick={() => playVideo(vid)}
                              className="text-[#7F9172] hover:text-[#A8B89C] font-bold flex items-center gap-1 flex-shrink-0"
                            >
                              <Play className="w-3 h-3 fill-current" /> Play
                            </button>
                          </div>
                        )}

                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="px-2 py-0.5 bg-[#7F9172]/20 text-[#A8B89C] font-mono text-[11px] font-bold rounded-md">
                            ▶ {formatTime(note.timestampSec)}
                          </span>
                          <h4 className="text-xs font-bold text-white line-clamp-1">{note.title}</h4>
                        </div>

                        <p className="text-xs text-[#E0E5E0] whitespace-pre-line leading-relaxed">
                          {note.text}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-[#242A24] text-[10px] text-[#5E6C5E]">
                        <span>{note.createdAt}</span>
                        <button
                          onClick={() => deleteNote(note.id)}
                          className="text-[#5E6C5E] hover:text-[#C87D55] p-1 transition-colors"
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
              <div className="p-12 text-center bg-[#161B16]/40 border border-[#242A24] rounded-3xl text-[#95A395] text-xs">
                No watch history yet.
              </div>
            ) : (
              <div className="divide-y divide-[#242A24] bg-[#161B16] border border-[#242A24] rounded-2xl overflow-hidden">
                {historyVideos.map(vid => (
                  <div
                    key={vid.id}
                    onClick={() => playVideo(vid)}
                    className="p-4 flex items-center justify-between gap-4 hover:bg-[#1E241E] cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative w-28 sm:w-36 aspect-video rounded-xl overflow-hidden bg-[#0D0F0D] flex-shrink-0">
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
                        <span className="text-[10px] font-bold text-[#7F9172] uppercase tracking-wider block mb-0.5">
                          {vid.subject}
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-[#A8B89C] transition-colors line-clamp-1">
                          {vid.title}
                        </h4>
                        <p className="text-xs text-[#95A395] truncate mt-0.5">
                          {vid.author.name} • {vid.author.institution}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={e => {
                        e.stopPropagation();
                        playVideo(vid);
                      }}
                      className="p-2.5 bg-[#7F9172]/20 group-hover:bg-[#7F9172] text-[#A8B89C] group-hover:text-[#0D0F0D] rounded-xl transition-all flex-shrink-0"
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
