import React, { useState } from 'react';
import {
  FolderDown,
  Play,
  Pause,
  Download,
  Trash2,
  Search,
  CheckCircle2,
  HardDrive,
  Calendar,
  Clock,
  Volume2,
} from 'lucide-react';
import { SavedAudioClip } from '../types';
import { downloadWavFile, formatBytes } from '../lib/offlineStorage';

interface OfflineLibraryProps {
  clips: SavedAudioClip[];
  activePlayingId: string | null;
  isPlaying: boolean;
  onPlayClip: (clip: SavedAudioClip) => void;
  onPauseClip: () => void;
  onDeleteClip: (id: string) => void;
  onClearAll: () => void;
  totalStorageBytes: number;
}

export const OfflineLibrary: React.FC<OfflineLibraryProps> = ({
  clips,
  activePlayingId,
  isPlaying,
  onPlayClip,
  onPauseClip,
  onDeleteClip,
  onClearAll,
  totalStorageBytes,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [voiceFilter, setVoiceFilter] = useState('all');

  const filteredClips = clips.filter((clip) => {
    const matchesSearch =
      clip.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      clip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      clip.voice.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesVoice = voiceFilter === 'all' || clip.voice.toLowerCase() === voiceFilter.toLowerCase();
    return matchesSearch && matchesVoice;
  });

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (sec: number) => {
    if (isNaN(sec) || sec < 0) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleDownload = (clip: SavedAudioClip) => {
    const sanitizedTitle = (clip.title || 'speech')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .slice(0, 30);
    const filename = `${sanitizedTitle}_${clip.voice.toLowerCase()}_${clip.style}.wav`;
    downloadWavFile(clip.audioBase64, filename);
  };

  return (
    <div className="space-y-4" id="offline-library-container">
      {/* Header & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 dark:border-stone-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <FolderDown className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              Offline Audio Library
            </h2>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              <CheckCircle2 className="h-3 w-3" />
              100% Offline Access
            </span>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            All audio files are cached directly in your browser. Play or download them anytime without an internet connection.
          </p>
        </div>

        {/* Storage stats */}
        <div className="flex items-center gap-3 text-xs text-stone-600 dark:text-stone-300">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 font-medium">
            <HardDrive className="h-3.5 w-3.5 text-stone-500" />
            <span>{clips.length} Saved</span>
            <span className="text-stone-400">•</span>
            <span>{formatBytes(totalStorageBytes)}</span>
          </div>
          {clips.length > 0 && (
            <button
              type="button"
              onClick={onClearAll}
              className="text-stone-400 hover:text-rose-600 text-xs transition-colors p-1"
              title="Clear all saved clips"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Search & Filter Bar */}
      {clips.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
            <input
              type="text"
              placeholder="Search saved clips by text or voice..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-stone-200 bg-white placeholder:text-stone-400 focus:border-indigo-500 focus:outline-none dark:border-stone-800 dark:bg-stone-900 dark:text-stone-100"
            />
          </div>
          <select
            value={voiceFilter}
            onChange={(e) => setVoiceFilter(e.target.value)}
            className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs sm:text-sm text-stone-700 focus:border-indigo-500 focus:outline-none dark:border-stone-800 dark:bg-stone-900 dark:text-stone-200"
          >
            <option value="all">All Voices</option>
            <option value="alt">⚡ Alt Cunningham (Netrunner)</option>
            <option value="judy">🎧 Judy Alvarez (BD Tech)</option>
            <option value="leda">Leda (Female)</option>
            <option value="kore">Kore (Female)</option>
            <option value="aoede">Aoede (Female)</option>
            <option value="callirrhoe">Callirrhoe (Female)</option>
            <option value="autonoe">Autonoe (Female)</option>
            <option value="despina">Despina (Female)</option>
            <option value="erinome">Erinome (Female)</option>
            <option value="laomedeia">Laomedeia (Female)</option>
            <option value="achernar">Achernar (Female)</option>
            <option value="vindemiatrix">Vindemiatrix (Female)</option>
            <option value="sulafat">Sulafat (Female)</option>
            <option value="puck">Puck (Male)</option>
            <option value="fenrir">Fenrir (Male)</option>
            <option value="charon">Charon (Male)</option>
            <option value="orus">Orus (Male)</option>
            <option value="enceladus">Enceladus (Male)</option>
            <option value="algieba">Algieba (Male)</option>
            <option value="zephyr">Zephyr (Neutral)</option>
          </select>
        </div>
      )}

      {/* Clips List */}
      {filteredClips.length > 0 ? (
        <div className="grid grid-cols-1 gap-3">
          {filteredClips.map((clip) => {
            const isCurrentPlaying = activePlayingId === clip.id && isPlaying;

            return (
              <div
                key={clip.id}
                id={`clip-card-${clip.id}`}
                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border transition-all ${
                  activePlayingId === clip.id
                    ? 'border-indigo-500 bg-indigo-50/40 shadow-xs dark:bg-indigo-950/20'
                    : 'border-stone-200 bg-white hover:border-stone-300 dark:border-stone-800 dark:bg-stone-900'
                }`}
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  {/* Play/Pause Button */}
                  <button
                    type="button"
                    onClick={() => {
                      if (isCurrentPlaying) {
                        onPauseClip();
                      } else {
                        onPlayClip(clip);
                      }
                    }}
                    className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors ${
                      isCurrentPlaying
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-200'
                    }`}
                    title={isCurrentPlaying ? 'Pause' : 'Play'}
                  >
                    {isCurrentPlaying ? (
                      <Pause className="h-4 w-4 fill-current" />
                    ) : (
                      <Play className="h-4 w-4 fill-current ml-0.5" />
                    )}
                  </button>

                  {/* Text & Meta details */}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-stone-900 dark:text-stone-100 line-clamp-2 leading-snug">
                      {clip.text}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 mt-2 text-[11px] text-stone-500 dark:text-stone-400">
                      <span className="font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                        <Volume2 className="h-3 w-3" />
                        {clip.voice}
                      </span>
                      <span>•</span>
                      <span className="capitalize px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                        {clip.style}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDuration(clip.duration)}
                      </span>
                      <span>•</span>
                      <span>{formatBytes(clip.fileSizeBytes || clip.audioBase64.length * 0.75)}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(clip.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions: Download & Delete */}
                <div className="flex items-center justify-end gap-1.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100 dark:border-stone-800">
                  <button
                    type="button"
                    onClick={() => handleDownload(clip)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors dark:bg-stone-800 dark:text-stone-200 dark:hover:bg-stone-700"
                    title="Download .WAV audio file"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Download</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeleteClip(clip.id)}
                    className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors dark:hover:bg-rose-950/40"
                    title="Delete clip from offline storage"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : clips.length > 0 ? (
        <div className="text-center py-8 border border-dashed border-stone-200 dark:border-stone-800 rounded-2xl">
          <p className="text-sm text-stone-500">No clips match your search query.</p>
        </div>
      ) : (
        <div className="text-center py-10 border border-dashed border-stone-200 dark:border-stone-800 rounded-2xl bg-stone-50/40 dark:bg-stone-900/30">
          <FolderDown className="h-8 w-8 text-stone-300 dark:text-stone-600 mx-auto mb-2" />
          <p className="text-sm font-medium text-stone-700 dark:text-stone-300">
            No offline audio files saved yet
          </p>
          <p className="text-xs text-stone-500 dark:text-stone-400 max-w-sm mx-auto mt-1">
            Type some text above, click <span className="font-semibold text-indigo-600">Generate & Speak</span>, and tap <span className="font-semibold text-indigo-600">Save Offline</span> to store audio clips for instant offline listening.
          </p>
        </div>
      )}
    </div>
  );
};
