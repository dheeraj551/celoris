// Careful re-examination of JWT tokens
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

console.log('🔍 RE-EXAMINING JWT TOKENS');
console.log('=====================================');

// Extract full payload for inspection
function extractFullPayload(token) {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(Buffer.from(payload, 'base64').toString());
    return decoded;
  } catch (error) {
    return null;
  }
}

const anonPayload = extractFullPayload(anonKey);
const servicePayload = extractFullPayload(serviceKey);

console.log('\n📊 ANON KEY FULL PAYLOAD:');
console.log(JSON.stringify(anonPayload, null, 2));

console.log('\n📊 SERVICE KEY FULL PAYLOAD:');
console.log(JSON.stringify(servicePayload, null, 2));

console.log('\n🔍 PROJECT REFERENCES:');
const anonProject = extractProjectFromJWT(anonKey);
const serviceProject = extractProjectFromJWT(serviceKey);

console.log('Anon Key Project:', anonProject);
console.log('Service Key Project:', serviceProject);

console.log('\n🔍 VERIFICATION:');
const expectedProject = 'suaqywhmaheoansrinzw';
console.log('Expected Project:', expectedProject);
console.log('Anon matches expected:', anonProject === expectedProject);
console.log('Service matches expected:', serviceProject === expectedProject);

console.log('\n✅ CONCLUSION:');
if (anonProject === expectedProject && serviceProject === expectedProject) {
  console.log('Both keys belong to the CORRECT project:', expectedProject);
  console.log('Project ID mismatch was my error in analysis.');
} else {
  console.log('Keys still do not match the expected project.');
}