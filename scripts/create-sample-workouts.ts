import { createWorkouts } from "@/app/actions/workouts"
import type { Database } from "@/types/supabase"

type Workout = Database["public"]["Tables"]["workouts"]["Insert"]
type ContentBlock = {
  id: string
  type: "text" | "image" | "video"
  content: string
  order: number
}

const sampleWorkouts: (Workout & { content_blocks: ContentBlock[] })[] = [
  {
    title: "Morning Facial Awakening",
    description: "Start your day with this energizing facial workout that helps reduce puffiness and promotes circulation.",
    type: "facial_fitness",
    difficulty: "basic",
    duration: 15,
    status: "published",
    visibility: "public",
    content_blocks: [
      {
        id: "1",
        type: "text",
        content: "Begin with gentle tapping motions across your face to stimulate blood flow and reduce morning puffiness. Focus on your cheeks, forehead, and jawline.",
        order: 0
      },
      {
        id: "2",
        type: "text",
        content: "Practice facial yoga poses including the Lion Face and Fish Face to engage and tone facial muscles.",
        order: 1
      }
    ]
  },
  {
    title: "Advanced Cheekbone Sculpting",
    description: "An intensive workout focused on defining and lifting your cheekbones through targeted exercises.",
    type: "facial_fitness",
    difficulty: "advanced",
    duration: 20,
    status: "published",
    visibility: "public",
    content_blocks: [
      {
        id: "3",
        type: "text",
        content: "Begin with resistance training for your cheek muscles using specialized facial exercises.",
        order: 0
      },
      {
        id: "4",
        type: "text",
        content: "Progress to advanced lifting techniques that target the muscles around your cheekbones.",
        order: 1
      }
    ]
  },
  {
    title: "Express Jawline Definition",
    description: "Quick but effective exercises to tone and define your jawline, perfect for busy schedules.",
    type: "express",
    difficulty: "intermediate",
    duration: 10,
    status: "published",
    visibility: "public",
    content_blocks: [
      {
        id: "5",
        type: "text",
        content: "Focus on jaw resistance exercises to strengthen and tone the muscles along your jawline.",
        order: 0
      }
    ]
  },
  {
    title: "Power Flow Face Yoga",
    description: "A dynamic sequence of facial exercises combining traditional yoga principles with facial fitness.",
    type: "power_flow",
    difficulty: "intermediate",
    duration: 25,
    status: "published",
    visibility: "public",
    content_blocks: [
      {
        id: "6",
        type: "text",
        content: "Flow through a series of facial yoga poses designed to engage multiple muscle groups.",
        order: 0
      }
    ]
  },
  {
    title: "Facial Recovery & Relaxation",
    description: "Gentle exercises and massage techniques to help your facial muscles recover and relax.",
    type: "recovery",
    difficulty: "basic",
    duration: 15,
    status: "published",
    visibility: "public",
    content_blocks: [
      {
        id: "7",
        type: "text",
        content: "Begin with gentle massage techniques to release tension in your facial muscles.",
        order: 0
      }
    ]
  },
  {
    title: "Neck & Jawline Sculpt",
    description: "Target the neck and jawline area with specialized exercises for a more defined profile.",
    type: "sculpt",
    difficulty: "intermediate",
    duration: 20,
    status: "published",
    visibility: "public",
    content_blocks: [
      {
        id: "8",
        type: "text",
        content: "Focus on exercises that target the muscles in your neck and along your jawline.",
        order: 0
      }
    ]
  },
  {
    title: "Full Face Cardio Workout",
    description: "An energetic workout that increases blood flow and oxygen to all facial muscles.",
    type: "cardio",
    difficulty: "intermediate",
    duration: 30,
    status: "published",
    visibility: "public",
    content_blocks: [
      {
        id: "9",
        type: "text",
        content: "Engage in rapid facial exercises designed to boost circulation and promote muscle tone.",
        order: 0
      }
    ]
  },
  {
    title: "Advanced Face Sculpting",
    description: "Intensive exercises focusing on precise muscle control for maximum definition.",
    type: "sculpt",
    difficulty: "advanced",
    duration: 35,
    status: "published",
    visibility: "public",
    content_blocks: [
      {
        id: "10",
        type: "text",
        content: "Practice advanced facial exercises that require precise muscle control and engagement.",
        order: 0
      }
    ]
  },
  {
    title: "Quick Morning Lift",
    description: "A rapid sequence of exercises to lift and energize your face in minutes.",
    type: "express",
    difficulty: "basic",
    duration: 8,
    status: "published",
    visibility: "public",
    content_blocks: [
      {
        id: "11",
        type: "text",
        content: "Quick lifting exercises focused on key areas of your face for an instant boost.",
        order: 0
      }
    ]
  },
  {
    title: "Evening Relaxation Flow",
    description: "Gentle exercises and stretches to release facial tension before bed.",
    type: "recovery",
    difficulty: "basic",
    duration: 12,
    status: "published",
    visibility: "public",
    content_blocks: [
      {
        id: "12",
        type: "text",
        content: "Wind down with calming facial exercises and gentle stretches.",
        order: 0
      }
    ]
  },
  {
    title: "Intensive Eye Area Workout",
    description: "Target the delicate muscles around your eyes with specialized exercises.",
    type: "facial_fitness",
    difficulty: "intermediate",
    duration: 15,
    status: "published",
    visibility: "public",
    content_blocks: [
      {
        id: "13",
        type: "text",
        content: "Focus on exercises specifically designed for the muscles around your eyes.",
        order: 0
      }
    ]
  },
  {
    title: "Power Facial HIIT",
    description: "High-intensity interval training adapted for facial muscles.",
    type: "power_flow",
    difficulty: "advanced",
    duration: 25,
    status: "published",
    visibility: "public",
    content_blocks: [
      {
        id: "14",
        type: "text",
        content: "Alternate between intense facial exercises and short recovery periods.",
        order: 0
      }
    ]
  },
  {
    title: "Lymphatic Drainage Flow",
    description: "Gentle movements to promote lymphatic drainage and reduce facial puffiness.",
    type: "recovery",
    difficulty: "basic",
    duration: 20,
    status: "published",
    visibility: "public",
    content_blocks: [
      {
        id: "15",
        type: "text",
        content: "Learn proper techniques for facial lymphatic drainage massage.",
        order: 0
      }
    ]
  },
  {
    title: "Advanced Face Yoga Flow",
    description: "Complex sequences combining multiple facial yoga poses for comprehensive toning.",
    type: "power_flow",
    difficulty: "advanced",
    duration: 40,
    status: "published",
    visibility: "public",
    content_blocks: [
      {
        id: "16",
        type: "text",
        content: "Flow through advanced facial yoga poses with proper form and technique.",
        order: 0
      }
    ]
  },
  {
    title: "Express Facial Refresh",
    description: "Quick exercises to instantly refresh and rejuvenate your face.",
    type: "express",
    difficulty: "basic",
    duration: 5,
    status: "published",
    visibility: "public",
    content_blocks: [
      {
        id: "17",
        type: "text",
        content: "Rapid exercises designed to give your face an instant lift and refresh.",
        order: 0
      }
    ]
  }
]

export async function createSampleWorkouts() {
  try {
    await createWorkouts(sampleWorkouts)
    console.log("Successfully created sample workouts!")
  } catch (error) {
    console.error("Failed to create sample workouts:", error)
  }
} 