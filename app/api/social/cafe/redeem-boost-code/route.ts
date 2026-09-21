import { NextResponse } from 'next/server'
import { createRouteClient } from '@/lib/supabase-server'
import { createSupabaseClientForServer } from '@/lib/supabase-client'

// Lets a student WAITING IN THE QUEUE redeem one of the room's three admin
// -distributed boost codes (+10 / +50 / +100 priority) to jump ahead of
// plain FIFO — see /api/social/cafe/classroom-queue for the queue itself
// and /api/social/cafe/verify-admit-code for the (unrelated) trainer_code/
// student_code entry gate this sits alongside.
//
// Same pattern as verify-admit-code: this is deliberately the only place
// that ever reads boost_code_10/50/100 off cafe_classrooms — every other
// read path (the admin panel excepted) omits them — so a code never ships
// to a browser outside of this one comparison. Codes themselves are set
// per-room from the admin Queue Management page (see
// /api/admin/cafe/rooms/[id] PATCH).
const TIERS: { column: 'boost_code_10' | 'boost_code_50' | 'boost_code_100'; amount: 10 | 50 | 100; redeemedColumn: 'redeemed_boost_10' | 'redeemed_boost_50' | 'redeemed_boost_100' }[] = [
    { column: 'boost_code_100', amount: 100, redeemedColumn: 'redeemed_boost_100' },
    { column: 'boost_code_50', amount: 50, redeemedColumn: 'redeemed_boost_50' },
    { column: 'boost_code_10', amount: 10, redeemedColumn: 'redeemed_boost_10' },
]

export async function POST(request: Request) {
    try {
        const { roomId, code } = await request.json()

        if (!roomId) {
            return NextResponse.json({ error: 'roomId is required' }, { status: 400 })
        }

        const provided = typeof code === 'string' ? code.trim() : ''
        if (!provided) {
            return NextResponse.json({ error: 'Enter a boost code first.' }, { status: 400 })
        }

        const routeClient = await createRouteClient()
        const { data: { user }, error: authError } = await routeClient.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
        }

        const admin = createSupabaseClientForServer()

        const [{ data: room, error: roomError }, { data: entry, error: entryError }] = await Promise.all([
            admin
                .from('cafe_classrooms')
                .select('boost_code_10, boost_code_50, boost_code_100')
                .eq('id', roomId)
                .maybeSingle(),
            admin
                .from('cafe_classroom_queue')
                .select('id, priority_score, redeemed_boost_10, redeemed_boost_50, redeemed_boost_100, status')
                .eq('room_id', roomId)
                .eq('user_id', user.id)
                .maybeSingle(),
        ])

        if (roomError) {
            return NextResponse.json({ error: roomError.message }, { status: 500 })
        }
        if (!room) {
            return NextResponse.json({ error: 'Room not found' }, { status: 404 })
        }
        if (entryError) {
            return NextResponse.json({ error: entryError.message }, { status: 500 })
        }
        if (!entry) {
            return NextResponse.json({ error: 'Join the queue before redeeming a boost code.' }, { status: 400 })
        }
        if (entry.status !== 'waiting') {
            return NextResponse.json({ error: 'You have already been admitted.' }, { status: 400 })
        }

        const match = TIERS.find((tier) => {
            const required = ((room as any)[tier.column] || '').trim()
            return required && required.toLowerCase() === provided.toLowerCase()
        })

        if (!match) {
            return NextResponse.json({ error: 'Incorrect boost code.' }, { status: 403 })
        }

        if ((entry as any)[match.redeemedColumn]) {
            return NextResponse.json({ error: `You've already redeemed the +${match.amount} boost code for this class.` }, { status: 409 })
        }

        const newPriority = (entry.priority_score || 0) + match.amount

        const { error: updateError } = await admin
            .from('cafe_classroom_queue')
            .update({
                priority_score: newPriority,
                [match.redeemedColumn]: true,
            })
            .eq('id', entry.id)

        if (updateError) {
            console.error('redeem-boost-code update error:', updateError)
            return NextResponse.json({ error: updateError.message }, { status: 500 })
        }

        return NextResponse.json({ ok: true, boost: match.amount, priorityScore: newPriority })
    } catch (error: any) {
        console.error('redeem-boost-code error:', error)
        return NextResponse.json({ error: error.message || 'Unknown error' }, { status: 500 })
    }
}
