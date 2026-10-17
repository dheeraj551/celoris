import { initializeCanvas, readPsd } from 'ag-psd';
import { Layer, BlendMode } from '../types';
import { createCanvas } from './canvasUtils';

let initialized = false;
function ensurePsdCanvasInit() {
  if (initialized || typeof window === 'undefined') return;
  try {
    initializeCanvas(
      (width, height) => {
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(width));
        canvas.height = Math.max(1, Math.round(height));
        return canvas;
      },
      (width, height) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        return (
          ctx?.createImageData(Math.max(1, Math.round(width)), Math.max(1, Math.round(height))) ||
          new ImageData(Math.max(1, Math.round(width)), Math.max(1, Math.round(height)))
        );
      }
    );
    initialized = true;
  } catch (err) {
    console.warn('ag-psd initializeCanvas error:', err);
  }
}

const BLEND_MODE_MAP: Record<string, BlendMode> = {
  normal: 'source-over',
  'pass through': 'source-over',
  multiply: 'multiply',
  screen: 'screen',
  overlay: 'overlay',
  darken: 'darken',
  lighten: 'lighten',
  'color dodge': 'color-dodge',
  'color burn': 'color-burn',
  'hard light': 'hard-light',
  'soft light': 'soft-light',
  difference: 'difference',
  exclusion: 'exclusion',
};

export async function parsePsdFile(file: File): Promise<{
  projectName: string;
  width: number;
  height: number;
  layers: Layer[];
}> {
  ensurePsdCanvasInit();
  const buffer = await file.arrayBuffer();
  const psd = readPsd(buffer, { skipLayerImageData: false, skipCompositeImageData: false });

  const width = Math.max(10, Math.round(psd.width || 800));
  const height = Math.max(10, Math.round(psd.height || 600));
  const projectName = file.name.replace(/\.[^/.]+$/, '');

  const extractedLayers: Layer[] = [];

  // Recursive extractor for nested layer groups
  function extractChildren(children: any[], groupPrefix = '') {
    for (const child of children) {
      if (child.children && child.children.length > 0) {
        extractChildren(child.children, `${groupPrefix}${child.name || 'Group'}/`);
      }
      if (child.canvas) {
        const layerWidth = Math.max(1, Math.round(child.canvas.width));
        const layerHeight = Math.max(1, Math.round(child.canvas.height));
        const x = Math.round(child.left ?? 0);
        const y = Math.round(child.top ?? 0);
        const opacity =
          typeof child.opacity === 'number' ? Math.max(0, Math.min(1, child.opacity)) : 1;
        const blendMode: BlendMode =
          (child.blendMode && BLEND_MODE_MAP[child.blendMode]) || 'source-over';
        const visible = child.hidden !== true;

        extractedLayers.push({
          id: `layer-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          name: `${groupPrefix}${child.name || 'Layer ' + (extractedLayers.length + 1)}`,
          type: 'raster',
          visible,
          locked: false,
          opacity,
          blendMode,
          x,
          y,
          width: layerWidth,
          height: layerHeight,
          canvas: child.canvas as HTMLCanvasElement,
        });
      }
    }
  }

  if (psd.children && psd.children.length > 0) {
    extractChildren(psd.children);
  }

  // If no layers had canvas (e.g. flattened PSD or single composite), fall back to composite canvas
  if (extractedLayers.length === 0) {
    let compositeCanvas: HTMLCanvasElement;
    if (psd.canvas) {
      compositeCanvas = psd.canvas as HTMLCanvasElement;
    } else {
      compositeCanvas = createCanvas(width, height);
    }

    extractedLayers.push({
      id: `layer-composite-${Date.now()}`,
      name: projectName || 'Background',
      type: 'raster',
      visible: true,
      locked: false,
      opacity: 1,
      blendMode: 'source-over',
      x: 0,
      y: 0,
      width,
      height,
      canvas: compositeCanvas,
    });
  }

  return {
    projectName,
    width,
    height,
    layers: extractedLayers,
  };
}
