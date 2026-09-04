import React from 'react';
import { useApp } from '../../context/AppContext';
import { Playlist, Video } from '../../types';
import { formatTime, formatViews } from '../../utils/formatters';
import {
  Play,
  ArrowLeft,
  Trash2,
  ListPlus,
  Share2,
  Clock,
  Sparkles,
  Layers,
  GraduationCap,
  Plus,
} from 'lucide-react';

interface Props {
  playlist: Playlist;
}

export const PlaylistDetailView: React.FC<Props> = ({ playlist }) => {
  const {
    videos,
    playVideo,
    removeVideoFromPlaylist,
    setCurrentView,
    currentUser,
    deletePlaylist,
  } = useApp();

  const playlistVideos = playlist.videoIds
    .map(id => videos.find(v => v.id === id))
    .filter((v): v is Video => !!v);

  const totalDurationSec = playlistVideos.reduce((acc, v) => acc + v.duration, 0);

  const handlePlayAll = () => {
    if (playlistVideos.length > 0) {
      playVideo(playlistVideos[0], playlist, 0);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 text-[#E0E5E0]">
      {/* Back Button */}
      <button
        onClick={() => setCurrentView('playlists')}
        className="flex items-center gap-2 text-xs font-bold text-[#95A395] hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to All Playlists
      </button>

      {/* Playlist Hero Banner */}
      <div className="p-6 bg-[#161B16] border border-[#242A24] rounded-3xl grid grid-cols-1 md:grid-cols-3 gap-6 shadow-2xl">
        {/* Cover Preview */}
        <div className="relative aspect-video md:aspect-4/3 rounded-2xl overflow-hidden bg-[#0D0F0D] border border-[#242A24]">
          <img
            src={playlist.coverUrl || playlistVideos[0]?.thumbnailUrl}
            alt={playlist.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D0F0D] via-transparent to-transparent" />
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
            <span className="px-2.5 py-1 bg-black/80 backdrop-blur-md rounded-lg text-[11px] font-mono text-white">
              {playlistVideos.length} Lectures
            </span>
            <span className="px-2.5 py-1 bg-[#7F9172] rounded-lg text-[11px] font-bold text-[#0D0F0D]">
              {formatTime(totalDurationSec)} Total
            </span>
          </div>
        </div>

        {/* Metadata & Actions */}
        <div className="md:col-span-2 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {playlist.isTeacherCurated ? (
                <span className="px-2.5 py-1 rounded-lg bg-[#D2B48C]/15 text-[#D2B48C] border border-[#D2B48C]/30 text-xs font-bold flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5" /> Official Syllabus
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-lg bg-[#7F9172]/20 text-[#A8B89C] border border-[#7F9172]/30 text-xs font-bold">
                  Personal Study Queue
                </span>
              )}
              <span className="px-2.5 py-1 rounded-lg bg-[#1E241E] text-[#E0E5E0] text-xs font-medium border border-[#2E382E]">
                {playlist.subject}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
              {playlist.title}
            </h1>
            <p className="text-xs sm:text-sm text-[#95A395] leading-relaxed mb-4">
              {playlist.description}
            </p>

            <div className="text-xs text-[#95A395]">
              Curated by <strong className="text-white">{playlist.authorName}</strong> • Updated {playlist.updatedAt}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-[#242A24]">
            <button
              onClick={handlePlayAll}
              disabled={playlistVideos.length === 0}
              className="flex items-center gap-2 px-6 py-3 bg-[#7F9172] hover:bg-[#91A582] disabled:opacity-50 text-[#0D0F0D] rounded-xl text-xs font-bold shadow-lg shadow-[#7F9172]/20 transition-all hover:scale-102"
            >
              <Play className="w-4 h-4 fill-current text-[#0D0F0D]" /> Play Entire Playlist
            </button>

            {playlist.authorId === currentUser.id && (
              <button
                onClick={() => {
                  if (confirm(`Delete playlist "${playlist.title}"?`)) {
                    deletePlaylist(playlist.id);
                  }
                }}
                className="p-3 text-[#95A395] hover:text-[#C87D55] bg-[#1E241E] hover:bg-[#2A332A] rounded-xl text-xs font-semibold border border-[#2E382E] transition-colors"
                title="Delete Playlist"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Lectures List in Playlist */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-white">Lecture Track ({playlistVideos.length})</h3>

        {playlistVideos.length === 0 ? (
          <div className="p-12 text-center bg-[#161B16]/60 border border-[#242A24] rounded-3xl text-[#95A395] text-xs">
            No lectures in this playlist yet. Browse explore view and click "Save to Playlist" to add videos.
          </div>
        ) : (
          <div className="divide-y divide-[#242A24] bg-[#161B16] border border-[#242A24] rounded-2xl overflow-hidden">
            {playlistVideos.map((vid, idx) => (
              <div
                key={vid.id}
                onClick={() => playVideo(vid, playlist, idx)}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#1E241E] cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <span className="w-6 font-mono text-xs font-bold text-[#5E6C5E] text-center flex-shrink-0 group-hover:text-[#A8B89C]">
                    {idx + 1}
                  </span>

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
                    <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-[#A8B89C] transition-colors line-clamp-1">
                      {vid.title}
                    </h4>
                    <p className="text-xs text-[#95A395] truncate mt-0.5">
                      {vid.author.name} • {vid.author.institution}
                    </p>
                    <span className="text-[10px] text-[#5E6C5E] mt-1 block">
                      {formatViews(vid.views)} • {vid.difficulty}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  {playlist.authorId === currentUser.id && (
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        removeVideoFromPlaylist(playlist.id, vid.id);
                      }}
                      className="p-2 text-[#5E6C5E] hover:text-[#C87D55] rounded-lg hover:bg-[#1E241E] transition-colors"
                      title="Remove from playlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      playVideo(vid, playlist, idx);
                    }}
                    className="p-2.5 bg-[#7F9172]/20 group-hover:bg-[#7F9172] text-[#A8B89C] group-hover:text-[#0D0F0D] rounded-xl transition-all"
                  >
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
