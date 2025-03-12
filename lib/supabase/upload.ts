import { getSupabaseBrowserClient } from "./client"

export async function uploadFile(file: File) {
  const supabase = getSupabaseBrowserClient()
  
  // Generate a unique file name
  const fileExt = file.name.split(".").pop()
  const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
  
  // Upload the file
  const { data, error } = await supabase.storage
    .from("workout-media")
    .upload(fileName, file)
    
  if (error) {
    throw error
  }
  
  // Get the public URL
  const { data: { publicUrl } } = supabase.storage
    .from("workout-media")
    .getPublicUrl(data.path)
    
  return {
    path: data.path,
    url: publicUrl
  }
} 