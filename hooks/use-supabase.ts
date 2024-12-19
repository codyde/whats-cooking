"use client"

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useEffect, useState } from 'react'
import { type Session } from '@supabase/supabase-js'
import { type Database } from '@/lib/supabase/types'

export function useSupabase() {
  const [session, setSession] = useState<Session | null>(null)
  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  return { supabase, session }
}