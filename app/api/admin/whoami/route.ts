import { NextRequest, NextResponse } from 'next/server'
import { authenticateAdmin } from '@/lib/admin-auth'

// Used by /admin/login and the admin layout to confirm the signed-in account
// really is an admin (checked on the server).
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const auth = await authenticateAdmin(request)
  if (!auth.success) return NextResponse.json({ error: auth.error }, { status: auth.status })
  return NextResponse.json({ email: auth.user.email, role: auth.user.role, id: auth.user.id })
}
