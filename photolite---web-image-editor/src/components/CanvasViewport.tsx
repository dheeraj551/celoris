import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCcw,
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Check,
  Trash2,
  Sparkles,
  Paintbrush,
  PaintBucket,
  X,
} from 'lucide-react';
import {
  ToolType,
  Layer,
  SelectionState,
  PenPoint,
  PenPath,
  CropBox,
} from '../types';
import {
  renderCompositeCanvas,
  magicWandSelection,
  floodFill,
  hexToRgba,
  createCanvas,
  cloneCanvas,
  tracePenPath,
} from '../utils/canvasUtils';
import {
  drawMarchingAnts,
  createLassoMaskCanvas,
  createRectMaskCanvas,
  clearSelectionFromLayer,
  getSelectionBounds,
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
  // Text Tool props
  textString?: string;
  setTextString?: (s: string) => void;
  textFontSize?: number;
  setTextFontSize?: (s: number) => void;
  textFontFamily?: string;
  setTextFontFamily?: (f: string) => void;
  textColor?: string;
  setTextColor?: (c: string) => void;
  textBold?: boolean;
  setTextBold?: (b: boolean) => void;
  textItalic?: boolean;
  setTextItalic?: (i: boolean) => void;
  textAlign?: 'left' | 'center' | 'right';
  setTextAlign?: (a: 'left' | 'center' | 'right') => void;
  editingTextLayerId?: string | null;
  setEditingTextLayerId?: (id: string | null) => void;
  onCreateTextAt?: (x: number, y: number, initialText?: string) => void;
  onUpdateActiveText?: (
    overrideText?: string,
    overrideSize?: number,
    overrideBold?: boolean,
    overrideItalic?: boolean,
    overrideFontFamily?: string,
    overrideColor?: string,
    overrideAlign?: 'left' | 'center' | 'right',
    commit?: boolean
  ) => void;
  onDeleteLayer?: () => void;
  setActiveLayerId?: (id: string) => void;
  setActiveTool?: (tool: ToolType) => void;
  onPenStroke?: () => void;
  onPenFill?: () => void;
  onPenMakeSelection?: () => void;
  onPenClear?: () => void;
}

// Photoshop-style Fountain Pen Nib Cursors
const PEN_CURSOR = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpolygon points='12.5,17.5 15,20 20,15 17.5,12.5' fill='%2327272a' stroke='%23000000' stroke-width='1.2'/%3E%3Cpolygon points='1,1 5,15.5 12.5,17.5 17.5,12.5 15.5,5' fill='%23ffffff' stroke='%23000000' stroke-width='1.5' stroke-linejoin='round'/%3E%3Cline x1='1' y1='1' x2='8.5' y2='8.5' stroke='%23000000' stroke-width='1.2' stroke-linecap='round'/%3E%3Ccircle cx='9.5' cy='9.5' r='1.2' fill='%23000000'/%3E%3C/svg%3E") 1 1, crosshair`;

