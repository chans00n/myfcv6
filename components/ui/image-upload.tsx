"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "./button"
import { Input } from "./input"
import { ImageIcon, X } from "lucide-react"

interface ImageUploadProps {
  value?: string
  onChange: (value: string) => void
  onUpload: (file: File) => Promise<string>
  disabled?: boolean
}

export function ImageUpload({
  value,
  onChange,
  onUpload,
  disabled
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setIsUploading(true)
      const url = await onUpload(file)
      onChange(url)
    } catch (error) {
      console.error("Error uploading image:", error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemove = () => {
    onChange("")
  }

  return (
    <div className="flex items-center gap-4">
      <div className="relative flex h-40 w-40 items-center justify-center rounded-lg border">
        {value ? (
          <>
            <Image
              src={value}
              alt="Upload preview"
              fill
              className="rounded-lg object-cover"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute -right-2 -top-2 h-6 w-6"
              onClick={handleRemove}
              disabled={disabled || isUploading}
            >
              <X className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <ImageIcon className="h-8 w-8 text-muted-foreground" />
        )}
      </div>
      <Input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        disabled={disabled || isUploading}
        className="max-w-xs"
      />
    </div>
  )
} 