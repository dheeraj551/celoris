import { NextRequest, NextResponse } from 'next/server'
import { createClientForBrowser, createSupabaseClientForServer } from '@/lib/supabase-client'
import { createRouteClient } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { notice_id, name, email, phone, message } = body

        if (!notice_id || !name || !email || !phone) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        const supabase = createRouteClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json(
                { error: 'You must be logged in to show interest' },
                { status: 401 }
            )
        }

        const adminSupabase = createSupabaseClientForServer() as any

        // Check wallet balance
        const { data: userProfile, error: profileError } = await adminSupabase
            .from('users')
            .select('wallet_balance')
            .eq('id', user.id)
            .single()

        if (profileError || !userProfile) {
            console.error('Error fetching user profile:', profileError)
            return NextResponse.json(
                { error: 'Failed to fetch user profile' },
                { status: 500 }
            )
        }

        const currentBalance = (userProfile as any).wallet_balance || 0
        const DEDUCTION_AMOUNT = 25

        if (currentBalance < DEDUCTION_AMOUNT) {
            return NextResponse.json(
                { error: `Insufficient wallet balance. You need ₹${DEDUCTION_AMOUNT} to show interest.` },
                { status: 400 }
            )
        }

        // Perform transaction (Deduct balance, Log transaction, Create interest)
        // Ideally this should be a Postgres function/transaction, but we'll do it sequentially here for now.

        // 1. Deduct balance
        const { error: updateError } = await adminSupabase
            .from('users')
            .update({ wallet_balance: currentBalance - DEDUCTION_AMOUNT } as any)
            .eq('id', user.id)

        if (updateError) {
            console.error('Error deducting balance:', updateError)
            return NextResponse.json(
                { error: 'Failed to process payment' },
                { status: 500 }
            )
        }

        // 2. Log transaction
        const { error: transactionError } = await adminSupabase
            .from('wallet_transactions')
            .insert({
                user_id: user.id,
                amount: DEDUCTION_AMOUNT,
                type: 'debit',
                description: `Shown interest for notice ID: ${notice_id}`
            } as any)

        if (transactionError) {
            console.error('Error logging transaction:', transactionError)
            // Non-critical, but good to know
        }

        // 3. Create interest entry
        const { data, error } = await adminSupabase
            .from('notice_interests')
            .insert({
                notice_id,
                user_name: name,
                user_email: email,
                user_phone: phone,
                message,
                user_id: user.id
            } as any)
            .select()
            .single()

        if (error) {
            console.error('Error submitting interest:', error)
            // Refund the user? Ideally yes.
            await adminSupabase
                .from('users')
                .update({ wallet_balance: currentBalance } as any) // Restore balance
                .eq('id', user.id)

            return NextResponse.json(
                { error: 'Failed to submit interest' },
                { status: 500 }
            )
        }

        return NextResponse.json({ data, newBalance: currentBalance - DEDUCTION_AMOUNT }, { status: 201 })
    } catch (error) {
        console.error('Server error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const noticeId = searchParams.get('noticeId')

        const supabase = createClientForBrowser()

        let query = supabase
            .from('notice_interests')
            .select(`
        *,
        notice_board (
          title
        )
      `)
            .order('created_at', { ascending: false })

        if (noticeId) {
            query = query.eq('notice_id', noticeId)
        }

        const { data, error } = await query

        if (error) {
            console.error('Error fetching interests:', error)
            return NextResponse.json(
                { error: 'Failed to fetch interests' },
                { status: 500 }
            )
        }

        return NextResponse.json({ data })
    } catch (error) {
        console.error('Server error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
