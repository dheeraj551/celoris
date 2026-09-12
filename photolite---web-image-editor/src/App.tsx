import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ToolType,
  Layer,
  SelectionState,
  PenPath,
  CropBox,
  HistoryStep,
  LayerFilter,
} from './types';
import {
  createCanvas,
  cloneCanvas,
  serializeLayer,
  deserializeLayer,
  resizeCanvasWithAnchor,
  resampleImage,
  cropCanvas,
  AnchorPosition,
} from './utils/canvasUtils';
import { createInitialProject } from './utils/sampleData';
import {
  clearSelectionFromLayer,
  fillSelectionOnLayer,
  invertMaskCanvas,
  createRectMaskCanvas,
} from './utils/selectionUtils';
import { MenuBar } from './components/MenuBar';
import { Toolbar } from './components/Toolbar';
import { ToolOptionsBar } from './components/ToolOptionsBar';
import { CanvasViewport } from './components/CanvasViewport';
import { RightSidebar } from './components/RightSidebar';
import { NewCanvasModal } from './components/Modals/NewCanvasModal';
import { ResizeModal } from './components/Modals/ResizeModal';
import { ExportModal } from './components/Modals/ExportModal';
import { AIImageModal } from './components/Modals/AIImageModal';
import { ProPlanModal } from './components/Modals/ProPlanModal';
import { TemplatesModal } from './components/Modals/TemplatesModal';
import { DesignTemplate } from './data/templates';

