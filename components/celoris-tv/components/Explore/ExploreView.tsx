import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { Video } from '../../types';
import { formatTime } from '../../utils/formatters';
import { CATEGORIES } from '../../data/mockData';
import {
  Play,
  Sparkles,
  ListPlus,
  Bookmark,
  CheckCircle2,
  Clock,
  Award,
  Layers,
  GraduationCap,
  TrendingUp,
} from 'lucide-react';
import { AddToPlaylistModal } from '../Modals/AddToPlaylistModal';

export const ExploreView: React.FC = () => {
  const {
    videos,
    playVideo,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    currentUser,
  } = useApp();

  const [difficultyFilter, setDifficultyFilter] = useState<string>('All');
  const [selectedVideoForPlaylist, setSelectedVideoForPlaylist] = useState<Video | null>(null);

  // Filter videos based on category, search, and difficulty
  const filteredVideos = videos.filter(video => {
    // Search query
    if (searchQuery.trim()) {
      const matchText = `${video.title} ${video.description} ${video.author.name} ${video.subject} ${video.tags.join(' ')}`.toLowerCase();
      if (!matchText.includes(searchQuery.toLowerCase())) return false;
    }

    // Category
    if (selectedCategory !== 'All Subjects' && video.category !== selectedCategory && video.subject !== selectedCategory) {
      return false;
    }

    // Difficulty
    if (difficultyFilter !== 'All' && video.difficulty !== difficultyFilter) {
      return false;
    }

    return true;
  });

  const featuredVideo = videos.find(v => v.isFeatured) || videos[0];

  return (
    <div className="max-w-7xl mx-auto space-y-8 text-[#E0E5E0] pb-12">
      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-[#7F9172] text-[#0D0F0D] shadow-md shadow-[#7F9172]/20'
                : 'bg-[#181D18] border border-[#2A322A] text-[#95A395] hover:text-white hover:bg-[#222922]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Featured Spotlight Banner (if no active search) */}
      {!searchQuery && selectedCategory === 'All Subjects' && featuredVideo && (
        <div
          onClick={() => playVideo(featuredVideo)}
          className="relative bg-[#161B16] border border-[#2A322A] rounded-3xl overflow-hidden shadow-2xl cursor-pointer group transition-all duration-300 hover:border-[#7F9172]/50"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 sm:p-8">
            <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="px-3 py-1 bg-[#7F9172] text-[#0D0F0D] text-[11px] font-extrabold uppercase tracking-wider rounded-lg flex items-center gap-1 shadow-md">
                    <Sparkles className="w-3.5 h-3.5 text-[#0D0F0D]" /> Featured Masterclass
                  </span>
                  <span className="px-2.5 py-1 bg-[#1E241E] text-[#A8B89C] text-xs font-semibold rounded-lg border border-[#2E382E]">
                    {featuredVideo.subject}
                  </span>
                  <span className="px-2.5 py-1 bg-[#1E241E]/80 text-[#D2B48C] text-xs font-medium rounded-lg">
                    {featuredVideo.difficulty}
                  </span>
                </div>

                <h2 className="text-xl sm:text-3xl font-bold tracking-tight text-white group-hover:text-[#A8B89C] transition-colors leading-tight mb-3">
                  {featuredVideo.title}
                </h2>

                <p className="text-xs sm:text-sm text-[#95A395] line-clamp-3 leading-relaxed">
                  {featuredVideo.description}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#242A24]">
                <div className="flex items-center gap-3">
                  <img
                    src={featuredVideo.author.avatar}
                    alt={featuredVideo.author.name}
                    className="w-10 h-10 rounded-full object-cover border border-[#7F9172]/40"
                  />
                  <div>
                    <span className="text-xs font-bold text-white block">
                      {featuredVideo.author.name}
                    </span>
                    <span className="text-[11px] text-[#95A395]">
                      {featuredVideo.author.institution}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-[#95A395] font-mono">
                    {formatTime(featuredVideo.duration)}
                  </span>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      playVideo(featuredVideo);
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#7F9172] hover:bg-[#91A582] text-[#0D0F0D] text-xs font-extrabold rounded-xl shadow-lg shadow-[#7F9172]/20 transition-all group-hover:scale-105"
                  >
                    <Play className="w-4 h-4 fill-current text-[#0D0F0D]" /> Watch Lecture
                  </button>
                </div>
              </div>
            </div>

            {/* Thumbnail */}
            <div className="lg:col-span-5 relative aspect-video rounded-2xl overflow-hidden bg-[#0D0F0D] border border-[#242A24]">
              <img
                src={featuredVideo.thumbnailUrl}
                alt={featuredVideo.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
              <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-[#0D0F0D]/80 backdrop-blur-md rounded-lg font-mono text-xs text-white">
                {formatTime(featuredVideo.duration)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Video Catalog Grid */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#7F9172]" />
            <h3 className="text-lg font-bold text-white tracking-tight">
              {selectedCategory === 'All Subjects' ? 'Curated Academic Lectures' : `${selectedCategory} Lectures`}
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-[#181D18] border border-[#2A322A] text-[#A8B89C] text-xs font-bold font-mono">
              {filteredVideos.length}
            </span>
          </div>

          {/* Difficulty filter chips */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[#95A395] mr-1 text-[11px] uppercase font-bold tracking-wider">
              Level:
            </span>
            {['All', 'Beginner', 'Intermediate', 'Advanced'].map(diff => (
              <button
                key={diff}
                onClick={() => setDifficultyFilter(diff)}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  difficultyFilter === diff
                    ? 'bg-[#2E382E] text-white font-semibold border border-[#3E4D3E]'
                    : 'bg-[#181D18] border border-[#2A322A] text-[#95A395] hover:text-white'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {filteredVideos.length === 0 ? (
            <motion.div
              key="empty-state"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="p-12 text-center bg-[#161B16] border border-[#242A24] rounded-3xl text-[#95A395] text-xs"
            >
              No lectures found matching your query or filters. Try adjusting your search term.
            </motion.div>
          ) : (
            <motion.div
              key={`${selectedCategory}-${difficultyFilter}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredVideos.map(video => {
              const watchProgress = currentUser.watchProgress[video.id];

              return (
                <div
                  key={video.id}
                  onClick={() => playVideo(video)}
                  className="bg-[#161B16] border border-[#242A24] hover:border-[#7F9172]/50 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:-translate-y-1 group cursor-pointer flex flex-col"
                >
                  {/* Thumbnail & Badges */}
                  <div className="relative aspect-video bg-[#0D0F0D] overflow-hidden">
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Duration badge */}
                    <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-[#0D0F0D]/85 backdrop-blur-md rounded-md font-mono text-[11px] font-bold text-white">
                      {formatTime(video.duration)}
                    </span>

                    {/* Subject badge */}
                    <span className="absolute top-2 left-2 px-2.5 py-0.5 bg-[#181D18]/90 backdrop-blur-md border border-[#2E382E] rounded-md text-[10px] font-semibold text-[#A8B89C]">
                      {video.subject}
                    </span>

                    {/* Watch Progress bar */}
                    {watchProgress !== undefined && watchProgress > 0 && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#1E241E]">
                        <div
                          className="h-full bg-[#7F9172]"
                          style={{ width: `${watchProgress * 100}%` }}
                        />
                      </div>
                    )}

                    {/* Hover quick action overlay */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setSelectedVideoForPlaylist(video);
                        }}
                        className="p-1.5 bg-[#181D18]/95 hover:bg-[#7F9172] text-[#95A395] hover:text-[#0D0F0D] rounded-lg border border-[#2E382E] shadow-md transition-colors"
                        title="Add to study playlist"
                      >
                        <ListPlus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div className="flex items-start gap-3">
                      <img
                        src={video.author.avatar}
                        alt={video.author.name}
                        className="w-9 h-9 rounded-full object-cover border border-[#2A322A] flex-shrink-0 mt-0.5"
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-[#A8B89C] transition-colors line-clamp-2 leading-snug">
                          {video.title}
                        </h4>
                        <p className="text-xs text-[#95A395] truncate mt-1">
                          {video.author.name}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#242A24] flex items-center text-[11px] text-[#95A395]">
                      <span className="truncate">{video.author.institution}</span>
                    </div>
                  </div>
                </div>
              );
            })}
            </motion.div>
          )}
        </AnimatePresence>
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
