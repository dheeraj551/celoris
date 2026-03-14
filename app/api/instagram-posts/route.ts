import { NextRequest, NextResponse } from 'next/server';
import { createRouteClient } from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
  try {
    const supabase = (await createRouteClient()) as any;
    // Get session from headers
    const sessionHeader = request.headers.get('x-admin-session');

    let sessionData = null;
    let isAuthenticated = false;
    let userId = null;
    let sessionEmail = null;

    if (sessionHeader) {
      try {
        sessionData = JSON.parse(sessionHeader);
        sessionEmail = sessionData.email;
        userId = sessionData.id;

        // Validate session format
        if (!sessionEmail || !sessionData.timestamp) {
          return NextResponse.json({ error: 'Invalid session format' }, { status: 401 });
        }

        // Check session age (24 hours)
        const sessionAge = Date.now() - sessionData.timestamp;
        if (sessionAge > 24 * 60 * 60 * 1000) {
          return NextResponse.json({ error: 'Session expired' }, { status: 401 });
        }

        // Check if it's an admin email
        if (['support@celorisdesigns.com', 'admin@celorisdesigns.com'].includes(sessionEmail)) {
          isAuthenticated = true;
          // Use admin fixed UUID if session ID is too short
          if (!userId || userId.length < 30) {
            userId = '550e8400-e29b-41d4-a716-446655440000';
          }
        }
      } catch (parseError) {
        console.error('Session parse error:', parseError);
        return NextResponse.json({ error: 'Invalid session JSON' }, { status: 401 });
      }
    }

    // If not authenticated via session, try Supabase auth
    if (!isAuthenticated) {
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
      if (!authError && authUser) {
        isAuthenticated = true;
        userId = authUser.id;
        sessionEmail = authUser.email;
      }
    }

    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Now fetch Instagram posts using the authenticated user
    const { data: posts, error } = await supabase
      .from('instagram_posts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Failed to fetch Instagram posts' }, { status: 500 });
    }

    return NextResponse.json({ posts: posts || [] });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = (await createRouteClient()) as any;
    // Get session from headers
    const sessionHeader = request.headers.get('x-admin-session');

    let sessionData = null;
    let isAuthenticated = false;
    let userId = null;
    let sessionEmail = null;

    if (sessionHeader) {
      try {
        sessionData = JSON.parse(sessionHeader);
        sessionEmail = sessionData.email;
        userId = sessionData.id;

        // Validate session format
        if (!sessionEmail || !sessionData.timestamp) {
          return NextResponse.json({ error: 'Invalid session format' }, { status: 401 });
        }

        // Check session age (24 hours)
        const sessionAge = Date.now() - sessionData.timestamp;
        if (sessionAge > 24 * 60 * 60 * 1000) {
          return NextResponse.json({ error: 'Session expired' }, { status: 401 });
        }

        // Check if it's an admin email
        if (['support@celorisdesigns.com', 'admin@celorisdesigns.com'].includes(sessionEmail)) {
          isAuthenticated = true;
          // Use admin fixed UUID if session ID is too short
          if (!userId || userId.length < 30) {
            userId = '550e8400-e29b-41d4-a716-446655440000';
          }
        }
      } catch (parseError) {
        console.error('Session parse error:', parseError);
        return NextResponse.json({ error: 'Invalid session JSON' }, { status: 401 });
      }
    }

    // If not authenticated via session, try Supabase auth
    if (!isAuthenticated) {
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
      if (!authError && authUser) {
        isAuthenticated = true;
        userId = authUser.id;
        sessionEmail = authUser.email;
      }
    }

    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Get request data
    const body = await request.json();
    const { postUrl } = body;

    if (!postUrl) {
      return NextResponse.json({ error: 'Instagram URL is required' }, { status: 400 });
    }

    // Use the fixed database function
    const { data, error } = await supabase.rpc('create_instagram_post', {
      p_instagram_url: postUrl,
      p_user_id: userId,
      p_session_email: sessionEmail
    });

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: `Failed to create Instagram post: ${error.message}` }, { status: 500 });
    }

    if (!data.success) {
      return NextResponse.json({ error: data.error || 'Failed to create Instagram post' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      post: data,
      message: 'Instagram post created successfully'
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = (await createRouteClient()) as any;
    // Get session from headers (similar to GET and POST)
    const sessionHeader = request.headers.get('x-admin-session');

    let sessionData = null;
    let isAuthenticated = false;
    let userId = null;
    let sessionEmail = null;

    if (sessionHeader) {
      try {
        sessionData = JSON.parse(sessionHeader);
        sessionEmail = sessionData.email;
        userId = sessionData.id;

        // Validate session format
        if (!sessionEmail || !sessionData.timestamp) {
          return NextResponse.json({ error: 'Invalid session format' }, { status: 401 });
        }

        // Check session age (24 hours)
        const sessionAge = Date.now() - sessionData.timestamp;
        if (sessionAge > 24 * 60 * 60 * 1000) {
          return NextResponse.json({ error: 'Session expired' }, { status: 401 });
        }

        // Check if it's an admin email
        if (['support@celorisdesigns.com', 'admin@celorisdesigns.com'].includes(sessionEmail)) {
          isAuthenticated = true;
          // Use admin fixed UUID if session ID is too short
          if (!userId || userId.length < 30) {
            userId = '550e8400-e29b-41d4-a716-446655440000';
          }
        }
      } catch (parseError) {
        console.error('Session parse error:', parseError);
        return NextResponse.json({ error: 'Invalid session JSON' }, { status: 401 });
      }
    }

    // If not authenticated via session, try Supabase auth
    if (!isAuthenticated) {
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
      if (!authError && authUser) {
        isAuthenticated = true;
        userId = authUser.id;
        sessionEmail = authUser.email;
      }
    }

    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Get the post ID from URL params
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('id');

    if (!postId) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }

    // Delete the post
    const { error } = await supabase
      .from('instagram_posts')
      .delete()
      .eq('id', postId)
      .eq('user_id', userId); // Ensure user can only delete their own posts

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Failed to delete Instagram post' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Instagram post deleted successfully' });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
