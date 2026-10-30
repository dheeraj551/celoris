"use client"
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
    <div className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl py-4 px-3 mb-6 shadow-xs overflow-hidden">
      <div className="flex items-center gap-4 overflow-x-auto no-scrollbar scroll-smooth">
        {/* Your Story item */}
        <div className="flex flex-col items-center gap-1.5 shrink-0 group">
          <div className="relative">
            <button
              onClick={onOpenCreateStory}
              className="relative block rounded-full p-0.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              aria-label="Add to your story"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-16 h-16 md:w-16 md:h-16 rounded-full object-cover border-2 border-white dark:border-neutral-900 group-hover:scale-105 transition-transform duration-200"
              />
            </button>
            <button
              onClick={onOpenCreateStory}
              aria-label="Add to story"
              className="absolute bottom-0 right-0 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full p-1 border-2 border-white dark:border-neutral-900 shadow-md transition-colors cursor-pointer"
            >
              <Plus size={14} strokeWidth={3} />
            </button>
          </div>
          <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300 max-w-[70px] truncate text-center">
            Your story
          </span>
        </div>

        {/* Stories from following users */}
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
                    ? 'bg-gradient-to-tr from-emerald-500 via-teal-400 to-emerald-300'
                    : 'bg-neutral-300 dark:bg-neutral-700'
                }`}
              >
                <div className="p-0.5 bg-white dark:bg-neutral-900 rounded-full">
                  <img
                    src={story.user.avatar}
                    alt={story.user.username}
                    className="w-15 h-15 rounded-full object-cover"
                  />
                </div>
              </div>
              <span className="text-xs font-medium text-neutral-800 dark:text-neutral-200 max-w-[72px] truncate text-center">
                {story.user.username}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

