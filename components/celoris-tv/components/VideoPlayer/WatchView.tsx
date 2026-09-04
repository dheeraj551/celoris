import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { EduVideoPlayer } from './EduVideoPlayer';
import { WatchProgressBar } from './WatchProgressBar';
import { VideoInfo } from './VideoInfo';
import { QASection } from './QASection';
import { TranscriptView } from './TranscriptView';
import { NotesResourcesTab } from './NotesResourcesTab';
import { VideoQuizTab } from './VideoQuizTab';
import { PlaylistQueueSidebar } from './PlaylistQueueSidebar';
import { ActiveTab, Video } from '../../types';
import { formatTime, formatViews } from '../../utils/formatters';
import {
  MessageSquare,
  FileText,
  Bookmark,
  Sparkles,
  Play,
  ListPlus,
  Compass,
  Layers,
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
  } = useApp();

  const [selectedVideoForPlaylist, setSelectedVideoForPlaylist] = useState<Video | null>(null);

  if (!currentVideo) {
    return (
      <div className="max-w-7xl mx-auto p-12 text-center text-slate-400">
        <p className="text-sm">No video selected for playback.</p>
        <button
          onClick={() => playVideo(videos[0])}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold"
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
    {
      id: 'transcript',
      label: 'Interactive Transcript',
      icon: <FileText className="w-4 h-4" />,
    },
    {
      id: 'notes',
      label: 'Notes & Slides',
      icon: <Bookmark className="w-4 h-4" />,
    },
    {
      id: 'quiz',
      label: 'Knowledge Check',
      icon: <Sparkles className="w-4 h-4" />,
      badge: currentVideo.quizzes?.length ? `${currentVideo.quizzes.length}` : undefined,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 text-[#E0E5E0] pb-16">
      {/* Main Grid: Left Video Player & Tabs, Right Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Player, Video Details, Interactive Q&A Tabs */}
        <div className="lg:col-span-8 space-y-6">
          {/* Video Player */}
          <EduVideoPlayer
            video={currentVideo}
            onAddNoteAtTime={() => setActivePlayerTab('notes')}
          />

          {/* Video Watch Progress Tracker */}
          <WatchProgressBar video={currentVideo} />

          {/* Video Title & Actions & Syllabus info */}
          <VideoInfo video={currentVideo} />

          {/* Interactive Educational Tabs */}
          <div className="space-y-4 pt-2">
            {/* Tab Header Buttons */}
            <div className="flex items-center gap-2 border-b border-[#242A24] pb-2 overflow-x-auto custom-scrollbar">
              {tabs.map(tab => {
                const isActive = activePlayerTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActivePlayerTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-[#7F9172] text-[#0D0F0D] shadow-md shadow-[#7F9172]/20 font-bold'
                        : 'bg-[#181D18] border border-[#2A322A] text-[#95A395] hover:text-white hover:bg-[#222922]'
                    }`}
                  >
                    <span className={isActive ? 'text-[#0D0F0D]' : 'text-[#7F9172]'}>
                      {tab.icon}
                    </span>
                    <span>{tab.label}</span>
                    {tab.badge && (
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-md font-mono ${
                          isActive
                            ? 'bg-[#0D0F0D]/25 text-[#0D0F0D]'
                            : 'bg-[#1E241E] text-[#A8B89C]'
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
                  {activePlayerTab === 'transcript' && <TranscriptView video={currentVideo} />}
                  {activePlayerTab === 'notes' && <NotesResourcesTab video={currentVideo} />}
                  {activePlayerTab === 'quiz' && <VideoQuizTab video={currentVideo} />}
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
          <div className="bg-[#161B16] border border-[#242A24] rounded-2xl p-4 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-[#242A24]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#A8B89C] flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#7F9172]" /> Recommended Course Lectures
              </h3>
            </div>

            <div className="space-y-3">
              {relatedVideos.slice(0, 5).map(vid => (
                <div
                  key={vid.id}
                  onClick={() => playVideo(vid)}
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#1E241E] cursor-pointer transition-colors group"
                >
                  <div className="relative w-28 aspect-video rounded-lg overflow-hidden bg-[#0D0F0D] flex-shrink-0 border border-[#242A24]">
                    <img
                      src={vid.thumbnailUrl}
                      alt={vid.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <span className="absolute bottom-1 right-1 px-1 bg-[#0D0F0D]/85 font-mono text-[9px] text-white rounded">
                      {formatTime(vid.duration)}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-semibold text-[#A8B89C] block truncate">
                      {vid.subject}
                    </span>
                    <h4 className="text-xs font-bold text-white group-hover:text-[#A8B89C] transition-colors line-clamp-2 leading-snug">
                      {vid.title}
                    </h4>
                    <p className="text-[11px] text-[#95A395] truncate mt-1">
                      {vid.author.name}
                    </p>
                    <span className="text-[10px] text-[#5E6C5E] mt-0.5 block">
                      {formatViews(vid.views)} • {vid.difficulty}
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
