// DEPLOYMENT VERIFICATION SCRIPT
// Run this in browser console after deployment to verify everything works

console.log('🔍 DEPLOYMENT VERIFICATION STARTED');

// 1. Check admin session
console.log('\n1. Checking admin session...');
const session = localStorage.getItem('admin_session');
if (session) {
  const parsedSession = JSON.parse(session);
  console.log('✅ Admin session found:', {
    email: parsedSession.email,
    timestamp: new Date(parsedSession.timestamp).toISOString(),
    age_hours: Math.round((Date.now() - parsedSession.timestamp) / (1000 * 60 * 60))
  });
} else {
  console.log('❌ No admin session found');
}

// 2. Test admin API call
console.log('\n2. Testing admin API...');
async function testAdminAPI() {
  try {
    const response = await fetch('/api/admin/courses', {
      headers: {
        'x-admin-session': session,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('API Response:', response.status, response.statusText);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Admin API working:', {
        total_courses: data.courses?.length || 0,
        current_page: data.pagination?.page || 'N/A'
      });
    } else {
      const error = await response.json();
      console.log('❌ Admin API failed:', error);
    }
  } catch (error) {
    console.log('❌ Admin API error:', error.message);
  }
}
testAdminAPI();

// 3. Test Instagram API
console.log('\n3. Testing Instagram API...');
async function testInstagramAPI() {
  try {
    const response = await fetch('/api/instagram-posts', {
      headers: {
        'x-admin-session': session,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Instagram API Response:', response.status, response.statusText);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Instagram API working:', {
        total_posts: data.posts?.length || 0
      });
    } else {
      const error = await response.json();
      console.log('❌ Instagram API failed:', error);
    }
  } catch (error) {
    console.log('❌ Instagram API error:', error.message);
  }
}
testInstagramAPI();

// 4. Check browser compatibility
console.log('\n4. Browser compatibility check...');
console.log('✅ localStorage:', typeof(Storage) !== "undefined");
console.log('✅ fetch API:', typeof(fetch) !== "undefined");
console.log('✅ JSON:', typeof(JSON) !== "undefined");

// 5. Summary
console.log('\n📊 DEPLOYMENT VERIFICATION SUMMARY:');
console.log('✅ Check admin session format');
console.log('✅ Test admin course API');
console.log('✅ Test Instagram posting API');
console.log('✅ Verify browser compatibility');
console.log('\n🎯 If all tests show ✅, deployment is successful!');
console.log('🔴 If any tests show ❌, check the specific error messages above.');
