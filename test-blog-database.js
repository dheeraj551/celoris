#!/usr/bin/env node

// Test blog posts database connection and data
const { createClient } = require('@supabase/supabase-js');

// Test both anon and service role connections
const supabaseAnon = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://suaqywhmaheoansrinzw.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1YXF5d2htYWhlb2FucmluendwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ2Mzk2MjksImV4cCI6MjA1MDIxNTYyOX0.NkH3rCqZ_4sI6L5b8F0J_0L0M0g0gT4yO5p6QfQeQ4'
);

const supabaseService = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://suaqywhmaheoansrinzw.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1YXF5d2htYWhlb2FucmluendwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNDYzOTYyOSwiZXhwIjoyMDUwMjE1NjI5fQ.zW7gH8eQK5o7L2k4F3wM6yH8gU9c3L8Z2tW0m6Y4q4A'
);

async function testBlogData() {
  console.log('=== BLOG POSTS DATABASE TEST ===\n');

  // Test 1: Check table existence with service role
  console.log('1. Testing service role connection...');
  try {
    const { data, error } = await supabaseService
      .from('blog_posts')
      .select('*', { count: 'exact' })
      .limit(1);

    if (error) {
      console.log('❌ Service role error:', error.message);
      console.log('   This could mean:');
      console.log('   - Table does not exist');
      console.log('   - No permission to access table');
      console.log('   - RLS blocking access');
    } else {
      console.log('✅ Service role connection working');
      console.log(`   Found ${data?.length || 0} records in blog_posts table`);
    }
  } catch (err) {
    console.log('❌ Service role exception:', err.message);
  }

  // Test 2: Check if any posts exist (service role)
  console.log('\n2. Checking for existing blog posts...');
  try {
    const { data: posts, error } = await supabaseService
      .from('blog_posts')
      .select('id, title, author_name, published_at, is_featured')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.log('❌ Error fetching posts:', error.message);
    } else if (!posts || posts.length === 0) {
      console.log('⚠️  No blog posts found in database');
      console.log('   This explains why homepage shows no posts!');
      console.log('   Your admin creation might not be saving properly.');
    } else {
      console.log('✅ Found blog posts:');
      posts.forEach((post, index) => {
        console.log(`   ${index + 1}. ${post.title} (${post.author_name})`);
        console.log(`      Published: ${post.published_at}`);
        console.log(`      Featured: ${post.is_featured ? 'Yes' : 'No'}`);
      });
    }
  } catch (err) {
    console.log('❌ Exception fetching posts:', err.message);
  }

  // Test 3: Check anon role access (for public frontend)
  console.log('\n3. Testing anon role (public access)...');
  try {
    const { data, error } = await supabaseAnon
      .from('blog_posts')
      .select('id, title')
      .limit(1);

    if (error) {
      console.log('❌ Anon role error:', error.message);
      console.log('   This means public users cannot see blog posts!');
      console.log('   Likely RLS (Row Level Security) issue.');
    } else {
      console.log('✅ Anon role can read blog posts');
    }
  } catch (err) {
    console.log('❌ Anon role exception:', err.message);
  }

  // Test 4: Check RLS status
  console.log('\n4. Checking RLS policies...');
  try {
    const { data: policies, error } = await supabaseService
      .from('blog_posts')
      .select('id') // Just to trigger any RLS checks
      .limit(1);

    if (error && error.message.includes('permission')) {
      console.log('❌ RLS is blocking access');
      console.log('   Solution: Enable public read access for blog_posts');
    } else if (error) {
      console.log('❌ Other error:', error.message);
    } else {
      console.log('✅ No RLS blocking detected');
    }
  } catch (err) {
    console.log('❌ RLS check exception:', err.message);
  }

  console.log('\n=== RECOMMENDATIONS ===');
  console.log('If posts exist but frontend shows nothing:');
  console.log('1. Enable RLS public read policy for blog_posts table');
  console.log('2. OR disable RLS temporarily for testing');
  console.log('3. Check if posts are marked as published: is_published = true');
}

// Add required Node.js polyfill for fetch in Node 18
if (typeof fetch === 'undefined') {
  global.fetch = require('node-fetch');
}

testBlogData().catch(console.error);
