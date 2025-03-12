import * as React from "react"
import { useDropzone } from "react-dropzone"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"

interface ImageUploadProps {
  className?: string
  value?: string
  onChange?: (url: string) => void
  onUpload?: (file: File) => Promise<{ url: string }>
  disabled?: boolean
  loading?: boolean
}

export function ImageUpload({
  className,
  value,
  onChange,
  onUpload,
  disabled,
  loading,
}: ImageUploadProps) {
  const [preview, setPreview] = React.useState<string | null>(value || null)
  const [isUploading, setIsUploading] = React.useState(false)

  const onDrop = React.useCallback(
    async (acceptedFiles: File[]) => {
      if (!onUpload) return

      try {
        setIsUploading(true)
        const file = acceptedFiles[0]
        const { url } = await onUpload(file)
        setPreview(url)
        onChange?.(url)
      } catch (error) {
        console.error("Failed to upload image:", error)
      } finally {
        setIsUploading(false)
      }
    },
    [onUpload, onChange]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif"],
    },
    maxFiles: 1,
    disabled: disabled || isUploading || loading,
  })

  React.useEffect(() => {
    setPreview(value || null)
  }, [value])

  return (
    <div className={cn("space-y-4 w-full", className)}>
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer",
          isDragActive && "border-primary",
          (disabled || isUploading || loading) && "opacity-50 cursor-default"
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center gap-2 text-center">
          {preview ? (
            <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt="Preview"
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <>
              <div className="rounded-full bg-muted p-4">
                <Icons.upload className="h-6 w-6" />
              </div>
              <div className="text-sm text-muted-foreground">
                {isDragActive ? (
                  <span>Drop the image here</span>
                ) : (
                  <span>
                    Drag & drop an image here, or{" "}
                    <Button
                      variant="link"
                      className="px-1 text-sm text-primary"
                    >
                      browse
                    </Button>
                  </span>
                )}
              </div>
              <div className="text-xs text-muted-foreground">
                PNG, JPG or GIF (max 4MB)
              </div>
            </>
          )}
        </div>
      </div>
      {preview && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            setPreview(null)
            onChange?.("")
          }}
          disabled={disabled || isUploading || loading}
        >
          Remove Image
        </Button>
      )}
    </div>
  )
} 