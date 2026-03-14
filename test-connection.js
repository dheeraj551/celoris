// test-supabase-connection.js
import { createClient } from '@supabase/supabase-js'

// Replace with your actual self-hosted Supabase details
const SUPABASE_URL = 'https://your-self-hosted-supabase.com'
const SUPABASE_ANON_KEY = 'your-anon-key'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function testConnection() {
  console.log('🔗 Testing Supabase connection...')
  
  try {
    // Test 1: Database connection
    console.log('📊 Testing database...')
    const { data, error } = await supabase
      .from('learn.courses')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('❌ Database error:', error.message)
    } else {
      console.log('✅ Database connection successful')
    }

    // Test 2: Authentication service
    console.log('🔐 Testing authentication...')
    const { data: session, error: authError } = await supabase.auth.getSession()
    
    if (authError) {
      console.error('❌ Auth error:', authError.message)
    } else {
      console.log('✅ Authentication service accessible')
      console.log('Current session:', session?.session ? 'Logged in' : 'Not logged in')
    }

    // Test 3: Auth signup test (won't actually create user)
    console.log('🧪 Testing signup endpoint...')
    try {
      const testAuth = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
        method: 'OPTIONS'
      })
      console.log('✅ Signup endpoint accessible:', testAuth.status)
    } catch (err) {
      console.error('❌ Signup endpoint failed:', err.message)
    }

  } catch (err) {
    console.error('❌ Connection test failed:', err.message)
  }
}

testConnection()
