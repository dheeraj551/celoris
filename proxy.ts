import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

// Server-side gate for every /api/admin/* route (Next.js 16 "proxy", the
// successor to middleware.ts).
//
// Before this, the admin API had no server-side check at all: the admin
// panel was protected only by a flag in the browser's localStorage, so
// anyone who called these URLs directly could, for example, top up any
// wallet (/api/admin/recharge-wallet), delete users, or read every wallet
// transaction and application.
//
// Now each request must come from a real signed-in Supabase account whose
// public.users.role is 'admin' or 'super_admin' (checked on the server, can't
// be faked from the browser). The only exception is the café radio endpoint,
// which Chat Café moderators also use from inside the café.

export const config = {
  matcher: ['/api/admin/:path*'],
}

const ADMIN_ROLES = new Set(['admin', 'super_admin'])
const CAFE_STAFF_ROLES = new Set(['moderator', 'admin'])
const CAFE_STAFF_PATHS = [/^\/api\/admin\/chat-cafe\/tables\/[^/]+\/now-playing(\/sign-upload)?\/?$/]

function deny(status: number, error: string) {
  return NextResponse.json({ error, code: status === 401 ? 'UNAUTHORIZED' : 'FORBIDDEN' }, { status })
}

async function lookupRole(url: string, serviceKey: string, table: string, userId: string): Promise<string | null> {
  try {
    const res = await fetch(`${url}/rest/v1/${table}?id=eq.${encodeURIComponent(userId)}&select=role`, {
      headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` },
      cache: 'no-store',
    })
    if (!res.ok) return null
    const rows = (await res.json()) as Array<{ role?: string | null }>
    return rows?.[0]?.role ?? null
  } catch {
    return null
  }
}

export async function proxy(request: NextRequest) {
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '').trim()
  const anonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '').trim()
  const serviceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SERVICE_ROLE_KEY || '').trim()
  if (!url || !anonKey || !serviceKey) return deny(503, 'Admin API is not configured on the server.')

  // Keep any refreshed Supabase session cookies on the way out.
  let response = NextResponse.next({ request })
  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        response = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
      },
    },
  })

  const bearer = request.headers.get('authorization')?.match(/^Bearer\s+(.+)$/i)?.[1]
  const { data } = bearer ? await supabase.auth.getUser(bearer) : await supabase.auth.getUser()
  const user = data?.user
  if (!user) return deny(401, 'Admin sign-in required. Please sign in again at /admin/login.')

  const role = await lookupRole(url, serviceKey, 'users', user.id)
  if (role && ADMIN_ROLES.has(role)) return response

  if (CAFE_STAFF_PATHS.some((rx) => rx.test(request.nextUrl.pathname))) {
    const cafeRole = await lookupRole(url, serviceKey, 'chat_cafe_profiles', user.id)
    if (cafeRole && CAFE_STAFF_ROLES.has(cafeRole)) return response
  }

  return deny(403, 'This account does not have admin access.')
}
