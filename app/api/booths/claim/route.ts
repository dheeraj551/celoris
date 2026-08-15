import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: Request) {
  try {
    const { courseId } = await req.json()
    
    // Actually, passing auth header so RLS works
    const authHeader = req.headers.get('authorization')
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    
    // We will just use the service role key here to avoid header extraction issues in Next.js
    // and manually verify the token. But simpler: use Next.js route handlers pattern
    const supabaseService = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY!)
    
    // We can't use RPC auth.uid() if we use service key.
    // Let's rewrite the logic inside the API route using service key for atomic transaction.
    
    // But how to get the user ID? We will pass it in the body, but that's insecure.
    // Actually, the client uses `@supabase/supabase-js` which sets cookies or Auth header.
    // Let's create a standard client and try to get the user from it.
    
    const supabase = createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
      global: {
        headers: {
          cookie: req.headers.get('cookie') || '',
          authorization: req.headers.get('authorization') || ''
        }
      }
    })
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Now call RPC
    const { data, error } = await supabase.rpc('claim_trainer_booth', {
      p_course_id: courseId,
      p_trainer_id: user.id
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, data })

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
