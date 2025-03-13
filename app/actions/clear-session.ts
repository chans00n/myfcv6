"use server"

import { cookies } from "next/headers"
import { createServerClient } from "@/lib/supabase/server"

export async function clearSession() {
  const cookieStore = await cookies()
  const supabase = createServerClient()
  
  // Clear Supabase session
  await supabase.auth.signOut()
  
  // Clear all cookies
  const supabaseCookies = [
    'sb-access-token',
    'sb-refresh-token',
    'supabase-auth-token'
  ]
  
  for (const name of supabaseCookies) {
    cookieStore.delete({
      name,
      domain: '.myfc.app',
      path: '/',
      secure: true,
      sameSite: 'lax'
    })
  }
} 