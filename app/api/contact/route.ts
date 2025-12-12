import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, email, subject, message } = body;

        // Validate required fields
        if (!name || !email || !subject || !message) {
            return NextResponse.json(
                { error: 'All fields are required' },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Invalid email format' },
                { status: 400 }
            );
        }

        // Create nodemailer transporter
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.MAIL_PORT || '587'),
            secure: false, // true for 465, false for other ports
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
            subject: `Contact Form: ${subject}`,
            html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f9f9f9;
              border-radius: 8px;
            }
            .header {
              background-color: #10b981;
              color: white;
              padding: 20px;
              border-radius: 8px 8px 0 0;
              text-align: center;
            }
            .content {
              background-color: white;
              padding: 30px;
              border-radius: 0 0 8px 8px;
            }
            .field {
              margin-bottom: 20px;
            }
            .field-label {
              font-weight: bold;
              color: #10b981;
              margin-bottom: 5px;
            }
            .field-value {
              padding: 10px;
              background-color: #f3f4f6;
              border-radius: 4px;
              border-left: 3px solid #10b981;
            }
            .message-box {
              background-color: #f3f4f6;
              padding: 15px;
              border-radius: 4px;
              border-left: 3px solid #10b981;
              white-space: pre-wrap;
            }
            .footer {
              margin-top: 20px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
              font-size: 12px;
              color: #6b7280;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>New Contact Form Submission</h2>
            </div>
            <div class="content">
              <div class="field">
                <div class="field-label">From:</div>
                <div class="field-value">${name}</div>
              </div>
              
              <div class="field">
                <div class="field-label">Email:</div>
                <div class="field-value">
                  <a href="mailto:${email}">${email}</a>
                </div>
              </div>
              
              <div class="field">
                <div class="field-label">Subject:</div>
                <div class="field-value">${subject}</div>
              </div>
              
              <div class="field">
                <div class="field-label">Message:</div>
                <div class="message-box">${message}</div>
              </div>
              
              <div class="footer">
                <p>This email was sent from the Celoris contact form</p>
                <p>Received on ${new Date().toLocaleString()}</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
            text: `
New Contact Form Submission

From: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

---
This email was sent from the Celoris contact form
Received on ${new Date().toLocaleString()}
      `,
            replyTo: email, // Allow direct reply to the sender
        };

        // Send email
        await transporter.sendMail(mailOptions);

        // Optional: Send confirmation email to the user
        const confirmationMailOptions = {
            from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`,
            to: email,
            subject: 'Thank you for contacting Celoris',
            html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f9f9f9;
              border-radius: 8px;
            }
            .header {
              background-color: #10b981;
              color: white;
              padding: 20px;
              border-radius: 8px 8px 0 0;
              text-align: center;
            }
            .content {
              background-color: white;
              padding: 30px;
              border-radius: 0 0 8px 8px;
            }
            .button {
              display: inline-block;
              padding: 12px 24px;
              background-color: #10b981;
              color: white;
              text-decoration: none;
              border-radius: 6px;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>Thank You for Contacting Us!</h2>
            </div>
            <div class="content">
              <p>Hi ${name},</p>
              
              <p>Thank you for reaching out to Celoris. We have received your message and our team will get back to you as soon as possible.</p>
              
              <p><strong>Your message:</strong></p>
              <p style="background-color: #f3f4f6; padding: 15px; border-radius: 4px; border-left: 3px solid #10b981;">${message}</p>
              
              <p>We typically respond within 24-48 hours during business days.</p>
              
              <p>Best regards,<br>
              The Celoris Team</p>
              
              <a href="https://celorisdesigns.com" class="button">Visit Our Website</a>
            </div>
          </div>
        </body>
        </html>
      `,
            text: `
Hi ${name},

Thank you for reaching out to Celoris. We have received your message and our team will get back to you as soon as possible.

Your message:
${message}

We typically respond within 24-48 hours during business days.

Best regards,
The Celoris Team
      `,
        };

        await transporter.sendMail(confirmationMailOptions);

        return NextResponse.json(
            { message: 'Email sent successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error sending email:', error);
        return NextResponse.json(
            { error: 'Failed to send email. Please try again later.' },
            { status: 500 }
        );
    }
}
