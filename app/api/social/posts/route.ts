import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseClientForServer } from '@/lib/supabase-client';
import { createRouteClient } from '@/lib/supabase-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(request: NextRequest) {
  try {
    const admin = createSupabaseClientForServer();

    // 1. Fetch real posts from Supabase posts table
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
      .limit(50);

    if (postsError) {
      console.error('Error querying posts table:', postsError);
    }

    // 2. Fetch author profiles from public.users and public.profiles
    const authorMap: Record<string, any> = {};
    if (realPosts && realPosts.length > 0) {
      const validUserIds = Array.from(
        new Set(realPosts.map((p: any) => p.user_id).filter((id: any) => typeof id === 'string' && UUID_REGEX.test(id)))
      );

      if (validUserIds.length > 0) {
        try {
          const { data: usersData } = await admin
            .from('users')
            .select('id, full_name, username, role, profile_pic_url, wallet_balance')
            .in('id', validUserIds);

          if (usersData) {
            usersData.forEach((u: any) => {
              authorMap[u.id] = {
                id: u.id,
                username: (u.username || 'student').toLowerCase().replace(/[^a-z0-9_]/g, ''),
                name: u.full_name || u.username || 'Celoris Student',
                avatar: u.profile_pic_url || '/courses/digital-marketing-mastery-og.jpg',
                role: u.role || 'Creator & Student',
                isVerified: u.role === 'admin' || u.role === 'instructor',
              };
            });
          }
        } catch (e) {
          console.warn('Error reading users table for social authors:', e);
        }

        try {
          const { data: profilesData } = await admin
            .from('profiles')
            .select('id, name, full_name, email, role, avatar_url')
            .in('id', validUserIds);

          if (profilesData) {
            profilesData.forEach((p: any) => {
              if (!authorMap[p.id]) {
                const username = p.email ? p.email.split('@')[0] : (p.name || 'student');
                authorMap[p.id] = {
                  id: p.id,
                  username: username.toLowerCase().replace(/[^a-z0-9_]/g, ''),
                  name: p.full_name || p.name || 'Celoris Student',
                  avatar: p.avatar_url || '/courses/digital-marketing-mastery-og.jpg',
                  role: p.role || 'Creator & Student',
                  isVerified: p.role === 'admin' || p.role === 'instructor',
                };
              }
            });
          }
        } catch (e) {
          console.warn('Error reading profiles table for social authors:', e);
        }
      }
    }

    // 3. Fetch active student ad campaigns
    let activeCampaigns: any[] = [];
    try {
      const { data: camps } = await admin
        .from('pulse_campaigns')
        .select('*')
        .eq('status', 'Active')
        .order('created_at', { ascending: false })
        .limit(10);
      if (camps) activeCampaigns = camps;
    } catch (e) {
      console.warn('Error reading pulse_campaigns:', e);
    }

    // Map posts into Lumigram Post model
    const mappedPosts = (realPosts || []).map((p: any) => {
      const author = (p.user_id && authorMap[p.user_id]) ? authorMap[p.user_id] : {
        id: p.user_id || 'student',
        username: 'celoris_student',
        name: 'Celoris Student',
        avatar: '/courses/digital-marketing-mastery-og.jpg',
        role: 'Creator & Student',
        isVerified: false,
      };

      let images: string[] = [];
      if (Array.isArray(p.image_urls) && p.image_urls.length > 0) {
        images = p.image_urls;
      } else if (p.media_url) {
        images = [p.media_url];
      }

      const caption = p.content || '';
      const extractedTags = caption
        .split(/\s+/)
        .filter((w: string) => w.startsWith('#'))
        .map((w: string) => w.replace('#', '').toLowerCase());

      return {
        id: p.id,
        userId: p.user_id || author.id,
        caption,
        images,
        location: p.location || '',
        filter: 'normal',
        aspectRatio: 'square',
        likesCount: p.likes_count || 0,
        isLiked: false,
        isSaved: false,
        commentsCount: p.comments_count || 0,
        comments: [],
        tags: extractedTags.length ? extractedTags : ['celoris', 'social'],
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
        user: author,
      };
    });

    return NextResponse.json({
      success: true,
      posts: mappedPosts,
      campaigns: activeCampaigns,
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

    let userId: string | null = null;
    let authorProfile: any = null;

    // 1. Resolve user ID from session if possible
    try {
      const client = await createRouteClient();
      const { data: { user } } = await client.auth.getUser();
      if (user?.id && UUID_REGEX.test(user.id)) {
        userId = user.id;
      }
    } catch {
      // Non-blocking
    }

    // 2. Check explicit userId if passed and valid UUID
    if (!userId && explicitUserId && UUID_REGEX.test(explicitUserId)) {
      userId = explicitUserId;
    }

    if (!content && (!imageUrls || imageUrls.length === 0)) {
      return NextResponse.json(
        { error: 'Post must have either text or an image' },
        { status: 400 }
      );
    }

    const admin = createSupabaseClientForServer();

    // 3. Fetch author profile if userId is valid UUID
    if (userId) {
      try {
        const { data: userRow } = await admin
          .from('users')
          .select('id, full_name, username, role, profile_pic_url')
          .eq('id', userId)
          .maybeSingle();

        if (userRow) {
          authorProfile = {
            id: userRow.id,
            username: (userRow.username || 'student').toLowerCase().replace(/[^a-z0-9_]/g, ''),
            name: userRow.full_name || userRow.username || 'Celoris Student',
            avatar: userRow.profile_pic_url || '/courses/digital-marketing-mastery-og.jpg',
            role: userRow.role || 'Creator & Student',
            isVerified: userRow.role === 'admin' || userRow.role === 'instructor',
          };
        }
      } catch (err) {
        console.warn('Could not fetch author profile:', err);
      }
    }

    const defaultAuthor = authorProfile || {
      id: userId || 'student',
      username: 'student',
      name: 'Celoris Student',
      avatar: '/courses/digital-marketing-mastery-og.jpg',
      role: 'Creator & Student',
      isVerified: false,
    };

    const firstImage = imageUrls && imageUrls.length > 0 ? imageUrls[0] : null;

    // 4. Insert post into Supabase posts table
    const { data: newPost, error: insertError } = await admin
      .from('posts')
      .insert({
        user_id: userId, // UUID or null
        content: content || '',
        image_urls: imageUrls || [],
        media_url: firstImage || '',
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
      console.error('Error inserting post in Supabase:', insertError);
      return NextResponse.json(
        { error: 'Failed to create post in database: ' + insertError.message },
        { status: 500 }
      );
    }

    const extractedTags = (content || '')
      .split(/\s+/)
      .filter((w: string) => w.startsWith('#'))
      .map((w: string) => w.replace('#', '').toLowerCase());

    return NextResponse.json({
      success: true,
      post: {
        id: newPost.id,
        userId: newPost.user_id || defaultAuthor.id,
        caption: newPost.content,
        images: Array.isArray(newPost.image_urls) && newPost.image_urls.length > 0
          ? newPost.image_urls
          : [newPost.media_url].filter(Boolean),
        location: newPost.location || '',
        filter: 'normal',
        aspectRatio: 'square',
        likesCount: 0,
        isLiked: false,
        isSaved: false,
        commentsCount: 0,
        comments: [],
        tags: extractedTags.length ? extractedTags : ['celoris', 'social'],
        createdAt: newPost.created_at,
        user: defaultAuthor,
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
