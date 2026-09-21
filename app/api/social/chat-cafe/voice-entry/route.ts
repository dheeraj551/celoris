import { NextResponse } from 'next/server';
import { createSupabaseClientForServer } from '@/lib/supabase-client';
import { getCallerUser } from '@/lib/chat-cafe-server';
import { generateTrtcUserSig } from '@/lib/tencent-usersig';

// POST: pay the flat entry fee for a paid voice/video Chat Café table (the
// "VIP Voice & Video Lounge" and any future room with room_kind =
// 'voice_video') and, on success, return the TRTC join credentials for it.
//
// The charge itself happens inside charge_wallet_for_voice_entry — a single
// guarded UPDATE ... WHERE wallet_balance >= entry_fee, so two concurrent
// requests can't both succeed and drive the balance negative. The debit is
// written to wallet_transactions in the same DB call, so a successful charge
// is never left unlogged.
//
// entry_fee is read from chat_cafe_tables server-side rather than trusted
// from the request body — the client only ever sends tableId.
export async function POST(request: Request) {
  try {
    const user = await getCallerUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const { tableId } = body || {};
    if (!tableId || typeof tableId !== 'string') {
      return NextResponse.json({ error: 'tableId is required' }, { status: 400 });
    }

    const admin = createSupabaseClientForServer();

    const { data: table, error: tableError } = await admin
      .from('chat_cafe_tables')
      .select('id, name, room_kind, entry_fee, is_locked')
      .eq('id', tableId)
      .maybeSingle();

    if (tableError) throw new Error(tableError.message);
    if (!table) {
      return NextResponse.json({ error: 'Table not found' }, { status: 404 });
    }
    if (table.room_kind !== 'voice_video') {
      return NextResponse.json({ error: 'This table is not a paid voice/video room.' }, { status: 400 });
    }
    if (table.is_locked) {
      return NextResponse.json({ error: 'This room is currently locked.' }, { status: 403 });
    }

    const entryFee = Number(table.entry_fee || 0);
    let balanceAfter: number;

    // A free (entry_fee 0/unset) voice_video room skips the charge entirely
    // — keeps this route reusable if a free voice room ever ships too.
    if (entryFee > 0) {
      const { data: newBalance, error: chargeError } = await admin.rpc('charge_wallet_for_voice_entry', {
        p_user_id: user.id,
        p_amount: entryFee,
        p_description: `Entered ${table.name}`,
      });

      if (chargeError) {
        if (chargeError.message?.includes('INSUFFICIENT_BALANCE')) {
          return NextResponse.json(
            { error: 'Not enough balance in your wallet for this room.', insufficientBalance: true, entryFee },
            { status: 402 }
          );
        }
        throw new Error(chargeError.message);
      }

      balanceAfter = newBalance as number;
    } else {
      const { data: userRow, error: userError } = await admin
        .from('users')
        .select('wallet_balance')
        .eq('id', user.id)
        .maybeSingle();
      if (userError) throw new Error(userError.message);
      balanceAfter = Number(userRow?.wallet_balance || 0);
    }

    const { userSig, sdkAppId, expiresIn } = generateTrtcUserSig(user.id);

    return NextResponse.json({
      userSig,
      sdkAppId,
      expiresIn,
      userId: user.id,
      roomId: tableId,
      entryFee,
      balanceAfter,
    });
  } catch (error: any) {
    console.error('chat-cafe voice-entry POST error:', error);
    return NextResponse.json({ error: error.message || 'Unknown error' }, { status: 500 });
  }
}
