import { NextResponse } from 'next/server'
import { currentUserId } from '../../ai/_auth'
import { HiggsfieldError, listMarketingPresets } from '@/lib/higgsfield-jobs'

// Higgsfield's official Marketing Studio templates (preset ids for
// enhance_prompt mode). Cached for an hour on the server.

export const runtime = 'nodejs'

export async function GET() {
  const userId = await currentUserId()
  if (!userId) return NextResponse.json({ error: 'Please sign in first.' }, { status: 401 })
  try {
    const presets = await listMarketingPresets()
    return NextResponse.json({ presets })
  } catch (err: any) {
    console.error('[ViO presets] error:', err?.message)
    return NextResponse.json({ presets: [], error: err?.message || 'Could not load templates.' }, { status: err instanceof HiggsfieldError ? err.status : 500 })
  }
}
