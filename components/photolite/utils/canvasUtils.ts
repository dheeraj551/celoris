import { BlendMode, Layer, SerializedLayer } from '../types';

export const BLEND_MODES: { value: BlendMode; label: string }[] = [
  { value: 'source-over', label: 'Normal' },
  { value: 'multiply', label: 'Multiply' },
  { value: 'screen', label: 'Screen' },
  { value: 'overlay', label: 'Overlay' },
  { value: 'darken', label: 'Darken' },
  { value: 'lighten', label: 'Lighten' },
  { value: 'color-dodge', label: 'Color Dodge' },
  { value: 'color-burn', label: 'Color Burn' },
  { value: 'hard-light', label: 'Hard Light' },
  { value: 'soft-light', label: 'Soft Light' },
  { value: 'difference', label: 'Difference' },
  { value: 'exclusion', label: 'Exclusion' },
];

export function createCanvas(width: number, height: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(width));
  canvas.height = Math.max(1, Math.round(height));
  return canvas;
}

export function cloneCanvas(src: HTMLCanvasElement): HTMLCanvasElement {
  const dst = createCanvas(src.width, src.height);
  const ctx = dst.getContext('2d');
  if (ctx) {
    ctx.drawImage(src, 0, 0);
  }
  return dst;
}

export function serializeLayer(layer: Layer): SerializedLayer {
  return {
    id: layer.id,
    name: layer.name,
    type: layer.type,
    visible: layer.visible,
    locked: layer.locked,
    opacity: layer.opacity,
    blendMode: layer.blendMode,
    x: layer.x,
    y: layer.y,
    width: layer.width,
    height: layer.height,
    dataUrl: layer.canvas.toDataURL('image/png'),
    angle: layer.angle || 0,
    textData: layer.textData ? { ...layer.textData } : undefined,
    shapeData: layer.shapeData ? { ...layer.shapeData } : undefined,
    filters: layer.filters ? { ...layer.filters } : undefined,
  };
}

export function deserializeLayer(sLayer: SerializedLayer): Promise<Layer> {
  return new Promise((resolve) => {
    const canvas = createCanvas(sLayer.width, sLayer.height);
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      if (ctx) {
        ctx.drawImage(img, 0, 0);
      }
      resolve({
        id: sLayer.id,
        name: sLayer.name,
        type: sLayer.type,
        visible: sLayer.visible,
        locked: sLayer.locked,
        opacity: sLayer.opacity,
        blendMode: sLayer.blendMode,
        x: sLayer.x,
        y: sLayer.y,
        width: sLayer.width,
        height: sLayer.height,
        canvas,
        angle: sLayer.angle || 0,
        textData: sLayer.textData,
        shapeData: sLayer.shapeData,
        filters: sLayer.filters,
      });
    };
    img.onerror = () => {
      resolve({
        id: sLayer.id,
        name: sLayer.name,
        type: sLayer.type,
        visible: sLayer.visible,
        locked: sLayer.locked,
        opacity: sLayer.opacity,
        blendMode: sLayer.blendMode,
        x: sLayer.x,
        y: sLayer.y,
        width: sLayer.width,
        height: sLayer.height,
        canvas,
        angle: sLayer.angle || 0,
        textData: sLayer.textData,
        shapeData: sLayer.shapeData,
        filters: sLayer.filters,
      });
    };
    img.src = sLayer.dataUrl;
  });
}

// Convert hex color to RGBA components
export function hexToRgba(hex: string): [number, number, number, number] {
  let c = hex.replace('#', '');
  if (c.length === 3) {
    c = c.split('').map((x) => x + x).join('');
  }
  const num = parseInt(c, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255, 255];
}

