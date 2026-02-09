import { NextRequest, NextResponse } from 'next/server';
import { createRouteClient } from '@/lib/supabase-server';

// PATCH /api/admin/automation/settings/[id]
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Automation settings ID is required' },
        { status: 400 }
      );
    }

    const supabase = createRouteClient();

    // Update the settings
    const { data, error } = await supabase
      .from('n8n_automation_settings')
      .update({
        ...body,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating automation settings:', error);
      return NextResponse.json(
        { error: 'Failed to update automation settings' },
        { status: 500 }
      );
    }

    // Log the update
    await supabase
      .from('automation_logs')
      .insert([{
        automation_type: 'settings_update',
        automation_source: 'admin_panel',
        status: 'completed',
        input_data: { settings_id: id, changes: body },
        output_data: { updated_settings: data },
        executed_at: new Date().toISOString()
      }]);

    return NextResponse.json({
      success: true,
      data,
      message: 'Automation settings updated successfully'
    });

  } catch (error) {
    console.error('Error in PATCH automation settings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/automation/settings/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'Automation settings ID is required' },
        { status: 400 }
      );
    }

    const supabase = createRouteClient();

    // Delete the settings
    const { error } = await supabase
      .from('n8n_automation_settings')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting automation settings:', error);
      return NextResponse.json(
        { error: 'Failed to delete automation settings' },
        { status: 500 }
      );
    }

    // Log the deletion
    await supabase
      .from('automation_logs')
      .insert([{
        automation_type: 'settings_delete',
        automation_source: 'admin_panel',
        status: 'completed',
        input_data: { settings_id: id },
        executed_at: new Date().toISOString()
      }]);

    return NextResponse.json({
      success: true,
      message: 'Automation settings deleted successfully'
    });

  } catch (error) {
    console.error('Error in DELETE automation settings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}