export default function App() {
  const [projectName, setProjectName] = useState('PhotoLite Composition');
  const [canvasWidth, setCanvasWidth] = useState(960);
  const [canvasHeight, setCanvasHeight] = useState(600);
  
  // Synchronous initialization for layers & composition so canvas mounts instantly
  const [initialData] = useState(() => {
    try {
      return createInitialProject(960, 600);
    } catch (e) {
      console.error('Failed to create initial project:', e);
      return { layers: [], activeLayerId: '' };
    }
  });
  const [layers, setLayers] = useState<Layer[]>(() => initialData.layers);
  const [activeLayerId, setActiveLayerId] = useState<string>(() => initialData.activeLayerId);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(() => {
    return typeof window !== 'undefined' ? window.innerWidth >= 800 : true;
  });
  const [sidebarTab, setSidebarTab] = useState<'layers' | 'history' | 'adjustments'>('layers');

  // Tools & Colors
  const [activeTool, setActiveTool] = useState<ToolType>('select');
  const [foregroundColor, setForegroundColor] = useState<string>('#38bdf8');
  const [backgroundColor, setBackgroundColor] = useState<string>('#ffffff');

  // Brush / Eraser options
  const [brushSize, setBrushSize] = useState<number>(20);
  const [brushOpacity, setBrushOpacity] = useState<number>(1);
  const [brushHardness, setBrushHardness] = useState<number>(0.8);
  const [wandTolerance, setWandTolerance] = useState<number>(32);

  // Selection
  const [selection, setSelection] = useState<SelectionState>({
    active: false,
    type: null,
  });

  // Pen Tool
  const [penPath, setPenPath] = useState<PenPath>({ points: [], closed: false });
  const [penStrokeWidth, setPenStrokeWidth] = useState<number>(3);

  // Crop Tool
  const [cropBox, setCropBox] = useState<CropBox>({ x: 0, y: 0, width: 960, height: 600 });
  const [cropAspectRatio, setCropAspectRatio] = useState<number | null>(null);

  // Shape Tool
  const [shapeType, setShapeType] = useState<'rect' | 'circle' | 'line'>('rect');
  const [shapeStrokeWidth, setShapeStrokeWidth] = useState<number>(3);

  // Text Tool
  const [textString, setTextString] = useState<string>('Creative Studio');
  const [textFontSize, setTextFontSize] = useState<number>(36);
  const [textBold, setTextBold] = useState<boolean>(true);
  const [textItalic, setTextItalic] = useState<boolean>(false);

  // Viewport Zoom & Pan
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // History Stack
  const [history, setHistory] = useState<HistoryStep[]>(() => {
    if (initialData.layers.length === 0) return [];
    try {
      const serialized = initialData.layers.map(serializeLayer);
      return [
        {
          id: 'step-0',
          name: 'Open Composition',
          timestamp: Date.now(),
          layers: serialized,
          canvasWidth: 960,
          canvasHeight: 600,
          activeLayerId: initialData.activeLayerId,
        },
      ];
    } catch {
      return [];
    }
  });
  const [historyIndex, setHistoryIndex] = useState<number>(() => (initialData.layers.length > 0 ? 0 : -1));

  // Modals
  const [isNewCanvasOpen, setIsNewCanvasOpen] = useState(false);
  const [isResizeModalOpen, setIsResizeModalOpen] = useState(false);
  const [resizeModalMode, setResizeModalMode] = useState<'canvas' | 'image'>('canvas');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isProModalOpen, setIsProModalOpen] = useState(false);
  const [isTemplatesModalOpen, setIsTemplatesModalOpen] = useState(false);
  const [isProUser, setIsProUser] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('photolite_pro_user');
      if (saved !== null) return saved === 'true';
    }
    return true; // Default to true (Active Pro trial) so user can test and enjoy AI creation immediately
  });

  // File upload input ref
  const fileInputRef = useRef<HTMLInputElement>(null);
  const jsonInputRef = useRef<HTMLInputElement>(null);

  // Record a history step
  const recordHistory = useCallback(
    (actionName: string, updatedLayers?: Layer[], targetW?: number, targetH?: number, activeId?: string) => {
      const currentLayers = updatedLayers || layers;
      const w = targetW !== undefined ? targetW : canvasWidth;
      const h = targetH !== undefined ? targetH : canvasHeight;
      const actId = activeId || activeLayerId;

      const serialized = currentLayers.map(serializeLayer);
      const newStep: HistoryStep = {
        id: `step-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        name: actionName,
        timestamp: Date.now(),
        layers: serialized,
        canvasWidth: w,
        canvasHeight: h,
        activeLayerId: actId,
      };

      setHistory((prev) => {
        const sliced = prev.slice(0, historyIndex + 1);
        // Keep max 30 states to avoid memory bloat
        if (sliced.length >= 30) {
          sliced.shift();
        }
        return [...sliced, newStep];
      });
      setHistoryIndex((prev) => Math.min(prev + 1, 29));
    },
    [layers, canvasWidth, canvasHeight, activeLayerId, historyIndex]
  );

  // Jump to specific History step
  const handleJumpToHistory = async (index: number) => {
    if (index < 0 || index >= history.length) return;
    const step = history[index];
    const restoredLayers = await Promise.all(step.layers.map(deserializeLayer));

    setLayers(restoredLayers);
    setCanvasWidth(step.canvasWidth);
    setCanvasHeight(step.canvasHeight);
    setCropBox({ x: 0, y: 0, width: step.canvasWidth, height: step.canvasHeight });
    setActiveLayerId(step.activeLayerId);
    setHistoryIndex(index);
    setSelection({ active: false, type: null });
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      handleJumpToHistory(historyIndex - 1);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      handleJumpToHistory(historyIndex + 1);
    }
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isInput =
        (e.target as HTMLElement).tagName === 'INPUT' ||
        (e.target as HTMLElement).tagName === 'SELECT' ||
        (e.target as HTMLElement).tagName === 'TEXTAREA';

      // Ctrl shortcuts
      if ((e.ctrlKey || e.metaKey) && !isInput) {
        if (e.key === 'z' && !e.shiftKey) {
          e.preventDefault();
          handleUndo();
          return;
        }
        if (e.key === 'y' || (e.key === 'z' && e.shiftKey)) {
          e.preventDefault();
          handleRedo();
          return;
        }
        if (e.key === 'd') {
          e.preventDefault();
          setSelection({ active: false, type: null });
          return;
        }
        if (e.key === 'a') {
          e.preventDefault();
          const mask = createRectMaskCanvas(
            { x: 0, y: 0, width: canvasWidth, height: canvasHeight },
            canvasWidth,
            canvasHeight
          );
          setSelection({
            active: true,
            type: 'rect',
            rect: { x: 0, y: 0, width: canvasWidth, height: canvasHeight },
            maskCanvas: mask,
          });
          return;
        }
        if (e.key === 'e') {
          e.preventDefault();
          setIsExportModalOpen(true);
          return;
        }
        if (e.key === 'n') {
          e.preventDefault();
          setIsNewCanvasOpen(true);
          return;
        }
        if (e.key === '0') {
          e.preventDefault();
          setZoom(1);
          setPan({ x: 0, y: 0 });
          return;
        }
        if (e.key === '=' || e.key === '+') {
          e.preventDefault();
          setZoom((z) => Math.min(8, z * 1.25));
          return;
        }
        if (e.key === '-') {
          e.preventDefault();
          setZoom((z) => Math.max(0.1, z * 0.8));
          return;
        }
        if (e.key === 'j') {
          e.preventDefault();
          handleDuplicateLayer();
          return;
        }
        if (e.shiftKey && (e.key === 'u' || e.key === 'U')) {
          e.preventDefault();
          handleConvertToGrayscale();
          return;
        }
        if (!e.shiftKey && (e.key === 'u' || e.key === 'U')) {
          e.preventDefault();
          setIsSidebarOpen(true);
          setSidebarTab('adjustments');
          return;
        }
      }

      // Single Key Shortcuts (when not in input)
      if (!isInput && !e.ctrlKey && !e.metaKey && !e.altKey) {
        if (e.key === 'v' || e.key === 'V') setActiveTool('select');
        else if (e.key === 'r' || e.key === 'R') setActiveTool('rotate');
        else if (e.key === 'm' || e.key === 'M') setActiveTool('marquee');
        else if (e.key === 'l' || e.key === 'L') setActiveTool('lasso');
        else if (e.key === 'w' || e.key === 'W') setActiveTool('wand');
        else if (e.key === 'c' || e.key === 'C') {
          setActiveTool('crop');
          setCropBox({ x: 0, y: 0, width: canvasWidth, height: canvasHeight });
        }
        else if (e.key === 'i' || e.key === 'I') setActiveTool('eyedropper');
        else if (e.key === 'b' || e.key === 'B') setActiveTool('brush');
        else if (e.key === 'e' || e.key === 'E') setActiveTool('eraser');
        else if (e.key === 'g' || e.key === 'G') setActiveTool('bucket');
        else if (e.key === 'p' || e.key === 'P') setActiveTool('pen');
        else if (e.key === 't' || e.key === 'T') setActiveTool('text');
        else if (e.key === 'u' || e.key === 'U') setActiveTool('shape');
        else if (e.key === 'h' || e.key === 'H') setActiveTool('hand');
        else if (e.key === 'z' || e.key === 'Z') setActiveTool('zoom');
        else if (e.key === 'x' || e.key === 'X') {
          // Swap colors
          const temp = foregroundColor;
          setForegroundColor(backgroundColor);
          setBackgroundColor(temp);
        } else if (e.key === 'd' || e.key === 'D') {
          setForegroundColor('#ffffff');
          setBackgroundColor('#000000');
        } else if (e.key === 'Delete' || e.key === 'Backspace') {
          if (selection.active) {
            handleClearSelection();
          }
        } else if (e.key === 'Escape') {
          if (activeTool === 'crop') {
            setActiveTool('select');
          } else if (selection.active) {
            setSelection({ active: false, type: null });
          }
        } else if (e.key === 'Enter') {
          if (activeTool === 'crop') {
            handleApplyCrop();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    historyIndex,
    history,
    canvasWidth,
    canvasHeight,
    selection,
    foregroundColor,
    backgroundColor,
    activeTool,
  ]);

  // Layer Management Handlers
  const handleUpdateLayer = (
    id: string,
    updates: Partial<Layer>,
    commitToHistory: boolean = true,
    historyLabel: string = 'Layer Properties'
  ) => {
    const updated = layers.map((layer) => {
      if (layer.id === id) {
        return { ...layer, ...updates };
      }
      return layer;
    });
    setLayers(updated);
    if (commitToHistory) {
      recordHistory(historyLabel, updated);
    }
  };

  const handleUpdateLayerCanvas = (
    id: string,
    newCanvas: HTMLCanvasElement,
    commitToHistory: boolean = false,
    historyLabel: string = 'Gaussian Blur'
  ) => {
    const updated = layers.map((layer) => {
      if (layer.id === id) {
        return { ...layer, canvas: newCanvas };
      }
      return layer;
    });
    setLayers(updated);
    if (commitToHistory) {
      recordHistory(historyLabel, updated);
    }
  };

  const handleNewLayer = () => {
    const newCanvas = createCanvas(canvasWidth, canvasHeight);
    const newLayer: Layer = {
      id: `layer-${Date.now()}`,
      name: `Layer ${layers.length + 1}`,
      type: 'raster',
      visible: true,
      locked: false,
      opacity: 1,
      blendMode: 'source-over',
      x: 0,
      y: 0,
      width: canvasWidth,
      height: canvasHeight,
      canvas: newCanvas,
    };
    const updated = [...layers, newLayer];
    setLayers(updated);
    setActiveLayerId(newLayer.id);
    recordHistory('New Layer', updated, canvasWidth, canvasHeight, newLayer.id);
  };

  const handleDuplicateLayer = () => {
    const target = layers.find((l) => l.id === activeLayerId);
    if (!target) return;

    const dupCanvas = cloneCanvas(target.canvas);
    const dupLayer: Layer = {
      ...target,
      id: `layer-${Date.now()}`,
      name: `${target.name} Copy`,
      canvas: dupCanvas,
      filters: target.filters ? { ...target.filters } : undefined,
    };

    const targetIdx = layers.findIndex((l) => l.id === activeLayerId);
    const updated = [...layers];
    updated.splice(targetIdx + 1, 0, dupLayer);

    setLayers(updated);
    setActiveLayerId(dupLayer.id);
    recordHistory(`Duplicate ${target.name}`, updated, canvasWidth, canvasHeight, dupLayer.id);
  };

  const handleDeleteLayer = () => {
    if (layers.length <= 1) return;
    const targetIdx = layers.findIndex((l) => l.id === activeLayerId);
    const updated = layers.filter((l) => l.id !== activeLayerId);
    const nextActive = updated[Math.max(0, targetIdx - 1)]?.id || updated[0].id;

    setLayers(updated);
    setActiveLayerId(nextActive);
    recordHistory('Delete Layer', updated, canvasWidth, canvasHeight, nextActive);
  };

  const handleMoveLayerUp = () => {
    const idx = layers.findIndex((l) => l.id === activeLayerId);
    if (idx < 0 || idx >= layers.length - 1) return;
    const updated = [...layers];
    const temp = updated[idx];
    updated[idx] = updated[idx + 1];
    updated[idx + 1] = temp;
    setLayers(updated);
    recordHistory('Reorder Layer Up', updated);
  };

  const handleMoveLayerDown = () => {
    const idx = layers.findIndex((l) => l.id === activeLayerId);
    if (idx <= 0) return;
    const updated = [...layers];
    const temp = updated[idx];
    updated[idx] = updated[idx - 1];
    updated[idx - 1] = temp;
    setLayers(updated);
    recordHistory('Reorder Layer Down', updated);
  };

  const handleMergeDown = () => {
    const idx = layers.findIndex((l) => l.id === activeLayerId);
    if (idx <= 0) return;

    const top = layers[idx];
    const bottom = layers[idx - 1];

    // Merge top layer onto bottom layer
    const mergedCanvas = createCanvas(canvasWidth, canvasHeight);
    const ctx = mergedCanvas.getContext('2d');
    if (ctx) {
      // Draw bottom
      ctx.globalAlpha = bottom.opacity;
      ctx.globalCompositeOperation = bottom.blendMode;
      ctx.drawImage(bottom.canvas, bottom.x, bottom.y);

      // Draw top
      ctx.globalAlpha = top.opacity;
      ctx.globalCompositeOperation = top.blendMode;
      ctx.drawImage(top.canvas, top.x, top.y);
    }

    const mergedLayer: Layer = {
      ...bottom,
      canvas: mergedCanvas,
      name: `${bottom.name} + ${top.name}`,
    };

    const updated = layers.filter((_, i) => i !== idx);
    updated[idx - 1] = mergedLayer;

    setLayers(updated);
    setActiveLayerId(mergedLayer.id);
    recordHistory('Merge Layer Down', updated, canvasWidth, canvasHeight, mergedLayer.id);
  };

  // Pixel change in layer
  const handleLayerPixelChange = (layerId: string, actionName: string) => {
    recordHistory(actionName);
  };

  // Move layer position
  const handleLayerPositionChange = (layerId: string, x: number, y: number) => {
    setLayers((prev) =>
      prev.map((l) => {
        if (l.id === layerId) {
          return { ...l, x, y };
        }
        return l;
      })
    );
  };

  // Rotate layer angle
  const handleLayerAngleChange = (layerId: string, angle: number, commit = true) => {
    setLayers((prev) =>
      prev.map((l) => {
        if (l.id === layerId) {
          return { ...l, angle };
        }
        return l;
      })
    );
    if (commit) {
      recordHistory(`Rotate Layer (${Math.round(angle)}°)`);
    }
  };

  // AI Generated Image Handlers
  const handleAddLayerFromImage = (imageUrl: string, promptName: string) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const layerCanvas = createCanvas(canvasWidth, canvasHeight);
      const ctx = layerCanvas.getContext('2d');
      if (ctx) {
        // Draw centered maintaining aspect ratio
        const scale = Math.min(canvasWidth / img.width, canvasHeight / img.height, 1);
        const w = img.width * scale;
        const h = img.height * scale;
        const x = (canvasWidth - w) / 2;
        const y = (canvasHeight - h) / 2;
        ctx.drawImage(img, x, y, w, h);
      }
      const newLayer: Layer = {
        id: `layer-${Date.now()}`,
        name: promptName || 'AI Layer',
        type: 'raster',
        visible: true,
        locked: false,
        opacity: 1,
        blendMode: 'source-over',
        x: 0,
        y: 0,
        width: canvasWidth,
        height: canvasHeight,
        canvas: layerCanvas,
        filters: {
          brightness: 0,
          contrast: 0,
          saturation: 0,
          hue: 0,
          blur: 0,
          invert: false,
        },
      };
      const updated = [newLayer, ...layers];
      setLayers(updated);
      setActiveLayerId(newLayer.id);
      recordHistory(promptName || 'Add AI Image Layer', updated, canvasWidth, canvasHeight, newLayer.id);
    };
    img.src = imageUrl;
  };

  const handleReplaceActiveLayerImage = (imageUrl: string, promptName: string) => {
    const active = layers.find((l) => l.id === activeLayerId);
    if (!active) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const layerCanvas = createCanvas(canvasWidth, canvasHeight);
      const ctx = layerCanvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
      }
      const updated = layers.map((l) => (l.id === active.id ? { ...l, canvas: layerCanvas } : l));
      setLayers(updated);
      recordHistory(promptName || 'AI Transform Layer', updated, canvasWidth, canvasHeight, active.id);
    };
    img.src = imageUrl;
  };

  // Selection Actions
  const handleClearSelection = () => {
    const active = layers.find((l) => l.id === activeLayerId);
    if (!active || active.locked) return;

    clearSelectionFromLayer(active.canvas, selection);
    recordHistory('Clear Selected Pixels');
  };

  const handleFillSelection = () => {
    const active = layers.find((l) => l.id === activeLayerId);
    if (!active || active.locked) return;

    fillSelectionOnLayer(active.canvas, selection, foregroundColor);
    recordHistory('Fill Selection');
  };

  const handleInvertSelection = () => {
    if (!selection.active || !selection.maskCanvas) return;
    const inv = invertMaskCanvas(selection.maskCanvas);
    setSelection({
      ...selection,
      maskCanvas: inv,
    });
  };

  const handleSelectAll = () => {
    const mask = createRectMaskCanvas(
      { x: 0, y: 0, width: canvasWidth, height: canvasHeight },
      canvasWidth,
      canvasHeight
    );
    setSelection({
      active: true,
      type: 'rect',
      rect: { x: 0, y: 0, width: canvasWidth, height: canvasHeight },
      maskCanvas: mask,
    });
  };

  // Pen Tool operations
  const handlePenStroke = () => {
    const active = layers.find((l) => l.id === activeLayerId);
    if (!active || active.locked || penPath.points.length < 2) return;

    const ctx = active.canvas.getContext('2d');
    if (ctx) {
      ctx.save();
      ctx.strokeStyle = foregroundColor;
      ctx.lineWidth = penStrokeWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      penPath.points.forEach((pt, i) => {
        if (i === 0) ctx.moveTo(pt.x - active.x, pt.y - active.y);
        else ctx.lineTo(pt.x - active.x, pt.y - active.y);
      });
      if (penPath.closed) ctx.closePath();
      ctx.stroke();
      ctx.restore();
      recordHistory('Stroke Pen Path');
    }
  };

  const handlePenFill = () => {
    const active = layers.find((l) => l.id === activeLayerId);
    if (!active || active.locked || penPath.points.length < 3) return;

    const ctx = active.canvas.getContext('2d');
    if (ctx) {
      ctx.save();
      ctx.fillStyle = foregroundColor;
      ctx.beginPath();
      penPath.points.forEach((pt, i) => {
        if (i === 0) ctx.moveTo(pt.x - active.x, pt.y - active.y);
        else ctx.lineTo(pt.x - active.x, pt.y - active.y);
      });
      ctx.closePath();
      ctx.fill();
      ctx.restore();
      recordHistory('Fill Pen Path');
    }
  };

  const handlePenMakeSelection = () => {
    if (penPath.points.length < 3) return;
    const mask = createCanvas(canvasWidth, canvasHeight);
    const ctx = mask.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      penPath.points.forEach((pt, i) => {
        if (i === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      });
      ctx.closePath();
      ctx.fill();
    }
    setSelection({
      active: true,
      type: 'lasso',
      polygon: [...penPath.points],
      maskCanvas: mask,
    });
  };

  // Add / Apply Text Layer
  const handleApplyText = () => {
    if (!textString.trim()) return;

    const textCanvas = createCanvas(canvasWidth, canvasHeight);
    const ctx = textCanvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = foregroundColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const weight = textBold ? 'bold' : 'normal';
      const style = textItalic ? 'italic' : 'normal';
      ctx.font = `${style} ${weight} ${textFontSize}px sans-serif`;
      ctx.fillText(textString, canvasWidth / 2, canvasHeight / 2);
    }

    const textLayer: Layer = {
      id: `layer-text-${Date.now()}`,
      name: `Text: ${textString.slice(0, 16)}`,
      type: 'text',
      visible: true,
      locked: false,
      opacity: 1,
      blendMode: 'source-over',
      x: 0,
      y: 0,
      width: canvasWidth,
      height: canvasHeight,
      canvas: textCanvas,
      textData: {
        text: textString,
        fontSize: textFontSize,
        fontFamily: 'sans-serif',
        color: foregroundColor,
        bold: textBold,
        italic: textItalic,
      },
    };

    const updated = [...layers, textLayer];
    setLayers(updated);
    setActiveLayerId(textLayer.id);
    recordHistory('Add Text Layer', updated, canvasWidth, canvasHeight, textLayer.id);
  };

  // Crop Canvas Execution
  const handleApplyCrop = () => {
    const { x, y, width, height } = cropBox;
    if (width <= 10 || height <= 10) return;

    const croppedLayers = cropCanvas(layers, cropBox);
    const newW = Math.round(width);
    const newH = Math.round(height);

    setCanvasWidth(newW);
    setCanvasHeight(newH);
    setCropBox({ x: 0, y: 0, width: newW, height: newH });
    setLayers(croppedLayers);
    setActiveTool('select');
    setSelection({ active: false, type: null });
    recordHistory('Crop Canvas', croppedLayers, newW, newH);
  };

  // Canvas Resize with Anchor
  const handleApplyCanvasResize = (newW: number, newH: number, anchor: AnchorPosition) => {
    const resizedLayers = resizeCanvasWithAnchor(layers, canvasWidth, canvasHeight, newW, newH, anchor);
    setCanvasWidth(newW);
    setCanvasHeight(newH);
    setCropBox({ x: 0, y: 0, width: newW, height: newH });
    setLayers(resizedLayers);
    recordHistory(`Resize Canvas (${anchor})`, resizedLayers, newW, newH);
  };

  // Image Resample
  const handleApplyImageResample = (newW: number, newH: number) => {
    const resampled = resampleImage(layers, canvasWidth, canvasHeight, newW, newH);
    setCanvasWidth(newW);
    setCanvasHeight(newH);
    setCropBox({ x: 0, y: 0, width: newW, height: newH });
    setLayers(resampled);
    recordHistory('Rescale Image', resampled, newW, newH);
  };

  // Create New Document
  const handleCreateNewDocument = (w: number, h: number, bg: string, docName: string) => {
    const bgCanvas = createCanvas(w, h);
    const ctx = bgCanvas.getContext('2d');
    if (ctx && bg !== 'transparent') {
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);
    }

    const baseLayer: Layer = {
      id: 'layer-bg',
      name: 'Background',
      type: 'raster',
      visible: true,
      locked: false,
      opacity: 1,
      blendMode: 'source-over',
      x: 0,
      y: 0,
      width: w,
      height: h,
      canvas: bgCanvas,
    };

    setProjectName(docName);
    setCanvasWidth(w);
    setCanvasHeight(h);
    setCropBox({ x: 0, y: 0, width: w, height: h });
    setLayers([baseLayer]);
    setActiveLayerId(baseLayer.id);
    setSelection({ active: false, type: null });
    setZoom(1);
    setPan({ x: 0, y: 0 });

    recordHistory('New Document', [baseLayer], w, h, baseLayer.id);
  };

  // Load Canva-Style Design Template
  const handleSelectTemplate = (template: DesignTemplate) => {
    const { layers: newLayers, activeLayerId: newActiveId } = template.generateLayers();
    setProjectName(template.title);
    setCanvasWidth(template.width);
    setCanvasHeight(template.height);
    setCropBox({ x: 0, y: 0, width: template.width, height: template.height });
    setLayers(newLayers);
    setActiveLayerId(newActiveId);
    setSelection({ active: false, type: null });
    setPan({ x: 0, y: 0 });

    const availW = Math.max(80, (window.innerWidth || 1200) - (isSidebarOpen ? 320 : 60) - 100);
    const availH = Math.max(80, (window.innerHeight || 800) - 180);
    const fit = Math.min(availW / template.width, availH / template.height, 1);
    setZoom(Math.max(0.1, Number(fit.toFixed(2))));

    recordHistory(`Load Template: ${template.title}`, newLayers, template.width, template.height, newActiveId);
  };

  // Open Image File from Computer
  const handleOpenFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const w = img.naturalWidth || 800;
        const h = img.naturalHeight || 600;

        const imgCanvas = createCanvas(w, h);
        const ctx = imgCanvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
        }

        const imgLayer: Layer = {
          id: `layer-img-${Date.now()}`,
          name: file.name.replace(/\.[^/.]+$/, ''),
          type: 'raster',
          visible: true,
          locked: false,
          opacity: 1,
          blendMode: 'source-over',
          x: 0,
          y: 0,
          width: w,
          height: h,
          canvas: imgCanvas,
        };

        setProjectName(file.name.replace(/\.[^/.]+$/, ''));
        setCanvasWidth(w);
        setCanvasHeight(h);
        setCropBox({ x: 0, y: 0, width: w, height: h });
        setLayers([imgLayer]);
        setActiveLayerId(imgLayer.id);
        setSelection({ active: false, type: null });
        setZoom(1);
        setPan({ x: 0, y: 0 });

        recordHistory(`Open ${file.name}`, [imgLayer], w, h, imgLayer.id);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Save Project JSON
  const handleSaveJson = () => {
    const serializedLayers = layers.map(serializeLayer);
    const projectData = {
      version: '1.0',
      name: projectName,
      canvasWidth,
      canvasHeight,
      layers: serializedLayers,
      timestamp: Date.now(),
    };

    const blob = new Blob([JSON.stringify(projectData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName || 'photolite-project'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Open Project JSON
  const handleOpenJson = () => {
    jsonInputRef.current?.click();
  };

  const handleJsonSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const project = JSON.parse(event.target?.result as string);
        if (project && project.layers) {
          const restoredLayers = await Promise.all(project.layers.map(deserializeLayer));
          const w = project.canvasWidth || 800;
          const h = project.canvasHeight || 600;

          setProjectName(project.name || 'Restored Project');
          setCanvasWidth(w);
          setCanvasHeight(h);
          setCropBox({ x: 0, y: 0, width: w, height: h });
          setLayers(restoredLayers);
          setActiveLayerId(restoredLayers[0]?.id || '');
          setSelection({ active: false, type: null });

          recordHistory('Open JSON Project', restoredLayers, w, h);
        }
      } catch (err) {
        console.error('Failed to parse project JSON', err);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Invert colors on active layer
  const handleInvertColors = () => {
    const active = layers.find((l) => l.id === activeLayerId);
    if (!active || active.locked) return;

    const ctx = active.canvas.getContext('2d');
    if (!ctx) return;

    const imgData = ctx.getImageData(0, 0, active.width, active.height);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      data[i] = 255 - data[i];
      data[i + 1] = 255 - data[i + 1];
      data[i + 2] = 255 - data[i + 2];
    }
    ctx.putImageData(imgData, 0, 0);
    recordHistory('Invert Colors');
  };

  // Auto Contrast / Brighten active layer
  const handleAutoEnhance = () => {
    const active = layers.find((l) => l.id === activeLayerId);
    if (!active || active.locked) return;

    const ctx = active.canvas.getContext('2d');
    if (!ctx) return;

    const imgData = ctx.getImageData(0, 0, active.width, active.height);
    const data = imgData.data;

    let minR = 255, maxR = 0;
    let minG = 255, maxG = 0;
    let minB = 255, maxB = 0;

    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] > 10) {
        if (data[i] < minR) minR = data[i];
        if (data[i] > maxR) maxR = data[i];
        if (data[i + 1] < minG) minG = data[i + 1];
        if (data[i + 1] > maxG) maxG = data[i + 1];
        if (data[i + 2] < minB) minB = data[i + 2];
        if (data[i + 2] > maxB) maxB = data[i + 2];
      }
    }

    const rangeR = maxR - minR || 1;
    const rangeG = maxG - minG || 1;
    const rangeB = maxB - minB || 1;

    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] > 0) {
        data[i] = Math.min(255, Math.max(0, ((data[i] - minR) / rangeR) * 255));
        data[i + 1] = Math.min(255, Math.max(0, ((data[i + 1] - minG) / rangeG) * 255));
        data[i + 2] = Math.min(255, Math.max(0, ((data[i + 2] - minB) / rangeB) * 255));
      }
    }

    ctx.putImageData(imgData, 0, 0);
    recordHistory('Auto Contrast Enhance');
  };

  // Convert active layer to grayscale by iterating pixel data using ITU-R BT.601 luminance formula
  const handleConvertToGrayscale = () => {
    const active = layers.find((l) => l.id === activeLayerId);
    if (!active || active.locked) return;

    const ctx = active.canvas.getContext('2d');
    if (!ctx) return;

    const imgData = ctx.getImageData(0, 0, active.width, active.height);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      // Perceptual luminance formula: Y = 0.299*R + 0.587*G + 0.114*B
      const lum = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
      data[i] = lum;
      data[i + 1] = lum;
      data[i + 2] = lum;
    }
    ctx.putImageData(imgData, 0, 0);
    recordHistory('Grayscale (Luminance)');
  };

  // Convert active layer to sepia tone by iterating pixel data using standard sepia transformation matrix
  const handleConvertToSepia = () => {
    const active = layers.find((l) => l.id === activeLayerId);
    if (!active || active.locked) return;

    const ctx = active.canvas.getContext('2d');
    if (!ctx) return;

    const imgData = ctx.getImageData(0, 0, active.width, active.height);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // Standard Sepia transformation matrix
      const sr = 0.393 * r + 0.769 * g + 0.189 * b;
      const sg = 0.349 * r + 0.686 * g + 0.168 * b;
      const sb = 0.272 * r + 0.534 * g + 0.131 * b;

      data[i] = sr > 255 ? 255 : sr < 0 ? 0 : Math.round(sr);
      data[i + 1] = sg > 255 ? 255 : sg < 0 ? 0 : Math.round(sg);
      data[i + 2] = sb > 255 ? 255 : sb < 0 ? 0 : Math.round(sb);
    }
    ctx.putImageData(imgData, 0, 0);
    recordHistory('Sepia Tone');
  };

  // Layer filters
  const handleUpdateFilters = (filters: LayerFilter) => {
    const active = layers.find((l) => l.id === activeLayerId);
    if (!active) return;
    handleUpdateLayer(active.id, { filters });
  };

  return (
    <div id="photolite-app-root" className="flex h-screen w-screen flex-col overflow-hidden bg-[#1a1a1a] text-gray-300 font-sans select-none">
      {/* Hidden file inputs for opening files */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelected}
        className="sr-only"
      />
      <input
        ref={jsonInputRef}
        type="file"
        accept=".json,application/json"
        onChange={handleJsonSelected}
        className="sr-only"
      />

      {/* Top Application Menu Bar */}
      <MenuBar
        onNew={() => setIsNewCanvasOpen(true)}
        onOpenFile={handleOpenFile}
        onSaveJson={handleSaveJson}
        onOpenJson={handleOpenJson}
        onExportModal={() => setIsExportModalOpen(true)}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        onResizeCanvasModal={() => {
          setResizeModalMode('canvas');
          setIsResizeModalOpen(true);
        }}
        onResizeImageModal={() => {
          setResizeModalMode('image');
          setIsResizeModalOpen(true);
        }}
        onCropTool={() => {
          setActiveTool('crop');
          setCropBox({ x: 0, y: 0, width: canvasWidth, height: canvasHeight });
        }}
        onInvertColors={handleInvertColors}
        onAutoEnhance={handleAutoEnhance}
        onConvertToGrayscale={handleConvertToGrayscale}
        onConvertToSepia={handleConvertToSepia}
        onOpenHue={() => {
          setIsSidebarOpen(true);
          setSidebarTab('adjustments');
        }}
        onOpenHueSaturation={() => {
          setIsSidebarOpen(true);
          setSidebarTab('adjustments');
        }}
        onOpenSaturation={() => {
          setIsSidebarOpen(true);
          setSidebarTab('adjustments');
        }}
        onOpenNoise={() => {
          setIsSidebarOpen(true);
          setSidebarTab('adjustments');
        }}
        onOpenGaussianBlur={() => {
          setIsSidebarOpen(true);
          setSidebarTab('adjustments');
        }}
        onOpenAIModal={() => setIsAIModalOpen(true)}
        onOpenTemplatesModal={() => setIsTemplatesModalOpen(true)}
        onOpenProModal={() => setIsProModalOpen(true)}
        isProUser={isProUser}
        onNewLayer={handleNewLayer}
        onDuplicateLayer={handleDuplicateLayer}
        onDeleteLayer={handleDeleteLayer}
        onRotateCW={() => {
          if (activeLayerId) {
            const active = layers.find((l) => l.id === activeLayerId);
            if (active) handleLayerAngleChange(activeLayerId, (active.angle || 0) + 90, true);
          }
        }}
        onRotateCCW={() => {
          if (activeLayerId) {
            const active = layers.find((l) => l.id === activeLayerId);
            if (active) handleLayerAngleChange(activeLayerId, (active.angle || 0) - 90, true);
          }
        }}
        onResetRotation={() => {
          if (activeLayerId) {
            handleLayerAngleChange(activeLayerId, 0, true);
          }
        }}
        onSelectAll={handleSelectAll}
        onDeselect={() => setSelection({ active: false, type: null })}
        onZoomIn={() => setZoom((z) => Math.min(8, z * 1.25))}
        onZoomOut={() => setZoom((z) => Math.max(0.1, z * 0.8))}
        onFitScreen={() => {
          setZoom(1);
          setPan({ x: 0, y: 0 });
        }}
        onZoom100={() => {
          setZoom(1);
        }}
        zoom={zoom}
        canvasWidth={canvasWidth}
        canvasHeight={canvasHeight}
        projectName={projectName}
        setProjectName={setProjectName}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((open) => !open)}
      />

      {/* Contextual Tool Options Bar */}
      <ToolOptionsBar
        activeTool={activeTool}
        brushSize={brushSize}
        setBrushSize={setBrushSize}
        brushOpacity={brushOpacity}
        setBrushOpacity={setBrushOpacity}
        brushHardness={brushHardness}
        setBrushHardness={setBrushHardness}
        wandTolerance={wandTolerance}
        setWandTolerance={setWandTolerance}
        selection={selection}
        onDeselect={() => setSelection({ active: false, type: null })}
        onInvertSelection={handleInvertSelection}
        onClearSelection={handleClearSelection}
        onFillSelection={handleFillSelection}
        penPath={penPath}
        penStrokeWidth={penStrokeWidth}
        setPenStrokeWidth={setPenStrokeWidth}
        onPenStroke={handlePenStroke}
        onPenFill={handlePenFill}
        onPenMakeSelection={handlePenMakeSelection}
        onPenClear={() => setPenPath({ points: [], closed: false })}
        cropAspectRatio={cropAspectRatio}
        setCropAspectRatio={setCropAspectRatio}
        onApplyCrop={handleApplyCrop}
        onCancelCrop={() => setActiveTool('select')}
        shapeType={shapeType}
        setShapeType={setShapeType}
        shapeStrokeWidth={shapeStrokeWidth}
        setShapeStrokeWidth={setShapeStrokeWidth}
        textString={textString}
        setTextString={setTextString}
        textFontSize={textFontSize}
        setTextFontSize={setTextFontSize}
        textBold={textBold}
        setTextBold={setTextBold}
        textItalic={textItalic}
        setTextItalic={setTextItalic}
        onApplyText={handleApplyText}
        activeLayer={layers.find((l) => l.id === activeLayerId) || null}
        onUpdateLayerAngle={(angle, commit) => {
          if (activeLayerId) {
            handleLayerAngleChange(activeLayerId, angle, commit);
          }
        }}
      />

      {/* Main Studio Workspace: Toolbar (Left) + Viewport (Center) + Sidebar (Right) */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Toolbar */}
        <Toolbar
          activeTool={activeTool}
          setActiveTool={setActiveTool}
          foregroundColor={foregroundColor}
          setForegroundColor={setForegroundColor}
          backgroundColor={backgroundColor}
          setBackgroundColor={setBackgroundColor}
          onOpenTemplates={() => setIsTemplatesModalOpen(true)}
        />

        {/* Central Canvas Viewport */}
        <CanvasViewport
          canvasWidth={canvasWidth}
          canvasHeight={canvasHeight}
          layers={layers}
          activeLayerId={activeLayerId}
          activeTool={activeTool}
          foregroundColor={foregroundColor}
          backgroundColor={backgroundColor}
          setForegroundColor={setForegroundColor}
          brushSize={brushSize}
          brushOpacity={brushOpacity}
          brushHardness={brushHardness}
          wandTolerance={wandTolerance}
          selection={selection}
          setSelection={setSelection}
          penPath={penPath}
          setPenPath={setPenPath}
          cropBox={cropBox}
          setCropBox={setCropBox}
          cropAspectRatio={cropAspectRatio}
          onApplyCrop={handleApplyCrop}
          shapeType={shapeType}
          shapeStrokeWidth={shapeStrokeWidth}
          zoom={zoom}
          setZoom={setZoom}
          pan={pan}
          setPan={setPan}
          onLayerPixelChange={handleLayerPixelChange}
          onLayerPositionChange={handleLayerPositionChange}
          onLayerAngleChange={handleLayerAngleChange}
        />

        {/* Right Sidebar (Layers, History, Adjustments) */}
        {isSidebarOpen && (
          <RightSidebar
            layers={layers}
            activeLayerId={activeLayerId}
            setActiveLayerId={setActiveLayerId}
            activeTab={sidebarTab}
            onTabChange={setSidebarTab}
            onUpdateLayer={handleUpdateLayer}
            onNewLayer={handleNewLayer}
            onDuplicateLayer={handleDuplicateLayer}
            onDeleteLayer={handleDeleteLayer}
            onMoveLayerUp={handleMoveLayerUp}
            onMoveLayerDown={handleMoveLayerDown}
            onMergeDown={handleMergeDown}
            history={history}
            historyIndex={historyIndex}
            onJumpToHistory={handleJumpToHistory}
            onUndo={handleUndo}
            onRedo={handleRedo}
            onClearHistory={() => {
              const current = history[historyIndex] || history[0];
              if (current) {
                setHistory([current]);
                setHistoryIndex(0);
              }
            }}
            onUpdateFilters={handleUpdateFilters}
            onUpdateLayerCanvas={handleUpdateLayerCanvas}
          />
        )}
      </div>

      {/* Modals */}
      <NewCanvasModal
        isOpen={isNewCanvasOpen}
        onClose={() => setIsNewCanvasOpen(false)}
        onCreate={handleCreateNewDocument}
        onOpenTemplates={() => setIsTemplatesModalOpen(true)}
      />

      <ResizeModal
        isOpen={isResizeModalOpen}
        onClose={() => setIsResizeModalOpen(false)}
        currentWidth={canvasWidth}
        currentHeight={canvasHeight}
        initialMode={resizeModalMode}
        onApplyCanvasResize={handleApplyCanvasResize}
        onApplyImageResample={handleApplyImageResample}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        layers={layers}
        canvasWidth={canvasWidth}
        canvasHeight={canvasHeight}
        projectName={projectName}
      />

      <AIImageModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        activeLayer={layers.find((l) => l.id === activeLayerId) || null}
        canvasWidth={canvasWidth}
        canvasHeight={canvasHeight}
        isProUser={isProUser}
        onOpenProModal={() => setIsProModalOpen(true)}
        onAddLayerFromImage={handleAddLayerFromImage}
        onReplaceActiveLayerImage={handleReplaceActiveLayerImage}
      />

      <ProPlanModal
        isOpen={isProModalOpen}
        onClose={() => setIsProModalOpen(false)}
        isProUser={isProUser}
        setIsProUser={setIsProUser}
        onOpenAIModal={() => setIsAIModalOpen(true)}
      />

      <TemplatesModal
        isOpen={isTemplatesModalOpen}
        onClose={() => setIsTemplatesModalOpen(false)}
        onSelectTemplate={handleSelectTemplate}
        currentLayersCount={layers.length}
      />
    </div>
  );
}
