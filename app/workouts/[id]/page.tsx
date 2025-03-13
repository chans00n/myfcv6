import { DifficultyIndicator } from "@/components/difficulty-indicator"
import { WorkoutNotes } from "@/components/workout-notes"
import { CoachProfile } from "@/components/coach-profile"
import { WorkoutTimeline } from "@/components/workout-timeline"
import { VideoModal } from "@/components/video-modal"
import { RelatedWorkouts } from "@/components/related-workouts"
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"
import { FavoriteButton } from "@/components/favorites/favorite-button"
import { ShareWorkout } from "@/components/share-workout"

export default function WorkoutDetailPage({ params }: { params: { id: string } }) {
  // This would normally come from a database or API
  const workout = {
    id: params.id,
    title: "Complete Facial Fitness Routine",
    description: "A comprehensive facial workout targeting all major muscle groups for improved tone and circulation.",
    duration: "15 minutes",
    type: "Facial Fitness",
    level: "intermediate" as const,
    videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", // Using a sample video for testing
    thumbnailUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg", // Adding thumbnail
    date: new Date().toISOString(), // Adding date for the favorite functionality
    image: "/placeholder.svg?height=400&width=600", // Adding image for the favorite functionality
    coach: {
      name: "Zionna Hanson",
      image: "/placeholder.svg?height=96&width=96",
      bio: "Certified facial fitness trainer with 5+ years of experience helping clients achieve their facial fitness goals.",
      specialty: "Facial Fitness",
    },
  }

  const exercises = [
    {
      id: "ex1",
      name: "Gentle Lymph Drainage",
      duration: "60 seconds",
      description: "A gentle massage technique to stimulate lymphatic flow and reduce puffiness.",
      videoUrl: "/videos/exercise1.mp4",
      completed: false,
    },
    {
      id: "ex2",
      name: "Forehead Lifter",
      duration: "45 seconds × 3",
      description: "Target and tone the muscles in your forehead area.",
      videoUrl: "/videos/exercise2.mp4",
      completed: false,
    },
    {
      id: "ex3",
      name: "Final Relaxation",
      duration: "60 seconds",
      description: "Gentle cool-down movements to relax facial muscles.",
      videoUrl: "/videos/exercise3.mp4",
      completed: false,
    },
  ]

  // Sample related workouts data
  const relatedWorkouts = [
    {
      id: "workout1",
      title: "Facial Yoga Essentials",
      type: "Facial Yoga",
      duration: "12 min",
      image: "/placeholder.svg?height=200&width=300",
      level: "beginner",
    },
    {
      id: "workout2",
      title: "Advanced Facial Toning",
      type: "Toning",
      duration: "20 min",
      image: "/placeholder.svg?height=200&width=300",
      level: "advanced",
    },
    {
      id: "workout3",
      title: "Facial Relaxation Flow",
      type: "Relaxation",
      duration: "10 min",
      image: "/placeholder.svg?height=200&width=300",
      level: "beginner",
    },
  ]

  return (
    <div className="px-4 md:px-6 py-6 max-w-full overflow-x-hidden">
      <div className="grid gap-6 md:grid-cols-3 lg:gap-8">
        {/* Main content - takes up 2/3 of the space on desktop */}
        <div className="md:col-span-2 space-y-6 min-w-0">
          <div className="aspect-video relative rounded-lg overflow-hidden bg-gray-950 flex items-center justify-center">
            <VideoModal videoUrl={workout.videoUrl} videoTitle={workout.title}>
              <div className="relative w-full h-full">
                <img
                  src={workout.thumbnailUrl}
                  alt={workout.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute inset-0 w-full h-full bg-black/30 hover:bg-black/50 rounded-none border-0 flex items-center justify-center group"
                >
                  <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="h-6 w-6 text-primary-foreground" />
                  </div>
                </Button>
              </div>
            </VideoModal>
          </div>

          <div className="grid gap-2 min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <div>Duration: {workout.duration}</div>
                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                <div>Type: {workout.type}</div>
              </div>
              <div className="flex items-center gap-2">
                <ShareWorkout workout={workout} />
                <FavoriteButton
                  item={{
                    id: workout.id,
                    title: workout.title,
                    description: workout.description,
                    date: workout.date,
                    duration: workout.duration,
                    type: workout.type,
                    image: workout.image,
                    coach: workout.coach.name,
                  }}
                  itemType="workout"
                  variant="ghost"
                  size="icon"
                  showText={false}
                />
              </div>
            </div>
            <h1 className="text-2xl font-bold break-words">{workout.title}</h1>
            <p className="text-muted-foreground break-words">{workout.description}</p>
          </div>

          <WorkoutTimeline exercises={exercises} />
        </div>

        {/* Sidebar content - takes up 1/3 of the space on desktop */}
        <div className="space-y-6 min-w-0">
          <DifficultyIndicator level={workout.level} />
          <CoachProfile coach={workout.coach} />
          <WorkoutNotes workoutId={params.id} />
        </div>
      </div>

      {/* Related Workouts section - full width at the bottom */}
      <div className="mt-12">
        <RelatedWorkouts workouts={relatedWorkouts} />
      </div>
    </div>
  )
}

