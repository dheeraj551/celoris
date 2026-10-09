import { NextRequest, NextResponse } from 'next/server'
import { authenticateAdmin } from '@/lib/admin-auth'
import { createSupabaseClientForServer } from '@/lib/supabase-client'
import { ORDER_SELECT, rowToOrder } from '@/lib/drape-server'
import { ORDER_STATUSES } from '@/lib/drape-shared'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const auth = await authenticateAdmin(request)
  if (!auth.success) return NextResponse.json({ error: auth.error }, { status: auth.status })
  try {
    const status = request.nextUrl.searchParams.get('status') || ''
    const supabase = createSupabaseClientForServer()
    let q = supabase.from('drape_orders').select(ORDER_SELECT).order('created_at', { ascending: false }).limit(200)
    if ((ORDER_STATUSES as readonly string[]).includes(status)) q = q.eq('status', status)
    const { data, error } = await q
    if (error) throw new Error(error.message)
    const orders = await Promise.all((data || []).map(rowToOrder))
    return NextResponse.json({ orders })
  } catch (e: any) {
    console.error('[admin drape] orders GET', e)
    return NextResponse.json({ error: e?.message || 'Failed to load orders' }, { status: 500 })
  }
}
