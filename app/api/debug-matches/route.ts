import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-client';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const supabase = createClient();

        // Try to fetch with column-based joins
        const { data, error } = await supabase
            .from('matches')
            .select(`
        *,
        user1:users!user1_id(id),
        user2:users!user2_id(id)
      `)
            .limit(1);

        return NextResponse.json({ data, error });
    } catch (error) {
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
