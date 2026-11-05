import React from 'react';
import {
  Sparkles,
  Smile,
  Wind,
  Radio,
  Flame,
  Zap,
  Feather,
  ShieldCheck,
  Heart,
  Sliders,
  Cpu,
  Headphones,
} from 'lucide-react';
import { VOICE_STYLES } from '../data/voices';

interface StyleSelectorProps {
  selectedStyle: string;
  onSelectStyle: (styleId: string) => void;
  speed: number;
  onChangeSpeed: (speed: number) => void;
  pitch: number;
  onChangePitch: (pitch: number) => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Sparkles: <Sparkles className="h-4 w-4" />,
  Smile: <Smile className="h-4 w-4" />,
  Wind: <Wind className="h-4 w-4" />,
  Radio: <Radio className="h-4 w-4" />,
  Flame: <Flame className="h-4 w-4" />,
  Zap: <Zap className="h-4 w-4" />,
  Feather: <Feather className="h-4 w-4" />,
  ShieldCheck: <ShieldCheck className="h-4 w-4" />,
  Heart: <Heart className="h-4 w-4" />,
  Cpu: <Cpu className="h-4 w-4" />,
  Headphones: <Headphones className="h-4 w-4" />,
};

export const StyleSelector: React.FC<StyleSelectorProps> = ({
  selectedStyle,
  onSelectStyle,
  speed,
  onChangeSpeed,
  pitch,
  onChangePitch,
}) => {
  return (
    <div className="space-y-4" id="style-selector-container">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            Voice Style & Delivery Tone
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Shape emotional inflection, pacing, and presence
          </p>
        </div>
      </div>

      {/* Style Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-2.5">
        {VOICE_STYLES.map((style) => {
          const isSelected = selectedStyle === style.id;
          const icon = ICON_MAP[style.iconName] || <Sparkles className="h-4 w-4" />;

          return (
            <button
              key={style.id}
              type="button"
              id={`style-btn-${style.id}`}
              onClick={() => onSelectStyle(style.id)}
              className={`flex flex-col text-left p-3 rounded-xl border transition-all ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20 shadow-xs dark:border-indigo-500 dark:bg-indigo-950/30'
                  : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50/60 dark:border-stone-800 dark:bg-stone-900 dark:hover:border-stone-700'
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span
                  className={`p-1.5 rounded-lg ${
                    isSelected
                      ? 'bg-indigo-600 text-white'
                      : 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300'
                  }`}
                >
                  {icon}
                </span>
                <span className="font-semibold text-xs sm:text-sm text-stone-900 dark:text-stone-100">
                  {style.name}
                </span>
              </div>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-2">
                {style.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Fine-Tuning Sliders: Speed & Pitch */}
      <div className="rounded-xl border border-stone-200 bg-stone-50/60 p-3.5 dark:border-stone-800 dark:bg-stone-900/40">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 dark:text-stone-300 mb-3">
          <Sliders className="h-3.5 w-3.5 text-stone-500" />
          Acoustic Fine Tuning
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Speed slider */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-stone-600 dark:text-stone-400">Pacing / Speed</span>
              <span className="font-mono font-medium text-stone-800 dark:text-stone-200">
                {speed.toFixed(2)}x
              </span>
            </div>
            <input
              type="range"
              id="speed-range-input"
              min="0.5"
              max="2.0"
              step="0.05"
              value={speed}
              onChange={(e) => onChangeSpeed(parseFloat(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-stone-200 rounded-lg dark:bg-stone-700"
            />
            <div className="flex justify-between text-[10px] text-stone-400 mt-1">
              <span>0.5x (Slow)</span>
              <span>1.0x (Normal)</span>
              <span>2.0x (Fast)</span>
            </div>
          </div>

          {/* Pitch slider */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-stone-600 dark:text-stone-400">Vocal Pitch</span>
              <span className="font-mono font-medium text-stone-800 dark:text-stone-200">
                {pitch > 0 ? `+${pitch}` : pitch === 0 ? 'Normal' : pitch}
              </span>
            </div>
            <input
              type="range"
              id="pitch-range-input"
              min="-5"
              max="5"
              step="1"
              value={pitch}
              onChange={(e) => onChangePitch(parseInt(e.target.value, 10))}
              className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-stone-200 rounded-lg dark:bg-stone-700"
            />
            <div className="flex justify-between text-[10px] text-stone-400 mt-1">
              <span>Lower</span>
              <span>Natural</span>
              <span>Higher</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
