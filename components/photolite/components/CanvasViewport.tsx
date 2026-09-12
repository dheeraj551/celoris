import React, { useRef, useEffect, useState, useCallback } from 'react';
import { ZoomIn, ZoomOut, Maximize2, RotateCcw } from 'lucide-react';
import {
  ToolType,
  Layer,
  SelectionState,
  PenPath,
  CropBox,
} from '../types';
import {
  renderCompositeCanvas,
  magicWandSelection,
  floodFill,
  hexToRgba,
  createCanvas,
} from '../utils/canvasUtils';
import {
  drawMarchingAnts,
  createLassoMaskCanvas,
  createRectMaskCanvas,
  clearSelectionFromLayer,
} from '../utils/selectionUtils';

interface CanvasViewportProps {
  canvasWidth: number;
  canvasHeight: number;
  layers: Layer[];
  activeLayerId: string;
  activeTool: ToolType;
  foregroundColor: string;
  backgroundColor: string;
  setForegroundColor: (color: string) => void;
  brushSize: number;
  brushOpacity: number;
  brushHardness: number;
  wandTolerance: number;
  selection: SelectionState;
  setSelection: (sel: SelectionState) => void;
  penPath: PenPath;
  setPenPath: (path: PenPath | ((prev: PenPath) => PenPath)) => void;
  cropBox: CropBox;
  setCropBox: (box: CropBox | ((prev: CropBox) => CropBox)) => void;
  cropAspectRatio: number | null;
  onApplyCrop: () => void;
  shapeType: 'rect' | 'circle' | 'line';
  shapeStrokeWidth: number;
  zoom: number;
  setZoom: (z: number | ((prev: number) => number)) => void;
  pan: { x: number; y: number };
  setPan: (p: { x: number; y: number } | ((prev: { x: number; y: number }) => { x: number; y: number })) => void;
  onLayerPixelChange: (layerId: string, actionName: string) => void;
  onLayerPositionChange: (layerId: string, x: number, y: number) => void;
  onLayerAngleChange?: (layerId: string, angle: number, commit?: boolean) => void;
}

