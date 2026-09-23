import { ToolType } from "../types";

/**
 * Generates custom SVG cursors with exact tip hotspots for all whiteboard tools:
 * - Fountain Pen: Calligraphy gold nib, ink breather hole, and reservoir window
 * - Sketch Pencil: Hexagonal yellow wooden pencil with sharpened graphite tip and eraser
 * - Ballpoint Pen: Modern ergonomic rollerball pen with chrome cone and tungsten ball tip
 * - Highlighter: Vibrant angled chisel tip with transparent pigment reservoir
 * - Eraser: Classic beveled pink rubber eraser with blue protective cardboard band
 * - Laser Pen: Sleek metallic presenter pointer with bright ruby laser aperture
 *
 * NOTE: CSS cursors in Chromium and WebKit do NOT support SVG filters (<filter>, <feDropShadow>).
 * We use crisp dual-layer high-contrast vector outlines for universal browser compatibility.
 */

function svgToCursorUrl(svgString: string, hotX: number, hotY: number, fallback: string = "crosshair"): string {
  const cleanSvg = svgString.trim().replace(/[\r\n\t]+/g, " ").replace(/\s{2,}/g, " ");
  const encoded = encodeURIComponent(cleanSvg);
  return `url("data:image/svg+xml;charset=utf-8,${encoded}") ${hotX} ${hotY}, ${fallback}`;
}

// 1. FOUNTAIN PEN (Nib Tip at 2, 2)
export function getFountainPenCursor(color: string = "#1e3a8a"): string {
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
  <defs>
    <linearGradient id="fp-gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FEF08A"/>
      <stop offset="45%" stop-color="#EAB308"/>
      <stop offset="85%" stop-color="#CA8A04"/>
      <stop offset="100%" stop-color="#854D0E"/>
    </linearGradient>
    <linearGradient id="fp-barrel" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#334155"/>
      <stop offset="40%" stop-color="#0F172A"/>
      <stop offset="100%" stop-color="#020617"/>
    </linearGradient>
  </defs>
  <g>
    <!-- Crisp High-Contrast Outer Silhouette -->
    <path d="M 2 2 L 8 11 L 11 10 L 25 24 L 28 22 L 30 26 L 26 30 L 22 28 L 24 25 L 10 11 L 11 8 Z" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
    <path d="M 2 2 L 8 11 L 11 10 L 25 24 L 28 22 L 30 26 L 26 30 L 22 28 L 24 25 L 10 11 L 11 8 Z" fill="none" stroke="#000000" stroke-width="1.2" stroke-linejoin="round" stroke-linecap="round"/>

    <!-- Fountain Pen Body Barrel -->
    <path d="M 10 10 L 25 25 L 28 22 L 22 28 L 10 10 Z" fill="url(#fp-barrel)"/>

    <!-- Gold Accent Ring -->
    <path d="M 9 11 L 11 9 L 13 11 L 11 13 Z" fill="#FACC15" stroke="#A16207" stroke-width="0.6"/>

    <!-- Dynamic Ink Viewing Window -->
    <circle cx="16" cy="16" r="2.2" fill="${color}" stroke="#FFFFFF" stroke-width="0.8"/>

    <!-- Gold Calligraphy Nib Wing -->
    <path d="M 2 2 L 8 10 L 10 8 Z" fill="url(#fp-gold)" stroke="#713F12" stroke-width="0.6"/>

    <!-- Center Inlaid Steel Blade -->
    <path d="M 2 2 L 5 8 L 8 5 Z" fill="#E2E8F0" opacity="0.95"/>

    <!-- Nib Breather Hole & Ink Slit to Needle Point -->
    <circle cx="6.5" cy="6.5" r="1.1" fill="#0F172A"/>
    <line x1="2" y1="2" x2="6.5" y2="6.5" stroke="#713F12" stroke-width="0.8" stroke-linecap="round"/>

    <!-- Active Ink Micro-Drop at Precision Point (2, 2) -->
    <circle cx="2" cy="2" r="1.2" fill="${color}" stroke="#FFFFFF" stroke-width="0.5"/>
  </g>
</svg>
`.trim();

  return svgToCursorUrl(svg, 2, 2, "crosshair");
}

// 2. SKETCH PENCIL (Graphite Point at 2, 2)
export function getPencilCursor(): string {
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
  <defs>
    <linearGradient id="pen-wood" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFEDD5"/>
      <stop offset="60%" stop-color="#FED7AA"/>
      <stop offset="100%" stop-color="#FDBA74"/>
    </linearGradient>
    <linearGradient id="pen-yellow" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#D97706"/>
      <stop offset="40%" stop-color="#F59E0B"/>
      <stop offset="85%" stop-color="#FBBF24"/>
      <stop offset="100%" stop-color="#FEF08A"/>
    </linearGradient>
  </defs>
  <g>
    <!-- Crisp High-Contrast Outer Silhouette -->
    <path d="M 2 2 L 8 4 L 23 19 L 27 23 L 30 27 L 27 30 L 23 27 L 19 23 L 4 8 Z" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
    <path d="M 2 2 L 8 4 L 23 19 L 27 23 L 30 27 L 27 30 L 23 27 L 19 23 L 4 8 Z" fill="none" stroke="#000000" stroke-width="1.2" stroke-linejoin="round" stroke-linecap="round"/>

    <!-- Yellow Hexagonal Wooden Barrel -->
    <path d="M 7 7 L 21 21 L 24 24 L 20 26 L 6 9 Z" fill="url(#pen-yellow)" stroke="#B45309" stroke-width="0.6"/>
    <!-- Facet Highlight Line -->
    <line x1="7" y1="8" x2="22" y2="23" stroke="#FEF3C7" stroke-width="1.0" stroke-linecap="round"/>

    <!-- Sharpened Natural Wood Cone -->
    <path d="M 2 2 L 7 7 L 6 9 L 4 8 Z" fill="url(#pen-wood)" stroke="#CA8A04" stroke-width="0.6"/>

    <!-- 2B Graphite Lead Needle Tip at (2, 2) -->
    <path d="M 2 2 L 4.5 4.5 L 4 5.2 L 2 2 Z" fill="#18181B" stroke="#09090B" stroke-width="0.6"/>

    <!-- Aluminum Ferrule Band -->
    <path d="M 21 21 L 24 24 L 25.5 22.5 L 22.5 19.5 Z" fill="#E2E8F0" stroke="#64748B" stroke-width="0.6"/>

    <!-- Classic Pink Rubber Eraser Cap -->
    <path d="M 24 24 L 27 27 C 28.5 28.5 28.5 29.5 27.5 30.5 C 26.5 31.5 25.5 31.5 24 30 L 21 27 Z" fill="#FB7185" stroke="#E11D48" stroke-width="0.7"/>

    <!-- Lead Tip Point (2, 2) -->
    <circle cx="2" cy="2" r="1.1" fill="#09090B" stroke="#FFFFFF" stroke-width="0.5"/>
  </g>
</svg>
`.trim();

  return svgToCursorUrl(svg, 2, 2, "crosshair");
}

