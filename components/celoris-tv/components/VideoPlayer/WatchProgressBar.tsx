import React, { useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Video } from '../../types';
import { formatTime } from '../../utils/formatters';
import {
  CheckCircle2,
  Clock,
  RotateCcw,
  Check,
  Sparkles,
  Layers,
  Play,
  Flame,
  Gauge,
} from 'lucide-react';

const SPEED_OPTIONS = [0.5, 1, 1.5, 2];

interface Props {
  video: Video;
}

export const WatchProgressBar: React.FC<Props> = ({ video }) => {
  const {
    currentUser,
    videoCurrentTime,
    seekToTime,
    updateWatchProgress,
    markVideoCompleted,
    resetVideoProgress,
    playbackSpeed,
    setPlaybackSpeed,
  } = useApp();

  const progressBarRef = useRef<HTMLDivElement>(null);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverChapter, setHoverChapter] = useState<string | null>(null);

  const duration = video.duration || 600;
  // Calculate progress ratio from current playback if active, or fall back to stored AppContext progress
  const storedProgress = currentUser.watchProgress[video.id] ?? 0;
  const currentRatio = duration > 0 ? Math.min(1, Math.max(0, videoCurrentTime / duration)) : 0;
  
  // Use the higher value or the active playback ratio to ensure immediate real-time tracking
  const effectiveRatio = Math.max(storedProgress, currentRatio);
  const progressPercent = Math.min(100, Math.round(effectiveRatio * 100));
  const isCompleted = effectiveRatio >= 0.95;

  const remainingSeconds = Math.max(0, duration - videoCurrentTime);
  const remainingMinutes = Math.ceil(remainingSeconds / 60);

  // Next chapter milestone
  const nextChapter = video.chapters?.find(ch => ch.timestamp > videoCurrentTime);

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickRatio = Math.max(0, Math.min(1, clickX / rect.width));
    const targetTime = clickRatio * duration;
    
    seekToTime(targetTime);
    updateWatchProgress(video.id, clickRatio);
  };

  const handleProgressBarHover = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const hoverX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, hoverX / rect.width));
    const time = ratio * duration;
    setHoverTime(time);

    if (video.chapters && video.chapters.length > 0) {
      const chapter = [...video.chapters].reverse().find(c => time >= c.timestamp);
      setHoverChapter(chapter ? chapter.title : null);
    }
  };

  const handleToggleComplete = () => {
    if (isCompleted) {
      resetVideoProgress(video.id);
    } else {
      markVideoCompleted(video.id);
    }
  };

  return (
    <div className="p-4 sm:p-5 bg-[#161B16] border border-[#242A24] rounded-2xl shadow-xl space-y-3.5 text-[#E0E5E0]">
      {/* Header Info & Progress Metric */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-[#7F9172]/20 border border-[#7F9172]/30 rounded-xl text-[#7F9172]">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Lecture Progress
              </h3>
              {isCompleted ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#5C8A67]/20 border border-[#5C8A67]/40 text-[#A8B89C]">
                  <CheckCircle2 className="w-3 h-3 text-[#5C8A67]" /> Completed
                </span>
              ) : effectiveRatio > 0 ? (
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#7F9172]/15 border border-[#7F9172]/30 text-[#A8B89C]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7F9172] animate-pulse" />
                  In Progress
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#1E241E] border border-[#2A322A] text-[#95A395]">
                  Not Started
                </span>
              )}
            </div>
            <p className="text-[11px] text-[#95A395] mt-0.5">
              {isCompleted
                ? 'All learning objectives covered for this lecture'
                : remainingSeconds > 0
                ? `~${remainingMinutes} min remaining of ${formatTime(duration)} total`
                : 'Lecture completed'}
            </p>
          </div>
        </div>

        {/* Progress Percentage Badge */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <div className="text-right">
            <span className="text-base font-bold font-mono text-white">
              {progressPercent}%
            </span>
            <span className="text-[10px] text-[#95A395] block">Tracked in Session</span>
          </div>

          <button
            onClick={handleToggleComplete}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs ${
              isCompleted
                ? 'bg-[#263D28] hover:bg-[#314E34] text-[#C4E3C9] border border-[#5C8A67]/50'
                : 'bg-[#1E241E] hover:bg-[#2A332A] text-[#A8B89C] border border-[#2E382E]'
            }`}
            title={isCompleted ? 'Reset completion status' : 'Mark lecture as finished'}
          >
            <Check className="w-3.5 h-3.5" />
            <span>{isCompleted ? 'Completed' : 'Mark Done'}</span>
          </button>
        </div>
      </div>

      {/* Scrubbable Progress Bar Track with Chapter Markers */}
      <div className="relative pt-1 pb-1">
        <div
          ref={progressBarRef}
          onClick={handleProgressBarClick}
          onMouseMove={handleProgressBarHover}
          onMouseLeave={() => {
            setHoverTime(null);
            setHoverChapter(null);
          }}
          className="relative w-full h-3 bg-[#0D0F0D] border border-[#2A322A] rounded-full cursor-pointer overflow-hidden group/bar transition-all hover:h-4"
        >
          {/* Filled Progress Bar */}
          <div
            className={`absolute top-0 left-0 h-full rounded-full transition-all duration-150 ${
              isCompleted
                ? 'bg-gradient-to-r from-[#5C8A67] to-[#7F9172]'
                : 'bg-gradient-to-r from-[#7F9172]/80 to-[#A8B89C]'
            }`}
            style={{ width: `${progressPercent}%` }}
          />

          {/* Chapter Markers on the Bar */}
          {video.chapters &&
            video.chapters.map((ch, idx) => {
              if (idx === 0) return null;
              const posPercent = (ch.timestamp / duration) * 100;
              return (
                <div
                  key={idx}
                  className="absolute top-0 bottom-0 w-0.5 bg-[#0D0F0D] z-10 opacity-70 group-hover/bar:opacity-100"
                  style={{ left: `${posPercent}%` }}
                  title={`${ch.title} (${formatTime(ch.timestamp)})`}
                />
              );
            })}
        </div>

        {/* Hover Tooltip */}
        {hoverTime !== null && (
          <div
            className="absolute -top-9 -translate-x-1/2 bg-[#121512] border border-[#2E382E] text-white text-[11px] px-2.5 py-1 rounded-lg shadow-2xl pointer-events-none whitespace-nowrap z-30"
            style={{
              left: `${Math.max(8, Math.min(92, (hoverTime / duration) * 100))}%`,
            }}
          >
            <span className="font-mono font-bold text-[#A8B89C]">{formatTime(hoverTime)}</span>
            <span className="text-[#5E6C5E] mx-1">({Math.round((hoverTime / duration) * 100)}%)</span>
            {hoverChapter && <span className="text-[#95A395]">• {hoverChapter}</span>}
          </div>
        )}
      </div>

      {/* Footer Info Row: Timestamp detail, Speed selector (0.5x, 1x, 1.5x, 2x), Next milestone, and controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[#95A395] pt-0.5 border-t border-[#242A24]/60">
        <div className="flex items-center gap-3 font-mono text-[11px]">
          <div>
            <span className="text-white font-bold">{formatTime(videoCurrentTime)}</span>
            <span className="text-[#5E6C5E]"> / </span>
            <span>{formatTime(duration)}</span>
          </div>

          {nextChapter && (
            <button
              onClick={() => seekToTime(nextChapter.timestamp)}
              className="hidden md:flex items-center gap-1 text-[11px] text-[#A8B89C] hover:text-white bg-[#1E241E] hover:bg-[#2A332A] px-2 py-0.5 rounded-md border border-[#2E382E] transition-colors"
            >
              <Layers className="w-3 h-3 text-[#7F9172]" />
              <span>Next: {nextChapter.title}</span>
              <span className="font-mono text-[#7F9172]">@{formatTime(nextChapter.timestamp)}</span>
            </button>
          )}
        </div>

        {/* Speed Selector (0.5x, 1x, 1.5x, 2x) & Quick Controls */}
        <div className="flex items-center gap-3">
          {/* Speed Selector Pills */}
          <div className="flex items-center gap-1 bg-[#0D0F0D] border border-[#242A24] rounded-xl p-1">
            <span className="text-[10px] font-semibold uppercase text-[#95A395] px-1.5 flex items-center gap-1">
              <Gauge className="w-3 h-3 text-[#7F9172]" /> Speed:
            </span>
            <div className="flex items-center gap-0.5">
              {SPEED_OPTIONS.map(speed => {
                const isActive = playbackSpeed === speed;
                return (
                  <button
                    key={speed}
                    onClick={() => setPlaybackSpeed(speed)}
                    className={`px-2 py-0.5 rounded-lg text-[11px] font-mono font-bold transition-all ${
                      isActive
                        ? 'bg-[#7F9172] text-[#0D0F0D] shadow-xs'
                        : 'text-[#95A395] hover:text-white hover:bg-[#1E241E]'
                    }`}
                    title={`Set playback speed to ${speed}x`}
                  >
                    {speed}x
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Reset or Resume Controls */}
          <div className="flex items-center gap-1.5">
            {effectiveRatio > 0 && (
              <button
                onClick={() => resetVideoProgress(video.id)}
                className="flex items-center gap-1 text-[11px] text-[#95A395] hover:text-[#C87D55] px-2 py-1 rounded-lg hover:bg-[#1E241E] transition-colors"
                title="Reset progress to beginning"
              >
                <RotateCcw className="w-3 h-3" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}

            {storedProgress > 0 && videoCurrentTime < 5 && (
              <button
                onClick={() => seekToTime(storedProgress * duration)}
                className="flex items-center gap-1 text-[11px] font-bold text-[#0D0F0D] bg-[#7F9172] hover:bg-[#91A582] px-2.5 py-1 rounded-lg transition-all shadow-xs"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Resume ({formatTime(storedProgress * duration)})</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
