import React from 'react';
import { PenTool, RotateCcw, RotateCw, Trash2, ZoomIn, Sparkles, Layout, Monitor } from 'lucide-react';

interface StageToolbarProps {
  isAnnotationMode: boolean;
  onToggleAnnotation: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  selectedStudentName: string | null;
  onClearStudentSelection: () => void;
  isBoardMinimized?: boolean;
  onToggleBoardMinimize?: () => void;
}

export const StageToolbar: React.FC<StageToolbarProps> = ({
  isAnnotationMode,
  onToggleAnnotation,
  onUndo,
  onRedo,
  onClear,
  selectedStudentName,
  onClearStudentSelection,
  isBoardMinimized = false,
  onToggleBoardMinimize,
}) => {
  return (
    <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 z-30 flex items-center space-x-2 pointer-events-auto">
      {/* Main Pill Toolbar */}
      <div 
        id="classroom-stage-toolbar"
        className="flex items-center px-2 py-1.5 rounded-full bg-[#0d1424]/90 border border-slate-700/80 shadow-2xl backdrop-blur-md text-xs space-x-1"
      >
        {/* Toggle Board / 3D Full Room View */}
        {onToggleBoardMinimize && (
          <>
            <button
              onClick={onToggleBoardMinimize}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full transition-all ${
                isBoardMinimized
                  ? 'bg-emerald-600 text-white font-medium shadow-[0_0_12px_rgba(16,185,129,0.5)]'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
              title={isBoardMinimized ? 'Show Smart Board Overlay' : 'Full 3D Room View'}
            >
              <Layout className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isBoardMinimized ? 'Show Board' : 'Full 3D Room'}</span>
            </button>
            <div className="w-[1px] h-4 bg-slate-700 mx-1" />
          </>
        )}

        {/* Annotation Button */}
        <button
          id="btn-annotation-toggle"
          onClick={onToggleAnnotation}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full transition-all ${
            isAnnotationMode
              ? 'bg-blue-600 text-white font-medium shadow-[0_0_12px_rgba(37,99,235,0.6)]'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <PenTool className="w-3.5 h-3.5 text-blue-400" />
          <span>Annotation</span>
        </button>

        <div className="w-[1px] h-4 bg-slate-700 mx-1" />

        {/* Undo */}
        <button
          id="btn-stage-undo"
          onClick={onUndo}
          className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Undo stroke"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        {/* Redo */}
        <button
          id="btn-stage-redo"
          onClick={onRedo}
          className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Redo stroke"
        >
          <RotateCw className="w-3.5 h-3.5" />
        </button>

        {/* Clear */}
        <button
          id="btn-stage-clear"
          onClick={onClear}
          className="px-2.5 py-1.5 rounded-full text-slate-300 hover:text-red-400 hover:bg-red-950/40 transition-colors font-medium"
          title="Clear annotations"
        >
          <span>Clear</span>
        </button>
      </div>

      {/* Spotlight Desk Indicator if a student is selected */}
      {selectedStudentName && (
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-sky-950/90 border border-sky-500/50 text-xs text-sky-200 backdrop-blur-md shadow-lg animate-fade-in">
          <Sparkles className="w-3.5 h-3.5 text-sky-400" />
          <span>Spotlight on <strong>{selectedStudentName}</strong></span>
          <button
            onClick={onClearStudentSelection}
            className="ml-1 text-sky-400 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};