// Magic Wand selection algorithm (BFS flood matching)
export function magicWandSelection(
  compositeCanvas: HTMLCanvasElement,
  startX: number,
  startY: number,
  tolerance: number
): HTMLCanvasElement {
  const width = compositeCanvas.width;
  const height = compositeCanvas.height;
  const maskCanvas = createCanvas(width, height);
  const maskCtx = maskCanvas.getContext('2d');
  if (!maskCtx) return maskCanvas;

  const srcCtx = compositeCanvas.getContext('2d');
  if (!srcCtx) return maskCanvas;

  startX = Math.floor(startX);
  startY = Math.floor(startY);

  if (startX < 0 || startX >= width || startY < 0 || startY >= height) {
    return maskCanvas;
  }

  const srcImgData = srcCtx.getImageData(0, 0, width, height);
  const srcData = srcImgData.data;

  const maskImgData = maskCtx.createImageData(width, height);
  const maskData = maskImgData.data;

  const startIdx = (startY * width + startX) * 4;
  const targetR = srcData[startIdx];
  const targetG = srcData[startIdx + 1];
  const targetB = srcData[startIdx + 2];
  const targetA = srcData[startIdx + 3];

  // Tolerance scaled to RGB distance (max approx 441)
  const maxDiff = (tolerance / 100) * 255;

  const visited = new Uint8Array(width * height);
  const queue: number[] = [startX, startY];
  visited[startY * width + startX] = 1;

  let head = 0;
  while (head < queue.length) {
    const x = queue[head++];
    const y = queue[head++];

    const idx = (y * width + x) * 4;
    maskData[idx] = 255;
    maskData[idx + 1] = 255;
    maskData[idx + 2] = 255;
    maskData[idx + 3] = 255;

    // Check 4 neighbors
    const neighbors = [
      [x + 1, y],
      [x - 1, y],
      [x, y + 1],
      [x, y - 1],
    ];

    for (let i = 0; i < 4; i++) {
      const nx = neighbors[i][0];
      const ny = neighbors[i][1];

      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        const nPos = ny * width + nx;
        if (!visited[nPos]) {
          visited[nPos] = 1;
          const nIdx = nPos * 4;
          const r = srcData[nIdx];
          const g = srcData[nIdx + 1];
          const b = srcData[nIdx + 2];
          const a = srcData[nIdx + 3];

          const diff = Math.sqrt(
            Math.pow(r - targetR, 2) +
            Math.pow(g - targetG, 2) +
            Math.pow(b - targetB, 2) +
            Math.pow(a - targetA, 2)
          );

          if (diff <= maxDiff) {
            queue.push(nx, ny);
          }
        }
      }
    }
  }

  maskCtx.putImageData(maskImgData, 0, 0);
  return maskCanvas;
}

// Flood Fill (Paint Bucket tool)
export function floodFill(
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  fillColorHex: string,
  tolerance: number,
  width: number,
  height: number
): void {
  startX = Math.floor(startX);
  startY = Math.floor(startY);
  if (startX < 0 || startX >= width || startY < 0 || startY >= height) return;

  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  const startIdx = (startY * width + startX) * 4;
  const targetR = data[startIdx];
  const targetG = data[startIdx + 1];
  const targetB = data[startIdx + 2];
  const targetA = data[startIdx + 3];

  const [fillR, fillG, fillB, fillA] = hexToRgba(fillColorHex);

  // If already identical color, return
  if (
    Math.abs(targetR - fillR) < 2 &&
    Math.abs(targetG - fillG) < 2 &&
    Math.abs(targetB - fillB) < 2 &&
    Math.abs(targetA - fillA) < 2
  ) {
    return;
  }

  const maxDiff = (tolerance / 100) * 255;
  const visited = new Uint8Array(width * height);
  const queue: number[] = [startX, startY];
  visited[startY * width + startX] = 1;

  let head = 0;
  while (head < queue.length) {
    const x = queue[head++];
    const y = queue[head++];

    const idx = (y * width + x) * 4;
    data[idx] = fillR;
    data[idx + 1] = fillG;
    data[idx + 2] = fillB;
    data[idx + 3] = fillA;

    const neighbors = [
      [x + 1, y],
      [x - 1, y],
      [x, y + 1],
      [x, y - 1],
    ];

    for (let i = 0; i < 4; i++) {
      const nx = neighbors[i][0];
      const ny = neighbors[i][1];

      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        const nPos = ny * width + nx;
        if (!visited[nPos]) {
          visited[nPos] = 1;
          const nIdx = nPos * 4;
          const r = data[nIdx];
          const g = data[nIdx + 1];
          const b = data[nIdx + 2];
          const a = data[nIdx + 3];

          const diff = Math.sqrt(
            Math.pow(r - targetR, 2) +
            Math.pow(g - targetG, 2) +
            Math.pow(b - targetB, 2) +
            Math.pow(a - targetA, 2)
          );

          if (diff <= maxDiff) {
            queue.push(nx, ny);
          }
        }
      }
    }
  }

  ctx.putImageData(imgData, 0, 0);
}

// Composite all layers into a single canvas (with visibility, opacity, blend modes, filters)
export function renderCompositeCanvas(
  layers: Layer[],
  width: number,
  height: number,
  includeBackground = true
): HTMLCanvasElement {
  const comp = createCanvas(width, height);
  const ctx = comp.getContext('2d');
  if (!ctx) return comp;

  if (includeBackground) {
    // Transparent / checkered or clear
    ctx.clearRect(0, 0, width, height);
  }

  layers.forEach((layer) => {
    if (!layer.visible) return;

    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, layer.opacity));
    ctx.globalCompositeOperation = layer.blendMode;

    // Apply CSS filters if present
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
        // Fallback for environments lacking canvas filter support
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

  return comp;
}

