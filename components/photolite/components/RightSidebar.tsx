import React, { useState } from 'react';
import { Layers as LayersIcon, History as HistoryIcon, Sliders } from 'lucide-react';
import { LayersPanel } from './LayersPanel';
import { HistoryPanel } from './HistoryPanel';
import { AdjustmentsPanel } from './AdjustmentsPanel';
import { Layer, HistoryStep, LayerFilter } from '../types';

interface RightSidebarProps {
  layers: Layer[];
  activeLayerId: string;
  setActiveLayerId: (id: string) => void;
  onUpdateLayer: (
    id: string,
    updates: Partial<Layer>,
    commitToHistory?: boolean,
    historyLabel?: string
  ) => void;
  onNewLayer: () => void;
  onDuplicateLayer: () => void;
  onDeleteLayer: () => void;
  onMoveLayerUp: () => void;
  onMoveLayerDown: () => void;
  onMergeDown: () => void;
  history: HistoryStep[];
  historyIndex: number;
  onJumpToHistory: (index: number) => void;
  onUndo: () => void;
  onRedo: () => void;
  onClearHistory: () => void;
  onUpdateFilters: (filters: LayerFilter) => void;
  onUpdateLayerCanvas?: (id: string, canvas: HTMLCanvasElement, commit: boolean, label?: string) => void;
  activeTab?: 'layers' | 'history' | 'adjustments';
  onTabChange?: (tab: 'layers' | 'history' | 'adjustments') => void;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  layers,
  activeLayerId,
  setActiveLayerId,
  onUpdateLayer,
  onNewLayer,
  onDuplicateLayer,
  onDeleteLayer,
  onMoveLayerUp,
  onMoveLayerDown,
  onMergeDown,
  history,
  historyIndex,
  onJumpToHistory,
  onUndo,
  onRedo,
  onClearHistory,
  onUpdateFilters,
  onUpdateLayerCanvas,
  activeTab: propActiveTab,
  onTabChange,
}) => {
  const [internalTab, setInternalTab] = useState<'layers' | 'history' | 'adjustments'>('layers');
  const activeTab = propActiveTab ?? internalTab;
  const handleSelectTab = (tab: 'layers' | 'history' | 'adjustments') => {
    setInternalTab(tab);
    onTabChange?.(tab);
  };
  const activeLayer = layers.find((l) => l.id === activeLayerId);

  return (
    <aside
      id="app-right-sidebar"
      className="pl-panel-anim flex w-64 flex-col border-l border-white/10 bg-[#2b2b2b] select-none z-30 shrink-0 h-full"
    >
      {/* Top Tabs */}
      <div className="flex border-b border-white/10 bg-[#1a1a1a] text-[11px]">
        <button
          id="tab-layers-btn"
          onClick={() => handleSelectTab('layers')}
          className={`flex flex-1 items-center justify-center gap-1.5 py-1.5 font-medium transition-all border-b-2 cursor-pointer active:scale-95 ${
            activeTab === 'layers'
              ? 'border-cyan-400 bg-[#2b2b2b] text-white'
              : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-[#242424]'
          }`}
        >
          <LayersIcon className="h-3 w-3" />
          <span>Layers</span>
          <span className="ml-0.5 text-[10px] text-gray-500 font-mono">({layers.length})</span>
        </button>

        <button
          id="tab-history-btn"
          onClick={() => handleSelectTab('history')}
          className={`flex flex-1 items-center justify-center gap-1.5 py-1.5 font-medium transition-all border-b-2 cursor-pointer active:scale-95 ${
            activeTab === 'history'
              ? 'border-cyan-400 bg-[#2b2b2b] text-white'
              : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-[#242424]'
          }`}
        >
          <HistoryIcon className="h-3 w-3" />
          <span>History</span>
        </button>

        <button
          id="tab-adjustments-btn"
          onClick={() => handleSelectTab('adjustments')}
          className={`flex flex-1 items-center justify-center gap-1.5 py-1.5 font-medium transition-all border-b-2 cursor-pointer active:scale-95 ${
            activeTab === 'adjustments'
              ? 'border-cyan-400 bg-[#2b2b2b] text-white'
              : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-[#242424]'
          }`}
        >
          <Sliders className="h-3 w-3" />
          <span>Adjust</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'layers' && (
          <LayersPanel
            layers={layers}
            activeLayerId={activeLayerId}
            setActiveLayerId={setActiveLayerId}
            onUpdateLayer={onUpdateLayer}
            onNewLayer={onNewLayer}
            onDuplicateLayer={onDuplicateLayer}
            onDeleteLayer={onDeleteLayer}
            onMoveLayerUp={onMoveLayerUp}
            onMoveLayerDown={onMoveLayerDown}
            onMergeDown={onMergeDown}
          />
        )}

        {activeTab === 'history' && (
          <HistoryPanel
            history={history}
            historyIndex={historyIndex}
            onJumpToHistory={onJumpToHistory}
            onUndo={onUndo}
            onRedo={onRedo}
            onClearHistory={onClearHistory}
          />
        )}

        {activeTab === 'adjustments' && (
          <AdjustmentsPanel
            activeLayer={activeLayer}
            onUpdateFilters={onUpdateFilters}
            onUpdateLayerCanvas={(canvas, commit, label) => {
              if (activeLayer) {
                onUpdateLayerCanvas?.(activeLayer.id, canvas, commit, label);
              }
            }}
          />
        )}
      </div>
    </aside>
  );
};
