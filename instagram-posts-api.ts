// Complete Instagram Posts API Endpoint
// Add this as your Instagram posts API endpoint

// Instagram Posts API - Complete Implementation
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY!
);

// GET /api/instagram-posts - Get all Instagram posts
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('x-admin-session');
    
    // Call the database function
    const { data, error } = await supabase.rpc('get_instagram_posts');
    
    if (error) {
      console.error('Get Instagram posts error:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Get Instagram posts catch error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/instagram-posts - Create new Instagram post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { instagram_url } = body;
    
    // Validate input
    if (!instagram_url || !instagram_url.includes('instagram.com')) {
      return NextResponse.json(
        { success: false, error: 'Valid Instagram URL is required' },
        { status: 400 }
      );
    }
    
    // Call the database function
    const { data, error } = await supabase.rpc('create_instagram_post', {
      p_instagram_url: instagram_url
    });
    
    if (error) {
      console.error('Create Instagram post error:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Create Instagram post catch error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/instagram-posts/[id] - Delete Instagram post
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('id');
    
    if (!postId) {
      return NextResponse.json(
        { success: false, error: 'Post ID is required' },
        { status: 400 }
      );
    }
    
    // Call the database function
    const { data, error } = await supabase.rpc('delete_instagram_post', {
      p_post_id: postId
    });
    
    if (error) {
      console.error('Delete Instagram post error:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Delete Instagram post catch error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}