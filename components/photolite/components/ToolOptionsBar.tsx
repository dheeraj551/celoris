import React from 'react';
import {
  Crop,
  Check,
  X,
  Sliders,
  Sparkles,
  Scissors,
  Bold,
  Italic,
  Square,
  Circle,
  Minus,
  Maximize2,
  RotateCw,
  RotateCcw
} from 'lucide-react';
import { ToolType, SelectionState, PenPath, Layer } from '../types';

interface ToolOptionsBarProps {
  activeTool: ToolType;
  brushSize: number;
  setBrushSize: (size: number) => void;
  brushOpacity: number;
  setBrushOpacity: (opacity: number) => void;
  brushHardness: number;
  setBrushHardness: (hardness: number) => void;
  wandTolerance: number;
  setWandTolerance: (val: number) => void;
  selection: SelectionState;
  onDeselect: () => void;
  onInvertSelection: () => void;
  onClearSelection: () => void;
  onFillSelection: () => void;
  // Pen options
  penPath: PenPath;
  penStrokeWidth: number;
  setPenStrokeWidth: (w: number) => void;
  onPenStroke: () => void;
  onPenFill: () => void;
  onPenMakeSelection: () => void;
  onPenClear: () => void;
  // Crop options
  cropAspectRatio: number | null;
  setCropAspectRatio: (ratio: number | null) => void;
  onApplyCrop: () => void;
  onCancelCrop: () => void;
  // Shape options
  shapeType: 'rect' | 'circle' | 'line';
  setShapeType: (t: 'rect' | 'circle' | 'line') => void;
  shapeStrokeWidth: number;
  setShapeStrokeWidth: (w: number) => void;
  // Text options
  textString: string;
  setTextString: (s: string) => void;
  textFontSize: number;
  setTextFontSize: (s: number) => void;
  textBold: boolean;
  setTextBold: (b: boolean) => void;
  textItalic: boolean;
  setTextItalic: (i: boolean) => void;
  onApplyText: () => void;
  // Active layer & Rotation options
  activeLayer?: Layer | null;
  onUpdateLayerAngle?: (angle: number, commit?: boolean) => void;
}

