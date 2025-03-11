"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Check, Clock } from "lucide-react"

interface Exercise {
  id: string
  name: string
  duration: string
  description: string
  videoUrl: string
  completed: boolean
  tips?: string[]
}

interface WorkoutTimelineProps {
  exercises: Exercise[]
  onComplete?: (exerciseId: string) => void
}

export function WorkoutTimeline({ exercises, onComplete }: WorkoutTimelineProps) {
  const [expandedExercise, setExpandedExercise] = useState<string | null>("ex1")
  const [completedExercises, setCompletedExercises] = useState<Record<string, boolean>>(
    exercises.reduce((acc, exercise) => ({ ...acc, [exercise.id]: exercise.completed }), {}),
  )

  const handleToggleExpand = (id: string) => {
    setExpandedExercise(expandedExercise === id ? null : id)
  }

  const handleToggleComplete = (id: string) => {
    const newCompletedState = !completedExercises[id]
    setCompletedExercises({ ...completedExercises, [id]: newCompletedState })
    if (onComplete) {
      onComplete(id)
    }
  }

  // Sample tips for exercises
  const exerciseTips = {
    ex1: [
      "Keep your facial muscles relaxed when not actively engaged",
      "Breathe deeply and steadily throughout the exercise",
      "Maintain proper posture to maximize effectiveness",
      "Stop if you feel any discomfort or strain",
    ],
    ex2: [
      "Focus on controlled movements",
      "Feel the stretch in your forehead muscles",
      "Maintain a relaxed jaw throughout",
      "Breathe normally during the exercise",
    ],
    ex3: [
      "Allow your facial muscles to fully relax",
      "Focus on your breathing",
      "Gently release any tension",
      "End with a soft smile",
    ],
  }

  return (
    <Card className="overflow-hidden border-0 shadow-sm">
      <Tabs defaultValue="timeline" className="w-full">
        <div className="bg-black/5 dark:bg-white/5 backdrop-blur-sm sticky top-0 z-10">
          <TabsList className="w-full justify-start rounded-none h-auto p-0 bg-transparent overflow-x-auto flex-nowrap border-b border-gray-800/20 dark:border-gray-700/20">
            <TabsTrigger
              value="timeline"
              className="rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary px-4 py-3 text-sm font-medium transition-all whitespace-nowrap"
            >
              Workout Timeline
            </TabsTrigger>
            <TabsTrigger
              value="warm-up"
              className="rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary px-4 py-3 text-sm font-medium transition-all whitespace-nowrap"
            >
              Warm-Up
            </TabsTrigger>
            <TabsTrigger
              value="main-lift"
              className="rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary px-4 py-3 text-sm font-medium transition-all whitespace-nowrap"
            >
              Main Lift
            </TabsTrigger>
            <TabsTrigger
              value="cool-down"
              className="rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary px-4 py-3 text-sm font-medium transition-all whitespace-nowrap"
            >
              Cool-Down
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="timeline" className="p-0 focus-visible:outline-none focus-visible:ring-0">
          <div className="bg-black text-white">
            {exercises.map((exercise, index) => (
              <div
                key={exercise.id}
                className={`p-4 sm:p-6 ${index !== exercises.length - 1 ? "border-b border-gray-800/30" : ""} transition-all hover:bg-gray-900/50`}
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <button
                    onClick={() => handleToggleComplete(exercise.id)}
                    className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-all ${
                      completedExercises[exercise.id]
                        ? "border-green-500 bg-green-500 text-white"
                        : "border-gray-600 bg-transparent hover:border-gray-400"
                    }`}
                    aria-label={`Mark as ${completedExercises[exercise.id] ? "incomplete" : "complete"}`}
                  >
                    {completedExercises[exercise.id] && <Check className="h-3 w-3" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <h3 className="text-lg font-medium truncate">{`${index + 1}. ${exercise.name}`}</h3>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-400">
                      <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                      <span className="truncate">{exercise.duration}</span>
                    </div>
                    <p className="mt-2 text-gray-300 line-clamp-3 sm:line-clamp-none">{exercise.description}</p>

                    <button
                      type="button"
                      onClick={() => handleToggleExpand(exercise.id)}
                      className="mt-2 text-xs text-gray-400 hover:text-white flex items-center gap-1 transition-all"
                      aria-label={expandedExercise === exercise.id ? "Hide details" : "Show details"}
                    >
                      {expandedExercise === exercise.id ? (
                        <span className="flex items-center gap-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-chevron-up"
                          >
                            <path d="m18 15-6-6-6 6" />
                          </svg>
                          Less
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-chevron-down"
                          >
                            <path d="m6 9 6 6 6-6" />
                          </svg>
                          More
                        </span>
                      )}
                    </button>

                    {expandedExercise === exercise.id && (
                      <div className="mt-3 pt-3 border-t border-gray-800/30 animate-in fade-in duration-150">
                        <h4 className="mb-2 font-medium">Technique Tips:</h4>
                        <ul className="space-y-2">
                          {exerciseTips[exercise.id as keyof typeof exerciseTips]?.map((tip, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="shrink-0 gap-1 rounded-full border-gray-700/50 bg-gray-800/70 hover:bg-gray-700 text-white transition-all"
                  >
                    <Play className="h-3.5 w-3.5" />
                    <span className="sm:inline hidden">Watch</span>
                    <span className="sm:hidden inline">Watch</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="warm-up" className="focus-visible:outline-none focus-visible:ring-0">
          <div className="p-4 sm:p-6">
            <h3 className="text-lg font-medium mb-4">Warm-Up Exercises</h3>
            <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-all">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">1. Gentle Lymph Drainage</h4>
                <span className="px-2 py-1 text-xs bg-gray-100 rounded-full dark:bg-gray-800">60s</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                A gentle massage technique to stimulate lymphatic flow and reduce puffiness.
              </p>
              <Button variant="outline" size="sm" className="gap-2 rounded-full">
                <Play className="h-4 w-4" />
                Watch Video
              </Button>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="main-lift" className="focus-visible:outline-none focus-visible:ring-0">
          <div className="p-4 sm:p-6">
            <h3 className="text-lg font-medium mb-4">Main Workout Exercises</h3>
            <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-all">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">2. Forehead Lifter</h4>
                <span className="px-2 py-1 text-xs bg-gray-100 rounded-full dark:bg-gray-800">45s × 3</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">Target and tone the muscles in your forehead area.</p>
              <Button variant="outline" size="sm" className="gap-2 rounded-full">
                <Play className="h-4 w-4" />
                Watch Video
              </Button>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="cool-down" className="focus-visible:outline-none focus-visible:ring-0">
          <div className="p-4 sm:p-6">
            <h3 className="text-lg font-medium mb-4">Cool-Down Exercises</h3>
            <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-all">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">3. Final Relaxation</h4>
                <span className="px-2 py-1 text-xs bg-gray-100 rounded-full dark:bg-gray-800">60s</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">Gentle cool-down movements to relax facial muscles.</p>
              <Button variant="outline" size="sm" className="gap-2 rounded-full">
                <Play className="h-4 w-4" />
                Watch Video
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  )
}

