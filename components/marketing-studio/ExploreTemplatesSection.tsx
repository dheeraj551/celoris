"use client";

import React, { useState, useRef, useEffect } from 'react';
import {
  LayoutGrid,
  Box,
  Sparkles,
  Smartphone,
  Megaphone,
  Layout,
  ShoppingBag,
  Image as ImageIcon,
  Video,
  Play,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  Check,
} from 'lucide-react';

export type TemplateCategory =
  | 'all'
  | 'product-shot'
  | 'motion'
  | 'ugc'
  | 'ads'
  | 'posters'
  | 'marketplace';

export type MediaTypeFilter = 'all' | 'image' | 'video';

export interface ExploreTemplate {
  id: string;
  title: string;
  brand?: string;
  category: TemplateCategory;
  secondaryCategories?: TemplateCategory[];
  media: 'image' | 'video';
  imageUrl: string;
  videoUrl?: string;
  badge: string;
  ratio: string;
  angle: string;
  prompt: string;
  accentColor?: string;
  /** CSS object-position for the card crop (landscape media in the 3:4 card). */
  mediaPosition?: string;
}

// Media hosted in Cloudflare R2 (private bucket) and served through
// /api/media/vio-templates/<file>, which redirects to a short-lived signed link.
const R2_TEMPLATE_MEDIA = '/api/media/vio-templates/';

