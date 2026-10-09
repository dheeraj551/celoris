import { NextRequest, NextResponse } from 'next/server'
import { authenticateAdmin } from '@/lib/admin-auth'
import { createSupabaseClientForServer } from '@/lib/supabase-client'
import { ORDER_SELECT, rowToOrder } from '@/lib/drape-server'

type Ctx = { params: Promise<{ id: string }> }

// Refund an order: returns every credit to the shopper's wallet (with a
// wallet_transactions 'credit' row), puts limited stock back, marks it refunded.
export async function POST(request: NextRequest, { params }: Ctx) {
  const auth = await authenticateAdmin(request)
  if (!auth.success) return NextResponse.json({ error: auth.error }, { status: auth.status })
  try {
    const { id } = await params
    const supabase = createSupabaseClientForServer()
    const { error } = await supabase.rpc('drape_refund_order', { p_order_id: id })
    if (error) {
      if (error.message.includes('ALREADY_REFUNDED')) return NextResponse.json({ error: 'Already refunded' }, { status: 409 })
      if (error.message.includes('ORDER_NOT_FOUND')) return NextResponse.json({ error: 'Order not found' }, { status: 404 })
      throw new Error(error.message)
    }
    const { data } = await supabase.from('drape_orders').select(ORDER_SELECT).eq('id', id).single()
    return NextResponse.json({ order: await rowToOrder(data) })
  } catch (e: any) {
    console.error('[admin drape] refund', e)
    return NextResponse.json({ error: e?.message || 'Refund failed' }, { status: 500 })
  }
}
