import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { type Database } from "@/types/supabase"

export async function uploadFile(
  file: File,
  bucket: string = "workout-media",
  folder: string = "covers"
) {
  const supabase = createClientComponentClient<Database>()
  const fileExt = file.name.split(".").pop()
  const fileName = `${crypto.randomUUID()}.${fileExt}`
  const filePath = `${folder}/${fileName}`

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    })

  if (error) {
    throw new Error(`Failed to upload file: ${error.message}`)
  }

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath)

  return {
    path: data.path,
    url: publicUrl,
  }
} 