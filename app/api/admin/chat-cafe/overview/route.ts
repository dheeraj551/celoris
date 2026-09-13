import { NextResponse } from 'next/server'
import { createSupabaseClientForServer } from '@/lib/supabase-client'

// Admin-only Chat Café overview — tables (with slow mode/lock), the
// reports queue, currently banned/muted patrons, and a recent moderation
// log. Powers app/admin/chat-cafe/page.tsx.
//
// Auth note: like every other route under app/api/admin/* in this codebase
// (see app/api/admin/cafe/rooms, app/api/admin/users), there is no
// server-side admin check here — the whole /admin/* area gates access
// client-side via a localStorage "admin_session" flag set at /admin/login.
// This route follows that same existing convention.
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const admin = createSupabaseClientForServer()

    const [tablesRes, reportsRes, sanctionedRes, logsRes, aiCharactersRes] = await Promise.all([
      admin.from('chat_cafe_tables').select('*, active_topic:chat_cafe_topics!chat_cafe_tables_active_topic_id_fkey(*)').order('id'),
      admin.from('chat_cafe_reports').select('*').order('created_at', { ascending: false }).limit(100),
      admin
        .from('chat_cafe_profiles')
        .select('id, name, role, is_banned, ban_reason, muted_until')
        .or('is_banned.eq.true,muted_until.not.is.null')
        .order('name'),
      admin.from('chat_cafe_moderation_logs').select('*').order('created_at', { ascending: false }).limit(50),
      admin.from('chat_cafe_ai_characters').select('*').order('table_id').order('name'),
    ])

    if (tablesRes.error) throw new Error(tablesRes.error.message)
    if (reportsRes.error) throw new Error(reportsRes.error.message)
    if (sanctionedRes.error) throw new Error(sanctionedRes.error.message)
    if (logsRes.error) throw new Error(logsRes.error.message)
    if (aiCharactersRes.error) throw new Error(aiCharactersRes.error.message)

    return NextResponse.json({
      tables: tablesRes.data || [],
      reports: reportsRes.data || [],
      sanctionedProfiles: sanctionedRes.data || [],
      moderationLogs: logsRes.data || [],
      aiCharacters: aiCharactersRes.data || [],
    })
  } catch (error: any) {
    console.error('Admin chat-cafe overview GET error:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
