import { NextRequest, NextResponse } from 'next/server'
import { authenticateAdmin } from '@/lib/admin-auth'
import { createSupabaseClientForServer } from '@/lib/supabase-client'
import { rowToProduct } from '@/lib/drape-server'
import { parseProductInput } from '@/lib/drape-admin'

// Admin: Celoris Drape catalog. proxy.ts already blocks non-admins from
// /api/admin/*; authenticateAdmin repeats the check here as a second lock.
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const auth = await authenticateAdmin(request)
  if (!auth.success) return NextResponse.json({ error: auth.error }, { status: auth.status })
  try {
    const supabase = createSupabaseClientForServer()
    const { data, error } = await supabase
      .from('drape_products')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })
    if (error) throw new Error(error.message)
    const products = await Promise.all((data || []).map((r: any) => rowToProduct(r, { includeRefs: true })))
    return NextResponse.json({ products })
  } catch (e: any) {
    console.error('[admin drape] products GET', e)
    return NextResponse.json({ error: e?.message || 'Failed to load products' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const auth = await authenticateAdmin(request)
  if (!auth.success) return NextResponse.json({ error: auth.error }, { status: auth.status })
  try {
    const body = await request.json().catch(() => ({}))
    const parsed = parseProductInput(body)
    if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 })
    const supabase = createSupabaseClientForServer()
    const { data, error } = await supabase.from('drape_products').insert(parsed.row).select('*').single()
    if (error) throw new Error(error.message)
    return NextResponse.json({ product: await rowToProduct(data, { includeRefs: true }) })
  } catch (e: any) {
    console.error('[admin drape] products POST', e)
    return NextResponse.json({ error: e?.message || 'Failed to save product' }, { status: 500 })
  }
}
