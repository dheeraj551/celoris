import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from './database.types'

export const createServerClient = async () => {
  const cookieStore = await cookies()
  return createServerComponentClient<Database>({
    cookies: () => cookieStore
  })
}

export const createRouteClient = async () => {
  const cookieStore = await cookies()
  return createRouteHandlerClient<Database>({
    cookies: () => cookieStore
  })
}