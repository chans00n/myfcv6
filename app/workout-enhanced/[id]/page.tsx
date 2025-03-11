"use client"

import { use } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, Calendar, Play, ChevronLeft } from "lucide-react"
import { VideoModal } from "@/components/video-modal"
import { CoachProfile } from "@/components/coach-profile"
import { FavoriteButton } from "@/components/favorites/favorite-button"
import { WorkoutTimeline } from "@/components/workout-timeline"
import { ResultsGallery } from "@/components/results-gallery"
import { DifficultyIndicator } from "@/components/difficulty-indicator"
import { ScheduleWorkout } from "@/components/schedule-workout"
import { RelatedWorkouts } from "@/components/related-workouts"
import { WorkoutNotes } from "@/components/workout-notes"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { useSidebarContext } from "@/components/sidebar-context"

interface Coach {
  name: string
  image: string
  bio: string
  specialty: string
}

type SkillLevel = "beginner" | "intermediate" | "advanced" | "expert" | "master"

interface RelatedWorkout {
  id: string
  title: string
  type: string
  duration: string
  image: string
  level: string
}

interface Workout {
  id: string
  title: string
  description: string
  publishedDate: string
  duration: string
  skillLevel: SkillLevel
  thumbnailUrl: string
  videoUrl: string
  benefits: string[]
  coach: Coach
  targetAreas: string[]
  type: string
}

type Workouts = {
  [key: string]: Workout
}

// Sample data for the enhanced components
const workouts: Workouts = {
  "1": {
    id: "1",
    title: "Sunday Facial Fitness",
    description:
      "A complete facial fitness workout following the MYFC methodology to tone, lift, and rejuvenate your facial muscles.",
    publishedDate: "Sunday, March 9",
    duration: "15 minutes total",
    skillLevel: "beginner",
    thumbnailUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/sabine-van-straaten-Y3X4jYrXNsQ-unsplash.jpg-vNGL3VQSOhEPpBYF1al9WYDu3iHTaE.jpeg",
    videoUrl: "#",
    benefits: ["Improved facial muscle tone", "Enhanced circulation", "Reduced tension", "Natural lifting effect"],
    coach: {
      name: "Sarah Johnson",
      image: "/placeholder.svg?height=400&width=400",
      bio: "MYFC certified instructor with 5+ years of experience in facial fitness and yoga.",
      specialty: "Facial Yoga & Lymphatic Drainage",
    },
    targetAreas: ["Forehead muscles", "Cheek muscles", "Jawline", "Neck muscles", "Lymphatic system"],
    type: "Facial Fitness",
  },
}

// Sample related workouts data
const relatedWorkoutsData: RelatedWorkout[] = [
  {
    id: "2",
    title: "Monday Facial Fitness",
    type: "Facial Fitness",
    duration: "15 min",
    image: "https://myfacecoach.vercel.app/_next/image?url=%2Fimages%2Fyusuf-evli-DjQx057gBC0-unsplash.jpg&w=3840&q=75",
    level: "Beginner",
  },
  {
    id: "3",
    title: "Texas Cardio Tuesday",
    type: "Cardio",
    duration: "10 min",
    image:
      "https://myfacecoach.vercel.app/_next/image?url=%2Fimages%2Fmathilde-langevin-NWEKGZ5B2q0-unsplash.jpg&w=3840&q=75",
    level: "Intermediate",
  },
  {
    id: "5",
    title: "Thursday Sculpt",
    type: "Sculpt",
    duration: "15 min",
    image:
      "https://myfacecoach.vercel.app/_next/image?url=%2Fimages%2Fzulmaury-saavedra-kXC0dbqtRe4-unsplash.jpg&w=3840&q=75",
    level: "Intermediate",
  },
]

export default function WorkoutPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const { isOpen } = useSidebarContext()

  // Get the workout data based on the ID from the URL
  const workoutData = workouts[resolvedParams.id] || workouts["1"] // Fallback to first workout if ID not found

  return (
    <SidebarProvider defaultOpen={isOpen}>
      <AppSidebar />
      <SidebarInset>
        <div className="container mx-auto px-4 py-8">
          <div className="grid gap-6 md:grid-cols-3 lg:gap-8">
            {/* Main content - takes up 2/3 of the space on desktop */}
            <div className="md:col-span-2 space-y-6">
              {/* Video Player */}
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                <img
                  src={workoutData.thumbnailUrl}
                  alt={workoutData.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button size="lg" variant="outline" className="rounded-full bg-primary/90 hover:bg-primary border-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6 text-white"
                    >
                      <polygon points="5 3 19 12 5 21 5 3" fill="white" />
                    </svg>
                    <span className="sr-only">Play video</span>
                  </Button>
                </div>
              </div>

              {/* Workout Info */}
              <div>
                <h1 className="text-2xl font-bold mb-2">{workoutData.title}</h1>
                <p className="text-muted-foreground mb-4">{workoutData.description}</p>
                <div className="flex flex-wrap gap-4">
                  <Badge variant="outline">{workoutData.duration}</Badge>
                  <Badge variant="outline">{workoutData.type}</Badge>
                  <Badge variant="outline">{workoutData.publishedDate}</Badge>
                </div>
              </div>

              <Separator />

              {/* Workout Content Tabs */}
              <Tabs defaultValue="overview" className="w-full">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="instructions">Instructions</TabsTrigger>
                  <TabsTrigger value="notes">Notes</TabsTrigger>
                </TabsList>
                <TabsContent value="overview">
                  <div className="space-y-6">
                    {/* Target Areas */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Target Areas</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {workoutData.targetAreas.map((area: string) => (
                            <Badge key={area} variant="secondary">
                              {area}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Benefits */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Benefits</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="list-disc list-inside space-y-2">
                          {workoutData.benefits.map((benefit: string) => (
                            <li key={benefit} className="text-muted-foreground">
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                <TabsContent value="instructions">
                  <Card>
                    <CardHeader>
                      <CardTitle>Step-by-Step Instructions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground">Follow these steps to perform the exercises correctly:</p>
                      <ol className="list-decimal list-inside space-y-4">
                        <li className="text-muted-foreground">
                          <span className="font-medium text-foreground">Preparation:</span> Find a comfortable seated position
                          and ensure your face is clean
                        </li>
                        <li className="text-muted-foreground">
                          <span className="font-medium text-foreground">Warm-up:</span> Gently massage your face to increase
                          circulation
                        </li>
                        <li className="text-muted-foreground">
                          <span className="font-medium text-foreground">Main exercises:</span> Follow along with the video,
                          maintaining proper form
                        </li>
                        <li className="text-muted-foreground">
                          <span className="font-medium text-foreground">Cool-down:</span> End with gentle stretches and
                          relaxation techniques
                        </li>
                      </ol>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="notes">
                  <WorkoutNotes workoutId={workoutData.id} />
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar content - takes up 1/3 of the space on desktop */}
            <div className="space-y-6">
              <DifficultyIndicator level={workoutData.skillLevel as SkillLevel} />
              <CoachProfile coach={workoutData.coach} />
              <RelatedWorkouts workouts={relatedWorkoutsData} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

