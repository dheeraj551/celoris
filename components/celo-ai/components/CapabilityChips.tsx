import React, { useRef, useState } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import {
  AndroidIcon,
  GoogleDriveIcon,
  GoogleSheetsIcon,
  GmailIcon,
  GoogleCalendarIcon,
  GoogleDocsIcon,
} from './ServiceIcons';

export interface CapabilityChip {
  id: string;
  label: string;
  icon: React.ReactNode;
  prompt: string;
  tag: string;
}

interface CapabilityChipsProps {
  onSelectCapability: (prompt: string, tag: string) => void;
}

export const CapabilityChips: React.FC<CapabilityChipsProps> = ({ onSelectCapability }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const capabilities: CapabilityChip[] = [
    {
      id: 'android',
      label: 'Build an Android app',
      icon: <AndroidIcon className="w-4 h-4" />,
      prompt: 'Build a modern native Android app with Kotlin Jetpack Compose, Material You UI dynamic theming, offline Room DB caching, and sleek animations.',
      tag: 'Android',
    },
    {
      id: 'drive',
      label: 'Google Drive',
      icon: <GoogleDriveIcon className="w-4 h-4" />,
      prompt: 'Create a Google Drive workspace assistant that searches, indexes, summarizes documents, and automatically organizes shared files.',
      tag: 'Drive',
    },
    {
      id: 'sheets',
      label: 'Google Sheets',
      icon: <GoogleSheetsIcon className="w-4 h-4" />,
      prompt: 'Build an automated Google Sheets analytics tool with formula generators, live data charts, and automated CSV syncing.',
      tag: 'Sheets',
    },
    {
      id: 'gmail',
      label: 'Gmail',
      icon: <GmailIcon className="w-4 h-4" />,
      prompt: 'Design an intelligent Gmail assistant that categorizes emails, extracts action items, and generates personalized responses.',
      tag: 'Gmail',
    },
    {
      id: 'calendar',
      label: 'Google Calendar',
      icon: <GoogleCalendarIcon className="w-4 h-4" />,
      prompt: 'Create a smart Google Calendar scheduler with conflict resolution, natural language event booking, and meeting agenda prep.',
      tag: 'Calendar',
    },
    {
      id: 'docs',
      label: 'Google Docs',
      icon: <GoogleDocsIcon className="w-4 h-4" />,
      prompt: 'Build a Google Docs research generator that creates structured outlines, references citations, and exports to shared docs.',
      tag: 'Docs',
    },
  ];

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -240 : 240;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const updateScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto mt-3 px-1">
      {/* Left scroll indicator arrow */}
      {canScrollLeft && (
        <button
          type="button"
          onClick={() => handleScroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full bg-[#1e1f20] hover:bg-[#333537] text-[#c4c7c5] border border-[#333537] shadow-lg backdrop-blur-md transition-all active:scale-95"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      )}

      {/* Chips scroll container */}
      <div
        ref={scrollContainerRef}
        onScroll={updateScrollButtons}
        className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-1 scroll-smooth px-1"
      >
        {capabilities.map((item) => (
          <button
            key={item.id}
            id={`capability-chip-${item.id}`}
            type="button"
            onClick={() => onSelectCapability(item.prompt, item.tag)}
            className="group flex-shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#1e1f20] hover:bg-[#333537] text-[#e3e3e3] hover:text-white text-xs sm:text-sm font-medium border border-[#333537] hover:border-[#444746] transition-all duration-200 active:scale-95 shadow-sm whitespace-nowrap"
          >
            <span className="flex-shrink-0 transition-transform duration-200 group-hover:scale-110">
              {item.icon}
            </span>
            <span className="text-[#e3e3e3] group-hover:text-white">{item.label}</span>
          </button>
        ))}

        {/* Right scroll button / arrow indicator */}
        <button
          type="button"
          onClick={() => handleScroll('right')}
          className={`flex-shrink-0 p-2 rounded-full bg-[#1e1f20] hover:bg-[#333537] text-[#8e918f] hover:text-[#e3e3e3] border border-[#333537] transition-all duration-200 active:scale-95 ${
            !canScrollRight ? 'opacity-50' : 'opacity-100'
          }`}
          aria-label="Scroll capabilities right"
          title="See more capabilities"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
