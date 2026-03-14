// Extract exact project reference from JWT
function extractProjectFromJWT(token) {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(Buffer.from(payload, 'base64').toString());
    return decoded.ref;
  } catch (error) {
    return null;
  }
}

// Your current keys
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1YXF5d2htYWhlb2FucmluendwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ2Mzk2MjksImV4cCI6MjA1MDIxNTYyOX0.NkH3rCqZ_4sI6L5b8F0J_0L0M0g0gT4yO5p6QfQeQ4';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1YXF5d2htYWhlb2FucmluendwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNDYzOTYyOSwiZXhwIjoyMDUwMjE1NjI5fQ.zW7gH8eQK5o7L2k4F3wM6yH8gU9c3L8Z2tW0m6Y4q4A';

console.log('🔍 EXTRACTING PROJECT REFERENCES FROM JWT TOKENS');
console.log('===================================================');

const anonProject = extractProjectFromJWT(anonKey);
const serviceProject = extractProjectFromJWT(serviceKey);

console.log('\n📊 PROJECT REFERENCES:');
console.log('Anon Key Project ID:', anonProject);
console.log('Service Key Project ID:', serviceProject);

console.log('\n🔍 COMPARISON WITH URL:');
const urlProject = 'suaqywhmaheoansrinzw';
console.log('Current Supabase URL:', 'https://' + urlProject + '.supabase.co');
console.log('JWT Project (Anon):', 'https://' + anonProject + '.supabase.co');
console.log('JWT Project (Service):', 'https://' + serviceProject + '.supabase.co');

console.log('\n❌ ISSUE IDENTIFIED:');
if (anonProject !== urlProject) {
  console.log('MISMATCH DETECTED!');
  console.log('- URL Project:', urlProject);
  console.log('- JWT Project:', anonProject);
  console.log('');
  console.log('This means your API keys belong to a DIFFERENT Supabase project');
  console.log('than the one you\'re trying to access.');
}

console.log('\n🎯 SOLUTION:');
console.log('1. Go to your Supabase dashboard: https://supabase.com/dashboard');
console.log('2. Find your CORRECT project that has your blog data');
console.log('3. Go to Settings → API');
console.log('4. Copy the CORRECT anon and service_role keys');
console.log('5. Update both .env.local and Vercel environment variables');
console.log('');
console.log('You likely copied API keys from a different project.');
