export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      recipes: {
        Row: {
          id: string
          created_at: string
          title: string
          description: string
          ingredients: Json
          instructions: Json
          cooking_time: number
          temperature: number
          user_id: string
          category: string
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          description: string
          ingredients: Json
          instructions: Json
          cooking_time: number
          temperature: number
          user_id: string
          category: string
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          description?: string
          ingredients?: Json
          instructions?: Json
          cooking_time?: number
          temperature?: number
          user_id?: string
          category?: string
        }
      }
      cooking_journals: {
        Row: {
          id: string
          created_at: string
          recipe_id: string | null
          title: string
          notes: string
          temperature_log: Json[]
          images: string[]
          user_id: string
          status: 'planned' | 'in_progress' | 'completed'
        }
        Insert: {
          id?: string
          created_at?: string
          recipe_id?: string | null
          title: string
          notes: string
          temperature_log?: Json[]
          images?: string[]
          user_id: string
          status: 'planned' | 'in_progress' | 'completed'
        }
        Update: {
          id?: string
          created_at?: string
          recipe_id?: string | null
          title?: string
          notes?: string
          temperature_log?: Json[]
          images?: string[]
          user_id?: string
          status?: 'planned' | 'in_progress' | 'completed'
        }
      }
      profiles: {
        Row: {
          id: string
          created_at: string
          username: string
          full_name: string
          avatar_url: string | null
        }
        Insert: {
          id: string
          created_at?: string
          username: string
          full_name: string
          avatar_url?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          username?: string
          full_name?: string
          avatar_url?: string | null
        }
      }
    }
  }
}