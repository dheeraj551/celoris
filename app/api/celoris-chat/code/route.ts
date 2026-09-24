import { NextResponse } from 'next/server'
import { adminClient, generateShareCode, getCaller, getOrCreateChatProfile, jsonError } from '@/lib/celoris-chat-server'

export const dynamic = 'force-dynamic'

// POST: replace my share code with a new one (the old code stops working).
// Limited to once every 10 minutes.
export async function POST() {
  const user = await getCaller()
  if (!user) return jsonError('Please sign in first.', 401)

  try {
    const admin = adminClient()
    const me = await getOrCreateChatProfile(admin, user)
    if (me.code_reset_at && Date.now() - new Date(me.code_reset_at).getTime() < 10 * 60 * 1000) {
      return jsonError('You just changed your code. Try again in a few minutes.', 429)
    }
    for (let attempt = 0; attempt < 5; attempt++) {
      const code = generateShareCode()
      const now = new Date().toISOString()
      const { error } = await admin
        .from('celoris_chat_profiles')
        .update({ share_code: code, code_reset_at: now, updated_at: now })
        .eq('user_id', user.id)
      if (!error) return NextResponse.json({ shareCode: code })
      if (error.code !== '23505') throw error
    }
    return jsonError('Could not create a new code, please try again.', 500)
  } catch (err) {
    console.error('[celoris-chat/code]', err)
    return jsonError('Could not change your code right now.', 500)
  }
}
