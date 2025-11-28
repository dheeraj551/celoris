// Quick test script to verify Supabase connection
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://suaqywhmaheoansrinzw.supabase.co';

console.log('🔍 Testing Supabase Connection...');
console.log('📍 URL:', SUPABASE_URL);

// Test with a simple curl command
const { execSync } = require('child_process');

try {
  console.log('\n🔄 Testing API key...');
  const result = execSync(`curl -s "${SUPABASE_URL}/rest/v1/blog_posts?select=id&limit=1" \\
    -H "apikey: ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}" \\
    -H "Authorization: Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}"`, 
    { encoding: 'utf8' }
  );
  
  console.log('✅ Response:', result);
  
  if (result.includes('"error"')) {
    console.log('❌ API returned an error. Keys might be invalid.');
  } else {
    console.log('✅ API key is working!');
  }
} catch (error) {
  console.log('❌ Error testing API:', error.message);
}