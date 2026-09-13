import { BubbleStyleId, SeasonalThemeId } from '../types';

export interface SeasonalTheme {
  id: SeasonalThemeId;
  name: string;
  seasonLabel: string;
  tagline: string;
  icon: string;
  drinkSpecial: string;
  bgGradient: string;
  containerBg: string;
  headerBg: string;
  accentColor: string;
  badgeBg: string;
  borderTone: string;
  textPrimary: string;
  textSecondary: string;
  ambientParticle: string; // emoji for gentle seasonal floating ambient
}

export const SEASONAL_THEMES: Record<SeasonalThemeId, SeasonalTheme> = {
  autumn: {
    id: 'autumn',
    name: 'Autumn Spice',
    seasonLabel: 'Fall Harvest & Cinnamon',
    tagline: 'Crisp amber air, falling maple leaves & spiced pumpkin lattes',
    icon: '🍂',
    drinkSpecial: 'Toasted Pumpkin & Pecan Mocha',
    bgGradient: 'from-[#231710] via-[#2f1f16] to-[#1a110b]',
    containerBg: 'bg-[#2b1c14]/90',
    headerBg: 'bg-[#382318]/90',
    accentColor: '#e07a38',
    badgeBg: 'bg-amber-900/50 text-amber-200 border-amber-700/40',
    borderTone: 'border-[#5a3622]/40',
    textPrimary: 'text-[#fbf4ea]',
    textSecondary: 'text-[#d6beaa]',
    ambientParticle: '🍁',
  },
  spring: {
    id: 'spring',
    name: 'Spring Blossom',
    seasonLabel: 'Sakura & Green Tea Season',
    tagline: 'Gentle cherry blossoms, fresh matcha harvest & morning dew',
    icon: '🌸',
    drinkSpecial: 'Sakura Foam Ceremonial Matcha',
    bgGradient: 'from-[#1e231e] via-[#242b24] to-[#151915]',
    containerBg: 'bg-[#222923]/90',
    headerBg: 'bg-[#2c352d]/90',
    accentColor: '#e6739f',
    badgeBg: 'bg-pink-950/50 text-pink-200 border-pink-700/40',
    borderTone: 'border-[#435445]/40',
    textPrimary: 'text-[#f5f9f5]',
    textSecondary: 'text-[#bfd3c2]',
    ambientParticle: '🌸',
  },
  summer: {
    id: 'summer',
    name: 'Summer Patio',
    tagline: 'Sunlit awning, chilled cold brew, and refreshing citrus spritzers',
    seasonLabel: 'Sunny Days & Cold Brew',
    icon: '☀️',
    drinkSpecial: 'Yuzu Sparkling Espresso Tonic',
    bgGradient: 'from-[#1c222b] via-[#202935] to-[#12161c]',
    containerBg: 'bg-[#212b37]/90',
    headerBg: 'bg-[#2b3746]/90',
    accentColor: '#38bdf8',
    badgeBg: 'bg-sky-950/50 text-sky-200 border-sky-700/40',
    borderTone: 'border-[#384b60]/40',
    textPrimary: 'text-[#f0f6fc]',
    textSecondary: 'text-[#b0c4de]',
    ambientParticle: '✨',
  },
  winter: {
    id: 'winter',
    name: 'Cozy Winter',
    seasonLabel: 'Hearthside Frost & Cocoa',
    tagline: 'Snow-dusted windowpanes, crackling hearth & dark rich roasts',
    icon: '❄️',
    drinkSpecial: 'Marshmallow Peppermint Dark Cocoa',
    bgGradient: 'from-[#181a20] via-[#1d212a] to-[#111317]',
    containerBg: 'bg-[#1e232d]/90',
    headerBg: 'bg-[#272e3b]/90',
    accentColor: '#93c5fd',
    badgeBg: 'bg-indigo-950/50 text-indigo-200 border-indigo-700/40',
    borderTone: 'border-[#3f4b5e]/40',
    textPrimary: 'text-[#f8fafc]',
    textSecondary: 'text-[#cbd5e1]',
    ambientParticle: '❄️',
  },
};

export interface BubbleStyleConfig {
  id: BubbleStyleId;
  name: string;
  icon: string;
  description: string;
  selfClasses: string;
  otherClasses: string;
  accentBorder: string;
  tailShape: string;
}

