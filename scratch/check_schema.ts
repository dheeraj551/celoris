
import { createClient } from '@supabase/supabase-js'

async function checkSchema() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase env vars')
    return
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  console.log('--- USERS TABLE ---')
  const { data: users, error: usersErr } = await supabase.from('users').select('*').limit(1)
  if (usersErr) console.error(usersErr)
  else console.log(Object.keys(users[0] || {}))

  console.log('--- PROFILES TABLE ---')
  const { data: profiles, error: profErr } = await supabase.from('profiles').select('*').limit(1)
  if (profErr) console.error(profErr)
  else console.log(Object.keys(profiles[0] || {}))

  console.log('--- TESTIMONIALS TABLE ---')
  const { data: testimonials, error: testErr } = await supabase.from('testimonials').select('*').limit(1)
  if (testErr) console.error(testErr)
  else console.log(Object.keys(testimonials[0] || {}))
}

checkSchema()
