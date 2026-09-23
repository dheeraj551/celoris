import { getStroke } from "perfect-freehand";
import { Stroke, StrokePoint, ToolType } from "../types";

export interface ToolConfig {
  size: number;
  thinning: number;
  smoothing: number;
  streamline: number;
  easing: (t: number) => number;
  start: {
    taper: number | boolean;
    easing: (t: number) => number;
    cap: boolean;
  };
  end: {
    taper: number | boolean;
    easing: (t: number) => number;
    cap: boolean;
  };
  simulatePressure: boolean;
  opacity: number;
  blendMode: GlobalCompositeOperation;
  bleed: boolean;
  bleedSpread: number; // in pixels
  textureType?: "solid" | "graphite" | "ink-bleed" | "highlighter";
}

export function getToolConfig(tool: ToolType, baseSize: number): ToolConfig {
  switch (tool) {
    case "fountain-pen":
      return {
        size: baseSize * 1.2,
        thinning: 0.65,
        smoothing: 0.75,
        streamline: 0.6,
        easing: (t) => Math.sin((t * Math.PI) / 2),
        start: {
          taper: baseSize * 1.5,
          easing: (t) => t * t,
          cap: true,
        },
        end: {
          taper: baseSize * 2.2,
          easing: (t) => t * (2 - t),
          cap: true,
        },
        simulatePressure: true,
        opacity: 0.95,
        blendMode: "source-over",
        bleed: true,
        bleedSpread: 1.8,
        textureType: "ink-bleed",
      };

    case "sketch-pencil":
      return {
        size: baseSize * 0.9,
        thinning: 0.35,
        smoothing: 0.5,
        streamline: 0.45,
        easing: (t) => t,
        start: {
          taper: 0,
          easing: (t) => t,
          cap: false,
        },
        end: {
          taper: 0,
          easing: (t) => t,
          cap: false,
        },
        simulatePressure: true,
        opacity: 0.78,
        blendMode: "multiply",
        bleed: false,
        bleedSpread: 0,
        textureType: "graphite",
      };

    case "ballpoint":
      return {
        size: baseSize * 0.75,
        thinning: 0.25,
        smoothing: 0.65,
        streamline: 0.5,
        easing: (t) => t,
        start: {
          taper: baseSize * 0.5,
          easing: (t) => t,
          cap: true,
        },
        end: {
          taper: baseSize * 0.8,
          easing: (t) => t,
          cap: true,
        },
        simulatePressure: true,
        opacity: 0.92,
        blendMode: "source-over",
        bleed: false,
        bleedSpread: 0.5,
        textureType: "solid",
      };

    case "marker-highlighter":
      return {
        size: baseSize * 3.8,
        thinning: -0.15, // chisel effect
        smoothing: 0.85,
        streamline: 0.75,
        easing: (t) => t,
        start: {
          taper: 0,
          easing: (t) => t,
          cap: false,
        },
        end: {
          taper: 0,
          easing: (t) => t,
          cap: false,
        },
        simulatePressure: false,
        opacity: 0.42,
        blendMode: "multiply",
        bleed: true,
        bleedSpread: 3.0,
        textureType: "highlighter",
      };

    case "eraser":
    default:
      return {
        size: baseSize * 2.5,
        thinning: 0,
        smoothing: 0.5,
        streamline: 0.5,
        easing: (t) => t,
        start: { taper: 0, easing: (t) => t, cap: true },
        end: { taper: 0, easing: (t) => t, cap: true },
        simulatePressure: false,
        opacity: 1,
        blendMode: "destination-out",
        bleed: false,
        bleedSpread: 0,
        textureType: "solid",
      };
  }
}

/**
 * Converts stroke points to outline polygon coordinates using perfect-freehand
 */
export function getStrokeOutlinePoints(
  points: StrokePoint[],
  tool: ToolType,
  baseSize: number
): number[][] {
  if (points.length === 0) return [];
  const config = getToolConfig(tool, baseSize);

  const formattedPoints = points.map((p) => [
    p.x,
    p.y,
    Math.max(0.08, Math.min(1.0, p.pressure || 0.5)),
  ]);

  return getStroke(formattedPoints, {
    size: config.size,
    thinning: config.thinning,
    smoothing: config.smoothing,
    streamline: config.streamline,
    easing: config.easing,
    start: config.start,
    end: config.end,
    simulatePressure: config.simulatePressure,
  });
}

/**
 * Creates smooth SVG path d attribute from outline polygon points
 */
