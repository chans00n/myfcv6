"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"
import { WorkoutDetailModal } from "./workout-detail-modal"

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

interface WeeklyWorkoutScheduleProps {
  workouts: Workout[]
}

export function WeeklyWorkoutSchedule({ workouts }: WeeklyWorkoutScheduleProps) {
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const handleWorkoutClick = (workout: Workout) => {
    setSelectedWorkout(workout)
    setModalOpen(true)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {workouts.map((workout) => (
          <Card key={workout.id} className="overflow-hidden">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
              <Image
                src={workout.image || "/placeholder.svg"}
                alt={workout.title}
                width={350}
                height={200}
                className="object-cover aspect-video w-full"
              />
              <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded z-20">
                {workout.date}
              </div>
              <Button
                size="icon"
                variant="secondary"
                className="absolute bottom-2 right-2 rounded-full z-20"
                onClick={() => handleWorkoutClick(workout)}
              >
                <Play className="h-4 w-4" />
                <span className="sr-only">Play {workout.title}</span>
              </Button>
            </div>
            <CardContent className="p-4">
              <div className="font-medium">{workout.title}</div>
              <div className="text-sm text-muted-foreground">{workout.duration}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedWorkout && <WorkoutDetailModal open={modalOpen} onOpenChange={setModalOpen} workout={selectedWorkout} />}
    </div>
  )
}

