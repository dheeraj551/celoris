import { NextResponse } from 'next/server'
import { createSupabaseClientForServer } from '@/lib/supabase-client'

// Admin-only: edit, pause/resume, or remove one AI character.
export const dynamic = 'force-dynamic'

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: characterId } = await params
    const body = await request.json()
    const updates: Record<string, any> = { updated_at: new Date().toISOString() }

    if (typeof body.name === 'string' && body.name.trim()) updates.name = body.name.trim().slice(0, 40)
    if (typeof body.avatarId === 'string') updates.avatar_id = body.avatarId
    if (typeof body.avatarColor === 'string') updates.avatar_color = body.avatarColor
    if (typeof body.accessory === 'string') updates.accessory = body.accessory
    if (typeof body.backstory === 'string') updates.backstory = body.backstory.slice(0, 2000)
    if (typeof body.personality === 'string') updates.personality = body.personality.slice(0, 1000)
    if (typeof body.isActive === 'boolean') updates.is_active = body.isActive

    const admin = createSupabaseClientForServer()
    const { data, error } = await admin
      .from('chat_cafe_ai_characters')
      .update(updates)
      .eq('id', characterId)
      .select('*')
      .single()

    if (error) throw new Error(error.message)
    return NextResponse.json({ character: data })
  } catch (error: any) {
    console.error('Admin chat-cafe ai-character PATCH error:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: characterId } = await params
    const admin = createSupabaseClientForServer()
    // Past messages keep their ai_character_id set to null (ON DELETE SET
    // NULL) rather than being removed, so chat history stays intact.
    const { error } = await admin.from('chat_cafe_ai_characters').delete().eq('id', characterId)
    if (error) throw new Error(error.message)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Admin chat-cafe ai-character DELETE error:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
