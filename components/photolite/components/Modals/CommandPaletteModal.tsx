import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Search,
  Sliders,
  Layers,
  Sparkles,
  Download,
  Maximize2,
  Crop,
  RotateCw,
  RotateCcw,
  Palette,
  Type,
  Shapes,
  Paintbrush,
  Eraser,
  PaintBucket,
  PenTool,
  Wand2,
  MousePointer,
  ZoomIn,
  ZoomOut,
  Maximize,
  Undo2,
  Redo2,
  FilePlus,
  X,
  Keyboard,
} from 'lucide-react';
import { ToolType } from '../../types';

export interface CommandItem {
  id: string;
  title: string;
  category: 'Tools' | 'Layer' | 'Adjustments' | 'Canvas & Export' | 'View';
  shortcut?: string;
  keywords?: string[];
  icon: React.ReactNode;
  action: () => void;
}

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Commands wiring
  onSelectTool: (tool: ToolType) => void;
  onOpenLayerStyles: () => void;
  onNewLayer: () => void;
  onDuplicateLayer: () => void;
  onDeleteLayer: () => void;
  onMergeDown: () => void;
  onRotateCW?: () => void;
  onRotateCCW?: () => void;
  onResetRotation?: () => void;
  onOpenNewCanvas: () => void;
  onOpenResizeCanvas: () => void;
  onOpenResizeImage: () => void;
  onOpenExport: () => void;
  onOpenAIModal: () => void;
  onOpenTemplates: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onInvertColors: () => void;
  onAutoEnhance: () => void;
  onSelectAll: () => void;
  onDeselect: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitScreen: () => void;
  onZoom100: () => void;
  onSwitchToAdjustmentsTab?: () => void;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
  onSelectTool,
  onOpenLayerStyles,
  onNewLayer,
  onDuplicateLayer,
  onDeleteLayer,
  onMergeDown,
  onRotateCW,
  onRotateCCW,
  onResetRotation,
  onOpenNewCanvas,
  onOpenResizeCanvas,
  onOpenResizeImage,
  onOpenExport,
  onOpenAIModal,
  onOpenTemplates,
  onUndo,
  onRedo,
  onInvertColors,
  onAutoEnhance,
  onSelectAll,
  onDeselect,
  onZoomIn,
  onZoomOut,
  onFitScreen,
  onZoom100,
  onSwitchToAdjustmentsTab,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Focus on input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Registry of all available commands
  const commands = useMemo<CommandItem[]>(() => {
    return [
      // TOOLS
      {
        id: 'tool-select',
        title: 'Move / Selection Tool',
        category: 'Tools',
        shortcut: 'V',
        keywords: ['pointer', 'cursor', 'drag', 'transform'],
        icon: <MousePointer className="h-4 w-4 text-cyan-400" />,
        action: () => onSelectTool('select'),
      },
      {
        id: 'tool-brush',
        title: 'Paintbrush Tool',
        category: 'Tools',
        shortcut: 'B',
        keywords: ['draw', 'stroke', 'paint', 'freehand'],
        icon: <Paintbrush className="h-4 w-4 text-blue-400" />,
        action: () => onSelectTool('brush'),
      },
      {
        id: 'tool-eraser',
        title: 'Eraser Tool',
        category: 'Tools',
        shortcut: 'E',
        keywords: ['delete', 'clear', 'rub', 'alpha'],
        icon: <Eraser className="h-4 w-4 text-rose-400" />,
        action: () => onSelectTool('eraser'),
      },
      {
        id: 'tool-bucket',
        title: 'Paint Bucket Tool (Flood Fill)',
        category: 'Tools',
        shortcut: 'G',
        keywords: ['fill', 'color', 'background', 'flood'],
        icon: <PaintBucket className="h-4 w-4 text-amber-400" />,
        action: () => onSelectTool('bucket'),
      },
      {
        id: 'tool-text',
        title: 'Horizontal Type Tool (Text)',
        category: 'Tools',
        shortcut: 'T',
        keywords: ['font', 'title', 'heading', 'write'],
        icon: <Type className="h-4 w-4 text-sky-400" />,
        action: () => onSelectTool('text'),
      },
      {
        id: 'tool-shapes',
        title: 'Vector Shapes Tool',
        category: 'Tools',
        shortcut: 'U',
        keywords: ['rectangle', 'circle', 'triangle', 'star', 'arrow'],
        icon: <Shapes className="h-4 w-4 text-emerald-400" />,
        action: () => onSelectTool('shape'),
      },
      {
        id: 'tool-pen',
        title: 'Bézier Pen Vector Tool',
        category: 'Tools',
        shortcut: 'P',
        keywords: ['path', 'curve', 'vector', 'anchor'],
        icon: <PenTool className="h-4 w-4 text-purple-400" />,
        action: () => onSelectTool('pen'),
      },
      {
        id: 'tool-wand',
        title: 'Magic Wand Selection',
        category: 'Tools',
        shortcut: 'W',
        keywords: ['magic', 'auto', 'contiguous', 'color select'],
        icon: <Wand2 className="h-4 w-4 text-violet-400" />,
        action: () => onSelectTool('wand'),
      },
      {
        id: 'tool-lasso',
        title: 'Freehand Lasso Selection',
        category: 'Tools',
        shortcut: 'L',
        keywords: ['polygon', 'cutout', 'marquee'],
        icon: <Wand2 className="h-4 w-4 text-indigo-400" />,
        action: () => onSelectTool('lasso'),
      },
      {
        id: 'tool-crop',
        title: 'Crop Canvas Tool',
        category: 'Tools',
        shortcut: 'C',
        keywords: ['trim', 'aspect ratio', 'resize'],
        icon: <Crop className="h-4 w-4 text-orange-400" />,
        action: () => onSelectTool('crop'),
      },

      // LAYER
      {
        id: 'layer-styles',
        title: 'Layer Styles (Drop Shadow, Stroke, Outer Glow, Color Overlay)',
        category: 'Layer',
        shortcut: 'fx',
        keywords: ['shadow', 'outline', 'glow', 'effects', 'blending', 'elevation', 'stroke'],
        icon: <span className="font-serif font-bold italic text-cyan-400 text-sm">fx</span>,
        action: onOpenLayerStyles,
      },
      {
        id: 'layer-new',
        title: 'New Transparent Layer',
        category: 'Layer',
        shortcut: 'Ctrl+Shift+N',
        keywords: ['create layer', 'blank', 'add layer'],
        icon: <Layers className="h-4 w-4 text-cyan-400" />,
        action: onNewLayer,
      },
      {
        id: 'layer-duplicate',
        title: 'Duplicate Current Layer',
        category: 'Layer',
        shortcut: 'Ctrl+J',
        keywords: ['copy layer', 'clone', 'replicate'],
        icon: <Layers className="h-4 w-4 text-blue-400" />,
        action: onDuplicateLayer,
      },
      {
        id: 'layer-merge-down',
        title: 'Merge Layer Down',
        category: 'Layer',
        shortcut: 'Ctrl+E',
        keywords: ['flatten', 'combine', 'join'],
        icon: <Layers className="h-4 w-4 text-amber-400" />,
        action: onMergeDown,
      },
      {
        id: 'layer-delete',
        title: 'Delete Current Layer',
        category: 'Layer',
        shortcut: 'Delete',
        keywords: ['trash', 'remove'],
        icon: <Layers className="h-4 w-4 text-rose-400" />,
        action: onDeleteLayer,
      },
      {
        id: 'layer-rotate-cw',
        title: 'Rotate Layer 90° Clockwise',
        category: 'Layer',
        keywords: ['turn', 'right', 'orientation'],
        icon: <RotateCw className="h-4 w-4 text-cyan-400" />,
        action: () => onRotateCW?.(),
      },
      {
        id: 'layer-rotate-ccw',
        title: 'Rotate Layer 90° Counter-Clockwise',
        category: 'Layer',
        keywords: ['turn', 'left', 'orientation'],
        icon: <RotateCcw className="h-4 w-4 text-cyan-400" />,
        action: () => onRotateCCW?.(),
      },
      {
        id: 'layer-reset-rot',
        title: 'Reset Layer Rotation (0°)',
        category: 'Layer',
        keywords: ['straighten', 'level', 'zero'],
        icon: <RotateCcw className="h-4 w-4 text-gray-400" />,
        action: () => onResetRotation?.(),
      },

      // ADJUSTMENTS
      {
        id: 'adj-panel',
        title: 'Open Adjustments Panel (Brightness, Contrast, Saturation)',
        category: 'Adjustments',
        keywords: ['exposure', 'tone', 'color grading', 'filters'],
        icon: <Sliders className="h-4 w-4 text-cyan-400" />,
        action: () => onSwitchToAdjustmentsTab?.(),
      },
      {
        id: 'adj-invert',
        title: 'Invert Layer Colors',
        category: 'Adjustments',
        shortcut: 'Ctrl+I',
        keywords: ['negative', 'reverse'],
        icon: <Palette className="h-4 w-4 text-pink-400" />,
        action: onInvertColors,
      },
      {
        id: 'adj-auto-enhance',
        title: 'Auto-Enhance / Reset Color Balance',
        category: 'Adjustments',
        keywords: ['fix', 'auto color', 'balance'],
        icon: <Sparkles className="h-4 w-4 text-amber-400" />,
        action: onAutoEnhance,
      },

      // CANVAS & EXPORT
      {
        id: 'doc-export',
        title: 'Export Image As (PNG, JPEG, WebP)',
        category: 'Canvas & Export',
        shortcut: 'Ctrl+Shift+E',
        keywords: ['save', 'download', 'render', 'file'],
        icon: <Download className="h-4 w-4 text-blue-400" />,
        action: onOpenExport,
      },
      {
        id: 'doc-new',
        title: 'New Canvas Document',
        category: 'Canvas & Export',
        shortcut: 'Ctrl+N',
        keywords: ['blank', 'start', 'dimensions', 'resolution'],
        icon: <FilePlus className="h-4 w-4 text-emerald-400" />,
        action: onOpenNewCanvas,
      },
      {
        id: 'doc-resize-canvas',
        title: 'Canvas Size (Expand / Crop with Anchors)',
        category: 'Canvas & Export',
        shortcut: 'Alt+Ctrl+C',
        keywords: ['bounds', 'padding', 'anchor', 'extend'],
        icon: <Maximize2 className="h-4 w-4 text-cyan-400" />,
        action: onOpenResizeCanvas,
      },
      {
        id: 'doc-resize-image',
        title: 'Image Size (Resample Scale)',
        category: 'Canvas & Export',
        shortcut: 'Alt+Ctrl+I',
        keywords: ['scale', 'resolution', 'upscale', 'downscale'],
        icon: <Maximize2 className="h-4 w-4 text-purple-400" />,
        action: onOpenResizeImage,
      },
      {
        id: 'doc-templates',
        title: 'Browse Design Templates',
        category: 'Canvas & Export',
        keywords: ['presets', 'mockup', 'poster', 'banner', 'youtube', 'instagram'],
        icon: <Layers className="h-4 w-4 text-cyan-400" />,
        action: onOpenTemplates,
      },
      {
        id: 'doc-ai',
        title: 'AI Studio (Generate Image / Remove BG)',
        category: 'Canvas & Export',
        keywords: ['prompt', 'synth', 'gemini', 'flux', 'inpainting'],
        icon: <Sparkles className="h-4 w-4 text-amber-400" />,
        action: onOpenAIModal,
      },

      // VIEW & SELECTION
      {
        id: 'view-fit',
        title: 'Fit Composition on Screen',
        category: 'View',
        shortcut: 'Ctrl+0',
        keywords: ['center', 'frame', 'reset zoom'],
        icon: <Maximize className="h-4 w-4 text-gray-300" />,
        action: onFitScreen,
      },
      {
        id: 'view-100',
        title: 'Zoom to 100% (Actual Pixels)',
        category: 'View',
        shortcut: 'Ctrl+1',
        keywords: ['1:1', 'pixel perfect', 'true size'],
        icon: <ZoomIn className="h-4 w-4 text-gray-300" />,
        action: onZoom100,
      },
      {
        id: 'view-zoom-in',
        title: 'Zoom In',
        category: 'View',
        shortcut: 'Ctrl++',
        icon: <ZoomIn className="h-4 w-4 text-gray-300" />,
        action: onZoomIn,
      },
      {
        id: 'view-zoom-out',
        title: 'Zoom Out',
        category: 'View',
        shortcut: 'Ctrl+-',
        icon: <ZoomOut className="h-4 w-4 text-gray-300" />,
        action: onZoomOut,
      },
      {
        id: 'edit-undo',
        title: 'Undo History Action',
        category: 'View',
        shortcut: 'Ctrl+Z',
        icon: <Undo2 className="h-4 w-4 text-gray-300" />,
        action: onUndo,
      },
      {
        id: 'edit-redo',
        title: 'Redo History Action',
        category: 'View',
        shortcut: 'Ctrl+Y',
        icon: <Redo2 className="h-4 w-4 text-gray-300" />,
        action: onRedo,
      },
      {
        id: 'sel-all',
        title: 'Select All',
        category: 'View',
        shortcut: 'Ctrl+A',
        keywords: ['marquee all', 'canvas select'],
        icon: <MousePointer className="h-4 w-4 text-cyan-400" />,
        action: onSelectAll,
      },
      {
        id: 'sel-none',
        title: 'Deselect (Clear Selection)',
        category: 'View',
        shortcut: 'Ctrl+D',
        keywords: ['unselect', 'dismiss selection'],
        icon: <X className="h-4 w-4 text-gray-400" />,
        action: onDeselect,
      },
    ];
  }, [
    onSelectTool,
    onOpenLayerStyles,
    onNewLayer,
    onDuplicateLayer,
    onDeleteLayer,
    onMergeDown,
    onRotateCW,
    onRotateCCW,
    onResetRotation,
    onOpenNewCanvas,
    onOpenResizeCanvas,
    onOpenResizeImage,
    onOpenExport,
    onOpenAIModal,
    onOpenTemplates,
    onUndo,
    onRedo,
    onInvertColors,
    onAutoEnhance,
    onSelectAll,
    onDeselect,
    onZoomIn,
    onZoomOut,
    onFitScreen,
    onZoom100,
    onSwitchToAdjustmentsTab,
  ]);

  // Filter commands based on user search
  const filteredCommands = useMemo(() => {
    if (!query.trim()) return commands;
    const q = query.toLowerCase().trim();
    const tokens = q.split(/\s+/);

    return commands.filter((cmd) => {
      const matchText = [
        cmd.title,
        cmd.category,
        cmd.shortcut || '',
        ...(cmd.keywords || []),
      ]
        .join(' ')
        .toLowerCase();

      return tokens.every((token) => matchText.includes(token));
    });
  }, [commands, query]);

  // Keep selected index within bounds
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredCommands]);

  if (!isOpen) return null;

  const executeCommand = (cmd: CommandItem) => {
    onClose();
    setTimeout(() => {
      cmd.action();
    }, 20);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredCommands.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % Math.max(1, filteredCommands.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        executeCommand(filteredCommands[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/75 backdrop-blur-xs p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="flex flex-col w-full max-w-xl rounded-xl border border-white/15 bg-[#1e1e1e] shadow-2xl text-gray-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10 bg-[#252525]">
          <Search className="h-5 w-5 text-cyan-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search tools, adjustments, styles... (↑↓ to navigate, ↵ to run)"
            className="flex-1 bg-transparent text-sm text-white placeholder-gray-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded text-gray-400 hover:text-white cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
          <kbd className="hidden sm:inline text-[10px] font-mono bg-black/50 text-gray-400 px-1.5 py-0.5 rounded border border-white/10">
            ESC
          </kbd>
        </div>

        {/* Command Results List */}
        <div ref={listRef} className="max-h-80 overflow-y-auto p-1.5 space-y-0.5">
          {filteredCommands.length === 0 ? (
            <div className="py-8 text-center text-gray-400 text-xs">
              No matching commands found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={cmd.id}
                  onClick={() => executeCommand(cmd)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-cyan-500/20 text-white border border-cyan-500/40'
                      : 'text-gray-300 hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-6 w-6 items-center justify-center rounded bg-black/40 shrink-0">
                      {cmd.icon}
                    </div>
                    <div className="truncate">
                      <span className="text-xs font-medium">{cmd.title}</span>
                      <span className="ml-2 text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
                        {cmd.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    {cmd.shortcut && (
                      <kbd
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                          isSelected
                            ? 'bg-cyan-950/80 border-cyan-500/50 text-cyan-300'
                            : 'bg-black/50 border-white/10 text-gray-400'
                        }`}
                      >
                        {cmd.shortcut}
                      </kbd>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts hint */}
        <div className="flex items-center justify-between border-t border-white/10 bg-[#191919] px-4 py-2 text-[10px] text-gray-500">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>Esc Close</span>
          </div>
          <span className="flex items-center gap-1 text-cyan-400/80">
            <Keyboard className="w-3 h-3" /> Quick Palette
          </span>
        </div>
      </div>
    </div>
  );
};
