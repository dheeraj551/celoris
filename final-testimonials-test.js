// Final Testimonials Fix Verification
// Test the complete solution after all fixes

const SUPABASE_URL = 'https://suaqywhmaheoansrinzw.supabase.co';
const CORRECT_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1YXF5d2htYWhlb2Fuc3Jpbnp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyMTUxMDAsImV4cCI6MjA3ODc5MTEwMH0.UBkJ-Cx6fRNQucvSQS47XY2Nn6ktj_pZQRa7UiTQhf4';

async function finalTestimonialsTest() {
    console.log("🎉 FINAL TESTIMONIALS FIX VERIFICATION");
    console.log("=" .repeat(50));

    try {
        // Test 1: Check cleaned database
        console.log("\n📊 Test 1: Clean Database State");
        const dbResponse = await fetch(`${SUPABASE_URL}/rest/v1/testimonials?select=*&order=is_featured.desc,display_order.asc,created_at.desc`, {
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
            const nonFeaturedTestimonials = visibleTestimonials.filter(t => !t.is_featured);
            
            console.log(`👁️  Visible testimonials: ${visibleTestimonials.length}`);
            console.log(`⭐ Featured testimonials: ${featuredTestimonials.length}`);
            console.log(`•  Non-featured testimonials: ${nonFeaturedTestimonials.length}`);
            
            console.log("\n📋 All Testimonials (should be unique now):");
            dbData.forEach((testimonial, index) => {
                const featuredIcon = testimonial.is_featured ? '⭐' : '•';
                console.log(`   ${index + 1}. ${featuredIcon} ${testimonial.client_name} (${testimonial.client_company || 'No Company'})`);
                console.log(`      Type: ${testimonial.testimonial_type}, Pages: ${testimonial.target_pages?.join(', ') || 'none'}`);
            });
            
        } else {
            const errorText = await dbResponse.text();
            console.log(`❌ Database access failed: ${dbResponse.status} - ${errorText}`);
        }

        // Test 2: Test API endpoint
        console.log("\n📊 Test 2: API Endpoint Test");
        try {
            const apiResponse = await fetch(`${SUPABASE_URL}/api/testimonials`, {
                headers: {
                    'apikey': CORRECT_ANON_KEY
                }
            });

            if (apiResponse.ok) {
                const apiData = await apiResponse.json();
                console.log(`✅ API endpoint works!`);
                console.log(`📝 API returns ${apiData.data?.length || 0} testimonials`);
                console.log(`📋 Source: ${apiData.source || 'unknown'}`);
                
                if (apiData.data && apiData.data.length > 0) {
                    console.log("\n📋 API Results (should be unique and properly ordered):");
                    apiData.data.forEach((testimonial, index) => {
                        const featuredIcon = testimonial.is_featured ? '⭐' : '•';
                        console.log(`   ${index + 1}. ${featuredIcon} ${testimonial.client_name} (${testimonial.client_company || 'No Company'})`);
                    });
                    
                    const featuredInApi = apiData.data.filter(t => t.is_featured).length;
                    console.log(`\n📊 Featured in API: ${featuredInApi}`);
                    
                    if (featuredInApi > 0) {
                        console.log("🎉 SUCCESS! Featured testimonials are now visible in API!");
                    } else {
                        console.log("⚠️  No featured testimonials in API response - may need to investigate");
                    }
                }
            } else {
                console.log(`❌ API endpoint failed: ${apiResponse.status}`);
            }
        } catch (apiError) {
            console.log(`❌ API test error: ${apiError.message}`);
        }

        // Test 3: Check website directly
        console.log("\n📊 Test 3: Website Display Test");
        try {
            const websiteResponse = await fetch('https://celorisdesigns.com/api/testimonials');
            if (websiteResponse.ok) {
                const websiteData = await websiteResponse.json();
                console.log(`✅ Website API accessible!`);
                console.log(`📝 Website shows ${websiteData.data?.length || 0} testimonials`);
                console.log(`📋 Source: ${websiteData.source || 'unknown'}`);
                
                if (websiteData.data && websiteData.data.length > 0) {
                    console.log("\n📋 Website Results:");
                    websiteData.data.forEach((testimonial, index) => {
                        console.log(`   ${index + 1}. ${testimonial.client_name} (${testimonial.client_company || 'No Company'})`);
                    });
                    
                    const featuredOnWebsite = websiteData.data.filter(t => t.is_featured).length;
                    console.log(`\n⭐ Featured on Website: ${featuredOnWebsite}`);
                    
                    if (featuredOnWebsite > 0) {
                        console.log("🎉 SUCCESS! Featured testimonials now appear on website!");
                    } else {
                        console.log("⚠️  No featured testimonials on website - need to investigate");
                    }
                }
            } else {
                console.log(`❌ Website API failed: ${websiteResponse.status}`);
            }
        } catch (error) {
            console.log(`❌ Website test error: ${error.message}`);
        }

    } catch (error) {
        console.log(`❌ Error during verification: ${error.message}`);
    }

    console.log("\n" + "=" .repeat(50));
    console.log("🎯 FINAL VERIFICATION COMPLETE");
    console.log("\n📋 Expected Results:");
    console.log("✅ No duplicate testimonials in database");
    console.log("✅ API shows unique testimonials ordered by featured first");
    console.log("✅ Featured testimonials (Sarah Johnson, Michael Chen, Emily Rodriguez) are visible");
    console.log("✅ Website shows both featured and non-featured testimonials");
    console.log("\n🔧 If not working:");
    console.log("1. Run cleanup-testimonials.sql in Supabase to remove duplicates");
    console.log("2. Redeploy the application with the fixed API route");
    console.log("3. Clear browser cache and test again");
}

// Run the final verification
finalTestimonialsTest();
