export type AssetCategory =
  | 'All'
  | 'Sci-Fi'
  | 'Characters'
  | 'Vehicles'
  | 'Architecture'
  | 'Weapons'
  | 'Nature'
  | 'Props'
  | 'Electronics';

export type ModelFormat = 'GLTF' | 'GLB' | 'FBX' | 'OBJ' | 'BLEND' | 'USDZ';

export type ModelGeneratorType =
  | 'drone'
  | 'helmet'
  | 'sword'
  | 'car'
  | 'building'
  | 'creature'
  | 'robot'
  | 'crystal';

export interface Author {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  badge: string;
  verified: boolean;
  salesCount: number;
}

export interface ModelAsset {
  id: string;
  title: string;
  description: string;
  category: Exclude<AssetCategory, 'All'>;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  polyCount: number;
  vertexCount: number;
  formats: ModelFormat[];
  textures: string[];
  isRigged: boolean;
  isAnimated: boolean;
  isPbr: boolean;
  fileSizeMb: number;
  license: 'Standard Commercial' | 'Editorial Use' | 'CC0 Free' | 'Extended Royalty-Free';
  author: Author;
  tags: string[];
  createdAt: string;
  downloadsCount: number;
  likesCount: number;
  generatorType: ModelGeneratorType;
  primaryColor?: string;
  accentColor?: string;
  /** Cloudflare R2 object key for a real uploaded model file, when present.
   *  Assets without this fall back to the procedural preview + a generated
   *  placeholder package on download (used by the seeded demo catalog). */
  r2ModelKey?: string;
  /** Original filename of the uploaded model file, for download naming. */
  modelFileName?: string;
  /** A real snapshot image of the actual uploaded model, captured once at
   *  upload time (data: URL, JPEG). Used for the lightweight catalog-grid
   *  card thumbnail so shoppers see the real product without every visible
   *  card loading the full (potentially huge) 3D file. Assets without an
   *  uploaded file, or whose format couldn't be rendered for a snapshot,
   *  have no thumbnail and the grid card falls back to the procedural
   *  placeholder preview instead. */
  thumbnailDataUrl?: string;
}

export interface Coupon {
  code: string;
  title: string;
  description: string;
  discountPercent: number;
  speedBoost: string;
  speedMultiplier: number;
  badge: string;
  expires: string;
  active: boolean;
  isFeatured?: boolean;
}

export interface DownloadItem {
  id: string;
  assetId: string;
  assetTitle: string;
  format: ModelFormat;
  textureRes: '1K' | '2K' | '4K';
  fileSizeMb: number;
  progress: number;
  status: 'queued' | 'downloading' | 'completed' | 'paused' | 'failed';
  speedMbps: number;
  etaSec: number;
  turboApplied: boolean;
  couponCode?: string;
  timestamp: number;
}

export interface UserProfile {
  id: string;
  name: string;
  handle: string;
  email: string;
  avatar: string;
  bio: string;
  role: string;
  software: string[];
  location: string;
  joinedDate: string;
  salesCount: number;
  totalDownloads: number;
  rating: number;
  activeCoupons: string[];
  isTurboSubscriber: boolean;
  downloadSpeedTier: string;
  uploadedAssetIds: string[];
}

export type ModelViewFilter = 'pbr' | 'wireframe' | 'solid' | 'matcap' | 'xray' | 'points';
export type TextureViewFilter = 'all' | 'albedo' | 'normal' | 'roughness' | 'metallic' | 'ambient_occlusion';
export type LightingPreset = 'studio' | 'cyberpunk' | 'sunset' | 'clean' | 'dramatic' | 'highkey';

export interface ViewerSettings {
  modelMode: ModelViewFilter;
  textureMode: TextureViewFilter;
  lightingPreset: LightingPreset;
  lightIntensity: number;
  lightRotation: number;
  autoRotate: boolean;
  rotationSpeed: number;
  showGrid: boolean;
  showShadows: boolean;
  wireframeColor: string;
  backgroundColor: 'dark' | 'gray' | 'light' | 'gradient';
  materialRoughness: number;
  materialMetalness: number;
}

export interface FilterState {
  searchQuery: string;
  category: AssetCategory;
  formats: ModelFormat[];
  priceRange: 'all' | 'free' | 'under25' | '25to50' | '50plus';
  polyRange: 'all' | 'low' | 'mid' | 'high';
  isPbrOnly: boolean;
  isRiggedOnly: boolean;
  isAnimatedOnly: boolean;
  license: 'all' | 'standard' | 'cc0' | 'editorial';
  sortBy: 'popular' | 'newest' | 'rating' | 'price_asc' | 'price_desc' | 'polycount';
}
