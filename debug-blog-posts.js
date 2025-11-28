#!/usr/bin/env node

// Use the same client creation method as the app
const { createClientComponentClient } = require('@supabase/auth-helpers-nextjs');

// Create client the same way the app does it
const supabase = createClientComponentClient();

async function debugBlogPosts() {
  console.log('=== BLOG POSTS DEBUG ANALYSIS ===\n');

  console.log('🔍 Checking what the app actually tries to do...\n');

  // Test 1: Simple fetch - what the blog display tries
  console.log('1. Testing basic blog_posts fetch (like BlogDisplay does)...');
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.log('❌ Basic fetch error:', error.message);
      
      // Check if it's a permission/RLS issue
      if (error.message.includes('permission') || error.message.includes('policy')) {
        console.log('   💡 This is likely RLS (Row Level Security) blocking access');
        console.log('   💡 Solution: Enable public read access for blog_posts table');
      }
    } else if (!data || data.length === 0) {
      console.log('⚠️  No published blog posts found');
      console.log('   This could mean:');
      console.log('   - No posts created yet');
      console.log('   - Posts not marked as is_published = true');
      console.log('   - Posts are stuck in draft/review status');
    } else {
      console.log('✅ Found', data.length, 'blog posts');
      
      // Show first few posts to verify content
      data.slice(0, 3).forEach((post, index) => {
        console.log(`   ${index + 1}. ${post.title}`);
        console.log(`      Author: ${post.author_name}`);
        console.log(`      Published: ${post.is_published ? 'Yes' : 'No'}`);
        console.log(`      Featured: ${post.is_featured ? 'Yes' : 'No'}`);
        console.log(`      Status: ${post.status}`);
        console.log('');
      });
    }
  } catch (err) {
    console.log('❌ Exception:', err.message);
  }

  // Test 2: Featured posts specifically
  console.log('\n2. Testing featured posts fetch...');
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(3);

    if (error) {
      console.log('❌ Featured posts error:', error.message);
    } else if (!data || data.length === 0) {
      console.log('⚠️  No featured posts found');
      console.log('   This explains why featured section is empty!');
    } else {
      console.log('✅ Found', data.length, 'featured posts');
    }
  } catch (err) {
    console.log('❌ Featured posts exception:', err.message);
  }

  // Test 3: All posts regardless of status
  console.log('\n3. Testing ALL posts (any status)...');
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('id, title, status, is_published, is_featured, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.log('❌ All posts error:', error.message);
    } else if (!data || data.length === 0) {
      console.log('⚠️  No posts in database at all');
      console.log('   This means admin creation is not working!');
    } else {
      console.log('✅ Found', data.length, 'total posts in database:');
      
      // Show status breakdown
      const statusBreakdown = {};
      data.forEach(post => {
        const key = `${post.status} (published: ${post.is_published})`;
        statusBreakdown[key] = (statusBreakdown[key] || 0) + 1;
      });
      
      console.log('   Status breakdown:');
      Object.entries(statusBreakdown).forEach(([status, count]) => {
        console.log(`     - ${status}: ${count} posts`);
      });
    }
  } catch (err) {
    console.log('❌ All posts exception:', err.message);
  }

  // Test 4: Check if blog_posts table exists by counting
  console.log('\n4. Checking table existence...');
  try {
    const { count, error } = await supabase
      .from('blog_posts')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.log('❌ Table existence check error:', error.message);
      console.log('   This means the blog_posts table might not exist!');
    } else {
      console.log('✅ blog_posts table exists with', count, 'total records');
    }
  } catch (err) {
    console.log('❌ Table check exception:', err.message);
  }

  console.log('\n=== DIAGNOSIS SUMMARY ===');
  console.log('Based on the results above, the issue is most likely:');
  console.log('');
  console.log('SCENARIO 1: "No posts found" or "No published posts"');
  console.log('   → Admin posts are not being saved properly');
  console.log('   → Check if admin creation is actually working');
  console.log('');
  console.log('SCENARIO 2: "permission" or "policy" errors');
  console.log('   → RLS is blocking public access to blog_posts');
  console.log('   → Need to enable public read policy');
  console.log('');
  console.log('SCENARIO 3: "table does not exist" error');
  console.log('   → blog_posts table was never created');
  console.log('   → Need to run database migrations');
}

// Add Node.js polyfills if needed
if (typeof global.fetch === 'undefined') {
  global.fetch = require('node-fetch');
}

debugBlogPosts().catch(console.error);