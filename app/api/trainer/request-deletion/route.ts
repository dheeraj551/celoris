import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, email, userId } = body;

        // Validate required fields
        if (!email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            );
        }

        // Create nodemailer transporter
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

        // Email content to send to support
        const mailOptions = {
            from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`,
            to: 'support@celorisdesigns.com',
            subject: `Trainer Profile Deletion Request: ${name || email}`,
            html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 8px; }
            .header { background-color: #dc2626; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
            .content { background-color: white; padding: 30px; border-radius: 0 0 8px 8px; }
            .field { margin-bottom: 20px; }
            .field-label { font-weight: bold; color: #dc2626; margin-bottom: 5px; }
            .field-value { padding: 10px; background-color: #f3f4f6; border-radius: 4px; border-left: 3px solid #dc2626; }
            .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>Trainer Profile Deletion Request</h2>
            </div>
            <div class="content">
              <div class="field">
                <div class="field-label">Trainer Name:</div>
                <div class="field-value">${name || 'Not provided'}</div>
              </div>
              <div class="field">
                <div class="field-label">Email:</div>
                <div class="field-value"><a href="mailto:${email}">${email}</a></div>
              </div>
              <div class="field">
                <div class="field-label">User ID:</div>
                <div class="field-value">${userId || 'Not provided'}</div>
              </div>
              <div class="footer">
                <p>This trainer requested deletion of their profile from the Celoris Trainer Resume Builder page. Please verify and process the deletion manually.</p>
                <p>Received on ${new Date().toLocaleString()}</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
            replyTo: email,
        };

        // Send email
        await transporter.sendMail(mailOptions);

        return NextResponse.json(
            { message: 'Deletion request sent successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error sending trainer deletion request:', error);
        return NextResponse.json(
            { error: 'Failed to send deletion request. Please try again later.' },
            { status: 500 }
        );
    }
}