export const EXPLORE_TEMPLATES: ExploreTemplate[] = [
  {
    id: 'tpl-ame-kaze',
    title: 'Ame Kaze Cold-Brewed Green Tea',
    brand: 'Ame Kaze',
    category: 'product-shot',
    secondaryCategories: ['motion', 'ads'],
    media: 'video',
    imageUrl: `${R2_TEMPLATE_MEDIA}ame-kaze-green-tea.jpg`,
    videoUrl: `${R2_TEMPLATE_MEDIA}ame-kaze-green-tea.mp4`,
    badge: 'PRODUCT SHOT',
    ratio: '9:16',
    angle: 'Hero Low-Angle',
    prompt:
      'Glass bottle of cold-brewed green tea with a botanical jasmine label floating on gently rippling sage-green water, slow macro pass over the label, rising bubbles inside the tea, a stream of tea pouring into a glass dish, ending on the bottle standing on a pale pedestal surrounded by fresh tea leaves, soft diffused daylight, calm premium beverage commercial',
    accentColor: '#A3C585',
  },
  {
    id: 'tpl-lightweight-wallet',
    title: 'Lightweight Leather Wallet Spec Ad',
    category: 'ads',
    secondaryCategories: ['posters', 'motion', 'product-shot'],
    media: 'video',
    imageUrl: `${R2_TEMPLATE_MEDIA}wallet-lightweight-poster.jpg`,
    videoUrl: `${R2_TEMPLATE_MEDIA}wallet-lightweight-poster.mp4`,
    badge: 'ADS',
    ratio: '9:16',
    angle: 'Floating Zero-G',
    prompt:
      'Cobalt-blue pebbled leather bifold wallet floating on a clean white technical spec sheet with thin grid lines, bold callouts "TOTAL WEIGHT 62g", "LIGHTWEIGHT 8mm closed", "CARD CAPACITY 6", red circle annotations on the brass corner guard and hand-stitched edges, snappy kinetic typography, modern product spec poster ad',
    accentColor: '#2563EB',
  },
  {
    id: 'tpl-aurum-watch',
    title: 'Aurum Watch Exploded View',
    brand: 'Aurum',
    category: 'motion',
    secondaryCategories: ['product-shot', 'ads'],
    media: 'video',
    imageUrl: `${R2_TEMPLATE_MEDIA}watch-exploded-view.jpg`,
    videoUrl: `${R2_TEMPLATE_MEDIA}watch-exploded-view.mp4`,
    badge: 'MOTION',
    ratio: '9:16',
    angle: 'Closeup',
    prompt:
      'Luxury stainless steel automatic watch on pure black, the movement separating into a vertical exploded view of dial, gears and gold balance wheel, macro close-ups of spinning gears with spec callouts "28,800 BEATS PER HOUR" and "9H SCRATCH-PROOF SAPPHIRE", reassembling into the finished watch with a minimal wordmark, precise engineering commercial',
    accentColor: '#E5E7EB',
  },
  {
    id: 'tpl-campus-walk',
    title: 'Golden Hour Campus Walk',
    category: 'ugc',
    secondaryCategories: ['ads'],
    media: 'video',
    imageUrl: `${R2_TEMPLATE_MEDIA}campus-walk-ugc.jpg`,
    videoUrl: `${R2_TEMPLATE_MEDIA}campus-walk-ugc.mp4`,
    badge: 'UGC',
    ratio: '9:16',
    angle: 'Any angle',
    prompt:
      'Young woman in a mustard-yellow cardigan, white tee and light jeans walking toward the camera along a tree-lined university path at golden hour, backpack on one shoulder, iced coffee in hand and an instant camera on a strap, warm sunset glow, handheld lifestyle UGC reel for a student or fashion brand',
    accentColor: '#F59E0B',
  },
  {
    id: 'tpl-podcast-creator',
    title: 'Podcast Creator Talking Head',
    category: 'ugc',
    secondaryCategories: ['ads'],
    media: 'video',
    imageUrl: `${R2_TEMPLATE_MEDIA}podcast-creator-ugc.jpg`,
    videoUrl: `${R2_TEMPLATE_MEDIA}podcast-creator-ugc.mp4`,
    badge: 'UGC',
    ratio: '9:16',
    angle: 'Closeup',
    prompt:
      'Confident young woman in a camel blazer speaking into a black podcast microphone on a boom arm, cosy home studio with warm practical lights and shelves softly blurred behind her, natural hand gestures, direct-to-camera talking-head UGC testimonial',
    accentColor: '#D97706',
  },
  {
    id: 'tpl-vitc-facewash',
    title: 'Vitamin C Face Wash UGC',
    category: 'ugc',
    secondaryCategories: ['product-shot', 'marketplace'],
    media: 'image',
    imageUrl: `${R2_TEMPLATE_MEDIA}skincare-ugc-hold.jpg`,
    badge: 'UGC',
    ratio: '9:16',
    angle: 'In-Hand Hold',
    prompt:
      'Smiling woman with long wavy hair in a red blouse holding a bright yellow vitamin C face wash tube beside her face, presenting it with her other open palm, plain warm beige backdrop, soft even beauty lighting, authentic skincare UGC ad',
    accentColor: '#FACC15',
    mediaPosition: 'center top',
  },
  {
    id: 'tpl-social-media-town',
    title: '3D Social Media Town Thumbnail',
    category: 'posters',
    secondaryCategories: ['ads'],
    media: 'image',
    imageUrl: `${R2_TEMPLATE_MEDIA}blender-social-media-town.jpg`,
    badge: 'POSTERS',
    ratio: '16:9',
    angle: 'Floating Zero-G',
    prompt:
      'Playful 3D render of a miniature city of app-icon skyscrapers rising out of a smartphone screen, fluffy clay-style clouds drifting around it, vivid orange gradient background, bold hand-lettered headline on the left, eye-catching YouTube tutorial thumbnail',
    accentColor: '#F97316',
    mediaPosition: '68% center',
  },
  {
    id: 'tpl-certification-banner',
    title: 'Developer Certification Banner',
    category: 'posters',
    secondaryCategories: ['ads'],
    media: 'image',
    imageUrl: `${R2_TEMPLATE_MEDIA}claude-certified-developer.jpg`,
    badge: 'POSTERS',
    ratio: '16:9',
    angle: 'Hero Low-Angle',
    prompt:
      'Clean course banner on a soft white background, large terracotta serif headline for a developer certification with a short subtitle underneath, on the right an octagonal copper certification badge with a ribbon reading "FOUNDATIONS" standing on a glowing white podium, thin orbit lines, premium education ad',
    accentColor: '#C2410C',
    mediaPosition: 'right center',
  },
  {
    id: 'tpl-solv',
    title: 'Solv Mineral Skin Balm',
    brand: 'Solv',
    category: 'ugc',
    secondaryCategories: ['product-shot', 'ads'],
    media: 'image',
    imageUrl: '/templates/template-solv.jpg',
    badge: 'UGC',
    ratio: '3:4',
    angle: 'In-Hand Hold',
    prompt:
      'Smiling young woman holding a sleek silver cosmetic tin with blue gradient circle towards the camera, natural morning daylight, warm freckled skin, authentic UGC beauty ad, 8k commercial photography',
    accentColor: '#38BDF8',
  },
  {
    id: 'tpl-rosehip',
    title: 'Rosehip Morning Society',
    brand: 'Rosehip Morning Society',
    category: 'product-shot',
    secondaryCategories: ['ads', 'marketplace'],
    media: 'image',
    imageUrl: '/templates/template-rosehip.jpg',
    badge: 'PRODUCT SHOT',
    ratio: '3:4',
    angle: 'Hero Low-Angle',
    prompt:
      "Hand holding textured terracotta paper pouch packaging with 'Rosehip Morning Society Berry Oat Granola' raised toward a sunny clear azure summer sky, sunglasses, natural Mediterranean beach aesthetic, high-converting social ad",
    accentColor: '#FB923C',
  },
  {
    id: 'tpl-leaf',
    title: 'Botanical Dewdrop Leaf',
    brand: 'Botanical Glow',
    category: 'product-shot',
    secondaryCategories: ['marketplace'],
    media: 'image',
    imageUrl: '/templates/template-leaf.jpg',
    badge: 'PRODUCT SHOT',
    ratio: '3:4',
    angle: 'Closeup',
    prompt:
      'Extreme macro photography of a vibrant green ribbed monstera leaf with crystal-clear single water droplet sliding down the vein, pure organic skincare texture background, soft morning diffuse studio lighting, raytraced caustics',
    accentColor: '#4ADE80',
  },
  {
    id: 'tpl-griotte',
    title: 'Griotte Cherry Noir Parfum',
    brand: 'Griotte',
    category: 'product-shot',
    secondaryCategories: ['ads', 'posters'],
    media: 'image',
    imageUrl: '/templates/template-griotte.jpg',
    badge: 'PRODUCT SHOT',
    ratio: '3:4',
    angle: 'Hero Low-Angle',
    prompt:
      'Luxury dark burgundy perfume bottle with gold atomizer perched on a crystal clear square melting ice cube block, surrounded by fresh glossy dark cherries, soft blush pink studio background, high luxury fragrance commercial',
    accentColor: '#F43F5E',
  },
  {
    id: 'tpl-lume',
    title: 'Lume Soft Matte Stick',
    brand: 'lume.',
    category: 'ugc',
    secondaryCategories: ['product-shot'],
    media: 'image',
    imageUrl: '/templates/template-lume.jpg',
    badge: 'UGC',
    ratio: '3:4',
    angle: 'In-Hand Hold',
    prompt:
      'Young Asian model with sleek hair holding pastel lavender deodorant stick next to cheek with playful expression, warm butter-yellow studio backdrop, editorial Gen-Z beauty lighting, high conversion viral format',
    accentColor: '#C084FC',
  },
  {
    id: 'tpl-splash',
    title: 'Splash Sparkling Soda',
    brand: 'SPLASH',
    category: 'ads',
    secondaryCategories: ['motion', 'product-shot'],
    media: 'video',
    imageUrl: '/templates/template-splash.jpg',
    videoUrl: '/vid/marketing-studio-slider-poster-Ads.mp4',
    badge: 'ADS',
    ratio: '3:4',
    angle: 'In-Hand Hold',
    prompt:
      "Woman sunbathing on bright cyan beach towel outdoors holding chilled aluminum soda can with bold blue typography 'SPLASH', refreshing condensation droplets, sparkling bubbles, summer lifestyle commercial ad",
    accentColor: '#38BDF8',
  },
  {
    id: 'tpl-biojus',
    title: 'BioJus Cellular Hydration',
    brand: 'BioJus',
    category: 'product-shot',
    secondaryCategories: ['motion', 'marketplace'],
    media: 'video',
    imageUrl: 'https://images.unsplash.com/photo-1608248597359-57e335272a8c?w=600&auto=format&fit=crop&q=80',
    videoUrl: '/vid/marketing-studio-slider-poster-Product.mp4',
    badge: 'PRODUCT SHOT',
    ratio: '3:4',
    angle: 'Floating Zero-G',
    prompt:
      'Luxury amber glass elixir bottle floating in effervescent lime liquid droplets, macro studio lighting, raytracing caustic reflections, commercial 4K packshot',
    accentColor: '#A3E635',
  },
  {
    id: 'tpl-vessel',
    title: 'Vessel Artisanal Chili Crunch',
    brand: 'Vessel',
    category: 'motion',
    secondaryCategories: ['ugc', 'ads'],
    media: 'video',
    imageUrl: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=600&auto=format&fit=crop&q=80',
    videoUrl: '/vid/marketing-studio-slider-poster-UGC.mp4',
    badge: 'MOTION',
    ratio: '3:4',
    angle: 'Hero Low-Angle',
    prompt:
      'Spherical crystal glass bowl suspended in mid-air with golden tortilla crisps and glowing red bird-eye chili, cinematic ocean blue studio rim light, dynamic motion ad',
    accentColor: '#38BDF8',
  },
  {
    id: 'tpl-plush',
    title: 'Plush Botanical Body Wash',
    brand: 'Plush',
    category: 'marketplace',
    secondaryCategories: ['product-shot'],
    media: 'video',
    imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80',
    videoUrl: '/vid/marketing-studio-slider-poster-Marketplace.mp4',
    badge: 'MARKETPLACE',
    ratio: '3:4',
    angle: 'Closeup',
    prompt:
      'Pastel lilac cosmetic pump bottle resting on ethereal foamy clouds and iridescent soap bubbles, soft morning diffused ambient light, Amazon marketplace hero shot',
    accentColor: '#C084FC',
  },
  {
    id: 'tpl-chase',
    title: 'Chase The Dream Editorial',
    brand: 'Chase',
    category: 'posters',
    secondaryCategories: ['ads'],
    media: 'video',
    imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&auto=format&fit=crop&q=80',
    videoUrl: '/vid/marketing-studio-slider-poster-poster.mp4',
    badge: 'POSTERS',
    ratio: '3:4',
    angle: 'Hero Low-Angle',
    prompt:
      'Avant-garde fashion editorial model illuminated by red chromatic aberration and neon light trails, bold kinetic typography, high-fashion poster ad',
    accentColor: '#FF2E93',
  },
];

