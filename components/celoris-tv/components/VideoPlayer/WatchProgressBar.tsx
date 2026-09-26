import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Video } from '../../types';
import { formatTime } from '../../utils/formatters';
import {
  Clock,
  CheckCircle2,
  RotateCcw,
  Check,
  Layers,
  Gauge,
  Play,
} from 'lucide-react';

interface Props {
  video: Video;
}

const SPEED_OPTIONS = [0.5, 1, 1.5, 2];

export const WatchProgressBar: React.FC<Props> = ({ video }) => {
  const {
    videoCurrentTime,
    seekToTime,
    currentUser,
    playbackSpeed,
    setPlaybackSpeed,
    markVideoCompleted,
    resetVideoProgress,
  } = useApp();

  const progressBarRef = useRef<HTMLDivElement>(null);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverChapter, setHoverChapter] = useState<string | null>(null);

  const duration = video.duration || 600;
  const storedProgress = currentUser.watchProgress[video.id] || 0;
  const effectiveRatio = Math.max(videoCurrentTime / (duration || 1), storedProgress);
  const progressPercent = Math.min(100, Math.round(effectiveRatio * 100));
  const isCompleted = storedProgress >= 0.98;

  const remainingSeconds = Math.max(0, duration - videoCurrentTime);
  const remainingMinutes = Math.ceil(remainingSeconds / 60);

  // Determine current or upcoming chapter based on current playback timestamp
  const nextChapter = video.chapters?.find(ch => ch.timestamp > videoCurrentTime);

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    seekToTime(ratio * duration);
  };

  const handleProgressBarHover = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const hoverX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, hoverX / rect.width));
    const time = ratio * duration;
    setHoverTime(time);

    if (video.chapters && video.chapters.length > 0) {
      const ch = [...video.chapters]
        .reverse()
        .find(c => time >= c.timestamp);
      setHoverChapter(ch ? ch.title : null);
    } else {
      setHoverChapter(null);
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
    <div className="p-4 sm:p-5 bg-[#0e121e]/85 backdrop-blur-xl border border-white/[0.08] rounded-2xl shadow-xl space-y-3.5 text-slate-200 select-none">
      {/* Header Info & Progress Metric */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
                Lecture Progress
              </h3>
              {isCompleted ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 border border-emerald-500/40 text-emerald-300">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Completed
                </span>
              ) : effectiveRatio > 0 ? (
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  In Progress
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/[0.05] border border-white/10 text-slate-400">
                  Not Started
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
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
            <span className="text-[10px] text-slate-500 block font-mono">Tracked in Session</span>
          </div>

          <button
            onClick={handleToggleComplete}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs ${
              isCompleted
                ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40'
                : 'bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border border-white/10'
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
          className="relative w-full h-3 bg-black/60 border border-white/10 rounded-full cursor-pointer overflow-hidden group/bar transition-all hover:h-4 shadow-inner"
        >
          {/* Filled Progress Bar */}
          <div
            className={`absolute top-0 left-0 h-full rounded-full transition-all duration-150 ${
              isCompleted
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_12px_rgba(52,211,153,0.5)]'
                : 'bg-gradient-to-r from-emerald-500 to-cyan-400 shadow-[0_0_10px_rgba(52,211,153,0.3)]'
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
                  className="absolute top-0 bottom-0 w-0.5 bg-black/80 z-10 opacity-70 group-hover/bar:opacity-100"
                  style={{ left: `${posPercent}%` }}
                  title={`${ch.title} (${formatTime(ch.timestamp)})`}
                />
              );
            })}
        </div>

        {/* Hover Tooltip */}
        {hoverTime !== null && (
          <div
            className="absolute -top-9 -translate-x-1/2 bg-[#090b10] border border-white/15 text-white text-[11px] px-2.5 py-1 rounded-lg shadow-2xl pointer-events-none whitespace-nowrap z-30"
            style={{
              left: `${Math.max(8, Math.min(92, (hoverTime / duration) * 100))}%`,
            }}
          >
            <span className="font-mono font-bold text-emerald-400">{formatTime(hoverTime)}</span>
            <span className="text-slate-500 mx-1">({Math.round((hoverTime / duration) * 100)}%)</span>
            {hoverChapter && <span className="text-slate-300">• {hoverChapter}</span>}
          </div>
        )}
      </div>

      {/* Footer Info Row: Timestamp detail, Speed selector (0.5x, 1x, 1.5x, 2x), Next milestone, and controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 pt-0.5 border-t border-white/[0.08]">
        <div className="flex items-center gap-3 font-mono text-[11px]">
          <div>
            <span className="text-white font-bold">{formatTime(videoCurrentTime)}</span>
            <span className="text-slate-500"> / </span>
            <span className="text-slate-400">{formatTime(duration)}</span>
          </div>

          {nextChapter && (
            <button
              onClick={() => seekToTime(nextChapter.timestamp)}
              className="hidden md:flex items-center gap-1 text-[11px] text-emerald-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] px-2 py-0.5 rounded-md border border-white/10 transition-colors"
            >
              <Layers className="w-3 h-3 text-emerald-400" />
              <span>Next: {nextChapter.title}</span>
              <span className="font-mono text-emerald-400 font-bold">@{formatTime(nextChapter.timestamp)}</span>
            </button>
          )}
        </div>

        {/* Speed Selector (0.5x, 1x, 1.5x, 2x) & Quick Controls */}
        <div className="flex items-center gap-3">
          {/* Speed Selector Pills */}
          <div className="flex items-center gap-1 bg-white/[0.03] border border-white/10 rounded-xl p-1 shadow-inner">
            <span className="text-[10px] font-semibold uppercase text-slate-400 px-1.5 flex items-center gap-1 font-mono">
              <Gauge className="w-3 h-3 text-emerald-400" /> Speed:
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
                        ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-black shadow-xs'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
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
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-rose-400 px-2 py-1 rounded-lg hover:bg-white/[0.05] transition-colors"
                title="Reset progress to beginning"
              >
                <RotateCcw className="w-3 h-3" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}

            {storedProgress > 0 && videoCurrentTime < 5 && (
              <button
                onClick={() => seekToTime(storedProgress * duration)}
                className="flex items-center gap-1 text-[11px] font-extrabold text-black bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 px-2.5 py-1 rounded-lg transition-all shadow-xs"
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
