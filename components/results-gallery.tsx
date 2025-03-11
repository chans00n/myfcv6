"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface ResultItem {
  id: string
  userName: string
  userImage?: string
  beforeImage: string
  afterImage: string
  duration: string
  testimonial: string
  rating: number
}

interface ResultsGalleryProps {
  results?: ResultItem[]
  title?: string
}

export function ResultsGallery({ results = [], title = "User Results" }: ResultsGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  const handlePrevious = () => {
    setActiveIndex((prev) => (prev === 0 ? results.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setActiveIndex((prev) => (prev === results.length - 1 ? 0 : prev + 1))
  }

  if (!results || !results.length) return null

  const activeResult = results[activeIndex]

  return (
    <Card className="overflow-hidden">
      <div className="border-b bg-muted/40 px-4 py-3">
        <h3 className="text-lg font-medium">{title}</h3>
      </div>
      <CardContent className="p-0">
        <div className="relative">
          <div className="grid grid-cols-2 gap-1 p-1">
            <div className="relative aspect-square overflow-hidden rounded-md">
              <span className="absolute left-2 top-2 rounded bg-background/80 px-2 py-1 text-xs font-medium backdrop-blur-sm">
                Before
              </span>
              <img
                src={activeResult.beforeImage || "/placeholder.svg"}
                alt={`${activeResult.userName} before`}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="relative aspect-square overflow-hidden rounded-md">
              <span className="absolute left-2 top-2 rounded bg-background/80 px-2 py-1 text-xs font-medium backdrop-blur-sm">
                After
              </span>
              <img
                src={activeResult.afterImage || "/placeholder.svg"}
                alt={`${activeResult.userName} after`}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <Button
            variant="outline"
            size="icon"
            className="absolute left-2 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm"
            onClick={handlePrevious}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous</span>
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm"
            onClick={handleNext}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next</span>
          </Button>
        </div>

        <div className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={activeResult.userImage} alt={activeResult.userName} />
                <AvatarFallback>{activeResult.userName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="text-sm font-medium">{activeResult.userName}</div>
                <Badge variant="outline" className="text-xs">
                  {activeResult.duration}
                </Badge>
              </div>
            </div>
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < activeResult.rating ? "fill-primary text-primary" : "text-muted"}`}
                />
              ))}
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{activeResult.testimonial}</p>
          <div className="mt-3 flex justify-center">
            <div className="flex gap-1">
              {results.map((_, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="icon"
                  className={`h-2 w-2 rounded-full p-0 ${
                    index === activeIndex ? "bg-primary" : "bg-muted-foreground/30"
                  }`}
                  onClick={() => setActiveIndex(index)}
                >
                  <span className="sr-only">Go to slide {index + 1}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

