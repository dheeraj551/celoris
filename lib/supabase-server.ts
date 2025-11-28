import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from './database.types'

export const createServerClient = () => {
  return createServerComponentClient<Database>({ cookies })
}

export const createRouteClient = () => {
  return createRouteHandlerClient<Database>({ cookies })
}