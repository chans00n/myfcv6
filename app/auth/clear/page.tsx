"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { createBrowserClient } from "@supabase/ssr"
import type { Database } from "@/types/supabase"

export default function ClearSessionPage() {
  const router = useRouter()
  
  useEffect(() => {
    const clearSession = async () => {
      // Clear Supabase session
      const supabase = createBrowserClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      await supabase.auth.signOut()
      
      // Clear cookies
      const cookies = [
        'sb-access-token',
        'sb-refresh-token',
        'supabase-auth-token'
      ]
      
      cookies.forEach(name => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`
      })
      
      // Clear local storage
      localStorage.clear()
      
      // Redirect to login
      router.push('/auth/login')
    }
    
    clearSession()
  }, [router])
  
  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-muted-foreground">Clearing session...</p>
    </div>
  )
} 