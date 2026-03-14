// Test Testimonials After RLS Fix
// Check what's happening with the testimonials display

const SUPABASE_URL = 'https://suaqywhmaheoansrinzw.supabase.co';
const CORRECT_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1YXF5d2htYWhlb2Fuc3Jpbnp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyMTUxMDAsImV4cCI6MjA3ODc5MTEwMH0.UBkJ-Cx6fRNQucvSQS47XY2Nn6ktj_pZQRa7UiTQhf4';

async function testAfterRlsFix() {
    console.log("🔍 TESTIMONIALS AFTER RLS FIX");
    console.log("=" .repeat(50));

    try {
        // Test 1: Check what's actually in database
        console.log("\n📊 Test 1: Database Content");
        const dbResponse = await fetch(`${SUPABASE_URL}/rest/v1/testimonials?select=*&order=display_order,created_at`, {
            headers: {
                'apikey': CORRECT_ANON_KEY,
                'Authorization': `Bearer ${CORRECT_ANON_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        if (dbResponse.ok) {
            const dbData = await dbResponse.json();
            console.log(`✅ Database accessible!`);
            console.log(`📝 Total testimonials: ${dbData.length}`);
            
            const visibleTestimonials = dbData.filter(t => t.is_visible === true);
            const featuredTestimonials = dbData.filter(t => t.is_featured === true);
            
            console.log(`👁️  Visible testimonials: ${visibleTestimonials.length}`);
            console.log(`⭐ Featured testimonials: ${featuredTestimonials.length}`);
            
            console.log("\n📋 All Testimonials in Database:");
            dbData.forEach((testimonial, index) => {
                console.log(`   ${index + 1}. ${testimonial.client_name} (${testimonial.client_company})`);
                console.log(`      Visible: ${testimonial.is_visible ? '✅' : '❌'}, Featured: ${testimonial.is_featured ? '⭐' : '•'}`);
                console.log(`      Type: ${testimonial.testimonial_type}, Pages: ${testimonial.target_pages?.join(', ') || 'none'}`);
            });
            
        } else {
            const errorText = await dbResponse.text();
            console.log(`❌ Database access failed: ${dbResponse.status} - ${errorText}`);
        }

        // Test 2: Test API with different parameters
        console.log("\n📊 Test 2: API Endpoint Tests");
        
        // Test homepage testimonials (what the frontend likely calls)
        console.log("\n🎯 Testing homepage endpoint...");
        const homepageResponse = await fetch(`${SUPABASE_URL}/api/testimonials`, {
            headers: {
                'apikey': CORRECT_ANON_KEY
            }
        });

        if (homepageResponse.ok) {
            const homepageData = await homepageResponse.json();
            console.log(`✅ Homepage API works!`);
            console.log(`📝 Returns ${homepageData.data?.length || 0} testimonials`);
            console.log(`📋 Source: ${homepageData.source || 'unknown'}`);
            
            if (homepageData.data && homepageData.data.length > 0) {
                console.log("\n📋 Homepage Testimonials:");
                homepageData.data.forEach((testimonial, index) => {
                    console.log(`   ${index + 1}. ${testimonial.client_name} (${testimonial.client_company})`);
                    console.log(`      Featured: ${testimonial.is_featured ? '⭐' : '•'}, Type: ${testimonial.testimonial_type}`);
                });
            }
        } else {
            console.log(`❌ Homepage API failed: ${homepageResponse.status}`);
        }

        // Test 3: Check website directly
        console.log("\n📊 Test 3: Website Display Check");
        try {
            const websiteResponse = await fetch('https://celorisdesigns.com/api/testimonials');
            if (websiteResponse.ok) {
                const websiteData = await websiteResponse.json();
                console.log(`✅ Website API accessible!`);
                console.log(`📝 Website shows ${websiteData.data?.length || 0} testimonials`);
                console.log(`📋 Source: ${websiteData.source || 'unknown'}`);
                
                if (websiteData.data && websiteData.data.length > 0) {
                    console.log("\n📋 Website Testimonials:");
                    websiteData.data.forEach((testimonial, index) => {
                        console.log(`   ${index + 1}. ${testimonial.client_name} (${testimonial.client_company})`);
                    });
                } else {
                    console.log("\n⚠️  No testimonials returned from website API!");
                }
            } else {
                console.log(`❌ Website API failed: ${websiteResponse.status}`);
            }
        } catch (error) {
            console.log(`❌ Website test error: ${error.message}`);
        }

        // Test 4: Direct database query for visible testimonials
        console.log("\n📊 Test 4: Direct Visible Testimonials Query");
        const visibleResponse = await fetch(`${SUPABASE_URL}/rest/v1/testimonials?select=*&is_visible=eq.true&order=display_order,created_at`, {
            headers: {
                'apikey': CORRECT_ANON_KEY,
                'Authorization': `Bearer ${CORRECT_ANON_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        if (visibleResponse.ok) {
            const visibleData = await visibleResponse.json();
            console.log(`✅ Visible testimonials query works!`);
            console.log(`📝 Found ${visibleData.length} visible testimonials`);
            
            if (visibleData.length > 0) {
                console.log("\n📋 All Visible Testimonials:");
                visibleData.forEach((testimonial, index) => {
                    console.log(`   ${index + 1}. ${testimonial.client_name} (${testimonial.client_company})`);
                    console.log(`      Featured: ${testimonial.is_featured ? '⭐' : '•'}, Type: ${testimonial.testimonial_type}`);
                    console.log(`      Target Pages: ${testimonial.target_pages?.join(', ') || 'none'}`);
                });
            }
        } else {
            const errorText = await visibleResponse.text();
            console.log(`❌ Visible testimonials query failed: ${visibleResponse.status} - ${errorText}`);
        }

    } catch (error) {
        console.log(`❌ Error: ${error.message}`);
    }

    console.log("\n" + "=" .repeat(50));
    console.log("🎯 DIAGNOSIS COMPLETE");
    console.log("\n📋 Next Steps Based on Results:");
    console.log("1. If visible testimonials exist but don't appear: API route needs filtering fix");
    console.log("2. If no testimonials visible: RLS policy might still need adjustment");
    console.log("3. If website shows fewer than database: Frontend filtering issue");
}

// Run the comprehensive test
testAfterRlsFix();
