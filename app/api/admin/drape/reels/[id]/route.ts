import { NextRequest, NextResponse } from 'next/server'
import { authenticateAdmin } from '@/lib/admin-auth'
import { createSupabaseClientForServer } from '@/lib/supabase-client'
import { rowToReel } from '@/lib/drape-server'
import { parseReelInput } from '@/lib/drape-admin'

type Ctx = { params: Promise<{ id: string }> }

export async function PATCH(request: NextRequest, { params }: Ctx) {
  const auth = await authenticateAdmin(request)
  if (!auth.success) return NextResponse.json({ error: auth.error }, { status: auth.status })
  try {
    const { id } = await params
    const body = await request.json().catch(() => ({}))
    const parsed = parseReelInput(body, { partial: true })
    if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 })
    const supabase = createSupabaseClientForServer()
    const { data, error } = await supabase.from('drape_reels').update(parsed.row).eq('id', id).select('*').single()
    if (error) throw new Error(error.message)
    return NextResponse.json({ reel: rowToReel(data) })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed to update reel' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: Ctx) {
  const auth = await authenticateAdmin(request)
  if (!auth.success) return NextResponse.json({ error: auth.error }, { status: auth.status })
  try {
    const { id } = await params
    const supabase = createSupabaseClientForServer()
    const { error } = await supabase.from('drape_reels').delete().eq('id', id)
    if (error) throw new Error(error.message)
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed to delete reel' }, { status: 500 })
  }
}
