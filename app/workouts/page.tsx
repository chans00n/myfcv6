"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Calendar, Home } from "lucide-react"
import { WeeklyWorkoutSchedule } from "@/components/weekly-workout-schedule"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SearchAndFilter } from "@/components/search-and-filter"
import { useState, useEffect } from "react"
import { WorkoutCard } from "@/components/workout-card"

// Sample workout data
const workouts = [
  {
    id: "1",
    date: "Sun, Mar 9",
    title: "Sunday Facial Fitness",
    description: "A complete facial fitness workout following the MYFC methodology to tone, lift, and rejuvenate your facial muscles.",
    duration: "15 min",
    type: "Facial Fitness",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/sabine-van-straaten-Y3X4jYrXNsQ-unsplash.jpg-vNGL3VQSOhEPpBYF1al9WYDu3iHTaE.jpeg",
    difficulty: "Basic"
  },
  {
    id: "2",
    date: "Mon, Mar 10",
    title: "Monday Facial Fitness",
    description: "A complete facial fitness workout following the MYFC methodology to tone, lift, and rejuvenate your facial muscles.",
    duration: "15 min",
    type: "Facial Fitness",
    image: "https://myfacecoach.vercel.app/_next/image?url=%2Fimages%2Fyusuf-evli-DjQx057gBC0-unsplash.jpg&w=3840&q=75",
    difficulty: "Basic"
  },
  {
    id: "3",
    date: "Tue, Mar 11",
    title: "Texas Cardio Tuesday",
    description: "A special Texas Cardio day focused on massage techniques to boost circulation and give your facial muscles a break.",
    duration: "10 min",
    type: "Cardio",
    image: "https://myfacecoach.vercel.app/_next/image?url=%2Fimages%2Fmathilde-langevin-NWEKGZ5B2q0-unsplash.jpg&w=3840&q=75",
    difficulty: "Intermediate"
  },
  {
    id: "4",
    date: "Wed, Mar 12",
    title: "Wednesday Power Flow",
    description: "Intensive facial exercises designed to strengthen and tone your facial muscles with dynamic movements.",
    duration: "20 min",
    type: "Power Flow",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/sabine-van-straaten-Y3X4jYrXNsQ-unsplash.jpg-vNGL3VQSOhEPpBYF1al9WYDu3iHTaE.jpeg",
    difficulty: "Advanced"
  }
]

export default function WorkoutsPage() {
  const [viewMode, setViewMode] = useState<"calendar" | "list">("list")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null)
  const [selectedDuration, setSelectedDuration] = useState<string | null>(null)
  const [sortOption, setSortOption] = useState("newest")
  const [filteredWorkouts, setFilteredWorkouts] = useState(workouts)

  // In a real app, you would fetch this data from an API
  // and handle week navigation with state management
  const currentWeek = {
    startDate: "March 9, 2025",
    endDate: "March 15, 2025",
  }

  // Sample categories and difficulties
  const categories = ["Facial Fitness", "Cardio", "Power Flow", "Sculpt", "Express", "Recovery"]
  const difficulties = ["Basic", "Intermediate", "Advanced"]
  const durations = [
    { value: "short", label: "Short (<15 min)" },
    { value: "medium", label: "Medium (15-30 min)" },
    { value: "long", label: "Long (30+ min)" },
  ]

  // Filter and sort workouts when criteria changes
  useEffect(() => {
    let result = [...workouts]

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (workout) =>
          workout.title.toLowerCase().includes(query) ||
          workout.description.toLowerCase().includes(query) ||
          workout.type.toLowerCase().includes(query)
      )
    }

    // Apply category filter
    if (selectedCategory) {
      result = result.filter((workout) => workout.type === selectedCategory)
    }

    // Apply difficulty filter
    if (selectedDifficulty) {
      result = result.filter((workout) => workout.difficulty === selectedDifficulty)
    }

    // Apply duration filter
    if (selectedDuration) {
      const getDurationInMinutes = (duration: string) => parseInt(duration.split(" ")[0])
      
      switch (selectedDuration) {
        case "short":
          result = result.filter((workout) => getDurationInMinutes(workout.duration) < 15)
          break
        case "medium":
          result = result.filter(
            (workout) => {
              const minutes = getDurationInMinutes(workout.duration)
              return minutes >= 15 && minutes < 30
            }
          )
          break
        case "long":
          result = result.filter((workout) => getDurationInMinutes(workout.duration) >= 30)
          break
      }
    }

    // Apply sorting
    switch (sortOption) {
      case "newest":
        result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        break
      case "oldest":
        result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        break
      case "a-z":
        result.sort((a, b) => a.title.localeCompare(b.title))
        break
      case "z-a":
        result.sort((a, b) => b.title.localeCompare(a.title))
        break
    }

    setFilteredWorkouts(result)
  }, [searchQuery, selectedCategory, selectedDifficulty, selectedDuration, sortOption])

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
  }

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category)
  }

  const handleDifficultyChange = (difficulty: string | null) => {
    setSelectedDifficulty(difficulty)
  }

  const handleDurationChange = (duration: string | null) => {
    setSelectedDuration(duration)
  }

  const handleSortChange = (option: string) => {
    setSortOption(option)
  }

  const handleViewModeChange = (mode: string) => {
    if (mode === "calendar" || mode === "list") {
      setViewMode(mode)
    }
  }

  const handleResetFilters = () => {
    setSearchQuery("")
    setSelectedCategory(null)
    setSelectedDifficulty(null)
    setSelectedDuration(null)
    setSortOption("newest")
  }

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4 md:px-6 w-full">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">
                  <Home className="h-4 w-4 mr-1" />
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Workouts</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col px-4 md:px-6 py-6">
        <div className="space-y-6 md:space-y-8 mb-8">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">Your Weekly Lift Plan</h1>
            <p className="text-muted-foreground">Follow your personalized facial fitness routine</p>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4" />
              <span>
                {currentWeek.startDate} - {currentWeek.endDate}
              </span>
              <div className="flex ml-2">
                <Button variant="outline" size="icon" className="h-8 w-8 rounded-r-none">
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Previous week</span>
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8 rounded-l-none border-l-0">
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">Next week</span>
                </Button>
              </div>
            </div>

            <SearchAndFilter
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
              difficulties={difficulties}
              selectedDifficulty={selectedDifficulty}
              onDifficultyChange={handleDifficultyChange}
              durations={durations}
              selectedDuration={selectedDuration}
              onDurationChange={handleDurationChange}
              sortOption={sortOption}
              onSortChange={handleSortChange}
              viewMode={viewMode}
              onViewModeChange={handleViewModeChange}
              onResetFilters={handleResetFilters}
            />
          </div>
        </div>

        {viewMode === "calendar" ? (
          <WeeklyWorkoutSchedule />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredWorkouts.map((workout) => (
              <WorkoutCard key={workout.id} workout={workout} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}