// 3. BALLPOINT PEN (Roller Tip at 2, 2)
export function getBallpointCursor(color: string = "#2563eb"): string {
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
  <defs>
    <linearGradient id="bp-chrome" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="50%" stop-color="#E2E8F0"/>
      <stop offset="100%" stop-color="#94A3B8"/>
    </linearGradient>
    <linearGradient id="bp-barrel" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#60A5FA"/>
      <stop offset="40%" stop-color="#2563EB"/>
      <stop offset="85%" stop-color="#1D4ED8"/>
      <stop offset="100%" stop-color="#1E3A8A"/>
    </linearGradient>
  </defs>
  <g>
    <!-- Crisp High-Contrast Outline -->
    <path d="M 2 2 L 6 7 L 9 8 L 25 24 L 28 27 L 27 29 L 24 28 L 8 9 L 7 6 Z" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
    <path d="M 2 2 L 6 7 L 9 8 L 25 24 L 28 27 L 27 29 L 24 28 L 8 9 L 7 6 Z" fill="none" stroke="#000000" stroke-width="1.2" stroke-linejoin="round" stroke-linecap="round"/>

    <!-- Pen Barrel -->
    <path d="M 9 9 L 25 25 L 28 22 L 22 28 L 9 9 Z" fill="url(#bp-barrel)" stroke="#1E3A8A" stroke-width="0.6"/>
    <!-- Specular Highlight Streak -->
    <line x1="10" y1="10" x2="24" y2="24" stroke="rgba(255,255,255,0.6)" stroke-width="1.0" stroke-linecap="round"/>

    <!-- Ergonomic Ribbed Grip -->
    <path d="M 6 6 L 11 11 L 10 12 L 5 7 Z" fill="#1E293B" stroke="#0F172A" stroke-width="0.6"/>
    <line x1="7.5" y1="8.5" x2="9.5" y2="10.5" stroke="#475569" stroke-width="0.7"/>

    <!-- Chrome Conical Tip Cone -->
    <path d="M 2 2 L 6 6 L 5 7 L 2 2 Z" fill="url(#bp-chrome)" stroke="#64748B" stroke-width="0.6"/>

    <!-- Color Accent Top Clicker -->
    <circle cx="26.5" cy="26.5" r="2.2" fill="${color}" stroke="#FFFFFF" stroke-width="0.8"/>

    <!-- Precision Tungsten Ball Point at (2, 2) -->
    <circle cx="2" cy="2" r="1.2" fill="#0F172A" stroke="#FFFFFF" stroke-width="0.6"/>
  </g>
</svg>
`.trim();

  return svgToCursorUrl(svg, 2, 2, "crosshair");
}

// 4. HIGHLIGHTER (Chisel Tip at 2, 2)
export function getHighlighterCursor(color: string = "#facc15"): string {
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
  <defs>
    <linearGradient id="hl-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FEF08A"/>
      <stop offset="50%" stop-color="${color}"/>
      <stop offset="100%" stop-color="#CA8A04"/>
    </linearGradient>
  </defs>
  <g>
    <!-- Crisp High-Contrast Outline -->
    <path d="M 2 2 L 8 3 L 12 8 L 26 22 L 28 27 L 27 29 L 22 28 L 8 12 L 3 8 Z" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
    <path d="M 2 2 L 8 3 L 12 8 L 26 22 L 28 27 L 27 29 L 22 28 L 8 12 L 3 8 Z" fill="none" stroke="#000000" stroke-width="1.2" stroke-linejoin="round" stroke-linecap="round"/>

    <!-- Flat Wide Highlighter Body -->
    <path d="M 9 9 L 24 24 L 28 20 L 20 28 L 9 9 Z" fill="#F8FAFC" stroke="#64748B" stroke-width="0.7"/>

    <!-- Vibrant Color Barrel Window -->
    <path d="M 12 12 L 20 20 L 23 17 L 15 9 Z" fill="${color}" opacity="0.9" stroke="#FFFFFF" stroke-width="0.5"/>

    <!-- Black Chisel Collar -->
    <path d="M 6 6 L 10 10 L 9 11 L 5 7 Z" fill="#0F172A" stroke="#020617" stroke-width="0.6"/>

    <!-- Distinctive Angled Neon Chisel Tip at (2, 2) -->
    <path d="M 2 2 L 6 3 L 7 7 L 3 6 Z" fill="url(#hl-grad)" stroke="#A16207" stroke-width="0.8"/>

    <!-- Fluorescent Highlight Ridge Line -->
    <line x1="2" y1="2" x2="6" y2="3" stroke="#FFFFFF" stroke-width="1.0" stroke-linecap="round"/>

    <!-- Tip Point at (2, 2) -->
    <circle cx="2" cy="2" r="1.2" fill="${color}" stroke="#000000" stroke-width="0.5"/>
  </g>
</svg>
`.trim();

  return svgToCursorUrl(svg, 2, 2, "crosshair");
}

