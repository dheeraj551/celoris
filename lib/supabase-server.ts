import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from './database.types'

export const createServerClient = async () => {
  return createServerComponentClient<Database>({
    cookies: () => cookies()
  })
}

export const createRouteClient = async () => {
  return createRouteHandlerClient<Database>({
    cookies: () => cookies()
  })
}