"use client"
import { Eye, Calendar, Play } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import type { MovementVideo } from "@/types/movement-video"
import { VideoModal } from "@/components/video-modal"
import Link from "next/link"
import { FavoriteButton } from "@/components/favorites/favorite-button"

interface VideoCardProps {
  video: MovementVideo
}

export function VideoCard({ video }: VideoCardProps) {
  // Format duration from seconds to MM:SS
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  // Format date to relative time (e.g., "2 days ago")
  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true })
  }

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <VideoModal videoUrl={video.videoUrl} videoTitle={video.title}>
        <div className="relative aspect-video cursor-pointer group">
          <img
            src={video.thumbnailUrl || "/placeholder.svg"}
            alt={video.title}
            className="object-cover w-full h-full transition-transform group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="rounded-full bg-primary/90 p-3 transform scale-90 group-hover:scale-100 transition-transform">
              <Play className="h-6 w-6 text-white fill-white" />
            </div>
          </div>
          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
            {formatDuration(video.durationSeconds)}
          </div>
          <Badge
            className="absolute top-2 right-2 shadow-sm"
            variant={
              video.difficulty === "Beginner"
                ? "secondary"
                : video.difficulty === "Intermediate"
                  ? "default"
                  : "destructive"
            }
          >
            {video.difficulty}
          </Badge>
        </div>
      </VideoModal>

      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <Link href={`/movements/${video.id}`} className="group">
            <h3 className="font-medium text-base line-clamp-2 group-hover:underline cursor-pointer">{video.title}</h3>
          </Link>
          <FavoriteButton
            item={video}
            itemType="movement"
            variant="ghost"
            size="icon"
            showText={false}
            className="h-8 w-8 rounded-full"
          />
        </div>

        <div className="text-sm text-muted-foreground mb-2">{video.instructor}</div>

        <div className="flex items-center text-xs text-muted-foreground gap-3">
          <div className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            {video.views.toLocaleString()} views
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatDate(video.dateAdded)}
          </div>
        </div>

        <div className="flex items-center justify-between mt-3">
          <Badge variant="outline" className="text-xs">
            {video.category}
          </Badge>
          <Link href={`/movements/${video.id}`}>
            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
              View Details
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

