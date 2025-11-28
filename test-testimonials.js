// Test Testimonials API Access
// This will check if testimonials are accessible with the correct API key

const SUPABASE_URL = 'https://suaqywhmaheoansrinzw.supabase.co';
const CORRECT_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1YXF5d2htYWhlb2Fuc3Jpbnp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyMTUxMDAsImV4cCI6MjA3ODc5MTEwMH0.UBkJ-Cx6fRNQucvSQS47XY2Nn6ktj_pZQRa7UiTQhf4';

async function testTestimonials() {
    console.log("🧪 TESTING TESTIMONIALS API ACCESS");
    console.log("=" .repeat(40));

    try {
        // Test 1: Direct database access
        console.log("\n📊 Test 1: Direct Database Access");
        const dbResponse = await fetch(`${SUPABASE_URL}/rest/v1/testimonials?select=id,client_name,client_company,is_visible&is_visible=eq.true&limit=3`, {
            headers: {
                'apikey': CORRECT_ANON_KEY,
                'Authorization': `Bearer ${CORRECT_ANON_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        if (dbResponse.ok) {
            const dbData = await dbResponse.json();
            console.log(`✅ Database access successful!`);
            console.log(`📝 Found ${dbData.length} visible testimonials`);
            
            if (dbData.length > 0) {
                console.log("\n📋 Visible Testimonials in Database:");
                dbData.forEach((testimonial, index) => {
                    console.log(`   ${index + 1}. ${testimonial.client_name} (${testimonial.client_company})`);
                });
                console.log("\n✅ Your testimonials should appear on the website!");
            } else {
                console.log("⚠️  No visible testimonials found in database");
            }
        } else {
            const errorText = await dbResponse.text();
            console.log(`❌ Database access failed: ${dbResponse.status} - ${errorText}`);
        }

        // Test 2: API endpoint
        console.log("\n📊 Test 2: API Endpoint Test");
        const apiResponse = await fetch(`${SUPABASE_URL}/api/testimonials`, {
            headers: {
                'apikey': CORRECT_ANON_KEY
            }
        });

        if (apiResponse.ok) {
            const apiData = await apiResponse.json();
            console.log(`✅ API endpoint accessible!`);
            console.log(`📝 API returns ${apiData.data?.length || 0} testimonials`);
            console.log(`📋 Source: ${apiData.source || 'database'}`);
            
            if (apiData.source === 'sample') {
                console.log("\n⚠️  API is returning SAMPLE data!");
                console.log("   This means the database query failed and it fell back to sample data.");
                console.log("   You need to fix the RLS policies in Supabase.");
            } else {
                console.log("\n✅ API is returning REAL data from database!");
            }
        } else {
            console.log(`❌ API endpoint failed: ${apiResponse.status}`);
        }

        // Test 3: Specific testimonials API
        console.log("\n📊 Test 3: Frontend API Test");
        const frontendResponse = await fetch('https://celorisdesigns.com/api/testimonials');
        
        if (frontendResponse.ok) {
            const frontendData = await frontendResponse.json();
            console.log(`✅ Frontend API accessible!`);
            console.log(`📝 Returns ${frontendData.data?.length || 0} testimonials`);
            console.log(`📋 Source: ${frontendData.source || 'database'}`);
            
            if (frontendData.source === 'sample') {
                console.log("\n⚠️  Website is showing SAMPLE testimonials!");
                console.log("   This confirms the same issue as blog posts.");
            } else {
                console.log("\n✅ Website is showing REAL testimonials!");
            }
        } else {
            console.log(`❌ Frontend API failed: ${frontendResponse.status}`);
        }

    } catch (error) {
        console.log(`❌ Error testing testimonials: ${error.message}`);
    }

    console.log("\n" + "=" .repeat(40));
    console.log("🎯 TESTIMONIALS DIAGNOSIS COMPLETE");
    console.log("\n📋 If you're seeing SAMPLE data:");
    console.log("1. Run fix-testimonials-rls.sql in Supabase");
    console.log("2. Update Vercel environment variables (already done for blog)");
    console.log("3. Redeploy (already done)");
    console.log("4. Your testimonials should appear!");
}

// Run the test
testTestimonials();