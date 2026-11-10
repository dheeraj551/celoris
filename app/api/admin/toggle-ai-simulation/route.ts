import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClientForServer } from '@/lib/supabase-client'
import { authenticateAdmin } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const auth = await authenticateAdmin(request)
    if (!auth.success) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const { userId, allowAiSimulation } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const admin: any = createSupabaseClientForServer()
    const { error } = await admin
      .from('users')
      .update({ allow_ai_simulation: Boolean(allowAiSimulation) })
      .eq('id', userId)

    if (error) throw error

    return NextResponse.json({
      success: true,
      allow_ai_simulation: Boolean(allowAiSimulation),
    })
  } catch (error: any) {
    console.error('Error toggling AI simulation flag:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
