import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { createWorkout, updateWorkout } from "@/app/actions/workouts"
import { Database } from "@/types/supabase"

type Workout = Database["public"]["Tables"]["workouts"]["Row"]
type WorkoutType = Database["public"]["Enums"]["workout_type"]
type WorkoutDifficulty = Database["public"]["Enums"]["workout_difficulty"]

const workoutSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  type: z.custom<WorkoutType>(),
  difficulty: z.custom<WorkoutDifficulty>(),
  duration: z.number().min(1, "Duration must be at least 1 minute"),
  cover_image: z.string().optional(),
})

type WorkoutFormValues = z.infer<typeof workoutSchema>

interface WorkoutFormProps {
  workout?: Workout
}

export function WorkoutForm({ workout }: WorkoutFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<WorkoutFormValues>({
    resolver: zodResolver(workoutSchema),
    defaultValues: {
      title: workout?.title || "",
      description: workout?.description || "",
      type: workout?.type || "facial_fitness",
      difficulty: workout?.difficulty || "basic",
      duration: workout?.duration || 30,
      cover_image: workout?.cover_image || "",
    },
  })

  async function onSubmit(data: WorkoutFormValues) {
    try {
      setIsLoading(true)
      if (workout) {
        await updateWorkout(workout.id, data)
      } else {
        await createWorkout(data)
      }
      router.push("/admin/workouts")
      router.refresh()
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter workout title" {...field} />
              </FormControl>
              <FormDescription>
                A clear and descriptive title for the workout.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter workout description"
                  {...field}
                  rows={4}
                />
              </FormControl>
              <FormDescription>
                A detailed description of the workout and its benefits.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select workout type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="facial_fitness">Facial Fitness</SelectItem>
                    <SelectItem value="cardio">Cardio</SelectItem>
                    <SelectItem value="power_flow">Power Flow</SelectItem>
                    <SelectItem value="sculpt">Sculpt</SelectItem>
                    <SelectItem value="express">Express</SelectItem>
                    <SelectItem value="recovery">Recovery</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  The primary focus of this workout.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="difficulty"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Difficulty</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  The skill level required for this workout.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duration (minutes)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormDescription>
                The estimated time to complete this workout.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cover_image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover Image URL</FormLabel>
              <FormControl>
                <Input placeholder="Enter cover image URL" {...field} />
              </FormControl>
              <FormDescription>
                A URL to an image that represents this workout.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/workouts")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : workout ? "Update Workout" : "Create Workout"}
          </Button>
        </div>
      </form>
    </Form>
  )
} 