// Canvas size adjustment with anchor positions
export type AnchorPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'center-left'
  | 'center'
  | 'center-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export function resizeCanvasWithAnchor(
  layers: Layer[],
  oldW: number,
  oldH: number,
  newW: number,
  newH: number,
  anchor: AnchorPosition
): Layer[] {
  let offsetX = 0;
  let offsetY = 0;

  // Horizontal offset
  if (anchor.includes('left')) {
    offsetX = 0;
  } else if (anchor.includes('right')) {
    offsetX = newW - oldW;
  } else {
    // center
    offsetX = Math.round((newW - oldW) / 2);
  }

  // Vertical offset
  if (anchor.startsWith('top')) {
    offsetY = 0;
  } else if (anchor.startsWith('bottom')) {
    offsetY = newH - oldH;
  } else {
    // center
    offsetY = Math.round((newH - oldH) / 2);
  }

  return layers.map((layer) => {
    const newCanvas = createCanvas(newW, newH);
    const ctx = newCanvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(layer.canvas, offsetX, offsetY);
    }
    return {
      ...layer,
      x: 0,
      y: 0,
      width: newW,
      height: newH,
      canvas: newCanvas,
    };
  });
}

// Scale / Resample entire image
export function resampleImage(
  layers: Layer[],
  oldW: number,
  oldH: number,
  newW: number,
  newH: number
): Layer[] {
  const scaleX = newW / oldW;
  const scaleY = newH / oldH;

  return layers.map((layer) => {
    const newCanvas = createCanvas(newW, newH);
    const ctx = newCanvas.getContext('2d');
    if (ctx) {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(layer.canvas, 0, 0, newW, newH);
    }
    return {
      ...layer,
      x: Math.round(layer.x * scaleX),
      y: Math.round(layer.y * scaleY),
      width: newW,
      height: newH,
      canvas: newCanvas,
    };
  });
}

// Crop entire canvas and all layers to bounding box
export function cropCanvas(
  layers: Layer[],
  crop: { x: number; y: number; width: number; height: number }
): Layer[] {
  const { x, y, width, height } = crop;
  const newW = Math.max(1, Math.round(width));
  const newH = Math.max(1, Math.round(height));

  return layers.map((layer) => {
    const newCanvas = createCanvas(newW, newH);
    const ctx = newCanvas.getContext('2d');
    if (ctx) {
      // Draw sub-rectangle from old canvas
      ctx.drawImage(
        layer.canvas,
        x,
        y,
        newW,
        newH,
        0,
        0,
        newW,
        newH
      );
    }
    return {
      ...layer,
      x: 0,
      y: 0,
      width: newW,
      height: newH,
      canvas: newCanvas,
    };
  });
}

// Export canvas as download
export function downloadCanvas(
  canvas: HTMLCanvasElement,
  format: 'png' | 'jpeg' | 'webp',
  quality: number,
  fileName: string
) {
  const mimeType = format === 'jpeg' ? 'image/jpeg' : format === 'webp' ? 'image/webp' : 'image/png';
  
  // If JPEG, draw on white background to avoid black transparency
  let exportCanvas = canvas;
  if (format === 'jpeg') {
    exportCanvas = createCanvas(canvas.width, canvas.height);
    const ctx = exportCanvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(canvas, 0, 0);
    }
  }

  const url = exportCanvas.toDataURL(mimeType, quality);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${fileName || 'untitled'}.${format === 'jpeg' ? 'jpg' : format}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/**
 * Computes a 1D normalized Gaussian convolution kernel (matrix weights).
 * @param radius Radius of the blur in pixels.
 * @param maxRadius Optional limit on kernel half-size to restrict iterations for performance.
 */
export function createGaussianKernel(
  radius: number,
  maxRadius: number = 25
): {
  kernel: Float32Array;
  radius: number;
  size: number;
  sigma: number;
} {
  const r = Math.max(1, Math.min(maxRadius, Math.round(radius)));
  const size = r * 2 + 1;
  const kernel = new Float32Array(size);
  // Standard Gaussian sigma: r / 2.5 produces natural smooth roll-off
  const sigma = Math.max(r / 2.5, 0.8);
  const twoSigmaSq = 2 * sigma * sigma;
  let sum = 0;

  for (let i = -r; i <= r; i++) {
    const val = Math.exp(-(i * i) / twoSigmaSq);
    kernel[i + r] = val;
    sum += val;
  }

  // Normalize so sum of convolution weights = 1.0 (conserves energy & brightness)
  for (let i = 0; i < size; i++) {
    kernel[i] /= sum;
  }

  return { kernel, radius: r, size, sigma };
}

