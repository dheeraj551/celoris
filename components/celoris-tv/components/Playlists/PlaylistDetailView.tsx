import React from 'react';
import { useApp } from '../../context/AppContext';
import { Playlist, Video } from '../../types';
import { formatTime } from '../../utils/formatters';
import {
  Play,
  ChevronLeft,
  Trash2,
  GraduationCap,
  Sparkles,
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
    <div className="max-w-7xl mx-auto space-y-6 text-slate-100 select-none pb-12">
      {/* Back Button */}
      <button
        onClick={() => setCurrentView('playlists')}
        className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-all shadow-xs group"
      >
        <ChevronLeft className="w-4 h-4 text-emerald-400 group-hover:-translate-x-0.5 transition-transform" />
        <span>Back to All Playlists</span>
      </button>

      {/* Playlist Hero Banner */}
      <div className="p-6 bg-[#0e121e]/85 backdrop-blur-xl border border-white/[0.08] rounded-3xl grid grid-cols-1 md:grid-cols-3 gap-6 shadow-2xl">
        {/* Cover Preview */}
        <div className="relative aspect-video md:aspect-4/3 rounded-2xl overflow-hidden bg-black/60 border border-white/10">
          <img
            src={playlist.coverUrl || playlistVideos[0]?.thumbnailUrl}
            alt={playlist.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
            <span className="px-2.5 py-1 bg-black/80 backdrop-blur-md rounded-lg text-[11px] font-mono text-white border border-white/10">
              {playlistVideos.length} Lectures
            </span>
            <span className="px-2.5 py-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-lg text-[11px] font-extrabold text-black">
              {formatTime(totalDurationSec)} Total
            </span>
          </div>
        </div>

        {/* Metadata & Actions */}
        <div className="md:col-span-2 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {playlist.isTeacherCurated ? (
                <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs font-bold flex items-center gap-1 font-mono">
                  <GraduationCap className="w-3.5 h-3.5 text-amber-400" /> Official Syllabus
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-bold font-mono">
                  Personal Study Queue
                </span>
              )}
              <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] text-slate-200 text-xs font-medium border border-white/10">
                {playlist.subject}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
              {playlist.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4">
              {playlist.description}
            </p>

            <div className="text-xs text-slate-400 font-mono">
              Curated by <strong className="text-white">{playlist.authorName}</strong> • Updated {playlist.updatedAt}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/[0.08]">
            <button
              onClick={handlePlayAll}
              disabled={playlistVideos.length === 0}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 disabled:opacity-50 text-black rounded-xl text-xs font-extrabold shadow-lg shadow-emerald-500/20 transition-all hover:scale-102 active:scale-98"
            >
              <Play className="w-4 h-4 fill-current text-black" /> Play Entire Playlist
            </button>

            {playlist.authorId === currentUser.id && (
              <button
                onClick={() => {
                  if (confirm(`Delete playlist "${playlist.title}"?`)) {
                    deletePlaylist(playlist.id);
                    setCurrentView('playlists');
                  }
                }}
                className="p-3 text-slate-400 hover:text-rose-400 bg-white/[0.04] hover:bg-white/[0.08] rounded-xl text-xs font-semibold border border-white/10 transition-colors"
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
        <h3 className="text-base font-bold text-white font-mono">Lecture Track ({playlistVideos.length})</h3>

        {playlistVideos.length === 0 ? (
          <div className="p-12 text-center bg-[#0e121e]/80 border border-white/[0.08] rounded-3xl text-slate-400 text-xs">
            No lectures in this playlist yet. Browse explore view and click "Save" to add videos.
          </div>
        ) : (
          <div className="divide-y divide-white/[0.06] bg-[#0e121e]/85 backdrop-blur-xl border border-white/[0.08] rounded-2xl overflow-hidden">
            {playlistVideos.map((vid, idx) => (
              <div
                key={vid.id}
                onClick={() => playVideo(vid, playlist, idx)}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.04] cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <span className="w-6 font-mono text-xs font-bold text-slate-500 text-center flex-shrink-0 group-hover:text-emerald-400">
                    {idx + 1}
                  </span>

                  <div className="relative w-28 sm:w-36 aspect-video rounded-xl overflow-hidden bg-black/60 flex-shrink-0 border border-white/10">
                    <img
                      src={vid.thumbnailUrl}
                      alt={vid.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/80 text-[10px] font-mono text-white rounded border border-white/10">
                      {formatTime(vid.duration)}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
                      {vid.title}
                    </h4>
                    <p className="text-xs text-slate-400 truncate mt-0.5">
                      {vid.author.name} • {vid.author.institution}
                    </p>
                    <span className="text-[10px] text-slate-500 mt-1 block font-mono">
                      {vid.difficulty}
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
                      className="p-2 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-white/[0.05] transition-colors"
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
                    className="p-2.5 bg-emerald-500/15 group-hover:bg-gradient-to-r group-hover:from-emerald-500 group-hover:to-cyan-500 text-emerald-400 group-hover:text-black rounded-xl transition-all shadow-xs"
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
