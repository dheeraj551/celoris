import { NextResponse } from 'next/server'
import { createRouteClient } from '@/lib/supabase-server'
import { ORDER_SELECT, rowToOrder } from '@/lib/drape-server'

// The signed-in shopper's own Celoris Drape orders. Read through their own
// session, so the drape_orders RLS policy only ever returns their rows.
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = await createRouteClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ orders: [] })

    const { data, error } = await supabase
      .from('drape_orders')
      .select(ORDER_SELECT)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50)
    if (error) throw new Error(error.message)

    const orders = await Promise.all((data || []).map(rowToOrder))
    return NextResponse.json({ orders }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error: any) {
    console.error('[drape] orders error:', error)
    return NextResponse.json({ error: 'Could not load your orders.' }, { status: 500 })
  }
}
