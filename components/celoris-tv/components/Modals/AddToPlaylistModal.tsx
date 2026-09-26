import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Video } from '../../types';
import { X, ListPlus, Check, Plus, Lock, Globe } from 'lucide-react';
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
        <div className="bg-[#0e121e]/95 backdrop-blur-2xl border border-white/10 rounded-3xl w-full max-w-md p-6 shadow-2xl relative text-slate-200">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/20">
              <ListPlus className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold tracking-tight text-white">Save to Playlist</h3>
              <p className="text-xs text-slate-400">Add lecture to your personal queues or course track</p>
            </div>
          </div>

          <div className="p-3 mb-4 bg-black/60 border border-white/10 rounded-2xl flex items-center gap-3">
            <img
              src={video.thumbnailUrl}
              alt={video.title}
              className="w-16 h-10 object-cover rounded-lg border border-white/10 flex-shrink-0"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white truncate">{video.title}</p>
              <p className="text-[11px] text-slate-400 truncate">{video.author.name} • {video.subject}</p>
            </div>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
            {userPlaylists.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs">
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
                        ? 'bg-emerald-500/10 border-emerald-500/40 text-white shadow-lg shadow-emerald-500/10'
                        : 'bg-black/40 border-white/10 text-slate-200 hover:bg-white/[0.04] hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-2">
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                          isIncluded
                            ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 border-transparent text-black'
                            : 'border-white/20 bg-black/60'
                        }`}
                      >
                        {isIncluded && <Check className="w-3.5 h-3.5 stroke-[3] text-black" />}
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-medium truncate text-white">{playlist.title}</p>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                          {playlist.isPublic ? <Globe className="w-3 h-3 text-slate-500" /> : <Lock className="w-3 h-3 text-slate-500" />}
                          {playlist.videoIds.length} lectures • {playlist.subject}
                        </span>
                      </div>
                    </div>

                    {playlist.isTeacherCurated && (
                      <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 flex-shrink-0">
                        Course Syllabus
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-white/[0.08] flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 p-2 rounded-xl hover:bg-emerald-500/10 transition-colors"
            >
              <Plus className="w-4 h-4" /> New Playlist
            </button>

            <button
              onClick={onClose}
              className="px-5 py-2 text-xs font-extrabold text-black bg-gradient-to-r from-emerald-500 to-cyan-500 hover:opacity-90 rounded-xl shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-95"
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
