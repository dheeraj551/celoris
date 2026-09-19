import { Layer } from '../types';
import { createCanvas } from '../utils/canvasUtils';

export interface TemplateLayerDefinition {
  id: string;
  name: string;
  url: string;
  type: 'raster' | 'text' | 'shape';
  opacity?: number;
  blendMode?: any;
}

export const NO_SIGNAL_TEMPLATE = {
  id: 'no-signal-surreal-booth',
  title: 'No Signal — Surreal Phone Booth',
  category: 'poster' as const,
  categoryLabel: 'Art Poster',
  width: 576,
  height: 1024,
  description: 'Retro surrealist art poster divided into 6 independent editable layers: Sky & Clouds, Distant Fields, Red Phone Booth with Sky Portal Cables, Foreground Wild Mushrooms & Wheat, and Distressed Typography.',
  tags: ['Art', 'Poster', 'Surreal', 'Layers', 'Retro', 'Phone Booth'],
  accentColor: '#c9322b',
  badgeText: '6 Layers',
  thumbnail: '/templates/no-signal/thumbnail.jpg',
  layers: [
    {
      id: 'layer-bg',
      name: 'Background (Sky, Clouds & Prairie)',
      url: '/templates/no-signal/layer-1-background.png',
      type: 'raster' as const,
      opacity: 1,
      blendMode: 'source-over' as const,
    },
    {
      id: 'layer-booth',
      name: 'Red Telephone Booth & Portal Cables',
      url: '/templates/no-signal/layer-2-telephone-booth.png',
      type: 'raster' as const,
      opacity: 1,
      blendMode: 'source-over' as const,
    },
    {
      id: 'layer-mushrooms',
      name: 'Wild Mushrooms & Wheat Stalks',
      url: '/templates/no-signal/layer-3-mushrooms-grass.png',
      type: 'raster' as const,
      opacity: 1,
      blendMode: 'source-over' as const,
    },
    {
      id: 'layer-title',
      name: 'Title — NO SIGNAL',
      url: '/templates/no-signal/layer-4-title-no-signal.png',
      type: 'text' as const,
      opacity: 1,
      blendMode: 'source-over' as const,
      textData: {
        text: 'NO\nSIGNAL',
        fontSize: 70,
        fontFamily: 'Impact, "Arial Black", sans-serif',
        color: '#16191d',
        bold: true,
        italic: false,
        x: 288,
        y: 180,
        align: 'center' as const,
        lineHeight: 74,
      },
    },
    {
      id: 'layer-badge',
      name: 'Side Graphic Badge — ERIANHOC',
      url: '/templates/no-signal/layer-5-badge-left.png',
      type: 'text' as const,
      opacity: 1,
      blendMode: 'source-over' as const,
      textData: {
        text: 'ERIANHOC',
        fontSize: 34,
        fontFamily: 'Impact, sans-serif',
        color: '#16191d',
        bold: true,
        italic: false,
        x: 58,
        y: 672,
        isVertical: true,
        align: 'center' as const,
        lineHeight: 38,
      },
    },
    {
      id: 'layer-subtitle',
      name: 'Margin Subtitle — Somewhere Between...',
      url: '/templates/no-signal/layer-6-subtitle-right.png',
      type: 'text' as const,
      opacity: 1,
      blendMode: 'source-over' as const,
      textData: {
        text: 'SOMEWHERE BETWEEN HERE AND NO WHERE',
        fontSize: 11,
        fontFamily: 'monospace, sans-serif',
        color: '#6e695f',
        bold: false,
        italic: false,
        x: 532,
        y: 500,
        isVertical: true,
        align: 'center' as const,
        lineHeight: 15,
      },
    },
  ],
};

export async function loadNoSignalLayers(
  onProgress?: (loaded: number, total: number) => void
): Promise<{ layers: Layer[]; activeLayerId: string; width: number; height: number }> {
  const { width, height, layers: layerDefs } = NO_SIGNAL_TEMPLATE;
  const loadedLayers: Layer[] = [];

  for (let i = 0; i < layerDefs.length; i++) {
    const def = layerDefs[i];
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    await new Promise<void>((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
        }
        resolve();
      };
      img.onerror = () => {
        resolve();
      };
      img.src = def.url;
    });

    loadedLayers.push({
      id: `${def.id}-${Date.now()}-${i}`,
      name: def.name,
      type: def.type,
      visible: true,
      locked: false,
      opacity: def.opacity ?? 1,
      blendMode: def.blendMode ?? 'source-over',
      x: 0,
      y: 0,
      width,
      height,
      canvas,
      textData: def.textData ? { ...def.textData } : undefined,
    });

    if (onProgress) {
      onProgress(i + 1, layerDefs.length);
    }
  }

  return {
    layers: loadedLayers,
    activeLayerId: loadedLayers[1]?.id || loadedLayers[0].id,
    width,
    height,
  };
}
