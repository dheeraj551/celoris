import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClientForServer } from '@/lib/supabase-client'

export async function GET(request: NextRequest) {
    try {
        const supabase = createSupabaseClientForServer() as any
        const { searchParams } = new URL(request.url)
        const limit = parseInt(searchParams.get('limit') || '50')
        const offset = parseInt(searchParams.get('offset') || '0')

        // Check if user is admin (this check might be redundant if middleware handles it, 
        // but safe to have. For now relying on the page to do the check or the RLS policy 
        // which we set to only allow admins to view all transactions)

        const { data, error, count } = await supabase
            .from('wallet_transactions')
            .select(`
                *,
                users (
                    full_name,
                    username
                )
            `, { count: 'exact' })
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1)

        if (error) {
            console.error('Error fetching transactions:', error)
            return NextResponse.json(
                { error: 'Failed to fetch transactions' },
                { status: 500 }
            )
        }

        return NextResponse.json({ data, count })
    } catch (error) {
        console.error('Server error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
