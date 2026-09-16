import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { PREBUILT_EXAMS } from '@/components/skillverify/data/mockData'

// Sends a candidate the link to a specific exam's standalone public page
// (app/exam/[examId]/page.tsx). Called from the "Invite Candidate" panel on
// each exam card in ExamsHub.tsx — visible only to the two admin accounts
// there (client-side gate, same convention as the rest of the /admin APIs
// in this codebase), so this isn't linked from anywhere a random visitor
// could reach it. It's still a mail-sending endpoint, so it validates the
// examId against the real exam list rather than trusting the request blindly.
export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { examId, candidateName, candidateEmail } = body as {
            examId?: string
            candidateName?: string
            candidateEmail?: string
        }

        if (!examId || !candidateName || !candidateEmail) {
            return NextResponse.json(
                { error: 'examId, candidateName and candidateEmail are required' },
                { status: 400 }
            )
        }

        const exam = PREBUILT_EXAMS.find((e) => e.id === examId)
        if (!exam) {
            return NextResponse.json({ error: 'Exam not found' }, { status: 404 })
        }

        if (!process.env.MAIL_USERNAME || !process.env.MAIL_PASSWORD) {
            return NextResponse.json(
                { error: 'Email sending is not configured on the server' },
                { status: 500 }
            )
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
        })

        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://celorisdesigns.com'
        const examUrl = `${siteUrl}/exam/${exam.id}?name=${encodeURIComponent(candidateName)}&email=${encodeURIComponent(candidateEmail)}`

        await transporter.sendMail({
            from: `"${process.env.MAIL_FROM_NAME || 'Celoris'}" <${process.env.MAIL_FROM_ADDRESS}>`,
            to: candidateEmail,
            subject: `Assessment invite: ${exam.title} — Celoris`,
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
            .meta { color: #6b7280; font-size: 13px; margin-top: 12px; }
            .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>Hi ${candidateName},</h2>
            </div>
            <div class="content">
              <p>You've been invited to take the <strong>${exam.title}</strong> assessment as part of your application with Celoris Designs.</p>
              <p class="meta">${exam.timeLimitMinutes} minutes &middot; ${exam.questions.length} questions &middot; ${exam.passingScorePercent}% required to pass</p>
              <p>No account needed — just click below, confirm your name and email, and start when you're ready.</p>
              <a class="cta" href="${examUrl}">Start the Assessment</a>
              <div class="footer">
                <p>Sent by the Celoris hiring team.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
        })

        return NextResponse.json({ success: true, examUrl })
    } catch (error: any) {
        console.error('Exam invite error:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to send invite' },
            { status: 500 }
        )
    }
}
