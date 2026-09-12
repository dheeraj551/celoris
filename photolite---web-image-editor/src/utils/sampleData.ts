import { Layer } from '../types';
import { createCanvas } from './canvasUtils';

export function createInitialProject(width = 960, height = 600): { layers: Layer[]; activeLayerId: string } {
  // 1. Background Gradient Layer
  const bgCanvas = createCanvas(width, height);
  const bgCtx = bgCanvas.getContext('2d')!;
  
  // Sunset twilight sky gradient
  const skyGrad = bgCtx.createLinearGradient(0, 0, 0, height);
  skyGrad.addColorStop(0, '#1a1c2e');
  skyGrad.addColorStop(0.4, '#3b2d54');
  skyGrad.addColorStop(0.7, '#893b59');
  skyGrad.addColorStop(1, '#d36c53');
  bgCtx.fillStyle = skyGrad;
  bgCtx.fillRect(0, 0, width, height);

  // Distant glowing sun
  const sunGrad = bgCtx.createRadialGradient(width * 0.5, height * 0.55, 10, width * 0.5, height * 0.55, 160);
  sunGrad.addColorStop(0, '#ffe596');
  sunGrad.addColorStop(0.3, '#ff9642');
  sunGrad.addColorStop(0.8, 'rgba(235, 87, 87, 0.4)');
  sunGrad.addColorStop(1, 'rgba(235, 87, 87, 0)');
  bgCtx.fillStyle = sunGrad;
  bgCtx.beginPath();
  bgCtx.arc(width * 0.5, height * 0.55, 160, 0, Math.PI * 2);
  bgCtx.fill();

  // Distant mountain silhouettes
  bgCtx.fillStyle = '#1e1b30';
  bgCtx.beginPath();
  bgCtx.moveTo(0, height);
  bgCtx.lineTo(0, height * 0.65);
  bgCtx.lineTo(width * 0.22, height * 0.50);
  bgCtx.lineTo(width * 0.45, height * 0.68);
  bgCtx.lineTo(width * 0.70, height * 0.46);
  bgCtx.lineTo(width * 0.88, height * 0.60);
  bgCtx.lineTo(width, height * 0.52);
  bgCtx.lineTo(width, height);
  bgCtx.closePath();
  bgCtx.fill();

  // Foreground mountain silhouette
  bgCtx.fillStyle = '#0e0c18';
  bgCtx.beginPath();
  bgCtx.moveTo(0, height);
  bgCtx.lineTo(0, height * 0.75);
  bgCtx.lineTo(width * 0.35, height * 0.62);
  bgCtx.lineTo(width * 0.65, height * 0.80);
  bgCtx.lineTo(width * 0.82, height * 0.66);
  bgCtx.lineTo(width, height * 0.72);
  bgCtx.lineTo(width, height);
  bgCtx.closePath();
  bgCtx.fill();

  const bgLayer: Layer = {
    id: 'layer-bg',
    name: 'Background Landscape',
    type: 'raster',
    visible: true,
    locked: false,
    opacity: 1,
    blendMode: 'source-over',
    x: 0,
    y: 0,
    width,
    height,
    canvas: bgCanvas,
  };

  // 2. Glowing Orb / Lens Flare Layer (Blend Mode: Screen)
  const orbCanvas = createCanvas(width, height);
  const orbCtx = orbCanvas.getContext('2d')!;
  const orbGrad = orbCtx.createRadialGradient(width * 0.25, height * 0.32, 5, width * 0.25, height * 0.32, 120);
  orbGrad.addColorStop(0, '#ffffff');
  orbGrad.addColorStop(0.2, '#70d6ff');
  orbGrad.addColorStop(0.6, 'rgba(0, 180, 216, 0.4)');
  orbGrad.addColorStop(1, 'rgba(0, 180, 216, 0)');
  orbCtx.fillStyle = orbGrad;
  orbCtx.beginPath();
  orbCtx.arc(width * 0.25, height * 0.32, 120, 0, Math.PI * 2);
  orbCtx.fill();

  // Draw some sparkles
  orbCtx.fillStyle = '#ffffff';
  for (let i = 0; i < 20; i++) {
    const sx = (Math.sin(i * 99) * 0.5 + 0.5) * width;
    const sy = (Math.cos(i * 33) * 0.5 + 0.5) * (height * 0.5);
    const rad = (i % 3) + 1;
    orbCtx.beginPath();
    orbCtx.arc(sx, sy, rad, 0, Math.PI * 2);
    orbCtx.fill();
  }

  const orbLayer: Layer = {
    id: 'layer-glow',
    name: 'Atmosphere & Stars',
    type: 'raster',
    visible: true,
    locked: false,
    opacity: 0.85,
    blendMode: 'screen',
    x: 0,
    y: 0,
    width,
    height,
    canvas: orbCanvas,
  };

  // 3. Vector Shape Accent Layer (Blend Mode: Overlay)
  const shapeCanvas = createCanvas(width, height);
  const shapeCtx = shapeCanvas.getContext('2d')!;
  
  // Modern stylish geometric framing circle
  shapeCtx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
  shapeCtx.lineWidth = 3;
  shapeCtx.beginPath();
  shapeCtx.arc(width * 0.5, height * 0.5, 180, 0, Math.PI * 2);
  shapeCtx.stroke();

  // Dashed inner ring
  shapeCtx.save();
  shapeCtx.setLineDash([8, 12]);
  shapeCtx.strokeStyle = 'rgba(255, 220, 120, 0.6)';
  shapeCtx.lineWidth = 2;
  shapeCtx.beginPath();
  shapeCtx.arc(width * 0.5, height * 0.5, 160, 0, Math.PI * 2);
  shapeCtx.stroke();
  shapeCtx.restore();

  const shapeLayer: Layer = {
    id: 'layer-shapes',
    name: 'Geometric Ring',
    type: 'shape',
    visible: true,
    locked: false,
    opacity: 0.9,
    blendMode: 'overlay',
    x: 0,
    y: 0,
    width,
    height,
    canvas: shapeCanvas,
  };

  // 4. Typography Layer
  const textCanvas = createCanvas(width, height);
  const textCtx = textCanvas.getContext('2d')!;
  
  textCtx.textAlign = 'center';
  textCtx.textBaseline = 'middle';
  
  // Title
  textCtx.font = 'bold 36px "Segoe UI", Roboto, sans-serif';
  textCtx.fillStyle = '#ffffff';
  textCtx.shadowColor = 'rgba(0,0,0,0.6)';
  textCtx.shadowBlur = 12;
  textCtx.shadowOffsetY = 4;
  textCtx.fillText('PHOTOLITE STUDIO', width * 0.5, height * 0.46);

  // Subtitle
  textCtx.font = '500 14px "Segoe UI", Roboto, sans-serif';
  textCtx.fillStyle = '#fed7aa';
  try {
    if ('letterSpacing' in textCtx) {
      (textCtx as unknown as { letterSpacing: string }).letterSpacing = '4px';
    }
  } catch {
    // Gracefully ignore if letterSpacing is unsupported
  }
  textCtx.fillText('WEB IMAGE EDITOR', width * 0.5, height * 0.53);

  const textLayer: Layer = {
    id: 'layer-text',
    name: 'Typography',
    type: 'text',
    visible: true,
    locked: false,
    opacity: 1,
    blendMode: 'source-over',
    x: 0,
    y: 0,
    width,
    height,
    canvas: textCanvas,
    textData: {
      text: 'PHOTOLITE STUDIO',
      fontSize: 36,
      fontFamily: 'Segoe UI, sans-serif',
      color: '#ffffff',
      bold: true,
      italic: false,
    },
  };

  return {
    layers: [bgLayer, orbLayer, shapeLayer, textLayer],
    activeLayerId: 'layer-text',
  };
}
