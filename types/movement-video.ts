export interface MovementVideo {
  id: string
  title: string
  description: string
  thumbnailUrl: string
  videoUrl: string
  category: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  instructor: string
  durationSeconds: number
  views: number
  dateAdded: string
}

