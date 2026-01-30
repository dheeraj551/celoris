import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: NextRequest) {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

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
        const { data: userProfile, error: profileError } = await supabase
            .from('users')
            .select('wallet_balance, full_name, email')
            .eq('id', userId)
            .single();

        if (profileError || !userProfile) {
            return NextResponse.json(
                { error: 'User profile not found' },
                { status: 404 }
            );
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
          <p><strong>User:</strong> ${userProfile.full_name} (${userProfile.email})</p>
          <p><strong>Lead Name:</strong> ${leadName}</p>
          <p><strong>Requirement:</strong> ${leadRequirement}</p>
          <p><strong>Lead ID:</strong> ${leadId}</p>
          <hr />
          <p>Amount ₹${deductionAmount} has been deducted from the user's wallet.</p>
        `
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json(
            { message: 'Request has been accepted', newBalance: currentBalance - deductionAmount },
            { status: 200 }
        );

    } catch (error: any) {
        console.error('Error processing interest:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
