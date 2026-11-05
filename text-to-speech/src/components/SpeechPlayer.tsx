import React from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Download,
  Bookmark,
  BookmarkCheck,
  Volume2,
  VolumeX,
  Radio,
  Loader2,
} from 'lucide-react';
import { AudioWaveform } from './AudioWaveform';

interface SpeechPlayerProps {
  isSynthesizing: boolean;
  onGenerateAndPlay: () => void;
  hasAudio: boolean;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playbackRate: number;
  volume: number;
  isMuted: boolean;
  voiceName: string;
  styleName: string;
  isSavedOffline: boolean;
  isNetrunnerMode?: boolean;
  onTogglePlay: () => void;
  onReplay: () => void;
  onSeek: (time: number) => void;
  onChangeRate: (rate: number) => void;
  onChangeVolume: (vol: number) => void;
  onToggleMute: () => void;
  onDownloadWav: () => void;
  onSaveToOffline: () => void;
}

export const SpeechPlayer: React.FC<SpeechPlayerProps> = ({
  isSynthesizing,
  onGenerateAndPlay,
  hasAudio,
  isPlaying,
  currentTime,
  duration,
  playbackRate,
  volume,
  isMuted,
  voiceName,
  styleName,
  isSavedOffline,
  isNetrunnerMode = false,
  onTogglePlay,
  onReplay,
  onSeek,
  onChangeRate,
  onChangeVolume,
  onToggleMute,
  onDownloadWav,
  onSaveToOffline,
}) => {
  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const speedOptions = [0.75, 1.0, 1.25, 1.5, 2.0];

  return (
    <div
      id="speech-player-card"
      className={`rounded-2xl p-5 shadow-sm transition-all ${
        isNetrunnerMode
          ? 'border-2 border-cyan-500/50 bg-[#070d1e] text-cyan-100 shadow-[0_0_25px_rgba(0,240,255,0.12)]'
          : 'border border-indigo-100 bg-gradient-to-b from-indigo-50/50 to-white dark:border-indigo-950/50 dark:from-stone-900 dark:to-stone-900'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        {/* Active voice & style info */}
        <div className="flex items-center gap-2.5">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-xs ${
              isNetrunnerMode
                ? 'bg-cyan-950 border border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(0,240,255,0.5)]'
                : 'bg-indigo-600'
            }`}
          >
            <Radio className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`font-semibold ${isNetrunnerMode ? 'text-cyan-200 font-mono tracking-wider' : 'text-stone-900 dark:text-stone-100'}`}>
                {voiceName}
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${
                  isNetrunnerMode
                    ? 'bg-cyan-950 border border-cyan-500/50 text-cyan-300 font-mono text-[10px]'
                    : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                }`}
              >
                {isNetrunnerMode ? '⚡ Netrunner DSP Active' : `${styleName} Style`}
              </span>
            </div>
            <p className={`text-xs ${isNetrunnerMode ? 'font-mono text-cyan-500/80' : 'text-stone-500 dark:text-stone-400'}`}>
              {hasAudio
                ? `${formatTime(currentTime)} / ${formatTime(duration)}`
                : 'Ready to synthesize and listen'}
            </p>
          </div>
        </div>

        {/* Primary Generate / Play Button */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          {!hasAudio ? (
            <button
              type="button"
              id="generate-speak-btn"
              disabled={isSynthesizing}
              onClick={onGenerateAndPlay}
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99] cursor-pointer ${
                isNetrunnerMode
                  ? 'bg-gradient-to-r from-cyan-500 to-fuchsia-600 text-black font-mono font-bold hover:from-cyan-400 hover:to-fuchsia-500 shadow-[0_0_15px_rgba(0,240,255,0.5)]'
                  : 'bg-indigo-600 text-white shadow-md hover:bg-indigo-500 hover:shadow-lg'
              }`}
            >
              {isSynthesizing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {isNetrunnerMode ? 'Compiling Neural Audio...' : 'Synthesizing Speech...'}
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 fill-current" />
                  {isNetrunnerMode ? 'Transmit Neural Speech' : 'Generate & Speak'}
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              id="re-synthesize-btn"
              disabled={isSynthesizing}
              onClick={onGenerateAndPlay}
              className={`text-xs px-3 py-2 rounded-xl transition-colors font-medium cursor-pointer ${
                isNetrunnerMode
                  ? 'bg-cyan-950 border border-cyan-500 text-cyan-300 hover:bg-cyan-900 font-mono'
                  : 'text-indigo-600 hover:text-indigo-800 bg-white border border-indigo-200 hover:bg-indigo-50 dark:bg-stone-800 dark:border-stone-700 dark:text-indigo-400'
              }`}
            >
              {isSynthesizing ? 'Synthesizing...' : isNetrunnerMode ? 'Re-Transmit' : 'Re-synthesize'}
            </button>
          )}
        </div>
      </div>

      {/* Waveform & Playback Controls when audio exists */}
      {hasAudio && (
        <div className={`space-y-4 pt-2 border-t ${isNetrunnerMode ? 'border-cyan-500/25' : 'border-indigo-100/60 dark:border-stone-800'}`}>
          <AudioWaveform
            isPlaying={isPlaying}
            currentTime={currentTime}
            duration={duration}
            onSeek={onSeek}
            accentColor={isNetrunnerMode ? '#00f0ff' : '#6366f1'}
          />

          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Play/Pause & Replay */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                id="playback-toggle-btn"
                onClick={onTogglePlay}
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 transition-colors"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5 fill-current" />
                ) : (
                  <Play className="h-5 w-5 fill-current ml-0.5" />
                )}
              </button>

              <button
                type="button"
                id="playback-replay-btn"
                onClick={onReplay}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-stone-200 bg-white text-stone-700 hover:bg-stone-100 transition-colors dark:border-stone-800 dark:bg-stone-800 dark:text-stone-300"
                title="Replay from start"
              >
                <RotateCcw className="h-4 w-4" />
              </button>

              {/* Speed rate pills */}
              <div className="hidden sm:flex items-center gap-1 ml-2 bg-stone-100 p-1 rounded-lg dark:bg-stone-800">
                {speedOptions.map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => onChangeRate(rate)}
                    className={`px-2 py-1 text-[11px] font-medium rounded ${
                      playbackRate === rate
                        ? 'bg-white text-indigo-700 shadow-xs dark:bg-stone-900 dark:text-indigo-400 font-bold'
                        : 'text-stone-500 hover:text-stone-800 dark:text-stone-400'
                    }`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>
            </div>

            {/* Volume & Mute */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onToggleMute}
                className="p-1.5 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="h-4 w-4 text-rose-500" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={(e) => onChangeVolume(parseFloat(e.target.value))}
                className="w-16 sm:w-20 accent-indigo-600 h-1.5 bg-stone-200 rounded-lg cursor-pointer dark:bg-stone-700"
              />
            </div>

            {/* Offline Save & Download options */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                id="save-offline-btn"
                onClick={onSaveToOffline}
                className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl transition-all border ${
                  isSavedOffline
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800'
                    : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50 dark:bg-stone-800 dark:border-stone-700 dark:text-stone-300'
                }`}
                title="Save to local library for offline access"
              >
                {isSavedOffline ? (
                  <>
                    <BookmarkCheck className="h-3.5 w-3.5 text-emerald-600" />
                    Saved Offline
                  </>
                ) : (
                  <>
                    <Bookmark className="h-3.5 w-3.5 text-indigo-600" />
                    Save Offline
                  </>
                )}
              </button>

              <button
                type="button"
                id="download-wav-btn"
                onClick={onDownloadWav}
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl bg-stone-900 text-white hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white shadow-xs transition-colors"
                title="Download standard WAV audio file to your device"
              >
                <Download className="h-3.5 w-3.5" />
                Download .WAV
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
