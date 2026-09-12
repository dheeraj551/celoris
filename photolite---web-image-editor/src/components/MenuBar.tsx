import React, { useState, useRef, useEffect } from 'react';
import {
  FileImage,
  FolderOpen,
  Save,
  Download,
  RotateCcw,
  RotateCw,
  Crop,
  Maximize2,
  Layers,
  ZoomIn,
  ZoomOut,
  Sliders,
  CheckSquare,
  HelpCircle,
  Plus,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  Palette,
  Sparkles,
  PanelRight,
  Moon,
  Film,
  Droplets,
  Crown,
  Wand2,
  LayoutTemplate,
} from 'lucide-react';

interface MenuBarProps {
  onNew: () => void;
  onOpenFile: () => void;
  onSaveJson: () => void;
  onOpenJson: () => void;
  onExportModal: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onResizeCanvasModal: () => void;
  onResizeImageModal: () => void;
  onCropTool: () => void;
  onInvertColors: () => void;
  onAutoEnhance: () => void;
  onConvertToGrayscale?: () => void;
  onConvertToSepia?: () => void;
  onOpenHue?: () => void;
  onOpenHueSaturation?: () => void;
  onOpenSaturation?: () => void;
  onOpenNoise?: () => void;
  onOpenGaussianBlur?: () => void;
  onOpenAIModal?: () => void;
  onOpenTemplatesModal?: () => void;
  onOpenProModal?: () => void;
  isProUser?: boolean;
  onNewLayer: () => void;
  onDuplicateLayer: () => void;
  onDeleteLayer: () => void;
  onRotateCW?: () => void;
  onRotateCCW?: () => void;
  onResetRotation?: () => void;
  onSelectAll: () => void;
  onDeselect: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitScreen: () => void;
  onZoom100: () => void;
  zoom: number;
  canvasWidth: number;
  canvasHeight: number;
  projectName: string;
  setProjectName: (name: string) => void;
  isSidebarOpen?: boolean;
  onToggleSidebar?: () => void;
}

