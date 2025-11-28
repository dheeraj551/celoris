import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Get user session from headers
    const session = request.headers.get('x-admin-session');
    if (!session) {
      return NextResponse.json({ error: 'No session provided' }, { status: 401 });
    }

    // Parse session to get user info
    const sessionData = JSON.parse(session);
    const userId = sessionData.id;

    if (!userId) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    const postId = params.id;

    if (!postId) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }

    // Delete the Instagram post (RLS policies will ensure user can only delete their own posts)
    const { error } = await supabase
      .from('instagram_posts')
      .delete()
      .eq('id', postId)
      .eq('user_id', userId); // Double check ownership

    if (error) {
      console.error('Error deleting Instagram post:', error);
      return NextResponse.json({ error: 'Failed to delete Instagram post' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in Instagram post delete API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}