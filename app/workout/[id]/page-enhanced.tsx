import { DifficultyIndicator } from "@/components/difficulty-indicator"
import { WorkoutNotes } from "@/components/workout-notes"
import { CoachProfile } from "@/components/coach-profile"
import { WorkoutTimeline } from "@/components/workout-timeline"
import { VideoModal } from "@/components/video-modal"
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"

export default function WorkoutDetailPage({ params }: { params: { id: string } }) {
  // This would normally come from a database or API
  const workout = {
    id: params.id,
    title: "Complete Facial Fitness Routine",
    description: "A comprehensive facial workout targeting all major muscle groups for improved tone and circulation.",
    duration: "15 minutes",
    type: "Facial Fitness",
    level: "intermediate" as const,
    videoUrl: "/videos/workout-sample.mp4",
    coach: {
      name: "Sarah Johnson",
      image: "/placeholder.svg?height=96&width=96",
      bio: "Certified facial fitness trainer with 5+ years of experience helping clients achieve their facial fitness goals.",
      specialty: "Facial Yoga",
    },
  }

  return (
    <div className="grid gap-6 md:grid-cols-3 lg:gap-8">
      {/* Main content - takes up 2/3 of the space on desktop */}
      <div className="md:col-span-2 space-y-6">
        <div className="aspect-video relative rounded-lg overflow-hidden bg-gray-950 flex items-center justify-center">
          <VideoModal videoUrl={workout.videoUrl}>
            <Button
              variant="outline"
              size="icon"
              className="absolute inset-0 w-full h-full bg-transparent hover:bg-black/50 rounded-none border-0 flex items-center justify-center group"
            >
              <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play className="h-6 w-6 text-primary-foreground" />
              </div>
            </Button>
          </VideoModal>
        </div>

        <div className="grid gap-2">
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <div>Duration: {workout.duration}</div>
            <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
            <div>Type: {workout.type}</div>
          </div>
          <h1 className="text-2xl font-bold">{workout.title}</h1>
          <p className="text-muted-foreground">{workout.description}</p>
        </div>

        <WorkoutTimeline workoutId={params.id} />
      </div>

      {/* Sidebar content - takes up 1/3 of the space on desktop */}
      <div className="space-y-6">
        <DifficultyIndicator level={workout.level} />
        <CoachProfile coach={workout.coach} />
        <WorkoutNotes workoutId={params.id} />
      </div>
    </div>
  )
}

