"use client";
import React from 'react';
import { Plus } from 'lucide-react';
import { UserStory, User } from '../types';

interface StoriesBarProps {
  stories: UserStory[];
  currentUser: User;
  onSelectStory: (index: number) => void;
  onOpenCreateStory: () => void;
}

export const StoriesBar: React.FC<StoriesBarProps> = ({
  stories,
  currentUser,
  onSelectStory,
  onOpenCreateStory,
}) => {
  return (
    <div className="w-full py-2 mb-4 overflow-hidden">
      <div className="flex items-center gap-4 overflow-x-auto no-scrollbar scroll-smooth px-0.5">
        {/* 'New story' item */}
        <div className="flex flex-col items-center gap-1.5 shrink-0 group">
          <div className="relative">
            <button
              onClick={onOpenCreateStory}
              className="relative block rounded-full focus:outline-none cursor-pointer p-[2px] ring-1 ring-neutral-200 dark:ring-neutral-800"
              aria-label="Add a new story"
            >
              <div className="w-14 h-14 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </button>
            <button
              onClick={onOpenCreateStory}
              aria-label="New story"
              className="absolute bottom-0 right-0 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-full p-1 border-2 border-white dark:border-neutral-950 shadow-sm transition-colors cursor-pointer"
            >
              <Plus size={10} strokeWidth={3} />
            </button>
          </div>
          <span className="text-[11px] font-medium text-neutral-700 dark:text-neutral-300 text-center max-w-[64px] truncate">
            New story
          </span>
        </div>

        {/* Stories from real community users */}
        {stories.map((story, idx) => {
          if (story.userId === currentUser.id) return null;

          return (
            <button
              key={story.userId}
              onClick={() => onSelectStory(idx)}
              className="flex flex-col items-center gap-1.5 shrink-0 group focus:outline-none cursor-pointer"
              aria-label={`View story from ${story.user.username}`}
            >
              <div
                className={`p-[2.5px] rounded-full transition-transform duration-200 group-hover:scale-105 ${
                  story.hasUnseen
                    ? 'bg-gradient-to-tr from-emerald-500 via-teal-400 to-rose-400'
                    : 'bg-neutral-200 dark:bg-neutral-800'
                }`}
              >
                <div className="p-0.5 bg-white dark:bg-neutral-950 rounded-full">
                  <img
                    src={story.user.avatar}
                    alt={story.user.username}
                    onError={(e) => {
                      const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(story.user.name || story.user.username)}&background=0f172a&color=fff`;
                      if (e.currentTarget.src !== fallback) e.currentTarget.src = fallback;
                    }}
                    className="w-13 h-13 rounded-full object-cover"
                  />
                </div>
              </div>
              <span className="text-[11px] font-medium text-neutral-700 dark:text-neutral-300 max-w-[66px] truncate text-center">
                {story.user.username}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
