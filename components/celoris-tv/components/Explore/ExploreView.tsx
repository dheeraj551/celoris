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
    <div className="max-w-7xl mx-auto space-y-8 text-slate-100 pb-12 select-none">
      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-extrabold shadow-md shadow-emerald-500/25 scale-[1.02]'
                : 'bg-white/[0.04] border border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.08]'
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
          className="relative bg-[#0e121e]/85 backdrop-blur-2xl border border-white/10 hover:border-emerald-500/40 rounded-3xl overflow-hidden shadow-2xl cursor-pointer group transition-all duration-300"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 sm:p-8">
            <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="px-3 py-1 bg-gradient-to-r from-emerald-500 to-cyan-500 text-black text-[11px] font-extrabold uppercase tracking-wider rounded-lg flex items-center gap-1.5 shadow-md shadow-emerald-500/20">
                    <Sparkles className="w-3.5 h-3.5 fill-current" /> Featured Masterclass
                  </span>
                  <span className="px-2.5 py-1 bg-white/[0.05] text-emerald-400 text-xs font-semibold rounded-lg border border-white/10">
                    {featuredVideo.subject}
                  </span>
                  <span className="px-2.5 py-1 bg-amber-500/10 text-amber-300 text-xs font-medium rounded-lg border border-amber-500/20">
                    {featuredVideo.difficulty}
                  </span>
                </div>

                <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight text-white group-hover:text-emerald-400 transition-colors leading-tight mb-3">
                  {featuredVideo.title}
                </h2>

                <p className="text-xs sm:text-sm text-slate-400 line-clamp-3 leading-relaxed">
                  {featuredVideo.description}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/[0.08]">
                <div className="flex items-center gap-3">
                  <img
                    src={featuredVideo.author.avatar}
                    alt={featuredVideo.author.name}
                    className="w-10 h-10 rounded-full object-cover border border-emerald-500/30 shadow-xs"
                  />
                  <div>
                    <span className="text-xs font-bold text-white block">
                      {featuredVideo.author.name}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {featuredVideo.author.institution}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 font-mono">
                    {formatTime(featuredVideo.duration)}
                  </span>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      playVideo(featuredVideo);
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black text-xs font-extrabold rounded-xl shadow-lg shadow-emerald-500/25 transition-all group-hover:scale-105 active:scale-95"
                  >
                    <Play className="w-4 h-4 fill-current text-black" /> Watch Lecture
                  </button>
                </div>
              </div>
            </div>

            {/* Thumbnail */}
            <div className="lg:col-span-5 relative aspect-video rounded-2xl overflow-hidden bg-black/60 border border-white/10 shadow-inner">
              <img
                src={featuredVideo.thumbnailUrl}
                alt={featuredVideo.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
              <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-black/80 backdrop-blur-md rounded-lg font-mono text-xs text-white border border-white/10">
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
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-bold text-white tracking-tight">
              {selectedCategory === 'All Subjects' ? 'Curated Academic Lectures' : `${selectedCategory} Lectures`}
            </h3>
            <span className="px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/10 text-emerald-400 text-xs font-bold font-mono">
              {filteredVideos.length}
            </span>
          </div>

          {/* Difficulty filter chips */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 mr-1 text-[11px] uppercase font-bold tracking-wider font-mono">
              Level:
            </span>
            {['All', 'Beginner', 'Intermediate', 'Advanced'].map(diff => (
              <button
                key={diff}
                onClick={() => setDifficultyFilter(diff)}
                className={`px-2.5 py-1 rounded-lg transition-colors font-semibold ${
                  difficultyFilter === diff
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-xs'
                    : 'bg-white/[0.04] border border-white/[0.08] text-slate-400 hover:text-white'
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
              className="p-12 text-center bg-[#0e121e]/80 border border-white/[0.08] rounded-3xl text-slate-400 text-xs"
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
                  className="bg-[#0e121e]/80 backdrop-blur-xl border border-white/[0.08] hover:border-emerald-500/40 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:-translate-y-1 group cursor-pointer flex flex-col"
                >
                  {/* Thumbnail & Badges */}
                  <div className="relative aspect-video bg-black/60 overflow-hidden">
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Duration badge */}
                    <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/80 backdrop-blur-md rounded-md font-mono text-[11px] font-bold text-white border border-white/10">
                      {formatTime(video.duration)}
                    </span>

                    {/* Subject badge */}
                    <span className="absolute top-2 left-2 px-2.5 py-0.5 bg-[#090b10]/90 backdrop-blur-md border border-white/10 rounded-md text-[10px] font-semibold text-emerald-400">
                      {video.subject}
                    </span>

                    {/* Watch Progress bar */}
                    {watchProgress !== undefined && watchProgress > 0 && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                        <div
                          className="h-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]"
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
                        className="p-1.5 bg-black/80 hover:bg-emerald-500 text-slate-300 hover:text-black rounded-lg border border-white/15 shadow-md transition-colors"
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
                        className="w-9 h-9 rounded-full object-cover border border-white/10 flex-shrink-0 mt-0.5"
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-2 leading-snug">
                          {video.title}
                        </h4>
                        <p className="text-xs text-slate-400 truncate mt-1">
                          {video.author.name}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/[0.08] flex items-center text-[11px] text-slate-500 font-mono">
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
