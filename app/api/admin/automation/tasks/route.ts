// ===========================================
// CELORIS AUTOMATION SYSTEM - API ROUTES
// ===========================================

import { NextRequest, NextResponse } from 'next/server'
import { createRouteClient } from '@/lib/supabase-server'

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteClient()
    const { searchParams } = new URL(request.url)
    
    const taskType = searchParams.get('type')
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '10')

    let query = supabase
      .from('automation_tasks')
      .select(`
        *,
        automation_logs (
          id,
          status,
          start_time,
          execution_time_ms,
          error_message
        )
      `)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (taskType) {
      query = query.eq('task_type', taskType)
    }

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      data: data,
      count: data?.length || 0
    })

  } catch (error) {
    console.error('Error fetching automation tasks:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error occurred' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteClient()
    const body = await request.json()

    const {
      task_name,
      task_type,
      description,
      cron_expression,
      schedule_interval,
      task_config = {},
      task_parameters = {},
      priority = 5,
      timeout_seconds = 300
    } = body

    // Calculate next run time
    const now = new Date()
    let nextRunAt = now.toISOString()

    switch (schedule_interval) {
      case 'hourly':
        nextRunAt = new Date(now.getTime() + 60 * 60 * 1000).toISOString()
        break
      case 'daily':
        nextRunAt = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString()
        break
      case 'weekly':
        nextRunAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString()
        break
      case '6_hours':
        nextRunAt = new Date(now.getTime() + 6 * 60 * 60 * 1000).toISOString()
        break
      default:
        nextRunAt = new Date(now.getTime() + 60 * 60 * 1000).toISOString()
    }

    const { data, error } = await supabase
      .from('automation_tasks')
      .insert({
        task_name,
        task_type,
        description,
        cron_expression,
        schedule_interval,
        task_config,
        task_parameters,
        priority,
        timeout_seconds,
        next_run_at: nextRunAt,
        status: 'pending'
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      data: data,
      message: 'Automation task created successfully'
    })

  } catch (error) {
    console.error('Error creating automation task:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error occurred' },
      { status: 500 }
    )
  }
}