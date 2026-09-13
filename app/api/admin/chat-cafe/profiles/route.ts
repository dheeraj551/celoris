import { NextResponse } from 'next/server'
import { createSupabaseClientForServer } from '@/lib/supabase-client'

// Admin-only Chat Café patron search — used to find a patron by name to
// promote/demote their role. Only patrons who have visited Chat Café at
// least once have a row here (a profile is created on first visit).
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = (searchParams.get('search') || '').trim()

    const admin = createSupabaseClientForServer()
    let query = admin
      .from('chat_cafe_profiles')
      .select('id, name, role, is_banned, muted_until, joined_at')
      .order('joined_at', { ascending: false })
      .limit(50)

    if (search) {
      query = query.ilike('name', `%${search}%`)
    }

    const { data, error } = await query
    if (error) throw new Error(error.message)

    return NextResponse.json({ profiles: data || [] })
  } catch (error: any) {
    console.error('Admin chat-cafe profiles GET error:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
