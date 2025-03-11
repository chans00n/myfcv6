"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog"
import { X, Share, RotateCcw, RotateCw, Heart, Pause, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { useIsMobile } from "@/hooks/use-mobile"

interface VideoModalProps {
  videoUrl: string
  videoTitle?: string
  children: React.ReactNode
}

export function VideoModal({ videoUrl, videoTitle, children }: VideoModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const playerRef = useRef<YT.Player | null>(null)
  const isMobile = useIsMobile()

  // Check if the URL is a YouTube URL
  const isYouTube = videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be")

  // Extract YouTube video ID
  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11 ? match[2] : null
  }

  const youtubeId = isYouTube ? getYouTubeId(videoUrl) : null

  // Format time in MM:SS format
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  // YouTube API integration
  useEffect(() => {
    if (!isYouTube || !youtubeId || !isOpen) return

    // Load YouTube IFrame API if not already loaded
    if (!window.YT) {
      const tag = document.createElement("script")
      tag.src = "https://www.youtube.com/iframe_api"
      const firstScriptTag = document.getElementsByTagName("script")[0]
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)

      window.onYouTubeIframeAPIReady = initYouTubePlayer
    } else {
      initYouTubePlayer()
    }

    function initYouTubePlayer() {
      const playerDiv = document.getElementById("youtube-player")
      if (!playerDiv || !youtubeId) return

      if (playerRef.current) {
        playerRef.current.destroy()
      }

      playerRef.current = new window.YT.Player("youtube-player", {
        videoId: youtubeId as string,
        playerVars: {
          autoplay: 1,
          playsinline: 1,
          controls: 0,
          rel: 0,
          showinfo: 0,
          modestbranding: 1,
          fs: 0,
        },
        events: {
          onReady: (event) => {
            event.target.playVideo()
            setIsPlaying(true)
            // Get duration
            setDuration(event.target.getDuration())

            // Start progress tracking
            const updateYouTubeProgress = () => {
              if (playerRef.current) {
                setCurrentTime(playerRef.current.getCurrentTime())
                if (isOpen) {
                  requestAnimationFrame(updateYouTubeProgress)
                }
              }
            }
            requestAnimationFrame(updateYouTubeProgress)
          },
          onStateChange: (event) => {
            // Update playing state based on player state
            setIsPlaying(event.data === window.YT.PlayerState.PLAYING)
          },
        },
      })
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy()
        playerRef.current = null
      }
    }
  }, [isYouTube, youtubeId, isOpen])

  // Handle play/pause
  const togglePlayPause = () => {
    if (isYouTube && playerRef.current) {
      if (isPlaying) {
        playerRef.current.pauseVideo()
      } else {
        playerRef.current.playVideo()
      }
      setIsPlaying(!isPlaying)
    } else if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  // Handle seeking
  const handleSeek = (value: number[]) => {
    if (isYouTube && playerRef.current) {
      playerRef.current.seekTo(value[0], true)
      setCurrentTime(value[0])
    } else if (videoRef.current) {
      videoRef.current.currentTime = value[0]
      setCurrentTime(value[0])
    }
  }

  // Handle rewind/forward 15 seconds
  const handleSkip = (seconds: number) => {
    if (isYouTube && playerRef.current) {
      const newTime = Math.max(0, Math.min(duration, playerRef.current.getCurrentTime() + seconds))
      playerRef.current.seekTo(newTime, true)
    } else if (videoRef.current) {
      videoRef.current.currentTime = Math.max(
        0,
        Math.min(videoRef.current.duration, videoRef.current.currentTime + seconds),
      )
    }
  }

  // Update time display for regular video
  useEffect(() => {
    if (isYouTube || !videoRef.current) return

    const video = videoRef.current

    const updateTime = () => {
      setCurrentTime(video.currentTime)
      setDuration(video.duration)
    }

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)

    video.addEventListener("timeupdate", updateTime)
    video.addEventListener("play", handlePlay)
    video.addEventListener("pause", handlePause)
    video.addEventListener("loadedmetadata", updateTime)

    return () => {
      video.removeEventListener("timeupdate", updateTime)
      video.removeEventListener("play", handlePlay)
      video.removeEventListener("pause", handlePause)
      video.removeEventListener("loadedmetadata", updateTime)
    }
  }, [isOpen, isYouTube])

  // Auto-play when modal opens
  useEffect(() => {
    if (!isOpen) return

    if (!isYouTube && videoRef.current) {
      const timer = setTimeout(() => {
        videoRef.current
          ?.play()
          .then(() => setIsPlaying(true))
          .catch((err) => console.error("Autoplay failed:", err))
      }, 300)

      return () => clearTimeout(timer)
    }
  }, [isOpen, isYouTube])

  // Clean up when modal closes
  useEffect(() => {
    if (!isOpen) {
      if (!isYouTube && videoRef.current) {
        videoRef.current.pause()
        videoRef.current.currentTime = 0
        setIsPlaying(false)
        setCurrentTime(0)
      }
    }
  }, [isOpen, isYouTube])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className={`p-0 ${isMobile ? "max-w-none w-full h-[100dvh] m-0 rounded-none" : "sm:max-w-[800px]"}`}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogTitle className="sr-only">{videoTitle || "Video Player"}</DialogTitle>
        {isMobile ? (
          <div className="relative w-full h-full bg-black flex flex-col">
            {/* Video container */}
            <div className="flex-1 relative">
              {isYouTube && youtubeId ? (
                <div id="youtube-player" className="absolute inset-0 w-full h-full"></div>
              ) : (
                <video
                  ref={videoRef}
                  src={videoUrl}
                  className="absolute inset-0 w-full h-full object-cover"
                  playsInline
                  onClick={togglePlayPause}
                />
              )}

              {/* Top controls */}
              <div className="absolute top-4 left-4 z-10">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-black/50 border-0 text-white hover:bg-black/70"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-6 w-6" />
                  <span className="sr-only">Close</span>
                </Button>
              </div>
            </div>

            {/* Bottom controls */}
            <div className="bg-black/90 text-white p-4 space-y-4">
              <div className="flex justify-between items-center">
                <Button variant="ghost" size="icon" className="text-white">
                  <Share className="h-6 w-6" />
                  <span className="sr-only">Share</span>
                </Button>

                <div className="flex items-center gap-8">
                  <Button variant="ghost" size="icon" className="text-white" onClick={() => handleSkip(-15)}>
                    <RotateCcw className="h-6 w-6" />
                    <span className="sr-only">Rewind 15 seconds</span>
                  </Button>

                  <Button variant="ghost" size="icon" className="text-white h-12 w-12" onClick={togglePlayPause}>
                    {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
                    <span className="sr-only">{isPlaying ? "Pause" : "Play"}</span>
                  </Button>

                  <Button variant="ghost" size="icon" className="text-white" onClick={() => handleSkip(15)}>
                    <RotateCw className="h-6 w-6" />
                    <span className="sr-only">Forward 15 seconds</span>
                  </Button>
                </div>

                <Button variant="ghost" size="icon" className="text-white" onClick={() => setIsFavorite(!isFavorite)}>
                  <Heart className={`h-6 w-6 ${isFavorite ? "fill-white" : ""}`} />
                  <span className="sr-only">Favorite</span>
                </Button>
              </div>

              <div className="space-y-2">
                <Slider
                  value={[currentTime]}
                  max={duration || 100}
                  step={0.1}
                  onValueChange={handleSeek}
                  className="cursor-pointer"
                />

                <div className="flex justify-between text-sm">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Bottom indicator bar */}
              <div className="w-1/3 h-1 bg-white/30 rounded-full mx-auto mt-4"></div>
            </div>
          </div>
        ) : (
          // Desktop view
          <div className="aspect-video w-full">
            {isYouTube && youtubeId ? (
              <iframe
                src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                className="w-full h-full"
                title={videoTitle || "Video"}
              />
            ) : (
              <video ref={videoRef} src={videoUrl} className="w-full h-full" controls playsInline />
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

// Add TypeScript definitions for YouTube API
declare global {
  interface Window {
    YT: {
      Player: new (
        elementId: string,
        config: {
          videoId: string
          playerVars?: {
            autoplay?: 0 | 1
            controls?: 0 | 1
            rel?: 0 | 1
            showinfo?: 0 | 1
            modestbranding?: 0 | 1
            fs?: 0 | 1
            playsinline?: 0 | 1
          }
          events?: {
            onReady?(event: { target: YT.Player }): void
            onStateChange?(event: { data: number }): void
          }
        },
      ) => YT.Player
      PlayerState: {
        PLAYING: number
        PAUSED: number
        ENDED: number
      }
    }
    onYouTubeIframeAPIReady?: () => void
  }

  namespace YT {
    interface Player {
      playVideo(): void
      pauseVideo(): void
      seekTo(seconds: number, allowSeekAhead: boolean): void
      getCurrentTime(): number
      getDuration(): number
      destroy(): void
    }
  }
}

