import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Video, Playlist } from '../../types';
import { formatTime } from '../../utils/formatters';
import {
  ListMusic,
  Play,
  CheckCircle2,
  Shuffle,
  Repeat,
  Sparkles,
  Layers,
  ChevronRight,
} from 'lucide-react';

interface Props {
  playlist: Playlist;
  currentIndex: number;
}

export const PlaylistQueueSidebar: React.FC<Props> = ({ playlist, currentIndex }) => {
  const { videos, currentVideo, playVideo, setSelectedPlaylistForDetail, setCurrentView } = useApp();
  const [isLooping, setIsLooping] = useState(false);

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
    <div className="bg-[#161B16] border border-[#242A24] rounded-2xl overflow-hidden shadow-xl text-[#E0E5E0] flex flex-col">
      {/* Playlist Queue Header */}
      <div className="p-4 bg-[#1E241E] border-b border-[#242A24]">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 min-w-0">
            <ListMusic className="w-4 h-4 text-[#7F9172] flex-shrink-0" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#A8B89C] truncate">
              {playlist.isTeacherCurated ? 'Course Track Queue' : 'Personal Study Queue'}
            </span>
          </div>
          <button
            onClick={handleOpenPlaylistDetails}
            className="text-[11px] font-semibold text-[#95A395] hover:text-white flex items-center gap-0.5 transition-colors flex-shrink-0"
          >
            Manage <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <h3 className="text-sm font-bold text-white line-clamp-1 mb-1">
          {playlist.title}
        </h3>

        <div className="flex items-center justify-between text-xs text-[#95A395] mb-2.5">
          <span>
            Lecture {currentIndex + 1} of {playlistVideos.length}
          </span>
          <span className="font-semibold text-[#A8B89C]">{progressPercent}% Completed</span>
        </div>

        {/* Mini progress bar */}
        <div className="w-full h-1.5 bg-[#2E382E] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#7F9172] transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Playlist Video Items List */}
      <div className="divide-y divide-[#242A24] max-h-[460px] overflow-y-auto custom-scrollbar">
        {playlistVideos.map((vid, idx) => {
          const isCurrent = currentVideo?.id === vid.id;
          const isPast = idx < currentIndex;

          return (
            <div
              key={vid.id}
              onClick={() => playVideo(vid, playlist, idx)}
              className={`p-3 flex items-center gap-3 cursor-pointer transition-all group ${
                isCurrent
                  ? 'bg-[#1E261E] border-l-4 border-[#7F9172] text-white'
                  : 'hover:bg-[#1C221C] text-[#E0E5E0]'
              }`}
            >
              <div className="w-5 text-center text-xs font-mono font-semibold text-[#5E6C5E] flex-shrink-0">
                {isCurrent ? (
                  <Play className="w-3.5 h-3.5 text-[#7F9172] fill-current animate-pulse mx-auto" />
                ) : isPast ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#5C8A67] mx-auto" />
                ) : (
                  idx + 1
                )}
              </div>

              <div className="relative w-16 h-10 rounded-lg overflow-hidden bg-[#121512] flex-shrink-0">
                <img
                  src={vid.thumbnailUrl}
                  alt={vid.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-0.5 right-0.5 px-1 bg-black/80 text-[9px] font-mono rounded text-white">
                  {formatTime(vid.duration)}
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <p
                  className={`text-xs font-semibold line-clamp-1 leading-snug ${
                    isCurrent ? 'text-[#A8B89C] font-bold' : 'text-[#E0E5E0] group-hover:text-white'
                  }`}
                >
                  {vid.title}
                </p>
                <p className="text-[10px] text-[#95A395] truncate mt-0.5">
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