export const BUBBLE_STYLES: Record<BubbleStyleId, BubbleStyleConfig> = {
  ceramic: {
    id: 'ceramic',
    name: 'Café Ceramic',
    icon: '☕',
    description: 'Classic porcelain glaze with refined bevel and gentle warmth.',
    selfClasses: 'bg-[#faf6f0] text-[#2c1d11] border border-[#e6d8c3] shadow-md shadow-amber-950/10',
    otherClasses: 'bg-[#f5ede0] text-[#2c1d11] border border-[#dfceb6] shadow-sm',
    accentBorder: 'border-amber-300/40',
    tailShape: 'rounded-2xl rounded-br-xs',
  },
  latte: {
    id: 'latte',
    name: 'Latte Foam Art',
    icon: '🍮',
    description: 'Velvety crema froth gradient with warm caramel highlights.',
    selfClasses: 'bg-gradient-to-br from-[#fff7ed] via-[#ffedd5] to-[#fed7aa] text-[#431407] border border-[#fdba74] shadow-md shadow-orange-950/15',
    otherClasses: 'bg-gradient-to-br from-[#fbf4eb] to-[#f3e3ce] text-[#451a03] border border-[#e8ceb5] shadow-sm',
    accentBorder: 'border-orange-300',
    tailShape: 'rounded-2xl rounded-tr-xs',
  },
  matcha: {
    id: 'matcha',
    name: 'Matcha Froth',
    icon: '🍵',
    description: 'Refreshing organic tea green with soft botanical borders.',
    selfClasses: 'bg-gradient-to-br from-[#f0fdf4] to-[#dcfce7] text-[#14532d] border border-[#86efac] shadow-md shadow-emerald-950/15',
    otherClasses: 'bg-gradient-to-br from-[#f2f9f3] to-[#e1efe3] text-[#164e28] border border-[#bbf0cb] shadow-sm',
    accentBorder: 'border-emerald-400',
    tailShape: 'rounded-2xl rounded-bl-xs',
  },
  parchment: {
    id: 'parchment',
    name: 'Vintage Parchment',
    icon: '📜',
    description: 'Antique cafe ledger paper with coffee ring stamp feel.',
    selfClasses: 'bg-[#fbf3db] text-[#3e2c1c] border-2 border-dashed border-[#d5be9b] font-serif shadow-sm tracking-wide',
    otherClasses: 'bg-[#f4ebd0] text-[#3e2c1c] border-2 border-dashed border-[#cbb38e] font-serif shadow-sm',
    accentBorder: 'border-amber-700/50',
    tailShape: 'rounded-xl',
  },
  espresso: {
    id: 'espresso',
    name: 'Dark Roast Espresso',
    icon: '🖤',
    description: 'Deep midnight mocha roast with glowing warm amber typography.',
    selfClasses: 'bg-[#211612] text-[#fed7aa] border border-[#78350f]/60 shadow-lg shadow-black/40',
    otherClasses: 'bg-[#291e18] text-[#ffedd5] border border-[#522509]/50 shadow-md',
    accentBorder: 'border-amber-500',
    tailShape: 'rounded-2xl rounded-br-xs',
  },
  cozyknit: {
    id: 'cozyknit',
    name: 'Warm Wool Knit',
    icon: '🧶',
    description: 'Handcrafted cinnamon stitch border with warm wool texture.',
    selfClasses: 'bg-[#ffedd5] text-[#7c2d12] border-2 border-dotted border-[#ea580c]/50 shadow-md',
    otherClasses: 'bg-[#fae8d2] text-[#7c2d12] border-2 border-dotted border-[#d97706]/40 shadow-sm',
    accentBorder: 'border-orange-500',
    tailShape: 'rounded-3xl',
  },
  boba: {
    id: 'boba',
    name: 'Boba Sweet Pearl',
    icon: '🧋',
    description: 'Playful pastel milk tea tone with soft pillowy curves.',
    selfClasses: 'bg-gradient-to-r from-[#ffe4e6] to-[#fce7f3] text-[#831843] border border-[#f472b6]/60 shadow-md shadow-pink-950/15',
    otherClasses: 'bg-gradient-to-r from-[#fae8ea] to-[#f5e1ed] text-[#701a3c] border border-[#f9a8d4]/40 shadow-sm',
    accentBorder: 'border-pink-400',
    tailShape: 'rounded-3xl',
  },
};