export const MenuBar: React.FC<MenuBarProps> = ({
  onNew,
  onOpenFile,
  onSaveJson,
  onOpenJson,
  onExportModal,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onResizeCanvasModal,
  onResizeImageModal,
  onCropTool,
  onInvertColors,
  onAutoEnhance,
  onConvertToGrayscale,
  onConvertToSepia,
  onOpenHue,
  onOpenHueSaturation,
  onOpenSaturation,
  onOpenNoise,
  onOpenGaussianBlur,
  onOpenAIModal,
  onOpenTemplatesModal,
  onOpenProModal,
  isProUser = true,
  onNewLayer,
  onDuplicateLayer,
  onDeleteLayer,
  onRotateCW,
  onRotateCCW,
  onResetRotation,
  onSelectAll,
  onDeselect,
  onZoomIn,
  onZoomOut,
  onFitScreen,
  onZoom100,
  zoom,
  canvasWidth,
  canvasHeight,
  projectName,
  setProjectName,
  isSidebarOpen,
  onToggleSidebar,
}) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const menuBarRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuBarRef.current && !menuBarRef.current.contains(e.target as Node)) {
        setActiveMenu(null);
      }
    };
    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMenuClick = (menu: string) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  const handleAction = (callback: () => void) => {
    setActiveMenu(null);
    callback();
  };

  return (
    <header
      id="app-menubar"
      ref={menuBarRef}
      className="relative z-50 flex h-8 w-full items-center justify-between border-b border-black bg-[#2b2b2b] px-3 text-[11px] text-gray-300 select-none shrink-0"
    >
      {/* Left branding & menu items */}
      <div className="flex items-center gap-1">
        {/* App Logo */}
        <div className="flex items-center gap-2 pl-0.5 pr-2.5 border-r border-black mr-1">
          <div className="flex h-5 w-5 items-center justify-center rounded bg-gradient-to-tr from-cyan-600 to-blue-500 font-bold text-white shadow-sm">
            <Palette className="h-3 w-3" />
          </div>
          <span className="font-semibold tracking-wide text-gray-200 hidden sm:inline text-xs">PhotoLite</span>
        </div>

        {/* File Menu */}
        <div className="relative">
          <button
            id="menu-file-btn"
            onClick={() => handleMenuClick('file')}
            className={`rounded px-2 py-0.5 hover:bg-[#3c3c3c] cursor-pointer ${
              activeMenu === 'file' ? 'bg-[#3c3c3c] text-white' : 'text-gray-300'
            }`}
          >
            File
          </button>
          {activeMenu === 'file' && (
            <div className="absolute left-0 top-full mt-1 w-52 rounded border border-black bg-[#2b2b2b] py-1 shadow-2xl z-50 text-[11px]">
              <button
                onClick={() => handleAction(onNew)}
                className="flex w-full items-center justify-between px-3 py-1 hover:bg-[#3c3c3c] hover:text-white cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Plus className="h-3.5 w-3.5" /> New Canvas...
                </span>
                <span className="text-[10px] text-gray-400">Ctrl+N</span>
              </button>
              {onOpenTemplatesModal && (
                <button
                  id="menu-file-templates-btn"
                  onClick={() => handleAction(onOpenTemplatesModal)}
                  className="flex w-full items-center justify-between px-3 py-1 hover:bg-[#3c3c3c] hover:text-white cursor-pointer text-cyan-300"
                >
                  <span className="flex items-center gap-2">
                    <LayoutTemplate className="h-3.5 w-3.5 text-cyan-400" /> Templates (Canva Style)...
                  </span>
                  <span className="rounded bg-cyan-950 px-1 py-0.2 text-[8px] font-mono text-cyan-300 border border-cyan-500/30">
                    CANVA
                  </span>
                </button>
              )}
              <button
                onClick={() => handleAction(onOpenFile)}
                className="flex w-full items-center justify-between px-3 py-1 hover:bg-[#3c3c3c] hover:text-white cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <FolderOpen className="h-3.5 w-3.5" /> Open Image...
                </span>
                <span className="text-[10px] text-gray-400">Ctrl+O</span>
              </button>
              <div className="my-1 border-t border-black" />
              <button
                onClick={() => handleAction(onExportModal)}
                className="flex w-full items-center justify-between px-3 py-1 hover:bg-[#3c3c3c] hover:text-white cursor-pointer"
              >
                <span className="flex items-center gap-2 font-medium text-cyan-300 hover:text-white">
                  <Download className="h-3.5 w-3.5" /> Quick Export...
                </span>
                <span className="text-[10px] text-gray-400">Ctrl+E</span>
              </button>
              <div className="my-1 border-t border-black" />
              <button
                onClick={() => handleAction(onSaveJson)}
                className="flex w-full items-center justify-between px-3 py-1 hover:bg-[#3c3c3c] hover:text-white cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Save className="h-3.5 w-3.5" /> Save Project (JSON)
                </span>
                <span className="text-[10px] text-gray-400">Ctrl+S</span>
              </button>
              <button
                onClick={() => handleAction(onOpenJson)}
                className="flex w-full items-center justify-between px-3 py-1 hover:bg-[#3c3c3c] hover:text-white cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <FolderOpen className="h-3.5 w-3.5" /> Open Project (.json)
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Edit Menu */}
        <div className="relative">
          <button
            id="menu-edit-btn"
            onClick={() => handleMenuClick('edit')}
            className={`rounded px-2 py-0.5 hover:bg-[#3c3c3c] cursor-pointer ${
              activeMenu === 'edit' ? 'bg-[#3c3c3c] text-white' : 'text-gray-300'
            }`}
          >
            Edit
          </button>
          {activeMenu === 'edit' && (
            <div className="absolute left-0 top-full mt-1 w-48 rounded border border-black bg-[#2b2b2b] py-1 shadow-2xl z-50 text-[11px]">
              <button
                disabled={!canUndo}
                onClick={() => handleAction(onUndo)}
                className="flex w-full items-center justify-between px-3 py-1 disabled:opacity-40 hover:enabled:bg-[#3c3c3c] hover:enabled:text-white cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <RotateCcw className="h-3.5 w-3.5" /> Undo
                </span>
                <span className="text-[10px] text-gray-400">Ctrl+Z</span>
              </button>
              <button
                disabled={!canRedo}
                onClick={() => handleAction(onRedo)}
                className="flex w-full items-center justify-between px-3 py-1 disabled:opacity-40 hover:enabled:bg-[#3c3c3c] hover:enabled:text-white cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <RotateCw className="h-3.5 w-3.5" /> Redo
                </span>
                <span className="text-[10px] text-gray-400">Ctrl+Y</span>
              </button>
              <div className="my-1 border-t border-black" />
              <button
                onClick={() => handleAction(onDeselect)}
                className="flex w-full items-center justify-between px-3 py-1 hover:bg-[#3c3c3c] hover:text-white cursor-pointer"
              >
                <span>Deselect</span>
                <span className="text-[10px] text-gray-400">Ctrl+D</span>
              </button>
            </div>
          )}
        </div>

        {/* Image Menu */}
        <div className="relative">
          <button
            id="menu-image-btn"
            onClick={() => handleMenuClick('image')}
            className={`rounded px-2 py-0.5 hover:bg-[#3c3c3c] cursor-pointer ${
              activeMenu === 'image' ? 'bg-[#3c3c3c] text-white' : 'text-gray-300'
            }`}
          >
            Image
          </button>
          {activeMenu === 'image' && (
            <div className="absolute left-0 top-full mt-1 w-52 rounded border border-black bg-[#2b2b2b] py-1 shadow-2xl z-50 text-[11px]">
              <button
                onClick={() => handleAction(onResizeCanvasModal)}
                className="flex w-full items-center justify-between px-3 py-1 hover:bg-[#3c3c3c] hover:text-white cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Maximize2 className="h-3.5 w-3.5" /> Canvas Size...
                </span>
                <span className="text-[10px] text-gray-400">Ctrl+Alt+C</span>
              </button>
              <button
                onClick={() => handleAction(onResizeImageModal)}
                className="flex w-full items-center justify-between px-3 py-1 hover:bg-[#3c3c3c] hover:text-white cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <FileImage className="h-3.5 w-3.5" /> Image Size / Rescale...
                </span>
                <span className="text-[10px] text-gray-400">Ctrl+Alt+I</span>
              </button>
              <button
                onClick={() => handleAction(onCropTool)}
                className="flex w-full items-center justify-between px-3 py-1 hover:bg-[#3c3c3c] hover:text-white cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Crop className="h-3.5 w-3.5" /> Crop Tool
                </span>
                <span className="text-[10px] text-gray-400">C</span>
              </button>
              <div className="my-1 border-t border-black" />
              <button
                onClick={() => handleAction(onAutoEnhance)}
                className="flex w-full items-center justify-between px-3 py-1 hover:bg-[#3c3c3c] hover:text-white cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-amber-400" /> Auto Contrast / Brighten
                </span>
              </button>
              <button
                id="menu-image-grayscale-btn"
                onClick={() => handleAction(onConvertToGrayscale)}
                className="flex w-full items-center justify-between px-3 py-1 hover:bg-[#3c3c3c] hover:text-white cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Moon className="h-3.5 w-3.5 text-neutral-300" /> Grayscale (Luminance)
                </span>
                <span className="text-[10px] text-gray-400">Ctrl+Shift+U</span>
              </button>
              <button
                id="menu-image-sepia-btn"
                onClick={() => handleAction(onConvertToSepia)}
                className="flex w-full items-center justify-between px-3 py-1 hover:bg-[#3c3c3c] hover:text-white cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Film className="h-3.5 w-3.5 text-amber-500" /> Sepia Tone
                </span>
                <span className="text-[10px] text-gray-400">Pixel Transform</span>
              </button>
              <button
                id="menu-image-hue-btn"
                onClick={() => handleAction(onOpenHue || onOpenHueSaturation || (() => {}))}
                className="flex w-full items-center justify-between px-3 py-1 hover:bg-[#3c3c3c] hover:text-white cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Palette className="h-3.5 w-3.5 text-violet-400" /> Hue (Color Shift)...
                </span>
                <span className="text-[10px] text-gray-400">HSL Shift</span>
              </button>
              <button
                id="menu-image-huesat-btn"
                onClick={() => handleAction(onOpenHueSaturation || (() => {}))}
                className="flex w-full items-center justify-between px-3 py-1 hover:bg-[#3c3c3c] hover:text-white cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Palette className="h-3.5 w-3.5 text-emerald-400" /> Hue / Saturation...
                </span>
                <span className="text-[10px] text-gray-400">Ctrl+U</span>
              </button>
              <button
                id="menu-image-saturation-btn"
                onClick={() => handleAction(onOpenSaturation || onOpenHueSaturation || (() => {}))}
                className="flex w-full items-center justify-between px-3 py-1 hover:bg-[#3c3c3c] hover:text-white cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-pink-400" /> Saturation (HSL)...
                </span>
                <span className="text-[10px] text-gray-400">Filter</span>
              </button>
              <button
                id="menu-image-noise-btn"
                onClick={() => handleAction(onOpenNoise || onOpenHueSaturation || (() => {}))}
                className="flex w-full items-center justify-between px-3 py-1 hover:bg-[#3c3c3c] hover:text-white cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-purple-400" /> Add Noise...
                </span>
                <span className="text-[10px] text-gray-400">Filter</span>
              </button>
              <button
                id="menu-image-gaussian-blur-btn"
                onClick={() => handleAction(onOpenGaussianBlur || onOpenNoise || onOpenHueSaturation || (() => {}))}
                className="flex w-full items-center justify-between px-3 py-1 hover:bg-[#3c3c3c] hover:text-white cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Droplets className="h-3.5 w-3.5 text-blue-400" /> Gaussian Blur...
                </span>
                <span className="text-[10px] text-gray-400">Filter</span>
              </button>
              <div className="my-1 border-t border-black" />
              <button
                id="menu-image-ai-studio-btn"
                onClick={() => handleAction(onOpenAIModal || (() => {}))}
                className="flex w-full items-center justify-between px-3 py-1 hover:bg-[#3c3c3c] hover:text-amber-300 text-amber-200 cursor-pointer font-medium"
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-amber-400" /> Create & Edit with Gemini AI...
                </span>
                <span className="flex items-center gap-1 text-[9px] font-mono text-amber-400 bg-amber-950/60 px-1 py-0.5 rounded border border-amber-500/40">
                  <Crown className="h-2.5 w-2.5" /> PRO
                </span>
              </button>
              <button
                onClick={() => handleAction(onInvertColors)}
                className="flex w-full items-center justify-between px-3 py-1 hover:bg-[#3c3c3c] hover:text-white cursor-pointer"
              >
                <span>Invert Colors</span>
                <span className="text-[10px] text-gray-400">Ctrl+I</span>
              </button>
            </div>
          )}
        </div>

        {/* Layer Menu */}
        <div className="relative">
          <button
            id="menu-layer-btn"
            onClick={() => handleMenuClick('layer')}
            className={`rounded px-2 py-0.5 hover:bg-[#3c3c3c] cursor-pointer ${
              activeMenu === 'layer' ? 'bg-[#3c3c3c] text-white' : 'text-gray-300'
            }`}
          >
            Layer
          </button>
          {activeMenu === 'layer' && (
            <div className="absolute left-0 top-full mt-1 w-48 rounded border border-black bg-[#2b2b2b] py-1 shadow-2xl z-50 text-[11px]">
              <button
                onClick={() => handleAction(onNewLayer)}
                className="flex w-full items-center justify-between px-3 py-1 hover:bg-[#3c3c3c] hover:text-white cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Plus className="h-3.5 w-3.5" /> New Layer
                </span>
                <span className="text-[10px] text-gray-400">Shift+N</span>
              </button>
              <button
                onClick={() => handleAction(onDuplicateLayer)}
                className="flex w-full items-center justify-between px-3 py-1 hover:bg-[#3c3c3c] hover:text-white cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Copy className="h-3.5 w-3.5" /> Duplicate Layer
                </span>
                <span className="text-[10px] text-gray-400">Ctrl+J</span>
              </button>
              <div className="my-1 border-t border-black" />
              <button
                id="menu-layer-rotate-cw-btn"
                onClick={() => handleAction(onRotateCW)}
                className="flex w-full items-center justify-between px-3 py-1 hover:bg-[#3c3c3c] hover:text-white cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <RotateCw className="h-3.5 w-3.5 text-cyan-400" /> Rotate 90° Clockwise
                </span>
                <span className="text-[10px] text-gray-400">+90°</span>
              </button>
              <button
                id="menu-layer-rotate-ccw-btn"
                onClick={() => handleAction(onRotateCCW)}
                className="flex w-full items-center justify-between px-3 py-1 hover:bg-[#3c3c3c] hover:text-white cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <RotateCcw className="h-3.5 w-3.5 text-cyan-400" /> Rotate 90° Counter-CW
                </span>
                <span className="text-[10px] text-gray-400">-90°</span>
              </button>
              <button
                id="menu-layer-reset-rot-btn"
                onClick={() => handleAction(onResetRotation)}
                className="flex w-full items-center justify-between px-3 py-1 hover:bg-[#3c3c3c] hover:text-white cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <span>Reset Layer Angle</span>
                </span>
                <span className="text-[10px] text-gray-400">0°</span>
              </button>
              <div className="my-1 border-t border-black" />
              <button
                onClick={() => handleAction(onDeleteLayer)}
                className="flex w-full items-center justify-between px-3 py-1 text-red-400 hover:bg-red-900/60 hover:text-white cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Trash2 className="h-3.5 w-3.5" /> Delete Layer
                </span>
                <span className="text-[10px] text-gray-400">Del</span>
              </button>
            </div>
          )}
        </div>

        {/* Select Menu */}
        <div className="relative">
          <button
            id="menu-select-btn"
            onClick={() => handleMenuClick('select')}
            className={`rounded px-2 py-0.5 hover:bg-[#3c3c3c] cursor-pointer ${
              activeMenu === 'select' ? 'bg-[#3c3c3c] text-white' : 'text-gray-300'
            }`}
          >
            Select
          </button>
          {activeMenu === 'select' && (
            <div className="absolute left-0 top-full mt-1 w-44 rounded border border-black bg-[#2b2b2b] py-1 shadow-2xl z-50 text-[11px]">
              <button
                onClick={() => handleAction(onSelectAll)}
                className="flex w-full items-center justify-between px-3 py-1 hover:bg-[#3c3c3c] hover:text-white cursor-pointer"
              >
                <span>Select All</span>
                <span className="text-[10px] text-gray-400">Ctrl+A</span>
              </button>
              <button
                onClick={() => handleAction(onDeselect)}
                className="flex w-full items-center justify-between px-3 py-1 hover:bg-[#3c3c3c] hover:text-white cursor-pointer"
              >
                <span>Deselect</span>
                <span className="text-[10px] text-gray-400">Ctrl+D</span>
              </button>
            </div>
          )}
        </div>

        {/* View Menu */}
        <div className="relative">
          <button
            id="menu-view-btn"
            onClick={() => handleMenuClick('view')}
            className={`rounded px-2 py-0.5 hover:bg-[#3c3c3c] cursor-pointer ${
              activeMenu === 'view' ? 'bg-[#3c3c3c] text-white' : 'text-gray-300'
            }`}
          >
            View
          </button>
          {activeMenu === 'view' && (
            <div className="absolute left-0 top-full mt-1 w-44 rounded border border-black bg-[#2b2b2b] py-1 shadow-2xl z-50 text-[11px]">
              <button
                onClick={() => handleAction(onZoomIn)}
                className="flex w-full items-center justify-between px-3 py-1 hover:bg-[#3c3c3c] hover:text-white cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <ZoomIn className="h-3.5 w-3.5" /> Zoom In
                </span>
                <span className="text-[10px] text-gray-400">Ctrl++</span>
              </button>
              <button
                onClick={() => handleAction(onZoomOut)}
                className="flex w-full items-center justify-between px-3 py-1 hover:bg-[#3c3c3c] hover:text-white cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <ZoomOut className="h-3.5 w-3.5" /> Zoom Out
                </span>
                <span className="text-[10px] text-gray-400">Ctrl+-</span>
              </button>
              <button
                onClick={() => handleAction(onFitScreen)}
                className="flex w-full items-center justify-between px-3 py-1 hover:bg-[#3c3c3c] hover:text-white cursor-pointer"
              >
                <span>Fit on Screen</span>
                <span className="text-[10px] text-gray-400">Ctrl+0</span>
              </button>
              <button
                onClick={() => handleAction(onZoom100)}
                className="flex w-full items-center justify-between px-3 py-1 hover:bg-[#3c3c3c] hover:text-white cursor-pointer"
              >
                <span>100% Actual Size</span>
                <span className="text-[10px] text-gray-400">Ctrl+1</span>
              </button>
            </div>
          )}
        </div>

        {/* Project Name editable */}
        <div className="ml-2 hidden md:flex items-center gap-1.5 text-gray-400">
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="rounded bg-[#1a1a1a] px-2 py-0.5 text-[11px] text-gray-200 border border-black hover:border-[#4a4a4a] focus:border-blue-500 focus:outline-none w-36"
            title="Click to rename project"
          />
          <span className="text-[10px] text-gray-500 font-mono">
            {canvasWidth}×{canvasHeight}
          </span>
        </div>
      </div>

      {/* Right side quick actions */}
      <div className="flex items-center gap-2">
        {/* Undo / Redo */}
        <div className="flex items-center rounded bg-[#1a1a1a] p-0.5 border border-black">
          <button
            id="quick-undo-btn"
            disabled={!canUndo}
            onClick={onUndo}
            title="Undo (Ctrl+Z)"
            className="rounded p-0.5 text-gray-300 hover:bg-[#3c3c3c] hover:text-white disabled:opacity-30 cursor-pointer"
          >
            <RotateCcw className="h-3 w-3" />
          </button>
          <button
            id="quick-redo-btn"
            disabled={!canRedo}
            onClick={onRedo}
            title="Redo (Ctrl+Y)"
            className="rounded p-0.5 text-gray-300 hover:bg-[#3c3c3c] hover:text-white disabled:opacity-30 cursor-pointer"
          >
            <RotateCw className="h-3 w-3" />
          </button>
        </div>

        {/* Zoom display */}
        <div className="flex items-center gap-1 bg-[#1a1a1a] border border-black rounded px-1.5 py-0.5 text-[10px] text-gray-300 font-mono">
          <button onClick={onZoomOut} className="hover:text-white px-0.5 cursor-pointer">-</button>
          <span>{Math.round(zoom * 100)}%</span>
          <button onClick={onZoomIn} className="hover:text-white px-0.5 cursor-pointer">+</button>
        </div>

        {/* Templates Button (Canva Style) */}
        {onOpenTemplatesModal && (
          <button
            id="quick-templates-btn"
            onClick={onOpenTemplatesModal}
            className="flex items-center gap-1.5 rounded bg-[#333333] hover:bg-[#3d3d3d] hover:text-white px-2.5 py-0.5 font-semibold text-gray-200 shadow-sm transition-all border border-neutral-700 text-[11px] cursor-pointer"
            title="Browse and customize Canva-style design templates"
          >
            <LayoutTemplate className="h-3 w-3 text-cyan-400" />
            <span>Templates</span>
          </button>
        )}

        {/* AI Image Studio Button (Pro Feature) */}
        {onOpenAIModal && (
          <button
            id="quick-ai-btn"
            onClick={onOpenAIModal}
            className="flex items-center gap-1.5 rounded bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 px-2.5 py-0.5 font-bold text-black shadow-sm transition-all border border-amber-600 text-[11px] cursor-pointer"
            title="Create & Edit Images with Gemini AI (gemini-3.1-flash-image-preview)"
          >
            <Sparkles className="h-3 w-3 text-black" />
            <span>AI Studio</span>
            <span className="rounded bg-black/20 px-1 py-0.2 text-[8px] font-mono uppercase tracking-wider">
              {isProUser ? 'PRO' : 'PRO'}
            </span>
          </button>
        )}

        {/* Pro Plan Status Badge */}
        {onOpenProModal && (
          <button
            id="btn-pro-membership-badge"
            onClick={onOpenProModal}
            className={`flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-semibold border cursor-pointer transition-colors ${
              isProUser
                ? 'bg-amber-950/60 border-amber-500/50 text-amber-300 hover:bg-amber-900/70'
                : 'bg-[#1e1e1e] border-neutral-700 text-gray-400 hover:text-amber-300 hover:border-amber-600'
            }`}
            title="PhotoLite Pro Membership"
          >
            <Crown className="h-3 w-3 text-amber-400" />
            <span>{isProUser ? 'Pro Active' : 'Upgrade to Pro'}</span>
          </button>
        )}

        {/* Export Button */}
        <button
          id="quick-export-btn"
          onClick={onExportModal}
          className="flex items-center gap-1 rounded bg-blue-600 hover:bg-blue-500 px-2.5 py-0.5 font-medium text-white shadow-sm transition-colors border border-black text-[11px] cursor-pointer"
        >
          <Download className="h-3 w-3" />
          <span>Export</span>
        </button>

        {/* Sidebar Toggle button */}
        {onToggleSidebar && (
          <button
            id="toggle-sidebar-btn"
            onClick={onToggleSidebar}
            className={`p-1 rounded transition-colors cursor-pointer border border-black ${
              isSidebarOpen
                ? 'bg-[#3c3c3c] text-cyan-400'
                : 'bg-[#1a1a1a] text-gray-400 hover:text-white hover:bg-[#3c3c3c]'
            }`}
            title={isSidebarOpen ? 'Hide Right Panels (Layers/History)' : 'Show Right Panels'}
          >
            <PanelRight className="h-3.5 w-3.5" />
          </button>
        )}

        {/* Help button */}
        <button
          onClick={() => setShowHelp(true)}
          className="p-1 rounded text-gray-400 hover:text-white hover:bg-[#3c3c3c] cursor-pointer"
          title="Keyboard shortcuts & Help"
        >
          <HelpCircle className="h-3.5 w-3.5" />
        </button>

        {/* Window dot controls matching High Density theme */}
        <div className="flex items-center gap-1.5 ml-1 pl-1 border-l border-black">
          <div className="w-2 h-2 rounded-full bg-[#f44336]" />
          <div className="w-2 h-2 rounded-full bg-[#ffeb3b]" />
          <div className="w-2 h-2 rounded-full bg-[#4caf50]" />
        </div>
      </div>

      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
          <div className="w-full max-w-md rounded border border-black bg-[#2b2b2b] p-4 shadow-2xl text-gray-200">
            <div className="flex items-center justify-between pb-2.5 border-b border-black">
              <h3 className="font-semibold text-xs text-white flex items-center gap-2">
                <HelpCircle className="h-3.5 w-3.5 text-blue-400" />
                PhotoLite Shortcuts & Guide
              </h3>
              <button
                onClick={() => setShowHelp(false)}
                className="text-gray-400 hover:text-white text-base font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>
            <div className="mt-3 space-y-2 text-[11px]">
              <div className="grid grid-cols-2 gap-1.5 text-gray-300">
                <div className="flex justify-between bg-[#1a1a1a] p-1.5 rounded border border-black">
                  <span>Move / Transform</span>
                  <span className="font-mono text-cyan-400">V</span>
                </div>
                <div className="flex justify-between bg-[#1a1a1a] p-1.5 rounded border border-black">
                  <span>Rectangular Marquee</span>
                  <span className="font-mono text-cyan-400">M</span>
                </div>
                <div className="flex justify-between bg-[#1a1a1a] p-1.5 rounded border border-black">
                  <span>Lasso Tool</span>
                  <span className="font-mono text-cyan-400">L</span>
                </div>
                <div className="flex justify-between bg-[#1a1a1a] p-1.5 rounded border border-black">
                  <span>Magic Wand</span>
                  <span className="font-mono text-cyan-400">W</span>
                </div>
                <div className="flex justify-between bg-[#1a1a1a] p-1.5 rounded border border-black">
                  <span>Crop Tool</span>
                  <span className="font-mono text-cyan-400">C</span>
                </div>
                <div className="flex justify-between bg-[#1a1a1a] p-1.5 rounded border border-black">
                  <span>Pen (Path) Tool</span>
                  <span className="font-mono text-cyan-400">P</span>
                </div>
                <div className="flex justify-between bg-[#1a1a1a] p-1.5 rounded border border-black">
                  <span>Brush Tool</span>
                  <span className="font-mono text-cyan-400">B</span>
                </div>
                <div className="flex justify-between bg-[#1a1a1a] p-1.5 rounded border border-black">
                  <span>Eraser Tool</span>
                  <span className="font-mono text-cyan-400">E</span>
                </div>
                <div className="flex justify-between bg-[#1a1a1a] p-1.5 rounded border border-black">
                  <span>Paint Bucket</span>
                  <span className="font-mono text-cyan-400">G</span>
                </div>
                <div className="flex justify-between bg-[#1a1a1a] p-1.5 rounded border border-black">
                  <span>Text Tool</span>
                  <span className="font-mono text-cyan-400">T</span>
                </div>
                <div className="flex justify-between bg-[#1a1a1a] p-1.5 rounded border border-black">
                  <span>Eyedropper</span>
                  <span className="font-mono text-cyan-400">I</span>
                </div>
                <div className="flex justify-between bg-[#1a1a1a] p-1.5 rounded border border-black">
                  <span>Hand (Pan)</span>
                  <span className="font-mono text-cyan-400">H or Space</span>
                </div>
                <div className="flex justify-between bg-[#1a1a1a] p-1.5 rounded border border-black">
                  <span>Undo / Redo</span>
                  <span className="font-mono text-cyan-400">Ctrl+Z / Ctrl+Y</span>
                </div>
                <div className="flex justify-between bg-[#1a1a1a] p-1.5 rounded border border-black">
                  <span>Deselect</span>
                  <span className="font-mono text-cyan-400">Ctrl+D</span>
                </div>
              </div>
              <div className="mt-2 text-gray-400 text-[10px] leading-relaxed">
                Tip: Use the right Layers panel to adjust blend modes (e.g. Screen, Multiply, Overlay) and layer opacity. In History panel, click any step to roll back changes immediately.
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowHelp(false)}
                className="rounded bg-blue-600 px-3 py-1 text-xs text-white hover:bg-blue-500 font-medium cursor-pointer border border-black"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
