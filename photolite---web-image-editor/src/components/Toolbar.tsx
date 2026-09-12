import React, { useRef } from 'react';
import {
  Move,
  RotateCw,
  Square,
  Lasso,
  Wand2,
  Crop,
  Pipette,
  Paintbrush,
  Eraser,
  PaintBucket,
  PenTool,
  Type,
  Shapes,
  Hand,
  ZoomIn,
  ArrowLeftRight,
  LayoutTemplate,
} from 'lucide-react';
import { ToolType } from '../types';

interface ToolbarProps {
  activeTool: ToolType;
  setActiveTool: (tool: ToolType) => void;
  foregroundColor: string;
  setForegroundColor: (color: string) => void;
  backgroundColor: string;
  setBackgroundColor: (color: string) => void;
  onOpenTemplates?: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  activeTool,
  setActiveTool,
  foregroundColor,
  setForegroundColor,
  backgroundColor,
  setBackgroundColor,
  onOpenTemplates,
}) => {
  const fgInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);

  const tools: { id: ToolType; name: string; icon: React.ComponentType<{ className?: string }>; hotkey: string }[] = [
    { id: 'select', name: 'Move / Transform Tool', icon: Move, hotkey: 'V' },
    { id: 'rotate', name: 'Rotate Layer Tool', icon: RotateCw, hotkey: 'R' },
    { id: 'marquee', name: 'Rectangular Marquee', icon: Square, hotkey: 'M' },
    { id: 'lasso', name: 'Lasso Selection Tool', icon: Lasso, hotkey: 'L' },
    { id: 'wand', name: 'Magic Wand Tool', icon: Wand2, hotkey: 'W' },
    { id: 'crop', name: 'Crop Tool', icon: Crop, hotkey: 'C' },
    { id: 'eyedropper', name: 'Eyedropper Color Picker', icon: Pipette, hotkey: 'I' },
    { id: 'brush', name: 'Paint Brush Tool', icon: Paintbrush, hotkey: 'B' },
    { id: 'eraser', name: 'Eraser Tool', icon: Eraser, hotkey: 'E' },
    { id: 'bucket', name: 'Paint Bucket Tool', icon: PaintBucket, hotkey: 'G' },
    { id: 'pen', name: 'Bézier Pen Tool', icon: PenTool, hotkey: 'P' },
    { id: 'text', name: 'Type / Text Tool', icon: Type, hotkey: 'T' },
    { id: 'shape', name: 'Shape Tool', icon: Shapes, hotkey: 'U' },
    { id: 'hand', name: 'Hand (Pan Canvas)', icon: Hand, hotkey: 'H' },
    { id: 'zoom', name: 'Zoom Tool', icon: ZoomIn, hotkey: 'Z' },
  ];

  const handleSwapColors = () => {
    const temp = foregroundColor;
    setForegroundColor(backgroundColor);
    setBackgroundColor(temp);
  };

  const handleResetColors = () => {
    setForegroundColor('#ffffff');
    setBackgroundColor('#000000');
  };

  return (
    <aside
      id="app-toolbar"
      className="flex w-10 flex-col items-center justify-between border-r border-black bg-[#2b2b2b] py-1.5 text-gray-300 select-none z-30 shrink-0"
    >
      {/* Templates Shortcut */}
      {onOpenTemplates && (
        <div className="flex flex-col items-center mb-1 pb-1 border-b border-black w-full px-1">
          <button
            id="toolbar-btn-templates"
            onClick={onOpenTemplates}
            title="Canva-Style Design Templates"
            className="group relative flex h-7 w-7 items-center justify-center rounded transition-colors cursor-pointer text-cyan-400 bg-[#222222] border border-cyan-500/30 hover:border-cyan-400 hover:bg-[#333333] hover:text-white"
          >
            <LayoutTemplate className="h-3.5 w-3.5" />
            <div className="pointer-events-none absolute left-full ml-2 hidden rounded bg-[#1a1a1a] px-2 py-0.5 text-[10px] font-medium text-gray-200 shadow-xl whitespace-nowrap z-50 group-hover:block border border-black">
              Templates <span className="text-cyan-400 font-mono">(Canva)</span>
            </div>
          </button>
        </div>
      )}

      {/* Tool buttons list */}
      <div className="flex flex-col items-center gap-0.5">
        {tools.map((tool) => {
          const Icon = tool.icon;
          const isActive = activeTool === tool.id;
          return (
            <button
              key={tool.id}
              id={`tool-btn-${tool.id}`}
              onClick={() => setActiveTool(tool.id)}
              title={`${tool.name} (${tool.hotkey})`}
              className={`group relative flex h-7 w-7 items-center justify-center rounded transition-colors cursor-pointer ${
                isActive
                  ? 'bg-[#1a1a1a] text-cyan-400 border border-black shadow-inner'
                  : 'text-gray-400 hover:bg-[#3c3c3c] hover:text-gray-200'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {/* Tooltip on hover */}
              <div className="pointer-events-none absolute left-full ml-2 hidden rounded bg-[#1a1a1a] px-2 py-0.5 text-[10px] font-medium text-gray-200 shadow-xl whitespace-nowrap z-50 group-hover:block border border-black">
                {tool.name} <span className="text-cyan-400 font-mono">({tool.hotkey})</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Color Palette (Foreground / Background swatches) */}
      <div className="relative mt-2 flex flex-col items-center pt-2 border-t border-black w-full">
        {/* Reset to Default D */}
        <button
          onClick={handleResetColors}
          title="Reset Colors to Default (D)"
          className="absolute -top-2 left-1.5 flex h-3 w-3 items-center justify-center rounded-xs border border-black bg-black p-0 hover:scale-110 cursor-pointer"
        >
          <div className="h-1.5 w-1.5 bg-white" />
        </button>

        {/* Swap colors X */}
        <button
          onClick={handleSwapColors}
          title="Swap Foreground and Background Colors (X)"
          className="absolute -top-2 right-1.5 text-gray-400 hover:text-white p-0.5 cursor-pointer"
        >
          <ArrowLeftRight className="h-2.5 w-2.5" />
        </button>

        {/* Color squares stack */}
        <div className="relative h-8 w-8 mt-1">
          {/* Background swatch */}
          <div
            onClick={() => bgInputRef.current?.click()}
            title="Background Color - Click to change"
            style={{ backgroundColor }}
            className="absolute bottom-0 right-0 h-5 w-5 cursor-pointer rounded-xs border border-black shadow-sm hover:scale-105 transition-transform"
          />
          <input
            ref={bgInputRef}
            type="color"
            value={backgroundColor}
            onChange={(e) => setBackgroundColor(e.target.value)}
            className="sr-only"
          />

          {/* Foreground swatch */}
          <div
            onClick={() => fgInputRef.current?.click()}
            title="Foreground Color - Click to change"
            style={{ backgroundColor: foregroundColor }}
            className="absolute top-0 left-0 h-5 w-5 cursor-pointer rounded-xs border border-black shadow-md hover:scale-105 transition-transform z-10"
          />
          <input
            ref={fgInputRef}
            type="color"
            value={foregroundColor}
            onChange={(e) => setForegroundColor(e.target.value)}
            className="sr-only"
          />
        </div>
      </div>
    </aside>
  );
};
