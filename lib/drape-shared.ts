// Celoris Drape — shared types, store settings and small helpers.
// Safe to import from both the browser and the server (no secrets here).

// ---------------------------------------------------------------------------
// Store settings — change these here, they apply everywhere (UI + checkout).
// ---------------------------------------------------------------------------

/** Wallet top-up rate: ₹500 buys 450 credits, so ₹1 of goods costs 0.9 credits. */
export const RUPEES_PER_TOPUP = 500
export const CREDITS_PER_TOPUP = 450
export const CREDITS_PER_RUPEE = CREDITS_PER_TOPUP / RUPEES_PER_TOPUP

/** Orders at or above this subtotal ship free; below it, SHIPPING_FEE_INR is added. */
export const FREE_SHIPPING_MIN_INR = 1499
export const SHIPPING_FEE_INR = 99

export const STORE = {
  name: 'Celoris Drape',
  handle: 'celoris_drape',
  instagramUrl: 'https://www.instagram.com/celoris_drape/',
  instagramDm: 'https://ig.me/m/celoris_drape',
  /** Celoris support WhatsApp Business number (international format, no +). */
  whatsappNumber: '919084718101',
  location: 'Gurgaon',
  tagline: "Women's western wear, shoppable straight from our reels.",
  topUpUrl: '/pricing',
  returnsUrl: '/refund-policy',
} as const

export const CATEGORIES = [
  { id: 'dresses', label: 'Dresses' },
  { id: 'tops', label: 'Tops' },
  { id: 'co-ords', label: 'Co-ords' },
  { id: 'bottoms', label: 'Bottoms' },
  { id: 'outerwear', label: 'Outerwear' },
  { id: 'footwear', label: 'Footwear' },
  { id: 'accessories', label: 'Accessories' },
] as const

export type CategoryId = (typeof CATEGORIES)[number]['id']

export const ORDER_STATUSES = ['placed', 'packed', 'shipped', 'delivered', 'refunded'] as const
export type OrderStatus = (typeof ORDER_STATUSES)[number]

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  placed: 'Order placed',
  packed: 'Packed',
  shipped: 'Shipped',
  delivered: 'Delivered',
  refunded: 'Refunded',
}

// ---------------------------------------------------------------------------
// Types (camelCase, as the UI uses them)
// ---------------------------------------------------------------------------

export interface DrapeProduct {
  id: string
  slug: string | null
  title: string
  category: CategoryId
  categoryLabel: string
  description: string
  fabric: string
  fitNotes: string
  priceInr: number
  compareAtInr: number | null
  sizes: string[]
  colors: string[]
  /** Display URLs (R2 keys are already turned into signed URLs by the server). */
  images: string[]
  /** Raw stored values (R2 keys or URLs) — only returned to the admin panel. */
  imageRefs?: string[]
  /** Admin panel only: a display URL for each entry of imageRefs (same order). */
  imagePreviews?: string[]
  tags: string[]
  inStock: boolean
  /** Stock per size; a size missing from this map has no limit. */
  sizeStock: Record<string, number> | null
  isPublished: boolean
  sortOrder: number
  createdAt: string
}

export interface DrapeReel {
  id: string
  instagramUrl: string
  title: string
  caption: string
  taggedProductIds: string[]
  isPublished: boolean
  sortOrder: number
  createdAt: string
}

export interface CartItem {
  /** productId|size|color */
  key: string
  productId: string
  size: string
  color: string
  quantity: number
}

export interface DrapeOrderItem {
  id: string
  productId: string | null
  title: string
  image: string | null
  size: string | null
  color: string | null
  unitPriceInr: number
  quantity: number
}

export interface DrapeOrder {
  id: string
  orderNumber: string
  status: OrderStatus
  subtotalInr: number
  shippingInr: number
  totalInr: number
  creditsCharged: number
  customerName: string
  phone: string
  email: string | null
  addressLine: string
  city: string
  state: string | null
  pincode: string
  notes: string | null
  trackingInfo: string | null
  createdAt: string
  refundedAt: string | null
  items: DrapeOrderItem[]
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function categoryLabel(id: string): string {
  return CATEGORIES.find((c) => c.id === id)?.label || 'Collection'
}

export function formatInr(amount: number): string {
  const rounded = Math.round(amount * 100) / 100
  return '₹' + rounded.toLocaleString('en-IN', { maximumFractionDigits: Number.isInteger(rounded) ? 0 : 2 })
}

export function shippingFor(subtotalInr: number): number {
  return subtotalInr >= FREE_SHIPPING_MIN_INR || subtotalInr <= 0 ? 0 : SHIPPING_FEE_INR
}

/** Credits charged for a rupee amount — the same rounding the database uses (always up). */
export function creditsFor(inr: number): number {
  return Math.ceil(inr * CREDITS_PER_RUPEE - 1e-9)
}

export function cartKey(productId: string, size: string, color: string) {
  return `${productId}|${size}|${color}`
}

export function stockForSize(product: DrapeProduct, size: string): number | null {
  if (!product.sizeStock) return null
  const v = product.sizeStock[size]
  return typeof v === 'number' ? v : null
}

export function isSizeAvailable(product: DrapeProduct, size: string): boolean {
  const s = stockForSize(product, size)
  return s === null || s > 0
}

/**
 * Pulls the shortcode out of an Instagram reel/post link:
 *   https://www.instagram.com/reel/C8x9Kl12_nm/?igsh=...  ->  { kind: 'reel', code: 'C8x9Kl12_nm' }
 */
export function parseInstagramUrl(url: string): { kind: 'reel' | 'p'; code: string } | null {
  try {
    const u = new URL(url.trim())
    if (!/(^|\.)instagram\.com$/i.test(u.hostname)) return null
    const m = u.pathname.match(/^\/(?:[A-Za-z0-9_.]+\/)?(reel|reels|p|tv)\/([A-Za-z0-9_-]{5,})/)
    if (!m) return null
    const kind = m[1] === 'p' ? 'p' : 'reel'
    return { kind, code: m[2] }
  } catch {
    return null
  }
}

/** Instagram's official embed page for a public reel/post (no API key needed). */
export function instagramEmbedUrl(url: string): string | null {
  const parsed = parseInstagramUrl(url)
  if (!parsed) return null
  return `https://www.instagram.com/${parsed.kind}/${parsed.code}/embed/`
}

export function whatsappLink(text: string): string {
  return `https://wa.me/${STORE.whatsappNumber}?text=${encodeURIComponent(text)}`
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}
