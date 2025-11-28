// Complete Database Diagnostic Tool
// This will test every aspect of the blog system

const { createClient } = require('@supabase/supabase-js');

// Configuration
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://suaqywhmaheoansrinzw.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1YXF5d2htYWhlb2FucmluendwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ2Mzk2MjksImV4cCI6MjA1MDIxNTYyOX0.NkH3rCqZ_4sI6L5b8F0J_0L0M0g0gT4yO5p6QfQeQ4';

console.log("🔍 BLOG SYSTEM DIAGNOSTIC TOOL");
console.log("=" .repeat(50));

// Test 1: Environment Variables
console.log("\n📍 TEST 1: Environment Variables");
console.log(`SUPABASE_URL: ${process.env.SUPABASE_URL ? '✅ Set' : '❌ Missing'}`);
console.log(`SUPABASE_ANON_KEY: ${process.env.SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}`);

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    console.log("\n⚠️  WARNING: Missing environment variables!");
    console.log("Using default values for testing...");
}

// Test 2: Database Connection
console.log("\n📍 TEST 2: Database Connection");
try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log("✅ Supabase client created successfully");
    
    // Test basic connection
    const { data, error } = await supabase
        .from('blog_posts')
        .select('count', { count: 'exact', head: true });
    
    if (error) {
        console.log(`❌ Database connection failed: ${error.message}`);
        console.log("Error details:", error);
    } else {
        console.log(`✅ Database connection successful`);
        console.log(`📊 Total blog posts in database: ${data?.length || 'unknown'}`);
    }
} catch (err) {
    console.log(`❌ Supabase client creation failed: ${err.message}`);
}

// Test 3: Check Blog Posts Data
console.log("\n📍 TEST 3: Blog Posts Data");
try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    // Get all blog posts with detailed info
    const { data: posts, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });
    
    if (error) {
        console.log(`❌ Failed to fetch blog posts: ${error.message}`);
        console.log("Error details:", error);
    } else {
        console.log(`✅ Successfully fetched ${posts?.length || 0} blog posts`);
        
        if (posts && posts.length > 0) {
            console.log("\n📝 Post Details:");
            posts.forEach((post, index) => {
                console.log(`\n${index + 1}. ${post.title}`);
                console.log(`   ID: ${post.id}`);
                console.log(`   Published: ${post.is_published ? '✅ YES' : '❌ NO'}`);
                console.log(`   Status: ${post.status}`);
                console.log(`   Created: ${new Date(post.created_at).toLocaleDateString()}`);
                console.log(`   Author: ${post.author_name}`);
            });
            
            // Check for published posts
            const publishedPosts = posts.filter(post => post.is_published === true);
            console.log(`\n📊 Published Posts Count: ${publishedPosts.length}`);
            
            if (publishedPosts.length === 0) {
                console.log("❌ No published posts found! This is the root cause.");
            } else {
                console.log("✅ Published posts found");
            }
        } else {
            console.log("❌ No blog posts found in database");
        }
    }
} catch (err) {
    console.log(`❌ Unexpected error: ${err.message}`);
}

// Test 4: Test API Route Logic
console.log("\n📍 TEST 4: API Route Logic Simulation");
try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    // Simulate the exact same query that the API route makes
    const { data: apiPosts, error: apiError } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });
    
    if (apiError) {
        console.log(`❌ API route query failed: ${apiError.message}`);
        console.log("Error details:", apiError);
    } else {
        console.log(`✅ API route simulation successful`);
        console.log(`📊 Posts that API should return: ${apiPosts?.length || 0}`);
        
        if (apiPosts && apiPosts.length > 0) {
            console.log("\n📝 Posts that would appear on homepage:");
            apiPosts.forEach((post, index) => {
                console.log(`   ${index + 1}. ${post.title}`);
            });
        } else {
            console.log("❌ No posts would appear on homepage!");
            console.log("This explains why you're seeing sample data.");
        }
    }
} catch (err) {
    console.log(`❌ API simulation error: ${err.message}`);
}

// Test 5: Check RLS Policies
console.log("\n📍 TEST 5: RLS Policy Check");
try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    // Try to access the table to see if RLS is blocking access
    const { data: policyTest, error: policyError } = await supabase
        .from('blog_posts')
        .select('id, title, is_published')
        .limit(1);
    
    if (policyError) {
        console.log(`❌ RLS Policy blocking access: ${policyError.message}`);
        console.log("This means the RLS policies are too restrictive.");
        
        if (policyError.message.includes('policy')) {
            console.log("\n🔧 SOLUTION: Fix RLS policies to allow public read access");
            console.log("Run the SQL script from fix_blog_rls_policies.sql");
        }
    } else {
        console.log("✅ RLS policies allow access");
    }
} catch (err) {
    console.log(`❌ RLS test error: ${err.message}`);
}

// Test 6: Sample Data Check
console.log("\n📍 TEST 6: Sample Data Check");
console.log("🔍 Check if your API routes have fallback sample data:");
console.log("Look for files like:");
console.log("   - /app/api/blog/route.ts");
console.log("   - /app/api/blog/featured/route.ts");
console.log("   - /app/api/blog/[slug]/route.ts");
console.log("\nIf database queries fail, these routes might be returning sample data.");

console.log("\n" + "=" .repeat(50));
console.log("🎯 DIAGNOSIS COMPLETE");

console.log("\n📋 SUMMARY & NEXT STEPS:");
console.log("1. If 'Published Posts Count' is 0: Add posts with is_published = true");
console.log("2. If RLS policies are blocking: Run fix_blog_rls_policies.sql");
console.log("3. If environment variables are missing: Add SUPABASE_URL and SUPABASE_ANON_KEY to Vercel");
console.log("4. If database connection fails: Check Supabase project status");
console.log("5. If all tests pass but you still see sample data: Check API route error handling");

console.log("\n🔍 To run this diagnostic:");
console.log("node comprehensive-diagnostic.js");

// Export for use in other scripts
module.exports = {
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    testConnection: () => createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
};