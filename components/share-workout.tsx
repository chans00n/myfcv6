"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Share2, Mail, Copy, Twitter, Facebook, Linkedin } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ShareWorkoutProps {
  workout: {
    id: string
    title: string
  }
}

export function ShareWorkout({ workout }: ShareWorkoutProps) {
  const { toast } = useToast()
  const [isCopied, setIsCopied] = useState(false)

  const shareUrl =
    typeof window !== "undefined" ? `${window.location.origin}/workouts/${workout.id}` : `/workouts/${workout.id}`

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setIsCopied(true)
      toast({
        title: "Link copied",
        description: "Workout link has been copied to clipboard",
      })
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy the link to clipboard",
        variant: "destructive",
      })
    }
  }

  const handleEmailShare = () => {
    const subject = encodeURIComponent(`Check out this workout: ${workout.title}`)
    const body = encodeURIComponent(`I thought you might like this workout: ${shareUrl}`)
    window.open(`mailto:?subject=${subject}&body=${body}`)
  }

  const handleTwitterShare = () => {
    const text = encodeURIComponent(`Check out this workout: ${workout.title} ${shareUrl}`)
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank")
  }

  const handleFacebookShare = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, "_blank")
  }

  const handleLinkedInShare = () => {
    const title = encodeURIComponent(workout.title)
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&title=${title}`,
      "_blank",
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" title="Share workout">
          <Share2 className="h-5 w-5" />
          <span className="sr-only">Share workout</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleCopyLink}>
          <Copy className="mr-2 h-4 w-4" />
          <span>{isCopied ? "Copied!" : "Copy link"}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleEmailShare}>
          <Mail className="mr-2 h-4 w-4" />
          <span>Email</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleTwitterShare}>
          <Twitter className="mr-2 h-4 w-4" />
          <span>Twitter</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleFacebookShare}>
          <Facebook className="mr-2 h-4 w-4" />
          <span>Facebook</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLinkedInShare}>
          <Linkedin className="mr-2 h-4 w-4" />
          <span>LinkedIn</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

