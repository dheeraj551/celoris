import React from 'react';
import {
  Sparkles,
  CircleDot,
  Waves,
  Brush,
  Play,
  Pause,
  Volume2,
  VolumeX,
  RotateCcw,
  Camera,
  Maximize2,
  Minimize2,
  HelpCircle,
} from 'lucide-react';
import { ShowcaseMode, SimulationConfig } from '../types';

interface TopNavProps {
  config: SimulationConfig;
  onChangeConfig: (updater: (prev: SimulationConfig) => SimulationConfig) => void;
  onReset: () => void;
  onSnapshot: () => void;
  onToggleHelp: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

const MODES: { id: ShowcaseMode; label: string; icon: React.ReactNode; desc: string }[] = [
  {
    id: 'vortex',
    label: 'Cosmic Vortex',
    icon: <Sparkles size={16} />,
    desc: 'Interactive 5,000+ particle galaxy with gravity wells and shockwave bursts',
  },
  {
    id: 'physics',
    label: 'Kinetic Physics',
    icon: <CircleDot size={16} />,
    desc: 'Rigid body elastic collision simulation with squish deformation and momentum fling',
  },
  {
    id: 'creature',
    label: 'Cyber Serpent',
    icon: <Waves size={16} />,
    desc: 'Bioluminescent procedural creature with chained Inverse Kinematics and undulating fins',
  },
  {
    id: 'painter',
    label: 'Neon Painter',
    icon: <Brush size={16} />,
    desc: 'Additive glowing brush with real-time radial mandala symmetry and spark emission',
  },
];

export const TopNav: React.FC<TopNavProps> = ({
  config,
  onChangeConfig,
  onReset,
  onSnapshot,
  onToggleHelp,
  isFullscreen,
  onToggleFullscreen,
}) => {
  return (
    <header
      id="top-navigation"
      className="absolute top-4 left-1/2 -translate-x-1/2 z-20 pointer-events-auto select-none max-w-full px-4"
    >
      <div className="flex items-center space-x-2 bg-zinc-900/85 backdrop-blur-md border border-zinc-800/80 rounded-2xl shadow-2xl p-1.5 transition-all">
        {/* Mode Switcher Tabs */}
        <div className="flex items-center space-x-1 bg-zinc-950/60 p-1 rounded-xl border border-zinc-800/40">
          {MODES.map((mode) => {
            const isActive = config.mode === mode.id;
            return (
              <button
                key={mode.id}
                id={`mode-btn-${mode.id}`}
                onClick={() => onChangeConfig((prev) => ({ ...prev, mode: mode.id }))}
                title={mode.desc}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                }`}
              >
                <span>{mode.icon}</span>
                <span className="hidden sm:inline whitespace-nowrap">{mode.label}</span>
              </button>
            );
          })}
        </div>

        {/* Global Action Controls */}
        <div className="flex items-center space-x-1 pl-1 border-l border-zinc-800/60 text-zinc-300">
          {/* Play/Pause */}
          <button
            id="btn-play-pause"
            onClick={() => onChangeConfig((prev) => ({ ...prev, paused: !prev.paused }))}
            className={`p-2 rounded-xl transition ${
              config.paused
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'hover:bg-zinc-800/70 text-zinc-300'
            }`}
            title={config.paused ? 'Resume simulation (Space)' : 'Pause simulation (Space)'}
          >
            {config.paused ? <Play size={16} /> : <Pause size={16} />}
          </button>

          {/* Sound Toggle */}
          <button
            id="btn-audio-toggle"
            onClick={() => onChangeConfig((prev) => ({ ...prev, audioEnabled: !prev.audioEnabled }))}
            className={`p-2 rounded-xl transition ${
              config.audioEnabled
                ? 'text-indigo-400 hover:bg-zinc-800/70'
                : 'text-zinc-400 hover:bg-zinc-800/70'
            }`}
            title={config.audioEnabled ? 'Mute synthesized sound effects' : 'Enable synthesized sound effects'}
          >
            {config.audioEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>

          {/* Snapshot / Download */}
          <button
            id="btn-snapshot"
            onClick={onSnapshot}
            className="p-2 rounded-xl text-zinc-300 hover:text-white hover:bg-zinc-800/70 transition"
            title="Export high-res PNG snapshot"
          >
            <Camera size={16} />
          </button>

          {/* Reset */}
          <button
            id="btn-reset-mode"
            onClick={onReset}
            className="p-2 rounded-xl text-zinc-300 hover:text-white hover:bg-zinc-800/70 transition"
            title="Reset active simulation"
          >
            <RotateCcw size={16} />
          </button>

          {/* Fullscreen */}
          <button
            id="btn-fullscreen"
            onClick={onToggleFullscreen}
            className="p-2 rounded-xl text-zinc-300 hover:text-white hover:bg-zinc-800/70 transition hidden md:block"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>

          {/* Help Info */}
          <button
            id="btn-help-guide"
            onClick={onToggleHelp}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/70 transition"
            title="Interaction guide & shortcuts"
          >
            <HelpCircle size={16} />
          </button>
        </div>
      </div>
    </header>
  );
};
