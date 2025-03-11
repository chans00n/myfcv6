"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"
import { WorkoutDetailModal } from "./workout-detail-modal"

// Sample data - in a real app, this would come from an API
const workouts = [
  {
    id: "1",
    day: "Monday",
    title: "Full Body",
    duration: "22 min",
    image: "/placeholder.svg?height=200&width=350",
    type: "Recovery",
    episode: "33",
    exercises: [
      { id: "e1", name: "Half Saddle", image: "/placeholder.svg?height=64&width=64" },
      { id: "e2", name: "Bound Angle", image: "/placeholder.svg?height=64&width=64" },
      { id: "e3", name: "Supine Twist", image: "/placeholder.svg?height=64&width=64" },
    ],
    targetAreas: [
      { name: "Ankles" },
      { name: "Groin" },
      { name: "Quads" },
      { name: "Lower Back" },
      { name: "IT Band" },
      { name: "Hips" },
      { name: "Glutes" },
      { name: "Spine" },
      { name: "Knees" },
    ],
    relatedWorkouts: [
      {
        id: "r1",
        title: "Skywalker",
        duration: "45 min",
        type: "Recovery",
        image: "/placeholder.svg?height=128&width=192",
      },
      {
        id: "r2",
        title: "Ankles + Calves Fix",
        duration: "16 min",
        type: "Corrective",
        episode: "8",
        image: "/placeholder.svg?height=128&width=192",
      },
    ],
  },
  {
    id: "2",
    day: "Tuesday",
    title: "Lower Body",
    duration: "22 min",
    image: "/placeholder.svg?height=200&width=350",
    type: "Recovery",
    episode: "33",
    exercises: [
      { id: "e1", name: "Half Saddle", image: "/placeholder.svg?height=64&width=64" },
      { id: "e2", name: "Bound Angle", image: "/placeholder.svg?height=64&width=64" },
      { id: "e3", name: "Supine Twist", image: "/placeholder.svg?height=64&width=64" },
    ],
    targetAreas: [
      { name: "Ankles" },
      { name: "Groin" },
      { name: "Quads" },
      { name: "Lower Back" },
      { name: "IT Band" },
      { name: "Hips" },
      { name: "Glutes" },
      { name: "Spine" },
      { name: "Knees" },
    ],
    relatedWorkouts: [
      {
        id: "r1",
        title: "Skywalker",
        duration: "45 min",
        type: "Recovery",
        image: "/placeholder.svg?height=128&width=192",
      },
      {
        id: "r2",
        title: "Ankles + Calves Fix",
        duration: "16 min",
        type: "Corrective",
        episode: "8",
        image: "/placeholder.svg?height=128&width=192",
      },
    ],
  },
  {
    id: "3",
    day: "Wednesday",
    title: "Upper Body",
    duration: "22 min",
    image: "/placeholder.svg?height=200&width=350",
    type: "Recovery",
    episode: "33",
    exercises: [
      { id: "e1", name: "Half Saddle", image: "/placeholder.svg?height=64&width=64" },
      { id: "e2", name: "Bound Angle", image: "/placeholder.svg?height=64&width=64" },
      { id: "e3", name: "Supine Twist", image: "/placeholder.svg?height=64&width=64" },
    ],
    targetAreas: [
      { name: "Ankles" },
      { name: "Groin" },
      { name: "Quads" },
      { name: "Lower Back" },
      { name: "IT Band" },
      { name: "Hips" },
      { name: "Glutes" },
      { name: "Spine" },
      { name: "Knees" },
    ],
    relatedWorkouts: [
      {
        id: "r1",
        title: "Skywalker",
        duration: "45 min",
        type: "Recovery",
        image: "/placeholder.svg?height=128&width=192",
      },
      {
        id: "r2",
        title: "Ankles + Calves Fix",
        duration: "16 min",
        type: "Corrective",
        episode: "8",
        image: "/placeholder.svg?height=128&width=192",
      },
    ],
  },
  {
    id: "4",
    day: "Thursday",
    title: "Whole Body",
    duration: "22 min",
    image: "/placeholder.svg?height=200&width=350",
    type: "Recovery",
    episode: "33",
    exercises: [
      { id: "e1", name: "Half Saddle", image: "/placeholder.svg?height=64&width=64" },
      { id: "e2", name: "Bound Angle", image: "/placeholder.svg?height=64&width=64" },
      { id: "e3", name: "Supine Twist", image: "/placeholder.svg?height=64&width=64" },
    ],
    targetAreas: [
      { name: "Ankles" },
      { name: "Groin" },
      { name: "Quads" },
      { name: "Lower Back" },
      { name: "IT Band" },
      { name: "Hips" },
      { name: "Glutes" },
      { name: "Spine" },
      { name: "Knees" },
    ],
    relatedWorkouts: [
      {
        id: "r1",
        title: "Skywalker",
        duration: "45 min",
        type: "Recovery",
        image: "/placeholder.svg?height=128&width=192",
      },
      {
        id: "r2",
        title: "Ankles + Calves Fix",
        duration: "16 min",
        type: "Corrective",
        episode: "8",
        image: "/placeholder.svg?height=128&width=192",
      },
    ],
  },
  {
    id: "5",
    day: "Friday",
    title: "Core Focus",
    duration: "22 min",
    image: "/placeholder.svg?height=200&width=350",
    type: "Recovery",
    episode: "33",
    exercises: [
      { id: "e1", name: "Half Saddle", image: "/placeholder.svg?height=64&width=64" },
      { id: "e2", name: "Bound Angle", image: "/placeholder.svg?height=64&width=64" },
      { id: "e3", name: "Supine Twist", image: "/placeholder.svg?height=64&width=64" },
    ],
    targetAreas: [
      { name: "Ankles" },
      { name: "Groin" },
      { name: "Quads" },
      { name: "Lower Back" },
      { name: "IT Band" },
      { name: "Hips" },
      { name: "Glutes" },
      { name: "Spine" },
      { name: "Knees" },
    ],
    relatedWorkouts: [
      {
        id: "r1",
        title: "Skywalker",
        duration: "45 min",
        type: "Recovery",
        image: "/placeholder.svg?height=128&width=192",
      },
      {
        id: "r2",
        title: "Ankles + Calves Fix",
        duration: "16 min",
        type: "Corrective",
        episode: "8",
        image: "/placeholder.svg?height=128&width=192",
      },
    ],
  },
]

export function WeeklyWorkoutSchedule() {
  const [selectedWorkout, setSelectedWorkout] = useState<(typeof workouts)[0] | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const handleWorkoutClick = (workout: (typeof workouts)[0]) => {
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
                {workout.day}
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

