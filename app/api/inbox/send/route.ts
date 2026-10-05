import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { scanContactShield } from '@/lib/contact-shield'

export async function POST(req: Request) {
  try {
    const { trainerId, senderName, senderEmail, subject, body } = await req.json()
    
    if (!trainerId || !body) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
    }

    // Run security shield against contact leaks, numbers, and self-promotion
    const bodyShield = scanContactShield(body || '')
    const subjectShield = scanContactShield(subject || '')

    let cleanBody = bodyShield.sanitizedText
    let cleanSubject = subjectShield.sanitizedText

    // If contact leaks or off-platform solicitations were detected, add security notice
    if (!bodyShield.isClean || !subjectShield.isClean) {
      cleanBody += '\n\n🛡️ [Celoris Shield: External contact sharing & off-platform links are disabled for student & trainer safety. All communication must remain on Celoris.]'
    }

    // We use the service role key to insert messages into the inbox securely without requiring RLS for anon.
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseService = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    const { data, error } = await supabaseService
      .from('inbox_messages')
      .insert([
        {
          trainer_id: trainerId,
          sender_name: senderName || 'Anonymous Student',
          sender_email: senderEmail || null,
          subject: cleanSubject,
          body: cleanBody,
          status: 'unread',
          message_type: 'student'
        }
      ])
      .select()

    if (error) {
      console.error("Inbox Insert Error:", error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      data,
      wasShielded: !bodyShield.isClean || !subjectShield.isClean,
      violations: [...bodyShield.violations, ...subjectShield.violations]
    })

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
