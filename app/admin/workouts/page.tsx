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

export default function AdminWorkoutsPage() {
  const [searchQuery, setSearchQuery] = useState("")

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
              {/* Sample row - will be replaced with real data */}
              <TableRow>
                <TableCell className="font-medium">Sunday Facial Fitness</TableCell>
                <TableCell>Facial Fitness</TableCell>
                <TableCell>15 min</TableCell>
                <TableCell>
                  <Badge variant="outline">Basic</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">Draft</Badge>
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
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Duplicate</DropdownMenuItem>
                      <DropdownMenuItem>Preview</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
} 