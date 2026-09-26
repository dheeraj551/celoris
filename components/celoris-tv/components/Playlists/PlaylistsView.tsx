import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { Playlist, Video } from '../../types';
import { formatTime } from '../../utils/formatters';
import {
  ListMusic,
  Plus,
  Play,
  BookOpen,
  Trash2,
  ChevronRight,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { CreatePlaylistModal } from '../Modals/CreatePlaylistModal';

export const PlaylistsView: React.FC = () => {
  const {
    playlists,
    videos,
    currentUser,
    playVideo,
    setSelectedPlaylistForDetail,
    setCurrentView,
    deletePlaylist,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'personal' | 'teacher_curated'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredPlaylists = playlists.filter(p => {
    if (activeTab === 'personal') return p.isPersonal || p.authorId === currentUser.id;
    if (activeTab === 'teacher_curated') return p.isTeacherCurated;
    return true;
  });

  const getPlaylistDuration = (playlist: Playlist) => {
    const totalSec = playlist.videoIds.reduce((acc, id) => {
      const vid = videos.find(v => v.id === id);
      return acc + (vid ? vid.duration : 0);
    }, 0);
    return formatTime(totalSec);
  };

  const handleStartPlaylist = (playlist: Playlist, e: React.MouseEvent) => {
    e.stopPropagation();
    if (playlist.videoIds.length === 0) return;
    const firstVid = videos.find(v => v.id === playlist.videoIds[0]);
    if (firstVid) {
      playVideo(firstVid, playlist, 0);
    }
  };

  const handleOpenDetail = (playlist: Playlist) => {
    setSelectedPlaylistForDetail(playlist);
    setCurrentView('playlist-detail');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 text-slate-100 select-none pb-12">
      {/* Header Banner */}
      <div className="p-6 bg-[#0e121e]/85 backdrop-blur-xl border border-white/[0.08] rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
              <ListMusic className="w-6 h-6 text-emerald-400" />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white">Study Playlists & Syllabi</h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
            Curate personalized lecture sequences for midterm prep, or follow verified department course tracks.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black rounded-2xl text-xs font-extrabold shadow-lg shadow-emerald-500/20 transition-all hover:scale-102 active:scale-98 flex-shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" /> Create Study Queue
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between gap-3 border-b border-white/[0.08] pb-3">
        <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'all'
                ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-extrabold shadow-xs'
                : 'bg-white/[0.04] border border-white/10 text-slate-400 hover:text-white hover:bg-white/[0.08]'
            }`}
          >
            All Playlists ({playlists.length})
          </button>

          <button
            onClick={() => setActiveTab('personal')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'personal'
                ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-extrabold shadow-xs'
                : 'bg-white/[0.04] border border-white/10 text-slate-400 hover:text-white hover:bg-white/[0.08]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" /> My Study Queues
          </button>

          <button
            onClick={() => setActiveTab('teacher_curated')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'teacher_curated'
                ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-extrabold shadow-xs'
                : 'bg-white/[0.04] border border-white/10 text-slate-400 hover:text-white hover:bg-white/[0.08]'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-amber-400" /> Teacher Curated Syllabi
          </button>
        </div>
      </div>

      {/* Playlists Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredPlaylists.map(playlist => {
            const videoCount = playlist.videoIds.length;
            const firstVid = videos.find(v => v.id === playlist.videoIds[0]);
            const cover = playlist.coverUrl || firstVid?.thumbnailUrl;

            return (
              <div
                key={playlist.id}
                onClick={() => handleOpenDetail(playlist)}
                className="bg-[#0e121e]/85 backdrop-blur-xl border border-white/[0.08] hover:border-emerald-500/40 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:-translate-y-1 group cursor-pointer flex flex-col"
              >
                {/* Cover Image & Overlay */}
                <div className="relative aspect-video bg-black/60 overflow-hidden">
                  <img
                    src={cover}
                    alt={playlist.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                  {/* Badges on cover */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    {playlist.isTeacherCurated ? (
                      <span className="px-2.5 py-1 rounded-lg bg-amber-500/90 text-black text-[10px] font-bold uppercase tracking-wider shadow-md flex items-center gap-1 font-mono">
                        <Sparkles className="w-3 h-3 text-black" /> Syllabus
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-black text-[10px] font-bold uppercase tracking-wider shadow-md font-mono">
                        Personal Queue
                      </span>
                    )}
                    <span className="px-2 py-1 rounded-lg bg-black/70 backdrop-blur-md text-slate-200 text-[10px] font-medium border border-white/10">
                      {playlist.subject}
                    </span>
                  </div>

                  {/* Duration and count pill */}
                  <div className="absolute bottom-3 right-3 flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-black/80 backdrop-blur-md rounded-lg text-white font-mono text-xs font-semibold flex items-center gap-1 border border-white/10">
                      <ListMusic className="w-3.5 h-3.5 text-emerald-400" />
                      {videoCount} Lectures
                    </span>
                  </div>

                  {/* Big Hover Play Button */}
                  <button
                    onClick={e => handleStartPlaylist(playlist, e)}
                    disabled={videoCount === 0}
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-xs"
                  >
                    <div className="w-14 h-14 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-black flex items-center justify-center shadow-xl transform scale-75 group-hover:scale-100 transition-transform">
                      <Play className="w-7 h-7 ml-1 fill-current" />
                    </div>
                  </button>
                </div>

                {/* Body Info */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
                      {playlist.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                      {playlist.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs text-slate-400">
                    <div className="truncate">
                      <span className="text-slate-300 font-medium">{playlist.authorName}</span>
                      <span className="block text-[10px] text-slate-500 font-mono">
                        Est. Total: {getPlaylistDuration(playlist)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {playlist.authorId === currentUser.id && (
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            if (confirm(`Delete playlist "${playlist.title}"?`)) {
                              deletePlaylist(playlist.id);
                            }
                          }}
                          className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-white/[0.05] transition-colors"
                          title="Delete Playlist"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          handleOpenDetail(playlist);
                        }}
                        className="px-3 py-1.5 bg-white/[0.05] hover:bg-white/10 text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors border border-white/10"
                      >
                        View <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>
      </AnimatePresence>

      <CreatePlaylistModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  );
};
