// Test your Instagram Posts API
// Use this to test if your API endpoint is working correctly

// This should be added to your frontend component to test the API

async function testInstagramAPI() {
  const testURL = 'https://www.instagram.com/p/DOGnjUUkfhS/';
  
  try {
    console.log('Testing Instagram API with URL:', testURL);
    
    const response = await fetch('/api/instagram-posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add your admin session header if needed
        'x-admin-session': JSON.stringify({
          id: '550e8400-e29b-41d4-a716-446655440000',
          email: 'support@celorisdesigns.com',
          role: 'admin',
          timestamp: new Date().toISOString()
        })
      },
      body: JSON.stringify({
        instagram_url: testURL
      })
    });
    
    const result = await response.json();
    
    console.log('API Response Status:', response.status);
    console.log('API Response:', result);
    
    if (result.success) {
      console.log('✅ SUCCESS: Instagram post saved successfully!');
      console.log('Post ID:', result.post_id);
    } else {
      console.log('❌ FAILED:', result.error);
      if (result.details) {
        console.log('Details:', result.details);
      }
    }
    
  } catch (error) {
    console.error('❌ Network error:', error);
  }
}

// Call this function in your component
// Uncomment the line below to test
// testInstagramAPI();
