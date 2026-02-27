import React, { useRef, useEffect, useState } from 'react';
import { TextElement } from '../page';

interface CanvasProps {
  textElement: TextElement;
  setTextElement: React.Dispatch<React.SetStateAction<TextElement>>;
  activeTool: 'pointer' | 'hand';
  canvasZoom: number;
  setCanvasZoom: (zoom: number) => void;
  isPlaying: boolean;
  currentTime: number;
  setCurrentTime: React.Dispatch<React.SetStateAction<number>>;
  videoSrc: string;
  setDuration: React.Dispatch<React.SetStateAction<number>>;
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
  setDuration
}: CanvasProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [initialPos, setInitialPos] = useState({ x: 0, y: 0 });

  // Sync video with currentTime
  useEffect(() => {
    if (videoRef.current && !isPlaying) {
      videoRef.current.currentTime = currentTime;
    }
  }, [currentTime, isPlaying]);

  // Sync isPlaying with video
  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(e => console.log("Play interrupted"));
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Handle video progress
  const handleTimeUpdate = () => {
    if (isPlaying && videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  // Dragging logic for text
  const handleMouseDown = (e: React.MouseEvent) => {
    if (activeTool !== 'pointer') return;
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setInitialPos({ x: textElement.x, y: textElement.y });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const deltaX = ((e.clientX - dragStart.x) / rect.width) * 100 * (100 / canvasZoom);
      const deltaY = ((e.clientY - dragStart.y) / rect.height) * 100 * (100 / canvasZoom);

      setTextElement(prev => ({
        ...prev,
        x: initialPos.x + deltaX,
        y: initialPos.y + deltaY
      }));
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart, initialPos, canvasZoom, setTextElement]);

  return (
    <div className="flex-1 bg-[#1a1a1a] relative overflow-hidden flex items-center justify-center p-8">
      {/* Canvas Container */}
      <div
        ref={containerRef}
        className="relative bg-black shadow-2xl transition-all duration-200"
        style={{
          width: '720px',
          height: '1280px',
          transform: `scale(${canvasZoom / 100 * 0.4})`, // Adjusted base scale to fit vertical
          transformOrigin: 'center center'
        }}
      >
        {/* Video Layer */}
        <video
          ref={videoRef}
          src={videoSrc}
          className="w-full h-full object-cover"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          muted
          playsInline
        />

        {/* Text Overlay Layer */}
        <div
          ref={textRef}
          onMouseDown={handleMouseDown}
          className={`absolute cursor-move select-none group ${activeTool === 'pointer' ? 'hover:outline hover:outline-2 hover:outline-[#00a8ff]' : ''}`}
          style={{
            left: `${textElement.x}%`,
            top: `${textElement.y}%`,
            transform: `translate(-50%, -50%) rotate(${textElement.rotation}deg) scale(${textElement.scale / 100})`,
            fontSize: `${textElement.fontSize}px`,
            fontFamily: textElement.fontFamily,
            fontWeight: textElement.isBold ? 'bold' : 'normal',
            fontStyle: textElement.isItalic ? 'italic' : 'normal',
            textDecoration: textElement.isUnderline ? 'underline' : 'none',
            color: textElement.fill,
            opacity: textElement.opacity / 100,
            whiteSpace: 'nowrap'
          }}
        >
          {textElement.text}

          {/* Resize Handles (Visual only for now) */}
          {activeTool === 'pointer' && (
            <div className="absolute -inset-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <div className="absolute top-0 left-0 w-2 h-2 bg-white border border-[#00a8ff]"></div>
              <div className="absolute top-0 right-0 w-2 h-2 bg-white border border-[#00a8ff]"></div>
              <div className="absolute bottom-0 left-0 w-2 h-2 bg-white border border-[#00a8ff]"></div>
              <div className="absolute bottom-0 right-0 w-2 h-2 bg-white border border-[#00a8ff]"></div>
            </div>
          )}
        </div>
      </div>

      {/* Grid Pattern Background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
    </div>
  );
}
