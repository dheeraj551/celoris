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
  BookOpen,
  GraduationCap,
  Briefcase,
  User as UserIcon,
  Wallet,
  LogOut,
  LogIn,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// AI image generation and the Pro plan are not launched yet — flip this to
// true to re-enable the "Create & Edit with Gemini AI" entry points (the
// Image-menu item, the toolbar AI Studio button, and the Pro badge) once
// they're ready. Until then they render greyed out with a "Coming Soon"
// label instead of opening AIImageModal / ProPlanModal.
const AI_STUDIO_ENABLED = false;

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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const menuBarRef = useRef<HTMLDivElement>(null);
  const { user, profile, loading: authLoading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const handleToggleFullscreen = () => {
    if (typeof document === 'undefined') return;
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

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
      className="relative z-50 flex h-9 w-full items-center justify-between border-b border-white/5 bg-[#2b2b2b] px-3 text-[11px] text-gray-300 select-none shrink-0 shadow-[0_1px_0_rgba(255,255,255,0.04)_inset]"
    >
      {/* Left branding & menu items */}
      <div className="flex items-center gap-1">
        {/* Traffic-light window controls — styled and wired like a native
            macOS app: red closes PhotoLite (back to the dashboard), yellow
            minimizes the side panels, green toggles browser fullscreen. */}
        <div className="pl-traffic-lights pr-2.5 mr-1.5 border-r border-white/10" role="group" aria-label="Window controls">
          <button
            type="button"
            onClick={() => router.push('/')}
            className="pl-traffic-dot pl-dot-red"
            title="Close PhotoLite"
          />
          <button
            type="button"
            data-interactive={onToggleSidebar ? 'true' : undefined}
            onClick={onToggleSidebar}
            className="pl-traffic-dot pl-dot-yellow"
            title={onToggleSidebar ? 'Minimize Panels' : undefined}
          />
          <button
            type="button"
            data-interactive="true"
            onClick={handleToggleFullscreen}
            className="pl-traffic-dot pl-dot-green"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          />
        </div>

        {/* App Logo */}
        <div className="flex items-center gap-2 pl-0.5 pr-2.5 border-r border-white/10 mr-1">
          <div className="flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-tr from-cyan-600 to-blue-500 font-bold text-white shadow-sm">
            <Palette className="h-3 w-3" />
          </div>
          <span className="font-semibold tracking-wide text-gray-200 hidden sm:inline text-xs">PhotoLite</span>
        </div>

        {/* File Menu */}
        <div className="relative">
          <button
            id="menu-file-btn"
            onClick={() => handleMenuClick('file')}
            className={`rounded-md px-2.5 py-1 hover:bg-white/10 active:scale-95 transition-all cursor-pointer ${
              activeMenu === 'file' ? 'bg-[#3c3c3c] text-white' : 'text-gray-300'
            }`}
          >
            File
          </button>
          {activeMenu === 'file' && (
            <div className="absolute left-0 top-full mt-1 w-52 pl-window pl-menu-anim py-1.5 z-50 text-[11px]">
              <button
                onClick={() => handleAction(onNew)}
                className="flex w-full items-center justify-between px-3 py-1 hover:bg-white/10 hover:text-white cursor-pointer transition-colors rounded-md mx-1"
              >
                <span className="flex items-center gap-2">
                  <Plus className="h-3.5 w-3.5" /> New Canvas...
                </span>
                <span className="text-[10px] text-gray-400">Ctrl+N</span>
              </button>
              <button
                onClick={() => handleAction(onOpenFile)}
                className="flex w-full items-center justify-between px-3 py-1 hover:bg-white/10 hover:text-white cursor-pointer transition-colors rounded-md mx-1"
              >
                <span className="flex items-center gap-2">
                  <FolderOpen className="h-3.5 w-3.5" /> Open Image...
                </span>
                <span className="text-[10px] text-gray-400">Ctrl+O</span>
              </button>
              <div className="my-1 border-t border-black" />
              <button
                onClick={() => handleAction(onExportModal)}
                className="flex w-full items-center justify-between px-3 py-1 hover:bg-white/10 hover:text-white cursor-pointer transition-colors rounded-md mx-1"
              >
                <span className="flex items-center gap-2 font-medium text-cyan-300 hover:text-white">
                  <Download className="h-3.5 w-3.5" /> Quick Export...
                </span>
                <span className="text-[10px] text-gray-400">Ctrl+E</span>
              </button>
              <div className="my-1 border-t border-black" />
              <button
                onClick={() => handleAction(onSaveJson)}
                className="flex w-full items-center justify-between px-3 py-1 hover:bg-white/10 hover:text-white cursor-pointer transition-colors rounded-md mx-1"
              >
                <span className="flex items-center gap-2">
                  <Save className="h-3.5 w-3.5" /> Save Project (JSON)
                </span>
                <span className="text-[10px] text-gray-400">Ctrl+S</span>
              </button>
              <button
                onClick={() => handleAction(onOpenJson)}
                className="flex w-full items-center justify-between px-3 py-1 hover:bg-white/10 hover:text-white cursor-pointer transition-colors rounded-md mx-1"
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
            className={`rounded-md px-2.5 py-1 hover:bg-white/10 active:scale-95 transition-all cursor-pointer ${
              activeMenu === 'edit' ? 'bg-[#3c3c3c] text-white' : 'text-gray-300'
            }`}
          >
            Edit
          </button>
          {activeMenu === 'edit' && (
            <div className="absolute left-0 top-full mt-1 w-48 pl-window pl-menu-anim py-1.5 z-50 text-[11px]">
              <button
                disabled={!canUndo}
                onClick={() => handleAction(onUndo)}
                className="flex w-full items-center justify-between px-3 py-1 disabled:opacity-40 hover:enabled:bg-white/10 hover:enabled:text-white cursor-pointer transition-colors rounded-md mx-1"
              >
                <span className="flex items-center gap-2">
                  <RotateCcw className="h-3.5 w-3.5" /> Undo
                </span>
                <span className="text-[10px] text-gray-400">Ctrl+Z</span>
              </button>
              <button
                disabled={!canRedo}
                onClick={() => handleAction(onRedo)}
                className="flex w-full items-center justify-between px-3 py-1 disabled:opacity-40 hover:enabled:bg-white/10 hover:enabled:text-white cursor-pointer transition-colors rounded-md mx-1"
              >
                <span className="flex items-center gap-2">
                  <RotateCw className="h-3.5 w-3.5" /> Redo
                </span>
                <span className="text-[10px] text-gray-400">Ctrl+Y</span>
              </button>
              <div className="my-1 border-t border-black" />
              <button
                onClick={() => handleAction(onDeselect)}
                className="flex w-full items-center justify-between px-3 py-1 hover:bg-white/10 hover:text-white cursor-pointer transition-colors rounded-md mx-1"
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
            className={`rounded-md px-2.5 py-1 hover:bg-white/10 active:scale-95 transition-all cursor-pointer ${
              activeMenu === 'image' ? 'bg-[#3c3c3c] text-white' : 'text-gray-300'
            }`}
          >
            Image
          </button>
          {activeMenu === 'image' && (
            <div className="absolute left-0 top-full mt-1 w-52 pl-window pl-menu-anim py-1.5 z-50 text-[11px]">
              <button
                onClick={() => handleAction(onResizeCanvasModal)}
                className="flex w-full items-center justify-between px-3 py-1 hover:bg-white/10 hover:text-white cursor-pointer transition-colors rounded-md mx-1"
              >
                <span className="flex items-center gap-2">
                  <Maximize2 className="h-3.5 w-3.5" /> Canvas Size...
                </span>
                <span className="text-[10px] text-gray-400">Ctrl+Alt+C</span>
              </button>
              <button
                onClick={() => handleAction(onResizeImageModal)}
                className="flex w-full items-center justify-between px-3 py-1 hover:bg-white/10 hover:text-white cursor-pointer transition-colors rounded-md mx-1"
              >
                <span className="flex items-center gap-2">
                  <FileImage className="h-3.5 w-3.5" /> Image Size / Rescale...
                </span>
                <span className="text-[10px] text-gray-400">Ctrl+Alt+I</span>
              </button>
              <button
                onClick={() => handleAction(onCropTool)}
                className="flex w-full items-center justify-between px-3 py-1 hover:bg-white/10 hover:text-white cursor-pointer transition-colors rounded-md mx-1"
              >
                <span className="flex items-center gap-2">
                  <Crop className="h-3.5 w-3.5" /> Crop Tool
                </span>
                <span className="text-[10px] text-gray-400">C</span>
              </button>
              <div className="my-1 border-t border-black" />
              <button
                onClick={() => handleAction(onAutoEnhance)}
                className="flex w-full items-center justify-between px-3 py-1 hover:bg-white/10 hover:text-white cursor-pointer transition-colors rounded-md mx-1"
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-amber-400" /> Auto Contrast / Brighten
                </span>
              </button>
              <button
                id="menu-image-grayscale-btn"
                onClick={() => handleAction(onConvertToGrayscale || (() => {}))}
                className="flex w-full items-center justify-between px-3 py-1 hover:bg-white/10 hover:text-white cursor-pointer transition-colors rounded-md mx-1"
              >
                <span className="flex items-center gap-2">
                  <Moon className="h-3.5 w-3.5 text-neutral-300" /> Grayscale (Luminance)
                </span>
                <span className="text-[10px] text-gray-400">Ctrl+Shift+U</span>
              </button>
              <button
                id="menu-image-sepia-btn"
                onClick={() => handleAction(onConvertToSepia || (() => {}))}
                className="flex w-full items-center justify-between px-3 py-1 hover:bg-white/10 hover:text-white cursor-pointer transition-colors rounded-md mx-1"
              >
                <span className="flex items-center gap-2">
                  <Film className="h-3.5 w-3.5 text-amber-500" /> Sepia Tone
                </span>
                <span className="text-[10px] text-gray-400">Pixel Transform</span>
              </button>
              <button
                id="menu-image-hue-btn"
                onClick={() => handleAction(onOpenHue || onOpenHueSaturation || (() => {}))}
                className="flex w-full items-center justify-between px-3 py-1 hover:bg-white/10 hover:text-white cursor-pointer transition-colors rounded-md mx-1"
              >
                <span className="flex items-center gap-2">
                  <Palette className="h-3.5 w-3.5 text-violet-400" /> Hue (Color Shift)...
                </span>
                <span className="text-[10px] text-gray-400">HSL Shift</span>
              </button>
              <button
                id="menu-image-huesat-btn"
                onClick={() => handleAction(onOpenHueSaturation || (() => {}))}
                className="flex w-full items-center justify-between px-3 py-1 hover:bg-white/10 hover:text-white cursor-pointer transition-colors rounded-md mx-1"
              >
                <span className="flex items-center gap-2">
                  <Palette className="h-3.5 w-3.5 text-emerald-400" /> Hue / Saturation...
                </span>
                <span className="text-[10px] text-gray-400">Ctrl+U</span>
              </button>
              <button
                id="menu-image-saturation-btn"
                onClick={() => handleAction(onOpenSaturation || onOpenHueSaturation || (() => {}))}
                className="flex w-full items-center justify-between px-3 py-1 hover:bg-white/10 hover:text-white cursor-pointer transition-colors rounded-md mx-1"
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-pink-400" /> Saturation (HSL)...
                </span>
                <span className="text-[10px] text-gray-400">Filter</span>
              </button>
              <button
                id="menu-image-noise-btn"
                onClick={() => handleAction(onOpenNoise || onOpenHueSaturation || (() => {}))}
                className="flex w-full items-center justify-between px-3 py-1 hover:bg-white/10 hover:text-white cursor-pointer transition-colors rounded-md mx-1"
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-purple-400" /> Add Noise...
                </span>
                <span className="text-[10px] text-gray-400">Filter</span>
              </button>
              <button
                id="menu-image-gaussian-blur-btn"
                onClick={() => handleAction(onOpenGaussianBlur || onOpenNoise || onOpenHueSaturation || (() => {}))}
                className="flex w-full items-center justify-between px-3 py-1 hover:bg-white/10 hover:text-white cursor-pointer transition-colors rounded-md mx-1"
              >
                <span className="flex items-center gap-2">
                  <Droplets className="h-3.5 w-3.5 text-blue-400" /> Gaussian Blur...
                </span>
                <span className="text-[10px] text-gray-400">Filter</span>
              </button>
              <div className="my-1 border-t border-black" />
              <button
                id="menu-image-ai-studio-btn"
                disabled={!AI_STUDIO_ENABLED}
                onClick={() => AI_STUDIO_ENABLED && handleAction(onOpenAIModal || (() => {}))}
                title={AI_STUDIO_ENABLED ? undefined : 'Coming soon'}
                className={
                  AI_STUDIO_ENABLED
                    ? 'flex w-full items-center justify-between px-3 py-1 hover:bg-[#3c3c3c] hover:text-amber-300 text-amber-200 cursor-pointer font-medium'
                    : 'flex w-full items-center justify-between px-3 py-1 text-gray-500 cursor-not-allowed font-medium opacity-60'
                }
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-gray-500" /> Create & Edit with Gemini AI...
                </span>
                <span className="flex items-center gap-1 text-[9px] font-mono text-gray-400 bg-white/5 px-1 py-0.5 rounded border border-white/10">
                  SOON
                </span>
              </button>
              <button
                onClick={() => handleAction(onInvertColors)}
                className="flex w-full items-center justify-between px-3 py-1 hover:bg-white/10 hover:text-white cursor-pointer transition-colors rounded-md mx-1"
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
            className={`rounded-md px-2.5 py-1 hover:bg-white/10 active:scale-95 transition-all cursor-pointer ${
              activeMenu === 'layer' ? 'bg-[#3c3c3c] text-white' : 'text-gray-300'
            }`}
          >
            Layer
          </button>
          {activeMenu === 'layer' && (
            <div className="absolute left-0 top-full mt-1 w-48 pl-window pl-menu-anim py-1.5 z-50 text-[11px]">
              <button
                onClick={() => handleAction(onNewLayer)}
                className="flex w-full items-center justify-between px-3 py-1 hover:bg-white/10 hover:text-white cursor-pointer transition-colors rounded-md mx-1"
              >
                <span className="flex items-center gap-2">
                  <Plus className="h-3.5 w-3.5" /> New Layer
                </span>
                <span className="text-[10px] text-gray-400">Shift+N</span>
              </button>
              <button
                onClick={() => handleAction(onDuplicateLayer)}
                className="flex w-full items-center justify-between px-3 py-1 hover:bg-white/10 hover:text-white cursor-pointer transition-colors rounded-md mx-1"
              >
                <span className="flex items-center gap-2">
                  <Copy className="h-3.5 w-3.5" /> Duplicate Layer
                </span>
                <span className="text-[10px] text-gray-400">Ctrl+J</span>
              </button>
              <div className="my-1 border-t border-black" />
              <button
                id="menu-layer-rotate-cw-btn"
                onClick={() => handleAction(onRotateCW || (() => {}))}
                className="flex w-full items-center justify-between px-3 py-1 hover:bg-white/10 hover:text-white cursor-pointer transition-colors rounded-md mx-1"
              >
                <span className="flex items-center gap-2">
                  <RotateCw className="h-3.5 w-3.5 text-cyan-400" /> Rotate 90° Clockwise
                </span>
                <span className="text-[10px] text-gray-400">+90°</span>
              </button>
              <button
                id="menu-layer-rotate-ccw-btn"
                onClick={() => handleAction(onRotateCCW || (() => {}))}
                className="flex w-full items-center justify-between px-3 py-1 hover:bg-white/10 hover:text-white cursor-pointer transition-colors rounded-md mx-1"
              >
                <span className="flex items-center gap-2">
                  <RotateCcw className="h-3.5 w-3.5 text-cyan-400" /> Rotate 90° Counter-CW
                </span>
                <span className="text-[10px] text-gray-400">-90°</span>
              </button>
              <button
                id="menu-layer-reset-rot-btn"
                onClick={() => handleAction(onResetRotation || (() => {}))}
                className="flex w-full items-center justify-between px-3 py-1 hover:bg-white/10 hover:text-white cursor-pointer transition-colors rounded-md mx-1"
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
            className={`rounded-md px-2.5 py-1 hover:bg-white/10 active:scale-95 transition-all cursor-pointer ${
              activeMenu === 'select' ? 'bg-[#3c3c3c] text-white' : 'text-gray-300'
            }`}
          >
            Select
          </button>
          {activeMenu === 'select' && (
            <div className="absolute left-0 top-full mt-1 w-44 pl-window pl-menu-anim py-1.5 z-50 text-[11px]">
              <button
                onClick={() => handleAction(onSelectAll)}
                className="flex w-full items-center justify-between px-3 py-1 hover:bg-white/10 hover:text-white cursor-pointer transition-colors rounded-md mx-1"
              >
                <span>Select All</span>
                <span className="text-[10px] text-gray-400">Ctrl+A</span>
              </button>
              <button
                onClick={() => handleAction(onDeselect)}
                className="flex w-full items-center justify-between px-3 py-1 hover:bg-white/10 hover:text-white cursor-pointer transition-colors rounded-md mx-1"
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
            className={`rounded-md px-2.5 py-1 hover:bg-white/10 active:scale-95 transition-all cursor-pointer ${
              activeMenu === 'view' ? 'bg-[#3c3c3c] text-white' : 'text-gray-300'
            }`}
          >
            View
          </button>
          {activeMenu === 'view' && (
            <div className="absolute left-0 top-full mt-1 w-44 pl-window pl-menu-anim py-1.5 z-50 text-[11px]">
              <button
                onClick={() => handleAction(onZoomIn)}
                className="flex w-full items-center justify-between px-3 py-1 hover:bg-white/10 hover:text-white cursor-pointer transition-colors rounded-md mx-1"
              >
                <span className="flex items-center gap-2">
                  <ZoomIn className="h-3.5 w-3.5" /> Zoom In
                </span>
                <span className="text-[10px] text-gray-400">Ctrl++</span>
              </button>
              <button
                onClick={() => handleAction(onZoomOut)}
                className="flex w-full items-center justify-between px-3 py-1 hover:bg-white/10 hover:text-white cursor-pointer transition-colors rounded-md mx-1"
              >
                <span className="flex items-center gap-2">
                  <ZoomOut className="h-3.5 w-3.5" /> Zoom Out
                </span>
                <span className="text-[10px] text-gray-400">Ctrl+-</span>
              </button>
              <button
                onClick={() => handleAction(onFitScreen)}
                className="flex w-full items-center justify-between px-3 py-1 hover:bg-white/10 hover:text-white cursor-pointer transition-colors rounded-md mx-1"
              >
                <span>Fit on Screen</span>
                <span className="text-[10px] text-gray-400">Ctrl+0</span>
              </button>
              <button
                onClick={() => handleAction(onZoom100)}
                className="flex w-full items-center justify-between px-3 py-1 hover:bg-white/10 hover:text-white cursor-pointer transition-colors rounded-md mx-1"
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
            className="rounded-md bg-white/5 px-2 py-1 text-[11px] text-gray-200 border border-white/10 hover:border-white/20 focus:border-blue-500 focus:outline-none w-36 transition-colors"
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
        <div className="flex items-center rounded-lg bg-white/5 p-0.5 border border-white/10">
          <button
            id="quick-undo-btn"
            disabled={!canUndo}
            onClick={onUndo}
            title="Undo (Ctrl+Z)"
            className="rounded-md p-1 text-gray-300 hover:bg-white/10 hover:text-white disabled:opacity-30 enabled:active:scale-90 cursor-pointer transition-all"
          >
            <RotateCcw className="h-3 w-3" />
          </button>
          <button
            id="quick-redo-btn"
            disabled={!canRedo}
            onClick={onRedo}
            title="Redo (Ctrl+Y)"
            className="rounded-md p-1 text-gray-300 hover:bg-white/10 hover:text-white disabled:opacity-30 enabled:active:scale-90 cursor-pointer transition-all"
          >
            <RotateCw className="h-3 w-3" />
          </button>
        </div>

        {/* Zoom display */}
        <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-lg px-1.5 py-1 text-[10px] text-gray-300 font-mono">
          <button onClick={onZoomOut} className="hover:text-white px-0.5 cursor-pointer">-</button>
          <span>{Math.round(zoom * 100)}%</span>
          <button onClick={onZoomIn} className="hover:text-white px-0.5 cursor-pointer">+</button>
        </div>

        {/* AI Image Studio Button (Pro Feature) — disabled until launch, see AI_STUDIO_ENABLED */}
        {onOpenAIModal && (
          <button
            id="quick-ai-btn"
            disabled={!AI_STUDIO_ENABLED}
            onClick={AI_STUDIO_ENABLED ? onOpenAIModal : undefined}
            className={
              AI_STUDIO_ENABLED
                ? 'flex items-center gap-1.5 rounded-lg bg-gradient-to-b from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 active:scale-95 px-2.5 py-1 font-bold text-black shadow-[0_1px_0_rgba(255,255,255,0.4)_inset,0_2px_6px_rgba(0,0,0,0.35)] transition-all border border-amber-700/60 text-[11px] cursor-pointer'
                : 'flex items-center gap-1.5 rounded-lg bg-white/[0.04] px-2.5 py-1 font-bold text-gray-500 border border-white/10 text-[11px] cursor-not-allowed opacity-60'
            }
            title={AI_STUDIO_ENABLED ? 'Create & Edit Images with Gemini AI (gemini-3.1-flash-image-preview)' : 'Coming soon'}
          >
            <Sparkles className={AI_STUDIO_ENABLED ? 'h-3 w-3 text-black' : 'h-3 w-3 text-gray-500'} />
            <span>AI Studio</span>
            <span className={AI_STUDIO_ENABLED ? 'rounded-full bg-black/20 px-1.5 py-0.5 text-[8px] font-mono uppercase tracking-wider' : 'rounded-full bg-white/5 px-1.5 py-0.5 text-[8px] font-mono uppercase tracking-wider'}>
              {AI_STUDIO_ENABLED ? 'PRO' : 'SOON'}
            </span>
          </button>
        )}

        {/* Pro Plan Status Badge — disabled until launch, see AI_STUDIO_ENABLED */}
        {onOpenProModal && (
          <button
            id="btn-pro-membership-badge"
            disabled={!AI_STUDIO_ENABLED}
            onClick={AI_STUDIO_ENABLED ? onOpenProModal : undefined}
            className={
              AI_STUDIO_ENABLED
                ? `flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-semibold border cursor-pointer active:scale-95 transition-all ${
                    isProUser
                      ? 'bg-amber-950/60 border-amber-500/40 text-amber-300 hover:bg-amber-900/70'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:text-amber-300 hover:border-amber-600/60'
                  }`
                : 'flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-semibold border border-white/10 bg-white/[0.04] text-gray-500 cursor-not-allowed opacity-60'
            }
            title={AI_STUDIO_ENABLED ? 'PhotoLite Pro Membership' : 'Coming soon'}
          >
            <Crown className={AI_STUDIO_ENABLED ? 'h-3 w-3 text-amber-400' : 'h-3 w-3 text-gray-500'} />
            <span>{AI_STUDIO_ENABLED ? (isProUser ? 'Pro Active' : 'Upgrade to Pro') : 'Coming Soon'}</span>
          </button>
        )}

        {/* Export Button */}
        <button
          id="quick-export-btn"
          onClick={onExportModal}
          className="flex items-center gap-1 rounded-lg bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 active:scale-95 px-2.5 py-1 font-medium text-white shadow-[0_1px_0_rgba(255,255,255,0.25)_inset,0_2px_6px_rgba(0,0,0,0.35)] transition-all border border-blue-800/60 text-[11px] cursor-pointer"
        >
          <Download className="h-3 w-3" />
          <span>Export</span>
        </button>

        {/* Sidebar Toggle button */}
        {onToggleSidebar && (
          <button
            id="toggle-sidebar-btn"
            onClick={onToggleSidebar}
            className={`p-1.5 rounded-lg active:scale-90 transition-all cursor-pointer border border-white/10 ${
              isSidebarOpen
                ? 'bg-white/10 text-cyan-400'
                : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
            }`}
            title={isSidebarOpen ? 'Hide Right Panels (Layers/History)' : 'Show Right Panels'}
          >
            <PanelRight className="h-3.5 w-3.5" />
          </button>
        )}

        {/* Help button */}
        <button
          onClick={() => setShowHelp(true)}
          className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 active:scale-90 cursor-pointer transition-all"
          title="Keyboard shortcuts & Help"
        >
          <HelpCircle className="h-3.5 w-3.5" />
        </button>

        {/* Profile menu — PhotoLite runs with the site's outer header hidden,
            so account access (credits, other apps, sign out) lives here
            instead, inside the app's own toolbar. */}
        <div className="ml-1 pl-1.5 border-l border-black">
          {authLoading ? (
            <div className="h-6 w-6 rounded-full bg-white/5 border border-black animate-pulse" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  id="photolite-profile-btn"
                  className="relative h-6 w-6 rounded-full overflow-hidden border border-white/15 hover:border-white/30 active:scale-90 transition-all cursor-pointer"
                  title="Account"
                >
                  <Avatar className="h-6 w-6">
                    <AvatarImage
                      src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.full_name || user.email || 'User')}&background=10b981&color=fff`}
                      alt={profile?.full_name || 'User'}
                    />
                    <AvatarFallback className="bg-emerald-600 text-white text-[9px]">
                      {profile?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="pl-window w-52 text-gray-200 text-[11px]" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-0.5">
                    <p className="text-xs font-bold text-white leading-none">
                      {profile?.full_name || user.email?.split('@')[0]}
                    </p>
                    <p className="text-[10px] leading-none text-gray-500">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem asChild className="focus:bg-white/10 cursor-pointer rounded-md">
                  <Link href="/learn" className="flex items-center">
                    <BookOpen className="mr-2 h-3.5 w-3.5 text-emerald-500" />
                    <span>Learn</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="focus:bg-white/10 cursor-pointer rounded-md">
                  <Link href="/teach" className="flex items-center">
                    <GraduationCap className="mr-2 h-3.5 w-3.5 text-emerald-500" />
                    <span>Teach</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="focus:bg-white/10 cursor-pointer rounded-md">
                  <Link href="/job-center" className="flex items-center">
                    <Briefcase className="mr-2 h-3.5 w-3.5 text-emerald-500" />
                    <span>Job Center</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="focus:bg-white/10 cursor-pointer rounded-md">
                  <Link href="/social/profile" className="flex items-center">
                    <UserIcon className="mr-2 h-3.5 w-3.5 text-emerald-500" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem className="cursor-default focus:bg-transparent">
                  <Wallet className="mr-2 h-3.5 w-3.5 text-emerald-500" />
                  <span>Credits: {profile?.wallet_balance || '0'}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-rose-400 focus:text-rose-300 focus:bg-rose-950/40">
                  <LogOut className="mr-2 h-3.5 w-3.5" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-2.5 py-1 text-[10px] font-semibold text-white border border-emerald-800/50 shadow-sm transition-colors cursor-pointer"
            >
              <LogIn className="h-3 w-3" />
              Sign In
            </Link>
          )}
        </div>
      </div>

      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pl-window-overlay p-4">
          <div className="pl-window pl-window-anim w-full max-w-md p-4 text-gray-200">
            <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="pl-traffic-lights" role="group" aria-label="Window controls">
                  <button type="button" onClick={() => setShowHelp(false)} className="pl-traffic-dot pl-dot-red" title="Close" />
                  <span className="pl-traffic-dot pl-dot-yellow" />
                  <span className="pl-traffic-dot pl-dot-green" />
                </div>
                <h3 className="font-semibold text-xs text-white flex items-center gap-2">
                  <HelpCircle className="h-3.5 w-3.5 text-blue-400" />
                  PhotoLite Shortcuts & Guide
                </h3>
              </div>
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
                className="rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs text-white hover:bg-blue-500 font-medium cursor-pointer border border-black/40 shadow-sm transition-colors"
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
