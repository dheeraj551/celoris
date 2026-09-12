import { SelectionState } from '../types';
import { createCanvas } from './canvasUtils';

// Check if point is inside a polygon (ray casting)
export function isPointInPolygon(
  p: { x: number; y: number },
  polygon: { x: number; y: number }[]
): boolean {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x;
    const yi = polygon[i].y;
    const xj = polygon[j].x;
    const yj = polygon[j].y;

    const intersect =
      yi > p.y !== yj > p.y &&
      p.x < ((xj - xi) * (p.y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

// Generate a mask canvas from polygon points (Lasso)
export function createLassoMaskCanvas(
  polygon: { x: number; y: number }[],
  width: number,
  height: number
): HTMLCanvasElement {
  const mask = createCanvas(width, height);
  const ctx = mask.getContext('2d');
  if (!ctx || polygon.length < 3) return mask;

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(polygon[0].x, polygon[0].y);
  for (let i = 1; i < polygon.length; i++) {
    ctx.lineTo(polygon[i].x, polygon[i].y);
  }
  ctx.closePath();
  ctx.fill();

  return mask;
}

// Generate a mask canvas from rectangular selection (Marquee)
export function createRectMaskCanvas(
  rect: { x: number; y: number; width: number; height: number },
  width: number,
  height: number
): HTMLCanvasElement {
  const mask = createCanvas(width, height);
  const ctx = mask.getContext('2d');
  if (!ctx) return mask;

  ctx.fillStyle = '#ffffff';
  const rx = rect.width < 0 ? rect.x + rect.width : rect.x;
  const ry = rect.height < 0 ? rect.y + rect.height : rect.y;
  const rw = Math.abs(rect.width);
  const rh = Math.abs(rect.height);

  ctx.fillRect(rx, ry, rw, rh);
  return mask;
}

// Invert selection mask
export function invertMaskCanvas(mask: HTMLCanvasElement): HTMLCanvasElement {
  const inverted = createCanvas(mask.width, mask.height);
  const ctx = inverted.getContext('2d');
  if (!ctx) return inverted;

  const srcCtx = mask.getContext('2d');
  if (!srcCtx) return inverted;

  const srcData = srcCtx.getImageData(0, 0, mask.width, mask.height);
  const invData = ctx.createImageData(mask.width, mask.height);

  for (let i = 0; i < srcData.data.length; i += 4) {
    const isSelected = srcData.data[i + 3] > 128;
    if (!isSelected) {
      invData.data[i] = 255;
      invData.data[i + 1] = 255;
      invData.data[i + 2] = 255;
      invData.data[i + 3] = 255;
    }
  }

  ctx.putImageData(invData, 0, 0);
  return inverted;
}

// Delete / Clear selected pixels from target layer canvas
export function clearSelectionFromLayer(
  layerCanvas: HTMLCanvasElement,
  selection: SelectionState
): void {
  if (!selection.active) return;
  const ctx = layerCanvas.getContext('2d');
  if (!ctx) return;

  ctx.save();
  ctx.globalCompositeOperation = 'destination-out';

  if (selection.maskCanvas) {
    ctx.drawImage(selection.maskCanvas, 0, 0);
  } else if (selection.type === 'rect' && selection.rect) {
    const { x, y, width, height } = selection.rect;
    const rx = width < 0 ? x + width : x;
    const ry = height < 0 ? y + height : y;
    ctx.fillStyle = '#000000';
    ctx.fillRect(rx, ry, Math.abs(width), Math.abs(height));
  } else if (selection.type === 'lasso' && selection.polygon && selection.polygon.length > 2) {
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.moveTo(selection.polygon[0].x, selection.polygon[0].y);
    for (let i = 1; i < selection.polygon.length; i++) {
      ctx.lineTo(selection.polygon[i].x, selection.polygon[i].y);
    }
    ctx.closePath();
    ctx.fill();
  }

  ctx.restore();
}

// Fill selected area with a solid color
export function fillSelectionOnLayer(
  layerCanvas: HTMLCanvasElement,
  selection: SelectionState,
  color: string
): void {
  const ctx = layerCanvas.getContext('2d');
  if (!ctx) return;

  if (selection.active && selection.maskCanvas) {
    // Create temporary fill canvas
    const tempCanvas = createCanvas(layerCanvas.width, layerCanvas.height);
    const tempCtx = tempCanvas.getContext('2d');
    if (tempCtx) {
      tempCtx.fillStyle = color;
      tempCtx.fillRect(0, 0, layerCanvas.width, layerCanvas.height);
      tempCtx.globalCompositeOperation = 'destination-in';
      tempCtx.drawImage(selection.maskCanvas, 0, 0);
    }
    ctx.drawImage(tempCanvas, 0, 0);
  } else if (selection.active && selection.type === 'rect' && selection.rect) {
    ctx.fillStyle = color;
    const { x, y, width, height } = selection.rect;
    const rx = width < 0 ? x + width : x;
    const ry = height < 0 ? y + height : y;
    ctx.fillRect(rx, ry, Math.abs(width), Math.abs(height));
  } else if (selection.active && selection.type === 'lasso' && selection.polygon && selection.polygon.length > 2) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(selection.polygon[0].x, selection.polygon[0].y);
    for (let i = 1; i < selection.polygon.length; i++) {
      ctx.lineTo(selection.polygon[i].x, selection.polygon[i].y);
    }
    ctx.closePath();
    ctx.fill();
  } else {
    // Fill entire layer
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, layerCanvas.width, layerCanvas.height);
  }
}

// Draw animated marching ants boundary
export function drawMarchingAnts(
  ctx: CanvasRenderingContext2D,
  selection: SelectionState,
  dashOffset: number
): void {
  if (!selection.active) return;

  ctx.save();
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);

  if (selection.type === 'rect' && selection.rect) {
    const { x, y, width, height } = selection.rect;
    const rx = width < 0 ? x + width : x;
    const ry = height < 0 ? y + height : y;
    const rw = Math.abs(width);
    const rh = Math.abs(height);

    // Black stroke
    ctx.strokeStyle = '#000000';
    ctx.lineDashOffset = dashOffset;
    ctx.strokeRect(rx + 0.5, ry + 0.5, rw, rh);

    // White stroke offset
    ctx.strokeStyle = '#ffffff';
    ctx.lineDashOffset = dashOffset + 4;
    ctx.strokeRect(rx + 0.5, ry + 0.5, rw, rh);
  } else if (selection.type === 'lasso' && selection.polygon && selection.polygon.length > 1) {
    const poly = selection.polygon;

    const drawPath = () => {
      ctx.beginPath();
      ctx.moveTo(poly[0].x, poly[0].y);
      for (let i = 1; i < poly.length; i++) {
        ctx.lineTo(poly[i].x, poly[i].y);
      }
      ctx.closePath();
      ctx.stroke();
    };

    ctx.strokeStyle = '#000000';
    ctx.lineDashOffset = dashOffset;
    drawPath();

    ctx.strokeStyle = '#ffffff';
    ctx.lineDashOffset = dashOffset + 4;
    drawPath();
  } else if (selection.maskCanvas) {
    // Draw mask boundary outline
    ctx.strokeStyle = '#000000';
    ctx.lineDashOffset = dashOffset;
    ctx.drawImage(selection.maskCanvas, 0, 0);
  }

  ctx.restore();
}
