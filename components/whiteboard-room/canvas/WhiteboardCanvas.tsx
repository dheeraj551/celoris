"use client";

import React, { useRef, useEffect, useState, useCallback, useMemo } from "react";
import {
  Stroke,
  StrokePoint,
  ToolType,
  PaperTextureType,
  CanvasCard,
  RemoteUser,
  ViewportTransform,
} from "../types";
import {
  renderStrokeOnCanvas,
  createProceduralGrainTexture,
  getToolConfig,
  isStrokeIntersectingSegment,
} from "../utils/inkEngine";
import { getToolCursor } from "../utils/cursorIcons";
import { YouTubeCardComponent } from "../cards/YouTubeCardComponent";
import { PPTCardComponent } from "../cards/PPTCardComponent";
import { WordCardComponent } from "../cards/WordCardComponent";
import { ExcelCardComponent } from "../cards/ExcelCardComponent";
import { ImageCardComponent } from "../cards/ImageCardComponent";
import { ScreenShareCardComponent } from "../cards/ScreenShareCardComponent";
import { fileToBoardImage } from "../utils/imageTools";

interface WhiteboardCanvasProps {
  currentTool: ToolType;
  currentColor: string;
  strokeSize: number;
  paperTexture: PaperTextureType;
  strokes: Stroke[];
  cards: CanvasCard[];
  viewport: ViewportTransform;
  onViewportChange: (vp: ViewportTransform) => void;
  onStrokeCommit: (stroke: Stroke) => void;
  onStrokeStream?: (stroke: Stroke) => void;
  onStrokesDelete?: (strokeIds: string[]) => void;
  onRecordUndoSnapshot?: () => void;
  onCardUpdate: (cardId: string, updates: Partial<CanvasCard>) => void;
  onCardDelete: (cardId: string) => void;
  onInsertImage?: (
    src: string,
    title?: string,
    naturalWidth?: number,
    naturalHeight?: number,
    worldX?: number,
    worldY?: number
  ) => void;
  remoteUsers: RemoteUser[];
  onCursorMove: (cursor: { x: number; y: number; isDrawing: boolean; tool: ToolType }) => void;
  onPressureChange: (pressure: number) => void;
  remoteStreamingStrokes?: Map<string, Stroke>;
  isReadOnly?: boolean;
  onStudentDrawAttempt?: () => void;
  localUserId?: string;
  onStopScreenShare?: () => void;
}

/**
 * Advanced multi-stage path smoothing algorithm for handwriting instruments
 * (fountain-pen & ballpoint) to reduce micro-jitter, mouse digitization staircase,
 * and hand tremors while preserving natural fluid calligraphy and intentional sharp turns.
 *
 * Stage 1: Spatial De-Jittering & Sub-pixel Quantization Filter
 * Stage 2: Corner-Preserving Gaussian / Laplacian Filter
 * Stage 3: Chaikin's Corner-Cutting Spline Subdivision (C1 Tangent Continuity)
 */
