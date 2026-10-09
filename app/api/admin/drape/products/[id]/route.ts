import { NextRequest, NextResponse } from 'next/server'
import { authenticateAdmin } from '@/lib/admin-auth'
import { createSupabaseClientForServer } from '@/lib/supabase-client'
import { rowToProduct } from '@/lib/drape-server'
import { parseProductInput } from '@/lib/drape-admin'
import { deleteR2Object } from '@/lib/r2-client'
import { DRAPE_R2_PREFIX } from '@/lib/drape-server'

type Ctx = { params: Promise<{ id: string }> }

export async function PATCH(request: NextRequest, { params }: Ctx) {
  const auth = await authenticateAdmin(request)
  if (!auth.success) return NextResponse.json({ error: auth.error }, { status: auth.status })
  try {
    const { id } = await params
    const body = await request.json().catch(() => ({}))
    const parsed = parseProductInput(body, { partial: true })
    if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 })
    const supabase = createSupabaseClientForServer()
    const { data, error } = await supabase.from('drape_products').update(parsed.row).eq('id', id).select('*').single()
    if (error) throw new Error(error.message)
    return NextResponse.json({ product: await rowToProduct(data, { includeRefs: true }) })
  } catch (e: any) {
    console.error('[admin drape] product PATCH', e)
    return NextResponse.json({ error: e?.message || 'Failed to update product' }, { status: 500 })
  }
}

// Deleting keeps past orders intact (order lines store their own title,
// price and image; the product link just becomes empty).
export async function DELETE(request: NextRequest, { params }: Ctx) {
  const auth = await authenticateAdmin(request)
  if (!auth.success) return NextResponse.json({ error: auth.error }, { status: auth.status })
  try {
    const { id } = await params
    const supabase = createSupabaseClientForServer()
    const { data, error } = await supabase.from('drape_products').delete().eq('id', id).select('images').maybeSingle()
    if (error) throw new Error(error.message)
    // Images still referenced by old orders are kept so receipts keep their photo.
    const refs: string[] = (data?.images || []).filter((r: string) => r.startsWith(DRAPE_R2_PREFIX))
    if (refs.length) {
      const { data: used } = await supabase.from('drape_order_items').select('image').in('image', refs)
      const keep = new Set((used || []).map((u: any) => u.image))
      await Promise.all(refs.filter((r) => !keep.has(r)).map((r) => deleteR2Object(r).catch(() => {})))
    }
    return NextResponse.json({ success: true })
  } catch (e: any) {
    console.error('[admin drape] product DELETE', e)
    return NextResponse.json({ error: e?.message || 'Failed to delete product' }, { status: 500 })
  }
}
