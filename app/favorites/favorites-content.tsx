"use client"

import { useEffect, useState } from "react"
import { useSidebarContext } from "@/components/sidebar-context"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { BookOpen, Home, Search, SlidersHorizontal } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useFavorites } from "@/context/favorites-context"
import { FavoriteWorkouts } from "@/components/favorites/favorite-workouts"
import { FavoriteMovements } from "@/components/favorites/favorite-movements"
import { EmptyFavorites } from "@/components/favorites/empty-favorites"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function FavoritesContent() {
  const { isOpen } = useSidebarContext()
  const { favoriteWorkouts, favoriteMovements } = useFavorites()
  const [activeTab, setActiveTab] = useState("workouts")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortOption, setSortOption] = useState("newest")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  // Filter favorites based on search query
  const filteredWorkouts = favoriteWorkouts.filter(
    (workout) =>
      workout.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workout.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workout.type.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredMovements = favoriteMovements.filter(
    (movement) =>
      movement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      movement.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      movement.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      movement.instructor.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Sort favorites based on sort option
  const sortedWorkouts = [...filteredWorkouts].sort((a, b) => {
    switch (sortOption) {
      case "newest":
        return new Date(b.publishedDate || b.date).getTime() - new Date(a.publishedDate || a.date).getTime()
      case "oldest":
        return new Date(a.publishedDate || a.date).getTime() - new Date(b.publishedDate || b.date).getTime()
      case "a-z":
        return a.title.localeCompare(b.title)
      case "z-a":
        return b.title.localeCompare(a.title)
      default:
        return 0
    }
  })

  const sortedMovements = [...filteredMovements].sort((a, b) => {
    switch (sortOption) {
      case "newest":
        return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
      case "oldest":
        return new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime()
      case "a-z":
        return a.title.localeCompare(b.title)
      case "z-a":
        return b.title.localeCompare(a.title)
      case "popular":
        return b.views - a.views
      default:
        return 0
    }
  })

  // Check if there are any favorites
  const hasFavorites = favoriteWorkouts.length > 0 || favoriteMovements.length > 0

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4 w-full">
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
                <BreadcrumbLink href="/favorites">
                  <BookOpen className="h-4 w-4 mr-1" />
                  Favorites
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex-1 overflow-auto">
        <div className="px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Your Favorites</h1>
            <p className="text-muted-foreground">Access your saved workouts and movements all in one place</p>
          </div>

          {hasFavorites ? (
            <>
              <Tabs defaultValue="workouts" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <TabsList className="gap-2 px-1">
                    <TabsTrigger value="workouts" className="relative px-6">
                      Workouts
                      {favoriteWorkouts.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {favoriteWorkouts.length}
                        </span>
                      )}
                    </TabsTrigger>
                    <TabsTrigger value="movements" className="relative px-6">
                      Movements
                      {favoriteMovements.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {favoriteMovements.length}
                        </span>
                      )}
                    </TabsTrigger>
                  </TabsList>

                  <div className="flex w-full sm:w-auto gap-2">
                    <div className="relative flex-1 sm:w-64">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Search favorites..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">
                          <SlidersHorizontal className="h-4 w-4" />
                          <span className="sr-only">Sort</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuRadioGroup value={sortOption} onValueChange={setSortOption}>
                          <DropdownMenuRadioItem value="newest">Newest First</DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="oldest">Oldest First</DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="a-z">A-Z</DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="z-a">Z-A</DropdownMenuRadioItem>
                          {activeTab === "movements" && (
                            <DropdownMenuRadioItem value="popular">Most Popular</DropdownMenuRadioItem>
                          )}
                        </DropdownMenuRadioGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <TabsContent value="workouts" className="mt-0">
                  {sortedWorkouts.length > 0 ? (
                    <FavoriteWorkouts workouts={sortedWorkouts} />
                  ) : (
                    <EmptyFavorites
                      type="workouts"
                      searchQuery={searchQuery}
                      onClearSearch={() => setSearchQuery("")}
                    />
                  )}
                </TabsContent>

                <TabsContent value="movements" className="mt-0">
                  {sortedMovements.length > 0 ? (
                    <FavoriteMovements movements={sortedMovements} />
                  ) : (
                    <EmptyFavorites
                      type="movements"
                      searchQuery={searchQuery}
                      onClearSearch={() => setSearchQuery("")}
                    />
                  )}
                </TabsContent>
              </Tabs>
            </>
          ) : (
            <EmptyFavorites type="all" />
          )}
        </div>
      </div>
    </>
  )
} 