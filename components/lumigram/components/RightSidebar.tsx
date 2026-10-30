"use client"
import React from 'react';
import { User } from '../types';
import { Sparkles, CheckCircle2, ShieldCheck, Server } from 'lucide-react';
import { soundManager } from '../utils/sound';

interface RightSidebarProps {
  currentUser: User;
  suggestedUsers: User[];
  onToggleFollow: (user: User) => void;
  onSelectUser: (user: User) => void;
  onOpenArch: () => void;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  currentUser,
  suggestedUsers,
  onToggleFollow,
  onSelectUser,
  onOpenArch,
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
            className="w-12 h-12 rounded-full object-cover ring-2 ring-neutral-200 dark:ring-neutral-700 group-hover:ring-pink-500 transition-all"
          />
          <div>
            <div className="flex items-center gap-1 font-bold text-xs text-neutral-900 dark:text-neutral-100 group-hover:underline">
              {currentUser.username}
              <CheckCircle2 size={13} className="text-sky-500 fill-sky-500 text-white" />
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate max-w-[150px]">
              {currentUser.name}
            </p>
          </div>
        </button>

        <span className="text-xs font-semibold text-pink-500 hover:text-pink-600 cursor-pointer">
          Switch
        </span>
      </div>

      {/* Cloud Ingestion Live Badge */}
      <div
        onClick={onOpenArch}
        className="p-3.5 rounded-2xl bg-gradient-to-tr from-pink-500/10 via-purple-500/10 to-indigo-500/10 border border-pink-500/20 hover:border-pink-500/40 transition-colors cursor-pointer space-y-1.5"
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
            <Server size={14} className="text-pink-500" />
            Distributed Media Ingest
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
        </div>
        <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-snug">
          140k+ req/sec direct-to-storage pipeline active with sub-18ms edge latency.
        </p>
      </div>

      {/* Suggestions for You */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400">
            Suggested for you
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
                    Suggested creator
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
                    : 'text-pink-500 hover:text-pink-600'
                }`}
              >
                {user.isFollowing ? 'Following' : 'Follow'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Meta Footer */}
      <div className="text-[11px] text-neutral-400 dark:text-neutral-600 space-y-2 pt-4">
        <div className="flex flex-wrap gap-x-2 gap-y-1">
          <a href="#" className="hover:underline">About</a>•
          <a href="#" className="hover:underline">Help</a>•
          <a href="#" className="hover:underline">Press</a>•
          <a href="#" className="hover:underline">API</a>•
          <a href="#" className="hover:underline">Privacy</a>•
          <a href="#" className="hover:underline">Terms</a>
        </div>
        <p>© 2026 LUMIGRAM • CLOUD SOCIAL MEDIA ENGINE</p>
      </div>
    </aside>
  );
};

