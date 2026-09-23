"use client";

import React, { useRef, useState, useEffect } from "react";
import { CanvasCard, ViewportTransform } from "../types";
import { Pin, PinOff, Minimize2, Maximize2, X } from "lucide-react";
import { useBoardReadOnly } from "../boardContext";

interface CardWrapperProps {
  card: CanvasCard;
  viewport: ViewportTransform;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (cardId: string, updates: any) => void;
  onDelete: (cardId: string) => void;
  children: React.ReactNode;
  icon: React.ReactNode;
  headerColorClass?: string;
  badgeText?: string;
}

export const CardWrapper: React.FC<CardWrapperProps> = ({
  card,
  viewport,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  children,
  icon,
  headerColorClass = "bg-neutral-800",
  badgeText,
}) => {
  // Students can't move or edit shared cards; the live screen-share window
  // is a per-viewer local card, so everyone may move/resize their own copy.
  const boardReadOnly = useBoardReadOnly();
  const locked = boardReadOnly && card.type !== "screenshare";
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const dragStartRef = useRef<{ startX: number; startY: number; cardX: number; cardY: number }>({
    startX: 0,
    startY: 0,
    cardX: card.x,
    cardY: card.y,
  });
  const resizeStartRef = useRef<{
    startX: number;
    startY: number;
    startW: number;
    startH: number;
  }>({
    startX: 0,
    startY: 0,
    startW: card.width,
    startH: card.height,
  });

  const handleHeaderMouseDown = (e: React.MouseEvent) => {
    if (card.pinned || locked) return;
    e.stopPropagation();
    onSelect();
    setIsDragging(true);
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      cardX: card.x,
      cardY: card.y,
    };
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    if (card.pinned || card.minimized || locked) return;
    e.stopPropagation();
    onSelect();
    setIsResizing(true);
    resizeStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startW: card.width,
      startH: card.height,
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const dx = (e.clientX - dragStartRef.current.startX) / viewport.zoom;
        const dy = (e.clientY - dragStartRef.current.startY) / viewport.zoom;
        onUpdate(card.id, {
          x: Math.round(dragStartRef.current.cardX + dx),
          y: Math.round(dragStartRef.current.cardY + dy),
        });
      } else if (isResizing) {
        const dx = (e.clientX - resizeStartRef.current.startX) / viewport.zoom;
        const dy = (e.clientY - resizeStartRef.current.startY) / viewport.zoom;
        const newW = Math.max(320, Math.round(resizeStartRef.current.startW + dx));
        const newH = Math.max(220, Math.round(resizeStartRef.current.startH + dy));
        onUpdate(card.id, {
          width: newW,
          height: newH,
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, isResizing, viewport.zoom, card.id, onUpdate]);

  // Screen coordinates
  const screenX = card.x * viewport.zoom + viewport.x;
  const screenY = card.y * viewport.zoom + viewport.y;
  const screenW = card.width * viewport.zoom;
  const screenH = card.minimized ? 46 * viewport.zoom : card.height * viewport.zoom;

  return (
    <div
      id={`card-${card.id}`}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      className={`absolute rounded-xl overflow-hidden shadow-2xl transition-shadow flex flex-col bg-white border ${
        isSelected ? "ring-2 ring-indigo-500 ring-offset-2 border-indigo-400" : "border-neutral-200"
      }`}
      style={{
        left: `${screenX}px`,
        top: `${screenY}px`,
        width: `${screenW}px`,
        height: card.minimized ? "auto" : `${screenH}px`,
        zIndex: card.zIndex,
        transformOrigin: "top left",
      }}
    >
      {/* Card Header Bar */}
      <div
        id={`card-header-${card.id}`}
        onMouseDown={handleHeaderMouseDown}
        className={`px-3 py-2 flex items-center justify-between text-white select-none ${headerColorClass} ${
          card.pinned || locked ? "cursor-default" : "cursor-grab active:cursor-grabbing"
        }`}
        style={{ fontSize: `${Math.max(11, Math.min(15, 13 * viewport.zoom))}px` }}
      >
        <div className="flex items-center gap-2 min-w-0 pr-2">
          <span className="shrink-0 flex items-center">{icon}</span>
          <span className="font-semibold truncate max-w-[200px] text-white">
            {card.title}
          </span>
          {badgeText && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/20 font-medium uppercase tracking-wider shrink-0">
              {badgeText}
            </span>
          )}
        </div>

        {!locked && (
        <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
          <button
            id={`btn-pin-${card.id}`}
            title={card.pinned ? "Unpin card" : "Pin card position"}
            onClick={() => onUpdate(card.id, { pinned: !card.pinned })}
            className={`p-1 rounded hover:bg-white/20 transition-colors ${
              card.pinned ? "text-amber-300 font-bold" : "text-white/70"
            }`}
          >
            {card.pinned ? <Pin className="w-3.5 h-3.5" /> : <PinOff className="w-3.5 h-3.5" />}
          </button>

          <button
            id={`btn-minimize-${card.id}`}
            title={card.minimized ? "Expand" : "Minimize"}
            onClick={() => onUpdate(card.id, { minimized: !card.minimized })}
            className="p-1 rounded hover:bg-white/20 transition-colors text-white/70 hover:text-white"
          >
            {card.minimized ? (
              <Maximize2 className="w-3.5 h-3.5" />
            ) : (
              <Minimize2 className="w-3.5 h-3.5" />
            )}
          </button>

          <button
            id={`btn-close-${card.id}`}
            title="Remove from board"
            onClick={() => onDelete(card.id)}
            className="p-1 rounded hover:bg-red-500/80 transition-colors text-white/70 hover:text-white ml-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
        )}
      </div>

      {/* Card Body */}
      {!card.minimized && (
        <div
          className="flex-1 overflow-hidden relative flex flex-col bg-white"
          style={{
            zoom: Math.min(1.2, Math.max(0.65, viewport.zoom)),
          }}
        >
          {children}

          {/* Resize Corner Handle */}
          {!card.pinned && !locked && (
            <div
              id={`card-resize-${card.id}`}
              onMouseDown={handleResizeMouseDown}
              className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize flex items-end justify-end p-0.5 text-neutral-400 hover:text-neutral-700 bg-gradient-to-tl from-neutral-200 to-transparent z-20"
              title="Drag to resize"
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
                <circle cx="8" cy="8" r="1.2" />
                <circle cx="4" cy="8" r="1.2" />
                <circle cx="8" cy="4" r="1.2" />
              </svg>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