// 5. ERASER (Erasing Corner at 4, 4)
export function getEraserCursor(): string {
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
  <defs>
    <linearGradient id="er-pink" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FECDD3"/>
      <stop offset="40%" stop-color="#FB7185"/>
      <stop offset="100%" stop-color="#F43F5E"/>
    </linearGradient>
    <linearGradient id="er-sleeve" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3B82F6"/>
      <stop offset="100%" stop-color="#1D4ED8"/>
    </linearGradient>
  </defs>
  <g>
    <!-- Crisp High-Contrast Outline -->
    <path d="M 4 4 L 14 2 L 29 17 L 17 29 L 2 14 Z" fill="none" stroke="#FFFFFF" stroke-width="3.2" stroke-linejoin="round" stroke-linecap="round"/>
    <path d="M 4 4 L 14 2 L 29 17 L 17 29 L 2 14 Z" fill="none" stroke="#000000" stroke-width="1.2" stroke-linejoin="round" stroke-linecap="round"/>

    <!-- Pink Vinyl Eraser Block -->
    <path d="M 4 4 L 14 2 L 29 17 L 17 29 L 2 14 Z" fill="url(#er-pink)" stroke="#E11D48" stroke-width="0.8"/>

    <!-- 3D Beveled Side Facet -->
    <path d="M 2 14 L 17 29 L 14 30 L 2 16 Z" fill="#9F1239" opacity="0.4"/>

    <!-- Protective Cardboard Sleeve Wrap -->
    <path d="M 10 10 L 21 21 L 27 15 L 16 4 Z" fill="url(#er-sleeve)" stroke="#1E40AF" stroke-width="0.7"/>
    <!-- Sleeve White Brand Stripe -->
    <line x1="12" y1="12" x2="23" y2="23" stroke="#FFFFFF" stroke-width="1.6" stroke-linecap="round"/>

    <!-- Active Erasing Corner Indicator at (4, 4) -->
    <circle cx="4" cy="4" r="1.8" fill="#FFFFFF" stroke="#E11D48" stroke-width="0.8"/>
  </g>
</svg>
`.trim();

  return svgToCursorUrl(svg, 4, 4, "crosshair");
}

// 6. LASER PEN (Ruby Starburst Dot at 2, 2)
export function getLaserPointerCursor(): string {
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
  <defs>
    <linearGradient id="lp-metal" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#94A3B8"/>
      <stop offset="35%" stop-color="#334155"/>
      <stop offset="100%" stop-color="#0F172A"/>
    </linearGradient>
    <radialGradient id="lp-ruby" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="35%" stop-color="#FF2A55"/>
      <stop offset="75%" stop-color="#EF4444"/>
      <stop offset="100%" stop-color="#991B1B"/>
    </radialGradient>
  </defs>
  <g>
    <!-- Crisp High-Contrast Outline -->
    <path d="M 5 5 L 9 11 L 25 27 L 29 25 L 27 29 L 11 9 Z" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
    <path d="M 5 5 L 9 11 L 25 27 L 29 25 L 27 29 L 11 9 Z" fill="none" stroke="#000000" stroke-width="1.2" stroke-linejoin="round" stroke-linecap="round"/>

    <!-- Matte Metal Pen Body -->
    <path d="M 7 7 L 24 24 L 27 21 L 21 27 L 7 7 Z" fill="url(#lp-metal)" stroke="#0F172A" stroke-width="0.8"/>
    <!-- Chrome Pocket Clip Highlight -->
    <line x1="12" y1="12" x2="23" y2="23" stroke="#E2E8F0" stroke-width="1.0" stroke-linecap="round"/>

    <!-- Brass Aperture Bezel -->
    <path d="M 5 5 L 8 8 L 7 9 L 4 6 Z" fill="#F59E0B" stroke="#B45309" stroke-width="0.6"/>

    <!-- Red Laser On Button Indicator -->
    <circle cx="16" cy="16" r="1.5" fill="#EF4444" stroke="#FFFFFF" stroke-width="0.6"/>

    <!-- Radiant Ruby Laser Beam Dot at (2, 2) -->
    <circle cx="2" cy="2" r="3.2" fill="url(#lp-ruby)"/>
    <circle cx="2" cy="2" r="1.2" fill="#FFFFFF"/>

    <!-- Crosshair Flare Rays -->
    <line x1="2" y1="0" x2="2" y2="4" stroke="#FF4D6D" stroke-width="0.8"/>
    <line x1="0" y1="2" x2="4" y2="2" stroke="#FF4D6D" stroke-width="0.8"/>
  </g>
</svg>
`.trim();

  return svgToCursorUrl(svg, 2, 2, "crosshair");
}

/**
 * Returns the exact CSS cursor property value based on active tool and ink color.
 */
export function getToolCursor(tool: ToolType, color: string = "#1e3a8a"): string {
  switch (tool) {
    case "fountain-pen":
      return getFountainPenCursor(color);
    case "sketch-pencil":
      return getPencilCursor();
    case "ballpoint":
      return getBallpointCursor(color);
    case "marker-highlighter":
      return getHighlighterCursor(color);
    case "eraser":
      return getEraserCursor();
    case "laser-pointer":
      return getLaserPointerCursor();
    case "hand-pan":
      return "grab";
    default:
      return "crosshair";
  }
}