/**
 * Calculates adaptive sampling and iteration limits to ensure performant
 * convolution on large images and large radii.
 */
export function getGaussianPerformanceStrategy(
  width: number,
  height: number,
  radius: number
): {
  samplingFactor: number;
  effectiveRadius: number;
  scaledWidth: number;
  scaledHeight: number;
  kernelSize: number;
  sigma: number;
} {
  const totalPixels = width * height;
  let samplingFactor = 1.0;

  // For large canvases or large radii, subsample to maintain 60fps interaction
  if (totalPixels > 800_000 || (totalPixels > 300_000 && radius > 8)) {
    samplingFactor = 0.25;
  } else if (totalPixels > 200_000 || (totalPixels > 60_000 && radius > 10)) {
    samplingFactor = 0.5;
  }

  // Scale down radius with sampling factor, cap kernel radius to 20 taps to prevent excessive iterations
  const scaledRadius = Math.max(1, Math.min(20, Math.round(radius * samplingFactor)));
  const scaledWidth = Math.max(1, Math.round(width * samplingFactor));
  const scaledHeight = Math.max(1, Math.round(height * samplingFactor));
  const kernelInfo = createGaussianKernel(scaledRadius);

  return {
    samplingFactor,
    effectiveRadius: scaledRadius,
    scaledWidth,
    scaledHeight,
    kernelSize: kernelInfo.size,
    sigma: kernelInfo.sigma,
  };
}

/**
 * Executes a separable 2-pass Gaussian convolution matrix (horizontal then vertical)
 * on pixel data with edge-clamping and alpha premultiplication.
 */
function convolveGaussianSeparable(
  srcData: Uint8ClampedArray,
  w: number,
  h: number,
  kernelInfo: { kernel: Float32Array; radius: number }
): Uint8ClampedArray {
  const { kernel, radius: r } = kernelInfo;
  const len = w * h * 4;
  const temp = new Float32Array(len);
  const output = new Uint8ClampedArray(len);

  // Pass 1: Horizontal 1D Convolution Matrix
  for (let y = 0; y < h; y++) {
    const rowOffset = y * w;
    for (let x = 0; x < w; x++) {
      let rSum = 0;
      let gSum = 0;
      let bSum = 0;
      let aSum = 0;

      for (let k = -r; k <= r; k++) {
        const weight = kernel[k + r];
        const srcX = Math.min(w - 1, Math.max(0, x + k));
        const idx = (rowOffset + srcX) * 4;

        const alpha = srcData[idx + 3] / 255;
        // Premultiply by alpha to avoid dark fringe artifacts at transparent borders
        rSum += srcData[idx] * alpha * weight;
        gSum += srcData[idx + 1] * alpha * weight;
        bSum += srcData[idx + 2] * alpha * weight;
        aSum += srcData[idx + 3] * weight;
      }

      const outIdx = (rowOffset + x) * 4;
      temp[outIdx] = rSum;
      temp[outIdx + 1] = gSum;
      temp[outIdx + 2] = bSum;
      temp[outIdx + 3] = aSum;
    }
  }

  // Pass 2: Vertical 1D Convolution Matrix
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) {
      let rSum = 0;
      let gSum = 0;
      let bSum = 0;
      let aSum = 0;

      for (let k = -r; k <= r; k++) {
        const weight = kernel[k + r];
        const srcY = Math.min(h - 1, Math.max(0, y + k));
        const idx = (srcY * w + x) * 4;

        rSum += temp[idx] * weight;
        gSum += temp[idx + 1] * weight;
        bSum += temp[idx + 2] * weight;
        aSum += temp[idx + 3] * weight;
      }

      const outIdx = (y * w + x) * 4;
      const alpha = aSum;
      if (alpha > 0.001) {
        // Un-premultiply alpha
        const invA = 255 / alpha;
        output[outIdx] = Math.min(255, Math.max(0, Math.round(rSum * invA)));
        output[outIdx + 1] = Math.min(255, Math.max(0, Math.round(gSum * invA)));
        output[outIdx + 2] = Math.min(255, Math.max(0, Math.round(bSum * invA)));
        output[outIdx + 3] = Math.min(255, Math.max(0, Math.round(alpha)));
      } else {
        output[outIdx] = 0;
        output[outIdx + 1] = 0;
        output[outIdx + 2] = 0;
        output[outIdx + 3] = 0;
      }
    }
  }

  return output;
}

/**
 * Applies a true Gaussian blur filter using a convolution matrix.
 * Optimizes performance by adaptively subsampling large images and limiting
 * kernel iteration steps, ensuring smooth real-time response.
 *
 * @param sourceCanvas Source HTMLCanvasElement to blur
 * @param radius Blur radius in pixels (0 - 50)
 * @returns A new HTMLCanvasElement with the convolved blur applied
 */
