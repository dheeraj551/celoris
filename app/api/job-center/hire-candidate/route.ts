import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { candidateId } = body;

        if (!candidateId) {
            return NextResponse.json(
                { error: 'candidateId is required' },
                { status: 400 }
            );
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SERVICE_ROLE_KEY;

        if (!supabaseUrl || !serviceRoleKey) {
            console.error('Missing Supabase URL or service role key');
            return NextResponse.json(
                { error: 'Server configuration error' },
                { status: 500 }
            );
        }

        const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        });

        // Only allow this for candidates who've actually published a public
        // Job Center profile — prevents this endpoint being used to resolve
        // the email address of an arbitrary user id.
        const { data: candidateRow, error: candidateError } = await supabaseAdmin
            .from('job_center_candidate_profiles')
            .select('id, headline, slug')
            .eq('id', candidateId)
            .eq('is_public', true)
            .maybeSingle();

        if (candidateError || !candidateRow) {
            return NextResponse.json(
                { error: 'Candidate profile not found' },
                { status: 404 }
            );
        }

        const [{ data: userRow }, { data: profileRow }, { data: authUser }] = await Promise.all([
            supabaseAdmin.from('users').select('full_name').eq('id', candidateId).maybeSingle(),
            supabaseAdmin.from('profiles').select('full_name, email').eq('id', candidateId).maybeSingle(),
            supabaseAdmin.auth.admin.getUserById(candidateId),
        ]);

        const candidateName = profileRow?.full_name || userRow?.full_name || 'there';
        const candidateEmail = profileRow?.email || authUser?.user?.email;

        if (!candidateEmail) {
            console.error('No email on file for candidate:', candidateId);
            return NextResponse.json(
                { error: 'No email on file for this candidate' },
                { status: 404 }
            );
        }

        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.MAIL_PORT || '587'),
            secure: false,
            auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });

        const profileUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://celorisdesigns.com'}/job-center/candidates/${candidateRow.slug || candidateId}`;

        const mailOptions = {
            from: `"${process.env.MAIL_FROM_NAME || 'Celoris'}" <${process.env.MAIL_FROM_ADDRESS}>`,
            to: candidateEmail,
            subject: `Someone wants to hire you on Celoris Job Center!`,
            html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 8px; }
            .header { background-color: #059669; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
            .content { background-color: white; padding: 30px; border-radius: 0 0 8px 8px; }
            .cta { display: inline-block; margin-top: 16px; padding: 12px 24px; background-color: #059669; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; }
            .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>Great news, ${candidateName}!</h2>
            </div>
            <div class="content">
              <p>Someone just clicked <strong>HIRE ME</strong> on your Celoris Job Center profile — they're interested in hiring you.</p>
              <p>Keep your profile and verified badges up to date so employers can reach out with confidence.</p>
              <a class="cta" href="${profileUrl}">View Your Profile</a>
              <div class="footer">
                <p>Received on ${new Date().toLocaleString()}</p>
                <p>This is an automated notification from the Celoris Job Center.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json(
            { message: 'Hire request sent successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error sending hire-candidate notification:', error);
        return NextResponse.json(
            { error: 'Failed to send request. Please try again later.' },
            { status: 500 }
        );
    }
}
