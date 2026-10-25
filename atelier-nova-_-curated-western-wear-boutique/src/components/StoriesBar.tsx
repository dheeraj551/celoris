import React from 'react';
import { Story } from '../types';

interface StoriesBarProps {
  stories: Story[];
  onSelectStory: (story: Story) => void;
}

export const StoriesBar: React.FC<StoriesBarProps> = ({ stories, onSelectStory }) => {
  return (
    <div className="py-6 border-b border-[#EAE6DF] overflow-x-auto no-scrollbar">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 flex items-center gap-5 sm:gap-8 min-w-max">
        {stories.map((story) => (
          <button
            key={story.id}
            onClick={() => onSelectStory(story)}
            className="flex flex-col items-center gap-2 group cursor-pointer focus:outline-none"
          >
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full p-[2px] story-ring transition-transform group-hover:scale-105">
              <div className="w-full h-full rounded-full p-[2px] bg-[#FAF9F6]">
                <img
                  src={story.thumbnail}
                  alt={story.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full rounded-full object-cover grayscale-[15%] group-hover:grayscale-0 transition-all"
                />
              </div>
            </div>
            <span className="text-[11px] sm:text-xs font-medium text-[#524C44] group-hover:text-[#181716] tracking-tight whitespace-nowrap">
              {story.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
