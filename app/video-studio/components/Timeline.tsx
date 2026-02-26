import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Scissors, Trash2, SplitSquareVertical, Volume2, Maximize, Plus, Minus, Type, Music } from 'lucide-react';

interface Clip {
  id: string;
  type: 'text' | 'video' | 'audio';
  start: number; // in seconds
  end: number; // in seconds
  content: string;
  color: string;
  trackIndex: number;
}

interface TimelineProps {
  isPlaying: boolean;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  currentTime: number;
  setCurrentTime: React.Dispatch<React.SetStateAction<number>>;
  duration: number;
  setDuration: React.Dispatch<React.SetStateAction<number>>;
}

export default function Timeline({ 
  isPlaying, 
  setIsPlaying, 
  currentTime, 
  setCurrentTime, 
  duration, 
  setDuration 
}: TimelineProps) {
  const [zoom, setZoom] = useState(10); // pixels per second
  const [clips, setClips] = useState<Clip[]>([
    { id: '1', type: 'text', start: 0, end: 30, content: 'Celoris Web', color: '#e67e22', trackIndex: 0 },
    { id: '2', type: 'text', start: 31, end: 60, content: 'Text', color: '#e67e22', trackIndex: 0 },
    { id: '3', type: 'video', start: 0, end: 596, content: 'Big Buck Bunny', color: '#2c3e50', trackIndex: 1 },
    { id: '4', type: 'audio', start: 0, end: 45, content: 'Lazy Sunday', color: '#1abc9c', trackIndex: 2 },
  ]);
  const [selectedClipId, setSelectedClipId] = useState<string | null>(null);
  
  const timelineRef = useRef<HTMLDivElement>(null);
  
  // Playback logic
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

  // Format time (seconds to HH:MM:SS)
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Dragging logic for playhead
  const handleTimelineClick = (e: React.MouseEvent) => {
    if (!timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left + timelineRef.current.scrollLeft;
    const newTime = Math.max(0, Math.min(duration, x / zoom));
    setCurrentTime(newTime);
  };

  // Clip dragging state
  const [draggingClip, setDraggingClip] = useState<{ id: string, startX: number, initialStart: number } | null>(null);
  const [resizingClip, setResizingClip] = useState<{ id: string, edge: 'left' | 'right', startX: number, initialStart: number, initialEnd: number } | null>(null);

  const handlePointerDownClip = (e: React.PointerEvent, clip: Clip) => {
    e.stopPropagation();
    setSelectedClipId(clip.id);
    setDraggingClip({ id: clip.id, startX: e.clientX, initialStart: clip.start });
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerDownResize = (e: React.PointerEvent, clip: Clip, edge: 'left' | 'right') => {
    e.stopPropagation();
    setSelectedClipId(clip.id);
    setResizingClip({ id: clip.id, edge, startX: e.clientX, initialStart: clip.start, initialEnd: clip.end });
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (draggingClip) {
      const deltaX = e.clientX - draggingClip.startX;
      const deltaT = deltaX / zoom;
      setClips(clips.map(c => {
        if (c.id === draggingClip.id) {
          const duration = c.end - c.start;
          let newStart = draggingClip.initialStart + deltaT;
          newStart = Math.max(0, newStart);
          return { ...c, start: newStart, end: newStart + duration };
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
            newStart = Math.max(0, Math.min(newStart, c.end - 1)); // Min 1s duration
            return { ...c, start: newStart };
          } else {
            let newEnd = resizingClip.initialEnd + deltaT;
            newEnd = Math.max(c.start + 1, newEnd); // Min 1s duration
            return { ...c, end: newEnd };
          }
        }
        return c;
      }));
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

  // Generate time markers
  const markers = [];
  for (let i = 0; i <= duration; i += 10) { // Marker every 10 seconds
    markers.push(i);
  }

  return (
    <div className="h-[280px] bg-[#121212] border-t border-white/10 flex flex-col shrink-0 select-none">
      {/* Timeline Toolbar */}
      <div className="h-10 border-b border-white/5 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <button className="p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors">
            <SplitSquareVertical className="w-4 h-4" />
          </button>
          <button onClick={deleteSelected} className="p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled={!selectedClipId}>
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-8 h-8 flex items-center justify-center bg-white text-black rounded-full hover:bg-gray-200 transition-colors"
          >
            {isPlaying ? <Pause className="w-4 h-4" fill="currentColor" /> : <Play className="w-4 h-4 ml-0.5" fill="currentColor" />}
          </button>
          <div className="text-sm font-mono text-gray-300">
            {formatTime(currentTime)} <span className="text-gray-600">|</span> {formatTime(duration)}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 ml-2">
            <button onClick={() => setZoom(Math.max(1, zoom - 2))} className="p-1 text-gray-400 hover:text-white"><Minus className="w-4 h-4" /></button>
            <input 
              type="range" 
              min="1" max="50" 
              value={zoom} 
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-24 h-1 bg-white/10 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full cursor-pointer"
            />
            <button onClick={() => setZoom(Math.min(50, zoom + 2))} className="p-1 text-gray-400 hover:text-white"><Plus className="w-4 h-4" /></button>
          </div>
          <button className="p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors ml-2">
            <Maximize className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Timeline Tracks Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Track Headers */}
        <div className="w-12 bg-[#1a1a1a] border-r border-white/5 flex flex-col items-center py-6 gap-8 z-20 shrink-0">
          <div className="w-6 h-6 flex items-center justify-center text-gray-500 mt-2">
            <Type className="w-4 h-4" />
          </div>
          <div className="w-6 h-6 flex items-center justify-center text-gray-500 mt-5">
            <Volume2 className="w-4 h-4" />
          </div>
        </div>

        {/* Tracks Content */}
        <div 
          className="flex-1 overflow-x-auto overflow-y-hidden relative bg-[#121212] custom-scrollbar"
          ref={timelineRef}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          <div className="min-w-full relative" style={{ width: `${duration * zoom}px`, height: '100%' }}>
            {/* Time Ruler */}
            <div 
              className="h-6 border-b border-white/5 relative sticky top-0 bg-[#121212] z-10 cursor-text"
              onClick={handleTimelineClick}
            >
              {markers.map(m => (
                <div key={m} className="absolute top-0 text-[10px] text-gray-500 font-mono flex flex-col items-center" style={{ left: `${m * zoom}px`, transform: 'translateX(-50%)' }}>
                  <span className="mt-1">{formatTime(m).substring(3)}</span>
                  <div className="w-px h-1.5 bg-gray-600 mt-0.5"></div>
                </div>
              ))}
            </div>

            {/* Playhead */}
            <div 
              className="absolute top-0 bottom-0 w-px bg-white z-20 pointer-events-none"
              style={{ left: `${currentTime * zoom}px` }}
            >
              <div className="absolute -top-1 -left-1.5 w-3 h-3 bg-white rounded-sm"></div>
              <div className="absolute top-2 -left-0.5 w-1 h-full bg-white/20"></div>
            </div>

            {/* Tracks Container */}
            <div className="absolute top-6 left-0 right-0 bottom-0 flex flex-col gap-2 pt-2">
              {/* Text Track */}
              <div className="h-8 relative w-full bg-white/5 border-y border-white/5">
                {clips.filter(c => c.trackIndex === 0).map(clip => (
                  <div 
                    key={clip.id}
                    className={`absolute h-full rounded border flex items-center px-2 text-xs font-medium text-white shadow-sm cursor-pointer ${selectedClipId === clip.id ? 'brightness-125 ring-1 ring-white z-10' : 'hover:brightness-110 opacity-90'}`}
                    style={{ 
                      left: `${clip.start * zoom}px`, 
                      width: `${(clip.end - clip.start) * zoom}px`,
                      backgroundColor: clip.color,
                      borderColor: clip.color
                    }}
                    onPointerDown={(e) => handlePointerDownClip(e, clip)}
                  >
                    <Type className="w-3 h-3 mr-1.5 opacity-80 shrink-0" />
                    <span className="truncate">{clip.content}</span>
                    
                    {/* Selection Handles */}
                    {selectedClipId === clip.id && (
                      <>
                        <div 
                          className="absolute left-0 top-0 bottom-0 w-2 bg-white/50 hover:bg-white rounded-l cursor-ew-resize"
                          onPointerDown={(e) => handlePointerDownResize(e, clip, 'left')}
                        ></div>
                        <div 
                          className="absolute right-0 top-0 bottom-0 w-2 bg-white/50 hover:bg-white rounded-r cursor-ew-resize"
                          onPointerDown={(e) => handlePointerDownResize(e, clip, 'right')}
                        ></div>
                      </>
                    )}
                  </div>
                ))}
              </div>

              {/* Video Track */}
              <div className="h-12 relative w-full bg-white/5 border-y border-white/5 mt-1">
                {clips.filter(c => c.trackIndex === 1).map(clip => (
                  <div 
                    key={clip.id}
                    className={`absolute h-full rounded border flex items-center overflow-hidden cursor-pointer ${selectedClipId === clip.id ? 'brightness-125 ring-1 ring-white z-10' : 'hover:brightness-110 opacity-90'}`}
                    style={{ 
                      left: `${clip.start * zoom}px`, 
                      width: `${(clip.end - clip.start) * zoom}px`,
                      backgroundColor: clip.color,
                      borderColor: clip.color
                    }}
                    onPointerDown={(e) => handlePointerDownClip(e, clip)}
                  >
                    <div className="flex w-full h-full opacity-60">
                      {[...Array(Math.max(1, Math.ceil((clip.end - clip.start) / 10)))].map((_, i) => (
                        <img key={i} src={`https://picsum.photos/seed/tokyo${i}/60/48`} className="h-full w-[60px] object-cover shrink-0" alt="" referrerPolicy="no-referrer" />
                      ))}
                    </div>
                    {selectedClipId === clip.id && (
                      <>
                        <div 
                          className="absolute left-0 top-0 bottom-0 w-2 bg-white/50 hover:bg-white rounded-l cursor-ew-resize"
                          onPointerDown={(e) => handlePointerDownResize(e, clip, 'left')}
                        ></div>
                        <div 
                          className="absolute right-0 top-0 bottom-0 w-2 bg-white/50 hover:bg-white rounded-r cursor-ew-resize"
                          onPointerDown={(e) => handlePointerDownResize(e, clip, 'right')}
                        ></div>
                      </>
                    )}
                  </div>
                ))}
              </div>

              {/* Audio Track */}
              <div className="h-8 relative w-full bg-white/5 border-y border-white/5 mt-1">
                {clips.filter(c => c.trackIndex === 2).map(clip => (
                  <div 
                    key={clip.id}
                    className={`absolute h-full rounded border flex items-center px-2 text-xs font-medium text-white shadow-sm cursor-pointer ${selectedClipId === clip.id ? 'brightness-125 ring-1 ring-white z-10' : 'hover:brightness-110 opacity-90'}`}
                    style={{ 
                      left: `${clip.start * zoom}px`, 
                      width: `${(clip.end - clip.start) * zoom}px`,
                      backgroundColor: clip.color,
                      borderColor: clip.color
                    }}
                    onPointerDown={(e) => handlePointerDownClip(e, clip)}
                  >
                    <Music className="w-3 h-3 mr-1.5 opacity-80 shrink-0 z-10" />
                    <span className="truncate z-10">{clip.content}</span>
                    
                    <div className="absolute inset-0 flex items-center justify-start opacity-30 overflow-hidden px-2 pt-3 pointer-events-none">
                      <div className="w-full h-full flex items-end gap-[1px]">
                        {[...Array(Math.max(1, Math.ceil((clip.end - clip.start) * 2)))].map((_, i) => (
                          <div key={i} className="w-[2px] bg-white rounded-t-sm shrink-0" style={{ height: `${Math.max(20, Math.random() * 100)}%` }}></div>
                        ))}
                      </div>
                    </div>

                    {selectedClipId === clip.id && (
                      <>
                        <div 
                          className="absolute left-0 top-0 bottom-0 w-2 bg-white/50 hover:bg-white rounded-l cursor-ew-resize z-20"
                          onPointerDown={(e) => handlePointerDownResize(e, clip, 'left')}
                        ></div>
                        <div 
                          className="absolute right-0 top-0 bottom-0 w-2 bg-white/50 hover:bg-white rounded-r cursor-ew-resize z-20"
                          onPointerDown={(e) => handlePointerDownResize(e, clip, 'right')}
                        ></div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
