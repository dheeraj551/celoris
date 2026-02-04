import { NextRequest, NextResponse } from 'next/server';
import { createRouteClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

// GET /api/admin/automation/logs?limit=20&offset=0&automation_type=blog_generation
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    const automationType = searchParams.get('automation_type');
    const status = searchParams.get('status');
    const source = searchParams.get('source');

    const supabase = createRouteClient() as any;

    // Build query
    let query = supabase
      .from('automation_logs')
      .select('*')
      .order('executed_at', { ascending: false });

    // Apply filters
    if (automationType) {
      query = query.eq('automation_type', automationType);
    }
    if (status) {
      query = query.eq('status', status);
    }
    if (source) {
      query = query.eq('automation_source', source);
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data: logs, error } = await query;

    if (error) {
      console.error('Error fetching automation logs:', error);
      return NextResponse.json(
        { error: 'Failed to fetch automation logs' },
        { status: 500 }
      );
    }

    // Get total count for pagination
    let countQuery = supabase
      .from('automation_logs')
      .select('*', { count: 'exact', head: true });

    if (automationType) {
      countQuery = countQuery.eq('automation_type', automationType);
    }
    if (status) {
      countQuery = countQuery.eq('status', status);
    }
    if (source) {
      countQuery = countQuery.eq('automation_source', source);
    }

    const { count } = await countQuery;

    return NextResponse.json({
      success: true,
      data: logs || [],
      pagination: {
        total: count || 0,
        limit,
        offset,
        hasMore: (offset + limit) < (count || 0)
      }
    });

  } catch (error) {
    console.error('Error in GET automation logs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}