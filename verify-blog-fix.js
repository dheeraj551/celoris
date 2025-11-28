#!/usr/bin/env node

// Verify Blog Fix Script
// Run this after applying all fixes to confirm everything works

console.log("🔍 BLOG SYSTEM VERIFICATION");
console.log("=" .repeat(40));

// Test configuration
const SUPABASE_URL = 'https://suaqywhmaheoansrinzw.supabase.co';
const CORRECT_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1YXF5d2htYWhlb2Fuc3Jpbnp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyMTUxMDAsImV4cCI6MjA3ODc5MTEwMH0.UBkJ-Cx6fRNQucvSQS47XY2Nn6ktj_pZQRa7UiTQhf4';

async function verifyBlogFix() {
    console.log("\n📊 Testing Database Access...");
    
    try {
        // Test 1: Check API key
        const response = await fetch(`${SUPABASE_URL}/rest/v1/blog_posts?select=id,title,is_published,status&is_published=eq.true&limit=3`, {
            headers: {
                'apikey': CORRECT_ANON_KEY,
                'Authorization': `Bearer ${CORRECT_ANON_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            console.log(`❌ HTTP Error: ${response.status} - ${response.statusText}`);
            const errorText = await response.text();
            console.log("Error details:", errorText);
            return false;
        }
        
        const posts = await response.json();
        console.log(`✅ Database connection successful!`);
        console.log(`📝 Found ${posts.length} published blog posts`);
        
        if (posts.length > 0) {
            console.log("\n📚 Your Published Posts:");
            posts.forEach((post, index) => {
                console.log(`   ${index + 1}. ${post.title}`);
                console.log(`      Status: ${post.status}, Published: ${post.is_published}`);
            });
            
            console.log("\n🎉 SUCCESS! Your blog posts should appear on the homepage.");
            console.log("✅ Database is accessible with correct API key");
            console.log("✅ RLS policies allow public read access");
            console.log("✅ Your admin posts are visible");
            
            return true;
        } else {
            console.log("⚠️  No published posts found in database.");
            console.log("   - Check if you have posts with is_published = true");
            console.log("   - Verify your RLS policies allow access");
            return false;
        }
        
    } catch (error) {
        console.log(`❌ Unexpected error: ${error.message}`);
        return false;
    }
}

// Run verification
verifyBlogFix().then(success => {
    console.log("\n" + "=" .repeat(40));
    if (success) {
        console.log("🎯 ALL TESTS PASSED!");
        console.log("Your blog system should now work correctly.");
        console.log("\n📋 Next steps:");
        console.log("1. ✅ Run complete-rls-fix.sql in Supabase");
        console.log("2. ✅ Update Vercel environment variables");
        console.log("3. ✅ Redeploy your application");
        console.log("4. ✅ Visit your homepage to see blog posts!");
    } else {
        console.log("❌ Some tests failed.");
        console.log("Please review the error messages above and:");
        console.log("1. Run complete-rls-fix.sql in Supabase");
        console.log("2. Ensure correct API key is used");
        console.log("3. Check RLS policies");
    }
});

// To run this script:
// node verify-blog-fix.js