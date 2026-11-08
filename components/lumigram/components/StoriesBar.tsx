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
    <div className="w-full bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl py-3.5 px-4 mb-4 shadow-2xs overflow-hidden">
      <div className="flex items-center gap-4 overflow-x-auto no-scrollbar scroll-smooth">
        {/* 'New story' item matching reference screenshot */}
        <div className="flex flex-col items-center gap-1 shrink-0 group">
          <div className="relative">
            <button
              onClick={onOpenCreateStory}
              className="relative block rounded-full focus:outline-none cursor-pointer"
              aria-label="Add a new story"
            >
              <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform">
                {currentUser.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-blue-200 dark:bg-blue-900 flex items-center justify-center text-blue-600 font-bold">
                    +
                  </div>
                )}
              </div>
            </button>
            <button
              onClick={onOpenCreateStory}
              aria-label="New story"
              className="absolute bottom-0 right-0 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-full p-1 shadow-md transition-colors cursor-pointer"
            >
              <Plus size={11} strokeWidth={3} />
            </button>
          </div>
          <span className="text-[11px] font-medium text-neutral-800 dark:text-neutral-200 text-center">
            New story
          </span>
        </div>

        {/* Stories from other users */}
        {stories.map((story, idx) => {
          if (story.userId === currentUser.id) return null;

          return (
            <button
              key={story.userId}
              onClick={() => onSelectStory(idx)}
              className="flex flex-col items-center gap-1 shrink-0 group focus:outline-none cursor-pointer"
              aria-label={`View story from ${story.user.username}`}
            >
              <div
                className={`p-[2px] rounded-full transition-transform duration-200 group-hover:scale-105 ${
                  story.hasUnseen
                    ? 'ring-2 ring-blue-500'
                    : 'ring-1 ring-neutral-300 dark:ring-neutral-700'
                }`}
              >
                <div className="p-0.5 bg-white dark:bg-neutral-900 rounded-full">
                  <img
                    src={story.user.avatar}
                    alt={story.user.username}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                </div>
              </div>
              <span className="text-[11px] font-medium text-neutral-700 dark:text-neutral-300 max-w-[64px] truncate text-center">
                {story.user.username}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
