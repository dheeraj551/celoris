import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, message, transcript } = body;

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and Email are required' },
        { status: 400 }
      );
    }

    // transcript is an optional array of { role: 'user' | 'assistant', content: string }
    // sent from the widget so support has context on what the visitor already asked.
    const transcriptHtml = Array.isArray(transcript) && transcript.length > 0
      ? transcript
          .slice(-20)
          .filter((m: any) => m && typeof m.content === 'string' && (m.role === 'user' || m.role === 'assistant'))
          .map((m: any) => {
            const speaker = m.role === 'user' ? 'Visitor' : 'Bot';
            const safeContent = String(m.content).replace(/</g, '&lt;').replace(/>/g, '&gt;');
            return `<div style="margin-bottom:8px;"><strong>${speaker}:</strong> ${safeContent}</div>`;
          })
          .join('')
      : '';

    // Create nodemailer transporter — same config as /api/courses/inquiry
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

    const mailOptions = {
      from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`,
      to: 'support@celorisdesigns.com',
      subject: `Support Bot Lead: ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 8px; }
            .header { background-color: #0ea5e9; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
            .content { background-color: white; padding: 30px; border-radius: 0 0 8px 8px; }
            .field { margin-bottom: 20px; }
            .field-label { font-weight: bold; color: #0ea5e9; margin-bottom: 5px; }
            .field-value { padding: 10px; background-color: #f3f4f6; border-radius: 4px; border-left: 3px solid #0ea5e9; }
            .transcript { padding: 12px; background-color: #f3f4f6; border-radius: 4px; border-left: 3px solid #94a3b8; font-size: 13px; }
            .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>New Support Bot Lead</h2>
            </div>
            <div class="content">
              <div class="field">
                <div class="field-label">Name:</div>
                <div class="field-value">${name}</div>
              </div>
              <div class="field">
                <div class="field-label">Email:</div>
                <div class="field-value"><a href="mailto:${email}">${email}</a></div>
              </div>
              <div class="field">
                <div class="field-label">Phone:</div>
                <div class="field-value">${phone || 'Not provided'}</div>
              </div>
              ${message ? `
              <div class="field">
                <div class="field-label">Message:</div>
                <div class="field-value">${message}</div>
              </div>
              ` : ''}
              ${transcriptHtml ? `
              <div class="field">
                <div class="field-label">Chat conversation before handoff:</div>
                <div class="transcript">${transcriptHtml}</div>
              </div>
              ` : ''}
              <div class="footer">
                <p>This lead was captured from the Celoris support bot widget</p>
                <p>Received on ${new Date().toLocaleString()}</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      replyTo: email,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: 'Lead sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending support bot lead:', error);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again later.' },
      { status: 500 }
    );
  }
}
