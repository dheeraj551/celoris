import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Video } from '../../types';
import { X, ListPlus, Check, Plus, BookCheck, Lock, Globe } from 'lucide-react';
import { CreatePlaylistModal } from './CreatePlaylistModal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  video: Video;
}

export const AddToPlaylistModal: React.FC<Props> = ({ isOpen, onClose, video }) => {
  const { playlists, addVideoToPlaylist, removeVideoFromPlaylist, currentUser } = useApp();
  const [showCreateModal, setShowCreateModal] = useState(false);

  if (!isOpen) return null;

  // Filter playlists that user owns or can add to
  const userPlaylists = playlists.filter(
    p => p.authorId === currentUser.id || p.isPersonal || currentUser.customPlaylistIds.includes(p.id)
  );

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fadeIn">
        <div className="bg-[#161B16] border border-[#242A24] rounded-2xl w-full max-w-md p-6 shadow-2xl relative text-[#E0E5E0]">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-[#95A395] hover:text-white rounded-lg hover:bg-[#1E241E] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-[#7F9172]/20 text-[#A8B89C] rounded-xl border border-[#7F9172]/30">
              <ListPlus className="w-6 h-6 text-[#7F9172]" />
            </div>
            <div>
              <h3 className="text-xl font-bold tracking-tight text-white">Save to Playlist</h3>
              <p className="text-xs text-[#95A395]">Add lecture to your personal queues or course track</p>
            </div>
          </div>

          <div className="p-3 mb-4 bg-[#0D0F0D] border border-[#242A24] rounded-xl flex items-center gap-3">
            <img
              src={video.thumbnailUrl}
              alt={video.title}
              className="w-16 h-10 object-cover rounded-md flex-shrink-0"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white truncate">{video.title}</p>
              <p className="text-[11px] text-[#95A395] truncate">{video.author.name} • {video.subject}</p>
            </div>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
            {userPlaylists.length === 0 ? (
              <div className="text-center py-6 text-[#95A395] text-xs">
                No custom playlists found yet. Create your first study queue below!
              </div>
            ) : (
              userPlaylists.map(playlist => {
                const isIncluded = playlist.videoIds.includes(video.id);
                return (
                  <button
                    key={playlist.id}
                    onClick={() => {
                      if (isIncluded) {
                        removeVideoFromPlaylist(playlist.id, video.id);
                      } else {
                        addVideoToPlaylist(playlist.id, video.id);
                      }
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all text-left ${
                      isIncluded
                        ? 'bg-[#7F9172]/15 border-[#7F9172]/40 text-white'
                        : 'bg-[#0D0F0D] border-[#242A24] text-[#E0E5E0] hover:bg-[#1E241E] hover:border-[#384238]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-2">
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                          isIncluded
                            ? 'bg-[#7F9172] border-[#7F9172] text-[#0D0F0D]'
                            : 'border-[#384238] bg-[#161B16]'
                        }`}
                      >
                        {isIncluded && <Check className="w-3.5 h-3.5 stroke-[3] text-[#0D0F0D]" />}
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-medium truncate">{playlist.title}</p>
                        <span className="text-[10px] text-[#95A395] flex items-center gap-1.5 mt-0.5">
                          {playlist.isPublic ? <Globe className="w-3 h-3 text-[#5E6C5E]" /> : <Lock className="w-3 h-3 text-[#5E6C5E]" />}
                          {playlist.videoIds.length} lectures • {playlist.subject}
                        </span>
                      </div>
                    </div>

                    {playlist.isTeacherCurated && (
                      <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#D2B48C]/15 text-[#D2B48C] border border-[#D2B48C]/30 flex-shrink-0">
                        Course Syllabus
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-[#242A24] flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 text-xs font-bold text-[#7F9172] hover:text-[#A8B89C] p-2 rounded-xl hover:bg-[#7F9172]/10 transition-colors"
            >
              <Plus className="w-4 h-4" /> New Playlist
            </button>

            <button
              onClick={onClose}
              className="px-5 py-2 text-xs font-bold text-[#0D0F0D] bg-[#7F9172] hover:bg-[#91A582] rounded-xl transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>

      <CreatePlaylistModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        initialVideoId={video.id}
      />
    </>
  );
};
