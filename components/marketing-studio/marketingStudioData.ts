export interface CarouselCard {
  id: string;
  title: string;
  subtitle?: string;
  badge: string;
  badgeIcon: string; // lucide icon identifier
  tagColor: string;
  bgGradient: string;
  borderColor: string;
  accentColor: string;
  type: 'product' | 'motion' | 'ads' | 'posters' | 'marketplace';
  promptSuggestion: string;
  stylePreset: string;
  ratio: string;
  visualTheme: 'fizzo' | 'biojus' | 'vessel' | 'chase' | 'plush';
  videoUrl: string;
}

export const SHOWCASE_CARDS: CarouselCard[] = [
  {
    id: 'biojus',
    title: 'BIOJUS',
    subtitle: 'Cellular Hydration Formula',
    badge: 'PRODUCT SHOT',
    badgeIcon: 'Box',
    tagColor: 'bg-amber-400/20 text-amber-300 border-amber-400/30',
    bgGradient: 'from-[#1b2604] via-[#2d3e09] to-[#0c1402]',
    borderColor: 'border-lime-500/30',
    accentColor: '#B6E324',
    type: 'product',
    promptSuggestion: 'Luxury amber glass elixir bottle floating in effervescent lime liquid droplets, macro studio lighting, raytracing caustic reflections',
    stylePreset: 'Commercial Packshot',
    ratio: '3:4',
    visualTheme: 'biojus',
    videoUrl: '/vid/marketing-studio-slider-poster-Product.mp4',
  },
  {
    id: 'vessel',
    title: 'VESSEL',
    subtitle: 'Artisanal Chili Crunch',
    badge: 'MOTION',
    badgeIcon: 'Play',
    tagColor: 'bg-blue-400/20 text-blue-300 border-blue-400/30',
    bgGradient: 'from-[#071d49] via-[#0f347d] to-[#040e24]',
    borderColor: 'border-blue-400/40',
    accentColor: '#38BDF8',
    type: 'motion',
    promptSuggestion: 'Spherical crystal glass bowl suspended in mid-air with golden tortilla crisps and glowing red bird-eye chili, cinematic ocean blue studio rim light',
    stylePreset: 'Dynamic Motion',
    ratio: '3:4',
    visualTheme: 'vessel',
    videoUrl: '/vid/marketing-studio-slider-poster-UGC.mp4',
  },
  {
    id: 'fizzo',
    title: 'CITRUS FIZZO',
    subtitle: 'Sparkling Zest & Botanicals',
    badge: 'ADS',
    badgeIcon: 'Megaphone',
    tagColor: 'bg-emerald-400/30 text-emerald-200 border-emerald-400/50',
    bgGradient: 'from-[#42b84f] via-[#52c95e] to-[#2e9c3a]',
    borderColor: 'border-lime-400/60 shadow-[0_0_35px_rgba(82,201,94,0.35)]',
    accentColor: '#FF2E93',
    type: 'ads',
    promptSuggestion: 'Chilled crimson soda can with sparkling micro-condensation beads, surrounded by explosive 3D comic starburst, vibrant lime background, high-converting social ad',
    stylePreset: 'Vibrant Pop Ad',
    ratio: '3:4',
    visualTheme: 'fizzo',
    videoUrl: '/vid/marketing-studio-slider-poster-Ads.mp4',
  },
  {
    id: 'chase',
    title: 'CHASE THE DREAM',
    subtitle: 'Concert & Fashion Editorial',
    badge: 'POSTERS',
    badgeIcon: 'Layout',
    tagColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    bgGradient: 'from-[#3a0614] via-[#630b22] to-[#120106]',
    borderColor: 'border-rose-500/30',
    accentColor: '#FF3366',
    type: 'posters',
    promptSuggestion: 'Avant-garde fashion editorial model illuminated by red chromatic aberration and neon light trails, bold kinetic typography, high-fashion poster',
    stylePreset: 'Editorial Poster',
    ratio: '3:4',
    visualTheme: 'chase',
    videoUrl: '/vid/marketing-studio-slider-poster-poster.mp4',
  },
  {
    id: 'plush',
    title: 'my Body Wash',
    subtitle: 'plush botanical softness',
    badge: 'MARKETPLACE',
    badgeIcon: 'ShoppingBag',
    tagColor: 'bg-purple-400/20 text-purple-300 border-purple-400/30',
    bgGradient: 'from-[#2a1b4e] via-[#432d73] to-[#140b28]',
    borderColor: 'border-purple-400/30',
    accentColor: '#C084FC',
    type: 'marketplace',
    promptSuggestion: 'Pastel lilac cosmetic pump bottle resting on ethereal foamy clouds and iridescent soap bubbles, soft morning diffused ambient light, Amazon marketplace hero shot',
    stylePreset: 'Ecommerce Marketplace',
    ratio: '3:4',
    visualTheme: 'plush',
    videoUrl: '/vid/marketing-studio-slider-poster-Marketplace.mp4',
  },
];

export interface DemoProduct {
  id: string;
  name: string;
  category: string;
  image: string;
  badge: string;
  colors: string[];
}

