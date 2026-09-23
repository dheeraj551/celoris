import { NextResponse } from 'next/server'
import { createRouteClient } from '@/lib/supabase-server'

// Where Supabase sends people back after Google/LinkedIn sign-in and magic
// links. Handles every shape Supabase can send:
//   ?code=...                  (PKCE — the normal case)
//   ?token_hash=...&type=...   (email-template style links)
//   #access_token=...          (implicit links — only the browser can read the
//                               part after #, so we hand off to /auth/confirm)
// Failures now carry the real reason so they can be diagnosed.

function safeNext(raw: string | null) {
  // Only allow same-site paths (blocks "//evil.com" / "@evil.com" redirects).
  if (!raw || !raw.startsWith('/') || raw.startsWith('//')) return '/'
  return raw
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const tokenHash = searchParams.get('token_hash')
  const type = searchParams.get('type') as any
  const next = safeNext(searchParams.get('next'))
  let reason = searchParams.get('error_description') || ''

  if (code || (tokenHash && type)) {
    const supabase = await createRouteClient()
    const { error } = code
      ? await supabase.auth.exchangeCodeForSession(code)
      : await supabase.auth.verifyOtp({ token_hash: tokenHash!, type })
    if (!error) return NextResponse.redirect(`${origin}${next}`)
    reason = error.message
    console.error('Auth callback error:', error.message)
  } else if (!reason) {
    // Probably an implicit-flow link: tokens are in the #fragment, which the
    // browser keeps across this redirect.
    return NextResponse.redirect(`${origin}/auth/confirm?next=${encodeURIComponent(next)}`)
  }

  return NextResponse.redirect(
    `${origin}/login?error=auth_callback_error&reason=${encodeURIComponent(reason.slice(0, 200))}`
  )
}
