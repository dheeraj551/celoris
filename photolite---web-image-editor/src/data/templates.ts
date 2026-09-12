import { Layer, BlendMode } from '../types';
import { createCanvas } from '../utils/canvasUtils';

export interface DesignTemplate {
  id: string;
  title: string;
  category: 'social' | 'youtube' | 'story' | 'banner' | 'poster';
  categoryLabel: string;
  width: number;
  height: number;
  description: string;
  tags: string[];
  accentColor: string;
  badgeText: string;
  generateLayers: () => { layers: Layer[]; activeLayerId: string };
  // Pre-rendered base64 thumbnail for instant loading without lag
  thumbnail?: string;
}

// Helper to draw clean rounded rectangles
function drawRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// 1. Summer Flash Sale (1080x1080)
function createSummerSaleTemplate(): { layers: Layer[]; activeLayerId: string } {
  const width = 1080;
  const height = 1080;

  // Layer 1: Background Gradient
  const bgCanvas = createCanvas(width, height);
  const bgCtx = bgCanvas.getContext('2d')!;
  const bgGrad = bgCtx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#1c092b');
  bgGrad.addColorStop(0.4, '#581c87');
  bgGrad.addColorStop(0.75, '#be185d');
  bgGrad.addColorStop(1, '#f97316');
  bgCtx.fillStyle = bgGrad;
  bgCtx.fillRect(0, 0, width, height);

  // Soft ambient radial glows
  const glow1 = bgCtx.createRadialGradient(width * 0.8, height * 0.2, 20, width * 0.8, height * 0.2, 450);
  glow1.addColorStop(0, 'rgba(251, 146, 60, 0.45)');
  glow1.addColorStop(1, 'rgba(251, 146, 60, 0)');
  bgCtx.fillStyle = glow1;
  bgCtx.beginPath();
  bgCtx.arc(width * 0.8, height * 0.2, 450, 0, Math.PI * 2);
  bgCtx.fill();

  const bgLayer: Layer = {
    id: 'sale-bg',
    name: 'Sunset Gradient Background',
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

  // Layer 2: Geometric Cards & Frame
  const cardCanvas = createCanvas(width, height);
  const cardCtx = cardCanvas.getContext('2d')!;

  // Frosted center backdrop card
  cardCtx.save();
  cardCtx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  cardCtx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
  cardCtx.lineWidth = 2;
  drawRoundRect(cardCtx, 100, 160, 880, 760, 36);
  cardCtx.fill();
  cardCtx.stroke();

  // Subtle interior dashed border
  cardCtx.setLineDash([12, 10]);
  cardCtx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  cardCtx.lineWidth = 1.5;
  drawRoundRect(cardCtx, 124, 184, 832, 712, 24);
  cardCtx.stroke();
  cardCtx.restore();

  const cardLayer: Layer = {
    id: 'sale-card',
    name: 'Frosted Glass Center Card',
    type: 'shape',
    visible: true,
    locked: false,
    opacity: 0.95,
    blendMode: 'source-over',
    x: 0,
    y: 0,
    width,
    height,
    canvas: cardCanvas,
  };

  // Layer 3: Sale Badge Sticker
  const badgeCanvas = createCanvas(width, height);
  const badgeCtx = badgeCanvas.getContext('2d')!;

  badgeCtx.save();
  // Drop shadow for sticker
  badgeCtx.shadowColor = 'rgba(0, 0, 0, 0.4)';
  badgeCtx.shadowBlur = 24;
  badgeCtx.shadowOffsetY = 10;

  // Yellow pill badge
  badgeCtx.fillStyle = '#facc15';
  drawRoundRect(badgeCtx, width / 2 - 190, 230, 380, 64, 32);
  badgeCtx.fill();

  // Badge Text
  badgeCtx.shadowColor = 'transparent';
  badgeCtx.fillStyle = '#0f172a';
  badgeCtx.font = '900 24px "Montserrat", "Segoe UI", sans-serif';
  badgeCtx.textAlign = 'center';
  badgeCtx.textBaseline = 'middle';
  badgeCtx.fillText('⚡ FLASH SALE • TODAY ONLY', width / 2, 262);
  badgeCtx.restore();

  // Big percentage tag circle
  badgeCtx.save();
  badgeCtx.shadowColor = 'rgba(0, 0, 0, 0.35)';
  badgeCtx.shadowBlur = 20;
  badgeCtx.shadowOffsetY = 8;
  badgeCtx.fillStyle = '#ef4444';
  badgeCtx.beginPath();
  badgeCtx.arc(width / 2 + 320, 380, 85, 0, Math.PI * 2);
  badgeCtx.fill();

  badgeCtx.strokeStyle = '#ffffff';
  badgeCtx.lineWidth = 4;
  badgeCtx.stroke();

  badgeCtx.fillStyle = '#ffffff';
  badgeCtx.textAlign = 'center';
  badgeCtx.textBaseline = 'middle';
  badgeCtx.font = '900 42px "Montserrat", sans-serif';
  badgeCtx.fillText('50%', width / 2 + 320, 368);
  badgeCtx.font = '700 18px "Montserrat", sans-serif';
  badgeCtx.fillText('OFF', width / 2 + 320, 404);
  badgeCtx.restore();

  const badgeLayer: Layer = {
    id: 'sale-badge',
    name: 'Discount Pill & 50% Off Seal',
    type: 'raster',
    visible: true,
    locked: false,
    opacity: 1,
    blendMode: 'source-over',
    x: 0,
    y: 0,
    width,
    height,
    canvas: badgeCanvas,
  };

  // Layer 4: Main Headline Text
  const titleCanvas = createCanvas(width, height);
  const titleCtx = titleCanvas.getContext('2d')!;

  titleCtx.save();
  titleCtx.textAlign = 'center';
  titleCtx.textBaseline = 'middle';
  titleCtx.shadowColor = 'rgba(0, 0, 0, 0.6)';
  titleCtx.shadowBlur = 20;
  titleCtx.shadowOffsetY = 8;

  titleCtx.font = '900 102px "Montserrat", "Impact", sans-serif';
  titleCtx.fillStyle = '#ffffff';
  titleCtx.fillText('SUMMER', width / 2, 420);

  // Gradient text for MEGA SALE
  const textGrad = titleCtx.createLinearGradient(width / 2 - 300, 0, width / 2 + 300, 0);
  textGrad.addColorStop(0, '#fef08a');
  textGrad.addColorStop(0.5, '#f59e0b');
  textGrad.addColorStop(1, '#ea580c');
  titleCtx.fillStyle = textGrad;
  titleCtx.fillText('COLLECTION', width / 2, 530);
  titleCtx.restore();

  const titleLayer: Layer = {
    id: 'sale-title',
    name: 'Headline: SUMMER COLLECTION',
    type: 'text',
    visible: true,
    locked: false,
    opacity: 1,
    blendMode: 'source-over',
    x: 0,
    y: 0,
    width,
    height,
    canvas: titleCanvas,
    textData: {
      text: 'SUMMER COLLECTION',
      fontSize: 102,
      fontFamily: 'Montserrat, sans-serif',
      color: '#ffffff',
      bold: true,
      italic: false,
    },
  };

  // Layer 5: Subtitle & Call To Action
  const ctaCanvas = createCanvas(width, height);
  const ctaCtx = ctaCanvas.getContext('2d')!;

  ctaCtx.save();
  // Description line
  ctaCtx.textAlign = 'center';
  ctaCtx.textBaseline = 'middle';
  ctaCtx.fillStyle = '#fce7f3';
  ctaCtx.font = '500 28px "Segoe UI", Roboto, sans-serif';
  ctaCtx.fillText('Discover premium styles with up to 50% discount on all items.', width / 2, 640);

  // Button
  ctaCtx.shadowColor = 'rgba(0, 0, 0, 0.4)';
  ctaCtx.shadowBlur = 18;
  ctaCtx.shadowOffsetY = 6;
  ctaCtx.fillStyle = '#ffffff';
  drawRoundRect(ctaCtx, width / 2 - 170, 710, 340, 72, 36);
  ctaCtx.fill();

  ctaCtx.shadowColor = 'transparent';
  ctaCtx.fillStyle = '#0f172a';
  ctaCtx.font = '800 24px "Montserrat", sans-serif';
  ctaCtx.fillText('SHOP NOW →', width / 2, 746);

  // URL / Code footer
  ctaCtx.fillStyle = '#fef08a';
  ctaCtx.font = '600 20px "Segoe UI", monospace';
  ctaCtx.fillText('USE VOUCHER CODE: SUMMER50 • FREE SHIPPING OVER $50', width / 2, 835);
  ctaCtx.restore();

  const ctaLayer: Layer = {
    id: 'sale-cta',
    name: 'CTA Button & Promo Subtext',
    type: 'text',
    visible: true,
    locked: false,
    opacity: 1,
    blendMode: 'source-over',
    x: 0,
    y: 0,
    width,
    height,
    canvas: ctaCanvas,
    textData: {
      text: 'SHOP NOW →',
      fontSize: 24,
      fontFamily: 'Montserrat, sans-serif',
      color: '#0f172a',
      bold: true,
      italic: false,
    },
  };

  // Layer 6: Sparkles & Floating Particles (Blend: Screen)
  const particlesCanvas = createCanvas(width, height);
  const pCtx = particlesCanvas.getContext('2d')!;

  pCtx.fillStyle = '#ffffff';
  // Four-point stars
  const drawStar = (cx: number, cy: number, r: number) => {
    pCtx.save();
    pCtx.beginPath();
    pCtx.moveTo(cx, cy - r);
    pCtx.quadraticCurveTo(cx, cy, cx + r, cy);
    pCtx.quadraticCurveTo(cx, cy, cx, cy + r);
    pCtx.quadraticCurveTo(cx, cy, cx - r, cy);
    pCtx.quadraticCurveTo(cx, cy, cx, cy - r);
    pCtx.closePath();
    pCtx.fill();
    pCtx.restore();
  };

  drawStar(180, 240, 24);
  drawStar(900, 260, 32);
  drawStar(220, 800, 28);
  drawStar(880, 780, 20);
  drawStar(540, 130, 18);
  drawStar(790, 480, 16);

  // Tiny sparkles
  for (let i = 0; i < 40; i++) {
    const px = Math.sin(i * 123) * 440 + width / 2;
    const py = Math.cos(i * 456) * 440 + height / 2;
    pCtx.beginPath();
    pCtx.arc(px, py, (i % 3) + 2, 0, Math.PI * 2);
    pCtx.fill();
  }

  const particlesLayer: Layer = {
    id: 'sale-particles',
    name: 'Sparkles & Confetti Stars',
    type: 'raster',
    visible: true,
    locked: false,
    opacity: 0.9,
    blendMode: 'screen',
    x: 0,
    y: 0,
    width,
    height,
    canvas: particlesCanvas,
  };

  return {
    layers: [bgLayer, cardLayer, badgeLayer, titleLayer, ctaLayer, particlesLayer],
    activeLayerId: 'sale-title',
  };
}

// 2. Pro Tech Podcast / YouTube Thumbnail (1280x720)
function createYouTubeTechTemplate(): { layers: Layer[]; activeLayerId: string } {
  const width = 1280;
  const height = 720;

  // Layer 1: Dark Modern Studio Background
  const bgCanvas = createCanvas(width, height);
  const bgCtx = bgCanvas.getContext('2d')!;
  bgCtx.fillStyle = '#0a0d14';
  bgCtx.fillRect(0, 0, width, height);

  // Left neon cyan rim glow
  const leftGlow = bgCtx.createRadialGradient(80, 360, 30, 80, 360, 450);
  leftGlow.addColorStop(0, 'rgba(6, 182, 212, 0.45)');
  leftGlow.addColorStop(0.6, 'rgba(6, 182, 212, 0.1)');
  leftGlow.addColorStop(1, 'rgba(6, 182, 212, 0)');
  bgCtx.fillStyle = leftGlow;
  bgCtx.fillRect(0, 0, width, height);

  // Right electric purple rim glow
  const rightGlow = bgCtx.createRadialGradient(1200, 360, 30, 1200, 360, 480);
  rightGlow.addColorStop(0, 'rgba(168, 85, 247, 0.45)');
  rightGlow.addColorStop(0.6, 'rgba(168, 85, 247, 0.1)');
  rightGlow.addColorStop(1, 'rgba(168, 85, 247, 0)');
  bgCtx.fillStyle = rightGlow;
  bgCtx.fillRect(0, 0, width, height);

  const bgLayer: Layer = {
    id: 'yt-bg',
    name: 'Dual Neon Studio Backdrop',
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

  // Layer 2: Geometric Split Panel & Tech Grid
  const gridCanvas = createCanvas(width, height);
  const gridCtx = gridCanvas.getContext('2d')!;

  // Diagonal angled accent panel
  gridCtx.save();
  gridCtx.fillStyle = 'rgba(255, 255, 255, 0.04)';
  gridCtx.beginPath();
  gridCtx.moveTo(750, 0);
  gridCtx.lineTo(1280, 0);
  gridCtx.lineTo(1280, 720);
  gridCtx.lineTo(620, 720);
  gridCtx.closePath();
  gridCtx.fill();

  // Angled border line
  gridCtx.strokeStyle = '#06b6d4';
  gridCtx.lineWidth = 3;
  gridCtx.beginPath();
  gridCtx.moveTo(750, 0);
  gridCtx.lineTo(620, 720);
  gridCtx.stroke();

  // Subtle isometric/dot grid
  gridCtx.fillStyle = 'rgba(255, 255, 255, 0.15)';
  for (let x = 80; x < 600; x += 40) {
    for (let y = 80; y < 640; y += 40) {
      gridCtx.beginPath();
      gridCtx.arc(x, y, 1.5, 0, Math.PI * 2);
      gridCtx.fill();
    }
  }
  gridCtx.restore();

  const gridLayer: Layer = {
    id: 'yt-grid',
    name: 'Angled Studio Split & Dot Grid',
    type: 'shape',
    visible: true,
    locked: false,
    opacity: 0.85,
    blendMode: 'source-over',
    x: 0,
    y: 0,
    width,
    height,
    canvas: gridCanvas,
  };

  // Layer 3: Episode Badge & Tag
  const badgeCanvas = createCanvas(width, height);
  const badgeCtx = badgeCanvas.getContext('2d')!;

  badgeCtx.save();
  // Red YouTube style live tag
  badgeCtx.fillStyle = '#dc2626';
  drawRoundRect(badgeCtx, 90, 110, 240, 52, 26);
  badgeCtx.fill();

  badgeCtx.fillStyle = '#ffffff';
  badgeCtx.font = '900 20px "Segoe UI", sans-serif';
  badgeCtx.textAlign = 'center';
  badgeCtx.textBaseline = 'middle';
  badgeCtx.fillText('🔴 EPISODE #42', 210, 136);

  // Category pill
  badgeCtx.fillStyle = 'rgba(255, 255, 255, 0.12)';
  badgeCtx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  badgeCtx.lineWidth = 1.5;
  drawRoundRect(badgeCtx, 345, 110, 190, 52, 26);
  badgeCtx.fill();
  badgeCtx.stroke();

  badgeCtx.fillStyle = '#38bdf8';
  badgeCtx.fillText('TECH INSIGHTS', 440, 136);
  badgeCtx.restore();

  const badgeLayer: Layer = {
    id: 'yt-badge',
    name: 'Episode & Live Tag Pill',
    type: 'raster',
    visible: true,
    locked: false,
    opacity: 1,
    blendMode: 'source-over',
    x: 0,
    y: 0,
    width,
    height,
    canvas: badgeCanvas,
  };

  // Layer 4: High Impact Title Text
  const titleCanvas = createCanvas(width, height);
  const titleCtx = titleCanvas.getContext('2d')!;

  titleCtx.save();
  titleCtx.textAlign = 'left';
  titleCtx.textBaseline = 'top';
  titleCtx.shadowColor = 'rgba(0, 0, 0, 0.85)';
  titleCtx.shadowBlur = 18;
  titleCtx.shadowOffsetY = 6;

  titleCtx.font = '900 86px "Montserrat", Impact, sans-serif';
  titleCtx.fillStyle = '#ffffff';
  titleCtx.fillText('THE FUTURE', 90, 200);

  // Big bold yellow second line
  titleCtx.fillStyle = '#fde047';
  titleCtx.fillText('OF AI CODING', 90, 305);

  // Third line with cyan tint
  titleCtx.fillStyle = '#38bdf8';
  titleCtx.font = '900 68px "Montserrat", Impact, sans-serif';
  titleCtx.fillText('WHAT CHANGES?', 90, 415);
  titleCtx.restore();

  const titleLayer: Layer = {
    id: 'yt-title',
    name: 'Main Headline (Impact)',
    type: 'text',
    visible: true,
    locked: false,
    opacity: 1,
    blendMode: 'source-over',
    x: 0,
    y: 0,
    width,
    height,
    canvas: titleCanvas,
    textData: {
      text: 'THE FUTURE OF AI CODING',
      fontSize: 86,
      fontFamily: 'Montserrat, sans-serif',
      color: '#ffffff',
      bold: true,
      italic: false,
    },
  };

  // Layer 5: Subtitle & Guest Info
  const subCanvas = createCanvas(width, height);
  const subCtx = subCanvas.getContext('2d')!;

  subCtx.save();
  subCtx.fillStyle = '#94a3b8';
  subCtx.font = '600 24px "Segoe UI", sans-serif';
  subCtx.fillText('EXPERT DISCUSSION • FULL BENCHMARK ANALYSIS', 90, 520);

  // Watch Now Tag Bar
  subCtx.fillStyle = '#ffffff';
  drawRoundRect(subCtx, 90, 570, 220, 58, 29);
  subCtx.fill();

  subCtx.fillStyle = '#0f172a';
  subCtx.font = '800 20px "Montserrat", sans-serif';
  subCtx.fillText('WATCH NOW ▶', 125, 606);
  subCtx.restore();

  const subLayer: Layer = {
    id: 'yt-sub',
    name: 'Subtitle & Watch Now CTA',
    type: 'text',
    visible: true,
    locked: false,
    opacity: 1,
    blendMode: 'source-over',
    x: 0,
    y: 0,
    width,
    height,
    canvas: subCanvas,
    textData: {
      text: 'EXPERT DISCUSSION • FULL BENCHMARK ANALYSIS',
      fontSize: 24,
      fontFamily: 'Segoe UI, sans-serif',
      color: '#94a3b8',
      bold: true,
      italic: false,
    },
  };

  // Layer 6: Guest Photo Frame / Emblem
  const frameCanvas = createCanvas(width, height);
  const frameCtx = frameCanvas.getContext('2d')!;

  frameCtx.save();
  // Glowing circular frame placeholder for guest headshot
  const cx = 970;
  const cy = 360;
  const radius = 190;

  // Outer glowing ring
  frameCtx.shadowColor = '#06b6d4';
  frameCtx.shadowBlur = 30;
  frameCtx.strokeStyle = '#38bdf8';
  frameCtx.lineWidth = 6;
  frameCtx.beginPath();
  frameCtx.arc(cx, cy, radius, 0, Math.PI * 2);
  frameCtx.stroke();

  // Inner placeholder background
  frameCtx.shadowColor = 'transparent';
  frameCtx.fillStyle = '#1e293b';
  frameCtx.beginPath();
  frameCtx.arc(cx, cy, radius - 4, 0, Math.PI * 2);
  frameCtx.fill();

  // Play button graphic
  frameCtx.fillStyle = '#fde047';
  frameCtx.beginPath();
  frameCtx.moveTo(cx - 20, cy - 35);
  frameCtx.lineTo(cx + 35, cy);
  frameCtx.lineTo(cx - 20, cy + 35);
  frameCtx.closePath();
  frameCtx.fill();

  // Guest name ribbon
  frameCtx.fillStyle = '#0284c7';
  drawRoundRect(frameCtx, cx - 140, cy + radius - 30, 280, 52, 26);
  frameCtx.fill();

  frameCtx.fillStyle = '#ffffff';
  frameCtx.font = '800 20px "Segoe UI", sans-serif';
  frameCtx.textAlign = 'center';
  frameCtx.textBaseline = 'middle';
  frameCtx.fillText('GUEST INTERVIEW', cx, cy + radius - 4);
  frameCtx.restore();

  const frameLayer: Layer = {
    id: 'yt-frame',
    name: 'Guest Avatar Ring & Play Button',
    type: 'shape',
    visible: true,
    locked: false,
    opacity: 1,
    blendMode: 'source-over',
    x: 0,
    y: 0,
    width,
    height,
    canvas: frameCanvas,
  };

  return {
    layers: [bgLayer, gridLayer, badgeLayer, titleLayer, subLayer, frameLayer],
    activeLayerId: 'yt-title',
  };
}

// 3. Minimalist Wisdom Quote (1080x1080)
function createMinimalistQuoteTemplate(): { layers: Layer[]; activeLayerId: string } {
  const width = 1080;
  const height = 1080;

  // Layer 1: Warm Linen Background
  const bgCanvas = createCanvas(width, height);
  const bgCtx = bgCanvas.getContext('2d')!;
  bgCtx.fillStyle = '#f8f5f0';
  bgCtx.fillRect(0, 0, width, height);

  // Soft subtle warm gradient overlay
  const warmGrad = bgCtx.createLinearGradient(0, 0, width, height);
  warmGrad.addColorStop(0, 'rgba(254, 243, 199, 0.4)');
  warmGrad.addColorStop(1, 'rgba(243, 232, 222, 0.8)');
  bgCtx.fillStyle = warmGrad;
  bgCtx.fillRect(0, 0, width, height);

  const bgLayer: Layer = {
    id: 'quote-bg',
    name: 'Warm Linen Backdrop',
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

  // Layer 2: Organic Terracotta Arch & Shapes
  const shapesCanvas = createCanvas(width, height);
  const sCtx = shapesCanvas.getContext('2d')!;

  // Terracotta arch in background
  sCtx.save();
  sCtx.fillStyle = '#d97757';
  sCtx.beginPath();
  sCtx.arc(width / 2, 440, 260, Math.PI, 0);
  sCtx.lineTo(width / 2 + 260, 780);
  sCtx.lineTo(width / 2 - 260, 780);
  sCtx.closePath();
  sCtx.fill();

  // Muted olive sun disc
  sCtx.fillStyle = '#6b7280';
  sCtx.beginPath();
  sCtx.arc(width / 2 - 190, 310, 80, 0, Math.PI * 2);
  sCtx.fill();

  // Subtle thin circle frame
  sCtx.strokeStyle = 'rgba(78, 60, 52, 0.25)';
  sCtx.lineWidth = 2;
  sCtx.beginPath();
  sCtx.arc(width / 2, 540, 380, 0, Math.PI * 2);
  sCtx.stroke();
  sCtx.restore();

  const shapesLayer: Layer = {
    id: 'quote-shapes',
    name: 'Terracotta Arch & Sun Disc',
    type: 'shape',
    visible: true,
    locked: false,
    opacity: 0.88,
    blendMode: 'source-over',
    x: 0,
    y: 0,
    width,
    height,
    canvas: shapesCanvas,
  };

  // Layer 3: Giant Stylized Quotation Marks
  const marksCanvas = createCanvas(width, height);
  const mCtx = marksCanvas.getContext('2d')!;

  mCtx.save();
  mCtx.fillStyle = '#ffffff';
  mCtx.font = 'italic 700 160px "Playfair Display", Georgia, serif';
  mCtx.textAlign = 'center';
  mCtx.textBaseline = 'middle';
  mCtx.fillText('“', width / 2, 360);
  mCtx.restore();

  const marksLayer: Layer = {
    id: 'quote-marks',
    name: 'Stylized Quotation Glyph',
    type: 'text',
    visible: true,
    locked: false,
    opacity: 0.95,
    blendMode: 'source-over',
    x: 0,
    y: 0,
    width,
    height,
    canvas: marksCanvas,
  };

  // Layer 4: Main Quote Text
  const quoteCanvas = createCanvas(width, height);
  const qCtx = quoteCanvas.getContext('2d')!;

  qCtx.save();
  qCtx.textAlign = 'center';
  qCtx.textBaseline = 'middle';
  qCtx.fillStyle = '#ffffff';
  qCtx.font = '600 48px "Playfair Display", Georgia, serif';

  qCtx.fillText('CREATIVITY TAKES', width / 2, 460);
  qCtx.fillText('COURAGE AND VISION.', width / 2, 530);
  qCtx.fillText('TRUST YOUR CRAFT.', width / 2, 600);
  qCtx.restore();

  const quoteLayer: Layer = {
    id: 'quote-text',
    name: 'Headline Quote Text',
    type: 'text',
    visible: true,
    locked: false,
    opacity: 1,
    blendMode: 'source-over',
    x: 0,
    y: 0,
    width,
    height,
    canvas: quoteCanvas,
    textData: {
      text: 'CREATIVITY TAKES COURAGE',
      fontSize: 48,
      fontFamily: 'Playfair Display, serif',
      color: '#ffffff',
      bold: true,
      italic: false,
    },
  };

  // Layer 5: Author & Category Subtext
  const authorCanvas = createCanvas(width, height);
  const aCtx = authorCanvas.getContext('2d')!;

  aCtx.save();
  aCtx.textAlign = 'center';
  aCtx.textBaseline = 'middle';
  aCtx.fillStyle = '#292524';
  aCtx.font = '700 24px "Montserrat", "Segoe UI", sans-serif';
  aCtx.fillText('— HENRI MATISSE', width / 2, 700);

  aCtx.fillStyle = '#78716c';
  aCtx.font = '500 18px "Segoe UI", sans-serif';
  aCtx.fillText('DAILY MINDFULNESS & ARTISTIC INSPIRATION', width / 2, 750);
  aCtx.restore();

  const authorLayer: Layer = {
    id: 'quote-author',
    name: 'Author Attribution & Notes',
    type: 'text',
    visible: true,
    locked: false,
    opacity: 1,
    blendMode: 'source-over',
    x: 0,
    y: 0,
    width,
    height,
    canvas: authorCanvas,
    textData: {
      text: '— HENRI MATISSE',
      fontSize: 24,
      fontFamily: 'Montserrat, sans-serif',
      color: '#292524',
      bold: true,
      italic: false,
    },
  };

  // Layer 6: Fine Framing Border
  const borderCanvas = createCanvas(width, height);
  const bCtx = borderCanvas.getContext('2d')!;

  bCtx.save();
  bCtx.strokeStyle = '#b45309';
  bCtx.lineWidth = 1.5;
  bCtx.strokeRect(60, 60, width - 120, height - 120);

  // Corner floral/diamond flourishes
  const drawFlourish = (x: number, y: number) => {
    bCtx.fillStyle = '#b45309';
    bCtx.beginPath();
    bCtx.arc(x, y, 4, 0, Math.PI * 2);
    bCtx.fill();
  };
  drawFlourish(60, 60);
  drawFlourish(width - 60, 60);
  drawFlourish(60, height - 60);
  drawFlourish(width - 60, height - 60);
  bCtx.restore();

  const borderLayer: Layer = {
    id: 'quote-border',
    name: 'Fine Hairline Frame & Accents',
    type: 'shape',
    visible: true,
    locked: false,
    opacity: 0.7,
    blendMode: 'source-over',
    x: 0,
    y: 0,
    width,
    height,
    canvas: borderCanvas,
  };

  return {
    layers: [bgLayer, shapesLayer, marksLayer, quoteLayer, authorLayer, borderLayer],
    activeLayerId: 'quote-text',
  };
}

// 4. Mobile Story / Reel Flash Sale (1080x1920)
function createMobileStoryTemplate(): { layers: Layer[]; activeLayerId: string } {
  const width = 1080;
  const height = 1920;

  // Layer 1: Sunset Rose to Plum Vertical Flow
  const bgCanvas = createCanvas(width, height);
  const bgCtx = bgCanvas.getContext('2d')!;
  const bgGrad = bgCtx.createLinearGradient(0, 0, 0, height);
  bgGrad.addColorStop(0, '#1f132b');
  bgGrad.addColorStop(0.3, '#581c87');
  bgGrad.addColorStop(0.65, '#9d174d');
  bgGrad.addColorStop(0.9, '#db2777');
  bgGrad.addColorStop(1, '#f97316');
  bgCtx.fillStyle = bgGrad;
  bgCtx.fillRect(0, 0, width, height);

  const bgLayer: Layer = {
    id: 'story-bg',
    name: 'Vertical Rose-Plum Gradient',
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

  // Layer 2: Showcase Photo Card Frame
  const cardCanvas = createCanvas(width, height);
  const cardCtx = cardCanvas.getContext('2d')!;

  cardCtx.save();
  cardCtx.shadowColor = 'rgba(0, 0, 0, 0.4)';
  cardCtx.shadowBlur = 32;
  cardCtx.shadowOffsetY = 16;

  // Big central display card
  cardCtx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  cardCtx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  cardCtx.lineWidth = 2;
  drawRoundRect(cardCtx, 90, 480, 900, 880, 40);
  cardCtx.fill();
  cardCtx.stroke();

  // Photo placeholder rectangle inside card
  cardCtx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  drawRoundRect(cardCtx, 120, 510, 840, 560, 28);
  cardCtx.fill();

  // Camera / hanger icon silhouette
  cardCtx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  cardCtx.lineWidth = 4;
  cardCtx.beginPath();
  cardCtx.arc(width / 2, 790, 60, 0, Math.PI * 2);
  cardCtx.stroke();
  cardCtx.restore();

  const cardLayer: Layer = {
    id: 'story-card',
    name: 'Glassmorphic Showcase Card',
    type: 'shape',
    visible: true,
    locked: false,
    opacity: 0.95,
    blendMode: 'source-over',
    x: 0,
    y: 0,
    width,
    height,
    canvas: cardCanvas,
  };

  // Layer 3: Top Header Tag & Brand
  const tagCanvas = createCanvas(width, height);
  const tagCtx = tagCanvas.getContext('2d')!;

  tagCtx.save();
  tagCtx.textAlign = 'center';
  tagCtx.textBaseline = 'middle';

  // Brand Name
  tagCtx.fillStyle = '#fbcfe8';
  tagCtx.font = '700 24px "Montserrat", sans-serif';
  tagCtx.fillText('L U X E   S T U D I O', width / 2, 180);

  // New Collection pill
  tagCtx.fillStyle = '#ffffff';
  drawRoundRect(tagCtx, width / 2 - 180, 240, 360, 64, 32);
  tagCtx.fill();

  tagCtx.fillStyle = '#831843';
  tagCtx.font = '800 24px "Montserrat", sans-serif';
  tagCtx.fillText('✨ NEW ARRIVALS', width / 2, 272);
  tagCtx.restore();

  const tagLayer: Layer = {
    id: 'story-tag',
    name: 'Brand Title & New Arrivals Pill',
    type: 'raster',
    visible: true,
    locked: false,
    opacity: 1,
    blendMode: 'source-over',
    x: 0,
    y: 0,
    width,
    height,
    canvas: tagCanvas,
  };

  // Layer 4: Main Headline Typography
  const textCanvas = createCanvas(width, height);
  const tCtx = textCanvas.getContext('2d')!;

  tCtx.save();
  tCtx.textAlign = 'center';
  tCtx.textBaseline = 'middle';
  tCtx.shadowColor = 'rgba(0, 0, 0, 0.6)';
  tCtx.shadowBlur = 24;
  tCtx.shadowOffsetY = 8;

  tCtx.fillStyle = '#ffffff';
  tCtx.font = '900 84px "Montserrat", sans-serif';
  tCtx.fillText('AUTUMN', width / 2, 360);
  tCtx.fillText('LOOKBOOK', width / 2, 440);

  // Inside card text
  tCtx.fillStyle = '#ffffff';
  tCtx.font = '800 48px "Montserrat", sans-serif';
  tCtx.fillText('URBAN CHIC EDITION', width / 2, 1140);

  tCtx.fillStyle = '#fce7f3';
  tCtx.font = '500 30px "Segoe UI", sans-serif';
  tCtx.fillText('Premium wool blends & seasonal outerwear', width / 2, 1220);

  tCtx.fillStyle = '#fde047';
  tCtx.font = '800 36px "Montserrat", sans-serif';
  tCtx.fillText('STARTING AT $49', width / 2, 1290);
  tCtx.restore();

  const textLayer: Layer = {
    id: 'story-title',
    name: 'Headline: AUTUMN LOOKBOOK',
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
      text: 'AUTUMN LOOKBOOK',
      fontSize: 84,
      fontFamily: 'Montserrat, sans-serif',
      color: '#ffffff',
      bold: true,
      italic: false,
    },
  };

  // Layer 5: Swipe Up Call to Action
  const ctaCanvas = createCanvas(width, height);
  const ctaCtx = ctaCanvas.getContext('2d')!;

  ctaCtx.save();
  ctaCtx.textAlign = 'center';
  ctaCtx.textBaseline = 'middle';

  // Chevrons
  ctaCtx.strokeStyle = '#ffffff';
  ctaCtx.lineWidth = 4;
  ctaCtx.lineCap = 'round';
  ctaCtx.beginPath();
  ctaCtx.moveTo(width / 2 - 20, 1630);
  ctaCtx.lineTo(width / 2, 1610);
  ctaCtx.lineTo(width / 2 + 20, 1630);

  ctaCtx.moveTo(width / 2 - 20, 1650);
  ctaCtx.lineTo(width / 2, 1630);
  ctaCtx.lineTo(width / 2 + 20, 1650);
  ctaCtx.stroke();

  // Button pill
  ctaCtx.fillStyle = '#ffffff';
  ctaCtx.shadowColor = 'rgba(0, 0, 0, 0.4)';
  ctaCtx.shadowBlur = 20;
  ctaCtx.shadowOffsetY = 8;
  drawRoundRect(ctaCtx, width / 2 - 240, 1680, 480, 80, 40);
  ctaCtx.fill();

  ctaCtx.shadowColor = 'transparent';
  ctaCtx.fillStyle = '#831843';
  ctaCtx.font = '900 28px "Montserrat", sans-serif';
  ctaCtx.fillText('SWIPE UP TO SHOP', width / 2, 1720);

  ctaCtx.fillStyle = '#fce7f3';
  ctaCtx.font = '600 20px "Segoe UI", sans-serif';
  ctaCtx.fillText('USE CODE: FALL20 FOR 20% OFF', width / 2, 1800);
  ctaCtx.restore();

  const ctaLayer: Layer = {
    id: 'story-cta',
    name: 'Swipe Up & Discount Code Bar',
    type: 'text',
    visible: true,
    locked: false,
    opacity: 1,
    blendMode: 'source-over',
    x: 0,
    y: 0,
    width,
    height,
    canvas: ctaCanvas,
    textData: {
      text: 'SWIPE UP TO SHOP',
      fontSize: 28,
      fontFamily: 'Montserrat, sans-serif',
      color: '#831843',
      bold: true,
      italic: false,
    },
  };

  return {
    layers: [bgLayer, cardLayer, tagLayer, textLayer, ctaLayer],
    activeLayerId: 'story-title',
  };
}

// 5. Cyberpunk Night Event Poster (800x1200)
function createCyberpunkPosterTemplate(): { layers: Layer[]; activeLayerId: string } {
  const width = 800;
  const height = 1200;

  // Layer 1: Obsidian Grid Matrix BG
  const bgCanvas = createCanvas(width, height);
  const bgCtx = bgCanvas.getContext('2d')!;
  bgCtx.fillStyle = '#06060c';
  bgCtx.fillRect(0, 0, width, height);

  // Perspective 3D floor grid
  bgCtx.save();
  bgCtx.strokeStyle = 'rgba(34, 211, 238, 0.35)';
  bgCtx.lineWidth = 1.5;

  const horizonY = 720;
  // Horizontal grid lines getting tighter toward horizon
  for (let i = 0; i < 16; i++) {
    const y = horizonY + Math.pow(i / 15, 2.2) * (height - horizonY);
    bgCtx.beginPath();
    bgCtx.moveTo(0, y);
    bgCtx.lineTo(width, y);
    bgCtx.stroke();
  }

  // Perspective radiating lines
  for (let x = -400; x <= width + 400; x += 80) {
    bgCtx.beginPath();
    bgCtx.moveTo(width / 2, horizonY);
    bgCtx.lineTo(x, height);
    bgCtx.stroke();
  }
  bgCtx.restore();

  const bgLayer: Layer = {
    id: 'cyber-bg',
    name: 'Obsidian Perspective Floor Grid',
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

  // Layer 2: Glowing Retro Synth Sun
  const sunCanvas = createCanvas(width, height);
  const sunCtx = sunCanvas.getContext('2d')!;

  sunCtx.save();
  const sunRadius = 180;
  const sunY = 560;

  // Sun gradient (Hot pink to deep orange)
  const sunGrad = sunCtx.createLinearGradient(0, sunY - sunRadius, 0, sunY + sunRadius);
  sunGrad.addColorStop(0, '#ec4899');
  sunGrad.addColorStop(0.5, '#f43f5e');
  sunGrad.addColorStop(1, '#f59e0b');
  sunCtx.fillStyle = sunGrad;
  sunCtx.beginPath();
  sunCtx.arc(width / 2, sunY, sunRadius, 0, Math.PI * 2);
  sunCtx.fill();

  // Horizontal blind cutouts
  sunCtx.fillStyle = '#06060c';
  for (let y = sunY - 40; y < sunY + sunRadius; y += 22) {
    const cutHeight = (y - (sunY - 40)) * 0.08 + 4;
    sunCtx.fillRect(width / 2 - sunRadius - 10, y, (sunRadius + 10) * 2, cutHeight);
  }
  sunCtx.restore();

  const sunLayer: Layer = {
    id: 'cyber-sun',
    name: 'Retro Synthwave Glowing Sun',
    type: 'shape',
    visible: true,
    locked: false,
    opacity: 0.95,
    blendMode: 'source-over',
    x: 0,
    y: 0,
    width,
    height,
    canvas: sunCanvas,
  };

  // Layer 3: Neon Horizon Headline
  const titleCanvas = createCanvas(width, height);
  const titleCtx = titleCanvas.getContext('2d')!;

  titleCtx.save();
  titleCtx.textAlign = 'center';
  titleCtx.textBaseline = 'middle';

  // Over-title tag
  titleCtx.fillStyle = '#22d3ee';
  titleCtx.font = '800 18px "Montserrat", sans-serif';
  titleCtx.fillText('SYNTHWAVE & CYBER MUSIC FESTIVAL', width / 2, 220);

  // Big neon chrome headline
  titleCtx.shadowColor = '#ec4899';
  titleCtx.shadowBlur = 35;
  titleCtx.font = '900 84px "Montserrat", Impact, sans-serif';
  titleCtx.fillStyle = '#ffffff';
  titleCtx.fillText('NEON HORIZON', width / 2, 310);

  // Chromatic sub-glow
  titleCtx.shadowColor = '#06b6d4';
  titleCtx.shadowBlur = 25;
  titleCtx.font = '800 36px "Montserrat", sans-serif';
  titleCtx.fillStyle = '#fbcfe8';
  titleCtx.fillText('ELECTRONIC SOUNDSCAPE', width / 2, 390);
  titleCtx.restore();

  const titleLayer: Layer = {
    id: 'cyber-title',
    name: 'Neon Title: NEON HORIZON',
    type: 'text',
    visible: true,
    locked: false,
    opacity: 1,
    blendMode: 'source-over',
    x: 0,
    y: 0,
    width,
    height,
    canvas: titleCanvas,
    textData: {
      text: 'NEON HORIZON',
      fontSize: 84,
      fontFamily: 'Montserrat, sans-serif',
      color: '#ffffff',
      bold: true,
      italic: false,
    },
  };

  // Layer 4: Lineup & Venue Details
  const detailsCanvas = createCanvas(width, height);
  const dCtx = detailsCanvas.getContext('2d')!;

  dCtx.save();
  dCtx.textAlign = 'center';
  dCtx.textBaseline = 'middle';

  // Lineup box
  dCtx.fillStyle = 'rgba(255, 255, 255, 0.05)';
  dCtx.strokeStyle = '#22d3ee';
  dCtx.lineWidth = 1.5;
  drawRoundRect(dCtx, 100, 820, 600, 180, 20);
  dCtx.fill();
  dCtx.stroke();

  // Headliners
  dCtx.fillStyle = '#fde047';
  dCtx.font = '800 24px "Montserrat", sans-serif';
  dCtx.fillText('CHROME DIVISION  •  LASER CORE  •  VOX PULSE', width / 2, 865);

  dCtx.fillStyle = '#e2e8f0';
  dCtx.font = '600 18px "Segoe UI", sans-serif';
  dCtx.fillText('KAVINSKY TRIBUTE  •  VECTOR DREAMS  •  CYBERDYNE', width / 2, 910);

  dCtx.fillStyle = '#22d3ee';
  dCtx.font = '700 16px "Montserrat", sans-serif';
  dCtx.fillText('OCTOBER 31 • ARENA DOME X • DOORS OPEN 8:00 PM', width / 2, 955);

  // Ticket badge
  dCtx.fillStyle = '#ec4899';
  drawRoundRect(dCtx, width / 2 - 140, 1040, 280, 56, 28);
  dCtx.fill();

  dCtx.fillStyle = '#ffffff';
  dCtx.font = '900 20px "Montserrat", sans-serif';
  dCtx.fillText('GET TICKETS NOW', width / 2, 1068);
  dCtx.restore();

  const detailsLayer: Layer = {
    id: 'cyber-details',
    name: 'Festival Lineup & Venue Box',
    type: 'text',
    visible: true,
    locked: false,
    opacity: 1,
    blendMode: 'source-over',
    x: 0,
    y: 0,
    width,
    height,
    canvas: detailsCanvas,
    textData: {
      text: 'OCTOBER 31 • ARENA DOME X',
      fontSize: 24,
      fontFamily: 'Montserrat, sans-serif',
      color: '#fde047',
      bold: true,
      italic: false,
    },
  };

  // Layer 5: Laser Beams & Glow Streaks (Blend: Screen)
  const laserCanvas = createCanvas(width, height);
  const lCtx = laserCanvas.getContext('2d')!;

  lCtx.save();
  // Beams shooting upward
  const drawBeam = (x1: number, y1: number, x2: number, y2: number, color: string) => {
    lCtx.strokeStyle = color;
    lCtx.lineWidth = 3;
    lCtx.beginPath();
    lCtx.moveTo(x1, y1);
    lCtx.lineTo(x2, y2);
    lCtx.stroke();
  };

  drawBeam(120, 1200, 360, 0, 'rgba(6, 182, 212, 0.7)');
  drawBeam(680, 1200, 440, 0, 'rgba(236, 72, 153, 0.7)');
  drawBeam(20, 1100, 700, 100, 'rgba(168, 85, 247, 0.5)');
  drawBeam(780, 1100, 100, 100, 'rgba(34, 211, 238, 0.5)');
  lCtx.restore();

  const laserLayer: Layer = {
    id: 'cyber-lasers',
    name: 'Laser Beams & Glow Streaks',
    type: 'raster',
    visible: true,
    locked: false,
    opacity: 0.85,
    blendMode: 'screen',
    x: 0,
    y: 0,
    width,
    height,
    canvas: laserCanvas,
  };

  return {
    layers: [bgLayer, sunLayer, titleLayer, detailsLayer, laserLayer],
    activeLayerId: 'cyber-title',
  };
}

// 6. Fitness & Wellness Daily Motivation (1080x1080)
function createFitnessTemplate(): { layers: Layer[]; activeLayerId: string } {
  const width = 1080;
  const height = 1080;

  // Layer 1: Dark Emerald Gradient
  const bgCanvas = createCanvas(width, height);
  const bgCtx = bgCanvas.getContext('2d')!;
  const bgGrad = bgCtx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#061a12');
  bgGrad.addColorStop(0.5, '#064e3b');
  bgGrad.addColorStop(1, '#022c22');
  bgCtx.fillStyle = bgGrad;
  bgCtx.fillRect(0, 0, width, height);

  const bgLayer: Layer = {
    id: 'fit-bg',
    name: 'Dark Emerald Carbon Background',
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

  // Layer 2: Dynamic Speed Stripes & Chevrons
  const stripeCanvas = createCanvas(width, height);
  const sCtx = stripeCanvas.getContext('2d')!;

  sCtx.save();
  sCtx.fillStyle = 'rgba(74, 222, 128, 0.08)';
  // Diagonal cutouts
  sCtx.beginPath();
  sCtx.moveTo(200, 0);
  sCtx.lineTo(350, 0);
  sCtx.lineTo(150, height);
  sCtx.lineTo(0, height);
  sCtx.closePath();
  sCtx.fill();

  sCtx.beginPath();
  sCtx.moveTo(420, 0);
  sCtx.lineTo(540, 0);
  sCtx.lineTo(340, height);
  sCtx.lineTo(220, height);
  sCtx.closePath();
  sCtx.fill();

  // Neon green accent line
  sCtx.strokeStyle = '#4ade80';
  sCtx.lineWidth = 4;
  sCtx.beginPath();
  sCtx.moveTo(420, 0);
  sCtx.lineTo(220, height);
  sCtx.stroke();
  sCtx.restore();

  const stripeLayer: Layer = {
    id: 'fit-stripes',
    name: 'High-Speed Neon Stripes',
    type: 'shape',
    visible: true,
    locked: false,
    opacity: 0.9,
    blendMode: 'source-over',
    x: 0,
    y: 0,
    width,
    height,
    canvas: stripeCanvas,
  };

  // Layer 3: Challenge Badge
  const badgeCanvas = createCanvas(width, height);
  const bCtx = badgeCanvas.getContext('2d')!;

  bCtx.save();
  bCtx.fillStyle = '#4ade80';
  drawRoundRect(bCtx, 100, 180, 320, 60, 30);
  bCtx.fill();

  bCtx.fillStyle = '#064e3b';
  bCtx.font = '900 22px "Montserrat", sans-serif';
  bCtx.textAlign = 'center';
  bCtx.textBaseline = 'middle';
  bCtx.fillText('🔥 30-DAY CHALLENGE', 260, 210);
  bCtx.restore();

  const badgeLayer: Layer = {
    id: 'fit-badge',
    name: 'Challenge Pill Badge',
    type: 'raster',
    visible: true,
    locked: false,
    opacity: 1,
    blendMode: 'source-over',
    x: 0,
    y: 0,
    width,
    height,
    canvas: badgeCanvas,
  };

  // Layer 4: Motivational Headline
  const titleCanvas = createCanvas(width, height);
  const tCtx = titleCanvas.getContext('2d')!;

  tCtx.save();
  tCtx.textAlign = 'left';
  tCtx.textBaseline = 'top';
  tCtx.shadowColor = 'rgba(0, 0, 0, 0.7)';
  tCtx.shadowBlur = 24;
  tCtx.shadowOffsetY = 8;

  tCtx.font = '900 110px "Montserrat", Impact, sans-serif';
  tCtx.fillStyle = '#ffffff';
  tCtx.fillText('CRUSH', 100, 270);

  tCtx.fillStyle = '#4ade80';
  tCtx.fillText('YOUR', 100, 385);

  tCtx.fillStyle = '#ffffff';
  tCtx.fillText('LIMITS.', 100, 500);
  tCtx.restore();

  const titleLayer: Layer = {
    id: 'fit-title',
    name: 'Headline: CRUSH YOUR LIMITS',
    type: 'text',
    visible: true,
    locked: false,
    opacity: 1,
    blendMode: 'source-over',
    x: 0,
    y: 0,
    width,
    height,
    canvas: titleCanvas,
    textData: {
      text: 'CRUSH YOUR LIMITS',
      fontSize: 110,
      fontFamily: 'Montserrat, sans-serif',
      color: '#ffffff',
      bold: true,
      italic: false,
    },
  };

  // Layer 5: Routine & Stats Box
  const statsCanvas = createCanvas(width, height);
  const stCtx = statsCanvas.getContext('2d')!;

  stCtx.save();
  // Description
  stCtx.fillStyle = '#d1fae5';
  stCtx.font = '600 28px "Segoe UI", sans-serif';
  stCtx.fillText('Full Body High-Intensity Training • No Equipment Needed', 100, 670);

  // 3 Metric Stat Badges
  const drawStat = (label: string, val: string, x: number) => {
    stCtx.fillStyle = 'rgba(255, 255, 255, 0.07)';
    stCtx.strokeStyle = 'rgba(74, 222, 128, 0.4)';
    stCtx.lineWidth = 1.5;
    drawRoundRect(stCtx, x, 730, 260, 120, 20);
    stCtx.fill();
    stCtx.stroke();

    stCtx.fillStyle = '#4ade80';
    stCtx.font = '900 40px "Montserrat", sans-serif';
    stCtx.fillText(val, x + 24, 785);

    stCtx.fillStyle = '#9ca3af';
    stCtx.font = '600 16px "Segoe UI", sans-serif';
    stCtx.fillText(label, x + 24, 825);
  };

  drawStat('DAILY WORKOUT', '45 MIN', 100);
  drawStat('BURN ESTIMATE', '650 KCAL', 390);
  drawStat('DIFFICULTY', 'ADVANCED', 680);

  // CTA button
  stCtx.fillStyle = '#ffffff';
  drawRoundRect(stCtx, 100, 900, 320, 68, 34);
  stCtx.fill();

  stCtx.fillStyle = '#064e3b';
  stCtx.font = '900 22px "Montserrat", sans-serif';
  stCtx.textAlign = 'center';
  stCtx.fillText('START WORKOUT TODAY →', 260, 942);
  stCtx.restore();

  const statsLayer: Layer = {
    id: 'fit-stats',
    name: 'Workout Stats & Metrics Bar',
    type: 'text',
    visible: true,
    locked: false,
    opacity: 1,
    blendMode: 'source-over',
    x: 0,
    y: 0,
    width,
    height,
    canvas: statsCanvas,
    textData: {
      text: '45 MIN • 650 KCAL',
      fontSize: 28,
      fontFamily: 'Montserrat, sans-serif',
      color: '#4ade80',
      bold: true,
      italic: false,
    },
  };

  return {
    layers: [bgLayer, stripeLayer, badgeLayer, titleLayer, statsLayer],
    activeLayerId: 'fit-title',
  };
}

// 7. Artisan Coffee House Banner (1200x630)
function createCoffeeBannerTemplate(): { layers: Layer[]; activeLayerId: string } {
  const width = 1200;
  const height = 630;

  // Layer 1: Roasted Amber Gradient
  const bgCanvas = createCanvas(width, height);
  const bgCtx = bgCanvas.getContext('2d')!;
  const bgGrad = bgCtx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#1c100b');
  bgGrad.addColorStop(0.5, '#3c1809');
  bgGrad.addColorStop(1, '#66260c');
  bgCtx.fillStyle = bgGrad;
  bgCtx.fillRect(0, 0, width, height);

  // Ambient warm aroma glow
  const aromaGlow = bgCtx.createRadialGradient(width * 0.75, height * 0.5, 30, width * 0.75, height * 0.5, 380);
  aromaGlow.addColorStop(0, 'rgba(245, 158, 11, 0.35)');
  aromaGlow.addColorStop(1, 'rgba(245, 158, 11, 0)');
  bgCtx.fillStyle = aromaGlow;
  bgCtx.fillRect(0, 0, width, height);

  const bgLayer: Layer = {
    id: 'coffee-bg',
    name: 'Roasted Amber Aroma Gradient',
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

  // Layer 2: Vintage Seal & Graphic Emblem
  const sealCanvas = createCanvas(width, height);
  const sCtx = sealCanvas.getContext('2d')!;

  sCtx.save();
  const cx = 920;
  const cy = 315;
  const rad = 150;

  // Stamp circle
  sCtx.strokeStyle = '#f59e0b';
  sCtx.lineWidth = 3;
  sCtx.beginPath();
  sCtx.arc(cx, cy, rad, 0, Math.PI * 2);
  sCtx.stroke();

  // Dashed inner ring
  sCtx.setLineDash([6, 8]);
  sCtx.beginPath();
  sCtx.arc(cx, cy, rad - 14, 0, Math.PI * 2);
  sCtx.stroke();

  // Coffee cup silhouette
  sCtx.setLineDash([]);
  sCtx.fillStyle = '#fef3c7';
  // Cup body
  sCtx.beginPath();
  sCtx.moveTo(cx - 50, cy - 20);
  sCtx.lineTo(cx + 50, cy - 20);
  sCtx.lineTo(cx + 40, cy + 40);
  sCtx.quadraticCurveTo(cx, cy + 60, cx - 40, cy + 40);
  sCtx.closePath();
  sCtx.fill();

  // Cup handle
  sCtx.strokeStyle = '#fef3c7';
  sCtx.lineWidth = 7;
  sCtx.beginPath();
  sCtx.arc(cx + 52, cy + 8, 22, -Math.PI / 2, Math.PI / 2);
  sCtx.stroke();

  // Steam waves
  sCtx.strokeStyle = '#f59e0b';
  sCtx.lineWidth = 3;
  sCtx.beginPath();
  sCtx.moveTo(cx - 20, cy - 35);
  sCtx.quadraticCurveTo(cx - 30, cy - 60, cx - 20, cy - 85);
  sCtx.moveTo(cx, cy - 35);
  sCtx.quadraticCurveTo(cx + 10, cy - 60, cx, cy - 85);
  sCtx.moveTo(cx + 20, cy - 35);
  sCtx.quadraticCurveTo(cx + 30, cy - 60, cx + 20, cy - 85);
  sCtx.stroke();

  // Circular seal banner text
  sCtx.fillStyle = '#f59e0b';
  sCtx.font = '800 16px "Montserrat", sans-serif';
  sCtx.textAlign = 'center';
  sCtx.fillText('EST. 2024 • SINGLE ORIGIN', cx, cy + rad + 35);
  sCtx.restore();

  const sealLayer: Layer = {
    id: 'coffee-seal',
    name: 'Artisan Coffee Cup Stamp',
    type: 'shape',
    visible: true,
    locked: false,
    opacity: 0.95,
    blendMode: 'source-over',
    x: 0,
    y: 0,
    width,
    height,
    canvas: sealCanvas,
  };

  // Layer 3: Grand Opening Headline
  const titleCanvas = createCanvas(width, height);
  const tCtx = titleCanvas.getContext('2d')!;

  tCtx.save();
  tCtx.textAlign = 'left';
  tCtx.textBaseline = 'top';

  // Eyebrow label
  tCtx.fillStyle = '#f59e0b';
  tCtx.font = '800 20px "Montserrat", sans-serif';
  tCtx.fillText('GRAND OPENING WEEKEND', 100, 120);

  // Main Headline
  tCtx.shadowColor = 'rgba(0, 0, 0, 0.7)';
  tCtx.shadowBlur = 18;
  tCtx.shadowOffsetY = 6;
  tCtx.fillStyle = '#fef3c7';
  tCtx.font = '700 76px "Playfair Display", Georgia, serif';
  tCtx.fillText('THE ARTISAN', 100, 165);
  tCtx.fillText('ROAST CO.', 100, 255);
  tCtx.restore();

  const titleLayer: Layer = {
    id: 'coffee-title',
    name: 'Headline: THE ARTISAN ROAST',
    type: 'text',
    visible: true,
    locked: false,
    opacity: 1,
    blendMode: 'source-over',
    x: 0,
    y: 0,
    width,
    height,
    canvas: titleCanvas,
    textData: {
      text: 'THE ARTISAN ROAST CO.',
      fontSize: 76,
      fontFamily: 'Playfair Display, serif',
      color: '#fef3c7',
      bold: true,
      italic: false,
    },
  };

  // Layer 4: Promotion & Location Info
  const subCanvas = createCanvas(width, height);
  const sCtx2 = subCanvas.getContext('2d')!;

  sCtx2.save();
  sCtx2.fillStyle = '#fed7aa';
  sCtx2.font = '500 24px "Segoe UI", sans-serif';
  sCtx2.fillText('Specialty Pour-Overs, Nitro Cold Brew & Freshly Baked Sourdough.', 100, 375);

  sCtx2.fillStyle = '#ffffff';
  drawRoundRect(sCtx2, 100, 435, 360, 64, 32);
  sCtx2.fill();

  sCtx2.fillStyle = '#451a03';
  sCtx2.font = '800 20px "Montserrat", sans-serif';
  sCtx2.fillText('CLAIM COMPLIMENTARY PASTRY', 125, 475);

  sCtx2.fillStyle = '#f59e0b';
  sCtx2.font = '600 18px "Segoe UI", monospace';
  sCtx2.fillText('📍 142 ROASTERY LANE • DOWNTOWN • OPEN 6:30 AM', 100, 545);
  sCtx2.restore();

  const subLayer: Layer = {
    id: 'coffee-sub',
    name: 'Opening Promotion & Address',
    type: 'text',
    visible: true,
    locked: false,
    opacity: 1,
    blendMode: 'source-over',
    x: 0,
    y: 0,
    width,
    height,
    canvas: subCanvas,
    textData: {
      text: 'SPECIALTY POUR-OVERS & NITRO COLD BREW',
      fontSize: 24,
      fontFamily: 'Segoe UI, sans-serif',
      color: '#fed7aa',
      bold: false,
      italic: false,
    },
  };

  return {
    layers: [bgLayer, sealLayer, titleLayer, subLayer],
    activeLayerId: 'coffee-title',
  };
}

// 8. Tech Conference / Webinar Banner (1200x630)
function createTechWebinarTemplate(): { layers: Layer[]; activeLayerId: string } {
  const width = 1200;
  const height = 630;

  // Layer 1: Dark Tech Blue Gradient
  const bgCanvas = createCanvas(width, height);
  const bgCtx = bgCanvas.getContext('2d')!;
  const bgGrad = bgCtx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#030712');
  bgGrad.addColorStop(0.5, '#0f172a');
  bgGrad.addColorStop(1, '#1e1b4b');
  bgCtx.fillStyle = bgGrad;
  bgCtx.fillRect(0, 0, width, height);

  // Soft electric cyan & violet ambient glow
  const ambient = bgCtx.createRadialGradient(width * 0.8, height * 0.3, 20, width * 0.8, height * 0.3, 460);
  ambient.addColorStop(0, 'rgba(59, 130, 246, 0.35)');
  ambient.addColorStop(1, 'rgba(59, 130, 246, 0)');
  bgCtx.fillStyle = ambient;
  bgCtx.fillRect(0, 0, width, height);

  const bgLayer: Layer = {
    id: 'webinar-bg',
    name: 'Cobalt Night Network Gradient',
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

  // Layer 2: Network Grid Lines & Tech Rings
  const gridCanvas = createCanvas(width, height);
  const gCtx = gridCanvas.getContext('2d')!;

  gCtx.save();
  gCtx.strokeStyle = 'rgba(56, 189, 248, 0.18)';
  gCtx.lineWidth = 1;

  // Concentric tech rings on right
  const rx = 950;
  const ry = 315;
  for (let r = 80; r <= 320; r += 60) {
    gCtx.beginPath();
    gCtx.arc(rx, ry, r, 0, Math.PI * 2);
    gCtx.stroke();
  }

  // Crosshairs
  gCtx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
  gCtx.beginPath();
  gCtx.moveTo(rx - 340, ry);
  gCtx.lineTo(rx + 340, ry);
  gCtx.moveTo(rx, ry - 340);
  gCtx.lineTo(rx, ry + 340);
  gCtx.stroke();

  // Floating nodes
  gCtx.fillStyle = '#38bdf8';
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2;
    const nx = rx + Math.cos(angle) * 200;
    const ny = ry + Math.sin(angle) * 200;
    gCtx.beginPath();
    gCtx.arc(nx, ny, 4, 0, Math.PI * 2);
    gCtx.fill();
  }
  gCtx.restore();

  const gridLayer: Layer = {
    id: 'webinar-grid',
    name: 'Cybernetic Tech Rings & Nodes',
    type: 'shape',
    visible: true,
    locked: false,
    opacity: 0.85,
    blendMode: 'source-over',
    x: 0,
    y: 0,
    width,
    height,
    canvas: gridCanvas,
  };

  // Layer 3: Live Masterclass Pill Tag
  const badgeCanvas = createCanvas(width, height);
  const bCtx = badgeCanvas.getContext('2d')!;

  bCtx.save();
  bCtx.fillStyle = 'rgba(16, 185, 129, 0.15)';
  bCtx.strokeStyle = '#10b981';
  bCtx.lineWidth = 1.5;
  drawRoundRect(bCtx, 90, 95, 290, 48, 24);
  bCtx.fill();
  bCtx.stroke();

  // Pulsing green dot
  bCtx.fillStyle = '#10b981';
  bCtx.beginPath();
  bCtx.arc(120, 119, 6, 0, Math.PI * 2);
  bCtx.fill();

  bCtx.fillStyle = '#34d399';
  bCtx.font = '800 16px "Montserrat", sans-serif';
  bCtx.fillText('FREE LIVE MASTERCLASS', 140, 125);
  bCtx.restore();

  const badgeLayer: Layer = {
    id: 'webinar-badge',
    name: 'Free Masterclass Pill Badge',
    type: 'raster',
    visible: true,
    locked: false,
    opacity: 1,
    blendMode: 'source-over',
    x: 0,
    y: 0,
    width,
    height,
    canvas: badgeCanvas,
  };

  // Layer 4: Main Headline Text
  const titleCanvas = createCanvas(width, height);
  const tCtx = titleCanvas.getContext('2d')!;

  tCtx.save();
  tCtx.textAlign = 'left';
  tCtx.textBaseline = 'top';
  tCtx.shadowColor = 'rgba(0, 0, 0, 0.8)';
  tCtx.shadowBlur = 20;
  tCtx.shadowOffsetY = 6;

  tCtx.fillStyle = '#ffffff';
  tCtx.font = '900 68px "Montserrat", sans-serif';
  tCtx.fillText('BUILDING CLOUD-SCALE', 90, 175);

  const cyanGrad = tCtx.createLinearGradient(90, 0, 600, 0);
  cyanGrad.addColorStop(0, '#38bdf8');
  cyanGrad.addColorStop(1, '#818cf8');
  tCtx.fillStyle = cyanGrad;
  tCtx.fillText('WEB APPLICATIONS', 90, 260);
  tCtx.restore();

  const titleLayer: Layer = {
    id: 'webinar-title',
    name: 'Headline: BUILDING CLOUD-SCALE',
    type: 'text',
    visible: true,
    locked: false,
    opacity: 1,
    blendMode: 'source-over',
    x: 0,
    y: 0,
    width,
    height,
    canvas: titleCanvas,
    textData: {
      text: 'BUILDING CLOUD-SCALE WEB APPLICATIONS',
      fontSize: 68,
      fontFamily: 'Montserrat, sans-serif',
      color: '#38bdf8',
      bold: true,
      italic: false,
    },
  };

  // Layer 5: Speaker Info, Tech Stack Badges & Register CTA
  const subCanvas = createCanvas(width, height);
  const sCtx = subCanvas.getContext('2d')!;

  sCtx.save();
  sCtx.fillStyle = '#94a3b8';
  sCtx.font = '600 22px "Segoe UI", sans-serif';
  sCtx.fillText('Architecture Patterns, Distributed State & High-Performance Rendering', 90, 360);

  // Tech tags
  const drawTag = (text: string, x: number) => {
    sCtx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    sCtx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    sCtx.lineWidth = 1;
    drawRoundRect(sCtx, x, 410, 140, 42, 21);
    sCtx.fill();
    sCtx.stroke();

    sCtx.fillStyle = '#e2e8f0';
    sCtx.font = '700 15px "Segoe UI", sans-serif';
    sCtx.textAlign = 'center';
    sCtx.fillText(text, x + 70, 436);
    sCtx.textAlign = 'left';
  };

  drawTag('TypeScript', 90);
  drawTag('React 19', 245);
  drawTag('Node / Vite', 400);
  drawTag('Cloud Run', 555);

  // CTA
  sCtx.fillStyle = '#38bdf8';
  drawRoundRect(sCtx, 90, 485, 260, 60, 30);
  sCtx.fill();

  sCtx.fillStyle = '#0f172a';
  sCtx.font = '800 18px "Montserrat", sans-serif';
  sCtx.fillText('REGISTER FREE ▶', 125, 522);

  sCtx.fillStyle = '#cbd5e1';
  sCtx.font = '600 17px "Segoe UI", sans-serif';
  sCtx.fillText('📅 Thursday, 2:00 PM EST • Includes Live Q&A and Source Code', 380, 522);
  sCtx.restore();

  const subLayer: Layer = {
    id: 'webinar-sub',
    name: 'Tech Badges & Registration CTA',
    type: 'text',
    visible: true,
    locked: false,
    opacity: 1,
    blendMode: 'source-over',
    x: 0,
    y: 0,
    width,
    height,
    canvas: subCanvas,
    textData: {
      text: 'REGISTER FREE ▶',
      fontSize: 18,
      fontFamily: 'Montserrat, sans-serif',
      color: '#0f172a',
      bold: true,
      italic: false,
    },
  };

  return {
    layers: [bgLayer, gridLayer, badgeLayer, titleLayer, subLayer],
    activeLayerId: 'webinar-title',
  };
}

// Master Template List
export const DESIGN_TEMPLATES: DesignTemplate[] = [
  {
    id: 'template-summer-sale',
    title: 'Summer Flash Sale (50% Off)',
    category: 'social',
    categoryLabel: 'Instagram Square (1:1)',
    width: 1080,
    height: 1080,
    description: 'Vibrant sunset gradient with frosted glass center card, 50% off sticker badge, bold typography and sparkling confetti.',
    tags: ['E-commerce', 'Flash Sale', 'Social Media', 'Summer', 'Discount'],
    accentColor: '#f97316',
    badgeText: '50% OFF',
    generateLayers: createSummerSaleTemplate,
  },
  {
    id: 'template-youtube-tech',
    title: 'YouTube Tech Vlog / Podcast',
    category: 'youtube',
    categoryLabel: 'YouTube Thumbnail (16:9)',
    width: 1280,
    height: 720,
    description: 'High-energy dark cyberpunk studio with dual neon cyan/magenta rim lighting, impact bold typography, and guest avatar frame.',
    tags: ['YouTube', 'Thumbnail', 'Podcast', 'Tech', 'Video'],
    accentColor: '#06b6d4',
    badgeText: '1280×720',
    generateLayers: createYouTubeTechTemplate,
  },
  {
    id: 'template-minimalist-quote',
    title: 'Minimalist Wisdom Quote',
    category: 'social',
    categoryLabel: 'Instagram Square (1:1)',
    width: 1080,
    height: 1080,
    description: 'Warm sandstone and terracotta aesthetic with elegant serif typography, arch silhouettes, and delicate hairline framing borders.',
    tags: ['Inspiration', 'Quotes', 'Artistic', 'Minimalist', 'Aesthetic'],
    accentColor: '#d97757',
    badgeText: 'Artistic',
    generateLayers: createMinimalistQuoteTemplate,
  },
  {
    id: 'template-mobile-story',
    title: 'Autumn Fashion Lookbook',
    category: 'story',
    categoryLabel: 'Story / Reel / TikTok (9:16)',
    width: 1080,
    height: 1920,
    description: 'Vertical mobile layout with rich rose-plum gradient, floating showcase photo card, chic typography, and swipe-up call-to-action.',
    tags: ['Mobile Story', 'Reels', 'TikTok', 'Fashion', 'Lookbook'],
    accentColor: '#db2777',
    badgeText: '9:16 Vertical',
    generateLayers: createMobileStoryTemplate,
  },
  {
    id: 'template-cyberpunk-poster',
    title: 'Cyberpunk Synthwave Night',
    category: 'poster',
    categoryLabel: 'Event Poster (2:3)',
    width: 800,
    height: 1200,
    description: 'Obsidian 3D wireframe perspective floor, glowing neon synthwave sun, laser beams, and futuristic festival lineup flyer.',
    tags: ['Event', 'Poster', 'Music', 'Synthwave', 'Club'],
    accentColor: '#ec4899',
    badgeText: 'Live Music',
    generateLayers: createCyberpunkPosterTemplate,
  },
  {
    id: 'template-fitness-motivation',
    title: 'Daily Fitness Challenge',
    category: 'social',
    categoryLabel: 'Instagram Square (1:1)',
    width: 1080,
    height: 1080,
    description: 'High-energy emerald green with dynamic speed cutouts, high-impact typography, workout stats metrics, and action badge.',
    tags: ['Fitness', 'Workout', 'Health', 'Motivation', 'Gym'],
    accentColor: '#10b981',
    badgeText: '30-Day',
    generateLayers: createFitnessTemplate,
  },
  {
    id: 'template-coffee-banner',
    title: 'Artisan Coffee Roasters',
    category: 'banner',
    categoryLabel: 'Social / Web Banner (1.91:1)',
    width: 1200,
    height: 630,
    description: 'Rich roasted espresso and amber palette with vintage stamp seal, aroma steam trails, and grand opening announcement.',
    tags: ['Food & Drink', 'Coffee', 'Cafe', 'Banner', 'Opening'],
    accentColor: '#f59e0b',
    badgeText: 'Artisan',
    generateLayers: createCoffeeBannerTemplate,
  },
  {
    id: 'template-tech-webinar',
    title: 'Cloud Architecture Masterclass',
    category: 'banner',
    categoryLabel: 'Marketing Banner (1.91:1)',
    width: 1200,
    height: 630,
    description: 'Clean modern cobalt tech banner with cybernetic rings, live event indicator badge, tech stack tags, and register button.',
    tags: ['Webinar', 'Tech', 'Conference', 'Cloud', 'Developer'],
    accentColor: '#38bdf8',
    badgeText: 'Free Webinar',
    generateLayers: createTechWebinarTemplate,
  },
];
