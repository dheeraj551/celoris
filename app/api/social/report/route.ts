
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(req: Request) {
    try {
        const supabase = createRouteHandlerClient({ cookies })
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        const body = await req.json()
        const { targetUserId, reason, details } = body

        if (!targetUserId || !reason) {
            return new NextResponse('Missing required fields', { status: 400 })
        }

        // Get target user details for the email
        const { data: targetUser } = await supabase
            .from('users')
            .select('username, full_name, email')
            .eq('id', targetUserId)
            .single()

        // Configure transporter
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            },
        })

        const mailOptions = {
            from: process.env.SMTP_FROM || '"Celoris Support" <support@celorisdesigns.com>',
            to: 'support@celorisdesigns.com',
            subject: `[User Report] User Report against ${targetUser?.username || targetUserId}`,
            text: `
        User Report Received
        
        Reporter ID: ${user.id}
        Reporter Email: ${user.email}
        
        Reported User: ${targetUser?.full_name} (@${targetUser?.username})
        Reported User ID: ${targetUserId}
        
        Reason: ${reason}
        Details: ${details || 'No additional details provided.'}
        
        Timestamp: ${new Date().toISOString()}
      `,
            html: `
        <h2>User Report Received</h2>
        <p><strong>Reporter ID:</strong> ${user.id}</p>
        <p><strong>Reporter Email:</strong> ${user.email}</p>
        <hr />
        <h3>Reported User Details</h3>
        <p><strong>Name:</strong> ${targetUser?.full_name}</p>
        <p><strong>Username:</strong> @${targetUser?.username}</p>
        <p><strong>ID:</strong> ${targetUserId}</p>
        <hr />
        <h3>Report Information</h3>
        <p><strong>Reason:</strong> ${reason}</p>
        <p><strong>Details:</strong><br />${details || 'No additional details provided.'}</p>
        <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
      `
        }

        await transporter.sendMail(mailOptions)

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error sending report:', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}
