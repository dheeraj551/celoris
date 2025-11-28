// Test Supabase API keys
import { createClient } from '@supabase/supabase-js';

// Load environment variables
const SUPABASE_URL = 'https://suaqywhmaheoansrinzw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1YXF5d2htYWhlb2FucmluendwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ2Mzk2MjksImV4cCI6MjA1MDIxNTYyOX0.NkH3rCqZ_4sI6L5b8F0J_0L0M0g0gT4yO5p6QfQeQ4';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testConnection() {
  console.log('Testing Supabase connection...');
  console.log('URL:', SUPABASE_URL);
  console.log('Key (first 20 chars):', SUPABASE_ANON_KEY.substring(0, 20) + '...');
  
  try {
    // Test connection with a simple query
    const { data, error } = await supabase
      .from('blog_posts')
      .select('id')
      .limit(1);
    
    if (error) {
      console.error('❌ Connection failed:', error.message);
      return false;
    } else {
      console.log('✅ Connection successful!');
      console.log('Sample data received:', data);
      return true;
    }
  } catch (err) {
    console.error('❌ Connection error:', err.message);
    return false;
  }
}

testConnection();