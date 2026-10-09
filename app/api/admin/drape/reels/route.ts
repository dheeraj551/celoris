import { NextRequest, NextResponse } from 'next/server'
import { authenticateAdmin } from '@/lib/admin-auth'
import { createSupabaseClientForServer } from '@/lib/supabase-client'
import { rowToReel } from '@/lib/drape-server'
import { parseReelInput } from '@/lib/drape-admin'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const auth = await authenticateAdmin(request)
  if (!auth.success) return NextResponse.json({ error: auth.error }, { status: auth.status })
  try {
    const supabase = createSupabaseClientForServer()
    const { data, error } = await supabase
      .from('drape_reels')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })
    if (error) throw new Error(error.message)
    return NextResponse.json({ reels: (data || []).map(rowToReel) })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed to load reels' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const auth = await authenticateAdmin(request)
  if (!auth.success) return NextResponse.json({ error: auth.error }, { status: auth.status })
  try {
    const body = await request.json().catch(() => ({}))
    const parsed = parseReelInput(body)
    if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 })
    const supabase = createSupabaseClientForServer()
    const { data, error } = await supabase.from('drape_reels').insert(parsed.row).select('*').single()
    if (error) throw new Error(error.message)
    return NextResponse.json({ reel: rowToReel(data) })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed to save reel' }, { status: 500 })
  }
}
