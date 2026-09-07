import { ColorPalette } from '../types';

export interface PaletteDefinition {
  id: ColorPalette;
  name: string;
  colors: number[];
  hexStrings: string[];
  bg: number;
}

export const PALETTES: Record<ColorPalette, PaletteDefinition> = {
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    colors: [0xff007f, 0x00f0ff, 0xffe600, 0x7928ca, 0x00ff88],
    hexStrings: ['#ff007f', '#00f0ff', '#ffe600', '#7928ca', '#00ff88'],
    bg: 0x0b0d17,
  },
  nebula: {
    id: 'nebula',
    name: 'Nebula',
    colors: [0x8b5cf6, 0xec4899, 0x3b82f6, 0x6366f1, 0xa855f7],
    hexStrings: ['#8b5cf6', '#ec4899', '#3b82f6', '#6366f1', '#a855f7'],
    bg: 0x070714,
  },
  solar: {
    id: 'solar',
    name: 'Solar Flare',
    colors: [0xff3b30, 0xff9500, 0xffcc00, 0xff2d55, 0xff7a00],
    hexStrings: ['#ff3b30', '#ff9500', '#ffcc00', '#ff2d55', '#ff7a00'],
    bg: 0x140705,
  },
  aurora: {
    id: 'aurora',
    name: 'Aurora Borealis',
    colors: [0x10b981, 0x06b6d4, 0x3b82f6, 0x34d399, 0x6ee7b7],
    hexStrings: ['#10b981', '#06b6d4', '#3b82f6', '#34d399', '#6ee7b7'],
    bg: 0x041113,
  },
  electric: {
    id: 'electric',
    name: 'Electric Neon',
    colors: [0x38bdf8, 0x818cf8, 0xc084fc, 0xf472b6, 0x22d3ee],
    hexStrings: ['#38bdf8', '#818cf8', '#c084fc', '#f472b6', '#22d3ee'],
    bg: 0x090d16,
  },
};
