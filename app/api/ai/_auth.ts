import { createRouteClient } from '@/lib/supabase-server'

/** The signed-in user from the session cookie, or null. */
export async function currentUserId(): Promise<string | null> {
  try {
    const client = await createRouteClient()
    const {
      data: { user },
    } = await client.auth.getUser()
    return user?.id ?? null
  } catch {
    return null
  }
}
