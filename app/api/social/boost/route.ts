import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseClientForServer } from '@/lib/supabase-client';
import { createRouteClient } from '@/lib/supabase-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { postId, postTitle, budget, objective, targetCities, userId: explicitUserId } = body;

    const rechargeBudget = parseFloat(budget);
    if (!rechargeBudget || isNaN(rechargeBudget) || rechargeBudget <= 0) {
      return NextResponse.json({ error: 'Invalid campaign budget amount' }, { status: 400 });
    }

    // Try resolving authenticated user from cookies, or fallback to explicit userId
    let userId = explicitUserId;
    try {
      const client = await createRouteClient();
      const { data: { user } } = await client.auth.getUser();
      if (user?.id) {
        userId = user.id;
      }
    } catch (authErr) {
      // Cookie reading fallback
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'You must be signed in with your Celoris Student ID to amplify ads' },
        { status: 401 }
      );
    }

    const admin = createSupabaseClientForServer();

    // 1. Fetch real current wallet balance from users table
    const { data: userRecord, error: userError } = await admin
      .from('users')
      .select('id, wallet_balance, full_name, email')
      .eq('id', userId)
      .single();

    if (userError || !userRecord) {
      return NextResponse.json(
        { error: 'Student account record not found in Celoris database' },
        { status: 404 }
      );
    }

    const currentBalance = Number(userRecord.wallet_balance) || 0;

    if (currentBalance < rechargeBudget) {
      return NextResponse.json(
        {
          error: `Insufficient wallet credits! Your balance is ₹${currentBalance.toLocaleString('en-IN')}, but this campaign requires ₹${rechargeBudget.toLocaleString('en-IN')}.`,
          currentBalance,
          required: rechargeBudget,
        },
        { status: 400 }
      );
    }

    // 2. Debit the real wallet balance
    const newBalance = currentBalance - rechargeBudget;
    const { error: debitError } = await admin
      .from('users')
      .update({ wallet_balance: newBalance })
      .eq('id', userId);

    if (debitError) {
      return NextResponse.json(
        { error: 'Failed to debit student wallet balance: ' + debitError.message },
        { status: 500 }
      );
    }

    // 3. Record transaction in wallet_transactions
    try {
      await admin.from('wallet_transactions').insert({
        user_id: userId,
        amount: -rechargeBudget,
        type: 'ad_spend',
        description: `Ad Studio campaign promotion: ${postTitle || 'Post #' + (postId || '').slice(0, 8)}`,
      });
    } catch (txErr) {
      console.warn('Could not write wallet_transaction record:', txErr);
    }

    // 4. Record new campaign in pulse_campaigns
    const { data: campaignRecord, error: campError } = await admin
      .from('pulse_campaigns')
      .insert({
        post_id: postId && postId.startsWith('post_') ? null : postId || null,
        user_id: userId,
        post_title: postTitle || 'Sponsored Campaign',
        objective: objective === 'leads' ? 'WhatsApp Leads' : 'Traffic',
        target_cities: Array.isArray(targetCities) ? targetCities : ['Delhi NCR', 'Mumbai', 'Bengaluru'],
        daily_budget: rechargeBudget,
        spent: rechargeBudget,
        status: 'Active',
        impressions: Math.floor(rechargeBudget * 6.5 + Math.random() * 200),
        clicks: Math.floor(rechargeBudget * 0.18 + Math.random() * 15),
        leads: Math.max(1, Math.floor(rechargeBudget * 0.025 + Math.random() * 4)),
      })
      .select()
      .single();

    if (campError) {
      console.error('Error inserting pulse_campaign:', campError);
    }

    // 5. Update post record if uuid format
    if (postId && !postId.startsWith('post_') && !postId.startsWith('insta-')) {
      try {
        await admin
          .from('posts')
          .update({
            is_sponsored: true,
            sponsor_cta: objective === 'leads' ? 'Send Message' : 'Learn More',
            sponsor_destination: '/learn/course/digital-marketing-mastery',
          })
          .eq('id', postId);
      } catch (postErr) {
        console.warn('Could not update post is_sponsored:', postErr);
      }
    }

    return NextResponse.json({
      success: true,
      newBalance,
      debited: rechargeBudget,
      campaign: campaignRecord || {
        id: `camp-${Date.now()}`,
        postId: postId,
        postTitle: postTitle,
        objective: objective === 'leads' ? 'WhatsApp Leads' : 'Traffic',
        dailyBudget: rechargeBudget,
        spent: rechargeBudget,
        status: 'Active',
        impressions: Math.floor(rechargeBudget * 6.5),
        clicks: Math.floor(rechargeBudget * 0.18),
        leads: Math.max(1, Math.floor(rechargeBudget * 0.025)),
      },
    });
  } catch (error: any) {
    console.error('Error in Ad Studio boost API:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error while amplifying post' },
      { status: 500 }
    );
  }
}
