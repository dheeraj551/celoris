import React, { useEffect, useRef } from 'react';

interface AudioWaveformProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  accentColor?: string;
}

export const AudioWaveform: React.FC<AudioWaveformProps> = ({
  isPlaying,
  currentTime,
  duration,
  onSeek,
  accentColor = '#6366f1',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const barsCount = 48;

  // Pre-generate pseudo-random bar heights based on index to create a realistic waveform look
  const waveHeights = useRef<number[]>(
    Array.from({ length: barsCount }, (_, i) => {
      const normalized = Math.sin((i / barsCount) * Math.PI);
      const randomJitter = 0.3 + 0.7 * Math.abs(Math.sin(i * 1.7) * Math.cos(i * 0.9));
      return Math.max(12, Math.round(normalized * randomJitter * 100));
    })
  ).current;

  const progressPercent = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || duration <= 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickPercent = Math.max(0, Math.min(1, clickX / rect.width));
    onSeek(clickPercent * duration);
  };

  return (
    <div className="w-full select-none" id="audio-waveform-wrapper">
      <div
        ref={containerRef}
        onClick={handleClick}
        className="group relative h-16 w-full cursor-pointer rounded-xl bg-stone-100/80 px-3 py-2 transition-all hover:bg-stone-200/70 dark:bg-stone-900/60 dark:hover:bg-stone-800/60 flex items-center justify-between gap-1"
        title="Click to seek"
      >
        {waveHeights.map((heightPercent, index) => {
          const barPercent = (index / barsCount) * 100;
          const isPlayed = barPercent <= progressPercent;

          // Animation height multiplier when playing
          return (
            <div
              key={index}
              className="relative flex-1 flex flex-col items-center justify-center h-full"
            >
              <div
                className={`w-full rounded-full transition-all duration-150 ${
                  !accentColor || accentColor === '#6366f1'
                    ? isPlayed
                      ? 'bg-indigo-600 dark:bg-indigo-400 opacity-95'
                      : 'bg-stone-300 dark:bg-stone-700 opacity-60'
                    : isPlayed
                    ? 'opacity-95 shadow-[0_0_8px_rgba(0,240,255,0.6)]'
                    : 'bg-cyan-950/60 dark:bg-cyan-950/60 opacity-40'
                } ${isPlaying && isPlayed ? 'animate-pulse' : ''}`}
                style={{
                  height: `${heightPercent}%`,
                  minHeight: '6px',
                  backgroundColor: accentColor && accentColor !== '#6366f1' && isPlayed ? accentColor : undefined,
                }}
              />
            </div>
          );
        })}

        {/* Playhead indicator */}
        <div
          className="pointer-events-none absolute top-0 bottom-0 w-0.5 transition-all duration-75"
          style={{
            left: `${progressPercent}%`,
            backgroundColor: accentColor,
          }}
        >
          <div
            className="absolute -top-1 -left-1.5 h-3.5 w-3.5 rounded-full shadow-sm ring-2 ring-white dark:ring-stone-900"
            style={{ backgroundColor: accentColor }}
          />
        </div>
      </div>
    </div>
  );
};
