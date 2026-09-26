import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Trash2, 
  SplitSquareVertical, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Plus, 
  Minus, 
  Type, 
  Music, 
  Copy, 
  Video as VideoIcon, 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock, 
  Magnet, 
  SkipBack, 
  SkipForward 
} from 'lucide-react';
import { Clip } from '../page';

interface TimelineProps {
  isPlaying: boolean;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  currentTime: number;
  setCurrentTime: React.Dispatch<React.SetStateAction<number>>;
  duration: number;
  setDuration: React.Dispatch<React.SetStateAction<number>>;
  videoName?: string;
  clips: Clip[];
  setClips: React.Dispatch<React.SetStateAction<Clip[]>>;
  selectedClipId: string | null;
  setSelectedClipId: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function Timeline({
  isPlaying,
  setIsPlaying,
  currentTime,
  setCurrentTime,
  duration,
  setDuration,
  videoName,
  clips,
  setClips,
  selectedClipId,
  setSelectedClipId
}: TimelineProps) {
  const [zoom, setZoom] = useState(12); // pixels per second
  const [isSnapping, setIsSnapping] = useState(true);

  // Track lock & visibility toggles
  const [trackLocks, setTrackLocks] = useState<Record<number, boolean>>({ 0: false, 1: false, 2: false });
  const [trackMuted, setTrackMuted] = useState<Record<number, boolean>>({ 0: false, 1: false, 2: false });

  const timelineRef = useRef<HTMLDivElement>(null);

  // Update video clip when duration or name changes
  useEffect(() => {
    setClips(prev => prev.map(c => {
      if (c.type === 'video') {
        return { ...c, end: duration, content: videoName || c.content };
      }
      return c;
    }));
  }, [duration, videoName, setClips]);

  // Playback timer loop
  useEffect(() => {
    let interval: number;
    if (isPlaying) {
      interval = window.setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            setIsPlaying(false);
            return duration;
          }
          return prev + 0.1;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration, setCurrentTime, setIsPlaying]);

  // Format time (seconds to HH:MM:SS:FF)
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    const frames = Math.floor((seconds % 1) * 30);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}:${frames.toString().padStart(2, '0')}`;
  };

  // Playhead scrubber click & drag
  const handleTimelineClick = (e: React.MouseEvent) => {
    if (!timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left + timelineRef.current.scrollLeft;
    const newTime = Math.max(0, Math.min(duration, x / zoom));
    setCurrentTime(newTime);
  };

  // Clip dragging state
  const [draggingClip, setDraggingClip] = useState<{ id: string; startX: number; initialStart: number } | null>(null);
  const [resizingClip, setResizingClip] = useState<{ 
    id: string; 
    edge: 'left' | 'right'; 
    startX: number; 
    initialStart: number; 
    initialEnd: number; 
    initialMediaOffset: number 
  } | null>(null);

  const handlePointerDownClip = (e: React.PointerEvent, clip: Clip) => {
    if (trackLocks[clip.trackIndex]) return;
    e.stopPropagation();
    setSelectedClipId(clip.id);
    setDraggingClip({ id: clip.id, startX: e.clientX, initialStart: clip.start });
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerDownResize = (e: React.PointerEvent, clip: Clip, edge: 'left' | 'right') => {
    if (trackLocks[clip.trackIndex]) return;
    e.stopPropagation();
    setSelectedClipId(clip.id);
    setResizingClip({ 
      id: clip.id, 
      edge, 
      startX: e.clientX, 
      initialStart: clip.start, 
      initialEnd: clip.end, 
      initialMediaOffset: clip.mediaOffset || 0 
    });
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (draggingClip || resizingClip) {
      const SNAP_THRESHOLD_PX = isSnapping ? 12 : 0;
      const snapThresholdTime = SNAP_THRESHOLD_PX / zoom;

      const snapTargets = [0, currentTime];
      clips.forEach(c => {
        if (draggingClip && c.id !== draggingClip.id) {
          snapTargets.push(c.start, c.end);
        }
        if (resizingClip && c.id !== resizingClip.id) {
          snapTargets.push(c.start, c.end);
        }
      });

      const findClosestSnap = (time: number) => {
        if (!isSnapping) return time;
        let closest = time;
        let minDiff = snapThresholdTime;
        for (const target of snapTargets) {
          const diff = Math.abs(target - time);
          if (diff < minDiff) {
            minDiff = diff;
            closest = target;
          }
        }
        return closest;
      };

      if (draggingClip) {
        const deltaX = e.clientX - draggingClip.startX;
        const deltaT = deltaX / zoom;
        setClips(clips.map(c => {
          if (c.id === draggingClip.id) {
            const clipDur = c.end - c.start;
            let newStart = draggingClip.initialStart + deltaT;

            let snappedStart = findClosestSnap(newStart);
            if (snappedStart !== newStart) {
              newStart = snappedStart;
            } else {
              let snappedEnd = findClosestSnap(newStart + clipDur);
              if (snappedEnd !== newStart + clipDur) {
                newStart = snappedEnd - clipDur;
              }
            }

            newStart = Math.max(0, newStart);
            return { ...c, start: newStart, end: newStart + clipDur };
          }
          return c;
        }));
      } else if (resizingClip) {
        const deltaX = e.clientX - resizingClip.startX;
        const deltaT = deltaX / zoom;
        setClips(clips.map(c => {
          if (c.id === resizingClip.id) {
            if (resizingClip.edge === 'left') {
              let newStart = resizingClip.initialStart + deltaT;
              newStart = findClosestSnap(newStart);

              let newMediaOffset = resizingClip.initialMediaOffset + (newStart - resizingClip.initialStart);
              if (newMediaOffset < 0) {
                newStart -= newMediaOffset;
                newMediaOffset = 0;
              }

              newStart = Math.max(0, Math.min(newStart, c.end - 1)); // Min 1s
              newMediaOffset = resizingClip.initialMediaOffset + (newStart - resizingClip.initialStart);

              return { ...c, start: newStart, mediaOffset: newMediaOffset };
            } else {
              let newEnd = resizingClip.initialEnd + deltaT;
              newEnd = findClosestSnap(newEnd);
              newEnd = Math.max(c.start + 1, newEnd); // Min 1s
              return { ...c, end: newEnd };
            }
          }
          return c;
        }));
      }
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (draggingClip || resizingClip) {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      setDraggingClip(null);
      setResizingClip(null);
    }
  };

  const deleteSelected = () => {
    if (selectedClipId) {
      setClips(clips.filter(c => c.id !== selectedClipId));
      setSelectedClipId(null);
    }
  };

  const splitSelected = () => {
    if (selectedClipId) {
      const clipToSplit = clips.find(c => c.id === selectedClipId);
      if (clipToSplit && currentTime > clipToSplit.start && currentTime < clipToSplit.end) {
        const newClip1 = { ...clipToSplit, end: currentTime };
        const newClip2 = {
          ...clipToSplit,
          id: `clip-${Date.now()}`,
          start: currentTime,
          transition: undefined,
          mediaOffset: (clipToSplit.mediaOffset || 0) + (currentTime - clipToSplit.start)
        };

        setClips(clips.map(c => c.id === selectedClipId ? newClip1 : c).concat(newClip2));
      }
    }
  };

  const duplicateSelected = () => {
    if (selectedClipId) {
      const clipToDuplicate = clips.find(c => c.id === selectedClipId);
      if (clipToDuplicate) {
        const clipDur = clipToDuplicate.end - clipToDuplicate.start;
        const newClip = {
          ...clipToDuplicate,
          id: `clip-${Date.now()}`,
          start: clipToDuplicate.end,
          end: clipToDuplicate.end + clipDur,
          transition: undefined
        };
        setClips([...clips, newClip]);
        setSelectedClipId(newClip.id);
      }
    }
  };

  // Keyboard shortcut listeners (Space, Del, S)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying(prev => !prev);
      } else if (e.code === 'Delete' || e.code === 'Backspace') {
        deleteSelected();
      } else if (e.key === 's' || e.key === 'S') {
        splitSelected();
      } else if (e.key === 'd' || e.key === 'D') {
        duplicateSelected();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  // Generate ruler markers every 5s or 10s
  const step = zoom > 20 ? 2 : zoom > 10 ? 5 : 10;
  const markers = [];
  for (let i = 0; i <= duration; i += step) {
    markers.push(i);
  }

  return (
    <div className="h-[290px] bg-[#090b10] border-t border-white/[0.08] flex flex-col shrink-0 select-none shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
      
      {/* ------------------------------------------------------------- */}
      {/* 1. TIMELINE TOOLBAR */}
      {/* ------------------------------------------------------------- */}
      <div className="h-11 border-b border-white/[0.08] bg-[#0c0e15] flex items-center justify-between px-4 shrink-0">
        
        {/* Left Editing Tools */}
        <div className="flex items-center gap-1.5">
          {/* Split Tool */}
          <button
            type="button"
            onClick={splitSelected}
            disabled={!selectedClipId || !clips.find(c => c.id === selectedClipId && currentTime > c.start && currentTime < c.end)}
            title="Split Clip at Playhead (S)"
            className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/5 hover:border-white/15 text-slate-300 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 shadow-xs"
          >
            <SplitSquareVertical className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[11px] font-semibold hidden md:inline">Split</span>
            <kbd className="hidden lg:inline text-[9px] font-mono text-slate-500 bg-white/5 px-1 rounded">S</kbd>
          </button>

          {/* Duplicate Tool */}
          <button
            type="button"
            onClick={duplicateSelected}
            disabled={!selectedClipId}
            title="Duplicate Selected Clip (D)"
            className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/5 hover:border-white/15 text-slate-300 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 shadow-xs"
          >
            <Copy className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[11px] font-semibold hidden md:inline">Duplicate</span>
            <kbd className="hidden lg:inline text-[9px] font-mono text-slate-500 bg-white/5 px-1 rounded">D</kbd>
          </button>

          {/* Delete Tool */}
          <button
            type="button"
            onClick={deleteSelected}
            disabled={!selectedClipId}
            title="Delete Selected Clip (Del)"
            className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-rose-500/20 border border-white/5 hover:border-rose-500/30 text-slate-300 hover:text-rose-400 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 shadow-xs"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="text-[11px] font-semibold hidden md:inline">Delete</span>
            <kbd className="hidden lg:inline text-[9px] font-mono text-slate-500 bg-white/5 px-1 rounded">Del</kbd>
          </button>

          <div className="h-4 w-px bg-white/10 mx-1 hidden sm:block" />

          {/* Magnet / Snap toggle */}
          <button
            type="button"
            onClick={() => setIsSnapping(!isSnapping)}
            title={`Magnetic Snapping: ${isSnapping ? 'ON' : 'OFF'}`}
            className={`p-1.5 rounded-lg transition-all flex items-center gap-1 ${
              isSnapping 
                ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shadow-xs' 
                : 'text-slate-500 hover:text-slate-300 bg-white/[0.02]'
            }`}
          >
            <Magnet className="w-3.5 h-3.5" />
            <span className="text-[10px] font-mono font-bold hidden sm:inline">{isSnapping ? 'Snap ON' : 'Snap OFF'}</span>
          </button>
        </div>

        {/* Center Transport & Timecode Readout */}
        <div className="flex items-center gap-3">
          {/* Jump to start */}
          <button
            type="button"
            onClick={() => setCurrentTime(0)}
            className="p-1 text-slate-400 hover:text-white transition-colors"
            title="Jump to Start"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          {/* Play / Pause Master Button */}
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-8 h-8 flex items-center justify-center bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-extrabold rounded-full transition-all shadow-[0_0_15px_rgba(52,211,153,0.4)] active:scale-95"
            title={isPlaying ? "Pause (Space)" : "Play (Space)"}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-black" />
            ) : (
              <Play className="w-4 h-4 fill-black ml-0.5" />
            )}
          </button>

          {/* Jump to end */}
          <button
            type="button"
            onClick={() => setCurrentTime(duration)}
            className="p-1 text-slate-400 hover:text-white transition-colors"
            title="Jump to End"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          {/* Digital Timecode */}
          <div className="hidden sm:flex items-center bg-[#131620] border border-white/10 rounded-xl px-2.5 py-1 text-xs font-mono font-bold text-slate-200 shadow-inner">
            <span className="text-emerald-400">{formatTime(currentTime)}</span>
            <span className="text-slate-600 mx-1.5">/</span>
            <span className="text-slate-400">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Right Zoom Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-[#131620] border border-white/10 rounded-xl px-2 py-1 shadow-inner">
            <button
              type="button"
              onClick={() => setZoom(Math.max(4, zoom - 2))}
              className="p-0.5 text-slate-400 hover:text-white transition-colors"
              title="Zoom Out"
            >
              <Minus className="w-3 h-3" />
            </button>
            <input
              type="range"
              min="4"
              max="40"
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-16 sm:w-20 h-1 bg-white/15 rounded-full appearance-none accent-emerald-400 cursor-pointer"
            />
            <button
              type="button"
              onClick={() => setZoom(Math.min(40, zoom + 2))}
              className="p-0.5 text-slate-400 hover:text-white transition-colors"
              title="Zoom In"
            >
              <Plus className="w-3 h-3" />
            </button>
            <span className="text-[10px] font-mono text-slate-400 w-7 text-right">
              {Math.round((zoom / 12) * 100)}%
            </span>
          </div>

          <button
            type="button"
            onClick={() => setZoom(12)}
            className="p-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/5 text-slate-400 hover:text-white transition-colors"
            title="Reset Timeline Zoom"
          >
            <Maximize className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. TIMELINE TRACKS AREA */}
      {/* ------------------------------------------------------------- */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Track Headers Column (Left) */}
        <div className="w-40 sm:w-44 bg-[#0a0c12] border-r border-white/[0.08] flex flex-col pt-7 shrink-0 z-20 shadow-lg">
          
          {/* Track 0 Header: Text */}
          <div className="h-10 px-3 border-b border-white/[0.04] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.6)]" />
              <div className="flex items-center gap-1.5 font-bold text-slate-200 truncate">
                <Type className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="text-[11px] truncate">Titles & Text</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-slate-500">
              <button
                type="button"
                onClick={() => setTrackLocks(prev => ({ ...prev, 0: !prev[0] }))}
                className={`p-1 rounded hover:text-white transition-colors ${trackLocks[0] ? 'text-rose-400' : ''}`}
                title={trackLocks[0] ? "Unlock Track" : "Lock Track"}
              >
                {trackLocks[0] ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
              </button>
            </div>
          </div>

          {/* Track 1 Header: Video */}
          <div className="h-14 px-3 border-b border-white/[0.04] flex items-center justify-between text-xs bg-white/[0.01]">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]" />
              <div className="flex items-center gap-1.5 font-bold text-slate-200 truncate">
                <VideoIcon className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="text-[11px] truncate">V1 Video Main</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-slate-500">
              <button
                type="button"
                onClick={() => setTrackLocks(prev => ({ ...prev, 1: !prev[1] }))}
                className={`p-1 rounded hover:text-white transition-colors ${trackLocks[1] ? 'text-rose-400' : ''}`}
                title={trackLocks[1] ? "Unlock Track" : "Lock Track"}
              >
                {trackLocks[1] ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
              </button>
            </div>
          </div>

          {/* Track 2 Header: Audio */}
          <div className="h-10 px-3 border-b border-white/[0.04] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(6,182,212,0.6)]" />
              <div className="flex items-center gap-1.5 font-bold text-slate-200 truncate">
                <Music className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="text-[11px] truncate">A1 Sound & BGM</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-slate-500">
              <button
                type="button"
                onClick={() => setTrackMuted(prev => ({ ...prev, 2: !prev[2] }))}
                className={`p-1 rounded hover:text-white transition-colors ${trackMuted[2] ? 'text-rose-400' : ''}`}
                title={trackMuted[2] ? "Unmute Track" : "Mute Track"}
              >
                {trackMuted[2] ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
              </button>
              <button
                type="button"
                onClick={() => setTrackLocks(prev => ({ ...prev, 2: !prev[2] }))}
                className={`p-1 rounded hover:text-white transition-colors ${trackLocks[2] ? 'text-rose-400' : ''}`}
                title={trackLocks[2] ? "Unlock Track" : "Lock Track"}
              >
                {trackLocks[2] ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
              </button>
            </div>
          </div>

        </div>

        {/* Tracks Content Viewport (Right) */}
        <div
          ref={timelineRef}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          className="flex-1 overflow-x-auto overflow-y-hidden relative bg-[#07080d] custom-scrollbar"
        >
          <div className="min-w-full relative" style={{ width: `${Math.max(duration * zoom, 1200)}px`, height: '100%' }}>
            
            {/* Time Ruler Bar */}
            <div
              onClick={handleTimelineClick}
              className="h-7 border-b border-white/[0.08] relative sticky top-0 bg-[#0c0e15] z-10 cursor-pointer"
            >
              {markers.map(m => (
                <div
                  key={m}
                  className="absolute top-0 text-[10px] text-slate-400 font-mono flex flex-col items-center pointer-events-none"
                  style={{ left: `${m * zoom}px`, transform: 'translateX(-50%)' }}
                >
                  <span className="mt-0.5">{formatTime(m).substring(3)}</span>
                  <div className="w-px h-2 bg-slate-600 mt-0.5" />
                </div>
              ))}
            </div>

            {/* Glowing Laser Playhead */}
            <div
              className="absolute top-0 bottom-0 w-[2px] bg-gradient-to-b from-cyan-400 via-emerald-400 to-cyan-500 z-30 pointer-events-none shadow-[0_0_10px_rgba(6,182,212,0.8)]"
              style={{ left: `${currentTime * zoom}px` }}
            >
              {/* Playhead triangular handle */}
              <div className="absolute -top-1 -left-[5px] w-3 h-3.5 bg-gradient-to-br from-cyan-300 to-emerald-400 rounded-sm transform rotate-45 shadow-[0_0_8px_rgba(6,182,212,0.9)]" />
            </div>

            {/* Tracks Container */}
            <div className="absolute top-7 left-0 right-0 bottom-0 flex flex-col">
              
              {/* Track 0: Text Clips */}
              <div className="h-10 relative w-full border-b border-white/[0.04] bg-white/[0.015]">
                {clips.filter(c => c.trackIndex === 0).map(clip => {
                  const isSelected = selectedClipId === clip.id;
                  const clipWidth = Math.max(30, (clip.end - clip.start) * zoom);
                  return (
                    <div
                      key={clip.id}
                      onPointerDown={(e) => handlePointerDownClip(e, clip)}
                      className={`absolute top-1 bottom-1 rounded-xl flex items-center px-2.5 text-xs font-semibold text-white shadow-md cursor-pointer transition-all overflow-hidden ${
                        isSelected
                          ? 'ring-2 ring-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.5)] z-20 brightness-110'
                          : 'hover:brightness-110 opacity-95'
                      }`}
                      style={{
                        left: `${clip.start * zoom}px`,
                        width: `${clipWidth}px`,
                        background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
                        border: '1px solid rgba(251, 191, 36, 0.4)'
                      }}
                    >
                      <Type className="w-3 h-3 mr-1.5 text-amber-200 shrink-0" />
                      <span className="truncate text-[11px] font-bold">{clip.content}</span>

                      {/* Transition diamond indicator */}
                      {clip.transition && (
                        <div className="absolute left-0 top-0 bottom-0 w-4 bg-black/40 flex items-center justify-center z-10 border-r border-white/20">
                          <div className="w-2 h-2 rotate-45 bg-amber-300 shadow-xs" />
                        </div>
                      )}

                      {/* Resize handles */}
                      {isSelected && !trackLocks[0] && (
                        <>
                          <div
                            onPointerDown={(e) => handlePointerDownResize(e, clip, 'left')}
                            className="absolute left-0 top-0 bottom-0 w-2.5 bg-white/70 hover:bg-white rounded-l cursor-ew-resize flex items-center justify-center"
                          >
                            <div className="w-0.5 h-3 bg-black/50 rounded-full" />
                          </div>
                          <div
                            onPointerDown={(e) => handlePointerDownResize(e, clip, 'right')}
                            className="absolute right-0 top-0 bottom-0 w-2.5 bg-white/70 hover:bg-white rounded-r cursor-ew-resize flex items-center justify-center"
                          >
                            <div className="w-0.5 h-3 bg-black/50 rounded-full" />
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Track 1: Video Clips */}
              <div className="h-14 relative w-full border-b border-white/[0.04] bg-white/[0.025]">
                {clips.filter(c => c.trackIndex === 1).map(clip => {
                  const isSelected = selectedClipId === clip.id;
                  const clipWidth = Math.max(40, (clip.end - clip.start) * zoom);
                  const framesCount = Math.max(1, Math.ceil((clip.end - clip.start) / 12));
                  return (
                    <div
                      key={clip.id}
                      onPointerDown={(e) => handlePointerDownClip(e, clip)}
                      className={`absolute top-1 bottom-1 rounded-xl flex items-center overflow-hidden cursor-pointer shadow-lg transition-all ${
                        isSelected
                          ? 'ring-2 ring-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.5)] z-20 brightness-110'
                          : 'hover:brightness-105 opacity-95'
                      }`}
                      style={{
                        left: `${clip.start * zoom}px`,
                        width: `${clipWidth}px`,
                        background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)',
                        border: '1px solid rgba(52, 211, 153, 0.4)'
                      }}
                    >
                      {/* Filmstrip thumbnails */}
                      <div className="flex w-full h-full opacity-40 mix-blend-screen pointer-events-none">
                        {[...Array(framesCount)].map((_, i) => (
                          <img
                            key={i}
                            src={`https://picsum.photos/seed/cut${i}/90/60`}
                            className="h-full w-[80px] object-cover shrink-0 border-r border-black/40"
                            alt=""
                          />
                        ))}
                      </div>

                      {/* Title & Duration Overlay */}
                      <div className="absolute left-2.5 top-1.5 flex items-center gap-1.5 z-10 pointer-events-none">
                        <VideoIcon className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                        <span className="text-[11px] font-black text-white truncate max-w-[200px]">
                          {clip.content}
                        </span>
                        <span className="text-[9.5px] font-mono text-emerald-300/80 bg-black/40 px-1 rounded">
                          {(clip.end - clip.start).toFixed(1)}s
                        </span>
                      </div>

                      {/* Transition Badge */}
                      {clip.transition && (
                        <div className="absolute left-0 top-0 bottom-0 w-4 bg-black/50 flex items-center justify-center z-10 border-r border-white/20">
                          <div className="w-2 h-2 rotate-45 bg-emerald-400 shadow-xs" />
                        </div>
                      )}

                      {/* Resize handles */}
                      {isSelected && !trackLocks[1] && (
                        <>
                          <div
                            onPointerDown={(e) => handlePointerDownResize(e, clip, 'left')}
                            className="absolute left-0 top-0 bottom-0 w-2.5 bg-white/70 hover:bg-white rounded-l cursor-ew-resize flex items-center justify-center z-20"
                          >
                            <div className="w-0.5 h-4 bg-black/50 rounded-full" />
                          </div>
                          <div
                            onPointerDown={(e) => handlePointerDownResize(e, clip, 'right')}
                            className="absolute right-0 top-0 bottom-0 w-2.5 bg-white/70 hover:bg-white rounded-r cursor-ew-resize flex items-center justify-center z-20"
                          >
                            <div className="w-0.5 h-4 bg-black/50 rounded-full" />
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Track 2: Audio Clips */}
              <div className="h-10 relative w-full border-b border-white/[0.04] bg-white/[0.015]">
                {clips.filter(c => c.trackIndex === 2).map(clip => {
                  const isSelected = selectedClipId === clip.id;
                  const clipWidth = Math.max(30, (clip.end - clip.start) * zoom);
                  const waveBars = Math.max(10, Math.ceil((clip.end - clip.start) * 3));
                  return (
                    <div
                      key={clip.id}
                      onPointerDown={(e) => handlePointerDownClip(e, clip)}
                      className={`absolute top-1 bottom-1 rounded-xl flex items-center px-2.5 text-xs font-semibold text-white shadow-md cursor-pointer transition-all overflow-hidden ${
                        isSelected
                          ? 'ring-2 ring-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.5)] z-20 brightness-110'
                          : 'hover:brightness-110 opacity-95'
                      }`}
                      style={{
                        left: `${clip.start * zoom}px`,
                        width: `${clipWidth}px`,
                        background: 'linear-gradient(135deg, #0e7490 0%, #155e75 100%)',
                        border: '1px solid rgba(6, 182, 212, 0.4)'
                      }}
                    >
                      <Music className="w-3 h-3 mr-1.5 text-cyan-200 shrink-0 z-10" />
                      <span className="truncate text-[11px] font-bold z-10">{clip.content}</span>

                      {/* Equalizer waveform visualizer */}
                      <div className="absolute inset-0 flex items-center justify-start opacity-35 overflow-hidden px-2 pt-2 pointer-events-none">
                        <div className="w-full h-full flex items-end gap-[2px]">
                          {[...Array(Math.min(waveBars, 120))].map((_, i) => (
                            <div
                              key={i}
                              className="w-[2px] bg-cyan-200 rounded-t-sm shrink-0"
                              style={{ height: `${20 + ((i * 17) % 80)}%` }}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Resize handles */}
                      {isSelected && !trackLocks[2] && (
                        <>
                          <div
                            onPointerDown={(e) => handlePointerDownResize(e, clip, 'left')}
                            className="absolute left-0 top-0 bottom-0 w-2.5 bg-white/70 hover:bg-white rounded-l cursor-ew-resize flex items-center justify-center z-20"
                          >
                            <div className="w-0.5 h-3 bg-black/50 rounded-full" />
                          </div>
                          <div
                            onPointerDown={(e) => handlePointerDownResize(e, clip, 'right')}
                            className="absolute right-0 top-0 bottom-0 w-2.5 bg-white/70 hover:bg-white rounded-r cursor-ew-resize flex items-center justify-center z-20"
                          >
                            <div className="w-0.5 h-3 bg-black/50 rounded-full" />
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>

            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
