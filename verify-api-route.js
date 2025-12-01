
async function verifyApiRoute() {
    console.log('Verifying API Route http://localhost:3000/api/notice-board...');
    try {
        const response = await fetch('http://localhost:3000/api/notice-board?limit=5');
        console.log('Status:', response.status);

        if (response.ok) {
            const data = await response.json();
            console.log('✅ API call successful');
            console.log(`Found ${data.data?.length || 0} notices`);
        } else {
            console.error('❌ API call failed');
            const text = await response.text();
            console.error('Response:', text);
        }
    } catch (error) {
        console.error('❌ Network error:', error.message);
    }
}

verifyApiRoute();
