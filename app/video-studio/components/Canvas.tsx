import React, { useState, useRef, useEffect } from 'react';
import { Smartphone, Monitor, Square, RotateCw, Maximize2, Move, Sparkles } from 'lucide-react';
import { TextElement, Clip } from '../page';

export type AspectRatioType = '9:16' | '16:9' | '1:1';

interface CanvasProps {
  textElement: TextElement;
  setTextElement: React.Dispatch<React.SetStateAction<TextElement>>;
  activeTool: 'pointer' | 'hand';
  canvasZoom: number;
  setCanvasZoom: React.Dispatch<React.SetStateAction<number>>;
  isPlaying: boolean;
  currentTime: number;
  setCurrentTime: React.Dispatch<React.SetStateAction<number>>;
  videoSrc?: string;
  setDuration?: React.Dispatch<React.SetStateAction<number>>;
  clips?: Clip[];
}

export default function Canvas({
  textElement,
  setTextElement,
  activeTool,
  canvasZoom,
  setCanvasZoom,
  isPlaying,
  currentTime,
  setCurrentTime,
  videoSrc,
  setDuration,
  clips = []
}: CanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [aspectRatio, setAspectRatio] = useState<AspectRatioType>('9:16');
  
  const [isDragging, setIsDragging] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [initialPos, setInitialPos] = useState({ x: 0, y: 0 });
  const [initialRotation, setInitialRotation] = useState(0);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });

  // Find active video clip
  const activeVideoClip = clips.find(c => c.type === 'video' && currentTime >= c.start && currentTime < c.end);

  // Sync video playback with timeline state
  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying && activeVideoClip) {
        videoRef.current.play().catch(e => console.error("Video play failed:", e));
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying, activeVideoClip]);

  // Sync video time with timeline state
  useEffect(() => {
    if (videoRef.current && activeVideoClip) {
      const targetTime = (currentTime - activeVideoClip.start) + (activeVideoClip.mediaOffset || 0);
      if (Math.abs(videoRef.current.currentTime - targetTime) > 0.5) {
        videoRef.current.currentTime = targetTime;
      }
    }
  }, [currentTime, activeVideoClip]);

  const handleLoadedMetadata = () => {
    if (videoRef.current && setDuration) {
      setDuration(videoRef.current.duration);
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!containerRef.current) return;

    if (activeTool === 'hand') {
      setIsPanning(true);
      setDragStart({ x: e.clientX, y: e.clientY });
      setInitialPos({ x: panOffset.x, y: panOffset.y });
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      return;
    }

    e.stopPropagation();
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setInitialPos({ x: textElement.x, y: textElement.y });
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handleRotatePointerDown = (e: React.PointerEvent) => {
    if (activeTool === 'hand') return;
    e.stopPropagation();
    setIsRotating(true);

    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + (rect.width * textElement.x) / 100;
      const centerY = rect.top + (rect.height * textElement.y) / 100;

      const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
      setDragStart({ x: angle, y: 0 });
      setInitialRotation(textElement.rotation);
    }
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isPanning) {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      setPanOffset({
        x: initialPos.x + deltaX,
        y: initialPos.y + deltaY
      });
    } else if (isDragging && containerRef.current && activeTool === 'pointer') {
      const rect = containerRef.current.getBoundingClientRect();
      const deltaX = ((e.clientX - dragStart.x) / rect.width) * 100 / (canvasZoom / 100);
      const deltaY = ((e.clientY - dragStart.y) / rect.height) * 100 / (canvasZoom / 100);

      setTextElement(prev => ({
        ...prev,
        x: Math.max(5, Math.min(95, initialPos.x + deltaX)),
        y: Math.max(5, Math.min(95, initialPos.y + deltaY))
      }));
    } else if (isRotating && containerRef.current && activeTool === 'pointer') {
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + (rect.width * textElement.x) / 100;
      const centerY = rect.top + (rect.height * textElement.y) / 100;

      const currentAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
      const angleDiff = currentAngle - dragStart.x;

      setTextElement(prev => ({
        ...prev,
        rotation: initialRotation + (angleDiff * 180 / Math.PI)
      }));
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging || isRotating || isPanning) {
      setIsDragging(false);
      setIsRotating(false);
      setIsPanning(false);
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    }
  };

  const handleFitToScreen = () => {
    setCanvasZoom(100);
    setPanOffset({ x: 0, y: 0 });
  };

  const getAnimationClass = () => {
    switch (textElement.animation) {
      case 'fade-in': return 'animate-fade-in';
      case 'slide-up': return 'animate-slide-up';
      case 'slide-down': return 'animate-slide-down';
      case 'slide-left': return 'animate-slide-left';
      case 'slide-right': return 'animate-slide-right';
      case 'zoom-in': return 'animate-zoom-in';
      case 'zoom-out': return 'animate-zoom-out';
      case 'bounce': return 'animate-bounce-custom';
      case 'spin': return 'animate-spin-custom';
      default: return '';
    }
  };

  // Dimensions based on aspect ratio
  const getAspectRatioStyle = () => {
    switch (aspectRatio) {
      case '16:9':
        return {
          aspectRatio: '16/9',
          width: '88%',
          maxWidth: '820px',
          maxHeight: '85%'
        };
      case '1:1':
        return {
          aspectRatio: '1/1',
          height: '80%',
          maxHeight: '520px',
          maxWidth: '520px'
        };
      case '9:16':
      default:
        return {
          aspectRatio: '9/16',
          height: '88%',
          maxHeight: '100%',
          maxWidth: '100%'
        };
    }
  };

  const getResolutionBadge = () => {
    switch (aspectRatio) {
      case '16:9': return '1920 × 1080 • YouTube';
      case '1:1': return '1080 × 1080 • Square';
      case '9:16':
      default: return '1080 × 1920 • Reels / Shorts';
    }
  };

  return (
    <div
      className={`flex-1 relative flex items-center justify-center overflow-hidden bg-[#07080c] select-none ${
        activeTool === 'hand' ? (isPanning ? 'cursor-grabbing' : 'cursor-grab') : ''
      }`}
      style={{
        backgroundImage: `
          radial-gradient(circle at center, rgba(16, 185, 129, 0.03) 0%, rgba(9, 11, 16, 0.95) 100%),
          radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px)
        `,
        backgroundSize: '100% 100%, 24px 24px'
      }}
      onPointerDown={activeTool === 'hand' ? handlePointerDown : undefined}
      onPointerMove={activeTool === 'hand' ? handlePointerMove : undefined}
      onPointerUp={activeTool === 'hand' ? handlePointerUp : undefined}
      onPointerCancel={activeTool === 'hand' ? handlePointerUp : undefined}
    >
      {/* ------------------------------------------------------------- */}
      {/* TOP FLOATING CONTROLS: ASPECT RATIO SWITCHER & RESOLUTION */}
      {/* ------------------------------------------------------------- */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
        {/* Aspect Ratio Segmented Pill */}
        <div className="bg-[#0f121a]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-1 flex items-center gap-1 shadow-2xl">
          <button
            type="button"
            onClick={() => setAspectRatio('9:16')}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              aspectRatio === '9:16'
                ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-extrabold shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
            title="9:16 Vertical (Reels, TikTok, Shorts)"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>9:16</span>
          </button>

          <button
            type="button"
            onClick={() => setAspectRatio('16:9')}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              aspectRatio === '16:9'
                ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-extrabold shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
            title="16:9 Landscape (YouTube, Cinema)"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>16:9</span>
          </button>

          <button
            type="button"
            onClick={() => setAspectRatio('1:1')}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              aspectRatio === '1:1'
                ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-extrabold shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
            title="1:1 Square (Instagram Posts)"
          >
            <Square className="w-3.5 h-3.5" />
            <span>1:1</span>
          </button>
        </div>

        {/* Resolution Badge */}
        <div className="hidden sm:flex items-center gap-2 bg-[#0f121a]/80 backdrop-blur-xl border border-white/10 px-3 py-1.5 rounded-2xl text-[11px] font-mono text-slate-300 shadow-xl">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>{getResolutionBadge()}</span>
        </div>

        {/* Fit to Screen Action */}
        <button
          type="button"
          onClick={handleFitToScreen}
          className="p-2 rounded-2xl bg-[#0f121a]/80 backdrop-blur-xl hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-all shadow-xl"
          title="Reset Zoom & Fit to Screen"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* VIDEO PREVIEW VIEWPORT AREA */}
      {/* ------------------------------------------------------------- */}
      <div
        className="relative w-full h-full flex items-center justify-center p-8 transition-transform duration-200 ease-out"
        style={{
          transform: `scale(${canvasZoom / 100}) translate(${panOffset.x / (canvasZoom / 100)}px, ${panOffset.y / (canvasZoom / 100)}px)`
        }}
      >
        <div
          ref={containerRef}
          className="relative bg-black rounded-2xl overflow-hidden shadow-[0_20px_70px_rgba(0,0,0,0.85)] ring-1 ring-white/15 transition-all duration-300"
          style={getAspectRatioStyle()}
        >
          {/* Main Video Stream */}
          <video
            ref={videoRef}
            src={videoSrc || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"}
            className={`w-full h-full object-cover pointer-events-none select-none transition-opacity duration-300 ${
              activeVideoClip ? 'opacity-100' : 'opacity-10'
            }`}
            style={activeVideoClip ? {
              filter: `
                blur(${activeVideoClip.blur ?? 0}px)
                brightness(${activeVideoClip.brightness ?? 100}%)
                contrast(${activeVideoClip.contrast ?? 100}%)
                saturate(${activeVideoClip.saturation ?? 100}%)
                hue-rotate(${activeVideoClip.hueRotate ?? 0}deg)
                sepia(${activeVideoClip.sepia ?? 0}%)
                grayscale(${activeVideoClip.grayscale ?? 0}%)
              `,
              transform: `scale(${(activeVideoClip.scaleX ?? 100) / 100}, ${(activeVideoClip.scaleY ?? 100) / 100}) rotate(${activeVideoClip.rotation ?? 0}deg)`
            } : {}}
            onLoadedMetadata={handleLoadedMetadata}
            muted
            playsInline
          />

          {/* Idle Placeholder when no active video clip */}
          {!activeVideoClip && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-b from-[#0b0d14]/90 to-black/95 text-slate-400 p-6 text-center pointer-events-none">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300">
                <Sparkles className="w-6 h-6 text-emerald-400" />
              </div>
              <p className="text-sm font-bold text-white">Timeline Position Idle</p>
              <p className="text-xs text-slate-500 max-w-xs">
                Move playhead over a video clip or add media to preview.
              </p>
            </div>
          )}

          {/* Text Overlay Layer */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div
              className="absolute pointer-events-auto cursor-move group select-none"
              style={{
                left: `${textElement.x}%`,
                top: `${textElement.y}%`,
                transform: `translate(-50%, -50%) rotate(${textElement.rotation}deg) scale(${textElement.scale / 100})`,
                opacity: textElement.opacity / 100,
              }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
            >
              {/* Celoris Modern Bounding Box with Cyan & Emerald accents */}
              <div className="absolute -inset-2.5 border-2 border-emerald-400/80 rounded-lg hidden group-hover:block pointer-events-none shadow-[0_0_12px_rgba(52,211,153,0.4)]">
                {/* 4 Corner resize handles */}
                <div className="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 bg-white border-2 border-emerald-500 rounded-full pointer-events-auto cursor-nwse-resize shadow-md" />
                <div className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-white border-2 border-emerald-500 rounded-full pointer-events-auto cursor-nesw-resize shadow-md" />
                <div className="absolute -bottom-1.5 -left-1.5 w-3.5 h-3.5 bg-white border-2 border-emerald-500 rounded-full pointer-events-auto cursor-swne-resize shadow-md" />
                <div className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 bg-white border-2 border-emerald-500 rounded-full pointer-events-auto cursor-nwse-resize shadow-md" />

                {/* Connecting stem line */}
                <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 w-0.5 h-4 bg-emerald-400" />

                {/* Rotate handle knob */}
                <div
                  className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-6 h-6 bg-white hover:bg-emerald-400 border border-emerald-500 rounded-full flex items-center justify-center shadow-lg cursor-grab active:cursor-grabbing text-black pointer-events-auto transition-colors"
                  onPointerDown={handleRotatePointerDown}
                  title="Rotate Title"
                >
                  <RotateCw className="w-3 h-3 pointer-events-none" />
                </div>
              </div>

              {/* Rendered Text Element */}
              <h1
                className={`font-bold whitespace-nowrap px-2 select-none ${getAnimationClass()}`}
                style={{
                  fontFamily: textElement.fontFamily,
                  fontSize: `${textElement.fontSize / 3}px`,
                  color: textElement.fill,
                  fontWeight: textElement.isBold ? 'bold' : 'normal',
                  fontStyle: textElement.isItalic ? 'italic' : 'normal',
                  textDecoration: textElement.isUnderline ? 'underline' : 'none',
                  WebkitTextStroke: textElement.hasStroke ? `${textElement.strokeWidth}px ${textElement.strokeColor}` : undefined,
                  backgroundColor: textElement.hasBackground ? textElement.backgroundColor : undefined,
                  padding: textElement.hasBackground ? `${textElement.backgroundPadding}px` : undefined,
                  borderRadius: textElement.hasBackground ? `${textElement.backgroundRadius}px` : undefined,
                  textShadow: textElement.hasShadow ? `${textElement.shadowOffsetX}px ${textElement.shadowOffsetY}px ${textElement.shadowBlur}px ${textElement.shadowColor}` : undefined,
                }}
              >
                {textElement.text}
              </h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