export function smoothHandwritingStrokePath(
  points: StrokePoint[],
  tool: "fountain-pen" | "ballpoint"
): StrokePoint[] {
  if (points.length < 3) return points;

  const isFountain = tool === "fountain-pen";

  // Stage 1: Spatial De-Jittering
  // Discards redundant micro-jitter points (< 1.0px for fountain-pen, < 0.7px for ballpoint)
  const minSpacing = isFountain ? 1.0 : 0.75;
  const minSpacingSq = minSpacing * minSpacing;
  const filtered: StrokePoint[] = [points[0]];

  for (let i = 1; i < points.length - 1; i++) {
    const prev = filtered[filtered.length - 1];
    const curr = points[i];
    const distSq = (curr.x - prev.x) ** 2 + (curr.y - prev.y) ** 2;
    if (distSq >= minSpacingSq) {
      filtered.push(curr);
    }
  }
  filtered.push(points[points.length - 1]); // Always preserve true endpoint

  if (filtered.length < 3) return filtered;

  // Stage 2: Corner-Preserving Gaussian / Laplacian Filter
  // Smooths micro-tremors while detecting and preserving sharp vertices (e.g. 'v', 'w', 'z')
  const smoothed: StrokePoint[] = [filtered[0]];
  const weightCenter = isFountain ? 0.54 : 0.62;
  const weightNeighbor = (1 - weightCenter) / 2;

  for (let i = 1; i < filtered.length - 1; i++) {
    const p0 = filtered[i - 1];
    const p1 = filtered[i];
    const p2 = filtered[i + 1];

    const v1x = p1.x - p0.x;
    const v1y = p1.y - p0.y;
    const v2x = p2.x - p1.x;
    const v2y = p2.y - p1.y;
    const len1 = Math.hypot(v1x, v1y);
    const len2 = Math.hypot(v2x, v2y);

    let isSharpCorner = false;
    if (len1 > 0.001 && len2 > 0.001) {
      const dot = (v1x * v2x + v1y * v2y) / (len1 * len2);
      // Turn sharper than ~115° is preserved as an intentional corner
      if (dot < -0.42) {
        isSharpCorner = true;
      }
    }

    if (isSharpCorner) {
      smoothed.push(p1);
    } else {
      const sx = p0.x * weightNeighbor + p1.x * weightCenter + p2.x * weightNeighbor;
      const sy = p0.y * weightNeighbor + p1.y * weightCenter + p2.y * weightNeighbor;
      const sp = p0.pressure * weightNeighbor + p1.pressure * weightCenter + p2.pressure * weightNeighbor;
      smoothed.push({
        x: sx,
        y: sy,
        pressure: sp,
        time: p1.time,
      });
    }
  }
  smoothed.push(filtered[filtered.length - 1]);

  // Stage 3: Chaikin's Corner-Cutting Spline Subdivision
  // Generates points at 25% and 75% intervals between successive control points,
  // creating continuous C1 tangent curves that mimic ink flowing from a nib or rollerball.
  const iterations = isFountain ? (smoothed.length < 160 ? 2 : 1) : 1;
  let currentPoints = smoothed;

  for (let iter = 0; iter < iterations; iter++) {
    if (currentPoints.length < 3) break;
    const refined: StrokePoint[] = [currentPoints[0]];

    for (let i = 0; i < currentPoints.length - 1; i++) {
      const p0 = currentPoints[i];
      const p1 = currentPoints[i + 1];

      // Q = 0.75 * p0 + 0.25 * p1
      const qx = 0.75 * p0.x + 0.25 * p1.x;
      const qy = 0.75 * p0.y + 0.25 * p1.y;
      const qp = 0.75 * p0.pressure + 0.25 * p1.pressure;

      // R = 0.25 * p0 + 0.75 * p1
      const rx = 0.25 * p0.x + 0.75 * p1.x;
      const ry = 0.25 * p0.y + 0.75 * p1.y;
      const rp = 0.25 * p0.pressure + 0.75 * p1.pressure;

      const segLen = Math.hypot(p1.x - p0.x, p1.y - p0.y);
      if (segLen > 2.0) {
        refined.push({
          x: qx,
          y: qy,
          pressure: qp,
          time: p0.time,
        });
        refined.push({
          x: rx,
          y: ry,
          pressure: rp,
          time: p1.time,
        });
      } else {
        refined.push({
          x: (p0.x + p1.x) / 2,
          y: (p0.y + p1.y) / 2,
          pressure: (p0.pressure + p1.pressure) / 2,
          time: p0.time,
        });
      }
    }

    refined.push(currentPoints[currentPoints.length - 1]);
    currentPoints = refined;
  }

  return currentPoints;
}