export function getSvgPathFromStroke(strokePoints: number[][], closed = true): string {
  const len = strokePoints.length;
  if (len < 3) return "";
  let a = strokePoints[0];
  let b = strokePoints[1];
  const c = strokePoints[2];

  let result = `M ${a[0].toFixed(2)} ${a[1].toFixed(2)} Q ${b[0].toFixed(2)} ${b[1].toFixed(2)} ${(
    (b[0] + c[0]) / 2
  ).toFixed(2)} ${(((b[1] + c[1]) / 2)).toFixed(2)}`;

  for (let i = 2; i < len - 1; i++) {
    a = strokePoints[i];
    b = strokePoints[i + 1];
    result += ` Q ${a[0].toFixed(2)} ${a[1].toFixed(2)} ${(
      (a[0] + b[0]) / 2
    ).toFixed(2)} ${(((a[1] + b[1]) / 2)).toFixed(2)}`;
  }

  if (closed) {
    result += " Z";
  }
  return result;
}

/**
 * Renders a realistic stroke with paper ink bleed onto HTML5 Canvas 2D
 */
export function renderStrokeOnCanvas(
  ctx: CanvasRenderingContext2D,
  stroke: Stroke,
  bleedFibersTexture?: HTMLCanvasElement | null
) {
  if (!stroke.points || stroke.points.length < 2) return;

  const config = getToolConfig(stroke.tool, stroke.size);
  const outlinePoints = getStrokeOutlinePoints(stroke.points, stroke.tool, stroke.size);
  if (outlinePoints.length < 3) return;

  ctx.save();
  ctx.globalCompositeOperation = stroke.blendMode || config.blendMode;

  // 1. Realistic Ink Bleed Layer (capillary diffusion into paper fibers)
  if (config.bleed && stroke.bleedIntensity !== 0 && stroke.tool !== "eraser") {
    ctx.save();
    // Subtle feathered bleed rim
    ctx.filter = `blur(${config.bleedSpread}px)`;
    ctx.globalAlpha = (stroke.opacity ?? config.opacity) * 0.28;
    ctx.fillStyle = stroke.color;

    ctx.beginPath();
    ctx.moveTo(outlinePoints[0][0], outlinePoints[0][1]);
    for (let i = 1; i < outlinePoints.length; i++) {
      ctx.lineTo(outlinePoints[i][0], outlinePoints[i][1]);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // 2. Graphite Pencil Tooth Texture
  if (config.textureType === "graphite" && bleedFibersTexture) {
    ctx.save();
    ctx.globalAlpha = stroke.opacity ?? config.opacity;
    ctx.fillStyle = stroke.color;

    ctx.beginPath();
    ctx.moveTo(outlinePoints[0][0], outlinePoints[0][1]);
    for (let i = 1; i < outlinePoints.length; i++) {
      ctx.lineTo(outlinePoints[i][0], outlinePoints[i][1]);
    }
    ctx.closePath();
    ctx.fill();

    // Stipple paper tooth skip
    ctx.globalCompositeOperation = "destination-out";
    ctx.globalAlpha = 0.16;
    const pattern = ctx.createPattern(bleedFibersTexture, "repeat");
    if (pattern) {
      ctx.fillStyle = pattern;
      ctx.fill();
    }
    ctx.restore();
    ctx.restore();
    return;
  }

  // 3. Primary Core Stroke
  ctx.globalAlpha = stroke.opacity ?? config.opacity;
  ctx.fillStyle = stroke.color;

  ctx.beginPath();
  ctx.moveTo(outlinePoints[0][0], outlinePoints[0][1]);
  for (let i = 1; i < outlinePoints.length; i++) {
    ctx.lineTo(outlinePoints[i][0], outlinePoints[i][1]);
  }
  ctx.closePath();
  ctx.fill();

  // 4. Ink Core Pooling for Fountain Pen (slightly darker in high-pressure slow areas)
  if (config.textureType === "ink-bleed") {
    ctx.save();
    ctx.globalAlpha = 0.22;
    ctx.fillStyle = "#000000";
    ctx.globalCompositeOperation = "multiply";
    // Slightly inset path for ink meniscus
    ctx.beginPath();
    const step = 2;
    for (let i = 0; i < outlinePoints.length; i += step) {
      const pt = outlinePoints[i];
      if (i === 0) ctx.moveTo(pt[0], pt[1]);
      else ctx.lineTo(pt[0], pt[1]);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  ctx.restore();
}

/**
 * Creates an in-memory procedural paper grain texture
 */
export function createProceduralGrainTexture(size = 128): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  const imgData = ctx.createImageData(size, size);
  const data = imgData.data;

  for (let i = 0; i < data.length; i += 4) {
    // Subtle organic perlin/noise fiber grain
    const noise = (Math.random() - 0.5) * 45;
    const val = Math.max(0, Math.min(255, 128 + noise));
    data[i] = val;
    data[i + 1] = val;
    data[i + 2] = val;
    data[i + 3] = Math.random() > 0.4 ? 40 : 10;
  }

  ctx.putImageData(imgData, 0, 0);
  return canvas;
}

/**
 * Export strokes as high-resolution vector SVG
 */
export function exportStrokesToSvg(
  strokes: Stroke[],
  options: {
    width?: number;
    height?: number;
    backgroundColor?: string;
    padding?: number;
  } = {}
): string {
  if (strokes.length === 0) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><rect width="800" height="600" fill="#fdfbf7"/></svg>`;
  }

  // Calculate bounding box
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  strokes.forEach((stroke) => {
    stroke.points.forEach((pt) => {
      minX = Math.min(minX, pt.x);
      minY = Math.min(minY, pt.y);
      maxX = Math.max(maxX, pt.x);
      maxY = Math.max(maxY, pt.y);
    });
  });

  const pad = options.padding ?? 60;
  const x = Math.floor(minX - pad);
  const y = Math.floor(minY - pad);
  const w = Math.ceil(maxX - minX + pad * 2);
  const h = Math.ceil(maxY - minY + pad * 2);

  const bg = options.backgroundColor || "#fcfbfa";

  let svgContent = `<?xml version="1.0" standalone="no"?>\n`;
  svgContent += `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x} ${y} ${w} ${h}" width="${w}" height="${h}" style="background-color: ${bg};">\n`;
  svgContent += `  <defs>\n`;
  svgContent += `    <filter id="ink-bleed-filter" x="-10%" y="-10%" width="120%" height="120%">\n`;
  svgContent += `      <feGaussianBlur stdDeviation="0.8" result="blur" />\n`;
  svgContent += `      <feMerge>\n`;
  svgContent += `        <feMergeNode in="blur" />\n`;
  svgContent += `        <feMergeNode in="SourceGraphic" />\n`;
  svgContent += `      </feMerge>\n`;
  svgContent += `    </filter>\n`;
  svgContent += `  </defs>\n`;
  svgContent += `  <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${bg}" />\n`;
  svgContent += `  <g id="whiteboard-handwritten-strokes">\n`;

  strokes.forEach((stroke) => {
    if (stroke.tool === "eraser") return;
    const outlinePoints = getStrokeOutlinePoints(stroke.points, stroke.tool, stroke.size);
    if (outlinePoints.length < 3) return;

    const pathData = getSvgPathFromStroke(outlinePoints, true);
    const filterAttr = stroke.tool === "fountain-pen" ? ` filter="url(#ink-bleed-filter)"` : "";
    const opacityAttr = stroke.opacity ? ` opacity="${stroke.opacity}"` : "";

    svgContent += `    <path d="${pathData}" fill="${stroke.color}"${opacityAttr}${filterAttr} />\n`;
  });

  svgContent += `  </g>\n`;
  svgContent += `</svg>`;

  return svgContent;
}

/**
 * Exports strokes & canvas view to High-Res PNG (e.g. 2x or 4x Retina / Print)
 */
export function exportToHighResPng(
  strokes: Stroke[],
  scale = 2,
  backgroundColor = "#fcfbfa"
): Promise<string> {
  return new Promise((resolve) => {
    if (strokes.length === 0) {
      resolve("");
      return;
    }

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    strokes.forEach((stroke) => {
      stroke.points.forEach((pt) => {
        minX = Math.min(minX, pt.x);
        minY = Math.min(minY, pt.y);
        maxX = Math.max(maxX, pt.x);
        maxY = Math.max(maxY, pt.y);
      });
    });

    const pad = 60;
    const x = Math.floor(minX - pad);
    const y = Math.floor(minY - pad);
    const w = Math.ceil(maxX - minX + pad * 2);
    const h = Math.ceil(maxY - minY + pad * 2);

    const canvas = document.createElement("canvas");
    canvas.width = w * scale;
    canvas.height = h * scale;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      resolve("");
      return;
    }

    ctx.scale(scale, scale);
    ctx.translate(-x, -y);

    // Background
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(x, y, w, h);

    const grain = createProceduralGrainTexture(64);
    strokes.forEach((stroke) => {
      renderStrokeOnCanvas(ctx, stroke, grain);
    });

    resolve(canvas.toDataURL("image/png"));
  });
}

/**
 * Calculates perpendicular distance from a point to a 2D line segment.
 */
export function pointToSegmentDistance(
  px: number,
  py: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const l2 = dx * dx + dy * dy;
  if (l2 === 0) return Math.hypot(px - x1, py - y1);
  let t = ((px - x1) * dx + (py - y1) * dy) / l2;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
}

/**
 * Checks whether two 2D line segments (p1-p2 and p3-p4) intersect.
 */
export function doSegmentsIntersect(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x3: number,
  y3: number,
  x4: number,
  y4: number
): boolean {
  const ccw = (ax: number, ay: number, bx: number, by: number, cx: number, cy: number) => {
    return (cy - ay) * (bx - ax) - (by - ay) * (cx - ax);
  };

  const cp1 = ccw(x1, y1, x2, y2, x3, y3);
  const cp2 = ccw(x1, y1, x2, y2, x4, y4);
  const cp3 = ccw(x3, y3, x4, y4, x1, y1);
  const cp4 = ccw(x3, y3, x4, y4, x2, y2);

  if (
    ((cp1 > 0 && cp2 < 0) || (cp1 < 0 && cp2 > 0)) &&
    ((cp3 > 0 && cp4 < 0) || (cp3 < 0 && cp4 > 0))
  ) {
    return true;
  }

  const onSegment = (px: number, py: number, ax: number, ay: number, bx: number, by: number) => {
    return (
      px >= Math.min(ax, bx) - 0.5 &&
      px <= Math.max(ax, bx) + 0.5 &&
      py >= Math.min(ay, by) - 0.5 &&
      py <= Math.max(ay, by) + 0.5
    );
  };

  if (Math.abs(cp1) < 1e-4 && onSegment(x3, y3, x1, y1, x2, y2)) return true;
  if (Math.abs(cp2) < 1e-4 && onSegment(x4, y4, x1, y1, x2, y2)) return true;
  if (Math.abs(cp3) < 1e-4 && onSegment(x1, y1, x3, y3, x4, y4)) return true;
  if (Math.abs(cp4) < 1e-4 && onSegment(x2, y2, x3, y3, x4, y4)) return true;

  return false;
}

/**
 * Calculates minimum distance between two 2D line segments.
 */
export function segmentToSegmentDistance(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x3: number,
  y3: number,
  x4: number,
  y4: number
): number {
  if (doSegmentsIntersect(x1, y1, x2, y2, x3, y3, x4, y4)) {
    return 0;
  }

  return Math.min(
    pointToSegmentDistance(x1, y1, x3, y3, x4, y4),
    pointToSegmentDistance(x2, y2, x3, y3, x4, y4),
    pointToSegmentDistance(x3, y3, x1, y1, x2, y2),
    pointToSegmentDistance(x4, y4, x1, y1, x2, y2)
  );
}

/**
 * Determines whether an eraser sweeping motion from p1 to p2 hits a stroke.
 */
export function isStrokeIntersectingSegment(
  stroke: Stroke,
  p1: { x: number; y: number },
  p2: { x: number; y: number },
  eraserRadius: number
): boolean {
  if (!stroke.points || stroke.points.length === 0) return false;

  const strokeHalfWidth = stroke.size ? stroke.size * 0.9 : 4;
  const threshold = eraserRadius + strokeHalfWidth;

  // 1. Single dot stroke
  if (stroke.points.length === 1) {
    const pt = stroke.points[0];
    return pointToSegmentDistance(pt.x, pt.y, p1.x, p1.y, p2.x, p2.y) <= threshold;
  }

  // 2. Fast Bounding Box Pre-Check
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (let i = 0; i < stroke.points.length; i++) {
    const pt = stroke.points[i];
    if (pt.x < minX) minX = pt.x;
    if (pt.x > maxX) maxX = pt.x;
    if (pt.y < minY) minY = pt.y;
    if (pt.y > maxY) maxY = pt.y;
  }

  const sweepMinX = Math.min(p1.x, p2.x) - threshold;
  const sweepMaxX = Math.max(p1.x, p2.x) + threshold;
  const sweepMinY = Math.min(p1.y, p2.y) - threshold;
  const sweepMaxY = Math.max(p1.y, p2.y) + threshold;

  if (
    maxX < sweepMinX ||
    minX > sweepMaxX ||
    maxY < sweepMinY ||
    minY > sweepMaxY
  ) {
    return false;
  }

  // 3. Fast vertex distance check
  for (let i = 0; i < stroke.points.length; i++) {
    const pt = stroke.points[i];
    if (pointToSegmentDistance(pt.x, pt.y, p1.x, p1.y, p2.x, p2.y) <= threshold) {
      return true;
    }
  }

  // 4. Segment-to-segment distance check
  const isPointSweep = Math.hypot(p2.x - p1.x, p2.y - p1.y) < 1;

  for (let i = 0; i < stroke.points.length - 1; i++) {
    const s1 = stroke.points[i];
    const s2 = stroke.points[i + 1];

    if (isPointSweep) {
      if (pointToSegmentDistance(p1.x, p1.y, s1.x, s1.y, s2.x, s2.y) <= threshold) {
        return true;
      }
    } else {
      if (
        segmentToSegmentDistance(
          p1.x,
          p1.y,
          p2.x,
          p2.y,
          s1.x,
          s1.y,
          s2.x,
          s2.y
        ) <= threshold
      ) {
        return true;
      }
    }
  }

  return false;
}
