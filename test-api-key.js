// Test Supabase API keys with direct HTTP request
const SUPABASE_URL = 'https://suaqywhmaheoansrinzw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1YXF5d2htYWhlb2FucmluendwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ2Mzk2MjksImV4cCI6MjA1MDIxNTYyOX0.NkH3rCqZ_4sI6L5b8F0J_0L0M0g0gT4yO5p6QfQeQ4';

console.log('Testing Supabase API key...');
console.log('URL:', SUPABASE_URL);
console.log('Key (first 20 chars):', SUPABASE_ANON_KEY.substring(0, 20) + '...');

// Test with a simple query to blog_posts table
fetch(`${SUPABASE_URL}/rest/v1/blog_posts?select=id&limit=1`, {
  method: 'GET',
  headers: {
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => {
  if (data.error) {
    console.error('❌ API Error:', data.error);
    console.error('Error details:', data);
  } else {
    console.log('✅ API Response successful!');
    console.log('Data received:', data);
  }
})
.catch(error => {
  console.error('❌ Network Error:', error.message);
});