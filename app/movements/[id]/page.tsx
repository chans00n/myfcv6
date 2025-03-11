"use client"

import { useEffect, useState } from "react"
import { use } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { useSidebarContext } from "@/components/sidebar-context"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Home, Waves, Play, Eye, Calendar, Clock, Share2, ThumbsUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatDistanceToNow } from "date-fns"
import { movementVideos } from "@/data/movement-videos"
import { VideoCard } from "@/components/video-card"
import { FavoriteButton } from "@/components/favorites/favorite-button"

export default function MovementDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const { isOpen } = useSidebarContext()
  const [video, setVideo] = useState(movementVideos[0])
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [relatedVideos, setRelatedVideos] = useState(movementVideos.slice(0, 4))

  // Find the video by ID
  useEffect(() => {
    const foundVideo = movementVideos.find((v) => v.id === resolvedParams.id)
    if (foundVideo) {
      setVideo(foundVideo)

      // Get related videos (same category, excluding current video)
      const related = movementVideos
        .filter((v) => v.category === foundVideo.category && v.id !== foundVideo.id)
        .slice(0, 4)
      setRelatedVideos(related)
    }
  }, [resolvedParams.id])

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

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const toggleLiked = () => {
    setIsLiked(!isLiked)
  }

  const shareVideo = () => {
    if (navigator.share) {
      navigator.share({
        title: video.title,
        text: video.description,
        url: window.location.href,
      })
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href)
      alert("Link copied to clipboard!")
    }
  }

  return (
    <SidebarProvider defaultOpen={isOpen}>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4 w-full">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard">
                    <Home className="h-4 w-4 mr-1" />
                    Home
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/movements">
                    <Waves className="h-4 w-4 mr-1" />
                    Movement Library
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href={`/movements/${video.id}`}>{video.title}</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex-1 overflow-auto">
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                {/* Video Player */}
                <div className="relative aspect-video bg-black rounded-lg overflow-hidden mb-6">
                  {isPlaying ? (
                    <video
                      src={video.videoUrl}
                      poster={video.thumbnailUrl}
                      controls
                      autoPlay
                      className="w-full h-full"
                    ></video>
                  ) : (
                    <div className="relative w-full h-full">
                      <img
                        src={video.thumbnailUrl || "/placeholder.svg"}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Button
                          onClick={togglePlay}
                          size="lg"
                          variant="outline"
                          className="rounded-full bg-primary/90 hover:bg-primary border-0 h-16 w-16"
                        >
                          <Play className="h-8 w-8 text-white fill-white" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Video Info */}
                <div className="mb-6">
                  <h1 className="text-2xl font-bold mb-2">{video.title}</h1>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {video.views.toLocaleString()} views
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(video.dateAdded)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {formatDuration(video.durationSeconds)}
                    </div>
                    <Badge
                      variant={
                        video.difficulty === "Beginner"
                          ? "outline"
                          : video.difficulty === "Intermediate"
                            ? "secondary"
                            : "default"
                      }
                    >
                      {video.difficulty}
                    </Badge>
                    <Badge variant="outline">{video.category}</Badge>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    <Button variant={isLiked ? "default" : "outline"} size="sm" onClick={toggleLiked} className="gap-2">
                      <ThumbsUp className="h-4 w-4" />
                      {isLiked ? "Liked" : "Like"}
                    </Button>
                    <FavoriteButton item={video} itemType="movement" size="sm" />
                    <Button variant="outline" size="sm" onClick={shareVideo} className="gap-2">
                      <Share2 className="h-4 w-4" />
                      Share
                    </Button>
                  </div>

                  <Separator className="my-6" />

                  <Tabs defaultValue="description">
                    <TabsList>
                      <TabsTrigger value="description">Description</TabsTrigger>
                      <TabsTrigger value="instructions">Instructions</TabsTrigger>
                      <TabsTrigger value="benefits">Benefits</TabsTrigger>
                    </TabsList>
                    <TabsContent value="description" className="mt-4">
                      <p className="text-muted-foreground">{video.description}</p>
                    </TabsContent>
                    <TabsContent value="instructions" className="mt-4">
                      <div className="space-y-4">
                        <p className="text-muted-foreground">Follow these steps to perform the movement correctly:</p>
                        <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                          <li>Start by relaxing your facial muscles completely</li>
                          <li>Position your fingers as shown in the video</li>
                          <li>Apply gentle pressure while performing the movement</li>
                          <li>Hold for 5-10 seconds at the peak of the movement</li>
                          <li>Release slowly and repeat for the recommended repetitions</li>
                        </ol>
                      </div>
                    </TabsContent>
                    <TabsContent value="benefits" className="mt-4">
                      <div className="space-y-4">
                        <p className="text-muted-foreground">This movement provides the following benefits:</p>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                          <li>Strengthens the facial muscles in the {video.category.toLowerCase()} area</li>
                          <li>Improves blood circulation and skin tone</li>
                          <li>Helps reduce the appearance of fine lines and wrinkles</li>
                          <li>Promotes facial symmetry and definition</li>
                          <li>Can help relieve tension in the face</li>
                        </ul>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>

                {/* Instructor Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Instructor</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                        <span className="text-lg font-medium">{video.instructor.charAt(0)}</span>
                      </div>
                      <div>
                        <h3 className="font-medium">{video.instructor}</h3>
                        <p className="text-sm text-muted-foreground">Facial Fitness Expert</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar - Related Videos */}
              <div>
                <h2 className="text-xl font-bold mb-4">Related Movements</h2>
                <div className="space-y-4">
                  {relatedVideos.map((relatedVideo) => (
                    <VideoCard key={relatedVideo.id} video={relatedVideo} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

