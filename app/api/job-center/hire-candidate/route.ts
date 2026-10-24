import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { candidateId, senderName, senderEmail, serviceType, budget, message, isCollab } = body;

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

        const isCustomInquiry = Boolean(senderEmail || senderName || message);
        const inquiryTitle = isCollab ? 'Brand Deal & Collab Proposal' : 'Project & Hiring Inquiry';

        const mailOptions = {
            from: `"${process.env.MAIL_FROM_NAME || 'Celoris'}" <${process.env.MAIL_FROM_ADDRESS}>`,
            to: candidateEmail,
            replyTo: senderEmail || undefined,
            subject: isCustomInquiry
                ? `[Celoris] ${inquiryTitle} from ${senderName || 'a Client'}`
                : `Someone wants to work with you on Celoris!`,
            html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; background-color: #f1f5f9; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
            .header { background: linear-gradient(135deg, #059669 0%, #0d9488 100%); color: white; padding: 32px 24px; text-align: center; }
            .header h2 { margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }
            .header p { margin: 6px 0 0; opacity: 0.9; font-size: 14px; }
            .content { padding: 32px 28px; }
            .detail-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px 20px; margin: 20px 0; }
            .detail-row { margin-bottom: 12px; font-size: 14px; }
            .detail-row:last-child { margin-bottom: 0; }
            .detail-label { font-weight: 700; color: #64748b; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px; }
            .detail-value { font-weight: 600; color: #0f172a; font-size: 15px; }
            .message-box { background: #ffffff; border-left: 4px solid #10b981; padding: 14px 16px; margin-top: 6px; font-style: normal; color: #334155; line-height: 1.6; white-space: pre-wrap; font-size: 14px; }
            .cta { display: inline-block; margin-top: 20px; padding: 14px 28px; background: #059669; color: #ffffff !important; text-decoration: none; border-radius: 10px; font-weight: 700; font-size: 14px; text-align: center; }
            .reply-hint { font-size: 12px; color: #64748b; margin-top: 10px; }
            .footer { margin-top: 24px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>${isCollab ? '🎬 New Brand / Creator Collab!' : '💼 New Project / Hiring Inquiry!'}</h2>
              <p>Hi ${candidateName}, someone wants to work with you through your Celoris profile.</p>
            </div>
            <div class="content">
              ${isCustomInquiry ? `
                <div class="detail-box">
                  <div class="detail-row">
                    <div class="detail-label">Client / Sender Name</div>
                    <div class="detail-value">${senderName || 'Not provided'}</div>
                  </div>
                  <div class="detail-row">
                    <div class="detail-label">Sender Email</div>
                    <div class="detail-value"><a href="mailto:${senderEmail}" style="color: #059669; text-decoration: none; font-weight: bold;">${senderEmail || 'Not provided'}</a></div>
                  </div>
                  ${serviceType ? `
                    <div class="detail-row">
                      <div class="detail-label">Service / Project Type</div>
                      <div class="detail-value">${serviceType}</div>
                    </div>
                  ` : ''}
                  ${budget ? `
                    <div class="detail-row">
                      <div class="detail-label">Proposed Budget / Offer</div>
                      <div class="detail-value" style="color: #059669;">${budget}</div>
                    </div>
                  ` : ''}
                  ${message ? `
                    <div class="detail-row" style="margin-top: 14px;">
                      <div class="detail-label">Message / Project Brief</div>
                      <div class="message-box">${message}</div>
                    </div>
                  ` : ''}
                </div>
                ${senderEmail ? `<p class="reply-hint">💡 You can directly reply to this email to respond to <strong>${senderEmail}</strong>.</p>` : ''}
              ` : `
                <p>Someone just visited your creator profile and clicked to work with you.</p>
                <p>Keep your profile, showreels, and service offerings updated to convert more inquiries!</p>
              `}
              <div style="text-align: center; margin-top: 24px;">
                <a class="cta" href="${profileUrl}">View Your Public Profile</a>
              </div>
              <div class="footer">
                <p>Sent on ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} (IST)</p>
                <p>This is a direct inquiry notification from the Celoris Creator Platform.</p>
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
