import React from 'react';
import { History as HistoryIcon, RotateCcw, RotateCw, Trash2, Bookmark } from 'lucide-react';
import { HistoryStep } from '../types';

interface HistoryPanelProps {
  history: HistoryStep[];
  historyIndex: number;
  onJumpToHistory: (index: number) => void;
  onUndo: () => void;
  onRedo: () => void;
  onClearHistory: () => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  history,
  historyIndex,
  onJumpToHistory,
  onUndo,
  onRedo,
  onClearHistory,
}) => {
  return (
    <div id="history-panel" className="flex flex-col h-full bg-[#2b2b2b] text-xs text-gray-300 select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between p-2 border-b border-black bg-[#242424]">
        <span className="flex items-center gap-1.5 font-medium text-gray-300 text-[11px]">
          <HistoryIcon className="h-3 w-3 text-cyan-400" />
          History Actions
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={onUndo}
            disabled={historyIndex <= 0}
            title="Undo"
            className="p-1 rounded hover:bg-[#333333] text-gray-300 disabled:opacity-30 cursor-pointer"
          >
            <RotateCcw className="h-3 w-3" />
          </button>
          <button
            onClick={onRedo}
            disabled={historyIndex >= history.length - 1}
            title="Redo"
            className="p-1 rounded hover:bg-[#333333] text-gray-300 disabled:opacity-30 cursor-pointer"
          >
            <RotateCw className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* History Steps List */}
      <div className="flex-1 overflow-y-auto divide-y divide-black/40 p-1 space-y-0.5">
        {history.map((step, idx) => {
          const isCurrent = idx === historyIndex;
          const isUndone = idx > historyIndex;

          return (
            <div
              key={step.id}
              onClick={() => onJumpToHistory(idx)}
              className={`flex items-center gap-2 rounded px-2 py-1 cursor-pointer transition-colors ${
                isCurrent
                  ? 'bg-[#1a1a1a] text-cyan-400 font-medium border border-black shadow-inner'
                  : isUndone
                  ? 'text-gray-500 hover:bg-[#252525] opacity-50'
                  : 'text-gray-300 hover:bg-[#333333]'
              }`}
            >
              <Bookmark className={`h-3 w-3 shrink-0 ${isCurrent ? 'text-cyan-400' : 'text-gray-500'}`} />
              <div className="flex-1 min-w-0">
                <div className="truncate text-xs">{step.name}</div>
                <div className="text-[9px] text-gray-400 font-mono">
                  {step.canvasWidth}×{step.canvasHeight}px
                </div>
              </div>
              {isCurrent && (
                <span className="text-[9px] bg-cyan-950 border border-cyan-800 text-cyan-300 px-1 py-0.2 rounded">
                  current
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Clear history button */}
      <div className="flex items-center justify-between border-t border-black bg-[#1f1f1f] px-2.5 py-1 text-gray-400 text-[10px]">
        <span>States: {history.length}</span>
        <button
          onClick={onClearHistory}
          title="Clear previous history states to free memory"
          className="flex items-center gap-1 hover:text-white cursor-pointer"
        >
          <Trash2 className="h-2.5 w-2.5" /> Clear History
        </button>
      </div>
    </div>
  );
};
