export type ToolType =
  | 'select'     // Move / Transform layer
  | 'rotate'     // Rotate active layer around its center
  | 'marquee'    // Rectangular selection
  | 'lasso'      // Freehand polygon lasso selection
  | 'wand'       // Magic wand flood selection
  | 'crop'       // Crop canvas/image
  | 'pen'        // Bézier pen path tool
  | 'brush'      // Paint brush
  | 'eraser'     // Eraser
  | 'bucket'     // Paint bucket flood fill
  | 'text'       // Text layer tool
  | 'shape'      // Vector shapes (rect, circle, line)
  | 'eyedropper' // Color picker
  | 'hand'       // Canvas pan
  | 'zoom';      // Canvas zoom

export type BlendMode =
  | 'source-over'
  | 'multiply'
  | 'screen'
  | 'overlay'
  | 'darken'
  | 'lighten'
  | 'color-dodge'
  | 'color-burn'
  | 'hard-light'
  | 'soft-light'
  | 'difference'
  | 'exclusion';

export interface LayerFilter {
  brightness: number; // -100 to 100, default 0
  contrast: number;   // -100 to 100, default 0
  saturation: number; // -100 to 100, default 0
  hue: number;        // -180 to 180, default 0
  blur: number;       // 0 to 50 px, default 0
  invert: boolean;
}

export interface Layer {
  id: string;
  name: string;
  type: 'raster' | 'text' | 'shape';
  visible: boolean;
  locked: boolean;
  opacity: number; // 0 to 1
  blendMode: BlendMode;
  x: number;
  y: number;
  width: number;
  height: number;
  // in-memory canvas holding layer pixel data
  canvas: HTMLCanvasElement;
  // text specific properties
  textData?: {
    text: string;
    fontSize: number;
    fontFamily: string;
    color: string;
    bold: boolean;
    italic: boolean;
  };
  // shape specific properties
  shapeData?: {
    shapeType: 'rect' | 'circle' | 'line';
    fill: string;
    stroke: string;
    strokeWidth: number;
  };
  filters?: LayerFilter;
  angle?: number; // rotation in degrees around center (x + width/2, y + height/2)
}

export interface SerializedLayer {
  id: string;
  name: string;
  type: 'raster' | 'text' | 'shape';
  visible: boolean;
  locked: boolean;
  opacity: number;
  blendMode: BlendMode;
  x: number;
  y: number;
  width: number;
  height: number;
  dataUrl: string;
  angle?: number;
  textData?: {
    text: string;
    fontSize: number;
    fontFamily: string;
    color: string;
    bold: boolean;
    italic: boolean;
  };
  shapeData?: {
    shapeType: 'rect' | 'circle' | 'line';
    fill: string;
    stroke: string;
    strokeWidth: number;
  };
  filters?: LayerFilter;
}

export interface SelectionState {
  active: boolean;
  type: 'rect' | 'lasso' | 'wand' | null;
  rect?: { x: number; y: number; width: number; height: number };
  polygon?: { x: number; y: number }[];
  maskCanvas?: HTMLCanvasElement; // White pixels = selected, transparent = not
}

export interface PenPoint {
  x: number;
  y: number;
  cp1?: { x: number; y: number }; // control point in
  cp2?: { x: number; y: number }; // control point out
}

export interface PenPath {
  points: PenPoint[];
  closed: boolean;
}

export interface CropBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface HistoryStep {
  id: string;
  name: string;
  timestamp: number;
  layers: SerializedLayer[];
  canvasWidth: number;
  canvasHeight: number;
  activeLayerId: string;
}

export type ExportFormat = 'png' | 'jpeg' | 'webp';