export const CanvasViewport: React.FC<CanvasViewportProps> = ({
  canvasWidth,
  canvasHeight,
  layers,
  activeLayerId,
  activeTool,
  foregroundColor,
  backgroundColor,
  setForegroundColor,
  brushSize,
  brushOpacity,
  brushHardness,
  wandTolerance,
  selection,
  setSelection,
  penPath,
  setPenPath,
  cropBox,
  setCropBox,
  cropAspectRatio,
  onApplyCrop,
  shapeType,
  shapeStrokeWidth,
  zoom,
  setZoom,
  pan,
  setPan,
  onLayerPixelChange,
  onLayerPositionChange,
  onLayerAngleChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mainCanvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);

  // Interaction tracking state
  const isInteractingRef = useRef(false);
  const isSpacePressedRef = useRef(false);
  const isRotatingRef = useRef(false);
  const rotateStartAngleRef = useRef(0);
  const layerInitialAngleRef = useRef(0);
  const startPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const startPanRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const lastMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const activeCropHandleRef = useRef<string | null>(null);

  // Active layer start position for Move tool
  const activeLayerStartPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Current stroke / shape / lasso in-progress points
  const tempPolygonRef = useRef<{ x: number; y: number }[]>([]);
  const tempRectRef = useRef<{ x: number; y: number; width: number; height: number } | null>(null);
  const tempShapeStartRef = useRef<{ x: number; y: number } | null>(null);

  // Marching ants animation offset
  const [dashOffset, setDashOffset] = useState(0);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const activeLayer = layers.find((l) => l.id === activeLayerId);

  // Animate marching ants
  useEffect(() => {
    let animId: number;
    const animate = () => {
      setDashOffset((prev) => (prev + 0.5) % 16);
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Listen for space key for quick panning
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !isSpacePressedRef.current && (e.target as HTMLElement).tagName !== 'INPUT') {
        isSpacePressedRef.current = true;
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        isSpacePressedRef.current = false;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Calculate zoom to fit entire canvas in current viewport
  const fitToScreen = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const padding = 48;
    const availW = Math.max(80, container.clientWidth - padding);
    const availH = Math.max(80, container.clientHeight - padding);
    const scaleW = availW / canvasWidth;
    const scaleH = availH / canvasHeight;
    const fit = Math.min(scaleW, scaleH, 1);
    setZoom(Math.max(0.1, Number(fit.toFixed(2))));
    setPan({ x: 0, y: 0 });
  }, [canvasWidth, canvasHeight, setZoom, setPan]);

  // Auto-fit once on mount and when canvas size changes
  useEffect(() => {
    const timer = setTimeout(() => {
      fitToScreen();
    }, 60);
    return () => clearTimeout(timer);
  }, [canvasWidth, canvasHeight, fitToScreen]);

  // Render main composite canvas whenever layers change
  useEffect(() => {
    const canvas = mainCanvasRef.current;
    if (!canvas) return;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Render layers
    layers.forEach((layer) => {
      if (!layer.visible) return;

      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, layer.opacity));
      ctx.globalCompositeOperation = layer.blendMode;

      if (layer.filters) {
        const f = layer.filters;
        const b = 100 + f.brightness;
        const c = 100 + f.contrast;
        const s = 100 + f.saturation;
        const h = f.hue;
        const blur = f.blur;
        const inv = f.invert ? 100 : 0;
        try {
          ctx.filter = `brightness(${b}%) contrast(${c}%) saturate(${s}%) hue-rotate(${h}deg) blur(${blur}px) invert(${inv}%)`;
        } catch {
          // Fallback if browser does not support ctx.filter
        }
      }

      // Apply rotation transformation matrix around layer center
      if (layer.angle) {
        const cx = layer.x + layer.width / 2;
        const cy = layer.y + layer.height / 2;
        ctx.translate(cx, cy);
        ctx.rotate((layer.angle * Math.PI) / 180);
        ctx.translate(-cx, -cy);
      }

      ctx.drawImage(layer.canvas, layer.x, layer.y);
      ctx.restore();
    });
  }, [layers, canvasWidth, canvasHeight]);

  // Render overlay elements (marching ants, lasso preview, pen paths, crop box)
  useEffect(() => {
    const overlay = overlayCanvasRef.current;
    if (!overlay) return;

    overlay.width = canvasWidth;
    overlay.height = canvasHeight;
    const ctx = overlay.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // 1. Draw Active Selection (Marching Ants)
    if (selection.active) {
      drawMarchingAnts(ctx, selection, dashOffset);
    }

    // 2. Draw in-progress Lasso path
    if (activeTool === 'lasso' && isInteractingRef.current && tempPolygonRef.current.length > 1) {
      ctx.save();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.lineDashOffset = dashOffset;
      ctx.beginPath();
      ctx.moveTo(tempPolygonRef.current[0].x, tempPolygonRef.current[0].y);
      for (let i = 1; i < tempPolygonRef.current.length; i++) {
        ctx.lineTo(tempPolygonRef.current[i].x, tempPolygonRef.current[i].y);
      }
      ctx.stroke();
      ctx.restore();
    }

    // 3. Draw in-progress Marquee Rect
    if (activeTool === 'marquee' && isInteractingRef.current && tempRectRef.current) {
      const { x, y, width, height } = tempRectRef.current;
      ctx.save();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.lineDashOffset = dashOffset;
      ctx.strokeRect(
        width < 0 ? x + width : x,
        height < 0 ? y + height : y,
        Math.abs(width),
        Math.abs(height)
      );
      ctx.restore();
    }

    // 4. Draw Pen Tool paths, nodes, and handles
    if (activeTool === 'pen' && penPath.points.length > 0) {
      ctx.save();
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 2;
      ctx.beginPath();

      penPath.points.forEach((pt, i) => {
        if (i === 0) {
          ctx.moveTo(pt.x, pt.y);
        } else {
          const prev = penPath.points[i - 1];
          if (prev.cp2 && pt.cp1) {
            ctx.bezierCurveTo(prev.cp2.x, prev.cp2.y, pt.cp1.x, pt.cp1.y, pt.x, pt.y);
          } else {
            ctx.lineTo(pt.x, pt.y);
          }
        }
      });

      if (penPath.closed && penPath.points.length > 2) {
        ctx.closePath();
      }
      ctx.stroke();

      // Draw anchor point boxes
      penPath.points.forEach((pt, i) => {
        ctx.fillStyle = i === 0 ? '#38bdf8' : '#ffffff';
        ctx.strokeStyle = '#0369a1';
        ctx.lineWidth = 1.5;
        ctx.fillRect(pt.x - 3.5, pt.y - 3.5, 7, 7);
        ctx.strokeRect(pt.x - 3.5, pt.y - 3.5, 7, 7);
      });

      ctx.restore();
    }

    // 5. Draw Crop Tool bounding box with 8 handles & Rule of Thirds
    if (activeTool === 'crop') {
      const { x, y, width, height } = cropBox;
      ctx.save();

      // Dim outside area
      ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
      ctx.fillRect(0, 0, canvasWidth, y);
      ctx.fillRect(0, y + height, canvasWidth, canvasHeight - (y + height));
      ctx.fillRect(0, y, x, height);
      ctx.fillRect(x + width, y, canvasWidth - (x + width), height);

      // Crop boundary
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(x, y, width, height);

      // Rule of thirds grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      // vertical lines
      ctx.moveTo(x + width / 3, y);
      ctx.lineTo(x + width / 3, y + height);
      ctx.moveTo(x + (width * 2) / 3, y);
      ctx.lineTo(x + (width * 2) / 3, y + height);
      // horizontal lines
      ctx.moveTo(x, y + height / 3);
      ctx.lineTo(x + width, y + height / 3);
      ctx.moveTo(x, y + (height * 2) / 3);
      ctx.lineTo(x + width, y + (height * 2) / 3);
      ctx.stroke();

      // 8 Handles
      const handles = [
        { id: 'tl', hx: x, hy: y },
        { id: 'tm', hx: x + width / 2, hy: y },
        { id: 'tr', hx: x + width, hy: y },
        { id: 'ml', hx: x, hy: y + height / 2 },
        { id: 'mr', hx: x + width, hy: y + height / 2 },
        { id: 'bl', hx: x, hy: y + height },
        { id: 'bm', hx: x + width / 2, hy: y + height },
        { id: 'br', hx: x + width, hy: y + height },
      ];

      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1;
      handles.forEach((h) => {
        ctx.fillRect(h.hx - 4, h.hy - 4, 8, 8);
        ctx.strokeRect(h.hx - 4, h.hy - 4, 8, 8);
      });

      ctx.restore();
    }

    // 6. Draw Move & Rotate tool bounding box for active layer
    if ((activeTool === 'select' || activeTool === 'rotate') && activeLayer) {
      ctx.save();
      const cx = activeLayer.x + activeLayer.width / 2;
      const cy = activeLayer.y + activeLayer.height / 2;
      const angle = activeLayer.angle || 0;
      if (angle) {
        ctx.translate(cx, cy);
        ctx.rotate((angle * Math.PI) / 180);
        ctx.translate(-cx, -cy);
      }

      // Layer outline
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.9)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.strokeRect(activeLayer.x, activeLayer.y, activeLayer.width, activeLayer.height);

      // Center pivot point
      ctx.setLineDash([]);
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(cx, cy, 3, 0, Math.PI * 2);
      ctx.fill();

      // Rotation stem & handle above top edge
      const rotHandleDist = 22;
      const rotHandleY = activeLayer.y - rotHandleDist;
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(cx, activeLayer.y);
      ctx.lineTo(cx, rotHandleY);
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(cx, rotHandleY, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Corner handles
      const corners = [
        { x: activeLayer.x, y: activeLayer.y },
        { x: activeLayer.x + activeLayer.width, y: activeLayer.y },
        { x: activeLayer.x + activeLayer.width, y: activeLayer.y + activeLayer.height },
        { x: activeLayer.x, y: activeLayer.y + activeLayer.height },
      ];
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 1;
      corners.forEach((c) => {
        ctx.fillRect(c.x - 3.5, c.y - 3.5, 7, 7);
        ctx.strokeRect(c.x - 3.5, c.y - 3.5, 7, 7);
      });

      // Display angle indicator badge if rotated
      if (angle !== 0) {
        ctx.font = '10px monospace';
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        const text = `${Math.round(angle * 10) / 10}°`;
        const textW = ctx.measureText(text).width;
        ctx.fillRect(cx - textW / 2 - 4, rotHandleY - 18, textW + 8, 14);
        ctx.fillStyle = '#38bdf8';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, cx, rotHandleY - 11);
      }

      ctx.restore();
    }
  }, [
    canvasWidth,
    canvasHeight,
    selection,
    penPath,
    cropBox,
    activeTool,
    activeLayer,
    dashOffset,
  ]);

  // Convert client viewport coordinates to Canvas Pixel coordinates
  const clientToCanvasCoord = useCallback(
    (clientX: number, clientY: number) => {
      const container = containerRef.current;
      if (!container) return { x: 0, y: 0 };
      const rect = container.getBoundingClientRect();

      // Container center
      const centerX = rect.width / 2 + pan.x;
      const centerY = rect.height / 2 + pan.y;

      const canvasRenderW = canvasWidth * zoom;
      const canvasRenderH = canvasHeight * zoom;

      const canvasLeft = centerX - canvasRenderW / 2;
      const canvasTop = centerY - canvasRenderH / 2;

      const mouseX = clientX - rect.left;
      const mouseY = clientY - rect.top;

      const px = (mouseX - canvasLeft) / zoom;
      const py = (mouseY - canvasTop) / zoom;

      return { x: px, y: py };
    },
    [canvasWidth, canvasHeight, pan, zoom]
  );

  // Wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.12 : 0.88;
    setZoom((prev) => Math.max(0.1, Math.min(10, prev * zoomFactor)));
  };

  // Mouse / Pointer Events
  const handlePointerDown = (e: React.PointerEvent) => {
    const coords = clientToCanvasCoord(e.clientX, e.clientY);
    lastMousePosRef.current = coords;
    startPosRef.current = coords;
    startPanRef.current = { ...pan };
    isInteractingRef.current = true;

    // Pan with space or middle mouse or Hand tool
    if (isSpacePressedRef.current || e.button === 1 || activeTool === 'hand') {
      return;
    }

    // Zoom tool
    if (activeTool === 'zoom') {
      if (e.altKey) {
        setZoom((prev) => Math.max(0.1, prev * 0.7));
      } else {
        setZoom((prev) => Math.min(10, prev * 1.4));
      }
      return;
    }

    // Eyedropper
    if (activeTool === 'eyedropper') {
      const canvas = mainCanvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const pixel = ctx.getImageData(Math.floor(coords.x), Math.floor(coords.y), 1, 1).data;
          const hex = `#${((1 << 24) + (pixel[0] << 16) + (pixel[1] << 8) + pixel[2])
            .toString(16)
            .slice(1)}`;
          setForegroundColor(hex);
        }
      }
      return;
    }

    // Magic Wand Tool (click)
    if (activeTool === 'wand') {
      const mainCanvas = mainCanvasRef.current;
      if (mainCanvas) {
        const maskCanvas = magicWandSelection(
          mainCanvas,
          coords.x,
          coords.y,
          wandTolerance
        );
        setSelection({
          active: true,
          type: 'wand',
          maskCanvas,
        });
      }
      return;
    }

    // Paint Bucket Tool (click)
    if (activeTool === 'bucket' && activeLayer && !activeLayer.locked) {
      const ctx = activeLayer.canvas.getContext('2d');
      if (ctx) {
        floodFill(
          ctx,
          coords.x - activeLayer.x,
          coords.y - activeLayer.y,
          foregroundColor,
          wandTolerance,
          activeLayer.width,
          activeLayer.height
        );
        onLayerPixelChange(activeLayer.id, 'Paint Bucket Fill');
      }
      return;
    }

    // Pen Tool (click to add points)
    if (activeTool === 'pen') {
      // Check if closing path on first point
      if (penPath.points.length > 2) {
        const first = penPath.points[0];
        const dist = Math.hypot(coords.x - first.x, coords.y - first.y);
        if (dist < 10) {
          setPenPath((prev) => ({ ...prev, closed: true }));
          return;
        }
      }

      setPenPath((prev) => ({
        ...prev,
        points: [...prev.points, { x: coords.x, y: coords.y }],
      }));
      return;
    }

    // Crop Tool Handle Check
    if (activeTool === 'crop') {
      const { x, y, width, height } = cropBox;
      const hitRadius = 12 / zoom;
      const handleHits = [
        { id: 'tl', hx: x, hy: y },
        { id: 'tm', hx: x + width / 2, hy: y },
        { id: 'tr', hx: x + width, hy: y },
        { id: 'ml', hx: x, hy: y + height / 2 },
        { id: 'mr', hx: x + width, hy: y + height / 2 },
        { id: 'bl', hx: x, hy: y + height },
        { id: 'bm', hx: x + width / 2, hy: y + height },
        { id: 'br', hx: x + width, hy: y + height },
      ];

      for (const h of handleHits) {
        if (Math.hypot(coords.x - h.hx, coords.y - h.hy) <= hitRadius) {
          activeCropHandleRef.current = h.id;
          return;
        }
      }
      // Or move entire crop box
      if (coords.x >= x && coords.x <= x + width && coords.y >= y && coords.y <= y + height) {
        activeCropHandleRef.current = 'move';
        return;
      }
      return;
    }

    // Move / Transform Tool / Rotate Tool
    if ((activeTool === 'select' || activeTool === 'rotate') && activeLayer && !activeLayer.locked) {
      const cx = activeLayer.x + activeLayer.width / 2;
      const cy = activeLayer.y + activeLayer.height / 2;
      const angle = activeLayer.angle || 0;
      const rad = (angle * Math.PI) / 180;
      const cosA = Math.cos(rad);
      const sinA = Math.sin(rad);

      // Rotation handle location in world coordinates
      const relHandleY = -activeLayer.height / 2 - 22;
      const rotHandleWorldX = cx + (0 * cosA - relHandleY * sinA);
      const rotHandleWorldY = cy + (0 * sinA + relHandleY * cosA);

      const hitDist = 14 / zoom;
      const isOverRotHandle = Math.hypot(coords.x - rotHandleWorldX, coords.y - rotHandleWorldY) <= hitDist;

      if (isOverRotHandle || activeTool === 'rotate') {
        isRotatingRef.current = true;
        layerInitialAngleRef.current = activeLayer.angle || 0;
        rotateStartAngleRef.current = Math.atan2(coords.y - cy, coords.x - cx) * (180 / Math.PI);
        return;
      }

      if (activeTool === 'select') {
        activeLayerStartPosRef.current = { x: activeLayer.x, y: activeLayer.y };
        return;
      }
    }

    // Lasso Tool
    if (activeTool === 'lasso') {
      tempPolygonRef.current = [{ x: coords.x, y: coords.y }];
      return;
    }

    // Marquee Tool
    if (activeTool === 'marquee') {
      tempRectRef.current = { x: coords.x, y: coords.y, width: 0, height: 0 };
      return;
    }

    // Shape Tool
    if (activeTool === 'shape' && activeLayer && !activeLayer.locked) {
      tempShapeStartRef.current = { x: coords.x, y: coords.y };
      return;
    }

    // Brush or Eraser Tool start stroke
    if ((activeTool === 'brush' || activeTool === 'eraser') && activeLayer && !activeLayer.locked) {
      const ctx = activeLayer.canvas.getContext('2d');
      if (ctx) {
        ctx.save();
        if (selection.active && selection.maskCanvas) {
          // Clip drawing to selection mask if present
          // We can use a pattern or composite operation
        }

        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = brushSize;

        if (activeTool === 'eraser') {
          ctx.globalCompositeOperation = 'destination-out';
          ctx.globalAlpha = brushOpacity;
        } else {
          ctx.globalCompositeOperation = 'source-over';
          ctx.globalAlpha = brushOpacity;
          ctx.strokeStyle = foregroundColor;
        }

        ctx.beginPath();
        const lx = coords.x - activeLayer.x;
        const ly = coords.y - activeLayer.y;
        ctx.moveTo(lx, ly);
        ctx.lineTo(lx, ly);
        ctx.stroke();
        ctx.restore();
      }
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const coords = clientToCanvasCoord(e.clientX, e.clientY);
    setCursorPos(coords);

    if (!isInteractingRef.current) return;

    // Pan with space or middle mouse or Hand tool
    if (isSpacePressedRef.current || e.buttons === 4 || activeTool === 'hand') {
      const dx = e.clientX - lastMousePosRef.current.x;
      const dy = e.clientY - lastMousePosRef.current.y;
      setPan((prev) => ({
        x: prev.x + (e.movementX || 0),
        y: prev.y + (e.movementY || 0),
      }));
      return;
    }

    // Rotate Layer with handle or rotate tool
    if (isRotatingRef.current && activeLayer && !activeLayer.locked) {
      const cx = activeLayer.x + activeLayer.width / 2;
      const cy = activeLayer.y + activeLayer.height / 2;
      const currentMouseAngle = Math.atan2(coords.y - cy, coords.x - cx) * (180 / Math.PI);
      const deltaAngle = currentMouseAngle - rotateStartAngleRef.current;
      let newAngle = layerInitialAngleRef.current + deltaAngle;

      if (e.shiftKey) {
        newAngle = Math.round(newAngle / 15) * 15;
      } else {
        newAngle = Math.round(newAngle * 10) / 10;
      }

      while (newAngle > 180) newAngle -= 360;
      while (newAngle < -180) newAngle += 360;

      if (onLayerAngleChange) {
        onLayerAngleChange(activeLayer.id, newAngle, false);
      }
      return;
    }

    // Move Layer with Move tool
    if (activeTool === 'select' && activeLayer && !activeLayer.locked) {
      const dx = coords.x - startPosRef.current.x;
      const dy = coords.y - startPosRef.current.y;
      onLayerPositionChange(
        activeLayer.id,
        Math.round(activeLayerStartPosRef.current.x + dx),
        Math.round(activeLayerStartPosRef.current.y + dy)
      );
      return;
    }

    // Crop box resize / move
    if (activeTool === 'crop' && activeCropHandleRef.current) {
      const handle = activeCropHandleRef.current;
      setCropBox((prev) => {
        let { x, y, width, height } = prev;
        const dx = coords.x - lastMousePosRef.current.x;
        const dy = coords.y - lastMousePosRef.current.y;

        if (handle === 'move') {
          x = Math.max(0, Math.min(canvasWidth - width, x + dx));
          y = Math.max(0, Math.min(canvasHeight - height, y + dy));
        } else {
          if (handle.includes('r')) width += dx;
          if (handle.includes('l')) {
            x += dx;
            width -= dx;
          }
          if (handle.includes('b')) height += dy;
          if (handle.includes('t')) {
            y += dy;
            height -= dy;
          }

          // Aspect ratio enforcement
          if (cropAspectRatio !== null) {
            if (handle.includes('r') || handle.includes('l')) {
              height = width / cropAspectRatio;
            } else {
              width = height * cropAspectRatio;
            }
          }
        }

        return {
          x: Math.round(x),
          y: Math.round(y),
          width: Math.max(20, Math.round(width)),
          height: Math.max(20, Math.round(height)),
        };
      });
      lastMousePosRef.current = coords;
      return;
    }

    // Lasso drawing
    if (activeTool === 'lasso') {
      tempPolygonRef.current.push({ x: coords.x, y: coords.y });
      return;
    }

    // Marquee rect drag
    if (activeTool === 'marquee' && tempRectRef.current) {
      tempRectRef.current = {
        x: startPosRef.current.x,
        y: startPosRef.current.y,
        width: coords.x - startPosRef.current.x,
        height: coords.y - startPosRef.current.y,
      };
      return;
    }

    // Brush or Eraser stroke
    if ((activeTool === 'brush' || activeTool === 'eraser') && activeLayer && !activeLayer.locked) {
      const ctx = activeLayer.canvas.getContext('2d');
      if (ctx) {
        ctx.save();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = brushSize;

        if (activeTool === 'eraser') {
          ctx.globalCompositeOperation = 'destination-out';
          ctx.globalAlpha = brushOpacity;
        } else {
          ctx.globalCompositeOperation = 'source-over';
          ctx.globalAlpha = brushOpacity;
          ctx.strokeStyle = foregroundColor;
        }

        ctx.beginPath();
        ctx.moveTo(
          lastMousePosRef.current.x - activeLayer.x,
          lastMousePosRef.current.y - activeLayer.y
        );
        ctx.lineTo(coords.x - activeLayer.x, coords.y - activeLayer.y);
        ctx.stroke();
        ctx.restore();
      }
      lastMousePosRef.current = coords;
    }
  };

  const handlePointerUp = () => {
    if (!isInteractingRef.current) return;
    isInteractingRef.current = false;
    activeCropHandleRef.current = null;

    // Rotate Layer end
    if (isRotatingRef.current) {
      isRotatingRef.current = false;
      if (activeLayer && onLayerAngleChange) {
        onLayerAngleChange(activeLayer.id, activeLayer.angle || 0, true);
      }
    }

    // Brush / Eraser end
    if ((activeTool === 'brush' || activeTool === 'eraser') && activeLayer) {
      onLayerPixelChange(activeLayer.id, activeTool === 'brush' ? 'Brush Stroke' : 'Eraser Stroke');
    }

    // Move Layer end
    if (activeTool === 'select' && activeLayer) {
      onLayerPixelChange(activeLayer.id, 'Move Layer');
    }

    // Lasso complete
    if (activeTool === 'lasso' && tempPolygonRef.current.length > 2) {
      const polygon = [...tempPolygonRef.current];
      const mask = createLassoMaskCanvas(polygon, canvasWidth, canvasHeight);
      setSelection({
        active: true,
        type: 'lasso',
        polygon,
        maskCanvas: mask,
      });
      tempPolygonRef.current = [];
    }

    // Marquee complete
    if (activeTool === 'marquee' && tempRectRef.current) {
      const rect = { ...tempRectRef.current };
      if (Math.abs(rect.width) > 4 && Math.abs(rect.height) > 4) {
        const mask = createRectMaskCanvas(rect, canvasWidth, canvasHeight);
        setSelection({
          active: true,
          type: 'rect',
          rect,
          maskCanvas: mask,
        });
      }
      tempRectRef.current = null;
    }

    // Shape complete
    if (activeTool === 'shape' && activeLayer && !activeLayer.locked && tempShapeStartRef.current) {
      const start = tempShapeStartRef.current;
      const end = lastMousePosRef.current;
      const ctx = activeLayer.canvas.getContext('2d');
      if (ctx) {
        ctx.save();
        ctx.strokeStyle = foregroundColor;
        ctx.fillStyle = backgroundColor;
        ctx.lineWidth = shapeStrokeWidth;

        const lx = start.x - activeLayer.x;
        const ly = start.y - activeLayer.y;
        const lw = end.x - start.x;
        const lh = end.y - start.y;

        if (shapeType === 'rect') {
          ctx.strokeRect(lw < 0 ? lx + lw : lx, lh < 0 ? ly + lh : ly, Math.abs(lw), Math.abs(lh));
        } else if (shapeType === 'circle') {
          const rx = Math.abs(lw) / 2;
          const ry = Math.abs(lh) / 2;
          ctx.beginPath();
          ctx.ellipse(lx + lw / 2, ly + lh / 2, Math.max(1, rx), Math.max(1, ry), 0, 0, Math.PI * 2);
          ctx.stroke();
        } else if (shapeType === 'line') {
          ctx.beginPath();
          ctx.moveTo(lx, ly);
          ctx.lineTo(lx + lw, ly + lh);
          ctx.stroke();
        }
        ctx.restore();
        onLayerPixelChange(activeLayer.id, 'Draw Shape');
      }
      tempShapeStartRef.current = null;
    }
  };

  // Cursor style based on tool
  let cursorStyle = 'default';
  if (isSpacePressedRef.current || activeTool === 'hand') {
    cursorStyle = isInteractingRef.current ? 'grabbing' : 'grab';
  } else if (activeTool === 'brush' || activeTool === 'eraser') {
    cursorStyle = 'crosshair';
  } else if (activeTool === 'eyedropper') {
    cursorStyle = 'crosshair';
  } else if (activeTool === 'select') {
    cursorStyle = 'move';
  } else if (activeTool === 'rotate') {
    cursorStyle = isRotatingRef.current ? 'grabbing' : 'crosshair';
  } else if (activeTool === 'crop') {
    cursorStyle = 'crosshair';
  } else if (activeTool === 'wand' || activeTool === 'bucket') {
    cursorStyle = 'crosshair';
  } else if (activeTool === 'lasso' || activeTool === 'marquee' || activeTool === 'pen') {
    cursorStyle = 'crosshair';
  }

  return (
    <div
      id="canvas-viewport-container"
      ref={containerRef}
      onWheel={handleWheel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      style={{ cursor: cursorStyle }}
      className="relative flex-1 overflow-hidden bg-[#1a1a1a] select-none touch-none flex items-center justify-center"
    >
      {/* Viewport content transformed by Pan & Zoom */}
      <div
        id="canvas-transform-wrapper"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: 'center center',
          width: `${canvasWidth}px`,
          height: `${canvasHeight}px`,
        }}
        className="relative shadow-2xl transition-transform duration-75 ease-out shrink-0 border border-black"
      >
        {/* Transparency Checkered Backdrop */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(45deg, #2b2b2b 25%, transparent 25%), linear-gradient(-45deg, #2b2b2b 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #2b2b2b 75%), linear-gradient(-45deg, transparent 75%, #2b2b2b 75%)',
            backgroundSize: '16px 16px',
            backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px',
            backgroundColor: '#1f1f1f',
          }}
        />

        {/* Main Composite Canvas */}
        <canvas
          id="main-photolite-canvas"
          ref={mainCanvasRef}
          className="relative z-10 block pointer-events-none"
        />

        {/* Interactive Overlay Canvas (marching ants, lasso lines, pen paths, crop handles) */}
        <canvas
          id="overlay-photolite-canvas"
          ref={overlayCanvasRef}
          className="absolute inset-0 z-20 pointer-events-none"
        />
      </div>

      {/* Bottom Floating Canvas Status Bar with Zoom Controls */}
      <div className="absolute bottom-2 left-3 z-30 flex items-center gap-2 rounded bg-[#2b2b2b] px-2.5 py-1 text-[10px] font-mono text-gray-400 border border-black shadow-md">
        <span>X: {Math.round(cursorPos.x)}px</span>
        <span>Y: {Math.round(cursorPos.y)}px</span>
        <span className="text-black">|</span>
        <span className="text-gray-300">
          {canvasWidth}×{canvasHeight}
        </span>
        <span className="text-black">|</span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            title="Zoom Out"
            onClick={() => setZoom((z) => Math.max(0.1, Number((z * 0.8).toFixed(2))))}
            className="p-0.5 hover:text-white rounded hover:bg-[#1a1a1a] cursor-pointer"
          >
            <ZoomOut className="h-3 w-3" />
          </button>
          <button
            type="button"
            title="Reset to 100%"
            onClick={() => {
              setZoom(1);
              setPan({ x: 0, y: 0 });
            }}
            className="text-cyan-400 font-semibold hover:underline cursor-pointer px-0.5"
          >
            {Math.round(zoom * 100)}%
          </button>
          <button
            type="button"
            title="Zoom In"
            onClick={() => setZoom((z) => Math.min(8, Number((z * 1.25).toFixed(2))))}
            className="p-0.5 hover:text-white rounded hover:bg-[#1a1a1a] cursor-pointer"
          >
            <ZoomIn className="h-3 w-3" />
          </button>
        </div>
        <span className="text-black">|</span>
        <button
          type="button"
          title="Fit Canvas to Screen"
          onClick={fitToScreen}
          className="flex items-center gap-1 hover:text-white rounded px-1.5 py-0.5 bg-[#1a1a1a] border border-black cursor-pointer text-gray-300 hover:border-cyan-400 transition-colors"
        >
          <Maximize2 className="h-2.5 w-2.5 text-cyan-400" />
          <span>Fit</span>
        </button>
      </div>
    </div>
  );
};
