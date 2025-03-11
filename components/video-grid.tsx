"use client"

import { VideoCard } from "@/components/video-card"
import { VideoListItem } from "@/components/video-list-item"
import type { MovementVideo } from "@/types/movement-video"

interface VideoGridProps {
  videos: MovementVideo[]
  viewMode: string
}

export function VideoGrid({ videos, viewMode }: VideoGridProps) {
  if (viewMode === "grid") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col space-y-4">
      {videos.map((video) => (
        <VideoListItem key={video.id} video={video} />
      ))}
    </div>
  )
}

