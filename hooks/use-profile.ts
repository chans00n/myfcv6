import { useCallback } from "react"
import { useAuth } from "@/context/auth-context"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { toast } from "sonner"

import type { Database } from "@/types/supabase"

export type Profile = {
  id: string
  name: string | null
  avatar_url: string | null
  bio: string | null
  twitter_url: string | null
  github_url: string | null
  linkedin_url: string | null
  updated_at: string
}

export function useProfile() {
  const { user } = useAuth()
  const supabase = getSupabaseBrowserClient()

  const getProfile = useCallback(async () => {
    try {
      if (!user?.id) return null

      const { data, error } = await supabase
        .from("profiles")
        .select()
        .eq("id", user.id)
        .single()

      if (error) {
        if (error.code === "PGRST116") {
          // Record not found - create a new profile
          const { data: newProfile, error: createError } = await supabase
            .from("profiles")
            .insert([
              {
                id: user.id,
                name: user.user_metadata?.full_name || user.email?.split("@")[0] || "",
                avatar_url: user.user_metadata?.avatar_url || null,
              },
            ])
            .select()
            .single()

          if (createError) throw createError
          return newProfile as Profile
        }
        throw error
      }

      return data as Profile
    } catch (error) {
      console.error("Error fetching profile:", error)
      toast.error("Failed to fetch profile")
      return null
    }
  }, [user, supabase])

  const updateProfile = useCallback(
    async (updates: Partial<Profile>) => {
      try {
        if (!user?.id) throw new Error("User not found")

        // First update the user metadata
        const { data: userData, error: metadataError } = await supabase.auth.updateUser({
          data: {
            full_name: updates.name,
            avatar_url: updates.avatar_url,
          }
        })

        if (metadataError) {
          console.error('Metadata update error:', metadataError)
          throw metadataError
        }

        // Then update the profile
        const { data, error } = await supabase
          .from("profiles")
          .update({
            ...updates,
            updated_at: new Date().toISOString(),
          })
          .eq("id", user.id)
          .select()
          .single()

        if (error) {
          console.error('Profile update error:', error)
          throw error
        }
        
        toast.success("Profile updated successfully")
        return data as Profile
      } catch (error) {
        console.error("Error updating profile:", error)
        toast.error("Failed to update profile")
        return null
      }
    },
    [user]
  )

  return {
    getProfile,
    updateProfile,
  }
} 