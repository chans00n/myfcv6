export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type WorkoutStatus = 'draft' | 'published' | 'archived'
export type WorkoutDifficulty = 'basic' | 'intermediate' | 'advanced'
export type WorkoutType = 'facial_fitness' | 'cardio' | 'power_flow' | 'sculpt' | 'express' | 'recovery'

export interface Database {
  public: {
    Tables: {
      workouts: {
        Row: {
          id: string
          title: string
          description: string | null
          type: WorkoutType
          difficulty: WorkoutDifficulty
          duration: number
          scheduled_for: string | null
          status: WorkoutStatus
          cover_image: string | null
          created_at: string
          updated_at: string
          created_by: string | null
          published_at: string | null
          visibility: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          type: WorkoutType
          difficulty: WorkoutDifficulty
          duration: number
          scheduled_for?: string | null
          status?: WorkoutStatus
          cover_image?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
          published_at?: string | null
          visibility?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          type?: WorkoutType
          difficulty?: WorkoutDifficulty
          duration?: number
          scheduled_for?: string | null
          status?: WorkoutStatus
          cover_image?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
          published_at?: string | null
          visibility?: string
        }
      }
      workout_content_blocks: {
        Row: {
          id: string
          workout_id: string
          type: string
          content: Json
          order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          workout_id: string
          type: string
          content: Json
          order: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          workout_id?: string
          type?: string
          content?: Json
          order?: number
          created_at?: string
          updated_at?: string
        }
      }
      workout_media: {
        Row: {
          id: string
          workout_id: string
          type: string
          url: string
          thumbnail_url: string | null
          title: string | null
          description: string | null
          order: number | null
          created_at: string
        }
        Insert: {
          id?: string
          workout_id: string
          type: string
          url: string
          thumbnail_url?: string | null
          title?: string | null
          description?: string | null
          order?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          workout_id?: string
          type?: string
          url?: string
          thumbnail_url?: string | null
          title?: string | null
          description?: string | null
          order?: number | null
          created_at?: string
        }
      }
      workout_tags: {
        Row: {
          id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
        }
      }
      workout_to_tags: {
        Row: {
          workout_id: string
          tag_id: string
        }
        Insert: {
          workout_id: string
          tag_id: string
        }
        Update: {
          workout_id?: string
          tag_id?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      workout_status: WorkoutStatus
      workout_difficulty: WorkoutDifficulty
      workout_type: WorkoutType
    }
  }
} 