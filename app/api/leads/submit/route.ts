import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      phone,
      email,
      contact,
      course,
      mode,
      location,
      requirement,
      budget,
      source,
    } = body;

    if (!name || (!phone && !email && !contact)) {
      return NextResponse.json(
        { error: 'Name and contact information are required' },
        { status: 400 }
      );
    }

    // Determine contact fields intelligently
    const rawContact = (contact || phone || email || '').toString().trim();
    let parsedPhone = phone ? phone.toString().trim() : null;
    let parsedEmail = email ? email.toString().trim().toLowerCase() : null;

    if (!parsedEmail && rawContact.includes('@')) {
      const emailMatch = rawContact.match(/[\w.-]+@[\w.-]+\.\w+/);
      if (emailMatch) parsedEmail = emailMatch[0].toLowerCase();
    }

    if (!parsedPhone) {
      const phoneDigits = rawContact.replace(/\D/g, '');
      if (phoneDigits.length >= 10) {
        parsedPhone = rawContact;
      } else if (!rawContact.includes('@')) {
        parsedPhone = rawContact;
      }
    }

    const payload = {
      name: name.toString().trim(),
      phone: parsedPhone,
      email: parsedEmail,
      contact_info: rawContact || `${parsedPhone || ''} ${parsedEmail || ''}`.trim(),
      course: (course || 'General Inquiry').toString().trim(),
      mode: (mode || 'Online').toString().trim(),
      location: location ? location.toString().trim() : null,
      requirement: (requirement || '').toString().trim(),
      budget: budget ? budget.toString().trim() : null,
      source: source || 'website_learn_page',
      status: 'open',
    };

    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL ||
      process.env.SUPABASE_URL ||
      'https://suaqywhmaheoansrinzw.supabase.co';
    const supabaseKey =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.SUPABASE_ANON_KEY ||
      '';

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await supabase
      .from('leads')
      .insert([payload])
      .select();

    if (error) {
      console.error('Lead submission insert error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const savedLead = data?.[0] || payload;

    // Send email alert to admin / support asynchronously
    try {
      if (process.env.MAIL_USERNAME && process.env.MAIL_PASSWORD) {
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

        const mailOptions = {
          from: `"Celoris Academy" <${process.env.MAIL_FROM_ADDRESS || 'support@celorisdesigns.com'}>`,
          to: 'support@celorisdesigns.com',
          subject: `🎓 New Student Lead: ${payload.name} — ${payload.course}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
              <div style="background: #059669; color: #ffffff; padding: 24px; text-align: center;">
                <h1 style="margin: 0; font-size: 20px; font-weight: bold;">New Student Learning Request</h1>
                <p style="margin: 6px 0 0; opacity: 0.9; font-size: 13px;">Posted directly to public leads table for Teach section</p>
              </div>
              <div style="padding: 24px;">
                <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-weight: bold; width: 35%;">Student Name:</td>
                    <td style="padding: 8px 0; font-weight: bold; color: #111827;">${payload.name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-weight: bold;">Course / Subject:</td>
                    <td style="padding: 8px 0; color: #059669; font-weight: bold;">${payload.course}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-weight: bold;">Preferred Mode:</td>
                    <td style="padding: 8px 0; color: #111827;">${payload.mode}</td>
                  </tr>
                  ${payload.location ? `
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-weight: bold;">Location:</td>
                    <td style="padding: 8px 0; color: #111827;">${payload.location}</td>
                  </tr>` : ''}
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-weight: bold;">Phone / WhatsApp:</td>
                    <td style="padding: 8px 0; color: #111827;">${payload.phone || 'Not provided'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-weight: bold;">Email:</td>
                    <td style="padding: 8px 0; color: #111827;">${payload.email || 'Not provided'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-weight: bold; vertical-align: top;">Requirement:</td>
                    <td style="padding: 8px 0; color: #374151; white-space: pre-wrap;">${payload.requirement || 'None'}</td>
                  </tr>
                </table>
                <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e5e7eb; text-align: center;">
                  <a href="https://celorisdesigns.com/teach/dashboard/trainer/enquiries" style="display: inline-block; background: #059669; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px;">Open Teach Enquiries Dashboard</a>
                </div>
              </div>
            </div>
          `,
          text: `New Student Learning Request\nName: ${payload.name}\nCourse: ${payload.course}\nMode: ${payload.mode}\nPhone: ${payload.phone}\nEmail: ${payload.email}\nRequirement: ${payload.requirement}`,
        };

        transporter.sendMail(mailOptions).catch((err) => console.error('Lead mail alert error:', err));
      }
    } catch (mailErr) {
      console.error('Mail setup error:', mailErr);
    }

    return NextResponse.json({ success: true, lead: savedLead }, { status: 201 });
  } catch (err: any) {
    console.error('Error submitting lead:', err);
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
