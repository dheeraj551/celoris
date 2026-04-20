import { createBrowserClient } from '@supabase/ssr'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// Create Supabase client for client-side components (Next.js 15/16 compatible)
export const createClientForBrowser = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

  if (!url || !key) {
    console.error('Supabase URL or Anon Key is missing. Check your .env.local file.', {
      urlExists: !!url,
      keyExists: !!key,
      env: process.env.NODE_ENV
    })
  }
  
  return createBrowserClient(
    url || 'https://placeholder.supabase.co', // Use placeholder to avoid crash if missing
    key || 'placeholder-key'
  ) as any
}

// Create Supabase client for API routes (with service role key — bypasses RLS)
export const createSupabaseClientForServer = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SERVICE_ROLE_KEY

  if (!url) {
    throw new Error('Missing Supabase URL environment variable')
  }

  if (!serviceRoleKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable')
  }

  return createSupabaseClient(url.trim(), serviceRoleKey.trim(), {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }) as any
}

// Backward compatibility alias
export const createClient = createClientForBrowser
