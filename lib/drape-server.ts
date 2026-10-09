// Celoris Drape — server-only helpers (row mapping + signed image URLs).
import { createR2SignedReadUrl } from '@/lib/r2-client'
import {
  categoryLabel,
  type CategoryId,
  type DrapeOrder,
  type DrapeProduct,
  type DrapeReel,
  type OrderStatus,
} from '@/lib/drape-shared'

/** Product images uploaded from the admin panel live in R2 under this prefix. */
export const DRAPE_R2_PREFIX = 'drape/'

const IMAGE_URL_TTL_SECONDS = 6 * 60 * 60

/** An R2 key becomes a signed URL; a pasted https URL is used as-is. */
export async function resolveImage(ref: string | null | undefined): Promise<string> {
  if (!ref) return ''
  if (ref.startsWith(DRAPE_R2_PREFIX)) {
    try {
      return await createR2SignedReadUrl(ref, IMAGE_URL_TTL_SECONDS)
    } catch (e) {
      console.error('[drape] could not sign image', ref, e)
      return ''
    }
  }
  return /^https:\/\//i.test(ref) ? ref : ''
}

function toStockMap(v: unknown): Record<string, number> | null {
  if (!v || typeof v !== 'object' || Array.isArray(v)) return null
  const out: Record<string, number> = {}
  for (const [k, n] of Object.entries(v as Record<string, unknown>)) {
    if (typeof n === 'number' && Number.isFinite(n)) out[k] = Math.max(0, Math.floor(n))
  }
  return Object.keys(out).length ? out : null
}

export async function rowToProduct(row: any, opts: { includeRefs?: boolean } = {}): Promise<DrapeProduct> {
  const refs: string[] = Array.isArray(row.images) ? row.images : []
  const resolved = await Promise.all(refs.map(resolveImage))
  const images = resolved.filter(Boolean)
  return {
    id: row.id,
    slug: row.slug ?? null,
    title: row.title,
    category: row.category as CategoryId,
    categoryLabel: categoryLabel(row.category),
    description: row.description || '',
    fabric: row.fabric || '',
    fitNotes: row.fit_notes || '',
    priceInr: Number(row.price_inr),
    compareAtInr: row.compare_at_inr != null ? Number(row.compare_at_inr) : null,
    sizes: row.sizes || [],
    colors: row.colors || [],
    images,
    ...(opts.includeRefs ? { imageRefs: refs, imagePreviews: resolved } : {}),
    tags: row.tags || [],
    inStock: !!row.in_stock,
    sizeStock: toStockMap(row.size_stock),
    isPublished: !!row.is_published,
    sortOrder: row.sort_order ?? 0,
    createdAt: row.created_at,
  }
}

export function rowToReel(row: any): DrapeReel {
  return {
    id: row.id,
    instagramUrl: row.instagram_url,
    title: row.title || '',
    caption: row.caption || '',
    taggedProductIds: row.tagged_product_ids || [],
    isPublished: !!row.is_published,
    sortOrder: row.sort_order ?? 0,
    createdAt: row.created_at,
  }
}

export async function rowToOrder(row: any): Promise<DrapeOrder> {
  const items: any[] = Array.isArray(row.drape_order_items) ? row.drape_order_items : []
  return {
    id: row.id,
    orderNumber: row.order_number,
    status: row.status as OrderStatus,
    subtotalInr: Number(row.subtotal_inr),
    shippingInr: Number(row.shipping_inr),
    totalInr: Number(row.total_inr),
    creditsCharged: row.credits_charged,
    customerName: row.customer_name,
    phone: row.phone,
    email: row.email,
    addressLine: row.address_line,
    city: row.city,
    state: row.state,
    pincode: row.pincode,
    notes: row.notes,
    trackingInfo: row.tracking_info,
    createdAt: row.created_at,
    refundedAt: row.refunded_at,
    items: await Promise.all(
      items.map(async (it) => ({
        id: it.id,
        productId: it.product_id,
        title: it.title,
        image: it.image ? (await resolveImage(it.image)) || null : null,
        size: it.size,
        color: it.color,
        unitPriceInr: Number(it.unit_price_inr),
        quantity: it.quantity,
      }))
    ),
  }
}

export const ORDER_SELECT = '*, drape_order_items(*)'

/** Turns the database's checkout error codes into messages a shopper understands. */
export function checkoutErrorMessage(raw: string): { message: string; status: number; code: string } {
  const msg = raw || ''
  const [code, a, b] = msg.split(':').map((s) => s.trim())
  switch (code) {
    case 'INSUFFICIENT_CREDITS':
      return {
        code,
        status: 402,
        message: `This order needs ${a} credits and your wallet has ${Math.floor(Number(b) || 0)}. Please add credits and try again.`,
      }
    case 'UNAVAILABLE':
      return { code, status: 409, message: `${a || 'An item'} is no longer available. Please remove it from your bag.` }
    case 'OUT_OF_STOCK':
      return { code, status: 409, message: `${a || 'An item'} in size ${b || ''} just sold out. Please pick another size.` }
    case 'INVALID_SIZE':
      return { code, status: 400, message: `Please choose a size for ${a || 'every item'}.` }
    case 'INVALID_COLOR':
      return { code, status: 400, message: `Please choose a colour for ${a || 'every item'}.` }
    case 'INVALID_QUANTITY':
      return { code, status: 400, message: 'You can order 1 to 10 of each item.' }
    case 'MISSING_ADDRESS':
      return { code, status: 400, message: 'Please fill in your name, phone, address, city and PIN code.' }
    case 'NO_WALLET':
      return { code, status: 400, message: 'We could not find your Celoris wallet. Please contact support.' }
    case 'INVALID_ITEMS':
      return { code, status: 400, message: 'Your bag is empty or has too many lines (max 20).' }
    default:
      return { code: 'UNKNOWN', status: 500, message: 'Something went wrong placing your order. You have not been charged.' }
  }
}
