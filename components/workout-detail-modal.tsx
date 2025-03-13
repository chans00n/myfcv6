"use client"

import { useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, Heart } from "lucide-react"

interface Workout {
  id: string
  date: string
  title: string
  description: string
  duration: string
  type: string
  image: string
  difficulty: string
}

interface WorkoutDetailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  workout: Workout
}

export function WorkoutDetailModal({ open, onOpenChange, workout }: WorkoutDetailModalProps) {
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
            <div className="text-sm text-gray-300 mb-1">{workout.date}</div>
            <h2 className="text-3xl font-bold">{workout.title}</h2>
            <div className="text-gray-300 mt-2">
              {workout.type} • {workout.duration} • {workout.difficulty}
            </div>
          </div>
        </div>

        <div className="p-4 space-y-6">
          <div className="space-y-3">
            <h3 className="text-xl font-semibold">Description</h3>
            <p className="text-gray-300">{workout.description}</p>
          </div>
        </div>

        <div className="p-4 pt-0">
          <Button className="w-full py-6 text-base rounded-full bg-white text-black hover:bg-gray-200">
            Start Workout
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

