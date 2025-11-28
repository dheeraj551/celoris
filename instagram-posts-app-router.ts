// Instagram Posts API Endpoint - App Router Version
// Use this if your project uses the new App Router (app/ directory)
// Place this file at: app/api/instagram-posts/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY!
);

export async function GET(request: NextRequest) {
  try {
    // Call our database function
    const { data, error } = await supabase.rpc('get_instagram_posts');
    
    if (error) {
      console.error('Get Instagram posts error:', error);
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to retrieve Instagram posts',
        details: error.message 
      }, { status: 500 });
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Get posts error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to retrieve Instagram posts',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { instagram_url } = await request.json();
    
    // Validate input
    if (!instagram_url) {
      return NextResponse.json({ 
        success: false, 
        error: 'Instagram URL is required' 
      }, { status: 400 });
    }
    
    // Validate Instagram URL format
    if (!instagram_url.includes('instagram.com')) {
      return NextResponse.json({ 
        success: false, 
        error: 'Please provide a valid Instagram URL' 
      }, { status: 400 });
    }
    
    // Call our database function to create the post
    const { data, error } = await supabase.rpc('create_instagram_post', {
      p_instagram_url: instagram_url
    });
    
    if (error) {
      console.error('Create Instagram post error:', error);
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to save Instagram post',
        details: error.message 
      }, { status: 500 });
    }
    
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Create post error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to save Instagram post',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('id');
    
    if (!postId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Post ID is required' 
      }, { status: 400 });
    }
    
    // Call our database function to delete the post
    const { data, error } = await supabase.rpc('delete_instagram_post', {
      p_post_id: postId
    });
    
    if (error) {
      console.error('Delete Instagram post error:', error);
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to delete Instagram post',
        details: error.message 
      }, { status: 500 });
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Delete post error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to delete Instagram post',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}