const CATEGORIES: { id: TemplateCategory; label: string; icon: React.FC<{ className?: string }> }[] = [
  { id: 'all', label: 'All', icon: LayoutGrid },
  { id: 'product-shot', label: 'Product shot', icon: Box },
  { id: 'motion', label: 'Motion', icon: Sparkles },
  { id: 'ugc', label: 'UGC', icon: Smartphone },
  { id: 'ads', label: 'Ads', icon: Megaphone },
  { id: 'posters', label: 'Posters', icon: Layout },
  { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
];

interface ExploreTemplatesSectionProps {
  onSelectTemplate: (template: ExploreTemplate) => void;
  selectedTemplateId?: string | null;
}

export function ExploreTemplatesSection({
  onSelectTemplate,
  selectedTemplateId,
}: ExploreTemplatesSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory>('all');
  const [mediaFilter, setMediaFilter] = useState<MediaTypeFilter>('all');
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Filter templates
  const filteredTemplates = EXPLORE_TEMPLATES.filter((tpl) => {
    // Category filter
    const matchesCategory =
      selectedCategory === 'all' ||
      tpl.category === selectedCategory ||
      tpl.secondaryCategories?.includes(selectedCategory);

    // Media filter
    const matchesMedia = mediaFilter === 'all' || tpl.media === mediaFilter;

    return matchesCategory && matchesMedia;
  });

  const checkScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [filteredTemplates]);

  const handleScroll = (direction: 'left' | 'right') => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.75;
    el.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  return (
    <section className="relative z-20 w-full mt-10 mb-8 select-none">
      {/* Container header & filter controls */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
        {/* Title */}
        <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-white mb-3 sm:mb-4 font-sans">
          EXPLORE TEMPLATES
        </h2>

        {/* Filter bar: Categories on Left, Media Filter on Right */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-2 border-b border-white/[0.06]">
          {/* Category Pills (horizontally scrollable on small screens) */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold tracking-tight transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-white text-black shadow-md shadow-white/10 font-bold scale-[1.02]'
                      : 'bg-white/[0.04] hover:bg-white/[0.08] text-neutral-300 hover:text-white border border-white/10'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-black' : 'text-neutral-400'}`} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Media Switcher: All | Images | Videos */}
          <div className="shrink-0 self-start sm:self-auto flex items-center bg-white/[0.04] p-0.5 rounded-full border border-white/10">
            <button
              type="button"
              onClick={() => setMediaFilter('all')}
              className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-tight transition-all cursor-pointer ${
                mediaFilter === 'all'
                  ? 'bg-white text-black shadow-xs font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setMediaFilter('image')}
              className={`flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold tracking-tight transition-all cursor-pointer ${
                mediaFilter === 'image'
                  ? 'bg-white text-black shadow-xs font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <ImageIcon className="w-3 h-3" />
              <span>Images</span>
            </button>
            <button
              type="button"
              onClick={() => setMediaFilter('video')}
              className={`flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold tracking-tight transition-all cursor-pointer ${
                mediaFilter === 'video'
                  ? 'bg-white text-black shadow-xs font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Video className="w-3 h-3" />
              <span>Videos</span>
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Carousel View */}
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 group/strip">
        {/* Left Arrow */}
        {canScrollLeft && (
          <button
            type="button"
            onClick={() => handleScroll('left')}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-black/85 hover:bg-black text-white border border-white/20 shadow-2xl backdrop-blur-md opacity-0 group-hover/strip:opacity-100 transition-all cursor-pointer hover:scale-110 active:scale-95"
            aria-label="Previous templates"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}

        {/* Right Arrow */}
        {canScrollRight && (
          <button
            type="button"
            onClick={() => handleScroll('right')}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-black/85 hover:bg-black text-white border border-white/20 shadow-2xl backdrop-blur-md opacity-0 group-hover/strip:opacity-100 transition-all cursor-pointer hover:scale-110 active:scale-95"
            aria-label="Next templates"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}

        {/* Scrollable Track */}
        <div
          ref={scrollContainerRef}
          onScroll={checkScroll}
          className="flex items-stretch gap-2.5 sm:gap-3 overflow-x-auto pb-4 pt-1 px-1 scroll-smooth scrollbar-none"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {filteredTemplates.length === 0 ? (
            <div className="w-full py-16 text-center text-xs text-neutral-500 border border-dashed border-white/10 rounded-2xl">
              No templates found matching this filter. Switch to "All" to browse the full catalog.
            </div>
          ) : (
            filteredTemplates.map((template) => {
              const isSelected = selectedTemplateId === template.id;
              const isHovered = hoveredCardId === template.id;

              return (
                <div
                  key={template.id}
                  onClick={() => onSelectTemplate(template)}
                  onMouseEnter={() => setHoveredCardId(template.id)}
                  onMouseLeave={() => setHoveredCardId(null)}
                  className={`relative shrink-0 w-[155px] sm:w-[180px] md:w-[205px] lg:w-[220px] aspect-[3/4] rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer select-none border transition-all duration-300 group/card ${
                    isSelected
                      ? 'border-[#D4FF00] ring-2 ring-[#D4FF00]/50 shadow-[0_0_25px_rgba(212,255,0,0.3)] scale-[1.02]'
                      : 'border-white/[0.08] hover:border-white/30 hover:shadow-[0_15px_30px_rgba(0,0,0,0.8)]'
                  }`}
                  style={{ scrollSnapAlign: 'start' }}
                >
                  {/* Media background: Video on hover if available, otherwise Image */}
                  {template.videoUrl && isHovered ? (
                    <video
                      src={template.videoUrl}
                      autoPlay
                      loop
                      muted
                      playsInline
                      poster={template.imageUrl}
                      style={template.mediaPosition ? { objectPosition: template.mediaPosition } : undefined}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 scale-105"
                    />
                  ) : (
                    <img
                      src={template.imageUrl}
                      alt={template.title}
                      loading="lazy"
                      style={template.mediaPosition ? { objectPosition: template.mediaPosition } : undefined}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105"
                    />
                  )}

                  {/* Gradient overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

                  {/* Top Badge: Category or Video Indicator */}
                  <div className="absolute top-2 left-2 z-10 flex items-center gap-1">
                    <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[9px] font-mono font-bold tracking-wider text-white uppercase">
                      {template.badge}
                    </span>
                    {template.media === 'video' && (
                      <span className="p-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white">
                        <Play className="w-2.5 h-2.5 fill-white" />
                      </span>
                    )}
                  </div>

                  {/* Selected Tick Indicator */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 z-10 w-5 h-5 rounded-full bg-[#D4FF00] text-black flex items-center justify-center shadow-lg">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}

                  {/* Bottom Info & Action Hover */}
                  <div className="absolute bottom-0 inset-x-0 p-2.5 sm:p-3 z-10 flex flex-col justify-end">
                    <p className="text-[11px] sm:text-xs font-bold text-white line-clamp-1 leading-snug drop-shadow-md">
                      {template.title}
                    </p>
                    <p className="text-[9px] sm:text-[10px] text-neutral-300 font-mono line-clamp-1 opacity-80 mt-0.5">
                      {template.angle} • {template.ratio}
                    </p>

                    {/* Quick "Use Template" Action Pill on Hover */}
                    <div className="mt-2 pt-1.5 border-t border-white/10 flex items-center justify-between opacity-0 group-hover/card:opacity-100 transition-opacity duration-200">
                      <span className="inline-flex items-center gap-1 text-[10px] font-black text-[#D4FF00] tracking-wide uppercase">
                        Use Template <ArrowUpRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
