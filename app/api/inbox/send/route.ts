import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: Request) {
  try {
    const { trainerId, senderName, senderEmail, subject, body } = await req.json()
    
    // We use the service role key to insert messages into the inbox securely without requiring RLS for anon.
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseService = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    const { data, error } = await supabaseService
      .from('inbox_messages')
      .insert([
        {
          trainer_id: trainerId,
          sender_name: senderName,
          sender_email: senderEmail,
          subject: subject,
          body: body,
          status: 'unread',
          message_type: 'student'
        }
      ])
      .select()

    if (error) {
      console.error("Inbox Insert Error:", error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, data })

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
