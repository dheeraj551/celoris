import { NextResponse } from 'next/server'
import { createSupabaseClientForServer } from '@/lib/supabase-client'
import { currentUserId } from '../../../_auth'
import { signedResultUrl } from '@/lib/higgsfield-jobs'

// Serves a finished image from R2 through our own domain. Same-origin means
// PhotoLite can draw it onto its canvas (no CORS "tainted canvas"), and the
// R2 bucket stays private. ?download=1 saves it as a file.

export const runtime = 'nodejs'
export const maxDuration = 60

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
    .maybeSingle()
  if (!data?.result_key) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const external = data.result_key.startsWith('ext:') ? data.result_key.slice(4) : null
  const upstream = await fetch(external || (await signedResultUrl(data.result_key)))
  if (!upstream.ok || !upstream.body) return NextResponse.json({ error: 'Image unavailable' }, { status: 502 })

  const type = upstream.headers.get('content-type') || 'image/png'
  const ext = external ? (type.includes('jpeg') ? 'jpg' : type.includes('webp') ? 'webp' : 'png') : data.result_key.split('.').pop() || 'png'
  const download = new URL(request.url).searchParams.get('download') === '1'
  const headers = new Headers({
    'Content-Type': type,
    'Cache-Control': 'private, max-age=86400',
  })
  const len = upstream.headers.get('content-length')
  if (len) headers.set('Content-Length', len)
  if (download) headers.set('Content-Disposition', `attachment; filename="${data.app === 'vio' ? 'vio-studio' : 'photolite-ai'}-${id.slice(0, 8)}.${ext}"`)
  return new Response(upstream.body, { status: 200, headers })
}