export const WhiteboardCanvas: React.FC<WhiteboardCanvasProps> = ({
  currentTool,
  currentColor,
  strokeSize,
  paperTexture,
  strokes,
  cards,
  viewport,
  onViewportChange,
  onStrokeCommit,
  onStrokeStream,
  onStrokesDelete,
  onRecordUndoSnapshot,
  onCardUpdate,
  onCardDelete,
  onInsertImage,
  remoteUsers,
  onCursorMove,
  onPressureChange,
  remoteStreamingStrokes,
  isReadOnly = false,
  onStudentDrawAttempt,
  localUserId,
  onStopScreenShare,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const grainTextureRef = useRef<HTMLCanvasElement | null>(null);

  // Active stroke state
  const isDrawingRef = useRef(false);
  const activeStrokeRef = useRef<Stroke | null>(null);
  const lastPointRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const currentPressureRef = useRef(0.5);

  // Online stream smoother state for live handwriting strokes (fountain-pen & ballpoint)
  const liveSmootherRef = useRef<{
    smoothedX: number;
    smoothedY: number;
    smoothedPressure: number;
    lastRawPoint: StrokePoint | null;
  } | null>(null);

  // Synchronous strokes ref for instant hit-testing & erasing
  const strokesRef = useRef<Stroke[]>(strokes);
  useEffect(() => {
    strokesRef.current = strokes;
  }, [strokes]);

  // Dedicated Eraser tracking
  const isErasingRef = useRef(false);
  const lastEraserPointRef = useRef<{ x: number; y: number } | null>(null);
  const hasRecordedUndoInGestureRef = useRef(false);
  const eraserHoverPosRef = useRef<{ x: number; y: number } | null>(null);

  // Pan & gesture tracking
  const isPanningRef = useRef(false);
  const panStartRef = useRef<{ x: number; y: number; vpX: number; vpY: number }>({
    x: 0,
    y: 0,
    vpX: 0,
    vpY: 0,
  });

  // Touch pinch-zoom tracking
  const touchPinchRef = useRef<{
    initialDist: number;
    initialZoom: number;
    centerScreenX: number;
    centerScreenY: number;
    centerWorldX: number;
    centerWorldY: number;
  } | null>(null);

  // Laser pointer trails
  const laserPointsRef = useRef<Array<{ x: number; y: number; time: number }>>([]);
  const isSpacePressedRef = useRef(false);
  const [isSpaceActive, setIsSpaceActive] = useState(false);
  const [isPanningActive, setIsPanningActive] = useState(false);

  // Selected card
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  // Dynamic custom tool cursor (fountain pen, sketch pencil, ball pen, highlighter, eraser, laser pen)
  const activeCursor = useMemo(() => {
    if (isReadOnly) {
      return isPanningActive ? "grabbing" : "grab";
    }
    if (isPanningActive) return "grabbing";
    if (isSpaceActive || currentTool === "hand-pan") return "grab";
    return getToolCursor(currentTool, currentColor);
  }, [isReadOnly, currentTool, currentColor, isPanningActive, isSpaceActive]);

  // Keyboard space tracking for canvas panning
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) {
        isSpacePressedRef.current = true;
        setIsSpaceActive(true);
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        isSpacePressedRef.current = false;
        setIsSpaceActive(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  // Initialize grain texture once
  useEffect(() => {
    grainTextureRef.current = createProceduralGrainTexture(128);
  }, []);

  // Screen to world transform
  const screenToWorld = useCallback(
    (screenX: number, screenY: number) => {
      return {
        x: (screenX - viewport.x) / viewport.zoom,
        y: (screenY - viewport.y) / viewport.zoom,
      };
    },
    [viewport]
  );

  // Draw background texture and grid based on paperTexture
  const drawBackground = useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      ctx.save();
      let bgColor = "#fdfbf7";
      let gridColor = "rgba(0, 0, 0, 0.06)";
      let dotColor = "rgba(0, 0, 0, 0.12)";
      let lineColor = "rgba(43, 87, 154, 0.14)";

      switch (paperTexture) {
        case "paper-grid":
          bgColor = "#fcfbfa";
          gridColor = "rgba(30, 58, 138, 0.08)";
          break;
        case "paper-dots":
          bgColor = "#fcfaf7";
          dotColor = "rgba(20, 20, 20, 0.14)";
          break;
        case "paper-lined":
          bgColor = "#fdfdfc";
          lineColor = "rgba(59, 130, 246, 0.15)";
          break;
        case "dark-grid":
          bgColor = "#0f172a";
          gridColor = "rgba(148, 163, 184, 0.12)";
          break;
        case "parchment":
          bgColor = "#f7f1e5";
          gridColor = "rgba(120, 80, 40, 0.07)";
          break;
        case "paper-plain":
        default:
          bgColor = "#fdfbf7";
          break;
      }

      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, width, height);

      // Render grid/dots/lines in world space
      ctx.save();
      ctx.translate(viewport.x, viewport.y);
      ctx.scale(viewport.zoom, viewport.zoom);

      // Visible world bounds
      const minWorldX = -viewport.x / viewport.zoom;
      const minWorldY = -viewport.y / viewport.zoom;
      const maxWorldX = (width - viewport.x) / viewport.zoom;
      const maxWorldY = (height - viewport.y) / viewport.zoom;

      const gridSize = 40; // 40px grid

      if (paperTexture === "paper-grid" || paperTexture === "dark-grid") {
        ctx.strokeStyle = gridColor;
        ctx.lineWidth = 1 / viewport.zoom;
        ctx.beginPath();

        const startX = Math.floor(minWorldX / gridSize) * gridSize;
        const endX = Math.ceil(maxWorldX / gridSize) * gridSize;
        for (let x = startX; x <= endX; x += gridSize) {
          ctx.moveTo(x, minWorldY);
          ctx.lineTo(x, maxWorldY);
        }

        const startY = Math.floor(minWorldY / gridSize) * gridSize;
        const endY = Math.ceil(maxWorldY / gridSize) * gridSize;
        for (let y = startY; y <= endY; y += gridSize) {
          ctx.moveTo(minWorldX, y);
          ctx.lineTo(maxWorldX, y);
        }
        ctx.stroke();
      } else if (paperTexture === "paper-dots") {
        ctx.fillStyle = dotColor;
        const startX = Math.floor(minWorldX / gridSize) * gridSize;
        const endX = Math.ceil(maxWorldX / gridSize) * gridSize;
        const startY = Math.floor(minWorldY / gridSize) * gridSize;
        const endY = Math.ceil(maxWorldY / gridSize) * gridSize;
        const dotRadius = Math.max(1, 1.3 / viewport.zoom);

        for (let x = startX; x <= endX; x += gridSize) {
          for (let y = startY; y <= endY; y += gridSize) {
            ctx.beginPath();
            ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      } else if (paperTexture === "paper-lined") {
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = 1 / viewport.zoom;
        ctx.beginPath();
        const lineSpacing = 32;
        const startY = Math.floor(minWorldY / lineSpacing) * lineSpacing;
        const endY = Math.ceil(maxWorldY / lineSpacing) * lineSpacing;
        for (let y = startY; y <= endY; y += lineSpacing) {
          ctx.moveTo(minWorldX, y);
          ctx.lineTo(maxWorldX, y);
        }
        ctx.stroke();

        // Left margin line
        ctx.strokeStyle = "rgba(239, 68, 68, 0.22)";
        ctx.beginPath();
        ctx.moveTo(80, minWorldY);
        ctx.lineTo(80, maxWorldY);
        ctx.stroke();
      }

      ctx.restore();
      ctx.restore();
    },
    [paperTexture, viewport]
  );

  // Main canvas render loop
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // 1. Draw Paper background
    drawBackground(ctx, width, height);

    // 2. Draw World contents
    ctx.save();
    ctx.translate(viewport.x, viewport.y);
    ctx.scale(viewport.zoom, viewport.zoom);

    // Render committed strokes
    const grain = grainTextureRef.current;
    for (let i = 0; i < strokes.length; i++) {
      renderStrokeOnCanvas(ctx, strokes[i], grain);
    }

    // Render remote in-flight streaming strokes
    if (remoteStreamingStrokes) {
      remoteStreamingStrokes.forEach((stroke) => {
        renderStrokeOnCanvas(ctx, stroke, grain);
      });
    }

    // Render local active ongoing stroke
    if (activeStrokeRef.current) {
      renderStrokeOnCanvas(ctx, activeStrokeRef.current, grain);
    }

    // Render Laser pointer fading trail
    if (laserPointsRef.current.length > 1) {
      const now = Date.now();
      laserPointsRef.current = laserPointsRef.current.filter((p) => now - p.time < 1200);

      ctx.save();
      for (let i = 1; i < laserPointsRef.current.length; i++) {
        const p1 = laserPointsRef.current[i - 1];
        const p2 = laserPointsRef.current[i];
        const age = now - p2.time;
        const opacity = Math.max(0, 1 - age / 1200);

        ctx.strokeStyle = `rgba(244, 63, 94, ${opacity})`;
        ctx.lineWidth = (6 / viewport.zoom) * opacity;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }

      // Bright laser tip
      const lastPt = laserPointsRef.current[laserPointsRef.current.length - 1];
      if (lastPt) {
        ctx.fillStyle = "#ffffff";
        ctx.shadowColor = "#f43f5e";
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(lastPt.x, lastPt.y, 4 / viewport.zoom, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // Render Eraser active tactile radius indicator ring
    if (currentTool === "eraser" && eraserHoverPosRef.current) {
      const pos = eraserHoverPosRef.current;
      const radius = Math.max(22, strokeSize * 3.5) / viewport.zoom;
      ctx.save();
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = isErasingRef.current
        ? "rgba(244, 63, 94, 0.20)"
        : "rgba(225, 29, 72, 0.08)";
      ctx.fill();
      ctx.strokeStyle = isErasingRef.current
        ? "rgba(225, 29, 72, 0.9)"
        : "rgba(225, 29, 72, 0.45)";
      ctx.lineWidth = (isErasingRef.current ? 2.2 : 1.4) / viewport.zoom;
      ctx.setLineDash([4 / viewport.zoom, 3 / viewport.zoom]);
      ctx.stroke();
      ctx.restore();
    }

    ctx.restore();
  }, [drawBackground, strokes, viewport, remoteStreamingStrokes, currentTool, strokeSize]);

  // Request Animation Frame loop for smooth 60fps rendering
  useEffect(() => {
    let animId: number;
    const loop = () => {
      renderCanvas();
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [renderCanvas]);

  // Resize canvas when container dimensions change
  useEffect(() => {
    const handleResize = () => {
      const container = containerRef.current;
      const canvas = canvasRef.current;
      if (!container || !canvas) return;

      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
      renderCanvas();
    };

    handleResize();
    const observer = new ResizeObserver(handleResize);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, [renderCanvas]);

  // Wheel zoom centered at mouse pointer & trackpad pan
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.ctrlKey || e.metaKey) {
      // Zoom
      const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
      const newZoom = Math.min(4.0, Math.max(0.2, viewport.zoom * zoomFactor));

      const rect = containerRef.current?.getBoundingClientRect();
      const mouseX = e.clientX - (rect?.left || 0);
      const mouseY = e.clientY - (rect?.top || 0);

      const newX = mouseX - (mouseX - viewport.x) * (newZoom / viewport.zoom);
      const newY = mouseY - (mouseY - viewport.y) * (newZoom / viewport.zoom);

      onViewportChange({
        x: newX,
        y: newY,
        zoom: newZoom,
      });
    } else {
      // Pan
      onViewportChange({
        x: viewport.x - e.deltaX,
        y: viewport.y - e.deltaY,
        zoom: viewport.zoom,
      });
    }
  };

  // Pointer event handlers with getCoalescedEvents for low-latency stylus
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    // Pan with hand tool or middle click or space key
    if (currentTool === "hand-pan" || e.button === 1 || e.buttons === 4 || isSpacePressedRef.current) {
      isPanningRef.current = true;
      setIsPanningActive(true);
      panStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        vpX: viewport.x,
        vpY: viewport.y,
      };
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      return;
    }

    // In Student view-only mode, students cannot draw or erase anything on the board
    if (isReadOnly) {
      isPanningRef.current = true;
      setIsPanningActive(true);
      panStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        vpX: viewport.x,
        vpY: viewport.y,
      };
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      onStudentDrawAttempt?.();
      return;
    }

    if (e.button !== 0) return; // Only primary button for drawing

    isDrawingRef.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;
    const world = screenToWorld(screenX, screenY);

    // Compute initial pressure (Apple Pencil / Wacom / Surface Pen or default)
    let pressure = 0.5;
    if (e.pointerType === "pen" && e.pressure > 0) {
      pressure = e.pressure;
    }
    currentPressureRef.current = pressure;
    onPressureChange(pressure);

    lastPointRef.current = { x: world.x, y: world.y, time: Date.now() };

    // Eraser mode: direct stroke hit-test and deletion
    if (currentTool === "eraser") {
      isDrawingRef.current = true;
      isErasingRef.current = true;
      hasRecordedUndoInGestureRef.current = false;
      lastEraserPointRef.current = { x: world.x, y: world.y };
      eraserHoverPosRef.current = { x: world.x, y: world.y };

      const eraserRadius = Math.max(22, strokeSize * 3.5) / viewport.zoom;
      const hitIds: string[] = [];
      for (const s of strokesRef.current) {
        if (isStrokeIntersectingSegment(s, world, world, eraserRadius)) {
          hitIds.push(s.id);
        }
      }

      if (hitIds.length > 0) {
        if (!hasRecordedUndoInGestureRef.current) {
          onRecordUndoSnapshot?.();
          hasRecordedUndoInGestureRef.current = true;
        }
        const hitSet = new Set(hitIds);
        strokesRef.current = strokesRef.current.filter((s) => !hitSet.has(s.id));
        onStrokesDelete?.(hitIds);
      }
      return;
    }

    // Laser pointer mode
    if (currentTool === "laser-pointer") {
      laserPointsRef.current = [{ x: world.x, y: world.y, time: Date.now() }];
      return;
    }

    const newStroke: Stroke = {
      id: `stroke-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      tool: currentTool,
      color: currentColor,
      size: strokeSize,
      points: [{ x: world.x, y: world.y, pressure, time: Date.now() }],
      bleedIntensity: currentTool === "fountain-pen" ? 0.8 : 0,
      createdAt: Date.now(),
    };

    activeStrokeRef.current = newStroke;

    // Initialize live in-flight path smoother for fountain-pen and ballpoint
    if (currentTool === "fountain-pen" || currentTool === "ballpoint") {
      liveSmootherRef.current = {
        smoothedX: world.x,
        smoothedY: world.y,
        smoothedPressure: pressure,
        lastRawPoint: { x: world.x, y: world.y, pressure, time: Date.now() },
      };
    } else {
      liveSmootherRef.current = null;
    }

    if (onStrokeStream) {
      onStrokeStream(newStroke);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;
    const world = screenToWorld(screenX, screenY);

    // Broadcast cursor position to collaborators
    onCursorMove({
      x: world.x,
      y: world.y,
      isDrawing: isReadOnly ? false : isDrawingRef.current,
      tool: isReadOnly ? "hand-pan" : currentTool,
    });

    // Hover tracking for eraser indicator
    if (currentTool === "eraser") {
      eraserHoverPosRef.current = { x: world.x, y: world.y };
    }

    // Panning
    if (isPanningRef.current) {
      const dx = e.clientX - panStartRef.current.x;
      const dy = e.clientY - panStartRef.current.y;
      onViewportChange({
        x: panStartRef.current.vpX + dx,
        y: panStartRef.current.vpY + dy,
        zoom: viewport.zoom,
      });
      return;
    }

    if (!isDrawingRef.current) return;

    // Eraser stroke deletion while dragging
    if (currentTool === "eraser") {
      if (isErasingRef.current && lastEraserPointRef.current) {
        const p1 = lastEraserPointRef.current;
        const p2 = { x: world.x, y: world.y };
        const eraserRadius = Math.max(22, strokeSize * 3.5) / viewport.zoom;

        const hitIds: string[] = [];
        for (const s of strokesRef.current) {
          if (isStrokeIntersectingSegment(s, p1, p2, eraserRadius)) {
            hitIds.push(s.id);
          }
        }

        if (hitIds.length > 0) {
          if (!hasRecordedUndoInGestureRef.current) {
            onRecordUndoSnapshot?.();
            hasRecordedUndoInGestureRef.current = true;
          }
          const hitSet = new Set(hitIds);
          strokesRef.current = strokesRef.current.filter((s) => !hitSet.has(s.id));
          onStrokesDelete?.(hitIds);
        }

        lastEraserPointRef.current = p2;
      }
      return;
    }

    // Laser pointer mode
    if (currentTool === "laser-pointer") {
      laserPointsRef.current.push({ x: world.x, y: world.y, time: Date.now() });
      return;
    }

    if (!activeStrokeRef.current) return;

    // Extract coalesced points for low-latency high-frequency stylus events
    const coalescedEvents =
      typeof (e as any).getCoalescedEvents === "function"
        ? (e as any).getCoalescedEvents()
        : [e];

    const newPoints: StrokePoint[] = [];
    const isHandwritingTool = currentTool === "fountain-pen" || currentTool === "ballpoint";

    coalescedEvents.forEach((ev: PointerEvent) => {
      const evScreenX = ev.clientX - rect.left;
      const evScreenY = ev.clientY - rect.top;
      const evWorld = screenToWorld(evScreenX, evScreenY);

      let pressure = 0.5;
      if (ev.pointerType === "pen" && ev.pressure > 0) {
        pressure = ev.pressure;
      } else if (lastPointRef.current) {
        // Calculate velocity-based dynamic pressure for natural feel
        const dt = Math.max(1, Date.now() - lastPointRef.current.time);
        const dist = Math.hypot(
          evWorld.x - lastPointRef.current.x,
          evWorld.y - lastPointRef.current.y
        );
        const speed = dist / dt;
        // Faster movement = lighter stroke; slower movement = heavier ink pool
        const targetPressure = Math.max(0.18, Math.min(0.9, 0.95 - speed * 0.28));
        pressure = currentPressureRef.current * 0.7 + targetPressure * 0.3;
      }

      currentPressureRef.current = pressure;
      onPressureChange(pressure);
      lastPointRef.current = { x: evWorld.x, y: evWorld.y, time: Date.now() };

      if (isHandwritingTool && liveSmootherRef.current) {
        const smoother = liveSmootherRef.current;
        const lastRaw = smoother.lastRawPoint;

        const dt = lastRaw ? Math.max(1, Date.now() - (lastRaw.time || 0)) : 16;
        const rawDist = lastRaw ? Math.hypot(evWorld.x - lastRaw.x, evWorld.y - lastRaw.y) : 0;

        // Skip micro-jitter increments (sub-pixel noise below threshold)
        const jitterEpsilon = currentTool === "fountain-pen" ? 0.75 : 0.55;
        if (lastRaw && rawDist < jitterEpsilon && dt < 12) {
          return;
        }

        const speed = rawDist / dt;
        // Dynamic velocity-adapted smoothing weight alpha:
        // Higher speed = higher alpha (follows pen tip immediately without lag)
        // Lower speed = lower alpha (smooths away hand tremor and mouse quantization)
        const baseAlpha = currentTool === "fountain-pen" ? 0.44 : 0.54;
        const speedScale = currentTool === "fountain-pen" ? 0.22 : 0.18;
        const maxAlpha = currentTool === "fountain-pen" ? 0.84 : 0.88;
        const alpha = Math.min(maxAlpha, Math.max(baseAlpha, baseAlpha + speed * speedScale));

        const sx = smoother.smoothedX + (evWorld.x - smoother.smoothedX) * alpha;
        const sy = smoother.smoothedY + (evWorld.y - smoother.smoothedY) * alpha;
        const sp = smoother.smoothedPressure + (pressure - smoother.smoothedPressure) * alpha;

        smoother.smoothedX = sx;
        smoother.smoothedY = sy;
        smoother.smoothedPressure = sp;
        smoother.lastRawPoint = { x: evWorld.x, y: evWorld.y, pressure, time: Date.now() };

        newPoints.push({
          x: sx,
          y: sy,
          pressure: sp,
          time: Date.now(),
        });
      } else {
        newPoints.push({
          x: evWorld.x,
          y: evWorld.y,
          pressure,
          time: Date.now(),
        });
      }
    });

    activeStrokeRef.current.points.push(...newPoints);

    if (onStrokeStream) {
      onStrokeStream(activeStrokeRef.current);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isPanningRef.current) {
      isPanningRef.current = false;
      setIsPanningActive(false);
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {}
      return;
    }

    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}

    if (currentTool === "eraser") {
      isErasingRef.current = false;
      lastEraserPointRef.current = null;
      hasRecordedUndoInGestureRef.current = false;
      return;
    }

    if (currentTool === "laser-pointer") return;

    if (activeStrokeRef.current && activeStrokeRef.current.points.length > 1) {
      // Apply path smoothing algorithm for fountain-pen and ballpoint to make handwriting natural and fluid
      if (
        activeStrokeRef.current.tool === "fountain-pen" ||
        activeStrokeRef.current.tool === "ballpoint"
      ) {
        activeStrokeRef.current.points = smoothHandwritingStrokePath(
          activeStrokeRef.current.points,
          activeStrokeRef.current.tool
        );
      }
      onStrokeCommit(activeStrokeRef.current);
    }
    activeStrokeRef.current = null;
    lastPointRef.current = null;
    liveSmootherRef.current = null;
  };

  // Multi-touch gestures (two-finger pinch to zoom & two-finger pan)
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const midX = (t1.clientX + t2.clientX) / 2 - rect.left;
      const midY = (t1.clientY + t2.clientY) / 2 - rect.top;
      const worldMid = screenToWorld(midX, midY);

      touchPinchRef.current = {
        initialDist: dist,
        initialZoom: viewport.zoom,
        centerScreenX: midX,
        centerScreenY: midY,
        centerWorldX: worldMid.x,
        centerWorldY: worldMid.y,
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2 && touchPinchRef.current) {
      e.preventDefault();
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const currentDist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
      const scale = currentDist / touchPinchRef.current.initialDist;
      const newZoom = Math.min(4.0, Math.max(0.2, touchPinchRef.current.initialZoom * scale));

      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const currentMidX = (t1.clientX + t2.clientX) / 2 - rect.left;
      const currentMidY = (t1.clientY + t2.clientY) / 2 - rect.top;

      const newX = currentMidX - touchPinchRef.current.centerWorldX * newZoom;
      const newY = currentMidY - touchPinchRef.current.centerWorldY * newZoom;

      onViewportChange({
        x: newX,
        y: newY,
        zoom: newZoom,
      });
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length < 2) {
      touchPinchRef.current = null;
    }
  };

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (!onInsertImage || isReadOnly) return;
      // Don't hijack pastes into chat / cell inputs.
      const target = e.target as HTMLElement | null;
      if (target && (["INPUT", "TEXTAREA"].includes(target.tagName) || target.isContentEditable)) return;
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith("image/")) {
          const file = items[i].getAsFile();
          if (file) {
            fileToBoardImage(file)
              .then(({ src, width, height }) => onInsertImage(src, "Pasted Image", width, height))
              .catch((err: Error) => alert(err.message));
          }
          break;
        }
      }
    };
    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [onInsertImage, isReadOnly]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (isReadOnly) return;
    if (!onInsertImage) return;
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const rect = containerRef.current?.getBoundingClientRect();
      const screenX = rect ? e.clientX - rect.left : e.clientX;
      const screenY = rect ? e.clientY - rect.top : e.clientY;
      const world = screenToWorld(screenX, screenY);

      fileToBoardImage(file)
        .then(({ src, width, height }) => onInsertImage(src, file.name, width, height, world.x, world.y))
        .catch((err: Error) => alert(err.message));
    }
  };

  return (
    <div
      ref={containerRef}
      id="whiteboard-canvas-container"
      className="relative w-full h-full overflow-hidden select-none touch-none"
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      style={{
        cursor: activeCursor,
      }}
    >
      {/* HTML5 Canvas for ultra-fast, smooth, low-latency ink drawing */}
      <canvas
        ref={canvasRef}
        id="whiteboard-canvas-layer"
        className="absolute inset-0 block w-full h-full"
        style={{ cursor: activeCursor, touchAction: "none" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onPointerLeave={() => {
          eraserHoverPosRef.current = null;
        }}
      />

      {/* Embedded Multimedia & Office Document Cards */}
      <div id="whiteboard-cards-layer" className="absolute inset-0 pointer-events-none">
        {cards.map((card) => {
          // The live screen-share window is a per-viewer local card, so
          // students may move/resize/close their own copy of it.
          const locked = isReadOnly && card.type !== "screenshare";
          const isSelected = locked ? false : selectedCardId === card.id;
          const commonProps = {
            viewport,
            isSelected,
            onSelect: locked ? () => {} : () => setSelectedCardId(card.id),
            onUpdate: locked ? () => {} : onCardUpdate,
            onDelete: locked ? () => {} : onCardDelete,
          };

          return (
            <div key={card.id} className="pointer-events-auto">
              {card.type === "youtube" && (
                <YouTubeCardComponent card={card as any} {...commonProps} />
              )}
              {card.type === "ppt" && <PPTCardComponent card={card as any} {...commonProps} />}
              {card.type === "word" && <WordCardComponent card={card as any} {...commonProps} />}
              {card.type === "excel" && <ExcelCardComponent card={card as any} {...commonProps} />}
              {card.type === "image" && <ImageCardComponent card={card as any} {...commonProps} />}
              {card.type === "screenshare" && (
                <ScreenShareCardComponent
                  card={card as any}
                  {...commonProps}
                  localUserId={localUserId}
                  onStopScreenShare={onStopScreenShare}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Real-time Collaborative Remote Cursors */}
      <div id="whiteboard-remote-cursors" className="absolute inset-0 pointer-events-none z-20">
        {remoteUsers.map((user) => {
          if (!user.cursor) return null;
          const screenX = user.cursor.x * viewport.zoom + viewport.x;
          const screenY = user.cursor.y * viewport.zoom + viewport.y;

          // The trainer's laser pointer shows as a glowing red dot for students.
          if (user.cursor.tool === "laser-pointer") {
            return (
              <div
                key={user.id}
                className="absolute pointer-events-none"
                style={{ left: `${screenX - 7}px`, top: `${screenY - 7}px` }}
              >
                <span className="block w-3.5 h-3.5 rounded-full bg-rose-500 border-2 border-white shadow-[0_0_16px_6px_rgba(244,63,94,0.55)]" />
              </div>
            );
          }

          return (
            <div
              key={user.id}
              className="absolute pointer-events-none transition-transform duration-75 ease-out flex items-start gap-1"
              style={{
                left: `${screenX}px`,
                top: `${screenY}px`,
              }}
            >
              {/* Cursor SVG with user's unique color */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19841L11.7841 12.3673H5.65376Z"
                  fill={user.color}
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
              </svg>

              {/* User badge tag */}
              <div
                className="px-1.5 py-0.5 rounded-md text-[10px] font-bold text-white shadow-md whitespace-nowrap flex items-center gap-1"
                style={{ backgroundColor: user.color }}
              >
                <span>{user.name}</span>
                {user.cursor.isDrawing && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
