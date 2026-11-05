import React from 'react';
import { Type, Sparkles, RotateCcw, Clipboard, Shuffle } from 'lucide-react';
import { SAMPLE_TEXTS } from '../data/voices';

interface TextInputAreaProps {
  text: string;
  onChangeText: (text: string) => void;
  onApplyPreset: (preset: { title: string; text: string; style: string }) => void;
  maxLength?: number;
}

export const TextInputArea: React.FC<TextInputAreaProps> = ({
  text,
  onChangeText,
  onApplyPreset,
  maxLength = 4000,
}) => {
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      if (clipboardText) {
        onChangeText(clipboardText.slice(0, maxLength));
      }
    } catch {
      // Clipboard permissions may not be available in iframe
    }
  };

  const handleRandomPreset = () => {
    const randomIndex = Math.floor(Math.random() * SAMPLE_TEXTS.length);
    onApplyPreset(SAMPLE_TEXTS[randomIndex]);
  };

  return (
    <div className="space-y-3" id="text-input-section">
      <div className="flex items-center justify-between">
        <label
          htmlFor="speech-input-textarea"
          className="text-base font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-2"
        >
          <Type className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          Text to Speak
        </label>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            id="paste-text-btn"
            onClick={handlePaste}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-md transition-colors dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700"
            title="Paste from clipboard"
          >
            <Clipboard className="h-3.5 w-3.5" />
            Paste
          </button>
          <button
            type="button"
            id="random-sample-btn"
            onClick={handleRandomPreset}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors dark:bg-indigo-950/40 dark:text-indigo-300 dark:hover:bg-indigo-900/50"
            title="Load random sample"
          >
            <Shuffle className="h-3.5 w-3.5" />
            Random
          </button>
          {text.length > 0 && (
            <button
              type="button"
              id="clear-text-btn"
              onClick={() => onChangeText('')}
              className="inline-flex items-center gap-1 px-2 py-1 text-xs text-stone-400 hover:text-rose-600 transition-colors"
              title="Clear text"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Textarea */}
      <div className="relative rounded-2xl border border-stone-200 bg-white shadow-xs focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 dark:border-stone-800 dark:bg-stone-900">
        <textarea
          id="speech-input-textarea"
          rows={5}
          value={text}
          onChange={(e) => onChangeText(e.target.value.slice(0, maxLength))}
          placeholder="Type or paste any text here to hear it read aloud with expressive voice styling..."
          className="w-full resize-y rounded-2xl border-0 bg-transparent p-4 text-sm sm:text-base text-stone-900 placeholder:text-stone-400 focus:outline-none dark:text-stone-100 dark:placeholder:text-stone-500 leading-relaxed min-h-[140px]"
        />

        {/* Footer info inside card */}
        <div className="flex items-center justify-between border-t border-stone-100 px-4 py-2 text-xs text-stone-400 dark:border-stone-800">
          <div className="flex items-center gap-3">
            <span>{wordCount} words</span>
            <span>•</span>
            <span>~{Math.max(1, Math.round(wordCount / 2.5))}s estimated speech</span>
          </div>
          <div className={charCount > maxLength * 0.9 ? 'text-amber-500 font-medium' : ''}>
            {charCount.toLocaleString()} / {maxLength.toLocaleString()} chars
          </div>
        </div>
      </div>

      {/* Quick sample prompt chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 no-scrollbar">
        <span className="text-[11px] font-medium text-stone-400 uppercase tracking-wider shrink-0 flex items-center gap-1 mr-1">
          <Sparkles className="h-3 w-3 text-indigo-500" /> Presets:
        </span>
        {SAMPLE_TEXTS.map((sample) => (
          <button
            key={sample.title}
            type="button"
            id={`preset-btn-${sample.title.toLowerCase().replace(/\s+/g, '-')}`}
            onClick={() => onApplyPreset(sample)}
            className="shrink-0 text-xs px-2.5 py-1 rounded-full border border-stone-200 bg-stone-50/80 text-stone-700 hover:bg-stone-100 hover:border-stone-300 transition-all dark:border-stone-800 dark:bg-stone-900 dark:text-stone-300 dark:hover:bg-stone-800"
          >
            {sample.title}
          </button>
        ))}
      </div>
    </div>
  );
};