export function applyGaussianBlurToCanvas(
  sourceCanvas: HTMLCanvasElement,
  radius: number
): HTMLCanvasElement {
  const w = sourceCanvas.width;
  const h = sourceCanvas.height;
  const output = createCanvas(w, h);
  const outCtx = output.getContext('2d');
  const srcCtx = sourceCanvas.getContext('2d');
  if (!outCtx || !srcCtx || w === 0 || h === 0) return output;

  const clampedRadius = Math.max(0, Math.min(50, radius));
  if (clampedRadius === 0) {
    outCtx.drawImage(sourceCanvas, 0, 0);
    return output;
  }

  const strategy = getGaussianPerformanceStrategy(w, h, clampedRadius);
  const kernelInfo = createGaussianKernel(strategy.effectiveRadius);

  if (strategy.samplingFactor < 1.0) {
    // Subsampled execution: scale down to sample canvas with bilinear filtering
    const sw = strategy.scaledWidth;
    const sh = strategy.scaledHeight;
    const sampleCanvas = createCanvas(sw, sh);
    const sampleCtx = sampleCanvas.getContext('2d');
    if (!sampleCtx) {
      outCtx.drawImage(sourceCanvas, 0, 0);
      return output;
    }

    sampleCtx.imageSmoothingEnabled = true;
    sampleCtx.imageSmoothingQuality = 'high';
    sampleCtx.drawImage(sourceCanvas, 0, 0, sw, sh);

    const sampleImgData = sampleCtx.getImageData(0, 0, sw, sh);
    const blurredBuf = convolveGaussianSeparable(sampleImgData.data, sw, sh, kernelInfo);

    const blurredImgData = sampleCtx.createImageData(sw, sh);
    blurredImgData.data.set(blurredBuf);
    sampleCtx.putImageData(blurredImgData, 0, 0);

    // Upscale blurred sample back to original size with high quality bilinear smoothing
    outCtx.imageSmoothingEnabled = true;
    outCtx.imageSmoothingQuality = 'high';
    outCtx.drawImage(sampleCanvas, 0, 0, w, h);
  } else {
    // Direct 1:1 convolution matrix
    try {
      const srcImgData = srcCtx.getImageData(0, 0, w, h);
      const blurredBuf = convolveGaussianSeparable(srcImgData.data, w, h, kernelInfo);
      const outImgData = outCtx.createImageData(w, h);
      outImgData.data.set(blurredBuf);
      outCtx.putImageData(outImgData, 0, 0);
    } catch (err) {
      console.error('Failed direct Gaussian convolution, fallback:', err);
      outCtx.drawImage(sourceCanvas, 0, 0);
    }
  }

  return output;
}

/**
 * Converts a source canvas to grayscale / black and white by directly iterating through
 * the active layer's pixel data array and applying the standard perceptual luminance formula:
 * Y = 0.299 * R + 0.587 * G + 0.114 * B (ITU-R BT.601)
 *
 * @param sourceCanvas HTMLCanvasElement to process
 * @param amount 0 (original color) to 1 (full monochrome black and white)
 * @returns A new HTMLCanvasElement containing the converted pixel data
 */
export function applyGrayscaleToCanvas(
  sourceCanvas: HTMLCanvasElement,
  amount: number = 1
): HTMLCanvasElement {
  const w = sourceCanvas.width;
  const h = sourceCanvas.height;
  const output = createCanvas(w, h);
  const outCtx = output.getContext('2d');
  const srcCtx = sourceCanvas.getContext('2d');
  if (!outCtx || !srcCtx || w === 0 || h === 0) return output;

  const clampedAmount = Math.max(0, Math.min(1, amount));
  if (clampedAmount === 0) {
    outCtx.drawImage(sourceCanvas, 0, 0);
    return output;
  }

  try {
    const imgData = srcCtx.getImageData(0, 0, w, h);
    const data = imgData.data;
    const len = data.length;

    if (clampedAmount >= 0.999) {
      // 100% full Black and White using standard luminance formula
      for (let i = 0; i < len; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        // Luminance formula: Y = 0.299*R + 0.587*G + 0.114*B
        const lum = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
        data[i] = lum;
        data[i + 1] = lum;
        data[i + 2] = lum;
        // Alpha data[i + 3] is preserved
      }
    } else {
      // Smooth interpolation between original color and luminance
      const inv = 1 - clampedAmount;
      for (let i = 0; i < len; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const lum = 0.299 * r + 0.587 * g + 0.114 * b;
        data[i] = Math.round(r * inv + lum * clampedAmount);
        data[i + 1] = Math.round(g * inv + lum * clampedAmount);
        data[i + 2] = Math.round(b * inv + lum * clampedAmount);
      }
    }

    outCtx.putImageData(imgData, 0, 0);
  } catch (err) {
    console.error('Failed to apply grayscale pixel conversion:', err);
    outCtx.drawImage(sourceCanvas, 0, 0);
  }

  return output;
}

