// Admin authentication for admin API routes.
//
// The real gate is proxy.ts (it runs before every /api/admin/* route and
// only lets through signed-in accounts with users.role 'admin' /
// 'super_admin'). This helper repeats that check for routes that want the
// admin's details, and it no longer trusts the old browser-supplied
// "x-admin-session" header, which anyone could forge.

import { NextRequest, NextResponse } from 'next/server'
import { createRouteClient } from '@/lib/supabase-server'
import { createSupabaseClientForServer } from '@/lib/supabase-client'

const ADMIN_ROLES = ['admin', 'super_admin']

export const authenticateAdmin = async (request: NextRequest) => {
  try {
    const supabase: any = await createRouteClient()
    const bearer = request.headers.get('authorization')?.match(/^Bearer\s+(.+)$/i)?.[1]
    const { data } = bearer ? await supabase.auth.getUser(bearer) : await supabase.auth.getUser()
    const user = data?.user
    if (!user) return { success: false as const, error: 'Not signed in', status: 401 }

    const admin: any = createSupabaseClientForServer()
    const { data: row } = await admin.from('users').select('role').eq('id', user.id).maybeSingle()
    const role = row?.role as string | undefined
    if (!role || !ADMIN_ROLES.includes(role)) {
      return { success: false as const, error: 'Not an admin account', status: 403 }
    }
    return { success: true as const, user: { id: user.id as string, email: (user.email || '') as string, role } }
  } catch (error) {
    console.error('Admin auth error:', error)
    return { success: false as const, error: 'Authentication error', status: 500 }
  }
}

export const createUnauthorizedResponse = (message: string = 'Unauthorized') => {
  return NextResponse.json({ error: message, code: 'UNAUTHORIZED' }, { status: 401 })
}

export const createErrorResponse = (error: string, status: number = 500) => {
  return NextResponse.json({ error, code: 'SERVER_ERROR' }, { status })
}
