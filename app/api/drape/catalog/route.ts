import { NextResponse } from 'next/server'
import { createSupabaseClientForServer } from '@/lib/supabase-client'
import { rowToProduct, rowToReel } from '@/lib/drape-server'

// Public Celoris Drape catalog: published products + reels. No sign-in needed.
// Uses the service role only so it can sign R2 image URLs in the same call;
// it filters to is_published itself, exactly like the RLS read policy does.
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = createSupabaseClientForServer()
    const [productsRes, reelsRes] = await Promise.all([
      supabase
        .from('drape_products')
        .select('*')
        .eq('is_published', true)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false })
        .limit(500),
      supabase
        .from('drape_reels')
        .select('*')
        .eq('is_published', true)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false })
        .limit(100),
    ])
    if (productsRes.error) throw new Error(productsRes.error.message)
    if (reelsRes.error) throw new Error(reelsRes.error.message)

    const products = await Promise.all((productsRes.data || []).map((r: any) => rowToProduct(r)))
    const publishedIds = new Set(products.map((p) => p.id))
    const reels = (reelsRes.data || []).map(rowToReel).map((r: any) => ({
      ...r,
      // Never point shoppers at a product that isn't on sale.
      taggedProductIds: r.taggedProductIds.filter((id: string) => publishedIds.has(id)),
    }))

    return NextResponse.json({ products, reels }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error: any) {
    console.error('[drape] catalog error:', error)
    return NextResponse.json({ error: 'Could not load the store right now.' }, { status: 500 })
  }
}
