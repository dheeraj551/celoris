// Test script for Notice Board API
// Run this in your browser console or as a Node.js script

// Test GET request to fetch notices
async function testNoticeBoardAPI() {
  console.log('Testing Notice Board API...');
  
  try {
    // Test GET request
    console.log('\n1. Testing GET /api/notice-board');
    const response = await fetch('http://localhost:3000/api/notice-board?limit=3');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ GET request successful');
    console.log('Response data:', data);
    console.log(`Found ${data.data?.length || 0} notices`);
    console.log(`Total available: ${data.pagination?.total || 0}`);
    
    // Test POST request (uncomment if you want to test creating)
    console.log('\n2. Testing POST /api/notice-board (sample data)');
    
    const postData = {
      title: "API Test Notice",
      student_name: "API Test Student",
      subject: "API Test Subject",
      location: "API Test Location",
      contact_number: "1234567890",
      description: "This is a test notice created via API",
      priority: "normal",
      category: "tutoring",
      requirements: "API test requirements",
      duration: "1 month"
    };
    
    const postResponse = await fetch('http://localhost:3000/api/notice-board', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData)
    });
    
    if (postResponse.ok) {
      const postResult = await postResponse.json();
      console.log('✅ POST request successful');
      console.log('Created notice:', postResult);
    } else {
      console.log('⚠️ POST request failed (expected if not authenticated)');
      const errorText = await postResponse.text();
      console.log('Error details:', errorText);
    }
    
    console.log('\n✅ All API tests completed!');
    
  } catch (error) {
    console.error('❌ API test failed:', error);
    console.log('Make sure the development server is running on http://localhost:3000');
  }
}

// Run the test
testNoticeBoardAPI();

// Export for Node.js usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { testNoticeBoardAPI };
}
