"use client"
import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Heart, Send, Pause, Play, Volume2 } from 'lucide-react';
import { UserStory } from '../types';
import { formatTimeAgo } from '../utils/socialLogic';
import { soundManager } from '../utils/sound';

interface StoryViewerModalProps {
  stories: UserStory[];
  initialUserIndex: number;
  onClose: () => void;
  onStorySeen?: (userId: string) => void;
}

export const StoryViewerModal: React.FC<StoryViewerModalProps> = ({
  stories,
  initialUserIndex,
  onClose,
  onStorySeen,
}) => {
  const [userIndex, setUserIndex] = useState(initialUserIndex);
  const [slideIndex, setSlideIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [sentReaction, setSentReaction] = useState(false);
  const timerRef = useRef<number | null>(null);

  const currentStory = stories[userIndex];
  const currentSlide = currentStory?.slides[slideIndex];

  useEffect(() => {
    if (currentStory) {
      onStorySeen?.(currentStory.userId);
    }
  }, [userIndex, currentStory, onStorySeen]);

  // Story auto-advance timer
  useEffect(() => {
    if (!currentSlide || isPaused) return;

    const intervalTime = 50; // update progress every 50ms
    const totalDuration = (currentSlide.durationSeconds || 5) * 1000;
    const step = (intervalTime / totalDuration) * 100;

    timerRef.current = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + step;
      });
    }, intervalTime);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [userIndex, slideIndex, isPaused, currentSlide]);

  const handleNext = () => {
    setProgress(0);
    if (slideIndex < currentStory.slides.length - 1) {
      setSlideIndex((prev) => prev + 1);
    } else if (userIndex < stories.length - 1) {
      setUserIndex((prev) => prev + 1);
      setSlideIndex(0);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    setProgress(0);
    if (slideIndex > 0) {
      setSlideIndex((prev) => prev - 1);
    } else if (userIndex > 0) {
      setUserIndex((prev) => prev - 1);
      const prevStory = stories[userIndex - 1];
      setSlideIndex(prevStory.slides.length - 1);
    }
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    soundManager.playSendSound();
    setSentReaction(true);
    setReplyText('');
    setTimeout(() => setSentReaction(false), 2000);
  };

  const handleQuickReaction = (emoji: string) => {
    soundManager.playLikeSound();
    setSentReaction(true);
    setTimeout(() => setSentReaction(false), 2000);
  };

  if (!currentStory || !currentSlide) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md animate-modal-in"
    >
      {/* Close button */}
      <button
        onClick={onClose}
        aria-label="Close story viewer"
        className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
      >
        <X size={24} />
      </button>

        {/* Story Card Container */}
        <div
          className="relative w-full max-w-md h-[92vh] max-h-[820px] rounded-2xl overflow-hidden bg-neutral-900 shadow-2xl flex flex-col justify-between select-none"
          onMouseDown={() => setIsPaused(true)}
          onMouseUp={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          {/* Top Progress Bars */}
          <div className="absolute top-0 inset-x-0 z-30 p-3 pt-3 flex gap-1.5 bg-gradient-to-b from-black/80 to-transparent">
            {currentStory.slides.map((slide, idx) => {
              let width = '0%';
              if (idx < slideIndex) width = '100%';
              else if (idx === slideIndex) width = `${progress}%`;

              return (
                <div key={slide.id} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full transition-all duration-75"
                    style={{ width }}
                  />
                </div>
              );
            })}
          </div>

          {/* User info header */}
          <div className="absolute top-6 inset-x-0 z-30 px-4 py-2 flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <img
                src={currentStory.user.avatar}
                alt={currentStory.user.username}
                className="w-9 h-9 rounded-full object-cover border-2 border-white/60"
              />
              <div className="flex flex-col">
                <span className="text-sm font-semibold flex items-center gap-1.5 drop-shadow-md">
                  {currentStory.user.username}
                  <span className="text-xs text-white/70 font-normal">
                    {formatTimeAgo(currentStory.updatedAt)}
                  </span>
                </span>
                {currentStory.user.isVerified && (
                  <span className="text-[10px] text-sky-400 font-medium">Verified Creator</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPaused((prev) => !prev);
                }}
                className="p-1.5 rounded-full bg-black/40 text-white/90 hover:text-white"
                aria-label={isPaused ? "Resume story" : "Pause story"}
              >
                {isPaused ? <Play size={16} /> : <Pause size={16} />}
              </button>
            </div>
          </div>

          {/* Story media */}
          <div className="relative w-full h-full flex items-center justify-center bg-black">
            <img
              src={currentSlide.mediaUrl}
              alt={currentSlide.caption || "Story slide"}
              className="w-full h-full object-cover"
            />

            {/* Click navigation overlays */}
            <div
              className="absolute inset-y-0 left-0 w-1/3 z-20 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
            />
            <div
              className="absolute inset-y-0 right-0 w-1/3 z-20 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
            />

            {/* Caption banner if exists */}
            {currentSlide.caption && (
              <div className="absolute bottom-20 inset-x-4 z-30 p-3 rounded-xl bg-black/60 backdrop-blur-md text-white text-sm text-center">
                {currentSlide.caption}
              </div>
            )}

            {/* Sent reaction feedback */}
            {sentReaction && (
              <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none animate-heart-burst">
                <div className="px-5 py-3 rounded-2xl bg-black/80 backdrop-blur-md text-white font-semibold flex items-center gap-2 shadow-2xl">
                  <Heart className="w-6 h-6 text-rose-500 fill-rose-500 animate-bounce" />
                  <span>Reaction Sent</span>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Reply Bar */}
          <div
            className="relative z-30 p-3 bg-gradient-to-t from-black/90 via-black/60 to-transparent flex items-center gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleSendReply} className="flex-1 relative">
              <input
                type="text"
                placeholder={`Reply to ${currentStory.user.username}...`}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onFocus={() => setIsPaused(true)}
                onBlur={() => setIsPaused(false)}
                className="w-full pl-4 pr-10 py-2.5 rounded-full bg-white/15 border border-white/20 text-white placeholder-white/60 text-sm focus:outline-none focus:ring-2 focus:ring-white/40"
              />
              {replyText.trim() && (
                <button
                  type="submit"
                  aria-label="Send reply"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-white hover:text-sky-400"
                >
                  <Send size={16} />
                </button>
              )}
            </form>

            <button
              type="button"
              onClick={() => handleQuickReaction('❤️')}
              aria-label="Send heart reaction"
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <Heart size={20} className="hover:text-rose-500 hover:fill-rose-500 transition-colors" />
            </button>
          </div>
        </div>

        {/* Previous & Next Story Desktop Buttons */}
        {userIndex > 0 && (
          <button
            onClick={handlePrev}
            aria-label="Previous user story"
            className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/15 hover:bg-white/30 text-white transition-colors cursor-pointer"
          >
            <ChevronLeft size={28} />
          </button>
        )}
        {userIndex < stories.length - 1 && (
          <button
            onClick={handleNext}
            aria-label="Next user story"
            className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/15 hover:bg-white/30 text-white transition-colors cursor-pointer"
          >
            <ChevronRight size={28} />
          </button>
        )}
      </div>
  );
};

