// Environment Variables Diagnostic
console.log('=== ENVIRONMENT DIAGNOSTIC ===')

// Check if environment variables are loaded
console.log('SUPABASE_URL:', process.env.SUPABASE_URL)
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log('SUPABASE_ANON_KEY exists:', !!process.env.SUPABASE_ANON_KEY)
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

// Test Supabase connection
import { createSupabaseClient } from '@/lib/supabase-client'

async function testConnection() {
  try {
    console.log('=== TESTING SUPABASE CONNECTION ===')
    const supabase = createSupabaseClient()
    
    // Test basic query
    const { data, error } = await supabase
      .from('courses')
      .select('id, title')
      .limit(1)
    
    if (error) {
      console.error('Database Error:', error)
    } else {
      console.log('Database Success:', data)
    }
    
  } catch (error) {
    console.error('Connection Error:', error)
  }
}

testConnection()