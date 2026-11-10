"use client";
import React, { useState } from 'react';
import { User } from '../types';
import { CheckCircle2, TrendingUp, Search, ArrowRight } from 'lucide-react';

interface RightSidebarProps {
  currentUser: User;
  suggestedUsers: User[];
  isProUser?: boolean;
  onToggleFollow: (user: User) => void;
  onSelectUser: (user: User) => void;
  onSearch?: (query: string) => void;
  onOpenAdStudio?: () => void;
  onOpenExplore?: () => void;
  onOpenArch?: () => void;
  onEditProfile?: () => void;
}

const TRENDING_TOPICS = [
  { category: 'CREATIVE DESIGN', tag: '#CelorisVisuals', posts: '18.4K posts today' },
  { category: 'ARCHITECTURE & TRAVEL', tag: '#LuxembourgAesthetics', posts: '6.2K posts today' },
  { category: 'TECHNOLOGY & CREATORS', tag: '#CelorisSocial', posts: '41.8K posts today' },
];

export const RightSidebar: React.FC<RightSidebarProps> = ({
  suggestedUsers,
  isProUser = false,
  onToggleFollow,
  onSelectUser,
  onSearch,
  onOpenAdStudio,
  onOpenExplore,
}) => {
  const [searchText, setSearchText] = useState('');
  const [offset, setOffset] = useState(0);

  const visibleSuggestions =
    suggestedUsers.length <= 5
      ? suggestedUsers
      : Array.from({ length: 5 }, (_, i) => suggestedUsers[(offset + i) % suggestedUsers.length]);

  const handleRefreshSuggestions = () => {
    if (suggestedUsers.length > 5) {
      setOffset((prev) => (prev + 5) % suggestedUsers.length);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchText);
    } else if (onOpenExplore) {
      onOpenExplore();
    }
  };

  return (
    <aside className="hidden xl:block w-72 lg:w-80 p-5 space-y-4 shrink-0 select-none">
      {/* Top Pill Search Input */}
      <form onSubmit={handleSearchSubmit} className="relative">
        <Search
          size={15}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
        />
        <input
          type="text"
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
            if (onSearch) onSearch(e.target.value);
          }}
          placeholder="Search Celoris..."
          className="w-full pl-9 pr-4 py-2.5 rounded-full bg-neutral-100/90 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 text-xs text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all"
        />
      </form>

      {/* "Who to follow" Card */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl p-4 shadow-2xs">
        <div className="flex items-center justify-between mb-3.5">
          <h2 className="text-[15px] font-bold text-neutral-900 dark:text-neutral-100">
            Who to follow
          </h2>
          {suggestedUsers.length > 5 && (
            <button
              type="button"
              onClick={handleRefreshSuggestions}
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
            >
              Refresh
            </button>
          )}
        </div>

        <div className="space-y-3">
          {visibleSuggestions.length === 0 ? (
            <p className="text-xs text-neutral-400 py-2">Loading community creators...</p>
          ) : (
            visibleSuggestions.map((user) => (
              <div key={user.id} className="flex items-center justify-between gap-2.5">
                <button
                  onClick={() => onSelectUser(user)}
                  className="flex items-center gap-2.5 min-w-0 text-left cursor-pointer group flex-1"
                >
                  <img
                    src={user.avatar}
                    alt={user.name || user.username}
                    onError={(e) => {
                      const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.username)}&background=0f172a&color=fff`;
                      if (e.currentTarget.src !== fallback) e.currentTarget.src = fallback;
                    }}
                    className="w-9 h-9 rounded-full object-cover shrink-0 ring-1 ring-neutral-200 dark:ring-neutral-700"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-xs text-neutral-900 dark:text-neutral-100 truncate group-hover:underline flex items-center gap-1">
                      <span className="truncate">{user.name || user.username}</span>
                      {user.isVerified && (
                        <CheckCircle2 size={12} className="text-blue-500 fill-blue-500 text-white shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
                      @{user.username}
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => onToggleFollow(user)}
                  className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer shrink-0 ${
                    user.isFollowing
                      ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-rose-50 hover:text-rose-600 border border-neutral-200 dark:border-neutral-700'
                      : 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200/60 dark:border-blue-900/50'
                  }`}
                >
                  {user.isFollowing ? 'Following' : 'Follow'}
                </button>
              </div>
            ))
          )}
        </div>

        {onOpenExplore && (
          <button
            type="button"
            onClick={onOpenExplore}
            className="mt-4 text-xs font-medium text-neutral-500 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer block"
          >
            See more suggestions
          </button>
        )}
      </div>

      {/* Ad Studio Boost Card (Pro Users Only) */}
      {isProUser && (
        <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50/90 via-white to-emerald-50/50 dark:from-blue-950/30 dark:via-neutral-900 dark:to-emerald-950/20 border border-blue-200/70 dark:border-blue-900/40 space-y-2.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
              <TrendingUp size={14} className="text-blue-600" />
              Ad Studio Boost
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-600 text-white font-bold">
              ₹10,000 LIVE
            </span>
          </div>
          <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Amplify your creative projects and automated campaigns across Celoris Social Cloud.
          </p>
          <div className="flex items-center justify-between pt-1">
            <span className="text-[10px] font-medium text-neutral-400">Reach ~450k creators</span>
            {onOpenAdStudio && (
              <button
                type="button"
                onClick={onOpenAdStudio}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Boost Now</span>
                <ArrowRight size={12} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Trending in Community Card */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl p-4 shadow-2xs space-y-3">
        <h2 className="text-[14px] font-bold text-neutral-900 dark:text-neutral-100">
          Trending in Community
        </h2>
        <div className="space-y-3">
          {TRENDING_TOPICS.map((item) => (
            <button
              key={item.tag}
              type="button"
              onClick={() => {
                if (onSearch) onSearch(item.tag.replace('#', ''));
              }}
              className="w-full text-left group cursor-pointer block"
            >
              <span className="text-[10px] font-semibold tracking-wider text-neutral-400 uppercase block">
                {item.category}
              </span>
              <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors block">
                {item.tag}
              </span>
              <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block">
                {item.posts}
              </span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};
