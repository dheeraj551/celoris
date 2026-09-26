import { NextResponse } from 'next/server'
import { createSupabaseClientForServer } from '@/lib/supabase-client'
import { currentUserId } from '../../../_auth'
import { signedResultUrl } from '@/lib/higgsfield-jobs'

// A finished Motion Swap Studio / Seedance video. Redirects to a short-lived signed R2
// link (or Higgsfield's own link until the R2 copy is done) instead of
// streaming the file through a serverless function — videos are large and
// players need range requests. ?download=1 saves it as a file.

export const runtime = 'nodejs'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const userId = await currentUserId()
  if (!userId) return NextResponse.json({ error: 'Please sign in first.' }, { status: 401 })
  if (!/^[0-9a-f-]{36}$/i.test(id)) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const admin = createSupabaseClientForServer()
  const { data } = await admin
    .from('ai_generations')
    .select('result_key, app')
    .eq('id', id)
    .eq('user_id', userId)
    .in('app', ['motion-swap', 'seedance'])
    .maybeSingle()
  if (!data?.result_key) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const download = new URL(request.url).searchParams.get('download') === '1'
  let target: string
  if (data.result_key.startsWith('ext:')) {
    target = data.result_key.slice(4)
  } else {
    const ext = data.result_key.split('.').pop() || 'mp4'
    target = await signedResultUrl(
      data.result_key,
      60 * 60,
      download ? `attachment; filename="celoris-${data.app}-${id.slice(0, 8)}.${ext}"` : undefined
    )
  }
  return NextResponse.redirect(target, { status: 302, headers: { 'Cache-Control': 'private, no-store' } })
}
