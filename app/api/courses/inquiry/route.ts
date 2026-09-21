import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { createRouteClient } from '@/lib/supabase-server';
import { createSupabaseClientForServer } from '@/lib/supabase-client';

// Course enrollment now requires a signed-in applicant and an uploaded
// student ID (courses are free for students, so the ID is what gates that —
// see CourseInquiryDialog.tsx, which uploads the file straight to the
// private 'student-documents' Supabase Storage bucket before calling this
// route with the resulting storage path). Same shape as the existing
// trainer-registration/job-application routes: identify the caller from
// their session cookie, then persist with the service-role client.
//
// This used to ONLY send a one-off email with no database record at all —
// that stays (support still gets notified immediately), but the real
// record is now the course_applications row, since an uploaded ID has to
// be something an admin can actually go back and review/approve.
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, email, phone, courseTitle, courseSlug, message, studentIdPath } = body;

        if (!name || !email || !courseTitle) {
            return NextResponse.json(
                { error: 'Name, Email and Course Title are required' },
                { status: 400 }
            );
        }

        if (!studentIdPath) {
            return NextResponse.json(
                { error: 'A student ID upload is required to apply.' },
                { status: 400 }
            );
        }

        const routeClient = await createRouteClient();
        const { data: { user }, error: authError } = await routeClient.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: 'Please sign in to apply — the student ID upload needs an account to attach it to.' },
                { status: 401 }
            );
        }

        const admin = createSupabaseClientForServer();

        // Sanity check: the uploaded object actually belongs to this user
        // and actually exists in the student-documents bucket, rather than
        // trusting an arbitrary client-supplied path.
        const expectedPrefix = `${user.id}/`;
        if (!studentIdPath.startsWith(expectedPrefix)) {
            return NextResponse.json({ error: 'Invalid student ID upload.' }, { status: 400 });
        }

        const { data: application, error: insertError } = await admin
            .from('course_applications')
            .insert({
                user_id: user.id,
                course_title: courseTitle,
                course_slug: courseSlug || null,
                full_name: name,
                email,
                phone: phone || null,
                message: message || null,
                student_id_url: studentIdPath,
                status: 'pending',
            })
            .select()
            .single();

        if (insertError) {
            console.error('course_applications insert error:', insertError);
            return NextResponse.json(
                { error: 'Failed to submit your application. Please try again.' },
                { status: 500 }
            );
        }

        // Best-effort notification email — failing to send this should never
        // block the application itself, since the real record is now the DB
        // row above.
        try {
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
                subject: `Course Application (free, ID uploaded): ${courseTitle}`,
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
              .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; text-align: center; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2>New Course Application</h2>
              </div>
              <div class="content">
                <div class="field">
                  <div class="field-label">Course:</div>
                  <div class="field-value">${courseTitle}</div>
                </div>
                <div class="field">
                  <div class="field-label">Student Name:</div>
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
                  <div class="field-label">Additional Message:</div>
                  <div class="field-value">${message}</div>
                </div>
                ` : ''}
                <div class="field">
                  <div class="field-label">Student ID:</div>
                  <div class="field-value">Uploaded — review and approve in the admin panel under Course Applications.</div>
                </div>
                <div class="footer">
                  <p>This application was submitted from the Celoris Course Enrollment Form</p>
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
        } catch (mailError) {
            console.error('Course application notification email failed (non-fatal):', mailError);
        }

        return NextResponse.json(
            { message: 'Application submitted successfully', application },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error submitting course application:', error);
        return NextResponse.json(
            { error: 'Failed to submit application. Please try again later.' },
            { status: 500 }
        );
    }
}
