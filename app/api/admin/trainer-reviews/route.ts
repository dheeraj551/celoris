// ===========================================
// TRAINER REVIEWS MODERATION - API ROUTES
// ===========================================

import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseClientForServer } from '@/lib/supabase-client';
import { createRouteClient } from '@/lib/supabase-server';

// This writes straight to the DB with the service role key (which bypasses
// row level security), so this check is what actually keeps random visitors
// from approving/deleting reviews — verify the caller is really the admin
// before doing anything.
async function requireAdmin(): Promise<NextResponse | null> {
    try {
        const authClient = (await createRouteClient()) as any;
        const { data: { user } } = await authClient.auth.getUser();
        if (!user || user.email !== 'support@celorisdesigns.com') {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }
        return null;
    } catch {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
}

export async function GET(request: NextRequest) {
    try {
        const authError = await requireAdmin();
        if (authError) return authError;

        const supabase = createSupabaseClientForServer();
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status'); // 'pending' | 'approved' | null (all)

        let query = supabase
            .from('trainer_reviews')
            .select('*')
            .order('created_at', { ascending: false });

        if (status === 'pending') query = query.eq('is_approved', false);
        if (status === 'approved') query = query.eq('is_approved', true);

        const { data, error } = await query;
        if (error) throw error;

        return NextResponse.json({ success: true, data: data || [] });
    } catch (error) {
        console.error('Error fetching trainer reviews:', error);
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : 'Unknown error occurred' },
            { status: 500 }
        );
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const authError = await requireAdmin();
        if (authError) return authError;

        const supabase = createSupabaseClientForServer();
        const body = await request.json();
        const { id, is_approved } = body;

        if (!id || typeof is_approved !== 'boolean') {
            return NextResponse.json(
                { success: false, error: 'id and is_approved (boolean) are required' },
                { status: 400 }
            );
        }

        const { data, error } = await supabase
            .from('trainer_reviews')
            .update({
                is_approved,
                approved_at: is_approved ? new Date().toISOString() : null,
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error('Error updating trainer review:', error);
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : 'Unknown error occurred' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const authError = await requireAdmin();
        if (authError) return authError;

        const supabase = createSupabaseClientForServer();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ success: false, error: 'Review ID is required' }, { status: 400 });
        }

        const { error } = await supabase.from('trainer_reviews').delete().eq('id', id);
        if (error) throw error;

        return NextResponse.json({ success: true, message: 'Review deleted successfully' });
    } catch (error) {
        console.error('Error deleting trainer review:', error);
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : 'Unknown error occurred' },
            { status: 500 }
        );
    }
}
