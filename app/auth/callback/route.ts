import { NextResponse } from 'next/server'
import { createRouteClient } from '@/lib/supabase-server'

// Handles the redirect back from Supabase OAuth (Google, LinkedIn, etc.) and
// magic-link sign-ins. `signInWithOAuth`/`signInWithOtp` calls elsewhere in
// the app point `redirectTo` at this route with a `?code=...` param; we
// exchange that code for a session cookie, then send the user on to
// wherever they were headed (default: the dashboard home).
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createRouteClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
    console.error('OAuth callback error:', error.message)
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_error`)
}
