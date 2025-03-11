"use client"

import { useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Heart } from "lucide-react"

interface Exercise {
  id: string
  name: string
  image: string
}

interface TargetArea {
  name: string
}

interface RelatedWorkout {
  id: string
  title: string
  duration: string
  type: string
  image: string
  episode?: string
}

interface WorkoutDetailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  workout: {
    id: string
    title: string
    duration: string
    type: string
    episode?: string
    image: string
    exercises: Exercise[]
    targetAreas: TargetArea[]
    relatedWorkouts: RelatedWorkout[]
  }
}

export function WorkoutDetailModal({ open, onOpenChange, workout }: WorkoutDetailModalProps) {
  const [selectedDuration, setSelectedDuration] = useState<"23 min" | "15 min">("23 min")
  const [isFavorite, setIsFavorite] = useState(false)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 max-w-md mx-auto h-[90vh] sm:h-auto overflow-auto bg-black text-white">
        <div className="relative">
          <div className="absolute top-0 left-0 right-0 z-10 p-4 flex justify-between items-center">
            <button
              onClick={() => onOpenChange(false)}
              className="rounded-full bg-gray-800/70 p-2 text-white hover:bg-gray-700/70 transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Back</span>
            </button>

            <div className="flex items-center gap-2 bg-gray-800/70 rounded-full p-1">
              <button
                onClick={() => setSelectedDuration("23 min")}
                className={`rounded-full px-4 py-1 text-sm ${
                  selectedDuration === "23 min" ? "bg-gray-700" : "bg-transparent"
                }`}
              >
                23 min
              </button>
              <button
                onClick={() => setSelectedDuration("15 min")}
                className={`rounded-full px-4 py-1 text-sm ${
                  selectedDuration === "15 min" ? "bg-gray-700" : "bg-transparent"
                }`}
              >
                15 min
              </button>
            </div>

            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="rounded-full bg-gray-800/70 p-2 text-white hover:bg-gray-700/70 transition-colors"
            >
              <Heart className={`h-5 w-5 ${isFavorite ? "fill-white" : ""}`} />
              <span className="sr-only">Favorite</span>
            </button>
          </div>

          <div className="relative h-72 w-full">
            <Image
              src={workout.image || "/placeholder.svg?height=288&width=384"}
              alt={workout.title}
              fill
              className="object-cover"
            />
          </div>

          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
            {workout.episode && <div className="text-sm text-gray-300 mb-1">Episode {workout.episode} • Class</div>}
            <h2 className="text-3xl font-bold">{workout.title}</h2>
            <div className="text-gray-300 mt-2">
              {workout.type} • {selectedDuration}
            </div>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Exercise List */}
          <div className="space-y-4">
            {workout.exercises.map((exercise) => (
              <div key={exercise.id} className="flex items-center gap-3">
                <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                  <Image
                    src={exercise.image || "/placeholder.svg?height=64&width=64"}
                    alt={exercise.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{exercise.name}</h3>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            ))}
          </div>

          {/* Target Areas */}
          <div className="space-y-3">
            <h3 className="text-xl font-semibold">Areas You'll Improve</h3>
            <div className="flex flex-wrap gap-2">
              {workout.targetAreas.map((area, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="bg-gray-800 text-white border-gray-700 px-4 py-2 rounded-full"
                >
                  {area.name}
                </Badge>
              ))}
            </div>
          </div>

          {/* Related Workouts */}
          <div className="space-y-3">
            <h3 className="text-xl font-semibold">More Like This</h3>
            <div className="grid grid-cols-2 gap-4">
              {workout.relatedWorkouts.map((related) => (
                <div key={related.id} className="space-y-2">
                  <div className="relative h-32 w-full rounded-md overflow-hidden">
                    <Image
                      src={related.image || "/placeholder.svg?height=128&width=192"}
                      alt={related.title}
                      fill
                      className="object-cover"
                    />
                    {related.episode && (
                      <div className="absolute top-2 right-2 p-1 rounded-full bg-gray-800/70">
                        <button className="text-gray-300">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M2 4H14M2 8H14M2 12H6"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                  <h4 className="font-medium text-sm">{related.title}</h4>
                  <div className="text-xs text-gray-400">
                    {related.duration} • {related.type} {related.episode && `• EP ${related.episode}`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 pt-0">
          <Button className="w-full py-6 text-base rounded-full bg-white text-black hover:bg-gray-200">
            Start Routine
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

