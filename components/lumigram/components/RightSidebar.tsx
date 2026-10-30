"use client";
import React from 'react';
import { User } from '../types';
import { CheckCircle2, TrendingUp, Users } from 'lucide-react';
import { soundManager } from '../utils/sound';

interface RightSidebarProps {
  currentUser: User;
  suggestedUsers: User[];
  onToggleFollow: (user: User) => void;
  onSelectUser: (user: User) => void;
  onOpenArch?: () => void;
  onEditProfile?: () => void;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  currentUser,
  suggestedUsers,
  onToggleFollow,
  onSelectUser,
  onEditProfile,
}) => {
  return (
    <aside className="hidden xl:block w-80 p-6 space-y-6 shrink-0">
      {/* Current User Quick Card */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onSelectUser(currentUser)}
          className="flex items-center gap-3 group text-left cursor-pointer"
        >
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-neutral-200 dark:ring-neutral-700 group-hover:ring-emerald-500 transition-all"
          />
          <div>
            <div className="flex items-center gap-1 font-bold text-xs text-neutral-900 dark:text-neutral-100 group-hover:underline">
              @{currentUser.username}
              <CheckCircle2 size={13} className="text-emerald-500 fill-emerald-500 text-white" />
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate max-w-[150px]">
              {currentUser.name}
            </p>
          </div>
        </button>

        <button
          type="button"
          onClick={onEditProfile}
          className="text-xs font-semibold text-emerald-500 hover:text-emerald-600 hover:underline cursor-pointer"
        >
          Edit
        </button>
      </div>

      {/* Ad Studio Quick Snapshot */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/20 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
            <TrendingUp size={14} className="text-emerald-500" />
            Ad Studio Credits
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-500 font-bold">
            ₹10,000 Live
          </span>
        </div>
        <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-snug">
          Amplify your posts in Ad Studio to test audience targeting, real-time CTRs, and WhatsApp lead acquisition.
        </p>
      </div>

      {/* Suggestions for You */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
            <Users size={14} />
            <span>Fellow Creators &amp; Mentors</span>
          </span>
          <button className="text-xs font-semibold text-neutral-900 dark:text-neutral-200 hover:underline cursor-pointer">
            See All
          </button>
        </div>

        <div className="space-y-3">
          {suggestedUsers.map((user) => (
            <div key={user.id} className="flex items-center justify-between gap-3">
              <button
                onClick={() => onSelectUser(user)}
                className="flex items-center gap-2.5 min-w-0 text-left cursor-pointer"
              >
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="w-9 h-9 rounded-full object-cover shrink-0"
                />
                <div className="min-w-0">
                  <div className="font-semibold text-xs text-neutral-900 dark:text-neutral-100 truncate hover:underline">
                    {user.username}
                  </div>
                  <p className="text-[10px] text-neutral-400 truncate">
                    {user.role || user.name}
                  </p>
                </div>
              </button>

              <button
                onClick={() => {
                  soundManager.playSendSound();
                  onToggleFollow(user);
                }}
                className={`text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                  user.isFollowing
                    ? 'text-neutral-400 hover:text-neutral-600'
                    : 'text-emerald-500 hover:text-emerald-600'
                }`}
              >
                {user.isFollowing ? 'Following' : 'Follow'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="text-[11px] text-neutral-400 dark:text-neutral-600 space-y-2 pt-4 border-t border-neutral-100 dark:border-neutral-800">
        <div className="flex flex-wrap gap-x-2 gap-y-1">
          <a href="/about" className="hover:underline">About</a>•
          <a href="/help" className="hover:underline">Help</a>•
          <a href="/privacy" className="hover:underline">Privacy</a>•
          <a href="/terms" className="hover:underline">Terms</a>
        </div>
        <p className="font-mono text-[10px]">© 2026 CELORIS PULSE • A CELORIS SOCIAL CLOUD</p>
      </div>
    </aside>
  );
};
