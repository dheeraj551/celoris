import { NextResponse } from 'next/server'
import { createSupabaseClientForServer } from '@/lib/supabase-client'

// Admin-only: resolve or dismiss a Chat Café report from the admin panel.
export const dynamic = 'force-dynamic'

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: reportId } = await params
    const { status } = await request.json()
    if (!['resolved', 'dismissed'].includes(status)) {
      return NextResponse.json({ error: 'status must be resolved or dismissed' }, { status: 400 })
    }

    const admin = createSupabaseClientForServer()
    const { error } = await admin.from('chat_cafe_reports').update({ status }).eq('id', reportId)
    if (error) throw new Error(error.message)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Admin chat-cafe report PATCH error:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
