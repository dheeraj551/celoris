import { NextResponse } from 'next/server'
import { createSupabaseClientForServer } from '@/lib/supabase-client'

// Admin-only Chat Café moderation: mute / unmute / ban / unban a patron,
// change a table's slow mode, or promote/demote a patron's café role
// (patron/regular/barista/moderator/admin) — this last one is how site
// admins hand out in-room moderator powers, per the admin-dashboard-control
// requirement for this feature.
//
// Auth note: same disclosed, no-server-check convention as the rest of
// app/api/admin/* — see app/api/admin/chat-cafe/overview for the full
// explanation.
export const dynamic = 'force-dynamic'

const VALID_ROLES = ['patron', 'regular', 'barista', 'moderator', 'admin']

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const action = body?.action as 'mute' | 'unmute' | 'ban' | 'unban' | 'slowmode' | 'setRole'
    const admin = createSupabaseClientForServer()

    if (action === 'slowmode') {
      const { tableId, seconds } = body
      if (!tableId || typeof seconds !== 'number') {
        return NextResponse.json({ error: 'tableId and seconds are required' }, { status: 400 })
      }
      const { error } = await admin
        .from('chat_cafe_tables')
        .update({ slow_mode_seconds: Math.max(0, Math.floor(seconds)), updated_at: new Date().toISOString() })
        .eq('id', tableId)
      if (error) throw new Error(error.message)
      return NextResponse.json({ success: true })
    }

    if (action === 'setRole') {
      const { targetUserId, role } = body
      if (!targetUserId || !VALID_ROLES.includes(role)) {
        return NextResponse.json({ error: 'targetUserId and a valid role are required' }, { status: 400 })
      }
      const { data, error } = await admin
        .from('chat_cafe_profiles')
        .update({ role, updated_at: new Date().toISOString() })
        .eq('id', targetUserId)
        .select('*')
        .single()
      if (error) throw new Error(error.message)
      return NextResponse.json({ profile: data })
    }

    const { targetUserId, targetUserName, reason } = body
    if (!targetUserId) {
      return NextResponse.json({ error: 'targetUserId is required' }, { status: 400 })
    }

    if (action === 'mute') {
      const durationMin = Math.max(1, Math.min(1440, Number(body.durationMin) || 10))
      const mutedUntil = new Date(Date.now() + durationMin * 60 * 1000).toISOString()
      const { error } = await admin
        .from('chat_cafe_profiles')
        .update({ muted_until: mutedUntil, updated_at: new Date().toISOString() })
        .eq('id', targetUserId)
      if (error) throw new Error(error.message)
      await admin.from('chat_cafe_moderation_logs').insert({
        action: 'mute', target_user_id: targetUserId, target_user_name: targetUserName,
        moderator_id: null, moderator_name: 'Site Admin', reason,
      })
      return NextResponse.json({ success: true, mutedUntil })
    }

    if (action === 'unmute') {
      const { error } = await admin
        .from('chat_cafe_profiles')
        .update({ muted_until: null, updated_at: new Date().toISOString() })
        .eq('id', targetUserId)
      if (error) throw new Error(error.message)
      await admin.from('chat_cafe_moderation_logs').insert({
        action: 'unmute', target_user_id: targetUserId, target_user_name: targetUserName,
        moderator_id: null, moderator_name: 'Site Admin',
      })
      return NextResponse.json({ success: true })
    }

    if (action === 'ban') {
      const { error } = await admin
        .from('chat_cafe_profiles')
        .update({ is_banned: true, ban_reason: reason || 'Severe disruption / harassment', updated_at: new Date().toISOString() })
        .eq('id', targetUserId)
      if (error) throw new Error(error.message)
      await admin.from('chat_cafe_moderation_logs').insert({
        action: 'ban', target_user_id: targetUserId, target_user_name: targetUserName,
        moderator_id: null, moderator_name: 'Site Admin', reason,
      })
      return NextResponse.json({ success: true })
    }

    if (action === 'unban') {
      const { error } = await admin
        .from('chat_cafe_profiles')
        .update({ is_banned: false, ban_reason: null, updated_at: new Date().toISOString() })
        .eq('id', targetUserId)
      if (error) throw new Error(error.message)
      await admin.from('chat_cafe_moderation_logs').insert({
        action: 'unban', target_user_id: targetUserId, target_user_name: targetUserName,
        moderator_id: null, moderator_name: 'Site Admin',
      })
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch (error: any) {
    console.error('Admin chat-cafe moderate POST error:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
