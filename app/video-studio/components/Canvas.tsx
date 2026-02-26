import React, { useState, useRef, useEffect } from 'react';
import { Smartphone, RotateCw } from 'lucide-react';
import { TextElement } from '../page';

interface CanvasProps {
  textElement: TextElement;
  setTextElement: React.Dispatch<React.SetStateAction<TextElement>>;
  activeTool: 'pointer' | 'hand';
  canvasZoom: number;
  isPlaying: boolean;
  currentTime: number;
  setCurrentTime: React.Dispatch<React.SetStateAction<number>>;
}

export default function Canvas({
  textElement,
  setTextElement,
  activeTool,
  canvasZoom,
  isPlaying,
  currentTime,
  setCurrentTime
}: CanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [initialPos, setInitialPos] = useState({ x: 0, y: 0 });
  const [initialRotation, setInitialRotation] = useState(0);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });

  // Sync video playback with timeline state
  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(e => console.error("Video play failed:", e));
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Sync video time with timeline state
  useEffect(() => {
    if (videoRef.current) {
      // Only update video time if it's significantly different to avoid stuttering
      if (Math.abs(videoRef.current.currentTime - currentTime) > 0.5) {
        videoRef.current.currentTime = currentTime;
      }
    }
  }, [currentTime]);

  // Update timeline state when video plays naturally
  const handleTimeUpdate = () => {
    if (videoRef.current && isPlaying) {
      setCurrentTime(videoRef.current.currentTime);
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
      setDragStart({ x: angle, y: 0 }); // store initial angle in x
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
        x: initialPos.x + deltaX,
        y: initialPos.y + deltaY
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

  return (
    <div
      className={`flex-1 bg-[#0e0e0e] relative flex items-center justify-center overflow-hidden ${activeTool === 'hand' ? (isPanning ? 'cursor-grabbing' : 'cursor-grab') : ''}`}
      onPointerDown={activeTool === 'hand' ? handlePointerDown : undefined}
      onPointerMove={activeTool === 'hand' ? handlePointerMove : undefined}
      onPointerUp={activeTool === 'hand' ? handlePointerUp : undefined}
      onPointerCancel={activeTool === 'hand' ? handlePointerUp : undefined}
    >
      {/* Aspect Ratio Selector */}
      <div className="absolute top-4 left-4 bg-[#1a1a1a] rounded-md border border-white/10 p-1 flex flex-col gap-1 z-10">
        <button className="p-2 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors">
          <Smartphone className="w-4 h-4" />
        </button>
        <div className="text-[10px] text-center text-gray-400 font-medium">9:16</div>
        <button className="p-2 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
          </svg>
        </button>
      </div>

      {/* Video Preview Area */}
      <div
        className="relative w-full h-full max-w-[400px] max-h-[700px] flex items-center justify-center p-8 transition-transform duration-200 ease-out"
        style={{
          transform: `scale(${canvasZoom / 100}) translate(${panOffset.x / (canvasZoom / 100)}px, ${panOffset.y / (canvasZoom / 100)}px)`
        }}
      >
        <div
          ref={containerRef}
          className="relative w-full aspect-[9/16] bg-black rounded overflow-hidden shadow-2xl ring-1 ring-white/10"
        >
          <video
            ref={videoRef}
            src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
            className="w-full h-full object-cover pointer-events-none select-none"
            onTimeUpdate={handleTimeUpdate}
            muted
            playsInline
          />

          {/* Text Overlay */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div
              className="absolute pointer-events-auto cursor-move group"
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
              {/* Bounding Box */}
              <div className="absolute -inset-2 border border-[#00a8ff] rounded-sm hidden group-hover:block pointer-events-none">
                <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border border-[#00a8ff] rounded-full pointer-events-auto cursor-nwse-resize"></div>
                <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border border-[#00a8ff] rounded-full pointer-events-auto cursor-nesw-resize"></div>
                <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border border-[#00a8ff] rounded-full pointer-events-auto cursor-swne-resize"></div>
                <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border border-[#00a8ff] rounded-full pointer-events-auto cursor-nwse-resize"></div>

                {/* Rotate handle */}
                <div
                  className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md cursor-grab text-black pointer-events-auto"
                  onPointerDown={handleRotatePointerDown}
                >
                  <RotateCw className="w-3 h-3 pointer-events-none" />
                </div>
              </div>

              <h1
                className="font-bold drop-shadow-lg whitespace-nowrap px-2 select-none"
                style={{
                  fontFamily: textElement.fontFamily,
                  fontSize: `${textElement.fontSize / 3}px`, // Scale down for preview
                  color: textElement.fill,
                  fontWeight: textElement.isBold ? 'bold' : 'normal',
                  fontStyle: textElement.isItalic ? 'italic' : 'normal',
                  textDecoration: textElement.isUnderline ? 'underline' : 'none',
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
