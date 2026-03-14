// Test corrected Supabase connection
const SUPABASE_URL = 'https://suaqywhmaheoanrinzwp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1YXF5d2htYWhlb2FucmluendwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ2Mzk2MjksImV4cCI6MjA1MDIxNTYyOX0.NkH3rCqZ_4sI6L5b8F0J_0L0M0g0gT4yO5p6QfQeQ4';

console.log('🔍 TESTING CORRECTED SUPABASE CONNECTION');
console.log('=========================================');
console.log('URL:', SUPABASE_URL);
console.log('Key (first 20 chars):', SUPABASE_ANON_KEY.substring(0, 20) + '...');

// Test with fetch
fetch(`${SUPABASE_URL}/rest/v1/blog_posts?select=id,title&limit=2`, {
  method: 'GET',
  headers: {
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  }
})
.then(response => {
  console.log('Status:', response.status);
  console.log('Status Text:', response.statusText);
  return response.json();
})
.then(data => {
  console.log('\n✅ SUCCESS! Response received:');
  console.log('Data:', JSON.stringify(data, null, 2));
  
  if (Array.isArray(data) && data.length > 0) {
    console.log('\n🎉 Found blog posts in database!');
    console.log('Number of posts:', data.length);
    console.log('Sample post:', data[0]);
  } else {
    console.log('\n📝 Database is accessible but no blog posts found.');
    console.log('This could mean:');
    console.log('1. The table exists but is empty');
    console.log('2. The table structure is different');
  }
})
.catch(error => {
  console.log('\n❌ ERROR:');
  console.log('Message:', error.message);
  
  if (error.message.includes('NetworkError') || error.message.includes('fetch')) {
    console.log('Network issue - server might not be running');
  }
});
