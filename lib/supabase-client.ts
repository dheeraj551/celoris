import { createBrowserClient } from '@supabase/ssr'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

let browserClient: any = null

// Create Supabase client for client-side components (Next.js 15/16 compatible)
export const createClientForBrowser = () => {
  if (browserClient) return browserClient

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

  if (!url || !key) {
    console.error('Supabase URL or Anon Key is missing. Check your .env.local file.', {
      urlExists: !!url,
      keyExists: !!key,
      env: process.env.NODE_ENV
    })
  }
  
  browserClient = createBrowserClient(
    url || 'https://placeholder.supabase.co', // Use placeholder to avoid crash if missing
    key || 'placeholder-key'
  )
  
  return browserClient
}

// Create Supabase client for API routes & Server components
export const createSupabaseClientForServer = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  // Server code (API routes, server components) uses the service-role key, as
  // every route that calls this expects ("const admin = ..."). The anon key is
  // only a fallback when the service key is missing. Never import this in
  // browser code, and never return secret columns (room codes etc.) from a
  // public route.
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY

  if (!url) {
    throw new Error('Missing Supabase URL environment variable')
  }

  if (!key) {
    throw new Error('Missing SUPABASE_ANON_KEY or SUPABASE_SERVICE_ROLE_KEY environment variable')
  }

  return createSupabaseClient(url.trim(), key.trim(), {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }) as any
}

// Service-role client for server code that must work regardless of RLS and column
// privileges: admin API routes (gated by proxy.ts) and server-decided writes like
// bootcamp applications. Never use it in browser code, and never return secret
// columns (classroom codes etc.) from a public route.
export const createServiceRoleClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SERVICE_ROLE_KEY
  if (!url) throw new Error('Missing Supabase URL environment variable')
  if (!key) throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable')
  return createSupabaseClient(url.trim(), key.trim(), {
    auth: { autoRefreshToken: false, persistSession: false },
  }) as any
}

// Backward compatibility alias
export const createClient = createClientForBrowser
