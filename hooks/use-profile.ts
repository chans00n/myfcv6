import { useCallback } from "react"
import { useAuth } from "@/context/auth-context"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { toast } from "sonner"

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

// Create a singleton instance of the Supabase client
const supabase = createClientComponentClient()

export function useProfile() {
  const { user } = useAuth()

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
                name: user.user_metadata?.name || user.email?.split("@")[0] || "",
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
  }, [user])

  const updateProfile = useCallback(
    async (updates: Partial<Profile>) => {
      try {
        if (!user?.id) throw new Error("User not found")

        const { error } = await supabase
          .from("profiles")
          .update({
            ...updates,
            updated_at: new Date().toISOString(),
          })
          .eq("id", user.id)

        if (error) throw error
        toast.success("Profile updated successfully")
        return true
      } catch (error) {
        console.error("Error updating profile:", error)
        toast.error("Failed to update profile")
        return false
      }
    },
    [user]
  )

  return {
    getProfile,
    updateProfile,
  }
} 