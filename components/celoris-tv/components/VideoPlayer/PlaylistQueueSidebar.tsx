import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Video, Playlist } from '../../types';
import { formatTime } from '../../utils/formatters';
import {
  ListMusic,
  Play,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';

interface Props {
  playlist: Playlist;
  currentIndex: number;
}

export const PlaylistQueueSidebar: React.FC<Props> = ({ playlist, currentIndex }) => {
  const { videos, currentVideo, playVideo, setSelectedPlaylistForDetail, setCurrentView } = useApp();

  // Map playlist video ids to actual video objects
  const playlistVideos = playlist.videoIds
    .map(id => videos.find(v => v.id === id))
    .filter((v): v is Video => !!v);

  const completedCount = currentIndex;
  const progressPercent = Math.round((completedCount / (playlistVideos.length || 1)) * 100);

  const handleOpenPlaylistDetails = () => {
    setSelectedPlaylistForDetail(playlist);
    setCurrentView('playlist-detail');
  };

  return (
    <div className="bg-[#0e121e]/85 backdrop-blur-xl border border-white/[0.08] rounded-2xl overflow-hidden shadow-xl text-slate-200 flex flex-col select-none">
      {/* Playlist Queue Header */}
      <div className="p-4 bg-white/[0.03] border-b border-white/[0.08]">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 min-w-0">
            <ListMusic className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono truncate">
              {playlist.isTeacherCurated ? 'Course Track Queue' : 'Study Queue'}
            </span>
          </div>
          <button
            onClick={handleOpenPlaylistDetails}
            className="text-[11px] font-semibold text-slate-400 hover:text-white flex items-center gap-0.5 transition-colors flex-shrink-0"
          >
            Manage <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <h3 className="text-sm font-bold text-white line-clamp-1 mb-1">
          {playlist.title}
        </h3>

        <div className="flex items-center justify-between text-xs text-slate-400 mb-2.5 font-mono">
          <span>
            Lecture {currentIndex + 1} of {playlistVideos.length}
          </span>
          <span className="font-semibold text-emerald-400">{progressPercent}% Completed</span>
        </div>

        {/* Mini progress bar */}
        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Playlist Video Items List */}
      <div className="divide-y divide-white/[0.06] max-h-[460px] overflow-y-auto custom-scrollbar">
        {playlistVideos.map((vid, idx) => {
          const isCurrent = currentVideo?.id === vid.id;
          const isPast = idx < currentIndex;

          return (
            <div
              key={vid.id}
              onClick={() => playVideo(vid, playlist, idx)}
              className={`p-3 flex items-center gap-3 cursor-pointer transition-all group ${
                isCurrent
                  ? 'bg-emerald-500/10 border-l-4 border-emerald-400 text-white'
                  : 'hover:bg-white/[0.04] text-slate-300'
              }`}
            >
              <div className="w-5 text-center text-xs font-mono font-semibold text-slate-500 flex-shrink-0">
                {isCurrent ? (
                  <Play className="w-3.5 h-3.5 text-emerald-400 fill-current animate-pulse mx-auto" />
                ) : isPast ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mx-auto" />
                ) : (
                  idx + 1
                )}
              </div>

              <div className="relative w-16 h-10 rounded-lg overflow-hidden bg-black/60 flex-shrink-0 border border-white/10">
                <img
                  src={vid.thumbnailUrl}
                  alt={vid.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-0.5 right-0.5 px-1 bg-black/80 text-[9px] font-mono rounded text-white border border-white/10">
                  {formatTime(vid.duration)}
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <p
                  className={`text-xs font-semibold line-clamp-1 leading-snug ${
                    isCurrent ? 'text-emerald-400 font-bold' : 'text-slate-200 group-hover:text-white'
                  }`}
                >
                  {vid.title}
                </p>
                <p className="text-[10px] text-slate-400 truncate mt-0.5">
                  {vid.author.name} • {vid.subject}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
