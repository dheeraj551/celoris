// Who can use Celoris TV's Teacher Studio (publish lectures).
//
// Members whose plan has "Teacher Studio" switched on (Admin → Plans →
// Celoris TV; Pro and Max by default) and Celoris admins. Replaces the old
// "hold 5,000 credits in your wallet" rule.

import { createSupabaseClientForServer } from '@/lib/supabase-client'
import { getEntitlements, loadPlanSettings, upgradeLabelFor } from '@/lib/plans'

type AdminClient = ReturnType<typeof createSupabaseClientForServer>

const ADMIN_ROLES = ['admin', 'super_admin']

export interface StudioAccess {
  allowed: boolean
  planLabel: string
  /** The cheapest plan that includes Teacher Studio, e.g. "Pro" */
  requiredPlan: string
  isAdmin: boolean
}

export async function celorisTvStudioAccess(admin: AdminClient, userId: string): Promise<StudioAccess> {
  const db: any = admin
  const [ent, settings, { data: row }] = await Promise.all([
    getEntitlements(admin, userId),
    loadPlanSettings(admin),
    db.from('users').select('role').eq('id', userId).maybeSingle(),
  ])
  const isAdmin = !!row?.role && ADMIN_ROLES.indexOf(String(row.role)) !== -1
  return {
    allowed: isAdmin || ent.features.celoris_tv_studio === true,
    planLabel: ent.label,
    requiredPlan: upgradeLabelFor(settings, 'celoris_tv_studio'),
    isAdmin,
  }
}
