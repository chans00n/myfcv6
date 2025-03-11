import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, Calendar, Play } from "lucide-react"
import { VideoModal } from "@/components/video-modal"
import { CoachProfile } from "@/components/coach-profile"
import { FavoriteButton } from "@/components/favorites/favorite-button"

// Simple workout steps component for the detail page
function WorkoutSteps({ section }: { section: "all" | "warm-up" | "main" | "cool-down" }) {
  // This is a simplified version of the component
  // In a real app, you would fetch this data based on the workout ID

  return (
    <div className="p-6">
      <h3 className="text-lg font-medium mb-4">
        {section === "all" && "Complete Workout"}
        {section === "warm-up" && "Warm-Up Exercises"}
        {section === "main" && "Main Workout Exercises"}
        {section === "cool-down" && "Cool-Down Exercises"}
      </h3>

      <div className="space-y-4">
        {section === "warm-up" || section === "all" ? (
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">1. Gentle Lymph Drainage</h4>
              <Badge variant="secondary">60s</Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              A gentle massage technique to stimulate lymphatic flow and reduce puffiness.
            </p>
            <Button variant="outline" size="sm" className="gap-2">
              <Play className="h-4 w-4" />
              Watch Video
            </Button>
          </div>
        ) : null}

        {section === "main" || section === "all" ? (
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">2. Forehead Lifter</h4>
              <Badge variant="secondary">45s × 3</Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-2">Target and tone the muscles in your forehead area.</p>
            <Button variant="outline" size="sm" className="gap-2">
              <Play className="h-4 w-4" />
              Watch Video
            </Button>
          </div>
        ) : null}

        {section === "cool-down" || section === "all" ? (
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">3. Final Relaxation</h4>
              <Badge variant="secondary">60s</Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-2">Gentle cool-down movements to relax facial muscles.</p>
            <Button variant="outline" size="sm" className="gap-2">
              <Play className="h-4 w-4" />
              Watch Video
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  )
}

// This would come from your database in a real application
// Here we're using a simple lookup based on the ID parameter
const workouts = {
  "1": {
    id: "1",
    title: "Sunday Facial Fitness",
    description:
      "A complete facial fitness workout following the MYFC methodology to tone, lift, and rejuvenate your facial muscles. Lorem ipsum odor amet, consectetuer adipiscing elit. Iaculis habitant ultricies neque, aliquam erat cubilia feugiat! Auctor metus convallis purus finibus auctor sed fusce enim nullam. Ornare et netus semper ut elementum habitant mus sodales. Dapibus feugiat lacinia finibus ridiculus tortor congue feugiat. Fames felis neque vivamus adipiscing lobortis urna. Potenti vulputate facilisi praesent ex non metus.",
    publishedDate: "Sunday, March 9",
    duration: "15 minutes total",
    skillLevel: "Basic",
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
  "2": {
    id: "2",
    title: "Monday Facial Fitness",
    description:
      "A complete facial fitness workout following the MYFC methodology to tone, lift, and rejuvenate your facial muscles.",
    publishedDate: "Monday, March 10",
    duration: "15 minutes total",
    skillLevel: "Basic",
    thumbnailUrl:
      "https://myfacecoach.vercel.app/_next/image?url=%2Fimages%2Fyusuf-evli-DjQx057gBC0-unsplash.jpg&w=3840&q=75",
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
  "3": {
    id: "3",
    title: "Texas Cardio Tuesday",
    description:
      "A special Texas Cardio day focused on massage techniques to boost circulation and give your facial muscles a break.",
    publishedDate: "Tuesday, March 11",
    duration: "10 minutes total",
    skillLevel: "Intermediate",
    thumbnailUrl:
      "https://myfacecoach.vercel.app/_next/image?url=%2Fimages%2Fmathilde-langevin-NWEKGZ5B2q0-unsplash.jpg&w=3840&q=75",
    videoUrl: "#",
    benefits: ["Improved circulation", "Reduced puffiness", "Relaxed facial muscles", "Glowing complexion"],
    coach: {
      name: "Michael Chen",
      image: "/placeholder.svg?height=400&width=400",
      bio: "Specialized in facial massage techniques with background in traditional Chinese medicine.",
      specialty: "Facial Massage & Circulation",
    },
    targetAreas: ["Lymphatic system", "Facial blood flow", "Skin texture", "Facial tension points"],
    type: "Cardio",
  },
  "4": {
    id: "4",
    title: "Wednesday Power Flow",
    description:
      "Intensive facial exercises designed to strengthen and tone your facial muscles with dynamic movements.",
    publishedDate: "Wednesday, March 12",
    duration: "20 minutes total",
    skillLevel: "Advanced",
    thumbnailUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/sabine-van-straaten-Y3X4jYrXNsQ-unsplash.jpg-vNGL3VQSOhEPpBYF1al9WYDu3iHTaE.jpeg",
    videoUrl: "#",
    benefits: [
      "Strengthened facial muscles",
      "Improved muscle definition",
      "Enhanced facial contours",
      "Increased muscle endurance",
    ],
    coach: {
      name: "Emma Rodriguez",
      image: "/placeholder.svg?height=400&width=400",
      bio: "Former professional dancer specializing in advanced facial fitness techniques.",
      specialty: "Power Facial Training & Muscle Building",
    },
    targetAreas: ["Cheekbones", "Jawline", "Forehead", "Neck muscles", "Nasolabial folds"],
    type: "Power Flow",
  },
  "5": {
    id: "5",
    title: "Thursday Sculpt",
    description: "Focus on precise movements to sculpt and define your facial features with targeted exercises.",
    publishedDate: "Thursday, March 13",
    duration: "15 minutes total",
    skillLevel: "Intermediate",
    thumbnailUrl:
      "https://myfacecoach.vercel.app/_next/image?url=%2Fimages%2Fzulmaury-saavedra-kXC0dbqtRe4-unsplash.jpg&w=3840&q=75",
    videoUrl: "#",
    benefits: [
      "Defined facial contours",
      "Targeted muscle toning",
      "Improved facial symmetry",
      "Enhanced natural features",
    ],
    coach: {
      name: "Sarah Johnson",
      image: "/placeholder.svg?height=400&width=400",
      bio: "MYFC certified instructor with 5+ years of experience in facial fitness and yoga.",
      specialty: "Facial Yoga & Lymphatic Drainage",
    },
    targetAreas: ["Cheekbones", "Jawline", "Eye area", "Lips and mouth area"],
    type: "Sculpt",
  },
  "6": {
    id: "6",
    title: "Friday Express Lift",
    description: "Quick but effective facial workout perfect for busy days while maintaining your routine.",
    publishedDate: "Friday, March 14",
    duration: "10 minutes total",
    skillLevel: "Basic",
    thumbnailUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/sabine-van-straaten-Y3X4jYrXNsQ-unsplash.jpg-vNGL3VQSOhEPpBYF1al9WYDu3iHTaE.jpeg",
    videoUrl: "#",
    benefits: ["Quick facial refresh", "Maintained muscle tone", "Stress reduction", "Improved circulation"],
    coach: {
      name: "Michael Chen",
      image: "/placeholder.svg?height=400&width=400",
      bio: "Specialized in facial massage techniques with background in traditional Chinese medicine.",
      specialty: "Facial Massage & Circulation",
    },
    targetAreas: ["Full face", "Jawline", "Eye area", "Forehead"],
    type: "Express",
  },
  "7": {
    id: "7",
    title: "Evening Relaxation",
    description: "Wind down with gentle facial exercises designed to release tension and promote relaxation.",
    publishedDate: "Friday, March 14",
    duration: "12 minutes total",
    skillLevel: "Basic",
    thumbnailUrl:
      "https://myfacecoach.vercel.app/_next/image?url=%2Fimages%2Fmathilde-langevin-NWEKGZ5B2q0-unsplash.jpg&w=3840&q=75",
    videoUrl: "#",
    benefits: ["Tension release", "Improved sleep quality", "Reduced facial stress", "Relaxed facial muscles"],
    coach: {
      name: "Emma Rodriguez",
      image: "/placeholder.svg?height=400&width=400",
      bio: "Former professional dancer specializing in advanced facial fitness techniques.",
      specialty: "Power Facial Training & Muscle Building",
    },
    targetAreas: ["Jaw muscles", "Forehead", "Eye area", "Neck and shoulders"],
    type: "Relaxation",
  },
  "8": {
    id: "8",
    title: "Saturday Recovery",
    description: "Gentle facial exercises and massage techniques focusing on relaxation and recovery.",
    publishedDate: "Saturday, March 15",
    duration: "12 minutes total",
    skillLevel: "Basic",
    thumbnailUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/sabine-van-straaten-Y3X4jYrXNsQ-unsplash.jpg-vNGL3VQSOhEPpBYF1al9WYDu3iHTaE.jpeg",
    videoUrl: "#",
    benefits: ["Muscle recovery", "Reduced inflammation", "Improved circulation", "Relaxation and rejuvenation"],
    coach: {
      name: "Emma Rodriguez",
      image: "/placeholder.svg?height=400&width=400",
      bio: "Former professional dancer specializing in advanced facial fitness techniques.",
      specialty: "Power Facial Training & Muscle Building",
    },
    targetAreas: ["Full face", "Lymphatic system", "Facial pressure points", "Neck and jaw"],
    type: "Recovery",
  },
}

export default function WorkoutPage({ params }: { params: { id: string } }) {
  // Get the workout data based on the ID from the URL
  const workoutData = workouts[params.id] || workouts["1"] // Fallback to first workout if ID not found

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="relative mb-8 rounded-xl overflow-hidden">
          <div className="aspect-video relative">
            <img
              src={workoutData.thumbnailUrl || "/placeholder.svg"}
              alt={workoutData.title}
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <VideoModal videoUrl={workoutData.videoUrl}>
                <Button size="lg" variant="outline" className="rounded-full bg-white/10 hover:bg-white/20 border-0">
                  <Play className="h-8 w-8 text-white" />
                </Button>
              </VideoModal>
            </div>
            <div className="absolute top-4 right-4">
              <FavoriteButton
                item={{
                  id: workoutData.id,
                  title: workoutData.title,
                  description: workoutData.description,
                  date: workoutData.publishedDate,
                  duration: workoutData.duration,
                  type: workoutData.type,
                  image: workoutData.thumbnailUrl,
                  publishedDate: workoutData.publishedDate,
                }}
                itemType="workout"
                variant="ghost"
                size="icon"
                showText={false}
                className="h-10 w-10 rounded-full bg-background/80 hover:bg-background"
              />
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-8 md:grid-cols-[2fr,1fr]">
          {/* Left Column - Workout Info */}
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">{workoutData.title}</h1>
                <p className="text-muted-foreground mb-4">{workoutData.description}</p>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                {workoutData.skillLevel}
              </Badge>
            </div>

            <div className="flex gap-4 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {workoutData.duration}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {workoutData.publishedDate}
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-3">Target Areas</h2>
              <div className="flex flex-wrap gap-2">
                {workoutData.targetAreas.map((area) => (
                  <Badge key={area} variant="outline">
                    {area}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-3">Benefits</h2>
              <ul className="grid gap-2">
                {workoutData.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            {/* Workout Steps */}
            <Card>
              <Tabs defaultValue="all-steps" className="w-full">
                <TabsList className="w-full justify-start border-b rounded-none h-auto p-0">
                  <TabsTrigger
                    value="all-steps"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                  >
                    All Steps
                  </TabsTrigger>
                  <TabsTrigger
                    value="warm-up"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                  >
                    Warm-Up
                  </TabsTrigger>
                  <TabsTrigger
                    value="main-lift"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                  >
                    Main Lift
                  </TabsTrigger>
                  <TabsTrigger
                    value="cool-down"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                  >
                    Cool-Down
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="all-steps">
                  <WorkoutSteps section="all" />
                </TabsContent>
                <TabsContent value="warm-up">
                  <WorkoutSteps section="warm-up" />
                </TabsContent>
                <TabsContent value="main-lift">
                  <WorkoutSteps section="main" />
                </TabsContent>
                <TabsContent value="cool-down">
                  <WorkoutSteps section="cool-down" />
                </TabsContent>
              </Tabs>
            </Card>
          </div>

          {/* Right Column - Coach Profile */}
          <div className="relative">
            <div className="md:sticky md:top-8">
              <CoachProfile coach={workoutData.coach} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