/**
 * Converts a source canvas to sepia tone by directly iterating through
 * the active layer's pixel data array and applying the standard sepia transformation formula:
 * r = min(255, 0.393*R + 0.769*G + 0.189*B)
 * g = min(255, 0.349*R + 0.686*G + 0.168*B)
 * b = min(255, 0.272*R + 0.534*G + 0.131*B)
 *
 * @param sourceCanvas HTMLCanvasElement to process
 * @param amount 0 (original color) to 1 (full sepia tone)
 * @returns A new HTMLCanvasElement containing the converted pixel data
 */
export function applySepiaToCanvas(
  sourceCanvas: HTMLCanvasElement,
  amount: number = 1
): HTMLCanvasElement {
  const w = sourceCanvas.width;
  const h = sourceCanvas.height;
  const output = createCanvas(w, h);
  const outCtx = output.getContext('2d');
  const srcCtx = sourceCanvas.getContext('2d');
  if (!outCtx || !srcCtx || w === 0 || h === 0) return output;

  const clampedAmount = Math.max(0, Math.min(1, amount));
  if (clampedAmount === 0) {
    outCtx.drawImage(sourceCanvas, 0, 0);
    return output;
  }

  try {
    const imgData = srcCtx.getImageData(0, 0, w, h);
    const data = imgData.data;
    const len = data.length;

    if (clampedAmount >= 0.999) {
      // 100% full Sepia transformation
      for (let i = 0; i < len; i += 4) {
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
        // Alpha data[i + 3] remains unchanged
      }
    } else {
      // Smooth interpolation between original color and sepia
      const inv = 1 - clampedAmount;
      for (let i = 0; i < len; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        const sr = 0.393 * r + 0.769 * g + 0.189 * b;
        const sg = 0.349 * r + 0.686 * g + 0.168 * b;
        const sb = 0.272 * r + 0.534 * g + 0.131 * b;

        const clampedSr = sr > 255 ? 255 : sr < 0 ? 0 : sr;
        const clampedSg = sg > 255 ? 255 : sg < 0 ? 0 : sg;
        const clampedSb = sb > 255 ? 255 : sb < 0 ? 0 : sb;

        data[i] = Math.round(r * inv + clampedSr * clampedAmount);
        data[i + 1] = Math.round(g * inv + clampedSg * clampedAmount);
        data[i + 2] = Math.round(b * inv + clampedSb * clampedAmount);
      }
    }

    outCtx.putImageData(imgData, 0, 0);
  } catch (err) {
    console.error('Failed to apply sepia pixel conversion:', err);
    outCtx.drawImage(sourceCanvas, 0, 0);
  }

  return output;
}

/**
 * Modifies HSL values of the source canvas pixels by applying hue rotation
 * and saturation scaling in the canvas pixel data.
 *
 * @param sourceCanvas HTMLCanvasElement to process
 * @param hueShift Hue rotation angle in degrees (-180 to +180)
 * @param satScale Saturation scaling percentage (-100 to +100, where -100 = grayscale, 0 = no change, +100 = 2x saturation)
 * @param lightnessShift Optional lightness shift percentage (-100 to +100, default 0)
 * @returns A new HTMLCanvasElement with modified pixel data
 */
