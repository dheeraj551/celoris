import React, { useState } from 'react';
import { Play, Volume2, Check, Sparkles, Filter } from 'lucide-react';
import { VoiceOption, SpeechEngine } from '../types';
import { GEMINI_VOICES } from '../data/voices';

interface VoiceSelectorProps {
  selectedVoice: string;
  onSelectVoice: (voiceId: string) => void;
  onPreviewVoice: (voice: VoiceOption) => void;
  previewingVoiceId: string | null;
  engine: SpeechEngine;
  onChangeEngine: (engine: SpeechEngine) => void;
  browserVoices: SpeechSynthesisVoice[];
  selectedBrowserVoice: string;
  onSelectBrowserVoice: (voiceUri: string) => void;
}

export const VoiceSelector: React.FC<VoiceSelectorProps> = ({
  selectedVoice,
  onSelectVoice,
  onPreviewVoice,
  previewingVoiceId,
  engine,
  onChangeEngine,
  browserVoices,
  selectedBrowserVoice,
  onSelectBrowserVoice,
}) => {
  const [genderFilter, setGenderFilter] = useState<'All' | 'Female' | 'Male' | 'Neutral'>('All');

  const filteredVoices = GEMINI_VOICES.filter((voice) => {
    if (genderFilter === 'All') return true;
    return voice.gender === genderFilter;
  });

  const femaleCount = GEMINI_VOICES.filter((v) => v.gender === 'Female').length;
  const maleCount = GEMINI_VOICES.filter((v) => v.gender === 'Male').length;

  return (
    <div className="space-y-4" id="voice-selector-container">
      {/* Header and Engine Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <Volume2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            Select Voice
            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 font-normal">
              {GEMINI_VOICES.length} Studio Voices
            </span>
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Choose a voice persona tailored to your content, including Leda and expanded female voices
          </p>
        </div>

        {/* Engine switcher */}
        <div className="inline-flex rounded-lg bg-stone-100 p-1 dark:bg-stone-800 self-start sm:self-auto border border-stone-200 dark:border-stone-700">
          <button
            type="button"
            id="engine-gemini-btn"
            onClick={() => onChangeEngine('gemini')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              engine === 'gemini'
                ? 'bg-white text-indigo-700 shadow-sm dark:bg-stone-900 dark:text-indigo-400'
                : 'text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200'
            }`}
          >
            Gemini Neural
          </button>
          <button
            type="button"
            id="engine-browser-btn"
            onClick={() => onChangeEngine('browser')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              engine === 'browser'
                ? 'bg-white text-indigo-700 shadow-sm dark:bg-stone-900 dark:text-indigo-400'
                : 'text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-200'
            }`}
          >
            System Voice
          </button>
        </div>
      </div>

      {engine === 'gemini' && (
        /* Gender Filter Tabs */
        <div className="flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-2">
          <span className="text-xs text-stone-400 flex items-center gap-1 font-medium mr-1">
            <Filter className="h-3 w-3" /> Filter:
          </span>
          <button
            type="button"
            onClick={() => setGenderFilter('All')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              genderFilter === 'All'
                ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-300'
            }`}
          >
            All ({GEMINI_VOICES.length})
          </button>
          <button
            type="button"
            id="filter-female-voices"
            onClick={() => setGenderFilter('Female')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
              genderFilter === 'Female'
                ? 'bg-pink-600 text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-pink-50 hover:text-pink-700 dark:bg-stone-800 dark:text-stone-300'
            }`}
          >
            <span>Female ({femaleCount})</span>
            <span className="px-1 py-0.2 bg-white/20 rounded text-[10px]">Leda, Kore & more</span>
          </button>
          <button
            type="button"
            id="filter-male-voices"
            onClick={() => setGenderFilter('Male')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              genderFilter === 'Male'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-300'
            }`}
          >
            Male ({maleCount})
          </button>
          <button
            type="button"
            onClick={() => setGenderFilter('Neutral')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              genderFilter === 'Neutral'
                ? 'bg-violet-600 text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-300'
            }`}
          >
            Neutral (1)
          </button>
        </div>
      )}

      {engine === 'gemini' ? (
        /* Gemini Voices Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredVoices.map((voice) => {
            const isSelected = selectedVoice === voice.id;
            const isPreviewing = previewingVoiceId === voice.id;

            return (
              <div
                key={voice.id}
                id={`voice-card-${voice.id.toLowerCase()}`}
                onClick={() => onSelectVoice(voice.id)}
                className={`group relative rounded-xl border p-3.5 transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/40 ring-2 ring-indigo-500/20 dark:border-indigo-500 dark:bg-indigo-950/20'
                    : 'border-stone-200 bg-white hover:border-stone-300 hover:shadow-sm dark:border-stone-800 dark:bg-stone-900 dark:hover:border-stone-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`h-9 w-9 rounded-full bg-gradient-to-tr ${voice.avatarColor} text-white flex items-center justify-center font-bold text-sm shadow-sm shrink-0`}
                      >
                        {voice.name[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-semibold text-sm text-stone-900 dark:text-stone-100">
                            {voice.name}
                          </span>
                          <span
                            className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded font-medium ${
                              voice.gender === 'Female'
                                ? 'bg-pink-50 text-pink-700 dark:bg-pink-950/40 dark:text-pink-300'
                                : voice.gender === 'Male'
                                ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'
                                : 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300'
                            }`}
                          >
                            {voice.gender}
                          </span>
                          {voice.id === 'Alt' ? (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300 border border-cyan-400/50">
                              ⚡ Netrunner
                            </span>
                          ) : voice.id === 'Judy' ? (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300 border border-teal-400/50">
                              🎧 BD Tech
                            </span>
                          ) : voice.id === 'Leda' ? (
                            <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                              Featured
                            </span>
                          ) : null}
                        </div>
                        <p className={`text-xs font-medium ${
                          voice.id === 'Alt'
                            ? 'text-cyan-600 dark:text-cyan-400 font-semibold'
                            : voice.id === 'Judy'
                            ? 'text-teal-600 dark:text-teal-400 font-semibold'
                            : 'text-indigo-600 dark:text-indigo-400'
                        }`}>
                          {voice.personality}
                        </p>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="h-5 w-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
                        <Check className="h-3 w-3" />
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed mb-3">
                    {voice.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                  <span className="text-[11px] text-stone-400">Sample preview</span>
                  <button
                    type="button"
                    id={`preview-voice-${voice.id.toLowerCase()}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onPreviewVoice(voice);
                    }}
                    className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md transition-colors ${
                      isPreviewing
                        ? 'bg-indigo-600 text-white'
                        : 'text-stone-700 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800'
                    }`}
                  >
                    <Play className={`h-3 w-3 ${isPreviewing ? 'animate-spin' : ''}`} />
                    {isPreviewing ? 'Playing...' : 'Hear sample'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Browser Voice Selector */
        <div className="rounded-xl border border-stone-200 bg-white p-4 dark:border-stone-800 dark:bg-stone-900">
          <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-2">
            Available Browser System Voices ({browserVoices.length})
          </label>
          {browserVoices.length > 0 ? (
            <select
              id="browser-voice-select"
              value={selectedBrowserVoice}
              onChange={(e) => onSelectBrowserVoice(e.target.value)}
              className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
            >
              {browserVoices.map((v) => (
                <option key={v.voiceURI} value={v.voiceURI}>
                  {v.name} ({v.lang}) {v.default ? '— Default' : ''}
                </option>
              ))}
            </select>
          ) : (
            <p className="text-xs text-amber-600 dark:text-amber-400">
              No local browser speech voices detected. Switch to Gemini Neural for synthesis.
            </p>
          )}
          <p className="mt-2 text-xs text-stone-500 dark:text-stone-400">
            System voices run locally in your browser with zero latency.
          </p>
        </div>
      )}
    </div>
  );
};
