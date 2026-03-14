// Diagnostic script to check API key differences
const SUPABASE_URL = 'https://suaqywhmaheoansrinzw.supabase.co';

console.log('🔍 API Key Diagnostic Tool');
console.log('=====================================');

// Decode JWT token function
function decodeJWT(token) {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(Buffer.from(payload, 'base64').toString());
    return decoded;
  } catch (error) {
    return null;
  }
}

// Current environment keys
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1YXF5d2htYWhlb2FucmluendwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ2Mzk2MjksImV4cCI6MjA1MDIxNTYyOX0.NkH3rCqZ_4sI6L5b8F0J_0L0M0g0gT4yO5p6QfQeQ4';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1YXF5d2htYWhlb2FucmluendwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNDYzOTYyOSwiZXhwIjoyMDUwMjE1NjI5fQ.zW7gH8eQK5o7L2k4F3wM6yH8gU9c3L8Z2tW0m6Y4q4A';

console.log('\n📊 Current Local Environment Keys:');
console.log('Anon Key (first 20 chars):', anonKey.substring(0, 20) + '...');
console.log('Service Key (first 20 chars):', serviceKey.substring(0, 20) + '...');

console.log('\n🔍 Key Analysis:');
const anonDecoded = decodeJWT(anonKey);
const serviceDecoded = decodeJWT(serviceKey);

console.log('Anon Key Role:', anonDecoded?.role || 'Unknown');
console.log('Service Key Role:', serviceDecoded?.role || 'Unknown');

if (anonKey === serviceKey) {
  console.log('❌ ERROR: Keys are identical! This is wrong.');
} else {
  console.log('✅ Keys are different (as they should be)');
}

console.log('\n🎯 Action Required:');
if (anonKey === serviceKey) {
  console.log('1. Go to Supabase Dashboard → Settings → API');
  console.log('2. Generate new keys to get distinct anon and service_role keys');
  console.log('3. Update both local .env.local AND Vercel environment variables');
} else {
  console.log('1. Check your Vercel environment variables');
  console.log('2. Make sure they match the keys shown above');
  console.log('3. If Vercel has same keys, update them with the correct values');
}

console.log('\n📋 Vercel Environment Variables to Update:');
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=' + anonKey);
console.log('SUPABASE_SERVICE_ROLE_KEY=' + serviceKey);
