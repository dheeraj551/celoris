import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { Database } from './database.types'

// Environment variables validation
const getSupabaseConfig = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables. Please check your configuration.')
  }
  
  return { supabaseUrl, supabaseKey }
}

// Create Supabase client for client-side components
export const createClientForBrowser = () => {
  const { supabaseUrl, supabaseKey } = getSupabaseConfig()
  return createSupabaseClient<Database>(supabaseUrl, supabaseKey)
}

// Create Supabase client for API routes (with service role)
export const createSupabaseClientForServer = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SERVICE_ROLE_KEY
  
  if (!supabaseUrl) {
    throw new Error('Missing SUPABASE_URL environment variable')
  }
  
  if (!serviceRoleKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable')
  }
  
  return createSupabaseClient<Database>(supabaseUrl, serviceRoleKey)
}

// Backward compatibility - keep createClient for existing code
export const createClient = createClientForBrowser