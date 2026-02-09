
import { NextRequest, NextResponse } from 'next/server';
import { createRouteClient } from '@/lib/supabase-server';
import { createSupabaseClientForServer } from '@/lib/supabase-client';

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const supabase = createSupabaseClientForServer();
        const { id } = await params;

        const { error } = await supabase
            .from('featured_videos')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting featured video:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error in DELETE featured video:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
