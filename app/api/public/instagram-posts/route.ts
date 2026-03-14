import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Get Instagram posts for the specified user
    // Since RLS is enabled with "Anyone can view" policy, this should work without authentication
    const { data: posts, error } = await supabase
      .from('instagram_posts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching public Instagram posts:', error);
      return NextResponse.json({ error: 'Failed to fetch Instagram posts' }, { status: 500 });
    }

    // Return simplified data for public display
    const publicPosts = posts?.map(post => ({
      id: post.id,
      instagram_url: post.instagram_url,
      media_url: post.media_url,
      caption: post.caption,
      post_type: post.post_type,
      embed_html: post.embed_html,
      created_at: post.created_at
    })) || [];

    return NextResponse.json({ posts: publicPosts });
  } catch (error) {
    console.error('Error in public Instagram posts API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