export const DEMO_PRODUCTS: DemoProduct[] = [
  {
    id: 'p1',
    name: 'Fizzo Sparkling Soda',
    category: 'Beverage & Snacks',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&auto=format&fit=crop&q=80',
    badge: 'Bestseller',
    colors: ['#FF3366', '#52C95E'],
  },
  {
    id: 'p2',
    name: 'BioJus Luminous Serum',
    category: 'Beauty & Skincare',
    image: 'https://images.unsplash.com/photo-1608248597359-57e335272a8c?w=500&auto=format&fit=crop&q=80',
    badge: 'Trending',
    colors: ['#EAB308', '#22C55E'],
  },
  {
    id: 'p3',
    name: 'Plush Hydrating Body Wash',
    category: 'Personal Care',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=80',
    badge: 'Eco Luxe',
    colors: ['#C084FC', '#818CF8'],
  },
  {
    id: 'p4',
    name: 'Vessel Artisan Crunch',
    category: 'Gourmet Food',
    image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=500&auto=format&fit=crop&q=80',
    badge: 'Award Winner',
    colors: ['#FB923C', '#38BDF8'],
  },
  {
    id: 'p5',
    name: 'Obsidian Pure Parfum',
    category: 'Luxury Fragrance',
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=500&auto=format&fit=crop&q=80',
    badge: 'Ultra Premium',
    colors: ['#18181B', '#F59E0B'],
  },
  {
    id: 'p6',
    name: 'AeroPulse Wireless Earbuds',
    category: 'Consumer Tech',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=80',
    badge: 'New Gen',
    colors: ['#38BDF8', '#6366F1'],
  },
];

export interface DemoAvatar {
  id: string;
  name: string;
  role: string;
  vibe: string;
  avatarUrl: string;
  badge: string;
}

export const DEMO_AVATARS: DemoAvatar[] = [
  {
    id: 'av1',
    name: 'Maya Lin',
    role: 'UGC Creator',
    vibe: 'Relatable, energetic, TikTok viral style',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
    badge: 'Top UGC',
  },
  {
    id: 'av2',
    name: 'Elena Rostova',
    role: 'Luxury Fashion Model',
    vibe: 'High-end editorial, elegant, minimalist',
    avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&auto=format&fit=crop&q=80',
    badge: 'Editorial',
  },
  {
    id: 'av3',
    name: 'Jordan Chase',
    role: 'Tech & Fitness Creator',
    vibe: 'Modern lifestyle, dynamic, cinematic',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
    badge: 'Tech / Fit',
  },
  {
    id: 'av4',
    name: 'Kenji Sato',
    role: 'Minimalist Food & Beverage Critic',
    vibe: 'Authentic, taste-maker, studio aesthetic',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80',
    badge: 'Culinary',
  },
  {
    id: 'av5',
    name: 'Sofia Gomez',
    role: 'Gen-Z Brand Ambassador',
    vibe: 'Vibrant, pop-culture, unboxing specialist',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80',
    badge: 'Gen-Z Viral',
  },
];

export const STYLE_PRESETS = [
  { id: 'marketing-studio-image', name: 'Marketing Studio Image', icon: 'Sparkles', desc: 'Higgsfield AI commercial product ad model' },
  { id: 'soul-v2', name: 'Soul v2 Standard', icon: 'Zap', desc: 'Higgsfield AI photorealistic human & scene generation' },
  { id: 'marketing-studio-video', name: 'Marketing Studio Video', icon: 'Play', desc: 'Higgsfield AI commercial motion video generator' },
];

export const SHOT_ANGLES = [
  { id: 'closeup', name: 'Closeup', icon: 'Box', desc: 'Tight focus highlighting packaging & texture details' },
  { id: 'hero-shot', name: 'Hero Low-Angle', icon: 'Maximize2', desc: 'Dramatic low-angle framing for premium prestige' },
  { id: 'floating-3d', name: 'Floating Zero-G', icon: 'Compass', desc: 'Anti-gravity suspension with dynamic splash particles' },
  { id: 'in-hand', name: 'In-Hand Hold', icon: 'Hand', desc: 'Realistic natural human interaction & scale' },
  { id: 'flatlay', name: 'Studio Flatlay', icon: 'Grid', desc: 'Top-down geometric alignment with ingredients' },
];

export const ASPECT_RATIOS = [
  { id: '3:4', label: '3:4', name: 'Ad Poster (3:4)', icon: 'RectangleVertical', desc: 'High-converting social ad feed format' },
  { id: '1:1', label: '1:1', name: 'Square Feed (1:1)', icon: 'Square', desc: 'Instagram, Facebook & Shopify catalog' },
  { id: '9:16', label: '9:16', name: 'Story / Reel (9:16)', icon: 'Smartphone', desc: 'Full-screen TikTok, Reels & Shorts' },
  { id: '16:9', label: '16:9', name: 'Web Banner (16:9)', icon: 'Monitor', desc: 'Desktop hero sections & YouTube ads' },
  { id: '4:5', label: '4:5', name: 'Portrait (4:5)', icon: 'Tablet', desc: 'Optimal Instagram vertical timeline' },
];
