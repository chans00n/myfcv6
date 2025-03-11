"use client"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Flame, ChevronLeft, ChevronRight } from "lucide-react"
import useEmblaCarousel from "embla-carousel-react"
import { useCallback } from "react"
import Link from "next/link"
import { FavoriteButton } from "@/components/favorites/favorite-button"

// Workout data
const workouts = [
  {
    id: "1",
    date: "Sun, Mar 9",
    title: "Sunday Facial Fitness",
    description:
      "A complete facial fitness workout following the MYFC methodology to tone, lift, and rejuvenate your facial muscles.",
    duration: "15 min",
    calories: "52 cal",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/sabine-van-straaten-Y3X4jYrXNsQ-unsplash.jpg-vNGL3VQSOhEPpBYF1al9WYDu3iHTaE.jpeg",
    type: "Facial Fitness",
    publishedDate: "2025-03-09",
  },
  {
    id: "2",
    date: "Mon, Mar 10",
    title: "Monday Facial Fitness",
    description:
      "A complete facial fitness workout following the MYFC methodology to tone, lift, and rejuvenate your facial muscles.",
    duration: "15 min",
    calories: "52 cal",
    image: "https://myfacecoach.vercel.app/_next/image?url=%2Fimages%2Fyusuf-evli-DjQx057gBC0-unsplash.jpg&w=3840&q=75",
    type: "Facial Fitness",
    publishedDate: "2025-03-10",
  },
  {
    id: "3",
    date: "Tue, Mar 11",
    title: "Texas Cardio Tuesday",
    description:
      "A special Texas Cardio day focused on massage techniques to boost circulation and give your facial muscles a break.",
    duration: "10 min",
    calories: "35 cal",
    image:
      "https://myfacecoach.vercel.app/_next/image?url=%2Fimages%2Fmathilde-langevin-NWEKGZ5B2q0-unsplash.jpg&w=3840&q=75",
    type: "Cardio",
    publishedDate: "2025-03-11",
  },
  {
    id: "4",
    date: "Wed, Mar 12",
    title: "Wednesday Power Flow",
    description:
      "Intensive facial exercises designed to strengthen and tone your facial muscles with dynamic movements.",
    duration: "20 min",
    calories: "65 cal",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/sabine-van-straaten-Y3X4jYrXNsQ-unsplash.jpg-vNGL3VQSOhEPpBYF1al9WYDu3iHTaE.jpeg",
    type: "Power Flow",
    publishedDate: "2025-03-12",
  },
  {
    id: "5",
    date: "Thu, Mar 13",
    title: "Thursday Sculpt",
    description: "Focus on precise movements to sculpt and define your facial features with targeted exercises.",
    duration: "15 min",
    calories: "48 cal",
    image:
      "https://myfacecoach.vercel.app/_next/image?url=%2Fimages%2Fzulmaury-saavedra-kXC0dbqtRe4-unsplash.jpg&w=3840&q=75",
    type: "Sculpt",
    publishedDate: "2025-03-13",
  },
  {
    id: "6",
    date: "Fri, Mar 14",
    title: "Friday Express Lift",
    description: "Quick but effective facial workout perfect for busy days while maintaining your routine.",
    duration: "10 min",
    calories: "30 cal",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/sabine-van-straaten-Y3X4jYrXNsQ-unsplash.jpg-vNGL3VQSOhEPpBYF1al9WYDu3iHTaE.jpeg",
    type: "Express",
    publishedDate: "2025-03-14",
  },
  {
    id: "7",
    date: "Sat, Mar 15",
    title: "Saturday Recovery",
    description: "Gentle facial exercises and massage techniques focusing on relaxation and recovery.",
    duration: "12 min",
    calories: "40 cal",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/sabine-van-straaten-Y3X4jYrXNsQ-unsplash.jpg-vNGL3VQSOhEPpBYF1al9WYDu3iHTaE.jpeg",
    type: "Recovery",
    publishedDate: "2025-03-15",
  },
]

export function WorkoutCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: true,
    slidesToScroll: 1,
    breakpoints: {
      // Mobile: 1 slide
      "(max-width: 639px)": { slidesToScroll: 1 },
      // Tablet: 2 slides
      "(min-width: 640px) and (max-width: 1023px)": { slidesToScroll: 2 },
      // Desktop: 3 slides
      "(min-width: 1024px)": { slidesToScroll: 3 },
    },
  })

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  return (
    <div className="w-full max-w-[100vw] overflow-hidden px-0 md:px-0">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 px-4 md:px-0">
        <div className="flex items-center gap-4 mb-4 md:mb-0">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={scrollPrev} className="rounded-full h-8 w-8">
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous slide</span>
            </Button>
            <Button variant="outline" size="icon" onClick={scrollNext} className="rounded-full h-8 w-8">
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next slide</span>
            </Button>
          </div>
          <h2 className="text-xl md:text-2xl font-bold">Weekly Lift Plan</h2>
        </div>
        <p className="text-sm text-muted-foreground">Track your facial fitness progress</p>
      </div>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {workouts.map((workout) => (
            <div
              key={workout.id}
              className="min-w-0 pl-4 first:pl-0 last:pr-4
        flex-[0_0_80%] sm:flex-[0_0_50%] md:flex-[0_0_33.333%]"
            >
              <Card className="border-0 h-full overflow-hidden bg-background flex flex-col">
                <div className="relative md:rounded-t-lg">
                  <Link href={`/workouts/${workout.id}`}>
                    <div className="aspect-[4/3] w-full overflow-hidden">
                      <img
                        src={workout.image || "/placeholder.svg"}
                        alt={workout.title}
                        width={400}
                        height={300}
                        className="object-cover w-full h-full rounded-t-lg"
                      />
                    </div>
                  </Link>
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                    <p className="text-sm text-white/90 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {workout.date}
                    </p>
                  </div>
                  <div className="absolute top-2 right-2">
                    <FavoriteButton
                      item={workout}
                      itemType="workout"
                      variant="ghost"
                      size="icon"
                      showText={false}
                      className="h-8 w-8 rounded-full bg-background/80 hover:bg-background"
                    />
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-semibold text-base mb-1">
                    <Link href={`/workouts/${workout.id}`} className="hover:underline">
                      {workout.title}
                    </Link>
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{workout.description}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4 mt-auto">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {workout.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Flame className="h-4 w-4" />
                      {workout.calories}
                    </span>
                  </div>
                  <Link href={`/workouts/${workout.id}`} className="w-full block">
                    <Button className="w-full" variant="secondary">
                      Start Lift
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

