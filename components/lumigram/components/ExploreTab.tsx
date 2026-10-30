"use client"
import React, { useState } from 'react';
import { Search, Heart, MessageCircle, Sparkles, Tag, MapPin, X } from 'lucide-react';
import { Post, User } from '../types';
import { filterExplorePosts, formatCount } from '../utils/socialLogic';

interface ExploreTabProps {
  posts: Post[];
  onSelectPost: (post: Post) => void;
  onSelectUser: (user: User) => void;
}

const CATEGORIES = [
  'For You',
  'Architecture',
  'Street',
  'Cyberpunk',
  'Nature',
  'Slow Living',
  'Travel',
  'Editorial',
];

export const ExploreTab: React.FC<ExploreTabProps> = ({
  posts,
  onSelectPost,
  onSelectUser,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('For You');

  const filteredPosts = filterExplorePosts(posts, searchQuery, selectedCategory);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-5">
      {/* Search Header */}
      <div className="relative">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500"
        />
        <input
          type="text"
          placeholder="Search creators, hashtags (#neon, #nature), locations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-10 py-3 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-pink-500 shadow-xs"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer"
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-xs scale-102'
                  : 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Explore Visual Grid (Instagram Staggered Hero Layout) */}
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
          {filteredPosts.map((post, idx) => {
            // Give every 5th or 6th item a featured 2-span aspect or distinct feel
            const isFeatured = idx === 1 || idx === 6;

            return (
              <div
                key={post.id}
                onClick={() => onSelectPost(post)}
                className={`group relative rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-900 cursor-pointer shadow-xs aspect-square ${
                  isFeatured ? 'sm:col-span-2 sm:row-span-2 sm:aspect-auto' : ''
                }`}
              >
                <img
                  src={post.images[0]}
                  alt={post.caption}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Multiple photos indicator */}
                {post.images.length > 1 && (
                  <div className="absolute top-2.5 right-2.5 px-2 py-1 rounded-md bg-black/60 text-white text-[10px] font-semibold backdrop-blur-xs">
                    {post.images.length} photos
                  </div>
                )}

                {/* Hover Overlay with Stats & Author */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-4 text-white">
                  <div className="flex items-center gap-2">
                    <img
                      src={post.user.avatar}
                      alt={post.user.username}
                      className="w-7 h-7 rounded-full object-cover border border-white/60"
                    />
                    <span className="text-xs font-semibold drop-shadow-md truncate">
                      {post.user.username}
                    </span>
                  </div>

                  <div className="flex items-center justify-center gap-5">
                    <span className="flex items-center gap-1.5 text-sm font-semibold">
                      <Heart size={18} className="fill-white" />
                      {formatCount(post.likesCount)}
                    </span>
                    <span className="flex items-center gap-1.5 text-sm font-semibold">
                      <MessageCircle size={18} className="fill-white" />
                      {formatCount(post.commentsCount)}
                    </span>
                  </div>

                  <div className="text-[11px] text-white/80 line-clamp-1">
                    {post.caption}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-8">
          <Sparkles size={32} className="mx-auto text-pink-500 mb-2" />
          <h3 className="font-semibold text-neutral-800 dark:text-neutral-200">
            No matching posts found
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Try adjusting your search terms or picking another category.
          </p>
        </div>
      )}
    </div>
  );
};

