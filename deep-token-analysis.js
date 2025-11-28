// Deep analysis of Supabase JWT tokens
function decodeJWT(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return { error: 'Invalid JWT format' };
    }
    
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
    const header = JSON.parse(Buffer.from(parts[0], 'base64').toString());
    
    // Calculate expiration
    const now = Math.floor(Date.now() / 1000);
    const expiresAt = payload.exp;
    const timeUntilExpiration = expiresAt - now;
    
    return {
      header,
      payload,
      expiresAt,
      timeUntilExpiration,
      isExpired: timeUntilExpiration < 0,
      formattedExpiry: new Date(expiresAt * 1000).toISOString()
    };
  } catch (error) {
    return { error: error.message };
  }
}

console.log('🔍 Deep Supabase Token Analysis');
console.log('=====================================');

// Current keys from environment
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1YXF5d2htYWhlb2FucmluendwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ2Mzk2MjksImV4cCI6MjA1MDIxNTYyOX0.NkH3rCqZ_4sI6L5b8F0J_0L0M0g0gT4yO5p6QfQeQ4';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1YXF5d2htYWhlb2FucmluendwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNDYzOTYyOSwiZXhwIjoyMDUwMjE1NjI5fQ.zW7gH8eQK5o7L2k4F3wM6yH8gU9c3L8Z2tW0m6Y4q4A';
const SUPABASE_URL = 'https://suaqywhmaheoansrinzw.supabase.co';

console.log('\n📊 ANON KEY ANALYSIS:');
const anonDecoded = decodeJWT(anonKey);
console.log('✅ Decoded Successfully:', !anonDecoded.error);
if (anonDecoded.error) {
  console.log('❌ Error:', anonDecoded.error);
} else {
  console.log('Role:', anonDecoded.payload.role);
  console.log('Project ID:', anonDecoded.payload.ref);
  console.log('Issued At:', new Date(anonDecoded.payload.iat * 1000).toISOString());
  console.log('Expires At:', anonDecoded.formattedExpiry);
  console.log('Time Until Expiry:', Math.floor(anonDecoded.timeUntilExpiration / 3600), 'hours');
  console.log('Is Expired:', anonDecoded.isExpired);
}

console.log('\n📊 SERVICE_ROLE KEY ANALYSIS:');
const serviceDecoded = decodeJWT(serviceKey);
console.log('✅ Decoded Successfully:', !serviceDecoded.error);
if (serviceDecoded.error) {
  console.log('❌ Error:', serviceDecoded.error);
} else {
  console.log('Role:', serviceDecoded.payload.role);
  console.log('Project ID:', serviceDecoded.payload.ref);
  console.log('Issued At:', new Date(serviceDecoded.payload.iat * 1000).toISOString());
  console.log('Expires At:', serviceDecoded.formattedExpiry);
  console.log('Time Until Expiry:', Math.floor(serviceDecoded.timeUntilExpiration / 3600), 'hours');
  console.log('Is Expired:', serviceDecoded.isExpired);
}

console.log('\n🔍 COMPARATIVE ANALYSIS:');
console.log('Keys are different:', anonKey !== serviceKey);
console.log('Same project ID:', anonDecoded.payload?.ref === serviceDecoded.payload?.ref);
console.log('Roles are different:', anonDecoded.payload?.role !== serviceDecoded.payload?.role);

console.log('\n⚠️  POTENTIAL ISSUES:');
if (anonDecoded.isExpired) {
  console.log('❌ ANON KEY IS EXPIRED! This is a major issue.');
}
if (serviceDecoded.isExpired) {
  console.log('❌ SERVICE ROLE KEY IS EXPIRED! This is a major issue.');
}
if (anonDecoded.timeUntilExpiration < 24 * 3600) {
  console.log('⚠️ ANON key expires soon (within 24 hours)');
}
if (serviceDecoded.timeUntilExpiration < 24 * 3600) {
  console.log('⚠️ SERVICE key expires soon (within 24 hours)');
}

console.log('\n🎯 NEXT STEPS:');
if (anonDecoded.isExpired || serviceDecoded.isExpired) {
  console.log('1. Keys are expired - generate new keys from Supabase dashboard');
} else {
  console.log('1. Keys are valid and not expired');
  console.log('2. Check Supabase project settings for any restrictions');
  console.log('3. Verify API endpoint URL and method');
  console.log('4. Check if Supabase project is paused/suspended');
}