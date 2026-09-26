// Who can see candidate exam results and send exam invites.
//
// Checked on the server from the signed-in session: an account whose
// users.role is admin / super_admin, or one of the owner emails that the
// Job Center screens already treat as admins. (The browser-side checks in
// ExamsHub / exam-results only hide buttons — this is the real gate.)

import { createRouteClient } from '@/lib/supabase-server'
import { createSupabaseClientForServer } from '@/lib/supabase-client'

export const EXAM_ADMIN_EMAILS = ['support@celorisdesigns.com', 'celoris.designs@gmail.com', 'dheerajkushwaha551@gmail.com']
const ADMIN_ROLES = ['admin', 'super_admin']

export async function isExamAdmin(): Promise<boolean> {
  try {
    const client: any = await createRouteClient()
    const {
      data: { user },
    } = await client.auth.getUser()
    if (!user) return false
    const email = String(user.email || '').toLowerCase()
    if (email && EXAM_ADMIN_EMAILS.indexOf(email) !== -1) return true
    const admin: any = createSupabaseClientForServer()
    const { data } = await admin.from('users').select('role').eq('id', user.id).maybeSingle()
    return !!data?.role && ADMIN_ROLES.indexOf(String(data.role)) !== -1
  } catch {
    return false
  }
}
