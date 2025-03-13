"use client"

import { useState } from "react"
import { Search, Filter, SlidersHorizontal, Grid, List, X, Calendar } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

interface SearchAndFilterProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  categories: string[]
  selectedCategory: string | null
  onCategoryChange: (category: string | null) => void
  difficulties: string[]
  selectedDifficulty: string | null
  onDifficultyChange: (difficulty: string | null) => void
  durations: { value: string; label: string }[]
  selectedDuration: string | null
  onDurationChange: (duration: string | null) => void
  sortOption: string
  onSortChange: (option: string) => void
  viewMode: string
  onViewModeChange: (mode: string) => void
  onResetFilters: () => void
}

export function SearchAndFilter({
  searchQuery,
  onSearchChange,
  categories,
  selectedCategory,
  onCategoryChange,
  difficulties,
  selectedDifficulty,
  onDifficultyChange,
  durations,
  selectedDuration,
  onDurationChange,
  sortOption,
  onSortChange,
  viewMode,
  onViewModeChange,
  onResetFilters,
}: SearchAndFilterProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Count active filters
  const activeFilterCount = (selectedCategory ? 1 : 0) + (selectedDifficulty ? 1 : 0) + (selectedDuration ? 1 : 0)

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search movements..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-10"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3 py-0"
              onClick={() => onSearchChange("")}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear search</span>
            </Button>
          )}
        </div>

        {/* Filter Button */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 px-1">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Filter Videos</DropdownMenuLabel>
            <DropdownMenuSeparator />

            {/* Category Filter */}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <span>Category</span>
                {selectedCategory && (
                  <Badge variant="secondary" className="ml-auto">
                    1
                  </Badge>
                )}
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem onClick={() => onCategoryChange(null)}>All Categories</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {categories.map((category) => (
                    <DropdownMenuItem
                      key={category}
                      onClick={() => onCategoryChange(category)}
                      className="flex items-center justify-between"
                    >
                      {category}
                      {selectedCategory === category && <Badge variant="secondary">✓</Badge>}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>

            {/* Difficulty Filter */}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <span>Difficulty</span>
                {selectedDifficulty && (
                  <Badge variant="secondary" className="ml-auto">
                    1
                  </Badge>
                )}
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem onClick={() => onDifficultyChange(null)}>All Difficulties</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {difficulties.map((difficulty) => (
                    <DropdownMenuItem
                      key={difficulty}
                      onClick={() => onDifficultyChange(difficulty)}
                      className="flex items-center justify-between"
                    >
                      {difficulty}
                      {selectedDifficulty === difficulty && <Badge variant="secondary">✓</Badge>}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>

            {/* Duration Filter */}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <span>Duration</span>
                {selectedDuration && (
                  <Badge variant="secondary" className="ml-auto">
                    1
                  </Badge>
                )}
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem onClick={() => onDurationChange(null)}>All Durations</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {durations.map((duration) => (
                    <DropdownMenuItem
                      key={duration.value}
                      onClick={() => onDurationChange(duration.value)}
                      className="flex items-center justify-between"
                    >
                      {duration.label}
                      {selectedDuration === duration.value && <Badge variant="secondary">✓</Badge>}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>

            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onResetFilters} disabled={activeFilterCount === 0}>
              Reset Filters
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Sort Button */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Sort
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Sort Videos</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={sortOption} onValueChange={onSortChange}>
              <DropdownMenuRadioItem value="newest">Newest First</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="oldest">Oldest First</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="popular">Most Popular</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="az">A-Z</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="za">Z-A</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="duration-asc">Duration (Shortest)</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="duration-desc">Duration (Longest)</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* View Mode Toggle */}
        <Tabs 
          value={viewMode} 
          onValueChange={(value) => {
            console.log('Tab value change:', value);
            onViewModeChange(value);
          }} 
          className="hidden sm:block"
        >
          <TabsList className="h-10">
            <TabsTrigger value="calendar" className="px-3">
              <Calendar className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="list" className="px-3">
              <List className="h-4 w-4" />
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Active Filters Display (Mobile) */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2 sm:hidden">
          {selectedCategory && (
            <Badge variant="outline" className="flex items-center gap-1">
              {selectedCategory}
              <Button variant="ghost" size="icon" className="h-4 w-4 p-0 ml-1" onClick={() => onCategoryChange(null)}>
                <X className="h-3 w-3" />
                <span className="sr-only">Remove category filter</span>
              </Button>
            </Badge>
          )}
          {selectedDifficulty && (
            <Badge variant="outline" className="flex items-center gap-1">
              {selectedDifficulty}
              <Button variant="ghost" size="icon" className="h-4 w-4 p-0 ml-1" onClick={() => onDifficultyChange(null)}>
                <X className="h-3 w-3" />
                <span className="sr-only">Remove difficulty filter</span>
              </Button>
            </Badge>
          )}
          {selectedDuration && (
            <Badge variant="outline" className="flex items-center gap-1">
              {durations.find((d) => d.value === selectedDuration)?.label}
              <Button variant="ghost" size="icon" className="h-4 w-4 p-0 ml-1" onClick={() => onDurationChange(null)}>
                <X className="h-3 w-3" />
                <span className="sr-only">Remove duration filter</span>
              </Button>
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}