export function applyHueSaturationToCanvas(
  sourceCanvas: HTMLCanvasElement,
  hueShift: number,
  satScale: number,
  lightnessShift: number = 0
): HTMLCanvasElement {
  const w = sourceCanvas.width;
  const h = sourceCanvas.height;
  const output = createCanvas(w, h);
  const outCtx = output.getContext('2d');
  const srcCtx = sourceCanvas.getContext('2d');
  if (!outCtx || !srcCtx || w === 0 || h === 0) return output;

  // Normalized bounds
  const clampedHue = Math.max(-180, Math.min(180, hueShift));
  const clampedSat = Math.max(-100, Math.min(100, satScale));
  const clampedLightness = Math.max(-100, Math.min(100, lightnessShift));

  if (clampedHue === 0 && clampedSat === 0 && clampedLightness === 0) {
    outCtx.drawImage(sourceCanvas, 0, 0);
    return output;
  }

  try {
    const imgData = srcCtx.getImageData(0, 0, w, h);
    const data = imgData.data;
    const len = data.length;

    const satFactor = 1 + clampedSat / 100;
    const hasLightnessShift = Math.abs(clampedLightness) > 0.01;
    const lightFactor = clampedLightness / 100;

    for (let i = 0; i < len; i += 4) {
      // Skip transparent pixels
      if (data[i + 3] === 0) continue;

      const r = data[i] / 255;
      const g = data[i + 1] / 255;
      const b = data[i + 2] / 255;

      const max = r > g ? (r > b ? r : b) : g > b ? g : b;
      const min = r < g ? (r < b ? r : b) : g < b ? g : b;
      const d = max - min;
      let l = (max + min) * 0.5;

      // Handle pure grays (d === 0)
      if (d < 0.00001) {
        if (hasLightnessShift) {
          if (clampedLightness > 0) {
            l = l + (1 - l) * lightFactor;
          } else {
            l = l * (1 + lightFactor);
          }
          const val = Math.round(Math.max(0, Math.min(1, l)) * 255);
          data[i] = val;
          data[i + 1] = val;
          data[i + 2] = val;
        }
        continue;
      }

      // Compute Saturation and Hue
      const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      let h = 0;
      if (max === r) {
        h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
      } else if (max === g) {
        h = ((b - r) / d + 2) * 60;
      } else {
        h = ((r - g) / d + 4) * 60;
      }

      // 1. Rotate Hue
      let nh = (h + clampedHue) % 360;
      if (nh < 0) nh += 360;

      // 2. Scale Saturation
      let ns = s * satFactor;
      if (ns > 1) ns = 1;
      else if (ns < 0) ns = 0;

      // 3. Optional Lightness adjustment
      let nl = l;
      if (hasLightnessShift) {
        if (clampedLightness > 0) {
          nl = nl + (1 - nl) * lightFactor;
        } else {
          nl = nl * (1 + lightFactor);
        }
        if (nl > 1) nl = 1;
        else if (nl < 0) nl = 0;
      }

      // Convert back to RGB
      if (ns <= 0.00001) {
        const val = Math.round(nl * 255);
        data[i] = val;
        data[i + 1] = val;
        data[i + 2] = val;
        continue;
      }

      const q = nl < 0.5 ? nl * (1 + ns) : nl + ns - nl * ns;
      const p = 2 * nl - q;
      const hk = nh / 360;

      // Inlined hue2rgb for maximum rendering performance
      let tR = hk + 0.3333333333333333;
      if (tR < 0) tR += 1;
      else if (tR > 1) tR -= 1;
      const rVal =
        tR < 0.16666666666666666
          ? p + (q - p) * 6 * tR
          : tR < 0.5
          ? q
          : tR < 0.6666666666666666
          ? p + (q - p) * (0.6666666666666666 - tR) * 6
          : p;

      let tG = hk;
      if (tG < 0) tG += 1;
      else if (tG > 1) tG -= 1;
      const gVal =
        tG < 0.16666666666666666
          ? p + (q - p) * 6 * tG
          : tG < 0.5
          ? q
          : tG < 0.6666666666666666
          ? p + (q - p) * (0.6666666666666666 - tG) * 6
          : p;

      let tB = hk - 0.3333333333333333;
      if (tB < 0) tB += 1;
      else if (tB > 1) tB -= 1;
      const bVal =
        tB < 0.16666666666666666
          ? p + (q - p) * 6 * tB
          : tB < 0.5
          ? q
          : tB < 0.6666666666666666
          ? p + (q - p) * (0.6666666666666666 - tB) * 6
          : p;

      data[i] = Math.round(Math.max(0, Math.min(1, rVal)) * 255);
      data[i + 1] = Math.round(Math.max(0, Math.min(1, gVal)) * 255);
      data[i + 2] = Math.round(Math.max(0, Math.min(1, bVal)) * 255);
    }

    outCtx.putImageData(imgData, 0, 0);
  } catch (err) {
    console.error('Failed to apply Hue/Saturation pixel conversion:', err);
    outCtx.drawImage(sourceCanvas, 0, 0);
  }

  return output;
}

/**
 * Modifies the hue channel in the HSL conversion of every pixel on the canvas
 * to perform a color-shifting operation.
 *
 * @param sourceCanvas HTMLCanvasElement to process
 * @param hueShift Hue rotation angle in degrees (-180 to +180)
 * @returns A new HTMLCanvasElement with color-shifted pixels
 */
export function applyHueToCanvas(
  sourceCanvas: HTMLCanvasElement,
  hueShift: number
): HTMLCanvasElement {
  return applyHueSaturationToCanvas(sourceCanvas, hueShift, 0, 0);
}

