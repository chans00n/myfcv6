"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { VideoGrid } from "@/components/video-grid"
import { SearchAndFilter } from "@/components/search-and-filter"
import { movementVideos } from "@/data/movement-videos"
import { Waves } from "lucide-react"

export function MovementLibrary() {
  const [videos, setVideos] = useState(movementVideos)
  const [filteredVideos, setFilteredVideos] = useState(movementVideos)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null)
  const [selectedDuration, setSelectedDuration] = useState<string | null>(null)
  const [sortOption, setSortOption] = useState("newest")
  const [viewMode, setViewMode] = useState("grid")

  // Filter and sort videos when any filter criteria changes
  useEffect(() => {
    let result = [...videos]

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (video) =>
          video.title.toLowerCase().includes(query) ||
          video.description.toLowerCase().includes(query) ||
          video.instructor.toLowerCase().includes(query) ||
          video.category.toLowerCase().includes(query),
      )
    }

    // Apply category filter
    if (selectedCategory) {
      result = result.filter((video) => video.category === selectedCategory)
    }

    // Apply difficulty filter
    if (selectedDifficulty) {
      result = result.filter((video) => video.difficulty === selectedDifficulty)
    }

    // Apply duration filter
    if (selectedDuration) {
      switch (selectedDuration) {
        case "short":
          result = result.filter((video) => video.durationSeconds < 180) // Less than 3 minutes
          break
        case "medium":
          result = result.filter((video) => video.durationSeconds >= 180 && video.durationSeconds < 360) // 3-6 minutes
          break
        case "long":
          result = result.filter((video) => video.durationSeconds >= 360) // 6+ minutes
          break
      }
    }

    // Apply sorting
    switch (sortOption) {
      case "newest":
        result.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
        break
      case "oldest":
        result.sort((a, b) => new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime())
        break
      case "popular":
        result.sort((a, b) => b.views - a.views)
        break
      case "az":
        result.sort((a, b) => a.title.localeCompare(b.title))
        break
      case "za":
        result.sort((a, b) => b.title.localeCompare(a.title))
        break
      case "duration-asc":
        result.sort((a, b) => a.durationSeconds - b.durationSeconds)
        break
      case "duration-desc":
        result.sort((a, b) => b.durationSeconds - a.durationSeconds)
        break
    }

    setFilteredVideos(result)
  }, [videos, searchQuery, selectedCategory, selectedDifficulty, selectedDuration, sortOption])

  // Handle search input change
  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
  }

  // Handle category filter change
  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category)
  }

  // Handle difficulty filter change
  const handleDifficultyChange = (difficulty: string | null) => {
    setSelectedDifficulty(difficulty)
  }

  // Handle duration filter change
  const handleDurationChange = (duration: string | null) => {
    setSelectedDuration(duration)
  }

  // Handle sort option change
  const handleSortChange = (option: string) => {
    setSortOption(option)
  }

  // Handle view mode change
  const handleViewModeChange = (mode: string) => {
    setViewMode(mode)
  }

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery("")
    setSelectedCategory(null)
    setSelectedDifficulty(null)
    setSelectedDuration(null)
    setSortOption("newest")
  }

  // Extract unique categories for filter options
  const categories = Array.from(new Set(videos.map((video) => video.category)))
  const difficulties = ["Beginner", "Intermediate", "Advanced"]
  const durations = [
    { value: "short", label: "Short (<3 min)" },
    { value: "medium", label: "Medium (3-6 min)" },
    { value: "long", label: "Long (6+ min)" },
  ]

  return (
    <div className="px-4 py-8">
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Movement Library</h1>
          <p className="text-muted-foreground">
            Explore our collection of facial movement exercises to enhance your facial fitness routine
          </p>
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

        {filteredVideos.length > 0 ? (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{filteredVideos.length} videos</span>
                {(selectedCategory || selectedDifficulty || selectedDuration || searchQuery) && (
                  <Button variant="ghost" size="sm" onClick={handleResetFilters} className="h-8 px-2 text-xs">
                    Clear filters
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-2">
                {selectedCategory && (
                  <Badge variant="outline" className="rounded-full">
                    {selectedCategory}
                  </Badge>
                )}
                {selectedDifficulty && (
                  <Badge variant="outline" className="rounded-full">
                    {selectedDifficulty}
                  </Badge>
                )}
                {selectedDuration && (
                  <Badge variant="outline" className="rounded-full">
                    {durations.find((d) => d.value === selectedDuration)?.label}
                  </Badge>
                )}
              </div>
            </div>

            <VideoGrid videos={filteredVideos} viewMode={viewMode} />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-muted p-6 mb-4">
              <Waves className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No videos found</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              We couldn't find any videos matching your search criteria. Try adjusting your filters or search terms.
            </p>
            <Button onClick={handleResetFilters}>Reset Filters</Button>
          </div>
        )}
      </div>
    </div>
  )
}