const PEN_CLOSE_CURSOR = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpolygon points='12.5,17.5 15,20 20,15 17.5,12.5' fill='%2327272a' stroke='%23000000' stroke-width='1.2'/%3E%3Cpolygon points='1,1 5,15.5 12.5,17.5 17.5,12.5 15.5,5' fill='%23ffffff' stroke='%23000000' stroke-width='1.5' stroke-linejoin='round'/%3E%3Cline x1='1' y1='1' x2='8.5' y2='8.5' stroke='%23000000' stroke-width='1.2' stroke-linecap='round'/%3E%3Ccircle cx='9.5' cy='9.5' r='1.2' fill='%23000000'/%3E%3Ccircle cx='18' cy='18' r='3.2' fill='%23ffffff' stroke='%2316a34a' stroke-width='1.6'/%3E%3C/svg%3E") 1 1, crosshair`;

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
  textString = '',
  setTextString,
  textFontSize = 36,
  setTextFontSize,
  textFontFamily = '"Segoe UI", Roboto, sans-serif',
  setTextFontFamily,
  textColor = '#ffffff',
  setTextColor,
  textBold = true,
  setTextBold,
  textItalic = false,
  setTextItalic,
  textAlign = 'center',
  setTextAlign,
  editingTextLayerId = null,
  setEditingTextLayerId,
  onCreateTextAt,
  onUpdateActiveText,
  onDeleteLayer,
  setActiveLayerId,
  setActiveTool,
  onPenStroke,
  onPenFill,
  onPenMakeSelection,
  onPenClear,
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

  // Moving selection tracking state
  const isMovingSelectionRef = useRef(false);
  const selectionDragDataRef = useRef<{
    origSelection: SelectionState;
    origBounds: { x: number; y: number; width: number; height: number };
    baseLayerCanvas: HTMLCanvasElement;
    floatingCanvas: HTMLCanvasElement;
    layerX: number;
    layerY: number;
  } | null>(null);

  // Current stroke / shape / lasso in-progress points
  const tempPolygonRef = useRef<{ x: number; y: number }[]>([]);
  const tempRectRef = useRef<{ x: number; y: number; width: number; height: number } | null>(null);
  const tempShapeStartRef = useRef<{ x: number; y: number } | null>(null);

  // Marching ants animation offset
  const [dashOffset, setDashOffset] = useState(0);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Pen tool interaction state & tracking
  const [selectedPenPointIndex, setSelectedPenPointIndex] = useState<number | null>(null);
  const [penHoverTarget, setPenHoverTarget] = useState<{
    type: 'anchor' | 'cp1' | 'cp2' | 'close';
    pointIndex: number;
  } | null>(null);

  const penDragRef = useRef<{
    mode: 'create_point' | 'move_anchor' | 'move_handle';
    pointIndex: number;
    handleType?: 'cp1' | 'cp2';
    startCoords: { x: number; y: number };
    origPoint: PenPoint;
    hasDragged?: boolean;
    altPressed?: boolean;
  } | null>(null);

  const activeLayer = layers.find((l) => l.id === activeLayerId);

  const [isPenClosedPopupDismissed, setIsPenClosedPopupDismissed] = useState(false);

  // Reset pen selection if path cleared or tool changes
  useEffect(() => {
    if (activeTool !== 'pen' || penPath.points.length === 0) {
      setSelectedPenPointIndex(null);
      setPenHoverTarget(null);
      penDragRef.current = null;
      setIsPenClosedPopupDismissed(false);
    }
  }, [activeTool, penPath.points.length]);

  // When path is closed, re-enable closed popup
  useEffect(() => {
    if (penPath.closed && penPath.points.length >= 3) {
      setIsPenClosedPopupDismissed(false);
    }
  }, [penPath.closed]);

  // Floating position for Closed Pen Path quick action menu
  const penClosedPopupPos = useMemo(() => {
    if (activeTool !== 'pen' || !penPath.closed || penPath.points.length < 3) return null;
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    let sumX = 0, sumY = 0;
    penPath.points.forEach((p) => {
      minX = Math.min(minX, p.x);
      maxX = Math.max(maxX, p.x);
      minY = Math.min(minY, p.y);
      maxY = Math.max(maxY, p.y);
      sumX += p.x;
      sumY += p.y;
    });
    const centerX = sumX / penPath.points.length;
    const preferredY = minY - 24;
    const y = preferredY > 40 ? preferredY : maxY + 32;
    return {
      x: Math.max(100, Math.min(canvasWidth - 100, centerX)),
      y: Math.max(20, Math.min(canvasHeight - 20, y)),
      isAbove: preferredY > 40,
    };
  }, [activeTool, penPath, canvasWidth, canvasHeight]);

  // Hit detection helper for Pen Tool
  const findPenHit = useCallback(
    (coords: { x: number; y: number }, zoomLevel: number): {
      type: 'anchor' | 'cp1' | 'cp2' | 'close';
      pointIndex: number;
    } | null => {
      if (penPath.points.length === 0) return null;
      const hitRadius = Math.max(7, 10 / zoomLevel);

      // 1. Check handles of selected point first
      if (selectedPenPointIndex !== null && penPath.points[selectedPenPointIndex]) {
        const pt = penPath.points[selectedPenPointIndex];
        if (pt.cp1 && Math.hypot(coords.x - pt.cp1.x, coords.y - pt.cp1.y) <= hitRadius) {
          return { type: 'cp1', pointIndex: selectedPenPointIndex };
        }
        if (pt.cp2 && Math.hypot(coords.x - pt.cp2.x, coords.y - pt.cp2.y) <= hitRadius) {
          return { type: 'cp2', pointIndex: selectedPenPointIndex };
        }
      }

      // 2. Check handles of all other points
      for (let i = 0; i < penPath.points.length; i++) {
        if (i === selectedPenPointIndex) continue;
        const pt = penPath.points[i];
        if (pt.cp1 && Math.hypot(coords.x - pt.cp1.x, coords.y - pt.cp1.y) <= hitRadius) {
          return { type: 'cp1', pointIndex: i };
        }
        if (pt.cp2 && Math.hypot(coords.x - pt.cp2.x, coords.y - pt.cp2.y) <= hitRadius) {
          return { type: 'cp2', pointIndex: i };
        }
      }

      // 3. Check first point for closing path (if open and at least 3 points)
      if (!penPath.closed && penPath.points.length >= 3) {
        const first = penPath.points[0];
        if (Math.hypot(coords.x - first.x, coords.y - first.y) <= hitRadius) {
          return { type: 'close', pointIndex: 0 };
        }
      }

      // 4. Check anchor points
      for (let i = 0; i < penPath.points.length; i++) {
        const pt = penPath.points[i];
        if (Math.hypot(coords.x - pt.x, coords.y - pt.y) <= hitRadius) {
          return { type: 'anchor', pointIndex: i };
        }
      }

      return null;
    },
    [penPath, selectedPenPointIndex]
  );

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

  // Listen for space key for quick panning and pen key shortcuts (Delete, Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isInput = (e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA';
      if (e.code === 'Space' && !isSpacePressedRef.current && !isInput) {
        isSpacePressedRef.current = true;
      }
      if (!isInput && activeTool === 'pen') {
        if (e.key === 'Delete' || e.key === 'Backspace') {
          if (selectedPenPointIndex !== null && selectedPenPointIndex >= 0) {
            e.preventDefault();
            setPenPath((prev) => {
              const pts = prev.points.filter((_, i) => i !== selectedPenPointIndex);
              return {
                ...prev,
                points: pts,
                closed: pts.length < 3 ? false : prev.closed,
              };
            });
            setSelectedPenPointIndex((prev) => {
              if (prev === null) return null;
              if (prev > 0) return prev - 1;
              return null;
            });
          }
        } else if (e.key === 'Escape') {
          setSelectedPenPointIndex(null);
        }
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
  }, [activeTool, selectedPenPointIndex, setPenPath]);

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

  // Render main composite canvas callback
  const renderComposite = useCallback(() => {
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

  // Render main composite canvas whenever layers change
  useEffect(() => {
    renderComposite();
  }, [renderComposite]);

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

      // Main curve path
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = Math.max(1.5, 2 / zoom);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      tracePenPath(ctx, penPath);
      ctx.stroke();

      const nodeSize = Math.max(6, 8 / zoom);
      const halfNode = nodeSize / 2;
      const knobRadius = Math.max(3, 4.5 / zoom);
      const handleLineWidth = Math.max(1, 1.2 / zoom);

      // Draw tangent direction lines & handle knobs
      penPath.points.forEach((pt, i) => {
        const isSelected = selectedPenPointIndex === i;
        const showHandles = isSelected || penPath.points.length <= 15 || Boolean(pt.cp1 || pt.cp2);

        if (showHandles) {
          // Draw cp1 tangent line and knob
          if (pt.cp1) {
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = handleLineWidth;
            ctx.beginPath();
            ctx.moveTo(pt.x, pt.y);
            ctx.lineTo(pt.cp1.x, pt.cp1.y);
            ctx.stroke();

            // Handle knob
            const isCp1Hovered = penHoverTarget?.type === 'cp1' && penHoverTarget.pointIndex === i;
            ctx.fillStyle = isCp1Hovered ? '#f59e0b' : '#38bdf8';
            ctx.strokeStyle = '#0284c7';
            ctx.lineWidth = handleLineWidth;
            ctx.beginPath();
            ctx.arc(pt.cp1.x, pt.cp1.y, isCp1Hovered ? knobRadius * 1.3 : knobRadius, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
          }

          // Draw cp2 tangent line and knob
          if (pt.cp2) {
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = handleLineWidth;
            ctx.beginPath();
            ctx.moveTo(pt.x, pt.y);
            ctx.lineTo(pt.cp2.x, pt.cp2.y);
            ctx.stroke();

            // Handle knob
            const isCp2Hovered = penHoverTarget?.type === 'cp2' && penHoverTarget.pointIndex === i;
            ctx.fillStyle = isCp2Hovered ? '#f59e0b' : '#38bdf8';
            ctx.strokeStyle = '#0284c7';
            ctx.lineWidth = handleLineWidth;
            ctx.beginPath();
            ctx.arc(pt.cp2.x, pt.cp2.y, isCp2Hovered ? knobRadius * 1.3 : knobRadius, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
          }
        }
      });

      // Draw anchor point boxes
      penPath.points.forEach((pt, i) => {
        const isSelected = selectedPenPointIndex === i;
        const isFirst = i === 0;
        const isCloseHovered = penHoverTarget?.type === 'close' && isFirst;
        const isAnchorHovered = penHoverTarget?.type === 'anchor' && penHoverTarget.pointIndex === i;

        if (isCloseHovered) {
          // Draw close indicator ring around first point
          ctx.strokeStyle = '#22c55e';
          ctx.lineWidth = handleLineWidth * 1.8;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, nodeSize * 1.25, 0, Math.PI * 2);
          ctx.stroke();
        }

        ctx.fillStyle = isSelected ? '#0284c7' : (isAnchorHovered ? '#67e8f9' : '#ffffff');
        ctx.strokeStyle = isSelected ? '#ffffff' : '#0369a1';
        ctx.lineWidth = handleLineWidth * 1.5;
        ctx.fillRect(pt.x - halfNode, pt.y - halfNode, nodeSize, nodeSize);
        ctx.strokeRect(pt.x - halfNode, pt.y - halfNode, nodeSize, nodeSize);
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

    // 6. Draw Move & Rotate tool bounding box (either for active selection or active layer)
    const activeSelBounds = getSelectionBounds(selection);
    if (activeTool === 'select' && selection.active && activeSelBounds) {
      ctx.save();

      // Dashed cyan boundary
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([5, 5]);
      ctx.lineDashOffset = dashOffset;
      ctx.strokeRect(activeSelBounds.x - 0.5, activeSelBounds.y - 0.5, activeSelBounds.width + 1, activeSelBounds.height + 1);

      // Solid inner hairline
      ctx.setLineDash([]);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.lineWidth = 1;
      ctx.strokeRect(activeSelBounds.x, activeSelBounds.y, activeSelBounds.width, activeSelBounds.height);

      // 4 Corner handles
      const corners = [
        { x: activeSelBounds.x, y: activeSelBounds.y },
        { x: activeSelBounds.x + activeSelBounds.width, y: activeSelBounds.y },
        { x: activeSelBounds.x + activeSelBounds.width, y: activeSelBounds.y + activeSelBounds.height },
        { x: activeSelBounds.x, y: activeSelBounds.y + activeSelBounds.height },
      ];
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 1.5;
      corners.forEach((c) => {
        ctx.fillRect(c.x - 4, c.y - 4, 8, 8);
        ctx.strokeRect(c.x - 4, c.y - 4, 8, 8);
      });

      // 4 Middle edge handles
      const mids = [
        { x: activeSelBounds.x + activeSelBounds.width / 2, y: activeSelBounds.y },
        { x: activeSelBounds.x + activeSelBounds.width, y: activeSelBounds.y + activeSelBounds.height / 2 },
        { x: activeSelBounds.x + activeSelBounds.width / 2, y: activeSelBounds.y + activeSelBounds.height },
        { x: activeSelBounds.x, y: activeSelBounds.y + activeSelBounds.height / 2 },
      ];
      ctx.fillStyle = '#38bdf8';
      ctx.strokeStyle = '#0369a1';
      ctx.lineWidth = 1;
      mids.forEach((m) => {
        ctx.fillRect(m.x - 3, m.y - 3, 6, 6);
        ctx.strokeRect(m.x - 3, m.y - 3, 6, 6);
      });

      // Center pivot point
      const cx = activeSelBounds.x + activeSelBounds.width / 2;
      const cy = activeSelBounds.y + activeSelBounds.height / 2;
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(cx, cy, 3, 0, Math.PI * 2);
      ctx.fill();

      // Info badge
      ctx.font = '10px sans-serif';
      const text = `Selected Area: ${activeSelBounds.width} × ${activeSelBounds.height}px`;
      const textW = ctx.measureText(text).width;
      const badgeY = activeSelBounds.y >= 24 ? activeSelBounds.y - 20 : activeSelBounds.y + activeSelBounds.height + 6;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.fillRect(activeSelBounds.x, badgeY, textW + 12, 16);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1;
      ctx.strokeRect(activeSelBounds.x, badgeY, textW + 12, 16);
      ctx.fillStyle = '#38bdf8';
      ctx.fillText(text, activeSelBounds.x + 6, badgeY + 11);

      ctx.restore();
    } else if ((activeTool === 'select' || activeTool === 'rotate') && activeLayer) {
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
    selectedPenPointIndex,
    penHoverTarget,
    zoom,
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

    // Text Tool (Click to select/edit or create new text)
    if (activeTool === 'text') {
      // 1. Check if clicking on an existing text layer
      let hitTextLayer: Layer | null = null;
      for (let i = layers.length - 1; i >= 0; i--) {
        const l = layers[i];
        if (!l.visible || l.type !== 'text') continue;

        const lx = Math.round(coords.x - l.x);
        const ly = Math.round(coords.y - l.y);
        if (lx >= 0 && lx < l.width && ly >= 0 && ly < l.height) {
          const ctx = l.canvas.getContext('2d');
          if (ctx) {
            const sx = Math.max(0, lx - 8);
            const sy = Math.max(0, ly - 8);
            const sw = Math.min(l.width - sx, 17);
            const sh = Math.min(l.height - sy, 17);
            const pData = ctx.getImageData(sx, sy, sw, sh).data;
            for (let p = 3; p < pData.length; p += 4) {
               if (pData[p] > 15) {
                hitTextLayer = l;
                break;
              }
            }
          }
        }
        if (hitTextLayer) break;
      }

      if (hitTextLayer) {
        setActiveLayerId?.(hitTextLayer.id);
        setEditingTextLayerId?.(hitTextLayer.id);
        if (setTextString) setTextString(hitTextLayer.textData?.text || '');
        if (setTextFontSize && hitTextLayer.textData?.fontSize) setTextFontSize(hitTextLayer.textData.fontSize);
        if (setTextFontFamily && hitTextLayer.textData?.fontFamily) setTextFontFamily(hitTextLayer.textData.fontFamily);
        if (setTextColor && hitTextLayer.textData?.color) setTextColor(hitTextLayer.textData.color);
        if (setTextBold && typeof hitTextLayer.textData?.bold === 'boolean') setTextBold(hitTextLayer.textData.bold);
        if (setTextItalic && typeof hitTextLayer.textData?.italic === 'boolean') setTextItalic(hitTextLayer.textData.italic);
        if (setTextAlign && hitTextLayer.textData?.align) setTextAlign(hitTextLayer.textData.align);
      } else {
        // If clicking on empty canvas while an inline text editor was open, commit it first
        if (editingTextLayerId) {
          onUpdateActiveText?.(undefined, undefined, undefined, undefined, undefined, undefined, undefined, true);
          setEditingTextLayerId?.(null);
        }
        // Create new text layer at clicked coordinates
        onCreateTextAt?.(Math.round(coords.x), Math.round(coords.y));
      }
      return;
    }

    // If another tool is used while editing a text layer, commit and close inline editor
    if (editingTextLayerId) {
      onUpdateActiveText?.(undefined, undefined, undefined, undefined, undefined, undefined, undefined, true);
      setEditingTextLayerId?.(null);
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

    // Pen Tool Interaction (Handle dragging, anchor selection, Alt-convert, path closing, new points)
    if (activeTool === 'pen') {
      const hit = findPenHit(coords, zoom);

      // A. Hit a handle knob (cp1 or cp2)
      if (hit && (hit.type === 'cp1' || hit.type === 'cp2')) {
        setSelectedPenPointIndex(hit.pointIndex);
        const pt = penPath.points[hit.pointIndex];
        penDragRef.current = {
          mode: 'move_handle',
          pointIndex: hit.pointIndex,
          handleType: hit.type,
          startCoords: { ...coords },
          origPoint: JSON.parse(JSON.stringify(pt)),
          altPressed: e.altKey,
        };
        return;
      }

      // B. Hit first point to close path
      if (hit && hit.type === 'close') {
        const pt = penPath.points[0];
        setPenPath((prev) => ({ ...prev, closed: true }));
        setSelectedPenPointIndex(0);
        penDragRef.current = {
          mode: 'create_point',
          pointIndex: 0,
          startCoords: { ...coords },
          origPoint: JSON.parse(JSON.stringify(pt)),
          hasDragged: false,
          altPressed: e.altKey,
        };
        return;
      }

      // C. Hit an existing anchor point
      if (hit && hit.type === 'anchor') {
        const pt = penPath.points[hit.pointIndex];
        setSelectedPenPointIndex(hit.pointIndex);

        if (e.altKey) {
          // Alt-click converts anchor point: if it has handles, delete them (corner); if sharp, pull out handles!
          if (pt.cp1 || pt.cp2) {
            setPenPath((prev) => {
              const pts = [...prev.points];
              pts[hit.pointIndex] = { x: pt.x, y: pt.y };
              return { ...prev, points: pts };
            });
            penDragRef.current = null;
            return;
          } else {
            penDragRef.current = {
              mode: 'create_point',
              pointIndex: hit.pointIndex,
              startCoords: { ...coords },
              origPoint: { x: pt.x, y: pt.y },
              hasDragged: false,
              altPressed: true,
            };
            return;
          }
        } else {
          // Normal click/drag moves anchor and its handles together
          penDragRef.current = {
            mode: 'move_anchor',
            pointIndex: hit.pointIndex,
            startCoords: { ...coords },
            origPoint: JSON.parse(JSON.stringify(pt)),
            hasDragged: false,
          };
          return;
        }
      }

      // D. Click on empty canvas
      if (penPath.closed) {
        // If previous path was closed, start a new path
        const newPt: PenPoint = { x: coords.x, y: coords.y };
        setPenPath({ points: [newPt], closed: false });
        setSelectedPenPointIndex(0);
        penDragRef.current = {
          mode: 'create_point',
          pointIndex: 0,
          startCoords: { ...coords },
          origPoint: newPt,
          hasDragged: false,
          altPressed: e.altKey,
        };
      } else {
        // Append new anchor point
        const newPt: PenPoint = { x: coords.x, y: coords.y };
        const newIdx = penPath.points.length;
        setPenPath((prev) => ({
          ...prev,
          points: [...prev.points, newPt],
        }));
        setSelectedPenPointIndex(newIdx);
        penDragRef.current = {
          mode: 'create_point',
          pointIndex: newIdx,
          startCoords: { ...coords },
          origPoint: newPt,
          hasDragged: false,
          altPressed: e.altKey,
        };
      }
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
      // 1. Move Active Selection if selection is active and tool is select
      if (activeTool === 'select' && selection.active) {
        const selBounds = getSelectionBounds(selection);
        if (selBounds) {
          isMovingSelectionRef.current = true;

          // Extract selected pixels from activeLayer.canvas
          const floatingCanvas = createCanvas(selBounds.width, selBounds.height);
          const fCtx = floatingCanvas.getContext('2d');
          if (fCtx) {
            const srcX = selBounds.x - activeLayer.x;
            const srcY = selBounds.y - activeLayer.y;
            fCtx.drawImage(
              activeLayer.canvas,
              srcX, srcY, selBounds.width, selBounds.height,
              0, 0, selBounds.width, selBounds.height
            );

            if (selection.maskCanvas) {
              fCtx.globalCompositeOperation = 'destination-in';
              fCtx.drawImage(
                selection.maskCanvas,
                selBounds.x, selBounds.y, selBounds.width, selBounds.height,
                0, 0, selBounds.width, selBounds.height
              );
            }
          }

          // Clone active layer canvas as base and clear selected pixels from it
          const baseLayerCanvas = cloneCanvas(activeLayer.canvas);
          clearSelectionFromLayer(baseLayerCanvas, selection, { x: activeLayer.x, y: activeLayer.y });

          selectionDragDataRef.current = {
            origSelection: { ...selection },
            origBounds: { ...selBounds },
            baseLayerCanvas,
            floatingCanvas,
            layerX: activeLayer.x,
            layerY: activeLayer.y,
          };
          return;
        }
      }

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

    // Track Pen hover target when idle
    if (activeTool === 'pen' && !isInteractingRef.current) {
      const hit = findPenHit(coords, zoom);
      setPenHoverTarget(hit);
    }

    if (!isInteractingRef.current) return;

    // Pen tool dragging (creating curve handles, moving handle knobs, or moving anchor point)
    if (activeTool === 'pen' && penDragRef.current) {
      const { mode, pointIndex, handleType, origPoint, altPressed } = penDragRef.current;
      const isAlt = e.altKey || Boolean(altPressed);

      if (mode === 'create_point') {
        const dx = coords.x - origPoint.x;
        const dy = coords.y - origPoint.y;
        if (Math.hypot(dx, dy) > 2) {
          penDragRef.current.hasDragged = true;
          setPenPath((prev) => {
            const pts = [...prev.points];
            if (!pts[pointIndex]) return prev;
            const cur = pts[pointIndex];
            pts[pointIndex] = {
              ...cur,
              cp2: { x: cur.x + dx, y: cur.y + dy },
              cp1: isAlt ? cur.cp1 : { x: cur.x - dx, y: cur.y - dy },
            };
            return { ...prev, points: pts };
          });
        }
        return;
      }

      if (mode === 'move_handle' && handleType) {
        penDragRef.current.hasDragged = true;
        const isCp2 = handleType === 'cp2';
        const curPt = origPoint;
        const dx = coords.x - curPt.x;
        const dy = coords.y - curPt.y;
        const dist = Math.hypot(dx, dy);

        let oppHandle: { x: number; y: number } | undefined = undefined;
        if (!isAlt && dist > 0.001) {
          const existingOpp = isCp2 ? curPt.cp1 : curPt.cp2;
          const oppLen = existingOpp ? Math.hypot(existingOpp.x - curPt.x, existingOpp.y - curPt.y) : dist;
          oppHandle = {
            x: curPt.x - (dx / dist) * oppLen,
            y: curPt.y - (dy / dist) * oppLen,
          };
        }

        setPenPath((prev) => {
          const pts = [...prev.points];
          if (!pts[pointIndex]) return prev;
          const target = { ...pts[pointIndex] };
          if (isCp2) {
            target.cp2 = { x: coords.x, y: coords.y };
            if (oppHandle) target.cp1 = oppHandle;
          } else {
            target.cp1 = { x: coords.x, y: coords.y };
            if (oppHandle) target.cp2 = oppHandle;
          }
          pts[pointIndex] = target;
          return { ...prev, points: pts };
        });
        return;
      }

      if (mode === 'move_anchor') {
        const dx = coords.x - penDragRef.current.startCoords.x;
        const dy = coords.y - penDragRef.current.startCoords.y;
        if (Math.hypot(dx, dy) > 1) {
          penDragRef.current.hasDragged = true;
          setPenPath((prev) => {
            const pts = [...prev.points];
            if (!pts[pointIndex]) return prev;
            pts[pointIndex] = {
              x: Math.round(origPoint.x + dx),
              y: Math.round(origPoint.y + dy),
              cp1: origPoint.cp1 ? { x: Math.round(origPoint.cp1.x + dx), y: Math.round(origPoint.cp1.y + dy) } : undefined,
              cp2: origPoint.cp2 ? { x: Math.round(origPoint.cp2.x + dx), y: Math.round(origPoint.cp2.y + dy) } : undefined,
            };
            return { ...prev, points: pts };
          });
        }
        return;
      }
      return;
    }

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

    // Move Active Selection with Move tool
    if (activeTool === 'select' && isMovingSelectionRef.current && selectionDragDataRef.current && activeLayer && !activeLayer.locked) {
      const dx = Math.round(coords.x - startPosRef.current.x);
      const dy = Math.round(coords.y - startPosRef.current.y);

      const { origBounds, origSelection, baseLayerCanvas, floatingCanvas, layerX, layerY } = selectionDragDataRef.current;

      const ctx = activeLayer.canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, activeLayer.canvas.width, activeLayer.canvas.height);
        ctx.drawImage(baseLayerCanvas, 0, 0);

        const destX = (origBounds.x + dx) - layerX;
        const destY = (origBounds.y + dy) - layerY;
        ctx.drawImage(floatingCanvas, destX, destY);
      }

      // Redraw composite canvas immediately for real-time smooth visual feedback
      renderComposite();

      // Update selection coordinates
      const updatedRect = origSelection.rect ? {
        x: origSelection.rect.x + dx,
        y: origSelection.rect.y + dy,
        width: origSelection.rect.width,
        height: origSelection.rect.height,
      } : undefined;

      let updatedMask: HTMLCanvasElement | undefined;
      if (origSelection.maskCanvas) {
        updatedMask = createCanvas(canvasWidth, canvasHeight);
        const mCtx = updatedMask.getContext('2d');
        if (mCtx) {
          mCtx.drawImage(origSelection.maskCanvas, dx, dy);
        }
      }

      let updatedPoly = origSelection.polygon
        ? origSelection.polygon.map((p) => ({ x: p.x + dx, y: p.y + dy }))
        : undefined;

      setSelection({
        ...origSelection,
        rect: updatedRect,
        maskCanvas: updatedMask || (updatedRect ? createRectMaskCanvas(updatedRect, canvasWidth, canvasHeight) : undefined),
        polygon: updatedPoly,
      });

      return;
    }

    // Move Layer with Move tool (when no selection is active)
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

    // Pen tool drag finalize
    if (activeTool === 'pen' && penDragRef.current) {
      if (penDragRef.current.mode === 'create_point' && !penDragRef.current.hasDragged) {
        const idx = penDragRef.current.pointIndex;
        setPenPath((prev) => {
          const pts = [...prev.points];
          if (pts[idx]) {
            pts[idx] = { x: pts[idx].x, y: pts[idx].y };
          }
          return { ...prev, points: pts };
        });
      }
      penDragRef.current = null;
    }

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

    // Move Selection complete
    if (activeTool === 'select' && isMovingSelectionRef.current) {
      isMovingSelectionRef.current = false;
      if (selectionDragDataRef.current && activeLayer) {
        const dx = Math.round(lastMousePosRef.current.x - startPosRef.current.x);
        const dy = Math.round(lastMousePosRef.current.y - startPosRef.current.y);
        if (dx !== 0 || dy !== 0) {
          onLayerPixelChange(activeLayer.id, 'Move Selected Area');
        }
      }
      selectionDragDataRef.current = null;
    } else if (activeTool === 'select' && activeLayer) {
      // Move Layer end
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
        const normalizedRect = {
          x: rect.width < 0 ? rect.x + rect.width : rect.x,
          y: rect.height < 0 ? rect.y + rect.height : rect.y,
          width: Math.abs(rect.width),
          height: Math.abs(rect.height),
        };
        const mask = createRectMaskCanvas(normalizedRect, canvasWidth, canvasHeight);
        setSelection({
          active: true,
          type: 'rect',
          rect: normalizedRect,
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

  // Canvas Double Click (double click text layer to edit text)
  const handleDoubleClick = (e: React.MouseEvent) => {
    const coords = clientToCanvasCoord(e.clientX, e.clientY);
    for (let i = layers.length - 1; i >= 0; i--) {
      const l = layers[i];
      if (!l.visible || l.type !== 'text') continue;
      const lx = Math.round(coords.x - l.x);
      const ly = Math.round(coords.y - l.y);
      if (lx >= 0 && lx < l.width && ly >= 0 && ly < l.height) {
        const ctx = l.canvas.getContext('2d');
        if (ctx) {
          const sx = Math.max(0, lx - 8);
          const sy = Math.max(0, ly - 8);
          const sw = Math.min(l.width - sx, 17);
          const sh = Math.min(l.height - sy, 17);
          const pData = ctx.getImageData(sx, sy, sw, sh).data;
          for (let p = 3; p < pData.length; p += 4) {
            if (pData[p] > 15) {
              setActiveTool?.('text');
              setActiveLayerId?.(l.id);
              setEditingTextLayerId?.(l.id);
              if (setTextString) setTextString(l.textData?.text || '');
              if (setTextFontSize && l.textData?.fontSize) setTextFontSize(l.textData.fontSize);
              if (setTextFontFamily && l.textData?.fontFamily) setTextFontFamily(l.textData.fontFamily);
              if (setTextColor && l.textData?.color) setTextColor(l.textData.color);
              if (setTextBold && typeof l.textData?.bold === 'boolean') setTextBold(l.textData.bold);
              if (setTextItalic && typeof l.textData?.italic === 'boolean') setTextItalic(l.textData.italic);
              if (setTextAlign && l.textData?.align) setTextAlign(l.textData.align);
              return;
            }
          }
        }
      }
    }
  };

  // Cursor style based on tool
  let cursorStyle = 'default';
  if (isSpacePressedRef.current || activeTool === 'hand') {
    cursorStyle = isInteractingRef.current ? 'grabbing' : 'grab';
  } else if (activeTool === 'text') {
    cursorStyle = 'text';
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
  } else if (activeTool === 'lasso' || activeTool === 'marquee') {
    cursorStyle = 'crosshair';
  } else if (activeTool === 'pen') {
    if (penHoverTarget?.type === 'close') {
      cursorStyle = PEN_CLOSE_CURSOR;
    } else if (penHoverTarget?.type === 'anchor' || penHoverTarget?.type === 'cp1' || penHoverTarget?.type === 'cp2') {
      cursorStyle = 'pointer';
    } else {
      cursorStyle = PEN_CURSOR;
    }
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
      onDoubleClick={handleDoubleClick}
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

        {/* Interactive Inline On-Canvas Text Editor */}
        {editingTextLayerId && activeLayer?.id === editingTextLayerId && activeLayer.type === 'text' && (
          <div
            id="photolite-canvas-text-editor"
            style={{
              position: 'absolute',
              left: `${(activeLayer.textData?.x ?? activeLayer.width / 2) + activeLayer.x}px`,
              top: `${(activeLayer.textData?.y ?? activeLayer.height / 2) + activeLayer.y}px`,
              transform:
                activeLayer.textData?.align === 'left'
                  ? 'translate(0, -50%)'
                  : activeLayer.textData?.align === 'right'
                  ? 'translate(-100%, -50%)'
                  : 'translate(-50%, -50%)',
              zIndex: 40,
              pointerEvents: 'auto',
            }}
            className="flex flex-col items-center select-none"
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
          >
            {/* Sleek Floating Action Mini-Toolbar */}
            <div className="flex items-center gap-1.5 mb-2 px-2.5 py-1 rounded-md bg-[#18181b]/95 backdrop-blur-md border border-cyan-400 shadow-2xl text-[11px] text-gray-200">
              <span className="text-[10px] text-gray-400 font-mono">Size:</span>
              <input
                type="number"
                min="8"
                max="200"
                value={activeLayer.textData?.fontSize || textFontSize}
                onChange={(e) => {
                  const s = Math.max(8, Math.min(200, Number(e.target.value)));
                  setTextFontSize?.(s);
                  onUpdateActiveText?.(undefined, s, undefined, undefined, undefined, undefined, undefined, false);
                }}
                className="w-11 rounded bg-black/80 px-1 py-0.5 text-center text-xs text-white border border-neutral-700 focus:border-cyan-400 focus:outline-none"
              />

              {/* Color picker */}
              <div className="relative flex items-center">
                <input
                  type="color"
                  value={activeLayer.textData?.color || textColor || '#ffffff'}
                  onChange={(e) => {
                    const col = e.target.value;
                    setTextColor?.(col);
                    onUpdateActiveText?.(undefined, undefined, undefined, undefined, undefined, col, undefined, false);
                  }}
                  className="h-5 w-6 rounded border border-neutral-700 cursor-pointer bg-transparent"
                  title="Text Color"
                />
              </div>

              {/* Bold button */}
              <button
                type="button"
                onClick={() => {
                  const next = !(activeLayer.textData?.bold ?? textBold);
                  setTextBold?.(next);
                  onUpdateActiveText?.(undefined, undefined, next, undefined, undefined, undefined, undefined, false);
                }}
                className={`p-1 rounded cursor-pointer ${
                  (activeLayer.textData?.bold ?? textBold) ? 'bg-cyan-600 text-white' : 'text-gray-400 hover:text-white bg-black/40'
                }`}
                title="Bold"
              >
                <Bold className="h-3 w-3" />
              </button>

              {/* Italic button */}
              <button
                type="button"
                onClick={() => {
                  const next = !(activeLayer.textData?.italic ?? textItalic);
                  setTextItalic?.(next);
                  onUpdateActiveText?.(undefined, undefined, undefined, next, undefined, undefined, undefined, false);
                }}
                className={`p-1 rounded cursor-pointer ${
                  (activeLayer.textData?.italic ?? textItalic) ? 'bg-cyan-600 text-white' : 'text-gray-400 hover:text-white bg-black/40'
                }`}
                title="Italic"
              >
                <Italic className="h-3 w-3" />
              </button>

              {/* Commit checkmark */}
              <button
                type="button"
                onClick={() => {
                  onUpdateActiveText?.(undefined, undefined, undefined, undefined, undefined, undefined, undefined, true);
                  setEditingTextLayerId?.(null);
                }}
                className="flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-semibold cursor-pointer shadow-xs ml-1"
                title="Done Editing (Enter / Esc)"
              >
                <Check className="h-3 w-3" /> Done
              </button>

              {/* Delete button */}
              <button
                type="button"
                onClick={() => {
                  onDeleteLayer?.();
                  setEditingTextLayerId?.(null);
                }}
                className="p-1 rounded hover:bg-red-950/80 text-red-400 hover:text-red-300 cursor-pointer ml-0.5"
                title="Delete Text Layer"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>

            {/* Editable Text Area */}
            <textarea
              autoFocus
              rows={Math.max(1, (activeLayer.textData?.text || '').split('\n').length)}
              value={activeLayer.textData?.text ?? textString}
              onChange={(e) => {
                const val = e.target.value;
                setTextString?.(val);
                onUpdateActiveText?.(val, undefined, undefined, undefined, undefined, undefined, undefined, false);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  onUpdateActiveText?.(undefined, undefined, undefined, undefined, undefined, undefined, undefined, true);
                  setEditingTextLayerId?.(null);
                } else if (e.key === 'Escape') {
                  e.preventDefault();
                  onUpdateActiveText?.(undefined, undefined, undefined, undefined, undefined, undefined, undefined, true);
                  setEditingTextLayerId?.(null);
                }
              }}
              style={{
                fontSize: `${activeLayer.textData?.fontSize || textFontSize}px`,
                fontFamily: activeLayer.textData?.fontFamily || textFontFamily,
                fontWeight: (activeLayer.textData?.bold ?? textBold) ? 'bold' : 'normal',
                fontStyle: (activeLayer.textData?.italic ?? textItalic) ? 'italic' : 'normal',
                color: activeLayer.textData?.color || textColor || '#ffffff',
                textAlign: (activeLayer.textData?.align || textAlign) as any,
                lineHeight: 1.22,
                minWidth: '160px',
                maxWidth: `${Math.min(canvasWidth - 40, 800)}px`,
              }}
              className="bg-black/75 border-2 border-cyan-400 border-dashed rounded px-3 py-1.5 shadow-2xl focus:outline-none focus:border-cyan-300 backdrop-blur-xs resize-none overflow-hidden"
            />
          </div>
        )}

        {/* Floating Quick Actions when Pen Path is Closed (1 Create Selection, 2 Create Stroke, 3 Create Fill) */}
        {activeTool === 'pen' && penPath.closed && penPath.points.length >= 3 && !isPenClosedPopupDismissed && penClosedPopupPos && (
          <div
            id="pen-closed-quick-actions"
            style={{
              position: 'absolute',
              left: `${penClosedPopupPos.x}px`,
              top: `${penClosedPopupPos.y}px`,
              transform: penClosedPopupPos.isAbove
                ? `translate(-50%, -100%) scale(${Math.max(0.65, Math.min(1.4, 1 / zoom))})`
                : `translate(-50%, 0) scale(${Math.max(0.65, Math.min(1.4, 1 / zoom))})`,
              transformOrigin: penClosedPopupPos.isAbove ? 'bottom center' : 'top center',
              zIndex: 45,
              pointerEvents: 'auto',
            }}
            className="flex flex-col items-center select-none filter drop-shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
          >
            {/* Upward pointer arrow if below */}
            {!penClosedPopupPos.isAbove && (
              <div className="w-3 h-3 bg-[#18181b] border-l border-t border-cyan-400 rotate-45 -mb-1.5 z-10 shadow-sm" />
            )}

            {/* Menu Bar Pill */}
            <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-[#18181b]/95 backdrop-blur-md border border-cyan-400 shadow-[0_12px_40px_rgba(0,0,0,0.85)] text-white">
              {/* Path closed indicator badge */}
              <div className="flex items-center gap-1.5 pl-2 pr-2.5 py-1 text-[11px] font-semibold text-cyan-300 border-r border-neutral-700/80">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Path Closed</span>
              </div>

              {/* 1. Create Selection */}
              <button
                onClick={() => {
                  onPenMakeSelection?.();
                  setPenPath({ points: [], closed: false });
                  setSelectedPenPointIndex(null);
                  setIsPenClosedPopupDismissed(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md hover:shadow-cyan-500/30 transition-all cursor-pointer active:scale-95"
                title="Convert closed path into active selection"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>1. Create Selection</span>
              </button>

              {/* 2. Create Stroke */}
              <button
                onClick={() => {
                  onPenStroke?.();
                  setPenPath({ points: [], closed: false });
                  setSelectedPenPointIndex(null);
                  setIsPenClosedPopupDismissed(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#27272a] hover:bg-[#3f3f46] text-gray-200 hover:text-white text-xs font-semibold border border-neutral-700 hover:border-neutral-500 transition-all cursor-pointer active:scale-95"
                title="Stroke the path on active layer"
              >
                <Paintbrush className="w-3.5 h-3.5 text-blue-400" />
                <span>2. Create Stroke</span>
              </button>

              {/* 3. Create Fill */}
              <button
                onClick={() => {
                  onPenFill?.();
                  setPenPath({ points: [], closed: false });
                  setSelectedPenPointIndex(null);
                  setIsPenClosedPopupDismissed(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#27272a] hover:bg-[#3f3f46] text-gray-200 hover:text-white text-xs font-semibold border border-neutral-700 hover:border-neutral-500 transition-all cursor-pointer active:scale-95"
                title="Fill inside path on active layer"
              >
                <PaintBucket className="w-3.5 h-3.5 text-amber-400" />
                <span>3. Create Fill</span>
              </button>

              {/* Dismiss X button */}
              <button
                onClick={() => setIsPenClosedPopupDismissed(true)}
                className="p-1 rounded-lg hover:bg-neutral-800 text-gray-400 hover:text-gray-200 cursor-pointer ml-0.5 transition-colors"
                title="Dismiss menu"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Downward indicator arrow if above */}
            {penClosedPopupPos.isAbove && (
              <div className="w-3 h-3 bg-[#18181b] border-r border-b border-cyan-400 rotate-45 -mt-1.5 shadow-sm" />
            )}
          </div>
        )}
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
