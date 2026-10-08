import { NextRequest, NextResponse } from 'next/server'
import { createRouteClient } from '@/lib/supabase-server'
import { createClient } from '@supabase/supabase-js'
import { scanContactShield } from '@/lib/contact-shield'
import nodemailer from 'nodemailer'

const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const emailParam = searchParams.get('email')?.trim().toLowerCase()

    let userEmail = emailParam || ''
    let authenticated = false
    let currentUserId: string | null = null

    try {
      const supabase = await createRouteClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.email) {
        userEmail = user.email.toLowerCase()
        authenticated = true
        currentUserId = user.id
      }
    } catch (authErr) {
      // Unauthenticated, will fall back to emailParam if passed
    }

    if (!userEmail) {
      return NextResponse.json({
        authenticated: false,
        email: null,
        messages: [],
        inquiries: [],
      })
    }

    // 1. Fetch inquiries submitted by this student from leads table
    const { data: leadsData } = await adminSupabase
      .from('leads')
      .select('id, name, course, mode, location, requirement, status, created_at, phone, email')
      .ilike('email', userEmail)
      .order('created_at', { ascending: false })

    // 2. Fetch all messages in inbox_messages matching student's email
    let messagesList: any[] = []
    const { data: messagesData, error: msgError } = await adminSupabase
      .from('inbox_messages')
      .select('id, trainer_id, sender_name, sender_email, sender_phone, subject, body, status, message_type, created_at, updated_at')
      .ilike('sender_email', userEmail)
      .order('created_at', { ascending: true })

    if (msgError) {
      console.error('Error fetching student messages:', msgError)
    } else if (messagesData) {
      messagesList = [...messagesData]
    }

    // 3. For any contacted inquiries without an existing message thread, automatically provision an introduction thread
    const contactedLeads = (leadsData || []).filter(
      (l: any) => l.status === 'contacted' || l.status === 'converted' || l.status === 'in_progress'
    )

    for (const lead of contactedLeads) {
      const alreadyHasMessage = messagesList.some(
        (m: any) =>
          m.subject?.toLowerCase().includes((lead.course || '').toLowerCase()) ||
          m.body?.toLowerCase().includes((lead.course || '').toLowerCase())
      )

      if (!alreadyHasMessage) {
        try {
          const introBody = `Hi ${lead.name || 'there'}! A verified Celoris instructor has reviewed your requirement ("${lead.requirement || lead.course}") for ${lead.course} and contacted your inquiry. Feel free to reply here with your preferred class timings or any questions about the syllabus!`
          
          const { data: autoMsg } = await adminSupabase
            .from('inbox_messages')
            .insert({
              trainer_id: 'd30e2e38-866b-416b-b4ef-8b2e876f2f19',
              sender_name: 'Celoris Verified Trainer',
              sender_email: userEmail,
              subject: `Inquiry: ${lead.course || 'Training Requirements'}`,
              body: introBody,
              message_type: 'student_lead',
              status: 'sent',
            })
            .select()
            .single()

          if (autoMsg) {
            messagesList.push(autoMsg)
          }
        } catch (autoErr) {
          console.warn('Auto message creation error for lead:', autoErr)
        }
      }
    }

    // 4. Collect unique trainer IDs and fetch trainer profiles
    const trainerIds = Array.from(new Set(messagesList.map((m: any) => m.trainer_id).filter(Boolean)))
    
    let trainerProfilesMap: Record<string, any> = {}
    if (trainerIds.length > 0) {
      const { data: trainers } = await adminSupabase
        .from('profiles')
        .select('id, name, full_name, avatar_url, specialization, role')
        .in('id', trainerIds)

      if (trainers) {
        trainers.forEach((t: any) => {
          trainerProfilesMap[t.id] = t
        })
      }
    }

    // Enrich messages with trainer details
    const enrichedMessages = messagesList.map((msg: any) => {
      const trainer = trainerProfilesMap[msg.trainer_id] || null
      return {
        ...msg,
        trainer_name: trainer?.full_name || trainer?.name || 'Verified Trainer',
        trainer_avatar: trainer?.avatar_url || null,
        trainer_specialization: trainer?.specialization || 'Celoris Verified Instructor',
        is_from_trainer: msg.message_type === 'student_lead' || msg.message_type === 'trainer_reply',
      }
    })

    return NextResponse.json({
      authenticated,
      email: userEmail,
      messages: enrichedMessages,
      inquiries: leadsData || [],
    })
  } catch (error: any) {
    console.error('Student messages GET error:', error)
    return NextResponse.json({ error: error.message || 'Failed to fetch messages' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { trainerId, studentName, studentEmail, subject, messageText } = body

    if (!trainerId || !messageText?.trim()) {
      return NextResponse.json({ error: 'Missing trainerId or message' }, { status: 400 })
    }

    let finalEmail = studentEmail?.trim()
    let finalName = studentName?.trim() || 'Student'

    try {
      const supabase = await createRouteClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.email) {
        finalEmail = user.email
        finalName = user.user_metadata?.full_name || finalName
      }
    } catch (_) {}

    if (!finalEmail) {
      return NextResponse.json({ error: 'Student email is required to send messages' }, { status: 400 })
    }

    // Shield message
    const shield = scanContactShield(messageText)
    const cleanBody = shield.sanitizedText
    const cleanSubject = (subject || 'Message from Student').trim()

    // Insert student reply into inbox_messages
    const { data: newMsg, error: insertError } = await adminSupabase
      .from('inbox_messages')
      .insert({
        trainer_id: trainerId,
        sender_name: finalName,
        sender_email: finalEmail,
        subject: cleanSubject,
        body: cleanBody,
        status: 'unread',
        message_type: 'student',
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error inserting student message:', insertError)
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    // Fetch trainer's email to notify them of student's message
    const { data: trainerProfile } = await adminSupabase
      .from('profiles')
      .select('email, full_name, name')
      .eq('id', trainerId)
      .single()

    if (trainerProfile?.email) {
      try {
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

        await transporter.sendMail({
          from: `"Celoris Teach" <${process.env.MAIL_FROM_ADDRESS}>`,
          to: trainerProfile.email,
          subject: `💬 New Student Reply from ${finalName} on Celoris`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 580px; margin: 0 auto; background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
              <div style="background: #059669; color: #fff; padding: 24px;">
                <h2 style="margin: 0; font-size: 20px;">New Student Reply on Celoris</h2>
                <p style="margin: 4px 0 0; opacity: 0.85; font-size: 13px;">From student: <strong>${finalName}</strong> (${finalEmail})</p>
              </div>
              <div style="padding: 24px;">
                <p style="font-size: 14px; color: #374151; font-weight: bold; margin-bottom: 8px;">Subject: ${cleanSubject}</p>
                <div style="background: #f3f4f6; border-left: 4px solid #059669; padding: 16px; border-radius: 6px; font-size: 14px; color: #111; line-height: 1.6; margin-bottom: 24px;">
                  "${cleanBody}"
                </div>
                <div style="text-align: center;">
                  <a href="https://celorisdesigns.com/teach/dashboard/trainer/inbox" style="display: inline-block; background: #059669; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px;">
                    Open Trainer Inbox
                  </a>
                </div>
              </div>
            </div>
          `,
        })
      } catch (mailErr) {
        console.warn('Could not send trainer notification email:', mailErr)
      }
    }

    return NextResponse.json({
      success: true,
      message: newMsg,
    })
  } catch (error: any) {
    console.error('Student messages POST error:', error)
    return NextResponse.json({ error: error.message || 'Failed to send message' }, { status: 500 })
  }
}
