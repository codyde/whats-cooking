export interface Recipe {
  id: string
  title: string
  description: string
  image: string | null
  ingredients: string[]
  instructions: string[]
  cooking_time: number
  temperature: number
  category: string
  status: 'draft' | 'published'
  created_at: string
  user_id: string
}

export type RecipeFormData = Omit<Recipe, 'id' | 'created_at' | 'user_id'>