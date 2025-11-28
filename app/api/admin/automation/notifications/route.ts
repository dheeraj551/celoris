import { NextRequest, NextResponse } from 'next/server';
import { createRouteClient } from '@/lib/supabase-server';

// GET /api/admin/automation/notifications?limit=50&unread_only=false
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const unreadOnly = searchParams.get('unread_only') === 'true';
    const type = searchParams.get('type');
    const severity = searchParams.get('severity');

    const supabase = createRouteClient();
    
    // Build query
    let query = supabase
      .from('admin_notifications')
      .select('*')
      .order('created_at', { ascending: false });

    // Apply filters
    if (unreadOnly) {
      query = query.eq('read', false);
    }
    if (type) {
      query = query.eq('type', type);
    }
    if (severity) {
      query = query.eq('severity', severity);
    }

    // Apply limit
    query = query.limit(limit);

    const { data: notifications, error } = await query;

    if (error) {
      console.error('Error fetching notifications:', error);
      return NextResponse.json(
        { error: 'Failed to fetch notifications' },
        { status: 500 }
      );
    }

    // Get unread count
    const { count: unreadCount } = await supabase
      .from('admin_notifications')
      .select('*', { count: 'exact', head: true })
      .eq('read', false);

    return NextResponse.json({
      success: true,
      data: notifications || [],
      meta: {
        unread_count: unreadCount || 0,
        total: notifications?.length || 0
      }
    });

  } catch (error) {
    console.error('Error in GET notifications:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/admin/automation/notifications - Mark notification as read
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { notification_id, mark_all_read = false } = body;

    const supabase = createRouteClient();

    if (mark_all_read) {
      // Mark all notifications as read
      const { error } = await supabase
        .from('admin_notifications')
        .update({ 
          read: true, 
          read_at: new Date().toISOString() 
        })
        .eq('read', false);

      if (error) {
        console.error('Error marking all notifications as read:', error);
        return NextResponse.json(
          { error: 'Failed to mark notifications as read' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'All notifications marked as read'
      });
    }

    if (!notification_id) {
      return NextResponse.json(
        { error: 'Notification ID is required' },
        { status: 400 }
      );
    }

    // Mark specific notification as read
    const { error } = await supabase
      .from('admin_notifications')
      .update({ 
        read: true, 
        read_at: new Date().toISOString() 
      })
      .eq('id', notification_id);

    if (error) {
      console.error('Error marking notification as read:', error);
      return NextResponse.json(
        { error: 'Failed to mark notification as read' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Notification marked as read'
    });

  } catch (error) {
    console.error('Error in POST notifications:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}