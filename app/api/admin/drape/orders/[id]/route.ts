import { NextRequest, NextResponse } from 'next/server'
import { authenticateAdmin } from '@/lib/admin-auth'
import { createSupabaseClientForServer } from '@/lib/supabase-client'
import { ORDER_SELECT, rowToOrder } from '@/lib/drape-server'

type Ctx = { params: Promise<{ id: string }> }

// Move an order along: placed -> packed -> shipped -> delivered, and/or save
// tracking details. Refunds go through ./refund so the credits are returned.
const ALLOWED = ['placed', 'packed', 'shipped', 'delivered']

export async function PATCH(request: NextRequest, { params }: Ctx) {
  const auth = await authenticateAdmin(request)
  if (!auth.success) return NextResponse.json({ error: auth.error }, { status: auth.status })
  try {
    const { id } = await params
    const body = await request.json().catch(() => ({}))
    const patch: Record<string, unknown> = {}
    if (typeof body?.status === 'string') {
      if (!ALLOWED.includes(body.status)) return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
      patch.status = body.status
    }
    if (typeof body?.trackingInfo === 'string') patch.tracking_info = body.trackingInfo.trim().slice(0, 300) || null
    if (!Object.keys(patch).length) return NextResponse.json({ error: 'Nothing to update' }, { status: 400 })

    const supabase = createSupabaseClientForServer()
    const { data, error } = await supabase
      .from('drape_orders')
      .update(patch)
      .eq('id', id)
      .neq('status', 'refunded')
      .select(ORDER_SELECT)
      .maybeSingle()
    if (error) throw new Error(error.message)
    if (!data) return NextResponse.json({ error: 'Order not found or already refunded' }, { status: 404 })
    return NextResponse.json({ order: await rowToOrder(data) })
  } catch (e: any) {
    console.error('[admin drape] order PATCH', e)
    return NextResponse.json({ error: e?.message || 'Failed to update order' }, { status: 500 })
  }
}
