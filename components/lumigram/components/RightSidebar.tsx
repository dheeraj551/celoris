"use client";
import React from 'react';
import { User } from '../types';
import { CheckCircle2, TrendingUp } from 'lucide-react';

interface RightSidebarProps {
  currentUser: User;
  suggestedUsers: User[];
  isProUser?: boolean;
  onToggleFollow: (user: User) => void;
  onSelectUser: (user: User) => void;
  onOpenArch?: () => void;
  onEditProfile?: () => void;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  currentUser,
  suggestedUsers,
  isProUser = false,
  onToggleFollow,
  onSelectUser,
}) => {
  return (
    <aside className="hidden xl:block w-72 lg:w-80 p-5 space-y-5 shrink-0 select-none">
      {/* "Who to follow" Card matching reference screenshot */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl p-4 shadow-2xs">
        <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100 mb-3.5">
          Who to follow
        </h2>

        <div className="space-y-3.5">
          {suggestedUsers.slice(0, 5).map((user) => (
            <div key={user.id} className="flex items-center justify-between gap-3">
              <button
                onClick={() => onSelectUser(user)}
                className="flex items-center gap-2.5 min-w-0 text-left cursor-pointer group flex-1"
              >
                <img
                  src={user.avatar}
                  alt={user.name || user.username}
                  className="w-10 h-10 rounded-full object-cover shrink-0 ring-1 ring-neutral-200 dark:ring-neutral-700"
                />
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-xs text-neutral-900 dark:text-neutral-100 truncate group-hover:underline flex items-center gap-1">
                    <span>{user.name || user.username}</span>
                    {user.isVerified && (
                      <CheckCircle2 size={12} className="text-blue-500 fill-blue-500 text-white shrink-0" />
                    )}
                  </div>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
                    @{user.role || user.username}
                  </p>
                </div>
              </button>

              <button
                onClick={() => onToggleFollow(user)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer shrink-0 ${
                  user.isFollowing
                    ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-rose-50 hover:text-rose-600 border border-neutral-200 dark:border-neutral-700'
                    : 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200/60 dark:border-blue-900/50'
                }`}
              >
                {user.isFollowing ? 'Following' : 'Follow'}
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={() => {}}
          className="mt-4 text-xs font-medium text-neutral-500 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer block"
        >
          See more suggestions
        </button>
      </div>

      {/* Ad Studio Credits Card (Pro Users Only) */}
      {isProUser && (
        <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/10 via-emerald-500/5 to-transparent border border-blue-500/20 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
              <TrendingUp size={14} className="text-blue-500" />
              Ad Studio Boost
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-400 font-bold">
              ₹10,000 Live
            </span>
          </div>
          <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-snug">
            Amplify your creative projects and automated campaigns across Celoris Social Cloud.
          </p>
        </div>
      )}
    </aside>
  );
};
