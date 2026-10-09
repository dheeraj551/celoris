// Celoris Drape — admin-side input parsing (server only).
import { CATEGORIES, slugify } from '@/lib/drape-shared'
import { DRAPE_R2_PREFIX } from '@/lib/drape-server'

function str(v: unknown, max: number) {
  return typeof v === 'string' ? v.trim().slice(0, max) : ''
}

function list(v: unknown, maxItems: number, maxLen: number): string[] {
  const arr = Array.isArray(v) ? v : typeof v === 'string' ? v.split(',') : []
  const out: string[] = []
  for (const x of arr) {
    const s = str(x, maxLen)
    if (s && !out.includes(s)) out.push(s)
    if (out.length >= maxItems) break
  }
  return out
}

function money(v: unknown): number | null {
  if (v === null || v === undefined || v === '') return null
  const n = Number(v)
  return Number.isFinite(n) && n >= 0 ? Math.round(n * 100) / 100 : NaN
}

/** Accepts {"S":3} objects. Anything else (blank) means "no stock limits". */
function stockMap(v: unknown): Record<string, number> | null {
  if (!v || typeof v !== 'object' || Array.isArray(v)) return null
  const out: Record<string, number> = {}
  for (const [k, n] of Object.entries(v as Record<string, unknown>)) {
    const key = str(k, 20)
    const num = Number(n)
    if (key && n !== '' && n !== null && Number.isFinite(num)) out[key] = Math.max(0, Math.floor(num))
  }
  return Object.keys(out).length ? out : null
}

function imageRefs(v: unknown): string[] {
  const arr = Array.isArray(v) ? v : []
  return arr
    .map((x) => str(x, 600))
    .filter((s) => s.startsWith(DRAPE_R2_PREFIX) || /^https:\/\//i.test(s))
    .slice(0, 8)
}

/** Validates an admin product form. Returns the DB row fields or an error. */
export function parseProductInput(body: any, { partial = false } = {}):
  | { ok: true; row: Record<string, unknown> }
  | { ok: false; error: string } {
  const row: Record<string, unknown> = {}
  const has = (k: string) => body && Object.prototype.hasOwnProperty.call(body, k)

  if (!partial || has('title')) {
    const title = str(body?.title, 140)
    if (!title) return { ok: false, error: 'Title is required' }
    row.title = title
  }
  if (!partial) {
    // New product: readable slug plus a short random tail so two products
    // with the same name never clash.
    const base = slugify(str(body?.slug, 90) || str(body?.title, 140)) || 'item'
    row.slug = `${base}-${Math.random().toString(36).slice(2, 6)}`
  } else if (has('slug')) {
    row.slug = slugify(str(body?.slug, 90)) || null
  }
  if (!partial || has('category')) {
    const cat = str(body?.category, 30)
    if (!CATEGORIES.some((c) => c.id === cat)) return { ok: false, error: 'Pick a valid category' }
    row.category = cat
  }
  if (!partial || has('priceInr')) {
    const p = money(body?.priceInr)
    if (p === null || Number.isNaN(p) || p <= 0) return { ok: false, error: 'Price must be more than ₹0' }
    row.price_inr = p
  }
  if (!partial || has('compareAtInr')) {
    const c = money(body?.compareAtInr)
    if (Number.isNaN(c)) return { ok: false, error: 'Original price must be a number' }
    row.compare_at_inr = c
  }
  if (!partial || has('description')) row.description = str(body?.description, 3000)
  if (!partial || has('fabric')) row.fabric = str(body?.fabric, 300)
  if (!partial || has('fitNotes')) row.fit_notes = str(body?.fitNotes, 600)
  if (!partial || has('sizes')) row.sizes = list(body?.sizes, 15, 20)
  if (!partial || has('colors')) row.colors = list(body?.colors, 15, 40)
  if (!partial || has('tags')) row.tags = list(body?.tags, 10, 30)
  if (!partial || has('images')) row.images = imageRefs(body?.images)
  if (!partial || has('sizeStock')) row.size_stock = stockMap(body?.sizeStock)
  if (!partial || has('inStock')) row.in_stock = body?.inStock === undefined ? true : !!body.inStock
  if (!partial || has('isPublished')) row.is_published = !!body?.isPublished
  if (!partial || has('sortOrder')) row.sort_order = Math.floor(Number(body?.sortOrder) || 0)

  return { ok: true, row }
}

export function parseReelInput(body: any, { partial = false } = {}):
  | { ok: true; row: Record<string, unknown> }
  | { ok: false; error: string } {
  const row: Record<string, unknown> = {}
  const has = (k: string) => body && Object.prototype.hasOwnProperty.call(body, k)
  if (!partial || has('instagramUrl')) {
    const url = str(body?.instagramUrl, 400)
    const ok = /^https:\/\/(www\.)?instagram\.com\/(?:[A-Za-z0-9_.]+\/)?(reel|reels|p|tv)\/[A-Za-z0-9_-]{5,}/i.test(url)
    if (!ok) return { ok: false, error: 'Paste a public Instagram reel or post link (instagram.com/reel/...)' }
    row.instagram_url = url
  }
  if (!partial || has('title')) row.title = str(body?.title, 140)
  if (!partial || has('caption')) row.caption = str(body?.caption, 1000)
  if (!partial || has('taggedProductIds')) {
    const ids = Array.isArray(body?.taggedProductIds) ? body.taggedProductIds : []
    row.tagged_product_ids = ids
      .filter((x: unknown) => typeof x === 'string' && /^[0-9a-f-]{36}$/i.test(x))
      .slice(0, 12)
  }
  if (!partial || has('isPublished')) row.is_published = body?.isPublished === undefined ? true : !!body.isPublished
  if (!partial || has('sortOrder')) row.sort_order = Math.floor(Number(body?.sortOrder) || 0)
  return { ok: true, row }
}
