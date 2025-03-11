"use client"

import { WorkoutCarousel } from "@/components/workout-carousel"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { useSidebarContext } from "@/components/sidebar-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronRight, Home } from "lucide-react"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@/components/ui/breadcrumb"
import { MonthlyProgressChart } from "@/components/monthly-progress-chart"
import { StreakCounter } from "@/components/streak-counter"
import { RecentActivity } from "@/components/recent-activity"
import { GoalProgress } from "@/components/goal-progress"
import { FacialAreaFocus } from "@/components/facial-area-focus"
import { InspirationalQuote } from "@/components/inspirational-quote"

export default function DashboardPage() {
  const { isOpen } = useSidebarContext()

  return (
    <SidebarProvider defaultOpen={isOpen}>
      <AppSidebar />
      <SidebarInset className="sidebar-inset mobile-nav-padding">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4 w-full">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard">
                    <Home className="h-4 w-4 mr-1" />
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex-1 overflow-auto">
          <div className="w-full max-w-[100vw] overflow-x-hidden px-4 pt-6 md:px-6 md:pt-6">
            <div className="mb-8">
              <h1 className="text-2xl font-bold mb-2">Welcome back, Chris</h1>
              <p className="text-muted-foreground">Your facial fitness journey at a glance</p>
            </div>

            {/* Featured Workouts Carousel */}
            <section className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Featured Workouts</h2>
                <Button variant="ghost" size="sm" asChild>
                  <a href="/workouts" className="flex items-center">
                    View all <ChevronRight className="ml-1 h-4 w-4" />
                  </a>
                </Button>
              </div>
              <WorkoutCarousel />
            </section>

            {/* Quick Stats */}

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Left Column - Progress Tracking */}

              {/* Right Column - Streak and Activity */}
              <div className="space-y-6">
                {/* Streak Counter */}
                <Card>
                  <CardHeader>
                    <CardTitle>Workout Streak</CardTitle>
                    <CardDescription>Keep your streak going!</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <StreakCounter />
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Your latest workouts</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RecentActivity />
                  </CardContent>
                </Card>

                {/* Goals */}
                <Card>
                  <CardHeader>
                    <CardTitle>Goals & Achievements</CardTitle>
                    <CardDescription>Your progress towards goals</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <GoalProgress />
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-2 space-y-6">
                {/* Monthly Progress Chart - REPLACED THE OLD PROGRESS CHART */}
                <MonthlyProgressChart />

                {/* Facial Area Focus */}
                <Card>
                  <CardHeader>
                    <CardTitle>Facial Area Focus</CardTitle>
                    <CardDescription>Areas you've been working on this month</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FacialAreaFocus />
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Inspirational Quote */}
            <section className="mb-8">
              <InspirationalQuote />
            </section>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

