#!/usr/bin/env node

// Verify the project ID mismatch issue
console.log('=== SUPABASE PROJECT VERIFICATION ===\n');

// Current .env.local configuration
const CURRENT_URL = 'https://suaqywhmaheoansrinzw.supabase.co';
const PROJECT_FROM_URL = 'suaqywhmaheoansrinzw';

// API keys from environment
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1YXF5d2htYWhlb2FucmluendwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ2Mzk2MjksImV4cCI6MjA1MDIxNTYyOX0.NkH3rCqZ_4sI6L5b8F0J_0L0M0g0gT4yO5p6QfQeQ4';

try {
  // Decode JWT to get project reference
  const payload = JSON.parse(Buffer.from(ANON_KEY.split('.')[1], 'base64').toString());
  const PROJECT_FROM_KEY = payload.ref;
  
  console.log(`✓ Current .env.local URL: ${CURRENT_URL}`);
  console.log(`✓ Project ID from URL: ${PROJECT_FROM_URL}`);
  console.log(`✓ Project ID from API keys: ${PROJECT_FROM_KEY}`);
  
  console.log('\n=== ANALYSIS ===');
  if (PROJECT_FROM_URL === PROJECT_FROM_KEY) {
    console.log('✅ Project IDs MATCH - Configuration is correct!');
  } else {
    console.log('❌ Project IDs DO NOT MATCH - This is the problem!');
    console.log(`   Your API keys are for project: ${PROJECT_FROM_KEY}`);
    console.log(`   But your environment URL points to: ${PROJECT_FROM_URL}`);
  }
  
  console.log('\n=== SOLUTION ===');
  console.log('You need to get NEW API keys from your ACTUAL project:');
  console.log(`1. Go to https://supabase.com/dashboard`);
  console.log(`2. Find your project "${PROJECT_FROM_URL}"`);
  console.log(`3. Go to Settings → API`);
  console.log(`4. Copy the anon key and service_role_key`);
  console.log(`5. Update your .env.local file with the new keys`);
  
} catch (error) {
  console.log('❌ Error decoding JWT:', error.message);
}
