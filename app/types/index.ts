export interface Workout {
  id: string
  title: string
  description: string
  type: string
  duration: number
  difficulty: "beginner" | "intermediate" | "advanced"
  equipment: string[]
  instructor: string
  thumbnail: string
  videoUrl: string
  publishedDate: string
  date: string
  views: number
  likes: number
  isFavorite: boolean
}

export interface Movement {
  id: string
  title: string
  description: string
  category: string
  equipment: string[]
  instructor: string
  thumbnail: string
  videoUrl: string
  dateAdded: string
  views: number
  likes: number
  isFavorite: boolean
} 