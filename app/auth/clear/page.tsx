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
      
      // Clear cookies with different path/domain combinations
      const cookies = [
        'sb-access-token',
        'sb-refresh-token',
        'supabase-auth-token'
      ]
      
      const paths = ['/', '/auth', '']
      const domains = [
        window.location.hostname,
        `.${window.location.hostname}`,
        ''
      ]
      
      cookies.forEach(name => {
        paths.forEach(path => {
          domains.forEach(domain => {
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}${domain ? `; domain=${domain}` : ''}`
          })
        })
      })
      
      // Clear local storage
      localStorage.clear()
      sessionStorage.clear()
      
      // Force reload to clear any in-memory state
      window.location.href = '/auth/login'
    }
    
    clearSession()
  }, [router])
  
  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-muted-foreground">Clearing session...</p>
    </div>
  )
} 