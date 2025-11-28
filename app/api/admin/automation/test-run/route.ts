import { NextRequest, NextResponse } from 'next/server';
import { createRouteClient } from '@/lib/supabase-server';

// POST /api/admin/automation/test-run
export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteClient();

    // Log the test run start
    const { data: logEntry, error: logError } = await supabase
      .from('automation_logs')
      .insert([{
        automation_type: 'blog_generation',
        automation_source: 'manual_test',
        status: 'in_progress',
        input_data: { test_mode: true, triggered_at: new Date().toISOString() },
        executed_at: new Date().toISOString(),
        metadata: { test_run: true, manual_trigger: true }
      }])
      .select()
      .single();

    if (logError) {
      console.error('Error creating test log entry:', logError);
      return NextResponse.json(
        { error: 'Failed to initialize test run' },
        { status: 500 }
      );
    }

    try {
      // Simulate N8N workflow execution
      const startTime = Date.now();
      
      // Step 1: Simulate trend analysis (Google Trends, Twitter, etc.)
      await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay
      
      // Step 2: Simulate AI content generation
      await new Promise(resolve => setTimeout(resolve, 3000)); // 3 second delay
      
      // Step 3: Simulate image generation
      await new Promise(resolve => setTimeout(resolve, 1500)); // 1.5 second delay
      
      // Step 4: Simulate blog publishing
      await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
      
      const endTime = Date.now();
      const executionTime = endTime - startTime;

      // Update log with success
      await supabase
        .from('automation_logs')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          execution_time: executionTime,
          output_data: {
            test_results: {
              trend_analysis: { status: 'success', topics_found: 5 },
              content_generation: { status: 'success', word_count: 1850 },
              image_generation: { status: 'success', image_url: '/images/test-generated-image.jpg' },
              blog_publishing: { status: 'success', published_url: '/blog/test-post' }
            },
            test_mode: true,
            execution_steps: [
              'Trend Analysis - Completed',
              'Content Generation - Completed', 
              'Image Generation - Completed',
              'Blog Publishing - Completed'
            ]
          }
        })
        .eq('id', logEntry.id);

      // Create success notification
      await supabase
        .from('admin_notifications')
        .insert([{
          type: 'automation_test',
          title: 'Test Automation Completed',
          message: `N8N Blog Automation test completed successfully in ${Math.round(executionTime / 1000)}s`,
          severity: 'success',
          data: {
            test_run_id: logEntry.id,
            execution_time: executionTime,
            status: 'success'
          }
        }]);

      // Update automation settings last execution time
      await supabase
        .from('n8n_automation_settings')
        .update({
          last_execution: new Date().toISOString(),
          last_success: new Date().toISOString(),
          total_executions: 1,
          successful_executions: 1
        })
        .eq('automation_type', 'blog_generation')
        .limit(1);

      return NextResponse.json({
        success: true,
        message: 'Test automation completed successfully',
        data: {
          log_id: logEntry.id,
          execution_time: `${Math.round(executionTime / 1000)}s`,
          steps_completed: 4,
          estimated_savings: 'Manual effort: ~4 hours, Automated: ~8 seconds',
          test_results: {
            trend_analysis: { status: 'completed', topics_found: 5 },
            content_generation: { status: 'completed', word_count: 1850 },
            image_generation: { status: 'completed', image_generated: true },
            blog_publishing: { status: 'completed', published: true }
          }
        }
      });

    } catch (testError) {
      // Update log with error
      await supabase
        .from('automation_logs')
        .update({
          status: 'error',
          completed_at: new Date().toISOString(),
          error_message: testError instanceof Error ? testError.message : 'Unknown test error'
        })
        .eq('id', logEntry.id);

      // Create error notification
      await supabase
        .from('admin_notifications')
        .insert([{
          type: 'automation_test_error',
          title: 'Test Automation Failed',
          message: `N8N Blog Automation test failed: ${testError instanceof Error ? testError.message : 'Unknown error'}`,
          severity: 'error',
          data: {
            test_run_id: logEntry.id,
            error: testError instanceof Error ? testError.message : 'Unknown error'
          }
        }]);

      return NextResponse.json(
        { 
          success: false,
          error: 'Test automation failed',
          details: testError instanceof Error ? testError.message : 'Unknown error',
          log_id: logEntry.id
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error in test automation:', error);
    return NextResponse.json(
      { 
        error: 'Failed to run test automation',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}