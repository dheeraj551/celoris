import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST(request: NextRequest) {
    if (!supabaseServiceKey) {
        return NextResponse.json(
            { error: 'Server Context Error: Missing Service Role Key' },
            { status: 500 }
        );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });

    try {
        const body = await request.json();
        const { leadId, leadName, leadRequirement, userId, userEmail } = body;

        if (!userId || !leadId) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // 1. Fetch User Profile to check balance
        let { data: userProfile, error: profileError } = await supabase
            .from('users')
            .select('wallet_balance, full_name')
            .eq('id', userId)
            .single();

        // Auto-heal: If profile missing in public.users but exists in Auth, create it.
        if (!userProfile) {
            console.log(`Profile missing for ${userId}, attempting auto-heal...`);
            const { data: { user: authUser }, error: authError } = await supabase.auth.admin.getUserById(userId);

            if (authError || !authUser) {
                console.error('Auth user not found:', authError);
                return NextResponse.json(
                    { error: `User identity not found: ${authError?.message || 'Unknown ID'}` },
                    { status: 404 }
                );
            }

            // Upsert into public.users to handle race conditions or partial states
            // Note: We don't insert email as the table might not have it.
            const { error: insertError } = await supabase
                .from('users')
                .upsert({
                    id: userId,
                    full_name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || 'Unknown User',
                    wallet_balance: 0,
                    created_at: new Date().toISOString()
                }, { onConflict: 'id' });

            if (insertError) {
                console.error('Failed to auto-heal profile:', insertError);
                return NextResponse.json(
                    { error: `Failed to initialize user profile: ${insertError.message}` },
                    { status: 500 }
                );
            }

            // Retry fetch
            const { data: retryProfile, error: retryError } = await supabase
                .from('users')
                .select('wallet_balance, full_name')
                .eq('id', userId)
                .single();

            if (retryError || !retryProfile) {
                return NextResponse.json({ error: 'Profile creation failed after retry' }, { status: 500 });
            }

            userProfile = retryProfile;
        }

        const currentBalance = userProfile.wallet_balance || 0;
        const deductionAmount = 100;

        // 2. Check Balance
        if (currentBalance < deductionAmount) {
            return NextResponse.json(
                { error: 'Insufficient wallet balance' },
                { status: 402 } // Payment Required
            );
        }

        // 3. Deduct Balance
        const { error: updateError } = await supabase
            .from('users')
            .update({ wallet_balance: currentBalance - deductionAmount })
            .eq('id', userId);

        if (updateError) {
            console.error('Balance update failed:', updateError);
            return NextResponse.json(
                { error: 'Transaction failed' },
                { status: 500 }
            );
        }

        // 4. Send Email
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.MAIL_PORT || '587'),
            secure: false,
            auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD,
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        const mailOptions = {
            from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`,
            to: 'support@celorisdesigns.com',
            subject: `Lead Interest: ${leadName || 'Unknown Lead'}`,
            html: `
          <h3>Lead Interest Registered</h3>
          <p><strong>User:</strong> ${userProfile.full_name} (${userEmail})</p>
          <p><strong>Lead Name:</strong> ${leadName}</p>
          <p><strong>Requirement:</strong> ${leadRequirement}</p>
          <p><strong>Lead ID:</strong> ${leadId}</p>
          <hr />
          <p>Amount ₹${deductionAmount} has been deducted from the user's wallet.</p>
        `
        };

        if (transporter) {
            await transporter.sendMail(mailOptions);
        }

        // 5. Update Lead Status to 'booked'
        const { error: leadUpdateError } = await supabase
            .from('leads')
            .update({ status: 'booked' })
            .eq('id', leadId);

        if (leadUpdateError) {
            console.error('Failed to update lead status:', leadUpdateError);
            // We don't fail the request here since money is deducted and email sent, but we log it.
        }

        return NextResponse.json(
            { message: 'Request has been accepted', newBalance: currentBalance - deductionAmount },
            { status: 200 }
        );

    } catch (error: any) {
        console.error('Error processing interest:', error);
        return NextResponse.json(
            { error: 'Internal server error: ' + error.message },
            { status: 500 }
        );
    }
}