export const ToolOptionsBar: React.FC<ToolOptionsBarProps> = ({
  activeTool,
  brushSize,
  setBrushSize,
  brushOpacity,
  setBrushOpacity,
  brushHardness,
  setBrushHardness,
  wandTolerance,
  setWandTolerance,
  selection,
  onDeselect,
  onInvertSelection,
  onClearSelection,
  onFillSelection,
  penPath,
  penStrokeWidth,
  setPenStrokeWidth,
  onPenStroke,
  onPenFill,
  onPenMakeSelection,
  onPenClear,
  cropAspectRatio,
  setCropAspectRatio,
  onApplyCrop,
  onCancelCrop,
  shapeType,
  setShapeType,
  shapeStrokeWidth,
  setShapeStrokeWidth,
  textString,
  setTextString,
  textFontSize,
  setTextFontSize,
  textBold,
  setTextBold,
  textItalic,
  setTextItalic,
  onApplyText,
  activeLayer,
  onUpdateLayerAngle,
}) => {
  return (
    <div
      id="tool-options-bar"
      className="flex h-8 w-full flex-wrap items-center gap-2.5 border-b border-black bg-[#2b2b2b] px-3 py-0.5 text-[11px] text-gray-300 select-none z-20 shrink-0 overflow-x-auto"
    >
      {/* Current Tool Indicator */}
      <div className="flex items-center gap-1.5 font-medium text-gray-400 pr-2 border-r border-black">
        <span className="capitalize text-cyan-400 font-semibold">{activeTool}</span> Tool
      </div>

      {/* Brush / Eraser options */}
      {(activeTool === 'brush' || activeTool === 'eraser') && (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-gray-400">Size:</span>
            <input
              type="range"
              min="1"
              max="200"
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="h-1 w-20 cursor-pointer accent-blue-500"
            />
            <span className="w-7 font-mono text-[10px] text-gray-300">{brushSize}px</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-gray-400">Opacity:</span>
            <input
              type="range"
              min="5"
              max="100"
              value={Math.round(brushOpacity * 100)}
              onChange={(e) => setBrushOpacity(Number(e.target.value) / 100)}
              className="h-1 w-16 cursor-pointer accent-blue-500"
            />
            <span className="w-7 font-mono text-[10px] text-gray-300">{Math.round(brushOpacity * 100)}%</span>
          </div>

          {activeTool === 'brush' && (
            <div className="flex items-center gap-1.5">
              <span className="text-gray-400">Hardness:</span>
              <input
                type="range"
                min="0"
                max="100"
                value={Math.round(brushHardness * 100)}
                onChange={(e) => setBrushHardness(Number(e.target.value) / 100)}
                className="h-1 w-16 cursor-pointer accent-blue-500"
              />
              <span className="w-7 font-mono text-[10px] text-gray-300">{Math.round(brushHardness * 100)}%</span>
            </div>
          )}
        </div>
      )}

      {/* Magic Wand & Bucket options */}
      {(activeTool === 'wand' || activeTool === 'bucket') && (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-gray-400">Tolerance:</span>
            <input
              type="range"
              min="1"
              max="100"
              value={wandTolerance}
              onChange={(e) => setWandTolerance(Number(e.target.value))}
              className="h-1 w-20 cursor-pointer accent-blue-500"
            />
            <span className="w-5 font-mono text-[10px] text-gray-300">{wandTolerance}</span>
          </div>
          {activeTool === 'wand' && (
            <span className="text-gray-400 text-[10px]">
              Click canvas to flood-select matching pixels.
            </span>
          )}
        </div>
      )}

      {/* Selection operations bar when selection is active or in lasso/marquee/wand */}
      {(selection.active || activeTool === 'lasso' || activeTool === 'marquee' || activeTool === 'wand') && (
        <div className="flex items-center gap-1.5 pl-2 border-l border-black">
          {selection.active && (
            <>
              <button
                onClick={onClearSelection}
                className="flex items-center gap-1 rounded bg-[#1a1a1a] hover:bg-red-900/60 border border-black px-2 py-0.5 text-red-300 text-[10px] cursor-pointer"
                title="Delete pixels inside selection"
              >
                <Scissors className="h-2.5 w-2.5" /> Cut / Delete
              </button>
              <button
                onClick={onFillSelection}
                className="flex items-center gap-1 rounded bg-[#1a1a1a] hover:bg-blue-600 border border-black px-2 py-0.5 text-cyan-300 hover:text-white text-[10px] cursor-pointer"
                title="Fill selected pixels with Foreground color"
              >
                <Sparkles className="h-2.5 w-2.5" /> Fill
              </button>
              <button
                onClick={onInvertSelection}
                className="rounded bg-[#1a1a1a] hover:bg-[#3c3c3c] border border-black px-2 py-0.5 text-gray-300 text-[10px] cursor-pointer"
              >
                Invert
              </button>
              <button
                onClick={onDeselect}
                className="rounded bg-[#1a1a1a] hover:bg-[#3c3c3c] border border-black px-2 py-0.5 text-gray-300 text-[10px] cursor-pointer"
              >
                Deselect (Ctrl+D)
              </button>
            </>
          )}
          {!selection.active && activeTool === 'lasso' && (
            <span className="text-gray-400 text-[10px]">
              Drag with mouse to outline freehand selection.
            </span>
          )}
        </div>
      )}

      {/* Pen Tool options */}
      {activeTool === 'pen' && (
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5">
            <span className="text-gray-400">Stroke:</span>
            <input
              type="range"
              min="1"
              max="40"
              value={penStrokeWidth}
              onChange={(e) => setPenStrokeWidth(Number(e.target.value))}
              className="h-1 w-16 cursor-pointer accent-blue-500"
            />
            <span className="w-7 font-mono text-[10px] text-gray-300">{penStrokeWidth}px</span>
          </div>

          <div className="flex items-center gap-1 pl-2 border-l border-black">
            <button
              onClick={onPenStroke}
              disabled={penPath.points.length < 2}
              className="rounded bg-[#1a1a1a] hover:bg-[#3c3c3c] border border-black hover:text-white disabled:opacity-40 px-2 py-0.5 text-gray-300 text-[10px] cursor-pointer"
            >
              Stroke Path
            </button>
            <button
              onClick={onPenFill}
              disabled={penPath.points.length < 3}
              className="rounded bg-[#1a1a1a] hover:bg-[#3c3c3c] border border-black hover:text-white disabled:opacity-40 px-2 py-0.5 text-gray-300 text-[10px] cursor-pointer"
            >
              Fill Path
            </button>
            <button
              onClick={onPenMakeSelection}
              disabled={penPath.points.length < 3}
              className="rounded bg-[#1a1a1a] hover:bg-blue-600 border border-black hover:text-white disabled:opacity-40 px-2 py-0.5 text-cyan-300 text-[10px] cursor-pointer"
            >
              Make Selection
            </button>
            <button
              onClick={onPenClear}
              disabled={penPath.points.length === 0}
              className="rounded bg-[#1a1a1a] hover:bg-red-800 border border-black disabled:opacity-40 px-2 py-0.5 text-red-300 text-[10px] cursor-pointer"
            >
              Clear
            </button>
          </div>

          <span className="text-gray-500 text-[10px]">
            Points: {penPath.points.length} {penPath.closed ? '(Closed)' : ''}
          </span>
        </div>
      )}

      {/* Crop Tool options */}
      {activeTool === 'crop' && (
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5">
            <span className="text-gray-400">Aspect:</span>
            <select
              value={cropAspectRatio === null ? 'free' : cropAspectRatio.toString()}
              onChange={(e) => {
                const v = e.target.value;
                if (v === 'free') setCropAspectRatio(null);
                else setCropAspectRatio(Number(v));
              }}
              className="rounded bg-[#1a1a1a] border border-black px-1.5 py-0.5 text-[11px] text-gray-200 focus:outline-none cursor-pointer"
            >
              <option value="free">Free Aspect</option>
              <option value="1">1 : 1 (Square)</option>
              <option value={(16 / 9).toString()}>16 : 9 (Widescreen)</option>
              <option value={(4 / 3).toString()}>4 : 3 (Standard)</option>
              <option value={(3 / 2).toString()}>3 : 2 (Photo)</option>
              <option value={(9 / 16).toString()}>9 : 16 (Story/Reel)</option>
            </select>
          </div>

          <button
            onClick={onApplyCrop}
            className="flex items-center gap-1 rounded bg-emerald-600 hover:bg-emerald-500 px-2.5 py-0.5 font-medium text-white shadow-sm border border-black text-[10px] cursor-pointer"
          >
            <Check className="h-3 w-3" /> Apply Crop
          </button>
          <button
            onClick={onCancelCrop}
            className="flex items-center gap-1 rounded bg-[#1a1a1a] hover:bg-[#3c3c3c] px-2.5 py-0.5 text-gray-300 border border-black text-[10px] cursor-pointer"
          >
            <X className="h-3 w-3" /> Cancel
          </button>
        </div>
      )}

      {/* Shape Tool options */}
      {activeTool === 'shape' && (
        <div className="flex items-center gap-2.5">
          <div className="flex items-center rounded bg-[#1a1a1a] p-0.5 border border-black">
            <button
              onClick={() => setShapeType('rect')}
              className={`p-1 rounded cursor-pointer ${shapeType === 'rect' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
              title="Rectangle"
            >
              <Square className="h-3 w-3" />
            </button>
            <button
              onClick={() => setShapeType('circle')}
              className={`p-1 rounded cursor-pointer ${shapeType === 'circle' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
              title="Circle / Ellipse"
            >
              <Circle className="h-3 w-3" />
            </button>
            <button
              onClick={() => setShapeType('line')}
              className={`p-1 rounded cursor-pointer ${shapeType === 'line' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
              title="Line"
            >
              <Minus className="h-3 w-3" />
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-gray-400">Stroke:</span>
            <input
              type="range"
              min="1"
              max="30"
              value={shapeStrokeWidth}
              onChange={(e) => setShapeStrokeWidth(Number(e.target.value))}
              className="h-1 w-16 cursor-pointer accent-blue-500"
            />
            <span className="w-7 font-mono text-[10px] text-gray-300">{shapeStrokeWidth}px</span>
          </div>

          <span className="text-gray-400 text-[10px]">
            Drag to draw shape with current foreground color.
          </span>
        </div>
      )}

      {/* Text Tool options */}
      {activeTool === 'text' && (
        <div className="flex items-center gap-2 flex-wrap">
          <input
            type="text"
            placeholder="Type text to place..."
            value={textString}
            onChange={(e) => setTextString(e.target.value)}
            className="rounded bg-[#1a1a1a] border border-black px-2 py-0.5 text-[11px] text-gray-200 focus:border-blue-500 focus:outline-none w-44"
          />

          <div className="flex items-center gap-1.5">
            <span className="text-gray-400">Size:</span>
            <input
              type="range"
              min="12"
              max="120"
              value={textFontSize}
              onChange={(e) => setTextFontSize(Number(e.target.value))}
              className="h-1 w-16 cursor-pointer accent-blue-500"
            />
            <span className="w-7 font-mono text-[10px] text-gray-300">{textFontSize}px</span>
          </div>

          <div className="flex items-center rounded bg-[#1a1a1a] p-0.5 border border-black">
            <button
              onClick={() => setTextBold(!textBold)}
              className={`p-1 rounded cursor-pointer ${textBold ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
              title="Bold"
            >
              <Bold className="h-2.5 w-2.5" />
            </button>
            <button
              onClick={() => setTextItalic(!textItalic)}
              className={`p-1 rounded cursor-pointer ${textItalic ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}
              title="Italic"
            >
              <Italic className="h-2.5 w-2.5" />
            </button>
          </div>

          <button
            onClick={onApplyText}
            className="rounded bg-blue-600 hover:bg-blue-500 px-2.5 py-0.5 font-medium text-white shadow-sm text-[10px] border border-black cursor-pointer"
          >
            Add Text Layer
          </button>
        </div>
      )}

      {/* Move & Rotate Tool options */}
      {(activeTool === 'select' || activeTool === 'rotate') && (
        <div className="flex items-center gap-2.5 flex-wrap">
          {activeLayer ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <RotateCw className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                <label
                  htmlFor="select-tool-rotate-input"
                  className="text-gray-300 font-medium whitespace-nowrap cursor-pointer text-[11px]"
                >
                  Rotate:
                </label>
                <div className="relative flex items-center">
                  <input
                    id="select-tool-rotate-input"
                    type="number"
                    min="-360"
                    max="360"
                    step="1"
                    disabled={activeLayer.locked}
                    value={activeLayer.angle !== undefined ? Math.round(activeLayer.angle) : 0}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      if (!isNaN(val) && onUpdateLayerAngle) {
                        onUpdateLayerAngle(val, false);
                      }
                    }}
                    onBlur={(e) => {
                      const val = parseFloat(e.target.value);
                      if (!isNaN(val) && onUpdateLayerAngle) {
                        onUpdateLayerAngle(val, true);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const val = parseFloat((e.target as HTMLInputElement).value);
                        if (!isNaN(val) && onUpdateLayerAngle) {
                          onUpdateLayerAngle(val, true);
                        }
                        (e.target as HTMLInputElement).blur();
                      }
                    }}
                    className="w-16 rounded bg-[#1a1a1a] border border-black px-1.5 py-0.5 pr-4 text-[11px] text-gray-200 text-right focus:border-cyan-500 focus:outline-none disabled:opacity-50 font-mono"
                    title="Rotate angle in degrees (-360° to 360°)"
                  />
                  <span className="absolute right-1 text-gray-400 text-[10px] pointer-events-none select-none">°</span>
                </div>
              </div>

              {/* Angle slider for smooth interactive scrubbing */}
              <div className="flex items-center gap-1">
                <input
                  type="range"
                  min="-180"
                  max="180"
                  step="1"
                  disabled={activeLayer.locked}
                  value={activeLayer.angle || 0}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (onUpdateLayerAngle) onUpdateLayerAngle(val, false);
                  }}
                  onMouseUp={(e) => {
                    const val = Number((e.target as HTMLInputElement).value);
                    if (onUpdateLayerAngle) onUpdateLayerAngle(val, true);
                  }}
                  onTouchEnd={(e) => {
                    const val = Number((e.target as HTMLInputElement).value);
                    if (onUpdateLayerAngle) onUpdateLayerAngle(val, true);
                  }}
                  className="h-1 w-16 cursor-pointer accent-cyan-500 disabled:opacity-50"
                  title="Rotate Angle Slider (-180° to 180°)"
                />
              </div>

              {/* Quick rotation buttons */}
              <div className="flex items-center gap-1 border-l border-neutral-700 pl-1.5">
                <button
                  type="button"
                  id="rotate-ccw-btn"
                  title="Rotate -90° (Counter-Clockwise)"
                  disabled={activeLayer.locked}
                  onClick={() => {
                    if (onUpdateLayerAngle) {
                      const cur = activeLayer.angle || 0;
                      const next = cur - 90;
                      onUpdateLayerAngle(next, true);
                    }
                  }}
                  className="p-1 rounded bg-[#202020] hover:bg-[#303030] border border-black text-gray-300 hover:text-white disabled:opacity-40 cursor-pointer"
                >
                  <RotateCcw className="h-2.5 w-2.5" />
                </button>
                <button
                  type="button"
                  id="rotate-cw-btn"
                  title="Rotate +90° (Clockwise)"
                  disabled={activeLayer.locked}
                  onClick={() => {
                    if (onUpdateLayerAngle) {
                      const cur = activeLayer.angle || 0;
                      const next = cur + 90;
                      onUpdateLayerAngle(next, true);
                    }
                  }}
                  className="p-1 rounded bg-[#202020] hover:bg-[#303030] border border-black text-gray-300 hover:text-white disabled:opacity-40 cursor-pointer"
                >
                  <RotateCw className="h-2.5 w-2.5" />
                </button>
                <button
                  type="button"
                  id="rotate-reset-btn"
                  title="Reset Angle to 0°"
                  disabled={activeLayer.locked || !activeLayer.angle}
                  onClick={() => {
                    if (onUpdateLayerAngle) {
                      onUpdateLayerAngle(0, true);
                    }
                  }}
                  className="px-1.5 py-0.5 rounded bg-[#202020] hover:bg-[#303030] border border-black text-[10px] text-gray-300 hover:text-white disabled:opacity-40 cursor-pointer font-mono"
                >
                  0°
                </button>
              </div>

              {activeLayer.locked && (
                <span className="text-amber-400 text-[10px] italic">Layer locked</span>
              )}
            </div>
          ) : (
            <span className="text-gray-400 text-[10px]">No active layer selected</span>
          )}

          <div className="h-3 w-[1px] bg-neutral-700 mx-1 hidden sm:block" />

          <div className="flex items-center gap-2 text-gray-400 text-[10px]">
            <span>
              {activeTool === 'rotate'
                ? 'Drag anywhere to freely rotate around center. Hold Shift to snap 15°.'
                : 'Drag layer to position, top handle to rotate. Arrow keys nudge 1px.'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
