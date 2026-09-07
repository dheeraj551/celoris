import React, { useState } from 'react';
import { Activity, Zap, Layers, ChevronDown, ChevronUp } from 'lucide-react';
import { PerformanceStats } from '../types';

interface StatsHUDProps {
  stats: PerformanceStats;
}

export const StatsHUD: React.FC<StatsHUDProps> = ({ stats }) => {
  const [minimized, setMinimized] = useState<boolean>(false);

  const getFpsColor = (fps: number) => {
    if (fps >= 55) return 'text-emerald-400';
    if (fps >= 30) return 'text-amber-400';
    return 'text-rose-400';
  };

  return (
    <div
      id="stats-hud"
      className="absolute top-4 left-4 z-20 pointer-events-auto select-none"
    >
      <div className="bg-zinc-900/85 backdrop-blur-md border border-zinc-800/80 rounded-xl shadow-2xl p-2.5 text-xs font-mono text-zinc-300 min-w-[200px] transition-all duration-200">
        <div className="flex items-center justify-between pb-1.5 border-b border-zinc-800/60">
          <div className="flex items-center space-x-1.5 text-zinc-100 font-sans font-semibold text-xs tracking-wide">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <span>PixiJS Engine</span>
            <span className="text-[10px] text-indigo-400 bg-indigo-950/70 border border-indigo-800/60 px-1 py-0.2 rounded">
              v8.20
            </span>
          </div>
          <button
            id="toggle-stats-btn"
            onClick={() => setMinimized(!minimized)}
            className="text-zinc-400 hover:text-zinc-200 p-0.5 rounded hover:bg-zinc-800/60 transition"
            title={minimized ? 'Expand stats' : 'Collapse stats'}
          >
            {minimized ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </button>
        </div>

        {!minimized && (
          <div className="mt-2 space-y-1.5 pt-0.5">
            <div className="flex items-center justify-between">
              <span className="flex items-center space-x-1.5 text-zinc-400">
                <Activity size={13} className="text-zinc-400" />
                <span>Framerate</span>
              </span>
              <span className={`font-bold ${getFpsColor(stats.fps)}`}>
                {stats.fps} <span className="text-[10px] font-normal text-zinc-400">FPS</span>
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center space-x-1.5 text-zinc-400">
                <Layers size={13} className="text-zinc-400" />
                <span>Active Sprites</span>
              </span>
              <span className="font-semibold text-indigo-300">
                {stats.particleCount.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center space-x-1.5 text-zinc-400">
                <Zap size={13} className="text-zinc-400" />
                <span>Draw Compute</span>
              </span>
              <span className="text-zinc-300">
                {stats.drawTimeMs} <span className="text-[10px] text-zinc-400">ms</span>
              </span>
            </div>

            <div className="pt-1.5 border-t border-zinc-800/50 flex items-center justify-between text-[11px] text-zinc-400">
              <span>Renderer:</span>
              <span className="text-zinc-300 font-sans">{stats.rendererType}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
