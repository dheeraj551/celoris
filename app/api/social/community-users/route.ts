import { NextResponse } from 'next/server'
import { createSupabaseClientForServer } from '@/lib/supabase-client'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase: any = createSupabaseClientForServer()
    const { data, error } = await supabase
      .from('users')
      .select('id, username, full_name, bio, profile_pic_url, verification_status, is_online, allow_ai_simulation, last_active')
      .neq('is_social_blocked', true)
      .not('username', 'is', null)
      .order('last_active', { ascending: false, nullsFirst: false })
      .limit(30)

    if (error) {
      console.error('[community-users] query error:', error)
      return NextResponse.json({ users: [] })
    }

    const users = (data || [])
      .filter((u: any) => (u.username || '').trim().length > 1)
      .map((u: any) => {
        let avatar = ''
        if (u.profile_pic_url) {
          if (u.profile_pic_url.startsWith('http')) {
            avatar = u.profile_pic_url
          } else {
            const { data: pub } = supabase.storage.from('avatars').getPublicUrl(u.profile_pic_url)
            avatar = pub?.publicUrl || ''
          }
        }
        const displayName = (u.full_name || u.username || 'Creator').trim()
        if (!avatar) {
          avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=0f172a&color=fff`
        }

        return {
          id: u.id,
          username: u.username,
          name: displayName,
          avatar,
          bio: u.bio || 'Celoris Creator',
          isVerified: u.verification_status === 'verified',
          isPrivate: false,
          followersCount: 120,
          followingCount: 45,
          postsCount: 3,
          isFollowing: false,
          isOnline: Boolean(u.is_online),
          allowAiSimulation: Boolean(u.allow_ai_simulation),
        }
      })

    return NextResponse.json({ users })
  } catch (err: any) {
    console.error('[community-users] unexpected error:', err)
    return NextResponse.json({ users: [] })
  }
}
