import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { Playlist, Video } from '../../types';
import { formatTime } from '../../utils/formatters';
import {
  ListMusic,
  Plus,
  Play,
  CheckCircle,
  Clock,
  Sparkles,
  BookOpen,
  Lock,
  Globe,
  Trash2,
  Share2,
  ChevronRight,
  GraduationCap,
} from 'lucide-react';
import { CreatePlaylistModal } from '../Modals/CreatePlaylistModal';

export const PlaylistsView: React.FC = () => {
  const {
    playlists,
    videos,
    currentUser,
    currentRole,
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
    <div className="max-w-7xl mx-auto space-y-6 text-[#E0E5E0]">
      {/* Header Banner */}
      <div className="p-6 bg-[#161B16] border border-[#242A24] rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <div className="p-2.5 bg-[#7F9172]/20 text-[#A8B89C] rounded-xl border border-[#7F9172]/30">
              <ListMusic className="w-6 h-6 text-[#7F9172]" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Personalized Study Playlists</h1>
          </div>
          <p className="text-xs sm:text-sm text-[#95A395] max-w-2xl leading-relaxed">
            Curate personalized lecture sequences for midterm sprint prep, or follow verified department course syllabi.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-[#7F9172] hover:bg-[#91A582] text-[#0D0F0D] rounded-2xl text-xs font-bold shadow-lg shadow-[#7F9172]/20 transition-all hover:scale-102 flex-shrink-0"
        >
          <Plus className="w-4 h-4 text-[#0D0F0D]" /> Create Study Queue
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between gap-3 border-b border-[#242A24] pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'all'
                ? 'bg-[#7F9172] text-[#0D0F0D] shadow-xs'
                : 'bg-[#161B16] border border-[#242A24] text-[#95A395] hover:text-white'
            }`}
          >
            All Playlists ({playlists.length})
          </button>

          <button
            onClick={() => setActiveTab('personal')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'personal'
                ? 'bg-[#7F9172] text-[#0D0F0D] shadow-xs'
                : 'bg-[#161B16] border border-[#242A24] text-[#95A395] hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" /> My Study Queues
          </button>

          <button
            onClick={() => setActiveTab('teacher_curated')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'teacher_curated'
                ? 'bg-[#7F9172] text-[#0D0F0D] shadow-xs'
                : 'bg-[#161B16] border border-[#242A24] text-[#95A395] hover:text-white'
            }`}
          >
            <GraduationCap className={`w-3.5 h-3.5 ${activeTab === 'teacher_curated' ? 'text-[#0D0F0D]' : 'text-[#D2B48C]'}`} /> Teacher Curated Syllabi
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
                className="bg-[#161B16] border border-[#242A24] hover:border-[#7F9172]/50 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:-translate-y-1 group cursor-pointer flex flex-col"
              >
                {/* Cover Image & Overlay */}
                <div className="relative aspect-video bg-[#0D0F0D] overflow-hidden">
                  <img
                    src={cover}
                    alt={playlist.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D0F0D] via-black/40 to-transparent" />

                  {/* Badges on cover */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    {playlist.isTeacherCurated ? (
                      <span className="px-2.5 py-1 rounded-lg bg-[#D2B48C] text-[#0D0F0D] text-[10px] font-bold uppercase tracking-wider shadow-md flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-[#0D0F0D]" /> Teacher Syllabus
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-lg bg-[#7F9172] text-[#0D0F0D] text-[10px] font-bold uppercase tracking-wider shadow-md">
                        Personal Queue
                      </span>
                    )}
                    <span className="px-2 py-1 rounded-lg bg-[#161B16]/80 backdrop-blur-xs text-[#E0E5E0] text-[10px] font-medium border border-[#2E382E]">
                      {playlist.subject}
                    </span>
                  </div>

                  {/* Duration and count pill */}
                  <div className="absolute bottom-3 right-3 flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-black/80 backdrop-blur-md rounded-lg text-white font-mono text-xs font-semibold flex items-center gap-1">
                      <ListMusic className="w-3.5 h-3.5 text-[#7F9172]" />
                      {videoCount} Lectures
                    </span>
                  </div>

                  {/* Big Hover Play Button */}
                  <button
                    onClick={e => handleStartPlaylist(playlist, e)}
                    disabled={videoCount === 0}
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-xs"
                  >
                    <div className="w-14 h-14 rounded-full bg-[#7F9172] text-[#0D0F0D] flex items-center justify-center shadow-xl transform scale-75 group-hover:scale-100 transition-transform">
                      <Play className="w-7 h-7 ml-1 fill-current" />
                    </div>
                  </button>
                </div>

                {/* Body Info */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-[#A8B89C] transition-colors line-clamp-1">
                      {playlist.title}
                    </h3>
                    <p className="text-xs text-[#95A395] line-clamp-2 mt-1 leading-relaxed">
                      {playlist.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#242A24] flex items-center justify-between text-xs text-[#95A395]">
                    <div className="truncate">
                      <span className="text-[#E0E5E0] font-medium">{playlist.authorName}</span>
                      <span className="block text-[10px] text-[#5E6C5E]">
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
                          className="p-1.5 text-[#5E6C5E] hover:text-[#C87D55] rounded-lg hover:bg-[#1E241E] transition-colors"
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
                        className="px-3 py-1.5 bg-[#1E241E] hover:bg-[#2A332A] text-[#E0E5E0] rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
                      >
                        View <ChevronRight className="w-3.5 h-3.5" />
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
