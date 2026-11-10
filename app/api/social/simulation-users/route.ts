import { NextResponse } from 'next/server'
import { createSupabaseClientForServer } from '@/lib/supabase-client'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase: any = createSupabaseClientForServer()
    const { data, error } = await supabase
      .from('users')
      .select('id, username, full_name, bio, profile_pic_url, verification_status')
      .eq('allow_ai_simulation', true)
      .neq('is_social_blocked', true)
      .limit(100)

    if (error) {
      console.error('[simulation-users] query error:', error)
      return NextResponse.json({ users: [] })
    }

    const users = (data || []).map((u: any) => {
      let avatar = ''
      if (u.profile_pic_url) {
        if (u.profile_pic_url.startsWith('http')) {
          avatar = u.profile_pic_url
        } else {
          const { data: pub } = supabase.storage.from('avatars').getPublicUrl(u.profile_pic_url)
          avatar = pub?.publicUrl || ''
        }
      }
      const displayName = u.full_name || u.username || 'Creator'
      if (!avatar) {
        avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=0D8ABC&color=fff`
      }

      return {
        id: u.id,
        username: u.username || `creator_${String(u.id).slice(0, 6)}`,
        name: displayName,
        avatar,
        bio: u.bio || 'Celoris Community Creator',
        isVerified: u.verification_status === 'verified',
      }
    })

    return NextResponse.json({ users })
  } catch (err: any) {
    console.error('[simulation-users] unexpected error:', err)
    return NextResponse.json({ users: [] })
  }
}
