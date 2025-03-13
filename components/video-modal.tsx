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
  const [isMuted, setIsMuted] = useState(false)
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
            // Force play on ready
            event.target.playVideo()
            setIsPlaying(true)
            setDuration(event.target.getDuration())

            // Start progress tracking
            const updateYouTubeProgress = () => {
              if (playerRef.current && isOpen) {
                setCurrentTime(playerRef.current.getCurrentTime())
                requestAnimationFrame(updateYouTubeProgress)
              }
            }
            requestAnimationFrame(updateYouTubeProgress)
          },
          onStateChange: (event) => {
            // If video is cued, play it
            if (event.data === window.YT.PlayerState.CUED) {
              event.target.playVideo()
            }
            setIsPlaying(event.data === window.YT.PlayerState.PLAYING)
            if (event.data === window.YT.PlayerState.ENDED) {
              setCurrentTime(0)
              setIsPlaying(false)
            }
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

  // Handle mute toggle
  const toggleMute = () => {
    if (isYouTube && playerRef.current) {
      if (isMuted) {
        playerRef.current.unMute()
      } else {
        playerRef.current.mute()
      }
      setIsMuted(!isMuted)
    } else if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  // Update time display for regular video
  useEffect(() => {
    if (isYouTube || !videoRef.current || !isOpen) return

    const video = videoRef.current

    const updateTime = () => {
      setCurrentTime(video.currentTime)
      requestAnimationFrame(() => {
        if (video && !video.paused) {
          updateTime()
        }
      })
    }

    const handlePlay = () => {
      setIsPlaying(true)
      updateTime()
    }
    const handlePause = () => setIsPlaying(false)
    const handleLoadedMetadata = () => {
      setDuration(video.duration)
      // Start playing when video is loaded
      video.play()
        .then(() => {
          setIsPlaying(true)
          updateTime()
        })
        .catch(err => console.error("Autoplay failed:", err))
    }
    const handleEnded = () => {
      setCurrentTime(0)
      setIsPlaying(false)
    }

    video.addEventListener("play", handlePlay)
    video.addEventListener("pause", handlePause)
    video.addEventListener("loadedmetadata", handleLoadedMetadata)
    video.addEventListener("ended", handleEnded)

    // Try to play immediately if the video is already loaded
    if (video.readyState >= 2) {
      handleLoadedMetadata()
    }

    return () => {
      video.removeEventListener("play", handlePlay)
      video.removeEventListener("pause", handlePause)
      video.removeEventListener("loadedmetadata", handleLoadedMetadata)
      video.removeEventListener("ended", handleEnded)
    }
  }, [isOpen, isYouTube])

  // Clean up when modal closes
  useEffect(() => {
    if (!isOpen) {
      setIsPlaying(false)
      setCurrentTime(0)
      if (!isYouTube && videoRef.current) {
        videoRef.current.pause()
        videoRef.current.currentTime = 0
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
        {!isMobile && (
          <div className="fixed top-[env(safe-area-inset-top)] inset-x-0 z-50 p-4 flex justify-between">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-black/50 border-0 text-white hover:bg-black/70"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-6 w-6" />
              <span className="sr-only">Close</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-black/50 border-0 text-white hover:bg-black/70"
              onClick={toggleMute}
            >
              {isMuted ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 6L8 10H4v4h4l4 4zM18 8a6 6 0 0 1 0 8M21 5a10 10 0 0 1 0 14" /></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" /></svg>
              )}
              <span className="sr-only">{isMuted ? "Unmute" : "Mute"}</span>
            </Button>
          </div>
        )}
        <DialogTitle className="sr-only">{videoTitle || "Video Player"}</DialogTitle>
        <div className="relative w-full h-[100dvh] bg-black flex">
          {/* Main content area */}
          <div className="flex-1 relative">
            {/* Video container */}
            <div className="absolute inset-0 flex items-center justify-center">
              {isYouTube && youtubeId ? (
                <div id="youtube-player" className="relative w-full max-w-[500px] mx-auto h-full bg-black">
                  <div className="relative w-full h-full overflow-hidden">
                    <div className="absolute inset-0">
                      <iframe
                        src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&enablejsapi=1&playsinline=1&controls=0&showinfo=0&modestbranding=1&fs=0`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        className="absolute inset-0 w-[300%] h-[300%] left-[-100%] top-[-100%]"
                        style={{ border: 'none' }}
                        title={videoTitle || "Video"}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <video
                  ref={videoRef}
                  src={videoUrl}
                  className="w-full max-w-[500px] h-full object-cover"
                  playsInline
                  preload="auto"
                  onClick={togglePlayPause}
                  muted={isMuted}
                  autoPlay
                />
              )}
            </div>

            {/* Video controls overlay */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              {/* Top gradient */}
              <div className="h-32 bg-gradient-to-b from-black/50 to-transparent" />

              {/* Bottom controls */}
              <div className="p-6 space-y-4 pointer-events-auto bg-gradient-to-t from-black/50 to-transparent">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-8">
                    <Button variant="ghost" size="icon" className="text-white" onClick={togglePlayPause}>
                      {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
                      <span className="sr-only">{isPlaying ? "Pause" : "Play"}</span>
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Slider
                    value={[currentTime]}
                    max={duration || 100}
                    step={0.1}
                    onValueChange={handleSeek}
                    className="cursor-pointer"
                  />
                  <div className="flex justify-between text-sm text-white">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side action buttons */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-6">
            <Button
              variant="ghost"
              size="icon"
              className="text-white h-12 w-12 rounded-full bg-black/20 hover:bg-black/40"
              onClick={() => setIsFavorite(!isFavorite)}
            >
              <Heart className={`h-7 w-7 ${isFavorite ? "fill-white" : ""}`} />
              <span className="sr-only">Like</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white h-12 w-12 rounded-full bg-black/20 hover:bg-black/40"
            >
              <Share className="h-7 w-7" />
              <span className="sr-only">Share</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white h-12 w-12 rounded-full bg-black/20 hover:bg-black/40"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
              <span className="sr-only">Save</span>
            </Button>
          </div>
        </div>
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
            onStateChange?(event: { target: YT.Player; data: number }): void
          }
        },
      ) => YT.Player
      PlayerState: {
        PLAYING: number
        PAUSED: number
        ENDED: number
        CUED: number
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
      mute(): void
      unMute(): void
      isMuted(): boolean
    }
  }
}

