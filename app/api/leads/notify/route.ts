import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, trainerName, trainerEmail, studentName, studentEmail, course, leadId, messageText } = body;

    if (!action || !trainerName || !studentName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.MAIL_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
      tls: { rejectUnauthorized: false },
    });

    const actionTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    const actionColors: Record<string, string> = {
      'Apply to Lead': '#10b981',
      'Mark Contacted': '#f59e0b',
      'Schedule Demo': '#6366f1',
      'Internal Message Sent': '#059669',
    };
    const color = actionColors[action] || '#10b981';

    // --- Notification email to support / admin ---
    const adminMail = {
      from: `"Celoris Teach" <${process.env.MAIL_FROM_ADDRESS}>`,
      to: 'support@celorisdesigns.com',
      subject: `📋 Lead Action: ${action} — ${trainerName} → ${studentName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; color: #333; background: #f9fafb; }
            .wrap { max-width: 600px; margin: 30px auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
            .header { background: ${color}; color: #fff; padding: 28px 32px; }
            .header h2 { margin: 0; font-size: 22px; }
            .header p { margin: 6px 0 0; opacity: 0.85; font-size: 14px; }
            .body { padding: 32px; }
            .row { display: flex; gap: 16px; margin-bottom: 20px; }
            .card { flex: 1; background: #f3f4f6; border-radius: 8px; padding: 16px; border-left: 4px solid ${color}; }
            .card .label { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #6b7280; margin-bottom: 4px; }
            .card .value { font-size: 16px; font-weight: 600; color: #111; }
            .card .sub { font-size: 12px; color: #6b7280; margin-top: 2px; }
            .action-badge { display: inline-block; background: ${color}; color: #fff; padding: 8px 20px; border-radius: 20px; font-weight: 700; font-size: 14px; margin-bottom: 24px; }
            .footer { padding: 20px 32px; background: #f3f4f6; font-size: 12px; color: #9ca3af; text-align: center; }
          </style>
        </head>
        <body>
          <div class="wrap">
            <div class="header">
              <h2>🎯 Lead Action Notification</h2>
              <p>A trainer performed an action on an enquiry lead</p>
            </div>
            <div class="body">
              <div class="action-badge">${action}</div>
              <div class="row">
                <div class="card">
                  <div class="label">👨‍🏫 Trainer</div>
                  <div class="value">${trainerName}</div>
                  <div class="sub">${trainerEmail || 'Email not provided'}</div>
                </div>
                <div class="card">
                  <div class="label">🎓 Student</div>
                  <div class="value">${studentName}</div>
                  <div class="sub">${studentEmail || 'Email not provided'}</div>
                </div>
              </div>
              <div class="card" style="margin-bottom: 20px;">
                <div class="label">📚 Course Interest</div>
                <div class="value">${course || 'General Inquiry'}</div>
              </div>
              ${messageText ? `<div class="card" style="margin-bottom: 20px;"><div class="label">💬 Internal Message</div><div class="value" style="font-size:14px;font-weight:normal;line-height:1.5;">${messageText}</div></div>` : ''}
              ${leadId ? `<div class="card" style="margin-bottom: 20px;"><div class="label">🔖 Lead ID</div><div class="value" style="font-size:13px;font-family:monospace;">${leadId}</div></div>` : ''}
            </div>
            <div class="footer">
              <p>Action taken at ${actionTime} IST</p>
              <p>Celoris Teach Platform • celorisdesigns.com</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `Lead Action: ${action}\nTrainer: ${trainerName} (${trainerEmail})\nStudent: ${studentName} (${studentEmail})\nCourse: ${course}\n${messageText ? `Message: ${messageText}\n` : ''}Time: ${actionTime}`,
    };

    await transporter.sendMail(adminMail);

    // If this was an internal message and the student provided an email, notify the student directly
    if (studentEmail && (action === 'Internal Message Sent' || messageText)) {
      try {
        const studentMail = {
          from: `"Celoris Teach" <${process.env.MAIL_FROM_ADDRESS}>`,
          to: studentEmail,
          subject: `💬 New Message regarding ${course || 'your learning goals'} from Trainer ${trainerName}`,
          html: `
            <!DOCTYPE html>
            <html>
            <body style="font-family: Arial, sans-serif; color: #333; background: #f9fafb; margin: 0; padding: 24px;">
              <div style="max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e5e7eb; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
                <div style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); color: #ffffff; padding: 28px 32px;">
                  <h2 style="margin: 0; font-size: 22px;">Message from Trainer ${trainerName}</h2>
                  <p style="margin: 6px 0 0; opacity: 0.9; font-size: 14px;">Regarding your course inquiry for <strong>${course || 'General Training'}</strong></p>
                </div>
                <div style="padding: 32px;">
                  <p style="font-size: 15px; color: #374151; margin-top: 0;">Hi <strong>${studentName}</strong>,</p>
                  <p style="font-size: 14px; color: #4b5563; line-height: 1.6;">
                    Verified Celoris Trainer <strong>${trainerName}</strong> reviewed your inquiry and sent you the following message through Celoris Teach:
                  </p>
                  <div style="background: #f0fdf4; border-left: 4px solid #10b981; border-radius: 8px; padding: 18px; margin: 24px 0; font-size: 14px; color: #166534; line-height: 1.6;">
                    "${messageText || 'Hello! I would like to assist you with your learning requirements.'}"
                  </div>
                  <div style="text-align: center; margin: 32px 0 16px;">
                    <a href="https://celorisdesigns.com/inbox" style="display: inline-block; background: #059669; color: #ffffff; font-weight: bold; font-size: 14px; text-decoration: none; padding: 12px 28px; border-radius: 10px; box-shadow: 0 4px 12px rgba(5,150,105,0.25);">
                      Open Student Mailbox &amp; Reply
                    </a>
                  </div>
                  <p style="font-size: 12px; color: #9ca3af; text-align: center; margin-top: 24px;">
                    🔒 This message was sent securely to protect your contact privacy. You can view all your trainer conversations anytime in your Celoris Student Mailbox at celorisdesigns.com/inbox.
                  </p>
                </div>
              </div>
            </body>
            </html>
          `,
        };
        await transporter.sendMail(studentMail);
      } catch (studentErr) {
        console.warn('Could not deliver email copy to student, admin notification was sent:', studentErr);
      }
    }

    return NextResponse.json({ success: true, message: 'Notification sent successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Lead notify error:', error);
    return NextResponse.json({ error: 'Failed to send notification', details: error.message }, { status: 500 });
  }
}