/**
 * Calculates new HSL values for each pixel on the canvas to adjust saturation.
 *
 * Converts each pixel's RGB coordinates into the HSL (Hue, Saturation, Lightness)
 * color space, recalculates the saturation component according to the slider percentage:
 * S' = clamp(S * (1 + satScale / 100), 0, 1),
 * then translates the resulting (H, S', L) vector back into standard RGB values,
 * preserving transparent pixels.
 *
 * @param sourceCanvas HTMLCanvasElement to adjust
 * @param satScale Saturation adjustment percentage (-100 to +100, where -100 = full desaturation/grayscale, 0 = unchanged, +100 = 2x saturation)
 * @returns A new HTMLCanvasElement containing the modified pixel data
 */
export function applySaturationToCanvas(
  sourceCanvas: HTMLCanvasElement,
  satScale: number
): HTMLCanvasElement {
  return applyHueSaturationToCanvas(sourceCanvas, 0, satScale, 0);
}

/**
 * Samples the source canvas to calculate the average saturation level (0 - 100%)
 * across non-transparent pixels.
 *
 * @param canvas Source HTMLCanvasElement
 * @returns Average saturation percentage from 0 to 100
 */
export function getAverageSaturation(canvas: HTMLCanvasElement): number {
  const ctx = canvas.getContext('2d');
  if (!ctx || canvas.width === 0 || canvas.height === 0) return 0;
  try {
    const w = canvas.width;
    const h = canvas.height;
    const totalPixels = w * h;
    // Step size samples up to ~2000 pixels for fast execution
    const step = Math.max(1, Math.floor(totalPixels / 2000)) * 4;
    const imgData = ctx.getImageData(0, 0, w, h);
    const data = imgData.data;
    let satSum = 0;
    let count = 0;

    for (let i = 0; i < data.length; i += step) {
      if (data[i + 3] < 10) continue; // Skip transparent
      const r = data[i] / 255;
      const g = data[i + 1] / 255;
      const b = data[i + 2] / 255;
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const d = max - min;
      if (d > 0.00001) {
        const l = (max + min) * 0.5;
        const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        satSum += s;
      }
      count++;
    }

    return count > 0 ? Math.round((satSum / count) * 100) : 0;
  } catch {
    return 0;
  }
}

/**
 * Applies an 'Add Noise' filter to the canvas pixel data,
 * randomly adjusting pixel RGB values based on a user-defined intensity (0 - 100).
 *
 * @param sourceCanvas Source HTMLCanvasElement.
 * @param intensity Intensity percentage from 0 to 100.
 * @param monochromatic If true, applies identical random delta across R, G, B for film grain.
 *                      If false, independently randomizes R, G, and B for full RGB chromatic noise.
 * @returns A new HTMLCanvasElement with noise applied.
 */
export function applyNoiseToCanvas(
  sourceCanvas: HTMLCanvasElement,
  intensity: number,
  monochromatic: boolean = false
): HTMLCanvasElement {
  const output = createCanvas(sourceCanvas.width, sourceCanvas.height);
  const outCtx = output.getContext('2d');
  if (!outCtx) return output;

  outCtx.drawImage(sourceCanvas, 0, 0);
  const clampedIntensity = Math.max(0, Math.min(100, intensity));
  if (clampedIntensity <= 0) return output;

  try {
    const imgData = outCtx.getImageData(0, 0, output.width, output.height);
    const data = imgData.data;
    // maxDelta: at 100% intensity, delta can vary by up to ±255
    const maxDelta = (clampedIntensity / 100) * 255;

    for (let i = 0; i < data.length; i += 4) {
      // Skip transparent pixels
      if (data[i + 3] === 0) continue;

      if (monochromatic) {
        // Uniform random perturbation applied equally to R, G, and B
        const noise = (Math.random() * 2 - 1) * maxDelta;
        data[i] = Math.min(255, Math.max(0, Math.round(data[i] + noise)));
        data[i + 1] = Math.min(255, Math.max(0, Math.round(data[i + 1] + noise)));
        data[i + 2] = Math.min(255, Math.max(0, Math.round(data[i + 2] + noise)));
      } else {
        // Independent random perturbations for each RGB channel
        const noiseR = (Math.random() * 2 - 1) * maxDelta;
        const noiseG = (Math.random() * 2 - 1) * maxDelta;
        const noiseB = (Math.random() * 2 - 1) * maxDelta;
        data[i] = Math.min(255, Math.max(0, Math.round(data[i] + noiseR)));
        data[i + 1] = Math.min(255, Math.max(0, Math.round(data[i + 1] + noiseG)));
        data[i + 2] = Math.min(255, Math.max(0, Math.round(data[i + 2] + noiseB)));
      }
    }

    outCtx.putImageData(imgData, 0, 0);
  } catch (err) {
    console.error('Failed to apply Add Noise filter:', err);
    outCtx.drawImage(sourceCanvas, 0, 0);
  }

  return output;
}

