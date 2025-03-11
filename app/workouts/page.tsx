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

export default function WorkoutsPage() {
  // In a real app, you would fetch this data from an API
  // and handle week navigation with state management
  const currentWeek = {
    startDate: "March 9, 2025",
    endDate: "March 15, 2025",
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

          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
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
          </div>
        </div>

        <WeeklyWorkoutSchedule />
      </div>
    </>
  )
}

