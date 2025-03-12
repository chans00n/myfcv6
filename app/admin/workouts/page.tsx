"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Plus, Upload, Download } from "lucide-react"
import Link from "next/link"
import { getWorkouts, deleteWorkout, publishWorkout, unpublishWorkout } from "@/app/actions/workouts"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { WorkoutStatus, WorkoutType, WorkoutDifficulty } from "@/types/supabase"

export default function AdminWorkoutsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  const [workouts, setWorkouts] = useState<Awaited<ReturnType<typeof getWorkouts>>>([])

  // Fetch workouts on mount
  useState(() => {
    getWorkouts().then(setWorkouts)
  })

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this workout?")) {
      await deleteWorkout(id)
      router.refresh()
    }
  }

  const handlePublish = async (id: string) => {
    await publishWorkout(id)
    router.refresh()
  }

  const handleUnpublish = async (id: string) => {
    await unpublishWorkout(id)
    router.refresh()
  }

  const filteredWorkouts = workouts?.filter((workout) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      workout.title.toLowerCase().includes(query) ||
      workout.description?.toLowerCase().includes(query) ||
      workout.type.toLowerCase().includes(query)
    )
  })

  const getDifficultyVariant = (difficulty: WorkoutDifficulty) => {
    switch (difficulty) {
      case "basic":
        return "outline"
      case "intermediate":
        return "secondary"
      case "advanced":
        return "default"
      default:
        return "outline"
    }
  }

  const getStatusVariant = (status: WorkoutStatus) => {
    switch (status) {
      case "draft":
        return "secondary"
      case "published":
        return "default"
      case "archived":
        return "outline"
      default:
        return "outline"
    }
  }

  return (
    <div className="flex flex-col h-full">
      <header className="border-b">
        <div className="container flex items-center justify-between gap-4 py-4">
          <div>
            <h1 className="text-lg font-semibold">Manage Workouts</h1>
            <p className="text-sm text-muted-foreground">
              Create and manage workout content
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button size="sm" asChild>
              <Link href="/admin/workouts/new">
                <Plus className="h-4 w-4 mr-2" />
                New Workout
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 container py-6">
        <div className="flex items-center justify-between mb-6">
          <Input
            placeholder="Search workouts..."
            className="max-w-xs"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWorkouts?.map((workout) => (
                <TableRow key={workout.id}>
                  <TableCell className="font-medium">{workout.title}</TableCell>
                  <TableCell>{workout.type}</TableCell>
                  <TableCell>{workout.duration} min</TableCell>
                  <TableCell>
                    <Badge variant={getDifficultyVariant(workout.difficulty)}>
                      {workout.difficulty}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(workout.status)}>
                      {workout.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => router.push(`/admin/workouts/${workout.id}`)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>Duplicate</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push(`/workouts/${workout.id}`)}>
                          Preview
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {workout.status === "published" ? (
                          <DropdownMenuItem onClick={() => handleUnpublish(workout.id)}>
                            Unpublish
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => handlePublish(workout.id)}>
                            Publish
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDelete(workout.id)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
} 