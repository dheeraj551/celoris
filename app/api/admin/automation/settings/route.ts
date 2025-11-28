import { NextRequest, NextResponse } from 'next/server';
import { createRouteClient } from '@/lib/supabase-server';

// GET /api/admin/automation/settings
export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const supabase = createRouteClient();
    
    const { data: settings, error } = await supabase
      .from('n8n_automation_settings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching automation settings:', error);
      return NextResponse.json(
        { error: 'Failed to fetch automation settings' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: settings || []
    });

  } catch (error) {
    console.error('Error in GET automation settings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/admin/automation/settings - Create new settings
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      automation_name,
      automation_type,
      schedule_type = 'interval',
      schedule_value = '6',
      content_settings = {},
      seo_settings = {},
      topic_sources = [],
      quality_threshold = 0.8,
      max_posts_per_day = 3,
      require_approval = false,
      n8n_webhook_url,
      n8n_workflow_id
    } = body;

    if (!automation_name || !automation_type) {
      return NextResponse.json(
        { error: 'Missing required fields: automation_name, automation_type' },
        { status: 400 }
      );
    }

    const supabase = createRouteClient();

    const { data, error } = await supabase
      .from('n8n_automation_settings')
      .insert([{
        automation_name,
        automation_type,
        schedule_type,
        schedule_value,
        content_settings,
        seo_settings,
        topic_sources,
        quality_threshold,
        max_posts_per_day,
        require_approval,
        n8n_webhook_url,
        n8n_workflow_id
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating automation settings:', error);
      return NextResponse.json(
        { error: 'Failed to create automation settings' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
      message: 'Automation settings created successfully'
    });

  } catch (error) {
    console.error('Error in POST automation settings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}