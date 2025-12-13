import { NextResponse } from 'next/server'
import { createSupabaseClientForServer } from '@/lib/supabase-client'

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { userId, amount } = body

        if (!userId || amount === undefined) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        const rechargeAmount = parseFloat(amount)
        if (isNaN(rechargeAmount)) {
            return NextResponse.json(
                { error: 'Invalid amount' },
                { status: 400 }
            )
        }

        const supabase: any = createSupabaseClientForServer()

        // First, get the current balance
        const { data: user, error: fetchError } = await supabase
            .from('users')
            .select('wallet_balance')
            .eq('id', userId)
            .single()

        if (fetchError) {
            // If column doesn't exist, this will error. 
            // We might want to catch it specifically, but general error is fine.
            console.error('Error fetching user for recharge:', fetchError)
            return NextResponse.json(
                { error: 'User not found or database error' },
                { status: 500 }
            )
        }

        const currentBalance = (user as { wallet_balance: number | null } | null)?.wallet_balance || 0
        const newBalance = currentBalance + rechargeAmount

        // Update the balance
        const { error: updateError } = await supabase
            .from('users')
            .update({ wallet_balance: newBalance })
            .eq('id', userId)

        if (updateError) {
            console.error('Error updating wallet:', updateError)
            return NextResponse.json(
                { error: 'Failed to update wallet' },
                { status: 500 }
            )
        }

        return NextResponse.json({
            success: true,
            newBalance
        })

    } catch (error) {
        console.error('Error in recharge API:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
