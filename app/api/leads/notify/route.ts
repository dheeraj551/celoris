import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, trainerName, trainerEmail, studentName, studentEmail, course, leadId } = body;

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
      text: `Lead Action: ${action}\nTrainer: ${trainerName} (${trainerEmail})\nStudent: ${studentName} (${studentEmail})\nCourse: ${course}\nTime: ${actionTime}`,
    };

    await transporter.sendMail(adminMail);

    return NextResponse.json({ success: true, message: 'Notification sent successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Lead notify error:', error);
    return NextResponse.json({ error: 'Failed to send notification', details: error.message }, { status: 500 });
  }
}
