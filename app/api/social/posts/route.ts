import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseClientForServer } from '@/lib/supabase-client';
import { createRouteClient } from '@/lib/supabase-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const admin = createSupabaseClientForServer();

    // 1. Fetch real posts from Supabase
    const { data: realPosts, error: postsError } = await admin
      .from('posts')
      .select(`
        id,
        user_id,
        content,
        image_urls,
        media_url,
        media_type,
        location,
        likes_count,
        comments_count,
        is_sponsored,
        sponsor_cta,
        sponsor_destination,
        hook,
        created_at
      `)
      .order('created_at', { ascending: false })
      .limit(30);

    // 2. Fetch author profiles for these posts
    let authorMap: Record<string, any> = {};
    if (realPosts && realPosts.length > 0) {
      const userIds = Array.from(new Set(realPosts.map((p: any) => p.user_id).filter(Boolean)));
      if (userIds.length > 0) {
        const { data: authors } = await admin
          .from('users')
          .select('id, full_name, email, role, avatar_url, wallet_balance')
          .in('id', userIds);

        if (authors) {
          authors.forEach((a: any) => {
            authorMap[a.id] = a;
          });
        }
      }
    }

    // 3. Fetch active student ad campaigns
    const { data: activeCampaigns } = await admin
      .from('pulse_campaigns')
      .select('*')
      .eq('status', 'Active')
      .order('created_at', { ascending: false })
      .limit(10);

    return NextResponse.json({
      success: true,
      posts: (realPosts || []).map((p: any) => {
        const author = authorMap[p.user_id] || {};
        const images = Array.isArray(p.image_urls) && p.image_urls.length > 0
          ? p.image_urls
          : p.media_url ? [p.media_url] : [];

        return {
          id: p.id,
          userId: p.user_id,
          caption: p.content || '',
          images,
          location: p.location || '',
          likesCount: p.likes_count || 0,
          commentsCount: p.comments_count || 0,
          isSponsored: !!p.is_sponsored,
          hook: p.hook || undefined,
          sponsorData: p.is_sponsored
            ? {
                buttonText: p.sponsor_cta || 'Send Message',
                destination: p.sponsor_destination || '/learn/course/digital-marketing-mastery',
                impressions: 1200,
                clicks: 34,
                cpc: '₹6.50',
                ctr: '2.8%',
                leads: 5,
                dailyBudget: 500,
              }
            : undefined,
          createdAt: p.created_at,
          user: {
            id: p.user_id,
            username: (author.email ? author.email.split('@')[0] : 'student').toLowerCase().replace(/[^a-z0-9_]/g, ''),
            name: author.full_name || 'Celoris Student',
            avatar: author.avatar_url || '/courses/digital-marketing-mastery-og.jpg',
            role: author.role || 'Digital Marketing Student',
            isVerified: author.role === 'admin' || author.role === 'instructor',
          },
        };
      }),
      campaigns: activeCampaigns || [],
    });
  } catch (error: any) {
    console.error('Error fetching social feed posts:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch social posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, imageUrls, location, hook, userId: explicitUserId } = body;

    let userId = explicitUserId;
    try {
      const client = await createRouteClient();
      const { data: { user } } = await client.auth.getUser();
      if (user?.id) {
        userId = user.id;
      }
    } catch {
      // Fallback to explicit
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'You must be signed in with your Celoris account to post' },
        { status: 401 }
      );
    }

    if (!content && (!imageUrls || imageUrls.length === 0)) {
      return NextResponse.json(
        { error: 'Post must have either text or an image' },
        { status: 400 }
      );
    }

    const admin = createSupabaseClientForServer();

    // Insert post into Supabase
    const { data: newPost, error: insertError } = await admin
      .from('posts')
      .insert({
        user_id: userId,
        content: content || '',
        image_urls: imageUrls || [],
        media_url: imageUrls && imageUrls[0] ? imageUrls[0] : null,
        media_type: 'image',
        location: location || null,
        hook: hook || null,
        is_public: true,
        likes_count: 0,
        comments_count: 0,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting post:', insertError);
      return NextResponse.json(
        { error: 'Failed to create post: ' + insertError.message },
        { status: 500 }
      );
    }

    // Get author info
    const { data: author } = await admin
      .from('users')
      .select('id, full_name, email, role, avatar_url')
      .eq('id', userId)
      .single();

    return NextResponse.json({
      success: true,
      post: {
        id: newPost.id,
        userId: newPost.user_id,
        caption: newPost.content,
        images: newPost.image_urls || [],
        location: newPost.location || '',
        likesCount: 0,
        commentsCount: 0,
        createdAt: newPost.created_at,
        user: {
          id: userId,
          username: (author?.email ? author.email.split('@')[0] : 'student').toLowerCase().replace(/[^a-z0-9_]/g, ''),
          name: author?.full_name || 'Celoris Student',
          avatar: author?.avatar_url || '/courses/digital-marketing-mastery-og.jpg',
          role: author?.role || 'Creator & Student',
        },
      },
    });
  } catch (error: any) {
    console.error('Error creating post in Supabase:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error creating post' },
      { status: 500 }
    );
  }
}
