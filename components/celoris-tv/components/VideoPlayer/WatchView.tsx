import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { EduVideoPlayer } from './EduVideoPlayer';
import { WatchProgressBar } from './WatchProgressBar';
import { VideoInfo } from './VideoInfo';
import { QASection } from './QASection';
import { PlaylistQueueSidebar } from './PlaylistQueueSidebar';
import { ActiveTab, Video } from '../../types';
import { formatTime } from '../../utils/formatters';
import {
  MessageSquare,
  Compass,
  ChevronLeft,
} from 'lucide-react';
import { AddToPlaylistModal } from '../Modals/AddToPlaylistModal';

export const WatchView: React.FC = () => {
  const {
    currentVideo,
    videos,
    currentPlaylist,
    currentPlaylistIndex,
    activePlayerTab,
    setActivePlayerTab,
    playVideo,
    questions,
    setCurrentView,
  } = useApp();

  const [selectedVideoForPlaylist, setSelectedVideoForPlaylist] = useState<Video | null>(null);

  if (!currentVideo) {
    return (
      <div className="max-w-7xl mx-auto p-12 text-center text-slate-400 select-none">
        <p className="text-sm">No video selected for playback.</p>
        <button
          onClick={() => {
            playVideo(videos[0]);
            setCurrentView('watch');
          }}
          className="mt-4 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-black rounded-xl text-xs font-extrabold shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all"
        >
          Watch Featured Lecture
        </button>
      </div>
    );
  }

  // Related recommended lectures in same or related subjects
  const relatedVideos = videos.filter(v => v.id !== currentVideo.id);

  const videoQuestionsCount = questions.filter(q => q.videoId === currentVideo.id).length;

  const tabs: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'qa',
      label: 'Integrated Q&A',
      icon: <MessageSquare className="w-4 h-4" />,
      badge: `${videoQuestionsCount}`,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-5 text-slate-100 pb-16 select-none">
      {/* Top Breadcrumb & Back Action */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => setCurrentView('explore')}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-all shadow-xs group"
          title="Back to lecture catalog"
        >
          <ChevronLeft className="w-4 h-4 text-emerald-400 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Explore Lectures</span>
        </button>

        <span className="text-[11px] font-mono text-slate-500 truncate max-w-xs hidden sm:inline">
          {currentVideo.subject} • {currentVideo.difficulty}
        </span>
      </div>

      {/* Main Grid: Left Video Player & Tabs, Right Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Player, Video Details, Interactive Q&A Tabs */}
        <div className="lg:col-span-8 space-y-6">
          {/* Video Player */}
          <EduVideoPlayer video={currentVideo} />

          {/* Video Watch Progress Tracker */}
          <WatchProgressBar video={currentVideo} />

          {/* Video Title & Actions & Syllabus info */}
          <VideoInfo video={currentVideo} />

          {/* Interactive Educational Tabs */}
          <div className="space-y-4 pt-2">
            {/* Tab Header Buttons */}
            <div className="flex items-center gap-2 border-b border-white/[0.08] pb-2 overflow-x-auto custom-scrollbar">
              {tabs.map(tab => {
                const isActive = activePlayerTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActivePlayerTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-extrabold shadow-md shadow-emerald-500/20'
                        : 'bg-white/[0.04] border border-white/10 text-slate-400 hover:text-white hover:bg-white/[0.08]'
                    }`}
                  >
                    <span className={isActive ? 'text-black' : 'text-slate-400'}>
                      {tab.icon}
                    </span>
                    <span>{tab.label}</span>
                    {tab.badge && (
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-md font-mono font-bold ${
                          isActive
                            ? 'bg-black/25 text-black'
                            : 'bg-white/[0.08] text-emerald-400'
                        }`}
                      >
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Tab Body */}
            <div className="pt-2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activePlayerTab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                >
                  {activePlayerTab === 'qa' && <QASection video={currentVideo} />}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Right Column: Playlist Queue (if active) & Recommended Lectures */}
        <div className="lg:col-span-4 space-y-6">
          {/* Active Playlist Queue (if watching from a playlist) */}
          {currentPlaylist && (
            <PlaylistQueueSidebar
              playlist={currentPlaylist}
              currentIndex={currentPlaylistIndex}
            />
          )}

          {/* Related / Next Lectures */}
          <div className="bg-[#0e121e]/85 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-4 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-2">
                <Compass className="w-4 h-4 text-emerald-400" /> Recommended Lectures
              </h3>
            </div>

            <div className="space-y-2.5">
              {relatedVideos.slice(0, 5).map(vid => (
                <div
                  key={vid.id}
                  onClick={() => playVideo(vid)}
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/[0.05] cursor-pointer transition-colors group"
                >
                  <div className="relative w-28 aspect-video rounded-lg overflow-hidden bg-black/60 flex-shrink-0 border border-white/10">
                    <img
                      src={vid.thumbnailUrl}
                      alt={vid.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <span className="absolute bottom-1 right-1 px-1 bg-black/85 font-mono text-[9px] text-white rounded border border-white/10">
                      {formatTime(vid.duration)}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-semibold text-emerald-400 block truncate">
                      {vid.subject}
                    </span>
                    <h4 className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-2 leading-snug">
                      {vid.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 truncate mt-1">
                      {vid.author.name}
                    </p>
                    <span className="text-[10px] font-mono text-slate-500 mt-0.5 block">
                      {vid.difficulty}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {selectedVideoForPlaylist && (
        <AddToPlaylistModal
          isOpen={!!selectedVideoForPlaylist}
          onClose={() => setSelectedVideoForPlaylist(null)}
          video={selectedVideoForPlaylist}
        />
      )}
    </div>
  );
};
